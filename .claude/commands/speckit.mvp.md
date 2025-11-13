---
description: ULTIMATE automation Phase 0→3 (Roundtable → Planning → GitHub → Implementation) - ONE command to MVP
argument-hint: [project-brief]
allowed-tools: SlashCommand(*), TodoWrite(*), Bash(*), Read(*)
model: claude-sonnet-4-5-20250929
---

# 🚀 Spec-Kit MVP - Complete MVP Automation (Ultimate)

**Execute ENTIRE Spec-Kit workflow from brief to MVP implementation with ONE command.**

## Pattern: /speckit.bootstrap → /speckit.github → /speckit.final → MVP Ready

**ROI:** 4-5h manual → 3h automated (Phase 0+1+2+3 fully automated)

**Input:** Project brief (1-3 sentences)

**Output:** Complete MVP implementation
- All planning files (constitution, spec, plan, tasks, design, orchestration)
- GitHub branch + PR created
- Full implementation (backend + frontend + testing)
- Quality gates passed (P0 Build, P1 Lint, P2-P4 verified)
- project-memory.md documented
- observability-pulse.jsonl timeline

**Next Step:** Review PR + Merge (15 min)

---

## Instructions

**Project Brief:** $ARGUMENTS

### Prerequisites Check

**Verify environment:**

```bash
# Check git configured
if ! git config user.name > /dev/null 2>&1; then
  echo "❌ Git not configured"
  echo "Run: git config --global user.name 'Your Name'"
  echo "     git config --global user.email 'you@example.com'"
  exit 1
fi

# Check gh CLI authenticated
if ! gh auth status > /dev/null 2>&1; then
  echo "❌ GitHub CLI not authenticated"
  echo "Run: gh auth login"
  exit 1
fi

# Check NOT already initialized
if [ -f "ORCHESTRATION.md" ]; then
  echo "⚠️  Project already initialized!"
  echo "Use /speckit.final to continue existing workflow."
  read -p "Continue anyway? (y/N): " CONFIRM
  if [ "$CONFIRM" != "y" ]; then
    exit 1
  fi
fi

echo "✅ Environment ready"
```

---

### Step 1: Setup TODO Tracking

**Create complete TODO list:**

```
Use TodoWrite tool:
1. Phase 0+1: /speckit.bootstrap (Planning automation)
2. Phase 2: /speckit.github (GitHub setup)
3. Phase 3: /speckit.final (Implementation automation)
4. Verification: Build + Lint + Tests
5. Summary: PR URL + Next steps
```

---

### Step 2: Phase 0+1 - Complete Planning

**Execute /speckit.bootstrap:**

```
Use SlashCommand tool:
/speckit.bootstrap $ARGUMENTS
```

**Wait for completion** (5-10 min).

**Expected:** All planning files created (constitution, spec, plan, tasks, design, orchestration).

**Mark TODO #1 complete**, **mark TODO #2 in_progress**.

---

### Step 3: Phase 2 - GitHub Setup

**Execute /speckit.github:**

```
Use SlashCommand tool:
/speckit.github
```

**Wait for completion** (30 sec).

**Expected:**
- Feature branch created
- Planning artifacts committed
- PR created on GitHub

**Capture PR URL for final summary.**

**Mark TODO #2 complete**, **mark TODO #3 in_progress**.

---

### Step 4: Phase 3 - Implementation

**Execute /speckit.final:**

```
Use SlashCommand tool:
/speckit.final
```

**Wait for completion** (2h45-3h).

**Expected:**
- Backend implementation (backend-specialist)
- Frontend implementation (frontend-specialist)
- Tests implementation (testing-specialist)
- Checkpoints passed every 10 tasks
- Quality gates validated (P0-P4)

**Mark TODO #3 complete**, **mark TODO #4 in_progress**.

---

### Step 5: Final Verification

**Run verification checks:**

```bash
echo "=== Final Verification ==="
echo ""

# Build check
echo "🔨 Build check..."
if npm run build > /dev/null 2>&1 || pnpm build > /dev/null 2>&1; then
  echo "✅ Build successful"
else
  echo "❌ Build failed - review errors"
fi

# Lint check
echo "🔍 Lint check..."
if npm run lint > /dev/null 2>&1 || pnpm lint > /dev/null 2>&1; then
  echo "✅ Lint passed"
else
  echo "⚠️  Lint warnings - review"
fi

# Test check
echo "🧪 Test check..."
if npm test > /dev/null 2>&1 || pnpm test > /dev/null 2>&1; then
  echo "✅ Tests passed"
else
  echo "⚠️  Some tests failed - review"
fi

# File count
FILE_COUNT=$(find src -type f | wc -l | xargs)
LINE_COUNT=$(find src -type f -name "*.ts" -o -name "*.tsx" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')

echo ""
echo "📊 Implementation Stats:"
echo "  Files: $FILE_COUNT"
echo "  Lines: $LINE_COUNT"
```

**Mark TODO #4 complete**, **mark TODO #5 in_progress**.

---

### Step 6: Summary

**Display comprehensive summary:**

```markdown
✅ MVP Implementation Complete!

## Phase 0+1: Planning ✅ (5-10 min)
- Gemini analysis (constitution + spec)
- Design system (design-tokens.json + wireframes)
- Architecture (plan.md)
- Tasks ([TASK_COUNT] tasks)
- Orchestration (ORCHESTRATION.md)

## Phase 2: GitHub ✅ (30 sec)
- Branch: [BRANCH_NAME]
- PR: [PR_URL]
- Commits: [COMMIT_COUNT]

## Phase 3: Implementation ✅ (2h45-3h)
- Backend: ✅ [BACKEND_TASK_COUNT] tasks
- Frontend: ✅ [FRONTEND_TASK_COUNT] tasks
- Testing: ✅ [TESTING_TASK_COUNT] tasks
- Quality Gates: P0 ✅ P1 ✅ P2 ✅ P3 ✅ P4 ✅

## Implementation Stats:
- Total Files: [FILE_COUNT]
- Total Lines: [LINE_COUNT]
- Duration: [TOTAL_TIME]

## Quality Verification:
- Build: [STATUS]
- Lint: [STATUS]
- Tests: [STATUS]

---

## Next Steps:

1. **Review PR:** [PR_URL]
   - Check implementation quality
   - Verify design tokens applied
   - Review project-memory.md (WHY documented)

2. **Test Locally:**
   ```bash
   pnpm dev
   # → http://localhost:3000
   ```

3. **Custom Design (Optional - 15 min):**
   - Designer creates custom-tokens.json (parallel work)
   - Run: /import-design custom-tokens.json
   - UI transforms automatically (0 code changes)

4. **Merge PR:**
   ```bash
   gh pr merge [PR_NUMBER] --squash
   ```

5. **Deploy (if CI/CD configured):**
   - Push triggers Vercel deployment
   - Or manual: vercel --prod

---

**Total Time:** 3-3.5h (vs 2-3 days manual)
**Total Cost:** ~€2-5 (LLM API + Browserbase)
**Quality:** Production-ready (Build ✅ Lint ✅ Tests ✅)

**Workflow:** /speckit.mvp = Brief → MVP in 3 hours 🚀
```

**Mark TODO #5 complete**.

---

## Configuration Options

```bash
# Skip GitHub (solo dev, no PR needed)
/speckit.mvp <brief> --skip-github

# Skip design (NOT recommended)
/speckit.mvp <brief> --skip-design

# Dry-run (show workflow, don't execute)
/speckit.mvp <brief> --dry-run

# Custom project path
/speckit.mvp <brief> --path=/custom/path
```

---

## Error Handling

**If Phase 0+1 fails:**
```
❌ Planning failed at step: [STEP]

Recovery:
1. Review error: [ERROR_MESSAGE]
2. Fix manually: /speckit.[failed-step]
3. Continue: /speckit.github → /speckit.final
```

**If Phase 2 fails:**
```
❌ GitHub setup failed

Possible causes:
- gh CLI not authenticated
- Git not configured
- Branch already exists

Recovery:
1. Manual setup: git checkout -b feat/mvp
2. Skip to: /speckit.final
```

**If Phase 3 fails:**
```
❌ Implementation failed at task: [TASK_ID]

Recovery:
1. Review observability-pulse.jsonl
2. Check project-memory.md for context
3. Resume manually or re-run: /speckit.final
```

---

## Operating Principles

### Fully Automated

- Zero manual intervention (except final review)
- Progressive checkpoints (every 10 tasks)
- Auto-recovery on transient errors

### Production Quality

- Build MUST pass (P0 blocker)
- Lint MUST pass (P1 blocker)
- Tests validated (P2)
- Memory documented (P3)
- Observability logged (P4)

### Time Budget

- Phase 0+1: 5-10 min (planning)
- Phase 2: 30 sec (GitHub)
- Phase 3: 2h45-3h (implementation)
- **Total: ~3h** (vs 2-3 days manual)

---

## Example Usage

```bash
# Minimal
/speckit.mvp AI-Scraping Pro - Semantic web scraping with auto-repair. Pricing €29/€99/Custom. Target B2B SaaS teams.

# With flags
/speckit.mvp FormIQ - AI forms SaaS --skip-github

# Dry-run
/speckit.mvp My Project Brief --dry-run
```

---

## Notes

**Why this command exists:**

Complete automation from idea to MVP:
- ❌ **Manual:** 2-3 days (slow, error-prone, context loss)
- ✅ **Automated:** 3 hours (fast, consistent, documented)

**ROI:**
- Time: -95% (2-3d → 3h)
- Quality: +100% (gates enforced)
- Cost: €2-5 (vs €500-2000 freelancer)

**Replaces:**
```bash
# Old workflow (10+ manual steps)
/zen-roundtable
/speckit.constitution
/speckit.specify
/speckit.init
/speckit.design
/speckit.plan
/speckit.tasks
/speckit.agents
/speckit.github
/speckit.final

# New workflow (1 automated step)
/speckit.mvp <brief>
```

**Limitations:**

- Requires stable internet (Gemini + LLM APIs)
- Cannot handle extremely complex projects (>200 tasks)
- Design tokens = placeholder (custom brand requires /import-design)
- Manual review still recommended (PR check)

**Future Evolution:**

```
V6.2: /speckit.mvp (Phase 0→3)        ← YOU ARE HERE
V7.0: Auto design import (AI designer)
V7.5: Auto deployment (zero-touch)
V8.0: Auto monitoring + iteration
```

---

**Version:** 6.2 (NEW - ULTIMATE)
**Created:** 2025-11-13
**Purpose:** Complete MVP automation (Brief → Implementation)
**Validated:** Not yet (created based on /speckit.bootstrap + /speckit.final patterns)
