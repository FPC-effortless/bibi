import { useEffect, useState, useCallback } from 'react'
import { mobileOptimizer } from '@/lib/mobile-optimization'
import { pushNotificationManager } from '@/lib/push-notifications'
import { nativeNavigationManager } from '@/lib/native-navigation'

export interface MobileOptimizationState {
  isOptimized: boolean
  deviceType: 'mobile' | 'tablet' | 'desktop'
  connectionType: string
  isSlowConnection: boolean
  notificationPermission: NotificationPermission
  isNotificationSupported: boolean
  isSubscribedToNotifications: boolean
}

export function useMobileOptimization() {
  const [state, setState] = useState<MobileOptimizationState>({
    isOptimized: false,
    deviceType: 'desktop',
    connectionType: 'unknown',
    isSlowConnection: false,
    notificationPermission: 'default',
    isNotificationSupported: false,
    isSubscribedToNotifications: false
  })

  const [isLoading, setIsLoading] = useState(true)

  // Initialize mobile optimizations
  useEffect(() => {
    if (typeof window === 'undefined') return

    const initializeOptimizations = async () => {
      try {
        // Get device information
        const deviceType = getDeviceType()
        const connectionType = getConnectionType()
        const isSlowConnection = checkSlowConnection()

        // Get notification status
        const notificationStatus = pushNotificationManager?.getSubscriptionStatus() || {
          isSubscribed: false,
          permission: 'default' as NotificationPermission,
          isSupported: false
        }

        setState({
          isOptimized: true,
          deviceType,
          connectionType,
          isSlowConnection,
          notificationPermission: notificationStatus.permission,
          isNotificationSupported: notificationStatus.isSupported,
          isSubscribedToNotifications: notificationStatus.isSubscribed
        })

        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize mobile optimizations:', error)
        setIsLoading(false)
      }
    }

    initializeOptimizations()
  }, [])

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!pushNotificationManager) {
      throw new Error('Push notifications not supported')
    }

    try {
      const permission = await pushNotificationManager.requestPermission()
      
      setState(prev => ({
        ...prev,
        notificationPermission: permission,
        isSubscribedToNotifications: permission === 'granted'
      }))

      return permission
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      throw error
    }
  }, [])

  // Update notification preferences
  const updateNotificationPreferences = useCallback(async (preferences: any) => {
    if (!pushNotificationManager) {
      throw new Error('Push notifications not supported')
    }

    try {
      await pushNotificationManager.updatePreferences(preferences)
    } catch (error) {
      console.error('Failed to update notification preferences:', error)
      throw error
    }
  }, [])

  // Get notification preferences
  const getNotificationPreferences = useCallback(() => {
    if (!pushNotificationManager) {
      return null
    }

    return pushNotificationManager.getPreferences()
  }, [])

  // Trigger haptic feedback
  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' | 'selection' | 'impact' | 'notification') => {
    if (nativeNavigationManager) {
      nativeNavigationManager.triggerHapticFeedback({ type })
    }
  }, [])

  // Show native loading
  const showNativeLoading = useCallback((message?: string) => {
    if (nativeNavigationManager) {
      return nativeNavigationManager.showNativeLoading(message)
    }
    return null
  }, [])

  // Hide native loading
  const hideNativeLoading = useCallback((loader: HTMLElement) => {
    if (nativeNavigationManager) {
      nativeNavigationManager.hideNativeLoading(loader)
    }
  }, [])

  // Add button animation
  const addButtonAnimation = useCallback((button: HTMLElement) => {
    if (nativeNavigationManager) {
      nativeNavigationManager.addButtonAnimation(button)
    }
  }, [])

  // Register swipe handler
  const registerSwipeHandler = useCallback((elementId: string, handler: (direction: string) => void) => {
    if (nativeNavigationManager) {
      nativeNavigationManager.registerSwipeHandler(elementId, handler)
    }
  }, [])

  // Get performance metrics
  const getPerformanceMetrics = useCallback(() => {
    if (mobileOptimizer) {
      return mobileOptimizer.getMetrics()
    }
    return null
  }, [])

  // Preload critical resources for mobile
  const preloadCriticalResources = useCallback((resources: string[]) => {
    if (state.deviceType === 'mobile' && !state.isSlowConnection) {
      resources.forEach(resource => {
        const link = document.createElement('link')
        link.rel = 'preload'
        
        if (resource.endsWith('.woff2') || resource.endsWith('.woff')) {
          link.as = 'font'
          link.type = 'font/woff2'
          link.crossOrigin = 'anonymous'
        } else if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
          link.as = 'image'
        } else if (resource.endsWith('.css')) {
          link.as = 'style'
        } else if (resource.endsWith('.js')) {
          link.as = 'script'
        }
        
        link.href = resource
        document.head.appendChild(link)
      })
    }
  }, [state.deviceType, state.isSlowConnection])

  // Optimize images for mobile
  const optimizeImagesForMobile = useCallback(() => {
    if (state.deviceType === 'mobile') {
      const images = document.querySelectorAll('img')
      
      images.forEach(img => {
        // Add loading="lazy" if not already present
        if (!img.hasAttribute('loading')) {
          img.loading = 'lazy'
        }

        // Add decoding="async" for better performance
        if (!img.hasAttribute('decoding')) {
          img.decoding = 'async'
        }

        // Set appropriate sizes for mobile
        if (!img.sizes) {
          img.sizes = '(max-width: 768px) 100vw, 50vw'
        }
      })
    }
  }, [state.deviceType])

  return {
    // State
    ...state,
    isLoading,

    // Notification methods
    requestNotificationPermission,
    updateNotificationPreferences,
    getNotificationPreferences,

    // Navigation methods
    triggerHapticFeedback,
    showNativeLoading,
    hideNativeLoading,
    addButtonAnimation,
    registerSwipeHandler,

    // Performance methods
    getPerformanceMetrics,
    preloadCriticalResources,
    optimizeImagesForMobile,

    // Utility methods
    isMobile: state.deviceType === 'mobile',
    isTablet: state.deviceType === 'tablet',
    isDesktop: state.deviceType === 'desktop'
  }
}

// Helper functions
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

function getConnectionType(): string {
  if (typeof navigator === 'undefined') return 'unknown'
  
  const connection = (navigator as any).connection
  return connection?.effectiveType || 'unknown'
}

function checkSlowConnection(): boolean {
  if (typeof navigator === 'undefined') return false
  
  const connection = (navigator as any).connection
  if (!connection) return false

  return (
    connection.effectiveType === 'slow-2g' ||
    connection.effectiveType === '2g' ||
    connection.saveData === true
  )
}