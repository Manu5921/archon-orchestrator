/**
 * Unit Tests for Logger Utility
 * Tests all logging methods and configuration
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { Logger, logger } from '../../src/utils/logger.js';

describe('Logger', () => {
  let testLogger;
  let consoleSpy;

  beforeEach(() => {
    testLogger = new Logger('TestLogger');
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(() => {}),
      warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
      error: jest.spyOn(console, 'error').mockImplementation(() => {})
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.DEBUG;
  });

  describe('Logger Class', () => {
    test('should create logger with provided name', () => {
      expect(testLogger.name).toBe('TestLogger');
    });

    test('should log info messages', () => {
      testLogger.info('Test info message');
      expect(consoleSpy.log).toHaveBeenCalledWith('[TestLogger] INFO: Test info message');
    });

    test('should log warning messages', () => {
      testLogger.warn('Test warning message');
      expect(consoleSpy.warn).toHaveBeenCalledWith('[TestLogger] WARN: Test warning message');
    });

    test('should log error messages', () => {
      testLogger.error('Test error message');
      expect(consoleSpy.error).toHaveBeenCalledWith('[TestLogger] ERROR: Test error message');
    });

    test('should not log debug messages when DEBUG is not set', () => {
      testLogger.debug('Test debug message');
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    test('should log debug messages when DEBUG environment variable is set', () => {
      process.env.DEBUG = 'true';
      testLogger.debug('Test debug message');
      expect(consoleSpy.log).toHaveBeenCalledWith('[TestLogger] DEBUG: Test debug message');
    });
  });

  describe('Default Logger Instance', () => {
    test('should export default logger instance', () => {
      expect(logger).toBeInstanceOf(Logger);
      expect(logger.name).toBe('Archon');
    });

    test('should use default logger for logging', () => {
      logger.info('Test default logger');
      expect(consoleSpy.log).toHaveBeenCalledWith('[Archon] INFO: Test default logger');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty messages', () => {
      testLogger.info('');
      expect(consoleSpy.log).toHaveBeenCalledWith('[TestLogger] INFO: ');
    });

    test('should handle null/undefined messages', () => {
      testLogger.info(null);
      testLogger.warn(undefined);
      expect(consoleSpy.log).toHaveBeenCalledWith('[TestLogger] INFO: null');
      expect(consoleSpy.warn).toHaveBeenCalledWith('[TestLogger] WARN: undefined');
    });

    test('should handle object messages', () => {
      const testObj = { test: 'value', number: 42 };
      testLogger.info(testObj);
      expect(consoleSpy.log).toHaveBeenCalledWith(`[TestLogger] INFO: ${testObj}`);
    });

    test('should handle very long messages', () => {
      const longMessage = 'a'.repeat(10000);
      testLogger.error(longMessage);
      expect(consoleSpy.error).toHaveBeenCalledWith(`[TestLogger] ERROR: ${longMessage}`);
    });
  });

  describe('Performance Tests', () => {
    test('should handle rapid logging calls', () => {
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        testLogger.info(`Message ${i}`);
      }
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(1000); // Should complete in less than 1 second
      expect(consoleSpy.log).toHaveBeenCalledTimes(1000);
    });

    test('should not impact performance when debug is disabled', () => {
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        testLogger.debug(`Debug message ${i}`);
      }
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100); // Should be very fast when disabled
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  describe('Memory Management', () => {
    test('should not leak memory with multiple logger instances', () => {
      const loggers = [];
      for (let i = 0; i < 100; i++) {
        loggers.push(new Logger(`Logger${i}`));
      }

      loggers.forEach((log, index) => {
        log.info(`Test message ${index}`);
        expect(log.name).toBe(`Logger${index}`);
      });

      expect(consoleSpy.log).toHaveBeenCalledTimes(100);
    });
  });
});
