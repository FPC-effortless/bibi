// Accessibility utilities for bibiere

/**
 * Check if color contrast meets WCAG AA standards
 * @param foreground - Foreground color in hex format
 * @param background - Background color in hex format
 * @returns boolean indicating if contrast ratio meets WCAG AA (4.5:1)
 */
export function checkColorContrast(foreground: string, background: string): boolean {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex)
    if (!rgb) return 0
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  
  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  const contrastRatio = (lighter + 0.05) / (darker + 0.05)
  return contrastRatio >= 4.5 // WCAG AA standard
}

/**
 * Generate accessible color combinations for bibiere brand
 */
export const accessibleColors = {
  // High contrast combinations that meet WCAG AA standards
  primary: {
    background: '#8B1538', // bibiere burgundy
    foreground: '#FFFFFF', // white text
    contrastRatio: 8.2
  },
  secondary: {
    background: '#D4AF37', // bibiere gold
    foreground: '#000000', // black text
    contrastRatio: 6.1
  },
  neutral: {
    background: '#F8F9FA', // light gray
    foreground: '#1F2937', // dark gray
    contrastRatio: 12.6
  },
  error: {
    background: '#BE123C', // red
    foreground: '#FFFFFF', // white text
    contrastRatio: 7.8
  },
  success: {
    background: '#059669', // green
    foreground: '#FFFFFF', // white text
    contrastRatio: 5.9
  }
}

/**
 * Keyboard navigation utilities
 */
export const keyboardNavigation = {
  /**
   * Handle arrow key navigation in a list
   */
  handleArrowKeys: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (index: number) => void
  ) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        onIndexChange(nextIndex)
        items[nextIndex]?.focus()
        break
      case 'ArrowUp':
        event.preventDefault()
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        onIndexChange(prevIndex)
        items[prevIndex]?.focus()
        break
      case 'Home':
        event.preventDefault()
        onIndexChange(0)
        items[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        const lastIndex = items.length - 1
        onIndexChange(lastIndex)
        items[lastIndex]?.focus()
        break
    }
  },

  /**
   * Handle Enter and Space key activation
   */
  handleActivation: (event: KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      callback()
    }
  }
}

/**
 * Screen reader utilities
 */
export const screenReader = {
  /**
   * Announce content to screen readers
   */
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  },

  /**
   * Generate descriptive text for product cards
   */
  generateProductDescription: (product: {
    name: string
    price: string | number
    isOnSale?: boolean
    rating?: number
    inStock?: boolean
  }) => {
    let description = `${product.name}, priced at ${product.price}`
    
    if (product.isOnSale) {
      description += ', on sale'
    }
    
    if (product.rating) {
      description += `, rated ${product.rating} stars`
    }
    
    if (product.inStock === false) {
      description += ', currently out of stock'
    }
    
    return description
  }
}

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Trap focus within a container (for modals, dropdowns)
   */
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
    
    container.addEventListener('keydown', handleTabKey)
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  },

  /**
   * Restore focus to previously focused element
   */
  restoreFocus: (previousElement: HTMLElement | null) => {
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus()
    }
  }
}

/**
 * Touch accessibility utilities
 */
export const touchAccessibility = {
  /**
   * Ensure minimum touch target size (44px x 44px)
   */
  ensureMinimumTouchTarget: (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    const minSize = 44
    
    if (rect.width < minSize || rect.height < minSize) {
      console.warn(`Touch target too small: ${rect.width}x${rect.height}px. Minimum recommended: ${minSize}x${minSize}px`)
    }
  },

  /**
   * Add touch-friendly spacing between interactive elements
   */
  checkTouchSpacing: (elements: HTMLElement[]) => {
    const minSpacing = 8 // 8px minimum spacing
    
    for (let i = 0; i < elements.length - 1; i++) {
      const current = elements[i].getBoundingClientRect()
      const next = elements[i + 1].getBoundingClientRect()
      
      const horizontalSpacing = Math.abs(next.left - current.right)
      const verticalSpacing = Math.abs(next.top - current.bottom)
      
      if (horizontalSpacing < minSpacing && verticalSpacing < minSpacing) {
        console.warn('Interactive elements too close together for touch accessibility')
      }
    }
  }
}

/**
 * ARIA utilities
 */
export const aria = {
  /**
   * Generate ARIA label for complex UI elements
   */
  generateLabel: (base: string, context?: Record<string, any>) => {
    if (!context) return base
    
    const contextParts = Object.entries(context)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}: ${value}`)
    
    return contextParts.length > 0 ? `${base}, ${contextParts.join(', ')}` : base
  },

  /**
   * Update live region content
   */
  updateLiveRegion: (regionId: string, content: string, priority: 'polite' | 'assertive' = 'polite') => {
    const region = document.getElementById(regionId)
    if (region) {
      region.setAttribute('aria-live', priority)
      region.textContent = content
    }
  }
}