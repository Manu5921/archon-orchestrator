/**
 * TrustBoost Design System - Main Index
 * Point d'entrée principal du design system
 */

// Components
export * from './components';

// Tokens
export * from './tokens';

// Styles
export './styles/globals.css';

// Version
export const VERSION = '1.0.0';

// Configuration par défaut
export const TRUSTBOOST_CONFIG = {
  name: 'TrustBoost Design System',
  version: VERSION,
  theme: {
    defaultMode: 'light' as const,
    supportedModes: ['light', 'dark'] as const,
  },
  accessibility: {
    level: 'AA' as const,
    features: [
      'keyboard-navigation',
      'screen-reader',
      'high-contrast',
      'reduced-motion'
    ] as const,
  },
} as const;