import { StructuredDataSchema, ProductData, OrganizationData } from './seo-manager'

// Structured Data Generator for JSON-LD
export class StructuredDataGenerator {
  private baseUrl: string

  constructor(baseUrl: string = 'https://bibiere.com') {
    this.baseUrl = baseUrl
  }

  // Generate FAQ structured data
  generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  }

  // Generate article structured data (for blog posts, journal entries)
  generateArticleStructuredData(article: {
    headline: string
    description: string
    author: string
    datePublished: string
    dateModified?: string
    image: string
    url: string
    wordCount?: number
  }): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.headline,
      description: article.description,
      image: article.image,
      author: {
        '@type': 'Person',
        name: article.author
      },
      publisher: {
        '@type': 'Organization',
        name: 'bibiere',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`
        }
      },
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished,
      url: article.url,
      ...(article.wordCount && { wordCount: article.wordCount })
    }
  }

  // Generate local business structured data
  generateLocalBusinessStructuredData(business: {
    name: string
    description: string
    address: {
      streetAddress: string
      addressLocality: string
      addressRegion: string
      postalCode: string
      addressCountry: string
    }
    telephone?: string
    email?: string
    openingHours?: string[]
    priceRange?: string
  }): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'ClothingStore',
      name: business.name,
      description: business.description,
      url: this.baseUrl,
      address: {
        '@type': 'PostalAddress',
        ...business.address
      },
      ...(business.telephone && { telephone: business.telephone }),
      ...(business.email && { email: business.email }),
      ...(business.openingHours && { openingHours: business.openingHours }),
      ...(business.priceRange && { priceRange: business.priceRange }),
      sameAs: [
        'https://www.instagram.com/bibiere',
        'https://www.facebook.com/bibiere',
        'https://twitter.com/bibiere'
      ]
    }
  }

  // Generate review structured data
  generateReviewStructuredData(review: {
    itemReviewed: string
    reviewRating: number
    author: string
    datePublished: string
    reviewBody: string
  }): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'Product',
        name: review.itemReviewed
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.reviewRating.toString(),
        bestRating: '5'
      },
      author: {
        '@type': 'Person',
        name: review.author
      },
      datePublished: review.datePublished,
      reviewBody: review.reviewBody
    }
  }

  // Generate offer structured data for sales/promotions
  generateOfferStructuredData(offer: {
    name: string
    description: string
    price: number
    currency: string
    validFrom: string
    validThrough: string
    availability: string
    category?: string
  }): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Offer',
      name: offer.name,
      description: offer.description,
      price: offer.price.toString(),
      priceCurrency: offer.currency,
      validFrom: offer.validFrom,
      validThrough: offer.validThrough,
      availability: offer.availability,
      seller: {
        '@type': 'Organization',
        name: 'bibiere'
      },
      ...(offer.category && { category: offer.category })
    }
  }

  // Generate event structured data (for fashion shows, launches)
  generateEventStructuredData(event: {
    name: string
    description: string
    startDate: string
    endDate?: string
    location: {
      name: string
      address: string
    }
    image?: string
    offers?: {
      price: number
      currency: string
      availability: string
    }
  }): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.name,
      description: event.description,
      startDate: event.startDate,
      ...(event.endDate && { endDate: event.endDate }),
      location: {
        '@type': 'Place',
        name: event.location.name,
        address: event.location.address
      },
      organizer: {
        '@type': 'Organization',
        name: 'bibiere',
        url: this.baseUrl
      },
      ...(event.image && { image: event.image }),
      ...(event.offers && {
        offers: {
          '@type': 'Offer',
          price: event.offers.price.toString(),
          priceCurrency: event.offers.currency,
          availability: event.offers.availability
        }
      })
    }
  }

  // Generate video structured data
  generateVideoStructuredData(video: {
    name: string
    description: string
    thumbnailUrl: string
    uploadDate: string
    duration?: string
    contentUrl?: string
    embedUrl?: string
  }): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: video.name,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      uploadDate: video.uploadDate,
      ...(video.duration && { duration: video.duration }),
      ...(video.contentUrl && { contentUrl: video.contentUrl }),
      ...(video.embedUrl && { embedUrl: video.embedUrl }),
      publisher: {
        '@type': 'Organization',
        name: 'bibiere',
        logo: {
          '@type': 'ImageObject',
          url: `${this.baseUrl}/logo.png`
        }
      }
    }
  }

  // Generate size guide structured data
  generateSizeGuideStructuredData(sizeGuide: {
    name: string
    description: string
    sizes: Array<{
      name: string
      measurements: Record<string, string>
    }>
  }): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'SizeSpecification',
      name: sizeGuide.name,
      description: sizeGuide.description,
      hasMeasurement: sizeGuide.sizes.map(size => ({
        '@type': 'QuantitativeValue',
        name: size.name,
        additionalProperty: Object.entries(size.measurements).map(([key, value]) => ({
          '@type': 'PropertyValue',
          name: key,
          value: value
        }))
      }))
    }
  }

  // Generate care instructions structured data
  generateCareInstructionsStructuredData(instructions: {
    name: string
    description: string
    instructions: string[]
    materials: string[]
  }): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: instructions.name,
      description: instructions.description,
      supply: instructions.materials.map(material => ({
        '@type': 'HowToSupply',
        name: material
      })),
      step: instructions.instructions.map((instruction, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        text: instruction
      }))
    }
  }

  // Generate collection/category listing structured data
  generateItemListStructuredData(items: {
    name: string
    description: string
    url: string
    numberOfItems: number
    itemListElement: Array<{
      name: string
      url: string
      image?: string
      price?: number
      currency?: string
    }>
  }): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: items.name,
      description: items.description,
      url: items.url,
      numberOfItems: items.numberOfItems,
      itemListElement: items.itemListElement.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: item.url,
        ...(item.image && { image: item.image }),
        ...(item.price && item.currency && {
          offers: {
            '@type': 'Offer',
            price: item.price.toString(),
            priceCurrency: item.currency
          }
        })
      }))
    }
  }
}

// Export singleton instance
export const structuredDataGenerator = new StructuredDataGenerator()

// Utility function to combine multiple structured data schemas
export function combineStructuredData(schemas: StructuredDataSchema[]): string {
  return JSON.stringify(schemas.length === 1 ? schemas[0] : schemas)
}

// Utility function to validate structured data (basic validation)
export function validateStructuredData(schema: StructuredDataSchema): boolean {
  try {
    // Basic validation - check required fields
    if (!schema['@context'] || !schema['@type']) {
      return false
    }
    
    // Validate JSON structure
    JSON.stringify(schema)
    return true
  } catch {
    return false
  }
}