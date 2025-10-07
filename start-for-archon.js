#!/usr/bin/env node

import { OrchestratorCore } from './src/orchestrator/core.js';
import { startMCPServer } from './src/mcp/server.js';
import { HTTPtoWSAdapter } from './src/http-adapter.js';
import { logger } from './src/utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

async function startForArchon() {
  logger.info('🏛️ Starting Orchestra for Archon Integration...\n');
  
  try {
    // 1. Start Orchestra Core with WebSocket MCP Server
    logger.info('Step 1: Starting Orchestra Core...');
    const orchestrator = new OrchestratorCore();
    await orchestrator.initialize();
    
    const wsPort = process.env.MCP_PORT || 3456;
    await startMCPServer(wsPort, orchestrator);
    logger.info(`✅ Orchestra WebSocket MCP Server ready on port ${wsPort}`);
    
    // 2. Start HTTP-to-WebSocket adapter for Archon
    logger.info('\nStep 2: Starting HTTP adapter for Archon...');
    const httpPort = process.env.HTTP_ADAPTER_PORT || 8053;
    const adapter = new HTTPtoWSAdapter(httpPort, wsPort);
    await adapter.start();
    logger.info(`✅ HTTP adapter ready on port ${httpPort}`);
    
    // 3. Display connection info
    logger.info('\n' + '='.repeat(60));
    logger.info('🎉 ORCHESTRA READY FOR ARCHON');
    logger.info('='.repeat(60));
    logger.info(`WebSocket MCP Server: ws://localhost:${wsPort}`);
    logger.info(`HTTP Adapter for Archon: http://localhost:${httpPort}/mcp`);
    logger.info('\n📋 ARCHON CONFIGURATION:');
    logger.info('Add this to Archon\'s MCP client configuration:');
    logger.info(JSON.stringify({
      name: "Orchestra",
      transport_type: "http",
      connection_config: {
        url: `http://localhost:${httpPort}/mcp`
      },
      auto_connect: true,
      is_default: false
    }, null, 2));
    
    logger.info('\n🧪 Test Commands:');
    logger.info(`curl http://localhost:${httpPort}/health`);
    logger.info(`curl http://localhost:${httpPort}/tools`);
    
    logger.info('\n🎼 Available Orchestra Tools:');
    logger.info('• orchestra:route_task - Intelligent task routing');
    logger.info('• orchestra:agent_handoff - Transfer tasks between agents');
    logger.info('• orchestra:sync_context - Synchronize context');
    logger.info('• orchestra:performance_stats - Performance metrics');
    logger.info('• orchestra:pattern_learning - ML-based learning');
    
    // 4. Handle graceful shutdown
    const shutdown = async () => {
      logger.info('\n🛑 Shutting down Orchestra...');
      adapter.stop();
      await orchestrator.shutdown();
      process.exit(0);
    };
    
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    
    // Keep alive
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception:', error);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled rejection at:', promise, 'reason:', reason);
    });
    
  } catch (error) {
    logger.error('Failed to start Orchestra for Archon:', error);
    process.exit(1);
  }
}

// Start the integrated system
startForArchon();