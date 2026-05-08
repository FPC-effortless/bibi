/**
 * @jest-environment node
 */

import LoadTestRunner from '../../scripts/load-testing';
import PerformanceRegressionTester from '../../scripts/performance-regression-test';
import { dbPerformanceMonitor } from '../../lib/database-performance-monitor';

// Mock HTTP requests for testing
jest.mock('https');
jest.mock('http');

describe('Performance Testing Framework', () => {
  describe('LoadTestRunner', () => {
    let loadTest: LoadTestRunner;

    beforeEach(() => {
      loadTest = new LoadTestRunner({
        baseUrl: 'http://localhost:3000',
        maxConcurrentUsers: 5,
        testDuration: 1000, // 1 second for fast tests
        rampUpTime: 200
      });
    });

    test('should initialize with default configuration', () => {
      const defaultLoadTest = new LoadTestRunner();
      expect(defaultLoadTest.config.baseUrl).toBe('http://localhost:3000');
      expect(defaultLoadTest.config.maxConcurrentUsers).toBe(100);
      expect(defaultLoadTest.config.testDuration).toBe(60000);
    });

    test('should have default test scenarios', () => {
      const scenarios = loadTest.getDefaultScenarios();
      expect(scenarios).toHaveLength(5);
      expect(scenarios[0].name).toBe('Homepage Load');
      expect(scenarios[0].path).toBe('/');
      expect(scenarios[0].method).toBe('GET');
    });

    test('should select scenarios based on weight', () => {
      const scenarios = [
        { name: 'Test1', path: '/', weight: 70, method: 'GET' },
        { name: 'Test2', path: '/test', weight: 30, method: 'GET' }
      ];
      
      loadTest.config.scenarios = scenarios;
      
      // Run multiple selections to test distribution
      const selections = Array.from({ length: 100 }, () => loadTest.selectScenario());
      const test1Count = selections.filter(s => s.name === 'Test1').length;
      const test2Count = selections.filter(s => s.name === 'Test2').length;
      
      // Should roughly follow the weight distribution (70/30)
      expect(test1Count).toBeGreaterThan(test2Count);
      expect(test1Count).toBeGreaterThan(50); // Should be around 70
    });

    test('should calculate metrics correctly', () => {
      // Mock some test results
      loadTest.results.requests = [
        { scenario: 'Test', responseTime: 100, statusCode: 200, timestamp: Date.now(), success: true },
        { scenario: 'Test', responseTime: 200, statusCode: 200, timestamp: Date.now(), success: true },
        { scenario: 'Test', responseTime: 300, statusCode: 500, timestamp: Date.now(), success: false }
      ];
      loadTest.results.metrics.totalRequests = 3;
      loadTest.results.metrics.successfulRequests = 2;
      loadTest.results.metrics.failedRequests = 1;

      loadTest.calculateMetrics();

      expect(loadTest.results.metrics.averageResponseTime).toBe(200);
      expect(loadTest.results.metrics.errorRate).toBe(33.33333333333333);
    });
  });

  describe('PerformanceRegressionTester', () => {
    let regressionTester: PerformanceRegressionTester;

    beforeEach(() => {
      regressionTester = new PerformanceRegressionTester({
        testSuites: [
          {
            name: 'Quick Test',
            config: {
              maxConcurrentUsers: 2,
              testDuration: 500,
              rampUpTime: 100
            }
          }
        ]
      });
    });

    test('should initialize with default test suites', () => {
      const defaultTester = new PerformanceRegressionTester();
      expect(defaultTester.config.testSuites).toHaveLength(3);
      expect(defaultTester.config.testSuites[0].name).toBe('Light Load Test');
    });

    test('should detect performance regressions', () => {
      const currentMetrics = {
        averageResponseTime: 1200,
        p95ResponseTime: 2000,
        errorRate: 8,
        requestsPerSecond: 15
      };

      const baselineMetrics = {
        averageResponseTime: 1000,
        p95ResponseTime: 1500,
        errorRate: 2,
        requestsPerSecond: 20
      };

      regressionTester.compareWithBaseline('Test Suite', currentMetrics, baselineMetrics);

      expect(regressionTester.results.regressions.length).toBeGreaterThan(0);
      
      // Should detect response time regression (20% increase)
      const responseTimeRegression = regressionTester.results.regressions.find(
        r => r.metric === 'averageResponseTime'
      );
      expect(responseTimeRegression).toBeDefined();
      expect(parseFloat(responseTimeRegression!.percentChange)).toBe(20);
    });

    test('should detect performance improvements', () => {
      const currentMetrics = {
        averageResponseTime: 800,
        p95ResponseTime: 1200,
        errorRate: 1,
        requestsPerSecond: 25
      };

      const baselineMetrics = {
        averageResponseTime: 1000,
        p95ResponseTime: 1500,
        errorRate: 2,
        requestsPerSecond: 20
      };

      regressionTester.compareWithBaseline('Test Suite', currentMetrics, baselineMetrics);

      expect(regressionTester.results.improvements.length).toBeGreaterThan(0);
      
      // Should detect throughput improvement
      const throughputImprovement = regressionTester.results.improvements.find(
        i => i.metric === 'requestsPerSecond'
      );
      expect(throughputImprovement).toBeDefined();
    });

    test('should generate summary correctly', () => {
      regressionTester.results.testResults = [
        {
          name: 'Test1',
          metrics: { averageResponseTime: 100, errorRate: 1 },
          timestamp: new Date().toISOString()
        },
        {
          name: 'Test2',
          metrics: { averageResponseTime: 200, errorRate: 2 },
          timestamp: new Date().toISOString()
        }
      ];

      regressionTester.generateSummary();

      expect(regressionTester.results.summary.totalTests).toBe(2);
      expect(regressionTester.results.summary.averageMetrics.averageResponseTime).toBe(150);
      expect(regressionTester.results.summary.averageMetrics.errorRate).toBe(1.5);
    });
  });

  describe('DatabasePerformanceMonitor', () => {
    beforeEach(() => {
      // Clear any existing data
      dbPerformanceMonitor.cleanup(0);
    });

    test('should record query metrics', () => {
      const queryMetrics = {
        query: 'SELECT * FROM products WHERE id = $1',
        executionTime: 150,
        timestamp: new Date(),
        parameters: ['123']
      };

      dbPerformanceMonitor.recordQuery(queryMetrics);
      
      const stats = dbPerformanceMonitor.getQueryStats(1);
      expect(stats).toHaveLength(1);
      expect(stats[0].totalExecutions).toBe(1);
      expect(stats[0].averageExecutionTime).toBe(150);
    });

    test('should normalize similar queries', () => {
      const queries = [
        'SELECT * FROM products WHERE id = $1',
        'SELECT * FROM products WHERE id = $2',
        'SELECT * FROM products WHERE id = 123',
        'SELECT * FROM products WHERE id = 456'
      ];

      queries.forEach((query, index) => {
        dbPerformanceMonitor.recordQuery({
          query,
          executionTime: 100 + index * 10,
          timestamp: new Date()
        });
      });

      const stats = dbPerformanceMonitor.getQueryStats();
      // All queries should be normalized to the same pattern
      expect(stats).toHaveLength(1);
      expect(stats[0].totalExecutions).toBe(4);
    });

    test('should track slow queries', () => {
      const slowQuery = {
        query: 'SELECT * FROM products',
        executionTime: 2000, // 2 seconds - above threshold
        timestamp: new Date()
      };

      dbPerformanceMonitor.recordQuery(slowQuery);
      
      const alerts = dbPerformanceMonitor.getRecentAlerts();
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('slow_query');
      expect(alerts[0].severity).toBe('high');
    });

    test('should calculate percentiles correctly', () => {
      const query = 'SELECT * FROM test';
      
      // Record multiple executions with different times
      const executionTimes = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
      executionTimes.forEach(time => {
        dbPerformanceMonitor.recordQuery({
          query,
          executionTime: time,
          timestamp: new Date()
        });
      });

      const stats = dbPerformanceMonitor.getQueryStats(1);
      expect(stats[0].p95ExecutionTime).toBe(950); // 95th percentile
      expect(stats[0].averageExecutionTime).toBe(550);
      expect(stats[0].minExecutionTime).toBe(100);
      expect(stats[0].maxExecutionTime).toBe(1000);
    });

    test('should generate performance recommendations', () => {
      // Add some test data that should trigger recommendations
      
      // Slow query
      dbPerformanceMonitor.recordQuery({
        query: 'SELECT * FROM products WHERE name LIKE ?',
        executionTime: 1500,
        timestamp: new Date()
      });

      // Frequent query
      for (let i = 0; i < 1001; i++) {
        dbPerformanceMonitor.recordQuery({
          query: 'SELECT * FROM users WHERE id = ?',
          executionTime: 50,
          timestamp: new Date()
        });
      }

      const report = dbPerformanceMonitor.generatePerformanceReport();
      
      expect(report.recommendations.length).toBeGreaterThan(0);
      expect(report.recommendations.some(r => r.includes('slow queries'))).toBe(true);
      expect(report.recommendations.some(r => r.includes('caching'))).toBe(true);
    });

    test('should cleanup old metrics', () => {
      const oldTimestamp = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
      const recentTimestamp = new Date();

      dbPerformanceMonitor.recordQuery({
        query: 'OLD QUERY',
        executionTime: 100,
        timestamp: oldTimestamp
      });

      dbPerformanceMonitor.recordQuery({
        query: 'RECENT QUERY',
        executionTime: 100,
        timestamp: recentTimestamp
      });

      expect(dbPerformanceMonitor.getQueryStats()).toHaveLength(2);

      dbPerformanceMonitor.cleanup(24); // Clean up data older than 24 hours

      const remainingStats = dbPerformanceMonitor.getQueryStats();
      expect(remainingStats).toHaveLength(1);
      expect(remainingStats[0].query).toContain('recent query');
    });
  });

  describe('Integration Tests', () => {
    test('should integrate load testing with database monitoring', async () => {
      // This would be an integration test that runs actual load tests
      // and verifies that database performance is monitored
      
      const mockQuery = jest.fn().mockResolvedValue([{ id: 1, name: 'Test Product' }]);
      
      // Simulate database queries during load test
      for (let i = 0; i < 10; i++) {
        const startTime = performance.now();
        await mockQuery();
        const executionTime = performance.now() - startTime;
        
        dbPerformanceMonitor.recordQuery({
          query: 'SELECT * FROM products',
          executionTime,
          timestamp: new Date()
        });
      }

      const report = dbPerformanceMonitor.generatePerformanceReport();
      expect(report.summary.totalQueryExecutions).toBe(10);
      expect(mockQuery).toHaveBeenCalledTimes(10);
    });
  });
});