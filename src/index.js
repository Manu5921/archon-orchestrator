#!/usr/bin/env node

import { startMCPServer } from './mcp/server.js';
import { OrchestratorCore } from './orchestrator/core.js';
import { logger } from './utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  logger.info('🏛️ Starting Triple-Agent Orchestra...');
  
  try {
    // Initialize the orchestrator core
    const orchestrator = new OrchestratorCore();
    await orchestrator.initialize();
    
    // Start MCP server for Archon integration
    const mcpPort = process.env.MCP_PORT || 3456;
    await startMCPServer(mcpPort, orchestrator);
    
    logger.info('✅ Orchestra ready! MCP server listening on port', mcpPort);
    logger.info('🎼 Agents: Archon + Gemini + Claude coordinated');
    
    // Keep process alive
    process.on('SIGINT', async () => {
      logger.info('🛑 Shutting down Orchestra...');
      await orchestrator.shutdown();
      process.exit(0);
    });
    
  } catch (error) {
    logger.error('Failed to start Orchestra:', error);
    process.exit(1);
  }
}

main();