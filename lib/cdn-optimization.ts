/**
 * CDN Optimization and Global Asset Distribution
 * Manages CDN configuration and performance optimization
 */

interface CDNConfig {
  provider: 'vercel' | 'cloudflare' | 'aws' | 'custom';
  domains: string[];
  cacheRules: CacheRule[];
  compressionSettings: CompressionSettings;
  imageOptimization: ImageOptimizationSettings;
  geoDistribution: GeoDistributionSettings;
}

interface CacheRule {
  pattern: string;
  maxAge: number;
  staleWhileRevalidate?: number;
  mustRevalidate?: boolean;
  public?: boolean;
}

interface CompressionSettings {
  gzip: boolean;
  brotli: boolean;
  minSize: number;
  excludeTypes: string[];
}

interface ImageOptimizationSettings {
  formats: string[];
  quality: number;
  progressive: boolean;
  autoWebP: boolean;
  responsiveSizes: number[];
}

interface GeoDistributionSettings {
  regions: string[];
  edgeLocations: string[];
  routingStrategy: 'latency' | 'geolocation' | 'failover';
}

interface PerformanceMetrics {
  cacheHitRatio: number;
  averageResponseTime: number;
  bandwidthUsage: number;
  edgeHits: number;
  originHits: number;
  errorRate: number;
}

class CDNOptimizer {
  private config: CDNConfig;
  private metrics: Map<string, PerformanceMetrics> = new Map();

  constructor(config: CDNConfig) {
    this.config = config;
  }

  /**
   * Generate optimized cache headers for different asset types
   */
  generateCacheHeaders(assetPath: string, assetType: string): Record<string, string> {
    const rule = this.findMatchingCacheRule(assetPath);
    
    const headers: Record<string, string> = {};
    
    if (rule) {
      // Set cache control
      const cacheControl = [];
      
      if (rule.public) {
        cacheControl.push('public');
      }
      
      if (rule.maxAge > 0) {
        cacheControl.push(`max-age=${rule.maxAge}`);
      }
      
      if (rule.staleWhileRevalidate) {
        cacheControl.push(`stale-while-revalidate=${rule.staleWhileRevalidate}`);
      }
      
      if (rule.mustRevalidate) {
        cacheControl.push('must-revalidate');
      }
      
      headers['Cache-Control'] = cacheControl.join(', ');
      
      // Set ETag for cache validation
      headers['ETag'] = this.generateETag(assetPath);
      
      // Set Vary header for content negotiation
      if (this.shouldVaryByAcceptEncoding(assetType)) {
        headers['Vary'] = 'Accept-Encoding';
      }
    }
    
    // Set compression headers
    if (this.shouldCompress(assetType)) {
      headers['Content-Encoding'] = this.getBestCompression();
    }
    
    return headers;
  }

  /**
   * Find matching cache rule for asset path
   */
  private findMatchingCacheRule(assetPath: string): CacheRule | null {
    for (const rule of this.config.cacheRules) {
      const regex = new RegExp(rule.pattern);
      if (regex.test(assetPath)) {
        return rule;
      }
    }
    return null;
  }

  /**
   * Generate ETag for cache validation
   */
  private generateETag(assetPath: string): string {
    // In production, this would use file hash or modification time
    const hash = Buffer.from(assetPath).toString('base64');
    return `"${hash}"`;
  }

  /**
   * Check if asset should vary by Accept-Encoding
   */
  private shouldVaryByAcceptEncoding(assetType: string): boolean {
    const compressibleTypes = ['text/html', 'text/css', 'application/javascript', 'application/json'];
    return compressibleTypes.includes(assetType);
  }

  /**
   * Check if asset should be compressed
   */
  private shouldCompress(assetType: string): boolean {
    if (this.config.compressionSettings.excludeTypes.includes(assetType)) {
      return false;
    }
    
    const compressibleTypes = [
      'text/html',
      'text/css',
      'application/javascript',
      'application/json',
      'text/plain',
      'application/xml',
      'text/xml'
    ];
    
    return compressibleTypes.includes(assetType);
  }

  /**
   * Get best compression method
   */
  private getBestCompression(): string {
    if (this.config.compressionSettings.brotli) {
      return 'br';
    } else if (this.config.compressionSettings.gzip) {
      return 'gzip';
    }
    return 'identity';
  }

  /**
   * Optimize image delivery
   */
  optimizeImageDelivery(imagePath: string, userAgent: string, acceptHeader: string): {
    optimizedPath: string;
    format: string;
    quality: number;
  } {
    const settings = this.config.imageOptimization;
    
    // Determine best format based on browser support
    let format = 'jpeg';
    if (acceptHeader.includes('image/avif') && settings.formats.includes('avif')) {
      format = 'avif';
    } else if (acceptHeader.includes('image/webp') && settings.formats.includes('webp')) {
      format = 'webp';
    }
    
    // Determine quality based on connection and device
    let quality = settings.quality;
    if (this.isSlowConnection(userAgent)) {
      quality = Math.max(quality - 20, 50); // Reduce quality for slow connections
    }
    
    // Generate optimized path
    const optimizedPath = this.generateOptimizedImagePath(imagePath, format, quality);
    
    return {
      optimizedPath,
      format,
      quality
    };
  }

  /**
   * Check if user has slow connection
   */
  private isSlowConnection(userAgent: string): boolean {
    // Simple heuristic - in production, use Network Information API or other methods
    return userAgent.includes('Mobile') && !userAgent.includes('4G');
  }

  /**
   * Generate optimized image path
   */
  private generateOptimizedImagePath(imagePath: string, format: string, quality: number): string {
    const pathParts = imagePath.split('.');
    const extension = pathParts.pop();
    const basePath = pathParts.join('.');
    
    return `${basePath}_q${quality}.${format}`;
  }

  /**
   * Get CDN performance metrics
   */
  getPerformanceMetrics(timeRange: 'hour' | 'day' | 'week' = 'day'): PerformanceMetrics {
    // In production, this would fetch real metrics from CDN provider
    return {
      cacheHitRatio: 0.85,
      averageResponseTime: 120,
      bandwidthUsage: 1024 * 1024 * 100, // 100MB
      edgeHits: 10000,
      originHits: 1500,
      errorRate: 0.01
    };
  }

  /**
   * Analyze performance and suggest optimizations
   */
  analyzePerformance(): {
    score: number;
    issues: string[];
    recommendations: string[];
  } {
    const metrics = this.getPerformanceMetrics();
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;
    
    // Check cache hit ratio
    if (metrics.cacheHitRatio < 0.8) {
      issues.push('Low cache hit ratio');
      recommendations.push('Review cache rules and increase cache durations for static assets');
      score -= 20;
    }
    
    // Check response time
    if (metrics.averageResponseTime > 200) {
      issues.push('High average response time');
      recommendations.push('Consider adding more edge locations or optimizing asset sizes');
      score -= 15;
    }
    
    // Check error rate
    if (metrics.errorRate > 0.05) {
      issues.push('High error rate');
      recommendations.push('Investigate origin server issues and implement better error handling');
      score -= 25;
    }
    
    // Check origin hit ratio
    const originHitRatio = metrics.originHits / (metrics.edgeHits + metrics.originHits);
    if (originHitRatio > 0.2) {
      issues.push('High origin hit ratio');
      recommendations.push('Increase cache durations and pre-warm cache for popular content');
      score -= 10;
    }
    
    return {
      score: Math.max(score, 0),
      issues,
      recommendations
    };
  }

  /**
   * Generate CDN configuration for deployment
   */
  generateCDNConfig(): any {
    switch (this.config.provider) {
      case 'vercel':
        return this.generateVercelConfig();
      case 'cloudflare':
        return this.generateCloudflareConfig();
      case 'aws':
        return this.generateAWSConfig();
      default:
        return this.generateGenericConfig();
    }
  }

  private generateVercelConfig() {
    return {
      headers: this.config.cacheRules.map(rule => ({
        source: rule.pattern,
        headers: [
          {
            key: 'Cache-Control',
            value: `public, max-age=${rule.maxAge}${rule.staleWhileRevalidate ? `, stale-while-revalidate=${rule.staleWhileRevalidate}` : ''}`
          }
        ]
      })),
      images: {
        formats: this.config.imageOptimization.formats,
        deviceSizes: this.config.imageOptimization.responsiveSizes,
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000
      }
    };
  }

  private generateCloudflareConfig() {
    return {
      page_rules: this.config.cacheRules.map(rule => ({
        targets: [{ target: 'url', constraint: { matches: rule.pattern } }],
        actions: [
          { id: 'cache_level', value: 'cache_everything' },
          { id: 'edge_cache_ttl', value: rule.maxAge }
        ]
      })),
      compression: {
        gzip: this.config.compressionSettings.gzip,
        brotli: this.config.compressionSettings.brotli
      }
    };
  }

  private generateAWSConfig() {
    return {
      DistributionConfig: {
        Origins: {
          Quantity: 1,
          Items: [
            {
              Id: 'origin1',
              DomainName: this.config.domains[0],
              CustomOriginConfig: {
                HTTPPort: 443,
                HTTPSPort: 443,
                OriginProtocolPolicy: 'https-only'
              }
            }
          ]
        },
        DefaultCacheBehavior: {
          TargetOriginId: 'origin1',
          ViewerProtocolPolicy: 'redirect-to-https',
          Compress: this.config.compressionSettings.gzip,
          CachePolicyId: 'custom-cache-policy'
        },
        CacheBehaviors: {
          Quantity: this.config.cacheRules.length,
          Items: this.config.cacheRules.map(rule => ({
            PathPattern: rule.pattern,
            TargetOriginId: 'origin1',
            ViewerProtocolPolicy: 'redirect-to-https',
            CachePolicyId: 'custom-cache-policy'
          }))
        }
      }
    };
  }

  private generateGenericConfig() {
    return {
      cacheRules: this.config.cacheRules,
      compression: this.config.compressionSettings,
      imageOptimization: this.config.imageOptimization
    };
  }
}

// Default CDN configuration
export const defaultCDNConfig: CDNConfig = {
  provider: 'vercel',
  domains: ['bibiere.com'],
  cacheRules: [
    {
      pattern: '\\.(js|css|woff2?|ttf|eot)$',
      maxAge: 31536000, // 1 year
      staleWhileRevalidate: 86400, // 1 day
      public: true
    },
    {
      pattern: '\\.(jpg|jpeg|png|gif|svg|webp|avif)$',
      maxAge: 2592000, // 30 days
      staleWhileRevalidate: 86400, // 1 day
      public: true
    },
    {
      pattern: '\\.(html|json)$',
      maxAge: 3600, // 1 hour
      staleWhileRevalidate: 86400, // 1 day
      public: true
    },
    {
      pattern: '/api/',
      maxAge: 0,
      mustRevalidate: true,
      public: false
    }
  ],
  compressionSettings: {
    gzip: true,
    brotli: true,
    minSize: 1024,
    excludeTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4']
  },
  imageOptimization: {
    formats: ['avif', 'webp', 'jpeg'],
    quality: 80,
    progressive: true,
    autoWebP: true,
    responsiveSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
  },
  geoDistribution: {
    regions: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
    edgeLocations: ['global'],
    routingStrategy: 'latency'
  }
};

export const cdnOptimizer = new CDNOptimizer(defaultCDNConfig);
export default CDNOptimizer;