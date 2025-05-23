// @ts-nocheck
/**
 * @file authSlice.ts
 * @description Zustand slice for managing authentication state, user profile, and related actions.
 * @created 2025-05-23 12:03 ET
 * @lastUpdated 2025-05-23 12:03 ET
 * @module src/store/slices/authSlice
 */

import type { StateCreator } from 'zustand';
import type { RootState, AuthSlice, AuthSliceState } from '../store.types';
import type { UserProfile } from '@/types/user';

/**
 * Initial state for the authentication slice.
 */
const initialAuthState: AuthSliceState = {
  isAuthenticated: false,
  user: null,
  authToken: null,
  authStatus: 'idle',
  authError: null,
};

/**
 * Creates the authentication slice with state and actions.
 * @param set - Zustand's set function to update state.
 * @param get - Zustand's get function to access current state.
 * @returns The authentication slice.
 */
export const createAuthSlice: StateCreator<
  RootState, 
  [['zustand/immer', never]], // For immer middleware
  [], 
  AuthSlice
> = (set, get) => ({
  ...initialAuthState,

  loginSuccess: (user: UserProfile, authToken?: string) => {
    set((state) => {
      state.isAuthenticated = true;
      state.user = user;
      state.authToken = authToken || null;
      state.authStatus = 'succeeded';
      state.authError = null;
    });
  },

  logout: () => {
    set((state) => {
      Object.assign(state, initialAuthState); // Reset to initial state
    });
    // Potentially clear other persisted data or call an API endpoint
  },

  setAuthStatus: (status: AuthSliceState['authStatus']) => {
    set((state) => {
      state.authStatus = status;
    });
  },

  setAuthError: (error: string | null) => {
    set((state) => {
      state.authError = error;
      if (error) {
        state.authStatus = 'failed';
      }
    });
  },

  updateUserProfile: (updates: Partial<UserProfile>) => {
    set((state) => {
      if (state.user) {
        state.user = { ...state.user, ...updates };
      }
    });
  },
});
