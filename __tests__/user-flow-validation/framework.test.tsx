/**
 * User Flow Validation Framework Tests
 * Tests the framework components without auto-setup
 */

import { 
  TestCaseManager,
  BrowserEnvironment,
  ValidationReporter,
  TestExecutor,
  UserFlowValidationFramework
} from './framework';

describe('User Flow Validation Framework Components', () => {
  describe('TestCaseManager', () => {
    let testCaseManager: TestCaseManager;

    beforeEach(() => {
      testCaseManager = new TestCaseManager();
    });

    it('should create test suite', () => {
      const suite = testCaseManager.createTestSuite(
        'test-suite',
        'Test Suite',
        'Test description'
      );

      expect(suite.id).toBe('test-suite');
      expect(suite.name).toBe('Test Suite');
      expect(suite.description).toBe('Test description');
      expect(suite.testCases).toEqual([]);
    });

    it('should add test case to suite', () => {
      testCaseManager.createTestSuite('test-suite', 'Test Suite', 'Description');
      
      const testCase = {
        id: 'test-001',
        name: 'Test Case',
        description: 'Test description',
        userType: 'both' as const,
        category: 'navigation' as const,
        priority: 'high' as const,
        status: 'pending' as const,
        requirements: ['1.1'],
        steps: [],
        expectedResults: []
      };

      testCaseManager.addTestCase('test-suite', testCase);
      
      const suite = testCaseManager.getTestSuite('test-suite');
      expect(suite?.testCases.length).toBe(1);
      expect(suite?.testCases[0].id).toBe('test-001');
    });

    it('should generate summary report', () => {
      testCaseManager.createTestSuite('test-suite', 'Test Suite', 'Description');
      
      const summary = testCaseManager.generateSummaryReport('test-suite');
      
      expect(summary).toHaveProperty('totalTests');
      expect(summary).toHaveProperty('passed');
      expect(summary).toHaveProperty('failed');
      expect(summary).toHaveProperty('pending');
      expect(summary).toHaveProperty('blocked');
    });
  });

  describe('BrowserEnvironment', () => {
    let browserEnvironment: BrowserEnvironment;

    beforeEach(() => {
      browserEnvironment = BrowserEnvironment.getInstance();
    });

    it('should provide supported browsers', () => {
      const browsers = browserEnvironment.getSupportedBrowsers();
      
      expect(Array.isArray(browsers)).toBe(true);
      expect(browsers.length).toBeGreaterThan(0);
      expect(browsers).toContain('chrome');
    });

    it('should provide supported devices', () => {
      const devices = browserEnvironment.getSupportedDevices();
      
      expect(Array.isArray(devices)).toBe(true);
      expect(devices.length).toBeGreaterThan(0);
      expect(devices).toContain('desktop-1920');
    });

    it('should get browser configuration', () => {
      const config = browserEnvironment.getBrowserConfig('chrome');
      
      expect(config).toBeDefined();
      expect(config?.name).toBe('Chrome');
      expect(Array.isArray(config?.args)).toBe(true);
    });

    it('should get device configuration', () => {
      const config = browserEnvironment.getDeviceConfig('desktop-1920');
      
      expect(config).toBeDefined();
      expect(config?.name).toBe('Desktop 1920x1080');
      expect(config?.category).toBe('desktop');
    });

    it('should generate test matrix', () => {
      const matrix = browserEnvironment.generateTestMatrix();
      
      expect(Array.isArray(matrix)).toBe(true);
      expect(matrix.length).toBeGreaterThan(0);
      
      const firstItem = matrix[0];
      expect(firstItem).toHaveProperty('browser');
      expect(firstItem).toHaveProperty('device');
      expect(firstItem).toHaveProperty('config');
    });

    it('should get recommended test combinations', () => {
      const combinations = browserEnvironment.getRecommendedTestCombinations();
      
      expect(Array.isArray(combinations)).toBe(true);
      expect(combinations.length).toBeGreaterThan(0);
      
      const firstCombination = combinations[0];
      expect(firstCombination).toHaveProperty('browser');
      expect(firstCombination).toHaveProperty('device');
    });
  });

  describe('ValidationReporter', () => {
    let validationReporter: ValidationReporter;
    let testSuite: any;
    let mockResults: any[];

    beforeEach(() => {
      validationReporter = new ValidationReporter();
      
      testSuite = {
        id: 'test-suite',
        name: 'Test Suite',
        description: 'Test description',
        testCases: [],
        results: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockResults = [
        {
          testCaseId: 'test-001',
          status: 'passed',
          issues: [],
          screenshots: [],
          timestamp: new Date(),
          browser: 'chrome',
          device: 'desktop-1920',
          viewport: '1920x1080',
          executionTime: 1500
        }
      ];
    });

    it('should generate HTML report', () => {
      const report = validationReporter.generateReport(testSuite, mockResults, {
        format: 'html',
        includeScreenshots: true,
        includeDetailedSteps: true,
        groupByCategory: true,
        showOnlyFailures: false
      });

      expect(report).toContain('<!DOCTYPE html>');
      expect(report).toContain('Test Suite');
      expect(report).toContain('chrome');
      expect(report).toContain('desktop-1920');
    });

    it('should generate JSON report', () => {
      const report = validationReporter.generateReport(testSuite, mockResults, {
        format: 'json',
        includeScreenshots: true,
        includeDetailedSteps: true,
        groupByCategory: true,
        showOnlyFailures: false
      });

      expect(() => JSON.parse(report)).not.toThrow();
      
      const parsedReport = JSON.parse(report);
      expect(parsedReport).toHaveProperty('testSuite');
      expect(parsedReport).toHaveProperty('summary');
      expect(parsedReport).toHaveProperty('results');
    });

    it('should track issues', () => {
      const issue = {
        severity: 'major' as const,
        description: 'Test issue',
        element: '.test-element',
        expectedBehavior: 'Should work',
        actualBehavior: 'Does not work',
        reproductionSteps: ['Step 1', 'Step 2']
      };

      const trackerId = validationReporter.trackIssue('test-001', issue);
      
      expect(trackerId).toBeDefined();
      expect(trackerId).toMatch(/^issue-/);

      const tracker = validationReporter.getIssueTracker(trackerId);
      expect(tracker).toBeDefined();
      expect(tracker?.testCaseId).toBe('test-001');
      expect(tracker?.issue.severity).toBe('major');
      expect(tracker?.status).toBe('open');
    });
  });

  describe('TestExecutor', () => {
    let testExecutor: TestExecutor;

    beforeEach(() => {
      testExecutor = new TestExecutor();
    });

    it('should validate execution environment', async () => {
      const config = {
        browsers: ['chrome'],
        devices: ['desktop-1920'],
        parallel: false,
        maxConcurrency: 1,
        timeout: 30000,
        retryCount: 1,
        screenshotOnFailure: true,
        baseUrl: 'http://localhost:3000'
      };

      const validation = await testExecutor.validateEnvironment(config);
      
      expect(validation).toHaveProperty('valid');
      expect(validation).toHaveProperty('issues');
      expect(Array.isArray(validation.issues)).toBe(true);
    });

    it('should execute test case', async () => {
      const testCase = {
        id: 'test-001',
        name: 'Test Case',
        description: 'Test description',
        userType: 'both' as const,
        category: 'navigation' as const,
        priority: 'high' as const,
        status: 'pending' as const,
        requirements: ['1.1'],
        steps: [
          {
            action: 'Navigate to homepage',
            element: 'browser',
            expectedBehavior: 'Page loads',
            validationCriteria: ['Page loads without errors']
          }
        ],
        expectedResults: ['Homepage displays correctly']
      };

      const context = {
        browser: 'chrome',
        device: 'desktop-1920',
        viewport: '1920x1080',
        baseUrl: 'http://localhost:3000',
        timeout: 30000
      };

      const result = await testExecutor.executeTestCase(testCase, context);
      
      expect(result).toHaveProperty('testCaseId');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('issues');
      expect(result).toHaveProperty('executionTime');
      expect(result.testCaseId).toBe('test-001');
      expect(['passed', 'failed', 'warning']).toContain(result.status);
    });
  });

  describe('UserFlowValidationFramework', () => {
    let framework: UserFlowValidationFramework;

    beforeEach(() => {
      framework = UserFlowValidationFramework.getInstance();
    });

    it('should be a singleton', () => {
      const framework2 = UserFlowValidationFramework.getInstance();
      expect(framework).toBe(framework2);
    });

    it('should provide status', () => {
      const status = framework.getStatus();
      
      expect(status).toHaveProperty('testSuites');
      expect(status).toHaveProperty('totalTestCases');
      expect(status).toHaveProperty('supportedBrowsers');
      expect(status).toHaveProperty('supportedDevices');
      expect(status).toHaveProperty('recentResults');
      
      expect(typeof status.testSuites).toBe('number');
      expect(typeof status.totalTestCases).toBe('number');
      expect(Array.isArray(status.supportedBrowsers)).toBe(true);
      expect(Array.isArray(status.supportedDevices)).toBe(true);
    });

    it('should export configuration', () => {
      const config = framework.exportConfiguration();
      
      expect(() => JSON.parse(config)).not.toThrow();
      
      const parsedConfig = JSON.parse(config);
      expect(parsedConfig).toHaveProperty('browsers');
      expect(parsedConfig).toHaveProperty('devices');
      expect(parsedConfig).toHaveProperty('testSuites');
      expect(parsedConfig).toHaveProperty('timestamp');
    });
  });
});

describe('Framework Integration', () => {
  it('should have all components available', () => {
    expect(TestCaseManager).toBeDefined();
    expect(BrowserEnvironment).toBeDefined();
    expect(ValidationReporter).toBeDefined();
    expect(TestExecutor).toBeDefined();
    expect(UserFlowValidationFramework).toBeDefined();
  });

  it('should create framework instance', () => {
    const framework = UserFlowValidationFramework.getInstance();
    expect(framework).toBeDefined();
    expect(typeof framework.getStatus).toBe('function');
    expect(typeof framework.exportConfiguration).toBe('function');
  });
});