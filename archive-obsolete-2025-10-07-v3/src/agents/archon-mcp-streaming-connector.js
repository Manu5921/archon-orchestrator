import { logger } from '../utils/logger.js';
import fetch from 'node-fetch';
import { EventSource } from 'eventsource';

/**
 * Archon MCP Connector (Streaming HTTP/SSE)
 * Protocol hybride : POST JSON-RPC → Server-Sent Events
 * Découvert via analyse : /mcp endpoint avec Accept: application/json, text/event-stream
 */
export class ArchonMCPConnector {
  constructor(config = {}) {
    this.config = {
      mcpUrl: config.mcpUrl || 'http://localhost:8051/mcp',
      timeout: config.timeout || 30000,
      ...config
    };
    this.connected = false;
    this.sessionInitialized = false;
    this.serverInfo = null;
    this.capabilities = null;
    this.eventSource = null;
    this.pendingRequests = new Map();
    this.requestCounter = 0;
    this.sessionId = null;
  }

  async healthCheck() {
    try {
      // Simple test d'initialisation pour vérifier disponibilité
      const response = await fetch(this.config.mcpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'health-check',
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: {
              name: 'archon-orchestrator-health',
              version: '1.0.0'
            }
          }
        })
      });

      if (response.ok) {
        // Consommer la réponse pour éviter memory leak
        const text = await response.text();
        return {
          healthy: true,
          version: '1.12.2',
          message: `Archon MCP available at ${this.config.mcpUrl}`
        };
      } else {
        return {
          healthy: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }

  async connect() {
    if (this.connected && this.sessionInitialized) {
      return true;
    }

    try {
      logger.info(`🔌 Connecting to Archon MCP server: ${this.config.mcpUrl}`);

      // Initialiser la session MCP
      const initResponse = await fetch(this.config.mcpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'init',
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: {
              name: 'archon-orchestrator',
              version: '1.0.0'
            }
          }
        })
      });

      if (!initResponse.ok) {
        throw new Error(`Failed to initialize MCP session: ${initResponse.status} ${initResponse.statusText}`);
      }

      // Extract session ID from headers
      this.sessionId = initResponse.headers.get('mcp-session-id');
      logger.debug(`[ARCHON MCP] Session ID: ${this.sessionId}`);

      // Parser la réponse SSE
      const responseText = await initResponse.text();
      const lines = responseText.split('\n');
      let jsonData = null;

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          jsonData = JSON.parse(line.substring(6));
          break;
        }
      }

      if (!jsonData || !jsonData.result) {
        throw new Error('Invalid initialization response');
      }

      // Stocker les infos de session
      this.serverInfo = jsonData.result.serverInfo;
      this.capabilities = jsonData.result.capabilities;
      this.sessionInitialized = true;
      this.connected = true;

      logger.info(`✅ Connected to ${this.serverInfo.name} v${this.serverInfo.version}`);
      logger.debug(`Capabilities: ${JSON.stringify(this.capabilities)}`);

      return true;

    } catch (error) {
      logger.error('Failed to connect to Archon MCP:', error);
      throw error;
    }
  }

  async sendRequest(method, params = {}) {
    if (!this.connected) {
      await this.connect();
    }

    const requestId = `req-${++this.requestCounter}`;
    const request = {
      jsonrpc: '2.0',
      id: requestId,
      method,
      params
    };

    try {
      logger.debug(`[MCP] Sending request: ${method}`, params);

      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      };

      // Add session ID header if we have one
      if (this.sessionId) {
        headers['mcp-session-id'] = this.sessionId;
      }

      const response = await fetch(this.config.mcpUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parser la réponse SSE
      const responseText = await response.text();
      const lines = responseText.split('\n');
      let jsonData = null;

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          jsonData = JSON.parse(line.substring(6));
          break;
        }
      }

      if (!jsonData) {
        throw new Error('Invalid response format');
      }

      if (jsonData.error) {
        throw new Error(jsonData.error.message || 'MCP request failed');
      }

      return jsonData.result;

    } catch (error) {
      logger.error(`MCP request failed (${method}):`, error);
      throw error;
    }
  }

  async execute(taskId, command, args = []) {
    const startTime = Date.now();

    try {
      logger.debug(`[ARCHON MCP] Executing ${command} for task ${taskId}`, args);

      let toolName;
      let toolParams;
      const duration = () => Date.now() - startTime;

      switch (command) {
      case 'manage_project':
        const projectAction = args[0]?.action || 'list';

        // Utiliser les fonctions individuelles
        switch (projectAction) {
        case 'create':
          toolName = 'create_project';
          toolParams = {
            title: args[0].title,
            description: args[0].description || '',
            github_repo: args[0].github_repo || null
          };
          break;
        case 'list':
          toolName = 'list_projects';
          toolParams = {};
          break;
        case 'get':
          toolName = 'get_project';
          toolParams = { project_id: args[0].project_id };
          break;
        case 'update':
          toolName = 'update_project';
          toolParams = {
            project_id: args[0].project_id,
            ...args[0].update_fields
          };
          break;
        default:
          return {
            success: false,
            error: `Unsupported project action: ${projectAction}`,
            duration_ms: duration()
          };
        }
        break;

      case 'manage_task':
        const taskAction = args[0]?.action || 'list';

        switch (taskAction) {
        case 'create':
          toolName = 'create_task';
          toolParams = {
            project_id: args[0].project_id,
            title: args[0].title,
            description: args[0].description || '',
            feature: args[0].feature || 'General',
            task_order: args[0].task_order || 0,
            assignee: args[0].assignee || 'User'
          };
          break;
        case 'list':
          toolName = 'list_tasks';
          toolParams = {
            filter_by: args[0].filter_by || null,
            filter_value: args[0].filter_value || null,
            project_id: args[0].project_id || null
          };
          break;
        case 'get':
          toolName = 'get_task';
          toolParams = { task_id: args[0].task_id };
          break;
        case 'update':
          toolName = 'update_task';
          toolParams = {
            task_id: args[0].task_id,
            ...args[0].update_fields
          };
          break;
        default:
          return {
            success: false,
            error: `Unsupported task action: ${taskAction}`,
            duration_ms: duration()
          };
        }
        break;

      case 'perform_rag_query':
        toolName = 'perform_rag_query';
        toolParams = {
          query: args[0]?.query || args[0],
          match_count: args[0]?.match_count || 5
        };
        break;

      case 'search_code_examples':
        toolName = 'search_code_examples';
        toolParams = {
          query: args[0]?.query || args[0],
          match_count: args[0]?.match_count || 3
        };
        break;

      default:
        logger.error(`[ARCHON MCP] Unsupported command: ${JSON.stringify(command)} with args: ${JSON.stringify(args)}`);
        return {
          success: false,
          error: `Command '${command}' not supported`,
          duration_ms: duration()
        };
      }

      const result = await this.sendRequest('tools/call', {
        name: toolName,
        arguments: toolParams
      });

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
      agent: 'archon_mcp_streaming',
      task_id: taskId,
      context: {
        source: 'archon_mcp_streaming',
        server: this.serverInfo,
        capabilities: this.capabilities
      },
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
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.connected = false;
    this.sessionInitialized = false;
    this.sessionId = null;
    this.pendingRequests.clear();
    logger.debug('[ARCHON MCP] Streaming connector closed');
  }
}
