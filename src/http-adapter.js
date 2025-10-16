#!/usr/bin/env node

import express from 'express';
import WebSocket from 'ws';
import { logger } from './utils/logger.js';
// import { v4 as uuidv4 } // Unused from 'uuid';

/**
 * HTTP to WebSocket adapter for Orchestra MCP Server
 * Converts Archon's HTTP MCP calls to Orchestra's WebSocket MCP protocol
 */
export class HTTPtoWSAdapter {
  constructor(httpPort = 8053, wsPort = 3456) {
    this.httpPort = httpPort;
    this.wsPort = wsPort;
    this.app = express();
    this.wsConnections = new Map();

    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.text({ type: 'text/plain' }));

    // CORS for Archon frontend
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID, X-Service-Auth');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
      }
      next();
    });

    // Request logging
    this.app.use((req, res, next) => {
      logger.debug(`HTTP Adapter: ${req.method} ${req.path}`, {
        headers: req.headers,
        body: req.body
      });
      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        service: 'orchestra-http-adapter',
        timestamp: new Date().toISOString(),
        websocket_port: this.wsPort
      });
    });

    // MCP Streamable HTTP endpoint for Archon
    this.app.post('/mcp', async (req, res) => {
      try {
        // Parse the streamable HTTP body
        const message = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

        logger.info('HTTP->WS: Received MCP message', message);

        // Forward to WebSocket and get response
        const response = await this.forwardToWebSocket(message);

        // Return as Streamable HTTP response
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response));

      } catch (error) {
        logger.error('HTTP Adapter error:', error);
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal error',
            data: error.message
          }
        });
      }
    });

    // List available tools (for Archon discovery)
    this.app.get('/tools', async (req, res) => {
      try {
        const response = await this.forwardToWebSocket({
          jsonrpc: '2.0',
          id: 'tools-list',
          method: 'tools/list',
          params: {}
        });

        if (response.result?.tools) {
          res.json({
            tools: response.result.tools.map(tool => ({
              name: tool.name,
              description: tool.description,
              schema: tool.inputSchema
            }))
          });
        } else {
          res.json({ tools: [] });
        }
      } catch (error) {
        logger.error('Tools list error:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Execute tool (for Archon tool calls)
    this.app.post('/tools/:toolName', async (req, res) => {
      try {
        const { toolName } = req.params;
        const args = req.body;

        const response = await this.forwardToWebSocket({
          jsonrpc: '2.0',
          id: `tool-${Date.now()}`,
          method: 'tools/call',
          params: {
            name: toolName,
            arguments: args
          }
        });

        res.json(response.result || response);
      } catch (error) {
        logger.error(`Tool execution error (${req.params.toolName}):`, error);
        res.status(500).json({ error: error.message });
      }
    });
  }

  async forwardToWebSocket(message) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`ws://localhost:${this.wsPort}`);
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('WebSocket timeout'));
      }, 30000);

      ws.on('open', () => {
        logger.debug('WebSocket connection opened for message forwarding');
        ws.send(JSON.stringify(message));
      });

      ws.on('message', (data) => {
        clearTimeout(timeout);
        try {
          const response = JSON.parse(data.toString());
          logger.debug('WS->HTTP: Received response', response);

          // Skip initialize messages, wait for actual response
          if (response.method === 'initialize') {
            return;
          }

          // Check if this is the response to our request
          if (response.id === message.id || response.result || response.error) {
            ws.close();
            resolve(response);
          }
        } catch (error) {
          clearTimeout(timeout);
          ws.close();
          reject(error);
        }
      });

      ws.on('error', (error) => {
        clearTimeout(timeout);
        logger.error('WebSocket forwarding error:', error);
        reject(error);
      });

      ws.on('close', () => {
        clearTimeout(timeout);
      });
    });
  }

  start() {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.httpPort, () => {
        logger.info(`🌉 HTTP-to-WebSocket adapter listening on port ${this.httpPort}`);
        logger.info(`📡 Forwarding to WebSocket on port ${this.wsPort}`);
        logger.info(`🔗 Archon can connect to http://localhost:${this.httpPort}/mcp`);
        resolve();
      });
    });
  }

  stop() {
    if (this.server) {
      this.server.close();
      logger.info('HTTP adapter stopped');
    }
  }
}

// Start adapter if run directly
if (process.argv[1].endsWith('http-adapter.js')) {
  const adapter = new HTTPtoWSAdapter();

  adapter.start().catch(error => {
    logger.error('Failed to start HTTP adapter:', error);
    process.exit(1);
  });

  process.on('SIGINT', () => {
    logger.info('Shutting down HTTP adapter...');
    adapter.stop();
    process.exit(0);
  });
}
