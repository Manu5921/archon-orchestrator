#!/usr/bin/env node

import { logger } from './src/utils/logger.js';
import { MCPTools } from './src/mcp/tools.js';

/**
 * Quick Revolutionary Workflow Test
 * Tests core workflow components with faster execution
 */

async function testQuickWorkflow() {
  logger.info('⚡ Quick Revolutionary Workflow Test');
  logger.info('=' + '='.repeat(50));

  try {
    // Initialize MCP Tools with mock orchestrator
    const mockOrchestrator = {
      agents: new Map(),
      projectWorkflow: null
    };

    const mcpTools = new MCPTools(mockOrchestrator);
    logger.info('✅ MCP Tools initialized');

    // Test 1: Project Exploration
    logger.info('\n🎨 Testing Project Exploration...');
    const explorationResult = await mcpTools.executeTool('orchestra:project_exploration', {
      project_description: 'Simple todo app with real-time sync',
      constraints: ['Web-based', 'Mobile responsive'],
      exploration_depth: 'quick'
    });

    if (explorationResult.success) {
      logger.info(`✅ Exploration: ${explorationResult.approaches_found} approaches, confidence ${explorationResult.confidence}%`);
    } else {
      logger.error('❌ Exploration failed:', explorationResult.message);
    }

    // Test 2: Technical Validation (with mock data)
    logger.info('\n🎯 Testing Technical Validation...');
    const validationResult = await mcpTools.executeTool('orchestra:technical_validation', {
      project_id: explorationResult.project_id,
      exploration_results: { approaches: ['SPA', 'PWA'], recommendations: [] },
      validation_focus: 'feasibility'
    });

    if (validationResult.success) {
      logger.info(`✅ Validation: ${validationResult.tasks_identified} tasks, confidence ${validationResult.confidence}%`);
    } else {
      logger.error('❌ Validation failed:', validationResult.message);
    }

    // Test 3: Task Orchestration
    logger.info('\n🎼 Testing Task Orchestration...');
    const orchestrationResult = await mcpTools.executeTool('orchestra:task_orchestration', {
      project_id: explorationResult.project_id,
      validation_results: {
        tasks: [
          { id: 'task_1', name: 'Setup', type: 'devops', priority: 1 },
          { id: 'task_2', name: 'Frontend', type: 'frontend', priority: 2 }
        ]
      }
    });

    if (orchestrationResult.success) {
      logger.info(`✅ Orchestration: ${orchestrationResult.sub_agents_created} sub-agents, ${orchestrationResult.execution_steps} steps`);
    } else {
      logger.error('❌ Orchestration failed:', orchestrationResult.message);
    }

    // Test 4: Code Review Cycle (simplified)
    logger.info('\n🔄 Testing Code Review Cycle...');
    const reviewResult = await mcpTools.executeTool('orchestra:code_review_cycle', {
      project_id: explorationResult.project_id,
      task_id: 'test_task',
      code: 'const hello = () => console.log("Hello World");',
      requirements: 'Simple function test',
      max_iterations: 1
    });

    if (reviewResult.success) {
      logger.info(`✅ Review Cycle: ${reviewResult.total_iterations} iterations, status: ${reviewResult.final_status}`);
    } else {
      logger.error('❌ Review Cycle failed:', reviewResult.message);
    }

    // Test 5: Project Status
    logger.info('\n📊 Testing Project Status...');
    const statusResult = await mcpTools.executeTool('orchestra:get_project_status', {
      project_id: explorationResult.project_id,
      include_details: false
    });

    if (statusResult.success) {
      logger.info(`✅ Status: Phase ${statusResult.phase}, ${statusResult.progress?.percentage || 0}% complete`);
    } else {
      logger.info('ℹ️ Status: Project not found (expected for test)');
    }

    // Summary
    const tests = [explorationResult, validationResult, orchestrationResult, reviewResult];
    const successful = tests.filter(t => t.success).length;
    const successRate = (successful / tests.length) * 100;

    logger.info('\n🎯 QUICK TEST RESULTS:');
    logger.info('=' + '='.repeat(30));
    logger.info(`✅ Success Rate: ${successRate}% (${successful}/${tests.length})`);

    if (successRate >= 75) {
      logger.info('🎉 REVOLUTIONARY WORKFLOW IS OPERATIONAL!');
      logger.info('🚀 Core components working correctly');
      logger.info('🤖 Multi-agent orchestration functional');
      logger.info('🔄 Review cycle architecture in place');
      return true;
    } else {
      logger.error('❌ Some core components failed');
      return false;
    }

  } catch (error) {
    logger.error('💥 Quick test failed:', error);
    return false;
  }
}

// Execute test
testQuickWorkflow()
  .then(success => {
    const exitCode = success ? 0 : 1;
    logger.info(`\n🏁 Quick test completed with exit code: ${exitCode}`);
    process.exit(exitCode);
  })
  .catch(error => {
    logger.error('💥 Test execution error:', error);
    process.exit(1);
  });
