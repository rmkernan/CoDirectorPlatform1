/**
 * @file jest.config.cjs
 * @description Jest configuration for testing the Co-Director Platform application.
 * Configures the test environment, coverage thresholds, and file transformations.
 * @created 2025-05-22 20:01 ET
 * @lastUpdated 2025-05-23 14:27 ET
 * @module testing
 * @type {import('ts-jest').JestConfigWithTsJest}
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
        diagnostics: {
          ignoreCodes: [1343], // TS1343: The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'esnext', or 'system'.
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: {
                metaObjectReplacement: {
                  env: {
                    DEV: true,    // Default to true for testing environment
                    PROD: false,
                    SSR: false
                  }
                }
              }
            }
          ]
        }
      },
    ],
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/index.ts',
    '!src/main.tsx',
    '!src/App.tsx',
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
