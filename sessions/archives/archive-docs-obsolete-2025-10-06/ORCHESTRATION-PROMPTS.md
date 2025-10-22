# 🎯 Guide Génération Prompts Orchestrés

**Objectif:** Documentation du système de prompts contextualisés générés par Claude Assistant pour diriger Claude Code dans l'exécution multi-agents.

---

## 🔄 FLUX DE TRAVAIL

```
Manu → Claude Assistant (ce document) → Prompt Orchestré → Claude Code → Multi-Agents Execution
```

**Rôles:**
- **Claude Assistant (moi):** Génère prompts orchestrés contextualisés
- **Claude Code:** Exécute avec agents disponibles
- **Manu:** Valide outputs et itère

---

## 📋 ANATOMIE D'UN PROMPT ORCHESTRÉ

### Structure Standard

```markdown
**ORCHESTRATION DIRECTIVE**

**Project:** [Nom du projet]
**Task:** [Description concise de la tâche]
**Context:** [Contexte spécifique projet + état actuel]

---

## AGENTS REQUIRED

### Primary Coordinator
- **orchestrator-specialist**: Coordinate all agents, manage handoffs, enforce quality gates

### Specialists
- **[agent-name]**: [Rôle précis dans cette tâche]
- **[agent-name]**: [Rôle précis dans cette tâche]

---

## EXECUTION STRATEGY

**Mode:** [Sequential | Parallel | Mixed]

**Workflow:**
1. [Étape 1 avec agent responsable]
2. [Étape 2 avec agent responsable]
3. [Validation et handoffs]

**Quality Gates:**
- **P0 (Blockers):** [Critères critiques]
- **P1 (Required):** [Critères requis]
- **P2+ (Defer if needed):** [Nice-to-have]

---

## DELIVERABLES

**Must Have:**
1. [Output concret 1]
2. [Output concret 2]

**Nice to Have:**
- [Output optionnel si temps]

---

## CONSTRAINTS

**Standards:** [E1-E16 applicables, ex: E5 (TDD), E10 (Design Tokens)]
**Timeline:** [Si applicable]
**Dependencies:** [Fichiers/services requis]

---

## CONTEXT FILES

**Read First:**
- [constitution.md | spec.md | CLAUDE.md]
- [Autres fichiers contexte]

**Reference:**
- Design tokens: `.design/tokens.json`
- Tasks: `tasks.md` (si existe)

---

## SUCCESS CRITERIA

- [ ] [Critère validation 1]
- [ ] [Critère validation 2]
- [ ] All P0/P1 quality gates passed
- [ ] Coordination report generated

---

**BEGIN ORCHESTRATION**
```

---

## 🎨 TEMPLATES PAR TYPE DE PROJET

### Template 1: Nouveau Projet SaaS (MVP)

**Contexte:** Démarrage projet from scratch avec Spec-Kit workflow

```markdown
**ORCHESTRATION DIRECTIVE**

**Project:** [NOM_PROJET]
**Task:** Bootstrap nouveau projet SaaS MVP avec design system
**Context:** Post /specify, /clarify, /plan, /tasks - Prêt pour implémentation

---

## AGENTS REQUIRED

### Primary Coordinator
- **orchestrator-specialist**: Coordinate bootstrap → design → implementation workflow

### Specialists
- **design-specialist**: Generate design system (tokens.json, components, patterns)
- **testing-specialist**: Setup TDD infrastructure, write integration tests
- **deployment-specialist**: Configure Vercel/Supabase, CI/CD pipelines

---

## EXECUTION STRATEGY

**Mode:** Sequential with quality gates

**Workflow:**
1. **Design-specialist**: Create tokens.json from constitution principles
2. **Design-specialist**: Generate core components (Button, Input, Card, Layout)
3. **Orchestrator**: Validate design tokens compliance (E10)
4. **Implementation**: Apply design tokens → Tailwind config
5. **Testing-specialist**: Setup Vitest + Playwright, write first tests
6. **Deployment-specialist**: Configure env, deploy staging
7. **Orchestrator**: Final validation all quality gates

**Quality Gates:**
- **P0:** Design tokens valid schema, build succeeds, deploy green
- **P1:** Core components functional, tests passing, a11y WCAG 2.2 AA
- **P2:** Documentation complete, performance benchmarks

---

## DELIVERABLES

**Must Have:**
1. `.design/tokens.json` (schema-validated)
2. `tailwind.config.ts` (auto-generated from tokens)
3. Core components in `components/ui/`
4. Test infrastructure operational
5. Staging deployment URL

**Nice to Have:**
- Storybook setup
- Visual regression tests
- Performance monitoring

---

## CONSTRAINTS

**Standards:** E1 (ADR), E5 (TDD), E10 (Design Tokens), E16 (Zero Trust)
**Timeline:** MVP 2 weeks target
**Dependencies:** Spec-Kit workflow completed (/tasks.md exists)

---

## CONTEXT FILES

**Read First:**
- `constitution.md`
- `.specify/specs/[ID]/spec.md`
- `tasks.md`

**Reference:**
- `ARCHON-BOOTSTRAP-PROCESS.md` (process steps)
- `.design/schemas/tokens.schema.json`

---

## SUCCESS CRITERIA

- [ ] Design tokens pass schema validation
- [ ] Tailwind config generates correctly
- [ ] All components render without errors
- [ ] Build passes (pnpm build)
- [ ] Tests passing (pnpm test)
- [ ] Staging deployed successfully
- [ ] Coordination report with quality gates status

---

**BEGIN ORCHESTRATION**
```

---

### Template 2: Feature Ajout (Projet Existant)

**Contexte:** Projet déjà bootstrappé, ajout nouvelle feature

```markdown
**ORCHESTRATION DIRECTIVE**

**Project:** [NOM_PROJET]
**Task:** Implement [FEATURE_NAME]
**Context:** Existing project with design system, adding new capability

---

## AGENTS REQUIRED

### Primary Coordinator
- **orchestrator-specialist**: Coordinate feature implementation across domains

### Specialists
- **design-specialist**: Extend design system if needed (new tokens/components)
- **testing-specialist**: TDD workflow, integration tests for feature

---

## EXECUTION STRATEGY

**Mode:** Mixed (parallel design + testing, sequential implementation)

**Workflow:**
1. **Design-specialist** (parallel): Audit existing components, identify gaps
2. **Testing-specialist** (parallel): Write failing tests for feature requirements
3. **Orchestrator**: Review design + test specs, validate alignment
4. **Implementation**: Build feature passing tests, using design components
5. **Testing-specialist**: Validate all tests green, coverage targets met
6. **Orchestrator**: Final quality gates check

**Quality Gates:**
- **P0:** Feature functional, tests passing, no regressions
- **P1:** Design tokens compliance, WCAG 2.2 AA maintained
- **P2:** Documentation updated, performance acceptable

---

## DELIVERABLES

**Must Have:**
1. Feature implementation passing all tests
2. Updated design components (if new patterns)
3. Test coverage report (P0: 100%, P1: 90%, P2: 80%)
4. Integration with existing codebase validated

**Nice to Have:**
- E2E tests for critical paths
- Performance benchmarks

---

## CONSTRAINTS

**Standards:** E3 (Integration Tests First), E5 (TDD), E10 (Design Tokens)
**Timeline:** [Sprint duration si applicable]
**Dependencies:** [APIs, services, existing features]

---

## CONTEXT FILES

**Read First:**
- Feature spec from `tasks.md` or issue description
- `CLAUDE.md` (project conventions)

**Reference:**
- `.design/tokens.json` (existing design system)
- Related component files

---

## SUCCESS CRITERIA

- [ ] All feature requirements met
- [ ] Tests passing (unit + integration)
- [ ] No visual regressions (ui:test ≤1%)
- [ ] Build succeeds
- [ ] Design tokens compliance verified
- [ ] Documentation updated

---

**BEGIN ORCHESTRATION**
```

---

### Template 3: Bug Fix / Refactoring

**Contexte:** Correction bugs ou refactoring code existant

```markdown
**ORCHESTRATION DIRECTIVE**

**Project:** [NOM_PROJET]
**Task:** [Fix bug | Refactor component] - [DESCRIPTION]
**Context:** [Description du problème + impact]

---

## AGENTS REQUIRED

### Primary Coordinator
- **orchestrator-specialist**: Coordinate investigation → fix → validation

### Specialists
- **testing-specialist**: Reproduce bug with failing test, validate fix
- (Optional) **design-specialist**: If UI/UX impact

---

## EXECUTION STRATEGY

**Mode:** Sequential

**Workflow:**
1. **Testing-specialist**: Write failing test reproducing bug
2. **Investigation**: Root cause analysis
3. **Implementation**: Fix passing test
4. **Testing-specialist**: Run full test suite, check regressions
5. **Orchestrator**: Validate fix meets quality gates

**Quality Gates:**
- **P0:** Bug fixed, test passing, no new regressions
- **P1:** Code quality maintained, documentation updated
- **P2:** Refactoring opportunities identified

---

## DELIVERABLES

**Must Have:**
1. Failing test reproducing bug
2. Fix implementation passing test
3. Full test suite green
4. Root cause documented

**Nice to Have:**
- Related refactoring
- Additional tests for edge cases

---

## CONSTRAINTS

**Standards:** E5 (TDD), E16 (Zero Trust - validate fix)
**Timeline:** [Hotfix | Normal priority]
**Dependencies:** [Affected components/services]

---

## CONTEXT FILES

**Read First:**
- Bug report / issue description
- Related test files

**Reference:**
- Component source
- Design specs (si UI impact)

---

## SUCCESS CRITERIA

- [ ] Bug reproduced with failing test
- [ ] Fix implemented, test passing
- [ ] No regressions in test suite
- [ ] Root cause documented
- [ ] Related code reviewed for similar issues

---

**BEGIN ORCHESTRATION**
```

---

### Template 4: Design System Update

**Contexte:** Mise à jour tokens design ou composants UI

```markdown
**ORCHESTRATION DIRECTIVE**

**Project:** [NOM_PROJET]
**Task:** Update Design System - [DESCRIPTION]
**Context:** Tokens update | Component refactor | A11y improvements

---

## AGENTS REQUIRED

### Primary Coordinator
- **orchestrator-specialist**: Coordinate design → implementation → testing

### Specialists
- **design-specialist**: Update tokens.json, validate schema, generate Tailwind
- **testing-specialist**: Visual regression tests, a11y validation

---

## EXECUTION STRATEGY

**Mode:** Sequential with validation gates

**Workflow:**
1. **Design-specialist**: Update `.design/tokens.json`
2. **Design-specialist**: Validate against `tokens.schema.json`
3. **Orchestrator**: Run `pnpm tokens:apply` generate Tailwind config
4. **Testing-specialist**: Run `pnpm ui:test` (visual diff ≤1%, a11y 100)
5. **Orchestrator**: Review diff, identify breaking changes
6. **Implementation**: Fix component regressions if any
7. **Testing-specialist**: Final validation all components

**Quality Gates:**
- **P0:** Tokens schema valid, visual diff ≤1%, a11y WCAG 2.2 AA
- **P1:** All components compile, no broken styles
- **P2:** Documentation updated, Figma sync (if applicable)

---

## DELIVERABLES

**Must Have:**
1. Updated `tokens.json` passing schema validation
2. Generated `tailwind.config.ts`
3. Visual regression report (≤1% threshold)
4. A11y validation report (score 100)

**Nice to Have:**
- Figma sync via tokens-pull script
- Storybook updated

---

## CONSTRAINTS

**Standards:** E10 (Design Tokens Single Source), E8 (Quality Gates Blocking)
**Timeline:** [Sprint si applicable]
**Dependencies:** Figma Tokens Studio (si sync needed)

---

## CONTEXT FILES

**Read First:**
- `.design/schemas/tokens.schema.json`
- Current `tokens.json`

**Reference:**
- `scripts/design/tokens-apply.js`
- `scripts/design/ui-test.js`

---

## SUCCESS CRITERIA

- [ ] Tokens schema validation passes
- [ ] Tailwind config generates without errors
- [ ] Visual diff ≤1% threshold
- [ ] A11y score 100 (WCAG 2.2 AA)
- [ ] All components render correctly
- [ ] Build succeeds
- [ ] Documentation updated

---

**BEGIN ORCHESTRATION**
```

---

## 🤖 GUIDE POUR CLAUDE ASSISTANT (MOI)

### Quand Manu Me Sollicite

**Input attendu:**
```
"J'ai un nouveau projet [NOM] qui fait [DESCRIPTION].
Génère-moi le prompt orchestré pour [TÂCHE]"
```

**Mon Workflow:**

1. **Identifier Template Base**
   - Nouveau projet SaaS → Template 1
   - Feature existante → Template 2
   - Bug/Refactor → Template 3
   - Design update → Template 4

2. **Contextualiser**
   - Lire `constitution.md` si disponible
   - Lire `CLAUDE.md` du projet
   - Lire `tasks.md` ou spec si fourni
   - Identifier agents disponibles (`.claude/agents/`)

3. **Personnaliser Template**
   - Remplir [PLACEHOLDERS]
   - Ajuster agents selon disponibilité
   - Adapter quality gates au contexte
   - Spécifier deliverables concrets

4. **Générer Prompt Final**
   - Structure complète
   - Context files pertinents
   - Success criteria mesurables
   - Standards E1-E16 applicables

5. **Fournir à Manu**
   - Prompt prêt à copier/coller
   - Notes additionnelles si nécessaire
   - Suggestions optimisations si applicable

---

## 📊 MATRICE AGENTS × TÂCHES

| Type Tâche | Agents Requis | Mode Exécution |
|-----------|---------------|----------------|
| **Bootstrap Projet** | orchestrator + design + testing + deployment | Sequential |
| **Nouvelle Feature** | orchestrator + design + testing | Mixed |
| **Bug Fix** | orchestrator + testing | Sequential |
| **Design Update** | orchestrator + design + testing | Sequential |
| **Refactoring** | orchestrator + testing | Sequential |
| **Performance** | orchestrator + testing | Parallel |
| **Security Audit** | orchestrator + testing + deployment | Sequential |
| **Documentation** | (orchestrator optionnel) | Single agent |

---

## 🎯 STANDARDS E1-E16 PAR CONTEXTE

### Standards Toujours Applicables
- **E16 (Zero Trust):** Validation obligatoire chaque action
- **E8 (Quality Gates):** Build → Lint → Tests → Docs → Perf

### Standards Contextuels

**Design-First Projects:**
- E1 (Architecture First - ADR)
- E10 (Design Tokens Single Source)
- E12 (Figma ↔ Code Traceability)

**TDD Workflows:**
- E3 (Integration Tests First)
- E5 (Testing Requirements P0/P1/P2)

**Deployment:**
- E14 (Deployment Safety)
- E15 (Env Config Validation)

---

## 📝 EXEMPLES RÉELS

### Exemple 1: LocalAI SEO - Authentication Feature

**Input Manu:**
```
"LocalAI SEO, j'ai besoin d'implémenter l'authentification utilisateur
avec le design system. Génère le prompt."
```

**Output Claude Assistant:**
```markdown
**ORCHESTRATION DIRECTIVE**

**Project:** LocalAI SEO
**Task:** Implement User Authentication with Design System
**Context:** Post /tasks generation, design tokens exist, need secure JWT auth

---

## AGENTS REQUIRED

### Primary Coordinator
- **orchestrator-specialist**: Coordinate design → backend → testing workflow

### Specialists
- **design-specialist**: Create auth UI components (Login, Signup, Password Reset)
- **testing-specialist**: Security tests (P0) + UI tests (P1)

---

## EXECUTION STRATEGY

**Mode:** Sequential with security gates

**Workflow:**
1. **Design-specialist**: Generate auth components using `.design/tokens.json`
   - Login form (email, password, submit)
   - Signup form (email, password, confirm, terms)
   - Password reset flow
   - Validate WCAG 2.2 AA compliance
2. **Orchestrator**: Review components, validate design tokens compliance
3. **Implementation**: Backend auth logic
   - JWT generation/validation
   - Supabase auth integration
   - Secure session management
4. **Testing-specialist**: Security validation
   - P0: JWT security (no leaks, proper expiry)
   - P0: Password hashing (bcrypt/scrypt)
   - P0: CSRF protection
   - P1: UI tests (form validation, error states)
5. **Orchestrator**: Final quality gates check

**Quality Gates:**
- **P0:** No credential leaks, JWT secure, auth flow functional
- **P1:** UI matches design tokens, WCAG 2.2 AA, responsive
- **P2:** Error messages polished, loading states smooth

---

## DELIVERABLES

**Must Have:**
1. Auth UI components in `components/auth/`
2. Backend auth routes (`/api/auth/login`, `/signup`, `/reset`)
3. Security tests passing (100% coverage on auth logic)
4. UI tests passing (form validation, error handling)
5. Coordination report with security audit

**Nice to Have:**
- Social auth (Google, GitHub)
- 2FA support
- Rate limiting

---

## CONSTRAINTS

**Standards:** E5 (TDD), E10 (Design Tokens), E16 (Zero Trust Security)
**Timeline:** Sprint 1 (MVP auth only)
**Dependencies:** Supabase configured, tokens.json exists

---

## CONTEXT FILES

**Read First:**
- `LOCAL-AI-SEO-CONSTITUTION.md` (security requirements)
- `.design/tokens.json` (design system)
- `tasks.md` (auth feature tasks)

**Reference:**
- Supabase auth docs
- OWASP auth best practices

---

## SUCCESS CRITERIA

- [ ] Auth components match design tokens (visual test ≤1%)
- [ ] JWT implementation secure (no vulnerabilities)
- [ ] Password hashing proper (bcrypt rounds ≥10)
- [ ] CSRF tokens implemented
- [ ] All security tests passing (P0 100% coverage)
- [ ] UI tests passing (P1 90% coverage)
- [ ] WCAG 2.2 AA validated
- [ ] Build succeeds
- [ ] Coordination report generated

---

**BEGIN ORCHESTRATION**
```

---

### Exemple 2: Nouveau Projet - E-commerce Platform

**Input Manu:**
```
"Nouveau projet e-commerce SaaS 'ShopFlow',
post /tasks, besoin bootstrap complet. Génère le prompt."
```

**Output Claude Assistant:**
```markdown
**ORCHESTRATION DIRECTIVE**

**Project:** ShopFlow E-commerce Platform
**Task:** Bootstrap nouveau projet SaaS e-commerce MVP
**Context:** Post /specify, /tasks completed - Ready for full bootstrap

---

## AGENTS REQUIRED

### Primary Coordinator
- **orchestrator-specialist**: Coordinate full bootstrap workflow

### Specialists
- **design-specialist**: Generate e-commerce design system
- **testing-specialist**: Setup TDD infrastructure
- **deployment-specialist**: Configure Vercel + Stripe + DB

---

## EXECUTION STRATEGY

**Mode:** Sequential with parallel sub-tasks

**Workflow:**
1. **Design-specialist**: Create tokens.json (e-commerce focused)
   - Color palette: primary (brand), success (checkout), error (validation)
   - Typography: product titles, prices, CTAs
   - Spacing: card grids, product listings
   - Breakpoints: mobile-first responsive
2. **Design-specialist** (parallel): Core e-commerce components
   - ProductCard (image, title, price, CTA)
   - CartItem (quantity selector, remove)
   - CheckoutForm (shipping, payment)
3. **Orchestrator**: Validate design tokens schema
4. **Implementation**: Apply tokens → Tailwind
5. **Testing-specialist**: Setup Vitest + Playwright
   - Integration tests for cart logic
   - E2E tests for checkout flow
6. **Deployment-specialist**: Configure
   - Vercel deployment
   - Stripe integration (test mode)
   - Supabase (products, orders, users)
7. **Orchestrator**: Final validation all gates

**Quality Gates:**
- **P0:** Tokens valid, build succeeds, Stripe test mode works, deploy green
- **P1:** Core components functional, cart logic tested, a11y WCAG 2.2 AA
- **P2:** Performance (Lighthouse ≥90), SEO optimized

---

## DELIVERABLES

**Must Have:**
1. `.design/tokens.json` (e-commerce schema-validated)
2. `tailwind.config.ts` (auto-generated)
3. Core components: ProductCard, CartItem, CheckoutForm
4. Test infrastructure operational (Vitest + Playwright)
5. Stripe integration (test mode)
6. Staging deployment URL

**Nice to Have:**
- Product image optimization
- Inventory management UI
- Admin dashboard

---

## CONSTRAINTS

**Standards:** E1 (ADR), E5 (TDD), E10 (Design Tokens), E14 (Deployment Safety)
**Timeline:** MVP 3 weeks (2 weeks core + 1 week polish)
**Dependencies:** Spec-Kit workflow completed, Stripe account ready

---

## CONTEXT FILES

**Read First:**
- `constitution.md`
- `.specify/specs/[ID]/spec.md`
- `tasks.md`

**Reference:**
- `ARCHON-BOOTSTRAP-PROCESS.md`
- `.design/schemas/tokens.schema.json`
- Stripe API docs

---

## SUCCESS CRITERIA

- [ ] Design tokens pass schema validation
- [ ] Tailwind config generates correctly
- [ ] All components render without errors
- [ ] Cart logic functional (add/remove/update)
- [ ] Stripe test checkout completes
- [ ] Build passes (pnpm build)
- [ ] Tests passing (pnpm test)
- [ ] Lighthouse score ≥90
- [ ] Staging deployed successfully
- [ ] Coordination report complete

---

**BEGIN ORCHESTRATION**
```

---

## 🔧 MAINTENANCE DOCUMENTATION

**Fichier:** `/docs/ORCHESTRATION-PROMPTS.md`

**Quand Mettre à Jour:**
- Nouveaux templates identifiés (type projet récurrent)
- Nouveaux agents disponibles
- Nouveaux standards E1-E16
- Retours terrain (prompts non performants)

**Versioning:**
- v1.0: Templates initiaux (Bootstrap, Feature, Bug, Design)
- v1.x: Ajouts templates spécifiques (E-commerce, Blog, API, etc.)
- v2.0: Si refonte système orchestration

---

**Version:** 1.0
**Date:** 2025-10-05
**Maintainer:** Claude Assistant + Manu
**Usage:** Documentation système génération prompts orchestrés pour projets Archon
