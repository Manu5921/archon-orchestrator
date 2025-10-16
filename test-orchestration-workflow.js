#!/usr/bin/env node

/**
 * ORCHESTRATION WORKFLOW TEST - REAL GEMINI INTEGRATION
 * Tests Claude (orchestrator) → Gemini collaboration with optimized Bridge
 * Demonstrates practical orchestration scenarios
 */

import { geminiSend } from './src/agents/gemini-agent.js';
import { Logger } from './src/utils/logger.js';
import { setTimeout as wait } from 'node:timers/promises';

const logger = new Logger('Orchestration-Workflow-Test');

class OrchestrationWorkflowTest {
  constructor() {
    this.results = [];
  }

  /**
   * TEST 1: Code Review Orchestration
   * Claude sends code to Gemini for review and receives feedback
   */
  async testCodeReview() {
    logger.info('🎨 TEST 1: Code Review Orchestration');
    logger.info('═'.repeat(50));

    const codeToReview = `
function authenticateUser(email, password) {
  if (!email || !password) {
    throw new Error('Missing credentials');
  }
  
  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.hashedPassword)) {
    throw new Error('Invalid credentials');
  }
  
  return generateJWT(user.id);
}`;

    const reviewPrompt = `🎨 **CODE REVIEW REQUEST FROM CLAUDE ORCHESTRATOR**

As part of the Archon Orchestrator workflow, please review this authentication function:

\`\`\`javascript
${codeToReview}
\`\`\`

Provide:
1. **Quality Score** (0-100)
2. **Security Issues** 
3. **Performance Suggestions**
4. **Best Practice Recommendations**

Reply with "REVIEW_COMPLETE" at the end to signal orchestrator completion.`;

    const startTime = Date.now();

    try {
      const result = await geminiSend(reviewPrompt);
      const duration = Date.now() - startTime;

      if (result.ok) {
        const reviewComplete = result.text.includes('REVIEW_COMPLETE');

        logger.info(`✅ Code Review completed in ${duration}ms`);
        logger.info(`📊 Mode: ${result.meta?.mode || 'unknown'}`);
        logger.info(`🎯 Review complete signal: ${reviewComplete ? 'YES' : 'NO'}`);
        logger.info(`📝 Preview: ${result.text.slice(0, 150)}...`);

        this.results.push({
          test: 'code_review',
          success: true,
          duration_ms: duration,
          mode: result.meta?.mode,
          completion_signal: reviewComplete,
          response_length: result.text.length
        });

        return { success: true, duration, response: result.text };

      } else {
        logger.error(`❌ Code Review failed: ${result.error}`);

        this.results.push({
          test: 'code_review',
          success: false,
          error: result.error,
          duration_ms: duration
        });

        return { success: false, error: result.error };
      }

    } catch (error) {
      logger.error(`💥 Code Review crashed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * TEST 2: Feature Planning Orchestration
   * Claude requests feature planning from Gemini
   */
  async testFeaturePlanning() {
    logger.info('\n🚀 TEST 2: Feature Planning Orchestration');
    logger.info('═'.repeat(50));

    const planningPrompt = `🚀 **FEATURE PLANNING REQUEST FROM CLAUDE ORCHESTRATOR**

Project: E-commerce Platform Enhancement
Current Status: Basic auth and product catalog working

**NEW FEATURE REQUEST:**
Implement a recommendation engine that suggests products based on:
- User purchase history
- Browsing behavior  
- Similar users' preferences
- Product ratings and reviews

Please provide:
1. **Implementation Strategy** (2-3 approaches)
2. **Technical Requirements** (database, API, ML components)
3. **Timeline Estimate** (breakdown by phase)
4. **Potential Challenges** and mitigation strategies

Reply with "PLANNING_COMPLETE" at the end for orchestrator synchronization.`;

    const startTime = Date.now();

    try {
      const result = await geminiSend(planningPrompt);
      const duration = Date.now() - startTime;

      if (result.ok) {
        const planningComplete = result.text.includes('PLANNING_COMPLETE');

        logger.info(`✅ Feature Planning completed in ${duration}ms`);
        logger.info(`📊 Mode: ${result.meta?.mode || 'unknown'}`);
        logger.info(`🎯 Planning complete signal: ${planningComplete ? 'YES' : 'NO'}`);
        logger.info(`📝 Preview: ${result.text.slice(0, 150)}...`);

        this.results.push({
          test: 'feature_planning',
          success: true,
          duration_ms: duration,
          mode: result.meta?.mode,
          completion_signal: planningComplete,
          response_length: result.text.length
        });

        return { success: true, duration, response: result.text };

      } else {
        logger.error(`❌ Feature Planning failed: ${result.error}`);

        this.results.push({
          test: 'feature_planning',
          success: false,
          error: result.error,
          duration_ms: duration
        });

        return { success: false, error: result.error };
      }

    } catch (error) {
      logger.error(`💥 Feature Planning crashed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * TEST 3: Bug Analysis Orchestration
   * Claude sends error logs to Gemini for debugging
   */
  async testBugAnalysis() {
    logger.info('\n🐛 TEST 3: Bug Analysis Orchestration');
    logger.info('═'.repeat(50));

    const bugPrompt = `🐛 **BUG ANALYSIS REQUEST FROM CLAUDE ORCHESTRATOR**

Production Error Report:
- **Frequency**: 15 occurrences in last 24h
- **Impact**: Payment processing failures
- **User Complaints**: 8 tickets opened

**ERROR LOGS:**
\`\`\`
TypeError: Cannot read property 'amount' of undefined
    at processPayment (payment-service.js:142)
    at checkout.js:89
    at async PaymentController.handleCheckout
    
Request Context:
- User ID: various users affected  
- Payment Method: Credit card (Stripe)
- Cart Items: Random products, no pattern
- Browser: Mixed (Chrome, Safari, Firefox)
\`\`\`

Please provide:
1. **Root Cause Analysis**
2. **Fix Recommendations** (specific code changes)
3. **Prevention Strategy** (how to avoid similar issues)
4. **Testing Approach** (validation steps)

Reply with "ANALYSIS_COMPLETE" for orchestrator workflow continuation.`;

    const startTime = Date.now();

    try {
      const result = await geminiSend(bugPrompt);
      const duration = Date.now() - startTime;

      if (result.ok) {
        const analysisComplete = result.text.includes('ANALYSIS_COMPLETE');

        logger.info(`✅ Bug Analysis completed in ${duration}ms`);
        logger.info(`📊 Mode: ${result.meta?.mode || 'unknown'}`);
        logger.info(`🎯 Analysis complete signal: ${analysisComplete ? 'YES' : 'NO'}`);
        logger.info(`📝 Preview: ${result.text.slice(0, 150)}...`);

        this.results.push({
          test: 'bug_analysis',
          success: true,
          duration_ms: duration,
          mode: result.meta?.mode,
          completion_signal: analysisComplete,
          response_length: result.text.length
        });

        return { success: true, duration, response: result.text };

      } else {
        logger.error(`❌ Bug Analysis failed: ${result.error}`);

        this.results.push({
          test: 'bug_analysis',
          success: false,
          error: result.error,
          duration_ms: duration
        });

        return { success: false, error: result.error };
      }

    } catch (error) {
      logger.error(`💥 Bug Analysis crashed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate comprehensive workflow report
   */
  generateWorkflowReport() {
    logger.info('\n📊 ORCHESTRATION WORKFLOW REPORT');
    logger.info('═'.repeat(60));

    const successful = this.results.filter(r => r.success).length;
    const total = this.results.length;
    const successRate = Math.round((successful / total) * 100);

    const avgDuration = Math.round(
      this.results
        .filter(r => r.success && r.duration_ms)
        .reduce((sum, r) => sum + r.duration_ms, 0) /
      successful || 0
    );

    const bridgeMode = this.results.filter(r => r.mode === 'bridge').length;
    const cliMode = this.results.filter(r => r.mode === 'cli-prompt').length;

    logger.info(`🎯 SUCCESS RATE: ${successful}/${total} (${successRate}%)`);
    logger.info(`⏱️ AVERAGE DURATION: ${avgDuration}ms`);
    logger.info(`🌉 BRIDGE MODE USAGE: ${bridgeMode}/${successful} successful tests`);
    logger.info(`⌨️ CLI MODE USAGE: ${cliMode}/${successful} successful tests`);

    // Performance analysis
    if (avgDuration < 3000) {
      logger.info(`🚀 PERFORMANCE: EXCELLENT (${avgDuration}ms avg)`);
    } else if (avgDuration < 6000) {
      logger.info(`✅ PERFORMANCE: GOOD (${avgDuration}ms avg)`);
    } else {
      logger.info(`⚠️ PERFORMANCE: NEEDS OPTIMIZATION (${avgDuration}ms avg)`);
    }

    // Detailed breakdown
    logger.info('\n📝 DETAILED TEST RESULTS:');
    this.results.forEach((result, i) => {
      const status = result.success ? '✅' : '❌';
      const duration = result.duration_ms ? `${result.duration_ms}ms` : 'N/A';
      const mode = result.mode || 'unknown';
      const signal = result.completion_signal ? '🎯' : '⚠️';

      logger.info(`${i + 1}. ${status} ${result.test}: ${duration} (${mode}) ${signal}`);
    });

    // Recommendations
    logger.info('\n💡 ORCHESTRATION RECOMMENDATIONS:');

    if (successRate === 100) {
      logger.info('🎉 Perfect! Claude ↔ Gemini orchestration is fully operational');
      logger.info('✨ Ready for production workflow deployment');
    } else if (successRate >= 80) {
      logger.info('✅ Good orchestration success rate - minor optimization needed');
    } else {
      logger.info('⚠️ Orchestration needs improvement - check Bridge/CLI configuration');
    }

    if (bridgeMode > cliMode) {
      logger.info('🌉 Bridge mode is primary - optimal performance achieved');
    } else {
      logger.info('⌨️ CLI mode is primary - consider Bridge optimization for speed');
    }

    return {
      success_rate: successRate,
      avg_duration: avgDuration,
      bridge_usage: bridgeMode,
      cli_usage: cliMode,
      recommendation: successRate === 100 ? 'production_ready' : 'needs_optimization'
    };
  }

  /**
   * Save detailed results
   */
  async saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `orchestration-workflow-results-${timestamp}.json`;

    const fullResults = {
      timestamp: new Date().toISOString(),
      test_suite: 'orchestration_workflow',
      environment: {
        GEMINI_API_URL: process.env.GEMINI_API_URL || 'not_set',
        GEMINI_CLI_PATH: process.env.GEMINI_CLI_PATH || 'gemini'
      },
      individual_tests: this.results,
      summary: this.generateWorkflowReport()
    };

    try {
      const fs = await import('fs/promises');
      await fs.writeFile(filename, JSON.stringify(fullResults, null, 2));
      logger.info(`💾 Full results saved to: ${filename}`);
    } catch (error) {
      logger.warn(`⚠️ Could not save results: ${error.message}`);
    }
  }
}

/**
 * MAIN EXECUTION
 */
async function runOrchestrationWorkflow() {
  logger.info('🎼 CLAUDE ↔ GEMINI ORCHESTRATION WORKFLOW TEST');
  logger.info('Testing real-world orchestration scenarios with optimized Bridge');
  logger.info('═'.repeat(70));

  const workflow = new OrchestrationWorkflowTest();

  try {
    // Sequential execution to avoid overwhelming Gemini
    logger.info('⚡ Starting orchestration tests...\n');

    await workflow.testCodeReview();
    await wait(1000); // Brief pause between tests

    await workflow.testFeaturePlanning();
    await wait(1000);

    await workflow.testBugAnalysis();

    // Generate comprehensive report
    const report = workflow.generateWorkflowReport();
    await workflow.saveResults();

    // Exit with status based on results
    const success = report.success_rate >= 80;
    logger.info(`\n${success ? '🎉' : '😞'} Orchestration workflow ${success ? 'successful' : 'needs improvement'}`);

    process.exit(success ? 0 : 1);

  } catch (error) {
    logger.error(`💥 Workflow test crashed: ${error.message}`);
    process.exit(1);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runOrchestrationWorkflow().catch(console.error);
}

export { OrchestrationWorkflowTest };
