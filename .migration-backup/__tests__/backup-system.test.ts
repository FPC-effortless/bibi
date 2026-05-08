/**
 * Backup System Tests - Test automated backup system functionality
 */

import { BackupManager, defaultBackupConfig } from '@/lib/backup-manager';
import { BackupService, defaultBackupServiceConfig } from '@/lib/backup-service';

describe('Backup System', () => {
  let backupManager: BackupManager;
  let backupService: BackupService;

  beforeEach(() => {
    backupManager = new BackupManager(defaultBackupConfig);
    backupService = new BackupService(defaultBackupConfig, defaultBackupServiceConfig);
  });

  describe('BackupManager', () => {
    it('should create daily backup job', async () => {
      const jobId = await backupManager.createDailyBackupJob('test-backup');
      expect(jobId).toBeDefined();
      expect(jobId).toMatch(/^backup-\d+$/);
    });

    it('should execute backup with metadata', async () => {
      const jobId = await backupManager.createDailyBackupJob('test-backup');
      const metadata = await backupManager.executeBackup(jobId);
      
      expect(metadata).toBeDefined();
      expect(metadata.id).toBeDefined();
      expect(metadata.timestamp).toBeInstanceOf(Date);
      expect(metadata.type).toBe('full');
      expect(metadata.status).toBe('completed');
      expect(metadata.size).toBeGreaterThan(0);
      expect(metadata.checksum).toBeDefined();
      expect(metadata.location).toBeDefined();
    });

    it('should verify backup integrity', async () => {
      const jobId = await backupManager.createDailyBackupJob('test-backup');
      const metadata = await backupManager.executeBackup(jobId);
      
      const isValid = await backupManager.verifyBackupIntegrity(metadata);
      expect(isValid).toBe(true);
      expect(metadata.status).toBe('verified');
    });

    it('should handle point-in-time recovery', async () => {
      const jobId = await backupManager.createDailyBackupJob('test-backup');
      const metadata = await backupManager.executeBackup(jobId);
      
      await expect(
        backupManager.restoreFromBackup({
          backupId: metadata.id,
          pointInTime: new Date(),
          verifyIntegrity: true,
          dryRun: true
        })
      ).resolves.not.toThrow();
    });

    it('should calculate retention dates correctly', async () => {
      const jobId = await backupManager.createDailyBackupJob('test-backup');
      const metadata = await backupManager.executeBackup(jobId);
      
      const now = new Date();
      const retentionDate = metadata.retention;
      
      expect(retentionDate).toBeInstanceOf(Date);
      expect(retentionDate.getTime()).toBeGreaterThan(now.getTime());
    });

    it('should prevent concurrent backup execution', async () => {
      const jobId = await backupManager.createDailyBackupJob('test-backup');
      
      // Start first backup
      const firstBackup = backupManager.executeBackup(jobId);
      
      // Try to start second backup while first is running
      await expect(backupManager.executeBackup(jobId))
        .rejects.toThrow('is already running');
      
      // Wait for first backup to complete
      await firstBackup;
    });
  });

  describe('BackupService', () => {
    it('should initialize with scheduled jobs', async () => {
      await expect(backupService.initialize()).resolves.not.toThrow();
    });

    it('should execute manual backup', async () => {
      await backupService.initialize();
      
      const metadata = await backupService.executeManualBackup('daily');
      expect(metadata).toBeDefined();
      expect(metadata.tags.automated).toBe('true');
    });

    it('should get service status', async () => {
      await backupService.initialize();
      
      const status = await backupService.getStatus();
      expect(status).toBeDefined();
      expect(typeof status.isHealthy).toBe('boolean');
      expect(typeof status.consecutiveFailures).toBe('number');
      expect(typeof status.totalBackups).toBe('number');
      expect(typeof status.totalSize).toBe('number');
      expect(Array.isArray(status.issues)).toBe(true);
    });

    it('should handle restore operations', async () => {
      await backupService.initialize();
      
      // Execute a backup first
      const metadata = await backupService.executeManualBackup('daily');
      
      // Test dry run restore
      await expect(
        backupService.restoreFromBackup(metadata.id, undefined, true)
      ).resolves.not.toThrow();
    });

    it('should detect health issues', async () => {
      // Create service with strict thresholds
      const strictConfig = {
        ...defaultBackupServiceConfig,
        monitoring: {
          healthCheckInterval: 1,
          alertThresholds: {
            failureCount: 1,
            maxBackupAge: 1 // 1 hour
          }
        }
      };
      
      const strictService = new BackupService(defaultBackupConfig, strictConfig);
      await strictService.initialize();
      
      const status = await strictService.getStatus();
      
      // Should detect that no recent backups exist
      expect(status.issues.length).toBeGreaterThan(0);
      expect(status.isHealthy).toBe(false);
    });

    it('should shutdown cleanly', async () => {
      await backupService.initialize();
      await expect(backupService.shutdown()).resolves.not.toThrow();
    });
  });

  describe('Backup Configuration', () => {
    it('should use default configuration', () => {
      expect(defaultBackupConfig.retention.daily).toBe(7);
      expect(defaultBackupConfig.retention.weekly).toBe(4);
      expect(defaultBackupConfig.retention.monthly).toBe(12);
      expect(defaultBackupConfig.verification.enabled).toBe(true);
      expect(defaultBackupConfig.compression.enabled).toBe(true);
    });

    it('should use default service configuration', () => {
      expect(defaultBackupServiceConfig.enabled).toBe(true);
      expect(defaultBackupServiceConfig.schedules.daily).toBe('0 2 * * *');
      expect(defaultBackupServiceConfig.notifications.onFailure).toBe(true);
      expect(defaultBackupServiceConfig.monitoring.alertThresholds.failureCount).toBe(3);
    });
  });

  describe('Error Handling', () => {
    it('should handle backup job not found', async () => {
      await expect(backupManager.executeBackup('non-existent-job'))
        .rejects.toThrow('not found');
    });

    it('should handle restore with invalid backup ID', async () => {
      await expect(
        backupManager.restoreFromBackup({
          backupId: 'invalid-backup-id',
          verifyIntegrity: true,
          dryRun: false
        })
      ).rejects.toThrow('not found');
    });

    it('should handle service initialization errors gracefully', async () => {
      const invalidConfig = {
        ...defaultBackupServiceConfig,
        enabled: false
      };
      
      const service = new BackupService(defaultBackupConfig, invalidConfig);
      await service.initialize();
      
      // Should not throw when disabled
      expect(true).toBe(true);
    });
  });
});