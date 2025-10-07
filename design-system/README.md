# 🚀 TrustBoost Design System

Un design system moderne, accessible et performant pour créer des expériences utilisateur de confiance.

[![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)](https://storybook.js.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Radix UI](https://img.shields.io/badge/Radix_UI-111111?style=for-the-badge&logo=radix-ui&logoColor=white)](https://radix-ui.com/)

## ✨ Caractéristiques

- 🎨 **Design Tokens** - Système cohérent basé sur les patterns Context7
- ♿ **Accessibilité WCAG AA** - Score >77% maintenu sur tous les composants
- 📱 **Mobile-first** - Responsive design avec breakpoints optimisés
- 🔧 **Composants Radix UI** - Primitives accessibles et customisables  
- 📖 **Documentation Storybook** - Composants documentés avec exemples interactifs
- 🚀 **Performance** - Bundle optimisé et tree-shaking
- 🌙 **Dark Mode** - Support natif des thèmes clair/sombre
- 🎯 **TypeScript** - Types complets pour une meilleure DX

## 🚀 Installation

```bash
npm install @trustboost/design-system
# ou
yarn add @trustboost/design-system
# ou  
pnpm add @trustboost/design-system
```

## 💡 Usage Rapide

### Configuration CSS

Importez les styles globaux dans votre application :

```css
/* app.css */
@import '@trustboost/design-system/dist/styles.css';
```

### Utilisation des Composants

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@trustboost/design-system';

function App() {
  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Bienvenue sur TrustBoost</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Un design system qui inspire confiance.</p>
        <Button variant="primary" size="md">
          Commencer
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Design Tokens

```tsx
import { tokens, getColor, getSpacing } from '@trustboost/design-system';

// Accès direct
const primaryColor = tokens.colors.primary[500]; // #0ea5e9
const mediumSpacing = tokens.spacing[4]; // 1rem

// Avec utilitaires  
const warningColor = getColor('warning', 500);
const largeSpacing = getSpacing(8);
```

## 📖 Documentation

Lancez Storybook pour explorer tous les composants :

```bash
npm run dev
# ou
pnpm dev
```

La documentation sera accessible sur `http://localhost:6006`

## 🎨 Design Tokens

Le système utilise des design tokens basés sur les **patterns Context7** :

### Couleurs
- **Primary Blue** (#0ea5e9) - Actions principales et navigation
- **Trust Green** (#22c55e) - Confirmations et états positifs
- **Semantic Colors** - Warning, Error, Info avec palettes complètes
- **Neutral Scale** - Interface et contenus avec support dark mode

### Typographie
- **Display** : Satoshi (titres et branding)
- **Body** : Inter (interface et contenu)
- **Mono** : JetBrains Mono (code et données)

### Espacement
Échelle modulaire basée sur 4px avec valeurs Context7 :
- Standard : 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- **Customs** : 18 (72px), 88 (352px), 120 (480px)

## 🛠️ Développement

### Prérequis

- Node.js 18+
- pnpm (recommandé)

### Installation

```bash
git clone https://github.com/trustboost/design-system.git
cd design-system
pnpm install
```

### Scripts Disponibles

```bash
# Développement Storybook
pnpm dev

# Build de production  
pnpm build

# Tests
pnpm test
pnpm test:a11y    # Tests d'accessibilité spécifiques
pnpm test:coverage

# Linting
pnpm lint
pnpm lint:fix

# Type checking
pnpm type-check
```

### Structure du Projet

```
design-system/
├── src/
│   ├── components/          # Composants React
│   │   ├── Button/
│   │   ├── Card/
│   │   └── index.ts
│   ├── tokens/              # Design tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   ├── styles/              # Styles globaux
│   │   └── globals.css
│   └── index.ts
├── stories/                 # Documentation Storybook
├── .storybook/             # Configuration Storybook
└── dist/                   # Build de production
```

## ♿ Accessibilité

Le design system respecte **WCAG 2.1 niveau AA** :

### Critères Respectés
- ✅ Contrastes 4.5:1 minimum (texte normal) 
- ✅ Contrastes 3:1 minimum (texte large)
- ✅ Navigation clavier complète
- ✅ Focus management visible
- ✅ États ARIA appropriés
- ✅ Tailles tactiles 44px minimum
- ✅ Support `prefers-reduced-motion`
- ✅ Support mode contraste élevé

### Tests Automatiques
- **Storybook a11y addon** - Tests en temps réel
- **jest-axe** - Tests unitaires d'accessibilité
- **Lighthouse** - Audits automatisés

### Score Cible
**>77%** maintenu sur tous les composants

## 🎯 Configuration Avancée

### Tailwind CSS

Étendez la configuration avec les tokens TrustBoost :

```js
// tailwind.config.js
const { tokens } = require('@trustboost/design-system');

module.exports = {
  // ... votre config
  theme: {
    extend: {
      colors: tokens.colors,
      fontFamily: tokens.typography.fontFamilies,
      spacing: tokens.spacing.spacing,
    },
  },
};
```

### Variables CSS

```css
:root {
  /* Pattern Context7 - Design tokens */
  --font-display: "Satoshi", "Inter", "system-ui", "sans-serif";
  --breakpoint-3xl: 120rem;
  --color-primary-500: oklch(0.56 0.20 220);
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
}
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez le [guide de contribution](CONTRIBUTING.md).

### Process
1. Fork le repository
2. Créez une branche feature (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Pushez sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

### Standards
- Tests d'accessibilité obligatoires
- Documentation Storybook pour nouveaux composants
- Respect des design tokens existants
- TypeScript strict mode

## 🛡️ Support Navigateurs

| Navigateur | Version Minimum |
|------------|-----------------|
| Chrome     | 88+             |
| Firefox    | 85+             |
| Safari     | 14+             |
| Edge       | 88+             |

## 📄 Licence

MIT © [TrustBoost Design Team](LICENSE)

## 🔗 Liens Utiles

- [Documentation Storybook](https://trustboost-design-system.netlify.app)
- [Figma Design Kit](https://figma.com/trustboost-design-system)
- [NPM Package](https://npmjs.com/package/@trustboost/design-system)
- [Issues GitHub](https://github.com/trustboost/design-system/issues)

## 📊 Métriques

- **Composants** : 2+ (Button, Card)
- **Design Tokens** : 200+ variables
- **Bundle Size** : ~50KB gzippé  
- **Accessibilité** : Score >77%
- **Coverage** : Tests >90%

---

**Construit avec ❤️ par l'équipe TrustBoost**