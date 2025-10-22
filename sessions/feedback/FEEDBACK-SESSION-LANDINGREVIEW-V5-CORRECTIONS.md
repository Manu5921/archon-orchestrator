# Feedback Session LandingRev - Corrections V5.1

**Date:** 2025-10-15
**Session:** LandingRev implementation (backend + frontend parallel)
**Status:** ⚠️ Succès partiel - Corrections identifiées
**Version:** V5 → V5.1 (MCP enforcement + memory logging strict)

---

## 🎯 RÉSUMÉ EXÉCUTIF

### ✅ Ce qui a MARCHÉ (5/8 critères)

1. ✅ **Parallélisation réelle** (18:01-18:04, 3min overlap backend+frontend)
2. ✅ **70 fichiers créés** (infrastructure complète en 3-4h)
3. ✅ **3 rapports détaillés** (33.5KB documentation)
4. ✅ **Design tokens respectés** (ZERO hardcoded colors)
5. ✅ **Constitution compliance** (8 principes respectés)

### ⚠️ Ce qui a été PARTIEL (3/8 critères)

6. ⚠️ **MCP Context7** : NON utilisé (agents = connaissances internes)
7. ⚠️ **MCP ESLint** : NON utilisé aux checkpoints (validation à la fin seulement)
8. ⚠️ **project-memory.md** : 1 décision documentée (vs 5-15 attendues)

**Score:** 5/8 (62.5%) → **PASS avec corrections nécessaires**

---

## 📊 DONNÉES FACTUELLES (Preuves Timestamps)

### Timeline Exécution

```
17:43-17:54 : Backend Phase 1+2 (T001-T046 Setup + Foundational)
17:54       : PHASE1-2-COMPLETE.md généré ✅

17:58-18:07 : Backend US1+US4 (scraper, prompts, API routes)
  17:58 : lib/scraper/robots-checker.ts
  17:58 : lib/scraper/rate-limiter.ts
  18:00 : lib/scraper/index.ts
  18:00 : lib/claude/prompts/structure.ts
  18:01 : lib/claude/prompts/ux.ts
  18:02 : lib/claude/prompts/seo.ts
  18:04 : app/api/audit/route.ts
  18:07 : lib/scraper/pii-scrubber.ts

18:01-18:04 : Frontend US1+US4 (components, pages) ⭐ PARALLÈLE ✅
  18:01 : app/(auth)/verify/page.tsx
  18:02 : components/usage/quota-display.tsx
  18:03 : components/layout/navbar.tsx
  18:03 : app/(dashboard)/page.tsx
  18:03 : app/(auth)/login/page.tsx
  18:03 : app/(auth)/signup/page.tsx
  18:03 : app/(dashboard)/audits/[id]/page.tsx
  18:04 : components/usage/upgrade-prompt.tsx

18:05 : FRONTEND-COMPLETE.md généré ✅
18:09 : BACKEND-US1-US4-REPORT.md généré ✅
```

**Overlap confirmé:** 18:01-18:04 = **3 minutes parallèles** (backend + frontend simultanés)

---

## 🔍 ANALYSE ROOT CAUSE (Pourquoi MCP/Notes manquantes)

### Problème 1: MCP Tools Non Utilisés

**Symptôme:**
- `mcp__context7__*` : 0 appel détecté dans rapports
- `mcp__eslint__lint-files` : 0 appel aux checkpoints

**Root Cause:**
```markdown
# Prompt agent (actuel V5)
**Utilise MCP tools** (Context7 pour docs, ESLint pour quality checks)
```

**Problème:** Instructions trop vagues (recommandation, pas obligation)

**Solution V5.1:**
```markdown
# Prompt agent (V5.1 strict)
**MANDATORY MCP CHECKPOINTS (Every 10 tasks):**

After T010, T020, T030, T040, T050, you MUST execute:

1. ✅ ESLint validation (BLOCKER if errors):
   ```bash
   mcp__eslint__lint-files [
     "/absolute/path/to/file1.ts",
     "/absolute/path/to/file2.tsx"
   ]
   ```
   **If errors:** FIX before continuing to next 10 tasks

2. ✅ Context7 docs (if using new library):
   ```bash
   # Example: First time using Stripe in this session
   mcp__context7__resolve-library-id {"libraryName": "stripe"}
   mcp__context7__get-library-docs {"context7CompatibleLibraryID": "/stripe/stripe-node"}
   ```
   **Verify:** No breaking changes since your training cutoff

3. ✅ Progress verification:
   ```bash
   grep "^\- \[x\]" tasks.md | wc -l
   # Should match completed task count (10, 20, 30...)
   ```
```

**Impact:** Passe de "recommandation" à "obligation avec validation"

---

### Problème 2: Memory Logging Minimal

**Symptôme:**
- `project-memory.md` : 1 seule entrée (vs 5-15 attendues)
- Décisions NON documentées : 7+ (Puppeteer choice, rate limiting, polling intervals, cache TTL, RLS design, shadcn/ui choice, webhook idempotency)

**Root Cause:**
```markdown
# CLAUDE.md Section 6 (actuel V5)
**CRITICAL RULE:** At the end of EVERY significant task, sub-agents MUST call `/update-memory` automatically.
```

**Problème:** "MUST" pas enforced (pas de vérification, pas de blocage)

**Solution V5.1:**
```markdown
# CLAUDE.md Section 6 (V5.1 strict)
**CRITICAL RULE:** After EVERY significant decision, STOP and document BEFORE continuing.

**Enforcement (Every 10 Tasks Checkpoint):**

```bash
# Verify memory updated
memory_entries=$(grep "^#### $(date +%Y-%m-%d)" .specify/memory/project-memory.md | wc -l)

if [ $memory_entries -eq 0 ]; then
  echo "❌ CHECKPOINT FAILED: No memory entries today"
  echo "You MUST document at least 1 decision in last 10 tasks"
  echo "Common triggers: library choice, architecture decision, trade-off accepted"
  exit 1
fi

echo "✅ Memory checkpoint PASS: $memory_entries entries documented"
```

**Significant Decision Triggers (Exhaustive List):**

1. **Library Choice:**
   - Chose library A over B (e.g., Puppeteer vs Playwright)
   - Document: Why A, alternatives rejected, trade-offs

2. **Architecture Decision:**
   - State management approach (Context vs Zustand vs Redux)
   - Caching strategy (Redis vs in-memory vs edge)
   - Rate limiting design (Redis-based, sliding window)

3. **Configuration Values:**
   - Polling intervals (3s → 5s → 10s - WHY these values?)
   - Cache TTL (24h - WHY not 1h or 48h?)
   - Retry attempts (3× - WHY not 5× or 1×?)
   - Timeout values (120s Lambda - WHY not 60s or 180s?)

4. **Trade-off Accepted:**
   - Simplicity over performance (document cost)
   - Cost over latency (document impact)
   - Technical debt accepted (document repayment plan)

5. **Security Measure:**
   - RLS policy design (document per-table rationale)
   - Webhook signature verification (document why mandatory)
   - Environment secret handling (document storage strategy)

**Template Enforcement:**

EVERY memory entry MUST include (non-negotiable):
1. ✅ **WHY** documented (not just WHAT)
2. ✅ **Trade-offs** explicit (pros AND cons)
3. ✅ **Alternatives** considered (≥2 options rejected)
4. ✅ **Validation** concrete (metrics, tests, evidence)
5. ✅ **Code snippet** included (SQL/TypeScript/config)
6. ✅ **Quantified** when possible (-X% time, +Y% cost)
```

**Impact:** Passe de "MUST call /update-memory" à "CHECKPOINT BLOCKS if not documented"

---

### Problème 3: Build Errors Découverts Tard

**Symptôme:**
- 7 erreurs TypeScript découvertes APRÈS implémentation complète
- Sentry imports manquants (6 fichiers)
- Supabase helper non trouvé (1 fichier)

**Root Cause:**
- ESLint pas appelé aux checkpoints (every 10 tasks)
- Build check seulement à la fin

**Solution V5.1:**
```markdown
**Quality Gates (Every 10 Tasks - MANDATORY):**

```bash
# 1. Build check (P0 BLOCKER)
pnpm build
if [ $? -ne 0 ]; then
  echo "❌ BUILD FAILED - FIX before continuing"
  exit 1
fi

# 2. Lint check (P1 HIGH)
mcp__eslint__lint-files ["/absolute/paths/to/modified/files.ts"]
# If errors → FIX before continuing
# Warnings acceptable (document in report)

# 3. Task progress (P2 TRACKING)
completed=$(grep "^\- \[x\]" tasks.md | wc -l)
echo "✅ Progress: $completed tasks completed"

# 4. Memory documentation (P2 DOCUMENTATION)
memory_entries=$(grep "^#### $(date +%Y-%m-%d)" project-memory.md | wc -l)
echo "✅ Memory: $memory_entries decisions documented today"

# ALL gates must PASS before continuing to next 10 tasks
```
```

**Impact:** Détection erreurs every 10 tasks (vs à la fin)

---

## 📝 CORRECTIONS APPLIQUÉES V5.1

### Correction 1: `/speckit.agents.md` - MCP Checkpoints MANDATORY

**File:** `/Users/manu/.claude/commands/speckit.agents.md`

**Section modifiée:** Step 4 - Generate Orchestration Prompt

**AVANT (V5 - Recommandation vague):**
```markdown
**MCP Tools (IF ORCHESTRATION.md specifies):**
- `mcp__context7__get-library-docs`: Just-in-time API documentation
- `mcp__zen__chat`: Brainstorming, design decisions
- `mcp__zen__thinkdeep`: Deep debugging, systematic analysis
- `mcp__eslint__lint-files`: Inline quality validation
```

**APRÈS (V5.1 - Obligation stricte):**
```markdown
**MCP CHECKPOINTS (MANDATORY Every 10 Tasks):**

After T010, T020, T030, T040, T050, etc., you MUST execute:

### Checkpoint 1: ESLint Validation (P1 BLOCKER)

```bash
mcp__eslint__lint-files [
  "/absolute/path/to/file1.ts",
  "/absolute/path/to/file2.tsx",
  # ... all files modified in last 10 tasks
]

# If errors → STOP and FIX before continuing
# Warnings acceptable (document in checkpoint report)
```

### Checkpoint 2: Context7 Docs (IF new library used)

```bash
# Example: First time using library in this session
mcp__context7__resolve-library-id {"libraryName": "stripe"}
mcp__context7__get-library-docs {
  "context7CompatibleLibraryID": "/stripe/stripe-node",
  "topic": "webhooks"
}

# Verify: No breaking changes since training cutoff
```

### Checkpoint 3: Build Validation (P0 BLOCKER)

```bash
pnpm build
# If fails → STOP, FIX, retry checkpoint
```

### Checkpoint 4: Memory Documentation (P2 DOCUMENTATION)

```bash
# Verify at least 1 decision documented in last 10 tasks
grep "^#### $(date +%Y-%m-%d)" project-memory.md | wc -l
# Should be >0 if significant decisions made
```

**ALL checkpoints must PASS before continuing to next 10 tasks.**
```

---

### Correction 2: `CLAUDE-template.md` - Section 6 Enforcement

**File:** `/Users/manu/Documents/DEV/archon-orchestrator/.specify/templates/CLAUDE-template.md`

**Section modifiée:** Section 6 - project-memory.md Auto-Documentation

**AJOUT (V5.1 - Verification stricte):**
```markdown
### Checkpoint Verification (Every 10 Tasks)

**MANDATORY verification at T010, T020, T030, etc.:**

```bash
# Count today's memory entries
memory_today=$(grep "^#### $(date +%Y-%m-%d)" .specify/memory/project-memory.md | wc -l)

# Expected: 1-2 entries per 10 tasks (if significant decisions)
if [ $memory_today -eq 0 ] && [ $tasks_completed -ge 10 ]; then
  echo "⚠️  WARNING: 10+ tasks completed, 0 decisions documented"
  echo "Review last 10 tasks for undocumented decisions:"
  echo "- Library choices (Puppeteer vs Playwright?)"
  echo "- Configuration values (polling 3s - why not 5s?)"
  echo "- Architecture patterns (state management choice?)"
  echo "- Trade-offs accepted (simplicity vs performance?)"
  echo ""
  echo "If NO significant decisions → OK to continue"
  echo "If decisions made → STOP and document before continuing"
fi
```

**Exhaustive Decision Triggers:**

Document in project-memory.md when you:

1. ✅ Choose library A over B (e.g., Zod vs Yup, shadcn vs MUI)
2. ✅ Accept trade-off (e.g., polling vs webhooks, cost vs latency)
3. ✅ Set configuration value (e.g., cache TTL 24h, retry 3×, timeout 120s)
4. ✅ Design architecture (e.g., monolith vs microservices, REST vs GraphQL)
5. ✅ Implement security (e.g., RLS policies, rate limiting strategy)
6. ✅ Add dependency (e.g., why Stripe vs Lemon Squeezy)
7. ✅ Reject alternative (e.g., considered ElasticSearch but chose Postgres full-text)

**Format non-negotiable (7 criteria):**

Every entry MUST include:
1. ✅ **WHY** (reason for decision, not just what)
2. ✅ **Trade-offs** (pros AND cons explicit)
3. ✅ **Alternatives** (≥2 options considered and rejected)
4. ✅ **Validation** (metrics, tests, benchmarks)
5. ✅ **Code snippet** (SQL DDL, TypeScript, config)
6. ✅ **Quantified** (percentages, times, costs when possible)
7. ✅ **Timestamped** (YYYY-MM-DD + agent name)
```

---

### Correction 3: `/speckit.implement.md` - Quality Gates Enforcement

**File:** `/Users/manu/.claude/commands/speckit.implement.md`

**Section modifiée:** Step 8 - V5 ENHANCED

**RENFORCEMENT (V5.1 - Blocage si échec):**
```markdown
**Quality Gates (Every 10 Tasks - BLOCKING):**

```bash
# ============================================
# CHECKPOINT AFTER T010, T020, T030, T040...
# ============================================

echo "🔍 Quality Gate Checkpoint (Tasks $(grep '^\- \[x\]' tasks.md | wc -l))"

# Gate 1: Build Check (P0 BLOCKER)
echo "1/4 Build check..."
pnpm build
if [ $? -ne 0 ]; then
  echo "❌ GATE 1 FAILED: Build errors detected"
  echo "STOP: Fix build errors before continuing"
  exit 1
fi
echo "✅ Gate 1 PASS"

# Gate 2: Lint Check (P1 HIGH)
echo "2/4 Lint check..."
mcp__eslint__lint-files [
  "/absolute/path/to/file1.ts",
  "/absolute/path/to/file2.tsx"
  # ... all files modified in last 10 tasks
]
# If errors → Document in checkpoint report + FIX
# Warnings acceptable (continue)
echo "✅ Gate 2 PASS"

# Gate 3: Task Progress (P2 TRACKING)
echo "3/4 Task progress..."
completed=$(grep "^\- \[x\]" tasks.md | wc -l)
echo "✅ Gate 3 PASS: $completed tasks completed"

# Gate 4: Memory Documentation (P2 DOCUMENTATION)
echo "4/4 Memory documentation..."
memory_today=$(grep "^#### $(date +%Y-%m-%d)" project-memory.md | wc -l)
if [ $memory_today -eq 0 ] && [ $completed -ge 10 ]; then
  echo "⚠️  WARNING: No decisions documented today"
  echo "Review triggers in CLAUDE.md Section 6"
fi
echo "✅ Gate 4 CHECK: $memory_today decisions documented"

echo ""
echo "✅ ALL GATES PASSED - Continue to next 10 tasks"
```
```

---

## 📊 MÉTRIQUES ATTENDUES V5.1

### Avant (V5 Actuel)

| Métrique | V5 Actuel | Cible V5.1 |
|----------|-----------|------------|
| **MCP Context7 calls** | 0 | 2-5 (new libraries) |
| **MCP ESLint calls** | 0 | 5-8 (every 10 tasks) |
| **Memory entries** | 1 | 5-15 |
| **Build errors discovered** | End (7 errors) | Every 10 tasks (0-2 per checkpoint) |
| **Checkpoints passed** | N/A | 5-8 (every 10 tasks) |

---

## ✅ VALIDATION TESTS V5.1

### Test 1: LandingRev Phase 3 (Replay avec V5.1)

**Scenario:** Re-run implementation avec corrections V5.1

**Expected Behavior:**

1. ✅ **T010 Checkpoint:**
   - ESLint called on 10 modified files
   - Build check passes
   - Context7 called for Stripe SDK (new library)
   - 1 memory entry: "Stripe webhook idempotency strategy"

2. ✅ **T020 Checkpoint:**
   - ESLint called on next 10 files
   - Build check passes
   - Context7 called for Puppeteer (new library)
   - 1 memory entry: "Puppeteer vs Playwright choice"

3. ✅ **T030 Checkpoint:**
   - ESLint called
   - Build check passes
   - 1 memory entry: "Rate limiting Redis-based design"

4. ✅ **T040 Checkpoint:**
   - ESLint called
   - Build check passes
   - 1 memory entry: "Polling intervals 3s→5s→10s rationale"

5. ✅ **T050 Checkpoint:**
   - ESLint called
   - Build check FAILS (Sentry import missing)
   - STOP: Fix before T051
   - After fix: Re-run checkpoint
   - 1 memory entry: "Sentry error tracking integration"

**Result:** 5 checkpoints, 5 memory entries, 5 ESLint calls, 2 Context7 calls, 1 build error caught early

---

### Test 2: TRM Project (Research - Different Strategy)

**Expected Behavior:**

- ESLint: NOT applicable (Python project)
- Context7: 3-5 calls (PyTorch, lucidrains/TRM, py-sudoku)
- Memory: 10-15 entries (experiments, hypothesis, trade-offs)
- Checkpoints: learning_log.md verification (daily entries)

---

## 🎯 CRITÈRES SUCCÈS V5.1

**Validation complète si 8/8 critères PASS:**

- [ ] Parallélisation fonctionne (overlap timestamps)
- [ ] MCP Context7 appelé (2-5× pour nouvelles libraries)
- [ ] MCP ESLint appelé (every 10 tasks checkpoints)
- [ ] Memory entries ≥5 (décisions architecturales documentées)
- [ ] Build errors détectés early (checkpoints, pas end)
- [ ] Checkpoints passed (5-8 gates executed)
- [ ] Design tokens respectés (0 hardcoded colors)
- [ ] Constitution compliance (8 principes)

**Si 7/8 PASS → GO Production V5.1** ✅

---

## 📚 FICHIERS MODIFIÉS V5.1

1. `/Users/manu/.claude/commands/speckit.agents.md` (MCP checkpoints mandatory)
2. `/Users/manu/Documents/DEV/archon-orchestrator/.specify/templates/CLAUDE-template.md` (Section 6 enforcement)
3. `/Users/manu/.claude/commands/speckit.implement.md` (Quality gates blocking)

---

## 🚀 PROCHAINES ÉTAPES

1. **Appliquer corrections V5.1** (3 fichiers modifiés)
2. **Tester sur TRM** (research project, validation memory logging)
3. **Re-tester sur LandingRev Phase 3** (replay avec checkpoints stricts)
4. **Documenter résultats** (V5 vs V5.1 comparison)
5. **Décision GO/NO-GO V5.1 Production** (7/8 critères minimum)

---

**Version:** V5.1 (MCP Enforcement + Memory Logging Strict)
**Date:** 2025-10-15
**Status:** ⚠️ Corrections identifiées, implémentation en cours
**Test Projects:** LandingRev (production) + TRM (research)

*"Make checkpoints mandatory, not optional - enforce quality at every 10 tasks"* 🔒
