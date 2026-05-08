import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'
import { securityManager, CSRFProtection, SecurityLogger, RateLimiter } from './security'

// Validation schemas
export const commonSchemas = {
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100).regex(/^[a-zA-Z\s'-]+$/),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/).max(20),
  address: z.string().min(1).max(500),
  zipCode: z.string().regex(/^[\d\-\s]+$/).max(20),
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
  price: z.number().positive().max(999999.99),
  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD']),
  url: z.string().url().max(2048),
  text: z.string().max(10000),
  searchQuery: z.string().min(1).max(200),
}

// Input sanitization
export class InputSanitizer {
  static sanitizeString(input: string): string {
    // Remove null bytes and control characters
    let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    
    // Sanitize HTML content
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: [], // No HTML tags allowed
      ALLOWED_ATTR: []
    })
    
    // Trim whitespace
    sanitized = sanitized.trim()
    
    return sanitized
  }

  static sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeString(obj)
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item))
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(obj)) {
        const sanitizedKey = this.sanitizeString(key)
        sanitized[sanitizedKey] = this.sanitizeObject(value)
      }
      return sanitized
    }
    
    return obj
  }

  static validateAndSanitizeEmail(email: string): string {
    const sanitized = this.sanitizeString(email).toLowerCase()
    const result = commonSchemas.email.safeParse(sanitized)
    if (!result.success) {
      throw new Error('Invalid email format')
    }
    return result.data
  }

  static validateAndSanitizeText(text: string, maxLength: number = 1000): string {
    const sanitized = this.sanitizeString(text)
    if (sanitized.length > maxLength) {
      throw new Error(`Text too long. Maximum ${maxLength} characters allowed.`)
    }
    return sanitized
  }
}

// Request validation
export interface ValidationResult {
  success: boolean
  data?: any
  errors?: string[]
}

export class RequestValidator {
  static async validateRequest(
    request: NextRequest,
    schema: z.ZodSchema,
    options: {
      requireCSRF?: boolean
      sessionId?: string
      maxPayloadSize?: number
    } = {}
  ): Promise<ValidationResult> {
    const { requireCSRF = true, sessionId, maxPayloadSize = 1024 * 1024 } = options
    
    try {
      // Check content length
      const contentLength = request.headers.get('content-length')
      if (contentLength && parseInt(contentLength) > maxPayloadSize) {
        return {
          success: false,
          errors: ['Request payload too large']
        }
      }

      // CSRF validation for state-changing requests
      if (requireCSRF && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
        if (!sessionId) {
          return {
            success: false,
            errors: ['Session ID required for CSRF validation']
          }
        }
        
        const csrfValid = securityManager.validateCSRF(request, sessionId)
        if (!csrfValid) {
          return {
            success: false,
            errors: ['CSRF token validation failed']
          }
        }
      }

      // Parse and validate request body
      let body: any
      const contentType = request.headers.get('content-type') || ''
      
      if (contentType.includes('application/json')) {
        try {
          body = await request.json()
        } catch (error) {
          return {
            success: false,
            errors: ['Invalid JSON format']
          }
        }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData()
        body = Object.fromEntries(formData.entries())
      } else if (request.method !== 'GET') {
        return {
          success: false,
          errors: ['Unsupported content type']
        }
      }

      // Sanitize input data
      if (body) {
        body = InputSanitizer.sanitizeObject(body)
      }

      // Validate against schema
      const validationResult = schema.safeParse(body)
      if (!validationResult.success) {
        const errors = validationResult.error.issues.map(err => 
          `${err.path.join('.')}: ${err.message}`
        )
        return {
          success: false,
          errors
        }
      }

      return {
        success: true,
        data: validationResult.data
      }
    } catch (error) {
      SecurityLogger.logEvent({
        type: 'invalid_input',
        severity: 'medium',
        clientId: RateLimiter.getClientIdentifier(request),
        path: request.nextUrl.pathname,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      })
      
      return {
        success: false,
        errors: ['Request validation failed']
      }
    }
  }
}

// API route wrapper with security
export function withSecurity(
  handler: (request: NextRequest, context: any) => Promise<NextResponse>,
  options: {
    schema?: z.ZodSchema
    requireCSRF?: boolean
    rateLimit?: { maxRequests: number; windowMs: number }
    requireAuth?: boolean
  } = {}
) {
  return async (request: NextRequest, context: any) => {
    const clientId = RateLimiter.getClientIdentifier(request)
    
    try {
      // Apply rate limiting if specified
      if (options.rateLimit) {
        const rateLimit = RateLimiter.checkRateLimit(
          clientId,
          options.rateLimit.maxRequests,
          options.rateLimit.windowMs
        )
        
        if (!rateLimit.allowed) {
          const response = NextResponse.json(
            { error: 'Too many requests' },
            { status: 429 }
          )
          response.headers.set('Retry-After', Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString())
          return response
        }
      }

      // Validate request if schema provided
      if (options.schema) {
        const validation = await RequestValidator.validateRequest(request, options.schema, {
          requireCSRF: options.requireCSRF,
          sessionId: 'default-session' // TODO: Get from actual session
        })
        
        if (!validation.success) {
          return NextResponse.json(
            { error: 'Validation failed', details: validation.errors },
            { status: 400 }
          )
        }
        
        // Add validated data to request context
        ;(request as any).validatedData = validation.data
      }

      // Call the actual handler
      const response = await handler(request, context)
      
      // Apply security headers to response
      return securityManager.secureResponse(response)
    } catch (error) {
      SecurityLogger.logEvent({
        type: 'suspicious_activity',
        severity: 'high',
        clientId,
        path: request.nextUrl.pathname,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      })
      
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

// Common validation schemas for API routes
export const apiSchemas = {
  // Contact form
  contactForm: z.object({
    name: commonSchemas.name,
    email: commonSchemas.email,
    subject: z.string().min(1).max(200),
    message: z.string().min(10).max(2000),
    phone: commonSchemas.phone.optional(),
  }),

  // Newsletter signup
  newsletter: z.object({
    email: commonSchemas.email,
    preferences: z.array(z.string()).optional(),
  }),

  // Product review
  productReview: z.object({
    productId: commonSchemas.productId,
    rating: z.number().int().min(1).max(5),
    title: z.string().min(1).max(100),
    comment: z.string().min(10).max(1000),
    recommend: z.boolean(),
  }),

  // Cart operations
  addToCart: z.object({
    productId: commonSchemas.productId,
    quantity: commonSchemas.quantity,
    size: z.string().min(1).max(10),
    color: z.string().min(1).max(50).optional(),
  }),

  updateCartItem: z.object({
    itemId: z.string().uuid(),
    quantity: commonSchemas.quantity,
  }),

  // Checkout
  checkout: z.object({
    items: z.array(z.object({
      productId: commonSchemas.productId,
      quantity: commonSchemas.quantity,
      size: z.string(),
      price: commonSchemas.price,
    })),
    shippingAddress: z.object({
      firstName: commonSchemas.name,
      lastName: commonSchemas.name,
      address1: commonSchemas.address,
      address2: z.string().max(500).optional(),
      city: z.string().min(1).max(100),
      state: z.string().min(1).max(100),
      zipCode: commonSchemas.zipCode,
      country: z.string().min(2).max(2),
    }),
    billingAddress: z.object({
      firstName: commonSchemas.name,
      lastName: commonSchemas.name,
      address1: commonSchemas.address,
      address2: z.string().max(500).optional(),
      city: z.string().min(1).max(100),
      state: z.string().min(1).max(100),
      zipCode: commonSchemas.zipCode,
      country: z.string().min(2).max(2),
    }).optional(),
    paymentMethod: z.enum(['card', 'paypal', 'apple_pay', 'google_pay']),
    currency: commonSchemas.currency,
  }),

  // Search
  search: z.object({
    query: commonSchemas.searchQuery,
    category: z.string().max(100).optional(),
    minPrice: z.number().positive().optional(),
    maxPrice: z.number().positive().optional(),
    sortBy: z.enum(['relevance', 'price_asc', 'price_desc', 'newest', 'rating']).optional(),
    page: z.number().int().min(1).max(100).optional(),
    limit: z.number().int().min(1).max(50).optional(),
  }),

  // User account
  userRegistration: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    firstName: commonSchemas.name,
    lastName: commonSchemas.name,
    acceptTerms: z.boolean().refine(val => val === true, {
      message: 'Must accept terms and conditions'
    }),
    marketingOptIn: z.boolean().optional(),
  }),

  userLogin: z.object({
    email: commonSchemas.email,
    password: z.string().min(1).max(128),
    rememberMe: z.boolean().optional(),
  }),

  passwordReset: z.object({
    email: commonSchemas.email,
  }),

  passwordChange: z.object({
    currentPassword: z.string().min(1),
    newPassword: commonSchemas.password,
    confirmPassword: z.string(),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),

  // Profile update
  profileUpdate: z.object({
    firstName: commonSchemas.name.optional(),
    lastName: commonSchemas.name.optional(),
    phone: commonSchemas.phone.optional(),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    preferences: z.object({
      newsletter: z.boolean().optional(),
      smsNotifications: z.boolean().optional(),
      currency: commonSchemas.currency.optional(),
      language: z.enum(['en', 'fr', 'es', 'de']).optional(),
    }).optional(),
  }),
}

// CSRF token generation for forms
export async function generateCSRFToken(sessionId: string = 'default-session'): Promise<string> {
  return CSRFProtection.generateToken(sessionId)
}

// Helper to get CSRF token in API routes
export function getCSRFToken(request: NextRequest): string | null {
  return CSRFProtection.getTokenFromRequest(request)
}

// Security monitoring endpoint
export function createSecurityMonitoringEndpoint() {
  return withSecurity(async (request: NextRequest) => {
    if (request.method !== 'GET') {
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
    }

    // Only allow in development or with proper authentication
    if (process.env.NODE_ENV === 'production') {
      // TODO: Add proper authentication check
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const events = SecurityLogger.getRecentEvents(50)
    return NextResponse.json({ events })
  })
}