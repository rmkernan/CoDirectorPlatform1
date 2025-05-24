/**
 * @file localStorage.test.ts
 * @description Unit tests for localStorage utility functions.
 * @created 2025-05-24 08:16 ET
 * @lastUpdated 2025-05-24 08:16 ET
 * @module app/src/utils/__tests__/localStorage
 */

import { setItem, getItem, removeItem } from '../localStorage';
import { logError, logWarn, logInfo } from '../logger';

// Mock the logger to spy on its methods
jest.mock('../logger', () => ({
  logError: jest.fn(),
  logWarn: jest.fn(),
  logInfo: jest.fn(), 
}));

const TEST_KEY = 'testKey';
const TEST_STRING_VALUE = 'testValue';
const TEST_OBJECT_VALUE = { id: 1, name: 'Test Object' };

describe('localStorage Utilities', () => {
  beforeEach(() => {
    // Clear localStorage and reset mocks before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('setItem', () => {
    it('should store a string value correctly', () => {
      setItem(TEST_KEY, TEST_STRING_VALUE);
      expect(localStorage.getItem(TEST_KEY)).toBe(TEST_STRING_VALUE);
    });

    it('should store an object value as a JSON string', () => {
      setItem(TEST_KEY, TEST_OBJECT_VALUE);
      expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(TEST_OBJECT_VALUE));
    });

    it('should log an error if localStorage.setItem throws', () => {
      const error = new Error('LocalStorage is full');
      jest.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw error;
      });
      setItem(TEST_KEY, TEST_STRING_VALUE);
      expect(logError).toHaveBeenCalledWith(
        `Error setting item '${TEST_KEY}' in localStorage:`,
        error
      );
    });
  });

  describe('getItem', () => {
    it('should retrieve a stored string value correctly', () => {
      localStorage.setItem(TEST_KEY, TEST_STRING_VALUE);
      const value = getItem<string>(TEST_KEY);
      expect(value).toBe(TEST_STRING_VALUE);
    });

    it('should retrieve and parse a stored object value correctly', () => {
      localStorage.setItem(TEST_KEY, JSON.stringify(TEST_OBJECT_VALUE));
      const value = getItem<typeof TEST_OBJECT_VALUE>(TEST_KEY);
      expect(value).toEqual(TEST_OBJECT_VALUE);
    });

    it('should return null if the key does not exist', () => {
      const value = getItem<string>('nonExistentKey');
      expect(value).toBeNull();
    });

    it('should return raw string and log a warning if JSON parsing fails for an object-like string', () => {
      const malformedJson = '{ id: 1, name: '; // Missing closing quote and brace
      localStorage.setItem(TEST_KEY, malformedJson);
      const value = getItem<string>(TEST_KEY);
      expect(value).toBe(malformedJson);
      expect(logWarn).toHaveBeenCalledWith(
        `Error parsing JSON for item '${TEST_KEY}' from localStorage. Returning raw value.`,
        expect.any(SyntaxError)
      );
    });

    it('should log an error if localStorage.getItem throws', () => {
      const error = new Error('Permission denied');
      jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
        throw error;
      });
      const value = getItem<string>(TEST_KEY);
      expect(value).toBeNull();
      expect(logError).toHaveBeenCalledWith(
        `Error getting item '${TEST_KEY}' from localStorage:`,
        error
      );
    });
  });

  describe('removeItem', () => {
    it('should remove an item from localStorage', () => {
      localStorage.setItem(TEST_KEY, TEST_STRING_VALUE);
      removeItem(TEST_KEY);
      expect(localStorage.getItem(TEST_KEY)).toBeNull();
    });

    it('should not throw if the key does not exist', () => {
      expect(() => removeItem('nonExistentKey')).not.toThrow();
    });

    it('should log an error if localStorage.removeItem throws', () => {
      const error = new Error('Failed to remove');
      jest.spyOn(Storage.prototype, 'removeItem').mockImplementationOnce(() => {
        throw error;
      });
      removeItem(TEST_KEY);
      expect(logError).toHaveBeenCalledWith(
        `Error removing item '${TEST_KEY}' from localStorage:`,
        error
      );
    });
  });
});
