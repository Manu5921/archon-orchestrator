import { EventEmitter } from 'events';
import { logger } from '../utils/logger.js';

export class MockConnector extends EventEmitter {
  constructor(agentName) {
    super();
    this.agentName = agentName;
    this.healthy = true;
    this.contexts = new Map();
  }

  async healthCheck() {
    return {
      healthy: true,
      version: 'mock-1.0.0',
      message: `${this.agentName} mock connector available`
    };
  }

  async execute(taskId, command, args = []) {
    const startTime = Date.now();

    logger.debug(`[MOCK] ${this.agentName} executing task ${taskId}: ${command}`);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 400));

    const duration = Date.now() - startTime;

    // SOLUTION: Simuler des réponses spécifiques selon le command
    if (command === 'manage_project' && args[0]?.action === 'create') {
      return {
        success: true,
        project_id: `mock_project_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
        title: args[0].title,
        output: `Mock project created: ${args[0].title}`,
        duration_ms: duration
      };
    }

    if (command === 'manage_task' && args[0]?.action === 'create') {
      return {
        success: true,
        task_id: `mock_task_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
        title: args[0].title,
        project_id: args[0].project_id,
        output: `Mock task created: ${args[0].title}`,
        duration_ms: duration
      };
    }

    // Simulate different responses based on agent type
    const responses = {
      gemini: {
        exploration: 'Found 3 approaches:\n1. WebSocket implementation\n2. Server-sent events\n3. Long polling with fallback',
        default: 'Rapid iteration completed with 5 variations tested'
      },
      claude: {
        debugging: 'Bug identified: Missing null check in authentication flow at line 42',
        implementation: 'Code implemented with 98% test coverage and optimized performance',
        default: 'Task completed with high precision and quality'
      },
      archon: {
        architecture: 'Microservices pattern recommended with event-driven communication',
        analysis: 'Comprehensive analysis complete with 12 key insights identified',
        default: 'Architectural synthesis complete with patterns identified'
      }
    };

    const agentResponses = responses[this.agentName] || {};
    const output = agentResponses[command] || agentResponses.default ||
                   `${this.agentName} mock response for ${command}`;

    this.emit('output', {
      taskId,
      data: output,
      stream: 'stdout'
    });

    return {
      success: true,
      output,
      duration_ms: duration
    };
  }

  async exportContext(taskId) {
    const context = this.contexts.get(taskId) || {};

    return {
      agent: this.agentName,
      task_id: taskId,
      mock_data: context,
      timestamp: new Date().toISOString()
    };
  }

  async importContext(taskId, context) {
    this.contexts.set(taskId, {
      ...context,
      imported_from: context.previous_agent,
      imported_at: new Date().toISOString()
    });

    logger.debug(`[MOCK] ${this.agentName} imported context for task ${taskId}`);

    return { success: true };
  }

  async syncContext(contextType, data) {
    logger.debug(`[MOCK] ${this.agentName} syncing ${contextType} context`);
    this.contexts.set(`sync_${contextType}`, data);
    return { success: true };
  }

  async close() {
    this.contexts.clear();
    logger.debug(`[MOCK] ${this.agentName} connector closed`);
  }
}
