const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '<rootDir>/__tests__/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/__tests__/**/*.spec.{js,jsx,ts,tsx}',
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
      plugins: [
        '@babel/plugin-transform-runtime',
      ],
    }],
  },
  // User Flow Validation Test Configuration
  projects: [
    {
      displayName: 'unit',
      testMatch: [
        '<rootDir>/__tests__/components/**/*.test.{js,jsx,ts,tsx}',
        '<rootDir>/__tests__/lib/**/*.test.{js,jsx,ts,tsx}',
        '<rootDir>/__tests__/hooks/**/*.test.{js,jsx,ts,tsx}',
        '<rootDir>/__tests__/seo/**/*.test.{js,jsx,ts,tsx}',
        '<rootDir>/__tests__/security/**/*.test.{js,jsx,ts,tsx}',
        '<rootDir>/__tests__/performance/**/*.test.{js,jsx,ts,tsx}',
        '<rootDir>/__tests__/accessibility.test.{js,jsx,ts,tsx}',
        '<rootDir>/__tests__/e2e/**/*.test.{js,jsx,ts,tsx}',
        '<rootDir>/__tests__/visual-regression/**/*.test.{js,jsx,ts,tsx}',
      ],
    },
    {
      displayName: 'user-flow-validation',
      testMatch: [
        '<rootDir>/__tests__/user-flow-validation/**/*.test.{js,jsx,ts,tsx}',
      ],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/__tests__/user-flow-validation/config/jest.setup.js'],
      timeout: 30000,
      maxWorkers: 1,
      // Specific configuration for user flow validation tests
      globals: {
        'ts-jest': {
          useESM: true,
        },
      },
    },
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)