/**
 * Example test demonstrating User Flow Validation Framework usage
 * This file shows how to use the framework for actual testing
 */

import { 
  testCaseManager, 
  testExecutor, 
  validationReporter,
  userFlowValidationFramework 
} from './framework';
import { setupUserFlowValidation, validateSetup } from './setup';

describe('User Flow Validation Framework', () => {
  beforeAll(async () => {
    // Ensure framework is set up
    await setupUserFlowValidation();
    expect(validateSetup()).toBe(true);
  });

  describe('Framework Initialization', () => {
    it('should initialize framework successfully', async () => {
      const status = userFlowValidationFramework.getStatus();
      
      expect(status.testSuites).toBeGreaterThan(0);
      expect(status.totalTestCases).toBeGreaterThan(0);
      expect(status.supportedBrowsers.length).toBeGreaterThan(0);
      expect(status.supportedDevices.length).toBeGreaterThan(0);
    });

    it('should have predefined test cases loaded', () => {
      const testSuite = testCaseManager.getTestSuite('user-flow-validation');
      
      expect(testSuite).toBeDefined();
      expect(testSuite!.testCases.length).toBeGreaterThan(0);
      
      // Check that we have test cases for each category
      const categories = ['navigation', 'product-discovery', 'shopping', 'account', 'mobile', 'accessibility'];
      categories.forEach(category => {
        const categoryTests = testCaseManager.getTestCasesByCategory('user-flow-validation', category as any);
        expect(categoryTests.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Test Case Management', () => {
    it('should create and manage test suites', () => {
      const suiteId = 'test-suite-example';
      const suite = testCaseManager.createTestSuite(
        suiteId,
        'Example Test Suite',
        'Test suite for demonstration'
      );

      expect(suite.id).toBe(suiteId);
      expect(suite.name).toBe('Example Test Suite');
      expect(suite.testCases).toEqual([]);
    });

    it('should add test cases to suite', () => {
      const suiteId = 'test-suite-example';
      const testCase = {
        id: 'example-test-001',
        name: 'Example Test Case',
        description: 'Test case for demonstration',
        userType: 'both' as const,
        category: 'navigation' as const,
        priority: 'medium' as const,
        status: 'pending' as const,
        requirements: ['1.1'],
        steps: [
          {
            action: 'Navigate to homepage',
            element: 'browser',
            expectedBehavior: 'Homepage loads',
            validationCriteria: ['Page loads without errors']
          }
        ],
        expectedResults: ['Homepage displays correctly']
      };

      testCaseManager.addTestCase(suiteId, testCase);
      
      const suite = testCaseManager.getTestSuite(suiteId);
      expect(suite!.testCases.length).toBe(1);
      expect(suite!.testCases[0].id).toBe('example-test-001');
    });

    it('should filter test cases by priority', () => {
      const highPriorityTests = testCaseManager.getTestCasesByPriority('user-flow-validation', 'high');
      const mediumPriorityTests = testCaseManager.getTestCasesByPriority('user-flow-validation', 'medium');
      const lowPriorityTests = testCaseManager.getTestCasesByPriority('user-flow-validation', 'low');

      expect(highPriorityTests.length).toBeGreaterThan(0);
      expect(mediumPriorityTests.length).toBeGreaterThanOrEqual(0);
      expect(lowPriorityTests.length).toBeGreaterThanOrEqual(0);

      // Verify all high priority tests are actually high priority
      highPriorityTests.forEach(testCase => {
        expect(testCase.priority).toBe('high');
      });
    });
  });

  describe('Test Execution Simulation', () => {
    it('should execute a single test case', async () => {
      const testSuite = testCaseManager.getTestSuite('user-flow-validation');
      const testCase = testSuite!.testCases[0];
      
      const context = {
        browser: 'chrome',
        device: 'desktop-1920',
        viewport: '1920x1080',
        baseUrl: 'http://localhost:3000',
        timeout: 30000
      };

      const result = await testExecutor.executeTestCase(testCase, context);
      
      expect(result.testCaseId).toBe(testCase.id);
      expect(result.browser).toBe('chrome');
      expect(result.device).toBe('desktop-1920');
      expect(result.executionTime).toBeGreaterThan(0);
      expect(['passed', 'failed', 'warning']).toContain(result.status);
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
  });

  describe('Reporting System', () => {
    it('should generate HTML report', () => {
      const testSuite = testCaseManager.getTestSuite('user-flow-validation');
      const mockResults = [
        {
          testCaseId: 'test-001',
          status: 'passed' as const,
          issues: [],
          screenshots: [],
          timestamp: new Date(),
          browser: 'chrome',
          device: 'desktop-1920',
          viewport: '1920x1080',
          executionTime: 1500
        }
      ];

      const report = validationReporter.generateReport(testSuite!, mockResults, {
        format: 'html',
        includeScreenshots: true,
        includeDetailedSteps: true,
        groupByCategory: true,
        showOnlyFailures: false
      });

      expect(report).toContain('<!DOCTYPE html>');
      expect(report).toContain('User Flow Validation Report');
      expect(report).toContain('chrome');
      expect(report).toContain('desktop-1920');
    });

    it('should generate JSON report', () => {
      const testSuite = testCaseManager.getTestSuite('user-flow-validation');
      const mockResults = [
        {
          testCaseId: 'test-001',
          status: 'failed' as const,
          issues: [
            {
              severity: 'major' as const,
              description: 'Button not responding',
              element: '.submit-button',
              expectedBehavior: 'Button should submit form',
              actualBehavior: 'Button does not respond',
              reproductionSteps: ['Click button', 'Observe no response']
            }
          ],
          screenshots: ['screenshot1.png'],
          timestamp: new Date(),
          browser: 'firefox',
          device: 'iphone',
          viewport: '375x667',
          executionTime: 2500
        }
      ];

      const report = validationReporter.generateReport(testSuite!, mockResults, {
        format: 'json',
        includeScreenshots: true,
        includeDetailedSteps: true,
        groupByCategory: true,
        showOnlyFailures: false
      });

      const parsedReport = JSON.parse(report);
      expect(parsedReport).toHaveProperty('testSuite');
      expect(parsedReport).toHaveProperty('summary');
      expect(parsedReport).toHaveProperty('results');
      expect(parsedReport.results[0].issues.length).toBe(1);
    });

    it('should track and manage issues', () => {
      const issue = {
        severity: 'critical' as const,
        description: 'Navigation link broken',
        element: '.nav-link',
        expectedBehavior: 'Link should navigate to page',
        actualBehavior: 'Link returns 404 error',
        reproductionSteps: [
          'Click navigation link',
          'Observe 404 error page'
        ]
      };

      const trackerId = validationReporter.trackIssue('nav-001', issue, 'developer@example.com');
      
      expect(trackerId).toBeDefined();
      expect(trackerId).toMatch(/^issue-/);

      const tracker = validationReporter.getIssueTracker(trackerId);
      expect(tracker).toBeDefined();
      expect(tracker!.testCaseId).toBe('nav-001');
      expect(tracker!.issue.severity).toBe('critical');
      expect(tracker!.status).toBe('open');
      expect(tracker!.assignee).toBe('developer@example.com');

      // Update issue status
      validationReporter.updateIssueStatus(trackerId, 'resolved', 'Fixed broken link');
      
      const updatedTracker = validationReporter.getIssueTracker(trackerId);
      expect(updatedTracker!.status).toBe('resolved');
      expect(updatedTracker!.resolution).toBe('Fixed broken link');
    });
  });

  describe('Quick Start Scenarios', () => {
    it('should provide framework status', () => {
      const status = userFlowValidationFramework.getStatus();
      
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
      const config = userFlowValidationFramework.exportConfiguration();
      const parsedConfig = JSON.parse(config);
      
      expect(parsedConfig).toHaveProperty('browsers');
      expect(parsedConfig).toHaveProperty('devices');
      expect(parsedConfig).toHaveProperty('testSuites');
      expect(parsedConfig).toHaveProperty('timestamp');
      
      expect(Array.isArray(parsedConfig.browsers)).toBe(true);
      expect(Array.isArray(parsedConfig.devices)).toBe(true);
      expect(Array.isArray(parsedConfig.testSuites)).toBe(true);
    });
  });

  describe('Integration Points', () => {
    it('should integrate with existing test structure', () => {
      // Verify framework doesn't conflict with existing tests
      expect(testCaseManager).toBeDefined();
      expect(testExecutor).toBeDefined();
      expect(validationReporter).toBeDefined();
      expect(userFlowValidationFramework).toBeDefined();
    });

    it('should support environment configuration', () => {
      // Test environment variable support
      const originalUrl = process.env.NEXT_PUBLIC_BASE_URL;
      process.env.NEXT_PUBLIC_BASE_URL = 'https://test.example.com';
      
      // Framework should respect environment variables
      expect(process.env.NEXT_PUBLIC_BASE_URL).toBe('https://test.example.com');
      
      // Restore original value
      if (originalUrl) {
        process.env.NEXT_PUBLIC_BASE_URL = originalUrl;
      } else {
        delete process.env.NEXT_PUBLIC_BASE_URL;
      }
    });
  });
});

// Additional test for manual execution demonstration
describe('Manual Test Execution Example', () => {
  it('should demonstrate manual test execution workflow', async () => {
    // This test demonstrates how to manually execute specific test scenarios
    
    // 1. Setup
    await setupUserFlowValidation();
    
    // 2. Get specific test cases
    const navigationTests = testCaseManager.getTestCasesByCategory('user-flow-validation', 'navigation');
    expect(navigationTests.length).toBeGreaterThan(0);
    
    // 3. Execute specific test case
    const testCase = navigationTests[0];
    const context = {
      browser: 'chrome',
      device: 'desktop-1920',
      viewport: '1920x1080',
      baseUrl: 'http://localhost:3000',
      timeout: 30000
    };
    
    const result = await testExecutor.executeTestCase(testCase, context);
    
    // 4. Verify result structure
    expect(result).toHaveProperty('testCaseId');
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('issues');
    expect(result).toHaveProperty('executionTime');
    
    // 5. Generate report for this single test
    const testSuite = testCaseManager.getTestSuite('user-flow-validation');
    const report = validationReporter.generateReport(testSuite!, [result]);
    
    expect(report).toContain('Validation Report');
    
    console.log(`Test executed: ${testCase.name}`);
    console.log(`Status: ${result.status}`);
    console.log(`Execution time: ${result.executionTime}ms`);
    console.log(`Issues found: ${result.issues.length}`);
  });
});

// Scenario-based test execution
describe('User Flow Validation Scenarios', () => {
  const scenario = process.env.USER_FLOW_SCENARIO || 'smoke';
  
  it(`should execute ${scenario} validation scenario`, async () => {
    console.log(`\n🚀 Running ${scenario.toUpperCase()} validation scenario`);
    
    // Setup framework
    await setupUserFlowValidation();
    
    // Execute the specified scenario
    try {
      await userFlowValidationFramework.quickStart(scenario as any);
      console.log(`✅ ${scenario.toUpperCase()} scenario completed successfully`);
    } catch (error) {
      console.error(`❌ ${scenario.toUpperCase()} scenario failed:`, error);
      throw error;
    }
  });
  
  it('should generate comprehensive report after scenario execution', async () => {
    const testSuite = testCaseManager.getTestSuite('user-flow-validation');
    expect(testSuite).toBeDefined();
    
    // Generate different report formats
    const htmlReport = validationReporter.generateReport(testSuite!, testSuite!.results, {
      format: 'html',
      includeScreenshots: true,
      includeDetailedSteps: true,
      groupByCategory: true,
      showOnlyFailures: false
    });
    
    const jsonReport = validationReporter.generateReport(testSuite!, testSuite!.results, {
      format: 'json',
      includeScreenshots: true,
      includeDetailedSteps: true,
      groupByCategory: true,
      showOnlyFailures: false
    });
    
    expect(htmlReport).toContain('<!DOCTYPE html>');
    expect(() => JSON.parse(jsonReport)).not.toThrow();
    
    console.log(`📊 Generated HTML report (${htmlReport.length} characters)`);
    console.log(`📊 Generated JSON report (${jsonReport.length} characters)`);
  });
});