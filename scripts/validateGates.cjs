#!/usr/bin/env node

/**
 * Policy-as-Code Gates Validator
 *
 * Purpose: Validate quality gates (P0-P4) against JSON Schema policies
 *
 * Pattern: Policy-as-Code (Infrastructure as Code for quality standards)
 *
 * Gates Validated:
 * - P0 Build: Exit code 0, no errors
 * - P1 Lint: 0 errors, warnings acceptable if documented
 * - P2 Tasks: Minimum 1 task completed
 * - P3 Memory: Minimum 1 decision documented
 * - P4 Observability: Minimum 3 events logged
 *
 * Usage:
 *   const { validateGates } = require('./scripts/validateGates.cjs');
 *   const result = validateGates(gatesData);
 *   if (!result.valid) { console.error(result.errors); exit(1); }
 *
 * Integration: /speckit.final Step 7 (Final Validation)
 *
 * Version: V6.1.5
 * Date: 2025-10-21
 */

const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, verbose: true });

// ============================================================================
// JSON SCHEMAS (Policy Definitions)
// ============================================================================

/**
 * Schema: Gate P0 - Build Check (BLOCKER)
 *
 * Policy:
 * - status: "pass" (MANDATORY)
 * - exit_code: 0 (MANDATORY)
 * - errors: 0 (MANDATORY)
 * - duration_ms: > 0 (optional, for metrics)
 *
 * Example Valid:
 * {
 *   "status": "pass",
 *   "exit_code": 0,
 *   "errors": 0,
 *   "duration_ms": 2340
 * }
 *
 * Example Invalid:
 * {
 *   "status": "fail",
 *   "exit_code": 1,
 *   "errors": 5
 * }
 */
const GATE_P0_SCHEMA = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['pass'],
      description: 'Build must pass (BLOCKER)',
    },
    exit_code: {
      type: 'number',
      const: 0,
      description: 'Exit code must be 0',
    },
    errors: {
      type: 'number',
      const: 0,
      description: 'No compilation errors allowed',
    },
    duration_ms: {
      type: 'number',
      minimum: 0,
      description: 'Build duration in milliseconds (optional)',
    },
  },
  required: ['status', 'exit_code', 'errors'],
  additionalProperties: true,
};

/**
 * Schema: Gate P1 - Lint Check (BLOCKER)
 *
 * Policy:
 * - errors: 0 (MANDATORY - TypeScript strict mode)
 * - warnings: acceptable (IF documented in project-memory.md)
 * - files_linted: > 0 (at least 1 file checked)
 *
 * Example Valid:
 * {
 *   "errors": 0,
 *   "warnings": 3,
 *   "files_linted": 42
 * }
 *
 * Example Invalid:
 * {
 *   "errors": 5,
 *   "warnings": 0,
 *   "files_linted": 42
 * }
 */
const GATE_P1_SCHEMA = {
  type: 'object',
  properties: {
    errors: {
      type: 'number',
      const: 0,
      description: 'Zero TypeScript/ESLint errors (strict mode)',
    },
    warnings: {
      type: 'number',
      minimum: 0,
      description: 'Warnings acceptable if documented',
    },
    files_linted: {
      type: 'number',
      minimum: 1,
      description: 'At least 1 file must be linted',
    },
  },
  required: ['errors', 'warnings', 'files_linted'],
  additionalProperties: true,
};

/**
 * Schema: Gate P2 - Tasks Progress (VERIFICATION)
 *
 * Policy:
 * - completed: >= 1 (at least 1 task must be completed)
 * - total: > 0 (sanity check - tasks.md not empty)
 * - completion_rate: 0.0-1.0 (optional, for metrics)
 *
 * Example Valid:
 * {
 *   "completed": 35,
 *   "total": 99,
 *   "completion_rate": 0.35
 * }
 *
 * Example Invalid (juri audit case):
 * {
 *   "completed": 0,
 *   "total": 87,
 *   "completion_rate": 0.0
 * }
 */
const GATE_P2_SCHEMA = {
  type: 'object',
  properties: {
    completed: {
      type: 'number',
      minimum: 1,
      description: 'At least 1 task must be completed (BLOCKER juri fix)',
    },
    total: {
      type: 'number',
      minimum: 1,
      description: 'Total tasks must be > 0',
    },
    completion_rate: {
      type: 'number',
      minimum: 0.0,
      maximum: 1.0,
      description: 'Completion rate (0.0-1.0, optional)',
    },
  },
  required: ['completed', 'total'],
  additionalProperties: true,
};

/**
 * Schema: Gate P3 - Memory Documentation (VERIFICATION)
 *
 * Policy:
 * - decisions_documented: >= 1 (at least 1 significant decision)
 * - sections_updated: array of section names (optional)
 * - quality_score: 0-10 (optional, template quality check)
 *
 * Example Valid:
 * {
 *   "decisions_documented": 2,
 *   "sections_updated": ["Backend Decisions", "Runtime Decisions"],
 *   "quality_score": 8
 * }
 *
 * Example Invalid:
 * {
 *   "decisions_documented": 0
 * }
 */
const GATE_P3_SCHEMA = {
  type: 'object',
  properties: {
    decisions_documented: {
      type: 'number',
      minimum: 1,
      description: 'At least 1 runtime decision documented (WHY)',
    },
    sections_updated: {
      type: 'array',
      items: { type: 'string' },
      description: 'Sections updated in project-memory.md (optional)',
    },
    quality_score: {
      type: 'number',
      minimum: 0,
      maximum: 10,
      description: 'Template quality score (optional)',
    },
  },
  required: ['decisions_documented'],
  additionalProperties: true,
};

/**
 * Schema: Gate P4 - Observability Timeline (TIMELINE)
 *
 * Policy:
 * - events_logged: >= 3 (start + checkpoint + end minimum)
 * - agents_tracked: >= 1 (at least 1 agent logged)
 * - checkpoints_passed: >= 0 (optional)
 * - errors: 0 (no errors during execution)
 *
 * Example Valid:
 * {
 *   "events_logged": 19,
 *   "agents_tracked": 3,
 *   "checkpoints_passed": 12,
 *   "errors": 0
 * }
 *
 * Example Invalid (juri audit case):
 * {
 *   "events_logged": 0,
 *   "agents_tracked": 0,
 *   "checkpoints_passed": 0,
 *   "errors": 0
 * }
 */
const GATE_P4_SCHEMA = {
  type: 'object',
  properties: {
    events_logged: {
      type: 'number',
      minimum: 3,
      description: 'Minimum 3 events (start + checkpoint + end)',
    },
    agents_tracked: {
      type: 'number',
      minimum: 1,
      description: 'At least 1 agent tracked',
    },
    checkpoints_passed: {
      type: 'number',
      minimum: 0,
      description: 'Number of checkpoints passed (optional)',
    },
    errors: {
      type: 'number',
      const: 0,
      description: 'No errors during execution',
    },
  },
  required: ['events_logged', 'agents_tracked', 'errors'],
  additionalProperties: true,
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate single gate against its schema
 *
 * @param {string} gateName - Gate name (P0, P1, P2, P3, P4)
 * @param {object} gateData - Gate data to validate
 * @param {object} schema - JSON Schema for this gate
 * @returns {{ valid: boolean, errors?: Array, gate: string }} - Validation result
 */
function validateGate(gateName, gateData, schema) {
  const validate = ajv.compile(schema);
  const valid = validate(gateData);

  if (!valid) {
    return {
      valid: false,
      gate: gateName,
      errors: validate.errors,
      data: gateData,
    };
  }

  return {
    valid: true,
    gate: gateName,
    data: gateData,
  };
}

/**
 * Validate all gates (P0-P4)
 *
 * @param {object} gates - All gates data
 *   {
 *     P0: { status: "pass", exit_code: 0, errors: 0 },
 *     P1: { errors: 0, warnings: 3, files_linted: 42 },
 *     P2: { completed: 35, total: 99 },
 *     P3: { decisions_documented: 2 },
 *     P4: { events_logged: 19, agents_tracked: 3, errors: 0 }
 *   }
 * @returns {{ valid: boolean, results: Array<object>, summary: object }} - Validation results
 */
function validateGates(gates) {
  const results = [];

  // Validate P0 Build
  if (gates.P0) {
    results.push(validateGate('P0', gates.P0, GATE_P0_SCHEMA));
  } else {
    results.push({
      valid: false,
      gate: 'P0',
      errors: [{ message: 'Gate P0 (Build) data missing' }],
    });
  }

  // Validate P1 Lint
  if (gates.P1) {
    results.push(validateGate('P1', gates.P1, GATE_P1_SCHEMA));
  } else {
    results.push({
      valid: false,
      gate: 'P1',
      errors: [{ message: 'Gate P1 (Lint) data missing' }],
    });
  }

  // Validate P2 Tasks
  if (gates.P2) {
    results.push(validateGate('P2', gates.P2, GATE_P2_SCHEMA));
  } else {
    results.push({
      valid: false,
      gate: 'P2',
      errors: [{ message: 'Gate P2 (Tasks) data missing' }],
    });
  }

  // Validate P3 Memory
  if (gates.P3) {
    results.push(validateGate('P3', gates.P3, GATE_P3_SCHEMA));
  } else {
    results.push({
      valid: false,
      gate: 'P3',
      errors: [{ message: 'Gate P3 (Memory) data missing' }],
    });
  }

  // Validate P4 Observability
  if (gates.P4) {
    results.push(validateGate('P4', gates.P4, GATE_P4_SCHEMA));
  } else {
    results.push({
      valid: false,
      gate: 'P4',
      errors: [{ message: 'Gate P4 (Observability) data missing' }],
    });
  }

  // Summary
  const passed = results.filter(r => r.valid).length;
  const failed = results.filter(r => !r.valid).length;
  const allValid = failed === 0;

  return {
    valid: allValid,
    results,
    summary: {
      total: results.length,
      passed,
      failed,
      gates_checked: ['P0', 'P1', 'P2', 'P3', 'P4'],
    },
  };
}

/**
 * Format validation errors for human-readable output
 *
 * @param {Array} errors - AJV validation errors
 * @returns {string} - Formatted error message
 */
function formatErrors(errors) {
  return errors
    .map(err => {
      const path = err.instancePath || err.dataPath || '(root)';
      const message = err.message || 'Validation failed';
      const params = err.params ? JSON.stringify(err.params) : '';

      return `  - ${path}: ${message} ${params}`;
    })
    .join('\n');
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

/**
 * CLI usage:
 *
 * Validate gates from JSON file:
 *   node scripts/validateGates.cjs validate gates-data.json
 *
 * Validate gates from observability-pulse.jsonl:
 *   node scripts/validateGates.cjs analyze observability-pulse.jsonl
 *
 * Test mode (all examples):
 *   node scripts/validateGates.cjs test
 */
function main() {
  const args = process.argv.slice(2);
  const [action, ...params] = args;

  if (action === 'validate') {
    const jsonFile = params[0];
    if (!jsonFile) {
      console.error('Usage: node scripts/validateGates.cjs validate <gates-data.json>');
      process.exit(1);
    }

    const fs = require('fs');
    const gatesData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    const result = validateGates(gatesData);

    console.log(`📊 Policy-as-Code Gates Validation\n`);

    if (result.valid) {
      console.log(`✅ ALL GATES PASSED (${result.summary.passed}/${result.summary.total})`);
      result.results.forEach(gate => {
        console.log(`   ${gate.gate}: ✅ PASS`);
      });
      process.exit(0);
    } else {
      console.error(`❌ GATES FAILED (${result.summary.failed}/${result.summary.total})`);
      result.results.forEach(gate => {
        if (!gate.valid) {
          console.error(`   ${gate.gate}: ❌ FAIL`);
          console.error(formatErrors(gate.errors));
        } else {
          console.log(`   ${gate.gate}: ✅ PASS`);
        }
      });
      process.exit(1);
    }
  }

  if (action === 'analyze') {
    const jsonlFile = params[0];
    if (!jsonlFile) {
      console.error('Usage: node scripts/validateGates.cjs analyze <observability-pulse.jsonl>');
      process.exit(1);
    }

    const fs = require('fs');
    const lines = fs.readFileSync(jsonlFile, 'utf-8').trim().split('\n');
    const events = lines.map(line => JSON.parse(line));

    // Extract gate data from observability events
    const gatesData = {
      P0: { status: 'unknown', exit_code: -1, errors: -1 },
      P1: { errors: -1, warnings: -1, files_linted: -1 },
      P2: { completed: -1, total: -1 },
      P3: { decisions_documented: -1 },
      P4: { events_logged: events.length, agents_tracked: 0, errors: 0 },
    };

    // Parse checkpoint events
    events.forEach(event => {
      if (event.event === 'checkpoint') {
        if (event.gate === 'build') {
          gatesData.P0 = {
            status: event.status || 'unknown',
            exit_code: event.details?.exit_code ?? -1,
            errors: event.details?.errors ?? 0,
            duration_ms: event.details?.duration_ms,
          };
        }

        if (event.gate === 'lint') {
          gatesData.P1 = {
            errors: event.details?.errors ?? -1,
            warnings: event.details?.warnings ?? -1,
            files_linted: event.details?.files_linted ?? -1,
          };
        }

        if (event.gate === 'test') {
          gatesData.P2 = {
            completed: event.details?.tasks_completed ?? -1,
            total: event.details?.tasks_total ?? -1,
          };
        }

        if (event.gate === 'memory') {
          gatesData.P3 = {
            decisions_documented: event.details?.decisions_documented ?? -1,
          };
        }
      }

      if (event.event === 'start') {
        gatesData.P4.agents_tracked++;
      }

      if (event.event === 'error') {
        gatesData.P4.errors++;
      }
    });

    console.log(`📊 Analyzing observability-pulse.jsonl...\n`);
    console.log(`Events: ${events.length}`);
    console.log(`Gates data extracted:\n`);
    console.log(JSON.stringify(gatesData, null, 2));

    const result = validateGates(gatesData);

    console.log(`\n📊 Validation Results:\n`);

    if (result.valid) {
      console.log(`✅ ALL GATES PASSED (${result.summary.passed}/${result.summary.total})`);
      process.exit(0);
    } else {
      console.error(`❌ GATES FAILED (${result.summary.failed}/${result.summary.total})`);
      result.results.forEach(gate => {
        if (!gate.valid) {
          console.error(`   ${gate.gate}: ❌ FAIL`);
          console.error(formatErrors(gate.errors));
        }
      });
      process.exit(1);
    }
  }

  if (action === 'test') {
    console.log('🧪 Running policy gates tests...\n');

    const testCases = [
      {
        name: 'VALID: All gates pass (AdProof.ai scenario)',
        gates: {
          P0: { status: 'pass', exit_code: 0, errors: 0, duration_ms: 2340 },
          P1: { errors: 0, warnings: 4, files_linted: 42 },
          P2: { completed: 99, total: 99, completion_rate: 1.0 },
          P3: { decisions_documented: 8, sections_updated: ['Backend', 'Frontend'] },
          P4: { events_logged: 19, agents_tracked: 3, checkpoints_passed: 12, errors: 0 },
        },
        expectValid: true,
      },
      {
        name: 'INVALID: Build failed (P0)',
        gates: {
          P0: { status: 'fail', exit_code: 1, errors: 5 },
          P1: { errors: 0, warnings: 0, files_linted: 42 },
          P2: { completed: 35, total: 99 },
          P3: { decisions_documented: 2 },
          P4: { events_logged: 10, agents_tracked: 1, errors: 0 },
        },
        expectValid: false,
      },
      {
        name: 'INVALID: Lint errors (P1)',
        gates: {
          P0: { status: 'pass', exit_code: 0, errors: 0 },
          P1: { errors: 3, warnings: 0, files_linted: 42 },
          P2: { completed: 35, total: 99 },
          P3: { decisions_documented: 2 },
          P4: { events_logged: 10, agents_tracked: 1, errors: 0 },
        },
        expectValid: false,
      },
      {
        name: 'INVALID: 0 tasks completed (P2 - juri audit case)',
        gates: {
          P0: { status: 'pass', exit_code: 0, errors: 0 },
          P1: { errors: 0, warnings: 0, files_linted: 42 },
          P2: { completed: 0, total: 87 },
          P3: { decisions_documented: 2 },
          P4: { events_logged: 10, agents_tracked: 1, errors: 0 },
        },
        expectValid: false,
      },
      {
        name: 'INVALID: 0 memory decisions (P3)',
        gates: {
          P0: { status: 'pass', exit_code: 0, errors: 0 },
          P1: { errors: 0, warnings: 0, files_linted: 42 },
          P2: { completed: 35, total: 99 },
          P3: { decisions_documented: 0 },
          P4: { events_logged: 10, agents_tracked: 1, errors: 0 },
        },
        expectValid: false,
      },
      {
        name: 'INVALID: 0 observability events (P4 - juri audit case)',
        gates: {
          P0: { status: 'pass', exit_code: 0, errors: 0 },
          P1: { errors: 0, warnings: 0, files_linted: 42 },
          P2: { completed: 35, total: 99 },
          P3: { decisions_documented: 2 },
          P4: { events_logged: 0, agents_tracked: 0, errors: 0 },
        },
        expectValid: false,
      },
    ];

    let passed = 0;
    let failed = 0;

    testCases.forEach(({ name, gates, expectValid }) => {
      const result = validateGates(gates);
      const success = result.valid === expectValid;

      if (success) {
        console.log(`✅ PASS: ${name}`);
        passed++;
      } else {
        console.error(`❌ FAIL: ${name}`);
        console.error(`   Expected: ${expectValid ? 'VALID' : 'INVALID'}`);
        console.error(`   Got: ${result.valid ? 'VALID' : 'INVALID'}`);
        if (!result.valid) {
          result.results.forEach(gate => {
            if (!gate.valid) {
              console.error(`   Gate ${gate.gate}: ${formatErrors(gate.errors)}`);
            }
          });
        }
        failed++;
      }
    });

    console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
    process.exit(failed === 0 ? 0 : 1);
  }

  // Default: show usage
  console.log('Usage:');
  console.log('  node scripts/validateGates.cjs validate <gates-data.json>');
  console.log('  node scripts/validateGates.cjs analyze <observability-pulse.jsonl>');
  console.log('  node scripts/validateGates.cjs test');
  process.exit(1);
}

// ============================================================================
// EXPORTS (for use as module)
// ============================================================================

module.exports = {
  validateGates,
  validateGate,
  GATE_P0_SCHEMA,
  GATE_P1_SCHEMA,
  GATE_P2_SCHEMA,
  GATE_P3_SCHEMA,
  GATE_P4_SCHEMA,
};

// Run CLI if executed directly
if (require.main === module) {
  main();
}
