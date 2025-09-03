import { MetadataRoute } from 'next'
import { generateSitemap } from '../lib/sitemap-generator'

// Define the structure for sitemap entries (kept for backward compatibility)
interface SitemapEntry {
  url: string
  lastModified?: string | Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

// Base URL configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'

// Static pages configuration
const staticPages = [
  {
    path: '',
    changeFrequency: 'daily' as const,
    priority: 1.0
  },
  {
    path: '/about',
    changeFrequency: 'monthly' as const,
    priority: 0.8
  },
  {
    path: '/collections',
    changeFrequency: 'weekly' as const,
    priority: 0.9
  },
  {
    path: '/collections/essentials',
    changeFrequency: 'weekly' as const,
    priority: 0.8
  },
  {
    path: '/collections/evening',
    changeFrequency: 'weekly' as const,
    priority: 0.8
  },
  {
    path: '/collections/heritage',
    changeFrequency: 'weekly' as const,
    priority: 0.8
  },
  {
    path: '/collections/dresses',
    changeFrequency: 'weekly' as const,
    priority: 0.8
  },
  {
    path: '/collections/new-arrivals',
    changeFrequency: 'daily' as const,
    priority: 0.9
  },
  {
    path: '/journal',
    changeFrequency: 'weekly' as const,
    priority: 0.7
  },
  {
    path: '/lookbook',
    changeFrequency: 'monthly' as const,
    priority: 0.7
  },
  {
    path: '/heritage',
    changeFrequency: 'monthly' as const,
    priority: 0.6
  },
  {
    path: '/sustainability',
    changeFrequency: 'monthly' as const,
    priority: 0.6
  },
  {
    path: '/care-instructions',
    changeFrequency: 'yearly' as const,
    priority: 0.5
  },
  {
    path: '/size-guide',
    changeFrequency: 'yearly' as const,
    priority: 0.5
  },
  {
    path: '/shipping-returns',
    changeFrequency: 'monthly' as const,
    priority: 0.5
  },
  {
    path: '/returns',
    changeFrequency: 'monthly' as const,
    priority: 0.5
  },
  {
    path: '/contact',
    changeFrequency: 'monthly' as const,
    priority: 0.5
  },
  {
    path: '/faq',
    changeFrequency: 'monthly' as const,
    priority: 0.5
  },
  {
    path: '/privacy',
    changeFrequency: 'yearly' as const,
    priority: 0.3
  },
  {
    path: '/careers',
    changeFrequency: 'monthly' as const,
    priority: 0.4
  },
  {
    path: '/press',
    changeFrequency: 'monthly' as const,
    priority: 0.4
  },
  {
    path: '/track-order',
    changeFrequency: 'monthly' as const,
    priority: 0.5
  },
  {
    path: '/search',
    changeFrequency: 'weekly' as const,
    priority: 0.6
  }
]

// Mock product data - In a real application, this would come from your database
const mockProducts = [
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

// Mock journal/blog posts - In a real application, this would come from your CMS
const mockJournalPosts = [
  {
    slug: 'timeless-elegance-guide',
    lastModified: '2024-01-20',
    priority: 0.6
  },
  {
    slug: 'sustainable-luxury-fashion',
    lastModified: '2024-01-18',
    priority: 0.6
  },
  {
    slug: 'styling-essentials-collection',
    lastModified: '2024-01-16',
    priority: 0.6
  }
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Use the comprehensive sitemap generator
    return await generateSitemap()
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Fallback to static pages only
    const currentDate = new Date().toISOString()
    return staticPages.map(page => ({
      url: `${BASE_URL}${page.path}`,
      lastModified: currentDate,
      changeFrequency: page.changeFrequency,
      priority: page.priority
    }))
  }
}

// Helper function to generate product sitemap entries
async function generateProductSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    // In a real application, you would fetch products from your database/API
    // const products = await fetchProductsFromDatabase()
    
    // For now, using mock data with enhanced structure
    const products = mockProducts

    return products.map(product => ({
      url: `${BASE_URL}/product/${product.id}`,
      lastModified: product.lastModified,
      changeFrequency: 'weekly' as const,
      priority: product.priority
    }))
  } catch (error) {
    console.error('Error generating product sitemap entries:', error)
    return []
  }
}

// Helper function to generate journal sitemap entries
async function generateJournalSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    // In a real application, you would fetch journal posts from your CMS/database
    // const journalPosts = await fetchJournalPostsFromCMS()
    
    const journalPosts = mockJournalPosts

    return journalPosts.map(post => ({
      url: `${BASE_URL}/journal/${post.slug}`,
      lastModified: post.lastModified,
      changeFrequency: 'monthly' as const,
      priority: post.priority
    }))
  } catch (error) {
    console.error('Error generating journal sitemap entries:', error)
    return []
  }
}

// Helper function to generate collection sitemap entries
async function generateCollectionSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    // Additional collection pages that might be dynamically generated
    const dynamicCollections = [
      {
        slug: 'new-arrivals',
        lastModified: new Date().toISOString(),
        priority: 0.9
      },
      {
        slug: 'sale',
        lastModified: new Date().toISOString(),
        priority: 0.8
      }
    ]

    return dynamicCollections.map(collection => ({
      url: `${BASE_URL}/collections/${collection.slug}`,
      lastModified: collection.lastModified,
      changeFrequency: 'daily' as const,
      priority: collection.priority
    }))
  } catch (error) {
    console.error('Error generating collection sitemap entries:', error)
    return []
  }
}

// Helper function to generate account-related public pages
function generateAccountSitemapEntries(): MetadataRoute.Sitemap {
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
    },
    {
      path: '/track-order',
      changeFrequency: 'monthly' as const,
      priority: 0.5
    }
  ]

  return accountPages.map(page => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: page.changeFrequency,
    priority: page.priority
  }))
}

// Function to validate sitemap entries
function validateSitemapEntry(entry: SitemapEntry): boolean {
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

// Alternative function for generating sitemap with external data (kept for backward compatibility)
export async function generateSitemapWithData(): Promise<MetadataRoute.Sitemap> {
  return sitemap()
}