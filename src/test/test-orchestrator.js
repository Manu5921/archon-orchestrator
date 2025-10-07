#!/usr/bin/env node

import { OrchestratorCore } from '../orchestrator/core.js';
import { logger } from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

async function testOrchestrator() {
  logger.info('🧪 Starting Orchestra Tests...\n');
  
  const orchestrator = new OrchestratorCore();
  let testsPassed = 0;
  let testsFailed = 0;
  
  try {
    // Test 1: Initialize orchestrator
    logger.info('Test 1: Initializing orchestrator...');
    await orchestrator.initialize();
    logger.info('✅ Orchestrator initialized successfully');
    testsPassed++;
    
    // Test 2: Route a debugging task
    logger.info('\nTest 2: Routing a debugging task...');
    const debugRoute = await orchestrator.routeTask({
      task_description: 'Fix the authentication bug in login.js',
      task_type: 'debugging',
      complexity: 'medium'
    });
    
    if (debugRoute.success) {
      logger.info(`✅ Task routed to ${debugRoute.routing_decision.primary_agent}`);
      logger.info(`   Confidence: ${debugRoute.routing_decision.confidence}%`);
      testsPassed++;
    } else {
      logger.error('❌ Routing failed');
      testsFailed++;
    }
    
    // Test 3: Route an exploration task
    logger.info('\nTest 3: Routing an exploration task...');
    const exploreRoute = await orchestrator.routeTask({
      task_description: 'Explore different ways to implement real-time chat',
      task_type: 'exploration',
      complexity: 'low'
    });
    
    if (exploreRoute.success) {
      logger.info(`✅ Task routed to ${exploreRoute.routing_decision.primary_agent}`);
      testsPassed++;
    } else {
      logger.error('❌ Routing failed');
      testsFailed++;
    }
    
    // Test 4: Route an architecture task
    logger.info('\nTest 4: Routing an architecture task...');
    const archRoute = await orchestrator.routeTask({
      task_description: 'Design the microservices architecture for the payment system',
      task_type: 'architecture',
      complexity: 'high'
    });
    
    if (archRoute.success) {
      logger.info(`✅ Task routed to ${archRoute.routing_decision.primary_agent}`);
      testsPassed++;
    } else {
      logger.error('❌ Routing failed');
      testsFailed++;
    }
    
    // Test 5: Get performance stats
    logger.info('\nTest 5: Getting performance stats...');
    const stats = await orchestrator.getPerformanceStats({
      agent: 'all',
      metric_type: 'all',
      time_range: '24h'
    });
    
    if (stats.success) {
      logger.info('✅ Performance stats retrieved');
      logger.info(`   Agents tracked: ${Object.keys(stats.stats.agents || {}).length}`);
      testsPassed++;
    } else {
      logger.error('❌ Failed to get stats');
      testsFailed++;
    }
    
    // Test 6: Pattern learning
    logger.info('\nTest 6: Testing pattern learning...');
    const learnResult = await orchestrator.learnPattern({
      task_type: 'debugging',
      agent_used: 'claude',
      success: true,
      duration_ms: 1500,
      complexity: 'medium',
      feedback: 'Task completed successfully'
    });
    
    if (learnResult.success) {
      logger.info('✅ Pattern learning successful');
      testsPassed++;
    } else {
      logger.error('❌ Pattern learning failed');
      testsFailed++;
    }
    
    // Test 7: Context synchronization
    logger.info('\nTest 7: Testing context synchronization...');
    const syncResult = await orchestrator.syncContext({
      agents: ['claude', 'gemini'],
      context_type: 'code',
      data: {
        file: 'test.js',
        changes: ['Added error handling', 'Optimized performance']
      }
    });
    
    if (syncResult.success) {
      logger.info(`✅ Context synced to ${syncResult.synced_agents} agents`);
      testsPassed++;
    } else {
      logger.error('❌ Context sync failed');
      testsFailed++;
    }
    
    // Test 8: Get available resources
    logger.info('\nTest 8: Getting available resources...');
    const resources = await orchestrator.getResources();
    
    if (resources && resources.length > 0) {
      logger.info(`✅ Found ${resources.length} resources`);
      resources.forEach(r => logger.info(`   - ${r.name}`));
      testsPassed++;
    } else {
      logger.error('❌ No resources found');
      testsFailed++;
    }
    
  } catch (error) {
    logger.error('Test error:', error);
    testsFailed++;
  } finally {
    // Cleanup
    await orchestrator.shutdown();
    
    // Summary
    logger.info('\n' + '='.repeat(50));
    logger.info('📊 TEST SUMMARY');
    logger.info('='.repeat(50));
    logger.info(`✅ Passed: ${testsPassed}`);
    logger.info(`❌ Failed: ${testsFailed}`);
    logger.info(`📈 Success Rate: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`);
    
    process.exit(testsFailed > 0 ? 1 : 0);
  }
}

// Run tests
testOrchestrator();