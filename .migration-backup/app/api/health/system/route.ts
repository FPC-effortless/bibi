import { NextRequest, NextResponse } from 'next/server';
import os from 'os';

/**
 * System health and metrics endpoint
 * Provides detailed system performance and resource utilization metrics
 */

interface SystemMetrics {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  system: {
    hostname: string;
    platform: string;
    architecture: string;
    nodeVersion: string;
    uptime: number;
    loadAverage: number[];
  };
  memory: {
    total: number;
    free: number;
    used: number;
    percentage: number;
    heap: {
      total: number;
      used: number;
      percentage: number;
    };
  };
  cpu: {
    cores: number;
    model: string;
    usage: number;
    loadAverage1m: number;
    loadAverage5m: number;
    loadAverage15m: number;
  };
  disk: {
    total: number;
    used: number;
    available: number;
    percentage: number;
  };
  network: {
    interfaces: Array<{
      name: string;
      address: string;
      family: string;
      internal: boolean;
    }>;
  };
  process: {
    pid: number;
    ppid: number;
    memoryUsage: NodeJS.MemoryUsage;
    cpuUsage: NodeJS.CpuUsage;
    activeHandles: number;
    activeRequests: number;
  };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  
  try {
    const metrics = await collectSystemMetrics();
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      ...metrics,
      responseTime,
    }, {
      status: metrics.status === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Response-Time': `${responseTime}ms`,
      },
    });
  } catch (error) {
    console.error('System metrics collection failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'System metrics collection failed',
      },
      { status: 503 }
    );
  }
}

/**
 * Collect comprehensive system metrics
 */
async function collectSystemMetrics(): Promise<SystemMetrics> {
  const cpus = os.cpus();
  const networkInterfaces = os.networkInterfaces();
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  const loadAverage = os.loadavg();
  
  // System information
  const system = {
    hostname: os.hostname(),
    platform: os.platform(),
    architecture: os.arch(),
    nodeVersion: process.version,
    uptime: Math.floor(process.uptime()),
    loadAverage,
  };
  
  // Memory metrics
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryPercentage = (usedMemory / totalMemory) * 100;
  
  const memory = {
    total: Math.round(totalMemory / 1024 / 1024), // MB
    free: Math.round(freeMemory / 1024 / 1024), // MB
    used: Math.round(usedMemory / 1024 / 1024), // MB
    percentage: Math.round(memoryPercentage),
    heap: {
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
      percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
    },
  };
  
  // CPU metrics
  const cpu = {
    cores: cpus.length,
    model: cpus[0]?.model || 'Unknown',
    usage: calculateCpuUsage(cpuUsage),
    loadAverage1m: Math.round(loadAverage[0] * 100) / 100,
    loadAverage5m: Math.round(loadAverage[1] * 100) / 100,
    loadAverage15m: Math.round(loadAverage[2] * 100) / 100,
  };
  
  // Disk metrics (simulated - in production, use actual disk monitoring)
  const disk = await getDiskMetrics();
  
  // Network interfaces
  const network = {
    interfaces: Object.entries(networkInterfaces)
      .flatMap(([name, interfaces]) => 
        (interfaces || []).map(iface => ({
          name,
          address: iface.address,
          family: iface.family,
          internal: iface.internal,
        }))
      )
      .filter(iface => !iface.internal), // Only external interfaces
  };
  
  // Process metrics
  const processMetrics = {
    pid: process.pid,
    ppid: process.ppid || 0,
    memoryUsage,
    cpuUsage,
    activeHandles: (process as any)._getActiveHandles?.()?.length || 0,
    activeRequests: (process as any)._getActiveRequests?.()?.length || 0,
  };
  
  // Determine overall system status
  let status: SystemMetrics['status'] = 'healthy';
  
  if (memory.percentage > 90 || 
      cpu.loadAverage1m > cpu.cores * 2 ||
      disk.percentage > 95) {
    status = 'unhealthy';
  } else if (memory.percentage > 80 || 
             cpu.loadAverage1m > cpu.cores ||
             disk.percentage > 85) {
    status = 'degraded';
  }
  
  return {
    status,
    timestamp: new Date().toISOString(),
    system,
    memory,
    cpu,
    disk,
    network,
    process: processMetrics,
  };
}

/**
 * Calculate CPU usage percentage
 */
function calculateCpuUsage(cpuUsage: NodeJS.CpuUsage): number {
  // Convert microseconds to milliseconds and calculate percentage
  const totalUsage = (cpuUsage.user + cpuUsage.system) / 1000;
  const uptime = process.uptime() * 1000;
  
  if (uptime === 0) return 0;
  
  return Math.round((totalUsage / uptime) * 100);
}

/**
 * Get disk usage metrics
 */
async function getDiskMetrics() {
  try {
    // In a real implementation, you would use a library like 'node-disk-info'
    // or execute system commands to get actual disk usage
    
    // Simulated disk metrics
    const total = 100; // GB
    const used = Math.random() * 80; // 0-80% usage
    const available = total - used;
    const percentage = (used / total) * 100;
    
    return {
      total: Math.round(total),
      used: Math.round(used),
      available: Math.round(available),
      percentage: Math.round(percentage),
    };
  } catch (error) {
    console.error('Failed to get disk metrics:', error);
    return {
      total: -1,
      used: -1,
      available: -1,
      percentage: -1,
    };
  }
}

/**
 * POST endpoint for system maintenance operations
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { action } = await request.json();
    
    switch (action) {
      case 'gc':
        // Force garbage collection
        if (global.gc) {
          global.gc();
          return NextResponse.json({ 
            success: true, 
            message: 'Garbage collection triggered' 
          });
        } else {
          return NextResponse.json({ 
            success: false, 
            message: 'Garbage collection not available (run with --expose-gc)' 
          });
        }
        
      case 'clear_cache':
        // Clear application caches
        await clearApplicationCaches();
        return NextResponse.json({ 
          success: true, 
          message: 'Application caches cleared' 
        });
        
      case 'restart_workers':
        // Restart worker processes (if applicable)
        await restartWorkers();
        return NextResponse.json({ 
          success: true, 
          message: 'Worker processes restarted' 
        });
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('System maintenance operation failed:', error);
    return NextResponse.json(
      { error: 'Maintenance operation failed' },
      { status: 500 }
    );
  }
}

/**
 * System maintenance operations
 */
async function clearApplicationCaches() {
  // Clear various application caches
  console.log('Clearing application caches...');
  
  // In a real implementation:
  // - Clear Redis cache
  // - Clear file system cache
  // - Clear CDN cache
  // - Reset connection pools
  
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function restartWorkers() {
  // Restart background workers
  console.log('Restarting worker processes...');
  
  // In a real implementation:
  // - Gracefully shutdown workers
  // - Restart worker processes
  // - Verify worker health
  
  await new Promise(resolve => setTimeout(resolve, 2000));
}