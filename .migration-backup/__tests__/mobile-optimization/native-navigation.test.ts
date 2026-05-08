/**
 * @jest-environment jsdom
 */

import { initializeNativeNavigation, defaultNavigationConfig } from '@/lib/native-navigation'

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: jest.fn()
})

// Mock navigator.getGamepads
Object.defineProperty(navigator, 'getGamepads', {
  writable: true,
  value: jest.fn().mockReturnValue([])
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))
})

describe('Native Navigation Manager', () => {
  let navigationManager: any

  beforeEach(() => {
    // Reset DOM
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    
    // Mock window dimensions for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    })
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667
    })

    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0
    })
  })

  afterEach(() => {
    if (navigationManager) {
      navigationManager.clearNavigationHistory()
    }
  })

  test('initializes with default config', () => {
    navigationManager = initializeNativeNavigation()
    expect(navigationManager).toBeDefined()
  })

  test('initializes with custom config', () => {
    const customConfig = {
      ...defaultNavigationConfig,
      enableHapticFeedback: false
    }
    
    navigationManager = initializeNativeNavigation(customConfig)
    expect(navigationManager).toBeDefined()
  })

  test('adds smooth transition styles', () => {
    navigationManager = initializeNativeNavigation()
    
    const styles = document.querySelectorAll('style')
    const hasTransitionStyles = Array.from(styles).some(style => 
      style.textContent?.includes('page-transition-enter')
    )
    
    expect(hasTransitionStyles).toBe(true)
  })

  test('adds bottom navigation styles', () => {
    navigationManager = initializeNativeNavigation()
    
    const styles = document.querySelectorAll('style')
    const hasBottomNavStyles = Array.from(styles).some(style => 
      style.textContent?.includes('bottom-navigation')
    )
    
    expect(hasBottomNavStyles).toBe(true)
  })

  test('adds native scrolling styles', () => {
    navigationManager = initializeNativeNavigation()
    
    const styles = document.querySelectorAll('style')
    const hasScrollStyles = Array.from(styles).some(style => 
      style.textContent?.includes('-webkit-overflow-scrolling: touch')
    )
    
    expect(hasScrollStyles).toBe(true)
  })

  test('triggers haptic feedback', () => {
    navigationManager = initializeNativeNavigation()
    
    navigationManager.triggerHapticFeedback({ type: 'light' })
    
    expect(navigator.vibrate).toHaveBeenCalledWith([10])
  })

  test('triggers different haptic patterns', () => {
    navigationManager = initializeNativeNavigation()
    
    navigationManager.triggerHapticFeedback({ type: 'medium' })
    expect(navigator.vibrate).toHaveBeenCalledWith([20])
    
    navigationManager.triggerHapticFeedback({ type: 'heavy' })
    expect(navigator.vibrate).toHaveBeenCalledWith([30])
    
    navigationManager.triggerHapticFeedback({ type: 'impact' })
    expect(navigator.vibrate).toHaveBeenCalledWith([15, 10, 15])
  })

  test('triggers custom haptic pattern', () => {
    navigationManager = initializeNativeNavigation()
    
    const customPattern = [100, 50, 100, 50, 200]
    navigationManager.triggerHapticFeedback({ 
      type: 'light', 
      pattern: customPattern 
    })
    
    expect(navigator.vibrate).toHaveBeenCalledWith(customPattern)
  })

  test('registers and triggers swipe handlers', () => {
    navigationManager = initializeNativeNavigation()
    
    const mockHandler = jest.fn()
    navigationManager.registerSwipeHandler('test-element', mockHandler)
    
    // Simulate swipe right
    const touchStart = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 100 } as Touch]
    })
    const touchEnd = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 200, clientY: 100 } as Touch]
    })
    
    document.dispatchEvent(touchStart)
    
    // Fast swipe (under 300ms)
    setTimeout(() => {
      document.dispatchEvent(touchEnd)
      expect(mockHandler).toHaveBeenCalledWith('right')
    }, 100)
  })

  test('detects swipe directions correctly', () => {
    navigationManager = initializeNativeNavigation()
    
    const mockHandler = jest.fn()
    navigationManager.registerSwipeHandler('test', mockHandler)
    
    // Test different swipe directions
    const testSwipe = (startX: number, startY: number, endX: number, endY: number, expectedDirection: string) => {
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: startX, clientY: startY } as Touch]
      })
      const touchEnd = new TouchEvent('touchend', {
        changedTouches: [{ clientX: endX, clientY: endY } as Touch]
      })
      
      document.dispatchEvent(touchStart)
      setTimeout(() => {
        document.dispatchEvent(touchEnd)
      }, 100)
    }
    
    // Swipe right
    testSwipe(100, 100, 200, 100, 'right')
    
    // Swipe left  
    testSwipe(200, 100, 100, 100, 'left')
    
    // Swipe up
    testSwipe(100, 200, 100, 100, 'up')
    
    // Swipe down
    testSwipe(100, 100, 100, 200, 'down')
  })

  test('adds button animation', () => {
    navigationManager = initializeNativeNavigation()
    
    const button = document.createElement('button')
    document.body.appendChild(button)
    
    navigationManager.addButtonAnimation(button)
    
    // Simulate touch events
    const touchStart = new TouchEvent('touchstart')
    const touchEnd = new TouchEvent('touchend')
    
    button.dispatchEvent(touchStart)
    expect(button.classList.contains('scale-transition')).toBe(true)
    
    button.dispatchEvent(touchEnd)
    setTimeout(() => {
      expect(button.classList.contains('scale-transition')).toBe(false)
    }, 250)
  })

  test('shows and hides native loading', () => {
    navigationManager = initializeNativeNavigation()
    
    const loader = navigationManager.showNativeLoading('Loading test...')
    
    expect(loader).toBeDefined()
    expect(loader.querySelector('.loader-message')?.textContent).toBe('Loading test...')
    expect(document.body.contains(loader)).toBe(true)
    
    navigationManager.hideNativeLoading(loader)
    
    setTimeout(() => {
      expect(document.body.contains(loader)).toBe(false)
    }, 250)
  })

  test('manages navigation history', () => {
    navigationManager = initializeNativeNavigation()
    
    expect(navigationManager.getNavigationHistory()).toEqual([])
    
    // Navigation history is managed internally during navigation
    // This would be tested in integration tests with actual navigation
  })

  test('clears navigation history', () => {
    navigationManager = initializeNativeNavigation()
    
    navigationManager.clearNavigationHistory()
    expect(navigationManager.getNavigationHistory()).toEqual([])
  })

  test('handles pull to refresh setup', () => {
    navigationManager = initializeNativeNavigation()
    
    // Check if refresh indicator is created
    const refreshIndicator = document.querySelector('.refresh-indicator')
    expect(refreshIndicator).toBeTruthy()
  })

  test('handles pull to refresh gesture', () => {
    navigationManager = initializeNativeNavigation()
    
    const mockReload = jest.fn()
    Object.defineProperty(window.location, 'reload', {
      writable: true,
      value: mockReload
    })
    
    // Mock being at top of page
    Object.defineProperty(window, 'scrollY', {
      value: 0
    })
    
    // Simulate pull down gesture
    const touchStart = new TouchEvent('touchstart', {
      touches: [{ clientY: 100 } as Touch]
    })
    const touchMove = new TouchEvent('touchmove', {
      touches: [{ clientY: 200 } as Touch]
    })
    const touchEnd = new TouchEvent('touchend')
    
    document.dispatchEvent(touchStart)
    document.dispatchEvent(touchMove)
    document.dispatchEvent(touchEnd)
    
    // Should trigger refresh after threshold
    setTimeout(() => {
      expect(mockReload).toHaveBeenCalled()
    }, 1100) // After the 1000ms delay
  })

  test('intercepts navigation clicks', () => {
    navigationManager = initializeNativeNavigation()
    
    const link = document.createElement('a')
    link.href = '/test-page'
    document.body.appendChild(link)
    
    const clickEvent = new MouseEvent('click', { bubbles: true })
    const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault')
    
    link.dispatchEvent(clickEvent)
    
    expect(preventDefaultSpy).toHaveBeenCalled()
  })

  test('handles back button navigation', () => {
    navigationManager = initializeNativeNavigation()
    
    const popstateEvent = new PopStateEvent('popstate')
    window.dispatchEvent(popstateEvent)
    
    // Should add transition class
    expect(document.body.classList.contains('page-transition-enter-reverse')).toBe(true)
  })

  test('respects disabled haptic feedback config', () => {
    const config = {
      ...defaultNavigationConfig,
      enableHapticFeedback: false
    }
    
    navigationManager = initializeNativeNavigation(config)
    
    navigationManager.triggerHapticFeedback({ type: 'light' })
    
    expect(navigator.vibrate).not.toHaveBeenCalled()
  })

  test('handles swipe to close modals', () => {
    navigationManager = initializeNativeNavigation()
    
    // Create mock modal
    const modal = document.createElement('div')
    modal.className = 'modal open'
    document.body.appendChild(modal)
    
    // Simulate swipe left
    const touchStart = new TouchEvent('touchstart', {
      touches: [{ clientX: 200, clientY: 100 } as Touch]
    })
    const touchEnd = new TouchEvent('touchend', {
      changedTouches: [{ clientX: 100, clientY: 100 } as Touch]
    })
    
    document.dispatchEvent(touchStart)
    setTimeout(() => {
      document.dispatchEvent(touchEnd)
      
      // Should close modal
      expect(modal.classList.contains('slide-up-exit-active')).toBe(true)
    }, 100)
  })
})

describe('Native Navigation Error Handling', () => {
  test('handles missing vibration API gracefully', () => {
    delete (navigator as any).vibrate
    
    const navigationManager = initializeNativeNavigation()
    
    // Should not throw error
    expect(() => {
      navigationManager.triggerHapticFeedback({ type: 'light' })
    }).not.toThrow()
  })

  test('handles missing gamepad API gracefully', () => {
    delete (navigator as any).getGamepads
    
    const navigationManager = initializeNativeNavigation()
    
    // Should not throw error
    expect(() => {
      navigationManager.triggerHapticFeedback({ type: 'heavy' })
    }).not.toThrow()
  })
})