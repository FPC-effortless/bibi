"use client"

import { useEffect, useState } from "react"
import { useMobileOptimization } from "@/hooks/use-mobile-optimization"

interface MobileOptimizationProviderProps {
  children: React.ReactNode
}

export default function MobileOptimizationProvider({ children }: MobileOptimizationProviderProps) {
  const {
    isMobile,
    isOptimized,
    preloadCriticalResources,
    optimizeImagesForMobile,
    addButtonAnimation
  } = useMobileOptimization()

  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const initializeMobileOptimizations = async () => {
      try {
        // Preload critical mobile resources
        if (isMobile) {
          preloadCriticalResources([
            '/icons/icon-192x192.png',
            '/icons/icon-512x512.png',
            '/fonts/inter-var.woff2'
          ])
        }

        // Optimize existing images
        optimizeImagesForMobile()

        // Add native-like animations to buttons
        const buttons = document.querySelectorAll('button, [role="button"]')
        buttons.forEach(button => {
          if (button instanceof HTMLElement) {
            addButtonAnimation(button)
          }
        })

        // Setup mutation observer for new buttons
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof HTMLElement) {
                const newButtons = node.querySelectorAll('button, [role="button"]')
                newButtons.forEach(button => {
                  if (button instanceof HTMLElement) {
                    addButtonAnimation(button)
                  }
                })
              }
            })
          })
        })

        observer.observe(document.body, {
          childList: true,
          subtree: true
        })

        // Setup pull-to-refresh listener
        window.addEventListener('pullToRefresh', () => {
          console.log('Pull to refresh triggered')
          // You can customize this behavior
          window.location.reload()
        })

        // Setup message listener for service worker communications
        navigator.serviceWorker?.addEventListener('message', (event) => {
          if (event.data.type === 'ADD_TO_CART_FROM_NOTIFICATION') {
            // Handle add to cart from notification
            const productId = event.data.productId
            console.log('Add to cart from notification:', productId)
            
            // Dispatch custom event that cart components can listen to
            window.dispatchEvent(new CustomEvent('addToCartFromNotification', {
              detail: { productId }
            }))
          }
        })

        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize mobile optimizations:', error)
        setIsInitialized(true) // Still mark as initialized to prevent blocking
      }
    }

    initializeMobileOptimizations()
  }, [isMobile, preloadCriticalResources, optimizeImagesForMobile, addButtonAnimation])

  // Add mobile-specific CSS classes to body
  useEffect(() => {
    if (typeof window === 'undefined') return

    const body = document.body
    
    if (isMobile) {
      body.classList.add('mobile-optimized')
    } else {
      body.classList.remove('mobile-optimized')
    }

    // Add CSS for mobile optimizations
    const style = document.createElement('style')
    style.id = 'mobile-optimization-styles'
    style.textContent = `
      .mobile-optimized {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      .mobile-optimized * {
        -webkit-overflow-scrolling: touch;
      }
      
      .mobile-optimized img {
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
      }
      
      .mobile-optimized input,
      .mobile-optimized textarea,
      .mobile-optimized select {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      
      @media (max-width: 768px) {
        .mobile-optimized {
          font-size: 16px; /* Prevent zoom on iOS */
        }
        
        .mobile-optimized button,
        .mobile-optimized [role="button"] {
          min-height: 44px;
          min-width: 44px;
        }
        
        .mobile-optimized .touch-target {
          padding: 12px;
          margin: 4px;
        }
      }
    `

    // Remove existing style if present
    const existingStyle = document.getElementById('mobile-optimization-styles')
    if (existingStyle) {
      existingStyle.remove()
    }

    document.head.appendChild(style)

    return () => {
      body.classList.remove('mobile-optimized')
      const styleToRemove = document.getElementById('mobile-optimization-styles')
      if (styleToRemove) {
        styleToRemove.remove()
      }
    }
  }, [isMobile])

  return <>{children}</>
}

// Export hook for components to check initialization status
export function useMobileOptimizationStatus() {
  const [isInitialized, setIsInitialized] = useState(false)
  
  useEffect(() => {
    // Check if mobile optimizations are loaded
    const checkInitialization = () => {
      const hasOptimizationStyles = document.getElementById('mobile-optimization-styles')
      const hasServiceWorker = 'serviceWorker' in navigator
      
      setIsInitialized(!!hasOptimizationStyles && hasServiceWorker)
    }

    checkInitialization()
    
    // Recheck after a short delay
    const timer = setTimeout(checkInitialization, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  return { isInitialized }
}