#!/bin/bash

# Start Orchestra MCP Server
echo "🎼 Starting Triple-Agent Orchestra..."

# Navigate to Orchestra directory
cd /Users/manu/Documents/DEV/archon-orchestrator

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
