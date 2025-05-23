/**
 * @file mockApiClient.ts
 * @description Mock API client for simulating backend interactions during development and testing.
 * @created 2025-05-23 12:30 ET
 * @lastUpdated 2025-05-23 12:30 ET
 * @module src/services/api
 */

import type { UserProfile, AuthState, UserRole } from '../../types/user';
import type {
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
} from '../../types/api';
import type { ID, Timestamp } from '../../types/common';

const SIMULATED_DELAY_MS = 500;

let mockUser: UserProfile | null = null;
let mockAuthToken: string | null = null;

/**
 * Simulates a network delay.
 * @param {number} ms - Milliseconds to delay.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock login function.
 * @param {object} credentials - User credentials.
 * @param {string} credentials.email - User's email.
 * @param {string} credentials.password - User's password.
 * @returns {Promise<ApiResponse<AuthState>>} API response with auth state.
 */
export const login = async (credentials: {
  email: string;
  password: string;
}): Promise<ApiResponse<AuthState>> => {
  await delay(SIMULATED_DELAY_MS);
  if (credentials.email === 'user@example.com' && credentials.password === 'password') {
    mockUser = {
      id: 'user-123' as ID,
      email: 'user@example.com',
      fullName: 'Test User',
      displayName: 'TestUser',
      avatarUrl: 'https://via.placeholder.com/150',
      roles: ['editor' as UserRole],
      isEmailVerified: true,
      createdAt: new Date().toISOString() as Timestamp,
      lastUpdatedAt: new Date().toISOString() as Timestamp,
      isActive: true,
    };
    mockAuthToken = 'mock-auth-token-string';
    const authState: AuthState = {
      isAuthenticated: true,
      user: mockUser,
      authToken: mockAuthToken,
      tokenExpiresAt: new Date(Date.now() + 3600 * 1000).toISOString() as Timestamp,
      authStatus: 'succeeded',
    };
    return {
      success: true,
      data: authState,
      statusCode: 200,
    } as ApiSuccessResponse<AuthState>;
  }
  return {
    success: false,
    errorCode: 'INVALID_CREDENTIALS',
    errorMessage: 'Invalid email or password.',
    statusCode: 401,
  } as ApiErrorResponse;
};

/**
 * Mock logout function.
 * @returns {Promise<ApiResponse<null>>} API response.
 */
export const logout = async (): Promise<ApiResponse<null>> => {
  await delay(SIMULATED_DELAY_MS);
  mockUser = null;
  mockAuthToken = null;
  return {
    success: true,
    data: null,
    statusCode: 200,
  } as ApiSuccessResponse<null>;
};

/**
 * Mock registration function.
 * @param {object} details - User registration details.
 * @param {string} details.email - User's email.
 * @param {string} details.password - User's password.
 * @param {string} [details.fullName] - User's full name.
 * @returns {Promise<ApiResponse<UserProfile>>} API response with user profile.
 */
export const register = async (details: {
  email: string;
  password: string;
  fullName?: string;
}): Promise<ApiResponse<UserProfile>> => {
  await delay(SIMULATED_DELAY_MS);
  if (details.email === 'existing@example.com') {
    return {
      success: false,
      errorCode: 'EMAIL_EXISTS',
      errorMessage: 'An account with this email already exists.',
      statusCode: 409,
    } as ApiErrorResponse;
  }
  mockUser = {
    id: `user-${Date.now()}` as ID,
    email: details.email,
    fullName: details.fullName || 'New User',
    roles: ['viewer' as UserRole],
    isEmailVerified: false,
    createdAt: new Date().toISOString() as Timestamp,
    lastUpdatedAt: new Date().toISOString() as Timestamp,
    isActive: true,
  };
  // In a real scenario, login would likely follow or a token would be issued.
  // For this mock, we'll just return the profile.
  return {
    success: true,
    data: mockUser,
    statusCode: 201,
  } as ApiSuccessResponse<UserProfile>;
};

/**
 * Mock function to fetch the current user's profile.
 * Assumes user is already authenticated (token would be sent in headers in real API).
 * @returns {Promise<ApiResponse<UserProfile>>} API response with user profile.
 */
export const fetchUserProfile = async (): Promise<ApiResponse<UserProfile>> => {
  await delay(SIMULATED_DELAY_MS);
  if (mockUser && mockAuthToken) {
    return {
      success: true,
      data: mockUser,
      statusCode: 200,
    } as ApiSuccessResponse<UserProfile>;
  }
  return {
    success: false,
    errorCode: 'UNAUTHENTICATED',
    errorMessage: 'User is not authenticated.',
    statusCode: 401,
  } as ApiErrorResponse;
};

// TODO: Add more mock functions as needed (e.g., updateUserProfile, CRUD operations for other entities)
