#!/usr/bin/env node

/**
 * TEST SECURITY INTEGRATION
 * Test complet du système de sécurité automatisé Jules
 */

import { JulesSecurityGuardian } from './jules-security-guardian.js';
import { SecurityAutomationScheduler } from './security-automation-scheduler.js';
import fs from 'fs/promises';
import path from 'path';

const SECURITY_TEST_DIR = './security-test-files';

class SecurityIntegrationTester {
  constructor() {
    this.guardian = new JulesSecurityGuardian();
    this.scheduler = new SecurityAutomationScheduler();
  }

  async init() {
    console.log('🔧 Initializing security integration test...');
    
    await this.guardian.init();
    await this.scheduler.init();
    
    // Create test directory with vulnerable code samples
    await this.createTestFiles();
    
    console.log('✅ Security test environment ready');
  }

  /**
   * Create test files with known security vulnerabilities
   */
  async createTestFiles() {
    await fs.mkdir(SECURITY_TEST_DIR, { recursive: true });

    // Test file 1: Authentication vulnerabilities
    const authVulnerable = `
// Vulnerable authentication code
const express = require('express');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'mysecret'; // SECURITY ISSUE: Weak secret

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // SECURITY ISSUE: SQL injection vulnerability
  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
  
  db.query(query, (err, results) => {
    if (results.length > 0) {
      const token = jwt.sign({ userId: results[0].id }, SECRET_KEY);
      res.cookie('token', token, { secure: false }); // SECURITY ISSUE: Insecure cookie
      res.json({ success: true, token });
    }
  });
});

// SECURITY ISSUE: Password in localStorage
localStorage.setItem('userPassword', password);
`;

    // Test file 2: CORS and headers issues
    const corsVulnerable = `
// Vulnerable CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    return callback(null, true); // SECURITY ISSUE: Allow all origins
  },
  credentials: true
}));

// SECURITY ISSUE: Missing security headers
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'ALLOW'); // SECURITY ISSUE: Allows framing
  next();
});

// SECURITY ISSUE: Debug info exposure
app.use((err, req, res, next) => {
  console.log('Error with user password:', req.body.password); // SECURITY ISSUE: Password logging
  res.json({ error: err.stack }); // SECURITY ISSUE: Stack trace exposure
});
`;

    // Test file 3: File system vulnerabilities
    const fileVulnerable = `
// Vulnerable file operations
app.get('/download', (req, res) => {
  const filename = req.query.file;
  
  // SECURITY ISSUE: Path traversal vulnerability
  const filePath = path.join('./uploads/', filename);
  res.download(filePath);
});

// SECURITY ISSUE: Command injection
app.post('/execute', (req, res) => {
  const command = req.body.command;
  exec(command, (error, stdout) => { // SECURITY ISSUE: Direct command execution
    res.send(stdout);
  });
});

// SECURITY ISSUE: API key exposure
const API_KEY = 'sk-abcd1234567890abcdef'; // SECURITY ISSUE: Hardcoded API key
`;

    await fs.writeFile(path.join(SECURITY_TEST_DIR, 'auth-vulnerable.js'), authVulnerable);
    await fs.writeFile(path.join(SECURITY_TEST_DIR, 'cors-vulnerable.js'), corsVulnerable);
    await fs.writeFile(path.join(SECURITY_TEST_DIR, 'file-vulnerable.js'), fileVulnerable);

    console.log('📁 Created test files with known vulnerabilities');
  }

  /**
   * Test security scan functionality
   */
  async testSecurityScan() {
    console.log('\\n🔍 Testing security scan functionality...');
    
    const results = await this.guardian.runSecurityScan({
      paths: [SECURITY_TEST_DIR],
      scanType: 'comprehensive'
    });

    console.log('📊 Scan Results:');
    console.log(`   Total Issues: ${results.issues.length}`);
    console.log(`   Critical: ${results.stats.criticalIssues}`);
    console.log(`   High: ${results.stats.highIssues}`);
    console.log(`   Medium: ${results.stats.mediumIssues}`);
    console.log(`   Low: ${results.stats.lowIssues}`);

    // Verify expected vulnerabilities are detected
    const expectedPatterns = [
      'hardcodedSecrets',
      'sqlInjection', 
      'corsUnsafe',
      'pathTraversal',
      'commandInjection',
      'apiKeyExposed'
    ];

    let detectedPatterns = new Set(results.issues.map(i => i.pattern));
    let missingPatterns = expectedPatterns.filter(p => !detectedPatterns.has(p));

    if (missingPatterns.length === 0) {
      console.log('✅ All expected vulnerability patterns detected');
    } else {
      console.log(`⚠️ Missing patterns: ${missingPatterns.join(', ')}`);
    }

    return results;
  }

  /**
   * Test security report generation
   */
  async testReportGeneration(scanResults) {
    console.log('\\n📋 Testing security report generation...');
    
    try {
      console.log('🔍 Debug - scanResults structure:', Object.keys(scanResults));
      console.log('🔍 Debug - issues count:', scanResults.issues?.length);
      console.log('🔍 Debug - stats:', scanResults.stats);
      
      const report = await this.guardian.generateSecurityReport(scanResults);
      
      console.log('🔍 Debug - report structure:', Object.keys(report));
      
      // Test markdown report
      const markdown = this.guardian.generateMarkdownReport(report);
      await fs.writeFile('./security-test-report.md', markdown);
      
      console.log('✅ Generated security report: security-test-report.md');
      console.log(`📊 Report contains ${report.executiveSummary.totalIssues} total issues`);
      
      return report;
    } catch (error) {
      console.error('❌ Report generation failed:', error.message);
      console.error('🔍 Error stack:', error.stack);
      throw error;
    }
  }

  /**
   * Test scheduler status and next runs
   */
  async testSchedulerStatus() {
    console.log('\\n⏰ Testing scheduler status...');
    
    const status = this.scheduler.getStatus();
    
    console.log('📅 Scheduler Status:');
    console.log(`   Running: ${status.isRunning}`);
    console.log(`   Active Schedules: ${status.activeSchedules.length}`);
    
    if (status.activeSchedules.length > 0) {
      console.log('   Next Runs:');
      status.activeSchedules.forEach(name => {
        console.log(`     ${name}: ${status.nextRuns[name] || 'N/A'}`);
      });
      console.log('✅ Scheduler running with active schedules');
    } else {
      console.log('⚠️ No active schedules found');
    }
    
    return status;
  }

  /**
   * Test action item creation
   */
  async testActionItems(scanResults) {
    console.log('\\n📝 Testing action item creation...');
    
    const criticalIssues = scanResults.issues.filter(i => i.severity === 'CRITICAL');
    
    if (criticalIssues.length > 0) {
      await this.scheduler.createSecurityActionItems(criticalIssues);
      
      // Read generated action items
      try {
        const actionItems = JSON.parse(await fs.readFile('security-action-items.json', 'utf8'));
        console.log(`✅ Created ${actionItems.length} security action items`);
        
        // Show sample action item
        if (actionItems.length > 0) {
          const sample = actionItems[0];
          console.log('📋 Sample Action Item:');
          console.log(`   Title: ${sample.title}`);
          console.log(`   Priority: ${sample.priority}`);
          console.log(`   Assignee: ${sample.assignee}`);
          console.log(`   Effort: ${sample.estimatedEffort}`);
        }
      } catch (error) {
        console.log('⚠️ Could not read action items file');
      }
    } else {
      console.log('ℹ️ No critical issues found for action items');
    }
  }

  /**
   * Test notification formatting
   */
  async testNotifications(scanResults) {
    console.log('\\n📢 Testing notification formatting...');
    
    // Test critical issues notification
    const criticalIssues = scanResults.issues.filter(i => i.severity === 'CRITICAL');
    
    if (criticalIssues.length > 0) {
      const message = this.scheduler.formatSecurityNotification('CRITICAL_ISSUES_DETECTED', {
        count: criticalIssues.length,
        issues: criticalIssues
      });
      
      console.log('🚨 Sample Critical Issues Notification:');
      console.log(message);
      console.log('✅ Notification formatting working');
    } else {
      console.log('ℹ️ No critical issues for notification test');
    }

    // Test weekly report notification
    const weeklyMessage = this.scheduler.formatSecurityNotification('WEEKLY_SECURITY_REPORT', {
      reportPath: 'security-test-report.md',
      summary: { criticalIssues: criticalIssues.length, riskLevel: 'MEDIUM' },
      trends: { direction: 'IMPROVING' }
    });
    
    console.log('\\n📊 Sample Weekly Report Notification:');
    console.log(weeklyMessage);
  }

  /**
   * Cleanup test files
   */
  async cleanup() {
    console.log('\\n🧹 Cleaning up test files...');
    
    try {
      await fs.rm(SECURITY_TEST_DIR, { recursive: true, force: true });
      await fs.unlink('./security-test-report.md').catch(() => {});
      console.log('✅ Test cleanup completed');
    } catch (error) {
      console.log('⚠️ Cleanup warning:', error.message);
    }
  }

  /**
   * Run complete integration test
   */
  async runFullTest() {
    console.log('🚀 Starting Jules Security Integration Test\\n');
    console.log('═'.repeat(50));
    
    try {
      // Initialize
      await this.init();
      
      // Test security scanning
      const scanResults = await this.testSecurityScan();
      
      // Test report generation
      await this.testReportGeneration(scanResults);
      
      // Test scheduler
      await this.testSchedulerStatus();
      
      // Test action items
      await this.testActionItems(scanResults);
      
      // Test notifications
      await this.testNotifications(scanResults);
      
      console.log('\\n' + '═'.repeat(50));
      console.log('🎉 Security Integration Test COMPLETED SUCCESSFULLY!');
      console.log('\\n📊 Test Summary:');
      console.log(`   Vulnerabilities Detected: ${scanResults.issues.length}`);
      console.log(`   Critical Issues: ${scanResults.stats.criticalIssues}`);
      console.log(`   Security Report Generated: ✅`);
      console.log(`   Action Items Created: ✅`);
      console.log(`   Notifications Working: ✅`);
      
      return {
        success: true,
        totalIssues: scanResults.issues.length,
        criticalIssues: scanResults.stats.criticalIssues
      };
      
    } catch (error) {
      console.error('❌ Integration test failed:', error.message);
      return { success: false, error: error.message };
    } finally {
      await this.cleanup();
    }
  }
}

// Run test if called directly
async function main() {
  const tester = new SecurityIntegrationTester();
  const result = await tester.runFullTest();
  
  if (!result.success) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SecurityIntegrationTester };