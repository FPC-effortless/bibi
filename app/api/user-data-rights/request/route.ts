import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { createDataExportRequest, getUserDataRequests } from '@/lib/user-data-rights';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, requestType, userLocation, requestDetails, verificationToken } = body;

    // Validate required fields
    if (!userId || !requestType) {
      return NextResponse.json(
        { error: 'User ID and request type are required' },
        { status: 400 }
      );
    }

    // Validate request type
    if (!['export', 'deletion', 'portability'].includes(requestType)) {
      return NextResponse.json(
        { error: 'Invalid request type. Must be export, deletion, or portability' },
        { status: 400 }
      );
    }

    // In a real implementation, verify user identity and authorization
    // This could include checking JWT tokens, session validation, etc.
    const userAgent = request.headers.get('user-agent');
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip');

    // Create the data request
    const dataRequest = await createDataExportRequest(
      userId,
      requestType,
      userLocation,
      {
        ...requestDetails,
        userAgent,
        ipAddress,
        requestedVia: 'api',
      }
    );

    // Return success response with request details
    return NextResponse.json({
      success: true,
      message: `Data ${requestType} request created successfully`,
      data: {
        requestId: dataRequest.id,
        status: dataRequest.status,
        requestedAt: dataRequest.requestedAt,
        estimatedCompletionTime: getEstimatedCompletionTime(requestType),
      },
    });

  } catch (error) {
    console.error('Error creating data request:', error);
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

    // Get all requests for the user
    const userRequests = getUserDataRequests(userId);

    return NextResponse.json({
      success: true,
      data: {
        requests: userRequests.map(req => ({
          id: req.id,
          requestType: req.requestType,
          status: req.status,
          requestedAt: req.requestedAt,
          completedAt: req.completedAt,
          downloadUrl: req.downloadUrl,
          expiresAt: req.expiresAt,
        })),
        totalRequests: userRequests.length,
      },
    });

  } catch (error) {
    console.error('Error fetching user requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getEstimatedCompletionTime(requestType: string): string {
  switch (requestType) {
    case 'export':
      return '24-48 hours';
    case 'deletion':
      return '30 days (as required by law)';
    case 'portability':
      return '24-48 hours';
    default:
      return 'Unknown';
  }
}