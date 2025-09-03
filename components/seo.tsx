import Head from "next/head"
import { StructuredDataSchema } from '@/lib/seo-manager'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string | string[]
  image?: string
  url?: string
  type?: "website" | "article" | "product"
  price?: number
  currency?: string
  availability?: "in stock" | "out of stock"
  brand?: string
  category?: string
  structuredData?: StructuredDataSchema[]
  canonical?: string
  robots?: string
  alternateLanguages?: Record<string, string>
}

export function SEO({
  title = "bibiere - Timeless Luxury Redefined",
  description = "Timeless luxury redefined. Discover bibiere's collection of exquisite pieces crafted for the discerning individual.",
  keywords = "bibiere, timeless luxury, elegant fashion, sophisticated style, premium craftsmanship",
  image = "/og-image.jpg",
  url,
  type = "website",
  price,
  currency = "USD",
  availability,
  brand = "bibiere",
  category,
  structuredData = [],
  canonical,
  robots = "index, follow",
  alternateLanguages,
}: SEOProps) {
  const fullTitle = title.includes("bibiere") ? title : `${title} | bibiere`
  const fullUrl = url ? `https://bibiere.com${url}` : "https://bibiere.com"
  const fullImage = image.startsWith("http") ? image : `https://bibiere.com${image}`
  const keywordsString = Array.isArray(keywords) ? keywords.join(", ") : keywords
  const canonicalUrl = canonical || fullUrl

  // Default structured data
  const defaultStructuredData: StructuredDataSchema = {
    "@context": "https://schema.org",
    "@type": type === "product" ? "Product" : "WebSite",
    name: fullTitle,
    description,
    url: fullUrl,
    image: fullImage,
    ...(type === "website" && {
      publisher: {
        "@type": "Organization",
        name: "bibiere",
        logo: {
          "@type": "ImageObject",
          url: "https://bibiere.com/logo.png",
        },
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://bibiere.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    }),
    ...(type === "product" && {
      brand: {
        "@type": "Brand",
        name: brand,
      },
      ...(price && {
        offers: {
          "@type": "Offer",
          price: price.toString(),
          priceCurrency: currency,
          availability: availability === "in stock" 
            ? "https://schema.org/InStock" 
            : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: "bibiere",
          },
        },
      }),
      ...(category && {
        category: category,
      }),
    }),
  }

  // Combine default structured data with additional schemas
  const allStructuredData = [defaultStructuredData, ...structuredData]
  const structuredDataJson = JSON.stringify(allStructuredData)

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content="bibiere" />
      <meta name="robots" content={robots} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate Languages */}
      {alternateLanguages && Object.entries(alternateLanguages).map(([lang, href]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="bibiere" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:creator" content="@bibiere" />
      <meta name="twitter:site" content="@bibiere" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#8B1538" />
      <meta name="msapplication-TileColor" content="#8B1538" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredDataJson }}
      />
    </Head>
  )
}

// Specific SEO components for different page types
export function ProductSEO({
  product,
  url,
}: {
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
  }
  url: string
}) {
  // Generate enhanced product structured data
  const productStructuredData: StructuredDataSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.map(img => img.src) || [],
    brand: {
      "@type": "Brand",
      name: product.brand || "bibiere"
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price.toString(),
      priceCurrency: "USD",
      availability: product.inStock !== false 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "bibiere"
      },
      url: `https://bibiere.com${url}`,
      ...(product.originalPrice && product.originalPrice > product.price && {
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })
    },
    ...(product.sku && { sku: product.sku }),
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating.value.toString(),
        reviewCount: product.rating.count.toString()
      }
    })
  }

  // Generate breadcrumb structured data
  const breadcrumbStructuredData: StructuredDataSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://bibiere.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category || "Products",
        item: `https://bibiere.com/collections/${product.category?.toLowerCase().replace(/\s+/g, '-') || 'all'}`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://bibiere.com${url}`
      }
    ]
  }

  const keywords = [
    product.name,
    product.category || '',
    product.brand || 'bibiere',
    'luxury fashion',
    'premium clothing',
    'designer fashion'
  ].filter(Boolean)

  return (
    <SEO
      title={`${product.name} - Premium Fashion`}
      description={product.description}
      keywords={keywords}
      image={product.images?.[0]?.src}
      url={url}
      type="product"
      price={product.price}
      availability={product.inStock !== false ? "in stock" : "out of stock"}
      category={product.category}
      brand={product.brand}
      structuredData={[productStructuredData, breadcrumbStructuredData]}
    />
  )
}

export function CategorySEO({
  category,
  description,
  url,
  productCount,
}: {
  category: string
  description: string
  url: string
  productCount?: number
}) {
  // Generate collection structured data
  const collectionStructuredData: StructuredDataSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category} Collection`,
    description: productCount 
      ? `${description} Discover ${productCount} exquisite pieces in our ${category.toLowerCase()} collection.`
      : description,
    url: `https://bibiere.com${url}`,
    isPartOf: {
      "@type": "WebSite",
      name: "bibiere",
      url: "https://bibiere.com"
    }
  }

  // Generate breadcrumb structured data
  const breadcrumbStructuredData: StructuredDataSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://bibiere.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Collections",
        item: "https://bibiere.com/collections"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category,
        item: `https://bibiere.com${url}`
      }
    ]
  }

  const keywords = [
    category,
    'luxury fashion',
    'bibiere',
    'premium clothing',
    `designer ${category.toLowerCase()}`,
    'timeless style',
    'sophisticated fashion'
  ]

  const enhancedDescription = productCount 
    ? `${description} Discover ${productCount} exquisite pieces in our ${category.toLowerCase()} collection.`
    : description

  return (
    <SEO
      title={`${category} Collection - Luxury Fashion`}
      description={enhancedDescription}
      keywords={keywords}
      url={url}
      type="website"
      structuredData={[collectionStructuredData, breadcrumbStructuredData]}
    />
  )
}

// New SEO components for additional page types
export function ArticleSEO({
  article,
  url,
}: {
  article: {
    title: string
    description: string
    author: string
    datePublished: string
    dateModified?: string
    image?: string
    wordCount?: number
    tags?: string[]
  }
  url: string
}) {
  const articleStructuredData: StructuredDataSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image || "https://bibiere.com/og-image.jpg",
    author: {
      "@type": "Person",
      name: article.author
    },
    publisher: {
      "@type": "Organization",
      name: "bibiere",
      logo: {
        "@type": "ImageObject",
        url: "https://bibiere.com/logo.png"
      }
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    url: `https://bibiere.com${url}`,
    ...(article.wordCount && { wordCount: article.wordCount })
  }

  const keywords = [
    'bibiere',
    'luxury fashion',
    'fashion journal',
    'style guide',
    ...(article.tags || [])
  ]

  return (
    <SEO
      title={article.title}
      description={article.description}
      keywords={keywords}
      image={article.image}
      url={url}
      type="article"
      structuredData={[articleStructuredData]}
    />
  )
}

export function FAQSEO({
  title,
  description,
  url,
  faqs,
}: {
  title: string
  description: string
  url: string
  faqs: Array<{ question: string; answer: string }>
}) {
  const faqStructuredData: StructuredDataSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  }

  return (
    <SEO
      title={title}
      description={description}
      keywords={['FAQ', 'frequently asked questions', 'bibiere', 'luxury fashion', 'help', 'support']}
      url={url}
      type="website"
      structuredData={[faqStructuredData]}
    />
  )
}