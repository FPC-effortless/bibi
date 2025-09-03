import { NextRequest, NextResponse } from 'next/server'
import { withSecurity } from '@/lib/api-security'
import { processSecurePayment, paymentSecurityManager } from '@/lib/payment-security'
import { withSessionAuth, addSSLSecurityHeaders } from '@/lib/session-security'
import { z } from 'zod'

// Payment processing schema
const paymentProcessingSchema = z.object({
  amount: z.number().positive().max(1000000),
  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD']),
  orderId: z.string().min(1).max(100),
  cardToken: z.string().min(32),
  description: z.string().max(500).optional(),
  threeDSData: z.object({
    authenticated: z.boolean(),
    transactionId: z.string(),
    cavv: z.string()
  }).optional(),
  billingAddress: z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    address1: z.string().min(1).max(100),
    address2: z.string().max(100).optional(),
    city: z.string().min(1).max(50),
    state: z.string().min(1).max(50),
    zipCode: z.string().min(1).max(20),
    country: z.string().length(2)
  })
})

// Secure payment processing endpoint
export const POST = withSessionAuth(
  withSecurity(
    async (request: NextRequest, session) => {
      try {
        // Get validated and sanitized data from request
        const validatedData = (request as any).validatedData
        
        // Validate payment amount and currency
        if (!paymentSecurityManager.validatePaymentAmount(validatedData.amount, validatedData.currency)) {
          return NextResponse.json({
            success: false,
            error: 'Invalid payment amount or currency'
          }, { status: 400 })
        }
        
        // Log payment initiation
        paymentSecurityManager.logAuditEvent('payment_processing_initiated', {
          userId: session.data.userId,
          orderId: validatedData.orderId,
          amount: validatedData.amount,
          currency: validatedData.currency,
          cardToken: validatedData.cardToken.substring(0, 16) + '...'
        }, request)
        
        // Process secure payment
        const paymentResult = await processSecurePayment(
          {
            amount: validatedData.amount,
            currency: validatedData.currency,
            orderId: validatedData.orderId,
            customerId: session.data.userId,
            description: validatedData.description,
            metadata: {
              billingAddress: validatedData.billingAddress,
              sessionId: session.sessionId
            }
          },
          validatedData.cardToken,
          validatedData.threeDSData
        )
        
        if (!paymentResult.success) {
          return NextResponse.json({
            success: false,
            error: paymentResult.error
          }, { status: 400 })
        }
        
        // Log successful payment
        paymentSecurityManager.logAuditEvent('payment_processing_completed', {
          userId: session.data.userId,
          orderId: validatedData.orderId,
          transactionId: paymentResult.transactionId,
          amount: validatedData.amount,
          currency: validatedData.currency
        }, request)
        
        const response = NextResponse.json({
          success: true,
          message: 'Payment processed successfully',
          transactionId: paymentResult.transactionId,
          orderId: validatedData.orderId,
          amount: validatedData.amount,
          currency: validatedData.currency
        })
        
        // Add SSL security headers
        addSSLSecurityHeaders(response)
        
        return response
        
      } catch (error) {
        // Log payment processing failure
        paymentSecurityManager.logAuditEvent('payment_processing_failed', {
          userId: session.data.userId,
          orderId: (request as any).validatedData?.orderId,
          error: error instanceof Error ? error.message : 'Unknown error'
        }, request)
        
        console.error('Payment processing error:', error)
        return NextResponse.json(
          { 
            success: false, 
            error: 'Payment processing failed. Please try again.' 
          },
          { status: 500 }
        )
      }
    },
    {
      schema: paymentProcessingSchema,
      requireCSRF: true,
      rateLimit: {
        maxRequests: 20, // 20 payment attempts
        windowMs: 60 * 60 * 1000 // per hour
      }
    }
  ),
  {
    required: true, // Require authentication for payments
    roles: ['customer', 'admin'] // Allow customers and admins to make payments
  }
)

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Allow', 'POST, OPTIONS')
  addSSLSecurityHeaders(response)
  return response
}