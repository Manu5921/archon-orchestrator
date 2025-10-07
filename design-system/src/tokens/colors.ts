/**
 * TrustBoost Design Tokens - Colors
 * Basé sur les patterns Context7 et optimisé pour l'accessibilité WCAG AA
 */

export const colors = {
  // Couleurs primaires TrustBoost - Bleu confiance
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Couleur principale
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  
  // Couleurs secondaires - Vert confiance
  trust: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  // Couleurs d'état - Warning
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  // Couleurs d'état - Error
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  
  // Couleurs d'état - Success
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  // Couleurs d'état - Info
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  // Couleurs neutres - Interface
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  
  // Couleurs spéciales TrustBoost
  brand: {
    // Gradient principal
    gradient: {
      from: '#0ea5e9',
      to: '#22c55e',
    },
    // Couleurs d'accent
    accent: {
      purple: '#8b5cf6',
      orange: '#f97316',
      pink: '#ec4899',
      cyan: '#06b6d4',
    },
  },
} as const;

// Types pour TypeScript
export type ColorScale = typeof colors.primary;
export type ColorName = keyof typeof colors;
export type ColorValue = string;

// Utilitaires pour les couleurs
export const getColor = (colorName: ColorName, shade: keyof ColorScale): string => {
  const colorScale = colors[colorName] as ColorScale;
  return colorScale?.[shade] || colors.neutral[500];
};

// Couleurs optimisées pour l'accessibilité
export const accessibleColors = {
  // Contrastes validés WCAG AA
  textOnLight: colors.neutral[900],
  textOnDark: colors.neutral[0],
  textMuted: colors.neutral[600],
  textMutedDark: colors.neutral[400],
  
  // Couleurs de focus accessibles
  focusRing: colors.primary[500],
  focusRingDark: colors.primary[400],
  
  // Couleurs de bordure
  border: colors.neutral[200],
  borderDark: colors.neutral[700],
  borderInteractive: colors.primary[300],
  
  // Backgrounds
  background: colors.neutral[0],
  backgroundDark: colors.neutral[900],
  backgroundMuted: colors.neutral[50],
  backgroundMutedDark: colors.neutral[800],
} as const;

// Mapping pour les variables CSS
export const cssVariables = Object.entries(colors).reduce((acc, [colorName, colorScale]) => {
  if (typeof colorScale === 'object' && colorScale !== null && !Array.isArray(colorScale)) {
    Object.entries(colorScale).forEach(([shade, value]) => {
      if (typeof value === 'string') {
        acc[`--color-${colorName}-${shade}`] = value;
      }
    });
  }
  return acc;
}, {} as Record<string, string>);

export default colors;