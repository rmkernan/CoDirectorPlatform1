// @ts-nocheck
/**
 * @file settingsSlice.ts
 * @description Zustand slice for managing application-wide settings, such as theme, language, and mock API status.
 * @created 2025-05-23 12:03 ET
 * @lastUpdated 2025-05-24 08:21 ET
 * @module src/store/slices/settingsSlice
 */

import type { StateCreator } from 'zustand';
import type { RootState, SettingsSlice, SettingsSliceState } from '../store.types';
import type { ThemeMode } from '@/types/ui';
import { setDevMode as setLoggerDevMode } from '../../utils/logger'; // Renamed to avoid conflict

/**
 * Initial state for the settings slice.
 * The mockApiEnabled defaults to true in development and false otherwise.
 * Language defaults to 'en' (English).
 */
const initialSettingsState: SettingsSliceState = {
  themeMode: 'system', // Default to system preference
  mockApiEnabled: import.meta.env.DEV, // true in development, false in production
  language: 'en', // Default language
  isDevelopmentMode: import.meta.env.DEV, // Initialize from environment
};

/**
 * Creates the settings slice with state and actions.
 * @param set - Zustand's set function to update state.
 * @param get - Zustand's get function to access current state.
 * @returns The settings slice.
 */
export const createSettingsSlice: StateCreator<
  RootState, 
  [['zustand/immer', never]], // For immer middleware
  [], 
  SettingsSlice
> = (set, get) => ({
  ...initialSettingsState,

  setThemeMode: (mode: ThemeMode) => {
    set((state) => {
      state.themeMode = mode;
    });
  },

  toggleMockApi: () => {
    set((state) => {
      state.mockApiEnabled = !state.mockApiEnabled;
    });
  },

  setLanguage: (lang: string) => {
    set((state) => {
      state.language = lang;
    });
  },

  toggleDevelopmentMode: () => {
    set((state) => {
      const newDevMode = !state.isDevelopmentMode;
      state.isDevelopmentMode = newDevMode;
      setLoggerDevMode(newDevMode); // Sync with logger
    });
  },

  setDevelopmentMode: (isDev: boolean) => {
    set((state) => {
      state.isDevelopmentMode = isDev;
      setLoggerDevMode(isDev); // Sync with logger
    });
  },
});
