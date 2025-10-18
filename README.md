# 🎼 ARCHON ORCHESTRATOR - Workflow V6.1.3

**Workflow complete automation + observability timeline + Multi-IA + MCP + Dynamic Memory**

**Version:** 6.1.3 (Observability Complete + Full Automation)
**Date:** 2025-10-17
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) + Haiku 4.5 for sub-agents
**Capacité:** 8-12 clients/semaine | €80K-€100K/mois revenue
**Quality:** 5 gates enforced (Build P0 + Lint P1 + Context7 P2 + Memory P3 + Observability P4)

**🆕 V6.1.3 - Nouveautés:**
- **Gate P4 Observability** - Timeline tracking (pulseLogger.cjs CLI + viewPulse.sh viewer + observability-pulse.jsonl)
- **Complete Automation** - `/speckit.final` orchestrates all agents (0 manual copy-paste)
- **5 Quality Gates ENFORCED** - Build P0 + Lint P1 + Context7 P2 + Memory P3 + Observability P4
- **Agent Coordination** - Agents read pulse → know what's completed
- **Token Savings** - -77% implementation with GLM-4.6 (450K→100K tokens)
- **Dynamic Memory V5** - Agent self-documentation (WHY decisions)
- **CLAUDE.md Pattern** - Project-level agent instructions

---

## 🚀 QUICK START

### Workflow V6.1.3 Standard (4-5h par projet)

```bash
# Phase 0: Multi-IA Roundtable (30-45 min) ⭐ GEMINI-OPTIMIZED
cd ~/Documents/DEV/clients
mkdir nouveau-projet && cd nouveau-projet
git init

/zen-roundtable "Brief: [description projet]"
# → Gemini + Codex + Claude analysis (3-4 min)
# → Output (8KB total):
#   ✅ analysis-multi-ia.md (5KB - insights + decisions)
#   ✅ prompt-constitution.md (2-3KB - instructions)
#   ✅ prompt-specify.md (1-2KB - instructions)

# Phase 1: Spec-Kit Planning (30-35 min)
/speckit.constitution  # → constitution.md (60-90s REAL generation)
/speckit.specify       # → spec.md (90-120s REAL generation)
/speckit.init          # → CLAUDE.md + project-memory.md + ci-template.yml ⭐ V5
/speckit.clarify       # → Q&A iteration si ambiguïtés (optionnel)
/speckit.design        # → design-tokens.json + wireframes + components ⭐ NEVER SKIP
/speckit.plan          # → plan.md (architecture + file structure)
/speckit.tasks         # → tasks.md (50-100 tasks checkboxes format)
/speckit.agents        # → ORCHESTRATION.md (sub-agents strategy) ⭐ V5

# Phase 2: GitHub Setup (2 min)
# Lis CLAUDE.md section 2, exécute steps exactement
# → Branch, commit, push, PR creation

# Phase 3: Implementation (2h45-3h) ⭐ V6.1.3 FULL AUTOMATION + OBSERVABILITY
/speckit.final
# V6.1.3 - Complete automation + observability:
# → Lit ORCHESTRATION.md automatiquement ✅
# → Lit CLAUDE.md automatiquement ✅
# → Checkpoints MANDATORY every 10 tasks (5 gates):
#   ✅ Gate P0: Build Check (BLOCKER - exit 1 if fails)
#   ✅ Gate P1: ESLint (BLOCKER - mcp__eslint__lint-files)
#   ✅ Gate P2: Context7 (IF new library - mcp__context7__get-library-docs)
#   ✅ Gate P3: Memory (VERIFICATION - project-memory.md updated)
#   ✅ Gate P4: Observability (TIMELINE - pulseLogger.cjs logging) 🆕
# → Sub-agents séquentiels (backend → frontend → testing)
# → Auto-documentation (5-15 decisions in project-memory.md)
# → Task tracking automatique (sed commands)
# → Real-time observability (observability-pulse.jsonl)
# → Timeline logging (./scripts/viewPulse.sh viewer)
# → CLI monitoring (node scripts/pulseLogger.cjs summary)
#
# Validated: 2h45 on AdProof.ai (99 tasks, 150+ files, 12K+ lines)
# Token savings: -77% with GLM-4.6

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
- **[INDEX.md](./INDEX.md)** - Index navigation V6.1.3 (navigation rapide)
- **[CLAUDE.md](./CLAUDE.md)** - Instructions session Claude Code V6.1.3
- **[changelogs/V6.1.3/](./changelogs/V6.1.3/)** - V6.1.3 changelog (observability)

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

**Version:** 6.1.3 (Observability Complete + Full Automation)
**Date:** 2025-10-17
**Status:** ✅ Production-Ready
**Documentation:** ✅ V6.1.3 complète et validée
**Source:** docs/WORKFLOW-V6-MVP.md + changelogs/V6.1.3/

**🆕 V6.1.3 - Features:**
- **Gate P4 Observability** - Timeline tracking complete
- **pulseLogger.cjs CLI** - Agent coordination
- **viewPulse.sh** - Color-coded timeline viewer
- **Complete automation** - `/speckit.final` orchestration
- **5 Quality Gates** - Build + Lint + Context7 + Memory + Observability
- **Token Savings** - -77% implementation (GLM-4.6)

**Ship 8-12 clients/semaine avec qualité production + observability complète** 🚀🔒📊
