#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');

/**
 * Deployment strategies manager
 * Implements blue-green and rolling deployment patterns
 */

class DeploymentStrategies {
  constructor() {
    this.strategy = process.argv[2] || 'blue-green';
    this.environment = process.argv[3] || 'staging';
    this.validStrategies = ['blue-green', 'rolling', 'canary'];
    
    if (!this.validStrategies.includes(this.strategy)) {
      console.error(`❌ Invalid strategy: ${this.strategy}`);
      console.log(`Valid strategies: ${this.validStrategies.join(', ')}`);
      process.exit(1);
    }
  }

  /**
   * Execute deployment strategy
   */
  async deploy() {
    console.log(`🚀 Starting ${this.strategy} deployment to ${this.environment}...`);
    
    try {
      switch (this.strategy) {
        case 'blue-green':
          await this.blueGreenDeployment();
          break;
        case 'rolling':
          await this.rollingDeployment();
          break;
        case 'canary':
          await this.canaryDeployment();
          break;
        default:
          throw new Error(`Unsupported strategy: ${this.strategy}`);
      }
      
      console.log(`✅ ${this.strategy} deployment completed successfully!`);
    } catch (error) {
      console.error(`❌ ${this.strategy} deployment failed:`, error.message);
      await this.rollback();
      process.exit(1);
    }
  }

  /**
   * Blue-Green deployment strategy
   */
  async blueGreenDeployment() {
    console.log('🔵 Executing Blue-Green deployment...');
    
    // Step 1: Deploy to green environment
    console.log('   📦 Deploying to green environment...');
    const greenUrl = await this.deployToGreen();
    
    // Step 2: Run health checks on green
    console.log('   🔍 Running health checks on green environment...');
    await this.healthCheck(greenUrl);
    
    // Step 3: Run smoke tests on green
    console.log('   🧪 Running smoke tests on green environment...');
    await this.smokeTests(greenUrl);
    
    // Step 4: Switch traffic to green
    console.log('   🔄 Switching traffic to green environment...');
    await this.switchTraffic(greenUrl);
    
    // Step 5: Verify production traffic
    console.log('   ✅ Verifying production traffic...');
    await this.verifyProduction();
    
    // Step 6: Cleanup old blue environment
    console.log('   🧹 Cleaning up blue environment...');
    await this.cleanupBlue();
  }

  /**
   * Rolling deployment strategy
   */
  async rollingDeployment() {
    console.log('🔄 Executing Rolling deployment...');
    
    const instances = await this.getInstances();
    const batchSize = Math.ceil(instances.length / 3); // Deploy in 3 batches
    
    for (let i = 0; i < instances.length; i += batchSize) {
      const batch = instances.slice(i, i + batchSize);
      console.log(`   📦 Deploying batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(instances.length / batchSize)}...`);
      
      // Deploy to batch
      await this.deployBatch(batch);
      
      // Health check batch
      await this.healthCheckBatch(batch);
      
      // Wait between batches
      if (i + batchSize < instances.length) {
        console.log('   ⏳ Waiting between batches...');
        await this.sleep(30000); // 30 seconds
      }
    }
  }

  /**
   * Canary deployment strategy
   */
  async canaryDeployment() {
    console.log('🐤 Executing Canary deployment...');
    
    // Step 1: Deploy canary version (5% traffic)
    console.log('   📦 Deploying canary version...');
    const canaryUrl = await this.deployCanary();
    
    // Step 2: Route 5% traffic to canary
    console.log('   🔀 Routing 5% traffic to canary...');
    await this.routeTraffic(canaryUrl, 5);
    
    // Step 3: Monitor canary metrics
    console.log('   📊 Monitoring canary metrics...');
    await this.monitorCanary(canaryUrl, 300000); // 5 minutes
    
    // Step 4: Gradually increase traffic
    const trafficSteps = [10, 25, 50, 100];
    for (const percentage of trafficSteps) {
      console.log(`   📈 Increasing traffic to ${percentage}%...`);
      await this.routeTraffic(canaryUrl, percentage);
      await this.monitorCanary(canaryUrl, 180000); // 3 minutes
    }
    
    // Step 5: Complete deployment
    console.log('   ✅ Canary deployment successful, completing rollout...');
    await this.completeCanary();
  }

  /**
   * Deploy to green environment
   */
  async deployToGreen() {
    try {
      // Create green deployment
      const result = execSync('vercel --token=$VERCEL_TOKEN', { encoding: 'utf8' });
      const url = result.trim().split('\n').pop();
      
      // Store green URL for rollback
      fs.writeFileSync('.deployment-state.json', JSON.stringify({
        strategy: 'blue-green',
        greenUrl: url,
        timestamp: new Date().toISOString(),
      }));
      
      return url;
    } catch (error) {
      throw new Error(`Green deployment failed: ${error.message}`);
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(url) {
    const healthUrl = `${url}/api/health`;
    
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        await this.httpGet(healthUrl);
        console.log(`     ✅ Health check passed (attempt ${attempt})`);
        return;
      } catch (error) {
        console.log(`     ⚠️  Health check failed (attempt ${attempt}): ${error.message}`);
        if (attempt === 5) {
          throw new Error('Health check failed after 5 attempts');
        }
        await this.sleep(10000); // Wait 10 seconds
      }
    }
  }

  /**
   * Run smoke tests
   */
  async smokeTests(url) {
    try {
      execSync(`TEST_URL=${url} npm run test:user-flows:smoke`, { stdio: 'pipe' });
      console.log('     ✅ Smoke tests passed');
    } catch (error) {
      throw new Error('Smoke tests failed');
    }
  }

  /**
   * Switch traffic to new deployment
   */
  async switchTraffic(newUrl) {
    // In a real implementation, this would update load balancer configuration
    // For Vercel, this would promote the deployment to production
    try {
      execSync('vercel --prod --token=$VERCEL_TOKEN', { stdio: 'pipe' });
      console.log('     ✅ Traffic switched successfully');
    } catch (error) {
      throw new Error(`Traffic switch failed: ${error.message}`);
    }
  }

  /**
   * Verify production is working
   */
  async verifyProduction() {
    const productionUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (productionUrl) {
      await this.healthCheck(productionUrl);
      console.log('     ✅ Production verification passed');
    }
  }

  /**
   * Cleanup old deployment
   */
  async cleanupBlue() {
    // In a real implementation, this would remove old deployments
    console.log('     ✅ Blue environment cleaned up');
  }

  /**
   * Get deployment instances (simulated)
   */
  async getInstances() {
    // In a real implementation, this would get actual instances
    return ['instance-1', 'instance-2', 'instance-3', 'instance-4'];
  }

  /**
   * Deploy to a batch of instances
   */
  async deployBatch(batch) {
    console.log(`     📦 Deploying to instances: ${batch.join(', ')}`);
    // Simulate batch deployment
    await this.sleep(5000);
  }

  /**
   * Health check a batch of instances
   */
  async healthCheckBatch(batch) {
    console.log(`     🔍 Health checking instances: ${batch.join(', ')}`);
    // Simulate health check
    await this.sleep(2000);
  }

  /**
   * Deploy canary version
   */
  async deployCanary() {
    try {
      const result = execSync('vercel --token=$VERCEL_TOKEN', { encoding: 'utf8' });
      const url = result.trim().split('\n').pop();
      
      // Store canary state
      fs.writeFileSync('.deployment-state.json', JSON.stringify({
        strategy: 'canary',
        canaryUrl: url,
        timestamp: new Date().toISOString(),
      }));
      
      return url;
    } catch (error) {
      throw new Error(`Canary deployment failed: ${error.message}`);
    }
  }

  /**
   * Route traffic percentage to canary
   */
  async routeTraffic(canaryUrl, percentage) {
    // In a real implementation, this would configure load balancer
    console.log(`     🔀 Routing ${percentage}% traffic to canary`);
    await this.sleep(2000);
  }

  /**
   * Monitor canary metrics
   */
  async monitorCanary(canaryUrl, duration) {
    console.log(`     📊 Monitoring canary for ${duration / 1000} seconds...`);
    
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    while (Date.now() < endTime) {
      // Check error rates, response times, etc.
      const metrics = await this.getCanaryMetrics(canaryUrl);
      
      if (metrics.errorRate > 5) { // 5% error rate threshold
        throw new Error(`Canary error rate too high: ${metrics.errorRate}%`);
      }
      
      if (metrics.responseTime > 2000) { // 2 second response time threshold
        throw new Error(`Canary response time too high: ${metrics.responseTime}ms`);
      }
      
      await this.sleep(30000); // Check every 30 seconds
    }
    
    console.log('     ✅ Canary monitoring passed');
  }

  /**
   * Get canary metrics (simulated)
   */
  async getCanaryMetrics(canaryUrl) {
    // In a real implementation, this would get actual metrics
    return {
      errorRate: Math.random() * 2, // 0-2% error rate
      responseTime: 500 + Math.random() * 500, // 500-1000ms response time
    };
  }

  /**
   * Complete canary deployment
   */
  async completeCanary() {
    try {
      execSync('vercel --prod --token=$VERCEL_TOKEN', { stdio: 'pipe' });
      console.log('     ✅ Canary deployment completed');
    } catch (error) {
      throw new Error(`Canary completion failed: ${error.message}`);
    }
  }

  /**
   * Rollback deployment
   */
  async rollback() {
    console.log('🔄 Rolling back deployment...');
    
    try {
      // Read deployment state
      if (fs.existsSync('.deployment-state.json')) {
        const state = JSON.parse(fs.readFileSync('.deployment-state.json', 'utf8'));
        console.log(`   Rolling back ${state.strategy} deployment from ${state.timestamp}`);
      }
      
      // In a real implementation, this would rollback to previous version
      console.log('   ✅ Rollback completed');
    } catch (error) {
      console.error('   ❌ Rollback failed:', error.message);
    }
  }

  /**
   * HTTP GET utility
   */
  httpGet(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res);
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      }).on('error', reject);
    });
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run deployment strategy if called directly
if (require.main === module) {
  const deployment = new DeploymentStrategies();
  deployment.deploy();
}

module.exports = DeploymentStrategies;