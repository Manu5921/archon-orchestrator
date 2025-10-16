import { EventEmitter } from 'events';
import { logger } from '../utils/logger.js';
import { GeminiCLIWrapper } from './gemini-cli-wrapper.js';

export class GeminiConnector extends EventEmitter {
  constructor() {
    super();
    this.cliWrapper = new GeminiCLIWrapper();
    this.healthy = false;
    this.contexts = new Map();
    this.initialized = false;
  }

  async healthCheck() {
    // SOLUTION ESM: Utiliser le wrapper au lieu d'appel direct
    if (!this.initialized) {
      const initResult = await this.cliWrapper.initialize();
      this.initialized = true;

      if (initResult.success) {
        this.healthy = true;
        return {
          healthy: true,
          version: initResult.version,
          message: 'Gemini CLI available via wrapper'
        };
      } else {
        this.healthy = false;
        return {
          healthy: false,
          error: initResult.error,
          fallback_available: initResult.fallback_mode,
          message: 'Gemini CLI wrapper in fallback mode'
        };
      }
    }

    // Check wrapper health for already initialized instance
    const wrapperHealth = await this.cliWrapper.healthCheck();
    this.healthy = wrapperHealth.healthy;

    return wrapperHealth;
  }

  async execute(taskId, command, args = []) {
    const startTime = Date.now();
    logger.debug(`🚀 Gemini executing task ${taskId}: ${command}`);

    try {
      // 🌉 HYBRID APPROACH: Try Bridge first, fallback to CLI wrapper
      let result;

      // Check if Bridge is available
      const bridgeUrl = process.env.GEMINI_API_URL;
      if (bridgeUrl) {
        try {
          result = await this.executeBridge(command, args, bridgeUrl);
          logger.debug(`✅ Gemini Bridge successful for ${command}`);
        } catch (bridgeError) {
          logger.warn(`🌉 Bridge failed, falling back to CLI wrapper: ${bridgeError.message}`);
          result = await this.executeCLI(command, args);
        }
      } else {
        // Direct CLI wrapper fallback
        result = await this.executeCLI(command, args);
      }

      // Emit output events for compatibility
      if (result.stdout) {
        this.emit('output', { taskId, data: result.stdout, stream: 'stdout' });
      }
      if (result.stderr) {
        this.emit('output', { taskId, data: result.stderr, stream: 'stderr' });
      }

      const duration = Date.now() - startTime;

      return {
        success: result.success,
        output: result.stdout || result.output || 'No output',
        error: result.error || result.stderr,
        duration_ms: duration,
        mode: result.mode || 'normal',
        fallback_reason: result.fallback_reason
      };

    } catch (error) {
      logger.error(`❌ Gemini execution failed for task ${taskId}:`, error);

      return {
        success: false,
        output: '',
        error: error.message,
        duration_ms: Date.now() - startTime
      };
    }
  }

  async exportContext(taskId) {
    // Get context for a specific task
    const context = this.contexts.get(taskId) || {};

    return {
      agent: 'gemini',
      task_id: taskId,
      exploration_results: context.explorations || [],
      iterations: context.iterations || 0,
      discovered_patterns: context.patterns || [],
      timestamp: new Date().toISOString()
    };
  }

  async importContext(taskId, context) {
    // Import context from another agent
    this.contexts.set(taskId, {
      ...context,
      imported_from: context.previous_agent,
      imported_at: new Date().toISOString()
    });

    logger.debug(`Gemini imported context for task ${taskId}`);

    return { success: true };
  }

  async syncContext(contextType, data) {
    // Sync specific context type
    logger.debug(`Gemini syncing ${contextType} context`);

    // Store in internal cache
    this.contexts.set(`sync_${contextType}`, data);

    return { success: true };
  }

  async exploreApproaches(taskDescription, count = 3) {
    // Gemini's special ability: rapid exploration
    const approaches = [];

    for (let i = 0; i < count; i++) {
      const result = await this.execute(
        `explore_${i}`,
        'explore',
        [`"${taskDescription}"`, '--quick', '--creative']
      );

      if (result.success) {
        approaches.push({
          approach_id: i + 1,
          description: result.output,
          viability: Math.random() * 100 // Would be analyzed in real implementation
        });
      }
    }

    return approaches;
  }

  async iterate(taskId, previousResult, refinement) {
    // Gemini's iterative refinement
    const context = this.contexts.get(taskId) || { iterations: 0 };
    context.iterations++;

    const result = await this.execute(
      taskId,
      'refine',
      [`"${refinement}"`, '--previous', JSON.stringify(previousResult)]
    );

    context.last_iteration = result;
    this.contexts.set(taskId, context);

    return result;
  }

  /**
   * Execute via Bridge HTTP API (preferred)
   */
  async executeBridge(command, args, bridgeUrl) {
    const prompt = this.buildPrompt(command, args);

    const response = await fetch(`${bridgeUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`Bridge HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.ok) {
      throw new Error(result.error || 'Bridge execution failed');
    }

    return {
      success: true,
      stdout: result.text,
      output: result.text,
      mode: 'bridge',
      timestamp: result.timestamp
    };
  }

  /**
   * Execute via CLI wrapper (fallback)
   */
  async executeCLI(command, args) {
    switch (command) {
    case 'explore_project':
      const projectDescription = args[0]?.prompt || args[0] || 'Unknown project';
      return await this.cliWrapper.exploreProject(projectDescription, {
        quick: args[0]?.exploration_type === 'quick',
        creative: args[0]?.exploration_type === 'creative' || true
      });

    case 'review_code':
      const code = args[0] || 'No code provided';
      const requirements = args[1] || 'Basic requirements';
      return await this.cliWrapper.reviewCode(code, requirements);

    case 'explore':
      const description = args[0] || 'No description provided';
      return await this.cliWrapper.exploreProject(description, {
        quick: args.includes('--quick'),
        creative: args.includes('--creative')
      });

    default:
      // Fallback pour les commandes non spécialisées
      return await this.cliWrapper.executeCommand([command, ...args]);
    }
  }

  /**
   * Build prompt for both Bridge and CLI
   */
  buildPrompt(command, args) {
    const [mainArg, ...contextArgs] = args;

    switch (command) {
    case 'explore_project':
      return `🚀 **Creative Project Exploration**

Project: ${mainArg?.prompt || mainArg || 'Unknown project'}
Context: ${contextArgs.join(', ')}

Please provide multiple innovative approaches with:

1. **Creative Solutions** (3-5 unique approaches)
2. **Innovation Opportunities** (unexplored possibilities)  
3. **Technical Creativity** (novel implementation ideas)
4. **User Experience Magic** (delightful interaction concepts)
5. **Future Possibilities** (scalability and evolution paths)

Focus on creative problem-solving and innovative thinking.`;

    case 'review_code':
      return `🎨 **Creative Code Review**

Code to review: ${mainArg || 'No code provided'}
Requirements: ${contextArgs[0] || 'General enhancement'}

Please provide:
1. **Creative Enhancement Ideas** (specific improvements)
2. **Innovation Opportunities** (unexplored angles)
3. **User Experience Improvements** (engagement and delight)
4. **Alternative Approaches** (different ways to solve)
5. **Future Evolution** (how this could grow)`;

    default:
      return `🌟 **Creative Gemini Task**

Command: ${command}
Input: ${mainArg || 'No input provided'}
Context: ${contextArgs.join(', ')}

Please provide creative, innovative solutions with multiple approaches and fresh perspectives.`;
    }
  }

  async close() {
    if (this.process) {
      this.process.kill();
    }
    this.contexts.clear();
    logger.debug('Gemini connector closed');
  }
}
