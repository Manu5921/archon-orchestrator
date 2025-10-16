#!/usr/bin/env node

/**
 * Simple HTTP server for Lighthouse CI testing
 * Serves static files and basic endpoints for performance/accessibility testing
 */

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { logger } from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(join(rootDir, 'public')));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'lighthouse-test-server',
    version: '1.0.0'
  });
});

// Main landing page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Archon Orchestrator - Triple-Agent Orchestra for AI coordination">
        <title>Archon Orchestrator</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
            }
            h1 {
                color: #1a252f;
                border-bottom: 3px solid #2980b9;
                padding-bottom: 10px;
            }
            .card {
                background: #f8f9fa;
                padding: 20px;
                margin: 20px 0;
                border-radius: 8px;
                border-left: 4px solid #28a745;
            }
            a {
                color: #0056b3;
                text-decoration: underline;
            }
            a:hover {
                text-decoration: underline;
            }
            .status {
                display: inline-block;
                padding: 4px 12px;
                background: #28a745;
                color: white;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <header>
            <h1>Archon Orchestrator</h1>
            <p><span class="status">OPERATIONAL</span> Triple-Agent Orchestra System</p>
        </header>
        
        <main>
            <section class="card">
                <h2>System Status</h2>
                <p>The Archon Orchestrator is running and coordinating multiple AI agents for enhanced development workflows.</p>
                <ul>
                    <li><strong>MCP Server:</strong> WebSocket communication layer</li>
                    <li><strong>Agent Coordination:</strong> Claude + Gemini + Jules integration</li>
                    <li><strong>Golden Patterns:</strong> Community-validated code patterns</li>
                </ul>
            </section>
            
            <section class="card">
                <h2>Available Endpoints</h2>
                <ul>
                    <li><a href="/health">/health</a> - System health check</li>
                    <li><a href="/lighthouse-test.html">/lighthouse-test.html</a> - Lighthouse CI test page</li>
                </ul>
            </section>
        </main>
        
        <footer>
            <p><small>Archon Orchestrator v1.0.0 - Built with performance and accessibility in mind</small></p>
        </footer>
    </body>
    </html>
  `);
});

// API endpoint for testing
app.get('/api/status', (req, res) => {
  res.json({
    orchestra: 'operational',
    agents: {
      archon: 'active',
      gemini: 'connected',
      claude: 'integrated',
      jules: 'available'
    },
    performance: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: Date.now()
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  logger.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  logger.info(`🚀 Lighthouse test server started on http://localhost:${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`🔍 Lighthouse test: http://localhost:${PORT}/lighthouse-test.html`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export default app;
