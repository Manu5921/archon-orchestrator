/**
 * Simple validation schemas (alternative à Zod pour éviter dépendance)
 */

export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Validate get input
 */
export function validateGetInput(input) {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Input must be an object', 'input');
  }

  if (!input.resource || !['project', 'task', 'artifact'].includes(input.resource)) {
    throw new ValidationError('resource must be one of: project, task, artifact', 'resource');
  }

  if (!input.id || typeof input.id !== 'string' || input.id.trim().length === 0) {
    throw new ValidationError('id must be a non-empty string', 'id');
  }

  return {
    resource: input.resource,
    id: input.id.trim()
  };
}

/**
 * Validate explore_project input
 */
export function validateExploreInput(input) {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Input must be an object', 'input');
  }

  if (!input.project_id || typeof input.project_id !== 'string' || input.project_id.trim().length === 0) {
    throw new ValidationError('project_id must be a non-empty string', 'project_id');
  }

  const defaultWith = ['tasks', 'events'];
  const validWith = ['tasks', 'events', 'artifacts'];

  let withArray = input.with || defaultWith;
  if (!Array.isArray(withArray)) {
    withArray = [withArray];
  }

  // Filter valid values
  withArray = withArray.filter(item => validWith.includes(item));

  return {
    project_id: input.project_id.trim(),
    with: withArray
  };
}

/**
 * Validate RAG query input
 */
export function validateRagInput(input) {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Input must be an object', 'input');
  }

  if (!input.project_id || typeof input.project_id !== 'string' || input.project_id.trim().length === 0) {
    throw new ValidationError('project_id must be a non-empty string', 'project_id');
  }

  if (!input.query || typeof input.query !== 'string' || input.query.trim().length === 0) {
    throw new ValidationError('query must be a non-empty string', 'query');
  }

  const topK = input.top_k || input.topK || 5;
  if (typeof topK !== 'number' || topK < 1 || topK > 50) {
    throw new ValidationError('top_k must be a number between 1 and 50', 'top_k');
  }

  return {
    project_id: input.project_id.trim(),
    query: input.query.trim(),
    top_k: topK
  };
}

/**
 * Validate manageTask input
 */
export function validateManageTaskInput(input) {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('Input must be an object', 'input');
  }

  if (!input.action || !['create', 'update', 'close'].includes(input.action)) {
    throw new ValidationError('action must be one of: create, update, close', 'action');
  }

  if (!input.project_id || typeof input.project_id !== 'string' || input.project_id.trim().length === 0) {
    throw new ValidationError('project_id must be a non-empty string', 'project_id');
  }

  const result = {
    action: input.action,
    project_id: input.project_id.trim()
  };

  // Task object validation pour update/create
  if (input.task && typeof input.task === 'object') {
    const task = {};

    if (input.task.id) {
      task.id = input.task.id;
    }

    if (input.task.title) {
      task.title = input.task.title;
    }

    if (input.task.desc || input.task.description) {
      task.desc = input.task.desc || input.task.description;
    }

    if (input.task.status) {
      task.status = input.task.status;
    }

    if (input.task.priority) {
      task.priority = input.task.priority;
    }

    if (input.task.assignee) {
      task.assignee = input.task.assignee;
    }

    result.task = task;
  }

  return result;
}
