// @ts-nocheck
/**
 * @file index.ts
 * @description Main Zustand store setup. Combines all slices and applies middleware.
 * @created 2025-05-23 12:03 ET
 * @lastUpdated 2025-05-23 12:03 ET
 * @module src/store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { createAuthSlice } from './slices/authSlice';
import { createSettingsSlice } from './slices/settingsSlice';
import type { RootState } from './store.types';

/**
 * Defines the parts of the state that should be persisted to localStorage.
 */
const persistOptions = {
  name: 'app-storage', // Name of the item in localStorage
  getStorage: () => localStorage, // Specify localStorage
  partialize: (state: RootState) => ({
    // Properties from AuthSliceState to persist
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    authToken: state.authToken,
    // Properties from SettingsSliceState to persist
    themeMode: state.themeMode,
    mockApiEnabled: state.mockApiEnabled,
    language: state.language,
  }),
};

/**
 * The main Zustand store hook.
 * Combines all feature slices and applies middleware:
 * - `immer` for simplified immutable state updates.
 * - `persist` for saving selected state to localStorage.
 */
export const useStore = create<RootState>()(
  persist(
    immer((set, get, api) => ({
      ...createAuthSlice(set, get, api),
      ...createSettingsSlice(set, get, api),
      // Add other slices here as they are created, e.g.:
      // ...createChatSlice(set, get, api),
    })),
    persistOptions
  )
);

// Optional: Log store changes in development for debugging
if (import.meta.env.DEV) {
  useStore.subscribe((state, prevState) => {
    console.log('Zustand store changed:', {
      newState: state,
      previousState: prevState,
    });
  });
}
