/**
 * Internationalization (i18n) System for Bibiere
 * Supports multiple languages with dynamic loading and RTL support
 */

export type Locale = 'en' | 'fr' | 'es' | 'de' | 'it' | 'ja' | 'ar' | 'zh'

export interface TranslationKey {
  [key: string]: string | TranslationKey
}

export interface LocaleConfig {
  code: Locale
  name: string
  nativeName: string
  flag: string
  rtl: boolean
  currency: string
  dateFormat: string
  numberFormat: Intl.NumberFormatOptions
}

export const SUPPORTED_LOCALES: Record<Locale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false,
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    numberFormat: { style: 'currency', currency: 'USD' }
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false,
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: { style: 'currency', currency: 'EUR' }
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    rtl: false,
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: { style: 'currency', currency: 'EUR' }
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    rtl: false,
    currency: 'EUR',
    dateFormat: 'dd.MM.yyyy',
    numberFormat: { style: 'currency', currency: 'EUR' }
  },
  it: {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    rtl: false,
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: { style: 'currency', currency: 'EUR' }
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    rtl: false,
    currency: 'JPY',
    dateFormat: 'yyyy/MM/dd',
    numberFormat: { style: 'currency', currency: 'JPY' }
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true,
    currency: 'USD',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: { style: 'currency', currency: 'USD' }
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    rtl: false,
    currency: 'CNY',
    dateFormat: 'yyyy/MM/dd',
    numberFormat: { style: 'currency', currency: 'CNY' }
  }
}

class I18nManager {
  private currentLocale: Locale = 'en'
  private translations: Map<Locale, TranslationKey> = new Map()
  private loadedLocales: Set<Locale> = new Set()
  private fallbackLocale: Locale = 'en'

  constructor() {
    this.detectLocale()
    this.loadTranslations(this.currentLocale)
  }

  // Locale detection and management
  private detectLocale(): void {
    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    const urlLocale = urlParams.get('lang') as Locale
    if (urlLocale && this.isValidLocale(urlLocale)) {
      this.currentLocale = urlLocale
      return
    }

    // Check localStorage
    const savedLocale = localStorage.getItem('bibiere-locale') as Locale
    if (savedLocale && this.isValidLocale(savedLocale)) {
      this.currentLocale = savedLocale
      return
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0] as Locale
    if (this.isValidLocale(browserLang)) {
      this.currentLocale = browserLang
      return
    }

    // Default to English
    this.currentLocale = 'en'
  }

  private isValidLocale(locale: string): locale is Locale {
    return Object.keys(SUPPORTED_LOCALES).includes(locale)
  }

  // Translation loading
  private async loadTranslations(locale: Locale): Promise<void> {
    if (this.loadedLocales.has(locale)) {
      return
    }

    try {
      const translations = await import(`../locales/${locale}.json`)
      this.translations.set(locale, translations.default)
      this.loadedLocales.add(locale)
    } catch (error) {
      console.warn(`Failed to load translations for ${locale}:`, error)
      
      // Load fallback if not already loaded
      if (locale !== this.fallbackLocale && !this.loadedLocales.has(this.fallbackLocale)) {
        await this.loadTranslations(this.fallbackLocale)
      }
    }
  }

  // Public API
  async setLocale(locale: Locale): Promise<void> {
    if (!this.isValidLocale(locale)) {
      console.warn(`Invalid locale: ${locale}`)
      return
    }

    await this.loadTranslations(locale)
    this.currentLocale = locale
    localStorage.setItem('bibiere-locale', locale)
    
    // Update document attributes
    document.documentElement.lang = locale
    document.documentElement.dir = SUPPORTED_LOCALES[locale].rtl ? 'rtl' : 'ltr'
    
    // Dispatch locale change event
    window.dispatchEvent(new CustomEvent('localechange', { detail: { locale } }))
  }

  getCurrentLocale(): Locale {
    return this.currentLocale
  }

  getCurrentLocaleConfig(): LocaleConfig {
    return SUPPORTED_LOCALES[this.currentLocale]
  }

  getSupportedLocales(): LocaleConfig[] {
    return Object.values(SUPPORTED_LOCALES)
  }

  // Translation functions
  t(key: string, params?: Record<string, string | number>): string {
    const translation = this.getTranslation(key, this.currentLocale) || 
                       this.getTranslation(key, this.fallbackLocale) || 
                       key

    return this.interpolate(translation, params)
  }

  private getTranslation(key: string, locale: Locale): string | null {
    const translations = this.translations.get(locale)
    if (!translations) return null

    const keys = key.split('.')
    let current: any = translations

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        return null
      }
    }

    return typeof current === 'string' ? current : null
  }

  private interpolate(text: string, params?: Record<string, string | number>): string {
    if (!params) return text

    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key]?.toString() || match
    })
  }

  // Formatting functions
  formatCurrency(amount: number, locale?: Locale): string {
    const config = SUPPORTED_LOCALES[locale || this.currentLocale]
    return new Intl.NumberFormat(config.code, config.numberFormat).format(amount)
  }

  formatDate(date: Date, locale?: Locale): string {
    const config = SUPPORTED_LOCALES[locale || this.currentLocale]
    return new Intl.DateTimeFormat(config.code).format(date)
  }

  formatNumber(number: number, locale?: Locale): string {
    const config = SUPPORTED_LOCALES[locale || this.currentLocale]
    return new Intl.NumberFormat(config.code).format(number)
  }

  // Pluralization
  plural(key: string, count: number, params?: Record<string, string | number>): string {
    const pluralKey = count === 1 ? `${key}.one` : `${key}.other`
    return this.t(pluralKey, { ...params, count })
  }

  // RTL support
  isRTL(locale?: Locale): boolean {
    return SUPPORTED_LOCALES[locale || this.currentLocale].rtl
  }

  // Lazy loading for large translation files
  async preloadLocale(locale: Locale): Promise<void> {
    await this.loadTranslations(locale)
  }

  // Translation key validation (development only)
  validateTranslations(): void {
    if (process.env.NODE_ENV !== 'development') return

    const baseTranslations = this.translations.get(this.fallbackLocale)
    if (!baseTranslations) return

    for (const [locale, translations] of Array.from(this.translations.entries())) {
      if (locale === this.fallbackLocale) continue
      
      const missing = this.findMissingKeys(baseTranslations, translations)
      if (missing.length > 0) {
        console.warn(`Missing translations in ${locale}:`, missing)
      }
    }
  }

  private findMissingKeys(base: TranslationKey, target: TranslationKey, prefix = ''): string[] {
    const missing: string[] = []

    for (const [key, value] of Object.entries(base)) {
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (!(key in target)) {
        missing.push(fullKey)
      } else if (typeof value === 'object' && typeof target[key] === 'object') {
        missing.push(...this.findMissingKeys(value, target[key] as TranslationKey, fullKey))
      }
    }

    return missing
  }
}

// Create singleton instance
export const i18n = new I18nManager()

// React hook for i18n
export function useTranslation() {
  const [locale, setLocaleState] = useState(i18n.getCurrentLocale())

  useEffect(() => {
    const handleLocaleChange = (event: CustomEvent) => {
      setLocaleState(event.detail.locale)
    }

    window.addEventListener('localechange', handleLocaleChange as EventListener)
    return () => {
      window.removeEventListener('localechange', handleLocaleChange as EventListener)
    }
  }, [])

  return {
    t: i18n.t.bind(i18n),
    locale,
    setLocale: i18n.setLocale.bind(i18n),
    formatCurrency: i18n.formatCurrency.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n),
    formatNumber: i18n.formatNumber.bind(i18n),
    plural: i18n.plural.bind(i18n),
    isRTL: i18n.isRTL.bind(i18n),
    localeConfig: i18n.getCurrentLocaleConfig(),
    supportedLocales: i18n.getSupportedLocales()
  }
}

// Import useState and useEffect for the hook
import { useState, useEffect } from 'react'
