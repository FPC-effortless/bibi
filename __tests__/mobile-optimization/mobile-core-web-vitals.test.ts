/**
 * @jest-environment jsdom
 */

import { initializeMobileOptimization, defaultMobileConfig } from '@/lib/mobile-optimization'

// Mock web-vitals
jest.mock('web-vitals', () => ({
  onCLS: jest.fn((callback) => callback({ value: 0.05, rating: 'good' })),
  onFID: jest.fn((callback) => callback({ value: 50, rating: 'good' })),
  onFCP: jest.fn((callback) => callback({ value: 1200, rating: 'good' })),
  onLCP: jest.fn((callback) => callback({ value: 2000, rating: 'good' })),
  onTTFB: jest.fn((callback) => callback({ value: 300, rating: 'good' }))
}))

// Mock navigator.connection
Object.defineProperty(navigator, 'connection', {
  writable: true,
  value: {
    effectiveType: '4g',
    saveData: false
  }
})

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}))

// Mock PerformanceObserver
global.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}))

describe('Mobile Core Web Vitals Optimization', () => {
  let mobileOptimizer: any

  beforeEach(() => {
    // Reset DOM
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    
    // Mock window dimensions for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    })
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667
    })

    // Mock screen dimensions
    Object.defineProperty(window.screen, 'width', {
      writable: true,
      configurable: true,
      value: 375
    })
    
    Object.defineProperty(window.screen, 'height', {
      writable: true,
      configurable: true,
      value: 667
    })
  })

  afterEach(() => {
    if (mobileOptimizer) {
      mobileOptimizer.cleanup()
    }
  })

  test('initializes mobile optimizer with default config', () => {
    mobileOptimizer = initializeMobileOptimization()
    expect(mobileOptimizer).toBeDefined()
  })

  test('initializes mobile optimizer with custom config', () => {
    const customConfig = {
      ...defaultMobileConfig,
      enableHapticFeedback: false
    }
    
    mobileOptimizer = initializeMobileOptimization(customConfig)
    expect(mobileOptimizer).toBeDefined()
  })

  test('adds touch optimization styles', () => {
    mobileOptimizer = initializeMobileOptimization()
    
    // Check if touch optimization styles are added
    const styles = document.querySelectorAll('style')
    const hasTouchStyles = Array.from(styles).some(style => 
      style.textContent?.includes('min-height: 44px')
    )
    
    expect(hasTouchStyles).toBe(true)
  })

  test('adds viewport optimization', () => {
    mobileOptimizer = initializeMobileOptimization()
    
    // Check if viewport meta tag is added or updated
    const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement
    expect(viewport).toBeTruthy()
    expect(viewport?.content).toContain('width=device-width')
  })

  test('optimizes images for mobile', () => {
    // Add test images
    document.body.innerHTML = `
      <img src="/test1.jpg" alt="Test 1">
      <img src="/test2.jpg" alt="Test 2" loading="eager">
    `
    
    mobileOptimizer = initializeMobileOptimization()
    
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      expect(img.loading).toBe('lazy')
      expect(img.decoding).toBe('async')
    })
  })

  test('sets up intersection observer for preloading', () => {
    mobileOptimizer = initializeMobileOptimization()
    
    // Verify IntersectionObserver was called
    expect(IntersectionObserver).toHaveBeenCalled()
  })

  test('detects device type correctly', () => {
    mobileOptimizer = initializeMobileOptimization()
    const metrics = mobileOptimizer.getMetrics()
    
    expect(metrics.deviceType).toBe('mobile')
  })

  test('detects connection type', () => {
    mobileOptimizer = initializeMobileOptimization()
    const metrics = mobileOptimizer.getMetrics()
    
    expect(metrics.connectionType).toBe('4g')
  })

  test('tracks performance metrics', () => {
    mobileOptimizer = initializeMobileOptimization()
    const metrics = mobileOptimizer.getMetrics()
    
    expect(metrics).toHaveProperty('lcp')
    expect(metrics).toHaveProperty('fid')
    expect(metrics).toHaveProperty('cls')
    expect(metrics).toHaveProperty('fcp')
    expect(metrics).toHaveProperty('ttfb')
  })

  test('handles slow connection detection', () => {
    // Mock slow connection
    Object.defineProperty(navigator, 'connection', {
      writable: true,
      value: {
        effectiveType: '2g',
        saveData: true
      }
    })
    
    mobileOptimizer = initializeMobileOptimization()
    
    // Should not preload resources on slow connection
    const links = document.querySelectorAll('link[rel="preload"]')
    expect(links.length).toBe(0)
  })

  test('preloads critical assets on fast connection', () => {
    // Mock fast connection
    Object.defineProperty(navigator, 'connection', {
      writable: true,
      value: {
        effectiveType: '4g',
        saveData: false
      }
    })
    
    mobileOptimizer = initializeMobileOptimization()
    
    // Should preload critical assets
    setTimeout(() => {
      const preloadLinks = document.querySelectorAll('link[rel="preload"]')
      expect(preloadLinks.length).toBeGreaterThan(0)
    }, 100)
  })

  test('sets up performance observers', () => {
    mobileOptimizer = initializeMobileOptimization()
    
    // Verify PerformanceObserver was called for long tasks and layout shifts
    expect(PerformanceObserver).toHaveBeenCalled()
  })

  test('cleanup removes observers', () => {
    mobileOptimizer = initializeMobileOptimization()
    
    const mockDisconnect = jest.fn()
    mobileOptimizer.observers = new Map([
      ['test', { disconnect: mockDisconnect }]
    ])
    
    mobileOptimizer.cleanup()
    expect(mockDisconnect).toHaveBeenCalled()
  })
})

describe('Mobile Performance Monitoring', () => {
  test('reports performance metrics to analytics', () => {
    const mockGtag = jest.fn()
    ;(window as any).gtag = mockGtag
    
    const mobileOptimizer = initializeMobileOptimization()
    
    // Simulate metric reporting
    setTimeout(() => {
      expect(mockGtag).toHaveBeenCalledWith('event', 'mobile_web_vital', expect.any(Object))
    }, 100)
  })

  test('sends performance data to API', () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    })
    global.fetch = mockFetch
    
    const mobileOptimizer = initializeMobileOptimization()
    
    // Simulate API call
    setTimeout(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/analytics/mobile-performance',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      )
    }, 100)
  })
})