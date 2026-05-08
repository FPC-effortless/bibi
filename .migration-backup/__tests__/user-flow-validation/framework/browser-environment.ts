/**
 * Browser Testing Environment Configuration
 * Supports Chrome, Firefox, Safari, and Edge with multiple viewports
 */

export interface BrowserConfig {
  name: string;
  executable?: string;
  args: string[];
  headless: boolean;
}

export interface ViewportConfig {
  name: string;
  width: number;
  height: number;
  deviceScaleFactor: number;
  isMobile: boolean;
  hasTouch: boolean;
  userAgent?: string;
}

export interface DeviceConfig {
  name: string;
  viewport: ViewportConfig;
  category: 'desktop' | 'tablet' | 'mobile';
}

export class BrowserEnvironment {
  private static instance: BrowserEnvironment;
  
  // Browser configurations
  private browsers: Map<string, BrowserConfig> = new Map([
    ['chrome', {
      name: 'Chrome',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ],
      headless: false
    }],
    ['firefox', {
      name: 'Firefox',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
      headless: false
    }],
    ['safari', {
      name: 'Safari',
      args: [],
      headless: false
    }],
    ['edge', {
      name: 'Edge',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
      headless: false
    }]
  ]);

  // Device and viewport configurations
  private devices: Map<string, DeviceConfig> = new Map([
    // Desktop devices
    ['desktop-1920', {
      name: 'Desktop 1920x1080',
      category: 'desktop',
      viewport: {
        name: 'Desktop Large',
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false
      }
    }],
    ['desktop-1366', {
      name: 'Desktop 1366x768',
      category: 'desktop',
      viewport: {
        name: 'Desktop Medium',
        width: 1366,
        height: 768,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false
      }
    }],
    ['desktop-1440', {
      name: 'Desktop 1440x900',
      category: 'desktop',
      viewport: {
        name: 'Desktop MacBook',
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false
      }
    }],
    
    // Tablet devices
    ['ipad', {
      name: 'iPad',
      category: 'tablet',
      viewport: {
        name: 'iPad',
        width: 768,
        height: 1024,
        deviceScaleFactor: 2,
        isMobile: false,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
      }
    }],
    ['android-tablet', {
      name: 'Android Tablet',
      category: 'tablet',
      viewport: {
        name: 'Android Tablet',
        width: 800,
        height: 1280,
        deviceScaleFactor: 1.5,
        isMobile: false,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36'
      }
    }],
    
    // Mobile devices
    ['iphone', {
      name: 'iPhone',
      category: 'mobile',
      viewport: {
        name: 'iPhone',
        width: 375,
        height: 667,
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
      }
    }],
    ['android-phone', {
      name: 'Android Phone',
      category: 'mobile',
      viewport: {
        name: 'Android Phone',
        width: 360,
        height: 640,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
      }
    }],
    ['iphone-pro', {
      name: 'iPhone Pro',
      category: 'mobile',
      viewport: {
        name: 'iPhone Pro',
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
      }
    }]
  ]);

  private constructor() {}

  static getInstance(): BrowserEnvironment {
    if (!BrowserEnvironment.instance) {
      BrowserEnvironment.instance = new BrowserEnvironment();
    }
    return BrowserEnvironment.instance;
  }

  /**
   * Get browser configuration
   */
  getBrowserConfig(browserName: string): BrowserConfig | undefined {
    return this.browsers.get(browserName.toLowerCase());
  }

  /**
   * Get all supported browsers
   */
  getSupportedBrowsers(): string[] {
    return Array.from(this.browsers.keys());
  }

  /**
   * Get device configuration
   */
  getDeviceConfig(deviceName: string): DeviceConfig | undefined {
    return this.devices.get(deviceName.toLowerCase());
  }

  /**
   * Get devices by category
   */
  getDevicesByCategory(category: 'desktop' | 'tablet' | 'mobile'): DeviceConfig[] {
    return Array.from(this.devices.values()).filter(device => device.category === category);
  }

  /**
   * Get all supported devices
   */
  getSupportedDevices(): string[] {
    return Array.from(this.devices.keys());
  }

  /**
   * Generate test matrix (browser x device combinations)
   */
  generateTestMatrix(): Array<{ browser: string; device: string; config: BrowserConfig & DeviceConfig }> {
    const matrix: Array<{ browser: string; device: string; config: BrowserConfig & DeviceConfig }> = [];
    
    for (const [browserName, browserConfig] of this.browsers) {
      for (const [deviceName, deviceConfig] of this.devices) {
        // Skip Safari on non-Apple devices for realistic testing
        if (browserName === 'safari' && !deviceName.includes('iphone') && !deviceName.includes('ipad') && !deviceName.includes('desktop')) {
          continue;
        }
        
        matrix.push({
          browser: browserName,
          device: deviceName,
          config: { ...browserConfig, ...deviceConfig }
        });
      }
    }
    
    return matrix;
  }

  /**
   * Get recommended test combinations for comprehensive coverage
   */
  getRecommendedTestCombinations(): Array<{ browser: string; device: string }> {
    return [
      // Desktop combinations
      { browser: 'chrome', device: 'desktop-1920' },
      { browser: 'firefox', device: 'desktop-1366' },
      { browser: 'safari', device: 'desktop-1440' },
      { browser: 'edge', device: 'desktop-1920' },
      
      // Tablet combinations
      { browser: 'chrome', device: 'ipad' },
      { browser: 'safari', device: 'ipad' },
      { browser: 'chrome', device: 'android-tablet' },
      
      // Mobile combinations
      { browser: 'safari', device: 'iphone' },
      { browser: 'safari', device: 'iphone-pro' },
      { browser: 'chrome', device: 'android-phone' }
    ];
  }

  /**
   * Validate browser availability
   */
  async validateBrowserAvailability(browserName: string): Promise<boolean> {
    const config = this.getBrowserConfig(browserName);
    if (!config) return false;

    try {
      // This would typically check if the browser executable exists
      // For now, we'll assume browsers are available
      return true;
    } catch (error) {
      console.warn(`Browser ${browserName} not available:`, error);
      return false;
    }
  }

  /**
   * Get browser-specific capabilities
   */
  getBrowserCapabilities(browserName: string): {
    supportsWebP: boolean;
    supportsES6: boolean;
    supportsTouchEvents: boolean;
    supportsServiceWorkers: boolean;
  } {
    const capabilities = {
      chrome: {
        supportsWebP: true,
        supportsES6: true,
        supportsTouchEvents: true,
        supportsServiceWorkers: true
      },
      firefox: {
        supportsWebP: true,
        supportsES6: true,
        supportsTouchEvents: true,
        supportsServiceWorkers: true
      },
      safari: {
        supportsWebP: true,
        supportsES6: true,
        supportsTouchEvents: true,
        supportsServiceWorkers: true
      },
      edge: {
        supportsWebP: true,
        supportsES6: true,
        supportsTouchEvents: true,
        supportsServiceWorkers: true
      }
    };

    return capabilities[browserName as keyof typeof capabilities] || {
      supportsWebP: false,
      supportsES6: false,
      supportsTouchEvents: false,
      supportsServiceWorkers: false
    };
  }

  /**
   * Update browser configuration
   */
  updateBrowserConfig(browserName: string, config: Partial<BrowserConfig>): void {
    const existingConfig = this.browsers.get(browserName.toLowerCase());
    if (existingConfig) {
      this.browsers.set(browserName.toLowerCase(), { ...existingConfig, ...config });
    }
  }

  /**
   * Add custom device configuration
   */
  addDeviceConfig(deviceName: string, config: DeviceConfig): void {
    this.devices.set(deviceName.toLowerCase(), config);
  }

  /**
   * Run test in specific browser (mock implementation for testing)
   */
  async runInBrowser(browserName: string, version: string, testFunction: (page: any) => Promise<any>) {
    try {
      // Mock browser page for testing
      const mockPage = this.createMockPage(browserName);
      const result = await testFunction(mockPage);
      return result;
    } catch (error) {
      return {
        status: 'failed' as const,
        issues: [{
          severity: 'critical' as const,
          description: `Browser test failed: ${error}`,
          element: 'browser',
          expectedBehavior: 'Test should pass',
          actualBehavior: `Error: ${error}`,
          reproductionSteps: ['Run test in specified browser']
        }],
        screenshots: []
      };
    }
  }

  /**
   * Run test in mobile browser (mock implementation for testing)
   */
  async runInMobileBrowser(browser: any, testFunction: (page: any) => Promise<any>) {
    try {
      const mockPage = this.createMockPage(browser.name, true);
      const result = await testFunction(mockPage);
      return result;
    } catch (error) {
      return {
        status: 'failed' as const,
        issues: [{
          severity: 'critical' as const,
          description: `Mobile browser test failed: ${error}`,
          element: 'mobile-browser',
          expectedBehavior: 'Test should pass',
          actualBehavior: `Error: ${error}`,
          reproductionSteps: ['Run test in specified mobile browser']
        }],
        screenshots: []
      };
    }
  }

  /**
   * Create mock page for testing
   */
  private createMockPage(browserName: string, isMobile: boolean = false) {
    const mockPage = {
      goto: jest.fn().mockResolvedValue(undefined),
      click: jest.fn().mockResolvedValue(undefined),
      fill: jest.fn().mockResolvedValue(undefined),
      locator: jest.fn((selector: string) => ({
        isVisible: jest.fn().mockResolvedValue(true),
        isHidden: jest.fn().mockResolvedValue(false),
        click: jest.fn().mockResolvedValue(undefined),
        fill: jest.fn().mockResolvedValue(undefined),
        textContent: jest.fn().mockResolvedValue('Mock content'),
        count: jest.fn().mockResolvedValue(1),
        all: jest.fn().mockResolvedValue([
          {
            boundingBox: jest.fn().mockResolvedValue({ x: 0, y: 0, width: 50, height: 50 }),
            click: jest.fn().mockResolvedValue(undefined),
            getAttribute: jest.fn().mockResolvedValue('true')
          }
        ]),
        getAttribute: jest.fn().mockResolvedValue('mock-value'),
        boundingBox: jest.fn().mockResolvedValue({ x: 0, y: 0, width: 100, height: 50 })
      })),
      waitForSelector: jest.fn().mockResolvedValue(undefined),
      waitForTimeout: jest.fn().mockResolvedValue(undefined),
      waitForURL: jest.fn().mockResolvedValue(undefined),
      screenshot: jest.fn().mockResolvedValue(Buffer.from('mock-screenshot')),
      title: jest.fn().mockResolvedValue('bibiere - Luxury Fashion'),
      url: jest.fn().mockReturnValue('http://localhost:3000'),
      goBack: jest.fn().mockResolvedValue(undefined),
      setViewportSize: jest.fn().mockResolvedValue(undefined),
      mouse: {
        move: jest.fn().mockResolvedValue(undefined),
        down: jest.fn().mockResolvedValue(undefined),
        up: jest.fn().mockResolvedValue(undefined)
      },
      evaluate: jest.fn().mockResolvedValue(360),
      userAgent: jest.fn().mockReturnValue(this.getBrowserUserAgent(browserName, isMobile)),
      close: jest.fn().mockResolvedValue(undefined)
    };

    return mockPage;
  }

  /**
   * Get browser-specific user agent
   */
  private getBrowserUserAgent(browserName: string, isMobile: boolean = false): string {
    const userAgents = {
      chrome: isMobile 
        ? 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      firefox: isMobile
        ? 'Mozilla/5.0 (Mobile; rv:91.0) Gecko/91.0 Firefox/91.0'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
      safari: isMobile
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
      edge: isMobile
        ? 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36 EdgA/91.0.864.59'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59'
    };

    return userAgents[browserName.toLowerCase() as keyof typeof userAgents] || userAgents.chrome;
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    // Cleanup mock resources if needed
  }
}

// Export singleton instance
export const browserEnvironment = BrowserEnvironment.getInstance();