#!/usr/bin/env node

/**
 * Validation Report Generator Script
 * Generates validation reports from existing test results
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Generating User Flow Validation Report');
console.log('='.repeat(50));

try {
  // Run the report generation through Jest
  const jestCommand = `npx jest --testNamePattern="generate.*report" --testPathPattern=user-flow-validation/example.test.ts --verbose`;
  
  execSync(jestCommand, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  // Check if reports directory exists and create if not
  const reportsDir = path.join(process.cwd(), '__tests__/user-flow-validation/reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Validation report generation completed!');
  console.log(`📁 Reports saved to: ${reportsDir}`);
  
} catch (error) {
  console.error('\n' + '='.repeat(50));
  console.error('❌ Report generation failed:', error.message);
  process.exit(1);
}