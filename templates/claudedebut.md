# 🚀 Project Workflow - Claude Code V6.2.1

**Status:** Setup phase (rename this to `CLAUDE.md` in your project)
**Workflow:** Spec-Kit V6.2.1 (Gemini Analysis → Planning → Full Automation + Multi-Framework + AI Design)
**Version:** 6.2.1 (Multi-Framework Support + AI Design Workflow)
**Date:** 2025-11-21

---

## 🧠 Session Startup Protocol (Zero Trust)

**BEFORE any work in existing project, ALWAYS:**

1. **Read project-memory.md** (if exists) → Last 3 sessions + runtime decisions
2. **Read latest CHANGELOG** (if exists) → Recent work (last 48h)
3. **Apply Zero Trust:** VERIFY current state before PROPOSING changes

**Commands:**
```bash
# Check recent work
git log --oneline --since="2 days ago"

# Read memory
grep -A 5 "Session.*Phase" project-memory.md 2>/dev/null | tail -20

# Read latest CHANGELOGs
ls -lt changelogs/V*/CHANGELOG-*.md 2>/dev/null | head -3
```

**Principle:** Don't trust your own memory. Verify facts before proposing.

---

## 🎯 Quick Start Commands

Follow these commands **in order** for complete workflow:

### Phase 0: Project Analysis (5-10 min) - OPTIONAL

```bash
/zen-roundtable "Brief: [Your project description here]"
# Generates: prompt-constitution.md + prompt-specify.md + project-memory.md
# Output: 8KB total (analysis-multi-ia.md + constitution/specify prompts)
```

**Skip if:** You already have clear project vision.

---

### Phase 1: Spec-Kit Planning (30-35 min)

Execute **IN THIS EXACT ORDER:**

```bash
# Step 1: Create constitution (business/high-level governance)
/speckit.constitution
# → Output: .specify/memory/constitution.md (60-90s REAL generation)

# Step 2: Create technical specification
/speckit.specify
# → Output: specs/001-mvp/spec.md (90-120s REAL generation)

# Step 3: Initialize project + update this CLAUDE.md
/speckit.init
# → Output: CLAUDE.md + project-memory.md + ci-template.yml

# Step 4: Create design system (⭐ NEVER SKIP - Design/Dev Decoupling)
/speckit.design
# → Output: design-tokens.json + wireframes/ + components-list.md

# Step 5: Create implementation plan
/speckit.plan
# → Output: specs/001-mvp/plan.md

# Step 6: Create tasks list (50-100 tasks CHECKBOXES format)
/speckit.tasks
# → Output: specs/001-mvp/tasks.md

# Step 7: Create sub-agents orchestration
/speckit.agents
# → Output: ORCHESTRATION.md + observability-pulse.jsonl (empty)
```

**CRITICAL ORDER:** tasks BEFORE agents (agents needs tasks.md)

---

### Phase 2: GitHub Setup (2 min)

```bash
# Create feature branch
git checkout -b feat/mvp

# Commit bootstrap files
git add .
git commit -m "feat: init MVP structure

- Constitution + Spec + Design system
- ORCHESTRATION.md with 3 agents
- Tasks breakdown (50-100 tasks)

🤖 Generated with Claude Code V6.1.3
Co-Authored-By: Claude <noreply@anthropic.com>"

# Push and create PR
git push -u origin feat/mvp
gh pr create --title "feat: MVP Implementation" --body "..."
```

---

### Phase 3: Implementation (2h45-3h) ⭐ V6.1.3 FULL AUTOMATION + OBSERVABILITY

```bash
/speckit.final
```

**What happens:**
- ✅ Reads ORCHESTRATION.md + CLAUDE.md automatically
- ✅ Launches 3 agents sequentially (backend → frontend → testing)
- ✅ **Checkpoints MANDATORY every 10 tasks (5 gates):**
  - **Gate P0:** Build (BLOCKER - exit 1 if fails)
  - **Gate P1:** ESLint (BLOCKER - mcp__eslint__lint-files)
  - **Gate P2:** Context7 (IF new library - mcp__context7__get-library-docs)
  - **Gate P3:** Memory (VERIFICATION - project-memory.md updated)
  - **Gate P4:** Observability (TIMELINE - pulseLogger.cjs logging) 🆕 V6.1.3
- ✅ Auto-documentation (5-15 decisions in project-memory.md)
- ✅ Task tracking automatic (sed commands)
- ✅ Real-time observability (observability-pulse.jsonl)
- ✅ Timeline logging (viewPulse.sh viewer)

**Validated:** 2h45 on AdProof.ai (99 tasks, 150+ files, 12K+ lines)
**Token Savings:** -77% with GLM-4.6 (450K→100K implementation tokens)

---

### Phase 4: Verification (5 min)

```bash
# View observability timeline
./scripts/viewPulse.sh
# → Color-coded timeline with checkpoints

# View pulse summary
node scripts/pulseLogger.cjs summary
# → JSON metrics (agents, duration, checkpoints)

# Verify build
pnpm build
# → Expected: Build succeeds (0 errors)

# Verify lint
pnpm lint
# → Expected: 0 errors (warnings acceptable if documented)

# Run tests
pnpm test
# → Expected: Tests pass (or TDD RED state with tests written)

# Check design tokens compliance
grep -r "bg-blue-\|bg-red-\|text-blue-" src/ | wc -l
# → Expected: 0 (all colors from design-tokens.json)
```

---

### Phase 5: Design Import (15 min) - OPTIONAL

```bash
/import-design custom-tokens.json
# Merge your brand colors + fonts (0 breaking changes)
# Time: 15 min vs 1-2 days manual refactor
```

**When:** After designer creates custom brand (in parallel with Phase 3)

---

### Phase 6: Review + Merge (15 min)

```bash
# View PR on GitHub
gh pr view --web

# Review changes
gh pr diff

# Approve and merge
gh pr review --approve
gh pr merge --squash

# Switch to main
git checkout main
git pull

# Delete feature branch
git branch -D feat/mvp
git push origin --delete feat/mvp
```

---

### Phase 7: Context Bundles (Disaster Recovery) - OPTIONAL 🆕

**Purpose:** Save session state for fast recovery if context overflows during long sessions (2h+)

**Save Bundle (Manual):**
```bash
# During long work session (1-2h in)
/savebundle backend-specialist-checkpoint

# Emergency save if context approaching limit
/savebundle emergency-save-mvp-90-percent-done
```

**Load Bundle (After Context Overflow):**
```bash
# New session after crash
/loadbundle .agents/context-bundles/backend-specialist-checkpoint.md

# ✅ Recovers 60-70% context in 15 min
# Read project-memory.md for WHY (complements bundle WHAT)
# Continue from checkpoint
```

**Automatic Logging:**

Context bundler automatically logs during `/speckit.final`:
- Files read
- Edits made
- Commands executed
- Decisions documented

**Bundle Location:** `.agents/context-bundles/YYYY-MM-DD_HH-MM_session.md`

**When Useful:**
- Long sessions (2h+) where context might overflow
- Before risky operations (major refactors)
- Agent handoffs (backend → frontend)

**ROI:** -70% recovery time (15 min vs 2h45 if context crashes)

**Complementary with project-memory.md:**
- **Bundles** = Session snapshots (WHAT done)
- **Memory** = Project decisions (WHY done)
- **Together** = 80-90% effective recovery

---

## 📋 Project Context

### Project Identity
- **Name:** [TBD - filled by /speckit.init]
- **Vision:** [TBD - filled by /speckit.init]
- **Phase:** Setup → Planning → Implementation → Review

### Tech Stack
[TBD - filled by /speckit.init after /speckit.specify]

**Recommended Stack (Spec-Kit Standard):**
- **Frontend:** Next.js 15 + TypeScript strict + Tailwind + shadcn/ui
- **Backend:** Vercel Serverless Functions + Supabase (PostgreSQL + Auth + RLS)
- **Testing:** Vitest (unit) + Playwright (E2E)
- **Deploy:** Vercel (HTTPS auto, Edge Network)

### Key Dates
- **Kickoff:** [TBD]
- **MVP Target:** [TBD]
- **Launch Target:** [TBD]

---

## 📚 Documentation Files

After running Spec-Kit commands, these files will exist:

| File | Generated By | Purpose |
|------|--------------|---------|
| `.specify/memory/constitution.md` | `/speckit.constitution` | Business vision + HIGH-LEVEL decisions |
| `specs/001-mvp/spec.md` | `/speckit.specify` | Technical specification (SQL + API + architecture) |
| `project-memory.md` | `/speckit.init` | Dynamic Memory V5 (WHY behind decisions) |
| `specs/001-mvp/plan.md` | `/speckit.plan` | Implementation plan (file structure + architecture) |
| `specs/001-mvp/tasks.md` | `/speckit.tasks` | 50-100 tasks in CHECKBOXES format (T001, [P], [US1]) |
| `ORCHESTRATION.md` | `/speckit.agents` | Sub-agents allocation + strategy |
| `design/design-tokens.json` | `/speckit.design` | CSS variables (colors, fonts, spacing) |
| `design/wireframes/` | `/speckit.design` | SVG wireframes (low-fidelity mockups) |
| `design/components-list.md` | `/speckit.design` | shadcn/ui components used |
| `observability-pulse.jsonl` | `/speckit.agents` | Timeline logging (JSONL append-only) 🆕 V6.1.3 |

---

## 🎨 Design System

**CRITICAL:** Design/Dev Decoupling from Day 1

### ✅ MUST DO:
- Generate design tokens on Day 1 (`/speckit.design`)
- Use CSS variables ONLY in components: `bg-primary-500` (not `bg-blue-600`)
- All colors/fonts from design-tokens.json
- Read design-tokens.json before writing any component

### ❌ MUST NOT:
- Hardcode colors in components (breaks on brand refresh)
- Mix hardcoded + token approach (inconsistent)
- Skip `/speckit.design` (causes friction later)

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

**Phase 5 Bonus:** `/import-design custom-tokens.json` merges your brand in 15 min

---

## ⚡ Quality Gates (MANDATORY Every 10 Tasks) - V6.1.3

| Gate | Priority | Enforcement | Check Command |
|------|----------|-------------|----------------|
| **Build** | P0 BLOCKER | Must pass (exit 1 if fails) | `pnpm build` |
| **Lint** | P1 BLOCKER | 0 errors (mcp__eslint__lint-files) | `pnpm lint` |
| **Context7** | P2 VERIFICATION | IF new library | `mcp__context7__get-library-docs` |
| **Memory** | P3 VERIFICATION | project-memory.md updated | Check 5-15 decisions logged |
| **Observability** | P4 TIMELINE | pulseLogger.cjs logging 🆕 | `node scripts/pulseLogger.cjs summary` |

### Observability Commands (Gate P4) 🆕 V6.1.3

**Agent Start (ONCE per agent):**
```bash
node scripts/pulseLogger.cjs start backend-specialist '{"tasks":35,"focus":"API implementation"}'
```

**Checkpoints (P0/P1/P2/P3 after every 10 tasks):**
```bash
node scripts/pulseLogger.cjs checkpoint build pass '{"exit_code":0,"duration_ms":2340}'
node scripts/pulseLogger.cjs checkpoint lint pass '{"warnings":3,"errors":0}'
node scripts/pulseLogger.cjs checkpoint context7 skip '{"reason":"no new libraries"}'
node scripts/pulseLogger.cjs checkpoint memory pass '{"decisions_documented":2}'
```

**Agent End (ONCE per agent):**
```bash
node scripts/pulseLogger.cjs end backend-specialist '{"duration_s":450,"tasks_completed":35,"files_modified":23}'
```

**Summary (anytime):**
```bash
node scripts/pulseLogger.cjs summary
# → JSON metrics: agents count, duration, checkpoints, errors
```

**Timeline Viewer (after completion):**
```bash
./scripts/viewPulse.sh
# → Color-coded timeline with checkpoints
```

---

## 🔷 Framework-Specific Rules (Multi-Framework Support) 🆕 V6.2.1

**Philosophy:** Archon = Multi-Framework "LEGO" System. Rules adapt based on detected framework.

**Framework Detection (auto-applied by Claude):**
- **Next.js:** package.json contains `"next"` OR presence of `app/` directory
- **Astro:** package.json contains `"astro"` OR presence of `astro.config.*`
- **PHP:** composer.json exists OR presence of `.php` files

**Apply ONLY rules matching detected framework. Skip others.**

### 🔷 Next.js 15 App Router (SI détecté)

**App Router Architecture:**
- ALWAYS use Server Actions for mutations (file: `actions.ts` colocated with page)
- ALWAYS use `async` components with `React.use()` for data fetching (not `useEffect`)
- NEVER use `'use client'` directive without explicit interactivity need (forms, animations, browser APIs only)
- ALWAYS use `redirect()` from `next/navigation` (not `useRouter().push()` in Server Actions)

**Data Fetching & State:**
- ALWAYS fetch data in Server Components (default async/await, no loading states needed)
- ONLY use `'use client'` + React hooks (useState, useEffect) when component needs client-side state
- ALWAYS use Server Actions for forms (not API routes `/app/api/`)

**Design Tokens:**
- ALWAYS use Tailwind classes referencing design-tokens.json (e.g., `bg-primary-500`)
- NEVER hardcode colors/fonts (e.g., ❌ `bg-blue-600`, ❌ `font-sans`)

**Supabase Integration (if lib/nextjs/auth/supabase/ used):**
- ALWAYS use `@supabase/ssr` (not `@supabase/supabase-js`) in Server Components
- ALWAYS verify RLS policy exists BEFORE creating table/mutation

### 🔶 Astro 5 Landing Pages (SI détecté)

**Component Architecture:**
- ALWAYS use `.astro` components for static content (0 KB JavaScript shipped)
- ONLY use React/Vue islands with `client:load` or `client:visible` for interactive elements (forms, modals)
- NEVER use client-side frameworks for static content (Hero, Features, Testimonials = pure Astro)
- ALWAYS import from `lib/astro/ui/components/` (NEVER re-code existing components)

**Available Components (ALWAYS reuse):**
- **Layout (4):** Layout, Header, Footer, Container
- **Marketing (8):** Hero, Features, Pricing, Testimonials, CTA, FAQ, Stats, LogoCloud
- **Forms (3):** ContactForm, NewsletterForm, WaitlistForm (React islands with `client:load`)
- **SEO (3):** SEO, Schema, Analytics

**Design Tokens (CRITICAL - ALWAYS enforce):**
- ALWAYS use design-tokens.css variables (e.g., `var(--color-primary-500)`)
- NEVER hardcode colors/fonts (e.g., ❌ `#3B82F6`, ❌ `16px`, ❌ `Inter`)
- ALWAYS preserve Design/Dev Decoupling (15-min rebrand via `/import-design`)

**Performance (Lighthouse 100/100 target):**
- ALWAYS target LCP <1.0s (vs 2.5s Next.js - Astro advantage)
- NEVER ship JavaScript for static components (0 KB baseline)
- ALWAYS use `loading="eager"` for Hero images (above fold)
- ALWAYS use `loading="lazy"` for below-fold images

**Common Mistakes to AVOID:**
- ❌ Using React hooks in `.astro` files (islands only)
- ❌ Hardcoding colors instead of design-tokens.css variables
- ❌ Shipping JavaScript for static content (Hero, Features, etc.)
- ❌ Re-coding Hero/Features/Pricing (already exists in lib/astro/ui/)

### 🔸 PHP Laravel (SI détecté) 🔮 FUTURE

**Status:** 🔮 Phase 4 (when first PHP project)

**Placeholder rules (to be defined):**
- ALWAYS use Eloquent ORM (not raw SQL queries)
- ALWAYS use Laravel validation (not manual checks)
- ALWAYS use Blade templates (not raw PHP echo)

---

## 🎨 AI Design Workflow (Gemini 3.0 Pro) 🆕 V6.2.1

**Philosophy:** "Design devient commodité, pas artisanat - 3 variants en 15 min"

**Status:** ✅ Production Ready (Gemini 3.0 Pro via Zen MCP)
**ROI:** -85% temps exploration (3-4h Figma → 15-20 min AI generation)
**Quality:** 80% designer humain moyen (parfait pour 90% projets SaaS B2B)

### Workflow Complet (25-30 min total)

**Phase 1: Brief Design (5 min)**

Fill `.design/brief-template.md` with:
- **Target audience:** Role (CMO, CTO), age, tech level, budget
- **Emotion to convey:** Trust, Innovation, Premium, Friendly (check boxes)
- **Design references:** Linear, Stripe, Vercel (what you like from each)
- **Anti-references:** What NOT to do (generic blue, neon colors, etc.)
- **Constraints:** WCAG level, dark mode, mobile-first, animation level

**Phase 2: AI Generation (Manual - V6.2.1)**

Use Gemini 3.0 Pro via Zen MCP (or chat):

```bash
"Based on this brief + constitution.md + spec.md, generate 3 design directions.

For each direction, provide:
- Design philosophy (2-3 sentences)
- Complete design-tokens.[json|css] (framework-aware)
- Color palette reasoning
- Typography choices

Output format: [Next.js JSON / Astro CSS / PHP SCSS]"
```

**Phase 3: Preview RÉEL (10-15 min)**

**CRITICAL:** Validate sur preview deploy, PAS mockup IA

```bash
# For each variant, create preview branch + deploy
git checkout -b design/v1-trust-blue
cp .design/tokens-history/v1-trust-blue.* design-tokens.*
vercel deploy --prod=false  # Note preview URL

# Result: 3 preview URLs to compare
✅ v1-trust-blue: https://project-v1.vercel.app
✅ v2-tech-purple: https://project-v2.vercel.app
✅ v3-premium-mono: https://project-v3.vercel.app
```

**Phase 4: Selection & Application (2-3 min)**

```bash
# Apply selected design
cp .design/tokens-history/v2-tech-purple.* design-tokens.*
git add design-tokens.* .design/
git commit -m "Design: Apply v2-tech-purple (AI-generated)"
```

### When to Use AI Design

**✅ Perfect For:**
- MVPs / SaaS B2B (90% of Archon projects)
- Exploration phase (need 3+ variants fast)
- Tight budget (<€500 design)
- Solo dev (no designer available)

**⚠️ Use with Caution:**
- Premium projects (€50K+ client) → AI base + designer polish

**❌ Not Recommended:**
- Luxury brands (€100K+ budgets)
- Artistic/creative agencies (need 100% original)

### Hybrid Workflow (Best of Both Worlds)

For premium projects:
```
Phase 1: Brief (5 min) → You
Phase 2: AI Generation (15 min) → Gemini 3.0 Pro (3 variants)
Phase 3: Preview (10 min) → Vercel/Netlify (validate REAL renders)
Phase 4: Selection (5 min) → You + Client
Phase 5: Polish (1h) → Designer humain (refine "Wow" factor)
Phase 6: Apply (5 min) → /import-design

Total: 1h40 (vs 3-4h full designer)
Cost: €500 (vs €2000 full designer)
Quality: ⭐⭐⭐⭐ (vs ⭐⭐⭐⭐⭐ full designer)
```

---

## 🔗 Key References

**Archon Orchestrator V6.2.1:**
- [WORKFLOW-V6-MVP.md](https://github.com/BeehiveInnovations/archon-orchestrator/blob/main/docs/WORKFLOW-V6-MVP.md) - Complete workflow
- [CHANGELOG-V6.1.3-OBSERVABILITY.md](https://github.com/BeehiveInnovations/archon-orchestrator/blob/main/changelogs/V6.1.3/CHANGELOG-V6.1.3-OBSERVABILITY.md) - V6.1.3 features
- [GOLDEN-PATTERNS.md](https://github.com/BeehiveInnovations/archon-orchestrator/blob/main/docs/GOLDEN-PATTERNS.md) - Design/Dev Decoupling

**Spec-Kit Official:**
- https://github.com/github/spec-kit (official docs)

**Patterns Applied:**
- Design/Dev Decoupling strategy (15 min brand merge)
- Dynamic Memory V5 (agent-writable during implementation)
- Quality gates framework (5 gates enforced)
- Sub-agents orchestration (backend → frontend → testing)
- Observability timeline (pulseLogger.cjs + viewPulse.sh) 🆕 V6.1.3

**Documentation in Project:**
- `constitution.md` - Business decisions
- `spec.md` - Technical details
- `project-memory.md` - WHY behind implementation choices
- `plan.md` - File structure + architecture
- `tasks.md` - Implementation tasks (50-100 checkboxes)
- `ORCHESTRATION.md` - Sub-agents allocation
- `observability-pulse.jsonl` - Timeline events (JSONL) 🆕 V6.1.3

---

## 🚨 Workflow Tips

### If Confused, Follow This Order:
1. Read this file (you're here!)
2. Run Phase 0: `/zen-roundtable` (optional if vision clear)
3. Run Phase 1 commands **IN ORDER** (don't skip steps)
4. Read generated `constitution.md` + `spec.md`
5. Run Phase 2-3: GitHub + `/speckit.final`
6. Monitor observability: `./scripts/viewPulse.sh` 🆕 V6.1.3

### Common Questions:

**Q: Can I run commands out of order?**
A: No. Follow the order exactly. `/speckit.init` depends on `/speckit.constitution` + `/speckit.specify` outputs.

**Q: Should I skip `/speckit.design`?**
A: NO. Design/Dev decoupling is mandatory. Takes 5 min, saves 1-2 days of refactoring later.

**Q: What is observability-pulse.jsonl?** 🆕 V6.1.3
A: Timeline log (JSONL format). Each line = 1 event (agent_start, checkpoint, agent_end). Used for debugging, metrics, agent coordination.

**Q: What if a command fails?**
A: Check the error message. Most issues = missing prerequisites. Ensure previous steps completed.

**Q: When do I modify this file?**
A: `/speckit.init` will automatically enrich this CLAUDE.md with project-specific context (tech stack, dates, team).

**Q: How do I monitor agent progress?** 🆕 V6.1.3
A: Run `node scripts/pulseLogger.cjs summary` or `./scripts/viewPulse.sh` to see real-time timeline.

### Help & Debugging:

- **Command not found?** → Ensure Claude Code has access to slash commands
- **Permission denied?** → `chmod +x scripts/*.sh`
- **Design tokens missing?** → Run `/speckit.design` (never skip)
- **Lost in workflow?** → Check `project-memory.md` (session notes at bottom)
- **Observability not working?** → Verify `scripts/pulseLogger.cjs` exists (created by `/speckit.agents`)
- **Timeline empty?** → Check `observability-pulse.jsonl` has events (should have ~15-20 lines after completion)

---

## 📊 Timeline Estimate

| Phase | Duration | What Happens |
|-------|----------|--------------|
| **Phase 0** | 5-10 min | Gemini analysis → prompts generated (OPTIONAL) |
| **Phase 1** | 30-35 min | Spec-Kit planning (constitution + spec + design + plan + tasks + agents) |
| **Phase 2** | 2 min | Git branch + commit + PR |
| **Phase 3** | 2h45-3h | Implementation (sub-agents + checkpoints + observability) ⭐ |
| **Phase 4** | 5 min | Verification (build + lint + tests + timeline) |
| **Phase 5** | 15 min | Design import (optional, only if custom brand) |
| **Phase 6** | 15 min | PR review + merge |
| **TOTAL** | ~4-5 hours | Complete MVP ready for production |

**Validated on AdProof.ai MVP:**
- 99 tasks, 150+ files, 12,000+ lines
- Build ✅ | Lint ✅ | Tests ✅ | Design Tokens 100% | Observability ✅
- Token Savings: -77% with GLM-4.6 (450K→100K)

---

## 🎯 Success = Follow Order Exactly

✅ **Next step after reading this file:**

```bash
# Option A: With Multi-IA Analysis (30-45 min)
/zen-roundtable "Brief: [Paste your project description]"

# Option B: Skip to Planning (if vision clear)
/speckit.constitution
```

Then watch this file get enriched by `/speckit.init` with project-specific context! 🚀

---

## 📈 Metrics & ROI (V6.1.3 Validated)

**Time Savings:**
- Overhead: -5 to -10 min (100% automation, 0 copy-paste)
- Execution: -60% (2h45 vs 6-7h estimate)
- Token Savings: -77% implementation (GLM-4.6: 450K→100K)

**Quality:**
- Build: ✅ PASS (P0 blocker enforced)
- Lint: ✅ PASS (P1 blocker enforced)
- Tests: ✅ READY (TDD approach)
- Design Tokens: 100% (0 hardcoded colors)
- Observability: ✅ Complete timeline (15-20 events logged)

**Capacity:**
- Clients/week: 8-12 projects
- Revenue/month: €80K-€100K (@ €2,500/client)
- Cost/month: €140 (Claude Pro + MCP)
- ROI: ×571 to ×714

---

**Generated:** Archon V6.1.3 (Observability Complete)
**Last Updated:** 2025-10-17
**Template Location:** `templates/claudedebut.md`
**Usage:** Copy to new project root as `CLAUDE.md`

**Next Enhancement:** Via `/speckit.init` → enrich tech stack + project identity

---

**🆕 V6.1.3 Features:**
- ✅ Gate P4 Observability (pulseLogger.cjs + viewPulse.sh)
- ✅ Complete Automation (`/speckit.final` - 0 manual steps)
- ✅ 5 Quality Gates ENFORCED (Build + Lint + Context7 + Memory + Observability)
- ✅ Agent Coordination (timeline tracking enables multi-agent sync)
- ✅ Token Savings (-77% implementation with GLM-4.6)
- ✅ Validated (AdProof.ai MVP: 99 tasks, 2h45, 150+ files)

**Mac LOCAL 99% + Full Automation + Complete Observability = Production MVPs at AI Speed** 🚀🔒📊
