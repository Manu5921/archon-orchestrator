#!/bin/bash

# 🚀 ARCHON ORCHESTRATOR - ACTIVATION ULTRA-RAPIDE

echo "🚀 ARCHON ORCHESTRATOR QUICK ACTIVATION"
echo "========================================"

PROJECT_DIR="$1"
ARCHON_DIR="/Users/manu/Documents/DEV/archon-orchestrator"

if [[ -z "$PROJECT_DIR" ]]; then
    PROJECT_DIR=$(pwd)
fi

echo "📍 Target project: $PROJECT_DIR"
echo "📍 Archon source: $ARCHON_DIR"

# 1. Copy essential files
echo ""
echo "📋 Copying essential files..."
cp "$ARCHON_DIR/.mcp.json" "$PROJECT_DIR/.mcp.json" 2>/dev/null && echo "✅ .mcp.json" || echo "⚠️ .mcp.json failed"
cp "$ARCHON_DIR/CLAUDE-TEMPLATE-FUTURS-PROJETS.md" "$PROJECT_DIR/CLAUDE.md" 2>/dev/null && echo "✅ CLAUDE.md" || echo "⚠️ CLAUDE.md failed"
cp "$ARCHON_DIR/claude-hooks-validation-required.json" "$PROJECT_DIR/.claude-hooks.json" 2>/dev/null && echo "✅ .claude-hooks.json" || echo "⚠️ .claude-hooks.json failed"

# 2. Create activation reminder
cat > "$PROJECT_DIR/ACTIVATE-ARCHON.md" << 'EOF'
# 🚀 ARCHON ORCHESTRATOR READY

## 📋 COMMANDES D'ACTIVATION IMMÉDIATE

```bash
# 1. Startup guide + best practices
/mcp archon get_session_startup_guide
/mcp archon get_best_practices topic="context7-hooks"

# 2. Workflow complet
/mcp archon get_workflow_guide workflowName="6-piliers-complet"

# 3. Context7 obligatoire avant code
/mcp context7 resolve-library-id Next.js
/mcp context7 get-library-docs /vercel/next.js --topic="App Router"
```

## 🎯 SYSTÈME AUTONOME ACTIVÉ
- Context7 hooks bloquants ✅
- Validation checkpoints Gemini ✅  
- Orchestration multi-agents ✅
- GitHub + Jules async ✅
- RAG auto-learning ✅

Plus jamais d'explications répétitives !
EOF

echo "✅ ACTIVATE-ARCHON.md"

# 3. Test MCP connection
echo ""
echo "🧪 Testing MCP connection..."
if command -v claude &> /dev/null; then
    echo "✅ Claude Code detected"
else
    echo "⚠️ Claude Code not detected in PATH"
fi

# 4. Summary
echo ""
echo "🎉 ARCHON ACTIVATION COMPLETE!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Open Claude Code in: $PROJECT_DIR"
echo "2. Read: ACTIVATE-ARCHON.md"
echo "3. Run: /mcp archon get_session_startup_guide"
echo "4. Follow the autonomous workflow!"
echo ""
echo "🚀 AUTONOMOUS SYSTEM READY - No more repetitive explanations!"