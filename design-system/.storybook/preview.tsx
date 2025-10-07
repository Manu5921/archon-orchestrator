import React from 'react';
import type { Preview } from '@storybook/react';
import { Theme } from '@radix-ui/themes';

// Importation des styles TrustBoost
import '@radix-ui/themes/styles.css';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    // Configuration des contrôles automatiques
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: 'requiredFirst',
    },
    
    // Documentation automatique
    docs: {
      toc: {
        contentsSelector: '.sbdocs-content',
        headingSelector: 'h1, h2, h3',
        title: 'Table des matières',
        disable: false,
        unsafeTocbotOptions: {
          orderedList: false,
        },
      },
    },
    
    // Configuration des actions
    actions: { 
      argTypesRegex: '^on[A-Z].*',
    },
    
    // Configuration de l'accessibilité
    a11y: {
      config: {
        rules: [
          {
            id: 'autocomplete-valid',
            enabled: true,
          },
          {
            id: 'button-name',
            enabled: true,
          },
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'focus-order-semantics',
            enabled: true,
          },
          {
            id: 'landmark-one-main',
            enabled: true,
          },
          {
            id: 'region',
            enabled: true,
          },
        ],
      },
      options: {
        checks: { 
          'color-contrast': { options: { noScroll: true } } 
        },
        restoreScroll: true,
      },
    },
    
    // Configuration des viewports responsive
    viewport: {
      viewports: {
        mobile1: {
          name: 'iPhone SE',
          styles: { width: '375px', height: '667px' },
          type: 'mobile',
        },
        mobile2: {
          name: 'iPhone 12 Pro',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
        tablet: {
          name: 'iPad',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        laptop: {
          name: 'Laptop',
          styles: { width: '1024px', height: '768px' },
          type: 'desktop',
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
          type: 'desktop',
        },
        wide: {
          name: 'Wide Screen',
          styles: { width: '1920px', height: '1080px' },
          type: 'desktop',
        },
      },
      defaultViewport: 'laptop',
    },
    
    // Configuration des backgrounds
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0a0a0a',
        },
        {
          name: 'neutral',
          value: '#f5f5f5',
        },
      ],
    },
    
    // Layout par défaut
    layout: 'centered',
  },
  
  // Décorateur global pour Radix UI Theme
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';
      
      return (
        <Theme
          accentColor="blue"
          grayColor="slate"
          radius="medium"
          scaling="100%"
          appearance={theme}
          hasBackground={false}
        >
          <div className="storybook-wrapper" data-theme={theme}>
            <Story />
          </div>
        </Theme>
      );
    },
  ],
  
  // Variables globales pour les outils
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Theme TrustBoost',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
    locale: {
      name: 'Locale',
      description: 'Langue d\'interface',
      defaultValue: 'fr',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'fr', title: 'Français', right: '🇫🇷' },
          { value: 'en', title: 'English', right: '🇬🇧' },
          { value: 'es', title: 'Español', right: '🇪🇸' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  
  // Tags pour la documentation automatique
  tags: ['autodocs'],
};

export default preview;