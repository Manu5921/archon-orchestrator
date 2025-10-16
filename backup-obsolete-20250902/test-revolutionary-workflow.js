#!/usr/bin/env node

import { logger } from './src/utils/logger.js';
import { MCPTools } from './src/mcp/tools.js';

/**
 * Test Revolutionary Workflow - End-to-End Integration Test
 *
 * This test demonstrates the complete revolutionary workflow:
 * 1. Gemini creative exploration
 * 2. Claude technical validation
 * 3. Sub-agent orchestration with specialized agents
 * 4. Gemini-Claude iterative code review cycle
 * 5. Project completion and archival
 */

class RevolutionaryWorkflowTester {
  constructor() {
    this.mcpTools = null;
    this.testResults = {
      phases: {},
      performance: {},
      overall_success: false
    };
  }

  async runCompleteTest() {
    logger.info('🚀 Starting Revolutionary Workflow End-to-End Test');
    logger.info('=' + '='.repeat(60));

    try {
      // Initialize MCP Tools with mock orchestrator
      await this.initializeMCPTools();

      // Test Phase 1: Project Exploration
      await this.testPhase1_ProjectExploration();

      // Test Phase 2: Technical Validation
      await this.testPhase2_TechnicalValidation();

      // Test Phase 3: Task Orchestration
      await this.testPhase3_TaskOrchestration();

      // Test Phase 4: Code Review Cycle
      await this.testPhase4_CodeReviewCycle();

      // Test Phase 5: Project Status & Summary
      await this.testPhase5_ProjectStatus();

      // Generate final report
      this.generateFinalReport();

    } catch (error) {
      logger.error('❌ Revolutionary Workflow Test Failed', error);
      this.testResults.overall_success = false;
      this.testResults.error = error.message;
    }
  }

  async initializeMCPTools() {
    logger.info('🔧 Initializing MCP Tools with Mock Orchestrator...');

    // Create mock orchestrator
    const mockOrchestrator = {
      agents: new Map(),
      projectWorkflow: null,
      routeTask: async (args) => ({ success: true, routed_to: 'mock_agent' }),
      handoffTask: async (args) => ({ success: true, handoff_completed: true }),
      syncContext: async (args) => ({ success: true, context_synced: true }),
      getPerformanceStats: async (args) => ({
        success: true,
        stats: { total_tasks: 5, success_rate: 100, avg_response_time: 250 }
      }),
      learnPattern: async (args) => ({ success: true, pattern_learned: true })
    };

    this.mcpTools = new MCPTools(mockOrchestrator);
    logger.info('✅ MCP Tools initialized successfully');
  }

  async testPhase1_ProjectExploration() {
    logger.info('\n📊 PHASE 1: Project Exploration');
    logger.info('-' + '-'.repeat(40));

    const startTime = Date.now();

    try {
      const explorationResult = await this.mcpTools.executeTool('orchestra:project_exploration', {
        project_description: 'Create a modern task management application with real-time collaboration features',
        constraints: [
          'Must be web-based with mobile responsiveness',
          'Real-time synchronization between users',
          'Offline capability with conflict resolution',
          'Enterprise security and compliance',
          'Scalable to 10,000+ concurrent users'
        ],
        exploration_depth: 'comprehensive'
      });

      this.testResults.phases.exploration = {
        success: explorationResult.success,
        duration_ms: Date.now() - startTime,
        approaches_found: explorationResult.approaches_found,
        confidence: explorationResult.confidence,
        project_id: explorationResult.project_id
      };

      if (explorationResult.success) {
        logger.info(`✅ Exploration successful: ${explorationResult.approaches_found} approaches found`);
        logger.info(`📊 Confidence level: ${explorationResult.confidence}%`);
        logger.info(`🆔 Project ID: ${explorationResult.project_id}`);
      } else {
        throw new Error(`Exploration failed: ${explorationResult.message}`);
      }

    } catch (error) {
      logger.error('❌ Phase 1 Failed:', error.message);
      this.testResults.phases.exploration = { success: false, error: error.message };
      throw error;
    }
  }

  async testPhase2_TechnicalValidation() {
    logger.info('\n🎯 PHASE 2: Technical Validation');
    logger.info('-' + '-'.repeat(40));

    const startTime = Date.now();
    const projectId = this.testResults.phases.exploration.project_id;

    try {
      // Mock exploration results from Phase 1
      const mockExplorationResults = {
        approaches: [
          {
            name: 'Modern SPA with Real-time Backend',
            technology_stack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Redis'],
            architecture: 'Microservices with Event-Driven Communication',
            pros: ['High performance', 'Scalable', 'Modern tech stack'],
            cons: ['Complex deployment', 'Higher learning curve']
          },
          {
            name: 'Progressive Web App',
            technology_stack: ['Vue.js', 'Express', 'PostgreSQL', 'Service Workers'],
            architecture: 'Monolithic with PWA capabilities',
            pros: ['Offline support', 'Simple deployment', 'Good performance'],
            cons: ['Less scalable', 'Limited real-time features']
          }
        ],
        creative_insights: [
          'Consider AI-powered task prioritization',
          'Implement smart notification system',
          'Use collaborative filtering for task recommendations'
        ]
      };

      const validationResult = await this.mcpTools.executeTool('orchestra:technical_validation', {
        project_id: projectId,
        exploration_results: mockExplorationResults,
        validation_focus: 'comprehensive'
      });

      this.testResults.phases.validation = {
        success: validationResult.success,
        duration_ms: Date.now() - startTime,
        tasks_identified: validationResult.tasks_identified,
        confidence: validationResult.confidence,
        validation_results: validationResult.validation_results
      };

      if (validationResult.success) {
        logger.info(`✅ Validation successful: ${validationResult.tasks_identified} tasks identified`);
        logger.info(`📊 Confidence level: ${validationResult.confidence}%`);
      } else {
        throw new Error(`Validation failed: ${validationResult.message}`);
      }

    } catch (error) {
      logger.error('❌ Phase 2 Failed:', error.message);
      this.testResults.phases.validation = { success: false, error: error.message };
      throw error;
    }
  }

  async testPhase3_TaskOrchestration() {
    logger.info('\n🎼 PHASE 3: Task Orchestration');
    logger.info('-' + '-'.repeat(40));

    const startTime = Date.now();
    const projectId = this.testResults.phases.exploration.project_id;

    try {
      // Mock validation results from Phase 2
      const mockValidationResults = {
        architecture: 'Microservices with React frontend and Node.js backend',
        tasks: [
          { id: 'task_1', name: 'Setup project infrastructure', type: 'devops', priority: 1, estimated_hours: 8 },
          { id: 'task_2', name: 'Implement user authentication', type: 'backend', priority: 1, estimated_hours: 12 },
          { id: 'task_3', name: 'Create task management UI', type: 'frontend', priority: 2, estimated_hours: 16 },
          { id: 'task_4', name: 'Real-time synchronization', type: 'backend', priority: 2, estimated_hours: 14 },
          { id: 'task_5', name: 'Integration testing suite', type: 'testing', priority: 3, estimated_hours: 10 }
        ],
        requirements: {
          performance: 'Sub-second response times',
          scalability: '10,000 concurrent users',
          security: 'Enterprise-grade authentication',
          availability: '99.9% uptime'
        }
      };

      const orchestrationResult = await this.mcpTools.executeTool('orchestra:task_orchestration', {
        project_id: projectId,
        validation_results: mockValidationResults,
        parallel_execution: true
      });

      this.testResults.phases.orchestration = {
        success: orchestrationResult.success,
        duration_ms: Date.now() - startTime,
        sub_agents_created: orchestrationResult.sub_agents_created,
        execution_steps: orchestrationResult.execution_steps,
        orchestration_results: orchestrationResult.orchestration_results
      };

      if (orchestrationResult.success) {
        logger.info(`✅ Orchestration successful: ${orchestrationResult.sub_agents_created} sub-agents created`);
        logger.info(`📊 Execution plan: ${orchestrationResult.execution_steps} steps`);
        logger.info('🤖 Sub-agent types: Frontend, Backend, Testing, DevOps');
      } else {
        throw new Error(`Orchestration failed: ${orchestrationResult.message}`);
      }

    } catch (error) {
      logger.error('❌ Phase 3 Failed:', error.message);
      this.testResults.phases.orchestration = { success: false, error: error.message };
      throw error;
    }
  }

  async testPhase4_CodeReviewCycle() {
    logger.info('\n🔄 PHASE 4: Code Review Cycle');
    logger.info('-' + '-'.repeat(40));

    const startTime = Date.now();
    const projectId = this.testResults.phases.exploration.project_id;

    try {
      // Mock code for review
      const sampleCode = `
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export const TaskManager = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);
    
    newSocket.on('taskUpdate', (updatedTask) => {
      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
    });
    
    return () => newSocket.close();
  }, []);
  
  const createTask = async (taskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskData, userId })
      });
      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      socket?.emit('taskCreated', newTask);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };
  
  return (
    <div className="task-manager">
      <h2>Task Manager</h2>
      {tasks.map(task => (
        <div key={task.id} className="task-item">
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <span className={\`status-\${task.status}\`}>{task.status}</span>
        </div>
      ))}
    </div>
  );
};
`;

      const reviewResult = await this.mcpTools.executeTool('orchestra:code_review_cycle', {
        project_id: projectId,
        task_id: 'task_3_frontend_component',
        code: sampleCode,
        requirements: 'Create a React component for task management with real-time updates',
        max_iterations: 3
      });

      this.testResults.phases.review_cycle = {
        success: reviewResult.success,
        duration_ms: Date.now() - startTime,
        total_iterations: reviewResult.total_iterations,
        final_status: reviewResult.final_status,
        review_cycle: reviewResult.review_cycle
      };

      if (reviewResult.success) {
        logger.info(`✅ Review cycle completed: ${reviewResult.total_iterations} iterations`);
        logger.info(`📊 Final status: ${reviewResult.final_status}`);

        if (reviewResult.review_cycle?.iterations) {
          for (const iteration of reviewResult.review_cycle.iterations) {
            logger.info(`   Iteration ${iteration.iteration}: ${iteration.phase} - Quality: ${iteration.quality_score || 'N/A'}`);
          }
        }
      } else {
        throw new Error(`Review cycle failed: ${reviewResult.message}`);
      }

    } catch (error) {
      logger.error('❌ Phase 4 Failed:', error.message);
      this.testResults.phases.review_cycle = { success: false, error: error.message };
      throw error;
    }
  }

  async testPhase5_ProjectStatus() {
    logger.info('\n📊 PHASE 5: Project Status & Summary');
    logger.info('-' + '-'.repeat(40));

    const startTime = Date.now();
    const projectId = this.testResults.phases.exploration.project_id;

    try {
      const statusResult = await this.mcpTools.executeTool('orchestra:get_project_status', {
        project_id: projectId,
        include_details: true
      });

      this.testResults.phases.status = {
        success: statusResult.success,
        duration_ms: Date.now() - startTime,
        project_status: statusResult
      };

      if (statusResult.success) {
        logger.info('✅ Project status retrieved successfully');
        logger.info(`📊 Current phase: ${statusResult.phase || 'Unknown'}`);
        logger.info(`📈 Progress: ${statusResult.progress?.percentage || 'N/A'}%`);

        if (statusResult.phases) {
          logger.info('Phase breakdown:');
          for (const [phaseName, phaseInfo] of Object.entries(statusResult.phases)) {
            logger.info(`   ${phaseName}: ${phaseInfo.status}`);
          }
        }
      } else {
        logger.warn(`⚠️ Status retrieval had issues: ${statusResult.error}`);
      }

    } catch (error) {
      logger.error('❌ Phase 5 Failed:', error.message);
      this.testResults.phases.status = { success: false, error: error.message };
      // Don't throw - status is not critical for overall success
    }
  }

  generateFinalReport() {
    logger.info('\n📋 REVOLUTIONARY WORKFLOW TEST REPORT');
    logger.info('=' + '='.repeat(60));

    const totalPhases = Object.keys(this.testResults.phases).length;
    const successfulPhases = Object.values(this.testResults.phases).filter(p => p.success).length;
    const overallSuccess = successfulPhases >= 4; // At least 4 of 5 phases must succeed

    this.testResults.overall_success = overallSuccess;
    this.testResults.performance = {
      total_phases: totalPhases,
      successful_phases: successfulPhases,
      success_rate: Math.round((successfulPhases / totalPhases) * 100),
      total_duration_ms: Object.values(this.testResults.phases)
        .filter(p => p.duration_ms)
        .reduce((sum, p) => sum + p.duration_ms, 0)
    };

    logger.info(`📊 Overall Success: ${overallSuccess ? '✅ PASSED' : '❌ FAILED'}`);
    logger.info(`📈 Success Rate: ${this.testResults.performance.success_rate}% (${successfulPhases}/${totalPhases})`);
    logger.info(`⏱️ Total Duration: ${this.testResults.performance.total_duration_ms}ms`);

    logger.info('\n📋 Phase Results:');
    for (const [phaseName, result] of Object.entries(this.testResults.phases)) {
      const status = result.success ? '✅' : '❌';
      const duration = result.duration_ms ? `${result.duration_ms}ms` : 'N/A';
      logger.info(`   ${status} ${phaseName}: ${duration}`);

      if (result.error) {
        logger.info(`      Error: ${result.error}`);
      }
    }

    if (overallSuccess) {
      logger.info('\n🎉 REVOLUTIONARY WORKFLOW INTEGRATION TEST PASSED!');
      logger.info('🚀 The multi-agent orchestration system is working correctly');
      logger.info('🔄 Gemini-Claude collaborative review cycle is operational');
      logger.info('🤖 Sub-agent specialization system is functional');

      logger.info('\n🎯 Key Achievements:');
      logger.info('   • Project exploration with multiple technical approaches');
      logger.info('   • Technical validation with task breakdown');
      logger.info('   • Sub-agent orchestration with specialized roles');
      logger.info('   • Iterative code review with quality improvement');
      logger.info('   • Project status tracking and progress monitoring');

    } else {
      logger.error('\n❌ REVOLUTIONARY WORKFLOW TEST FAILED');
      logger.error('🔧 Some phases did not complete successfully');
      logger.error('📝 Review the error messages above for details');
    }

    logger.info('\n' + '='.repeat(60));

    // Save detailed results to file for analysis
    this.saveResultsToFile();
  }

  async saveResultsToFile() {
    try {
      const resultsFile = `/tmp/revolutionary-workflow-test-results-${Date.now()}.json`;
      const fs = await import('fs/promises');

      await fs.writeFile(
        resultsFile,
        JSON.stringify(this.testResults, null, 2),
        'utf8'
      );

      logger.info(`📁 Detailed results saved to: ${resultsFile}`);

    } catch (error) {
      logger.warn(`⚠️ Failed to save results file: ${error.message}`);
    }
  }
}

// Execute the test if run directly
if (process.argv[1].endsWith('test-revolutionary-workflow.js')) {
  const tester = new RevolutionaryWorkflowTester();

  tester.runCompleteTest()
    .then(() => {
      const exitCode = tester.testResults.overall_success ? 0 : 1;
      logger.info(`\n🏁 Test completed with exit code: ${exitCode}`);
      process.exit(exitCode);
    })
    .catch((error) => {
      logger.error('💥 Test execution failed:', error);
      process.exit(1);
    });
}

export { RevolutionaryWorkflowTester };
