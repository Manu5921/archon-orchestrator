# WORKFLOW COMPLET V6.1.4 - Document d'Analyse Stratégique

**Date:** 2025-10-20
**Version:** V6.1.4 (Draft - améliorations juri en cours)
**Objectif:** Analyse complète pour identifier angles de développement manqués
**Audience:** ChatGPT + équipe stratégie

---

## 📊 CONTEXTE GÉNÉRAL

### Vision Stratégique

**Mission:** Produire des MVPs production-ready en 4-5h (vs 2-3 jours manuel) avec qualité professionnelle (Design/Dev Decoupling = avantage concurrentiel vs Lovable/Bolt/v0)

**Marché Cible:**
- Solopreneurs techniques (3-4 projets simultanés)
- Agences digitales (4-12 clients/mois)
- Startups early-stage (MVP → Product-Market Fit rapide)

**ROI Validé:**
- Time: -87% (4-5h vs 2-3 jours)
- Cost: €140/mois (Claude Pro + Codex + Gemini)
- Revenue Target: €80-100K/mois (8-12 projets/semaine solopreneur)
- Quality: Build ✅ Lint ✅ Tests ✅ Design Tokens 100%

### Évolution Versions

| Version | Date | Innovation Clé | Status |
|---------|------|----------------|--------|
| **V4.1** | 2025-10-08 | Multi-Device (Mac + Mobile) | ✅ Stable |
| **V5.2.1** | 2025-10-14 | Dynamic Memory V5 (agent self-doc) | ✅ Stable |
| **V6 MVP** | 2025-10-16 | Full Automation (`/speckit.final`) | ✅ Production |
| **V6.1.1** | 2025-10-17 | Spec-Kit Alignment ([P] + TDD) | ✅ Production |
| **V6.1.2** | 2025-10-17 | Tasks Format Fix (checkboxes) | ✅ Production |
| **V6.1.3** | 2025-10-17 | Observability Complete (Gate P4) | ✅ Production |
| **V6.1.4** | 2025-10-20 | 5 MUST HAVE (juri audit) | 🔄 En cours |
| **V6.2** | TBD | Parallel Execution (2× faster) | ⏳ Planifié |
| **V6.3** | TBD | Jules Integration (security parallel) | 🧪 Design complet |

---

## 🏗️ ARCHITECTURE WORKFLOW V6.1.4

### Phase 0: Multi-IA Roundtable (5-10 min) - OPTIMISÉ

**Command:**
```bash
/zen-roundtable "Brief: [project description]"
```

**Workflow Interne:**

1. **Gemini 2.5-pro Analysis (2-3 min):**
   - Problem-Value Validation
   - Business Model Viability (SaaS, Marketplace, etc.)
   - Market Analysis (TAM, competition, positioning)
   - Technical Architecture (3 options avec pros/cons/coûts)
   - Development Timeline (planning réaliste)
   - Blind Spots & Critical Risks (détection early)
   - Radical Alternatives (si pivot nécessaire)

2. **Claude Sonnet 4.5 Synthesis (2-5 min):**
   - Création `constitution.md` (business vision + principles)
   - Création `spec.md` (technical specification)
   - Création `project-memory.md` initial (Dynamic Memory V5)

**Output (8KB total):**
- `.specify/memory/constitution.md` (2-3KB)
- `specs/001-mvp/spec.md` (4-5KB)
- `project-memory.md` (1-2KB initial)

**Optimisation V6 MVP:**
- ❌ AVANT: Multi-IA (Codex + Gemini + Claude) = 30-45 min (Codex timeout 36K>25K)
- ✅ APRÈS: Gemini seul = 5-10 min (-87% time)
- **Trade-off:** Moins de perspectives (1 AI vs 3) mais specs toujours solides

**Infrastructure:**
- Zen MCP Server (bridge Claude Code ↔ Gemini CLI)
- OAuth 24h session (setup 15 min one-time)
- Fallback: Skip Phase 0 si vision claire

---

### Phase 1: Planning (30-35 min) - AUTONOMOUS

**Commands (ordre STRICT):**

```bash
# Step 1: Constitution (60-90s)
/speckit.constitution
# → Output: .specify/memory/constitution.md
# → Content: Principles, quality standards, constraints, tech stack

# Step 2: Specification (90-120s)
/speckit.specify
# → Output: specs/001-mvp/spec.md (OU .specify/memory/spec.md)
# → Content: Features, user stories, acceptance criteria

# Step 3: Project Init (30-45s)
/speckit.init
# → Output: CLAUDE.md (project instructions), project-memory.md, ci-template.yml
# → Purpose: Git workflow, memory system, CI templates

# Step 4: Design System (2-5 min) ⭐ CRITICAL - NEVER SKIP
/speckit.design
# → Output: design/design-tokens.json, design/wireframes/*.svg
# → Content: Color palette, typography, spacing, components list
# → WHY CRITICAL: Design/Dev Decoupling = competitive advantage (15 min custom brand merge)

# Step 5: Implementation Plan (3-5 min)
/speckit.plan
# → Output: specs/001-mvp/plan.md
# → Content: Architecture (layers, modules), file structure, dependencies

# Step 6: Task Breakdown (5-8 min)
/speckit.tasks
# → Output: specs/001-mvp/tasks.md (50-100 tasks)
# → Format: CHECKBOXES (- [ ] T001: Description)
# → Structure: [P] markers for parallelization, [US1] user story links
# → Phases: Setup → Foundational → User Stories → Polish (Spec-Kit enforced)

# Step 7: Agent Orchestration (3-5 min)
/speckit.agents
# → Output: ORCHESTRATION.md (agents + allocation)
# → Output: implementation-prompt.md (V5.2.1 rollback compatibility)
# → Output: observability-pulse.jsonl (empty file, ready for logging)
# → Verification: Step 6 checks 3 files created (ls -lh)
```

**Total Duration:** 30-35 minutes

**Artifacts Generated:**
- 8 essential files (constitution, spec, CLAUDE.md, design-tokens.json, plan, tasks, orchestration, pulse.jsonl)
- Design system ready (designer can work in parallel)
- Complete implementation roadmap
- Agent strategy defined (backend, frontend, testing)

**Quality Gates Planning Phase:**
- ✅ Constitution created (business alignment)
- ✅ Spec created (feature complete)
- ✅ Design tokens created (design/dev decoupling)
- ✅ Tasks created (CHECKBOXES format + [P] + [US1])
- ✅ ORCHESTRATION.md created (agents + allocation)

---

### Phase 2: GitHub Setup (2 min) - GUIDED

**Read:** `CLAUDE.md` Section 2 (GitHub Setup Process)

**Commands (EXACT sequence):**

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

**No questions, no variations** - Workflow établi, prouvé en production

**Result:** Feature branch + PR ready

---

### Phase 3: Implementation V6.1.4 (3-4h) - FULLY AUTOMATED 🆕

**Command:**
```bash
/speckit.final
# Optional: specify project path
# /speckit.final ../juri/
```

**Workflow Détaillé (8 Steps):**

#### Step 1: Project Path Detection
- Parse `$ARGUMENTS` ou use "." (current directory)
- Affiche: `📍 Project path: [path]`

#### Step 2: Prerequisites Verification (8 files avec smart path detection)

| # | File | Location(s) | Auto-Create | Generated By |
|---|------|-------------|-------------|--------------|
| 1 | ORCHESTRATION.md | Root | ❌ | `/speckit.agents` |
| 2 | constitution.md | `.specify/memory/` | ❌ | `/speckit.constitution` |
| 3 | spec.md | `specs/001-mvp/` OU `.specify/memory/` | ❌ | `/speckit.specify` |
| 4 | tasks.md | `specs/001-mvp/` | ❌ | `/speckit.tasks` |
| 5 | plan.md | `specs/001-mvp/` | ❌ | `/speckit.plan` |
| 6 | design-tokens.json | `design/` | ❌ | `/speckit.design` |
| 7 | project-memory.md | Root OU `.specify/memory/` | ❌ | `/speckit.init` |
| 8 | observability-pulse.jsonl | Root | ✅ Auto | Step 2 fallback |

**Smart Path Detection:**
- Cherche spec.md dans 2 locations (specs/001-mvp/ prioritaire)
- Cherche project-memory.md dans 2 locations (root prioritaire)
- Auto-crée observability-pulse.jsonl si manquant

**Si fichier manquant:**
```
❌ Prerequisites missing (7/8 files found)

Missing:
  - design/design-tokens.json - Run /speckit.design

Run missing commands and retry /speckit.final
```

#### Step 3: Initialize Pulse Logger

```bash
node -e "
const pulse = require('./scripts/pulseLogger.cjs');
pulse.clearPulse(); // Reset previous run
pulse.logCustom('orchestration_start', {
  workflow: 'V6.1.4',
  execution: 'sequential'
});
"
```

**Output:** `✅ Pulse logger initialized`

#### Step 4: Parse ORCHESTRATION.md

**Extraction:**
- Agents (sections `### backend-specialist`, `### frontend-specialist`, etc.)
- Tasks ranges (`**Tasks:** T001-T035`)
- Duration estimates (`**Duration:** 60 min`)
- Périmètres (`**Scope:** API implementation, Auth, Database`)

**Example Output:**
```
🔍 Parsing ORCHESTRATION.md...

Found 3 agents:
1. backend-specialist
   Tasks: T001-T035 (35 tasks)
   Duration: 60 min
   Scope: API, Auth, Database

2. frontend-specialist
   Tasks: T036-T075 (40 tasks)
   Duration: 80 min
   Scope: Components, Pages, Forms

3. testing-specialist
   Tasks: T076-T099 (24 tasks)
   Duration: 40 min
   Scope: E2E tests, Unit tests

Total: 99 tasks across 3 agents (180 min estimate)
```

#### Step 5: Load Context Files

**Reads:**
- `constitution.md` → Principles, quality standards
- `spec.md` → Features, user stories
- `tasks.md` → Full task list
- `design-tokens.json` → Design system (CSS variables ONLY)
- `project-memory.md` → Runtime decisions (WHY documented)

**Extracts:**
- Project name
- Total task count
- Tech stack summary

**Example Output:**
```
📚 Loading context...
   Project: Juri MVP (Legal research assistant)
   Tasks: 87 tasks
   Tech Stack: Next.js 15 + Supabase + RAG (pgvector)

✅ Context loaded (5 files read)
```

#### Step 6: Execute Agents Sequentially (CORE WORKFLOW) 🆕 V6.1.4

**For each agent (backend → frontend → testing):**

**6.1. Display Start:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 [1/3] backend-specialist
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Tasks: T001-T035 (35 tasks)
   Duration estimate: 60 min
   Scope: API implementation, Auth, Database
```

**6.2. Context Buffer Check (V6.1.4 - Insurance):** 🆕

```bash
# Before agent launch, estimate context size
CONTEXT_FILES=$(cat constitution.md spec.md tasks.md ORCHESTRATION.md CLAUDE.md | wc -c)
CONTEXT_TOKENS=$((CONTEXT_FILES / 4))  # Rough: 1 token ≈ 4 chars

if [ $CONTEXT_TOKENS -gt 150000 ]; then
  echo "⚠️ Context approaching 150K tokens (75% of limit)"
  echo "   Saving checkpoint bundle (insurance)..."
  /savebundle "checkpoint-before-${AGENT_NAME}-$(date +%Y%m%d-%H%M%S)"
  echo "✅ Bundle saved (recovery: 60-70% if overflow)"
fi
```

**Pourquoi:**
- Pattern Compound Engineering (AI Labs) - buffer management proactif
- Context overflow = crash = ALL work lost (0% recovery without bundle)
- Bundle = insurance (75-85% recovery in 15 min if overflow)
- Threshold: 150K tokens = 75% of 200K limit (conservative)

**Trade-off:**
- ✅ Pros: Insurance against catastrophic loss (2h45 work → 15 min recovery)
- ❌ Cons: +2-3 min overhead per agent (~10 min total)
- **Decision:** +10 min overhead acceptable vs 2h45 total loss risk

**6.3. Log Start Event:**
```bash
node scripts/pulseLogger.cjs start backend-specialist '{
  "tasks": "T001-T035",
  "duration_estimate": "60 min",
  "scope": "API implementation, Auth, Database"
}'
```

**6.4. Launch Agent (Task Tool):**

```javascript
// Délègue au Task tool avec full context:
Task({
  subagent_type: "backend-specialist",
  description: "Implement backend (T001-T035)",
  prompt: `
MISSION: Implement backend (T001-T035)

CONTEXT:
${ORCHESTRATION.backend_instructions}

CONSTITUTION:
${constitution_md}

SPEC:
${spec_md}

TASKS (T001-T035):
${tasks_md_filtered}

DESIGN TOKENS (USE ONLY CSS VARIABLES):
${design_tokens_json}

PROJECT MEMORY (READ DECISIONS):
${project_memory_md}

MANDATORY:
1. Progress Tracking (BLOCKER):
   - Edit tasks.md after EACH task completion: "- [ ] T001" → "- [x] T001"
   - Verify edit succeeded: grep "^\- \[x\] T001" tasks.md
   - If verification fails: RETRY edit before continuing

2. Checkpoints every 10 tasks (5 gates):

   Gate P0: Build Check (BLOCKER - exit 1 if fails)
   - Run: pnpm build
   - If error: Fix immediately, re-run, MUST pass
   - Purpose: Code must compile

   Gate P1: Lint (BLOCKER - MCP tool)
   - Run: mcp__eslint__lint-files [files-modified]
   - If error: Fix TypeScript/ESLint errors
   - Purpose: Type safety, no 'any' except justified

   Gate P2: Context7 (IF new library)
   - IF added new library: mcp__context7__get-library-docs [library-name]
   - Read docs, follow best practices
   - Purpose: Anti-hallucination, correct usage

   Gate P3: Memory (VERIFICATION)
   - IF significant decision: /update-memory
   - Document: Decision, Reason, Trade-offs, Alternatives, Validation
   - Purpose: WHY preserved (not just WHAT)

   Gate P4: Observability (TIMELINE) 🆕 V6.1.3
   - Log checkpoint: node scripts/pulseLogger.cjs checkpoint [gate] [pass|fail] '{"details":"..."}'
   - Examples:
     - node scripts/pulseLogger.cjs checkpoint build pass '{"exit_code":0,"duration_ms":2340}'
     - node scripts/pulseLogger.cjs checkpoint lint pass '{"warnings":3,"errors":0}'
     - node scripts/pulseLogger.cjs checkpoint context7 skip '{"reason":"no new libraries"}'
     - node scripts/pulseLogger.cjs checkpoint memory pass '{"decisions_documented":2}'
   - Purpose: Timeline tracking, debugging aid, agent coordination

   🆕 V6.1.4: Observability Fallback
   - IF pulseLogger.cjs unavailable (check: [ ! -f "scripts/pulseLogger.cjs" ])
   - THEN use simple JSONL append:
     echo '{"timestamp":"'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'","event":"checkpoint","gate":"build","status":"pass"}' >> observability-pulse.jsonl
   - Purpose: SOME timeline better than 0 (grep-friendly)

3. Agent Handoff Protocol (COORDINATION) 🆕 V6.1.4:
   - At agent completion (after validation passed):
     cat > /tmp/agent-handoff-backend-specialist.json <<EOF
{
  "agent": "backend-specialist",
  "status": "completed",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "tasks_allocated": "T001-T035",
  "tasks_completed": ${TASKS_COMPLETED},
  "files_created": ${FILES_COUNT},
  "build_status": "pass",
  "lint_status": "pass",
  "next_agent": "frontend-specialist"
}
EOF
   - Purpose: Agent B reads handoff → knows Agent A state
   - Benefit: Prevents "executing in silo" (juri audit issue)

4. Validation POST (STRICT - BLOCKER) 🆕 V6.1.4:
   - AFTER all tasks completed:
     TASKS_COMPLETED=$(grep -c "^\- \[x\]" tasks.md)
     if [ "$TASKS_COMPLETED" -eq 0 ]; then
       echo "❌ ERROR: No tasks marked completed in tasks.md"
       echo "   Agent executed but failed to track progress"
       echo "   REQUIRED: Edit tasks.md to mark completed tasks"
       exit 1
     fi
   - Purpose: Enforce workflow compliance (juri audit = 0 tasks checked)

EXECUTION STRATEGY (Spec-Kit V5):
- [P] markers → Execute T012[P] + T013[P] simultaneously (ONE message multiple tool calls)
- TDD workflow → Tests BEFORE implementation (contract tests → endpoints)
- Phase order → Setup → Foundational → User Stories → Polish (respect sequence)

QUALITY STANDARDS:
- E1: Architecture-First (ADR documentation)
- E2: Types Anti-Hallucination (TypeScript strict mode)
- E3: Tests Integration First (TDD strict)
- E8: Quality Gates (P0-P4 enforced)
- E11: Error Escalation (3-strike rule + rollback)
- E16: Zero Trust (proofs required - build logs, test results)

DESIGN TOKENS USAGE (MANDATORY):
- ✅ USE: bg-primary-500, text-neutral-900, font-heading
- ❌ NEVER: bg-blue-600, text-white, font-sans (hardcoded = brittle)
- WHY: Design/Dev Decoupling = 15 min custom brand merge (competitive advantage)

START: T001 (do NOT skip tasks)
END: T035 (checkpoint after T010, T020, T030)
  `
});
```

**6.5. Agent Execution (Real Work - Model: Haiku 4.5):**

**Haiku 4.5 Benefits:**
- Speed: 4-5× faster than Sonnet 4.5 (2h45 vs 6-7h sur AdProof)
- Cost: -80% vs Sonnet
- Quality: Build ✅ Lint ✅ Tests ✅ (validation 100% sur AdProof)
- Context: 200K tokens (sufficient for allocated tasks)

**Agent Actions:**
- Reads assigned tasks (T001-T035 filtered from tasks.md)
- Implements features following quality gates
- Uses design tokens (CSS variables ONLY, 0 hardcoded colors)
- Runs checkpoints every 10 tasks:
  - T010: Gates P0+P1+P2+P3+P4
  - T020: Gates P0+P1+P2+P3+P4
  - T030: Gates P0+P1+P2+P3+P4
- Updates task checkboxes (sed commands: `- [ ] T001` → `- [x] T001`)
- Documents decisions in project-memory.md (Section 7: Runtime Decisions)
- Logs events to observability-pulse.jsonl (or fallback JSONL append)

**6.6. Display Completion:**
```
   ✅ Completed (55m 30s)
```

**6.7. Log End Event:**
```bash
node scripts/pulseLogger.cjs end backend-specialist '{
  "duration_s": 3330,
  "tasks_completed": 35,
  "files_created": 23,
  "build_status": "pass",
  "lint_status": "pass"
}'
```

**6.8. Log Checkpoints Summary:**
```bash
node scripts/pulseLogger.cjs checkpoint build pass '{"agent":"backend-specialist","errors":0}'
node scripts/pulseLogger.cjs checkpoint lint pass '{"agent":"backend-specialist","warnings":4}'
node scripts/pulseLogger.cjs checkpoint test pass '{"agent":"backend-specialist","tests_written":21}'
```

**6.9. Display Checkpoints:**
```
   Checkpoints: build ✅ | lint ✅ (4 warnings) | test ✅
```

**6.10. Validation POST (BLOCKER) 🆕 V6.1.4:**

```bash
TASKS_COMPLETED=$(grep -c "^\- \[x\]" tasks.md)

if [ "$TASKS_COMPLETED" -eq 0 ]; then
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "❌ VALIDATION FAILED: backend-specialist"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "ERROR: No tasks marked completed in tasks.md"
  echo ""
  echo "Agent executed but FAILED to track progress."
  echo "This indicates agent did not follow workflow."
  echo ""
  echo "REQUIRED ACTIONS:"
  echo "1. Review tasks.md manually"
  echo "2. Mark completed tasks: - [ ] T001 → - [x] T001"
  echo "3. Re-run agent OR continue with next agent"
  echo ""
  exit 1
fi

echo "✅ Tasks completed: $TASKS_COMPLETED"
```

**Repeat Steps 6.1-6.10 for:** frontend-specialist, testing-specialist

**Execution Mode:**
- **V6 MVP:** Sequential (backend → frontend → testing) - safe, predictable
- **V6.1 Future:** Parallel (2× faster) - more complex, needs validation

#### Step 7: Final Validation (STRICT)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 FINAL VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Running final checks...

1. Build Check (P0 BLOCKER):
   $ pnpm build
   ✅ PASS (0 errors, compiled successfully)

2. Lint Check (P1 BLOCKER):
   $ pnpm lint
   ✅ PASS (4 warnings documented in project-memory.md)
   Warnings:
   - src/lib/auth.ts:42 - @typescript-eslint/no-explicit-any
   - src/lib/auth.ts:58 - @typescript-eslint/no-explicit-any
   (Justified: External API typing unavailable)

3. Test Check (P2 READY):
   $ pnpm test
   ✅ READY (50+ tests written, TDD approach)
   Tests: 23 passed, 27 pending (RED state until implementation complete)

4. Design Tokens (P2 VERIFICATION):
   $ grep -r "bg-blue-\|text-red-\|bg-slate-" src/
   ✅ PASS (0 hardcoded colors found, 100% variables)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Final validation complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
  ORCHESTRATION COMPLETE - V6.1.4
═══════════════════════════════════════════════════

📊 SUMMARY:
   Total Events:     22
   Agents Executed:  3
   Errors:           0
   Checkpoints:      12 pass | 0 fail | 3 skip
   Duration:         2h 45m 30s (9930s total)

📈 BREAKDOWN:
   backend-specialist:   55m 30s (T001-T035, 23 files, build ✅ lint ✅)
   frontend-specialist:  78m 45s (T036-T075, 31 files, build ✅ lint ✅)
   testing-specialist:   41m 15s (T076-T099, 21 files, tests ✅)

📅 VIEW TIMELINE:
   ./scripts/viewPulse.sh

📝 LOGS:
   observability-pulse.jsonl (22 events, 5.2 KB)

📁 FILES MODIFIED:
   Git status: 157 files changed, 12,342 insertions(+)

✅ NO ERRORS - Implementation successful!

🎯 NEXT STEPS:
   1. View timeline: ./scripts/viewPulse.sh
   2. Review changes: git status && git diff
   3. Verify build: pnpm build
   4. Run tests: pnpm test
   5. Commit + Push: git add . && git commit && git push

═══════════════════════════════════════════════════

✅ /speckit.final COMPLETE

**Workflow:** Sequential Execution (V6.1.4)
**Agents:** 3 executed (backend, frontend, testing)
**Duration:** 2h 45m 30s (-60% vs baseline)
**Status:** SUCCESS ✅

**Improvements Applied (V6.1.4):**
✅ Gates bloquants (exit 1 if 0 tasks completed)
✅ Validation POST stricte (enforcement MANDATORY)
✅ Observability fallback (simple JSONL if pulseLogger absent)
✅ Agent handoff protocol (JSON coordination /tmp/)
✅ Context buffer management (auto-save before overflow)

**Time Saved vs V5.2.1:**
- Overhead: -5 to -10 min (automation) ✅
- Execution: -60% (Haiku 4.5 optimization) ✅
- Zero Copy-Paste Errors: Eliminated manual step ✅

🚀 V6.1.4 - Workflow Automation + Enforcement Complete!
```

**Total Duration Phase 3:** 2h45-3h (validated AdProof.ai, 99 tasks)

---

### Phase 4: Verification (5 min) - LOCAL

**Commands:**

```bash
# Step 1: View execution timeline
./scripts/viewPulse.sh
# → Color-coded timeline, checkpoint status, duration, errors
# → Example output:
#   2025-10-20 14:23:05 🚀 backend-specialist started (35 tasks)
#   2025-10-20 14:35:12 ✅ Checkpoint build: PASS (2340ms)
#   2025-10-20 15:10:48 ✅ backend-specialist completed (450s)

# Step 2: Verify build passes
pnpm build
# → Expected: Build succeeds with 0 errors
# → If fails: Review error logs, P0 checkpoint should have caught this

# Step 3: Verify lint status
pnpm lint
# → Expected: 0 errors (warnings acceptable if documented in project-memory.md)
# → If errors: Review mcp__eslint__lint-files output

# Step 4: Run tests
pnpm test
# → Expected: Tests pass (or TDD RED state with tests written)
# → Verify: Test coverage for core flows

# Step 5: Review git changes
git status
git diff --stat
# → Expected: 150+ files changed, 12K+ lines
# → Verify: No unexpected changes, design tokens used
```

**Output Files to Review:**
- `observability-pulse.jsonl` - Event log (1 line = 1 JSON event)
- `project-memory.md` - Runtime decisions documented (Section 7)
- `specs/001-mvp/tasks.md` - Task checkboxes updated (should show `- [x]`)

**Total Duration:** 5 minutes

---

### Phase 5: Commit + Push (2 min) - LOCAL

**Commands:**

```bash
# Step 1: Stage all changes
git add .

# Step 2: Commit with comprehensive message
git commit -m "feat: implement MVP (V6.1.4 automated)

Backend (backend-specialist, 55m):
- API endpoints (4) with RLS
- Supabase tables (3) with audit logs
- LLM orchestration (Claude 3.5 Sonnet + GPT-4o-mini)
- Files: 23 created

Frontend (frontend-specialist, 78m):
- Components (15+) with shadcn/ui
- Pages (6) with Next.js 15 app router
- Design tokens (100% - 0 hardcoded colors)
- Files: 31 created

Testing (testing-specialist, 41m):
- Tests written (50+) with TDD approach
- Test files (21) structured by feature
- Files: 21 created

Quality Gates:
- ✅ Build: PASS (0 errors)
- ✅ Lint: PASS (4 warnings documented)
- ✅ Tests: READY (TDD RED state)
- ✅ Design Tokens: 100% (0 hardcoded)

Observability:
- Timeline logged (observability-pulse.jsonl, 22 events)
- Runtime decisions documented (project-memory.md, 8 entries)
- Agent handoff protocol (coordination files)

V6.1.4 Improvements Applied:
- Gates bloquants (0 tasks = exit 1)
- Validation POST stricte (enforcement)
- Observability fallback (simple JSONL)
- Agent handoff protocol (JSON coordination)
- Context buffer management (auto-save)

Duration: 2h45 (3 agents sequential)
Model: Haiku 4.5 (sub-agents)

🤖 Generated with Claude Code (V6.1.4)
Co-Authored-By: Claude <noreply@anthropic.com>"

# Step 3: Push changes
git push
```

**Result:** Changes pushed to feature branch, PR updated

---

### Phase 6: Design Import (15 min) - OPTIONAL ⭐ COMPETITIVE ADVANTAGE

**When:** Designer completes custom brand (in parallel with Phase 3)

**Command:**
```bash
/import-design custom-tokens.json
```

**What Happens:**

1. **Read custom-tokens.json** (designer's brand)
   ```json
   {
     "colors": {
       "primary": {
         "50": "#f5f3ff",
         "500": "#8b5cf6",  // Violet (vs blue placeholder)
         "900": "#4c1d95"
       }
     },
     "typography": {
       "fontFamily": {
         "heading": "Montserrat",  // Custom font (vs Inter placeholder)
         "body": "Open Sans"
       }
     }
   }
   ```

2. **Merge with design/design-tokens.json** (preserves structure)

3. **Update CSS variables** in global.css
   ```css
   :root {
     --color-primary-500: #8b5cf6;  /* Updated from #3b82f6 */
     --font-heading: 'Montserrat', sans-serif;  /* Updated from Inter */
   }
   ```

4. **Verify 0 breaking changes** (all components use variables)
   ```bash
   # Search for hardcoded values
   grep -r "bg-blue-\|text-blue-\|#3b82f6" src/
   # Expected: 0 results (100% variables used)
   ```

**Result:**
- UI transforms from placeholder brand (blue) → custom brand (violet)
- 0 code changes required (CSS variables abstraction)
- 0 component refactoring (design/dev decoupled)

**ROI:**
- **Time:** 15 min merge vs 1-2 days refactor = **-95%**
- **Risk:** 0 breaking changes vs 20-30% components touched = **production-safe**
- **Quality:** Custom brand vs generic = **differentiation**

**Competitive Advantage:**

| AI Tool | Design | Result |
|---------|--------|--------|
| **Lovable/Bolt/v0** | Generic blue template | Commodity |
| **Archon Workflow** | Custom client brand | Professional |

**Client Perception:** "This looks like a real product, not a template" = **deal closer**

**Total Duration:** 15 minutes (if custom design ready)

**Skip if:** Using placeholder design for MVP launch

---

### Phase 7: Review + Merge (15 min) - MAC OR MOBILE

**On Mac (terminal):**

```bash
# Step 1: View PR diff (optional)
gh pr view --web

# Step 2: Review Jules Security report (optional, manual trigger) 🆕 V6.3
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

## 📊 MÉTRIQUES VALIDÉES

### AdProof.ai MVP (V6 MVP - 2025-10-16)

**Projet:** SaaS plagiarism detection (99 tasks, 3 agents)

| Métrique | V5.2.1 (Estimation) | V6 MVP (Réel) | V6.1.4 (Prévu) |
|----------|---------------------|---------------|----------------|
| **Planning** | 30-35 min | 30 min | 30 min |
| **Implementation** | 6-7h | 2h45 | 2h45-3h |
| **Overhead manuel** | 5-10 min | 0 min | 0 min |
| **Build status** | N/A | ✅ PASS | ✅ PASS (enforced) |
| **Lint status** | N/A | ✅ PASS | ✅ PASS (enforced) |
| **Tests écrits** | N/A | 50+ tests | 50+ tests (enforced) |
| **Design tokens** | N/A | 100% | 100% (enforced) |
| **Tasks tracking** | N/A | Manual | ✅ MANDATORY (exit 1) |
| **Observability** | 0 | Timeline | ✅ Fallback JSONL |
| **Agent coordination** | 0 | Sequential | ✅ Handoff protocol |

**Time Savings:**
- Overhead: -5 to -10 min (100% automation)
- Execution: -60% (2h45 vs 6-7h - Haiku 4.5 optimization)
- Risk: 0 copy-paste errors (manual step eliminated)

**Quality:**
- Build: ✅ PASS (0 errors)
- Lint: ✅ PASS (4 warnings documented)
- Tests: ✅ READY (50+ tests, TDD approach)
- Design Tokens: ✅ 100% (0 hardcoded colors)

### test1710 Project (V6.1.2 - 2025-10-17)

**Projet:** Test synthetic (GLM-4.6 in Terminal B)

**Token Savings (GLM-4.6 vs Sonnet 4.5):**

| Phase | Sonnet 4.5 | GLM-4.6 | Savings |
|-------|-----------|---------|---------|
| Planning | 50K tokens | 50K tokens | 0% (keep Sonnet quality) |
| Implementation | 450K tokens | 100K tokens | **-77%** |
| **Total** | 500K tokens | 150K tokens | **-70%** |

**Weekly Impact:**
- Sonnet 4.5: 4-5 projects/week (20% limit/project)
- GLM-4.6: 10-12 projects/week (5% limit/project)
- **Capacity:** +100% (double throughput)

**Quality:**
- project-memory.md: 4 decisions documented ✅
- observability-pulse.jsonl: EMPTY ❌ → Fixed V6.1.3

### Juri MVP (V6.1.4 - 2025-10-20)

**Projet:** Legal research assistant (87 tasks, 3 agents, GLM-4.6)

**Code Quality:** ✅ EXCELLENT
- 42 fichiers créés (backend, frontend, tests)
- 9 services backend (RAG: chunking, embedding, retrieval)
- 21 composants frontend (custom + shadcn/ui)
- 10 tests (4 E2E, 6 unit)
- 3 migrations DB (schema, pgvector, RLS)

**Workflow Compliance:** ❌ 0/6 (BEFORE V6.1.4)
- ❌ 0 tâches cochées dans tasks.md (0/87)
- ❌ 0 runtime decisions documentées
- ❌ 0 événements observability-pulse.jsonl
- ❌ 26 fichiers non commités (untracked)
- ❌ Pas de parallélisation réelle ([P] ignoré)
- ❌ Pas de coordination agents (silo execution)

**Convergence Analysis:**
- Claude Sonnet 4.5 diagnostic ✅
- GLM 4.6 analysis ✅
- **100% alignment** (6/6 issues identiques)

**Root Causes (Identified):**
1. Instructions passives ("SHOULD track") → Ignored
2. No enforcement mechanisms → 0 compliance
3. No validation gates → Silent failures
4. No agent coordination → Silo execution
5. No observability fallback → 0 logging if pulseLogger fails
6. Agent mental model: "Mission = code" not "Mission = workflow"

**V6.1.4 Fixes Applied:**
1. Gates bloquants (exit 1 enforcement)
2. Validation POST stricte (BLOCKER after agent)
3. Observability fallback (simple JSONL append)
4. Agent handoff protocol (JSON coordination)
5. Context buffer management (auto-save insurance)

**Expected V6.1.4 Results:** 100% compliance (validation pending)

---

## 🏗️ ARCHITECTURE TECHNIQUE

### Infrastructure Components

**1. Spec-Kit Framework**
- **Source:** https://github.com/github/spec-kit.git
- **Purpose:** Implementation task orchestration (official GitHub pattern)
- **Commands:** `/speckit.constitution`, `/speckit.specify`, `/speckit.design`, etc.
- **Templates:** task format, checklist structure, execution rules

**2. Zen MCP Server**
- **Source:** https://github.com/BeehiveInnovations/zen-mcp-server.git
- **Purpose:** Bridge Claude Code ↔ Gemini CLI (OAuth session)
- **Tools:** `mcp__zen__chat`, `mcp__zen__thinkdeep`, `mcp__zen__consensus`
- **Setup:** 15 min one-time (OAuth 24h refresh)

**3. Context7 MCP**
- **Purpose:** Up-to-date library documentation (anti-hallucination)
- **Tools:** `mcp__context7__resolve-library-id`, `mcp__context7__get-library-docs`
- **Usage:** Gate P2 (IF new library added)

**4. ESLint MCP**
- **Purpose:** Code quality enforcement (TypeScript strict mode)
- **Tool:** `mcp__eslint__lint-files`
- **Usage:** Gate P1 (BLOCKER - no 'any' except justified)

**5. pulseLogger.cjs**
- **Location:** `scripts/pulseLogger.cjs` (223 lines)
- **Purpose:** Observability timeline logging
- **API:**
  - `logStart(agentId, context)` - Agent startup
  - `logEnd(agentId, result)` - Agent completion + metrics
  - `logCheckpoint(gate, status, details)` - Quality gate results
  - `logError(agentId, error)` - Error logging
  - `getSummary()` - Timeline summary
- **Output:** `observability-pulse.jsonl` (JSONL format, append-only)

**6. viewPulse.sh**
- **Location:** `scripts/viewPulse.sh` (180 lines)
- **Purpose:** Timeline viewer (color-coded CLI)
- **Features:** Color-coded events, summary stats, error highlighting, exit code 1 if errors

**7. contextBundler.cjs**
- **Location:** `scripts/contextBundler.cjs`
- **Purpose:** Session state preservation (disaster recovery)
- **Pattern:** Dev Dan - Context Engineering ADV2
- **Commands:** `/savebundle`, `/loadbundle`
- **Recovery:** 60-70% context restored in 15 min if overflow

---

### Design Patterns Applied

**1. Design/Dev Decoupling (COMPETITIVE ADVANTAGE)**

**Problem AI Tools (Lovable/Bolt/v0):**
- Generate functional code BUT generic design (blue buttons, Inter font)
- Design coupled with code → customization = 1-2 days refactor nightmare
- Hardcoded `className="bg-blue-600"` → brittle, unmaintainable

**Archon Solution:**
- **Day 1:** `/speckit.design` → placeholder tokens (blue #3B82F6)
- **Day 2-3:** Claude develops using CSS variables ONLY (`bg-primary-500`)
- **Day 4:** Human designs custom brand in parallel (violet #8B5CF6)
- **Day 4 (15 min):** `/import-design custom-tokens.json` → UI transforms

**ROI:**
- Time: 15 min merge vs 1-2 days refactor = **-95%**
- Risk: 0 breaking changes vs 20-30% components touched = **production-safe**
- Quality: Custom brand vs generic = **differentiation**

**Client Perception:** "This looks like a real product, not a template" = **deal closer**

**2. Dynamic Memory V5 (Agent Self-Documentation)**

**Philosophy:** "Code shows WHAT. Comments show HOW. **Memory shows WHY.**"

**File:** `project-memory.md` (10 sections)

**Sections:**
1. Project Identity (vision, client context, timeline)
2. Architectural Decisions (tech stack, architecture pattern, auth strategy)
3. Design System (color palette, typography, decoupling status)
4. Patterns Applied (Design Decoupling, Zen MCP, Sub-Agents, Dynamic Memory)
5. Compliance & Security (RGPD/HIPAA, security measures, Jules scan)
6. Critical Context (constraints, risks, stakeholders, KPIs)
7. 🆕 **Runtime Decisions** (agent-writable - WHY behind implementation)
8. Issues Encountered (root cause, solution, prevention)
9. Session Notes (chronological project history)
10. External References (constitution, spec, patterns docs)

**When Agents Call `/update-memory`:**

✅ **YES (significant decisions):**
- Architecture decision (database index strategy, state management, deployment)
- Performance optimization (caching layer, query optimization, code splitting)
- Security measure (rate limiting, auth flow, encryption)
- Trade-off accepted (simplicity over performance, technical debt documented)
- Alternative rejected (considered option A, chose option B with WHY)

❌ **NO (trivial changes):**
- Typo fixes, variable renames
- Implementation details already in code comments
- Decisions already documented in ADR section
- Work-in-progress (wait until finalized)

**Template Quality:**
- WHY documented (not just WHAT)
- Trade-offs explicit (pros AND cons)
- Alternatives considered (not just default choice)
- Validation concrete (numbers, tests, evidence)
- Code snippet included (SQL DDL, TypeScript, config)
- Quantified when possible (-80% query time, +10% disk space)

**ROI:**
- Onboarding: -90% time (2-3 hours vs 2-3 days)
- Refactoring: -75% research (read memory vs redoing benchmarks)
- Audit: -95% compliance effort (5 min vs 1-2 days)
- Intentionality: WHY preserved (enables intelligent refactoring)

**3. Context Bundles (Disaster Recovery)**

**Problem:** Agent works 2h+ → context overflow → crash → **ALL work lost** (0% recovery)

**Solution:** Automatic logging → Bundle saved → `/loadbundle` → 60-70% recovery in 15 min

**What Bundles Save:**
- Files Read (paths + line ranges)
- Edits Made (files modified + descriptions)
- Commands Executed (bash/git/npm)
- Decisions Documented (key architectural choices)
- Current Understanding (agent's mental model)
- MCP Tools Used (Context7, ESLint, Zen calls)
- Checkpoints Passed (quality gates executed)

**Commands:**
```bash
# Save bundle (auto-named)
/savebundle

# Save bundle (named)
/savebundle backend-specialist-auth-implementation

# Load bundle (after overflow)
/loadbundle .agents/context-bundles/2025-10-18_15-30_session.md
```

**Automatic Integration (V6.1.4):**
- Context buffer check before each agent launch
- Threshold: 150K tokens (75% of 200K limit)
- Auto-save: `.agents/context-bundles/checkpoint-before-{agent}-{timestamp}.md`
- Non-blocking: Agent continues (insurance only)

**ROI:**
- Recovery: -70% time (15 min vs 2h45 total loss)
- Insurance: 2-3 min overhead vs 2h45 catastrophic loss

**4. Sub-Agents Orchestration**

**Essential Agents (generated automatically):**
1. **backend-specialist** - API + Supabase + Auth
2. **frontend-specialist** - React + shadcn/ui + Forms (uses design-tokens.json)
3. **design-specialist** - Generates design-tokens.json + wireframes SVG
4. **testing-specialist** - E2E tests (Playwright/Vitest/Jest) - ALWAYS included

**Optional (project-dependent):**
- **devops-specialist** - If deploy/CI needed

**NOT needed (integrated):**
- ❌ security-specialist (in backend)
- ❌ data-specialist (in backend)
- ❌ scout-specialist (200K+ context sufficient)

**Execution Strategy:**
- **V6 MVP/V6.1.4:** Sequential (backend → frontend → testing) - safe, predictable
- **V6.2 Future:** Parallel (2× faster) - more complex, coordination critical

**Agent Handoff Protocol (V6.1.4):**
```json
// /tmp/agent-handoff-backend-specialist.json
{
  "agent": "backend-specialist",
  "status": "completed",
  "timestamp": "2025-10-20T15:10:48Z",
  "tasks_allocated": "T001-T035",
  "tasks_completed": 35,
  "files_created": 23,
  "build_status": "pass",
  "lint_status": "pass",
  "next_agent": "frontend-specialist"
}
```

**Purpose:** Agent B reads handoff → knows Agent A state (prevents silo execution)

---

## 🔮 FUTURES PLANIFIÉES

### V6.2: Parallel Execution (2× faster)

**Current (V6.1.4):** backend → frontend → testing (sequential, 2h45)

**V6.2 Target:** backend || frontend || testing (parallel, ~1h20-1h30)

**Benefits:**
- Time: -50% execution (2h45 → 1h20)
- Throughput: 2× projects/day

**Blockers (identified):**
- Conflits filesystem potentiels (2 agents edit same file)
- Coordination agents complexe (backend finish → frontend can start certain tasks)
- Debugging plus difficile (logs interleaved)
- Agent handoff protocol must be real-time (not post-completion)

**Pre-requisites:**
- V6.1.4 validated on 3+ real projects (enforcement working)
- Agent handoff protocol extended (real-time coordination)
- Filesystem locking strategy designed
- Error recovery strategy defined (if 1 agent fails mid-execution)

**Decision GO/NO-GO:** After 3+ projects validated with V6.1.4

### V6.3: Jules Integration (Security in Parallel) 🆕

**Concept:** Jules (Google Gemini 2.5 Pro coding agent) runs security audit asynchronously during Phase 3 implementation.

**Architecture:**

```
PHASE 3: Implementation (Mac LOCAL)
│
├── Main Session (Claude Code)
│   ├── /speckit.final (3 agents sequential)
│   ├── Quality Gates P0-P4 enforced
│   └── Checkpoints every 10 tasks
│
└── Parallel Session (Jules)
    ├── Trigger: PR created (webhook OR manual)
    ├── Duration: 30-60 min (async, 0 additional time)
    ├── Output: SECURITY_REVIEW.md, patches/, tests/, workflows/
    └── Apply: New Phase 5A (30 min)
```

**Workflow V6.3 (Hybrid Sequential + Parallel):**

**Phase 1-2:** Planning + GitHub Setup (32 min)
- UNCHANGED (Claude Code seul)

**Phase 3:** Implementation (2h45) - PARALLEL ⭐
- **Main track:** Claude Code `/speckit.final` (3 agents sequential)
- **Parallel track:** Jules security audit (async, FREE tier 15 tasks/day)

**Phase 4-5:** Verification + Commit (7 min)
- UNCHANGED (Claude Code seul)

**Phase 5A (NEW):** Apply Jules Results (30 min)
- Triage findings (5 min)
- Apply patches CRITIQUES (15 min)
- Integrate tests (10 min)
- Setup pre-commit hooks (5 min)
- Verify security.yml CI (5 min)

**Phase 6-7:** Design Import + Review + Merge (30 min)
- UNCHANGED

**Total Duration:** 4h34 (vs 4h04 V6.1.4) = **+30 min security audit** (vs +0 min if async perfect)

**Jules Capabilities (Gemini 2.5 Pro):**
- Static analysis (ESLint, TypeScript, Semgrep)
- Dependency vulnerabilities (npm audit, OWASP)
- Security patterns (XSS, CSRF, SQL injection)
- Code quality (complexity, duplication, maintainability)
- Generate fixes (patches/, tests/, .pre-commit-config.yaml)
- CI/CD integration (.github/workflows/security.yml)

**Free Tier (jules.google.com):**
- 15 tasks/day
- 3 concurrent projects
- GitHub integration
- Full scan + patches + tests

**Integration Patterns:**

**1. Manual (MVP - Test Now):**
```bash
# After git push (Phase 5)
# Go to https://jules.google.com/session
# Paste: "Analyze [repo-url] for security issues. Generate SECURITY_REVIEW.md + patches + tests."
# Wait 30-60 min
# Apply results manually (Phase 5A)
```

**2. Semi-Auto (V6.3.1):**
```bash
# In /speckit.final after git push (Step 5)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 OPTIONAL: Launch Jules security audit (async)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Open: https://jules.google.com/session"
echo "2. Paste: 'Analyze $(gh repo view --json url -q .url) for security'"
echo "3. Wait 30-60 min (async, continue local work)"
echo "4. Apply results: See WORKFLOW-V6.3.md Phase 5A"
echo ""
echo "Skip if: No security requirements (prototype/demo)"
echo ""
```

**3. Full-Auto (V6.3.2 - Future):**
```bash
# GitHub Actions workflow (.github/workflows/jules-security.yml)
name: Jules Security Audit
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trigger Jules
        run: |
          curl -X POST https://jules.google.com/api/analyze \
            -H "Authorization: Bearer $JULES_API_KEY" \
            -d '{"repo": "${{ github.repository }}", "branch": "${{ github.head_ref }}"}'
      - name: Wait for results
        run: sleep 1800  # 30 min
      - name: Create PR comment
        run: gh pr comment --body "🔒 Jules security audit complete. View: [SECURITY_REVIEW.md](...)"
```

**Benefits V6.3:**
- **0 time overhead** (async execution during Phase 3)
- **Free security audit** (vs €300-500/project manual audit)
- **Automated fixes** (patches/ generated, apply in 15 min)
- **CI/CD ready** (security.yml workflow included)

**Trade-offs:**
- **+30 min Phase 5A** (apply Jules results)
- **Manual coordination** (check Jules status, apply patches)
- **Experimental** (Jules beta, API not stable)

**Decision GO/NO-GO:** After juri file recovery + test on 1 real project

**Status:** Design complet ✅ | Implementation 0% | Validation 0%

---

## 🎯 POINTS D'ATTENTION & FRICTIONS CONNUES

### 1. Agent Non-Compliance (CRITIQUE - Fixed V6.1.4)

**Symptôme:** Agent exécute code excellent MAIS ignore workflow (0 tasks cochées, 0 observability)

**Exemple:** Juri audit (GLM-4.6) - 42 fichiers créés ✅ | 0/6 compliance ❌

**Root Cause Identifiée:**
- Instructions passives ("SHOULD track") → Agent les ignore
- Agent mental model: "Mission = générer code" NOT "Mission = suivre workflow"
- Aucun enforcement → Pas de conséquence si non-respect

**Fix V6.1.4 (5 améliorations):**
1. **Gates bloquants** - MANDATORY progress tracking (exit 1 if 0 tasks)
2. **Validation POST stricte** - Blocker after each agent (force compliance)
3. **Observability fallback** - Simple JSONL append if pulseLogger absent
4. **Agent handoff protocol** - JSON coordination (prevents silo execution)
5. **Context buffer management** - Auto-save before overflow (insurance)

**Validation:** Pending (test on next real project)

### 2. Spec-Kit Location Inconsistency

**Symptôme:** `spec.md` dans `specs/001-mvp/` OU `.specify/memory/` (incohérent)

**Impact:** `/speckit.final` prerequisites fail silently

**Fix V6 MVP:** Smart path detection (cherche 2 locations, use premier trouvé)

**Status:** ✅ Résolu (validated AdProof.ai)

### 3. observability-pulse.jsonl Empty (Fixed V6.1.3)

**Symptôme:** File existe MAIS 0 events logged (agents n'appellent pas pulseLogger)

**Root Cause:** Gate P4 not documented in agent prompt (optional vs mandatory unclear)

**Fix V6.1.3:** Gate P4 Observability explicit in prompt + CLI interface pulseLogger.cjs

**Fix V6.1.4:** Fallback JSONL append if pulseLogger.cjs absent (degraded tracking > 0)

**Status:** ✅ Résolu + fallback (resilient)

### 4. Context Overflow Risk (Mitigated V6.1.4)

**Symptôme:** Agent session 2h+ → context approche 200K tokens → crash → ALL work lost

**Exemple:** AdProof.ai (99 tasks) = 195K tokens à la fin (98% full)

**Fix V6.1.4:** Context buffer check before each agent launch
- Threshold: 150K tokens (75% of limit)
- Action: Auto-save bundle (insurance)
- Non-blocking: Agent continues (2-3 min overhead acceptable vs 2h45 total loss)

**Pattern Source:** Dev Dan - Compound Engineering (AI Labs) - Context management proactif

**Status:** ✅ Implemented (validation pending)

### 5. Jules File Recovery Issue (En cours)

**Symptôme:** Jules génère fichiers (SECURITY_REVIEW.md, patches/, tests/) MAIS stuck en cloud VM

**Impact:** Fichiers pas dans local repo OU GitHub (pas pushés)

**Investigation:** En cours (session Jules séparée)

**Options:**
1. Ask Jules to create PR (preferred)
2. Download files from Jules interface
3. Copy-paste content manually

**Status:** 🔄 Ongoing (user investigating)

### 6. /zen-roundtable Timeout (Optimisé V6 MVP)

**Symptôme:** Command stuck >5 min (Codex response 36K > 25K token limit)

**Fix V6 MVP:** Use Gemini seul (5-10 min vs 30-45 min Multi-IA)

**Alternative:** Skip Phase 0 entirely si vision claire

**Status:** ✅ Workaround validé (Gemini-only pattern)

### 7. Design Tokens Compliance Risk

**Symptôme:** Agent hardcode colors (`bg-blue-600`) au lieu de variables (`bg-primary-500`)

**Impact:** Design Import fails (breaking changes, 1-2 days refactor)

**Prevention V6.1.4:**
- Prompt explicit: "USE CSS VARIABLES ONLY"
- Validation: `grep -r "bg-blue-\|text-red-" src/` (should return 0)
- Checkpoint: After T010, T020, T030 (verify no hardcoded)

**Status:** ✅ Enforced (validated AdProof 100% variables)

### 8. Parallel Execution Complexity (V6.2 Future)

**Risk:** 2 agents edit même fichier → conflits Git → merge nightmare

**Example:**
- backend-specialist creates `src/lib/auth.ts` (T015)
- frontend-specialist edits `src/lib/auth.ts` (T042[P]) - SAME time
- Conflict: Last write wins (data loss)

**Mitigation V6.2 (planifié):**
- Filesystem locking strategy (agent locks file before edit)
- Task dependency graph ([P] markers → identify safe parallelization)
- Agent handoff protocol real-time (not post-completion)
- Rollback strategy (if conflict detected → stop both → manual resolution)

**Decision GO/NO-GO:** After 3+ projects validated sequential (V6.1.4)

**Status:** ⏳ Not started (V6.2 future)

---

## 🏆 AVANTAGES CONCURRENTIELS vs ALTERNATIVES

### Comparison Table

| Feature | Lovable/Bolt/v0 | Cursor/Windsurf | Archon Workflow V6.1.4 |
|---------|-----------------|-----------------|------------------------|
| **Speed** | 3-4h (MVP) | 2-3 days (manual) | **3-4h** (automated) ✅ |
| **Design** | Generic blue template | Developer-driven | **Custom brand** (15 min merge) ⭐ |
| **Quality Gates** | Basic (build only) | Manual testing | **5 gates enforced** (P0-P4) ✅ |
| **Observability** | 0 (black box) | IDE logs | **Timeline complete** (JSONL) ✅ |
| **Documentation** | 0 (code only) | Comments | **Dynamic Memory V5** (WHY) ⭐ |
| **Design/Dev Decoupling** | ❌ Coupled | ❌ Coupled | **✅ Decoupled** (competitive advantage) ⭐ |
| **Customization** | Template editing (1-2 days) | Manual refactor | **15 min token merge** (0 breaking changes) ✅ |
| **Error Recovery** | Restart from scratch | Undo/redo | **Context bundles** (60-70% recovery) ✅ |
| **Cost** | €20-40/month | €20-40/month | **€140/month** (Claude Pro + Codex + Gemini) |
| **Workflow Enforcement** | 0 | 0 | **BLOCKER gates** (exit 1 if non-compliance) ⭐ |
| **Agent Coordination** | N/A (single agent) | N/A | **Handoff protocol** (JSON coordination) ✅ |
| **Security** | Basic | Manual | **Jules parallel** (async, free) ⭐ V6.3 |

### Unique Selling Points (USPs)

**1. Design/Dev Decoupling = Deal Closer**
- Lovable/Bolt/v0: "Your MVP is ready... but it looks like every other template"
- Archon: "Your MVP is ready... and it looks like YOUR brand" (custom violet, custom font, 15 min merge)
- **Client Perception:** Professional vs commodity

**2. Dynamic Memory V5 = Onboarding -90%**
- Competitors: Code comments only → New dev needs 2-3 days
- Archon: project-memory.md (WHY documented) → New dev contributing same day
- **Audit Compliance:** HIPAA/SOC2 documentation automatic

**3. Context Bundles = Risk Mitigation**
- Competitors: Context overflow → restart from scratch (100% loss)
- Archon: Context overflow → /loadbundle → 60-70% recovery in 15 min
- **Insurance:** 2-3 min overhead vs 2h45 catastrophic loss

**4. Workflow Enforcement = Quality Guarantee**
- Competitors: Agent non-compliance → silent failure
- Archon: Gates bloquants → exit 1 if 0 tasks → MANDATORY compliance
- **Validation:** Juri audit (0/6 compliance) → V6.1.4 (6/6 enforced)

**5. Jules Parallel Security = Free Audit**
- Competitors: Manual security review (€300-500/project OR skip)
- Archon V6.3: Jules async (0 time overhead, free tier, automated fixes)
- **ROI:** -€300/project + better security posture

### Target Markets (Differentiated)

**NOT for:**
- ❌ Non-technical founders (need Lovable/Bolt simplicity)
- ❌ Enterprises (need custom internal tools)
- ❌ Mobile-first apps (workflow = Mac LOCAL 99%)

**IDEAL for:**
- ✅ Solopreneurs techniques (3-4 projets simultanés, need speed + quality)
- ✅ Agences digitales (4-12 clients/mois, need custom brands)
- ✅ Startups early-stage (MVP → PMF rapide, need professional quality)
- ✅ Consultants freelance (deliver client MVPs in 1 week vs 1 month)

**Pricing Strategy (Future):**
- **Freemium:** Open-source workflow (CLAUDE.md + commands)
- **Pro:** Archon UI/API (€49/month - project management, team coordination)
- **Enterprise:** Custom agents + priority support (€199/month)

---

## 📈 ROADMAP STRATÉGIQUE (6 mois)

### Q1 2025 (Jan-Mar): Foundation Solide

**V6.1.4 (Oct 2025):**
- ✅ 5 MUST HAVE improvements (juri audit)
- ✅ Workflow enforcement (gates bloquants)
- ✅ Context buffer management (auto-save insurance)
- ⏳ Validation pending (test on 2-3 real projects)

**V6.2 (Nov 2025):**
- ⏳ Parallel execution (2× faster - 1h20 vs 2h45)
- ⏳ Filesystem locking strategy
- ⏳ Agent handoff protocol real-time
- Decision GO/NO-GO after V6.1.4 validation

**V6.3 (Dec 2025):**
- ⏳ Jules integration (security parallel)
- ⏳ Phase 5A workflow (apply Jules results)
- ⏳ Manual → Semi-auto → Full-auto (3 patterns)
- Decision GO/NO-GO after juri file recovery

### Q2 2025 (Apr-Jun): Scale & Monetization

**V7.0 (Jan 2026):**
- Archon UI/API (project management, team coordination)
- Multi-user support (team collaboration)
- Project templates (SaaS, Marketplace, E-commerce)
- Payment integration (Stripe - €49/month Pro tier)

**V7.1 (Feb 2026):**
- Agent marketplace (community-contributed specialists)
- Custom agent builder (low-code agent creation)
- Integration ecosystem (Vercel, Railway, Supabase)

**V7.2 (Mar 2026):**
- Enterprise features (SSO, audit logs, compliance reports)
- Priority support (dedicated Slack channel)
- Custom SLA (99.9% uptime, 4h response)

### Q3 2025 (Jul-Sep): Community & Ecosystem

**V8.0 (Apr 2026):**
- Community templates (500+ templates, open-source)
- Template marketplace (paid templates, revenue share)
- Template verification (quality badges, trusted contributors)

**V8.1 (May 2026):**
- Plugin system (extend workflow with custom steps)
- Workflow editor (visual builder, drag-drop)
- Integration builder (connect external tools)

**V8.2 (Jun 2026):**
- Mobile app (iOS + Android - monitoring + lightweight edits)
- Notifications (push alerts for checkpoint failures)
- Voice commands (trigger workflow via Siri/Google Assistant)

### Q4 2025 (Oct-Dec): AI Advancements

**V9.0 (Jul 2026):**
- Multi-model orchestration (GPT-5, Claude 4, Gemini 3)
- Model selection auto (choose best model per task)
- Cost optimization (balance speed vs cost)

**V9.1 (Aug 2026):**
- Agentic QA (autonomous testing agent)
- Agentic Design (autonomous UI/UX design)
- Agentic DevOps (autonomous deployment + monitoring)

**V9.2 (Sep 2026):**
- Self-improving agents (learn from past projects)
- Pattern recognition (detect reusable components)
- Code reuse (suggest existing code vs writing new)

---

## 🎯 QUESTIONS STRATÉGIQUES POUR CHATGPT

### 1. Angles de Développement Manqués

**Question:** En analysant ce workflow complet, quels angles de développement ou opportunités stratégiques ai-je potentiellement ratés ?

**Contexte Clé:**
- Vision: Solopreneur technique (3-4 projets simultanés)
- Contrainte: Mac LOCAL 99% (pas cloud-first)
- Avantage concurrentiel: Design/Dev Decoupling (15 min custom brand)
- Validation: AdProof.ai (2h45, 99 tasks, 150+ files, ✅ quality gates)
- Friction: Agent non-compliance (juri 0/6) → V6.1.4 fixes

**Rechercher:**
- Marchés adjacents non exploités
- Features manquantes (vs Lovable/Bolt/Cursor)
- Opportunités monétisation
- Partnerships potentiels

### 2. Optimisations Possibles

**Question:** Quelles optimisations techniques ou workflow pourrais-je appliquer pour améliorer davantage le ROI (time/quality/cost) ?

**Métriques Actuelles:**
- Time: 3-4h (vs 2-3 jours manuel) = -87%
- Execution: 2h45 (vs 6-7h estimate) = -60% (Haiku 4.5)
- Overhead: 0 min (vs 5-10 min V5.2.1) = -100%
- Quality: Build ✅ Lint ✅ Tests ✅ Design 100%

**Rechercher:**
- Bottlenecks cachés (où perdre du temps ?)
- Optimisations token (GLM-4.6 = -77% tokens déjà appliqué)
- Automatisation supplémentaire (étapes manuelles restantes ?)
- Caching/Memoization (réutiliser entre projets ?)

### 3. Risques Non Identifiés

**Question:** Quels risques techniques, business ou stratégiques n'ai-je pas identifiés dans ce workflow ?

**Risques Connus:**
- Agent non-compliance → V6.1.4 fixes (BLOCKER gates)
- Context overflow → Context bundles (insurance)
- Jules file recovery → Investigation en cours
- Parallel execution conflicts → V6.2 mitigation strategy

**Rechercher:**
- Risques scalabilité (10× projects/week ?)
- Risques dépendances (MCP servers, APIs externes)
- Risques qualité non détectés (blind spots testing ?)
- Risques business (concurrence, pricing, churn)

### 4. Comparaison Alternatives

**Question:** Comment ce workflow se compare-t-il précisément aux alternatives (Lovable, Bolt, v0, Cursor, Windsurf) et où sont les gaps ?

**USPs Identifiés:**
- Design/Dev Decoupling (custom brand 15 min)
- Dynamic Memory V5 (WHY documented)
- Context Bundles (disaster recovery)
- Workflow Enforcement (BLOCKER gates)
- Jules Parallel Security (free audit V6.3)

**Rechercher:**
- Features concurrents que je n'ai pas (collaboration temps réel ?)
- Pricing concurrents (suis-je trop cher/pas assez ?)
- Marketing concurrents (comment ils vendent ?)
- Retention concurrents (pourquoi users stay/churn ?)

### 5. Roadmap Priorisation

**Question:** Comment prioriser intelligemment entre V6.2 (parallel execution), V6.3 (Jules integration) et V7.0 (Archon UI/API) ?

**Options:**
- **V6.2 (parallel):** 2× faster (1h20 vs 2h45) MAIS complex + risky
- **V6.3 (Jules):** Free security MAIS experimental + coordination
- **V7.0 (UI/API):** Monetization MAIS scope large + dev time

**Critères:**
- ROI immediate (time/cost savings)
- Complexity (dev time, risk)
- Differentiation (competitive advantage)
- Monetization potential (revenue impact)

**Rechercher:**
- Sequence optimale (quel ordre ?)
- Quick wins (low-hanging fruit ?)
- Strategic bets (high-risk high-reward ?)
- MVP scope (features minimales V7.0 ?)

### 6. Go-to-Market Strategy

**Question:** Quelle stratégie go-to-market recommandez-vous pour ce workflow (open-source, freemium, SaaS, hybrid) ?

**Options Considérées:**
- **Open-source:** Workflow gratuit (CLAUDE.md + commands) → Community building
- **Freemium:** Free tier (1 project/week) + Pro (€49/month unlimited)
- **SaaS:** Archon UI/API (€49/month Pro, €199/month Enterprise)
- **Hybrid:** Open-source CLI + Paid UI/API + Enterprise support

**Target Markets:**
- Solopreneurs techniques (3-4 projets/mois)
- Agences digitales (4-12 clients/mois)
- Startups early-stage (MVP → PMF rapide)
- Consultants freelance (deliver MVPs 1 week vs 1 month)

**Rechercher:**
- Pricing optimal (€49 trop cher/pas assez ?)
- Acquisition channels (SEO, ads, community, partnerships ?)
- Onboarding (comment first success rapide ?)
- Retention (pourquoi users churn after 1 month ?)

---

## 📝 ANNEXES

### A. Fichiers Clés

**Workflow Documentation:**
- `docs/WORKFLOW-V6-MVP.md` - Workflow guide complet (863 lignes)
- `changelogs/V6-MVP/CHANGELOG-V6-MVP.md` - V6 MVP results (416 lignes)
- `changelogs/V6.1.3/CHANGELOG-V6.1.3-OBSERVABILITY.md` - V6.1.3 observability (459 lignes)
- `CLAUDE.md` - Project instructions (source de vérité)

**Commands:**
- `.claude/commands/speckit.final.md` - Implementation orchestration (620 lignes V6.1.3)
- `.claude/commands/speckit.agents.md` - Agent generation (avec verification)
- `.claude/commands/speckit.tasks.md` - Task breakdown (CHECKBOXES format)
- `.claude/commands/savebundle.md` - Context bundle save (robustified V6.1.4)
- `.claude/commands/loadbundle.md` - Context bundle load

**Infrastructure:**
- `scripts/pulseLogger.cjs` - Observability logging API (267 lignes V6.1.3)
- `scripts/viewPulse.sh` - Timeline viewer (180 lignes)
- `scripts/contextBundler.cjs` - Context bundle generation

**Templates:**
- `templates/project-memory-template.md` - Dynamic Memory V5 structure
- `templates/commands/implement.md` - Spec-Kit execution rules

### B. Métriques Complètes

**AdProof.ai MVP (V6 MVP - 2025-10-16):**
- Duration: 2h45 (99 tasks, 3 agents)
- Files: 157 changed (150+ created)
- Lines: 12,342+ insertions
- Components: 15+ React
- Pages: 6 Next.js
- API endpoints: 4
- Database tables: 3
- Tests: 50+ (21 files, 4,049 lines)
- Build: ✅ PASS (0 errors)
- Lint: ✅ PASS (4 warnings documented)
- Design Tokens: 100% (0 hardcoded colors)

**test1710 Project (V6.1.2 - 2025-10-17):**
- Token Savings: -77% (450K→100K GLM-4.6 vs Sonnet 4.5)
- Weekly Capacity: +100% (10-12 projects vs 4-5)
- project-memory.md: 4 decisions documented ✅
- observability-pulse.jsonl: EMPTY ❌ (fixed V6.1.3)

**Juri MVP (V6.1.4 - 2025-10-20):**
- Code Quality: ✅ EXCELLENT (42 files, 9 services, 21 components)
- Workflow Compliance: ❌ 0/6 (BEFORE V6.1.4 fixes)
- Convergence: 100% (Claude + GLM 4.6 analysis aligned)
- Validation: Pending (after V6.1.4 fixes applied)

### C. Contacts & Références

**Spec-Kit Official:**
- Repo: https://github.com/github/spec-kit.git
- Docs: https://github.com/github/spec-kit/tree/main/docs

**Zen MCP Server:**
- Repo: https://github.com/BeehiveInnovations/zen-mcp-server.git
- Setup: `./run-server.sh` + OAuth 24h

**Jules Google:**
- Interface: https://jules.google.com/session
- Docs: https://jules.google/docs
- API: Beta (experimental, not public)

**Claude Code:**
- Docs: https://docs.claude.com/en/docs/claude-code
- Pricing: Included in Claude Pro (€20/month)

**Patterns:**
- Dev Dan - Context Engineering ADV2 (Context Bundles)
- Compound Engineering (AI Labs) - Context Buffer Management
- GitHub Spec-Kit - Task Orchestration Pattern

---

**Version:** V6.1.4 (Draft)
**Date:** 2025-10-20
**Status:** Analysis Document (for ChatGPT review)
**Next:** Validate 6 questions stratégiques + identify blind spots

**🎯 OBJECTIF:** Identifier angles de développement manqués, optimisations possibles, risques non détectés, comparaison alternatives précise, roadmap priorisation, go-to-market strategy.
