#!/usr/bin/env node

import { spawn } from 'child_process';
import { logger } from './src/utils/logger.js';

async function configureRealAgents() {
  logger.info('🔧 Configuring Real Agents for Orchestra...\n');
  
  const checks = [];
  
  // Check Gemini CLI
  logger.info('1. Checking Gemini CLI...');
  try {
    const gemini = await checkCommand('gemini', '--version');
    if (gemini.success) {
      logger.info('✅ Gemini CLI found:', gemini.output.split('\n')[0]);
      checks.push({ agent: 'gemini', status: 'available', version: gemini.output });
    } else {
      logger.warn('⚠️ Gemini CLI not found');
      logger.info('   Install: npm install -g @google-ai/gemini-cli');
      checks.push({ agent: 'gemini', status: 'missing', error: 'CLI not installed' });
    }
  } catch (error) {
    logger.warn('⚠️ Gemini check failed:', error.message);
    checks.push({ agent: 'gemini', status: 'error', error: error.message });
  }
  
  // Check Claude CLI
  logger.info('\n2. Checking Claude CLI...');
  try {
    const claude = await checkCommand('claude', '--version');
    if (claude.success) {
      logger.info('✅ Claude CLI found:', claude.output.split('\n')[0]);
      checks.push({ agent: 'claude', status: 'available', version: claude.output });
    } else {
      logger.warn('⚠️ Claude CLI not found');
      logger.info('   Install: Follow Claude Code installation instructions');
      checks.push({ agent: 'claude', status: 'missing', error: 'CLI not installed' });
    }
  } catch (error) {
    logger.warn('⚠️ Claude check failed:', error.message);
    checks.push({ agent: 'claude', status: 'error', error: error.message });
  }
  
  // Check Archon connection
  logger.info('\n3. Checking Archon connection...');
  try {
    const archonUrl = process.env.ARCHON_URL || 'http://localhost:8181';
    const archon = await fetch(`${archonUrl}/health`);
    if (archon.ok) {
      const data = await archon.json();
      logger.info(`✅ Archon connected: ${data.status}`);
      checks.push({ agent: 'archon', status: 'available', url: archonUrl });
    } else {
      logger.warn('⚠️ Archon not responding');
      checks.push({ agent: 'archon', status: 'unreachable', url: archonUrl });
    }
  } catch (error) {
    logger.warn('⚠️ Archon check failed:', error.message);
    checks.push({ agent: 'archon', status: 'error', error: error.message });
  }
  
  // Check API Keys
  logger.info('\n4. Checking API Keys...');
  const geminiKey = process.env.GEMINI_API_KEY;
  const claudeKey = process.env.ANTHROPIC_API_KEY;
  
  if (geminiKey) {
    logger.info('✅ GEMINI_API_KEY configured');
  } else {
    logger.warn('⚠️ GEMINI_API_KEY not set');
  }
  
  if (claudeKey) {
    logger.info('✅ ANTHROPIC_API_KEY configured');
  } else {
    logger.warn('⚠️ ANTHROPIC_API_KEY not set');
  }
  
  // Summary
  logger.info('\n' + '='.repeat(50));
  logger.info('📊 AGENT CONFIGURATION SUMMARY');
  logger.info('='.repeat(50));
  
  const available = checks.filter(c => c.status === 'available');
  const missing = checks.filter(c => c.status === 'missing');
  const errors = checks.filter(c => c.status === 'error' || c.status === 'unreachable');
  
  logger.info(`✅ Available agents: ${available.length}/3`);
  available.forEach(c => logger.info(`   - ${c.agent}: Ready`));
  
  if (missing.length > 0) {
    logger.info(`⚠️ Missing agents: ${missing.length}`);
    missing.forEach(c => logger.info(`   - ${c.agent}: ${c.error}`));
  }
  
  if (errors.length > 0) {
    logger.info(`❌ Error agents: ${errors.length}`);
    errors.forEach(c => logger.info(`   - ${c.agent}: ${c.error}`));
  }
  
  // Recommendations
  logger.info('\n📋 NEXT STEPS:');
  
  if (available.length === 3 && geminiKey && claudeKey) {
    logger.info('🎉 ALL AGENTS READY!');
    logger.info('You can now start Orchestra without mock mode:');
    logger.info('   node start-for-archon.js');
  } else {
    logger.info('🔧 Configuration needed:');
    
    if (!geminiKey) {
      logger.info('   1. Set GEMINI_API_KEY in .env file');
    }
    if (!claudeKey) {
      logger.info('   2. Set ANTHROPIC_API_KEY in .env file');
    }
    
    missing.forEach(c => {
      if (c.agent === 'gemini') {
        logger.info('   3. Install Gemini CLI: npm install -g @google-ai/gemini-cli');
      }
      if (c.agent === 'claude') {
        logger.info('   4. Install Claude CLI from claude.ai/code');
      }
    });
    
    logger.info('\n   Or continue with mock mode:');
    logger.info('   USE_MOCK_AGENTS=true node start-for-archon.js');
  }
}

async function checkCommand(command, ...args) {
  return new Promise((resolve) => {
    const process = spawn(command, args, {
      timeout: 5000,
      shell: true
    });
    
    let output = '';
    let error = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    process.on('close', (code) => {
      resolve({
        success: code === 0,
        output: output || error,
        code
      });
    });
    
    process.on('error', (err) => {
      resolve({
        success: false,
        output: err.message,
        code: -1
      });
    });
    
    setTimeout(() => {
      process.kill();
      resolve({
        success: false,
        output: 'Command timeout',
        code: -1
      });
    }, 5000);
  });
}

// Run configuration check
configureRealAgents().catch(error => {
  logger.error('Configuration failed:', error);
  process.exit(1);
});