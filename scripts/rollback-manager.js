#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Automated rollback manager
 * Handles automatic rollback on deployment failures
 */

class RollbackManager {
  constructor() {
    this.deploymentHistoryFile = '.deployment-history.json';
    this.maxHistoryEntries = 10;
  }

  /**
   * Record a successful deployment
   */
  recordDeployment(deploymentInfo) {
    console.log('📝 Recording deployment...');
    
    const history = this.getDeploymentHistory();
    
    const deployment = {
      id: this.generateDeploymentId(),
      timestamp: new Date().toISOString(),
      environment: deploymentInfo.environment || 'unknown',
      version: deploymentInfo.version || 'unknown',
      url: deploymentInfo.url,
      strategy: deploymentInfo.strategy || 'standard',
      commit: this.getCurrentCommit(),
      status: 'success',
      ...deploymentInfo,
    };
    
    history.unshift(deployment);
    
    // Keep only the last N deployments
    if (history.length > this.maxHistoryEntries) {
      history.splice(this.maxHistoryEntries);
    }
    
    this.saveDeploymentHistory(history);
    console.log(`   ✅ Deployment recorded: ${deployment.id}`);
    
    return deployment;
  }

  /**
   * Perform automatic rollback
   */
  async performRollback(reason = 'Deployment failure') {
    console.log(`🔄 Performing automatic rollback: ${reason}`);
    
    try {
      const history = this.getDeploymentHistory();
      const lastSuccessfulDeployment = this.getLastSuccessfulDeployment(history);
      
      if (!lastSuccessfulDeployment) {
        throw new Error('No previous successful deployment found for rollback');
      }
      
      console.log(`   📋 Rolling back to deployment: ${lastSuccessfulDeployment.id}`);
      console.log(`   📅 Deployment date: ${lastSuccessfulDeployment.timestamp}`);
      console.log(`   🏷️  Version: ${lastSuccessfulDeployment.version}`);
      
      // Perform the rollback
      await this.executeRollback(lastSuccessfulDeployment);
      
      // Record the rollback
      this.recordRollback(lastSuccessfulDeployment, reason);
      
      // Verify rollback success
      await this.verifyRollback(lastSuccessfulDeployment);
      
      console.log('   ✅ Rollback completed successfully');
      
      return lastSuccessfulDeployment;
    } catch (error) {
      console.error('   ❌ Rollback failed:', error.message);
      throw error;
    }
  }

  /**
   * Execute the actual rollback
   */
  async executeRollback(targetDeployment) {
    console.log('   🔄 Executing rollback...');
    
    try {
      // Checkout the target commit
      if (targetDeployment.commit) {
        console.log(`     📦 Checking out commit: ${targetDeployment.commit}`);
        execSync(`git checkout ${targetDeployment.commit}`, { stdio: 'pipe' });
      }
      
      // Rebuild the application
      console.log('     🔨 Rebuilding application...');
      execSync('npm run build', { stdio: 'pipe' });
      
      // Deploy the rollback version
      console.log('     🚀 Deploying rollback version...');
      
      if (targetDeployment.environment === 'production') {
        execSync('vercel --prod --token=$VERCEL_TOKEN', { stdio: 'pipe' });
      } else {
        execSync('vercel --token=$VERCEL_TOKEN', { stdio: 'pipe' });
      }
      
      console.log('     ✅ Rollback deployment completed');
    } catch (error) {
      throw new Error(`Rollback execution failed: ${error.message}`);
    }
  }

  /**
   * Verify rollback success
   */
  async verifyRollback(targetDeployment) {
    console.log('   🔍 Verifying rollback...');
    
    try {
      // Health check
      if (targetDeployment.url) {
        const healthUrl = `${targetDeployment.url}/api/health`;
        await this.healthCheck(healthUrl);
        console.log('     ✅ Health check passed');
      }
      
      // Quick smoke test
      execSync('npm run test:user-flows:smoke', { stdio: 'pipe' });
      console.log('     ✅ Smoke tests passed');
      
    } catch (error) {
      throw new Error(`Rollback verification failed: ${error.message}`);
    }
  }

  /**
   * Record rollback event
   */
  recordRollback(targetDeployment, reason) {
    const history = this.getDeploymentHistory();
    
    const rollbackRecord = {
      id: this.generateDeploymentId(),
      timestamp: new Date().toISOString(),
      type: 'rollback',
      reason,
      targetDeployment: targetDeployment.id,
      targetVersion: targetDeployment.version,
      targetCommit: targetDeployment.commit,
    };
    
    history.unshift(rollbackRecord);
    this.saveDeploymentHistory(history);
    
    console.log(`   📝 Rollback recorded: ${rollbackRecord.id}`);
  }

  /**
   * Get deployment history
   */
  getDeploymentHistory() {
    if (!fs.existsSync(this.deploymentHistoryFile)) {
      return [];
    }
    
    try {
      const content = fs.readFileSync(this.deploymentHistoryFile, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.warn('Failed to read deployment history, starting fresh');
      return [];
    }
  }

  /**
   * Save deployment history
   */
  saveDeploymentHistory(history) {
    try {
      fs.writeFileSync(this.deploymentHistoryFile, JSON.stringify(history, null, 2));
    } catch (error) {
      console.error('Failed to save deployment history:', error.message);
    }
  }

  /**
   * Get last successful deployment
   */
  getLastSuccessfulDeployment(history) {
    return history.find(deployment => 
      deployment.status === 'success' && 
      deployment.type !== 'rollback'
    );
  }

  /**
   * Generate unique deployment ID
   */
  generateDeploymentId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `deploy-${timestamp}-${random}`;
  }

  /**
   * Get current git commit
   */
  getCurrentCommit() {
    try {
      return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Health check utility
   */
  async healthCheck(url) {
    return new Promise((resolve, reject) => {
      const https = require('https');
      
      https.get(url, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res);
        } else {
          reject(new Error(`Health check failed: HTTP ${res.statusCode}`));
        }
      }).on('error', reject);
    });
  }

  /**
   * List deployment history
   */
  listDeployments() {
    const history = this.getDeploymentHistory();
    
    console.log('📋 Deployment History:');
    console.log('');
    
    if (history.length === 0) {
      console.log('   No deployments found');
      return;
    }
    
    history.forEach((deployment, index) => {
      const status = deployment.type === 'rollback' ? '🔄 ROLLBACK' : 
                    deployment.status === 'success' ? '✅ SUCCESS' : '❌ FAILED';
      
      console.log(`${index + 1}. ${status} ${deployment.id}`);
      console.log(`   📅 ${deployment.timestamp}`);
      console.log(`   🏷️  ${deployment.version || 'unknown'}`);
      console.log(`   🌍 ${deployment.environment || 'unknown'}`);
      
      if (deployment.type === 'rollback') {
        console.log(`   🎯 Target: ${deployment.targetDeployment}`);
        console.log(`   💬 Reason: ${deployment.reason}`);
      }
      
      console.log('');
    });
  }

  /**
   * Rollback to specific deployment
   */
  async rollbackToDeployment(deploymentId) {
    console.log(`🔄 Rolling back to specific deployment: ${deploymentId}`);
    
    const history = this.getDeploymentHistory();
    const targetDeployment = history.find(d => d.id === deploymentId);
    
    if (!targetDeployment) {
      throw new Error(`Deployment not found: ${deploymentId}`);
    }
    
    if (targetDeployment.status !== 'success') {
      throw new Error(`Cannot rollback to failed deployment: ${deploymentId}`);
    }
    
    await this.executeRollback(targetDeployment);
    this.recordRollback(targetDeployment, `Manual rollback to ${deploymentId}`);
    await this.verifyRollback(targetDeployment);
    
    console.log('✅ Manual rollback completed successfully');
  }
}

// CLI interface
if (require.main === module) {
  const rollbackManager = new RollbackManager();
  const command = process.argv[2];
  
  switch (command) {
    case 'rollback':
      rollbackManager.performRollback('Manual rollback requested');
      break;
    case 'rollback-to':
      const deploymentId = process.argv[3];
      if (!deploymentId) {
        console.error('❌ Deployment ID required');
        process.exit(1);
      }
      rollbackManager.rollbackToDeployment(deploymentId);
      break;
    case 'list':
      rollbackManager.listDeployments();
      break;
    case 'record':
      const deploymentInfo = {
        environment: process.argv[3] || 'staging',
        version: process.argv[4] || '1.0.0',
        url: process.argv[5] || 'https://example.com',
      };
      rollbackManager.recordDeployment(deploymentInfo);
      break;
    default:
      console.log('Usage:');
      console.log('  node rollback-manager.js rollback                    - Perform automatic rollback');
      console.log('  node rollback-manager.js rollback-to <deployment-id> - Rollback to specific deployment');
      console.log('  node rollback-manager.js list                        - List deployment history');
      console.log('  node rollback-manager.js record <env> <version> <url> - Record deployment');
  }
}

module.exports = RollbackManager;