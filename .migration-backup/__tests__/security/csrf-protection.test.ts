/**
 * @jest-environment node
 */
import { CSRFProtection } from '@/lib/security'

// Mock NextRequest for testing
class MockNextRequest {
  constructor(url, options = {}) {
    this.method = options.method || 'GET'
    this.headers = new Map(Object.entries(options.headers || {}))
    this.nextUrl = { pathname: new URL(url).pathname }
  }
  
  get(key) {
    return this.headers.get(key) || null
  }
}

describe('CSRF Protection', () => {
  const sessionId = 'test-session-123'

  describe('Token Generation and Validation', () => {
    it('should generate valid CSRF tokens', () => {
      const token = CSRFProtection.generateToken(sessionId)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })

    it('should validate correct CSRF tokens', () => {
      const token = CSRFProtection.generateToken(sessionId)
      const isValid = CSRFProtection.validateToken(token, sessionId)
      
      expect(isValid).toBe(true)
    })

    it('should reject tokens for different session IDs', () => {
      const token = CSRFProtection.generateToken(sessionId)
      const isValid = CSRFProtection.validateToken(token, 'different-session')
      
      expect(isValid).toBe(false)
    })

    it('should reject malformed tokens', () => {
      const isValid = CSRFProtection.validateToken('invalid-token', sessionId)
      expect(isValid).toBe(false)
    })

    it('should reject empty tokens', () => {
      const isValid = CSRFProtection.validateToken('', sessionId)
      expect(isValid).toBe(false)
    })

    it('should generate different tokens for same session', () => {
      const token1 = CSRFProtection.generateToken(sessionId)
      const token2 = CSRFProtection.generateToken(sessionId)
      
      expect(token1).not.toBe(token2)
      expect(CSRFProtection.validateToken(token1, sessionId)).toBe(true)
      expect(CSRFProtection.validateToken(token2, sessionId)).toBe(true)
    })
  })

  describe('Token Extraction from Requests', () => {
    it('should extract token from X-CSRF-Token header', () => {
      const token = 'test-csrf-token'
      const request = new MockNextRequest('https://example.com/api/test', {
        method: 'POST',
        headers: {
          'x-csrf-token': token,
          'content-type': 'application/json'
        }
      }) as any
      
      const extractedToken = CSRFProtection.getTokenFromRequest(request)
      expect(extractedToken).toBe(token)
    })

    it('should return null when no token header present', () => {
      const request = new MockNextRequest('https://example.com/api/test', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        }
      }) as any
      
      const extractedToken = CSRFProtection.getTokenFromRequest(request)
      expect(extractedToken).toBeNull()
    })

    it('should return null for GET requests without token', () => {
      const request = new MockNextRequest('https://example.com/api/test', {
        method: 'GET'
      }) as any
      
      const extractedToken = CSRFProtection.getTokenFromRequest(request)
      expect(extractedToken).toBeNull()
    })
  })

  describe('Token Expiration', () => {
    it('should reject expired tokens', async () => {
      // Mock Date.now to simulate token creation in the past
      const originalNow = Date.now
      const pastTime = Date.now() - (2 * 60 * 60 * 1000) // 2 hours ago
      
      Date.now = jest.fn(() => pastTime)
      const token = CSRFProtection.generateToken(sessionId)
      
      // Restore current time
      Date.now = originalNow
      
      const isValid = CSRFProtection.validateToken(token, sessionId)
      expect(isValid).toBe(false)
    })

    it('should accept fresh tokens', () => {
      const token = CSRFProtection.generateToken(sessionId)
      const isValid = CSRFProtection.validateToken(token, sessionId)
      
      expect(isValid).toBe(true)
    })
  })
})