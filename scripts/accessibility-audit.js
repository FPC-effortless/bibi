#!/usr/bin/env node

const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Automated Accessibility Audit Script
 * Tests WCAG AA compliance using axe-core
 */

const config = {
  rules: {
    // WCAG AA Level rules
    'color-contrast': { enabled: true },
    'color-contrast-enhanced': { enabled: false }, // AAA level
    'focus-order-semantics': { enabled: true },
    'hidden-content': { enabled: true },
    'keyboard-navigation': { enabled: true },
    'landmark-banner-is-top-level': { enabled: true },
    'landmark-contentinfo-is-top-level': { enabled: true },
    'landmark-main-is-top-level': { enabled: true },
    'landmark-no-duplicate-banner': { enabled: true },
    'landmark-no-duplicate-contentinfo': { enabled: true },
    'landmark-one-main': { enabled: true },
    'page-has-heading-one': { enabled: true },
    'region': { enabled: true },
    'skip-link': { enabled: true },
    'tabindex': { enabled: true },
    'valid-lang': { enabled: true }
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
  exclude: [
    // Exclude third-party content that we can't control
    ['iframe'],
    ['.third-party-widget']
  ]
};

async function runAccessibilityAudit(url, page, pageName) {
  console.log(`🔍 Testing accessibility for ${pageName}...`);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Wait for dynamic content to load
    await page.waitForTimeout(2000);
    
    // Test keyboard navigation
    console.log(`⌨️  Testing keyboard navigation for ${pageName}...`);
    await testKeyboardNavigation(page);
    
    // Run axe-core accessibility tests
    const results = await new AxePuppeteer(page)
      .configure(config)
      .analyze();
    
    // Test focus management
    console.log(`🎯 Testing focus management for ${pageName}...`);
    await testFocusManagement(page);
    
    return {
      url,
      pageName,
      violations: results.violations,
      passes: results.passes,
      incomplete: results.incomplete,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`❌ Error testing ${pageName}:`, error.message);
    return {
      url,
      pageName,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

async function testKeyboardNavigation(page) {
  // Test tab navigation
  const focusableElements = await page.$$eval(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
    elements => elements.length
  );
  
  console.log(`   Found ${focusableElements} focusable elements`);
  
  // Test tab order
  for (let i = 0; i < Math.min(focusableElements, 10); i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);
  }
  
  // Test escape key functionality
  await page.keyboard.press('Escape');
  
  // Test enter key functionality
  const buttons = await page.$$('button');
  if (buttons.length > 0) {
    await buttons[0].focus();
    await page.keyboard.press('Enter');
  }
}

async function testFocusManagement(page) {
  // Test modal focus trap (if modal exists)
  const modalTrigger = await page.$('[data-testid="search-trigger"], .search-trigger');
  if (modalTrigger) {
    await modalTrigger.click();
    await page.waitForTimeout(500);
    
    // Check if focus is trapped in modal
    const activeElement = await page.evaluate(() => document.activeElement.tagName);
    console.log(`   Modal focus management: Active element is ${activeElement}`);
    
    // Close modal
    await page.keyboard.press('Escape');
  }
  
  // Test skip links
  const skipLinks = await page.$$('a[href="#main-content"], .skip-link');
  if (skipLinks.length > 0) {
    console.log(`   ✅ Skip links found: ${skipLinks.length}`);
  } else {
    console.log(`   ⚠️  No skip links found`);
  }
}

async function generateAccessibilityReport(results, outputPath) {
  const summary = {
    totalPages: results.length,
    totalViolations: results.reduce((sum, result) => sum + (result.violations?.length || 0), 0),
    totalPasses: results.reduce((sum, result) => sum + (result.passes?.length || 0), 0),
    criticalIssues: [],
    moderateIssues: [],
    minorIssues: [],
    timestamp: new Date().toISOString()
  };
  
  // Categorize violations by impact
  results.forEach(result => {
    if (result.violations) {
      result.violations.forEach(violation => {
        const issue = {
          page: result.pageName,
          rule: violation.id,
          impact: violation.impact,
          description: violation.description,
          help: violation.help,
          helpUrl: violation.helpUrl,
          nodes: violation.nodes.length
        };
        
        switch (violation.impact) {
          case 'critical':
            summary.criticalIssues.push(issue);
            break;
          case 'serious':
            summary.criticalIssues.push(issue);
            break;
          case 'moderate':
            summary.moderateIssues.push(issue);
            break;
          case 'minor':
            summary.minorIssues.push(issue);
            break;
        }
      });
    }
  });
  
  // Generate HTML report
  const htmlReport = generateHtmlReport(summary, results);
  fs.writeFileSync(outputPath.replace('.json', '.html'), htmlReport);
  
  // Save JSON report
  fs.writeFileSync(outputPath, JSON.stringify({ summary, results }, null, 2));
  
  return summary;
}

function generateHtmlReport(summary, results) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Audit Report - Bibiere</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #8B1538; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 6px; text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; color: #8B1538; }
        .metric-label { color: #666; margin-top: 5px; }
        .critical { border-left: 4px solid #dc3545; }
        .moderate { border-left: 4px solid #ffc107; }
        .minor { border-left: 4px solid #17a2b8; }
        .pass { border-left: 4px solid #28a745; }
        .issue { margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 4px; }
        .issue-title { font-weight: bold; margin-bottom: 5px; }
        .issue-description { color: #666; margin-bottom: 10px; }
        .issue-help { font-size: 0.9em; }
        .issue-help a { color: #8B1538; }
        .page-results { margin-bottom: 30px; }
        .no-issues { color: #28a745; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛡️ Accessibility Audit Report</h1>
        <p><strong>Generated:</strong> ${summary.timestamp}</p>
        
        <div class="summary">
            <div class="metric">
                <div class="metric-value">${summary.totalPages}</div>
                <div class="metric-label">Pages Tested</div>
            </div>
            <div class="metric">
                <div class="metric-value">${summary.criticalIssues.length}</div>
                <div class="metric-label">Critical Issues</div>
            </div>
            <div class="metric">
                <div class="metric-value">${summary.moderateIssues.length}</div>
                <div class="metric-label">Moderate Issues</div>
            </div>
            <div class="metric">
                <div class="metric-value">${summary.minorIssues.length}</div>
                <div class="metric-label">Minor Issues</div>
            </div>
            <div class="metric">
                <div class="metric-value">${summary.totalPasses}</div>
                <div class="metric-label">Tests Passed</div>
            </div>
        </div>
        
        ${summary.criticalIssues.length > 0 ? `
        <h2>🚨 Critical Issues</h2>
        ${summary.criticalIssues.map(issue => `
        <div class="issue critical">
            <div class="issue-title">${issue.rule} - ${issue.page}</div>
            <div class="issue-description">${issue.description}</div>
            <div class="issue-help">
                <strong>How to fix:</strong> ${issue.help}
                <br><a href="${issue.helpUrl}" target="_blank">Learn more</a>
                <br><strong>Affected elements:</strong> ${issue.nodes}
            </div>
        </div>
        `).join('')}
        ` : '<h2>✅ No Critical Issues Found</h2>'}
        
        ${summary.moderateIssues.length > 0 ? `
        <h2>⚠️ Moderate Issues</h2>
        ${summary.moderateIssues.map(issue => `
        <div class="issue moderate">
            <div class="issue-title">${issue.rule} - ${issue.page}</div>
            <div class="issue-description">${issue.description}</div>
            <div class="issue-help">
                <strong>How to fix:</strong> ${issue.help}
                <br><a href="${issue.helpUrl}" target="_blank">Learn more</a>
                <br><strong>Affected elements:</strong> ${issue.nodes}
            </div>
        </div>
        `).join('')}
        ` : ''}
        
        <h2>📊 Detailed Results by Page</h2>
        ${results.map(result => `
        <div class="page-results">
            <h3>${result.pageName} - ${result.url}</h3>
            ${result.violations && result.violations.length > 0 ? `
                <p><strong>Violations:</strong> ${result.violations.length}</p>
            ` : '<p class="no-issues">✅ No accessibility violations found</p>'}
            ${result.passes ? `<p><strong>Tests Passed:</strong> ${result.passes.length}</p>` : ''}
        </div>
        `).join('')}
    </div>
</body>
</html>
  `;
}

async function runAudit() {
  const baseUrl = process.env.ACCESSIBILITY_URL || 'http://localhost:3000';
  const outputDir = path.join(__dirname, '..', 'accessibility-reports');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  console.log('🛡️ Starting Accessibility Audit...');
  console.log(`📍 Target URL: ${baseUrl}`);
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport for consistent testing
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Test key pages
    const pages = [
      { path: '/', name: 'Homepage' },
      { path: '/collections/dresses', name: 'Collection Page' },
      { path: '/account', name: 'Account Page' },
      { path: '/checkout', name: 'Checkout Page' },
      { path: '/about', name: 'About Page' }
    ];
    
    const results = [];
    
    for (const pageConfig of pages) {
      const url = `${baseUrl}${pageConfig.path}`;
      const result = await runAccessibilityAudit(url, page, pageConfig.name);
      results.push(result);
    }
    
    // Generate reports
    const reportPath = path.join(outputDir, `accessibility-report-${timestamp}.json`);
    const summary = await generateAccessibilityReport(results, reportPath);
    
    console.log('\n✅ Accessibility audit completed!');
    console.log(`📁 Reports saved to: ${outputDir}`);
    
    // Print summary
    console.log('\n📊 Accessibility Summary:');
    console.log(`   Pages tested: ${summary.totalPages}`);
    console.log(`   Critical issues: ${summary.criticalIssues.length}`);
    console.log(`   Moderate issues: ${summary.moderateIssues.length}`);
    console.log(`   Minor issues: ${summary.minorIssues.length}`);
    console.log(`   Tests passed: ${summary.totalPasses}`);
    
    if (summary.criticalIssues.length === 0) {
      console.log('\n🎉 No critical accessibility issues found!');
    } else {
      console.log('\n⚠️  Critical issues found. Please review the report.');
    }
    
  } catch (error) {
    console.error('❌ Accessibility audit failed:', error);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  runAudit();
}

module.exports = { runAudit };
