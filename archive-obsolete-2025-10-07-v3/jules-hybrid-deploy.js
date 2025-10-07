#!/usr/bin/env node

/**
 * Jules Hybrid Deploy - Next-Gen Workflow with Direct Jules Communication
 * Combines Jules MCP (direct) + GitHub MCP (repository) for optimal async collaboration
 */

import dotenv from 'dotenv';
import HybridJulesWorkflow from './src/integrations/hybrid-jules-workflow.js';

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
    console.log('\n' + '='.repeat(70));
    log(title, colors.bright + colors.cyan);
    console.log('='.repeat(70));
}

/**
 * Enhanced task templates optimized for Jules direct communication
 */
const HYBRID_TEMPLATES = {
    'smart-api': {
        title: 'Smart API Endpoint with AI Enhancement',
        description: 'Create an intelligent REST API endpoint with auto-validation, error prediction, and performance optimization',
        requirements: [
            'Design RESTful endpoint with OpenAPI spec',
            'Implement input validation with Zod/Joi',
            'Add intelligent error handling with context',
            'Include rate limiting and caching strategy',
            'Add comprehensive API documentation',
            'Write integration tests with edge cases',
            'Implement monitoring and analytics hooks'
        ],
        repository: 'your-repo/api-service',
        branch: 'feature/smart-api',
        priority: 'high',
        estimated_time: '90 minutes',
        code_context: `
// Current API structure
app.use('/api/v1', routes);

// Need intelligent endpoint with:
// - Auto-validation
// - Smart error handling
// - Performance monitoring
`,
        files_to_modify: [
            'src/routes/api.js',
            'src/middleware/validation.js',
            'src/utils/errorHandler.js',
            'tests/api.integration.test.js'
        ]
    },

    'react-ai-component': {
        title: 'AI-Powered React Component',
        description: 'Build an intelligent React component with adaptive behavior and smart state management',
        requirements: [
            'Create TypeScript functional component',
            'Implement adaptive UI based on user behavior',
            'Add intelligent state management with context',
            'Include accessibility features (a11y)',
            'Add responsive design with smart breakpoints',
            'Implement error boundaries and fallbacks',
            'Create comprehensive Storybook stories',
            'Add performance monitoring hooks'
        ],
        repository: 'your-repo/frontend',
        branch: 'feature/ai-component',
        priority: 'normal',
        estimated_time: '75 minutes',
        code_context: `
// Current component structure
interface ComponentProps {
  data: any[];
  onAction: (item: any) => void;
}

// Need AI enhancement for:
// - Adaptive behavior
// - Smart predictions
// - Performance optimization
`,
        files_to_modify: [
            'src/components/SmartComponent.tsx',
            'src/hooks/useAdaptiveState.ts',
            'src/types/component.types.ts',
            'stories/SmartComponent.stories.tsx'
        ]
    },

    'intelligent-migration': {
        title: 'Intelligent Database Migration',
        description: 'Create smart database migration with automatic rollback detection and data integrity checks',
        requirements: [
            'Design migration with rollback safety',
            'Add automatic data integrity validation',
            'Implement smart conflict detection',
            'Include performance impact analysis',
            'Add automated backup strategy',
            'Create migration monitoring dashboard',
            'Include rollback automation',
            'Add comprehensive testing suite'
        ],
        repository: 'your-repo/database',
        branch: 'migration/intelligent-schema',
        priority: 'critical',
        estimated_time: '120 minutes',
        code_context: `
// Current migration structure
exports.up = async (knex) => {
  // Schema changes
};

exports.down = async (knex) => {
  // Rollback logic
};

// Need intelligence for:
// - Conflict detection
// - Performance analysis  
// - Auto-rollback triggers
`,
        files_to_modify: [
            'migrations/202X_intelligent_schema.js',
            'src/database/integrity-checker.js',
            'src/monitoring/migration-monitor.js',
            'tests/migration.test.js'
        ]
    },

    'advanced-bug-hunt': {
        title: 'Advanced Bug Investigation with AI Analysis',
        description: 'Deep dive bug investigation using AI-powered analysis and predictive debugging',
        requirements: [
            'Analyze bug patterns with AI assistance',
            'Create comprehensive reproduction steps',
            'Implement fix with predictive error prevention',
            'Add monitoring to prevent similar issues',
            'Create automated testing for edge cases',
            'Document root cause analysis',
            'Add preventive measures and alerts',
            'Include performance impact assessment'
        ],
        repository: 'your-repo/main',
        branch: 'bugfix/ai-investigation',
        priority: 'critical',
        estimated_time: '150 minutes',
        code_context: `
// Bug report context
// Issue: Intermittent failures in user authentication
// Symptoms: Random 401 errors, session corruption
// Environment: Production, high traffic periods

// Current auth flow:
const authenticate = async (token) => {
  // Validation logic here
  // Need AI analysis for failure patterns
};
`,
        files_to_modify: [
            'src/auth/authentication.js',
            'src/middleware/session-handler.js',
            'src/utils/error-tracker.js',
            'tests/auth.regression.test.js'
        ]
    },

    'ai-feature-evolution': {
        title: 'AI-Driven Feature Evolution',
        description: 'Evolve existing feature with AI-powered enhancements and predictive user experience',
        requirements: [
            'Analyze current feature usage patterns',
            'Design AI-enhanced user experience',
            'Implement predictive feature behavior',
            'Add intelligent personalization',
            'Create adaptive performance optimization',
            'Include A/B testing framework',
            'Add user behavior analytics',
            'Ensure backward compatibility'
        ],
        repository: 'your-repo/features',
        branch: 'evolution/ai-enhancement',
        priority: 'normal',
        estimated_time: '180 minutes',
        code_context: `
// Current feature implementation
const currentFeature = {
  basicFunctionality: () => {},
  staticBehavior: true
};

// Evolution goals:
// - Predictive behavior
// - User personalization
// - Performance adaptation
// - Smart recommendations
`,
        files_to_modify: [
            'src/features/enhanced-feature.js',
            'src/ai/prediction-engine.js',
            'src/analytics/behavior-tracker.js',
            'src/personalization/user-profile.js'
        ]
    },

    'smart-refactor': {
        title: 'AI-Assisted Smart Refactoring',
        description: 'Intelligent code refactoring with automated optimization and architecture improvement',
        requirements: [
            'Analyze code complexity and technical debt',
            'Design optimal architecture patterns',
            'Implement automated refactoring strategies',
            'Add intelligent code organization',
            'Include performance optimization analysis',
            'Create automated testing for refactored code',
            'Add code quality metrics and monitoring',
            'Ensure zero-downtime deployment'
        ],
        repository: 'your-repo/legacy',
        branch: 'refactor/ai-optimization',
        priority: 'low',
        estimated_time: '240 minutes',
        code_context: `
// Legacy code structure
const legacyModule = {
  complexFunction: (params) => {
    // 200+ lines of mixed concerns
    // High cyclomatic complexity
    // Multiple responsibilities
  }
};

// Refactoring goals:
// - Single responsibility principle
// - Improved testability
// - Performance optimization
// - Modern patterns
`,
        files_to_modify: [
            'src/legacy/complex-module.js',
            'src/refactored/optimized-service.js',
            'src/utils/performance-monitor.js',
            'tests/refactor-validation.test.js'
        ]
    }
};

/**
 * Show enhanced templates
 */
function showHybridTemplates() {
    logHeader('🧠 AI-Enhanced Task Templates for Jules');
    
    Object.entries(HYBRID_TEMPLATES).forEach(([key, template]) => {
        console.log(`\n${colors.bright}${colors.green}${key}${colors.reset}`);
        console.log(`  📋 ${template.title}`);
        console.log(`  ⏱️  ${template.estimated_time}`);
        console.log(`  🔥 Priority: ${template.priority}`);
        console.log(`  📁 Files: ${template.files_to_modify.length} files`);
        console.log(`  ✅ Requirements: ${template.requirements.length} items`);
        console.log(`  🎯 ${template.description.substring(0, 80)}...`);
    });
}

/**
 * Create task with hybrid workflow
 */
async function createHybridTask(jules, templateName, customizations = {}) {
    if (!HYBRID_TEMPLATES[templateName]) {
        throw new Error(`Template "${templateName}" not found`);
    }
    
    const template = { ...HYBRID_TEMPLATES[templateName], ...customizations };
    
    log(`🚀 Creating hybrid task: ${template.title}`, colors.yellow);
    log(`   Using Jules MCP for direct communication`, colors.cyan);
    log(`   Using GitHub MCP for repository management`, colors.cyan);
    
    return await jules.createOptimizedTask(template);
}

/**
 * Monitor hybrid workflow status
 */
async function showHybridStatus(jules) {
    logHeader('🔍 Hybrid Workflow Status Monitor');
    
    try {
        const allTasks = await jules.getAllTasksStatus();
        
        if (allTasks.success) {
            log(`📊 Overall Status:`, colors.bright);
            console.log(`   Jules Tasks: ${allTasks.jules_tasks} active`);
            console.log(`   GitHub Issues: ${allTasks.github_issues} open`);
            console.log(`   Total Active: ${allTasks.active_tasks}`);
            
            if (allTasks.tasks.jules && allTasks.tasks.jules.length > 0) {
                console.log(`\n${colors.cyan}📱 Active Jules Tasks:${colors.reset}`);
                allTasks.tasks.jules.forEach(task => {
                    console.log(`   🎯 ${task.title || task.id}`);
                    console.log(`      Status: ${task.status}`);
                    console.log(`      Progress: ${task.chatHistory?.length || 0} messages`);
                });
            }
            
            if (allTasks.tasks.github && allTasks.tasks.github.length > 0) {
                console.log(`\n${colors.cyan}📋 GitHub Issues:${colors.reset}`);
                allTasks.tasks.github.slice(0, 5).forEach(issue => {
                    console.log(`   #${issue.number}: ${issue.title.replace('🤖 Jules Task: ', '')}`);
                    console.log(`      State: ${issue.state}`);
                    console.log(`      Comments: ${issue.comments}`);
                });
            }
        } else {
            log(`❌ Failed to get status: ${allTasks.error}`, colors.red);
        }
    } catch (error) {
        log(`❌ Error: ${error.message}`, colors.red);
    }
}

/**
 * Interactive task communication
 */
async function communicateWithJules(jules, taskId, message) {
    try {
        log(`💬 Sending message to Jules task ${taskId}...`, colors.yellow);
        
        // For this demo, we'll assume taskId format is "jules-123" or "github-456"
        const taskInfo = {};
        if (taskId.startsWith('jules-')) {
            taskInfo.jules_task_id = taskId.replace('jules-', '');
        } else if (taskId.startsWith('github-')) {
            taskInfo.github_issue_number = parseInt(taskId.replace('github-', ''));
        }
        
        const result = await jules.sendMessageToJules(taskInfo, message);
        
        if (result.success) {
            log(`✅ Message sent successfully`, colors.green);
        } else {
            log(`❌ Failed to send message: ${result.error}`, colors.red);
        }
    } catch (error) {
        log(`❌ Error: ${error.message}`, colors.red);
    }
}

/**
 * Batch create advanced tasks
 */
async function createAdvancedBatch(jules) {
    const advancedBatch = [
        { ...HYBRID_TEMPLATES['smart-api'], title: 'User Profile API Enhancement' },
        { ...HYBRID_TEMPLATES['react-ai-component'], title: 'Smart Dashboard Widget' },
        { ...HYBRID_TEMPLATES['intelligent-migration'], title: 'Performance Schema Update' }
    ];
    
    log(`📦 Creating advanced batch of ${advancedBatch.length} tasks...`, colors.yellow);
    
    const result = await jules.createTaskBatch(advancedBatch);
    
    if (result.success) {
        log(`✅ Created ${result.successful_tasks}/${result.total_tasks} tasks`, colors.green);
        result.results.forEach((taskResult, index) => {
            if (taskResult.success) {
                console.log(`   ${index + 1}. ${taskResult.workflow_type} - Jules: ${taskResult.jules_task_id || 'N/A'}, GitHub: #${taskResult.github_issue_number || 'N/A'}`);
            }
        });
    } else {
        log(`❌ Batch creation failed`, colors.red);
    }
    
    return result;
}

/**
 * Main CLI
 */
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    console.log(colors.bright + colors.magenta);
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║                    Jules Hybrid Deploy                          ║');
    console.log('║              Next-Gen AI Collaboration Workflow                 ║');
    console.log('║        Jules MCP (Direct) + GitHub MCP (Repository)             ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log(colors.reset);
    
    // Prerequisites check
    if (!process.env.GITHUB_PAT) {
        log('❌ GITHUB_PAT not configured', colors.red);
        console.log('Please set your GitHub Personal Access Token in .env file');
        process.exit(1);
    }
    
    if (!process.env.GOOGLE_AUTH_COOKIES) {
        log('⚠️  GOOGLE_AUTH_COOKIES not configured', colors.yellow);
        console.log('Jules MCP will use fallback authentication mode');
        console.log('For optimal performance, set GOOGLE_AUTH_COOKIES in .env file');
    }
    
    const jules = new HybridJulesWorkflow();
    
    try {
        switch (command) {
            case 'init':
                logHeader('🚀 Initializing Hybrid Jules-GitHub Workflow');
                const initialized = await jules.initialize();
                if (initialized) {
                    log('✅ Hybrid workflow initialized successfully!', colors.green);
                    log('   ✅ Jules MCP connected', colors.green);
                    log('   ✅ GitHub MCP connected', colors.green);
                    log('   ✅ Workspace configured', colors.green);
                    console.log('\nYou can now create tasks with direct Jules communication!');
                } else {
                    log('❌ Failed to initialize hybrid workflow', colors.red);
                }
                break;
                
            case 'templates':
                showHybridTemplates();
                break;
                
            case 'create':
                const templateName = args[1];
                if (!templateName) {
                    log('Usage: node jules-hybrid-deploy.js create <template-name>', colors.yellow);
                    log('Use "templates" command to see available templates', colors.yellow);
                    break;
                }
                
                await jules.initialize();
                const result = await createHybridTask(jules, templateName);
                
                if (result.success) {
                    log(`✅ Hybrid task created successfully!`, colors.green);
                    console.log(`   🎯 Workflow: ${result.workflow_type}`);
                    if (result.jules_task_id) {
                        console.log(`   🤖 Jules Task: ${result.jules_task_id}`);
                        console.log(`   📱 Jules URL: ${result.jules_task_url || 'Available in Jules interface'}`);
                    }
                    if (result.github_issue_number) {
                        console.log(`   📋 GitHub Issue: #${result.github_issue_number}`);
                        console.log(`   🔗 GitHub URL: ${result.github_issue_url}`);
                    }
                    if (result.warning) {
                        log(`   ⚠️  ${result.warning}`, colors.yellow);
                    }
                } else {
                    log(`❌ Failed to create task: ${result.error}`, colors.red);
                }
                break;
                
            case 'status':
                await jules.initialize();
                await showHybridStatus(jules);
                break;
                
            case 'message':
                const taskId = args[1];
                const message = args.slice(2).join(' ');
                
                if (!taskId || !message) {
                    log('Usage: node jules-hybrid-deploy.js message <task-id> <message>', colors.yellow);
                    log('Example: node jules-hybrid-deploy.js message jules-123 "Please add error handling"', colors.yellow);
                    break;
                }
                
                await jules.initialize();
                await communicateWithJules(jules, taskId, message);
                break;
                
            case 'batch':
                await jules.initialize();
                await createAdvancedBatch(jules);
                break;
                
            case 'demo':
                logHeader('🎪 Hybrid Workflow Demo');
                await jules.initialize();
                
                log('Creating demo task with direct Jules communication...', colors.yellow);
                const demoResult = await createHybridTask(jules, 'smart-api', {
                    title: 'Demo Smart API Endpoint',
                    repository: `${process.env.GITHUB_OWNER || 'demo'}/demo-project`
                });
                
                if (demoResult.success) {
                    log('✅ Demo task created! Check Jules and GitHub for progress.', colors.green);
                }
                break;
                
            default:
                console.log(`
${colors.bright}Enhanced Commands:${colors.reset}
  ${colors.green}init${colors.reset}                    Initialize hybrid Jules-GitHub workflow
  ${colors.green}templates${colors.reset}               Show AI-enhanced task templates  
  ${colors.green}create <template>${colors.reset}       Create task with direct Jules communication
  ${colors.green}status${colors.reset}                  Monitor hybrid workflow status
  ${colors.green}message <id> <msg>${colors.reset}      Send message to Jules task
  ${colors.green}batch${colors.reset}                   Create advanced task batch
  ${colors.green}demo${colors.reset}                    Run hybrid workflow demonstration

${colors.bright}AI-Enhanced Templates:${colors.reset}
  ${colors.cyan}smart-api${colors.reset}               Intelligent API endpoint (90 min)
  ${colors.cyan}react-ai-component${colors.reset}      AI-powered React component (75 min)
  ${colors.cyan}intelligent-migration${colors.reset}   Smart database migration (120 min)
  ${colors.cyan}advanced-bug-hunt${colors.reset}       AI-assisted debugging (150 min)
  ${colors.cyan}ai-feature-evolution${colors.reset}    Feature enhancement with AI (180 min)
  ${colors.cyan}smart-refactor${colors.reset}          AI-assisted refactoring (240 min)

${colors.bright}Workflow Benefits:${colors.reset}
  🎯 Direct Jules communication (no GitHub delays)
  📱 Real-time task updates and progress tracking
  🤖 AI-enhanced templates for complex scenarios
  💬 Bidirectional messaging with Jules
  📋 GitHub backup and tracking for transparency
  🔄 Automatic fallback to GitHub-only mode
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