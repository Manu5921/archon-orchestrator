import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';
import { MCPTools } from './tools.js';

export class MCPServer {
  constructor(port, orchestrator) {
    this.port = port;
    this.orchestrator = orchestrator;
    this.wss = null;
    this.clients = new Map();
    this.tools = new MCPTools(orchestrator);
  }

  async start() {
    this.wss = new WebSocketServer({ port: this.port });

    this.wss.on('connection', (ws) => {
      const clientId = uuidv4();
      this.clients.set(clientId, ws);
      logger.info(`MCP client connected: ${clientId}`);

      // Wait for client to send initialize request (MCP protocol compliance)

      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          await this.handleMessage(ws, message);
        } catch (error) {
          logger.error('MCP message error:', error);
          ws.send(JSON.stringify({
            jsonrpc: '2.0',
            error: {
              code: -32700,
              message: 'Parse error'
            }
          }));
        }
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
        logger.info(`MCP client disconnected: ${clientId}`);
      });
    });

    logger.info(`MCP Server started on port ${this.port}`);
  }

  async handleMessage(ws, message) {
    const { method, params, id } = message;

    switch (method) {
    case 'initialize':
      ws.send(JSON.stringify({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {
              listChanged: true
            },
            resources: {
              subscribe: true,
              listChanged: true
            },
            logging: {}
          },
          serverInfo: {
            name: 'Orchestra MCP Server',
            version: '1.0.0'
          }
        }
      }));
      break;

    case 'tools/list':
      ws.send(JSON.stringify({
        jsonrpc: '2.0',
        id,
        result: {
          tools: this.tools.getToolsList()
        }
      }));
      break;

    case 'tools/call': {
      const result = await this.tools.executeTool(params.name, params.arguments);
      ws.send(JSON.stringify({
        jsonrpc: '2.0',
        id,
        result
      }));
      break;
    }

    case 'resources/list':
      ws.send(JSON.stringify({
        jsonrpc: '2.0',
        id,
        result: {
          resources: await this.orchestrator.getResources()
        }
      }));
      break;

    case 'logging/levels':
      ws.send(JSON.stringify({
        jsonrpc: '2.0',
        id,
        result: {
          levels: ['debug', 'info', 'warn', 'error']
        }
      }));
      break;

    default:
      ws.send(JSON.stringify({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`
        }
      }));
    }
  }

  async close() {
    if (this.wss) {
      // Close all client connections
      this.clients.forEach(client => client.close());
      this.clients.clear();

      // Close the server
      return new Promise((resolve) => {
        this.wss.close(() => {
          this.wss = null;
          resolve();
        });
      });
    }
  }
}

export async function startMCPServer(port, orchestrator) {
  const server = new MCPServer(port, orchestrator);
  await server.start();
  return server;
}
