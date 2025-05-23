/**
 * @file setupTests.ts
 * @description Test setup configuration for Jest and React Testing Library.
 * Provides global mocks and configurations needed for component testing.
 * @created 2025-05-22 19:56 ET
 * @lastUpdated 2025-05-22 19:56 ET
 * @module testing
 */

import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

/**
 * Mock implementation for window.matchMedia
 * Required for components that use media queries
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

/**
 * Mock implementation for document.createRange
 * Required for components that use DOM Range objects
 * @returns {Range} A mocked Range object with test implementations
 */
document.createRange = () => {
  const range = new Range();
  range.getBoundingClientRect = jest.fn();
  range.getClientRects = () => ({
    item: () => null,
    length: 0,
    [Symbol.iterator]: jest.fn(),
  });
  return range;
};

/**
 * Configure React Testing Library
 * Sets the attribute used for querying elements in tests
 */
configure({ testIdAttribute: 'data-testid' });
