/**
 * Auto-scaling and Resource Management
 * Manages automatic resource scaling based on performance metrics
 */

interface ScalingRule {
  id: string;
  name: string;
  metric: string;
  threshold: number;
  comparison: 'greater_than' | 'less_than' | 'equal_to';
  action: 'scale_up' | 'scale_down' | 'alert';
  cooldown: number; // milliseconds
  enabled: boolean;
}

interface ScalingAction {
  id: string;
  ruleId: string;
  action: 'scale_up' | 'scale_down' | 'alert';
  timestamp: Date;
  reason: string;
  previousValue: number;
  newValue: number;
  success: boolean;
  error?: string;
}

interface ResourceConfiguration {
  minInstances: number;
  maxInstances: number;
  targetCpuUtilization: number;
  targetMemoryUtilization: number;
  scaleUpCooldown: number;
  scaleDownCooldown: number;
  healthCheckPath: string;
  healthCheckInterval: number;
}

interface ScalingMetrics {
  timestamp: Date;
  cpuUtilization: number;
  memoryUtilization: number;
  requestsPerSecond: number;
  responseTime: number;
  errorRate: number;
  activeConnections: number;
  queueLength: number;
}

interface ScalingDecision {
  shouldScale: boolean;
  direction: 'up' | 'down' | 'none';
  reason: string;
  confidence: number;
  estimatedInstances: number;
  triggeredRules: string[];
}

class AutoScalingManager {
  private rules: Map<string, ScalingRule> = new Map();
  private actions: ScalingAction[] = [];
  private config: ResourceConfiguration;
  private currentInstances: number = 1;
  private lastScalingAction: Date | null = null;
  private metricsHistory: ScalingMetrics[] = [];

  constructor(config: ResourceConfiguration) {
    this.config = config;
    this.initializeDefaultRules();
  }

  private initializeDefaultRules(): void {
    const defaultRules: ScalingRule[] = [
      {
        id: 'cpu-scale-up',
        name: 'CPU Scale Up',
        metric: 'cpuUtilization',
        threshold: this.config.targetCpuUtilization,
        comparison: 'greater_than',
        action: 'scale_up',
        cooldown: this.config.scaleUpCooldown,
        enabled: true
      },
      {
        id: 'cpu-scale-down',
        name: 'CPU Scale Down',
        metric: 'cpuUtilization',
        threshold: this.config.targetCpuUtilization * 0.5,
        comparison: 'less_than',
        action: 'scale_down',
        cooldown: this.config.scaleDownCooldown,
        enabled: true
      },
      {
        id: 'memory-scale-up',
        name: 'Memory Scale Up',
        metric: 'memoryUtilization',
        threshold: this.config.targetMemoryUtilization,
        comparison: 'greater_than',
        action: 'scale_up',
        cooldown: this.config.scaleUpCooldown,
        enabled: true
      },
      {
        id: 'response-time-scale-up',
        name: 'Response Time Scale Up',
        metric: 'responseTime',
        threshold: 2000, // 2 seconds
        comparison: 'greater_than',
        action: 'scale_up',
        cooldown: this.config.scaleUpCooldown,
        enabled: true
      },
      {
        id: 'error-rate-alert',
        name: 'High Error Rate Alert',
        metric: 'errorRate',
        threshold: 5, // 5%
        comparison: 'greater_than',
        action: 'alert',
        cooldown: 300000, // 5 minutes
        enabled: true
      }
    ];

    defaultRules.forEach(rule => this.rules.set(rule.id, rule));
  }

  /**
   * Evaluate scaling decision based on current metrics
   */
  evaluateScaling(metrics: ScalingMetrics): ScalingDecision {
    this.metricsHistory.push(metrics);
    
    // Keep only last 100 entries
    if (this.metricsHistory.length > 100) {
      this.metricsHistory.shift();
    }

    const triggeredRules: string[] = [];
    let scaleUpVotes = 0;
    let scaleDownVotes = 0;
    const reasons: string[] = [];

    // Evaluate each rule
    for (const rule of Array.from(this.rules.values())) {
      if (!rule.enabled) continue;

      const metricValue = this.getMetricValue(metrics, rule.metric);
      if (metricValue === null) continue;

      const isTriggered = this.evaluateRule(rule, metricValue);
      
      if (isTriggered && this.canExecuteRule(rule)) {
        triggeredRules.push(rule.id);
        
        if (rule.action === 'scale_up') {
          scaleUpVotes++;
          reasons.push(`${rule.name}: ${rule.metric} (${metricValue}) > ${rule.threshold}`);
        } else if (rule.action === 'scale_down') {
          scaleDownVotes++;
          reasons.push(`${rule.name}: ${rule.metric} (${metricValue}) < ${rule.threshold}`);
        } else if (rule.action === 'alert') {
          reasons.push(`Alert: ${rule.name} triggered`);
        }
      }
    }

    // Make scaling decision
    let direction: 'up' | 'down' | 'none' = 'none';
    let shouldScale = false;
    let confidence = 0;

    if (scaleUpVotes > scaleDownVotes && scaleUpVotes > 0) {
      direction = 'up';
      shouldScale = this.currentInstances < this.config.maxInstances;
      confidence = Math.min(scaleUpVotes / this.rules.size, 1);
    } else if (scaleDownVotes > scaleUpVotes && scaleDownVotes > 0) {
      direction = 'down';
      shouldScale = this.currentInstances > this.config.minInstances;
      confidence = Math.min(scaleDownVotes / this.rules.size, 1);
    }

    // Calculate estimated instances
    const estimatedInstances = this.calculateOptimalInstances(metrics);

    return {
      shouldScale,
      direction,
      reason: reasons.join('; '),
      confidence,
      estimatedInstances,
      triggeredRules
    };
  }

  /**
   * Get metric value from scaling metrics
   */
  private getMetricValue(metrics: ScalingMetrics, metricName: string): number | null {
    switch (metricName) {
      case 'cpuUtilization':
        return metrics.cpuUtilization;
      case 'memoryUtilization':
        return metrics.memoryUtilization;
      case 'requestsPerSecond':
        return metrics.requestsPerSecond;
      case 'responseTime':
        return metrics.responseTime;
      case 'errorRate':
        return metrics.errorRate;
      case 'activeConnections':
        return metrics.activeConnections;
      case 'queueLength':
        return metrics.queueLength;
      default:
        return null;
    }
  }

  /**
   * Evaluate if rule is triggered
   */
  private evaluateRule(rule: ScalingRule, value: number): boolean {
    switch (rule.comparison) {
      case 'greater_than':
        return value > rule.threshold;
      case 'less_than':
        return value < rule.threshold;
      case 'equal_to':
        return Math.abs(value - rule.threshold) < 0.01;
      default:
        return false;
    }
  }

  /**
   * Check if rule can be executed (cooldown period)
   */
  private canExecuteRule(rule: ScalingRule): boolean {
    if (!this.lastScalingAction) return true;
    
    const timeSinceLastAction = Date.now() - this.lastScalingAction.getTime();
    return timeSinceLastAction >= rule.cooldown;
  }

  /**
   * Calculate optimal number of instances
   */
  private calculateOptimalInstances(metrics: ScalingMetrics): number {
    // Simple algorithm based on CPU and memory utilization
    const cpuBasedInstances = Math.ceil(
      (metrics.cpuUtilization / this.config.targetCpuUtilization) * this.currentInstances
    );
    
    const memoryBasedInstances = Math.ceil(
      (metrics.memoryUtilization / this.config.targetMemoryUtilization) * this.currentInstances
    );
    
    // Take the higher requirement
    const requiredInstances = Math.max(cpuBasedInstances, memoryBasedInstances);
    
    // Apply constraints
    return Math.max(
      this.config.minInstances,
      Math.min(this.config.maxInstances, requiredInstances)
    );
  }

  /**
   * Execute scaling action
   */
  async executeScaling(decision: ScalingDecision): Promise<ScalingAction> {
    const actionId = `action-${Date.now()}`;
    const previousInstances = this.currentInstances;
    
    let newInstances = this.currentInstances;
    let success = false;
    let error: string | undefined;

    try {
      if (decision.direction === 'up') {
        newInstances = Math.min(this.currentInstances + 1, this.config.maxInstances);
        await this.scaleUp(newInstances);
      } else if (decision.direction === 'down') {
        newInstances = Math.max(this.currentInstances - 1, this.config.minInstances);
        await this.scaleDown(newInstances);
      }
      
      this.currentInstances = newInstances;
      this.lastScalingAction = new Date();
      success = true;
      
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      success = false;
    }

    const action: ScalingAction = {
      id: actionId,
      ruleId: decision.triggeredRules.join(','),
      action: decision.direction === 'up' ? 'scale_up' : 'scale_down',
      timestamp: new Date(),
      reason: decision.reason,
      previousValue: previousInstances,
      newValue: newInstances,
      success,
      error
    };

    this.actions.push(action);
    return action;
  }

  /**
   * Scale up resources
   */
  private async scaleUp(targetInstances: number): Promise<void> {
    console.log(`Scaling up to ${targetInstances} instances`);
    
    // In a real implementation, this would:
    // - Call cloud provider APIs (AWS Auto Scaling, Google Cloud, etc.)
    // - Update load balancer configuration
    // - Wait for health checks to pass
    
    // Simulate scaling delay
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Verify scaling success
    const healthCheck = await this.performHealthCheck();
    if (!healthCheck.healthy) {
      throw new Error('Health check failed after scaling up');
    }
  }

  /**
   * Scale down resources
   */
  private async scaleDown(targetInstances: number): Promise<void> {
    console.log(`Scaling down to ${targetInstances} instances`);
    
    // In a real implementation, this would:
    // - Gracefully drain connections from instances to be removed
    // - Update load balancer configuration
    // - Terminate excess instances
    
    // Simulate scaling delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verify scaling success
    const healthCheck = await this.performHealthCheck();
    if (!healthCheck.healthy) {
      throw new Error('Health check failed after scaling down');
    }
  }

  /**
   * Perform health check
   */
  private async performHealthCheck(): Promise<{ healthy: boolean; details: any }> {
    try {
      // In a real implementation, this would check actual health endpoints
      const response = await fetch(this.config.healthCheckPath);
      return {
        healthy: response.ok,
        details: {
          status: response.status,
          statusText: response.statusText
        }
      };
    } catch (error) {
      return {
        healthy: false,
        details: { error: error instanceof Error ? error.message : String(error) }
      };
    }
  }

  /**
   * Get scaling recommendations
   */
  getScalingRecommendations(): {
    currentInstances: number;
    recommendedInstances: number;
    reasoning: string[];
    costImpact: string;
    performanceImpact: string;
  } {
    if (this.metricsHistory.length === 0) {
      return {
        currentInstances: this.currentInstances,
        recommendedInstances: this.currentInstances,
        reasoning: ['Insufficient metrics data'],
        costImpact: 'Unknown',
        performanceImpact: 'Unknown'
      };
    }

    const recentMetrics = this.metricsHistory.slice(-10);
    const avgCpu = recentMetrics.reduce((sum, m) => sum + m.cpuUtilization, 0) / recentMetrics.length;
    const avgMemory = recentMetrics.reduce((sum, m) => sum + m.memoryUtilization, 0) / recentMetrics.length;
    const avgResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length;

    const reasoning: string[] = [];
    let recommendedInstances = this.currentInstances;

    // CPU-based recommendation
    if (avgCpu > this.config.targetCpuUtilization * 1.2) {
      recommendedInstances = Math.max(recommendedInstances, Math.ceil(this.currentInstances * 1.5));
      reasoning.push(`High CPU utilization (${avgCpu.toFixed(1)}%) suggests scaling up`);
    } else if (avgCpu < this.config.targetCpuUtilization * 0.3) {
      recommendedInstances = Math.min(recommendedInstances, Math.max(1, Math.floor(this.currentInstances * 0.7)));
      reasoning.push(`Low CPU utilization (${avgCpu.toFixed(1)}%) suggests scaling down`);
    }

    // Memory-based recommendation
    if (avgMemory > this.config.targetMemoryUtilization * 1.2) {
      recommendedInstances = Math.max(recommendedInstances, Math.ceil(this.currentInstances * 1.5));
      reasoning.push(`High memory utilization (${avgMemory.toFixed(1)}%) suggests scaling up`);
    }

    // Response time-based recommendation
    if (avgResponseTime > 2000) {
      recommendedInstances = Math.max(recommendedInstances, Math.ceil(this.currentInstances * 1.3));
      reasoning.push(`High response time (${avgResponseTime.toFixed(0)}ms) suggests scaling up`);
    }

    // Apply constraints
    recommendedInstances = Math.max(
      this.config.minInstances,
      Math.min(this.config.maxInstances, recommendedInstances)
    );

    // Calculate impact
    const instanceDiff = recommendedInstances - this.currentInstances;
    const costImpact = instanceDiff > 0 
      ? `Increased cost: ~${(instanceDiff * 100).toFixed(0)}% more`
      : instanceDiff < 0 
        ? `Reduced cost: ~${(Math.abs(instanceDiff) * 100).toFixed(0)}% less`
        : 'No cost impact';

    const performanceImpact = instanceDiff > 0
      ? 'Improved performance and reliability'
      : instanceDiff < 0
        ? 'Potential performance reduction, monitor closely'
        : 'No performance impact';

    return {
      currentInstances: this.currentInstances,
      recommendedInstances,
      reasoning,
      costImpact,
      performanceImpact
    };
  }

  /**
   * Get scaling history
   */
  getScalingHistory(limit: number = 50): ScalingAction[] {
    return this.actions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Add custom scaling rule
   */
  addScalingRule(rule: ScalingRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Update scaling rule
   */
  updateScalingRule(ruleId: string, updates: Partial<ScalingRule>): boolean {
    const rule = this.rules.get(ruleId);
    if (!rule) return false;

    const updatedRule = { ...rule, ...updates };
    this.rules.set(ruleId, updatedRule);
    return true;
  }

  /**
   * Remove scaling rule
   */
  removeScalingRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  /**
   * Get all scaling rules
   */
  getScalingRules(): ScalingRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Update resource configuration
   */
  updateConfiguration(config: Partial<ResourceConfiguration>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current status
   */
  getStatus(): {
    currentInstances: number;
    minInstances: number;
    maxInstances: number;
    lastScalingAction: Date | null;
    activeRules: number;
    recentActions: number;
  } {
    const recentActions = this.actions.filter(
      action => Date.now() - action.timestamp.getTime() < 3600000 // Last hour
    ).length;

    return {
      currentInstances: this.currentInstances,
      minInstances: this.config.minInstances,
      maxInstances: this.config.maxInstances,
      lastScalingAction: this.lastScalingAction,
      activeRules: Array.from(this.rules.values()).filter(rule => rule.enabled).length,
      recentActions
    };
  }
}

// Default configuration
export const defaultScalingConfig: ResourceConfiguration = {
  minInstances: 1,
  maxInstances: 10,
  targetCpuUtilization: 70,
  targetMemoryUtilization: 80,
  scaleUpCooldown: 300000, // 5 minutes
  scaleDownCooldown: 600000, // 10 minutes
  healthCheckPath: '/api/health',
  healthCheckInterval: 30000 // 30 seconds
};

export const autoScalingManager = new AutoScalingManager(defaultScalingConfig);
export default AutoScalingManager;