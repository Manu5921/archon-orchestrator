# 📦 Archon Library - Reusable Components

**Version:** 1.0.0 (Phase 1: Next.js modules)
**Status:** 🚧 In Development
**Purpose:** Personal library of battle-tested modules to eliminate repetitive coding

---

## 🎯 PURPOSE

Stop re-coding the same patterns every project. Copy battle-tested modules in 5-10 minutes instead of 12 hours.

**Time savings:**
- Before: 12h setup per project (auth 3h + payments 4h + email 2h + UI 2h + database 1h)
- After: 25 min setup with `/use-modules` command
- **Reduction: -96%**

**Total project time:**
- Before: 3-4h (with V6.1.5 workflow)
- After: 1h30-2h (with V7.0 library)
- **Reduction: -50%**

---

## 📂 STRUCTURE

```
lib/
├── shared/              # Framework-agnostic (types, utils, schemas)
├── nextjs/              # ⭐ PHASE 1 (Next.js 15 modules)
│   ├── auth/supabase/   # Supabase Auth
│   ├── payments/stripe/ # Stripe Payments
│   ├── email/resend/    # Resend Email
│   ├── ui/              # Design System + shadcn/ui
│   └── database/supabase/ # Database + RLS
├── astro/               # 🔮 FUTURE (Phase 2)
├── php/                 # 🔮 FUTURE (Phase 3)
└── templates/           # Reference starters
    └── nextjs-saas-base/ # Vercel Next.js SaaS Starter (forked)
```

---

## 🚀 USAGE

### 1. Auto-detection (in /speckit.specify)

When you run `/speckit.specify`, Claude analyzes your requirements and suggests modules:

```bash
/speckit.specify

# Output in spec.md:
## Dependencies Detected
- ✅ Auth required → lib/nextjs/auth/supabase
- ✅ Payments required → lib/nextjs/payments/stripe
- ✅ Email required → lib/nextjs/email/resend

**Recommendation:** Run `/use-modules nextjs/auth/supabase nextjs/payments/stripe nextjs/email/resend`
```

### 2. Copy modules to project

```bash
/use-modules nextjs/auth/supabase nextjs/payments/stripe nextjs/email/resend nextjs/ui

# Actions performed:
✓ Copied lib/nextjs/auth/supabase/* → src/lib/auth/
✓ Copied lib/nextjs/payments/stripe/* → src/lib/payments/
✓ Copied lib/nextjs/email/resend/* → src/lib/email/
✓ Copied lib/nextjs/ui/* → src/components/ui/
✓ Updated package.json (added dependencies)
✓ Created .env.example (required env vars)
✓ Updated CLAUDE.md (documented modules used)
✓ Updated project-memory.md (logged decision WHY)

**Modules ready!** Continue with /speckit.design
```

### 3. Continue workflow

```bash
/speckit.design  # Merge custom tokens with library
/speckit.plan    # Plan customizations only (base exists)
/speckit.tasks   # Tasks = delta (not full build)
/speckit.final   # Implement customizations (-50% time)
```

---

## 📦 AVAILABLE MODULES (Phase 1)

### lib/nextjs/auth/supabase/

**What it provides:**
- Sign-in, sign-up, password reset
- Session management
- Route protection middleware
- Client hooks (useUser, useSession)
- Server Actions (signIn, signUp, signOut)

**Setup time:** 5 min (vs 3h manual)

**[README →](./nextjs/auth/supabase/README.md)**

---

### lib/nextjs/payments/stripe/

**What it provides:**
- Checkout session creation
- Webhook handling (subscription.*, invoice.*)
- Customer portal link
- Subscription management (get, cancel, resume)

**Setup time:** 5 min (vs 4h manual)

**[README →](./nextjs/payments/stripe/README.md)**

---

### lib/nextjs/email/resend/

**What it provides:**
- Send email function
- React Email templates (welcome, reset, invoice)
- Branded email layout

**Setup time:** 5 min (vs 2h manual)

**[README →](./nextjs/email/resend/README.md)**

---

### lib/nextjs/ui/

**What it provides:**
- design-tokens.json (CSS variables)
- Tailwind preset using tokens
- shadcn/ui components (10+)
- Auth forms (sign-in, sign-up, reset)
- Payment components (pricing table, checkout button)
- Marketing components (hero, features, CTA)

**Setup time:** 5 min (vs 2h manual)

**[README →](./nextjs/ui/README.md)**

---

### lib/nextjs/database/supabase/

**What it provides:**
- SQL migrations (users, profiles, subscriptions)
- RLS policies (per-user isolation)
- TypeScript types generated
- Type-safe query builders

**Setup time:** 5 min (vs 1h manual)

**[README →](./nextjs/database/supabase/README.md)**

---

## 🔮 FUTURE PHASES (Organic Growth)

### Phase 2: Astro (when needed)
- Trigger: First Astro project
- Modules: auth, ui, email, integrations

### Phase 3: PHP (when needed)
- Trigger: First PHP project
- Modules: laravel/auth, laravel/payments, laravel/email

### Phase 4: Additional Providers
- Clerk (auth alternative to Supabase)
- Lemon Squeezy (payments alternative to Stripe)
- SendGrid (email alternative to Resend)

**Growth strategy:** YAGNI (You Aren't Gonna Need It) - Build when first project needs it

---

## 📝 PRINCIPLES

### 1. Modular Architecture
Copy ONLY what you need. Need auth + payments? Copy both. Need ONLY auth? Copy auth.

### 2. Provider Flexibility
Multiple providers per feature. Switch Supabase → Clerk or Stripe → Lemon Squeezy without full rewrite.

### 3. Design/Dev Decoupling ⭐
CSS variables throughout. 15-min rebrand with `/import-design` vs 1-2 days refactor.

### 4. Battle-tested Patterns
Based on Vercel Next.js SaaS Starter (14.7k stars, MIT license) + OWASP LLM security validation.

### 5. Multi-framework Support
Framework-agnostic shared utilities (lib/shared/). Add Astro/PHP without breaking Next.js.

---

## 🔒 SECURITY

**All modules follow V6.1.5 security standards:**
- ✅ Environment variables only (no hardcoded secrets)
- ✅ Input validation (Zod schemas)
- ✅ Output sanitization (XSS prevention)
- ✅ HTTPS only
- ✅ Rate limiting (API routes)
- ✅ OWASP LLM validation (bashSandbox.cjs)

**Validation:**
```bash
# Security scan
node scripts/bashSandbox.cjs scan lib/

# Dependency audit
pnpm audit
```

---

## 📚 DOCUMENTATION

Each module has:
- **README.md** - Setup guide, usage examples, troubleshooting
- **types.ts** - TypeScript types exported
- **Examples** - Code snippets for common use cases

**Complete architecture:** [docs/LIBRARY-ARCHITECTURE.md](../docs/LIBRARY-ARCHITECTURE.md)

---

## 🤝 CONTRIBUTING

This is a **personal library** for accelerating my projects. Not open for external contributions.

**If you want similar:** Fork and adapt for your needs (MIT license from Vercel starter base).

---

**Version:** 1.0.0
**Status:** 🚧 Phase 1 In Development (Day 1/7 Complete)
**Target:** V7.0 (Library Integration) - 2× productivity boost

*Library: Personal reusable components for eliminating repetitive coding* 📦🚀
