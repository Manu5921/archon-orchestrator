// ESM Agent Registry - Production-ready detection
import { spawn } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';
import { logger } from '../utils/logger.js';

let cache = {};
let lastProbe = 0;
const TTL_MS = 10_000;

function run(cmd, args, timeoutMs = 3000) {
  return new Promise((resolve) => {
    const ps = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '', err = '';
    const timer = setTimeout(() => { ps.kill('SIGKILL'); }, timeoutMs);
    
    ps.stdout.on('data', d => out += d.toString());
    ps.stderr.on('data', d => err += d.toString());
    
    ps.on('exit', (code) => {
      clearTimeout(timer);
      resolve({ ok: code === 0, out, err });
    });
    
    ps.on('error', (e) => {
      clearTimeout(timer);
      resolve({ ok: false, out: '', err: String(e) });
    });
  });
}

async function detectGemini() {
  const bin = process.env.GEMINI_CLI_PATH || 'gemini';
  
  try {
    // 1) Version probe (le plus fiable)
    const v = await run(bin, ['--version']);
    if (!v.ok && !v.out) {
      return { name: 'gemini', ok: false, reason: 'not_executable' };
    }
    
    // 2) Simple self-call (robuste aux variantes)  
    const smoke = await run(bin, ['help']);
    
    return {
      name: 'gemini',
      ok: smoke.ok || !!smoke.out,
      version: v.out.trim() || undefined,
      endpoint: process.env.GEMINI_API_URL || null,
      reason: smoke.ok ? undefined : 'help_failed'
    };
  } catch (error) {
    return { 
      name: 'gemini', 
      ok: false, 
      reason: 'detection_error',
      error: error.message 
    };
  }
}

async function detectClaude() {
  const bin = process.env.CLAUDE_CLI_PATH || 'claude';
  
  try {
    // Claude Code CLI detection
    const v = await run(bin, ['--version']);
    if (!v.ok && !v.out) {
      return { name: 'claude', ok: false, reason: 'not_executable' };
    }
    
    return { 
      name: 'claude', 
      ok: true, 
      version: v.out.trim(),
      endpoint: process.env.CLAUDE_API_URL || null
    };
  } catch (error) {
    return { 
      name: 'claude', 
      ok: false, 
      reason: 'detection_error',
      error: error.message 
    };
  }
}

export async function probeAgents(force = false) {
  const now = Date.now();
  if (!force && (now - lastProbe) < TTL_MS && cache.claude && cache.gemini) {
    return cache;
  }
  
  logger.debug('🔍 Probing agents...');
  const [gc, cc] = await Promise.all([detectGemini(), detectClaude()]);
  
  cache = { gemini: gc, claude: cc };
  lastProbe = now;
  
  logger.info(`🤖 Agent detection: Gemini=${gc.ok}, Claude=${cc.ok}`);
  
  return cache;
}

export async function getCapabilities() {
  const cap = await probeAgents();
  
  return {
    agents: {
      gemini: !!cap.gemini?.ok,
      claude: !!cap.claude?.ok,
      archon: true // Assuming Archon MCP is available
    },
    versions: {
      gemini: cap.gemini?.version,
      claude: cap.claude?.version
    },
    endpoints: {
      gemini: cap.gemini?.endpoint,
      claude: cap.claude?.endpoint
    },
    health: {
      gemini: cap.gemini,
      claude: cap.claude
    }
  };
}

// Parse agents environment variable properly
export function parseAgentsEnv(v) {
  return (v || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
}