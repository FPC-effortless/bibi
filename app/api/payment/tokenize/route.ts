import { NextRequest, NextResponse } from 'next/server'
import { withSecurity } from '@/lib/api-security'
import { paymentSecurityManager } from '@/lib/payment-security'
import { withSessionAuth, addSSLSecurityHeaders } from '@/lib/session-security'
import { z } from 'zod'

// Card tokenization schema
const cardTokenizationSchema = z.object({
  cardNumber: z.string().min(13).max(19).regex(/^\d+$/),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/),
  expiryYear: z.string().regex(/^\d{2}(\d{2})?$/),
  cvv: z.string().regex(/^\d{3,4}$/),
  holderName: z.string().min(1).max(100).regex(/^[a-zA-Z\s'-]+$/),
})

// Secure card tokenization endpoint
export const POST = withSessionAuth(
  withSecurity(
    async (request: NextRequest, session) => {
      try {
        // Get validated and sanitized data from request
        const validatedData = (request as any).validatedData
        
        // Log tokenization attempt
        paymentSecurityManager.logAuditEvent('card_tokenization_initiated', {
          userId: session.data.userId,
          cardBrand: paymentSecurityManager.detectCardBrand(validatedData.cardNumber),
          lastFour: validatedData.cardNumber.slice(-4)
        }, request)
        
        // Tokenize card data
        const tokenizedCard = paymentSecurityManager.tokenizeCard({
          number: validatedData.cardNumber,
          expiryMonth: validatedData.expiryMonth,
          expiryYear: validatedData.expiryYear,
          cvv: validatedData.cvv,
          holderName: validatedData.holderName
        })
        
        // Log successful tokenization
        paymentSecurityManager.logAuditEvent('card_tokenization_completed', {
          userId: session.data.userId,
          token: tokenizedCard.token.substring(0, 16) + '...',
          cardBrand: tokenizedCard.brand,
          lastFour: tokenizedCard.lastFour
        }, request)
        
        const response = NextResponse.json({
          success: true,
          message: 'Card tokenized successfully',
          token: tokenizedCard.token,
          card: {
            lastFour: tokenizedCard.lastFour,
            brand: tokenizedCard.brand,
            expiryMonth: tokenizedCard.expiryMonth,
            expiryYear: tokenizedCard.expiryYear
          }
        })
        
        // Add SSL security headers
        addSSLSecurityHeaders(response)
        
        return response
        
      } catch (error) {
        // Log tokenization failure
        paymentSecurityManager.logAuditEvent('card_tokenization_failed', {
          userId: session.data.userId,
          error: error instanceof Error ? error.message : 'Unknown error'
        }, request)
        
        console.error('Card tokenization error:', error)
        return NextResponse.json(
          { 
            success: false, 
            error: error instanceof Error ? error.message : 'Card tokenization failed' 
          },
          { status: 400 }
        )
      }
    },
    {
      schema: cardTokenizationSchema,
      requireCSRF: true,
      rateLimit: {
        maxRequests: 10, // 10 tokenization attempts
        windowMs: 60 * 60 * 1000 // per hour
      }
    }
  ),
  {
    required: true // Require authentication for tokenization
  }
)

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Allow', 'POST, OPTIONS')
  addSSLSecurityHeaders(response)
  return response
}