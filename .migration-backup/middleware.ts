import { NextRequest, NextResponse } from 'next/server'
import { generateCanonicalUrl, validateCanonicalUrl } from './lib/canonical-url'
import { securityManager, SecurityLogger, RateLimiter } from './lib/security'

// Configuration for middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const url = request.nextUrl.clone()

  // Skip middleware for certain paths
  if (shouldSkipMiddleware(pathname)) {
    return NextResponse.next()
  }

  // Apply security measures first
  const securityResult = securityManager.processRequest(request)
  
  // If rate limited, return early
  if (securityResult.rateLimitExceeded && securityResult.response) {
    return securityResult.response
  }

  // Handle trailing slash normalization
  const trailingSlashResponse = handleTrailingSlash(request)
  if (trailingSlashResponse) {
    return securityManager.secureResponse(trailingSlashResponse, securityResult.nonce)
  }

  // Handle canonical URL redirects
  const canonicalResponse = handleCanonicalRedirect(request)
  if (canonicalResponse) {
    return securityManager.secureResponse(canonicalResponse, securityResult.nonce)
  }

  // Handle lowercase URL normalization
  const lowercaseResponse = handleLowercaseRedirect(request)
  if (lowercaseResponse) {
    return securityManager.secureResponse(lowercaseResponse, securityResult.nonce)
  }

  // Create response and apply security headers
  const response = NextResponse.next()
  
  // Add CSP nonce to response for client-side access
  if (securityResult.nonce) {
    response.headers.set('X-CSP-Nonce', securityResult.nonce)
  }
  
  return securityManager.secureResponse(response, securityResult.nonce)
}

/**
 * Check if middleware should be skipped for this path
 */
function shouldSkipMiddleware(pathname: string): boolean {
  const skipPaths = [
    '/api/',
    '/_next/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.json',
    '/sw.js'
  ]

  return skipPaths.some(path => pathname.startsWith(path))
}

/**
 * Handle trailing slash normalization
 * Remove trailing slashes except for root path
 */
function handleTrailingSlash(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl
  
  // Skip root path
  if (pathname === '/') {
    return null
  }

  // If path has trailing slash, redirect to version without it
  if (pathname.endsWith('/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(0, -1)
    
    return NextResponse.redirect(url, 301) // Permanent redirect
  }

  return null
}

/**
 * Handle canonical URL redirects
 * Redirect to canonical version if current URL has tracking parameters
 */
function handleCanonicalRedirect(request: NextRequest): NextResponse | null {
  const { pathname, searchParams } = request.nextUrl
  
  // Parameters that should trigger a canonical redirect
  const trackingParams = [
    'utm_source',
    'utm_medium', 
    'utm_campaign',
    'utm_content',
    'utm_term',
    'ref',
    'source',
    'fbclid',
    'gclid'
  ]

  // Check if any tracking parameters are present
  const hasTrackingParams = trackingParams.some(param => searchParams.has(param))
  
  if (hasTrackingParams) {
    try {
      // Generate canonical URL
      const canonicalUrl = generateCanonicalUrl({
        path: pathname,
        params: Object.fromEntries(searchParams.entries()),
        removeParams: trackingParams
      })

      // Parse canonical URL to get clean path and params
      const canonical = new URL(canonicalUrl)
      
      // Create redirect URL
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = canonical.pathname
      redirectUrl.search = canonical.search

      // Only redirect if the URL actually changes
      if (redirectUrl.href !== request.nextUrl.href) {
        return NextResponse.redirect(redirectUrl, 301) // Permanent redirect
      }
    } catch (error) {
      console.error('Error generating canonical redirect:', error)
    }
  }

  return null
}

/**
 * Handle lowercase URL normalization
 * Redirect uppercase paths to lowercase (except for specific cases)
 */
function handleLowercaseRedirect(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl
  
  // Skip certain paths that might legitimately have uppercase
  const skipLowercasePaths = [
    '/api/',
    '/_next/'
  ]

  if (skipLowercasePaths.some(path => pathname.startsWith(path))) {
    return null
  }

  // Check if pathname has uppercase letters
  if (pathname !== pathname.toLowerCase()) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.toLowerCase()
    
    return NextResponse.redirect(url, 301) // Permanent redirect
  }

  return null
}

/**
 * Add security headers to response (deprecated - now handled by SecurityManager)
 * @deprecated Use SecurityManager.secureResponse instead
 */
function addSecurityHeaders(response: NextResponse): void {
  // This function is now deprecated and replaced by SecurityManager
  // Keeping for backward compatibility but functionality moved to lib/security.ts
}

/**
 * Handle bot detection and special routing
 */
function handleBotRouting(request: NextRequest): NextResponse | null {
  const userAgent = request.headers.get('user-agent') || ''
  
  // Detect search engine bots
  const isBot = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator/i.test(userAgent)
  
  if (isBot) {
    // Add special headers for bots
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'index, follow')
    return response
  }

  return null
}

/**
 * Handle internationalization redirects (if needed in the future)
 */
function handleI18nRedirect(request: NextRequest): NextResponse | null {
  // This can be implemented when internationalization is added
  // For now, return null to skip
  return null
}

/**
 * Log requests for analytics (in development)
 */
function logRequest(request: NextRequest): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${request.method} ${request.nextUrl.pathname}${request.nextUrl.search}`)
  }
}