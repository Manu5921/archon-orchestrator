# Prompt Gemini : Code Review Modules Library V7.0 Phase 1

## Context

Tu es un expert senior en architecture logicielle, sécurité, et best practices Next.js 15 + TypeScript. Tu vas auditer une bibliothèque de modules réutilisables pour détecter :

1. **Bugs critiques** (erreurs logiques, edge cases, race conditions)
2. **Vulnérabilités sécurité** (OWASP Top 10, injection, XSS, CSRF, authentication flaws)
3. **Mauvaises pratiques** (anti-patterns, code smell, performance issues)
4. **Incompatibilités** (Next.js 15 App Router, React Server Components, TypeScript strict)
5. **Documentation manquante** (types incomplets, JSDoc absents, exemples manquants)

## Modules à Auditer

### Module 1 : Authentication (Supabase)
**Chemin :** `/Users/manu/Documents/DEV/archon-orchestrator/lib/nextjs/auth/supabase/`

**Fichiers clés :**
- `client.ts` - Supabase client (browser)
- `server.ts` - Supabase server actions (sign-in, sign-up, sign-out, reset-password)
- `middleware.ts` - Next.js middleware (session refresh)
- `hooks.ts` - React hooks (useUser, useSupabaseClient)
- `types.ts` - TypeScript types

**Points critiques à vérifier :**
- ✅ Session management sécurisé (cookies httpOnly, SameSite=Lax)
- ✅ CSRF protection (middleware)
- ✅ Password reset flow (email verification)
- ✅ Error handling (pas de leak d'info sensible)
- ✅ Type safety (strict TypeScript)
- ❌ Injection SQL (via Supabase client)
- ❌ XSS dans redirects
- ❌ Race conditions (session refresh)

---

### Module 2 : Payments (Stripe)
**Chemin :** `/Users/manu/Documents/DEV/archon-orchestrator/lib/nextjs/payments/stripe/`

**Fichiers clés :**
- `client.ts` - Stripe client (browser)
- `server.ts` - Stripe server actions (create-checkout, create-portal)
- `webhooks.ts` - Stripe webhooks handler (signature verification)
- `products.ts` - Products & pricing fetching
- `types.ts` - TypeScript types

**Points critiques à vérifier :**
- ✅ Webhook signature verification (MANDATORY avant traitement)
- ✅ Idempotency (duplicate webhook events)
- ✅ Amount validation (prevent price manipulation)
- ✅ Metadata validation (user_id ownership)
- ✅ Error handling (retry logic, logging)
- ❌ Webhook replay attacks
- ❌ Price tampering client-side
- ❌ Missing webhook events handling

---

### Module 3 : Email (Resend)
**Chemin :** `/Users/manu/Documents/DEV/archon-orchestrator/lib/nextjs/email/resend/`

**Fichiers clés :**
- `client.ts` - Resend client
- `templates.tsx` - React Email templates (welcome, reset-password, invoice)
- `server.ts` - Send email server action
- `types.ts` - TypeScript types

**Points critiques à vérifier :**
- ✅ Email injection prevention (sanitize inputs)
- ✅ Rate limiting (prevent spam)
- ✅ Template XSS protection (React Email escaping)
- ✅ Error handling (Resend API failures)
- ❌ Open redirect via email links
- ❌ SMTP header injection
- ❌ PII leak dans logs

---

### Module 4 : UI Components (shadcn/ui + Design Tokens)
**Chemin :** `/Users/manu/Documents/DEV/archon-orchestrator/lib/nextjs/ui/`

**Fichiers clés :**
- `components/` - 21 composants (forms, auth, marketing, payment, dashboard)
- `config/design-tokens.json` - Design system (8 color scales, fonts, spacing)
- `styles/globals.css` - CSS variables mapping
- `tailwind.preset.js` - Tailwind config (token integration)

**Points critiques à vérifier :**
- ✅ CSS variables usage (0 hardcoded colors)
- ✅ Accessibility (ARIA labels, keyboard navigation)
- ✅ Dark mode support (color-scheme CSS)
- ✅ Responsive design (mobile-first)
- ✅ Type safety (TypeScript props)
- ❌ XSS via dangerouslySetInnerHTML
- ❌ Layout shifts (CLS metrics)
- ❌ Missing loading states

---

## Format de Réponse Attendu

Pour **chaque module**, structure ta réponse ainsi :

### 🔴 **CRITIQUES (Blockers - MUST FIX)**
Liste des bugs/vulnérabilités **critiques** qui empêchent production.

**Format :**
```
- [FICHIER:LIGNE] Description problème
  Impact: [Sécurité|Bug|Performance]
  Sévérité: CRITIQUE
  Reproduction: Steps to reproduce
  Fix suggéré: Code snippet ou stratégie
```

### 🟠 **MAJEURS (Important - SHOULD FIX)**
Problèmes importants mais non-bloquants (dégradations, mauvaises pratiques).

**Format :** (même structure que CRITIQUES)

### 🟡 **MINEURS (Nice to have - COULD FIX)**
Améliorations code quality, performance, lisibilité.

**Format :** (même structure que CRITIQUES)

### ✅ **VALIDATIONS (Ce qui est bien fait)**
Points positifs du code (patterns corrects, sécurité OK, best practices).

**Format :**
```
- ✅ [PATTERN] Description
  Justification: Pourquoi c'est bien
```

---

## Critères d'Évaluation (Score /100)

Attribue un **score global /100** pour chaque module :

- **90-100** : Production-ready, best practices respectées
- **80-89** : Bonne qualité, quelques améliorations mineures
- **70-79** : Acceptable, corrections majeures nécessaires
- **60-69** : Problématique, refactoring requis
- **<60** : Non recommandé, rewrite suggéré

**Breakdown score :**
- Sécurité : /30
- Qualité code : /25
- Performance : /15
- TypeScript : /15
- Documentation : /15

---

## Contexte Technique Additionnel

**Stack :**
- Next.js 15.1.6 (App Router, React Server Components)
- TypeScript 5.7 strict mode
- Supabase (Auth + Database, SSR avec cookies)
- Stripe (Checkout + Webhooks + Customer Portal)
- Resend (Email) + React Email (templates)
- shadcn/ui (Radix UI + Tailwind CSS)
- Vitest + Testing Library (unit tests)

**Philosophy :**
- **Design Decoupling** : CSS variables ONLY (no hardcoded colors)
- **Server Actions** : Next.js 15 server actions (no API routes)
- **Type Safety** : TypeScript strict, Zod validation
- **Security-First** : OWASP LLM + OWASP Top 10 compliance
- **Battle-Tested** : Patterns from Vercel Next.js SaaS Starter (14.7k ⭐, MIT)

**Known Limitations (attendues) :**
- ✅ Pas de tests E2E Playwright (unit tests only)
- ✅ Pas de rate limiting middleware (à implémenter projet-side)
- ✅ Pas de i18n (English only pour l'instant)
- ✅ Pas de monitoring/observability (à intégrer projet-side)

---

## Instructions Exécution

1. **Lis tous les fichiers** des 4 modules (auth, payments, email, ui)
2. **Analyse le code** selon les critères ci-dessus
3. **Identifie les problèmes** (critiques → mineurs)
4. **Propose des fixes** concrets (code snippets)
5. **Attribue un score** /100 par module
6. **Résume les findings** (executive summary)

---

## Livrables Attendus

### 1. Rapport Détaillé par Module (4 rapports)

**Format Markdown :**
```markdown
# Audit : [Module Name]

## Score : XX/100
- Sécurité : XX/30
- Qualité : XX/25
- Performance : XX/15
- TypeScript : XX/15
- Documentation : XX/15

## 🔴 CRITIQUES (N items)
[Liste détaillée]

## 🟠 MAJEURS (N items)
[Liste détaillée]

## 🟡 MINEURS (N items)
[Liste détaillée]

## ✅ VALIDATIONS
[Liste détaillée]

## Recommandations Prioritaires
1. [Action 1]
2. [Action 2]
3. [Action 3]
```

### 2. Executive Summary (1 page)

**Contenu :**
- Score global /100 (moyenne 4 modules)
- Top 5 problèmes critiques (cross-modules)
- Top 3 points forts
- Recommandation finale : Production-ready ? (Oui/Non + justification)
- Roadmap corrections (timeline estimée)

---

## Questions à Répondre

1. **Production-Ready ?** Les modules peuvent-ils être utilisés en production tels quels ?
2. **Sécurité Critical ?** Y a-t-il des vulnérabilités critiques (OWASP) ?
3. **Refactoring Requis ?** Quels fichiers nécessitent un rewrite ?
4. **Best Practices ?** Les patterns Next.js 15 + React Server Components sont-ils respectés ?
5. **Type Safety ?** TypeScript strict mode est-il correctement appliqué ?
6. **Performance ?** Y a-t-il des bottlenecks identifiables ?

---

## Exemples de Problèmes à Détecter

### 🔴 Critique : Webhook Signature Non Vérifiée

```typescript
// ❌ VULNERABILITY : Missing signature verification
export async function POST(req: Request) {
  const payload = await req.json();
  // DANGER : Anyone can send fake webhook events
  await processPayment(payload);
}

// ✅ FIX : Verify Stripe signature
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const payload = await req.text();

  const event = stripe.webhooks.constructEvent(
    payload,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  await processPayment(event);
}
```

### 🟠 Majeur : Type Any Utilisé

```typescript
// ❌ BAD : Type safety loss
export async function getUser(): Promise<any> {
  return supabase.auth.getUser();
}

// ✅ FIX : Strict typing
export async function getUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}
```

### 🟡 Mineur : Hardcoded Color

```typescript
// ❌ BAD : Design Decoupling violated
<button className="bg-blue-600 text-white">Submit</button>

// ✅ FIX : CSS variables
<button className="bg-primary-500 text-neutral-50">Submit</button>
```

---

## Fichiers de Référence

**Architecture :**
- `/Users/manu/Documents/DEV/archon-orchestrator/lib/README.md`
- `/Users/manu/Documents/DEV/archon-orchestrator/lib/INTEGRATION-GUIDE.md`
- `/Users/manu/Documents/DEV/archon-orchestrator/docs/LIBRARY-ARCHITECTURE.md`

**Tests Existants :**
- `/Users/manu/Documents/DEV/archon-orchestrator/lib/nextjs/ui/tests/unit/*.test.tsx`

**Documentation :**
- `/Users/manu/Documents/DEV/archon-orchestrator/lib/nextjs/ui/COMPONENT-CATALOG.md`
- `/Users/manu/Documents/DEV/archon-orchestrator/lib/nextjs/ui/INTEGRATION-EXAMPLES.md`

---

## Début de l'Audit

Tu peux maintenant commencer l'audit en lisant les fichiers des 4 modules. Commence par le module **auth/supabase** (le plus critique pour la sécurité), puis **payments/stripe**, **email/resend**, et enfin **ui**.

**Bonne chance ! 🚀**
