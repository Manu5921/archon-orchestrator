---
description: Initialize project structure (CLAUDE.md + project-memory.md + slash commands + agents + scripts + CI/CD)
argument-hint: [optional-project-path]
allowed-tools: Write(*), Read(*), Bash(*), Edit(*)
model: claude-sonnet-4-5-20250929
---

# 🚀 Spec-Kit Project Initialization

Initialize project structure with CLAUDE.md, project-memory.md, and CI/CD template.

**Output Files:**
1. `CLAUDE.md` (enriched from claudedebut.md template)
2. `project-memory.md` (initialized from template)
3. `ci-template.yml` (GitHub Actions workflow)
4. `.claude/commands/` (all slash commands including /savebundle, /loadbundle)
5. `.claude/agents/` (sub-agents templates)
6. `scripts/` (quality gates: pulseLogger.cjs, bashSandbox.cjs, etc.)
7. `.design/` (AI Design workflow directory) 🆕 V6.2.1
   - `brief-template.md` (AI design generation instructions)
   - `tokens-history/` (design iterations storage)
8. `design-tokens.*` (framework-specific placeholder)

**Purpose:** Complete project bootstrap with session startup protocol + dynamic memory + context bundles.

---

## Instructions

**Context:** $ARGUMENTS (optional - defaults to current directory)

### Prerequisites Check

**MANDATORY - Verify these files exist BEFORE proceeding:**

```bash
# Check prerequisites
if [ ! -f .specify/memory/constitution.md ]; then
  echo "❌ ERROR: constitution.md not found"
  echo "Run /speckit.constitution first"
  exit 1
fi

if [ ! -f specs/001-mvp/spec.md ] && [ ! -f .specify/memory/spec.md ]; then
  echo "❌ ERROR: spec.md not found"
  echo "Run /speckit.specify first"
  exit 1
fi

echo "✅ Prerequisites validated"
```

**If prerequisites fail:** Stop immediately and tell user to run `/speckit.constitution` and `/speckit.specify` first.

---

### Step 1: Read Project Context

Read these files to extract project metadata:

1. **Read** `.specify/memory/constitution.md`
   - Extract: Project name, vision, target users, timeline

2. **Read** `specs/001-mvp/spec.md` OR `.specify/memory/spec.md`
   - Extract: Tech stack, architecture, database choice, auth strategy

**Store extracted data:**
- `PROJECT_NAME`: From constitution vision/title
- `PROJECT_VISION`: One-liner summary
- `TECH_STACK`: Frontend, backend, database, deploy
- `TARGET_USERS`: B2B/B2C/B2B2C
- `MVP_TIMELINE`: Target date if mentioned

---

### Step 2: Copy Templates and Essential Files

**Copy from archon-orchestrator:**

```bash
# Get archon-orchestrator path (common locations)
ARCHON_PATH="/Users/manu/Documents/DEV/archon-orchestrator"

if [ ! -d "$ARCHON_PATH" ]; then
  # Try alternative path
  ARCHON_PATH="$HOME/Documents/DEV/archon-orchestrator"
fi

if [ ! -d "$ARCHON_PATH" ]; then
  echo "❌ ERROR: archon-orchestrator not found at $ARCHON_PATH"
  echo "Adjust path or copy templates manually"
  exit 1
fi

# Copy templates
cp "$ARCHON_PATH/templates/claudedebut.md" CLAUDE.md
cp "$ARCHON_PATH/templates/project-memory-template.md" project-memory.md

echo "✅ Templates copied"

# Copy slash commands if not already present
if [ ! -d ".claude/commands" ]; then
  echo "📂 Copying slash commands..."
  mkdir -p .claude/commands
  cp -r "$ARCHON_PATH/.claude/commands/"* .claude/commands/
  COMMANDS_COUNT=$(ls -1 .claude/commands | wc -l | xargs)
  echo "✅ $COMMANDS_COUNT slash commands copied (including /savebundle, /loadbundle)"
else
  echo "⏭️  .claude/commands/ already exists, skipping"
fi

# Copy agents templates if not already present
if [ ! -d ".claude/agents" ]; then
  echo "🤖 Copying sub-agents templates..."
  mkdir -p .claude/agents
  for agent in backend-specialist.md frontend-specialist.md design-specialist.md testing-specialist.md prompt-specialist.md; do
    if [ -f "$ARCHON_PATH/.claude/agents/$agent" ]; then
      cp "$ARCHON_PATH/.claude/agents/$agent" .claude/agents/
    fi
  done
  AGENTS_COUNT=$(ls -1 .claude/agents | wc -l | xargs)
  echo "✅ $AGENTS_COUNT sub-agents copied"
else
  echo "⏭️  .claude/agents/ already exists, skipping"
fi

# Copy scripts if not already present
if [ ! -d "scripts" ]; then
  echo "📜 Copying quality gates scripts..."
  mkdir -p scripts
  for script in pulseLogger.cjs bashSandbox.cjs validateGates.cjs contextBundler.cjs viewPulse.sh; do
    if [ -f "$ARCHON_PATH/scripts/$script" ]; then
      cp "$ARCHON_PATH/scripts/$script" scripts/
      if [[ "$script" == *.sh ]]; then
        chmod +x "scripts/$script"
      fi
    fi
  done
  SCRIPTS_COUNT=$(ls -1 scripts | wc -l | xargs)
  echo "✅ $SCRIPTS_COUNT scripts copied"
else
  echo "⏭️  scripts/ already exists, skipping"
fi
```

**If archon-orchestrator not found:** Tell user exact path and ask them to provide it.

---

### Step 2.1: Detect Framework and Setup Design System 🆕 V6.2.1

**Detect framework from spec.md:**

```bash
# Read spec.md to detect framework
FRAMEWORK="unknown"

if grep -qi "next\.js\|nextjs" specs/001-mvp/spec.md .specify/memory/spec.md 2>/dev/null; then
  FRAMEWORK="nextjs"
  echo "📦 Detected: Next.js project"
elif grep -qi "astro" specs/001-mvp/spec.md .specify/memory/spec.md 2>/dev/null; then
  FRAMEWORK="astro"
  echo "📦 Detected: Astro project"
elif grep -qi "php\|laravel" specs/001-mvp/spec.md .specify/memory/spec.md 2>/dev/null; then
  FRAMEWORK="php"
  echo "📦 Detected: PHP project"
else
  echo "⚠️  Framework not detected, defaulting to Next.js"
  FRAMEWORK="nextjs"
fi
```

**Create .design/ directory structure:**

```bash
echo "🎨 Setting up AI Design workflow..."

# Create directories
mkdir -p .design/tokens-history

# Copy design brief template
if [ -f "$ARCHON_PATH/templates/design-brief-template.md" ]; then
  cp "$ARCHON_PATH/templates/design-brief-template.md" .design/brief-template.md
  echo "✅ Design brief template copied"
else
  echo "⚠️  Design brief template not found, skipping"
fi

# Create framework-specific design tokens placeholder
case $FRAMEWORK in
  nextjs)
    # Create design-tokens.json placeholder
    cat > design-tokens.json << 'EOF'
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "version": "1.0.0-placeholder",
  "generated": "PLACEHOLDER - Run /speckit.design or /speckit.design-ai",
  "colors": {
    "primary": {
      "50": "#eff6ff",
      "500": "#3b82f6",
      "600": "#2563eb"
    }
  },
  "typography": {
    "fontFamily": {
      "heading": "Inter, sans-serif",
      "body": "Inter, sans-serif"
    }
  },
  "_note": "This is a PLACEHOLDER. Generate real design system with /speckit.design-ai (AI-generated) or /speckit.design (manual)"
}
EOF
    echo "✅ design-tokens.json placeholder created (Next.js)"
    ;;

  astro)
    # Create design-tokens.css placeholder
    mkdir -p public/styles
    cat > public/styles/design-tokens.css << 'EOF'
/**
 * Design Tokens - Placeholder
 * GENERATED: PLACEHOLDER - Run /speckit.design or /speckit.design-ai
 *
 * This is a PLACEHOLDER. Generate real design system with:
 * - /speckit.design-ai (AI-generated, recommended)
 * - /speckit.design (manual configuration)
 */

:root {
  /* Primary Brand (Placeholder Blue) */
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;

  /* Neutral Palette */
  --color-neutral-50: #fafafa;
  --color-neutral-900: #171717;

  /* Typography */
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing */
  --space-4: 1rem;

  /* NOTE: Complete design system required before implementation */
}
EOF
    echo "✅ design-tokens.css placeholder created (Astro)"
    ;;

  php)
    # Create design-tokens.scss placeholder
    mkdir -p assets/styles
    cat > assets/styles/design-tokens.scss << 'EOF'
/**
 * Design Tokens - Placeholder (PHP/Laravel)
 * GENERATED: PLACEHOLDER - Run /speckit.design or /speckit.design-ai
 */

$primary-500: #3b82f6;
$neutral-900: #171717;

// NOTE: Complete design system required before implementation
EOF
    echo "✅ design-tokens.scss placeholder created (PHP)"
    ;;
esac

echo "✅ AI Design workflow initialized (.design/ directory created)"
```

**Create .design/README.md guide:**

```bash
cat > .design/README.md << 'EOF'
# .design/ - AI Design Workflow

**Purpose:** AI-generated design system workflow (V6.2.1)

**ROI:** 3-4h Figma → 15-20 min AI generation (-85%)

---

## 📁 Directory Structure

```
.design/
├── brief-template.md     # AI design generation instructions (FILL THIS)
├── tokens-history/       # Design iterations (v1, v2, v3, etc.)
│   ├── v1-trust-blue.json
│   ├── v2-tech-purple.json
│   └── v3-premium-mono.json
└── current-design.json   # Symlink to active version
```

---

## 🚀 Quick Start

**1. Fill Design Brief (5 min):**
```bash
nano .design/brief-template.md
```

Fill:
- Target audience (role, age, tech level)
- Emotion to convey (trust, innovation, premium)
- Design references (Linear, Stripe, Vercel)
- Constraints (WCAG, dark mode, mobile-first)

**2. Generate Design with AI (10-15 min):**
```bash
/speckit.design-ai
```

This will:
- Read brief + constitution.md + spec.md
- Call Gemini 3.0 Pro via Zen MCP
- Generate 3 design directions
- Create Vercel preview deploys (3 URLs)

**3. Select & Apply (2 min):**
```bash
# Review preview URLs
# Select best direction (e.g., v2)

/import-design .design/tokens-history/v2-tech-purple.json
```

---

## 📚 Documentation

See CLAUDE.md Section 2.7 for complete AI Design Workflow documentation.

**Template:** brief-template.md (comprehensive guide)
**Workflow:** /speckit.design-ai (automated generation)
**Manual:** /speckit.design (if prefer manual configuration)

---

**Version:** 6.2.1
**Created:** $(date +%Y-%m-%d)
EOF

echo "✅ .design/README.md created"
```

---

### Step 3: Enrich CLAUDE.md

**Edit** `CLAUDE.md` to replace placeholders with project data:

**Header Section (lines 1-6):**
```markdown
# 🚀 [PROJECT_NAME] - Claude Code Instructions

**Version:** 6.2.1 (Multi-Framework Support + AI Design Workflow)
**Date:** [CURRENT_DATE: YYYY-MM-DD]
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) | Haiku 4.5 for sub-agents
**Framework:** [FRAMEWORK_DETECTED: Next.js / Astro / PHP]
**Quality:** 8/8 critères via checkpoints MANDATORY every 10 tasks + Observability timeline
```

**Project Identity Section (~line 206-211):**
```markdown
### Project Identity
- **Name:** [PROJECT_NAME]
- **Vision:** [PROJECT_VISION from constitution]
- **Phase:** Planning → Implementation → Review

### Tech Stack
[Extract from spec.md and format:]

**Frontend:**
- Framework: [Next.js 15 / React / Vue / etc.]
- UI Library: [shadcn/ui / Material-UI / etc.]
- Styling: [Tailwind CSS / etc.]

**Backend:**
- Runtime: [Node.js / Python / etc.]
- Framework: [Next.js API Routes / Express / etc.]
- Database: [Supabase PostgreSQL / MongoDB / etc.]

**Deploy:**
- Hosting: [Vercel / Railway / etc.]
- CI/CD: GitHub Actions

### Key Dates
- **Kickoff:** [CURRENT_DATE]
- **MVP Target:** [FROM constitution OR estimate +2 weeks]
- **Launch Target:** [FROM constitution OR estimate +4 weeks]

### Framework Detected 🆕 V6.2.1
**[FRAMEWORK_DETECTED]** detected from spec.md

[IF Next.js detected:]
**Framework-Specific Rules Applied:** Next.js 15 App Router
- ✅ Server Actions for mutations
- ✅ Server Components for data fetching
- ✅ Design tokens via design-tokens.json
- ✅ Supabase @supabase/ssr integration
- 📖 See Section "Framework-Specific Rules" in this CLAUDE.md for complete rules

[IF Astro detected:]
**Framework-Specific Rules Applied:** Astro 5 Landing Pages
- ✅ .astro components for static content (0 KB JS)
- ✅ React islands ONLY for forms (client:load)
- ✅ Design tokens via design-tokens.css
- ✅ 17 components available in lib/astro/ui/
- ✅ Performance target: Lighthouse 100/100, LCP <1.0s
- 📖 See Section "Framework-Specific Rules" in this CLAUDE.md for complete rules

[IF PHP detected:]
**Framework-Specific Rules Applied:** PHP Laravel (🔮 Phase 4)
- ✅ Eloquent ORM
- ✅ Laravel validation
- ✅ Blade templates
- 📖 See Section "Framework-Specific Rules" in this CLAUDE.md for complete rules

### AI Design Workflow Available 🆕 V6.2.1
**Status:** ✅ Ready (.design/ directory created)
- Brief template: `.design/brief-template.md` (fill in 5 min)
- Generate 3 variants via Gemini 3.0 Pro (15 min)
- Preview deploys for validation (10 min)
- ROI: -85% time vs manual Figma (3-4h → 20 min)
- 📖 See Section "AI Design Workflow" in this CLAUDE.md for complete guide
```

**Important:** Leave other sections (Session Startup Protocol, Workflow phases, etc.) UNCHANGED except for header + Project Identity sections.

---

### Step 4: Enrich project-memory.md

**Edit** `project-memory.md` to initialize with project data:

**Header (lines 1-6):**
```markdown
# Project Memory: [PROJECT_NAME]

**Created:** [CURRENT_DATE: YYYY-MM-DD]
**Last Updated:** [CURRENT_DATE: YYYY-MM-DD HH:MM]
**Phase:** Planning (Phase 0 + Phase 1 Complete)
**Status:** Active (Spec-Kit Initialized)
```

**PROJECT IDENTITY Section:**
```markdown
## 🎯 PROJECT IDENTITY

### Vision (One-Liner)
> [PROJECT_VISION from constitution]

### Client Context
- **Type:** [Startup / PME / Enterprise / Internal Tool]
- **Sector:** [Extract from constitution]
- **Target Users:** [B2B / B2C / B2B2C]
- **Scale:** MVP
- **Budget:** [From constitution OR "Bootstrapped"]

### Timeline
- **Kickoff:** [CURRENT_DATE]
- **MVP Target:** [FROM constitution OR +2 weeks]
- **Launch Target:** [FROM constitution OR +4 weeks]
```

**ARCHITECTURAL DECISIONS Section:**
```markdown
## 🏗️ ARCHITECTURAL DECISIONS (ADR)

### Tech Stack

**Frontend:**
- Framework: [FROM spec.md]
- UI Library: [FROM spec.md OR "shadcn/ui (recommended)"]
- Styling: [FROM spec.md OR "Tailwind CSS"]

**Backend:**
- Runtime: [FROM spec.md]
- Framework: [FROM spec.md]
- Database: [FROM spec.md]
- ORM: [FROM spec.md OR "Prisma / Drizzle"]

**Infrastructure:**
- Hosting: [FROM spec.md OR "Vercel"]
- CDN: [FROM spec.md OR "Vercel Edge"]
- CI/CD: GitHub Actions

### Architecture Pattern
- **Chosen:** [FROM spec.md OR "Monolith (MVP simplicity)"]
- **Reason:** [Extract from spec.md decision rationale]
- **Trade-offs Accepted:**
  - ✅ **Pros:** [FROM spec.md]
  - ❌ **Cons:** [FROM spec.md]
```

**SESSION NOTES Section:**
```markdown
## 📝 SESSION NOTES (Chronological)

### Session [CURRENT_DATE] - Phase 0 + Phase 1: Spec-Kit Planning
- **Duration:** 30-45 min
- **Outcome:**
  - constitution.md created (business vision)
  - spec.md created (technical specification)
  - CLAUDE.md initialized (workflow instructions)
  - project-memory.md initialized (dynamic memory)
- **Key Decisions:**
  - Tech Stack: [SUMMARY]
  - Architecture: [PATTERN chosen]
  - Auth Strategy: [FROM spec.md]
- **Next Steps:** /speckit.design → /speckit.plan → /speckit.tasks → /speckit.final
```

**Leave other sections** with template placeholders (will be filled during implementation).

---

### Step 5: Generate ci-template.yml

**Write** `.github/workflows/ci-template.yml` (GitHub Actions template):

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run linter
        run: pnpm lint

      - name: Run type check
        run: pnpm tsc --noEmit

      - name: Run tests
        run: pnpm test

      - name: Build project
        run: pnpm build

      - name: Upload build artifacts
        if: success()
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: .next/

  # Optional: Jules Security Scan (async)
  security-scan:
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.event_name == 'pull_request'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Jules Security Scan
        run: |
          echo "🔒 Jules Security Scan (placeholder)"
          echo "Configure Jules webhook in project settings"
```

**Note:** Customize for project's package manager (pnpm/npm/yarn) and test commands.

---

### Step 6: Verification

**Run these checks to ensure initialization succeeded:**

```bash
# Check files exist
ls -lh CLAUDE.md project-memory.md .github/workflows/ci-template.yml

# Verify CLAUDE.md has project name
grep "^# 🚀" CLAUDE.md | head -1

# Verify project-memory.md has correct header
grep "^# Project Memory:" project-memory.md | head -1

# Verify SESSION NOTES has today's date
grep "Session $(date +%Y-%m-%d)" project-memory.md

echo "✅ Initialization complete"
```

---

### Step 7: Summary Output

**Display to user:**

```markdown
✅ Project initialized successfully!

Files created:
- CLAUDE.md (enriched with project data)
- project-memory.md (Phase 0 + Phase 1 session logged)
- .github/workflows/ci-template.yml (CI/CD ready)
- .claude/commands/ ([COUNT] slash commands - includes /savebundle, /loadbundle)
- .claude/agents/ ([COUNT] sub-agents templates)
- scripts/ ([COUNT] quality gates scripts)
- .design/ (AI Design workflow) 🆕 V6.2.1
  - brief-template.md (AI design generation instructions)
  - tokens-history/ (design iterations storage)
  - README.md (quick start guide)
- design-tokens.[json|css|scss] (framework-specific placeholder)

Project Identity:
- Name: [PROJECT_NAME]
- Vision: [PROJECT_VISION]
- Tech Stack: [SUMMARY]
- Framework: [DETECTED_FRAMEWORK]

Session Logged:
- Session [DATE] - Phase 0 + Phase 1 Complete
- Documented in project-memory.md (SESSION NOTES section)

Context Bundles Available:
- /savebundle [name] - Save checkpoint for disaster recovery
- /loadbundle <bundle-path> - Restore after crash (60-70% context recovery)
- See CLAUDE.md Section 5 for complete Context Bundles documentation

AI Design Workflow Ready: 🆕 V6.2.1
- Brief template: .design/brief-template.md (fill in 5 min)
- Generate AI design: /speckit.design-ai (15-20 min, 3 variants)
- Manual design: /speckit.design (if prefer traditional approach)
- ROI: 3-4h Figma → 15-20 min AI generation (-85%)

Next Steps:
1. Fill .design/brief-template.md (target audience, emotion, references) - 5 min
2. /speckit.design-ai (AI-generated, 3 variants, preview deploys) - 15 min
   OR /speckit.design (manual configuration) - 30-60 min
3. /speckit.plan (create implementation plan)
4. /speckit.tasks (break down into 50-100 tasks)
5. /speckit.agents (generate ORCHESTRATION.md)
6. /speckit.final (full automation - 2h45-3h)

⭐ CRITICAL: Design/Dev Decoupling
   Run /speckit.design-ai or /speckit.design BEFORE implementation to enable:
   - AI-generated professional design (3 variants in 15 min) 🆕
   - Parallel designer work (custom brand polish if needed)
   - 15-minute merge (vs 1-2 days refactor)
   - 0 breaking changes (CSS variables)
   - Framework-aware (Next.js JSON, Astro CSS, PHP SCSS)
```

---

## Error Handling

**If prerequisites missing:**
```
❌ Cannot initialize project without prerequisites.

Missing:
- constitution.md (run /speckit.constitution)
- spec.md (run /speckit.specify)

Correct order:
1. /speckit.constitution
2. /speckit.specify
3. /speckit.init ← you are here
```

**If archon-orchestrator not found:**
```
❌ Templates not found at expected location.

Expected: /Users/manu/Documents/DEV/archon-orchestrator/templates/

Please provide archon-orchestrator path, or copy templates manually:
- claudedebut.md → CLAUDE.md
- project-memory-template.md → project-memory.md
```

**If files already exist:**
```
⚠️ WARNING: Files already exist:
- CLAUDE.md
- project-memory.md

Options:
1. Backup and overwrite (recommended if re-initializing)
2. Skip initialization (keep existing files)

Choose option before proceeding.
```

---

## Notes

**Why This Command Exists:**
- Automates project bootstrap (vs 30-60 min manual work)
- Ensures session startup protocol active (prevents AI "forgetting" recent work)
- Initializes dynamic memory (SESSION NOTES fil conducteur)
- Generates CI/CD template (production-ready from day 1)

**When to Run:**
- After /speckit.constitution + /speckit.specify
- Before /speckit.design

**Replaces:**
- Manual copying of claudedebut.md
- Manual creation of project-memory.md
- Remembering to set up CI/CD template

**ROI:**
- Time: -30 min (automated vs manual)
- Quality: 100% (no forgotten files, consistent structure)
- Future: Enables session startup protocol (prevents V6.1.1 parallelization "forgetting" case)

---

**Version:** 6.2.1
**Created:** 2025-10-18
**Updated:** 2025-11-21 (AI Design workflow integration)
**Purpose:** Complete /speckit.init implementation with AI Design workflow support
