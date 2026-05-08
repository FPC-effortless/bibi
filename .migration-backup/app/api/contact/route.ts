import { NextRequest, NextResponse } from 'next/server'
import { withSecurity, apiSchemas } from '@/lib/api-security'

// Contact form submission with validation and sanitization
export const POST = withSecurity(
  async (request: NextRequest) => {
    try {
      // Get validated and sanitized data from request
      const validatedData = (request as any).validatedData
      
      // Simulate processing the contact form
      console.log('Processing contact form:', {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message.substring(0, 100) + '...', // Truncate for logging
        phone: validatedData.phone || 'Not provided'
      })
      
      // In a real application, you would:
      // 1. Save to database
      // 2. Send email notification
      // 3. Add to CRM system
      // 4. Send auto-reply to user
      
      return NextResponse.json({
        success: true,
        message: 'Thank you for your message. We will get back to you soon.',
        id: `contact_${Date.now()}` // Simulate generated ID
      }, { status: 201 })
      
    } catch (error) {
      console.error('Contact form error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to process contact form. Please try again.' 
        },
        { status: 500 }
      )
    }
  },
  {
    schema: apiSchemas.contactForm,
    requireCSRF: true,
    rateLimit: {
      maxRequests: 5, // 5 contact form submissions
      windowMs: 15 * 60 * 1000 // per 15 minutes
    }
  }
)

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Allow', 'POST, OPTIONS')
  return response
}