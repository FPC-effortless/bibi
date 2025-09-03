/**
 * Disaster Recovery API - Manage disaster recovery operations and status
 */

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { DisasterRecoveryManager, defaultDisasterRecoveryConfig } from '@/lib/disaster-recovery';

// Initialize disaster recovery manager (in production, this would be a singleton)
const drManager = new DisasterRecoveryManager(defaultDisasterRecoveryConfig);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'status') {
      // Get disaster recovery status
      const status = await drManager.getStatus();
      
      return NextResponse.json({
        success: true,
        data: status,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'plans') {
      // Get failover plans (would be implemented in the manager)
      return NextResponse.json({
        success: true,
        data: {
          plans: [
            {
              id: 'primary-failover',
              name: 'Primary Site Failover',
              estimatedRTO: 15,
              estimatedRPO: 5,
              lastTested: null
            }
          ]
        }
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action. Supported actions: status, plans'
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Failed to get disaster recovery information:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve disaster recovery information',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, planId, targetSiteId, reason, dryRun } = body;

    if (action === 'failover') {
      // Trigger failover
      if (!reason) {
        return NextResponse.json(
          {
            success: false,
            error: 'Reason is required for failover operation'
          },
          { status: 400 }
        );
      }

      await drManager.triggerFailover(reason, targetSiteId);
      
      return NextResponse.json({
        success: true,
        message: `Failover initiated successfully. Reason: ${reason}`,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'rollback') {
      // Execute rollback
      if (!reason) {
        return NextResponse.json(
          {
            success: false,
            error: 'Reason is required for rollback operation'
          },
          { status: 400 }
        );
      }

      await drManager.executeRollback(reason);
      
      return NextResponse.json({
        success: true,
        message: `Rollback completed successfully. Reason: ${reason}`,
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'test') {
      // Test disaster recovery procedures
      if (!planId) {
        return NextResponse.json(
          {
            success: false,
            error: 'Plan ID is required for testing'
          },
          { status: 400 }
        );
      }

      const testResult = await drManager.testDisasterRecovery(planId, dryRun !== false);
      
      return NextResponse.json({
        success: true,
        data: testResult,
        message: dryRun !== false 
          ? 'Disaster recovery test simulation completed'
          : 'Disaster recovery test completed'
      });
    }

    if (action === 'initialize') {
      // Initialize disaster recovery system
      await drManager.initialize();
      
      return NextResponse.json({
        success: true,
        message: 'Disaster recovery system initialized successfully'
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action. Supported actions: failover, rollback, test, initialize'
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Disaster recovery operation failed:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Disaster recovery operation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}