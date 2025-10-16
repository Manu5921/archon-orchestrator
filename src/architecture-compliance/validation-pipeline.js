/**
 * Architecture-Compliance V2 - Validation Pipeline
 * Orchestrates the complete architecture compliance workflow
 *
 * CRITICAL: End-to-end validation from context injection to quality gates
 */

import { promises as fs } from 'fs';
import path from 'path';
import { Logger } from '../utils/logger.js';
import { architectureContextInjection } from './context-injection.js';
import { architectureQualityGates } from './quality-gates.js';

export class ArchitectureValidationPipeline {
  constructor(options = {}) {
    this.logger = new Logger('ArchValidationPipeline');
    this.options = {
      strictMode: true,
      enablePreValidation: true,
      enablePostValidation: true,
      enableContinuousValidation: false,
      maxRetries: 2,
      ...options
    };

    this.pipelineExecutions = [];
    this.validationMetrics = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      averageExecutionTime: 0,
      lastExecution: null
    };
  }

  /**
   * Execute complete architecture validation pipeline
   * @param {string} agentType - Type of agent executing the task
   * @param {string} originalPrompt - Original agent prompt
   * @param {string} taskDescription - Description of task to execute
   * @param {Object} taskResult - Result from agent task execution
   * @param {Object} options - Pipeline execution options
   * @returns {Promise<Object>} Complete validation results
   */
  async executeValidationPipeline(agentType, originalPrompt, taskDescription, taskResult = null, options = {}) {
    const executionId = `pipeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    this.logger.info(`Starting architecture validation pipeline: ${executionId}`);

    const pipelineOptions = { ...this.options, ...options };
    let retryCount = 0;

    while (retryCount <= pipelineOptions.maxRetries) {
      try {
        // Phase 1: Pre-Task Architecture Context Injection
        const contextInjectionResult = await this.executeContextInjectionPhase(
          agentType,
          originalPrompt,
          taskDescription
        );

        // Phase 2: Task Execution (if no task result provided, this is planning phase)
        let taskExecutionResult = taskResult;
        if (!taskExecutionResult && pipelineOptions.executeTask) {
          taskExecutionResult = await this.executeTaskWithArchitectureContext(
            contextInjectionResult.enhancedPrompt,
            agentType,
            taskDescription,
            pipelineOptions.taskExecutor
          );
        }

        // Phase 3: Post-Task Quality Gates Validation (only if we have task results)
        let qualityGatesResult = null;
        if (taskExecutionResult) {
          qualityGatesResult = await this.executeQualityGatesPhase(
            contextInjectionResult.injectionId,
            taskExecutionResult,
            agentType,
            taskDescription
          );
        }

        // Phase 4: Compliance Reporting
        const complianceReport = await this.generateComplianceReport(
          executionId,
          contextInjectionResult,
          taskExecutionResult,
          qualityGatesResult
        );

        // Record successful execution
        const execution = {
          executionId,
          timestamp: new Date().toISOString(),
          agentType,
          taskDescription,
          success: true,
          executionTime: Date.now() - startTime,
          retryCount,
          phases: {
            contextInjection: contextInjectionResult,
            taskExecution: taskExecutionResult ? 'completed' : 'skipped',
            qualityGates: qualityGatesResult,
            complianceReport: complianceReport
          }
        };

        this.recordExecution(execution);

        this.logger.info(`Architecture validation pipeline completed successfully: ${executionId}`);

        return {
          success: true,
          executionId,
          execution,
          contextInjection: contextInjectionResult,
          qualityGates: qualityGatesResult,
          complianceReport,
          enhancedPrompt: contextInjectionResult.enhancedPrompt
        };

      } catch (error) {
        retryCount++;

        if (retryCount > pipelineOptions.maxRetries) {
          // Record failed execution
          const failedExecution = {
            executionId,
            timestamp: new Date().toISOString(),
            agentType,
            taskDescription,
            success: false,
            executionTime: Date.now() - startTime,
            retryCount: retryCount - 1,
            error: error.message,
            lastError: error
          };

          this.recordExecution(failedExecution);

          this.logger.error(`Architecture validation pipeline failed after ${pipelineOptions.maxRetries} retries: ${error.message}`);
          throw new Error(`ARCHITECTURE VALIDATION PIPELINE FAILURE: ${error.message}`);
        } else {
          this.logger.warn(`Pipeline execution failed (attempt ${retryCount}), retrying: ${error.message}`);
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
    }
  }

  /**
   * Execute context injection phase
   * @param {string} agentType - Agent type
   * @param {string} originalPrompt - Original prompt
   * @param {string} taskDescription - Task description
   * @returns {Promise<Object>} Context injection result
   */
  async executeContextInjectionPhase(agentType, originalPrompt, taskDescription) {
    this.logger.debug('Executing Phase 1: Architecture Context Injection');

    try {
      const contextResult = await architectureContextInjection.injectArchitectureContext(
        agentType,
        originalPrompt,
        taskDescription
      );

      // Validate context injection was successful
      if (!contextResult.enhancedPrompt || !contextResult.architectureContext) {
        throw new Error('Context injection failed: incomplete result');
      }

      this.logger.info(`Context injection successful: ${contextResult.injectionId}`);
      return contextResult;

    } catch (error) {
      this.logger.error(`Context injection phase failed: ${error.message}`);
      throw new Error(`CONTEXT INJECTION PHASE FAILURE: ${error.message}`);
    }
  }

  /**
   * Execute task with architecture context (placeholder for task execution)
   * @param {string} enhancedPrompt - Enhanced prompt with architecture context
   * @param {string} agentType - Agent type
   * @param {string} taskDescription - Task description
   * @param {Function} taskExecutor - Task executor function
   * @returns {Promise<Object>} Task execution result
   */
  async executeTaskWithArchitectureContext(enhancedPrompt, agentType, taskDescription, taskExecutor) {
    this.logger.debug('Executing Phase 2: Task Execution with Architecture Context');

    if (!taskExecutor) {
      throw new Error('No task executor provided - pipeline cannot execute task');
    }

    try {
      const taskResult = await taskExecutor(enhancedPrompt, agentType, taskDescription);

      if (!taskResult) {
        throw new Error('Task executor returned no result');
      }

      this.logger.info('Task execution completed with architecture context');
      return taskResult;

    } catch (error) {
      this.logger.error(`Task execution phase failed: ${error.message}`);
      throw new Error(`TASK EXECUTION PHASE FAILURE: ${error.message}`);
    }
  }

  /**
   * Execute quality gates validation phase
   * @param {string} injectionId - Context injection ID
   * @param {Object} taskResult - Task result to validate
   * @param {string} agentType - Agent type
   * @param {string} taskDescription - Task description
   * @returns {Promise<Object>} Quality gates result
   */
  async executeQualityGatesPhase(injectionId, taskResult, agentType, taskDescription) {
    this.logger.debug('Executing Phase 3: Quality Gates Validation');

    try {
      const gatesResult = await architectureQualityGates.executeQualityGates(
        injectionId,
        taskResult,
        agentType,
        taskDescription
      );

      if (!gatesResult.success && this.options.strictMode) {
        throw new Error(`Quality gates validation failed: ${gatesResult.results.blockingFailures} blocking violations`);
      }

      this.logger.info(`Quality gates validation completed: ${gatesResult.complianceScore}% compliance`);
      return gatesResult;

    } catch (error) {
      this.logger.error(`Quality gates phase failed: ${error.message}`);
      throw new Error(`QUALITY GATES PHASE FAILURE: ${error.message}`);
    }
  }

  /**
   * Generate comprehensive compliance report
   * @param {string} executionId - Execution ID
   * @param {Object} contextResult - Context injection result
   * @param {Object} taskResult - Task execution result
   * @param {Object} gatesResult - Quality gates result
   * @returns {Promise<Object>} Compliance report
   */
  async generateComplianceReport(executionId, contextResult, taskResult, gatesResult) {
    this.logger.debug('Executing Phase 4: Compliance Reporting');

    const report = {
      executionId,
      timestamp: new Date().toISOString(),
      architectureCompliance: {
        contextInjected: !!contextResult,
        architectureDocumentFound: !!contextResult?.architectureContext?.documentPath,
        qualityGatesExecuted: !!gatesResult,
        overallCompliance: this.calculateOverallCompliance(contextResult, gatesResult)
      },
      contextInjection: {
        injectionId: contextResult?.injectionId,
        architectureFound: !!contextResult?.architectureContext?.documentPath,
        constraintsCount: contextResult?.architectureContext?.constraints?.length || 0,
        techStackDefined: !!(contextResult?.architectureContext?.techStack?.backend || contextResult?.architectureContext?.techStack?.frontend)
      },
      qualityGates: gatesResult ? {
        totalGates: gatesResult.results.totalGates,
        passedGates: gatesResult.results.passedGates,
        failedGates: gatesResult.results.failedGates,
        blockingFailures: gatesResult.results.blockingFailures,
        complianceScore: gatesResult.complianceScore
      } : null,
      recommendations: this.generateRecommendations(contextResult, gatesResult),
      compliance: {
        status: this.getComplianceStatus(contextResult, gatesResult),
        level: this.getComplianceLevel(contextResult, gatesResult),
        critical_violations: this.getCriticalViolations(gatesResult),
        next_steps: this.getNextSteps(contextResult, gatesResult)
      }
    };

    // Save report if configured
    if (this.options.saveReports) {
      await this.saveComplianceReport(executionId, report);
    }

    return report;
  }

  /**
   * Calculate overall compliance score
   * @param {Object} contextResult - Context injection result
   * @param {Object} gatesResult - Quality gates result
   * @returns {string} Compliance percentage
   */
  calculateOverallCompliance(contextResult, gatesResult) {
    let score = 0;
    let maxScore = 100;

    // Context injection worth 40%
    if (contextResult?.architectureContext?.documentPath) {
      score += 40;
    } else {
      score += 10; // Partial credit for attempted injection
    }

    // Quality gates worth 60%
    if (gatesResult?.complianceScore) {
      score += (parseFloat(gatesResult.complianceScore) * 0.6);
    }

    return Math.min(score, maxScore).toFixed(2);
  }

  /**
   * Get compliance status
   * @param {Object} contextResult - Context result
   * @param {Object} gatesResult - Gates result
   * @returns {string} Compliance status
   */
  getComplianceStatus(contextResult, gatesResult) {
    const overallCompliance = parseFloat(this.calculateOverallCompliance(contextResult, gatesResult));

    if (overallCompliance >= 95) return 'EXCELLENT';
    if (overallCompliance >= 80) return 'GOOD';
    if (overallCompliance >= 60) return 'ACCEPTABLE';
    if (overallCompliance >= 40) return 'POOR';
    return 'CRITICAL';
  }

  /**
   * Get compliance level
   * @param {Object} contextResult - Context result
   * @param {Object} gatesResult - Gates result
   * @returns {string} Compliance level
   */
  getComplianceLevel(contextResult, gatesResult) {
    if (!contextResult?.architectureContext?.documentPath) return 'MINIMAL';
    if (!gatesResult) return 'PARTIAL';
    if (gatesResult.results?.blockingFailures > 0) return 'VIOLATION';
    if (parseFloat(gatesResult.complianceScore) >= 95) return 'FULL_COMPLIANCE';
    return 'SUBSTANTIAL';
  }

  /**
   * Get critical violations
   * @param {Object} gatesResult - Gates result
   * @returns {Array} Critical violations
   */
  getCriticalViolations(gatesResult) {
    if (!gatesResult?.results?.gateResults) return [];

    return gatesResult.results.gateResults
      .filter(gate => !gate.passed && gate.blocking)
      .map(gate => ({
        gateId: gate.gateId,
        description: gate.description,
        violations: gate.violations || []
      }));
  }

  /**
   * Get next steps recommendations
   * @param {Object} contextResult - Context result
   * @param {Object} gatesResult - Gates result
   * @returns {Array} Next steps
   */
  getNextSteps(contextResult, gatesResult) {
    const steps = [];

    if (!contextResult?.architectureContext?.documentPath) {
      steps.push('Create architecture document (ARCHITECTURE.md or CLAUDE.md)');
    }

    if (gatesResult?.results?.blockingFailures > 0) {
      steps.push('Resolve blocking quality gate violations before proceeding');
    }

    if (!contextResult?.architectureContext?.techStack?.backend && !contextResult?.architectureContext?.techStack?.frontend) {
      steps.push('Define technology stack in architecture document');
    }

    if (steps.length === 0) {
      steps.push('Continue with task execution - architecture compliance validated');
    }

    return steps;
  }

  /**
   * Generate recommendations based on validation results
   * @param {Object} contextResult - Context result
   * @param {Object} gatesResult - Gates result
   * @returns {Array} Recommendations
   */
  generateRecommendations(contextResult, gatesResult) {
    const recommendations = [];

    if (!contextResult?.architectureContext?.documentPath) {
      recommendations.push({
        type: 'critical',
        category: 'architecture_documentation',
        message: 'Create comprehensive architecture document',
        action: 'Use architecture template to create ARCHITECTURE.md'
      });
    }

    if (gatesResult?.results?.failedGates > 0) {
      recommendations.push({
        type: 'warning',
        category: 'quality_gates',
        message: `${gatesResult.results.failedGates} quality gates failed`,
        action: 'Review and resolve gate violations before proceeding'
      });
    }

    if (contextResult?.architectureContext?.constraints?.length === 0) {
      recommendations.push({
        type: 'improvement',
        category: 'architecture_constraints',
        message: 'Add technical constraints to architecture document',
        action: 'Define technology, security, and performance constraints'
      });
    }

    return recommendations;
  }

  /**
   * Save compliance report to file
   * @param {string} executionId - Execution ID
   * @param {Object} report - Compliance report
   */
  async saveComplianceReport(executionId, report) {
    try {
      const reportsDir = path.join(process.cwd(), 'reports', 'architecture-compliance');
      await fs.mkdir(reportsDir, { recursive: true });

      const reportPath = path.join(reportsDir, `${executionId}.json`);
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

      this.logger.debug(`Compliance report saved: ${reportPath}`);
    } catch (error) {
      this.logger.warn(`Failed to save compliance report: ${error.message}`);
    }
  }

  /**
   * Record pipeline execution
   * @param {Object} execution - Execution record
   */
  recordExecution(execution) {
    this.pipelineExecutions.push(execution);

    // Update metrics
    this.validationMetrics.totalExecutions++;
    if (execution.success) {
      this.validationMetrics.successfulExecutions++;
    } else {
      this.validationMetrics.failedExecutions++;
    }

    // Update average execution time
    const totalTime = this.pipelineExecutions.reduce((sum, exec) => sum + exec.executionTime, 0);
    this.validationMetrics.averageExecutionTime = Math.round(totalTime / this.validationMetrics.totalExecutions);
    this.validationMetrics.lastExecution = execution;

    // Keep only last 100 executions to prevent memory issues
    if (this.pipelineExecutions.length > 100) {
      this.pipelineExecutions = this.pipelineExecutions.slice(-100);
    }
  }

  /**
   * Quick validation check for existing task results
   * @param {Object} taskResult - Task result to validate
   * @param {string} agentType - Agent type
   * @param {string} taskDescription - Task description
   * @returns {Promise<Object>} Quick validation result
   */
  async quickValidation(taskResult, agentType, taskDescription) {
    this.logger.info('Running quick architecture validation');

    try {
      // Load architecture context
      // const _architectureContext = await architectureContextInjection.loadArchitectureContext();

      // Create minimal injection record
      const injectionId = `quick-${Date.now()}`;

      // Run quality gates
      const gatesResult = await architectureQualityGates.executeQualityGates(
        injectionId,
        taskResult,
        agentType,
        taskDescription
      );

      return {
        success: gatesResult.success,
        complianceScore: gatesResult.complianceScore,
        violations: gatesResult.results.gateResults.filter(g => !g.passed),
        recommendations: gatesResult.results.gateResults.flatMap(g => g.recommendations || [])
      };

    } catch (error) {
      this.logger.error(`Quick validation failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        complianceScore: '0.00'
      };
    }
  }

  /**
   * Get pipeline execution statistics
   * @returns {Object} Pipeline statistics
   */
  getExecutionStats() {
    return {
      ...this.validationMetrics,
      successRate: this.validationMetrics.totalExecutions > 0 ?
        (this.validationMetrics.successfulExecutions / this.validationMetrics.totalExecutions * 100).toFixed(2) : '0.00',
      recentExecutions: this.pipelineExecutions.slice(-10)
    };
  }

  /**
   * Clear execution history and reset metrics
   */
  resetMetrics() {
    this.pipelineExecutions = [];
    this.validationMetrics = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      averageExecutionTime: 0,
      lastExecution: null
    };
  }
}

// Export default instance
export const architectureValidationPipeline = new ArchitectureValidationPipeline({
  strictMode: true,
  enablePreValidation: true,
  enablePostValidation: true,
  maxRetries: 2,
  saveReports: true
});

export default architectureValidationPipeline;
