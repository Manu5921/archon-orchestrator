/**
 * Structured Logging with Correlation ID
 * Pour tracer la chaîne WorkflowDirect → ProjectWorkflow → Archon.execute()
 */

import crypto from 'crypto';

/**
 * Create scoped logger
 * @param {string} scope - Scope name (e.g., 'archon.execute', 'orchestra.phase0')
 * @returns {Function} Logger function
 */
export const log = (scope) => (evt, meta = {}) => {
  console.log(JSON.stringify({
    t: new Date().toISOString(),
    scope,
    evt,
    ...meta
  }));
};

/**
 * Generate correlation ID
 */
export function generateCorrelationId() {
  return crypto.randomUUID();
}

/**
 * Extract correlation ID from args
 */
export function getCorrelationId(args) {
  if (Array.isArray(args) && args[0] && args[0].__cid) {
    return args[0].__cid;
  }
  if (args && typeof args === 'object' && args.__cid) {
    return args.__cid;
  }
  return generateCorrelationId();
}

/**
 * Inject correlation ID into args
 */
export function injectCorrelationId(args, cid) {
  if (Array.isArray(args)) {
    if (args[0] && typeof args[0] === 'object') {
      args[0].__cid = cid;
    } else {
      args.unshift({ __cid: cid });
    }
  } else if (args && typeof args === 'object') {
    args.__cid = cid;
  } else {
    args = { __cid: cid };
  }
  return args;
}