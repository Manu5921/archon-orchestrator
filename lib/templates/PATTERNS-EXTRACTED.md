# Patterns Extracted from Vercel Next.js SaaS Starter

**Date:** 2025-10-22
**Source:** https://github.com/vercel/nextjs-saas-starter (commit: latest)
**Purpose:** Document patterns to adapt for Archon Library modules

---

## 🔐 AUTH PATTERNS (JWT + Cookies)

### Session Management (lib/auth/session.ts)

**Pattern: JWT tokens stored in HTTP-only cookies**

```typescript
// Key functions extracted:
1. hashPassword(password) → bcryptjs hash
2. comparePasswords(plain, hashed) → bcryptjs compare
3. signToken(payload) → jose SignJWT (HS256)
4. verifyToken(token) → jose jwtVerify
5. getSession() → read cookie + verify
6. setSession(user) → sign token + set cookie

// Cookie settings (security):
- httpOnly: true
- secure: true
- sameSite: 'lax'
- expires: 1 day
```

**Dependencies:**
- `bcryptjs` - Password hashing
- `jose` - JWT signing/verification
- `next/headers` (cookies()) - Cookie management

**Middleware Pattern (middleware.ts + lib/auth/middleware.ts):**
```typescript
// Global middleware (middleware.ts):
- Protect routes starting with /dashboard
- Auto-refresh session on GET requests
- Redirect to /sign-in if no session

// Action middleware (lib/auth/middleware.ts):
- validatedAction(schema, action) → Zod validation
- validatedActionWithUser(schema, action) → Requires auth
- withTeam(action) → Requires team context
```

**⚠️ ADAPTATION NEEDED:**
- Vercel uses JWT + cookies (self-contained)
- We need Supabase Auth (external service)
- **Strategy:** Keep middleware pattern, replace JWT with Supabase session

---

## 💳 STRIPE PATTERNS (lib/payments/stripe.ts)

### Payment Functions

**Pattern: Server-side Stripe SDK + webhooks**

```typescript
// Key functions extracted:
1. createCheckoutSession({ team, priceId })
   - Create Stripe checkout
   - Trial period: 14 days
   - Redirect to success/cancel URLs

2. createCustomerPortalSession(team)
   - Billing portal for subscription management
   - Features: update, cancel, payment method

3. handleSubscriptionChange(subscription)
   - Webhook handler
   - Update database on status change
   - Statuses: active, trialing, canceled, unpaid

4. getStripePrices() → List active recurring prices
5. getStripeProducts() → List active products
```

**Dependencies:**
- `stripe` (SDK v2025-04-30.basil)

**Webhook Events Handled:**
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.paid
- invoice.payment_failed

**⚠️ ADAPTATION NEEDED:**
- Replace `team` context with generic user context
- Adapt database schema (users table instead of teams)
- Keep webhook patterns (battle-tested)

---

## 🗄️ DATABASE PATTERNS (Drizzle ORM)

### Schema (lib/db/schema.ts)

**Tables identified:**
1. **users** - id, email, passwordHash, createdAt
2. **teams** - id, name, stripeCustomerId, stripeSubscriptionId, planName, subscriptionStatus
3. **teamMembers** - teamId, userId, role (owner/member)
4. **activityLogs** - teamId, userId, action, timestamp

**Pattern: Drizzle ORM + Postgres**

**⚠️ ADAPTATION NEEDED:**
- Replace Drizzle with Supabase (SQL migrations)
- Keep schema structure (users, subscriptions)
- Add RLS policies (Supabase-specific)

---

## 🎨 UI PATTERNS (shadcn/ui + Tailwind)

### Structure (app/globals.css)

**Pattern: CSS variables + Tailwind**

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    /* ... */
  }
}
```

**Components identified:**
- Button, Input, Form (shadcn/ui)
- Custom forms: SignInForm, SignUpForm (app/(login)/)
- Marketing: Hero, Features, Pricing table

**⚠️ ADAPTATION NEEDED:**
- Replace CSS variables with design-tokens.json
- Keep shadcn/ui components (copy-paste pattern)
- Add Design Decoupling (bg-primary-500 not bg-zinc-900)

---

## 📁 FILE STRUCTURE OBSERVED

```
nextjs-saas-base/
├── app/
│   ├── (dashboard)/        # Protected routes group
│   ├── (login)/            # Auth routes group
│   ├── api/
│   │   └── stripe/
│   │       ├── checkout/   # Success callback
│   │       └── webhook/    # Stripe webhooks
│   └── globals.css
├── lib/
│   ├── auth/
│   │   ├── session.ts      # JWT functions
│   │   └── middleware.ts   # Action validation
│   ├── payments/
│   │   └── stripe.ts       # Stripe SDK
│   ├── db/
│   │   ├── schema.ts       # Drizzle schema
│   │   ├── queries.ts      # Database queries
│   │   └── migrations/     # SQL migrations
│   └── utils.ts
├── components/
│   └── ui/                 # shadcn/ui components
└── middleware.ts           # Global middleware
```

---

## 🔄 PATTERNS TO EXTRACT → ARCHON LIBRARY

### lib/nextjs/auth/supabase/

**Adapt from Vercel:**
- ✅ Keep: Middleware pattern (route protection)
- ✅ Keep: Action validation (Zod schemas)
- ❌ Replace: JWT → Supabase Auth
- ❌ Replace: Cookies → Supabase session

**New files:**
```
lib/nextjs/auth/supabase/
├── README.md
├── client.ts           # useUser(), useSession() hooks
├── server.ts           # signIn(), signUp(), signOut() Server Actions
├── middleware.ts       # Route protection (adapted from Vercel)
├── providers.tsx       # AuthProvider context
└── types.ts            # Supabase-specific types
```

---

### lib/nextjs/payments/stripe/

**Adapt from Vercel:**
- ✅ Keep: createCheckoutSession pattern
- ✅ Keep: createCustomerPortalSession pattern
- ✅ Keep: handleSubscriptionChange (webhook handler)
- ✅ Keep: getStripePrices, getStripeProducts
- ❌ Replace: Team context → User context

**New files:**
```
lib/nextjs/payments/stripe/
├── README.md
├── checkout.ts         # createCheckoutSession (adapted)
├── webhooks.ts         # handleWebhook (adapted from Vercel)
├── portal.ts           # createPortalLink (adapted)
├── subscriptions.ts    # get, cancel, resume
├── products.ts         # getProducts, getPrices (from Vercel)
└── types.ts            # Stripe types
```

---

### lib/nextjs/database/supabase/

**Adapt from Vercel:**
- ✅ Keep: Schema structure (users, subscriptions)
- ❌ Replace: Drizzle → Supabase SQL migrations
- ✅ Add: RLS policies (Supabase-specific)

**New files:**
```
lib/nextjs/database/supabase/
├── README.md
├── migrations/
│   ├── 001_users.sql          # From Vercel schema
│   ├── 002_profiles.sql       # New (Supabase pattern)
│   ├── 003_subscriptions.sql  # From Vercel schema
│   └── 004_rls.sql            # New (RLS policies)
├── schema.ts           # TypeScript types (from Vercel)
├── queries.ts          # Type-safe queries (adapted)
└── seed.sql            # Seed data
```

---

### lib/nextjs/ui/

**Adapt from Vercel:**
- ✅ Keep: shadcn/ui components
- ❌ Replace: CSS variables → design-tokens.json
- ✅ Keep: Form components structure

**New files:**
```
lib/nextjs/ui/
├── design-tokens.json       # NEW (Design Decoupling)
├── tailwind.config.js       # Uses design-tokens.json
├── globals.css              # CSS variables from tokens
└── components/
    ├── ui/                  # shadcn/ui (from Vercel)
    ├── auth/                # SignInForm, SignUpForm (adapted)
    └── payments/            # PricingTable (adapted)
```

---

## 📝 NEXT STEPS (Day 1 Complete)

### ✅ Completed Today:
1. Created lib/ directory structure
2. Cloned Vercel Next.js SaaS Starter
3. Studied patterns (auth, payments, database, UI)
4. Documented extraction strategy

### 📋 Day 2-3 (Auth Module):
- Implement lib/nextjs/auth/supabase/
- Adapt middleware pattern (replace JWT with Supabase)
- Create README.md with setup guide
- Test auth flow end-to-end

---

**Status:** ✅ Day 1 Complete - Patterns Extracted
**Next:** Day 2 - Build auth/supabase module
