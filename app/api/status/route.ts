import { NextRequest, NextResponse } from 'next/server';

/**
 * Detailed status endpoint for deployment monitoring
 * Returns comprehensive system status and metrics
 */

interface SystemStatus {
  application: {
    name: string;
    version: string;
    environment: string;
    buildTime: string;
    startTime: string;
    uptime: number;
  };
  system: {
    nodeVersion: string;
    platform: string;
    architecture: string;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    cpu: {
      usage: number;
    };
  };
  performance: {
    responseTime: number;
    requestCount: number;
    errorRate: number;
  };
  features: {
    pwa: boolean;
    analytics: boolean;
    monitoring: boolean;
    security: boolean;
  };
  dependencies: {
    next: string;
    react: string;
    node: string;
  };
}

// Simple in-memory metrics (in production, use proper monitoring)
let requestCount = 0;
let errorCount = 0;
const startTime = Date.now();

export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestStartTime = Date.now();
  requestCount++;
  
  try {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    const status: SystemStatus = {
      application: {
        name: 'Bibiere Luxury Fashion',
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        buildTime: process.env.BUILD_TIME || new Date().toISOString(),
        startTime: new Date(startTime).toISOString(),
        uptime: Math.floor(process.uptime()),
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
        },
        cpu: {
          usage: Math.round((cpuUsage.user + cpuUsage.system) / 1000000), // Convert to ms
        },
      },
      performance: {
        responseTime: Date.now() - requestStartTime,
        requestCount,
        errorRate: requestCount > 0 ? Math.round((errorCount / requestCount) * 100) : 0,
      },
      features: {
        pwa: process.env.NEXT_PUBLIC_ENABLE_PWA === 'true',
        analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
        monitoring: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true',
        security: process.env.NEXT_PUBLIC_ENABLE_SECURITY_HEADERS === 'true',
      },
      dependencies: {
        next: getPackageVersion('next'),
        react: getPackageVersion('react'),
        node: process.version,
      },
    };
    
    return NextResponse.json(status, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': `${Date.now() - requestStartTime}ms`,
      },
    });
  } catch (error) {
    errorCount++;
    console.error('Status endpoint error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to retrieve system status',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Get package version from package.json
 */
function getPackageVersion(packageName: string): string {
  try {
    // In a real implementation, you might read from package.json
    // For now, return a placeholder
    const versions: Record<string, string> = {
      next: '14.0.0',
      react: '18.0.0',
    };
    
    return versions[packageName] || 'unknown';
  } catch (error) {
    return 'unknown';
  }
}