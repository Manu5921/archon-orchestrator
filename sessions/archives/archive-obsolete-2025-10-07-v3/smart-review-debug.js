#!/usr/bin/env node

// Debug script to show what files Smart Review will detect

import fs from 'fs/promises';
import { spawn } from 'child_process';

async function debugFileDetection(workingDir = process.cwd()) {
  console.log('🔍 SMART REVIEW FILE DETECTION DEBUG');
  console.log('═══════════════════════════════════════');
  console.log(`📁 Working directory: ${workingDir}`);
  console.log('');

  // Find recently modified files (last 10 minutes)
  console.log('🕒 Looking for files modified in last 10 minutes...');

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

    const recentFiles = output.trim().split('\n').filter(f => f && f.length > 1);

    if (recentFiles.length > 0) {
      console.log(`✅ Found ${recentFiles.length} recently modified files:`);
      recentFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
      });
      console.log('');

      // Show which file would be selected
      const priorities = ['.md', '.js', '.ts', '.tsx', '.jsx', '.py', '.json'];
      let selectedFile = null;

      for (const ext of priorities) {
        const match = recentFiles.find(f => f.endsWith(ext));
        if (match) {
          selectedFile = match;
          console.log(`🎯 Smart Review would select: ${match} (${ext} priority)`);
          break;
        }
      }

      if (!selectedFile) {
        selectedFile = recentFiles[0];
        console.log(`🎯 Smart Review would select: ${selectedFile} (first file)`);
      }

    } else {
      console.log('⚠️ No recently modified files found');
      console.log('');
      console.log('📁 Checking fallback files...');

      const fallbackFiles = [
        'src/services/review-service.js',
        'src/services/context-service.js',
        'src/agents/gemini-agent.js',
        'src/utils/logger.js',
        'README.md',
        'PHASE_4_ROADMAP_MULTI_AGENTS.md'
      ];

      for (const file of fallbackFiles) {
        try {
          await fs.access(file);
          console.log(`✅ Found fallback file: ${file}`);
          console.log(`🎯 Smart Review would select: ${file}`);
          break;
        } catch (e) {
          console.log(`❌ Fallback file not found: ${file}`);
        }
      }
    }

  } catch (error) {
    console.error(`❌ Error in file detection: ${error.message}`);
  }

  console.log('');
  console.log('💡 To review a specific file: /smart-review feature-complete your-file.md');
  console.log('💡 To review auto-detected file: /smart-review feature-complete');
}

// If called directly, run debug
if (process.argv[1] === import.meta.url.replace('file://', '')) {
  const workingDir = process.argv[2] || process.cwd();
  debugFileDetection(workingDir);
}

export { debugFileDetection };
