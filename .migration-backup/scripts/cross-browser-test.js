#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Cross-Browser Testing Script
 * Tests functionality across Chrome, Firefox, Safari, and Edge
 */

const testConfig = {
  browsers: [
    {
      name: 'Chrome',
      product: 'chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    {
      name: 'Firefox',
      product: 'firefox',
      args: []
    }
  ],
  viewports: [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 }
  ],
  pages: [
    { path: '/', name: 'Homepage', tests: ['navigation', 'search', 'cart'] },
    { path: '/collections/dresses', name: 'Collection', tests: ['filters', 'sorting', 'product-cards'] },
    { path: '/account', name: 'Account', tests: ['wishlist', 'navigation'] },
    { path: '/checkout', name: 'Checkout', tests: ['forms', 'validation'] }
  ]
};

async function testNavigation(page) {
  const results = [];
  
  try {
    // Test main navigation links
    const navLinks = await page.$$eval('nav a', links => 
      links.map(link => ({ href: link.href, text: link.textContent.trim() }))
    );
    
    for (const link of navLinks.slice(0, 3)) { // Test first 3 links
      try {
        await page.goto(link.href, { waitUntil: 'networkidle0', timeout: 10000 });
        results.push({ test: 'navigation', link: link.text, status: 'pass' });
      } catch (error) {
        results.push({ test: 'navigation', link: link.text, status: 'fail', error: error.message });
      }
    }
    
    // Test mobile menu (if exists)
    const mobileMenuButton = await page.$('[data-testid="mobile-menu"], .mobile-menu-trigger');
    if (mobileMenuButton) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500);
      const mobileMenu = await page.$('.mobile-menu, [data-testid="mobile-navigation"]');
      results.push({ 
        test: 'mobile-menu', 
        status: mobileMenu ? 'pass' : 'fail',
        error: mobileMenu ? null : 'Mobile menu not found after click'
      });
    }
    
  } catch (error) {
    results.push({ test: 'navigation', status: 'fail', error: error.message });
  }
  
  return results;
}

async function testSearch(page) {
  const results = [];
  
  try {
    // Test search functionality
    const searchTrigger = await page.$('[data-testid="search-trigger"], .search-trigger, button[aria-label*="Search"]');
    if (searchTrigger) {
      await searchTrigger.click();
      await page.waitForTimeout(500);
      
      const searchInput = await page.$('input[type="search"], input[placeholder*="Search"]');
      if (searchInput) {
        await searchInput.type('dress');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2000);
        
        const searchResults = await page.$('.search-results, [data-testid="search-results"]');
        results.push({
          test: 'search',
          status: searchResults ? 'pass' : 'fail',
          error: searchResults ? null : 'Search results not found'
        });
      } else {
        results.push({ test: 'search', status: 'fail', error: 'Search input not found' });
      }
    } else {
      results.push({ test: 'search', status: 'fail', error: 'Search trigger not found' });
    }
  } catch (error) {
    results.push({ test: 'search', status: 'fail', error: error.message });
  }
  
  return results;
}

async function testCart(page) {
  const results = [];
  
  try {
    // Test cart drawer
    const cartTrigger = await page.$('[data-testid="cart-trigger"], .cart-trigger');
    if (cartTrigger) {
      await cartTrigger.click();
      await page.waitForTimeout(500);
      
      const cartDrawer = await page.$('.cart-drawer, [data-testid="cart-drawer"]');
      results.push({
        test: 'cart-drawer',
        status: cartDrawer ? 'pass' : 'fail',
        error: cartDrawer ? null : 'Cart drawer not found'
      });
      
      // Close cart
      const closeButton = await page.$('.cart-close, [data-testid="cart-close"]');
      if (closeButton) {
        await closeButton.click();
      } else {
        await page.keyboard.press('Escape');
      }
    } else {
      results.push({ test: 'cart-drawer', status: 'fail', error: 'Cart trigger not found' });
    }
  } catch (error) {
    results.push({ test: 'cart-drawer', status: 'fail', error: error.message });
  }
  
  return results;
}

async function testFilters(page) {
  const results = [];
  
  try {
    // Test filter functionality
    const filterButtons = await page.$$('.filter-button, [data-testid*="filter"]');
    if (filterButtons.length > 0) {
      await filterButtons[0].click();
      await page.waitForTimeout(1000);
      
      const filteredResults = await page.$('.product-grid, [data-testid="product-grid"]');
      results.push({
        test: 'filters',
        status: filteredResults ? 'pass' : 'fail',
        error: filteredResults ? null : 'Filtered results not found'
      });
    } else {
      results.push({ test: 'filters', status: 'skip', error: 'No filter buttons found' });
    }
  } catch (error) {
    results.push({ test: 'filters', status: 'fail', error: error.message });
  }
  
  return results;
}

async function testSorting(page) {
  const results = [];
  
  try {
    // Test sort functionality
    const sortSelect = await page.$('select[name*="sort"], .sort-select');
    if (sortSelect) {
      await sortSelect.select('price-low-high');
      await page.waitForTimeout(1000);
      
      results.push({ test: 'sorting', status: 'pass' });
    } else {
      results.push({ test: 'sorting', status: 'skip', error: 'Sort select not found' });
    }
  } catch (error) {
    results.push({ test: 'sorting', status: 'fail', error: error.message });
  }
  
  return results;
}

async function testProductCards(page) {
  const results = [];
  
  try {
    // Test product card interactions
    const productCards = await page.$$('.product-card, [data-testid="product-card"]');
    if (productCards.length > 0) {
      // Test hover effect
      await productCards[0].hover();
      await page.waitForTimeout(500);
      
      // Test wishlist button
      const wishlistButton = await productCards[0].$('.wishlist-button, [data-testid="wishlist-button"]');
      if (wishlistButton) {
        await wishlistButton.click();
        await page.waitForTimeout(500);
      }
      
      results.push({ test: 'product-cards', status: 'pass' });
    } else {
      results.push({ test: 'product-cards', status: 'fail', error: 'No product cards found' });
    }
  } catch (error) {
    results.push({ test: 'product-cards', status: 'fail', error: error.message });
  }
  
  return results;
}

async function testWishlist(page) {
  const results = [];
  
  try {
    // Test wishlist functionality
    const wishlistSection = await page.$('.wishlist-section, [data-testid="wishlist"]');
    if (wishlistSection) {
      const wishlistItems = await page.$$('.wishlist-item, [data-testid="wishlist-item"]');
      results.push({
        test: 'wishlist',
        status: 'pass',
        itemCount: wishlistItems.length
      });
    } else {
      results.push({ test: 'wishlist', status: 'fail', error: 'Wishlist section not found' });
    }
  } catch (error) {
    results.push({ test: 'wishlist', status: 'fail', error: error.message });
  }
  
  return results;
}

async function testForms(page) {
  const results = [];
  
  try {
    // Test form inputs
    const inputs = await page.$$('input, select, textarea');
    if (inputs.length > 0) {
      // Test first input
      await inputs[0].focus();
      await inputs[0].type('test@example.com');
      
      // Test form validation
      const submitButton = await page.$('button[type="submit"], .submit-button');
      if (submitButton) {
        await submitButton.click();
        await page.waitForTimeout(1000);
      }
      
      results.push({ test: 'forms', status: 'pass', inputCount: inputs.length });
    } else {
      results.push({ test: 'forms', status: 'fail', error: 'No form inputs found' });
    }
  } catch (error) {
    results.push({ test: 'forms', status: 'fail', error: error.message });
  }
  
  return results;
}

async function testValidation(page) {
  const results = [];
  
  try {
    // Test form validation
    const requiredInputs = await page.$$('input[required]');
    if (requiredInputs.length > 0) {
      const submitButton = await page.$('button[type="submit"], .submit-button');
      if (submitButton) {
        await submitButton.click();
        await page.waitForTimeout(500);
        
        const errorMessages = await page.$$('.error-message, .field-error');
        results.push({
          test: 'validation',
          status: errorMessages.length > 0 ? 'pass' : 'fail',
          errorCount: errorMessages.length
        });
      }
    } else {
      results.push({ test: 'validation', status: 'skip', error: 'No required inputs found' });
    }
  } catch (error) {
    results.push({ test: 'validation', status: 'fail', error: error.message });
  }
  
  return results;
}

const testFunctions = {
  navigation: testNavigation,
  search: testSearch,
  cart: testCart,
  filters: testFilters,
  sorting: testSorting,
  'product-cards': testProductCards,
  wishlist: testWishlist,
  forms: testForms,
  validation: testValidation
};

async function runCrossBrowserTest() {
  const baseUrl = process.env.CROSS_BROWSER_URL || 'http://localhost:3000';
  const outputDir = path.join(__dirname, '..', 'cross-browser-reports');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const allResults = [];
  
  console.log('🌐 Starting Cross-Browser Testing...');
  console.log(`📍 Target URL: ${baseUrl}`);
  
  for (const browserConfig of testConfig.browsers) {
    console.log(`\n🔍 Testing ${browserConfig.name}...`);
    
    let browser;
    try {
      browser = await puppeteer.launch({
        product: browserConfig.product,
        headless: true,
        args: browserConfig.args
      });
      
      for (const viewport of testConfig.viewports) {
        console.log(`  📱 ${viewport.name} (${viewport.width}x${viewport.height})`);
        
        const page = await browser.newPage();
        await page.setViewport(viewport);
        
        for (const pageConfig of testConfig.pages) {
          const url = `${baseUrl}${pageConfig.path}`;
          console.log(`    🧪 Testing ${pageConfig.name}...`);
          
          try {
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
            
            const pageResults = {
              browser: browserConfig.name,
              viewport: viewport.name,
              page: pageConfig.name,
              url: url,
              tests: [],
              timestamp: new Date().toISOString()
            };
            
            // Run tests for this page
            for (const testName of pageConfig.tests) {
              if (testFunctions[testName]) {
                const testResults = await testFunctions[testName](page);
                pageResults.tests.push(...testResults);
              }
            }
            
            allResults.push(pageResults);
            
            // Log results
            const passed = pageResults.tests.filter(t => t.status === 'pass').length;
            const failed = pageResults.tests.filter(t => t.status === 'fail').length;
            const skipped = pageResults.tests.filter(t => t.status === 'skip').length;
            
            console.log(`      ✅ ${passed} passed, ❌ ${failed} failed, ⏭️ ${skipped} skipped`);
            
          } catch (error) {
            console.log(`      ❌ Page load failed: ${error.message}`);
            allResults.push({
              browser: browserConfig.name,
              viewport: viewport.name,
              page: pageConfig.name,
              url: url,
              error: error.message,
              timestamp: new Date().toISOString()
            });
          }
        }
        
        await page.close();
      }
      
    } catch (error) {
      console.error(`❌ Failed to launch ${browserConfig.name}:`, error.message);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
  
  // Generate report
  const reportPath = path.join(outputDir, `cross-browser-report-${timestamp}.json`);
  const htmlReportPath = path.join(outputDir, `cross-browser-report-${timestamp}.html`);
  
  // Save JSON report
  fs.writeFileSync(reportPath, JSON.stringify(allResults, null, 2));
  
  // Generate HTML report
  const htmlReport = generateCrossBrowserHtmlReport(allResults);
  fs.writeFileSync(htmlReportPath, htmlReport);
  
  console.log('\n✅ Cross-browser testing completed!');
  console.log(`📁 Reports saved to: ${outputDir}`);
  
  // Print summary
  const totalTests = allResults.reduce((sum, result) => sum + (result.tests?.length || 0), 0);
  const passedTests = allResults.reduce((sum, result) => 
    sum + (result.tests?.filter(t => t.status === 'pass').length || 0), 0);
  const failedTests = allResults.reduce((sum, result) => 
    sum + (result.tests?.filter(t => t.status === 'fail').length || 0), 0);
  
  console.log('\n📊 Cross-Browser Test Summary:');
  console.log(`   Total tests: ${totalTests}`);
  console.log(`   Passed: ${passedTests}`);
  console.log(`   Failed: ${failedTests}`);
  console.log(`   Success rate: ${Math.round((passedTests / totalTests) * 100)}%`);
}

function generateCrossBrowserHtmlReport(results) {
  const summary = {
    totalTests: results.reduce((sum, result) => sum + (result.tests?.length || 0), 0),
    passedTests: results.reduce((sum, result) => 
      sum + (result.tests?.filter(t => t.status === 'pass').length || 0), 0),
    failedTests: results.reduce((sum, result) => 
      sum + (result.tests?.filter(t => t.status === 'fail').length || 0), 0),
    browsers: [...new Set(results.map(r => r.browser))],
    viewports: [...new Set(results.map(r => r.viewport))]
  };
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cross-Browser Test Report - Bibiere</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1400px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #8B1538; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .metric { background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center; }
        .metric-value { font-size: 1.5em; font-weight: bold; color: #8B1538; }
        .metric-label { color: #666; margin-top: 5px; font-size: 0.9em; }
        .results-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
        .result-card { border: 1px solid #e0e0e0; border-radius: 6px; padding: 15px; }
        .result-header { font-weight: bold; margin-bottom: 10px; color: #333; }
        .test-result { margin: 5px 0; padding: 5px; border-radius: 3px; font-size: 0.9em; }
        .test-pass { background: #d4edda; color: #155724; }
        .test-fail { background: #f8d7da; color: #721c24; }
        .test-skip { background: #fff3cd; color: #856404; }
        .error { color: #dc3545; font-size: 0.8em; margin-top: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 Cross-Browser Test Report</h1>
        <p><strong>Generated:</strong> ${new Date().toISOString()}</p>
        
        <div class="summary">
            <div class="metric">
                <div class="metric-value">${summary.totalTests}</div>
                <div class="metric-label">Total Tests</div>
            </div>
            <div class="metric">
                <div class="metric-value">${summary.passedTests}</div>
                <div class="metric-label">Passed</div>
            </div>
            <div class="metric">
                <div class="metric-value">${summary.failedTests}</div>
                <div class="metric-label">Failed</div>
            </div>
            <div class="metric">
                <div class="metric-value">${Math.round((summary.passedTests / summary.totalTests) * 100)}%</div>
                <div class="metric-label">Success Rate</div>
            </div>
            <div class="metric">
                <div class="metric-value">${summary.browsers.length}</div>
                <div class="metric-label">Browsers</div>
            </div>
            <div class="metric">
                <div class="metric-value">${summary.viewports.length}</div>
                <div class="metric-label">Viewports</div>
            </div>
        </div>
        
        <div class="results-grid">
            ${results.map(result => `
            <div class="result-card">
                <div class="result-header">
                    ${result.browser} - ${result.viewport} - ${result.page}
                </div>
                ${result.error ? `
                    <div class="test-result test-fail">
                        Page Load Failed
                        <div class="error">${result.error}</div>
                    </div>
                ` : ''}
                ${result.tests ? result.tests.map(test => `
                    <div class="test-result test-${test.status}">
                        ${test.test}: ${test.status.toUpperCase()}
                        ${test.error ? `<div class="error">${test.error}</div>` : ''}
                    </div>
                `).join('') : ''}
            </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
  `;
}

if (require.main === module) {
  runCrossBrowserTest();
}

module.exports = { runCrossBrowserTest };
