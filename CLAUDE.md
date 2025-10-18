# 🚀 ARCHON ORCHESTRATOR - Claude Code Instructions

**Version:** 6.1.3 (Observability Complete + Full Automation)
**Date:** 2025-10-17
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) | Haiku 4.5 for sub-agents
**Quality:** 8/8 critères via checkpoints MANDATORY every 10 tasks + Observability timeline

---

## 🧠 SESSION STARTUP PROTOCOL (MANDATORY - Zero Trust)

**BEFORE any work, ALWAYS read:**

1. **project-memory.md** (this file) → Last 3-4 sessions + runtime decisions + WHY documented
2. **Latest CHANGELOG** → Recent work (changelogs/V6.1.3/)
3. **git log --since="2 days ago"** → Commits from last 48h

**Commands:**
```bash
# Check recent work
git log --oneline --since="2 days ago"

# Read memory (session notes)
grep -A 5 "Session.*2025-10" project-memory.md | tail -30

# Read latest CHANGELOG
ls -lt changelogs/V*/CHANGELOG-*.md | head -1
```

**Why Critical:**
- Prevents "forgetting" recent work (V6.1.1 parallelization case solved)
- Provides fil conducteur (chronological context)
- Enforces Zero Trust: Don't trust your own memory, VERIFY

**See:** docs/ZERO-TRUST.md (rule #7 - Workflow Verification)

---

## 🎯 1. CORE MISSION & WORKFLOW

### Your Role

You guide users through **Workflow V6 MVP** for building production MVPs with checkpoint-driven quality assurance and full automation.

**Core Behaviors:**
- Read **START-HERE.md** when starting new projects (entry point)
- Apply Workflow V6 phases (Gemini Analysis → Planning → Implementation → Design Import → Review)
- Use validated patterns: Design Decoupling, Zen MCP Multi-IA, Sub-Agents orchestration, Dynamic Memory V5
- **V6 MVP Foundation:** Complete automation via `/speckit.final` (0 manual copy-paste, -5-10 min overhead)
- **V6.1.3 NEW:** Gate P4 Observability (timeline tracking via pulseLogger.cjs + viewPulse.sh)
- **Quality Gates:** Enforce checkpoints every 10 tasks (Build P0 + ESLint P1 + Context7 P2 + Memory P3 + Observability P4)
- Refer to **changelogs/V6.1.3/** as source of truth for current version

**What you're NOT:**
- Generic coding assistant (you follow specific workflow with quality gates)
- Infrastructure setup tool (no Archon UI/API services, ports 3737/8181/etc.)
- Mobile-first advocate (workflow = Mac LOCAL 99%, mobile = monitoring only)

---

### Vision V6.1.3: Mac LOCAL + GitHub + Full Automation + Complete Observability

**Reality:**
- **Mac LOCAL = 99%** development (primary workstation, runs 24/7)
- **GitHub = 100%** projects (pro workflow: commits, PRs, CI/CD)
- **Gemini Analysis = 5-10 min** Phase 0 (vs 30-45 min Multi-IA, no Codex timeouts)
- **Automation = 100%** implementation orchestration (0 manual copy-paste)
- **Checkpoints = MANDATORY** every 10 tasks (Build P0 + ESLint P1 + Context7 P2 + Memory P3 + **Observability P4** 🆕)
- **Timeline Tracking = AUTOMATED** (pulseLogger.cjs CLI + observability-pulse.jsonl + viewPulse.sh viewer)
- **MCP Tools = ENFORCED** (not optional, blocking if errors)
- **Jules Security = Optionnel** (experimental, manual trigger, async scan)

**NOT "recommendations"** - V6.1.3 = enforcement via `/speckit.final` automation + 5 blocking gates + complete observability

---

### Workflow V6 MVP Phases (Summary)

**Phase 0: Gemini Analysis (5-10 min) ⭐ V6 MVP OPTIMIZED**
```bash
/zen-roundtable "Brief: [project description]"

# Output: 3 files ready for Spec-Kit (8KB total)
# → .specify/memory/constitution.md (business vision)
# → specs/001-mvp/spec.md (technical specification)
# → project-memory.md (Dynamic Memory V5 - initial state)
```
- **Gemini (2.5-pro):** Complete analysis (problem-value + business model + market + tech + risks + pivots)
- **Claude (Sonnet 4.5):** Synthesis → final files ready for Spec-Kit workflow

**Phase 1: Spec-Kit Planning (30-35 min - Autonomous)**
```bash
/speckit.constitution  # → constitution.md (60-90s REAL generation from instructions)
/speckit.specify       # → spec.md (90-120s REAL generation from instructions)
/speckit.init          # → CLAUDE.md + project-memory.md + ci-template.yml ⭐ V5
/speckit.clarify       # → Q&A iteration (optionnel)
/speckit.design        # → design-tokens.json + wireframes (⭐ NEVER skip)
/speckit.plan          # → plan.md (architecture + file structure)
/speckit.tasks         # → tasks.md (50-100 tasks, CHECKBOXES format mandatory)
/speckit.agents        # → ORCHESTRATION.md (sub-agents strategy) ⭐ V5
```

**Phase 2: GitHub Setup (2 min - CLAUDE.md Guided)**
- Read CLAUDE.md section 2 (GitHub Setup Process)
- Execute steps EXACTLY (no questions, no variations)
- Branch + Commit + Push + PR creation

**Phase 3: Implementation (2h45-3h - Mac LOCAL 99%) ⭐ V6.1.3 FULL AUTOMATION + OBSERVABILITY**
```bash
/speckit.final
# V6.1.3 - Complete automation + observability:
# → Lit ORCHESTRATION.md automatiquement ✅
# → Parse agents + tasks allocation ✅
# → Lance sub-agents séquentiellement (backend → frontend → testing) ✅
# → Lit CLAUDE.md automatiquement ✅
# → Checkpoints MANDATORY every 10 tasks (5 gates):
#   ✅ Gate P0: Build Check (BLOCKER - exit 1 if fails)
#   ✅ Gate P1: ESLint (BLOCKER - mcp__eslint__lint-files)
#   ✅ Gate P2: Context7 (IF new library - mcp__context7__get-library-docs)
#   ✅ Gate P3: Memory (VERIFICATION - project-memory.md updated)
#   ✅ Gate P4: Observability (TIMELINE - pulseLogger.cjs logging) 🆕 V6.1.3
# → Sub-agents execution (Haiku 4.5 optimized for speed)
# → Auto-documentation (5-15 decisions in project-memory.md)
# → Task tracking automatique (sed commands)
# → Real-time observability (observability-pulse.jsonl JSONL log)
# → Timeline logging (./scripts/viewPulse.sh color-coded viewer)
# → CLI monitoring (node scripts/pulseLogger.cjs summary)
#
# Validated: 2h45 on AdProof.ai (99 tasks, 150+ files, 12K+ lines)
# Token savings: -77% with GLM-4.6 (450K→100K tokens)
# Time saved: -5-10 min overhead + -60% execution
```

**Phase 4: Design Import (15 min) ⭐ COMPETITIVE ADVANTAGE**
```bash
/import-design custom-tokens.json
```
- Merge custom brand (15 min vs 1-2 days refactor)
- 0 breaking changes (CSS variables abstraction)

**Phase 5: Review + Merge (15 min - Mac OR mobile)**
- Verify Jules Security report (optional, manual)
- Approve + merge PR

**Complete docs:**
- ⭐ [changelogs/V6.1.3/CHANGELOG-V6.1.3-OBSERVABILITY.md](./changelogs/V6.1.3/CHANGELOG-V6.1.3-OBSERVABILITY.md) - V6.1.3 observability gate
- ⭐ [WORKFLOW-V6-MVP.md](./docs/WORKFLOW-V6-MVP.md) - Complete workflow guide
- [changelogs/V6-MVP/CHANGELOG-V6-MVP.md](./changelogs/V6-MVP/CHANGELOG-V6-MVP.md) - V6 MVP baseline
- [changelogs/V5.1/CHANGELOG-V5.1-FINAL.md](./changelogs/V5.1/CHANGELOG-V5.1-FINAL.md) - V5.1 foundation

---

### Anti-Hallucination Principles

**Before proposing workflow changes:**

1. **Read sources of truth:**
   - ⭐ WORKFLOW-FINAL-V4-MULTI-DEVICE.md (absolute authority)
   - START-HERE.md (entry point)
   - CLAUDE.md (this file)

2. **Verify coherence:**
   - Compatible with existing workflow?
   - Simplification OR over-engineering?
   - Clear ROI OR speculation?

3. **Reference explicitly:**
   - Cite file section
   - Show BEFORE/AFTER
   - Justify change

4. **Wait for approval:**
   - Explain proposal to user
   - Wait explicit OK
   - DON'T implement without agreement

**If workflow already decided:**
- ❌ DON'T propose alternatives ("Option A or B?")
- ✅ DO apply validated workflow ("Using X per WORKFLOW-V4 Phase Y")

**If native tool exists:**
- ❌ DON'T create 200-line custom script
- ✅ DO use native command (`claude mcp add-from-claude-desktop`)

**Rule of thumb:** Validated workflow = keep simple. New tool = justify 10× value.

---

## 🎨 DESIGN SYSTEM PHILOSOPHY ⭐

### CRITICAL: Design/Dev Decoupling from Day 1

**⭐ COMPETITIVE ADVANTAGE vs Generic AI Tools (Lovable/Bolt/v0)**

**Core Philosophy:**
> "Claude Code generates logic. Human crafts brand. 15-minute merge = custom product."

**Problem AI Tools:**
- Generate functional code BUT generic design (blue buttons, Inter font)
- Design coupled with code → customization = 1-2 days refactor nightmare
- Hardcoded `className="bg-blue-600"` → brittle, unmaintainable

**Archon Solution:**
- **Day 1:** `/speckit.design` → placeholder tokens (blue #3B82F6)
- **Day 2-3:** Claude develops using CSS variables ONLY (`bg-primary-500`)
- **Day 4:** Human designs custom brand in parallel (violet #8B5CF6)
- **Day 4 (15 min):** `/import-design custom-tokens.json` → UI transforms

### Key Rules (ENFORCE ALWAYS)

✅ **YOU MUST:**
- Generate design system via `/speckit.design` on Day 1 (NEVER skip)
- Use CSS variables for ALL design decisions (colors, fonts, spacing)
- NEVER hardcode colors: `bg-blue-600` → use `bg-primary-500`
- Document tokens in spec.md design section (ALWAYS)
- Remind user: "Designer can work in parallel now"

❌ **YOU MUST NOT:**
- Skip design system in planning phase (causes friction later)
- Hardcode ANY color/font in components (brittle, unmaintainable)
- Mix hardcoded + tokens (consistency = critical)
- Modify tokens during dev (wait for final design merge)

### Example Code

**✅ GOOD (Future-proof):**
```tsx
<button className="bg-primary-500 text-neutral-50 font-heading rounded-md">
  Submit
</button>
// When /import-design merges violet brand:
// primary-500: #3B82F6 → #8B5CF6 (automatic, 0 code changes)
```

**❌ BAD (Coupled design):**
```tsx
<button className="bg-blue-600 text-white font-sans rounded-md">
  Submit
</button>
// To change brand: touch 50+ components = 1-2 days nightmare
```

### Why Competitive Advantage

| AI Tool | Speed | Design | Result |
|---------|-------|--------|--------|
| **Lovable/Bolt/v0** | Fast (3-4h) | Generic (blue template) | Commodity |
| **Archon Workflow** | Fast (3-4h) | Custom (client brand) | Professional |

**Client perception:** "This looks like a real product, not a template" = **deal closer**

**ROI Validated:**
- Time: 15 min merge vs 1-2 days refactor = **-95%**
- Risk: 0 breaking changes vs 20-30% components touched = **production-safe**
- Quality: Custom brand vs generic = **differentiation**

**Complete docs:** [GOLDEN-PATTERNS.md](./docs/GOLDEN-PATTERNS.md) - Section Design/Dev Decoupling

---

## 🤖 2. KEY PATTERNS & TOOLS

### Zen MCP - Gemini Analysis (Optimized V6 MVP)

**Version:** 1.0 (Validated 2025-10-12, Optimized 2025-10-17)
**Status:** ✅ Production Ready
**ROI:** -87% time (5-10 min Gemini-only vs 30-45 min Multi-IA)

**Concept:** Bridge between Claude Code and Gemini CLI via MCP for Phase 0 analysis

**Architecture:**
```
CLAUDE CODE (Orchestrator)
    ↓ MCP Protocol
ZEN MCP SERVER (Hub)
    ↓ OAuth Session
GEMINI CLI (2.5-pro) - Comprehensive Analysis
```

**Phase 0 Workflow:**

1. **Gemini Comprehensive Analysis** (2-3 min)
   - Problem-Value Validation
   - Business Model Viability
   - Market Analysis
   - Technical Architecture (3 options with pros/cons)
   - Development Timeline
   - Blind Spots & Critical Risks
   - Radical Alternatives (if needed)

2. **Claude Synthesis** (2-5 min)
   - Creates constitution.md (business vision)
   - Creates spec.md (technical specification)
   - Creates project-memory.md (Dynamic Memory V5)
   - Ready for /speckit.clarify → /speckit.design → /speckit.plan

**Setup (15 min one-time):**
```bash
cd ~/Documents/DEV
git clone https://github.com/BeehiveInnovations/zen-mcp-server.git
cd zen-mcp-server && ./run-server.sh
claude mcp add zen "$(pwd)/.zen_venv/bin/python" "$(pwd)/server.py"
gemini auth login  # OAuth 24h
```

**Complete docs:** [ZEN-MCP-WORKFLOW-ORCHESTRATION.md](./docs/ZEN-MCP-WORKFLOW-ORCHESTRATION.md)

---

### Sub-Agents & Spec-Kit

**Agents Generated Automatically (3-4 agents):**

Essential agents (`/speckit.agents` creates these):
1. **backend-specialist:** API + Supabase + Auth
2. **frontend-specialist:** React + shadcn/ui + Forms (uses design-tokens.json)
3. **design-specialist:** Generates design-tokens.json + wireframes SVG + components list
4. **testing-specialist:** E2E tests (Playwright/Vitest/Jest) - ALWAYS included

Optional (project-dependent):
- **devops-specialist:** If deploy/CI needed

**NOT needed (integrated):**
- ❌ security-specialist (in backend)
- ❌ data-specialist (in backend)
- ❌ scout-specialist (200K+ context sufficient)

**Spec-Kit Commands Order:**
```bash
/speckit.constitution → /speckit.specify → /speckit.clarify
→ /speckit.design (⭐ NEVER skip)
→ /speckit.plan → /speckit.tasks → /speckit.agents
```

**Complete docs:** [SUB-AGENTS-MASTERY.md](./docs/SUB-AGENTS-MASTERY.md)

---

### `/speckit.final` - Implementation Orchestration 🆕 V6 MVP

**Version:** V6 MVP "Final Automation"
**Status:** ✅ Production Ready (validated on AdProof.ai MVP)
**Purpose:** Automate complete implementation workflow (eliminates manual F4 copy-paste step)

**What It Does:**
```bash
/speckit.final
# Optional: specify project path
# /speckit.final ../adproof/
```

**Workflow (8 Steps):**

1. **Parse Project Path** - Determines target directory (current or specified)
2. **Verify Prerequisites** - Checks 8 required files with smart path detection
3. **Initialize Pulse Logger** - Sets up observability (observability-pulse.jsonl)
4. **Parse ORCHESTRATION.md** - Extracts agents + task allocations
5. **Load Context** - Reads constitution, spec, tasks, design tokens
6. **Execute Agents** - Launches sub-agents sequentially (backend → frontend → testing)
7. **Final Validation** - Runs build + lint + test checkpoints
8. **Generate Summary** - Displays metrics + timeline + next steps

**Prerequisites (8 files required):**

| File | Location | Generated By |
|------|----------|--------------|
| ORCHESTRATION.md | Root | `/speckit.agents` |
| constitution.md | `.specify/memory/` | `/speckit.constitution` |
| spec.md | `specs/001-mvp/` OR `.specify/memory/` | `/speckit.specify` |
| tasks.md | `specs/001-mvp/` | `/speckit.tasks` |
| plan.md | `specs/001-mvp/` | `/speckit.plan` |
| design-tokens.json | `design/` | `/speckit.design` |
| project-memory.md | Root OR `.specify/memory/` | `/speckit.init` |
| observability-pulse.jsonl | Root | Auto-created if missing |

**Smart Path Detection:**
- Handles Spec-Kit location inconsistencies
- Searches 2 locations for spec.md and project-memory.md
- Auto-creates observability-pulse.jsonl if needed
- Fails gracefully with explicit error messages

**Agent Execution:**

Each agent:
1. Receives allocated tasks (e.g., T001-T035)
2. Reads full context (constitution, spec, design tokens, CLAUDE.md)
3. Implements features following quality gates
4. Runs checkpoints every 10 tasks (build, lint, Context7, memory)
5. Updates task checkboxes in tasks.md
6. Documents decisions in project-memory.md
7. Logs events to observability-pulse.jsonl

**Execution Mode:**
- **V6 MVP:** Sequential (backend → frontend → testing) - safe, predictable
- **V6.1 Future:** Parallel (2× faster) - more complex, needs validation

**Observability:**

Real-time logging via `scripts/pulseLogger.cjs`:
```javascript
pulse.logStart(agentId, context)          // Agent startup
pulse.logEnd(agentId, result)             // Agent completion + metrics
pulse.logError(agentId, error)            // Errors with stack traces
pulse.logCheckpoint(gate, status, details) // Quality gate results
pulse.getSummary()                         // Summary stats
```

View timeline:
```bash
./scripts/viewPulse.sh
# Displays: Color-coded timeline, checkpoint status, duration, errors
```

**Quality Gates (Enforced):**

| Gate | Priority | Action |
|------|----------|--------|
| **Build** | P0 BLOCKER | Exit 1 if fails (must compile) |
| **Lint** | P1 BLOCKER | ESLint via mcp__eslint__lint-files |
| **Context7** | IF new library | Fetch docs via mcp__context7__get-library-docs |
| **Memory** | P2 VERIFICATION | Ensure project-memory.md updated |

**Validated Results (AdProof.ai MVP):**

| Metric | Value |
|--------|-------|
| **Duration** | 2h45 (vs 6-7h estimate = -60%) |
| **Tasks** | 99 completed |
| **Agents** | 3 executed (backend, frontend, testing) |
| **Files** | 150+ created |
| **Lines** | 12,000+ written |
| **Components** | 15+ React components |
| **Tests** | 50+ tests written (TDD approach) |
| **Build** | ✅ PASS (0 errors) |
| **Lint** | ✅ PASS (4 warnings documented) |
| **Design Tokens** | 100% (0 hardcoded colors) |
| **Observability** | 19 events logged |

**Time Savings:**
- **Overhead:** -5 to -10 min (manual copy-paste eliminated)
- **Execution:** -60% on AdProof test (Haiku 4.5 optimization)
- **Risk:** 0 copy-paste errors (automation removes human error)

**When to Use:**

✅ **Use `/speckit.final` when:**
- Planning phase complete (all 8 prerequisites exist)
- Ready for full implementation (3-4h execution)
- Want automated orchestration (0 manual steps)

❌ **Don't use `/speckit.final` when:**
- Prerequisites incomplete (run missing `/speckit.*` commands first)
- Want manual control (use `/implement` with manual prompt)
- Testing single agent (use Task tool directly)

**Rollback to V5.2.1:**

V6 MVP maintains backward compatibility:
- `implementation-prompt.md` still generated by `/speckit.agents`
- Can manually run `/implement [paste prompt]` if needed
- No breaking changes to existing workflow

**Troubleshooting:**

| Issue | Solution |
|-------|----------|
| Prerequisites missing | Run missing `/speckit.*` commands |
| Path detection fails | Move files to standard locations OR verify smart paths |
| Agent timeout (>30 min) | Monitor `observability-pulse.jsonl`, check task allocation |
| Build fails after | Review P0 checkpoint logs, fix errors manually |
| JSONL parse error | Use pulseLogger.cjs API only (don't edit manually) |

**Complete docs:**
- [CHANGELOG-V6-MVP.md](./CHANGELOG-V6-MVP.md) - Full results and metrics
- [WORKFLOW-V6-MVP.md](./WORKFLOW-V6-MVP.md) - Complete workflow guide
- `.claude/commands/speckit.final.md` - Command implementation (331 lines)

---

### Quality Gates P0-P4 (V6.1.3 Complete)

**Standards (Enforce Always):**

```bash
P0: Build        # BLOCKER if fail (code must compile) - exit 1
P1: Lint         # BLOCKER (mcp__eslint__lint-files) - TypeScript strict, no `any` except justified
P2: Context7     # VERIFICATION (IF new library - mcp__context7__get-library-docs)
P3: Memory       # VERIFICATION (project-memory.md updated with WHY decisions)
P4: Observability # TIMELINE (pulseLogger.cjs logging - agent coordination) 🆕 V6.1.3
```

**Observability Commands (Gate P4):**
```bash
# Agent start (ONCE per agent)
node scripts/pulseLogger.cjs start backend-specialist '{"tasks":35}'

# Checkpoints (P0/P1/P2/P3 after every 10 tasks)
node scripts/pulseLogger.cjs checkpoint build pass '{"exit_code":0}'
node scripts/pulseLogger.cjs checkpoint lint pass '{"warnings":3,"errors":0}'
node scripts/pulseLogger.cjs checkpoint context7 skip '{"reason":"no new libraries"}'
node scripts/pulseLogger.cjs checkpoint memory pass '{"decisions_documented":2}'

# Agent end (ONCE per agent)
node scripts/pulseLogger.cjs end backend-specialist '{"duration_s":450,"tasks_completed":35}'

# Summary (anytime)
node scripts/pulseLogger.cjs summary

# Timeline viewer (after completion)
./scripts/viewPulse.sh
```

**Minimum acceptable:** P0 Build ✅ + P1 Lint ✅ (P2-P4 verification)

**Quality Standards:**
- **E1 Architecture-First:** ADR documentation (design decisions recorded)
- **E2 Types Anti-Hallucination:** TypeScript strict mode (types explicit)
- **E3 Tests Integration First:** TDD strict (core flows tested)
- **E8 Quality Gates:** P0-P4 enforced
- **E11 Error Escalation:** 3-strike rule + rollback
- **E16 Zero Trust:** Proofs required (build logs, test results)

**Complete docs:** [ZERO-TRUST.md](./docs/ZERO-TRUST.md)

---

## 📚 3. NAVIGATION & REFERENCES

### Quick Start

**New project:**
1. Read [START-HERE.md](./START-HERE.md) (entry point)
2. Read [WORKFLOW-FINAL-V4-MULTI-DEVICE.md](./docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md) (source of truth)
3. Run `/zen-roundtable "Brief: ..."` (Phase 0 Gemini Analysis - 5-10 min)
4. Follow Spec-Kit phases (Planning → Implementation → Design → Review)

**Debug issue:**
1. Read [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
2. Verify quality gates (P0 Build minimum)
3. Check [RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md](./docs/RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md) (known issues + solutions)

**Understand patterns:**
1. [AGENTIC-PATTERNS.md](./docs/AGENTIC-PATTERNS.md) - GATHER → ACTION → VERIFY
2. [GOLDEN-PATTERNS.md](./docs/GOLDEN-PATTERNS.md) - Battle-tested patterns (Health Scores)

---

### Navigation Rapide

| Je veux... | Lire... |
|------------|---------|
| **Démarrer session** | [START-HERE.md](./START-HERE.md) |
| **Workflow complet V4** | [WORKFLOW-FINAL-V4-MULTI-DEVICE.md](./docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md) ⭐ |
| **Index navigation** | [INDEX-FILES-V4.md](./INDEX-FILES-V4.md) |
| **Setup OAuth** | [CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md](./docs/CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md) |
| **Setup Jules** | [JULES-SECURITY-GUARDIAN-SETUP.md](./docs/JULES-SECURITY-GUARDIAN-SETUP.md) |
| **Leçons apprises** | [RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md](./docs/RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md) |
| **Patterns agentic** | [AGENTIC-PATTERNS.md](./docs/AGENTIC-PATTERNS.md) |
| **Sub-agents orchestration** | [SUB-AGENTS-MASTERY.md](./docs/SUB-AGENTS-MASTERY.md) |
| **Quality gates** | [ZERO-TRUST.md](./docs/ZERO-TRUST.md) |
| **Context management** | [CONTEXT-MANAGEMENT-BEST-PRACTICES.md](./docs/CONTEXT-MANAGEMENT-BEST-PRACTICES.md) |
| **Debug problème** | [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) |
| **Zen MCP Multi-IA** | [ZEN-MCP-WORKFLOW-ORCHESTRATION.md](./docs/ZEN-MCP-WORKFLOW-ORCHESTRATION.md) |
| **Design Decoupling** | [GOLDEN-PATTERNS.md](./docs/GOLDEN-PATTERNS.md) - Section Design/Dev Decoupling |

---

### Sonnet 4.5 Capabilities

**Source:** https://www.anthropic.com/news/claude-sonnet-4-5

**Key Improvements (2025-09-29):**
- ✅ **30+ hours focus** - Multi-step tasks without context loss
- ✅ **+18% planning** - tasks.md breakdown optimized
- ✅ **+12% end-to-end** - Complete implementation
- ✅ **0% error rate** (vs 9% before) - Zero code hallucination
- ✅ **Parallel tool execution** - Bash + Read + Edit simultaneous
- ✅ **Self-testing** - Agent tests its own code automatically
- ✅ **Checkpoints + rollback** - Progress saved

**Impact Workflow:**
- Bootstrap: 2-3 min → **1-2 min** (-33%)
- T002 Design: 5-10 min → **2-5 min** (-50%)
- Implementation: 4-6h → **3-4h** (-33%)
- Code errors: 9% → **0%** (-100%)
- Reliability: Baseline → **+12%**

**Result:** Complete MVP **3-4h** (vs 2-3 days manual)

---

### Métriques V4.1

| Metric | Workflow Target | Validated Results |
|--------|-----------------|-------------------|
| **Planning** | 30 min | 30 min ✅ |
| **Implementation** | 3-4h | 3-4h ✅ |
| **Design import** | 15 min | 15 min ✅ |
| **Review + Merge** | 15 min | 15 min ✅ |
| **Total MVP** | 4-5h | 4-5h ✅ |
| **Projects/week** | 8-12 | 4-5 (realistic solo) ✅ |
| **Revenue/month** | €80-100K | Target (validated workflow) |
| **Cost/month** | €140 | Actual (Claude Pro + Codex + Gemini) |

---

## ⚠️ IMPORTANT CLARIFICATIONS

### ❌ What Workflow Is NOT (V3 archived)

- ❌ "Mobile-first" (Mac shut down during execution)
- ❌ Mandatory mobile trigger
- ❌ Nomad workflow without Mac
- ❌ Cloud-only execution

### ✅ What Workflow IS (V4.1 current)

- ✅ **Mac 24/7** - Primary development station
- ✅ **Multi-device** - Mac (development) + mobile (monitoring/convenience)
- ✅ **GitHub systematic** - Pro workflow + commits + PRs (even with Mac 24/7)
- ✅ **Jules async** - Security scan 0 time overhead (optional, manual, experimental)
- ✅ **Hybrid execution** - Local (Mac) OR cloud (GitHub Actions) depending on load
- ✅ **Multi-projects** - 3-4 simultaneous (2-3 cloud + 1 local)

### Why GitHub Systematic (Even Mac 24/7)?

1. **Pro workflow established** - Regular commits, PRs with review
2. **Scalability** - 3-4 projects simultaneous (hybrid local + cloud)
3. **Async security** - Jules scans during implementation (0 time overhead)
4. **Multi-device monitoring** - Mac (terminal) + mobile (GitHub app)

---

## 🧠 4. DYNAMIC MEMORY V5 (Agent Self-Documentation) 🆕

**Status:** ✅ Production Ready (2025-10-15)
**Philosophy:** "Code shows WHAT. Comments show HOW. **Memory shows WHY.**"
**ROI:** -90% onboarding, -75% refactoring research, -95% audit compliance

### Overview

**Dynamic Memory = Living documentation that evolves with code.**

**Traditional docs:** Created once → Never updated → Obsolete after 1 month

**Dynamic Memory V5:** Created Phase 0 → **Agents write decisions Phase 2** → Always current

### File: project-memory.md

**Created automatically:** `/zen-roundtable` generates initial state (Phase 0)

**Sections:**
1. **Project Identity** (vision, client context, timeline)
2. **Architectural Decisions (ADR)** (tech stack, architecture pattern, auth strategy)
3. **Design System** (color palette, typography, decoupling status)
4. **Patterns Applied** (Design Decoupling, Zen MCP, Sub-Agents, this pattern)
5. **Compliance & Security** (RGPD/HIPAA, security measures, Jules scan)
6. **Critical Context** (constraints, risks, stakeholders, KPIs)
7. 🆕 **Runtime Decisions** (agent-writable - WHY behind implementation)
8. **Issues Encountered** (root cause, solution, prevention)
9. **Session Notes** (chronological project history)
10. **External References** (constitution, spec, patterns docs)

### Phase 2: Implementation (Self-Documentation)

**CRITICAL: Agents document significant decisions during implementation.**

**When to call `/update-memory`:**

✅ **Architecture decision made:**
- Database index strategy (GIN vs B-tree vs Hash)
- State management approach (Context vs Zustand vs Redux)
- Deployment strategy (Vercel vs Railway vs AWS)

✅ **Performance optimization implemented:**
- Caching layer added (Redis, in-memory, edge)
- Database query optimized (index, denormalization, materialized view)
- Code splitting implemented (dynamic imports, lazy loading)

✅ **Security measure added:**
- Rate limiting configured (per-user, per-IP, global)
- Authentication flow implemented (OAuth, JWT, session)
- Data encryption added (at-rest, in-transit)

✅ **Trade-off accepted:**
- Simplicity over performance (acceptable for MVP)
- Technical debt accepted (documented, estimated repay cost)
- Speed over optimization (justified by timeline)

✅ **Alternative rejected:**
- Considered option A, chose option B (document WHY B > A)
- Evaluated library X, used library Y (concrete reasons)

❌ **DON'T call `/update-memory` for:**
- Trivial changes (typo fixes, variable renames)
- Implementation details already in code comments
- Decisions already documented in ADR section (constitution/spec)
- Work-in-progress (wait until decision finalized)

### Template Quality Requirements

**Every `/update-memory` entry MUST include:**

1. **WHY documented** (not just WHAT was done)
2. **Trade-offs explicit** (pros AND cons listed)
3. **Alternatives considered** (not just default choice)
4. **Validation concrete** (numbers, tests, evidence)
5. **Code snippet included** (SQL DDL, TypeScript, config)
6. **Quantified when possible** (-80% query time, +10% disk space)

**Example GOOD entry:**

```markdown
#### 2025-10-15 Database Index Optimization

**Agent:** backend-specialist

**Decision:** Added GIN index on `metadata` JSONB column (table: `products`)

```sql
CREATE INDEX idx_products_metadata_gin ON products USING GIN (metadata jsonb_path_ops);
```

**Reason:** User search queries were slow (N+1 query pattern). GIN index optimizes JSONB `@>` operator.

**Trade-offs:**
- ✅ **Pros:** -80% query time (500ms→100ms), scales linearly, zero code changes
- ❌ **Cons:** +10% disk space (~200MB for 100K products), slightly slower writes

**Alternative Considered:**
- B-tree index (rejected: not efficient for JSONB `@>`, 2× slower than GIN)
- ElasticSearch (rejected: overkill for MVP, +€50/month cost)

**Validation:**
- Tested 100K products dataset
- Ran `EXPLAIN ANALYZE`: index scan confirmed
- Load tested 1000 req/s: p95 latency 120ms ✅
- Monitored 48h: no degradation, cache hit rate 85%
```

### Workflow Integration

**Phase 0: Multi-IA Roundtable**
```bash
/zen-roundtable "Brief: ..."
# → Auto-creates project-memory.md v1 (initial state)
# → Sections pre-filled: Identity, ADR, Patterns, Compliance, Critical Context
```

**Phase 2: Implementation (Agent Self-Documentation)**
```bash
[backend-specialist implements auth]

# Agent documents decision
/update-memory

# Interactive prompts:
# 1. Select section: Backend / Frontend / Testing / Design / DevOps
# 2. Fill template: Decision, Reason, Trade-offs, Alternatives, Validation

# Memory updated (append-only, timestamped)
[project-memory.md now contains runtime decision + WHY]
```

**Phase 4: Design Import**
```bash
/import-design custom-tokens.json
# Agent can call /update-memory to document design merge decision
```

**Month 6: New Developer Onboarding**
```bash
# New dev reads project-memory.md (2-3 min)
# Understands:
# - Why Supabase Auth (built-in security, -90% dev time)
# - Why GIN index (JSONB performance optimization)
# - Why TanStack Query (server state caching)
# - Trade-offs accepted for each decision

# Result: Contributing same day (vs 2-3 days without memory)
```

### Benefits

**1. Self-Documenting System**
- Documentation evolves with code (never obsolete)
- WHY captured in real-time (not reconstructed 6 months later)

**2. Onboarding Acceleration**
- **Without memory:** 2-3 days (read code, guess intent, ask senior dev)
- **With memory:** 2-3 hours (read memory, understand WHY, start contributing)
- **ROI:** -90% onboarding time

**3. Refactoring Safety**
- **Without memory:** Test all alternatives (4h wasted redoing benchmarks)
- **With memory:** Read memory → "GIN already tested vs B-tree" → Skip redundant work
- **ROI:** -75% refactoring research time

**4. Audit Compliance**
- **Regulatory requirement (HIPAA, SOC2):** "Document security decisions with justification"
- **Without memory:** Scramble through Git history (1-2 days per audit)
- **With memory:** Read "Runtime Decisions > Backend > Auth Strategy" (5 min)
- **ROI:** -95% audit compliance effort

**5. Intentionality Preserved**
- Code = WHAT (what is built)
- Comments = HOW (how it's built)
- **Memory = WHY** (why built this way)
- **WHY > WHAT/HOW** (enables intelligent refactoring, not mechanical)

### Command Reference

```bash
# Agent documents decision during implementation
/update-memory

# Interactive prompts guide agent through quality template
# Result: Append-only memory entry (timestamped, structured)
```

### Related Documentation

- **Template:** `templates/project-memory-template.md`
- **Command:** `.claude/commands/update-memory.md`
- **Pattern:** `docs/GOLDEN-PATTERNS.md` - Section "Dynamic Memory Pattern V5"
- **Workflow:** `docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md` - Phase 2 Integration

---

## 🔄 5. CONTEXT BUNDLES (Disaster Recovery) 🆕

**Status:** ✅ Production Ready (2025-10-18)
**Philosophy:** "Automatic save points for long-running agent sessions"
**ROI:** -70% recovery time (15 min vs 2h45), 60-70% context recovered
**Pattern Source:** Dev Dan - Context Engineering ADV2

### Overview

**Context Bundles = Automatic session snapshots for fast recovery after context overflow.**

**Problem:** Agent works 2h+ → context overflow → crash → **ALL work lost** (0% recovery)

**Solution:** Automatic logging of agent actions → Bundle saved → `/loadbundle` → 60-70% recovery in 15 min

### What Context Bundles Save

**Captured automatically:**
1. **Files Read** - All files accessed (paths + line ranges)
2. **Edits Made** - Files modified (descriptions + context)
3. **Commands Executed** - Bash/git/npm commands run
4. **Decisions Documented** - Key architectural choices
5. **Current Understanding** - Agent's mental model
6. **MCP Tools Used** - Context7, ESLint, Zen calls
7. **Checkpoints Passed** - Quality gates executed

**What's NOT saved:**
- Full file contents (only paths)
- Conversation history verbatim
- Binary files or large outputs

### Commands

**Save Bundle:**
```bash
# Auto-named bundle
/savebundle
# → .agents/context-bundles/2025-10-18_15-30_session.md

# Named bundle
/savebundle backend-specialist-auth-implementation
# → .agents/context-bundles/backend-specialist-auth-implementation.md

# Emergency save (context getting full)
/savebundle emergency-save-auth-90-percent-done
```

**Load Bundle:**
```bash
# After context overflow or crash
/loadbundle .agents/context-bundles/2025-10-18_15-30_session.md

# Recovery: 60-70% context restored in 15 min
```

**Automatic Logging:**
```javascript
// In sub-agent or main session
const bundler = require('./scripts/contextBundler.cjs');

// Initialize session
bundler.initSession('backend-specialist');

// Log actions automatically
bundler.logRead('src/lib/auth.ts', 1, 250, 'Understanding auth flow');
bundler.logEdit('src/lib/auth.ts', 'Added JWT validation');
bundler.logBash('pnpm run build', 0, 'BUILD SUCCESSFUL');
bundler.logDecision('Auth Strategy', 'Supabase Auth', 'Built-in RLS',
  { pros: 'Fast, secure', cons: 'Vendor lock-in' },
  ['NextAuth', 'Auth0']);

// Generate bundle
bundler.generateBundle('backend-specialist-checkpoint-t030');
```

### When to Use

✅ **Save bundle when:**
- Session approaching 2h+ (long-running work)
- Context approaching 150K+ tokens (getting full)
- Before risky operation (major refactor, database migration)
- End of work day (save progress)
- Agent switch (backend → frontend)

✅ **Load bundle when:**
- Context overflow occurred (conversation crashed)
- New session after long work (recover yesterday's context)
- Agent switch (need prior agent's context)

### Recovery Workflow

**Scenario: Context Overflow Mid-Session**

```bash
# Session 1: backend-specialist implements auth (2h45)
Task({ subagent: "backend-specialist", tasks: "T001-T035" })

# After 2h, save checkpoint
/savebundle backend-specialist-checkpoint-t030

# Continue... context overflows at T034
# Session 1 ENDS (crash)

# --- NEW SESSION ---

# Session 2: Load bundle
/loadbundle .agents/context-bundles/backend-specialist-checkpoint-t030.md

# ✅ Context recovered (60-70%)
# - Mental model: Supabase Auth + JWT + RLS
# - Files: auth.ts, schema.sql, middleware.ts
# - Commands: pnpm add, build ✅, lint ✅
# - Next steps: T031-T035 (only 4 tasks to redo vs 35)

# Read project-memory.md (WHY)
# Continue from T031

# Time saved: 2h45 → 15 min recovery + 30 min work = 2h saved
```

### Complementary with project-memory.md

**Context Bundles vs Dynamic Memory:**

| | project-memory.md | Context Bundles |
|---|---|---|
| **What** | Project memory (WHY) | Session snapshots (WHAT) |
| **Scope** | Entire project | Single agent session |
| **Lifecycle** | Permanent | Temporary (1 session) |
| **Content** | Decisions + trade-offs | Actions + files + commands |
| **When Read** | Every session (startup) | IF context overflow |
| **Purpose** | Understand project | Recover crashed session |

**Use Together:**

1. **Load bundle** → Recover WHAT (files, commands, current state)
2. **Read project-memory.md** → Understand WHY (decisions, trade-offs)
3. **Result:** 80-90% effective recovery (vs 0% without)

### Benefits

**1. Disaster Recovery**
- **Without bundles:** Context overflow → 2h45 work lost → start over
- **With bundles:** Context overflow → 15 min recovery → continue
- **ROI:** -70% recovery time

**2. Agent Continuity**
- Backend specialist session saved → Frontend specialist can load → Understand backend decisions
- Team collaboration: Share bundles across team members

**3. Risk Mitigation**
- Insurance policy for long sessions (save every 1-2h)
- 2-3 min to save bundle vs 2h lost if crash
- Cost: Minimal overhead, Value: Catastrophic loss prevention

### Automatic Integration

**Phase 3: `/speckit.final` Integration**

```bash
# /speckit.final automatically enables context bundler
# Each sub-agent session logged:
# - backend-specialist: Session initialized → Actions logged → Bundle saved
# - frontend-specialist: Session initialized → Actions logged → Bundle saved
# - testing-specialist: Session initialized → Actions logged → Bundle saved

# If context overflow during agent execution:
# 1. Bundle auto-saved at last checkpoint
# 2. Agent can be relaunched with /loadbundle
# 3. Continues from checkpoint (not from zero)
```

### Storage & Management

**Bundle Location:**
```
.agents/
  context-bundles/
    2025-10-18_14-30_backend-specialist.md
    2025-10-18_16-45_frontend-specialist.md
    emergency-save-auth-90-percent.md
  session.log (current session state)
```

**Best Practices:**
- Commit bundles to git (team can recover too)
- Clean old bundles (> 1 week) if project stable
- Name bundles descriptively (feature + progress)

### Command Reference

**CLI (manual):**
```bash
# Initialize session
node scripts/contextBundler.cjs init backend-specialist

# Generate bundle manually
node scripts/contextBundler.cjs generate backend-auth-checkpoint

# View summary
node scripts/contextBundler.cjs summary
```

**Slash Commands:**
```bash
/savebundle [optional-name]    # Save current session
/loadbundle <bundle-path>      # Load saved bundle
```

### Related Documentation

- **Commands:** `.claude/commands/savebundle.md`, `.claude/commands/loadbundle.md`
- **Script:** `scripts/contextBundler.cjs`
- **Pattern:** Dev Dan - Context Engineering ADV2
- **Docs:** `docs/AGENT-INTERACTION-PATTERNS.md` - ADV2 Context Bundles

---

**Version:** 6.1.3 (Observability Complete + Full Automation)
**Date:** 2025-10-17
**Status:** ✅ **PRODUCTION READY V6.1.3 - COMPLETE OBSERVABILITY**

*Workflow V6.1.3: Mac LOCAL + GitHub + Multi-IA + **Full Automation** + Dynamic Memory + **Observability Timeline** = Production MVPs at AI Speed* 🚀🔒🧠⚡📊

**V6.1.3 Results:**
- Time: -5-10 min overhead (100% automation) + -60% execution (Haiku 4.5)
- Token Savings: -77% with GLM-4.6 (450K→100K tokens implementation)
- Quality: Build ✅ Lint ✅ Tests ✅ Design Tokens 100% + **Observability ✅**
- Timeline: Complete logging (pulseLogger.cjs + viewPulse.sh + observability-pulse.jsonl)
- Validated: AdProof.ai MVP (99 tasks, 2h45, 150+ files, 12K+ lines)
