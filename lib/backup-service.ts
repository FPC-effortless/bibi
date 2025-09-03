/**
 * Backup Service - Handles automated backup scheduling and execution
 * Provides high-level backup operations and monitoring
 */

import { BackupManager, BackupConfig, BackupMetadata, defaultBackupConfig } from './backup-manager';

export interface BackupServiceConfig {
  enabled: boolean;
  schedules: {
    daily: string;
    weekly: string;
    monthly: string;
  };
  notifications: {
    onSuccess: boolean;
    onFailure: boolean;
    webhookUrl?: string;
    emailRecipients?: string[];
  };
  monitoring: {
    healthCheckInterval: number; // minutes
    alertThresholds: {
      failureCount: number;
      maxBackupAge: number; // hours
    };
  };
}

export interface BackupStatus {
  isHealthy: boolean;
  lastSuccessfulBackup?: Date;
  lastFailedBackup?: Date;
  consecutiveFailures: number;
  totalBackups: number;
  totalSize: number;
  nextScheduledBackup?: Date;
  issues: string[];
}

export class BackupService {
  private backupManager: BackupManager;
  private config: BackupServiceConfig;
  private jobIds: Map<string, string> = new Map();
  private healthCheckInterval?: NodeJS.Timeout;

  constructor(
    backupConfig: BackupConfig = defaultBackupConfig,
    serviceConfig: BackupServiceConfig
  ) {
    this.backupManager = new BackupManager(backupConfig);
    this.config = serviceConfig;
  }

  /**
   * Initialize backup service and start scheduled jobs
   */
  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      console.log('Backup service is disabled');
      return;
    }

    try {
      // Create scheduled backup jobs
      await this.createScheduledJobs();
      
      // Start health monitoring
      this.startHealthMonitoring();
      
      console.log('Backup service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize backup service:', error);
      throw error;
    }
  }

  /**
   * Create all scheduled backup jobs
   */
  private async createScheduledJobs(): Promise<void> {
    // Daily backup job
    const dailyJobId = await this.backupManager.createDailyBackupJob(
      'daily-backup',
      this.config.schedules.daily
    );
    this.jobIds.set('daily', dailyJobId);

    // Weekly backup job
    const weeklyJobId = await this.backupManager.createDailyBackupJob(
      'weekly-backup',
      this.config.schedules.weekly
    );
    this.jobIds.set('weekly', weeklyJobId);

    // Monthly backup job
    const monthlyJobId = await this.backupManager.createDailyBackupJob(
      'monthly-backup',
      this.config.schedules.monthly
    );
    this.jobIds.set('monthly', monthlyJobId);
  }

  /**
   * Execute manual backup
   */
  async executeManualBackup(type: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<BackupMetadata> {
    const jobId = this.jobIds.get(type);
    if (!jobId) {
      throw new Error(`No ${type} backup job found`);
    }

    try {
      const metadata = await this.backupManager.executeBackup(jobId);
      
      if (this.config.notifications.onSuccess) {
        await this.sendNotification('success', metadata);
      }
      
      return metadata;
    } catch (error) {
      if (this.config.notifications.onFailure) {
        await this.sendNotification('failure', null, error instanceof Error ? error.message : String(error));
      }
      throw error;
    }
  }

  /**
   * Get backup service status and health
   */
  async getStatus(): Promise<BackupStatus> {
    const backups = await this.backupManager.getBackupHistory(100);
    
    const successfulBackups = backups.filter(b => b.status === 'completed' || b.status === 'verified');
    const failedBackups = backups.filter(b => b.status === 'failed');
    
    const lastSuccessful = successfulBackups.length > 0 
      ? successfulBackups[0].timestamp 
      : undefined;
    
    const lastFailed = failedBackups.length > 0 
      ? failedBackups[0].timestamp 
      : undefined;

    // Calculate consecutive failures
    let consecutiveFailures = 0;
    for (const backup of backups) {
      if (backup.status === 'failed') {
        consecutiveFailures++;
      } else if (backup.status === 'completed' || backup.status === 'verified') {
        break;
      }
    }

    // Check for issues
    const issues: string[] = [];
    const now = new Date();
    
    if (lastSuccessful) {
      const hoursSinceLastBackup = (now.getTime() - lastSuccessful.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastBackup > this.config.monitoring.alertThresholds.maxBackupAge) {
        issues.push(`Last successful backup was ${Math.floor(hoursSinceLastBackup)} hours ago`);
      }
    } else {
      issues.push('No successful backups found');
    }

    if (consecutiveFailures >= this.config.monitoring.alertThresholds.failureCount) {
      issues.push(`${consecutiveFailures} consecutive backup failures`);
    }

    const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);

    return {
      isHealthy: issues.length === 0,
      lastSuccessfulBackup: lastSuccessful,
      lastFailedBackup: lastFailed,
      consecutiveFailures,
      totalBackups: backups.length,
      totalSize,
      issues
    };
  }

  /**
   * Restore from backup with point-in-time recovery
   */
  async restoreFromBackup(backupId: string, pointInTime?: Date, dryRun: boolean = false): Promise<void> {
    try {
      await this.backupManager.restoreFromBackup({
        backupId,
        pointInTime,
        verifyIntegrity: true,
        dryRun
      });

      if (!dryRun) {
        await this.sendNotification('restore-success', null, `Restored from backup ${backupId}`);
      }
    } catch (error) {
      await this.sendNotification('restore-failure', null, `Restore failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Start health monitoring
   */
  private startHealthMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      try {
        const status = await this.getStatus();
        
        if (!status.isHealthy) {
          console.warn('Backup service health check failed:', status.issues);
          
          if (this.config.notifications.onFailure) {
            await this.sendNotification('health-check-failure', null, status.issues.join(', '));
          }
        }
      } catch (error) {
        console.error('Health check failed:', error);
      }
    }, this.config.monitoring.healthCheckInterval * 60 * 1000);
  }

  /**
   * Send notification about backup events
   */
  private async sendNotification(
    type: 'success' | 'failure' | 'restore-success' | 'restore-failure' | 'health-check-failure',
    metadata?: BackupMetadata | null,
    message?: string
  ): Promise<void> {
    const notification = {
      type,
      timestamp: new Date(),
      metadata,
      message,
      service: 'backup-service'
    };

    // Send webhook notification
    if (this.config.notifications.webhookUrl) {
      try {
        await fetch(this.config.notifications.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notification)
        });
      } catch (error) {
        console.error('Failed to send webhook notification:', error);
      }
    }

    // Log notification
    console.log(`Backup notification [${type}]:`, message || 'No message');
  }

  /**
   * Stop backup service and cleanup
   */
  async shutdown(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    console.log('Backup service shutdown complete');
  }
}

/**
 * Default backup service configuration
 */
export const defaultBackupServiceConfig: BackupServiceConfig = {
  enabled: true,
  schedules: {
    daily: '0 2 * * *',    // 2 AM daily
    weekly: '0 3 * * 0',   // 3 AM on Sundays
    monthly: '0 4 1 * *'   // 4 AM on 1st of month
  },
  notifications: {
    onSuccess: false,
    onFailure: true
  },
  monitoring: {
    healthCheckInterval: 60, // 1 hour
    alertThresholds: {
      failureCount: 3,
      maxBackupAge: 48 // 48 hours
    }
  }
};