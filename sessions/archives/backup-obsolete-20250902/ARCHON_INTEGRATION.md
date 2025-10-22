
# 🏛️ ARCHON INTEGRATION INSTRUCTIONS

## Quick Start

1. **Start Orchestra MCP Server:**
   ```bash
   cd /Users/manu/Documents/DEV/archon-orchestrator
   ./start-orchestra.sh
   ```

2. **Configure Archon to use Orchestra:**
   
   Add to Archon's MCP clients configuration:
   ```json
   {
     "orchestra": {
       "url": "ws://localhost:3456",
       "autoConnect": true
     }
   }
   ```

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
```bash
cd /Users/manu/Documents/DEV/archon-orchestrator
node src/test/test-orchestrator.js
node src/test/test-mcp-server.js
```

## Configuration

Edit `.env` file to configure:
- MCP_PORT: Change port (default 3456)
- ARCHON_URL: Archon server URL
- Agent API keys for Gemini/Claude

## Troubleshooting

1. **Orchestra not connecting:**
   - Check if port 3456 is available
   - Verify Archon is running
   - Check logs in `logs/orchestra.log`

2. **Agents not available:**
   - Verify Gemini CLI: `gemini --version`
   - Verify Claude CLI: `claude --version`
   - Check API keys in .env

3. **Tools not showing in Archon:**
   - Restart both Orchestra and Archon
   - Check WebSocket connection in browser console
   - Verify MCP config in Archon
