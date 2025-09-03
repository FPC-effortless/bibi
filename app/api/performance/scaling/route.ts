import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { autoScalingManager } from '@/lib/auto-scaling-manager';
import { performanceBottleneckDetector } from '@/lib/performance-bottleneck-detector';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'status';

    switch (action) {
      case 'status':
        const status = autoScalingManager.getStatus();
        const performanceSummary = performanceBottleneckDetector.getPerformanceSummary();
        
        return NextResponse.json({
          scaling: status,
          performance: performanceSummary
        });

      case 'recommendations':
        const recommendations = autoScalingManager.getScalingRecommendations();
        return NextResponse.json({ recommendations });

      case 'history':
        const limit = parseInt(searchParams.get('limit') || '50');
        const history = autoScalingManager.getScalingHistory(limit);
        return NextResponse.json({ history });

      case 'rules':
        const rules = autoScalingManager.getScalingRules();
        return NextResponse.json({ rules });

      case 'alerts':
        const hours = parseInt(searchParams.get('hours') || '24');
        const alerts = performanceBottleneckDetector.getActiveAlerts();
        return NextResponse.json({ alerts });

      case 'analysis':
        const timeRange = parseInt(searchParams.get('timeRange') || '3600000'); // 1 hour default
        const analysis = performanceBottleneckDetector.performBottleneckAnalysis(timeRange);
        return NextResponse.json({ analysis });

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Scaling API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve scaling information' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'evaluate':
        // Evaluate scaling decision based on provided metrics
        if (!data.metrics) {
          return NextResponse.json(
            { error: 'Metrics data required for evaluation' },
            { status: 400 }
          );
        }

        const decision = autoScalingManager.evaluateScaling(data.metrics);
        
        // Also analyze for bottlenecks
        const bottleneckAlerts = performanceBottleneckDetector.analyzePerformance({
          timestamp: new Date(),
          metrics: data.metrics
        });

        return NextResponse.json({
          decision,
          bottleneckAlerts
        });

      case 'execute':
        // Execute scaling action
        if (!data.decision) {
          return NextResponse.json(
            { error: 'Scaling decision required for execution' },
            { status: 400 }
          );
        }

        const scalingAction = await autoScalingManager.executeScaling(data.decision);
        return NextResponse.json({ scalingAction });

      case 'add_rule':
        // Add new scaling rule
        if (!data.rule) {
          return NextResponse.json(
            { error: 'Rule data required' },
            { status: 400 }
          );
        }

        autoScalingManager.addScalingRule(data.rule);
        return NextResponse.json({ 
          message: 'Scaling rule added successfully',
          ruleId: data.rule.id 
        });

      case 'update_rule':
        // Update existing scaling rule
        if (!data.ruleId || !data.updates) {
          return NextResponse.json(
            { error: 'Rule ID and updates required' },
            { status: 400 }
          );
        }

        const updated = autoScalingManager.updateScalingRule(data.ruleId, data.updates);
        if (!updated) {
          return NextResponse.json(
            { error: 'Rule not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({ message: 'Scaling rule updated successfully' });

      case 'remove_rule':
        // Remove scaling rule
        if (!data.ruleId) {
          return NextResponse.json(
            { error: 'Rule ID required' },
            { status: 400 }
          );
        }

        const removed = autoScalingManager.removeScalingRule(data.ruleId);
        if (!removed) {
          return NextResponse.json(
            { error: 'Rule not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({ message: 'Scaling rule removed successfully' });

      case 'update_config':
        // Update scaling configuration
        if (!data.config) {
          return NextResponse.json(
            { error: 'Configuration data required' },
            { status: 400 }
          );
        }

        autoScalingManager.updateConfiguration(data.config);
        return NextResponse.json({ message: 'Configuration updated successfully' });

      case 'resolve_alert':
        // Resolve performance alert
        if (!data.alertId) {
          return NextResponse.json(
            { error: 'Alert ID required' },
            { status: 400 }
          );
        }

        performanceBottleneckDetector.resolveAlert(data.alertId);
        return NextResponse.json({ message: 'Alert resolved successfully' });

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Scaling action error:', error);
    return NextResponse.json(
      { error: 'Failed to execute scaling action' },
      { status: 500 }
    );
  }
}