/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/index.ts'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx)'
  ],
  // Tests d'accessibilité spécifiques
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/src/**/*.(test|spec).(ts|tsx)'],
      testPathIgnorePatterns: ['<rootDir>/src/**/*.a11y.(test|spec).(ts|tsx)']
    },
    {
      displayName: 'accessibility',
      testMatch: ['<rootDir>/src/**/*.a11y.(test|spec).(ts|tsx)'],
      setupFilesAfterEnv: ['<rootDir>/src/test-setup-a11y.ts']
    }
  ]
};

module.exports = config;
