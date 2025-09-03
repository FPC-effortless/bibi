import { NextRequest, NextResponse } from 'next/server'

/**
 * Analytics API endpoint for collecting user behavior data
 */

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  sessionId?: string
  timestamp?: number
}

export async function POST(request: NextRequest) {
  try {
    const event: AnalyticsEvent = await request.json()
    
    // Validate required fields
    if (!event.event || !event.sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: event, sessionId' },
        { status: 400 }
      )
    }

    // Add server timestamp if not provided
    if (!event.timestamp) {
      event.timestamp = Date.now()
    }

    // In production, you would send this to your analytics service
    // For now, we'll log it and store in a simple way
    console.log('Analytics Event:', JSON.stringify(event, null, 2))

    // Here you would typically:
    // 1. Send to Google Analytics 4
    // 2. Send to Mixpanel, Amplitude, or similar
    // 3. Store in your database
    // 4. Send to data warehouse
    
    await processAnalyticsEvent(event)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to process analytics event' },
      { status: 500 }
    )
  }
}

async function processAnalyticsEvent(event: AnalyticsEvent) {
  // Send to Google Analytics 4
  if (process.env.GA_MEASUREMENT_ID) {
    await sendToGA4(event)
  }

  // Send to custom analytics service
  if (process.env.ANALYTICS_WEBHOOK_URL) {
    await sendToWebhook(event)
  }

  // Store in database (if configured)
  if (process.env.DATABASE_URL) {
    await storeInDatabase(event)
  }
}

async function sendToGA4(event: AnalyticsEvent) {
  try {
    const measurementId = process.env.GA_MEASUREMENT_ID
    const apiSecret = process.env.GA_API_SECRET

    if (!measurementId || !apiSecret) {
      console.warn('GA4 credentials not configured')
      return
    }

    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: event.sessionId,
          user_id: event.userId,
          events: [
            {
              name: event.event,
              params: {
                ...event.properties,
                session_id: event.sessionId,
                timestamp_micros: (event.timestamp || Date.now()) * 1000,
              },
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      console.error('Failed to send to GA4:', response.statusText)
    }
  } catch (error) {
    console.error('GA4 send error:', error)
  }
}

async function sendToWebhook(event: AnalyticsEvent) {
  try {
    const webhookUrl = process.env.ANALYTICS_WEBHOOK_URL

    if (!webhookUrl) {
      console.warn('ANALYTICS_WEBHOOK_URL not configured, skipping webhook')
      return
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ANALYTICS_WEBHOOK_TOKEN}`,
      },
      body: JSON.stringify(event),
    })
  } catch (error) {
    console.error('Webhook send error:', error)
  }
}

async function storeInDatabase(event: AnalyticsEvent) {
  // This would integrate with your database
  // For example, using Prisma, Supabase, or similar
  try {
    // Example implementation:
    // await prisma.analyticsEvent.create({
    //   data: {
    //     event: event.event,
    //     properties: event.properties,
    //     userId: event.userId,
    //     sessionId: event.sessionId,
    //     timestamp: new Date(event.timestamp || Date.now()),
    //   },
    // })
    
    console.log('Would store in database:', event)
  } catch (error) {
    console.error('Database store error:', error)
  }
}
