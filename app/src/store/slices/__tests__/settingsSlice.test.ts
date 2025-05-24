/**
 * @file settingsSlice.test.ts
 * @description Unit tests for the settings Zustand slice, focusing on development mode toggle.
 * @created 2025-05-24 08:23 ET
 * @lastUpdated 2025-05-24 08:23 ET
 * @module src/store/slices/__tests__/settingsSlice
 */

import { createStore, StoreApi } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createSettingsSlice } from '../settingsSlice';
import type { RootState, SettingsSlice, SettingsSliceState } from '../../store.types';
import * as loggerUtils from '../../../utils/logger'; // Import all to spy on setDevMode

// Mock the logger's setDevMode function
const mockSetLoggerDevMode = jest.spyOn(loggerUtils, 'setDevMode').mockImplementation(() => {});

// Helper to create a fresh store for each test
const createTestStore = () =>
  createStore<RootState>()(
    immer((...args) => ({
      // @ts-ignore - Simulating a combined store for testing a slice
      ...createSettingsSlice(...args),
      // Add other slice creators here if needed for more complex tests
    }))
  );

let store: StoreApi<SettingsSlice>;

describe('settingsSlice - Development Mode', () => {
  beforeEach(() => {
    // Reset mocks and create a new store before each test
    mockSetLoggerDevMode.mockClear();
    // Re-initialize IS_DEV_MODE from logger for consistent test starting points
    // Assuming import.meta.env.DEV is the source of truth for initial state in tests
    const initialDevMode = true; // Or false, depending on typical test environment
    loggerUtils.setDevMode(initialDevMode); // Reset logger's internal state

    store = createTestStore() as unknown as StoreApi<SettingsSlice>;
    // Manually set initial state for isDevelopmentMode in the store for predictability in tests
    // This ensures tests are not dependent on the actual import.meta.env.DEV during test runs
    store.setState({ isDevelopmentMode: initialDevMode, mockApiEnabled: initialDevMode, themeMode: 'system', language: 'en' });
  });

  it('should initialize isDevelopmentMode based on the initial setup', () => {
    // This test relies on the beforeEach setup for initialDevMode
    expect(store.getState().isDevelopmentMode).toBe(true);
  });

  describe('toggleDevelopmentMode', () => {
    it('should toggle isDevelopmentMode from true to false and call logger', () => {
      store.setState({ isDevelopmentMode: true }); // Ensure starting state
      store.getState().toggleDevelopmentMode();
      expect(store.getState().isDevelopmentMode).toBe(false);
      expect(mockSetLoggerDevMode).toHaveBeenCalledWith(false);
    });

    it('should toggle isDevelopmentMode from false to true and call logger', () => {
      store.setState({ isDevelopmentMode: false }); // Ensure starting state
      store.getState().toggleDevelopmentMode();
      expect(store.getState().isDevelopmentMode).toBe(true);
      expect(mockSetLoggerDevMode).toHaveBeenCalledWith(true);
    });
  });

  describe('setDevelopmentMode', () => {
    it('should set isDevelopmentMode to true and call logger', () => {
      store.setState({ isDevelopmentMode: false }); // Ensure starting state is different
      store.getState().setDevelopmentMode(true);
      expect(store.getState().isDevelopmentMode).toBe(true);
      expect(mockSetLoggerDevMode).toHaveBeenCalledWith(true);
    });

    it('should set isDevelopmentMode to false and call logger', () => {
      store.setState({ isDevelopmentMode: true }); // Ensure starting state is different
      store.getState().setDevelopmentMode(false);
      expect(store.getState().isDevelopmentMode).toBe(false);
      expect(mockSetLoggerDevMode).toHaveBeenCalledWith(false);
    });

    it('should not change state if setting to the same value, but still call logger', () => {
      store.setState({ isDevelopmentMode: true });
      store.getState().setDevelopmentMode(true);
      expect(store.getState().isDevelopmentMode).toBe(true);
      expect(mockSetLoggerDevMode).toHaveBeenCalledWith(true); // Logger sync should still happen
    });
  });
});
