/**
 * Setup script for User Flow Validation Framework
 * Initializes the framework and loads test cases
 */

import { userFlowValidationFramework } from './framework';
import { testCaseManager } from './framework/test-case-manager';
import { allTestCases, testCasesByCategory } from './config/test-cases';

/**
 * Initialize the user flow validation framework
 */
export async function setupUserFlowValidation(): Promise<void> {
  console.log('Setting up User Flow Validation Framework...');

  try {
    // Initialize the framework
    await userFlowValidationFramework.initialize({
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      defaultBrowsers: ['chrome', 'firefox', 'safari', 'edge'],
      defaultDevices: ['desktop-1920', 'desktop-1366', 'ipad', 'iphone', 'android-phone'],
      screenshotPath: '__tests__/user-flow-validation/screenshots',
      reportPath: '__tests__/user-flow-validation/reports'
    });

    // Create or get the main test suite
    const suiteId = 'user-flow-validation';
    let testSuite = testCaseManager.getTestSuite(suiteId);
    
    if (!testSuite) {
      testSuite = testCaseManager.createTestSuite(
        suiteId,
        'User Flow Validation Suite',
        'Comprehensive validation of user flows for bibiere luxury fashion e-commerce website'
      );
    }

    // Load all predefined test cases
    console.log(`Loading ${allTestCases.length} test cases...`);
    
    allTestCases.forEach(testCase => {
      testCaseManager.addTestCase(suiteId, testCase);
    });

    // Log setup summary
    const status = userFlowValidationFramework.getStatus();
    console.log('Framework setup complete!');
    console.log(`- Test Suites: ${status.testSuites}`);
    console.log(`- Total Test Cases: ${status.totalTestCases}`);
    console.log(`- Supported Browsers: ${status.supportedBrowsers.join(', ')}`);
    console.log(`- Supported Devices: ${status.supportedDevices.join(', ')}`);

    // Log test cases by category
    console.log('\nTest Cases by Category:');
    Object.entries(testCasesByCategory).forEach(([category, cases]) => {
      console.log(`- ${category}: ${cases.length} test cases`);
    });

  } catch (error) {
    console.error('Failed to setup User Flow Validation Framework:', error);
    throw error;
  }
}

/**
 * Validate framework setup
 */
export function validateSetup(): boolean {
  try {
    const status = userFlowValidationFramework.getStatus();
    
    // Check if we have test suites and test cases
    if (status.testSuites === 0) {
      console.error('No test suites found');
      return false;
    }

    if (status.totalTestCases === 0) {
      console.error('No test cases found');
      return false;
    }

    // Check if we have supported browsers and devices
    if (status.supportedBrowsers.length === 0) {
      console.error('No supported browsers configured');
      return false;
    }

    if (status.supportedDevices.length === 0) {
      console.error('No supported devices configured');
      return false;
    }

    console.log('Framework setup validation passed!');
    return true;

  } catch (error) {
    console.error('Framework setup validation failed:', error);
    return false;
  }
}

/**
 * Get framework configuration summary
 */
export function getSetupSummary(): {
  framework: string;
  version: string;
  testSuites: number;
  testCases: number;
  browsers: string[];
  devices: string[];
  categories: string[];
  priorities: { high: number; medium: number; low: number };
} {
  const status = userFlowValidationFramework.getStatus();
  const testSuite = testCaseManager.getTestSuite('user-flow-validation');
  
  const priorities = {
    high: 0,
    medium: 0,
    low: 0
  };

  if (testSuite) {
    testSuite.testCases.forEach(testCase => {
      priorities[testCase.priority]++;
    });
  }

  const categories = testSuite 
    ? Array.from(new Set(testSuite.testCases.map(tc => tc.category)))
    : [];

  return {
    framework: 'User Flow Validation Framework',
    version: '1.0.0',
    testSuites: status.testSuites,
    testCases: status.totalTestCases,
    browsers: status.supportedBrowsers,
    devices: status.supportedDevices,
    categories,
    priorities
  };
}

/**
 * Reset framework (for testing purposes)
 */
export function resetFramework(): void {
  console.log('Resetting User Flow Validation Framework...');
  
  // This would clear all test suites and results
  // Implementation would depend on the specific reset requirements
  console.log('Framework reset complete');
}

// Auto-setup when module is imported (can be disabled with environment variable)
// Disable auto-setup in test environment to avoid conflicts
if (process.env.AUTO_SETUP_VALIDATION !== 'false' && process.env.NODE_ENV !== 'test' && !process.env.JEST_WORKER_ID) {
  setupUserFlowValidation().catch(error => {
    console.error('Auto-setup failed:', error);
  });
}