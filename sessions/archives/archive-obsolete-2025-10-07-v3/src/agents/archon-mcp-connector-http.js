import { logger } from '../utils/logger.js';

/**
 * Archon MCP Connector (HTTP Transport)
 * Uses HTTP/REST calls to Archon's MCP server instead of WebSocket
 * Discovered that Archon MCP uses TRANSPORT=sse, not WebSocket
 */
export class ArchonMCPConnector {
  constructor(config = {}) {
    this.config = {
      mcpUrl: config.mcpUrl || 'http://localhost:8051',
      timeout: config.timeout || 10000,
      ...config
    };
    this.connected = false;
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.config.mcpUrl}/health`);
      if (response.ok) {
        const data = await response.json();
        this.connected = true;
        return {
          healthy: true,
          version: data.version || '1.0.0',
          message: `Archon MCP available at ${this.config.mcpUrl}`
        };
      } else {
        this.connected = false;
        return {
          healthy: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      this.connected = false;
      return {
        healthy: false,
        error: error.message
      };
    }
  }

  async connect() {
    const health = await this.healthCheck();
    if (health.healthy) {
      logger.info(`✅ Connected to Archon MCP server via HTTP: ${this.config.mcpUrl}`);
      return true;
    } else {
      throw new Error(`Failed to connect to MCP server: ${health.error}`);
    }
  }

  async execute(taskId, command, args = []) {
    const startTime = Date.now();

    try {
      if (!this.connected) {
        await this.connect();
      }

      logger.debug(`[ARCHON MCP] Executing ${command} for task ${taskId}`, args);

      let response;
      const duration = () => Date.now() - startTime;

      // Map commands to MCP tool names
      let toolName;
      let toolParams;

      switch (command) {
      case 'manage_project':
        toolName = 'archon:manage_project';
        toolParams = args[0] || {};
        break;

      case 'manage_task':
        toolName = 'archon:manage_task';
        toolParams = args[0] || {};
        break;

      case 'perform_rag_query':
        toolName = 'archon:perform_rag_query';
        toolParams = {
          query: args[0]?.query || args[0],
          match_count: args[0]?.match_count || 5
        };
        break;

      case 'search_code_examples':
        toolName = 'archon:search_code_examples';
        toolParams = {
          query: args[0]?.query || args[0],
          match_count: args[0]?.match_count || 3
        };
        break;

      default:
        return {
          success: false,
          error: `Command ${command} not supported by MCP connector`,
          duration_ms: duration()
        };
      }

      // Call MCP tool via HTTP
      const httpResponse = await fetch(`${this.config.mcpUrl}/tools/${toolName.replace(':', '/')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(toolParams),
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!httpResponse.ok) {
        throw new Error(`HTTP ${httpResponse.status}: ${httpResponse.statusText}`);
      }

      const result = await httpResponse.json();

      return {
        success: true,
        ...result,
        duration_ms: duration()
      };

    } catch (error) {
      logger.error(`[ARCHON MCP] Error executing ${command}:`, error);
      return {
        success: false,
        error: error.message,
        duration_ms: Date.now() - startTime
      };
    }
  }

  async exportContext(taskId) {
    return {
      agent: 'archon_mcp_http',
      task_id: taskId,
      context: { source: 'archon_mcp_http' },
      timestamp: new Date().toISOString()
    };
  }

  async importContext(taskId, context) {
    logger.debug(`[ARCHON MCP] Imported context for task ${taskId}`);
    return { success: true };
  }

  async syncContext(contextType, data) {
    logger.debug(`[ARCHON MCP] Syncing ${contextType} context`);
    return { success: true };
  }

  async close() {
    this.connected = false;
    logger.debug('[ARCHON MCP] HTTP connector closed');
  }
}
