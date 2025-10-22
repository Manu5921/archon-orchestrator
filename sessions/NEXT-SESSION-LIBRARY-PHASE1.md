# Next Session: Library Phase 1 Implementation

**Date Planned:** 2025-10-23+
**Duration Estimate:** 1 week (5-7 days)
**Status:** Ready to Start
**Priority:** High (V7.0 Foundation)

---

## 📋 SESSION QUICK START

### Prerequisites (Read Before Starting)

1. **Context Validation:**
   ```bash
   /validationBP
   # Should show: V6.1.5 (Security & Reliability) + V7.0 Library Planning complete
   ```

2. **Review Documentation:**
   - Read: `docs/LIBRARY-ARCHITECTURE.md` (750+ lines - complete architecture)
   - Read: `CLAUDE.md` Section 6 (Library - Reusable Components)
   - Review: `project-memory.md` Session 2025-10-22 (decisions documented)

3. **Verify Decisions:**
   - ✅ Structure: `lib/{framework}/{feature}/{provider}/`
   - ✅ Phase 1: Next.js modules only (Astro/PHP later)
   - ✅ Source: Fork Vercel Next.js SaaS Starter (MIT)
   - ✅ Integration: `/use-modules` command
   - ✅ Growth: YAGNI (organic, as needed)

---

## 🎯 PHASE 1 OBJECTIVES (1 Week)

### Goal
Build reusable Next.js modules library for -96% setup time reduction (12h → 25 min).

### Deliverables (5 Modules)

1. **lib/nextjs/auth/supabase/** - Authentication
   - Sign-in, sign-up, password reset
   - Session management
   - Middleware protection
   - RLS policies integration

2. **lib/nextjs/payments/stripe/** - Payments
   - Checkout session creation
   - Webhook handling
   - Customer portal
   - Subscription management

3. **lib/nextjs/email/resend/** - Email Service
   - Send email function
   - React Email templates (welcome, reset, invoice)
   - Email layout (branding)

4. **lib/nextjs/ui/** - Design System
   - design-tokens.json (CSS variables)
   - Tailwind preset
   - shadcn/ui components
   - Auth/payment/marketing components

5. **lib/nextjs/database/supabase/** - Database
   - Schema migrations (users, profiles, subscriptions)
   - RLS policies
   - Type-safe queries
   - Seed data (dev)

### Integration

6. **/.claude/commands/use-modules.md** - New Command
   - Copy modules to project
   - Update package.json
   - Create .env.example
   - Update CLAUDE.md + project-memory.md

---

## 📅 IMPLEMENTATION TIMELINE (7 Days)

### Day 1: Setup + Fork Vercel Starter

**Tasks:**
1. Create `lib/` directory structure
2. Fork Vercel Next.js SaaS Starter
   ```bash
   cd lib/templates/
   git clone https://github.com/nextjs/saas-starter.git nextjs-saas-base
   cd nextjs-saas-base
   # Keep as reference
   ```
3. Extract patterns to study:
   - Auth JWT cookies pattern
   - Stripe webhooks implementation
   - Middleware protection
   - Team management RBAC
4. Create README.md for each module (template)

**Validation:**
- ✅ `lib/` structure created
- ✅ Vercel starter cloned
- ✅ Patterns identified
- ✅ Module READMEs templated

---

### Day 2-3: Auth Module (lib/nextjs/auth/supabase/)

**Build:**
```
lib/nextjs/auth/supabase/
├── README.md           # Setup guide
├── client.ts           # useUser(), useSession() hooks
├── server.ts           # signIn(), signUp(), signOut() Server Actions
├── middleware.ts       # Route protection
├── providers.tsx       # AuthProvider context
└── types.ts            # Supabase-specific types
```

**Features:**
- Client-side: useUser(), useSession(), useSignIn(), useSignUp()
- Server Actions: signIn(), signUp(), signOut(), resetPassword()
- Middleware: protectRoute(), requireAuth()
- Context: AuthProvider (wraps app)
- Types: User, Session, AuthConfig

**Integration with Supabase:**
- Uses @supabase/supabase-js
- Configured for Next.js App Router
- Server Components + Client Components support
- RLS policies ready (for database module)

**Testing:**
- Create test project: `test-auth-module/`
- Run `/use-modules nextjs/auth/supabase`
- Verify: sign-in, sign-up, protected routes work

**Validation:**
- ✅ All files created
- ✅ README complete
- ✅ Auth flow works end-to-end
- ✅ Types exported correctly

---

### Day 3-4: Payments Module (lib/nextjs/payments/stripe/)

**Build:**
```
lib/nextjs/payments/stripe/
├── README.md           # Setup guide
├── checkout.ts         # createCheckoutSession()
├── webhooks.ts         # handleWebhook()
├── portal.ts           # createPortalLink()
├── subscriptions.ts    # Subscription helpers
├── products.ts         # Product/price helpers
└── types.ts            # Stripe-specific types
```

**Features:**
- Checkout: createCheckoutSession(priceId, userId)
- Webhooks: handleWebhook(event) → subscription.created, invoice.paid, etc.
- Portal: createPortalLink(customerId)
- Subscriptions: getSubscription(), cancelSubscription(), resumeSubscription()
- Products: getProducts(), getPrices()

**Webhook Events Handled:**
- subscription.created
- subscription.updated
- subscription.deleted
- invoice.paid
- invoice.payment_failed
- customer.created

**Testing:**
- Create test project: `test-payments-module/`
- Run `/use-modules nextjs/payments/stripe`
- Verify: checkout, webhook (use Stripe CLI), portal

**Validation:**
- ✅ All files created
- ✅ README complete
- ✅ Checkout works
- ✅ Webhooks tested (Stripe CLI)
- ✅ Portal link works

---

### Day 4-5: Email Module (lib/nextjs/email/resend/)

**Build:**
```
lib/nextjs/email/resend/
├── README.md           # Setup guide
├── client.ts           # sendEmail()
├── templates/          # React Email templates
│   ├── welcome.tsx     # Welcome email
│   ├── reset.tsx       # Password reset
│   ├── invoice.tsx     # Invoice
│   └── layout.tsx      # Email layout wrapper
└── types.ts            # Email types
```

**Features:**
- Client: sendEmail(to, subject, template, data)
- Templates: Welcome, Reset Password, Invoice (React Email)
- Layout: Branded email wrapper (logo, footer, colors)

**Templates Built:**
1. **Welcome Email:** User registration confirmation
2. **Reset Password:** Password reset link
3. **Invoice:** Subscription payment receipt

**Testing:**
- Create test project: `test-email-module/`
- Run `/use-modules nextjs/email/resend`
- Verify: emails send and render correctly (Resend dashboard)

**Validation:**
- ✅ All files created
- ✅ README complete
- ✅ Templates render correctly
- ✅ Emails send successfully

---

### Day 5-6: UI Module (lib/nextjs/ui/)

**Build:**
```
lib/nextjs/ui/
├── design-tokens.json       # ⭐ Design system
├── tailwind.config.js       # Tailwind preset
├── globals.css              # CSS variables
└── components/
    ├── ui/                  # shadcn/ui components
    │   ├── button.tsx
    │   ├── input.tsx
    │   ├── form.tsx
    │   ├── modal.tsx
    │   └── ... (10+ components)
    ├── auth/                # Auth-specific components
    │   ├── SignInForm.tsx
    │   ├── SignUpForm.tsx
    │   └── ResetPasswordForm.tsx
    ├── payments/            # Payment components
    │   ├── PricingTable.tsx
    │   ├── CheckoutButton.tsx
    │   └── SubscriptionStatus.tsx
    └── marketing/           # Marketing components
        ├── Hero.tsx
        ├── Features.tsx
        └── CTA.tsx
```

**Features:**
- **design-tokens.json:** Colors, fonts, spacing (CSS variables)
- **Tailwind preset:** Uses CSS variables (Design Decoupling ⭐)
- **shadcn/ui:** Button, Input, Form, Modal, Card, Badge, etc.
- **Auth forms:** Pre-wired to auth/supabase module
- **Payment components:** Pre-wired to payments/stripe module
- **Marketing:** Hero, Features, CTA sections

**Testing:**
- Create test project: `test-ui-module/`
- Run `/use-modules nextjs/ui`
- Verify: components render, design tokens work, /import-design works

**Validation:**
- ✅ All files created
- ✅ README complete
- ✅ design-tokens.json valid
- ✅ Components render correctly
- ✅ /import-design compatible

---

### Day 6-7: Database Module (lib/nextjs/database/supabase/)

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
└── seed.sql            # Seed data (dev)
```

**Features:**
- **Migrations:**
  - 001: Users table (extends auth.users)
  - 002: Profiles table (user_id FK)
  - 003: Subscriptions table (stripe_customer_id, status, etc.)
  - 004: RLS policies (per-user isolation)
- **Schema:** TypeScript types generated from migrations
- **Queries:** Type-safe query builders (getProfile, updateProfile, etc.)
- **Seed:** Dev data (test users, test subscriptions)

**RLS Policies:**
- Users can read/update their own profile
- Users can read their own subscriptions
- Service role can write subscriptions (webhooks)

**Testing:**
- Create test project: `test-database-module/`
- Run `/use-modules nextjs/database/supabase`
- Run migrations: `supabase db reset`
- Verify: tables created, RLS works, queries type-safe

**Validation:**
- ✅ All files created
- ✅ README complete
- ✅ Migrations run successfully
- ✅ RLS policies enforced
- ✅ Queries type-safe

---

### Day 7: Integration + `/use-modules` Command

**Build:**
```
.claude/commands/use-modules.md     # New command (340+ lines)
```

**Features:**
- Parse modules requested: `nextjs/auth/supabase nextjs/payments/stripe`
- Copy lib/* → project src/lib/
- Update package.json (add dependencies)
- Create .env.example (with required vars)
- Update CLAUDE.md (document modules used)
- Update project-memory.md (log decision WHY)

**Testing:**
- Create fresh project: `test-full-workflow/`
- Run complete workflow:
  ```bash
  /zen-roundtable "Brief: Simple SaaS"
  /speckit.specify
  # Claude auto-detects: "Auth + Payments + Email required"
  /use-modules nextjs/auth/supabase nextjs/payments/stripe nextjs/email/resend nextjs/ui
  /speckit.design
  /speckit.plan
  /speckit.tasks
  /speckit.final
  ```
- Verify: Project builds, auth works, payments work, emails work

**Validation:**
- ✅ `/use-modules` command works
- ✅ Modules copy correctly
- ✅ package.json updated
- ✅ .env.example created
- ✅ CLAUDE.md + project-memory.md updated
- ✅ Full workflow works end-to-end
- ✅ Time: 1h30-2h (vs 3-4h without library) = **-50% time** ✅

---

## 🎯 SUCCESS CRITERIA

### Functional Requirements

- ✅ All 5 modules built (auth, payments, email, ui, database)
- ✅ Each module has README.md (setup guide)
- ✅ `/use-modules` command works
- ✅ Full workflow tested end-to-end
- ✅ Time savings validated (-50% project time)

### Quality Requirements

- ✅ TypeScript strict mode (no `any` except justified)
- ✅ All modules tested individually
- ✅ Integration tested (full workflow)
- ✅ Documentation complete (READMEs + LIBRARY-ARCHITECTURE.md)
- ✅ OWASP LLM validation passed (bashSandbox.cjs)

### Performance Requirements

- ✅ Setup time: 12h → 25 min (-96%)
- ✅ Total project time: 3-4h → 1h30-2h (-50%)
- ✅ Module copy: < 5 min per module
- ✅ Build time: No performance regression

---

## 📦 DELIVERABLES CHECKLIST

### Code

- [ ] `lib/shared/` - Framework-agnostic utilities
- [ ] `lib/nextjs/auth/supabase/` - Auth module
- [ ] `lib/nextjs/payments/stripe/` - Payments module
- [ ] `lib/nextjs/email/resend/` - Email module
- [ ] `lib/nextjs/ui/` - UI + Design System
- [ ] `lib/nextjs/database/supabase/` - Database module
- [ ] `lib/templates/nextjs-saas-base/` - Vercel starter fork
- [ ] `.claude/commands/use-modules.md` - New command

### Documentation

- [x] `docs/LIBRARY-ARCHITECTURE.md` - Complete architecture (already done)
- [x] `CLAUDE.md` - Section 6 Library (already done)
- [x] `project-memory.md` - Session 2025-10-22 (already done)
- [ ] Each module `README.md` - Setup guides (Day 1-7)
- [ ] `lib/README.md` - Library overview

### Testing

- [ ] Test project: `test-auth-module/`
- [ ] Test project: `test-payments-module/`
- [ ] Test project: `test-email-module/`
- [ ] Test project: `test-ui-module/`
- [ ] Test project: `test-database-module/`
- [ ] Test project: `test-full-workflow/` (integration)

### Validation

- [ ] All modules copy correctly
- [ ] `/use-modules` command works
- [ ] package.json updated automatically
- [ ] .env.example created
- [ ] CLAUDE.md + project-memory.md updated
- [ ] Full workflow < 2h (vs 3-4h baseline)
- [ ] Time savings: -50% validated ✅

---

## 🚨 POTENTIAL BLOCKERS & MITIGATIONS

### Blocker 1: Vercel Starter Structure Different

**Risk:** Vercel starter structure incompatible with our modules
**Mitigation:** Study structure first (Day 1), adapt patterns (not copy verbatim)
**Fallback:** Build from scratch (adds 1-2 days)

### Blocker 2: Supabase Auth Integration Complex

**Risk:** Supabase auth difficult to abstract into module
**Mitigation:** Use official @supabase/ssr package (App Router support)
**Fallback:** Simplified auth (email/password only, defer OAuth to V2)

### Blocker 3: Stripe Webhooks Testing

**Risk:** Webhooks hard to test without production setup
**Mitigation:** Use Stripe CLI (local webhook forwarding)
**Fallback:** Document testing process, defer E2E to real project

### Blocker 4: Design Tokens Compatibility

**Risk:** design-tokens.json format not compatible with /import-design
**Mitigation:** Test /import-design compatibility on Day 5
**Fallback:** Adjust format (design-tokens.json is our standard, not external)

### Blocker 5: Time Overrun (> 1 Week)

**Risk:** Phase 1 takes longer than 7 days
**Mitigation:** MVP first (auth + payments only), defer email/ui/database to Phase 1.5
**Fallback:** Ship partial library (auth + payments = 60% value)

---

## 🔄 WORKFLOW INTEGRATION (Post-Phase 1)

### Enhanced Workflow V7.0

**Phase 0: Gemini Analysis** (unchanged)
```bash
/zen-roundtable "Brief: ..."
```

**Phase 1: Planning** (enhanced)
```bash
/speckit.specify
# Auto-detects modules needed
# Suggests: /use-modules nextjs/auth/supabase nextjs/payments/stripe ...
```

**Phase 1.5: Use Modules** (NEW) 🆕
```bash
/use-modules nextjs/auth/supabase nextjs/payments/stripe nextjs/email/resend
# → 5-10 min setup (vs 12h manual)
```

**Phase 2: Design** (enhanced)
```bash
/speckit.design
# Merges custom tokens with library design-tokens.json
```

**Phase 3: Implementation** (faster)
```bash
/speckit.plan      # Plans customizations only
/speckit.tasks     # Tasks = delta (base exists)
/speckit.final     # Implements customizations (-50% time)
```

**Total Time:**
- Before Library: 3-4h
- After Library: 1h30-2h
- **Savings: -50%** ✅

---

## 📝 COMMIT STRATEGY

### Day 1: Setup
```bash
feat(library): initialize lib/ structure + fork Vercel starter
- Create lib/{shared,nextjs,templates}/ structure
- Fork Vercel Next.js SaaS Starter to lib/templates/
- Add module README.md templates
```

### Day 2-3: Auth
```bash
feat(library): implement lib/nextjs/auth/supabase/ module
- Client: useUser, useSession, useSignIn, useSignUp hooks
- Server: signIn, signUp, signOut, resetPassword Server Actions
- Middleware: protectRoute, requireAuth
- Context: AuthProvider
- Tests: auth flow works end-to-end
```

### Day 3-4: Payments
```bash
feat(library): implement lib/nextjs/payments/stripe/ module
- Checkout: createCheckoutSession
- Webhooks: handleWebhook (subscription.*, invoice.*)
- Portal: createPortalLink
- Subscriptions: get, cancel, resume
- Tests: checkout, webhooks (Stripe CLI), portal
```

### Day 4-5: Email
```bash
feat(library): implement lib/nextjs/email/resend/ module
- Client: sendEmail function
- Templates: welcome, reset password, invoice (React Email)
- Layout: branded email wrapper
- Tests: emails send and render correctly
```

### Day 5-6: UI
```bash
feat(library): implement lib/nextjs/ui/ module
- design-tokens.json (CSS variables)
- Tailwind preset using design tokens
- shadcn/ui components (10+)
- Auth/payment/marketing components
- Tests: components render, /import-design compatible
```

### Day 6-7: Database + Integration
```bash
feat(library): implement lib/nextjs/database/supabase/ + /use-modules command
- Database: migrations, RLS policies, type-safe queries
- Command: /use-modules (copy modules, update deps, create env)
- Tests: full workflow < 2h (-50% time savings validated)
```

---

## 🎉 EXPECTED OUTCOME (End of Week)

### Deliverables
- ✅ 5 Next.js modules (auth, payments, email, ui, database)
- ✅ `/use-modules` command operational
- ✅ Complete documentation (READMEs + architecture)
- ✅ Full workflow tested and validated

### Metrics
- Setup time: 12h → 25 min ✅ (-96%)
- Project time: 3-4h → 1h30-2h ✅ (-50%)
- Productivity: 2× projects per month ✅

### Next Steps (Phase 2+)
- Add Astro modules (when first Astro project)
- Add PHP modules (when first PHP project)
- Add alternative providers (Clerk, Lemon Squeezy, etc.)

---

**Status:** 📋 Ready to Start
**Priority:** High (V7.0 Foundation)
**Estimated Impact:** 2× productivity boost

*Library Phase 1: From 3-4h projects to 1h30-2h projects = 2× more MVPs shipped* 🚀📦
