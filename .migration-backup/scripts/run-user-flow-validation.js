#!/usr/bin/env node

/**
 * User Flow Validation Runner Script
 * Executes user flow validation scenarios with proper TypeScript support
 */

const { execSync } = require('child_process');
const path = require('path');

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
  // Use Jest to run the validation framework with memory optimization
  const jestCommand = `npx jest --selectProjects=user-flow-validation --testPathPattern=framework.test.ts --verbose --maxWorkers=1 --forceExit --detectOpenHandles`;
  
  // Set environment variable to specify the scenario
  process.env.USER_FLOW_SCENARIO = scenario;
  
  execSync(jestCommand, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ User Flow Validation (${scenario}) completed successfully!`);
  
} catch (error) {
  console.error('\n' + '='.repeat(50));
  console.error(`❌ User Flow Validation (${scenario}) failed:`, error.message);
  process.exit(1);
}