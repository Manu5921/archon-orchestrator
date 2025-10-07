#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { logger } from '../src/utils/logger.js';

async function integrateWithArchon() {
  logger.info('🔧 Integrating Orchestra with Archon...\n');
  
  const archonPath = '/Users/manu/Documents/DEV/archon';
  const orchestraPath = process.cwd();
  
  try {
    // Step 1: Check if Archon exists
    logger.info('Step 1: Checking Archon installation...');
    try {
      await fs.access(archonPath);
      logger.info(`✅ Archon found at ${archonPath}`);
    } catch {
      logger.error(`❌ Archon not found at ${archonPath}`);
      logger.info('Please ensure Archon is installed at the correct path');
      process.exit(1);
    }
    
    // Step 2: Create MCP config for Archon
    logger.info('\nStep 2: Creating MCP configuration...');
    const mcpConfig = {
      orchestra: {
        type: 'external',
        url: 'ws://localhost:3456',
        name: 'Orchestra MCP Server',
        description: 'Triple-Agent Orchestra for intelligent task routing',
        autoStart: true,
        capabilities: {
          tools: true,
          resources: true,
          logging: true
        }
      }
    };
    
    // Check if Archon has a config directory
    const archonConfigDir = path.join(archonPath, 'config');
    try {
      await fs.mkdir(archonConfigDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    
    // Write Orchestra MCP config
    const mcpConfigPath = path.join(archonConfigDir, 'mcp-orchestra.json');
    await fs.writeFile(mcpConfigPath, JSON.stringify(mcpConfig, null, 2));
    logger.info(`✅ MCP config written to ${mcpConfigPath}`);
    
    // Step 3: Create startup script
    logger.info('\nStep 3: Creating startup script...');
    const startupScript = `#!/bin/bash

# Start Orchestra MCP Server
echo "🎼 Starting Triple-Agent Orchestra..."

# Navigate to Orchestra directory
cd ${orchestraPath}

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  pnpm install
fi

# Start the Orchestra server
node src/index.js &
ORCHESTRA_PID=$!

echo "✅ Orchestra started with PID: $ORCHESTRA_PID"
echo "🌐 MCP Server running on ws://localhost:3456"

# Save PID for shutdown
echo $ORCHESTRA_PID > orchestra.pid

# Instructions
echo ""
echo "To stop Orchestra, run: kill $(cat orchestra.pid)"
echo "To test connection: node src/test/test-mcp-server.js"
`;
    
    const startScriptPath = path.join(orchestraPath, 'start-orchestra.sh');
    await fs.writeFile(startScriptPath, startupScript);
    await fs.chmod(startScriptPath, '755');
    logger.info(`✅ Startup script created at ${startScriptPath}`);
    
    // Step 4: Create Archon integration instructions
    logger.info('\nStep 4: Creating integration instructions...');
    const instructions = `
# 🏛️ ARCHON INTEGRATION INSTRUCTIONS

## Quick Start

1. **Start Orchestra MCP Server:**
   \`\`\`bash
   cd ${orchestraPath}
   ./start-orchestra.sh
   \`\`\`

2. **Configure Archon to use Orchestra:**
   
   Add to Archon's MCP clients configuration:
   \`\`\`json
   {
     "orchestra": {
       "url": "ws://localhost:3456",
       "autoConnect": true
     }
   }
   \`\`\`

3. **Verify Integration:**
   
   In Archon UI:
   - Go to MCP Clients page
   - Look for "Orchestra MCP Server"
   - Should show 5 available tools

## Available Tools in Archon

Once connected, you can use these tools:

- **orchestra:route_task** - Intelligent task routing
- **orchestra:agent_handoff** - Transfer between agents
- **orchestra:sync_context** - Context synchronization
- **orchestra:performance_stats** - Performance metrics
- **orchestra:pattern_learning** - ML-based learning

## Testing

Run the test suite:
\`\`\`bash
cd ${orchestraPath}
node src/test/test-orchestrator.js
node src/test/test-mcp-server.js
\`\`\`

## Configuration

Edit \`.env\` file to configure:
- MCP_PORT: Change port (default 3456)
- ARCHON_URL: Archon server URL
- Agent API keys for Gemini/Claude

## Troubleshooting

1. **Orchestra not connecting:**
   - Check if port 3456 is available
   - Verify Archon is running
   - Check logs in \`logs/orchestra.log\`

2. **Agents not available:**
   - Verify Gemini CLI: \`gemini --version\`
   - Verify Claude CLI: \`claude --version\`
   - Check API keys in .env

3. **Tools not showing in Archon:**
   - Restart both Orchestra and Archon
   - Check WebSocket connection in browser console
   - Verify MCP config in Archon
`;
    
    const instructionsPath = path.join(orchestraPath, 'ARCHON_INTEGRATION.md');
    await fs.writeFile(instructionsPath, instructions);
    logger.info(`✅ Instructions written to ${instructionsPath}`);
    
    // Step 5: Create .env file if it doesn't exist
    logger.info('\nStep 5: Setting up environment...');
    const envPath = path.join(orchestraPath, '.env');
    try {
      await fs.access(envPath);
      logger.info('✅ .env file already exists');
    } catch {
      // Copy from example
      const envExample = await fs.readFile(path.join(orchestraPath, '.env.example'), 'utf-8');
      await fs.writeFile(envPath, envExample);
      logger.info('✅ Created .env file from example');
      logger.info('⚠️  Please edit .env to add your API keys');
    }
    
    // Summary
    logger.info('\n' + '='.repeat(50));
    logger.info('✅ INTEGRATION COMPLETE!');
    logger.info('='.repeat(50));
    logger.info('\nNext steps:');
    logger.info('1. Edit .env file with your API keys');
    logger.info('2. Run: ./start-orchestra.sh');
    logger.info('3. Configure Archon to connect to ws://localhost:3456');
    logger.info('4. Test with: node src/test/test-mcp-server.js');
    logger.info('\nSee ARCHON_INTEGRATION.md for detailed instructions');
    
  } catch (error) {
    logger.error('Integration failed:', error);
    process.exit(1);
  }
}

// Run integration
integrateWithArchon();