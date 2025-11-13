# 🚀 ARCHON ORCHESTRATOR - Claude Code Instructions

**Version:** 6.1.5 (Security & Reliability + Observability + Full Automation)
**Date:** 2025-10-21
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) | Haiku 4.5 for sub-agents
**Quality:** 8/8 critères via checkpoints MANDATORY every 10 tasks + Observability timeline + OWASP LLM Security

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
- **V6.1.5 NEW:** OWASP LLM Security (bashSandbox.cjs + validateGates.cjs + CI design-tokens-check.yml)
- **Quality Gates:** Enforce checkpoints every 10 tasks (Build P0 + ESLint P1 + Context7 P2 + Memory P3 + Observability P4)
- **Security:** OWASP LLM validation MANDATORY (prevents LLM01/LLM02/LLM05/LLM08 threats)
- Refer to **changelogs/V6.1.5/** as source of truth for current version

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
- **Checkpoints = MANDATORY** every 10 tasks (Build P0 + ESLint P1 + Context7 P2 + Memory P3 + Observability P4)
- **Security = ENFORCED** (OWASP LLM validation: bashSandbox.cjs + validateGates.cjs + CI) 🆕 V6.1.5
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
# Auto: ORCHESTRATION.md → Parse agents/tasks → Launch sequential (backend→frontend→testing)
# Checkpoints every 10 tasks: P-1 Security, P0 Build, P1 Lint, P2 Context7, P3 Memory, P4 Observability
# Output: Auto-docs (project-memory.md), task tracking, observability-pulse.jsonl, timeline (viewPulse.sh)
# Validated: AdProof.ai 2h45 (99 tasks, 150+ files, 12K+ lines) | Token -77% | Time -60%
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
- ⭐ [changelogs/V6.1.5/CHANGELOG-V6.1.5-SECURITY.md](./changelogs/V6.1.5/CHANGELOG-V6.1.5-SECURITY.md) - V6.1.5 security & reliability
- ⭐ [docs/SECURITY-OWASP-LLM.md](./docs/SECURITY-OWASP-LLM.md) - OWASP LLM threat model & mitigations
- ⭐ [WORKFLOW-V6-MVP.md](./docs/WORKFLOW-V6-MVP.md) - Complete workflow guide
- [changelogs/V6.1.3/CHANGELOG-V6.1.3-OBSERVABILITY.md](./changelogs/V6.1.3/CHANGELOG-V6.1.3-OBSERVABILITY.md) - V6.1.3 observability gate
- [changelogs/V6-MVP/CHANGELOG-V6-MVP.md](./changelogs/V6-MVP/CHANGELOG-V6-MVP.md) - V6 MVP baseline
- [changelogs/V5.1/CHANGELOG-V5.1-FINAL.md](./changelogs/V5.1/CHANGELOG-V5.1-FINAL.md) - V5.1 foundation

---

### Anti-Hallucination Principles

**Before proposing workflow changes:**
1. Read sources: ⭐WORKFLOW-V4-MULTI-DEVICE.md | START-HERE.md | CLAUDE.md
2. Verify: Compatible? Simplification OR over-engineering? Clear ROI?
3. Reference: Cite file section, show BEFORE/AFTER, justify
4. Wait approval: Explain → Wait OK → DON'T implement without agreement

**If workflow decided:** ❌ DON'T propose alternatives | ✅ DO apply validated ("Using X per WORKFLOW-V4 Phase Y")

**If native tool exists:** ❌ DON'T create 200-line script | ✅ DO use native (`claude mcp add-from-claude-desktop`)

**Rule:** Validated workflow = keep simple. New tool = justify 10× value.

---

## 🎨 DESIGN SYSTEM PHILOSOPHY ⭐

**CRITICAL: Design/Dev Decoupling from Day 1 - COMPETITIVE ADVANTAGE vs Lovable/Bolt/v0**

**Philosophy:** "Claude Code = logic. Human = brand. 15-min merge = custom product."

**Problem (Generic AI Tools):** Functional code BUT generic design (blue buttons, Inter font) → Customization = 1-2d refactor nightmare (hardcoded `bg-blue-600`)

**Archon Solution:**
- Day 1: `/speckit.design` → placeholder tokens (blue #3B82F6)
- Day 2-3: Develop with CSS variables ONLY (`bg-primary-500`)
- Day 4: Designer crafts custom brand in parallel (violet #8B5CF6)
- Day 4 (15 min): `/import-design` → UI transforms (automatic, 0 code changes)

**ENFORCE ALWAYS:**
✅ MUST: Generate design system Day 1 (NEVER skip) | Use CSS variables for ALL (colors, fonts, spacing) | NEVER hardcode (`bg-blue-600` → `bg-primary-500`) | Document tokens in spec.md | Remind user: "Designer can work parallel now"

❌ MUST NOT: Skip design system | Hardcode ANY color/font | Mix hardcoded + tokens | Modify tokens during dev

**Example:**
✅ `<button className="bg-primary-500 text-neutral-50 font-heading">Submit</button>` → /import-design changes primary-500: #3B82F6 → #8B5CF6 (0 code changes)
❌ `<button className="bg-blue-600 text-white font-sans">Submit</button>` → Brand change = touch 50+ components (1-2d nightmare)

**ROI:** Time: 15 min vs 1-2d (-95%) | Risk: 0 breaking changes (production-safe) | Quality: Custom vs generic (client perception: "real product, not template" = deal closer)

**Docs:** [GOLDEN-PATTERNS.md](./docs/GOLDEN-PATTERNS.md) - Design/Dev Decoupling

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

### ⚠️ ZEN MCP TOOL USAGE (CRITICAL - READ FIRST)

**MANDATORY:** When using Zen MCP for Gemini analysis, **ALWAYS** use the correct tool:

✅ **CORRECT:** `mcp__zen__clink` with `cli_name: "gemini"`
- Uses **Gemini CLI OAuth** (24h session, no API key needed)
- Works with active OAuth session (`gemini auth login`)
- Configured in `~/Documents/DEV/zen-mcp-server/conf/cli_clients/gemini.json`

❌ **WRONG:** `mcp__zen__chat` with `model: "gemini-2.5-pro"`
- Uses **Gemini REST API** (requires `GEMINI_API_KEY`)
- Will fail with "API key not valid" error
- NOT configured in this project

**Why This Matters:**
- Zen MCP has TWO interfaces: `chat` (API keys) and `clink` (OAuth CLI)
- Our setup uses **OAuth-only** (no API keys configured)
- Using wrong tool = authentication failure

**Example Usage:**
```typescript
// ✅ CORRECT
mcp__zen__clink({
  cli_name: "gemini",
  prompt: "Analyze this project..."
})

// ❌ WRONG (will fail)
mcp__zen__chat({
  model: "gemini-2.5-pro",
  prompt: "Analyze this project..."
})
```

**Verification:**
```bash
# Check OAuth session active
gemini auth status  # Should show: "Loaded cached credentials"

# Check Zen MCP connected
claude mcp list | grep zen  # Should show: "zen: ... ✓ Connected"
```

**Troubleshooting:**
- If OAuth expired: `gemini auth login`
- If Zen MCP disconnected: Restart Claude Code session
- See [ZEN-MCP-WORKFLOW-ORCHESTRATION.md](./docs/ZEN-MCP-WORKFLOW-ORCHESTRATION.md) for complete setup

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

**Status:** ✅ Production Ready | **Purpose:** Full automation (0 manual copy-paste)

```bash
/speckit.final [optional-project-path]
```

**Prerequisites (8 files):** ORCHESTRATION.md, constitution.md, spec.md, tasks.md, plan.md, design-tokens.json, project-memory.md, observability-pulse.jsonl (auto-created)

**Workflow:** Parse path → Verify files → Init logger → Parse agents → Load context → Execute agents (sequential: backend→frontend→testing) → Validate (build/lint/test) → Summary

**Agent Execution:**
- Context buffer check (>150K tokens → auto-save bundle)
- Implements allocated tasks (T001-T035)
- Checkpoints every 10 tasks (P-1 Security, P0 Build, P1 Lint, P2 Context7, P3 Memory, P4 Observability)
- Updates tasks.md + project-memory.md + observability-pulse.jsonl

**Quality Gates Enforced:**
- **P-1 Security:** OWASP LLM (bashSandbox.cjs) - BLOCKER
- **P0 Build:** Exit 1 if fails - BLOCKER
- **P1 Lint:** mcp__eslint__lint-files - BLOCKER
- **P2 Context7:** IF new library
- **P3 Memory:** project-memory.md updated
- **P4 Observability:** pulseLogger.cjs logging

**Validated (AdProof.ai):** 2h45 duration, 99 tasks, 150+ files, 12K+ lines | Build ✅ Lint ✅ Tests ✅

**When to use:** Planning complete, all prerequisites exist | **When NOT:** Prerequisites missing, want manual control

**Docs:** [WORKFLOW-V6-MVP.md](./docs/WORKFLOW-V6-MVP.md) | `.claude/commands/speckit.final.md` (331 lines)

---

### Quality Gates P-1 to P5 (V6.1.5 Complete)

**Standards (Enforce Always):**
- **P-1 Security:** OWASP LLM (bashSandbox.cjs validate/scan) - BLOCKER 🆕
- **P0 Build:** Code compiles - BLOCKER (exit 1 if fail)
- **P1 Lint:** mcp__eslint__lint-files - BLOCKER (TypeScript strict, no `any` except justified)
- **P2 Context7:** IF new library - mcp__context7__get-library-docs
- **P3 Memory:** project-memory.md updated (WHY decisions)
- **P4 Observability:** pulseLogger.cjs logging (agent coordination)
- **P5 Policy:** validateGates.cjs - JSON Schema compliance 🆕

**Commands:**
```bash
# Security (P-1)
node scripts/bashSandbox.cjs validate "<command>"
node scripts/bashSandbox.cjs scan specs/001-mvp/spec.md

# Observability (P4)
node scripts/pulseLogger.cjs start <agent> '{"tasks":35}'
node scripts/pulseLogger.cjs checkpoint <gate> <status> '{"data":"..."}'
node scripts/pulseLogger.cjs end <agent> '{"duration_s":450}'
./scripts/viewPulse.sh  # Timeline viewer

# Policy (P5)
node scripts/validateGates.cjs validate gates-data.json
```

**Minimum:** P0 Build ✅ + P1 Lint ✅ (P2-P5 verification)

**Standards:** E1 Architecture-First (ADR) | E2 Types (strict TypeScript) | E3 Tests (TDD) | E8 Gates | E11 Escalation (3-strike) | E16 Zero Trust (proofs)

**Docs:** [ZERO-TRUST.md](./docs/ZERO-TRUST.md)

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

**Entry points:** [START-HERE.md](./START-HERE.md) | ⭐[WORKFLOW-V4-MULTI-DEVICE.md](./docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md) | [INDEX.md](./INDEX.md)

**Setup:** [OAuth Guide](./docs/CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md) | [Jules Security](./docs/JULES-SECURITY-GUARDIAN-SETUP.md)

**Patterns:** [Agentic Patterns](./docs/AGENTIC-PATTERNS.md) | [Golden Patterns](./docs/GOLDEN-PATTERNS.md) | [Sub-Agents Mastery](./docs/SUB-AGENTS-MASTERY.md) | [Zen MCP](./docs/ZEN-MCP-WORKFLOW-ORCHESTRATION.md)

**Quality:** [Zero Trust](./docs/ZERO-TRUST.md) | [Context Mgmt](./docs/CONTEXT-MANAGEMENT-BEST-PRACTICES.md) | [Troubleshooting](./docs/TROUBLESHOOTING.md)

**Lessons:** [ReviewRescue Retex](./docs/RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md)

---

### Sonnet 4.5 Capabilities

**Source:** https://www.anthropic.com/news/claude-sonnet-4-5 (2025-09-29)

**Key:** 30+ hours focus | +18% planning | +12% end-to-end | 0% error rate (vs 9%) | Parallel tools | Self-testing | Checkpoints

**Workflow Impact:** Bootstrap -33% | Design -50% | Implementation -33% | Errors -100% | Complete MVP 3-4h (vs 2-3d manual)

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

**Status:** ✅ Production Ready | **Philosophy:** "Code = WHAT, Comments = HOW, **Memory = WHY**"
**ROI:** -90% onboarding, -75% refactoring research, -95% audit compliance

**Concept:** Living documentation that evolves with code (Phase 0 creation → Phase 2 agent updates → always current)

**File:** `project-memory.md` (10 sections: Identity, ADR, Design System, Patterns, Compliance, Critical Context, Runtime Decisions, Issues, Session Notes, References)

**When agents call `/update-memory`:**
✅ Architecture decisions (DB index, state mgmt, deployment)
✅ Performance optimizations (caching, query optimization, code splitting)
✅ Security measures (rate limiting, auth, encryption)
✅ Trade-offs accepted (simplicity vs performance, tech debt)
✅ Alternatives rejected (document WHY chosen option)

❌ DON'T document: Trivial changes, code comments, ADR duplicates, WIP

**Entry Quality Requirements:**
1. WHY documented (not just WHAT)
2. Trade-offs explicit (pros AND cons)
3. Alternatives considered (+ rejection reasons)
4. Validation concrete (numbers, tests, evidence)
5. Code snippet included
6. Quantified when possible (-80% time, +10% space)

**Example entry:** `#### 2025-10-15 GIN Index on JSONB` → Decision, Reason, Trade-offs (✅ -80% query time, ❌ +10% disk), Alternatives (B-tree rejected, ElasticSearch rejected), Validation (tested 100K products, p95 120ms)

**Benefits:**
- Self-documenting (never obsolete)
- Onboarding: 2-3h vs 2-3d (-90%)
- Refactoring: Skip redundant tests (-75%)
- Audit: 5 min vs 1-2d (-95%)
- Intentionality preserved (WHY > WHAT/HOW)

**Command:** `/update-memory` (interactive prompts: section, decision, reason, trade-offs, alternatives, validation)

**Docs:** [GOLDEN-PATTERNS.md](./docs/GOLDEN-PATTERNS.md) - Dynamic Memory Pattern V5 | `templates/project-memory-template.md`

---

## 🔄 5. CONTEXT BUNDLES (Disaster Recovery) 🆕

**Status:** ✅ Production Ready | **Philosophy:** "Automatic save points for long sessions"
**ROI:** -70% recovery time (15 min vs 2h45), 60-70% context recovered | **Source:** Dev Dan - Context Engineering ADV2

**Problem:** Agent 2h+ → context overflow → crash → ALL work lost (0% recovery)
**Solution:** Auto-logging → Bundle saved → `/loadbundle` → 60-70% recovery in 15 min

**Captured:** Files read (paths + ranges), Edits made, Commands executed, Decisions, Mental model, MCP tools used, Checkpoints passed
**NOT captured:** Full file contents, Conversation verbatim, Binaries

**Commands:**
```bash
/savebundle [name]              # Save checkpoint
/loadbundle <bundle-path>       # Restore after crash
```

**When to save:**
- Session 2h+ (long work)
- Context >150K tokens (getting full)
- Before risky ops (refactor, migration)
- End of day / Agent switch

**When to load:**
- Context overflow crash
- New session after long work
- Agent switch (need prior context)

**Recovery workflow:** Session 1 crashes at T034 → Session 2 loads bundle → 60-70% context recovered (mental model + files + commands) → Continue from T031 (4 tasks vs 35 redo) → Read project-memory.md (WHY) → Time saved: 2h

**vs project-memory.md:**
- Memory = WHY (permanent, entire project)
- Bundles = WHAT (temporary, single session)
- Use together: 80-90% effective recovery

**Benefits:**
1. Disaster recovery: 15 min vs 2h45 restart (-70%)
2. Agent continuity: Share context across agents
3. Risk mitigation: 2-3 min save vs 2h loss

**Integration:** `/speckit.final` auto-enables bundler → Each agent session logged → If overflow: bundle auto-saved → Relaunch with `/loadbundle`

**Storage:** `.agents/context-bundles/` (commit to git, clean >1 week old)

**Docs:** `.claude/commands/savebundle.md` | `scripts/contextBundler.cjs` | [AGENT-INTERACTION-PATTERNS.md](./docs/AGENT-INTERACTION-PATTERNS.md) - ADV2

---

## 📦 6. LIBRARY - REUSABLE COMPONENTS ✅ V7.0 PHASE 1 COMPLETE

**Status:** ✅ **Phase 1 Complete** (3/5 modules) | 🚧 Phase 2 Planned (UI + Database)
**Philosophy:** "Copy-paste intelligent, not repetitive coding"
**ROI Phase 1:** -97% setup time (9h → 15 min) for auth + payments + email

**Purpose:** Personal library of battle-tested modules to eliminate repetitive coding across projects.

### Architecture

**Hierarchical: Framework > Feature > Provider**
```
lib/
├── shared/              # Framework-agnostic (types, utils, schemas)
├── nextjs/              # Next.js 15 modules
│   ├── auth/supabase/   # ✅ READY (661 lines, 6 files)
│   ├── payments/stripe/ # ✅ READY (858 lines, 7 files)
│   ├── email/resend/    # ✅ READY (797 lines, 7 files)
│   ├── ui/              # 🚧 Phase 2 (design-tokens.json + shadcn/ui)
│   └── database/supabase/ # 🚧 Phase 2 (SQL migrations + RLS)
├── astro/               # 🔮 Phase 3 (when needed)
└── php/                 # 🔮 Phase 4 (when needed)
```

**Phase 1 Results (2025-10-22):**
- **2,316 lines** implemented
- **20 files** created
- **3 modules** production-ready
- **Battle-tested** patterns (Vercel + Supabase + Stripe + Resend)

### Workflow Integration

**Manual Integration (Phase 1):**

Until `/use-modules` command is built (Phase 2), manual copy:

```bash
# Copy modules to your project
cp -r ~/archon-orchestrator/lib/nextjs/auth/supabase src/lib/auth
cp -r ~/archon-orchestrator/lib/nextjs/payments/stripe src/lib/payments
cp -r ~/archon-orchestrator/lib/nextjs/email/resend src/lib/email

# Install dependencies
pnpm add @supabase/supabase-js @supabase/ssr stripe resend react-email

# Configure .env.local
# See lib/INTEGRATION-GUIDE.md for complete setup
```

**See:** [lib/INTEGRATION-GUIDE.md](./lib/INTEGRATION-GUIDE.md) for complete integration instructions

### Time Savings (Phase 1 Validated)

| Module | Before | After | Savings | Status |
|--------|--------|-------|---------|--------|
| Auth setup | 3h | 5 min | -94% | ✅ READY |
| Payments setup | 4h | 5 min | -96% | ✅ READY |
| Email setup | 2h | 5 min | -96% | ✅ READY |
| UI setup | 2h | TBD | TBD | 🚧 Phase 2 |
| Database setup | 1h | TBD | TBD | 🚧 Phase 2 |
| **Phase 1 Total** | **9h** | **15 min** | **-97%** | ✅ |

### Modules Implemented

**Phase 1 Complete (2025-10-22):**
1. ✅ **auth/supabase/** (661 lines) - Sign-in, sign-up, session management, middleware, hooks
2. ✅ **payments/stripe/** (858 lines) - Checkout, webhooks, portal, subscriptions, products
3. ✅ **email/resend/** (797 lines) - Send email, React Email templates (welcome, reset, invoice)

**Phase 2 Planned:**
4. 🚧 **ui/** - design-tokens.json + shadcn/ui components + Design Decoupling
5. 🚧 **database/supabase/** - SQL migrations + RLS policies + TypeScript types

**Source:** Adapted from Vercel Next.js SaaS Starter (14.7k stars, MIT license)

### Growth Strategy

**YAGNI Principle:** Develop frameworks as needed
- Phase 1: Next.js (now - 80% of projects)
- Phase 2: Astro (when first Astro project)
- Phase 3: PHP (when first PHP project)

### Key Principles

1. **Modular** - Copy only what you need
2. **Multi-framework** - Next.js, Astro, PHP support
3. **Provider-flexible** - Supabase/Clerk, Stripe/Lemon Squeezy
4. **Design Decoupling** - CSS variables (15-min rebrand)
5. **Battle-tested** - Based on Vercel starter + proven patterns

**Complete docs:**
- [lib/README.md](./lib/README.md) - Library overview
- [lib/INTEGRATION-GUIDE.md](./lib/INTEGRATION-GUIDE.md) - Integration instructions
- [docs/LIBRARY-ARCHITECTURE.md](./docs/LIBRARY-ARCHITECTURE.md) - Architecture design

---

**Version:** 6.1.5 + V7.0 Phase 1 (Security + Observability + Library)
**Date:** 2025-10-22
**Status:** ✅ **V6.1.5 PRODUCTION** + ✅ **V7.0 PHASE 1 COMPLETE**
**Next:** 🚧 **V7.0 Phase 2** - UI + Database modules (when needed)

*Workflow V6.1.5: Mac LOCAL + GitHub + Multi-IA + **Full Automation** + Dynamic Memory + **Observability Timeline** + **OWASP LLM Security** = Production MVPs at AI Speed* 🚀🔒🧠⚡📊🛡️

**V6.1.5 Results:**
- Time: -5-10 min overhead (100% automation) + -60% execution (Haiku 4.5)
- Token Savings: -77% with GLM-4.6 (450K→100K tokens implementation)
- Quality: Build ✅ Lint ✅ Tests ✅ Design Tokens 100% + **Observability ✅** + **OWASP LLM ✅**
- Security: CVSS 9.8 → 3.2 (67% risk reduction)
- Timeline: Complete logging (pulseLogger.cjs + viewPulse.sh + observability-pulse.jsonl)
- Validated: AdProof.ai MVP (99 tasks, 2h45, 150+ files, 12K+ lines)

**V7.0 Phase 1 Results:**
- ✅ 3 modules ready: Auth, Payments, Email
- ✅ 2,316 lines implemented (20 files)
- ✅ Setup time: -97% (9h → 15 min)
- ✅ Battle-tested patterns validated

**V7.0 Phase 2 Target:**
- UI module: Design Decoupling + shadcn/ui
- Database module: SQL migrations + RLS
- /use-modules command: Automated integration
