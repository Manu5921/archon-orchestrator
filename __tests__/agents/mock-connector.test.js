/**
 * Unit Tests for Mock Connector
 * Tests the mock agent implementation used for testing
 */

import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';

// Mock logger
jest.unstable_mockModule('../../src/utils/logger.js', () => ({
  logger: global.createMockLogger()
}));

// Import after mocking
const { MockConnector } = await import('../../src/agents/mock-connector.js');

describe('MockConnector', () => {
  let mockConnector;

  beforeEach(() => {
    mockConnector = new MockConnector('test-agent');
  });

  afterEach(async () => {
    await mockConnector.close();
    jest.clearAllMocks();
    mockConnector = null;
  });

  describe('Constructor', () => {
    test('should initialize with agent name', () => {
      expect(mockConnector.agentName).toBe('test-agent');
      expect(mockConnector.healthy).toBe(true);
      expect(mockConnector.contexts).toBeInstanceOf(Map);
    });

    test('should create unique agent instances', () => {
      const agent1 = new MockConnector('agent1');
      const agent2 = new MockConnector('agent2');

      expect(agent1.agentName).toBe('agent1');
      expect(agent2.agentName).toBe('agent2');
      expect(agent1).not.toBe(agent2);
    });

    test('should extend EventEmitter', () => {
      expect(mockConnector.on).toBeDefined();
      expect(mockConnector.emit).toBeDefined();
      expect(mockConnector.removeListener).toBeDefined();
    });
  });

  describe('healthCheck', () => {
    test('should return healthy status', async () => {
      const health = await mockConnector.healthCheck();

      expect(health.healthy).toBe(true);
      expect(health.version).toBe('mock-1.0.0');
      expect(health.message).toBe('test-agent mock connector available');
    });

    test('should include agent name in message', async () => {
      const health = await mockConnector.healthCheck();
      expect(health.message).toContain('test-agent');
    });
  });

  describe('execute', () => {
    test('should execute basic task successfully', async () => {
      const result = await mockConnector.execute('task-123', 'test-command', ['arg1']);

      expect(result.success).toBe(true);
      expect(result.output).toContain('test-agent mock response');
      expect(typeof result.duration_ms).toBe('number');
    });

    test('should handle manage_project create command', async () => {
      const args = [{ action: 'create', title: 'Test Project' }];
      const result = await mockConnector.execute('task-123', 'manage_project', args);

      expect(result.success).toBe(true);
      expect(result.project_id).toMatch(/^mock_project_/);
      expect(result.title).toBe('Test Project');
      expect(result.output).toContain('Mock project created');
    });

    test('should handle manage_task create command', async () => {
      const args = [{
        action: 'create',
        title: 'Test Task',
        project_id: 'proj-123'
      }];
      const result = await mockConnector.execute('task-456', 'manage_task', args);

      expect(result.success).toBe(true);
      expect(result.task_id).toMatch(/^mock_task_/);
      expect(result.title).toBe('Test Task');
      expect(result.project_id).toBe('proj-123');
    });

    test('should emit output event during execution', async () => {
      const outputHandler = jest.fn();
      mockConnector.on('output', outputHandler);

      const executePromise = mockConnector.execute('task-789', 'test-event');

      await executePromise;

      expect(outputHandler).toHaveBeenCalledWith({
        taskId: 'task-789',
        data: expect.any(String),
        stream: 'stdout'
      });
    });

    test('should provide different responses for different agents', async () => {
      const geminiConnector = new MockConnector('gemini');
      const claudeConnector = new MockConnector('claude');

      const geminiResult = await geminiConnector.execute('task-1', 'exploration');
      const claudeResult = await claudeConnector.execute('task-2', 'debugging');

      expect(geminiResult.output).toContain('Found 3 approaches');
      expect(claudeResult.output).toContain('Bug identified');
    });

    test('should handle commands without specific responses', async () => {
      const result = await mockConnector.execute('task-999', 'unknown-command');

      expect(result.success).toBe(true);
      expect(result.output).toContain('test-agent mock response for unknown-command');
    });

    test('should measure execution duration', async () => {
      const result = await mockConnector.execute('task-duration', 'timing-test');

      expect(result.duration_ms).toBeGreaterThan(0);
    });
  });

  describe('exportContext', () => {
    test('should export context for task', async () => {
      const context = await mockConnector.exportContext('task-123');

      expect(context.agent).toBe('test-agent');
      expect(context.task_id).toBe('task-123');
      expect(context.mock_data).toBeDefined();
      expect(context.timestamp).toBeDefined();
    });

    test('should export empty context for new task', async () => {
      const context = await mockConnector.exportContext('new-task');

      expect(context.mock_data).toEqual({});
    });

    test('should export stored context for existing task', async () => {
      // First import some context
      await mockConnector.importContext('existing-task', { key: 'value' });

      const context = await mockConnector.exportContext('existing-task');

      expect(context.mock_data).toHaveProperty('key', 'value');
      expect(context.mock_data).toHaveProperty('imported_at');
    });
  });

  describe('importContext', () => {
    test('should import context for task', async () => {
      const contextToImport = {
        previous_agent: 'other-agent',
        data: { test: 'value' }
      };

      const result = await mockConnector.importContext('task-456', contextToImport);

      expect(result.success).toBe(true);

      // Verify context was stored
      const storedContext = mockConnector.contexts.get('task-456');
      expect(storedContext.imported_from).toBe('other-agent');
      expect(storedContext.data).toEqual({ test: 'value' });
      expect(storedContext.imported_at).toBeDefined();
    });

    test('should handle empty context import', async () => {
      const result = await mockConnector.importContext('empty-task', {});

      expect(result.success).toBe(true);

      const storedContext = mockConnector.contexts.get('empty-task');
      expect(storedContext).toBeDefined();
      expect(storedContext.imported_at).toBeDefined();
    });

    test('should merge imported context with metadata', async () => {
      const context = { original: 'data' };

      await mockConnector.importContext('merge-task', context);

      const storedContext = mockConnector.contexts.get('merge-task');
      expect(storedContext.original).toBe('data');
      expect(storedContext.imported_at).toBeDefined();
    });
  });

  describe('syncContext', () => {
    test('should sync context of specified type', async () => {
      const data = { session: 'data' };

      const result = await mockConnector.syncContext('session', data);

      expect(result.success).toBe(true);

      // Verify context was stored with sync prefix
      const storedData = mockConnector.contexts.get('sync_session');
      expect(storedData).toEqual(data);
    });

    test('should handle different context types', async () => {
      await mockConnector.syncContext('user', { id: 123 });
      await mockConnector.syncContext('preferences', { theme: 'dark' });

      expect(mockConnector.contexts.get('sync_user')).toEqual({ id: 123 });
      expect(mockConnector.contexts.get('sync_preferences')).toEqual({ theme: 'dark' });
    });
  });

  describe('close', () => {
    test('should clear contexts on close', async () => {
      // Add some contexts
      mockConnector.contexts.set('task-1', { data: 'test' });
      mockConnector.contexts.set('sync_session', { session: 'data' });

      expect(mockConnector.contexts.size).toBe(2);

      await mockConnector.close();

      expect(mockConnector.contexts.size).toBe(0);
    });

    test('should be callable multiple times', async () => {
      await mockConnector.close();
      await mockConnector.close(); // Should not throw

      expect(mockConnector.contexts.size).toBe(0);
    });
  });

  describe('Event Emitting', () => {
    test('should emit events during task execution', async () => {
      const eventHandler = jest.fn();
      mockConnector.on('output', eventHandler);

      const promise = mockConnector.execute('event-task', 'emit-test');

      await promise;

      expect(eventHandler).toHaveBeenCalledTimes(1);
      expect(eventHandler).toHaveBeenCalledWith({
        taskId: 'event-task',
        data: expect.stringContaining('emit-test'),
        stream: 'stdout'
      });
    });

    test('should support multiple event listeners', async () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      mockConnector.on('output', handler1);
      mockConnector.on('output', handler2);

      const promise = mockConnector.execute('multi-listener', 'test');

      await promise;

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });
  });

  describe('Integration with Real Components', () => {
    test('should work with context import/export flow', async () => {
      // Simulate a handoff scenario
      const originalContext = {
        step: 1,
        data: 'original',
        previous_agent: 'source-agent'
      };

      // Import context
      await mockConnector.importContext('handoff-task', originalContext);

      // Do some work
      await mockConnector.execute('handoff-task', 'process-data');
      // Export context
      const exportedContext = await mockConnector.exportContext('handoff-task');

      expect(exportedContext.agent).toBe('test-agent');
      expect(exportedContext.task_id).toBe('handoff-task');
      expect(exportedContext.mock_data.step).toBe(1);
      expect(exportedContext.mock_data.imported_from).toBe('source-agent');
    });
  });

  describe('Performance and Edge Cases', () => {
    test('should handle rapid sequential calls', async () => {
      const promises = [];

      for (let i = 0; i < 5; i++) { // Reduced to 5 for faster test
        promises.push(mockConnector.execute(`task-${i}`, 'rapid-test'));
      }

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach((result, index) => {
        expect(result.success).toBe(true);
        expect(result.output).toContain('rapid-test');
      });
    });

    test('should handle empty or null arguments', async () => {
      const promise1 = mockConnector.execute('null-task', 'test', null);
      const promise2 = mockConnector.execute('undefined-task', 'test', undefined);
      const promise3 = mockConnector.execute('empty-task', 'test', []);

      const result1 = await promise1;
      const result2 = await promise2;
      const result3 = await promise3;

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result3.success).toBe(true);
    });
  });
});
