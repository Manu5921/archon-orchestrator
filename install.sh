#!/bin/bash

# Archon CLI Installer
# Installs 'archon' command globally

ARCHON_BIN="$HOME/Documents/DEV/archon-orchestrator/bin/archon"

echo "🚀 Installing Archon CLI..."

# Check if bin/archon exists
if [ ! -f "$ARCHON_BIN" ]; then
  echo "❌ Error: bin/archon not found"
  exit 1
fi

# Make executable
chmod +x "$ARCHON_BIN"

# Create symlink in /usr/local/bin
if [ -w /usr/local/bin ]; then
  ln -sf "$ARCHON_BIN" /usr/local/bin/archon
  echo "✅ Installed to /usr/local/bin/archon"
else
  echo "⚠️  Need sudo for /usr/local/bin"
  sudo ln -sf "$ARCHON_BIN" /usr/local/bin/archon
  echo "✅ Installed to /usr/local/bin/archon"
fi

# Verify installation
if command -v archon &> /dev/null; then
  echo ""
  echo "✅ Archon CLI installed successfully!"
  echo ""
  archon --version
  echo ""
  echo "Usage: archon init <project-name>"
  echo "Help:  archon --help"
else
  echo "❌ Installation failed"
  exit 1
fi
