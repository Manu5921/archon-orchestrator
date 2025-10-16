#!/usr/bin/env node

import WebSocket from 'ws';
import { logger } from '../utils/logger.js';
import { startMCPServer } from '../mcp/server.js';
import { OrchestratorCore } from '../orchestrator/core.js';
import dotenv from 'dotenv';

dotenv.config();

async function testMCPServer() {
  logger.info('🧪 Testing MCP Server...\n');

  const port = 3457; // Test port
  let server;
  let orchestrator;
  let ws;

  try {
    // Start the orchestrator and MCP server
    orchestrator = new OrchestratorCore();
    await orchestrator.initialize();
    server = await startMCPServer(port, orchestrator);

    logger.info(`✅ MCP Server started on port ${port}`);

    // Connect as a client
    ws = new WebSocket(`ws://localhost:${port}`);

    await new Promise((resolve, reject) => {
      ws.on('open', resolve);
      ws.on('error', reject);
    });

    logger.info('✅ Connected to MCP server');

    // Test 1: List tools
    logger.info('\nTest 1: Listing available tools...');
    const toolsResponse = await sendAndReceive(ws, {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list',
      params: {}
    });

    if (toolsResponse.result && toolsResponse.result.tools) {
      logger.info(`✅ Found ${toolsResponse.result.tools.length} tools:`);
      toolsResponse.result.tools.forEach(tool => {
        logger.info(`   - ${tool.name}`);
      });
    } else {
      logger.error('❌ Failed to list tools');
    }

    // Test 2: Call route_task tool
    logger.info('\nTest 2: Calling route_task tool...');
    const routeResponse = await sendAndReceive(ws, {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'orchestra:route_task',
        arguments: {
          task_description: 'Debug the payment processing error',
          task_type: 'debugging',
          complexity: 'high'
        }
      }
    });

    if (routeResponse.result && routeResponse.result.success) {
      logger.info('✅ Task routed successfully');
      logger.info(`   Agent: ${routeResponse.result.routing_decision.primary_agent}`);
      logger.info(`   Task ID: ${routeResponse.result.task_id}`);
    } else {
      logger.error('❌ Route task failed');
    }

    // Test 3: Call performance_stats tool
    logger.info('\nTest 3: Getting performance stats...');
    const statsResponse = await sendAndReceive(ws, {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'orchestra:performance_stats',
        arguments: {
          agent: 'all',
          metric_type: 'all',
          time_range: '24h'
        }
      }
    });

    if (statsResponse.result && statsResponse.result.success) {
      logger.info('✅ Stats retrieved successfully');
    } else {
      logger.error('❌ Stats retrieval failed');
    }

    // Test 4: List resources
    logger.info('\nTest 4: Listing resources...');
    const resourcesResponse = await sendAndReceive(ws, {
      jsonrpc: '2.0',
      id: 4,
      method: 'resources/list',
      params: {}
    });

    if (resourcesResponse.result && resourcesResponse.result.resources) {
      logger.info(`✅ Found ${resourcesResponse.result.resources.length} resources`);
    } else {
      logger.error('❌ Failed to list resources');
    }

    logger.info('\n✅ All MCP server tests completed!');

  } catch (error) {
    logger.error('Test failed:', error);
  } finally {
    // Cleanup
    if (ws) ws.close();
    if (orchestrator) await orchestrator.shutdown();
    process.exit(0);
  }
}

function sendAndReceive(ws, message) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Response timeout'));
    }, 5000);

    const handler = (data) => {
      const response = JSON.parse(data.toString());
      if (response.id === message.id) {
        clearTimeout(timeout);
        ws.removeListener('message', handler);
        resolve(response);
      }
    };

    ws.on('message', handler);
    ws.send(JSON.stringify(message));
  });
}

// Run tests
testMCPServer();
