---
description: Full automation Phase 0→1 (Roundtable → Constitution → Specify → Init → Design → Plan → Tasks → Agents) - ONE command
argument-hint: [project-brief]
allowed-tools: SlashCommand(*), TodoWrite(*), Bash(*), Read(*)
model: claude-sonnet-4-5-20250929
---

# 🚀 Spec-Kit Bootstrap - Complete Planning Automation

**Execute entire Spec-Kit planning workflow (Phase 0 + Phase 1) with ONE command.**

## Pattern: /zen-roundtable → Full Spec-Kit Chain → Ready for /speckit.final

**ROI:** 35-40 min → 5 min (automated chain vs manual steps)

**Input:** Project brief (1-3 sentences)

**Output:** 8 files ready for implementation
- `.specify/memory/constitution.md`
- `specs/001-mvp/spec.md`
- `CLAUDE.md`
- `project-memory.md`
- `design/design-tokens.json`
- `specs/001-mvp/plan.md`
- `specs/001-mvp/tasks.md`
- `ORCHESTRATION.md`

**Next Step:** `/speckit.final` (implementation 2h45-3h)

---

## Instructions

**Project Brief:** $ARGUMENTS

### Prerequisites Check

**Verify NOT already initialized:**

```bash
if [ -f "CLAUDE.md" ] && [ -f "project-memory.md" ]; then
  echo "⚠️  Project already initialized!"
  echo ""
  echo "Found:"
  ls -lh CLAUDE.md project-memory.md
  echo ""
  echo "Options:"
  echo "1. Continue anyway (will regenerate files)"
  echo "2. Skip to /speckit.github → /speckit.final"
  echo "3. Abort"
  echo ""
  read -p "Continue? (y/N): " CONFIRM
  if [ "$CONFIRM" != "y" ]; then
    echo "❌ Aborted. Use /speckit.final to continue existing workflow."
    exit 1
  fi
fi
```

---

### Step 1: Setup TODO Tracking

**Create comprehensive TODO list:**

```
Use TodoWrite tool:
1. Phase 0: /zen-roundtable (Gemini analysis)
2. Phase 1.1: /speckit.constitution (generate constitution.md)
3. Phase 1.2: /speckit.specify (generate spec.md)
4. Phase 1.3: /speckit.init (CLAUDE.md + project-memory.md)
5. Phase 1.4: /speckit.design (design-tokens.json + wireframes)
6. Phase 1.5: /speckit.plan (plan.md architecture)
7. Phase 1.6: /speckit.tasks (tasks.md 50-100 tasks)
8. Phase 1.7: /speckit.agents (ORCHESTRATION.md)
9. Verification: All files exist
10. Summary: Next steps (/speckit.github → /speckit.final)
```

---

### Step 2: Phase 0 - Gemini Analysis

**Execute /zen-roundtable:**

```
Use SlashCommand tool:
/zen-roundtable $ARGUMENTS
```

**Wait for completion** (5-10 min).

**Expected output files:**
- `.specify/memory/constitution.md` (HIGH-LEVEL governance)
- `specs/001-mvp/spec.md` (technical base)
- `project-memory.md` (Dynamic Memory V5 initial state)

**Mark TODO #1 complete**, **mark TODO #2 in_progress**.

---

### Step 3: Phase 1.1 - Constitution

**Execute /speckit.constitution:**

```
Use SlashCommand tool:
/speckit.constitution
```

**Wait for completion** (60-90 sec).

**Expected:** Constitution enriched with project principles, quality standards, tech stack.

**Mark TODO #2 complete**, **mark TODO #3 in_progress**.

---

### Step 4: Phase 1.2 - Specification

**Execute /speckit.specify:**

```
Use SlashCommand tool:
/speckit.specify
```

**Wait for completion** (90-120 sec).

**Expected:** Spec.md with user stories, data model, API endpoints, sub-agents.

**Mark TODO #3 complete**, **mark TODO #4 in_progress**.

---

### Step 5: Phase 1.3 - Project Initialization

**Execute /speckit.init:**

```
Use SlashCommand tool:
/speckit.init
```

**Wait for completion** (30-60 sec).

**Expected files:**
- `CLAUDE.md` (enriched with project data)
- `project-memory.md` (Phase 0 + Phase 1 session logged)
- `.github/workflows/ci-template.yml`
- `.claude/commands/` (all slash commands)
- `.claude/agents/` (sub-agents templates)
- `scripts/` (quality gates)

**Mark TODO #4 complete**, **mark TODO #5 in_progress**.

---

### Step 6: Phase 1.4 - Design System

**Execute /speckit.design:**

```
Use SlashCommand tool:
/speckit.design
```

**Wait for completion** (2-3 min).

**Expected files:**
- `design/design-tokens.json` (CSS variables for Design/Dev Decoupling)
- `design/wireframes/*.svg` (UI wireframes)
- `design/components-list.md` (component inventory)

**CRITICAL:** NEVER skip this step. Design Decoupling = competitive advantage (15 min merge vs 1-2d refactor).

**Mark TODO #5 complete**, **mark TODO #6 in_progress**.

---

### Step 7: Phase 1.5 - Architecture Planning

**Execute /speckit.plan:**

```
Use SlashCommand tool:
/speckit.plan
```

**Wait for completion** (3-4 min).

**Expected file:**
- `specs/001-mvp/plan.md` (architecture, ADR decisions, file structure)

**Mark TODO #6 complete**, **mark TODO #7 in_progress**.

---

### Step 8: Phase 1.6 - Task Breakdown

**Execute /speckit.tasks:**

```
Use SlashCommand tool:
/speckit.tasks
```

**Wait for completion** (4-5 min with Haiku 4.5).

**Expected file:**
- `specs/001-mvp/tasks.md` (50-100 tasks, CHECKBOXES format, dependency-ordered)

**Mark TODO #7 complete**, **mark TODO #8 in_progress**.

---

### Step 9: Phase 1.7 - Sub-Agents Orchestration

**Execute /speckit.agents:**

```
Use SlashCommand tool:
/speckit.agents
```

**Wait for completion** (2-3 min).

**Expected file:**
- `ORCHESTRATION.md` (sub-agents strategy: backend-specialist, frontend-specialist, testing-specialist)

**Mark TODO #8 complete**, **mark TODO #9 in_progress**.

---

### Step 10: Verification

**Verify all files exist:**

```bash
echo "=== Verification ==="
echo ""

REQUIRED_FILES=(
  ".specify/memory/constitution.md"
  "specs/001-mvp/spec.md"
  "CLAUDE.md"
  "project-memory.md"
  "design/design-tokens.json"
  "specs/001-mvp/plan.md"
  "specs/001-mvp/tasks.md"
  "ORCHESTRATION.md"
)

MISSING=0
for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    SIZE=$(du -h "$file" | cut -f1)
    echo "✅ $file ($SIZE)"
  else
    echo "❌ MISSING: $file"
    MISSING=$((MISSING + 1))
  fi
done

echo ""
if [ $MISSING -eq 0 ]; then
  echo "✅ All files created successfully!"
else
  echo "❌ $MISSING files missing. Review workflow."
  exit 1
fi
```

**Mark TODO #9 complete**, **mark TODO #10 in_progress**.

---

### Step 11: Summary

**Display comprehensive summary:**

```markdown
✅ Spec-Kit Bootstrap Complete!

## Phase 0: Gemini Analysis ✅
- Constitution.md (business vision)
- Spec.md (technical base)
- project-memory.md (Dynamic Memory V5)

## Phase 1: Planning ✅
- /speckit.constitution → Constitution enriched
- /speckit.specify → Spec enriched
- /speckit.init → CLAUDE.md + memory + CI/CD
- /speckit.design → Design tokens + wireframes (Design/Dev Decoupling)
- /speckit.plan → Architecture + ADR decisions
- /speckit.tasks → [TASK_COUNT] tasks ([MVP_TASK_COUNT] MVP)
- /speckit.agents → ORCHESTRATION.md (sub-agents)

## Files Created (8 core + supporting):
[List all files with sizes]

## Project Identity:
- Name: [PROJECT_NAME from constitution]
- Vision: [ONE_LINER from constitution]
- Tech Stack: [SUMMARY from spec]
- MVP Timeline: [FROM constitution OR +2 weeks]

## Key Metrics:
- Total Tasks: [COUNT from tasks.md]
- MVP Tasks: [MVP_COUNT]
- Estimated Time: [TIME from tasks.md]
- Checkpoints: [CHECKPOINT_COUNT] (every 10 tasks)

## Quality Gates Ready:
- P0 Build (BLOCKER)
- P1 Lint (BLOCKER)
- P2 Context7 (if new library)
- P3 Memory (project-memory.md updates)
- P4 Observability (pulseLogger.cjs)

---

## Next Steps (Phase 2 + Phase 3):

**Option 1: GitHub Workflow (Recommended for team/review)**
```bash
/speckit.github         # Create branch + commit + PR (30 sec)
/speckit.final          # Implementation automation (2h45-3h)
```

**Option 2: Direct Implementation (Solo dev, no PR needed)**
```bash
/speckit.final          # Skip GitHub, implement directly
```

**Phase Timeline:**
- Phase 0 + Phase 1: ✅ COMPLETE ([TOTAL_TIME] min)
- Phase 2: GitHub Setup (30 sec) - OPTIONAL
- Phase 3: Implementation (2h45-3h) - /speckit.final
- Phase 4: Design Import (15 min) - /import-design custom-tokens.json
- Phase 5: Review + Merge (15 min)

**Total MVP:** 4-5h (validated on AdProof.ai: 99 tasks, 2h45, 150+ files, 12K+ lines)

---

**Workflow:** /speckit.bootstrap → /speckit.github → /speckit.final = Production MVP at AI Speed 🚀
```

**Mark TODO #10 complete**.

**Display todo summary:**
```
Use TodoWrite to show final status (all completed)
```

---

## Configuration Options

**User can pass optional flags:**

```bash
# Skip design step (NOT recommended - breaks Design/Dev Decoupling)
/speckit.bootstrap <brief> --skip-design

# Skip GitHub (solo dev, direct implementation)
/speckit.bootstrap <brief> --skip-github

# Auto-launch /speckit.final after bootstrap
/speckit.bootstrap <brief> --auto-final

# Dry-run mode (show what would be executed, don't run)
/speckit.bootstrap <brief> --dry-run
```

**Parse flags:**
```bash
SKIP_DESIGN=false
SKIP_GITHUB=false
AUTO_FINAL=false
DRY_RUN=false

for arg in $ARGUMENTS; do
  case $arg in
    --skip-design) SKIP_DESIGN=true ;;
    --skip-github) SKIP_GITHUB=true ;;
    --auto-final) AUTO_FINAL=true ;;
    --dry-run) DRY_RUN=true ;;
  esac
done
```

**If --dry-run:**
```
Show workflow steps WITHOUT executing
Exit after display
```

**If --auto-final:**
```
After bootstrap complete, automatically execute /speckit.final
```

---

## Error Handling

**If any step fails:**

```
❌ Step [N] failed: /speckit.[command]

Error: [error message]

Options:
1. Retry step manually: /speckit.[command]
2. Continue from next step (risky)
3. Abort and review

Last successful step: [STEP_NAME]
Files created so far: [LIST]

Manual recovery:
  cd ~/Documents/DEV/[project]
  /speckit.[failed-command]
```

**If timeout (>15 min total):**

```
⚠️  Bootstrap taking longer than expected (15+ min).

Possible causes:
- Gemini analysis very complex
- Large project scope
- Network latency

Current step: [STEP_NAME]
Elapsed time: [TIME]

Continue waiting? (y/N):
```

---

## Operating Principles

### Speed vs Quality

- **No skipping design** - Design/Dev Decoupling = non-negotiable competitive advantage
- **No skipping agents** - ORCHESTRATION.md = essential for /speckit.final
- **Yes skip clarify** - Only if constitution + spec crystal clear

### Context Efficiency

- **Use SlashCommand tool** (not direct execution) - Claude Code optimized routing
- **Wait between steps** - Each command completes before next starts
- **Verify outputs** - File existence checks prevent cascade failures

### User Experience

- **Progress visibility** - TODO tracking shows current step
- **Error recovery** - Clear instructions if step fails
- **Time estimates** - User knows what to expect (35-40 min → 5 min automation)

---

## Example Usage

```bash
# Minimal
/speckit.bootstrap AI-Scraping Pro - Semantic web scraping with auto-repair. Target: B2B SaaS dev teams. Pricing €29/€99/Custom.

# With flags
/speckit.bootstrap FormIQ - AI forms SaaS --auto-final

# Dry-run (preview workflow)
/speckit.bootstrap My Project --dry-run
```

---

## Notes

**Why this command exists:**

- ❌ **Before:** Manual chain (8 commands, 35-40 min, error-prone)
- ✅ **After:** ONE command (5 min automated, zero errors)

**ROI:**
- Time: -87% (35-40 min → 5 min)
- Errors: -100% (no forgotten steps)
- Quality: 100% (consistent execution)

**Integration:**

```
Workflow Evolution:
V1: Manual everything (2-3 days)
V2: /zen-roundtable only (Phase 0 automated, still manual Phase 1)
V3: /speckit.final only (Phase 3 automated, manual Phase 1)
V4: /speckit.bootstrap (Phase 0+1 automated) ← YOU ARE HERE
V5: Full automation (Phase 0→5 one command) ← FUTURE
```

**Replaces:**
```bash
# Old workflow (8 manual steps)
/zen-roundtable <brief>
/speckit.constitution
/speckit.specify
/speckit.init
/speckit.design
/speckit.plan
/speckit.tasks
/speckit.agents

# New workflow (1 automated step)
/speckit.bootstrap <brief>
```

---

**Version:** 6.2 (NEW)
**Created:** 2025-11-13
**Purpose:** Complete automation Phase 0→1 (Planning)
**Next:** `/speckit.github` → `/speckit.final` (Implementation)
