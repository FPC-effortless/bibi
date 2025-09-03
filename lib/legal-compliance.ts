/**
 * Legal Compliance Framework
 * Handles GDPR/CCPA compliance, audit trails, and data processing transparency
 */

export interface ComplianceEvent {
  id: string;
  userId?: string;
  sessionId: string;
  eventType: 'consent_given' | 'consent_withdrawn' | 'data_access' | 'data_deletion' | 'data_export' | 'cookie_preference';
  eventData: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  legalBasis?: 'consent' | 'legitimate_interest' | 'contract' | 'legal_obligation';
}

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  timestamp: Date;
  version: string;
}

export interface DataProcessingRecord {
  id: string;
  userId: string;
  dataType: string;
  processingPurpose: string;
  legalBasis: string;
  retentionPeriod: number;
  timestamp: Date;
  consentId?: string;
}

export interface ComplianceConfig {
  cookieConsentVersion: string;
  dataRetentionPeriods: Record<string, number>; // in days
  requiredConsents: string[];
  auditLogRetention: number; // in days
  privacyPolicyVersion: string;
  termsOfServiceVersion: string;
}

class LegalComplianceManager {
  private config: ComplianceConfig;
  private auditTrail: ComplianceEvent[] = [];

  constructor(config: ComplianceConfig) {
    this.config = config;
  }

  /**
   * Record a compliance event for audit trail
   */
  recordComplianceEvent(event: Omit<ComplianceEvent, 'id' | 'timestamp'>): void {
    const complianceEvent: ComplianceEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date(),
    };

    this.auditTrail.push(complianceEvent);
    this.persistAuditEvent(complianceEvent);
  }

  /**
   * Record cookie consent preferences
   */
  recordCookieConsent(
    userId: string | undefined,
    sessionId: string,
    consent: CookieConsent,
    ipAddress?: string,
    userAgent?: string
  ): void {
    this.recordComplianceEvent({
      userId,
      sessionId,
      eventType: 'consent_given',
      eventData: {
        consentType: 'cookie',
        preferences: consent,
        version: this.config.cookieConsentVersion,
      },
      ipAddress,
      userAgent,
      legalBasis: 'consent',
    });
  }

  /**
   * Record data processing activity
   */
  recordDataProcessing(record: Omit<DataProcessingRecord, 'id' | 'timestamp'>): void {
    const processingRecord: DataProcessingRecord = {
      ...record,
      id: this.generateEventId(),
      timestamp: new Date(),
    };

    this.recordComplianceEvent({
      userId: record.userId,
      sessionId: 'system',
      eventType: 'data_access',
      eventData: {
        dataType: record.dataType,
        processingPurpose: record.processingPurpose,
        legalBasis: record.legalBasis,
        retentionPeriod: record.retentionPeriod,
      },
      legalBasis: record.legalBasis as any,
    });
  }

  /**
   * Check if user has given consent for specific purpose
   */
  hasValidConsent(userId: string, consentType: string): boolean {
    const userEvents = this.auditTrail.filter(
      event => event.userId === userId && event.eventType === 'consent_given'
    );

    const latestConsent = userEvents
      .filter(event => event.eventData.consentType === consentType)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

    if (!latestConsent) return false;

    // Check if consent is still valid (not withdrawn)
    const withdrawalEvents = this.auditTrail.filter(
      event => 
        event.userId === userId && 
        event.eventType === 'consent_withdrawn' &&
        event.eventData.consentType === consentType &&
        event.timestamp > latestConsent.timestamp
    );

    return withdrawalEvents.length === 0;
  }

  /**
   * Get compliance report for a user
   */
  getUserComplianceReport(userId: string): {
    consents: ComplianceEvent[];
    dataProcessing: ComplianceEvent[];
    dataAccess: ComplianceEvent[];
  } {
    const userEvents = this.auditTrail.filter(event => event.userId === userId);

    return {
      consents: userEvents.filter(event => 
        event.eventType === 'consent_given' || event.eventType === 'consent_withdrawn'
      ),
      dataProcessing: userEvents.filter(event => event.eventType === 'data_access'),
      dataAccess: userEvents.filter(event => event.eventType === 'data_export'),
    };
  }

  /**
   * Generate compliance audit report
   */
  generateAuditReport(startDate: Date, endDate: Date): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    consentMetrics: {
      totalConsents: number;
      consentsByType: Record<string, number>;
      withdrawalRate: number;
    };
    dataProcessingMetrics: {
      totalProcessingEvents: number;
      processingByPurpose: Record<string, number>;
    };
  } {
    const periodEvents = this.auditTrail.filter(
      event => event.timestamp >= startDate && event.timestamp <= endDate
    );

    const eventsByType = periodEvents.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const consentEvents = periodEvents.filter(event => 
      event.eventType === 'consent_given' || event.eventType === 'consent_withdrawn'
    );

    const consentsByType = consentEvents.reduce((acc, event) => {
      const consentType = event.eventData.consentType || 'unknown';
      acc[consentType] = (acc[consentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalConsents = periodEvents.filter(event => event.eventType === 'consent_given').length;
    const totalWithdrawals = periodEvents.filter(event => event.eventType === 'consent_withdrawn').length;
    const withdrawalRate = totalConsents > 0 ? (totalWithdrawals / totalConsents) * 100 : 0;

    const processingEvents = periodEvents.filter(event => event.eventType === 'data_access');
    const processingByPurpose = processingEvents.reduce((acc, event) => {
      const purpose = event.eventData.processingPurpose || 'unknown';
      acc[purpose] = (acc[purpose] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEvents: periodEvents.length,
      eventsByType,
      consentMetrics: {
        totalConsents,
        consentsByType,
        withdrawalRate,
      },
      dataProcessingMetrics: {
        totalProcessingEvents: processingEvents.length,
        processingByPurpose,
      },
    };
  }

  /**
   * Clean up expired audit logs based on retention policy
   */
  cleanupExpiredAuditLogs(): void {
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - this.config.auditLogRetention);

    this.auditTrail = this.auditTrail.filter(event => event.timestamp >= retentionDate);
  }

  private generateEventId(): string {
    return `compliance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private persistAuditEvent(event: ComplianceEvent): void {
    // In a real implementation, this would persist to a secure database
    // For now, we'll use localStorage for demonstration
    if (typeof window !== 'undefined') {
      const existingEvents = JSON.parse(localStorage.getItem('compliance_audit_trail') || '[]');
      existingEvents.push(event);
      localStorage.setItem('compliance_audit_trail', JSON.stringify(existingEvents));
    }
  }
}

// Default compliance configuration
export const defaultComplianceConfig: ComplianceConfig = {
  cookieConsentVersion: '1.0',
  dataRetentionPeriods: {
    analytics: 730, // 2 years
    marketing: 365, // 1 year
    user_preferences: 1095, // 3 years
    order_history: 2555, // 7 years (legal requirement)
    support_tickets: 1095, // 3 years
  },
  requiredConsents: ['necessary', 'analytics'],
  auditLogRetention: 2555, // 7 years
  privacyPolicyVersion: '1.0',
  termsOfServiceVersion: '1.0',
};

// Global compliance manager instance
export const complianceManager = new LegalComplianceManager(defaultComplianceConfig);

// Utility functions for common compliance operations
export const recordUserConsent = (
  userId: string | undefined,
  sessionId: string,
  consent: CookieConsent,
  request?: Request
) => {
  const ipAddress = request?.headers.get('x-forwarded-for') || 
                   request?.headers.get('x-real-ip') || 
                   undefined;
  const userAgent = request?.headers.get('user-agent') || undefined;

  complianceManager.recordCookieConsent(userId, sessionId, consent, ipAddress, userAgent);
};

export const checkUserConsent = (userId: string, consentType: string): boolean => {
  return complianceManager.hasValidConsent(userId, consentType);
};

export const generateComplianceReport = (startDate: Date, endDate: Date) => {
  return complianceManager.generateAuditReport(startDate, endDate);
};