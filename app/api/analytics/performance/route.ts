/**
 * Performance Analytics API Endpoint
 * Collects and processes performance metrics from the client
 */

import { NextRequest, NextResponse } from 'next/server';

interface PerformanceMetric {
  type: 'web_vital' | 'custom_metric' | 'user_experience' | 'error';
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  sessionId: string;
  timestamp: string;
  url: string;
  userAgent?: string;
  userId?: string;
  additionalData?: Record<string, any>;
}

interface PerformanceReport {
  metrics: PerformanceMetric[];
  sessionInfo: {
    sessionId: string;
    userId?: string;
    userAgent: string;
    viewport: string;
    connection: string;
    timestamp: string;
  };
}

// In-memory storage for development (replace with database in production)
const performanceMetrics: PerformanceMetric[] = [];
const performanceReports: PerformanceReport[] = [];

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate the incoming data
    if (!data.type || !data.name || typeof data.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid performance metric data' },
        { status: 400 }
      );
    }

    // Add server-side metadata
    const metric: PerformanceMetric = {
      ...data,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    // Store the metric (in production, save to database)
    performanceMetrics.push(metric);

    // Log performance issues
    if (data.type === 'web_vital' && data.rating === 'poor') {
      console.warn(`🚨 Poor Web Vital detected: ${data.name} = ${data.value}ms on ${data.url}`);
    }

    // Trigger alerts for critical performance issues
    await checkPerformanceThresholds(metric);

    return NextResponse.json({ success: true, id: metric.sessionId });
  } catch (error) {
    console.error('Error processing performance metric:', error);
    return NextResponse.json(
      { error: 'Failed to process performance metric' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '100');

    let filteredMetrics = performanceMetrics;

    // Filter by session ID
    if (sessionId) {
      filteredMetrics = filteredMetrics.filter(m => m.sessionId === sessionId);
    }

    // Filter by type
    if (type) {
      filteredMetrics = filteredMetrics.filter(m => m.type === type);
    }

    // Limit results
    filteredMetrics = filteredMetrics.slice(-limit);

    // Calculate aggregated metrics
    const aggregatedMetrics = calculateAggregatedMetrics(filteredMetrics);

    return NextResponse.json({
      metrics: filteredMetrics,
      aggregated: aggregatedMetrics,
      total: filteredMetrics.length,
    });
  } catch (error) {
    console.error('Error retrieving performance metrics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve performance metrics' },
      { status: 500 }
    );
  }
}

async function checkPerformanceThresholds(metric: PerformanceMetric): Promise<void> {
  const thresholds = {
    LCP: 2500, // Largest Contentful Paint
    FID: 100,  // First Input Delay
    CLS: 0.1,  // Cumulative Layout Shift
    FCP: 1800, // First Contentful Paint
    TTFB: 600, // Time to First Byte
  };

  if (metric.type === 'web_vital' && metric.name in thresholds) {
    const threshold = thresholds[metric.name as keyof typeof thresholds];
    
    if (metric.value > threshold) {
      // In production, send alerts to monitoring service
      console.warn(`⚠️ Performance threshold exceeded: ${metric.name} = ${metric.value}ms (threshold: ${threshold}ms)`);
      
      // You could integrate with services like:
      // - Slack notifications
      // - Email alerts
      // - PagerDuty
      // - Custom monitoring dashboard
    }
  }
}

function calculateAggregatedMetrics(metrics: PerformanceMetric[]) {
  const webVitals = metrics.filter(m => m.type === 'web_vital');
  const customMetrics = metrics.filter(m => m.type === 'custom_metric');

  const aggregated: Record<string, any> = {
    webVitals: {},
    customMetrics: {},
    summary: {
      totalMetrics: metrics.length,
      sessionsCount: Array.from(new Set(metrics.map(m => m.sessionId))).length,
      timeRange: {
        start: metrics.length > 0 ? metrics[0].timestamp : null,
        end: metrics.length > 0 ? metrics[metrics.length - 1].timestamp : null,
      },
    },
  };

  // Aggregate Web Vitals
  const webVitalNames = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
  webVitalNames.forEach(name => {
    const values = webVitals.filter(m => m.name === name).map(m => m.value);
    if (values.length > 0) {
      aggregated.webVitals[name] = {
        count: values.length,
        average: values.reduce((sum, val) => sum + val, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        p75: calculatePercentile(values, 75),
        p95: calculatePercentile(values, 95),
      };
    }
  });

  // Aggregate custom metrics
  const customMetricNames = Array.from(new Set(customMetrics.map(m => m.name)));
  customMetricNames.forEach(name => {
    const values = customMetrics.filter(m => m.name === name).map(m => m.value);
    if (values.length > 0) {
      aggregated.customMetrics[name] = {
        count: values.length,
        average: values.reduce((sum, val) => sum + val, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
      };
    }
  });

  return aggregated;
}

function calculatePercentile(values: number[], percentile: number): number {
  const sorted = values.slice().sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index] || 0;
}

// Note: performanceMetrics and performanceReports are kept internal to this module
// In production, these would be stored in a database rather than in-memory