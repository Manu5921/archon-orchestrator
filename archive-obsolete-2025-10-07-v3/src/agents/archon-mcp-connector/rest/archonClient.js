/**
 * Thin REST client for Archon API
 * Base URL: http://localhost:3737/api
 */

const BASE_URL = 'http://localhost:3737/api';

/**
 * Generic REST wrapper avec error handling
 * @template T
 * @param {string} method
 * @param {string} path
 * @param {any} [body]
 * @returns {Promise<T>}
 */
export async function rest(method, path, body) {
  const url = BASE_URL + path;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status} ${response.statusText} → ${text}`);
    }

    // Handle empty responses (204, etc.)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    console.error(`REST ${method} ${path} failed:`, error.message);
    throw error;
  }
}

/**
 * Fonctions REST ciblées pour Archon
 */
export class ArchonRestClient {

  // ===== PROJECTS =====
  async getProject(id) {
    return await rest('GET', `/projects/${id}`);
  }

  async listProjects() {
    return await rest('GET', '/projects');
  }

  async createProject(data) {
    return await rest('POST', '/projects', data);
  }

  async updateProject(id, data) {
    return await rest('PATCH', `/projects/${id}`, data);
  }

  // ===== TASKS =====
  async getTask(id) {
    return await rest('GET', `/tasks/${id}`);
  }

  async listTasks(projectId = null) {
    const path = projectId ? `/projects/${projectId}/tasks` : '/tasks';
    return await rest('GET', path);
  }

  async createTask(data) {
    // Implement idempotent task creation with external_id
    if (data.external_id) {
      try {
        // Try to find existing task by external_id first
        const existingTasks = await rest('GET', `/projects/${data.project_id}/tasks`);
        const existing = existingTasks.find(task =>
          task.external_id === data.external_id ||
          task.title === data.title // Fallback match
        );

        if (existing) {
          console.log(`Task with external_id ${data.external_id} already exists, returning existing`);
          return existing;
        }
      } catch (error) {
        console.log(`Error checking existing tasks: ${error.message}, proceeding with creation`);
      }
    }

    return await rest('POST', '/tasks', data);
  }

  async updateTask(id, data) {
    return await rest('PATCH', `/tasks/${id}`, data);
  }

  async closeTask(id) {
    return await rest('POST', `/tasks/${id}/close`, {});
  }

  // ===== EVENTS (si disponible) =====
  async listEvents(projectId) {
    return await rest('GET', `/events?project_id=${projectId}`);
  }

  // ===== ARTIFACTS (si disponible) =====
  async listArtifacts(projectId) {
    return await rest('GET', `/artifacts?project_id=${projectId}`);
  }

  // ===== RAG QUERY (si disponible) =====
  async ragQuery(projectId, query, topK = 5) {
    return await rest('POST', '/rag/query', {
      project_id: projectId,
      query: query,  // CORRECTION: API attend "query", pas "q"
      top_k: topK
    });
  }

  // ===== SEARCH FALLBACK =====
  async search(projectId, query, k = 5) {
    return await rest('GET', `/search?project_id=${projectId}&q=${encodeURIComponent(query)}&k=${k}`);
  }
}

/**
 * Instance singleton du client
 */
export const archonClient = new ArchonRestClient();
