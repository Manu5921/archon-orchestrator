---
description: Initialize project structure (CLAUDE.md + project-memory.md + ci-template.yml)
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

**Purpose:** Complete project bootstrap with session startup protocol + dynamic memory.

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

### Step 2: Copy Templates

**Copy from archon-orchestrator templates:**

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
```

**If archon-orchestrator not found:** Tell user exact path and ask them to provide it.

---

### Step 3: Enrich CLAUDE.md

**Edit** `CLAUDE.md` to replace placeholders with project data:

**Header Section (lines 1-6):**
```markdown
# 🚀 [PROJECT_NAME] - Claude Code Instructions

**Version:** 6.1.3 (Observability Complete + Full Automation)
**Date:** [CURRENT_DATE: YYYY-MM-DD]
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) | Haiku 4.5 for sub-agents
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
```

**Important:** Leave other sections (Session Startup Protocol, Workflow phases, etc.) UNCHANGED.

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

Project Identity:
- Name: [PROJECT_NAME]
- Vision: [PROJECT_VISION]
- Tech Stack: [SUMMARY]

Session Logged:
- Session [DATE] - Phase 0 + Phase 1 Complete
- Documented in project-memory.md (SESSION NOTES section)

Next Steps:
1. /speckit.design (generate design-tokens.json)
2. /speckit.plan (create implementation plan)
3. /speckit.tasks (break down into 50-100 tasks)
4. /speckit.agents (generate ORCHESTRATION.md)
5. /speckit.final (full automation - 2h45-3h)

⭐ CRITICAL: Design/Dev Decoupling
   Run /speckit.design BEFORE implementation to enable:
   - Parallel designer work (custom brand)
   - 15-minute merge (vs 1-2 days refactor)
   - 0 breaking changes (CSS variables)
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

**Version:** 6.1.3
**Created:** 2025-10-18
**Purpose:** Complete /speckit.init implementation (was documented but never created)
