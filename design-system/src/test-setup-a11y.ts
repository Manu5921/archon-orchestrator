/**
 * Test Setup - Configuration spécialisée pour les tests d'accessibilité
 */

import '@testing-library/jest-dom';
import { configureAxe } from 'jest-axe';

// Configuration axe-core pour les tests d'accessibilité
const axe = configureAxe({
  rules: {
    // Rules WCAG AA obligatoires
    'color-contrast': { enabled: true },
    'focus-order-semantics': { enabled: true },
    'keyboard': { enabled: true },
    'landmark-one-main': { enabled: true },
    'page-has-heading-one': { enabled: false }, // Pas applicable aux composants isolés
    'region': { enabled: true },
    
    // Rules spécifiques TrustBoost
    'button-name': { enabled: true },
    'link-name': { enabled: true },
    'form-field-multiple-labels': { enabled: true },
    'label': { enabled: true },
    'aria-hidden-focus': { enabled: true },
    'aria-input-field-name': { enabled: true },
    'aria-required-attr': { enabled: true },
    'aria-valid-attr': { enabled: true },
    'aria-valid-attr-value': { enabled: true },
    
    // Touch targets (mobile)
    'target-size': { enabled: true },
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
});

export default axe;

// Helper pour les tests d'accessibilité avancés
export const accessibilityTestHelper = {
  // Simule la navigation clavier
  simulateKeyboardNavigation: async (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // Simule Tab sur chaque élément
    for (const element of focusableElements) {
      (element as HTMLElement).focus();
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  },
  
  // Vérifie les attributs ARIA
  checkAriaAttributes: (element: HTMLElement) => {
    const ariaAttributes = {
      hasAriaLabel: element.hasAttribute('aria-label'),
      hasAriaLabelledBy: element.hasAttribute('aria-labelledby'),
      hasAriaDescribedBy: element.hasAttribute('aria-describedby'),
      ariaRole: element.getAttribute('role'),
      ariaExpanded: element.getAttribute('aria-expanded'),
      ariaDisabled: element.getAttribute('aria-disabled'),
      ariaPressed: element.getAttribute('aria-pressed'),
    };
    
    return ariaAttributes;
  },
  
  // Vérifie les contrastes (approximatif)
  checkColorContrast: (element: HTMLElement) => {
    const styles = window.getComputedStyle(element);
    const backgroundColor = styles.backgroundColor;
    const color = styles.color;
    
    // Retourne les couleurs pour analyse manuelle ou avec des outils spécialisés
    return {
      backgroundColor,
      color,
      // Dans un vrai projet, utiliser une lib comme 'color-contrast-checker'
      hasGoodContrast: true, // Placeholder
    };
  },
  
  // Vérifie les tailles tactiles
  checkTouchTargetSize: (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const minSize = 44; // iOS/Android guidelines
    
    return {
      width: rect.width,
      height: rect.height,
      meetsMinimum: rect.width >= minSize && rect.height >= minSize,
    };
  },
};