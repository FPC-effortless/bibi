/**
 * Deployment configuration for different environments and strategies
 */

module.exports = {
  // Environment configurations
  environments: {
    development: {
      name: 'development',
      url: 'http://localhost:3000',
      apiUrl: 'http://localhost:3001',
      branch: 'develop',
      autoDeployment: false,
      requiresApproval: false,
      healthCheckTimeout: 30000,
      rollbackEnabled: false,
    },
    staging: {
      name: 'staging',
      url: 'https://staging.bibiere.com',
      apiUrl: 'https://api-staging.bibiere.com',
      branch: 'develop',
      autoDeployment: true,
      requiresApproval: false,
      healthCheckTimeout: 60000,
      rollbackEnabled: true,
      notifications: {
        slack: process.env.SLACK_WEBHOOK_STAGING,
        email: ['dev-team@bibiere.com'],
      },
    },
    production: {
      name: 'production',
      url: 'https://bibiere.com',
      apiUrl: 'https://api.bibiere.com',
      branch: 'main',
      autoDeployment: false,
      requiresApproval: true,
      healthCheckTimeout: 120000,
      rollbackEnabled: true,
      notifications: {
        slack: process.env.SLACK_WEBHOOK_PRODUCTION,
        email: ['dev-team@bibiere.com', 'ops-team@bibiere.com'],
      },
    },
  },

  // Deployment strategies
  strategies: {
    'blue-green': {
      name: 'Blue-Green Deployment',
      description: 'Deploy to parallel environment, then switch traffic',
      environments: ['staging', 'production'],
      steps: [
        'deploy-to-green',
        'health-check-green',
        'smoke-test-green',
        'switch-traffic',
        'verify-production',
        'cleanup-blue',
      ],
      rollbackTime: 30, // seconds
      healthCheckRetries: 5,
      smokeTestTimeout: 300000, // 5 minutes
    },
    'rolling': {
      name: 'Rolling Deployment',
      description: 'Gradually replace instances with new version',
      environments: ['staging', 'production'],
      batchSize: 0.33, // 33% of instances at a time
      batchDelay: 30000, // 30 seconds between batches
      healthCheckRetries: 3,
      rollbackTime: 60, // seconds
    },
    'canary': {
      name: 'Canary Deployment',
      description: 'Gradually increase traffic to new version',
      environments: ['production'],
      trafficSteps: [5, 10, 25, 50, 100], // percentage of traffic
      stepDuration: 300000, // 5 minutes per step
      monitoringMetrics: ['error_rate', 'response_time', 'throughput'],
      thresholds: {
        error_rate: 5, // 5% maximum error rate
        response_time: 2000, // 2 seconds maximum response time
        throughput: 0.8, // 80% of baseline throughput minimum
      },
      rollbackTime: 15, // seconds
    },
  },

  // Quality gates
  qualityGates: {
    preDeployment: {
      required: true,
      checks: [
        'unit-tests',
        'integration-tests',
        'security-scan',
        'code-quality',
        'build-success',
      ],
      timeout: 600000, // 10 minutes
    },
    postDeployment: {
      required: true,
      checks: [
        'health-check',
        'smoke-tests',
        'performance-tests',
        'security-headers',
      ],
      timeout: 300000, // 5 minutes
    },
  },

  // Monitoring and alerting
  monitoring: {
    healthCheck: {
      endpoints: [
        '/api/health',
        '/api/status',
        '/',
      ],
      interval: 30000, // 30 seconds
      timeout: 10000, // 10 seconds
      retries: 3,
    },
    metrics: {
      responseTime: {
        threshold: 2000, // 2 seconds
        severity: 'warning',
      },
      errorRate: {
        threshold: 5, // 5%
        severity: 'critical',
      },
      uptime: {
        threshold: 99.9, // 99.9%
        severity: 'critical',
      },
      memoryUsage: {
        threshold: 85, // 85%
        severity: 'warning',
      },
      cpuUsage: {
        threshold: 80, // 80%
        severity: 'warning',
      },
    },
    alerts: {
      channels: ['slack', 'email', 'pagerduty'],
      escalation: {
        warning: ['slack'],
        critical: ['slack', 'email', 'pagerduty'],
      },
    },
  },

  // Rollback configuration
  rollback: {
    automatic: {
      enabled: true,
      triggers: [
        'health-check-failure',
        'high-error-rate',
        'performance-degradation',
      ],
      conditions: {
        healthCheckFailures: 3, // consecutive failures
        errorRateThreshold: 10, // 10%
        responseTimeThreshold: 5000, // 5 seconds
      },
    },
    manual: {
      enabled: true,
      requiresApproval: {
        production: true,
        staging: false,
      },
      maxRollbackWindow: 86400000, // 24 hours
    },
    verification: {
      required: true,
      checks: ['health-check', 'smoke-tests'],
      timeout: 180000, // 3 minutes
    },
  },

  // Security settings
  security: {
    secrets: {
      required: [
        'VERCEL_TOKEN',
        'VERCEL_ORG_ID',
        'VERCEL_PROJECT_ID',
      ],
      optional: [
        'SLACK_WEBHOOK_STAGING',
        'SLACK_WEBHOOK_PRODUCTION',
        'SENTRY_DSN',
        'GOOGLE_ANALYTICS_ID',
      ],
    },
    headers: {
      required: [
        'strict-transport-security',
        'x-frame-options',
        'x-content-type-options',
      ],
    },
    ssl: {
      required: true,
      minTlsVersion: '1.2',
    },
  },

  // Performance budgets
  performance: {
    budgets: {
      lighthouse: {
        performance: 90,
        accessibility: 95,
        bestPractices: 90,
        seo: 95,
      },
      coreWebVitals: {
        lcp: 2500, // 2.5 seconds
        fid: 100, // 100ms
        cls: 0.1, // 0.1
      },
      bundleSize: {
        maxSize: 500000, // 500KB
        maxGzipSize: 150000, // 150KB
      },
    },
    monitoring: {
      enabled: true,
      alertOnBudgetExceeded: true,
      reportingInterval: 3600000, // 1 hour
    },
  },

  // Notification templates
  notifications: {
    templates: {
      deploymentStarted: {
        title: '🚀 Deployment Started',
        message: 'Deployment {{deploymentId}} to {{environment}} has started',
      },
      deploymentSuccess: {
        title: '✅ Deployment Successful',
        message: 'Deployment {{deploymentId}} to {{environment}} completed successfully',
      },
      deploymentFailed: {
        title: '❌ Deployment Failed',
        message: 'Deployment {{deploymentId}} to {{environment}} failed: {{error}}',
      },
      rollbackTriggered: {
        title: '🔄 Rollback Triggered',
        message: 'Automatic rollback triggered for {{environment}}: {{reason}}',
      },
      rollbackCompleted: {
        title: '✅ Rollback Completed',
        message: 'Rollback to {{targetVersion}} completed successfully',
      },
    },
  },
};