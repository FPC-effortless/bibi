# Deployment Guide

This guide covers the deployment strategies, CI/CD pipeline, and operational procedures for the Bibiere luxury fashion e-commerce website.

## Overview

The deployment system supports multiple strategies and environments with automated quality gates, monitoring, and rollback capabilities.

### Environments

- **Development**: Local development environment
- **Staging**: Pre-production testing environment
- **Production**: Live production environment

### Deployment Strategies

1. **Blue-Green Deployment**: Deploy to parallel environment, then switch traffic
2. **Rolling Deployment**: Gradually replace instances with new version
3. **Canary Deployment**: Gradually increase traffic to new version

## Quick Start

### Basic Deployment

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Deploy with specific strategy
npm run deploy:blue-green production
npm run deploy:rolling staging
npm run deploy:canary production
```

### Rollback

```bash
# Automatic rollback to last successful deployment
npm run rollback

# Rollback to specific deployment
npm run rollback:to deploy-1703123456-abc123

# List deployment history
npm run rollback:list
```

## CI/CD Pipeline

### GitHub Actions Workflows

The CI/CD pipeline consists of three main workflows:

1. **Continuous Integration** (`.github/workflows/ci.yml`)
   - Runs on every push and pull request
   - Executes quality checks, tests, and security scans
   - Builds and analyzes the application

2. **Production Deployment** (`.github/workflows/deploy-production.yml`)
   - Runs on pushes to main branch
   - Includes pre-deployment validation
   - Executes deployment with post-deployment verification

3. **Staging Deployment** (`.github/workflows/deploy-staging.yml`)
   - Runs on pushes to develop branch
   - Provides preview deployments for pull requests

### Quality Gates

#### Pre-deployment Checks
- Unit and integration tests
- Code linting and type checking
- Security vulnerability scanning
- Build optimization and validation

#### Post-deployment Checks
- Health endpoint verification
- Smoke tests execution
- Performance validation
- Security headers verification

## Deployment Strategies

### Blue-Green Deployment

Best for: Production deployments requiring zero downtime

```bash
npm run deploy:blue-green production
```

**Process:**
1. Deploy new version to green environment
2. Run health checks on green environment
3. Execute smoke tests on green environment
4. Switch traffic from blue to green
5. Verify production traffic
6. Clean up old blue environment

**Advantages:**
- Zero downtime
- Instant rollback capability
- Full testing before traffic switch

**Considerations:**
- Requires double infrastructure
- Database migrations need special handling

### Rolling Deployment

Best for: Gradual deployments with load balancing

```bash
npm run deploy:rolling staging
```

**Process:**
1. Deploy to first batch of instances (33%)
2. Health check the batch
3. Wait for stabilization period
4. Repeat for remaining batches

**Advantages:**
- Reduced infrastructure requirements
- Gradual risk exposure
- Maintains service availability

**Considerations:**
- Longer deployment time
- Mixed version state during deployment

### Canary Deployment

Best for: High-risk production changes

```bash
npm run deploy:canary production
```

**Process:**
1. Deploy canary version
2. Route 5% traffic to canary
3. Monitor metrics for 5 minutes
4. Gradually increase traffic: 10%, 25%, 50%, 100%
5. Monitor at each step

**Advantages:**
- Minimal risk exposure
- Real user feedback
- Automated rollback on issues

**Considerations:**
- Complex traffic routing
- Longer deployment process
- Requires sophisticated monitoring

## Monitoring and Alerting

### Health Checks

The system continuously monitors:
- Application health (`/api/health`)
- System status (`/api/status`)
- Critical page availability
- API endpoint responsiveness

### Performance Metrics

Tracked metrics include:
- Response times
- Error rates
- Throughput
- Core Web Vitals
- Resource utilization

### Alerting

Alerts are sent via:
- Slack notifications
- Email notifications
- PagerDuty (for critical issues)

## Rollback Procedures

### Automatic Rollback

Triggered by:
- Health check failures (3 consecutive)
- High error rate (>10%)
- Performance degradation (>5s response time)

### Manual Rollback

```bash
# Quick rollback to last successful deployment
npm run rollback

# Rollback to specific deployment
npm run rollback:to deploy-1703123456-abc123
```

### Rollback Verification

After rollback:
1. Health checks are executed
2. Smoke tests are run
3. Performance is validated
4. Alerts are sent to team

## Environment Configuration

### Environment Variables

Each environment has specific configuration:

**Production** (`environments/production.env`):
- Full monitoring enabled
- Security headers enforced
- Performance optimization enabled
- Analytics and error reporting active

**Staging** (`environments/staging.env`):
- All features enabled for testing
- Relaxed security for debugging
- Shorter cache times
- Staging-specific monitoring

**Development** (`environments/development.env`):
- Monitoring disabled
- Debug mode enabled
- No caching
- Development tools active

### Secrets Management

Required secrets:
- `VERCEL_TOKEN`: Vercel deployment token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

Optional secrets:
- `SLACK_WEBHOOK_*`: Slack notification webhooks
- `SENTRY_DSN`: Error reporting DSN
- `GOOGLE_ANALYTICS_ID`: Analytics tracking ID

## Troubleshooting

### Common Issues

#### Deployment Failures

1. **Build Failures**
   ```bash
   # Check build logs
   npm run build:optimize
   
   # Verify dependencies
   npm ci
   ```

2. **Test Failures**
   ```bash
   # Run tests locally
   npm run test:ci
   
   # Check specific test suites
   npm run test:user-flows:full
   ```

3. **Security Scan Failures**
   ```bash
   # Check vulnerabilities
   npm audit
   
   # Fix high/critical issues
   npm audit fix
   ```

#### Post-deployment Issues

1. **Health Check Failures**
   ```bash
   # Manual health check
   curl https://your-domain.com/api/health
   
   # Check system status
   curl https://your-domain.com/api/status
   ```

2. **Performance Issues**
   ```bash
   # Run performance audit
   npm run audit:lighthouse
   
   # Check performance budget
   npm run performance:budget
   ```

3. **Rollback Issues**
   ```bash
   # Check deployment history
   npm run rollback:list
   
   # Force rollback to specific version
   npm run rollback:to <deployment-id>
   ```

### Emergency Procedures

#### Critical Production Issue

1. **Immediate Response**
   ```bash
   # Trigger immediate rollback
   npm run rollback
   ```

2. **Incident Communication**
   - Notify team via Slack/PagerDuty
   - Update status page if available
   - Document incident details

3. **Post-incident**
   - Conduct post-mortem
   - Update procedures if needed
   - Implement preventive measures

## Best Practices

### Deployment

1. **Always test in staging first**
2. **Use feature flags for risky changes**
3. **Monitor metrics during deployment**
4. **Have rollback plan ready**
5. **Communicate deployment schedule**

### Monitoring

1. **Set up proper alerting thresholds**
2. **Monitor business metrics, not just technical**
3. **Use synthetic monitoring for critical paths**
4. **Regular health check validation**

### Security

1. **Rotate deployment tokens regularly**
2. **Use least privilege access**
3. **Audit deployment logs**
4. **Validate security headers**

### Performance

1. **Set and monitor performance budgets**
2. **Regular performance audits**
3. **Optimize critical rendering path**
4. **Monitor Core Web Vitals**

## Scripts Reference

### Deployment Scripts

- `npm run deploy` - Basic deployment script
- `npm run deploy:staging` - Deploy to staging
- `npm run deploy:production` - Deploy to production
- `npm run deploy:blue-green` - Blue-green deployment
- `npm run deploy:rolling` - Rolling deployment
- `npm run deploy:canary` - Canary deployment

### Testing Scripts

- `npm run test:post-deployment` - Post-deployment tests
- `npm run test:user-flows:smoke` - Smoke tests
- `npm run audit:all` - Complete audit suite

### Monitoring Scripts

- `npm run monitor:deployment` - Deployment monitoring
- `npm run performance:benchmark` - Performance benchmarking
- `npm run performance:budget` - Performance budget check

### Rollback Scripts

- `npm run rollback` - Automatic rollback
- `npm run rollback:to` - Rollback to specific deployment
- `npm run rollback:list` - List deployment history

## Support

For deployment issues or questions:
- Check this documentation first
- Review deployment logs in GitHub Actions
- Contact the DevOps team via Slack
- Create an incident ticket for critical issues