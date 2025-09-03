/**
 * @jest-environment jsdom
 */

import { PushNotificationManager } from '@/lib/push-notifications'

// Mock service worker registration
const mockServiceWorkerRegistration = {
  pushManager: {
    getSubscription: jest.fn(),
    subscribe: jest.fn()
  }
}

// Mock push subscription
const mockPushSubscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/test',
  getKey: jest.fn((name: string) => {
    const keys = {
      p256dh: new ArrayBuffer(65),
      auth: new ArrayBuffer(16)
    }
    return keys[name as keyof typeof keys]
  }),
  unsubscribe: jest.fn()
}

// Mock navigator.serviceWorker
Object.defineProperty(navigator, 'serviceWorker', {
  writable: true,
  value: {
    register: jest.fn().mockResolvedValue(mockServiceWorkerRegistration),
    addEventListener: jest.fn()
  }
})

// Mock Notification API
Object.defineProperty(window, 'Notification', {
  writable: true,
  value: {
    permission: 'default',
    requestPermission: jest.fn().mockResolvedValue('granted')
  }
})

// Mock PushManager
Object.defineProperty(window, 'PushManager', {
  writable: true,
  value: jest.fn()
})

// Mock fetch
global.fetch = jest.fn()

describe('Push Notification Manager', () => {
  let pushManager: PushNotificationManager
  const testVapidKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9f8HnKJuOmqmkNopG6RwhQIlXxBfgUjdQRHSS0wuQ7EvPiSKBDQc'

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
    
    // Reset localStorage
    localStorage.clear()
    
    // Mock successful fetch responses
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    })
    
    pushManager = new PushNotificationManager(testVapidKey)
  })

  test('initializes with VAPID key', () => {
    expect(pushManager).toBeDefined()
  })

  test('checks if push notifications are supported', () => {
    const isSupported = pushManager.isSupported()
    expect(isSupported).toBe(true)
  })

  test('requests notification permission', async () => {
    const permission = await pushManager.requestPermission()
    
    expect(window.Notification.requestPermission).toHaveBeenCalled()
    expect(permission).toBe('granted')
  })

  test('subscribes to push notifications', async () => {
    mockServiceWorkerRegistration.pushManager.subscribe.mockResolvedValue(mockPushSubscription)
    
    const subscription = await pushManager.subscribe()
    
    expect(mockServiceWorkerRegistration.pushManager.subscribe).toHaveBeenCalledWith({
      userVisibleOnly: true,
      applicationServerKey: expect.any(Uint8Array)
    })
    expect(subscription).toBe(mockPushSubscription)
  })

  test('unsubscribes from push notifications', async () => {
    // Set up existing subscription
    mockServiceWorkerRegistration.pushManager.getSubscription.mockResolvedValue(mockPushSubscription)
    mockPushSubscription.unsubscribe.mockResolvedValue(true)
    
    await pushManager.subscribe()
    const success = await pushManager.unsubscribe()
    
    expect(mockPushSubscription.unsubscribe).toHaveBeenCalled()
    expect(success).toBe(true)
  })

  test('updates notification preferences', async () => {
    const preferences = {
      orderUpdates: true,
      promotions: false,
      newArrivals: true,
      backInStock: true,
      priceDrops: false
    }
    
    await pushManager.updatePreferences(preferences)
    
    const savedPreferences = pushManager.getPreferences()
    expect(savedPreferences).toMatchObject(preferences)
  })

  test('gets notification preferences', () => {
    const preferences = pushManager.getPreferences()
    
    expect(preferences).toHaveProperty('orderUpdates')
    expect(preferences).toHaveProperty('promotions')
    expect(preferences).toHaveProperty('newArrivals')
    expect(preferences).toHaveProperty('backInStock')
    expect(preferences).toHaveProperty('priceDrops')
  })

  test('sends order update notification', async () => {
    const orderData = {
      orderId: 'ORD-123',
      status: 'shipped' as const,
      trackingNumber: 'TRK-456'
    }
    
    await pushManager.sendOrderUpdate(orderData)
    
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/notifications/send',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    )
  })

  test('sends promotional notification', async () => {
    await pushManager.sendPromotion('Sale Alert', '50% off selected items', '/images/sale.jpg')
    
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/notifications/send',
      expect.objectContaining({
        method: 'POST'
      })
    )
  })

  test('sends new arrivals notification', async () => {
    await pushManager.sendNewArrivals(5, 'Evening Collection')
    
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/notifications/send',
      expect.objectContaining({
        method: 'POST'
      })
    )
  })

  test('sends back in stock notification', async () => {
    await pushManager.sendBackInStock('Elegant Evening Dress', 'prod-123')
    
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/notifications/send',
      expect.objectContaining({
        method: 'POST'
      })
    )
  })

  test('creates correct order notification for different statuses', async () => {
    const orderData = {
      orderId: 'ORD-123',
      status: 'delivered' as const
    }
    
    await pushManager.sendOrderUpdate(orderData)
    
    const fetchCall = (global.fetch as jest.Mock).mock.calls[0]
    const requestBody = JSON.parse(fetchCall[1].body)
    
    expect(requestBody.payload.title).toBe('Order Delivered')
    expect(requestBody.payload.body).toContain('ORD-123')
    expect(requestBody.payload.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ action: 'rate-order' })
      ])
    )
  })

  test('respects notification preferences', async () => {
    // Disable promotions
    await pushManager.updatePreferences({ promotions: false })
    
    await pushManager.sendPromotion('Test Promo', 'Test message')
    
    // Should not send notification when preference is disabled
    expect(global.fetch).not.toHaveBeenCalled()
  })

  test('gets subscription status', () => {
    const status = pushManager.getSubscriptionStatus()
    
    expect(status).toHaveProperty('isSubscribed')
    expect(status).toHaveProperty('permission')
    expect(status).toHaveProperty('isSupported')
  })

  test('handles subscription errors gracefully', async () => {
    mockServiceWorkerRegistration.pushManager.subscribe.mockRejectedValue(new Error('Subscription failed'))
    
    const subscription = await pushManager.subscribe()
    
    expect(subscription).toBeNull()
  })

  test('handles notification send errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))
    
    // Should not throw error
    await expect(pushManager.sendPromotion('Test', 'Test')).resolves.not.toThrow()
  })

  test('converts VAPID key to Uint8Array correctly', () => {
    // This tests the internal urlBase64ToUint8Array method
    const result = pushManager.subscribe()
    
    expect(mockServiceWorkerRegistration.pushManager.subscribe).toHaveBeenCalledWith({
      userVisibleOnly: true,
      applicationServerKey: expect.any(Uint8Array)
    })
  })

  test('saves and loads preferences from localStorage', () => {
    const preferences = {
      orderUpdates: false,
      promotions: true,
      newArrivals: false,
      backInStock: true,
      priceDrops: true
    }
    
    // Create new instance to test loading from localStorage
    localStorage.setItem('notification-preferences', JSON.stringify(preferences))
    const newPushManager = new PushNotificationManager(testVapidKey)
    
    expect(newPushManager.getPreferences()).toMatchObject(preferences)
  })
})

describe('Push Notification Error Handling', () => {
  test('handles unsupported browsers gracefully', () => {
    // Mock unsupported browser
    delete (navigator as any).serviceWorker
    delete (window as any).PushManager
    delete (window as any).Notification
    
    const pushManager = new PushNotificationManager('test-key')
    
    expect(pushManager.isSupported()).toBe(false)
  })

  test('handles permission denied gracefully', async () => {
    window.Notification.requestPermission = jest.fn().mockResolvedValue('denied')
    
    const pushManager = new PushNotificationManager('test-key')
    const permission = await pushManager.requestPermission()
    
    expect(permission).toBe('denied')
  })
})