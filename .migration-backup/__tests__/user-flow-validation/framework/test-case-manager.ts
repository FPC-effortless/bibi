/**
 * Test Case Management System for User Flow Validation
 * Tracks validation results and manages test execution
 */

export interface TestStep {
  id: string;
  description: string;
  action: string;
  target: string;
  expectedResult: string;
  element?: string;
  expectedBehavior?: string;
  validationCriteria?: string[];
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  userType: 'registered' | 'unregistered' | 'both';
  category: 'navigation' | 'product-discovery' | 'shopping' | 'account' | 'mobile' | 'accessibility' | 'error-handling' | 'cross-browser' | 'accessibility-keyboard' | 'account-management' | 'error-handling-loading' | 'mobile-responsiveness';
  steps: TestStep[];
  expectedResults: string[];
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'passed' | 'failed' | 'blocked';
  requirements: string[];
}

export interface Issue {
  severity: 'critical' | 'major' | 'minor';
  description: string;
  element: string;
  expectedBehavior: string;
  actualBehavior: string;
  reproductionSteps: string[];
  screenshot?: string;
}

export interface ValidationResult {
  testCaseId: string;
  status: 'passed' | 'failed' | 'warning';
  issues: Issue[];
  screenshots: string[];
  timestamp: Date;
  browser: string;
  device: string;
  viewport: string;
  executionTime: number;
}

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  testCases: TestCase[];
  results: ValidationResult[];
  createdAt: Date;
  updatedAt: Date;
}

export class TestCaseManager {
  private testSuites: Map<string, TestSuite> = new Map();
  private results: Map<string, ValidationResult[]> = new Map();

  /**
   * Create a new test suite
   */
  createTestSuite(id: string, name: string, description: string): TestSuite {
    const testSuite: TestSuite = {
      id,
      name,
      description,
      testCases: [],
      results: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.testSuites.set(id, testSuite);
    return testSuite;
  }

  /**
   * Add test case to a suite
   */
  addTestCase(suiteId: string, testCase: TestCase): void {
    const suite = this.testSuites.get(suiteId);
    if (suite) {
      suite.testCases.push(testCase);
      suite.updatedAt = new Date();
    }
  }

  /**
   * Record validation result
   */
  recordResult(suiteId: string, result: ValidationResult): void {
    const suite = this.testSuites.get(suiteId);
    if (suite) {
      suite.results.push(result);
      suite.updatedAt = new Date();
    }

    // Also store in results map for quick access
    const existingResults = this.results.get(result.testCaseId) || [];
    existingResults.push(result);
    this.results.set(result.testCaseId, existingResults);
  }

  /**
   * Get test suite by ID
   */
  getTestSuite(id: string): TestSuite | undefined {
    return this.testSuites.get(id);
  }

  /**
   * Get all test suites
   */
  getAllTestSuites(): TestSuite[] {
    return Array.from(this.testSuites.values());
  }

  /**
   * Get results for a specific test case
   */
  getTestCaseResults(testCaseId: string): ValidationResult[] {
    return this.results.get(testCaseId) || [];
  }

  /**
   * Get test cases by category
   */
  getTestCasesByCategory(suiteId: string, category: TestCase['category']): TestCase[] {
    const suite = this.testSuites.get(suiteId);
    return suite ? suite.testCases.filter(tc => tc.category === category) : [];
  }

  /**
   * Get test cases by priority
   */
  getTestCasesByPriority(suiteId: string, priority: TestCase['priority']): TestCase[] {
    const suite = this.testSuites.get(suiteId);
    return suite ? suite.testCases.filter(tc => tc.priority === priority) : [];
  }

  /**
   * Update test case status
   */
  updateTestCaseStatus(suiteId: string, testCaseId: string, status: TestCase['status']): void {
    const suite = this.testSuites.get(suiteId);
    if (suite) {
      const testCase = suite.testCases.find(tc => tc.id === testCaseId);
      if (testCase) {
        testCase.status = status;
        suite.updatedAt = new Date();
      }
    }
  }

  /**
   * Generate test summary report
   */
  generateSummaryReport(suiteId: string): {
    totalTests: number;
    passed: number;
    failed: number;
    pending: number;
    blocked: number;
    criticalIssues: number;
    majorIssues: number;
    minorIssues: number;
  } {
    const suite = this.testSuites.get(suiteId);
    if (!suite) {
      return {
        totalTests: 0,
        passed: 0,
        failed: 0,
        pending: 0,
        blocked: 0,
        criticalIssues: 0,
        majorIssues: 0,
        minorIssues: 0
      };
    }

    const summary = {
      totalTests: suite.testCases.length,
      passed: 0,
      failed: 0,
      pending: 0,
      blocked: 0,
      criticalIssues: 0,
      majorIssues: 0,
      minorIssues: 0
    };

    // Count test statuses
    suite.testCases.forEach(testCase => {
      summary[testCase.status]++;
    });

    // Count issues by severity
    suite.results.forEach(result => {
      result.issues.forEach(issue => {
        if (issue.severity === 'critical') summary.criticalIssues++;
        else if (issue.severity === 'major') summary.majorIssues++;
        else summary.minorIssues++;
      });
    });

    return summary;
  }

  /**
   * Export test suite data
   */
  exportTestSuite(suiteId: string): string {
    const suite = this.testSuites.get(suiteId);
    return suite ? JSON.stringify(suite, null, 2) : '';
  }

  /**
   * Import test suite data
   */
  importTestSuite(data: string): void {
    try {
      const suite: TestSuite = JSON.parse(data);
      this.testSuites.set(suite.id, suite);
      
      // Rebuild results map
      suite.results.forEach(result => {
        const existingResults = this.results.get(result.testCaseId) || [];
        existingResults.push(result);
        this.results.set(result.testCaseId, existingResults);
      });
    } catch (error) {
      throw new Error(`Failed to import test suite: ${error}`);
    }
  }
}

// Singleton instance
export const testCaseManager = new TestCaseManager();