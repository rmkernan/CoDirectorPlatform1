// @ts-nocheck
/**
 * @file store.types.ts
 * @description Defines TypeScript interfaces and types for the Zustand store, including states and actions for various slices.
 * @created 2025-05-23 12:03 ET
 * @lastUpdated 2025-05-24 08:21 ET
 * @module src/store/store.types
 */

import type { AuthState, UserProfile } from '@/types/user';
import type { ThemeMode } from '@/types/ui';

// --- Auth Slice ---

/**
 * Represents the state for the authentication slice.
 * Extends the global AuthState type.
 */
export interface AuthSliceState extends AuthState {}

/**
 * Defines the actions available for the authentication slice.
 */
export interface AuthSliceActions {
  /**
   * Sets the authentication status and user profile upon successful login.
   * @param user - The user profile of the authenticated user.
   * @param authToken - Optional authentication token.
   */
  loginSuccess: (user: UserProfile, authToken?: string) => void;

  /**
   * Clears authentication state upon logout.
   */
  logout: () => void;

  /**
   * Sets the current authentication status (e.g., pending, failed).
   * @param status - The new authentication status.
   */
  setAuthStatus: (status: AuthSliceState['authStatus']) => void;

  /**
   * Sets an authentication error message.
   * @param error - The error message or null to clear.
   */
  setAuthError: (error: string | null) => void;

  /**
   * Updates parts of the user profile.
   * @param updates - Partial user profile data to update.
   */
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

/**
 * Combined type for the authentication slice, including both state and actions.
 */
export type AuthSlice = AuthSliceState & AuthSliceActions;


// --- Settings Slice ---

/**
 * Represents the state for the application settings slice.
 */
export interface SettingsSliceState {
  /** The current theme mode (light, dark, or system). */
  themeMode: ThemeMode;
  /** Indicates if the mock API is currently enabled. */
  mockApiEnabled: boolean;
  /** Language preference for the application. Example: 'en', 'es'. */
  language: string;
  /** Indicates if the application is currently in development mode. */
  isDevelopmentMode: boolean;
}

/**
 * Defines the actions available for the settings slice.
 */
export interface SettingsSliceActions {
  /**
   * Sets the theme mode for the application.
   * @param mode - The theme mode to set.
   */
  setThemeMode: (mode: ThemeMode) => void;

  /**
   * Toggles the mock API on or off.
   */
  toggleMockApi: () => void;

  /**
   * Sets the application language.
   * @param lang - The language code (e.g., 'en', 'es').
   */
  setLanguage: (lang: string) => void;

  /**
   * Toggles the development mode on or off.
   * This also updates the logger's internal state.
   */
  toggleDevelopmentMode: () => void;

  /**
   * Sets the development mode to a specific state.
   * This also updates the logger's internal state.
   * @param isDev - True to enable development mode, false to disable.
   */
  setDevelopmentMode: (isDev: boolean) => void;
}

/**
 * Combined type for the settings slice, including both state and actions.
 */
export type SettingsSlice = SettingsSliceState & SettingsSliceActions;


// --- Root Store ---

/**
 * Represents the root state of the entire Zustand store, combining all slices.
 * This will be extended as more slices are added.
 * It includes both state and actions from all slices.
 */
export type RootState = AuthSlice & SettingsSlice; // Add other slice types here with '&'
