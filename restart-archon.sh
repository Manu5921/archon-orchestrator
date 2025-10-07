#!/bin/bash

# 🚀 ARCHON ONE-LINER RESTART
# Simple restart script after Mac reboot

echo "🚀 ARCHON RESTART - Checking services..."

# Go to correct directory
cd /Users/manu/Documents/DEV/archon-orchestrator

echo "📍 Directory: $(pwd)"

# Check Redis first
echo "🔍 Checking Redis..."
if redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis: RUNNING"
else
    echo "❌ Redis: STOPPED - Please start Redis first"
    echo "   Run: brew services start redis"
    exit 1
fi

# Check if Gemini Bridge is already running
echo "🔍 Checking Gemini Bridge..."
if curl -s http://localhost:7777/health > /dev/null 2>&1; then
    echo "✅ Gemini Bridge: Already RUNNING"
else
    echo "🚀 Starting Gemini Bridge..."
    node setup-gemini-bridge.js setup &
    
    # Wait for startup
    echo "⏳ Waiting for Gemini Bridge to start..."
    sleep 3
    
    if curl -s http://localhost:7777/health > /dev/null 2>&1; then
        echo "✅ Gemini Bridge: STARTED"
    else
        echo "❌ Gemini Bridge: Failed to start"
        exit 1
    fi
fi

echo ""
echo "📊 ARCHON STATUS:"
echo "=================="
echo "✅ Redis: RUNNING (port 6379)"
echo "✅ Gemini Bridge: RUNNING (port 7777)" 
echo "✅ Context7 MCP: Auto-started with Claude Code"
echo "✅ Sentry MCP: Auto-started with Claude Code"
echo "✅ Playwright MCP: Auto-started with Claude Code"

echo ""
echo "🎉 ARCHON RESTART COMPLETE!"
echo "📋 Ready for development session"
echo ""
echo "🔍 Test commands:"
echo "curl http://localhost:7777/health"
echo "redis-cli ping"

# Keep the process running if Gemini Bridge was started
if pgrep -f "setup-gemini-bridge.js" > /dev/null; then
    echo ""
    echo "🔄 Gemini Bridge running in background (PID: $(pgrep -f setup-gemini-bridge.js))"
    echo "💡 Use Ctrl+C to stop, or run 'pkill -f setup-gemini-bridge' to stop bridge"
fi