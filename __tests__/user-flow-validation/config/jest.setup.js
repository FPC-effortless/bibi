/**
 * Jest setup for User Flow Validation tests
 * Handles environment-specific configuration
 */

// Disable auto-setup during Jest execution
process.env.AUTO_SETUP_VALIDATION = 'false';

// Mock browser APIs that might not be available in Jest environment
if (typeof window === 'undefined') {
  global.window = {
    matchMedia: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
    location: {
      href: 'http://localhost:3000',
      origin: 'http://localhost:3000',
      protocol: 'http:',
      host: 'localhost:3000',
      hostname: 'localhost',
      port: '3000',
      pathname: '/',
      search: '',
      hash: ''
    },
    navigator: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  };
}

// Mock console methods for cleaner test output
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Only show important messages during tests
console.log = (...args) => {
  const message = args.join(' ');
  if (message.includes('✅') || message.includes('❌') || message.includes('Framework')) {
    originalConsoleLog(...args);
  }
};

console.error = (...args) => {
  const message = args.join(' ');
  // Always show errors, but filter out expected ones during testing
  if (!message.includes('Auto-setup failed') && !message.includes('Failed to setup User Flow Validation Framework')) {
    originalConsoleError(...args);
  }
};

// Restore console methods after tests
afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});