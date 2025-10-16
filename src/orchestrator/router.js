import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger.js';

export class Router {
  constructor() {
    this.patterns = new Map();
    this.history = [];
    this.learningData = [];
    this.configPath = path.join(process.cwd(), 'data', 'routing-patterns.json');
  }

  async initialize(availableAgents) {
    this.availableAgents = availableAgents;

    // Load existing patterns if available
    await this.loadPatterns();

    // Initialize default routing rules
    this.initializeDefaultRules();

    logger.info(`Router initialized with agents: ${availableAgents.join(', ')}`);
  }

  initializeDefaultRules() {
    // Default routing patterns based on task types
    this.patterns.set('debugging', {
      primary: 'claude',
      fallback: ['archon', 'gemini'],
      confidence: 85
    });

    this.patterns.set('exploration', {
      primary: 'gemini',
      fallback: ['archon', 'claude'],
      confidence: 80
    });

    this.patterns.set('implementation', {
      primary: 'claude',
      fallback: ['gemini', 'archon'],
      confidence: 90
    });

    this.patterns.set('architecture', {
      primary: 'archon',
      fallback: ['claude', 'gemini'],
      confidence: 95
    });

    this.patterns.set('optimization', {
      primary: 'claude',
      fallback: ['archon', 'gemini'],
      confidence: 85
    });

    this.patterns.set('analysis', {
      primary: 'archon',
      fallback: ['claude', 'gemini'],
      confidence: 90
    });

    this.patterns.set('prototyping', {
      primary: 'gemini',
      fallback: ['claude', 'archon'],
      confidence: 85
    });
  }

  async route(params) {
    const { task_description, task_type, complexity, context, available_agents } = params;

    // Filter available agents
    const activeAgents = this.availableAgents.filter(a => available_agents.includes(a));

    if (activeAgents.length === 0) {
      throw new Error('No agents available for routing');
    }

    // Get pattern for task type
    let pattern = this.patterns.get(task_type);

    if (!pattern) {
      // Use ML-based routing for unknown task types
      pattern = await this.predictBestAgent(task_description, complexity);
    }

    // Adjust based on complexity
    pattern = this.adjustForComplexity(pattern, complexity);

    // Check if primary agent is available
    const primaryAgent = activeAgents.includes(pattern.primary)
      ? pattern.primary
      : activeAgents[0];

    // Get fallback agents
    const fallbackAgents = pattern.fallback
      .filter(a => activeAgents.includes(a) && a !== primaryAgent);

    // Record routing decision
    const decision = {
      primary_agent: primaryAgent,
      fallback_agents: fallbackAgents,
      confidence: pattern.confidence,
      task_type,
      complexity,
      reasoning: this.generateReasoning(task_type, primaryAgent, complexity),
      timestamp: new Date().toISOString()
    };

    this.history.push(decision);

    return decision;
  }

  adjustForComplexity(pattern, complexity) {
    const adjusted = { ...pattern };

    switch (complexity) {
    case 'high':
      // High complexity favors Archon for architecture, Claude for precision
      if (pattern.primary === 'gemini') {
        adjusted.primary = 'archon';
        adjusted.confidence -= 10;
      }
      break;

    case 'low':
      // Low complexity can use any agent, prefer faster ones
      if (pattern.primary === 'archon') {
        adjusted.primary = 'gemini';
        adjusted.confidence -= 5;
      }
      break;

    default:
      // Medium complexity uses default patterns
      break;
    }

    return adjusted;
  }

  async predictBestAgent(description, complexity) {
    // Simple keyword-based prediction (would use ML in production)
    const keywords = {
      claude: ['fix', 'bug', 'error', 'precise', 'quality', 'review', 'optimize'],
      gemini: ['explore', 'try', 'test', 'quick', 'iterate', 'prototype', 'idea'],
      archon: ['architecture', 'design', 'pattern', 'structure', 'analyze', 'synthesize']
    };

    const scores = { claude: 0, gemini: 0, archon: 0 };
    const descLower = description.toLowerCase();

    for (const [agent, words] of Object.entries(keywords)) {
      for (const word of words) {
        if (descLower.includes(word)) {
          scores[agent] += 10;
        }
      }
    }

    // Get agent with highest score
    const bestAgent = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)[0][0];

    return {
      primary: bestAgent,
      fallback: Object.keys(scores).filter(a => a !== bestAgent),
      confidence: Math.min(70 + scores[bestAgent], 95)
    };
  }

  generateReasoning(taskType, agent, complexity) {
    const reasons = {
      claude: {
        debugging: 'Claude excels at precise debugging and error fixing',
        implementation: 'Claude provides high-quality, production-ready implementations',
        optimization: 'Claude identifies and applies sophisticated optimizations'
      },
      gemini: {
        exploration: 'Gemini rapidly explores multiple approaches in parallel',
        prototyping: 'Gemini quickly iterates through prototype variations',
        default: 'Gemini provides fast, creative solutions'
      },
      archon: {
        architecture: 'Archon analyzes and designs system architecture comprehensively',
        analysis: 'Archon synthesizes complex information from multiple sources',
        default: 'Archon provides deep architectural insights'
      }
    };

    const agentReasons = reasons[agent] || {};
    return agentReasons[taskType] || agentReasons.default ||
           `${agent} selected based on task characteristics and complexity level ${complexity}`;
  }

  async learn(params) {
    const { task_type, agent_used, success, duration_ms, complexity, feedback } = params;

    // Store learning data
    this.learningData.push({
      task_type,
      agent_used,
      success,
      duration_ms,
      complexity,
      feedback,
      timestamp: new Date().toISOString()
    });

    // Update patterns based on success
    if (this.learningData.length >= 10) {
      await this.updatePatterns();
    }

    logger.debug(`Learning recorded: ${task_type} -> ${agent_used} (${success ? 'success' : 'failure'})`);
  }

  async updatePatterns() {
    // Analyze learning data to update routing patterns
    const taskTypeStats = {};

    for (const data of this.learningData) {
      if (!taskTypeStats[data.task_type]) {
        taskTypeStats[data.task_type] = {};
      }

      if (!taskTypeStats[data.task_type][data.agent_used]) {
        taskTypeStats[data.task_type][data.agent_used] = {
          successes: 0,
          failures: 0,
          total_duration: 0,
          count: 0
        };
      }

      const stats = taskTypeStats[data.task_type][data.agent_used];
      stats.count++;
      stats.total_duration += data.duration_ms;

      if (data.success) {
        stats.successes++;
      } else {
        stats.failures++;
      }
    }

    // Update patterns based on statistics
    for (const [taskType, agentStats] of Object.entries(taskTypeStats)) {
      const agents = Object.entries(agentStats)
        .map(([agent, stats]) => ({
          agent,
          success_rate: stats.successes / stats.count,
          avg_duration: stats.total_duration / stats.count,
          score: (stats.successes / stats.count) * 100 - (stats.total_duration / stats.count) / 100
        }))
        .sort((a, b) => b.score - a.score);

      if (agents.length > 0) {
        this.patterns.set(taskType, {
          primary: agents[0].agent,
          fallback: agents.slice(1).map(a => a.agent),
          confidence: Math.min(agents[0].success_rate * 100, 95)
        });
      }
    }

    // Save updated patterns
    await this.savePatterns();

    // Clear old learning data
    this.learningData = this.learningData.slice(-100); // Keep last 100 entries
  }

  async loadPatterns() {
    try {
      const data = await fs.readFile(this.configPath, 'utf-8');
      const saved = JSON.parse(data);

      for (const [key, value] of Object.entries(saved.patterns || {})) {
        this.patterns.set(key, value);
      }

      this.learningData = saved.learningData || [];
      this.history = saved.history || [];

      logger.info('Loaded routing patterns from disk');
    } catch (error) {
      logger.debug('No existing patterns found, using defaults');
    }
  }

  async savePatterns() {
    try {
      const data = {
        patterns: Object.fromEntries(this.patterns),
        learningData: this.learningData.slice(-100),
        history: this.history.slice(-1000),
        saved_at: new Date().toISOString()
      };

      await fs.mkdir(path.dirname(this.configPath), { recursive: true });
      await fs.writeFile(this.configPath, JSON.stringify(data, null, 2));

      logger.debug('Saved routing patterns to disk');
    } catch (error) {
      logger.error('Failed to save patterns:', error);
    }
  }

  async save() {
    await this.savePatterns();
  }
}
