import { NextRequest, NextResponse } from 'next/server'
import { withSecurity, apiSchemas } from '@/lib/api-security'
import { sessionManager, enforceHTTPS, addSSLSecurityHeaders } from '@/lib/session-security'
import { InputSanitizer } from '@/lib/api-security'

// Secure login endpoint
export const POST = withSecurity(
  async (request: NextRequest) => {
    try {
      // Enforce HTTPS in production
      const httpsRedirect = enforceHTTPS(request)
      if (httpsRedirect) {
        return httpsRedirect
      }

      // Get validated and sanitized data from request
      const validatedData = (request as any).validatedData
      
      // Simulate user authentication (in production, verify against database)
      const authenticatedUser = await authenticateUser(
        validatedData.email,
        validatedData.password
      )
      
      if (!authenticatedUser) {
        // Log failed login attempt
        console.log('[SECURITY] Failed login attempt:', {
          email: validatedData.email,
          ip: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          timestamp: new Date().toISOString()
        })
        
        return NextResponse.json({
          success: false,
          error: 'Invalid email or password'
        }, { status: 401 })
      }
      
      // Create secure session
      const sessionData = {
        userId: authenticatedUser.id,
        email: authenticatedUser.email,
        role: authenticatedUser.role,
        permissions: authenticatedUser.permissions
      }
      
      const { sessionId, sessionToken, cookie } = await sessionManager.createSession(sessionData)
      
      // Log successful login
      console.log('[SECURITY] Successful login:', {
        userId: authenticatedUser.id,
        email: authenticatedUser.email,
        sessionId: sessionId.substring(0, 16) + '...',
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        timestamp: new Date().toISOString()
      })
      
      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: authenticatedUser.id,
          email: authenticatedUser.email,
          role: authenticatedUser.role,
          permissions: authenticatedUser.permissions
        }
      })
      
      // Set secure session cookie
      response.headers.set('Set-Cookie', cookie)
      
      // Add SSL security headers
      addSSLSecurityHeaders(response)
      
      return response
      
    } catch (error) {
      console.error('Login error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Login failed. Please try again.' 
        },
        { status: 500 }
      )
    }
  },
  {
    schema: apiSchemas.userLogin,
    requireCSRF: true,
    rateLimit: {
      maxRequests: 5, // 5 login attempts
      windowMs: 15 * 60 * 1000 // per 15 minutes
    }
  }
)

// Simulate user authentication
async function authenticateUser(email: string, password: string): Promise<any | null> {
  // In production, this would:
  // 1. Hash the password with bcrypt
  // 2. Query the database for the user
  // 3. Compare password hashes
  // 4. Return user data if valid
  
  // Simulate database lookup
  const users = [
    {
      id: 'user_123',
      email: 'admin@bibiere.com',
      passwordHash: 'hashed_password', // In production, use bcrypt
      role: 'admin',
      permissions: ['read', 'write', 'admin']
    },
    {
      id: 'user_456',
      email: 'customer@example.com',
      passwordHash: 'hashed_password',
      role: 'customer',
      permissions: ['read']
    }
  ]
  
  const user = users.find(u => u.email === email)
  
  // Simulate password verification (use bcrypt in production)
  if (user && password === 'password123') {
    return user
  }
  
  return null
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 })
  response.headers.set('Allow', 'POST, OPTIONS')
  addSSLSecurityHeaders(response)
  return response
}