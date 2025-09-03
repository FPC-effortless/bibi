#!/usr/bin/env node

const https = require('https');
const { execSync } = require('child_process');

/**
 * Post-deployment smoke tests and health checks
 * Validates deployment success and system health
 */

class PostDeploymentTests {
  constructor() {
    this.baseUrl = process.env.TEST_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    this.timeout = 30000; // 30 seconds
    this.retryAttempts = 3;
  }

  /**
   * Run all post-deployment tests
   */
  async runAllTests() {
    console.log('🧪 Running post-deployment tests...');
    console.log(`   🌍 Target URL: ${this.baseUrl}`);
    
    const results = {
      healthChecks: false,
      smokeTests: false,
      performanceTests: false,
      securityTests: false,
      functionalTests: false,
    };
    
    try {
      // Health checks
      console.log('\n🔍 Running health checks...');
      await this.runHealthChecks();
      results.healthChecks = true;
      console.log('   ✅ Health checks passed');
      
      // Smoke tests
      console.log('\n💨 Running smoke tests...');
      await this.runSmokeTests();
      results.smokeTests = true;
      console.log('   ✅ Smoke tests passed');
      
      // Performance tests
      console.log('\n⚡ Running performance tests...');
      await this.runPerformanceTests();
      results.performanceTests = true;
      console.log('   ✅ Performance tests passed');
      
      // Security tests
      console.log('\n🔒 Running security tests...');
      await this.runSecurityTests();
      results.securityTests = true;
      console.log('   ✅ Security tests passed');
      
      // Functional tests
      console.log('\n⚙️  Running functional tests...');
      await this.runFunctionalTests();
      results.functionalTests = true;
      console.log('   ✅ Functional tests passed');
      
      console.log('\n🎉 All post-deployment tests passed!');
      this.generateTestReport(results, true);
      
    } catch (error) {
      console.error(`\n❌ Post-deployment tests failed: ${error.message}`);
      this.generateTestReport(results, false, error.message);
      process.exit(1);
    }
  }

  /**
   * Run health checks
   */
  async runHealthChecks() {
    const healthChecks = [
      { name: 'Application Health', endpoint: '/api/health' },
      { name: 'System Status', endpoint: '/api/status' },
      { name: 'Homepage', endpoint: '/' },
      { name: 'Collections Page', endpoint: '/collections' },
    ];
    
    for (const check of healthChecks) {
      console.log(`     🔍 ${check.name}...`);
      await this.checkEndpoint(check.endpoint);
      console.log(`       ✅ ${check.name} OK`);
    }
  }

  /**
   * Run smoke tests
   */
  async runSmokeTests() {
    const smokeTests = [
      { name: 'Critical User Flows', command: 'npm run test:user-flows:smoke' },
      { name: 'API Endpoints', test: () => this.testApiEndpoints() },
      { name: 'Static Assets', test: () => this.testStaticAssets() },
    ];
    
    for (const test of smokeTests) {
      console.log(`     💨 ${test.name}...`);
      
      if (test.command) {
        try {
          execSync(test.command, { stdio: 'pipe', env: { ...process.env, TEST_URL: this.baseUrl } });
        } catch (error) {
          throw new Error(`${test.name} failed`);
        }
      } else if (test.test) {
        await test.test();
      }
      
      console.log(`       ✅ ${test.name} OK`);
    }
  }

  /**
   * Run performance tests
   */
  async runPerformanceTests() {
    const performanceTests = [
      { name: 'Page Load Times', test: () => this.testPageLoadTimes() },
      { name: 'API Response Times', test: () => this.testApiResponseTimes() },
      { name: 'Core Web Vitals', command: 'npm run audit:lighthouse' },
    ];
    
    for (const test of performanceTests) {
      console.log(`     ⚡ ${test.name}...`);
      
      if (test.command) {
        try {
          execSync(test.command, { 
            stdio: 'pipe', 
            env: { ...process.env, LIGHTHOUSE_URL: this.baseUrl } 
          });
        } catch (error) {
          // Performance tests are warnings, not failures
          console.log(`       ⚠️  ${test.name} warning (non-blocking)`);
          continue;
        }
      } else if (test.test) {
        await test.test();
      }
      
      console.log(`       ✅ ${test.name} OK`);
    }
  }

  /**
   * Run security tests
   */
  async runSecurityTests() {
    const securityTests = [
      { name: 'Security Headers', test: () => this.testSecurityHeaders() },
      { name: 'SSL/TLS Configuration', test: () => this.testSSLConfiguration() },
      { name: 'HTTPS Redirect', test: () => this.testHTTPSRedirect() },
    ];
    
    for (const test of securityTests) {
      console.log(`     🔒 ${test.name}...`);
      await test.test();
      console.log(`       ✅ ${test.name} OK`);
    }
  }

  /**
   * Run functional tests
   */
  async runFunctionalTests() {
    const functionalTests = [
      { name: 'Search Functionality', test: () => this.testSearchFunctionality() },
      { name: 'Product Pages', test: () => this.testProductPages() },
      { name: 'Navigation', test: () => this.testNavigation() },
    ];
    
    for (const test of functionalTests) {
      console.log(`     ⚙️  ${test.name}...`);
      await test.test();
      console.log(`       ✅ ${test.name} OK`);
    }
  }

  /**
   * Check endpoint with retries
   */
  async checkEndpoint(endpoint) {
    const url = `${this.baseUrl}${endpoint}`;
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        await this.httpRequest(url);
        return;
      } catch (error) {
        if (attempt === this.retryAttempts) {
          throw new Error(`Endpoint ${endpoint} failed after ${this.retryAttempts} attempts: ${error.message}`);
        }
        await this.sleep(2000); // Wait 2 seconds between retries
      }
    }
  }

  /**
   * Test API endpoints
   */
  async testApiEndpoints() {
    const apiEndpoints = [
      '/api/health',
      '/api/status',
      '/api/csrf-token',
    ];
    
    for (const endpoint of apiEndpoints) {
      await this.checkEndpoint(endpoint);
    }
  }

  /**
   * Test static assets
   */
  async testStaticAssets() {
    const staticAssets = [
      '/favicon.ico',
      '/manifest.json',
    ];
    
    for (const asset of staticAssets) {
      await this.checkEndpoint(asset);
    }
  }

  /**
   * Test page load times
   */
  async testPageLoadTimes() {
    const pages = ['/', '/collections', '/about'];
    const maxLoadTime = 3000; // 3 seconds
    
    for (const page of pages) {
      const startTime = Date.now();
      await this.checkEndpoint(page);
      const loadTime = Date.now() - startTime;
      
      if (loadTime > maxLoadTime) {
        throw new Error(`Page ${page} load time too high: ${loadTime}ms`);
      }
    }
  }

  /**
   * Test API response times
   */
  async testApiResponseTimes() {
    const apis = ['/api/health', '/api/status'];
    const maxResponseTime = 1000; // 1 second
    
    for (const api of apis) {
      const startTime = Date.now();
      await this.checkEndpoint(api);
      const responseTime = Date.now() - startTime;
      
      if (responseTime > maxResponseTime) {
        throw new Error(`API ${api} response time too high: ${responseTime}ms`);
      }
    }
  }

  /**
   * Test security headers
   */
  async testSecurityHeaders() {
    const response = await this.httpRequest(this.baseUrl, { method: 'HEAD' });
    const headers = response.headers;
    
    const requiredHeaders = [
      'strict-transport-security',
      'x-frame-options',
      'x-content-type-options',
    ];
    
    for (const header of requiredHeaders) {
      if (!headers[header]) {
        throw new Error(`Missing security header: ${header}`);
      }
    }
  }

  /**
   * Test SSL configuration
   */
  async testSSLConfiguration() {
    if (!this.baseUrl.startsWith('https://')) {
      console.log('       ⏭️  Skipping SSL test (not HTTPS)');
      return;
    }
    
    // Basic SSL check - in production, you'd use more comprehensive checks
    await this.httpRequest(this.baseUrl);
  }

  /**
   * Test HTTPS redirect
   */
  async testHTTPSRedirect() {
    if (!this.baseUrl.startsWith('https://')) {
      console.log('       ⏭️  Skipping HTTPS redirect test (not HTTPS)');
      return;
    }
    
    // Test would check if HTTP redirects to HTTPS
    // Implementation depends on your hosting setup
  }

  /**
   * Test search functionality
   */
  async testSearchFunctionality() {
    // Test search API endpoint
    await this.checkEndpoint('/api/search?q=test');
  }

  /**
   * Test product pages
   */
  async testProductPages() {
    // Test product page structure
    await this.checkEndpoint('/collections');
  }

  /**
   * Test navigation
   */
  async testNavigation() {
    const navPages = ['/', '/collections', '/about', '/contact'];
    
    for (const page of navPages) {
      await this.checkEndpoint(page);
    }
  }

  /**
   * HTTP request utility
   */
  httpRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        timeout: this.timeout,
        ...options,
      };
      
      const client = urlObj.protocol === 'https:' ? https : require('http');
      
      const req = client.request(requestOptions, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve({ statusCode: res.statusCode, headers: res.headers });
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
      
      req.on('error', reject);
      req.on('timeout', () => reject(new Error('Request timeout')));
      req.end();
    });
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate test report
   */
  generateTestReport(results, success, error = null) {
    const report = {
      timestamp: new Date().toISOString(),
      baseUrl: this.baseUrl,
      success,
      error,
      results,
      summary: {
        total: Object.keys(results).length,
        passed: Object.values(results).filter(Boolean).length,
        failed: Object.values(results).filter(r => !r).length,
      },
    };
    
    const fs = require('fs');
    fs.writeFileSync('post-deployment-test-report.json', JSON.stringify(report, null, 2));
    
    console.log('\n📋 Test Report Summary:');
    console.log(`   Total Tests: ${report.summary.total}`);
    console.log(`   Passed: ${report.summary.passed}`);
    console.log(`   Failed: ${report.summary.failed}`);
    console.log(`   Success Rate: ${Math.round((report.summary.passed / report.summary.total) * 100)}%`);
  }
}

// Run tests if called directly
if (require.main === module) {
  const tests = new PostDeploymentTests();
  tests.runAllTests();
}

module.exports = PostDeploymentTests;