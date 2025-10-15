---
description: Generate design system (design-tokens.json + wireframes + components list) for Design/Dev Decoupling
argument-hint: [optional-context]
allowed-tools: Write(*), Read(*), Bash(*)
model: claude-sonnet-4-5-20250929
---

# 🎨 Spec-Kit Design System Generator

Generate complete design system for Design/Dev Decoupling pattern (V5 Competitive Advantage).

**Output Files:**
1. `design/design-tokens.json` (20 core tokens - placeholder)
2. `design/wireframes/*.svg` (low-fidelity layouts)
3. `design/components-list.md` (shadcn/ui mapping)

**Purpose:** Enable parallel work (dev uses tokens → designer customizes → 15min merge).

---

## Instructions

**Context:** $ARGUMENTS (optional - leave empty for auto-detection)

### Step 1: Read Project Context

Read these files to understand project:
- `.specify/memory/constitution.md` (vision, features, personas)
- `specs/001-mvp/spec.md` (technical requirements)

Extract:
- Primary color theme (SaaS → blue, E-commerce → orange, Healthcare → green)
- Typography needs (corporate → Satoshi, startup → Inter)
- Component requirements (features → UI components needed)

### Step 2: Generate Design Tokens

**File:** `design/design-tokens.json`

**Template (20 core tokens):**

```json
{
  "colors": {
    "primary": {
      "50": "#EFF6FF",
      "100": "#DBEAFE",
      "200": "#BFDBFE",
      "300": "#93C5FD",
      "400": "#60A5FA",
      "500": "#3B82F6",
      "600": "#2563EB",
      "700": "#1D4ED8",
      "800": "#1E40AF",
      "900": "#1E3A8A"
    },
    "secondary": {
      "50": "#F0FDF4",
      "100": "#DCFCE7",
      "500": "#10B981",
      "600": "#059669",
      "900": "#064E3B"
    },
    "neutral": {
      "50": "#F8FAFC",
      "100": "#F1F5F9",
      "200": "#E2E8F0",
      "300": "#CBD5E1",
      "400": "#94A3B8",
      "500": "#64748B",
      "600": "#475569",
      "700": "#334155",
      "800": "#1E293B",
      "900": "#0F172A"
    },
    "success": {
      "50": "#F0FDF4",
      "500": "#10B981",
      "900": "#064E3B"
    },
    "warning": {
      "50": "#FFFBEB",
      "500": "#F59E0B",
      "900": "#78350F"
    },
    "error": {
      "50": "#FEF2F2",
      "500": "#EF4444",
      "900": "#7F1D1D"
    }
  },
  "typography": {
    "heading": {
      "family": "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      "weight": "700",
      "sizes": {
        "h1": "2.5rem",
        "h2": "2rem",
        "h3": "1.5rem",
        "h4": "1.25rem"
      }
    },
    "body": {
      "family": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      "weight": "400",
      "sizes": {
        "base": "1rem",
        "sm": "0.875rem",
        "xs": "0.75rem"
      }
    },
    "code": {
      "family": "JetBrains Mono, 'Courier New', monospace",
      "weight": "400"
    }
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem",
    "3xl": "4rem"
  },
  "borderRadius": {
    "sm": "0.25rem",
    "md": "0.5rem",
    "lg": "0.75rem",
    "xl": "1rem",
    "full": "9999px"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1)"
  }
}
```

**Customization rules:**
- **SaaS:** Primary blue (#3B82F6), clean typography (Inter)
- **E-commerce:** Primary orange (#F59E0B), bold typography (Satoshi)
- **Healthcare:** Primary green (#10B981), accessible typography (Inter)
- **Finance:** Primary indigo (#6366F1), professional typography (Satoshi)

**Note:** These are PLACEHOLDER tokens. Designer will replace in Phase 4 via `/import-design`.

### Step 3: Generate Wireframes

Create directory: `design/wireframes/`

**Generate SVG wireframes (low-fidelity):**

**3.1 Dashboard Layout** (`dashboard.svg`)

```svg
<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="800" fill="#F8FAFC"/>

  <!-- Sidebar -->
  <rect x="0" y="0" width="240" height="800" fill="#1E293B"/>
  <text x="20" y="40" fill="#F8FAFC" font-size="18" font-weight="bold">Logo</text>
  <text x="20" y="100" fill="#94A3B8" font-size="14">Navigation</text>
  <rect x="20" y="120" width="200" height="40" fill="#334155" rx="4"/>
  <rect x="20" y="170" width="200" height="40" fill="#1E293B" rx="4"/>
  <rect x="20" y="220" width="200" height="40" fill="#1E293B" rx="4"/>

  <!-- Header -->
  <rect x="240" y="0" width="960" height="64" fill="#FFFFFF" stroke="#E2E8F0"/>
  <text x="270" y="40" fill="#1E293B" font-size="16">Dashboard Title</text>

  <!-- Content Area -->
  <rect x="270" y="94" width="900" height="200" fill="#FFFFFF" stroke="#E2E8F0" rx="8"/>
  <text x="290" y="130" fill="#64748B" font-size="14">Main Content Area</text>

  <rect x="270" y="324" width="430" height="150" fill="#FFFFFF" stroke="#E2E8F0" rx="8"/>
  <text x="290" y="360" fill="#64748B" font-size="14">Card 1</text>

  <rect x="730" y="324" width="430" height="150" fill="#FFFFFF" stroke="#E2E8F0" rx="8"/>
  <text x="750" y="360" fill="#64748B" font-size="14">Card 2</text>
</svg>
```

**3.2 Authentication Flow** (`auth-flow.svg`)

```svg
<svg width="1200" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="600" fill="#F8FAFC"/>

  <!-- Login Screen -->
  <rect x="50" y="50" width="300" height="500" fill="#FFFFFF" stroke="#E2E8F0" rx="8"/>
  <text x="150" y="100" fill="#1E293B" font-size="18" text-anchor="middle">Login</text>
  <rect x="80" y="150" width="240" height="40" fill="#F1F5F9" stroke="#CBD5E1" rx="4"/>
  <text x="100" y="175" fill="#64748B" font-size="12">Email</text>
  <rect x="80" y="210" width="240" height="40" fill="#F1F5F9" stroke="#CBD5E1" rx="4"/>
  <text x="100" y="235" fill="#64748B" font-size="12">Password</text>
  <rect x="80" y="280" width="240" height="40" fill="#3B82F6" rx="4"/>
  <text x="200" y="305" fill="#FFFFFF" font-size="14" text-anchor="middle">Sign In</text>

  <!-- Signup Screen -->
  <rect x="450" y="50" width="300" height="500" fill="#FFFFFF" stroke="#E2E8F0" rx="8"/>
  <text x="550" y="100" fill="#1E293B" font-size="18" text-anchor="middle">Sign Up</text>
  <rect x="480" y="150" width="240" height="40" fill="#F1F5F9" stroke="#CBD5E1" rx="4"/>
  <text x="500" y="175" fill="#64748B" font-size="12">Name</text>
  <rect x="480" y="210" width="240" height="40" fill="#F1F5F9" stroke="#CBD5E1" rx="4"/>
  <text x="500" y="235" fill="#64748B" font-size="12">Email</text>
  <rect x="480" y="270" width="240" height="40" fill="#F1F5F9" stroke="#CBD5E1" rx="4"/>
  <text x="500" y="295" fill="#64748B" font-size="12">Password</text>
  <rect x="480" y="340" width="240" height="40" fill="#3B82F6" rx="4"/>
  <text x="600" y="365" fill="#FFFFFF" font-size="14" text-anchor="middle">Create Account</text>

  <!-- Reset Password -->
  <rect x="850" y="50" width="300" height="500" fill="#FFFFFF" stroke="#E2E8F0" rx="8"/>
  <text x="950" y="100" fill="#1E293B" font-size="18" text-anchor="middle">Reset</text>
  <rect x="880" y="150" width="240" height="40" fill="#F1F5F9" stroke="#CBD5E1" rx="4"/>
  <text x="900" y="175" fill="#64748B" font-size="12">Email</text>
  <rect x="880" y="220" width="240" height="40" fill="#3B82F6" rx="4"/>
  <text x="1000" y="245" fill="#FFFFFF" font-size="14" text-anchor="middle">Send Reset Link</text>
</svg>
```

**3.3 Feature-Specific Wireframes**

Generate additional wireframes based on project features:
- Form builder → `form-editor.svg`
- Analytics → `analytics-dashboard.svg`
- Chat → `chat-interface.svg`
- Kanban → `kanban-board.svg`

**Template:**
```svg
<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="800" fill="#F8FAFC"/>
  <!-- Feature-specific layout boxes with labels -->
</svg>
```

### Step 4: Generate Components List

**File:** `design/components-list.md`

```markdown
# UI Components List (shadcn/ui)

**Generated:** [DATE]
**Project:** [PROJECT_NAME]

---

## Installation Command

\`\`\`bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input form label select table dialog toast alert
\`\`\`

---

## Must-Have Components (P0)

### Forms
- **button** - Primary, secondary, ghost, outline variants
  - Usage: CTAs, form submissions, navigation
  - Customization: Uses `design-tokens.json` primary colors

- **input** - Text, email, password, number fields
  - Usage: All form inputs
  - Customization: Border radius from tokens

- **label** - Accessible form labels
  - Usage: Form field labels
  - Customization: Typography from tokens

- **form** - Form wrapper with validation (React Hook Form + Zod)
  - Usage: All forms (auth, settings, data entry)

- **select** - Dropdown select
  - Usage: Country selection, category filters

- **textarea** - Multi-line text input
  - Usage: Comments, descriptions, messages

- **checkbox** - Boolean input
  - Usage: Terms acceptance, feature toggles

- **radio-group** - Single choice from multiple options
  - Usage: Plan selection, preferences

### Layout
- **card** - Content containers
  - Usage: Dashboard widgets, list items, feature sections
  - Customization: Shadow and radius from tokens

- **separator** - Visual dividers
  - Usage: Section separators

- **sheet** - Slide-over panels
  - Usage: Mobile navigation, settings panel

- **dialog** - Modal dialogs
  - Usage: Confirmations, forms, detailed views

- **tabs** - Tabbed navigation
  - Usage: Settings sections, data views

### Feedback
- **toast** - Notifications
  - Usage: Success/error messages, confirmations
  - Customization: Success/warning/error colors from tokens

- **alert** - Warning/error/success messages
  - Usage: Inline feedback, warnings

- **badge** - Status indicators
  - Usage: Tags, statuses, counts

- **progress** - Progress indicators
  - Usage: Upload progress, loading states

### Data Display
- **table** - Data tables
  - Usage: Admin panels, data grids
  - Customization: Zebra striping with neutral colors

- **avatar** - User avatars
  - Usage: User profiles, comments

- **tooltip** - Contextual help
  - Usage: Icon explanations, help text

---

## Should-Have Components (P1)

- **accordion** - Collapsible sections (FAQs, settings)
- **dropdown-menu** - Context menus, action menus
- **popover** - Contextual popovers
- **scroll-area** - Custom scrollbars
- **skeleton** - Loading placeholders
- **switch** - Toggle switches

---

## Nice-to-Have Components (P2)

- **calendar** - Date picker
- **command** - Command palette (Cmd+K)
- **context-menu** - Right-click menus
- **hover-card** - Rich hover tooltips
- **menubar** - Desktop-style menu bar
- **navigation-menu** - Complex navigation
- **slider** - Range inputs

---

## Feature-Specific Components

[GENERATE based on project features]

Example for Chat app:
- **message-bubble** - Custom component (extends Card)
- **typing-indicator** - Custom component
- **emoji-picker** - Third-party integration

Example for E-commerce:
- **product-card** - Custom component (extends Card)
- **cart-drawer** - Custom component (extends Sheet)
- **price-display** - Custom component

---

## Customization Strategy

All components use CSS variables from `design-tokens.json`:

\`\`\`css
/* globals.css - Auto-synced with design-tokens.json */
:root {
  --primary-50: #EFF6FF;
  --primary-500: #3B82F6;
  --primary-900: #1E3A8A;
  /* ... */
}

.button-primary {
  background-color: var(--primary-500);
  color: var(--neutral-50);
}
\`\`\`

**Zero hardcoded colors** = Custom brand via `/import-design` in 15 min.

---

## Next Steps

1. Run installation command
2. Customize components with design tokens
3. Build feature-specific components (extend base components)
4. Wait for designer custom brand → `/import-design` (Phase 4)
```

### Step 5: Update Spec.md

Add design system section to `specs/001-mvp/spec.md`:

```markdown
## 🎨 Design System (Phase 1 - Placeholder)

### Design Tokens Generated
**File:** `design/design-tokens.json`

**Status:** ✅ Placeholder tokens (blue theme)

**Customization:** Phase 4 via `/import-design custom-tokens.json`

### Wireframes Generated
**Directory:** `design/wireframes/`

**Files:**
- `dashboard.svg` - Main application layout
- `auth-flow.svg` - Authentication screens
- [Feature-specific wireframes]

**Purpose:** Low-fidelity mockups for frontend-specialist

### Components List
**File:** `design/components-list.md`

**shadcn/ui Components:** [COUNT] components selected

**Installation:** Ready (command provided in components-list.md)

---

**Design/Dev Decoupling Status:** ✅ READY
- Dev can start using placeholder tokens immediately
- Designer can work in parallel (Figma → custom-tokens.json)
- Merge custom brand in 15 min (Phase 4) with 0 code changes
```

### Step 6: Verify Output

```bash
# Check files created
ls -la design/
ls -la design/wireframes/

# Verify design-tokens.json is valid JSON
cat design/design-tokens.json | jq .

echo "✅ Design system generated successfully"
echo ""
echo "📋 Next steps:"
echo "1. /speckit.plan (generate plan.md)"
echo "2. /speckit.tasks (generate tasks.md)"
echo "3. /speckit.agents (generate orchestration prompt)"
```

### Step 7: Summary

Output summary message:

```
✅ DESIGN SYSTEM GENERATED

Files created:
- design/design-tokens.json (20 core tokens)
- design/wireframes/dashboard.svg
- design/wireframes/auth-flow.svg
- design/wireframes/[feature-specific].svg
- design/components-list.md ([COUNT] shadcn/ui components)

Next steps:
1. Frontend-specialist can start development using placeholder tokens
2. Designer works in parallel (Figma → custom brand)
3. Phase 4: /import-design merges custom brand (15 min, 0 code changes)

Design/Dev Decoupling: ✅ ACTIVE (Competitive advantage vs Lovable/Bolt/v0)
```

---

## Why This Matters (Design/Dev Decoupling)

**Problem with AI tools (Lovable/Bolt/v0):**
- Generate code fast BUT design is generic (blue buttons, Inter font)
- Customization = 1-2 days refactor (hardcoded colors everywhere)

**Archon solution:**
- Generate code with CSS variables (placeholder tokens)
- Designer works in parallel (custom brand)
- Merge custom design in 15 min via `/import-design`

**Result:** Professional custom product vs generic template = Deal closer

**ROI Validated:**
- Time: 15 min merge vs 1-2 days refactor = **-95%**
- Risk: 0 breaking changes vs 20-30% components touched = **production-safe**
- Quality: Custom brand vs generic = **client differentiation**

---

**Pattern:** Design/Dev Decoupling (GOLDEN-PATTERNS.md - Health Score 9.9/10)
**Status:** ✅ Production Validated
**Next Command:** `/speckit.plan`
