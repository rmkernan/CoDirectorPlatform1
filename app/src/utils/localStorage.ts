/**
 * @file localStorage.ts
 * @description Utility functions for interacting with browser localStorage.
 * @created 2025-05-24 08:16 ET
 * @lastUpdated 2025-05-24 08:16 ET
 * @module app/src/utils/localStorage
 */

import { logError, logWarn } from './logger';

/**
 * Stores an item in localStorage.
 * Handles JSON stringification for non-string values.
 * Logs errors if storing fails.
 *
 * @template T The type of the value to store.
 * @param {string} key The key under which to store the value.
 * @param {T} value The value to store.
 */
export const setItem = <T>(key: string, value: T): void => {
  try {
    const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, valueToStore);
  } catch (error) {
    logError(`Error setting item '${key}' in localStorage:`, error);
    // Optionally, re-throw or handle more gracefully depending on app requirements
  }
};

/**
 * Retrieves an item from localStorage.
 * Attempts to parse JSON strings; returns raw string if parsing fails.
 * Logs errors if retrieval or parsing fails.
 *
 * @template T The expected type of the retrieved value.
 * @param {string} key The key of the item to retrieve.
 * @returns {T | null} The retrieved value, or null if the key is not found or an error occurs.
 */
export const getItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }

    // Attempt to parse if it looks like a JSON string
    if (item.startsWith('{') || item.startsWith('[')) {
      try {
        return JSON.parse(item) as T;
      } catch (parseError) {
        logWarn(`Error parsing JSON for item '${key}' from localStorage. Returning raw value.`, parseError);
        // Fallback to returning the raw string if it's not valid JSON but was retrieved
        return item as unknown as T; 
      }
    }
    return item as unknown as T; // For plain strings or other non-JSON values
  } catch (error) {
    logError(`Error getting item '${key}' from localStorage:`, error);
    return null;
  }
};

/**
 * Removes an item from localStorage.
 * Logs errors if removal fails.
 *
 * @param {string} key The key of the item to remove.
 */
export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    logError(`Error removing item '${key}' from localStorage:`, error);
  }
};
