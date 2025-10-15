# 🔄 PROMPT DE REPRISE - Session 2025-10-15

**Date:** 2025-10-15
**Context:** Post-Context Management Analysis + Design Decoupling Implementation
**Next Tasks:** CLAUDE.md Audit → notes.md System Implementation

---

## 📋 CONTEXTE SESSION PRÉCÉDENTE

### Travaux Complétés

**1. Design/Dev Decoupling Implementation (Validated)**
- ✅ Créé `/import-design` slash command (15-min custom brand merge)
- ✅ Ajouté Figma MCP dans `.claude/mcp.json`
- ✅ Documenté pattern dans `GOLDEN-PATTERNS.md` (Health Score 9.9/10)
- ✅ Ajouté Design Philosophy dans `CLAUDE.md`
- **ROI:** -95% temps (15 min vs 1-2 days refactor), 0 breaking changes

**2. File Cleanup & Archive (7 fichiers obsolètes)**
- ✅ Analyse complète 92 fichiers .md du projet
- ✅ Archivé 7 fichiers obsolètes → `archive-obsolete-2025-10-15-v4.1/`
- ✅ Documenté justifications dans `ARCHIVAGE-RAISONS-V4.1.md`
- **Résultat:** -7.6% fichiers (92→85), workflow clean

**3. WORKFLOW-V4 Complete Rewrite (CRITICAL)**
- ✅ Réécrit `WORKFLOW-FINAL-V4-MULTI-DEVICE.md` (1191→541 lignes, -55%)
- ✅ Corrigé priorités: Zen MCP Phase 0 (pas "3bis optionnel")
- ✅ Minimisé Jules: 254→23 lignes (Phase 5 optionnel, PAS production-ready)
- ✅ Ajouté Design Import Phase 3 dédiée
- ✅ Reality check: Mac LOCAL 99%, cloud <5%
- **Résultat:** Source of truth maintenant ACCURATE vs reality

**4. Context Management Video Analysis**
- ✅ Analysé vidéo 14 min (context rot, strategies, Sonnet 4.5 unique)
- ✅ Identifié optimisations: MCP on-demand, notes.md, CLAUDE.md audit
- ✅ Documenté ROI attendu: 50% → 65-75% usable context

---

## 🎯 WORKFLOW V4.1 RÉEL (À GARDER EN TÊTE)

**⚠️ CRITICAL: Ce workflow est la RÉALITÉ, pas une vision théorique**

### Phase 0: Multi-IA Roundtable (30-45 min) ⭐ VALIDATED

```bash
/zen-roundtable "Brief: [votre brief projet]"
```

**Ce qui se passe automatiquement:**
1. **Claude** analyse brief → génère questions clarification
2. **Codex (gpt-5)** génère 3 architecture options + tech stack
3. **Gemini (2.5-pro)** analyse sécurité + scalability + critique
4. **Claude** arbitre → constitution.md + spec.md

**Output:**
- `.specify/memory/constitution.md` (HIGH-LEVEL governance)
- `specs/001-mvp/spec.md` (TECHNICAL details)

**Tools:** `mcp__zen__clink` (CLI-to-CLI bridge)
**ROI:** -87% temps, 100% context preservation

### Phase 1: Spec-Kit Planning (30 min)

```bash
/speckit.constitution  # → constitution.md
/speckit.specify       # → spec.md
/speckit.clarify       # → Q&A interactive
/speckit.design        # → design-tokens.json + wireframes
/speckit.plan          # → plan.md
/speckit.tasks         # → tasks.md
/speckit.agents        # → prompt orchestration
```

**Critical:** ALWAYS run `/speckit.design` (Design Decoupling from Day 1)

### Phase 2: Implementation Mac LOCAL (3-4h) 🖥️ 99% CAS

**Reality Check:**
- ✅ **Mac LOCAL = 99%** des cas (développement principal)
- ✅ **GitHub Actions cloud = <5%** (fallback si Mac crash seulement)
- ❌ **PAS workflow multi-cloud standard** (contrairement ancienne doc)

**Workflow:**
- Prompt généré par `/speckit.agents` (orchestration optimale)
- Sub-agents orchestrés automatiquement
- MCP Context7 juste-in-time (docs fraîches)
- Jules scan async GitHub (optionnel, manuel)

### Phase 3: Design Import (15 min) 🎨 COMPETITIVE ADVANTAGE

```bash
/import-design custom-tokens.json
```

**Avant (Generic AI Tools):**
- AI génère design generic
- Customization = 1-2 jours refactor
- Lovable/Bolt/v0 = generic look

**Après (Design Decoupling):**
- Claude génère avec CSS variables (`bg-primary-500`)
- Designer crée custom brand en parallèle
- 15 min merge → custom product
- **Competitive Advantage:** Custom brand vs generic AI

### Phase 4: Review + Merge (15 min)

- Mac OU mobile (flexibilité)
- Jules report (optionnel, manuel) + PR merge

### Phase 5: Jules Security (Optionnel, Manuel) 🔒 PAS PRODUCTION-READY

**⚠️ Reality Check Jules:**
- ❌ **PAS encore testé production**
- ❌ **PAS intégré CI/CD automatique**
- ✅ **Lancé manuellement** à la main
- ✅ **Fonctionne async** depuis GitHub repo
- ✅ **Petite partie** du workflow (pas core)

**Quand utiliser:** Projets sensibles (santé, finance), audit manuel post-dev

---

## 📁 FICHIERS CLÉS MODIFIÉS

### Créés

**`.claude/commands/import-design.md`** (290 lines)
- Command `/import-design` pour merge design custom
- Validation structure (colors/typography/spacing required)
- Backup automation (design-tokens.backup.TIMESTAMP.json)
- Tailwind config + CSS variables sync
- Figma MCP integration (optional automated export)

**`ANALYSE-FICHIERS-OBSOLETES-2025-10-15.md`**
- Audit complet 92 fichiers .md
- 7 fichiers identifiés obsolètes
- Archive structure documented

**`archive-obsolete-2025-10-15-v4.1/ARCHIVAGE-RAISONS-V4.1.md`**
- Justifications détaillées pour chaque fichier archivé
- Fichiers remplacements documentés
- Stats: -7.6% réduction (92→85 files)

**`RESUME-SESSION-2025-10-15-DESIGN-DECOUPLING.md`** (554 lines)
- Documentation complète session
- ROI validation (-95% time, 0 breaking changes)
- Philosophy: "Claude generates logic, human crafts brand, 15-min merge = custom product"

### Modifiés

**`docs/GOLDEN-PATTERNS.md`** (Added Design/Dev Decoupling Pattern - 300+ lines)
- Section "🎨 DESIGN/DEV DECOUPLING PATTERN ⭐"
- Health Score 9.9/10 (Competitive Advantage)
- ROI: -95% time (15 min merge vs 1-2 days refactor)
- Complete implementation guide

**`docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md`** (REWRITE: 1191→541 lines, -55%)
- Jules Security: 254→23 lines (Phase 5 optionnel, NOT production-ready)
- Zen MCP: Phase 0 PRINCIPALE (pas "3bis optionnel")
- Codex: Explicit mention ("Codex (gpt-5) génère 3 options")
- Design Import: Phase 3 dédiée (pas juste philosophy)
- Metrics realistic: 4-5 projets/semaine (solo developer)
- Reality check section: "Ce Qui N'EST PAS Le Workflow"

**`CLAUDE.md`** (Added Design System Philosophy section)
- Section "🎨 DESIGN SYSTEM PHILOSOPHY ⭐"
- Core Philosophy: "Claude Code generates logic. Human crafts brand. 15-minute merge = custom product."
- Key Rules enforced (CSS variables, NEVER hardcode colors)

**`.claude/mcp.json`** (Added Figma server)
```json
{
  "figma": {
    "command": "pnpm",
    "args": ["dlx", "@figma/mcp-server"],
    "env": {
      "FIGMA_PERSONAL_ACCESS_TOKEN": ""
    }
  }
}
```

### Archivés (7 fichiers → `archive-obsolete-2025-10-15-v4.1/`)

1. `docs/DESIGN-SYSTEM-SOLO-SIMPLIFIED.md` → Replaced by Design Decoupling
2. `docs/CODEX-INTEGRATION-WORKFLOW-V4.md` → Replaced by Zen MCP Workflow
3. `BRIEF-CHATGPT-ANNUAIRE-SANTE.md` → Project-specific (not generic)
4. `OUTPUT-CODEX-ANNUAIRE-SANTE.md` → Project-specific (not generic)
5. `PROMPT-REPRISE-2025-10-08.md` → Historical prompt (resume kept)
6. `PROMPT-SESSION-3-ZEN-MCP.md` → Historical prompt (resume kept)
7. `.claude/commands/smart-review.md` → 0 mentions in docs (grep verified)

---

## 🎥 ANALYSE VIDÉO CONTEXT MANAGEMENT (KEY LEARNINGS)

### Problem: Context Rot

**Data Points:**
- MCP tools = **16% context overhead** (avant même utilisation!)
- Usable context = **50% seulement** (avec 3 MCP tools enabled)
- Problem scale: 200K context → 100K usable → 50K après tools overhead

**Evolution:**
- **2023:** Prompt Engineering (single-turn, text-only)
- **2024:** Context Engineering (multi-turn, tools, memory, sub-agents)

### 3 Strategies Identifiées

**1. Compacting (Sonnet 4.5 Unique)**
- Proactive summarization (context-aware)
- Devon rebuild entier pour exploiter cette capacité
- Command `/compact` dans Claude Code

**2. Structured Note-Taking** ⭐ TO IMPLEMENT
- Project memory files (decisions, patterns, critical context)
- Reduces context window pollution
- Better multi-session continuity
- **ROI attendu:** -5 to -10% context overhead

**3. Sub-Agents** ✅ ALREADY DOING WELL
- `/speckit.agents` orchestration
- Task-specific agents (planning vs implementation)
- Context isolation per agent

### System Prompt Calibration (Goldilocks Zone)

**Problem:**
- **Too Rigid:** Hardcoded logic, edge case laundry list → brittle
- **Too Vague:** High-level guidance sans signal concret → confusion

**Solution: Goldilocks Zone**
- Clear + Simple + Leverages model intelligence
- Few-shot examples: Canonical + Diverse (NOT edge cases)
- Rule: **"If human can't understand → LLM will fail"**

**Action Required:** Audit CLAUDE.md (voir tâche 1 ci-dessous)

### Sonnet 4.5 Unique Capabilities

- **Context-aware:** Proactive summarization quand contexte devient lourd
- **Reasoning token budget:** Intelligence vs context tradeoff
- **Devon rebuild:** Entire system redesigned to leverage this

---

## 🎯 OPTIMISATIONS IDENTIFIÉES

### Ce Qu'on Fait BIEN ✅

1. **Sub-Agents:** `/speckit.agents` orchestration (task-specific)
2. **Zen MCP:** Context preservation 100% (Codex + Gemini + Claude)
3. **Design Decoupling:** -95% time (parallèle work streams)
4. **Compacting:** Command `/compact` disponible

### Ce Qui DOIT Être Amélioré 🔧

1. **MCP Tools On-Demand** (Priority 3 - Quick Win)
   - **Problem:** All MCP tools loaded = 16% context overhead
   - **Solution:** Activate/deactivate per phase
     - Phase 1 Planning: Context7 only
     - Phase 2 Implementation: Context7 + ESLint
     - Phase 3 Design: Figma only
   - **ROI:** -8 to -10% context overhead

2. **Structured Notes System** (Priority 2 - voir tâche ci-dessous)
   - **Problem:** Full conversation history pollutes context
   - **Solution:** `project-memory.md` (decisions, patterns, critical context)
   - **ROI:** -5 to -10% context overhead

3. **CLAUDE.md System Prompt** (Priority 1 - voir tâche ci-dessous)
   - **Problem:** Possiblement "too rigid" ou "too vague" patterns
   - **Solution:** Goldilocks zone calibration
   - **ROI:** Improved context efficiency, clearer behavior

**Total ROI attendu:** 50% → 65-75% usable context

---

## ✅ TÂCHES À FAIRE (DANS CET ORDRE)

### 🎯 TÂCHE 1: Audit CLAUDE.md (Priority 1 - 45 min)

**Objectif:** System Prompt Calibration (Goldilocks zone)

**Checklist Complète:**

- [ ] **Analyser structure CLAUDE.md actuelle**
  - Identifier sections distinctes (XML vs Markdown)
  - Vérifier organisation logique (flow top-to-bottom)
  - Détecter redondances entre sections

- [ ] **Identifier patterns "TOO RIGID"** (Brittle)
  - Edge case laundry list (if X then Y, if Z then W...)
  - Hardcoded logic (step-by-step procédures inflexibles)
  - Over-specification (détails inutiles qui contraignent)
  - Micromanagement instructions (force specific approach)

- [ ] **Identifier patterns "TOO VAGUE"** (Confusing)
  - High-level guidance sans signal concret (ex: "be helpful")
  - Instructions ambiguës (plusieurs interprétations possibles)
  - Missing context (pourquoi cette règle existe)
  - Contradictions entre sections

- [ ] **Vérifier few-shot examples**
  - Examples CANONIQUES (cas typiques, pas edge cases)
  - Examples DIVERSIFIÉS (couvrent différents scenarios)
  - Examples CONCIS (pas overwhelming)
  - Examples CLAIRS (human peut comprendre facilement)

- [ ] **Appliquer Rule d'Or**
  - **"Si humain ne comprend pas → LLM échouera"**
  - Lire chaque section: est-ce clair pour humain?
  - Tester: pouvez-vous paraphraser l'instruction?
  - Si non: simplifier OU ajouter exemple concret

- [ ] **Refactor vers Goldilocks Zone**
  - Clear: Instructions compréhensibles (pas ambiguës)
  - Simple: Minimum nécessaire (pas over-specified)
  - Intelligent: Leverage model reasoning (pas hardcoded logic)

**Sections CLAUDE.md à auditer en priorité:**

1. **Design System Philosophy** (récemment ajouté)
   - Vérifier: Trop rigide? (hardcode CSS variables everywhere)
   - Vérifier: Assez clair? (pourquoi Design Decoupling important)

2. **Workflow Instructions** (pointent vers WORKFLOW-V4)
   - Vérifier: Contradictions avec nouveau workflow?
   - Vérifier: Over-specification des phases?

3. **Tool Usage Policy** (MCP tools, sub-agents)
   - Vérifier: Trop rigide? (force specific tool sequence)
   - Vérifier: Manque guidance? (when to use which tool)

4. **Few-Shot Examples** (si présents)
   - Vérifier: Canoniques ou edge cases?
   - Vérifier: Diversité scenarios couverts

**Référence Vidéo:** Timestamp 4:14-6:56 (System Prompt Calibration)

**Deliverable:**
- Document `AUDIT-CLAUDE-MD-2025-10-15.md` (findings + recommendations)
- Version refactorée `CLAUDE.md` (si refactor nécessaire)

---

### 🎯 TÂCHE 2: Implémenter notes.md System (Priority 2 - 1h)

**Objectif:** Structured Note-Taking pour context management

**Template: `project-memory.md`**

```markdown
# Project: [nom-projet]
# Date: [YYYY-MM-DD]
# Phase: [Planning / Implementation / Review]

---

## 📋 Key Decisions

**Architecture:**
- Option choisie: [Monolith / Microservices / Serverless]
- Raison: [pourquoi cette option vs alternatives]
- Trade-offs: [avantages / inconvénients acceptés]

**Tech Stack:**
- Frontend: [React / Vue / Svelte]
- Backend: [Node / Python / Go]
- Database: [PostgreSQL / MongoDB / SQLite]
- Hosting: [Vercel / Railway / AWS]

**Auth:**
- Approche: [Supabase Auth / NextAuth / Custom JWT]
- Raison: [simplicité / compliance / budget]

**Design:**
- Custom brand: [OUI / NON]
- Colors: [Primary: #xxx, Secondary: #yyy]
- Typography: [Heading: xxx, Body: yyy]

---

## 🎨 Patterns Used

### Design/Dev Decoupling
- **Reference:** `docs/GOLDEN-PATTERNS.md` - Section Design/Dev Decoupling
- **Applied:** Phase 1 `/speckit.design` → design-tokens.json généré
- **Custom brand:** [OUI merge Phase 3 / NON placeholder]

### Zen MCP Multi-IA
- **Reference:** `docs/ZEN-MCP-WORKFLOW-ORCHESTRATION.md`
- **Applied:** Phase 0 `/zen-roundtable` → constitution.md + spec.md
- **Results:** [3 arch options, security review Gemini, arbitration Claude]

### [Autres patterns utilisés]
- **Reference:** [lien vers doc]
- **Applied:** [comment / quand]

---

## 🔍 Critical Context

**Client:**
- Type: [Startup / PME / Enterprise]
- Secteur: [SaaS / E-commerce / Healthcare / Finance]
- Target users: [B2B / B2C / Internal tool]
- Budget: [€ montant / Bootstrapped]

**Compliance:**
- RGPD: [OUI / NON / Partiellement]
- HIPAA: [OUI / NON]
- SOC2: [OUI / NON]
- Custom requirements: [liste spécifique]

**Timeline:**
- MVP: [date target]
- Launch: [date target]
- Contraintes: [deadlines critiques]

**Risks:**
- [Risk 1]: [mitigation strategy]
- [Risk 2]: [mitigation strategy]

---

## 🐛 Issues Rencontrés

### [Issue 1 Description]
- **Date:** [YYYY-MM-DD]
- **Contexte:** [what happened]
- **Solution:** [how fixed]
- **Learning:** [what to avoid next time]

### [Issue 2 Description]
- ...

---

## 📝 Notes Session

### Session [YYYY-MM-DD] - [Phase]
- [Note importante 1]
- [Note importante 2]
- [Décision prise: pourquoi]

### Session [YYYY-MM-DD] - [Phase]
- ...

---

**Last Updated:** [YYYY-MM-DD HH:MM]
**Status:** [Planning / Implementation / Review / Deployed]
```

**Intégration Workflow V4.1:**

**Phase 0: Création Memory (après /zen-roundtable)**
```bash
# Claude génère automatiquement project-memory.md
# Contenu: constitution.md + spec.md summarized
# Sections: Key Decisions (arch, tech stack), Patterns Used, Critical Context
```

**Phase 1: Update Memory (après /speckit.design)**
```bash
# Claude enrichit project-memory.md
# Ajout: Design tokens, custom brand decision, typography
```

**Phase 2: Read Memory (début implementation)**
```bash
# Sub-agents lisent project-memory.md (pas full conversation history)
# Context réduit: decisions + patterns + critical context ONLY
# ROI: -5 to -10% context overhead
```

**Phase 3: Update Memory (après /import-design)**
```bash
# Claude note: custom brand merged, final design tokens
```

**Phase 4: Final Update (après review)**
```bash
# Claude note: issues rencontrés, solutions, learnings
# Status: Deployed
```

**Actions Concrètes:**

- [ ] **Créer template** `templates/project-memory-template.md`
- [ ] **Modifier `/zen-roundtable`** pour auto-créer memory
- [ ] **Modifier CLAUDE.md** pour lire memory au début Phase 2
- [ ] **Créer command** `/update-memory` (enrichir memory mid-project)
- [ ] **Documenter pattern** dans `docs/GOLDEN-PATTERNS.md`

**Référence Vidéo:** Timestamp 11:31-12:22 (Structured Note-Taking)

**Deliverable:**
- Template `templates/project-memory-template.md`
- Updated `.claude/commands/zen-roundtable.md` (auto-create memory)
- New command `.claude/commands/update-memory.md`
- Documentation pattern `docs/GOLDEN-PATTERNS.md` - Section "Context Management"

**ROI Attendu:** -5 to -10% context overhead, better multi-session continuity

---

### 🎯 TÂCHE 3: MCP Tools On-Demand (Priority 3 - 30 min - Quick Win)

**Objectif:** Activate/deactivate MCP per phase (reduce context overhead)

**Strategy:**

**Phase 1 Planning: Context7 ONLY**
```json
// .claude/mcp.json (Phase 1)
{
  "context7": { ... }
  // Figma, ESLint, Zen désactivés
}
```

**Phase 2 Implementation: Context7 + ESLint**
```json
// .claude/mcp.json (Phase 2)
{
  "context7": { ... },
  "eslint": { ... }
  // Figma, Zen désactivés
}
```

**Phase 3 Design: Figma ONLY**
```json
// .claude/mcp.json (Phase 3)
{
  "figma": { ... }
  // Context7, ESLint, Zen désactivés
}
```

**Implementation Options:**

**Option A: Manuel (Quick Win - 0 dev)**
- Commenter/décommenter dans `.claude/mcp.json` per phase
- Restart Claude Code session
- **Effort:** 30 sec par phase change
- **ROI:** -8 to -10% context overhead

**Option B: Script Automation (Nice-to-Have)**
```bash
# scripts/mcp-phase-planning.sh
# scripts/mcp-phase-implementation.sh
# scripts/mcp-phase-design.sh
```
- **Effort:** 30 min dev
- **ROI:** Same -8 to -10%, mais automated

**Recommandation:** Start with Option A (manual), automate later if needed

**Actions:**

- [ ] **Documenter strategy** dans `WORKFLOW-FINAL-V4-MULTI-DEVICE.md`
- [ ] **Créer reminder** dans chaque Phase instructions
- [ ] **(Optionnel)** Scripts automation si utile

**ROI Attendu:** -8 to -10% context overhead

---

## 🔑 CONTEXTE IMPORTANT À GARDER

### Zen MCP = CORE (Validated Production)

**Status:** ✅ **VALIDATED Session 3 (2025-10-12)**

**Composition:**
- **Codex (gpt-5):** Architecture options generation (3 options + trade-offs)
- **Gemini (2.5-pro):** Security review + scalability analysis + critique
- **Claude (Sonnet 4.5):** Arbitration + synthesis + final decision

**Tool:** `mcp__zen__clink` (CLI-to-CLI bridge)

**Workflow:**
```bash
/zen-roundtable "Brief: Application gestion patients HIPAA"

# Résultat automatique:
# → .specify/memory/constitution.md (HIGH-LEVEL)
# → specs/001-mvp/spec.md (TECHNICAL)
```

**ROI Confirmed:**
- **Temps:** -87% (45 min vs 6h manual)
- **Context:** 100% preservation (no copy/paste loss)
- **Quality:** Multi-perspective (architecture + security + synthesis)

**Use Cases:**
- Architecture Decision Records (ADR)
- Complex technical decisions
- Security-critical projects
- Multi-option evaluation

**Important:** Zen MCP = Phase 0 PRINCIPALE (pas "optionnel")

---

### Design Decoupling = Competitive Advantage

**Status:** ✅ **VALIDATED Session 2025-10-15**

**Philosophy:**
> "Claude Code generates logic. Human crafts brand. 15-minute merge = custom product."

**Problem Solved:**
- AI tools (Lovable, Bolt, v0) génèrent design **generic**
- Customization = **1-2 jours refactor** (design couplé avec code)

**Solution:**
- **Day 1:** Claude génère avec CSS variables ONLY (`bg-primary-500`)
- **Parallèle:** Designer crée custom brand (Figma/v0/manual)
- **Day N:** `/import-design` merge → **15 min vs 1-2 days**

**ROI:**
- **Temps:** -95% (15 min vs 1-2 days)
- **Quality:** Custom brand vs generic AI look
- **Flexibility:** Designer works indépendamment (no code knowledge)
- **Competitive Advantage:** Custom product vs generic tools

**Critical Files:**
- `docs/GOLDEN-PATTERNS.md` - Design/Dev Decoupling Pattern (Health 9.9/10)
- `.claude/commands/import-design.md` - 15-min merge workflow
- `CLAUDE.md` - Design Philosophy (CSS variables enforced)

**Important:** ALWAYS run `/speckit.design` in Phase 1 (Design Decoupling from Day 1)

---

### Jules Security = Optionnel, Manuel, PAS Production-Ready

**Status:** ⚠️ **PAS ENCORE TESTÉ PRODUCTION**

**Reality Check:**
- ❌ **PAS intégré CI/CD automatique**
- ❌ **PAS workflow principal** (contrairement ancienne doc)
- ✅ **Lancé manuellement** à la main
- ✅ **Fonctionne async** depuis GitHub repo
- ✅ **Petite partie** du workflow (Phase 5 optionnel)

**Quand Utiliser:**
- Projets sensibles (healthcare, finance)
- Audit sécurité post-dev (manuel)
- Review code avant production

**Quand NE PAS Utiliser:**
- Projets standards (non critique)
- Workflow rapide (MVP, prototype)

**Important:** Jules ≠ core workflow (contrairement à ce que ancienne doc suggérait)

---

### Mac LOCAL = 99% Reality

**Reality Check Workflow:**
- ✅ **Mac LOCAL = 99%** des cas (développement principal)
- ✅ **GitHub Actions cloud = <5%** (fallback si Mac crash uniquement)
- ❌ **PAS workflow multi-cloud standard**

**Why Mac LOCAL:**
- Claude Code optimisé pour local development
- Sub-agents performants en local
- MCP tools (Context7, Figma, Zen) = local execution
- Fast iteration (no cloud latency)

**When Cloud (Rare <5%):**
- Mac crash/reboot pendant dev
- Besoin mobile review (iPhone/iPad)
- Collaborative session (screen share)

**Important:** Documentation reflète maintenant cette réalité (WORKFLOW-V4 rewritten)

---

## 📊 COMMITS RÉCENTS (Référence)

```bash
6ee230d - feat: design/dev decoupling system
          - Created /import-design command
          - Added Figma MCP
          - Documented pattern GOLDEN-PATTERNS.md

d2bf1c2 - docs: design decoupling session resume
          - Complete session documentation
          - ROI validation (-95% time)

832d608 - chore: archive obsolete files V4.1
          - 7 files archived
          - Justifications documented

4c0d9d6 - docs: rewrite WORKFLOW-V4.1
          - 1191→541 lines (-55%)
          - Priorities corrected (Zen Phase 0, Jules minimal)
          - Reality check added
```

---

## 🚀 COMMENCER PAR

### Ordre d'Exécution (Recommandé)

**1. Audit CLAUDE.md** (45 min - Priority 1)
   - System Prompt Calibration (Goldilocks zone)
   - Identifier patterns "too rigid" / "too vague"
   - Refactor vers Clear + Simple + Intelligent
   - **Deliverable:** `AUDIT-CLAUDE-MD-2025-10-15.md` + potentially refactored `CLAUDE.md`

**2. Implémenter notes.md System** (1h - Priority 2)
   - Créer template `project-memory-template.md`
   - Modifier `/zen-roundtable` (auto-create memory)
   - Créer command `/update-memory`
   - Documenter pattern GOLDEN-PATTERNS.md
   - **Deliverable:** Template + commands + documentation

**3. (Optionnel) MCP On-Demand** (30 min - Priority 3)
   - Documenter strategy per phase
   - Manual approach (quick win)
   - (Nice-to-have) Scripts automation
   - **Deliverable:** Documentation WORKFLOW-V4

---

## 📚 FICHIERS RÉFÉRENCE (À Consulter Si Besoin)

**Workflow:**
- `docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md` - Source of truth (rewritten, accurate)
- `START-HERE.md` - Point d'entrée unique
- `INDEX-FILES-V4.md` - Navigation projet

**Patterns:**
- `docs/GOLDEN-PATTERNS.md` - Design Decoupling (Health 9.9/10)
- `docs/ZEN-MCP-WORKFLOW-ORCHESTRATION.md` - Multi-IA orchestration
- `docs/SUB-AGENTS-MASTERY.md` - Sub-agents orchestration

**Commands:**
- `.claude/commands/zen-roundtable.md` - Multi-IA Phase 0
- `.claude/commands/import-design.md` - Design merge Phase 3
- `.claude/commands/speckit-*.md` - Planning Phase 1

**Core:**
- `CLAUDE.md` - Instructions + Design Philosophy (À AUDITER)

**Archives:**
- `archive-obsolete-2025-10-15-v4.1/ARCHIVAGE-RAISONS-V4.1.md` - Justifications cleanup

**Session Resumes:**
- `RESUME-SESSION-2025-10-15-DESIGN-DECOUPLING.md` - Design Decoupling (554 lines)
- `RESUME-SESSION-2025-10-12.md` - Zen MCP Validation (Session 3)

---

## ✅ CHECKLIST PRÉ-TRAVAIL

Avant de commencer les tâches, vérifier:

- [ ] **Workflow V4.1 en tête** (5 phases: Multi-IA → Planning → Implementation → Design → Review)
- [ ] **Priorities claires:**
  - Zen MCP = Phase 0 CORE
  - Design Decoupling = Competitive Advantage
  - Jules = Optionnel manuel (Phase 5)
  - Mac LOCAL = 99%
- [ ] **Context Management focus:**
  - CLAUDE.md audit (Goldilocks zone)
  - notes.md system (structured memory)
  - MCP on-demand (optional quick win)
- [ ] **Fichiers key accessibles:**
  - CLAUDE.md (à auditer)
  - WORKFLOW-FINAL-V4-MULTI-DEVICE.md (référence)
  - GOLDEN-PATTERNS.md (documentation patterns)

---

**Version:** 1.0
**Status:** ✅ **READY TO START - CLAUDE.MD AUDIT**

**Next Command:** Commencer Tâche 1 (Audit CLAUDE.md)

*Workflow V4.1 - Context Management Optimized! 🧠*
