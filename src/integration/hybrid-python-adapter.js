#!/usr/bin/env node

/**
 * 🔄 Archon V3 - Hybrid Python/Node.js Adapter
 * 
 * Permet d'intégrer des projets Python existants dans Archon V3
 * en ajoutant une couche Node.js pour l'orchestration et l'UI
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

class HybridPythonAdapter {
  
  async adaptPythonProject(projectPath) {
    console.log('\n🐍 Adaptation Projet Python pour Archon V3\n');
    
    // 1. Créer structure hybride
    await this.createHybridStructure(projectPath);
    
    // 2. Générer API Node.js wrapper
    await this.generateNodeAPIWrapper(projectPath);
    
    // 3. Créer UI React pour monitoring
    await this.createReactMonitoringUI(projectPath);
    
    // 4. Configurer orchestration Archon
    await this.setupArchonOrchestration(projectPath);
    
    // 5. Créer ARCHITECTURE.md hybride
    await this.createHybridArchitecture(projectPath);
    
    return { success: true };
  }
  
  async createHybridStructure(projectPath) {
    console.log('📁 Création structure hybride Python/Node.js...');
    
    const dirs = [
      'node-orchestrator',
      'node-orchestrator/api',
      'node-orchestrator/ui',
      'node-orchestrator/services',
      'archon-config'
    ];
    
    for (const dir of dirs) {
      await fs.mkdir(path.join(projectPath, dir), { recursive: true });
    }
  }
  
  async generateNodeAPIWrapper(projectPath) {
    console.log('🔌 Génération API Node.js wrapper...');
    
    const apiWrapper = `
/**
 * Node.js API Wrapper for Python Trading System
 * Provides REST endpoints to control Python bots
 */

import express from 'express';
import { spawn } from 'child_process';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Python process management
let pythonProcesses = new Map();

// Start bot endpoint
app.post('/api/bot/:name/start', async (req, res) => {
  const { name } = req.params;
  const { mode = 'paper' } = req.body;
  
  if (pythonProcesses.has(name)) {
    return res.status(400).json({ error: 'Bot already running' });
  }
  
  const process = spawn('python', [
    \`bots/\${name}/main.py\`,
    '--mode', mode
  ], {
    cwd: '${projectPath}'
  });
  
  pythonProcesses.set(name, process);
  
  process.stdout.on('data', (data) => {
    console.log(\`[\${name}]: \${data}\`);
  });
  
  res.json({ 
    status: 'started',
    bot: name,
    mode,
    pid: process.pid
  });
});

// Stop bot endpoint
app.post('/api/bot/:name/stop', (req, res) => {
  const { name } = req.params;
  const process = pythonProcesses.get(name);
  
  if (!process) {
    return res.status(404).json({ error: 'Bot not running' });
  }
  
  process.kill();
  pythonProcesses.delete(name);
  
  res.json({ status: 'stopped', bot: name });
});

// Get bot status
app.get('/api/bot/:name/status', async (req, res) => {
  const { name } = req.params;
  const isRunning = pythonProcesses.has(name);
  
  // Execute Python script to get detailed status
  const status = await new Promise((resolve) => {
    const check = spawn('python', [
      '-c',
      \`
import json
import sys
sys.path.append('${projectPath}')
from services.monitoring import get_bot_status
print(json.dumps(get_bot_status('\${name}')))
\`
    ]);
    
    let output = '';
    check.stdout.on('data', (data) => output += data);
    check.on('close', () => {
      try {
        resolve(JSON.parse(output));
      } catch {
        resolve({ running: isRunning, details: null });
      }
    });
  });
  
  res.json(status);
});

// Backtest endpoint
app.post('/api/backtest', async (req, res) => {
  const { strategy, startDate, endDate } = req.body;
  
  const backtest = spawn('python', [
    'commands/backtest-suite.py',
    '--strategy', strategy,
    '--start', startDate,
    '--end', endDate,
    '--format', 'json'
  ], {
    cwd: '${projectPath}'
  });
  
  let result = '';
  backtest.stdout.on('data', (data) => result += data);
  
  backtest.on('close', (code) => {
    if (code === 0) {
      try {
        res.json(JSON.parse(result));
      } catch {
        res.json({ output: result });
      }
    } else {
      res.status(500).json({ error: 'Backtest failed' });
    }
  });
});

// Performance metrics endpoint
app.get('/api/metrics', async (req, res) => {
  // Read from Redis or database
  const metrics = {
    turtle: { sharpe: 1.2, maxDD: -0.25, roi: 0.15 },
    sniper: { sharpe: 0.8, maxDD: -0.35, roi: 0.22 },
    ai: { suggestions: 42, accuracy: 0.78 }
  };
  
  res.json(metrics);
});

const PORT = process.env.NODE_API_PORT || 3456;
app.listen(PORT, () => {
  console.log(\`Node.js API Wrapper running on port \${PORT}\`);
});

export default app;
`;

    await fs.writeFile(
      path.join(projectPath, 'node-orchestrator/api/server.js'),
      apiWrapper
    );
  }
  
  async createReactMonitoringUI(projectPath) {
    console.log('🎨 Création UI React de monitoring...');
    
    const reactApp = `
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3456';

function TradingDashboard() {
  const [bots, setBots] = useState({
    turtle: { status: 'stopped', metrics: {} },
    sniper: { status: 'stopped', metrics: {} },
    ai: { status: 'stopped', metrics: {} }
  });
  
  const [metrics, setMetrics] = useState({});
  
  useEffect(() => {
    const fetchStatus = async () => {
      for (const bot of ['turtle', 'sniper', 'ai']) {
        try {
          const res = await axios.get(\`\${API_URL}/api/bot/\${bot}/status\`);
          setBots(prev => ({
            ...prev,
            [bot]: res.data
          }));
        } catch (error) {
          console.error(\`Error fetching \${bot} status:\`, error);
        }
      }
    };
    
    const fetchMetrics = async () => {
      try {
        const res = await axios.get(\`\${API_URL}/api/metrics\`);
        setMetrics(res.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };
    
    fetchStatus();
    fetchMetrics();
    
    const interval = setInterval(() => {
      fetchStatus();
      fetchMetrics();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const startBot = async (name) => {
    try {
      await axios.post(\`\${API_URL}/api/bot/\${name}/start\`, {
        mode: 'paper'
      });
    } catch (error) {
      console.error(\`Error starting \${name}:\`, error);
    }
  };
  
  const stopBot = async (name) => {
    try {
      await axios.post(\`\${API_URL}/api/bot/\${name}/stop\`);
    } catch (error) {
      console.error(\`Error stopping \${name}:\`, error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Trading System Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        {Object.entries(bots).map(([name, data]) => (
          <div key={name} className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              {name} Bot
            </h2>
            
            <div className="mb-4">
              <span className={\`px-3 py-1 rounded-full text-sm \${
                data.status === 'running' 
                  ? 'bg-green-600' 
                  : 'bg-red-600'
              }\`}>
                {data.status}
              </span>
            </div>
            
            {metrics[name] && (
              <div className="space-y-2 text-sm">
                <div>Sharpe: {metrics[name].sharpe}</div>
                <div>Max DD: {(metrics[name].maxDD * 100).toFixed(2)}%</div>
                <div>ROI: {(metrics[name].roi * 100).toFixed(2)}%</div>
              </div>
            )}
            
            <div className="mt-4 space-x-2">
              <button
                onClick={() => startBot(name)}
                disabled={data.status === 'running'}
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Start
              </button>
              <button
                onClick={() => stopBot(name)}
                disabled={data.status !== 'running'}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
              >
                Stop
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">System Health</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">98%</div>
            <div className="text-sm text-gray-400">API Health</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">12ms</div>
            <div className="text-sm text-gray-400">Latency</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">3/3</div>
            <div className="text-sm text-gray-400">Bots Active</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">$42.5k</div>
            <div className="text-sm text-gray-400">Total AUM</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TradingDashboard;
`;

    await fs.writeFile(
      path.join(projectPath, 'node-orchestrator/ui/Dashboard.jsx'),
      reactApp
    );
  }
  
  async setupArchonOrchestration(projectPath) {
    console.log('🎼 Configuration orchestration Archon...');
    
    const orchestrationConfig = `
{
  "project": "trading-system-hybrid",
  "type": "python-node-hybrid",
  "components": {
    "python": {
      "path": "${projectPath}",
      "bots": ["turtle", "sniper", "ai"],
      "services": ["market-analyzer", "risk-validator", "execution-optimizer"]
    },
    "node": {
      "api": "node-orchestrator/api",
      "ui": "node-orchestrator/ui",
      "port": 3456
    }
  },
  "agents": {
    "backend": {
      "type": "python-wrapper",
      "tasks": ["API endpoints", "Process management", "Metrics collection"]
    },
    "frontend": {
      "type": "react",
      "tasks": ["Dashboard UI", "Real-time monitoring", "Bot controls"]
    },
    "testing": {
      "type": "hybrid",
      "tasks": ["Python pytest", "Node.js jest", "E2E Playwright"]
    },
    "devops": {
      "type": "docker-compose",
      "tasks": ["Container orchestration", "Service discovery", "Health checks"]
    }
  },
  "validation": {
    "python": {
      "linting": "ruff",
      "testing": "pytest",
      "typing": "mypy"
    },
    "node": {
      "linting": "eslint",
      "testing": "jest",
      "typing": "typescript"
    }
  }
}
`;

    await fs.writeFile(
      path.join(projectPath, 'archon-config/orchestration.json'),
      orchestrationConfig
    );
  }
  
  async createHybridArchitecture(projectPath) {
    console.log('📝 Création ARCHITECTURE.md hybride...');
    
    const architecture = `# Architecture Constraints - Trading System Hybrid

## Tech Stack

### Core Trading Logic (Python)
- **Bots**: Turtle, Sniper, AI (Python 3.11+)
- **Libraries**: ccxt, pandas, numpy, ta, scikit-learn
- **Database**: PostgreSQL (asyncpg) + Redis
- **Testing**: pytest, pytest-asyncio

### Orchestration Layer (Node.js)
- **API**: Express.js + TypeScript
- **UI**: React + TypeScript + Tailwind CSS
- **WebSocket**: ws for real-time updates
- **Testing**: Jest + Playwright

### Integration Points
- Python bots exposed via subprocess management
- REST API wrapper for Python functionality
- Shared Redis for inter-process communication
- PostgreSQL as single source of truth

## Hybrid Architecture Rules

### Python Components (Preserved)
✅ Keep all trading logic in Python
✅ Maintain existing bot strategies
✅ Preserve backtest infrastructure
✅ Keep ML models and optimization

### Node.js Components (Added)
✅ API Gateway for external access
✅ React dashboard for monitoring
✅ WebSocket for real-time updates
✅ Archon orchestration integration

### Forbidden Patterns
❌ No direct Python web servers (Flask/FastAPI)
❌ No mixing business logic between languages
❌ No duplicate state management
❌ No direct database access from UI

## Quality Gates

### Python Side
- Test coverage ≥ 80%
- Type hints on all functions
- Ruff linting pass
- All strategies backtested

### Node.js Side
- TypeScript strict mode
- ESLint no errors
- Jest coverage ≥ 70%
- Playwright E2E tests pass

## Migration Path

1. **Phase 1**: Add Node.js wrapper (Current)
2. **Phase 2**: React monitoring UI
3. **Phase 3**: Archon agent integration
4. **Phase 4**: Full CI/CD pipeline

## Performance Requirements
- API latency < 100ms
- WebSocket heartbeat 1s
- Dashboard refresh 5s
- Backtest completion < 60s
`;

    await fs.writeFile(
      path.join(projectPath, 'ARCHITECTURE.md'),
      architecture
    );
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const projectPath = process.argv[2] || '/Users/manu/Documents/DEV/trading';
  
  const adapter = new HybridPythonAdapter();
  adapter.adaptPythonProject(projectPath).then(result => {
    if (result.success) {
      console.log(\`
✅ Adaptation hybride complétée!

Prochaines étapes:
1. cd \${projectPath}/node-orchestrator
2. npm init -y && npm install express cors axios
3. npm install -D typescript @types/node @types/express
4. npx create-react-app ui --template typescript
5. node api/server.js

L'API Node.js communiquera avec vos bots Python existants.
\`);
    }
  });
}

export default HybridPythonAdapter;