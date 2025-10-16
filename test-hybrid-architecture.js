/**
 * TEST ARCHITECTURE HYBRIDE - Validateur Production-Ready
 * Tests l'architecture hybride recommandée par ChatGPT
 */

import { OrchestratorCore } from './src/orchestrator/core.js';
import { getCapabilities } from './src/agents/registry.js';
import { startGeminiBridge } from './src/agents/gemini-bridge.js';
import { logger } from './src/utils/logger.js';

async function testHybridArchitecture() {
  logger.info('🧪 Testing Hybrid Architecture Implementation...');

  const results = {
    agentRegistry: false,
    capabilitiesDetection: false,
    geminiBridge: false,
    orchestratorInit: false,
    workflowExecution: false
  };

  try {
    // Test 1: Agent Registry Detection
    logger.info('\n1️⃣ Testing Agent Registry...');

    const capabilities = await getCapabilities();
    logger.info('   Capabilities detected:', capabilities);

    if (capabilities.agents && typeof capabilities.agents.gemini === 'boolean') {
      results.agentRegistry = true;
      logger.info('✅ Agent Registry functional');
    }

    // Test 2: Gemini Bridge (if available)
    logger.info('\n2️⃣ Testing Gemini Bridge...');

    if (capabilities.agents.gemini && !process.env.GEMINI_API_URL) {
      try {
        const bridge = await startGeminiBridge();
        results.geminiBridge = true;
        logger.info(`✅ Gemini Bridge started: ${bridge.url}`);

        // Test bridge health
        const healthResponse = await fetch(`${bridge.url}/health`);
        if (healthResponse.ok) {
          const health = await healthResponse.json();
          logger.info(`   Bridge health: ${health.status}`);
        }
      } catch (bridgeError) {
        logger.warn(`   Bridge failed: ${bridgeError.message}`);
        results.geminiBridge = false;
      }
    } else if (capabilities.agents.gemini && process.env.GEMINI_API_URL) {
      results.geminiBridge = true;
      logger.info('✅ Gemini Bridge already configured');
    } else {
      results.geminiBridge = false; // Not available but not blocking
      logger.info('⏸️ Gemini not available - Bridge test skipped');
    }

    // Test 3: Orchestrator Initialization
    logger.info('\n3️⃣ Testing Orchestrator Hybrid Init...');

    const orchestrator = new OrchestratorCore();
    await orchestrator.initialize();

    if (orchestrator.capabilities && orchestrator.capabilities.agents) {
      results.orchestratorInit = true;
      logger.info('✅ Orchestrator hybrid initialization successful');
      logger.info('   Detected agents:', orchestrator.capabilities.agents);
      logger.info('   Configured agents:', orchestrator.capabilities.configured);

      // Test capabilities tool
      const capsTool = global.__orchestrator_capabilities;
      if (capsTool) {
        logger.info(`   Global capabilities available: ${!!capsTool.agents}`);
      }
    }

    // Test 4: Simple Workflow Execution
    logger.info('\n4️⃣ Testing Workflow with Hybrid Agents...');

    // Import workflow after orchestrator is initialized
    const { ProjectWorkflow } = await import('./src/workflow/project-workflow.js');
    const workflow = new ProjectWorkflow(orchestrator);

    // Test simple Archon interaction
    const archonResult = await workflow.phaseArchonSetup(
      'test_hybrid_arch',
      'Test hybrid architecture integration',
      ['detection', 'bridge', 'fallback']
    );

    if (archonResult.success || archonResult.projectId) {
      results.workflowExecution = true;
      logger.info('✅ Workflow execution with hybrid architecture functional');
      logger.info(`   Project ID: ${archonResult.projectId}`);
      logger.info(`   Success: ${archonResult.success}`);
    }

    // Shutdown
    await orchestrator.shutdown();

  } catch (error) {
    logger.error(`❌ Hybrid architecture test error: ${error.message}`);
    logger.error(`Stack: ${error.stack}`);
  }

  // Résultats finaux
  logger.info('\n📊 HYBRID ARCHITECTURE TEST RESULTS:');
  logger.info(`   1️⃣ Agent Registry:        ${results.agentRegistry ? '✅ PASS' : '❌ FAIL'}`);
  logger.info(`   2️⃣ Gemini Bridge:        ${results.geminiBridge ? '✅ PASS' : '⏸️ N/A'}`);
  logger.info(`   3️⃣ Orchestrator Init:    ${results.orchestratorInit ? '✅ PASS' : '❌ FAIL'}`);
  logger.info(`   4️⃣ Workflow Execution:   ${results.workflowExecution ? '✅ PASS' : '❌ FAIL'}`);

  const totalPassed = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;

  logger.info(`\n🎯 OVERALL: ${totalPassed}/${totalTests} tests passed`);

  if (totalPassed === totalTests) {
    logger.info('🚀 HYBRID ARCHITECTURE FULLY OPERATIONAL!');
  } else if (totalPassed >= 3) {
    logger.info('✅ HYBRID ARCHITECTURE FUNCTIONAL - Minor issues remain');
  } else {
    logger.info('⚠️ HYBRID ARCHITECTURE NEEDS ATTENTION');
  }

  return results;
}

// Execute tests
testHybridArchitecture()
  .then(results => {
    process.exit(0);
  })
  .catch(error => {
    logger.error('Hybrid architecture test suite failed:', error);
    process.exit(1);
  });
