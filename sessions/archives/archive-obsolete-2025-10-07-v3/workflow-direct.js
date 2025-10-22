#!/usr/bin/env node

import { MCPTools } from './src/mcp/tools.js';
import { OrchestratorCore } from './src/orchestrator/core.js';
import { logger } from './src/utils/logger.js';

/**
 * 🚀 WORKFLOW DIRECT SANS MCP
 *
 * Alternative robuste qui bypass les problèmes MCP de Claude Code
 * en exposant directement les fonctionnalités d'Orchestra + Archon
 */

class WorkflowDirect {
  constructor() {
    this.orchestrator = null;
    this.tools = null;
  }

  async initialize() {
    logger.info('🚀 Initializing Direct Workflow (bypass MCP)...');

    // Initialize Orchestra Core
    this.orchestrator = new OrchestratorCore();
    await this.orchestrator.initialize();

    // Initialize MCP Tools (but used directly)
    this.tools = new MCPTools(this.orchestrator);

    logger.info('✅ Direct Workflow ready - Orchestra + Archon operational');
    return this;
  }

  /**
   * Start Hybrid Revolutionary Workflow directly
   */
  async startHybridWorkflow(projectDescription, constraints = [], archonProjectId = null) {
    return await this.tools.executeTool('orchestra:start_hybrid_workflow', {
      project_description: projectDescription,
      constraints: constraints,
      archon_project_id: archonProjectId
    });
  }

  /**
   * Enhanced project exploration with Gemini
   */
  async projectExploration(projectDescription, depth = 'standard') {
    return await this.tools.executeTool('orchestra:project_exploration', {
      project_description: projectDescription,
      exploration_depth: depth
    });
  }

  /**
   * Technical validation with Claude
   */
  async technicalValidation(projectDescription) {
    return await this.tools.executeTool('orchestra:technical_validation', {
      project_description: projectDescription
    });
  }

  /**
   * Get project status
   */
  async getProjectStatus(projectId) {
    return await this.tools.executeTool('orchestra:get_project_status', {
      project_id: projectId
    });
  }

  /**
   * Code review cycle
   */
  async codeReviewCycle(code, context) {
    return await this.tools.executeTool('orchestra:code_review_cycle', {
      code: code,
      context: context
    });
  }
}

// If called directly, provide CLI interface
if (process.argv[1] && process.argv[1].includes('workflow-direct.js')) {
  const workflow = new WorkflowDirect();
  await workflow.initialize();

  const command = process.argv[2];
  const args = process.argv.slice(3);

  switch (command) {
  case 'start':
    const description = args[0] || 'Test project description';
    const result = await workflow.startHybridWorkflow(description);
    console.log(JSON.stringify(result, null, 2));
    break;

  case 'explore':
    const projectDesc = args[0] || 'Test exploration';
    const exploreResult = await workflow.projectExploration(projectDesc);
    console.log(JSON.stringify(exploreResult, null, 2));
    break;

  default:
    console.log(`
🚀 WORKFLOW DIRECT - Usage:

node workflow-direct.js start "Project description"
node workflow-direct.js explore "Project for exploration"

Available methods:
- startHybridWorkflow(description, constraints, archonProjectId)
- projectExploration(description, depth)
- technicalValidation(description) 
- getProjectStatus(projectId)
- codeReviewCycle(code, context)
      `);
  }

  process.exit(0);
}

export { WorkflowDirect };
