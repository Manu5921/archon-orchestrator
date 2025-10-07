#!/bin/bash

# 🧪 ACTIVATION HOOKS VALIDATION OBLIGATOIRES

echo "🧪 Activating Validation Checkpoint Hooks"

# 1. Copy validation hooks
cp claude-hooks-validation-required.json .claude-hooks.json
echo "✅ Validation hooks activated"

# 2. Reset validation state
if [[ -f ".session-work.log" ]]; then rm .session-work.log; fi
if [[ -f ".gemini_validated" ]]; then rm .gemini_validated; fi
if [[ -f ".context7_validated" ]]; then rm .context7_validated; fi
echo "🔄 Validation state reset"

# 3. Create validation helper
cat > check-validation.sh << 'EOF'
#!/bin/bash
echo "🧪 Checking validation status..."
node validation-checkpoint-system.cjs status
echo ""
echo "💡 Commands:"
echo "  node validation-checkpoint-system.cjs prompt  # Generate Gemini validation prompt"
echo "  node validation-checkpoint-system.cjs reset   # Reset validation state"
EOF

chmod +x check-validation.sh
echo "✅ Helper script created: ./check-validation.sh"

# 4. Display system info
echo ""
echo "🧪 VALIDATION CHECKPOINT SYSTEM ACTIVE:"
echo "  - Context7 REQUIRED before first code write"
echo "  - Gemini validation REQUIRED every 5 code changes"
echo "  - Automatic checkpoints prevent endless coding"
echo "  - Workflow enforces quality gates"
echo ""
echo "📋 Workflow:"
echo "  1. /mcp context7 commands → Context7 validated ✅"
echo "  2. Write/Edit code (up to 5 times)"
echo "  3. CHECKPOINT: Gemini validation required 🚨"
echo "  4. Approve/fix → Reset counter → Continue"
echo ""
echo "🚀 Ready! Next session will enforce validation checkpoints"