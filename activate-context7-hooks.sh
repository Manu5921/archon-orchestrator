#!/bin/bash

# 🎯 ARCHON CONTEXT7 HOOKS ACTIVATION SCRIPT

echo "🚀 Activating Context7 Smart Hooks for Archon Orchestrator"

# 1. Copy smart hooks to project
cp claude-hooks-smart-context7.json .claude-hooks.json
echo "✅ Smart Context7 hooks activated in current project"

# 2. Reset validation state for new session
rm -f .context7_validated
echo "🔄 Context7 validation state reset"

# 3. Create quick validation helper
cat > validate-context7.sh << 'EOF'
#!/bin/bash
echo "🎯 Quick Context7 Validation"
echo "Usage examples:"
echo "  /mcp context7 resolve-library-id Next.js"
echo "  /mcp context7 get-library-docs /vercel/next.js --topic='App Router'"
echo ""
echo "After running Context7 commands, validation will be automatic"
EOF

chmod +x validate-context7.sh
echo "✅ Helper script created: ./validate-context7.sh"

# 4. Display activation status
echo ""
echo "🎯 CONTEXT7 HOOKS ACTIVE:"
echo "  - Write/Edit BLOCKED until Context7 used"
echo "  - Auto-validation after /mcp context7 commands" 
echo "  - Session-based validation state"
echo ""
echo "🚀 Ready! Start with Context7 commands before any code writing"