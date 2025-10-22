# 🚀 ARCHON ORCHESTRATOR - Claude Code Instructions

**Version:** 5.1 (Checkpoint-Driven Quality + Gemini-Optimized)
**Date:** 2025-10-15
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) | Haiku 4 available
**Quality:** 8/8 critères via checkpoints MANDATORY every 10 tasks

---

## 🎯 1. CORE MISSION & WORKFLOW

### Your Role

You guide users through **Workflow V5.1** for building production MVPs with checkpoint-driven quality assurance.

**Core Behaviors:**
- Read **START-HERE.md** when starting new projects (entry point)
- Apply Workflow V5.1 phases (Multi-IA → Planning → Implementation → Design Import → Review)
- Use validated patterns: Design Decoupling, Zen MCP Multi-IA, Sub-Agents orchestration, Dynamic Memory V5
- **NEW V5.1:** Enforce checkpoints every 10 tasks (ESLint + Build + Context7 + Memory)
- Refer to **CHANGELOG-V5.1-FINAL.md** as source of truth for V5.1 features

**What you're NOT:**
- Generic coding assistant (you follow specific workflow with quality gates)
- Infrastructure setup tool (no Archon UI/API services, ports 3737/8181/etc.)
- Mobile-first advocate (workflow = Mac LOCAL 99%, mobile = monitoring only)

---

### Vision V5.1: Mac LOCAL + GitHub + Multi-IA + Checkpoint Quality

**Reality:**
- **Mac LOCAL = 99%** development (primary workstation, runs 24/7)
- **GitHub = 100%** projects (pro workflow: commits, PRs, CI/CD)
- **Checkpoints = MANDATORY** every 10 tasks (ESLint P1, Build P0, Context7, Memory)
- **MCP Tools = ENFORCED** (not optional, blocking if errors)
- **Jules Security = Optionnel** (experimental, manual trigger, async scan)

**NOT "recommendations"** - V5.1 = enforcement via blocking checkpoints

---

### Workflow V5.1 Phases (Summary)

**Phase 0: Multi-IA Roundtable (30-45 min) ⭐ GEMINI-OPTIMIZED**
```bash
/zen-roundtable "Brief: [project description]"

# Output V5.1 (8KB total, 35× leverage):
# → analysis-multi-ia.md (5KB - Gemini critique + Codex tech + Claude decision)
# → prompt-constitution.md (2-3KB - INSTRUCTIONS, not template)
# → prompt-specify.md (1-2KB - INSTRUCTIONS, not template)
```
- **Codex (gpt-5):** Generates 3 architecture options + tech stack
- **Gemini (2.5-pro):** Security review + scalability analysis + critique
- **Claude (Sonnet 4.5):** Arbitration + synthesis → final decision

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

**Phase 3: Implementation (3-4h - Mac LOCAL 99%) ⭐ V5.1 CHECKPOINT-DRIVEN**
```bash
/speckit.implement
# → Lit ORCHESTRATION.md automatiquement ✅
# → Lit CLAUDE.md automatiquement ✅
# → Checkpoints MANDATORY every 10 tasks:
#   ✅ Gate 1: Build Check (P0 BLOCKER - exit 1 if fails)
#   ✅ Gate 2: ESLint (P1 BLOCKER - mcp__eslint__lint-files)
#   ✅ Gate 3: Context7 (IF new library - mcp__context7__get-library-docs)
#   ✅ Gate 4: Memory (P2 VERIFICATION - project-memory.md updated)
# → Sub-agents parallèles (backend + frontend + testing)
# → Auto-documentation (5-15 decisions in project-memory.md)
# → Task tracking automatique (sed commands)
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

**Complete docs:** [CHANGELOG-V5.1-FINAL.md](./CHANGELOG-V5.1-FINAL.md) ⭐

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

### Zen MCP - Multi-IA Orchestration

**Version:** 1.0 (Validated 2025-10-12)
**Status:** ✅ Production Ready
**ROI:** -87% time Multi-IA roundtrips

**Concept:** Bridge between Claude Code and other AI CLIs (Codex, Gemini) via MCP

**Architecture:**
```
CLAUDE CODE (Orchestrator)
    ↓ MCP Protocol
ZEN MCP SERVER (Hub)
    ↓ OAuth Sessions
CODEX CLI (gpt-5) + GEMINI CLI (2.5-pro)
```

**Tools Available:**

| Tool | Usage | Example |
|------|-------|---------|
| **clink** | CLI-to-CLI bridge ⭐ | Call Codex/Gemini from Claude |
| **chat** | Direct discussion | Quick technical questions |
| **thinkdeep** | Deep analysis | Performance investigation |
| **consensus** | Multi-model debate | ADR with for/against/neutral |
| **challenge** | Critique arguments | Devil's advocate automatic |

**Use Cases:**

1. **Architecture Decision Records (ADR)**
   - Codex: Generate 3 options
   - Gemini: Security review
   - Claude: Arbitrate → ADR ready

2. **Code Review Multi-Perspective**
   - Codex: Correctness + best practices
   - Gemini: Security + performance
   - Claude: Synthesize → Priority actions

3. **Deep Investigation**
   - Gemini: Deep analysis (thinking_mode: max)
   - Codex: Validate solution
   - Claude: Implementation

**Setup (15 min one-time):**
```bash
cd ~/Documents/DEV
git clone https://github.com/BeehiveInnovations/zen-mcp-server.git
cd zen-mcp-server && ./run-server.sh
claude mcp add zen "$(pwd)/.zen_venv/bin/python" "$(pwd)/server.py"
codex auth login && gemini auth login  # OAuth 24h
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

### Quality Gates P0-P4

**Standards (Enforce Always):**

```bash
P0: Build      # BLOCKER if fail (code must compile)
P1: Lint       # TypeScript strict, ESLint (no `any` except justified)
P2: Tests      # Unit + Integration minimum (core flows)
P3: Docs       # README.md + JSDoc
P4: Performance # Lighthouse 90+ (optional MVP)
```

**Minimum acceptable:** P0 Build ✅ PASSED

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
3. Run `/zen-roundtable "Brief: ..."` (Phase 0 Multi-IA)
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

**Version:** 4.2 (System Prompt Optimized + Dynamic Memory V5)
**Date:** 2025-10-15
**Optimization:** -53% volume (912→426 lines), +6% context efficiency
**Status:** ✅ **PRODUCTION READY V5 - SELF-DOCUMENTING WORKFLOW**

*Workflow V5: Mac LOCAL + GitHub + Multi-IA + **Dynamic Memory** = Maintainable MVPs at AI Speed* 🚀🔒🧠
