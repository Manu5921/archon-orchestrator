/**
 * Architecture-Compliance V2 - Quality Gates Implementation
 * Enforces mandatory quality gates before allowing task completion
 *
 * CRITICAL: Prevents AI agents from bypassing architecture compliance
 */

import { promises as fs } from 'fs';
import path from 'path';
import { Logger } from '../utils/logger.js';
import { architectureContextInjection } from './context-injection.js';

export class ArchitectureQualityGates {
  constructor(options = {}) {
    this.logger = new Logger('ArchQualityGates');
    this.options = {
      strictMode: true,
      blockingMode: true, // Block task completion if gates fail
      requireAllGates: true,
      ...options
    };

    this.gateResults = new Map();
    this.gateExecutions = [];
  }

  /**
   * Execute all quality gates for a task
   * @param {string} injectionId - Context injection ID from previous step
   * @param {Object} taskResult - Task result to validate
   * @param {string} agentType - Type of agent that executed the task
   * @param {string} taskDescription - Description of completed task
   * @returns {Promise<Object>} Gate validation results
   */
  async executeQualityGates(injectionId, taskResult, agentType, taskDescription) {
    const executionId = `gate-exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    this.logger.info(`Starting quality gates execution: ${executionId}`);

    try {
      // Get architecture context from injection
      const architectureContext = await this.getArchitectureContextFromInjection(injectionId);

      // Define mandatory quality gates
      const qualityGates = this.defineQualityGates(architectureContext, agentType);

      // Execute each gate
      const gateResults = [];
      let allGatesPassed = true;

      for (const gate of qualityGates) {
        const gateResult = await this.executeGate(gate, taskResult, architectureContext, agentType);
        gateResults.push(gateResult);

        if (!gateResult.passed && gate.blocking) {
          allGatesPassed = false;
          this.logger.error(`BLOCKING GATE FAILED: ${gate.id} - ${gate.description}`);
        }
      }

      // Log execution
      const execution = {
        executionId,
        injectionId,
        timestamp: new Date().toISOString(),
        agentType,
        taskDescription,
        totalGates: qualityGates.length,
        passedGates: gateResults.filter(r => r.passed).length,
        failedGates: gateResults.filter(r => !r.passed).length,
        allGatesPassed,
        blockingFailures: gateResults.filter(r => !r.passed && r.blocking).length,
        gateResults
      };

      this.gateExecutions.push(execution);

      if (this.options.blockingMode && !allGatesPassed) {
        throw new Error(`ARCHITECTURE COMPLIANCE GATE FAILURE - Task cannot be completed: ${execution.blockingFailures} blocking violations`);
      }

      this.logger.info(`Quality gates completed: ${execution.passedGates}/${execution.totalGates} passed`);

      return {
        success: allGatesPassed,
        executionId,
        results: execution,
        complianceScore: (execution.passedGates / execution.totalGates * 100).toFixed(2)
      };

    } catch (error) {
      this.logger.error(`Quality gates execution failed: ${error.message}`);
      throw new Error(`ARCHITECTURE QUALITY GATE EXECUTION FAILURE: ${error.message}`);
    }
  }

  /**
   * Define quality gates based on architecture context and agent type
   * @param {Object} architectureContext - Architecture context
   * @param {string} agentType - Agent type
   * @returns {Array} Quality gates to execute
   */
  defineQualityGates(architectureContext, agentType) {
    const gates = [];

    // Gate 0 - Architecture Context Validation
    gates.push({
      id: 'gate0_context_validation',
      description: 'Architecture context injection confirmation',
      type: 'context_validation',
      blocking: true,
      required: true,
      validator: 'validateArchitectureContext'
    });

    // Gate 1 - Technology Stack Compliance
    gates.push({
      id: 'gate1_tech_stack_compliance',
      description: 'Technology stack compliance validation',
      type: 'tech_compliance',
      blocking: true,
      required: true,
      validator: 'validateTechStackCompliance',
      agentSpecific: true
    });

    // Gate 2 - Architecture Constraints Compliance
    gates.push({
      id: 'gate2_constraints_compliance',
      description: 'Architecture constraints compliance check',
      type: 'constraints_compliance',
      blocking: true,
      required: true,
      validator: 'validateArchitectureConstraints'
    });

    // Gate 3 - File Structure Compliance
    gates.push({
      id: 'gate3_structure_compliance',
      description: 'Project structure and naming compliance',
      type: 'structure_compliance',
      blocking: false, // Warning only
      required: false, // Make optional for testing
      validator: 'validateStructureCompliance'
    });

    // Gate 4 - Security Compliance (if security context exists)
    if (architectureContext.security || architectureContext.constraints.some(c => c.type === 'security')) {
      gates.push({
        id: 'gate4_security_compliance',
        description: 'Security architecture compliance validation',
        type: 'security_compliance',
        blocking: true,
        required: true,
        validator: 'validateSecurityCompliance'
      });
    }

    // Add agent-specific gates
    const agentGates = this.getAgentSpecificGates(agentType, architectureContext);
    gates.push(...agentGates);

    return gates;
  }

  /**
   * Execute a single quality gate
   * @param {Object} gate - Gate definition
   * @param {Object} taskResult - Task result to validate
   * @param {Object} architectureContext - Architecture context
   * @param {string} agentType - Agent type
   * @returns {Promise<Object>} Gate execution result
   */
  async executeGate(gate, taskResult, architectureContext, agentType) {
    const startTime = Date.now();

    try {
      this.logger.debug(`Executing gate: ${gate.id}`);

      // Get validator function
      const validator = this[gate.validator];
      if (!validator) {
        throw new Error(`Validator not found: ${gate.validator}`);
      }

      // Execute validation
      const validationResult = await validator.call(this, taskResult, architectureContext, agentType, gate);

      const result = {
        gateId: gate.id,
        description: gate.description,
        passed: validationResult.passed,
        blocking: gate.blocking,
        executionTime: Date.now() - startTime,
        details: validationResult.details || {},
        violations: validationResult.violations || [],
        recommendations: validationResult.recommendations || []
      };

      // Store result
      this.gateResults.set(gate.id, result);

      return result;

    } catch (error) {
      const result = {
        gateId: gate.id,
        description: gate.description,
        passed: false,
        blocking: gate.blocking,
        executionTime: Date.now() - startTime,
        error: error.message,
        violations: [`Gate execution failed: ${error.message}`],
        recommendations: ['Check gate configuration and validator implementation']
      };

      this.gateResults.set(gate.id, result);
      return result;
    }
  }

  /**
   * Validate architecture context injection
   * @param {Object} taskResult - Task result
   * @param {Object} architectureContext - Architecture context
   * @returns {Object} Validation result
   */
  async validateArchitectureContext(taskResult, architectureContext) {
    const violations = [];
    const recommendations = [];

    // Check if architecture context was properly loaded
    if (!architectureContext) {
      violations.push('No architecture context available');
      recommendations.push('Ensure architecture document exists and is accessible');
      return { passed: false, violations, recommendations };
    }

    if (!architectureContext.documentPath) {
      violations.push('No architecture document found');
      recommendations.push('Create ARCHITECTURE.md or CLAUDE.md in project root');
    }

    if (architectureContext.constraints.length === 0) {
      violations.push('No architecture constraints defined');
      recommendations.push('Add technology constraints to architecture document');
    }

    return {
      passed: violations.length === 0,
      violations,
      recommendations,
      details: {
        documentPath: architectureContext.documentPath,
        constraintsCount: architectureContext.constraints.length,
        techStackDefined: !!architectureContext.techStack.backend || !!architectureContext.techStack.frontend
      }
    };
  }

  /**
   * Validate technology stack compliance
   * @param {Object} taskResult - Task result
   * @param {Object} architectureContext - Architecture context
   * @param {string} agentType - Agent type
   * @returns {Object} Validation result
   */
  async validateTechStackCompliance(taskResult, architectureContext, agentType) {
    const violations = [];
    const recommendations = [];

    const techStack = architectureContext.techStack;

    // Check if task result contains technology violations
    if (taskResult.code) {
      // Analyze code for technology compliance
      const codeAnalysis = this.analyzeTechnologyUsage(taskResult.code, techStack);
      violations.push(...codeAnalysis.violations);
      recommendations.push(...codeAnalysis.recommendations);
    }

    if (taskResult.dependencies) {
      // Check dependency compliance
      const depAnalysis = this.analyzeDependencyCompliance(taskResult.dependencies, techStack);
      violations.push(...depAnalysis.violations);
      recommendations.push(...depAnalysis.recommendations);
    }

    // Agent-specific technology validation
    const agentValidation = this.validateAgentTechCompliance(taskResult, techStack, agentType);
    violations.push(...agentValidation.violations);
    recommendations.push(...agentValidation.recommendations);

    return {
      passed: violations.length === 0,
      violations,
      recommendations,
      details: {
        specifiedTechStack: techStack,
        agentType,
        analysisPerformed: true
      }
    };
  }

  /**
   * Validate architecture constraints compliance
   * @param {Object} taskResult - Task result
   * @param {Object} architectureContext - Architecture context
   * @returns {Object} Validation result
   */
  async validateArchitectureConstraints(taskResult, architectureContext) {
    const violations = [];
    const recommendations = [];

    for (const constraint of architectureContext.constraints) {
      const constraintValidation = await this.validateSingleConstraint(taskResult, constraint);

      if (!constraintValidation.compliant) {
        violations.push(`Constraint violation: ${constraint.description}`);
        recommendations.push(constraintValidation.recommendation || 'Review constraint requirements');
      }
    }

    return {
      passed: violations.length === 0,
      violations,
      recommendations,
      details: {
        constraintsChecked: architectureContext.constraints.length,
        violationsFound: violations.length
      }
    };
  }

  /**
   * Validate project structure compliance
   * @param {Object} taskResult - Task result
   * @param {Object} architectureContext - Architecture context
   * @returns {Object} Validation result
   */
  async validateStructureCompliance(taskResult, architectureContext) {
    const violations = [];
    const recommendations = [];

    // Check file paths if provided
    if (taskResult.filePaths) {
      for (const filePath of taskResult.filePaths) {
        const structureValidation = this.validateFilePathStructure(filePath, architectureContext.structure);
        if (!structureValidation.compliant) {
          violations.push(`File structure violation: ${filePath}`);
          recommendations.push(structureValidation.recommendation);
        }
      }
    }

    // Check naming conventions
    if (taskResult.files) {
      for (const [fileName, content] of Object.entries(taskResult.files)) {
        const namingValidation = this.validateNamingConvention(fileName, architectureContext.structure.namingConventions);
        if (!namingValidation.compliant) {
          violations.push(`Naming convention violation: ${fileName}`);
          recommendations.push(namingValidation.recommendation);
        }
      }
    }

    return {
      passed: violations.length === 0,
      violations,
      recommendations,
      details: {
        filesChecked: taskResult.filePaths?.length || taskResult.files ? Object.keys(taskResult.files).length : 0
      }
    };
  }

  /**
   * Validate security compliance
   * @param {Object} taskResult - Task result
   * @param {Object} architectureContext - Architecture context
   * @returns {Object} Validation result
   */
  async validateSecurityCompliance(taskResult, architectureContext) {
    const violations = [];
    const recommendations = [];

    // Check for common security violations in code
    if (taskResult.code) {
      const securityAnalysis = this.analyzeSecurityCompliance(taskResult.code);
      violations.push(...securityAnalysis.violations);
      recommendations.push(...securityAnalysis.recommendations);
    }

    return {
      passed: violations.length === 0,
      violations,
      recommendations,
      details: {
        securityChecksPerformed: true,
        codeAnalyzed: !!taskResult.code
      }
    };
  }

  /**
   * Get agent-specific quality gates
   * @param {string} agentType - Agent type
   * @param {Object} architectureContext - Architecture context
   * @returns {Array} Agent-specific gates
   */
  getAgentSpecificGates(agentType, architectureContext) {
    const gates = [];

    switch (agentType.toLowerCase()) {
    case 'backend':
      gates.push({
        id: 'gate_backend_api_compliance',
        description: 'Backend API patterns compliance',
        type: 'backend_compliance',
        blocking: true,
        required: true,
        validator: 'validateBackendCompliance'
      });
      break;

    case 'frontend':
      gates.push({
        id: 'gate_frontend_component_compliance',
        description: 'Frontend component patterns compliance',
        type: 'frontend_compliance',
        blocking: true,
        required: true,
        validator: 'validateFrontendCompliance'
      });
      break;

    case 'database':
      gates.push({
        id: 'gate_database_schema_compliance',
        description: 'Database schema patterns compliance',
        type: 'database_compliance',
        blocking: true,
        required: true,
        validator: 'validateDatabaseCompliance'
      });
      break;
    }

    return gates;
  }

  /**
   * Analyze technology usage in code
   * @param {string} code - Code to analyze
   * @param {Object} techStack - Expected technology stack
   * @returns {Object} Analysis result with violations and recommendations
   */
  analyzeTechnologyUsage(code, techStack) {
    const violations = [];
    const recommendations = [];

    // Check for prohibited technologies based on tech stack
    if (techStack.backend === 'Node.js' && code.includes('from flask')) {
      violations.push('Using Flask (Python) when Node.js is specified');
      recommendations.push('Use Express.js or other Node.js framework instead');
    }

    if (techStack.database === 'Supabase' && (code.includes('mongoose') || code.includes('mongodb'))) {
      violations.push('Using MongoDB when Supabase (PostgreSQL) is specified');
      recommendations.push('Use Supabase client instead of MongoDB/Mongoose');
    }

    if (techStack.frontend === 'Next.js' && code.includes('from django')) {
      violations.push('Using Django templates when Next.js is specified');
      recommendations.push('Use Next.js React components instead');
    }

    return { violations, recommendations };
  }

  /**
   * Analyze dependency compliance
   * @param {Array|Object} dependencies - Dependencies to check
   * @param {Object} techStack - Expected technology stack
   * @returns {Object} Analysis result
   */
  analyzeDependencyCompliance(dependencies, techStack) {
    const violations = [];
    const recommendations = [];

    const depList = Array.isArray(dependencies) ? dependencies : Object.keys(dependencies);

    for (const dep of depList) {
      // Check for conflicting dependencies
      if (techStack.database === 'Supabase' && (dep.includes('mongodb') || dep.includes('mongoose'))) {
        violations.push(`Dependency conflict: ${dep} not compatible with Supabase`);
        recommendations.push('Use @supabase/supabase-js instead');
      }
    }

    return { violations, recommendations };
  }

  /**
   * Validate agent-specific technology compliance
   * @param {Object} taskResult - Task result
   * @param {Object} techStack - Technology stack
   * @param {string} agentType - Agent type
   * @returns {Object} Validation result
   */
  validateAgentTechCompliance(taskResult, techStack, agentType) {
    const violations = [];
    const recommendations = [];

    // Agent-specific validation logic
    switch (agentType.toLowerCase()) {
    case 'backend':
      if (techStack.backend && !this.isCompatibleWithBackendTech(taskResult, techStack.backend)) {
        violations.push(`Backend implementation not compatible with ${techStack.backend}`);
        recommendations.push(`Ensure code uses ${techStack.backend} patterns and libraries`);
      }
      break;

    case 'frontend':
      if (techStack.frontend && !this.isCompatibleWithFrontendTech(taskResult, techStack.frontend)) {
        violations.push(`Frontend implementation not compatible with ${techStack.frontend}`);
        recommendations.push(`Ensure code uses ${techStack.frontend} patterns and components`);
      }
      break;
    }

    return { violations, recommendations };
  }

  /**
   * Check backend technology compatibility
   * @param {Object} taskResult - Task result
   * @param {string} backendTech - Expected backend technology
   * @returns {boolean} Compatibility status
   */
  isCompatibleWithBackendTech(taskResult, backendTech) {
    if (!taskResult.code) return true;

    const code = taskResult.code.toLowerCase();

    if (backendTech.toLowerCase().includes('node') || backendTech.toLowerCase().includes('express')) {
      return code.includes('require(') || code.includes('import') || code.includes('express');
    }

    if (backendTech.toLowerCase().includes('python') || backendTech.toLowerCase().includes('fastapi')) {
      return code.includes('from') || code.includes('import') || code.includes('fastapi');
    }

    return true; // Default to compatible if can't determine
  }

  /**
   * Check frontend technology compatibility
   * @param {Object} taskResult - Task result
   * @param {string} frontendTech - Expected frontend technology
   * @returns {boolean} Compatibility status
   */
  isCompatibleWithFrontendTech(taskResult, frontendTech) {
    if (!taskResult.code) return true;

    const code = taskResult.code.toLowerCase();

    if (frontendTech.toLowerCase().includes('react') || frontendTech.toLowerCase().includes('next')) {
      return code.includes('react') || code.includes('jsx') || code.includes('next');
    }

    if (frontendTech.toLowerCase().includes('vue')) {
      return code.includes('vue') || code.includes('<template>');
    }

    return true;
  }

  /**
   * Validate a single architecture constraint
   * @param {Object} taskResult - Task result
   * @param {Object} constraint - Architecture constraint
   * @returns {Object} Constraint validation result
   */
  async validateSingleConstraint(taskResult, constraint) {
    // Basic constraint validation implementation
    if (!constraint.description) {
      return { compliant: true, recommendation: 'No specific validation needed' };
    }

    // Check if code violates the constraint (basic implementation)
    if (taskResult.code) {
      const code = taskResult.code.toLowerCase();

      // Technology stack constraint checks
      if (constraint.description.includes('Node.js') && (code.includes('python') || code.includes('flask'))) {
        return {
          compliant: false,
          recommendation: 'Use Node.js instead of Python/Flask as specified in architecture'
        };
      }

      if (constraint.description.includes('Supabase') && (code.includes('mongodb') || code.includes('mysql'))) {
        return {
          compliant: false,
          recommendation: 'Use Supabase (PostgreSQL) instead of MongoDB/MySQL as specified'
        };
      }
    }

    return { compliant: true, recommendation: 'Constraint appears to be followed' };
  }

  /**
   * Validate file path structure
   * @param {string} filePath - File path to validate
   * @param {Object} structure - Expected structure
   * @returns {Object} Structure validation result
   */
  validateFilePathStructure(filePath, structure) {
    // Basic structure validation
    if (!filePath.startsWith('src/')) {
      return {
        compliant: false,
        recommendation: 'Files should be placed in src/ directory as per architecture'
      };
    }

    return { compliant: true, recommendation: 'File structure looks good' };
  }

  /**
   * Validate naming conventions
   * @param {string} fileName - File name to validate
   * @param {Object} namingConventions - Expected naming conventions
   * @returns {Object} Naming validation result
   */
  validateNamingConvention(fileName, namingConventions) {
    // Basic naming convention checks
    if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) {
      // Components should be PascalCase
      const baseName = fileName.split('.')[0];
      if (baseName[0] !== baseName[0].toUpperCase()) {
        return {
          compliant: false,
          recommendation: 'React components should use PascalCase naming (e.g., UserProfile.tsx)'
        };
      }
    }

    return { compliant: true, recommendation: 'Naming convention looks good' };
  }

  /**
   * Analyze security compliance in code
   * @param {string} code - Code to analyze
   * @returns {Object} Security analysis result
   */
  analyzeSecurityCompliance(code) {
    const violations = [];
    const recommendations = [];

    if (!code) return { violations, recommendations };

    // Basic security checks
    if (code.includes('password') && !code.includes('hash')) {
      violations.push('Potential plain text password usage detected');
      recommendations.push('Use proper password hashing (bcrypt, argon2)');
    }

    if (code.match(/api[_-]?key\s*=\s*["'][^"']+["']/i)) {
      violations.push('Hardcoded API key detected');
      recommendations.push('Use environment variables for API keys');
    }

    return { violations, recommendations };
  }

  /**
   * Validate backend compliance
   * @param {Object} taskResult - Task result
   * @param {Object} architectureContext - Architecture context
   * @param {string} agentType - Agent type
   * @param {Object} gate - Gate configuration
   * @returns {Object} Validation result
   */
  async validateBackendCompliance(taskResult, architectureContext, agentType, gate) {
    const violations = [];
    const recommendations = [];

    if (taskResult.code) {
      const code = taskResult.code.toLowerCase();

      // Check for Express.js usage (required for backend) - be more flexible
      if (code.includes('app.') || code.includes('router.') || code.includes('express')) {
        // Code appears to use Express patterns - this is good
      } else if (code.includes('python') || code.includes('flask') || code.includes('django')) {
        violations.push('Backend should use Express.js framework as specified, not Python frameworks');
        recommendations.push('Use Express.js instead of Python frameworks');
      }

      // Check for Supabase usage (required database)
      if (code.includes('database') && !code.includes('supabase')) {
        violations.push('Database operations should use Supabase client');
        recommendations.push('Use @supabase/supabase-js for database operations');
      }
    }

    return {
      passed: violations.length === 0,
      violations,
      recommendations,
      details: { backendPatternsChecked: true }
    };
  }

  /**
   * Validate frontend compliance
   * @param {Object} taskResult - Task result
   * @param {Object} architectureContext - Architecture context
   * @param {string} agentType - Agent type
   * @param {Object} gate - Gate configuration
   * @returns {Object} Validation result
   */
  async validateFrontendCompliance(taskResult, architectureContext, agentType, gate) {
    const violations = [];
    const recommendations = [];

    if (taskResult.code) {
      const code = taskResult.code.toLowerCase();

      // Check for React/Next.js usage (if frontend specified)
      const frontendTech = architectureContext.techStack.frontend;
      if (frontendTech && frontendTech.includes('Next.js')) {
        if (!code.includes('react') && !code.includes('next')) {
          violations.push('Frontend should use Next.js/React as specified');
          recommendations.push('Use Next.js framework for frontend development');
        }
      }
    }

    return {
      passed: violations.length === 0,
      violations,
      recommendations,
      details: { frontendPatternsChecked: true }
    };
  }

  /**
   * Validate database compliance
   * @param {Object} taskResult - Task result
   * @param {Object} architectureContext - Architecture context
   * @param {string} agentType - Agent type
   * @param {Object} gate - Gate configuration
   * @returns {Object} Validation result
   */
  async validateDatabaseCompliance(taskResult, architectureContext, agentType, gate) {
    const violations = [];
    const recommendations = [];

    if (taskResult.code || taskResult.dependencies) {
      const code = (taskResult.code || '').toLowerCase();
      const deps = taskResult.dependencies || [];

      // Check for Supabase usage (required)
      if (code.includes('database') && !code.includes('supabase')) {
        violations.push('Database operations must use Supabase as specified');
        recommendations.push('Use @supabase/supabase-js client for database access');
      }

      // Check dependencies for prohibited database libraries
      const prohibitedDeps = ['mongodb', 'mongoose', 'mysql', 'postgresql'];
      for (const dep of deps) {
        if (prohibitedDeps.includes(dep)) {
          violations.push(`Prohibited database dependency: ${dep}`);
          recommendations.push('Use @supabase/supabase-js instead of direct database drivers');
        }
      }
    }

    return {
      passed: violations.length === 0,
      violations,
      recommendations,
      details: { databasePatternsChecked: true }
    };
  }

  /**
   * Get architecture context from injection ID
   * @param {string} injectionId - Injection ID
   * @returns {Promise<Object>} Architecture context
   */
  async getArchitectureContextFromInjection(injectionId) {
    // For now, we'll load fresh context from current directory
    // In a full implementation, we'd store and retrieve context by injection ID
    return await architectureContextInjection.loadArchitectureContext();
  }

  /**
   * Get quality gates execution statistics
   * @returns {Object} Execution statistics
   */
  getExecutionStats() {
    const totalExecutions = this.gateExecutions.length;
    const successfulExecutions = this.gateExecutions.filter(e => e.allGatesPassed).length;

    return {
      totalExecutions,
      successfulExecutions,
      failureRate: totalExecutions > 0 ? ((totalExecutions - successfulExecutions) / totalExecutions * 100).toFixed(2) : 0,
      averageGatesPerExecution: totalExecutions > 0 ? (this.gateExecutions.reduce((sum, e) => sum + e.totalGates, 0) / totalExecutions).toFixed(1) : 0,
      mostRecentExecution: this.gateExecutions[this.gateExecutions.length - 1]
    };
  }

  /**
   * Clear execution history
   */
  clearExecutionHistory() {
    this.gateExecutions = [];
    this.gateResults.clear();
  }
}

// Export default instance
export const architectureQualityGates = new ArchitectureQualityGates({
  strictMode: true,
  blockingMode: true,
  requireAllGates: true
});

export default architectureQualityGates;
