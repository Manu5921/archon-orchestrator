# 🚀 ARCHON-ORCHESTRATOR - Guide Session Claude Code

**Écosystème multi-IA révolutionnaire** : Archon + Orchestra + Jules + GitHub MCP avec Docker deployment et Golden Code Patterns.

---

## ⚡ POINT D'ENTRÉE OBLIGATOIRE

**🚨 AVANT TOUTE ACTION :** Lire **[START-HERE.md](./START-HERE.md)**

Ce fichier est un **index léger** qui référence la documentation complète.

---

## 📚 DOCUMENTATION COMPLÈTE

### 🎯 Guides Principaux
- **[START-HERE.md](./START-HERE.md)** - Point d'entrée session (workflows, checklist)
- **[docs/SETUP-GUIDE.md](./docs/SETUP-GUIDE.md)** - Setup projet, bootstrap Archon
- **[docs/WORKFLOW-GUIDE.md](./docs/WORKFLOW-GUIDE.md)** - Smart Review, Jules, MCP workflows
- **[RESTART-GUIDE-COMPLET.md](./RESTART-GUIDE-COMPLET.md)** - Redémarrage Archon services

### 🆕 v1.2 - Sub-Agents Mastery
- **[docs/AGENTIC-PATTERNS.md](./docs/AGENTIC-PATTERNS.md)** - Patterns natifs Claude 3.7 (GATHER→ACTION→VERIFY)
- **[docs/SUB-AGENTS-MASTERY.md](./docs/SUB-AGENTS-MASTERY.md)** - Guide complet sub-agents orchestration
- **[.claude/context/README.md](./.claude/context/README.md)** - Context injection system usage
- **[WHATS-NEW-v1.2.md](./WHATS-NEW-v1.2.md)** - Release notes v1.2 (agentic capabilities)

### 🛠️ Références Techniques
- **[docs/GOLDEN-PATTERNS.md](./docs/GOLDEN-PATTERNS.md)** - Patterns battle-tested disponibles
- **[docs/DOCKER-GUIDE.md](./docs/DOCKER-GUIDE.md)** - Deployment Docker (30 secondes)
- **[docs/ZERO-TRUST.md](./docs/ZERO-TRUST.md)** - Philosophie confiance zéro + validation
- **[docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Diagnostic + solutions

---

## ⚡ QUICK REFERENCE

### Services Actifs (Ports)
| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Archon UI | 3737 | http://localhost:3737 | Interface projets |
| Archon API | 8181 | http://localhost:8181 | Backend Supabase |
| Archon MCP | 8051 | http://localhost:8051/mcp | FastMCP streaming |
| Orchestra MCP | 3456 | ws://localhost:3456 | WebSocket workflow |
| GitHub MCP | 8054 | http://localhost:8054 | 200+ GitHub tools |
| Jules MCP | 8055 | http://localhost:8055 | Direct Jules comm |
| Gemini Bridge | 7777 | http://127.0.0.1:7777 | Smart Review API |
| Redis | 6379 | localhost:6379 | Persistence layer |

### Commandes Critiques

```bash
# Restart complet Archon (3-4 min)
cd /Users/manu/Documents/DEV/archon-orchestrator && ./restart-archon-complet.sh

# Vérifier services opérationnels
curl -s http://localhost:3737 | head -2     # UI React
curl -s http://localhost:8181/health        # API Backend
curl -s http://localhost:8051/mcp           # MCP Server
curl -s http://localhost:7777/health        # Gemini Bridge

# MCP Health Check
/mcp archon health_check_all
/mcp context7 connection_test
```

### Standards E1-E16 (Résumé)

| Standard | Description |
|----------|-------------|
| **E1** | Architecture-First (ADR documentation) |
| **E2** | Types Anti-Hallucination (TypeScript strict) |
| **E3** | Tests Integration First (TDD strict) |
| **E8** | Quality Gates P0-P4 (Build → Lint → Tests → Docs → Perf) |
| **E11** | Error Escalation (3-strike rule + rollback) |
| **E16** | Zero Trust (preuves obligatoires) |

**Détails complets :** [docs/SETUP-GUIDE.md § Standards](./docs/SETUP-GUIDE.md)

---

## 🎯 WORKFLOWS ESSENTIELS

### Nouveau Projet Spec-Kit

```bash
# 1. Init Spec-Kit + Archon
uvx --from git+https://github.com/github/spec-kit.git specify init myproject
cd myproject

# 2. Bootstrap Archon (voir docs/SETUP-GUIDE.md)
curl -sSL https://archon-template.sh | bash

# 3. Workflow complet
/specify → /clarify → /plan → /tasks → /archon-init
```

**Guide complet :** [docs/SETUP-GUIDE.md](./docs/SETUP-GUIDE.md)

---

### Smart Review Workflow

```bash
# Smart Review avec context preparation
/mcp archon smart_review_workflow code="./src/auth.js"
                                 task="User Authentication Service"
                                 requirements="Secure JWT + validation"
```

**Guide complet :** [docs/WORKFLOW-GUIDE.md § Smart Review](./docs/WORKFLOW-GUIDE.md)

---

### 🆕 Sub-Agents Orchestration (v1.2)

```bash
# 1. Générer context pour sub-agent
./scripts/prepare-agent-context.sh design-specialist "Create auth wireframes"

# 2. Déléguer avec context injection (dans prompt)
# @design-specialist, create wireframes.
# **CONTEXT:** Read `.claude/context/design-specialist-context.json`

# 3. Validation automatique SubagentStop hook
# Hook valide report format + artifacts avant handoff

# 4. Patterns agentic natifs (GATHER → ACTION → VERIFY)
# Agents auto-loop jusqu'à critères satisfaits
```

**Guides complets :**
- [docs/AGENTIC-PATTERNS.md](./docs/AGENTIC-PATTERNS.md) - Patterns natifs
- [docs/SUB-AGENTS-MASTERY.md](./docs/SUB-AGENTS-MASTERY.md) - Orchestration complète
- [.claude/context/README.md](./.claude/context/README.md) - Context injection

---

### Validation Continue (Zero Trust)

```bash
# APRÈS chaque modification majeure
pnpm run build 2>&1 | tee build.log  # OBLIGATOIRE
pnpm run test 2>&1 | tee test.log
pnpm run lint 2>&1 | tee lint.log
/mcp archon validate_code_quality project_id="latest"
```

**Philosophie complète :** [docs/ZERO-TRUST.md](./docs/ZERO-TRUST.md)

---

## 🚨 TROUBLESHOOTING RAPIDE

### Services ne démarrent pas
→ [RESTART-GUIDE-COMPLET.md](./RESTART-GUIDE-COMPLET.md)

### MCP ne répond pas
→ [docs/TROUBLESHOOTING.md § MCP](./docs/TROUBLESHOOTING.md)

### Build échoue
→ [docs/ZERO-TRUST.md § Validation](./docs/ZERO-TRUST.md)

---

## 🎯 COMMANDES MCP ESSENTIELLES

### Synchronisation Projet

```bash
# Raccourci mise à jour complète
/mcp archon MAJ

# Commandes détaillées
/mcp archon sync_project_files project_id="latest"
/mcp archon update_tasks_status project_id="latest"
/mcp archon create_version field_name="docs" change_summary="[description]"
```

### Validation Qualité

```bash
/mcp archon audit_best_practices standards="E1,E2,E3,E8"
/mcp archon validate_code_quality project_id="latest"
/mcp archon quality_gates_check gates="P0,P1,P2,P3,P4"
```

**Liste complète :** [docs/WORKFLOW-GUIDE.md § MCP Commands](./docs/WORKFLOW-GUIDE.md)

---

## 📊 INNOVATIONS CLÉS

- 🏆 **Golden Code Patterns** - Battle-tested (9.8-9.9/10 health scores)
- 🐳 **Docker Deployment** - 30 secondes setup
- 🔄 **Hybrid Jules Workflow** - 0ms latency communication
- 🎨 **Smart Review Phase 1** - Context-aware Gemini reviews
- 📊 **Full Monitoring** - Health checks + logs + metrics

**Détails complets :** [docs/WORKFLOW-GUIDE.md](./docs/WORKFLOW-GUIDE.md)

---

## ✅ CHECKLIST SESSION DÉMARRAGE

**Avant de commencer travail** :

- [ ] Lu [START-HERE.md](./START-HERE.md) (workflows session)
- [ ] Vérifié services : `curl http://localhost:3737`
- [ ] Vérifié MCP : `/mcp archon health_check_all`
- [ ] Lu guide approprié selon tâche (setup/workflow/troubleshooting)

---

## 🔗 NAVIGATION RAPIDE

| Je veux... | Lire... |
|------------|---------|
| Démarrer session | [START-HERE.md](./START-HERE.md) |
| Setup nouveau projet | [docs/SETUP-GUIDE.md](./docs/SETUP-GUIDE.md) |
| Utiliser Smart Review | [docs/WORKFLOW-GUIDE.md](./docs/WORKFLOW-GUIDE.md) |
| Restart Archon | [RESTART-GUIDE-COMPLET.md](./RESTART-GUIDE-COMPLET.md) |
| Résoudre problème | [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) |
| Comprendre patterns | [docs/GOLDEN-PATTERNS.md](./docs/GOLDEN-PATTERNS.md) |
| Déployer Docker | [docs/DOCKER-GUIDE.md](./docs/DOCKER-GUIDE.md) |

---

**Version:** 2.0 (Optimisé Performance - <10 KB)
**Date:** 2025-10-04
**Taille:** ~8 KB (vs 43.9 KB précédent)

*Cette session transforme Archon d'un prototype vers une plateforme industrielle !*
