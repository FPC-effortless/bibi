/**
 * Advanced Analytics System for Bibiere
 * Tracks user behavior, conversion funnels, and business metrics
 */

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  sessionId?: string
  timestamp?: number
}

interface ConversionFunnelStep {
  step: string
  timestamp: number
  properties?: Record<string, any>
}

interface UserSession {
  sessionId: string
  userId?: string
  startTime: number
  lastActivity: number
  pageViews: number
  events: AnalyticsEvent[]
  conversionFunnel: ConversionFunnelStep[]
  source?: string
  medium?: string
  campaign?: string
}

class AdvancedAnalytics {
  private session: UserSession
  private isInitialized = false
  private queue: AnalyticsEvent[] = []

  constructor() {
    this.session = this.initializeSession()
    this.setupEventListeners()
  }

  private initializeSession(): UserSession {
    const sessionId = this.generateSessionId()
    const existingSession = this.getStoredSession()
    
    if (existingSession && this.isSessionValid(existingSession)) {
      existingSession.lastActivity = Date.now()
      return existingSession
    }

    const newSession: UserSession = {
      sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      events: [],
      conversionFunnel: [],
      source: this.getTrafficSource(),
      medium: this.getTrafficMedium(),
      campaign: this.getCampaign()
    }

    this.storeSession(newSession)
    return newSession
  }

  private setupEventListeners() {
    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden')
      } else {
        this.track('page_visible')
      }
    })

    // Scroll tracking
    let scrollDepth = 0
    const trackScroll = () => {
      const depth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
      if (depth > scrollDepth && depth % 25 === 0) {
        scrollDepth = depth
        this.track('scroll_depth', { depth })
      }
    }
    window.addEventListener('scroll', trackScroll, { passive: true })

    // Time on page tracking
    let timeOnPage = 0
    setInterval(() => {
      if (!document.hidden) {
        timeOnPage += 10
        if (timeOnPage % 30 === 0) { // Every 30 seconds
          this.track('time_on_page', { seconds: timeOnPage })
        }
      }
    }, 10000)

    // Unload tracking
    window.addEventListener('beforeunload', () => {
      this.track('page_unload', { timeOnPage })
      this.flush()
    })
  }

  initialize(config: { userId?: string; apiKey?: string }) {
    if (config.userId) {
      this.session.userId = config.userId
      this.storeSession(this.session)
    }
    
    this.isInitialized = true
    this.processQueue()
  }

  // Core tracking methods
  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      userId: this.session.userId,
      sessionId: this.session.sessionId,
      timestamp: Date.now()
    }

    this.session.events.push(analyticsEvent)
    this.session.lastActivity = Date.now()
    this.storeSession(this.session)

    if (this.isInitialized) {
      this.sendEvent(analyticsEvent)
    } else {
      this.queue.push(analyticsEvent)
    }
  }

  page(path: string, properties?: Record<string, any>) {
    this.session.pageViews++
    this.track('page_view', {
      path,
      referrer: document.referrer,
      title: document.title,
      ...properties
    })
  }

  identify(userId: string, traits?: Record<string, any>) {
    this.session.userId = userId
    this.storeSession(this.session)
    
    this.track('user_identified', {
      userId,
      traits
    })
  }

  // E-commerce specific tracking
  trackProductView(productId: string, productName: string, category: string, price: number) {
    this.track('product_viewed', {
      productId,
      productName,
      category,
      price,
      currency: 'USD'
    })
    
    this.addToConversionFunnel('product_view', { productId, productName })
  }

  trackAddToCart(productId: string, productName: string, price: number, quantity: number = 1) {
    this.track('add_to_cart', {
      productId,
      productName,
      price,
      quantity,
      value: price * quantity,
      currency: 'USD'
    })
    
    this.addToConversionFunnel('add_to_cart', { productId, value: price * quantity })
  }

  trackAddToWishlist(productId: string, productName: string) {
    this.track('add_to_wishlist', {
      productId,
      productName
    })
  }

  trackRemoveFromCart(productId: string, productName: string, price: number, quantity: number = 1) {
    this.track('remove_from_cart', {
      productId,
      productName,
      price,
      quantity,
      value: price * quantity,
      currency: 'USD'
    })
  }

  trackBeginCheckout(cartValue: number, itemCount: number) {
    this.track('begin_checkout', {
      value: cartValue,
      itemCount,
      currency: 'USD'
    })
    
    this.addToConversionFunnel('begin_checkout', { value: cartValue, itemCount })
  }

  trackPurchase(orderId: string, revenue: number, items: any[]) {
    this.track('purchase', {
      orderId,
      revenue,
      items,
      currency: 'USD'
    })
    
    this.addToConversionFunnel('purchase', { orderId, revenue })
  }

  trackSearch(query: string, resultsCount: number) {
    this.track('search', {
      query,
      resultsCount
    })
  }

  trackFilter(filterType: string, filterValue: string, resultsCount: number) {
    this.track('filter_applied', {
      filterType,
      filterValue,
      resultsCount
    })
  }

  // Conversion funnel tracking
  private addToConversionFunnel(step: string, properties?: Record<string, any>) {
    this.session.conversionFunnel.push({
      step,
      timestamp: Date.now(),
      properties
    })
    
    this.storeSession(this.session)
  }

  getConversionFunnel(): ConversionFunnelStep[] {
    return this.session.conversionFunnel
  }

  // User behavior analysis
  trackUserEngagement() {
    const engagement = {
      sessionDuration: Date.now() - this.session.startTime,
      pageViews: this.session.pageViews,
      eventsCount: this.session.events.length,
      conversionSteps: this.session.conversionFunnel.length
    }

    this.track('user_engagement', engagement)
    return engagement
  }

  // Heat mapping and click tracking
  trackClick(element: string, position?: { x: number; y: number }) {
    this.track('click', {
      element,
      position,
      path: window.location.pathname
    })
  }

  trackFormInteraction(formName: string, fieldName: string, action: 'focus' | 'blur' | 'change') {
    this.track('form_interaction', {
      formName,
      fieldName,
      action
    })
  }

  // A/B Testing support
  trackExperiment(experimentName: string, variant: string) {
    this.track('experiment_viewed', {
      experimentName,
      variant
    })
  }

  // Error tracking
  trackError(error: Error, context?: Record<string, any>) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      context,
      url: window.location.href
    })
  }

  // Performance tracking
  trackPerformance() {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType('paint')
      
      const metrics = {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
        networkLatency: navigation.responseStart - navigation.requestStart
      }

      this.track('performance_metrics', metrics)
    }
  }

  // Data management
  private processQueue() {
    while (this.queue.length > 0) {
      const event = this.queue.shift()
      if (event) {
        this.sendEvent(event)
      }
    }
  }

  private async sendEvent(event: AnalyticsEvent) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.warn('Failed to send analytics event:', error)
      // Store failed events for retry
      this.storeFailedEvent(event)
    }
  }

  private flush() {
    // Send any remaining events
    this.processQueue()
    
    // Send session summary
    const summary = this.trackUserEngagement()
    this.sendEvent({
      event: 'session_end',
      properties: summary,
      sessionId: this.session.sessionId,
      timestamp: Date.now()
    })
  }

  // Utility methods
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private getStoredSession(): UserSession | null {
    try {
      const stored = localStorage.getItem('bibiere_session')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  private storeSession(session: UserSession) {
    try {
      localStorage.setItem('bibiere_session', JSON.stringify(session))
    } catch (error) {
      console.warn('Failed to store session:', error)
    }
  }

  private storeFailedEvent(event: AnalyticsEvent) {
    try {
      const failed = JSON.parse(localStorage.getItem('bibiere_failed_events') || '[]')
      failed.push(event)
      localStorage.setItem('bibiere_failed_events', JSON.stringify(failed.slice(-50))) // Keep last 50
    } catch (error) {
      console.warn('Failed to store failed event:', error)
    }
  }

  private isSessionValid(session: UserSession): boolean {
    const maxAge = 30 * 60 * 1000 // 30 minutes
    return Date.now() - session.lastActivity < maxAge
  }

  private getTrafficSource(): string {
    const referrer = document.referrer
    if (!referrer) return 'direct'
    
    const hostname = new URL(referrer).hostname
    if (hostname.includes('google')) return 'google'
    if (hostname.includes('facebook')) return 'facebook'
    if (hostname.includes('instagram')) return 'instagram'
    if (hostname.includes('pinterest')) return 'pinterest'
    
    return 'referral'
  }

  private getTrafficMedium(): string {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('utm_medium') || 'organic'
  }

  private getCampaign(): string | undefined {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('utm_campaign') || undefined
  }
}

// Create singleton instance
export const analytics = new AdvancedAnalytics()

// React hook for analytics
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    page: analytics.page.bind(analytics),
    identify: analytics.identify.bind(analytics),
    trackProductView: analytics.trackProductView.bind(analytics),
    trackAddToCart: analytics.trackAddToCart.bind(analytics),
    trackAddToWishlist: analytics.trackAddToWishlist.bind(analytics),
    trackBeginCheckout: analytics.trackBeginCheckout.bind(analytics),
    trackPurchase: analytics.trackPurchase.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackClick: analytics.trackClick.bind(analytics),
    trackError: analytics.trackError.bind(analytics)
  }
}
