/**
 * @file index.ts
 * @description Type definitions for API responses
 * @created 2025-05-22 21:41 ET
 * @lastUpdated 2025-05-22 21:41 ET
 * @module types/api
 */

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    version: string;
    [key: string]: unknown;
  };
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * API error response
 */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Request options for API calls
 */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
  timeout?: number;
  auth?: boolean;
  signal?: AbortSignal;
}
