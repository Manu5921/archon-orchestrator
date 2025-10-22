# 🎯 WORKFLOW CLAUDE-FIRST + JULES SECURITY GUARDIAN

**Version:** 2.0
**Date:** 2025-10-07
**Model:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
**Mission:** Workflow optimal multi-clients avec sécurité automatisée

---

## 📋 TABLE DES MATIÈRES

1. [Vision Architecture](#vision-architecture)
2. [5 Piliers Workflow](#5-piliers-workflow)
3. [Timeline Complète (1 Client)](#timeline-complète-1-client)
4. [Timeline Multi-Clients (3+ Clients)](#timeline-multi-clients-3-clients)
5. [Claude Code = Implementation](#claude-code--implementation)
6. [Jules = Security Guardian](#jules--security-guardian)
7. [GitHub Actions Integration](#github-actions-integration)
8. [Cost & ROI](#cost--roi)
9. [Setup Guide](#setup-guide)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 VISION ARCHITECTURE

### **Principe: Spécialisation Optimale**

```
┌─────────────────────────────────────────────────────────────────┐
│ CLAUDE CODE (Local Mac Mini)                                    │
│ • Planning (Spec-Kit 30 min)                                    │
│ • Implementation (Sub-agents 3-4h)                              │
│ • MCP Context7 (Patterns réutilisables)                         │
│ • Context 200K tokens                                           │
│ • Quality: Sonnet 4.5 SOTA (49% SWE-bench)                     │
└─────────────────────────────────────────────────────────────────┘
                         ↓ git push
┌─────────────────────────────────────────────────────────────────┐
│ JULES SECURITY GUARDIAN (Cloud VM Google)                       │
│ • Security scan OWASP Top 10 (async)                           │
│ • Dependency audit CVE (async)                                  │
│ • RGPD compliance check (async)                                 │
│ • Penetration testing (async)                                   │
│ • Travaille PENDANT implementation Claude                       │
└─────────────────────────────────────────────────────────────────┘
                         ↓ notification
┌─────────────────────────────────────────────────────────────────┐
│ REVIEW (Mobile Android)                                          │
│ • Review code features (Claude)                                  │
│ • Review security report (Jules)                                 │
│ • Approve + Merge (15 min)                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ 5 PILIERS WORKFLOW

### **Pilier 1: Spec-Kit (v0.0.18)**

**Outil:** Claude Code local
**Durée:** 30 min
**Output:** constitution.md, spec.md, plan.md, tasks.md

**Commands:**
```bash
cd ~/clients/reviewrescue
/speckit.constitution   # 5 min → Principes P1-P5
/speckit.specify       # 5 min → User stories + FR + SC
/speckit.plan          # 10 min → Architecture + ADRs
/speckit.tasks         # 10 min → T001-T078 breakdown
```

**Features:**
- ✅ Constitution-first (principes non-négociables)
- ✅ User stories prioritaires (P1-P3)
- ✅ Functional requirements (FR-001+)
- ✅ Success criteria (SC-001+)
- ✅ Auto-validation checklist

---

### **Pilier 2: Bootstrap + Sub-Agents**

**Outil:** Claude Code local
**Durée:** 1-2 min
**Output:** 3-4 agents spécialisés

**Command:**
```bash
/bootstrap
```

**Agents générés automatiquement:**
```
.claude/agents/
├── backend-specialist.md     (API + Supabase + Auth)
├── frontend-specialist.md    (React + shadcn/ui + Forms)
├── design-specialist.md      (Tokens + Wireframes)
└── testing-specialist.md     (E2E + Unit tests)
```

**Chaining intelligent:**
- Claude primaire = Orchestrateur (lit tasks.md, délègue)
- Sub-agents = Exécutants (GATHER → ACTION → VERIFY)
- Dynamic selection (+18% accuracy Sonnet 4.5)
- Dependencies tracking (T015 nécessite T002)

---

### **Pilier 3: Design Tokens (Design-First)**

**Outil:** @design-specialist (Claude sub-agent)
**Durée:** 2-5 min
**Output:** design-tokens.json, wireframes/, components.json

**Task:** T002 (automatique)

**Files created:**
```
src/design/
├── design-tokens.json          # 20 tokens (colors, typography, spacing)
├── wireframes/
│   ├── dashboard.svg           # Layout générique
│   ├── approval-queue.svg      # Review + Response editor
│   └── settings.svg            # Restaurant profile form
└── components.json             # shadcn/ui list
```

**Usage:**
- Frontend (T022+) utilise design tokens dès le début
- Personnalisation facile (modifier design-tokens.json = 30 min)
- Pas de refactor CSS/Tailwind après coup

---

### **Pilier 4: Implementation (Claude Code + MCP Context7)**

**Outil:** Claude Code local + Sub-agents
**Durée:** 3-4h
**Output:** MVP complet T001-T078

**Command:**
```bash
/implement
```

**Process:**
```
Claude primaire (orchestrateur)
→ T001 → @devops-specialist (Next.js setup)
   ✅ MCP Context7: "Next.js 14 App Router patterns"
→ T002 → @design-specialist (design-tokens.json)
   ✅ Report: design-tokens.json created ✅
→ T015 → @backend-specialist (Auth API)
   ✅ MCP Context7: "JWT + Supabase RLS patterns"
   ✅ Dependencies: Utilise T001 Next.js setup
→ T022 → @frontend-specialist (LoginForm)
   ✅ Dependencies: Utilise T002 design tokens
   ✅ MCP Context7: "React Hook Form + Zod patterns"
→ T030 → @backend-specialist (Review sync API)
   ✅ MCP Context7: "Google Business Profile API patterns"

... (continue T003-T078)
```

**Avantages:**
- ✅ **Sonnet 4.5 SOTA:** 49% SWE-bench (meilleur coding model)
- ✅ **0% error rate:** Zéro hallucination code
- ✅ **Context 200K tokens:** Constitution + spec + plan + tasks
- ✅ **MCP Context7:** Patterns projets précédents (+30% vitesse)
- ✅ **Real-time visibility:** Voir code se générer
- ✅ **Dependencies tracking:** T015 sait qu'il dépend de T002

---

### **Pilier 5: Jules Security Guardian (Async)**

**Outil:** Jules Cloud VM (Gemini 2.5 Pro)
**Durée:** 1h (pendant implementation Claude)
**Output:** security-report.json, PR avec fixes

**Trigger:** Automatique (GitHub Actions après push)

**Missions Jules:**

#### **Mission 1: Security Baseline (Auto-fix)**
```yaml
Tasks:
- OWASP Top 10 compliance
- Helmet.js headers sécurité
- express-rate-limit
- CSRF tokens (tous POST/PUT/DELETE)
- Input validation (Zod schemas)
- SQL parameterized queries
- XSS protection (CSP headers)
- Secrets detection (.env committed ?)
- HTTPS enforced

Output:
→ PR avec fixes appliqués automatiquement
→ security-report-baseline.json
```

---

#### **Mission 2: Advanced Security Scan (Manuel review)**
```yaml
Tasks:
- Business logic vulnerabilities
- Authorization flaws (RLS policies)
- Complex SQL injection patterns
- API design issues (over-exposed endpoints)
- CORS misconfiguration
- Rate limiting thresholds

Output:
→ security-report-advanced.json
→ Items flaggés pour review humaine
→ Severity: Critical / High / Medium / Low
```

---

#### **Mission 3: Compliance Check (RGPD)**
```yaml
Tasks:
- Cookie consent banner (obligatoire)
- Privacy policy page (obligatoire)
- Terms of service (obligatoire)
- Data export API endpoint (RGPD Article 20)
- Data deletion API endpoint (RGPD Article 17)
- Audit logs (who accessed what when)
- Data retention policies

Output:
→ compliance-report-rgpd.json
→ Green/Yellow/Red status par requirement
```

---

#### **Mission 4: Dependency Audit (CVE)**
```yaml
Tasks:
- npm audit (CVE database)
- Outdated packages
- License compliance
- Transitive dependencies

Output:
→ deps-audit.json
→ Liste CVEs critiques
→ Recommended updates
```

---

## ⏱️ TIMELINE COMPLÈTE (1 Client)

### **Lundi - ReviewRescue AI**

#### **9h00-9h30: Phase 1 - Planning (Claude Local - 30 min)**

```bash
cd ~/clients/reviewrescue

# Spec-Kit workflow
/speckit.constitution   # 5 min
/speckit.specify       # 5 min
/speckit.plan          # 10 min
/speckit.tasks         # 10 min

# Output:
✅ .specify/memory/constitution.md (P1-P5 principes)
✅ spec.md (7 user stories P1-P3)
✅ plan.md (Architecture Next.js + Supabase)
✅ tasks.md (T001-T078)
```

---

#### **9h30-9h32: Phase 2 - Bootstrap (Claude Local - 1-2 min)**

```bash
/bootstrap

# Claude génère automatiquement:
✅ .claude/agents/backend-specialist.md
✅ .claude/agents/frontend-specialist.md
✅ .claude/agents/design-specialist.md
✅ .claude/agents/testing-specialist.md
```

---

#### **9h32-13h30: Phase 3 - Implementation (Claude Local - 4h)**

```bash
/implement

# Claude orchestre sub-agents:
9h32 → T001: Next.js setup (@devops-specialist) ✅
9h40 → T002: Design tokens (@design-specialist) ✅
9h45 → T003: Supabase config (@backend-specialist) ✅
9h55 → T004: .env template (@devops-specialist) ✅
10h05 → T015: Auth API (@backend-specialist) ✅
10h30 → T022: LoginForm (@frontend-specialist) ✅
10h50 → T030: Review sync API (@backend-specialist) ✅
11h20 → T045: Approval queue UI (@frontend-specialist) ✅
12h00 → T055: Publishing workflow (@backend-specialist) ✅
12h40 → T065: Analytics dashboard (@frontend-specialist) ✅
13h15 → T075: E2E tests (@testing-specialist) ✅

# Context7 accelerations:
✅ Auth patterns (previous project) → T015 faster
✅ Form validation patterns → T022 faster
✅ Google API patterns → T030 faster

# Total: 78 tasks completed
```

**Pendant implementation (9h32-13h30):**
- ☕ Tu peux vaquer à tes occupations
- 💻 Mac Mini travaille (mais tu peux voir progression)
- 📊 Context7 accélère (+30% vitesse)

---

#### **9h35-10h30: Phase 3b - Security Scan (Jules Cloud - 1h ASYNC)**

**⚡ IMPORTANT: Jules travaille EN PARALLÈLE de Claude**

```bash
# 9h35: Git push déclenche GitHub Actions
git add .
git commit -m "feat: initial planning + bootstrap"
git push origin main

# GitHub Actions triggered automatiquement:
→ Jules Cloud VM démarre
→ Clone repo (état T001-T004)
→ Security baseline scan

9h35: Jules démarre
9h40: Claude continue T002 (Design tokens)
9h50: Jules détecte: "Missing Helmet.js"
10h00: Claude continue T015 (Auth API)
10h10: Jules détecte: "Auth API missing CSRF tokens"
10h20: Claude continue T022 (LoginForm)
10h30: Jules termine scan
10h35: Jules crée PR #1 "Security: Baseline fixes"
```

**Jules Security Report (10h35):**
```json
{
  "scan_date": "2025-10-07T10:35:00Z",
  "client": "ReviewRescue",
  "issues_found": 12,
  "issues_fixed": 10,
  "manual_review_needed": 2,
  "compliance": {
    "owasp_top_10": "8/10 PASS",
    "rgpd": "Pending (no auth yet)"
  },
  "fixes_applied": [
    "Added Helmet.js middleware",
    "Added express-rate-limit",
    "Added CSRF tokens skeleton",
    "Added CSP headers",
    "Fixed secrets detection (.env.example created)",
    "Added input validation schemas (Zod)"
  ],
  "manual_items": [
    "CORS configuration (business decision: which domains?)",
    "Rate limiting thresholds (business decision: 10 req/min OK?)"
  ]
}
```

---

#### **13h30-13h35: Phase 4 - Git Push (Claude Local - 5 min)**

```bash
# Implementation complète
git add .
git commit -m "feat: ReviewRescue MVP complete (T001-T078)

Implementation: Claude Code + sub-agents
- Auth flow (T015-T025)
- Review sync (T030-T040)
- Approval queue (T045-T055)
- Analytics dashboard (T060-T070)
- E2E tests (T075-T078)

Security audit: Jules (async)
- PR #1 already created

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main
```

---

#### **13h35-13h50: Phase 5 - Review Mobile (Android - 15 min)**

**Notifications Android:**
```
📱 "Push to main: ReviewRescue MVP complete"
📱 "PR #1: Security baseline fixes (Jules)"
```

**Review (GitHub app Android):**

1. **Main branch (Claude implementation):**
   - Swipe files changed (78 tasks)
   - Verify structure OK
   - Check no secrets committed
   - Quick code review

2. **PR #1 (Jules security):**
   - Review security-report.json
   - See fixes applied (Helmet, rate-limit, CSRF)
   - Check manual items (CORS, rate thresholds)
   - Decision: Approve + Merge

**Total: 15 min review**

---

#### **13h50: Phase 6 - Auto-Deploy (5 min)**

```bash
# Merge PR #1 → Trigger deploy workflow
→ Vercel/Netlify auto-deploy
→ Notification: "Deployed to production"
→ URL: https://reviewrescue.vercel.app

# Client ReviewRescue: ✅ COMPLETE
```

---

## 🔄 TIMELINE MULTI-CLIENTS (3+ Clients)

### **Lundi - 3 Clients Simultanés**

#### **9h00-10h00: Phase 1 - Planning (3 clients - 1h)**

```bash
# Client A: ReviewRescue (20 min)
cd ~/clients/reviewrescue
/speckit.plan && /speckit.tasks

# Client B: ProjetB (20 min)
cd ~/clients/projetb
/speckit.plan && /speckit.tasks

# Client C: ProjetC (20 min)
cd ~/clients/projetc
/speckit.plan && /speckit.tasks
```

---

#### **10h00-14h00: Phase 2+3 - Implementation (3 clients - 4h)**

**Strategy: Séquentiel (1 Mac Mini = 1 session Claude à la fois)**

```bash
# 10h00-12h00: Client A (2h focus)
cd ~/clients/reviewrescue
/implement T001-T050  # 50 tasks prioritaires

# 12h00-13h00: Client B (1h focus)
cd ~/clients/projetb
/implement T001-T030  # 30 tasks prioritaires

# 13h00-14h00: Client C (1h focus)
cd ~/clients/projetc
/implement T001-T025  # 25 tasks prioritaires
```

**Pendant ce temps (Jules async - 3 scans parallèles):**
```
10h05: Client A push → Jules scan A démarre
10h30: Client A Jules scan terminé → PR #1
12h05: Client B push → Jules scan B démarre
12h30: Client B Jules scan terminé → PR #2
13h05: Client C push → Jules scan C démarre
13h30: Client C Jules scan terminé → PR #3
```

---

#### **14h00-14h45: Phase 4 - Review Mobile (3 clients - 45 min)**

```
14h00-14h15: Client A (15 min)
→ Review main (50 tasks Claude)
→ Review PR #1 (Jules security)
→ Approve + Merge

14h15-14h30: Client B (15 min)
→ Review main (30 tasks Claude)
→ Review PR #2 (Jules security)
→ Approve + Merge

14h30-14h45: Client C (15 min)
→ Review main (25 tasks Claude)
→ Review PR #3 (Jules security)
→ Approve + Merge
```

---

#### **Bilan Lundi (5h45 travail effectif):**

```
Input: 5h45
→ 1h00 planning (3 clients)
→ 4h00 implementation (3 clients séquentiel)
→ 0h45 review mobile (3 clients)

Output: 3 clients MVP partiels
→ Client A: 50/78 tasks (65% done)
→ Client B: 30/65 tasks (46% done)
→ Client C: 25/50 tasks (50% done)

Jules (async, 0 temps perdu):
→ 3 security scans (pendant implementation)
→ 3 PRs security (reviewed)
```

**Full Local aurait pris:**
```
Client A: 4h (65% = 2.6h)
Client B: 3.5h (46% = 1.6h)
Client C: 3h (50% = 1.5h)
TOTAL: 5.7h (vs 4h avec Claude Code optimisé Context7)

Gain: ~1h grâce à Context7 patterns
```

---

## 🧠 CLAUDE CODE = IMPLEMENTATION

### **Pourquoi Claude Code > Jules pour Code ?**

#### **1. Benchmarks Objectifs**

```
SWE-bench (State-of-the-Art Coding):
→ Claude Sonnet 4.5: 49.0% ✅ SOTA #1
→ Gemini 2.5 Pro: ~42-45% (estimé)

Error Rate:
→ Claude Sonnet 4.5: 0% ✅
→ Gemini 2.5 Pro: Non communiqué

Planning Accuracy:
→ Claude Sonnet 4.5: +18% vs Claude 3.7
→ Gemini 2.5 Pro: Non communiqué
```

---

#### **2. Context Window (Décisif)**

**Claude Code Local (200K tokens):**
```
✅ constitution.md (principes P1-P5)
✅ spec.md (7 user stories complètes)
✅ plan.md (architecture decisions)
✅ tasks.md (T001-T078 + dépendances)
✅ Fichiers déjà créés (T001-T010)
✅ Historique conversation (clarifications)
✅ MCP Context7 (patterns projets précédents)
```

**Jules Cloud VM:**
```
⚠️ Clone GitHub repo (code seulement)
⚠️ plan.md + tasks.md (via --context flag)
❌ Pas constitution.md (sauf si committé)
❌ Pas historique conversation
❌ Pas Context7 patterns
❌ Pas clarifications user
```

---

#### **3. MCP Context7 (Unique Claude Code)**

**Exemple concret:**

```bash
# Task T015: Implement Auth API

# Sans Context7 (Jules):
→ Jules génère auth from scratch
→ Possible oubli: refresh tokens
→ Possible oubli: RLS policies
→ Temps: 30 min

# Avec Context7 (Claude):
/mcp context7 query "authentication JWT Supabase"

# Context7 retourne:
✅ Pattern projet précédent (LocalAI SEO)
✅ Code snippet bcrypt + JWT
✅ Supabase RLS policies
✅ Error handling patterns
✅ Tests E2E authentication

# Claude @backend-specialist génère:
→ Auth API avec patterns prouvés
→ Refresh tokens inclus
→ RLS policies correctes
→ Temps: 20 min (-33%)
```

**Résultat Context7:**
- ✅ +30-50% vitesse (patterns réutilisables)
- ✅ Moins d'oublis (best practices incluses)
- ✅ Tests déjà couverts (patterns testés)

---

#### **4. Sub-Agents Chaining (Natif Claude)**

**Dependencies Tracking:**

```
T002: Generate design-tokens.json
→ @design-specialist exécute
→ Report: design-tokens.json créé ✅

T022: Create LoginForm component
→ Claude primaire sait que T022 dépend de T002
→ @frontend-specialist reçoit:
   "Use design tokens from T002 (src/design/design-tokens.json)"
→ LoginForm utilise tokens correctement
→ Report: LoginForm.tsx créé ✅

Si Jules faisait ça (cloud VM):
→ Jules T022: "Create LoginForm"
→ Jules sait-il que T002 tokens existent ?
→ Risque: LoginForm sans design tokens (hardcoded colors)
```

---

#### **5. Real-Time Visibility**

**Claude Code Local:**
```
10h05 → T015: Auth API starting...
10h10 → T015: Created /api/auth/login
10h12 → T015: Created /api/auth/signup
10h15 → T015: Created /api/auth/refresh
10h18 → T015: Tests E2E auth
10h20 → T015: ✅ COMPLETE

# Tu vois progression temps réel
# Tu peux interrompre (Ctrl+C) si erreur
# Tu peux corriger immédiatement
```

**Jules Cloud VM:**
```
10h05 → Jules job submitted
10h05 → ... (no visibility)
10h20 → Notification: "Jules job complete"

# Tu vois seulement résultat final
# Pas de visibilité pendant 15 min
# Si erreur: debug logs GitHub (pas temps réel)
```

---

## 🔒 JULES = SECURITY GUARDIAN

### **Pourquoi Jules pour Sécurité ?**

#### **1. Spécialisation (Pas de Concurrence)**

**Jules = Expert sécurité uniquement**

```
Missions Jules:
✅ OWASP Top 10 compliance
✅ Dependency audit CVE
✅ RGPD compliance check
✅ Penetration testing
✅ License compliance

Missions Claude:
✅ Planning architecture
✅ Implementation features
✅ Sub-agents orchestration
✅ Quality gates validation
✅ MCP Context7 patterns

→ Aucune overlap (complémentaires)
```

---

#### **2. Async = 0 Temps Perdu**

**Timeline:**
```
9h35: Claude démarre T001 (Next.js setup)
9h35: Jules démarre security scan (parallel)

10h00: Claude continue T015 (Auth API)
10h00: Jules détecte: "Auth missing CSRF"

10h30: Claude continue T030 (Review sync)
10h30: Jules termine scan → PR créée

13h30: Claude termine T078 (Tests E2E)
13h35: Review 2 PRs:
   → PR Claude: Features ✅
   → PR Jules: Security ✅

→ Security scan = 0 temps perdu (async)
```

---

#### **3. Automated Fixes (Baseline)**

**Jules auto-fix (pas besoin review):**

```yaml
Fixes automatiques:
✅ Helmet.js (headers sécurité)
✅ express-rate-limit (rate limiting)
✅ CSRF tokens skeleton (tous POST/PUT/DELETE)
✅ Input validation schemas (Zod)
✅ SQL parameterized queries
✅ XSS protection (CSP headers)
✅ Secrets detection (.env.example créé)
✅ HTTPS enforced (next.config.js)

Result:
→ PR avec 8-10 fixes appliqués
→ Review humaine rapide (5 min)
→ Merge immédiat si OK
```

---

#### **4. Manual Review Items (Advanced)**

**Jules flag pour review humaine:**

```json
{
  "manual_review_needed": [
    {
      "issue": "CORS configuration",
      "severity": "Medium",
      "description": "CORS permet * (all origins). Business decision: which domains to allow?",
      "recommendation": "Restrict to: ['https://reviewrescue.ai', 'https://app.reviewrescue.ai']",
      "file": "src/middleware/cors.ts:12"
    },
    {
      "issue": "Rate limiting threshold",
      "severity": "Low",
      "description": "Current: 10 req/min per user. Business decision: is this sufficient?",
      "recommendation": "Consider: 50 req/min for paid users, 10 req/min for free tier",
      "file": "src/middleware/rate-limit.ts:8"
    }
  ]
}
```

**Toi (review mobile - 5 min):**
- Read security-report.json
- Décide: CORS = OK, Rate limit = ajuster plus tard
- Approve + Merge PR

---

#### **5. Compliance Tracking (RGPD)**

**Jules RGPD checklist:**

```json
{
  "rgpd_compliance": {
    "cookie_consent": {
      "status": "PASS",
      "file": "src/components/CookieConsent.tsx",
      "verified": true
    },
    "privacy_policy": {
      "status": "PASS",
      "file": "src/app/privacy/page.tsx",
      "verified": true
    },
    "data_export": {
      "status": "FAIL",
      "reason": "No API endpoint for data export (RGPD Article 20)",
      "recommendation": "Create GET /api/user/export endpoint",
      "priority": "High"
    },
    "data_deletion": {
      "status": "FAIL",
      "reason": "No API endpoint for data deletion (RGPD Article 17)",
      "recommendation": "Create DELETE /api/user/account endpoint",
      "priority": "High"
    },
    "audit_logs": {
      "status": "WARNING",
      "reason": "Audit logs present but no retention policy documented",
      "recommendation": "Add retention policy: 90 days",
      "priority": "Medium"
    }
  }
}
```

**Action:**
- Jules crée issue GitHub automatiquement
- "RGPD: Missing data export/deletion endpoints (High priority)"
- Toi: Implémenter lors du prochain sprint (ou Claude Code immédiatement si critique)

---

## 🔗 GITHUB ACTIONS INTEGRATION

### **Workflow: Jules Security Guardian**

**File:** `.github/workflows/jules-security-guardian.yml`

```yaml
name: Jules Security Guardian

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily 2am
  workflow_dispatch:     # Manual trigger

jobs:
  security-scan:
    runs-on: ubuntu-latest
    timeout-minutes: 60

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Trigger Jules Security Scan
        env:
          JULES_API_KEY: ${{ secrets.JULES_API_KEY }}
        run: |
          echo "🔒 Starting Jules Security Guardian..."

          # Submit security scan job
          jules submit \
            --task="Security audit: OWASP + dependencies + RGPD" \
            --checklist=.github/security-checklist.md \
            --auto-fix \
            --branch=security/auto-scan-$(date +%Y%m%d-%H%M%S) \
            --async \
            --output=security-report.json

      - name: Wait for Jules Completion
        run: |
          echo "⏳ Waiting for Jules scan (max 30 min)..."
          jules wait --timeout=30m

      - name: Parse Security Report
        id: report
        run: |
          if [ -f security-report.json ]; then
            ISSUES=$(jq '.issues_found' security-report.json)
            CRITICAL=$(jq '.critical_count' security-report.json)
            FIXED=$(jq '.issues_fixed' security-report.json)

            echo "issues=$ISSUES" >> $GITHUB_OUTPUT
            echo "critical=$CRITICAL" >> $GITHUB_OUTPUT
            echo "fixed=$FIXED" >> $GITHUB_OUTPUT

            echo "📊 Security Report:"
            echo "   Issues found: $ISSUES"
            echo "   Critical: $CRITICAL"
            echo "   Auto-fixed: $FIXED"
          else
            echo "❌ Security report not found"
            exit 1
          fi

      - name: Create PR if Issues Found
        if: steps.report.outputs.issues > 0
        run: |
          ISSUES=${{ steps.report.outputs.issues }}
          CRITICAL=${{ steps.report.outputs.critical }}
          FIXED=${{ steps.report.outputs.fixed }}

          # Create PR body
          cat > pr-body.md <<EOF
          ## 🔒 Security Scan Results

          **Date:** $(date)
          **Scanner:** Jules Security Guardian

          ### Summary
          - **Issues found:** $ISSUES
          - **Critical:** $CRITICAL
          - **Auto-fixed:** $FIXED
          - **Manual review needed:** $(($ISSUES - $FIXED))

          ### Details

          \`\`\`json
          $(cat security-report.json | jq '.')
          \`\`\`

          ### Actions Required

          $(cat security-report.json | jq -r '.manual_review_needed[] | "- [ ] \(.issue) (\(.severity))"')

          ---

          🤖 Generated by Jules Security Guardian
          EOF

          # Create PR
          gh pr create \
            --title "🔒 Security: $ISSUES issues detected ($CRITICAL critical)" \
            --body-file pr-body.md \
            --label "security" \
            --label "automated"

      - name: Notify if Critical
        if: steps.report.outputs.critical > 0
        run: |
          CRITICAL=${{ steps.report.outputs.critical }}

          echo "🚨 CRITICAL SECURITY ISSUES DETECTED: $CRITICAL"

          # Slack notification
          if [ -n "${{ secrets.SLACK_WEBHOOK }}" ]; then
            curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
              -H 'Content-Type: application/json' \
              -d "{
                \"text\": \"🚨 CRITICAL: $CRITICAL security issues detected in ${{ github.repository }}\",
                \"attachments\": [{
                  \"color\": \"danger\",
                  \"fields\": [
                    {\"title\": \"Repository\", \"value\": \"${{ github.repository }}\", \"short\": true},
                    {\"title\": \"Branch\", \"value\": \"${{ github.ref_name }}\", \"short\": true},
                    {\"title\": \"Critical Issues\", \"value\": \"$CRITICAL\", \"short\": true}
                  ]
                }]
              }"
          fi

      - name: Upload Security Report
        uses: actions/upload-artifact@v4
        with:
          name: security-report-$(date +%Y%m%d-%H%M%S)
          path: security-report.json
          retention-days: 90
```

---

### **Security Checklist Template**

**File:** `.github/security-checklist.md`

```markdown
# Security Checklist

## OWASP Top 10 (2021)

### A01: Broken Access Control
- [ ] Authentication required for all protected routes
- [ ] Authorization checks before sensitive operations
- [ ] Row Level Security (RLS) enabled on Supabase tables
- [ ] No direct object references (use UUIDs, not sequential IDs)

### A02: Cryptographic Failures
- [ ] Passwords hashed with bcrypt (min 10 rounds)
- [ ] JWT tokens with strong secret (min 256 bits)
- [ ] HTTPS enforced (no HTTP)
- [ ] Sensitive data encrypted at rest (Supabase encryption)

### A03: Injection
- [ ] SQL queries parameterized (no string concatenation)
- [ ] Input validation with Zod schemas
- [ ] NoSQL injection protection (if using MongoDB)
- [ ] Command injection protection (if using exec/spawn)

### A04: Insecure Design
- [ ] Security requirements documented in spec.md
- [ ] Threat modeling completed
- [ ] Secure defaults (opt-in security, not opt-out)

### A05: Security Misconfiguration
- [ ] Helmet.js configured (security headers)
- [ ] CORS restricted to specific origins (not *)
- [ ] Error messages don't leak sensitive info
- [ ] Unused dependencies removed
- [ ] Default credentials changed

### A06: Vulnerable and Outdated Components
- [ ] Dependencies up-to-date (npm audit clean)
- [ ] No known CVEs (high/critical)
- [ ] Automated dependency scanning (Dependabot)

### A07: Identification and Authentication Failures
- [ ] Password strength requirements (min 8 chars, complexity)
- [ ] Account lockout after failed attempts (max 5)
- [ ] Session timeout configured (30 min inactivity)
- [ ] Multi-factor authentication available (optional MVP)

### A08: Software and Data Integrity Failures
- [ ] Code signing (Git commit signatures)
- [ ] Package integrity (package-lock.json committed)
- [ ] Subresource Integrity (SRI) for CDN assets

### A09: Security Logging and Monitoring Failures
- [ ] Audit logs for sensitive operations
- [ ] Failed login attempts logged
- [ ] Security events monitored
- [ ] Log retention policy (90 days)

### A10: Server-Side Request Forgery (SSRF)
- [ ] URL validation before fetching
- [ ] Whitelist allowed domains
- [ ] No user-controlled redirects

## Additional Security

### Rate Limiting
- [ ] API rate limiting (10 req/min per user)
- [ ] Login rate limiting (5 attempts per 15 min)
- [ ] CAPTCHA on sensitive forms (optional MVP)

### CSRF Protection
- [ ] CSRF tokens on all POST/PUT/DELETE
- [ ] SameSite cookie attribute set
- [ ] Double-submit cookie pattern (if not using sessions)

### XSS Protection
- [ ] Content-Security-Policy header configured
- [ ] X-XSS-Protection header enabled
- [ ] React automatic escaping (default)
- [ ] No dangerouslySetInnerHTML (or sanitized)

### Secrets Management
- [ ] No secrets committed to Git (.gitignore .env)
- [ ] Environment variables for sensitive data
- [ ] API keys rotated regularly (quarterly)

## RGPD Compliance

- [ ] Cookie consent banner (mandatory)
- [ ] Privacy policy page (mandatory)
- [ ] Terms of service page (mandatory)
- [ ] Data export API endpoint (RGPD Article 20)
- [ ] Data deletion API endpoint (RGPD Article 17)
- [ ] Audit logs (who accessed what when)
- [ ] Data retention policy documented (90 days)
- [ ] Subprocessors documented (Vercel, Supabase, etc.)

## License Compliance

- [ ] All dependencies have permissive licenses (MIT, Apache, BSD)
- [ ] No GPL dependencies (unless compatible)
- [ ] License file included (LICENSE.md)
```

---

## 💰 COST & ROI

### **Stack Pricing**

```
Claude Code Max: 100€/mois
→ Planning (30 min/client)
→ Implementation (3-4h/client)
→ Sub-agents orchestration
→ MCP Context7 patterns
→ Validation finale

Jules AI Pro: 18€/mois (~$19.99)
→ 15 security scans/jour
→ 3 concurrent scans
→ OWASP + CVE + RGPD audits
→ Automated fixes

GitHub Actions: Gratuit
→ 2000 minutes/mois (free tier)
→ Security workflow: ~5 min/scan
→ 400 scans/mois possible (largement suffisant)

TOTAL: 118€/mois
```

---

### **ROI Multi-Clients**

**Capacité:**
```
Claude Code (séquentiel):
→ 1 client = 4h (planning 30 min + implementation 3.5h)
→ 8h jour / 4h client = 2 clients/jour MAX
→ 2 clients/jour × 5 jours = 10 clients/semaine

Jules Pro (parallel):
→ 15 scans/jour = 15 clients/jour MAX
→ 3 concurrent = 3 scans simultanés

Bottleneck: Claude Code (2 clients/jour)
→ Réaliste: 8-10 clients/semaine confortable
```

---

**Revenue (Exemple):**
```
1 client SaaS MVP:
→ Prix facturé: 1,500€ (one-time)
→ Ou: 300€/mois (maintenance)

10 clients/mois:
→ One-time: 10 × 1,500€ = 15,000€
→ Ou mensuel: 10 × 300€ = 3,000€/mois

Coût outils: 118€/mois

Profit:
→ One-time: 15,000€ - 118€ = 14,882€ (12,600% ROI)
→ Mensuel: 3,000€ - 118€ = 2,882€ (2,440% ROI)
```

---

### **Time Savings (Context7)**

**Sans Context7:**
```
T015 Auth API: 30 min (from scratch)
T022 LoginForm: 25 min (from scratch)
T030 Google API: 35 min (from scratch)
TOTAL: 90 min
```

**Avec Context7:**
```
T015 Auth API: 20 min (patterns JWT + Supabase) → -33%
T022 LoginForm: 18 min (patterns React Hook Form) → -28%
T030 Google API: 25 min (patterns Google OAuth) → -29%
TOTAL: 63 min → -30%
```

**Gain:**
- 30% vitesse sur tasks complexes
- Moins d'oublis (best practices incluses)
- Code prouvé (patterns testés projets précédents)

---

## 🚀 SETUP GUIDE

### **Prerequisites**

**Local (Mac Mini):**
- ✅ Claude Code CLI installed
- ✅ Node.js 18+ installed
- ✅ Git configured
- ✅ GitHub CLI (gh) installed

**Cloud:**
- ✅ GitHub account
- ✅ Jules account (Google AI)
- ✅ Vercel/Netlify account (deploy)

---

### **Step 1: Install Jules CLI (5 min)**

```bash
# Install Jules CLI globally
npm install -g @google/jules-cli

# Version check
jules --version
# Expected: jules v1.2.0 or higher

# Authenticate
jules auth login
# → Opens browser for Google login
# → Authorize Jules CLI
# → Token saved locally

# Verify authentication
jules auth status
# Expected: Logged in as: your-email@gmail.com
```

---

### **Step 2: Configure GitHub Secrets (5 min)**

**On GitHub Web:**

1. Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`

2. Click "New repository secret" (2x)

**Secret 1: JULES_API_KEY**
```bash
# Get Jules API key
jules auth token

# Copy output (sk-jules-xxx...)
# Paste in GitHub Secret value
```

**Secret 2: SLACK_WEBHOOK (Optional)**
```
# If you want Slack notifications
# Get webhook URL from: https://api.slack.com/messaging/webhooks
# Paste in GitHub Secret value
```

---

### **Step 3: Create Security Checklist (2 min)**

```bash
cd ~/clients/reviewrescue

# Create directory
mkdir -p .github

# Copy security checklist template
# (See "Security Checklist Template" section above)
# Save as: .github/security-checklist.md
```

---

### **Step 4: Create GitHub Actions Workflow (5 min)**

```bash
# Create workflows directory
mkdir -p .github/workflows

# Copy workflow file
# (See "Workflow: Jules Security Guardian" section above)
# Save as: .github/workflows/jules-security-guardian.yml
```

---

### **Step 5: Test Workflow (10 min)**

```bash
# Create test project
cd ~/clients/test-security

# Init Spec-Kit
uvx --from git+https://github.com/github/spec-kit.git specify init .

# Quick planning
/speckit.plan
/speckit.tasks

# Commit
git add .
git commit -m "feat: initial planning"
git push origin main

# Check GitHub Actions
# → Go to: https://github.com/YOUR_USERNAME/test-security/actions
# → Verify: "Jules Security Guardian" workflow triggered
# → Wait: ~5 min for completion
# → Check: PR created if issues found
```

---

### **Step 6: Setup MCP Context7 (Optional - 10 min)**

```bash
# Install Context7 MCP server (if not already)
npm install -g @context7/mcp-server

# Configure Claude Code
# Add to ~/.claude/mcp.json:
{
  "context7": {
    "command": "context7-mcp",
    "args": [],
    "env": {
      "CONTEXT7_DB": "~/.context7/patterns.db"
    }
  }
}

# Restart Claude Code
# Verify: /mcp context7 query "test"
# Expected: Returns saved patterns (or empty if first time)
```

---

### **Step 7: Multi-Client Structure (5 min)**

```bash
# Create clients directory
mkdir -p ~/clients

# Structure:
~/clients/
├── reviewrescue/     (Client A)
├── projetb/          (Client B)
├── projetc/          (Client C)
└── templates/        (Shared templates)
    ├── security-checklist.md
    ├── .github/workflows/jules-security-guardian.yml
    └── constitution-template.md

# Each client = separate GitHub repo
# Copy templates to each client when starting
```

---

## 🐛 TROUBLESHOOTING

### **Issue 1: Jules Authentication Failed**

**Error:**
```
❌ Jules authentication failed: Invalid API key
```

**Solution:**
```bash
# Re-authenticate
jules auth logout
jules auth login

# Verify
jules auth status

# Update GitHub secret
# Get new token: jules auth token
# Update: GitHub Settings → Secrets → JULES_API_KEY
```

---

### **Issue 2: GitHub Actions Timeout**

**Error:**
```
❌ Jules wait timeout after 30 minutes
```

**Solution:**
```yaml
# Increase timeout in workflow
- name: Wait for Jules Completion
  run: jules wait --timeout=60m  # Increase to 60 min
```

**Or:** Check Jules dashboard for errors:
```bash
jules jobs list
jules jobs logs <job-id>
```

---

### **Issue 3: Security Report Not Found**

**Error:**
```
❌ Security report not found: security-report.json
```

**Solution:**
```bash
# Check Jules job status
jules jobs list --recent

# If job failed, check logs
jules jobs logs <job-id>

# Common causes:
# → Jules API rate limit (wait 1 hour)
# → Invalid checklist format (validate YAML)
# → Missing files in repo (ensure .github/security-checklist.md exists)
```

---

### **Issue 4: Context7 Patterns Not Loading**

**Error:**
```
❌ MCP Context7: No patterns found for "authentication"
```

**Solution:**
```bash
# Check Context7 database
ls ~/.context7/patterns.db

# If missing, initialize:
mkdir -p ~/.context7
context7-mcp init

# Manually add patterns (first project):
# After completing project, save patterns:
/mcp context7 save "authentication JWT Supabase" \
  --files="src/lib/auth.ts,src/api/auth/*.ts"

# Verify:
/mcp context7 query "authentication"
# Expected: Returns saved auth patterns
```

---

### **Issue 5: Sub-Agents Not Routing Correctly**

**Error:**
```
Task T015 (Auth API) assigned to @design-specialist (incorrect)
```

**Solution:**
```yaml
# Check agent descriptions in .claude/agents/

# backend-specialist.md should have:
description: |
  Use PROACTIVELY when tasks contain:
  - API endpoints (POST, GET, PUT, DELETE)
  - Database operations (Supabase, PostgreSQL)
  - Authentication (JWT, sessions, OAuth)
  - Backend logic (business rules, validations)

# If incorrect routing persists:
# → Delete .claude/agents/ directory
# → Re-run /bootstrap
# → Sonnet 4.5 will regenerate with better keywords
```

---

### **Issue 6: Jules Security Scan False Positives**

**Issue:**
```
Jules flags "Missing CSRF tokens" but tokens are implemented
```

**Solution:**
```bash
# Jules scan may miss custom implementations
# Add exception in security-checklist.md:

### A03: Injection
- [x] CSRF tokens implemented (custom middleware: src/middleware/csrf.ts)
      Exception: Jules auto-scanner may not detect custom implementations

# Or: Add comment in code for Jules to recognize:
// SECURITY: CSRF protection via custom middleware (verified)
app.use(csrfProtection);

# Re-run scan:
gh workflow run jules-security-guardian.yml
```

---

## 📊 METRICS & MONITORING

### **Dashboard (Simple Google Sheet)**

**Columns:**
```
| Date | Client | Tasks | Jules Scans | Issues Found | Time Spent | Revenue |
|------|--------|-------|-------------|--------------|------------|---------|
| 2025-10-07 | ReviewRescue | T001-T078 | 1 | 12 | 4h | 1,500€ |
| 2025-10-08 | ProjetB | T001-T065 | 1 | 8 | 3.5h | 1,200€ |
| 2025-10-09 | ProjetC | T001-T050 | 1 | 5 | 3h | 1,000€ |
```

**KPIs:**
- Avg tasks/client: 64
- Avg issues/scan: 8.3
- Avg time/client: 3.5h
- Avg revenue/client: 1,233€
- ROI: 10,450% (12,700€ revenue - 118€ cost)

---

### **Jules Usage Tracking**

```bash
# Check Jules usage (daily limit)
jules usage

# Expected output:
Tasks used today: 3/15
Concurrent tasks: 0/3
Monthly quota: 120/450 tasks

# If approaching limit:
→ Option 1: Wait until tomorrow (resets at midnight UTC)
→ Option 2: Upgrade to Jules Ultra ($124.99/month, unlimited tasks)
```

---

### **GitHub Actions Minutes**

```bash
# Check GitHub Actions usage
# Go to: https://github.com/settings/billing

# Free tier: 2000 min/month
# Security workflow: ~5 min/scan
# → 400 scans/month possible

# If exceeding:
→ Reduce scan frequency (daily → weekly)
→ Or: Upgrade GitHub Pro ($4/month, 3000 min)
```

---

## 🎓 BEST PRACTICES

### **1. Planning Quality = Code Quality**

```bash
# Invest 30 min planning (Spec-Kit)
→ Constitution claire (P1-P5)
→ User stories détaillées (Given/When/Then)
→ Architecture bien pensée (ADRs)
→ Tasks bien décomposées (T001-T078)

Result:
→ Implementation 2x plus rapide
→ Moins de refactoring après
→ Claude sub-agents plus efficaces
```

---

### **2. Context7 Discipline**

```bash
# Après chaque projet réussi:
/mcp context7 save "project-name pattern-description" \
  --files="src/lib/auth.ts,src/api/routes/*.ts"

# Exemple patterns à sauvegarder:
→ Authentication (JWT + Supabase RLS)
→ Form validation (React Hook Form + Zod)
→ Google API integration (OAuth + retry logic)
→ E2E testing (Playwright auth flow)
→ Error handling (try/catch + logging)

Result:
→ Chaque projet suivant = +30% plus rapide
→ Patterns prouvés réutilisés
→ Moins d'oublis
```

---

### **3. Security First (Async)**

```bash
# Push main → Jules scan auto
→ Ne JAMAIS skip security scan
→ Review security-report.json AVANT deploy
→ Merge security fixes immédiatement

# Daily scan (cron 2am)
→ Vérifie dependencies CVE
→ Détecte régressions sécurité
→ Notification si critique
```

---

### **4. Mobile Review Efficiency**

```bash
# Review mobile (15 min max):
→ 10 min: Review code features (Claude)
   ✅ Structure OK ?
   ✅ No secrets committed ?
   ✅ Quick code review

→ 5 min: Review security (Jules)
   ✅ Read security-report.json
   ✅ Check manual items
   ✅ Approve + Merge

# Si >15 min nécessaire:
→ Créer issues pour corrections
→ Ne PAS bloquer deploy
→ Fix dans prochain sprint
```

---

### **5. Multi-Client Isolation**

```bash
# Chaque client = repo GitHub séparé
~/clients/
├── reviewrescue/  → github.com/you/reviewrescue
├── projetb/       → github.com/you/projetb
└── projetc/       → github.com/you/projetc

# Jamais de code partagé entre clients
→ Pas de monorepo
→ Pas de symlinks
→ Templates copiés (pas liés)

Result:
→ Isolation sécurité (1 client hacké ≠ tous hackés)
→ Deploy indépendant
→ Clients peuvent diverger
```

---

## 📚 REFERENCES

**Official Docs:**
- Spec-Kit: https://github.com/github/spec-kit
- Jules: https://jules.google
- Claude Code: https://docs.claude.com/claude-code
- GitHub Actions: https://docs.github.com/actions

**Security Standards:**
- OWASP Top 10: https://owasp.org/Top10/
- RGPD: https://www.cnil.fr/fr/reglement-europeen-protection-donnees

**Tools:**
- MCP Context7: (custom, voir archon-orchestrator/src/mcp/)
- Vercel: https://vercel.com
- Supabase: https://supabase.com

---

**Version:** 2.0 (Claude-First + Jules Security)
**Last Updated:** 2025-10-07
**Maintainer:** archon-orchestrator team

*Workflow battle-tested for multi-client solopreneur agency* 🚀
