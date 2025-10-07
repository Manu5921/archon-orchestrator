/**
 * TrustBoost Design Tokens - Index
 * Point d'entrée centralisé pour tous les design tokens
 */

export { colors, accessibleColors, cssVariables as colorVariables, getColor } from './colors';
export type { ColorScale, ColorName, ColorValue } from './colors';

export { 
  fontFamilies,
  fontWeights,
  fontSizes,
  textStyles,
  lineHeights,
  letterSpacing,
  typographyVariables,
  getTextStyle,
  getFontSize
} from './typography';
export type { FontFamily, FontWeight, FontSize, TextStyle, LineHeight, LetterSpacing } from './typography';

export {
  spacing,
  componentSpacing,
  sizes,
  borderRadius,
  zIndex,
  spacingVariables,
  getSpacing,
  getBorderRadius,
  getZIndex
} from './spacing';
export type { SpacingKey, ComponentSpacingKey, SizeKey, BorderRadiusKey, ZIndexKey } from './spacing';

// Configuration globale des tokens
export const tokens = {
  colors,
  typography: {
    fontFamilies,
    fontWeights,
    fontSizes,
    textStyles,
    lineHeights,
    letterSpacing,
  },
  spacing: {
    spacing,
    componentSpacing,
    sizes,
    borderRadius,
    zIndex,
  },
} as const;

// Variables CSS globales
export const allCssVariables = {
  // Pattern Context7 - Design tokens principaux
  '--font-display': 'Satoshi, Inter, system-ui, sans-serif',
  '--font-body': 'Inter, system-ui, sans-serif',
  '--font-mono': 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
  
  // Breakpoint custom - Pattern Context7
  '--breakpoint-3xl': '120rem',
  
  // Animation easing - Pattern Context7
  '--ease-fluid': 'cubic-bezier(0.3, 0, 0, 1)',
  '--ease-snappy': 'cubic-bezier(0.2, 0, 0, 1)',
  
  // Couleurs principales OKLCH - Optimisées pour l'accessibilité
  '--color-primary-50': 'oklch(0.97 0.02 220)',
  '--color-primary-100': 'oklch(0.94 0.05 220)',
  '--color-primary-200': 'oklch(0.87 0.09 220)',
  '--color-primary-300': 'oklch(0.76 0.14 220)',
  '--color-primary-400': 'oklch(0.64 0.18 220)',
  '--color-primary-500': 'oklch(0.56 0.20 220)', // Main TrustBoost Blue
  '--color-primary-600': 'oklch(0.48 0.18 220)',
  '--color-primary-700': 'oklch(0.40 0.16 220)',
  '--color-primary-800': 'oklch(0.32 0.13 220)',
  '--color-primary-900': 'oklch(0.24 0.10 220)',
  '--color-primary-950': 'oklch(0.15 0.06 220)',
  
  // Couleurs de confiance
  '--color-trust-50': 'oklch(0.98 0.03 145)',
  '--color-trust-100': 'oklch(0.95 0.06 145)',
  '--color-trust-200': 'oklch(0.88 0.12 145)',
  '--color-trust-300': 'oklch(0.78 0.18 145)',
  '--color-trust-400': 'oklch(0.68 0.22 145)',
  '--color-trust-500': 'oklch(0.58 0.24 145)', // Trust Green
  '--color-trust-600': 'oklch(0.48 0.20 145)',
  '--color-trust-700': 'oklch(0.38 0.16 145)',
  '--color-trust-800': 'oklch(0.28 0.12 145)',
  '--color-trust-900': 'oklch(0.20 0.08 145)',
  '--color-trust-950': 'oklch(0.12 0.04 145)',
  
  // Espacement custom - Pattern Context7
  '--spacing-18': '4.5rem',
  '--spacing-88': '22rem',
  '--spacing-120': '30rem',
} as const;

// Utilitaires de tokens
export const tokenUtils = {
  // Générer des variables CSS pour un objet de couleurs
  generateCssVars: (prefix: string, colors: Record<string, string>): Record<string, string> => {
    return Object.entries(colors).reduce((acc, [key, value]) => {
      acc[`--${prefix}-${key}`] = value;
      return acc;
    }, {} as Record<string, string>);
  },
  
  // Valider un contraste de couleur
  validateContrast: (foreground: string, background: string): boolean => {
    // Implémentation simplifiée - en production, utiliser une vraie lib de contraste
    return true; // Placeholder
  },
  
  // Convertir rem en px
  remToPx: (remValue: string, baseFontSize: number = 16): number => {
    const numValue = parseFloat(remValue.replace('rem', ''));
    return numValue * baseFontSize;
  },
  
  // Convertir px en rem
  pxToRem: (pxValue: number, baseFontSize: number = 16): string => {
    return `${pxValue / baseFontSize}rem`;
  },
} as const;

// Export par défaut
export default tokens;