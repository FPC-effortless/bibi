/**
 * Performance Monitoring System
 * Implements Core Web Vitals tracking and custom performance metrics
 */

export interface PerformanceMetrics {
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint
    ttfb: number; // Time to First Byte
  };
  customMetrics: {
    pageLoadTime: number;
    apiResponseTime: number;
    imageLoadTime: number;
    searchResponseTime: number;
    navigationTime: number;
  };
  userExperience: {
    bounceRate: number;
    sessionDuration: number;
    pagesPerSession: number;
    conversionRate: number;
  };
  deviceInfo: {
    userAgent: string;
    viewport: string;
    connection: string;
    deviceMemory?: number;
  };
}

export interface PerformanceReport {
  timestamp: Date;
  url: string;
  metrics: PerformanceMetrics;
  userId?: string;
  sessionId: string;
}

export interface WebVitalMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  attribution?: any;
}

class PerformanceMonitor {
  private sessionId: string;
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private startTime: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = performance.now();
    this.initializeMonitoring();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  private initializeMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Initialize Core Web Vitals tracking
    this.trackCoreWebVitals();
    
    // Initialize custom metrics tracking
    this.trackCustomMetrics();
    
    // Initialize user experience tracking
    this.trackUserExperience();
    
    // Track device information
    this.trackDeviceInfo();
  }

  private trackCoreWebVitals(): void {
    // Dynamic import to avoid SSR issues
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(this.handleWebVital.bind(this));
      onFID(this.handleWebVital.bind(this));
      onFCP(this.handleWebVital.bind(this));
      onLCP(this.handleWebVital.bind(this));
      onTTFB(this.handleWebVital.bind(this));
    }).catch(error => {
      console.warn('Web Vitals library not available:', error);
      // Fallback to manual tracking
      this.trackWebVitalsFallback();
    });
  }

  private handleWebVital(metric: WebVitalMetric): void {
    if (!this.metrics.coreWebVitals) {
      this.metrics.coreWebVitals = {
        lcp: 0,
        fid: 0,
        cls: 0,
        fcp: 0,
        ttfb: 0,
      };
    }

    // Update the specific metric
    switch (metric.name) {
      case 'LCP':
        this.metrics.coreWebVitals.lcp = metric.value;
        break;
      case 'FID':
        this.metrics.coreWebVitals.fid = metric.value;
        break;
      case 'CLS':
        this.metrics.coreWebVitals.cls = metric.value;
        break;
      case 'FCP':
        this.metrics.coreWebVitals.fcp = metric.value;
        break;
      case 'TTFB':
        this.metrics.coreWebVitals.ttfb = metric.value;
        break;
    }

    // Report the metric
    this.reportMetric(metric);
  }

  private trackWebVitalsFallback(): void {
    // Fallback implementation for Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Track LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.handleWebVital({
            name: 'LCP',
            value: lastEntry.startTime,
            rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs-improvement' : 'poor',
            delta: 0,
            id: 'fallback-lcp'
          });
        }
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // Track FCP
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.handleWebVital({
              name: 'FCP',
              value: entry.startTime,
              rating: entry.startTime < 1800 ? 'good' : entry.startTime < 3000 ? 'needs-improvement' : 'poor',
              delta: 0,
              id: 'fallback-fcp'
            });
          }
        });
      });
      
      try {
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(fcpObserver);
      } catch (e) {
        console.warn('FCP observer not supported');
      }
    }
  }

  private trackCustomMetrics(): void {
    this.metrics.customMetrics = {
      pageLoadTime: 0,
      apiResponseTime: 0,
      imageLoadTime: 0,
      searchResponseTime: 0,
      navigationTime: 0,
    };

    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now() - this.startTime;
      this.metrics.customMetrics!.pageLoadTime = loadTime;
    });

    // Track navigation timing
    if ('navigation' in performance) {
      const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navTiming) {
        this.metrics.customMetrics!.navigationTime = navTiming.loadEventEnd - navTiming.fetchStart;
      }
    }

    // Track resource timing for images
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const resourceEntry = entry as PerformanceResourceTiming;
          if (resourceEntry.initiatorType === 'img') {
            const imageLoadTime = resourceEntry.responseEnd - resourceEntry.startTime;
            this.metrics.customMetrics!.imageLoadTime = Math.max(
              this.metrics.customMetrics!.imageLoadTime,
              imageLoadTime
            );
          }
        });
      });
      
      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (e) {
        console.warn('Resource observer not supported');
      }
    }
  }

  private trackUserExperience(): void {
    this.metrics.userExperience = {
      bounceRate: 0,
      sessionDuration: 0,
      pagesPerSession: 1,
      conversionRate: 0,
    };

    // Track session duration
    const sessionStart = Date.now();
    window.addEventListener('beforeunload', () => {
      this.metrics.userExperience!.sessionDuration = Date.now() - sessionStart;
    });

    // Track page views in session
    let pageViews = 1;
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      pageViews++;
      originalPushState.apply(history, args);
    };

    history.replaceState = function(...args) {
      pageViews++;
      originalReplaceState.apply(history, args);
    };

    window.addEventListener('popstate', () => {
      pageViews++;
    });

    // Update pages per session periodically
    setInterval(() => {
      this.metrics.userExperience!.pagesPerSession = pageViews;
    }, 5000);
  }

  private trackDeviceInfo(): void {
    this.metrics.deviceInfo = {
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      connection: this.getConnectionInfo(),
      deviceMemory: (navigator as any).deviceMemory,
    };
  }

  private getConnectionInfo(): string {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      return `${connection.effectiveType || 'unknown'} (${connection.downlink || 'unknown'}Mbps)`;
    }
    return 'unknown';
  }

  public trackApiResponse(url: string, responseTime: number): void {
    if (this.metrics.customMetrics) {
      this.metrics.customMetrics.apiResponseTime = Math.max(
        this.metrics.customMetrics.apiResponseTime,
        responseTime
      );
    }
  }

  public trackSearchResponse(query: string, responseTime: number): void {
    if (this.metrics.customMetrics) {
      this.metrics.customMetrics.searchResponseTime = responseTime;
    }
  }

  public trackConversion(): void {
    if (this.metrics.userExperience) {
      this.metrics.userExperience.conversionRate = 1;
    }
  }

  private reportMetric(metric: WebVitalMetric): void {
    // Send to analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // Send to custom analytics endpoint
    this.sendToAnalytics({
      type: 'web_vital',
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      sessionId: this.sessionId,
      timestamp: new Date(),
      url: window.location.href,
    });
  }

  public generateReport(): PerformanceReport {
    return {
      timestamp: new Date(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      metrics: this.metrics as PerformanceMetrics,
      sessionId: this.sessionId,
    };
  }

  private async sendToAnalytics(data: any): Promise<void> {
    try {
      // Only send in production or when explicitly enabled
      if (process.env.NODE_ENV === 'production' || process.env.PERFORMANCE_MONITORING === 'true') {
        await fetch('/api/analytics/performance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } else {
        console.log('Performance metric:', data);
      }
    } catch (error) {
      console.warn('Failed to send performance metric:', error);
    }
  }

  public cleanup(): void {
    // Clean up observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Global performance monitor instance
let performanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor && typeof window !== 'undefined') {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor!;
}

export function initializePerformanceMonitoring(): void {
  if (typeof window !== 'undefined') {
    getPerformanceMonitor();
  }
}

// Export for use in _app.tsx or layout.tsx
export default PerformanceMonitor;