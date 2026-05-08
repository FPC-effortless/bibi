#!/usr/bin/env node

/**
 * Performance Test Runner
 * Orchestrates load testing, regression testing, and database monitoring
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class PerformanceTestOrchestrator {
  constructor(config = {}) {
    this.config = {
      testUrl: config.testUrl || process.env.TEST_URL || 'http://localhost:3000',
      outputDir: config.outputDir || 'performance-results',
      runLoadTests: config.runLoadTests !== false,
      runRegressionTests: config.runRegressionTests !== false,
      runDatabaseTests: config.runDatabaseTests !== false,
      generateReport: config.generateReport !== false,
      ...config
    };
    
    this.results = {
      timestamp: new Date().toISOString(),
      loadTestResults: null,
      regressionTestResults: null,
      databaseTestResults: null,
      summary: {}
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Performance Test Suite...');
    console.log(`Target URL: ${this.config.testUrl}`);
    console.log(`Output Directory: ${this.config.outputDir}`);
    
    // Ensure output directory exists
    await this.ensureOutputDirectory();
    
    try {
      // Run load tests
      if (this.config.runLoadTests) {
        console.log('\n📊 Running Load Tests...');
        this.results.loadTestResults = await this.runLoadTests();
      }
      
      // Run regression tests
      if (this.config.runRegressionTests) {
        console.log('\n🔍 Running Regression Tests...');
        this.results.regressionTestResults = await this.runRegressionTests();
      }
      
      // Run database performance tests
      if (this.config.runDatabaseTests) {
        console.log('\n🗄️  Running Database Performance Tests...');
        this.results.databaseTestResults = await this.runDatabaseTests();
      }
      
      // Generate comprehensive report
      if (this.config.generateReport) {
        console.log('\n📄 Generating Performance Report...');
        await this.generateComprehensiveReport();
      }
      
      // Display summary
      this.displaySummary();
      
      return this.results;
      
    } catch (error) {
      console.error('❌ Performance test suite failed:', error);
      throw error;
    }
  }

  async ensureOutputDirectory() {
    try {
      await fs.mkdir(this.config.outputDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  }

  async runLoadTests() {
    console.log('  Running light load test...');
    const lightLoad = await this.executeLoadTest({
      users: 10,
      duration: 30,
      name: 'light-load'
    });
    
    console.log('  Running medium load test...');
    const mediumLoad = await this.executeLoadTest({
      users: 50,
      duration: 60,
      name: 'medium-load'
    });
    
    console.log('  Running heavy load test...');
    const heavyLoad = await this.executeLoadTest({
      users: 100,
      duration: 120,
      name: 'heavy-load'
    });
    
    return {
      lightLoad,
      mediumLoad,
      heavyLoad
    };
  }

  async executeLoadTest(config) {
    return new Promise((resolve, reject) => {
      const args = [
        'scripts/load-testing.js',
        '--url', this.config.testUrl,
        '--users', config.users.toString(),
        '--duration', config.duration.toString(),
        '--rampup', Math.floor(config.duration / 4).toString()
      ];
      
      const child = spawn('node', args, { stdio: 'pipe' });
      let output = '';
      let error = '';
      
      child.stdout.on('data', (data) => {
        output += data.toString();
        process.stdout.write(data);
      });
      
      child.stderr.on('data', (data) => {
        error += data.toString();
        process.stderr.write(data);
      });
      
      child.on('close', async (code) => {
        if (code === 0) {
          // Save output to file
          const outputFile = path.join(this.config.outputDir, `${config.name}-results.txt`);
          await fs.writeFile(outputFile, output);
          
          // Parse results from output (simplified)
          const results = this.parseLoadTestOutput(output);
          results.name = config.name;
          results.config = config;
          
          resolve(results);
        } else {
          reject(new Error(`Load test failed with code ${code}: ${error}`));
        }
      });
    });
  }

  parseLoadTestOutput(output) {
    // Simple parsing of load test output
    // In a real implementation, this would be more robust
    const results = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      requestsPerSecond: 0,
      errorRate: 0
    };
    
    const lines = output.split('\n');
    lines.forEach(line => {
      if (line.includes('Total Requests:')) {
        results.totalRequests = parseInt(line.split(':')[1].trim());
      } else if (line.includes('Successful Requests:')) {
        results.successfulRequests = parseInt(line.split(':')[1].trim());
      } else if (line.includes('Failed Requests:')) {
        results.failedRequests = parseInt(line.split(':')[1].trim());
      } else if (line.includes('Average Response Time:')) {
        results.averageResponseTime = parseFloat(line.split(':')[1].replace('ms', '').trim());
      } else if (line.includes('Requests/Second:')) {
        results.requestsPerSecond = parseFloat(line.split(':')[1].trim());
      } else if (line.includes('Error Rate:')) {
        results.errorRate = parseFloat(line.split(':')[1].replace('%', '').trim());
      }
    });
    
    return results;
  }

  async runRegressionTests() {
    return new Promise((resolve, reject) => {
      const args = [
        'scripts/performance-regression-test.js',
        '--url', this.config.testUrl
      ];
      
      const child = spawn('node', args, { stdio: 'pipe' });
      let output = '';
      let error = '';
      
      child.stdout.on('data', (data) => {
        output += data.toString();
        process.stdout.write(data);
      });
      
      child.stderr.on('data', (data) => {
        error += data.toString();
        process.stderr.write(data);
      });
      
      child.on('close', async (code) => {
        // Save output regardless of exit code (regression tests might "fail" due to regressions)
        const outputFile = path.join(this.config.outputDir, 'regression-test-results.txt');
        await fs.writeFile(outputFile, output);
        
        const results = {
          exitCode: code,
          output,
          hasRegressions: code !== 0 || output.includes('❌ FAIL'),
          summary: this.parseRegressionOutput(output)
        };
        
        resolve(results);
      });
    });
  }

  parseRegressionOutput(output) {
    const summary = {
      totalTests: 0,
      regressions: 0,
      improvements: 0,
      status: 'UNKNOWN'
    };
    
    const lines = output.split('\n');
    lines.forEach(line => {
      if (line.includes('Total Tests:')) {
        summary.totalTests = parseInt(line.split(':')[1].trim());
      } else if (line.includes('Regressions Found:')) {
        summary.regressions = parseInt(line.split(':')[1].trim());
      } else if (line.includes('Improvements Found:')) {
        summary.improvements = parseInt(line.split(':')[1].trim());
      } else if (line.includes('Overall Status:')) {
        summary.status = line.includes('PASS') ? 'PASS' : 'FAIL';
      }
    });
    
    return summary;
  }

  async runDatabaseTests() {
    // Run Jest tests for database performance monitoring
    return new Promise((resolve, reject) => {
      const args = [
        'test',
        '__tests__/performance/load-testing.test.ts',
        '--verbose',
        '--json'
      ];
      
      const child = spawn('npm', args, { stdio: 'pipe' });
      let output = '';
      let error = '';
      
      child.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      child.on('close', async (code) => {
        try {
          // Parse Jest JSON output
          const jsonOutput = JSON.parse(output);
          
          const results = {
            success: jsonOutput.success,
            numTotalTests: jsonOutput.numTotalTests,
            numPassedTests: jsonOutput.numPassedTests,
            numFailedTests: jsonOutput.numFailedTests,
            testResults: jsonOutput.testResults
          };
          
          // Save detailed results
          const outputFile = path.join(this.config.outputDir, 'database-test-results.json');
          await fs.writeFile(outputFile, JSON.stringify(results, null, 2));
          
          resolve(results);
        } catch (parseError) {
          // Fallback if JSON parsing fails
          const results = {
            success: code === 0,
            output,
            error
          };
          resolve(results);
        }
      });
    });
  }

  async generateComprehensiveReport() {
    const reportPath = path.join(this.config.outputDir, 'performance-test-report.md');
    
    const report = `# Performance Test Report

**Generated:** ${this.results.timestamp}
**Test URL:** ${this.config.testUrl}

## Executive Summary

${this.generateExecutiveSummary()}

## Load Test Results

${this.generateLoadTestSection()}

## Regression Test Results

${this.generateRegressionTestSection()}

## Database Performance Results

${this.generateDatabaseTestSection()}

## Recommendations

${this.generateRecommendations()}

## Detailed Results

All detailed test outputs and data files are available in the \`${this.config.outputDir}\` directory.
`;

    await fs.writeFile(reportPath, report);
    console.log(`📄 Comprehensive report saved to ${reportPath}`);
  }

  generateExecutiveSummary() {
    const summary = [];
    
    if (this.results.loadTestResults) {
      const heavyLoad = this.results.loadTestResults.heavyLoad;
      if (heavyLoad) {
        summary.push(`- **Load Testing:** Handled ${heavyLoad.totalRequests} requests with ${heavyLoad.errorRate.toFixed(2)}% error rate`);
        summary.push(`- **Performance:** Average response time of ${heavyLoad.averageResponseTime.toFixed(2)}ms at ${heavyLoad.requestsPerSecond.toFixed(2)} req/sec`);
      }
    }
    
    if (this.results.regressionTestResults) {
      const status = this.results.regressionTestResults.summary.status;
      const regressions = this.results.regressionTestResults.summary.regressions;
      summary.push(`- **Regression Testing:** ${status} (${regressions} regressions found)`);
    }
    
    if (this.results.databaseTestResults) {
      const passed = this.results.databaseTestResults.numPassedTests || 0;
      const total = this.results.databaseTestResults.numTotalTests || 0;
      summary.push(`- **Database Testing:** ${passed}/${total} tests passed`);
    }
    
    return summary.join('\n');
  }

  generateLoadTestSection() {
    if (!this.results.loadTestResults) return 'Load tests were not executed.';
    
    const sections = [];
    
    Object.entries(this.results.loadTestResults).forEach(([testName, results]) => {
      sections.push(`
### ${testName.charAt(0).toUpperCase() + testName.slice(1)} Test

- **Configuration:** ${results.config.users} users, ${results.config.duration}s duration
- **Total Requests:** ${results.totalRequests}
- **Success Rate:** ${((results.successfulRequests / results.totalRequests) * 100).toFixed(2)}%
- **Average Response Time:** ${results.averageResponseTime.toFixed(2)}ms
- **Throughput:** ${results.requestsPerSecond.toFixed(2)} req/sec
- **Error Rate:** ${results.errorRate.toFixed(2)}%
`);
    });
    
    return sections.join('\n');
  }

  generateRegressionTestSection() {
    if (!this.results.regressionTestResults) return 'Regression tests were not executed.';
    
    const summary = this.results.regressionTestResults.summary;
    return `
- **Status:** ${summary.status}
- **Total Tests:** ${summary.totalTests}
- **Regressions:** ${summary.regressions}
- **Improvements:** ${summary.improvements}

${summary.status === 'FAIL' ? '⚠️ Performance regressions detected. Review detailed results for specific issues.' : '✅ No performance regressions detected.'}
`;
  }

  generateDatabaseTestSection() {
    if (!this.results.databaseTestResults) return 'Database tests were not executed.';
    
    const results = this.results.databaseTestResults;
    return `
- **Test Status:** ${results.success ? 'PASSED' : 'FAILED'}
- **Tests Executed:** ${results.numTotalTests || 'Unknown'}
- **Tests Passed:** ${results.numPassedTests || 'Unknown'}
- **Tests Failed:** ${results.numFailedTests || 'Unknown'}
`;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Analyze load test results
    if (this.results.loadTestResults) {
      const heavyLoad = this.results.loadTestResults.heavyLoad;
      if (heavyLoad) {
        if (heavyLoad.averageResponseTime > 2000) {
          recommendations.push('- Consider optimizing response times (currently > 2s average)');
        }
        if (heavyLoad.errorRate > 5) {
          recommendations.push('- Investigate high error rate (currently > 5%)');
        }
        if (heavyLoad.requestsPerSecond < 10) {
          recommendations.push('- Consider scaling infrastructure to improve throughput');
        }
      }
    }
    
    // Analyze regression results
    if (this.results.regressionTestResults && this.results.regressionTestResults.hasRegressions) {
      recommendations.push('- Address performance regressions identified in regression testing');
    }
    
    // Default recommendations
    if (recommendations.length === 0) {
      recommendations.push('- Continue monitoring performance metrics');
      recommendations.push('- Consider implementing automated performance testing in CI/CD pipeline');
    }
    
    return recommendations.join('\n');
  }

  displaySummary() {
    console.log('\n🎯 Performance Test Suite Summary:');
    console.log('='.repeat(50));
    
    if (this.results.loadTestResults) {
      console.log('✅ Load Tests: Completed');
    }
    
    if (this.results.regressionTestResults) {
      const status = this.results.regressionTestResults.summary.status;
      console.log(`${status === 'PASS' ? '✅' : '❌'} Regression Tests: ${status}`);
    }
    
    if (this.results.databaseTestResults) {
      const success = this.results.databaseTestResults.success;
      console.log(`${success ? '✅' : '❌'} Database Tests: ${success ? 'PASSED' : 'FAILED'}`);
    }
    
    console.log(`\n📁 Results saved to: ${this.config.outputDir}/`);
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
      case 'url':
        config.testUrl = value;
        break;
      case 'output':
        config.outputDir = value;
        break;
      case 'skip-load':
        config.runLoadTests = false;
        i--; // No value for this flag
        break;
      case 'skip-regression':
        config.runRegressionTests = false;
        i--; // No value for this flag
        break;
      case 'skip-database':
        config.runDatabaseTests = false;
        i--; // No value for this flag
        break;
    }
  }
  
  const orchestrator = new PerformanceTestOrchestrator(config);
  orchestrator.runAllTests().catch(console.error);
}

module.exports = PerformanceTestOrchestrator;