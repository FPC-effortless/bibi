/**
 * User Data Rights Management System
 * Handles GDPR/CCPA user rights including right to be forgotten, data export, and portability
 */

import { complianceManager } from './legal-compliance';

export interface DataExportRequest {
  id: string;
  userId: string;
  requestType: 'export' | 'deletion' | 'portability';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  expiresAt?: Date;
  requestDetails?: Record<string, any>;
}

export interface UserDataCategories {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    address?: any;
    dateOfBirth?: string;
  };
  accountData: {
    accountId: string;
    createdAt: Date;
    lastLoginAt?: Date;
    preferences: Record<string, any>;
  };
  orderHistory: {
    orders: any[];
    payments: any[];
    shippingAddresses: any[];
  };
  behaviorData: {
    pageViews: any[];
    searchQueries: any[];
    productViews: any[];
    cartEvents: any[];
  };
  consentRecords: {
    cookieConsents: any[];
    marketingConsents: any[];
    dataProcessingConsents: any[];
  };
}

export interface RegionalCompliance {
  region: 'EU' | 'CA' | 'US' | 'UK' | 'OTHER';
  applicableRegulations: string[];
  dataRetentionPeriods: Record<string, number>;
  userRights: string[];
  processingLegalBasis: string[];
}

class UserDataRightsManager {
  private exportRequests: Map<string, DataExportRequest> = new Map();
  private regionalCompliance: Map<string, RegionalCompliance> = new Map();

  constructor() {
    this.initializeRegionalCompliance();
  }

  /**
   * Initialize regional compliance configurations
   */
  private initializeRegionalCompliance(): void {
    // GDPR (EU)
    this.regionalCompliance.set('EU', {
      region: 'EU',
      applicableRegulations: ['GDPR'],
      dataRetentionPeriods: {
        personalData: 1095, // 3 years
        marketingData: 365, // 1 year
        analyticsData: 730, // 2 years
        orderData: 2555, // 7 years (legal requirement)
      },
      userRights: [
        'right_to_access',
        'right_to_rectification',
        'right_to_erasure',
        'right_to_restrict_processing',
        'right_to_data_portability',
        'right_to_object',
        'rights_related_to_automated_decision_making',
      ],
      processingLegalBasis: ['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests'],
    });

    // CCPA (California)
    this.regionalCompliance.set('CA', {
      region: 'CA',
      applicableRegulations: ['CCPA', 'CPRA'],
      dataRetentionPeriods: {
        personalData: 1095, // 3 years
        marketingData: 365, // 1 year
        analyticsData: 730, // 2 years
        orderData: 2555, // 7 years
      },
      userRights: [
        'right_to_know',
        'right_to_delete',
        'right_to_correct',
        'right_to_portability',
        'right_to_opt_out',
        'right_to_limit_sensitive_data',
      ],
      processingLegalBasis: ['consent', 'contract', 'legal_obligation', 'legitimate_interests'],
    });

    // UK GDPR
    this.regionalCompliance.set('UK', {
      region: 'UK',
      applicableRegulations: ['UK_GDPR', 'DPA_2018'],
      dataRetentionPeriods: {
        personalData: 1095, // 3 years
        marketingData: 365, // 1 year
        analyticsData: 730, // 2 years
        orderData: 2555, // 7 years
      },
      userRights: [
        'right_to_access',
        'right_to_rectification',
        'right_to_erasure',
        'right_to_restrict_processing',
        'right_to_data_portability',
        'right_to_object',
        'rights_related_to_automated_decision_making',
      ],
      processingLegalBasis: ['consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests'],
    });
  }

  /**
   * Determine user's regional compliance requirements based on location
   */
  getUserRegionalCompliance(userLocation?: string, ipAddress?: string): RegionalCompliance {
    // In a real implementation, this would use geolocation services
    // For now, default to EU (most restrictive)
    return this.regionalCompliance.get('EU') || this.regionalCompliance.get('EU')!;
  }

  /**
   * Create a data export request
   */
  async createDataExportRequest(
    userId: string,
    requestType: 'export' | 'deletion' | 'portability',
    userLocation?: string,
    requestDetails?: Record<string, any>
  ): Promise<DataExportRequest> {
    const requestId = this.generateRequestId();
    const compliance = this.getUserRegionalCompliance(userLocation);

    const exportRequest: DataExportRequest = {
      id: requestId,
      userId,
      requestType,
      status: 'pending',
      requestedAt: new Date(),
      requestDetails,
    };

    this.exportRequests.set(requestId, exportRequest);

    // Record compliance event
    complianceManager.recordComplianceEvent({
      userId,
      sessionId: 'system',
      eventType: requestType === 'export' ? 'data_export' : 'data_deletion',
      eventData: {
        requestId,
        requestType,
        region: compliance.region,
        applicableRegulations: compliance.applicableRegulations,
      },
      legalBasis: 'legal_obligation',
    });

    // Start processing the request
    this.processDataRequest(requestId);

    return exportRequest;
  }

  /**
   * Process a data request (export, deletion, or portability)
   */
  private async processDataRequest(requestId: string): Promise<void> {
    const request = this.exportRequests.get(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    try {
      // Update status to processing
      request.status = 'processing';
      this.exportRequests.set(requestId, request);

      switch (request.requestType) {
        case 'export':
          await this.processDataExport(request);
          break;
        case 'deletion':
          await this.processDataDeletion(request);
          break;
        case 'portability':
          await this.processDataPortability(request);
          break;
      }

      // Update status to completed
      request.status = 'completed';
      request.completedAt = new Date();
      this.exportRequests.set(requestId, request);

    } catch (error) {
      request.status = 'failed';
      this.exportRequests.set(requestId, request);
      throw error;
    }
  }

  /**
   * Process data export request
   */
  private async processDataExport(request: DataExportRequest): Promise<void> {
    const userData = await this.collectUserData(request.userId);
    const exportData = this.formatDataForExport(userData, 'json');
    
    // In a real implementation, this would upload to secure storage
    const downloadUrl = await this.createSecureDownloadLink(exportData, request.id);
    
    request.downloadUrl = downloadUrl;
    request.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  /**
   * Process data deletion request (Right to be Forgotten)
   */
  private async processDataDeletion(request: DataExportRequest): Promise<void> {
    const compliance = this.getUserRegionalCompliance();
    
    // Identify data that can be deleted vs. data that must be retained
    const deletionPlan = await this.createDeletionPlan(request.userId, compliance);
    
    // Execute deletion plan
    await this.executeDataDeletion(deletionPlan);
    
    // Record what was deleted and what was retained
    complianceManager.recordComplianceEvent({
      userId: request.userId,
      sessionId: 'system',
      eventType: 'data_deletion',
      eventData: {
        requestId: request.id,
        deletedCategories: deletionPlan.toDelete,
        retainedCategories: deletionPlan.toRetain,
        retentionReasons: deletionPlan.retentionReasons,
      },
      legalBasis: 'legal_obligation',
    });
  }

  /**
   * Process data portability request
   */
  private async processDataPortability(request: DataExportRequest): Promise<void> {
    const userData = await this.collectUserData(request.userId);
    
    // Format data in machine-readable format for portability
    const portableData = this.formatDataForExport(userData, 'json', true);
    
    const downloadUrl = await this.createSecureDownloadLink(portableData, request.id);
    
    request.downloadUrl = downloadUrl;
    request.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }

  /**
   * Collect all user data from various sources
   */
  private async collectUserData(userId: string): Promise<UserDataCategories> {
    // In a real implementation, this would query multiple databases/services
    return {
      personalInfo: {
        // Collect from user profile service
        name: 'John Doe',
        email: 'john@example.com',
        // ... other personal data
      },
      accountData: {
        accountId: userId,
        createdAt: new Date(),
        preferences: {},
      },
      orderHistory: {
        orders: [],
        payments: [],
        shippingAddresses: [],
      },
      behaviorData: {
        pageViews: [],
        searchQueries: [],
        productViews: [],
        cartEvents: [],
      },
      consentRecords: {
        cookieConsents: [],
        marketingConsents: [],
        dataProcessingConsents: [],
      },
    };
  }

  /**
   * Format user data for export
   */
  private formatDataForExport(
    userData: UserDataCategories,
    format: 'json' | 'csv' | 'xml',
    portable: boolean = false
  ): string {
    if (format === 'json') {
      const exportData = {
        exportMetadata: {
          exportedAt: new Date().toISOString(),
          userId: userData.accountData.accountId,
          format,
          portable,
          version: '1.0',
        },
        userData: portable ? this.makeDataPortable(userData) : userData,
      };
      
      return JSON.stringify(exportData, null, 2);
    }
    
    // Implement CSV and XML formats as needed
    throw new Error(`Format ${format} not implemented`);
  }

  /**
   * Make data portable by standardizing formats
   */
  private makeDataPortable(userData: UserDataCategories): any {
    // Convert to standardized, machine-readable format
    // Remove internal IDs, normalize field names, etc.
    return {
      profile: userData.personalInfo,
      account: {
        created: userData.accountData.createdAt.toISOString(),
        preferences: userData.accountData.preferences,
      },
      orders: userData.orderHistory.orders.map(order => ({
        // Standardize order format
        ...order,
        date: order.createdAt?.toISOString(),
      })),
      consents: userData.consentRecords,
    };
  }

  /**
   * Create deletion plan based on legal requirements
   */
  private async createDeletionPlan(userId: string, compliance: RegionalCompliance): Promise<{
    toDelete: string[];
    toRetain: string[];
    retentionReasons: Record<string, string>;
  }> {
    const plan = {
      toDelete: [] as string[],
      toRetain: [] as string[],
      retentionReasons: {} as Record<string, string>,
    };

    // Check if user has active orders (legal obligation to retain)
    const hasActiveOrders = await this.checkActiveOrders(userId);
    if (hasActiveOrders) {
      plan.toRetain.push('orderData');
      plan.retentionReasons.orderData = 'Legal obligation - active orders require data retention';
    } else {
      plan.toDelete.push('orderData');
    }

    // Marketing data can usually be deleted
    plan.toDelete.push('marketingData', 'analyticsData', 'behaviorData');

    // Personal info can be deleted unless there's a legal obligation
    if (!hasActiveOrders) {
      plan.toDelete.push('personalInfo');
    } else {
      plan.toRetain.push('personalInfo');
      plan.retentionReasons.personalInfo = 'Legal obligation - required for order fulfillment';
    }

    return plan;
  }

  /**
   * Execute data deletion plan
   */
  private async executeDataDeletion(deletionPlan: {
    toDelete: string[];
    toRetain: string[];
    retentionReasons: Record<string, string>;
  }): Promise<void> {
    // In a real implementation, this would delete data from various systems
    for (const category of deletionPlan.toDelete) {
      console.log(`Deleting data category: ${category}`);
      // Delete from database, cache, analytics systems, etc.
    }
  }

  /**
   * Check if user has active orders that require data retention
   */
  private async checkActiveOrders(userId: string): Promise<boolean> {
    // In a real implementation, check order status, returns, warranties, etc.
    return false; // Placeholder
  }

  /**
   * Create secure download link for exported data
   */
  private async createSecureDownloadLink(data: string, requestId: string): Promise<string> {
    // In a real implementation, this would:
    // 1. Encrypt the data
    // 2. Upload to secure storage (S3, etc.)
    // 3. Generate signed URL with expiration
    // 4. Return the secure URL
    
    return `https://secure-downloads.bibiere.com/data-export/${requestId}?expires=${Date.now() + 7 * 24 * 60 * 60 * 1000}`;
  }

  /**
   * Get status of a data request
   */
  getRequestStatus(requestId: string): DataExportRequest | null {
    return this.exportRequests.get(requestId) || null;
  }

  /**
   * Get all requests for a user
   */
  getUserRequests(userId: string): DataExportRequest[] {
    return Array.from(this.exportRequests.values()).filter(
      request => request.userId === userId
    );
  }

  /**
   * Verify user identity for data requests
   */
  async verifyUserIdentity(userId: string, verificationData: any): Promise<boolean> {
    // In a real implementation, this would verify:
    // - Email verification
    // - Two-factor authentication
    // - Identity documents for sensitive requests
    // - Security questions
    
    return true; // Placeholder
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Global instance
export const userDataRightsManager = new UserDataRightsManager();

// Utility functions
export const createDataExportRequest = (
  userId: string,
  requestType: 'export' | 'deletion' | 'portability',
  userLocation?: string,
  requestDetails?: Record<string, any>
) => {
  return userDataRightsManager.createDataExportRequest(userId, requestType, userLocation, requestDetails);
};

export const getDataRequestStatus = (requestId: string) => {
  return userDataRightsManager.getRequestStatus(requestId);
};

export const getUserDataRequests = (userId: string) => {
  return userDataRightsManager.getUserRequests(userId);
};