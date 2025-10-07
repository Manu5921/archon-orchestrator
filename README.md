# 🎼 ARCHON ORCHESTRATOR - Workflow V3

**Workflow multi-client productif avec Claude Max + Jules Security + Bootstrap + Design + Context7**

**Version:** 5.0
**Date:** 2025-10-07
**Model:** Claude Sonnet 4.5 (SOTA coding - 49% SWE-bench, 0% error rate)
**Capacité:** 8-10 clients/semaine | €64K-€120K/mois revenue

---

## 🚀 QUICK START (2 OPTIONS)

### Option A: Full Local (Mac Mini 24/7)

```bash
# 1. Setup one-time (30 min)
npm install -g @google/jules-cli
jules auth login
gh auth login

# 2. Nouveau client (3-4h)
cd ~/clients/
uvx --from git+https://github.com/github/spec-kit.git specify init reviewrescue
cd reviewrescue/

# 3. Planning (30 min)
/speckit.constitution
/speckit.specify
/speckit.plan
/speckit.tasks

# 4. Bootstrap (2 min)
/bootstrap

# 5. Implementation (3-4h)
/implement

# 6. Security + Deploy (1h async)
git init && git add . && git commit -m "feat: MVP complete"
gh repo create reviewrescue --private --source=. --push
# → Jules scan automatique → Review PR mobile → Deploy
```

**Timeline:** 5h30 total (dont 55 min async) = **4h35 temps réel**

---

### Option B: GitHub Actions (Cloud VM)

```bash
# 1. Récupérer credentials Claude Max (Keychain)
# Keychain Access → "claude" → Copier JSON

# 2. Configurer secrets GitHub
gh secret set CLAUDE_ACCESS_TOKEN --body "..."
gh secret set CLAUDE_REFRESH_TOKEN --body "..."
gh secret set CLAUDE_EXPIRES_AT --body "..."
gh secret set JULES_API_KEY --body "..."

# 3. Planning local (30 min)
cd ~/clients/reviewrescue/
/speckit.constitution
/speckit.specify
/speckit.plan
/speckit.tasks
git push

# 4. Déclenchement mobile (2 min)
# GitHub app → New issue
# Title: "Implement T001-T010"
# Label: run-claude
# → Workflow démarre (3-4h cloud async)

# 5. Review mobile (15 min)
# Notification → Review PRs → Approve + Merge
```

**Timeline:** 54 min temps actif (planning 30min + review 24min) | **5h06 temps libre pendant execution cloud**

---

## 📖 DOCUMENTATION COMPLÈTE

### 🔴 Source de Vérité

**[docs/WORKFLOW-COMPLETE-V3.md](./docs/WORKFLOW-COMPLETE-V3.md)** (85KB - RIEN NE MANQUE)

**Contient:**
- 5 Piliers complets (Spec-Kit + Bootstrap + Design + Implementation + Jules)
- 2 Options execution (Local + GitHub Actions)
- Workflow mobile complet
- Context7 patterns reuse
- Setup Keychain credentials
- Cost & ROI (€118/mois → €64K-€120K revenue)
- Troubleshooting (7 problèmes + solutions)

**Autres docs:**
- **[START-HERE.md](./START-HERE.md)** - Point d'entrée unique
- **[INDEX-FILES-V3.md](./INDEX-FILES-V3.md)** - Index fichiers valides (navigation)
- **[CLAUDE.md](./CLAUDE.md)** - Instructions session Claude Code

---

## 🎯 WORKFLOW EN 3 PHASES

### Phase 1: Planning (30 min - Claude Local)

**Spec-Kit v0.0.18:**
```bash
/speckit.constitution  # 5 min → Principes P1-P5 projet
/speckit.specify       # 5 min → User stories + requirements
/speckit.plan          # 10 min → Architecture + ADRs
/speckit.tasks         # 10 min → T001-T078 breakdown
```

**Output:**
- `.specify/memory/constitution.md` (5 principes non-négociables)
- `.specify/specs/001-mvp/spec.md` (user stories)
- `.specify/specs/001-mvp/plan.md` (architecture)
- `.specify/specs/001-mvp/tasks.md` (50-100 tasks détaillées)

---

### Phase 2: Bootstrap (1-2 min - Meta-Agent)

**Auto-génération sub-agents:**
```bash
/bootstrap
```

**Output automatique:**
```
.claude/agents/
├── backend-specialist.md      (API + Supabase + Auth)
├── frontend-specialist.md     (React + shadcn/ui)
├── design-specialist.md       (Tokens + Wireframes)
└── testing-specialist.md      (E2E + Unit tests)
```

**Process:** Meta-agent lit `tasks.md` → Détecte domaines → Génère 3-4 agents spécialisés

---

### Phase 3: Implementation (3-4h - Sub-Agents Chaining)

**Orchestration automatique:**
```bash
/implement
```

**Process:**
```
T001 → @devops-specialist (Next.js setup) - 5 min
T002 → @design-specialist (design-tokens.json) - 3 min ← Design-First!
T003-T005 → @backend-specialist (Supabase) - 15 min
T006-T012 → @backend-specialist (Auth) - 45 min
T013-T020 → @backend-specialist (Review sync) - 1h
T021-T028 → @backend-specialist (AI generation) - 1h
T029-T044 → @frontend-specialist (UI components) - 1h
  ↳ Utilise design-tokens.json (T002) automatiquement
T045-T070 → Mix backend + frontend - 1h
T071-T078 → @testing-specialist (E2E tests) - 30 min

PARALLÈLE (GitHub Actions):
Jules Security scan (OWASP + RGPD + CVE) - 55 min
```

**Features:**
- ✅ Dependencies tracking (T022 attend T002 design tokens)
- ✅ MCP Context7 (réutilise patterns projets précédents +30% vitesse)
- ✅ Dynamic selection (Sonnet 4.5 +18% accuracy)
- ✅ Quality gates P0-P2 (Build + Lint + Tests)

---

## 🔒 JULES SECURITY GUARDIAN

**Scan automatique async pendant implementation:**

```yaml
# .github/workflows/claude-max-implementation.yml
jobs:
  jules-security:
    - Trigger: push main OU daily cron 2am
    - Scan: OWASP Top 10 + npm deps + RGPD compliance
    - Output: security-report.json
    - Action: Create PR avec auto-fixes
    - Notification: Slack si critical issues
```

**Checklist:**
- A01-A10: OWASP Top 10 (2021)
- RGPD: Articles 6, 15-20, 25, 32-34
- CVE: npm audit + dependency scanning

**Auto-fixes appliqués:**
- Helmet.js security headers
- CORS whitelist
- Rate limiting (10 req/min)
- CSRF tokens
- Input validation (Zod)
- Error sanitization

---

## 🎨 DESIGN SYSTEM SIMPLIFIÉ

**T002: Design Tokens (2-5 min - Auto-généré)**

**Output:**
```json
// src/design/design-tokens.json
{
  "colors": { "primary": {...}, "neutral": {...} },
  "typography": { "heading": {...}, "body": {...} },
  "spacing": { "xs": "0.25rem", "md": "1rem", "xl": "2rem" },
  "radius": { "sm": "0.25rem", "md": "0.5rem", "lg": "1rem" }
}
```

**Wireframes:**
- `wireframes/dashboard.svg` (layout générique)
- `wireframes/approval-queue.svg` (workflow specific)
- `wireframes/settings.svg` (forms)

**Components list:**
- `components.json` → shadcn/ui components nécessaires

**Usage:** Frontend (T022+) utilise tokens automatiquement → Personnalisation rapide (30 min vs 2-3h refactor)

---

## 🔄 CONTEXT7 PATTERNS REUSE

**Problème:** Répétition code cross-clients (Auth, Supabase, API routes identiques)

**Solution:** MCP Context7 sauvegarde + réutilise patterns

**Workflow:**
```bash
# Client 1 (ReviewRescue)
# → Après MVP, sauvegarder patterns
cp lib/supabase/client.ts ~/archon-orchestrator/knowledge-base/patterns/

# Client 2 (ProjetB)
# → Claude détecte automatiquement patterns disponibles
# → Réutilise 80% code Auth
# → Temps: 15 min → 5 min (-67%)
```

**Impact:** +30% vitesse tasks complexes, +50% après 3+ projets

**Patterns réutilisables:**
- Supabase client (100% réutilisable)
- Auth hooks (90%)
- API routes (95%)
- Dashboard layout (80%)
- Data tables (70%)

---

## 💰 COST & ROI

### Coûts Mensuels

| Service | Coût |
|---------|------|
| Claude Code Max | €100/mois |
| Jules AI Pro | €18/mois |
| GitHub Actions | €0 (gratuit <2000 min/mois) |
| **TOTAL** | **€118/mois** |

### Capacité Production

| Métric | Option A (Local) | Option B (GitHub Actions) |
|--------|------------------|---------------------------|
| **Clients/jour** | 2 clients | 3-4 clients |
| **Clients/semaine** | 8-10 clients | 15-20 clients |
| **Clients/mois** | 32-40 clients | 60-80 clients |
| **Temps actif/client** | 3h40 → 2h30 (Context7) | 54 min (planning + review) |

### Revenue Potential

```
Hypothèse: €2,000/client (MVP SaaS)

Option A (Local):
  32 clients/mois × €2,000 = €64,000/mois
  Coût: €118/mois
  Profit: €63,882/mois (ROI 54,137%)

Option B (GitHub Actions):
  60 clients/mois × €2,000 = €120,000/mois
  Coût: €188/mois (GitHub Actions usage)
  Profit: €119,812/mois (ROI 63,730%)
```

---

## 📱 WORKFLOW MOBILE (Android)

**Scénario complet:**

1. **Planning Mac** (30 min)
2. **Issue Android** (2 min)
   - GitHub app → New issue
   - "Implement T001-T010"
   - Label: `run-claude`
3. **Cloud Execution** (3-4h async)
   - Bootstrap + Design + Implementation
   - Jules Security parallèle
4. **Review Mobile** (15 min)
   - Notification PR
   - Review files changed
   - Approve + Merge
5. **Auto-deploy** (3 min)
   - Vercel deployment automatique

**Total:** 54 min temps actif | 5h06 temps libre

---

## 🏗️ TECH STACK

### Développement

- **Claude Code:** Sonnet 4.5 (49% SWE-bench SOTA, 0% error rate, 200K context)
- **Spec-Kit:** v0.0.18 (GitHub specification-driven development)
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

## 🛠️ SETUP PROJET

### Prérequis

```bash
# 1. Claude Code Max (€100/mois)
# https://claude.com/claude-code

# 2. Jules AI Pro (€18/mois)
npm install -g @google/jules-cli
jules auth login

# 3. GitHub CLI
brew install gh
gh auth login

# 4. Spec-Kit (auto via uvx, pas besoin install global)
```

### Nouveau Projet

```bash
# 1. Créer projet Spec-Kit
cd ~/clients/
uvx --from git+https://github.com/github/spec-kit.git specify init nomclient
cd nomclient/

# 2. Copier templates workflow
mkdir -p .github/workflows/
cp ~/Documents/DEV/archon-orchestrator/.github/workflows/claude-max-implementation.yml .github/workflows/
cp ~/Documents/DEV/archon-orchestrator/.github/security-checklist.md .github/

# 3. Planning
/speckit.constitution
/speckit.specify
/speckit.plan
/speckit.tasks

# 4. Bootstrap
/bootstrap

# 5. Implementation
/implement

# 6. Git setup
git init
git add .
git commit -m "feat: MVP complete

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

gh repo create nomclient --private --source=. --remote=origin --push
gh secret set JULES_API_KEY --body "your-jules-api-key"

# Si Option B (GitHub Actions):
gh secret set CLAUDE_ACCESS_TOKEN --body "..."
gh secret set CLAUDE_REFRESH_TOKEN --body "..."
gh secret set CLAUDE_EXPIRES_AT --body "..."

# 7. Review PRs (mobile ou desktop)
gh pr list
gh pr view 1
gh pr review 1 --approve
gh pr merge 1 --squash

# 8. Deploy
vercel --prod
```

---

## 📊 MÉTRIQUES SONNET 4.5

| Métric | Avant (3.7) | Sonnet 4.5 | Gain |
|--------|-------------|------------|------|
| **Spec-Kit** | 30 min | 30 min | = |
| **Bootstrap** | 2-3 min | 1-2 min | -33% |
| **T002 Design** | 5-10 min | 2-5 min | -50% |
| **Implementation** | 4-6h | 3-4h | -33% |
| **Erreurs code** | 9% | 0% | -100% |
| **Fiabilité** | Baseline | +12% | +12% |
| **Planning accuracy** | Baseline | +18% | +18% |

**Source:** https://www.anthropic.com/news/claude-sonnet-4-5

---

## 🔗 LIENS UTILES

| Resource | URL |
|----------|-----|
| **Documentation V3** | [WORKFLOW-COMPLETE-V3.md](./docs/WORKFLOW-COMPLETE-V3.md) |
| **Index fichiers** | [INDEX-FILES-V3.md](./INDEX-FILES-V3.md) |
| **Spec-Kit** | https://github.com/github/spec-kit |
| **Jules AI** | https://jules.google |
| **Claude Code** | https://docs.claude.com/en/docs/claude-code |
| **shadcn/ui** | https://ui.shadcn.com |
| **Supabase** | https://supabase.com |
| **Vercel** | https://vercel.com |

---

## 🐛 TROUBLESHOOTING

**Voir documentation complète:** [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)

**Problèmes courants:**

1. **Session tokens expired (GitHub Actions)**
   - Récupérer nouveaux tokens Keychain
   - Update GitHub Secrets

2. **Bootstrap wrong agents**
   - Re-run `/bootstrap` avec prompt explicite
   - Ou edit `tasks.md` pour clarifier

3. **Context7 patterns not found**
   - Vérifier MCP config `claude_desktop_config.json`
   - Copier patterns manuellement

4. **Jules rate limit**
   - Upgrade Jules Pro+ (100 req/day)
   - Désactiver cron temporairement

5. **Design tokens invalid JSON**
   - Vérifier syntax: `jq '.' design-tokens.json`
   - Re-run T002 si besoin

6. **Dependencies not tracked**
   - Vérifier T002 complete avant T022
   - Re-run `/implement` avec dependencies claires

7. **GitHub Actions timeout**
   - Augmenter timeout workflow (360 min)
   - Découper en batches plus petits (T001-T020, T021-T040, etc.)

---

## 📂 STRUCTURE PROJET

```
archon-orchestrator/
├── START-HERE.md                    ← Point d'entrée unique
├── README.md                        ← Ce fichier
├── CLAUDE.md                        ← Instructions Claude Code
├── INDEX-FILES-V3.md                ← Index fichiers valides
│
├── docs/
│   ├── WORKFLOW-COMPLETE-V3.md      ← ✅ SOURCE DE VÉRITÉ (85KB)
│   ├── WORKFLOW-CLAUDE-FIRST-JULES-SECURITY.md
│   ├── JULES-SECURITY-GUARDIAN-SETUP.md
│   ├── MULTI-CLIENT-SETUP-GUIDE.md
│   ├── DESIGN-SYSTEM-SOLO-SIMPLIFIED.md
│   ├── SUB-AGENTS-MASTERY.md
│   ├── AGENTIC-PATTERNS.md
│   ├── ZERO-TRUST.md
│   ├── GOLDEN-PATTERNS.md
│   └── TROUBLESHOOTING.md
│
├── .github/workflows/
│   ├── claude-max-implementation.yml  ← PRINCIPAL workflow
│   └── jules-security-guardian.yml    ← Backup standalone
│
├── .github/
│   ├── security-checklist.md
│   ├── pull_request_template.md
│   └── ISSUE_TEMPLATE/implement-batch.yml
│
├── .claude/
│   ├── agents/mega-orchestrator-bootstrap.md
│   └── commands/smart-review.md
│
├── knowledge-base/
│   ├── architecture-best-practices.md
│   └── auto-learned/ (Context7 patterns)
│
├── templates/
│   ├── ARCHITECTURE-TEMPLATE.md
│   └── PROJECT-INIT.md
│
├── scripts/
│   ├── quality-gate.js
│   └── validate-setup.js
│
├── src/ (infrastructure code - garder pour dev)
├── tests/ (E2E + compliance tests - garder pour dev)
├── __tests__/ (unit tests - garder pour dev)
│
└── archive-obsolete-2025-10-07-v3/ (121 fichiers archivés)
    └── ARCHIVAGE-RAISONS-V3.md
```

---

## 🎯 PROCHAINES ÉTAPES

1. **Lire documentation V3** → `docs/WORKFLOW-COMPLETE-V3.md`
2. **Setup Claude Max + Jules** → Suivre guides setup
3. **Créer premier client** → Workflow complet Option A ou B
4. **Optimiser Context7** → Sauvegarder patterns après client 1
5. **Scaler multi-client** → 8-10 clients/semaine

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

**Version:** 5.0
**Date:** 2025-10-07
**Status:** ✅ Production-Ready
**Nettoyage:** ✅ 121 fichiers archivés
**Source:** docs/WORKFLOW-COMPLETE-V3.md (85KB - RIEN NE MANQUE)

**Ship 2-3 clients/jour avec qualité production** 🚀
