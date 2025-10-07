/**
 * Jest Global Setup for Triple-Agent Orchestra Tests
 * Configures test environment, mocks, and global utilities
 */

import { jest } from '@jest/globals';

// Global test configuration
global.console = {
  ...console,
  // Suppress logs during tests unless debugging
  log: process.env.DEBUG ? console.log : jest.fn(),
  debug: process.env.DEBUG ? console.debug : jest.fn(),
  info: process.env.DEBUG ? console.info : jest.fn(),
  warn: process.env.DEBUG ? console.warn : jest.fn(),
  error: console.error // Always show errors
};

// Environment variables for tests
process.env.NODE_ENV = 'test';
process.env.USE_MOCK_AGENTS = 'true';
process.env.LOG_LEVEL = 'error';
process.env.MCP_PORT = '3457'; // Different port for tests

// Global test utilities
global.createMockLogger = () => ({
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
});

global.createMockAgent = (name = 'test-agent') => ({
  name,
  execute: jest.fn().mockResolvedValue({ success: true, result: 'mock result' }),
  healthCheck: jest.fn().mockResolvedValue({ healthy: true, message: 'OK' }),
  close: jest.fn().mockResolvedValue(),
  exportContext: jest.fn().mockResolvedValue({}),
  importContext: jest.fn().mockResolvedValue(),
  syncContext: jest.fn().mockResolvedValue({ success: true })
});

global.createMockOrchestrator = () => ({
  agents: new Map(),
  router: {
    route: jest.fn().mockResolvedValue({
      primary_agent: 'mock-agent',
      fallback_agents: [],
      confidence: 95,
      reasoning: 'Mock routing decision'
    }),
    initialize: jest.fn().mockResolvedValue(),
    learn: jest.fn().mockResolvedValue(),
    save: jest.fn().mockResolvedValue()
  },
  metrics: {
    recordTaskResult: jest.fn(),
    recordRoutingDecision: jest.fn(),
    recordHandoff: jest.fn(),
    getStats: jest.fn().mockResolvedValue({}),
    getSuccessRate: jest.fn().mockResolvedValue(0.95),
    save: jest.fn().mockResolvedValue()
  },
  contextManager: {
    store: jest.fn().mockResolvedValue(),
    get: jest.fn().mockResolvedValue({}),
    clear: jest.fn().mockResolvedValue()
  },
  activeTasks: new Map(),
  initialize: jest.fn().mockResolvedValue(),
  shutdown: jest.fn().mockResolvedValue(),
  getResources: jest.fn().mockResolvedValue([])
});

// Jest configuration
jest.setTimeout(30000); // 30 seconds for all tests

// Cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
  // Clear any active tasks or connections
  if (global.testCleanup) {
    global.testCleanup.forEach(cleanup => cleanup());
    global.testCleanup = [];
  }
});

// Initialize cleanup array
global.testCleanup = [];