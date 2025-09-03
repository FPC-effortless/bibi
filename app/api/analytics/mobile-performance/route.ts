import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

interface MobilePerformanceData {
  name: string
  value: number
  rating?: string
  deviceType: 'mobile' | 'tablet' | 'desktop'
  connectionType: string
  screenSize: string
  timestamp: number
}

export async function POST(request: NextRequest) {
  try {
    const headersList = headers()
    const userAgent = headersList.get('user-agent') || ''
    const ip = headersList.get('x-forwarded-for') || 'unknown'

    const performanceData: MobilePerformanceData = await request.json()

    // Validate performance data
    if (!performanceData.name || typeof performanceData.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid performance data' },
        { status: 400 }
      )
    }

    // Extract additional context from headers
    const context = {
      userAgent,
      ip,
      serverTimestamp: new Date().toISOString(),
      ...performanceData
    }

    // In a real implementation, you would:
    // 1. Store the performance data in your analytics database
    // 2. Process the data for real-time monitoring
    // 3. Trigger alerts if performance degrades
    // 4. Aggregate data for reporting dashboards

    console.log('Mobile performance data received:', context)

    // Simulate performance monitoring logic
    if (performanceData.name === 'lcp' && performanceData.value > 2500) {
      console.warn('LCP performance degradation detected:', {
        value: performanceData.value,
        deviceType: performanceData.deviceType,
        connectionType: performanceData.connectionType
      })
    }

    if (performanceData.name === 'cls' && performanceData.value > 0.1) {
      console.warn('CLS performance issue detected:', {
        value: performanceData.value,
        deviceType: performanceData.deviceType
      })
    }

    if (performanceData.name === 'fid' && performanceData.value > 100) {
      console.warn('FID performance issue detected:', {
        value: performanceData.value,
        deviceType: performanceData.deviceType
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Performance data recorded successfully',
      timestamp: context.serverTimestamp
    })

  } catch (error) {
    console.error('Error recording mobile performance data:', error)
    
    return NextResponse.json(
      { error: 'Failed to record performance data' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Mobile performance analytics endpoint',
    methods: ['POST'],
    supportedMetrics: [
      'lcp', // Largest Contentful Paint
      'fid', // First Input Delay
      'cls', // Cumulative Layout Shift
      'fcp', // First Contentful Paint
      'ttfb', // Time to First Byte
      'mobile_long_task',
      'mobile_layout_shift'
    ]
  })
}