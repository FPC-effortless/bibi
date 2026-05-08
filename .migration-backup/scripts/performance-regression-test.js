#!/usr/bin/env node

/**
 * Performance Regression Testing Suite
 * Compares current performance against baseline metrics
 */

const fs = require('fs').promises;
const path = require('path');
const { performance } = require('perf_hooks');
const LoadTestRunner = require('./load-testing');

class PerformanceRegressionTester {
  constructor(config = {}) {
    this.config = {
      baselineFile: config.baselineFile || 'performance-baseline.json',
      thresholds: {
        responseTimeRegression: 20, // 20% increase is considered regression
        errorRateRegression: 5, // 5% increase in error rate
        throughputRegression: 15, // 15% decrease in throughput
        ...config.thresholds
      },
      testSuites: config.testSuites || this.getDefaultTestSuites(),
      ...config
    };
    
    this.results = {
      timestamp: new Date().toISOString(),
      testResults: [],
      regressions: [],
      improvements: [],
      summary: {}
    };
  }

  getDefaultTestSuites() {
    return [
      {
        name: 'Light Load Test',
        config: {
          maxConcurrentUsers: 10,
          testDuration: 30000, // 30 seconds
          rampUpTime: 5000
        }
      },
      {
        name: 'Medium Load Test',
        config: {
          maxConcurrentUsers: 50,
          testDuration: 60000, // 1 minute
          rampUpTime: 10000
        }
      },
      {
        name: 'Heavy Load Test',
        config: {
          maxConcurrentUsers: 100,
          testDuration: 120000, // 2 minutes
          rampUpTime: 20000
        }
      }
    ];
  }

  async runRegressionTest() {
    console.log('🔍 Starting Performance Regression Test...');
    
    // Load baseline if exists
    const baseline = await this.loadBaseline();
    
    // Run all test suites
    for (const testSuite of this.config.testSuites) {
      console.log(`\n🧪 Running ${testSuite.name}...`);
      
      const loadTest = new LoadTestRunner({
        baseUrl: process.env.TEST_URL || 'http://localhost:3000',
        ...testSuite.config
      });
      
      const testResult = await loadTest.runLoadTest();
      
      const suiteResult = {
        name: testSuite.name,
        metrics: testResult.metrics,
        timestamp: new Date().toISOString()
      };
      
      this.results.testResults.push(suiteResult);
      
      // Compare with baseline if available
      if (baseline && baseline[testSuite.name]) {
        this.compareWithBaseline(testSuite.name, testResult.metrics, baseline[testSuite.name]);
      }
    }
    
    // Generate summary
    this.generateSummary();
    
    // Save current results as potential new baseline
    await this.saveResults();
    
    // Display regression analysis
    this.displayRegressionAnalysis();
    
    return this.results;
  }

  async loadBaseline() {
    try {
      const baselinePath = path.join(process.cwd(), this.config.baselineFile);
      const baselineData = await fs.readFile(baselinePath, 'utf8');
      const baseline = JSON.parse(baselineData);
      console.log(`📊 Loaded baseline from ${this.config.baselineFile}`);
      return baseline;
    } catch (error) {
      console.log(`⚠️  No baseline found at ${this.config.baselineFile}, creating new baseline`);
      return null;
    }
  }

  compareWithBaseline(testName, currentMetrics, baselineMetrics) {
    const comparisons = [
      {
        metric: 'averageResponseTime',
        current: currentMetrics.averageResponseTime,
        baseline: baselineMetrics.averageResponseTime,
        threshold: this.config.thresholds.responseTimeRegression,
        higherIsBetter: false
      },
      {
        metric: 'p95ResponseTime',
        current: currentMetrics.p95ResponseTime,
        baseline: baselineMetrics.p95ResponseTime,
        threshold: this.config.thresholds.responseTimeRegression,
        higherIsBetter: false
      },
      {
        metric: 'errorRate',
        current: currentMetrics.errorRate,
        baseline: baselineMetrics.errorRate,
        threshold: this.config.thresholds.errorRateRegression,
        higherIsBetter: false
      },
      {
        metric: 'requestsPerSecond',
        current: currentMetrics.requestsPerSecond,
        baseline: baselineMetrics.requestsPerSecond,
        threshold: this.config.thresholds.throughputRegression,
        higherIsBetter: true
      }
    ];

    comparisons.forEach(comparison => {
      const percentChange = ((comparison.current - comparison.baseline) / comparison.baseline) * 100;
      
      const isRegression = comparison.higherIsBetter 
        ? percentChange < -comparison.threshold
        : percentChange > comparison.threshold;
      
      const isImprovement = comparison.higherIsBetter
        ? percentChange > comparison.threshold
        : percentChange < -comparison.threshold;

      if (isRegression) {
        this.results.regressions.push({
          testSuite: testName,
          metric: comparison.metric,
          current: comparison.current,
          baseline: comparison.baseline,
          percentChange: percentChange.toFixed(2),
          threshold: comparison.threshold
        });
      } else if (isImprovement) {
        this.results.improvements.push({
          testSuite: testName,
          metric: comparison.metric,
          current: comparison.current,
          baseline: comparison.baseline,
          percentChange: percentChange.toFixed(2)
        });
      }
    });
  }

  generateSummary() {
    this.results.summary = {
      totalTests: this.results.testResults.length,
      regressions: this.results.regressions.length,
      improvements: this.results.improvements.length,
      overallStatus: this.results.regressions.length === 0 ? 'PASS' : 'FAIL',
      averageMetrics: this.calculateAverageMetrics()
    };
  }

  calculateAverageMetrics() {
    if (this.results.testResults.length === 0) return {};
    
    const totals = this.results.testResults.reduce((acc, result) => {
      Object.keys(result.metrics).forEach(key => {
        if (typeof result.metrics[key] === 'number') {
          acc[key] = (acc[key] || 0) + result.metrics[key];
        }
      });
      return acc;
    }, {});
    
    const averages = {};
    Object.keys(totals).forEach(key => {
      averages[key] = totals[key] / this.results.testResults.length;
    });
    
    return averages;
  }

  async saveResults() {
    // Save detailed results
    const resultsPath = path.join(process.cwd(), 'performance-test-results.json');
    await fs.writeFile(resultsPath, JSON.stringify(this.results, null, 2));
    
    // Save as new baseline if no regressions
    if (this.results.regressions.length === 0) {
      const baselineData = {};
      this.results.testResults.forEach(result => {
        baselineData[result.name] = result.metrics;
      });
      
      const baselinePath = path.join(process.cwd(), this.config.baselineFile);
      await fs.writeFile(baselinePath, JSON.stringify(baselineData, null, 2));
      console.log(`✅ Updated baseline at ${this.config.baselineFile}`);
    }
  }

  displayRegressionAnalysis() {
    console.log('\n📈 Performance Regression Analysis:');
    console.log('='.repeat(60));
    
    console.log(`Overall Status: ${this.results.summary.overallStatus === 'PASS' ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Total Tests: ${this.results.summary.totalTests}`);
    console.log(`Regressions Found: ${this.results.summary.regressions}`);
    console.log(`Improvements Found: ${this.results.summary.improvements}`);
    
    if (this.results.regressions.length > 0) {
      console.log('\n❌ Performance Regressions:');
      this.results.regressions.forEach(regression => {
        console.log(`  ${regression.testSuite} - ${regression.metric}:`);
        console.log(`    Current: ${regression.current.toFixed(2)}`);
        console.log(`    Baseline: ${regression.baseline.toFixed(2)}`);
        console.log(`    Change: ${regression.percentChange}% (threshold: ${regression.threshold}%)`);
      });
    }
    
    if (this.results.improvements.length > 0) {
      console.log('\n✅ Performance Improvements:');
      this.results.improvements.forEach(improvement => {
        console.log(`  ${improvement.testSuite} - ${improvement.metric}:`);
        console.log(`    Current: ${improvement.current.toFixed(2)}`);
        console.log(`    Baseline: ${improvement.baseline.toFixed(2)}`);
        console.log(`    Improvement: ${Math.abs(improvement.percentChange)}%`);
      });
    }
    
    console.log('\n📊 Average Metrics Across All Tests:');
    Object.entries(this.results.summary.averageMetrics).forEach(([metric, value]) => {
      if (typeof value === 'number') {
        console.log(`  ${metric}: ${value.toFixed(2)}`);
      }
    });
  }

  async generateReport() {
    const reportPath = path.join(process.cwd(), 'performance-regression-report.md');
    
    const report = `# Performance Regression Test Report

**Generated:** ${this.results.timestamp}
**Status:** ${this.results.summary.overallStatus}

## Summary

- **Total Tests:** ${this.results.summary.totalTests}
- **Regressions:** ${this.results.summary.regressions}
- **Improvements:** ${this.results.summary.improvements}

## Test Results

${this.results.testResults.map(result => `
### ${result.name}

- **Total Requests:** ${result.metrics.totalRequests}
- **Success Rate:** ${((result.metrics.successfulRequests / result.metrics.totalRequests) * 100).toFixed(2)}%
- **Average Response Time:** ${result.metrics.averageResponseTime.toFixed(2)}ms
- **95th Percentile:** ${result.metrics.p95ResponseTime.toFixed(2)}ms
- **Requests/Second:** ${result.metrics.requestsPerSecond.toFixed(2)}
- **Error Rate:** ${result.metrics.errorRate.toFixed(2)}%
`).join('')}

${this.results.regressions.length > 0 ? `
## ❌ Regressions Found

${this.results.regressions.map(r => `
- **${r.testSuite} - ${r.metric}:** ${r.percentChange}% change (Current: ${r.current.toFixed(2)}, Baseline: ${r.baseline.toFixed(2)})
`).join('')}
` : ''}

${this.results.improvements.length > 0 ? `
## ✅ Improvements Found

${this.results.improvements.map(i => `
- **${i.testSuite} - ${i.metric}:** ${Math.abs(i.percentChange)}% improvement (Current: ${i.current.toFixed(2)}, Baseline: ${i.baseline.toFixed(2)})
`).join('')}
` : ''}

## Recommendations

${this.results.regressions.length > 0 ? `
### Performance Issues to Address:
${this.results.regressions.map(r => `
- Investigate ${r.metric} regression in ${r.testSuite} (${r.percentChange}% worse than baseline)
`).join('')}
` : '✅ No performance regressions detected. Current performance meets or exceeds baseline.'}
`;

    await fs.writeFile(reportPath, report);
    console.log(`📄 Report saved to ${reportPath}`);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const config = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    
    switch (key) {
      case 'baseline':
        config.baselineFile = value;
        break;
      case 'url':
        process.env.TEST_URL = value;
        break;
    }
  }
  
  const tester = new PerformanceRegressionTester(config);
  tester.runRegressionTest()
    .then(() => tester.generateReport())
    .catch(console.error);
}

module.exports = PerformanceRegressionTester;