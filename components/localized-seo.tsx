/**
 * Localized SEO Component for Bibiere
 * Handles meta tags, structured data, and SEO optimization with full localization support
 */

import Head from "next/head"
import { Locale, SUPPORTED_LOCALES } from '@/lib/i18n'
import { localizedSEOManager } from '@/lib/localized-seo-manager'
import { getBrandConfig } from '@/lib/localized-branding'
import { StructuredDataSchema } from '@/lib/seo-manager'

interface LocalizedSEOProps {
  locale: Locale
  title?: string
  description?: string
  keywords?: string | string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  product?: {
    id?: string
    name: string
    description: string
    price: number
    originalPrice?: number
    currency?: string
    availability?: 'in_stock' | 'out_of_stock'
    brand?: string
    category?: string
    images?: { src: string; alt: string }[]
    sku?: string
    gtin?: string
    rating?: { value: number; count: number }
    localizedNames?: Record<Locale, string>
    localizedDescriptions?: Record<Locale, string>
    localizedCategories?: Record<Locale, string>
  }
  article?: {
    author: string
    datePublished: string
    dateModified?: string
    wordCount?: number
    tags?: string[]
    section?: string
  }
  collection?: {
    name: string
    description: string
    productCount?: number
  }
  faqs?: Array<{ question: string; answer: string }>
  structuredData?: StructuredDataSchema[]
  canonical?: string
  robots?: string
  noIndex?: boolean
  params?: Record<string, string>
}

export function LocalizedSEO({
  locale,
  title,
  description,
  keywords,
  image,
  url = '/',
  type = 'website',
  product,
  article,
  collection,
  faqs,
  structuredData = [],
  canonical,
  robots,
  noIndex = false,
  params
}: LocalizedSEOProps) {
  const brandConfig = getBrandConfig(locale)
  const localeConfig = SUPPORTED_LOCALES[locale]
  
  // Get localized content from translation files
  const getLocalizedTitle = () => {
    if (title) {
      return title.includes(brandConfig.brandName) ? title : `${title} | ${brandConfig.brandName}`
    }
    return brandConfig.content.tagline
  }

  const getLocalizedDescription = () => {
    return description || brandConfig.content.description
  }

  const getLocalizedKeywords = () => {
    if (keywords) {
      return Array.isArray(keywords) ? keywords.join(', ') : keywords
    }
    return brandConfig.content.keywords.join(', ')
  }

  const fullTitle = getLocalizedTitle()
  const fullDescription = getLocalizedDescription()
  const keywordsString = getLocalizedKeywords()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibiere.com'
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  const fullUrl = `${baseUrl}${localePrefix}${url}`
  const fullImage = image?.startsWith('http') ? image : `${baseUrl}${image || brandConfig.assets.socialImages.default}`
  const canonicalUrl = canonical || fullUrl

  // Generate alternate language URLs
  const alternateLanguages: Record<string, string> = {}
  for (const [altLocale, altConfig] of Object.entries(SUPPORTED_LOCALES)) {
    const altPrefix = altLocale === 'en' ? '' : `/${altLocale}`
    alternateLanguages[altLocale] = `${baseUrl}${altPrefix}${url}`
  }
  alternateLanguages['x-default'] = `${baseUrl}${url}`

  // Generate localized structured data
  const generateLocalizedStructuredData = (): StructuredDataSchema[] => {
    const baseStructuredData: StructuredDataSchema[] = []

    // Organization structured data
    baseStructuredData.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${baseUrl}#organization`,
      name: brandConfig.brandName,
      alternateName: brandConfig.siteName,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}${brandConfig.assets.logo.primary}`,
        width: 200,
        height: 60
      },
      description: brandConfig.content.description,
      sameAs: Object.values(brandConfig.content.socialHandles).filter(Boolean).map(handle => 
        handle.startsWith('@') ? `https://twitter.com/${handle.slice(1)}` : handle
      ),
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: brandConfig.content.contactInfo.email,
        telephone: brandConfig.content.contactInfo.phone,
        availableLanguage: [locale, 'en']
      }
    })

    // Website structured data
    baseStructuredData.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`,
      url: baseUrl,
      name: brandConfig.siteName,
      description: brandConfig.content.description,
      publisher: {
        '@type': 'Organization',
        '@id': `${baseUrl}#organization`
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${baseUrl}${localePrefix}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      },
      inLanguage: locale
    })

    // Product structured data
    if (type === 'product' && product) {
      const localizedName = product.localizedNames?.[locale] || product.name
      const localizedDescription = product.localizedDescriptions?.[locale] || product.description
      const localizedCategory = product.localizedCategories?.[locale] || product.category

      baseStructuredData.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${fullUrl}#product`,
        name: localizedName,
        description: localizedDescription,
        image: product.images?.map(img => img.src.startsWith('http') ? img.src : `${baseUrl}${img.src}`) || [],
        brand: {
          '@type': 'Brand',
          name: product.brand || brandConfig.brandName,
          '@id': `${baseUrl}#organization`
        },
        category: localizedCategory,
        offers: {
          '@type': 'Offer',
          price: product.price.toString(),
          priceCurrency: product.currency || localeConfig.currency,
          availability: product.availability === 'out_of_stock' 
            ? 'https://schema.org/OutOfStock' 
            : 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            '@id': `${baseUrl}#organization`
          },
          url: fullUrl,
          priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        url: fullUrl,
        sku: product.sku,
        gtin: product.gtin,
        mpn: product.sku,
        ...(product.rating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating.value.toString(),
            reviewCount: product.rating.count.toString()
          }
        })
      })

      // Product breadcrumb
      baseStructuredData.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home', // This should be localized
            item: {
              '@type': 'WebPage',
              '@id': `${baseUrl}${localePrefix}`
            }
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: localizedCategory || 'Products',
            item: {
              '@type': 'WebPage',
              '@id': `${baseUrl}${localePrefix}/collections/${localizedCategory?.toLowerCase().replace(/\s+/g, '-') || 'all'}`
            }
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: localizedName,
            item: {
              '@type': 'WebPage',
              '@id': fullUrl
            }
          }
        ]
      })
    }

    // Article structured data
    if (type === 'article' && article) {
      baseStructuredData.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${fullUrl}#article`,
        headline: fullTitle,
        description: fullDescription,
        image: fullImage,
        author: {
          '@type': 'Person',
          name: article.author
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${baseUrl}#organization`,
          name: brandConfig.brandName,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}${brandConfig.assets.logo.primary}`
          }
        },
        datePublished: article.datePublished,
        dateModified: article.dateModified || article.datePublished,
        url: fullUrl,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': fullUrl
        },
        articleSection: article.section,
        keywords: article.tags?.join(', '),
        inLanguage: locale,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${baseUrl}#website`
        },
        ...(article.wordCount && { wordCount: article.wordCount })
      })
    }

    // Collection structured data
    if (collection) {
      baseStructuredData.push({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${fullUrl}#collection`,
        name: collection.name,
        description: collection.description,
        url: fullUrl,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${baseUrl}#website`
        },
        inLanguage: locale
      })
    }

    // FAQ structured data
    if (faqs && faqs.length > 0) {
      baseStructuredData.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${fullUrl}#faq`,
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        })),
        inLanguage: locale
      })
    }

    return [...baseStructuredData, ...structuredData]
  }

  const allStructuredData = generateLocalizedStructuredData()
  const structuredDataJson = JSON.stringify(allStructuredData)

  // Get Open Graph locale
  const getOpenGraphLocale = (locale: Locale): string => {
    const localeMap: Record<Locale, string> = {
      'en': 'en_US',
      'fr': 'fr_FR',
      'es': 'es_ES',
      'de': 'de_DE',
      'it': 'it_IT',
      'ja': 'ja_JP',
      'ar': 'ar_SA',
      'zh': 'zh_CN'
    }
    return localeMap[locale] || 'en_US'
  }

  const ogLocale = getOpenGraphLocale(locale)
  const robotsContent = noIndex ? 'noindex,nofollow' : (robots || 'index,follow')

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content={brandConfig.brandName} />
      <meta name="robots" content={robotsContent} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content={locale} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate Languages */}
      {Object.entries(alternateLanguages).map(([lang, href]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}
      
      {/* Open Graph */}
      <meta property="og:type" content={type === 'article' ? 'article' : 'website'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={brandConfig.siteName} />
      <meta property="og:locale" content={ogLocale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:creator" content={brandConfig.content.socialHandles.twitter || '@bibiere'} />
      <meta name="twitter:site" content={brandConfig.content.socialHandles.twitter || '@bibiere'} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content={brandConfig.colors.primary} />
      <meta name="msapplication-TileColor" content={brandConfig.colors.primary} />
      <meta name="format-detection" content="telephone=no" />
      
      {/* RTL Support */}
      {localeConfig.rtl && <meta name="direction" content="rtl" />}
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredDataJson }}
      />
    </Head>
  )
}

// Specific localized SEO components for different page types
export function LocalizedProductSEO({
  locale,
  product,
  url,
}: {
  locale: Locale
  product: {
    id?: string
    name: string
    description: string
    price: number
    originalPrice?: number
    category?: string
    inStock?: boolean
    images?: { src: string; alt: string }[]
    brand?: string
    sku?: string
    rating?: { value: number; count: number }
    localizedNames?: Record<Locale, string>
    localizedDescriptions?: Record<Locale, string>
    localizedCategories?: Record<Locale, string>
  }
  url: string
}) {
  const brandConfig = getBrandConfig(locale)
  const localizedName = product.localizedNames?.[locale] || product.name
  const localizedDescription = product.localizedDescriptions?.[locale] || product.description
  const localizedCategory = product.localizedCategories?.[locale] || product.category

  const keywords = [
    localizedName,
    localizedCategory || '',
    product.brand || brandConfig.brandName,
    ...brandConfig.content.keywords
  ].filter(Boolean)

  return (
    <LocalizedSEO
      locale={locale}
      title={`${localizedName} - ${brandConfig.content.tagline}`}
      description={localizedDescription}
      keywords={keywords}
      image={product.images?.[0]?.src}
      url={url}
      type="product"
      product={{
        ...product,
        availability: product.inStock !== false ? 'in_stock' : 'out_of_stock'
      }}
    />
  )
}

export function LocalizedCategorySEO({
  locale,
  category,
  description,
  url,
  productCount,
}: {
  locale: Locale
  category: string
  description: string
  url: string
  productCount?: number
}) {
  const brandConfig = getBrandConfig(locale)
  
  const keywords = [
    category,
    ...brandConfig.content.keywords,
    `${category.toLowerCase()} collection`
  ]

  const enhancedDescription = productCount 
    ? `${description} ${productCount} pieces available.`
    : description

  return (
    <LocalizedSEO
      locale={locale}
      title={`${category} Collection - ${brandConfig.brandName}`}
      description={enhancedDescription}
      keywords={keywords}
      url={url}
      type="website"
      collection={{
        name: `${category} Collection`,
        description: enhancedDescription,
        productCount
      }}
    />
  )
}

export function LocalizedArticleSEO({
  locale,
  article,
  url,
}: {
  locale: Locale
  article: {
    title: string
    description: string
    author: string
    datePublished: string
    dateModified?: string
    image?: string
    wordCount?: number
    tags?: string[]
    section?: string
  }
  url: string
}) {
  const brandConfig = getBrandConfig(locale)
  
  const keywords = [
    brandConfig.brandName,
    ...brandConfig.content.keywords,
    'fashion journal',
    'style guide',
    ...(article.tags || [])
  ]

  return (
    <LocalizedSEO
      locale={locale}
      title={`${article.title} | ${brandConfig.brandName} Journal`}
      description={article.description}
      keywords={keywords}
      image={article.image}
      url={url}
      type="article"
      article={article}
    />
  )
}

export function LocalizedFAQSEO({
  locale,
  title,
  description,
  url,
  faqs,
}: {
  locale: Locale
  title: string
  description: string
  url: string
  faqs: Array<{ question: string; answer: string }>
}) {
  const brandConfig = getBrandConfig(locale)
  
  const keywords = [
    'FAQ',
    'help',
    'support',
    brandConfig.brandName,
    ...brandConfig.content.keywords
  ]

  return (
    <LocalizedSEO
      locale={locale}
      title={`${title} | ${brandConfig.brandName}`}
      description={description}
      keywords={keywords}
      url={url}
      type="website"
      faqs={faqs}
    />
  )
}

// Export the original SEO component for backward compatibility
export { SEO } from './seo'