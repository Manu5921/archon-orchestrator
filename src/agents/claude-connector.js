import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import { logger } from '../utils/logger.js';

export class ClaudeConnector extends EventEmitter {
  constructor() {
    super();
    this.process = null;
    this.healthy = false;
    this.contexts = new Map();
  }

  async healthCheck() {
    try {
      // Check if Claude CLI is available
      const testProcess = spawn('claude', ['--version'], {
        timeout: 5000,
        shell: true
      });

      return new Promise((resolve) => {
        let output = '';

        testProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        testProcess.on('close', (code) => {
          if (code === 0 && (output.includes('claude') || output.includes('Claude Code'))) {
            this.healthy = true;
            resolve({
              healthy: true,
              version: output.trim(),
              message: 'Claude CLI available'
            });
          } else {
            resolve({
              healthy: false,
              error: 'Claude CLI not found or not working'
            });
          }
        });

        testProcess.on('error', (err) => {
          resolve({
            healthy: false,
            error: `Claude CLI error: ${err.message}`
          });
        });

        // Timeout fallback
        setTimeout(() => {
          testProcess.kill();
          resolve({
            healthy: false,
            error: 'Claude CLI health check timeout'
          });
        }, 5000);
      });
    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }

  async execute(taskId, command, args = []) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      logger.debug(`Claude executing task ${taskId}: ${command}`);

      const claudeProcess = spawn('claude', [command, ...args], {
        shell: true,
        env: {
          ...process.env,
          ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY
        }
      });

      let stdout = '';
      let stderr = '';

      claudeProcess.stdout.on('data', (data) => {
        stdout += data.toString();
        this.emit('output', { taskId, data: data.toString(), stream: 'stdout' });
      });

      claudeProcess.stderr.on('data', (data) => {
        stderr += data.toString();
        this.emit('output', { taskId, data: data.toString(), stream: 'stderr' });
      });

      claudeProcess.on('close', (code) => {
        const duration = Date.now() - startTime;

        if (code === 0) {
          resolve({
            success: true,
            output: stdout,
            duration_ms: duration
          });
        } else {
          resolve({
            success: false,
            output: stdout,
            error: stderr,
            duration_ms: duration
          });
        }
      });

      claudeProcess.on('error', (err) => {
        reject(err);
      });
    });
  }

  async exportContext(taskId) {
    // Get context for a specific task
    const context = this.contexts.get(taskId) || {};

    return {
      agent: 'claude',
      task_id: taskId,
      fixes_applied: context.fixes || [],
      code_quality_score: context.quality_score || 0,
      optimization_suggestions: context.optimizations || [],
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

    logger.debug(`Claude imported context for task ${taskId}`);

    return { success: true };
  }

  async syncContext(contextType, data) {
    // Sync specific context type
    logger.debug(`Claude syncing ${contextType} context`);

    // Store in internal cache
    this.contexts.set(`sync_${contextType}`, data);

    return { success: true };
  }

  async analyzePrecisely(taskId, code, issue) {
    // Claude's special ability: precise analysis
    const result = await this.execute(
      taskId,
      'analyze',
      [`"${code}"`, '--issue', `"${issue}"`, '--detailed']
    );

    if (result.success) {
      const context = this.contexts.get(taskId) || {};
      context.last_analysis = {
        code,
        issue,
        analysis: result.output,
        timestamp: new Date().toISOString()
      };
      this.contexts.set(taskId, context);
    }

    return result;
  }

  async applyFix(taskId, file, fix) {
    // Claude's precision fixing
    const result = await this.execute(
      taskId,
      'fix',
      [file, '--apply', `"${fix}"`, '--safe']
    );

    if (result.success) {
      const context = this.contexts.get(taskId) || { fixes: [] };
      context.fixes.push({
        file,
        fix,
        applied_at: new Date().toISOString()
      });
      this.contexts.set(taskId, context);
    }

    return result;
  }

  async reviewCode(taskId, files) {
    // Claude's code review capability
    const reviews = [];

    for (const file of files) {
      const result = await this.execute(
        taskId,
        'review',
        [file, '--comprehensive']
      );

      if (result.success) {
        reviews.push({
          file,
          review: result.output,
          quality_score: this.extractQualityScore(result.output)
        });
      }
    }

    const context = this.contexts.get(taskId) || {};
    context.reviews = reviews;
    context.quality_score = reviews.reduce((acc, r) => acc + r.quality_score, 0) / reviews.length;
    this.contexts.set(taskId, context);

    return reviews;
  }

  extractQualityScore(review) {
    // Extract quality score from review text (simplified)
    const patterns = {
      excellent: 95,
      good: 85,
      acceptable: 75,
      'needs improvement': 65,
      poor: 50
    };

    for (const [pattern, score] of Object.entries(patterns)) {
      if (review.toLowerCase().includes(pattern)) {
        return score;
      }
    }

    return 70; // Default score
  }

  async close() {
    if (this.process) {
      this.process.kill();
    }
    this.contexts.clear();
    logger.debug('Claude connector closed');
  }
}
