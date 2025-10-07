/**
 * MCP Tools Handlers for Archon
 * Implémente le contrat MCP avec fallbacks gracieux
 */

import { archonClient } from '../rest/archonClient.js';
import { getCapabilities } from '../rest/capabilities.js';
import {
  validateGetInput,
  validateExploreInput,
  validateRagInput,
  validateManageTaskInput,
  ValidationError
} from './validation.js';

/**
 * Get capabilities (cached)
 */
let capabilities = null;
async function getCap() {
  if (!capabilities) {
    capabilities = await getCapabilities();
  }
  return capabilities;
}

/**
 * Code bias prefix for search_code_examples
 */
const CODE_BIAS_PREFIX = "type:code example OR snippet OR function OR class. ";

/**
 * Helper pour réponses d'erreur standardisées
 */
function errorResponse(error, toolName, retry = false) {
  return {
    ok: false,
    error: error.message || String(error),
    tool: toolName,
    retry,
    timestamp: new Date().toISOString()
  };
}

/**
 * Helper pour réponses de succès standardisées
 */
function successResponse(result, toolName) {
  return {
    ok: true,
    tool: toolName,
    result,
    timestamp: new Date().toISOString()
  };
}

/**
 * MCP Tools implementations
 */
export const tools = {

  /**
   * ENSURE_PROJECT tool - Idempotent project creation/retrieval with priority system
   */
  async ensure_project(rawInput) {
    try {
      const { id, name } = rawInput || {};
      
      // PRIORITY SYSTEM: --archon-project-id > ARCHON_PROJECT_ID > state > lookup > create
      const priorityId = process.env.ARCHON_PROJECT_ID || id;
      const priorityName = name;
      
      let selectedId = null;
      let selectionReason = null;
      
      // Priority 1: Environment variable or CLI parameter  
      if (priorityId) {
        try {
          const project = await archonClient.getProject(priorityId);
          selectedId = priorityId;
          selectionReason = process.env.ARCHON_PROJECT_ID ? 'env:ARCHON_PROJECT_ID' : 'param:id';
          
          console.log(`[archon.ensure_project] { chosen:"${selectedId}", reason:"${selectionReason}" }`);
          
          return successResponse({ 
            ok: true, 
            id: project.id,
            project,
            found: 'by_priority_id',
            selection_reason: selectionReason
          }, 'ensure_project');
        } catch (error) {
          console.log(`Priority project ID ${priorityId} not found, continuing to name lookup...`);
        }
      }

      // Priority 2: Lookup by name
      if (priorityName) {
        try {
          const projects = await archonClient.listProjects();
          const found = projects.find(p => p.title === priorityName || p.name === priorityName);
          if (found) {
            selectedId = found.id;
            selectionReason = 'lookup:name';
            
            console.log(`[archon.ensure_project] { chosen:"${selectedId}", reason:"${selectionReason}" }`);
            
            return successResponse({ 
              ok: true, 
              id: found.id,
              project: found,
              found: 'by_name_lookup',
              selection_reason: selectionReason
            }, 'ensure_project');
          }
          
          // Priority 3: Create new project
          const created = await archonClient.createProject({ 
            title: priorityName,
            description: `Auto-created by Orchestra workflow`
          });
          
          selectedId = created.id;
          selectionReason = 'created:new';
          
          console.log(`[archon.ensure_project] { chosen:"${selectedId}", reason:"${selectionReason}" }`);
          
          return successResponse({ 
            ok: true, 
            id: created.id,
            project: created,
            found: 'created',
            selection_reason: selectionReason
          }, 'ensure_project');
          
        } catch (createError) {
          return errorResponse(`Failed to create project: ${createError.message}`, 'ensure_project', true);
        }
      }

      return errorResponse('Missing project identifier (id or name)', 'ensure_project', false);

    } catch (error) {
      return errorResponse(error.message, 'ensure_project', shouldRetry(error));
    }
  },

  /**
   * SELF_TEST tool - Health check for specific project
   */
  async self_test(rawInput) {
    try {
      const { project_id } = rawInput || {};
      
      if (!project_id) {
        return errorResponse('project_id required for self_test', 'self_test', false);
      }

      const project = await archonClient.getProject(project_id);
      
      return successResponse({
        ok: true,
        project: {
          id: project.id,
          name: project.title || project.name,
          created_at: project.created_at
        },
        timestamp: new Date().toISOString()
      }, 'self_test');

    } catch (error) {
      return errorResponse(error.message, 'self_test', shouldRetry(error));
    }
  },
  
  /**
   * GET tool - Récupère une ressource par ID
   */
  async get(rawInput) {
    try {
      const input = validateGetInput(rawInput);
      
      let data;
      switch (input.resource) {
        case 'project':
          data = await archonClient.getProject(input.id);
          break;
        case 'task':
          data = await archonClient.getTask(input.id);
          break;
        case 'artifact':
          // Fallback si pas d'artifacts endpoint
          const cap = await getCap();
          if (cap.artifacts) {
            data = await archonClient.rest('GET', `/artifacts/${input.id}`);
          } else {
            return errorResponse('Artifacts not available', 'get', false);
          }
          break;
        default:
          return errorResponse(`Unsupported resource: ${input.resource}`, 'get', false);
      }

      return successResponse({ 
        resource: input.resource, 
        data 
      }, 'get');

    } catch (error) {
      if (error instanceof ValidationError) {
        return errorResponse(`Validation error: ${error.message}`, 'get', false);
      }
      return errorResponse(error.message, 'get', shouldRetry(error));
    }
  },

  /**
   * EXPLORE_PROJECT tool - Explore projet avec sous-ressources
   */
  async explore_project(rawInput) {
    try {
      const input = validateExploreInput(rawInput);
      const cap = await getCap();

      // Récupérer le projet principal
      const project = await archonClient.getProject(input.project_id);
      
      // Récupérer les sous-ressources demandées
      const promises = [];
      const result = { project };

      if (input.with.includes('tasks') && cap.tasks) {
        promises.push(
          archonClient.listTasks(input.project_id)
            .then(tasks => { result.tasks = tasks; })
            .catch(() => { result.tasks = []; })
        );
      }

      if (input.with.includes('events') && cap.events) {
        promises.push(
          archonClient.listEvents(input.project_id)
            .then(events => { result.events = events; })
            .catch(() => { result.events = []; })
        );
      }

      if (input.with.includes('artifacts') && cap.artifacts) {
        promises.push(
          archonClient.listArtifacts(input.project_id)
            .then(artifacts => { result.artifacts = artifacts; })
            .catch(() => { result.artifacts = []; })
        );
      }

      await Promise.all(promises);

      return successResponse(result, 'explore_project');

    } catch (error) {
      if (error instanceof ValidationError) {
        return errorResponse(`Validation error: ${error.message}`, 'explore_project', false);
      }
      return errorResponse(error.message, 'explore_project', shouldRetry(error));
    }
  },

  /**
   * PERFORM_RAG_QUERY tool - Recherche RAG avec fallbacks
   */
  async perform_rag_query(rawInput) {
    try {
      const input = validateRagInput(rawInput);
      const cap = await getCap();

      // Tentative 1: RAG endpoint natif
      if (cap.ragQuery) {
        try {
          const res = await archonClient.ragQuery(input.project_id, input.query, input.top_k);
          return successResponse({
            answers: res.answers || [],
            sources: res.sources || []
          }, 'perform_rag_query');
        } catch (ragError) {
          console.warn('Native RAG failed, trying fallbacks:', ragError.message);
        }
      }

      // Fallback 1: Search endpoint
      try {
        const searchResults = await archonClient.search(input.project_id, input.query, input.top_k);
        return successResponse({
          answers: searchResults.items?.map(item => ({
            text: item.snippet || item.content || JSON.stringify(item),
            score: item.score || 0.5
          })) || [],
          sources: searchResults.items || []
        }, 'perform_rag_query');
      } catch (searchError) {
        console.warn('Search fallback failed:', searchError.message);
      }

      // Fallback 2: Best-effort from tasks/events
      const promises = [];
      if (cap.tasks) {
        promises.push(archonClient.listTasks(input.project_id).catch(() => []));
      }
      if (cap.events) {
        promises.push(archonClient.listEvents(input.project_id).catch(() => []));
      }

      const results = await Promise.all(promises);
      const pool = results.flat();
      
      // Simple text matching
      const matches = pool.filter(item => {
        const text = JSON.stringify(item).toLowerCase();
        return text.includes(input.query.toLowerCase());
      });

      if (matches.length > 0) {
        return successResponse({
          answers: matches.slice(0, input.top_k).map(item => ({
            text: item.title || item.description || JSON.stringify(item),
            score: 0.3
          })),
          sources: matches.slice(0, input.top_k)
        }, 'perform_rag_query');
      }

      // Aucun résultat
      return {
        ok: false,
        error: "tool_unavailable",
        capability: "ragQuery",
        retry: false,
        suggestion: "skip_orchestra_step",
        tool: 'perform_rag_query'
      };

    } catch (error) {
      if (error instanceof ValidationError) {
        return errorResponse(`Validation error: ${error.message}`, 'perform_rag_query', false);
      }
      return errorResponse(error.message, 'perform_rag_query', shouldRetry(error));
    }
  },

  /**
   * MANAGE_TASK tool - Gestion des tâches
   */
  async manageTask(rawInput) {
    try {
      const input = validateManageTaskInput(rawInput);

      let result;
      switch (input.action) {
        case 'create':
          const createData = {
            project_id: input.project_id,
            title: input.task?.title || 'New Task',
            description: input.task?.desc || input.task?.description || '',
            status: input.task?.status || 'todo',
            priority: input.task?.priority || 'medium',
            assignee: input.task?.assignee || 'User',
            task_order: input.task?.task_order || 0,
            feature: input.task?.feature || null,
            external_id: input.task?.external_id || null // For idempotence
          };
          result = await archonClient.createTask(createData);
          break;

        case 'update':
          if (!input.task?.id) {
            return errorResponse('Task ID required for update action', 'manageTask', false);
          }
          result = await archonClient.updateTask(input.task.id, input.task);
          break;

        case 'close':
          if (!input.task?.id) {
            return errorResponse('Task ID required for close action', 'manageTask', false);
          }
          result = await archonClient.closeTask(input.task.id);
          break;

        default:
          return errorResponse(`Unknown action: ${input.action}`, 'manageTask', false);
      }

      return successResponse({ 
        ok: true, 
        task: result 
      }, 'manageTask');

    } catch (error) {
      if (error instanceof ValidationError) {
        return errorResponse(`Validation error: ${error.message}`, 'manageTask', false);
      }
      return errorResponse(error.message, 'manageTask', shouldRetry(error));
    }
  },

  /**
   * SEARCH_CODE_EXAMPLES tool - Search avec bias code (ChatGPT strategy)
   */
  async search_code_examples(rawInput) {
    try {
      const { project_id, query, top_k = 5 } = rawInput || {};
      
      if (!project_id || !query) {
        return errorResponse('project_id and query required for search_code_examples', 'search_code_examples', false);
      }

      const cap = await getCap();

      // Fallback 1: Si RAG natif disponible → utilise-le avec bias code
      if (cap.ragQuery) {
        try {
          const ragResult = await tools.perform_rag_query({
            project_id,
            query: `${CODE_BIAS_PREFIX}${query}`,
            top_k
          });
          
          if (ragResult.ok) {
            return successResponse({
              items: ragResult.result?.answers || [],
              sources: ragResult.result?.sources || [],
              method: 'rag_with_code_bias'
            }, 'search_code_examples');
          }
        } catch (ragError) {
          console.warn('RAG code search failed, trying fallbacks:', ragError.message);
        }
      }

      // Fallback 2: Search endpoint avec type=code
      try {
        const searchUrl = `/search?project_id=${project_id}&type=code&q=${encodeURIComponent(query)}&k=${top_k}`;
        const searchResults = await archonClient.rest('GET', searchUrl);
        
        return successResponse({
          items: (searchResults.items || []).slice(0, top_k),
          sources: searchResults.items || [],
          method: 'search_endpoint'
        }, 'search_code_examples');
        
      } catch (searchError) {
        console.warn('Search endpoint failed:', searchError.message);
      }

      // Fallback 3: Filter tasks/events pour du code
      const promises = [];
      if (cap.tasks) {
        promises.push(archonClient.listTasks(project_id).catch(() => []));
      }
      if (cap.events) {
        promises.push(archonClient.listEvents(project_id).catch(() => []));
      }

      const results = await Promise.all(promises);
      const pool = results.flat();
      
      // Simple heuristic pour détecter du code
      const isCodey = (item) => {
        const text = JSON.stringify(item).toLowerCase();
        return text.includes('```') || 
               text.includes('function ') || 
               text.includes('class ') || 
               text.includes('import ') ||
               text.includes('const ') ||
               text.includes('def ') ||
               text.includes('async ');
      };

      const matches = pool
        .filter(isCodey)
        .filter(item => {
          const text = JSON.stringify(item).toLowerCase();
          return text.includes(query.toLowerCase());
        });

      if (matches.length > 0) {
        return successResponse({
          items: matches.slice(0, top_k),
          sources: matches.slice(0, top_k),
          method: 'tasks_events_filter'
        }, 'search_code_examples');
      }

      // Aucun résultat trouvé
      return {
        ok: false,
        error: "tool_unavailable",
        capability: "search_code_examples",
        retry: false,
        suggestion: "skip_orchestra_step",
        tool: 'search_code_examples'
      };

    } catch (error) {
      return errorResponse(error.message, 'search_code_examples', shouldRetry(error));
    }
  },

  /**
   * Capabilities tool - Retourne les capacités détectées
   */
  async capabilities() {
    try {
      const cap = await getCap();
      return successResponse({
        version: "archon-mcp-contract/0.1.1",
        capabilities: cap,
        tools: [
          { name: "get", aliases: ["read", "fetch"] },
          { name: "explore_project", aliases: ["explore", "project.explore"] },
          { name: "perform_rag_query", aliases: ["rag_query"] },
          { name: "search_code_examples", aliases: ["search.examples.code", "code.search"] },
          { name: "manageTask", aliases: ["task.create", "task.update", "task.close"] },
          { name: "capabilities" },
          { name: "agents.capabilities" }
        ]
      }, 'capabilities');
    } catch (error) {
      return errorResponse(error.message, 'capabilities', true);
    }
  },

  /**
   * agents.capabilities tool - Retourne les agents disponibles dynamiquement (Hybrid Architecture)
   */
  async 'agents.capabilities'() {
    try {
      // Access orchestrator capabilities if available (new hybrid format)
      const orchestratorCap = global.__orchestrator_capabilities || { 
        agents: { claude: false, gemini: false, archon: true },
        versions: {},
        endpoints: {},
        configured: [],
        detected: {}
      };
      
      // Support both old and new capability format
      const isOldFormat = typeof orchestratorCap.hasClaude !== 'undefined';
      
      return successResponse({
        version: "archon-mcp-contract/0.1.2-hybrid",
        agents: isOldFormat ? {
          claude: orchestratorCap.hasClaude,
          gemini: orchestratorCap.hasGemini, 
          archon: true,
          archon_mcp: true
        } : {
          claude: orchestratorCap.agents.claude,
          gemini: orchestratorCap.agents.gemini,
          archon: orchestratorCap.agents.archon,
          archon_mcp: true
        },
        versions: orchestratorCap.versions || {},
        endpoints: orchestratorCap.endpoints || {},
        configured_agents: orchestratorCap.configured || orchestratorCap.availableAgents || [],
        detected_agents: orchestratorCap.detected || {},
        facade_mode: true,
        hybrid_architecture: !isOldFormat,
        timestamp: new Date().toISOString()
      }, 'agents.capabilities');
    } catch (error) {
      return errorResponse(error.message, 'agents.capabilities', true);
    }
  }
};

/**
 * Retry logic strict (ChatGPT strategy)
 * Ne retry QUE sur pannes réseau/timeouts/5xx
 */
function shouldRetry(error) {
  const message = String(error.message || error);
  
  // 5xx server errors → retry
  if (message.includes('HTTP 5')) return true;
  
  // Network/connection errors → retry
  if (message.includes('network') || 
      message.includes('ECONN') || 
      message.includes('ETIMEDOUT') ||
      message.includes('timeout')) return true;
  
  // 4xx client errors → NO retry
  if (message.includes('HTTP 4')) return false;
  
  // Validation errors → NO retry
  if (message.includes('Validation error') ||
      message.includes('validation_error') ||
      message.includes('Invalid input')) return false;
  
  // Tool unavailable → NO retry  
  if (message.includes('tool_unavailable') ||
      message.includes('unknown_action')) return false;
  
  // Default: NO retry (ChatGPT strict policy)
  return false;
}