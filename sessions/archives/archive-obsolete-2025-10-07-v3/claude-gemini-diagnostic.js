#!/usr/bin/env node

/**
 * CLAUDE ↔ GEMINI COMMUNICATION DIAGNOSTIC
 * Tests complete communication pipeline between Claude and Gemini
 * Modes: Bridge API + CLI fallback
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import { geminiSend } from './src/agents/gemini-agent.js';
import { Logger } from './src/utils/logger.js';
import { setTimeout as wait } from 'node:timers/promises';

const logger = new Logger('Claude-Gemini-Diagnostic');

const execAsync = promisify(exec);

class ClaudeGeminiDiagnostic {
  constructor() {
    this.results = {
      environment: {},
      bridgeTest: null,
      cliTest: null,
      orchestratorTest: null,
      overall: null
    };
  }

  /**
   * STEP 1: Environment Detection
   */
  async checkEnvironment() {
    console.log('\n🔍 STEP 1: Environment Detection');
    console.log('═'.repeat(50));

    const env = {
      GEMINI_API_URL: process.env.GEMINI_API_URL || 'not_set',
      GEMINI_CLI_PATH: process.env.GEMINI_CLI_PATH || 'gemini',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'set' : 'not_set',
      PATH_includes_gemini: process.env.PATH.includes('gemini') ? 'likely' : 'unlikely'
    };

    this.results.environment = env;

    console.log(`📍 GEMINI_API_URL: ${env.GEMINI_API_URL}`);
    console.log(`📍 GEMINI_CLI_PATH: ${env.GEMINI_CLI_PATH}`);
    console.log(`🔐 GEMINI_API_KEY: ${env.GEMINI_API_KEY}`);
    console.log(`🛤️ PATH contains gemini: ${env.PATH_includes_gemini}`);

    // Check if Gemini CLI is accessible
    try {
      const { stdout } = await execAsync('which gemini', { timeout: 3000 });
      console.log(`✅ Gemini CLI found at: ${stdout.trim()}`);
      env.cli_accessible = stdout.trim();
    } catch (error) {
      console.log('❌ Gemini CLI not found in PATH');
      env.cli_accessible = 'not_found';
    }

    // Test Gemini CLI version
    try {
      const { stdout } = await execAsync('gemini --version', { timeout: 5000 });
      console.log(`✅ Gemini version: ${stdout.trim()}`);
      env.cli_version = stdout.trim();
    } catch (error) {
      console.log(`❌ Cannot get Gemini version: ${error.message}`);
      env.cli_version = 'unknown';
    }

    return env;
  }

  /**
   * STEP 2: Bridge API Test
   */
  async testBridgeMode() {
    console.log('\n🌉 STEP 2: Bridge API Test');
    console.log('═'.repeat(50));

    const BRIDGE = process.env.GEMINI_API_URL;

    if (!BRIDGE) {
      console.log('⏸️ Bridge not configured (GEMINI_API_URL not set)');
      this.results.bridgeTest = {
        success: false,
        reason: 'not_configured',
        recommendation: 'Set GEMINI_API_URL environment variable'
      };
      return this.results.bridgeTest;
    }

    console.log(`🔗 Testing Bridge at: ${BRIDGE}`);

    const testPrompt = 'Test connection: Reply with exactly "BRIDGE_WORKING" if you can see this message.';

    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 10_000);

      const response = await fetch(`${BRIDGE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: testPrompt }),
        signal: ctrl.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.log(`❌ Bridge HTTP error: ${response.status} ${response.statusText}`);
        this.results.bridgeTest = {
          success: false,
          reason: `http_${response.status}`,
          details: response.statusText
        };
        return this.results.bridgeTest;
      }

      const result = await response.json();

      if (result.ok && result.text) {
        console.log(`✅ Bridge response received: ${result.text.slice(0, 100)}...`);
        console.log('📊 Bridge mode: WORKING');

        this.results.bridgeTest = {
          success: true,
          response: result.text,
          mode: 'bridge',
          latency_ms: Date.now() - Date.now() // Will be calculated properly in real scenario
        };
      } else {
        console.log(`❌ Bridge returned error: ${result.error || 'unknown'}`);
        this.results.bridgeTest = {
          success: false,
          reason: 'bridge_error',
          error: result.error
        };
      }

    } catch (error) {
      console.log(`❌ Bridge connection failed: ${error.message}`);
      this.results.bridgeTest = {
        success: false,
        reason: 'connection_error',
        error: error.message,
        recommendation: 'Check if Bridge server is running at GEMINI_API_URL'
      };
    }

    return this.results.bridgeTest;
  }

  /**
   * STEP 3: CLI Mode Test
   */
  async testCliMode() {
    console.log('\n⌨️ STEP 3: CLI Mode Test');
    console.log('═'.repeat(50));

    const CLI_BIN = process.env.GEMINI_CLI_PATH || 'gemini';
    const testPrompt = 'CLI test: Reply with exactly "CLI_WORKING" if you can process this via command line.';

    console.log(`🖥️ Testing CLI: ${CLI_BIN}`);
    console.log(`📝 Test prompt: ${testPrompt.slice(0, 50)}...`);

    return new Promise((resolve) => {
      const startTime = Date.now();
      const args = ['-p', testPrompt];

      console.log(`🚀 Executing: ${CLI_BIN} ${args.join(' ')}`);

      const ps = spawn(CLI_BIN, args, {
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          // Fix PATH for macOS if needed
          PATH: process.platform === 'darwin' ?
            ['/opt/homebrew/bin', '/usr/local/bin', process.env.PATH || ''].join(':') :
            process.env.PATH
        }
      });

      let out = '';
      let err = '';

      ps.stdout.on('data', d => {
        const chunk = d.toString();
        out += chunk;
        console.log(`📤 CLI stdout: ${chunk.trim()}`);
      });

      ps.stderr.on('data', d => {
        const chunk = d.toString();
        err += chunk;
        console.log(`📥 CLI stderr: ${chunk.trim()}`);
      });

      ps.on('error', (error) => {
        const duration = Date.now() - startTime;
        console.log(`❌ CLI spawn error: ${error.message}`);

        this.results.cliTest = {
          success: false,
          reason: 'spawn_error',
          error: error.message,
          duration_ms: duration,
          recommendation: `Check if ${CLI_BIN} is installed and accessible`
        };

        resolve(this.results.cliTest);
      });

      ps.on('exit', (code) => {
        const duration = Date.now() - startTime;

        console.log(`🏁 CLI exit code: ${code}`);
        console.log(`⏱️ CLI duration: ${duration}ms`);

        if (code === 0 && out.trim()) {
          console.log(`✅ CLI response received: ${out.trim().slice(0, 100)}...`);
          console.log('📊 CLI mode: WORKING');

          this.results.cliTest = {
            success: true,
            response: out.trim(),
            mode: 'cli',
            exit_code: code,
            duration_ms: duration
          };
        } else {
          // Check for deterministic errors
          const deterministic = /invalid|unknown flag|not found|unauthorized|forbidden|missing api key|Quota/i.test(err);

          console.log(`❌ CLI failed - Code: ${code}, Deterministic: ${deterministic}`);

          this.results.cliTest = {
            success: false,
            reason: 'cli_execution_failed',
            exit_code: code,
            stderr: err.trim(),
            deterministic,
            duration_ms: duration,
            recommendation: deterministic ?
              'Check API key and authentication' :
              'Retry may help (temporary error)'
          };
        }

        resolve(this.results.cliTest);
      });

      // Timeout safety
      setTimeout(() => {
        ps.kill('SIGTERM');
        console.log('⏰ CLI test timed out after 30s');

        this.results.cliTest = {
          success: false,
          reason: 'timeout',
          duration_ms: 30000,
          recommendation: 'Check if Gemini CLI is hanging or slow'
        };

        resolve(this.results.cliTest);
      }, 30000);
    });
  }

  /**
   * STEP 4: Orchestrator Integration Test
   */
  async testOrchestratorMode() {
    console.log('\n🎼 STEP 4: Orchestrator Integration Test');
    console.log('═'.repeat(50));

    const orchestratorPrompt = `Claude Orchestrator Test: 

You are being tested by Claude (the orchestrator) to verify communication pipeline.
Please respond with:

1. Status: "ORCHESTRATOR_CONNECTION_SUCCESS"
2. Your capabilities summary
3. Your readiness for collaborative work

This is part of the Archon Orchestrator system testing.`;

    console.log('🎯 Testing via geminiSend() function (real integration)');
    console.log('📝 Using orchestrator-style prompt...');

    try {
      const startTime = Date.now();
      const result = await geminiSend(orchestratorPrompt);
      const duration = Date.now() - startTime;

      console.log(`⏱️ Integration duration: ${duration}ms`);
      console.log(`📊 Result success: ${result.ok}`);

      if (result.ok) {
        console.log('✅ Orchestrator integration: WORKING');
        console.log(`🔧 Mode used: ${result.meta?.mode || 'unknown'}`);
        console.log(`💬 Response preview: ${result.text.slice(0, 150)}...`);

        this.results.orchestratorTest = {
          success: true,
          mode: result.meta?.mode || 'unknown',
          response: result.text,
          duration_ms: duration,
          quality_check: {
            contains_success_marker: result.text.includes('ORCHESTRATOR_CONNECTION_SUCCESS'),
            has_capabilities: result.text.toLowerCase().includes('capabilit'),
            sufficient_length: result.text.length > 50
          }
        };
      } else {
        console.log(`❌ Orchestrator integration failed: ${result.error}`);
        console.log(`🔄 Retry flag: ${result.retry}`);

        this.results.orchestratorTest = {
          success: false,
          error: result.error,
          retry_suggested: result.retry,
          duration_ms: duration,
          recommendation: result.retry ?
            'Temporary error - retry may work' :
            'Check configuration and authentication'
        };
      }

    } catch (error) {
      console.log(`💥 Orchestrator test crashed: ${error.message}`);

      this.results.orchestratorTest = {
        success: false,
        reason: 'test_crash',
        error: error.message,
        recommendation: 'Check if gemini-agent module is properly configured'
      };
    }

    return this.results.orchestratorTest;
  }

  /**
   * STEP 5: Generate Diagnostic Report
   */
  generateReport() {
    console.log('\n📋 DIAGNOSTIC REPORT');
    console.log('═'.repeat(50));

    // Calculate overall success
    const tests = [
      this.results.bridgeTest?.success || false,
      this.results.cliTest?.success || false,
      this.results.orchestratorTest?.success || false
    ];

    const successCount = tests.filter(Boolean).length;
    const totalTests = tests.length;

    this.results.overall = {
      success_rate: `${successCount}/${totalTests}`,
      percentage: Math.round((successCount / totalTests) * 100),
      primary_mode: this.results.orchestratorTest?.mode || 'none',
      recommendation: this.generateRecommendation(successCount, totalTests)
    };

    console.log(`📊 SUCCESS RATE: ${this.results.overall.success_rate} (${this.results.overall.percentage}%)`);
    console.log(`🎯 PRIMARY MODE: ${this.results.overall.primary_mode}`);
    console.log(`💡 RECOMMENDATION: ${this.results.overall.recommendation}`);

    // Detailed breakdown
    console.log('\n📝 DETAILED BREAKDOWN:');
    console.log(`🌉 Bridge API: ${this.results.bridgeTest?.success ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`⌨️ CLI Mode: ${this.results.cliTest?.success ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`🎼 Orchestrator: ${this.results.orchestratorTest?.success ? '✅ WORKING' : '❌ FAILED'}`);

    return this.results;
  }

  generateRecommendation(successCount, totalTests) {
    if (successCount === totalTests) {
      return '🎉 Perfect! Claude ↔ Gemini communication is fully operational.';
    } else if (successCount > 0) {
      return '⚠️ Partial success. At least one mode is working - system can function with fallbacks.';
    } else {
      return '🚨 Critical: No communication modes working. Check environment and configuration.';
    }
  }

  /**
   * STEP 6: Save Results
   */
  async saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `claude-gemini-diagnostic-${timestamp}.json`;

    try {
      await import('fs/promises').then(fs =>
        fs.writeFile(filename, JSON.stringify(this.results, null, 2))
      );
      console.log(`💾 Results saved to: ${filename}`);
    } catch (error) {
      console.log(`⚠️ Could not save results: ${error.message}`);
    }
  }
}

/**
 * MAIN EXECUTION
 */
async function runDiagnostic() {
  console.log('🚀 CLAUDE ↔ GEMINI COMMUNICATION DIAGNOSTIC');
  console.log('Testing complete pipeline for orchestration workflow');
  console.log('═'.repeat(60));

  const diagnostic = new ClaudeGeminiDiagnostic();

  try {
    // Run all tests
    await diagnostic.checkEnvironment();
    await diagnostic.testBridgeMode();
    await diagnostic.testCliMode();
    await diagnostic.testOrchestratorMode();

    // Generate report
    const results = diagnostic.generateReport();
    await diagnostic.saveResults();

    // Exit with appropriate code
    const success = results.overall.percentage > 0;
    console.log(`\n${success ? '🎉' : '😞'} Diagnostic ${success ? 'completed successfully' : 'found issues'}`);

    process.exit(success ? 0 : 1);

  } catch (error) {
    console.error('💥 Diagnostic crashed:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDiagnostic().catch(console.error);
}

export { ClaudeGeminiDiagnostic };
