/**
 * Localized SEO Manager for Bibiere
 * Handles SEO metadata, structured data, and branding across multiple languages
 */

// Local type alias — this is a Vite project, not Next.js
type Metadata = Record<string, unknown>
import { Locale, SUPPORTED_LOCALES } from './i18n'
import { SEOManager, SEOMetadata, ProductData, StructuredDataSchema } from './seo-manager'

export interface LocalizedSEOConfig {
  locale: Locale
  baseUrl: string
  defaultTitle: string
  defaultDescription: string
  siteName: string
  brandName: string
  brandTagline: string
  organizationName: string
  socialHandles: {
    twitter?: string
    instagram?: string
    facebook?: string
  }
}

export interface LocalizedMetadata extends SEOMetadata {
  locale: Locale
  alternateLanguages: Record<string, string>
  localizedBranding: {
    siteName: string
    brandName: string
    tagline: string
  }
}

export interface LocalizedProductData extends ProductData {
  localizedNames: Record<Locale, string>
  localizedDescriptions: Record<Locale, string>
  localizedCategories: Record<Locale, string>
}

export interface TranslationQualityMetrics {
  completeness: number // 0-100%
  consistency: number // 0-100%
  lastUpdated: Date
  missingKeys: string[]
  inconsistentTranslations: string[]
}

export class LocalizedSEOManager {
  private seoManagers: Map<Locale, SEOManager> = new Map()
  private localeConfigs: Map<Locale, LocalizedSEOConfig> = new Map()
  private translationCache: Map<string, Record<Locale, string>> = new Map()
  private qualityMetrics: Map<Locale, TranslationQualityMetrics> = new Map()

  constructor() {
    this.initializeLocaleConfigs()
    this.initializeSEOManagers()
  }

  private initializeLocaleConfigs(): void {
    // English (default)
    this.localeConfigs.set('en', {
      locale: 'en',
      baseUrl: 'https://bibiere.com',
      defaultTitle: 'bibiere - Timeless Luxury Redefined',
      defaultDescription: 'Timeless luxury redefined. Discover bibiere\'s collection of exquisite pieces crafted for the discerning individual.',
      siteName: 'bibiere',
      brandName: 'bibiere',
      brandTagline: 'Timeless Luxury Redefined',
      organizationName: 'bibiere',
      socialHandles: {
        twitter: '@bibiere',
        instagram: '@bibiere',
        facebook: 'bibiere'
      }
    })

    // French
    this.localeConfigs.set('fr', {
      locale: 'fr',
      baseUrl: 'https://bibiere.com/fr',
      defaultTitle: 'bibiere - Luxe intemporel redéfini',
      defaultDescription: 'Luxe intemporel redéfini. Découvrez la collection bibiere de pièces exquises conçues pour l\'individu exigeant.',
      siteName: 'bibiere',
      brandName: 'bibiere',
      brandTagline: 'Luxe intemporel redéfini',
      organizationName: 'bibiere',
      socialHandles: {
        twitter: '@bibiere',
        instagram: '@bibiere',
        facebook: 'bibiere'
      }
    })

    // Spanish
    this.localeConfigs.set('es', {
      locale: 'es',
      baseUrl: 'https://bibiere.com/es',
      defaultTitle: 'bibiere - Lujo atemporal redefinido',
      defaultDescription: 'Lujo atemporal redefinido. Descubre la colección bibiere de piezas exquisitas diseñadas para el individuo exigente.',
      siteName: 'bibiere',
      brandName: 'bibiere',
      brandTagline: 'Lujo atemporal redefinido',
      organizationName: 'bibiere',
      socialHandles: {
        twitter: '@bibiere',
        instagram: '@bibiere',
        facebook: 'bibiere'
      }
    })

    // German
    this.localeConfigs.set('de', {
      locale: 'de',
      baseUrl: 'https://bibiere.com/de',
      defaultTitle: 'bibiere - Zeitloser Luxus neu definiert',
      defaultDescription: 'Zeitloser Luxus neu definiert. Entdecken Sie bibieres Kollektion exquisiter Stücke für den anspruchsvollen Menschen.',
      siteName: 'bibiere',
      brandName: 'bibiere',
      brandTagline: 'Zeitloser Luxus neu definiert',
      organizationName: 'bibiere',
      socialHandles: {
        twitter: '@bibiere',
        instagram: '@bibiere',
        facebook: 'bibiere'
      }
    })

    // Italian
    this.localeConfigs.set('it', {
      locale: 'it',
      baseUrl: 'https://bibiere.com/it',
      defaultTitle: 'bibiere - Lusso senza tempo ridefinito',
      defaultDescription: 'Lusso senza tempo ridefinito. Scopri la collezione bibiere di pezzi squisiti creati per l\'individuo esigente.',
      siteName: 'bibiere',
      brandName: 'bibiere',
      brandTagline: 'Lusso senza tempo ridefinito',
      organizationName: 'bibiere',
      socialHandles: {
        twitter: '@bibiere',
        instagram: '@bibiere',
        facebook: 'bibiere'
      }
    })

    // Japanese
    this.localeConfigs.set('ja', {
      locale: 'ja',
      baseUrl: 'https://bibiere.com/ja',
      defaultTitle: 'bibiere - 再定義された永遠の贅沢',
      defaultDescription: '再定義された永遠の贅沢。目の肥えた個人のために作られた絶妙な作品のbibiereコレクションをご覧ください。',
      siteName: 'bibiere',
      brandName: 'bibiere',
      brandTagline: '再定義された永遠の贅沢',
      organizationName: 'bibiere',
      socialHandles: {
        twitter: '@bibiere',
        instagram: '@bibiere',
        facebook: 'bibiere'
      }
    })

    // Arabic
    this.localeConfigs.set('ar', {
      locale: 'ar',
      baseUrl: 'https://bibiere.com/ar',
      defaultTitle: 'bibiere - الفخامة الخالدة المعاد تعريفها',
      defaultDescription: 'الفخامة الخالدة المعاد تعريفها. اكتشف مجموعة bibiere من القطع الرائعة المصنوعة للفرد المميز.',
      siteName: 'bibiere',
      brandName: 'bibiere',
      brandTagline: 'الفخامة الخالدة المعاد تعريفها',
      organizationName: 'bibiere',
      socialHandles: {
        twitter: '@bibiere',
        instagram: '@bibiere',
        facebook: 'bibiere'
      }
    })

    // Chinese
    this.localeConfigs.set('zh', {
      locale: 'zh',
      baseUrl: 'https://bibiere.com/zh',
      defaultTitle: 'bibiere - 重新定义的永恒奢华',
      defaultDescription: '重新定义的永恒奢华。探索bibiere为挑剔个人精心打造的精美作品系列。',
      siteName: 'bibiere',
      brandName: 'bibiere',
      brandTagline: '重新定义的永恒奢华',
      organizationName: 'bibiere',
      socialHandles: {
        twitter: '@bibiere',
        instagram: '@bibiere',
        facebook: 'bibiere'
      }
    })
  }

  private initializeSEOManagers(): void {
    for (const [locale, config] of Array.from(this.localeConfigs.entries())) {
      this.seoManagers.set(locale, new SEOManager(config.baseUrl))
    }
  }

  // Generate localized metadata with alternate language links
  generateLocalizedMetadata(
    locale: Locale,
    pageData: Partial<SEOMetadata> & { 
      path?: string
      params?: Record<string, string>
      translationKey?: string
    }
  ): Metadata {
    const config = this.localeConfigs.get(locale)
    const seoManager = this.seoManagers.get(locale)
    
    if (!config || !seoManager) {
      throw new Error(`Unsupported locale: ${locale}`)
    }

    // Generate alternate language URLs
    const alternateLanguages = this.generateAlternateLanguageUrls(
      pageData.path || '/',
      pageData.params
    )

    // Get localized branding
    const localizedBranding = {
      siteName: config.siteName,
      brandName: config.brandName,
      tagline: config.brandTagline
    }

    // Merge with localized defaults
    const localizedPageData = {
      ...pageData,
      title: pageData.title || config.defaultTitle,
      description: pageData.description || config.defaultDescription,
      openGraph: {
        title: pageData.openGraph?.title || pageData.title || config.defaultTitle,
        description: pageData.openGraph?.description || pageData.description || config.defaultDescription,
        image: pageData.openGraph?.image || '/images/og-default.jpg',
        url: pageData.openGraph?.url || config.baseUrl,
        type: pageData.openGraph?.type || 'website',
        siteName: config.siteName,
        locale: this.getOpenGraphLocale(locale),
        ...pageData.openGraph
      },
      twitter: {
        card: pageData.twitter?.card || 'summary_large_image',
        title: pageData.twitter?.title || pageData.title || config.defaultTitle,
        description: pageData.twitter?.description || pageData.description || config.defaultDescription,
        image: pageData.twitter?.image || '/images/og-default.jpg',
        site: config.socialHandles.twitter,
        creator: config.socialHandles.twitter,
        ...pageData.twitter
      },
      alternates: {
        canonical: pageData.canonical,
        languages: alternateLanguages
      }
    }

    return seoManager.generateMetadata(localizedPageData)
  }

  // Generate localized product metadata
  generateLocalizedProductMetadata(
    locale: Locale,
    product: LocalizedProductData,
    path: string,
    params?: Record<string, string>
  ): Metadata {
    const config = this.localeConfigs.get(locale)
    const seoManager = this.seoManagers.get(locale)
    
    if (!config || !seoManager) {
      throw new Error(`Unsupported locale: ${locale}`)
    }

    // Get localized product data
    const localizedProduct: ProductData = {
      ...product,
      name: product.localizedNames[locale] || product.name,
      description: product.localizedDescriptions[locale] || product.description,
      category: product.localizedCategories[locale] || product.category
    }

    // Generate localized structured data
    const structuredData = [
      this.generateLocalizedProductStructuredData(localizedProduct, locale),
      this.generateLocalizedBreadcrumbStructuredData(path, localizedProduct.name, locale),
      this.generateLocalizedOrganizationStructuredData(locale)
    ]

    const alternateLanguages = this.generateAlternateLanguageUrls(path, params)

    return seoManager.generateProductMetadata(localizedProduct, path, params)
  }

  // Generate alternate language URLs for hreflang
  private generateAlternateLanguageUrls(
    path: string,
    params?: Record<string, string>
  ): Record<string, string> {
    const alternates: Record<string, string> = {}
    
    for (const [locale, config] of Array.from(this.localeConfigs.entries())) {
      let url = config.baseUrl + path
      
      // Add query parameters if present
      if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams(params)
        url += `?${searchParams.toString()}`
      }
      
      alternates[locale] = url
    }

    // Add x-default for international targeting
    alternates['x-default'] = this.localeConfigs.get('en')!.baseUrl + path

    return alternates
  }

  // Generate localized structured data
  generateLocalizedOrganizationStructuredData(locale: Locale): StructuredDataSchema {
    const config = this.localeConfigs.get(locale)!
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${config.baseUrl}#organization`,
      name: config.organizationName,
      alternateName: config.brandName,
      url: config.baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${config.baseUrl}/logo.png`,
        width: 200,
        height: 60
      },
      description: config.defaultDescription,
      sameAs: Object.values(config.socialHandles).filter(Boolean).map(handle => 
        handle.startsWith('@') ? `https://twitter.com/${handle.slice(1)}` : handle
      ),
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: [locale, 'en']
      }
    }
  }

  generateLocalizedProductStructuredData(
    product: ProductData,
    locale: Locale
  ): StructuredDataSchema {
    const config = this.localeConfigs.get(locale)!
    const localeConfig = SUPPORTED_LOCALES[locale]
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${config.baseUrl}/product/${product.id}#product`,
      name: product.name,
      description: product.description,
      image: product.images.map(img => img.url),
      brand: {
        '@type': 'Brand',
        name: product.brand,
        '@id': `${config.baseUrl}#organization`
      },
      category: product.category,
      offers: {
        '@type': 'Offer',
        price: product.price.toString(),
        priceCurrency: localeConfig.currency,
        availability: product.inStock 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          '@id': `${config.baseUrl}#organization`
        },
        url: `${config.baseUrl}/product/${product.id}`,
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      url: `${config.baseUrl}/product/${product.id}`,
      sku: product.sku,
      gtin: product.gtin,
      mpn: product.mpn
    }
  }

  generateLocalizedBreadcrumbStructuredData(
    path: string,
    currentPageName: string,
    locale: Locale
  ): StructuredDataSchema {
    const config = this.localeConfigs.get(locale)!
    const pathSegments = path.split('/').filter(Boolean)
    
    // Get localized navigation terms
    const navigationTerms = this.getLocalizedNavigationTerms(locale)
    
    const breadcrumbs = [
      { name: navigationTerms.home, url: config.baseUrl }
    ]

    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1
      
      breadcrumbs.push({
        name: isLast ? currentPageName : (navigationTerms[segment] || this.formatSegmentName(segment)),
        url: `${config.baseUrl}${currentPath}`
      })
    })

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: {
          '@type': 'WebPage',
          '@id': crumb.url
        }
      }))
    }
  }

  // Translation management and quality assurance
  validateTranslationCompleteness(locale: Locale): TranslationQualityMetrics {
    const baseLocale: Locale = 'en'
    const metrics: TranslationQualityMetrics = {
      completeness: 0,
      consistency: 0,
      lastUpdated: new Date(),
      missingKeys: [],
      inconsistentTranslations: []
    }

    try {
      // This would typically load from translation files
      // For now, we'll simulate the validation
      const baseTranslations = this.loadTranslations(baseLocale)
      const targetTranslations = this.loadTranslations(locale)

      const allKeys = this.extractAllKeys(baseTranslations)
      const translatedKeys = this.extractAllKeys(targetTranslations)
      
      metrics.missingKeys = allKeys.filter(key => !translatedKeys.includes(key))
      metrics.completeness = ((allKeys.length - metrics.missingKeys.length) / allKeys.length) * 100

      // Check for consistency (placeholder implementation)
      metrics.inconsistentTranslations = this.findInconsistentTranslations(
        baseTranslations,
        targetTranslations
      )
      metrics.consistency = Math.max(0, 100 - (metrics.inconsistentTranslations.length * 5))

      this.qualityMetrics.set(locale, metrics)
    } catch (error) {
      console.error(`Failed to validate translations for ${locale}:`, error)
    }

    return metrics
  }

  // Brand consistency validation
  validateBrandConsistency(locale: Locale): {
    brandNameConsistent: boolean
    taglineTranslated: boolean
    socialHandlesConsistent: boolean
    colorSchemeConsistent: boolean
    typographyConsistent: boolean
  } {
    const config = this.localeConfigs.get(locale)!
    const baseConfig = this.localeConfigs.get('en')!

    return {
      brandNameConsistent: config.brandName === baseConfig.brandName,
      taglineTranslated: config.brandTagline !== baseConfig.brandTagline,
      socialHandlesConsistent: JSON.stringify(config.socialHandles) === JSON.stringify(baseConfig.socialHandles),
      colorSchemeConsistent: true, // Would check CSS variables
      typographyConsistent: true   // Would check font configurations
    }
  }

  // Utility methods
  private getOpenGraphLocale(locale: Locale): string {
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

  private getLocalizedNavigationTerms(locale: Locale): Record<string, string> {
    // This would typically load from translation files
    const terms: Record<Locale, Record<string, string>> = {
      'en': {
        home: 'Home',
        collections: 'Collections',
        products: 'Products',
        product: 'Product',
        journal: 'Journal',
        about: 'About',
        contact: 'Contact'
      },
      'fr': {
        home: 'Accueil',
        collections: 'Collections',
        products: 'Produits',
        product: 'Produit',
        journal: 'Journal',
        about: 'À propos',
        contact: 'Contact'
      },
      'es': {
        home: 'Inicio',
        collections: 'Colecciones',
        products: 'Productos',
        product: 'Producto',
        journal: 'Revista',
        about: 'Acerca de',
        contact: 'Contacto'
      },
      'de': {
        home: 'Startseite',
        collections: 'Kollektionen',
        products: 'Produkte',
        product: 'Produkt',
        journal: 'Journal',
        about: 'Über uns',
        contact: 'Kontakt'
      },
      'it': {
        home: 'Home',
        collections: 'Collezioni',
        products: 'Prodotti',
        product: 'Prodotto',
        journal: 'Rivista',
        about: 'Chi siamo',
        contact: 'Contatti'
      },
      'ja': {
        home: 'ホーム',
        collections: 'コレクション',
        products: '製品',
        product: '製品',
        journal: 'ジャーナル',
        about: '会社概要',
        contact: 'お問い合わせ'
      },
      'ar': {
        home: 'الرئيسية',
        collections: 'المجموعات',
        products: 'المنتجات',
        product: 'المنتج',
        journal: 'المجلة',
        about: 'حول',
        contact: 'اتصل بنا'
      },
      'zh': {
        home: '首页',
        collections: '系列',
        products: '产品',
        product: '产品',
        journal: '杂志',
        about: '关于我们',
        contact: '联系我们'
      }
    }

    return terms[locale] || terms['en']
  }

  private formatSegmentName(segment: string): string {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  private loadTranslations(locale: Locale): Record<string, any> {
    // This would load actual translation files
    // For now, return empty object
    return {}
  }

  private extractAllKeys(translations: Record<string, any>, prefix = ''): string[] {
    const keys: string[] = []
    
    for (const [key, value] of Object.entries(translations)) {
      const fullKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof value === 'object' && value !== null) {
        keys.push(...this.extractAllKeys(value, fullKey))
      } else {
        keys.push(fullKey)
      }
    }
    
    return keys
  }

  private findInconsistentTranslations(
    base: Record<string, any>,
    target: Record<string, any>
  ): string[] {
    // Placeholder implementation for finding inconsistent translations
    // Would check for things like:
    // - Brand name variations
    // - Inconsistent terminology
    // - Missing context
    return []
  }

  // Public API methods
  getSupportedLocales(): Locale[] {
    return Array.from(this.localeConfigs.keys())
  }

  getLocaleConfig(locale: Locale): LocalizedSEOConfig | undefined {
    return this.localeConfigs.get(locale)
  }

  getQualityMetrics(locale: Locale): TranslationQualityMetrics | undefined {
    return this.qualityMetrics.get(locale)
  }

  getAllQualityMetrics(): Map<Locale, TranslationQualityMetrics> {
    return new Map(this.qualityMetrics)
  }
}

// Export singleton instance
export const localizedSEOManager = new LocalizedSEOManager()

// Utility functions for easy integration
export function generateLocalizedPageMetadata(
  locale: Locale,
  title: string,
  description: string,
  path: string,
  options?: {
    keywords?: string[]
    image?: string
    type?: 'website' | 'article'
    params?: Record<string, string>
  }
): Metadata {
  return localizedSEOManager.generateLocalizedMetadata(locale, {
    title,
    description,
    keywords: options?.keywords || [],
    path,
    params: options?.params,
    openGraph: {
      title,
      description,
      image: options?.image || '',
      url: '',
      type: options?.type || 'website',
      siteName: '',
      locale: ''
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: options?.image || ''
    }
  })
}

export function generateLocalizedProductPageMetadata(
  locale: Locale,
  product: LocalizedProductData,
  productId: string,
  params?: Record<string, string>
): Metadata {
  return localizedSEOManager.generateLocalizedProductMetadata(
    locale,
    product,
    `/product/${productId}`,
    params
  )
}