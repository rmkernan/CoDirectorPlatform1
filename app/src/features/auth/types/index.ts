/**
 * @file index.ts
 * @description Type definitions for the auth feature
 * @created 2025-05-22 21:43 ET
 * @lastUpdated 2025-05-22 21:43 ET
 * @module features/auth/types
 */

/**
 * Represents user authentication credentials
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Represents the authentication state
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Represents a user in the system
 */
export interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

/**
 * Represents the response from the authentication API
 */
export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}
