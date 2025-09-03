import { NextRequest, NextResponse } from 'next/server'
import { generateCSRFToken } from '@/lib/api-security'
import { securityManager } from '@/lib/security'

export async function GET(request: NextRequest) {
  try {
    // Generate session ID (in a real app, this would come from session management)
    const sessionId = request.headers.get('x-session-id') || 'default-session'
    
    // Generate CSRF token
    const csrfToken = generateCSRFToken(sessionId)
    
    const response = NextResponse.json({
      csrfToken,
      expiresIn: 3600 // 1 hour
    })
    
    // Apply security headers
    return securityManager.secureResponse(response)
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Allow', 'GET, OPTIONS')
  return securityManager.secureResponse(response)
}