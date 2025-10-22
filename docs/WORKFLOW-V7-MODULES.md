# Workflow V7 - Modules Integration

**Version:** V7.0 "Modules First"
**Date:** 2025-10-22
**Status:** 🚧 **PLANNED** (Design Document)
**Base:** V6 MVP + lib/ modules integration

---

## 🎯 Overview

**V7 = V6 MVP + Module Selection Phase**

**Key Innovation:**
- **Phase 0.5 NEW:** `/speckit.modules` - Interactive module selection
- Modules chosen BEFORE planning (spec.md updated)
- Tasks generated WITH modules (not from scratch)
- Implementation uses modules (copy + integrate, not code)

**Time Savings:**
- Planning: -29% (25 min vs 35 min)
- Tasks: -50% (50 tasks vs 99)
- Implementation: -57% (3h vs 7h)
- **Total MVP: -50% (4h vs 8h)**

---

## 📋 Complete Workflow (6 Phases)

### Phase 0: Gemini Analysis (5-10 min) - RECOMMENDED

**Command:**
```bash
/zen-roundtable "Brief: Je veux créer une app SaaS pour gérer des campagnes publicitaires avec tracking ROI en temps réel"
```

**What Happens:**

1. **Gemini 2.5-pro Analysis (2-3 min):**
   - Problem + User Value validation
   - Business model (pricing, monetization)
   - Market analysis (competitors, positioning)
   - Technical architecture (3 options with pros/cons)
   - Development timeline
   - Critical risks (blind spots)
   - Radical alternatives (pivot options)

2. **Claude Synthesis (2-5 min):**
   - Creates `constitution.md` (business vision)
   - Creates `spec.md` (technical specification)
   - Creates `project-memory.md` (Dynamic Memory V5)

**Output (3 files, ~8KB):**
```
.specify/memory/constitution.md  (2-3KB)
specs/001-mvp/spec.md            (4-5KB)
project-memory.md                (1-2KB)
```

**Why Useful:**
- ✅ Concept validation (avoid 2 weeks dev on bad idea)
- ✅ Blind spots discovered (risks identified before coding)
- ✅ Architecture validated (tech choices justified)
- ✅ Ready for Spec-Kit (constitution + spec already generated)

**When to Skip:**
- You have clear project vision
- You already have constitution.md + spec.md written
- Rapid prototyping (quick validation)

---

### Phase 0.5: Module Selection (2-3 min) 🆕 NEW

**Command:**
```bash
/speckit.modules
```

**What Happens:**

#### Step 1: Analyze Requirements

```
📖 Reading specs/001-mvp/spec.md...

Requirements detected:
- ✅ User authentication (sign-in, sign-up, password reset)
- ✅ Subscription billing (monthly/annual plans)
- ✅ UI components (forms, dashboard, marketing pages)
- ✅ Email notifications (campaign alerts, receipts)
- ⚠️  Real-time data sync (custom - no module available)
- ⚠️  ROI calculation (custom - project-specific logic)
```

#### Step 2: Display Available Modules

```
📦 Available Modules Library:

┌─────────────────────────────────────────────────────────────┐
│ 1. lib/nextjs/auth/supabase                                 │
│    Status: ✅ PRODUCTION READY                              │
│    Features: Sign-in, Sign-up, Reset, Session, Middleware   │
│    Setup Time: 5 min (vs 3h from scratch)                   │
│    Savings: -94% time                                       │
│    Integration: Supabase Auth + RLS                         │
│    Files: 6 files, 661 lines                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 2. lib/nextjs/payments/stripe                               │
│    Status: ✅ PRODUCTION READY                              │
│    Features: Checkout, Subscriptions, Portal, Webhooks      │
│    Setup Time: 5 min (vs 4h from scratch)                   │
│    Savings: -96% time                                       │
│    Integration: Stripe SDK + Webhooks                       │
│    Files: 7 files, 858 lines                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 3. lib/nextjs/ui                                            │
│    Status: ✅ PRODUCTION READY                              │
│    Components: 21 (shadcn/ui + auth forms + marketing)      │
│    Setup Time: 5 min (vs 7h from scratch)                   │
│    Savings: -98% time                                       │
│    Features: Design Decoupling (15-min rebrand)             │
│    Files: 38 files, 4,500+ lines                            │
│    Special: 0 hardcoded colors (CSS variables only)         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 4. lib/nextjs/email/resend                                  │
│    Status: ✅ PRODUCTION READY                              │
│    Templates: Welcome, Reset, Invoice, Receipt              │
│    Setup Time: 5 min (vs 2h from scratch)                   │
│    Savings: -96% time                                       │
│    Integration: Resend API + React Email                    │
│    Files: 7 files, 797 lines                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 5. lib/nextjs/database/supabase                             │
│    Status: 🚧 PLANNED (Phase 3)                             │
│    Features: Migrations, RLS, TypeScript types              │
│    Available: Future release                                │
└─────────────────────────────────────────────────────────────┘
```

#### Step 3: Recommend Based on spec.md

```
🎯 Recommended Modules (based on your requirements):

REQUIRED (matches spec.md user stories):
  ✅ [1] auth/supabase       → US1: User registration & login
  ✅ [2] payments/stripe     → US3: Subscription billing
  ✅ [3] ui                  → All UI user stories (forms, dashboard)

OPTIONAL (nice to have):
  ⚠️  [4] email/resend       → Email notifications mentioned in spec

NOT NEEDED:
  ❌ database/supabase       → Not yet available (planned)

Time Savings Estimate:
  Without modules: 16h (3h auth + 4h payments + 7h UI + 2h email)
  With modules:    20 min (5 min × 4)
  Total saved:     15h40 (-98%) 🚀
```

#### Step 4: User Selection

```
Select modules to use:
  [1,2,3,4]  - All recommended modules
  [1,2,3]    - Skip email (custom implementation)
  [custom]   - Manual selection
  [skip]     - No modules (code from scratch)

Your choice:
```

**User responds:** `1,2,3`

#### Step 5: Update spec.md

```
✅ Updating specs/001-mvp/spec.md with selected modules...

Added sections:
  - Dependencies (Modules)
  - Integration Points
  - Setup Instructions
  - Time Estimate

✅ spec.md updated successfully!
```

**Updated spec.md:**
```markdown
# Specification: AdProof MVP

## User Stories
[... existing content ...]

## Dependencies (Modules) 🆕

Using lib/ modules:
- ✅ lib/nextjs/auth/supabase
- ✅ lib/nextjs/payments/stripe
- ✅ lib/nextjs/ui

Setup time: 15 min total (vs 14h from scratch = -89%)

## Integration Points 🆕

### Authentication
- Sign-in form: `lib/nextjs/ui/components/forms/SignInForm.tsx`
- Sign-up form: `lib/nextjs/ui/components/forms/SignUpForm.tsx`
- Auth logic: `lib/nextjs/auth/supabase/server.ts`
- Middleware: `lib/nextjs/auth/supabase/middleware.ts`
- Session: `lib/nextjs/auth/supabase/client.ts`

### Payments
- Checkout: `lib/nextjs/payments/stripe/checkout.ts`
- Portal: `lib/nextjs/payments/stripe/portal.ts`
- Webhooks: `lib/nextjs/payments/stripe/webhook.ts`
- Components:
  - `lib/nextjs/ui/components/marketing/PricingTable.tsx`
  - `lib/nextjs/ui/components/marketing/CheckoutButton.tsx`
  - `lib/nextjs/ui/components/marketing/SubscriptionStatus.tsx`

### UI Components
- Design tokens: `lib/nextjs/ui/config/design-tokens.json`
- Tailwind preset: `lib/nextjs/ui/config/tailwind.preset.js`
- Global styles: `lib/nextjs/ui/styles/globals.css`
- 21 components ready-to-use:
  - 12 shadcn/ui (button, input, card, form, modal, etc.)
  - 3 auth forms (sign-in, sign-up, reset)
  - 3 payment components (pricing, checkout, subscription)
  - 3 marketing components (hero, features, cta)

## Setup Instructions (Module Integration) 🆕

### Step 1: Copy Modules (5 min)
```bash
cp -r ~/archon-orchestrator/lib/nextjs/auth src/lib/auth
cp -r ~/archon-orchestrator/lib/nextjs/payments src/lib/payments
cp -r ~/archon-orchestrator/lib/nextjs/ui src/lib/ui
```

### Step 2: Install Dependencies (3 min)
```bash
pnpm add @supabase/supabase-js @supabase/ssr stripe \
  @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  class-variance-authority clsx tailwind-merge
```

### Step 3: Configure Environment (2 min)
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

### Step 4: Configure Tailwind (2 min)
```typescript
// tailwind.config.ts
import uiPreset from "./src/lib/ui/config/tailwind.preset";

const config: Config = {
  presets: [uiPreset],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/ui/components/**/*.{js,ts,jsx,tsx}",
  ],
};
```

### Step 5: Import Global Styles (1 min)
```typescript
// app/layout.tsx
import "./globals.css";
import "@/lib/ui/styles/globals.css";
```

Total setup: 15 min ✅

## Custom Code (Project-Specific) 🆕

**Only these features need custom implementation:**
- Campaign CRUD logic (database + API)
- ROI calculation engine (analytics)
- Real-time metrics sync (Supabase Realtime)
- Campaign-specific UI components

**Estimated custom dev time:** 3h (vs 7h full implementation)
```

---

### Phase 1: Planning (20-25 min) - FASTER with Modules ✅

**Commands (in exact order):**

```bash
# Step 1: Project Constitution (60-90s)
/speckit.constitution
# ✅ Already created by /zen-roundtable (skip if exists)

# Step 2: Feature Specification (90-120s)
/speckit.specify
# ✅ Already created + UPDATED by /speckit.modules

# Step 3: Project Initialization (30-45s)
/speckit.init
# → Output: CLAUDE.md, project-memory.md, ci-template.yml

# Step 4: Design System (2-5 min) ⭐ NEVER SKIP
/speckit.design
# → Output: design/design-tokens.json, design/wireframes/*.svg
# → Compatible with lib/nextjs/ui (CSS variables)

# Step 5: Implementation Plan (2-3 min - FASTER with modules)
/speckit.plan
# → Output: specs/001-mvp/plan.md
# → Architecture USES modules (not from scratch)

# Step 6: Task Breakdown (3-5 min - FEWER tasks with modules)
/speckit.tasks
# → Output: specs/001-mvp/tasks.md
# → Generates: 50 tasks (vs 99 without modules) = -50%
# → Tasks include: module copy + integration + custom logic

# Step 7: Agent Orchestration (2-3 min - FEWER agents)
/speckit.agents
# → Output: ORCHESTRATION.md, observability-pulse.jsonl
# → Defines: 3 agents (vs 4 without modules)
```

**Total Duration:** 20-25 min (vs 30-35 min without modules = -29%)

**Key Differences with Modules:**

1. **spec.md already has:**
   - Dependencies section (modules listed)
   - Integration points documented
   - Setup instructions included

2. **plan.md includes:**
   - Module copy instructions (not code from scratch)
   - File structure WITH modules
   - Only custom code detailed

3. **tasks.md has:**
   - 50 tasks (vs 99) = -50%
   - Phase 1: Module setup (15 min)
   - Phase 2: Module integration (30 min)
   - Phase 3: Custom logic (2h)

4. **ORCHESTRATION.md has:**
   - 3 agents (setup + integration + custom)
   - vs 4 agents without modules (backend + frontend + testing + deployment)

---

### Example: plan.md WITH Modules

```markdown
# Implementation Plan

## Architecture

### Dependencies (from lib/)
- ✅ lib/nextjs/auth/supabase → handles auth (0 code needed)
- ✅ lib/nextjs/payments/stripe → handles payments (0 code needed)
- ✅ lib/nextjs/ui → provides components (0 code needed)

### File Structure
```
/app
  /dashboard              # Uses lib/ui components
  /(auth)
    /signin              # Uses lib/ui/components/forms/SignInForm
    /signup              # Uses lib/ui/components/forms/SignUpForm
  /pricing               # Uses lib/ui/components/marketing/PricingTable
  /api
    /campaigns           # 🆕 CUSTOM: Campaign CRUD
    /analytics           # 🆕 CUSTOM: ROI calculation
    /stripe/webhook      # Uses lib/payments/stripe/webhook.ts
/lib
  /auth                  # COPIED from lib/nextjs/auth/supabase
  /payments              # COPIED from lib/nextjs/payments/stripe
  /ui                    # COPIED from lib/nextjs/ui
/components
  /campaigns             # 🆕 CUSTOM: Campaign-specific UI
  /analytics             # 🆕 CUSTOM: ROI charts
```

### Custom Code (Project-Specific Only)

**Backend:**
- Campaign model (Supabase table + RLS)
- Campaign API (CRUD endpoints)
- ROI calculation engine
- Real-time metrics sync (Supabase Realtime)

**Frontend:**
- Campaign creation form (custom)
- Campaign list/edit views (custom)
- ROI dashboard (custom charts with recharts)
- Real-time metrics display (custom)

**Estimated:** 3h (vs 7h full implementation)
```

---

### Example: tasks.md WITH Modules

```markdown
# Implementation Tasks

**Total:** 50 tasks (vs 99 without modules = -50%)
**Estimated:** 3h (vs 7h = -57%)

---

## Phase 1: Module Setup (15 min) 🆕

### Copy Modules (5 min)
- [ ] T001 Copy lib/nextjs/auth/supabase to src/lib/auth
- [ ] T002 Copy lib/nextjs/payments/stripe to src/lib/payments
- [ ] T003 Copy lib/nextjs/ui to src/lib/ui

### Install Dependencies (5 min)
- [ ] T004 Install Supabase dependencies (@supabase/supabase-js, @supabase/ssr)
- [ ] T005 Install Stripe dependencies (stripe)
- [ ] T006 Install UI dependencies (Radix UI, clsx, tailwind-merge)

### Configure Project (5 min)
- [ ] T007 Configure .env.local (Supabase + Stripe keys)
- [ ] T008 Configure Tailwind preset (lib/ui/config/tailwind.preset.js)
- [ ] T009 Import global styles (lib/ui/styles/globals.css)

**Checkpoint:** Modules ready ✅ (build passes, imports work)

---

## Phase 2: Module Integration (30 min) 🆕

### Auth Pages (15 min)
- [ ] T010 Create /signin page (uses lib/ui/components/forms/SignInForm)
- [ ] T011 Create /signup page (uses lib/ui/components/forms/SignUpForm)
- [ ] T012 Create /reset-password page (uses lib/ui/components/forms/ResetPasswordForm)
- [ ] T013 Configure middleware (lib/auth/supabase/middleware.ts)
- [ ] T014 Test auth flow ✅

### Pricing Page (10 min)
- [ ] T015 Create /pricing page (uses lib/ui/components/marketing/PricingTable)
- [ ] T016 Configure Stripe webhook endpoint (lib/payments/stripe/webhook.ts)
- [ ] T017 Test checkout flow ✅

### Dashboard Layout (5 min)
- [ ] T018 Create /dashboard layout (uses lib/ui components)
- [ ] T019 Add subscription status (lib/ui/components/marketing/SubscriptionStatus)
- [ ] T020 Test protected routes ✅

**Checkpoint:** Modules integrated ✅ (auth works, checkout works)

---

## Phase 3: Custom Features (2h) 🆕 PROJECT-SPECIFIC

### Campaign Backend (45 min)
- [ ] T021 Create campaigns table (Supabase schema + RLS)
- [ ] T022 Create metrics table (Supabase schema + RLS)
- [ ] T023 Create Campaign API routes (CRUD endpoints)
- [ ] T024 Implement ROI calculation logic
- [ ] T025 Setup real-time sync (Supabase Realtime)

### Campaign Frontend (1h)
- [ ] T026 Create Campaign creation form (custom component)
- [ ] T027 Create Campaign list view (custom component)
- [ ] T028 Create Campaign edit view (custom component)
- [ ] T029 Create ROI dashboard (recharts integration)
- [ ] T030 Implement real-time metrics display
- [ ] T031 Add campaign filters/search

### Testing (15 min)
- [ ] T040 Unit tests (ROI calculation)
- [ ] T041 E2E tests (campaign creation flow)
- [ ] T042 E2E tests (ROI dashboard updates)

**Checkpoint:** Custom features complete ✅

---

## Phase 4: Final Polish (15 min)

- [ ] T048 Final build test
- [ ] T049 Final lint check
- [ ] T050 Documentation (README.md)

**Final Checkpoint:** All tests pass ✅, ready for production
```

---

### Example: ORCHESTRATION.md WITH Modules

```markdown
# Orchestration Plan

**Total:** 50 tasks, 3 agents, ~3h estimated

---

## Strategy: Sequential Execution with Module Reuse

### Agent 1: setup-specialist 🆕
**Tasks:** T001-T009 (9 tasks)
**Duration:** 15 min
**Focus:** Module setup

**Actions:**
- Copy lib/auth, lib/payments, lib/ui to project
- Install all dependencies (Supabase, Stripe, Radix UI)
- Configure .env variables
- Setup Tailwind preset
- Import global styles

**Checkpoint:** `pnpm build` succeeds ✅

---

### Agent 2: integration-specialist 🆕
**Tasks:** T010-T020 (11 tasks)
**Duration:** 30 min
**Focus:** Wire modules to pages

**Actions:**
- Create auth pages (sign-in, sign-up, reset)
- Create pricing page with Stripe checkout
- Create dashboard layout
- Configure Supabase middleware
- Test auth + payment flows

**Checkpoint:** Auth works ✅, Checkout works ✅

---

### Agent 3: custom-logic-specialist
**Tasks:** T021-T050 (30 tasks)
**Duration:** 2h15
**Focus:** Project-specific code

**Actions:**
- Create Campaign & Metrics models (Supabase)
- Implement ROI calculation engine
- Build custom Campaign UI components
- Integrate real-time sync
- Write tests (unit + E2E)

**Checkpoint:** All tests pass ✅

---

**Total Execution:** 3h (vs 7h without modules = -57% time)
```

---

### Phase 2: GitHub Setup (2 min)

**Same as V6 MVP** - No changes

```bash
git checkout -b feat/mvp
git add .
git commit -m "feat: init MVP structure with modules

Modules integrated:
- lib/nextjs/auth/supabase (auth flow)
- lib/nextjs/payments/stripe (subscriptions)
- lib/nextjs/ui (21 components + design system)

Custom features:
- Campaign CRUD API
- ROI calculation engine
- Real-time metrics sync

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

git push -u origin feat/mvp
gh pr create --title "feat: MVP Implementation" --body "[...]"
```

---

### Phase 3: Implementation (3h) - FASTER with Modules ✅

**Command:**
```bash
/speckit.final
```

**What Happens (Enhanced for Modules):**

#### Step 1-4: Same as V6 MVP
- Project path detection
- Prerequisites verification
- Initialize pulse logger
- Parse ORCHESTRATION.md

#### Step 5: Load Context Files + Modules Info 🆕

```
📚 Loading context...
   Project: AdProof.ai MVP
   Tasks: 50 (vs 99 without modules = -50%)
   Tech Stack: Next.js 15 + Supabase + Stripe + lib/ui

   Modules:
   - lib/nextjs/auth/supabase (6 files, 661 lines)
   - lib/nextjs/payments/stripe (7 files, 858 lines)
   - lib/nextjs/ui (38 files, 4,500+ lines)

✅ Context loaded (modules detected)
```

#### Step 6: Execute Agents (Sequential) 🆕

```
🚀 Executing agents...

┌─────────────────────────────────────────────────────────┐
│ Agent 1/3: setup-specialist                             │
│ Tasks: T001-T009 (9 tasks)                              │
│ Duration: 15 min                                        │
└─────────────────────────────────────────────────────────┘

Copying modules...
  ✅ lib/auth → src/lib/auth (6 files)
  ✅ lib/payments → src/lib/payments (7 files)
  ✅ lib/ui → src/lib/ui (38 files)

Installing dependencies...
  ✅ Supabase packages installed
  ✅ Stripe package installed
  ✅ Radix UI packages installed

Configuring project...
  ✅ .env.local configured
  ✅ Tailwind preset configured
  ✅ Global styles imported

Checkpoint P0 (Build):
  → pnpm build
  ✅ Build passed (0 errors)

Agent 1 complete: 9/9 tasks ✅ (15 min actual)

┌─────────────────────────────────────────────────────────┐
│ Agent 2/3: integration-specialist                       │
│ Tasks: T010-T020 (11 tasks)                             │
│ Duration: 30 min                                        │
└─────────────────────────────────────────────────────────┘

Creating auth pages...
  ✅ /signin (SignInForm component)
  ✅ /signup (SignUpForm component)
  ✅ /reset-password (ResetPasswordForm component)
  ✅ Middleware configured

Testing auth flow...
  → Manual test: Sign-up → Sign-in → Protected route
  ✅ Auth flow working

Creating pricing page...
  ✅ /pricing (PricingTable component)
  ✅ Stripe webhook configured
  ✅ Checkout flow working

Creating dashboard...
  ✅ /dashboard layout
  ✅ SubscriptionStatus component

Checkpoint P1 (Lint):
  → pnpm lint
  ✅ Lint passed (0 errors, 2 warnings)

Agent 2 complete: 11/11 tasks ✅ (28 min actual)

┌─────────────────────────────────────────────────────────┐
│ Agent 3/3: custom-logic-specialist                      │
│ Tasks: T021-T050 (30 tasks)                             │
│ Duration: 2h15                                          │
└─────────────────────────────────────────────────────────┘

Creating database schema...
  ✅ campaigns table (id, name, budget, status)
  ✅ metrics table (id, campaign_id, impressions, clicks)
  ✅ RLS policies configured

Building Campaign API...
  ✅ POST /api/campaigns (create)
  ✅ GET /api/campaigns (list)
  ✅ PATCH /api/campaigns/[id] (update)
  ✅ DELETE /api/campaigns/[id] (delete)

Implementing ROI logic...
  ✅ ROI calculation engine (TypeScript)
  ✅ Real-time sync (Supabase Realtime)

Building custom UI...
  ✅ Campaign creation form
  ✅ Campaign list view
  ✅ ROI dashboard (recharts)
  ✅ Real-time metrics display

Checkpoint P0 (Build):
  → pnpm build
  ✅ Build passed (0 errors)

Checkpoint P1 (Lint):
  → pnpm lint
  ✅ Lint passed (0 errors)

Writing tests...
  ✅ Unit tests (ROI calculation - 5 tests)
  ✅ E2E tests (campaign flow - 3 tests)

Checkpoint P2 (Tests):
  → pnpm test
  ✅ All tests passed (8/8)

Agent 3 complete: 30/30 tasks ✅ (2h10 actual)
```

#### Step 7: Final Validation

```
🎯 Final Validation...

Build:
  → pnpm build
  ✅ Production build successful

Lint:
  → pnpm lint
  ✅ No errors (0 warnings)

Tests:
  → pnpm test
  ✅ All tests passed (8/8)

Files:
  → 65 files created (51 custom + 14 module integrations)
  → 3,200 lines written (custom code only)
  → 6,016 lines total (with modules)

✅ All validations passed
```

#### Step 8: Summary

```
🎉 Implementation Complete!

Duration: 3h actual (vs 3h estimated = on time ✅)
Tasks: 50/50 completed (100%)
Files: 65 created
Tests: 8/8 passed

Modules Used:
  ✅ lib/auth (saved 3h)
  ✅ lib/payments (saved 4h)
  ✅ lib/ui (saved 7h)
  Total saved: 14h (-82% vs from scratch)

Custom Code:
  - Campaign CRUD API (45 min)
  - ROI calculation (30 min)
  - Custom UI components (1h)
  - Tests (15 min)
  Total custom: 2h15 (vs 7h full implementation = -68%)

Next steps:
1. Review PR on GitHub
2. Test locally: pnpm dev
3. Customize design tokens (15 min for custom brand)
4. Deploy to Vercel

Ready for production! 🚀
```

---

### Phase 4: Design Import (15 min) - OPTIONAL

**Same as V6 MVP:**

```bash
/import-design custom-tokens.json
```

**custom-tokens.json:**
```json
{
  "colors": {
    "primary": { "500": "#8B5CF6" }  // Purple brand
  }
}
```

**Result:** ALL components purple (0 code changes) ✅

---

## 📊 Time Comparison: V7 vs V6 vs Manual

| Phase | Manual | V6 MVP | V7 Modules | Savings |
|-------|--------|--------|------------|---------|
| **Phase 0: Analysis** | 2h | 5-10 min | 5-10 min | Same |
| **Phase 0.5: Modules** | N/A | N/A | 2-3 min | 🆕 +3 min |
| **Phase 1: Planning** | 4h | 30-35 min | 20-25 min | -29% vs V6 |
| **Phase 2: GitHub** | 15 min | 2 min | 2 min | Same |
| **Phase 3: Implementation** | 40h | 7h | 3h | -57% vs V6 |
| **Phase 4: Design** | 8h | 15 min | 15 min | Same |
| **TOTAL** | **54h** | **8h** | **4h** | **-50% vs V6** |

**V7 ROI:**
- Setup modules once: 15 min
- Save per project: 4h (vs V6) = 8h (vs Manual)
- After 1 project: **Already profitable** ✅

---

## 🎯 Module Library Status

### Phase 1 Complete (4/5 modules) ✅

1. **lib/nextjs/auth/supabase** - READY
   - Files: 6 files, 661 lines
   - Features: Sign-in, Sign-up, Reset, Session, Middleware
   - Setup: 5 min
   - Savings: -94% (3h → 5 min)

2. **lib/nextjs/payments/stripe** - READY
   - Files: 7 files, 858 lines
   - Features: Checkout, Subscriptions, Portal, Webhooks
   - Setup: 5 min
   - Savings: -96% (4h → 5 min)

3. **lib/nextjs/ui** - READY
   - Files: 38 files, 4,500+ lines
   - Components: 21 (shadcn/ui + auth + payments + marketing)
   - Setup: 5 min
   - Savings: -98% (7h → 5 min)
   - Special: Design Decoupling (15-min rebrand)

4. **lib/nextjs/email/resend** - READY
   - Files: 7 files, 797 lines
   - Templates: Welcome, Reset, Invoice, Receipt
   - Setup: 5 min
   - Savings: -96% (2h → 5 min)

### Phase 2 Planned (1/5 modules) 🚧

5. **lib/nextjs/database/supabase** - PLANNED
   - Features: SQL migrations, RLS policies, TypeScript types
   - Status: Design phase
   - Expected: Q1 2025

---

## 💡 Implementation: `/speckit.modules` Command

**File:** `.claude/commands/speckit.modules.md`

```markdown
# Module Selection Command

**Version:** 1.0
**Purpose:** Interactive module selection before planning phase

---

## Step 1: Read Specification

```bash
# Read spec.md
cat specs/001-mvp/spec.md
```

Extract requirements:
- Auth needs (sign-in, sign-up, social login, MFA)
- Payment needs (subscriptions, one-time, usage-based)
- UI needs (components count, design system)
- Email needs (transactional, marketing)
- Database needs (migrations, schema, RLS)

---

## Step 2: Load Module Catalog

Read from library:

```bash
# Check module availability
ls -la ~/archon-orchestrator/lib/nextjs/
```

For each module:
- Read README.md (features, setup time)
- Count files and lines (complexity indicator)
- Check status (production/planned)
- Calculate time savings

---

## Step 3: Match Requirements → Modules

Create mapping:

```javascript
const recommendations = {
  required: [],      // Matches spec.md user stories
  optional: [],      // Nice to have
  notNeeded: []      // Available but not relevant
};

// Example:
if (spec.includes("user authentication")) {
  recommendations.required.push({
    module: "lib/nextjs/auth/supabase",
    reason: "US1: User registration & login",
    savings: "3h → 5 min (-94%)"
  });
}
```

---

## Step 4: Display Interactive Selection

```markdown
📦 Available Modules Library:

[Display each module with:]
- Name + Status
- Features list
- Setup time + Savings
- Files/lines count
- Integration complexity

🎯 Recommendations:

REQUIRED (matches your spec):
  [List with reasons]

OPTIONAL (nice to have):
  [List with reasons]

NOT NEEDED:
  [List why not needed]

Total Savings Estimate: Xh → Ymin (-Z%)
```

---

## Step 5: User Input

```
Select modules to use:
  [1,2,3,4]  - All recommended
  [1,2]      - Custom selection
  [skip]     - No modules

Your choice:
```

Parse user input:
- Validate selections (1-5)
- Handle "all" / "skip" / custom

---

## Step 6: Update spec.md

Add sections:

```markdown
## Dependencies (Modules)

Using lib/ modules:
- ✅ lib/nextjs/auth/supabase
- ✅ lib/nextjs/payments/stripe

Setup time: Xmin total (vs Yh from scratch = -Z%)

## Integration Points

[For each module:]
- Component paths
- Function signatures
- Configuration steps
- Environment variables

## Setup Instructions

Step-by-step integration guide:
1. Copy modules
2. Install dependencies
3. Configure environment
4. Configure Tailwind (if UI module)
5. Test integration

Total setup: Xmin ✅

## Custom Code (Project-Specific)

Only these features need custom implementation:
- [List custom logic not covered by modules]

Estimated custom dev time: Xh (vs Yh full = -Z%)
```

---

## Step 7: Confirmation

```
✅ spec.md updated with selected modules!

Summary:
- Modules: 3 selected
- Setup time: 15 min
- Time saved: 14h (-89%)
- Custom code: 3h remaining

Next steps:
  /speckit.constitution  (if not done)
  /speckit.design        (generate design system)
  /speckit.plan          (will include modules)
```

---

## Error Handling

**If spec.md not found:**
```
❌ ERROR: specs/001-mvp/spec.md not found

Please run first:
  /zen-roundtable "Brief: [...]"  OR
  /speckit.specify

Then retry:
  /speckit.modules
```

**If no modules available:**
```
⚠️ WARNING: No matching modules found for your requirements

Your spec requires:
- [Requirement 1] → No module available
- [Requirement 2] → No module available

Recommendation:
- Continue without modules (code from scratch)
- Or adjust requirements to match available modules

Continue without modules? [Y/n]
```

**If module library not found:**
```
❌ ERROR: Module library not found at ~/archon-orchestrator/lib/

Please clone Archon Orchestrator:
  cd ~
  git clone https://github.com/[repo]/archon-orchestrator.git

Then retry:
  /speckit.modules
```

---

## Notes

**Timing:**
- Command execution: 2-3 min
- User selection: <1 min
- Total: ~3 min

**Side Effects:**
- Modifies specs/001-mvp/spec.md (adds sections)
- Creates .modules-selected.json (tracking file)

**Dependencies:**
- Requires: specs/001-mvp/spec.md (from /zen-roundtable or /speckit.specify)
- Requires: ~/archon-orchestrator/lib/ (module library)
```

---

## 🚀 Migration Path: V6 → V7

### For Existing V6 Projects

**If already in Phase 1 (planning):**
```bash
# Insert module selection BEFORE /speckit.plan
/speckit.constitution  # ✅ Already done
/speckit.specify       # ✅ Already done
/speckit.init          # ✅ Already done

# 🆕 ADD THIS STEP:
/speckit.modules       # Select modules, update spec.md

# Continue as normal:
/speckit.design
/speckit.plan          # Will use modules now
/speckit.tasks         # Will generate fewer tasks
/speckit.agents        # Will allocate with modules
```

**If already in Phase 3 (implementation):**
```
⚠️ Too late to add modules (already implementing)

Options:
1. Continue without modules (finish project as is)
2. Restart Phase 1 with modules (if early in implementation)
3. Add modules incrementally (refactor auth/payments later)

Recommendation: Finish current project, use modules on NEXT project
```

### For New V7 Projects

**Standard Workflow:**
```bash
# Phase 0: Analysis
/zen-roundtable "Brief: [...]"

# Phase 0.5: Module Selection 🆕
/speckit.modules

# Phase 1: Planning (faster with modules)
/speckit.constitution  # Skip if /zen-roundtable already did
/speckit.specify       # Skip if /zen-roundtable already did
/speckit.init
/speckit.design
/speckit.plan
/speckit.tasks
/speckit.agents

# Phase 2-4: Same as V6
[...]
```

---

## 📚 Documentation Requirements

### New Files Needed

1. **docs/WORKFLOW-V7-MODULES.md** (this file) ✅
2. **.claude/commands/speckit.modules.md** (command implementation)
3. **lib/INTEGRATION-GUIDE.md** (update with V7 workflow)
4. **CLAUDE.md** (update Section 1 with V7 workflow)

### Updated Files

1. **START-HERE.md** - Point to V7 workflow
2. **INDEX-FILES-V4.md** - Add V7 workflow reference
3. **WORKFLOW-V6-MVP.md** - Add "Superseded by V7" note

---

## ✅ Success Criteria

**V7 is production-ready when:**

- [ ] `/speckit.modules` command implemented
- [ ] Module catalog interface working
- [ ] spec.md updates automated
- [ ] Integration with /speckit.plan validated
- [ ] Integration with /speckit.tasks validated
- [ ] Integration with /speckit.agents validated
- [ ] Documentation complete
- [ ] Tested on 3+ real projects
- [ ] Time savings validated (-50% vs V6)

---

**Version:** V7.0 "Modules First"
**Status:** 🚧 **DESIGN DOCUMENT** (Implementation planned)
**Next Steps:**
1. Implement `/speckit.modules` command
2. Test on real project (validate time savings)
3. Update all workflow documentation
4. Mark V7 as production-ready

*Workflow V7: V6 MVP + Module Selection = -50% time, -50% tasks, 100% quality* 🚀📦✨
