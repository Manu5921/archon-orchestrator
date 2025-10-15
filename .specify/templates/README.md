# Archon Orchestrator - Templates V5

**Version:** V5
**Date:** 2025-10-14
**Purpose:** Réutilisable sur tous les nouveaux projets

---

## 📁 Templates Disponibles

### 1. CLAUDE-template.md (Agent Instructions)

**Usage:** Copier à la racine de chaque nouveau projet

```bash
# Nouveau projet
mkdir ~/Documents/DEV/nouveau-projet
cd ~/Documents/DEV/nouveau-projet

# Copier template
cp ~/Documents/DEV/archon-orchestrator/.specify/templates/CLAUDE-template.md ./CLAUDE.md

# Adapter projet-spécifique (après /zen-roundtable):
# 1. Section 2: GitHub repo URL
# 2. Section 7: Tech stack (lire .specify/memory/constitution.md)
# 3. Section 8: Constraints (lire .specify/memory/constitution.md)
```

**Contenu:**
- Workflow phases (Spec-Kit séquentiel)
- GitHub Setup Process (steps exactes)
- tasks.md Format Rule (checkboxes only, ZERO TOLERANCE)
- Design/Dev Decoupling (CSS variables only)
- Quality Gates (P0-P2)
- project-memory.md Auto-Documentation (MANDATORY for sub-agents)
- Tech stack placeholder (à adapter)
- Constraints placeholder (à adapter)

**Documentation:** `docs/WORKFLOW-V5-CLAUDE-MD.md`

---

### 2. ci-template.yml (GitHub Actions Workflow)

**Usage:** Copier dans `.github/workflows/` de chaque nouveau projet

```bash
# Nouveau projet
mkdir -p .github/workflows

# Copier template
cp ~/Documents/DEV/archon-orchestrator/.specify/templates/ci-template.yml ./.github/workflows/ci-template.yml

# Template sera copié vers ci.yml par agent lors de "partie GitHub"
# (voir CLAUDE.md section 2: GitHub Setup Process)
```

**Placeholders à remplacer (automatique par agent):**
- `[PROJECT_NAME]` → Nom projet (e.g., "LegalGuard")
- `[PACKAGE_MANAGER]` → npm/pnpm/yarn
- `[NODE_VERSION]` → 18/20/21
- `[BUILD_COMMAND]` → npm run build / pnpm build
- `[LINT_COMMAND]` → npm run lint / pnpm lint
- `[TEST_COMMAND]` → npm test / pnpm test

**Quality Gates:**
- P0: Build (BLOCKER)
- P1: Lint (BLOCKER)
- P2: Test (Warning only)

---

## 🚀 Workflow Nouveau Projet (Quick Start)

### Étape 1: Setup Initial

```bash
# Créer projet
mkdir ~/Documents/DEV/nouveau-projet
cd ~/Documents/DEV/nouveau-projet

# Copier templates
cp ~/Documents/DEV/archon-orchestrator/.specify/templates/CLAUDE-template.md ./CLAUDE.md
mkdir -p .github/workflows
cp ~/Documents/DEV/archon-orchestrator/.specify/templates/ci-template.yml ./.github/workflows/ci-template.yml

# Git init
git init
```

### Étape 2: Multi-IA Roundtable

```bash
# Générer constitution + spec
/zen-roundtable "Brief: [votre brief projet]"

# Résultat:
# ✅ .specify/memory/constitution.md
# ✅ specs/001-mvp/spec.md
```

### Étape 3: Adapter CLAUDE.md

```bash
# Lire constitution pour tech stack + constraints
cat .specify/memory/constitution.md

# Éditer CLAUDE.md:
# - Section 7: Tech stack (copier depuis constitution.md)
# - Section 8: Constraints (copier depuis constitution.md)
# - Section 2: GitHub repo URL (si connu)
vim CLAUDE.md
```

### Étape 4: Planning Spec-Kit

```bash
/speckit.design  # Design tokens
/speckit.plan    # Implementation plan
/speckit.tasks   # Task breakdown (agent lit CLAUDE.md section 3 → checkboxes)
```

### Étape 5: GitHub Setup

```bash
# Instruction simple:
# "Lis CLAUDE.md puis génère la partie GitHub"

# Agent exécute automatiquement (CLAUDE.md section 2):
# 1. Copy ci-template.yml → ci.yml (+ replace placeholders)
# 2. Create branch 001-feature-name
# 3. Commit with exact format
# 4. Push to remote
# 5. Create PR
```

### Étape 6: Implementation

```bash
/speckit.agents  # Generate sub-agents
/implement       # Execute

# Sub-agents auto-documentent (CLAUDE.md section 6)
# → 5-15 entries dans .specify/memory/project-memory.md
```

---

## 📊 Différence Avec/Sans Templates

### ❌ Sans Templates (V4)

```
Nouveau projet
  ↓
Agent ne connaît PAS workflow
Agent pose questions (commit format ? push ?)
Agent génère tasks.md avec headers ### (INCORRECT)
Agent oublie project-memory.md
  ↓
❌ 1-2h friction + 2 projets redémarrés
```

### ✅ Avec Templates (V5)

```
Nouveau projet
  ↓
Copier CLAUDE.md + ci-template.yml (2 min)
Adapter sections 7-8 CLAUDE.md (3 min)
  ↓
Agent lit CLAUDE.md → Connaît workflow
Agent exécute sections exactement (0 questions)
Agent génère tasks.md checkboxes (CORRECT)
Agent auto-documente project-memory.md (5-15 entries)
  ↓
✅ 0 friction + déterministe
```

---

## 🎯 Maintenance Templates

### Quand Mettre à Jour ?

**CLAUDE-template.md:**
- Workflow change (nouvelles phases Spec-Kit)
- Nouvelle règle critique découverte (ex: format tasks.md)
- Pattern validé ajouté (ex: LIBRARY_FIRST)

**ci-template.yml:**
- Quality gates changent (P0/P1/P2 redéfinis)
- GitHub Actions updated (nouvelles versions)
- Nouveaux checks ajoutés (security scan, performance)

### Process Mise à Jour

```bash
# 1. Tester changement dans projet pilote (ex: LegalGuard)
cd ~/Documents/DEV/LegalGuard-Chatbot
vim CLAUDE.md  # Modifier + tester

# 2. Si validé → Copier vers template
cp CLAUDE.md ~/Documents/DEV/archon-orchestrator/.specify/templates/CLAUDE-template.md

# 3. Documenter changement
vim ~/Documents/DEV/archon-orchestrator/docs/WORKFLOW-V5-CLAUDE-MD.md
# Ajouter section "Changelog" avec date + raison

# 4. Commit dans archon-orchestrator
cd ~/Documents/DEV/archon-orchestrator
git add .specify/templates/ docs/
git commit -m "feat(templates): update CLAUDE-template.md - [raison]"
```

---

## 📚 Documentation Complète

- **Workflow V5:** `docs/WORKFLOW-V5-CLAUDE-MD.md`
- **Workflow V4:** `docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md`
- **Agent Constitution V6:** `docs/V6-AGENT-CONSTITUTION.md` (design doc)
- **Golden Patterns:** `docs/GOLDEN-PATTERNS.md`

---

**Last Updated:** 2025-10-14
**Next:** Integrate into V6 with auto-generation + hooks
