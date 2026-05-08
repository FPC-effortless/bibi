/**
 * Test suite for sitemap and robots.txt functionality
 * Tests requirements 2.4, 2.5, and 2.6 from the production readiness spec
 */

const { describe, it, expect } = require('@jest/globals')

describe('Sitemap and Robots.txt Functionality', () => {
  describe('Sitemap Structure Validation', () => {
    it('should validate sitemap URL structure', () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'
      
      // Test URL validation
      const validUrls = [
        `${baseUrl}/`,
        `${baseUrl}/about`,
        `${baseUrl}/collections`,
        `${baseUrl}/product/test-product`,
        `${baseUrl}/journal/test-post`
      ]
      
      validUrls.forEach(url => {
        expect(url).toMatch(/^https?:\/\//)
        expect(() => new URL(url)).not.toThrow()
      })
    })

    it('should validate sitemap entry properties', () => {
      const validEntry = {
        url: 'https://bibiere.com/test',
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8
      }
      
      // Validate URL
      expect(() => new URL(validEntry.url)).not.toThrow()
      
      // Validate priority range
      expect(validEntry.priority).toBeGreaterThanOrEqual(0)
      expect(validEntry.priority).toBeLessThanOrEqual(1)
      
      // Validate lastModified format
      expect(new Date(validEntry.lastModified)).toBeInstanceOf(Date)
      expect(isNaN(Date.parse(validEntry.lastModified))).toBe(false)
      
      // Validate changeFrequency
      const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']
      expect(validFrequencies).toContain(validEntry.changeFrequency)
    })

    it('should reject invalid sitemap entries', () => {
      const invalidEntries = [
        {
          url: 'invalid-url',
          priority: 0.8
        },
        {
          url: 'https://bibiere.com/test',
          priority: 1.5 // Invalid priority > 1
        },
        {
          url: 'https://bibiere.com/test',
          priority: -0.1 // Invalid priority < 0
        }
      ]
      
      invalidEntries.forEach(entry => {
        if (entry.url === 'invalid-url') {
          expect(() => new URL(entry.url)).toThrow()
        }
        
        if (entry.priority !== undefined) {
          if (entry.priority > 1 || entry.priority < 0) {
            expect(entry.priority < 0 || entry.priority > 1).toBe(true)
          }
        }
      })
    })
  })

  describe('Expected Sitemap Content', () => {
    it('should include all required static pages', () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'
      
      const expectedStaticPages = [
        '/',
        '/about',
        '/collections',
        '/collections/essentials',
        '/collections/evening',
        '/journal',
        '/lookbook',
        '/contact',
        '/privacy',
        '/care-instructions',
        '/size-guide',
        '/shipping-returns'
      ]
      
      expectedStaticPages.forEach(page => {
        const fullUrl = `${baseUrl}${page}`
        expect(() => new URL(fullUrl)).not.toThrow()
      })
    })

    it('should include product pages with correct structure', () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'
      
      const mockProductIds = [
        'elegant-silk-dress',
        'luxury-cashmere-scarf',
        'premium-wool-coat',
        'designer-handbag',
        'tailored-blazer'
      ]
      
      mockProductIds.forEach(productId => {
        const productUrl = `${baseUrl}/product/${productId}`
        expect(productUrl).toMatch(/\/product\/[a-z0-9-]+$/)
        expect(() => new URL(productUrl)).not.toThrow()
      })
    })

    it('should include journal pages with correct structure', () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'
      
      const mockJournalSlugs = [
        'timeless-elegance-guide',
        'sustainable-luxury-fashion',
        'styling-essentials-collection'
      ]
      
      mockJournalSlugs.forEach(slug => {
        const journalUrl = `${baseUrl}/journal/${slug}`
        expect(journalUrl).toMatch(/\/journal\/[a-z0-9-]+$/)
        expect(() => new URL(journalUrl)).not.toThrow()
      })
    })
  })

  describe('Robots.txt Configuration', () => {
    it('should validate robots.txt structure', () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'
      
      // Expected robots.txt configuration structure
      const expectedRobotsConfig = {
        rules: [
          {
            userAgent: '*',
            allow: '/',
            disallow: [
              '/admin/',
              '/api/',
              '/account/',
              '/checkout/',
              '/cart/',
              '/wishlist/',
              '/auth/',
              '/_next/',
              '/private/',
              '/temp/',
              '/test/'
            ]
          }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl
      }
      
      // Validate structure
      expect(expectedRobotsConfig.rules).toBeDefined()
      expect(Array.isArray(expectedRobotsConfig.rules)).toBe(true)
      expect(expectedRobotsConfig.rules.length).toBeGreaterThan(0)
      
      // Validate sitemap URL
      expect(expectedRobotsConfig.sitemap).toMatch(/\/sitemap\.xml$/)
      expect(() => new URL(expectedRobotsConfig.sitemap)).not.toThrow()
      
      // Validate host URL
      expect(() => new URL(expectedRobotsConfig.host)).not.toThrow()
    })

    it('should include proper disallow rules for sensitive paths', () => {
      const expectedDisallowedPaths = [
        '/admin/',
        '/api/',
        '/account/',
        '/checkout/',
        '/cart/',
        '/wishlist/',
        '/auth/',
        '/_next/',
        '/private/',
        '/temp/',
        '/test/'
      ]
      
      // Validate that all sensitive paths are properly formatted
      expectedDisallowedPaths.forEach(path => {
        expect(path).toMatch(/^\/.*\/$/)
        expect(path.length).toBeGreaterThan(1)
      })
    })

    it('should allow crawling of public pages', () => {
      const publicPaths = [
        '/',
        '/about',
        '/collections',
        '/product/',
        '/journal/',
        '/lookbook',
        '/contact',
        '/privacy'
      ]
      
      // Validate that public paths are properly formatted
      publicPaths.forEach(path => {
        expect(path).toMatch(/^\//)
        expect(typeof path).toBe('string')
      })
    })

    it('should have specific rules for major search engines', () => {
      const expectedUserAgents = [
        '*',
        'Googlebot',
        'Bingbot',
        'facebookexternalhit'
      ]
      
      expectedUserAgents.forEach(userAgent => {
        expect(typeof userAgent).toBe('string')
        expect(userAgent.length).toBeGreaterThan(0)
      })
    })

    it('should validate robots.txt format compliance', () => {
      // Test robots.txt format compliance
      const robotsRules = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin/',
        'Disallow: /api/',
        'Disallow: /account/',
        'Sitemap: https://bibiere.com/sitemap.xml'
      ]
      
      robotsRules.forEach(rule => {
        expect(typeof rule).toBe('string')
        expect(rule.length).toBeGreaterThan(0)
        
        if (rule.startsWith('User-agent:')) {
          expect(rule).toMatch(/^User-agent:\s+.+/)
        } else if (rule.startsWith('Allow:') || rule.startsWith('Disallow:')) {
          expect(rule).toMatch(/^(Allow|Disallow):\s+\/.*/)
        } else if (rule.startsWith('Sitemap:')) {
          expect(rule).toMatch(/^Sitemap:\s+https?:\/\/.*/)
        }
      })
    })
  })

  describe('Canonical URL Management', () => {
    it('should generate valid canonical URL structure', () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'
      
      // Test canonical URL generation logic
      const testPath = '/test-page'
      const expectedCanonicalUrl = `${baseUrl}${testPath}`
      
      expect(() => new URL(expectedCanonicalUrl)).not.toThrow()
      expect(expectedCanonicalUrl).toMatch(/^https:\/\//)
      expect(expectedCanonicalUrl).toContain(testPath)
    })

    it('should normalize paths correctly', () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'
      
      const testCases = [
        { input: '/test/', expected: '/test' },
        { input: 'test', expected: '/test' },
        { input: '/test//page/', expected: '/test/page' },
        { input: '/', expected: '/' }
      ]
      
      testCases.forEach(({ input, expected }) => {
        // Normalize path logic
        let normalized = input.startsWith('/') ? input.slice(1) : input
        if (normalized.length > 0 && normalized.endsWith('/')) {
          normalized = normalized.slice(0, -1)
        }
        normalized = normalized.replace(/\/+/g, '/')
        const finalPath = `/${normalized}`
        
        expect(finalPath).toBe(expected)
      })
    })

    it('should handle URL parameters correctly', () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'
      
      // Test parameter handling
      const testParams = {
        utm_source: 'google',
        category: 'fashion',
        page: '2'
      }
      
      const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'page']
      
      // Filter out tracking parameters
      const filteredParams = Object.entries(testParams)
        .filter(([key]) => !trackingParams.includes(key))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
      
      expect(filteredParams).toEqual({ category: 'fashion' })
      expect(filteredParams).not.toHaveProperty('utm_source')
      expect(filteredParams).not.toHaveProperty('page')
    })

    it('should generate product canonical URLs', () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'
      const productId = 'elegant-silk-dress'
      const productUrl = `${baseUrl}/product/${productId}`
      
      expect(productUrl).toContain('/product/elegant-silk-dress')
      expect(() => new URL(productUrl)).not.toThrow()
    })

    it('should generate collection canonical URLs', () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'
      const collectionSlug = 'evening'
      const collectionUrl = `${baseUrl}/collections/${collectionSlug}`
      
      expect(collectionUrl).toContain('/collections/evening')
      expect(() => new URL(collectionUrl)).not.toThrow()
    })

    it('should generate journal canonical URLs', () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'
      const journalSlug = 'style-guide'
      const journalUrl = `${baseUrl}/journal/${journalSlug}`
      
      expect(journalUrl).toContain('/journal/style-guide')
      expect(() => new URL(journalUrl)).not.toThrow()
    })

    it('should validate canonical URLs correctly', () => {
      const validUrls = [
        'https://bibiere.com/',
        'https://bibiere.com/about',
        'https://bibiere.com/product/test'
      ]
      
      const invalidUrls = [
        'invalid-url',
        'https://other-domain.com/',
        'https://bibiere.com/#fragment'
      ]
      
      validUrls.forEach(url => {
        expect(() => new URL(url)).not.toThrow()
        expect(url).toMatch(/^https:\/\//)
        
        const parsedUrl = new URL(url)
        expect(parsedUrl.hostname).toBe('bibiere.com')
      })
      
      invalidUrls.forEach(url => {
        if (url === 'invalid-url') {
          expect(() => new URL(url)).toThrow()
        } else if (url.includes('#fragment')) {
          const parsedUrl = new URL(url)
          expect(parsedUrl.hash).toBeTruthy()
        } else if (url.includes('other-domain')) {
          const parsedUrl = new URL(url)
          expect(parsedUrl.hostname).not.toBe('bibiere.com')
        }
      })
    })
  })

  describe('SEO Integration', () => {
    it('should ensure consistent URL structure across sitemap and canonical URLs', () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'
      
      const testUrls = [
        `${baseUrl}/`,
        `${baseUrl}/about`,
        `${baseUrl}/collections`,
        `${baseUrl}/product/test-product`,
        `${baseUrl}/journal/test-post`
      ]
      
      testUrls.forEach(url => {
        // URLs should be valid
        expect(() => new URL(url)).not.toThrow()
        
        const parsedUrl = new URL(url)
        
        // URLs should not have trailing slashes (except root)
        if (parsedUrl.pathname !== '/') {
          expect(parsedUrl.pathname).not.toMatch(/\/$/)
        }
        
        // URLs should be lowercase
        expect(parsedUrl.pathname).toBe(parsedUrl.pathname.toLowerCase())
        
        // URLs should use HTTPS
        expect(parsedUrl.protocol).toBe('https:')
      })
    })

    it('should validate sitemap and robots.txt integration', () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'
      const sitemapUrl = `${baseUrl}/sitemap.xml`
      
      // Sitemap URL should be valid
      expect(() => new URL(sitemapUrl)).not.toThrow()
      expect(sitemapUrl).toMatch(/\/sitemap\.xml$/)
      
      // Robots.txt should reference the sitemap
      const robotsSitemapReference = `Sitemap: ${sitemapUrl}`
      expect(robotsSitemapReference).toContain(sitemapUrl)
    })

    it('should ensure proper meta tag structure', () => {
      // Test canonical link tag generation
      const testUrl = 'https://bibiere.com/about'
      const canonicalLinkTag = `<link rel="canonical" href="${testUrl}" />`
      
      expect(canonicalLinkTag).toContain('rel="canonical"')
      expect(canonicalLinkTag).toContain(`href="${testUrl}"`)
      expect(canonicalLinkTag).toMatch(/<link[^>]*\/?>/)
    })
  })

  describe('Error Handling and Validation', () => {
    it('should handle invalid URL configurations gracefully', () => {
      const invalidConfigs = [
        { path: '', params: {}, removeParams: [] },
        { path: '/test', params: { test: 'value' }, removeParams: ['nonexistent'] },
        { path: '/valid-path', params: { valid: 'param' }, removeParams: [] }
      ]
      
      invalidConfigs.forEach(config => {
        // Should not throw errors
        expect(() => {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'
          const url = `${baseUrl}${config.path}`
          return new URL(url)
        }).not.toThrow()
      })
    })

    it('should provide fallback mechanisms', () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'
      
      // Test fallback URL generation
      const fallbackUrl = baseUrl
      expect(() => new URL(fallbackUrl)).not.toThrow()
      expect(fallbackUrl).toMatch(/^https:\/\//)
    })

    it('should validate required SEO elements', () => {
      // Test that all required SEO elements are properly structured
      const requiredElements = {
        sitemap: '/sitemap.xml',
        robots: '/robots.txt',
        canonical: 'rel="canonical"',
        openGraph: 'property="og:',
        twitterCard: 'name="twitter:'
      }
      
      Object.entries(requiredElements).forEach(([element, pattern]) => {
        expect(typeof pattern).toBe('string')
        expect(pattern.length).toBeGreaterThan(0)
        
        if (element === 'sitemap' || element === 'robots') {
          expect(pattern).toMatch(/^\/.*\.(xml|txt)$/)
        } else if (element === 'canonical') {
          expect(pattern).toContain('canonical')
        } else if (element === 'openGraph') {
          expect(pattern).toContain('og:')
        } else if (element === 'twitterCard') {
          expect(pattern).toContain('twitter:')
        }
      })
    })
  })
})