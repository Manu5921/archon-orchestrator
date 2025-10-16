/**
 * 🎭 Archon MCP Façade - Type Contracts
 * Version: archon-mcp-contract/0.1.1
 *
 * Generated types for contract consistency between workflow and façade
 */

// === CORE TYPES ===

export const ArchonProject = {
  id: String,
  title: String,
  description: String,
  github_repo: String,
  created_at: String,
  updated_at: String
};

export const ArchonTask = {
  id: String,
  project_id: String,
  title: String,
  description: String,
  status: String, // 'todo' | 'in_progress' | 'completed'
  assignee: String,
  task_order: Number,
  feature: String,
  external_id: String, // For idempotence
  created_at: String,
  updated_at: String
};

// === TOOL CONTRACTS ===

export const EnsureProjectInput = {
  id: String,           // Optional: existing project ID
  name: String,         // Optional: project name for lookup/creation
  title: String         // Optional: alias for name
};

export const ExploreProjectInput = {
  project_id: String,   // Required: Archon project ID
  with: Array           // Optional: ['tasks', 'events', 'artifacts']
};

export const RagQueryInput = {
  project_id: String,   // Required: Archon project ID
  query: String,        // Required: search query
  top_k: Number         // Optional: max results (default 5)
};

export const ManageTaskInput = {
  action: String,       // Required: 'create' | 'update' | 'close'
  project_id: String,   // Required: Archon project ID
  task: {               // Task data (required for create/update)
    id: String,         // Required for update/close
    title: String,
    description: String,
    status: String,
    priority: String,
    assignee: String,
    task_order: Number,
    feature: String,
    external_id: String // For idempotence
  }
};

export const SearchCodeInput = {
  project_id: String,   // Required: Archon project ID
  query: String,        // Required: search query with code bias
  top_k: Number         // Optional: max results (default 5)
};

// === RESPONSE TYPES ===

export const SuccessResponse = {
  ok: Boolean,          // Always true
  tool: String,         // Tool name that generated response
  result: Object,       // Tool-specific result data
  timestamp: String     // ISO timestamp
};

export const ErrorResponse = {
  ok: Boolean,          // Always false
  error: String,        // Error message
  tool: String,         // Tool name that failed
  retry: Boolean,       // Whether operation should be retried
  timestamp: String     // ISO timestamp
};

export const CapabilitiesResponse = {
  version: String,      // Contract version
  capabilities: {
    ragQuery: Boolean,
    artifacts: Boolean,
    tasks: Boolean,
    events: Boolean
  },
  tools: Array,         // Available tools with aliases
  agents: {             // Available agents (v0.1.1+)
    claude: Boolean,
    gemini: Boolean,
    archon: Boolean,
    archon_mcp: Boolean
  }
};

// === VALIDATION SCHEMAS ===

export const TOOL_ALIASES = {
  // Project management
  'ensure_project': ['manage_project', 'project.ensure'],
  'explore_project': ['explore', 'project.explore'],

  // Data access
  'get': ['read', 'fetch', 'retrieve'],
  'perform_rag_query': ['rag_query', 'rag', 'query'],
  'search_code_examples': ['search.examples.code', 'code.search'],

  // Task management
  'manageTask': ['manage_task', 'task.create', 'task.update', 'task.close'],

  // Meta
  'capabilities': ['list_tools', 'get_capabilities'],
  'agents.capabilities': ['agents_capabilities', 'get_agents']
};

export const ARGUMENT_ALIASES = {
  // Project identifiers
  project_id: ['projectId', 'projectID', 'pid'],

  // Query parameters
  query: ['q', 'search', 'text'],
  top_k: ['match_count', 'k', 'limit', 'topK', 'n'],

  // Task data
  description: ['desc'],
  task_order: ['order', 'priority_order']
};

// === ERROR TYPES ===

export const ERROR_TYPES = {
  VALIDATION_ERROR: 'validation_error',
  TOOL_UNAVAILABLE: 'tool_unavailable',
  UNKNOWN_ACTION: 'unknown_action',
  NETWORK_ERROR: 'network_error',
  API_ERROR: 'api_error',
  TIMEOUT_ERROR: 'timeout_error'
};

export const RETRY_ERRORS = [
  'HTTP 5',           // 5xx server errors
  'network',          // Network failures
  'ECONN',            // Connection errors
  'ETIMEDOUT',        // Timeout errors
  'timeout',          // Generic timeout
  'socket'            // Socket errors
];
