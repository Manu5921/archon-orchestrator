/**
 * TrustBoost Design Tokens - Typography
 * Système typographique modulaire basé sur les patterns Context7
 */

// Familles de polices
export const fontFamilies = {
  display: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
  body: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
} as const;

// Poids de police
export const fontWeights = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

// Échelle typographique modulaire
export const fontSizes = {
  xs: {
    fontSize: '0.75rem',
    lineHeight: '1rem',
    letterSpacing: '0.02em',
  },
  sm: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    letterSpacing: '0.01em',
  },
  base: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    letterSpacing: '0em',
  },
  lg: {
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
    letterSpacing: '-0.01em',
  },
  xl: {
    fontSize: '1.25rem',
    lineHeight: '1.75rem',
    letterSpacing: '-0.01em',
  },
  '2xl': {
    fontSize: '1.5rem',
    lineHeight: '2rem',
    letterSpacing: '-0.02em',
  },
  '3xl': {
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
    letterSpacing: '-0.02em',
  },
  '4xl': {
    fontSize: '2.25rem',
    lineHeight: '2.5rem',
    letterSpacing: '-0.03em',
  },
  '5xl': {
    fontSize: '3rem',
    lineHeight: '1',
    letterSpacing: '-0.03em',
  },
  '6xl': {
    fontSize: '3.75rem',
    lineHeight: '1',
    letterSpacing: '-0.04em',
  },
  '7xl': {
    fontSize: '4.5rem',
    lineHeight: '1',
    letterSpacing: '-0.04em',
  },
  '8xl': {
    fontSize: '6rem',
    lineHeight: '1',
    letterSpacing: '-0.05em',
  },
  '9xl': {
    fontSize: '8rem',
    lineHeight: '1',
    letterSpacing: '-0.05em',
  },
} as const;

// Styles typographiques prédéfinis
export const textStyles = {
  // Headings
  'heading-1': {
    fontFamily: fontFamilies.display.join(', '),
    fontSize: fontSizes['4xl'].fontSize,
    lineHeight: fontSizes['4xl'].lineHeight,
    letterSpacing: fontSizes['4xl'].letterSpacing,
    fontWeight: fontWeights.bold,
  },
  'heading-2': {
    fontFamily: fontFamilies.display.join(', '),
    fontSize: fontSizes['3xl'].fontSize,
    lineHeight: fontSizes['3xl'].lineHeight,
    letterSpacing: fontSizes['3xl'].letterSpacing,
    fontWeight: fontWeights.semibold,
  },
  'heading-3': {
    fontFamily: fontFamilies.display.join(', '),
    fontSize: fontSizes['2xl'].fontSize,
    lineHeight: fontSizes['2xl'].lineHeight,
    letterSpacing: fontSizes['2xl'].letterSpacing,
    fontWeight: fontWeights.semibold,
  },
  'heading-4': {
    fontFamily: fontFamilies.display.join(', '),
    fontSize: fontSizes.xl.fontSize,
    lineHeight: fontSizes.xl.lineHeight,
    letterSpacing: fontSizes.xl.letterSpacing,
    fontWeight: fontWeights.semibold,
  },
  'heading-5': {
    fontFamily: fontFamilies.display.join(', '),
    fontSize: fontSizes.lg.fontSize,
    lineHeight: fontSizes.lg.lineHeight,
    letterSpacing: fontSizes.lg.letterSpacing,
    fontWeight: fontWeights.semibold,
  },
  'heading-6': {
    fontFamily: fontFamilies.display.join(', '),
    fontSize: fontSizes.base.fontSize,
    lineHeight: fontSizes.base.lineHeight,
    letterSpacing: fontSizes.base.letterSpacing,
    fontWeight: fontWeights.semibold,
  },

  // Body text
  'body-large': {
    fontFamily: fontFamilies.body.join(', '),
    fontSize: fontSizes.lg.fontSize,
    lineHeight: fontSizes.lg.lineHeight,
    letterSpacing: fontSizes.lg.letterSpacing,
    fontWeight: fontWeights.normal,
  },
  'body-base': {
    fontFamily: fontFamilies.body.join(', '),
    fontSize: fontSizes.base.fontSize,
    lineHeight: fontSizes.base.lineHeight,
    letterSpacing: fontSizes.base.letterSpacing,
    fontWeight: fontWeights.normal,
  },
  'body-small': {
    fontFamily: fontFamilies.body.join(', '),
    fontSize: fontSizes.sm.fontSize,
    lineHeight: fontSizes.sm.lineHeight,
    letterSpacing: fontSizes.sm.letterSpacing,
    fontWeight: fontWeights.normal,
  },

  // Labels et UI
  'label-large': {
    fontFamily: fontFamilies.body.join(', '),
    fontSize: fontSizes.base.fontSize,
    lineHeight: fontSizes.base.lineHeight,
    letterSpacing: fontSizes.base.letterSpacing,
    fontWeight: fontWeights.medium,
  },
  'label-medium': {
    fontFamily: fontFamilies.body.join(', '),
    fontSize: fontSizes.sm.fontSize,
    lineHeight: fontSizes.sm.lineHeight,
    letterSpacing: fontSizes.sm.letterSpacing,
    fontWeight: fontWeights.medium,
  },
  'label-small': {
    fontFamily: fontFamilies.body.join(', '),
    fontSize: fontSizes.xs.fontSize,
    lineHeight: fontSizes.xs.lineHeight,
    letterSpacing: fontSizes.xs.letterSpacing,
    fontWeight: fontWeights.medium,
  },

  // Code et mono
  'code-large': {
    fontFamily: fontFamilies.mono.join(', '),
    fontSize: fontSizes.base.fontSize,
    lineHeight: fontSizes.base.lineHeight,
    letterSpacing: '0em',
    fontWeight: fontWeights.normal,
  },
  'code-small': {
    fontFamily: fontFamilies.mono.join(', '),
    fontSize: fontSizes.sm.fontSize,
    lineHeight: fontSizes.sm.lineHeight,
    letterSpacing: '0em',
    fontWeight: fontWeights.normal,
  },

  // Caption et meta
  caption: {
    fontFamily: fontFamilies.body.join(', '),
    fontSize: fontSizes.xs.fontSize,
    lineHeight: fontSizes.xs.lineHeight,
    letterSpacing: fontSizes.xs.letterSpacing,
    fontWeight: fontWeights.normal,
  },
  overline: {
    fontFamily: fontFamilies.body.join(', '),
    fontSize: fontSizes.xs.fontSize,
    lineHeight: fontSizes.xs.lineHeight,
    letterSpacing: '0.1em',
    fontWeight: fontWeights.semibold,
    textTransform: 'uppercase' as const,
  },
} as const;

// Line heights séparés pour flexibilité
export const lineHeights = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

// Letter spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// Types TypeScript
export type FontFamily = keyof typeof fontFamilies;
export type FontWeight = keyof typeof fontWeights;
export type FontSize = keyof typeof fontSizes;
export type TextStyle = keyof typeof textStyles;
export type LineHeight = keyof typeof lineHeights;
export type LetterSpacing = keyof typeof letterSpacing;

// Utilitaires
export const getTextStyle = (style: TextStyle) => textStyles[style];
export const getFontSize = (size: FontSize) => fontSizes[size];

// Variables CSS pour integration avec Tailwind
export const typographyVariables = {
  // Font families
  '--font-display': fontFamilies.display.join(', '),
  '--font-body': fontFamilies.body.join(', '),
  '--font-mono': fontFamilies.mono.join(', '),
  
  // Font weights
  ...Object.entries(fontWeights).reduce((acc, [key, value]) => {
    acc[`--font-weight-${key}`] = value.toString();
    return acc;
  }, {} as Record<string, string>),
  
  // Font sizes
  ...Object.entries(fontSizes).reduce((acc, [key, value]) => {
    acc[`--font-size-${key}`] = value.fontSize;
    acc[`--line-height-${key}`] = value.lineHeight;
    acc[`--letter-spacing-${key}`] = value.letterSpacing;
    return acc;
  }, {} as Record<string, string>),
} as const;

export default {
  fontFamilies,
  fontWeights,
  fontSizes,
  textStyles,
  lineHeights,
  letterSpacing,
  typographyVariables,
};