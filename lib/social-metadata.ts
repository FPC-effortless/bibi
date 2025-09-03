import { OpenGraphType } from 'next/dist/lib/metadata/types/opengraph-types'

// Open Graph metadata interfaces
export interface OpenGraphMetadata {
  title: string
  description: string
  url: string
  siteName: string
  images: OpenGraphImage[]
  locale: string
  type: OpenGraphType
  modifiedTime?: string
  publishedTime?: string
  authors?: string[]
  section?: string
  tags?: string[]
}

export interface OpenGraphImage {
  url: string
  secureUrl?: string
  alt: string
  type?: string
  width?: number
  height?: number
}

// Twitter Card metadata interfaces
export interface TwitterMetadata {
  card: 'summary' | 'summary_large_image' | 'app' | 'player'
  site?: string
  creator?: string
  title: string
  description: string
  images: TwitterImage[]
  app?: TwitterApp
}

export interface TwitterImage {
  url: string
  alt: string
  width?: number
  height?: number
}

export interface TwitterApp {
  id: {
    iphone?: string
    ipad?: string
    googleplay?: string
  }
  url?: {
    iphone?: string
    ipad?: string
    googleplay?: string
  }
  name?: {
    iphone?: string
    ipad?: string
    googleplay?: string
  }
}

// Social Media Metadata Generator
export class SocialMetadataGenerator {
  private readonly baseUrl: string
  private readonly defaultImage: string
  private readonly siteName: string
  private readonly twitterHandle: string

  constructor(
    baseUrl: string = 'https://bibiere.com',
    siteName: string = 'bibiere',
    twitterHandle: string = '@bibiere'
  ) {
    this.baseUrl = baseUrl
    this.siteName = siteName
    this.twitterHandle = twitterHandle
    this.defaultImage = `${baseUrl}/og-image.jpg`
  }

  // Generate Open Graph metadata
  generateOpenGraph(data: {
    title: string
    description: string
    path: string
    image?: string
    type?: OpenGraphType
    publishedTime?: string
    modifiedTime?: string
    authors?: string[]
    section?: string
    tags?: string[]
    images?: Array<{
      url: string
      alt: string
      width?: number
      height?: number
    }>
  }): OpenGraphMetadata {
    const fullUrl = `${this.baseUrl}${data.path}`
    const primaryImage = data.image || this.defaultImage

    // Ensure image URLs are absolute
    const processedImages: OpenGraphImage[] = data.images?.map(img => ({
      url: img.url.startsWith('http') ? img.url : `${this.baseUrl}${img.url}`,
      secureUrl: img.url.startsWith('https') ? img.url : `${this.baseUrl}${img.url}`,
      alt: img.alt,
      width: img.width || 1200,
      height: img.height || 630,
      type: 'image/jpeg'
    })) || [
      {
        url: primaryImage.startsWith('http') ? primaryImage : `${this.baseUrl}${primaryImage}`,
        secureUrl: primaryImage.startsWith('https') ? primaryImage : `${this.baseUrl}${primaryImage}`,
        alt: data.title,
        width: 1200,
        height: 630,
        type: 'image/jpeg'
      }
    ]

    return {
      title: data.title,
      description: this.truncateDescription(data.description, 300),
      url: fullUrl,
      siteName: this.siteName,
      images: processedImages,
      locale: 'en_US',
      type: data.type || 'website',
      ...(data.publishedTime && { publishedTime: data.publishedTime }),
      ...(data.modifiedTime && { modifiedTime: data.modifiedTime }),
      ...(data.authors && { authors: data.authors }),
      ...(data.section && { section: data.section }),
      ...(data.tags && { tags: data.tags })
    }
  }

  // Generate Twitter Card metadata
  generateTwitterCard(data: {
    title: string
    description: string
    image?: string
    card?: 'summary' | 'summary_large_image' | 'app' | 'player'
    creator?: string
    images?: Array<{
      url: string
      alt: string
      width?: number
      height?: number
    }>
    app?: TwitterApp
  }): TwitterMetadata {
    const primaryImage = data.image || this.defaultImage
    const cardType = data.card || (data.images?.length || primaryImage ? 'summary_large_image' : 'summary')

    const processedImages: TwitterImage[] = data.images?.map(img => ({
      url: img.url.startsWith('http') ? img.url : `${this.baseUrl}${img.url}`,
      alt: img.alt,
      width: img.width,
      height: img.height
    })) || [
      {
        url: primaryImage.startsWith('http') ? primaryImage : `${this.baseUrl}${primaryImage}`,
        alt: data.title
      }
    ]

    return {
      card: cardType,
      site: this.twitterHandle,
      creator: data.creator || this.twitterHandle,
      title: this.truncateDescription(data.title, 70),
      description: this.truncateDescription(data.description, 200),
      images: processedImages,
      ...(data.app && { app: data.app })
    }
  }

  // Generate product-specific social metadata
  generateProductSocialMetadata(product: {
    name: string
    description: string
    price: number
    currency: string
    images: Array<{
      url: string
      alt: string
      width?: number
      height?: number
    }>
    category: string
    brand: string
    inStock: boolean
    path: string
  }) {
    const title = `${product.name} - ${product.brand}`
    const description = `${product.description} Price: ${product.currency} ${product.price}. ${product.inStock ? 'In Stock' : 'Out of Stock'}.`

    const openGraph = this.generateOpenGraph({
      title,
      description,
      path: product.path,
      type: 'website',
      images: product.images,
      tags: [product.category, product.brand, 'luxury fashion']
    })

    const twitter = this.generateTwitterCard({
      title,
      description,
      card: 'summary_large_image',
      images: product.images
    })

    return { openGraph, twitter }
  }

  // Generate collection-specific social metadata
  generateCollectionSocialMetadata(collection: {
    name: string
    description: string
    productCount: number
    image?: string
    path: string
  }) {
    const title = `${collection.name} Collection - Luxury Fashion`
    const description = `${collection.description} Discover ${collection.productCount} exquisite pieces in our ${collection.name.toLowerCase()} collection.`

    const openGraph = this.generateOpenGraph({
      title,
      description,
      path: collection.path,
      type: 'website',
      image: collection.image,
      section: 'Collections',
      tags: [collection.name, 'luxury fashion', 'designer clothing']
    })

    const twitter = this.generateTwitterCard({
      title,
      description,
      image: collection.image,
      card: 'summary_large_image'
    })

    return { openGraph, twitter }
  }

  // Generate article-specific social metadata
  generateArticleSocialMetadata(article: {
    title: string
    description: string
    author: string
    publishedTime: string
    modifiedTime?: string
    image?: string
    path: string
    tags?: string[]
  }) {
    const openGraph = this.generateOpenGraph({
      title: article.title,
      description: article.description,
      path: article.path,
      type: 'article',
      image: article.image,
      publishedTime: article.publishedTime,
      modifiedTime: article.modifiedTime,
      authors: [article.author],
      section: 'Journal',
      tags: article.tags
    })

    const twitter = this.generateTwitterCard({
      title: article.title,
      description: article.description,
      image: article.image,
      creator: `@${article.author.toLowerCase().replace(/\s+/g, '')}`,
      card: 'summary_large_image'
    })

    return { openGraph, twitter }
  }

  // Generate event-specific social metadata
  generateEventSocialMetadata(event: {
    name: string
    description: string
    startDate: string
    endDate?: string
    location: string
    image?: string
    path: string
  }) {
    const title = `${event.name} - Fashion Event`
    const description = `${event.description} ${event.location}. ${new Date(event.startDate).toLocaleDateString()}.`

    const openGraph = this.generateOpenGraph({
      title,
      description,
      path: event.path,
      type: 'website',
      image: event.image,
      section: 'Events'
    })

    const twitter = this.generateTwitterCard({
      title,
      description,
      image: event.image,
      card: 'summary_large_image'
    })

    return { openGraph, twitter }
  }

  // Generate video-specific social metadata
  generateVideoSocialMetadata(video: {
    title: string
    description: string
    thumbnailUrl: string
    duration?: string
    path: string
  }) {
    const openGraph = this.generateOpenGraph({
      title: video.title,
      description: video.description,
      path: video.path,
      type: 'video.other',
      image: video.thumbnailUrl
    })

    const twitter = this.generateTwitterCard({
      title: video.title,
      description: video.description,
      image: video.thumbnailUrl,
      card: 'summary_large_image'
    })

    return { openGraph, twitter }
  }

  // Helper method to truncate descriptions
  private truncateDescription(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3).trim() + '...'
  }

  // Generate social sharing URLs
  generateSharingUrls(url: string, title: string, description?: string) {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const encodedDescription = description ? encodeURIComponent(description) : ''

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=bibiere`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
    }
  }

  // Generate rich snippets for social platforms
  generateRichSnippets(data: {
    title: string
    description: string
    image: string
    price?: number
    currency?: string
    availability?: string
    rating?: number
    reviewCount?: number
  }) {
    return {
      // Facebook Rich Snippets
      facebook: {
        'og:rich_attachment': 'true',
        'product:price:amount': data.price?.toString(),
        'product:price:currency': data.currency,
        'product:availability': data.availability,
        ...(data.rating && {
          'og:rating': data.rating.toString(),
          'og:rating_count': data.reviewCount?.toString()
        })
      },
      
      // Twitter Rich Snippets
      twitter: {
        'twitter:label1': data.price ? 'Price' : undefined,
        'twitter:data1': data.price ? `${data.currency} ${data.price}` : undefined,
        'twitter:label2': data.availability ? 'Availability' : undefined,
        'twitter:data2': data.availability
      }
    }
  }
}

// Export singleton instance
export const socialMetadataGenerator = new SocialMetadataGenerator()

// Utility functions
export function generateSocialMetaTags(openGraph: OpenGraphMetadata, twitter: TwitterMetadata) {
  const tags: Record<string, string> = {}

  // Open Graph tags
  tags['og:title'] = openGraph.title
  tags['og:description'] = openGraph.description
  tags['og:url'] = openGraph.url
  tags['og:site_name'] = openGraph.siteName
  tags['og:locale'] = openGraph.locale
  tags['og:type'] = openGraph.type

  // Open Graph images
  openGraph.images.forEach((image, index) => {
    const suffix = index === 0 ? '' : `:${index}`
    tags[`og:image${suffix}`] = image.url
    if (image.secureUrl) tags[`og:image:secure_url${suffix}`] = image.secureUrl
    if (image.alt) tags[`og:image:alt${suffix}`] = image.alt
    if (image.width) tags[`og:image:width${suffix}`] = image.width.toString()
    if (image.height) tags[`og:image:height${suffix}`] = image.height.toString()
    if (image.type) tags[`og:image:type${suffix}`] = image.type
  })

  // Optional Open Graph fields
  if (openGraph.publishedTime) tags['article:published_time'] = openGraph.publishedTime
  if (openGraph.modifiedTime) tags['article:modified_time'] = openGraph.modifiedTime
  if (openGraph.authors) {
    openGraph.authors.forEach((author, index) => {
      tags[`article:author${index === 0 ? '' : `:${index}`}`] = author
    })
  }
  if (openGraph.section) tags['article:section'] = openGraph.section
  if (openGraph.tags) {
    openGraph.tags.forEach((tag, index) => {
      tags[`article:tag${index === 0 ? '' : `:${index}`}`] = tag
    })
  }

  // Twitter Card tags
  tags['twitter:card'] = twitter.card
  tags['twitter:title'] = twitter.title
  tags['twitter:description'] = twitter.description
  if (twitter.site) tags['twitter:site'] = twitter.site
  if (twitter.creator) tags['twitter:creator'] = twitter.creator

  // Twitter images
  twitter.images.forEach((image, index) => {
    const suffix = index === 0 ? '' : `:${index}`
    tags[`twitter:image${suffix}`] = image.url
    if (image.alt) tags[`twitter:image:alt${suffix}`] = image.alt
  })

  return tags
}