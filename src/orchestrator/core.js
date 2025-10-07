import { Router } from './router.js';
import { GeminiMCPConnector } from '../agents/gemini-mcp-connector.js';
import { ClaudeMCPConnector } from '../agents/claude-mcp-connector.js';
import { ArchonConnector } from '../agents/archon-connector.js';
import { ArchonMCPConnector } from '../agents/archon-mcp-connector.js';
import { ArchonHTTPConnector } from '../agents/archon-http-connector.js';
import { ContextManager } from './context-manager.js';
import { MetricsCollector } from './metrics.js';
import { logger } from '../utils/logger.js';
import { log } from '../utils/logging.js';
import { getCapabilities, parseAgentsEnv } from '../agents/registry.js';
import { startGeminiBridge } from '../agents/gemini-bridge.js';

export class OrchestratorCore {
  constructor() {
    this.agents = new Map();
    this.router = new Router();
    this.contextManager = new ContextManager();
    this.metrics = new MetricsCollector();
    this.activeTasks = new Map();
  }

  /**
   * SOLUTION GEMINI: Exécution orchestrée avec fallback automatique
   * Centralise la logique de routage et de résilience
   */
  async executeOrchestratedTask(taskId, taskType, agentCommand, agentArgs, context = {}) {
    logger.info(`🎯 Orchestrating task ${taskId} (type: ${taskType}, command: ${agentCommand})`);
    
    // 1. Obtenir la décision de routage
    const routingDecision = await this.router.route({
      task_description: agentArgs[0] || 'No description',
      task_type: taskType,
      complexity: context.complexity || 'medium',
      context: context,
      available_agents: Array.from(this.agents.keys())
    });

    // 2. Définir la liste des agents à essayer (principal puis secours)
    const agentsToTry = [routingDecision.primary_agent, ...(routingDecision.fallback_agents || [])];
    let lastError = null;

    // 3. Itérer sur les agents et tenter l'exécution
    for (const agentName of agentsToTry) {
      const agent = this.agents.get(agentName);

      // Vérifier si l'agent existe et est sain
      if (agent) {
        try {
          // Vérifier santé de l'agent
          const health = await agent.healthCheck();
          if (!health.healthy) {
            logger.warn(`Agent ${agentName} not healthy: ${health.message}`);
            continue;
          }

          logger.info(`🔄 Trying task ${taskId} with ${agentName} (command: ${agentCommand})`);

          // Appeler la méthode execute de l'agent
          const result = await agent.execute(taskId, agentCommand, agentArgs);

          // Si l'exécution réussit
          if (result.success) {
            this.metrics.recordTaskResult(agentName, true, result.duration_ms || 0);
            logger.info(`✅ Task ${taskId} executed successfully by ${agentName}`);
            return { success: true, agent: agentName, result: result };
          } else {
            // Si l'exécution échoue mais ne lève pas d'exception
            lastError = result.error;
            this.metrics.recordTaskResult(agentName, false, result.duration_ms || 0);
            logger.warn(`⚠️ Task ${taskId} failed with ${agentName}: ${result.error}. Trying next agent.`);
          }
        } catch (error) {
          // Si l'exécution lève une exception
          lastError = error.message;
          this.metrics.recordTaskResult(agentName, false, 0);
          logger.error(`❌ Error executing task ${taskId} with ${agentName}: ${error.message}. Trying next agent.`);
        }
      } else {
        logger.debug(`Agent ${agentName} not available. Skipping.`);
      }
    }

    // 4. Si toutes les tentatives échouent
    const errorMessage = lastError || `No agent could execute task ${taskId} for type ${taskType}`;
    logger.error(`💥 All attempts failed for task ${taskId}: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
  
  async initialize() {
    logger.info('🚀 Initializing Orchestra Core with Hybrid Architecture...');
    
    const L = log("orchestra.boot");
    
    // 🔍 PHASE 1: Real Agent Detection (ChatGPT recommended)
    const capabilities = await getCapabilities();
    L("capabilities.detected", capabilities);
    
    // Parse configured agents from environment (hint only)
    const configuredAgents = parseAgentsEnv(process.env.ORCHESTRA_AGENTS);
    L("agents.config", { configured: configuredAgents });
    
    // 🎯 PHASE 2: Combine Detection + Configuration
    const hasGemini = capabilities.agents.gemini && (configuredAgents.length === 0 || configuredAgents.includes('gemini'));
    const hasClaude = capabilities.agents.claude && (configuredAgents.length === 0 || configuredAgents.includes('claude'));
    const hasArchon = capabilities.agents.archon !== false; // Always assume Archon available
    
    // Store hybrid capabilities  
    this.capabilities = {
      agents: { gemini: hasGemini, claude: hasClaude, archon: hasArchon },
      versions: capabilities.versions,
      endpoints: capabilities.endpoints,
      configured: configuredAgents,
      detected: capabilities.agents
    };
    
    L("capabilities.final", this.capabilities);
    
    // Make capabilities accessible to facade
    global.__orchestrator_capabilities = this.capabilities;
    
    // 🌉 PHASE 3: Start Gemini Bridge if available
    if (hasGemini && !process.env.GEMINI_API_URL) {
      try {
        const bridge = await startGeminiBridge();
        process.env.GEMINI_API_URL = bridge.url;
        L("gemini.bridge.started", bridge);
      } catch (error) {
        logger.warn(`Failed to start Gemini Bridge: ${error.message}`);
      }
    }
    
    // Check if we should use mock mode
    const useMock = process.env.USE_MOCK_AGENTS === 'true';
    
    if (useMock) {
      logger.info('🎭 Using mock agents for testing');
      const { MockConnector } = await import('../agents/mock-connector.js');
      
      this.agents.set('gemini', new MockConnector('gemini'));
      this.agents.set('claude', new MockConnector('claude'));
      this.agents.set('archon', new MockConnector('archon'));
      this.agents.set('archon_mcp', new MockConnector('archon_mcp'));
      
      logger.info('✅ Mock agents initialized (including Archon MCP)');
    } else {
      // Initialize MCP-aware agent connectors
      const gemini = new GeminiMCPConnector();
      const claude = new ClaudeMCPConnector();
      const archon = new ArchonConnector();
      const archonMCP = new ArchonMCPConnector();
      
      // Test connections
      const geminiHealth = await gemini.healthCheck();
      const claudeHealth = await claude.healthCheck();
      const archonHealth = await archon.healthCheck();
      
      // Test Archon MCP connection, fallback to HTTP
      L("mcp.registering");
      try {
        await archonMCP.connect();
        this.agents.set('archon_mcp', archonMCP);
        
        // Log registration success
        const got = this.agents.get('archon_mcp');
        L("mcp.get.archon", {
          exists: !!got,
          executeType: typeof got?.execute,
          moduleId: got?.__id || got?.constructor?.name,
          hasHealthCheck: typeof got?.healthCheck === 'function'
        });
        
        logger.info('✅ Archon MCP connector initialized');
      } catch (error) {
        logger.warn('⚠️ Archon MCP not available:', error.message);
        L("mcp.archon.failed", { error: error.message });
        
        // Fallback to HTTP connector
        logger.info('🔄 Trying Archon HTTP connector as fallback...');
        const archonHTTP = new ArchonHTTPConnector();
        const httpHealth = await archonHTTP.healthCheck();
        
        if (httpHealth.healthy) {
          this.agents.set('archon_mcp', archonHTTP); // Use same key for compatibility
          
          // Log fallback registration
          const got = this.agents.get('archon_mcp');
          L("mcp.get.archon.fallback", {
            exists: !!got,
            executeType: typeof got?.execute,
            moduleId: got?.__id || got?.constructor?.name
          });
          
          logger.info('✅ Archon HTTP connector initialized as fallback');
        } else {
          logger.warn('⚠️ Archon HTTP connector also failed:', httpHealth.error);
          L("mcp.fallback.failed", { error: httpHealth.error });
        }
      }

      // Guard against missing execute
      const archonAgent = this.agents.get('archon_mcp');
      if (!archonAgent || typeof archonAgent.execute !== 'function') {
        L("mcp.guard.failed", { 
          exists: !!archonAgent, 
          hasExecute: typeof archonAgent?.execute === 'function' 
        });
        throw new Error("Archon connector not wired (execute missing)");
      } else {
        L("mcp.guard.ok", { moduleId: archonAgent.__id });
      }
      
      if (geminiHealth.healthy) {
        this.agents.set('gemini', gemini);
        logger.info('✅ Gemini connector initialized');
      } else {
        logger.warn('⚠️ Gemini not available:', geminiHealth.error);
      }
      
      if (claudeHealth.healthy) {
        this.agents.set('claude', claude);
        logger.info('✅ Claude connector initialized');
      } else {
        logger.warn('⚠️ Claude not available:', claudeHealth.error);
      }
      
      if (archonHealth.healthy) {
        this.agents.set('archon', archon);
        logger.info('✅ Archon connector initialized');
      } else {
        logger.warn('⚠️ Archon not available:', archonHealth.error);
      }
    }
    
    // Initialize router with available agents
    await this.router.initialize(Array.from(this.agents.keys()));
    
    logger.info(`Orchestra initialized with ${this.agents.size} agents`);
  }
  
  async routeTask(params) {
    const { task_description, task_type, complexity = 'medium', context = {} } = params;
    
    // Get routing decision
    const decision = await this.router.route({
      task_description,
      task_type,
      complexity,
      context,
      available_agents: Array.from(this.agents.keys())
    });
    
    // Record metrics
    this.metrics.recordRoutingDecision(decision);
    
    // Store task
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.activeTasks.set(taskId, {
      ...params,
      assigned_agent: decision.primary_agent,
      created_at: new Date().toISOString()
    });
    
    return {
      success: true,
      task_id: taskId,
      routing_decision: decision,
      message: `Task routed to ${decision.primary_agent} with ${decision.confidence}% confidence`
    };
  }
  
  async handoffTask(params) {
    const { from_agent, to_agent, task_id, reason, context = {} } = params;
    
    // Get task details
    const task = this.activeTasks.get(task_id);
    if (!task) {
      return {
        success: false,
        error: `Task ${task_id} not found`
      };
    }
    
    // Get agents
    const fromAgent = this.agents.get(from_agent);
    const toAgent = this.agents.get(to_agent);
    
    if (!fromAgent || !toAgent) {
      return {
        success: false,
        error: 'One or both agents not available'
      };
    }
    
    // Export context from source agent
    const exportedContext = await fromAgent.exportContext(task_id);
    
    // Merge with provided context
    const fullContext = {
      ...exportedContext,
      ...context,
      handoff_reason: reason,
      previous_agent: from_agent
    };
    
    // Import context to target agent
    await toAgent.importContext(task_id, fullContext);
    
    // Update task
    task.assigned_agent = to_agent;
    task.handoff_history = task.handoff_history || [];
    task.handoff_history.push({
      from: from_agent,
      to: to_agent,
      reason,
      timestamp: new Date().toISOString()
    });
    
    // Record metrics
    this.metrics.recordHandoff(from_agent, to_agent, reason);
    
    return {
      success: true,
      message: `Task ${task_id} handed off from ${from_agent} to ${to_agent}`,
      context_transferred: Object.keys(fullContext).length
    };
  }
  
  async syncContext(params) {
    const { agents, context_type, data } = params;
    
    // Store in context manager
    await this.contextManager.store(context_type, data);
    
    // Sync to each agent
    const results = [];
    for (const agentName of agents) {
      const agent = this.agents.get(agentName);
      if (agent) {
        const syncResult = await agent.syncContext(context_type, data);
        results.push({
          agent: agentName,
          success: syncResult.success
        });
      }
    }
    
    return {
      success: true,
      synced_agents: results.filter(r => r.success).length,
      total_agents: agents.length,
      context_size: JSON.stringify(data).length
    };
  }
  
  async getPerformanceStats(params) {
    const { agent, metric_type = 'all', time_range = '24h' } = params;
    
    const stats = await this.metrics.getStats(agent, metric_type, time_range);
    
    return {
      success: true,
      stats,
      generated_at: new Date().toISOString()
    };
  }
  
  async learnPattern(params) {
    const { task_type, agent_used, success, duration_ms, complexity, feedback } = params;
    
    // Update router learning
    await this.router.learn({
      task_type,
      agent_used,
      success,
      duration_ms,
      complexity,
      feedback
    });
    
    // Update metrics
    this.metrics.recordTaskResult(agent_used, success, duration_ms);
    
    return {
      success: true,
      message: 'Pattern learned and routing model updated',
      current_success_rate: await this.metrics.getSuccessRate(agent_used)
    };
  }
  
  async getResources() {
    return [
      {
        uri: 'orchestra://stats/overview',
        name: 'Orchestra Statistics Overview',
        mimeType: 'application/json'
      },
      {
        uri: 'orchestra://agents/status',
        name: 'Agent Status Dashboard',
        mimeType: 'application/json'
      },
      {
        uri: 'orchestra://routing/patterns',
        name: 'Routing Patterns Analysis',
        mimeType: 'application/json'
      }
    ];
  }
  
  async shutdown() {
    logger.info('Shutting down Orchestra...');
    
    // Close agent connections
    for (const [name, agent] of this.agents) {
      await agent.close();
      logger.info(`Closed ${name} connector`);
    }
    
    // Save metrics and patterns
    await this.metrics.save();
    await this.router.save();
    
    logger.info('Orchestra shutdown complete');
  }
}