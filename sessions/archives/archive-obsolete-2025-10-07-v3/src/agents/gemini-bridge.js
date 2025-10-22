// Gemini Bridge - Singleton + EADDRINUSE guard + robust CLI call
import http from 'node:http';
import { spawn } from 'node:child_process';
import os from 'node:os';

const PORT = Number(process.env.GEMINI_BRIDGE_PORT ?? 7777);
const BIN = process.env.GEMINI_CLI_PATH || 'gemini';

// Évite démarrage multiple (hot-reload / double import)
if (globalThis.__GEMINI_BRIDGE) {
  console.log('[gemini-bridge] already running');
} else {
  const server = http.createServer(async (req, res) => {
    // Health check
    if (req.method === 'GET' && req.url === '/health') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ ok: true, pid: process.pid, port: PORT }));
    }

    if (req.method !== 'POST' || req.url !== '/chat') {
      res.statusCode = 404;
      return res.end('{"error":"not found - use POST /chat"}');
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { prompt } = JSON.parse(body || '{}');
        if (!prompt) {
          res.statusCode = 400;
          return res.end('{"error":"missing prompt"}');
        }

        // Use -p flag for direct prompt (Gemini 0.2.1 syntax)
        console.log(`[gemini-bridge] executing: ${BIN} -p "${prompt.slice(0,100)}..."`);
        const ps = spawn(BIN, ['-p', prompt], { stdio: ['ignore', 'pipe', 'pipe'] });

        let out = '';
        let err = '';

        ps.stdout.on('data', d => out += d.toString());
        ps.stderr.on('data', d => err += d.toString());

        ps.on('exit', (code) => {

          if (code === 0 && out.trim()) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, text: out.trim(), mode: 'bridge' }));
          } else {
            console.error(`[gemini-bridge] CLI failed: code=${code}, stderr=${err}`);
            res.statusCode = 500;
            res.end(JSON.stringify({
              ok: false,
              code,
              error: err.trim() || 'gemini CLI failed',
              stderr: err.trim()
            }));
          }
        });

        ps.on('error', (error) => {
          console.error('[gemini-bridge] spawn error:', error.message);
          res.statusCode = 500;
          res.end(JSON.stringify({ ok: false, error: error.message }));
        });

      } catch (e) {
        console.error('[gemini-bridge] request error:', e.message);
        res.statusCode = 500;
        res.end(JSON.stringify({ ok: false, error: String(e) }));
      }
    });
  });

  server.on('error', async (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[gemini-bridge] port ${PORT} in use — probing existing...`);
      try {
        const response = await fetch(`http://127.0.0.1:${PORT}/health`);
        if (response.ok) {
          const health = await response.json();
          console.log('[gemini-bridge] existing instance healthy; reusing', health);
          return;
        }
      } catch (probeError) {
        console.warn('[gemini-bridge] probe failed:', probeError.message);
      }
      console.error('[gemini-bridge] stale listener; retry in 1.5s');
      setTimeout(() => server.listen(PORT), 1500);
      return;
    }
    console.error('[gemini-bridge] server error:', err);
  });

  server.listen(PORT, () => {
    console.log(`[gemini-bridge] listening on http://127.0.0.1:${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('[gemini-bridge] shutting down...');
    server.close(() => process.exit(0));
  });

  process.on('SIGTERM', () => {
    console.log('[gemini-bridge] terminating...');
    server.close(() => process.exit(0));
  });

  // Store singleton
  globalThis.__GEMINI_BRIDGE = server;
}

// Export functions for orchestrator
export function startGeminiBridge() {
  return new Promise((resolve, reject) => {
    if (globalThis.__GEMINI_BRIDGE) {
      resolve({ port: PORT, url: `http://127.0.0.1:${PORT}` });
      return;
    }

    // If we reach here, bridge wasn't started yet
    const server = globalThis.__GEMINI_BRIDGE;
    if (server && server.listening) {
      resolve({ port: PORT, url: `http://127.0.0.1:${PORT}` });
    } else {
      reject(new Error('Bridge failed to start'));
    }
  });
}

export function stopGeminiBridge() {
  if (globalThis.__GEMINI_BRIDGE) {
    globalThis.__GEMINI_BRIDGE.close();
    delete globalThis.__GEMINI_BRIDGE;
    console.log('[gemini-bridge] stopped');
  }
}

// Auto-start if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Bridge auto-starts via module loading
  console.log('[gemini-bridge] auto-started');
}
