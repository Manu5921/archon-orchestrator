# 📚 DOCUMENTATION COMPLÈTE : DESIGN-FIRST WORKFLOW ARCHON + FIGMA

*Créée le 2025-10-04 à 23h - Roadmap complète pour démarrage demain*

---

## 🎯 VISION & OBJECTIFS

### **Philosophie**
**"Design différenciant = avantage concurrentiel non-négociable"**

- ❌ Plus de MVP avec design basique
- ✅ Design professionnel 9/10 dès V1
- ✅ Visuels uniques (pas clones IA)
- ✅ Tokens-based pour vélocité long-terme

### **Stack Final Décidé**
```yaml
Idéation: Stitch (Google) - Variantes multiples
Design: Figma (OBLIGATOIRE) - Normalisation & Design System
Tokens: Tokens Studio → JSON → Tailwind - Single source of truth
Code: shadcn/ui - Alignement strict Figma
Quality: Lighthouse + axe + Visual regression
```

---

## 📅 ROADMAP 21 JOURS (3 SEMAINES)

### **SEMAINE 1 : FORMATION FIGMA (7 jours, 2h/jour)**

#### **Jour 1 : Fondamentaux Figma**
```markdown
🎯 Objectif : Comprendre interface & navigation

📚 Ressources :
- "Figma in 40 Minutes" (DesignCourse, YouTube)
- Figma Help Center : "Getting Started"

✅ À maîtriser :
- Frames vs Groups
- Outils de base (rectangle, text, pen)
- Layers panel & navigation
- Zoom & navigation (space + drag)

💻 Pratique (30min) :
1. Créer fichier "Test Day 1"
2. Créer 3 frames (mobile 375, tablet 768, desktop 1440)
3. Dessiner rectangles, textes, formes basiques
4. Organiser en layers logiques
```

#### **Jour 2 : Auto-Layout (CRITIQUE)**
```markdown
🎯 Objectif : Maîtriser Auto-Layout (= flexbox Figma)

📚 Ressources :
- "Auto-Layout Tutorial" (Figma Official, YouTube)
- Figma Learn : "Auto-Layout Deep Dive"

✅ À maîtriser :
- Activer Auto-Layout (Shift + A)
- Direction (horizontal/vertical)
- Spacing between items
- Padding (inner spacing)
- Alignment & distribution
- Resizing behavior (hug/fill/fixed)

💻 Pratique (1h) :
1. Créer composant "Card" avec Auto-Layout :
   - Container (padding 24px)
   - Image (fill width)
   - Title + Description (vertical stack, gap 8px)
   - Button (hug content)
2. Tester : ajouter/retirer contenu → Auto-Layout ajuste
3. Créer "Button" avec états (default, hover, disabled)
```

#### **Jour 3 : Composants Basics**
```markdown
🎯 Objectif : Créer composants réutilisables

📚 Ressources :
- Figma Academy : "Components" (gratuit)
- "Component Best Practices" (Figma docs)

✅ À maîtriser :
- Créer composant (Cmd/Ctrl + Alt + K)
- Main component vs Instance
- Overrides (texte, images, couleurs)
- Detach instance (quand nécessaire)

💻 Pratique (1h) :
1. Créer bibliothèque composants :
   - Button (primary, secondary, ghost)
   - Input (text, email, password)
   - Card (avec image, sans image)
2. Créer page "Components Library"
3. Utiliser instances dans mock screen
```

#### **Jour 4 : Variants & States**
```markdown
🎯 Objectif : Gérer états multiples (hover, active, disabled)

📚 Ressources :
- "Variants Explained" (Figma Official, YouTube)
- Figma Help : "Create and use variants"

✅ À maîtriser :
- Créer variant component
- Properties (State, Size, Type)
- Combiner properties (State=hover + Size=large)
- Change variant (via properties panel)

💻 Pratique (1h) :
1. Transformer Button en variant :
   - Property "State" : default, hover, active, disabled
   - Property "Size" : small, medium, large
   - Property "Type" : primary, secondary, ghost
   → Total : 4 × 3 × 3 = 36 variantes
2. Tester dans mock screen (changer states)
```

#### **Jour 5 : Variables & Collections**
```markdown
🎯 Objectif : Design tokens natifs Figma

📚 Ressources :
- "Variables in Figma" (Figma Official)
- "Design Tokens Deep Dive" (Figma Config talk)

✅ À maîtriser :
- Créer collections (Colors, Spacing, Radius)
- Types : Color, Number, String, Boolean
- Modes (Light, Dark)
- Aliasing (semantic tokens)

💻 Pratique (1.5h) :
1. Créer collection "Colors" :
   - Primitives : blue-50 → blue-900
   - Semantic : brand-primary, brand-secondary
   - Modes : light (blue-600), dark (blue-400)
2. Créer collection "Spacing" :
   - xs: 4, sm: 8, md: 16, lg: 24, xl: 32
3. Appliquer aux composants créés Jours 3-4
4. Tester : switch mode light/dark → couleurs changent
```

#### **Jour 6 : Tokens Studio Plugin**
```markdown
🎯 Objectif : Export tokens vers JSON (sync code)

📚 Ressources :
- Tokens Studio docs (tokens.studio)
- "Design Tokens Workflow" (YouTube)

✅ À maîtriser :
- Installer plugin "Tokens Studio for Figma"
- Créer token sets (colors, spacing, typography, radius)
- Sync entre Figma Variables ↔ Tokens Studio
- Export JSON (GitHub sync ou local)

💻 Pratique (1.5h) :
1. Installer Tokens Studio plugin
2. Importer variables Figma créées Jour 5
3. Créer token sets :
   - global/colors.json
   - global/spacing.json
   - semantic/light.json, semantic/dark.json
4. Export JSON → sauvegarder localement
5. Comparer structure JSON vs Figma Variables
```

#### **Jour 7 : Dev Mode & Projet Test**
```markdown
🎯 Objectif : Handoff design → dev

📚 Ressources :
- "Dev Mode Guide" (Figma Official docs)
- "Inspect in Dev Mode" (tutorial)

✅ À maîtriser :
- Activer Dev Mode (Shift + D)
- Inspect properties (spacing, colors, typography)
- Copy code snippets (CSS, Tailwind)
- Export assets (SVG, PNG @2x)

💻 Pratique (2h) - PROJET TEST COMPLET :
1. Créer dashboard simple (1 écran) :
   - Sidebar navigation (5 links)
   - Header (title + avatar)
   - Content area (3 metric cards + table)
2. Utiliser TOUS les acquis Jours 1-6 :
   - Auto-Layout partout
   - Composants (button, card, table row)
   - Variables (colors, spacing)
   - Variants (states hover/active)
3. Dev Mode :
   - Inspect chaque composant
   - Copier snippets Tailwind
   - Export icons SVG
4. Tokens Studio :
   - Export tokens.json complet

✅ Validation Jour 7 :
- [ ] Dashboard créé avec Auto-Layout strict
- [ ] Tous composants utilisent variables
- [ ] Tokens exportés en JSON
- [ ] Screenshots Dev Mode avec code snippets
```

---

### **SEMAINE 2 : DESIGN SYSTEM PRODUCTION (7 jours, 2h/jour)**

#### **Jour 8 : Structure Design System**
```markdown
🎯 Objectif : Organiser fichier Figma pro

📚 Ressources :
- "Building Design Systems" (Figma Best Practices)
- Template : "Material Design 3" (Figma Community)

📂 Structure à créer :
File : "Archon Design System"
Pages :
  📐 Foundations
    - Colors (primitives + semantic)
    - Typography (scale, weights, line-heights)
    - Spacing (scale 4-8-16-24-32-48-64-96)
    - Radius (sm 4px, md 8px, lg 16px)
    - Shadows (sm, md, lg, xl)

  🧩 Components
    - Inputs (text, select, checkbox, radio, switch)
    - Buttons (primary, secondary, ghost, link)
    - Cards (default, elevated, outlined)
    - Navigation (sidebar, tabs, breadcrumb)
    - Feedback (toast, dialog, alert)
    - Data Display (table, list, badge, avatar)

  📐 Patterns
    - Forms (login, signup, settings)
    - Empty States
    - Loading States
    - Error States

  🎨 Screens (exemples d'usage)
    - Landing
    - Dashboard
    - Settings
    - Onboarding

💻 Pratique (2h) :
1. Créer fichier avec structure ci-dessus
2. Migrer composants créés Semaine 1
3. Documenter chaque composant (description, usage)
4. Cover page (présentation design system)
```

#### **Jour 9 : Foundations Avancées**
```markdown
🎯 Objectif : Typographie, ombres, effets

📚 Ressources :
- "Typography in Design Systems" (Figma blog)
- "Elevation & Shadows" (Material Design)

✅ À créer :
1. Typography Scale :
   - Display (60px, 700 weight)
   - H1 (48px, 700), H2 (36px, 600), H3 (30px, 600)
   - H4 (24px, 600), H5 (20px, 600), H6 (18px, 600)
   - Body Large (18px, 400), Body (16px, 400), Body Small (14px, 400)
   - Caption (12px, 400), Overline (11px, 500, uppercase)

2. Text Styles Figma :
   - Créer style par niveau typo
   - Varier line-height (120% headings, 150% body)
   - Lier aux variables typography

3. Shadows Collection :
   - xs: 0 1px 2px rgba(0,0,0,0.05)
   - sm: 0 1px 3px rgba(0,0,0,0.1)
   - md: 0 4px 6px rgba(0,0,0,0.1)
   - lg: 0 10px 15px rgba(0,0,0,0.1)
   - xl: 0 20px 25px rgba(0,0,0,0.1)

💻 Pratique (2h) :
1. Appliquer Typography Scale aux composants
2. Créer effects styles (shadows)
3. Documenter usage (quand utiliser shadow lg vs md)
```

#### **Jour 10-11 : Composants Avancés**
```markdown
🎯 Objectif : Composants complexes production

Jour 10 : Data Display
- Table (header, row, cell variants)
- List (item, icon, action, divider)
- Badge (dot, text, removable)
- Avatar (image, initials, sizes)
- Progress (linear, circular, with label)

Jour 11 : Navigation & Feedback
- Sidebar (collapsed, expanded, sub-menu)
- Tabs (horizontal, vertical, pills)
- Breadcrumb (with separator, interactive)
- Toast (success, error, warning, info, closable)
- Dialog (alert, confirm, form, fullscreen)
- Alert (inline, banner, dismissible)

💻 Pour chaque composant :
1. Créer avec Auto-Layout
2. Variants pour tous états
3. Lier aux variables (colors, spacing)
4. Documenter props & usage
5. Tester dans mock screen
```

#### **Jour 12 : Patterns & Templates**
```markdown
🎯 Objectif : Assemblages réutilisables

📐 Patterns à créer :
1. Form Patterns :
   - Login (email, password, remember, CTA)
   - Signup (name, email, password, confirm, terms)
   - Settings (sections, tabs, forms, save bar)

2. State Patterns :
   - Empty State (icon, title, description, CTA)
   - Loading (skeleton, spinner, progress)
   - Error (icon, message, retry button)
   - Success (confirmation, next steps)

3. Layout Templates :
   - Sidebar Layout (nav + content)
   - Header Layout (logo + nav + actions)
   - Dashboard Grid (metrics cards + charts + table)

💻 Pratique (2h) :
1. Créer 1 pattern de chaque type
2. Utiliser composants créés Jours 10-11
3. Variantes responsive (mobile, tablet, desktop)
```

#### **Jour 13 : Prototyping & Interactions**
```markdown
🎯 Objectif : Rendre design interactif

📚 Ressources :
- "Figma Prototyping Basics" (officiel)
- "Smart Animate Deep Dive" (Figma YouTube)

✅ À maîtriser :
- Connections entre frames
- Interactions (on click, hover, drag)
- Animations (instant, dissolve, smart animate)
- Overlays (dialog, tooltip, dropdown)

💻 Pratique (2h) :
1. Créer flow complet "Login → Dashboard" :
   - Login screen
   - Loading state (2s)
   - Dashboard screen
2. Ajouter interactions :
   - Button hover states
   - Dialog open/close (overlay)
   - Sidebar collapse/expand (smart animate)
3. Tester prototype (Play button)
```

#### **Jour 14 : Design Tokens Export**
```markdown
🎯 Objectif : Sync Figma → Code automatisé

📚 Ressources :
- Tokens Studio advanced export
- "Figma API Basics" (docs)

✅ Setup complet :
1. Tokens Studio configuration :
   - Set storage (GitHub ou local)
   - Organize token sets (global, semantic, component)
   - Configure transformers (Tailwind format)

2. Export automation (script Node.js) :
   ```bash
   # Script à créer : scripts/figma-tokens-sync.js
   - Fetch Figma file via API
   - Extract variables
   - Transform to tokens.json
   - Sync to Tailwind config
   ```

3. Validation :
   - Compare Figma Variables ↔ tokens.json
   - Verify Tailwind classes generated
   - Test : change color Figma → auto-sync code

💻 Pratique (2h) :
1. Setup Figma API token (Personal Access Token)
2. Créer script sync basique
3. Export tokens.json complet
4. Documenter process (README.md)
```

---

### **SEMAINE 3 : PREMIER PROJET PRODUCTION (7 jours)**

#### **Jour 15-17 : SaaS Complet avec Workflow**
```markdown
🎯 Objectif : Appliquer workflow complet sur vrai projet

Projet : "TaskFlow" - App de gestion tâches
Écrans : Landing, Signup, Dashboard, Task Detail, Settings

Jour 15 : Idéation + Setup
1. Brief design (personas, références, contraintes)
2. Stitch : Générer 3 variantes landing page
3. Choisir direction visuelle
4. Créer fichier Figma "TaskFlow"
5. Setup variables (colors, spacing, typography)

Jour 16 : Design System Application
1. Créer composants spécifiques TaskFlow :
   - Task Card (avec priority, status, assignee)
   - Project Sidebar Item
   - Filter Dropdown
2. Appliquer tokens system-wide
3. Créer 5 écrans (wireframes → high-fidelity)

Jour 17 : Polish & Export
1. Responsive variants (mobile, tablet, desktop)
2. Prototyping interactions
3. Tokens Studio export
4. Dev Mode preparation
5. Documentation handoff
```

#### **Jour 18-19 : Code Implementation**
```markdown
🎯 Objectif : Figma → Code strict alignment

Setup projet Next.js + Tailwind + shadcn :
```bash
npx create-next-app@latest taskflow --typescript --tailwind --app
cd taskflow
npx shadcn-ui@latest init
```

Jour 18 : Tokens Sync + Components
1. Import tokens.json → Tailwind config
2. Install shadcn components (button, input, card, etc.)
3. Customize shadcn avec tokens Figma
4. Créer wrapper components (TaskCard, ProjectSidebar)

Jour 19 : Screens Implementation
1. Landing page (Hero + Features + CTA)
2. Dashboard (Sidebar + Metrics + Tasks Grid)
3. Settings (Tabs + Forms)
4. Vérifier alignment Figma (Dev Mode inspect)
```

#### **Jour 20 : Quality Gates**
```markdown
🎯 Objectif : Validation qualité production

1. Accessibility (axe DevTools) :
   - [ ] Contraste ≥ 4.5:1 (WCAG AA)
   - [ ] Focus visible tous éléments interactifs
   - [ ] Labels explicites formulaires
   - [ ] Navigation clavier complète

2. Performance (Lighthouse) :
   - [ ] Performance ≥ 90
   - [ ] Accessibility ≥ 90
   - [ ] Best Practices ≥ 90
   - [ ] SEO ≥ 90

3. Responsive :
   - [ ] Mobile 360px → OK
   - [ ] Tablet 768px → OK
   - [ ] Desktop 1280px+ → OK

4. Visual Regression (Playwright) :
   - [ ] Screenshots baseline created
   - [ ] Diff < 1% acceptable

5. Figma Alignment :
   - [ ] Tokens.json === Figma Variables
   - [ ] Components structure match
   - [ ] Spacing/colors exact
```

#### **Jour 21 : Documentation & Workflow Finalization**
```markdown
🎯 Objectif : Documenter processus réutilisable

Créer documentation complète :

1. docs/design-workflow.md :
   - Process : Brief → Stitch → Figma → Tokens → Code
   - Checklist par étape
   - Quality gates

2. docs/figma-guide.md :
   - Structure fichier Figma
   - Naming conventions
   - How to use Design System

3. docs/tokens-sync.md :
   - Setup Tokens Studio
   - Export process
   - Tailwind integration
   - Troubleshooting

4. README.md :
   - Quick start
   - Design → Dev workflow
   - Scripts disponibles

✅ Validation finale :
- [ ] Projet TaskFlow terminé et déployé
- [ ] Documentation complète
- [ ] Workflow réutilisable pour prochains projets
- [ ] Templates Figma + Code prêts
```

---

## 🛠️ SETUP TECHNIQUE DÉTAILLÉ

### **Figma Setup (Jour 1)**

```markdown
# 1. Installation
- Desktop app : https://www.figma.com/downloads/
- Créer compte (gratuit OK pour démarrer)

# 2. Plugins obligatoires :
- Tokens Studio for Figma (design tokens)
- Iconify (icônes 200k+ gratuits)
- Stark (a11y contrast checker)
- Content Reel (placeholder realistic data)
- Unsplash (images placeholder)

# 3. Keyboard shortcuts essentiels :
Cmd/Ctrl + \       → Show/hide UI
Space + drag       → Pan canvas
Cmd/Ctrl + scroll  → Zoom
Shift + A          → Auto-Layout
Cmd/Ctrl + G       → Group
Cmd/Ctrl + Alt + K → Create component
Shift + D          → Dev Mode
F                  → Frame tool
R                  → Rectangle
T                  → Text
```

### **Tokens Studio Setup (Jour 6)**

```markdown
# Installation :
1. Plugins → Browse → "Tokens Studio for Figma"
2. Install & Run

# Configuration :
1. Settings → Storage → "Local" (ou GitHub pour équipe)
2. Create token sets :
   - global/colors.json
   - global/spacing.json
   - global/typography.json
   - global/radius.json
   - semantic/light.json
   - semantic/dark.json

# Structure tokens :
{
  "global": {
    "colors": {
      "blue": {
        "50": { "value": "#eff6ff", "type": "color" },
        "500": { "value": "#3b82f6", "type": "color" },
        "900": { "value": "#1e3a8a", "type": "color" }
      }
    },
    "spacing": {
      "xs": { "value": "4", "type": "spacing" },
      "sm": { "value": "8", "type": "spacing" }
    }
  },
  "semantic": {
    "light": {
      "brand": {
        "primary": { "value": "{global.colors.blue.500}", "type": "color" }
      }
    }
  }
}

# Export :
1. Export button → JSON
2. Sauvegarder : specs/{id}/design/tokens.json
```

### **Figma API Setup (Jour 14)**

```markdown
# 1. Get Personal Access Token :
- Figma → Settings → Personal Access Tokens
- Generate new token (read-only suffit)
- Copier token → .env.local

# 2. Script sync basique :
```javascript
// scripts/figma-tokens-sync.js
const fetch = require('node-fetch');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY;

async function syncTokens() {
  const response = await fetch(
    `https://api.figma.com/v1/files/${FILE_KEY}/variables/local`,
    { headers: { 'X-Figma-Token': FIGMA_TOKEN } }
  );

  const data = await response.json();

  // Transform to tokens.json format
  const tokens = transformFigmaVariables(data);

  // Write to file
  fs.writeFileSync('design/tokens.json', JSON.stringify(tokens, null, 2));

  console.log('✅ Tokens synced from Figma');
}

syncTokens();
```

# 3. Automation (optionnel) :
- GitHub Action : Run script on Figma file update webhook
- ou Cron job : Sync toutes les heures
```

### **Tailwind Integration**

```typescript
// tailwind.config.ts
import tokens from './design/tokens.json';

// Transform tokens to Tailwind format
const colors = transformTokensToColors(tokens.global.colors);
const spacing = transformTokensToSpacing(tokens.global.spacing);

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors,
      spacing,
      borderRadius: {
        sm: tokens.global.radius.sm.value,
        md: tokens.global.radius.md.value,
        lg: tokens.global.radius.lg.value,
      },
      boxShadow: {
        sm: tokens.global.shadows.sm.value,
        md: tokens.global.shadows.md.value,
        lg: tokens.global.shadows.lg.value,
      },
    },
  },
};

// Helper functions
function transformTokensToColors(tokensColors) {
  const result = {};
  Object.entries(tokensColors).forEach(([key, shades]) => {
    result[key] = {};
    Object.entries(shades).forEach(([shade, token]) => {
      result[key][shade] = token.value;
    });
  });
  return result;
}
```

---

## 🎯 ARCHON INTEGRATION

### **Nouvelles Commandes à Créer**

#### **1. `/specify` (Modifié)**
```markdown
# Ajouter à la fin du processus /specify :

## Design Brief Auto-Generation

1. Créer `specs/{id}/design/brief.md` :
   ```markdown
   # Design Brief - {Project Name}

   ## Personas Visuels
   - **Utilisateur principal** : {inféré de spec}
   - **Tone visuel** : Professionnel / Moderne / Minimaliste

   ## Références UI (3 minimum)
   - **{App similaire}** - Pourquoi : {raison}
   - **{Site web}** - Pourquoi : {raison}
   - **{Produit SaaS}** - Pourquoi : {raison}

   ## Contraintes A11y
   - [ ] WCAG AA minimum (contraste 4.5:1)
   - [ ] Navigation clavier complète
   - [ ] Support responsive 360px → 1920px

   ## Figma File
   - **Link** : {à créer manuellement}
   - **Structure** : Foundations / Components / Screens
   ```

2. Créer `specs/{id}/design/tokens.json` (starter) :
   ```json
   {
     "global": {
       "colors": {
         "brand": {
           "primary": { "value": "#000000", "type": "color" },
           "secondary": { "value": "#666666", "type": "color" }
         }
       },
       "spacing": {
         "unit": { "value": "4", "type": "spacing" }
       }
     }
   }
   ```

3. Output utilisateur :
   "✅ Design brief created: specs/{id}/design/brief.md
    📝 Next step: Create Figma file and add link to brief.md"
```

#### **2. `/plan` (Modifié)**
```markdown
# Ajouter section UI/UX Architecture après plan technique :

## 🎨 Architecture UI/UX

### Écrans Critiques (wireframes conceptuels)
{Pour chaque écran, décrire layout textuel}

Exemple :
1. **Landing Page**
   - Layout : Hero section (headline + CTA + image)
            → Features grid (3 columns)
            → Social proof (testimonials slider)
            → Final CTA section
   - Responsive : Mobile stack vertical, Desktop grid

2. **Dashboard**
   - Layout : Sidebar navigation (collapsible)
            → Header (breadcrumb + user menu)
            → Content grid (metric cards + data table)
   - Responsive : Mobile burger menu, Desktop sidebar

### Design System Components (shadcn/ui)
{Lister composants nécessaires par écran}

Navigation : sidebar, breadcrumb, tabs
Data Display : card, table, badge, avatar
Forms : input, select, button, checkbox
Feedback : toast, dialog, alert

### Tokens Définis (refined from brief)
{Lire specs/{id}/design/tokens.json et raffiner}

```json
{
  "global": {
    "colors": {
      "brand": {
        "primary": { "value": "#0066FF", "type": "color" },
        "secondary": { "value": "#6B46C1", "type": "color" }
      },
      "neutral": {
        "50": { "value": "#fafafa", "type": "color" },
        "900": { "value": "#0a0a0a", "type": "color" }
      }
    },
    "spacing": {
      "xs": { "value": "4", "type": "spacing" },
      "sm": { "value": "8", "type": "spacing" },
      "md": { "value": "16", "type": "spacing" },
      "lg": { "value": "24", "type": "spacing" }
    },
    "radius": {
      "sm": { "value": "4", "type": "borderRadius" },
      "md": { "value": "8", "type": "borderRadius" },
      "lg": { "value": "16", "type": "borderRadius" }
    }
  }
}
```

### Responsive Breakpoints
- Mobile : 360px-768px (sidebar → burger menu)
- Tablet : 768px-1024px (sidebar collapse)
- Desktop : ≥1024px (sidebar expanded)

📁 Fichiers créés :
- `specs/{id}/design/tokens.json` (version 1, refined)
- `specs/{id}/design/wireframes.md` (layouts textuels)

💡 Next step :
"Create Figma file with this structure and export tokens via Tokens Studio"
```

#### **3. `/design-refine` (Nouveau)**
```markdown
# Commande : /design-refine
# Usage : Après backend complété, itérer sur design

## Process :

1. **Lire état actuel**
   ```bash
   cat specs/{current-spec}/design/tokens.json
   cat specs/{current-spec}/design/wireframes.md
   cat specs/{current-spec}/design/brief.md
   ```

2. **Générer variantes (Stitch)**
   Prompt template :
   "Create {screen} for {use case} with {brief context}.
    Style: {tone from brief}.
    Generate 3 visual variants (different color schemes, layouts).
    Export as Figma-compatible format."

   Sauvegarder screenshots :
   - `specs/{id}/design/variants/variant-1-{screen}.png`
   - `specs/{id}/design/variants/variant-2-{screen}.png`
   - `specs/{id}/design/variants/variant-3-{screen}.png`

3. **User chooses variant**
   "Which variant do you prefer? (1/2/3)
    I'll update tokens.json with the chosen design direction."

4. **Update tokens**
   - Extract colors, spacing, typography from chosen variant
   - Update `specs/{id}/design/tokens.json` (increment version)
   - Si Figma file existe : "Update Figma Variables to match"
   - Si Tokens Studio setup : "Export new tokens and commit"

5. **Sync to code**
   ```bash
   pnpm tokens:sync  # Transform tokens.json → Tailwind config
   pnpm build        # Verify no breakage
   ```

6. **Verify no regression**
   ```bash
   pnpm test:visual  # Playwright snapshots
   pnpm test:a11y    # axe accessibility
   ```

7. **Create PR**
   Title : "refine(design): Update visual direction - {screen}"
   Body :
   ```markdown
   ## Design Changes
   - Variant chosen: {variant number}
   - Tokens updated: colors, spacing, typography

   ## Screenshots
   ![Before](link) vs ![After](link)

   ## Checklist
   - [ ] Tokens.json updated (v{version})
   - [ ] Tailwind config synced
   - [ ] Build passing
   - [ ] Visual regression < 1%
   - [ ] A11y maintained (contrast ≥ 4.5:1)
   ```

## Deliverables :
- `design/variants/variant-chosen-{screen}.png`
- `design/tokens.json` (version incremented)
- `tailwind.config.ts` (synced)
- PR with diff report
```

### **Templates à Créer**

#### **1. `specs/template/design/` Structure**
```bash
mkdir -p specs/template/design/variants

# specs/template/design/brief.md
cat > specs/template/design/brief.md << 'EOF'
# Design Brief - {Project Name}

## Personas Visuels
- **Utilisateur principal** : [Âge, tech-savviness, préférences UI]
- **Tone visuel** : [Professionnel/Ludique/Minimaliste/Audacieux]

## Inspirations UI (3 minimum)
- **Référence 1** : [App similaire] - Pourquoi : [raison]
- **Référence 2** : [Site web] - Pourquoi : [raison]
- **Référence 3** : [Produit SaaS] - Pourquoi : [raison]

## Contraintes A11y
- [ ] WCAG AA minimum (contraste 4.5:1)
- [ ] Navigation clavier complète
- [ ] Support responsive 360px → 1920px

## Figma File
- **Link** : {URL Figma file}
- **Structure** :
  - Foundations (colors, typography, spacing, radius, shadows)
  - Components (buttons, inputs, cards, etc.)
  - Screens (landing, dashboard, settings, etc.)

## Notes
{Contraintes spécifiques, demandes client, etc.}
EOF

# specs/template/design/tokens.json
cat > specs/template/design/tokens.json << 'EOF'
{
  "global": {
    "colors": {
      "brand": {
        "primary": { "value": "#000000", "type": "color", "description": "Main brand color" },
        "secondary": { "value": "#666666", "type": "color", "description": "Secondary accent" }
      },
      "neutral": {
        "50": { "value": "#fafafa", "type": "color" },
        "100": { "value": "#f5f5f5", "type": "color" },
        "500": { "value": "#737373", "type": "color" },
        "900": { "value": "#0a0a0a", "type": "color" }
      },
      "semantic": {
        "success": { "value": "#10b981", "type": "color" },
        "error": { "value": "#ef4444", "type": "color" },
        "warning": { "value": "#f59e0b", "type": "color" },
        "info": { "value": "#3b82f6", "type": "color" }
      }
    },
    "spacing": {
      "xs": { "value": "4", "type": "spacing" },
      "sm": { "value": "8", "type": "spacing" },
      "md": { "value": "16", "type": "spacing" },
      "lg": { "value": "24", "type": "spacing" },
      "xl": { "value": "32", "type": "spacing" },
      "2xl": { "value": "48", "type": "spacing" }
    },
    "typography": {
      "fontFamily": {
        "heading": { "value": "system-ui, sans-serif", "type": "fontFamilies" },
        "body": { "value": "system-ui, sans-serif", "type": "fontFamilies" }
      },
      "fontSize": {
        "xs": { "value": "12", "type": "fontSizes" },
        "sm": { "value": "14", "type": "fontSizes" },
        "base": { "value": "16", "type": "fontSizes" },
        "lg": { "value": "18", "type": "fontSizes" },
        "xl": { "value": "20", "type": "fontSizes" },
        "2xl": { "value": "24", "type": "fontSizes" },
        "3xl": { "value": "30", "type": "fontSizes" }
      }
    },
    "radius": {
      "sm": { "value": "4", "type": "borderRadius" },
      "md": { "value": "8", "type": "borderRadius" },
      "lg": { "value": "16", "type": "borderRadius" },
      "full": { "value": "9999", "type": "borderRadius" }
    }
  },
  "semantic": {
    "light": {
      "bg": {
        "primary": { "value": "{global.colors.neutral.50}", "type": "color" },
        "secondary": { "value": "{global.colors.neutral.100}", "type": "color" }
      },
      "text": {
        "primary": { "value": "{global.colors.neutral.900}", "type": "color" },
        "secondary": { "value": "{global.colors.neutral.500}", "type": "color" }
      }
    },
    "dark": {
      "bg": {
        "primary": { "value": "{global.colors.neutral.900}", "type": "color" },
        "secondary": { "value": "{global.colors.neutral.500}", "type": "color" }
      },
      "text": {
        "primary": { "value": "{global.colors.neutral.50}", "type": "color" },
        "secondary": { "value": "{global.colors.neutral.100}", "type": "color" }
      }
    }
  },
  "$metadata": {
    "version": "1.0.0",
    "created": "2025-10-04",
    "figmaFileKey": ""
  }
}
EOF

# specs/template/design/wireframes.md
cat > specs/template/design/wireframes.md << 'EOF'
# Wireframes - {Project Name}

## Écrans Critiques

### 1. Landing Page
**Layout** :
- Hero section (headline + subheadline + CTA + hero image)
- Features section (3-column grid)
- Social proof (logos + testimonials slider)
- Final CTA section

**Responsive** :
- Mobile : Stack vertical
- Desktop : Grid 2-column hero, 3-column features

**Components nécessaires** :
- Button (primary CTA)
- Card (feature cards)
- Testimonial (avatar + quote + name)

---

### 2. Dashboard
**Layout** :
- Sidebar navigation (logo + menu items + user profile)
- Header (breadcrumb + search + notifications + avatar)
- Content area (metric cards grid + data table)

**Responsive** :
- Mobile : Burger menu, header simplified
- Tablet : Sidebar collapsed (icons only)
- Desktop : Sidebar expanded

**Components nécessaires** :
- Sidebar, SidebarItem
- Card (metric cards)
- Table (data display)
- Badge (status indicators)

---

### 3. Settings
**Layout** :
- Tabs navigation (Profile, Security, Billing, Team)
- Form sections (grouped inputs)
- Save bar (sticky bottom)

**Responsive** :
- Mobile : Tabs scroll horizontal
- Desktop : Tabs full width

**Components nécessaires** :
- Tabs
- Input, Select, Switch
- Button (save, cancel)

---

{Ajouter autres écrans selon projet}
EOF

# Create variants folder
mkdir -p specs/template/design/variants
touch specs/template/design/variants/.gitkeep
```

#### **2. Scripts Utiles**

```bash
# scripts/tokens-sync.js
# (Créer script complet Node.js pour sync Figma → Tailwind)

# scripts/design-setup.sh
cat > scripts/design-setup.sh << 'EOF'
#!/bin/bash
# Setup design structure for new spec

SPEC_ID=$1

if [ -z "$SPEC_ID" ]; then
  echo "Usage: ./scripts/design-setup.sh {spec-id}"
  exit 1
fi

echo "📐 Setting up design structure for spec: $SPEC_ID"

# Create design folder
mkdir -p specs/$SPEC_ID/design/variants

# Copy templates
cp specs/template/design/brief.md specs/$SPEC_ID/design/
cp specs/template/design/tokens.json specs/$SPEC_ID/design/
cp specs/template/design/wireframes.md specs/$SPEC_ID/design/

# Replace placeholders
sed -i '' "s/{Project Name}/Spec $SPEC_ID/g" specs/$SPEC_ID/design/*.md

echo "✅ Design structure created:"
echo "   - specs/$SPEC_ID/design/brief.md"
echo "   - specs/$SPEC_ID/design/tokens.json"
echo "   - specs/$SPEC_ID/design/wireframes.md"
echo ""
echo "📝 Next steps:"
echo "   1. Fill brief.md (personas, references, constraints)"
echo "   2. Create Figma file and add link to brief.md"
echo "   3. Run /plan to generate UI/UX architecture"
EOF

chmod +x scripts/design-setup.sh
```

---

## 📋 CHECKLISTS DE VALIDATION

### **Semaine 1 - Formation Figma**
```markdown
- [ ] Jour 1 : Maîtrise interface Figma (frames, tools, navigation)
- [ ] Jour 2 : Auto-Layout parfaitement compris (spacing, padding, resizing)
- [ ] Jour 3 : Composants créés (button, input, card avec overrides)
- [ ] Jour 4 : Variants configurés (states, sizes, types)
- [ ] Jour 5 : Variables Figma (collections colors, spacing, modes light/dark)
- [ ] Jour 6 : Tokens Studio installé et tokens exportés en JSON
- [ ] Jour 7 : Projet test dashboard complet avec tous acquis
```

### **Semaine 2 - Design System**
```markdown
- [ ] Jour 8 : Structure fichier Figma pro (Foundations/Components/Screens)
- [ ] Jour 9 : Typography scale + shadows créés et documentés
- [ ] Jour 10 : Data display components (table, list, badge, avatar)
- [ ] Jour 11 : Navigation & feedback components (sidebar, tabs, toast, dialog)
- [ ] Jour 12 : Patterns créés (forms, states, layouts)
- [ ] Jour 13 : Prototype interactif (flow login → dashboard)
- [ ] Jour 14 : Script sync Figma → tokens.json opérationnel
```

### **Semaine 3 - Production**
```markdown
- [ ] Jour 15 : Idéation TaskFlow (Stitch variantes + Figma setup)
- [ ] Jour 16 : Design System TaskFlow appliqué (5 écrans high-fi)
- [ ] Jour 17 : Responsive + prototyping + export tokens
- [ ] Jour 18 : Code setup (Next.js + Tailwind + shadcn + tokens sync)
- [ ] Jour 19 : 3 écrans implémentés (landing, dashboard, settings)
- [ ] Jour 20 : Quality gates passés (a11y, perf, responsive, visual)
- [ ] Jour 21 : Documentation workflow complète + templates prêts
```

### **Quality Gates (Jour 20)**
```markdown
Accessibility :
- [ ] Contraste texte/fond ≥ 4.5:1 (WCAG AA)
- [ ] Focus visible sur tous éléments interactifs
- [ ] Landmarks sémantiques (header, main, nav, footer)
- [ ] Labels explicites formulaires (aria-label si besoin)
- [ ] Navigation clavier complète (Tab, Enter, Esc)

Performance :
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Lighthouse Best Practices ≥ 90
- [ ] LCP < 2.5s, FID < 100ms, CLS < 0.1

Responsive :
- [ ] Mobile 360px → Layout OK, no overflow
- [ ] Tablet 768px → Layout adapté
- [ ] Desktop 1280px+ → Layout optimal

Figma Alignment :
- [ ] tokens.json === Figma Variables (diff check)
- [ ] Spacing exact (Dev Mode inspect vs code)
- [ ] Colors exact (hex match)
- [ ] Typography exact (font-size, line-height)

Visual Regression :
- [ ] Playwright snapshots baseline créé
- [ ] Diff screenshots < 1% acceptable
```

---

## 🎓 RESSOURCES COMPLÈTES

### **Figma Learning**
```markdown
📚 Officiel Figma :
- Figma Learn (learn.figma.com) - Cours gratuits
- Figma YouTube (youtube.com/@figma) - Tutoriels vidéo
- Figma Community (figma.com/community) - Templates

🎥 YouTube Recommandés :
- DesignCourse : "Figma in 40 Minutes"
- Figma Official : "Auto-Layout Tutorial"
- Figma Official : "Components & Variants"
- Figma Official : "Variables Deep Dive"

📖 Articles/Guides :
- "Building Design Systems in Figma" (Figma blog)
- "Design Tokens Best Practices" (tokens.studio)
- "Figma to Code Workflow" (dev.to, CSS-Tricks)

🔧 Plugins Essentiels :
- Tokens Studio for Figma (design tokens)
- Iconify (200k+ icons)
- Stark (a11y contrast)
- Content Reel (realistic data)
- Unsplash (images placeholder)
- Autoflow (user flow diagrams)
```

### **Design Tokens**
```markdown
📚 Tokens Studio :
- Docs : tokens.studio/docs
- GitHub : github.com/tokens-studio/figma-plugin

🎥 Tutoriels :
- "Design Tokens 101" (Tokens Studio YouTube)
- "Figma Variables to Code" (YouTube search)

📖 Articles :
- "Design Tokens W3C Spec" (design-tokens.github.io)
- "Tailwind + Design Tokens" (tailwindcss.com/docs)

🛠️ Outils :
- Style Dictionary (amazon.github.io/style-dictionary)
- Theo (salesforce-ux/theo) - Token transformer
```

### **Tailwind + shadcn/ui**
```markdown
📚 Documentation :
- Tailwind CSS : tailwindcss.com/docs
- shadcn/ui : ui.shadcn.com

🎥 Tutoriels :
- "shadcn/ui Complete Guide" (YouTube)
- "Tailwind CSS Crash Course" (Traversy Media)

📖 Guides :
- "Design System with Tailwind" (tailwindcss.com/blog)
- "shadcn/ui Theming" (ui.shadcn.com/docs/theming)

🔧 Templates :
- taxonomy (shadcn starter) : github.com/shadcn/taxonomy
- next-template (shadcn official) : ui.shadcn.com/docs/installation
```

### **Stitch (Idéation)**
```markdown
🔗 Google Stitch :
- URL : stitch.google.com (ou équivalent actuel)
- Usage : Génération variantes UI multi-styles

📝 Prompts Templates :
"Create [screen type] for [use case].
 Style: [minimal/modern/bold/playful].
 Color scheme: [primary color] based.
 Layout: [describe structure].
 Generate 3 distinct visual variants."

Exemples :
- "Create dashboard for SaaS analytics. Style: minimal, professional.
   Color scheme: blue-based. Layout: sidebar + metric cards + table.
   Generate 3 variants (different card layouts)."

- "Create landing page for AI writing tool. Style: modern, trustworthy.
   Color scheme: purple gradient. Layout: hero + features + testimonials.
   Generate 3 variants (different hero styles)."
```

### **Quality Tools**
```markdown
🧪 Accessibility :
- axe DevTools (browser extension)
- Lighthouse (Chrome DevTools)
- Stark (Figma plugin)
- WAVE (web accessibility evaluation)

📊 Performance :
- Lighthouse CI (GitHub Action)
- WebPageTest (webpagetest.org)
- Core Web Vitals (web.dev/vitals)

👁️ Visual Regression :
- Playwright (visual snapshots)
- Chromatic (chromatic.com) - Storybook integration
- Percy (percy.io) - Visual testing platform

🔧 Dev Tools :
- Figma Dev Mode (inspect, export)
- React DevTools (components tree)
- Tailwind CSS IntelliSense (VSCode extension)
```

---

## 🚀 QUICK START DEMAIN MATIN

### **Premier Jour (Demain) - Actions Concrètes**

```markdown
☀️ Matin (2h) :

1. Setup Figma (30 min)
   - [ ] Download Figma Desktop App
   - [ ] Créer compte (gratuit)
   - [ ] Installer plugins :
         - Tokens Studio for Figma
         - Iconify
         - Stark

2. Tutorial "Figma in 40 Minutes" (50 min)
   - [ ] Regarder vidéo (DesignCourse, YouTube)
   - [ ] Suivre en pratiquant dans Figma

3. Première pratique (40 min)
   - [ ] Créer fichier "Learning Day 1"
   - [ ] Créer 3 frames (mobile/tablet/desktop)
   - [ ] Dessiner rectangles, texte, formes
   - [ ] Expérimenter outils (R, T, F, Cmd+G)

📋 Validation matin :
- [ ] Figma installé et configuré
- [ ] Comprends frames vs groups
- [ ] Sais créer formes basiques
- [ ] Navigation keyboard shortcuts OK

🌆 Après-midi (2h) :

1. Tutorial "Auto-Layout" (45 min)
   - [ ] Regarder "Auto-Layout Tutorial" (Figma Official)
   - [ ] Comprendre spacing, padding, direction

2. Pratique Auto-Layout (75 min)
   - [ ] Créer composant Card :
         - Container avec padding 24px
         - Image fill width
         - Title + Description (vertical gap 8px)
         - Button hug content
   - [ ] Créer composant Button :
         - Text + icon (horizontal)
         - Padding 12px 24px
         - 3 sizes (small, medium, large)
   - [ ] Tester : ajouter/retirer contenu → ajustement auto

📋 Validation après-midi :
- [ ] Auto-Layout maîtrisé (Shift + A)
- [ ] 2 composants créés (Card, Button)
- [ ] Comprends spacing vs padding
- [ ] Comprends hug/fill/fixed

🌙 Soir (optionnel, 1h) :

1. Exploration Figma Community (30 min)
   - [ ] Rechercher "SaaS Dashboard UI Kit"
   - [ ] Dupliquer 1 template vers "My Files"
   - [ ] Analyser structure (2-3 composants)

2. Planning Semaine (30 min)
   - [ ] Revoir roadmap 21 jours
   - [ ] Bloquer 2h/jour dans agenda
   - [ ] Identifier projet test (ex: TaskFlow)
```

---

## 📁 FICHIERS À CRÉER DEMAIN (Quick Setup)

```bash
# 1. Créer structure design dans Archon
mkdir -p specs/template/design/variants
mkdir -p scripts

# 2. Créer templates (copier depuis cette doc)
# - specs/template/design/brief.md
# - specs/template/design/tokens.json
# - specs/template/design/wireframes.md

# 3. Créer scripts
# - scripts/design-setup.sh
# - scripts/tokens-sync.js (placeholder for Day 14)

# 4. Modifier commandes Archon
# - .claude/commands/specify.md (ajouter design brief)
# - .claude/commands/plan.md (ajouter UI/UX architecture)
# - .claude/commands/design-refine.md (créer nouveau)

# 5. Documentation
# - docs/design-workflow.md (cette doc complète)
# - docs/figma-learning-path.md (roadmap 21 jours)
# - docs/tokens-guide.md (setup Tokens Studio)
```

---

## ✅ VALIDATION FINALE AVANT DÉMARRAGE

```markdown
Checklist pré-requis :
- [ ] Roadmap 21 jours lue et comprise
- [ ] Ressources bookmarkées (YouTube, docs, plugins)
- [ ] Agenda bloqué (2h/jour pendant 3 semaines)
- [ ] Projet test identifié (ex: TaskFlow ou autre SaaS)
- [ ] Motivation ✅ (design différenciant = game changer)

Checklist technique demain :
- [ ] Figma Desktop App installé
- [ ] Compte Figma créé
- [ ] Plugins installés (Tokens Studio, Iconify, Stark)
- [ ] Template structure créée dans Archon
- [ ] Premier tutoriel "Figma in 40 Minutes" regardé

Output attendu Jour 1 :
- Figma opérationnel ✅
- Auto-Layout compris ✅
- 2 composants créés (Card, Button) ✅
- Confiance pour continuer Jour 2 ✅
```

---

**🎉 TU ES PRÊT POUR DEMAIN !**

Cette documentation complète sera ton guide pendant 3 semaines. À la fin, tu auras :
- ✅ Maîtrise Figma professionnelle
- ✅ Design System production-ready
- ✅ Workflow Figma → Code automatisé
- ✅ Premier SaaS avec design différenciant 9/10
- ✅ Templates réutilisables pour tous futurs projets

**Rendez-vous demain matin pour Jour 1 ! 🚀**

---

*Documentation créée : 2025-10-04, 23h*
*Version : 1.0*
*Auteur : Claude (Archon Assistant)*
*Durée estimée lecture complète : 45-60 min*
*Durée roadmap complète : 21 jours (2h/jour)*
