/**
 * Database Performance Monitoring and Optimization
 * Tracks query performance and identifies optimization opportunities
 */

interface QueryMetrics {
  query: string;
  executionTime: number;
  timestamp: Date;
  parameters?: any[];
  rowsAffected?: number;
  error?: string;
  stackTrace?: string;
}

interface QueryStats {
  query: string;
  totalExecutions: number;
  averageExecutionTime: number;
  minExecutionTime: number;
  maxExecutionTime: number;
  p95ExecutionTime: number;
  totalExecutionTime: number;
  errorCount: number;
  lastExecuted: Date;
  slowestExecution: QueryMetrics;
}

interface PerformanceAlert {
  type: 'slow_query' | 'high_error_rate' | 'connection_pool_exhaustion' | 'deadlock';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  query?: string;
  metrics?: any;
  timestamp: Date;
}

class DatabasePerformanceMonitor {
  private queryMetrics: Map<string, QueryMetrics[]> = new Map();
  private queryStats: Map<string, QueryStats> = new Map();
  private alerts: PerformanceAlert[] = [];
  private config: {
    slowQueryThreshold: number;
    errorRateThreshold: number;
    maxMetricsHistory: number;
    alertCooldown: number;
  };

  constructor(config = {}) {
    this.config = {
      slowQueryThreshold: 1000, // 1 second
      errorRateThreshold: 0.05, // 5%
      maxMetricsHistory: 10000,
      alertCooldown: 300000, // 5 minutes
      ...config
    };
  }

  /**
   * Record query execution metrics
   */
  recordQuery(metrics: QueryMetrics): void {
    const normalizedQuery = this.normalizeQuery(metrics.query);
    
    // Store raw metrics
    if (!this.queryMetrics.has(normalizedQuery)) {
      this.queryMetrics.set(normalizedQuery, []);
    }
    
    const queryHistory = this.queryMetrics.get(normalizedQuery)!;
    queryHistory.push(metrics);
    
    // Limit history size
    if (queryHistory.length > this.config.maxMetricsHistory) {
      queryHistory.shift();
    }
    
    // Update aggregated stats
    this.updateQueryStats(normalizedQuery, metrics);
    
    // Check for performance issues
    this.checkPerformanceAlerts(normalizedQuery, metrics);
  }

  /**
   * Normalize query for grouping similar queries
   */
  private normalizeQuery(query: string): string {
    return query
      .replace(/\$\d+/g, '?') // Replace parameterized queries
      .replace(/\d+/g, '?') // Replace numbers
      .replace(/'[^']*'/g, '?') // Replace string literals
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .toLowerCase();
  }

  /**
   * Update aggregated query statistics
   */
  private updateQueryStats(normalizedQuery: string, metrics: QueryMetrics): void {
    let stats = this.queryStats.get(normalizedQuery);
    
    if (!stats) {
      stats = {
        query: normalizedQuery,
        totalExecutions: 0,
        averageExecutionTime: 0,
        minExecutionTime: Infinity,
        maxExecutionTime: 0,
        p95ExecutionTime: 0,
        totalExecutionTime: 0,
        errorCount: 0,
        lastExecuted: metrics.timestamp,
        slowestExecution: metrics
      };
      this.queryStats.set(normalizedQuery, stats);
    }
    
    stats.totalExecutions++;
    stats.totalExecutionTime += metrics.executionTime;
    stats.averageExecutionTime = stats.totalExecutionTime / stats.totalExecutions;
    stats.minExecutionTime = Math.min(stats.minExecutionTime, metrics.executionTime);
    stats.maxExecutionTime = Math.max(stats.maxExecutionTime, metrics.executionTime);
    stats.lastExecuted = metrics.timestamp;
    
    if (metrics.executionTime > stats.slowestExecution.executionTime) {
      stats.slowestExecution = metrics;
    }
    
    if (metrics.error) {
      stats.errorCount++;
    }
    
    // Calculate P95
    const queryHistory = this.queryMetrics.get(normalizedQuery)!;
    const executionTimes = queryHistory.map(m => m.executionTime).sort((a, b) => a - b);
    const p95Index = Math.floor(executionTimes.length * 0.95);
    stats.p95ExecutionTime = executionTimes[p95Index] || 0;
  }

  /**
   * Check for performance alerts
   */
  private checkPerformanceAlerts(normalizedQuery: string, metrics: QueryMetrics): void {
    const stats = this.queryStats.get(normalizedQuery)!;
    
    // Slow query alert
    if (metrics.executionTime > this.config.slowQueryThreshold) {
      this.addAlert({
        type: 'slow_query',
        severity: metrics.executionTime > this.config.slowQueryThreshold * 5 ? 'critical' : 'high',
        message: `Slow query detected: ${metrics.executionTime}ms execution time`,
        query: normalizedQuery,
        metrics: { executionTime: metrics.executionTime },
        timestamp: new Date()
      });
    }
    
    // High error rate alert
    const errorRate = stats.errorCount / stats.totalExecutions;
    if (errorRate > this.config.errorRateThreshold && stats.totalExecutions > 10) {
      this.addAlert({
        type: 'high_error_rate',
        severity: errorRate > 0.2 ? 'critical' : 'high',
        message: `High error rate detected: ${(errorRate * 100).toFixed(2)}% for query`,
        query: normalizedQuery,
        metrics: { errorRate, totalExecutions: stats.totalExecutions },
        timestamp: new Date()
      });
    }
  }

  /**
   * Add performance alert with cooldown
   */
  private addAlert(alert: PerformanceAlert): void {
    // Check cooldown period
    const recentAlert = this.alerts.find(a => 
      a.type === alert.type && 
      a.query === alert.query &&
      Date.now() - a.timestamp.getTime() < this.config.alertCooldown
    );
    
    if (!recentAlert) {
      this.alerts.push(alert);
      console.warn(`🚨 Database Performance Alert: ${alert.message}`);
    }
  }

  /**
   * Get query performance statistics
   */
  getQueryStats(limit = 20): QueryStats[] {
    return Array.from(this.queryStats.values())
      .sort((a, b) => b.averageExecutionTime - a.averageExecutionTime)
      .slice(0, limit);
  }

  /**
   * Get slowest queries
   */
  getSlowestQueries(limit = 10): QueryStats[] {
    return Array.from(this.queryStats.values())
      .sort((a, b) => b.maxExecutionTime - a.maxExecutionTime)
      .slice(0, limit);
  }

  /**
   * Get most frequent queries
   */
  getMostFrequentQueries(limit = 10): QueryStats[] {
    return Array.from(this.queryStats.values())
      .sort((a, b) => b.totalExecutions - a.totalExecutions)
      .slice(0, limit);
  }

  /**
   * Get queries with highest error rates
   */
  getQueriesWithErrors(limit = 10): QueryStats[] {
    return Array.from(this.queryStats.values())
      .filter(stats => stats.errorCount > 0)
      .sort((a, b) => (b.errorCount / b.totalExecutions) - (a.errorCount / a.totalExecutions))
      .slice(0, limit);
  }

  /**
   * Get recent alerts
   */
  getRecentAlerts(hours = 24): PerformanceAlert[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.alerts.filter(alert => alert.timestamp > cutoff);
  }

  /**
   * Generate performance report
   */
  generatePerformanceReport(): {
    summary: any;
    slowestQueries: QueryStats[];
    mostFrequentQueries: QueryStats[];
    errorQueries: QueryStats[];
    recentAlerts: PerformanceAlert[];
    recommendations: string[];
  } {
    const allStats = Array.from(this.queryStats.values());
    const totalQueries = allStats.reduce((sum, stats) => sum + stats.totalExecutions, 0);
    const totalErrors = allStats.reduce((sum, stats) => sum + stats.errorCount, 0);
    const averageExecutionTime = allStats.reduce((sum, stats) => sum + stats.averageExecutionTime, 0) / allStats.length;
    
    const summary = {
      totalUniqueQueries: allStats.length,
      totalQueryExecutions: totalQueries,
      totalErrors: totalErrors,
      overallErrorRate: totalErrors / totalQueries,
      averageExecutionTime: averageExecutionTime || 0,
      slowQueriesCount: allStats.filter(s => s.averageExecutionTime > this.config.slowQueryThreshold).length
    };
    
    const recommendations = this.generateRecommendations(allStats);
    
    return {
      summary,
      slowestQueries: this.getSlowestQueries(),
      mostFrequentQueries: this.getMostFrequentQueries(),
      errorQueries: this.getQueriesWithErrors(),
      recentAlerts: this.getRecentAlerts(),
      recommendations
    };
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(stats: QueryStats[]): string[] {
    const recommendations: string[] = [];
    
    // Check for slow queries
    const slowQueries = stats.filter(s => s.averageExecutionTime > this.config.slowQueryThreshold);
    if (slowQueries.length > 0) {
      recommendations.push(`Consider optimizing ${slowQueries.length} slow queries with average execution time > ${this.config.slowQueryThreshold}ms`);
    }
    
    // Check for frequent queries
    const frequentQueries = stats.filter(s => s.totalExecutions > 1000);
    if (frequentQueries.length > 0) {
      recommendations.push(`Consider caching results for ${frequentQueries.length} frequently executed queries`);
    }
    
    // Check for queries with high error rates
    const errorQueries = stats.filter(s => s.errorCount / s.totalExecutions > 0.1);
    if (errorQueries.length > 0) {
      recommendations.push(`Investigate ${errorQueries.length} queries with high error rates (>10%)`);
    }
    
    // Check for queries that could benefit from indexing
    const potentialIndexQueries = stats.filter(s => 
      s.query.includes('where') && 
      s.averageExecutionTime > 100 && 
      s.totalExecutions > 100
    );
    if (potentialIndexQueries.length > 0) {
      recommendations.push(`Consider adding indexes for ${potentialIndexQueries.length} WHERE clause queries with high execution time`);
    }
    
    return recommendations;
  }

  /**
   * Clear old metrics to prevent memory leaks
   */
  cleanup(olderThanHours = 24): void {
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    
    for (const [query, metrics] of Array.from(this.queryMetrics.entries())) {
      const filteredMetrics = metrics.filter(m => m.timestamp > cutoff);
      if (filteredMetrics.length === 0) {
        this.queryMetrics.delete(query);
        this.queryStats.delete(query);
      } else {
        this.queryMetrics.set(query, filteredMetrics);
      }
    }
    
    // Clean old alerts
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoff);
  }
}

// Singleton instance
export const dbPerformanceMonitor = new DatabasePerformanceMonitor();

/**
 * Decorator for monitoring database queries
 */
export function monitorQuery(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  
  descriptor.value = async function (...args: any[]) {
    const startTime = performance.now();
    const query = args[0] || 'unknown';
    
    try {
      const result = await method.apply(this, args);
      const executionTime = performance.now() - startTime;
      
      dbPerformanceMonitor.recordQuery({
        query,
        executionTime,
        timestamp: new Date(),
        parameters: args.slice(1),
        rowsAffected: Array.isArray(result) ? result.length : undefined
      });
      
      return result;
    } catch (error) {
      const executionTime = performance.now() - startTime;
      
      dbPerformanceMonitor.recordQuery({
        query,
        executionTime,
        timestamp: new Date(),
        parameters: args.slice(1),
        error: error instanceof Error ? error.message : String(error),
        stackTrace: error instanceof Error ? error.stack : undefined
      });
      
      throw error;
    }
  };
  
  return descriptor;
}

export default DatabasePerformanceMonitor;