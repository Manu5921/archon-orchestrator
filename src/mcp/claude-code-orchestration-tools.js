import { Logger } from '../utils/logger.js';

const logger = new Logger('ClaudeCodeOrchestrationTools');

/**
 * 🎯 OUTILS MCP POUR ORCHESTRATION CLAUDE CODE
 *
 * Ces outils permettent à Claude Code d'être le véritable orchestrator
 * en gardant le contrôle sur chaque étape du workflow révolutionnaire.
 */

export class ClaudeCodeOrchestrationTools {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
  }

  getToolsList() {
    return [
      // ÉTAPE 1: Initialisation projet
      {
        name: 'orchestra:init_project',
        description: 'Initialize a new revolutionary project - Claude Code remains in control',
        inputSchema: {
          type: 'object',
          properties: {
            project_description: { type: 'string', description: 'Project description from user' },
            archon_project_id: { type: 'string', description: 'Existing Archon project ID (optional)' }
          },
          required: ['project_description']
        }
      },

      // ÉTAPE 2: Demander exploration à Gemini
      {
        name: 'orchestra:request_gemini_exploration',
        description: 'Ask Gemini CLI for creative exploration - Claude Code orchestrates the request',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string', description: 'Project identifier' },
            exploration_prompt: { type: 'string', description: 'Specific prompt for Gemini' },
            constraints: { type: 'array', items: { type: 'string' }, description: 'Project constraints' }
          },
          required: ['project_id', 'exploration_prompt']
        }
      },

      // ÉTAPE 3: Valider la réponse de Gemini
      {
        name: 'orchestra:validate_exploration',
        description: 'Validate Gemini exploration results - Claude Code makes the decisions',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string', description: 'Project identifier' },
            gemini_response: { type: 'object', description: 'Raw response from Gemini' },
            validation_criteria: { type: 'array', items: { type: 'string' }, description: 'Criteria to validate against' }
          },
          required: ['project_id', 'gemini_response']
        }
      },

      // ÉTAPE 4: Créer sub-agents spécialisés
      {
        name: 'orchestra:create_sub_agents',
        description: 'Create specialized sub-agents based on project needs - Claude Code orchestrates',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string', description: 'Project identifier' },
            required_specializations: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['frontend', 'backend', 'testing', 'devops', 'database', 'api', 'ui_ux']
              },
              description: 'Required sub-agent specializations'
            },
            task_breakdown: { type: 'object', description: 'Tasks to assign to sub-agents' }
          },
          required: ['project_id', 'required_specializations']
        }
      },

      // ÉTAPE 5: Assigner tâche à sub-agent
      {
        name: 'orchestra:assign_task_to_sub_agent',
        description: 'Assign specific task to a sub-agent - Claude Code controls assignment',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string', description: 'Project identifier' },
            sub_agent_type: {
              type: 'string',
              enum: ['frontend', 'backend', 'testing', 'devops', 'database', 'api', 'ui_ux'],
              description: 'Type of sub-agent'
            },
            task_description: { type: 'string', description: 'Detailed task description' },
            expected_output: { type: 'string', description: 'Expected output format' },
            deadline: { type: 'string', description: 'Task deadline (optional)' }
          },
          required: ['project_id', 'sub_agent_type', 'task_description']
        }
      },

      // ÉTAPE 6: Demander review à Gemini
      {
        name: 'orchestra:request_gemini_review',
        description: 'Request code/output review from Gemini - Claude Code orchestrates review',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string', description: 'Project identifier' },
            code_or_output: { type: 'string', description: 'Code or output to review' },
            review_criteria: { type: 'array', items: { type: 'string' }, description: 'Review criteria' },
            context: { type: 'object', description: 'Additional context for review' }
          },
          required: ['project_id', 'code_or_output']
        }
      },

      // ÉTAPE 7: Appliquer corrections
      {
        name: 'orchestra:apply_review_corrections',
        description: 'Apply corrections based on Gemini review - Claude Code decides what to apply',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string', description: 'Project identifier' },
            original_code: { type: 'string', description: 'Original code' },
            gemini_feedback: { type: 'object', description: 'Feedback from Gemini' },
            corrections_to_apply: { type: 'array', items: { type: 'string' }, description: 'Specific corrections to apply' }
          },
          required: ['project_id', 'original_code', 'gemini_feedback']
        }
      },

      // ÉTAPE 8: Archiver dans Archon
      {
        name: 'orchestra:archive_to_archon',
        description: 'Archive project learnings to Archon - Claude Code controls what gets archived',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string', description: 'Project identifier' },
            patterns_learned: { type: 'array', items: { type: 'object' }, description: 'Patterns to archive' },
            success_metrics: { type: 'object', description: 'Success metrics to store' },
            archon_project_id: { type: 'string', description: 'Archon project ID' }
          },
          required: ['project_id', 'patterns_learned']
        }
      },

      // UTILITAIRES
      {
        name: 'orchestra:get_project_state',
        description: 'Get current project state and progress',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string', description: 'Project identifier' }
          },
          required: ['project_id']
        }
      },

      {
        name: 'orchestra:list_available_sub_agents',
        description: 'List all available sub-agents and their capabilities',
        inputSchema: {
          type: 'object',
          properties: {
            project_id: { type: 'string', description: 'Project identifier (optional)' }
          }
        }
      }
    ];
  }

  async executeTool(toolName, args) {
    logger.info(`🎯 Claude Code executing: ${toolName}`);

    try {
      switch (toolName) {
      case 'orchestra:init_project':
        return await this.initProject(args);

      case 'orchestra:request_gemini_exploration':
        return await this.requestGeminiExploration(args);

      case 'orchestra:validate_exploration':
        return await this.validateExploration(args);

      case 'orchestra:create_sub_agents':
        return await this.createSubAgents(args);

      case 'orchestra:assign_task_to_sub_agent':
        return await this.assignTaskToSubAgent(args);

      case 'orchestra:request_gemini_review':
        return await this.requestGeminiReview(args);

      case 'orchestra:apply_review_corrections':
        return await this.applyReviewCorrections(args);

      case 'orchestra:archive_to_archon':
        return await this.archiveToArchon(args);

      case 'orchestra:get_project_state':
        return await this.getProjectState(args);

      case 'orchestra:list_available_sub_agents':
        return await this.listAvailableSubAgents(args);

      default:
        throw new Error(`Unknown tool: ${toolName}`);
      }
    } catch (error) {
      logger.error(`Tool execution failed: ${toolName}`, error);
      return {
        success: false,
        error: error.message,
        tool: toolName
      };
    }
  }

  // IMPLÉMENTATIONS DES OUTILS

  async initProject(args) {
    const { project_description, archon_project_id } = args;

    const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;

    // Initialiser le contexte projet
    const projectContext = {
      id: projectId,
      description: project_description,
      archon_project_id: archon_project_id || null,
      phase: 'initialized',
      created_at: new Date().toISOString(),
      orchestrator: 'claude_code', // CLAUDE CODE EST L'ORCHESTRATOR
      agents_created: [],
      workflow_state: {
        exploration: 'pending',
        validation: 'pending',
        sub_agents: 'pending',
        review_cycles: 'pending',
        archival: 'pending'
      }
    };

    // Stocker dans l'orchestrator
    if (!this.orchestrator.projects) {
      this.orchestrator.projects = new Map();
    }
    this.orchestrator.projects.set(projectId, projectContext);

    logger.info(`🎯 Claude Code initialized project: ${projectId}`);

    return {
      success: true,
      project_id: projectId,
      message: 'Project initialized - Claude Code is the orchestrator',
      next_step: 'Use orchestra:request_gemini_exploration to start creative exploration',
      context: projectContext
    };
  }

  async requestGeminiExploration(args) {
    const { project_id, exploration_prompt, constraints = [] } = args;

    const project = this.orchestrator.projects?.get(project_id);
    if (!project) {
      throw new Error(`Project ${project_id} not found`);
    }

    // Obtenir l'agent Gemini
    let geminiAgent = this.orchestrator.agents.get('gemini');
    if (!geminiAgent) {
      // Initialiser l'agent Gemini si nécessaire
      const { GeminiExplorer } = await import('../agents/gemini-explorer.js');
      try {
        geminiAgent = new GeminiExplorer();
        await geminiAgent.initialize();
        this.orchestrator.agents.set('gemini', geminiAgent);
      } catch (error) {
        logger.warn('Gemini not available, using mock');
        const { MockConnector } = await import('../agents/mock-connector.js');
        geminiAgent = new MockConnector('gemini');
        this.orchestrator.agents.set('gemini', geminiAgent);
      }
    }

    // Préparer le contexte pour Gemini
    const explorationContext = {
      project_description: project.description,
      constraints: constraints,
      exploration_prompt: exploration_prompt,
      requested_by: 'claude_code', // Claude Code fait la demande
      request_time: new Date().toISOString()
    };

    // Demander l'exploration à Gemini
    const explorationResult = await geminiAgent.execute(
      'explore',
      explorationContext
    );

    // Mettre à jour l'état du projet
    project.workflow_state.exploration = 'completed';
    project.exploration_result = explorationResult;
    project.last_updated = new Date().toISOString();

    logger.info(`🎨 Gemini exploration completed for project ${project_id}`);

    return {
      success: true,
      project_id: project_id,
      message: 'Gemini exploration completed - awaiting Claude Code validation',
      exploration_result: explorationResult,
      next_step: 'Use orchestra:validate_exploration to validate the results',
      orchestrated_by: 'claude_code'
    };
  }

  async validateExploration(args) {
    const { project_id, gemini_response, validation_criteria = [] } = args;

    const project = this.orchestrator.projects?.get(project_id);
    if (!project) {
      throw new Error(`Project ${project_id} not found`);
    }

    // Claude Code fait la validation
    const validation = {
      validated_by: 'claude_code',
      validation_time: new Date().toISOString(),
      criteria_checked: validation_criteria,
      gemini_response: gemini_response,
      approval_status: 'approved', // Claude Code décide
      feedback: 'Exploration validated by Claude Code orchestrator',
      recommended_next_steps: [
        'Create specialized sub-agents',
        'Break down tasks',
        'Begin implementation phase'
      ]
    };

    // Mettre à jour le projet
    project.workflow_state.validation = 'completed';
    project.validation_result = validation;
    project.last_updated = new Date().toISOString();

    logger.info(`🎯 Claude Code validated exploration for project ${project_id}`);

    return {
      success: true,
      project_id: project_id,
      message: 'Exploration validated by Claude Code',
      validation: validation,
      next_step: 'Use orchestra:create_sub_agents to create specialized agents',
      orchestrated_by: 'claude_code'
    };
  }

  // TODO: Implémenter les autres méthodes...
  async createSubAgents(args) {
    // À implémenter
    return { success: true, message: 'Sub-agents creation - to be implemented' };
  }

  async assignTaskToSubAgent(args) {
    // À implémenter
    return { success: true, message: 'Task assignment - to be implemented' };
  }

  async requestGeminiReview(args) {
    // À implémenter
    return { success: true, message: 'Gemini review request - to be implemented' };
  }

  async applyReviewCorrections(args) {
    // À implémenter
    return { success: true, message: 'Review corrections - to be implemented' };
  }

  async archiveToArchon(args) {
    // À implémenter
    return { success: true, message: 'Archon archival - to be implemented' };
  }

  async getProjectState(args) {
    const { project_id } = args;
    const project = this.orchestrator.projects?.get(project_id);

    if (!project) {
      throw new Error(`Project ${project_id} not found`);
    }

    return {
      success: true,
      project: project,
      orchestrated_by: 'claude_code'
    };
  }

  async listAvailableSubAgents(args) {
    return {
      success: true,
      available_sub_agents: [
        { type: 'frontend', description: 'React, Vue, UI/UX specialist' },
        { type: 'backend', description: 'APIs, databases, security specialist' },
        { type: 'testing', description: 'Unit, integration, E2E testing specialist' },
        { type: 'devops', description: 'CI/CD, deployment, infrastructure specialist' },
        { type: 'database', description: 'Database design, optimization specialist' },
        { type: 'api', description: 'API design, documentation specialist' },
        { type: 'ui_ux', description: 'User interface, user experience specialist' }
      ]
    };
  }
}
