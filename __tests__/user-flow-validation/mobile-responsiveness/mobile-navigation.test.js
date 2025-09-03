/**
 * Mobile Navigation and Menu Functionality Validation Tests
 * 
 * This test suite validates mobile navigation components including:
 * - Mobile header layout and touch target sizes (minimum 44px)
 * - Mobile menu toggle and slide-out navigation
 * - Mobile navigation links functionality and touch responsiveness
 * - Mobile search functionality and modal behavior
 * 
 * Requirements: 7.1, 7.2, 7.3
 */

const fs = require('fs')
const path = require('path')

// Helper function to read component files
const readComponentFile = (componentPath) => {
  const fullPath = path.join(process.cwd(), componentPath)
  return fs.readFileSync(fullPath, 'utf-8')
}

// Helper function to check if CSS classes are present
const hasClass = (content, className) => {
  return content.includes(className)
}

// Helper function to check for mobile-specific patterns
const hasMobilePattern = (content, pattern) => {
  return pattern.test(content)
}

// Helper function to validate touch target classes
const validateTouchTargetClasses = (content) => {
  const touchClasses = [
    'btn-touch-sm',
    'btn-touch-md', 
    'btn-touch-lg',
    'min-h-touch-md',
    'min-w-touch-md'
  ]
  return touchClasses.some(className => content.includes(className))
}

// Helper function to validate mobile responsive classes
const validateMobileResponsiveClasses = (content) => {
  const mobileClasses = [
    'md:hidden',
    'sm:block',
    'xs:',
    'mobile-padding',
    'text-responsive'
  ]
  return mobileClasses.some(className => content.includes(className))
}

// Helper function to validate ARIA attributes
const validateAriaAttributes = (content) => {
  const ariaPatterns = [
    /aria-expanded/,
    /aria-controls/,
    /aria-label/,
    /role="navigation"/,
    /role="button"/
  ]
  return ariaPatterns.some(pattern => pattern.test(content))
}

describe('Mobile Navigation and Menu Functionality', () => {
  let headerContent
  let tailwindConfig
  let globalCSS

  beforeAll(() => {
    // Read component and configuration files
    headerContent = readComponentFile('components/header.tsx')
    tailwindConfig = readComponentFile('tailwind.config.ts')
    globalCSS = readComponentFile('app/globals.css')
  })

  describe('Mobile Header Layout and Touch Targets', () => {
    test('should have mobile menu button with proper classes', () => {
      // Check for mobile menu button structure
      expect(headerContent).toMatch(/md:hidden/)
      expect(headerContent).toMatch(/Menu.*X/)
      expect(headerContent).toMatch(/aria-expanded/)
      expect(headerContent).toMatch(/aria-controls/)
    })

    test('should have minimum 44px touch target classes', () => {
      // Check for touch target classes in header
      expect(validateTouchTargetClasses(headerContent)).toBe(true)
      
      // Verify touch target classes are defined in Tailwind config
      expect(tailwindConfig).toMatch(/touch-sm.*44px/)
      expect(tailwindConfig).toMatch(/touch-md.*48px/)
      expect(tailwindConfig).toMatch(/touch-lg.*56px/)
    })

    test('should apply mobile-specific CSS classes', () => {
      // Check for mobile responsive classes
      expect(validateMobileResponsiveClasses(headerContent)).toBe(true)
      
      // Check for btn-touch-md class usage
      expect(headerContent).toMatch(/btn-touch-md/)
    })

    test('should have proper responsive breakpoints in Tailwind config', () => {
      // Check for mobile breakpoints
      expect(tailwindConfig).toMatch(/xs.*475px/)
      expect(tailwindConfig).toMatch(/sm.*640px/)
      expect(tailwindConfig).toMatch(/md.*768px/)
      
      // Check for touch-specific breakpoints
      expect(tailwindConfig).toMatch(/touch.*hover: none.*pointer: coarse/)
      expect(tailwindConfig).toMatch(/no-touch.*hover: hover.*pointer: fine/)
    })
  })

  describe('Mobile Menu Toggle and Slide-out Navigation', () => {
    test('should have mobile menu toggle functionality', () => {
      // Check for mobile menu state management
      expect(headerContent).toMatch(/isMobileMenuOpen.*setIsMobileMenuOpen/)
      expect(headerContent).toMatch(/useState.*false/)
      
      // Check for menu toggle button
      expect(headerContent).toMatch(/onClick.*setIsMobileMenuOpen/)
    })

    test('should display correct menu icons based on state', () => {
      // Check for conditional icon rendering
      expect(headerContent).toMatch(/\{isMobileMenuOpen \? \([\s\S]*?<X[\s\S]*?<Menu/)
      
      // Check for Lucide icons import
      expect(headerContent).toMatch(/import.*Menu.*X.*from.*lucide-react/)
    })

    test('should have proper ARIA attributes for accessibility', () => {
      // Check for ARIA attributes
      expect(validateAriaAttributes(headerContent)).toBe(true)
      
      // Check specific ARIA patterns
      expect(headerContent).toMatch(/aria-expanded=\{isMobileMenuOpen\}/)
      expect(headerContent).toMatch(/aria-controls="mobile-navigation"/)
      expect(headerContent).toMatch(/aria-label="Mobile navigation menu"/)
    })

    test('should have mobile menu animation classes', () => {
      // Check for transition classes
      expect(headerContent).toMatch(/transition-all.*duration-300/)
      expect(headerContent).toMatch(/max-h-0.*opacity-0/)
      expect(headerContent).toMatch(/max-h-96.*opacity-100/)
      
      // Check for conditional classes using cn utility
      expect(headerContent).toMatch(/cn\(/)
    })

    test('should have proper mobile menu container structure', () => {
      // Check for mobile navigation container
      expect(headerContent).toMatch(/id="mobile-navigation"/)
      expect(headerContent).toMatch(/role="navigation"/)
      expect(headerContent).toMatch(/md:hidden/)
    })
  })

  describe('Mobile Navigation Links Functionality', () => {
    test('should display all navigation links in mobile menu', () => {
      // Check for navigation links array
      expect(headerContent).toMatch(/navigationLinks.*=.*\[/)
      expect(headerContent).toMatch(/New Arrivals/)
      expect(headerContent).toMatch(/Collections/)
      expect(headerContent).toMatch(/Lookbook/)
      expect(headerContent).toMatch(/About/)
    })

    test('should have proper touch target sizes for navigation links', () => {
      // Check for touch-friendly classes on mobile nav links
      expect(headerContent).toMatch(/min-h-touch-md/)
      expect(headerContent).toMatch(/px-6 py-4/)
      
      // Check for mobile navigation link structure
      expect(headerContent).toMatch(/navigationLinks\.map/)
    })

    test('should close mobile menu when navigation link is clicked', () => {
      // Check for onClick handler that closes menu
      expect(headerContent).toMatch(/onClick.*setIsMobileMenuOpen\(false\)/)
    })

    test('should have correct href attributes for navigation links', () => {
      // Check for href mapping
      expect(headerContent).toMatch(/href=\{link\.href\}/)
      expect(headerContent).toMatch(/\/collections\/new-arrivals/)
      expect(headerContent).toMatch(/\/collections/)
      expect(headerContent).toMatch(/\/lookbook/)
      expect(headerContent).toMatch(/\/about/)
    })

    test('should apply mobile-specific styling classes', () => {
      // Check for mobile navigation styling
      expect(headerContent).toMatch(/text-responsive/)
      expect(headerContent).toMatch(/rounded-lg/)
      expect(headerContent).toMatch(/hover:bg-bibiere-gold\/10/)
      expect(headerContent).toMatch(/active:bg-bibiere-gold\/20/)
    })

    test('should have mobile-only account link', () => {
      // Check for mobile-only account link
      expect(headerContent).toMatch(/className="sm:hidden[\s\S]*?My Account/)
      expect(headerContent).toMatch(/href="\/account"/)
      expect(headerContent).toMatch(/User className="h-5 w-5 mr-3"/)
    })
  })

  describe('Mobile Search Functionality', () => {
    test('should have search button with proper mobile classes', () => {
      // Check for search button with touch classes
      expect(headerContent).toMatch(/Search.*className="h-5 w-5 sm:h-6 sm:w-6"/)
      expect(headerContent).toMatch(/btn-touch-md/)
      expect(headerContent).toMatch(/onClick.*setIsSearchOpen\(true\)/)
    })

    test('should have proper touch target size for search button', () => {
      // Check for touch-friendly button classes
      expect(headerContent).toMatch(/btn-touch-md/)
      expect(headerContent).toMatch(/active:scale-95/)
      expect(headerContent).toMatch(/touch:bg-bibiere-gold\/5/)
    })

    test('should have search modal state management', () => {
      // Check for search modal state
      expect(headerContent).toMatch(/isSearchOpen.*setIsSearchOpen/)
      expect(headerContent).toMatch(/useState.*false/)
      
      // Check for SearchModal component usage
      expect(headerContent).toMatch(/SearchModal.*isOpen=\{isSearchOpen\}/)
      expect(headerContent).toMatch(/onClose.*setIsSearchOpen\(false\)/)
    })

    test('should have responsive search icon sizing', () => {
      // Check for responsive icon classes
      expect(headerContent).toMatch(/h-5 w-5 sm:h-6 sm:w-6/)
    })

    test('should have proper accessibility for search', () => {
      // Check for screen reader text
      expect(headerContent).toMatch(/sr-only.*Search/)
    })
  })

  describe('Mobile Touch Interactions and Feedback', () => {
    test('should provide visual feedback on touch interactions', () => {
      // Check for touch feedback classes
      expect(headerContent).toMatch(/active:scale-95/)
      expect(headerContent).toMatch(/touch:bg-bibiere-gold\/5/)
      expect(headerContent).toMatch(/no-touch:hover:scale-105/)
    })

    test('should have proper transition classes for smooth interactions', () => {
      // Check for transition classes
      expect(headerContent).toMatch(/transition-all duration-300/)
      expect(headerContent).toMatch(/ease-in-out/)
    })

    test('should maintain proper z-index for mobile menu overlay', () => {
      // Check for z-index classes
      expect(headerContent).toMatch(/z-50/)
      expect(headerContent).toMatch(/sticky top-0/)
    })

    test('should have touch-specific CSS utilities defined', () => {
      // Check global CSS for touch utilities
      expect(globalCSS).toMatch(/hover: none.*pointer: coarse/)
      expect(globalCSS).toMatch(/-webkit-tap-highlight-color/)
      expect(globalCSS).toMatch(/min-height: 44px/)
      expect(globalCSS).toMatch(/min-width: 44px/)
    })

    test('should have mobile-specific animations', () => {
      // Check for mobile animation classes in Tailwind config
      expect(tailwindConfig).toMatch(/slide-up/)
      expect(tailwindConfig).toMatch(/slide-down/)
      expect(tailwindConfig).toMatch(/scale-in/)
    })
  })

  describe('Mobile Responsive Behavior', () => {
    test('should hide mobile menu button on desktop viewport', () => {
      // Check for responsive classes
      expect(headerContent).toMatch(/md:hidden/)
    })

    test('should show desktop navigation on larger screens', () => {
      // Check for desktop navigation classes
      expect(headerContent).toMatch(/hidden md:flex/)
      expect(headerContent).toMatch(/space-x-8/)
    })

    test('should have proper responsive breakpoint usage', () => {
      // Check for various responsive classes
      expect(headerContent).toMatch(/sm:/)
      expect(headerContent).toMatch(/md:/)
      // Note: lg: breakpoint may not be used in this specific component
      expect(headerContent.includes('sm:') || headerContent.includes('md:')).toBe(true)
    })

    test('should have responsive icon sizing', () => {
      // Check for responsive icon classes
      expect(headerContent).toMatch(/h-5 w-5 sm:h-6 sm:w-6/)
    })
  })

  describe('Mobile Safe Area and Layout', () => {
    test('should apply safe area classes for mobile devices', () => {
      // Check for safe area classes
      expect(headerContent).toMatch(/safe-area-bottom/)
      
      // Check that safe area utilities are defined in CSS
      expect(globalCSS).toMatch(/safe-area-top/)
      expect(globalCSS).toMatch(/safe-area-bottom/)
      expect(globalCSS).toMatch(/env\(safe-area-inset/)
    })

    test('should maintain proper spacing on mobile', () => {
      // Check for mobile padding classes
      expect(headerContent).toMatch(/px-4/)
      expect(headerContent).toMatch(/h-16/)
      
      // Check for mobile spacing utilities in CSS
      expect(globalCSS).toMatch(/mobile-padding/)
      expect(globalCSS).toMatch(/mobile-margin/)
    })

    test('should have proper container structure', () => {
      // Check for container and responsive structure
      expect(headerContent).toMatch(/container mx-auto/)
      expect(headerContent).toMatch(/flex items-center justify-between/)
    })

    test('should have skip navigation for accessibility', () => {
      // Check for skip navigation link
      expect(headerContent).toMatch(/Skip to main content/)
      expect(headerContent).toMatch(/sr-only focus:not-sr-only/)
      expect(headerContent).toMatch(/href="#main-content"/)
    })
  })

  describe('CSS Utilities and Mobile Optimizations', () => {
    test('should have mobile-first responsive text utilities', () => {
      // Check for responsive text utilities in CSS
      expect(globalCSS).toMatch(/text-responsive/)
      expect(globalCSS).toMatch(/text-sm sm:text-base lg:text-lg/)
    })

    test('should have touch-friendly button utilities', () => {
      // Check for touch button utilities
      expect(globalCSS).toMatch(/btn-touch-sm/)
      expect(globalCSS).toMatch(/btn-touch-md/)
      expect(globalCSS).toMatch(/btn-touch-lg/)
    })

    test('should have mobile scroll optimizations', () => {
      // Check for mobile scroll optimizations
      expect(globalCSS).toMatch(/scroll-behavior: smooth/)
      expect(globalCSS).toMatch(/-webkit-overflow-scrolling: touch/)
    })

    test('should have gesture-friendly interaction utilities', () => {
      // Check for swipe and gesture utilities
      expect(globalCSS).toMatch(/swipe-indicator/)
    })
  })
})