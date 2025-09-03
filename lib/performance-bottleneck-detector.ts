/**
 * Performance Bottleneck Detection and Alerting System
 * Identifies performance issues and sends alerts
 */

interface PerformanceThreshold {
  metric: string;
  warning: number;
  critical: number;
  unit: string;
  higherIsBetter?: boolean;
}

interface BottleneckAlert {
  id: string;
  type: 'warning' | 'critical';
  metric: string;
  currentValue: number;
  threshold: number;
  message: string;
  timestamp: Date;
  resolved: boolean;
  component?: string;
  suggestions: string[];
}

interface PerformanceData {
  timestamp: Date;
  metrics: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
    cacheHitRatio: number;
    databaseQueryTime: number;
    bundleSize: number;
    coreWebVitals: {
      lcp: number;
      fid: number;
      cls: number;
      fcp: number;
      ttfb: number;
    };
  };
  userAgent?: string;
  region?: string;
}

interface BottleneckAnalysis {
  severity: 'low' | 'medium' | 'high' | 'critical';
  bottlenecks: string[];
  rootCause: string;
  impact: string;
  recommendations: string[];
  estimatedFixTime: string;
}

class PerformanceBottleneckDetector {
  private thresholds: PerformanceThreshold[];
  private alerts: Map<string, BottleneckAlert> = new Map();
  private performanceHistory: PerformanceData[] = [];
  private alertCallbacks: ((alert: BottleneckAlert) => void)[] = [];

  constructor() {
    this.thresholds = this.getDefaultThresholds();
  }

  private getDefaultThresholds(): PerformanceThreshold[] {
    return [
      { metric: 'responseTime', warning: 1000, critical: 3000, unit: 'ms' },
      { metric: 'throughput', warning: 10, critical: 5, unit: 'req/s', higherIsBetter: true },
      { metric: 'errorRate', warning: 5, critical: 10, unit: '%' },
      { metric: 'cpuUsage', warning: 70, critical: 90, unit: '%' },
      { metric: 'memoryUsage', warning: 80, critical: 95, unit: '%' },
      { metric: 'diskUsage', warning: 85, critical: 95, unit: '%' },
      { metric: 'networkLatency', warning: 200, critical: 500, unit: 'ms' },
      { metric: 'cacheHitRatio', warning: 80, critical: 60, unit: '%', higherIsBetter: true },
      { metric: 'databaseQueryTime', warning: 500, critical: 2000, unit: 'ms' },
      { metric: 'bundleSize', warning: 1024, critical: 2048, unit: 'KB' },
      { metric: 'lcp', warning: 2500, critical: 4000, unit: 'ms' },
      { metric: 'fid', warning: 100, critical: 300, unit: 'ms' },
      { metric: 'cls', warning: 0.1, critical: 0.25, unit: '' },
      { metric: 'fcp', warning: 1800, critical: 3000, unit: 'ms' },
      { metric: 'ttfb', warning: 800, critical: 1800, unit: 'ms' }
    ];
  }

  /**
   * Analyze performance data and detect bottlenecks
   */
  analyzePerformance(data: PerformanceData): BottleneckAlert[] {
    this.performanceHistory.push(data);
    
    // Keep only last 1000 entries
    if (this.performanceHistory.length > 1000) {
      this.performanceHistory.shift();
    }

    const newAlerts: BottleneckAlert[] = [];

    // Check each metric against thresholds
    this.thresholds.forEach(threshold => {
      const value = this.getMetricValue(data, threshold.metric);
      if (value !== null) {
        const alert = this.checkThreshold(threshold, value, data);
        if (alert) {
          newAlerts.push(alert);
        }
      }
    });

    // Detect complex bottlenecks
    const complexBottlenecks = this.detectComplexBottlenecks(data);
    newAlerts.push(...complexBottlenecks);

    // Trigger alert callbacks
    newAlerts.forEach(alert => {
      this.alerts.set(alert.id, alert);
      this.alertCallbacks.forEach(callback => callback(alert));
    });

    return newAlerts;
  }

  /**
   * Get metric value from performance data
   */
  private getMetricValue(data: PerformanceData, metric: string): number | null {
    const metrics = data.metrics;
    
    switch (metric) {
      case 'responseTime':
        return metrics.responseTime;
      case 'throughput':
        return metrics.throughput;
      case 'errorRate':
        return metrics.errorRate;
      case 'cpuUsage':
        return metrics.cpuUsage;
      case 'memoryUsage':
        return metrics.memoryUsage;
      case 'diskUsage':
        return metrics.diskUsage;
      case 'networkLatency':
        return metrics.networkLatency;
      case 'cacheHitRatio':
        return metrics.cacheHitRatio;
      case 'databaseQueryTime':
        return metrics.databaseQueryTime;
      case 'bundleSize':
        return metrics.bundleSize;
      case 'lcp':
        return metrics.coreWebVitals.lcp;
      case 'fid':
        return metrics.coreWebVitals.fid;
      case 'cls':
        return metrics.coreWebVitals.cls;
      case 'fcp':
        return metrics.coreWebVitals.fcp;
      case 'ttfb':
        return metrics.coreWebVitals.ttfb;
      default:
        return null;
    }
  }

  /**
   * Check if metric exceeds threshold
   */
  private checkThreshold(threshold: PerformanceThreshold, value: number, data: PerformanceData): BottleneckAlert | null {
    const isHigherBetter = threshold.higherIsBetter || false;
    let alertType: 'warning' | 'critical' | null = null;

    if (isHigherBetter) {
      if (value < threshold.critical) {
        alertType = 'critical';
      } else if (value < threshold.warning) {
        alertType = 'warning';
      }
    } else {
      if (value > threshold.critical) {
        alertType = 'critical';
      } else if (value > threshold.warning) {
        alertType = 'warning';
      }
    }

    if (!alertType) return null;

    const alertId = `${threshold.metric}-${alertType}-${Date.now()}`;
    const existingAlert = Array.from(this.alerts.values()).find(
      alert => alert.metric === threshold.metric && alert.type === alertType && !alert.resolved
    );

    // Don't create duplicate alerts
    if (existingAlert) return null;

    return {
      id: alertId,
      type: alertType,
      metric: threshold.metric,
      currentValue: value,
      threshold: alertType === 'critical' ? threshold.critical : threshold.warning,
      message: this.generateAlertMessage(threshold, value, alertType),
      timestamp: data.timestamp,
      resolved: false,
      suggestions: this.generateSuggestions(threshold.metric, value, alertType)
    };
  }

  /**
   * Detect complex performance bottlenecks
   */
  private detectComplexBottlenecks(data: PerformanceData): BottleneckAlert[] {
    const alerts: BottleneckAlert[] = [];
    const metrics = data.metrics;

    // Memory leak detection
    if (this.detectMemoryLeak()) {
      alerts.push({
        id: `memory-leak-${Date.now()}`,
        type: 'critical',
        metric: 'memoryUsage',
        currentValue: metrics.memoryUsage,
        threshold: 0,
        message: 'Potential memory leak detected - memory usage continuously increasing',
        timestamp: data.timestamp,
        resolved: false,
        component: 'memory',
        suggestions: [
          'Check for memory leaks in JavaScript code',
          'Review event listeners and cleanup',
          'Monitor DOM node creation and removal',
          'Check for circular references'
        ]
      });
    }

    // Database bottleneck
    if (metrics.databaseQueryTime > 1000 && metrics.responseTime > 2000) {
      alerts.push({
        id: `database-bottleneck-${Date.now()}`,
        type: 'warning',
        metric: 'databaseQueryTime',
        currentValue: metrics.databaseQueryTime,
        threshold: 1000,
        message: 'Database queries are causing response time bottleneck',
        timestamp: data.timestamp,
        resolved: false,
        component: 'database',
        suggestions: [
          'Optimize slow database queries',
          'Add database indexes',
          'Implement query caching',
          'Consider database connection pooling'
        ]
      });
    }

    // Network bottleneck
    if (metrics.networkLatency > 300 && metrics.coreWebVitals.ttfb > 1000) {
      alerts.push({
        id: `network-bottleneck-${Date.now()}`,
        type: 'warning',
        metric: 'networkLatency',
        currentValue: metrics.networkLatency,
        threshold: 300,
        message: 'Network latency is affecting Time to First Byte',
        timestamp: data.timestamp,
        resolved: false,
        component: 'network',
        suggestions: [
          'Implement CDN for static assets',
          'Optimize server location',
          'Enable compression',
          'Reduce payload sizes'
        ]
      });
    }

    // Bundle size impact on performance
    if (metrics.bundleSize > 1500 && metrics.coreWebVitals.fcp > 2000) {
      alerts.push({
        id: `bundle-size-bottleneck-${Date.now()}`,
        type: 'warning',
        metric: 'bundleSize',
        currentValue: metrics.bundleSize,
        threshold: 1500,
        message: 'Large bundle size is affecting First Contentful Paint',
        timestamp: data.timestamp,
        resolved: false,
        component: 'frontend',
        suggestions: [
          'Implement code splitting',
          'Remove unused dependencies',
          'Enable tree shaking',
          'Lazy load non-critical components'
        ]
      });
    }

    return alerts;
  }

  /**
   * Detect memory leak pattern
   */
  private detectMemoryLeak(): boolean {
    if (this.performanceHistory.length < 10) return false;

    const recentMemoryUsage = this.performanceHistory
      .slice(-10)
      .map(data => data.metrics.memoryUsage);

    // Check if memory usage is consistently increasing
    let increasingCount = 0;
    for (let i = 1; i < recentMemoryUsage.length; i++) {
      if (recentMemoryUsage[i] > recentMemoryUsage[i - 1]) {
        increasingCount++;
      }
    }

    return increasingCount >= 7; // 70% of samples showing increase
  }

  /**
   * Generate alert message
   */
  private generateAlertMessage(threshold: PerformanceThreshold, value: number, type: 'warning' | 'critical'): string {
    const comparison = threshold.higherIsBetter ? 'below' : 'above';
    const thresholdValue = type === 'critical' ? threshold.critical : threshold.warning;
    
    return `${threshold.metric} is ${comparison} ${type} threshold: ${value.toFixed(2)}${threshold.unit} (threshold: ${thresholdValue}${threshold.unit})`;
  }

  /**
   * Generate suggestions for performance improvement
   */
  private generateSuggestions(metric: string, value: number, type: 'warning' | 'critical'): string[] {
    const suggestions: Record<string, string[]> = {
      responseTime: [
        'Optimize database queries',
        'Implement caching strategies',
        'Reduce payload sizes',
        'Enable compression'
      ],
      throughput: [
        'Scale server resources',
        'Optimize application code',
        'Implement load balancing',
        'Review bottlenecks in request processing'
      ],
      errorRate: [
        'Review error logs for patterns',
        'Implement better error handling',
        'Check for resource exhaustion',
        'Validate input data more thoroughly'
      ],
      cpuUsage: [
        'Optimize CPU-intensive operations',
        'Implement horizontal scaling',
        'Review algorithm efficiency',
        'Consider background job processing'
      ],
      memoryUsage: [
        'Check for memory leaks',
        'Optimize data structures',
        'Implement garbage collection tuning',
        'Review caching strategies'
      ],
      cacheHitRatio: [
        'Review cache configuration',
        'Increase cache TTL for static content',
        'Implement cache warming',
        'Optimize cache key strategies'
      ],
      lcp: [
        'Optimize largest contentful element',
        'Implement image optimization',
        'Reduce server response time',
        'Eliminate render-blocking resources'
      ],
      cls: [
        'Set size attributes on images and videos',
        'Reserve space for dynamic content',
        'Avoid inserting content above existing content',
        'Use CSS aspect-ratio for responsive images'
      ]
    };

    return suggestions[metric] || ['Review performance metrics and optimize accordingly'];
  }

  /**
   * Perform comprehensive bottleneck analysis
   */
  performBottleneckAnalysis(timeRange: number = 3600000): BottleneckAnalysis {
    const cutoff = new Date(Date.now() - timeRange);
    const recentData = this.performanceHistory.filter(data => data.timestamp > cutoff);
    
    if (recentData.length === 0) {
      return {
        severity: 'low',
        bottlenecks: [],
        rootCause: 'Insufficient data for analysis',
        impact: 'Unknown',
        recommendations: ['Collect more performance data'],
        estimatedFixTime: 'N/A'
      };
    }

    const bottlenecks: string[] = [];
    const activeAlerts = Array.from(this.alerts.values()).filter(alert => !alert.resolved);
    
    // Identify primary bottlenecks
    const criticalAlerts = activeAlerts.filter(alert => alert.type === 'critical');
    const warningAlerts = activeAlerts.filter(alert => alert.type === 'warning');
    
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    
    if (criticalAlerts.length > 0) {
      severity = 'critical';
      bottlenecks.push(...criticalAlerts.map(alert => alert.metric));
    } else if (warningAlerts.length > 2) {
      severity = 'high';
      bottlenecks.push(...warningAlerts.map(alert => alert.metric));
    } else if (warningAlerts.length > 0) {
      severity = 'medium';
      bottlenecks.push(...warningAlerts.map(alert => alert.metric));
    }

    // Determine root cause
    const rootCause = this.determineRootCause(activeAlerts, recentData);
    
    // Calculate impact
    const impact = this.calculateImpact(activeAlerts, recentData);
    
    // Generate recommendations
    const recommendations = this.generateComprehensiveRecommendations(activeAlerts);
    
    // Estimate fix time
    const estimatedFixTime = this.estimateFixTime(severity, bottlenecks.length);

    return {
      severity,
      bottlenecks: Array.from(new Set(bottlenecks)), // Remove duplicates
      rootCause,
      impact,
      recommendations,
      estimatedFixTime
    };
  }

  private determineRootCause(alerts: BottleneckAlert[], recentData: PerformanceData[]): string {
    if (alerts.length === 0) return 'No performance issues detected';
    
    const alertsByComponent = alerts.reduce((acc, alert) => {
      const component = alert.component || 'unknown';
      acc[component] = (acc[component] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const primaryComponent = Object.entries(alertsByComponent)
      .sort(([,a], [,b]) => b - a)[0]?.[0];
    
    switch (primaryComponent) {
      case 'database':
        return 'Database performance issues are the primary bottleneck';
      case 'network':
        return 'Network latency and connectivity issues are affecting performance';
      case 'memory':
        return 'Memory management issues are causing performance degradation';
      case 'frontend':
        return 'Frontend bundle size and rendering issues are impacting user experience';
      default:
        return 'Multiple performance factors are contributing to bottlenecks';
    }
  }

  private calculateImpact(alerts: BottleneckAlert[], recentData: PerformanceData[]): string {
    const criticalCount = alerts.filter(a => a.type === 'critical').length;
    const warningCount = alerts.filter(a => a.type === 'warning').length;
    
    if (criticalCount > 0) {
      return 'High impact - Critical performance issues affecting user experience';
    } else if (warningCount > 2) {
      return 'Medium impact - Multiple performance warnings may degrade user experience';
    } else if (warningCount > 0) {
      return 'Low impact - Minor performance issues detected';
    } else {
      return 'No significant impact detected';
    }
  }

  private generateComprehensiveRecommendations(alerts: BottleneckAlert[]): string[] {
    const allSuggestions = alerts.flatMap(alert => alert.suggestions);
    const uniqueSuggestions = Array.from(new Set(allSuggestions));
    
    // Prioritize suggestions based on impact
    const prioritizedSuggestions = [
      ...uniqueSuggestions.filter(s => s.includes('critical') || s.includes('optimize')),
      ...uniqueSuggestions.filter(s => !s.includes('critical') && !s.includes('optimize'))
    ];
    
    return prioritizedSuggestions.slice(0, 10); // Limit to top 10 recommendations
  }

  private estimateFixTime(severity: string, bottleneckCount: number): string {
    const baseTime = {
      low: 2,
      medium: 8,
      high: 24,
      critical: 72
    }[severity] || 2;
    
    const adjustedTime = baseTime + (bottleneckCount * 4);
    
    if (adjustedTime < 24) {
      return `${adjustedTime} hours`;
    } else {
      return `${Math.ceil(adjustedTime / 24)} days`;
    }
  }

  /**
   * Register alert callback
   */
  onAlert(callback: (alert: BottleneckAlert) => void): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolved = true;
      this.alerts.set(alertId, alert);
    }
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): BottleneckAlert[] {
    return Array.from(this.alerts.values()).filter(alert => !alert.resolved);
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    status: 'healthy' | 'warning' | 'critical';
    activeAlerts: number;
    criticalAlerts: number;
    lastUpdated: Date;
  } {
    const activeAlerts = this.getActiveAlerts();
    const criticalAlerts = activeAlerts.filter(alert => alert.type === 'critical');
    
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (criticalAlerts.length > 0) {
      status = 'critical';
    } else if (activeAlerts.length > 0) {
      status = 'warning';
    }
    
    return {
      status,
      activeAlerts: activeAlerts.length,
      criticalAlerts: criticalAlerts.length,
      lastUpdated: new Date()
    };
  }
}

export const performanceBottleneckDetector = new PerformanceBottleneckDetector();
export default PerformanceBottleneckDetector;