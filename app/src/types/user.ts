// @ts-nocheck
/**
 * @file user.ts
 * @description Defines global types and interfaces related to user data and profiles.
 * @created 2025-05-23 11:58 ET
 * @lastUpdated 2025-05-23 11:58 ET
 * @module src/types/user
 */

import type { ID, Timestamp } from './common';

/**
 * Represents the roles a user can have within the application.
 * This can be expanded based on specific application needs.
 */
export type UserRole = 'admin' | 'editor' | 'viewer' | 'guest';

/**
 * Represents a user's profile information.
 * This is a foundational type that might be extended by feature-specific user data.
 */
export interface UserProfile {
  /** The unique identifier for the user. */
  id: ID;
  /** The user's primary email address (often used for login). */
  email: string;
  /** The user's full name. */
  fullName?: string;
  /** The user's chosen display name or username. */
  displayName?: string;
  /** URL to the user's avatar image. */
  avatarUrl?: string;
  /** The roles assigned to the user. */
  roles: UserRole[];
  /** Indicates if the user's email has been verified. */
  isEmailVerified: boolean;
  /** The date and time when the user account was created. */
  createdAt: Timestamp;
  /** The date and time when the user profile was last updated. */
  lastUpdatedAt: Timestamp;
  /** Optional field for any additional preferences or settings. */
  preferences?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  /** Indicates if the user account is active or disabled. */
  isActive: boolean;
}

/**
 * Represents basic authentication status and user information.
 * Often part of a global authentication state.
 */
export interface AuthState {
  /** Indicates if the user is currently authenticated. */
  isAuthenticated: boolean;
  /** The current user's profile, null if not authenticated. */
  user: UserProfile | null;
  /** Token used for API authentication, if applicable. */
  authToken?: string;
  /** Timestamp when the authentication token expires, if applicable. */
  tokenExpiresAt?: Timestamp;
  /** Current authentication status (e.g., checking, authenticated, unauthenticated). */
  authStatus: 'idle' | 'pending' | 'succeeded' | 'failed';
  /** Any error message related to authentication. */
  authError?: string | null;
}
