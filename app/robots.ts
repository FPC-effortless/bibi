import { MetadataRoute } from 'next'

// Base URL configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/account/',
          '/checkout/',
          '/cart/',
          '/wishlist/',
          '/auth/',
          '/_next/',
          '/private/',
          '/temp/',
          '/test/',
          '/offline/',
          '/order/',
          '*.json',
          '*.xml',
          '/search?*',
          '/filter?*'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/account/',
          '/checkout/',
          '/cart/',
          '/wishlist/',
          '/auth/',
          '/_next/',
          '/private/',
          '/temp/',
          '/test/',
          '/offline/',
          '/order/'
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/account/',
          '/checkout/',
          '/cart/',
          '/wishlist/',
          '/auth/',
          '/_next/',
          '/private/',
          '/temp/',
          '/test/',
          '/offline/',
          '/order/'
        ],
      },
      {
        userAgent: 'facebookexternalhit',
        allow: [
          '/',
          '/product/',
          '/collections/',
          '/journal/',
          '/about',
          '/lookbook'
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/account/',
          '/checkout/',
          '/cart/',
          '/wishlist/',
          '/auth/'
        ],
      }
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}

// Alternative robots configuration for different environments
export function generateRobotsForEnvironment(environment: 'production' | 'staging' | 'development'): MetadataRoute.Robots {
  const baseConfig = robots()

  switch (environment) {
    case 'production':
      return baseConfig

    case 'staging':
      return {
        rules: [
          {
            userAgent: '*',
            disallow: '/',
          }
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
      }

    case 'development':
      return {
        rules: [
          {
            userAgent: '*',
            disallow: '/',
          }
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
      }

    default:
      return baseConfig
  }
}

// Function to validate robots.txt configuration
export function validateRobotsConfig(config: MetadataRoute.Robots): boolean {
  try {
    // Check if rules exist
    if (!config.rules || !Array.isArray(config.rules) || config.rules.length === 0) {
      return false
    }

    // Validate each rule
    for (const rule of config.rules) {
      if (!rule.userAgent) {
        return false
      }

      // Check if at least allow or disallow is specified
      if (!rule.allow && !rule.disallow) {
        return false
      }
    }

    // Validate sitemap URL if provided
    if (config.sitemap) {
      try {
        // Handle both string and array cases
        const sitemapUrl = Array.isArray(config.sitemap) ? config.sitemap[0] : config.sitemap
        if (sitemapUrl) {
          new URL(sitemapUrl)
        }
      } catch {
        return false
      }
    }

    return true
  } catch {
    return false
  }
}