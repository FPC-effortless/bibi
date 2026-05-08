import { NextRequest, NextResponse } from 'next/server'
import { sessionManager, withSessionAuth, addSSLSecurityHeaders } from '@/lib/session-security'

// Secure logout endpoint
export const POST = withSessionAuth(
  async (request: NextRequest, session) => {
    try {
      // Log logout event
      console.log('[SECURITY] User logout:', {
        userId: session.data.userId,
        sessionId: session.sessionId.substring(0, 16) + '...',
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        timestamp: new Date().toISOString()
      })
      
      const response = NextResponse.json({
        success: true,
        message: 'Logged out successfully'
      })
      
      // Destroy session cookie
      response.headers.set('Set-Cookie', sessionManager.destroySession())
      
      // Add SSL security headers
      addSSLSecurityHeaders(response)
      
      return response
      
    } catch (error) {
      console.error('Logout error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Logout failed. Please try again.' 
        },
        { status: 500 }
      )
    }
  },
  {
    required: true // Require valid session to logout
  }
)

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Allow', 'POST, OPTIONS')
  addSSLSecurityHeaders(response)
  return response
}