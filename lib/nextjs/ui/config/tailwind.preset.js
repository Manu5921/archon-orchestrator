/**
 * Tailwind CSS Preset - Archon UI Library
 *
 * Maps design-tokens.json to Tailwind configuration.
 * Usage: import this preset in your project's tailwind.config.js
 *
 * @example
 * // tailwind.config.js
 * import uiPreset from '@/lib/nextjs/ui/config/tailwind.preset.js'
 *
 * export default {
 *   presets: [uiPreset],
 *   content: ['./src/**\/*.{js,ts,jsx,tsx}']
 * }
 */

import tokens from './design-tokens.json' assert { type: 'json' };

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        primary: tokens.colors.primary,
        secondary: tokens.colors.secondary,
        accent: tokens.colors.accent,
        neutral: tokens.colors.neutral,
        destructive: tokens.colors.destructive,
        success: tokens.colors.success,
        warning: tokens.colors.warning,
        info: tokens.colors.info,
      },
      fontFamily: {
        heading: tokens.typography.fontFamily.heading,
        body: tokens.typography.fontFamily.body,
        mono: tokens.typography.fontFamily.mono,
      },
      fontSize: tokens.typography.fontSize,
      fontWeight: tokens.typography.fontWeight,
      lineHeight: tokens.typography.lineHeight,
      spacing: tokens.spacing,
      borderRadius: tokens.borderRadius,
      boxShadow: {
        ...tokens.shadows,
      },
      transitionDuration: tokens.transitions.duration,
      transitionTimingFunction: tokens.transitions.easing,
    },
  },
  plugins: [],
};
