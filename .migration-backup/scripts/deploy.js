#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Deployment script for different environments
 * Handles environment-specific configuration and deployment
 */

class DeploymentManager {
  constructor() {
    this.environment = process.argv[2] || 'staging';
    this.validEnvironments = ['development', 'staging', 'production'];
    
    if (!this.validEnvironments.includes(this.environment)) {
      console.error(`❌ Invalid environment: ${this.environment}`);
      console.log(`Valid environments: ${this.validEnvironments.join(', ')}`);
      process.exit(1);
    }
  }

  /**
   * Run the deployment process
   */
  async deploy() {
    console.log(`🚀 Starting deployment to ${this.environment}...`);
    
    try {
      await this.validatePrerequisites();
      await this.loadEnvironmentConfig();
      await this.runPreDeploymentChecks();
      await this.buildApplication();
      await this.deployToTarget();
      await this.runPostDeploymentChecks();
      
      console.log(`✅ Deployment to ${this.environment} completed successfully!`);
    } catch (error) {
      console.error(`❌ Deployment to ${this.environment} failed:`, error.message);
      process.exit(1);
    }
  }

  /**
   * Validate deployment prerequisites
   */
  async validatePrerequisites() {
    console.log('🔍 Validating prerequisites...');
    
    // Check if required tools are installed
    const requiredTools = ['node', 'npm'];
    
    for (const tool of requiredTools) {
      try {
        execSync(`${tool} --version`, { stdio: 'pipe' });
        console.log(`   ✅ ${tool} is available`);
      } catch (error) {
        throw new Error(`Required tool not found: ${tool}`);
      }
    }
    
    // Check if environment file exists
    const envFile = `environments/${this.environment}.env`;
    if (!fs.existsSync(envFile)) {
      throw new Error(`Environment file not found: ${envFile}`);
    }
    
    console.log('   ✅ Prerequisites validated');
  }

  /**
   * Load environment-specific configuration
   */
  async loadEnvironmentConfig() {
    console.log(`⚙️  Loading ${this.environment} configuration...`);
    
    const envFile = `environments/${this.environment}.env`;
    const envContent = fs.readFileSync(envFile, 'utf8');
    
    // Parse environment variables
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value && !key.startsWith('#')) {
        envVars[key.trim()] = value.trim();
      }
    });
    
    // Set environment variables
    Object.assign(process.env, envVars);
    
    console.log(`   ✅ Configuration loaded for ${this.environment}`);
  }

  /**
   * Run pre-deployment checks
   */
  async runPreDeploymentChecks() {
    console.log('🧪 Running pre-deployment checks...');
    
    // Run tests
    try {
      execSync('npm run test -- --watchAll=false --coverage', { stdio: 'pipe' });
      console.log('   ✅ Tests passed');
    } catch (error) {
      throw new Error('Tests failed');
    }
    
    // Run linting
    try {
      execSync('npm run lint', { stdio: 'pipe' });
      console.log('   ✅ Linting passed');
    } catch (error) {
      throw new Error('Linting failed');
    }
    
    // Type checking
    try {
      execSync('npm run type-check', { stdio: 'pipe' });
      console.log('   ✅ Type checking passed');
    } catch (error) {
      throw new Error('Type checking failed');
    }
    
    // Security audit (only fail on high/critical for production)
    try {
      const auditLevel = this.environment === 'production' ? 'high' : 'moderate';
      execSync(`npm audit --audit-level=${auditLevel}`, { stdio: 'pipe' });
      console.log('   ✅ Security audit passed');
    } catch (error) {
      if (this.environment === 'production') {
        throw new Error('Security audit failed');
      } else {
        console.log('   ⚠️  Security audit warnings (non-blocking for staging)');
      }
    }
  }

  /**
   * Build the application
   */
  async buildApplication() {
    console.log('🔨 Building application...');
    
    try {
      // Run build optimization script
      execSync('node scripts/build-optimization.js', { stdio: 'inherit' });
      console.log('   ✅ Application built successfully');
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }
  }

  /**
   * Deploy to target environment
   */
  async deployToTarget() {
    console.log(`🚀 Deploying to ${this.environment}...`);
    
    switch (this.environment) {
      case 'production':
        await this.deployToProduction();
        break;
      case 'staging':
        await this.deployToStaging();
        break;
      case 'development':
        await this.deployToDevelopment();
        break;
      default:
        throw new Error(`Unsupported environment: ${this.environment}`);
    }
  }

  /**
   * Deploy to production
   */
  async deployToProduction() {
    console.log('   📦 Deploying to production...');
    
    // Check if we have production secrets
    const requiredSecrets = ['VERCEL_TOKEN', 'VERCEL_ORG_ID', 'VERCEL_PROJECT_ID'];
    for (const secret of requiredSecrets) {
      if (!process.env[secret]) {
        throw new Error(`Missing required secret: ${secret}`);
      }
    }
    
    try {
      // Deploy with Vercel
      execSync('vercel --prod --token=$VERCEL_TOKEN', { stdio: 'inherit' });
      console.log('   ✅ Production deployment completed');
    } catch (error) {
      throw new Error(`Production deployment failed: ${error.message}`);
    }
  }

  /**
   * Deploy to staging
   */
  async deployToStaging() {
    console.log('   📦 Deploying to staging...');
    
    try {
      // Deploy with Vercel (preview)
      execSync('vercel --token=$VERCEL_TOKEN', { stdio: 'inherit' });
      console.log('   ✅ Staging deployment completed');
    } catch (error) {
      throw new Error(`Staging deployment failed: ${error.message}`);
    }
  }

  /**
   * Deploy to development
   */
  async deployToDevelopment() {
    console.log('   📦 Starting development server...');
    
    try {
      // Just start the development server
      console.log('   ℹ️  Development deployment means starting local server');
      console.log('   Run: npm run dev');
    } catch (error) {
      throw new Error(`Development setup failed: ${error.message}`);
    }
  }

  /**
   * Run post-deployment checks
   */
  async runPostDeploymentChecks() {
    console.log('🔍 Running post-deployment checks...');
    
    if (this.environment === 'development') {
      console.log('   ⏭️  Skipping post-deployment checks for development');
      return;
    }
    
    // Wait for deployment to be ready
    console.log('   ⏳ Waiting for deployment to be ready...');
    await this.sleep(30000); // Wait 30 seconds
    
    // Run smoke tests
    try {
      execSync('npm run test:user-flows:smoke', { stdio: 'pipe' });
      console.log('   ✅ Smoke tests passed');
    } catch (error) {
      console.warn('   ⚠️  Smoke tests failed (non-blocking)');
    }
    
    // Check health endpoint
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      try {
        const healthUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/health`;
        execSync(`curl -f ${healthUrl}`, { stdio: 'pipe' });
        console.log('   ✅ Health check passed');
      } catch (error) {
        console.warn('   ⚠️  Health check failed');
      }
    }
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run deployment if called directly
if (require.main === module) {
  const deployment = new DeploymentManager();
  deployment.deploy();
}

module.exports = DeploymentManager;