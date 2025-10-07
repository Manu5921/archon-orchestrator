import { logger } from '../utils/logger.js';

/**
 * Archon HTTP Connector
 * Utilise l'API REST d'Archon directement (plus simple que MCP WebSocket)
 */
export class ArchonHTTPConnector {
  constructor(config = {}) {
    this.config = {
      apiUrl: config.apiUrl || 'http://localhost:8181',
      timeout: config.timeout || 10000,
      ...config
    };
    this.healthy = false;
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.config.apiUrl}/`);
      if (response.ok) {
        const data = await response.json();
        this.healthy = true;
        return {
          healthy: true,
          version: data.version || '1.0.0',
          message: `Archon HTTP API available at ${this.config.apiUrl}`
        };
      } else {
        this.healthy = false;
        return {
          healthy: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      this.healthy = false;
      return {
        healthy: false,
        error: error.message
      };
    }
  }

  async execute(taskId, command, args = []) {
    const startTime = Date.now();
    
    try {
      logger.debug(`[ARCHON HTTP] Executing ${command} for task ${taskId}`, args);
      
      let response;
      const duration = () => Date.now() - startTime;
      
      switch (command) {
        case 'manage_project':
          response = await this.handleProjectManagement(args[0]);
          break;
          
        case 'manage_task':
          response = await this.handleTaskManagement(args[0]);
          break;
          
        case 'perform_rag_query':
          response = await this.handleRAGQuery(args[0]);
          break;
          
        case 'search_code_examples':
          response = await this.handleCodeSearch(args[0]);
          break;
          
        default:
          return {
            success: false,
            error: `Command ${command} not supported by HTTP connector`,
            duration_ms: duration()
          };
      }
      
      return {
        success: true,
        ...response,
        duration_ms: duration()
      };
      
    } catch (error) {
      logger.error(`[ARCHON HTTP] Error executing ${command}:`, error);
      return {
        success: false,
        error: error.message,
        duration_ms: Date.now() - startTime
      };
    }
  }
  
  async handleProjectManagement(params) {
    const { action, ...data } = params;
    
    switch (action) {
      case 'create':
        return await this.createProject(data);
      case 'list':
        return await this.listProjects();
      case 'get':
        return await this.getProject(data.project_id);
      default:
        throw new Error(`Project action ${action} not supported`);
    }
  }
  
  async handleTaskManagement(params) {
    const { action, ...data } = params;
    
    switch (action) {
      case 'create':
        return await this.createTask(data);
      case 'list':
        return await this.listTasks(data);
      case 'update':
        return await this.updateTask(data.task_id, data.update_fields);
      case 'get':
        return await this.getTask(data.task_id);
      default:
        throw new Error(`Task action ${action} not supported`);
    }
  }
  
  async createProject(projectData) {
    const response = await fetch(`${this.config.apiUrl}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: projectData.title,
        description: projectData.description || '',
        github_repo: projectData.github_repo || null
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create project: ${response.status}`);
    }
    
    const result = await response.json();
    logger.info(`📋 Created Archon project: ${result.data?.id} - ${projectData.title}`);
    
    return {
      project_id: result.data?.id,
      title: projectData.title,
      message: `Project created: ${projectData.title}`
    };
  }
  
  async listProjects() {
    const response = await fetch(`${this.config.apiUrl}/api/projects`);
    
    if (!response.ok) {
      throw new Error(`Failed to list projects: ${response.status}`);
    }
    
    const result = await response.json();
    return {
      projects: result.data || [],
      total: result.data?.length || 0
    };
  }
  
  async getProject(projectId) {
    const response = await fetch(`${this.config.apiUrl}/api/projects/${projectId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get project: ${response.status}`);
    }
    
    const result = await response.json();
    return {
      project_id: projectId,
      project: result.data
    };
  }
  
  async createTask(taskData) {
    const response = await fetch(`${this.config.apiUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: taskData.project_id,
        title: taskData.title,
        feature: taskData.feature || 'General',
        description: taskData.description || '',
        task_order: taskData.task_order || 0,
        status: 'todo'
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create task: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    logger.info(`📋 Created Archon task: ${result.data?.id} - ${taskData.title}`);
    
    return {
      task_id: result.data?.id,
      title: taskData.title,
      project_id: taskData.project_id,
      message: `Task created: ${taskData.title}`
    };
  }
  
  async listTasks(params) {
    let url = `${this.config.apiUrl}/api/tasks`;
    
    if (params.filter_by && params.filter_value) {
      url += `?${params.filter_by}=${params.filter_value}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to list tasks: ${response.status}`);
    }
    
    const result = await response.json();
    return {
      tasks: result.data || [],
      total: result.data?.length || 0
    };
  }
  
  async updateTask(taskId, updateFields) {
    const response = await fetch(`${this.config.apiUrl}/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateFields)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update task: ${response.status}`);
    }
    
    const result = await response.json();
    return {
      task_id: taskId,
      updated_fields: updateFields,
      message: `Task ${taskId} updated`
    };
  }
  
  async getTask(taskId) {
    const response = await fetch(`${this.config.apiUrl}/api/tasks/${taskId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get task: ${response.status}`);
    }
    
    const result = await response.json();
    return {
      task_id: taskId,
      task: result.data
    };
  }
  
  async handleRAGQuery(params) {
    // Pour l'instant, simuler une réponse RAG
    logger.debug(`[RAG] Query: ${params.query}`);
    
    return {
      query: params.query,
      results: [],
      message: `RAG query processed: ${params.query} (HTTP connector - no results yet)`
    };
  }
  
  async handleCodeSearch(params) {
    // Pour l'instant, simuler une recherche de code
    logger.debug(`[CODE SEARCH] Query: ${params.query}`);
    
    return {
      query: params.query,
      examples: [],
      message: `Code search processed: ${params.query} (HTTP connector - no examples yet)`
    };
  }
  
  async exportContext(taskId) {
    return {
      agent: 'archon_http',
      task_id: taskId,
      context: { source: 'archon_http_api' },
      timestamp: new Date().toISOString()
    };
  }
  
  async importContext(taskId, context) {
    logger.debug(`[ARCHON HTTP] Imported context for task ${taskId}`);
    return { success: true };
  }
  
  async syncContext(contextType, data) {
    logger.debug(`[ARCHON HTTP] Syncing ${contextType} context`);
    return { success: true };
  }
  
  async close() {
    logger.debug('[ARCHON HTTP] Connector closed');
  }
}