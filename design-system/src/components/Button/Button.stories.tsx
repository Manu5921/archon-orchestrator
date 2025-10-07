/**
 * TrustBoost Button - Stories Storybook
 * Documentation et démonstration du composant Button
 */

import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';
import { 
  StarIcon, 
  ArrowRightIcon, 
  DownloadIcon,
  HeartIcon,
  PlusIcon 
} from '@radix-ui/react-icons';

// Configuration Storybook
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    // Layout centré pour les composants
    layout: 'centered',
    // Documentation automatique
    docs: {
      description: {
        component: `
Le composant Button de TrustBoost offre une interface cohérente et accessible pour toutes les interactions utilisateur. 
Basé sur Radix UI et optimisé pour l'accessibilité WCAG AA, il supporte plusieurs variants, tailles et états.

## Caractéristiques

- ✅ **Accessibilité WCAG AA** - Focus management, états ARIA, navigation clavier
- 🎨 **Design Tokens** - Couleurs et espacements basés sur le système TrustBoost  
- 📱 **Responsive** - Adapté aux interfaces mobile et desktop
- 🔧 **Flexible** - Supports icônes, états de chargement, variantes multiples
- ⚡ **Performance** - Optimisé avec Radix UI primitives

## Usage

\`\`\`tsx
import { Button } from '@trustboost/design-system';

function App() {
  return (
    <Button variant="primary" size="md">
      Confirmer l'action
    </Button>
  );
}
\`\`\`
        `,
      },
    },
  },
  // Contrôles automatiques basés sur les PropTypes
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      description: 'Variante visuelle du bouton',
      table: {
        defaultValue: { summary: 'primary' },
        type: { summary: 'string' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Taille du bouton',
      table: {
        defaultValue: { summary: 'md' },
        type: { summary: 'string' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'État de chargement avec spinner',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Désactiver le bouton',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Bouton en pleine largeur',
      table: {
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    children: {
      control: 'text',
      description: 'Contenu du bouton',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'Fonction appelée au clic',
    },
  },
  // Arguments par défaut
  args: {
    onClick: fn(),
    children: 'Button',
  },
  // Tags pour la documentation automatique
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stories principales

/** Story par défaut - montre le bouton dans sa configuration de base */
export const Default: Story = {
  args: {
    children: 'Bouton par défaut',
  },
};

/** Toutes les variantes disponibles côte à côte */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Les différentes variantes visuelles disponibles pour s\'adapter au contexte d\'usage.',
      },
    },
  },
};

/** Différentes tailles de boutons */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Trois tailles disponibles pour s\'adapter aux différents contextes d\'interface.',
      },
    },
  },
};

/** Boutons avec icônes */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button leftIcon={<StarIcon />}>Avec icône gauche</Button>
      <Button rightIcon={<ArrowRightIcon />}>Avec icône droite</Button>
      <Button 
        leftIcon={<DownloadIcon />} 
        rightIcon={<ArrowRightIcon />}
        variant="outline"
      >
        Icônes des deux côtés
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Support des icônes à gauche et/ou à droite du texte pour enrichir l\'interface.',
      },
    },
  },
};

/** États de chargement */
export const LoadingStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button loading>Chargement...</Button>
      <Button loading variant="outline">En cours</Button>
      <Button loading size="sm">Small loading</Button>
      <Button loading size="lg">Large loading</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'État de chargement avec spinner automatique. Le bouton devient non-cliquable durant le chargement.',
      },
    },
  },
};

/** États désactivés */
export const DisabledStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button disabled>Désactivé</Button>
      <Button disabled variant="secondary">Secondary désactivé</Button>
      <Button disabled variant="outline">Outline désactivé</Button>
      <Button disabled leftIcon={<HeartIcon />}>Avec icône</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Boutons désactivés avec opacité réduite et curseur non-cliquable.',
      },
    },
  },
};

/** Boutons pleine largeur */
export const FullWidth: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Button fullWidth>Bouton pleine largeur</Button>
      <Button fullWidth variant="outline">Outline pleine largeur</Button>
      <Button fullWidth size="lg" leftIcon={<PlusIcon />}>
        Large avec icône
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Boutons qui s\'étendent sur toute la largeur de leur conteneur.',
      },
    },
  },
};

/** Démonstration interactive */
export const Interactive: Story = {
  args: {
    children: 'Cliquez-moi !',
    variant: 'primary',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'Bouton interactif pour tester les différentes combinaisons de props.',
      },
    },
  },
};

/** Cas d'usage e-commerce */
export const EcommerceExample: Story = {
  render: () => (
    <div className="space-y-4 p-6 bg-neutral-50 rounded-xl max-w-sm">
      <h3 className="text-lg font-semibold">Produit Premium</h3>
      <p className="text-sm text-neutral-600">
        Un produit fantastique qui va changer votre vie quotidienne.
      </p>
      <div className="text-2xl font-bold text-primary-600">€129.99</div>
      <div className="space-y-2">
        <Button fullWidth size="lg" leftIcon={<PlusIcon />}>
          Ajouter au panier
        </Button>
        <Button fullWidth variant="outline" size="md" leftIcon={<HeartIcon />}>
          Ajouter aux favoris
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exemple d\'utilisation dans un contexte e-commerce avec mise en page réaliste.',
      },
    },
  },
};

/** Tests d'accessibilité */
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-semibold">Navigation au clavier</h4>
        <div className="flex gap-2">
          <Button>Premier</Button>
          <Button variant="outline">Deuxième</Button>
          <Button variant="ghost">Troisième</Button>
        </div>
        <p className="text-sm text-neutral-600 mt-2">
          Utilisez Tab/Shift+Tab pour naviguer, Entrée/Espace pour activer
        </p>
      </div>
      
      <div>
        <h4 className="mb-2 font-semibold">États ARIA</h4>
        <div className="flex gap-2">
          <Button disabled aria-label="Bouton désactivé avec label explicite">
            Désactivé
          </Button>
          <Button loading aria-label="Bouton en cours de chargement">
            Chargement...
          </Button>
        </div>
        <p className="text-sm text-neutral-600 mt-2">
          Les états sont communiqués via les attributs ARIA
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Démonstration des fonctionnalités d\'accessibilité : navigation clavier, états ARIA, contrastes WCAG AA.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'keyboard-navigation',
            enabled: true,
          },
        ],
      },
    },
  },
};