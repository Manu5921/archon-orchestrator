/**
 * Observability Pulse Logger - V6 MVP
 *
 * Structured JSONL logger for multi-agent orchestration
 * Each line = 1 event in JSON format
 *
 * Usage:
 *   const pulse = require('./scripts/pulseLogger.cjs');
 *   pulse.logStart('backend-specialist', { tasks: 42 });
 *   pulse.logEnd('backend-specialist', { duration_s: 450, files: 23 });
 *   pulse.logError('frontend-specialist', new Error('Build failed'));
 *   pulse.logCheckpoint('build', 'pass', { exit_code: 0 });
 *
 * Output: observability-pulse.jsonl (append-only, 1 line per event)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PULSE_FILE = path.join(process.cwd(), 'observability-pulse.jsonl');

/**
 * Append JSON event to pulse file
 * @private
 */
function appendEvent(event) {
  const line = JSON.stringify(event) + '\n';
  fs.appendFileSync(PULSE_FILE, line, 'utf8');
}

/**
 * Initialize pulse file (create empty if doesn't exist)
 */
function initPulse() {
  if (!fs.existsSync(PULSE_FILE)) {
    fs.writeFileSync(PULSE_FILE, '', 'utf8');
    console.log('✅ Created observability-pulse.jsonl');
  }
}

/**
 * Log agent start event
 * @param {string} agentId - Agent identifier (e.g., 'backend-specialist')
 * @param {object} context - Additional context (tasks count, etc.)
 */
function logStart(agentId, context = {}) {
  appendEvent({
    type: 'agent_start',
    agent: agentId,
    timestamp: new Date().toISOString(),
    context
  });
  console.log(`🚀 [PULSE] Agent started: ${agentId}`);
}

/**
 * Log agent end event
 * @param {string} agentId - Agent identifier
 * @param {object} result - Execution result (duration, files modified, etc.)
 */
function logEnd(agentId, result = {}) {
  appendEvent({
    type: 'agent_end',
    agent: agentId,
    timestamp: new Date().toISOString(),
    result
  });
  console.log(`✅ [PULSE] Agent completed: ${agentId} (${result.duration_s || '?'}s)`);
}

/**
 * Log agent error event
 * @param {string} agentId - Agent identifier
 * @param {Error} error - Error object
 */
function logError(agentId, error) {
  appendEvent({
    type: 'agent_error',
    agent: agentId,
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    }
  });
  console.error(`❌ [PULSE] Agent error: ${agentId} - ${error.message}`);
}

/**
 * Log checkpoint validation event
 * @param {string} gate - Checkpoint name (build, lint, test)
 * @param {string} status - Status (pass, fail, skip)
 * @param {object} details - Additional details (exit_code, duration, etc.)
 */
function logCheckpoint(gate, status, details = {}) {
  appendEvent({
    type: 'checkpoint',
    gate,
    status,
    timestamp: new Date().toISOString(),
    details
  });

  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⏭️';
  console.log(`${icon} [PULSE] Checkpoint ${gate}: ${status.toUpperCase()}`);
}

/**
 * Log custom event
 * @param {string} eventType - Event type identifier
 * @param {object} data - Event data
 */
function logCustom(eventType, data = {}) {
  appendEvent({
    type: eventType,
    timestamp: new Date().toISOString(),
    ...data
  });
  console.log(`📝 [PULSE] ${eventType}`);
}

/**
 * Read all events from pulse file
 * @returns {Array} Array of event objects
 */
function readPulse() {
  if (!fs.existsSync(PULSE_FILE)) {
    return [];
  }

  const content = fs.readFileSync(PULSE_FILE, 'utf8');
  return content
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));
}

/**
 * Get summary statistics from pulse
 * @returns {object} Summary stats
 */
function getSummary() {
  const events = readPulse();

  const agents = new Set();
  const errors = [];
  const checkpoints = { pass: 0, fail: 0, skip: 0 };

  events.forEach(event => {
    if (event.type === 'agent_start' || event.type === 'agent_end') {
      agents.add(event.agent);
    }
    if (event.type === 'agent_error') {
      errors.push(event);
    }
    if (event.type === 'checkpoint') {
      checkpoints[event.status] = (checkpoints[event.status] || 0) + 1;
    }
  });

  const firstEvent = events[0];
  const lastEvent = events[events.length - 1];

  const duration_ms = firstEvent && lastEvent
    ? new Date(lastEvent.timestamp) - new Date(firstEvent.timestamp)
    : 0;

  return {
    total_events: events.length,
    agents: Array.from(agents),
    agents_count: agents.size,
    errors_count: errors.length,
    checkpoints,
    duration_s: Math.round(duration_ms / 1000),
    first_event: firstEvent?.timestamp,
    last_event: lastEvent?.timestamp
  };
}

/**
 * Clear pulse file (reset for new run)
 */
function clearPulse() {
  if (fs.existsSync(PULSE_FILE)) {
    fs.unlinkSync(PULSE_FILE);
    console.log('🗑️  Cleared observability-pulse.jsonl');
  }
}

// Export public API
module.exports = {
  initPulse,
  logStart,
  logEnd,
  logError,
  logCheckpoint,
  logCustom,
  readPulse,
  getSummary,
  clearPulse
};

// Auto-init on require (ensure file exists)
initPulse();

// CLI interface (if called directly from bash)
if (require.main === module) {
  const [,, command, ...args] = process.argv;

  try {
    switch (command) {
      case 'start':
        // Usage: node pulseLogger.cjs start agent-name '{"tasks":35}'
        const [agentId, contextJson] = args;
        const context = contextJson ? JSON.parse(contextJson) : {};
        logStart(agentId, context);
        break;

      case 'end':
        // Usage: node pulseLogger.cjs end agent-name '{"duration_s":450}'
        const [endAgentId, resultJson] = args;
        const result = resultJson ? JSON.parse(resultJson) : {};
        logEnd(endAgentId, result);
        break;

      case 'error':
        // Usage: node pulseLogger.cjs error agent-name 'Error message'
        const [errAgentId, errMsg] = args;
        logError(errAgentId, new Error(errMsg));
        break;

      case 'checkpoint':
        // Usage: node pulseLogger.cjs checkpoint build pass '{"exit_code":0}'
        const [gate, status, detailsJson] = args;
        const details = detailsJson ? JSON.parse(detailsJson) : {};
        logCheckpoint(gate, status, details);
        break;

      case 'summary':
        // Usage: node pulseLogger.cjs summary
        const summary = getSummary();
        console.log(JSON.stringify(summary, null, 2));
        break;

      case 'clear':
        // Usage: node pulseLogger.cjs clear
        clearPulse();
        break;

      default:
        console.error(`Unknown command: ${command}`);
        console.log('Usage:');
        console.log('  node pulseLogger.cjs start <agent-id> <context-json>');
        console.log('  node pulseLogger.cjs end <agent-id> <result-json>');
        console.log('  node pulseLogger.cjs error <agent-id> <error-message>');
        console.log('  node pulseLogger.cjs checkpoint <gate> <status> <details-json>');
        console.log('  node pulseLogger.cjs summary');
        console.log('  node pulseLogger.cjs clear');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error executing command:', error.message);
    process.exit(1);
  }
}
