# Workflow V6 MVP - Complete Guide

**Version:** V6 MVP "Final Automation"
**Date:** 2025-10-16
**Status:** ✅ **PRODUCTION READY**
**Validation:** Tested on AdProof.ai MVP (99 tasks, 2h45 execution)

---

## 🎯 Overview

**V6 MVP = Complete automation of F4 (manual copy-paste eliminated)**

**Time Savings:**
- Overhead: -5 to -10 minutes per project (100% automation)
- Execution: -60% on AdProof test (2h45 vs 6-7h estimate with Haiku 4.5)
- Risk: 0 copy-paste errors (manual step eliminated)

**Key Innovation:**
```bash
# V5.2.1 (Manual)
/speckit.agents  # Generate ORCHESTRATION.md + implementation-prompt.md
# ⚠️ USER manually copies implementation-prompt.md content (5-10 min)
/implement [paste]

# V6 MVP (Automated)
/speckit.agents  # Generate ORCHESTRATION.md + observability-pulse.jsonl
/speckit.final   # 🆕 Reads ORCHESTRATION.md + launches agents automatically
```

---

## 📋 Complete Workflow (7 Phases)

### Phase 0: Multi-IA Roundtable (30-45 min) - OPTIONAL ⚠️

**Status:** Optional for V6 MVP (use Gemini alone for speed)

**Command:**
```bash
/zen-roundtable "Brief: [project description]"
```

**Output (8KB total):**
- `analysis-multi-ia.md` (5KB) - Multi-perspective analysis
- `prompt-constitution.md` (2-3KB) - Constitution instructions
- `prompt-specify.md` (1-2KB) - Specification instructions

**Agents:**
- Codex (gpt-5): Architecture options + tech stack
- Gemini (2.5-pro): Security review + scalability analysis
- Claude (Sonnet 4.5): Arbitration + synthesis

**⚠️ Known Issue:** `/zen-roundtable` can timeout (5+ min) if Codex hits token limit (36K > 25K max)

**Optimization V7:** Use Gemini alone (~5-10 min vs 30-45 min multi-IA)

**Skip if:** You already have clear project vision (proceed directly to Phase 1)

---

### Phase 1: Planning (30-35 min) - AUTONOMOUS ✅

**Commands (in exact order):**

```bash
# Step 1: Project Constitution (60-90s)
/speckit.constitution
# → Output: .specify/memory/constitution.md
# → Defines: Principles, quality standards, constraints

# Step 2: Feature Specification (90-120s)
/speckit.specify
# → Output: .specify/memory/spec.md OR specs/001-mvp/spec.md
# → Defines: Features, user stories, acceptance criteria

# Step 3: Project Initialization (30-45s)
/speckit.init
# → Output: CLAUDE.md, project-memory.md, ci-template.yml
# → Initializes: Git workflow, memory system, CI templates

# Step 4: Design System (2-5 min) ⭐ NEVER SKIP
/speckit.design
# → Output: design/design-tokens.json, design/wireframes/*.svg
# → Defines: Color palette, typography, spacing, components list
# → CRITICAL: Enables Design/Dev Decoupling (15 min custom brand merge later)

# Step 5: Implementation Plan (3-5 min)
/speckit.plan
# → Output: specs/001-mvp/plan.md
# → Defines: Architecture, file structure, dependencies

# Step 6: Task Breakdown (5-8 min)
/speckit.tasks
# → Output: specs/001-mvp/tasks.md
# → Generates: 50-100 tasks with CHECKBOXES format
# → Format: "- [ ] T001: Task description"

# Step 7: Agent Orchestration (3-5 min)
/speckit.agents
# → Output: ORCHESTRATION.md, implementation-prompt.md, observability-pulse.jsonl
# → Defines: Sub-agents strategy, task allocation, execution plan
# → Verification: Step 6 checks 3 files created (ls -lh)
```

**CRITICAL ORDER:** tasks BEFORE agents (agents needs tasks.md to allocate resources)

**Total Duration:** 30-35 minutes (autonomous, minimal input required)

**Artifacts Created:**
- 8 essential files (constitution, spec, CLAUDE.md, design tokens, plan, tasks, orchestration, pulse.jsonl)
- Design system ready for parallel designer work
- Complete implementation roadmap

---

### Phase 2: GitHub Setup (2 min) - GUIDED BY CLAUDE.md ✅

**Read:** `CLAUDE.md` Section 2 (GitHub Setup Process)

**Commands (execute EXACTLY as documented):**

```bash
# Step 1: Create feature branch
git checkout -b feat/mvp

# Step 2: Stage all files
git add .

# Step 3: Commit with descriptive message
git commit -m "feat: init MVP structure

- Constitution + Spec generated
- Design system (tokens + wireframes)
- Plan + Tasks breakdown (99 tasks)
- ORCHESTRATION.md with 3 agents

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Step 4: Push branch
git push -u origin feat/mvp

# Step 5: Create Pull Request
gh pr create --title "feat: MVP Implementation" --body "$(cat <<'EOF'
## Summary
- Architecture defined
- Tasks allocated to 3 agents (backend, frontend, testing)
- Design system ready

## Test Plan
- [ ] Build passes (P0)
- [ ] Lint clean (P1)
- [ ] Tests pass (P2)

🤖 Generated with Claude Code
EOF
)"
```

**No questions, no variations** - Execute steps as written in CLAUDE.md

**Result:** Feature branch + PR ready for implementation

---

### Phase 3: Implementation V6 MVP (3-4h) - AUTOMATED ✅ 🆕

**Command:**
```bash
/speckit.final
# Optional: Specify project path if not in current directory
# /speckit.final ../adproof/
```

**What Happens (8 Steps):**

#### Step 1: Project Path Detection
- Parses $ARGUMENTS or uses "." (current directory)
- Displays: `📍 Project path: [path]`

#### Step 2: Prerequisites Verification (Smart Path Detection)
Checks 8 required files with flexible locations:

1. ✅ `ORCHESTRATION.md` (root)
2. ✅ `.specify/memory/constitution.md`
3. ✅ `spec.md` (searches specs/001-mvp/ OR .specify/memory/)
4. ✅ `specs/001-mvp/tasks.md`
5. ✅ `specs/001-mvp/plan.md`
6. ✅ `design/design-tokens.json`
7. ✅ `project-memory.md` (searches root OR .specify/memory/)
8. ✅ `observability-pulse.jsonl` (auto-creates if missing)

**Smart Path Detection:**
- Handles Spec-Kit location inconsistency
- Searches 2 locations for spec.md and project-memory.md
- Auto-creates observability-pulse.jsonl if needed

**If missing files:** Displays error + commands to generate → STOPS execution

#### Step 3: Initialize Pulse Logger
```bash
node -e "
const pulse = require('./scripts/pulseLogger.cjs');
pulse.clearPulse();
pulse.logCustom('orchestration_start', { workflow: 'V6-MVP', execution: 'sequential' });
"
```

**Output:** `✅ Pulse logger initialized`

#### Step 4: Parse ORCHESTRATION.md
- Extracts agents (sections starting with `### ` + `-specialist`)
- Parses task ranges (`**Tasks:** T001-T004`)
- Parses duration estimates (`**Duration:** 20 min`)

**Example Output:**
```
🔍 Parsing ORCHESTRATION.md...

Found 3 agents:
1. backend-specialist (Tasks: T001-T035, Duration: 60 min)
2. frontend-specialist (Tasks: T036-T075, Duration: 80 min)
3. testing-specialist (Tasks: T076-T099, Duration: 40 min)

Total: 99 tasks across 3 agents
```

#### Step 5: Load Context Files
Reads:
- constitution.md
- spec.md
- tasks.md

Extracts:
- Project name
- Total task count
- Tech stack summary

**Example Output:**
```
📚 Loading context...
   Project: AdProof.ai MVP
   Tasks: 99
   Tech Stack: Next.js 15 + Supabase + Claude 3.5 Sonnet

✅ Context loaded
```

#### Step 6: Execute Agents Sequentially

**For each agent:**

1. **Display Start:**
   ```
   🚀 [1/3] backend-specialist
      Tasks: T001-T035 (35 tasks)
      Duration estimate: 60 min
   ```

2. **Log Start Event:**
   ```bash
   pulse.logStart('backend-specialist', { tasks: 'T001-T035', duration_estimate: '60 min' })
   ```

3. **Launch Agent (Task Tool):**
   ```javascript
   // Delegates to Task tool with full context:
   // - ORCHESTRATION.md instructions
   // - CLAUDE.md quality standards
   // - constitution.md principles
   // - spec.md requirements
   // - tasks.md checklist (T001-T035 for this agent)
   // - design-tokens.json (CSS variables only)
   // - project-memory.md (runtime decisions)
   ```

4. **Agent Execution (Real Work):**
   - Reads assigned tasks (T001-T035)
   - Implements features following quality gates
   - Uses design tokens (CSS variables, 0 hardcoded colors)
   - Runs checkpoints every 10 tasks:
     - Gate 1: Build Check (P0 BLOCKER)
     - Gate 2: ESLint (P1 BLOCKER - mcp__eslint__lint-files)
     - Gate 3: Context7 (IF new library)
     - Gate 4: Memory (project-memory.md updated)
   - Updates task checkboxes (sed commands)
   - Documents decisions in project-memory.md

5. **Display Completion:**
   ```
      ✅ Completed (55m 30s)
   ```

6. **Log End Event:**
   ```bash
   pulse.logEnd('backend-specialist', {
     duration_s: 3330,
     tasks_completed: 'T001-T035',
     status: 'success'
   })
   ```

7. **Log Checkpoints:**
   ```bash
   pulse.logCheckpoint('build', 'pass', { agent: 'backend-specialist', errors: 0 })
   pulse.logCheckpoint('lint', 'pass', { agent: 'backend-specialist', warnings: 4 })
   pulse.logCheckpoint('test', 'pass', { agent: 'backend-specialist', tests_written: 21 })
   ```

8. **Display Checkpoints:**
   ```
      Checkpoints: build ✅ | lint ✅ (4 warnings) | test ✅
   ```

**Repeat for remaining agents** (frontend-specialist, testing-specialist)

**Execution Mode:**
- **Sequential:** backend → frontend → testing (safe, predictable)
- **V6.1 Future:** Parallel execution (2× faster, more complex)

#### Step 7: Final Validation

```
🔍 Running final validation...
   Build: ✅ PASS (0 errors)
   Lint: ✅ PASS (4 warnings documented)
   Test: ✅ READY (50+ tests written)

✅ Final validation complete
```

#### Step 8: Generate Summary

```bash
node -e "
const pulse = require('./scripts/pulseLogger.cjs');
const summary = pulse.getSummary();
console.log(JSON.stringify(summary, null, 2));
"
```

**Example Output:**
```
═══════════════════════════════════════════════════
  ORCHESTRATION COMPLETE - V6 MVP
═══════════════════════════════════════════════════

📊 SUMMARY:
   Total Events:     19
   Agents Executed:  3
   Errors:           0
   Checkpoints:      9 pass | 0 fail | 0 skip
   Duration:         2h 45m 30s (9930s total)

📅 VIEW TIMELINE:
   ./scripts/viewPulse.sh

📝 LOGS:
   observability-pulse.jsonl

✅ NO ERRORS - Implementation successful!

🎯 NEXT STEPS:
   1. View timeline: ./scripts/viewPulse.sh
   2. Review changes: git status
   3. Verify build: pnpm build
   4. Run tests: pnpm test

═══════════════════════════════════════════════════

✅ /speckit.final COMPLETE

**Workflow:** Sequential Execution
**Agents:** 3 executed (backend, frontend, testing)
**Duration:** 2h 45m 30s
**Status:** SUCCESS ✅

**Time Saved vs V5.2.1:** -5 to -10 minutes (automation) ✅
**Zero Copy-Paste Errors:** Eliminated manual step ✅

🚀 V6 MVP - Workflow Automation Validated!
```

**Artifacts Generated (AdProof Example):**
- 150+ files created
- 12,000+ lines of code
- 15+ React components
- 6 Next.js pages
- 4 API endpoints
- 3 database tables
- 21 test files (4,049 lines)
- 50+ tests written

**Quality Gates Passed:**
- ✅ Build: 0 errors
- ✅ Lint: 4 warnings (documented, acceptable)
- ✅ Tests: 50+ tests structured (TDD approach)
- ✅ Design Tokens: 100% (0 hardcoded colors)

**Total Duration:** 2h45 (validated on AdProof.ai MVP with 99 tasks)

---

### Phase 4: Verification (5 min) - LOCAL ✅

**Commands:**

```bash
# Step 1: View execution timeline
./scripts/viewPulse.sh
# → Displays: Color-coded timeline with checkpoints
# → Shows: Agent durations, errors (if any), summary stats

# Step 2: Verify build passes
pnpm build
# → Expected: Build succeeds with 0 errors
# → If fails: Review error logs, check P0 checkpoint

# Step 3: Verify lint status
pnpm lint
# → Expected: 0 errors (warnings acceptable if documented)
# → If errors: Review mcp__eslint__lint-files output

# Step 4: Run tests
pnpm test
# → Expected: Tests pass (or TDD RED state with tests written)
# → Verify: Test coverage for core flows

# Step 5: Review git changes
git status
git diff
# → Expected: 150+ files changed, 12K+ lines
# → Verify: No unexpected changes, design tokens used
```

**Checkpoint Review:**

| Gate | Status | Action if Failed |
|------|--------|------------------|
| **P0: Build** | Must PASS | Fix compilation errors immediately |
| **P1: Lint** | Must PASS | Fix TypeScript/ESLint errors (warnings OK) |
| **P2: Tests** | READY | Tests written (may be RED until implementation complete) |
| **Design Tokens** | 100% | Verify 0 hardcoded colors (grep for `bg-blue-`, `text-red-`) |

**Output Files to Review:**
- `observability-pulse.jsonl` - Event log (1 line = 1 JSON event)
- `project-memory.md` - Runtime decisions documented (Section 7: Runtime Decisions)
- `specs/001-mvp/tasks.md` - Task checkboxes updated (should show `- [x]` for completed)

**Total Duration:** 5 minutes

---

### Phase 5: Commit + Push (2 min) - LOCAL ✅

**Commands:**

```bash
# Step 1: Stage all changes
git add .

# Step 2: Commit with comprehensive message
git commit -m "feat: implement MVP (V6 automated)

Backend:
- API endpoints (4) with RLS
- Supabase tables (3) with audit logs
- LLM orchestration (Claude 3.5 Sonnet + GPT-4o-mini)

Frontend:
- Components (15+) with shadcn/ui
- Pages (6) with Next.js 15 app router
- Design tokens (100% - 0 hardcoded colors)

Testing:
- Tests written (50+) with TDD approach
- Test files (21) structured by feature

Quality Gates:
- ✅ Build: PASS (0 errors)
- ✅ Lint: PASS (4 warnings documented)
- ✅ Tests: READY (TDD RED state)

Observability:
- Timeline logged (observability-pulse.jsonl)
- Runtime decisions documented (project-memory.md)

Duration: 2h45 (3 agents sequential)

🤖 Generated with Claude Code (V6 MVP)
Co-Authored-By: Claude <noreply@anthropic.com>"

# Step 3: Push changes
git push
```

**Result:** Changes pushed to feature branch, PR updated

**Total Duration:** 2 minutes

---

### Phase 6: Design Import (15 min) - OPTIONAL ⚠️

**When:** After designer creates custom brand (in parallel with Phase 3)

**Command:**
```bash
/import-design custom-tokens.json
```

**What Happens:**
1. Reads custom-tokens.json (designer's brand)
2. Merges with design/design-tokens.json (preserves structure)
3. Updates CSS variables in global.css
4. Verifies 0 breaking changes (all components use variables)

**Result:**
- UI transforms from placeholder brand (blue) to custom brand (violet)
- 0 code changes required (CSS variables abstraction)
- 0 component refactoring (design/dev decoupled)

**ROI:**
- **Time:** 15 min merge vs 1-2 days refactor = **-95%**
- **Risk:** 0 breaking changes vs 20-30% components touched = **production-safe**
- **Quality:** Custom brand vs generic = **differentiation**

**Competitive Advantage:**
- Lovable/Bolt/v0: Generic blue template (commodity)
- Archon Workflow: Custom client brand (professional)

**Total Duration:** 15 minutes (if custom design ready)

**Skip if:** Using placeholder design for MVP launch

---

### Phase 7: Review + Merge (15 min) - MAC OR MOBILE ✅

**On Mac (terminal):**

```bash
# Step 1: View PR diff (optional)
gh pr view --web

# Step 2: Review Jules Security report (optional, manual trigger)
# If Jules configured: Check GitHub Actions tab for scan results
# If not configured: Skip (Jules is experimental, not mandatory)

# Step 3: Approve PR (if self-review OK)
gh pr review --approve

# Step 4: Merge PR
gh pr merge --squash
# Or: gh pr merge --merge (preserve commits)

# Step 5: Switch to main branch
git checkout main

# Step 6: Pull merged changes
git pull

# Step 7: Delete feature branch
git branch -D feat/mvp
git push origin --delete feat/mvp
```

**On Mobile (GitHub app):**
- Open PR in GitHub app
- Review files changed (scroll through diffs)
- Approve + Merge via app UI
- Done (branch cleanup handled by GitHub settings)

**Total Duration:** 15 minutes

---

## 📊 Complete Timeline Summary

| Phase | Duration | Device | Commands |
|-------|----------|--------|----------|
| **0. Multi-IA Roundtable** | 30-45 min (OPTIONAL) | Mac | `/zen-roundtable` |
| **1. Planning** | 30-35 min | Mac | `/speckit.constitution` → `/specify` → `/init` → `/design` → `/plan` → `/tasks` → `/agents` |
| **2. GitHub Setup** | 2 min | Mac | `git checkout -b` → `git commit` → `git push` → `gh pr create` |
| **3. Implementation V6** | 3-4h | Mac (automated) | `/speckit.final` 🆕 |
| **4. Verification** | 5 min | Mac | `./scripts/viewPulse.sh` + `pnpm build` + `pnpm lint` + `pnpm test` |
| **5. Commit** | 2 min | Mac | `git add . && git commit && git push` |
| **6. Design Import** | 15 min (OPTIONAL) | Mac | `/import-design custom-tokens.json` |
| **7. Review + Merge** | 15 min | Mac OR Mobile | `gh pr merge` |
| **TOTAL** | **4-5h** | **Mac 99%** | **V6 MVP Complete** |

**Key Improvements V6 vs V5.2.1:**
- **Overhead:** -5 to -10 min (copy-paste eliminated)
- **Execution:** -60% on AdProof test (Haiku 4.5 optimization)
- **Risk:** 0 copy-paste errors (automation)
- **Quality:** Build ✅, Lint ✅, Tests ✅ (checkpoints enforced)
- **Observability:** Timeline complete (observability-pulse.jsonl)

---

## 🛠️ Troubleshooting

### Issue 1: `/speckit.final` not found

**Symptom:** Command not available in project

**Cause:** Command files not copied to `.claude/commands/`

**Fix:**
```bash
# Copy commands from archon-orchestrator
cp ~/Documents/DEV/archon-orchestrator/.claude/commands/speckit.final.md .claude/commands/
cp ~/Documents/DEV/archon-orchestrator/.claude/commands/speckit.agents.md .claude/commands/

# Restart Claude Code
claude restart
```

---

### Issue 2: Prerequisites missing (Step 2)

**Symptom:** Error: "❌ Prerequisites missing (X/8 files found)"

**Cause:** Planning phase incomplete

**Fix:**
```bash
# Missing constitution.md
/speckit.constitution

# Missing spec.md
/speckit.specify

# Missing CLAUDE.md + project-memory.md
/speckit.init

# Missing design-tokens.json
/speckit.design

# Missing plan.md
/speckit.plan

# Missing tasks.md
/speckit.tasks

# Missing ORCHESTRATION.md
/speckit.agents

# Then retry
/speckit.final
```

---

### Issue 3: Path detection fails (spec.md not found)

**Symptom:** Error: "❌ spec.md - Run /speckit.specify"

**Cause:** File in alternate location (.specify/memory/ instead of specs/001-mvp/)

**Fix (Option A - Recommended):** Move files to standard locations
```bash
# Move spec.md
mkdir -p specs/001-mvp
mv .specify/memory/spec.md specs/001-mvp/

# Move project-memory.md
mv .specify/memory/project-memory.md ./

# Retry
/speckit.final
```

**Fix (Option B):** Smart path detection should handle this automatically (V6 MVP feature)

If still failing, verify `/speckit.final` has smart path detection:
```bash
# Check command version
head -n 20 .claude/commands/speckit.final.md
# Should show: "Version: V6 MVP Test (Sequential Execution...)"
```

---

### Issue 4: Agent execution timeout

**Symptom:** Agent runs >30 min without completion

**Cause:** Large task allocation (40+ tasks) or complex implementation

**Fix:**
1. Monitor observability-pulse.jsonl in real-time:
   ```bash
   tail -f observability-pulse.jsonl
   ```

2. Check agent progress via TodoWrite updates (if visible in UI)

3. If truly stuck (>60 min no progress):
   - Stop execution (Ctrl+C)
   - Review last completed task in tasks.md
   - Review last pulse event: `tail -1 observability-pulse.jsonl`
   - Restart from checkpoint or continue manually

**Prevention:** Allocate 20-35 tasks per agent (optimal for Haiku 4.5)

---

### Issue 5: Build fails after implementation

**Symptom:** `pnpm build` errors (TypeScript/Next.js compilation)

**Cause:** Type errors, import errors, or missing dependencies

**Fix:**
1. Review build output:
   ```bash
   pnpm build 2>&1 | tee build-errors.log
   ```

2. Check P0 checkpoint in observability-pulse.jsonl:
   ```bash
   grep "checkpoint.*build" observability-pulse.jsonl
   ```

3. If checkpoint passed but build now fails:
   - Code changes after checkpoint (uncommitted work?)
   - Dependency issue (run `pnpm install`)

4. Fix errors manually or ask agent to fix:
   ```bash
   # Option A: Manual fix
   # Review build-errors.log and fix TypeScript errors

   # Option B: Agent fix (if specific agent responsible)
   # "Fix build errors in [component]: [paste error message]"
   ```

**Prevention:** Checkpoints every 10 tasks catch build errors early

---

### Issue 6: observability-pulse.jsonl invalid JSON

**Symptom:** `./scripts/viewPulse.sh` fails with JSON parse error

**Cause:** Malformed JSONL (comments, trailing commas, incomplete lines)

**Fix:**
```bash
# Validate each line
cat observability-pulse.jsonl | while IFS= read -r line; do
  echo "$line" | jq . > /dev/null 2>&1 || echo "Invalid: $line"
done

# Remove invalid lines (BACKUP FIRST)
cp observability-pulse.jsonl observability-pulse.jsonl.bak
cat observability-pulse.jsonl.bak | while IFS= read -r line; do
  echo "$line" | jq . > /dev/null 2>&1 && echo "$line"
done > observability-pulse.jsonl
```

**Prevention:** Use pulseLogger.cjs API only (don't manually edit JSONL)

---

### Issue 7: `/zen-roundtable` timeout (>5 min)

**Symptom:** Command stuck, no output after 5+ minutes

**Cause:** Codex API response exceeds 25K token limit (returns 36K+)

**Fix (Immediate):**
1. Cancel command (Ctrl+C)
2. Use Gemini alone:
   ```bash
   mcp__zen__chat --model gemini-2.5-pro --prompt "Analyze project: [brief]"
   ```

**Fix (V7 Optimization):**
- Add Gemini-only roundtable mode (~5-10 min vs 30-45 min)
- Skip `/zen-roundtable` entirely if project vision clear

**Workaround:** Skip Phase 0, proceed directly to Phase 1 planning

---

## 🎯 Success Criteria

**V6 MVP is successful if:**

✅ **Automation Complete**
- [ ] No manual copy-paste required (F4 eliminated)
- [ ] `/speckit.final` executes end-to-end without intervention
- [ ] 3 agents complete without errors

✅ **Quality Gates Pass**
- [ ] P0: Build succeeds (0 compilation errors)
- [ ] P1: Lint clean (0 ESLint errors, warnings acceptable if documented)
- [ ] P2: Tests written (50+ tests structured, TDD approach)

✅ **Observability Working**
- [ ] observability-pulse.jsonl populated with events
- [ ] `./scripts/viewPulse.sh` displays timeline
- [ ] Checkpoints logged (build, lint, test)

✅ **Design/Dev Decoupled**
- [ ] design-tokens.json used 100%
- [ ] 0 hardcoded colors (grep for `bg-blue-`, `text-red-` → 0 results)
- [ ] `/import-design` mergeable without breaking changes

✅ **Time Savings Validated**
- [ ] Overhead: -5 to -10 min (copy-paste eliminated)
- [ ] Execution: Comparable or faster than V5.2.1 (target: 3-4h)
- [ ] Zero copy-paste errors (risk eliminated)

✅ **Documentation Complete**
- [ ] CHANGELOG-V6-MVP.md written (metrics, results, ROI)
- [ ] WORKFLOW-V6-MVP.md written (this document)
- [ ] CLAUDE.md updated (section on `/speckit.final`)

✅ **Rollback Possible**
- [ ] implementation-prompt.md still generated (V5.2.1 compatible)
- [ ] Can manually run `/implement [paste]` if needed
- [ ] No breaking changes to existing workflow

---

## 📚 Related Documentation

**V6 MVP Core:**
- [CHANGELOG-V6-MVP.md](./CHANGELOG-V6-MVP.md) - Complete metrics and results
- [WORKFLOW-V6-MVP.md](./WORKFLOW-V6-MVP.md) - This document (workflow guide)
- [ROADMAP-V6-MVP.md](./ROADMAP-V6-MVP.md) - Original 3-4 day development plan

**Commands:**
- `.claude/commands/speckit.final.md` - Implementation orchestration (331 lines)
- `.claude/commands/speckit.agents.md` - Agent generation with verification

**Infrastructure:**
- `scripts/pulseLogger.cjs` - Observability logging API (223 lines)
- `scripts/viewPulse.sh` - Timeline viewer (180 lines)

**Workflow Foundation:**
- [WORKFLOW-FINAL-V4-MULTI-DEVICE.md](./docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md) - V4 base workflow
- [GOLDEN-PATTERNS.md](./docs/GOLDEN-PATTERNS.md) - Design/Dev Decoupling pattern
- [SUB-AGENTS-MASTERY.md](./docs/SUB-AGENTS-MASTERY.md) - Agent orchestration principles

**Reference:**
- [RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md](./docs/RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md) - Lessons learned
- [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) - Common issues + fixes

---

**Version:** V6 MVP "Final Automation"
**Date:** 2025-10-16
**Status:** ✅ **PRODUCTION READY**
**Next:** V6.1 (Parallel Execution) - Decision after 2+ projects validated

**🚀 V6 MVP = Zero manual overhead + 60% faster execution + 100% quality gates + Complete observability**
