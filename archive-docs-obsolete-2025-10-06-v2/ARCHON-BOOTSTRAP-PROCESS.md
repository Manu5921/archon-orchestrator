# 🚀 Archon Bootstrap Process - Guide Complet

**Version:** 2.0
**Date:** 2025-01-05
**Pour:** Nouveaux projets sans contexte préalable
**Temps Total:** ~30 minutes setup + 2 semaines implémentation

---

## 📋 Vue d'Ensemble

Ce guide permet de bootstrap un nouveau projet avec Archon + Design System + Spec-Kit en **30 minutes**.

**Résultat final :**
- ✅ Constitution.md (standards E1-E16)
- ✅ Spec.md (feature requirements)
- ✅ Plan.md (architecture technique)
- ✅ Tasks.md (task breakdown)
- ✅ Design System complet (.design/)
- ✅ 5+ agents spécialisés
- ✅ Scripts design pipeline
- ✅ Prêt pour `/implement`

---

## 🎯 Prérequis

### Outils Requis

```bash
# 1. Node.js 20+
node --version  # v20.x.x

# 2. pnpm
pnpm --version  # 8.x.x

# 3. uvx (pour Spec-Kit)
uvx --version

# 4. VS Code + Claude Code extension
code --version
```

### Templates Archon

**Avoir accès au template archon-native :**
```bash
ls ~/Documents/DEV/archon-native/.design/
# Doit afficher : README.md, schemas/, patterns/, components/
```

**Si archon-native n'existe pas, cloner depuis :**
```bash
cd ~/Documents/DEV
git clone https://github.com/YOUR_ORG/archon-native.git
# OU copier depuis un projet existant
```

---

## 📖 Process Complet (8 Étapes)

### ÉTAPE 1 : Créer Nouveau Projet (2 min)

#### 1.1 Init Spec-Kit

```bash
# Créer dossier projet
cd ~/Documents/DEV
mkdir mon-nouveau-projet
cd mon-nouveau-projet

# Init Spec-Kit
uvx --from git+https://github.com/github/spec-kit.git specify init
```

**Output attendu :**
```
✓ Created .specify/ directory
✓ Created .specify/memory/
✓ Created .specify/templates/
✓ Created .specify/scripts/
✓ Created specs/ directory
```

---

#### 1.2 Vérifier Structure Créée

```bash
tree -L 2 .specify/
```

**Doit afficher :**
```
.specify/
├── memory/          # Contexte projet (constitution.md ira ici)
├── scripts/
│   └── bash/        # Scripts workflow Spec-Kit
└── templates/       # Templates spec/plan/tasks
```

---

### ÉTAPE 2 : Constitution (5 min)

**Deux options :**

#### Option A : Copier Constitution Existante (Rapide - 1 min)

```bash
# Si tu as une constitution template
cp ~/Documents/DEV/archon-orchestrator/LOCAL-AI-SEO-CONSTITUTION.md \
   .specify/memory/constitution.md

# Personnaliser (remplacer PROJECT_NAME, MISSION, etc.)
code .specify/memory/constitution.md
```

---

#### Option B : Générer via Claude Code (Complet - 5 min)

**Ouvrir VS Code dans le projet :**
```bash
code .
```

**Dans Claude Code, lancer :**
```
/constitution

Type de projet : [SaaS B2B / SaaS B2C / Mobile App / E-commerce]
Stack : Next.js 14 + Supabase + Vercel
Base de données : Supabase (Postgres managed)
Contraintes : [Budget API strict / Performance <1s / etc.]
Métriques succès : MRR, Churn, NPS

Génère constitution.md complète avec :
- Standards E1-E16
- Design Principles P1-P5
- Architecture Principles A1-A3
- Quality Gates P0-P4
- Tech Stack détaillé
- Success Criteria
```

**Output attendu :**
```
✅ Constitution générée : .specify/memory/constitution.md
📋 Standards inclus : E1-E16
🎨 Design principles : P1-P5
🚀 Quality gates : P0-P4
```

---

### ÉTAPE 3 : Specification (5 min)

#### 3.1 Préparer Spec (Option 1 - Copier Template)

```bash
# Si tu as un spec.md préparé
mkdir -p specs/001-mvp
cp ~/Documents/DEV/archon-orchestrator/LOCAL-AI-SEO-SPEC.md \
   specs/001-mvp/spec.md

# Personnaliser
code specs/001-mvp/spec.md
```

---

#### 3.2 Générer Spec via Claude Code (Option 2 - Interactif)

**Dans Claude Code :**
```
/specify

Feature Name : MVP Free AI Visibility Audit
User Problem : Les PME n'apparaissent pas dans ChatGPT/Claude
Solution : Monitoring + Optimisation visibilité IA
Target Users : Restaurants, avocats, agents immobiliers
Key Features :
1. Audit gratuit (lead magnet)
2. Dashboard AI Visibility Score
3. Monitoring temps réel
4. Perfect Answers Generator
5. Auto-publish Google Business

Génère spec.md complet avec :
- Executive Summary
- User Scenarios
- Functional Requirements (50+)
- Acceptance Criteria
- Edge Cases
- Key Entities
```

**Output attendu :**
```
✅ Spec générée : specs/001-mvp/spec.md
📝 174 lignes, 50 requirements
🎯 Ready for /plan
```

---

### ÉTAPE 4 : Clarify (Optionnel - 2 min)

**Si questions ouvertes dans spec.md :**

```
/clarify

Questions :
1. Budget API maximum par client ?
   → Réponse : 50% du revenue client

2. Monitoring fréquence minimale ?
   → Réponse : 1x/jour pour Starter, 3x/jour pour Pro

3. Support offline-first ?
   → Réponse : Non, online-only pour MVP
```

**Output :** Questions ajoutées dans `spec.md` section Clarifications.

---

### ÉTAPE 5 : Plan (3 min - Automatique)

**Dans Claude Code :**
```
/plan
```

**Workflow automatique :**
1. Lit `constitution.md` (standards)
2. Lit `spec.md` (requirements)
3. Génère `plan.md` avec :
   - Technical Context
   - Architecture Decisions (ADR)
   - Implementation Phases
   - Technical Risks
   - Testing Strategy

**Temps : ~3 minutes**

**Output attendu :**
```
✅ Plan généré : specs/001-mvp/plan.md
📐 Architecture : Next.js 14 + Supabase + Vercel
🏗️ Phases : 7 phases (14 jours)
⚠️ Risks : 6 identifiés avec mitigations
```

---

### ÉTAPE 6 : Copier Templates Design (2 min - CRITIQUE)

**⚠️ IMPORTANT : À faire AVANT `/tasks` pour éviter blocages**

```bash
cd ~/Documents/DEV/mon-nouveau-projet

# 1. Copier .design/ library complète
cp -r ~/Documents/DEV/archon-native/.design ./

# 2. Copier agents Archon
mkdir -p .claude/agents
cp ~/Documents/DEV/archon-native/.claude/agents/archon-bootstrapper.md .claude/agents/
cp ~/Documents/DEV/archon-native/.claude/agents/design-specialist.md .claude/agents/

# 3. Copier command /design
mkdir -p .claude/commands
cp ~/Documents/DEV/archon-native/.claude/commands/design.md .claude/commands/

# 4. Copier scripts design
mkdir -p scripts/design
cp ~/Documents/DEV/archon-native/scripts/design/*.js scripts/design/

# 5. Créer structure design projet
SPEC_ID=$(ls specs/ | head -1)  # Ex: 001-mvp
mkdir -p specs/$SPEC_ID/design/wireframes
mkdir -p specs/$SPEC_ID/design/variants

# 6. Copier tokens template
cp .design/schemas/tokens-template.json specs/$SPEC_ID/design/tokens.json
```

---

#### 6.1 Vérifier Fichiers Copiés

```bash
# Vérifications
ls -la .design/
# → README.md, schemas/, patterns/, components/, workflows/

ls -la .claude/agents/
# → archon-bootstrapper.md, design-specialist.md

ls -la .claude/commands/
# → design.md (+ autres commands Spec-Kit)

ls -la scripts/design/
# → tokens-pull.js (+ autres si existent)

SPEC_ID=$(ls specs/ | head -1)
ls -la specs/$SPEC_ID/design/
# → tokens.json, wireframes/, variants/
```

**Si tout OK ✅, continuer. Sinon, corriger avant ÉTAPE 7.**

---

#### 6.2 Redémarrer VS Code

**CRUCIAL pour que Claude Code détecte les nouveaux agents/commands.**

```bash
# Dans VS Code
Cmd+Shift+P (macOS) ou Ctrl+Shift+P (Windows/Linux)
→ "Developer: Reload Window"

# OU fermer complètement et rouvrir
```

**Vérifier après restart :**
- Panneau Agents : `archon-bootstrapper` et `design-specialist` visibles
- Commandes : `/design` disponible

---

### ÉTAPE 7 : Tasks (2 min - Automatique)

**Dans Claude Code (après restart) :**
```
/tasks
```

**Workflow automatique :**
1. Lit `plan.md` (architecture + phases)
2. Extrait entities, API contracts, test scenarios
3. Génère `tasks.md` avec ~50-100 tasks
4. Organise en phases (Setup, Tests, Core, Integration, Polish)
5. Marque tasks parallélisables `[P]`

**Temps : ~2-3 minutes**

**Output attendu :**
```
✅ Tasks générées : specs/001-mvp/tasks.md
📋 78 tasks organisées en 5 phases
🔀 43 tasks parallélisables [P]
✅ Ready for bootstrap
```

---

### ÉTAPE 8 : Bootstrap Archon (3 min - Semi-Automatique)

#### 8.1 Vérifier Auto-Trigger Conditions

**archon-bootstrapper devrait s'auto-trigger si :**
- ✅ `.specify/` existe avec `constitution.md`
- ✅ `spec.md` existe
- ✅ `plan.md` existe
- ✅ `tasks.md` créé
- ✅ `.design/` copié (ÉTAPE 6)
- ✅ Agents copiés (ÉTAPE 6)

**Si auto-trigger OK → Passer à 8.3 (attendre fin)**

**Si rien ne se passe après 30s → 8.2 (manuel)**

---

#### 8.2 Lancer Bootstrap Manuellement (Si Nécessaire)

**Dans Claude Code, coller :**

```
Bootstrap archon - Phase finale

Fichiers déjà copiés (ÉTAPE 6) :
✅ .design/ library (7 items)
✅ .claude/agents/ (archon-bootstrapper, design-specialist)
✅ .claude/commands/design.md
✅ scripts/design/tokens-pull.js
✅ specs/[SPEC_ID]/design/tokens.json

Génère maintenant les fichiers manquants :

Phase 1 - Scripts Design (4 scripts) :
1. scripts/design/tokens-validate.js
   - Validation schema tokens.json
   - CLI: pnpm tokens:validate --fix

2. scripts/design/tokens-apply.js
   - Génère Tailwind config depuis tokens.json
   - CLI: pnpm tokens:apply

3. scripts/design/ui-test.js
   - Run a11y (axe) + perf (Lighthouse ≥90) + visual (Playwright 1%)
   - CLI: pnpm ui:test

4. scripts/design/ui-stitch.js
   - Génère variantes Figma via Stitch API
   - CLI: pnpm ui:stitch

Phase 2 - Agents Techniques (3 agents) :
1. .claude/agents/orchestrator-specialist.md
   - Coordination multi-agents, handoff rules
   - Triggers: "orchestrate", "coordinate"

2. .claude/agents/testing-specialist.md
   - TDD enforcement, quality gates P0-P4
   - Triggers: "test", "tdd", "quality"

3. .claude/agents/deployment-specialist.md
   - Vercel deploy, CI/CD, monitoring
   - Triggers: "deploy", "production", "ci"

Phase 3 - Hooks Git (.husky/) :
1. .husky/pre-commit
   - lint + type-check + test:staged

2. .husky/pre-push
   - build + test

Phase 4 - CLAUDE.md Racine :
Génère CLAUDE.md avec :
- Quick start
- Architecture overview
- Commands reference
- Development workflow
- Design system usage

Phase 5 - package.json Scripts (si existe) :
Ajoute :
- tokens:pull, tokens:validate, tokens:apply
- ui:test, ui:stitch

Mode : Génération autonome basé sur constitution.md.
Temps estimé : 3 minutes.
Rapport après chaque phase.
```

---

#### 8.3 Attendre Bootstrap Complet

**Temps : ~3 minutes**

**Phases executées :**
```
⏳ Phase 1: Scripts Design (30s)
⏳ Phase 2: Agents Techniques (1 min)
⏳ Phase 3: Hooks Git (30s)
⏳ Phase 4: CLAUDE.md (30s)
⏳ Phase 5: package.json (10s)
```

**Output attendu :**
```
✅ Bootstrap complet !

📁 Fichiers générés :
- scripts/design/ (5 fichiers)
- .claude/agents/ (5 agents total)
- .husky/ (2 hooks)
- CLAUDE.md
- package.json (scripts ajoutés)

📊 Total : ~15 fichiers générés
⏱️ Temps : 2m 47s

✅ Prêt pour /implement
```

---

#### 8.4 Vérifier Structure Finale

```bash
tree -L 2 -I 'node_modules'
```

**Doit afficher :**
```
mon-nouveau-projet/
├── .design/                    ✅ Design system global
│   ├── README.md
│   ├── schemas/
│   ├── patterns/
│   └── components/
├── .claude/
│   ├── agents/                 ✅ 5 agents
│   │   ├── archon-bootstrapper.md
│   │   ├── design-specialist.md
│   │   ├── orchestrator-specialist.md
│   │   ├── testing-specialist.md
│   │   └── deployment-specialist.md
│   └── commands/               ✅ Commands Spec-Kit + /design
├── .specify/
│   ├── memory/
│   │   └── constitution.md     ✅
│   ├── scripts/
│   └── templates/
├── specs/001-mvp/
│   ├── spec.md                 ✅
│   ├── plan.md                 ✅
│   ├── tasks.md                ✅ 78 tasks
│   └── design/                 ✅ Design projet
│       ├── tokens.json
│       ├── wireframes/
│       └── variants/
├── scripts/design/             ✅ 5 scripts
│   ├── tokens-pull.js
│   ├── tokens-validate.js
│   ├── tokens-apply.js
│   ├── ui-test.js
│   └── ui-stitch.js
├── .husky/                     ✅ Git hooks
│   ├── pre-commit
│   └── pre-push
├── CLAUDE.md                   ✅ Guide projet
└── package.json                ✅ Scripts design
```

---

### ÉTAPE 9 : Implement (14 jours - Selon Plan)

**Dans Claude Code :**

```
/implement

Commence implémentation selon tasks.md :

Phase 3.1 - Setup (T001-T010) :
- Next.js 14 init
- Supabase setup
- ESLint, Vitest, AI SDKs
- shadcn/ui, Redis, DB migration

Phase 3.2 - Tests First (T011-T019) - TDD :
- Contract tests (MUST FAIL avant implémentation)
- Integration tests

Phase 3.3 - Core Implementation (T020-T053) :
- AI clients
- Business logic
- API routes

Phase 3.4 - Integration & UI (T054-T065) :
- Landing page
- Dashboard
- Optimize page
- Settings

Phase 3.5 - Polish & Quality Gates (T066-T078) :
- Unit tests
- CI/CD
- Lighthouse CI
- Documentation
- Accessibility audit

Mode parallèle activé pour tasks [P].
Agents orchestration automatique.
Rapport après chaque phase.
```

---

## 🎯 Checklist Complète (Copy-Paste)

```markdown
### Setup Nouveau Projet Archon

- [ ] **ÉTAPE 1 : Créer Projet (2 min)**
  - [ ] `mkdir mon-nouveau-projet && cd mon-nouveau-projet`
  - [ ] `uvx --from git+https://github.com/github/spec-kit.git specify init`
  - [ ] Vérifier `.specify/` créé

- [ ] **ÉTAPE 2 : Constitution (5 min)**
  - [ ] Option A : Copier template OU Option B : `/constitution`
  - [ ] Vérifier `.specify/memory/constitution.md` existe
  - [ ] Personnaliser (PROJECT_NAME, MISSION, STACK)

- [ ] **ÉTAPE 3 : Specification (5 min)**
  - [ ] Option A : Copier spec.md OU Option B : `/specify`
  - [ ] Vérifier `specs/001-xxx/spec.md` existe
  - [ ] Review requirements (50+)

- [ ] **ÉTAPE 4 : Clarify (2 min - Optionnel)**
  - [ ] `/clarify` si questions ouvertes
  - [ ] Résoudre ambiguïtés

- [ ] **ÉTAPE 5 : Plan (3 min)**
  - [ ] `/plan`
  - [ ] Vérifier `specs/001-xxx/plan.md` généré
  - [ ] Review architecture + phases

- [ ] **ÉTAPE 6 : Copier Templates (2 min) ⚠️ CRITIQUE**
  - [ ] `cp -r ~/Documents/DEV/archon-native/.design ./`
  - [ ] `cp archon-native/.claude/agents/*.md .claude/agents/`
  - [ ] `cp archon-native/.claude/commands/design.md .claude/commands/`
  - [ ] `cp archon-native/scripts/design/*.js scripts/design/`
  - [ ] Créer `specs/001-xxx/design/` structure
  - [ ] `cp .design/schemas/tokens-template.json specs/001-xxx/design/tokens.json`
  - [ ] **Redémarrer VS Code** (Cmd+Shift+P → Reload Window)
  - [ ] Vérifier agents visibles dans panneau

- [ ] **ÉTAPE 7 : Tasks (2 min)**
  - [ ] `/tasks`
  - [ ] Vérifier `specs/001-xxx/tasks.md` généré
  - [ ] Review 50-100 tasks

- [ ] **ÉTAPE 8 : Bootstrap Archon (3 min)**
  - [ ] Attendre auto-trigger OU lancer manuellement
  - [ ] Vérifier 15 fichiers générés :
    - [ ] scripts/design/ (5 fichiers)
    - [ ] .claude/agents/ (5 agents)
    - [ ] .husky/ (2 hooks)
    - [ ] CLAUDE.md
    - [ ] package.json (scripts)

- [ ] **ÉTAPE 9 : Implement (14 jours)**
  - [ ] `/implement`
  - [ ] Suivre tasks.md phases 3.1 → 3.5
  - [ ] Quality gates P0-P4 validés

---

✅ **Setup Complet : ~30 minutes**
✅ **Prêt pour Implémentation : 14 jours**
```

---

## 🚨 Troubleshooting

### Problème 1 : Bootstrap Ne S'Auto-Trigger Pas

**Cause :** Conditions auto-trigger pas remplies.

**Solution :**
1. Vérifier fichiers copiés (ÉTAPE 6) :
   ```bash
   ls .design/
   ls .claude/agents/
   ls scripts/design/
   ```
2. Redémarrer VS Code (Cmd+Shift+P → Reload Window)
3. Lancer bootstrap manuellement (prompt ÉTAPE 8.2)

---

### Problème 2 : Agents Pas Visibles

**Cause :** VS Code pas redémarré après copie.

**Solution :**
```bash
# Fermer complètement VS Code
# Rouvrir dans le projet
code ~/Documents/DEV/mon-nouveau-projet

# Vérifier panneau Agents (icône 🤖)
```

---

### Problème 3 : "Template Source Not Found"

**Cause :** archon-native pas au bon endroit.

**Solution :**
```bash
# Vérifier chemin template
ls ~/Documents/DEV/archon-native/.design/

# Si erreur, ajuster chemin dans commandes ÉTAPE 6
# OU créer symlink
ln -s /path/to/archon-native ~/Documents/DEV/archon-native
```

---

### Problème 4 : Scripts Design Manquants

**Cause :** Seulement `tokens-pull.js` existe dans archon-native.

**Solution :** Les 4 autres scripts sont générés par bootstrap (ÉTAPE 8). Si manquants après bootstrap, lancer prompt ÉTAPE 8.2 manuellement.

---

### Problème 5 : package.json Scripts Pas Ajoutés

**Cause :** `package.json` n'existe pas encore (Next.js pas init).

**Solution :** Normal, les scripts seront ajoutés lors de `/implement` T001 (Next.js init). Ou créer `package.json` vide :
```bash
echo '{"name":"mon-projet","scripts":{}}' > package.json
```

---

## 📊 Temps Estimés Réalistes

| Étape | Temps | Automatique | Manuel |
|-------|-------|-------------|--------|
| 1. Créer Projet | 2 min | ✅ | - |
| 2. Constitution | 1-5 min | - | Template: 1 min, Claude: 5 min |
| 3. Specification | 2-5 min | - | Template: 2 min, Claude: 5 min |
| 4. Clarify | 0-2 min | - | Optionnel |
| 5. Plan | 3 min | ✅ | - |
| 6. Copier Templates | 2 min | - | ⚠️ Critique |
| 7. Tasks | 2 min | ✅ | - |
| 8. Bootstrap | 3 min | ✅ (si conditions OK) | Prompt manuel sinon |
| 9. Implement | 14 jours | Semi-auto | Phases parallélisables |

**Total Setup : 15-25 minutes**
**Total avec Implement : 14 jours**

---

## 🎯 Optimisations Avancées

### Fast Track (10 min Setup)

**Si templates déjà préparés :**

```bash
cd ~/Documents/DEV
mkdir mon-nouveau-projet && cd mon-nouveau-projet

# 1. Init + copy tout d'un coup (30s)
uvx --from git+https://github.com/github/spec-kit.git specify init && \
cp ~/templates/constitution.md .specify/memory/ && \
cp ~/templates/spec.md specs/001-mvp/ && \
cp -r ~/archon-native/.design ./ && \
cp -r ~/archon-native/.claude/agents/*.md .claude/agents/ && \
cp ~/archon-native/.claude/commands/design.md .claude/commands/ && \
cp -r ~/archon-native/scripts/design scripts/

# 2. Créer structure (10s)
mkdir -p specs/001-mvp/design/{wireframes,variants} && \
cp .design/schemas/tokens-template.json specs/001-mvp/design/tokens.json

# 3. Ouvrir VS Code
code .
```

**Puis dans Claude Code :**
```bash
/plan
/tasks
# Bootstrap auto-trigger
/implement
```

**Total : ~10 minutes setup**

---

### Script d'Automatisation (Future)

**Créer `archon-new-project.sh` :**

```bash
#!/bin/bash
# Usage: ./archon-new-project.sh mon-projet saas-b2b

PROJECT_NAME=$1
PROJECT_TYPE=$2
TEMPLATE_ROOT=~/Documents/DEV/archon-native

mkdir $PROJECT_NAME && cd $PROJECT_NAME

# Init Spec-Kit
uvx --from git+https://github.com/github/spec-kit.git specify init

# Copy templates
cp $TEMPLATE_ROOT/templates/constitution-$PROJECT_TYPE.md .specify/memory/constitution.md
cp -r $TEMPLATE_ROOT/.design ./
cp -r $TEMPLATE_ROOT/.claude/agents/*.md .claude/agents/
cp $TEMPLATE_ROOT/.claude/commands/design.md .claude/commands/
cp -r $TEMPLATE_ROOT/scripts/design scripts/

# Create structure
mkdir -p specs/001-mvp/design/{wireframes,variants}
cp .design/schemas/tokens-template.json specs/001-mvp/design/tokens.json

echo "✅ Project $PROJECT_NAME created!"
echo "📁 Open in VS Code: code ."
echo "🚀 Run workflow: /specify → /plan → /tasks → /implement"
```

**Usage :**
```bash
chmod +x archon-new-project.sh
./archon-new-project.sh localai-seo saas-b2b
```

---

## ✅ Validation Finale

**Après ÉTAPE 8 (Bootstrap), vérifier :**

```bash
# Structure complète
tree -L 2 -I 'node_modules'

# Agents (5)
ls .claude/agents/ | wc -l  # → 5

# Scripts design (5)
ls scripts/design/ | wc -l  # → 5

# Design tokens
cat specs/001-mvp/design/tokens.json | jq '.colors.primary'

# Constitution
grep "E1-E16" .specify/memory/constitution.md

# Spec
grep "Functional Requirements" specs/001-mvp/spec.md

# Plan
grep "Implementation Phases" specs/001-mvp/plan.md

# Tasks
wc -l specs/001-mvp/tasks.md  # → 50-100 tasks
```

**Si toutes validations ✅ → Prêt pour `/implement` 🚀**

---

## 📚 Ressources

### Documentation
- [Spec-Kit](https://github.com/github/spec-kit)
- [Archon Native Template](https://github.com/YOUR_ORG/archon-native)
- [Design System Standards](/.design/README.md)
- [Constitution Standards E1-E16](/.specify/memory/constitution.md)

### Templates
- `~/Documents/DEV/archon-native/` - Template complet
- `~/Documents/DEV/archon-orchestrator/LOCAL-AI-SEO-*.md` - Exemples

### Support
- Issues : https://github.com/YOUR_ORG/archon-native/issues
- Discussions : https://github.com/YOUR_ORG/archon-native/discussions

---

**Version:** 2.0 (Process Complet Sans Blocage)
**Testé sur :** LocalAI SEO (2025-01-05)
**Auteur:** @manu + Claude Code
**Status:** ✅ Production-Ready

*Ce process a été validé end-to-end et élimine tous les points de blocage identifiés.*
