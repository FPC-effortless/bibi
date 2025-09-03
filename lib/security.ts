import { NextRequest, NextResponse } from 'next/server'

// Security configuration interface
export interface SecurityConfig {
  csp: {
    directives: Record<string, string[]>
    reportUri?: string
    nonce?: boolean
  }
  headers: {
    hsts: boolean
    xFrameOptions: string
    xContentTypeOptions: boolean
    referrerPolicy: string
    permissionsPolicy: string[]
  }
  rateLimit: {
    windowMs: number
    maxRequests: number
    skipSuccessfulRequests: boolean
  }
  validation: {
    sanitizeInput: boolean
    validateTypes: boolean
    maxPayloadSize: number
  }
}

// Default security configuration
export const defaultSecurityConfig: SecurityConfig = {
  csp: {
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://www.googletagmanager.com', 'https://www.google-analytics.com'],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'img-src': ["'self'", 'data:', 'https:', 'blob:'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'connect-src': ["'self'", 'https://www.google-analytics.com', 'https://analytics.google.com'],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'worker-src': ["'self'"],
      'manifest-src': ["'self'"]
    },
    nonce: true
  },
  headers: {
    hsts: true,
    xFrameOptions: 'DENY',
    xContentTypeOptions: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()',
      'payment=(self)',
      'usb=()',
      'serial=()',
      'bluetooth=()'
    ]
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    skipSuccessfulRequests: false
  },
  validation: {
    sanitizeInput: true,
    validateTypes: true,
    maxPayloadSize: 1024 * 1024 // 1MB
  }
}

// CSP nonce generation and management
export class CSPNonceManager {
  private static nonceStore = new Map<string, { nonce: string; timestamp: number }>()
  private static readonly NONCE_EXPIRY = 5 * 60 * 1000 // 5 minutes

  static generateNonce(): string {
    // Use Web Crypto API for edge runtime compatibility
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(16)
      crypto.getRandomValues(array)
      return btoa(String.fromCharCode(...Array.from(array)))
    }
    
    // Fallback for environments without crypto
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  static createNonceForRequest(requestId: string): string {
    const nonce = this.generateNonce()
    this.nonceStore.set(requestId, {
      nonce,
      timestamp: Date.now()
    })
    
    // Clean up expired nonces
    this.cleanupExpiredNonces()
    
    return nonce
  }

  static getNonceForRequest(requestId: string): string | null {
    const entry = this.nonceStore.get(requestId)
    if (!entry) return null
    
    // Check if nonce is expired
    if (Date.now() - entry.timestamp > this.NONCE_EXPIRY) {
      this.nonceStore.delete(requestId)
      return null
    }
    
    return entry.nonce
  }

  private static cleanupExpiredNonces(): void {
    const now = Date.now()
    for (const [key, entry] of Array.from(this.nonceStore.entries())) {
      if (now - entry.timestamp > this.NONCE_EXPIRY) {
        this.nonceStore.delete(key)
      }
    }
  }
}

// CSRF protection
export class CSRFProtection {
  private static readonly SECRET_KEY = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production'
  private static readonly TOKEN_EXPIRY = 60 * 60 * 1000 // 1 hour

  static async generateToken(sessionId: string): Promise<string> {
    const timestamp = Date.now().toString()
    const data = `${sessionId}:${timestamp}`
    
    // Use Web Crypto API for edge runtime compatibility
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      try {
        const encoder = new TextEncoder()
        const keyData = encoder.encode(this.SECRET_KEY)
        const key = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        )
        
        const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
        const signatureHex = Array.from(new Uint8Array(signature))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
        
        return btoa(`${data}:${signatureHex}`)
      } catch (error) {
        console.warn('Web Crypto API failed, using fallback:', error)
      }
    }
    
    // Fallback: simple hash without crypto
    const simpleHash = this.simpleHash(data + this.SECRET_KEY)
    return btoa(`${data}:${simpleHash}`)
  }

  static async validateToken(token: string, sessionId: string): Promise<boolean> {
    try {
      const decoded = atob(token)
      const [receivedSessionId, timestamp, signature] = decoded.split(':')
      
      // Check if token is for the correct session
      if (receivedSessionId !== sessionId) {
        return false
      }
      
      // Check if token is expired
      const tokenTime = parseInt(timestamp)
      if (Date.now() - tokenTime > this.TOKEN_EXPIRY) {
        return false
      }
      
      // Verify signature
      const data = `${receivedSessionId}:${timestamp}`
      
      if (typeof crypto !== 'undefined' && crypto.subtle) {
        try {
          const encoder = new TextEncoder()
          const keyData = encoder.encode(this.SECRET_KEY)
          const key = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
          )
          
          const expectedSignature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
          const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
          
          return signature === expectedSignatureHex
        } catch (error) {
          console.warn('Web Crypto API validation failed, using fallback:', error)
        }
      }
      
      // Fallback validation
      const expectedHash = this.simpleHash(data + this.SECRET_KEY)
      return signature === expectedHash
    } catch (error) {
      return false
    }
  }

  private static simpleHash(input: string): string {
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16)
  }

  static getTokenFromRequest(request: NextRequest): string | null {
    // Check header first
    const headerToken = request.headers.get('x-csrf-token')
    if (headerToken) return headerToken

    // Check form data for POST requests
    if (request.method === 'POST') {
      const contentType = request.headers.get('content-type')
      if (contentType?.includes('application/x-www-form-urlencoded')) {
        // This would need to be handled in the API route since we can't read body in middleware
        return null
      }
    }

    return null
  }
}

// Rate limiting
export class RateLimiter {
  private static requestCounts = new Map<string, { count: number; resetTime: number }>()

  static checkRateLimit(
    identifier: string, 
    maxRequests: number = 100, 
    windowMs: number = 15 * 60 * 1000
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const windowStart = now - windowMs
    
    // Get or create entry for this identifier
    let entry = this.requestCounts.get(identifier)
    
    // Reset if window has passed
    if (!entry || entry.resetTime <= now) {
      entry = {
        count: 0,
        resetTime: now + windowMs
      }
    }
    
    // Increment count
    entry.count++
    this.requestCounts.set(identifier, entry)
    
    // Clean up old entries
    this.cleanupOldEntries()
    
    return {
      allowed: entry.count <= maxRequests,
      remaining: Math.max(0, maxRequests - entry.count),
      resetTime: entry.resetTime
    }
  }

  private static cleanupOldEntries(): void {
    const now = Date.now()
    for (const [key, entry] of Array.from(this.requestCounts.entries())) {
      if (entry.resetTime <= now) {
        this.requestCounts.delete(key)
      }
    }
  }

  static getClientIdentifier(request: NextRequest): string {
    // Use IP address as primary identifier
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIp || 'unknown'
    
    // Add user agent for additional uniqueness using simple hash
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const userAgentHash = this.simpleHash(userAgent).substring(0, 8)
    
    return `${ip}:${userAgentHash}`
  }

  private static simpleHash(input: string): string {
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16)
  }
}

// Security headers manager
export class SecurityHeadersManager {
  static generateCSP(config: SecurityConfig['csp'], nonce?: string): string {
    const directives = { ...config.directives }
    
    // Add nonce to script-src and style-src if enabled
    if (config.nonce && nonce) {
      if (directives['script-src']) {
        directives['script-src'] = [...directives['script-src'], `'nonce-${nonce}'`]
      }
      if (directives['style-src']) {
        directives['style-src'] = [...directives['style-src'], `'nonce-${nonce}'`]
      }
    }
    
    // Convert directives to CSP string
    const cspParts = Object.entries(directives).map(([directive, sources]) => {
      return `${directive} ${sources.join(' ')}`
    })
    
    let csp = cspParts.join('; ')
    
    // Add report-uri if configured
    if (config.reportUri) {
      csp += `; report-uri ${config.reportUri}`
    }
    
    return csp
  }

  static applySecurityHeaders(
    response: NextResponse, 
    config: SecurityConfig = defaultSecurityConfig,
    nonce?: string
  ): void {
    // Content Security Policy
    const csp = this.generateCSP(config.csp, nonce)
    response.headers.set('Content-Security-Policy', csp)
    
    // HSTS (only in production with HTTPS)
    if (config.headers.hsts && process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    }
    
    // X-Frame-Options
    response.headers.set('X-Frame-Options', config.headers.xFrameOptions)
    
    // X-Content-Type-Options
    if (config.headers.xContentTypeOptions) {
      response.headers.set('X-Content-Type-Options', 'nosniff')
    }
    
    // Referrer Policy
    response.headers.set('Referrer-Policy', config.headers.referrerPolicy)
    
    // Permissions Policy
    if (config.headers.permissionsPolicy.length > 0) {
      response.headers.set('Permissions-Policy', config.headers.permissionsPolicy.join(', '))
    }
    
    // Additional security headers
    response.headers.set('X-DNS-Prefetch-Control', 'on')
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
    response.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
    
    // Add nonce to response headers for client-side access
    if (nonce) {
      response.headers.set('X-CSP-Nonce', nonce)
    }
  }
}

// Security event logging
export interface SecurityEvent {
  type: 'rate_limit_exceeded' | 'csrf_validation_failed' | 'invalid_input' | 'suspicious_activity'
  severity: 'low' | 'medium' | 'high' | 'critical'
  clientId: string
  userAgent?: string
  ip?: string
  path: string
  details?: Record<string, any>
  timestamp: Date
}

export class SecurityLogger {
  private static events: SecurityEvent[] = []
  private static readonly MAX_EVENTS = 1000

  static logEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    }
    
    this.events.push(fullEvent)
    
    // Keep only recent events
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS)
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Security Event] ${event.type}:`, fullEvent)
    }
    
    // In production, you would send this to your monitoring service
    if (process.env.NODE_ENV === 'production' && event.severity === 'critical') {
      // TODO: Send alert to monitoring service
      console.error('[CRITICAL Security Event]', fullEvent)
    }
  }

  static getRecentEvents(limit: number = 100): SecurityEvent[] {
    return this.events.slice(-limit)
  }

  static getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(event => event.type === type)
  }
}

// Main security manager
export class SecurityManager {
  private config: SecurityConfig

  constructor(config: SecurityConfig = defaultSecurityConfig) {
    this.config = config
  }

  // Apply all security measures to a request
  processRequest(request: NextRequest): {
    response?: NextResponse
    nonce?: string
    rateLimitExceeded?: boolean
  } {
    const clientId = RateLimiter.getClientIdentifier(request)
    
    // Check rate limiting
    const rateLimit = RateLimiter.checkRateLimit(
      clientId,
      this.config.rateLimit.maxRequests,
      this.config.rateLimit.windowMs
    )
    
    if (!rateLimit.allowed) {
      SecurityLogger.logEvent({
        type: 'rate_limit_exceeded',
        severity: 'medium',
        clientId,
        userAgent: request.headers.get('user-agent') || undefined,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        path: request.nextUrl.pathname,
        details: { remaining: rateLimit.remaining, resetTime: rateLimit.resetTime }
      })
      
      const response = new NextResponse('Too Many Requests', { status: 429 })
      response.headers.set('Retry-After', Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString())
      response.headers.set('X-RateLimit-Limit', this.config.rateLimit.maxRequests.toString())
      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString())
      response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString())
      
      return { response, rateLimitExceeded: true }
    }
    
    // Generate nonce for CSP
    const nonce = this.config.csp.nonce ? CSPNonceManager.createNonceForRequest(clientId) : undefined
    
    return { nonce }
  }

  // Apply security headers to response
  secureResponse(response: NextResponse, nonce?: string): NextResponse {
    SecurityHeadersManager.applySecurityHeaders(response, this.config, nonce)
    return response
  }

  // Validate CSRF token
  async validateCSRF(request: NextRequest, sessionId: string): Promise<boolean> {
    // Skip CSRF validation for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return true
    }
    
    const token = CSRFProtection.getTokenFromRequest(request)
    if (!token) {
      SecurityLogger.logEvent({
        type: 'csrf_validation_failed',
        severity: 'high',
        clientId: RateLimiter.getClientIdentifier(request),
        path: request.nextUrl.pathname,
        details: { reason: 'missing_token' }
      })
      return false
    }
    
    const isValid = await CSRFProtection.validateToken(token, sessionId)
    if (!isValid) {
      SecurityLogger.logEvent({
        type: 'csrf_validation_failed',
        severity: 'high',
        clientId: RateLimiter.getClientIdentifier(request),
        path: request.nextUrl.pathname,
        details: { reason: 'invalid_token' }
      })
    }
    
    return isValid
  }
}

// Export default instance
export const securityManager = new SecurityManager()