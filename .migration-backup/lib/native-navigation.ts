/**
 * Native app-like navigation and interactions for mobile PWA
 * Implements smooth transitions, gestures, and native-feeling interactions
 */

export interface NavigationConfig {
  enableSwipeGestures: boolean
  enablePullToRefresh: boolean
  enableHapticFeedback: boolean
  enableSmoothTransitions: boolean
  enableBottomNavigation: boolean
}

export interface SwipeGestureConfig {
  threshold: number
  velocity: number
  direction: 'horizontal' | 'vertical' | 'both'
}

export interface HapticPattern {
  type: 'light' | 'medium' | 'heavy' | 'selection' | 'impact' | 'notification'
  pattern?: number[]
}

class NativeNavigationManager {
  private config: NavigationConfig
  private swipeHandlers: Map<string, (direction: string) => void> = new Map()
  private touchStartX = 0
  private touchStartY = 0
  private touchEndX = 0
  private touchEndY = 0
  private isNavigating = false
  private navigationHistory: string[] = []

  constructor(config: NavigationConfig) {
    this.config = config
    this.initialize()
  }

  /**
   * Initialize native navigation features
   */
  private initialize(): void {
    if (typeof window === 'undefined') return

    // Setup smooth transitions
    if (this.config.enableSmoothTransitions) {
      this.setupSmoothTransitions()
    }

    // Setup swipe gestures
    if (this.config.enableSwipeGestures) {
      this.setupSwipeGestures()
    }

    // Setup pull to refresh
    if (this.config.enablePullToRefresh) {
      this.setupPullToRefresh()
    }

    // Setup bottom navigation
    if (this.config.enableBottomNavigation) {
      this.setupBottomNavigation()
    }

    // Setup native-like scrolling
    this.setupNativeScrolling()

    // Setup page transitions
    this.setupPageTransitions()

    // Setup back button handling
    this.setupBackButtonHandling()
  }

  /**
   * Setup smooth page transitions
   */
  private setupSmoothTransitions(): void {
    // Add CSS for smooth transitions
    const style = document.createElement('style')
    style.textContent = `
      .page-transition-enter {
        opacity: 0;
        transform: translateX(100%);
      }
      
      .page-transition-enter-active {
        opacity: 1;
        transform: translateX(0);
        transition: opacity 300ms ease-out, transform 300ms ease-out;
      }
      
      .page-transition-exit {
        opacity: 1;
        transform: translateX(0);
      }
      
      .page-transition-exit-active {
        opacity: 0;
        transform: translateX(-100%);
        transition: opacity 300ms ease-out, transform 300ms ease-out;
      }
      
      .slide-up-enter {
        opacity: 0;
        transform: translateY(100%);
      }
      
      .slide-up-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 250ms ease-out, transform 250ms ease-out;
      }
      
      .slide-up-exit {
        opacity: 1;
        transform: translateY(0);
      }
      
      .slide-up-exit-active {
        opacity: 0;
        transform: translateY(100%);
        transition: opacity 250ms ease-out, transform 250ms ease-out;
      }
      
      .fade-transition {
        transition: opacity 200ms ease-in-out;
      }
      
      .scale-transition {
        transition: transform 200ms ease-out;
      }
      
      .scale-transition:active {
        transform: scale(0.95);
      }
    `
    document.head.appendChild(style)
  }

  /**
   * Setup swipe gesture handling
   */
  private setupSwipeGestures(): void {
    let startTime = 0

    document.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX
      this.touchStartY = e.touches[0].clientY
      startTime = Date.now()
    }, { passive: true })

    document.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX
      this.touchEndY = e.changedTouches[0].clientY
      
      const endTime = Date.now()
      const timeDiff = endTime - startTime
      
      // Only process quick swipes (under 300ms)
      if (timeDiff < 300) {
        this.handleSwipeGesture()
      }
    }, { passive: true })
  }

  /**
   * Handle swipe gesture detection
   */
  private handleSwipeGesture(): void {
    const deltaX = this.touchEndX - this.touchStartX
    const deltaY = this.touchEndY - this.touchStartY
    const threshold = 50
    const velocity = 0.3

    // Horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > threshold) {
        this.triggerSwipeHandler('right')
        this.handleSwipeRight()
      } else if (deltaX < -threshold) {
        this.triggerSwipeHandler('left')
        this.handleSwipeLeft()
      }
    }
    // Vertical swipes
    else if (Math.abs(deltaY) > threshold) {
      if (deltaY > threshold) {
        this.triggerSwipeHandler('down')
        this.handleSwipeDown()
      } else if (deltaY < -threshold) {
        this.triggerSwipeHandler('up')
        this.handleSwipeUp()
      }
    }
  }

  /**
   * Handle swipe right (back navigation)
   */
  private handleSwipeRight(): void {
    // Implement back navigation on swipe right
    if (this.navigationHistory.length > 1) {
      this.triggerHapticFeedback({ type: 'light' })
      this.navigateBack()
    }
  }

  /**
   * Handle swipe left (forward navigation or close)
   */
  private handleSwipeLeft(): void {
    // Close modals or drawers on swipe left
    const openModal = document.querySelector('.modal.open, .drawer.open')
    if (openModal) {
      this.triggerHapticFeedback({ type: 'light' })
      this.closeModal(openModal as HTMLElement)
    }
  }

  /**
   * Handle swipe up (show more content or open bottom sheet)
   */
  private handleSwipeUp(): void {
    // Trigger pull-up actions
    const pullUpElement = document.querySelector('[data-swipe-up]')
    if (pullUpElement) {
      this.triggerHapticFeedback({ type: 'medium' })
      pullUpElement.dispatchEvent(new CustomEvent('swipeUp'))
    }
  }

  /**
   * Handle swipe down (refresh or close)
   */
  private handleSwipeDown(): void {
    // Close full-screen modals or trigger refresh
    const fullScreenModal = document.querySelector('.modal.fullscreen.open')
    if (fullScreenModal) {
      this.triggerHapticFeedback({ type: 'light' })
      this.closeModal(fullScreenModal as HTMLElement)
    }
  }

  /**
   * Setup pull to refresh functionality
   */
  private setupPullToRefresh(): void {
    let startY = 0
    let currentY = 0
    let isPulling = false
    let refreshThreshold = 80

    const refreshIndicator = this.createRefreshIndicator()

    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY
        isPulling = true
      }
    }, { passive: true })

    document.addEventListener('touchmove', (e) => {
      if (!isPulling) return

      currentY = e.touches[0].clientY
      const pullDistance = currentY - startY

      if (pullDistance > 0 && pullDistance < 150) {
        e.preventDefault()
        this.updateRefreshIndicator(refreshIndicator, pullDistance, refreshThreshold)
      }
    })

    document.addEventListener('touchend', () => {
      if (!isPulling) return

      const pullDistance = currentY - startY
      
      if (pullDistance > refreshThreshold) {
        this.triggerHapticFeedback({ type: 'medium' })
        this.triggerRefresh()
      }
      
      this.hideRefreshIndicator(refreshIndicator)
      isPulling = false
    }, { passive: true })
  }

  /**
   * Create refresh indicator element
   */
  private createRefreshIndicator(): HTMLElement {
    const indicator = document.createElement('div')
    indicator.className = 'refresh-indicator'
    indicator.innerHTML = `
      <div class="refresh-spinner">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    `
    
    const style = document.createElement('style')
    style.textContent = `
      .refresh-indicator {
        position: fixed;
        top: -60px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        transition: top 0.3s ease;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      
      .refresh-spinner {
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(indicator)
    
    return indicator
  }

  /**
   * Update refresh indicator based on pull distance
   */
  private updateRefreshIndicator(indicator: HTMLElement, distance: number, threshold: number): void {
    const progress = Math.min(distance / threshold, 1)
    const opacity = Math.min(progress * 2, 1)
    
    indicator.style.top = `${Math.min(distance - 60, 20)}px`
    indicator.style.opacity = opacity.toString()
    
    if (progress >= 1) {
      indicator.classList.add('ready')
    } else {
      indicator.classList.remove('ready')
    }
  }

  /**
   * Hide refresh indicator
   */
  private hideRefreshIndicator(indicator: HTMLElement): void {
    indicator.style.top = '-60px'
    indicator.style.opacity = '0'
  }

  /**
   * Trigger page refresh
   */
  private triggerRefresh(): void {
    // Dispatch custom refresh event
    window.dispatchEvent(new CustomEvent('pullToRefresh'))
    
    // Default behavior: reload page after delay
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  /**
   * Setup bottom navigation for mobile
   */
  private setupBottomNavigation(): void {
    // Add safe area padding for devices with home indicator
    const style = document.createElement('style')
    style.textContent = `
      .bottom-navigation {
        padding-bottom: env(safe-area-inset-bottom);
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-top: 1px solid rgba(0, 0, 0, 0.1);
      }
      
      .bottom-nav-item {
        transition: transform 0.2s ease, color 0.2s ease;
      }
      
      .bottom-nav-item:active {
        transform: scale(0.9);
      }
      
      .bottom-nav-item.active {
        color: #8B1538;
      }
    `
    document.head.appendChild(style)
  }

  /**
   * Setup native-like scrolling behavior
   */
  private setupNativeScrolling(): void {
    // Enable momentum scrolling on iOS
    const style = document.createElement('style')
    style.textContent = `
      * {
        -webkit-overflow-scrolling: touch;
      }
      
      .scroll-container {
        scroll-behavior: smooth;
        overscroll-behavior: contain;
      }
      
      .horizontal-scroll {
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
      }
      
      .horizontal-scroll > * {
        scroll-snap-align: start;
      }
    `
    document.head.appendChild(style)
  }

  /**
   * Setup page transition animations
   */
  private setupPageTransitions(): void {
    // Intercept navigation clicks
    document.addEventListener('click', (e) => {
      const link = (e.target as Element).closest('a[href^="/"]')
      if (link && !link.hasAttribute('data-no-transition')) {
        e.preventDefault()
        this.navigateWithTransition((link as HTMLAnchorElement).href)
      }
    })
  }

  /**
   * Navigate with smooth transition
   */
  private navigateWithTransition(href: string): void {
    if (this.isNavigating) return

    this.isNavigating = true
    this.triggerHapticFeedback({ type: 'selection' })

    // Add current page to history
    this.navigationHistory.push(window.location.pathname)

    // Add exit animation
    document.body.classList.add('page-transition-exit')
    
    setTimeout(() => {
      window.location.href = href
    }, 150)
  }

  /**
   * Navigate back with animation
   */
  private navigateBack(): void {
    if (this.navigationHistory.length > 1) {
      this.navigationHistory.pop() // Remove current page
      const previousPage = this.navigationHistory[this.navigationHistory.length - 1]
      
      document.body.classList.add('page-transition-exit-reverse')
      
      setTimeout(() => {
        window.history.back()
      }, 150)
    }
  }

  /**
   * Setup back button handling
   */
  private setupBackButtonHandling(): void {
    window.addEventListener('popstate', (e) => {
      // Handle back button with animation
      document.body.classList.add('page-transition-enter-reverse')
      
      setTimeout(() => {
        document.body.classList.remove('page-transition-enter-reverse')
      }, 300)
    })
  }

  /**
   * Close modal with animation
   */
  private closeModal(modal: HTMLElement): void {
    modal.classList.add('slide-up-exit-active')
    
    setTimeout(() => {
      modal.classList.remove('open', 'slide-up-exit-active')
    }, 250)
  }

  /**
   * Trigger haptic feedback
   */
  public triggerHapticFeedback(pattern: HapticPattern): void {
    if (!this.config.enableHapticFeedback) return

    // Use Vibration API for haptic feedback
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        selection: [5],
        impact: [15, 10, 15],
        notification: [50, 50, 50]
      }

      const vibrationPattern = pattern.pattern || patterns[pattern.type] || [10]
      navigator.vibrate(vibrationPattern)
    }

    // Use Gamepad API for more advanced haptics if available
    if ('getGamepads' in navigator) {
      const gamepads = navigator.getGamepads()
      for (const gamepad of gamepads) {
        if (gamepad && gamepad.vibrationActuator) {
          const intensity = pattern.type === 'heavy' ? 1.0 : pattern.type === 'medium' ? 0.5 : 0.2
          gamepad.vibrationActuator.playEffect('dual-rumble', {
            duration: 100,
            strongMagnitude: intensity,
            weakMagnitude: intensity * 0.5
          })
        }
      }
    }
  }

  /**
   * Register swipe handler for specific element
   */
  public registerSwipeHandler(elementId: string, handler: (direction: string) => void): void {
    this.swipeHandlers.set(elementId, handler)
  }

  /**
   * Trigger registered swipe handler
   */
  private triggerSwipeHandler(direction: string): void {
    this.swipeHandlers.forEach((handler) => {
      handler(direction)
    })
  }

  /**
   * Add native-like button press animation
   */
  public addButtonAnimation(button: HTMLElement): void {
    button.addEventListener('touchstart', () => {
      button.classList.add('scale-transition')
      this.triggerHapticFeedback({ type: 'selection' })
    }, { passive: true })

    button.addEventListener('touchend', () => {
      setTimeout(() => {
        button.classList.remove('scale-transition')
      }, 200)
    }, { passive: true })
  }

  /**
   * Create native-like loading state
   */
  public showNativeLoading(message = 'Loading...'): HTMLElement {
    const loader = document.createElement('div')
    loader.className = 'native-loader'
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-spinner"></div>
        <div class="loader-message">${message}</div>
      </div>
    `

    const style = document.createElement('style')
    style.textContent = `
      .native-loader {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(4px);
      }
      
      .loader-content {
        background: white;
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      }
      
      .loader-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #8B1538;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 12px;
      }
      
      .loader-message {
        color: #333;
        font-size: 14px;
      }
    `
    document.head.appendChild(style)
    document.body.appendChild(loader)

    return loader
  }

  /**
   * Hide native loading state
   */
  public hideNativeLoading(loader: HTMLElement): void {
    loader.style.opacity = '0'
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader)
      }
    }, 200)
  }

  /**
   * Get navigation history
   */
  public getNavigationHistory(): string[] {
    return [...this.navigationHistory]
  }

  /**
   * Clear navigation history
   */
  public clearNavigationHistory(): void {
    this.navigationHistory = []
  }
}

// Default navigation configuration
export const defaultNavigationConfig: NavigationConfig = {
  enableSwipeGestures: true,
  enablePullToRefresh: true,
  enableHapticFeedback: true,
  enableSmoothTransitions: true,
  enableBottomNavigation: true
}

// Initialize native navigation manager
export function initializeNativeNavigation(config: Partial<NavigationConfig> = {}): NativeNavigationManager {
  const finalConfig = { ...defaultNavigationConfig, ...config }
  return new NativeNavigationManager(finalConfig)
}

// Export navigation manager instance
export const nativeNavigationManager = typeof window !== 'undefined' 
  ? initializeNativeNavigation() 
  : null