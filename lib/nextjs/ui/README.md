# UI Module - Next.js 15 Components Library

**Version:** V7.0 Phase 2 Complete
**Framework:** Next.js 15 + Tailwind CSS + shadcn/ui
**Status:** ✅ Production Ready
**Setup time:** 5 min manual copy (until `/use-modules` command)

---

## 🎯 PURPOSE

Personal reusable UI component library with Design Decoupling philosophy:
- **Day 1:** Develop with placeholder tokens (blue #3B82F6)
- **Day 4:** Designer delivers custom brand (purple #8B5CF6)
- **Day 4 (15 min):** `/import-design` → UI transforms automatically

**Competitive Advantage:** 15-min rebrand vs 1-2 days refactoring (Lovable/Bolt/v0 require hardcoded color changes across 50+ components)

---

## 📦 COMPONENTS INCLUDED

### shadcn/ui Foundational (12 components)

**Form Components:** button, input, textarea, label, form, select

**Layout Components:** card, modal, table, dropdown-menu, radio-group, avatar

### Auth Forms (3 components)

Integrate with `lib/nextjs/auth/supabase`:
- SignInForm.tsx - Email/password sign-in
- SignUpForm.tsx - Registration with validation
- ResetPasswordForm.tsx - Password reset flow

### Payment Components (3 components)

Integrate with `lib/nextjs/payments/stripe`:
- PricingTable.tsx - Pricing plans display
- CheckoutButton.tsx - Stripe checkout integration
- SubscriptionStatus.tsx - Subscription state display (8 states)

### Marketing Components (3 components)

Generic templates customizable via design-tokens.json:
- Hero.tsx - Landing page hero (3 variants)
- Features.tsx - Features grid with icons (2-4 columns)
- CTA.tsx - Call-to-action section (3 variants)

**Total:** 21 components, 4,000+ lines, 84 tests ✅

---

## 🚀 QUICK START

### 1. Manual Copy (Phase 1)

```bash
# In your Next.js project
cp -r ~/archon-orchestrator/lib/nextjs/ui src/lib/ui

# Install dependencies
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  @radix-ui/react-label @radix-ui/react-select @radix-ui/react-avatar \
  class-variance-authority clsx tailwind-merge
```

### 2. Configure Tailwind

**Edit `tailwind.config.ts`:**

```typescript
import type { Config } from "tailwindcss";
import uiPreset from "./src/lib/ui/config/tailwind.preset";

const config: Config = {
  presets: [uiPreset],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/ui/components/**/*.{js,ts,jsx,tsx}", // ⭐ Include library
  ],
};
export default config;
```

### 3. Import Global Styles

**In `app/layout.tsx`:**

```typescript
import "./globals.css";
import "@/lib/ui/styles/globals.css"; // ⭐ Add this
```

### 4. Use Components

```typescript
import { Button } from "@/lib/ui/components/ui/button";
import { Hero } from "@/lib/ui/components/marketing/Hero";

export default function HomePage() {
  return (
    <>
      <Hero
        headline="Build SaaS Products Faster"
        subheadline="Production-ready components"
        primaryCta={{ label: "Get Started", href: "/signup" }}
      />
      <Button variant="default">Click Me</Button>
    </>
  );
}
```

---

## 🎨 DESIGN SYSTEM

### Color Scales (8 total)

- **primary:** Main brand (default: blue #3B82F6)
- **secondary:** Secondary actions (purple #A855F7)
- **accent:** Highlights (teal #14B8A6)
- **neutral:** Gray scale
- **success, warning, error, info:** Semantic colors

Each scale: 11 shades (50, 100, ..., 950)

### CSS Variables Enforcement

**NEVER hardcode colors:**

```typescript
// ❌ BAD
<div className="text-gray-900 bg-blue-600">

// ✅ GOOD
<div className="text-foreground bg-primary">
```

### Customization (15-min Rebrand)

**Step 1:** Modify `src/lib/ui/config/design-tokens.json`

```json
{
  "colors": {
    "primary": {
      "500": "#8B5CF6"  // Blue → Purple
    }
  }
}
```

**Step 2:** Rebuild → Done ✅

All components update automatically (0 code changes)

---

## 📚 DOCUMENTATION

- [COMPONENT-CATALOG.md](./COMPONENT-CATALOG.md) - Complete API reference
- [INTEGRATION-EXAMPLES.md](./INTEGRATION-EXAMPLES.md) - Full-stack examples
- [INTEGRATION-TEST.md](./INTEGRATION-TEST.md) - Testing guide

---

## 🧪 TESTING

```bash
# Run all tests (84 tests)
pnpm test

# Run specific suite
pnpm test Hero
pnpm test SignInForm
```

**Coverage:**
- ✅ Rendering (all components)
- ✅ Props validation
- ✅ lib/auth + lib/payments integration
- ✅ CSS Variables (0 hardcoded colors enforced)
- ✅ Accessibility (labels, ARIA)

---

## 🤝 CREDITS

**Based on:**
- [Vercel Next.js SaaS Starter](https://github.com/vercel/nextjs-subscription-payments) - MIT
- [shadcn/ui](https://ui.shadcn.com) - Component patterns

**Enhancements:**
- Design Decoupling (15-min rebrand)
- CSS variables enforcement
- lib/auth + lib/payments integration
- 84 tests

---

**Version:** V7.0 Phase 2 ✅
**License:** MIT (personal use)

*21 components, 0 hardcoded colors, 15-min rebrand* 🎨⚡
