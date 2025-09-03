import { NextRequest, NextResponse } from 'next/server'

// Session configuration interface
export interface SessionConfig {
  secret: string
  maxAge: number // in seconds
  secure: boolean
  httpOnly: boolean
  sameSite: 'strict' | 'lax' | 'none'
  domain?: string
  path: string
}

// Default session configuration
export const defaultSessionConfig: SessionConfig = {
  secret: process.env.SESSION_SECRET || 'change-this-in-production-very-long-secret-key',
  maxAge: 24 * 60 * 60, // 24 hours
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  httpOnly: true, // Prevent XSS access to cookies
  sameSite: 'strict', // CSRF protection
  path: '/'
}

// Session data interface
export interface SessionData {
  userId?: string
  email?: string
  role?: string
  permissions?: string[]
  loginTime?: number
  lastActivity?: number
  csrfToken?: string
  [key: string]: any
}

// Session manager class
export class SessionManager {
  private config: SessionConfig

  constructor(config: SessionConfig = defaultSessionConfig) {
    this.config = config
    
    // Validate configuration
    if (!config.secret || config.secret.length < 32) {
      throw new Error('Session secret must be at least 32 characters long')
    }
  }

  // Generate secure session ID
  generateSessionId(): string {
    // Use Web Crypto API for edge runtime compatibility
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(32)
      crypto.getRandomValues(array)
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    }
    
    // Fallback for environments without crypto
    return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  }

  // Create session token with HMAC signature
  async createSessionToken(sessionId: string, data: SessionData): Promise<string> {
    const timestamp = Math.floor(Date.now() / 1000)
    const expiresAt = timestamp + this.config.maxAge
    
    const payload = {
      sessionId,
      data,
      timestamp,
      expiresAt
    }
    
    const payloadString = JSON.stringify(payload)
    const payloadBase64 = btoa(payloadString)
    
    // Create HMAC signature using Web Crypto API
    let signature: string
    
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      try {
        const encoder = new TextEncoder()
        const keyData = encoder.encode(this.config.secret)
        const key = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        )
        
        const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadBase64))
        signature = Array.from(new Uint8Array(signatureBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
      } catch (error) {
        // Fallback to simple hash
        signature = this.simpleHash(payloadBase64 + this.config.secret)
      }
    } else {
      // Fallback to simple hash
      signature = this.simpleHash(payloadBase64 + this.config.secret)
    }
    
    return `${payloadBase64}.${signature}`
  }

  private simpleHash(input: string): string {
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16)
  }

  // Verify and decode session token
  async verifySessionToken(token: string): Promise<{ sessionId: string; data: SessionData } | null> {
    try {
      const [payloadBase64, signature] = token.split('.')
      
      if (!payloadBase64 || !signature) {
        return null
      }
      
      // Verify signature using Web Crypto API
      let expectedSignature: string
      
      if (typeof crypto !== 'undefined' && crypto.subtle) {
        try {
          const encoder = new TextEncoder()
          const keyData = encoder.encode(this.config.secret)
          const key = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
          )
          
          const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadBase64))
          expectedSignature = Array.from(new Uint8Array(signatureBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')
        } catch (error) {
          // Fallback to simple hash
          expectedSignature = this.simpleHash(payloadBase64 + this.config.secret)
        }
      } else {
        // Fallback to simple hash
        expectedSignature = this.simpleHash(payloadBase64 + this.config.secret)
      }
      
      if (signature !== expectedSignature) {
        return null
      }
      
      // Decode payload
      const payloadString = atob(payloadBase64)
      const payload = JSON.parse(payloadString)
      
      // Check expiration
      const now = Math.floor(Date.now() / 1000)
      if (payload.expiresAt < now) {
        return null
      }
      
      // Update last activity
      payload.data.lastActivity = now
      
      return {
        sessionId: payload.sessionId,
        data: payload.data
      }
    } catch (error) {
      return null
    }
  }

  // Create session cookie
  createSessionCookie(sessionToken: string): string {
    const cookieOptions = [
      `Max-Age=${this.config.maxAge}`,
      `Path=${this.config.path}`,
      `SameSite=${this.config.sameSite}`
    ]
    
    if (this.config.secure) {
      cookieOptions.push('Secure')
    }
    
    if (this.config.httpOnly) {
      cookieOptions.push('HttpOnly')
    }
    
    if (this.config.domain) {
      cookieOptions.push(`Domain=${this.config.domain}`)
    }
    
    return `session=${sessionToken}; ${cookieOptions.join('; ')}`
  }

  // Extract session from request
  async getSessionFromRequest(request: NextRequest): Promise<{ sessionId: string; data: SessionData } | null> {
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader) {
      return null
    }
    
    // Parse cookies
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      if (key && value) {
        acc[key] = decodeURIComponent(value)
      }
      return acc
    }, {} as Record<string, string>)
    
    const sessionToken = cookies.session
    if (!sessionToken) {
      return null
    }
    
    return this.verifySessionToken(sessionToken)
  }

  // Create new session
  async createSession(data: SessionData): Promise<{ sessionId: string; sessionToken: string; cookie: string }> {
    const sessionId = this.generateSessionId()
    
    // Generate CSRF token
    let csrfToken: string
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(32)
      crypto.getRandomValues(array)
      csrfToken = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    } else {
      csrfToken = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    }
    
    // Add session metadata
    const sessionData: SessionData = {
      ...data,
      loginTime: Math.floor(Date.now() / 1000),
      lastActivity: Math.floor(Date.now() / 1000),
      csrfToken
    }
    
    const sessionToken = await this.createSessionToken(sessionId, sessionData)
    const cookie = this.createSessionCookie(sessionToken)
    
    return { sessionId, sessionToken, cookie }
  }

  // Update session data
  async updateSession(sessionId: string, currentData: SessionData, updates: Partial<SessionData>): Promise<string> {
    const updatedData = {
      ...currentData,
      ...updates,
      lastActivity: Math.floor(Date.now() / 1000)
    }
    
    return this.createSessionToken(sessionId, updatedData)
  }

  // Destroy session (create expired cookie)
  destroySession(): string {
    return `session=; Max-Age=0; Path=${this.config.path}; HttpOnly; SameSite=${this.config.sameSite}`
  }
}

// HTTPS enforcement middleware
export function enforceHTTPS(request: NextRequest): NextResponse | null {
  // Skip in development
  if (process.env.NODE_ENV !== 'production') {
    return null
  }
  
  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  const host = request.headers.get('host')
  
  if (protocol !== 'https') {
    const httpsUrl = `https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`
    return NextResponse.redirect(httpsUrl, 301)
  }
  
  return null
}

// SSL/TLS security headers
export function addSSLSecurityHeaders(response: NextResponse): void {
  // Strict Transport Security (HSTS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  // Expect-CT header for certificate transparency
  response.headers.set('Expect-CT', 'max-age=86400, enforce')
  
  // Public Key Pinning (use with caution in production)
  // response.headers.set('Public-Key-Pins', 'pin-sha256="base64+primary+key"; pin-sha256="base64+backup+key"; max-age=5184000; includeSubDomains')
}

// Session-based authentication middleware
export function withSessionAuth(
  handler: (request: NextRequest, session: { sessionId: string; data: SessionData }) => Promise<NextResponse>,
  options: {
    required?: boolean
    roles?: string[]
    permissions?: string[]
  } = {}
) {
  return async (request: NextRequest) => {
    const sessionManager = new SessionManager()
    const session = await sessionManager.getSessionFromRequest(request)
    
    // Check if session is required
    if (options.required && !session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Check role requirements
    if (session && options.roles && options.roles.length > 0) {
      if (!session.data.role || !options.roles.includes(session.data.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }
    }
    
    // Check permission requirements
    if (session && options.permissions && options.permissions.length > 0) {
      const userPermissions = session.data.permissions || []
      const hasPermission = options.permissions.some(permission => 
        userPermissions.includes(permission)
      )
      
      if (!hasPermission) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }
    }
    
    // Call handler with session data
    return handler(request, session || { sessionId: '', data: {} })
  }
}

// Default session manager instance
export const sessionManager = new SessionManager()