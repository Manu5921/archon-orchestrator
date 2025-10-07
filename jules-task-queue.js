#!/usr/bin/env node

/**
 * JULES ASYNC TASK QUEUE
 * Maximise l'utilisation de Jules avec batching et scheduling intelligent
 */

import fs from 'fs/promises';
import path from 'path';
import { logger } from './src/utils/logger.js';

class JulesTaskQueue {
  constructor() {
    this.queueFile = 'jules-queue.json';
    this.queue = [];
    this.maxDailyRequests = 15;
    this.requestsToday = 0;
    this.lastReset = new Date().toDateString();
    
    this.priorities = {
      'critical': 1,    // Bloquant pour production
      'high': 2,        // Feature importante  
      'medium': 3,      // Standard
      'low': 4,         // Nice-to-have
      'batch': 5        // Peut attendre demain
    };
    
    this.taskTypes = {
      'component': { batchable: true, maxBatch: 10 },
      'test': { batchable: true, maxBatch: 20 },
      'documentation': { batchable: true, maxBatch: 15 },
      'refactor': { batchable: true, maxBatch: 5 },
      'bugfix': { batchable: false, maxBatch: 1 },
      'deployment': { batchable: false, maxBatch: 1 }
    };
  }

  /**
   * Initialize or load existing queue
   */
  async init() {
    try {
      const data = await fs.readFile(this.queueFile, 'utf8');
      const saved = JSON.parse(data);
      this.queue = saved.queue || [];
      this.requestsToday = saved.requestsToday || 0;
      this.lastReset = saved.lastReset || new Date().toDateString();
      
      // Reset daily counter if new day
      if (this.lastReset !== new Date().toDateString()) {
        this.requestsToday = 0;
        this.lastReset = new Date().toDateString();
        await this.saveQueue();
      }
      
      logger.info(`📦 Loaded ${this.queue.length} tasks from queue`);
    } catch (error) {
      logger.info('🆕 Initializing new task queue');
      this.queue = [];
      await this.saveQueue();
    }
  }

  /**
   * Add task to queue without blocking
   */
  async addTask(task) {
    const enhancedTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...task,
      timestamp: Date.now(),
      status: 'pending',
      priority: task.priority || 'medium',
      type: task.type || 'component',
      estimatedTokens: this.estimateTokens(task),
      batchable: this.taskTypes[task.type]?.batchable ?? false
    };
    
    this.queue.push(enhancedTask);
    
    // Sort by priority
    this.queue.sort((a, b) => 
      this.priorities[a.priority] - this.priorities[b.priority]
    );
    
    await this.saveQueue();
    
    logger.info(`📝 Added task ${enhancedTask.id} (${enhancedTask.priority})`);
    return enhancedTask.id;
  }

  /**
   * Group similar tasks for batch execution
   */
  groupSimilarTasks(tasks) {
    const groups = {};
    
    for (const task of tasks) {
      if (!task.batchable) {
        // Non-batchable tasks go alone
        groups[task.id] = [task];
      } else {
        // Group by type
        const key = `${task.type}_${task.priority}`;
        if (!groups[key]) {
          groups[key] = [];
        }
        
        const maxBatch = this.taskTypes[task.type]?.maxBatch || 5;
        if (groups[key].length < maxBatch) {
          groups[key].push(task);
        } else {
          // Create new group if max reached
          groups[`${key}_${Date.now()}`] = [task];
        }
      }
    }
    
    return Object.values(groups);
  }

  /**
   * Execute a batch of tasks with Jules
   */
  async executeJulesGroup(group) {
    const isBatch = group.length > 1;
    
    logger.info(`🚀 Executing ${isBatch ? 'batch of ' + group.length : 'single'} task(s)`);
    
    if (isBatch) {
      // Create merged instruction for Jules
      const mergedInstruction = this.createBatchInstruction(group);
      
      // Simulate Jules execution (replace with actual Jules MCP call)
      logger.info(`📤 Sending to Jules: ${mergedInstruction.slice(0, 100)}...`);
      
      // Mark tasks as processing
      for (const task of group) {
        task.status = 'processing';
        task.batchId = `batch_${Date.now()}`;
      }
      
      // TODO: Actual Jules MCP integration here
      // const result = await callJulesMCP(mergedInstruction);
      
      // Simulate completion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark as completed
      for (const task of group) {
        task.status = 'completed';
        task.completedAt = Date.now();
      }
      
    } else {
      // Single task execution
      const task = group[0];
      task.status = 'processing';
      
      logger.info(`📤 Sending to Jules: ${task.instruction?.slice(0, 100) || task.type}`);
      
      // TODO: Actual Jules MCP call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      task.status = 'completed';
      task.completedAt = Date.now();
    }
    
    await this.saveQueue();
  }

  /**
   * Create optimized batch instruction for Jules
   */
  createBatchInstruction(tasks) {
    const type = tasks[0].type;
    
    const templates = {
      'component': `Create ${tasks.length} React components with TypeScript:
${tasks.map(t => `- ${t.name}: ${t.description}`).join('\n')}
Use shared base patterns and include Storybook stories.`,
      
      'test': `Generate comprehensive test suites for:
${tasks.map(t => `- ${t.target}: ${t.coverage || 'full coverage'}`).join('\n')}
Include unit tests, integration tests, and edge cases.`,
      
      'documentation': `Create technical documentation for:
${tasks.map(t => `- ${t.subject}: ${t.format || 'markdown'}`).join('\n')}
Include code examples and API references.`,
      
      'refactor': `Refactor the following code sections:
${tasks.map(t => `- ${t.file}: ${t.pattern}`).join('\n')}
Maintain backwards compatibility and add tests.`
    };
    
    return templates[type] || `Execute ${tasks.length} tasks of type ${type}`;
  }

  /**
   * Execute batch with available quota
   */
  async executeBatch(options = {}) {
    const { priority = null, maxRequests = 5 } = options;
    
    // Check daily reset
    if (this.lastReset !== new Date().toDateString()) {
      this.requestsToday = 0;
      this.lastReset = new Date().toDateString();
    }
    
    const availableRequests = Math.min(
      maxRequests,
      this.maxDailyRequests - this.requestsToday
    );
    
    if (availableRequests <= 0) {
      logger.warn('⚠️ Daily Jules quota exhausted');
      return { executed: 0, remaining: this.queue.filter(t => t.status === 'pending').length };
    }
    
    // Filter tasks by priority if specified
    let pendingTasks = this.queue.filter(t => t.status === 'pending');
    if (priority) {
      pendingTasks = pendingTasks.filter(t => t.priority === priority);
    }
    
    // Group tasks for batching
    const groups = this.groupSimilarTasks(pendingTasks);
    const groupsToExecute = groups.slice(0, availableRequests);
    
    logger.info(`🎯 Executing ${groupsToExecute.length} batch(es) with ${availableRequests} available requests`);
    
    let totalTasksExecuted = 0;
    for (const group of groupsToExecute) {
      await this.executeJulesGroup(group);
      this.requestsToday++;
      totalTasksExecuted += group.length;
    }
    
    await this.saveQueue();
    
    const remaining = this.queue.filter(t => t.status === 'pending').length;
    
    logger.info(`✅ Executed ${totalTasksExecuted} tasks using ${groupsToExecute.length} requests`);
    logger.info(`📊 Remaining in queue: ${remaining} tasks`);
    logger.info(`🎯 Jules requests today: ${this.requestsToday}/${this.maxDailyRequests}`);
    
    return { 
      executed: totalTasksExecuted, 
      requests: groupsToExecute.length,
      remaining 
    };
  }

  /**
   * Get queue status
   */
  async getStatus() {
    const stats = {
      total: this.queue.length,
      pending: this.queue.filter(t => t.status === 'pending').length,
      processing: this.queue.filter(t => t.status === 'processing').length,
      completed: this.queue.filter(t => t.status === 'completed').length,
      requestsToday: this.requestsToday,
      requestsAvailable: this.maxDailyRequests - this.requestsToday,
      byPriority: {},
      byType: {}
    };
    
    // Count by priority
    for (const priority of Object.keys(this.priorities)) {
      stats.byPriority[priority] = this.queue.filter(t => 
        t.priority === priority && t.status === 'pending'
      ).length;
    }
    
    // Count by type
    for (const type of Object.keys(this.taskTypes)) {
      stats.byType[type] = this.queue.filter(t => 
        t.type === type && t.status === 'pending'
      ).length;
    }
    
    return stats;
  }

  /**
   * Estimate tokens for a task
   */
  estimateTokens(task) {
    const baseTokens = {
      'component': 2000,
      'test': 1500,
      'documentation': 1000,
      'refactor': 2500,
      'bugfix': 1000,
      'deployment': 500
    };
    
    return baseTokens[task.type] || 1000;
  }

  /**
   * Save queue to file
   */
  async saveQueue() {
    const data = {
      queue: this.queue,
      requestsToday: this.requestsToday,
      lastReset: this.lastReset,
      timestamp: new Date().toISOString()
    };
    
    await fs.writeFile(this.queueFile, JSON.stringify(data, null, 2));
  }

  /**
   * Clear completed tasks
   */
  async clearCompleted() {
    const before = this.queue.length;
    this.queue = this.queue.filter(t => t.status !== 'completed');
    const removed = before - this.queue.length;
    
    await this.saveQueue();
    logger.info(`🧹 Cleared ${removed} completed tasks`);
    
    return removed;
  }
}

// CLI Interface
async function main() {
  const queue = new JulesTaskQueue();
  await queue.init();
  
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  switch (command) {
    case 'init':
      logger.info('✅ Queue initialized');
      break;
      
    case 'add':
      const task = {
        type: args[0] || 'component',
        name: args[1] || 'NewTask',
        priority: args[2] || 'medium',
        description: args[3] || 'Task description',
        instruction: args.slice(4).join(' ')
      };
      const id = await queue.addTask(task);
      logger.info(`✅ Task added: ${id}`);
      break;
      
    case 'execute':
      const priority = args.includes('--priority') ? 
        args[args.indexOf('--priority') + 1] : null;
      const max = args.includes('--max') ? 
        parseInt(args[args.indexOf('--max') + 1]) : 5;
      
      const result = await queue.executeBatch({ priority, maxRequests: max });
      logger.info(`✅ Execution complete: ${result.executed} tasks`);
      break;
      
    case 'status':
      const status = await queue.getStatus();
      console.log('\n📊 JULES TASK QUEUE STATUS');
      console.log('══════════════════════════════');
      console.log(`📦 Total tasks: ${status.total}`);
      console.log(`⏳ Pending: ${status.pending}`);
      console.log(`🔄 Processing: ${status.processing}`);
      console.log(`✅ Completed: ${status.completed}`);
      console.log(`\n🎯 Jules Requests:`);
      console.log(`   Used today: ${status.requestsToday}/15`);
      console.log(`   Available: ${status.requestsAvailable}`);
      console.log(`\n📊 Pending by Priority:`);
      Object.entries(status.byPriority).forEach(([p, c]) => {
        if (c > 0) console.log(`   ${p}: ${c}`);
      });
      console.log(`\n📁 Pending by Type:`);
      Object.entries(status.byType).forEach(([t, c]) => {
        if (c > 0) console.log(`   ${t}: ${c}`);
      });
      break;
      
    case 'clear':
      const cleared = await queue.clearCompleted();
      logger.info(`✅ Cleared ${cleared} completed tasks`);
      break;
      
    default:
      console.log(`
Jules Task Queue Manager

Commands:
  init                    Initialize queue
  add [type] [name] ...   Add task to queue
  execute [options]       Execute batch
    --priority [level]    Filter by priority
    --max [number]        Max requests to use
  status                  Show queue status
  clear                   Clear completed tasks

Examples:
  node jules-task-queue.js add component Button high "Create button component"
  node jules-task-queue.js execute --priority critical --max 3
  node jules-task-queue.js status
      `);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { JulesTaskQueue };