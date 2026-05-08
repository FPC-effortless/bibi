import { NextRequest, NextResponse } from 'next/server';

/**
 * Health check endpoint for deployment monitoring
 * Returns basic application health status
 */

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  checks: {
    database: 'pass' | 'fail';
    cache: 'pass' | 'fail';
    external_apis: 'pass' | 'fail';
    memory: 'pass' | 'fail';
  };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const startTime = Date.now();
    
    // Perform health checks
    const checks = await performHealthChecks();
    
    // Determine overall status
    const allChecksPassed = Object.values(checks).every(check => check === 'pass');
    const status: HealthStatus['status'] = allChecksPassed ? 'healthy' : 'degraded';
    
    const healthStatus: HealthStatus = {
      status,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      checks,
    };
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json(healthStatus, {
      status: status === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': `${responseTime}ms`,
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 503 }
    );
  }
}

/**
 * Perform individual health checks
 */
async function performHealthChecks(): Promise<HealthStatus['checks']> {
  const checks: HealthStatus['checks'] = {
    database: 'pass',
    cache: 'pass',
    external_apis: 'pass',
    memory: 'pass',
  };
  
  // Database connectivity check
  try {
    // Check if we can perform basic database operations
    // This would typically involve a simple query like SELECT 1
    const dbCheck = await checkDatabaseConnectivity();
    checks.database = dbCheck ? 'pass' : 'fail';
  } catch (error) {
    console.error('Database health check failed:', error);
    checks.database = 'fail';
  }
  
  // Cache connectivity check
  try {
    // Check cache/Redis connectivity
    const cacheCheck = await checkCacheConnectivity();
    checks.cache = cacheCheck ? 'pass' : 'fail';
  } catch (error) {
    console.error('Cache health check failed:', error);
    checks.cache = 'fail';
  }
  
  // External APIs check
  try {
    // Check critical external services (payment, analytics, etc.)
    const externalCheck = await checkExternalServices();
    checks.external_apis = externalCheck ? 'pass' : 'fail';
  } catch (error) {
    console.error('External APIs health check failed:', error);
    checks.external_apis = 'fail';
  }
  
  // Memory and performance check
  try {
    const memoryUsage = process.memoryUsage();
    const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    
    // Fail if memory usage is above 90%
    checks.memory = memoryUsagePercent < 90 ? 'pass' : 'fail';
    
    // Log memory usage for monitoring
    if (memoryUsagePercent > 80) {
      console.warn(`High memory usage: ${memoryUsagePercent.toFixed(2)}%`);
    }
  } catch (error) {
    console.error('Memory health check failed:', error);
    checks.memory = 'fail';
  }
  
  return checks;
}

/**
 * Check database connectivity
 */
async function checkDatabaseConnectivity(): Promise<boolean> {
  try {
    // In a real implementation with a database:
    // - For PostgreSQL: await pool.query('SELECT 1')
    // - For MongoDB: await db.admin().ping()
    // - For MySQL: await connection.ping()
    
    // For now, simulate a database check
    // This could be replaced with actual database connectivity test
    const simulatedLatency = Math.random() * 50; // 0-50ms
    await new Promise(resolve => setTimeout(resolve, simulatedLatency));
    
    // Simulate occasional database issues (5% failure rate in development)
    if (process.env.NODE_ENV === 'development' && Math.random() < 0.05) {
      throw new Error('Simulated database connection failure');
    }
    
    return true;
  } catch (error) {
    console.error('Database connectivity check failed:', error);
    return false;
  }
}

/**
 * Check cache connectivity
 */
async function checkCacheConnectivity(): Promise<boolean> {
  try {
    // In a real implementation with Redis:
    // await redis.ping()
    
    // For now, simulate cache check
    const simulatedLatency = Math.random() * 20; // 0-20ms
    await new Promise(resolve => setTimeout(resolve, simulatedLatency));
    
    return true;
  } catch (error) {
    console.error('Cache connectivity check failed:', error);
    return false;
  }
}

/**
 * Check external services
 */
async function checkExternalServices(): Promise<boolean> {
  try {
    // Check critical external services with timeout
    const timeout = 5000; // 5 second timeout
    
    const checks = await Promise.allSettled([
      // Payment service check (simulated)
      checkServiceWithTimeout('payment', timeout),
      // Analytics service check (simulated)
      checkServiceWithTimeout('analytics', timeout),
      // CDN check (simulated)
      checkServiceWithTimeout('cdn', timeout),
    ]);
    
    // Consider healthy if at least 2/3 services are working
    const successfulChecks = checks.filter(result => result.status === 'fulfilled').length;
    return successfulChecks >= 2;
  } catch (error) {
    console.error('External services check failed:', error);
    return false;
  }
}

/**
 * Check individual service with timeout
 */
async function checkServiceWithTimeout(serviceName: string, timeout: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${serviceName} service check timeout`));
    }, timeout);
    
    // Simulate service check
    const simulatedLatency = Math.random() * 1000; // 0-1000ms
    setTimeout(() => {
      clearTimeout(timer);
      // Simulate 95% uptime
      resolve(Math.random() > 0.05);
    }, simulatedLatency);
  });
}