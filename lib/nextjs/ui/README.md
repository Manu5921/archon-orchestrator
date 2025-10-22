# lib/nextjs/ui - Design System + Components

**Status:** 🚧 To be implemented (Day 5-6)
**Setup time:** 5 min (vs 2h manual)
**Dependencies:** tailwindcss, shadcn/ui dependencies

---

## 📋 OVERVIEW

Complete UI module with:
- **design-tokens.json** - CSS variables (Design Decoupling ⭐)
- Tailwind preset using design tokens
- shadcn/ui components (10+)
- Auth forms (SignInForm, SignUpForm)
- Payment components (PricingTable, CheckoutButton)
- Marketing components (Hero, Features, CTA)

---

## 🎨 DESIGN DECOUPLING

**CSS variables throughout:**
```tsx
// ✅ DO: Design tokens
<button className="bg-primary-500 text-neutral-50">Submit</button>

// ❌ DON'T: Hardcoded
<button className="bg-blue-600 text-white">Submit</button>
```

**15-min rebrand:** `/import-design custom-tokens.json` → UI transforms

---

## 🚀 QUICK START

```bash
/use-modules nextjs/ui

# Install: pnpm install
# Customize: Edit design-tokens.json
```

---

**Status:** 🚧 Template Ready (Day 1/7)
