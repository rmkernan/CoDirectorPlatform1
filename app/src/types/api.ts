// @ts-nocheck
/**
 * @file api.ts
 * @description Defines global types and interfaces for API responses.
 * @created 2025-05-23 11:56 ET
 * @lastUpdated 2025-05-23 11:56 ET
 * @module src/types/api
 */

/**
 * Represents a successful API response.
 * @template T - The type of the data payload.
 */
export interface ApiSuccessResponse<T> {
  /** Indicates the request was successful. */
  success: true;
  /** The data payload of the response. */
  data: T;
  /** Optional message, often for success notifications. */
  message?: string;
  /** Optional HTTP status code. */
  statusCode?: number;
}

/**
 * Represents an error API response.
 */
export interface ApiErrorResponse {
  /** Indicates the request failed. */
  success: false;
  /** A machine-readable error code or identifier. */
  errorCode: string;
  /** A human-readable error message. */
  errorMessage: string;
  /** Optional details about the error, could be an object or array. */
  errorDetails?: unknown;
  /** Optional HTTP status code. */
  statusCode?: number;
}

/**
 * Represents a generic API response which can be either success or error.
 * Uses a discriminated union based on the 'success' property.
 * @template T - The type of the data payload if the response is successful.
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Represents pagination information often included in API responses for lists.
 */
export interface PaginationInfo {
  /** The current page number (1-indexed). */
  currentPage: number;
  /** The total number of items available. */
  totalItems: number;
  /** The total number of pages. */
  totalPages: number;
  /** The number of items per page. */
  itemsPerPage: number;
  /** Optional link to the next page of results. */
  nextPageLink?: string;
  /** Optional link to the previous page of results. */
  previousPageLink?: string;
}

/**
 * Represents a paginated API response.
 * @template T - The type of the items in the list.
 */
export interface PaginatedResponse<T> {
  /** The list of items for the current page. */
  items: T[];
  /** Pagination details. */
  pagination: PaginationInfo;
}

/**
 * Represents a successful API response that includes paginated data.
 * @template T - The type of the items in the paginated list.
 */
export interface ApiPaginatedSuccessResponse<T>
  extends ApiSuccessResponse<PaginatedResponse<T>> {}

/**
 * A generic API response that could be a single item, a list of items, or a paginated list.
 * This can be specialized further based on specific API endpoint needs.
 * @template T - The type of the primary data entity.
 */
export type GenericApiResponse<T> =
  | ApiSuccessResponse<T> // For single item responses
  | ApiSuccessResponse<T[]> // For list of items (non-paginated)
  | ApiPaginatedSuccessResponse<T> // For paginated list of items
  | ApiErrorResponse;
