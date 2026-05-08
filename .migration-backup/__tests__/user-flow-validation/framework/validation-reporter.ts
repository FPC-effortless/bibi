/**
 * Validation Result Reporting and Issue Tracking System
 * Generates comprehensive reports and tracks issues across test runs
 */

import { ValidationResult, Issue, TestCase, TestSuite } from './test-case-manager';
import { DeviceConfig } from './browser-environment';

export interface ReportConfig {
  includeScreenshots: boolean;
  includeDetailedSteps: boolean;
  groupByCategory: boolean;
  showOnlyFailures: boolean;
  format: 'html' | 'json' | 'markdown' | 'csv';
}

export interface IssueTracker {
  id: string;
  testCaseId: string;
  issue: Issue;
  status: 'open' | 'in-progress' | 'resolved' | 'wont-fix';
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
  resolution?: string;
}

export interface TestExecutionSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  warningTests: number;
  executionTime: number;
  coverage: {
    browsers: string[];
    devices: string[];
    categories: string[];
  };
  issuesSummary: {
    critical: number;
    major: number;
    minor: number;
    total: number;
  };
}

export class ValidationReporter {
  private issueTrackers: Map<string, IssueTracker> = new Map();
  private reportHistory: Array<{ timestamp: Date; report: string; config: ReportConfig }> = [];

  /**
   * Generate comprehensive validation report
   */
  generateReport(
    testSuite: TestSuite,
    results: ValidationResult[],
    config: ReportConfig = {
      includeScreenshots: true,
      includeDetailedSteps: true,
      groupByCategory: true,
      showOnlyFailures: false,
      format: 'html'
    }
  ): string {
    const summary = this.generateExecutionSummary(testSuite, results);
    
    switch (config.format) {
      case 'html':
        return this.generateHTMLReport(testSuite, results, summary, config);
      case 'json':
        return this.generateJSONReport(testSuite, results, summary);
      case 'markdown':
        return this.generateMarkdownReport(testSuite, results, summary, config);
      case 'csv':
        return this.generateCSVReport(results);
      default:
        return this.generateHTMLReport(testSuite, results, summary, config);
    }
  }

  /**
   * Generate execution summary
   */
  private generateExecutionSummary(testSuite: TestSuite, results: ValidationResult[]): TestExecutionSummary {
    const browsers = new Set<string>();
    const devices = new Set<string>();
    const categories = new Set<string>();
    let totalExecutionTime = 0;
    let criticalIssues = 0;
    let majorIssues = 0;
    let minorIssues = 0;

    results.forEach(result => {
      browsers.add(result.browser);
      devices.add(result.device);
      totalExecutionTime += result.executionTime;
      
      result.issues.forEach(issue => {
        switch (issue.severity) {
          case 'critical':
            criticalIssues++;
            break;
          case 'major':
            majorIssues++;
            break;
          case 'minor':
            minorIssues++;
            break;
        }
      });
    });

    testSuite.testCases.forEach(testCase => {
      categories.add(testCase.category);
    });

    return {
      totalTests: testSuite.testCases.length,
      passedTests: results.filter(r => r.status === 'passed').length,
      failedTests: results.filter(r => r.status === 'failed').length,
      warningTests: results.filter(r => r.status === 'warning').length,
      executionTime: totalExecutionTime,
      coverage: {
        browsers: Array.from(browsers),
        devices: Array.from(devices),
        categories: Array.from(categories)
      },
      issuesSummary: {
        critical: criticalIssues,
        major: majorIssues,
        minor: minorIssues,
        total: criticalIssues + majorIssues + minorIssues
      }
    };
  }

  /**
   * Generate HTML report
   */
  private generateHTMLReport(
    testSuite: TestSuite,
    results: ValidationResult[],
    summary: TestExecutionSummary,
    config: ReportConfig
  ): string {
    const timestamp = new Date().toISOString();
    
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Flow Validation Report - ${testSuite.name}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { border-bottom: 2px solid #e1e5e9; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #2c3e50; margin: 0 0 10px 0; font-size: 28px; font-weight: 600; }
        .subtitle { color: #7f8c8d; margin: 0; font-size: 16px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #3498db; }
        .summary-card.passed { border-left-color: #27ae60; }
        .summary-card.failed { border-left-color: #e74c3c; }
        .summary-card.warning { border-left-color: #f39c12; }
        .summary-card h3 { margin: 0 0 10px 0; color: #2c3e50; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
        .summary-card .value { font-size: 24px; font-weight: 600; color: #2c3e50; }
        .section { margin-bottom: 40px; }
        .section-title { color: #2c3e50; font-size: 20px; font-weight: 600; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #e1e5e9; }
        .test-result { background: #f8f9fa; margin-bottom: 15px; border-radius: 6px; overflow: hidden; }
        .test-result.passed { border-left: 4px solid #27ae60; }
        .test-result.failed { border-left: 4px solid #e74c3c; }
        .test-result.warning { border-left: 4px solid #f39c12; }
        .test-header { padding: 15px 20px; background: white; border-bottom: 1px solid #e1e5e9; }
        .test-name { font-weight: 600; color: #2c3e50; margin-bottom: 5px; }
        .test-meta { font-size: 12px; color: #7f8c8d; }
        .test-details { padding: 20px; }
        .issue { background: #fff5f5; border: 1px solid #fed7d7; border-radius: 4px; padding: 15px; margin-bottom: 10px; }
        .issue.critical { border-color: #e53e3e; background: #fff5f5; }
        .issue.major { border-color: #dd6b20; background: #fffaf0; }
        .issue.minor { border-color: #d69e2e; background: #fffff0; }
        .issue-severity { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
        .issue-severity.critical { background: #e53e3e; color: white; }
        .issue-severity.major { background: #dd6b20; color: white; }
        .issue-severity.minor { background: #d69e2e; color: white; }
        .reproduction-steps { margin-top: 10px; }
        .reproduction-steps ol { margin: 5px 0; padding-left: 20px; }
        .coverage-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .coverage-section { background: #f8f9fa; padding: 20px; border-radius: 6px; }
        .coverage-section h4 { margin: 0 0 15px 0; color: #2c3e50; }
        .coverage-list { list-style: none; padding: 0; margin: 0; }
        .coverage-list li { padding: 5px 0; color: #495057; }
        .timestamp { text-align: right; color: #7f8c8d; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">${testSuite.name} - Validation Report</h1>
            <p class="subtitle">${testSuite.description}</p>
        </div>

        <div class="summary">
            <div class="summary-card">
                <h3>Total Tests</h3>
                <div class="value">${summary.totalTests}</div>
            </div>
            <div class="summary-card passed">
                <h3>Passed</h3>
                <div class="value">${summary.passedTests}</div>
            </div>
            <div class="summary-card failed">
                <h3>Failed</h3>
                <div class="value">${summary.failedTests}</div>
            </div>
            <div class="summary-card warning">
                <h3>Warnings</h3>
                <div class="value">${summary.warningTests}</div>
            </div>
            <div class="summary-card">
                <h3>Execution Time</h3>
                <div class="value">${(summary.executionTime / 1000).toFixed(1)}s</div>
            </div>
            <div class="summary-card">
                <h3>Total Issues</h3>
                <div class="value">${summary.issuesSummary.total}</div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Test Coverage</h2>
            <div class="coverage-grid">
                <div class="coverage-section">
                    <h4>Browsers (${summary.coverage.browsers.length})</h4>
                    <ul class="coverage-list">
                        ${summary.coverage.browsers.map(browser => `<li>${browser}</li>`).join('')}
                    </ul>
                </div>
                <div class="coverage-section">
                    <h4>Devices (${summary.coverage.devices.length})</h4>
                    <ul class="coverage-list">
                        ${summary.coverage.devices.map(device => `<li>${device}</li>`).join('')}
                    </ul>
                </div>
                <div class="coverage-section">
                    <h4>Categories (${summary.coverage.categories.length})</h4>
                    <ul class="coverage-list">
                        ${summary.coverage.categories.map(category => `<li>${category}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Test Results</h2>
            ${this.generateTestResultsHTML(results, config)}
        </div>

        <div class="timestamp">
            Generated on ${timestamp}
        </div>
    </div>
</body>
</html>`;

    this.reportHistory.push({
      timestamp: new Date(),
      report: html,
      config
    });

    return html;
  }

  /**
   * Generate test results HTML section
   */
  private generateTestResultsHTML(results: ValidationResult[], config: ReportConfig): string {
    const filteredResults = config.showOnlyFailures 
      ? results.filter(r => r.status === 'failed' || r.status === 'warning')
      : results;

    return filteredResults.map(result => `
      <div class="test-result ${result.status}">
        <div class="test-header">
          <div class="test-name">Test Case: ${result.testCaseId}</div>
          <div class="test-meta">
            ${result.browser} • ${result.device} • ${result.viewport} • 
            ${new Date(result.timestamp).toLocaleString()} • 
            ${result.executionTime}ms
          </div>
        </div>
        ${result.issues.length > 0 ? `
          <div class="test-details">
            ${result.issues.map(issue => `
              <div class="issue ${issue.severity}">
                <div>
                  <span class="issue-severity ${issue.severity}">${issue.severity}</span>
                  <strong>${issue.description}</strong>
                </div>
                <div style="margin-top: 10px;">
                  <strong>Element:</strong> ${issue.element}<br>
                  <strong>Expected:</strong> ${issue.expectedBehavior}<br>
                  <strong>Actual:</strong> ${issue.actualBehavior}
                </div>
                ${issue.reproductionSteps.length > 0 ? `
                  <div class="reproduction-steps">
                    <strong>Reproduction Steps:</strong>
                    <ol>
                      ${issue.reproductionSteps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  /**
   * Generate JSON report
   */
  private generateJSONReport(
    testSuite: TestSuite,
    results: ValidationResult[],
    summary: TestExecutionSummary
  ): string {
    const report = {
      testSuite: {
        id: testSuite.id,
        name: testSuite.name,
        description: testSuite.description
      },
      summary,
      results,
      generatedAt: new Date().toISOString()
    };

    return JSON.stringify(report, null, 2);
  }

  /**
   * Generate Markdown report
   */
  private generateMarkdownReport(
    testSuite: TestSuite,
    results: ValidationResult[],
    summary: TestExecutionSummary,
    config: ReportConfig
  ): string {
    const timestamp = new Date().toISOString();
    
    let markdown = `# ${testSuite.name} - Validation Report

${testSuite.description}

## Summary

| Metric | Value |
|--------|-------|
| Total Tests | ${summary.totalTests} |
| Passed | ${summary.passedTests} |
| Failed | ${summary.failedTests} |
| Warnings | ${summary.warningTests} |
| Execution Time | ${(summary.executionTime / 1000).toFixed(1)}s |
| Total Issues | ${summary.issuesSummary.total} |

## Issues Summary

| Severity | Count |
|----------|-------|
| Critical | ${summary.issuesSummary.critical} |
| Major | ${summary.issuesSummary.major} |
| Minor | ${summary.issuesSummary.minor} |

## Test Coverage

### Browsers
${summary.coverage.browsers.map(browser => `- ${browser}`).join('\n')}

### Devices
${summary.coverage.devices.map(device => `- ${device}`).join('\n')}

### Categories
${summary.coverage.categories.map(category => `- ${category}`).join('\n')}

## Test Results

`;

    const filteredResults = config.showOnlyFailures 
      ? results.filter(r => r.status === 'failed' || r.status === 'warning')
      : results;

    filteredResults.forEach(result => {
      markdown += `### ${result.testCaseId}

**Status:** ${result.status.toUpperCase()}  
**Browser:** ${result.browser}  
**Device:** ${result.device}  
**Viewport:** ${result.viewport}  
**Execution Time:** ${result.executionTime}ms  
**Timestamp:** ${new Date(result.timestamp).toLocaleString()}

`;

      if (result.issues.length > 0) {
        markdown += `#### Issues\n\n`;
        result.issues.forEach((issue, index) => {
          markdown += `**Issue ${index + 1}** (${issue.severity.toUpperCase()})

- **Description:** ${issue.description}
- **Element:** ${issue.element}
- **Expected:** ${issue.expectedBehavior}
- **Actual:** ${issue.actualBehavior}

`;
          if (issue.reproductionSteps.length > 0) {
            markdown += `**Reproduction Steps:**\n`;
            issue.reproductionSteps.forEach((step, stepIndex) => {
              markdown += `${stepIndex + 1}. ${step}\n`;
            });
            markdown += '\n';
          }
        });
      }

      markdown += '\n---\n\n';
    });

    markdown += `\n*Generated on ${timestamp}*`;

    return markdown;
  }

  /**
   * Generate CSV report
   */
  private generateCSVReport(results: ValidationResult[]): string {
    const headers = [
      'Test Case ID',
      'Status',
      'Browser',
      'Device',
      'Viewport',
      'Execution Time (ms)',
      'Timestamp',
      'Issues Count',
      'Critical Issues',
      'Major Issues',
      'Minor Issues'
    ];

    const rows = results.map(result => {
      const criticalCount = result.issues.filter(i => i.severity === 'critical').length;
      const majorCount = result.issues.filter(i => i.severity === 'major').length;
      const minorCount = result.issues.filter(i => i.severity === 'minor').length;

      return [
        result.testCaseId,
        result.status,
        result.browser,
        result.device,
        result.viewport,
        result.executionTime,
        new Date(result.timestamp).toISOString(),
        result.issues.length,
        criticalCount,
        majorCount,
        minorCount
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  /**
   * Track issue
   */
  trackIssue(testCaseId: string, issue: Issue, assignee?: string): string {
    const trackerId = `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const tracker: IssueTracker = {
      id: trackerId,
      testCaseId,
      issue,
      status: 'open',
      assignee,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.issueTrackers.set(trackerId, tracker);
    return trackerId;
  }

  /**
   * Update issue status
   */
  updateIssueStatus(trackerId: string, status: IssueTracker['status'], resolution?: string): void {
    const tracker = this.issueTrackers.get(trackerId);
    if (tracker) {
      tracker.status = status;
      tracker.updatedAt = new Date();
      if (resolution) {
        tracker.resolution = resolution;
      }
    }
  }

  /**
   * Get issue tracker
   */
  getIssueTracker(trackerId: string): IssueTracker | undefined {
    return this.issueTrackers.get(trackerId);
  }

  /**
   * Get all issues for a test case
   */
  getIssuesForTestCase(testCaseId: string): IssueTracker[] {
    return Array.from(this.issueTrackers.values())
      .filter(tracker => tracker.testCaseId === testCaseId);
  }

  /**
   * Get issues by status
   */
  getIssuesByStatus(status: IssueTracker['status']): IssueTracker[] {
    return Array.from(this.issueTrackers.values())
      .filter(tracker => tracker.status === status);
  }

  /**
   * Export report history
   */
  exportReportHistory(): string {
    return JSON.stringify(this.reportHistory, null, 2);
  }

  /**
   * Save report to file system
   */
  async saveReport(report: string, filename: string, format: ReportConfig['format']): Promise<void> {
    // This would typically save to file system
    // For now, we'll just log the action
    console.log(`Saving ${format} report to ${filename}`);
    console.log(`Report length: ${report.length} characters`);
  }
}

// Export singleton instance
export const validationReporter = new ValidationReporter();