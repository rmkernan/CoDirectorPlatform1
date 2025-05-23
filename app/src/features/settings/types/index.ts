/**
 * @file index.ts
 * @description Type definitions for the settings feature
 * @created 2025-05-22 21:42 ET
 * @lastUpdated 2025-05-22 21:42 ET
 * @module features/settings/types
 */

/**
 * Represents user preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
  // Add other preferences as needed
}

/**
 * Represents the settings state
 */
export interface SettingsState {
  preferences: UserPreferences;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

/**
 * Represents available theme options
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Represents available font size options
 */
export type FontSize = 'small' | 'medium' | 'large';
