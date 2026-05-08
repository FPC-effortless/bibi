import { NextRequest, NextResponse } from 'next/server'
import { withSecurity, apiSchemas } from '@/lib/api-security'

// Newsletter signup with validation and sanitization
export const POST = withSecurity(
  async (request: NextRequest) => {
    try {
      // Get validated and sanitized data from request
      const validatedData = (request as any).validatedData
      
      // Simulate checking if email already exists
      const existingSubscriber = false // In real app, check database
      
      if (existingSubscriber) {
        return NextResponse.json({
          success: false,
          error: 'This email is already subscribed to our newsletter.'
        }, { status: 409 })
      }
      
      // Simulate processing the newsletter signup
      console.log('Processing newsletter signup:', {
        email: validatedData.email,
        preferences: validatedData.preferences || ['general'],
        timestamp: new Date().toISOString()
      })
      
      // In a real application, you would:
      // 1. Save to database
      // 2. Send welcome email
      // 3. Add to email marketing platform
      // 4. Track signup metrics
      
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to newsletter!',
        preferences: validatedData.preferences || ['general']
      }, { status: 201 })
      
    } catch (error) {
      console.error('Newsletter signup error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to subscribe to newsletter. Please try again.' 
        },
        { status: 500 }
      )
    }
  },
  {
    schema: apiSchemas.newsletter,
    requireCSRF: true,
    rateLimit: {
      maxRequests: 3, // 3 newsletter signups
      windowMs: 60 * 60 * 1000 // per hour
    }
  }
)

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Allow', 'POST, OPTIONS')
  return response
}