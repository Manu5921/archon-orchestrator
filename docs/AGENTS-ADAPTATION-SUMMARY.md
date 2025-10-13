# 🤖 AGENTS ADAPTATION SUMMARY - Session 13/10/2025

**Status:** ✅ Contexte vérifié, repo cloné, agents analysés
**Next:** Créer 4 agents adaptés workflow V4 → Copier dans santé2

---

## ✅ CONTEXTE COMPLET EN MÉMOIRE

### Workflow V4 Validé
- Mac 24/7 (développement principal)
- GitHub systématique (workflow pro + Jules async)
- Spec-Kit: /constitution → /specify → /plan → /tasks
- Implementation: `/implement` (local Mac 3-4h)
- Quality Gates: P0 Build (obligatoire), P1 Lint, P2 Tests

### MCP Configuration Validée
```json
{
  "context7": { "command": "npx", "args": ["-y", "@upstash/context7-mcp"] },
  "eslint": { "command": "npx", "args": ["@eslint/mcp@latest"] },
  "supabase": { "type": "http", "url": "http://localhost:54321/mcp" }
}
```

### Design System Simplifié
- T002: design-tokens.json (20 tokens)
- Wireframes SVG (dashboard, menu, auth-flow)
- components.json (shadcn/ui list)
- Référence: docs/DESIGN-SYSTEM-SOLO-SIMPLIFIED.md

---

## 📊 AGENTS COMMUNAUTAIRES ANALYSÉS

### Repo: https://github.com/wshobson/agents.git
**Cloné:** `/Users/manu/Documents/DEV/claude-code-agents`

**Agents trouvés:**
1. ✅ `ui-ux-designer.md` (188 lignes)
2. ✅ `backend-architect.md` (283 lignes)
3. ✅ `frontend-developer.md` (150 lignes)
4. ✅ `test-automator.md` (204 lignes)

---

## 🚨 PROBLÈMES DÉTECTÉS

### 1. ui-ux-designer.md
**Problèmes:**
- ❌ Trop enterprise (Figma Variables, Storybook, Chromatic)
- ❌ Design tokens complexe (Style Dictionary, multi-brand)
- ❌ Pas de génération design-tokens.json simple
- ❌ Pas de wireframes SVG automatiques
- ❌ Pas de shadcn/ui focus

**Solution:** Créer `design-specialist.md` basé sur DESIGN-SYSTEM-SOLO-SIMPLIFIED.md

---

### 2. backend-architect.md
**Problèmes:**
- ❌ Model: opus (vs sonnet pour solo)
- ❌ Focus microservices enterprise (vs MVP simple)
- ❌ Pas de mention MCP Context7, ESLint, Supabase
- ❌ Pas de quality gates P0-P4
- ❌ Pas de handoff rules clairs

**Solution:** Créer `backend-specialist.md` simplifié avec MCP

---

### 3. frontend-developer.md
**Problèmes:**
- ✅ Bon (React 19, Next.js 15, TypeScript)
- ❌ Pas de mention MCP Context7, ESLint
- ❌ Pas de design-tokens.json integration
- ❌ Pas de quality gates P0-P4
- ❌ Pas de handoff rules

**Solution:** Adapter avec MCP + design-tokens.json

---

### 4. test-automator.md
**Problèmes:**
- ❌ Trop complexe TDD (Chicago/London School, TDD kata, metrics)
- ❌ Focus AI-powered testing (trop avancé pour MVP)
- ❌ Pas de E2E simple Playwright focus
- ❌ Pas de quality gates P0-P4

**Solution:** Simplifier vers `testing-specialist.md` E2E focus

---

## ✅ AGENTS À CRÉER (Adaptés Workflow V4)

### 1. design-specialist.md ⭐ NOUVEAU
**Base:** DESIGN-SYSTEM-SOLO-SIMPLIFIED.md
**Modèle:** sonnet
**Tools:** Write, Read, Bash
**Génère:**
- design-tokens.json (20 tokens)
- wireframes/ (dashboard.svg, menu.svg, auth-flow.svg)
- components.json (shadcn/ui)

**MCP:** Context7 (design patterns)
**Quality Gates:** P1 JSON valid
**Handoff:** → @frontend-specialist

---

### 2. backend-specialist.md ⭐ ADAPTÉ
**Base:** backend-architect.md (simplifié)
**Modèle:** sonnet (pas opus)
**Tools:** Read, Write, Edit, Bash, Grep, Glob
**Génère:**
- API routes (REST/Next.js API)
- Supabase schema + RLS
- Auth (JWT/Supabase Auth)
- Integration tests

**MCP:**
- Context7 (auth patterns, API structure)
- ESLint (call after each .ts file)
- Supabase Local (inspect schemas)

**Quality Gates:**
- P0 Build: MUST pass
- P1 Lint: 0 errors
- P2 Tests: Integration passing

**Handoff:** → @frontend-specialist OR @testing-specialist

---

### 3. frontend-specialist.md ⭐ ADAPTÉ
**Base:** frontend-developer.md
**Modèle:** sonnet
**Tools:** Read, Write, Edit, Bash, Grep, Glob
**Génère:**
- React components (TypeScript strict)
- Next.js pages/routes
- Forms (React Hook Form + Zod)
- shadcn/ui integration

**MUST:** Use design-tokens.json (généré par @design-specialist)

**MCP:**
- Context7 (layout patterns, form patterns)
- ESLint (call after each .tsx file, React hooks deps)

**Quality Gates:**
- P0 Build: MUST pass
- P1 Lint: Fix errors (hooks deps, TypeScript, a11y)
- P2 Manual test: Browser check

**Handoff:** → @testing-specialist

---

### 4. testing-specialist.md ⭐ SIMPLIFIÉ
**Base:** test-automator.md (simplifié)
**Modèle:** sonnet
**Tools:** Read, Write, Edit, Bash
**Génère:**
- E2E tests (Playwright)
- Integration tests (Vitest/Jest)
- Coverage reports

**MCP:** Context7 (test patterns)

**Quality Gates:**
- P2 Tests: All passing

**Handoff:** Final (no handoff)

---

## 📋 TEMPLATE STANDARD (Tous Agents)

```markdown
---
name: {domain}-specialist
description: >
  {Domain} expert. Use PROACTIVELY for: {triggers}.
  Uses MCP: Context7, ESLint.
tools: Read, Write, Edit, Bash, Grep, Glob
model: sonnet
color: {color}
---

# Purpose
Expert {domain} specialist for workflow V4 solo MVP.

## Tools Available

### Code Tools
- Read, Write, Edit, Bash

### MCP Productivity (OBLIGATOIRE)
- **Context7** - {Usage examples}
- **ESLint** - Lint after EACH file (scope: file only)
- **Supabase Local** - DB debug (if Docker running)

## Instructions - Agentic Loop

### GATHER Phase (30 sec)
1. Read task requirements (specs/001-mvp/tasks.md)
2. Read context (spec.md, plan.md, constitution.md)
3. Check dependencies (grep existing patterns)

### ACTION Phase (Main Implementation)
1. Generate {artifacts} (TypeScript strict)
2. Tests ({framework})
3. **Call ESLint after EACH file** (fix errors immediately)

### VERIFY Phase (Quality Gates)
1. Run checks: `npm run type-check && npm run lint && npm test && npm run build`
2. Quality Gates:
   - P0 Build: MUST pass
   - P1 Lint: 0 errors
   - P2 Tests: Passing
3. IF fails: Fix + REPEAT

## Handoff Rules

### → @{next-agent}
**When:** {Completion criteria}
**Deliverables:**
- {File patterns}

**Context to Pass:**
- {Context items}

**Block Handoff IF:**
- P0 Build failing
- P1 Lint errors

## Report Format

\```markdown
## {Agent Name} Report - T{TASK_NUMBER}

**Status:** ✅ Complete | ⚠️ Partial | ❌ Blocked

**Summary:** [1 sentence]

**Artifacts Created:**
- `{file path 1}`
- `{file path 2}`

**Quality Gates:**
- P0 Build: ✅ | ❌
- P1 Lint: ✅ | ❌ (ESLint: {N} files checked)
- P2 Tests: ✅ | ❌

**MCP Calls:**
- Context7: {N} queries
- ESLint: {M} files

**Next Steps:** Ready for handoff to @{next-agent}
\```

## Best Practices
- TypeScript strict (no `any`)
- ESLint after EACH file (fix errors immediately)
- Context7 for patterns (save time)
- {Domain-specific practices}

---

**Version:** 1.0 (Workflow V4)
**Model:** sonnet
**Execution Time:** ~30-60 min per 5-10 tasks
```

---

## 🎯 PROCHAINES ÉTAPES

### 1. Créer Agents Adaptés (30 min)
- [ ] design-specialist.md (nouveau, basé DESIGN-SYSTEM-SOLO-SIMPLIFIED.md)
- [ ] backend-specialist.md (adapté, MCP + quality gates)
- [ ] frontend-specialist.md (adapté, MCP + design-tokens)
- [ ] testing-specialist.md (simplifié, E2E focus)

### 2. Copier dans archon-orchestrator
```bash
cd ~/Documents/DEV/archon-orchestrator
mkdir -p .claude/agents-v4-adapted

# Copier agents adaptés
cp {agents}.md .claude/agents-v4-adapted/
```

### 3. Copier dans santé2
```bash
cd ~/Documents/DEV/santé2
mkdir -p .claude/agents

# Copier agents adaptés
cp ~/archon-orchestrator/.claude/agents-v4-adapted/*.md .claude/agents/
```

### 4. Tester dans santé2
```bash
cd ~/Documents/DEV/santé2

# Après Spec-Kit exécuté (tasks.md généré)
"@design-specialist implement T002"  # Test design tokens
"@backend-specialist implement T003" # Test backend
```

---

## ✅ VALIDATION REQUISE

**Avant de créer les 4 agents adaptés, confirmer:**

1. ✅ **Design-specialist** - Nouveau, simplifié (20 tokens + wireframes + shadcn)
2. ✅ **Backend-specialist** - Sonnet (pas Opus), MCP Context7 + ESLint, quality gates P0-P2
3. ✅ **Frontend-specialist** - MCP + design-tokens.json integration
4. ✅ **Testing-specialist** - E2E Playwright focus (pas TDD complexe)

**Tous avec:**
- ✅ Agentic Loop (GATHER → ACTION → VERIFY)
- ✅ MCP Context7 + ESLint mentions
- ✅ Quality Gates P0-P4
- ✅ Handoff Rules clairs
- ✅ Report Format standardisé

---

**Status:** ✅ Ready to create adapted agents
**Next:** Create 4 agents → Copy to santé2 → Test

**Version:** 1.0
**Date:** 2025-10-13
