# Prompt de Reprise - Session du 15 Octobre 2025

**Date Session Précédente:** 14 octobre 2025
**Date Session Actuelle:** 15 octobre 2025
**Objectif:** Phase 5 - Tester Workflow V5 avec Codex + Nouveau Projet

---

## 📋 CONTEXTE DERNIÈRE SESSION (14 OCTOBRE)

### Ce qui a été accompli

#### 1. CLAUDE.md Pattern - Standardisé dans Spec-Kit V5 ✅ COMPLETE

**Problème identifié:**
- `/speckit.agents` générait `orchestration-prompt.md` SANS lire `CLAUDE.md`
- Résultat: Agents ne connaissaient pas règles projet (checkboxes, MCP tools, auto-documentation)
- Friction: tasks.md généré avec headers `###` au lieu de checkboxes `- [ ]`

**Solution implémentée:**
- ✅ Modifié `/Users/manu/.claude/commands/speckit.agents.md` (6 edits)
- ✅ CLAUDE.md ajouté à Step 1 (lecture automatique)
- ✅ Multi-session parallelization documentée (backend/frontend/testing)
- ✅ Task tracking mandatory (`sed` commands dans orchestration)
- ✅ Memory documentation mandatory (`/update-memory` after decisions)
- ✅ Quality gates enhanced (P0-P4 + task progress + docs)

**Modifications détaillées:**

**Edit 1 - Step 1: CLAUDE.md Standard**
```markdown
Read these files (IN ORDER):
- CLAUDE.md ⭐ **NEW V5** (agent instructions, MCP tools, auto-documentation rules)
Extract:
- **Agent Rules:** From CLAUDE.md (task tracking, memory documentation, MCP usage)
```

**Edit 2 - Step 2: Testing Parallèle**
```markdown
3. **testing-specialist** ⭐ **V5: PARALLEL SESSION RECOMMENDED**
   - Execution: SEPARATE session (Claude Code OR Codex via Zen MCP)
   - Parallelization: Tests Phase N while backend/frontend implement Phase N+1
```

**Edit 3 - Execution Strategy: Multi-Session**
```markdown
Session 1 (Main): backend-specialist → API + business logic
      ║ SIMULTANEOUS ✅
      ╠══ Session 2: frontend-specialist → UI components
      ╚══ Session 3: testing-specialist (Codex via Zen MCP) → E2E tests

Time saved: ~2-3h (30% faster vs sequential)
```

**Edit 4 - Context Management: Task + Memory Tracking**
```markdown
**Task Tracking (From CLAUDE.md):** ⭐ **NEW V5**
sed -i 's/- \[ \] T001/- \[x\] T001/' specs/001-mvp/tasks.md

**Memory Documentation (From CLAUDE.md):** ⭐ **NEW V5**
/update-memory
# Expected: 5-15 entries after full implementation
```

**Edit 5 - Quality Gates: Checkpoints Every 10 Tasks**
```markdown
# 3. Task tracking (Progress Gate) ⭐ NEW V5
grep "^\- \[x\]" specs/001-mvp/tasks.md | wc -l

# 4. Memory documentation (Documentation Gate) ⭐ NEW V5
grep "^#### $(date +%Y-%m-%d)" .specify/memory/project-memory.md | wc -l
```

**Edit 6 - Final Prompt Template**
```markdown
Context:
- Agent Instructions: CLAUDE.md ⭐ **NEW V5** (workflow rules, MCP tools)

⭐ **V5 Testing Strategy:** Tests will be executed in PARALLEL SESSION
(Codex via Zen MCP OR separate Claude session)
```

**Résultat:**
- ✅ CLAUDE.md pattern maintenant STANDARD dans tous futurs projets
- ✅ Orchestration-prompt.md lira CLAUDE.md automatiquement
- ✅ Testing parallèle documenté (Codex recommandé)
- ✅ Task tracking + memory documentation mandatory

**Documentation mise à jour:**
- ✅ `docs/WORKFLOW-V5-CLAUDE-MD.md` - Phase 3 enhanced avec 6 improvements V5

---

#### 2. LegalGuard Project - Phase 1 Complete ✅

**Project:** LegalGuard - Legal AI Chatbot for SMEs (French/Belgian market)

**Status Phase 1 (T001-T013):**
- ✅ Next.js 14.2.10 initialized (TypeScript strict, App Router, Tailwind)
- ✅ Design tokens configured (Indigo primary #6366F1, Teal secondary #14B8A6)
- ✅ Core dependencies installed (20+ packages: Supabase, OpenAI, Pinecone, Stripe, Zod)
- ✅ Environment variables template created
- ✅ ESLint + Prettier + Husky configured
- ✅ Supabase local instance initialized
- ✅ Database schema migrated (10 tables with RLS policies, indexes, audit triggers)
- ✅ Supabase client utilities created
- ✅ TypeScript types generated from database schema
- ✅ Build passes + Lint passes + Type check passes

**Quality Gates P0-P2:**
- ✅ P0 Build: PASSED
- ✅ P1 Lint: PASSED
- ✅ P2 Database: PASSED (10 tables, RLS enabled, audit triggers active)

**Runtime Decision Documented:**
```markdown
#### 2025-10-14 Database Multi-Tenant RLS Strategy

**Decision:** Supabase Row-Level Security (RLS) for multi-tenant isolation
**Reason:** Enforce data isolation at PostgreSQL level (defense-in-depth)
**Trade-offs:**
- ✅ Pros: Security by default, automatic isolation, SQL injection mitigation
- ❌ Cons: Performance overhead (~5-10ms), complexity for admin queries
**Alternatives Considered:**
- Application-level filtering: Rejected (error-prone, security risk)
- Separate database per tenant: Rejected (overkill, cost inefficient)
**Validation:** RLS policies tested via psql, migration applied successfully
```

**Next Steps LegalGuard:**
- Phase 2: API endpoints authentication (T014-T025)
- Phase 2: RAG pipeline implementation (T026-T040)
- Phase 2: Document generation service (T041-T050)

**Files:**
- `.specify/memory/project-memory.md` - 11 sections, runtime decisions section 7
- `CLAUDE.md` - Agent instructions (workflow, MCP tools, auto-documentation)
- `specs/001-legalguard-mvp-legal/tasks.md` - 97 tasks (97 checkboxes ✅, 0 headers ✅)
- `specs/001-legalguard-mvp-legal/spec.md` - Technical specification
- `.github/workflows/ci-template.yml` - GitHub Actions template

**Leçon:**
- tasks.md initially generated with headers `###` → User manually corrected to checkboxes
- Root cause: `/speckit.agents` didn't read CLAUDE.md → NOW FIXED ✅

---

## 🎯 OBJECTIFS SESSION ACTUELLE (15 OCTOBRE)

### Phase 5: Test Workflow V5 Complet avec Codex (3-4h)

**Objectif:** Valider workflow V5 end-to-end sur nouveau projet avec testing parallèle via Codex

**Pourquoi nouveau projet (pas LegalGuard) ?**
1. **Validation clean slate:** LegalGuard Phase 1 fait AVANT modifications `/speckit.agents`
2. **Test complet workflow:** Nouveau projet = Phase 0 → Phase 1 → Phase 2 avec V5 complet
3. **Validation CLAUDE.md pattern:** Vérifier orchestration-prompt.md lit bien CLAUDE.md maintenant
4. **Test Codex testing:** LegalGuard testing pas encore fait → Nouveau projet = test complet

**Hypothèse à valider:**
> "Avec CLAUDE.md standard + Codex testing parallèle, workflow V5 produit MVP fonctionnel en 4-5h avec 0 friction (vs 2 projets redémarrés en V4)"

---

### Test 1: Nouveau Projet - Phase 0 + Phase 1 (1-2h)

**Projet Test:** InventoryFlow - Gestion stock e-commerce

**Brief:**
```
MVP SaaS de gestion de stock pour e-commerce (Shopify/WooCommerce).

Features:
- Synchronisation automatique stock (API Shopify/WooCommerce)
- Alertes stock bas (email + SMS via Twilio)
- Dashboard analytics (ventes, mouvements stock, prévisions)
- Multi-entrepôt (géolocalisation, transferts inter-entrepôts)
- Historique mouvements (audit trail)

Tech Stack:
- Frontend: Next.js 14 (App Router), React 18, TypeScript strict
- Backend: Supabase (Auth + PostgreSQL + Realtime), Prisma ORM
- External APIs: Shopify Admin API, WooCommerce REST API, Twilio
- Styling: Tailwind CSS + shadcn/ui (Design/Dev Decoupling)
- Testing: Playwright (E2E), Vitest (unit)
- Hosting: Vercel (EU region for RGPD)

Timeline: 4 semaines MVP
Client: E-commerce agencies (10-50 clients), SaaS B2B, €49/month pricing
Constraints: Budget limité, besoin intégrations Shopify/WooCommerce robustes
```

**Procédure:**

```bash
# 1. Setup projet
cd ~/Documents/DEV/
mkdir InventoryFlow && cd InventoryFlow
git init

# 2. Copy templates V5 (CLAUDE.md + ci-template.yml)
cp ~/Documents/DEV/archon-orchestrator/.specify/templates/CLAUDE-template.md ./CLAUDE.md
mkdir -p .github/workflows
cp ~/Documents/DEV/archon-orchestrator/.specify/templates/ci-template.yml ./.github/workflows/ci-template.yml

# 3. Phase 0: Multi-IA Roundtable
/zen-roundtable "[PASTE BRIEF CI-DESSUS]"

# Validation Phase 0:
# - ✅ .specify/memory/constitution.md créé
# - ✅ specs/001-mvp/spec.md créé
# - ✅ .specify/memory/project-memory.md créé (⭐ DYNAMIC MEMORY V5)

# 4. Adapter CLAUDE.md (sections 7-8 avec tech stack + constraints from constitution.md)
# Lire constitution.md
cat .specify/memory/constitution.md

# Éditer CLAUDE.md
# - Section 7: Tech Stack (copier depuis constitution.md)
# - Section 8: Constraints (budget, intégrations Shopify/WooCommerce, RGPD)

# 5. Phase 1: Spec-Kit Planning
/speckit.design  # Design tokens + wireframes
/speckit.plan    # Implementation plan
/speckit.tasks   # Task breakdown (⭐ VÉRIFIER CHECKBOXES, PAS HEADERS)

# 6. Validation tasks.md CRITIQUE
grep -c "^- \[ \]" specs/001-mvp/tasks.md  # → Should be 50-100 tasks
grep "^### T[0-9]" specs/001-mvp/tasks.md  # → Should return 0 results ✅

# Si headers détectés → ÉCHEC IMMÉDIAT (pattern CLAUDE.md pas respecté)
# → Signaler problème, vérifier /speckit.agents modifications

# 7. Phase 2: GitHub Setup
# Instruction simple (CLAUDE.md section 2)
# "Lis CLAUDE.md puis génère la partie GitHub"

# Agent devrait exécuter automatiquement:
# - Copy ci-template.yml → ci.yml (+ replace placeholders)
# - Create branch 001-inventoryflow-mvp
# - Commit with exact format
# - Push to remote
# - Create PR

# Validation GitHub Setup:
# - ✅ ci.yml créé avec placeholders remplacés (InventoryFlow, pnpm, Node 20)
# - ✅ Branch créée
# - ✅ Commit avec format exact (no questions asked)
# - ✅ 0 friction (agent ne pose PAS de questions)
```

**Validation Phase 0 + Phase 1:**
- [ ] constitution.md, spec.md, project-memory.md créés (3 fichiers)
- [ ] project-memory.md contient sections 1-10 (Dynamic Memory V5)
- [ ] tasks.md contient checkboxes ONLY (0 headers `###`) ⭐ CRITIQUE
- [ ] CLAUDE.md adapté (tech stack + constraints from constitution)
- [ ] design-tokens.json généré (placeholder tokens)
- [ ] GitHub setup 0 friction (no questions)

**Success Criteria Phase 1:**
- ✅ tasks.md format CORRECT (checkboxes, not headers)
- ✅ GitHub setup automated (0 questions, exact commit format)
- ✅ Time: Phase 0-1 completed in ≤30 min

**Si Phase 1 FAILED:**
- ❌ tasks.md avec headers → `/speckit.agents` modifications pas effectives
- ❌ GitHub setup pose questions → CLAUDE.md section 2 pas lue
- → STOP, debug, fix before Phase 2

---

### Test 2: Phase 2 Implementation - Multi-Session avec Codex (2-3h)

**Objectif:** Tester orchestration multi-session (Claude backend/frontend + Codex testing)

**Procédure:**

```bash
# 1. Generate orchestration prompt (NOW reads CLAUDE.md ✅)
/speckit.agents

# Validation orchestration-prompt.md:
# - ✅ Contient référence CLAUDE.md
# - ✅ Contient task tracking rules (sed commands)
# - ✅ Contient memory documentation rules (/update-memory mandatory)
# - ✅ Contient multi-session parallelization strategy
# - ✅ Contient testing-specialist PARALLEL SESSION RECOMMENDED

# 2. Session 1 (Main - Claude): Backend + Frontend Implementation
/implement

# Agent backend-specialist devrait:
# - Lire CLAUDE.md (section 5: MCP tools, section 6: auto-documentation)
# - Implement T001-T050 (setup + API + auth + integrations Shopify/WooCommerce)
# - Mark tasks complete: sed -i 's/- \[ \] T001/- \[x\] T001/' tasks.md
# - Call /update-memory after significant decisions (auth, API integration, webhook handling)
# - Check quality gates every 10 tasks (build, lint, task progress, memory docs)

# Agent frontend-specialist devrait:
# - Lire CLAUDE.md (design/dev decoupling: CSS variables ONLY)
# - Implement T051-T080 (UI dashboard + components shadcn/ui)
# - Use design-tokens.json (bg-primary-500, NOT bg-blue-600)
# - Mark tasks complete in tasks.md
# - Call /update-memory after UI architecture decisions

# 3. Session 2 (Parallel - Codex via Zen MCP): Testing ⭐ NEW V5

# Option A: Via Zen MCP clink (RECOMMENDED if prompts <25K tokens)
mcp__zen__clink(
  cli_name="codex",
  prompt="Read InventoryFlow project context (specs, CLAUDE.md, tasks.md).
  Implement testing-specialist role (T081-T100):
  - E2E tests Playwright (auth flow, stock sync, alerts, dashboard)
  - Unit tests Vitest (API routes, webhooks, calculations)
  - Integration tests (Shopify/WooCommerce API mocks)

  Use CLAUDE.md section 5 for quality gates.
  Mark tasks complete in tasks.md.
  Call /update-memory after test architecture decisions.

  Report: Pass/fail counts, coverage %, blockers."
)

# Option B: Separate Claude session (if clink prompt too large)
# Open new terminal → claude
# Paste orchestration-prompt.md testing-specialist section
# Execute tests while Session 1 continues implementation

# 4. Validation Multi-Session (after 2-3h)

# Session 1 (Claude - Backend/Frontend):
grep "^\- \[x\]" specs/001-mvp/tasks.md | wc -l
# Expected: 50-80 tasks completed (depends on project size)

# Session 2 (Codex - Testing):
# Expected:
# - E2E tests créés (spec files in tests/e2e/)
# - Unit tests créés (spec files in tests/unit/)
# - Test report: X/Y tests passed, coverage Z%

# Memory documentation:
grep "^#### $(date +%Y-%m-%d)" .specify/memory/project-memory.md | wc -l
# Expected: 5-15 runtime decisions documented

# Quality gates:
pnpm build  # Should pass ✅
pnpm lint   # Should pass ✅
pnpm test   # Should pass ≥80% ✅
```

**Validation Phase 2:**
- [ ] Backend-specialist implemented T001-T050 (API + auth + integrations)
- [ ] Frontend-specialist implemented T051-T080 (UI + dashboard)
- [ ] Testing-specialist (Codex) implemented T081-T100 (E2E + unit tests)
- [ ] Tasks marked complete in tasks.md (≥50 tasks checked)
- [ ] Runtime decisions documented in project-memory.md (≥5 entries)
- [ ] Quality gates passed (build ✅, lint ✅, tests ✅)
- [ ] Design/Dev Decoupling respected (CSS variables only, no hardcoded colors)

**Success Criteria Phase 2:**
- ✅ Multi-session parallelization worked (Claude + Codex simultaneous)
- ✅ Task tracking automatic (sed commands executed by agents)
- ✅ Memory documentation present (≥5 quality entries)
- ✅ Time saved: 2-3h via parallelization (vs 4-5h sequential)

**Si Phase 2 FAILED:**
- ❌ Codex session couldn't access project context → Zen MCP config issue
- ❌ Tasks not marked complete → sed commands missing in orchestration-prompt.md
- ❌ Memory documentation absent → /update-memory not called by agents
- → Analyze orchestration-prompt.md, verify CLAUDE.md was read

---

### Test 3: Validation End-to-End + Comparison V4 vs V5 (30 min)

**Objectif:** Comparer friction V4 (LegalGuard) vs V5 (InventoryFlow)

**Métriques à comparer:**

| Metric | LegalGuard (V4) | InventoryFlow (V5) | Target V5 |
|--------|-----------------|---------------------|-----------|
| **tasks.md format** | ❌ Headers (manually fixed) | ✅ Checkboxes | ✅ Checkboxes |
| **GitHub setup** | ⚠️ Questions asked | ✅ 0 questions | ✅ 0 questions |
| **Task tracking** | ❌ Manual | ✅ Automatic | ✅ Automatic |
| **Memory docs** | ⚠️ Manual (1 entry) | ✅ 5-15 entries | ✅ 5-15 entries |
| **Testing strategy** | ⚠️ Sequential | ✅ Parallel (Codex) | ✅ Parallel |
| **Time Phase 0-2** | ~4h | ~3h | ≤3h (-25%) |
| **Restarts required** | 0 (but manual fixes) | 0 | 0 |

**Validation Qualitative:**

**Questions à répondre:**
1. **tasks.md généré correct dès le départ ?** (checkboxes, not headers)
2. **GitHub setup 0 friction ?** (no questions, exact commit format)
3. **Task tracking automatic ?** (agents mark tasks complete via sed)
4. **Memory documentation quality ?** (5-15 entries, 7/7 quality score)
5. **Multi-session parallelization fonctionnel ?** (Claude + Codex simultaneous)
6. **Design/Dev Decoupling respecté ?** (CSS variables only)
7. **Workflow deterministic ?** (same results every run, no interpretation)

**Success Criteria V5:**
- ✅ 7/7 questions answered positively
- ✅ Time ≤3h (vs 4h V4)
- ✅ 0 friction (vs manual fixes V4)
- ✅ 0 restarts (vs 2 restarts projects historiques)

**Si 5/7 ou plus → GO Production V5 ✅**
**Si 3/7 ou moins → Iterate V5 ⚠️**

---

## 📊 DÉCISION GO/NO-GO V5 PRODUCTION

### Si V5 Concluant ✅ (5/7 criteria met)

**Critères de succès:**
- ✅ tasks.md format correct (checkboxes dès génération)
- ✅ GitHub setup automated (0 questions)
- ✅ Task tracking automatic (sed commands in orchestration)
- ✅ Memory documentation present (≥5 entries)
- ✅ Multi-session parallelization worked (Claude + Codex)
- ✅ Time saved: ≤3h (vs 4h V4)
- ✅ 0 friction (no manual fixes)

**→ Décision: GO PRODUCTION V5**

**Next Steps Immédiats:**
1. **Merge V5 improvements to main:**
   ```bash
   cd ~/Documents/DEV/archon-orchestrator
   git add .claude/commands/speckit.agents.md
   git add docs/WORKFLOW-V5-CLAUDE-MD.md
   git add .specify/templates/CLAUDE-template.md
   git commit -m "feat(v5): CLAUDE.md pattern standard + multi-session parallelization

   - /speckit.agents now reads CLAUDE.md automatically (6 edits)
   - Multi-session testing documented (Codex parallel)
   - Task tracking + memory documentation mandatory
   - Quality gates enhanced (P0-P4 + progress + docs)

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"
   git push origin main
   ```

2. **Update templates for reuse:**
   ```bash
   # Copy CLAUDE.md InventoryFlow → archon-orchestrator template
   cp ~/Documents/DEV/InventoryFlow/CLAUDE.md \
      ~/Documents/DEV/archon-orchestrator/.specify/templates/CLAUDE-template.md

   # Update template README
   vim ~/Documents/DEV/archon-orchestrator/.specify/templates/README.md
   # Document V5 improvements + new workflow
   ```

3. **Continue LegalGuard Phase 2 with V5:**
   ```bash
   cd ~/Documents/DEV/LegalGuard-Chatbot

   # Regenerate orchestration-prompt.md with V5
   /speckit.agents

   # Verify CLAUDE.md now read
   grep "CLAUDE.md" .specify/prompts/orchestration-prompt.md

   # Execute Phase 2 implementation
   /implement
   ```

4. **Document V5 as stable:**
   ```bash
   # Update WORKFLOW-FINAL-V4-MULTI-DEVICE.md → V5
   # Mark V5 as production-ready
   # Archive V4 docs in archive-obsolete-2025-10-15-v4.1/
   ```

**Timeline Production V5:** Immediate (V5 tested + validated)

---

### Si V5 Non Concluant ❌ (≤4/7 criteria met)

**Problèmes potentiels:**

1. **tasks.md still headers (not checkboxes):**
   - Root cause: `/speckit.agents` modifications not effective
   - Debug: Verify `grep "CLAUDE.md" /Users/manu/.claude/commands/speckit.agents.md`
   - Fix: Re-apply 6 edits or verify CLAUDE.md path correct

2. **GitHub setup poses questions:**
   - Root cause: CLAUDE.md section 2 not read by agent
   - Debug: Check orchestration-prompt.md contains CLAUDE.md reference
   - Fix: Add explicit instruction in `/speckit.agents` Step 1

3. **Task tracking not automatic:**
   - Root cause: sed commands missing in orchestration-prompt.md
   - Debug: Verify Context Management section includes task tracking
   - Fix: Add task tracking template in `/speckit.agents` Edit 4

4. **Memory documentation absent:**
   - Root cause: /update-memory not called by agents
   - Debug: Check orchestration-prompt.md includes memory documentation rules
   - Fix: Add memory documentation mandatory in Quality Gates

5. **Multi-session parallelization failed:**
   - Root cause: Zen MCP clink prompt too large OR Codex auth expired
   - Debug: Check Zen MCP logs, verify `codex auth status`
   - Fix: Use separate Claude session instead of clink

**→ Décision: NO-GO Production V5 (Iterate)**

**Next Steps Immédiats:**
1. Identify root cause (which criteria failed)
2. Fix infrastructure V5 (speckit.agents, CLAUDE-template.md, or workflow docs)
3. Re-test V5 on simplified project (smaller scope)
4. Validate fixes before production

**Principe:** V5 must be 100% deterministic (0 friction, 0 interpretation) before production

---

## 🎯 PLAN SESSION SUITE (SI V5 OK)

### Option A: Continue LegalGuard Phase 2 (3-4h)

**Si V5 validé sur InventoryFlow:**
- Apply V5 workflow to LegalGuard
- Regenerate orchestration-prompt.md (now with CLAUDE.md ✅)
- Execute Phase 2 implementation (T014-T090)
- Test multi-session with Codex (E2E tests LegalGuard)

**Timeline:** Same day (if InventoryFlow test ≤3h)

---

### Option B: Implement V6 Observability (9-12h)

**Si V5 validé ET temps disponible:**
- V6 Phase 1: Observability + Budget Limits (3-4h)
- V6 Phase 2: Validation + FS-Guard (5-7h)
- V6 Phase 3: Agent Boundaries (1h)

**Timeline:** 1.5 jours ouvrés

**Documents V6:**
- `WORKFLOW-EVOLUTION-V6-MULTI-AGENT-OBSERVABILITY.md` - Plan complet
- `WORKFLOW-V6-ENHANCEMENTS-CHATGPT.md` - Enhancements approuvés

**Décision:** Utilisateur décidera après test V5

---

## 📁 FICHIERS CLÉS À CONSULTER

### Workflow V5 (Current)
- **`WORKFLOW-V5-CLAUDE-MD.md`** - Documentation pattern CLAUDE.md + Phase 3 enhanced
- **`CLAUDE.md`** - Instructions agents (workflow, MCP tools, auto-documentation)
- **`.claude/commands/speckit.agents.md`** - Modifié (6 edits) pour lire CLAUDE.md
- **`.specify/templates/CLAUDE-template.md`** - Template pour nouveaux projets
- **`.specify/templates/README.md`** - Guide utilisation templates

### Workflow V6 (Planned)
- **`WORKFLOW-EVOLUTION-V6-MULTI-AGENT-OBSERVABILITY.md`** - Plan V6 complet
- **`WORKFLOW-V6-ENHANCEMENTS-CHATGPT.md`** - Enhancements (FS-Guard, Budget, Pulse Viewer)

### LegalGuard Project
- **`~/Documents/DEV/LegalGuard-Chatbot/CLAUDE.md`** - Agent instructions projet
- **`~/Documents/DEV/LegalGuard-Chatbot/.specify/memory/project-memory.md`** - Dynamic Memory V5
- **`~/Documents/DEV/LegalGuard-Chatbot/specs/001-legalguard-mvp-legal/tasks.md`** - 97 tasks (checkboxes ✅)

### Reference
- **`WORKFLOW-FINAL-V4-MULTI-DEVICE.md`** - Workflow V4.1 (source of truth current)
- **`START-HERE.md`** - Entry point nouveaux projets
- **`INDEX-FILES-V4.md`** - Navigation rapide

---

## 🎯 CHECKLIST DÉBUT SESSION

Avant de commencer tests V5:

- [ ] Lire ce prompt reprise (contexte session précédente)
- [ ] Vérifier état archon-orchestrator repo (modifications /speckit.agents committed?)
- [ ] Confirmer modifications /speckit.agents effectives (grep "CLAUDE.md" speckit.agents.md)
- [ ] Préparer répertoire test: `mkdir ~/Documents/DEV/InventoryFlow`
- [ ] Vérifier Codex auth active: `codex auth status` (OAuth 24h)
- [ ] Timer ready (mesurer temps Phase 0-2 pour comparaison V4 vs V5)

**Phrase de confirmation:**
> "V5 infrastructure confirmée (6 edits /speckit.agents). CLAUDE.md pattern standard. Ready to test V5 on InventoryFlow project with Codex parallel testing. Let's validate V5! 🚀"

---

## 💡 CONSEILS POUR TESTS V5

### Test 1 (Phase 0-1: Setup + Planning)

**CRITIQUE - tasks.md format:**
- Vérifier IMMÉDIATEMENT après `/speckit.tasks`
- Command: `grep "^### T[0-9]" specs/001-mvp/tasks.md`
- Expected: 0 results ✅
- Si headers détectés → ÉCHEC (CLAUDE.md pas lu)
- Ne PAS continuer si tasks.md incorrect (waste of time)

**GitHub setup:**
- Instruction simple: "Lis CLAUDE.md puis génère la partie GitHub"
- Expected: Agent exécute 6 steps SANS questions
- Si questions → ÉCHEC (CLAUDE.md section 2 pas lue)

### Test 2 (Phase 2: Implementation)

**Multi-session parallelization:**
- Option A (Zen MCP clink): Fast if prompt <25K tokens
- Option B (Separate session): Fallback if clink fails
- Monitor both sessions (backend/frontend progress vs testing progress)

**Task tracking verification:**
- Every 10 tasks: `grep "^\- \[x\]" tasks.md | wc -l`
- Should increment (agents marking tasks automatically)
- If stuck at 0 → sed commands not in orchestration-prompt.md

**Memory documentation verification:**
- Every 10 tasks: `grep "^#### $(date +%Y-%m-%d)" project-memory.md | wc -l`
- Should increment (agents calling /update-memory)
- If stuck at 0 → /update-memory not mandatory in orchestration

### Test 3 (Validation)

**Comparison V4 vs V5:**
- Use table format (clear before/after)
- Quantify improvements (time, friction points)
- Identify remaining gaps (if any)

**Decision criteria:**
- 5/7 = GO Production ✅
- 3/7 = Iterate V5 ⚠️
- Be objective (don't force GO if criteria not met)

---

## 📊 MÉTRIQUES À MESURER

### Temps (V5 ROI Validation)
- ⏱️ Phase 0 (Multi-IA Roundtable): **Target ≤10 min**
- ⏱️ Phase 1 (Spec-Kit Planning): **Target ≤20 min**
- ⏱️ Phase 2 (Implementation): **Target ≤3h** (vs 4h V4)
- ⏱️ **Total Phase 0-2: ≤3h30** (vs 4h30 V4 = -22%)

### Qualité (V5 Determinism Validation)
- ✅ tasks.md checkboxes (not headers): **Target 100%**
- ✅ GitHub setup 0 questions: **Target 100%**
- ✅ Task tracking automatic: **Target 100%**
- ✅ Memory docs present: **Target ≥5 entries**
- ✅ Quality gates passed: **Target P0 + P1 minimum**

### Friction (V5 Smoothness Validation)
- 🎯 Manual fixes required: **Target 0**
- 🎯 Agent questions asked: **Target 0**
- 🎯 Workflow restarts needed: **Target 0**
- 🎯 Multi-session coordination issues: **Target 0**

**Si tous targets atteints → GO Production V5 ✅**
**Si ≥1 target raté → Analyze root cause, fix, re-test**

---

## 🚀 PHRASE DE LANCEMENT SESSION

> "Session 15 octobre - Phase 5 Testing V5. Objectif: Valider CLAUDE.md pattern standard + multi-session Codex testing sur nouveau projet InventoryFlow. Critères succès: tasks.md checkboxes ✅, GitHub 0 friction ✅, task tracking auto ✅, memory docs ≥5 ✅, time ≤3h ✅. If 5/7 → GO Production V5! Let's test! 🚀🧪✅"

---

## 📊 RÉSUMÉ SESSION PRÉCÉDENTE (14 OCTOBRE)

**Durée:** ~2-3h
**Status:** ✅ V5 IMPROVEMENTS COMPLETE

### Réalisations

1. **CLAUDE.md Pattern Standardisé:** ✅
   - Modifié `/speckit.agents` (6 edits)
   - CLAUDE.md lecture automatique Step 1
   - Multi-session parallelization documented
   - Task tracking + memory documentation mandatory
   - Quality gates enhanced

2. **Documentation Updated:** ✅
   - `WORKFLOW-V5-CLAUDE-MD.md` - Phase 3 enhanced
   - `.specify/templates/README.md` - Templates usage guide

3. **LegalGuard Phase 1 Complete:** ✅
   - Foundation setup (T001-T013)
   - Database schema + RLS policies
   - Runtime decision documented (Database Multi-Tenant RLS)

### Décision Utilisateur

> "Mets à jour la doc stp et mets à jour le promptdereprise.md pour demain (le 15/10). Nous reprendrons la phase 5 en testant avec Codex et si tout se passe mieux avec un nouveau projet."

**Plan convenu:**
1. **15 octobre (aujourd'hui):** Tester V5 sur nouveau projet avec Codex
2. **Si V5 concluant:** GO Production V5 + Continue LegalGuard Phase 2
3. **Si V5 non concluant:** Iterate V5 before production

---

**Document Created:** 2025-10-14 (pour session du 15 octobre)
**Estimated Session Duration:** 3-4h (Phase 5 testing complet)
**Success Criteria:** 5/7 validation criteria met → GO Production V5

*"CLAUDE.md Pattern Standard + Multi-Session Codex = V5 Deterministic Workflow"* 🚀📋✅
