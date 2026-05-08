import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'

interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  tag?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
  requireInteraction?: boolean
  silent?: boolean
  vibrate?: number[]
}

interface SendNotificationRequest {
  subscription: {
    endpoint: string
    keys: {
      p256dh: string
      auth: string
    }
  }
  payload: NotificationPayload
}

// Configure web-push with VAPID keys
// In production, these should be stored in environment variables
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9f8HnKJuOmqmkNopG6RwhQIlXxBfgUjdQRHSS0wuQ7EvPiSKBDQc',
  privateKey: process.env.VAPID_PRIVATE_KEY || 'aUiz69ixfCTAIicttlBXrq_4LiKlV3K3jV5_2HLQVvg'
}

webpush.setVapidDetails(
  'mailto:notifications@bibiere.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

export async function POST(request: NextRequest) {
  try {
    const { subscription, payload }: SendNotificationRequest = await request.json()

    // Validate request data
    if (!subscription || !subscription.endpoint || !payload) {
      return NextResponse.json(
        { error: 'Invalid notification request' },
        { status: 400 }
      )
    }

    // Prepare the push subscription object
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      }
    }

    // Prepare notification payload
    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/icons/icon-192x192.png',
      badge: payload.badge || '/icons/badge-72x72.png',
      image: payload.image,
      tag: payload.tag,
      data: payload.data || {},
      actions: payload.actions || [],
      requireInteraction: payload.requireInteraction || false,
      silent: payload.silent || false,
      vibrate: payload.vibrate || [200, 100, 200],
      timestamp: Date.now()
    })

    // Send the push notification
    const result = await webpush.sendNotification(
      pushSubscription,
      notificationPayload,
      {
        TTL: 24 * 60 * 60, // 24 hours
        urgency: 'normal',
        topic: payload.tag
      }
    )

    console.log('Push notification sent successfully:', {
      endpoint: subscription.endpoint,
      title: payload.title,
      statusCode: result.statusCode,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully',
      statusCode: result.statusCode
    })

  } catch (error: any) {
    console.error('Error sending push notification:', error)

    // Handle specific web-push errors
    if (error.statusCode === 410) {
      // Subscription is no longer valid
      return NextResponse.json(
        { 
          error: 'Subscription expired',
          code: 'SUBSCRIPTION_EXPIRED',
          shouldUnsubscribe: true
        },
        { status: 410 }
      )
    }

    if (error.statusCode === 413) {
      // Payload too large
      return NextResponse.json(
        { error: 'Notification payload too large' },
        { status: 413 }
      )
    }

    if (error.statusCode === 429) {
      // Rate limited
      return NextResponse.json(
        { error: 'Rate limited. Please try again later.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Failed to send notification',
        details: error.message
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Push notification send endpoint',
    methods: ['POST'],
    vapidPublicKey: vapidKeys.publicKey
  })
}