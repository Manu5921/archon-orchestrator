# 🚀 ARCHON ORCHESTRATOR - START HERE

**Version:** 6.1.3 (Observability Complete + Full Automation)
**Date:** 2025-10-17
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) + Haiku 4.5 for sub-agents
**Mission:** 8-12 clients/semaine avec qualité garantie + observability complète

---

## 🎯 WORKFLOW V6.1.3 - COMPLETE OBSERVABILITY

### 📖 **SOURCE DE VÉRITÉ (LIRE EN PREMIER)**

👉 **[docs/WORKFLOW-V6-MVP.md](./docs/WORKFLOW-V6-MVP.md)** 👈

**Contient TOUT :**
- ✅ **Vision workflow** - Mac 24/7 + automation complète + observability timeline
- ✅ **Architecture complète** - Claude Sonnet 4.5 + Haiku 4.5 sub-agents + Zen MCP
- ✅ **Setup one-time** - MCP Context7 + ESLint (5 min)
- ✅ **Workflow standard** - 30 min planning → 2h45-3h implementation → livrable
- ✅ **5 Quality Gates** - Build P0 + Lint P1 + Context7 P2 + Memory P3 + **Observability P4** 🆕
- ✅ **Observability complète** - pulseLogger.cjs CLI + viewPulse.sh viewer + timeline JSONL
- ✅ **Token Savings** - -77% implementation avec GLM-4.6 (450K→100K)
- ✅ **Métriques & ROI** - €80-100K/mois revenue avec €140/mois coût

**🔴 VISION IMPORTANTE V6.1.3 :**
- ✅ **Mac 24/7** (station principale de développement)
- ✅ **Full Automation** (`/speckit.final` - 0 manual copy-paste)
- ✅ **Complete Observability** (pulseLogger.cjs + viewPulse.sh + observability-pulse.jsonl)
- ✅ **5 Quality Gates ENFORCED** (Build P0 + Lint P1 + Context7 P2 + Memory P3 + Observability P4)
- ✅ **Agent Coordination** (agents read pulse timeline → know what's completed)
- ✅ **Token Savings** (-77% implementation with GLM-4.6)
- ❌ **PAS "mobile-first"** - Mac LOCAL = 99% development

---

## 📚 NAVIGATION RAPIDE

### **Guides Essentiels**

| Je veux... | Lire... | Durée |
|------------|---------|-------|
| **🚀 Workflow complet V6** | [WORKFLOW-V6-MVP.md](./docs/WORKFLOW-V6-MVP.md) | 15 min lecture |
| **📊 Observability V6.1.3** | [changelogs/V6.1.3/CHANGELOG-V6.1.3-OBSERVABILITY.md](./changelogs/V6.1.3/CHANGELOG-V6.1.3-OBSERVABILITY.md) | 5 min |
| **📋 Index navigation** | [INDEX.md](./INDEX.md) | 5 min |
| **🔧 MCP Setup** | [docs/MCP-SETUP-GUIDE.md](./docs/MCP-SETUP-GUIDE.md) | 5 min |
| **🛠️ Troubleshooting** | [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Variable |
| **📚 Golden Patterns** | [GOLDEN-PATTERNS.md](./docs/GOLDEN-PATTERNS.md) | 10 min |

---

## ⚠️ IMPORTANT : MCP Setup avec pnpm

**Si `/mcp` affiche "No MCP servers configured" :**

**❌ NE PAS** éditer `.claude/mcp.json` manuellement (perte de temps garantie)

**✅ TOUJOURS** utiliser CLI :

```bash
# Setup MCP (2 minutes)
claude mcp add context7 "pnpm" "dlx" "@upstash/context7-mcp" \
  -e "CONTEXT7_API_KEY=votre-clé" --scope user

claude mcp add eslint "pnpm" "dlx" "@eslint/mcp@latest" --scope user

# Vérifier
claude mcp list
# → context7: ✓ Connected
# → eslint: ✓ Connected

# Redémarrer Claude Code (Cmd+Q puis relancer)
```

**Détails complets :** [docs/TROUBLESHOOTING-MCP-PNPM.md](./docs/TROUBLESHOOTING-MCP-PNPM.md)

**Leçon apprise (coût réel 3-4h) :** Claude Code utilise state global (`~/.claude.json`), pas config files.

---

### **Guides Techniques**

| Sujet | Fichier |
|-------|---------|
| **Patterns agents** | [AGENTIC-PATTERNS.md](./docs/AGENTIC-PATTERNS.md) |
| **Orchestration sub-agents** | [SUB-AGENTS-MASTERY.md](./docs/SUB-AGENTS-MASTERY.md) |
| **Quality gates** | [ZERO-TRUST.md](./docs/ZERO-TRUST.md) |
| **Best practices** | [GOLDEN-PATTERNS.md](./docs/GOLDEN-PATTERNS.md) |
| **Design tokens** | [GOLDEN-PATTERNS.md](./docs/GOLDEN-PATTERNS.md) (section Design/Dev Decoupling) |

---

## 🚀 QUICK START NOUVEAU PROJET

### **Prérequis (One-Time Setup - 20 min)**

```bash
# 1. Claude Max OAuth (5 min)
# Dans Claude Desktop :
/install-github-app
# → Copier token affiché

# 2. Sauvegarder token (réutilisable)
echo 'export CLAUDE_OAUTH_TOKEN="ghp_xxxxx"' >> ~/.zshrc
source ~/.zshrc

# 3. Setup Jules Security (15 min)
npm install -g jules-security-cli
# OU déployer Jules sur Google Cloud Run
# Voir: docs/JULES-SECURITY-GUARDIAN-SETUP.md
```

**Documentation :** [CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md](./docs/CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md)

---

### **Workflow Standard V6.1.3 (4-5h par projet)**

```bash
# PHASE 0: Multi-IA Roundtable (30-45 min - OPTIONAL)
/zen-roundtable "Brief: [project description]"
# → analysis-multi-ia.md + prompt-constitution.md + prompt-specify.md

# PHASE 1: Planning (Mac - 30-35 min)
cd ~/Documents/DEV/clients
mkdir nouveau-client && cd nouveau-client
git init

/speckit.constitution  # → constitution.md (60-90s)
/speckit.specify       # → spec.md (90-120s)
/speckit.init          # → CLAUDE.md + project-memory.md + ci-template.yml
/speckit.design        # → design-tokens.json + wireframes (⭐ NEVER SKIP)
/speckit.plan          # → plan.md (architecture)
/speckit.tasks         # → tasks.md (50-100 tasks checkboxes)
/speckit.agents        # → ORCHESTRATION.md (sub-agents strategy)

git add .
git commit -m "docs: planning complete V6.1.3"
git push

# PHASE 2: GitHub Setup (2 min - CLAUDE.md guided)
git checkout -b feat/mvp
git add .
git commit -m "feat: init MVP structure

- Constitution + Spec + Design system
- ORCHESTRATION.md with 3 agents
- Tasks breakdown (50-100 tasks)

🤖 Generated with Claude Code V6.1.3
Co-Authored-By: Claude <noreply@anthropic.com>"
git push -u origin feat/mvp
gh pr create --title "feat: MVP Implementation" --body "..."

# PHASE 3: Implementation (2h45-3h) ⭐ V6.1.3 FULL AUTOMATION
/speckit.final
# V6.1.3 - Complete automation + observability:
# → Lit ORCHESTRATION.md + CLAUDE.md automatiquement ✅
# → Lance 3 agents séquentiellement (backend → frontend → testing) ✅
# → Checkpoints every 10 tasks (5 gates: Build P0 + Lint P1 + Context7 P2 + Memory P3 + Observability P4) ✅
# → Timeline logging (observability-pulse.jsonl) ✅
# → Auto-documentation (project-memory.md) ✅
#
# Validated: 2h45 on AdProof.ai (99 tasks, 150+ files)
# Token savings: -77% with GLM-4.6 (450K→100K)

# PHASE 4: Review + Merge (15 min - Mac OU mobile)

# Sur Mac:
gh pr list
gh pr view 1
gh pr diff 1
# Vérifier checks: ✅ Implementation + ✅ Security (Jules 94/100)
gh pr review 1 --approve
gh pr merge 1 --squash

# OU sur mobile (convenience):
# GitHub app → PR → Files changed → Approve → Merge
```

---

## 🔄 MULTI-PROJETS SIMULTANÉS (3-4 projets)

**Stratégie Hybride :**

```bash
# Lundi matin - Setup 4 projets

# Projet 1 (Cloud)
cd client1 && git push
gh issue create --label run-claude --body "Task range: T001-T080"
# → GitHub Actions démarre (3-4h)

# Projet 2 (Cloud)
cd ../client2 && git push
gh issue create --label run-claude --body "Task range: T001-T050"
# → GitHub Actions démarre (2-3h)

# Projet 3 (Cloud)
cd ../client3 && git push
gh issue create --label run-claude --body "Task range: T001-T060"
# → GitHub Actions démarre (3h)

# Projet 4 (Local Mac)
cd ../client4 && /implement
# → Exécution locale (3h)

# Lundi 14h : 4 PRs créées
# → Review (15 min × 4 = 1h)
# → Merge
# → 4 clients livrés en 1 journée ! 🚀
```

**Capacité :**
- **Par jour :** 4 projets (2 cloud + 2 local)
- **Par semaine :** 8-12 projets
- **Par mois :** 32-40 projets

**Documentation :** [WORKFLOW-FINAL-V4-MULTI-DEVICE.md](./docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md) (section Multi-Projets)

---

## 📱 MONITORING MULTI-DEVICE

### **Mac (Principal)**

**Terminal toujours ouvert :**
```bash
# Voir tous projets en cours
gh run list --repo USER/client1 --limit 1
gh run list --repo USER/client2 --limit 1

# Suivre projet spécifique
gh run watch --repo USER/client1
```

---

### **Mobile (Monitoring + Convenience)**

**GitHub App Android :**
1. **Dashboard** - Voir tous repos actifs, notifications
2. **Actions** - Workflows en cours, logs, cancel/rerun
3. **PRs** - Files changed, Jules Security Report, approve + merge

**Cas d'usage :**
- ☕ Café : Voir progression workflows
- 🚗 Transport : Consulter logs si build failed
- 🏖️ Pause : Approve PR si client urgent
- 🌙 Soir : Vérifier que tous workflows terminés

**PAS "mobile-first"** - Mobile = monitoring/convenience, Mac = development principal

---

## 🔒 SÉCURITÉ JULES ASYNCHRONE

### **Integration Automatique**

**Workflow GitHub Actions :**
```
Claude Implementation (3-4h)
    ↓ (parallèle)
Jules Security Scan (10-15 min async)
    ↓
PR créée avec 2 checks:
  ✅ Implementation complete
  ✅ Security scan passed (94/100)
```

**Rapport Jules dans PR :**
- ✅ OWASP Top 10 compliance
- ✅ CVE scan (dependencies)
- ✅ RGPD compliance
- ✅ Secrets detection
- ✅ Score 94/100

**Livrable client :**
- ✅ Code fonctionnel
- ✅ Security Report inclus
- ✅ OWASP + CVE + RGPD validés

**Documentation :** [JULES-SECURITY-GUARDIAN-SETUP.md](./docs/JULES-SECURITY-GUARDIAN-SETUP.md)

---

## 📊 MÉTRIQUES & ROI

### **Coûts Infrastructure**

| Service | Coût/Mois |
|---------|-----------|
| Claude Max | €100 (illimité) |
| GitHub Actions | €0-40 (2,000 min free) |
| Jules Security | €0 (Gemini gratuit) |
| **Total** | **€100-140** |

---

### **Revenue Potentiel**

**Capacité :** 32-40 projets/mois × €2,500 = **€80-100K/mois**

**ROI infrastructure :**
- €80K / €140 = **×571**
- €100K / €140 = **×714** 🚀

---

### **Différenciation Marché**

**Votre offre :**
- MVP : 4h (vs 2-3 jours concurrence)
- Sécurité incluse (vs audit externe €1,500)
- Prix : €2,500 (vs €4,500 concurrence)
- Livrable : Code + Security Report

**Avantage :**
- ⏱️ **12× plus rapide**
- 💰 **44% moins cher**
- 🔒 **Sécurité garantie**

---

## 🗂️ FICHIERS ARCHIVÉS (V3)

**Fichiers obsolètes (2025-10-08) :**
```
archive-obsolete-2025-10-08-v4/
├── WORKFLOW-COMPLETE-V3.md                      ❌ Vision "mobile-first" incorrecte
├── WORKFLOW-CLAUDE-FIRST-JULES-SECURITY.md      ❌ Redondant avec V4
├── WORKFLOW-SOLOPRENEUR-VISION.md               ❌ Vision "solopreneur" obsolète
└── MULTI-CLIENT-SETUP-GUIDE.md                  ❌ Setup complexe obsolète
```

**Raison archivage :** Clarification vision (multi-device Mac 24/7, pas mobile-first)

**Note:** Archive folder supprimé après migration V4 complète (workflow V3 obsolète documenté dans CHANGELOGs)

---

## ✅ CHECKLIST DÉMARRAGE

### **Setup Initial (One-Time)**
- [ ] Claude Max abonnement actif (€100/mois)
- [ ] OAuth token généré (`/install-github-app`)
- [ ] Jules Security setup (CLI OU cloud webhook)
- [ ] Templates créés (`~/Documents/DEV/clients/_templates/`)
- [ ] GitHub CLI authentifié (`gh auth status`)

### **Premier Projet**
- [ ] Lire [WORKFLOW-FINAL-V4-MULTI-DEVICE.md](./docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md)
- [ ] Planning Spec-Kit (constitution → specify → plan → tasks)
- [ ] Setup GitHub Actions (workflow + secret + label)
- [ ] Test implementation (local OU cloud)
- [ ] Vérifier PR avec 2 checks (code + security)

---

## 🚀 ÉVOLUTION V3 → V4

**Changements Majeurs :**

| Aspect | V3 (Obsolète) | V4 (Actuel) |
|--------|---------------|-------------|
| **Vision** | "Mobile-first" | Multi-device (Mac 24/7) |
| **Device principal** | Mobile | Mac |
| **GitHub** | Optionnel | Systématique |
| **Exécution** | Cloud uniquement | Hybride (local + cloud) |
| **Sécurité** | Séquentiel | Asynchrone (0 temps) |
| **Capacité** | 1 projet | 3-4 simultanés |

**Migration complète:** V4 opérationnel depuis 2025-10-06, V3 complètement remplacé

---

## 📞 SUPPORT & RESSOURCES

**Documentation manquante ?**
1. [INDEX.md](./INDEX.md) - Navigation rapide (index complet des fichiers)
2. [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) - Debug solutions
3. [RETOUR-EXPERIENCE-REVIEWRESCUE.md](./docs/RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md) - Apprentissages

**Guides complets :**
- Setup OAuth : [CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md](./docs/CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md)
- Workflow complet : [WORKFLOW-FINAL-V4-MULTI-DEVICE.md](./docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md)
- Setup Jules : [JULES-SECURITY-GUARDIAN-SETUP.md](./docs/JULES-SECURITY-GUARDIAN-SETUP.md)

---

**Version:** 6.1.3 (Observability Complete + Full Automation)
**Date:** 2025-10-17
**Status:** ✅ Production Ready + Observability Complete
**Capacité:** 8-12 clients/semaine, €80-100K/mois revenue

**🆕 V6.1.3 - Features:**
- **Gate P4 Observability** - pulseLogger.cjs CLI + viewPulse.sh viewer + observability-pulse.jsonl JSONL
- **Complete Automation** - `/speckit.final` (0 manual copy-paste)
- **5 Quality Gates ENFORCED** - Build P0 + Lint P1 + Context7 P2 + Memory P3 + Observability P4
- **Agent Coordination** - Timeline tracking enables multi-agent sync
- **Token Savings** - -77% implementation (GLM-4.6: 450K→100K)
- **Validated** - AdProof.ai MVP (99 tasks, 2h45, 150+ files)

*Objectif: Mac LOCAL 99% + Full Automation + Complete Observability = Production MVPs at AI Speed* 🚀🔒📊
