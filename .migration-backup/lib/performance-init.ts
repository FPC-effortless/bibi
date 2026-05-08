/**
 * Performance Initialization Script
 * Initializes performance monitoring when the app loads
 */

'use client';

import { initializePerformanceMonitoring, getPerformanceMonitor } from './performance-monitor';
import { performanceUtils } from './performance-utils';

// Global performance monitoring setup
export function initializePerformance() {
  if (typeof window === 'undefined') return;

  // Initialize performance monitoring
  initializePerformanceMonitoring();

  // Set up global performance tracking
  const monitor = getPerformanceMonitor();

  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      performanceUtils.mark('page-visible');
    } else {
      performanceUtils.mark('page-hidden');
    }
  });

  // Track user interactions
  ['click', 'keydown', 'scroll'].forEach(eventType => {
    document.addEventListener(eventType, () => {
      performanceUtils.mark(`user-${eventType}`);
    }, { passive: true, once: false });
  });

  // Track route changes (for SPA navigation)
  let currentPath = window.location.pathname;
  const trackRouteChange = () => {
    const newPath = window.location.pathname;
    if (newPath !== currentPath) {
      performanceUtils.mark(`route-change-${newPath}`);
      currentPath = newPath;
    }
  };

  // Listen for route changes
  window.addEventListener('popstate', trackRouteChange);
  
  // Override pushState and replaceState to track programmatic navigation
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    trackRouteChange();
  };

  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    trackRouteChange();
  };

  // Track image loading performance
  performanceUtils.trackImagePerformance();

  // Monitor long tasks
  performanceUtils.monitorLongTasks((entries) => {
    entries.forEach(entry => {
      if (entry.duration > 50) { // Tasks longer than 50ms
        console.warn(`🐌 Long task detected: ${entry.duration.toFixed(2)}ms`);
      }
    });
  });

  // Set up periodic performance reporting
  setInterval(() => {
    const report = performanceUtils.generatePerformanceReport();
    
    // Send report to analytics (only in production)
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'performance_report',
          name: 'periodic_report',
          value: 0,
          sessionId: monitor.getSessionId(),
          timestamp: new Date().toISOString(),
          url: window.location.href,
          additionalData: report,
        }),
      }).catch(error => {
        console.warn('Failed to send performance report:', error);
      });
    }
  }, 60000); // Every minute

  console.log('🚀 Performance monitoring initialized');
}

// Enhanced fetch wrapper for API performance tracking
export function createPerformanceFetch() {
  const originalFetch = window.fetch;

  return async function performanceFetch(input: RequestInfo | URL, init?: RequestInit) {
    const url = typeof input === 'string' ? input : input.toString();
    const method = init?.method || 'GET';
    
    const tracker = performanceUtils.trackApiPerformance(url, method);
    tracker.start();

    try {
      const response = await originalFetch(input, init);
      tracker.end(response.ok);
      
      // Track API response time
      const monitor = getPerformanceMonitor();
      if (monitor) {
        const responseTime = performance.now();
        monitor.trackApiResponse(url, responseTime);
      }

      return response;
    } catch (error) {
      tracker.end(false);
      throw error;
    }
  };
}

// Replace global fetch with performance-tracked version
export function enableFetchTracking() {
  if (typeof window !== 'undefined') {
    window.fetch = createPerformanceFetch();
  }
}

// Web Vitals thresholds for alerts
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 600, poor: 1500 },
};

// Performance budget checker
export function checkPerformanceBudget() {
  const report = performanceUtils.generatePerformanceReport();
  const violations: string[] = [];

  // Check navigation timing
  if (report.navigation.loadTime && report.navigation.loadTime > 3000) {
    violations.push(`Page load time (${report.navigation.loadTime}ms) exceeds budget (3000ms)`);
  }

  // Check resource sizes
  const totalSize = report.resources.reduce((sum, resource) => sum + resource.transferSize, 0);
  const budgetSize = 2 * 1024 * 1024; // 2MB budget
  
  if (totalSize > budgetSize) {
    violations.push(`Total resource size (${(totalSize / 1024 / 1024).toFixed(2)}MB) exceeds budget (2MB)`);
  }

  // Check number of resources
  if (report.resources.length > 50) {
    violations.push(`Number of resources (${report.resources.length}) exceeds budget (50)`);
  }

  if (violations.length > 0) {
    console.warn('⚠️ Performance budget violations:', violations);
    return { passed: false, violations };
  }

  console.log('✅ Performance budget check passed');
  return { passed: true, violations: [] };
}

export default {
  initializePerformance,
  enableFetchTracking,
  checkPerformanceBudget,
  WEB_VITALS_THRESHOLDS,
};