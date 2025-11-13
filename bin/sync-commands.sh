#!/bin/bash

# Sync Archon Commands - Update project with latest commands
# Usage: ./bin/sync-commands.sh [project-path]

set -e

ARCHON_ROOT="/Users/manu/Documents/DEV/archon-orchestrator"
PROJECT_PATH="${1:-.}"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Syncing Archon commands...${NC}"
echo ""

# Verify archon-orchestrator exists
if [ ! -d "$ARCHON_ROOT" ]; then
  echo -e "${RED}❌ ERROR: archon-orchestrator not found at $ARCHON_ROOT${NC}"
  exit 1
fi

# Verify project path
if [ ! -d "$PROJECT_PATH" ]; then
  echo -e "${RED}❌ ERROR: Project path not found: $PROJECT_PATH${NC}"
  exit 1
fi

cd "$PROJECT_PATH"

# Create .claude/commands if not exists
if [ ! -d ".claude/commands" ]; then
  echo -e "${YELLOW}⚠️  .claude/commands/ not found, creating...${NC}"
  mkdir -p .claude/commands
fi

# Count before
BEFORE_COUNT=$(ls -1 .claude/commands/*.md 2>/dev/null | wc -l | xargs)

# Sync all commands (overwrite existing)
echo -e "${BLUE}📂 Copying all commands from archon-orchestrator...${NC}"
cp -v "$ARCHON_ROOT/.claude/commands/"*.md .claude/commands/ 2>&1 | head -5
echo "  ..."

# Count after
AFTER_COUNT=$(ls -1 .claude/commands/*.md 2>/dev/null | wc -l | xargs)
NEW_COUNT=$((AFTER_COUNT - BEFORE_COUNT))

echo ""
echo -e "${GREEN}✅ Sync complete!${NC}"
echo ""
echo "Commands before: $BEFORE_COUNT"
echo "Commands after:  $AFTER_COUNT"
if [ $NEW_COUNT -gt 0 ]; then
  echo -e "${GREEN}New commands:    +$NEW_COUNT${NC}"
else
  echo -e "${YELLOW}Updates:         $AFTER_COUNT commands refreshed${NC}"
fi

echo ""
echo "Available commands:"
ls -1 .claude/commands/*.md | sed 's|.claude/commands/||' | sed 's|\.md$||' | sed 's|^|  - /|' | sort

echo ""
echo -e "${BLUE}💡 Tip: Restart Claude Code session to detect new commands${NC}"
