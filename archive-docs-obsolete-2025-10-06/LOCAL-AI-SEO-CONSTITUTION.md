# LocalAI SEO - Constitution

**Project Name:** LocalAI SEO
**Version:** 1.0
**Date:** 2025-01-05
**Owner:** @manu
**Type:** SaaS B2B - AI Visibility Platform

---

## 🎯 Project Vision

**Mission Statement:**
Permettre aux PME locales d'être recommandées par les intelligences artificielles (ChatGPT, Claude, Perplexity) lorsque leurs clients potentiels cherchent des services via ces plateformes.

**Core Problem:**
93% des PME optimisent pour Google Search, mais seulement 2% apparaissent dans les recommandations des IA. Avec la montée de SearchGPT (Q1 2025), Gemini Business, et Perplexity (40% intent local), les entreprises invisibles dans ces IA perdront des opportunités critiques en 2025-2026.

**Value Proposition:**
LocalAI SEO offre monitoring temps réel, optimisation automatique, et insights actionnables pour que les PME contrôlent leur "AI Reputation" avant qu'il ne soit trop tard.

---

## 📐 Design Principles

### P1: Clarity First (Clarté Avant Tout)

**Principe:**
Chaque feature doit être immédiatement compréhensible par un propriétaire PME sans compétences techniques.

**Application:**
- Dashboard : Métriques en langage naturel ("Votre visibilité a augmenté de 15%" vs "Score: 67 → 72")
- Alertes : Actions claires ("3 quick wins pour améliorer votre score")
- Éviter jargon technique (API, embeddings, NER) dans UI

**Quality Gates:**
- ✅ Test utilisabilité : 3 PME non-tech comprennent feature sans explication
- ✅ Onboarding : <3 min du signup à première valeur (score visible)

---

### P2: Speed to Value (Valeur Immédiate)

**Principe:**
L'utilisateur doit voir de la valeur dans les 60 premières secondes.

**Application:**
- Audit gratuit : Résultat en <60 secondes
- Dashboard : Score AI Visibility visible immédiatement après login
- Pas de "empty states" frustrants : données mockées jour 1, vraies données jour 2

**Quality Gates:**
- ✅ Time-to-first-value : <60s (audit) ou <2min (dashboard)
- ✅ Performance : Lighthouse score ≥90 sur mobile

---

### P3: Trust Through Transparency (Confiance via Transparence)

**Principe:**
Les utilisateurs doivent comprendre comment nous calculons le score et d'où viennent les données.

**Application:**
- Score : Tooltip explique formule ("Basé sur mentions, position, sentiment")
- Monitoring : Afficher queries exactes testées ("Nous avons demandé à ChatGPT: 'meilleur restaurant italien Lyon'")
- Pas de "boîte noire" : montrer réponses IA brutes (expandable)

**Quality Gates:**
- ✅ Chaque métrique a tooltip explicatif
- ✅ "Comment c'est calculé ?" page dédiée
- ✅ Logs monitoring accessibles (dernières 10 queries)

---

### P4: Mobile-First Experience

**Principe:**
50% des propriétaires PME consultent analytics sur mobile. L'expérience mobile doit être équivalente au desktop.

**Application:**
- Dashboard responsive ≤640px (smartphone)
- Touch targets ≥44x44px (WCAG 2.2)
- Pas de hover-only interactions
- Navigation bottom bar (mobile) vs sidebar (desktop)

**Quality Gates:**
- ✅ Lighthouse Mobile score ≥90
- ✅ Test sur iPhone SE (375px) + Android (360px)
- ✅ Pas de scroll horizontal

---

### P5: Actionable Insights Only (Insights Actionnables Uniquement)

**Principe:**
Chaque donnée affichée doit avoir une action associée. Pas de "vanity metrics".

**Application:**
- ❌ Mauvais : "15 mentions cette semaine" (et alors ?)
- ✅ Bon : "15 mentions (+5 vs semaine dernière). Action : Publiez 2 Perfect Answers cette semaine pour maintenir momentum."
- Alertes : Toujours avec "Que faire ?"

**Quality Gates:**
- ✅ Review UX : Chaque métrique a CTA ou recommandation
- ✅ A/B test : Taux d'action sur recommandations ≥30%

---

## 🏛️ Architecture Principles

### A1: Serverless-First (E1 - Architecture-First)

**Décision:**
Next.js App Router + Vercel Serverless (pas de serveur Node.js séparé).

**Rationale:**
- Time-to-market : Déploiement Vercel en 1 commande
- Scalabilité automatique : 0 → 1000 req/s sans config
- Coûts prévisibles : Pay-per-execution (vs serveur 24/7)

**Trade-offs:**
- ✅ Pro : Zero DevOps, auto-scaling, cold start <500ms
- ⚠️ Con : Timeout 10s max (Vercel Hobby), 60s (Pro) → OK pour notre use case

**ADR (Architecture Decision Record):**
```markdown
# ADR-001: Next.js App Router + Vercel Serverless

## Status: Accepted

## Context:
MVP doit être déployé en 2 semaines. Pas de budget DevOps.

## Decision:
Next.js 14 App Router hébergé sur Vercel.

## Consequences:
- Déploiement automatique via Git push
- Auto-scaling sans config
- Limitation 10s timeout (acceptable pour API routes)
```

---

### A2: Database-First Design (E1)

**Décision:**
Supabase (Postgres managed) avec Row Level Security.

**Schema Core:**
```sql
-- Businesses (1 business = 1 client payant)
create table businesses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users,
  name text not null,
  category text not null,
  city text not null,
  tier text default 'starter' check (tier in ('starter', 'pro', 'enterprise')),
  google_business_id text,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Queries (queries monitorées par business)
create table queries (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses on delete cascade,
  query_text text not null,
  priority integer default 1 check (priority between 1 and 3),
  created_at timestamptz default now()
);

-- Monitoring Results (résultats monitoring AI)
create table monitoring_results (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses on delete cascade,
  query_id uuid references queries,
  platform text not null check (platform in ('chatgpt', 'claude', 'perplexity')),
  mentioned boolean not null,
  position integer, -- null si pas mentionné
  sentiment text check (sentiment in ('positive', 'neutral', 'negative')),
  competitors jsonb default '[]'::jsonb,
  response_raw text,
  created_at timestamptz default now()
);

-- AI Visibility Scores (cache score calculé)
create table visibility_scores (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses on delete cascade,
  score integer not null check (score between 0 and 100),
  breakdown jsonb not null, -- { chatgpt: 72, claude: 65, perplexity: 64 }
  calculated_at timestamptz default now()
);

-- Perfect Answers (contenus optimisés IA)
create table perfect_answers (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses on delete cascade,
  query_text text not null,
  answer_content text not null,
  published_to_gbp boolean default false,
  published_at timestamptz,
  created_at timestamptz default now()
);

-- Indexes pour performance
create index idx_monitoring_results_business on monitoring_results(business_id, created_at desc);
create index idx_monitoring_results_platform on monitoring_results(platform, created_at desc);
create index idx_queries_business on queries(business_id);
create index idx_visibility_scores_business on visibility_scores(business_id, calculated_at desc);
```

**Row Level Security (RLS):**
```sql
-- Users can only see their own businesses
alter table businesses enable row level security;

create policy "Users can view own businesses"
  on businesses for select
  using (auth.uid() = user_id);

create policy "Users can update own businesses"
  on businesses for update
  using (auth.uid() = user_id);

-- Cascade RLS to related tables
alter table queries enable row level security;
alter table monitoring_results enable row level security;
alter table visibility_scores enable row level security;
alter table perfect_answers enable row level security;

create policy "Users can view own queries"
  on queries for select
  using (business_id in (select id from businesses where user_id = auth.uid()));

create policy "Users can view own monitoring results"
  on monitoring_results for select
  using (business_id in (select id from businesses where user_id = auth.uid()));
```

---

### A3: API-First Integrations (E1)

**External APIs:**

```typescript
// AI Platforms (monitoring)
const aiAPIs = {
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4-turbo',
    features: ['web_search'],
    cost: 0.01 / 1k tokens (input), 0.03 / 1k tokens (output),
    rateLimit: '10,000 RPM'
  },

  anthropic: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-5-sonnet-20241022',
    cost: 0.003 / 1k tokens (input), 0.015 / 1k tokens (output),
    rateLimit: '4,000 RPM'
  },

  perplexity: {
    endpoint: 'https://api.perplexity.ai/chat/completions',
    model: 'llama-3.1-sonar-small-128k-online',
    cost: 0.20 / 1M tokens,
    rateLimit: '20 RPM'
  }
};

// Google My Business (auto-publish)
const googleAPI = {
  oauth: 'https://accounts.google.com/o/oauth2/v2/auth',
  scopes: ['https://www.googleapis.com/auth/business.manage'],
  endpoint: 'https://mybusiness.googleapis.com/v4',
  rateLimit: '1,500 queries/day'
};

// Stripe (payments)
const stripeAPI = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
};
```

**Error Handling Strategy:**
```typescript
// Retry logic pour AI APIs (transient failures)
async function queryAIWithRetry(platform: string, query: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await queryAI(platform, query);
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      // Exponential backoff
      await sleep(Math.pow(2, i) * 1000);
    }
  }
}

// Circuit breaker (si API down, stop calling)
class CircuitBreaker {
  private failures = 0;
  private threshold = 5;
  private timeout = 60000; // 1 min

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.failures >= this.threshold) {
      throw new Error('Circuit breaker open');
    }

    try {
      const result = await fn();
      this.failures = 0;
      return result;
    } catch (error) {
      this.failures++;
      throw error;
    }
  }
}
```

---

## 💻 Technical Standards

### T1: TypeScript Strict Mode (E2 - Types Anti-Hallucination)

**Configuration:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

**Interdictions:**
- ❌ `any` type (sauf cas extrême avec `// @ts-expect-error` + commentaire)
- ❌ `as` casting sans validation runtime
- ❌ Optional chaining aveugle (`data?.field?.nested?.value`)

**Obligatoire:**
```typescript
// ✅ Bon : Types explicites + validation
interface Business {
  id: string;
  name: string;
  category: string;
  city: string;
  tier: 'starter' | 'pro' | 'enterprise';
}

function getBusiness(id: string): Promise<Business | null> {
  // Return type explicite
}

// ✅ Validation runtime (Zod)
import { z } from 'zod';

const BusinessSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  category: z.string(),
  city: z.string(),
  tier: z.enum(['starter', 'pro', 'enterprise'])
});

type Business = z.infer<typeof BusinessSchema>;
```

---

### T2: Component Architecture (E2)

**Structure:**
```
app/
├── (auth)/              # Route group auth required
│   ├── dashboard/
│   │   ├── page.tsx     # Dashboard page
│   │   └── loading.tsx  # Loading state
│   ├── optimize/
│   └── settings/
├── (public)/            # Route group public
│   ├── page.tsx         # Landing page
│   ├── audit/
│   └── pricing/
├── api/
│   ├── audit/route.ts
│   ├── monitor/route.ts
│   └── cron/
│       └── monitor/route.ts
├── layout.tsx           # Root layout
└── globals.css

components/
├── ui/                  # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── dashboard/
│   ├── MetricsCard.tsx
│   ├── PlatformBreakdown.tsx
│   └── ActivityFeed.tsx
├── audit/
│   └── AuditForm.tsx
└── shared/
    ├── Header.tsx
    └── Footer.tsx

lib/
├── supabase/
│   ├── client.ts        # Client-side Supabase
│   └── server.ts        # Server-side Supabase
├── ai/
│   ├── openai.ts
│   ├── anthropic.ts
│   └── perplexity.ts
├── monitoring/
│   ├── queries.ts       # Query generation
│   ├── analyzer.ts      # Response analysis
│   └── scorer.ts        # Score calculation
└── utils/
    ├── errors.ts
    └── validators.ts
```

**Component Conventions:**
```typescript
// ✅ Bon : Props typées, JSDoc
interface MetricsCardProps {
  /** Titre de la métrique */
  title: string;
  /** Valeur actuelle */
  value: number;
  /** Variation vs période précédente */
  trend?: number;
  /** Format d'affichage (number, percentage, currency) */
  format?: 'number' | 'percentage' | 'currency';
}

export function MetricsCard({ title, value, trend, format = 'number' }: MetricsCardProps) {
  // Implementation
}

// ❌ Mauvais : Props non typées
export function MetricsCard(props) {
  return <div>{props.value}</div>;
}
```

---

### T3: Testing Strategy (E3 - Tests Integration First)

**Coverage Targets:**
- Critical paths : 80% coverage
- Business logic (scoring, detection) : 90% coverage
- UI components : 50% coverage (snapshot tests)

**Testing Pyramid:**
```typescript
// 1. Unit Tests (lib/, utils/)
// Vitest + Testing Library
import { describe, it, expect } from 'vitest';
import { calculateVisibilityScore } from '@/lib/monitoring/scorer';

describe('calculateVisibilityScore', () => {
  it('returns 100 when mentioned in all platforms at position 1', () => {
    const results = [
      { platform: 'chatgpt', mentioned: true, position: 1, sentiment: 'positive' },
      { platform: 'claude', mentioned: true, position: 1, sentiment: 'positive' },
      { platform: 'perplexity', mentioned: true, position: 1, sentiment: 'positive' }
    ];

    expect(calculateVisibilityScore(results)).toBe(100);
  });

  it('returns 0 when not mentioned anywhere', () => {
    const results = [
      { platform: 'chatgpt', mentioned: false },
      { platform: 'claude', mentioned: false },
      { platform: 'perplexity', mentioned: false }
    ];

    expect(calculateVisibilityScore(results)).toBe(0);
  });
});

// 2. Integration Tests (API routes)
import { POST } from '@/app/api/audit/route';

describe('POST /api/audit', () => {
  it('generates audit report for valid business', async () => {
    const request = new Request('http://localhost:3000/api/audit', {
      method: 'POST',
      body: JSON.stringify({
        name: 'La Scala',
        category: 'Restaurant Italien',
        city: 'Lyon',
        email: 'test@example.com'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('score');
    expect(data.score).toBeGreaterThanOrEqual(0);
    expect(data.score).toBeLessThanOrEqual(100);
  });
});

// 3. E2E Tests (Playwright) - Post-MVP
// test('User can complete audit flow', async ({ page }) => {
//   await page.goto('/audit');
//   await page.fill('[name="name"]', 'Test Business');
//   await page.click('button[type="submit"]');
//   await page.waitForSelector('.audit-report');
// });
```

**Pre-commit Hook:**
```bash
#!/bin/bash
# .husky/pre-commit

# Run tests on staged files
npm run test:staged

# Type check
npm run type-check

# Lint
npm run lint

# If any fails, block commit
```

---

### T4: Error Handling & Logging (E11 - Error Escalation)

**3-Strike Rule:**
```typescript
// lib/monitoring/queue.ts
class MonitoringQueue {
  private errorCounts = new Map<string, number>();

  async processQuery(business: Business, query: Query) {
    const key = `${business.id}:${query.id}`;

    try {
      await monitorQuery(business, query);
      this.errorCounts.delete(key); // Reset on success

    } catch (error) {
      const count = (this.errorCounts.get(key) || 0) + 1;
      this.errorCounts.set(key, count);

      if (count >= 3) {
        // 3 strikes → Pause monitoring + alert user
        await pauseQueryMonitoring(query.id);
        await sendAlert(business.user_id, {
          type: 'monitoring_failed',
          query: query.query_text,
          error: error.message
        });

        this.errorCounts.delete(key);
      } else {
        // Retry avec backoff
        await scheduleRetry(business, query, count);
      }
    }
  }
}
```

**Sentry Integration:**
```typescript
// lib/utils/errors.ts
import * as Sentry from '@sentry/nextjs';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown, context?: Record<string, any>) {
  if (error instanceof AppError) {
    Sentry.captureException(error, {
      level: error.statusCode >= 500 ? 'error' : 'warning',
      tags: { error_code: error.code },
      extra: { ...error.context, ...context }
    });

    return {
      error: error.message,
      code: error.code
    };
  }

  // Unknown error
  Sentry.captureException(error, { extra: context });

  return {
    error: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR'
  };
}

// Usage dans API route
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await runAudit(data);
    return Response.json(result);

  } catch (error) {
    const errorResponse = handleError(error, { endpoint: '/api/audit' });
    return Response.json(errorResponse, { status: 500 });
  }
}
```

---

## 🎨 Design System

### D1: Design Tokens (Single Source of Truth)

**Tokens Structure:**
```json
// .specify/specs/001-mvp/design/tokens.json
{
  "$schema": "../../../.design/schemas/tokens.schema.json",

  "colors": {
    "primary": {
      "50": "#eff6ff",
      "100": "#dbeafe",
      "500": "#3b82f6",
      "600": "#2563eb",
      "700": "#1d4ed8",
      "DEFAULT": "#3b82f6"
    },
    "success": {
      "50": "#f0fdf4",
      "500": "#10b981",
      "DEFAULT": "#10b981"
    },
    "error": {
      "50": "#fef2f2",
      "500": "#ef4444",
      "DEFAULT": "#ef4444"
    },
    "warning": {
      "50": "#fffbeb",
      "500": "#f59e0b",
      "DEFAULT": "#f59e0b"
    },
    "neutral": {
      "50": "#f9fafb",
      "100": "#f3f4f6",
      "500": "#6b7280",
      "900": "#111827",
      "DEFAULT": "#6b7280"
    }
  },

  "typography": {
    "fontFamily": {
      "sans": "Inter, system-ui, sans-serif",
      "mono": "JetBrains Mono, monospace"
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem"
    },
    "fontWeight": {
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700"
    },
    "lineHeight": {
      "tight": "1.25",
      "normal": "1.5",
      "relaxed": "1.75"
    }
  },

  "spacing": {
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "6": "1.5rem",
    "8": "2rem",
    "12": "3rem",
    "16": "4rem"
  },

  "breakpoints": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px"
  },

  "borderRadius": {
    "sm": "0.25rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "full": "9999px"
  },

  "shadows": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)"
  }
}
```

**Tailwind Integration:**
```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import tokens from './.specify/specs/001-mvp/design/tokens.json';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: tokens.colors.primary,
        success: tokens.colors.success,
        error: tokens.colors.error,
        warning: tokens.colors.warning,
        neutral: tokens.colors.neutral
      },
      fontFamily: {
        sans: tokens.typography.fontFamily.sans.split(', '),
        mono: tokens.typography.fontFamily.mono.split(', ')
      },
      fontSize: tokens.typography.fontSize,
      spacing: tokens.spacing,
      borderRadius: tokens.borderRadius,
      boxShadow: tokens.shadows
    }
  },
  plugins: []
};

export default config;
```

---

### D2: Accessibility Standards (WCAG 2.2 Level AA)

**Targets Obligatoires:**

1. **Contrast Ratios**
   - Texte normal : ≥4.5:1
   - Texte large (≥18px ou ≥14px bold) : ≥3:1
   - UI components : ≥3:1

2. **Keyboard Navigation**
   - 100% features accessibles sans souris
   - Focus visible (outline 2px primary-500)
   - Tab order logique
   - Skip links ("Aller au contenu")

3. **Screen Readers**
   - Semantic HTML (`<nav>`, `<main>`, `<article>`)
   - ARIA labels sur boutons iconographiques
   - `alt` text sur images informatives
   - Status messages (`role="status"`, `aria-live="polite"`)

4. **Forms**
   - Labels associés (`<label htmlFor="...">`)
   - Error messages (`aria-invalid`, `aria-describedby`)
   - Required fields marqués (`aria-required`)

**Validation Tools:**
```bash
# Automated testing
npm run test:a11y  # axe-core via @axe-core/react

# Manual testing checklist
- [ ] Test keyboard navigation (Tab, Shift+Tab, Enter, Escape)
- [ ] Test screen reader (VoiceOver macOS, NVDA Windows)
- [ ] Test high contrast mode
- [ ] Test zoom 200%
```

**Example Component:**
```typescript
// ✅ Bon : Accessible MetricsCard
export function MetricsCard({ title, value, trend }: MetricsCardProps) {
  const trendLabel = trend > 0 ? 'en hausse' : trend < 0 ? 'en baisse' : 'stable';

  return (
    <div className="p-4 bg-white rounded-lg shadow-md" role="region" aria-labelledby={`metric-${title}`}>
      <h3 id={`metric-${title}`} className="text-sm font-medium text-neutral-600">
        {title}
      </h3>
      <p className="text-3xl font-bold text-neutral-900 mt-2">
        {value}
      </p>
      {trend !== undefined && (
        <p className={`text-sm mt-1 ${trend > 0 ? 'text-success-500' : 'text-error-500'}`}>
          <span className="sr-only">{trendLabel} de </span>
          {trend > 0 ? '+' : ''}{trend}%
        </p>
      )}
    </div>
  );
}
```

---

### D3: Responsive Strategy (Mobile-First)

**Breakpoints:**
- Mobile : <640px (base styles)
- Tablet : 640px - 1023px (sm:, md:)
- Desktop : ≥1024px (lg:, xl:)

**Grid System:**
```typescript
// Dashboard Layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar - hidden mobile, visible desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <Sidebar />
      </aside>

      {/* Main content - full width mobile, offset desktop */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed inset-x-0 bottom-0 bg-white border-t">
        <MobileNav />
      </nav>
    </div>
  );
}

// Responsive Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <MetricsCard title="Score" value={67} />
  <MetricsCard title="Mentions" value={15} />
  <MetricsCard title="Position" value={2.3} />
  <MetricsCard title="Sentiment" value={85} />
</div>
```

---

## 🔒 Security Standards

### S1: Authentication & Authorization

**Supabase Auth Flow:**
```typescript
// Middleware (middleware.ts)
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value; },
        set(name, value, options) { response.cookies.set({ name, value, ...options }); },
        remove(name, options) { response.cookies.set({ name, value: '', ...options }); }
      }
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Protect /dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/optimize/:path*', '/settings/:path*']
};
```

**API Key Management:**
```typescript
// lib/ai/client.ts
import { OpenAI } from 'openai';

// ❌ Mauvais : Hardcoded key
const openai = new OpenAI({ apiKey: 'sk-...' });

// ✅ Bon : Environment variable
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY not set');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
```

**Rate Limiting:**
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
});

// Rate limits par tier
export const rateLimits = {
  audit: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 audits/h (free)
    analytics: true
  }),

  api_starter: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 d') // 100 req/day
  }),

  api_pro: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1000, '1 d') // 1000 req/day
  })
};

// Usage dans API route
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await rateLimits.audit.limit(ip);

  if (!success) {
    return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  // Continue...
}
```

---

### S2: Data Privacy (GDPR Compliance)

**User Data Handling:**

1. **Consent Management**
   - Cookie banner (analytics opt-in)
   - Email marketing opt-in explicite
   - Data retention policy (90 jours monitoring_results)

2. **Data Access Rights**
   - Export data (JSON format)
   - Delete account + cascade delete

3. **Sensitive Data**
   - ❌ Pas de stockage emails clients finaux
   - ✅ Anonymisation logs après 30 jours
   - ✅ Encryption at rest (Supabase default)

**Implementation:**
```typescript
// app/api/user/export/route.ts
export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const businesses = await supabase
    .from('businesses')
    .select('*, queries(*), monitoring_results(*), perfect_answers(*)')
    .eq('user_id', session.user.id);

  return Response.json({
    user: session.user,
    businesses: businesses.data,
    exportedAt: new Date().toISOString()
  }, {
    headers: {
      'Content-Disposition': 'attachment; filename="localai-seo-data.json"'
    }
  });
}

// app/api/user/delete/route.ts
export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return new Response('Unauthorized', { status: 401 });

  // Cascade delete via RLS + on delete cascade
  await supabase.from('businesses').delete().eq('user_id', session.user.id);
  await supabase.auth.admin.deleteUser(session.user.id);

  return Response.json({ success: true });
}
```

---

## 📊 Quality Gates (E8)

### Phase P0: Build (Bloquant)

```bash
# Must pass before commit
npm run build

# Zero TypeScript errors tolérés
# Zero build warnings tolérés
```

**CI Check:**
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build  # ← P0 gate
```

---

### Phase P1: Lint (Bloquant)

```bash
npm run lint

# ESLint + Prettier
# Zero errors tolérés
# Warnings: review case-by-case
```

**Configuration:**
```javascript
// eslint.config.js
export default [
  {
    rules: {
      'no-console': 'warn', // Warn (not error) pour console.log
      'no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn'
    }
  }
];

// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

### Phase P2: Tests (Bloquant sur main)

```bash
npm run test

# Coverage minimale :
# - Statements: 70%
# - Branches: 65%
# - Functions: 70%
# - Lines: 70%
```

**Vitest Configuration:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 70,
        branches: 65,
        functions: 70,
        lines: 70
      },
      exclude: [
        'node_modules/',
        '.next/',
        'components/ui/', // shadcn components
        '**/*.config.ts'
      ]
    }
  }
});
```

---

### Phase P3: Performance (Warning)

**Lighthouse CI Targets:**
- Performance : ≥90 (mobile + desktop)
- Accessibility : ≥95
- Best Practices : ≥90
- SEO : ≥90

**Budget Performance:**
```json
// .lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000", "http://localhost:3000/dashboard"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 2000 }],
        "interactive": ["warn", { "maxNumericValue": 3500 }]
      }
    }
  }
}
```

---

### Phase P4: Security (Bloquant)

```bash
# Dependency audit
npm audit --audit-level=high

# Zero high/critical vulnerabilities tolérées
```

**Dependabot Configuration:**
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "manu"
```

---

## 🚀 Deployment & Operations

### Deployment Strategy

**Environments:**

1. **Development** (local)
   - `npm run dev`
   - Supabase local (`npx supabase start`)
   - Mock AI responses (éviter coûts API)

2. **Preview** (Vercel Preview)
   - Auto-deploy sur chaque PR
   - Supabase staging database
   - Real AI APIs (limited queries)

3. **Production** (Vercel Production)
   - Deploy sur merge to `main`
   - Supabase production database
   - Real AI APIs (full)

**Environment Variables:**
```bash
# .env.local (development)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...
PERPLEXITY_API_KEY=pplx-...

STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_APP_URL=http://localhost:3000

# .env.production (Vercel)
# Same variables, production values
```

---

### Monitoring & Alerting

**Tools:**

1. **Sentry** (Error Tracking)
   - Frontend errors
   - API errors
   - Performance monitoring

2. **Vercel Analytics** (Web Vitals)
   - Core Web Vitals
   - Real User Monitoring

3. **PostHog** (Product Analytics)
   - User behavior
   - Feature usage
   - Funnels (audit → signup → paid)

4. **Uptime Robot** (Uptime Monitoring)
   - Ping `/api/health` every 5 min
   - Alert si down >2 min

**Health Check Endpoint:**
```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    openai: await checkOpenAI(),
    anthropic: await checkAnthropic(),
    perplexity: await checkPerplexity(),
    stripe: await checkStripe()
  };

  const allHealthy = Object.values(checks).every(c => c.status === 'ok');

  return Response.json({
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks
  }, {
    status: allHealthy ? 200 : 503
  });
}

async function checkDatabase() {
  try {
    const { error } = await supabase.from('businesses').select('count').limit(1);
    return { status: error ? 'error' : 'ok' };
  } catch {
    return { status: 'error' };
  }
}
```

---

## 📜 Documentation Standards

### Code Documentation

**JSDoc Required:**
- Toutes fonctions publiques
- Types complexes
- Business logic critique

```typescript
/**
 * Calcule le score de visibilité IA basé sur les résultats de monitoring.
 *
 * Formule:
 * - Mentionné = 30 points
 * - Position 1 = 40 points, Position 2 = 30 points, Position 3 = 20 points
 * - Sentiment positif = +10 points
 *
 * @param results - Résultats de monitoring des 3 plateformes
 * @returns Score entre 0 et 100
 *
 * @example
 * const score = calculateVisibilityScore([
 *   { platform: 'chatgpt', mentioned: true, position: 2, sentiment: 'positive' },
 *   { platform: 'claude', mentioned: false },
 *   { platform: 'perplexity', mentioned: true, position: 1, sentiment: 'positive' }
 * ]);
 * // Returns: 67
 */
export function calculateVisibilityScore(results: MonitoringResult[]): number {
  // Implementation
}
```

### User Documentation

**Required Docs:**

1. **README.md** (root)
   - Project overview
   - Setup instructions
   - Development workflow

2. **docs/API.md**
   - API endpoints
   - Request/response examples
   - Error codes

3. **docs/DEPLOYMENT.md**
   - Environment setup
   - CI/CD pipeline
   - Rollback procedure

4. **In-App Help**
   - Tooltips sur métriques complexes
   - Onboarding guide (first-time users)
   - FAQ page

---

## ✅ Success Criteria

**Ce projet est considéré réussi si :**

### Business Success (Month 3)
- [ ] 20 clients payants actifs
- [ ] MRR ≥5,970€
- [ ] Churn rate <15%/mois
- [ ] NPS ≥40

### Technical Success (Post-MVP)
- [ ] Uptime ≥99%
- [ ] Dashboard load time <2s (p95)
- [ ] Monitoring accuracy ≥90%
- [ ] Zero critical security vulnerabilities
- [ ] Test coverage ≥70%

### User Success (Month 1)
- [ ] 80% users ont +10% AI Visibility Score en 30 jours
- [ ] Dashboard logins ≥2x/semaine (avg)
- [ ] 50% alerts actionnées dans 48h

---

## 🔄 Review & Updates

**Constitution Review Schedule:**
- Post-beta (Semaine 4) : Ajuster standards basés sur learnings
- Mensuel : Review quality gates, metrics
- Trimestriel : Revue complète architecture + design

**Change Process:**
1. Proposer changement (GitHub Discussion)
2. Review team (async)
3. Update constitution.md
4. Communicate changes (Slack/email)

---

**Version:** 1.0
**Last Updated:** 2025-01-05
**Next Review:** 2025-02-05 (Post-Beta)
**Owner:** @manu

*Cette constitution est un document vivant. Suggestions et améliorations bienvenues via GitHub Discussions.*
