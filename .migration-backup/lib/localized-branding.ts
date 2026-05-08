/**
 * Localized Branding Configuration for Bibiere
 * Manages brand-specific settings and configurations per locale
 */

export interface BrandConfig {
  brandName: string
  siteName: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  fonts: {
    primary: string
    secondary: string
  }
  currency: {
    code: string
    symbol: string
    position: 'before' | 'after'
  }
  content: {
    tagline: string
    description: string
    keywords: string[]
    contactInfo: {
      email: string
      phone: string
      address: string
    }
    socialHandles: {
      instagram?: string
      facebook?: string
      twitter?: string
      pinterest?: string
    }
  }
  assets: {
    logo: {
      primary: string
    }
    socialImages: {
      default: string
    }
  }
}

const brandConfigs: Record<string, BrandConfig> = {
  en: {
    brandName: 'Bibiere',
    siteName: 'Bibiere - Luxury Fashion',
    colors: {
      primary: '#8B4513', // Bibiere Brown
      secondary: '#DAA520', // Bibiere Gold
      accent: '#2F4F4F' // Dark Slate Gray
    },
    fonts: {
      primary: 'Playfair Display',
      secondary: 'Inter'
    },
    currency: {
      code: 'USD',
      symbol: '$',
      position: 'before'
    },
    content: {
      tagline: 'Timeless Elegance, Modern Sophistication',
      description: 'Discover luxury fashion that transcends seasons. Bibiere offers curated collections of premium clothing and accessories for the discerning woman.',
      keywords: ['luxury fashion', 'designer clothing', 'premium accessories', 'elegant style', 'sophisticated fashion'],
      contactInfo: {
        email: 'hello@bibiere.com',
        phone: '+1 (555) 123-4567',
        address: '123 Fashion Avenue, New York, NY 10001'
      },
      socialHandles: {
        instagram: 'https://instagram.com/bibiere',
        facebook: 'https://facebook.com/bibiere',
        twitter: '@bibiere',
        pinterest: 'https://pinterest.com/bibiere'
      }
    },
    assets: {
      logo: {
        primary: '/images/logo.svg'
      },
      socialImages: {
        default: '/images/og-image.jpg'
      }
    }
  },
  fr: {
    brandName: 'Bibiere',
    siteName: 'Bibiere - Mode de Luxe',
    colors: {
      primary: '#8B4513',
      secondary: '#DAA520',
      accent: '#2F4F4F'
    },
    fonts: {
      primary: 'Playfair Display',
      secondary: 'Inter'
    },
    currency: {
      code: 'EUR',
      symbol: '€',
      position: 'after'
    },
    content: {
      tagline: 'Élégance Intemporelle, Sophistication Moderne',
      description: 'Découvrez la mode de luxe qui transcende les saisons. Bibiere propose des collections sélectionnées de vêtements et accessoires haut de gamme pour la femme exigeante.',
      keywords: ['mode de luxe', 'vêtements de créateur', 'accessoires premium', 'style élégant', 'mode sophistiquée'],
      contactInfo: {
        email: 'bonjour@bibiere.com',
        phone: '+33 1 23 45 67 89',
        address: '123 Avenue de la Mode, 75001 Paris, France'
      },
      socialHandles: {
        instagram: 'https://instagram.com/bibiere',
        facebook: 'https://facebook.com/bibiere',
        twitter: '@bibiere',
        pinterest: 'https://pinterest.com/bibiere'
      }
    },
    assets: {
      logo: {
        primary: '/images/logo.svg'
      },
      socialImages: {
        default: '/images/og-image.jpg'
      }
    }
  },
  de: {
    brandName: 'Bibiere',
    siteName: 'Bibiere - Luxusmode',
    colors: {
      primary: '#8B4513',
      secondary: '#DAA520',
      accent: '#2F4F4F'
    },
    fonts: {
      primary: 'Playfair Display',
      secondary: 'Inter'
    },
    currency: {
      code: 'EUR',
      symbol: '€',
      position: 'after'
    },
    content: {
      tagline: 'Zeitlose Eleganz, Moderne Raffinesse',
      description: 'Entdecken Sie Luxusmode, die Jahreszeiten überdauert. Bibiere bietet kuratierte Kollektionen hochwertiger Kleidung und Accessoires für die anspruchsvolle Frau.',
      keywords: ['Luxusmode', 'Designerkleidung', 'Premium-Accessoires', 'eleganter Stil', 'raffinierte Mode'],
      contactInfo: {
        email: 'hallo@bibiere.com',
        phone: '+49 30 12345678',
        address: 'Modestraße 123, 10115 Berlin, Deutschland'
      },
      socialHandles: {
        instagram: 'https://instagram.com/bibiere',
        facebook: 'https://facebook.com/bibiere',
        twitter: '@bibiere',
        pinterest: 'https://pinterest.com/bibiere'
      }
    },
    assets: {
      logo: {
        primary: '/images/logo.svg'
      },
      socialImages: {
        default: '/images/og-image.jpg'
      }
    }
  },
  es: {
    brandName: 'Bibiere',
    siteName: 'Bibiere - Moda de Lujo',
    colors: {
      primary: '#8B4513',
      secondary: '#DAA520',
      accent: '#2F4F4F'
    },
    fonts: {
      primary: 'Playfair Display',
      secondary: 'Inter'
    },
    currency: {
      code: 'EUR',
      symbol: '€',
      position: 'after'
    },
    content: {
      tagline: 'Elegancia Atemporal, Sofisticación Moderna',
      description: 'Descubre moda de lujo que trasciende las estaciones. Bibiere ofrece colecciones curadas de ropa y accesorios premium para la mujer exigente.',
      keywords: ['moda de lujo', 'ropa de diseñador', 'accesorios premium', 'estilo elegante', 'moda sofisticada'],
      contactInfo: {
        email: 'hola@bibiere.com',
        phone: '+34 91 123 45 67',
        address: 'Calle de la Moda 123, 28001 Madrid, España'
      },
      socialHandles: {
        instagram: 'https://instagram.com/bibiere',
        facebook: 'https://facebook.com/bibiere',
        twitter: '@bibiere',
        pinterest: 'https://pinterest.com/bibiere'
      }
    },
    assets: {
      logo: {
        primary: '/images/logo.svg'
      },
      socialImages: {
        default: '/images/og-image.jpg'
      }
    }
  },
  it: {
    brandName: 'Bibiere',
    siteName: 'Bibiere - Moda di Lusso',
    colors: {
      primary: '#8B4513',
      secondary: '#DAA520',
      accent: '#2F4F4F'
    },
    fonts: {
      primary: 'Playfair Display',
      secondary: 'Inter'
    },
    currency: {
      code: 'EUR',
      symbol: '€',
      position: 'after'
    },
    content: {
      tagline: 'Eleganza Senza Tempo, Raffinatezza Moderna',
      description: 'Scopri la moda di lusso che trascende le stagioni. Bibiere offre collezioni curate di abbigliamento e accessori premium per la donna esigente.',
      keywords: ['moda di lusso', 'abbigliamento di design', 'accessori premium', 'stile elegante', 'moda sofisticata'],
      contactInfo: {
        email: 'ciao@bibiere.com',
        phone: '+39 06 1234 5678',
        address: 'Via della Moda 123, 00100 Roma, Italia'
      },
      socialHandles: {
        instagram: 'https://instagram.com/bibiere',
        facebook: 'https://facebook.com/bibiere',
        twitter: '@bibiere',
        pinterest: 'https://pinterest.com/bibiere'
      }
    },
    assets: {
      logo: {
        primary: '/images/logo.svg'
      },
      socialImages: {
        default: '/images/og-image.jpg'
      }
    }
  }
}

/**
 * Get brand configuration for a specific locale
 */
export function getBrandConfig(locale: string): BrandConfig {
  return brandConfigs[locale] || brandConfigs.en
}

/**
 * Get all available brand configurations
 */
export function getAllBrandConfigs(): Record<string, BrandConfig> {
  return brandConfigs
}

/**
 * Get supported locales for branding
 */
export function getSupportedBrandingLocales(): string[] {
  return Object.keys(brandConfigs)
}