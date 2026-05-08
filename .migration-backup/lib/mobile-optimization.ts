/**
 * Mobile-specific optimization utilities for Core Web Vitals
 * Implements mobile performance enhancements and monitoring
 */

import { onCLS, onFID, onFCP, onLCP, onTTFB, Metric } from 'web-vitals'

export interface MobileMetrics {
  lcp: number
  fid: number
  cls: number
  fcp: number
  ttfb: number
  deviceType: 'mobile' | 'tablet' | 'desktop'
  connectionType: string
  screenSize: string
  timestamp: number
}

export interface MobileOptimizationConfig {
  enablePreloading: boolean
  enableLazyLoading: boolean
  enableImageOptimization: boolean
  enableTouchOptimization: boolean
  enableOfflineSupport: boolean
}

class MobileOptimizer {
  private config: MobileOptimizationConfig
  private metrics: Partial<MobileMetrics> = {}
  private observers: Map<string, PerformanceObserver> = new Map()

  constructor(config: MobileOptimizationConfig) {
    this.config = config
    this.initializeOptimizations()
    this.setupMetricsTracking()
  }

  /**
   * Initialize mobile-specific optimizations
   */
  private initializeOptimizations(): void {
    if (typeof window === 'undefined') return

    // Enable touch optimizations
    if (this.config.enableTouchOptimization) {
      this.optimizeTouchInteractions()
    }

    // Enable preloading for mobile
    if (this.config.enablePreloading) {
      this.setupMobilePreloading()
    }

    // Enable lazy loading optimizations
    if (this.config.enableLazyLoading) {
      this.optimizeLazyLoading()
    }

    // Enable image optimizations
    if (this.config.enableImageOptimization) {
      this.optimizeImages()
    }

    // Setup viewport optimizations
    this.optimizeViewport()
  }

  /**
   * Setup Core Web Vitals tracking with mobile-specific enhancements
   */
  private setupMetricsTracking(): void {
    if (typeof window === 'undefined') return

    // Track LCP with mobile optimizations
    onLCP((metric: Metric) => {
      this.metrics.lcp = metric.value
      this.reportMobileMetric('lcp', metric)
    })

    // Track FID with touch interaction context
    onFID((metric: Metric) => {
      this.metrics.fid = metric.value
      this.reportMobileMetric('fid', metric)
    })

    // Track CLS with mobile layout considerations
    onCLS((metric: Metric) => {
      this.metrics.cls = metric.value
      this.reportMobileMetric('cls', metric)
    })

    // Track FCP for mobile rendering
    onFCP((metric: Metric) => {
      this.metrics.fcp = metric.value
      this.reportMobileMetric('fcp', metric)
    })

    // Track TTFB for mobile network conditions
    onTTFB((metric: Metric) => {
      this.metrics.ttfb = metric.value
      this.reportMobileMetric('ttfb', metric)
    })

    // Setup mobile-specific performance observers
    this.setupMobilePerformanceObservers()
  }

  /**
   * Optimize touch interactions for better mobile performance
   */
  private optimizeTouchInteractions(): void {
    // Add passive event listeners for better scroll performance
    const passiveEvents = ['touchstart', 'touchmove', 'wheel']
    
    passiveEvents.forEach(event => {
      document.addEventListener(event, () => {}, { passive: true })
    })

    // Optimize touch target sizes
    const style = document.createElement('style')
    style.textContent = `
      @media (max-width: 768px) {
        button, a, input, select, textarea {
          min-height: 44px;
          min-width: 44px;
        }
        
        .touch-target {
          padding: 12px;
          margin: 4px;
        }
      }
    `
    document.head.appendChild(style)
  }

  /**
   * Setup mobile-specific preloading strategies
   */
  private setupMobilePreloading(): void {
    // Preload critical resources based on mobile context
    const isMobile = window.innerWidth < 768
    const isSlowConnection = this.isSlowConnection()

    if (isMobile && !isSlowConnection) {
      // Preload critical mobile assets
      this.preloadCriticalAssets([
        '/icons/icon-192x192.png',
        '/fonts/inter-var.woff2'
      ])
    }

    // Setup intersection observer for predictive preloading
    if ('IntersectionObserver' in window) {
      const preloadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement
            if (link.href && !link.dataset.preloaded) {
              this.preloadPage(link.href)
              link.dataset.preloaded = 'true'
            }
          }
        })
      }, { rootMargin: '100px' })

      // Observe navigation links
      document.querySelectorAll('a[href^="/"]').forEach(link => {
        preloadObserver.observe(link)
      })
    }
  }

  /**
   * Optimize lazy loading for mobile devices
   */
  private optimizeLazyLoading(): void {
    // Adjust intersection observer margins for mobile
    const isMobile = window.innerWidth < 768
    const rootMargin = isMobile ? '50px' : '100px'

    // Enhanced lazy loading for images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
              imageObserver.unobserve(img)
            }
          }
        })
      }, { rootMargin })

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img)
      })
    }
  }

  /**
   * Optimize images for mobile devices
   */
  private optimizeImages(): void {
    // Add responsive image loading
    const images = document.querySelectorAll('img')
    
    images.forEach(img => {
      // Add loading="lazy" if not already present
      if (!img.hasAttribute('loading')) {
        img.loading = 'lazy'
      }

      // Add decoding="async" for better performance
      if (!img.hasAttribute('decoding')) {
        img.decoding = 'async'
      }

      // Optimize image sizes for mobile
      if (window.innerWidth < 768 && !img.sizes) {
        img.sizes = '(max-width: 768px) 100vw, 50vw'
      }
    })
  }

  /**
   * Optimize viewport settings for mobile
   */
  private optimizeViewport(): void {
    // Ensure proper viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
    
    if (!viewport) {
      viewport = document.createElement('meta')
      viewport.name = 'viewport'
      document.head.appendChild(viewport)
    }

    // Set optimal viewport for mobile performance
    viewport.content = 'width=device-width, initial-scale=1, viewport-fit=cover'

    // Add mobile-specific CSS optimizations
    const mobileStyles = document.createElement('style')
    mobileStyles.textContent = `
      @media (max-width: 768px) {
        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        body {
          -webkit-text-size-adjust: 100%;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        img, video {
          max-width: 100%;
          height: auto;
        }
      }
    `
    document.head.appendChild(mobileStyles)
  }

  /**
   * Setup mobile-specific performance observers
   */
  private setupMobilePerformanceObservers(): void {
    // Long task observer for mobile performance monitoring
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach(entry => {
            if (entry.duration > 50) { // Tasks longer than 50ms
              this.reportLongTask({
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name
              })
            }
          })
        })

        longTaskObserver.observe({ entryTypes: ['longtask'] })
        this.observers.set('longtask', longTaskObserver)
      } catch (e) {
        console.warn('Long task observer not supported')
      }

      // Layout shift observer for mobile CLS tracking
      try {
        const layoutShiftObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach(entry => {
            const layoutShiftEntry = entry as any;
            if (!layoutShiftEntry.hadRecentInput) {
              this.reportLayoutShift({
                value: layoutShiftEntry.value,
                sources: layoutShiftEntry.sources
              })
            }
          })
        })

        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.set('layout-shift', layoutShiftObserver)
      } catch (e) {
        console.warn('Layout shift observer not supported')
      }
    }
  }

  /**
   * Check if user is on a slow connection
   */
  private isSlowConnection(): boolean {
    const connection = (navigator as any).connection
    if (!connection) return false

    return (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.saveData === true
    )
  }

  /**
   * Preload critical assets
   */
  private preloadCriticalAssets(assets: string[]): void {
    assets.forEach(asset => {
      const link = document.createElement('link')
      link.rel = 'preload'
      
      if (asset.endsWith('.woff2') || asset.endsWith('.woff')) {
        link.as = 'font'
        link.type = 'font/woff2'
        link.crossOrigin = 'anonymous'
      } else if (asset.endsWith('.png') || asset.endsWith('.jpg') || asset.endsWith('.webp')) {
        link.as = 'image'
      }
      
      link.href = asset
      document.head.appendChild(link)
    })
  }

  /**
   * Preload a page for faster navigation
   */
  private preloadPage(href: string): void {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  }

  /**
   * Report mobile-specific metrics
   */
  private reportMobileMetric(name: string, metric: Metric): void {
    const mobileContext = {
      deviceType: this.getDeviceType(),
      connectionType: this.getConnectionType(),
      screenSize: `${window.screen.width}x${window.screen.height}`,
      timestamp: Date.now()
    }

    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'mobile_web_vital', {
        metric_name: name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        ...mobileContext
      })
    }

    // Send to performance API
    this.sendToPerformanceAPI({
      name,
      value: metric.value,
      rating: metric.rating,
      ...mobileContext
    })
  }

  /**
   * Report long tasks that affect mobile performance
   */
  private reportLongTask(task: { duration: number; startTime: number; name: string }): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'mobile_long_task', {
        task_duration: task.duration,
        task_name: task.name,
        device_type: this.getDeviceType()
      })
    }
  }

  /**
   * Report layout shifts affecting mobile UX
   */
  private reportLayoutShift(shift: { value: number; sources: any[] }): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'mobile_layout_shift', {
        shift_value: shift.value,
        sources_count: shift.sources.length,
        device_type: this.getDeviceType()
      })
    }
  }

  /**
   * Get device type for mobile optimization
   */
  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth
    
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  /**
   * Get connection type for mobile optimization
   */
  private getConnectionType(): string {
    const connection = (navigator as any).connection
    return connection?.effectiveType || 'unknown'
  }

  /**
   * Send metrics to performance API
   */
  private sendToPerformanceAPI(data: any): void {
    if (typeof fetch !== 'undefined') {
      fetch('/api/analytics/mobile-performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).catch(error => {
        console.warn('Failed to send mobile performance data:', error)
      })
    }
  }

  /**
   * Get current mobile metrics
   */
  public getMetrics(): Partial<MobileMetrics> {
    return {
      ...this.metrics,
      deviceType: this.getDeviceType(),
      connectionType: this.getConnectionType(),
      screenSize: `${window.screen.width}x${window.screen.height}`,
      timestamp: Date.now()
    }
  }

  /**
   * Cleanup observers
   */
  public cleanup(): void {
    this.observers.forEach(observer => {
      observer.disconnect()
    })
    this.observers.clear()
  }
}

// Default mobile optimization configuration
export const defaultMobileConfig: MobileOptimizationConfig = {
  enablePreloading: true,
  enableLazyLoading: true,
  enableImageOptimization: true,
  enableTouchOptimization: true,
  enableOfflineSupport: true
}

// Initialize mobile optimizer
export function initializeMobileOptimization(config: Partial<MobileOptimizationConfig> = {}): MobileOptimizer {
  const finalConfig = { ...defaultMobileConfig, ...config }
  return new MobileOptimizer(finalConfig)
}

// Export mobile optimizer instance
export const mobileOptimizer = typeof window !== 'undefined' 
  ? initializeMobileOptimization() 
  : null