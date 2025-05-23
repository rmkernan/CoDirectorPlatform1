/**
 * @file jest.config.cjs
 * @description Jest configuration for testing the Co-Director Platform application.
 * Configures the test environment, coverage thresholds, and file transformations.
 *
 * Key Configuration Points for ts-jest:
 * 1. `transform`: Specifies `ts-jest` for `.ts` and `.tsx` files.
 * 2. `tsconfig` path within `ts-jest` options: This path (`app/tsconfig.jest.json`)
 *    is resolved relative to the project root (where Jest is typically run from),
 *    NOT relative to this Jest config file's location. This was a key finding
 *    during troubleshooting.
 * 3. `app/tsconfig.jest.json`: This file extends the main `app/tsconfig.json` and
 *    critically includes `"src"` in its `"include"` array. This ensures that
 *    test files (which might be excluded in the base `tsconfig.json`) are processed
 *    by `ts-jest`.
 * 4. `isolatedModules`: This option is handled by the `tsconfig.json` files.
 *    It was removed from the `ts-jest` options here to avoid deprecation warnings.
 *
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
    '^\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'app/tsconfig.jest.json',
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: {
                metaObjectReplacement: {
                  env: {
                    DEV: true,
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
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
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
  coverageDirectory: 'coverage',
};
