#!/usr/bin/env node
/**
 * SMART REVIEW SLASH COMMAND
 * Implémentation de /smart-review pour Claude Code
 * Usage: /smart-review phase="feature-complete" files="src/**" scope="critical-path"
 */

import { smartReviewWithContext } from './src/services/review-service.js';
import { logger } from './src/utils/logger.js';
import fs from 'fs/promises';
import globPkg from 'glob';
const { glob } = globPkg;

/**
 * Parse les arguments de la slash commande
 */
function parseSmartReviewArgs(args) {
  const parsed = {
    phase: 'general',
    files: null,
    scope: 'current-context',
    mode: 'auto' // auto, bridge, cli
  };

  // Parse les arguments key=value
  if (args && args.length > 0) {
    args.forEach(arg => {
      const [key, value] = arg.split('=');
      if (key && value) {
        parsed[key] = value.replace(/"/g, ''); // Remove quotes
      }
    });
  }

  return parsed;
}

/**
 * Détecte les fichiers à reviewer selon le contexte
 */
async function detectFilesToReview(filesPattern, scope) {
  if (filesPattern) {
    // Pattern explicite fourni
    try {
      const files = await glob(filesPattern, {
        ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**']
      });
      return files.slice(0, 5); // Max 5 files pour éviter overload
    } catch (error) {
      logger.warn(`⚠️ Pattern files invalide: ${filesPattern}, fallback détection auto`);
    }
  }

  // Détection automatique selon scope
  const autoDetectionPatterns = {
    'critical-path': ['src/**/*.{js,ts,jsx,tsx}', 'pages/**/*.{js,ts,jsx,tsx}'],
    'auth': ['src/**/auth/**/*.{js,ts}', 'pages/api/auth/**/*.{js,ts}'],
    'api': ['pages/api/**/*.{js,ts}', 'src/api/**/*.{js,ts}'],
    'components': ['src/components/**/*.{js,ts,jsx,tsx}'],
    'current-context': ['**/*.{js,ts,jsx,tsx}'] // Fallback général
  };

  const pattern = autoDetectionPatterns[scope] || autoDetectionPatterns['current-context'];

  try {
    const allFiles = [];
    for (const pat of pattern) {
      const files = await glob(pat, {
        ignore: ['node_modules/**', '.git/**', 'dist/**', 'build/**'],
        maxDepth: 3 // Limiter profondeur recherche
      });
      allFiles.push(...files);
    }

    // Retourner max 3 fichiers les plus récents
    const stats = await Promise.all(
      allFiles.map(async file => ({
        file,
        mtime: (await fs.stat(file)).mtime
      }))
    );

    return stats
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, 3)
      .map(s => s.file);

  } catch (error) {
    logger.warn(`⚠️ Auto-détection échouée: ${error.message}`);
    return [];
  }
}

/**
 * Build le contexte de task selon la phase
 */
function buildTaskContext(phase, files, scope) {
  const phaseContexts = {
    'feature-complete': {
      title: 'Feature Completion Review',
      requirements: 'Validate feature completeness, test coverage, and production readiness',
      architecture: 'Ensure consistency with project architecture and best practices'
    },
    'pre-commit': {
      title: 'Pre-Commit Code Review',
      requirements: 'Code quality, security vulnerabilities, and performance issues',
      architecture: 'Compliance with coding standards and architectural patterns'
    },
    'production-ready': {
      title: 'Production Readiness Assessment',
      requirements: 'Security, performance, scalability, error handling, monitoring',
      architecture: 'Production-grade patterns, logging, metrics, and observability'
    },
    'refactor-done': {
      title: 'Refactoring Quality Review',
      requirements: 'Code maintainability, pattern consistency, technical debt reduction',
      architecture: 'Improved architecture patterns and code organization'
    },
    'security-audit': {
      title: 'Security Code Audit',
      requirements: 'Security vulnerabilities, authentication, authorization, data validation',
      architecture: 'Security patterns, input sanitization, secure communication'
    }
  };

  const context = phaseContexts[phase] || {
    title: 'General Code Review',
    requirements: 'Code quality, best practices, and maintainability',
    architecture: 'Consistent patterns and clean architecture'
  };

  // Enrichir avec contexte files/scope
  if (files && files.length > 0) {
    context.title += ` (${files.length} files)`;
    context.files_context = files.join(', ');
  }

  if (scope && scope !== 'current-context') {
    context.scope_focus = scope;
    context.requirements += `, focused on ${scope} concerns`;
  }

  return context;
}

/**
 * Exécute Smart Review pour un fichier
 */
async function executeSmartReviewForFile(filePath, taskContext, mockCapabilities) {
  logger.info(`🧠 Smart Review for: ${filePath}`);

  try {
    const result = await smartReviewWithContext(mockCapabilities, filePath, taskContext);

    if (result.ok) {
      logger.info(`✅ Smart Review completed for ${filePath}`);
      logger.info(`   Duration: ${result.duration_ms}ms (context: ${result.context_duration_ms}ms)`);
      logger.info(`   Complexity: ${result.complexity_score}/10`);
      logger.info(`   Insights: ${result.insights?.length || 0} detected`);

      return {
        file: filePath,
        success: true,
        result: result
      };
    } else {
      logger.error(`❌ Smart Review failed for ${filePath}: ${result.error}`);
      return {
        file: filePath,
        success: false,
        error: result.error
      };
    }
  } catch (error) {
    logger.error(`💥 Smart Review error for ${filePath}: ${error.message}`);
    return {
      file: filePath,
      success: false,
      error: error.message
    };
  }
}

/**
 * Slash commande principale /smart-review
 */
async function smartReviewCommand(args = []) {
  const startTime = Date.now();
  logger.info('🧠 SMART REVIEW SLASH COMMAND');
  logger.info('════════════════════════════════════════════════');

  // Parse arguments
  const params = parseSmartReviewArgs(args);
  logger.info('📋 Parameters parsed:');
  logger.info(`   Phase: ${params.phase}`);
  logger.info(`   Files: ${params.files || 'auto-detect'}`);
  logger.info(`   Scope: ${params.scope}`);
  logger.info(`   Mode: ${params.mode}`);

  // Mock capabilities (Gemini disponible)
  const mockCapabilities = {
    agents: { gemini: true, claude: true, archon: true }
  };

  try {
    // 1. Détection fichiers à reviewer
    logger.info('🔍 Detecting files to review...');
    const filesToReview = await detectFilesToReview(params.files, params.scope);

    if (filesToReview.length === 0) {
      logger.warn(`⚠️ No files detected for review with scope: ${params.scope}`);
      return {
        success: false,
        error: 'no_files_detected',
        message: `No files found for scope '${params.scope}'. Try specifying files= parameter.`
      };
    }

    logger.info(`📁 Files detected for review: ${filesToReview.length}`);
    filesToReview.forEach(file => logger.info(`   - ${file}`));

    // 2. Build task context
    const taskContext = buildTaskContext(params.phase, filesToReview, params.scope);
    logger.info(`🎯 Task context: ${taskContext.title}`);

    // 3. Exécuter Smart Review pour chaque fichier
    const results = [];

    for (const filePath of filesToReview) {
      const fileResult = await executeSmartReviewForFile(filePath, taskContext, mockCapabilities);
      results.push(fileResult);

      // Petit délai entre fichiers pour éviter rate limiting
      if (filesToReview.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // 4. Consolidation des résultats
    const successCount = results.filter(r => r.success).length;
    const totalDuration = Date.now() - startTime;

    logger.info(`\n${'='.repeat(60)}`);
    logger.info('🎉 SMART REVIEW SLASH COMMAND COMPLETED');
    logger.info(`   Phase: ${params.phase}`);
    logger.info(`   Files processed: ${results.length}`);
    logger.info(`   Successful reviews: ${successCount}/${results.length}`);
    logger.info(`   Total duration: ${totalDuration}ms`);

    // Afficher résumé pour chaque fichier
    results.forEach(result => {
      if (result.success) {
        logger.info(`✅ ${result.file}:`);
        logger.info(`   Complexity: ${result.result.complexity_score}/10`);
        logger.info(`   Review length: ${result.result.text?.length || 0} chars`);

        // Afficher preview des insights les plus importants
        if (result.result.insights?.length > 0) {
          logger.info(`   Key insights: ${result.result.insights.slice(0, 2).join(', ')}`);
        }
      } else {
        logger.error(`❌ ${result.file}: ${result.error}`);
      }
    });

    logger.info(`${'='.repeat(60)}\n`);

    return {
      success: successCount > 0,
      phase: params.phase,
      files_processed: results.length,
      successful_reviews: successCount,
      total_duration_ms: totalDuration,
      results: results,
      summary: `Smart Review ${params.phase}: ${successCount}/${results.length} files successfully reviewed`
    };

  } catch (error) {
    logger.error(`💥 Smart Review Command failed: ${error.message}`);
    logger.error(`   Stack: ${error.stack}`);

    return {
      success: false,
      error: error.message,
      phase: params.phase,
      total_duration_ms: Date.now() - startTime
    };
  }
}

// Export pour usage comme module
export { smartReviewCommand };

// CLI usage si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  smartReviewCommand(args)
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
