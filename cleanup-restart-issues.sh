#!/bin/bash

# 🧹 ARCHON RESTART ISSUES CLEANUP
# Clean up files that caused problems during Mac restart

set -e

BACKUP_DIR="backups/restart-cleanup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "🧹 ARCHON RESTART ISSUES CLEANUP"
echo "================================="
echo "Backup directory: $BACKUP_DIR"
echo ""

# Create cleanup log
CLEANUP_LOG="$BACKUP_DIR/CLEANUP-LOG.md"
cat > "$CLEANUP_LOG" << 'EOF'
# Cleanup Log - Archon Restart Issues

## Problems Identified During Mac Restart

### 1. Logger Export Error
**File:** `src/utils/logger.js`
**Issue:** Only exported class Logger, but files imported { logger }
**Solution:** Added `export const logger = new Logger('Archon');`

### 2. MCP Server Script Incomplete  
**File:** `src/mcp/server.js` (original script)
**Issue:** Only defined class, no startup code
**Solution:** Created `src/mcp/start-server.js` with proper initialization

### 3. Docker Build Failures
**Directory:** `docker/`
**Issue:** GitHub MCP repository has no Go files, Docker builds fail
**Solution:** Docker not needed - Claude Code MCP + Gemini Bridge sufficient

### 4. Obsolete Test Files
Multiple test files from development that may confuse restart process.

## Files Backed Up
EOF

echo "📦 Backing up problematic Docker setup..."
if [ -d "docker" ]; then
    cp -r docker/ "$BACKUP_DIR/docker-failed-builds/"
    echo "- docker/ directory (build failures)" >> "$CLEANUP_LOG"
    echo "✅ Docker files backed up (builds were failing)"
else
    echo "ℹ️  No docker/ directory found"
fi

echo ""
echo "📦 Backing up potentially obsolete test files..."

# Test files that might be obsolete and confusing
OBSOLETE_TEST_FILES=(
    "test-archon-v3-system.js"
    "test-github-integration.js" 
    "test-github-jules.cjs"
    "test-github-mcp-simple.js"
    "test-hook-functionality.js"
    "test-hybrid-architecture.js"
    "test-hybrid-workflow.js"
    "test-mcp-servers.js"
    "test-orchestration-workflow.js"
    "test-orchestrator.cjs"
    "test-rag-learning.cjs"
    "test-real-archon-connector.js"
    "test-real-gemini-review.js"
    "test-review.js"
)

for file in "${OBSOLETE_TEST_FILES[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$BACKUP_DIR/"
        echo "- $file (potentially obsolete test)" >> "$CLEANUP_LOG"
        echo "✅ $file backed up"
    fi
done

echo ""
echo "📦 Backing up multiple claude-hooks variations..."

# Multiple hook configs that may cause confusion during restart
HOOK_VARIATIONS=(
    "claude-hooks-blocking-context7.json"
    "claude-hooks-real-config.json"  
    "claude-hooks-smart-context7.json"
    "claude-hooks-validation-required.json"
    "claude-hooks-with-learning.json"
)

for file in "${HOOK_VARIATIONS[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$BACKUP_DIR/"
        echo "- $file (hook configuration variation)" >> "$CLEANUP_LOG"
        echo "✅ $file backed up"
    fi
done

echo ""
echo "📦 Backing up diagnostic files from debugging sessions..."

# Diagnostic files from debugging
for file in claude-gemini-diagnostic-*.json; do
    if [ -f "$file" ]; then
        cp "$file" "$BACKUP_DIR/"
        echo "- $file (diagnostic log)" >> "$CLEANUP_LOG"
        echo "✅ $file backed up"
    fi
done

# Finish the cleanup log
cat >> "$CLEANUP_LOG" << 'EOF'

## Actions Completed
1. ✅ Fixed logger export in src/utils/logger.js  
2. ✅ Created src/mcp/start-server.js with proper MCP server startup
3. ✅ Updated package.json mcp:server script
4. ✅ Backed up problematic Docker setup
5. ✅ Created RESTART-GUIDE.md with clear instructions

## Files to Keep Active
- .claude-hooks.json (current active config)
- setup-gemini-bridge.js (essential for restart)  
- claude-gemini-diagnostic.js (useful debugging tool)
- RESTART-GUIDE.md (new restart instructions)
- src/mcp/start-server.js (corrected MCP startup)

## Restart Process Simplified
Only need to run after Mac restart:
```bash
cd /Users/manu/Documents/DEV/archon-orchestrator
node setup-gemini-bridge.js setup
```

All other services (Redis, Context7 MCP, Sentry MCP, Playwright MCP) auto-start with Claude Code.
EOF

echo ""
echo "📋 CLEANUP SUMMARY"
echo "=================="
echo "✅ Problematic files backed up to: $BACKUP_DIR"
echo "📄 Detailed log: $CLEANUP_LOG"
echo ""
echo "🎯 KEY FIXES APPLIED:"
echo "1. ✅ Logger export fixed (no more import errors)"
echo "2. ✅ MCP server startup script created"  
echo "3. ✅ Docker marked as non-essential (builds were failing)"
echo "4. ✅ RESTART-GUIDE.md created with simple instructions"
echo ""
echo "🚀 SIMPLIFIED RESTART PROCESS:"
echo "cd /Users/manu/Documents/DEV/archon-orchestrator"
echo "node setup-gemini-bridge.js setup"
echo ""

# Final status check
echo "📊 CURRENT ARCHON STATUS:"
echo "========================"

# Check Redis
if redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis: RUNNING (port 6379)"
else
    echo "❌ Redis: STOPPED"
fi

# Check Gemini Bridge
if curl -s http://localhost:7777/health > /dev/null 2>&1; then
    echo "✅ Gemini Bridge: RUNNING (port 7777)"  
else
    echo "❌ Gemini Bridge: STOPPED - Run: node setup-gemini-bridge.js setup"
fi

echo ""
echo "🎉 Cleanup completed successfully!"
echo "📚 Use RESTART-GUIDE.md for future Mac restarts"