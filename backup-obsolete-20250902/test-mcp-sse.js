#!/usr/bin/env node

import { ArchonMCPConnector } from './src/agents/archon-mcp-sse-connector.js';
import { logger } from './src/utils/logger.js';

async function testMCPSSE() {
  try {
    logger.info('🚀 TEST ARCHON MCP SSE CONNECTOR');
    logger.info('=' + '='.repeat(40));
    
    const connector = new ArchonMCPConnector();
    
    // Test 1: Health check
    logger.info('🔍 Testing health check...');
    const health = await connector.healthCheck();
    logger.info(`Health: ${health.healthy ? '✅' : '❌'} - ${health.message || health.error}`);
    
    if (!health.healthy) {
      logger.error('Health check failed, aborting tests');
      return false;
    }
    
    // Test 2: Connection
    logger.info('🔗 Testing connection...');
    await connector.connect();
    logger.info('✅ Connection established');
    
    // Test 3: Project management
    logger.info('📋 Testing project listing...');
    const projectResult = await connector.execute('test_list_projects', 'manage_project', [{ action: 'list' }]);
    logger.info(`Project listing: ${projectResult.success ? '✅' : '❌'}`);
    
    if (projectResult.success) {
      logger.info(`Projects found: ${JSON.stringify(projectResult, null, 2)}`);
    } else {
      logger.error(`Project error: ${projectResult.error}`);
    }
    
    // Test 4: RAG query (if available)
    logger.info('🔍 Testing RAG query...');
    const ragResult = await connector.execute('test_rag', 'perform_rag_query', [{ query: 'test query', match_count: 3 }]);
    logger.info(`RAG query: ${ragResult.success ? '✅' : '❌'}`);
    
    if (ragResult.success) {
      logger.info(`RAG results: ${JSON.stringify(ragResult, null, 2)}`);
    } else {
      logger.error(`RAG error: ${ragResult.error}`);
    }
    
    // Clean up
    await connector.close();
    logger.info('🔄 Connection closed');
    
    return true;
    
  } catch (error) {
    logger.error('💥 Test failed:', error);
    return false;
  }
}

// Execute test
testMCPSSE()
  .then(success => {
    if (success) {
      console.log('\\n🏆 MCP SSE TEST SUCCESS');
      process.exit(0);
    } else {
      console.log('\\n💥 MCP SSE TEST FAILED');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Critical error:', error);
    process.exit(1);
  });