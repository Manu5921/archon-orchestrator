---
description: Import custom design tokens and merge with existing project
argument-hint: [tokens-file-path]
allowed-tools: Read(*), Write(*), Edit(*), Bash(*)
model: claude-sonnet-4-5-20250929
---

# Import Custom Design System

**Purpose:** Replace placeholder design tokens with custom design system without refactoring code.

**Philosophy:** Design and development are decoupled from Day 1. Claude Code generates backend/logic using CSS variables (`bg-primary-500`, `font-heading`). Human/Designer creates custom design separately (Figma/v0/manual). This command merges custom design → transforms UI in 15 minutes vs 1-2 days refactor.

**ROI:** -95% time, 0 breaking changes, custom brand vs generic AI design (competitive advantage over Lovable/Bolt).

---

## Prerequisites Check

Before importing design tokens, verify:

1. **Project has design-tokens.json**
   ```bash
   ls -la design-tokens.json || echo "❌ Missing design-tokens.json"
   ```

2. **Tailwind configured with tokens**
   ```bash
   grep -q "design-tokens" tailwind.config.ts || echo "❌ Tailwind not synced"
   ```

3. **Components use CSS variables (not hardcoded colors)**
   ```bash
   # Good: className="bg-primary-500"
   # Bad: className="bg-blue-600"
   grep -r "bg-blue-\|text-red-\|border-green-" src/components/ && echo "⚠️ Hardcoded colors found"
   ```

---

## Step 1: Validate Custom Tokens

Read and validate the custom design tokens file structure.

**Required structure:**
```json
{
  "colors": {
    "primary": {"50": "#...", "500": "#...", "900": "#..."},
    "secondary": {...},
    "neutral": {...},
    "success": {...},
    "warning": {...},
    "error": {...}
  },
  "typography": {
    "heading": {"family": "...", "weight": "..."},
    "body": {"family": "...", "weight": "..."},
    "mono": {"family": "...", "weight": "..."}
  },
  "spacing": {
    "xs": "...",
    "sm": "...",
    "md": "...",
    "lg": "...",
    "xl": "..."
  },
  "borderRadius": {
    "sm": "...",
    "md": "...",
    "lg": "..."
  },
  "shadows": {
    "sm": "...",
    "md": "...",
    "lg": "..."
  }
}
```

**Validation checks:**
- All required keys present (`colors`, `typography`, `spacing`)
- Color scales complete (50, 100, 200, 300, 400, 500, 600, 700, 800, 900)
- Font families have fallbacks (e.g., "Satoshi, -apple-system, sans-serif")
- Spacing values in rem/px (not arbitrary)

**If validation fails:** Report missing keys, suggest fixes, EXIT without applying.

---

## Step 2: Backup Existing Tokens

Create backup before replacement:

```bash
cp design-tokens.json design-tokens.backup.$(date +%Y%m%d-%H%M%S).json
echo "✅ Backup created: design-tokens.backup.YYYYMMDD-HHMMSS.json"
```

---

## Step 3: Replace Tokens File

Replace `design-tokens.json` with validated custom tokens:

```bash
cp [tokens-file-path] design-tokens.json
echo "✅ Tokens replaced"
```

---

## Step 4: Update Tailwind Config

Sync `tailwind.config.ts` with new tokens:

**File:** `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";
import tokens from "./design-tokens.json";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: tokens.colors.primary,
        secondary: tokens.colors.secondary,
        neutral: tokens.colors.neutral,
        success: tokens.colors.success,
        warning: tokens.colors.warning,
        error: tokens.colors.error,
      },
      fontFamily: {
        heading: [tokens.typography.heading.family],
        body: [tokens.typography.body.family],
        mono: [tokens.typography.mono.family],
      },
      spacing: tokens.spacing,
      borderRadius: tokens.borderRadius,
      boxShadow: tokens.shadows,
    },
  },
  plugins: [],
};

export default config;
```

**If file exists:** Use Edit tool to update `theme.extend` section.
**If file missing:** Use Write tool to create complete config.

---

## Step 5: Update Global CSS

Update CSS variables in `src/app/globals.css` (or equivalent):

**File:** `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Primary Colors */
  --color-primary-50: [tokens.colors.primary.50];
  --color-primary-500: [tokens.colors.primary.500];
  --color-primary-900: [tokens.colors.primary.900];

  /* Secondary Colors */
  --color-secondary-50: [tokens.colors.secondary.50];
  --color-secondary-500: [tokens.colors.secondary.500];
  --color-secondary-900: [tokens.colors.secondary.900];

  /* Neutral Colors */
  --color-neutral-50: [tokens.colors.neutral.50];
  --color-neutral-500: [tokens.colors.neutral.500];
  --color-neutral-900: [tokens.colors.neutral.900];

  /* Typography */
  --font-heading: [tokens.typography.heading.family];
  --font-body: [tokens.typography.body.family];
  --font-mono: [tokens.typography.mono.family];

  /* Spacing */
  --spacing-xs: [tokens.spacing.xs];
  --spacing-sm: [tokens.spacing.sm];
  --spacing-md: [tokens.spacing.md];
  --spacing-lg: [tokens.spacing.lg];
  --spacing-xl: [tokens.spacing.xl];

  /* Border Radius */
  --radius-sm: [tokens.borderRadius.sm];
  --radius-md: [tokens.borderRadius.md];
  --radius-lg: [tokens.borderRadius.lg];

  /* Shadows */
  --shadow-sm: [tokens.shadows.sm];
  --shadow-md: [tokens.shadows.md];
  --shadow-lg: [tokens.shadows.lg];
}
```

**Implementation:**
1. Read `design-tokens.json`
2. Generate CSS variables from JSON structure
3. Replace `:root {}` section in globals.css

---

## Step 6: Install Custom Fonts (if needed)

If custom fonts specified, add to `src/app/layout.tsx`:

```typescript
import { Inter, Satoshi } from "next/font/google"; // or @next/font/local

const headingFont = Satoshi({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["700"],
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**If fonts are Google Fonts:** Use `next/font/google`.
**If fonts are custom files:** Use `next/font/local` and provide paths.

---

## Step 7: Rebuild Tailwind

Rebuild CSS to apply new tokens:

```bash
# If using Next.js (auto-rebuild)
echo "✅ Next.js will auto-rebuild on next dev/build"

# If using standalone Tailwind
pnpm build:css || npx tailwindcss -i ./src/app/globals.css -o ./dist/output.css

echo "✅ Tailwind rebuilt with custom tokens"
```

---

## Step 8: Verify No Breaking Changes

Run quick checks to ensure components still render:

```bash
# 1. TypeScript compilation
pnpm tsc --noEmit || echo "⚠️ TypeScript errors found (may be unrelated to design)"

# 2. Build check (Next.js)
pnpm build || echo "❌ Build failed - check errors above"

# 3. Visual regression (if configured)
# pnpm test:visual || echo "⚠️ Visual regressions detected"

echo "✅ Verification complete"
```

---

## Step 9: Summary Report

Generate summary of changes:

```markdown
## 🎨 Design Import Summary

**Custom Tokens:** [tokens-file-path]
**Backup Created:** design-tokens.backup.YYYYMMDD-HHMMSS.json

### Changes Applied:
- ✅ design-tokens.json replaced
- ✅ tailwind.config.ts synced
- ✅ globals.css updated (CSS variables)
- ✅ Custom fonts installed (if applicable)
- ✅ Tailwind rebuilt

### Verification:
- ✅ TypeScript compilation: [PASS/FAIL]
- ✅ Build: [PASS/FAIL]
- ✅ 0 breaking changes

### Next Steps:
1. Run `pnpm dev` to preview changes
2. Test components visually (forms, buttons, cards)
3. If issues found: `cp design-tokens.backup.YYYYMMDD-HHMMSS.json design-tokens.json` to rollback

**Time Saved:** 15 minutes vs 1-2 days refactor = -95% time ✅
```

---

## Common Issues & Fixes

### Issue 1: Font family not loading
**Cause:** Font not installed or incorrect path
**Fix:** Verify font files in `public/fonts/` or check Google Fonts import

### Issue 2: Colors not applied
**Cause:** Tailwind cache stale
**Fix:** `rm -rf .next && pnpm dev` (Next.js) or `npx tailwindcss -i src/app/globals.css -o dist/output.css --watch`

### Issue 3: TypeScript errors on design-tokens.json import
**Cause:** Missing type declaration
**Fix:** Add `declare module "*.json" { const value: any; export default value; }` to `src/types/global.d.ts`

---

## Figma MCP Integration (Optional)

If design tokens exported from Figma via MCP:

```javascript
// 1. Export tokens from Figma
const figmaFileId = "YOUR_FIGMA_FILE_ID";
const tokens = await mcp__figma__get_file({ file_id: figmaFileId });

// 2. Transform Figma styles → design-tokens.json format
const transformedTokens = {
  colors: {
    primary: {
      50: tokens.styles.find(s => s.name === "primary/50").color,
      // ... map all shades
    }
  },
  typography: {
    heading: {
      family: tokens.styles.find(s => s.type === "TEXT" && s.name === "Heading").fontFamily,
      weight: tokens.styles.find(s => s.type === "TEXT" && s.name === "Heading").fontWeight,
    }
  }
};

// 3. Write to design-tokens.json
fs.writeFileSync("design-tokens.json", JSON.stringify(transformedTokens, null, 2));

// 4. Continue with Step 4 (Update Tailwind Config)
```

---

**Philosophy Reminder:** This workflow enables parallel streams:
- **Dev Stream:** Claude Code builds backend + frontend (CSS variables)
- **Design Stream:** Human/Designer creates custom brand (Figma/v0)
- **Merge:** 15 minutes via `/import-design` (0 code changes)

**Result:** Custom brand + functional app + production-safe = competitive advantage over generic AI tools (Lovable, Bolt).

---

**End of /import-design workflow.**
