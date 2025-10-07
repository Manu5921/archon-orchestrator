#!/usr/bin/env node

import { startMCPServer } from './server.js';
import { logger } from '../utils/logger.js';
import { OrchestratorCore } from '../orchestrator/core.js';

async function main() {
  try {
    logger.info('Starting Archon MCP Server...');
    
    // Create orchestrator instance
    const orchestrator = new OrchestratorCore();
    await orchestrator.initialize();
    
    // Start MCP server on port 8051 (as defined in CLAUDE.md)
    const PORT = process.env.MCP_PORT || 8051;
    const server = await startMCPServer(PORT, orchestrator);
    
    logger.info(`🚀 Archon MCP Server running on port ${PORT}`);
    logger.info('WebSocket endpoint: ws://localhost:' + PORT);
    logger.info('Ready for Claude Code connections!');
    
    // Keep process alive
    process.on('SIGINT', () => {
      logger.info('Shutting down MCP server...');
      process.exit(0);
    });
    
  } catch (error) {
    logger.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

main();