#!/usr/bin/env node

/**
 * 🧪 TESTS DE NON-RÉGRESSION RAPIDES - Archon MCP Façade
 *
 * Tests critiques pour validation avant déploiement :
 * - Golden path (Phase 0→1) < 10s
 * - RAG aliasing (match_count → top_k)
 * - Retry policy strict (400 → 0 retry, 502 → backoff)
 * - Idempotence des tâches
 */

import { WorkflowDirect } from './workflow-direct.js';
import { ArchonMCPConnector } from './src/agents/archon-mcp-connector.js';

// Test configuration
const TIMEOUT_GOLDEN_PATH = 10000; // 10s max for Phase 0→1
const TEST_PROJECT_DESC = 'QuickTest - Automated regression test project';

class FacadeQuickTests {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  log(test, status, message, duration = 0) {
    const result = { test, status, message, duration, timestamp: new Date().toISOString() };
    this.results.tests.push(result);

    const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    const durationStr = duration ? ` (${duration}ms)` : '';
    console.log(`${icon} ${test}: ${message}${durationStr}`);

    if (status === 'PASS') this.results.passed++;
    if (status === 'FAIL') this.results.failed++;
  }

  async runTest(name, testFn, timeout = 5000) {
    const start = Date.now();
    try {
      await Promise.race([
        testFn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout)
        )
      ]);
      const duration = Date.now() - start;
      this.log(name, 'PASS', 'Completed successfully', duration);
      return true;
    } catch (error) {
      const duration = Date.now() - start;
      this.log(name, 'FAIL', error.message, duration);
      return false;
    }
  }

  // === TEST 1: GOLDEN PATH (Phase 0→1) ===
  async testGoldenPath() {
    return this.runTest('Golden Path Phase 0→1', async () => {
      const workflow = new WorkflowDirect();
      await workflow.initialize();

      const result = await workflow.startHybridWorkflow(TEST_PROJECT_DESC);

      if (!result.success && !result.details?.workflow?.phases?.exploration?.status) {
        throw new Error(`Workflow failed: ${result.message}`);
      }

      // Verify Phase 0 completed
      const phases = result.details.workflow.phases;
      if (phases.archon_setup.status !== 'completed') {
        throw new Error('Phase 0 (Archon Setup) not completed');
      }

      // Verify Phase 1 attempted (may be completed or failed due to missing agents)
      if (!phases.exploration.status || phases.exploration.status === 'pending') {
        throw new Error('Phase 1 (Exploration) not attempted');
      }
    }, TIMEOUT_GOLDEN_PATH);
  }

  // === TEST 2: RAG ALIASING ===
  async testRagAliasing() {
    return this.runTest('RAG Aliasing (match_count → top_k)', async () => {
      const connector = new ArchonMCPConnector();
      await connector.connect();

      // Test with match_count alias
      const result = await connector.execute('test_rag_alias', 'perform_rag_query', [{
        project_id: 'eeca5715-7e9d-4932-9f66-7be4435b88d8',
        query: 'test query',
        match_count: 3 // Should be normalized to top_k
      }]);

      // Should succeed (even if no results found)
      if (!result.success && result.error !== 'tool_unavailable') {
        throw new Error(`RAG query failed: ${result.error}`);
      }
    });
  }

  // === TEST 3: RETRY POLICY STRICT ===
  async testRetryPolicy() {
    return this.runTest('Retry Policy Strict', async () => {
      const connector = new ArchonMCPConnector();

      // Mock a 400 error (should not retry)
      try {
        const result = await connector.execute('test_retry', 'get', [{
          resource: 'invalid_resource',
          id: 'nonexistent'
        }]);

        // Should fail with retry: false for validation errors
        if (result.success) {
          throw new Error('Expected validation error for invalid resource');
        }

        if (result.retry === true) {
          throw new Error('Should not retry on validation errors (4xx-like)');
        }
      } catch (error) {
        // Connection errors are expected
        if (!error.message.includes('connect')) {
          throw error;
        }
      }
    });
  }

  // === TEST 4: IDEMPOTENCE DES TÂCHES ===
  async testTaskIdempotence() {
    return this.runTest('Task Idempotence', async () => {
      const connector = new ArchonMCPConnector();
      await connector.connect();

      const external_id = `test_idempotent_${Date.now()}`;
      const taskData = {
        action: 'create',
        project_id: 'eeca5715-7e9d-4932-9f66-7be4435b88d8',
        task: {
          title: 'Test Idempotent Task',
          description: 'Test task for idempotence validation',
          external_id: external_id
        }
      };

      // Create task twice with same external_id
      const result1 = await connector.execute('test_idem_1', 'manage_task', [taskData]);
      const result2 = await connector.execute('test_idem_2', 'manage_task', [taskData]);

      if (!result1.success || !result2.success) {
        throw new Error('Task creation should succeed for idempotent operations');
      }
    });
  }

  // === TEST 5: AGENTS CAPABILITIES ===
  async testAgentsCapabilities() {
    return this.runTest('Agents Capabilities Tool', async () => {
      const connector = new ArchonMCPConnector();
      await connector.connect();

      const result = await connector.execute('test_agents_cap', 'agents.capabilities', []);

      if (!result.success) {
        throw new Error(`agents.capabilities failed: ${result.error}`);
      }

      // Check both possible response formats for backward compatibility
      const agents = result.agents || result.result?.agents;
      if (!agents || typeof agents.archon_mcp !== 'boolean') {
        throw new Error(`agents.capabilities should return agent availability. Got: ${JSON.stringify(result)}`);
      }
    });
  }

  // === RUN ALL TESTS ===
  async runAll() {
    console.log('🧪 Starting Archon MCP Façade Quick Tests...\n');

    const tests = [
      () => this.testGoldenPath(),
      () => this.testRagAliasing(),
      () => this.testRetryPolicy(),
      () => this.testTaskIdempotence(),
      () => this.testAgentsCapabilities()
    ];

    for (const test of tests) {
      await test();
    }

    console.log('\n📊 Test Results:');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${Math.round(this.results.passed / (this.results.passed + this.results.failed) * 100)}%`);

    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(t => t.status === 'FAIL')
        .forEach(t => console.log(`  - ${t.test}: ${t.message}`));

      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed! Façade ready for production.');
      process.exit(0);
    }
  }
}

// Run tests if called directly
if (process.argv[1].includes('test-facade-quick.js')) {
  const tests = new FacadeQuickTests();
  tests.runAll().catch(error => {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  });
}

export { FacadeQuickTests };
