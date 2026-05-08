import { Metadata } from 'next'
import { seoManager, ProductData } from './seo-manager'
import { structuredDataGenerator } from './structured-data'

// Generate metadata for homepage
export function generateHomeMetadata(): Metadata {
  return seoManager.generateMetadata({
    title: 'bibiere - Timeless Luxury Redefined',
    description: 'Timeless luxury redefined. Discover bibiere\'s collection of exquisite pieces crafted for the discerning individual. Premium fashion, sophisticated style, and exceptional craftsmanship.',
    keywords: [
      'bibiere',
      'timeless luxury',
      'elegant fashion',
      'sophisticated style',
      'premium craftsmanship',
      'luxury fashion',
      'designer clothing',
      'high-end fashion'
    ],
    path: '/',
    structuredData: [
      seoManager.generateOrganizationStructuredData(),
      seoManager.generateWebsiteStructuredData()
    ]
  })
}

// Generate metadata for collections page
export function generateCollectionsMetadata(): Metadata {
  return seoManager.generateMetadata({
    title: 'Collections - Luxury Fashion',
    description: 'Explore our curated collections of luxury fashion. From timeless essentials to statement evening wear, discover pieces that define sophisticated style.',
    keywords: [
      'fashion collections',
      'luxury clothing',
      'designer fashion',
      'bibiere collections',
      'premium fashion',
      'sophisticated style'
    ],
    path: '/collections',
    structuredData: [
      structuredDataGenerator.generateItemListStructuredData({
        name: 'Fashion Collections',
        description: 'Curated collections of luxury fashion pieces',
        url: 'https://bibiere.com/collections',
        numberOfItems: 3, // Update based on actual collections
        itemListElement: [
          {
            name: 'Essentials Collection',
            url: 'https://bibiere.com/collections/essentials'
          },
          {
            name: 'Evening Collection',
            url: 'https://bibiere.com/collections/evening'
          },
          {
            name: 'Heritage Collection',
            url: 'https://bibiere.com/collections/heritage'
          }
        ]
      })
    ]
  })
}

// Generate metadata for about page
export function generateAboutMetadata(): Metadata {
  return seoManager.generateMetadata({
    title: 'About - Our Story',
    description: 'Discover the story behind bibiere. Learn about our commitment to timeless luxury, exceptional craftsmanship, and sustainable fashion practices.',
    keywords: [
      'about bibiere',
      'luxury fashion brand',
      'sustainable fashion',
      'craftsmanship',
      'brand story',
      'fashion heritage'
    ],
    path: '/about',
    structuredData: [
      seoManager.generateOrganizationStructuredData()
    ]
  })
}

// Generate metadata for contact page
export function generateContactMetadata(): Metadata {
  return seoManager.generateMetadata({
    title: 'Contact Us - Get in Touch',
    description: 'Get in touch with bibiere. Contact our customer service team for inquiries about our luxury fashion collections, orders, or styling advice.',
    keywords: [
      'contact bibiere',
      'customer service',
      'fashion inquiries',
      'styling advice',
      'luxury fashion support'
    ],
    path: '/contact'
  })
}

// Generate metadata for care instructions page
export function generateCareInstructionsMetadata(): Metadata {
  const careInstructions = [
    'Check the care label before cleaning',
    'Use gentle, cold water for washing',
    'Air dry away from direct sunlight',
    'Store in a cool, dry place',
    'Professional cleaning recommended for delicate items'
  ]

  return seoManager.generateMetadata({
    title: 'Care Instructions - Luxury Fashion Care',
    description: 'Learn how to properly care for your luxury fashion pieces. Expert tips and guidelines to maintain the quality and longevity of your bibiere garments.',
    keywords: [
      'fashion care',
      'luxury garment care',
      'clothing maintenance',
      'fabric care',
      'fashion preservation'
    ],
    path: '/care-instructions',
    structuredData: [
      structuredDataGenerator.generateCareInstructionsStructuredData({
        name: 'Luxury Fashion Care Instructions',
        description: 'Professional care guidelines for luxury fashion pieces',
        instructions: careInstructions,
        materials: ['Silk', 'Cashmere', 'Wool', 'Cotton', 'Linen']
      })
    ]
  })
}

// Generate metadata for size guide page
export function generateSizeGuideMetadata(): Metadata {
  return seoManager.generateMetadata({
    title: 'Size Guide - Find Your Perfect Fit',
    description: 'Find your perfect fit with our comprehensive size guide. Detailed measurements and fitting tips for all bibiere luxury fashion pieces.',
    keywords: [
      'size guide',
      'fashion sizing',
      'fit guide',
      'measurements',
      'luxury fashion sizing'
    ],
    path: '/size-guide',
    structuredData: [
      structuredDataGenerator.generateSizeGuideStructuredData({
        name: 'bibiere Size Guide',
        description: 'Comprehensive sizing information for luxury fashion pieces',
        sizes: [
          {
            name: 'XS',
            measurements: {
              'Bust': '32-34 inches',
              'Waist': '24-26 inches',
              'Hips': '34-36 inches'
            }
          },
          {
            name: 'S',
            measurements: {
              'Bust': '34-36 inches',
              'Waist': '26-28 inches',
              'Hips': '36-38 inches'
            }
          },
          {
            name: 'M',
            measurements: {
              'Bust': '36-38 inches',
              'Waist': '28-30 inches',
              'Hips': '38-40 inches'
            }
          },
          {
            name: 'L',
            measurements: {
              'Bust': '38-40 inches',
              'Waist': '30-32 inches',
              'Hips': '40-42 inches'
            }
          }
        ]
      })
    ]
  })
}

// Generate metadata for FAQ page
export function generateFAQMetadata(): Metadata {
  const faqs = [
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for all unworn items in original condition with tags attached.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship worldwide. Shipping costs and delivery times vary by location.'
    },
    {
      question: 'How do I care for my luxury garments?',
      answer: 'Each piece comes with specific care instructions. Generally, we recommend professional cleaning for delicate items.'
    },
    {
      question: 'Are your products sustainable?',
      answer: 'We are committed to sustainable practices, using ethically sourced materials and responsible manufacturing processes.'
    }
  ]

  return seoManager.generateMetadata({
    title: 'FAQ - Frequently Asked Questions',
    description: 'Find answers to frequently asked questions about bibiere luxury fashion, shipping, returns, care instructions, and more.',
    keywords: [
      'FAQ',
      'frequently asked questions',
      'bibiere help',
      'luxury fashion questions',
      'customer support'
    ],
    path: '/faq',
    structuredData: [
      structuredDataGenerator.generateFAQStructuredData(faqs)
    ]
  })
}

// Generate metadata for privacy policy page
export function generatePrivacyMetadata(): Metadata {
  return seoManager.generateMetadata({
    title: 'Privacy Policy - Your Privacy Matters',
    description: 'Read our privacy policy to understand how bibiere collects, uses, and protects your personal information when you shop with us.',
    keywords: [
      'privacy policy',
      'data protection',
      'personal information',
      'GDPR compliance',
      'privacy rights'
    ],
    path: '/privacy',
    robots: 'index, follow'
  })
}

// Generate metadata for shipping and returns page
export function generateShippingReturnsMetadata(): Metadata {
  return seoManager.generateMetadata({
    title: 'Shipping & Returns - Delivery Information',
    description: 'Learn about our shipping options, delivery times, and return policy. Free shipping available on orders over $200.',
    keywords: [
      'shipping information',
      'delivery options',
      'return policy',
      'free shipping',
      'luxury fashion delivery'
    ],
    path: '/shipping-returns'
  })
}

// Generate metadata for journal/blog pages
export function generateJournalMetadata(): Metadata {
  return seoManager.generateMetadata({
    title: 'Journal - Fashion Insights & Style Guide',
    description: 'Explore our fashion journal for style inspiration, trend insights, and expert advice on luxury fashion and sophisticated styling.',
    keywords: [
      'fashion journal',
      'style guide',
      'fashion blog',
      'luxury fashion insights',
      'styling tips',
      'fashion trends'
    ],
    path: '/journal'
  })
}

// Generate metadata for lookbook page
export function generateLookbookMetadata(): Metadata {
  return seoManager.generateMetadata({
    title: 'Lookbook - Style Inspiration',
    description: 'Browse our latest lookbook for style inspiration and discover how to wear our luxury fashion pieces with sophistication and elegance.',
    keywords: [
      'fashion lookbook',
      'style inspiration',
      'luxury fashion styling',
      'outfit ideas',
      'fashion photography'
    ],
    path: '/lookbook'
  })
}

// Generate metadata for sustainability page
export function generateSustainabilityMetadata(): Metadata {
  return seoManager.generateMetadata({
    title: 'Sustainability - Our Commitment',
    description: 'Learn about bibiere\'s commitment to sustainable luxury fashion. Discover our eco-friendly practices and ethical manufacturing processes.',
    keywords: [
      'sustainable fashion',
      'eco-friendly luxury',
      'ethical manufacturing',
      'responsible fashion',
      'environmental commitment'
    ],
    path: '/sustainability'
  })
}

// Generate metadata for heritage page
export function generateHeritageMetadata(): Metadata {
  return seoManager.generateMetadata({
    title: 'Heritage - Our Legacy',
    description: 'Discover the rich heritage behind bibiere. Learn about our founding principles, craftsmanship traditions, and commitment to timeless luxury.',
    keywords: [
      'fashion heritage',
      'brand legacy',
      'craftsmanship tradition',
      'luxury fashion history',
      'timeless design'
    ],
    path: '/heritage'
  })
}

// Generate metadata for careers page
export function generateCareersMetadata(): Metadata {
  return seoManager.generateMetadata({
    title: 'Careers - Join Our Team',
    description: 'Explore career opportunities at bibiere. Join our team of passionate professionals dedicated to creating exceptional luxury fashion experiences.',
    keywords: [
      'fashion careers',
      'luxury fashion jobs',
      'bibiere careers',
      'fashion industry jobs',
      'creative careers'
    ],
    path: '/careers'
  })
}

// Generate metadata for press page
export function generatePressMetadata(): Metadata {
  return seoManager.generateMetadata({
    title: 'Press - Media & News',
    description: 'Latest news, press releases, and media coverage about bibiere luxury fashion. Download press materials and brand assets.',
    keywords: [
      'fashion press',
      'media coverage',
      'press releases',
      'fashion news',
      'brand media'
    ],
    path: '/press'
  })
}