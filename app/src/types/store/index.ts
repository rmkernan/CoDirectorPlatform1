/**
 * @file index.ts
 * @description Type definitions for the application store
 * @created 2025-05-22 21:42 ET
 * @lastUpdated 2025-05-22 21:42 ET
 * @module types/store
 */

import { AuthState } from '@features/auth/types';
import { ChatState } from '@features/chat/types';
import { SettingsState } from '@features/settings/types';

/**
 * Root application state
 */
export interface RootState {
  /**
   * Authentication state
   */
  auth: AuthState;
  
  /**
   * Chat state
   */
  chat: ChatState;
  
  /**
   * Settings state
   */
  settings: SettingsState;
  
  /**
   * Router state (if using connected router)
   */
  router?: any;
}

/**
 * Action type with payload
 */
export interface Action<T = any> {
  type: string;
  payload?: T;
  meta?: any;
  error?: boolean;
}

/**
 * Action creator function type
 */
export type ActionCreator<T = any> = (
  ...args: any[]
) => Action<T> | ((dispatch: any, getState: () => RootState) => void);

/**
 * Reducer function type
 */
export type Reducer<S = any, A = any> = (
  state: S | undefined,
  action: A
) => S;

/**
 * Slice configuration
 */
export interface SliceConfig<S, A = any> {
  /**
   * Name of the slice
   */
  name: string;
  
  /**
   * Initial state
   */
  initialState: S;
  
  /**
   * Reducers
   */
  reducers: {
    [key: string]: (state: S, action: Action<A>) => void;
  };
  
  /**
   * Extra reducers
   */
  extraReducers?: (builder: any) => void;
}
