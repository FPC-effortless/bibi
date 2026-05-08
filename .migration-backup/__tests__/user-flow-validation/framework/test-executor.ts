/**
 * Test Execution Engine for User Flow Validation
 * Orchestrates test execution across browsers and devices
 */

import { TestCase, TestSuite, ValidationResult, Issue, testCaseManager } from './test-case-manager';
import { browserEnvironment, DeviceConfig, BrowserConfig } from './browser-environment';
import { validationReporter } from './validation-reporter';

export interface ExecutionConfig {
  browsers: string[];
  devices: string[];
  parallel: boolean;
  maxConcurrency: number;
  timeout: number;
  retryCount: number;
  screenshotOnFailure: boolean;
  baseUrl: string;
}

export interface ExecutionContext {
  browsers: string[];
  devices: string[];
  browser: string;
  device: string;
  viewport: string;
  baseUrl: string;
  timeout: number;
}

export interface TestStepResult {
  stepIndex: number;
  action: string;
  element: string;
  success: boolean;
  error?: string;
  screenshot?: string;
  executionTime: number;
}

export class TestExecutor {
  private defaultConfig: ExecutionConfig = {
    browsers: ['chrome'],
    devices: ['desktop-1920'],
    parallel: false,
    maxConcurrency: 3,
    timeout: 30000,
    retryCount: 1,
    screenshotOnFailure: true,
    baseUrl: 'http://localhost:3000'
  };

  /**
   * Execute test suite across specified browsers and devices
   */
  async executeTestSuite(
    suiteId: string,
    config: Partial<ExecutionConfig> = {}
  ): Promise<ValidationResult[]> {
    const executionConfig = { ...this.defaultConfig, ...config };
    const testSuite = testCaseManager.getTestSuite(suiteId);
    
    if (!testSuite) {
      throw new Error(`Test suite ${suiteId} not found`);
    }

    console.log(`Starting execution of test suite: ${testSuite.name}`);
    console.log(`Configuration:`, executionConfig);

    const results: ValidationResult[] = [];
    const testMatrix = this.generateTestMatrix(executionConfig);

    if (executionConfig.parallel) {
      results.push(...await this.executeParallel(testSuite, testMatrix, executionConfig));
    } else {
      results.push(...await this.executeSequential(testSuite, testMatrix, executionConfig));
    }

    // Record results in test case manager
    results.forEach(result => {
      testCaseManager.recordResult(suiteId, result);
    });

    console.log(`Test suite execution completed. Total results: ${results.length}`);
    return results;
  }

  /**
   * Execute single test case
   */
  async executeTestCase(
    testCase: TestCase,
    context: ExecutionContext
  ): Promise<ValidationResult> {
    const startTime = Date.now();
    console.log(`Executing test case: ${testCase.name} on ${context.browser}/${context.device}`);

    const result: ValidationResult = {
      testCaseId: testCase.id,
      status: 'passed',
      issues: [],
      screenshots: [],
      timestamp: new Date(),
      browser: context.browser,
      device: context.device,
      viewport: context.viewport,
      executionTime: 0
    };

    try {
      // Execute test steps
      const stepResults = await this.executeTestSteps(testCase, context);
      
      // Analyze step results for issues
      const issues = this.analyzeStepResults(testCase, stepResults);
      result.issues = issues;
      
      // Determine overall status
      if (issues.some(issue => issue.severity === 'critical')) {
        result.status = 'failed';
      } else if (issues.some(issue => issue.severity === 'major')) {
        result.status = 'warning';
      }

      // Collect screenshots from failed steps
      result.screenshots = stepResults
        .filter(step => step.screenshot)
        .map(step => step.screenshot!);

    } catch (error) {
      console.error(`Test case execution failed: ${error}`);
      result.status = 'failed';
      result.issues.push({
        severity: 'critical',
        description: `Test execution failed: ${error}`,
        element: 'test-execution',
        expectedBehavior: 'Test should execute without errors',
        actualBehavior: `Error: ${error}`,
        reproductionSteps: ['Execute test case', 'Observe error']
      });
    }

    result.executionTime = Date.now() - startTime;
    console.log(`Test case completed in ${result.executionTime}ms with status: ${result.status}`);
    
    return result;
  }

  /**
   * Execute test steps for a test case
   */
  private async executeTestSteps(
    testCase: TestCase,
    context: ExecutionContext
  ): Promise<TestStepResult[]> {
    const stepResults: TestStepResult[] = [];

    for (let i = 0; i < testCase.steps.length; i++) {
      const step = testCase.steps[i];
      const stepStartTime = Date.now();

      console.log(`  Step ${i + 1}: ${step.action} on ${step.target || step.element || 'unknown'}`);

      try {
        // Simulate step execution (in real implementation, this would interact with browser)
        const success = await this.executeStep(step, context);
        
        const stepResult: TestStepResult = {
          stepIndex: i,
          action: step.action,
          element: step.element,
          success,
          executionTime: Date.now() - stepStartTime
        };

        // Take screenshot on failure if configured
        if (!success && context.browser) {
          stepResult.screenshot = await this.takeScreenshot(context, `step-${i + 1}-failure`);
        }

        stepResults.push(stepResult);

        // Stop execution on critical failures
        if (!success && this.isCriticalStep(step)) {
          console.log(`  Critical step failed, stopping execution`);
          break;
        }

      } catch (error) {
        console.error(`  Step ${i + 1} failed with error: ${error}`);
        stepResults.push({
          stepIndex: i,
          action: step.action,
          element: step.element,
          success: false,
          error: String(error),
          executionTime: Date.now() - stepStartTime
        });
        break;
      }
    }

    return stepResults;
  }

  /**
   * Execute individual test step (simulated)
   */
  private async executeStep(step: any, context: ExecutionContext): Promise<boolean> {
    // Simulate step execution with random success/failure
    // In real implementation, this would use Playwright/Puppeteer to interact with browser
    
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    // Simulate different success rates based on step type
    const successRate = this.getStepSuccessRate(step.action);
    return Math.random() < successRate;
  }

  /**
   * Get simulated success rate for different step types
   */
  private getStepSuccessRate(action: string): number {
    const rates: { [key: string]: number } = {
      'click': 0.95,
      'type': 0.90,
      'navigate': 0.98,
      'wait': 0.99,
      'verify': 0.85,
      'scroll': 0.97,
      'hover': 0.92,
      'select': 0.88
    };

    const actionType = action.toLowerCase().split(' ')[0];
    return rates[actionType] || 0.90;
  }

  /**
   * Check if step is critical for test execution
   */
  private isCriticalStep(step: any): boolean {
    const criticalActions = ['navigate', 'login', 'load'];
    return criticalActions.some(action => 
      step.action.toLowerCase().includes(action)
    );
  }

  /**
   * Analyze step results to identify issues
   */
  private analyzeStepResults(testCase: TestCase, stepResults: TestStepResult[]): Issue[] {
    const issues: Issue[] = [];

    stepResults.forEach((stepResult, index) => {
      if (!stepResult.success) {
        const step = testCase.steps[index];
        const severity = this.determineSeverity(step, stepResult);
        
        issues.push({
          severity,
          description: `Step failed: ${step.action}`,
          element: step.element,
          expectedBehavior: step.expectedBehavior,
          actualBehavior: stepResult.error || 'Step execution failed',
          reproductionSteps: [
            `Navigate to test page`,
            `Perform action: ${step.action}`,
            `Target element: ${step.element}`,
            `Observe failure`
          ],
          screenshot: stepResult.screenshot
        });
      }
    });

    return issues;
  }

  /**
   * Determine issue severity based on step and result
   */
  private determineSeverity(step: any, stepResult: TestStepResult): Issue['severity'] {
    // Critical: Navigation, core functionality failures
    if (this.isCriticalStep(step)) {
      return 'critical';
    }

    // Major: Important user interactions
    if (step.action.includes('click') || step.action.includes('submit')) {
      return 'major';
    }

    // Minor: Visual or secondary functionality
    return 'minor';
  }

  /**
   * Take screenshot (simulated)
   */
  private async takeScreenshot(context: ExecutionContext, name: string): Promise<string> {
    // Simulate screenshot capture
    const filename = `screenshot-${context.browser}-${context.device}-${name}-${Date.now()}.png`;
    console.log(`  Taking screenshot: ${filename}`);
    return filename;
  }

  /**
   * Generate test execution matrix
   */
  private generateTestMatrix(config: ExecutionConfig): Array<{
    browser: string;
    device: string;
    browserConfig: BrowserConfig;
    deviceConfig: DeviceConfig;
  }> {
    const matrix: Array<{
      browser: string;
      device: string;
      browserConfig: BrowserConfig;
      deviceConfig: DeviceConfig;
    }> = [];

    for (const browser of config.browsers) {
      for (const device of config.devices) {
        const browserConfig = browserEnvironment.getBrowserConfig(browser);
        const deviceConfig = browserEnvironment.getDeviceConfig(device);

        if (browserConfig && deviceConfig) {
          matrix.push({
            browser,
            device,
            browserConfig,
            deviceConfig
          });
        }
      }
    }

    return matrix;
  }

  /**
   * Execute tests in parallel
   */
  private async executeParallel(
    testSuite: TestSuite,
    testMatrix: any[],
    config: ExecutionConfig
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    const semaphore = new Array(config.maxConcurrency).fill(null);
    
    const executeTestCaseOnMatrix = async (testCase: TestCase, matrixItem: any) => {
      const context: ExecutionContext = {
        browsers: [matrixItem.browser],
        devices: [matrixItem.device],
        browser: matrixItem.browser,
        device: matrixItem.device,
        viewport: `${matrixItem.deviceConfig.viewport.width}x${matrixItem.deviceConfig.viewport.height}`,
        baseUrl: config.baseUrl,
        timeout: config.timeout
      };

      return await this.executeTestCase(testCase, context);
    };

    // Execute all test cases across all matrix combinations
    const promises: Promise<ValidationResult>[] = [];
    
    for (const testCase of testSuite.testCases) {
      for (const matrixItem of testMatrix) {
        promises.push(executeTestCaseOnMatrix(testCase, matrixItem));
      }
    }

    // Wait for all executions to complete
    const allResults = await Promise.allSettled(promises);
    
    allResults.forEach(result => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.error('Test execution failed:', result.reason);
      }
    });

    return results;
  }

  /**
   * Execute tests sequentially
   */
  private async executeSequential(
    testSuite: TestSuite,
    testMatrix: any[],
    config: ExecutionConfig
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (const testCase of testSuite.testCases) {
      for (const matrixItem of testMatrix) {
        const context: ExecutionContext = {
          browsers: [matrixItem.browser],
          devices: [matrixItem.device],
          browser: matrixItem.browser,
          device: matrixItem.device,
          viewport: `${matrixItem.deviceConfig.viewport.width}x${matrixItem.deviceConfig.viewport.height}`,
          baseUrl: config.baseUrl,
          timeout: config.timeout
        };

        try {
          const result = await this.executeTestCase(testCase, context);
          results.push(result);
        } catch (error) {
          console.error(`Failed to execute test case ${testCase.id}:`, error);
        }
      }
    }

    return results;
  }

  /**
   * Execute specific test cases by IDs
   */
  async executeTestCases(
    suiteId: string,
    testCaseIds: string[],
    config: Partial<ExecutionConfig> = {}
  ): Promise<ValidationResult[]> {
    const executionConfig = { ...this.defaultConfig, ...config };
    const testSuite = testCaseManager.getTestSuite(suiteId);
    
    if (!testSuite) {
      throw new Error(`Test suite ${suiteId} not found`);
    }

    const testCases = testSuite.testCases.filter(tc => testCaseIds.includes(tc.id));
    const testMatrix = this.generateTestMatrix(executionConfig);
    const results: ValidationResult[] = [];

    for (const testCase of testCases) {
      for (const matrixItem of testMatrix) {
        const context: ExecutionContext = {
          browsers: [matrixItem.browser],
          devices: [matrixItem.device],
          browser: matrixItem.browser,
          device: matrixItem.device,
          viewport: `${matrixItem.deviceConfig.viewport.width}x${matrixItem.deviceConfig.viewport.height}`,
          baseUrl: executionConfig.baseUrl,
          timeout: executionConfig.timeout
        };

        const result = await this.executeTestCase(testCase, context);
        results.push(result);
        
        // Record result
        testCaseManager.recordResult(suiteId, result);
      }
    }

    return results;
  }

  /**
   * Validate test environment
   */
  async validateEnvironment(config: ExecutionConfig): Promise<{
    valid: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    // Validate browsers
    for (const browser of config.browsers) {
      const isAvailable = await browserEnvironment.validateBrowserAvailability(browser);
      if (!isAvailable) {
        issues.push(`Browser ${browser} is not available`);
      }
    }

    // Validate devices
    for (const device of config.devices) {
      const deviceConfig = browserEnvironment.getDeviceConfig(device);
      if (!deviceConfig) {
        issues.push(`Device configuration ${device} not found`);
      }
    }

    // Validate base URL
    try {
      new URL(config.baseUrl);
    } catch (error) {
      issues.push(`Invalid base URL: ${config.baseUrl}`);
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

// Export singleton instance
export const testExecutor = new TestExecutor();