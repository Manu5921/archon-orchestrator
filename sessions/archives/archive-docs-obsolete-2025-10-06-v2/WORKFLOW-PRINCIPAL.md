# 🚀 WORKFLOW PRINCIPAL - ARCHON ORCHESTRATOR

**Version:** 3.0
**Date:** 2025-10-06
**Mission:** Workflow de référence pour TOUS les futurs projets

---

## 🎯 OBJECTIF

Ce document définit **LE workflow unique** à suivre pour créer un nouveau projet avec:
- ✅ Spec-Kit (specify → plan → tasks)
- ✅ Sub-Agents orchestration (chaining automatique)
- ✅ Standards E1-E16 (Architecture-First, Types-First, Tests-First)
- ✅ Quality Gates P0-P4 (Build, Lint, Tests, Docs, Perf)

**Résultat:** Projet production-ready en 14 jours avec architecture solide.

---

## 📋 WORKFLOW COMPLET (3 PHASES)

### **PHASE 1: SETUP PROJET (30 minutes)**

#### Étape 1: Init Spec-Kit (2 min)

```bash
# Créer nouveau projet
uvx --from git+https://github.com/github/spec-kit.git specify init myproject
cd myproject
```

**Résultat attendu:**
```
✓ Created .specify/ directory
✓ Created .specify/memory/
✓ Created specs/ directory
```

---

#### Étape 2: Constitution (5 min)

**Via Claude Code:**

```
/constitution

Type de projet : [SaaS B2B / SaaS B2C / Mobile App / E-commerce]
Stack : Next.js 14 + Supabase + Vercel
Contraintes : [Budget API strict / Performance <1s]
Métriques succès : MRR, Churn, NPS

Génère constitution.md avec :
- Standards E1-E16
- Design Principles P1-P5
- Architecture Principles A1-A3
- Quality Gates P0-P4
- Tech Stack détaillé
```

**Fichier généré:** `.specify/memory/constitution.md`

---

#### Étape 3: Specification (5 min)

**Via Claude Code:**

```
/specify

Feature Name : MVP [Nom Feature]
User Problem : [Problème utilisateur]
Solution : [Solution proposée]
Target Users : [Persona cible]

Key Features :
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

Génère spec.md avec :
- Executive Summary
- User Scenarios
- Functional Requirements (50+)
- Acceptance Criteria
- Edge Cases
```

**Fichier généré:** `specs/001-mvp/spec.md`

---

#### Étape 4: Clarify (2 min - Optionnel)

**Si questions ouvertes:**

```
/clarify

Questions :
1. Budget API maximum par client ?
2. Monitoring fréquence minimale ?
3. Support offline-first ?
```

---

#### Étape 5: Plan (3 min)

**Via Claude Code:**

```
/plan
```

**Workflow automatique:**
1. Lit `constitution.md` (standards)
2. Lit `spec.md` (requirements)
3. Génère architecture technique + phases + risks

**Fichier généré:** `specs/001-mvp/plan.md`

---

#### Étape 6: Tasks (2 min)

**Via Claude Code:**

```
/tasks
```

**Workflow automatique:**
1. Lit `plan.md` (architecture + phases)
2. Extrait entities, API contracts, test scenarios
3. Génère 50-100 tasks organisées en phases
4. Marque tasks parallélisables `[P]`

**Fichier généré:** `specs/001-mvp/tasks.md`

---

#### Étape 7: Copier Templates Archon (2 min) ⚠️ **CRITIQUE**

```bash
cd ~/Documents/DEV/myproject

# 1. Copier Design System
cp -r ~/Documents/DEV/archon-orchestrator/.design ./

# 2. Copier Scripts
cp -r ~/Documents/DEV/archon-orchestrator/scripts/ ./scripts/

# 3. Copier Templates Sub-Agents (pour bootstrap)
mkdir -p .claude/agents-templates
cp ~/Documents/DEV/archon-orchestrator/.claude/agents-templates/* .claude/agents-templates/

# 4. Copier Mega Orchestrator Bootstrap
cp ~/Documents/DEV/archon-orchestrator/.claude/agents/mega-orchestrator-bootstrap.md .claude/agents/

# 5. Créer structure design projet
SPEC_ID=$(ls specs/ | head -1)
mkdir -p specs/$SPEC_ID/design/{wireframes,variants}
```

**Vérification:**
```bash
ls .design/                  # → README.md, schemas/, patterns/
ls scripts/                  # → design/, validation/
ls .claude/agents-templates/ # → sub-agent templates
ls .claude/agents/           # → mega-orchestrator-bootstrap.md
```

---

#### Étape 8: Redémarrer VS Code (Obligatoire)

**Pourquoi:** Claude Code doit détecter nouveaux agents/templates.

```
Cmd+Shift+P (macOS) → "Developer: Reload Window"
OU fermer/rouvrir VS Code
```

**Vérifier après restart:**
- Panneau Agents: `mega-orchestrator-bootstrap` visible
- Commandes: `/specify`, `/plan`, `/tasks` disponibles

---

#### Étape 9: Bootstrap Archon (3 min - AUTO)

**Le mega-orchestrator-bootstrap détecte automatiquement:**
- ✅ `constitution.md` existe
- ✅ `spec.md` existe
- ✅ `plan.md` existe
- ✅ `tasks.md` créé (trigger principal)

**Workflow automatique du mega-orchestrator:**

```
1. LIT tasks.md (50-100 tasks)

2. IDENTIFIE domaines requis:
   - Frontend (si tasks React/UI)
   - Backend (si tasks API/Database)
   - Testing (toujours présent)
   - Security (si tasks auth/validation)
   - DevOps (si tasks deploy/CI)

3. GÉNÈRE sub-agents spécialisés:
   Pour chaque domaine détecté, crée fichier agent:

   .claude/agents/
   ├── frontend-specialist.md      (si tasks frontend)
   ├── backend-specialist.md       (si tasks backend)
   ├── testing-specialist.md       (toujours)
   ├── security-specialist.md      (si tasks security)
   └── devops-specialist.md        (si tasks deploy)

4. CRÉE prompts de liaison:
   Pour chaque task dans tasks.md, génère:

   .claude/task-prompts/
   ├── T001-nextjs-setup.md
   │   → Agent: devops-specialist
   │   → Handoff: frontend-specialist
   ├── T015-auth-api.md
   │   → Agent: backend-specialist
   │   → Handoff: security-specialist
   └── T045-deploy-vercel.md
       → Agent: devops-specialist
       → Handoff: testing-specialist

5. CONFIGURE chaining rules:
   - Sequential: Task N → Task N+1
   - Parallel: Tasks marquées [P] exécutables simultanément
   - Handoff conditions: Quality gates P0 must pass

6. GÉNÈRE CLAUDE.md racine:
   - Quick start projet
   - Architecture overview
   - Liste agents créés
   - Workflow /implement
```

**Résultat attendu:**
```
✅ Mega Orchestrator Bootstrap Complet !

📁 Sub-Agents Générés : 5 agents
- frontend-specialist.md
- backend-specialist.md
- testing-specialist.md
- security-specialist.md
- devops-specialist.md

📝 Task Prompts Créés : 78 prompts
- .claude/task-prompts/T001-T078.md
- Chaining rules configurées
- Handoff conditions définies

📋 CLAUDE.md Généré
- Quick start
- Agents reference
- Workflow guide

⏱️ Temps : 2m 43s
✅ Prêt pour /implement
```

---

### **PHASE 2: IMPLÉMENTATION (14 jours selon plan)**

#### Étape 10: Lancer Implémentation

**Via Claude Code:**

```
/implement
```

**Workflow automatique du mega-orchestrator:**

```
1. LIT .claude/task-prompts/ (ordre séquentiel)

2. POUR chaque task:

   a) IDENTIFIE agent responsable
      Ex: T001 (Next.js setup) → devops-specialist

   b) DÉLÈGUE à l'agent avec context:
      @devops-specialist, exécute T001.

      **CONTEXT:**
      - Project: [Nom depuis constitution.md]
      - Phase: Setup (3.1)
      - Previous: None (première task)
      - Standards: E1, E2, E3 (depuis constitution.md)
      - Quality Gates: P0 (build must succeed)

      **TASK:** [Détails T001 depuis tasks.md]

   c) AGENT EXÉCUTE avec agentic loop:

      GATHER Phase:
      - Read task requirements
      - IF unclear → Read plan.md, spec.md
      - REPEAT until full understanding ✓

      ACTION Phase:
      - Generate code/config
      - Read back immediately
      - IF issues → Fix
      - REPEAT until valid ✓

      VERIFY Phase:
      - Run quality gates (P0: build)
      - IF fail → Analyze + Fix
      - REPEAT until pass ✓

   d) AGENT REPORTE résultat:

      ## [Agent-Name] Report - T001

      **Status:** ✅ Complete

      **Summary:** Next.js 14 initialized with TypeScript strict mode.

      **Artifacts Created:**
      - package.json
      - tsconfig.json
      - next.config.js
      - src/app/layout.tsx

      **Quality Gates:**
      - P0 Build: ✅ PASS (npm run build success)

      **Next Steps:** Ready for handoff to @frontend-specialist (T002)

   e) MEGA-ORCHESTRATOR valide handoff:

      - Check Status = ✅
      - Check Artifacts exist
      - Check Quality Gates P0 passed
      - IF all ✅ → Proceed to next task
      - IF ❌ → Block + escalate to user

3. POUR tasks parallélisables [P]:

   - Lancer agents en parallèle (max 3 simultanés)
   - Attendre completion de tous
   - Consolider résultats
   - Vérifier pas de conflits
   - Proceed to next phase

4. APRÈS chaque phase (3.1, 3.2, 3.3, 3.4, 3.5):

   - Générer rapport phase
   - Valider quality gates globaux
   - Demander confirmation user avant phase suivante
```

**Exemple workflow task réelle:**

```
[10:00] Mega-Orchestrator: Starting T001 (Next.js setup)
[10:00] → Delegating to @devops-specialist...

[10:01] devops-specialist: GATHER phase complete
        - Read T001 requirements ✓
        - Read plan.md architecture section ✓
        - Understanding: Next.js 14 + TS strict + ESLint ✓

[10:02] devops-specialist: ACTION phase complete
        - Created package.json ✓
        - Created tsconfig.json (strict: true) ✓
        - Created next.config.js ✓
        - Read back files, validated syntax ✓

[10:03] devops-specialist: VERIFY phase complete
        - npm run build: ✅ SUCCESS
        - Quality Gate P0 (build): ✅ PASS

[10:03] devops-specialist: REPORT submitted
        Status: ✅, Artifacts: 4 files, Next: @frontend-specialist

[10:03] Mega-Orchestrator: Handoff validation
        - Status ✅
        - Artifacts exist ✓
        - P0 gates passed ✓
        - Handoff APPROVED → T002

[10:04] Mega-Orchestrator: Starting T002 (Component library setup)
[10:04] → Delegating to @frontend-specialist...

[Workflow continues...]
```

---

#### Étape 11: Monitoring Progression

**Pendant implémentation, mega-orchestrator génère:**

```
.claude/progress/
├── phase-3.1-setup.md          # Rapport phase setup
├── phase-3.2-tests.md          # Rapport phase tests
├── phase-3.3-core.md           # Rapport phase core
├── phase-3.4-integration.md    # Rapport phase integration
└── phase-3.5-polish.md         # Rapport phase polish
```

**Chaque rapport contient:**
```markdown
## Phase 3.1 - Setup (T001-T010)

**Status:** ✅ Complete (10/10 tasks)

**Completion Time:** 47 minutes

**Agents Utilisés:**
- devops-specialist: 6 tasks
- frontend-specialist: 2 tasks
- backend-specialist: 2 tasks

**Quality Gates:**
- P0 Build: ✅ 10/10 tasks
- P1 Lint: ✅ 10/10 tasks
- P2 Type Check: ✅ 10/10 tasks

**Artifacts Created:** 23 files

**Issues Encountered:** None

**Next Phase:** 3.2 - Tests First (T011-T019)
```

---

### **PHASE 3: VALIDATION & CI/CD (Continue)**

#### Étape 12: Push GitHub

```bash
# Première feature complète
git add .
git commit -m "feat: implement MVP features

- ✅ 78 tasks completed
- ✅ All P0-P2 quality gates passed
- ✅ Tests coverage: 92%
- ✅ Architecture compliance: 95%

Generated with Archon Mega Orchestrator
Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

---

#### Étape 13: GitHub Actions (Auto)

**Workflow `.github/workflows/archon-validation.yml` se déclenche:**

```yaml
name: Archon Validation

on: [push, pull_request]

jobs:
  architecture-compliance:
    runs-on: ubuntu-latest
    steps:
      - name: Architecture Compliance V2
        # Score doit être ≥75%
        # Vérifie respect constitution.md

  quality-gates:
    runs-on: ubuntu-latest
    steps:
      - name: Run Quality Gates P0-P4
        # P0: Build ✓
        # P1: Lint ✓
        # P2: Type Check ✓
        # P3: Tests ✓
        # P4: Coverage ≥90% ✓

  security-analysis:
    runs-on: ubuntu-latest
    steps:
      - name: Jules Security Scan
        # Scan vulnérabilités
        # Score ≥70% required
```

**Si ✅ tous jobs passent → Merge autorisé**
**Si ❌ échec → Corrections + re-validation auto**

---

## 🎯 POINTS CLÉS DU WORKFLOW

### 1. **Mega Orchestrator = Cerveau Central**

**Rôle:**
- Lit tasks.md
- Génère sub-agents spécialisés dynamiquement
- Crée task prompts avec chaining rules
- Orchestre exécution séquentielle/parallèle
- Valide handoffs entre agents
- Génère rapports progression

**Différence vs workflow manuel:**
- ❌ **Avant:** User appelle chaque agent manuellement
- ✅ **Maintenant:** Mega-orchestrator délègue automatiquement

---

### 2. **Sub-Agents = Spécialistes Autonomes**

**Caractéristiques agents générés:**

```yaml
---
name: frontend-specialist
description: >
  React/Next.js expert. Use PROACTIVELY for: "component", "UI", "frontend",
  "React", "Next.js". Creates type-safe, accessible components.

tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet

triggers:
  - component creation
  - UI implementation
  - React patterns
  - accessibility (a11y)
---

# Purpose

Expert React/Next.js developer creating production-ready components.

## Instructions - Agentic Loop

### GATHER Phase
1. Read task requirements from task prompt
2. IF unclear → Read spec.md, plan.md, constitution.md
3. IF need examples → Grep codebase for similar patterns
4. REPEAT until full understanding ✓

### ACTION Phase
1. Generate component code (TypeScript strict)
2. Generate tests (Vitest + React Testing Library)
3. Read back immediately
4. IF type errors → Fix
5. IF missing accessibility → Add ARIA labels
6. REPEAT until valid ✓

### VERIFY Phase
1. Run type check: `npm run type-check`
2. Run tests: `npm test -- [component].test.tsx`
3. Run a11y audit: `npm run ui:test --audit=a11y`
4. IF fail → Analyze error + Fix
5. REPEAT until all pass ✓

## Handoff Rules

### → @testing-specialist
**When:** Component implementation complete + P0-P2 gates passed
**Deliverables:**
- Component file: `src/components/[Name].tsx`
- Tests file: `src/components/[Name].test.tsx`
- Types file: `src/types/[Name].types.ts`

**Context to Pass:**
- Component purpose
- Props interface
- Test coverage achieved
- Accessibility compliance status

**Block Handoff IF:**
- Type check fails (P2)
- Tests fail (P0)
- A11y violations > 0 (P1)

## Report Format

```markdown
## Frontend Specialist Report - T[NUMBER]

**Status:** ✅ Complete | ⚠️ Partial | ❌ Blocked

**Summary:** [1 sentence describing what was implemented]

**Artifacts Created:**
- `src/components/[Component].tsx`
- `src/components/[Component].test.tsx`
- `src/types/[Component].types.ts`

**Quality Gates:**
- P0 Build: ✅ | ❌
- P1 Lint: ✅ | ❌
- P2 Type Check: ✅ | ❌
- P3 Tests: ✅ | ❌ (coverage: X%)
- P4 A11y: ✅ | ❌ (violations: N)

**Next Steps:** Ready for handoff to @testing-specialist
```
```

---

### 3. **Task Prompts = Contrats Précis**

**Exemple task prompt généré:**

```markdown
# T015 - Authentication API Endpoint

**Assigned Agent:** backend-specialist

**Task Description:**
Implement user authentication API endpoint with JWT tokens.

**Requirements from tasks.md:**
- POST /api/auth/login
- Validation: email (Zod), password (min 8 chars)
- Response: JWT token (7 days expiry)
- Error handling: 401 invalid credentials, 429 rate limit

**Context:**
- Project: [Project name from constitution.md]
- Phase: 3.3 Core Implementation
- Previous Tasks Completed: T001-T014
- Dependencies: T012 (Database setup), T013 (User model)

**Standards to Follow:**
- E2: Types-First (Zod schemas required)
- E3: Tests-First (write failing test FIRST)
- E8: Quality Gates P0-P3 mandatory

**Quality Gates:**
- P0: Build succeeds (`npm run build`)
- P1: Lint passes (`npm run lint`)
- P2: Type check passes (`npm run type-check`)
- P3: Tests pass (`npm test -- auth`)

**Acceptance Criteria:**
1. ✅ POST endpoint returns JWT on valid credentials
2. ✅ Returns 401 on invalid credentials
3. ✅ Rate limiting active (5 attempts/min)
4. ✅ Password hashing with bcrypt
5. ✅ Tests coverage ≥90% for auth logic

**Artifacts to Create:**
- `src/api/auth/login.ts`
- `src/api/auth/login.test.ts`
- `src/types/auth.types.ts`
- `src/schemas/auth.schema.ts` (Zod)

**Handoff Next:**
→ @security-specialist (for security audit of auth flow)

**Context to Pass to Next Agent:**
- JWT secret location (env var)
- Token expiry duration
- Rate limit thresholds
- Password hashing algorithm used

---

**Instructions for Agent:**

Execute this task following agentic loop:
- GATHER: Read requirements, check dependencies completed
- ACTION: Implement code + tests (TDD: tests FIRST)
- VERIFY: Run quality gates P0-P3, iterate until pass

Report using standard format when complete.
```

---

### 4. **Chaining Automatique**

**Comment ça marche:**

```
1. Mega-Orchestrator LIT task-prompts/T015.md

2. IDENTIFIE agent: backend-specialist

3. CHARGE context depuis tasks précédentes:
   - T012: Database setup complete ✓
   - T013: User model créé ✓
   - Dependencies satisfied ✓

4. GÉNÈRE prompt complet pour agent:

   @backend-specialist, execute task T015.

   **CONTEXT:**
   [Embedded from constitution.md, spec.md, T012-T014 reports]

   **TASK:**
   [Full task description from T015.md]

   **DELIVERABLES:**
   [List of files + quality gates]

5. AGENT EXÉCUTE task (agentic loop autonome)

6. AGENT REPORTE résultat

7. MEGA-ORCHESTRATOR VALIDE:
   - Status = ✅ ? → Continue
   - Artifacts created ? → Continue
   - Quality gates passed ? → Continue
   - IF all ✅ → HANDOFF to @security-specialist
   - IF ❌ → ESCALATE to user

8. NEXT TASK (T016):
   Mega-Orchestrator charge T016.md
   Identifie agent: security-specialist
   Passe context T015 report
   Workflow continues...
```

**Résultat:** Zero intervention manuelle, tasks s'enchaînent automatiquement.

---

## 🚨 TROUBLESHOOTING

### Problème 1: Mega-Orchestrator ne s'auto-trigger pas

**Cause:** Conditions pas remplies ou VS Code pas redémarré.

**Solution:**
1. Vérifier fichiers copiés (Étape 7)
2. Redémarrer VS Code (Cmd+Shift+P → Reload Window)
3. Lancer manuellement:
   ```
   @mega-orchestrator-bootstrap, bootstrap project now.
   ```

---

### Problème 2: Sub-Agents ne s'enchaînent pas

**Cause:** Handoff conditions pas validées ou quality gates bloquants.

**Solution:**
1. Vérifier rapport agent précédent:
   ```bash
   cat .claude/progress/current-task-report.md
   ```
2. Si Status ❌ → Corriger issues avant handoff
3. Si Quality Gates fail → Résoudre puis relancer

---

### Problème 3: Tasks exécutées dans mauvais ordre

**Cause:** Dependencies pas détectées correctement.

**Solution:**
1. Vérifier tasks.md contient dependencies explicites:
   ```markdown
   ## T015 - Auth API
   **Dependencies:** T012, T013
   ```
2. Mega-orchestrator respecte dependencies automatiquement

---

## 📊 MÉTRIQUES DE SUCCÈS

**Workflow validé si:**

| Métrique | Target | Mesure |
|----------|--------|--------|
| Setup Time | <30 min | Étapes 1-9 |
| Sub-Agents Générés | 4-6 agents | Selon domaines détectés |
| Task Prompts Créés | = Nb tasks (50-100) | Auto depuis tasks.md |
| Chaining Success Rate | ≥95% | Tasks complètes sans intervention |
| Quality Gates Pass | 100% P0-P2 | Build, Lint, Type-check |
| Implementation Time | 14 jours | Selon plan.md phases |

---

## ✅ CHECKLIST FINALE

**Avant de considérer workflow maîtrisé:**

- [ ] **Setup (30 min)** exécuté sans erreur
- [ ] **Mega-orchestrator** a généré 4-6 sub-agents
- [ ] **Task prompts** créés pour toutes tasks (50-100)
- [ ] **Chaining automatique** fonctionne (agent → handoff → agent)
- [ ] **Quality gates** validés (P0-P2 minimum)
- [ ] **Rapports progression** générés automatiquement
- [ ] **GitHub CI/CD** configuré et fonctionnel
- [ ] **Documentation** (CLAUDE.md) générée dans projet

---

**✅ Workflow Production-Ready**

Ce workflow a été conçu pour éliminer **100% des interventions manuelles** durant l'implémentation, tout en maintenant **qualité maximale** via quality gates automatisés et agents spécialisés autonomes.

**Prochaine action:** Tester sur 1 projet réel pour valider end-to-end.

---

**Version:** 3.0 - Mega Orchestrator Bootstrap Pattern
**Date:** 2025-10-06
**Auteur:** @manu + Claude Code
**Status:** ✅ Ready for Implementation
