/**
 * Push notification system for order updates and marketing
 * Implements VAPID-based push notifications with user consent
 */

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  tag?: string
  data?: any
  actions?: NotificationAction[]
  requireInteraction?: boolean
  silent?: boolean
  vibrate?: number[]
}

export interface NotificationAction {
  action: string
  title: string
  icon?: string
}

export interface PushSubscriptionData {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
  userId?: string
  preferences: NotificationPreferences
}

export interface NotificationPreferences {
  orderUpdates: boolean
  promotions: boolean
  newArrivals: boolean
  backInStock: boolean
  priceDrops: boolean
}

export interface OrderNotificationData {
  orderId: string
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  trackingNumber?: string
  estimatedDelivery?: string
}

class PushNotificationManager {
  private swRegistration: ServiceWorkerRegistration | null = null
  private vapidPublicKey: string
  private subscription: PushSubscription | null = null
  private preferences: NotificationPreferences

  constructor(vapidPublicKey: string) {
    this.vapidPublicKey = vapidPublicKey
    this.preferences = this.loadPreferences()
    this.initialize()
  }

  /**
   * Initialize push notification system
   */
  private async initialize(): Promise<void> {
    if (!this.isSupported()) {
      console.warn('Push notifications not supported')
      return
    }

    try {
      // Register service worker
      this.swRegistration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered for push notifications')

      // Check for existing subscription
      this.subscription = await this.swRegistration.pushManager.getSubscription()
      
      if (this.subscription) {
        console.log('Existing push subscription found')
        await this.syncSubscription()
      }
    } catch (error) {
      console.error('Failed to initialize push notifications:', error)
    }
  }

  /**
   * Check if push notifications are supported
   */
  public isSupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    )
  }

  /**
   * Request notification permission from user
   */
  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Push notifications not supported')
    }

    const permission = await Notification.requestPermission()
    
    if (permission === 'granted') {
      console.log('Notification permission granted')
      await this.subscribe()
    } else {
      console.log('Notification permission denied')
    }

    return permission
  }

  /**
   * Subscribe to push notifications
   */
  public async subscribe(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      throw new Error('Service Worker not registered')
    }

    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey) as BufferSource
      })

      this.subscription = subscription
      await this.saveSubscription(subscription)
      
      console.log('Push notification subscription successful')
      return subscription
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return null
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  public async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return true
    }

    try {
      const success = await this.subscription.unsubscribe()
      
      if (success) {
        await this.removeSubscription()
        this.subscription = null
        console.log('Push notification unsubscription successful')
      }
      
      return success
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error)
      return false
    }
  }

  /**
   * Update notification preferences
   */
  public async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    this.preferences = { ...this.preferences, ...preferences }
    this.savePreferences()

    // Sync with server
    if (this.subscription) {
      await this.syncSubscription()
    }
  }

  /**
   * Get current notification preferences
   */
  public getPreferences(): NotificationPreferences {
    return { ...this.preferences }
  }

  /**
   * Send order update notification
   */
  public async sendOrderUpdate(orderData: OrderNotificationData): Promise<void> {
    if (!this.preferences.orderUpdates) {
      return
    }

    const notification = this.createOrderNotification(orderData)
    await this.sendNotification(notification)
  }

  /**
   * Send promotional notification
   */
  public async sendPromotion(title: string, body: string, imageUrl?: string): Promise<void> {
    if (!this.preferences.promotions) {
      return
    }

    const notification: NotificationPayload = {
      title,
      body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      image: imageUrl,
      tag: 'promotion',
      data: { type: 'promotion' },
      actions: [
        { action: 'view', title: 'View Offer', icon: '/icons/action-view.png' },
        { action: 'dismiss', title: 'Dismiss', icon: '/icons/action-dismiss.png' }
      ]
    }

    await this.sendNotification(notification)
  }

  /**
   * Send new arrivals notification
   */
  public async sendNewArrivals(productCount: number, collectionName?: string): Promise<void> {
    if (!this.preferences.newArrivals) {
      return
    }

    const title = 'New Arrivals at bibiere'
    const body = collectionName 
      ? `${productCount} new pieces in ${collectionName} collection`
      : `${productCount} new luxury pieces just arrived`

    const notification: NotificationPayload = {
      title,
      body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: 'new-arrivals',
      data: { type: 'new-arrivals', collection: collectionName },
      actions: [
        { action: 'browse', title: 'Browse Now', icon: '/icons/action-browse.png' },
        { action: 'dismiss', title: 'Later', icon: '/icons/action-later.png' }
      ]
    }

    await this.sendNotification(notification)
  }

  /**
   * Send back in stock notification
   */
  public async sendBackInStock(productName: string, productId: string): Promise<void> {
    if (!this.preferences.backInStock) {
      return
    }

    const notification: NotificationPayload = {
      title: 'Back in Stock!',
      body: `${productName} is now available`,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: `back-in-stock-${productId}`,
      data: { type: 'back-in-stock', productId },
      actions: [
        { action: 'view-product', title: 'View Product', icon: '/icons/action-view.png' },
        { action: 'add-to-cart', title: 'Add to Cart', icon: '/icons/action-cart.png' }
      ],
      requireInteraction: true
    }

    await this.sendNotification(notification)
  }

  /**
   * Create order notification based on status
   */
  private createOrderNotification(orderData: OrderNotificationData): NotificationPayload {
    const { orderId, status, trackingNumber, estimatedDelivery } = orderData

    const notifications = {
      confirmed: {
        title: 'Order Confirmed',
        body: `Your order #${orderId} has been confirmed and is being prepared.`,
        actions: [
          { action: 'view-order', title: 'View Order', icon: '/icons/action-view.png' }
        ]
      },
      processing: {
        title: 'Order Processing',
        body: `Your order #${orderId} is being carefully prepared by our artisans.`,
        actions: [
          { action: 'view-order', title: 'View Order', icon: '/icons/action-view.png' }
        ]
      },
      shipped: {
        title: 'Order Shipped',
        body: trackingNumber 
          ? `Your order #${orderId} has shipped. Tracking: ${trackingNumber}`
          : `Your order #${orderId} has been shipped and is on its way.`,
        actions: [
          { action: 'track-order', title: 'Track Package', icon: '/icons/action-track.png' },
          { action: 'view-order', title: 'View Order', icon: '/icons/action-view.png' }
        ]
      },
      delivered: {
        title: 'Order Delivered',
        body: `Your order #${orderId} has been delivered. We hope you love your new pieces!`,
        actions: [
          { action: 'rate-order', title: 'Rate Experience', icon: '/icons/action-rate.png' },
          { action: 'view-order', title: 'View Order', icon: '/icons/action-view.png' }
        ]
      },
      cancelled: {
        title: 'Order Cancelled',
        body: `Your order #${orderId} has been cancelled. Refund will be processed within 3-5 business days.`,
        actions: [
          { action: 'view-order', title: 'View Details', icon: '/icons/action-view.png' }
        ]
      }
    }

    const config = notifications[status]
    
    return {
      title: config.title,
      body: config.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      tag: `order-${orderId}`,
      data: { 
        type: 'order-update', 
        orderId, 
        status, 
        trackingNumber,
        estimatedDelivery 
      },
      actions: config.actions,
      vibrate: [200, 100, 200]
    }
  }

  /**
   * Send notification to service worker
   */
  private async sendNotification(payload: NotificationPayload): Promise<void> {
    if (!this.subscription) {
      console.warn('No push subscription available')
      return
    }

    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscription: this.subscription,
          payload
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.statusText}`)
      }

      console.log('Notification sent successfully')
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  /**
   * Save subscription to server
   */
  private async saveSubscription(subscription: PushSubscription): Promise<void> {
    const subscriptionData: PushSubscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
        auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
      },
      preferences: this.preferences
    }

    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscriptionData)
      })

      if (!response.ok) {
        throw new Error(`Failed to save subscription: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to save subscription:', error)
    }
  }

  /**
   * Remove subscription from server
   */
  private async removeSubscription(): Promise<void> {
    if (!this.subscription) return

    try {
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: this.subscription.endpoint
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to remove subscription: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to remove subscription:', error)
    }
  }

  /**
   * Sync subscription with server
   */
  private async syncSubscription(): Promise<void> {
    if (!this.subscription) return

    await this.saveSubscription(this.subscription)
  }

  /**
   * Load preferences from localStorage
   */
  private loadPreferences(): NotificationPreferences {
    const stored = localStorage.getItem('notification-preferences')
    
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (error) {
        console.warn('Failed to parse stored preferences')
      }
    }

    // Default preferences
    return {
      orderUpdates: true,
      promotions: false,
      newArrivals: false,
      backInStock: true,
      priceDrops: false
    }
  }

  /**
   * Save preferences to localStorage
   */
  private savePreferences(): void {
    localStorage.setItem('notification-preferences', JSON.stringify(this.preferences))
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return new Uint8Array(outputArray.buffer)
  }

  /**
   * Convert ArrayBuffer to base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    
    return window.btoa(binary)
  }

  /**
   * Get subscription status
   */
  public getSubscriptionStatus(): {
    isSubscribed: boolean
    permission: NotificationPermission
    isSupported: boolean
  } {
    return {
      isSubscribed: !!this.subscription,
      permission: Notification.permission,
      isSupported: this.isSupported()
    }
  }
}

// VAPID public key (should be stored in environment variables)
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9f8HnKJuOmqmkNopG6RwhQIlXxBfgUjdQRHSS0wuQ7EvPiSKBDQc'

// Initialize push notification manager
export const pushNotificationManager = typeof window !== 'undefined' 
  ? new PushNotificationManager(VAPID_PUBLIC_KEY)
  : null

// Export types and manager
export { PushNotificationManager }