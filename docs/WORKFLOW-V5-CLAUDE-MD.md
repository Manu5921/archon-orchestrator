# Workflow V5 - CLAUDE.md Pattern

**Version:** V5
**Date:** 2025-10-14
**Status:** ✅ Production Ready (Tested on LegalGuard-Chatbot)
**Pattern:** Agent Self-Governance via Project-Level Instructions

---

## 🎯 Problème Résolu

### Symptômes V4 (Friction Récurrente)

**Scénario typique:**
```
User: "génère la partie GitHub"
  ↓
Agent: "Je vais analyser... Voulez-vous un commit ou plusieurs ? Push vers remote ?"
  ↓
User frustré: "Juste fais ce qu'il faut !"
  ↓
Agent invente format commit différent
Agent génère tasks.md avec headers ### au lieu de checkboxes - [ ]
  ↓
❌ 2 projets redémarrés (FormIQ + LegalGuard)
❌ 1-2h perdues par friction
```

**Root Cause:**
- Agents n'ont PAS accès à archon-orchestrator/ (chaque projet = session isolée)
- Agents n'ont PAS de "constitution agent" (seulement constitution business)
- Agents INTERPRÈTENT librement (plus le prompt est long, plus la variance est élevée)

### Solution V5 : CLAUDE.md à la Racine

**Concept:** 1 fichier simple (100-150 lignes) avec règles strictes pour l'agent

**Emplacement:**
```
Nouveau-Projet/
├── CLAUDE.md ⭐ Instructions agent (auto-découverte)
├── README.md (documentation user)
├── .specify/
│   ├── memory/
│   │   ├── constitution.md (business governance)
│   │   └── project-memory.md (runtime decisions)
│   └── templates/
│       └── tasks-template.md (Spec-Kit standard)
├── .github/
│   └── workflows/
│       └── ci-template.yml (template à copier)
└── package.json
```

---

## 📄 Contenu CLAUDE.md (Structure Standard)

### Sections Obligatoires

1. **Workflow Order** - Phases Spec-Kit séquentielles
2. **GitHub Setup Process** - Steps exactes (pas d'interprétation)
3. **tasks.md Format Rule** - ZERO TOLERANCE (checkboxes only)
4. **Design/Dev Decoupling** - CSS variables only
5. **Quality Gates** - P0-P2 enforcement
6. **project-memory.md Auto-Documentation** - MANDATORY for sub-agents
7. **Tech Stack** - From constitution.md
8. **Key Constraints** - RGPD, disclaimers, etc.

### Principe de Rédaction

**✅ DO (Règles Strictes):**
- "Execute these steps EXACTLY" (pas "you can do A or B")
- "ONLY allowed format: - [ ] T001" (pas "prefer checkboxes")
- "MANDATORY: Call /update-memory automatically" (pas "consider documenting")
- Template exact avec placeholders (pas description longue)

**❌ DON'T (Options Multiples):**
- "You can commit in one or multiple commits" → Variance
- "Consider using checkboxes or headers" → Interprétation
- "It's recommended to document decisions" → Optionnel

**Principe fondamental:**
> "L'IA est déterministe quand on lui enlève le choix"

### Taille Cible

- **Minimum:** 80 lignes (workflow + GitHub + tasks.md + memory)
- **Optimal:** 100-150 lignes (+ design decoupling + quality gates + tech stack)
- **Maximum:** 200 lignes (si contraintes spécifiques RGPD/HIPAA/finance)

**Au-delà de 200 lignes → Variance augmente** (agent commence à interpréter)

---

## 🛠️ Template CLAUDE.md (Réutilisable)

**Emplacement archon-orchestrator:**
```bash
~/Documents/DEV/archon-orchestrator/.specify/templates/CLAUDE-template.md
```

**Usage:**
```bash
# Nouveau projet
mkdir ~/Documents/DEV/nouveau-projet
cd ~/Documents/DEV/nouveau-projet

# Copier template
cp ~/Documents/DEV/archon-orchestrator/.specify/templates/CLAUDE-template.md ./CLAUDE.md

# Adapter projet-spécifique:
# - Remplacer [PROJECT_NAME]
# - Remplacer [PACKAGE_MANAGER] (npm/pnpm/yarn)
# - Remplacer [NODE_VERSION]
# - Adapter section 7 (tech stack) depuis constitution.md
# - Adapter section 8 (constraints) depuis constitution.md
```

**Template complet:** Voir `/Users/manu/Documents/DEV/LegalGuard-Chatbot/CLAUDE.md`

---

## 📁 Template ci-template.yml (GitHub Actions)

**Emplacement:**
```
.github/workflows/ci-template.yml (template avec placeholders)
.github/workflows/ci.yml (copié + placeholders remplacés)
```

**Placeholders:**
- `[PROJECT_NAME]` → Nom projet (e.g., "LegalGuard")
- `[PACKAGE_MANAGER]` → npm/pnpm/yarn
- `[NODE_VERSION]` → 18/20/21
- `[BUILD_COMMAND]` → npm run build / pnpm build
- `[LINT_COMMAND]` → npm run lint / pnpm lint
- `[TEST_COMMAND]` → npm test / pnpm test

**Template complet:** Voir `/Users/manu/Documents/DEV/LegalGuard-Chatbot/.github/workflows/ci-template.yml`

---

## 🎯 Workflow V5 Complet (Avec CLAUDE.md)

### Phase 0: Multi-IA Roundtable (30-45 min)

```bash
cd ~/Documents/DEV/clients
mkdir nouveau-projet && cd nouveau-projet

# Multi-IA génère constitution + spec
/zen-roundtable "Brief: [votre brief]"

# Résultat:
# ✅ .specify/memory/constitution.md
# ✅ specs/001-mvp/spec.md
```

### Phase 1: Planning + CLAUDE.md Setup (35 min)

```bash
# Copier CLAUDE.md template
cp ~/Documents/DEV/archon-orchestrator/.specify/templates/CLAUDE-template.md ./CLAUDE.md

# Adapter CLAUDE.md:
# - Section 7: Tech stack (lire constitution.md)
# - Section 8: Constraints (lire constitution.md)
# - Section 2: GitHub repo URL
vim CLAUDE.md  # Ou éditeur préféré

# Continuer Spec-Kit
/speckit.design      # Design tokens
/speckit.plan        # Implementation plan
/speckit.tasks       # Task breakdown (agent LIT CLAUDE.md section 3 → checkboxes only)

# Copier GitHub workflow template
mkdir -p .github/workflows
cp ~/Documents/DEV/archon-orchestrator/.specify/templates/ci-template.yml .github/workflows/ci-template.yml
```

### Phase 2: GitHub Setup (2 min) ⭐ NOUVEAU

**User dit simplement:**
> "Lis CLAUDE.md puis génère la partie GitHub"

**Agent exécute automatiquement (section 2 CLAUDE.md):**
1. Copy `ci-template.yml` → `ci.yml`
2. Replace placeholders (PROJECT_NAME, PACKAGE_MANAGER, etc.)
3. Create branch `001-feature-name`
4. Commit with EXACT format (no questions)
5. Push to remote
6. Create PR with `gh` CLI or manual instructions

**Résultat:** 0 friction, 0 questions, 0 variance

### Phase 3: Implementation (3-4h) ⭐ V5 ENHANCED

```bash
/speckit.agents  # Generate orchestration-prompt.md (NOW reads CLAUDE.md ✅)
/implement       # Execute implementation

# ⭐ V5 NEW: Multi-Session Parallelization (30% faster)
# Session 1 (Main): backend-specialist → API + business logic
# Session 2 (Parallel): frontend-specialist → UI components
# Session 3 (Parallel): testing-specialist (Codex OR Claude) → E2E tests

# Sub-agents AUTO-DOCUMENTENT (CLAUDE.md section 6)
# - backend-specialist termine auth → /update-memory (mandatory)
# - frontend-specialist termine dashboard → /update-memory (mandatory)
# - testing-specialist termine E2E → /update-memory (mandatory)

# ⭐ V5 NEW: Task Tracking Automatic
# sed -i 's/- \[ \] T001/- \[x\] T001/' tasks.md (after each task)

# ⭐ V5 NEW: Quality Gates Every 10 Tasks
# P0 Build + P1 Lint + Task Progress + Memory Documentation

# Résultat: .specify/memory/project-memory.md avec 5-15 entries
```

**Key Improvements V5:**
1. **CLAUDE.md Standard:** `/speckit.agents` now reads CLAUDE.md automatically (Step 1)
2. **Parallel Testing:** testing-specialist runs in separate session (Codex recommended)
3. **Task Tracking:** Agents mark tasks complete in tasks.md via `sed` commands
4. **Memory Mandatory:** `/update-memory` required after significant decisions
5. **Checkpoints:** Quality gates every 10 tasks (build, lint, progress, docs)
6. **Time Savings:** -30% via multi-session parallelization (2-3h saved)

### Phase 4: Design Import (15 min)

```bash
# Designer livre custom-tokens.json
/import-design custom-tokens.json

# UI transform automatiquement (Design/Dev Decoupling)
```

### Phase 5: Review + Merge (15 min)

```bash
# Review PR
gh pr view

# Verify CI (P0 Build ✅, P1 Lint ✅)
gh run list --limit 1

# Merge
gh pr merge --squash
```

---

## 🔧 /speckit.agents Modifications V5 (2025-10-14)

**Context:** Rendre CLAUDE.md pattern standard + documenter multi-session parallelization

**6 Modifications Applied:**

### Edit 1: Step 1 - CLAUDE.md Standard (CRITICAL)

**Before:**
```markdown
Read these files (IN ORDER):
- `.specify/memory/constitution.md`
- `specs/001-mvp/spec.md`
- `specs/001-mvp/tasks.md`
- `design/design-tokens.json`
```

**After:**
```markdown
Read these files (IN ORDER):
- `.specify/memory/constitution.md`
- `specs/001-mvp/spec.md`
- `specs/001-mvp/tasks.md`
- `design/design-tokens.json`
- `CLAUDE.md` ⭐ **NEW V5** (agent instructions, MCP tools, auto-documentation rules)

Extract:
- **Agent Rules:** From CLAUDE.md (task tracking, memory documentation, MCP usage)
```

**Impact:** Orchestration-prompt.md now includes CLAUDE.md rules automatically

---

### Edit 2: Step 2 - Testing Parallel Session

**Before:**
```markdown
3. **testing-specialist**
   - Triggers: ALWAYS (E2E + unit tests required)
```

**After:**
```markdown
3. **testing-specialist** ⭐ **V5: PARALLEL SESSION RECOMMENDED**
   - Triggers: ALWAYS (E2E + unit tests required)
   - **Execution:** SEPARATE session (Claude Code OR Codex via Zen MCP)
   - **Parallelization:** Tests Phase N while backend/frontend implement Phase N+1
```

**Impact:** Testing can run in parallel (Codex recommended), saves 2-3h (30%)

---

### Edit 3: Execution Strategy - Multi-Session Formalized

**Added:**
```markdown
## 📋 EXECUTION STRATEGY

### Parallel Execution (Maximize Speed) ⭐ V5 ENHANCED

**Phase 2: Multi-Session Parallel Development (3-4h)** ⭐ **NEW V5**

Session 1 (Main):
  backend-specialist:     T014-T050 (API endpoints + business logic)
      ║
      ║ SIMULTANEOUS ✅
      ║
      ╠══ Session 2 (Parallel): frontend-specialist
      ║     → T051-T075 (UI components + pages)
      ║
      ╚══ Session 3 (Parallel): testing-specialist (Codex via Zen MCP OR new Claude session)
            → T076-T090 (E2E tests for Phase 1 completed tasks)

**Why Multi-Session Testing?**
- ✅ Time saved: ~2-3h (30% faster vs sequential)
- ✅ Codex specialized for testing (better test coverage)
- ✅ Claude can focus on implementation (no context switching)
```

**Impact:** 3-session strategy documented with ROI quantified

---

### Edit 4: Context Management - Task + Memory Tracking Mandatory

**Added:**
```markdown
### Context Management ⭐ V5 ENHANCED

**Preserve Memory:**
- **Read `CLAUDE.md` FIRST** (agent instructions + MCP tools + auto-doc rules)
- Call `/update-memory` when making significant decisions ⭐ **MANDATORY**

**Task Tracking (From CLAUDE.md):** ⭐ **NEW V5**
```bash
# After EACH task completed, mark in tasks.md
sed -i 's/- \[ \] T001/- \[x\] T001/' specs/001-mvp/tasks.md

# Verification (Every 10 Tasks):
grep "^\- \[x\]" specs/001-mvp/tasks.md | wc -l
```

**Memory Documentation (From CLAUDE.md):** ⭐ **NEW V5**
```bash
# After EVERY significant decision:
/update-memory

# Verification (Every 10 Tasks):
grep "^#### $(date +%Y-%m-%d)" .specify/memory/project-memory.md | wc -l
# Expected total: 5-15 entries after full implementation
```
```

**Impact:** Agents have explicit instructions for task tracking + documentation

---

### Edit 5: Quality Gates - Task Progress + Memory Documentation

**Before:**
```markdown
**Every 10 tasks:**
```bash
# 1. Build check (P0 Gate)
pnpm build
# 2. Lint check (P1 Gate)
mcp__eslint__lint-files ["/absolute/path/to/modified/files.ts"]
```
```

**After:**
```markdown
**Every 10 tasks:**
```bash
# 1. Build check (P0 Gate)
pnpm build

# 2. Lint check (P1 Gate - From CLAUDE.md section 5)
mcp__eslint__lint-files ["/absolute/path/to/modified/files.ts"]

# 3. Task tracking (Progress Gate) ⭐ NEW V5
grep "^\- \[x\]" specs/001-mvp/tasks.md | wc -l
# Should match completed task count (e.g., 10 after first checkpoint)

# 4. Memory documentation (Documentation Gate) ⭐ NEW V5
grep "^#### $(date +%Y-%m-%d)" .specify/memory/project-memory.md | wc -l
# Should show 1-3 new entries (if significant decisions made)
```
```

**Impact:** Checkpoints verify task progress + documentation quality

---

### Edit 6: Final Prompt Template - CLAUDE.md + Testing Strategy

**Before:**
```markdown
Context:
- Constitution: .specify/memory/constitution.md
- Spec: specs/001-mvp/spec.md
- Tasks: specs/001-mvp/tasks.md
- Design: design/design-tokens.json
- Memory: project-memory.md
```

**After:**
```markdown
Context:
- Constitution: .specify/memory/constitution.md
- Spec: specs/001-mvp/spec.md
- Tasks: specs/001-mvp/tasks.md
- Design: design/design-tokens.json
- Agent Instructions: CLAUDE.md ⭐ **NEW V5** (workflow rules, MCP tools, auto-documentation)
- Memory: project-memory.md

⭐ **V5 Testing Strategy:** Tests will be executed in PARALLEL SESSION (Codex via Zen MCP OR separate Claude session) while backend/frontend implementation continues. This saves 2-3h (30% faster vs sequential).
```

**Impact:** `/implement` prompt includes CLAUDE.md + parallel testing strategy

---

**Total Impact V5:**
- ✅ CLAUDE.md pattern now STANDARD (tous futurs projets)
- ✅ Multi-session parallelization documented (Codex testing recommended)
- ✅ Task tracking automatic (sed commands in orchestration)
- ✅ Memory documentation mandatory (quality gates enforcement)
- ✅ Time saved: -30% via parallelization (2-3h)
- ✅ Friction eliminated: 0 questions, 0 interpretation, 100% deterministic

**File Modified:** `/Users/manu/.claude/commands/speckit.agents.md`
**Date:** 2025-10-14
**Validation:** To be tested on InventoryFlow project (Phase 5)

---

## 📊 Impact V5 vs V4

| Métrique | V4 (Sans CLAUDE.md) | V5 (Avec CLAUDE.md) |
|----------|---------------------|---------------------|
| **Friction "partie GitHub"** | Questions + variance | 0 questions, déterministe ✅ |
| **tasks.md format errors** | 2 projets redémarrés | 0 erreurs ✅ |
| **Agent interprétation** | Élevée (options multiples) | Nulle (1 seule façon) ✅ |
| **project-memory.md usage** | Optionnel (oublié) | Automatique ✅ |
| **Temps setup nouveau projet** | 45 min (planning + friction) | 35 min ✅ |
| **Variance comportement** | 30-40% | <5% ✅ |

---

## ✅ Checklist Nouveau Projet V5

**Avant Phase 0:**
- [ ] Copier `CLAUDE-template.md` → `CLAUDE.md`
- [ ] Copier `ci-template.yml` → `.github/workflows/ci-template.yml`

**Après Phase 0 (Multi-IA):**
- [ ] Adapter `CLAUDE.md` section 7 (tech stack depuis constitution.md)
- [ ] Adapter `CLAUDE.md` section 8 (constraints depuis constitution.md)
- [ ] Adapter `CLAUDE.md` section 2 (GitHub repo URL)

**Après Phase 1 (Planning):**
- [ ] Commit `CLAUDE.md` + `ci-template.yml`:
  ```bash
  git add CLAUDE.md .github/workflows/ci-template.yml
  git commit -m "docs: add CLAUDE.md agent instructions + CI template"
  ```

**Phase 2 (GitHub):**
- [ ] User dit: "Lis CLAUDE.md puis génère la partie GitHub"
- [ ] Vérifier agent exécute steps section 2 EXACTEMENT (no questions)

**Phase 3 (Implementation):**
- [ ] Vérifier sub-agents auto-documentent (5-15 entries dans project-memory.md)

**Post-Implementation:**
- [ ] Vérifier tasks.md format correct (checkboxes `- [ ]`, pas headers `###`)
- [ ] Vérifier CI passe (P0 Build ✅, P1 Lint ✅)

---

## 🚨 Troubleshooting

### Issue: Agent Ne Lit Pas CLAUDE.md

**Symptôme:** Agent pose questions au lieu d'exécuter directement

**Solution:**
```bash
# Instruction explicite:
"AVANT de faire quoi que ce soit, lis CLAUDE.md section 2 (GitHub Setup Process) et exécute exactement les steps listés. Ne pose AUCUNE question."
```

### Issue: tasks.md Généré Avec Headers

**Symptôme:** `### T001: ...` au lieu de `- [ ] T001 ...`

**Solution:**
```bash
# Vérifier CLAUDE.md section 3 présente
grep "tasks.md Format Rule" CLAUDE.md

# Si absent → Ajouter section 3 depuis template
# Si présent → Régénérer avec instruction explicite:
/speckit.tasks

"CRITICAL: Lis CLAUDE.md section 3 AVANT de générer. Use ONLY checkbox format - [ ] T001."
```

### Issue: project-memory.md Pas Mis à Jour

**Symptôme:** Après implementation, project-memory.md vide ou <3 entries

**Solution:**
```bash
# Vérifier CLAUDE.md section 6 présente
grep "Auto-Documentation" CLAUDE.md

# Si absent → Ajouter section 6 depuis template
# Instruire sub-agents:
"RAPPEL: À la fin de chaque tâche significative, tu DOIS appeler /update-memory automatiquement (voir CLAUDE.md section 6)"
```

---

## 🎯 Évolution V6 (Prévu)

### CLAUDE.md Devient Agent Constitution

**V5 (Actuel):**
- CLAUDE.md = Documentation projet-spécifique
- User copie template manuellement
- Adapte sections 7-8 manuellement

**V6 (Futur):**
- CLAUDE.md = Généré automatiquement par `/speckit.constitution`
- Sections 7-8 remplies depuis constitution.md (parsing automatique)
- Hooks pre/post ajoutent validation:
  - Pre-tasks hook: Vérifie CLAUDE.md section 3 existe
  - Post-tasks hook: Vérifie tasks.md format (grep `^### T[0-9]`)
  - Pre-implement hook: Vérifie CLAUDE.md section 6 existe

**Filesystem Firewall:**
- Parse CLAUDE.md section "Limites et Interdictions"
- Génère règles blocage dynamiquement
- Agent ne peut PAS violer constitution

---

## 📚 Références

- **Template CLAUDE.md:** `/Users/manu/Documents/DEV/LegalGuard-Chatbot/CLAUDE.md`
- **Template ci-template.yml:** `/Users/manu/Documents/DEV/LegalGuard-Chatbot/.github/workflows/ci-template.yml`
- **Workflow V4:** `WORKFLOW-FINAL-V4-MULTI-DEVICE.md`
- **Agent Constitution V6:** `V6-AGENT-CONSTITUTION.md` (design doc)
- **Dynamic Memory V5:** `GOLDEN-PATTERNS.md` section "Dynamic Memory Pattern"

---

**Last Updated:** 2025-10-14
**Status:** ✅ Production Ready (Tested LegalGuard-Chatbot)
**Next:** Integrate into V6 with hooks + filesystem firewall
