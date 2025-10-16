import { logger } from '../utils/logger.js';
import { execute as executeAdapter, healthCheck as facadeHealthCheck, listTools } from './archon-mcp-connector/executeAdapter.js';
import { getCapabilities } from './archon-mcp-connector/rest/capabilities.js';

/**
 * Archon MCP Connector (SSE Transport)
 * Connects to Archon's MCP server using Server-Sent Events instead of WebSocket
 */
export class ArchonMCPConnector {

  // Identity for ChatGPT debugging strategy
  static __id = 'archon-facade@1.0.1';
  constructor(config = {}) {
    this.config = {
      mcpUrl: config.mcpUrl || 'http://localhost:8051',
      timeout: config.timeout || 10000,
      ...config
    };
    this.connected = false;
    this.sessionId = null;
    this.requestCounter = 0;
    this.pendingRequests = new Map();

    // Instance identity
    this.__id = ArchonMCPConnector.__id;
  }

  async connect() {
    if (this.connected) {
      return true;
    }

    try {
      logger.info(`🔌 Connecting to Archon MCP server: ${this.config.mcpUrl}`);

      // Initialize MCP session first
      const initMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: { listChanged: true }
          },
          clientInfo: {
            name: 'orchestra',
            version: '1.0.0'
          }
        }
      };

      const response = await fetch(`${this.config.mcpUrl}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        body: JSON.stringify(initMessage)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse Server-Sent Events response
      const responseText = await response.text();
      const dataLine = responseText.split('\n').find(line => line.startsWith('data: '));
      if (!dataLine) {
        throw new Error('No data in SSE response');
      }

      const initResult = JSON.parse(dataLine.substring(6));
      logger.info(`MCP Initialized: ${initResult.result.serverInfo.name} v${initResult.result.serverInfo.version}`);

      this.connected = true;
      logger.info('✅ Connected to Archon MCP server via HTTP/SSE');
      return true;
    } catch (error) {
      logger.error('Failed to connect to Archon MCP:', error);
      throw error;
    }
  }

  // Removed handleMessage - using direct HTTP calls instead

  async sendRequest(method, params = {}) {
    if (!this.connected) {
      await this.connect();
    }

    const requestId = ++this.requestCounter;
    const message = {
      jsonrpc: '2.0',
      id: requestId,
      method,
      params
    };

    try {
      const response = await fetch(`${this.config.mcpUrl}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream'
        },
        body: JSON.stringify(message),
        timeout: this.config.timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse Server-Sent Events response
      const responseText = await response.text();
      const dataLine = responseText.split('\n').find(line => line.startsWith('data: '));
      if (!dataLine) {
        throw new Error('No data in SSE response');
      }

      const result = JSON.parse(dataLine.substring(6));

      if (result.error) {
        throw new Error(result.error.message || 'MCP request failed');
      }

      return result.result;
    } catch (error) {
      logger.error(`MCP request failed: ${method}`, error);
      throw error;
    }
  }

  // Archon API fallback methods (REST API direct)
  async manageProject(action, params = {}) {
    try {
      // Use REST API fallback for reliability
      const url = 'http://localhost:3737/api/projects';

      if (action === 'get' && params.id) {
        const response = await fetch(`${url}/${params.id}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const project = await response.json();
        return {
          success: true,
          project
        };
      } else if (action === 'create') {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: params.title || 'New Project',
            description: params.description || '',
            github_repo: params.github_repo || null
          })
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const project = await response.json();
        return {
          success: true,
          project
        };
      } else if (action === 'list') {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const projects = await response.json();
        return {
          success: true,
          projects
        };
      }

      throw new Error(`Unknown action: ${action}`);
    } catch (error) {
      logger.error(`Archon manage_project failed: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async manageTask(action, params = {}) {
    try {
      // Use REST API fallback for reliability
      const url = 'http://localhost:3737/api/tasks';

      if (action === 'create') {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project_id: params.project_id,
            title: params.title || 'New Task',
            description: params.description || '',
            status: params.status || 'todo',
            priority: params.priority || 'medium',
            assignee: params.assignee || 'User'
          })
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const task = await response.json();
        return {
          success: true,
          task
        };
      } else if (action === 'list') {
        const projectUrl = params.project_id ?
          `http://localhost:3737/api/projects/${params.project_id}/tasks` :
          url;
        const response = await fetch(projectUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const tasks = await response.json();
        return {
          success: true,
          tasks
        };
      }

      throw new Error(`Unknown task action: ${action}`);
    } catch (error) {
      logger.error(`Archon manage_task failed: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async performRAGQuery(query, matchCount = 5) {
    try {
      const result = await this.sendRequest('tools/call', {
        name: 'archon:perform_rag_query',
        arguments: { query, match_count: matchCount }
      });

      return {
        success: true,
        query,
        results: result.results || [],
        match_count: result.results?.length || 0
      };
    } catch (error) {
      logger.error(`Archon RAG query failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        query,
        results: []
      };
    }
  }

  async searchCodeExamples(query, matchCount = 3) {
    try {
      const result = await this.sendRequest('tools/call', {
        name: 'archon:search_code_examples',
        arguments: { query, match_count: matchCount }
      });

      return {
        success: true,
        query,
        examples: result.examples || [],
        match_count: result.examples?.length || 0
      };
    } catch (error) {
      logger.error(`Archon code search failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        query,
        examples: []
      };
    }
  }

  async getAvailableSources() {
    try {
      const result = await this.sendRequest('tools/call', {
        name: 'archon:get_available_sources',
        arguments: {}
      });

      return {
        success: true,
        sources: result.sources || []
      };
    } catch (error) {
      logger.error(`Archon get_available_sources failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        sources: []
      };
    }
  }

  // Universal execute method for compatibility (now uses facade)
  async execute(taskId, action, args = []) {
    logger.debug(`🎯 Archon MCP execute: ${action}`, { taskId, args });

    try {
      // Use new facade for better compatibility and error handling
      const result = await executeAdapter(taskId, action, args);

      // Convert facade response to legacy format for backward compatibility
      if (result.ok) {
        return {
          success: true,
          tool: result.tool,
          ...result.result
        };
      } else {
        return {
          success: false,
          error: result.error,
          action,
          retry: result.retry || false
        };
      }

    } catch (error) {
      logger.error(`Execute failed for action ${action}:`, error);
      return {
        success: false,
        error: error.message,
        action
      };
    }
  }

  // Additional helper methods for capability discovery
  async listTools() {
    return listTools();
  }

  async getCapabilities() {
    return await getCapabilities();
  }

  async healthCheck() {
    try {
      // Test facade health first (more reliable)
      const facadeHealth = await facadeHealthCheck();
      if (facadeHealth.healthy) {
        return facadeHealth;
      }

      // Fallback to connection test
      if (!this.connected) {
        await this.connect();
      }
      return {
        healthy: true,
        message: 'Archon MCP connector operational (transport only)',
        facade: facadeHealth
      };
    } catch (error) {
      return {
        healthy: false,
        message: `Archon MCP connection failed: ${error.message}`
      };
    }
  }

  disconnect() {
    this.connected = false;
    this.pendingRequests.clear();
    logger.info('Disconnected from Archon MCP server');
  }
}
