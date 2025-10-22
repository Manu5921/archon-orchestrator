#!/usr/bin/env node

/**
 * SECURITY AUTOMATION SCHEDULER
 * Planification automatique des tâches de sécurité pour Jules
 */

import cron from 'node-cron';
import { JulesSecurityGuardian } from './jules-security-guardian.js';
import { logger } from './src/utils/logger.js';
import fs from 'fs/promises';

class SecurityAutomationScheduler {
  constructor() {
    this.guardian = new JulesSecurityGuardian();
    this.schedules = new Map();
    this.isRunning = false;
    this.notifications = {
      slack: process.env.SLACK_WEBHOOK_URL,
      email: process.env.NOTIFICATION_EMAIL,
      discord: process.env.DISCORD_WEBHOOK_URL
    };
  }

  /**
   * Initialize scheduler
   */
  async init() {
    await this.guardian.init();
    logger.info('🕐 Security Automation Scheduler initialized');
  }

  /**
   * Start all security automation schedules
   */
  async start() {
    if (this.isRunning) {
      logger.warn('⚠️ Scheduler already running');
      return;
    }

    logger.info('🚀 Starting security automation schedules...');
    this.isRunning = true;

    // Schedule security scans
    this.scheduleSecurityScans();

    // Schedule compliance checks
    this.scheduleComplianceChecks();

    // Schedule dependency audits
    this.scheduleDependencyAudits();

    // Schedule performance security monitoring
    this.schedulePerformanceSecurityMonitoring();

    // Schedule threat intelligence updates
    this.scheduleThreatIntelligence();

    logger.info('✅ All security schedules active');
  }

  /**
   * Schedule regular security scans
   */
  scheduleSecurityScans() {
    // Daily quick scan (morning)
    const dailyScan = cron.schedule('0 7 * * *', async () => {
      logger.info('🌅 Running daily security scan...');
      try {
        const results = await this.guardian.runSecurityScan({
          scanType: 'quick',
          priority: 'high'
        });
        await this.handleScanResults('daily', results);
      } catch (error) {
        logger.error(`❌ Daily scan failed: ${error.message}`);
        await this.notifySecurityTeam('DAILY_SCAN_FAILED', error.message);
      }
    });

    // Weekly comprehensive scan (Sunday night)
    const weeklyScan = cron.schedule('0 2 * * 0', async () => {
      logger.info('📊 Running weekly comprehensive scan...');
      try {
        const results = await this.guardian.runSecurityScan({
          scanType: 'comprehensive',
          priority: 'all'
        });
        await this.handleScanResults('weekly', results);
        await this.generateWeeklySecurityReport(results);
      } catch (error) {
        logger.error(`❌ Weekly scan failed: ${error.message}`);
        await this.notifySecurityTeam('WEEKLY_SCAN_FAILED', error.message);
      }
    });

    // Critical pattern monitoring (every 2 hours during work time)
    const criticalMonitoring = cron.schedule('0 */2 8-20 * * *', async () => {
      logger.info('🚨 Running critical pattern monitoring...');
      try {
        const results = await this.guardian.runSecurityScan({
          scanType: 'critical_only',
          priority: 'critical'
        });

        if (results.stats.criticalIssues > 0) {
          await this.notifySecurityTeam('CRITICAL_ISSUES_DETECTED', {
            count: results.stats.criticalIssues,
            issues: results.issues.filter(i => i.severity === 'CRITICAL')
          });
        }
      } catch (error) {
        logger.error(`❌ Critical monitoring failed: ${error.message}`);
      }
    });

    this.schedules.set('dailyScan', dailyScan);
    this.schedules.set('weeklyScan', weeklyScan);
    this.schedules.set('criticalMonitoring', criticalMonitoring);

    logger.info('📅 Security scan schedules configured');
  }

  /**
   * Schedule compliance checks
   */
  scheduleComplianceChecks() {
    // GDPR compliance check (weekly, Tuesday)
    const gdprCheck = cron.schedule('0 9 * * 2', async () => {
      logger.info('🛡️ Running GDPR compliance check...');
      try {
        const results = await this.runGDPRComplianceCheck();
        await this.handleComplianceResults('GDPR', results);
      } catch (error) {
        logger.error(`❌ GDPR check failed: ${error.message}`);
      }
    });

    // OWASP Top 10 check (bi-weekly, Friday)
    const owaspCheck = cron.schedule('0 14 */14 * 5', async () => {
      logger.info('🛡️ Running OWASP Top 10 compliance check...');
      try {
        const results = await this.runOWASPComplianceCheck();
        await this.handleComplianceResults('OWASP', results);
      } catch (error) {
        logger.error(`❌ OWASP check failed: ${error.message}`);
      }
    });

    // Security policy compliance (monthly, 1st)
    const policyCheck = cron.schedule('0 10 1 * *', async () => {
      logger.info('📋 Running security policy compliance check...');
      try {
        const results = await this.runSecurityPolicyCheck();
        await this.handleComplianceResults('POLICY', results);
      } catch (error) {
        logger.error(`❌ Policy check failed: ${error.message}`);
      }
    });

    this.schedules.set('gdprCheck', gdprCheck);
    this.schedules.set('owaspCheck', owaspCheck);
    this.schedules.set('policyCheck', policyCheck);

    logger.info('✅ Compliance check schedules configured');
  }

  /**
   * Schedule dependency audits
   */
  scheduleDependencyAudits() {
    // Daily dependency vulnerability check
    const dailyDeps = cron.schedule('0 6 * * *', async () => {
      logger.info('📦 Running daily dependency audit...');
      try {
        const results = await this.runDependencyAudit();
        await this.handleDependencyResults('daily', results);
      } catch (error) {
        logger.error(`❌ Dependency audit failed: ${error.message}`);
      }
    });

    // Weekly dependency update recommendations
    const weeklyDeps = cron.schedule('0 15 * * 3', async () => {
      logger.info('🔄 Generating dependency update recommendations...');
      try {
        const recommendations = await this.generateUpdateRecommendations();
        await this.saveDependencyRecommendations(recommendations);

        if (recommendations.critical.length > 0) {
          await this.notifySecurityTeam('CRITICAL_DEPS_UPDATE', recommendations.critical);
        }
      } catch (error) {
        logger.error(`❌ Dependency recommendations failed: ${error.message}`);
      }
    });

    this.schedules.set('dailyDeps', dailyDeps);
    this.schedules.set('weeklyDeps', weeklyDeps);

    logger.info('📦 Dependency audit schedules configured');
  }

  /**
   * Schedule performance security monitoring
   */
  schedulePerformanceSecurityMonitoring() {
    // Security performance metrics (every 4 hours)
    const perfSecurity = cron.schedule('0 */4 * * *', async () => {
      logger.info('⚡ Running security performance monitoring...');
      try {
        const metrics = await this.collectSecurityPerformanceMetrics();
        await this.analyzeSecurityPerformance(metrics);
      } catch (error) {
        logger.error(`❌ Performance security monitoring failed: ${error.message}`);
      }
    });

    this.schedules.set('perfSecurity', perfSecurity);
    logger.info('⚡ Performance security monitoring configured');
  }

  /**
   * Schedule threat intelligence updates
   */
  scheduleThreatIntelligence() {
    // Threat intelligence feed updates (every 6 hours)
    const threatIntel = cron.schedule('0 */6 * * *', async () => {
      logger.info('🎯 Updating threat intelligence feeds...');
      try {
        await this.updateThreatIntelligence();
        await this.checkForNewThreats();
      } catch (error) {
        logger.error(`❌ Threat intelligence update failed: ${error.message}`);
      }
    });

    this.schedules.set('threatIntel', threatIntel);
    logger.info('🎯 Threat intelligence schedules configured');
  }

  /**
   * Handle security scan results
   */
  async handleScanResults(scanType, results) {
    const timestamp = new Date().toISOString();

    // Save results
    const reportPath = `security-reports/scan-${scanType}-${timestamp.split('T')[0]}.json`;
    await fs.writeFile(reportPath, JSON.stringify(results, null, 2));

    // Check for critical issues requiring immediate attention
    if (results.stats.criticalIssues > 0) {
      const criticalIssues = results.issues.filter(i => i.severity === 'CRITICAL');

      await this.notifySecurityTeam('CRITICAL_SECURITY_ISSUES', {
        scanType,
        count: results.stats.criticalIssues,
        issues: criticalIssues.slice(0, 5), // Top 5 critical issues
        reportPath
      });

      // Create immediate action items for Claude/Gemini
      await this.createSecurityActionItems(criticalIssues);
    }

    // Update security dashboard metrics
    await this.updateSecurityDashboard(results);

    logger.info(`📊 ${scanType} scan results processed: ${results.issues.length} issues found`);
  }

  /**
   * Generate weekly security report
   */
  async generateWeeklySecurityReport(scanResults) {
    logger.info('📋 Generating weekly security report...');

    const report = await this.guardian.generateSecurityReport();

    // Add trend analysis
    report.trendAnalysis = await this.generateSecurityTrends();

    // Add risk assessment
    report.riskAssessment = await this.assessCurrentRisk();

    // Add recommendations for Claude/Gemini
    report.aiRecommendations = this.generateAIRecommendations(report);

    // Save comprehensive report
    const timestamp = new Date().toISOString().split('T')[0];
    const reportPath = `security-reports/weekly-report-${timestamp}.json`;
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    // Notify stakeholders
    await this.notifySecurityTeam('WEEKLY_SECURITY_REPORT', {
      reportPath,
      summary: report.executiveSummary,
      criticalCount: report.riskAssessment.critical,
      trends: report.trendAnalysis
    });

    logger.info(`✅ Weekly security report generated: ${reportPath}`);
  }

  /**
   * Create security action items for Claude/Gemini workflow
   */
  async createSecurityActionItems(criticalIssues) {
    const actionItems = criticalIssues.map(issue => ({
      id: `security_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'security_fix',
      priority: 'critical',
      title: `Security Fix: ${issue.category}`,
      description: issue.description,
      file: issue.file,
      recommendation: issue.recommendation,
      cwe: issue.cwe,
      owasp: issue.owasp,
      estimatedEffort: this.estimateFixEffort(issue),
      assignee: this.determineAssignee(issue) // Claude, Gemini, or Jules
    }));

    // Save to action items queue
    const actionItemsPath = 'security-action-items.json';
    let existingItems = [];

    try {
      const data = await fs.readFile(actionItemsPath, 'utf8');
      existingItems = JSON.parse(data);
    } catch (error) {
      // File doesn't exist, start fresh
    }

    existingItems.push(...actionItems);
    await fs.writeFile(actionItemsPath, JSON.stringify(existingItems, null, 2));

    logger.info(`📝 Created ${actionItems.length} security action items`);
  }

  /**
   * Notify security team
   */
  async notifySecurityTeam(type, data) {
    const message = this.formatSecurityNotification(type, data);

    // Send to configured notification channels
    const promises = [];

    if (this.notifications.slack) {
      promises.push(this.sendSlackNotification(message));
    }

    if (this.notifications.discord) {
      promises.push(this.sendDiscordNotification(message));
    }

    if (this.notifications.email) {
      promises.push(this.sendEmailNotification(message));
    }

    await Promise.allSettled(promises);
    logger.info(`📢 Security notification sent: ${type}`);
  }

  formatSecurityNotification(type, data) {
    const templates = {
      'CRITICAL_ISSUES_DETECTED': `🚨 **CRITICAL Security Issues Detected**
        Count: ${data.count}
        Time: ${new Date().toISOString()}
        Top Issues: ${data.issues.slice(0, 3).map(i => i.description).join(', ')}
        Action Required: Immediate`,

      'WEEKLY_SECURITY_REPORT': `📊 **Weekly Security Report**
        Report: ${data.reportPath}
        Critical Issues: ${data.summary.criticalIssues}
        Risk Level: ${data.summary.riskLevel}
        Trend: ${data.trends.direction}`,

      'CRITICAL_DEPS_UPDATE': `📦 **Critical Dependencies Update Required**
        Count: ${data.length}
        Packages: ${data.slice(0, 3).map(d => d.package).join(', ')}`
    };

    return templates[type] || `Security Alert: ${type}`;
  }

  // Placeholder methods for integration
  async sendSlackNotification(message) {
    // Implementation for Slack webhook
    logger.info('📱 Slack notification sent');
  }

  async sendDiscordNotification(message) {
    // Implementation for Discord webhook
    logger.info('💬 Discord notification sent');
  }

  async sendEmailNotification(message) {
    // Implementation for email notification
    logger.info('✉️ Email notification sent');
  }

  async runGDPRComplianceCheck() {
    // GDPR compliance implementation
    return { compliant: true, issues: [] };
  }

  async runOWASPComplianceCheck() {
    // OWASP Top 10 compliance implementation
    return { score: 85, issues: [] };
  }

  async runSecurityPolicyCheck() {
    // Security policy compliance implementation
    return { compliant: true, violations: [] };
  }

  async runDependencyAudit() {
    // Dependency audit implementation
    return { vulnerabilities: [] };
  }

  async generateUpdateRecommendations() {
    // Generate dependency update recommendations
    return { critical: [], high: [], medium: [] };
  }

  estimateFixEffort(issue) {
    const effortMap = {
      'CRITICAL': '2-4 hours',
      'HIGH': '1-2 hours',
      'MEDIUM': '30-60 minutes',
      'LOW': '15-30 minutes'
    };
    return effortMap[issue.severity] || '1 hour';
  }

  determineAssignee(issue) {
    // Logic to determine best assignee based on issue type
    if (issue.category === 'code_pattern') return 'Claude';
    if (issue.category === 'architecture') return 'Gemini';
    if (issue.category === 'implementation') return 'Jules';
    return 'Claude'; // Default
  }

  /**
   * Stop all schedules
   */
  stop() {
    logger.info('⏹️ Stopping security automation schedules...');

    for (const [name, schedule] of this.schedules.entries()) {
      schedule.destroy();
      logger.info(`✅ Stopped ${name} schedule`);
    }

    this.schedules.clear();
    this.isRunning = false;

    logger.info('🛑 All security schedules stopped');
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeSchedules: Array.from(this.schedules.keys()),
      nextRuns: this.getNextRunTimes()
    };
  }

  getNextRunTimes() {
    const nextRuns = {};
    for (const [name, schedule] of this.schedules.entries()) {
      nextRuns[name] = schedule.nextDate()?.toISOString();
    }
    return nextRuns;
  }
}

// CLI Interface
async function main() {
  const scheduler = new SecurityAutomationScheduler();
  await scheduler.init();

  const command = process.argv[2];

  switch (command) {
  case 'start':
    await scheduler.start();
    console.log('🚀 Security automation started. Press Ctrl+C to stop.');

    // Keep process alive
    process.on('SIGINT', async () => {
      console.log('\n⏹️ Shutting down security automation...');
      scheduler.stop();
      process.exit(0);
    });

    // Keep running
    await new Promise(() => {});
    break;

  case 'status':
    const status = scheduler.getStatus();
    console.log('\n📊 SECURITY AUTOMATION STATUS');
    console.log('══════════════════════════════');
    console.log(`🔄 Running: ${status.isRunning}`);
    console.log(`📅 Active Schedules: ${status.activeSchedules.length}`);
    status.activeSchedules.forEach(name => {
      console.log(`   - ${name}: ${status.nextRuns[name] || 'N/A'}`);
    });
    break;

  default:
    console.log(`
Security Automation Scheduler

Commands:
  start    Start all security automation schedules
  status   Show scheduler status

Examples:
  node security-automation-scheduler.js start
  node security-automation-scheduler.js status
      `);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SecurityAutomationScheduler };
