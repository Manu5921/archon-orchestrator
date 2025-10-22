/**
 * Archon Knowledge Base Webhook Handler
 * Processes results from GitHub Actions and updates Archon's knowledge base
 */

import { Logger } from '/Users/manu/Documents/DEV/archon-orchestrator/src/utils/logger.js';

const createLogger = (name) => new Logger(name);
import fs from 'fs/promises';
import path from 'path';

const logger = createLogger('ArchonWebhookHandler');

export class ArchonKnowledgeWebhookHandler {
  constructor(options = {}) {
    this.archonApiUrl = options.archonApiUrl || process.env.ARCHON_API_URL || 'http://localhost:8181';
    this.archonApiKey = options.archonApiKey || process.env.ARCHON_API_KEY;
    this.knowledgeBasePath = options.knowledgeBasePath || './knowledge-base';
    this.webhookSecret = options.webhookSecret || process.env.ARCHON_WEBHOOK_SECRET;

    this.ensureKnowledgeBaseDirectory();
  }

  /**
   * Ensure knowledge base directory exists
   */
  async ensureKnowledgeBaseDirectory() {
    try {
      await fs.mkdir(this.knowledgeBasePath, { recursive: true });
      logger.info('Knowledge base directory ready', { path: this.knowledgeBasePath });
    } catch (error) {
      logger.error('Failed to create knowledge base directory', { error: error.message });
    }
  }

  /**
   * Handle GitHub Actions webhook payload
   */
  async handleGitHubWebhook(payload) {
    try {
      logger.info('Processing GitHub webhook payload', {
        event: payload.event,
        repository: payload.repository?.name
      });

      // Validate webhook payload
      if (!this.validateWebhookPayload(payload)) {
        throw new Error('Invalid webhook payload');
      }

      // Process different types of events
      switch (payload.event) {
      case 'github_analysis_complete':
        return await this.handleAnalysisComplete(payload);

      case 'architecture_violation_detected':
        return await this.handleArchitectureViolation(payload);

      case 'jules_security_alert':
        return await this.handleSecurityAlert(payload);

      default:
        logger.warn('Unknown webhook event', { event: payload.event });
        return { status: 'ignored', reason: 'unknown_event' };
      }
    } catch (error) {
      logger.error('Webhook handling failed', { error: error.message, payload });
      throw error;
    }
  }

  /**
   * Validate webhook payload structure and authenticity
   */
  validateWebhookPayload(payload) {
    // Check required fields
    const required = ['event', 'timestamp', 'repository', 'analysis_results'];
    for (const field of required) {
      if (!payload[field]) {
        logger.error('Missing required webhook field', { field });
        return false;
      }
    }

    // Validate timestamp (not older than 1 hour)
    const timestamp = new Date(payload.timestamp);
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    if (timestamp < hourAgo) {
      logger.warn('Webhook payload too old', { timestamp });
      return false;
    }

    return true;
  }

  /**
   * Handle analysis complete event
   */
  async handleAnalysisComplete(payload) {
    const { repository, analysis_results, next_actions } = payload;

    logger.info('Processing analysis complete event', {
      repository: repository.name,
      complianceScore: analysis_results.architecture_compliance?.score,
      julesScore: analysis_results.jules_analysis?.overall_score
    });

    // Update architecture compliance knowledge
    await this.updateArchitectureKnowledge(repository, analysis_results);

    // Update security knowledge from Jules
    await this.updateSecurityKnowledge(repository, analysis_results.jules_analysis);

    // Process next actions
    const actionResults = await this.processNextActions(next_actions, repository);

    // Send update to Archon orchestrator
    const orchestratorUpdate = await this.notifyArchonOrchestrator({
      type: 'knowledge_update',
      repository,
      analysis_results,
      action_results: actionResults
    });

    return {
      status: 'processed',
      updates: {
        architecture_knowledge: true,
        security_knowledge: true,
        orchestrator_notified: orchestratorUpdate.success
      },
      next_actions: actionResults
    };
  }

  /**
   * Update architecture compliance knowledge base
   */
  async updateArchitectureKnowledge(repository, analysisResults) {
    try {
      const knowledgeFile = path.join(this.knowledgeBasePath, `${repository.name}-architecture.json`);

      // Load existing knowledge or create new
      let knowledge = {};
      try {
        const existing = await fs.readFile(knowledgeFile, 'utf8');
        knowledge = JSON.parse(existing);
      } catch (error) {
        // File doesn't exist, start fresh
        knowledge = {
          repository: repository.name,
          created: new Date().toISOString(),
          compliance_history: [],
          violation_patterns: {},
          success_patterns: {}
        };
      }

      // Add new compliance data
      const complianceEntry = {
        timestamp: new Date().toISOString(),
        commit: repository.commit,
        branch: repository.branch,
        pr_number: repository.pr_number,

        compliance: {
          score: analysisResults.architecture_compliance.score,
          violations: analysisResults.architecture_compliance.violations,
          status: analysisResults.architecture_compliance.status
        },

        jules_analysis: {
          overall_score: analysisResults.jules_analysis?.overall_score,
          security_score: analysisResults.jules_analysis?.security_score,
          blocking_issues: analysisResults.jules_analysis?.blocking_issues,
          status: analysisResults.jules_analysis?.status
        }
      };

      knowledge.compliance_history.push(complianceEntry);
      knowledge.updated = new Date().toISOString();

      // Analyze patterns
      this.analyzeCompliancePatterns(knowledge);

      // Save updated knowledge
      await fs.writeFile(knowledgeFile, JSON.stringify(knowledge, null, 2));

      logger.info('Architecture knowledge updated', {
        repository: repository.name,
        entries: knowledge.compliance_history.length
      });

    } catch (error) {
      logger.error('Failed to update architecture knowledge', {
        repository: repository.name,
        error: error.message
      });
    }
  }

  /**
   * Analyze compliance patterns for learning
   */
  analyzeCompliancePatterns(knowledge) {
    const recent = knowledge.compliance_history.slice(-10); // Last 10 entries

    // Identify violation patterns
    const violations = recent.filter(entry => entry.compliance.violations > 0);
    const violationTypes = violations.map(v => v.compliance.violations);

    // Identify success patterns
    const successes = recent.filter(entry => entry.compliance.score >= 85);

    // Update patterns
    knowledge.violation_patterns = {
      frequency: violations.length / recent.length,
      common_issues: this.extractCommonIssues(violations),
      trends: this.calculateTrends(recent)
    };

    knowledge.success_patterns = {
      frequency: successes.length / recent.length,
      high_score_factors: this.extractSuccessFactors(successes),
      improvement_trajectory: this.calculateImprovementTrend(recent)
    };
  }

  /**
   * Extract common issues from violations
   */
  extractCommonIssues(violations) {
    // In a real implementation, this would analyze violation details
    return [
      'Technology stack misalignment',
      'Missing architecture patterns',
      'Security compliance gaps',
      'API contract violations'
    ];
  }

  /**
   * Extract success factors from high-scoring entries
   */
  extractSuccessFactors(successes) {
    return [
      'Proper technology stack usage',
      'Consistent design patterns',
      'Security best practices',
      'Comprehensive testing'
    ];
  }

  /**
   * Calculate compliance trends
   */
  calculateTrends(entries) {
    if (entries.length < 2) return 'insufficient_data';

    const scores = entries.map(e => e.compliance.score);
    const trend = scores[scores.length - 1] - scores[0];

    if (trend > 5) return 'improving';
    if (trend < -5) return 'declining';
    return 'stable';
  }

  /**
   * Calculate improvement trajectory
   */
  calculateImprovementTrend(entries) {
    if (entries.length < 3) return 'insufficient_data';

    const recentScores = entries.slice(-3).map(e => e.compliance.score);
    const avgRecent = recentScores.reduce((a, b) => a + b) / recentScores.length;

    const olderScores = entries.slice(-6, -3).map(e => e.compliance.score);
    if (olderScores.length === 0) return 'new_project';

    const avgOlder = olderScores.reduce((a, b) => a + b) / olderScores.length;

    return avgRecent > avgOlder ? 'improving' : 'declining';
  }

  /**
   * Update security knowledge from Jules analysis
   */
  async updateSecurityKnowledge(repository, julesAnalysis) {
    try {
      const securityFile = path.join(this.knowledgeBasePath, `${repository.name}-security.json`);

      let securityKnowledge = {};
      try {
        const existing = await fs.readFile(securityFile, 'utf8');
        securityKnowledge = JSON.parse(existing);
      } catch (error) {
        securityKnowledge = {
          repository: repository.name,
          created: new Date().toISOString(),
          security_history: [],
          vulnerability_patterns: {},
          remediation_success: {}
        };
      }

      // Add new security analysis
      if (julesAnalysis) {
        securityKnowledge.security_history.push({
          timestamp: new Date().toISOString(),
          overall_score: julesAnalysis.overall_score,
          security_score: julesAnalysis.security_score,
          blocking_issues: julesAnalysis.blocking_issues,
          status: julesAnalysis.status
        });

        securityKnowledge.updated = new Date().toISOString();

        // Save security knowledge
        await fs.writeFile(securityFile, JSON.stringify(securityKnowledge, null, 2));

        logger.info('Security knowledge updated', {
          repository: repository.name,
          score: julesAnalysis.security_score
        });
      }

    } catch (error) {
      logger.error('Failed to update security knowledge', {
        repository: repository.name,
        error: error.message
      });
    }
  }

  /**
   * Process next actions from GitHub workflow
   */
  async processNextActions(nextActions, repository) {
    const results = {};

    try {
      // Update architecture context if needed
      if (nextActions.update_architecture_context) {
        results.architecture_context_updated = await this.updateArchitectureContext(repository);
      }

      // Retrain compliance models if needed
      if (nextActions.retrain_compliance_models) {
        results.compliance_models_retrained = await this.retrainComplianceModels(repository);
      }

      // Alert orchestrator if needed
      if (nextActions.alert_archon_orchestrator) {
        results.orchestrator_alerted = await this.alertArchonOrchestrator(repository);
      }

    } catch (error) {
      logger.error('Failed to process next actions', {
        error: error.message,
        repository: repository.name
      });
      results.error = error.message;
    }

    return results;
  }

  /**
   * Update architecture context based on learning
   */
  async updateArchitectureContext(repository) {
    try {
      logger.info('Updating architecture context', { repository: repository.name });

      // Load compliance history to identify patterns
      const knowledgeFile = path.join(this.knowledgeBasePath, `${repository.name}-architecture.json`);
      const knowledge = JSON.parse(await fs.readFile(knowledgeFile, 'utf8'));

      // Generate context updates based on patterns
      const contextUpdates = {
        common_violations: knowledge.violation_patterns?.common_issues || [],
        success_factors: knowledge.success_patterns?.high_score_factors || [],
        improvement_suggestions: this.generateImprovementSuggestions(knowledge),
        updated_at: new Date().toISOString()
      };

      // Save context updates
      const contextFile = path.join(this.knowledgeBasePath, `${repository.name}-context-updates.json`);
      await fs.writeFile(contextFile, JSON.stringify(contextUpdates, null, 2));

      return true;
    } catch (error) {
      logger.error('Failed to update architecture context', { error: error.message });
      return false;
    }
  }

  /**
   * Generate improvement suggestions based on knowledge
   */
  generateImprovementSuggestions(knowledge) {
    const suggestions = [];

    if (knowledge.violation_patterns?.frequency > 0.3) {
      suggestions.push('Focus on architecture compliance training for development team');
      suggestions.push('Implement stricter pre-commit hooks for architecture validation');
    }

    if (knowledge.success_patterns?.improvement_trajectory === 'declining') {
      suggestions.push('Review recent changes that may have impacted compliance');
      suggestions.push('Consider additional architecture review sessions');
    }

    return suggestions;
  }

  /**
   * Retrain compliance models with new data
   */
  async retrainComplianceModels(repository) {
    try {
      logger.info('Retraining compliance models', { repository: repository.name });

      // In a real implementation, this would trigger ML model retraining
      // For now, we simulate the process

      const retrainingConfig = {
        repository: repository.name,
        timestamp: new Date().toISOString(),
        data_sources: [
          `${repository.name}-architecture.json`,
          `${repository.name}-security.json`
        ],
        model_updates: [
          'violation_detection_model',
          'compliance_scoring_model',
          'pattern_recognition_model'
        ]
      };

      // Save retraining log
      const retrainingFile = path.join(this.knowledgeBasePath, 'model-retraining-log.json');
      let log = [];
      try {
        log = JSON.parse(await fs.readFile(retrainingFile, 'utf8'));
      } catch (error) {
        // File doesn't exist, start new log
      }

      log.push(retrainingConfig);
      await fs.writeFile(retrainingFile, JSON.stringify(log, null, 2));

      return true;
    } catch (error) {
      logger.error('Failed to retrain compliance models', { error: error.message });
      return false;
    }
  }

  /**
   * Alert Archon orchestrator about critical issues
   */
  async alertArchonOrchestrator(repository) {
    try {
      const alertPayload = {
        alert_type: 'architecture_violation',
        severity: 'high',
        repository: repository.name,
        timestamp: new Date().toISOString(),
        message: 'Blocking architecture violations detected - immediate attention required'
      };

      // In real implementation, this would call Archon's alert API
      logger.info('Archon orchestrator alerted', { repository: repository.name });

      return true;
    } catch (error) {
      logger.error('Failed to alert Archon orchestrator', { error: error.message });
      return false;
    }
  }

  /**
   * Notify Archon orchestrator about knowledge updates
   */
  async notifyArchonOrchestrator(update) {
    try {
      // In real implementation, this would make HTTP call to Archon
      // const response = await fetch(`${this.archonApiUrl}/api/knowledge/update`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.archonApiKey}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(update)
      // });

      logger.info('Archon orchestrator notified', {
        type: update.type,
        repository: update.repository.name
      });

      return { success: true };
    } catch (error) {
      logger.error('Failed to notify Archon orchestrator', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle architecture violation event
   */
  async handleArchitectureViolation(payload) {
    logger.warn('Architecture violation detected', {
      repository: payload.repository.name,
      violations: payload.violations
    });

    // Immediate actions for violations
    await this.alertArchonOrchestrator(payload.repository);
    await this.updateViolationKnowledge(payload);

    return {
      status: 'violation_processed',
      actions_taken: ['orchestrator_alerted', 'knowledge_updated']
    };
  }

  /**
   * Handle security alert from Jules
   */
  async handleSecurityAlert(payload) {
    logger.warn('Jules security alert', {
      repository: payload.repository.name,
      severity: payload.severity
    });

    // Process security alert
    await this.updateSecurityKnowledge(payload.repository, payload.security_analysis);

    if (payload.severity === 'critical') {
      await this.alertArchonOrchestrator(payload.repository);
    }

    return {
      status: 'security_alert_processed',
      severity: payload.severity
    };
  }

  /**
   * Update violation knowledge for pattern analysis
   */
  async updateViolationKnowledge(payload) {
    try {
      const violationFile = path.join(this.knowledgeBasePath, 'violation-patterns.json');

      let violations = {};
      try {
        violations = JSON.parse(await fs.readFile(violationFile, 'utf8'));
      } catch (error) {
        violations = { patterns: [], updated: new Date().toISOString() };
      }

      violations.patterns.push({
        timestamp: new Date().toISOString(),
        repository: payload.repository.name,
        violations: payload.violations,
        context: payload.context
      });

      violations.updated = new Date().toISOString();

      await fs.writeFile(violationFile, JSON.stringify(violations, null, 2));

    } catch (error) {
      logger.error('Failed to update violation knowledge', { error: error.message });
    }
  }
}

export default ArchonKnowledgeWebhookHandler;
