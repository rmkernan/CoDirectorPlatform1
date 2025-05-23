/**
 * @file logger.test.ts
 * @description Unit tests for the logger utility. Tests the behavior of logging functions in both development and production environments.
 * @created 2025-05-23 14:01 ET
 * @lastUpdated 2025-05-23 14:43 ET
 * @module App/Utils/LoggerTests
 */

import { logInfo, logWarn, logError, setDevMode } from '../logger';

const LOG_PREFIX = '[CoDirectorApp]';

describe('Logger Utilities', () => {
  // Spies to track console method calls
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Set up console spies - these replace the actual console methods
    // so we can verify they're called appropriately
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up by restoring the original console methods
    consoleInfoSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('when in development mode', () => {
    beforeEach(() => {
      // Simulate development environment
      setDevMode(true);
    });

    it('logInfo should call console.info with prefix and arguments', () => {
      logInfo('Test info message', { data: 123 });
      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      expect(consoleInfoSpy).toHaveBeenCalledWith(LOG_PREFIX, 'Test info message', { data: 123 });
    });

    it('logWarn should call console.warn with prefix and arguments', () => {
      logWarn('Test warn message', new Error('test error'));
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(LOG_PREFIX, 'Test warn message', new Error('test error'));
    });

    it('logError should call console.error with prefix and arguments', () => {
      logError('Test error message', { code: 500 });
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(LOG_PREFIX, 'Test error message', { code: 500 });
    });
  });

  describe('when not in development mode', () => {
    beforeEach(() => {
      // Simulate production environment
      setDevMode(false);
    });

    it('logInfo should not call console.info', () => {
      logInfo('Test info message - should not log');
      expect(consoleInfoSpy).not.toHaveBeenCalled();
    });

    it('logWarn should not call console.warn', () => {
      logWarn('Test warn message - should not log');
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('logError should not call console.error', () => {
      logError('Test error message - should not log');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });
});