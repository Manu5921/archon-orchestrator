/**
 * ExecuteAdapter - Interface compatibility layer
 * Maintient execute(taskId, action, args) et dispatch vers tools MCP
 */

import { tools } from './tools/index.js';
import { log, getCorrelationId, injectCorrelationId } from '../../utils/logging.js';

/**
 * Table des aliases pour compatibilité
 */
const ALIASES = {
  // GET variations
  'get': 'get',
  'read': 'get',
  'fetch': 'get',
  'retrieve': 'get',

  // PROJECT variations (NEW - ChatGPT suggestion)
  'ensure_project': 'ensure_project',
  'project.ensure': 'ensure_project',
  'manage_project': 'ensure_project',
  'manageProject': 'ensure_project',  // OLD workflow calls

  // SELF TEST variations (NEW)
  'self_test': 'self_test',
  'ping': 'self_test',
  'health_check': 'self_test',

  // EXPLORE variations
  'explore': 'explore_project',
  'explore_project': 'explore_project',
  'project.explore': 'explore_project',
  'project_explore': 'explore_project',

  // RAG variations
  'rag_query': 'perform_rag_query',
  'perform_rag_query': 'perform_rag_query',
  'rag': 'perform_rag_query',
  'query': 'perform_rag_query',

  // TASK variations
  'manage_task': 'manageTask',
  'manageTask': 'manageTask',
  'task.create': 'manageTask',
  'task.update': 'manageTask',
  'task.close': 'manageTask',
  'create_task': 'manageTask',
  'update_task': 'manageTask',
  'close_task': 'manageTask',

  // SEARCH CODE variations (NEW - ChatGPT)
  'search_code_examples': 'search_code_examples',
  'search.examples.code': 'search_code_examples',
  'code.search': 'search_code_examples',

  // CAPABILITIES
  'capabilities': 'capabilities',
  'list_tools': 'capabilities',
  'get_capabilities': 'capabilities',

  // AGENTS CAPABILITIES
  'agents.capabilities': 'agents.capabilities',
  'agents_capabilities': 'agents.capabilities',
  'get_agents': 'agents.capabilities'
};

const L = log('archon.execute');

/**
 * Normalise les arguments pour tous les tools (ChatGPT strategy)
 * Centralise les alias pour éviter les erreurs de validation
 */
function normalizeArgs(action, args) {
  const a = { ...(args || {}) };

  // Project ID aliases
  a.project_id = a.project_id || a.projectId || a.projectID || a.pid;

  // Query aliases
  a.query = a.query || a.q || a.search || a.text;

  // top_k aliases (for RAG & similar)
  const k = a.top_k || a.match_count || a.k || a.limit || a.topK || a.n;
  if (typeof k === 'number' && k > 0) {
    a.top_k = k;
  }

  // Pagination lite
  if (a.pageSize && !a.top_k) {
    a.top_k = a.pageSize;
  }

  // Default top_k pour RAG
  if ((action === 'perform_rag_query' || action === 'search_code_examples') && !a.top_k) {
    a.top_k = 5;
  }

  return a;
}

/**
 * ExecuteAdapter principal avec structured logging
 * @param {string} taskId - ID de la tâche
 * @param {string} action - Action demandée
 * @param {any[]} args - Arguments de l'action
 * @returns {Promise<any>}
 */
export async function execute(taskId, action, args) {
  const cid = getCorrelationId(args);

  L('enter', {
    cid,
    taskId,
    action,
    argsKeys: Array.isArray(args) ? args.map(a => Object.keys(a || {})) : Object.keys(args || {})
  });

  // Résoudre l'alias
  const toolName = ALIASES[action] ?? action;
  const toolFunction = tools[toolName];

  if (!toolFunction) {
    L('unknown_action', { cid, action, toolName, availableTools: Object.keys(tools) });
    return {
      ok: false,
      error: 'unknown_action',
      actionRequested: action,
      recognizedAs: toolName,
      availableTools: Object.keys(tools),
      availableAliases: Object.keys(ALIASES),
      retry: false,
      suggestion: 'capability_discovery_or_skip',
      timestamp: new Date().toISOString(),
      cid
    };
  }

  try {
    // Normalisation des args
    let rawInput;

    if (Array.isArray(args) && args.length > 0) {
      rawInput = args[0] || {};
    } else if (args && typeof args === 'object') {
      rawInput = args;
    } else {
      rawInput = {};
    }

    // NOUVELLE APPROCHE: Normalisation centralisée (ChatGPT)
    let input = normalizeArgs(toolName, rawInput);

    // Injection automatique du taskId et cid
    if (taskId && typeof input === 'object' && !input.task_id) {
      input.task_id = taskId;
    }
    if (typeof input === 'object') {
      input.__cid = cid;
    }

    // ADAPTER inputs pour compatibility spécifiques
    if (toolName === 'ensure_project' && input) {
      // Workflow calls: { action: 'get', project_id: 'xxx' } → { id: 'xxx' }
      if (input.project_id && !input.id) {
        input.id = input.project_id;
      }
      // Workflow calls: { title: 'xxx' } → { name: 'xxx' }
      if (input.title && !input.name) {
        input.name = input.title;
      }
    }

    L('tool_call', {
      cid,
      toolName,
      action,
      inputKeys: Object.keys(input),
      normalizedKeys: Object.keys(input).filter(k => !Object.keys(rawInput).includes(k))
    });

    // Appel du tool
    const result = await toolFunction(input);

    L('tool_result', { cid, toolName, ok: result?.ok ?? true, hasError: !!result?.error });

    return result;

  } catch (error) {
    L('tool_error', { cid, toolName, action, error: error.message });

    return {
      ok: false,
      tool: toolName,
      action: action,
      error: error.message || String(error),
      retry: shouldRetryError(error),
      timestamp: new Date().toISOString(),
      cid
    };
  }
}

/**
 * Liste des tools disponibles (pour capability discovery)
 */
export function listTools() {
  return {
    version: 'archon-mcp-contract/0.1.0',
    tools: [
      { name: 'get', aliases: ['read', 'fetch', 'retrieve'] },
      { name: 'explore_project', aliases: ['explore', 'project.explore', 'project_explore'] },
      { name: 'perform_rag_query', aliases: ['rag_query', 'rag', 'query'] },
      { name: 'manageTask', aliases: ['manage_task', 'task.create', 'task.update', 'task.close'] },
      { name: 'capabilities', aliases: ['list_tools', 'get_capabilities'] }
    ],
    aliases: ALIASES
  };
}

/**
 * Retry logic strict (ChatGPT strategy)
 * Cohérent avec shouldRetry() dans tools
 */
function shouldRetryError(error) {
  const message = String(error.message || error);

  // 5xx server errors → retry
  if (message.includes('HTTP 5')) return true;

  // Network/connection errors → retry
  if (message.includes('network') ||
      message.includes('ECONN') ||
      message.includes('ETIMEDOUT') ||
      message.includes('timeout') ||
      message.includes('socket')) return true;

  // 4xx client errors → NO retry
  if (message.includes('HTTP 4')) return false;

  // Validation errors → NO retry
  if (message.includes('Validation error') ||
      message.includes('validation_error') ||
      message.includes('Invalid input')) return false;

  // Tool errors → NO retry
  if (message.includes('tool_unavailable') ||
      message.includes('unknown_action')) return false;

  // Default: NO retry (ChatGPT strict policy)
  return false;
}

/**
 * Health check pour le facade MCP
 */
export async function healthCheck() {
  try {
    // Test basic tool access
    const capResult = await tools.capabilities();

    if (capResult.ok) {
      return {
        healthy: true,
        message: 'Archon MCP facade operational',
        tools: Object.keys(tools).length,
        aliases: Object.keys(ALIASES).length,
        capabilities: capResult.result?.capabilities || {}
      };
    } else {
      return {
        healthy: false,
        message: 'Capabilities check failed',
        error: capResult.error
      };
    }
  } catch (error) {
    return {
      healthy: false,
      message: `Health check failed: ${error.message}`,
      error: error.message
    };
  }
}
