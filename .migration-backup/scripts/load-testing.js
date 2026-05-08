#!/usr/bin/env node

/**
 * Load Testing Suite for Bibiere E-commerce
 * Simulates traffic spikes and measures performance under load
 */

const { performance } = require('perf_hooks');
const https = require('https');
const http = require('http');
const { URL } = require('url');

class LoadTestRunner {
  constructor(config = {}) {
    this.config = {
      baseUrl: config.baseUrl || 'http://localhost:3000',
      maxConcurrentUsers: config.maxConcurrentUsers || 100,
      testDuration: config.testDuration || 60000, // 1 minute
      rampUpTime: config.rampUpTime || 10000, // 10 seconds
      scenarios: config.scenarios || this.getDefaultScenarios(),
      ...config
    };
    
    this.results = {
      requests: [],
      errors: [],
      metrics: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        requestsPerSecond: 0,
        errorRate: 0
      }
    };
  }

  getDefaultScenarios() {
    return [
      {
        name: 'Homepage Load',
        path: '/',
        weight: 30,
        method: 'GET'
      },
      {
        name: 'Product Listing',
        path: '/collections',
        weight: 25,
        method: 'GET'
      },
      {
        name: 'Product Detail',
        path: '/product/1',
        weight: 20,
        method: 'GET'
      },
      {
        name: 'Search',
        path: '/api/search?q=dress',
        weight: 15,
        method: 'GET'
      },
      {
        name: 'Add to Cart',
        path: '/api/cart/add',
        weight: 10,
        method: 'POST',
        body: JSON.stringify({ productId: '1', quantity: 1 }),
        headers: { 'Content-Type': 'application/json' }
      }
    ];
  }

  async runLoadTest() {
    console.log('🚀 Starting Load Test...');
    console.log(`Target: ${this.config.baseUrl}`);
    console.log(`Max Concurrent Users: ${this.config.maxConcurrentUsers}`);
    console.log(`Test Duration: ${this.config.testDuration}ms`);
    console.log(`Ramp-up Time: ${this.config.rampUpTime}ms`);
    
    const startTime = performance.now();
    const endTime = startTime + this.config.testDuration;
    
    // Ramp up users gradually
    const userPromises = [];
    const usersPerInterval = Math.ceil(this.config.maxConcurrentUsers / 10);
    const intervalTime = this.config.rampUpTime / 10;
    
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        for (let j = 0; j < usersPerInterval && userPromises.length < this.config.maxConcurrentUsers; j++) {
          userPromises.push(this.simulateUser(endTime));
        }
      }, i * intervalTime);
    }
    
    // Wait for all users to complete
    await Promise.all(userPromises);
    
    // Calculate and display results
    this.calculateMetrics();
    this.displayResults();
    
    return this.results;
  }

  async simulateUser(endTime) {
    while (performance.now() < endTime) {
      const scenario = this.selectScenario();
      const requestStart = performance.now();
      
      try {
        const response = await this.makeRequest(scenario);
        const requestEnd = performance.now();
        const responseTime = requestEnd - requestStart;
        
        this.results.requests.push({
          scenario: scenario.name,
          responseTime,
          statusCode: response.statusCode,
          timestamp: requestStart,
          success: response.statusCode >= 200 && response.statusCode < 400
        });
        
        this.results.metrics.totalRequests++;
        if (response.statusCode >= 200 && response.statusCode < 400) {
          this.results.metrics.successfulRequests++;
        } else {
          this.results.metrics.failedRequests++;
        }
        
      } catch (error) {
        const requestEnd = performance.now();
        const responseTime = requestEnd - requestStart;
        
        this.results.errors.push({
          scenario: scenario.name,
          error: error.message,
          timestamp: requestStart,
          responseTime
        });
        
        this.results.metrics.totalRequests++;
        this.results.metrics.failedRequests++;
      }
      
      // Random delay between requests (0.5-2 seconds)
      await this.sleep(500 + Math.random() * 1500);
    }
  }

  selectScenario() {
    const totalWeight = this.config.scenarios.reduce((sum, scenario) => sum + scenario.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const scenario of this.config.scenarios) {
      random -= scenario.weight;
      if (random <= 0) {
        return scenario;
      }
    }
    
    return this.config.scenarios[0];
  }

  makeRequest(scenario) {
    return new Promise((resolve, reject) => {
      const url = new URL(scenario.path, this.config.baseUrl);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: scenario.method || 'GET',
        headers: {
          'User-Agent': 'LoadTest/1.0',
          ...scenario.headers
        },
        timeout: 30000
      };
      
      const req = client.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      if (scenario.body) {
        req.write(scenario.body);
      }
      
      req.end();
    });
  }

  calculateMetrics() {
    const responseTimes = this.results.requests.map(r => r.responseTime);
    responseTimes.sort((a, b) => a - b);
    
    if (responseTimes.length > 0) {
      this.results.metrics.averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
      this.results.metrics.p95ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.95)];
      this.results.metrics.p99ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.99)];
    }
    
    const testDurationSeconds = this.config.testDuration / 1000;
    this.results.metrics.requestsPerSecond = this.results.metrics.totalRequests / testDurationSeconds;
    this.results.metrics.errorRate = (this.results.metrics.failedRequests / this.results.metrics.totalRequests) * 100;
  }

  displayResults() {
    console.log('\n📊 Load Test Results:');
    console.log('='.repeat(50));
    console.log(`Total Requests: ${this.results.metrics.totalRequests}`);
    console.log(`Successful Requests: ${this.results.metrics.successfulRequests}`);
    console.log(`Failed Requests: ${this.results.metrics.failedRequests}`);
    console.log(`Error Rate: ${this.results.metrics.errorRate.toFixed(2)}%`);
    console.log(`Requests/Second: ${this.results.metrics.requestsPerSecond.toFixed(2)}`);
    console.log(`Average Response Time: ${this.results.metrics.averageResponseTime.toFixed(2)}ms`);
    console.log(`95th Percentile: ${this.results.metrics.p95ResponseTime.toFixed(2)}ms`);
    console.log(`99th Percentile: ${this.results.metrics.p99ResponseTime.toFixed(2)}ms`);
    
    // Display scenario breakdown
    console.log('\n📈 Scenario Breakdown:');
    const scenarioStats = {};
    this.results.requests.forEach(req => {
      if (!scenarioStats[req.scenario]) {
        scenarioStats[req.scenario] = { count: 0, totalTime: 0, errors: 0 };
      }
      scenarioStats[req.scenario].count++;
      scenarioStats[req.scenario].totalTime += req.responseTime;
      if (!req.success) scenarioStats[req.scenario].errors++;
    });
    
    Object.entries(scenarioStats).forEach(([scenario, stats]) => {
      const avgTime = stats.totalTime / stats.count;
      const errorRate = (stats.errors / stats.count) * 100;
      console.log(`${scenario}: ${stats.count} requests, ${avgTime.toFixed(2)}ms avg, ${errorRate.toFixed(1)}% errors`);
    });
    
    // Performance thresholds check
    console.log('\n🎯 Performance Thresholds:');
    const thresholds = {
      'Average Response Time < 2000ms': this.results.metrics.averageResponseTime < 2000,
      '95th Percentile < 5000ms': this.results.metrics.p95ResponseTime < 5000,
      'Error Rate < 5%': this.results.metrics.errorRate < 5,
      'Requests/Second > 10': this.results.metrics.requestsPerSecond > 10
    };
    
    Object.entries(thresholds).forEach(([threshold, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${threshold}`);
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        config.baseUrl = value;
        break;
      case 'users':
        config.maxConcurrentUsers = parseInt(value);
        break;
      case 'duration':
        config.testDuration = parseInt(value) * 1000;
        break;
      case 'rampup':
        config.rampUpTime = parseInt(value) * 1000;
        break;
    }
  }
  
  const loadTest = new LoadTestRunner(config);
  loadTest.runLoadTest().catch(console.error);
}

module.exports = LoadTestRunner;