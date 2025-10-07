#!/bin/bash
echo "🧪 Checking validation status..."
node validation-checkpoint-system.cjs status
echo ""
echo "💡 Commands:"
echo "  node validation-checkpoint-system.cjs prompt  # Generate Gemini validation prompt"
echo "  node validation-checkpoint-system.cjs reset   # Reset validation state"
