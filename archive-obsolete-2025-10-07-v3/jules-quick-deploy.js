#!/usr/bin/env node

/**
 * Jules Quick Deploy - Rapid task creation for asynchronous work
 * Simple command-line interface to create tasks for Jules
 */

import dotenv from 'dotenv';
import JulesAsyncWorkflow from './src/integrations/jules-async-workflow.js';

dotenv.config();

// Color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logHeader(title) {
  console.log('\n' + '='.repeat(60));
  log(title, colors.bright + colors.cyan);
  console.log('='.repeat(60));
}

/**
 * Predefined task templates for quick deployment
 */
const TASK_TEMPLATES = {
  'api-endpoint': {
    title: 'Create API Endpoint',
    description: 'Implement a new REST API endpoint with proper error handling and validation',
    requirements: [
      'Create endpoint route with proper HTTP methods',
      'Add input validation and sanitization',
      'Implement error handling with appropriate status codes',
      'Add documentation/comments',
      'Write basic tests'
    ],
    estimated_time: '45 minutes',
    priority: 'normal'
  },

  'react-component': {
    title: 'Create React Component',
    description: 'Implement a reusable React component with TypeScript support',
    requirements: [
      'Create functional component with props interface',
      'Add proper TypeScript types',
      'Implement responsive design',
      'Add JSDoc documentation',
      'Create simple storybook story or example'
    ],
    estimated_time: '30 minutes',
    priority: 'normal'
  },

  'database-migration': {
    title: 'Database Schema Migration',
    description: 'Create database migration and update related models',
    requirements: [
      'Write migration script (up/down)',
      'Update database models/schemas',
      'Add proper constraints and indexes',
      'Update seed data if needed',
      'Test migration on dev database'
    ],
    estimated_time: '60 minutes',
    priority: 'high'
  },

  'bug-fix': {
    title: 'Bug Fix',
    description: 'Investigate and fix a reported bug',
    requirements: [
      'Reproduce the bug',
      'Identify root cause',
      'Implement fix with minimal impact',
      'Add regression test',
      'Verify fix works in different scenarios'
    ],
    estimated_time: '90 minutes',
    priority: 'high'
  },

  'feature-enhancement': {
    title: 'Feature Enhancement',
    description: 'Enhance existing functionality with new capabilities',
    requirements: [
      'Analyze current implementation',
      'Design enhancement approach',
      'Implement new functionality',
      'Ensure backward compatibility',
      'Update documentation'
    ],
    estimated_time: '120 minutes',
    priority: 'normal'
  },

  'refactor-code': {
    title: 'Code Refactoring',
    description: 'Refactor existing code for better maintainability',
    requirements: [
      'Identify refactoring opportunities',
      'Maintain existing functionality',
      'Improve code readability and structure',
      'Add missing documentation',
      'Ensure all tests still pass'
    ],
    estimated_time: '75 minutes',
    priority: 'low'
  }
};

/**
 * Interactive task creation
 */
async function createInteractiveTask(jules) {
  log('\n📝 Creating custom task for Jules...', colors.yellow);

  // In a real implementation, you'd use a library like 'inquirer' for interactive prompts
  // For now, we'll create a sample custom task
  const customTask = {
    title: 'Custom Development Task',
    description: 'Implement custom functionality as specified',
    requirements: [
      'Analyze requirements',
      'Design implementation approach',
      'Implement solution',
      'Test thoroughly',
      'Document changes'
    ],
    priority: 'normal',
    estimated_time: '60 minutes',
    code_context: `
// Example context for the task
const currentImplementation = {
    // Current code structure
    method: 'existing implementation'
};

// Goal: Enhance or modify this implementation
`,
    files_to_modify: [
      'src/components/Component.tsx',
      'src/hooks/useCustomHook.ts',
      'tests/Component.test.tsx'
    ]
  };

  return await jules.createTaskForJules(customTask);
}

/**
 * Create task from template
 */
async function createTemplateTask(jules, templateName, customizations = {}) {
  if (!TASK_TEMPLATES[templateName]) {
    throw new Error(`Template "${templateName}" not found`);
  }

  const template = { ...TASK_TEMPLATES[templateName], ...customizations };

  log(`🎯 Creating ${template.title} task for Jules...`, colors.yellow);

  return await jules.createTaskForJules(template);
}

/**
 * Batch create multiple tasks
 */
async function createTaskBatch(jules, tasks) {
  log(`📦 Creating batch of ${tasks.length} tasks...`, colors.yellow);

  return await jules.createTaskBatch(tasks);
}

/**
 * Show available templates
 */
function showTemplates() {
  logHeader('Available Task Templates');

  Object.entries(TASK_TEMPLATES).forEach(([key, template]) => {
    console.log(`\n${colors.bright}${colors.green}${key}${colors.reset}`);
    console.log(`  Title: ${template.title}`);
    console.log(`  Time: ${template.estimated_time}`);
    console.log(`  Priority: ${template.priority}`);
    console.log(`  Requirements: ${template.requirements.length} items`);
  });
}

/**
 * Show workspace status
 */
async function showStatus(jules) {
  logHeader('Jules Workspace Status');

  try {
    const pendingTasks = await jules.getPendingTasks();

    if (pendingTasks.success) {
      log(`📊 Pending tasks: ${pendingTasks.pending_tasks}`, colors.cyan);

      if (pendingTasks.tasks.length > 0) {
        console.log('\nActive tasks:');
        pendingTasks.tasks.forEach(task => {
          console.log(`  • #${task.number}: ${task.title.replace('🤖 Jules Task: ', '')}`);
          console.log(`    Created: ${new Date(task.created_at).toLocaleDateString()}`);
          console.log(`    Assignees: ${task.assignees.map(a => a.login).join(', ') || 'None'}`);
        });
      }
    } else {
      log('❌ Failed to get status', colors.red);
    }
  } catch (error) {
    log(`❌ Error getting status: ${error.message}`, colors.red);
  }
}

/**
 * Main CLI function
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log(colors.bright + colors.magenta);
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║                 Jules Quick Deploy                       ║');
  console.log('║          Rapid GitHub Tasks for Async Work              ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(colors.reset);

  // Check prerequisites
  if (!process.env.GITHUB_PAT) {
    log('❌ GITHUB_PAT not configured. Please check your .env file', colors.red);
    process.exit(1);
  }

  const jules = new JulesAsyncWorkflow();

  try {
    switch (command) {
    case 'init':
      logHeader('Initializing Jules Workspace');
      const initialized = await jules.initialize();
      if (initialized) {
        log('✅ Jules workspace initialized successfully!', colors.green);
      } else {
        log('❌ Failed to initialize workspace', colors.red);
      }
      break;

    case 'templates':
      showTemplates();
      break;

    case 'create':
      const templateName = args[1];
      if (!templateName) {
        log('Usage: node jules-quick-deploy.js create <template-name>', colors.yellow);
        log('Use "templates" command to see available templates', colors.yellow);
        break;
      }

      await jules.initialize();
      const result = await createTemplateTask(jules, templateName);

      if (result.success) {
        log('✅ Task created successfully!', colors.green);
        log(`   Issue: ${result.issue_url}`, colors.cyan);
        log(`   Branch: ${result.branch}`, colors.cyan);
        log(`   Task ID: ${result.task_id}`, colors.cyan);
      } else {
        log(`❌ Failed to create task: ${result.error}`, colors.red);
      }
      break;

    case 'custom':
      await jules.initialize();
      const customResult = await createInteractiveTask(jules);

      if (customResult.success) {
        log('✅ Custom task created!', colors.green);
        log(`   Issue: ${customResult.issue_url}`, colors.cyan);
      } else {
        log(`❌ Failed to create custom task: ${customResult.error}`, colors.red);
      }
      break;

    case 'batch':
      // Example batch creation
      await jules.initialize();
      const batchTasks = [
        { ...TASK_TEMPLATES['api-endpoint'], title: 'User Authentication Endpoint' },
        { ...TASK_TEMPLATES['react-component'], title: 'Login Form Component' },
        { ...TASK_TEMPLATES['database-migration'], title: 'User Table Schema' }
      ];

      const batchResult = await createTaskBatch(jules, batchTasks);

      if (batchResult.success) {
        log(`✅ Created ${batchResult.successful_tasks}/${batchResult.total_tasks} tasks`, colors.green);
      } else {
        log('❌ Batch creation failed', colors.red);
      }
      break;

    case 'status':
      await jules.initialize();
      await showStatus(jules);
      break;

    case 'cleanup':
      await jules.initialize();
      const cleanupResult = await jules.closeCompletedTasks();

      if (cleanupResult.success) {
        log(`✅ Closed ${cleanupResult.closed_tasks} completed tasks`, colors.green);
      } else {
        log(`❌ Cleanup failed: ${cleanupResult.error}`, colors.red);
      }
      break;

    default:
      console.log(`
${colors.bright}Usage:${colors.reset}
  node jules-quick-deploy.js <command> [options]

${colors.bright}Commands:${colors.reset}
  ${colors.green}init${colors.reset}              Initialize Jules workspace
  ${colors.green}templates${colors.reset}         Show available task templates
  ${colors.green}create <template>${colors.reset}  Create task from template
  ${colors.green}custom${colors.reset}            Create custom task interactively
  ${colors.green}batch${colors.reset}             Create multiple tasks at once
  ${colors.green}status${colors.reset}            Show workspace status
  ${colors.green}cleanup${colors.reset}           Close completed tasks

${colors.bright}Examples:${colors.reset}
  node jules-quick-deploy.js init
  node jules-quick-deploy.js create api-endpoint
  node jules-quick-deploy.js create react-component
  node jules-quick-deploy.js status
                `);
      break;
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`, colors.red);
    console.error(error.stack);
  } finally {
    await jules.stop();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default main;
