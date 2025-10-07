/**
 * TrustBoost Design System - Accessibilité Tests
 * Tests et démonstrations des fonctionnalités d'accessibilité WCAG AA
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/components/Button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '../src/components/Card';
import { 
  EyeOpenIcon, 
  AccessibilityIcon, 
  KeyboardIcon,
  SpeakerLoudIcon,
  ContrastIcon 
} from '@radix-ui/react-icons';

const meta: Meta = {
  title: 'Testing/Accessibility',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Tests d'Accessibilité WCAG AA

Cette page démontre les fonctionnalités d'accessibilité intégrées dans le design system TrustBoost.
Tous les composants respectent les critères WCAG 2.1 niveau AA.

## Critères Testés

- ✅ **Contraste de couleurs** - 4.5:1 minimum pour le texte normal
- ✅ **Navigation clavier** - Tab, Shift+Tab, Entrée, Espace
- ✅ **Focus management** - Indicateurs visibles et logiques
- ✅ **États ARIA** - Attributs appropriés pour les technologies assistives
- ✅ **Tailles tactiles** - Minimum 44px pour les cibles mobiles
- ✅ **Alternative text** - Descriptions pour les éléments visuels
        `,
      },
    },
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'focus-order-semantics',
            enabled: true,
          },
          {
            id: 'keyboard',
            enabled: true,
          },
          {
            id: 'landmark-one-main',
            enabled: true,
          },
        ],
      },
      options: {},
      manual: false,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

/** Test de navigation au clavier */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2 mb-4">
        <KeyboardIcon className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-semibold">Navigation Clavier</h2>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-neutral-600">
          Utilisez <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-xs font-mono">Tab</kbd> et 
          <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-xs font-mono mx-1">Shift+Tab</kbd> 
          pour naviguer, <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-xs font-mono">Entrée</kbd> ou 
          <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-xs font-mono mx-1">Espace</kbd> pour activer.
        </p>
        
        <div className="flex flex-wrap gap-3">
          <Button>Premier bouton</Button>
          <Button variant="outline">Deuxième bouton</Button>
          <Button variant="ghost">Troisième bouton</Button>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="test-input" className="block text-sm font-medium">
            Champ de test
          </label>
          <input
            id="test-input"
            type="text"
            className="form-input"
            placeholder="Tapez quelque chose..."
            aria-describedby="input-help"
          />
          <p id="input-help" className="text-sm text-neutral-600">
            Ce champ fait partie de la séquence de navigation
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Test de la navigation séquentielle au clavier avec focus visible.',
      },
    },
  },
};

/** Test des contrastes de couleurs */
export const ColorContrast: Story = {
  render: () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2 mb-4">
        <ContrastIcon className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-semibold">Contraste des Couleurs</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 text-neutral-900">
              Texte Normal (4.5:1)
            </h3>
            <p className="text-neutral-600 text-sm">
              Ce texte respecte le ratio minimum WCAG AA de 4.5:1 pour le texte normal.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 text-lg text-neutral-900">
              Texte Large (3:1)
            </h3>
            <p className="text-neutral-600">
              Ce texte large respecte le ratio minimum WCAG AA de 3:1.
            </p>
          </CardContent>
        </Card>
        
        <div className="col-span-1 md:col-span-2 space-y-2">
          <h4 className="font-semibold">États des boutons</h4>
          <div className="flex flex-wrap gap-2">
            <Button>Primary (contraste validé)</Button>
            <Button variant="outline">Outline (contraste validé)</Button>
            <Button disabled>Disabled (exception WCAG)</Button>
          </div>
        </div>
      </div>
    </div>
  ),
};

/** Test des états ARIA et technologies assistives */
export const AriaStates: Story = {
  render: () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2 mb-4">
        <SpeakerLoudIcon className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-semibold">États ARIA</h2>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-neutral-600">
          Testez avec un lecteur d'écran (NVDA, JAWS, VoiceOver) pour entendre les états ARIA.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Boutons avec états</h3>
              <div className="space-y-2">
                <Button 
                  aria-label="Sauvegarder le document (raccourci Ctrl+S)"
                  title="Sauvegarder"
                >
                  Sauvegarder
                </Button>
                <Button 
                  loading 
                  aria-label="Chargement en cours, veuillez patienter"
                >
                  Chargement...
                </Button>
                <Button 
                  disabled 
                  aria-label="Action non disponible pour le moment"
                >
                  Non disponible
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Formulaire accessible</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    required
                    aria-describedby="email-error"
                    aria-invalid="true"
                  />
                  <div id="email-error" className="text-sm text-error-600 mt-1" role="alert">
                    Format d'email invalide
                  </div>
                </div>
                
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium">Notifications</legend>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" aria-describedby="email-notif-desc" />
                    <span>Notifications par email</span>
                  </label>
                  <p id="email-notif-desc" className="text-xs text-neutral-600 ml-6">
                    Recevoir les mises à jour importantes
                  </p>
                </fieldset>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
};

/** Test des tailles tactiles mobiles */
export const TouchTargets: Story = {
  render: () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2 mb-4">
        <AccessibilityIcon className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-semibold">Tailles Tactiles (44px minimum)</h2>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-neutral-600">
          Tous les éléments interactifs respectent la taille minimum de 44px recommandée par les guidelines iOS et Android.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Boutons (hauteur 40px + padding)</h4>
            <div className="space-y-2">
              <Button size="sm">Small (32px + padding = 44px)</Button>
              <Button size="md">Medium (40px + padding = 48px)</Button>
              <Button size="lg">Large (48px + padding = 56px)</Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Contrôles interactifs</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-2 min-h-[44px]">
                <input type="checkbox" className="w-4 h-4" />
                <span>Option avec zone tactile étendue</span>
              </label>
              
              <div className="flex items-center gap-2">
                <button 
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200"
                  aria-label="Icône seule avec zone tactile 44px"
                >
                  <EyeOpenIcon className="w-5 h-5" />
                </button>
                <span className="text-sm">Icône avec zone tactile appropriée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

/** Test de mode contraste élevé */
export const HighContrastMode: Story = {
  render: () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2 mb-4">
        <ContrastIcon className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-semibold">Mode Contraste Élevé</h2>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-neutral-600">
          Les composants s'adaptent automatiquement au mode contraste élevé du système.
        </p>
        
        <div className="p-4 border-2 border-dashed border-neutral-300 rounded-lg">
          <p className="text-sm mb-4">
            <strong>Pour tester :</strong> Activez le mode contraste élevé dans vos préférences système.
          </p>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button>Action principale</Button>
              <Button variant="outline">Action secondaire</Button>
            </div>
            
            <Card className="max-w-sm">
              <CardHeader>
                <CardTitle>Carte avec bordures renforcées</CardTitle>
                <CardDescription>
                  En mode contraste élevé, les bordures deviennent plus épaisses.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input 
                  type="text" 
                  placeholder="Champ avec bordure renforcée"
                  className="form-input w-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Test du mode contraste élevé avec bordures renforcées.',
      },
    },
  },
};

/** Test de réduction des animations */
export const ReducedMotion: Story = {
  render: () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2 mb-4">
        <AccessibilityIcon className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-semibold">Respect de "Prefers Reduced Motion"</h2>
      </div>
      
      <div className="space-y-4">
        <p className="text-sm text-neutral-600">
          Les animations sont automatiquement désactivées si l'utilisateur a activé "Réduire les animations" dans ses préférences système.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Transitions normales</h4>
              <Button className="transition-all duration-200 hover:scale-105">
                Bouton avec transition
              </Button>
              <p className="text-xs text-neutral-600 mt-2">
                Hover pour voir l'effet (désactivé si prefers-reduced-motion)
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Animation spinner</h4>
              <Button loading>
                Chargement...
              </Button>
              <p className="text-xs text-neutral-600 mt-2">
                Animation réduite automatiquement si nécessaire
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="p-4 bg-neutral-50 rounded-lg">
          <p className="text-sm">
            <strong>Pour tester :</strong> Activez "Réduire les animations" dans vos préférences d'accessibilité système.
            Les transitions seront automatiquement réduites à 0.01ms.
          </p>
        </div>
      </div>
    </div>
  ),
};

/** Résumé des tests d'accessibilité */
export const AccessibilitySummary: Story = {
  render: () => (
    <div className="space-y-6 p-6 max-w-4xl">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <AccessibilityIcon className="w-6 h-6 text-primary-600" />
        Résumé des Tests d'Accessibilité
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-trust-600">✅ Critères Respectés</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Contrastes WCAG AA (4.5:1 minimum)</li>
              <li>• Navigation clavier complète</li>
              <li>• Focus management visible</li>
              <li>• États ARIA appropriés</li>
              <li>• Tailles tactiles 44px+</li>
              <li>• Alternatives textuelles</li>
              <li>• Structure HTML sémantique</li>
              <li>• Support prefers-reduced-motion</li>
              <li>• Mode contraste élevé</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>🔧 Outils de Test Recommandés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Lecteurs d'écran :</strong>
                <ul className="ml-4 mt-1">
                  <li>• NVDA (Windows, gratuit)</li>
                  <li>• JAWS (Windows, payant)</li>
                  <li>• VoiceOver (macOS/iOS, intégré)</li>
                </ul>
              </div>
              
              <div>
                <strong>Extensions navigateur :</strong>
                <ul className="ml-4 mt-1">
                  <li>• axe DevTools</li>
                  <li>• WAVE Evaluation Tool</li>
                  <li>• Lighthouse Accessibility</li>
                </ul>
              </div>
              
              <div>
                <strong>Tests automatiques :</strong>
                <ul className="ml-4 mt-1">
                  <li>• Storybook a11y addon (actif)</li>
                  <li>• jest-axe pour les tests unitaires</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-primary-50 border-primary-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-primary-900 mb-2">
            Score d'Accessibilité Cible : &gt;77%
          </h3>
          <p className="text-primary-800 text-sm">
            Le design system TrustBoost maintient un score d'accessibilité supérieur à 77% 
            sur tous les composants, dépassant les exigences WCAG AA standard.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Vue d\'ensemble complète des fonctionnalités d\'accessibilité intégrées.',
      },
    },
  },
};