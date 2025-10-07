# Multi-Client Setup Guide - Claude First + Jules Security

**Version:** 1.0.0
**Date:** 2025-10-07
**Cible:** Solopreneurs gérant 10-15 clients/semaine

---

## 🎯 Vue d'Ensemble

Ce guide explique comment configurer et gérer **plusieurs projets clients simultanément** avec le workflow Claude-First + Jules Security Guardian.

**Capacité:** 8-10 clients/semaine (Mac Mini M1/M2)

**Stack:**
- Claude Code Max (€100/mois) - Implementation
- Jules AI Pro (€18/mois) - Security async
- GitHub Actions (gratuit) - Orchestration
- Spec-Kit v0.0.18 - Planning

**ROI:** €14,882 profit/10 clients (12,600% ROI)

---

## 📁 Structure Multi-Client

### 1. Directory Organization

```bash
~/clients/
├── reviewrescue/              # Client 1 (restaurant review management)
│   ├── .specify/
│   │   ├── memory/
│   │   │   └── constitution.md
│   │   ├── specs/
│   │   │   └── 001-mvp/
│   │   │       ├── spec.md
│   │   │       ├── plan.md
│   │   │       └── tasks.md
│   │   └── .specifyrc
│   ├── .github/
│   │   ├── workflows/
│   │   │   └── jules-security-guardian.yml
│   │   └── security-checklist.md
│   ├── .claude/
│   │   └── commands/
│   │       ├── backend-specialist.md
│   │       ├── frontend-specialist.md
│   │       ├── design-specialist.md
│   │       └── testing-specialist.md
│   ├── app/                   # Next.js 14 app directory
│   ├── components/            # React components
│   ├── lib/                   # Utilities + Supabase client
│   ├── public/                # Static assets
│   ├── .env.local             # Environment variables (gitignored)
│   ├── package.json
│   └── README.md
│
├── projetb/                   # Client 2 (autre SaaS)
│   ├── .specify/
│   ├── .github/
│   ├── .claude/
│   └── ... (même structure)
│
├── projetc/                   # Client 3
│   └── ...
│
└── _templates/                # Templates réutilisables
    ├── security-checklist.md
    ├── constitution-template.md
    ├── .specifyrc-template
    └── github-workflow-template.yml
```

---

## 🚀 Quick Start Nouveau Client

### Étape 1: Créer Projet (2 min)

```bash
# Naviguer vers dossier clients
cd ~/clients/

# Créer nouveau projet avec Spec-Kit
uvx --from git+https://github.com/github/spec-kit.git specify init nomclient

# Naviguer dans projet
cd nomclient/
```

---

### Étape 2: Copier Templates (1 min)

```bash
# Copier security checklist
cp ../_templates/security-checklist.md .github/

# Copier GitHub Actions workflow
mkdir -p .github/workflows/
cp ../_templates/github-workflow-template.yml .github/workflows/jules-security-guardian.yml

# Copier constitution template (si standard)
cp ../_templates/constitution-template.md .specify/memory/constitution.md
```

---

### Étape 3: Spec-Kit Planning (30 min)

```bash
# Dans Claude Code
/speckit.constitution   # 5 min - Définir principes projet
/speckit.specify       # 5 min - User stories + requirements
/speckit.plan          # 10 min - Architecture + design
/speckit.tasks         # 10 min - 50-100 tasks breakdown
```

**Output:**
- `.specify/memory/constitution.md` (5 principes projet)
- `.specify/specs/001-mvp/spec.md` (user stories)
- `.specify/specs/001-mvp/plan.md` (architecture)
- `.specify/specs/001-mvp/tasks.md` (tasks détaillées)

---

### Étape 4: Bootstrap Agents (1-2 min)

```bash
# Générer sub-agents automatiquement
/bootstrap
```

**Output Automatique:**
- `.claude/commands/backend-specialist.md`
- `.claude/commands/frontend-specialist.md`
- `.claude/commands/design-specialist.md`
- `.claude/commands/testing-specialist.md`

---

### Étape 5: Implementation (3-4h)

```bash
# Lancer implementation orchestrée
/implement
```

**Claude primaire orchestre:**
- T001 → @devops-specialist (Next.js setup)
- T002 → @design-specialist (design-tokens.json + wireframes)
- T015 → @backend-specialist (Auth API)
- T022 → @frontend-specialist (Auth UI)
- ... (continue jusqu'à T078)

**Pendant ce temps (PARALLÈLE):**
- Jules Security scan async (45-55 min)
- Créé PR #1 avec fixes OWASP + RGPD

---

### Étape 6: GitHub Setup (5 min)

```bash
# Initialiser Git
git init
git add .
git commit -m "feat: initial commit - MVP implementation complete

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Créer repo GitHub
gh repo create nomclient --private --source=. --remote=origin --push

# Ajouter secrets GitHub
gh secret set JULES_API_KEY --body "$JULES_API_KEY"
gh secret set SLACK_WEBHOOK --body "$SLACK_WEBHOOK_URL"  # Optionnel
```

---

### Étape 7: Vérifier Security PR (15 min)

```bash
# Lister PRs
gh pr list

# Review PR Jules
gh pr view 1

# Approuver si acceptable
gh pr review 1 --approve

# Merger
gh pr merge 1 --squash
```

---

## ⚙️ Configuration GitHub Secrets

### Secrets Requis par Client

| Secret | Description | Obtention |
|--------|-------------|-----------|
| `JULES_API_KEY` | Jules AI Pro API key | https://jules.google → Account → API Keys |
| `GITHUB_TOKEN` | GitHub Actions token | Auto-généré par GitHub (pas besoin créer) |
| `SLACK_WEBHOOK` | Notifications critical issues | https://api.slack.com/messaging/webhooks (optionnel) |

### Ajouter Secrets

```bash
# Via GitHub CLI
gh secret set JULES_API_KEY --body "your-jules-api-key"

# Via GitHub UI
# 1. Aller sur https://github.com/username/nomclient/settings/secrets/actions
# 2. Cliquer "New repository secret"
# 3. Name: JULES_API_KEY
# 4. Value: your-jules-api-key
# 5. Cliquer "Add secret"
```

---

## 🔄 Workflow Multi-Client Quotidien

### Scénario: 3 Clients en 1 Journée (8h-18h)

#### **Client 1: ReviewRescue (9h00-14h30)**

```bash
# 9h00: Démarrer nouveau projet
cd ~/clients/reviewrescue/

# 9h00-9h30: Planning (30 min)
/speckit.constitution
/speckit.specify
/speckit.plan
/speckit.tasks

# 9h30-9h32: Bootstrap (1-2 min)
/bootstrap

# 9h32-13h30: Implementation (4h)
/implement
# Claude code T001-T078

# PARALLÈLE 9h35-10h30: Jules scan async (55 min)
# PR #1 créée automatiquement

# 13h30-13h45: Review security PR (15 min)
gh pr review 1 --approve
gh pr merge 1 --squash

# 13h45-14h30: Tests finaux + deploy (45 min)
npm run build
npm run test:e2e
vercel --prod
```

**Total Client 1:** 5h30 (planning 30min + implementation 4h + review 1h)

---

#### **Client 2: ProjetB (14h30-19h00)**

```bash
# 14h30: Switch contexte
cd ~/clients/projetb/

# 14h30-15h00: Planning (30 min)
# (Réutilise templates si projet similaire)
/speckit.constitution  # 2 min si template standard
/speckit.specify       # 5 min
/speckit.plan          # 10 min
/speckit.tasks         # 10 min

# 15h00-15h02: Bootstrap (2 min)
/bootstrap

# 15h02-18h30: Implementation (3h30)
/implement
# Utilise MCP Context7 → +30% speed (patterns ReviewRescue réutilisés)

# PARALLÈLE 15h05-16h00: Jules scan async (55 min)

# 18h30-18h45: Review + merge (15 min)
gh pr review 1 --approve
gh pr merge 1 --squash

# 18h45-19h00: Deploy (15 min)
vercel --prod
```

**Total Client 2:** 4h30 (Context7 patterns boost)

---

#### **Client 3: ProjetC (Lendemain 9h00-12h30)**

```bash
# 9h00: Nouveau projet
cd ~/clients/projetc/

# 9h00-9h20: Planning (20 min)
# Templates + Context7 = -33% temps
/speckit.constitution  # 2 min (template)
/speckit.specify       # 5 min
/speckit.plan          # 8 min (Context7 patterns)
/speckit.tasks         # 5 min

# 9h20-9h22: Bootstrap (2 min)
/bootstrap

# 9h22-12h00: Implementation (2h40)
/implement
# Context7 mature (2 projets précédents) → +50% speed

# PARALLÈLE 9h25-10h20: Jules scan async

# 12h00-12h15: Review + merge
gh pr review 1 --approve

# 12h15-12h30: Deploy
vercel --prod
```

**Total Client 3:** 3h30 (Context7 fully optimized)

---

### Timeline Complète 3 Clients

| Client | Planning | Bootstrap | Implementation | Review | Deploy | Total |
|--------|----------|-----------|----------------|--------|--------|-------|
| Client 1 | 30 min | 2 min | 4h00 | 15 min | 45 min | 5h30 |
| Client 2 | 30 min | 2 min | 3h30 | 15 min | 15 min | 4h30 |
| Client 3 | 20 min | 2 min | 2h40 | 15 min | 15 min | 3h30 |
| **TOTAL** | **1h20** | **6 min** | **10h10** | **45 min** | **1h15** | **13h30** |

**Répartition réelle:** 1.5 jours (J1: 10h, J2: 3h30)

**Capacité hebdomadaire:** 8-10 clients (40h semaine)

---

## 🔍 Context7 Pattern Sharing

### Problème: Répétition Code Similaire

Chaque nouveau projet SaaS Next.js + Supabase répète:
- Auth flow (login, signup, session management)
- Supabase client configuration
- shadcn/ui components setup
- API routes structure

**Sans Context7:** Claude réécrit tout à chaque fois

**Avec Context7:** Claude réutilise patterns du projet précédent

---

### Configuration Context7 MCP

#### **1. Installer Context7 MCP Server**

```bash
# Dans archon-orchestrator (pas dans client projects)
cd ~/Documents/DEV/archon-orchestrator/

# Vérifier Context7 MCP config
cat claude_desktop_config.json
```

**Vérifier section:**
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"],
      "env": {
        "CONTEXT7_KNOWLEDGE_BASE": "/Users/manu/Documents/DEV/archon-orchestrator/knowledge-base"
      }
    }
  }
}
```

---

#### **2. Sauvegarder Patterns après Client 1**

```bash
# Après ReviewRescue complete
cd ~/clients/reviewrescue/

# Sauvegarder patterns clés
cp lib/supabase/client.ts ~/Documents/DEV/archon-orchestrator/knowledge-base/patterns/supabase-client-pattern.ts
cp lib/auth/useAuth.tsx ~/Documents/DEV/archon-orchestrator/knowledge-base/patterns/auth-hook-pattern.tsx
cp app/api/auth/route.ts ~/Documents/DEV/archon-orchestrator/knowledge-base/patterns/auth-api-pattern.ts
```

---

#### **3. Utiliser Patterns pour Client 2**

**Dans Claude Code (projet ProjetB):**

```bash
# Claude détecte automatiquement patterns via Context7
# Lors de T015 (Backend Auth API):
# → Claude lit knowledge-base/patterns/auth-api-pattern.ts
# → Réutilise structure (30% plus rapide)
```

**Ou explicitement:**

```
@mcp context7: cherche pattern auth API Next.js + Supabase
```

**Claude retourne:**
```typescript
// Pattern trouvé: auth-api-pattern.ts
// Réutilise structure POST /api/auth/login
// Adapte pour ProjetB spécifique requirements
```

---

### Patterns Réutilisables Typiques

| Pattern | File | Réutilisation |
|---------|------|---------------|
| **Supabase Client** | `lib/supabase/client.ts` | 100% tous projets |
| **Auth Hook** | `lib/auth/useAuth.tsx` | 90% (adapter user fields) |
| **Auth API Routes** | `app/api/auth/route.ts` | 95% (login/signup logic) |
| **Dashboard Layout** | `components/DashboardLayout.tsx` | 80% (sidebar structure) |
| **Data Table** | `components/DataTable.tsx` | 70% (table + pagination) |
| **Form Validation** | `lib/validation/schemas.ts` | 60% (Zod patterns) |

**Impact:** +30% speed complexes tasks, +50% après 3+ projets

---

## 📊 Monitoring Multi-Client

### Dashboard GitHub Projects (Optionnel)

**Créer board Kanban global:**

```bash
# Créer project global
gh project create --title "Multi-Client Pipeline" --owner @me

# Ajouter colonnes
# - Backlog (nouveaux clients)
# - Planning (Spec-Kit phase)
# - Implementation (coding)
# - Security Review (Jules PR)
# - Deployed (production)

# Lier repos clients
gh project item-add 1 --url https://github.com/username/reviewrescue
gh project item-add 1 --url https://github.com/username/projetb
```

---

### Script Monitoring Status (Optionnel)

```bash
#!/bin/bash
# scripts/client-status.sh

echo "📊 Multi-Client Status Report"
echo "=============================="
echo ""

for client in ~/clients/*/; do
  cd "$client"
  CLIENT_NAME=$(basename "$client")

  echo "🏢 $CLIENT_NAME"

  # Check if spec exists
  if [ -f ".specify/specs/001-mvp/spec.md" ]; then
    echo "  ✅ Spec: Complete"
  else
    echo "  ⏳ Spec: Pending"
  fi

  # Check implementation status
  if [ -d "app" ]; then
    echo "  ✅ Implementation: Started"
  else
    echo "  ⏳ Implementation: Not started"
  fi

  # Check security PRs
  PR_COUNT=$(gh pr list --label security --json number --jq 'length')
  if [ "$PR_COUNT" -gt 0 ]; then
    echo "  🔒 Security PRs: $PR_COUNT pending"
  else
    echo "  ✅ Security: Clean"
  fi

  # Check deployment
  if [ -f ".vercel/project.json" ]; then
    echo "  🚀 Deployment: Configured"
  else
    echo "  ⏳ Deployment: Pending"
  fi

  echo ""
done
```

**Usage:**
```bash
chmod +x scripts/client-status.sh
./scripts/client-status.sh
```

---

## 🎯 Templates Réutilisables

### Template 1: Constitution Standard SaaS

**File:** `~/clients/_templates/constitution-template.md`

```markdown
# [PROJECT_NAME] AI Constitution

## Core Principles

### I. Human-in-the-Loop (NON-NEGOTIABLE)
AI-generated content MUST never be published automatically without explicit human approval.

### II. Niche-First Strategy
Product scope MUST remain tightly constrained to [VERTICAL] until clear product-market fit
is achieved (50+ paying customers, <5% monthly churn, NPS ≥50).

### III. Data Privacy First
[RGPD/GDPR compliance requirements specific to vertical]

### IV. API Independence (Plan B Obligatory)
For every feature dependent on external APIs ([LIST_APIS]), a fallback mode MUST exist.

### V. Proactive > Reactive
Product philosophy MUST emphasize proactive problem detection over reactive management.

## Technical Standards
- Frontend: Next.js 14+, TypeScript strict, Tailwind + shadcn/ui
- Backend: Vercel Functions, Supabase (PostgreSQL + Auth + RLS)
- AI: Claude 3.5 Sonnet API
- Testing: Vitest + Playwright
```

**Usage:**
```bash
# Copier + adapter
cp ~/clients/_templates/constitution-template.md .specify/memory/constitution.md
# Edit [PROJECT_NAME], [VERTICAL], [LIST_APIS]
```

---

### Template 2: GitHub Workflow Standard

**File:** `~/clients/_templates/github-workflow-template.yml`

```yaml
name: Jules Security Guardian

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily 2am UTC
  workflow_dispatch:

env:
  JULES_TIMEOUT: 30m
  NODE_VERSION: '20'

jobs:
  security-scan:
    # [SAME AS jules-security-guardian.yml]
```

**Usage:**
```bash
cp ~/clients/_templates/github-workflow-template.yml .github/workflows/jules-security-guardian.yml
```

---

### Template 3: .env.local Standard

**File:** `~/clients/_templates/.env.local-template`

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Claude AI
ANTHROPIC_API_KEY=sk-ant-api03-...

# [PROJECT_SPECIFIC_APIS]
# Google Business Profile API (example)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx

# Vercel (auto-populated in production)
VERCEL_URL=
VERCEL_ENV=
```

**Usage:**
```bash
cp ~/clients/_templates/.env.local-template .env.local
# Edit with real keys (NEVER commit)
```

---

## 🚨 Troubleshooting Multi-Client

### Problème 1: Context7 Pas Détecté

**Symptômes:**
- Claude ne réutilise pas patterns
- Implementation temps = Client 1 (pas +30% boost)

**Solution:**

```bash
# Vérifier MCP connection
cat ~/Library/Application\ Support/Claude/logs/mcp*.log | grep context7

# Si vide, redémarrer Claude Code
# CMD+Q puis relancer

# Vérifier knowledge-base existe
ls -la ~/Documents/DEV/archon-orchestrator/knowledge-base/patterns/

# Si vide, copier patterns manuellement
cp ~/clients/reviewrescue/lib/supabase/client.ts \
   ~/Documents/DEV/archon-orchestrator/knowledge-base/patterns/
```

---

### Problème 2: Jules Scan Rate Limit

**Symptômes:**
```
Error: Jules API rate limit exceeded (30 requests/day)
```

**Solution:**

```bash
# Vérifier combien scans aujourd'hui
jules list --filter date:today

# Si >30, attendre lendemain ou upgrade Jules Pro+
# Jules Pro: 30 scans/day
# Jules Pro+: 100 scans/day ($49/month)

# Alternative: Désactiver cron quotidien temporairement
# Edit .github/workflows/jules-security-guardian.yml
# Commenter ligne: - cron: '0 2 * * *'
```

---

### Problème 3: GitHub Secrets Manquants

**Symptômes:**
```
Error: JULES_API_KEY not found in GitHub Secrets
```

**Solution:**

```bash
# Lister secrets existants
gh secret list

# Ajouter secret manquant
gh secret set JULES_API_KEY --body "$JULES_API_KEY"

# Vérifier
gh secret list | grep JULES_API_KEY
```

---

### Problème 4: Conflit Merge Security PR

**Symptômes:**
```
Error: Merge conflict in package.json
```

**Solution:**

```bash
# Récupérer PR branch
gh pr checkout 1

# Merger main dans branch
git pull origin main

# Résoudre conflits manuellement
# Edit package.json

# Commit
git add package.json
git commit -m "fix: resolve merge conflict package.json"

# Push
git push

# Re-review PR
gh pr review 1 --approve
gh pr merge 1 --squash
```

---

## 📈 Scaling Multi-Client

### Capacité Actuelle (Mac Mini M1/M2)

| Metric | Valeur |
|--------|--------|
| **Clients/jour** | 2-3 clients |
| **Clients/semaine** | 8-10 clients |
| **Heures/client** | 5h30 → 3h30 (Context7 mature) |
| **Revenue/client** | €1,500-€3,000 (assumption) |
| **Revenue/mois** | €48,000-€120,000 (40 clients) |
| **Coût/mois** | €118 (Claude + Jules) |
| **Profit/mois** | €47,882-€119,882 |
| **ROI** | 40,575% (best case) |

---

### Bottlenecks Potentiels

#### **1. Temps Implementation (3-5h/client)**

**Actuel:** 4h/client (sequential Claude coding)

**Solutions:**
- Context7 mature: 4h → 2h40 (-33%)
- Templates constitution: -10 min planning
- Patterns shadcn/ui réutilisés: -20 min frontend

**Max optimization:** 2h/client (avec Context7 + templates)

---

#### **2. Jules Rate Limit (30 scans/jour Pro)**

**Actuel:** 1 scan/client = max 30 clients/jour

**Solutions:**
- Upgrade Jules Pro+ (100 scans/jour) → +€30/mois
- Désactiver cron quotidien (scan uniquement push/PR)
- Grouper scans hebdomadaires (non recommandé security)

**Recommandation:** Jules Pro+ si >15 clients/semaine

---

#### **3. Review Manual Security PRs (15 min/client)**

**Actuel:** Review humaine obligatoire (constitution Principe I)

**Solutions:**
- Automatiser approbation PR si 0 critical issues (vs constitution?)
- Mobile review GitHub app Android (anywhere, anytime)
- Batch review 3-5 PRs matin/soir (30 min/batch)

**Recommandation:** Mobile review + batch processing

---

### Scaling Beyond 10 Clients/Semaine

**Option 1: Ajouter Mac Mini #2 (€600)**
- Mac Mini M2: €600 one-time
- 2x capacity: 20 clients/semaine
- Claude Code Max #2: +€100/mois

**Option 2: Embaucher Junior Dev**
- Salaire: €2,500/mois (France junior)
- Formation Claude Code workflow: 1 semaine
- Gère review + deploy (pas implementation)
- Capacity: 15-20 clients/semaine (toi + junior)

**Option 3: API Claude Code (pas Max)**
- Claude API: $15/million tokens (≈€0.014/token)
- Paralléliser 3-4 clients simultanément (cloud VMs)
- Cost: ~€50-100/client (vs €100/mois fixed)
- Breakeven: >10 clients/mois

**Recommandation:** Rester Full Local jusqu'à 15 clients/semaine, puis Mac Mini #2

---

## ✅ Checklist Nouveau Client

**Avant démarrage:**
- [ ] Client briefing reçu (30 min call)
- [ ] Budget confirmé (€1,500-€3,000)
- [ ] Timeline agreement (5 jours max)
- [ ] Accès GitHub org client (ou créer repo perso)
- [ ] Supabase project créé (client account)
- [ ] Vercel project créé (client account)

**Phase Planning (30 min):**
- [ ] Constitution custom (5 min)
- [ ] Spec.md user stories (5 min)
- [ ] Plan.md architecture (10 min)
- [ ] Tasks.md breakdown (10 min)

**Phase Bootstrap (2 min):**
- [ ] Sub-agents générés (4 agents)
- [ ] `.claude/commands/` populated

**Phase Implementation (3-4h):**
- [ ] T001-T078 completed
- [ ] Build success (P0 quality gate)
- [ ] Tests E2E pass (P2 quality gate)

**Phase Security (15 min review):**
- [ ] Jules PR reviewed
- [ ] Critical issues 0
- [ ] PR merged

**Phase Deploy (15 min):**
- [ ] Vercel production deploy
- [ ] DNS configured (si custom domain)
- [ ] Client demo livré

**Total:** 5h-6h (premier client) → 3h-4h (Context7 mature)

---

## 🎯 Résumé Workflow Multi-Client

**Setup One-Time (30 min):**
1. Créer `~/clients/_templates/` avec constitution, workflow, .env
2. Installer Spec-Kit, Context7 MCP, Jules CLI
3. Configurer GitHub CLI (`gh auth login`)

**Per-Client Routine (3-5h):**
1. **Planning:** Spec-Kit 30 min → spec.md + plan.md + tasks.md
2. **Bootstrap:** 2 min → 4 sub-agents générés
3. **Implementation:** 3-4h → Claude code T001-T078
4. **Security:** 15 min review → Jules PR merge
5. **Deploy:** 15 min → Vercel production

**Capacity:**
- **Jour 1:** 2 clients (10h)
- **Semaine 1:** 8-10 clients (40h)
- **Mois 1:** 32-40 clients (160h)

**Revenue Potential:**
- €1,500/client × 40 clients = €60,000/mois
- Coût: €118/mois (Claude + Jules)
- **Profit: €59,882/mois** (50,580% ROI)

---

**Version:** 1.0.0
**Last Updated:** 2025-10-07
**Maintained by:** Archon Orchestrator Team
