import axios from 'axios';
import { EventEmitter } from 'events';
import { logger } from '../utils/logger.js';

export class ArchonConnector extends EventEmitter {
  constructor() {
    super();
    this.baseUrl = process.env.ARCHON_URL || 'http://localhost:8000';
    this.healthy = false;
    this.contexts = new Map();
  }
  
  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseUrl}/health`, {
        timeout: 5000
      });
      
      if (response.status === 200) {
        this.healthy = true;
        return {
          healthy: true,
          version: response.data.version || 'unknown',
          message: 'Archon server available'
        };
      }
      
      return {
        healthy: false,
        error: 'Archon server not responding correctly'
      };
    } catch (error) {
      return {
        healthy: false,
        error: `Archon connection error: ${error.message}`
      };
    }
  }
  
  async execute(taskId, endpoint, data = {}) {
    const startTime = Date.now();
    
    try {
      logger.debug(`Archon executing task ${taskId} at ${endpoint}`);
      
      const response = await axios.post(
        `${this.baseUrl}${endpoint}`,
        {
          task_id: taskId,
          ...data
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Task-ID': taskId
          }
        }
      );
      
      const duration = Date.now() - startTime;
      
      this.emit('output', {
        taskId,
        data: JSON.stringify(response.data),
        stream: 'response'
      });
      
      return {
        success: true,
        output: response.data,
        duration_ms: duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error(`Archon task ${taskId} failed:`, error.message);
      
      return {
        success: false,
        error: error.message,
        duration_ms: duration
      };
    }
  }
  
  async exportContext(taskId) {
    // Get context for a specific task
    const context = this.contexts.get(taskId) || {};
    
    return {
      agent: 'archon',
      task_id: taskId,
      architecture_analysis: context.architecture || {},
      patterns_identified: context.patterns || [],
      knowledge_base_refs: context.kb_refs || [],
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
    
    logger.debug(`Archon imported context for task ${taskId}`);
    
    return { success: true };
  }
  
  async syncContext(contextType, data) {
    // Sync specific context type
    logger.debug(`Archon syncing ${contextType} context`);
    
    // Store in internal cache and potentially in Archon's knowledge base
    this.contexts.set(`sync_${contextType}`, data);
    
    // Sync to Archon's knowledge base
    await this.execute(
      'sync_context',
      '/api/knowledge/sync',
      {
        context_type: contextType,
        data
      }
    );
    
    return { success: true };
  }
  
  async analyzeArchitecture(taskId, projectPath) {
    // Archon's special ability: architecture analysis
    const result = await this.execute(
      taskId,
      '/api/analyze/architecture',
      {
        project_path: projectPath,
        deep_analysis: true
      }
    );
    
    if (result.success) {
      const context = this.contexts.get(taskId) || {};
      context.architecture = result.output;
      this.contexts.set(taskId, context);
    }
    
    return result;
  }
  
  async searchKnowledgeBase(taskId, query, filters = {}) {
    // Search Archon's knowledge base
    const result = await this.execute(
      taskId,
      '/api/knowledge/search',
      {
        query,
        filters,
        limit: 10
      }
    );
    
    if (result.success) {
      const context = this.contexts.get(taskId) || {};
      context.kb_refs = result.output.results || [];
      this.contexts.set(taskId, context);
    }
    
    return result;
  }
  
  async synthesize(taskId, sources) {
    // Archon's synthesis capability
    const result = await this.execute(
      taskId,
      '/api/synthesize',
      {
        sources,
        output_format: 'comprehensive'
      }
    );
    
    if (result.success) {
      const context = this.contexts.get(taskId) || {};
      context.synthesis = result.output;
      context.synthesis_timestamp = new Date().toISOString();
      this.contexts.set(taskId, context);
    }
    
    return result;
  }
  
  async identifyPatterns(taskId, codebase) {
    // Pattern identification in codebase
    const result = await this.execute(
      taskId,
      '/api/analyze/patterns',
      {
        codebase_path: codebase,
        pattern_types: ['architectural', 'design', 'anti-patterns']
      }
    );
    
    if (result.success) {
      const context = this.contexts.get(taskId) || {};
      context.patterns = result.output.patterns || [];
      this.contexts.set(taskId, context);
    }
    
    return result;
  }
  
  async close() {
    this.contexts.clear();
    logger.debug('Archon connector closed');
  }
}