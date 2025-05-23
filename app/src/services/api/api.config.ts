// @ts-nocheck
/**
 * @file api.config.ts
 * @description Configuration settings for the API client, including base URL and default headers.
 * @created 2025-05-23 12:10 ET
 * @lastUpdated 2025-05-23 12:10 ET
 * @module src/services/api/api.config
 */

/**
 * The base URL for all API requests.
 * Uses the VITE_API_BASE_URL environment variable if set, otherwise defaults to a local mock server URL.
 */
export const API_BASE_URL: string = 
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Default headers to be included in every API request.
 * Can be extended or overridden by specific request configurations.
 */
export const DEFAULT_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Default request timeout in milliseconds.
 * Note: Fetch API itself doesn't have a built-in timeout. This constant can be used with AbortController for custom timeout logic.
 */
export const REQUEST_TIMEOUT_MS: number = 15000; // 15 seconds
