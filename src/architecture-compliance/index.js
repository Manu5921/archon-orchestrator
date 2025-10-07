/**
 * Architecture-Compliance V2 - Main Integration Module
 * Central orchestration for complete architecture compliance system
 * 
 * CRITICAL: Single entry point for all architecture compliance operations
 */

import { architectureContextInjection } from './context-injection.js';
import { architectureQualityGates } from './quality-gates.js';
import { architectureValidationPipeline } from './validation-pipeline.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger('ArchCompliance');

/**
 * Architecture Compliance V2 System
 * Complete integration of context injection, quality gates, and validation pipeline
 */
export class ArchitectureComplianceSystem {
  constructor(options = {}) {
    this.logger = new Logger('ArchComplianceSystem');
    this.options = {
      strictMode: true,
      enableContinuousValidation: false,
      enableReporting: true,
      ...options
    };
    
    this.systemMetrics = {
      totalOperations: 0,
      successfulOperations: 0,
      systemStartTime: new Date().toISOString(),
      lastOperation: null
    };
  }

  /**
   * Execute complete architecture compliance workflow for agent task
   * This is the main entry point for integrating architecture compliance
   * 
   * @param {Object} agentTask - Agent task configuration
   * @param {string} agentTask.agentType - Type of agent (backend, frontend, etc.)
   * @param {string} agentTask.originalPrompt - Original task prompt
   * @param {string} agentTask.taskDescription - Task description
   * @param {Function} agentTask.taskExecutor - Function to execute the actual task
   * @param {Object} options - Execution options
   * @returns {Promise<Object>} Complete compliance workflow result
   */
  async executeCompliantAgentTask(agentTask, options = {}) {
    const operationId = `compliance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    this.logger.info(`Starting compliant agent task execution: ${operationId}`);
    
    try {
      // Phase 1: Architecture Context Injection (Pre-Task)
      this.logger.debug('Phase 1: Injecting architecture context');
      const contextResult = await architectureContextInjection.injectArchitectureContext(
        agentTask.agentType,
        agentTask.originalPrompt,
        agentTask.taskDescription
      );

      // Phase 2: Task Execution with Architecture Context
      this.logger.debug('Phase 2: Executing task with architecture context');
      let taskResult = null;
      
      if (agentTask.taskExecutor) {
        taskResult = await agentTask.taskExecutor(
          contextResult.enhancedPrompt,
          agentTask.agentType,
          agentTask.taskDescription,
          contextResult.architectureContext
        );
      } else {
        // Return enhanced prompt for manual execution
        this.logger.info('No task executor provided - returning enhanced prompt for manual execution');
        return {
          success: true,
          operationId,
          phase: 'context_injection_only',
          contextInjection: contextResult,
          enhancedPrompt: contextResult.enhancedPrompt,
          nextSteps: [
            'Execute task using the enhanced prompt with architecture context',
            'Run quality gates validation on task results',
            'Generate compliance report'
          ]
        };
      }

      // Phase 3: Quality Gates Validation (Post-Task)
      this.logger.debug('Phase 3: Running quality gates validation');
      const qualityGatesResult = await architectureQualityGates.executeQualityGates(
        contextResult.injectionId,
        taskResult,
        agentTask.agentType,
        agentTask.taskDescription
      );

      // Phase 4: Compliance Reporting
      this.logger.debug('Phase 4: Generating compliance report');
      const complianceReport = await this.generateSystemComplianceReport(
        operationId,
        contextResult,
        taskResult,
        qualityGatesResult
      );

      // Record successful operation
      const operationRecord = {
        operationId,
        success: true,
        executionTime: Date.now() - startTime,
        agentType: agentTask.agentType,
        taskDescription: agentTask.taskDescription,
        complianceScore: qualityGatesResult.complianceScore,
        phases: {
          contextInjection: 'completed',
          taskExecution: 'completed',
          qualityGates: qualityGatesResult.success ? 'passed' : 'failed',
          complianceReport: 'generated'
        }
      };

      this.recordOperation(operationRecord);

      this.logger.info(`Compliant agent task completed successfully: ${operationId} (${qualityGatesResult.complianceScore}% compliance)`);

      return {
        success: true,
        operationId,
        contextInjection: contextResult,
        taskResult,
        qualityGates: qualityGatesResult,
        complianceReport,
        operation: operationRecord,
        // Convenience fields for downstream use
        complianceScore: qualityGatesResult.complianceScore,
        compliancePassed: qualityGatesResult.success,
        architectureContext: contextResult.architectureContext
      };

    } catch (error) {
      // Record failed operation
      const failedOperation = {
        operationId,
        success: false,
        executionTime: Date.now() - startTime,
        agentType: agentTask.agentType,
        taskDescription: agentTask.taskDescription,
        error: error.message
      };

      this.recordOperation(failedOperation);

      this.logger.error(`Compliant agent task failed: ${operationId} - ${error.message}`);
      throw new Error(`ARCHITECTURE COMPLIANCE SYSTEM FAILURE [${operationId}]: ${error.message}`);
    }
  }

  /**
   * Quick compliance check for existing task results
   * Useful for validating already-completed tasks
   * 
   * @param {Object} taskResult - Completed task result
   * @param {string} agentType - Agent type
   * @param {string} taskDescription - Task description
   * @returns {Promise<Object>} Quick compliance check result
   */
  async quickComplianceCheck(taskResult, agentType, taskDescription) {
    const checkId = `quick-check-${Date.now()}`;
    
    this.logger.info(`Running quick compliance check: ${checkId}`);
    
    try {
      const validationResult = await architectureValidationPipeline.quickValidation(
        taskResult,
        agentType,
        taskDescription
      );

      this.logger.info(`Quick compliance check completed: ${checkId} (${validationResult.complianceScore}% compliance)`);
      
      return {
        success: validationResult.success,
        checkId,
        complianceScore: validationResult.complianceScore,
        violations: validationResult.violations || [],
        recommendations: validationResult.recommendations || [],
        passed: validationResult.success,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.logger.error(`Quick compliance check failed: ${checkId} - ${error.message}`);
      return {
        success: false,
        checkId,
        complianceScore: '0.00',
        error: error.message,
        passed: false,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get architecture context for manual use
   * Allows getting architecture context without full task execution
   * 
   * @param {string} projectPath - Project path (optional)
   * @returns {Promise<Object>} Architecture context
   */
  async getArchitectureContext(projectPath = process.cwd()) {
    this.logger.info('Loading architecture context');
    
    try {
      const context = await architectureContextInjection.loadArchitectureContext(projectPath);
      
      return {
        success: true,
        context,
        projectPath,
        documentFound: !!context.documentPath,
        techStack: context.techStack,
        constraints: context.constraints,
        compliance: context.compliance
      };

    } catch (error) {
      this.logger.error(`Failed to load architecture context: ${error.message}`);
      return {
        success: false,
        error: error.message,
        projectPath
      };
    }
  }

  /**
   * Generate enhanced prompt with architecture context
   * For use when you want to manually handle task execution
   * 
   * @param {string} agentType - Agent type
   * @param {string} originalPrompt - Original prompt
   * @param {string} taskDescription - Task description
   * @returns {Promise<Object>} Enhanced prompt result
   */
  async generateEnhancedPrompt(agentType, originalPrompt, taskDescription) {
    const promptId = `prompt-${Date.now()}`;
    
    this.logger.info(`Generating enhanced prompt: ${promptId}`);
    
    try {
      const contextResult = await architectureContextInjection.injectArchitectureContext(
        agentType,
        originalPrompt,
        taskDescription
      );

      return {
        success: true,
        promptId,
        enhancedPrompt: contextResult.enhancedPrompt,
        injectionId: contextResult.injectionId,
        architectureContext: contextResult.architectureContext,
        complianceChecks: contextResult.complianceChecks,
        qualityGates: contextResult.qualityGates
      };

    } catch (error) {
      this.logger.error(`Failed to generate enhanced prompt: ${promptId} - ${error.message}`);
      throw new Error(`ENHANCED PROMPT GENERATION FAILURE: ${error.message}`);
    }
  }

  /**
   * Validate task result against quality gates
   * For use after manual task execution
   * 
   * @param {string} injectionId - Context injection ID from enhanced prompt generation
   * @param {Object} taskResult - Task execution result
   * @param {string} agentType - Agent type
   * @param {string} taskDescription - Task description
   * @returns {Promise<Object>} Quality gates validation result
   */
  async validateTaskResult(injectionId, taskResult, agentType, taskDescription) {
    const validationId = `validation-${Date.now()}`;
    
    this.logger.info(`Validating task result: ${validationId}`);
    
    try {
      const gatesResult = await architectureQualityGates.executeQualityGates(
        injectionId,
        taskResult,
        agentType,
        taskDescription
      );

      return {
        success: gatesResult.success,
        validationId,
        complianceScore: gatesResult.complianceScore,
        results: gatesResult.results,
        violations: gatesResult.results.gateResults.filter(g => !g.passed),
        recommendations: gatesResult.results.gateResults.flatMap(g => g.recommendations || [])
      };

    } catch (error) {
      this.logger.error(`Task result validation failed: ${validationId} - ${error.message}`);
      throw new Error(`TASK VALIDATION FAILURE: ${error.message}`);
    }
  }

  /**
   * Generate system-level compliance report
   * @param {string} operationId - Operation ID
   * @param {Object} contextResult - Context injection result
   * @param {Object} taskResult - Task result
   * @param {Object} qualityGatesResult - Quality gates result
   * @returns {Promise<Object>} System compliance report
   */
  async generateSystemComplianceReport(operationId, contextResult, taskResult, qualityGatesResult) {
    return {
      operationId,
      timestamp: new Date().toISOString(),
      system: {
        version: '2.0',
        components: ['context-injection', 'quality-gates', 'validation-pipeline'],
        strictMode: this.options.strictMode
      },
      compliance: {
        overallScore: qualityGatesResult.complianceScore,
        status: qualityGatesResult.success ? 'COMPLIANT' : 'VIOLATIONS_DETECTED',
        contextInjected: !!contextResult.injectionId,
        qualityGatesPassed: qualityGatesResult.success,
        violationsCount: qualityGatesResult.results?.failedGates || 0,
        blockingViolations: qualityGatesResult.results?.blockingFailures || 0
      },
      details: {
        architectureDocument: contextResult.architectureContext?.documentPath || 'NOT_FOUND',
        techStack: contextResult.architectureContext?.techStack || {},
        constraintsChecked: contextResult.architectureContext?.constraints?.length || 0,
        qualityGatesExecuted: qualityGatesResult.results?.totalGates || 0
      },
      recommendations: this.generateSystemRecommendations(contextResult, qualityGatesResult)
    };
  }

  /**
   * Generate system-level recommendations
   * @param {Object} contextResult - Context result
   * @param {Object} qualityGatesResult - Quality gates result
   * @returns {Array} System recommendations
   */
  generateSystemRecommendations(contextResult, qualityGatesResult) {
    const recommendations = [];

    if (!contextResult?.architectureContext?.documentPath) {
      recommendations.push({
        priority: 'CRITICAL',
        category: 'ARCHITECTURE_DOCUMENTATION',
        message: 'Create comprehensive architecture document',
        action: 'Use provided template to create ARCHITECTURE.md in project root'
      });
    }

    if (qualityGatesResult?.results?.blockingFailures > 0) {
      recommendations.push({
        priority: 'CRITICAL',
        category: 'QUALITY_GATES',
        message: `${qualityGatesResult.results.blockingFailures} blocking quality gates failed`,
        action: 'Resolve all blocking violations before proceeding with deployment'
      });
    }

    if (parseFloat(qualityGatesResult?.complianceScore || '0') < 80) {
      recommendations.push({
        priority: 'HIGH',
        category: 'COMPLIANCE_SCORE',
        message: 'Architecture compliance score below recommended threshold (80%)',
        action: 'Review and address architecture violations to improve compliance'
      });
    }

    return recommendations;
  }

  /**
   * Get comprehensive system statistics
   * @returns {Object} System statistics
   */
  getSystemStats() {
    const contextStats = architectureContextInjection.getComplianceStats();
    const gatesStats = architectureQualityGates.getExecutionStats();
    const pipelineStats = architectureValidationPipeline.getExecutionStats();

    return {
      system: {
        ...this.systemMetrics,
        uptime: this.calculateUptime(),
        successRate: this.systemMetrics.totalOperations > 0 ? 
          (this.systemMetrics.successfulOperations / this.systemMetrics.totalOperations * 100).toFixed(2) : '0.00'
      },
      contextInjection: contextStats,
      qualityGates: gatesStats,
      validationPipeline: pipelineStats,
      summary: {
        totalCompliantOperations: this.systemMetrics.successfulOperations,
        averageComplianceScore: this.calculateAverageComplianceScore(),
        mostCommonViolations: this.getMostCommonViolations(),
        systemHealth: this.getSystemHealth()
      }
    };
  }

  /**
   * Record system operation
   * @param {Object} operation - Operation record
   */
  recordOperation(operation) {
    this.systemMetrics.totalOperations++;
    if (operation.success) {
      this.systemMetrics.successfulOperations++;
    }
    this.systemMetrics.lastOperation = operation;
  }

  /**
   * Calculate system uptime
   * @returns {string} Uptime in human readable format
   */
  calculateUptime() {
    const startTime = new Date(this.systemMetrics.systemStartTime);
    const uptime = Date.now() - startTime.getTime();
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  /**
   * Calculate average compliance score across operations
   * @returns {string} Average compliance score
   */
  calculateAverageComplianceScore() {
    // This would need to be implemented based on stored operation history
    return this.systemMetrics.lastOperation?.complianceScore || '0.00';
  }

  /**
   * Get most common violations (placeholder)
   * @returns {Array} Common violations
   */
  getMostCommonViolations() {
    return [
      'Technology stack violations',
      'File naming convention violations',
      'Architecture constraint violations'
    ];
  }

  /**
   * Get overall system health status
   * @returns {string} System health
   */
  getSystemHealth() {
    const successRate = this.systemMetrics.totalOperations > 0 ? 
      this.systemMetrics.successfulOperations / this.systemMetrics.totalOperations : 1;

    if (successRate >= 0.95) return 'EXCELLENT';
    if (successRate >= 0.80) return 'GOOD';
    if (successRate >= 0.60) return 'FAIR';
    return 'NEEDS_ATTENTION';
  }

  /**
   * Reset all system metrics and clear histories
   */
  resetSystem() {
    this.systemMetrics = {
      totalOperations: 0,
      successfulOperations: 0,
      systemStartTime: new Date().toISOString(),
      lastOperation: null
    };

    architectureContextInjection.clearInjectionLog();
    architectureQualityGates.clearExecutionHistory();
    architectureValidationPipeline.resetMetrics();

    this.logger.info('Architecture Compliance System reset completed');
  }
}

// Export main system instance
export const architectureComplianceSystem = new ArchitectureComplianceSystem({
  strictMode: true,
  enableReporting: true
});

// Export individual components for advanced usage
export {
  architectureContextInjection,
  architectureQualityGates,
  architectureValidationPipeline
};

// Export main system as default
export default architectureComplianceSystem;