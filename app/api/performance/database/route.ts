import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { dbPerformanceMonitor } from '@/lib/database-performance-monitor';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'report';
    const limit = parseInt(searchParams.get('limit') || '20');
    const hours = parseInt(searchParams.get('hours') || '24');

    switch (action) {
      case 'report':
        const report = dbPerformanceMonitor.generatePerformanceReport();
        return NextResponse.json(report);

      case 'stats':
        const stats = dbPerformanceMonitor.getQueryStats(limit);
        return NextResponse.json({ stats });

      case 'slowest':
        const slowest = dbPerformanceMonitor.getSlowestQueries(limit);
        return NextResponse.json({ slowest });

      case 'frequent':
        const frequent = dbPerformanceMonitor.getMostFrequentQueries(limit);
        return NextResponse.json({ frequent });

      case 'errors':
        const errors = dbPerformanceMonitor.getQueriesWithErrors(limit);
        return NextResponse.json({ errors });

      case 'alerts':
        const alerts = dbPerformanceMonitor.getRecentAlerts(hours);
        return NextResponse.json({ alerts });

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Database performance monitoring error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve database performance data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    switch (action) {
      case 'cleanup':
        const hours = 24; // Clean up data older than 24 hours
        dbPerformanceMonitor.cleanup(hours);
        return NextResponse.json({ 
          message: `Cleaned up database performance data older than ${hours} hours` 
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Database performance action error:', error);
    return NextResponse.json(
      { error: 'Failed to execute database performance action' },
      { status: 500 }
    );
  }
}