#!/usr/bin/env node
/**
 * Validate Archon Orchestrator project structure
 * Called by: npm run build (checkpoint validation)
 *
 * Validates:
 * - Required Spec-Kit commands exist
 * - Core documentation present
 * - Directory structure intact
 *
 * Exit codes:
 * - 0: All validations passed
 * - 1: Validation failures detected
 */

import { existsSync } from 'fs';

const REQUIRED_FILES = [
  // Spec-Kit Commands (Core - V5.2.1)
  '.claude/commands/speckit.agents.md',
  '.claude/commands/speckit.design.md',
  '.claude/commands/speckit.github.md',

  // Core Documentation
  'CLAUDE.md',
  'README.md',
  'package.json',

  // Workflow Documentation
  'WORKFLOW-V5.2.1-EXACT.md',
  'ROADMAP-V6.md',
  'CHANGELOG-V5.2.1-QUICK-WINS.md',

  // Reports
  'FRICTION-REPORT-V5.2-TO-V6.md',
  'VALIDATION-REPORT-FLOWGENIUS3-MVP.md'
];

const REQUIRED_DIRS = [
  '.claude/commands',
  '.specify/templates',
  'docs',
  'scripts'
];

const OPTIONAL_FILES = [
  'START-HERE.md',
  'INDEX-FILES-V4.md',
  '.eslintrc.json',
  'jest.config.js'
];

console.log('🔍 Validating Archon Orchestrator project structure...\n');

let errors = 0;
let warnings = 0;

// Check required files
console.log('📄 Checking required files...');
REQUIRED_FILES.forEach(file => {
  if (!existsSync(file)) {
    console.error(`  ❌ Missing required file: ${file}`);
    errors++;
  } else {
    console.log(`  ✅ ${file}`);
  }
});

// Check required directories
console.log('\n📁 Checking required directories...');
REQUIRED_DIRS.forEach(dir => {
  if (!existsSync(dir)) {
    console.error(`  ❌ Missing required directory: ${dir}/`);
    errors++;
  } else {
    console.log(`  ✅ ${dir}/`);
  }
});

// Check optional files (warnings only)
console.log('\n📋 Checking optional files (warnings only)...');
OPTIONAL_FILES.forEach(file => {
  if (!existsSync(file)) {
    console.warn(`  ⚠️  Missing optional file: ${file}`);
    warnings++;
  } else {
    console.log(`  ✅ ${file}`);
  }
});

// Summary
const totalChecks = REQUIRED_FILES.length + REQUIRED_DIRS.length;
const passed = totalChecks - errors;

console.log('\n' + '='.repeat(60));
console.log('📊 Validation Summary');
console.log('='.repeat(60));
console.log(`Required checks: ${passed}/${totalChecks} passed`);
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);
console.log('='.repeat(60));

if (errors > 0) {
  console.error(`\n❌ Build FAILED: ${errors} error(s) found`);
  console.error('\nAction required: Fix missing files/directories before continuing.');
  process.exit(1);
}

if (warnings > 0) {
  console.warn(`\n⚠️  Build PASSED with warnings: ${warnings} optional file(s) missing`);
  console.log('Consider adding optional files for better workflow support.');
}

console.log('\n✅ Build PASSED: Project structure is valid');
console.log('All required Spec-Kit commands and documentation present.\n');
process.exit(0);
