import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import { logger } from '../utils/logger.js';

/**
 * Claude Orchestrator - Advanced multi-tasking agent coordinator
 * Specialized for project leadership, task breakdown, and sub-agent management
 */
export class ClaudeOrchestrator extends EventEmitter {
  constructor() {
    super();
    this.healthy = false;
    this.contexts = new Map();
    this.subAgents = new Map();
    this.activeProjects = new Map();
  }
  
  async healthCheck() {
    try {
      const testProcess = spawn('claude', ['--version'], {
        timeout: 5000,
        shell: true
      });
      
      return new Promise((resolve) => {
        let output = '';
        
        testProcess.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        testProcess.on('close', (code) => {
          if (code === 0 && output.includes('claude')) {
            this.healthy = true;
            resolve({
              healthy: true,
              version: output.trim(),
              message: 'Claude Orchestrator available',
              capabilities: ['orchestration', 'validation', 'sub_agent_management', 'code_generation']
            });
          } else {
            resolve({
              healthy: false,
              error: 'Claude CLI not found or not working'
            });
          }
        });
        
        testProcess.on('error', (err) => {
          resolve({
            healthy: false,
            error: `Claude CLI error: ${err.message}`
          });
        });
        
        setTimeout(() => {
          testProcess.kill();
          resolve({
            healthy: false,
            error: 'Claude CLI health check timeout'
          });
        }, 5000);
      });
    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }
  
  /**
   * Validate and plan project from Gemini exploration
   */
  async validateProject(projectId, exploration) {
    logger.info(`🎯 Claude validating project ${projectId}`);
    
    const validationPrompt = this.buildValidationPrompt(exploration);
    
    const result = await this.execute(
      `${projectId}_validation`,
      'validate',
      [validationPrompt],
      { mode: 'technical_analysis', depth: 'comprehensive' }
    );
    
    if (result.success) {
      const validation = this.parseValidationResult(result.output);
      this.contexts.set(`${projectId}_validation`, validation);
      
      logger.info(`✅ Project validation completed: ${validation.tasks?.length || 0} tasks identified`);
      
      return {
        success: true,
        validation,
        confidence: this.calculateValidationConfidence(validation)
      };
    }
    
    return { success: false, error: result.error };
  }
  
  /**
   * Create and manage specialized sub-agents with advanced orchestration
   */
  async orchestrateProject(projectId, validation) {
    logger.info(`🎼 Starting advanced project orchestration: ${projectId}`);
    
    try {
      // Initialize sub-agent manager if not exists
      if (!this.subAgentManager) {
        const { SubAgentManager } = await import('./sub-agents/specialized-agents.js');
        this.subAgentManager = new SubAgentManager(this.agentId || projectId);
        
        // Listen to sub-agent events
        this.subAgentManager.on('sub_agent_task_completed', (event) => {
          logger.info(`✅ Sub-agent task completed: ${event.task_id} by ${event.agent_id}`);
          this.emit('sub_task_completed', event);
        });
      }
      
      const orchestration = {
        project_id: projectId,
        validation_input: validation,
        sub_agents: new Map(),
        execution_plan: [],
        status: 'orchestrated',
        manager: this.subAgentManager
      };
      
      // Determine required sub-agent types based on validation
      const requiredAgents = this._determineRequiredAgents(validation);
      logger.info(`🤖 Creating ${requiredAgents.length} specialized sub-agents: ${requiredAgents.join(', ')}`);
      
      // Create specialized sub-agents
      for (const agentType of requiredAgents) {
        const subAgent = await this.subAgentManager.createSubAgent(agentType, {
          project_id: projectId,
          requirements: validation.requirements || {},
          tasks: validation.tasks || []
        });
        
        orchestration.sub_agents.set(subAgent.id, {
          id: subAgent.id,
          type: agentType,
          status: 'ready',
          capabilities: subAgent.capabilities,
          performance: subAgent.performance_metrics
        });
        
        logger.info(`🎯 Created ${agentType} sub-agent: ${subAgent.id}`);
      }
      
      // Create advanced execution plan with parallel task support
      orchestration.execution_plan = this._createAdvancedExecutionPlan(validation, orchestration.sub_agents);
      
      // Store orchestration state
      this.activeProjects.set(projectId, orchestration);
      
      logger.info(`✅ Advanced orchestration complete: ${orchestration.sub_agents.size} sub-agents, ${orchestration.execution_plan.length} execution steps`);
      
      return orchestration;
      
    } catch (error) {
      logger.error(`❌ Project orchestration failed: ${projectId}`, error);
      throw error;
    }
  }
  
  /**
   * Execute task with appropriate sub-agent
   */
  async executeTaskWithSubAgent(projectId, taskId, subAgentType) {
    logger.info(`⚡ Executing task ${taskId} with ${subAgentType} sub-agent`);
    
    const subAgent = this.subAgents.get(`${projectId}_${subAgentType}`);
    if (!subAgent) {
      throw new Error(`Sub-agent ${subAgentType} not found for project ${projectId}`);
    }
    
    const task = await this.getTask(projectId, taskId);
    const context = this.contexts.get(`${projectId}_${subAgentType}`) || {};
    
    // Generate specialized prompt for sub-agent
    const subAgentPrompt = this.buildSubAgentPrompt(task, subAgent.specialization, context);
    
    const result = await this.execute(
      `${projectId}_${taskId}`,
      'implement',
      [subAgentPrompt],
      { 
        mode: subAgent.mode,
        specialization: subAgent.specialization,
        context: context
      }
    );
    
    if (result.success) {
      // Update sub-agent context
      context.completed_tasks = context.completed_tasks || [];
      context.completed_tasks.push({
        task_id: taskId,
        result: result.output,
        timestamp: new Date().toISOString()
      });
      this.contexts.set(`${projectId}_${subAgentType}`, context);
      
      this.emit('task_completed', { 
        projectId, 
        taskId, 
        subAgentType, 
        result: result.output 
      });
    }
    
    return result;
  }
  
  /**
   * Adjust code based on Gemini review feedback
   */
  async adjustCodeFromReview(projectId, taskId, code, reviewFeedback) {
    logger.info(`🔧 Claude adjusting code for task ${taskId} based on review`);
    
    const adjustmentPrompt = `
Please adjust this code based on the review feedback:

ORIGINAL CODE:
${code}

REVIEW FEEDBACK:
${reviewFeedback.join('\n')}

Please provide the improved code that addresses all the feedback points.
Focus on code quality, best practices, and the specific suggestions made.
`;
    
    const result = await this.execute(
      `${projectId}_${taskId}_adjustment`,
      'adjust',
      [adjustmentPrompt],
      { mode: 'code_improvement', focus: 'review_feedback' }
    );
    
    return result;
  }
  
  /**
   * Generate project deliverables summary
   */
  async generateProjectDeliverables(projectId) {
    logger.info(`📦 Generating deliverables for project ${projectId}`);
    
    const orchestration = this.activeProjects.get(projectId);
    if (!orchestration) {
      throw new Error(`Project ${projectId} not found`);
    }
    
    const deliverables = [];
    
    // Collect outputs from all sub-agents
    for (const [subAgentType, subAgent] of orchestration.sub_agents) {
      const context = this.contexts.get(`${projectId}_${subAgentType}`);
      if (context?.completed_tasks) {
        for (const completedTask of context.completed_tasks) {
          deliverables.push({
            type: subAgentType,
            task_id: completedTask.task_id,
            content: completedTask.result,
            timestamp: completedTask.timestamp
          });
        }
      }
    }
    
    // Generate project summary
    const summaryPrompt = `
Generate a comprehensive project summary based on these deliverables:

${deliverables.map(d => `${d.type}: ${d.task_id}\n${d.content}\n---`).join('\n')}

Please provide:
1. Project overview
2. Key features implemented
3. Architecture decisions
4. Technology stack used
5. Deployment instructions
6. Future recommendations
`;
    
    const summary = await this.execute(
      `${projectId}_summary`,
      'summarize',
      [summaryPrompt],
      { mode: 'project_summary' }
    );
    
    return {
      deliverables,
      summary: summary.output,
      project_id: projectId,
      generated_at: new Date().toISOString()
    };
  }
  
  // Core execution method
  async execute(taskId, command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      logger.debug(`Claude Orchestrator executing: ${taskId} - ${command}`);
      
      // Build enhanced prompt based on options
      const enhancedArgs = this.enhanceArgsWithOptions(args, options);
      
      const claudeProcess = spawn('claude', [command, ...enhancedArgs], {
        shell: true,
        env: {
          ...process.env,
          ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
          CLAUDE_MODE: options.mode || 'standard'
        }
      });
      
      let stdout = '';
      let stderr = '';
      
      claudeProcess.stdout.on('data', (data) => {
        stdout += data.toString();
        this.emit('output', { taskId, data: data.toString(), stream: 'stdout' });
      });
      
      claudeProcess.stderr.on('data', (data) => {
        stderr += data.toString();
        this.emit('output', { taskId, data: data.toString(), stream: 'stderr' });
      });
      
      claudeProcess.on('close', (code) => {
        const duration = Date.now() - startTime;
        
        if (code === 0) {
          resolve({
            success: true,
            output: stdout,
            duration_ms: duration,
            mode: options.mode
          });
        } else {
          resolve({
            success: false,
            output: stdout,
            error: stderr,
            duration_ms: duration
          });
        }
      });
      
      claudeProcess.on('error', (err) => {
        reject(err);
      });
    });
  }
  
  // Helper methods
  buildValidationPrompt(exploration) {
    return `
As a technical lead, validate this project exploration and create an implementation plan:

EXPLORATION RESULTS:
${JSON.stringify(exploration, null, 2)}

Please provide:
1. Technical validation of the selected approach
2. Detailed architecture design
3. Specific development tasks breakdown
4. Task dependencies and priority ordering
5. Technology stack recommendations
6. Implementation timeline
7. Risk assessment and mitigation strategies

Focus on creating actionable tasks that can be assigned to specialized sub-agents.
`;
  }
  
  parseValidationResult(output) {
    // Enhanced parsing with better task extraction
    const validation = {
      approach: this.extractSection(output, 'approach'),
      architecture: this.extractSection(output, 'architecture'),
      tasks: this.extractTasks(output),
      dependencies: this.extractDependencies(output),
      timeline: this.extractTimeline(output),
      risks: this.extractRisks(output)
    };
    
    return validation;
  }
  
  extractTasks(text) {
    const tasks = [];
    const lines = text.split('\n');
    let taskId = 1;
    
    for (const line of lines) {
      if (this.isTaskLine(line)) {
        tasks.push({
          id: `task_${taskId}`,
          name: line.replace(/^\d+\.\s*/, '').trim(),
          type: this.inferTaskType(line),
          priority: this.inferPriority(line),
          estimated_hours: this.inferHours(line)
        });
        taskId++;
      }
    }
    
    return tasks.length > 0 ? tasks : this.getDefaultTasks();
  }
  
  isTaskLine(line) {
    return /^\d+\.|^-\s|^create|^implement|^develop|^build|^setup/i.test(line.trim());
  }
  
  inferTaskType(line) {
    const text = line.toLowerCase();
    if (text.includes('frontend') || text.includes('ui') || text.includes('interface')) return 'frontend';
    if (text.includes('backend') || text.includes('api') || text.includes('database') || text.includes('server')) return 'backend';
    if (text.includes('test') || text.includes('quality') || text.includes('validation')) return 'testing';
    if (text.includes('deploy') || text.includes('ci') || text.includes('cd') || text.includes('devops')) return 'devops';
    return 'general';
  }
  
  inferPriority(line) {
    const text = line.toLowerCase();
    if (text.includes('critical') || text.includes('essential') || text.includes('core')) return 1;
    if (text.includes('important') || text.includes('main')) return 2;
    return 3;
  }
  
  inferHours(line) {
    const hourMatches = line.match(/(\d+)\s*(?:hours?|hrs?|h)\b/i);
    if (hourMatches) return parseInt(hourMatches[1]);
    
    // Estimate based on task complexity
    const text = line.toLowerCase();
    if (text.includes('setup') || text.includes('configure')) return 4;
    if (text.includes('implement') || text.includes('develop')) return 16;
    if (text.includes('design') || text.includes('architect')) return 12;
    if (text.includes('test') || text.includes('validate')) return 8;
    return 8;
  }
  
  getDefaultTasks() {
    return [
      { id: 'task_1', name: 'Project setup and configuration', type: 'general', priority: 1, estimated_hours: 4 },
      { id: 'task_2', name: 'Backend API development', type: 'backend', priority: 1, estimated_hours: 16 },
      { id: 'task_3', name: 'Frontend user interface', type: 'frontend', priority: 2, estimated_hours: 16 },
      { id: 'task_4', name: 'Integration testing', type: 'testing', priority: 2, estimated_hours: 8 },
      { id: 'task_5', name: 'Deployment setup', type: 'devops', priority: 3, estimated_hours: 6 }
    ];
  }
  
  extractSection(text, sectionName) {
    const regex = new RegExp(`${sectionName}:?([\\s\\S]*?)(?:\\n\\n|\\n[A-Z]|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }
  
  extractDependencies(text) {
    const deps = {};
    const depRegex = /task_(\d+).*depends.*task_(\d+)/gi;
    let match;
    
    while ((match = depRegex.exec(text)) !== null) {
      const taskId = `task_${match[1]}`;
      const depId = `task_${match[2]}`;
      if (!deps[taskId]) deps[taskId] = [];
      deps[taskId].push(depId);
    }
    
    return deps;
  }
  
  extractTimeline(text) {
    const timeMatches = text.match(/(\d+)\s*(weeks?|months?|days?)/gi);
    return timeMatches ? timeMatches.join(', ') : '4-6 weeks';
  }
  
  extractRisks(text) {
    const risks = [];
    const riskSentences = text.split(/[.!?]+/);
    
    for (const sentence of riskSentences) {
      if (/risk|challenge|difficult|concern|problem/i.test(sentence)) {
        risks.push(sentence.trim());
      }
    }
    
    return risks;
  }
  
  calculateValidationConfidence(validation) {
    let confidence = 50;
    
    if (validation.tasks?.length > 0) confidence += 20;
    if (validation.architecture) confidence += 15;
    if (validation.timeline) confidence += 10;
    if (validation.risks?.length > 0) confidence += 5;
    
    return Math.min(confidence, 95);
  }
  
  determineSubAgentType(task) {
    return task.type || 'general';
  }
  
  async createSubAgent(projectId, type, task) {
    const specializations = {
      frontend: {
        mode: 'ui_development',
        focus: ['React', 'Vue', 'Angular', 'CSS', 'JavaScript', 'TypeScript', 'responsive design'],
        prompt_prefix: 'As a frontend specialist focusing on modern UI/UX development:'
      },
      backend: {
        mode: 'api_development', 
        focus: ['Node.js', 'Python', 'REST APIs', 'GraphQL', 'databases', 'authentication'],
        prompt_prefix: 'As a backend specialist focusing on robust server-side development:'
      },
      testing: {
        mode: 'quality_assurance',
        focus: ['unit testing', 'integration testing', 'test automation', 'quality assurance'],
        prompt_prefix: 'As a testing specialist focusing on comprehensive quality assurance:'
      },
      devops: {
        mode: 'deployment_automation',
        focus: ['CI/CD', 'Docker', 'Kubernetes', 'cloud deployment', 'monitoring'],
        prompt_prefix: 'As a DevOps specialist focusing on deployment and infrastructure:'
      },
      general: {
        mode: 'general_development',
        focus: ['project setup', 'configuration', 'general development tasks'],
        prompt_prefix: 'As a general development specialist:'
      }
    };
    
    const spec = specializations[type] || specializations.general;
    
    return {
      id: `${projectId}_${type}_${Date.now()}`,
      type,
      specialization: spec.focus,
      mode: spec.mode,
      prompt_prefix: spec.prompt_prefix,
      created_at: new Date().toISOString(),
      tasks_completed: 0
    };
  }
  
  buildExecutionPlan(tasks) {
    // Sort by priority and dependencies
    return tasks
      .sort((a, b) => a.priority - b.priority)
      .map((task, index) => ({
        step: index + 1,
        task_id: task.id,
        task_name: task.name,
        task_type: task.type,
        estimated_duration: task.estimated_hours
      }));
  }

  /**
   * Determine required sub-agent types based on validation
   */
  _determineRequiredAgents(validation) {
    const requiredTypes = new Set(['general']); // Always need general agent
    
    // Analyze tasks to determine specialized agents needed
    if (validation.tasks && validation.tasks.length > 0) {
      for (const task of validation.tasks) {
        if (task.type) {
          requiredTypes.add(task.type);
        } else {
          // Infer type from task name/description
          const taskText = (task.name || task.description || '').toLowerCase();
          
          if (taskText.includes('frontend') || taskText.includes('ui') || taskText.includes('interface') || taskText.includes('react') || taskText.includes('vue')) {
            requiredTypes.add('frontend');
          }
          if (taskText.includes('backend') || taskText.includes('api') || taskText.includes('database') || taskText.includes('server')) {
            requiredTypes.add('backend');
          }
          if (taskText.includes('test') || taskText.includes('quality') || taskText.includes('validation')) {
            requiredTypes.add('testing');
          }
          if (taskText.includes('deploy') || taskText.includes('ci') || taskText.includes('cd') || taskText.includes('devops') || taskText.includes('infrastructure')) {
            requiredTypes.add('devops');
          }
        }
      }
    }

    // Analyze architecture/technology stack for additional agents
    const architecture = validation.architecture || validation.approach || '';
    const archText = architecture.toLowerCase();
    
    if (archText.includes('frontend') || archText.includes('spa') || archText.includes('react') || archText.includes('vue') || archText.includes('angular')) {
      requiredTypes.add('frontend');
    }
    if (archText.includes('backend') || archText.includes('api') || archText.includes('database') || archText.includes('microservices')) {
      requiredTypes.add('backend');
    }
    if (archText.includes('testing') || archText.includes('ci/cd') || archText.includes('quality')) {
      requiredTypes.add('testing');
    }
    if (archText.includes('deployment') || archText.includes('cloud') || archText.includes('container') || archText.includes('kubernetes')) {
      requiredTypes.add('devops');
    }

    // Remove general if we have specific agents
    if (requiredTypes.size > 1) {
      requiredTypes.delete('general');
    }

    return Array.from(requiredTypes).filter(type => 
      ['frontend', 'backend', 'testing', 'devops'].includes(type)
    );
  }

  /**
   * Create advanced execution plan with parallel task support
   */
  _createAdvancedExecutionPlan(validation, subAgents) {
    const tasks = validation.tasks || this._getDefaultValidationTasks();
    const plan = [];
    
    // Group tasks by dependency level and type
    const taskGroups = this._groupTasksByDependencies(tasks);
    
    let stepCounter = 1;
    for (const group of taskGroups) {
      if (group.length === 1) {
        // Single task
        plan.push({
          step: stepCounter++,
          type: 'sequential',
          task_id: group[0].id,
          task_name: group[0].name,
          agent_type: group[0].type || 'frontend',
          estimated_duration: group[0].estimated_hours || 8,
          dependencies: group[0].dependencies || []
        });
      } else {
        // Parallel tasks
        plan.push({
          step: stepCounter++,
          type: 'parallel',
          tasks: group.map(task => ({
            task_id: task.id,
            task_name: task.name,
            agent_type: task.type || 'frontend',
            estimated_duration: task.estimated_hours || 8,
            dependencies: task.dependencies || []
          })),
          total_estimated_duration: Math.max(...group.map(t => t.estimated_hours || 8))
        });
      }
    }
    
    return plan;
  }

  /**
   * Group tasks by dependencies for parallel execution
   */
  _groupTasksByDependencies(tasks) {
    // Simple grouping - can be enhanced with actual dependency analysis
    const groups = [];
    const processed = new Set();
    
    // Group by priority level
    const priorityLevels = [...new Set(tasks.map(t => t.priority || 3))].sort();
    
    for (const priority of priorityLevels) {
      const priorityTasks = tasks.filter(t => 
        (t.priority || 3) === priority && !processed.has(t.id)
      );
      
      if (priorityTasks.length > 0) {
        // Split into groups that can run in parallel (same type = sequential, different type = parallel)
        const typeGroups = {};
        for (const task of priorityTasks) {
          const type = task.type || 'frontend';
          if (!typeGroups[type]) typeGroups[type] = [];
          typeGroups[type].push(task);
        }
        
        // Add each type group as a separate group (for parallel execution across types)
        for (const [type, typeTasks] of Object.entries(typeGroups)) {
          groups.push(typeTasks);
          typeTasks.forEach(t => processed.add(t.id));
        }
      }
    }
    
    return groups;
  }

  /**
   * Get default tasks when validation doesn't provide specific ones
   */
  _getDefaultValidationTasks() {
    return [
      { 
        id: 'task_1', 
        name: 'Project setup and configuration', 
        type: 'devops', 
        priority: 1, 
        estimated_hours: 4 
      },
      { 
        id: 'task_2', 
        name: 'Backend API development', 
        type: 'backend', 
        priority: 1, 
        estimated_hours: 16 
      },
      { 
        id: 'task_3', 
        name: 'Frontend user interface', 
        type: 'frontend', 
        priority: 2, 
        estimated_hours: 16 
      },
      { 
        id: 'task_4', 
        name: 'Integration testing', 
        type: 'testing', 
        priority: 2, 
        estimated_hours: 8 
      },
      { 
        id: 'task_5', 
        name: 'Deployment setup', 
        type: 'devops', 
        priority: 3, 
        estimated_hours: 6 
      }
    ];
  }
  
  buildSubAgentPrompt(task, specialization, context) {
    const specializationArea = Array.isArray(specialization) ? specialization.join(', ') : specialization;
    const contextInfo = context.completed_tasks ? 
      `\nCONTEXT FROM PREVIOUS TASKS:\n${context.completed_tasks.map(ct => `- ${ct.task_id}: Completed`).join('\n')}` : '';
    
    return `
${this.getSubAgentPromptPrefix(task.type)}

TASK: ${task.name}
SPECIALIZATION FOCUS: ${specializationArea}
ESTIMATED EFFORT: ${task.estimated_hours || 8} hours

${contextInfo}

Please provide:
1. Detailed implementation approach
2. Code structure and organization
3. Key components/modules needed
4. Dependencies and integrations
5. Testing considerations
6. Best practices specific to ${specializationArea}

Deliver production-ready, well-documented code that follows industry best practices.
`;
  }
  
  getSubAgentPromptPrefix(taskType) {
    const prefixes = {
      frontend: 'As a frontend specialist focusing on modern UI/UX development:',
      backend: 'As a backend specialist focusing on robust server-side development:',
      testing: 'As a testing specialist focusing on comprehensive quality assurance:',
      devops: 'As a DevOps specialist focusing on deployment and infrastructure:',
      general: 'As a general development specialist:'
    };
    
    return prefixes[taskType] || prefixes.general;
  }
  
  enhanceArgsWithOptions(args, options) {
    const enhanced = [...args];
    
    if (options.mode) {
      enhanced.push('--mode', options.mode);
    }
    
    if (options.specialization) {
      enhanced.push('--focus', Array.isArray(options.specialization) ? 
        options.specialization.join(',') : options.specialization);
    }
    
    return enhanced;
  }
  
  async getTask(projectId, taskId) {
    const orchestration = this.activeProjects.get(projectId);
    return orchestration?.execution_plan.find(step => step.task_id === taskId);
  }
  
  async exportContext(taskId) {
    const context = this.contexts.get(taskId) || {};
    
    return {
      agent: 'claude_orchestrator',
      task_id: taskId,
      active_projects: this.activeProjects.size,
      sub_agents: this.subAgents.size,
      orchestration_data: context,
      timestamp: new Date().toISOString()
    };
  }
  
  async importContext(taskId, context) {
    this.contexts.set(taskId, {
      ...context,
      imported_from: context.previous_agent,
      imported_at: new Date().toISOString()
    });
    
    logger.debug(`Claude Orchestrator imported context for task ${taskId}`);
    return { success: true };
  }
  
  async syncContext(contextType, data) {
    logger.debug(`Claude Orchestrator syncing ${contextType} context`);
    this.contexts.set(`sync_${contextType}`, data);
    return { success: true };
  }
  
  async close() {
    this.contexts.clear();
    this.subAgents.clear();
    this.activeProjects.clear();
    logger.debug('Claude Orchestrator closed');
  }
}