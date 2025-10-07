/**
 * TrustBoost Design Tokens - Spacing
 * Système d'espacement basé sur une échelle modulaire
 */

// Échelle d'espacement basée sur 4px (0.25rem)
export const spacing = {
  0: '0px',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  18: '4.5rem', // Pattern Context7
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  88: '22rem', // Pattern Context7
  96: '24rem',
  120: '30rem', // Pattern Context7
} as const;

// Espacement sémantique pour les composants
export const componentSpacing = {
  // Espacement interne des composants
  button: {
    sm: { x: spacing[3], y: spacing[1.5] },
    md: { x: spacing[4], y: spacing[2] },
    lg: { x: spacing[6], y: spacing[3] },
  },
  input: {
    sm: { x: spacing[3], y: spacing[1.5] },
    md: { x: spacing[3], y: spacing[2] },
    lg: { x: spacing[4], y: spacing[3] },
  },
  card: {
    sm: spacing[4],
    md: spacing[6],
    lg: spacing[8],
  },
  modal: {
    padding: spacing[6],
    margin: spacing[4],
  },
  
  // Espacement entre éléments
  stack: {
    xs: spacing[1],
    sm: spacing[2],
    md: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
  },
  
  // Espacement de mise en page
  section: {
    sm: spacing[8],
    md: spacing[12],
    lg: spacing[16],
    xl: spacing[24],
  },
  
  // Conteneurs
  container: {
    padding: {
      mobile: spacing[4],
      tablet: spacing[6],
      desktop: spacing[8],
    },
  },
} as const;

// Tailles pour les composants
export const sizes = {
  // Hauteurs d'éléments interactifs
  button: {
    sm: '2rem',      // 32px
    md: '2.5rem',    // 40px
    lg: '3rem',      // 48px
  },
  input: {
    sm: '2rem',      // 32px
    md: '2.5rem',    // 40px
    lg: '3rem',      // 48px
  },
  
  // Tailles d'icônes
  icon: {
    xs: '0.875rem',  // 14px
    sm: '1rem',      // 16px
    md: '1.25rem',   // 20px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '2.5rem', // 40px
  },
  
  // Tailles d'avatars
  avatar: {
    xs: '1.5rem',    // 24px
    sm: '2rem',      // 32px
    md: '2.5rem',    // 40px
    lg: '3rem',      // 48px
    xl: '4rem',      // 64px
  },
  
  // Largeurs maximales
  maxWidth: {
    xs: '20rem',     // 320px
    sm: '24rem',     // 384px
    md: '28rem',     // 448px
    lg: '32rem',     // 512px
    xl: '36rem',     // 576px
    '2xl': '42rem',  // 672px
    '3xl': '48rem',  // 768px
    '4xl': '56rem',  // 896px
    '5xl': '64rem',  // 1024px
    '6xl': '72rem',  // 1152px
    '7xl': '80rem',  // 1280px
    prose: '65ch',   // Largeur optimale pour la lecture
  },
  
  // Hauteurs minimales
  minHeight: {
    screen: '100vh',
    touch: '44px',   // Minimum pour touch targets (iOS Guidelines)
  },
} as const;

// Radius (coins arrondis)
export const borderRadius = {
  none: '0px',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// Z-index scale
export const zIndex = {
  auto: 'auto',
  base: 1,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Types TypeScript
export type SpacingKey = keyof typeof spacing;
export type ComponentSpacingKey = keyof typeof componentSpacing;
export type SizeKey = keyof typeof sizes;
export type BorderRadiusKey = keyof typeof borderRadius;
export type ZIndexKey = keyof typeof zIndex;

// Utilitaires
export const getSpacing = (key: SpacingKey): string => spacing[key];
export const getBorderRadius = (key: BorderRadiusKey): string => borderRadius[key];
export const getZIndex = (key: ZIndexKey): string | number => zIndex[key];

// Variables CSS pour Tailwind
export const spacingVariables = {
  // Spacing custom
  '--spacing-18': spacing[18],
  '--spacing-88': spacing[88],
  '--spacing-120': spacing[120],
  
  // Component spacing
  ...Object.entries(componentSpacing.button).reduce((acc, [size, values]) => {
    acc[`--button-padding-x-${size}`] = values.x;
    acc[`--button-padding-y-${size}`] = values.y;
    return acc;
  }, {} as Record<string, string>),
  
  // Z-index
  ...Object.entries(zIndex).reduce((acc, [key, value]) => {
    acc[`--z-${key}`] = value.toString();
    return acc;
  }, {} as Record<string, string>),
} as const;

export default {
  spacing,
  componentSpacing,
  sizes,
  borderRadius,
  zIndex,
  spacingVariables,
};