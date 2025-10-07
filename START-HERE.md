# 🚀 ARCHON ORCHESTRATOR - START HERE

**Version:** 5.0 (Workflow V3 - Claude Max + Jules Security)
**Date:** 2025-10-07
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
**Mission:** Workflow multi-client productif (8-10 clients/semaine)

---

## 🎯 NOUVEAU: WORKFLOW COMPLET V3

### 📖 **SOURCE DE VÉRITÉ (LIRE EN PREMIER)**
👉 **[docs/WORKFLOW-COMPLETE-V3.md](./docs/WORKFLOW-COMPLETE-V3.md)** 👈 **(85KB - RIEN NE MANQUE)**

**Contient TOUT:**
- ✅ **5 Piliers complets:** Spec-Kit + Bootstrap + Design Tokens + Implementation + Jules Security
- ✅ **2 Options execution:** Full Local (Mac Mini) + GitHub Actions (Claude Max session tokens)
- ✅ **Workflow mobile:** Déclenchement Android + Review mobile + Timeline complète
- ✅ **Context7 patterns:** Saving + Reuse + ROI 64% temps gagné
- ✅ **Cost & ROI:** €118/mois → 32-60 clients/mois → €64K-€120K/mois revenue
- ✅ **Setup complet:** Keychain credentials + GitHub Secrets + Workflows
- ✅ **Troubleshooting:** 7 problèmes courants + solutions

**📱 Workflow mobile-first:** Planning Mac 30 min → Issue Android 2 min → Cloud execution 3-4h → Review mobile 15 min

**🔴 LIRE ABSOLUMENT AVANT DE COMMENCER**

---

## 📚 DOCUMENTATION COMPLÉMENTAIRE

**Workflows spécialisés:**
- **[GITHUB-ACTIONS-OAUTH-SETUP.md](./docs/GITHUB-ACTIONS-OAUTH-SETUP.md)** - ✅ **Setup GitHub Actions + OAuth (mobile-first)**
- **[WORKFLOW-CLAUDE-FIRST-JULES-SECURITY.md](./docs/WORKFLOW-CLAUDE-FIRST-JULES-SECURITY.md)** - Focus multi-client + timelines
- **[WORKFLOW-SOLOPRENEUR-VISION.md](./docs/WORKFLOW-SOLOPRENEUR-VISION.md)** - Vision workflow solo (référence historique)

**Setup & Configuration:**
- **[JULES-SECURITY-GUARDIAN-SETUP.md](./docs/JULES-SECURITY-GUARDIAN-SETUP.md)** - Jules CLI + API key setup
- **[MULTI-CLIENT-SETUP-GUIDE.md](./docs/MULTI-CLIENT-SETUP-GUIDE.md)** - Multi-client (8-10/semaine)

**Objectif:** Ship 2-3 clients/jour avec qualité production

---

## 🎨 DESIGN SYSTEM SIMPLIFIÉ

👉 **[docs/DESIGN-SYSTEM-SOLO-SIMPLIFIED.md](./docs/DESIGN-SYSTEM-SOLO-SIMPLIFIED.md)** 👈

**Design-First, Personnalisation-Later:**
- ✅ **T002 Design tokens** - Généré automatiquement (2-5 min)
- ✅ **Wireframes génériques** - Dashboard + Menu simple (SVG)
- ✅ **shadcn/ui** - Composants battle-tested (pas customs)
- ✅ **20 tokens essentiels** - Colors, Typography, Spacing (vs 200+ variables)
- ✅ **Personnalisation rapide** - Modifier 1 JSON après backend (30 min vs 2-3h)

**Résultat:** Design générique en 2-5 min, personnalisation en 30 min

---

## 🎯 QUICK START NOUVEAU PROJET

### Option 1: Workflow Solo Standard (3-4h)

```bash
# PHASE 1: Spec-Kit (30 min)
uvx --from git+https://github.com/github/spec-kit.git specify init myproject
cd myproject

/specify       # → specs/001-mvp/spec.md
/clarify       # (si besoin)
/plan          # → specs/001-mvp/plan.md
/tasks         # → specs/001-mvp/tasks.md (50-100 tasks)

# PHASE 2: Bootstrap (1-2 min)
/bootstrap
# Mega-orchestrator lit tasks.md et génère:
# - backend-specialist.md
# - frontend-specialist.md
# - design-specialist.md
# - testing-specialist.md

# PHASE 3: Implementation (3-4h)
/implement
# Claude primaire orchestre:
# T001 → @devops-specialist (Next.js setup)
# T002 → @design-specialist (design-tokens.json + wireframes)
# T015 → @backend-specialist (Auth API)
# T022 → @frontend-specialist (Auth UI utilise tokens)
# ... (continue jusqu'à T078)

# Résultat: MVP complet, testé, production-ready
```

**Durée totale:** 3-4h (vs 4-6h Sonnet 3.7, vs 2-3 jours manuel)

---

### Option 2: Workflow Mobile-First (Claude Max OAuth + GitHub Actions) 🆕

**Pour multi-clients avec déclenchement/review mobile**

```bash
# PHASE 1: Setup One-Time (15 min)
# Générer OAuth token dans Claude Desktop
/install-github-app  # → Copier token

# Setup templates
cd ~/Documents/DEV/clients
mkdir _templates/
cp ~/Documents/DEV/archon-orchestrator/.github/workflows/claude-max-implementation.yml _templates/

# PHASE 2: Nouveau Client (30 min planning + 3-4h cloud)
cd ~/Documents/DEV/clients
./new-client.sh my-project  # Automated setup

# Planning (Mac - 30 min)
cd my-project
/speckit.constitution
/speckit.specify
/speckit.plan
/speckit.tasks
git add . && git commit -m "docs: planning" && git push

# PHASE 3: Déclenchement (Mobile Android - 2 min)
# GitHub app → Issues → New Issue
# Title: Implement T001-T010
# Body: Task range: T001-T010
# Labels: run-claude
# Submit → GitHub Actions démarre

# PHASE 4: Review (Mobile Android - 15 min après 3-4h)
# Notification PR → Review → Approve → Merge
```

**Capacité:** 3-4 clients simultanés, 8-10 clients/semaine | **Coût:** €100/mois (Claude Max)

**Guide complet:** [docs/GITHUB-ACTIONS-OAUTH-SETUP.md](./docs/GITHUB-ACTIONS-OAUTH-SETUP.md)

---

## 📚 DOCUMENTATION COMPLÈTE

### 🔴 Source de Vérité V3

1. **[WORKFLOW-COMPLETE-V3.md](./docs/WORKFLOW-COMPLETE-V3.md)** - ✅ **SOURCE DE VÉRITÉ** (85KB - RIEN NE MANQUE)
2. **[INDEX-FILES-V3.md](./INDEX-FILES-V3.md)** - Index fichiers valides projet (navigation rapide)
3. **[CLAUDE.md](./CLAUDE.md)** - Instructions session Claude Code
4. **[README.md](./README.md)** - Overview projet
5. **[CLAUDE-CODE-CAPACITES-REFERENCE.md](./CLAUDE-CODE-CAPACITES-REFERENCE.md)** - Capacités Sonnet 4.5

### Workflows Multi-Client

- **[docs/WORKFLOW-CLAUDE-FIRST-JULES-SECURITY.md](./docs/WORKFLOW-CLAUDE-FIRST-JULES-SECURITY.md)** - Focus multi-client + timelines
- **[docs/JULES-SECURITY-GUARDIAN-SETUP.md](./docs/JULES-SECURITY-GUARDIAN-SETUP.md)** - Setup Jules CLI + API key
- **[docs/MULTI-CLIENT-SETUP-GUIDE.md](./docs/MULTI-CLIENT-SETUP-GUIDE.md)** - Setup 8-10 clients/semaine
- **[.github/workflows/claude-max-implementation.yml](./.github/workflows/claude-max-implementation.yml)** - ✅ **WORKFLOW PRINCIPAL**
- **[.github/security-checklist.md](./.github/security-checklist.md)** - Checklist OWASP + RGPD + CVE

### Patterns & Best Practices

- **[docs/SUB-AGENTS-MASTERY.md](./docs/SUB-AGENTS-MASTERY.md)** - Bootstrap + sub-agents orchestration
- **[docs/DESIGN-SYSTEM-SOLO-SIMPLIFIED.md](./docs/DESIGN-SYSTEM-SOLO-SIMPLIFIED.md)** - Design tokens (T002)
- **[docs/AGENTIC-PATTERNS.md](./docs/AGENTIC-PATTERNS.md)** - GATHER → ACTION → VERIFY
- **[docs/ZERO-TRUST.md](./docs/ZERO-TRUST.md)** - Quality gates P0-P4
- **[docs/GOLDEN-PATTERNS.md](./docs/GOLDEN-PATTERNS.md)** - Patterns battle-tested
- **[docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Debug + solutions

### Références Techniques

- **[docs/ARCHITECTURE-COMPLIANCE-V2.md](./docs/ARCHITECTURE-COMPLIANCE-V2.md)** - Architecture compliance
- **[docs/DOCKER-GUIDE.md](./docs/DOCKER-GUIDE.md)** - Docker deployment (si besoin)
- **[docs/WORKFLOW-SOLOPRENEUR-VISION.md](./docs/WORKFLOW-SOLOPRENEUR-VISION.md)** - Référence historique workflow solo

### Fichiers Archivés

- **[archive-obsolete-2025-10-07-v3/ARCHIVAGE-RAISONS-V3.md](./archive-obsolete-2025-10-07-v3/ARCHIVAGE-RAISONS-V3.md)** - 121 fichiers archivés (raisons + liste)

---

## 🚀 SONNET 4.5 - Capacités Optimisées

**Nouveautés officielles (2025-09-29):**
- ✅ **30+ heures focus** - Tâches multi-step complexes sans perte contexte
- ✅ **+18% planning** - Découpage tasks.md optimisé
- ✅ **+12% end-to-end** - Implementation complète améliorée
- ✅ **0% error rate** (vs 9% avant) - Zéro hallucination code
- ✅ **Parallel tool execution** - Bash + Read + Edit simultanés
- ✅ **Self-testing** - Agent teste son propre code
- ✅ **Checkpoints + rollback** - Sauvegarde progression automatique

**Impact workflow solo:**
- Bootstrap: 2-3 min → **1-2 min**
- Implementation: 4-6h → **3-4h**
- Erreurs code: 9% → **0%**
- Fiabilité: +12% completion rate

**Source:** https://www.anthropic.com/news/claude-sonnet-4-5

---

## 🤖 AGENTS GÉNÉRÉS AUTOMATIQUEMENT

### Bootstrap Auto-Génération

Le **mega-orchestrator** (meta-agent pattern) lit `tasks.md` et génère automatiquement:

**Agents Essentiels (3-4):**
1. **backend-specialist** - API + Supabase + Auth
2. **frontend-specialist** - React + shadcn/ui + Forms
3. **design-specialist** - Tokens + Wireframes (2-5 min)
4. **testing-specialist** - Tests E2E (TOUJOURS)

**Optionnel selon projet:**
- **devops-specialist** - Deploy/CI (si besoin)

**Pas besoin (intégré):**
- ❌ security-specialist (dans backend)
- ❌ data-specialist (dans backend)
- ❌ scout-specialist (context 200K+ suffit)

---

## 🎯 DIFFÉRENCE SOLO vs ÉQUIPE

| Aspect | Équipe Enterprise | Solo Vibe Coding |
|--------|-------------------|------------------|
| **Agents** | 6-8 agents fleet | 3-4 agents essentiels |
| **Scout** | 4 modèles parallèles | Pas de scout |
| **Context** | 200K embedded | Read files (GATHER) |
| **Device** | Mac Mini dédié | 1 Mac in-the-loop |
| **Setup** | 30 min + 14 jours | 30 min + 3-4h |
| **Output** | Custom styles | Standard report |
| **Patterns** | Enterprise coordination | Rapid shipping |

---

## ✅ CHECKLIST SESSION DÉMARRAGE

Avant de commencer nouveau projet:

- [ ] Lu [WORKFLOW-SOLOPRENEUR-VISION.md](./docs/WORKFLOW-SOLOPRENEUR-VISION.md)
- [ ] Lu [DESIGN-SYSTEM-SOLO-SIMPLIFIED.md](./docs/DESIGN-SYSTEM-SOLO-SIMPLIFIED.md)
- [ ] Spec-Kit installé: `uvx --from git+https://github.com/github/spec-kit.git specify --version`
- [ ] Compris workflow: /specify → /plan → /tasks → /bootstrap → /implement
- [ ] Compris agents: 3-4 max, chaining auto, context simple

---

## 🚫 CE QU'ON N'UTILISE PAS (Solo)

**Archon Services (Trop Complexe):**
- ❌ Archon UI (port 3737)
- ❌ Archon API (port 8181)
- ❌ Archon MCP (port 8051)
- ❌ Orchestra MCP (port 3456)
- ❌ GitHub MCP (port 8054)
- ❌ Jules MCP (port 8055)
- ❌ Gemini Bridge (port 7777)
- ❌ Redis (port 6379)

**Pourquoi:** Solopreneur = simplicité maximale. Pas besoin infrastructure multi-services.

**Ce qu'on garde:**
- ✅ Spec-Kit (/specify → /plan → /tasks)
- ✅ Claude Code sub-agents (3-4 agents)
- ✅ Context7 MCP (optionnel, knowledge base léger)

---

## 🔗 NAVIGATION RAPIDE

| Je veux... | Lire... |
|------------|---------|
| **Workflow solo (1 projet)** | [WORKFLOW-SOLOPRENEUR-VISION.md](./docs/WORKFLOW-SOLOPRENEUR-VISION.md) |
| **Workflow multi-client (8-10/semaine)** 🆕 | [WORKFLOW-CLAUDE-FIRST-JULES-SECURITY.md](./docs/WORKFLOW-CLAUDE-FIRST-JULES-SECURITY.md) |
| **Setup Jules Security Guardian** 🆕 | [JULES-SECURITY-GUARDIAN-SETUP.md](./docs/JULES-SECURITY-GUARDIAN-SETUP.md) |
| **Setup multi-client agency** 🆕 | [MULTI-CLIENT-SETUP-GUIDE.md](./docs/MULTI-CLIENT-SETUP-GUIDE.md) |
| Intégrer design tokens | [DESIGN-SYSTEM-SOLO-SIMPLIFIED.md](./docs/DESIGN-SYSTEM-SOLO-SIMPLIFIED.md) |
| Capacités Claude Code | [CLAUDE-CODE-CAPACITES-REFERENCE.md](./CLAUDE-CODE-CAPACITES-REFERENCE.md) |
| Patterns agentic | [AGENTIC-PATTERNS.md](./docs/AGENTIC-PATTERNS.md) |
| Sub-agents mastery | [SUB-AGENTS-MASTERY.md](./docs/SUB-AGENTS-MASTERY.md) |
| Quality gates | [ZERO-TRUST.md](./docs/ZERO-TRUST.md) |
| Résoudre problème | [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) |

---

## 📊 MÉTRIQUES SONNET 4.5

| Métric | Avant (Sonnet 3.7) | Sonnet 4.5 | Gain |
|--------|-------------------|------------|------|
| **Spec-Kit** | 30 min | 30 min | = |
| **Bootstrap** | 2-3 min | 1-2 min | -33% |
| **T002 Design** | 5-10 min | 2-5 min | -50% |
| **Implementation** | 4-6h | 3-4h | -33% |
| **Erreurs code** | 9% | 0% | -100% |
| **Fiabilité** | Baseline | +12% | +12% |

**Résultat:** MVP complet **3-4h** (vs 2-3 jours manuel)

---

## 🚀 ÉVOLUTION FUTURE

**Philosophie:** Facilitateur, pas dogmatique. Workflow évolue avec l'IA.

**Si Sonnet 5.0 / 4.6 ajoute features:**
- ✅ Tester nouvelles capacités
- ✅ Adapter si amélioration prouvée
- ✅ Documenter changements
- ✅ Garder simplicité solo (priorité #1)

**Note:** Sonnet 4.5 est déjà "the best coding model in the world" (Anthropic) - Focus sur shipping MVPs, pas sur attendre features futures.

---

**Version:** 4.0 (Solopreneur Sonnet 4.5 optimized)
**Date:** 2025-10-06
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
**Mission:** Ship 1 MVP/semaine avec qualité

*Objectif: Simple, rapide, évolutif - 3-4h MVP production-ready*
