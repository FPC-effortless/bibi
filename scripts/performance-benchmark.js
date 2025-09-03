/**
 * Performance Benchmark Script
 * Runs performance benchmarks and generates reports
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Performance benchmarks configuration
const benchmarks = {
  build: {
    name: 'Build Performance',
    command: 'npm run build',
    timeout: 300000, // 5 minutes
  },
  lighthouse: {
    name: 'Lighthouse Performance',
    command: 'npm run audit:lighthouse',
    timeout: 120000, // 2 minutes
  },
  bundleSize: {
    name: 'Bundle Size Analysis',
    command: 'ANALYZE=true npm run build',
    timeout: 300000, // 5 minutes
  },
};

// Performance thresholds
const thresholds = {
  buildTime: 60000, // 1 minute
  bundleSize: 2 * 1024 * 1024, // 2MB
  lighthouseScore: 90, // Lighthouse performance score
};

async function runBenchmark(benchmark) {
  console.log(`\n🏃 Running ${benchmark.name}...`);
  
  const startTime = Date.now();
  
  try {
    const result = execSync(benchmark.command, {
      timeout: benchmark.timeout,
      encoding: 'utf8',
      stdio: 'pipe',
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ ${benchmark.name} completed in ${duration}ms`);
    
    return {
      name: benchmark.name,
      success: true,
      duration,
      output: result,
    };
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.error(`❌ ${benchmark.name} failed after ${duration}ms`);
    console.error(error.message);
    
    return {
      name: benchmark.name,
      success: false,
      duration,
      error: error.message,
    };
  }
}

async function analyzeBundleSize() {
  console.log('\n📊 Analyzing bundle size...');
  
  const buildDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(buildDir, 'static');
  
  if (!fs.existsSync(staticDir)) {
    console.warn('⚠️ Build directory not found. Run npm run build first.');
    return null;
  }
  
  let totalSize = 0;
  const files = [];
  
  function calculateSize(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        calculateSize(itemPath);
      } else {
        totalSize += stats.size;
        files.push({
          path: path.relative(staticDir, itemPath),
          size: stats.size,
        });
      }
    });
  }
  
  calculateSize(staticDir);
  
  // Sort files by size (largest first)
  files.sort((a, b) => b.size - a.size);
  
  console.log(`📦 Total bundle size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📁 Number of files: ${files.length}`);
  
  // Show largest files
  console.log('\n🔍 Largest files:');
  files.slice(0, 10).forEach((file, index) => {
    const sizeKB = (file.size / 1024).toFixed(2);
    console.log(`  ${index + 1}. ${file.path} (${sizeKB} KB)`);
  });
  
  return {
    totalSize,
    fileCount: files.length,
    files: files.slice(0, 20), // Top 20 files
  };
}

async function checkPerformanceBudget(results) {
  console.log('\n💰 Checking performance budget...');
  
  const violations = [];
  
  // Check build time
  const buildResult = results.find(r => r.name === 'Build Performance');
  if (buildResult && buildResult.success && buildResult.duration > thresholds.buildTime) {
    violations.push(`Build time (${buildResult.duration}ms) exceeds threshold (${thresholds.buildTime}ms)`);
  }
  
  // Check bundle size
  const bundleAnalysis = await analyzeBundleSize();
  if (bundleAnalysis && bundleAnalysis.totalSize > thresholds.bundleSize) {
    violations.push(`Bundle size (${(bundleAnalysis.totalSize / 1024 / 1024).toFixed(2)}MB) exceeds threshold (${(thresholds.bundleSize / 1024 / 1024).toFixed(2)}MB)`);
  }
  
  if (violations.length > 0) {
    console.log('\n⚠️ Performance budget violations:');
    violations.forEach(violation => {
      console.log(`  - ${violation}`);
    });
    return false;
  } else {
    console.log('✅ All performance budgets passed!');
    return true;
  }
}

async function generateReport(results, bundleAnalysis, budgetPassed) {
  const report = {
    timestamp: new Date().toISOString(),
    benchmarks: results,
    bundleAnalysis,
    budgetPassed,
    summary: {
      totalBenchmarks: results.length,
      successfulBenchmarks: results.filter(r => r.success).length,
      failedBenchmarks: results.filter(r => !r.success).length,
      totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
    },
  };
  
  // Save report to file
  const reportPath = path.join(process.cwd(), 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📄 Performance report saved to: ${reportPath}`);
  
  // Generate markdown report
  const markdownReport = generateMarkdownReport(report);
  const markdownPath = path.join(process.cwd(), 'PERFORMANCE_REPORT.md');
  fs.writeFileSync(markdownPath, markdownReport);
  
  console.log(`📄 Markdown report saved to: ${markdownPath}`);
  
  return report;
}

function generateMarkdownReport(report) {
  const { benchmarks, bundleAnalysis, budgetPassed, summary } = report;
  
  let markdown = `# Performance Benchmark Report\n\n`;
  markdown += `**Generated:** ${new Date(report.timestamp).toLocaleString()}\n\n`;
  
  // Summary
  markdown += `## Summary\n\n`;
  markdown += `- **Total Benchmarks:** ${summary.totalBenchmarks}\n`;
  markdown += `- **Successful:** ${summary.successfulBenchmarks}\n`;
  markdown += `- **Failed:** ${summary.failedBenchmarks}\n`;
  markdown += `- **Total Duration:** ${(summary.totalDuration / 1000).toFixed(2)}s\n`;
  markdown += `- **Budget Status:** ${budgetPassed ? '✅ Passed' : '❌ Failed'}\n\n`;
  
  // Benchmarks
  markdown += `## Benchmark Results\n\n`;
  benchmarks.forEach(benchmark => {
    const status = benchmark.success ? '✅' : '❌';
    const duration = (benchmark.duration / 1000).toFixed(2);
    markdown += `### ${status} ${benchmark.name}\n`;
    markdown += `- **Duration:** ${duration}s\n`;
    if (!benchmark.success) {
      markdown += `- **Error:** ${benchmark.error}\n`;
    }
    markdown += `\n`;
  });
  
  // Bundle Analysis
  if (bundleAnalysis) {
    markdown += `## Bundle Analysis\n\n`;
    markdown += `- **Total Size:** ${(bundleAnalysis.totalSize / 1024 / 1024).toFixed(2)} MB\n`;
    markdown += `- **File Count:** ${bundleAnalysis.fileCount}\n\n`;
    
    if (bundleAnalysis.files.length > 0) {
      markdown += `### Largest Files\n\n`;
      markdown += `| File | Size |\n`;
      markdown += `|------|------|\n`;
      bundleAnalysis.files.slice(0, 10).forEach(file => {
        const sizeKB = (file.size / 1024).toFixed(2);
        markdown += `| ${file.path} | ${sizeKB} KB |\n`;
      });
      markdown += `\n`;
    }
  }
  
  return markdown;
}

async function main() {
  console.log('🚀 Starting performance benchmarks...');
  
  const results = [];
  
  // Run benchmarks
  for (const [key, benchmark] of Object.entries(benchmarks)) {
    const result = await runBenchmark(benchmark);
    results.push(result);
  }
  
  // Analyze bundle size
  const bundleAnalysis = await analyzeBundleSize();
  
  // Check performance budget
  const budgetPassed = await checkPerformanceBudget(results);
  
  // Generate report
  const report = await generateReport(results, bundleAnalysis, budgetPassed);
  
  console.log('\n🎉 Performance benchmarking completed!');
  
  // Exit with error code if any benchmark failed or budget violated
  const hasFailures = results.some(r => !r.success) || !budgetPassed;
  process.exit(hasFailures ? 1 : 0);
}

// Run the benchmarks
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Benchmark failed:', error);
    process.exit(1);
  });
}

module.exports = {
  runBenchmark,
  analyzeBundleSize,
  checkPerformanceBudget,
  generateReport,
};