#!/usr/bin/env node
/**
 * TEST SLASH COMMAND - Version qui fonctionne
 * Utilise le Smart Review Phase 1 existant qui fonctionne déjà
 */

import { smartReviewWithContext } from './src/services/review-service.js';
import { logger } from './src/utils/logger.js';
import fs from 'fs/promises';

async function testSlashCommand(phase = "feature-complete", targetFile = null) {
  logger.info('🧠 SMART REVIEW SLASH COMMAND TEST');
  logger.info('═══════════════════════════════════════════════════');
  
  // Smart file detection
  let testFile = targetFile;
  if (!testFile) {
    try {
      // First, look for recently modified files (last 10 minutes)
      const { spawn } = await import('child_process');
      const { promisify } = await import('util');
      const execFile = promisify(spawn);
      
      // Get current working directory from environment or use current
      const workingDir = process.env.CURRENT_DIR || process.cwd();
      logger.info(`🔍 Auto-detecting files in: ${workingDir}`);
      
      // Find recently modified files (last 10 minutes, any extension)
      const recentFiles = [];
      try {
        const findProcess = spawn('find', [
          workingDir, 
          '-type', 'f',
          '-newermt', '10 minutes ago',
          '-not', '-path', '*/node_modules/*',
          '-not', '-path', '*/.git/*',
          '-not', '-name', '.*'
        ]);
        
        let output = '';
        findProcess.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        await new Promise((resolve) => {
          findProcess.on('close', resolve);
        });
        
        const files = output.trim().split('\n').filter(f => f && f.length > 1);
        recentFiles.push(...files);
        
        logger.info(`🕒 Found ${recentFiles.length} recently modified files`);
        
        if (recentFiles.length > 0) {
          // Prefer certain file types for review
          const priorities = ['.md', '.js', '.ts', '.tsx', '.jsx', '.py', '.json'];
          
          for (const ext of priorities) {
            const match = recentFiles.find(f => f.endsWith(ext));
            if (match) {
              testFile = match;
              logger.info(`✅ Auto-selected recent file: ${match}`);
              break;
            }
          }
          
          if (!testFile) {
            testFile = recentFiles[0]; // Take first recent file
            logger.info(`✅ Auto-selected: ${testFile}`);
          }
        }
        
      } catch (findError) {
        logger.warn(`⚠️ Find command failed: ${findError.message}`);
      }
      
      // Fallback: look for existing source files
      if (!testFile) {
        const srcFiles = [
          'src/services/review-service.js',
          'src/services/context-service.js', 
          'src/agents/gemini-agent.js',
          'src/utils/logger.js',
          'README.md',
          'PHASE_4_ROADMAP_MULTI_AGENTS.md'
        ];
        
        for (const file of srcFiles) {
          try {
            await fs.access(file);
            testFile = file;
            logger.info(`📁 Fallback selected: ${file}`);
            break;
          } catch (e) {
            // File doesn't exist, try next
          }
        }
      }
      
      if (!testFile) {
        logger.error('❌ No suitable files found for review');
        return { success: false, error: 'no_reviewable_files' };
      }
      
    } catch (error) {
      logger.error(`❌ Error in file detection: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
  
  logger.info(`🎯 Phase: ${phase}`);
  logger.info(`📁 Target file: ${testFile}`);
  
  // Mock capabilities
  const mockCapabilities = {
    agents: { gemini: true, claude: true, archon: true }
  };
  
  // Task context based on phase
  const phaseContexts = {
    "feature-complete": {
      title: "Feature Completion Review",
      requirements: "Feature completeness, test coverage, production readiness",
      architecture: "Next.js + TypeScript + Best Practices"
    },
    "pre-commit": {
      title: "Pre-Commit Review",
      requirements: "Code quality, security, performance",
      architecture: "Clean code standards and security patterns"
    },
    "production-ready": {
      title: "Production Readiness",
      requirements: "Security, scalability, monitoring, error handling",
      architecture: "Production-grade patterns and observability"
    }
  };
  
  const taskContext = phaseContexts[phase] || phaseContexts["feature-complete"];
  
  try {
    logger.info(`🚀 Executing Smart Review Phase 1...`);
    const startTime = Date.now();
    
    const result = await smartReviewWithContext(mockCapabilities, testFile, taskContext);
    
    const totalDuration = Date.now() - startTime;
    
    if (result.ok) {
      logger.info(`\n${'='.repeat(70)}`);
      logger.info(`🎉 SLASH COMMAND /smart-review SUCCESSFUL!`);
      logger.info(`   Phase: ${phase}`);
      logger.info(`   File: ${testFile}`);
      logger.info(`   Smart Review Phase: ${result.phase}`);
      logger.info(`   Mode Used: ${result.used}`);
      logger.info(`   Total Duration: ${totalDuration}ms`);
      logger.info(`   Context Duration: ${result.context_duration_ms || 0}ms`);
      logger.info(`   Review Duration: ${result.duration_ms}ms`);
      logger.info(`   Response Length: ${result.text?.length || 0} chars`);
      logger.info(`   Insights Generated: ${result.insights?.length || 0}`);
      
      if (result.complexity_score) {
        logger.info(`   Complexity Score: ${result.complexity_score}/10`);
      }
      
      logger.info(`${'='.repeat(70)}\n`);
      
      // Show preview of the review
      if (result.text) {
        const preview = result.text.slice(0, 800);
        logger.info(`📖 Smart Review Preview:`);
        logger.info(`${'─'.repeat(50)}`);
        logger.info(`${preview}${result.text.length > 800 ? '...' : ''}`);
        logger.info(`${'─'.repeat(50)}\n`);
      }
      
      // Show insights if available
      if (result.insights && result.insights.length > 0) {
        logger.info(`💡 Key Insights Generated:`);
        result.insights.forEach((insight, i) => {
          logger.info(`   ${i + 1}. ${insight}`);
        });
        logger.info('');
      }
      
      return { 
        success: true, 
        phase,
        file: testFile,
        duration: totalDuration,
        review_length: result.text?.length || 0,
        insights_count: result.insights?.length || 0,
        mode: result.used
      };
      
    } else {
      logger.error(`❌ Smart Review failed: ${result.error || 'unknown error'}`);
      logger.error(`   Code: ${result.code || 'unknown'}`);
      return { 
        success: false, 
        error: result.error,
        code: result.code,
        phase,
        file: testFile
      };
    }
    
  } catch (error) {
    logger.error(`💥 Slash command test error: ${error.message}`);
    return { 
      success: false, 
      error: error.message,
      phase,
      file: testFile
    };
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const phase = process.argv[2] || "feature-complete";
  const file = process.argv[3] || null;
  
  testSlashCommand(phase, file)
    .then(result => {
      if (result.success) {
        console.log(`\n✅ /smart-review ${phase} completed successfully!`);
        console.log(`   File: ${result.file}`);
        console.log(`   Mode: ${result.mode}`);
        console.log(`   Duration: ${result.duration}ms`);
        console.log(`   Review Length: ${result.review_length} chars`);
        console.log(`   Insights: ${result.insights_count}\n`);
      } else {
        console.log(`\n❌ /smart-review ${phase} failed: ${result.error}\n`);
      }
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { testSlashCommand };