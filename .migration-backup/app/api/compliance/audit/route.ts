import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
import { complianceManager, generateComplianceReport } from '@/lib/legal-compliance';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const format = searchParams.get('format') || 'json';

    // Validate date parameters
    if (!startDateParam || !endDateParam) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const startDate = new Date(startDateParam);
    const endDate = new Date(endDateParam);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (startDate > endDate) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    // Generate compliance audit report
    const report = generateComplianceReport(startDate, endDate);

    // Add metadata
    const auditReport = {
      reportMetadata: {
        generatedAt: new Date().toISOString(),
        reportPeriod: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        reportVersion: '1.0',
        complianceFramework: 'GDPR/CCPA',
      },
      ...report,
    };

    if (format === 'csv') {
      // Generate CSV format for compliance reporting
      const csvData = generateCSVReport(auditReport);
      
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="compliance-audit-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: auditReport,
    });
  } catch (error) {
    console.error('Error generating audit report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateCSVReport(report: any): string {
  const headers = [
    'Metric',
    'Value',
    'Category',
    'Description'
  ];

  const rows = [
    ['Total Events', report.totalEvents.toString(), 'Overview', 'Total compliance events in period'],
    ['Total Consents', report.consentMetrics.totalConsents.toString(), 'Consent', 'Total consent events given'],
    ['Withdrawal Rate', `${report.consentMetrics.withdrawalRate.toFixed(2)}%`, 'Consent', 'Percentage of consents withdrawn'],
    ['Data Processing Events', report.dataProcessingMetrics.totalProcessingEvents.toString(), 'Data Processing', 'Total data processing activities'],
  ];

  // Add event type breakdown
  Object.entries(report.eventsByType).forEach(([type, count]) => {
    rows.push([`Events: ${type}`, (count as number).toString(), 'Event Types', `Number of ${type} events`]);
  });

  // Add consent type breakdown
  Object.entries(report.consentMetrics.consentsByType).forEach(([type, count]) => {
    rows.push([`Consent: ${type}`, (count as number).toString(), 'Consent Types', `Number of ${type} consents`]);
  });

  // Add processing purpose breakdown
  Object.entries(report.dataProcessingMetrics.processingByPurpose).forEach(([purpose, count]) => {
    rows.push([`Processing: ${purpose}`, (count as number).toString(), 'Processing Purposes', `Data processing for ${purpose}`]);
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, userId, sessionId, eventData, legalBasis } = body;

    if (!eventType || !sessionId) {
      return NextResponse.json(
        { error: 'Event type and session ID are required' },
        { status: 400 }
      );
    }

    // Record compliance event
    complianceManager.recordComplianceEvent({
      userId,
      sessionId,
      eventType,
      eventData: eventData || {},
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
      legalBasis,
    });

    return NextResponse.json({
      success: true,
      message: 'Compliance event recorded successfully',
    });
  } catch (error) {
    console.error('Error recording compliance event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}