#!/usr/bin/env node

/**
 * Setup Validation Script
 * Validates that the user flow validation framework is properly configured
 */

const { execSync } = require('child_process');

console.log('Validating User Flow Validation Framework Setup');
console.log('='.repeat(50));

try {
  // Run the framework component tests with memory optimization
  const jestCommand = `npx jest --selectProjects=user-flow-validation --testPathPattern=framework.test.ts --verbose --maxWorkers=1 --forceExit --detectOpenHandles`;
  
  execSync(jestCommand, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Framework setup validation completed successfully!');
  
} catch (error) {
  console.error('\n' + '='.repeat(50));
  console.error('❌ Framework setup validation failed:', error.message);
  process.exit(1);
}