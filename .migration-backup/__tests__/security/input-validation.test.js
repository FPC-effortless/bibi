/**
 * @jest-environment node
 */

// Import the validation functions
const path = require('path')
const { InputSanitizer, RequestValidator, apiSchemas } = require(path.resolve(__dirname, '../../lib/api-security'))

describe('Input Validation and Sanitization', () => {
  describe('InputSanitizer', () => {
    describe('sanitizeString', () => {
      it('should remove null bytes and control characters', () => {
        const input = 'Hello\x00World\x01Test\x1F'
        const result = InputSanitizer.sanitizeString(input)
        expect(result).toBe('HelloWorldTest')
      })

      it('should remove HTML tags', () => {
        const input = '<script>alert("xss")</script>Hello <b>World</b>'
        const result = InputSanitizer.sanitizeString(input)
        expect(result).toBe('Hello World')
      })

      it('should trim whitespace', () => {
        const input = '  Hello World  '
        const result = InputSanitizer.sanitizeString(input)
        expect(result).toBe('Hello World')
      })

      it('should handle empty strings', () => {
        const result = InputSanitizer.sanitizeString('')
        expect(result).toBe('')
      })

      it('should handle special characters safely', () => {
        const input = 'Price: $29.99 & free shipping!'
        const result = InputSanitizer.sanitizeString(input)
        expect(result).toBe('Price: $29.99 & free shipping!')
      })
    })

    describe('sanitizeObject', () => {
      it('should sanitize all string properties in an object', () => {
        const input = {
          name: '<script>alert("xss")</script>John',
          email: '  john@example.com  ',
          message: 'Hello\x00World'
        }
        
        const result = InputSanitizer.sanitizeObject(input)
        
        expect(result.name).toBe('John')
        expect(result.email).toBe('john@example.com')
        expect(result.message).toBe('HelloWorld')
      })

      it('should handle nested objects', () => {
        const input = {
          user: {
            name: '<b>John</b>',
            details: {
              bio: '  Software Developer  '
            }
          }
        }
        
        const result = InputSanitizer.sanitizeObject(input)
        
        expect(result.user.name).toBe('John')
        expect(result.user.details.bio).toBe('Software Developer')
      })

      it('should handle arrays', () => {
        const input = {
          tags: ['<script>tag1</script>', '  tag2  ', 'tag3\x00']
        }
        
        const result = InputSanitizer.sanitizeObject(input)
        
        expect(result.tags).toEqual(['tag1', 'tag2', 'tag3'])
      })

      it('should preserve non-string values', () => {
        const input = {
          name: 'John',
          age: 30,
          active: true,
          score: 95.5,
          data: null
        }
        
        const result = InputSanitizer.sanitizeObject(input)
        
        expect(result.name).toBe('John')
        expect(result.age).toBe(30)
        expect(result.active).toBe(true)
        expect(result.score).toBe(95.5)
        expect(result.data).toBe(null)
      })
    })

    describe('validateAndSanitizeEmail', () => {
      it('should validate and sanitize valid emails', () => {
        const input = '  JOHN@EXAMPLE.COM  '
        const result = InputSanitizer.validateAndSanitizeEmail(input)
        expect(result).toBe('john@example.com')
      })

      it('should throw error for invalid emails', () => {
        expect(() => {
          InputSanitizer.validateAndSanitizeEmail('invalid-email')
        }).toThrow('Invalid email format')
      })

      it('should handle email with HTML', () => {
        const input = '<script>john@example.com</script>'
        const result = InputSanitizer.validateAndSanitizeEmail(input)
        expect(result).toBe('john@example.com')
      })
    })

    describe('validateAndSanitizeText', () => {
      it('should validate and sanitize text within length limit', () => {
        const input = '  <b>Hello World</b>  '
        const result = InputSanitizer.validateAndSanitizeText(input, 50)
        expect(result).toBe('Hello World')
      })

      it('should throw error for text exceeding length limit', () => {
        const longText = 'a'.repeat(1001)
        expect(() => {
          InputSanitizer.validateAndSanitizeText(longText, 1000)
        }).toThrow('Text too long. Maximum 1000 characters allowed.')
      })
    })
  })

  describe('API Schema Validation', () => {
    describe('contactForm schema', () => {
      it('should validate valid contact form data', () => {
        const validData = {
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'This is a test message with enough characters.',
          phone: '+1-555-123-4567'
        }
        
        const result = apiSchemas.contactForm.safeParse(validData)
        expect(result.success).toBe(true)
      })

      it('should reject invalid email', () => {
        const invalidData = {
          name: 'John Doe',
          email: 'invalid-email',
          subject: 'Test Subject',
          message: 'This is a test message with enough characters.'
        }
        
        const result = apiSchemas.contactForm.safeParse(invalidData)
        expect(result.success).toBe(false)
      })

      it('should reject short message', () => {
        const invalidData = {
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'Short'
        }
        
        const result = apiSchemas.contactForm.safeParse(invalidData)
        expect(result.success).toBe(false)
      })

      it('should accept optional phone number', () => {
        const validData = {
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'This is a test message with enough characters.'
          // phone is optional
        }
        
        const result = apiSchemas.contactForm.safeParse(validData)
        expect(result.success).toBe(true)
      })
    })

    describe('addToCart schema', () => {
      it('should validate valid cart item data', () => {
        const validData = {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          quantity: 2,
          size: 'M',
          color: 'Blue'
        }
        
        const result = apiSchemas.addToCart.safeParse(validData)
        expect(result.success).toBe(true)
      })

      it('should reject invalid UUID', () => {
        const invalidData = {
          productId: 'invalid-uuid',
          quantity: 2,
          size: 'M'
        }
        
        const result = apiSchemas.addToCart.safeParse(invalidData)
        expect(result.success).toBe(false)
      })

      it('should reject invalid quantity', () => {
        const invalidData = {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          quantity: 0, // Invalid: must be at least 1
          size: 'M'
        }
        
        const result = apiSchemas.addToCart.safeParse(invalidData)
        expect(result.success).toBe(false)
      })

      it('should reject excessive quantity', () => {
        const invalidData = {
          productId: '123e4567-e89b-12d3-a456-426614174000',
          quantity: 100, // Invalid: max is 99
          size: 'M'
        }
        
        const result = apiSchemas.addToCart.safeParse(invalidData)
        expect(result.success).toBe(false)
      })
    })

    describe('search schema', () => {
      it('should validate valid search data', () => {
        const validData = {
          query: 'evening dress',
          category: 'evening',
          minPrice: 100,
          maxPrice: 500,
          sortBy: 'price_asc',
          page: 1,
          limit: 20
        }
        
        const result = apiSchemas.search.safeParse(validData)
        expect(result.success).toBe(true)
      })

      it('should reject invalid sort option', () => {
        const invalidData = {
          query: 'dress',
          sortBy: 'invalid_sort'
        }
        
        const result = apiSchemas.search.safeParse(invalidData)
        expect(result.success).toBe(false)
      })

      it('should reject negative prices', () => {
        const invalidData = {
          query: 'dress',
          minPrice: -10
        }
        
        const result = apiSchemas.search.safeParse(invalidData)
        expect(result.success).toBe(false)
      })

      it('should reject excessive page numbers', () => {
        const invalidData = {
          query: 'dress',
          page: 101 // Max is 100
        }
        
        const result = apiSchemas.search.safeParse(invalidData)
        expect(result.success).toBe(false)
      })
    })

    describe('newsletter schema', () => {
      it('should validate valid newsletter data', () => {
        const validData = {
          email: 'john@example.com',
          preferences: ['general', 'sales']
        }
        
        const result = apiSchemas.newsletter.safeParse(validData)
        expect(result.success).toBe(true)
      })

      it('should accept email only', () => {
        const validData = {
          email: 'john@example.com'
        }
        
        const result = apiSchemas.newsletter.safeParse(validData)
        expect(result.success).toBe(true)
      })

      it('should reject invalid email', () => {
        const invalidData = {
          email: 'not-an-email'
        }
        
        const result = apiSchemas.newsletter.safeParse(invalidData)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('Security Edge Cases', () => {
    it('should handle SQL injection attempts', () => {
      const maliciousInput = "'; DROP TABLE users; --"
      const result = InputSanitizer.sanitizeString(maliciousInput)
      expect(result).toBe("'; DROP TABLE users; --") // Should be sanitized but not cause issues
    })

    it('should handle XSS attempts', () => {
      const xssInput = '<img src="x" onerror="alert(1)">'
      const result = InputSanitizer.sanitizeString(xssInput)
      expect(result).not.toContain('<img')
      expect(result).not.toContain('onerror')
      expect(result).not.toContain('alert')
    })

    it('should handle very long inputs', () => {
      const longInput = 'a'.repeat(10000)
      const result = InputSanitizer.sanitizeString(longInput)
      expect(result.length).toBe(10000)
      expect(result).toBe(longInput) // Should not be truncated by sanitizer
    })

    it('should handle unicode characters', () => {
      const unicodeInput = 'Hello 世界 🌍 café'
      const result = InputSanitizer.sanitizeString(unicodeInput)
      expect(result).toBe('Hello 世界 🌍 café')
    })

    it('should handle null and undefined inputs', () => {
      expect(() => InputSanitizer.sanitizeString(null)).toThrow()
      expect(() => InputSanitizer.sanitizeString(undefined)).toThrow()
    })
  })
})