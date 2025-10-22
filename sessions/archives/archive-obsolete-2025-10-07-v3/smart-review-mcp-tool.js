#!/usr/bin/env node
/**
 * SMART REVIEW MCP TOOL
 * Intégration MCP pour la slash commande /smart-review
 */

import { testSlashCommand } from './test-slash-command.js';
import { logger } from './src/utils/logger.js';

/**
 * MCP Tool: smart_review_workflow
 * Usage: /mcp archon smart_review_workflow phase="feature-complete" file="src/auth.js"
 */
export async function smartReviewWorkflow({
  phase = 'feature-complete',
  file = null,
  scope = 'current-context',
  timeout = 120000 // 2 minutes max
}) {
  logger.info('🧠 MCP SMART REVIEW WORKFLOW');
  logger.info(`   Phase: ${phase}`);
  logger.info(`   File: ${file || 'auto-detect'}`);
  logger.info(`   Scope: ${scope}`);

  try {
    // Set timeout for the review
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Smart Review timeout')), timeout);
    });

    // Execute smart review with timeout
    const reviewPromise = testSlashCommand(phase, file);

    const result = await Promise.race([reviewPromise, timeoutPromise]);

    if (result.success) {
      return {
        success: true,
        mcp_tool: 'smart_review_workflow',
        phase: result.phase,
        file: result.file,
        mode: result.mode,
        duration_ms: result.duration,
        review_length: result.review_length,
        insights_count: result.insights_count,
        summary: `Smart Review ${phase} completed: ${result.insights_count} insights, ${result.review_length} chars`,
        message: '✅ Smart Review Phase 1 executed successfully!\n' +
                `📁 File: ${result.file}\n` +
                `⏱️ Duration: ${result.duration}ms\n` +
                `🧠 Mode: ${result.mode}\n` +
                `📊 Review: ${result.review_length} chars\n` +
                `💡 Insights: ${result.insights_count} generated\n` +
                '\n🎯 Next: Apply suggested improvements and validate with tests'
      };
    } else {
      return {
        success: false,
        mcp_tool: 'smart_review_workflow',
        phase,
        file: file || 'auto-detect',
        error: result.error,
        message: `❌ Smart Review ${phase} failed: ${result.error}\n` +
                '📋 Troubleshooting:\n' +
                '- Check file exists and is readable\n' +
                '- Ensure Gemini CLI available: gemini -p "test"\n' +
                `- Try manual execution: node test-slash-command.js ${phase}`
      };
    }

  } catch (error) {
    logger.error(`💥 MCP Smart Review error: ${error.message}`);

    return {
      success: false,
      mcp_tool: 'smart_review_workflow',
      phase,
      file: file || 'auto-detect',
      error: error.message,
      message: `💥 Smart Review MCP tool error: ${error.message}\n` +
              `🔧 Manual fallback: GEMINI_API_URL=http://127.0.0.1:7777 node test-slash-command.js ${phase}`
    };
  }
}

// CLI usage pour test direct
if (import.meta.url === `file://${process.argv[1]}`) {
  const phase = process.argv[2] || 'feature-complete';
  const file = process.argv[3] || null;

  smartReviewWorkflow({ phase, file })
    .then(result => {
      console.log('\n' + result.message + '\n');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('MCP Tool fatal error:', error);
      process.exit(1);
    });
}
