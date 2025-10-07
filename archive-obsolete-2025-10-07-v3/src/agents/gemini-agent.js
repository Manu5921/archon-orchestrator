// ESM Gemini Agent - Robuste avec Bridge + CLI fallback
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

const BIN = process.env.GEMINI_CLI_PATH || "gemini";
const BRIDGE = process.env.GEMINI_API_URL || ""; // ex: http://127.0.0.1:7777

async function callBridge(prompt) {
  if (!BRIDGE) return { ok: false, error: "bridge_not_configured", retry: false };
  
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 10_000);
  
  try {
    const response = await fetch(`${BRIDGE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      signal: ctrl.signal
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      return { 
        ok: false, 
        error: `bridge_http_${response.status}`, 
        retry: response.status >= 500 
      };
    }
    
    const result = await response.json();
    return result.ok ? 
      { ok: true, text: result.text, meta: { mode: "bridge" } } : 
      { ok: false, error: result.error || "bridge_failed", retry: false };
      
  } catch (error) {
    clearTimeout(timeout);
    return { ok: false, error: String(error), retry: true };
  }
}

function callCliPrompt(prompt) {
  return new Promise((resolve) => {
    // Mode stable: -p "<prompt>"
    const args = ["-p", prompt];
    console.log(`[gemini-agent] CLI: ${BIN} ${args.join(' ')}`);
    
    const ps = spawn(BIN, args, { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    
    ps.stdout.on("data", d => (out += d.toString()));
    ps.stderr.on("data", d => (err += d.toString()));
    
    ps.on("error", (e) => {
      resolve({ ok: false, error: `spawn_error:${e.message}`, retry: true });
    });
    
    ps.on("exit", (code) => {
      if (code === 0 && out.trim()) {
        resolve({ ok: true, text: out.trim(), meta: { mode: "cli-prompt" } });
      } else {
        // Exemple d'erreur déterministe: flag invalide, auth manquante, etc.
        const deterministic = 
          /invalid|unknown flag|not found|unauthorized|forbidden|missing api key|Quota/i.test(err);
        
        console.error(`[gemini-agent] CLI failed: code=${code}, stderr=${err.slice(0, 200)}`);
        
        resolve({ 
          ok: false, 
          error: err.trim() || `gemini_exit_${code}`, 
          retry: !deterministic, 
          code 
        });
      }
    });
  });
}

export async function geminiSend(prompt) {
  const startTime = Date.now();
  
  // 1) Bridge si disponible
  if (BRIDGE) {
    console.log(`[gemini-agent] Trying bridge: ${BRIDGE}`);
    const bridgeResult = await callBridge(prompt);
    if (bridgeResult.ok) {
      const duration = Date.now() - startTime;
      console.log(JSON.stringify({
        t: new Date().toISOString(),
        scope: "gemini.agent",
        mode: "bridge",
        ok: true,
        ms: duration
      }));
      return bridgeResult;
    }
    
    if (bridgeResult.retry) {
      console.warn(`[gemini-agent] Bridge failed, retrying in 300ms: ${bridgeResult.error}`);
      await wait(300);
    }
  }
  
  // 2) CLI -p (robuste)
  console.log(`[gemini-agent] Fallback to CLI prompt mode`);
  const cliResult = await callCliPrompt(prompt);
  
  const duration = Date.now() - startTime;
  console.log(JSON.stringify({
    t: new Date().toISOString(),
    scope: "gemini.agent", 
    mode: cliResult.meta?.mode || "cli-prompt",
    ok: cliResult.ok,
    ms: duration,
    err: cliResult.ok ? undefined : String(cliResult.error).slice(0, 200)
  }));
  
  return cliResult;
}

// Fix PATH pour macOS (app GUI)
if (process.platform === 'darwin') {
  process.env.PATH = ["/opt/homebrew/bin", "/usr/local/bin", process.env.PATH || ""].join(":");
}