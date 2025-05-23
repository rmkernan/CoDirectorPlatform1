// @ts-nocheck
/**
 * @file common.ts
 * @description Defines common global types and interfaces used across the application.
 * @created 2025-05-23 11:56 ET
 * @lastUpdated 2025-05-23 11:56 ET
 * @module src/types/common
 */

/**
 * Represents a unique identifier, which can be a string or a number.
 */
export type ID = string | number;

/**
 * Represents a timestamp, typically in ISO 8601 format string.
 * @example "2023-10-27T10:30:00.000Z"
 */
export type Timestamp = string;

/**
 * Represents common loading states, often used for UI elements or data fetching.
 */
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

/**
 * Represents a key-value pair where keys are strings and values can be of any type.
 * Useful for generic object structures, query parameters, headers, etc.
 */
export interface KeyValuePairs {
  [key: string]: any;
}

/**
 * Represents a simple status, often used for items or processes.
 * This is a basic example; more specific status types might be needed per domain.
 */
export type SimpleStatus = 'active' | 'inactive' | 'pending' | 'archived';
