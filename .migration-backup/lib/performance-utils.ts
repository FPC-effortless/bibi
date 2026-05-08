/**
 * Performance Measurement Utilities and Benchmarking Tools
 * Provides utilities for measuring and benchmarking application performance
 */

export interface BenchmarkResult {
  name: string;
  duration: number;
  iterations: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  timestamp: Date;
}

export interface PerformanceBenchmark {
  name: string;
  fn: () => Promise<void> | void;
  iterations?: number;
  warmup?: number;
}

export interface ResourceTiming {
  name: string;
  duration: number;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
  initiatorType: string;
}

export interface PagePerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  totalBlockingTime: number;
}

class PerformanceUtils {
  private static instance: PerformanceUtils;
  private benchmarks: Map<string, BenchmarkResult[]> = new Map();

  public static getInstance(): PerformanceUtils {
    if (!PerformanceUtils.instance) {
      PerformanceUtils.instance = new PerformanceUtils();
    }
    return PerformanceUtils.instance;
  }

  /**
   * Measure execution time of a function
   */
  public async measureExecutionTime<T>(
    name: string,
    fn: () => Promise<T> | T
  ): Promise<{ result: T; duration: number }> {
    const startTime = performance.now();
    
    try {
      const result = await fn();
      const endTime = performance.now();
      const duration = endTime - startTime;

      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
      
      return { result, duration };
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  /**
   * Run performance benchmark
   */
  public async runBenchmark(benchmark: PerformanceBenchmark): Promise<BenchmarkResult> {
    const { name, fn, iterations = 100, warmup = 10 } = benchmark;
    const times: number[] = [];

    console.log(`🏃 Running benchmark: ${name}`);

    // Warmup runs
    for (let i = 0; i < warmup; i++) {
      await fn();
    }

    // Actual benchmark runs
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      await fn();
      const endTime = performance.now();
      times.push(endTime - startTime);
    }

    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / iterations;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    const result: BenchmarkResult = {
      name,
      duration: totalTime,
      iterations,
      averageTime,
      minTime,
      maxTime,
      timestamp: new Date(),
    };

    // Store benchmark result
    if (!this.benchmarks.has(name)) {
      this.benchmarks.set(name, []);
    }
    this.benchmarks.get(name)!.push(result);

    console.log(`📊 Benchmark ${name} completed:`, {
      average: `${averageTime.toFixed(2)}ms`,
      min: `${minTime.toFixed(2)}ms`,
      max: `${maxTime.toFixed(2)}ms`,
      iterations,
    });

    return result;
  }

  /**
   * Get resource timing information
   */
  public getResourceTiming(): ResourceTiming[] {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return [];
    }

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    return resources.map(resource => ({
      name: resource.name,
      duration: resource.responseEnd - resource.startTime,
      transferSize: resource.transferSize || 0,
      encodedBodySize: resource.encodedBodySize || 0,
      decodedBodySize: resource.decodedBodySize || 0,
      initiatorType: resource.initiatorType,
    }));
  }

  /**
   * Get navigation timing metrics
   */
  public getNavigationTiming(): Partial<PagePerformanceMetrics> {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return {};
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    if (!navigation) return {};

    const metrics: Partial<PagePerformanceMetrics> = {
      loadTime: navigation.loadEventEnd - navigation.fetchStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
    };

    // Add paint metrics
    paint.forEach(entry => {
      if (entry.name === 'first-paint') {
        metrics.firstPaint = entry.startTime;
      } else if (entry.name === 'first-contentful-paint') {
        metrics.firstContentfulPaint = entry.startTime;
      }
    });

    return metrics;
  }

  /**
   * Monitor Core Web Vitals thresholds
   */
  public checkWebVitalsThresholds(metrics: Partial<PagePerformanceMetrics>): {
    lcp: 'good' | 'needs-improvement' | 'poor';
    fid: 'good' | 'needs-improvement' | 'poor';
    cls: 'good' | 'needs-improvement' | 'poor';
  } {
    const lcp = metrics.largestContentfulPaint || 0;
    const fid = metrics.firstInputDelay || 0;
    const cls = metrics.cumulativeLayoutShift || 0;

    return {
      lcp: lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs-improvement' : 'poor',
      fid: fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor',
      cls: cls <= 0.1 ? 'good' : cls <= 0.25 ? 'needs-improvement' : 'poor',
    };
  }

  /**
   * Create performance mark
   */
  public mark(name: string): void {
    if (typeof window !== 'undefined' && 'performance' in window && performance.mark) {
      performance.mark(name);
    }
  }

  /**
   * Measure between two marks
   */
  public measure(name: string, startMark: string, endMark?: string): number {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return 0;
    }

    try {
      if (endMark) {
        performance.measure(name, startMark, endMark);
      } else {
        performance.measure(name, startMark);
      }

      const measures = performance.getEntriesByName(name, 'measure');
      return measures.length > 0 ? measures[measures.length - 1].duration : 0;
    } catch (error) {
      console.warn(`Failed to measure ${name}:`, error);
      return 0;
    }
  }

  /**
   * Get memory usage information
   */
  public getMemoryUsage(): {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null {
    if (typeof window === 'undefined') return null;

    const memory = (performance as any).memory;
    if (!memory) return null;

    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
  }

  /**
   * Monitor long tasks
   */
  public monitorLongTasks(callback: (entries: PerformanceEntry[]) => void): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });

      observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      console.warn('Long task monitoring not supported:', error);
    }
  }

  /**
   * Get benchmark history
   */
  public getBenchmarkHistory(name?: string): Map<string, BenchmarkResult[]> | BenchmarkResult[] {
    if (name) {
      return this.benchmarks.get(name) || [];
    }
    return this.benchmarks;
  }

  /**
   * Clear benchmark history
   */
  public clearBenchmarkHistory(name?: string): void {
    if (name) {
      this.benchmarks.delete(name);
    } else {
      this.benchmarks.clear();
    }
  }

  /**
   * Generate performance report
   */
  public generatePerformanceReport(): {
    navigation: Partial<PagePerformanceMetrics>;
    resources: ResourceTiming[];
    memory: any;
    benchmarks: Map<string, BenchmarkResult[]>;
    timestamp: Date;
  } {
    return {
      navigation: this.getNavigationTiming(),
      resources: this.getResourceTiming(),
      memory: this.getMemoryUsage(),
      benchmarks: this.benchmarks,
      timestamp: new Date(),
    };
  }

  /**
   * Optimize images performance tracking
   */
  public trackImagePerformance(): void {
    if (typeof window === 'undefined') return;

    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      const startTime = performance.now();
      
      img.addEventListener('load', () => {
        const loadTime = performance.now() - startTime;
        console.log(`🖼️ Image ${index + 1} loaded in ${loadTime.toFixed(2)}ms`);
      });

      img.addEventListener('error', () => {
        const errorTime = performance.now() - startTime;
        console.warn(`❌ Image ${index + 1} failed to load after ${errorTime.toFixed(2)}ms`);
      });
    });
  }

  /**
   * Track API performance
   */
  public trackApiPerformance(url: string, method: string = 'GET'): {
    start: () => void;
    end: (success: boolean) => void;
  } {
    let startTime: number;

    return {
      start: () => {
        startTime = performance.now();
        this.mark(`api-${method}-${url}-start`);
      },
      end: (success: boolean) => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        this.mark(`api-${method}-${url}-end`);
        this.measure(`api-${method}-${url}`, `api-${method}-${url}-start`, `api-${method}-${url}-end`);
        
        console.log(`🌐 API ${method} ${url}: ${duration.toFixed(2)}ms ${success ? '✅' : '❌'}`);
      },
    };
  }
}

// Utility functions for easy access
export const performanceUtils = PerformanceUtils.getInstance();

export const measureTime = performanceUtils.measureExecutionTime.bind(performanceUtils);
export const runBenchmark = performanceUtils.runBenchmark.bind(performanceUtils);
export const mark = performanceUtils.mark.bind(performanceUtils);
export const measure = performanceUtils.measure.bind(performanceUtils);

// Common benchmarks
export const commonBenchmarks = {
  domQuery: {
    name: 'DOM Query Performance',
    fn: () => {
      document.querySelectorAll('*');
    },
  },
  
  arraySort: {
    name: 'Array Sort Performance',
    fn: () => {
      const arr = Array.from({ length: 1000 }, () => Math.random());
      arr.sort((a, b) => a - b);
    },
  },
  
  jsonParse: {
    name: 'JSON Parse Performance',
    fn: () => {
      const data = JSON.stringify({ test: 'data', numbers: [1, 2, 3, 4, 5] });
      JSON.parse(data);
    },
  },
};

export default PerformanceUtils;