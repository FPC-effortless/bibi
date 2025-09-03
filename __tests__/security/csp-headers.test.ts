/**
 * @jest-environment node
 */
import { SecurityHeadersManager, CSPNonceManager, defaultSecurityConfig } from '@/lib/security'

// Mock NextResponse for testing
class MockNextResponse {
  constructor() {
    this.headers = new Map()
  }
  
  set(key, value) {
    this.headers.set(key, value)
  }
  
  get(key) {
    return this.headers.get(key) || null
  }
}

describe('CSP Headers and Security', () => {
  describe('CSPNonceManager', () => {
    it('should generate unique nonces', () => {
      const nonce1 = CSPNonceManager.generateNonce()
      const nonce2 = CSPNonceManager.generateNonce()
      
      expect(nonce1).toBeDefined()
      expect(nonce2).toBeDefined()
      expect(nonce1).not.toBe(nonce2)
      expect(nonce1.length).toBeGreaterThan(0)
    })

    it('should create and retrieve nonces for requests', () => {
      const requestId = 'test-request-123'
      const nonce = CSPNonceManager.createNonceForRequest(requestId)
      
      expect(nonce).toBeDefined()
      
      const retrievedNonce = CSPNonceManager.getNonceForRequest(requestId)
      expect(retrievedNonce).toBe(nonce)
    })

    it('should return null for non-existent request IDs', () => {
      const nonce = CSPNonceManager.getNonceForRequest('non-existent')
      expect(nonce).toBeNull()
    })
  })

  describe('SecurityHeadersManager', () => {
    it('should generate CSP without nonce', () => {
      const csp = SecurityHeadersManager.generateCSP(defaultSecurityConfig.csp)
      
      expect(csp).toContain("default-src 'self'")
      expect(csp).toContain("script-src 'self'")
      expect(csp).toContain("style-src 'self'")
      expect(csp).toContain("frame-ancestors 'none'")
    })

    it('should generate CSP with nonce', () => {
      const nonce = 'test-nonce-123'
      const csp = SecurityHeadersManager.generateCSP(defaultSecurityConfig.csp, nonce)
      
      expect(csp).toContain(`'nonce-${nonce}'`)
      expect(csp).toContain("script-src 'self'")
      expect(csp).toContain("style-src 'self'")
    })

    it('should apply security headers to response', () => {
      const response = new MockNextResponse() as any
      const nonce = 'test-nonce-456'
      
      SecurityHeadersManager.applySecurityHeaders(response, defaultSecurityConfig, nonce)
      
      expect(response.headers.get('Content-Security-Policy')).toContain(`'nonce-${nonce}'`)
      expect(response.headers.get('X-Frame-Options')).toBe('DENY')
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
      expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
      expect(response.headers.get('X-CSP-Nonce')).toBe(nonce)
    })

    it('should not include HSTS in development', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      const response = new MockNextResponse() as any
      SecurityHeadersManager.applySecurityHeaders(response, defaultSecurityConfig)
      
      expect(response.headers.get('Strict-Transport-Security')).toBeNull()
      
      process.env.NODE_ENV = originalEnv
    })

    it('should include HSTS in production', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      
      const response = new MockNextResponse() as any
      SecurityHeadersManager.applySecurityHeaders(response, defaultSecurityConfig)
      
      expect(response.headers.get('Strict-Transport-Security')).toBe('max-age=31536000; includeSubDomains; preload')
      
      process.env.NODE_ENV = originalEnv
    })
  })

  describe('Security Headers Integration', () => {
    it('should include all required security headers', () => {
      const response = new MockNextResponse() as any
      SecurityHeadersManager.applySecurityHeaders(response, defaultSecurityConfig)
      
      const requiredHeaders = [
        'Content-Security-Policy',
        'X-Frame-Options',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Permissions-Policy',
        'X-DNS-Prefetch-Control',
        'Cross-Origin-Embedder-Policy',
        'Cross-Origin-Opener-Policy',
        'Cross-Origin-Resource-Policy'
      ]
      
      requiredHeaders.forEach(header => {
        expect(response.headers.get(header)).toBeDefined()
      })
    })

    it('should have secure CSP directives', () => {
      const response = new MockNextResponse() as any
      SecurityHeadersManager.applySecurityHeaders(response, defaultSecurityConfig)
      
      const csp = response.headers.get('Content-Security-Policy')
      expect(csp).toContain("object-src 'none'")
      expect(csp).toContain("base-uri 'self'")
      expect(csp).toContain("form-action 'self'")
      expect(csp).toContain("frame-ancestors 'none'")
    })
  })
})