/**
 * @file logger.ts
 * @description Provides logging utility functions for the application.
 * @created 2025-05-23 13:30 ET
 * @lastUpdated 2025-05-23 14:43 ET
 * @module App/Utils/Logger
 */

const LOG_PREFIX = '[CoDirectorApp]';

/**
 * Flag indicating if the application is in development mode.
 * Initialized from import.meta.env.DEV but can be overridden for testing.
 */
export let IS_DEV_MODE = import.meta.env.DEV === true;

/**
 * For testing only - allows overriding the development mode detection.
 * @param {boolean} isDev - True to simulate development mode, false for production
 */
export function setDevMode(isDev: boolean): void {
  IS_DEV_MODE = isDev;
}

/**
 * Logs an informational message to the console if in development mode.
 * @param {...any} args - The arguments to log.
 */
export const logInfo = (...args: any[]): void => {
  if (IS_DEV_MODE) {
    console.info(LOG_PREFIX, ...args);
  }
};

/**
 * Logs a warning message to the console if in development mode.
 * @param {...any} args - The arguments to log.
 */
export const logWarn = (...args: any[]): void => {
  if (IS_DEV_MODE) {
    console.warn(LOG_PREFIX, ...args);
  }
};

/**
 * Logs an error message to the console if in development mode.
 * @param {...any} args - The arguments to log.
 */
export const logError = (...args: any[]): void => {
  if (IS_DEV_MODE) {
    console.error(LOG_PREFIX, ...args);
  }
};