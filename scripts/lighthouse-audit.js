#!/usr/bin/env node

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

/**
 * Lighthouse Performance Audit Script
 * Runs comprehensive performance tests and generates reports
 */

const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'largest-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'cumulative-layout-shift',
      'total-blocking-time',
      'max-potential-fid',
      'interactive',
      'network-requests',
      'network-rtt',
      'network-server-latency',
      'main-thread-tasks',
      'bootup-time',
      'uses-optimized-images',
      'uses-webp-images',
      'uses-text-compression',
      'unused-css-rules',
      'unused-javascript',
      'modern-image-formats',
      'efficient-animated-content',
      'preload-lcp-image',
      'total-byte-weight',
      'dom-size',
      'critical-request-chains'
    ],
  },
};

const desktopConfig = {
  ...config,
  settings: {
    ...config.settings,
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: false,
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
};

const mobileConfig = {
  ...config,
  settings: {
    ...config.settings,
    formFactor: 'mobile',
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 150 * 3.75,
      downloadThroughputKbps: 1638.4,
      uploadThroughputKbps: 675,
    },
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    },
  },
};

async function runLighthouse(url, config, outputPath) {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {logLevel: 'info', output: 'html', port: chrome.port};
  
  try {
    const runnerResult = await lighthouse(url, options, config);
    
    // Generate HTML report
    const reportHtml = runnerResult.report;
    fs.writeFileSync(outputPath, reportHtml);
    
    // Extract key metrics
    const lhr = runnerResult.lhr;
    const metrics = {
      performanceScore: Math.round(lhr.categories.performance.score * 100),
      firstContentfulPaint: lhr.audits['first-contentful-paint'].displayValue,
      largestContentfulPaint: lhr.audits['largest-contentful-paint'].displayValue,
      cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].displayValue,
      totalBlockingTime: lhr.audits['total-blocking-time'].displayValue,
      speedIndex: lhr.audits['speed-index'].displayValue,
      timeToInteractive: lhr.audits['interactive'].displayValue,
    };
    
    await chrome.kill();
    return metrics;
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

async function runAudit() {
  const baseUrl = process.env.LIGHTHOUSE_URL || 'http://localhost:3000';
  const outputDir = path.join(__dirname, '..', 'lighthouse-reports');
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  console.log('🚀 Starting Lighthouse Performance Audit...');
  console.log(`📍 Target URL: ${baseUrl}`);
  
  try {
    // Test key pages
    const pages = [
      { path: '/', name: 'homepage' },
      { path: '/collections/dresses', name: 'collection' },
      { path: '/account', name: 'account' },
      { path: '/checkout', name: 'checkout' }
    ];
    
    const results = {};
    
    for (const page of pages) {
      const url = `${baseUrl}${page.path}`;
      console.log(`\n📱 Testing ${page.name} (Mobile)...`);
      
      const mobileOutputPath = path.join(outputDir, `${page.name}-mobile-${timestamp}.html`);
      const mobileMetrics = await runLighthouse(url, mobileConfig, mobileOutputPath);
      
      console.log(`📊 Mobile Results for ${page.name}:`);
      console.log(`   Performance Score: ${mobileMetrics.performanceScore}/100`);
      console.log(`   LCP: ${mobileMetrics.largestContentfulPaint}`);
      console.log(`   CLS: ${mobileMetrics.cumulativeLayoutShift}`);
      console.log(`   FCP: ${mobileMetrics.firstContentfulPaint}`);
      
      console.log(`\n🖥️  Testing ${page.name} (Desktop)...`);
      
      const desktopOutputPath = path.join(outputDir, `${page.name}-desktop-${timestamp}.html`);
      const desktopMetrics = await runLighthouse(url, desktopConfig, desktopOutputPath);
      
      console.log(`📊 Desktop Results for ${page.name}:`);
      console.log(`   Performance Score: ${desktopMetrics.performanceScore}/100`);
      console.log(`   LCP: ${desktopMetrics.largestContentfulPaint}`);
      console.log(`   CLS: ${desktopMetrics.cumulativeLayoutShift}`);
      console.log(`   FCP: ${desktopMetrics.firstContentfulPaint}`);
      
      results[page.name] = {
        mobile: mobileMetrics,
        desktop: desktopMetrics
      };
    }
    
    // Generate summary report
    const summaryPath = path.join(outputDir, `summary-${timestamp}.json`);
    fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
    
    console.log('\n✅ Lighthouse audit completed!');
    console.log(`📁 Reports saved to: ${outputDir}`);
    
    // Check if targets are met
    const targets = {
      performance: 90,
      lcp: 2500, // 2.5s in ms
      cls: 0.1,
      fcp: 1800 // 1.8s in ms
    };
    
    console.log('\n🎯 Performance Target Analysis:');
    for (const [pageName, pageResults] of Object.entries(results)) {
      console.log(`\n${pageName.toUpperCase()}:`);
      const mobile = pageResults.mobile;
      const desktop = pageResults.desktop;
      
      console.log(`  Mobile Performance: ${mobile.performanceScore}/100 ${mobile.performanceScore >= targets.performance ? '✅' : '❌'}`);
      console.log(`  Desktop Performance: ${desktop.performanceScore}/100 ${desktop.performanceScore >= targets.performance ? '✅' : '❌'}`);
    }
    
  } catch (error) {
    console.error('❌ Lighthouse audit failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runAudit();
}

module.exports = { runAudit };
