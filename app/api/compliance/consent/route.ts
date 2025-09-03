import { NextRequest, NextResponse } from 'next/server';
import { complianceManager, CookieConsent } from '@/lib/legal-compliance';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { consent, userId } = body;

    if (!consent || typeof consent !== 'object') {
      return NextResponse.json(
        { error: 'Invalid consent data' },
        { status: 400 }
      );
    }

    // Validate consent structure
    const requiredFields = ['necessary', 'analytics', 'marketing', 'preferences', 'timestamp', 'version'];
    for (const field of requiredFields) {
      if (!(field in consent)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Get session ID from headers or generate one
    const sessionId = request.headers.get('x-session-id') || 
                     `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Record the consent
    complianceManager.recordCookieConsent(
      userId,
      sessionId,
      consent as CookieConsent,
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      request.headers.get('user-agent') || undefined
    );

    return NextResponse.json({
      success: true,
      message: 'Consent recorded successfully',
      sessionId,
    });
  } catch (error) {
    console.error('Error recording consent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's compliance report
    const report = complianceManager.getUserComplianceReport(userId);

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Error fetching consent data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}