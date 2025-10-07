/**
 * TrustBoost Card - Stories Storybook
 */

import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle, 
  CardDescription 
} from './Card';
import { Button } from '../Button';
import { 
  StarIcon, 
  HeartIcon, 
  BookmarkIcon,
  PersonIcon,
  CalendarIcon,
  ChatBubbleIcon
} from '@radix-ui/react-icons';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Le composant Card de TrustBoost permet de créer des conteneurs visuellement cohérents pour regrouper du contenu.
Basé sur les design tokens TrustBoost, il offre plusieurs variantes et est optimisé pour l'accessibilité.

## Caractéristiques

- ✅ **Flexible** - Structure modulaire avec Header, Content, Footer
- 🎨 **Design Tokens** - Utilise le système de couleurs et espacements TrustBoost
- 📱 **Responsive** - S'adapte aux différentes tailles d'écran  
- 🔧 **Interactif** - Support pour les cartes cliquables avec gestion clavier
- ♿ **Accessible** - Focus management et navigation clavier

## Usage

\`\`\`tsx
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  CardTitle,
  CardDescription 
} from '@trustboost/design-system';

function ProductCard() {
  return (
    <Card variant="elevated" size="md">
      <CardHeader>
        <CardTitle>Titre de la carte</CardTitle>
        <CardDescription>Description du contenu</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Contenu principal */}
      </CardContent>
      <CardFooter>
        {/* Actions ou métadonnées */}
      </CardFooter>
    </Card>
  );
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'ghost'],
      description: 'Variante visuelle de la carte',
    },
    size: {
      control: 'select', 
      options: ['sm', 'md', 'lg'],
      description: 'Taille des coins arrondis',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Espacement interne',
    },
    interactive: {
      control: 'boolean',
      description: 'Carte cliquable avec effets hover',
    },
  },
  args: {
    onClick: fn(),
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Carte basique avec structure complète */
export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Titre de la carte</CardTitle>
        <CardDescription>
          Une description courte qui explique le contenu de cette carte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-600">
          Voici le contenu principal de la carte. Il peut contenir du texte, 
          des images, ou tout autre élément.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Action</Button>
      </CardFooter>
    </Card>
  ),
};

/** Toutes les variantes visuelles */
export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      <Card variant="default" className="w-64">
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>Carte par défaut avec bordure subtile</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Contenu de la carte default.</p>
        </CardContent>
      </Card>

      <Card variant="elevated" className="w-64">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
          <CardDescription>Carte avec ombre prononcée</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Contenu de la carte elevated.</p>
        </CardContent>
      </Card>

      <Card variant="outlined" className="w-64">
        <CardHeader>
          <CardTitle>Outlined</CardTitle>
          <CardDescription>Carte avec bordure épaisse</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Contenu de la carte outlined.</p>
        </CardContent>
      </Card>

      <Card variant="ghost" className="w-64">
        <CardHeader>
          <CardTitle>Ghost</CardTitle>
          <CardDescription>Carte avec fond subtil</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Contenu de la carte ghost.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

/** Différentes tailles et padding */
export const SizesAndPadding: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-4 font-semibold">Tailles (border-radius)</h4>
        <div className="flex gap-4">
          <Card size="sm" className="w-48">
            <CardContent>
              <p className="text-sm">Small (rounded-lg)</p>
            </CardContent>
          </Card>
          <Card size="md" className="w-48">
            <CardContent>
              <p className="text-sm">Medium (rounded-xl)</p>
            </CardContent>
          </Card>
          <Card size="lg" className="w-48">
            <CardContent>
              <p className="text-sm">Large (rounded-2xl)</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h4 className="mb-4 font-semibold">Padding</h4>
        <div className="grid grid-cols-2 gap-4">
          <Card padding="sm" className="w-48">
            <CardContent>
              <p className="text-sm">Small padding</p>
            </CardContent>
          </Card>
          <Card padding="md" className="w-48">
            <CardContent>
              <p className="text-sm">Medium padding</p>
            </CardContent>
          </Card>
          <Card padding="lg" className="w-48">
            <CardContent>
              <p className="text-sm">Large padding</p>
            </CardContent>
          </Card>
          <Card padding="none" className="w-48 border">
            <div className="p-4">
              <p className="text-sm">No padding (custom content)</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  ),
};

/** Cartes interactives */
export const Interactive: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card interactive className="w-80" onClick={() => alert('Carte cliquée!')}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StarIcon className="w-5 h-5 text-warning-500" />
            Carte interactive
          </CardTitle>
          <CardDescription>
            Cliquez sur cette carte pour voir l'interaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">
            Cette carte a des effets hover et est accessible au clavier.
          </p>
        </CardContent>
        <CardFooter>
          <span className="text-xs text-neutral-500">
            ↗ Cliquable
          </span>
        </CardFooter>
      </Card>

      <Card className="w-80">
        <CardHeader>
          <CardTitle>Carte statique</CardTitle>
          <CardDescription>
            Cette carte n'est pas interactive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600">
            Pas d'effets hover ni de clics.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline">
            Action dans le footer
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

/** Cas d'usage e-commerce - Carte produit */
export const ProductCard: Story = {
  render: () => (
    <Card variant="elevated" className="w-80" interactive>
      <div className="aspect-video bg-neutral-100 rounded-t-xl overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-neutral-400">
          <span className="text-sm">Image produit</span>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-neutral-900">
            Produit Premium
          </h3>
          <button className="p-1 hover:bg-neutral-100 rounded">
            <HeartIcon className="w-4 h-4 text-neutral-500" />
          </button>
        </div>
        <p className="text-sm text-neutral-600 mb-3">
          Description du produit avec ses principales caractéristiques.
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">
            €129.99
          </span>
          <div className="flex items-center gap-1">
            <StarIcon className="w-4 h-4 text-warning-500" />
            <span className="text-sm text-neutral-600">4.8</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button fullWidth>
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  ),
};

/** Cas d'usage blog - Carte article */
export const BlogCard: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <PersonIcon className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Marie Dupont</p>
            <p className="text-xs text-neutral-500">Il y a 2 jours</p>
          </div>
        </div>
        <CardTitle>
          Guide complet du Design System
        </CardTitle>
        <CardDescription>
          Découvrez comment créer et maintenir un design system efficace 
          pour votre équipe produit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gradient-to-r from-primary-100 to-trust-100 rounded-lg mb-4">
        </div>
        <p className="text-sm text-neutral-600 line-clamp-3">
          Un design system bien conçu permet d'accélérer le développement, 
          d'améliorer la cohérence et de faciliter la collaboration entre 
          les équipes design et développement...
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <span className="flex items-center gap-1">
            <HeartIcon className="w-4 h-4" />
            24
          </span>
          <span className="flex items-center gap-1">
            <ChatBubbleIcon className="w-4 h-4" />
            8
          </span>
          <span className="flex items-center gap-1">
            <BookmarkIcon className="w-4 h-4" />
            Sauvegarder
          </span>
        </div>
        <Button variant="ghost" size="sm">
          Lire la suite
        </Button>
      </CardFooter>
    </Card>
  ),
};

/** Cas d'usage dashboard - Métriques */
export const MetricsCard: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">
                Ventes totales
              </p>
              <p className="text-2xl font-bold text-neutral-900">
                €12,425
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm font-medium text-trust-600">
              +12.5%
            </span>
            <span className="text-sm text-neutral-500">
              vs mois dernier
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">
                Nouveaux clients
              </p>
              <p className="text-2xl font-bold text-neutral-900">
                1,247
              </p>
            </div>
            <div className="w-12 h-12 bg-trust-100 rounded-full flex items-center justify-center">
              <PersonIcon className="w-6 h-6 text-trust-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm font-medium text-trust-600">
              +8.2%
            </span>
            <span className="text-sm text-neutral-500">
              vs mois dernier
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">
                Satisfaction
              </p>
              <p className="text-2xl font-bold text-neutral-900">
                4.8/5
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
              <StarIcon className="w-6 h-6 text-warning-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm font-medium text-trust-600">
              +0.3
            </span>
            <span className="text-sm text-neutral-500">
              vs mois dernier
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

/** Tests d'accessibilité */
export const AccessibilityDemo: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-4 font-semibold">Navigation au clavier</h4>
        <div className="flex gap-4">
          <Card interactive className="w-64">
            <CardContent className="p-4">
              <p className="text-sm">Carte interactive - Tab pour focus</p>
            </CardContent>
          </Card>
          <Card interactive className="w-64">
            <CardContent className="p-4">
              <p className="text-sm">Deuxième carte - Entrée pour activer</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h4 className="mb-4 font-semibold">Structure sémantique</h4>
        <Card className="w-96">
          <CardHeader>
            <CardTitle as="h2">Titre sémantique H2</CardTitle>
            <CardDescription>
              Les titres respectent la hiérarchie HTML
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Contenu avec structure sémantique appropriée.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
  parameters: {
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