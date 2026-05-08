// Canonical URL management utility
// This ensures proper canonical URLs across all pages to prevent duplicate content issues

// Base URL configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'

// Interface for canonical URL configuration
interface CanonicalConfig {
  path: string
  params?: Record<string, string | string[]>
  removeParams?: string[]
  forceHttps?: boolean
}

/**
 * Generate canonical URL for a given path and parameters
 */
export function generateCanonicalUrl(config: CanonicalConfig): string {
  const { path, params = {}, removeParams = [], forceHttps = true } = config
  
  try {
    // Start with base URL
    let baseUrl = BASE_URL
    
    // Force HTTPS if required
    if (forceHttps && !baseUrl.startsWith('https://')) {
      baseUrl = baseUrl.replace(/^http:\/\//, 'https://')
    }
    
    // Clean and normalize the path
    const cleanPath = normalizePath(path)
    
    // Create URL object
    const url = new URL(cleanPath, baseUrl)
    
    // Add parameters (excluding those to be removed)
    Object.entries(params).forEach(([key, value]) => {
      if (!removeParams.includes(key)) {
        if (Array.isArray(value)) {
          // For array values, use the first value or join them
          url.searchParams.set(key, value[0] || '')
        } else {
          url.searchParams.set(key, value)
        }
      }
    })
    
    // Remove unwanted parameters
    removeParams.forEach(param => {
      url.searchParams.delete(param)
    })
    
    // Sort search parameters for consistency
    url.searchParams.sort()
    
    return url.toString()
  } catch (error) {
    console.error('Error generating canonical URL:', error)
    return `${BASE_URL}${normalizePath(path)}`
  }
}

/**
 * Normalize path by removing double slashes, trailing slashes (except root), etc.
 */
function normalizePath(path: string): string {
  if (!path) return '/'
  
  // Remove leading slash if present (will be added by URL constructor)
  let normalized = path.startsWith('/') ? path.slice(1) : path
  
  // Remove trailing slash unless it's the root path
  if (normalized.length > 0 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }
  
  // Remove double slashes
  normalized = normalized.replace(/\/+/g, '/')
  
  // Add leading slash back
  return `/${normalized}`
}

/**
 * Get canonical URL for product pages
 */
export function getProductCanonicalUrl(productId: string, params?: Record<string, string>): string {
  return generateCanonicalUrl({
    path: `/product/${productId}`,
    params,
    removeParams: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref', 'source']
  })
}

/**
 * Get canonical URL for collection pages
 */
export function getCollectionCanonicalUrl(collectionSlug: string, params?: Record<string, string>): string {
  return generateCanonicalUrl({
    path: `/collections/${collectionSlug}`,
    params,
    removeParams: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref', 'source', 'page']
  })
}

/**
 * Get canonical URL for journal/blog pages
 */
export function getJournalCanonicalUrl(slug: string, params?: Record<string, string>): string {
  return generateCanonicalUrl({
    path: `/journal/${slug}`,
    params,
    removeParams: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref', 'source']
  })
}

/**
 * Get canonical URL for search pages
 */
export function getSearchCanonicalUrl(query?: string, filters?: Record<string, string>): string {
  const params: Record<string, string> = {}
  
  if (query) {
    params.q = query
  }
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'page') { // Exclude page parameter for canonical URL
        params[key] = value
      }
    })
  }
  
  return generateCanonicalUrl({
    path: '/search',
    params,
    removeParams: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref', 'source', 'page']
  })
}

/**
 * Get canonical URL for static pages
 */
export function getStaticPageCanonicalUrl(path: string): string {
  return generateCanonicalUrl({
    path,
    removeParams: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref', 'source']
  })
}

/**
 * Validate if a URL is a valid canonical URL
 */
export function validateCanonicalUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    
    // Must be HTTPS in production
    if (process.env.NODE_ENV === 'production' && parsedUrl.protocol !== 'https:') {
      return false
    }
    
    // Must match base domain
    const baseDomain = new URL(BASE_URL).hostname
    if (parsedUrl.hostname !== baseDomain) {
      return false
    }
    
    // Should not have fragment
    if (parsedUrl.hash) {
      return false
    }
    
    return true
  } catch {
    return false
  }
}

/**
 * Extract canonical URL from current request
 */
export function extractCanonicalFromRequest(request: Request): string {
  try {
    const url = new URL(request.url)
    
    return generateCanonicalUrl({
      path: url.pathname,
      params: Object.fromEntries(url.searchParams.entries()),
      removeParams: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref', 'source']
    })
  } catch (error) {
    console.error('Error extracting canonical URL from request:', error)
    return BASE_URL
  }
}

/**
 * Generate canonical link tag for HTML head
 */
export function generateCanonicalLinkTag(url: string): string {
  const validatedUrl = validateCanonicalUrl(url) ? url : BASE_URL
  return `<link rel="canonical" href="${validatedUrl}" />`
}

// Common URL patterns that should be canonicalized
export const CANONICAL_PATTERNS = {
  // Remove tracking parameters
  TRACKING_PARAMS: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref', 'source', 'fbclid', 'gclid'],
  
  // Remove pagination from canonical (use first page)
  PAGINATION_PARAMS: ['page', 'offset', 'limit'],
  
  // Remove sorting parameters (use default sort)
  SORTING_PARAMS: ['sort', 'order', 'sortBy', 'orderBy'],
  
  // Remove view parameters (use default view)
  VIEW_PARAMS: ['view', 'display', 'layout']
} as const

/**
 * Get canonical URL with common parameter removal
 */
export function getCanonicalUrlWithCommonRules(path: string, params?: Record<string, string>): string {
  const removeParams = [
    ...CANONICAL_PATTERNS.TRACKING_PARAMS,
    ...CANONICAL_PATTERNS.PAGINATION_PARAMS,
    ...CANONICAL_PATTERNS.SORTING_PARAMS,
    ...CANONICAL_PATTERNS.VIEW_PARAMS
  ]
  
  return generateCanonicalUrl({
    path,
    params,
    removeParams
  })
}