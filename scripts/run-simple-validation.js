#!/usr/bin/env node

/**
 * Simple User Flow Validation Runner
 * Runs validation tests without Jest projects to avoid memory issues
 */

const { execSync } = require('child_process');

// Get the scenario from command line arguments
const scenario = process.argv[2] || 'smoke';
const validScenarios = ['smoke', 'full', 'mobile', 'accessibility'];

if (!validScenarios.includes(scenario)) {
  console.error(`Invalid scenario: ${scenario}`);
  console.error(`Valid scenarios: ${validScenarios.join(', ')}`);
  process.exit(1);
}

console.log(`Running User Flow Validation - ${scenario} scenario`);
console.log('='.repeat(50));

try {
  // Set environment variable to specify the scenario
  process.env.USER_FLOW_SCENARIO = scenario;
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';
  
  // Run Jest with specific configuration for user flow validation
  const jestCommand = [
    'npx jest',
    '__tests__/user-flow-validation/framework.test.ts',
    '--testEnvironment=node',
    '--maxWorkers=1',
    '--forceExit',
    '--detectOpenHandles',
    '--verbose'
  ].join(' ');
  
  execSync(jestCommand, {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: { ...process.env }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ User Flow Validation (${scenario}) completed successfully!`);
  console.log(`📊 Framework components tested and validated`);
  console.log(`🔧 All ${scenario} scenario requirements verified`);
  
} catch (error) {
  console.error('\n' + '='.repeat(50));
  console.error(`❌ User Flow Validation (${scenario}) failed:`, error.message);
  process.exit(1);
}