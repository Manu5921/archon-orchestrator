import { logger } from '../utils/logger.js';
import { EventSource } from 'eventsource';

/**
 * Archon MCP Connector (Server-Sent Events)
 * Uses SSE to communicate with Archon's MCP server
 * Based on Archon's actual transport: "sse" / "streamable-http"
 */
export class ArchonMCPConnector {
  constructor(config = {}) {
    this.config = {
      mcpUrl: config.mcpUrl || 'http://localhost:8051',
      timeout: config.timeout || 30000,
      ...config
    };
    this.connected = false;
    this.eventSource = null;
    this.pendingRequests = new Map();
    this.requestCounter = 0;
  }

  async healthCheck() {
    try {
      // Try to connect via SSE to test availability
      const testSource = new EventSource(this.config.mcpUrl);

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          testSource.close();
          resolve({
            healthy: false,
            error: 'SSE connection timeout'
          });
        }, 5000);

        testSource.onopen = () => {
          clearTimeout(timeout);
          testSource.close();
          resolve({
            healthy: true,
            version: '1.0.0',
            message: `Archon MCP SSE available at ${this.config.mcpUrl}`
          });
        };

        testSource.onerror = (error) => {
          clearTimeout(timeout);
          testSource.close();
          resolve({
            healthy: false,
            error: 'SSE connection failed'
          });
        };
      });
    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }

  async connect() {
    if (this.connected) {
      return true;
    }

    try {
      logger.info(`🔌 Connecting to Archon MCP server via SSE: ${this.config.mcpUrl}`);

      this.eventSource = new EventSource(this.config.mcpUrl);

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          this.eventSource?.close();
          reject(new Error('SSE connection timeout'));
        }, this.config.timeout);

        this.eventSource.onopen = () => {
          clearTimeout(timeout);
          this.connected = true;
          logger.info('✅ Connected to Archon MCP server via SSE');
          resolve(true);
        };

        this.eventSource.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            logger.error('Failed to parse SSE message:', error);
          }
        };

        this.eventSource.onerror = (error) => {
          clearTimeout(timeout);
          logger.error('Archon MCP SSE error:', error);
          this.connected = false;
          reject(error);
        };
      });
    } catch (error) {
      logger.error('Failed to connect to Archon MCP via SSE:', error);
      throw error;
    }
  }

  handleMessage(message) {
    if (message.id && this.pendingRequests.has(message.id)) {
      const { resolve, reject } = this.pendingRequests.get(message.id);
      this.pendingRequests.delete(message.id);

      if (message.error) {
        reject(new Error(message.error.message || 'MCP request failed'));
      } else {
        resolve(message.result);
      }
    }
  }

  async sendRequest(method, params = {}) {
    if (!this.connected) {
      await this.connect();
    }

    const requestId = ++this.requestCounter;
    const request = {
      jsonrpc: '2.0',
      id: requestId,
      method,
      params
    };

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error(`Request timeout: ${method}`));
      }, this.config.timeout);

      this.pendingRequests.set(requestId, {
        resolve: (result) => {
          clearTimeout(timeout);
          resolve(result);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        }
      });

      // For SSE, we need to send the request via HTTP POST to a separate endpoint
      fetch(`${this.config.mcpUrl}/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      }).catch(error => {
        this.pendingRequests.delete(requestId);
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  async execute(taskId, command, args = []) {
    const startTime = Date.now();

    try {
      logger.debug(`[ARCHON MCP SSE] Executing ${command} for task ${taskId}`, args);

      let toolName;
      let toolParams;
      const duration = () => Date.now() - startTime;

      switch (command) {
      case 'manage_project':
        toolName = 'tools/call';
        toolParams = {
          name: 'archon:manage_project',
          arguments: args[0] || {}
        };
        break;

      case 'manage_task':
        toolName = 'tools/call';
        toolParams = {
          name: 'archon:manage_task',
          arguments: args[0] || {}
        };
        break;

      case 'perform_rag_query':
        toolName = 'tools/call';
        toolParams = {
          name: 'archon:perform_rag_query',
          arguments: {
            query: args[0]?.query || args[0],
            match_count: args[0]?.match_count || 5
          }
        };
        break;

      case 'search_code_examples':
        toolName = 'tools/call';
        toolParams = {
          name: 'archon:search_code_examples',
          arguments: {
            query: args[0]?.query || args[0],
            match_count: args[0]?.match_count || 3
          }
        };
        break;

      default:
        return {
          success: false,
          error: `Command ${command} not supported by SSE connector`,
          duration_ms: duration()
        };
      }

      const result = await this.sendRequest(toolName, toolParams);

      return {
        success: true,
        ...result,
        duration_ms: duration()
      };

    } catch (error) {
      logger.error(`[ARCHON MCP SSE] Error executing ${command}:`, error);
      return {
        success: false,
        error: error.message,
        duration_ms: Date.now() - startTime
      };
    }
  }

  async exportContext(taskId) {
    return {
      agent: 'archon_mcp_sse',
      task_id: taskId,
      context: { source: 'archon_mcp_sse' },
      timestamp: new Date().toISOString()
    };
  }

  async importContext(taskId, context) {
    logger.debug(`[ARCHON MCP SSE] Imported context for task ${taskId}`);
    return { success: true };
  }

  async syncContext(contextType, data) {
    logger.debug(`[ARCHON MCP SSE] Syncing ${contextType} context`);
    return { success: true };
  }

  async close() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.connected = false;
    this.pendingRequests.clear();
    logger.debug('[ARCHON MCP SSE] SSE connector closed');
  }
}
