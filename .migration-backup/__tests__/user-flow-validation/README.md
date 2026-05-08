# User Flow Validation Testing Framework

A comprehensive testing framework for validating user flows across multiple browsers and devices for the bibiere luxury fashion e-commerce website.

## Overview

This framework provides systematic validation of user interactions, ensuring all functionality works correctly across different browsers, devices, and user scenarios. It supports both automated and manual testing approaches with detailed reporting and issue tracking.

## Features

- **Multi-Browser Support**: Chrome, Firefox, Safari, Edge
- **Multi-Device Testing**: Desktop, tablet, and mobile viewports
- **Comprehensive Test Cases**: Pre-defined test cases covering all user flows
- **Detailed Reporting**: HTML, JSON, Markdown, and CSV report formats
- **Issue Tracking**: Built-in issue management and tracking system
- **Parallel Execution**: Run tests concurrently for faster results
- **Screenshot Capture**: Automatic screenshots on test failures
- **Accessibility Testing**: Keyboard navigation and screen reader compatibility

## Quick Start

### 1. Setup

```typescript
import { setupUserFlowValidation } from './__tests__/user-flow-validation/setup';

// Initialize the framework
await setupUserFlowValidation();
```

### 2. Run Quick Validation

```typescript
import { userFlowValidationFramework } from './__tests__/user-flow-validation/framework';

// Run smoke tests (basic functionality)
await userFlowValidationFramework.quickStart('smoke');

// Run full validation across all browsers and devices
await userFlowValidationFramework.quickStart('full');

// Run mobile-specific tests
await userFlowValidationFramework.quickStart('mobile');

// Run accessibility tests
await userFlowValidationFramework.quickStart('accessibility');
```

### 3. Custom Test Execution

```typescript
import { testExecutor } from './__tests__/user-flow-validation/framework';

// Execute specific test suite with custom configuration
const results = await testExecutor.executeTestSuite('user-flow-validation', {
  browsers: ['chrome', 'firefox'],
  devices: ['desktop-1920', 'iphone'],
  parallel: true,
  maxConcurrency: 2,
  baseUrl: 'http://localhost:3000'
});
```

## Framework Components

### Test Case Manager
Manages test cases, test suites, and validation results.

```typescript
import { testCaseManager } from './__tests__/user-flow-validation/framework';

// Create test suite
const suite = testCaseManager.createTestSuite(
  'my-suite',
  'My Test Suite',
  'Description of test suite'
);

// Add test case
testCaseManager.addTestCase('my-suite', testCase);

// Get results
const results = testCaseManager.getTestCaseResults('test-case-id');
```

### Browser Environment
Configures browser and device settings for testing.

```typescript
import { browserEnvironment } from './__tests__/user-flow-validation/framework';

// Get supported browsers
const browsers = browserEnvironment.getSupportedBrowsers();

// Get device configuration
const deviceConfig = browserEnvironment.getDeviceConfig('iphone');

// Generate test matrix
const matrix = browserEnvironment.generateTestMatrix();
```

### Test Executor
Executes tests across different browser and device combinations.

```typescript
import { testExecutor } from './__tests__/user-flow-validation/framework';

// Execute single test case
const result = await testExecutor.executeTestCase(testCase, context);

// Execute test suite
const results = await testExecutor.executeTestSuite('suite-id', config);
```

### Validation Reporter
Generates comprehensive reports and tracks issues.

```typescript
import { validationReporter } from './__tests__/user-flow-validation/framework';

// Generate HTML report
const htmlReport = validationReporter.generateReport(testSuite, results, {
  format: 'html',
  includeScreenshots: true,
  showOnlyFailures: false
});

// Track issue
const trackerId = validationReporter.trackIssue('test-case-id', issue);
```

## Test Categories

### Navigation Tests
- Header navigation functionality
- Footer link validation
- Mobile menu interactions
- Logo and brand element testing

### Product Discovery Tests
- Search functionality
- Product grid and card interactions
- Product detail page validation
- Filter and sort operations

### Shopping Flow Tests
- Cart drawer functionality
- Add to cart/wishlist operations
- Checkout process validation
- Payment form testing

### Account Management Tests
- Account page navigation
- Wishlist management
- Wardrobe view functionality
- User authentication flows

### Mobile Responsiveness Tests
- Touch interaction validation
- Mobile layout testing
- Gesture support verification
- Mobile-specific functionality

### Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- ARIA label validation
- Focus management testing

### Cross-Browser Tests
- Browser compatibility validation
- Feature support verification
- Performance consistency
- Visual regression testing

## Configuration

### Environment Variables

```bash
# Base URL for testing
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Auto-setup framework on import
AUTO_SETUP_VALIDATION=true

# Screenshot directory
SCREENSHOT_PATH=__tests__/user-flow-validation/screenshots

# Report output directory
REPORT_PATH=__tests__/user-flow-validation/reports
```

### Custom Configuration

```typescript
await userFlowValidationFramework.initialize({
  baseUrl: 'https://your-site.com',
  defaultBrowsers: ['chrome', 'firefox'],
  defaultDevices: ['desktop-1920', 'iphone'],
  screenshotPath: 'custom/screenshot/path',
  reportPath: 'custom/report/path'
});
```

## Test Case Structure

```typescript
const testCase: TestCase = {
  id: 'unique-test-id',
  name: 'Test Case Name',
  description: 'Detailed description of what this test validates',
  userType: 'both', // 'registered' | 'unregistered' | 'both'
  category: 'navigation', // Test category
  priority: 'high', // 'high' | 'medium' | 'low'
  status: 'pending', // 'pending' | 'passed' | 'failed' | 'blocked'
  requirements: ['1.1', '1.2'], // Reference to requirements
  steps: [
    {
      action: 'Click on element',
      element: '.css-selector',
      expectedBehavior: 'Element should respond',
      validationCriteria: ['Criteria 1', 'Criteria 2']
    }
  ],
  expectedResults: [
    'Expected outcome 1',
    'Expected outcome 2'
  ]
};
```

## Reporting

### HTML Report
Comprehensive visual report with:
- Test execution summary
- Browser and device coverage
- Issue breakdown by severity
- Detailed test results with screenshots
- Interactive filtering and navigation

### JSON Report
Machine-readable format for:
- CI/CD integration
- Custom analysis tools
- Data processing pipelines
- API consumption

### Markdown Report
Documentation-friendly format for:
- README files
- Wiki documentation
- Issue tracking systems
- Team communication

### CSV Report
Spreadsheet-compatible format for:
- Data analysis
- Trend tracking
- Management reporting
- Statistical analysis

## Issue Tracking

The framework includes built-in issue tracking:

```typescript
// Track new issue
const trackerId = validationReporter.trackIssue('test-case-id', {
  severity: 'critical',
  description: 'Button not responding to clicks',
  element: '.submit-button',
  expectedBehavior: 'Button should submit form',
  actualBehavior: 'Button does not respond to clicks',
  reproductionSteps: [
    'Navigate to form page',
    'Fill out form fields',
    'Click submit button',
    'Observe no response'
  ]
});

// Update issue status
validationReporter.updateIssueStatus(trackerId, 'resolved', 'Fixed button event handler');

// Get issues by status
const openIssues = validationReporter.getIssuesByStatus('open');
```

## Best Practices

### Test Organization
- Group related tests into logical categories
- Use descriptive test names and IDs
- Include requirement references
- Set appropriate priority levels

### Test Execution
- Start with smoke tests for quick feedback
- Run full suites before releases
- Use parallel execution for faster results
- Monitor execution times and optimize

### Issue Management
- Classify issues by severity appropriately
- Provide detailed reproduction steps
- Include screenshots for visual issues
- Track resolution progress

### Reporting
- Generate reports after each test run
- Share reports with relevant stakeholders
- Archive reports for trend analysis
- Use appropriate format for audience

## Integration

### CI/CD Integration
```yaml
# Example GitHub Actions workflow
- name: Run User Flow Validation
  run: |
    npm run test:user-flows
    npm run generate:validation-report
```

### Jest Integration
```javascript
// jest.config.js
module.exports = {
  setupFilesAfterEnv: [
    '<rootDir>/__tests__/user-flow-validation/setup.ts'
  ]
};
```

### Playwright Integration
```typescript
// Use with Playwright for actual browser automation
import { chromium, firefox, webkit } from 'playwright';

// Framework can be extended to use real browser instances
```

## Troubleshooting

### Common Issues

1. **Framework not initializing**
   - Check environment variables
   - Verify setup script execution
   - Review console logs for errors

2. **Tests not executing**
   - Validate browser availability
   - Check device configurations
   - Verify base URL accessibility

3. **Reports not generating**
   - Check file permissions
   - Verify output directory exists
   - Review report configuration

### Debug Mode
```typescript
// Enable debug logging
process.env.DEBUG = 'user-flow-validation:*';
```

## Contributing

To add new test cases:

1. Create test case objects following the established structure
2. Add to appropriate category in `config/test-cases.ts`
3. Update documentation
4. Test the new cases thoroughly

To extend framework functionality:

1. Follow existing patterns and interfaces
2. Add comprehensive error handling
3. Include unit tests for new features
4. Update documentation and examples

## License

This framework is part of the bibiere e-commerce project and follows the same licensing terms.