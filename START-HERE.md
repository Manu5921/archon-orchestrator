# 🚀 ARCHON ORCHESTRATOR - START HERE

**Version:** 4.0 (Multi-Device avec Sécurité)
**Date:** 2025-10-08
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
**Mission:** 8-12 clients/semaine avec sécurité garantie

---

## 🎯 WORKFLOW V4 - MULTI-DEVICE

### 📖 **SOURCE DE VÉRITÉ (LIRE EN PREMIER)**

👉 **[docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md](./docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md)** 👈

**Contient TOUT :**
- ✅ **Vision workflow** - Mac 24/7 + monitoring mobile (PAS "mobile-first")
- ✅ **Architecture complète** - Claude Max + GitHub Actions + Jules Security
- ✅ **Setup one-time** - OAuth 5 min + templates + Jules 15 min
- ✅ **Workflow standard** - 30 min planning → 4h implementation → livrable
- ✅ **Multi-projets** - 3-4 simultanés (hybride local + cloud)
- ✅ **Sécurité Jules** - Asynchrone (0 temps supplémentaire)
- ✅ **Métriques & ROI** - €80-100K/mois revenue avec €140/mois coût

**🔴 VISION IMPORTANTE :**
- ✅ **Mac 24/7** (station principale de développement)
- ✅ **Exécution hybride** (local sur Mac OU cloud GitHub Actions)
- ✅ **GitHub systématique** (workflow pro + commits réguliers)
- ✅ **Monitoring multi-device** (Mac + mobile pour suivi/alertes)
- ❌ **PAS "mobile-first"** (Mac peut s'éteindre) - Vision incorrecte archivée

---

## 📚 NAVIGATION RAPIDE

### **Guides Essentiels**

| Je veux... | Lire... | Durée |
|------------|---------|-------|
| **🚀 Workflow complet** | [WORKFLOW-FINAL-V4-MULTI-DEVICE.md](./docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md) | 15 min lecture |
| **📋 Index navigation** | [INDEX-FILES-V4.md](./INDEX-FILES-V4.md) | 5 min |
| **🔑 Setup OAuth** | [CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md](./docs/CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md) | 5 min setup |
| **🔒 Setup Jules** | [JULES-SECURITY-GUARDIAN-SETUP.md](./docs/JULES-SECURITY-GUARDIAN-SETUP.md) | 15 min setup |
| **🛠️ Troubleshooting** | [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Variable |
| **🔧 MCP Setup (pnpm)** | [TROUBLESHOOTING-MCP-PNPM.md](./docs/TROUBLESHOOTING-MCP-PNPM.md) | **5 min** |

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
| **Design tokens** | [DESIGN-SYSTEM-SOLO-SIMPLIFIED.md](./docs/DESIGN-SYSTEM-SOLO-SIMPLIFIED.md) |

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

### **Workflow Standard (4-5h par projet)**

```bash
# PHASE 1: Planning (Mac - 30 min)
cd ~/Documents/DEV/clients
./setup-project.sh nouveau-client
cd nouveau-client

/speckit.constitution  # → .specify/memory/constitution.md
/speckit.specify       # → specs/001-mvp/spec.md
/speckit.plan          # → specs/001-mvp/plan.md
/speckit.tasks         # → specs/001-mvp/tasks.md

git add .specify/ specs/
git commit -m "docs: planning complete"
git push

# PHASE 2: Setup GitHub (1 min - automatisé)
mkdir -p .github/workflows
cp ~/archon-orchestrator/.github/workflows/claude-max-implementation.yml .github/workflows/
echo $CLAUDE_OAUTH_TOKEN | gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo USER/REPO
gh label create run-claude --color "0E8A16"

git add .github/workflows/
git commit -m "feat: add GitHub Actions + Jules Security"
git push

# PHASE 3: Implementation (3-4h - choix selon charge)

# Option A: Local (Mac disponible)
/implement
# → Commits réguliers, Jules scanne async

# Option B: Cloud (parallélisation)
gh issue create \
  --title "Implement MVP - T001-T078" \
  --body "Task range: T001-T078" \
  --label "run-claude"
# → GitHub Actions exécute (cloud VM)
# → Jules scanne async
# → PR créée après 3-4h

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

**Voir détails :** [ARCHIVAGE-RAISONS-V4.md](./archive-obsolete-2025-10-08-v4/ARCHIVAGE-RAISONS-V4.md)

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

**Voir détails migration :** [ARCHIVAGE-RAISONS-V4.md](./archive-obsolete-2025-10-08-v4/ARCHIVAGE-RAISONS-V4.md)

---

## 📞 SUPPORT & RESSOURCES

**Documentation manquante ?**
1. [INDEX-FILES-V4.md](./INDEX-FILES-V4.md) - Navigation rapide
2. [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) - Debug solutions
3. [RETOUR-EXPERIENCE-REVIEWRESCUE.md](./docs/RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md) - Apprentissages

**Guides complets :**
- Setup OAuth : [CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md](./docs/CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md)
- Workflow complet : [WORKFLOW-FINAL-V4-MULTI-DEVICE.md](./docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md)
- Setup Jules : [JULES-SECURITY-GUARDIAN-SETUP.md](./docs/JULES-SECURITY-GUARDIAN-SETUP.md)

---

**Version:** 4.0 (Production-Ready)
**Date:** 2025-10-08
**Status:** ✅ Workflow validé et documenté
**Capacité:** 8-12 clients/semaine, €80-100K/mois revenue

*Objectif: Multi-device (Mac 24/7 + mobile monitoring) avec sécurité garantie* 🚀🔒
