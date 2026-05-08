/**
 * @jest-environment node
 */
import { RateLimiter } from '@/lib/security'

// Mock NextRequest for testing
class MockNextRequest {
  constructor(url, options = {}) {
    this.method = options.method || 'GET'
    this.headers = new Map(Object.entries(options.headers || {}))
    this.nextUrl = { 
      pathname: new URL(url).pathname,
      href: url
    }
  }
  
  get(key) {
    return this.headers.get(key) || null
  }
}

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear rate limiter state before each test
    const rateLimiterAny = RateLimiter as any
    rateLimiterAny.requestCounts.clear()
  })

  describe('Rate Limit Checking', () => {
    it('should allow requests within limit', () => {
      const identifier = 'test-client-1'
      const maxRequests = 5
      const windowMs = 60000 // 1 minute
      
      for (let i = 0; i < maxRequests; i++) {
        const result = RateLimiter.checkRateLimit(identifier, maxRequests, windowMs)
        expect(result.allowed).toBe(true)
        expect(result.remaining).toBe(maxRequests - (i + 1))
      }
    })

    it('should block requests exceeding limit', () => {
      const identifier = 'test-client-2'
      const maxRequests = 3
      const windowMs = 60000
      
      // Make requests up to the limit
      for (let i = 0; i < maxRequests; i++) {
        const result = RateLimiter.checkRateLimit(identifier, maxRequests, windowMs)
        expect(result.allowed).toBe(true)
      }
      
      // Next request should be blocked
      const blockedResult = RateLimiter.checkRateLimit(identifier, maxRequests, windowMs)
      expect(blockedResult.allowed).toBe(false)
      expect(blockedResult.remaining).toBe(0)
    })

    it('should reset after window expires', () => {
      const identifier = 'test-client-3'
      const maxRequests = 2
      const windowMs = 100 // Very short window for testing
      
      // Exhaust the limit
      RateLimiter.checkRateLimit(identifier, maxRequests, windowMs)
      RateLimiter.checkRateLimit(identifier, maxRequests, windowMs)
      
      const blockedResult = RateLimiter.checkRateLimit(identifier, maxRequests, windowMs)
      expect(blockedResult.allowed).toBe(false)
      
      // Wait for window to expire
      return new Promise(resolve => {
        setTimeout(() => {
          const allowedResult = RateLimiter.checkRateLimit(identifier, maxRequests, windowMs)
          expect(allowedResult.allowed).toBe(true)
          expect(allowedResult.remaining).toBe(maxRequests - 1)
          resolve(undefined)
        }, windowMs + 10)
      })
    })

    it('should handle different clients independently', () => {
      const client1 = 'test-client-4'
      const client2 = 'test-client-5'
      const maxRequests = 2
      const windowMs = 60000
      
      // Exhaust limit for client1
      RateLimiter.checkRateLimit(client1, maxRequests, windowMs)
      RateLimiter.checkRateLimit(client1, maxRequests, windowMs)
      
      const client1Blocked = RateLimiter.checkRateLimit(client1, maxRequests, windowMs)
      expect(client1Blocked.allowed).toBe(false)
      
      // Client2 should still be allowed
      const client2Allowed = RateLimiter.checkRateLimit(client2, maxRequests, windowMs)
      expect(client2Allowed.allowed).toBe(true)
    })
  })

  describe('Client Identification', () => {
    it('should generate consistent identifiers for same client', () => {
      const request1 = new MockNextRequest('https://example.com/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
          'user-agent': 'Mozilla/5.0 (Test Browser)'
        }
      }) as any
      
      const request2 = new MockNextRequest('https://example.com/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
          'user-agent': 'Mozilla/5.0 (Test Browser)'
        }
      }) as any
      
      const id1 = RateLimiter.getClientIdentifier(request1)
      const id2 = RateLimiter.getClientIdentifier(request2)
      
      expect(id1).toBe(id2)
    })

    it('should generate different identifiers for different IPs', () => {
      const request1 = new MockNextRequest('https://example.com/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
          'user-agent': 'Mozilla/5.0 (Test Browser)'
        }
      }) as any
      
      const request2 = new MockNextRequest('https://example.com/test', {
        headers: {
          'x-forwarded-for': '192.168.1.2',
          'user-agent': 'Mozilla/5.0 (Test Browser)'
        }
      }) as any
      
      const id1 = RateLimiter.getClientIdentifier(request1)
      const id2 = RateLimiter.getClientIdentifier(request2)
      
      expect(id1).not.toBe(id2)
    })

    it('should handle missing headers gracefully', () => {
      const request = new MockNextRequest('https://example.com/test') as any
      const identifier = RateLimiter.getClientIdentifier(request)
      
      expect(identifier).toBeDefined()
      expect(typeof identifier).toBe('string')
      expect(identifier.length).toBeGreaterThan(0)
    })

    it('should use x-real-ip when x-forwarded-for is not available', () => {
      const request = new MockNextRequest('https://example.com/test', {
        headers: {
          'x-real-ip': '10.0.0.1',
          'user-agent': 'Mozilla/5.0 (Test Browser)'
        }
      }) as any
      
      const identifier = RateLimiter.getClientIdentifier(request)
      expect(identifier).toContain('10.0.0.1')
    })

    it('should parse first IP from x-forwarded-for list', () => {
      const request = new MockNextRequest('https://example.com/test', {
        headers: {
          'x-forwarded-for': '203.0.113.1, 198.51.100.1, 192.0.2.1',
          'user-agent': 'Mozilla/5.0 (Test Browser)'
        }
      }) as any
      
      const identifier = RateLimiter.getClientIdentifier(request)
      expect(identifier).toContain('203.0.113.1')
    })
  })

  describe('Rate Limit Response Headers', () => {
    it('should provide correct reset time', () => {
      const identifier = 'test-client-6'
      const maxRequests = 1
      const windowMs = 60000
      
      const beforeTime = Date.now()
      const result = RateLimiter.checkRateLimit(identifier, maxRequests, windowMs)
      const afterTime = Date.now()
      
      expect(result.resetTime).toBeGreaterThanOrEqual(beforeTime + windowMs)
      expect(result.resetTime).toBeLessThanOrEqual(afterTime + windowMs)
    })

    it('should provide correct remaining count', () => {
      const identifier = 'test-client-7'
      const maxRequests = 5
      const windowMs = 60000
      
      const result1 = RateLimiter.checkRateLimit(identifier, maxRequests, windowMs)
      expect(result1.remaining).toBe(4)
      
      const result2 = RateLimiter.checkRateLimit(identifier, maxRequests, windowMs)
      expect(result2.remaining).toBe(3)
      
      const result3 = RateLimiter.checkRateLimit(identifier, maxRequests, windowMs)
      expect(result3.remaining).toBe(2)
    })
  })
})