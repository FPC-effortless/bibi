/**
 * Backup Status API - Get backup service status and health information
 */

import { NextRequest, NextResponse } from 'next/server';
import { BackupService, defaultBackupServiceConfig } from '@/lib/backup-service';
import { defaultBackupConfig } from '@/lib/backup-manager';

// Initialize backup service (in production, this would be a singleton)
const backupService = new BackupService(defaultBackupConfig, defaultBackupServiceConfig);

export async function GET(request: NextRequest) {
  try {
    // Get backup service status
    const status = await backupService.getStatus();
    
    return NextResponse.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to get backup status:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve backup status',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, type } = body;

    if (action === 'execute') {
      // Execute manual backup
      const backupType = type || 'daily';
      const metadata = await backupService.executeManualBackup(backupType);
      
      return NextResponse.json({
        success: true,
        data: metadata,
        message: `${backupType} backup executed successfully`
      });
    }

    if (action === 'restore') {
      const { backupId, pointInTime, dryRun } = body;
      
      if (!backupId) {
        return NextResponse.json(
          {
            success: false,
            error: 'Backup ID is required for restore operation'
          },
          { status: 400 }
        );
      }

      await backupService.restoreFromBackup(
        backupId,
        pointInTime ? new Date(pointInTime) : undefined,
        dryRun || false
      );
      
      return NextResponse.json({
        success: true,
        message: dryRun 
          ? `Dry run restore from backup ${backupId} completed`
          : `Restore from backup ${backupId} completed successfully`
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action. Supported actions: execute, restore'
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Backup operation failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Backup operation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}