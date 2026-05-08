import { checkColorContrast, accessibleColors, screenReader } from '@/lib/accessibility'

describe('Accessibility Utilities', () => {
  describe('checkColorContrast', () => {
    it('validates bibiere brand colors meet WCAG AA standards', () => {
      // Test bibiere burgundy on white
      expect(checkColorContrast('#8B1538', '#FFFFFF')).toBe(true)
      
      // Test bibiere gold on black
      expect(checkColorContrast('#D4AF37', '#000000')).toBe(true)
      
      // Test insufficient contrast
      expect(checkColorContrast('#CCCCCC', '#FFFFFF')).toBe(false)
    })
  })

  describe('accessibleColors', () => {
    it('provides high contrast color combinations', () => {
      expect(accessibleColors.primary.contrastRatio).toBeGreaterThan(4.5)
      expect(accessibleColors.secondary.contrastRatio).toBeGreaterThan(4.5)
      expect(accessibleColors.neutral.contrastRatio).toBeGreaterThan(4.5)
    })
  })

  describe('screenReader', () => {
    it('generates descriptive product descriptions', () => {
      const product = {
        name: 'Elegant Silk Dress',
        price: '$299',
        isOnSale: true,
        rating: 4.8,
        inStock: true
      }
      
      const description = screenReader.generateProductDescription(product)
      
      expect(description).toContain('Elegant Silk Dress')
      expect(description).toContain('$299')
      expect(description).toContain('on sale')
      expect(description).toContain('rated 4.8 stars')
    })

    it('handles out of stock products', () => {
      const product = {
        name: 'Test Product',
        price: '$199',
        inStock: false
      }
      
      const description = screenReader.generateProductDescription(product)
      
      expect(description).toContain('currently out of stock')
    })
  })
})