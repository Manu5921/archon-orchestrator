# 📦 Archon Library Architecture

**Version:** 1.0.0
**Date:** 2025-10-22
**Status:** 🚧 In Development (Phase 1: Next.js modules)

---

## 🎯 PURPOSE

**Archon Library** is a personal collection of reusable code modules to accelerate project development by providing battle-tested, copy-paste-ready components.

**NOT a commercial product** - This is a private development tool to eliminate repetitive coding across projects.

### Problem Solved

**Before Library:**
- Re-code Supabase auth setup every project (3h)
- Re-implement Stripe payments every time (4h)
- Re-create email templates (2h)
- Re-configure design system (2h)
- **Total: 11-12h setup per project**

**After Library:**
```bash
/use-modules nextjs/auth/supabase nextjs/payments/stripe nextjs/email/resend
# → 5-10 min setup
# → -95% time savings
```

---

## 🏗️ ARCHITECTURE

### Hierarchical Structure (3 Levels)

```
lib/
└── {framework}/          # Level 1: Next.js, Astro, PHP
    └── {feature}/        # Level 2: auth, payments, email
        └── {provider}/   # Level 3: supabase, stripe, resend
```

**Why 3 levels?**
1. **Framework isolation** → Add Astro/PHP without breaking Next.js
2. **Feature modularity** → Pick only what you need (auth WITHOUT payments)
3. **Provider flexibility** → Switch Supabase → Clerk, Stripe → Lemon Squeezy

---

## 📂 COMPLETE STRUCTURE

```
archon-orchestrator/
├── lib/                              # 🆕 Reusable components library
│   ├── shared/                       # Framework-agnostic code
│   │   ├── types/                    # TypeScript shared types
│   │   │   ├── auth.ts              # User, Session, Role types
│   │   │   ├── payments.ts          # Subscription, Invoice types
│   │   │   ├── email.ts             # EmailTemplate, EmailProvider types
│   │   │   └── api.ts               # ApiResponse, Pagination types
│   │   │
│   │   ├── utils/                    # Pure utilities (no framework deps)
│   │   │   ├── validation.ts        # Zod schemas (email, password, etc.)
│   │   │   ├── formatting.ts        # Date, currency, phone formatters
│   │   │   ├── crypto.ts            # Hash, encrypt, generate tokens
│   │   │   └── constants.ts         # Shared constants
│   │   │
│   │   ├── schemas/                  # Validation schemas
│   │   │   ├── auth.schemas.ts      # Sign-in, sign-up schemas
│   │   │   ├── payment.schemas.ts   # Checkout, subscription schemas
│   │   │   └── user.schemas.ts      # Profile, settings schemas
│   │   │
│   │   └── config/                   # Configuration templates
│   │       ├── stripe.config.ts     # Stripe setup (keys, webhooks)
│   │       ├── email.config.ts      # Email provider configs
│   │       └── database.config.ts   # Database connection configs
│   │
│   ├── nextjs/                       # ⭐ PHASE 1 PRIORITY (Next.js 15)
│   │   ├── auth/
│   │   │   ├── supabase/            # Supabase Auth for Next.js
│   │   │   │   ├── README.md        # Setup instructions
│   │   │   │   ├── client.ts        # Client-side auth hooks
│   │   │   │   │                    # - useUser(), useSession()
│   │   │   │   ├── server.ts        # Server Actions
│   │   │   │   │                    # - signIn(), signUp(), signOut()
│   │   │   │   ├── middleware.ts    # Route protection middleware
│   │   │   │   ├── providers.tsx    # AuthProvider context
│   │   │   │   └── types.ts         # Supabase-specific types
│   │   │   │
│   │   │   └── clerk/               # Alternative: Clerk (future)
│   │   │
│   │   ├── payments/
│   │   │   ├── stripe/              # Stripe Payments for Next.js
│   │   │   │   ├── README.md        # Setup instructions
│   │   │   │   ├── checkout.ts      # Create checkout session
│   │   │   │   ├── webhooks.ts      # Handle Stripe webhooks
│   │   │   │   │                    # - subscription.created
│   │   │   │   │                    # - invoice.paid
│   │   │   │   ├── portal.ts        # Customer portal link
│   │   │   │   ├── subscriptions.ts # Subscription management
│   │   │   │   ├── products.ts      # Product/price helpers
│   │   │   │   └── types.ts         # Stripe-specific types
│   │   │   │
│   │   │   └── lemon-squeezy/       # Alternative (future)
│   │   │
│   │   ├── email/
│   │   │   ├── resend/              # Resend for Next.js
│   │   │   │   ├── README.md        # Setup instructions
│   │   │   │   ├── client.ts        # Send email function
│   │   │   │   ├── templates/       # React Email templates
│   │   │   │   │   ├── welcome.tsx  # Welcome email
│   │   │   │   │   ├── reset.tsx    # Password reset
│   │   │   │   │   ├── invoice.tsx  # Invoice email
│   │   │   │   │   └── layout.tsx   # Email layout wrapper
│   │   │   │   └── types.ts         # Email types
│   │   │   │
│   │   │   └── sendgrid/            # Alternative (future)
│   │   │
│   │   ├── ui/                       # React components + Design System
│   │   │   ├── design-tokens.json   # ⭐ Design System (CSS variables)
│   │   │   ├── tailwind.config.js   # Tailwind preset using tokens
│   │   │   ├── globals.css          # CSS variables setup
│   │   │   ├── components/          # shadcn/ui + custom components
│   │   │   │   ├── ui/              # shadcn/ui components
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── input.tsx
│   │   │   │   │   ├── form.tsx
│   │   │   │   │   ├── modal.tsx
│   │   │   │   │   └── ...
│   │   │   │   ├── auth/            # Auth-specific components
│   │   │   │   │   ├── SignInForm.tsx
│   │   │   │   │   ├── SignUpForm.tsx
│   │   │   │   │   └── ResetPasswordForm.tsx
│   │   │   │   ├── payments/        # Payment components
│   │   │   │   │   ├── PricingTable.tsx
│   │   │   │   │   ├── CheckoutButton.tsx
│   │   │   │   │   └── SubscriptionStatus.tsx
│   │   │   │   └── marketing/       # Marketing components
│   │   │   │       ├── Hero.tsx
│   │   │   │       ├── Features.tsx
│   │   │   │       └── CTA.tsx
│   │   │   │
│   │   │   └── layouts/             # Layout components
│   │   │       ├── DashboardLayout.tsx
│   │   │       ├── MarketingLayout.tsx
│   │   │       └── AuthLayout.tsx
│   │   │
│   │   ├── database/
│   │   │   ├── supabase/            # Supabase Database for Next.js
│   │   │   │   ├── README.md        # Setup instructions
│   │   │   │   ├── migrations/      # SQL migrations
│   │   │   │   │   ├── 001_users.sql         # Users table
│   │   │   │   │   ├── 002_profiles.sql      # Profiles table
│   │   │   │   │   ├── 003_subscriptions.sql # Subscriptions
│   │   │   │   │   └── 004_rls.sql           # RLS policies
│   │   │   │   ├── schema.ts        # TypeScript schema types
│   │   │   │   ├── queries.ts       # Type-safe query builders
│   │   │   │   └── seed.sql         # Seed data (dev)
│   │   │   │
│   │   │   └── prisma/              # Alternative ORM (future)
│   │   │
│   │   ├── api/                      # API utilities
│   │   │   ├── middleware/          # API middleware
│   │   │   │   ├── cors.ts          # CORS handler
│   │   │   │   ├── rate-limit.ts    # Rate limiting
│   │   │   │   └── error-handler.ts # Error handling
│   │   │   ├── helpers/             # API helpers
│   │   │   │   ├── response.ts      # Standardized responses
│   │   │   │   ├── pagination.ts    # Pagination utilities
│   │   │   │   └── validation.ts    # Request validation
│   │   │   └── types.ts             # API types
│   │   │
│   │   └── hooks/                    # Custom React hooks
│   │       ├── useDebounce.ts       # Debounce hook
│   │       ├── useLocalStorage.ts   # LocalStorage hook
│   │       ├── useMediaQuery.ts     # Responsive hook
│   │       └── useCopyToClipboard.ts
│   │
│   ├── astro/                        # 🔮 FUTURE (Phase 2+)
│   │   ├── auth/                    # Auth adapters for Astro
│   │   ├── ui/                       # Astro components
│   │   └── integrations/            # Astro-specific patterns
│   │
│   ├── php/                          # 🔮 FUTURE (Phase 3+)
│   │   ├── laravel/                 # Laravel modules
│   │   │   ├── auth/
│   │   │   ├── payments/
│   │   │   └── email/
│   │   └── wordpress/               # WordPress plugins (if needed)
│   │
│   └── templates/                    # Full starter references
│       └── nextjs-saas-base/        # Fork of Vercel Next.js SaaS Starter
│           └── README.md            # Reference documentation
│
├── workflow/                         # Existing workflow (unchanged)
│   ├── .claude/commands/
│   │   ├── use-modules.md           # 🆕 NEW: Copy modules to project
│   │   └── speckit.*.md             # Existing Spec-Kit commands
│   ├── scripts/
│   └── docs/
│
├── .specify/                         # Existing Spec-Kit templates
└── project-memory.md                 # Existing Dynamic Memory
```

---

## 🎯 DESIGN PRINCIPLES

### 1. Framework Isolation

**Each framework = separate namespace**
```
lib/nextjs/     # Next.js specific
lib/astro/      # Astro specific
lib/php/        # PHP specific
```

**Why?**
- Add new framework without breaking existing
- Different frameworks have different patterns
- Clear separation of concerns

---

### 2. Modular Architecture

**Copy ONLY what you need**
```bash
# Need auth + payments? Copy both
/use-modules nextjs/auth/supabase nextjs/payments/stripe

# Need ONLY auth? Copy auth
/use-modules nextjs/auth/supabase

# Need ONLY UI? Copy UI
/use-modules nextjs/ui
```

**Why?**
- No bloat (don't copy unused code)
- Faster setup (less to configure)
- Clear dependencies

---

### 3. Provider Flexibility

**Multiple providers per feature**
```
lib/nextjs/auth/
├── supabase/    # Default choice
└── clerk/       # Alternative (future)

lib/nextjs/payments/
├── stripe/      # Default choice
└── lemon-squeezy/  # Alternative (future)
```

**Why?**
- No vendor lock-in
- Project-specific needs (Stripe for US, Lemon Squeezy for EU)
- Easy migration (switch provider without rewrite)

---

### 4. Design System Decoupling ⭐

**CSS Variables > Hard-coded values**
```tsx
// ❌ DON'T: Hard-coded (nightmare to customize)
<button className="bg-blue-600 text-white">Submit</button>

// ✅ DO: CSS variables (15-min rebrand)
<button className="bg-primary-500 text-neutral-50">Submit</button>
```

**Why?**
- 15-min design import vs 1-2 days refactor
- Designer works in parallel
- Competitive advantage vs generic AI tools

**See:** [GOLDEN-PATTERNS.md](./GOLDEN-PATTERNS.md) - Design/Dev Decoupling

---

### 5. Shared Code (DRY)

**Framework-agnostic code in `lib/shared/`**
```typescript
// ✅ Shared validation (works everywhere)
// lib/shared/utils/validation.ts
import { z } from 'zod';

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8);

// Used in Next.js
import { emailSchema } from '@/lib/shared/utils/validation';

// Used in Astro (future)
import { emailSchema } from '../shared/utils/validation';
```

**Why?**
- Write once, use everywhere
- Consistency across frameworks
- Easier maintenance

---

## 🔄 INTEGRATION WITH SPEC-KIT WORKFLOW

### Phase 0: Gemini Analysis (unchanged)

```bash
/zen-roundtable "Brief: SaaS for project management"
# Output: constitution.md + spec.md
```

---

### Phase 1: Planning (enhanced)

```bash
/speckit.specify

# 🆕 AUTO-DETECTION in spec.md:
## Dependencies Detected

Based on requirements analysis:
- ✅ Auth required → **lib/nextjs/auth/supabase**
- ✅ Payments required → **lib/nextjs/payments/stripe**
- ✅ Email required → **lib/nextjs/email/resend**

**Recommendation:** Run `/use-modules nextjs/auth/supabase nextjs/payments/stripe nextjs/email/resend`
**Time saved:** ~9-11h setup → 5-10 min (-95%)
```

---

### Phase 1.5: Use Modules (NEW) 🆕

```bash
/use-modules nextjs/auth/supabase nextjs/payments/stripe nextjs/email/resend

# Actions performed:
✓ Copied lib/nextjs/auth/supabase/* → src/lib/auth/
✓ Copied lib/nextjs/payments/stripe/* → src/lib/payments/
✓ Copied lib/nextjs/email/resend/* → src/lib/email/
✓ Copied lib/nextjs/ui/design-tokens.json → public/
✓ Updated package.json (added: @supabase/supabase-js, stripe, resend)
✓ Created .env.example (SUPABASE_URL, STRIPE_SECRET_KEY, RESEND_API_KEY)
✓ Updated CLAUDE.md (documented modules used)
✓ Updated project-memory.md (logged decision WHY these modules)

**Modules ready!** Continue with /speckit.design
```

---

### Phase 2: Design (enhanced)

```bash
/speckit.design

# Claude detects: design-tokens.json already exists (from /use-modules)
# Action: Merge custom brand colors with existing tokens
# Output: Updated design-tokens.json (custom colors + base structure)
```

---

### Phase 3: Implementation (faster)

```bash
/speckit.plan
# Plans customizations ONLY (base modules already present)

/speckit.tasks
# Tasks = customizations + business logic
# NOT setup tasks (auth setup, Stripe config already done)

/speckit.final
# Implements customizations (50-66% faster)
# Base modules = battle-tested, agents focus on unique features
```

**Time savings:**
- Before library: 3-4h implementation (full build)
- After library: 1-2h implementation (customizations only)
- **Reduction: 50-66%**

---

## 📊 COMPARISON: Before vs After

### Before Library (Current V6.1.5)

```bash
# Full workflow from scratch
/zen-roundtable         # 5-10 min
/speckit.constitution   # 2 min
/speckit.specify        # 2 min
/speckit.design         # 10 min
/speckit.plan           # 15 min
/speckit.tasks          # 10 min
/speckit.final          # 2h45-3h (full implementation)

# Total: 3-4h
```

**What agents build:**
- Auth system from scratch (sign-in, sign-up, middleware)
- Stripe integration from scratch (checkout, webhooks)
- Email service from scratch (templates, sending)
- UI components from scratch
- Database schema from scratch

---

### After Library (V7.0 target)

```bash
# Enhanced workflow with library
/zen-roundtable         # 5-10 min
/speckit.specify        # 2 min (+ auto-detect modules)
/use-modules ...        # 5-10 min (copy modules)
/speckit.design         # 5 min (merge tokens)
/speckit.plan           # 10 min (customizations only)
/speckit.tasks          # 5 min (smaller task list)
/speckit.final          # 1h-1h30 (customizations only)

# Total: 1h30-2h (-50% time)
```

**What agents build:**
- Business logic (unique features)
- Custom workflows
- API integrations (project-specific)
- Custom components (beyond library)
- Database customizations (project-specific tables)

**What agents DON'T build:**
- ✅ Auth (library module)
- ✅ Payments (library module)
- ✅ Email (library module)
- ✅ Base UI (library components)
- ✅ Base schema (library migrations)

---

## 🎯 PHASE 1: Next.js Modules (Priority)

### Timeline: 1 week (5-7 days)

### Day 1: Fork Vercel Starter

**Actions:**
```bash
cd lib/templates/
git clone https://github.com/nextjs/saas-starter.git nextjs-saas-base
cd nextjs-saas-base
# Keep as reference
```

**Extract patterns:**
- Auth JWT cookies → lib/nextjs/auth/jwt-cookies/ (reference)
- Stripe patterns → lib/nextjs/payments/stripe/ (adapt)
- Middleware → lib/nextjs/auth/ (adapt)

---

### Day 2-3: Supabase Auth

**Build:**
```
lib/nextjs/auth/supabase/
├── README.md           # Setup guide
├── client.ts           # useUser(), useSession()
├── server.ts           # signIn(), signUp(), signOut()
├── middleware.ts       # Route protection
├── providers.tsx       # AuthProvider context
└── types.ts            # Types
```

**Features:**
- Sign-in (email/password)
- Sign-up (email/password)
- Password reset
- Email verification
- Session management
- Middleware protection
- RLS policies integration

**Testing:**
- Create test project
- Run `/use-modules nextjs/auth/supabase`
- Verify: auth flow works end-to-end

---

### Day 3-4: Stripe Payments

**Build:**
```
lib/nextjs/payments/stripe/
├── README.md           # Setup guide
├── checkout.ts         # createCheckoutSession()
├── webhooks.ts         # handleWebhook()
├── portal.ts           # createPortalLink()
├── subscriptions.ts    # Subscription helpers
├── products.ts         # Product/price helpers
└── types.ts            # Types
```

**Features:**
- Checkout session creation
- Webhook handling (subscription.created, invoice.paid, etc.)
- Customer portal link
- Subscription status
- Cancel/resume subscription
- Pricing table data

**Testing:**
- Create test project
- Run `/use-modules nextjs/payments/stripe`
- Verify: checkout → webhook → subscription active

---

### Day 4-5: Email (Resend)

**Build:**
```
lib/nextjs/email/resend/
├── README.md           # Setup guide
├── client.ts           # sendEmail()
├── templates/          # React Email templates
│   ├── welcome.tsx     # Welcome email
│   ├── reset.tsx       # Password reset
│   ├── invoice.tsx     # Invoice
│   └── layout.tsx      # Email layout
└── types.ts            # Types
```

**Features:**
- Send email function
- Welcome email template
- Password reset template
- Invoice email template
- Email layout (branding)

**Testing:**
- Create test project
- Run `/use-modules nextjs/email/resend`
- Verify: emails send and render correctly

---

### Day 5-6: UI Components + Design System

**Build:**
```
lib/nextjs/ui/
├── design-tokens.json       # ⭐ Design system
├── tailwind.config.js       # Tailwind preset
├── globals.css              # CSS variables
└── components/
    ├── ui/                  # shadcn/ui components
    ├── auth/                # Auth forms
    ├── payments/            # Pricing tables
    └── marketing/           # Hero, Features, CTA
```

**Features:**
- design-tokens.json (colors, fonts, spacing)
- Tailwind config using CSS variables
- shadcn/ui components (button, input, form, modal, etc.)
- Auth forms (sign-in, sign-up, reset password)
- Pricing table
- Marketing components (hero, features, CTA)

**Testing:**
- Create test project
- Run `/use-modules nextjs/ui`
- Verify: components render with design tokens

---

### Day 6-7: Database (Supabase)

**Build:**
```
lib/nextjs/database/supabase/
├── README.md           # Setup guide
├── migrations/         # SQL migrations
│   ├── 001_users.sql
│   ├── 002_profiles.sql
│   ├── 003_subscriptions.sql
│   └── 004_rls.sql
├── schema.ts           # TypeScript types
├── queries.ts          # Type-safe queries
└── seed.sql            # Seed data
```

**Features:**
- Users table
- Profiles table
- Subscriptions table
- RLS policies (per-user isolation)
- TypeScript types generated
- Type-safe query builders
- Seed data (dev)

**Testing:**
- Create test project
- Run `/use-modules nextjs/database/supabase`
- Verify: migrations run, RLS works, queries type-safe

---

### Day 7: Integration Testing

**Test complete workflow:**
```bash
# Create new test project
mkdir test-saas-app
cd test-saas-app

# Run workflow
/zen-roundtable "Brief: Simple SaaS with auth + payments"
/speckit.specify
/use-modules nextjs/auth/supabase nextjs/payments/stripe nextjs/email/resend nextjs/ui nextjs/database/supabase
/speckit.design
/speckit.plan
/speckit.tasks
/speckit.final

# Verify:
# ✅ Auth works (sign-in, sign-up, protected routes)
# ✅ Payments work (checkout, webhooks, subscription)
# ✅ Emails work (welcome, reset password)
# ✅ UI works (design tokens, components)
# ✅ Database works (RLS, queries)
# ✅ Build passes
# ✅ Lint passes
# ✅ Tests pass
```

**Success criteria:**
- All modules copy correctly
- No integration issues
- Full workflow works end-to-end
- Time: 1h30-2h (vs 3-4h without library)
- **Time saved: 50%** ✅

---

## 🔮 FUTURE PHASES (Organic Growth)

### Phase 2: Astro (when needed)

**Trigger:** First Astro project
**Timeline:** 3-5 days
**Modules:**
```
lib/astro/
├── auth/               # Auth adapters for Astro
├── ui/                 # Astro components
├── email/              # Email integration
└── integrations/       # Astro-specific patterns
```

---

### Phase 3: PHP (when needed)

**Trigger:** First PHP project
**Timeline:** 1 week
**Modules:**
```
lib/php/
├── laravel/
│   ├── auth/
│   ├── payments/
│   └── email/
└── wordpress/         # If needed
```

---

## 📝 NEW COMMAND: `/use-modules`

### Purpose

Copy library modules to current project with intelligent setup.

### Usage

```bash
/use-modules {framework}/{feature}/{provider} [...]

# Examples:
/use-modules nextjs/auth/supabase
/use-modules nextjs/auth/supabase nextjs/payments/stripe
/use-modules nextjs/ui
/use-modules nextjs/database/supabase
```

### Actions Performed

1. **Validate modules exist**
   - Check lib/{framework}/{feature}/{provider} exists
   - Error if not found

2. **Copy files**
   - Copy lib/* → src/lib/ (or appropriate location)
   - Preserve directory structure
   - Don't overwrite existing files (ask user)

3. **Update package.json**
   - Parse module dependencies (from README.md or package.json)
   - Add to project package.json
   - Run `pnpm install` automatically

4. **Create .env.example**
   - Extract required env vars (from README.md)
   - Add to .env.example with placeholder values
   - Prompt user: "Configure .env.local with real values"

5. **Update CLAUDE.md**
   - Add section: "## Library Modules Used"
   - Document which modules copied
   - Link to module READMEs

6. **Update project-memory.md**
   - Log decision in "Runtime Decisions" section
   - Document WHY these modules (business context)
   - Record timestamp

7. **Display next steps**
   - List files copied
   - Show env vars needed
   - Suggest next command (/speckit.design)

### Example Output

```
✅ Modules copied successfully!

📦 Modules installed:
  ✓ nextjs/auth/supabase → src/lib/auth/
  ✓ nextjs/payments/stripe → src/lib/payments/
  ✓ nextjs/email/resend → src/lib/email/
  ✓ nextjs/ui → src/components/ui/

📝 Files copied:
  • src/lib/auth/client.ts
  • src/lib/auth/server.ts
  • src/lib/auth/middleware.ts
  • src/lib/payments/checkout.ts
  • src/lib/payments/webhooks.ts
  • (23 more files...)

📦 Dependencies added:
  • @supabase/supabase-js
  • stripe
  • resend
  • react-email

⚙️ Environment variables needed:
  Configure .env.local with:
  • NEXT_PUBLIC_SUPABASE_URL
  • NEXT_PUBLIC_SUPABASE_ANON_KEY
  • SUPABASE_SERVICE_ROLE_KEY
  • STRIPE_SECRET_KEY
  • STRIPE_WEBHOOK_SECRET
  • RESEND_API_KEY

  See .env.example for details.

📚 Documentation updated:
  • CLAUDE.md (modules section)
  • project-memory.md (decision logged)

🚀 Next steps:
  1. Configure .env.local (add real API keys)
  2. Run: /speckit.design (merge design tokens)
  3. Run: /speckit.plan (plan customizations)

**Modules ready!** Time saved: ~9-11h setup → 5-10 min (-95%)
```

---

## 🎯 SUCCESS METRICS

### Time Savings (Target)

| Metric | Before Library | After Library | Savings |
|--------|----------------|---------------|---------|
| **Auth setup** | 3h | 5 min | -94% |
| **Payments setup** | 4h | 5 min | -96% |
| **Email setup** | 2h | 5 min | -96% |
| **UI setup** | 2h | 5 min | -96% |
| **Database setup** | 1h | 5 min | -92% |
| **Total setup** | 12h | 25 min | -96% |
| **Total project** | 3-4h | 1h30-2h | -50% |

### Quality Improvements

- ✅ Battle-tested patterns (Vercel starter base)
- ✅ Type-safe (strict TypeScript)
- ✅ Documented (README per module)
- ✅ Tested (integration tests)
- ✅ Consistent (same patterns across projects)
- ✅ Maintainable (centralized updates)

### Productivity Impact

**Projects per month:**
- Before: 4-5 projects (3-4h each)
- After: 8-10 projects (1h30-2h each)
- **Improvement: 2× productivity**

---

## 📚 DOCUMENTATION REQUIREMENTS

### Per Module README.md

Each module MUST have README.md with:

```markdown
# {Feature} - {Provider}

## Overview
Brief description (2-3 sentences)

## Dependencies
- package-name@version
- another-package@version

## Environment Variables
```bash
REQUIRED_VAR=value
OPTIONAL_VAR=value
```

## Setup
Step-by-step instructions:
1. Copy module: `/use-modules ...`
2. Install deps: `pnpm install`
3. Configure env: edit .env.local
4. Run migrations (if database)
5. Test: `pnpm dev`

## Usage
```typescript
// Example code
import { useAuth } from '@/lib/auth/client';

export default function Page() {
  const { user } = useAuth();
  return <div>Hello {user.email}</div>;
}
```

## API Reference
List exported functions/components with signatures

## Troubleshooting
Common issues + solutions
```

---

## 🔒 SECURITY CONSIDERATIONS

### Library Code Standards

**All modules MUST:**
- ✅ Use environment variables (never hardcode secrets)
- ✅ Validate all inputs (Zod schemas)
- ✅ Sanitize outputs (prevent XSS)
- ✅ Use HTTPS only (no HTTP)
- ✅ Implement rate limiting (API routes)
- ✅ Follow OWASP LLM security (V6.1.5 standards)

**Prohibited:**
- ❌ Hardcoded secrets/keys
- ❌ SQL injection vulnerabilities
- ❌ XSS vulnerabilities
- ❌ CSRF vulnerabilities
- ❌ Insecure dependencies

**Validation:**
- Run `node scripts/bashSandbox.cjs scan lib/` (P-1 Security gate)
- Run `pnpm audit` (no critical vulnerabilities)
- Test: penetration testing (basic OWASP Top 10)

---

## 🚀 NEXT STEPS

### Immediate (this session)

1. ✅ Document architecture (this file)
2. ✅ Document integration with Spec-Kit
3. ✅ Document Phase 1 plan
4. 🔄 Update CLAUDE.md (library section)
5. 🔄 Update project-memory.md (decision logged)

### Phase 1 (next 1 week)

1. Fork Vercel Next.js SaaS Starter
2. Build lib/nextjs/auth/supabase/
3. Build lib/nextjs/payments/stripe/
4. Build lib/nextjs/email/resend/
5. Build lib/nextjs/ui/ (design system)
6. Build lib/nextjs/database/supabase/
7. Create `/use-modules` command
8. Integration testing

### Future Phases (organic growth)

- Phase 2: lib/astro/ (when first Astro project)
- Phase 3: lib/php/ (when first PHP project)
- Phase 4: Additional providers (Clerk, Lemon Squeezy, etc.)

---

**Version:** 1.0.0
**Status:** 🚧 In Development
**Target:** V7.0 (Library Integration)
**Timeline:** 1 week Phase 1 → 50% time savings on all future projects

*Library Architecture: Personal reusable components for 2× productivity boost* 🚀📦
