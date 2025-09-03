// Comprehensive sitemap generation utility
// This module provides utilities for generating dynamic sitemaps with proper SEO optimization

import { MetadataRoute } from 'next'

// Base URL configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'

// Interface for sitemap entry configuration
export interface SitemapEntryConfig {
  url: string
  lastModified?: string | Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
  alternates?: {
    languages?: Record<string, string>
  }
}

// Interface for dynamic content
export interface DynamicContent {
  id: string
  slug?: string
  lastModified: string | Date
  priority?: number
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
}

// Static pages configuration with enhanced metadata
export const STATIC_PAGES_CONFIG = [
  {
    path: '',
    changeFrequency: 'daily' as const,
    priority: 1.0,
    description: 'Homepage - Luxury fashion collection'
  },
  {
    path: '/about',
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    description: 'About bibiere - Our story and values'
  },
  {
    path: '/collections',
    changeFrequency: 'weekly' as const,
    priority: 0.9,
    description: 'Fashion collections overview'
  },
  {
    path: '/collections/essentials',
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    description: 'Essential pieces collection'
  },
  {
    path: '/collections/evening',
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    description: 'Evening wear collection'
  },
  {
    path: '/collections/heritage',
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    description: 'Heritage collection'
  },
  {
    path: '/collections/dresses',
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    description: 'Dresses collection'
  },
  {
    path: '/collections/new-arrivals',
    changeFrequency: 'daily' as const,
    priority: 0.9,
    description: 'New arrivals collection'
  },
  {
    path: '/journal',
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    description: 'Fashion journal and style guides'
  },
  {
    path: '/lookbook',
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    description: 'Fashion lookbook and inspiration'
  },
  {
    path: '/heritage',
    changeFrequency: 'monthly' as const,
    priority: 0.6,
    description: 'Brand heritage and craftsmanship'
  },
  {
    path: '/sustainability',
    changeFrequency: 'monthly' as const,
    priority: 0.6,
    description: 'Sustainability and ethical fashion'
  },
  {
    path: '/care-instructions',
    changeFrequency: 'yearly' as const,
    priority: 0.5,
    description: 'Garment care instructions'
  },
  {
    path: '/size-guide',
    changeFrequency: 'yearly' as const,
    priority: 0.5,
    description: 'Size guide and fitting information'
  },
  {
    path: '/shipping-returns',
    changeFrequency: 'monthly' as const,
    priority: 0.5,
    description: 'Shipping and returns policy'
  },
  {
    path: '/returns',
    changeFrequency: 'monthly' as const,
    priority: 0.5,
    description: 'Returns policy'
  },
  {
    path: '/contact',
    changeFrequency: 'monthly' as const,
    priority: 0.5,
    description: 'Contact information and support'
  },
  {
    path: '/faq',
    changeFrequency: 'monthly' as const,
    priority: 0.5,
    description: 'Frequently asked questions'
  },
  {
    path: '/privacy',
    changeFrequency: 'yearly' as const,
    priority: 0.3,
    description: 'Privacy policy'
  },
  {
    path: '/careers',
    changeFrequency: 'monthly' as const,
    priority: 0.4,
    description: 'Career opportunities'
  },
  {
    path: '/press',
    changeFrequency: 'monthly' as const,
    priority: 0.4,
    description: 'Press releases and media'
  },
  {
    path: '/track-order',
    changeFrequency: 'monthly' as const,
    priority: 0.5,
    description: 'Order tracking'
  },
  {
    path: '/search',
    changeFrequency: 'weekly' as const,
    priority: 0.6,
    description: 'Product search'
  }
] as const

// Sitemap generator class
export class SitemapGenerator {
  private baseUrl: string
  private currentDate: string

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl
    this.currentDate = new Date().toISOString()
  }

  /**
   * Generate complete sitemap with all content types
   */
  async generateCompleteSitemap(): Promise<MetadataRoute.Sitemap> {
    try {
      const [
        staticEntries,
        productEntries,
        collectionEntries,
        journalEntries,
        accountEntries
      ] = await Promise.all([
        this.generateStaticPageEntries(),
        this.generateProductEntries(),
        this.generateCollectionEntries(),
        this.generateJournalEntries(),
        this.generateAccountEntries()
      ])

      // Combine all entries and sort by priority (highest first)
      const allEntries = [
        ...staticEntries,
        ...productEntries,
        ...collectionEntries,
        ...journalEntries,
        ...accountEntries
      ]

      // Sort by priority (descending) and then by URL (ascending)
      return allEntries.sort((a, b) => {
        const priorityDiff = (b.priority || 0) - (a.priority || 0)
        if (priorityDiff !== 0) return priorityDiff
        return a.url.localeCompare(b.url)
      })
    } catch (error) {
      console.error('Error generating complete sitemap:', error)
      // Fallback to static pages only
      return this.generateStaticPageEntries()
    }
  }

  /**
   * Generate static page entries
   */
  generateStaticPageEntries(): MetadataRoute.Sitemap {
    return STATIC_PAGES_CONFIG.map(page => ({
      url: `${this.baseUrl}${page.path}`,
      lastModified: this.currentDate,
      changeFrequency: page.changeFrequency,
      priority: page.priority
    }))
  }

  /**
   * Generate product page entries
   */
  async generateProductEntries(): Promise<MetadataRoute.Sitemap> {
    try {
      // In a real application, fetch from database
      const products = await this.fetchProducts()
      
      return products.map(product => ({
        url: `${this.baseUrl}/product/${product.id}`,
        lastModified: product.lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.8
      }))
    } catch (error) {
      console.error('Error generating product entries:', error)
      return []
    }
  }

  /**
   * Generate collection page entries
   */
  async generateCollectionEntries(): Promise<MetadataRoute.Sitemap> {
    try {
      const collections = await this.fetchCollections()
      
      return collections.map(collection => ({
        url: `${this.baseUrl}/collections/${collection.slug || collection.id}`,
        lastModified: collection.lastModified,
        changeFrequency: 'daily' as const,
        priority: collection.priority || 0.9
      }))
    } catch (error) {
      console.error('Error generating collection entries:', error)
      return []
    }
  }

  /**
   * Generate journal/blog page entries
   */
  async generateJournalEntries(): Promise<MetadataRoute.Sitemap> {
    try {
      const journalPosts = await this.fetchJournalPosts()
      
      return journalPosts.map(post => ({
        url: `${this.baseUrl}/journal/${post.slug || post.id}`,
        lastModified: post.lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.6
      }))
    } catch (error) {
      console.error('Error generating journal entries:', error)
      return []
    }
  }

  /**
   * Generate account-related public page entries
   */
  generateAccountEntries(): MetadataRoute.Sitemap {
    const accountPages = [
      {
        path: '/auth/login',
        changeFrequency: 'monthly' as const,
        priority: 0.4
      },
      {
        path: '/auth/register',
        changeFrequency: 'monthly' as const,
        priority: 0.4
      }
    ]

    return accountPages.map(page => ({
      url: `${this.baseUrl}${page.path}`,
      lastModified: this.currentDate,
      changeFrequency: page.changeFrequency,
      priority: page.priority
    }))
  }

  /**
   * Generate sitemap index for large sites
   */
  async generateSitemapIndex(): Promise<MetadataRoute.Sitemap> {
    const sitemapSections = [
      {
        url: `${this.baseUrl}/sitemap-static.xml`,
        lastModified: this.currentDate
      },
      {
        url: `${this.baseUrl}/sitemap-products.xml`,
        lastModified: this.currentDate
      },
      {
        url: `${this.baseUrl}/sitemap-collections.xml`,
        lastModified: this.currentDate
      },
      {
        url: `${this.baseUrl}/sitemap-journal.xml`,
        lastModified: this.currentDate
      }
    ]

    return sitemapSections
  }

  /**
   * Validate sitemap entry
   */
  validateSitemapEntry(entry: SitemapEntryConfig): boolean {
    try {
      // Validate URL format
      new URL(entry.url)
      
      // Validate priority range
      if (entry.priority !== undefined && (entry.priority < 0 || entry.priority > 1)) {
        return false
      }
      
      // Validate lastModified format
      if (entry.lastModified && isNaN(Date.parse(entry.lastModified.toString()))) {
        return false
      }
      
      return true
    } catch {
      return false
    }
  }

  /**
   * Filter and validate sitemap entries
   */
  filterValidEntries(entries: SitemapEntryConfig[]): MetadataRoute.Sitemap {
    return entries
      .filter(entry => this.validateSitemapEntry(entry))
      .map(entry => ({
        url: entry.url,
        lastModified: entry.lastModified,
        changeFrequency: entry.changeFrequency,
        priority: entry.priority
      }))
  }

  // Mock data fetching methods (replace with real database calls)
  private async fetchProducts(): Promise<DynamicContent[]> {
    // Mock product data - replace with actual database query
    return [
      {
        id: 'elegant-silk-dress',
        lastModified: '2024-01-15',
        priority: 0.8
      },
      {
        id: 'luxury-cashmere-scarf',
        lastModified: '2024-01-10',
        priority: 0.8
      },
      {
        id: 'premium-wool-coat',
        lastModified: '2024-01-12',
        priority: 0.8
      },
      {
        id: 'designer-handbag',
        lastModified: '2024-01-08',
        priority: 0.8
      },
      {
        id: 'tailored-blazer',
        lastModified: '2024-01-14',
        priority: 0.8
      }
    ]
  }

  private async fetchCollections(): Promise<DynamicContent[]> {
    // Mock collection data - replace with actual database query
    return [
      {
        id: 'new-arrivals',
        slug: 'new-arrivals',
        lastModified: this.currentDate,
        priority: 0.9
      },
      {
        id: 'sale',
        slug: 'sale',
        lastModified: this.currentDate,
        priority: 0.8
      },
      {
        id: 'seasonal',
        slug: 'seasonal',
        lastModified: this.currentDate,
        priority: 0.7
      }
    ]
  }

  private async fetchJournalPosts(): Promise<DynamicContent[]> {
    // Mock journal data - replace with actual CMS query
    return [
      {
        id: 'timeless-elegance-guide',
        slug: 'timeless-elegance-guide',
        lastModified: '2024-01-20',
        priority: 0.6
      },
      {
        id: 'sustainable-luxury-fashion',
        slug: 'sustainable-luxury-fashion',
        lastModified: '2024-01-18',
        priority: 0.6
      },
      {
        id: 'styling-essentials-collection',
        slug: 'styling-essentials-collection',
        lastModified: '2024-01-16',
        priority: 0.6
      }
    ]
  }
}

// Export singleton instance
export const sitemapGenerator = new SitemapGenerator()

// Utility functions
export async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  return sitemapGenerator.generateCompleteSitemap()
}

export function generateStaticSitemap(): MetadataRoute.Sitemap {
  return sitemapGenerator.generateStaticPageEntries()
}

export async function generateProductSitemap(): Promise<MetadataRoute.Sitemap> {
  return sitemapGenerator.generateProductEntries()
}

export async function generateCollectionSitemap(): Promise<MetadataRoute.Sitemap> {
  return sitemapGenerator.generateCollectionEntries()
}

export async function generateJournalSitemap(): Promise<MetadataRoute.Sitemap> {
  return sitemapGenerator.generateJournalEntries()
}