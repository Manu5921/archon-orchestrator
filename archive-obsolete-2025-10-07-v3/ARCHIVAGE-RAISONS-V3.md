# Archivage Documentation Obsolète - V3

**Date:** 2025-10-07
**Raison:** Transition vers WORKFLOW-COMPLETE-V3.md (workflow unifié Claude Max + Jules Security + Bootstrap + Design + Context7)

---

## 🎯 CONTEXTE

Le projet a évolué vers un workflow simplifié et complet documenté dans:
- **docs/WORKFLOW-COMPLETE-V3.md** (85KB - RIEN NE MANQUE)
- **docs/WORKFLOW-CLAUDE-FIRST-JULES-SECURITY.md** (toujours valide - focus multi-client)
- **.github/workflows/claude-max-implementation.yml** (workflow production-ready)

Les fichiers archivés ci-dessous sont **obsolètes** car:
1. Documentent anciens workflows (Smart Review Gemini Bridge, Archon UI/API, etc.)
2. Référencent architecture équipe (vs workflow solo actuel)
3. Contiennent informations contradictoires avec V3
4. Ne reflètent pas setup Claude Max + GitHub Actions actuel

---

## 📁 FICHIERS ARCHIVÉS

### Documentation Obsolète (Workflows Anciens)

#### **docs/INTEGRATION-NOUVELLES-IDEES.md**
- **Raison:** Discussions exploratoires pré-V3
- **Remplacé par:** WORKFLOW-COMPLETE-V3.md (sections 2 Options Execution + Context7)
- **Contenu:** Idées ChatGPT sur workflows (non validées)

#### **docs/CHATGPT-FEEDBACK-ANALYSIS.md**
- **Raison:** Feedback ChatGPT analysé (intégré dans V3)
- **Remplacé par:** Décisions finales dans WORKFLOW-COMPLETE-V3.md
- **Contenu:** Comparaison workflows (obsolète)

#### **docs/ARCHON-COLEAM00-ANALYSE.md**
- **Raison:** Analyse projet TrustBoost (non pertinent workflow actuel)
- **Remplacé par:** N/A (hors scope workflow solopreneur)
- **Contenu:** Architecture TrustBoost Phase 4

#### **WORKFLOW-HYBRID-COMPLETE-DESCRIPTION.md**
- **Raison:** Workflow hybrid Claude + Gemini (abandonné)
- **Remplacé par:** WORKFLOW-COMPLETE-V3.md (Claude + Jules seulement)
- **Contenu:** Description workflow Gemini Bridge (obsolète)

#### **PROMPT-REPRISE.md**
- **Raison:** Prompt reprise session ancien workflow
- **Remplacé par:** START-HERE.md + WORKFLOW-COMPLETE-V3.md
- **Contenu:** Instructions session (intégrées V3)

#### **REVIEWRESCUE-AI-SPECIFY.md**
- **Raison:** Spec ReviewRescue AI (exemple, pas workflow)
- **Remplacé par:** Docs Spec-Kit dans WORKFLOW-COMPLETE-V3.md
- **Contenu:** Spec example (référence gardée knowledge-base)

#### **TEST-SUMMARY.md** + **TEST-WORKFLOW-RESULTS.md**
- **Raison:** Résultats tests anciens workflows
- **Remplacé par:** N/A (tests infra, pas workflow)
- **Contenu:** Tests Archon MCP (obsolète)

---

### Workflows GitHub Actions Obsolètes

#### **.github/workflows/architecture-compliance-jules.yml**
- **Raison:** Workflow Jules compliance (architecture équipe)
- **Remplacé par:** claude-max-implementation.yml (job jules-security intégré)
- **Contenu:** Vérification compliance Jules seul

#### **.github/workflows/claude-trigger.yml**
- **Raison:** Workflow simple trigger Claude (incomplet)
- **Remplacé par:** claude-max-implementation.yml (complet: bootstrap + design + implementation + jules)
- **Contenu:** Trigger basique (manque bootstrap, design tokens, jules parallèle)

#### **.github/workflows/jules-security-guardian.yml**
- **Raison:** Jules standalone (maintenant intégré dans claude-max-implementation.yml)
- **Remplacé par:** claude-max-implementation.yml (job jules-security)
- **Contenu:** Scan Jules seul (garde comme backup standalone si besoin)
- **NOTE:** **GARDER** dans archive (utile standalone)

#### **.github/workflows/backup-strategy.yml**
- **Raison:** Workflow backup (pas workflow dev)
- **Remplacé par:** N/A (infra, pas workflow)
- **Contenu:** Sauvegarde données

#### **.github/workflows/e2e-tests.yml**
- **Raison:** Tests E2E (infra testing, pas workflow dev)
- **Remplacé par:** N/A (tests infra)
- **Contenu:** Playwright tests

#### **.github/workflows/trustboost-phase4-cicd.yml**
- **Raison:** CI/CD TrustBoost (projet différent)
- **Remplacé par:** N/A (hors scope)
- **Contenu:** TrustBoost deployment

---

### Scripts JavaScript Obsolètes (Gemini Bridge / Archon Servers)

#### **setup-gemini-bridge.js**
- **Raison:** Setup Gemini Bridge (workflow abandonné)
- **Remplacé par:** N/A (Jules remplace Gemini)
- **Contenu:** Configuration Gemini Bridge MCP

#### **simple-smart-review.js** + **smart-review-command.js** + **smart-review-debug.js** + **smart-review-mcp-tool.js**
- **Raison:** Smart Review Gemini (workflow abandonné)
- **Remplacé par:** Jules Security Guardian (OWASP + RGPD + CVE)
- **Contenu:** Code Smart Review Gemini

#### **jules-hybrid-deploy.js** + **jules-quick-deploy.js** + **jules-security-guardian.js** + **jules-task-queue.js**
- **Raison:** Scripts Jules (remplacés par GitHub Actions workflow)
- **Remplacé par:** .github/workflows/claude-max-implementation.yml
- **Contenu:** Déploiement Jules local (obsolète avec GitHub Actions)

#### **claude-gemini-diagnostic*.js** + **claude-gemini-diagnostic*.json**
- **Raison:** Diagnostic Claude-Gemini communication (workflow abandonné)
- **Remplacé par:** N/A (Gemini remplacé par Jules)
- **Contenu:** Tests communication Claude-Gemini

#### **gemini-prevalidator.js**
- **Raison:** Validation Gemini (workflow abandonné)
- **Remplacé par:** Jules Security scan
- **Contenu:** Prevalidation Gemini

#### **multi-agent-orchestrator.js** + **multi-agent-report*.json**
- **Raison:** Orchestrateur multi-agents (architecture équipe)
- **Remplacé par:** Bootstrap sub-agents (3-4 agents solo)
- **Contenu:** Fleet agents 6-8 (trop complexe solo)

#### **workflow-direct.js**
- **Raison:** Workflow direct test (obsolète)
- **Remplacé par:** GitHub Actions workflows
- **Contenu:** Test workflow

#### **zero-trust-validator.js**
- **Raison:** Validator local (remplacé par Jules + quality gates)
- **Remplacé par:** jules-security scan + GitHub Actions quality gates
- **Contenu:** Validation zero-trust local

#### **security-automation-scheduler.js** + **security-patterns-advanced.js**
- **Raison:** Sécurité locale (remplacé par Jules async)
- **Remplacé par:** Jules Security Guardian GitHub Actions
- **Contenu:** Sécurité locale scheduling

#### **improved-document-naming.js**
- **Raison:** Utilitaire naming (pas workflow)
- **Remplacé par:** N/A (utilitaire)
- **Contenu:** Renommage fichiers

---

### Code Source Obsolète (src/)

#### **src/agents/archon-*.js** (12 fichiers)
- **Raison:** Connectors Archon UI/API (architecture équipe abandonnée)
- **Remplacé par:** N/A (workflow solo sans Archon servers)
- **Contenu:** Code Archon MCP connectors (SSE, HTTP, streaming)
- **Fichiers:**
  - archon-connector.js
  - archon-http-connector.js
  - archon-mcp-connector.js
  - archon-mcp-connector-http.js
  - archon-mcp-sse-connector.js
  - archon-mcp-streaming-connector.js
  - archon-mcp-connector/ (dossier complet)

#### **src/agents/gemini-*.js** (7 fichiers)
- **Raison:** Gemini agents (workflow abandonné, Jules remplace)
- **Remplacé par:** Jules Security Guardian
- **Contenu:** Code Gemini agents (bridge, connector, explorer, CLI wrapper)
- **Fichiers:**
  - gemini-agent.js
  - gemini-bridge.js
  - gemini-cli-wrapper.js
  - gemini-connector.js
  - gemini-explorer.js
  - gemini-mcp-connector.js

#### **src/agents/claude-orchestrator.js**
- **Raison:** Orchestrateur complexe (remplacé par bootstrap simple)
- **Remplacé par:** Bootstrap meta-agent pattern (WORKFLOW-COMPLETE-V3.md)
- **Contenu:** Orchestrateur multi-agents

#### **src/archon-v3/meta-supervisor.js**
- **Raison:** Meta-supervisor Archon V3 (architecture équipe)
- **Remplacé par:** N/A (workflow solo)
- **Contenu:** Supervision Archon

#### **src/integration/*.js** (3 fichiers)
- **Raison:** Intégrations Archon V3 system (architecture équipe)
- **Remplacé par:** N/A (workflow solo)
- **Contenu:** Archon V3 system, hybrid Python adapter, onboard existing
- **Fichiers:**
  - archon-v3-system.js
  - hybrid-python-adapter.js
  - onboard-existing-project.js

#### **src/integrations/github-orchestrator-integration.js** + **hybrid-jules-workflow.js** + **jules-async-workflow.js**
- **Raison:** Intégrations Jules anciennes (remplacées par GitHub Actions)
- **Remplacé par:** .github/workflows/claude-max-implementation.yml
- **Contenu:** Workflows Jules locaux

#### **src/jules-integration/*.js** (2 fichiers)
- **Raison:** Jules integration ancienne (remplacée par GitHub Actions)
- **Remplacé par:** .github/workflows/claude-max-implementation.yml
- **Contenu:** Jules client + webhook handler local

#### **src/mcp/claude-code-orchestration-tools.js** + **start-server.js**
- **Raison:** MCP server local (pas utilisé workflow V3)
- **Remplacé par:** N/A (GitHub Actions cloud)
- **Contenu:** MCP server orchestration local

#### **src/trustboost-phase4/** (dossier complet)
- **Raison:** TrustBoost Phase 4 (projet différent, pas workflow)
- **Remplacé par:** N/A (hors scope workflow)
- **Contenu:** Code TrustBoost (API, components, lib, pages)

#### **src/workflow/project-workflow.js** + **review-cycle.js**
- **Raison:** Workflow ancien (remplacé par GitHub Actions)
- **Remplacé par:** claude-max-implementation.yml
- **Contenu:** Workflow local orchestration

---

### Configuration Files Obsolètes

#### **archon-config.json**
- **Raison:** Config Archon servers (architecture équipe)
- **Remplacé par:** N/A (workflow solo sans servers)
- **Contenu:** Configuration Archon UI/API ports

#### **jules-config.json**
- **Raison:** Config Jules locale (remplacée par GitHub Secrets)
- **Remplacé par:** GitHub Secrets (JULES_API_KEY)
- **Contenu:** Jules local config

#### **docker-compose*.yml** (4 fichiers)
- **Raison:** Docker infrastructure équipe (Archon servers, Prometheus, Redis)
- **Remplacé par:** N/A (workflow solo sans Docker)
- **Contenu:** Docker services Archon
- **Fichiers:**
  - docker-compose.yml
  - docker-compose.archon-only.yml
  - docker-compose.mcp-test.yml
  - docker-compose.test.yml

#### **docker/prometheus/prometheus.yml**
- **Raison:** Prometheus monitoring (architecture équipe)
- **Remplacé par:** N/A (workflow solo)
- **Contenu:** Config Prometheus

#### **config/orchestra_config.yaml**
- **Raison:** Orchestra config (architecture équipe)
- **Remplacé par:** N/A (workflow solo)
- **Contenu:** Configuration Orchestra MCP

#### **.mcp.json**
- **Raison:** MCP config ancienne (remplacée par claude_desktop_config.json)
- **Remplacé par:** Context7 MCP dans claude_desktop_config.json
- **Contenu:** Ancienne config MCP

#### **cloudflare.json**
- **Raison:** Config Cloudflare (pas workflow)
- **Remplacé par:** N/A (infra deploy)
- **Contenu:** Cloudflare workers config

#### **project-rules-*.json** (3 fichiers)
- **Raison:** Project rules anciens formats
- **Remplacé par:** Spec-Kit (.specify/memory/constitution.md)
- **Contenu:** Anciennes project rules
- **Fichiers:**
  - AI-powered blog platform
  - E-commerce platform
  - Simple landing page

---

### Fichiers Claude Hooks Obsolètes

#### **claude-hooks-*.json** (5 fichiers)
- **Raison:** Hooks configs anciennes (remplacées par .claude-hooks.json)
- **Remplacé par:** .claude-hooks.json (actuel)
- **Contenu:** Anciennes configs hooks
- **Fichiers:**
  - claude-hooks-blocking-context7.json
  - claude-hooks-real-config.json
  - claude-hooks-smart-context7.json
  - claude-hooks-validation-required.json
  - claude-hooks-with-learning.json

#### **.claude-hooks-validation.json**
- **Raison:** Validation hooks (intégré dans .claude-hooks.json)
- **Remplacé par:** .claude-hooks.json
- **Contenu:** Hooks validation config

#### **setup-context7-hook.js**
- **Raison:** Setup hook Context7 (manuel, remplacé par config JSON)
- **Remplacé par:** .claude-hooks.json + claude_desktop_config.json
- **Contenu:** Setup script Context7

---

### Tests Obsolètes (src/test/, tests/, __tests__, root test-*.js)

**Raison:** Tests ancienne architecture (Archon servers, Gemini bridge, workflows locaux)
**Remplacé par:** N/A (tests infra, pas workflow - GARDER pour dev futur)
**Contenu:** Tests MCP servers, orchestrators, Gemini, GitHub integration

**NOTE:** Ces fichiers sont **INFRASTRUCTURE TESTING**, pas obsolètes workflow.
**DÉCISION:** Les garder dans archive pour référence future, mais ne pas archiver (utiles tests infra).

---

### Templates Obsolètes

#### **templates/SMART-REVIEW-INIT.md**
- **Raison:** Template Smart Review Gemini (workflow abandonné)
- **Remplacé par:** Jules Security Guardian checklist
- **Contenu:** Init Smart Review

---

### Scripts Setup Obsolètes

#### **configure-real-agents.js**
- **Raison:** Config agents anciennes (remplacé par bootstrap)
- **Remplacé par:** /bootstrap (meta-agent pattern)
- **Contenu:** Setup agents manuels

#### **start-for-archon.js**
- **Raison:** Start script Archon servers (architecture équipe)
- **Remplacé par:** N/A (workflow solo sans servers)
- **Contenu:** Démarrage Archon services

#### **scripts/integrate-archon.js**
- **Raison:** Integration script Archon (architecture équipe)
- **Remplacé par:** N/A (workflow solo)
- **Contenu:** Intégration Archon V3

---

### Knowledge Base Auto-Learned Obsolète

#### **knowledge-base/auto-learned/** (11 fichiers JSON)
- **Raison:** Patterns auto-appris ancienne architecture
- **Remplacé par:** Context7 patterns (WORKFLOW-COMPLETE-V3.md)
- **Contenu:** Best practices workflows anciens (Gemini, hooks, validation)
- **NOTE:** Garder quelques patterns génériques (orchestration, RAG)

**Fichiers à archiver:**
- bp_claude-gemini-communication*.json (Gemini abandonné)
- bp_github-jules-async*.json (remplacé par GitHub Actions workflow)
- err_hooks-non-actifs*.json (résolu)
- err_mcp-*.json (résolu)

**Fichiers à GARDER:**
- bp_orchestration-multi-task*.json (patterns génériques)
- bp_rag-auto-learning*.json (patterns génériques)
- wf_archon_orchestrator_6_piliers*.json (référence historique)
- wf_nouveau_projet_setup*.json (référence historique)

---

## ✅ FICHIERS À **GARDER** (Workflow V3 Valides)

### Documentation Essentielle

- ✅ **START-HERE.md** (point d'entrée unique)
- ✅ **CLAUDE.md** (instructions Claude Code)
- ✅ **README.md** (overview projet)
- ✅ **CLAUDE-CODE-CAPACITES-REFERENCE.md** (capacités Sonnet 4.5)

### Documentation Workflow V3

- ✅ **docs/WORKFLOW-COMPLETE-V3.md** (SOURCE DE VÉRITÉ - 85KB complet)
- ✅ **docs/WORKFLOW-CLAUDE-FIRST-JULES-SECURITY.md** (toujours valide - focus multi-client)
- ✅ **docs/WORKFLOW-SOLOPRENEUR-VISION.md** (toujours valide - vision solo)
- ✅ **docs/DESIGN-SYSTEM-SOLO-SIMPLIFIED.md** (toujours valide - design tokens)
- ✅ **docs/JULES-SECURITY-GUARDIAN-SETUP.md** (toujours valide - Jules setup)
- ✅ **docs/MULTI-CLIENT-SETUP-GUIDE.md** (toujours valide - multi-client)
- ✅ **docs/SUB-AGENTS-MASTERY.md** (toujours valide - sub-agents)
- ✅ **docs/AGENTIC-PATTERNS.md** (toujours valide - GATHER → ACTION → VERIFY)
- ✅ **docs/ZERO-TRUST.md** (toujours valide - quality gates)
- ✅ **docs/GOLDEN-PATTERNS.md** (toujours valide - patterns battle-tested)
- ✅ **docs/TROUBLESHOOTING.md** (toujours valide - debug)
- ✅ **docs/DOCKER-GUIDE.md** (toujours valide - si besoin Docker)
- ✅ **docs/ARCHITECTURE-COMPLIANCE-V2.md** (toujours valide - compliance)

### Workflows GitHub Actions Valides

- ✅ **.github/workflows/claude-max-implementation.yml** (PRINCIPAL - production-ready)
- ✅ **.github/security-checklist.md** (checklist Jules)
- ✅ **.github/pull_request_template.md** (template PR)
- ✅ **.github/ISSUE_TEMPLATE/implement-batch.yml** (template issue)

### Configuration Valide

- ✅ **.claude-hooks.json** (hooks actifs)
- ✅ **package.json** (dependencies)
- ✅ **next.config.js** (Next.js config si besoin)
- ✅ **vercel.json** (Vercel deploy si besoin)
- ✅ **jest.config.js** (tests config si besoin)
- ✅ **playwright.config.js** (E2E tests si besoin)

### Claude Agents Valides

- ✅ **.claude/agents/mega-orchestrator-bootstrap.md** (bootstrap meta-agent)
- ✅ **.claude/commands/smart-review.md** (commande smart-review si besoin)
- ✅ **.claude/commands/README.md**
- ✅ **.claude/context/README.md**
- ✅ **.claude/context/templates/context-template.json**

### Knowledge Base Valide

- ✅ **knowledge-base/architecture-best-practices.md**
- ✅ **knowledge-base/auto-learned/bp_orchestration-multi-task*.json** (patterns génériques)
- ✅ **knowledge-base/auto-learned/bp_rag-auto-learning*.json** (patterns génériques)
- ✅ **knowledge-base/auto-learned/wf_*.json** (workflows référence)

### Templates Valides

- ✅ **templates/ARCHITECTURE-TEMPLATE.md**
- ✅ **templates/PROJECT-INIT.md**

### Scripts Utiles (Quality Gates, Validation)

- ✅ **scripts/quality-gate.js** (quality gates validation)
- ✅ **scripts/validate-setup.js** (setup validation)

---

## 📊 STATISTIQUES

| Catégorie | Count | Action |
|-----------|-------|--------|
| **Documentation obsolète** | 8 fichiers .md | Archive |
| **Workflows GitHub Actions obsolètes** | 5 fichiers .yml | Archive (garder jules-security-guardian.yml backup) |
| **Scripts JS obsolètes** | 25+ fichiers .js | Archive |
| **Code source obsolète (src/)** | 40+ fichiers .js | Archive |
| **Config obsolète** | 15+ fichiers .json/.yml | Archive |
| **Tests obsolètes** | 30+ fichiers .js/.spec.js | **GARDER** (infra testing) |
| **Templates obsolètes** | 1 fichier .md | Archive |
| **Knowledge base obsolète** | 7 fichiers .json | Archive (garder 4 génériques) |
| **TOTAL ARCHIVÉ** | **~100 fichiers** | → archive-obsolete-2025-10-07-v3/ |

---

## 🎯 ACTIONS POST-ARCHIVAGE

### 1. Mettre à jour START-HERE.md

- Référencer WORKFLOW-COMPLETE-V3.md comme source principale
- Supprimer références workflows obsolètes
- Ajouter quick start Claude Max + GitHub Actions

### 2. Mettre à jour README.md

- Simplifier overview (workflow V3)
- Supprimer références Archon servers, Gemini bridge
- Ajouter lien WORKFLOW-COMPLETE-V3.md

### 3. Mettre à jour CLAUDE.md

- Référencer WORKFLOW-COMPLETE-V3.md
- Supprimer instructions Archon/Gemini obsolètes
- Clarifier workflow solo vs équipe

### 4. Nettoyer package.json

- Supprimer dependencies Archon servers (si pas utilisées)
- Garder dependencies tests (infra)
- Nettoyer scripts obsolètes

### 5. Créer INDEX.md

- Liste tous fichiers valides workflow V3
- Navigation rapide vers docs essentielles
- Explication structure projet simplifiée

---

## ✅ VALIDATION FINALE

**Avant archivage, vérifier:**
- [ ] WORKFLOW-COMPLETE-V3.md contient TOUT (5 piliers + 2 options + mobile + Context7)
- [ ] claude-max-implementation.yml workflow production-ready
- [ ] START-HERE.md référence workflow V3
- [ ] README.md à jour
- [ ] Aucun fichier workflow V3 dans archive
- [ ] Tests infra NON archivés (garder pour dev)

---

**Archive créée:** 2025-10-07
**Par:** Claude Sonnet 4.5 (orchestrateur)
**Raison:** Transition workflow V3 (Claude Max + Jules + Bootstrap + Design + Context7)
**Statut:** ✅ Complet
