import { Metadata } from 'next'
import { 
  generateCanonicalUrl, 
  getProductCanonicalUrl, 
  getCollectionCanonicalUrl, 
  getJournalCanonicalUrl, 
  getSearchCanonicalUrl, 
  getStaticPageCanonicalUrl,
  validateCanonicalUrl 
} from './canonical-url'

// Core interfaces for SEO metadata
export interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  openGraph: OpenGraphData
  twitter: TwitterCardData
  structuredData: StructuredDataSchema[]
  canonical?: string
  robots?: string
  alternates?: AlternateLanguages
}

export interface OpenGraphData {
  title: string
  description: string
  image: string
  url: string
  type: 'website' | 'article' | 'product'
  siteName: string
  locale: string
  images?: OpenGraphImage[]
}

export interface OpenGraphImage {
  url: string
  width?: number
  height?: number
  alt?: string
  type?: string
}

export interface TwitterCardData {
  card: 'summary' | 'summary_large_image' | 'app' | 'player'
  title: string
  description: string
  image: string
  creator?: string
  site?: string
}

export interface StructuredDataSchema {
  '@context': string
  '@type': string
  [key: string]: any
}

export interface AlternateLanguages {
  canonical?: string
  languages?: Record<string, string>
}

// Product-specific interfaces
export interface ProductData {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  category: string
  brand: string
  inStock: boolean
  images: ProductImage[]
  sku?: string
  gtin?: string
  mpn?: string
  condition?: 'new' | 'used' | 'refurbished'
  availability?: 'in_stock' | 'out_of_stock' | 'preorder' | 'backorder'
  rating?: {
    value: number
    count: number
  }
}

export interface ProductImage {
  url: string
  alt: string
  width?: number
  height?: number
}

// Organization data
export interface OrganizationData {
  name: string
  url: string
  logo: string
  description: string
  contactPoint?: ContactPoint[]
  sameAs?: string[]
  address?: Address
}

export interface ContactPoint {
  '@type': 'ContactPoint'
  telephone: string
  contactType: string
  availableLanguage?: string[]
}

export interface Address {
  '@type': 'PostalAddress'
  streetAddress: string
  addressLocality: string
  addressRegion: string
  postalCode: string
  addressCountry: string
}

// SEO Manager class
export class SEOManager {
  private readonly defaultConfig: Partial<SEOMetadata>
  private readonly baseUrl: string
  private readonly organizationData: OrganizationData

  constructor(baseUrl: string = 'https://bibiere.com') {
    this.baseUrl = baseUrl
    this.organizationData = {
      name: 'bibiere',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description: 'Timeless luxury redefined. Discover bibiere\'s collection of exquisite pieces crafted for the discerning individual.',
      sameAs: [
        'https://www.instagram.com/bibiere',
        'https://www.facebook.com/bibiere',
        'https://twitter.com/bibiere'
      ]
    }

    this.defaultConfig = {
      title: 'bibiere - Timeless Luxury Redefined',
      description: 'Timeless luxury redefined. Discover bibiere\'s collection of exquisite pieces crafted for the discerning individual.',
      keywords: ['bibiere', 'timeless luxury', 'elegant fashion', 'sophisticated style', 'premium craftsmanship'],
      openGraph: {
        title: 'bibiere - Timeless Luxury Redefined',
        description: 'Timeless luxury redefined. Discover bibiere\'s collection of exquisite pieces crafted for the discerning individual.',
        image: `${baseUrl}/og-image.jpg`,
        url: baseUrl,
        type: 'website',
        siteName: 'bibiere',
        locale: 'en_US'
      },
      twitter: {
        card: 'summary_large_image',
        title: 'bibiere - Timeless Luxury Redefined',
        description: 'Timeless luxury redefined. Discover bibiere\'s collection of exquisite pieces crafted for the discerning individual.',
        image: `${baseUrl}/og-image.jpg`,
        creator: '@bibiere',
        site: '@bibiere'
      },
      robots: 'index, follow',
      structuredData: []
    }
  }

  // Generate metadata for Next.js 14 App Router
  generateMetadata(pageData: Partial<SEOMetadata> & { path?: string; params?: Record<string, string> }): Metadata {
    const merged = this.mergeWithDefaults(pageData)
    const fullUrl = pageData.path ? `${this.baseUrl}${pageData.path}` : this.baseUrl
    
    // Generate canonical URL using the canonical URL utility
    let canonicalUrl = merged.canonical
    if (!canonicalUrl && pageData.path) {
      canonicalUrl = getStaticPageCanonicalUrl(pageData.path)
    }
    if (!canonicalUrl) {
      canonicalUrl = fullUrl
    }
    
    // Validate canonical URL
    if (!validateCanonicalUrl(canonicalUrl)) {
      console.warn(`Invalid canonical URL generated: ${canonicalUrl}, falling back to: ${fullUrl}`)
      canonicalUrl = fullUrl
    }

    return {
      title: merged.title,
      description: merged.description,
      keywords: merged.keywords,
      authors: [{ name: 'bibiere' }],
      creator: 'bibiere',
      publisher: 'bibiere',
      robots: merged.robots,
      alternates: {
        canonical: canonicalUrl,
        ...merged.alternates?.languages && {
          languages: merged.alternates.languages
        }
      },
      openGraph: {
        title: merged.openGraph.title,
        description: merged.openGraph.description,
        url: canonicalUrl, // Use canonical URL for Open Graph
        siteName: merged.openGraph.siteName,
        images: merged.openGraph.images || [
          {
            url: merged.openGraph.image,
            width: 1200,
            height: 630,
            alt: merged.openGraph.title
          }
        ],
        locale: merged.openGraph.locale,
        type: merged.openGraph.type === 'product' ? 'website' : merged.openGraph.type
      },
      twitter: {
        card: merged.twitter.card,
        title: merged.twitter.title,
        description: merged.twitter.description,
        creator: merged.twitter.creator,
        site: merged.twitter.site,
        images: [merged.twitter.image]
      },
      other: {
        'theme-color': '#8B1538',
        'msapplication-TileColor': '#8B1538'
      }
    }
  }

  // Generate product-specific metadata
  generateProductMetadata(product: ProductData, path: string, params?: Record<string, string>): Metadata {
    const title = `${product.name} - Premium Fashion | bibiere`
    const description = this.truncateDescription(product.description, 160)
    const keywords = [
      product.name,
      product.category,
      product.brand,
      'luxury fashion',
      'bibiere',
      'premium clothing'
    ]

    // Generate canonical URL for product
    const canonicalUrl = getProductCanonicalUrl(product.id, params)

    const structuredData = [
      this.generateProductStructuredData(product),
      this.generateBreadcrumbStructuredData(path, product.name)
    ]

    return this.generateMetadata({
      title,
      description,
      keywords,
      path,
      params,
      canonical: canonicalUrl,
      openGraph: {
        title,
        description,
        image: product.images[0]?.url || `${this.baseUrl}/og-image.jpg`,
        url: canonicalUrl,
        type: 'product',
        siteName: 'bibiere',
        locale: 'en_US',
        images: product.images.map(img => ({
          url: img.url,
          width: img.width || 800,
          height: img.height || 800,
          alt: img.alt
        }))
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        image: product.images[0]?.url || `${this.baseUrl}/og-image.jpg`,
        creator: '@bibiere',
        site: '@bibiere'
      },
      structuredData
    })
  }

  // Generate category/collection metadata
  generateCategoryMetadata(
    category: string,
    description: string,
    path: string,
    productCount?: number,
    params?: Record<string, string>
  ): Metadata {
    const title = `${category} Collection - Luxury Fashion | bibiere`
    const enhancedDescription = productCount 
      ? `${description} Discover ${productCount} exquisite pieces in our ${category.toLowerCase()} collection.`
      : description

    const keywords = [
      category,
      'luxury fashion',
      'bibiere',
      'premium clothing',
      `designer ${category.toLowerCase()}`,
      'timeless style'
    ]

    // Extract collection slug from path
    const collectionSlug = path.split('/').pop() || category.toLowerCase()
    const canonicalUrl = getCollectionCanonicalUrl(collectionSlug, params)

    const structuredData = [
      this.generateCollectionStructuredData(category, enhancedDescription, path),
      this.generateBreadcrumbStructuredData(path, category)
    ]

    return this.generateMetadata({
      title,
      description: enhancedDescription,
      keywords,
      path,
      params,
      canonical: canonicalUrl,
      structuredData
    })
  }

  // Generate organization structured data
  generateOrganizationStructuredData(): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.organizationData.name,
      url: this.organizationData.url,
      logo: {
        '@type': 'ImageObject',
        url: this.organizationData.logo
      },
      description: this.organizationData.description,
      sameAs: this.organizationData.sameAs
    }
  }

  // Generate website structured data
  generateWebsiteStructuredData(): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.organizationData.name,
      url: this.organizationData.url,
      description: this.organizationData.description,
      publisher: {
        '@type': 'Organization',
        name: this.organizationData.name,
        logo: {
          '@type': 'ImageObject',
          url: this.organizationData.logo
        }
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.baseUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }
  }

  // Generate product structured data
  generateProductStructuredData(product: ProductData): StructuredDataSchema {
    const offers: any = {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: product.currency,
      availability: this.mapAvailability(product.availability || (product.inStock ? 'in_stock' : 'out_of_stock')),
      seller: {
        '@type': 'Organization',
        name: this.organizationData.name
      },
      url: `${this.baseUrl}/product/${product.id}`
    }

    if (product.originalPrice && product.originalPrice > product.price) {
      offers.priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    }

    const structuredData: StructuredDataSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images.map(img => img.url),
      brand: {
        '@type': 'Brand',
        name: product.brand
      },
      category: product.category,
      offers,
      url: `${this.baseUrl}/product/${product.id}`
    }

    // Add optional fields if available
    if (product.sku) structuredData.sku = product.sku
    if (product.gtin) structuredData.gtin = product.gtin
    if (product.mpn) structuredData.mpn = product.mpn
    if (product.condition) structuredData.itemCondition = `https://schema.org/${product.condition === 'new' ? 'NewCondition' : 'UsedCondition'}`

    // Add rating if available
    if (product.rating) {
      structuredData.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: product.rating.value.toString(),
        reviewCount: product.rating.count.toString()
      }
    }

    return structuredData
  }

  // Generate collection structured data
  generateCollectionStructuredData(name: string, description: string, path: string): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${name} Collection`,
      description,
      url: `${this.baseUrl}${path}`,
      isPartOf: {
        '@type': 'WebSite',
        name: this.organizationData.name,
        url: this.organizationData.url
      }
    }
  }

  // Generate journal/blog metadata
  generateJournalMetadata(
    title: string,
    description: string,
    slug: string,
    publishDate?: Date,
    author?: string,
    image?: string,
    params?: Record<string, string>
  ): Metadata {
    const fullTitle = `${title} | bibiere Journal`
    const keywords = [
      'bibiere journal',
      'luxury fashion blog',
      'style guide',
      'fashion insights',
      'timeless style',
      title.toLowerCase()
    ]

    const canonicalUrl = getJournalCanonicalUrl(slug, params)
    const path = `/journal/${slug}`

    const structuredData = [
      this.generateArticleStructuredData(title, description, canonicalUrl, publishDate, author, image),
      this.generateBreadcrumbStructuredData(path, title)
    ]

    return this.generateMetadata({
      title: fullTitle,
      description,
      keywords,
      path,
      params,
      canonical: canonicalUrl,
      openGraph: {
        title: fullTitle,
        description,
        image: image || `${this.baseUrl}/og-image.jpg`,
        url: canonicalUrl,
        type: 'article',
        siteName: 'bibiere',
        locale: 'en_US'
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description,
        image: image || `${this.baseUrl}/og-image.jpg`,
        creator: '@bibiere',
        site: '@bibiere'
      },
      structuredData
    })
  }

  // Generate search results metadata
  generateSearchMetadata(
    query?: string,
    filters?: Record<string, string>,
    resultCount?: number
  ): Metadata {
    const title = query 
      ? `Search Results for "${query}" | bibiere`
      : 'Search | bibiere'
    
    const description = query
      ? `Found ${resultCount || 0} results for "${query}". Discover luxury fashion pieces at bibiere.`
      : 'Search our collection of luxury fashion pieces. Find the perfect item for your wardrobe.'

    const keywords = [
      'search',
      'bibiere',
      'luxury fashion',
      'find products',
      ...(query ? [query] : [])
    ]

    const canonicalUrl = getSearchCanonicalUrl(query, filters)

    return this.generateMetadata({
      title,
      description,
      keywords,
      path: '/search',
      canonical: canonicalUrl,
      robots: 'noindex, follow', // Don't index search result pages
      openGraph: {
        title,
        description,
        image: `${this.baseUrl}/og-image.jpg`,
        url: canonicalUrl,
        type: 'website',
        siteName: 'bibiere',
        locale: 'en_US'
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        image: `${this.baseUrl}/og-image.jpg`,
        creator: '@bibiere',
        site: '@bibiere'
      }
    })
  }

  // Generate article structured data for journal posts
  generateArticleStructuredData(
    title: string,
    description: string,
    url: string,
    publishDate?: Date,
    author?: string,
    image?: string
  ): StructuredDataSchema {
    const structuredData: StructuredDataSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      url,
      publisher: {
        '@type': 'Organization',
        name: this.organizationData.name,
        logo: {
          '@type': 'ImageObject',
          url: this.organizationData.logo
        }
      }
    }

    if (publishDate) {
      structuredData.datePublished = publishDate.toISOString()
      structuredData.dateModified = publishDate.toISOString()
    }

    if (author) {
      structuredData.author = {
        '@type': 'Person',
        name: author
      }
    }

    if (image) {
      structuredData.image = {
        '@type': 'ImageObject',
        url: image
      }
    }

    return structuredData
  }

  // Generate breadcrumb structured data
  generateBreadcrumbStructuredData(path: string, currentPageName: string): StructuredDataSchema {
    const pathSegments = path.split('/').filter(Boolean)
    const breadcrumbs = [
      { name: 'Home', url: this.baseUrl }
    ]

    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1
      breadcrumbs.push({
        name: isLast ? currentPageName : this.formatSegmentName(segment),
        url: `${this.baseUrl}${currentPath}`
      })
    })

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    }
  }

  // Helper methods
  private mergeWithDefaults(pageData: Partial<SEOMetadata>): SEOMetadata {
    return {
      ...this.defaultConfig,
      ...pageData,
      openGraph: {
        ...this.defaultConfig.openGraph!,
        ...pageData.openGraph
      },
      twitter: {
        ...this.defaultConfig.twitter!,
        ...pageData.twitter
      },
      keywords: pageData.keywords || this.defaultConfig.keywords!,
      structuredData: [
        ...this.defaultConfig.structuredData!,
        ...(pageData.structuredData || [])
      ]
    } as SEOMetadata
  }

  private truncateDescription(description: string, maxLength: number): string {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength - 3).trim() + '...'
  }

  private mapAvailability(availability: string): string {
    const availabilityMap: Record<string, string> = {
      'in_stock': 'https://schema.org/InStock',
      'out_of_stock': 'https://schema.org/OutOfStock',
      'preorder': 'https://schema.org/PreOrder',
      'backorder': 'https://schema.org/BackOrder'
    }
    return availabilityMap[availability] || 'https://schema.org/OutOfStock'
  }

  private formatSegmentName(segment: string): string {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
}

// Export singleton instance
export const seoManager = new SEOManager()

// Utility functions for common use cases
export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  options?: {
    keywords?: string[]
    image?: string
    type?: 'website' | 'article'
    params?: Record<string, string>
    canonical?: string
  }
): Metadata {
  const canonicalUrl = options?.canonical || getStaticPageCanonicalUrl(path)
  
  return seoManager.generateMetadata({
    title: `${title} | bibiere`,
    description,
    keywords: options?.keywords || [],
    path,
    params: options?.params,
    canonical: canonicalUrl,
    openGraph: {
      title: `${title} | bibiere`,
      description,
      image: options?.image || `${seoManager['baseUrl']}/og-image.jpg`,
      url: canonicalUrl,
      type: options?.type || 'website',
      siteName: 'bibiere',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | bibiere`,
      description,
      image: options?.image || `${seoManager['baseUrl']}/og-image.jpg`,
      creator: '@bibiere',
      site: '@bibiere'
    }
  })
}

// Utility function for product pages
export function generateProductPageMetadata(
  product: ProductData,
  productId: string,
  params?: Record<string, string>
): Metadata {
  return seoManager.generateProductMetadata(product, `/product/${productId}`, params)
}

// Utility function for collection pages
export function generateCollectionPageMetadata(
  collectionName: string,
  description: string,
  collectionSlug: string,
  productCount?: number,
  params?: Record<string, string>
): Metadata {
  return seoManager.generateCategoryMetadata(
    collectionName,
    description,
    `/collections/${collectionSlug}`,
    productCount,
    params
  )
}

// Utility function for journal pages
export function generateJournalPageMetadata(
  title: string,
  description: string,
  slug: string,
  publishDate?: Date,
  author?: string,
  image?: string,
  params?: Record<string, string>
): Metadata {
  return seoManager.generateJournalMetadata(title, description, slug, publishDate, author, image, params)
}

// Utility function for search pages
export function generateSearchPageMetadata(
  query?: string,
  filters?: Record<string, string>,
  resultCount?: number
): Metadata {
  return seoManager.generateSearchMetadata(query, filters, resultCount)
}