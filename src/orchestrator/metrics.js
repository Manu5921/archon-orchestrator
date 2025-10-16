import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger.js';

export class MetricsCollector {
  constructor() {
    this.metrics = {
      agents: {},
      routing: {
        decisions: [],
        handoffs: []
      },
      tasks: {
        total: 0,
        successful: 0,
        failed: 0
      }
    };

    this.metricsPath = path.join(process.cwd(), 'data', 'metrics.json');
    this.loadMetrics();
  }

  initAgentMetrics(agent) {
    if (!this.metrics.agents[agent]) {
      this.metrics.agents[agent] = {
        tasks_assigned: 0,
        tasks_completed: 0,
        tasks_failed: 0,
        total_duration_ms: 0,
        success_rate: 0,
        avg_response_time: 0,
        last_used: null
      };
    }
  }

  recordRoutingDecision(decision) {
    this.metrics.routing.decisions.push({
      ...decision,
      timestamp: new Date().toISOString()
    });

    // Update agent metrics
    this.initAgentMetrics(decision.primary_agent);
    this.metrics.agents[decision.primary_agent].tasks_assigned++;
    this.metrics.agents[decision.primary_agent].last_used = new Date().toISOString();

    // Keep only last 1000 decisions
    if (this.metrics.routing.decisions.length > 1000) {
      this.metrics.routing.decisions = this.metrics.routing.decisions.slice(-1000);
    }
  }

  recordHandoff(fromAgent, toAgent, reason) {
    this.metrics.routing.handoffs.push({
      from: fromAgent,
      to: toAgent,
      reason,
      timestamp: new Date().toISOString()
    });

    // Keep only last 500 handoffs
    if (this.metrics.routing.handoffs.length > 500) {
      this.metrics.routing.handoffs = this.metrics.routing.handoffs.slice(-500);
    }
  }

  recordTaskResult(agent, success, durationMs) {
    this.initAgentMetrics(agent);

    const agentMetrics = this.metrics.agents[agent];

    if (success) {
      agentMetrics.tasks_completed++;
      this.metrics.tasks.successful++;
    } else {
      agentMetrics.tasks_failed++;
      this.metrics.tasks.failed++;
    }

    this.metrics.tasks.total++;
    agentMetrics.total_duration_ms += durationMs;

    // Calculate success rate
    const totalTasks = agentMetrics.tasks_completed + agentMetrics.tasks_failed;
    if (totalTasks > 0) {
      agentMetrics.success_rate =
        Math.round((agentMetrics.tasks_completed / totalTasks) * 100);
    }

    // Calculate average response time
    if (agentMetrics.tasks_completed > 0) {
      agentMetrics.avg_response_time =
        Math.round(agentMetrics.total_duration_ms / agentMetrics.tasks_completed);
    }
  }

  async getStats(agent = 'all', metricType = 'all', timeRange = '24h') {
    const stats = {};

    if (agent === 'all') {
      // Get stats for all agents
      stats.agents = { ...this.metrics.agents };
      stats.overall = {
        total_tasks: this.metrics.tasks.total,
        successful_tasks: this.metrics.tasks.successful,
        failed_tasks: this.metrics.tasks.failed,
        overall_success_rate: this.metrics.tasks.total > 0
          ? Math.round((this.metrics.tasks.successful / this.metrics.tasks.total) * 100)
          : 0
      };
    } else {
      // Get stats for specific agent
      this.initAgentMetrics(agent);
      stats.agent = this.metrics.agents[agent];
    }

    // Add routing stats
    if (metricType === 'all' || metricType === 'routing') {
      stats.routing = {
        total_decisions: this.metrics.routing.decisions.length,
        total_handoffs: this.metrics.routing.handoffs.length,
        handoff_reasons: this.getHandoffReasons()
      };
    }

    // Filter by time range
    if (timeRange !== 'all') {
      stats.time_range = timeRange;
      stats.filtered_data = this.filterByTimeRange(timeRange);
    }

    return stats;
  }

  getHandoffReasons() {
    const reasons = {};

    for (const handoff of this.metrics.routing.handoffs) {
      reasons[handoff.reason] = (reasons[handoff.reason] || 0) + 1;
    }

    return reasons;
  }

  filterByTimeRange(timeRange) {
    const now = Date.now();
    const ranges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoff = now - (ranges[timeRange] || ranges['24h']);

    const filtered = {
      decisions: this.metrics.routing.decisions.filter(
        d => new Date(d.timestamp).getTime() > cutoff
      ),
      handoffs: this.metrics.routing.handoffs.filter(
        h => new Date(h.timestamp).getTime() > cutoff
      )
    };

    return filtered;
  }

  async getSuccessRate(agent) {
    this.initAgentMetrics(agent);
    return this.metrics.agents[agent].success_rate;
  }

  async loadMetrics() {
    try {
      const data = await fs.readFile(this.metricsPath, 'utf-8');
      this.metrics = JSON.parse(data);
      logger.debug('Loaded metrics from disk');
    } catch (error) {
      logger.debug('No existing metrics found, starting fresh');
    }
  }

  async save() {
    try {
      await fs.mkdir(path.dirname(this.metricsPath), { recursive: true });
      await fs.writeFile(
        this.metricsPath,
        JSON.stringify(this.metrics, null, 2)
      );
      logger.debug('Saved metrics to disk');
    } catch (error) {
      logger.error('Failed to save metrics:', error);
    }
  }

  getRealtimeStats() {
    const agents = Object.entries(this.metrics.agents).map(([name, stats]) => ({
      name,
      ...stats,
      status: stats.last_used &&
        (Date.now() - new Date(stats.last_used).getTime() < 60000)
        ? 'active' : 'idle'
    }));

    return {
      agents,
      active_agents: agents.filter(a => a.status === 'active').length,
      total_agents: agents.length,
      system_health: this.calculateSystemHealth()
    };
  }

  calculateSystemHealth() {
    const overallSuccessRate = this.metrics.tasks.total > 0
      ? (this.metrics.tasks.successful / this.metrics.tasks.total) * 100
      : 100;

    if (overallSuccessRate >= 90) return 'excellent';
    if (overallSuccessRate >= 75) return 'good';
    if (overallSuccessRate >= 60) return 'fair';
    return 'poor';
  }
}
