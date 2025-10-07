/**
 * Claude SubAgent Orchestrator
 * 
 * Coordinates multiple Claude sub-agents with MetaSupervisor integration
 * Optimizes workflow performance and ensures architecture compliance
 */

export class ClaudeSubAgentOrchestrator {
  constructor(metaSupervisor) {
    this.metaSupervisor = metaSupervisor;
    this.activeAgents = new Map();
    this.agentQueue = [];
    this.orchestrationLog = [];
    this.maxConcurrentAgents = 5;
    
    // Agent types disponibles
    this.agentTypes = {
      frontend: {
        name: 'Frontend Agent',
        type: 'frontend',
        technologies: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
        priority: 1,
        averageDuration: 15000 // ms
      },
      backend: {
        name: 'Backend Agent',
        type: 'backend',
        technologies: ['Node.js', 'Express', 'API', 'Authentication'],
        priority: 1,
        averageDuration: 20000
      },
      database: {
        name: 'Database Agent',
        type: 'database',
        technologies: ['Supabase', 'PostgreSQL', 'Schema', 'Migrations'],
        priority: 2,
        averageDuration: 10000
      },
      testing: {
        name: 'Testing Agent',
        type: 'testing',
        technologies: ['Jest', 'Cypress', 'Playwright', 'Unit Tests'],
        priority: 3,
        averageDuration: 12000
      },
      devops: {
        name: 'DevOps Agent',
        type: 'devops',
        technologies: ['Docker', 'GitHub Actions', 'CI/CD', 'Deployment'],
        priority: 4,
        averageDuration: 8000
      },
      security: {
        name: 'Security Agent',
        type: 'security',
        technologies: ['Authentication', 'Authorization', 'CORS', 'Validation'],
        priority: 2,
        averageDuration: 15000
      }
    };
  }

  /**
   * Orchestration principale multi-agents
   */
  async orchestrateProject(projectDescription, requirements, projectContext) {
    console.log('🎼 SubAgent Orchestrator: Starting project orchestration...');
    
    const startTime = Date.now();
    
    try {
      // Phase 1: Initialisation supervision projet
      console.log('📋 Phase 1: Project supervision initialization...');
      await this.initializeProjectSupervision(projectDescription, requirements, projectContext);
      
      // Phase 2: Planification agents
      console.log('🎯 Phase 2: Agent planning and prioritization...');
      const agentPlan = await this.planAgentExecution(requirements);
      
      // Phase 3: Exécution parallèle avec supervision
      console.log('⚡ Phase 3: Parallel agent execution with supervision...');
      const executionResults = await this.executeAgentsWithSupervision(agentPlan, projectContext);
      
      // Phase 4: Intégration et validation finale
      console.log('🔗 Phase 4: Integration and final validation...');
      const integrationResult = await this.integrateAndValidate(executionResults, projectContext);
      
      const totalDuration = Date.now() - startTime;
      
      // Documentation résultats
      await this.documentOrchestrationResult({
        projectDescription,
        agentsUsed: agentPlan.length,
        totalDuration,
        success: integrationResult.success,
        complianceScore: integrationResult.complianceScore
      });
      
      console.log(`✅ Project orchestration completed in ${totalDuration}ms`);
      
      return {
        success: true,
        duration: totalDuration,
        agentResults: executionResults,
        integrationResult,
        statistics: this.getOrchestrationStatistics()
      };
      
    } catch (error) {
      console.error('❌ Project orchestration failed:', error.message);
      return {
        success: false,
        error: error.message,
        partialResults: this.getPartialResults()
      };
    }
  }

  /**
   * Initialisation supervision projet
   */
  async initializeProjectSupervision(projectDescription, requirements, projectContext) {
    const techStack = this.inferTechStack(requirements);
    
    // Initialiser MetaSupervisor avec context projet
    const supervisionRules = await this.metaSupervisor.initializeProjectSupervision(
      projectDescription,
      techStack
    );
    
    // Cache context pour tous les agents
    this.projectSupervisionContext = {
      projectId: projectContext.projectId,
      description: projectDescription,
      techStack,
      rules: supervisionRules,
      requirements
    };
    
    return supervisionRules;
  }

  /**
   * Planification intelligente des agents
   */
  async planAgentExecution(requirements) {
    const requiredAgents = this.determineRequiredAgents(requirements);
    
    // Tri par priorité et dépendances
    const sortedAgents = this.prioritizeAgents(requiredAgents);
    
    // Optimisation pour exécution parallèle
    const executionPlan = this.optimizeForParallelExecution(sortedAgents);
    
    console.log(`📊 Agent execution plan: ${executionPlan.length} agents in ${executionPlan.phases} phases`);
    
    return executionPlan;
  }

  /**
   * Exécution agents avec supervision continue
   */
  async executeAgentsWithSupervision(agentPlan, projectContext) {
    const results = [];
    const phases = this.groupAgentsByPhase(agentPlan);
    
    for (let phaseIndex = 0; phaseIndex < phases.length; phaseIndex++) {
      const phase = phases[phaseIndex];
      console.log(`🔄 Executing Phase ${phaseIndex + 1}: ${phase.length} agents`);
      
      // Exécution parallèle des agents de la phase
      const phasePromises = phase.map(agent => {
        console.log(`🔧 Preparing agent: ${agent.name} (Type: ${agent.type || agent.name.toLowerCase().replace(' agent', '')})`);
        return this.executeAgentWithSupervision(agent, projectContext, results);
      });
      
      const phaseResults = await Promise.allSettled(phasePromises);
      
      // Traiter résultats de la phase
      phaseResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error(`❌ Agent ${phase[index].name || phase[index].type} failed:`, result.reason);
          results.push({
            agent: phase[index],
            success: false,
            error: result.reason?.message || result.reason
          });
        }
      });
      
      // Validation inter-phase si nécessaire
      if (phaseIndex < phases.length - 1) {
        await this.validatePhaseIntegration(results, phaseIndex + 1);
      }
    }
    
    return results;
  }

  /**
   * Exécution agent individuel avec supervision
   */
  async executeAgentWithSupervision(agent, projectContext, previousResults) {
    if (!agent || !agent.name) {
      throw new Error(`Invalid agent provided to executeAgentWithSupervision: ${JSON.stringify(agent)}`);
    }
    
    const agentType = agent.type || agent.name.toLowerCase().replace(' agent', '');
    const agentId = `${agentType}-${Date.now()}`;
    const startTime = Date.now();
    const agentName = agent.name;
    
    console.log(`🤖 Executing ${agentName}...`);
    
    try {
      // Marquer agent comme actif
      this.activeAgents.set(agentId, {
        ...agent,
        startTime,
        status: 'executing'
      });
      
      // Générer code avec context
      const generatedCode = await this.generateCodeWithAgent(agent, projectContext, previousResults);
      
      // Supervision MetaSupervisor
      const supervisionResult = await this.metaSupervisor.superviseCodeGeneration(
        generatedCode,
        agent,
        this.projectSupervisionContext
      );
      
      const duration = Date.now() - startTime;
      
      // Résultat final
      const result = {
        agentId,
        agent,
        code: generatedCode,
        supervision: supervisionResult,
        duration,
        success: supervisionResult.approved,
        timestamp: new Date().toISOString()
      };
      
      // Nettoyer agent actif
      this.activeAgents.delete(agentId);
      
      // Logger résultat
      this.orchestrationLog.push(result);
      
      console.log(`✅ ${agentName} completed in ${duration}ms (${supervisionResult.approved ? 'APPROVED' : 'NEEDS_REVIEW'})`);
      
      return result;
      
    } catch (error) {
      this.activeAgents.delete(agentId);
      console.error(`❌ ${agentName} execution failed:`, error.message);
      
      return {
        agentId,
        agent,
        success: false,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Génération code par agent (simulation)
   */
  async generateCodeWithAgent(agent, projectContext, previousResults) {
    // Simulation de génération de code par agent
    // En réalité, ici on appellerait l'agent Claude spécialisé
    
    if (!agent || !agent.name) {
      throw new Error('Invalid agent provided to generateCodeWithAgent');
    }
    
    const agentType = agent.type || agent.name.toLowerCase().replace(' agent', '');
    
    // Délai simulé basé sur complexité agent
    await new Promise(resolve => setTimeout(resolve, (agent.averageDuration || 5000) * 0.1));
    
    // Generate code based on agent type
    switch (agentType) {
      case 'frontend':
        return this.generateFrontendCode(projectContext, previousResults);
      case 'backend':
        return this.generateBackendCode(projectContext, previousResults);
      case 'database':
        return this.generateDatabaseCode(projectContext, previousResults);
      case 'testing':
        return this.generateTestingCode(projectContext, previousResults);
      case 'devops':
        return this.generateDevOpsCode(projectContext, previousResults);
      case 'security':
        return this.generateSecurityCode(projectContext, previousResults);
      default:
        return this.generateGenericCode(agent, projectContext);
    }
  }

  /**
   * Intégration et validation finale
   */
  async integrateAndValidate(executionResults, projectContext) {
    console.log('🔗 Starting final integration and validation...');
    
    const approvedResults = executionResults.filter(r => r.success && r.supervision?.approved);
    const failedResults = executionResults.filter(r => !r.success || !r.supervision?.approved);
    
    // Calculer score de compliance global
    const complianceScore = approvedResults.length / executionResults.length;
    
    // Intégration des codes approuvés
    const integratedCode = await this.integrateApprovedCode(approvedResults);
    
    // Validation finale du système complet
    const finalValidation = await this.metaSupervisor.superviseCodeGeneration(
      integratedCode,
      { type: 'integration', name: 'System Integration' },
      this.projectSupervisionContext
    );
    
    return {
      success: complianceScore >= 0.8 && finalValidation.approved,
      complianceScore,
      approvedAgents: approvedResults.length,
      failedAgents: failedResults.length,
      integratedCode,
      finalValidation,
      issues: failedResults.map(r => ({
        agent: r.agent.name,
        issues: r.supervision?.issues || [{ message: r.error }]
      }))
    };
  }

  /**
   * Utility functions pour planification
   */
  inferTechStack(requirements) {
    const techStack = [];
    const reqText = requirements.join(' ').toLowerCase();
    
    // Frontend
    if (reqText.includes('react') || reqText.includes('frontend') || reqText.includes('ui')) {
      techStack.push('React', 'TypeScript', 'Next.js');
    }
    
    // Backend
    if (reqText.includes('api') || reqText.includes('backend') || reqText.includes('server')) {
      techStack.push('Node.js', 'Express');
    }
    
    // Database
    if (reqText.includes('database') || reqText.includes('data') || reqText.includes('storage')) {
      techStack.push('Supabase', 'PostgreSQL');
    }
    
    // Default stack si rien détecté
    if (techStack.length === 0) {
      techStack.push('Node.js', 'Express', 'React', 'Supabase');
    }
    
    return [...new Set(techStack)]; // Remove duplicates
  }

  determineRequiredAgents(requirements) {
    const requiredAgents = [];
    const reqText = requirements.join(' ').toLowerCase();
    
    // Analyse des requirements pour déterminer agents nécessaires
    if (reqText.includes('frontend') || reqText.includes('ui') || reqText.includes('react')) {
      requiredAgents.push(this.agentTypes.frontend);
    }
    
    if (reqText.includes('backend') || reqText.includes('api') || reqText.includes('server')) {
      requiredAgents.push(this.agentTypes.backend);
    }
    
    if (reqText.includes('database') || reqText.includes('data') || reqText.includes('storage')) {
      requiredAgents.push(this.agentTypes.database);
    }
    
    if (reqText.includes('security') || reqText.includes('auth') || reqText.includes('login')) {
      requiredAgents.push(this.agentTypes.security);
    }
    
    if (reqText.includes('test') || reqText.includes('testing') || reqText.includes('quality')) {
      requiredAgents.push(this.agentTypes.testing);
    }
    
    if (reqText.includes('deploy') || reqText.includes('cicd') || reqText.includes('docker')) {
      requiredAgents.push(this.agentTypes.devops);
    }
    
    // Au moins frontend + backend par défaut
    if (requiredAgents.length === 0) {
      requiredAgents.push(this.agentTypes.frontend, this.agentTypes.backend);
    }
    
    return requiredAgents;
  }

  prioritizeAgents(agents) {
    return agents.sort((a, b) => {
      // Tri par priorité, puis par durée
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return a.averageDuration - b.averageDuration;
    });
  }

  optimizeForParallelExecution(sortedAgents) {
    const phases = [];
    const dependencies = {
      database: [], // Peut s'exécuter en premier
      backend: ['database'], // Dépend de la database
      frontend: ['backend'], // Dépend du backend
      security: ['backend'], // Dépend du backend
      testing: ['frontend', 'backend'], // Dépend de frontend et backend
      devops: ['frontend', 'backend', 'testing'] // Dernière phase
    };
    
    // Grouper par phases basées sur dépendances
    const phaseMap = new Map();
    
    sortedAgents.forEach(agent => {
      const agentType = agent.type || agent.name.toLowerCase().replace(' agent', '');
      const deps = dependencies[agentType] || [];
      let phase = 0;
      
      // Calculer phase basée sur dépendances
      deps.forEach(dep => {
        const depPhase = this.findAgentPhase(phaseMap, dep);
        phase = Math.max(phase, depPhase + 1);
      });
      
      if (!phaseMap.has(phase)) {
        phaseMap.set(phase, []);
      }
      phaseMap.get(phase).push(agent);
    });
    
    // Convertir en array de phases
    for (let i = 0; i < phaseMap.size; i++) {
      if (phaseMap.has(i)) {
        phases.push(phaseMap.get(i));
      }
    }
    
    const executionPlan = sortedAgents.map((agent, index) => ({
      ...agent,
      executionOrder: index,
      phase: this.findAgentPhase(phaseMap, agent.type || agent.name.toLowerCase().replace(' agent', ''))
    }));
    
    executionPlan.phases = phases.length;
    return executionPlan;
  }

  findAgentPhase(phaseMap, agentType) {
    for (const [phase, agents] of phaseMap.entries()) {
      if (agents.some(agent => (agent.type || agent.name.toLowerCase().replace(' agent', '')) === agentType)) {
        return phase;
      }
    }
    return 0;
  }

  groupAgentsByPhase(agentPlan) {
    const phases = [];
    const maxPhase = Math.max(...agentPlan.map(agent => agent.phase || 0));
    
    for (let i = 0; i <= maxPhase; i++) {
      const phaseAgents = agentPlan.filter(agent => (agent.phase || 0) === i);
      if (phaseAgents.length > 0) {
        phases.push(phaseAgents);
      }
    }
    
    return phases;
  }

  /**
   * Code generation templates
   */
  generateFrontendCode(projectContext, previousResults) {
    return `
// Frontend React Component
import React from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        ${projectContext.description || 'Project Dashboard'}
      </h1>
      {/* Generated frontend code */}
    </div>
  );
}
`;
  }

  generateBackendCode(projectContext, previousResults) {
    return `
// Backend Express API
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const app = express();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(express.json());

// API routes for ${projectContext.description || 'project'}
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

export default app;
`;
  }

  generateDatabaseCode(projectContext, previousResults) {
    return `
-- Supabase Database Schema
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);
`;
  }

  generateTestingCode(projectContext, previousResults) {
    return `
// Jest Unit Tests
import { describe, it, expect } from '@jest/globals';

describe('${projectContext.description || 'Project'} Tests', () => {
  it('should pass basic functionality test', () => {
    expect(true).toBe(true);
  });
  
  it('should validate API endpoints', async () => {
    const response = await fetch('/api/health');
    const data = await response.json();
    expect(data.status).toBe('healthy');
  });
});
`;
  }

  generateDevOpsCode(projectContext, previousResults) {
    return `
# Docker Configuration
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
`;
  }

  generateSecurityCode(projectContext, previousResults) {
    return `
// Security Middleware
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Rate limiting
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"]
    }
  }
});
`;
  }

  generateGenericCode(agent, projectContext) {
    const agentName = agent?.name || 'Unknown Agent';
    const agentType = agent?.type || 'generic';
    const technologies = agent?.technologies || [];
    const projectDesc = projectContext?.description || 'Unnamed Project';
    
    return `
// ${agentName} - Generated Code
// Project: ${projectDesc}
// Technologies: ${technologies.join(', ')}

console.log('${agentName} implementation for ${projectDesc}');

export default class ${agentType.charAt(0).toUpperCase() + agentType.slice(1)}Implementation {
  constructor() {
    this.initialized = true;
  }
  
  async initialize() {
    console.log('${agentName} initialized');
    return true;
  }
}
`;
  }

  /**
   * Integration functions
   */
  async integrateApprovedCode(approvedResults) {
    const codeBlocks = approvedResults
      .filter(result => result.code)
      .map(result => `// ${result.agent.name}\n${result.code}`)
      .join('\n\n// ---\n\n');
    
    return `
// Integrated System Code
// Generated by Claude SubAgent Orchestrator
// Approved by Archon V3 MetaSupervisor

${codeBlocks}

// System Integration Complete
export const systemStatus = {
  agents: ${approvedResults.length},
  integrated: true,
  timestamp: '${new Date().toISOString()}'
};
`;
  }

  async validatePhaseIntegration(results, nextPhase) {
    console.log(`🔍 Validating phase integration before Phase ${nextPhase}...`);
    
    const phaseResults = results.filter(r => r.success);
    if (phaseResults.length === 0) {
      throw new Error(`Phase validation failed: No successful results for Phase ${nextPhase}`);
    }
    
    // Validation simple - en production, plus complexe
    return true;
  }

  /**
   * Documentation et monitoring
   */
  async documentOrchestrationResult(result) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...result,
      orchestrationId: `orch-${Date.now()}`
    };
    
    this.orchestrationLog.push(logEntry);
    
    try {
      // Log pour analytics
      const fs = await import('fs/promises');
      await fs.appendFile(
        'orchestration-results.jsonl',
        JSON.stringify(logEntry) + '\n'
      );
    } catch (error) {
      console.warn('Failed to log orchestration result:', error.message);
    }
  }

  getOrchestrationStatistics() {
    const totalOrchestrations = this.orchestrationLog.length;
    const successfulOrchestrations = this.orchestrationLog.filter(log => log.success).length;
    
    const avgDuration = totalOrchestrations > 0 ? 
      this.orchestrationLog.reduce((sum, log) => sum + log.totalDuration, 0) / totalOrchestrations : 0;
    
    const avgAgentsPerProject = totalOrchestrations > 0 ?
      this.orchestrationLog.reduce((sum, log) => sum + log.agentsUsed, 0) / totalOrchestrations : 0;
    
    return {
      totalOrchestrations,
      successRate: totalOrchestrations > 0 ? successfulOrchestrations / totalOrchestrations : 0,
      averageDuration: avgDuration,
      averageAgentsPerProject: avgAgentsPerProject,
      activeAgents: this.activeAgents.size,
      queuedAgents: this.agentQueue.length
    };
  }

  getPartialResults() {
    return {
      activeAgents: Array.from(this.activeAgents.values()),
      completedAgents: this.orchestrationLog.length,
      lastSuccessfulAgent: this.orchestrationLog.filter(log => log.success).pop()
    };
  }

  /**
   * Real-time monitoring
   */
  getActiveAgentsStatus() {
    return Array.from(this.activeAgents.entries()).map(([id, agent]) => ({
      id,
      type: agent.type || agent.name.toLowerCase().replace(' agent', ''),
      name: agent.name,
      status: agent.status,
      duration: Date.now() - agent.startTime,
      estimatedRemaining: Math.max(0, agent.averageDuration - (Date.now() - agent.startTime))
    }));
  }

  /**
   * Emergency stop
   */
  async emergencyStop(reason = 'Manual stop requested') {
    console.log(`🚨 Emergency stop triggered: ${reason}`);
    
    // Stop tous les agents actifs
    for (const [agentId, agent] of this.activeAgents.entries()) {
      agent.status = 'stopped';
      this.activeAgents.delete(agentId);
    }
    
    // Clear queue
    this.agentQueue = [];
    
    // Log emergency stop
    this.orchestrationLog.push({
      timestamp: new Date().toISOString(),
      type: 'emergency_stop',
      reason,
      stoppedAgents: this.activeAgents.size
    });
    
    return { success: true, message: `Emergency stop completed. Stopped ${this.activeAgents.size} agents.` };
  }
}

export default ClaudeSubAgentOrchestrator;