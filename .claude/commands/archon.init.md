---
description: Initialize new Archon-powered project with Workflow V6.1.5 (CLAUDE.md + Spec-Kit + Quality Gates)
argument-hint: [project-name]
allowed-tools: Bash(*), Write(*), Read(*)
model: claude-sonnet-4-5-20250929
---

# 🚀 Archon Init - New Project Bootstrap

Initialize a new Archon-powered project with complete Workflow V6.1.5 setup.

## Pattern: One-Command Project Creation

**ROI:** 5 min manual setup → 30 sec automated

**Output:**
- ✅ Git repository initialized
- ✅ CLAUDE.md (Archon workflow instructions)
- ✅ .claude/commands/ (Spec-Kit slash commands)
- ✅ .claude/agents/ (Sub-agents templates)
- ✅ scripts/ (Quality gates P0-P5)
- ✅ templates/ (project-memory-template.md)
- ✅ .gitignore configured
- ✅ Initial commit created

**Next Steps:** `/zen-roundtable` → `/speckit.design` → `/speckit.final`

---

## Instructions

**Project Name:** $ARGUMENTS

### Step 1: Validate Project Name

```bash
# Validate project name (lowercase alphanumeric with hyphens only)
PROJECT_NAME="$ARGUMENTS"

if [[ ! "$PROJECT_NAME" =~ ^[a-z0-9-]+$ ]]; then
  echo "❌ Error: Project name must be lowercase alphanumeric with hyphens only"
  echo "Example: ai-scraping-pro, my-saas-app"
  exit 1
fi

PROJECT_PATH="$HOME/Documents/DEV/$PROJECT_NAME"

if [ -d "$PROJECT_PATH" ]; then
  echo "❌ Error: Project '$PROJECT_NAME' already exists at $PROJECT_PATH"
  exit 1
fi

echo "✅ Project name validated: $PROJECT_NAME"
```

### Step 2: Use Archon CLI (Recommended)

**If `archon` command is installed globally:**

```bash
# Check if archon CLI is available
if command -v archon &> /dev/null; then
  echo "🚀 Using Archon CLI..."
  archon init "$PROJECT_NAME"
  exit 0
fi
```

**If not installed, use manual setup below:**

### Step 3: Manual Setup (Fallback)

```bash
ARCHON_ROOT="$HOME/Documents/DEV/archon-orchestrator"
PROJECT_PATH="$HOME/Documents/DEV/$PROJECT_NAME"

echo "📦 Creating project directory..."
mkdir -p "$PROJECT_PATH"
cd "$PROJECT_PATH"

echo "🔧 Initializing git..."
git init

echo "📄 Copying CLAUDE.md..."
if [ -f "$ARCHON_ROOT/CLAUDE.md" ]; then
  cp "$ARCHON_ROOT/CLAUDE.md" .
  echo "✅ CLAUDE.md copied ($(du -h CLAUDE.md | cut -f1))"
else
  echo "⚠️  CLAUDE.md not found in archon-orchestrator"
fi

echo "📂 Copying .claude/commands/..."
if [ -d "$ARCHON_ROOT/.claude/commands" ]; then
  mkdir -p .claude
  cp -r "$ARCHON_ROOT/.claude/commands" .claude/
  COUNT=$(ls -1 .claude/commands | wc -l | xargs)
  echo "✅ $COUNT slash commands copied"
else
  echo "⚠️  .claude/commands/ not found"
fi

echo "🤖 Copying .claude/agents/..."
if [ -d "$ARCHON_ROOT/.claude/agents" ]; then
  mkdir -p .claude/agents
  for agent in backend-specialist.md frontend-specialist.md design-specialist.md testing-specialist.md prompt-specialist.md; do
    if [ -f "$ARCHON_ROOT/.claude/agents/$agent" ]; then
      cp "$ARCHON_ROOT/.claude/agents/$agent" .claude/agents/
    fi
  done
  COUNT=$(ls -1 .claude/agents | wc -l | xargs)
  echo "✅ $COUNT sub-agents copied"
else
  echo "⚠️  .claude/agents/ not found"
fi

echo "📜 Copying scripts/..."
if [ -d "$ARCHON_ROOT/scripts" ]; then
  mkdir -p scripts
  for script in pulseLogger.cjs bashSandbox.cjs validateGates.cjs contextBundler.cjs viewPulse.sh; do
    if [ -f "$ARCHON_ROOT/scripts/$script" ]; then
      cp "$ARCHON_ROOT/scripts/$script" scripts/
      if [[ "$script" == *.sh ]]; then
        chmod +x "scripts/$script"
      fi
    fi
  done
  COUNT=$(ls -1 scripts | wc -l | xargs)
  echo "✅ $COUNT scripts copied"
else
  echo "⚠️  scripts/ not found"
fi

echo "📝 Copying templates/..."
if [ -d "$ARCHON_ROOT/templates" ]; then
  mkdir -p templates
  if [ -f "$ARCHON_ROOT/templates/project-memory-template.md" ]; then
    cp "$ARCHON_ROOT/templates/project-memory-template.md" templates/
    echo "✅ project-memory-template.md copied"
  fi
else
  echo "⚠️  templates/ not found"
fi

echo "📁 Creating directory structure..."
mkdir -p .specify/memory
mkdir -p specs/001-mvp
echo "✅ Directory structure created"

echo "🚫 Creating .gitignore..."
cat > .gitignore << 'GITIGNORE_EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Env
.env
.env.local
.env.production.local
.env.development.local
!.env.example

# Vercel
.vercel

# OS
.DS_Store
*.swp
*.swo

# IDE
.vscode/
.idea/

# Logs
*.log
npm-debug.log*
observability-pulse.jsonl

# Context Bundles (commit if you want disaster recovery)
# .agents/context-bundles/
GITIGNORE_EOF
echo "✅ .gitignore created"

echo "💾 Creating initial commit..."
git add .
git commit -m "chore: Initial project setup with Archon Workflow V6.1.5

- CLAUDE.md (workflow instructions)
- Spec-Kit commands (/zen-roundtable, /speckit.*)
- Quality gates scripts (P0-P5)
- Sub-agents templates (backend, frontend, testing, design)
- .gitignore

Ready for /zen-roundtable Phase 0 analysis.

🤖 Generated with /archon.init
"
echo "✅ Initial commit created"

echo ""
echo "✅ Project Created Successfully!"
echo ""
echo "Location: $PROJECT_PATH"
echo ""
echo "Next Steps:"
echo "  1. cd $PROJECT_PATH"
echo "  2. /zen-roundtable <your-project-brief>"
echo "  3. Follow Spec-Kit workflow:"
echo ""
echo "     /speckit.design   → design-tokens.json + wireframes"
echo "     /speckit.plan     → plan.md (architecture)"
echo "     /speckit.tasks    → tasks.md (50-100 tasks)"
echo "     /speckit.agents   → ORCHESTRATION.md"
echo "     /speckit.final    → Auto-implementation (2-3h)"
echo ""
```

---

## Troubleshooting

**If `archon init` fails:**

1. Check archon-orchestrator exists:
   ```bash
   ls ~/Documents/DEV/archon-orchestrator/CLAUDE.md
   ```

2. Install archon CLI globally:
   ```bash
   cd ~/Documents/DEV/archon-orchestrator
   ./install.sh
   ```

3. Manual install:
   ```bash
   mkdir -p ~/.local/bin
   ln -sf ~/Documents/DEV/archon-orchestrator/bin/archon ~/.local/bin/archon
   export PATH="$HOME/.local/bin:$PATH"
   ```

**If project already exists:**
- Choose different name
- Or delete existing: `rm -rf ~/Documents/DEV/<project-name>`

---

## Example Usage

```bash
/archon.init ai-scraping-pro
# → Creates ~/Documents/DEV/ai-scraping-pro with full Archon setup
```

---

**Pattern Validated:** ✅ Production Ready (V6.1.5)
**Time Savings:** -90% (5 min → 30 sec)
