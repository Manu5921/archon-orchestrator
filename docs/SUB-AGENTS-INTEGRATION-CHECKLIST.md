# 🤖 SUB-AGENTS INTEGRATION - Checklist Complète

**Date:** 2025-10-13
**Mission:** Intégrer agents communautaires dans workflow V4 avec MCP + Design
**Repo Source:** https://github.com/wshobson/agents.git

---

## ✅ CONTEXTE WORKFLOW V4 (À RESPECTER)

### 🎯 Vision Workflow

- ✅ **Mac 24/7** - Station principale développement
- ✅ **GitHub systématique** - Workflow pro + commits réguliers + Jules async
- ✅ **Exécution hybride** - Local (Mac) OU Cloud (GitHub Actions)
- ✅ **Multi-projets** - 3-4 simultanés (2-3 cloud + 1 local)
- ❌ **PAS "mobile-first"** - Mobile = monitoring uniquement

### 📋 Workflow Standard (4-5h par projet)

```bash
# Phase 1: Planning Spec-Kit (30 min - Mac)
/speckit.constitution  # → .specify/memory/constitution.md
/speckit.specify       # → specs/001-mvp/spec.md
/speckit.plan          # → specs/001-mvp/plan.md
/speckit.tasks         # → specs/001-mvp/tasks.md (50-100 tasks)

# Phase 2: Setup GitHub (2 min)
gh repo create + workflow + secret + label

# Phase 3: Implementation (3-4h - Mac local)
/implement
# → Claude Code lit tasks.md
# → Délègue aux sub-agents spécialisés
# → Commits réguliers automatiques
# → PR créée automatiquement
# → Jules Security scan (async parallèle)

# Phase 4: Review + Merge (15 min - Mac OU mobile)
gh pr view 1
gh pr review 1 --approve
gh pr merge 1 --squash
```

---

## 🛠️ MCP CONFIGURATION (OBLIGATOIRE)

### MCP Validés (À Utiliser)

**Fichier : `.claude/mcp.json` (projet scope)**

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "ctx7sk-a4cbd112-d168-4531-bef2-d6e878606a31"
      }
    },
    "eslint": {
      "command": "npx",
      "args": ["@eslint/mcp@latest"]
    },
    "supabase": {
      "type": "http",
      "url": "http://localhost:54321/mcp"
    }
  }
}
```

### MCP Non Fonctionnels (NE PAS UTILISER)

- ❌ **Semgrep MCP** - Package `@semgrep/mcp` inexistant
  - **Alternative validée :** Codex wrapper Semgrep (optionnel)
  - **Solution workflow V4 :** Jules Security (async GitHub Actions)

### MCP Usage dans Sub-Agents

**Les agents DOIVENT mentionner ces MCP :**

1. **Context7** - Knowledge base patterns
   - Backend : Auth patterns, API structure, DB patterns
   - Frontend : Layout patterns, Form patterns, Component composition
   - Utilisation : `"Find authentication pattern used in previous projects"`

2. **ESLint** - Code quality inline
   - Appeler après chaque fichier écrit
   - Scope : fichier modifié uniquement (±30 lines)
   - Fix ALL errors before commit

3. **Supabase Local** (optionnel)
   - Si Docker Supabase lancé
   - Inspect schemas, query data, verify RLS policies

---

## 🎨 DESIGN SYSTEM (ESSENTIEL)

### T002: Design Tokens & Wireframes

**Agent obligatoire :** `design-specialist.md`

**Ce qu'il génère (2-5 min) :**

1. ✅ `specs/001-mvp/design/design-tokens.json`
   - 20 tokens essentiels (Colors, Typography, Spacing, Radius, Shadows)
   - Source of truth unique pour UI cohérente

2. ✅ `specs/001-mvp/design/wireframes/`
   - `dashboard.svg` (layout générique sidebar + header + content)
   - `menu.svg` (navigation simple)
   - `auth-flow.svg` (login/signup screens si auth dans spec)

3. ✅ `specs/001-mvp/design/components.json`
   - Liste shadcn/ui components nécessaires
   - Installation command : `npx shadcn-ui@latest add button card input form`

**Référence :** `docs/DESIGN-SYSTEM-SOLO-SIMPLIFIED.md`

**Avantages :**
- ✅ Cohérence UI dès le début
- ✅ Personnalisation rapide (modifier 1 JSON = 30 min vs 2-3h refactor)
- ✅ Design générique OK pour MVP
- ✅ Réutilisable cross-projets

---

## 🤖 SUB-AGENTS ESSENTIELS (4-5 MINIMUM)

### 1. design-specialist ⭐ CRITIQUE
**Domaine :** UX/UI Design Tokens
**Triggers :** "design", "UI", "tokens", "wireframes", "branding"
**Tools :** Write, Read, Bash
**Model :** sonnet
**Génère :**
- design-tokens.json (20 tokens)
- wireframes SVG (dashboard, menu, auth-flow)
- components.json (shadcn/ui list)

**MCP Usage :**
- Context7 : Design patterns réutilisables

**Quality Gates :**
- P0 : N/A (design files)
- P1 : JSON valid
- P3 : components.json documented

**Handoff → @frontend-specialist**

---

### 2. backend-specialist ⭐ CRITIQUE
**Domaine :** API + Database + Auth
**Triggers :** "API", "endpoint", "backend", "database", "auth", "server"
**Tools :** Read, Write, Edit, Bash, Grep, Glob
**Model :** sonnet
**Génère :**
- API routes (Express/Fastify/Next.js API)
- Supabase schema + RLS policies
- Auth logic (JWT/Supabase Auth)
- Integration tests

**MCP Usage :**
- Context7 : Auth patterns, API structure, DB patterns
- ESLint : Call after each .ts/.js file (scope: file only)
- Supabase Local : Inspect schemas, verify RLS

**Quality Gates :**
- P0 Build : MUST pass (blocking)
- P1 Lint : Fix errors (ESLint 0 errors)
- P2 Tests : Integration tests passing

**Handoff → @frontend-specialist OR @testing-specialist**

---

### 3. frontend-specialist ⭐ CRITIQUE
**Domaine :** React/Next.js + UI Components
**Triggers :** "component", "page", "UI", "React", "Next.js", "form", "layout"
**Tools :** Read, Write, Edit, Bash, Grep, Glob
**Model :** sonnet
**Génère :**
- React components (TypeScript strict)
- Next.js pages/routes
- Forms (React Hook Form + Zod)
- shadcn/ui integration

**MCP Usage :**
- Context7 : Layout patterns, Form patterns, Component composition
- ESLint : Call after each .tsx/.ts file (React hooks deps, a11y)

**IMPORTANT :**
- **MUST use design-tokens.json** (généré par @design-specialist)
- Import tokens in `tailwind.config.ts`
- Use shadcn/ui components (from components.json)
- Responsive mobile-first

**Quality Gates :**
- P0 Build : MUST pass
- P1 Lint : Fix errors (hooks deps, TypeScript, a11y)
- P2 Manual test : Test in browser

**Handoff → @testing-specialist**

---

### 4. testing-specialist ⭐ CRITIQUE
**Domaine :** E2E + Integration Tests
**Triggers :** "test", "E2E", "integration", "unit", "coverage"
**Tools :** Read, Write, Edit, Bash
**Model :** sonnet
**Génère :**
- E2E tests (Playwright/Cypress)
- Integration tests (Vitest/Jest)
- Coverage reports

**MCP Usage :**
- Context7 : Test patterns

**Quality Gates :**
- P0 Build : N/A (tests)
- P2 Tests : All tests passing

**Handoff → Final (no handoff)**

---

### 5. devops-specialist (Optionnel)
**Domaine :** Deploy + CI/CD
**Triggers :** "deploy", "CI", "CD", "build", "Docker", "Vercel"
**Tools :** Read, Write, Edit, Bash
**Model :** sonnet
**Génère :**
- Vercel/Netlify config
- GitHub Actions workflows
- Docker config (si nécessaire)

**MCP Usage :**
- Context7 : Deploy patterns

---

## 🚨 ADAPTATIONS NÉCESSAIRES (Repo Communautaire)

### Modifications à Faire

1. **Ajouter MCP Context7 + ESLint**
   - Dans section "Tools Available" ou "MCP Productivity"
   - Exemples d'utilisation concrets
   - Appel ESLint après chaque fichier

2. **Retirer Semgrep MCP**
   - Remplacer par : "Security handled by Jules (GitHub Actions async)"
   - OU mention Codex wrapper (optionnel)

3. **Ajouter design-specialist (si absent)**
   - Créer depuis template `docs/DESIGN-SYSTEM-SOLO-SIMPLIFIED.md`
   - Intégrer dans workflow (T002 task)

4. **Handoff Rules**
   - Clarifier → @next-agent
   - Context to pass (API endpoints, auth flow, data models)
   - Block conditions (P0/P1/P2 failing)

5. **Quality Gates P0-P4**
   - P0 Build : MUST pass (blocking handoff)
   - P1 Lint : Fix errors (warnings OK si documentées)
   - P2 Tests : Passing (minimum)
   - P3 Docs : README + JSDoc
   - P4 Performance : Optionnel MVP

6. **Agentic Loop Structure**
   - GATHER Phase : Read context (spec, plan, tasks, dependencies)
   - ACTION Phase : Generate code + tests
   - VERIFY Phase : Run quality gates (build, lint, tests)

---

## 📦 STRUCTURE FICHIERS AGENTS

### Template Agent Standard

```markdown
---
name: {domain}-specialist
description: >
  {Domain} expert. Use PROACTIVELY for: {triggers}.
  Creates {outputs}. Uses MCP: Context7, ESLint.
tools: Read, Write, Edit, Bash, Grep, Glob
model: sonnet
color: {color}
---

# Purpose

Expert {domain} specialist creating production-ready {artifacts}.

## Tools Available

### Code Tools
- Read, Write, Edit, Bash

### MCP Productivity
- **Context7** - {Usage examples}
- **ESLint** - Lint after each file (scope: file only)
- **Supabase Local** - DB debug (if Docker running)

## Instructions - Agentic Loop

### GATHER Phase (30 sec)

1. **Read Task Requirements:**
   - Read task prompt OR `specs/001-mvp/tasks.md`
   - Extract: {domain-specific requirements}

2. **Read Context:**
   - Read `specs/001-mvp/spec.md`
   - Read `specs/001-mvp/plan.md`
   - Read `.specify/memory/constitution.md`

3. **Check Dependencies:**
   - Grep codebase for existing patterns
   - Check package.json for dependencies

### ACTION Phase (Main Implementation)

1. **Generate {Artifacts}:**
   - Create {files}
   - TypeScript strict (no `any`)
   - {Domain-specific standards}

2. **Tests:**
   - {Test framework} tests
   - {Coverage requirements}

3. **Call ESLint:**
   - After EACH file written
   - Scope: modified file only
   - Fix ALL errors before next file

### VERIFY Phase (Quality Gates)

1. **Run Quality Checks:**
   ```bash
   npm run type-check
   npm run lint
   npm test
   npm run build
   ```

2. **Quality Gates:**
   - P0 Build: MUST pass
   - P1 Lint: 0 errors
   - P2 Tests: Passing

3. **IF fails:**
   - Analyze error
   - Fix code
   - REPEAT until pass ✓

## Handoff Rules

### → @{next-agent}
**When:** {Completion criteria}
**Deliverables:**
- {File pattern 1}
- {File pattern 2}

**Context to Pass:**
- {Context item 1}
- {Context item 2}

**Block Handoff IF:**
- P0 Build failing
- P1 Lint errors (not warnings)

## Report Format

```markdown
## {Agent Name} Report - T{TASK_NUMBER}

**Status:** ✅ Complete | ⚠️ Partial | ❌ Blocked

**Summary:** [1 sentence]

**Artifacts Created:**
- `{file path 1}`
- `{file path 2}`

**Quality Gates:**
- P0 Build: ✅ | ❌
- P1 Lint: ✅ | ❌
- P2 Tests: ✅ | ❌

**MCP Calls:**
- Context7: {N} queries
- ESLint: {M} files checked

**Next Steps:** Ready for handoff to @{next-agent}
```

## Best Practices

- {Domain-specific best practices}
- TypeScript strict (no `any`)
- ESLint after each file (fix errors immediately)
- Context7 for patterns (save time)

---

**Version:** 1.0
**Model:** sonnet
**Execution Time:** ~30-60 min per 5-10 tasks
```

---

## ✅ CHECKLIST INTÉGRATION

### Avant de Copier Agents dans Projet

- [ ] Repo agents communautaires cloné
- [ ] design-specialist créé (si absent)
- [ ] Tous agents adaptés (MCP Context7 + ESLint)
- [ ] Semgrep MCP retiré (remplacé par Jules mention)
- [ ] Handoff rules clarifiées
- [ ] Quality gates P0-P4 ajoutés
- [ ] Agentic loop structure (GATHER → ACTION → VERIFY)

### Après Copie dans Projet

- [ ] Agents copiés dans `.claude/agents/`
- [ ] MCP config `.claude/mcp.json` créé
- [ ] Spec-Kit exécuté (tasks.md généré avec T002 design)
- [ ] Tester agents : `@design-specialist implement T002`
- [ ] Vérifier handoff : design → backend → frontend → testing

---

## 🎯 RÉSULTAT ATTENDU

**Workflow Complet :**

```bash
# 1. Planning (30 min)
/speckit.constitution → /speckit.specify → /speckit.plan → /speckit.tasks

# 2. Copier Agents (1 min)
cp ~/claude-code-agents/agents/{design,backend,frontend,testing}-specialist.md \
   .claude/agents/

# 3. Implementation avec Sub-Agents (3-4h)
"@design-specialist implement T002"    # → 2-5 min
"@backend-specialist implement T003-T030"  # → 1h
"@frontend-specialist implement T031-T060" # → 1-2h (uses design-tokens.json)
"@testing-specialist implement T061-T078"  # → 30 min

# 4. Review + Merge (15 min)
gh pr view 1 && gh pr merge 1
```

**Avantages :**
- ✅ **4 agents spécialisés** (200K tokens × 4 = 800K context total)
- ✅ **Multitasking réel** (backend + frontend en parallèle)
- ✅ **Design cohérent** (design-tokens.json source of truth)
- ✅ **Quality inline** (ESLint + Context7 patterns)
- ✅ **Sécurité async** (Jules GitHub Actions)

---

**Version:** 1.0
**Date:** 2025-10-13
**Status:** Ready for Integration
**Repo Source:** https://github.com/wshobson/agents.git
