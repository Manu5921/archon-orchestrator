#!/bin/bash

# SETUP REAL CLAUDE CODE HOOKS FOR CONTEXT7
# Based on official Claude Code hooks documentation

set -e

echo "🔧 Setting up Claude Code hooks for Context7 systematic usage..."

# Define paths
CLAUDE_CONFIG_DIR="$HOME/.claude"
SETTINGS_FILE="$CLAUDE_CONFIG_DIR/settings.json"
HOOKS_CONFIG="$(pwd)/claude-hooks-real-config.json"

echo "📁 Claude config directory: $CLAUDE_CONFIG_DIR"
echo "⚙️ Settings file: $SETTINGS_FILE"

# Create Claude config directory if it doesn't exist
if [ ! -d "$CLAUDE_CONFIG_DIR" ]; then
    echo "📁 Creating Claude config directory..."
    mkdir -p "$CLAUDE_CONFIG_DIR"
fi

# Backup existing settings
if [ -f "$SETTINGS_FILE" ]; then
    echo "💾 Backing up existing settings..."
    cp "$SETTINGS_FILE" "$SETTINGS_FILE.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Check if settings.json exists and has valid JSON
if [ -f "$SETTINGS_FILE" ]; then
    echo "📋 Existing settings found, merging with hooks..."
    
    # Use Python to merge JSON properly
    python3 -c "
import json
import sys

# Read existing settings
try:
    with open('$SETTINGS_FILE', 'r') as f:
        settings = json.load(f)
except:
    settings = {}

# Read hooks configuration  
with open('$HOOKS_CONFIG', 'r') as f:
    hooks_config = json.load(f)

# Merge hooks into settings
settings.update(hooks_config)

# Write back to settings
with open('$SETTINGS_FILE', 'w') as f:
    json.dump(settings, f, indent=2)

print('✅ Hooks merged successfully')
"

else
    echo "🆕 Creating new settings file with hooks..."
    cp "$HOOKS_CONFIG" "$SETTINGS_FILE"
fi

echo "✅ Claude Code hooks installed successfully!"
echo ""
echo "📝 Hooks installed:"
echo "   🎯 PreToolUse: Context7 reminder before Write/Edit/MultiEdit"
echo "   📊 PostToolUse: Context7 suggestion after code generation" 
echo "   💬 UserPromptSubmit: Context7 reminder for code-related prompts"
echo ""
echo "🔄 Next steps:"
echo "   1. Restart Claude Code to activate hooks"
echo "   2. Test with: Write or Edit a JavaScript/TypeScript file"
echo "   3. Hooks will automatically remind you to use Context7"
echo ""
echo "🧪 Test the hooks:"
echo "   - Try writing some Node.js code"
echo "   - You should see Context7 reminders automatically"
echo ""
echo "📋 Configuration saved to: $SETTINGS_FILE"

# Validate the final configuration
echo "🔍 Validating configuration..."
if python3 -c "import json; json.load(open('$SETTINGS_FILE'))" 2>/dev/null; then
    echo "✅ Configuration is valid JSON"
else
    echo "❌ Configuration has JSON syntax errors"
    exit 1
fi

echo "🎉 Setup complete! Claude Code will now systematically remind you to use Context7."