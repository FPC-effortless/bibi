/**
 * @jest-environment node
 */

import AutoScalingManager, { defaultScalingConfig } from '../../lib/auto-scaling-manager';
import PerformanceBottleneckDetector from '../../lib/performance-bottleneck-detector';
import CDNOptimizer, { defaultCDNConfig } from '../../lib/cdn-optimization';

describe('Auto-scaling and Optimization', () => {
  describe('AutoScalingManager', () => {
    let scalingManager: AutoScalingManager;

    beforeEach(() => {
      scalingManager = new AutoScalingManager(defaultScalingConfig);
    });

    test('should initialize with default configuration', () => {
      const status = scalingManager.getStatus();
      expect(status.currentInstances).toBe(1);
      expect(status.minInstances).toBe(defaultScalingConfig.minInstances);
      expect(status.maxInstances).toBe(defaultScalingConfig.maxInstances);
    });

    test('should have default scaling rules', () => {
      const rules = scalingManager.getScalingRules();
      expect(rules.length).toBeGreaterThan(0);
      
      const cpuScaleUpRule = rules.find(rule => rule.id === 'cpu-scale-up');
      expect(cpuScaleUpRule).toBeDefined();
      expect(cpuScaleUpRule?.action).toBe('scale_up');
      expect(cpuScaleUpRule?.enabled).toBe(true);
    });

    test('should evaluate scaling up when CPU is high', () => {
      const metrics = {
        timestamp: new Date(),
        cpuUtilization: 85, // Above threshold (70%)
        memoryUtilization: 60,
        requestsPerSecond: 100,
        responseTime: 500,
        errorRate: 1,
        activeConnections: 50,
        queueLength: 0
      };

      const decision = scalingManager.evaluateScaling(metrics);
      
      expect(decision.shouldScale).toBe(true);
      expect(decision.direction).toBe('up');
      expect(decision.triggeredRules).toContain('cpu-scale-up');
      expect(decision.confidence).toBeGreaterThan(0);
    });

    test('should evaluate scaling down when CPU is low', () => {
      const metrics = {
        timestamp: new Date(),
        cpuUtilization: 20, // Below scale-down threshold (35%)
        memoryUtilization: 30,
        requestsPerSecond: 10,
        responseTime: 200,
        errorRate: 0.5,
        activeConnections: 5,
        queueLength: 0
      };

      const decision = scalingManager.evaluateScaling(metrics);
      
      expect(decision.shouldScale).toBe(true);
      expect(decision.direction).toBe('down');
      expect(decision.triggeredRules).toContain('cpu-scale-down');
    });

    test('should not scale when within normal thresholds', () => {
      const metrics = {
        timestamp: new Date(),
        cpuUtilization: 60, // Within normal range
        memoryUtilization: 65,
        requestsPerSecond: 50,
        responseTime: 800,
        errorRate: 2,
        activeConnections: 25,
        queueLength: 0
      };

      const decision = scalingManager.evaluateScaling(metrics);
      
      expect(decision.shouldScale).toBe(false);
      expect(decision.direction).toBe('none');
    });

    test('should calculate optimal instances correctly', () => {
      const highLoadMetrics = {
        timestamp: new Date(),
        cpuUtilization: 140, // 140% of target (70%)
        memoryUtilization: 160, // 160% of target (80%)
        requestsPerSecond: 200,
        responseTime: 1500,
        errorRate: 3,
        activeConnections: 100,
        queueLength: 10
      };

      const decision = scalingManager.evaluateScaling(highLoadMetrics);
      
      // Should suggest scaling up based on high utilization
      expect(decision.estimatedInstances).toBeGreaterThan(1);
      expect(decision.estimatedInstances).toBeLessThanOrEqual(defaultScalingConfig.maxInstances);
    });

    test('should provide scaling recommendations', () => {
      // Add some metrics history
      const metrics = [
        { cpuUtilization: 80, memoryUtilization: 75, responseTime: 1200 },
        { cpuUtilization: 85, memoryUtilization: 80, responseTime: 1400 },
        { cpuUtilization: 90, memoryUtilization: 85, responseTime: 1600 }
      ];

      metrics.forEach(metric => {
        scalingManager.evaluateScaling({
          timestamp: new Date(),
          requestsPerSecond: 50,
          errorRate: 2,
          activeConnections: 25,
          queueLength: 0,
          ...metric
        });
      });

      const recommendations = scalingManager.getScalingRecommendations();
      
      expect(recommendations.currentInstances).toBe(1);
      expect(recommendations.recommendedInstances).toBeGreaterThan(1);
      expect(recommendations.reasoning.length).toBeGreaterThan(0);
      expect(recommendations.costImpact).toContain('Increased cost');
      expect(recommendations.performanceImpact).toContain('Improved performance');
    });

    test('should add and manage custom scaling rules', () => {
      const customRule = {
        id: 'custom-response-time',
        name: 'Custom Response Time Rule',
        metric: 'responseTime',
        threshold: 1500,
        comparison: 'greater_than' as const,
        action: 'scale_up' as const,
        cooldown: 300000,
        enabled: true
      };

      scalingManager.addScalingRule(customRule);
      
      const rules = scalingManager.getScalingRules();
      const addedRule = rules.find(rule => rule.id === 'custom-response-time');
      
      expect(addedRule).toBeDefined();
      expect(addedRule?.threshold).toBe(1500);
    });

    test('should update scaling rule', () => {
      const updated = scalingManager.updateScalingRule('cpu-scale-up', {
        threshold: 80,
        enabled: false
      });

      expect(updated).toBe(true);
      
      const rules = scalingManager.getScalingRules();
      const updatedRule = rules.find(rule => rule.id === 'cpu-scale-up');
      
      expect(updatedRule?.threshold).toBe(80);
      expect(updatedRule?.enabled).toBe(false);
    });

    test('should remove scaling rule', () => {
      const removed = scalingManager.removeScalingRule('cpu-scale-up');
      expect(removed).toBe(true);
      
      const rules = scalingManager.getScalingRules();
      const removedRule = rules.find(rule => rule.id === 'cpu-scale-up');
      
      expect(removedRule).toBeUndefined();
    });
  });

  describe('PerformanceBottleneckDetector', () => {
    let detector: PerformanceBottleneckDetector;

    beforeEach(() => {
      detector = new PerformanceBottleneckDetector();
    });

    test('should detect high response time bottleneck', () => {
      const performanceData = {
        timestamp: new Date(),
        metrics: {
          responseTime: 3500, // Above critical threshold (3000ms)
          throughput: 15,
          errorRate: 2,
          cpuUsage: 60,
          memoryUsage: 70,
          diskUsage: 50,
          networkLatency: 100,
          cacheHitRatio: 85,
          databaseQueryTime: 200,
          bundleSize: 800,
          coreWebVitals: {
            lcp: 2000,
            fid: 80,
            cls: 0.05,
            fcp: 1500,
            ttfb: 600
          }
        }
      };

      const alerts = detector.analyzePerformance(performanceData);
      
      expect(alerts.length).toBeGreaterThan(0);
      const responseTimeAlert = alerts.find(alert => alert.metric === 'responseTime');
      expect(responseTimeAlert).toBeDefined();
      expect(responseTimeAlert?.type).toBe('critical');
    });

    test('should detect memory leak pattern', () => {
      // Simulate increasing memory usage over time
      const memoryUsages = [60, 62, 65, 68, 72, 75, 78, 82, 85, 88];
      
      memoryUsages.forEach(memoryUsage => {
        detector.analyzePerformance({
          timestamp: new Date(),
          metrics: {
            responseTime: 1000,
            throughput: 20,
            errorRate: 1,
            cpuUsage: 50,
            memoryUsage,
            diskUsage: 40,
            networkLatency: 100,
            cacheHitRatio: 90,
            databaseQueryTime: 150,
            bundleSize: 600,
            coreWebVitals: {
              lcp: 1800,
              fid: 60,
              cls: 0.03,
              fcp: 1200,
              ttfb: 400
            }
          }
        });
      });

      const alerts = detector.getActiveAlerts();
      const memoryLeakAlert = alerts.find(alert => 
        alert.component === 'memory' && alert.message.includes('memory leak')
      );
      
      expect(memoryLeakAlert).toBeDefined();
    });

    test('should detect database bottleneck', () => {
      const performanceData = {
        timestamp: new Date(),
        metrics: {
          responseTime: 2500,
          throughput: 10,
          errorRate: 1,
          cpuUsage: 40,
          memoryUsage: 60,
          diskUsage: 45,
          networkLatency: 80,
          cacheHitRatio: 85,
          databaseQueryTime: 1500, // High database query time
          bundleSize: 700,
          coreWebVitals: {
            lcp: 2200,
            fid: 90,
            cls: 0.04,
            fcp: 1400,
            ttfb: 800
          }
        }
      };

      const alerts = detector.analyzePerformance(performanceData);
      
      const databaseAlert = alerts.find(alert => 
        alert.component === 'database' || alert.metric === 'databaseQueryTime'
      );
      
      expect(databaseAlert).toBeDefined();
      expect(databaseAlert?.suggestions).toContain('Optimize slow database queries');
    });

    test('should perform comprehensive bottleneck analysis', () => {
      // Add some performance data
      const performanceData = {
        timestamp: new Date(),
        metrics: {
          responseTime: 2000,
          throughput: 8, // Below warning threshold
          errorRate: 6, // Above warning threshold
          cpuUsage: 85, // Above warning threshold
          memoryUsage: 90, // Above warning threshold
          diskUsage: 50,
          networkLatency: 150,
          cacheHitRatio: 70, // Below warning threshold
          databaseQueryTime: 800,
          bundleSize: 1200,
          coreWebVitals: {
            lcp: 3000,
            fid: 150,
            cls: 0.15,
            fcp: 2000,
            ttfb: 900
          }
        }
      };

      detector.analyzePerformance(performanceData);
      
      const analysis = detector.performBottleneckAnalysis();
      
      expect(analysis.severity).toBe('high');
      expect(analysis.bottlenecks.length).toBeGreaterThan(0);
      expect(analysis.recommendations.length).toBeGreaterThan(0);
      expect(analysis.rootCause).toBeTruthy();
      expect(analysis.estimatedFixTime).toBeTruthy();
    });

    test('should resolve alerts', () => {
      const performanceData = {
        timestamp: new Date(),
        metrics: {
          responseTime: 4000, // Critical threshold
          throughput: 15,
          errorRate: 2,
          cpuUsage: 60,
          memoryUsage: 70,
          diskUsage: 50,
          networkLatency: 100,
          cacheHitRatio: 85,
          databaseQueryTime: 200,
          bundleSize: 800,
          coreWebVitals: {
            lcp: 2000,
            fid: 80,
            cls: 0.05,
            fcp: 1500,
            ttfb: 600
          }
        }
      };

      const alerts = detector.analyzePerformance(performanceData);
      expect(alerts.length).toBeGreaterThan(0);
      
      const alertId = alerts[0].id;
      detector.resolveAlert(alertId);
      
      const activeAlerts = detector.getActiveAlerts();
      const resolvedAlert = activeAlerts.find(alert => alert.id === alertId);
      
      expect(resolvedAlert).toBeUndefined();
    });
  });

  describe('CDNOptimizer', () => {
    let cdnOptimizer: CDNOptimizer;

    beforeEach(() => {
      cdnOptimizer = new CDNOptimizer(defaultCDNConfig);
    });

    test('should generate appropriate cache headers for static assets', () => {
      const jsHeaders = cdnOptimizer.generateCacheHeaders('/static/app.js', 'application/javascript');
      
      expect(jsHeaders['Cache-Control']).toContain('public');
      expect(jsHeaders['Cache-Control']).toContain('max-age=31536000'); // 1 year
      expect(jsHeaders['ETag']).toBeDefined();
    });

    test('should generate different cache headers for HTML', () => {
      const htmlHeaders = cdnOptimizer.generateCacheHeaders('/index.html', 'text/html');
      
      expect(htmlHeaders['Cache-Control']).toContain('max-age=3600'); // 1 hour
      expect(htmlHeaders['Vary']).toBe('Accept-Encoding');
    });

    test('should optimize image delivery based on browser support', () => {
      const optimization = cdnOptimizer.optimizeImageDelivery(
        '/images/product.jpg',
        'Mozilla/5.0 (Chrome/91.0)',
        'image/avif,image/webp,image/jpeg'
      );
      
      expect(optimization.format).toBe('avif'); // Best supported format
      expect(optimization.quality).toBe(80); // Default quality
      expect(optimization.optimizedPath).toContain('_q80.avif');
    });

    test('should reduce quality for slow connections', () => {
      const optimization = cdnOptimizer.optimizeImageDelivery(
        '/images/product.jpg',
        'Mozilla/5.0 (Mobile; 3G)',
        'image/webp,image/jpeg'
      );
      
      expect(optimization.quality).toBeLessThan(80); // Reduced quality
      expect(optimization.format).toBe('webp');
    });

    test('should analyze CDN performance', () => {
      const analysis = cdnOptimizer.analyzePerformance();
      
      expect(analysis.score).toBeGreaterThanOrEqual(0);
      expect(analysis.score).toBeLessThanOrEqual(100);
      expect(Array.isArray(analysis.issues)).toBe(true);
      expect(Array.isArray(analysis.recommendations)).toBe(true);
    });

    test('should generate Vercel-specific configuration', () => {
      const config = cdnOptimizer.generateCDNConfig();
      
      expect(config.headers).toBeDefined();
      expect(config.images).toBeDefined();
      expect(config.images.formats).toContain('avif');
      expect(config.images.formats).toContain('webp');
    });
  });

  describe('Integration Tests', () => {
    test('should integrate scaling decisions with bottleneck detection', () => {
      const scalingManager = new AutoScalingManager(defaultScalingConfig);
      const detector = new PerformanceBottleneckDetector();

      const highLoadMetrics = {
        timestamp: new Date(),
        cpuUtilization: 90,
        memoryUtilization: 85,
        requestsPerSecond: 150,
        responseTime: 2500,
        errorRate: 8,
        activeConnections: 200,
        queueLength: 15
      };

      // Evaluate scaling
      const scalingDecision = scalingManager.evaluateScaling(highLoadMetrics);
      
      // Detect bottlenecks
      const bottleneckAlerts = detector.analyzePerformance({
        timestamp: new Date(),
        metrics: {
          ...highLoadMetrics,
          diskUsage: 60,
          networkLatency: 200,
          cacheHitRatio: 75,
          databaseQueryTime: 800,
          bundleSize: 1000,
          coreWebVitals: {
            lcp: 3000,
            fid: 200,
            cls: 0.2,
            fcp: 2200,
            ttfb: 1200
          }
        }
      });

      // Both should indicate issues
      expect(scalingDecision.shouldScale).toBe(true);
      expect(scalingDecision.direction).toBe('up');
      expect(bottleneckAlerts.length).toBeGreaterThan(0);
      
      // Should have complementary recommendations
      const analysis = detector.performBottleneckAnalysis();
      expect(analysis.severity).toBe('critical');
    });
  });
});