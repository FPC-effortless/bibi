/**
 * User Flow Validation Testing Framework
 * Main entry point for the validation framework
 */

// Import framework components
import { TestCaseManager, testCaseManager } from './test-case-manager';
import { BrowserEnvironment, browserEnvironment } from './browser-environment';
import { ValidationReporter, validationReporter } from './validation-reporter';
import { TestExecutor, testExecutor } from './test-executor';

// Re-export framework components
export { TestCaseManager, testCaseManager };
export { BrowserEnvironment, browserEnvironment };
export { ValidationReporter, validationReporter };
export { TestExecutor, testExecutor };

// Type definitions
export type {
  TestCase,
  TestStep,
  TestSuite,
  ValidationResult,
  Issue
} from './test-case-manager';

export type {
  BrowserConfig,
  ViewportConfig,
  DeviceConfig
} from './browser-environment';

export type {
  ReportConfig,
  IssueTracker,
  TestExecutionSummary
} from './validation-reporter';

export type {
  ExecutionConfig,
  ExecutionContext,
  TestStepResult
} from './test-executor';

// Import types for internal use
import type { ExecutionConfig } from './test-executor';

/**
 * Framework initialization and configuration
 */
export class UserFlowValidationFramework {
  private static instance: UserFlowValidationFramework;
  
  private constructor() {}

  static getInstance(): UserFlowValidationFramework {
    if (!UserFlowValidationFramework.instance) {
      UserFlowValidationFramework.instance = new UserFlowValidationFramework();
    }
    return UserFlowValidationFramework.instance;
  }

  /**
   * Initialize the framework with default configuration
   */
  async initialize(config?: {
    baseUrl?: string;
    defaultBrowsers?: string[];
    defaultDevices?: string[];
    screenshotPath?: string;
    reportPath?: string;
  }): Promise<void> {
    console.log('Initializing User Flow Validation Framework...');
    
    // Set default configuration
    const defaultConfig = {
      baseUrl: 'http://localhost:3000',
      defaultBrowsers: ['chrome', 'firefox', 'safari', 'edge'],
      defaultDevices: ['desktop-1920', 'ipad', 'iphone'],
      screenshotPath: '__tests__/user-flow-validation/screenshots',
      reportPath: '__tests__/user-flow-validation/reports',
      ...config
    };

    // Validate environment
    console.log('Validating browser environment...');
    const supportedBrowsers = browserEnvironment.getSupportedBrowsers();
    const supportedDevices = browserEnvironment.getSupportedDevices();
    
    console.log(`Supported browsers: ${supportedBrowsers.join(', ')}`);
    console.log(`Supported devices: ${supportedDevices.join(', ')}`);

    // Create default test suite if none exists
    const existingSuites = testCaseManager.getAllTestSuites();
    if (existingSuites.length === 0) {
      console.log('Creating default test suite...');
      testCaseManager.createTestSuite(
        'user-flow-validation',
        'User Flow Validation Suite',
        'Comprehensive validation of user flows for bibiere luxury fashion e-commerce website'
      );
    }

    console.log('Framework initialization complete!');
  }

  /**
   * Quick start method for common validation scenarios
   */
  async quickStart(scenario: 'full' | 'smoke' | 'mobile' | 'accessibility' = 'smoke'): Promise<void> {
    console.log(`Starting quick validation scenario: ${scenario}`);

    const suiteId = 'user-flow-validation';
    let config: Partial<ExecutionConfig> = {};

    switch (scenario) {
      case 'full':
        config = {
          browsers: ['chrome', 'firefox', 'safari', 'edge'],
          devices: ['desktop-1920', 'desktop-1366', 'ipad', 'iphone', 'android-phone'],
          parallel: true,
          maxConcurrency: 3
        };
        break;
      
      case 'smoke':
        config = {
          browsers: ['chrome'],
          devices: ['desktop-1920'],
          parallel: false
        };
        break;
      
      case 'mobile':
        config = {
          browsers: ['chrome', 'safari'],
          devices: ['iphone', 'iphone-pro', 'android-phone'],
          parallel: true,
          maxConcurrency: 2
        };
        break;
      
      case 'accessibility':
        config = {
          browsers: ['chrome'],
          devices: ['desktop-1920'],
          parallel: false
        };
        break;
    }

    try {
      // Execute test suite
      const results = await testExecutor.executeTestSuite(suiteId, config);
      
      // Generate report
      const testSuite = testCaseManager.getTestSuite(suiteId);
      if (testSuite) {
        const report = validationReporter.generateReport(testSuite, results, {
          includeScreenshots: true,
          includeDetailedSteps: true,
          groupByCategory: true,
          showOnlyFailures: false,
          format: 'html'
        });

        console.log('Validation complete! Report generated.');
        console.log(`Total tests: ${results.length}`);
        console.log(`Passed: ${results.filter(r => r.status === 'passed').length}`);
        console.log(`Failed: ${results.filter(r => r.status === 'failed').length}`);
        console.log(`Warnings: ${results.filter(r => r.status === 'warning').length}`);
      }
    } catch (error) {
      console.error('Quick start validation failed:', error);
      throw error;
    }
  }

  /**
   * Get framework status and statistics
   */
  getStatus(): {
    testSuites: number;
    totalTestCases: number;
    supportedBrowsers: string[];
    supportedDevices: string[];
    recentResults: number;
  } {
    const testSuites = testCaseManager.getAllTestSuites();
    const totalTestCases = testSuites.reduce((sum, suite) => sum + suite.testCases.length, 0);
    const recentResults = testSuites.reduce((sum, suite) => sum + suite.results.length, 0);

    return {
      testSuites: testSuites.length,
      totalTestCases,
      supportedBrowsers: browserEnvironment.getSupportedBrowsers(),
      supportedDevices: browserEnvironment.getSupportedDevices(),
      recentResults
    };
  }

  /**
   * Export framework configuration
   */
  exportConfiguration(): string {
    const config = {
      browsers: browserEnvironment.getSupportedBrowsers(),
      devices: browserEnvironment.getSupportedDevices(),
      testSuites: testCaseManager.getAllTestSuites().map(suite => ({
        id: suite.id,
        name: suite.name,
        testCaseCount: suite.testCases.length
      })),
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(config, null, 2);
  }
}

// Export singleton instance
export const userFlowValidationFramework = UserFlowValidationFramework.getInstance();

// Default export for convenience
export default userFlowValidationFramework;