/**
 * Mobile Product Browsing and Interactions Validation Tests
 * 
 * This test suite validates mobile product browsing components including:
 * - Product grid responsive layout on mobile devices
 * - Touch interactions for product cards and navigation
 * - Mobile product detail page layout and functionality
 * - Mobile image gallery swipe gestures and touch navigation
 * - Mobile size and color selector touch interactions
 * 
 * Requirements: 7.4
 */

const fs = require('fs')
const path = require('path')

// Helper function to read component files
const readComponentFile = (componentPath) => {
  const fullPath = path.join(process.cwd(), componentPath)
  return fs.readFileSync(fullPath, 'utf-8')
}

// Helper function to validate mobile responsive classes
const validateMobileResponsiveClasses = (content) => {
  const mobileClasses = [
    'sm:grid-cols-2',
    'lg:grid-cols-3',
    'xl:grid-cols-4',
    'grid-cols-1',
    'aspect-',
    'touch:',
    'no-touch:'
  ]
  return mobileClasses.some(className => content.includes(className))
}

// Helper function to validate touch interaction classes
const validateTouchInteractionClasses = (content) => {
  const touchClasses = [
    'active:scale-',
    'touch:active:scale-',
    'hover:scale-',
    'transition-all',
    'duration-300',
    'ease-in-out'
  ]
  return touchClasses.some(className => content.includes(className))
}

// Helper function to validate mobile image handling
const validateMobileImageHandling = (content) => {
  const imagePatterns = [
    /sizes=".*max-width.*100vw/,
    /loading="lazy"/,
    /priority/,
    /placeholder="blur"/,
    /onLoad/
  ]
  return imagePatterns.some(pattern => pattern.test(content))
}

// Helper function to validate mobile gesture support
const validateMobileGestureSupport = (content) => {
  const gesturePatterns = [
    /onTouchStart/,
    /onTouchEnd/,
    /onMouseMove/,
    /swipe/i,
    /gesture/i
  ]
  return gesturePatterns.some(pattern => pattern.test(content))
}

describe('Mobile Product Browsing and Interactions', () => {
  let productGridContent
  let productCardContent
  let productDetailsContent
  let productImageGalleryContent
  let tailwindConfig
  let globalCSS

  beforeAll(() => {
    // Read component and configuration files
    productGridContent = readComponentFile('components/product-grid.tsx')
    productCardContent = readComponentFile('components/product-card.tsx')
    productDetailsContent = readComponentFile('components/product-details.tsx')
    productImageGalleryContent = readComponentFile('components/product-image-gallery.tsx')
    tailwindConfig = readComponentFile('tailwind.config.ts')
    globalCSS = readComponentFile('app/globals.css')
  })

  describe('Product Grid Responsive Layout', () => {
    test('should have responsive grid layout for mobile devices', () => {
      // Check for responsive grid classes
      expect(productGridContent).toMatch(/grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4/)
      
      // Check for proper gap spacing
      expect(productGridContent).toMatch(/gap-8 lg:gap-10/)
    })

    test('should have mobile-first responsive design', () => {
      // Check for mobile responsive classes
      expect(validateMobileResponsiveClasses(productGridContent)).toBe(true)
      
      // Check for container padding
      expect(productGridContent).toMatch(/container mx-auto px-4/)
    })

    test('should have proper mobile spacing and padding', () => {
      // Check for mobile-friendly spacing
      expect(productGridContent).toMatch(/py-12/)
      expect(productGridContent).toMatch(/space-y-4/)
      expect(productGridContent).toMatch(/mb-12/)
    })

    test('should have responsive typography', () => {
      // Check for responsive text sizing
      expect(productGridContent).toMatch(/text-3xl md:text-4xl lg:text-5xl/)
      expect(productGridContent).toMatch(/text-lg/)
    })

    test('should have animation delays for mobile performance', () => {
      // Check for staggered animations
      expect(productGridContent).toMatch(/animationDelay.*index \* 100/)
      expect(productGridContent).toMatch(/animate-fade-in-up/)
    })
  })

  describe('Product Card Touch Interactions', () => {
    test('should have touch-friendly interactive elements', () => {
      // Check for touch interaction classes
      expect(validateTouchInteractionClasses(productCardContent)).toBe(true)
      
      // Check for specific touch classes
      expect(productCardContent).toMatch(/touch:active:scale-\[0\.98\]/)
      expect(productCardContent).toMatch(/no-touch:hover:shadow-xl/)
    })

    test('should have proper touch event handlers', () => {
      // Check for touch event handlers
      expect(productCardContent).toMatch(/onTouchStart/)
      expect(productCardContent).toMatch(/onTouchEnd/)
      
      // Check for touch delay handling
      expect(productCardContent).toMatch(/setTimeout.*300/)
    })

    test('should have accessible touch targets', () => {
      // Check for proper button sizing
      expect(productCardContent).toMatch(/p-2\.5/)
      expect(productCardContent).toMatch(/w-4 h-4/)
      
      // Check for focus states
      expect(productCardContent).toMatch(/focus:outline-none focus:ring-2/)
    })

    test('should have mobile-optimized image handling', () => {
      // Check for mobile image optimization
      expect(validateMobileImageHandling(productCardContent)).toBe(true)
      
      // Check for responsive image sizes
      expect(productCardContent).toMatch(/sizes=".*max-width.*640px.*100vw/)
    })

    test('should have touch feedback animations', () => {
      // Check for hover and active states
      expect(productCardContent).toMatch(/hover:scale-110/)
      expect(productCardContent).toMatch(/transition-all duration-300/)
      
      // Check for loading states
      expect(productCardContent).toMatch(/animate-pulse/)
    })

    test('should have keyboard navigation support', () => {
      // Check for keyboard event handling
      expect(productCardContent).toMatch(/onKeyDown/)
      expect(productCardContent).toMatch(/Enter/)
      expect(productCardContent).toMatch(/e\.key === ' '/)
      
      // Check for tabIndex and ARIA
      expect(productCardContent).toMatch(/tabIndex=\{0\}/)
      expect(productCardContent).toMatch(/aria-label/)
    })
  })

  describe('Mobile Product Detail Page Layout', () => {
    test('should have mobile-optimized layout structure', () => {
      // Check for responsive spacing
      expect(productDetailsContent).toMatch(/space-y-8/)
      expect(productDetailsContent).toMatch(/space-y-6/)
      
      // Check for responsive typography
      expect(productDetailsContent).toMatch(/text-3xl lg:text-4xl xl:text-5xl/)
    })

    test('should have mobile-friendly tab navigation', () => {
      // Check for tab structure
      expect(productDetailsContent).toMatch(/flex border-b border-border/)
      expect(productDetailsContent).toMatch(/px-6 py-3/)
      
      // Check for active tab styling
      expect(productDetailsContent).toMatch(/border-bibiere-burgundy/)
    })

    test('should have touch-optimized size selector', () => {
      // Check for size selector grid
      expect(productDetailsContent).toMatch(/grid grid-cols-4 gap-3/)
      
      // Check for touch-friendly button sizing
      expect(productDetailsContent).toMatch(/py-4 px-4/)
      expect(productDetailsContent).toMatch(/hover:scale-105/)
    })

    test('should have mobile-friendly color selector', () => {
      // Check for color selector layout
      expect(productDetailsContent).toMatch(/flex gap-4/)
      expect(productDetailsContent).toMatch(/w-14 h-14/)
      
      // Check for touch interactions
      expect(productDetailsContent).toMatch(/hover:scale-110/)
      expect(productDetailsContent).toMatch(/focus:ring-2/)
    })

    test('should have mobile-optimized buttons', () => {
      // Check for large touch targets
      expect(productDetailsContent).toMatch(/h-16 text-lg/)
      expect(productDetailsContent).toMatch(/h-14 text-base/)
      
      // Check for button scaling
      expect(productDetailsContent).toMatch(/hover:scale-\[1\.02\]/)
    })

    test('should have responsive guarantee section', () => {
      // Check for responsive grid
      expect(productDetailsContent).toMatch(/grid-cols-1 sm:grid-cols-3/)
      
      // Check for mobile spacing
      expect(productDetailsContent).toMatch(/gap-4/)
    })
  })

  describe('Mobile Image Gallery Touch Navigation', () => {
    test('should have touch-optimized image gallery', () => {
      // Check for aspect ratio handling
      expect(productImageGalleryContent).toMatch(/aspect-\[4\/5\]/)
      
      // Check for touch interactions
      expect(productImageGalleryContent).toMatch(/cursor-zoom-in/)
      expect(productImageGalleryContent).toMatch(/onMouseMove/)
    })

    test('should have mobile swipe gesture support', () => {
      // Check for gesture handling
      expect(validateMobileGestureSupport(productImageGalleryContent)).toBe(true)
      
      // Check for navigation functions
      expect(productImageGalleryContent).toMatch(/navigateImage/)
      expect(productImageGalleryContent).toMatch(/prev.*next/)
    })

    test('should have touch-friendly thumbnail navigation', () => {
      // Check for thumbnail grid
      expect(productImageGalleryContent).toMatch(/grid-cols-4 sm:grid-cols-5 md:grid-cols-6/)
      
      // Check for touch interactions
      expect(productImageGalleryContent).toMatch(/hover:scale-105/)
      expect(productImageGalleryContent).toMatch(/aspect-square/)
    })

    test('should have mobile-optimized zoom functionality', () => {
      // Check for zoom state management
      expect(productImageGalleryContent).toMatch(/isZoomed.*setIsZoomed/)
      expect(productImageGalleryContent).toMatch(/zoomPosition/)
      
      // Check for zoom interactions
      expect(productImageGalleryContent).toMatch(/onMouseEnter/)
      expect(productImageGalleryContent).toMatch(/onMouseLeave/)
      expect(productImageGalleryContent).toMatch(/scale-150/)
    })

    test('should have fullscreen modal for mobile', () => {
      // Check for fullscreen functionality
      expect(productImageGalleryContent).toMatch(/isFullscreen.*setIsFullscreen/)
      expect(productImageGalleryContent).toMatch(/fixed inset-0 z-50/)
      
      // Check for mobile-friendly controls
      expect(productImageGalleryContent).toMatch(/max-w-full max-h-full/)
    })

    test('should have keyboard navigation support', () => {
      // Check for keyboard event handling
      expect(productImageGalleryContent).toMatch(/handleKeyDown/)
      expect(productImageGalleryContent).toMatch(/ArrowLeft/)
      expect(productImageGalleryContent).toMatch(/ArrowRight/)
      expect(productImageGalleryContent).toMatch(/Escape/)
    })

    test('should have mobile image loading optimization', () => {
      // Check for image loading states
      expect(productImageGalleryContent).toMatch(/imageLoaded/)
      expect(productImageGalleryContent).toMatch(/handleImageLoad/)
      
      // Check for responsive image sizes
      expect(productImageGalleryContent).toMatch(/sizes=".*max-width.*768px.*100vw/)
    })
  })

  describe('Mobile Touch Interaction Patterns', () => {
    test('should have consistent touch feedback across components', () => {
      const components = [productCardContent, productDetailsContent, productImageGalleryContent]
      
      components.forEach(content => {
        // Check for consistent transition patterns
        expect(content).toMatch(/transition-all duration-300/)
      })
    })

    test('should have proper touch target sizing', () => {
      // Check product card buttons
      expect(productCardContent).toMatch(/p-2\.5/)
      
      // Check product details buttons
      expect(productDetailsContent).toMatch(/py-4 px-4/)
      expect(productDetailsContent).toMatch(/h-16/)
      
      // Check image gallery buttons
      expect(productImageGalleryContent).toMatch(/aspect-square/)
    })

    test('should have mobile-specific hover states', () => {
      const components = [productCardContent, productDetailsContent, productImageGalleryContent]
      
      components.forEach(content => {
        // Check for no-touch hover states
        expect(content.includes('no-touch:hover:') || content.includes('hover:')).toBe(true)
      })
    })

    test('should have loading and error states for mobile', () => {
      // Check for loading animations
      expect(productCardContent).toMatch(/animate-pulse/)
      expect(productImageGalleryContent).toMatch(/animate-pulse/)
      
      // Check for shimmer effects
      expect(productCardContent).toMatch(/animate-shimmer/)
    })
  })

  describe('Mobile Performance Optimizations', () => {
    test('should have lazy loading for images', () => {
      const components = [productCardContent, productImageGalleryContent]
      
      components.forEach(content => {
        expect(content).toMatch(/loading="lazy"/)
      })
    })

    test('should have proper image sizing for mobile', () => {
      // Check for responsive image sizes
      expect(productCardContent).toMatch(/sizes=".*max-width.*640px.*100vw/)
      expect(productImageGalleryContent).toMatch(/sizes=".*max-width.*768px.*100vw/)
    })

    test('should have optimized animations for mobile', () => {
      // Check for transform-gpu optimization
      expect(productCardContent).toMatch(/transform-gpu/)
      
      // Check for animation delays
      expect(productGridContent).toMatch(/animationDelay/)
    })

    test('should have mobile-specific CSS utilities', () => {
      // Check for mobile utilities in global CSS
      expect(globalCSS).toMatch(/mobile-padding/)
      expect(globalCSS).toMatch(/mobile-margin/)
      
      // Check for touch utilities
      expect(globalCSS).toMatch(/btn-touch-/)
    })
  })

  describe('Mobile Accessibility Features', () => {
    test('should have proper ARIA labels for mobile', () => {
      // Check product card has ARIA labels
      expect(productCardContent).toMatch(/aria-label/)
      
      // Check image gallery has proper alt attributes
      expect(productImageGalleryContent).toMatch(/alt=/)
    })

    test('should have keyboard navigation support', () => {
      // Check for keyboard event handlers
      expect(productCardContent).toMatch(/onKeyDown/)
      expect(productImageGalleryContent).toMatch(/handleKeyDown/)
    })

    test('should have focus management for mobile', () => {
      // Check for focus states in components
      expect(productCardContent).toMatch(/focus:/)
      expect(productDetailsContent).toMatch(/focus:/)
      expect(productImageGalleryContent).toMatch(/focus:/)
    })

    test('should have screen reader support', () => {
      // Check for proper semantic structure
      expect(productCardContent).toMatch(/role="article"/)
      
      // Check for accessible button labels
      expect(productCardContent).toMatch(/aria-label=.*wishlist/)
      expect(productCardContent).toMatch(/aria-label=.*cart/)
    })
  })

  describe('Mobile Layout and Spacing', () => {
    test('should have consistent mobile spacing', () => {
      // Check for consistent gap usage
      expect(productGridContent).toMatch(/gap-8/)
      expect(productDetailsContent).toMatch(/gap-3/)
      expect(productImageGalleryContent).toMatch(/gap-3/)
    })

    test('should have proper mobile container structure', () => {
      // Check for container classes
      expect(productGridContent).toMatch(/container mx-auto px-4/)
      
      // Check for responsive padding
      expect(productGridContent).toMatch(/py-12/)
    })

    test('should have mobile-optimized aspect ratios', () => {
      // Check for aspect ratio classes
      expect(productCardContent).toMatch(/aspect-\[4\/5\]/)
      expect(productImageGalleryContent).toMatch(/aspect-\[4\/5\]/)
      expect(productImageGalleryContent).toMatch(/aspect-square/)
    })

    test('should have responsive breakpoint usage', () => {
      // Check for sm: breakpoints
      expect(productGridContent).toMatch(/sm:/)
      expect(productDetailsContent).toMatch(/sm:/)
      expect(productImageGalleryContent).toMatch(/sm:/)
      
      // Check for lg: breakpoints (may not be in all components)
      expect(productGridContent).toMatch(/lg:/)
      expect(productDetailsContent).toMatch(/lg:/)
    })
  })
})