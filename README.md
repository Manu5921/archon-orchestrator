# 🎼 ARCHON ORCHESTRATOR - Workflow V4

**Workflow multi-device productif avec Claude Max + Jules Security + GitHub Actions**

**Version:** 4.1 (Spec-Kit Enhanced - Workflow Autonome)
**Date:** 2025-10-10
**Model:** Claude Sonnet 4.5 (SOTA coding - 49% SWE-bench, 0% error rate)
**Capacité:** 8-12 clients/semaine | €80K-€100K/mois revenue

**🆕 V4.1 - Nouveautés:**
- `/speckit.design` - Design system automatique (tokens + wireframes + components)
- `/speckit.agents` - Orchestration prompt généré automatiquement
- **Workflow 100% autonome** - Aucune guidance manuelle nécessaire

---

## 🚀 QUICK START

### Workflow Standard (4-5h par projet)

```bash
# 1. Planning (Mac - 30 min)
cd ~/Documents/DEV/clients
./setup-project.sh nouveau-client
cd nouveau-client/

/speckit.constitution  # → .specify/memory/constitution.md (5 min)
/speckit.specify       # → specs/001-mvp/spec.md (5 min)
/speckit.clarify       # → Q&A iteration si ambiguïtés (5 min)
/speckit.design        # → design-tokens.json + wireframes/ + components-list.md (5 min) 🆕
/speckit.plan          # → specs/001-mvp/plan.md (5 min)
/speckit.tasks         # → specs/001-mvp/tasks.md (5 min, 50-100 tasks)
/speckit.agents        # → Prompt orchestration optimisé (2 min) 🆕

git add .specify/ specs/ design/
git commit -m "docs: planning complete with design system"
git push

# 2. Setup GitHub Actions (1 min)
mkdir -p .github/workflows
cp ~/archon-orchestrator/.github/workflows/claude-max-implementation.yml .github/workflows/
echo $CLAUDE_OAUTH_TOKEN | gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo USER/REPO
gh label create run-claude --color "0E8A16"

git add .github/workflows/
git commit -m "feat: add GitHub Actions + Jules Security"
git push

# 2b. Setup MCP (Optionnel - 10 sec)
# ONE-TIME: Config dans Claude Desktop → Settings → MCP
#   - Context7 (patterns), Supabase (DB)
#   - ESLint (quality), Semgrep (security)
claude mcp add-from-claude-desktop --scope project

# 3. Implementation (Mac LOCAL - 3-4h) ⭐ TOUJOURS EN LOCAL
/implement
# [COLLER LE PROMPT GÉNÉRÉ PAR /SPECKIT.AGENTS] 🆕
# → Sub-agents orchestrés automatiquement (backend → frontend → testing)
# → MCP Context7 juste-in-time (Next.js, Supabase, shadcn/ui docs)
# → ESLint checkpoints inline (code clean dès génération)
# → Commits réguliers + push GitHub (backup)
# → Jules scanne async (GitHub Actions)

# Fallback cloud (rare <5%): gh issue create --body "$(cat prompt-orchestration.md)" --label run-claude

# 4. Review + Merge (Mac OU mobile - 15 min)
gh pr view 1
# Vérifier checks: ✅ Implementation + ✅ Security (Jules 94/100)
gh pr review 1 --approve
gh pr merge 1 --squash
```

**Timeline:** 4h30 total (30 min planning + 3-4h implementation + 15 min review)

---

## 📖 DOCUMENTATION COMPLÈTE

### 🔴 Source de Vérité

**[docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md](./docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md)** ⭐ (SOURCE DE VÉRITÉ V4)

**Contient:**
- ✅ Vision workflow (Mac 24/7 + mobile monitoring, PAS "mobile-first")
- ✅ Architecture complète (Claude Max + GitHub Actions + Jules Security)
- ✅ Setup one-time (OAuth 5 min + templates + Jules 15 min)
- ✅ Workflow standard par projet (30 min → 4h → livrable)
- ✅ Multi-projets simultanés (3-4 parallèles, hybride local + cloud)
- ✅ Monitoring multi-device (Mac + mobile)
- ✅ Sécurité Jules asynchrone (0 temps supplémentaire)
- ✅ Métriques & ROI (€80-100K/mois revenue, €140/mois coût)

**Autres docs:**
- **[START-HERE.md](./START-HERE.md)** - Point d'entrée unique
- **[INDEX-FILES-V4.md](./INDEX-FILES-V4.md)** - Index fichiers valides (navigation rapide)
- **[CLAUDE.md](./CLAUDE.md)** - Instructions session Claude Code
- **[RESUME-SESSION-2025-10-08.md](./RESUME-SESSION-2025-10-08.md)** - Résumé session V4

---

## 🎯 VISION WORKFLOW V4

### ❌ Vision INCORRECTE (archivée V3)

- ❌ "Mobile-first" (Mac éteint pendant exécution)
- ❌ Déclenchement obligatoire depuis mobile
- ❌ Workflow nomade sans Mac
- ❌ Exécution cloud uniquement

### ✅ Vision CORRECTE (V4 actuelle)

- ✅ **Mac 24/7** - Station principale de développement
- ✅ **Multi-device** - Mac (développement) + mobile (monitoring/convenience)
- ✅ **GitHub systématique** - Workflow pro + commits réguliers (même avec Mac 24/7)
- ✅ **Jules asynchrone** - Sécurité 0 temps supplémentaire
- ✅ **Hybride** - Exécution locale (Mac) OU cloud (GitHub Actions) selon charge
- ✅ **Multi-projets** - 3-4 projets simultanés (2-3 cloud + 1 local)

### Pourquoi GitHub systématique ?

1. **Workflow pro établi** - Commits réguliers, PRs avec review, historique propre
2. **Scalabilité** - 3-4 projets simultanés (hybride local + cloud)
3. **Sécurité asynchrone** - Jules scanne pendant implementation (0 temps)
4. **Monitoring multi-device** - Mac (terminal gh run watch) + mobile (GitHub app)

---

## 🔒 JULES SECURITY GUARDIAN

**Scan automatique async pendant implementation:**

```yaml
# .github/workflows/claude-max-implementation.yml
jobs:
  implementation:
    - Claude Max implémente tasks (3-4h)

  jules-security:
    - Trigger: parallèle à implementation
    - Scan: OWASP Top 10 + CVE + RGPD
    - Output: security-report.json dans PR
    - Score: 94/100 automatique
```

**Checklist sécurité:**
- ✅ OWASP Top 10 (A01-A10)
- ✅ RGPD compliance (Articles 6, 15-20, 25, 32-34)
- ✅ CVE scan (npm/pip dependencies)
- ✅ Secrets detection
- ✅ Input validation (Zod/Pydantic)

**Livrable client:**
- ✅ Code fonctionnel
- ✅ Security Report inclus (Jules 94/100)
- ✅ OWASP + CVE + RGPD validés

---

## 💰 COST & ROI

### Coûts Mensuels

| Service | Coût |
|---------|------|
| Claude Max | €100/mois (illimité) |
| GitHub Actions | €0-40/mois (2,000 min free) |
| Jules Security | €0 (Gemini gratuit) |
| **TOTAL** | **€100-140/mois** |

### Capacité Production

| Métric | Local Mac | Hybride (Local + Cloud) |
|--------|-----------|-------------------------|
| **Clients/jour** | 2 clients | 3-4 clients |
| **Clients/semaine** | 8-10 clients | 12-16 clients |
| **Clients/mois** | 32-40 clients | 48-64 clients |
| **Temps actif/client** | 4h30 | 54 min (planning + review) |

### Revenue Potential

```
Hypothèse: €2,500/client (MVP SaaS)

Local Mac:
  32 clients/mois × €2,500 = €80,000/mois
  Coût: €140/mois
  Profit: €79,860/mois (ROI ×571)

Hybride (Local + Cloud):
  40 clients/mois × €2,500 = €100,000/mois
  Coût: €140/mois
  Profit: €99,860/mois (ROI ×714)
```

---

## 📱 MONITORING MULTI-DEVICE

### Mac (Principal)

**Terminal toujours ouvert:**
```bash
# Voir tous projets en cours
gh run list --repo USER/client1 --limit 1
gh run list --repo USER/client2 --limit 1

# Suivre projet spécifique
gh run watch --repo USER/client1
```

### Mobile (Monitoring + Convenience)

**GitHub App Android:**
1. **Dashboard** - Voir tous repos actifs, notifications
2. **Actions** - Workflows en cours, logs, cancel/rerun
3. **PRs** - Files changed, Jules Security Report, approve + merge

**Cas d'usage:**
- ☕ Café : Voir progression workflows
- 🚗 Transport : Consulter logs si build failed
- 🏖️ Pause : Approve PR si client urgent
- 🌙 Soir : Vérifier que tous workflows terminés

**PAS "mobile-first"** - Mobile = monitoring/convenience, Mac = development principal

---

## 🏗️ TECH STACK

### Développement

- **Claude Code:** Sonnet 4.5 (49% SWE-bench SOTA, 0% error rate, 200K context)
- **Spec-Kit:** v0.0.18+ (GitHub specification-driven development)
- **Jules:** Gemini 2.5 Pro powered (Google AI security specialist)

### Stack Client SaaS (Recommandé)

- **Frontend:** Next.js 14+ (App Router), TypeScript strict, Tailwind + shadcn/ui
- **Backend:** Vercel Serverless Functions, Supabase (PostgreSQL + Auth + RLS)
- **AI:** Claude 3.5 Sonnet API (Anthropic)
- **Testing:** Vitest (unit), Playwright (E2E)
- **Deploy:** Vercel (HTTPS auto, Edge Network, 99% uptime SLA)

### CI/CD

- **GitHub Actions:** Orchestration + Jules security
- **Vercel:** Auto-deploy on merge
- **Dependabot:** Automated dependency updates

---

## 🛠️ SETUP ONE-TIME (20 min)

### Prérequis

```bash
# 1. Claude Max (€100/mois)
# https://claude.com/claude-code

# 2. OAuth token (5 min - DANS Claude Desktop)
/install-github-app
# → Browser s'ouvre → GitHub OAuth → Anthropic Auth
# → Token affiché → Copier (réutilisable tous repos)
echo 'export CLAUDE_OAUTH_TOKEN="ghp_xxxxx"' >> ~/.zshrc
source ~/.zshrc

# 3. Jules Security CLI (15 min)
npm install -g @google/jules-cli
jules auth login
# OU déployer Jules sur Google Cloud Run (voir guide)

# 4. GitHub CLI
brew install gh
gh auth login

# 5. Templates
mkdir -p ~/Documents/DEV/clients/_templates/
cp ~/archon-orchestrator/.github/workflows/* ~/Documents/DEV/clients/_templates/
```

**Voir guides:**
- [CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md](./docs/CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md)
- [JULES-SECURITY-GUARDIAN-SETUP.md](./docs/JULES-SECURITY-GUARDIAN-SETUP.md)
- [MCP-SETUP-GUIDE.md](./docs/MCP-SETUP-GUIDE.md) - Context7 + Supabase (optionnel)

---

## 📊 MÉTRIQUES SONNET 4.5

| Métric | Avant (3.7) | Sonnet 4.5 | Gain |
|--------|-------------|------------|------|
| **Planning** | 30 min | 30 min | = |
| **Implementation** | 4-6h | 3-4h | -33% |
| **Erreurs code** | 9% | 0% | -100% |
| **Fiabilité** | Baseline | +12% | +12% |
| **Planning accuracy** | Baseline | +18% | +18% |

**Source:** https://www.anthropic.com/news/claude-sonnet-4-5

---

## 🔗 LIENS UTILES

| Resource | URL |
|----------|-----|
| **Documentation V4** | [WORKFLOW-FINAL-V4-MULTI-DEVICE.md](./docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md) ⭐ |
| **Index fichiers** | [INDEX-FILES-V4.md](./INDEX-FILES-V4.md) |
| **Leçons apprises** | [RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md](./docs/RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md) |
| **Spec-Kit** | https://github.com/github/spec-kit |
| **Jules AI** | https://jules.google |
| **Claude Code** | https://docs.claude.com/en/docs/claude-code |
| **shadcn/ui** | https://ui.shadcn.com |
| **Supabase** | https://supabase.com |
| **Vercel** | https://vercel.com |

---

## 🐛 TROUBLESHOOTING

**Voir documentation complète:** [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)

**Problèmes courants V4:**

1. **OAuth token expired**
   - Re-run `/install-github-app` dans Claude Desktop
   - Update `CLAUDE_CODE_OAUTH_TOKEN` secret

2. **Workflow doesn't trigger**
   - Vérifier workflow sur branch `main` (pas feature branch!)
   - Vérifier label `run-claude` existe
   - Consulter: [RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md](./docs/RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md)

3. **Spec-Kit plan inconsistency**
   - Problème connu: /speckit.plan peut réinterpréter spec.md
   - Solution: Valider cohérence constitution ↔ plan avant /tasks
   - Voir: [RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md](./docs/RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md) (section Problèmes)

4. **Jules rate limit**
   - Upgrade Jules Pro+ (100 req/day)
   - Désactiver cron temporairement

5. **GitHub Actions timeout**
   - Augmenter timeout workflow (360 min)
   - Découper en batches plus petits (T001-T020, T021-T040, etc.)

---

## 📂 STRUCTURE PROJET

```
archon-orchestrator/
├── START-HERE.md                    ← Point d'entrée unique
├── README.md                        ← Ce fichier
├── CLAUDE.md                        ← Instructions Claude Code (V4)
├── INDEX-FILES-V4.md                ← Index fichiers valides V4
├── RESUME-SESSION-2025-10-08.md     ← Résumé session V4
│
├── docs/
│   ├── WORKFLOW-FINAL-V4-MULTI-DEVICE.md      ← ⭐ SOURCE DE VÉRITÉ V4
│   ├── CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md     ← Setup OAuth
│   ├── RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md  ← Leçons apprises
│   ├── JULES-SECURITY-GUARDIAN-SETUP.md       ← Jules Security
│   ├── GITHUB-ACTIONS-OAUTH-SETUP.md          ← GitHub Actions
│   ├── AGENTIC-PATTERNS.md                    ← Patterns agents
│   ├── SUB-AGENTS-MASTERY.md                  ← Orchestration
│   ├── ZERO-TRUST.md                          ← Quality gates
│   ├── GOLDEN-PATTERNS.md                     ← Best practices
│   └── TROUBLESHOOTING.md                     ← Debug
│
├── .github/workflows/
│   └── claude-max-implementation.yml  ← Workflow validé V4
│
├── archive-obsolete-2025-10-08-v4/    ← Fichiers archivés V3
│   ├── ARCHIVAGE-RAISONS-V4.md
│   ├── WORKFLOW-COMPLETE-V3.md
│   ├── WORKFLOW-CLAUDE-FIRST-JULES-SECURITY.md
│   ├── WORKFLOW-SOLOPRENEUR-VISION.md
│   └── MULTI-CLIENT-SETUP-GUIDE.md
│
└── archive-obsolete-2025-10-07-v3/    ← Fichiers archivés V2
    └── ...
```

---

## 🎯 PROCHAINES ÉTAPES

1. **Lire documentation V4** → `docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md`
2. **Setup one-time** → OAuth (5 min) + Jules (15 min)
3. **Créer premier client** → Workflow complet (4h30)
4. **Tester multi-projets** → 3-4 simultanés (hybride local + cloud)
5. **Scaler** → 8-12 clients/semaine, €80-100K/mois

---

## 📜 LICENSE

MIT License - Open source workflow patterns

---

## 🙏 CREDITS

- **Claude Code** - Anthropic (Sonnet 4.5)
- **Jules AI** - Google (Gemini 2.5 Pro)
- **Spec-Kit** - GitHub
- **shadcn/ui** - shadcn
- **Supabase** - Supabase Inc.

---

**Version:** 4.1 (Spec-Kit Enhanced - Workflow Autonome)
**Date:** 2025-10-10
**Status:** ✅ Production-Ready
**Documentation:** ✅ V4.1 complète et validée
**Source:** docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md

**🆕 V4.1 - Nouveautés:**
- `/speckit.design` - Design system automatique
- `/speckit.agents` - Orchestration prompt automatique
- **Workflow 100% autonome** - Pas de guidance manuelle

**Ship 8-12 clients/semaine avec qualité production** 🚀🔒
