import { NextRequest, NextResponse } from 'next/server';
import { getDataRequestStatus } from '@/lib/user-data-rights';

export async function GET(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const { requestId } = params;

    if (!requestId) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      );
    }

    // Get request status
    const requestStatus = getDataRequestStatus(requestId);

    if (!requestStatus) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      );
    }

    // Return request status with appropriate information
    const responseData = {
      id: requestStatus.id,
      requestType: requestStatus.requestType,
      status: requestStatus.status,
      requestedAt: requestStatus.requestedAt,
      completedAt: requestStatus.completedAt,
      ...(requestStatus.downloadUrl && {
        downloadUrl: requestStatus.downloadUrl,
        expiresAt: requestStatus.expiresAt,
      }),
    };

    // Add status-specific information
    let statusMessage = '';
    let nextSteps = '';

    switch (requestStatus.status) {
      case 'pending':
        statusMessage = 'Your request has been received and is queued for processing.';
        nextSteps = 'We will begin processing your request within 24 hours.';
        break;
      case 'processing':
        statusMessage = 'Your request is currently being processed.';
        nextSteps = 'We are collecting and preparing your data. This may take 24-48 hours.';
        break;
      case 'completed':
        if (requestStatus.requestType === 'deletion') {
          statusMessage = 'Your data deletion request has been completed.';
          nextSteps = 'Your personal data has been deleted as requested, except where legal obligations require retention.';
        } else {
          statusMessage = 'Your data export is ready for download.';
          nextSteps = `Please download your data using the provided link. The link will expire on ${requestStatus.expiresAt?.toLocaleDateString()}.`;
        }
        break;
      case 'failed':
        statusMessage = 'There was an error processing your request.';
        nextSteps = 'Please contact our support team for assistance.';
        break;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...responseData,
        statusMessage,
        nextSteps,
      },
    });

  } catch (error) {
    console.error('Error fetching request status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}