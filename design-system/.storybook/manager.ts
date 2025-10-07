import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

// Thème personnalisé TrustBoost pour Storybook
const trustboostTheme = create({
  base: 'light',
  
  // Branding TrustBoost
  brandTitle: 'TrustBoost Design System',
  brandUrl: 'https://trustboost.io',
  brandTarget: '_self',
  
  // Couleurs principales
  colorPrimary: '#0ea5e9',
  colorSecondary: '#22c55e',
  
  // Interface utilisateur
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e5e5e5',
  appBorderRadius: 8,
  
  // Typographie
  fontBase: '"Inter", "Helvetica Neue", sans-serif',
  fontCode: '"JetBrains Mono", monospace',
  
  // Texte
  textColor: '#171717',
  textInverseColor: '#ffffff',
  textMutedColor: '#737373',
  
  // Barre d'outils
  barTextColor: '#525252',
  barSelectedColor: '#0ea5e9',
  barHoverColor: '#0ea5e9',
  barBg: '#fafafa',
  
  // Formulaires
  inputBg: '#ffffff',
  inputBorder: '#d4d4d4',
  inputTextColor: '#171717',
  inputBorderRadius: 6,
  
  // Boutons
  buttonBg: '#0ea5e9',
  buttonBorder: '#0ea5e9',
});

// Configuration du manager Storybook
addons.setConfig({
  theme: trustboostTheme,
  panelPosition: 'bottom',
  selectedPanel: 'controls',
  initialActive: 'sidebar',
  sidebar: {
    showRoots: false,
    collapsedRoots: ['other'],
  },
  toolbar: {
    title: { hidden: false },
    zoom: { hidden: false },
    eject: { hidden: false },
    copy: { hidden: false },
    fullscreen: { hidden: false },
  },
  enableShortcuts: true,
  showToolbar: true,
});