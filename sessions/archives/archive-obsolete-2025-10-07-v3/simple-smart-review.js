#!/usr/bin/env node
/**
 * SIMPLE SMART REVIEW - Version simplifiée pour test
 * Usage directe du Smart Review Phase 1 existant
 */

import { smartReviewWithContext } from './src/services/review-service.js';
import { logger } from './src/utils/logger.js';

async function simpleSmartReview() {
  logger.info('🧠 SIMPLE SMART REVIEW TEST');
  logger.info('═══════════════════════════════════════════════');

  // Mock capabilities avec Gemini disponible
  const mockCapabilities = {
    agents: { gemini: true, claude: true, archon: true }
  };

  // Task de test simple
  const testTask = {
    title: 'Smart Review Command Test',
    requirements: 'Test de la slash commande /smart-review avec Smart Review Phase 1',
    architecture: 'Archon Orchestrator + Smart Review Engine'
  };

  // Test avec le test file existant du Smart Review Phase 1
  const testFile = './test-auth-service.js';

  logger.info(`🎯 Testing Smart Review with: ${testFile}`);
  logger.info(`📋 Task: ${testTask.title}`);

  try {
    const result = await smartReviewWithContext(mockCapabilities, testFile, testTask);

    if (result.ok) {
      logger.info(`\n${'='.repeat(60)}`);
      logger.info('🎉 SIMPLE SMART REVIEW SUCCESS!');
      logger.info(`   Phase: ${result.phase}`);
      logger.info(`   Used: ${result.used}`);
      logger.info(`   Duration: ${result.duration_ms}ms`);
      logger.info(`   Context Duration: ${result.context_duration_ms}ms`);
      logger.info(`   Review Duration: ${result.duration_ms - result.context_duration_ms}ms`);
      logger.info(`   Response Length: ${result.text.length} chars`);
      logger.info(`   Insights: ${result.insights?.length || 0} detected`);
      logger.info(`${'='.repeat(60)}`);

      // Afficher un extrait de la réponse
      const preview = result.text.slice(0, 500);
      logger.info('📖 Response Preview:');
      logger.info(`${preview}...`);

      return { success: true, result };

    } else {
      logger.error(`❌ Smart Review failed: ${result.error}`);
      return { success: false, error: result.error };
    }

  } catch (error) {
    logger.error(`💥 Simple Smart Review error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Execute
simpleSmartReview()
  .then(result => {
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
