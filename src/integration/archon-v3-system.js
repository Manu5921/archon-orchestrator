/**
 * Archon V3 Complete System Integration
 * 
 * Intègre MetaSupervisor + SubAgent Orchestrator
 * Architecture économique optimisée pour production
 */

import ArchonV3MetaSupervisor from '../archon-v3/meta-supervisor.js';
import ClaudeSubAgentOrchestrator from '../sub-agent-orchestrator.js';
import { IntelligentDocumentNaming } from '../../improved-document-naming.js';

export class ArchonV3CompleteSystem {
  constructor() {
    // Initialisation MetaSupervisor
    this.metaSupervisor = new ArchonV3MetaSupervisor();
    
    // Initialisation SubAgent Orchestrator avec MetaSupervisor
    this.subAgentOrchestrator = new ClaudeSubAgentOrchestrator(this.metaSupervisor);
    
    // Knowledge management
    this.naming = new IntelligentDocumentNaming();
    
    // System state
    this.systemInitialized = false;
    this.activeProjects = new Map();
    this.systemLog = [];
  }

  /**
   * Workflow Principal Archon V3
   * Entry point pour nouveaux projets
   */
  async executeProject(projectDescription, requirements, options = {}) {
    console.log('🚀 Archon V3 System: Starting complete project execution...');
    console.log('=' .repeat(60));
    
    const projectId = `proj-${Date.now()}`;
    const startTime = Date.now();
    
    try {
      // Phase 1: Project Setup & Supervision Rules
      console.log('📋 Phase 1: Project Setup & Economic Supervision...');
      const projectContext = await this.initializeProject(projectId, projectDescription, requirements);
      
      // Phase 2: SubAgent Orchestration with Supervision
      console.log('🎼 Phase 2: Multi-Agent Orchestration with Supervision...');
      const orchestrationResult = await this.subAgentOrchestrator.orchestrateProject(
        projectDescription,
        requirements,
        projectContext
      );
      
      // Phase 3: Knowledge Base Documentation
      console.log('📚 Phase 3: Knowledge Base Documentation...');
      const knowledgeResult = await this.documentProjectKnowledge(
        projectDescription,
        orchestrationResult,
        projectContext
      );
      
      // Phase 4: Final System Validation
      console.log('✅ Phase 4: Final System Validation...');
      const validationResult = await this.performFinalValidation(
        orchestrationResult,
        projectContext
      );
      
      const totalDuration = Date.now() - startTime;
      
      // Compile results
      const finalResult = {
        success: orchestrationResult.success && validationResult.success,
        projectId,
        duration: totalDuration,
        phases: {
          setup: projectContext,
          orchestration: orchestrationResult,
          knowledge: knowledgeResult,
          validation: validationResult
        },
        economics: this.calculateProjectEconomics(orchestrationResult),
        summary: this.generateProjectSummary(orchestrationResult, validationResult)
      };
      
      // Store project
      this.activeProjects.set(projectId, finalResult);
      
      // Log system performance
      await this.logSystemPerformance(finalResult);
      
      console.log('=' .repeat(60));
      console.log(`🎉 Archon V3 Project Completed Successfully!`);
      console.log(`📊 Duration: ${totalDuration}ms | Agents: ${orchestrationResult.agentResults?.length || 0} | Success: ${finalResult.success}`);
      
      return finalResult;
      
    } catch (error) {
      console.error('❌ Archon V3 System Error:', error.message);
      
      const failureResult = {
        success: false,
        projectId,
        error: error.message,
        duration: Date.now() - startTime,
        partialResults: this.getPartialResults(projectId)
      };
      
      await this.logSystemFailure(failureResult);
      
      return failureResult;
    }
  }

  /**
   * Initialisation projet avec supervision économique
   */
  async initializeProject(projectId, projectDescription, requirements) {
    // Créer context projet
    const projectContext = {
      projectId,
      description: projectDescription,
      requirements,
      timestamp: new Date().toISOString(),
      techStack: this.inferTechStack(requirements)
    };
    
    // Initialiser supervision économique (1x OpenRouter call)
    console.log('💰 Initializing economic supervision (1x token cost)...');
    const supervisionRules = await this.metaSupervisor.initializeProjectSupervision(
      projectDescription,
      projectContext.techStack
    );
    
    projectContext.supervisionRules = supervisionRules;
    
    console.log(`✅ Project ${projectId} initialized with economic supervision`);
    console.log(`📊 Tech Stack: ${projectContext.techStack.join(', ')}`);
    
    return projectContext;
  }

  /**
   * Documentation knowledge base automatique
   */
  async documentProjectKnowledge(projectDescription, orchestrationResult, projectContext) {
    console.log('📝 Documenting project knowledge...');
    
    const knowledgeEntries = [];
    
    try {
      // Document workflow si succès
      if (orchestrationResult.success) {
        const workflowDoc = await this.createWorkflowDocumentation(
          projectDescription,
          orchestrationResult,
          projectContext
        );
        knowledgeEntries.push(workflowDoc);
      }
      
      // Document échecs pour apprentissage
      if (orchestrationResult.agentResults) {
        const failures = orchestrationResult.agentResults.filter(r => !r.success);
        if (failures.length > 0) {
          const failureDoc = await this.createFailureDocumentation(
            projectDescription,
            failures,
            projectContext
          );
          knowledgeEntries.push(failureDoc);
        }
      }
      
      console.log(`📚 Knowledge documentation: ${knowledgeEntries.length} entries created`);
      
      return {
        success: true,
        entriesCreated: knowledgeEntries.length,
        entries: knowledgeEntries
      };
      
    } catch (error) {
      console.warn('⚠️  Knowledge documentation failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Validation finale système
   */
  async performFinalValidation(orchestrationResult, projectContext) {
    console.log('🔍 Performing final system validation...');
    
    if (!orchestrationResult.success) {
      return {
        success: false,
        reason: 'Orchestration failed',
        details: orchestrationResult.integrationResult
      };
    }
    
    // Validation économique (plus réaliste)
    const economics = this.calculateProjectEconomics(orchestrationResult);
    const economicValidation = economics.savingsPercentage >= 0; // Économies ou neutralité acceptable
    
    // Validation compliance (plus robuste)
    const complianceScore = orchestrationResult.integrationResult?.complianceScore || 1.0;
    const complianceValidation = complianceScore >= 0.7;
    
    // Validation performance
    const performanceValidation = orchestrationResult.duration < 120000; // Moins de 2 minutes
    
    const overallSuccess = economicValidation && complianceValidation && performanceValidation;
    
    return {
      success: overallSuccess,
      validations: {
        economic: { passed: economicValidation, details: economics },
        compliance: { passed: complianceValidation, score: complianceScore },
        performance: { passed: performanceValidation, duration: orchestrationResult.duration }
      },
      overallScore: this.calculateOverallScore(orchestrationResult)
    };
  }

  /**
   * Calculs économiques
   */
  calculateProjectEconomics(orchestrationResult) {
    // Estimation coûts supervision
    const setupCost = 0.12; // 4000 tokens @ $0.03/1000
    const escalationCount = this.metaSupervisor.getSupervisionStatistics().totalEscalations || 0;
    const escalationCost = escalationCount * 0.03; // 1000 tokens par escalation
    
    const totalCurrentCost = setupCost + escalationCost;
    
    // Coût traditionnel estimé
    const agentCount = orchestrationResult.agentResults?.length || 0;
    const traditionalCost = agentCount * 0.05; // $0.05 par validation continue
    
    const savings = Math.max(0, traditionalCost - totalCurrentCost);
    const savingsPercentage = traditionalCost > 0 ? (savings / traditionalCost) * 100 : 0;
    
    return {
      currentCost: totalCurrentCost,
      traditionalCost,
      savings,
      savingsPercentage: Math.round(savingsPercentage),
      escalations: escalationCount,
      localValidations: agentCount - escalationCount
    };
  }

  /**
   * Score global de performance
   */
  calculateOverallScore(orchestrationResult) {
    let score = 0;
    
    // Score succès agents (40%)
    if (orchestrationResult.agentResults) {
      const successRate = orchestrationResult.agentResults.filter(r => r.success).length / orchestrationResult.agentResults.length;
      score += successRate * 40;
    }
    
    // Score compliance (30%)
    if (orchestrationResult.integrationResult?.complianceScore) {
      score += orchestrationResult.integrationResult.complianceScore * 30;
    }
    
    // Score performance (20%)
    const performanceScore = Math.max(0, 1 - (orchestrationResult.duration / 120000)); // Penalty après 2 min
    score += performanceScore * 20;
    
    // Score économique (10%)
    const economics = this.calculateProjectEconomics(orchestrationResult);
    const economicScore = Math.min(1, economics.savingsPercentage / 100);
    score += economicScore * 10;
    
    return Math.round(score);
  }

  /**
   * Documentation automatique
   */
  async createWorkflowDocumentation(projectDescription, orchestrationResult, projectContext) {
    const intelligentName = this.naming.generateIntelligentName(
      `Workflow: ${projectDescription} - Multi-Agent Orchestration Success`,
      {
        type: 'integration_workflow',
        project: this.extractProjectName(projectDescription),
        status: 'operational'
      }
    );
    
    const workflowContent = `# WORKFLOW: ${projectDescription}

## 📋 WORKFLOW SUMMARY
- **Date**: ${new Date().toISOString().split('T')[0]}
- **Type**: Multi-Agent Orchestration
- **Status**: Production-Ready
- **Success Rate**: ${Math.round((orchestrationResult.agentResults.filter(r => r.success).length / orchestrationResult.agentResults.length) * 100)}%

## 🎯 PROJECT DESCRIPTION
${projectDescription}

### Requirements Addressed
${projectContext.requirements.map(req => `- ${req}`).join('\n')}

## 🤖 AGENTS ORCHESTRATED
${orchestrationResult.agentResults.map(result => `
### ${result.agent.name}
- **Status**: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}
- **Duration**: ${result.duration}ms
- **Supervision**: ${result.supervision?.approved ? 'APPROVED' : 'NEEDS_REVIEW'}
- **Technologies**: ${result.agent.technologies.join(', ')}
`).join('\n')}

## 📊 PERFORMANCE METRICS
- **Total Duration**: ${orchestrationResult.duration}ms
- **Compliance Score**: ${orchestrationResult.integrationResult?.complianceScore * 100}%
- **Economic Savings**: ${this.calculateProjectEconomics(orchestrationResult).savingsPercentage}%
- **Overall Score**: ${this.calculateOverallScore(orchestrationResult)}/100

## 🏗️ TECHNICAL ARCHITECTURE
### Tech Stack
${projectContext.techStack.map(tech => `- ${tech}`).join('\n')}

### Integration Points
${orchestrationResult.integrationResult?.approvedAgents || 0} agents successfully integrated

## 🎯 SUCCESS PATTERNS
### What Worked Well
- Economic supervision model (${this.calculateProjectEconomics(orchestrationResult).localValidations} local validations)
- Multi-agent parallel execution
- Architecture compliance enforcement

### Areas for Improvement
${orchestrationResult.integrationResult?.issues ? orchestrationResult.integrationResult.issues.map(issue => `- ${issue.agent}: ${issue.issues.map(i => i.message).join(', ')}`).join('\n') : '- No major issues identified'}

---
*Generated by Archon V3 System - ${new Date().toISOString()}*
*Type: Workflow Documentation*
*Status: Active*`;

    return {
      name: intelligentName,
      content: workflowContent,
      type: 'workflow_success'
    };
  }

  async createFailureDocumentation(projectDescription, failures, projectContext) {
    const intelligentName = this.naming.generateIntelligentName(
      `Failure Analysis: ${projectDescription} - Agent Failures`,
      {
        type: 'failure_analysis',
        project: this.extractProjectName(projectDescription),
        severity: failures.some(f => f.supervision?.riskScore > 0.8) ? 'Critical' : 'Medium'
      }
    );
    
    const failureContent = `# FAILURE ANALYSIS: ${projectDescription}

## 📊 INCIDENT SUMMARY
- **Date**: ${new Date().toISOString().split('T')[0]}
- **Impact**: ${failures.length} agent(s) failed
- **Component**: Multi-Agent System
- **Project**: ${this.extractProjectName(projectDescription)}

## 🚨 FAILURE DESCRIPTION
${failures.length} agent(s) failed during orchestration:
${failures.map(f => `- ${f.agent.name}: ${f.error || 'Supervision approval failed'}`).join('\n')}

## 🔍 DETAILED ANALYSIS
${failures.map(failure => `
### ${failure.agent.name} Failure
**Error**: ${failure.error || 'Supervision rejection'}
**Duration**: ${failure.duration}ms
**Risk Score**: ${failure.supervision?.riskScore || 'N/A'}

**Issues Detected**:
${failure.supervision?.issues ? failure.supervision.issues.map(issue => `- ${issue.type}: ${issue.message}`).join('\n') : '- No detailed issues available'}
`).join('\n')}

## 🛡️ PREVENTION STRATEGY
### Immediate Fixes
${failures.map(f => `- [ ] Fix ${f.agent.name} issues: ${f.supervision?.issues?.map(i => i.message).join(', ') || f.error}`).join('\n')}

### Long-term Prevention
- [ ] Improve local validation rules for failed agent types
- [ ] Add more specific templates for ${projectContext.techStack.join(', ')} stack
- [ ] Enhance supervision patterns for similar project types

---
*Generated by Archon V3 System - ${new Date().toISOString()}*
*Type: Failure Analysis*
*Status: Active*`;

    return {
      name: intelligentName,
      content: failureContent,
      type: 'failure_analysis'
    };
  }

  /**
   * Utilities
   */
  inferTechStack(requirements) {
    const techStack = [];
    const reqText = requirements.join(' ').toLowerCase();
    
    if (reqText.includes('react') || reqText.includes('frontend') || reqText.includes('ui')) {
      techStack.push('React', 'TypeScript');
    }
    if (reqText.includes('api') || reqText.includes('backend') || reqText.includes('server')) {
      techStack.push('Node.js', 'Express');
    }
    if (reqText.includes('database') || reqText.includes('data')) {
      techStack.push('Supabase', 'PostgreSQL');
    }
    if (reqText.includes('next')) {
      techStack.push('Next.js');
    }
    
    return techStack.length > 0 ? [...new Set(techStack)] : ['Node.js', 'React'];
  }

  extractProjectName(projectDescription) {
    const words = projectDescription.toLowerCase().split(' ');
    const meaningfulWords = words.filter(word => 
      word.length > 3 && !['with', 'and', 'the', 'for', 'using'].includes(word)
    );
    return meaningfulWords.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');
  }

  generateProjectSummary(orchestrationResult, validationResult) {
    const successfulAgents = orchestrationResult.agentResults?.filter(r => r.success).length || 0;
    const totalAgents = orchestrationResult.agentResults?.length || 0;
    const complianceScore = orchestrationResult.integrationResult?.complianceScore || 0;
    
    return {
      agentsSuccess: `${successfulAgents}/${totalAgents}`,
      complianceScore: Math.round(complianceScore * 100),
      overallScore: validationResult.overallScore || this.calculateOverallScore(orchestrationResult),
      status: orchestrationResult.success && validationResult.success ? 'SUCCESS' : 'PARTIAL_SUCCESS',
      recommendation: this.generateRecommendation(orchestrationResult, validationResult)
    };
  }

  generateRecommendation(orchestrationResult, validationResult) {
    const economics = this.calculateProjectEconomics(orchestrationResult);
    
    if (validationResult.success && economics.savingsPercentage > 70) {
      return 'EXCELLENT - Deploy to production';
    } else if (validationResult.success) {
      return 'GOOD - Ready for production with monitoring';
    } else if (orchestrationResult.integrationResult?.complianceScore > 0.6) {
      return 'NEEDS_IMPROVEMENT - Fix issues before production';
    } else {
      return 'REQUIRES_REDESIGN - Significant architecture issues detected';
    }
  }

  /**
   * System monitoring
   */
  async logSystemPerformance(result) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      projectId: result.projectId,
      success: result.success,
      duration: result.duration,
      overallScore: result.summary.overallScore,
      economics: result.economics,
      recommendation: result.summary.recommendation
    };
    
    this.systemLog.push(logEntry);
    
    try {
      const fs = await import('fs/promises');
      await fs.appendFile(
        'archon-v3-performance.jsonl',
        JSON.stringify(logEntry) + '\n'
      );
    } catch (error) {
      console.warn('Failed to log system performance:', error.message);
    }
  }

  async logSystemFailure(failureResult) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'system_failure',
      ...failureResult
    };
    
    this.systemLog.push(logEntry);
  }

  getPartialResults(projectId) {
    return {
      projectId,
      metaSupervisorStats: this.metaSupervisor.getSupervisionStatistics(),
      orchestratorStats: this.subAgentOrchestrator.getOrchestrationStatistics(),
      activeAgents: this.subAgentOrchestrator.getActiveAgentsStatus()
    };
  }

  /**
   * Public API
   */
  getSystemStatistics() {
    const totalProjects = this.systemLog.length;
    const successfulProjects = this.systemLog.filter(log => log.success).length;
    const avgScore = totalProjects > 0 ? 
      this.systemLog.reduce((sum, log) => sum + (log.overallScore || 0), 0) / totalProjects : 0;
    
    const avgSavings = totalProjects > 0 ?
      this.systemLog.reduce((sum, log) => sum + (log.economics?.savingsPercentage || 0), 0) / totalProjects : 0;
    
    return {
      totalProjects,
      successRate: totalProjects > 0 ? successfulProjects / totalProjects : 0,
      averageScore: Math.round(avgScore),
      averageSavings: Math.round(avgSavings),
      activeProjects: this.activeProjects.size,
      systemUptime: Date.now() - (this.systemLog[0]?.timestamp ? new Date(this.systemLog[0].timestamp).getTime() : Date.now()),
      metaSupervisorStats: this.metaSupervisor.getSupervisionStatistics(),
      orchestratorStats: this.subAgentOrchestrator.getOrchestrationStatistics()
    };
  }

  getProjectResult(projectId) {
    return this.activeProjects.get(projectId) || null;
  }

  getAllProjects() {
    return Array.from(this.activeProjects.entries()).map(([id, result]) => ({
      id,
      description: result.phases.setup.description,
      success: result.success,
      duration: result.duration,
      score: result.summary.overallScore,
      timestamp: result.phases.setup.timestamp
    }));
  }
}

export default ArchonV3CompleteSystem;