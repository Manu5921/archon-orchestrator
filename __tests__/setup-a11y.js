/**
 * Jest Setup for Accessibility Testing
 * Configuration pour tests d'accessibilité avec axe-core
 */

import '@testing-library/jest-dom';

// Jest-axe setup will be handled in individual test files
// This setup focuses on global configuration and helpers

// Default axe configuration that will be used by tests
const defaultAxeConfig = {
  rules: {
    // WCAG AA compliance rules
    'color-contrast': { enabled: true },
    'focus-order-semantics': { enabled: true },
    'keyboard': { enabled: true },
    'landmark-one-main': { enabled: true },
    'page-has-heading-one': { enabled: false }, // Pas applicable aux composants isolés
    'region': { enabled: true },
    
    // Form and input rules
    'button-name': { enabled: true },
    'link-name': { enabled: true },
    'form-field-multiple-labels': { enabled: true },
    'label': { enabled: true },
    
    // ARIA rules
    'aria-hidden-focus': { enabled: true },
    'aria-input-field-name': { enabled: true },
    'aria-required-attr': { enabled: true },
    'aria-valid-attr': { enabled: true },
    'aria-valid-attr-value': { enabled: true },
    
    // Touch targets for mobile
    'target-size': { enabled: true },
  },
  tags: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'],
};

// Export configuration for use in tests
global.defaultAxeConfig = defaultAxeConfig;

// Mock des APIs navigateur pour les tests
if (typeof window !== 'undefined') {
  // Mock getComputedStyle pour les tests de contraste
  if (!window.getComputedStyle) {
    window.getComputedStyle = jest.fn(() => ({
      backgroundColor: 'rgb(255, 255, 255)',
      color: 'rgb(0, 0, 0)',
    }));
  }
  
  // Mock getBoundingClientRect pour les tests de taille tactile
  if (!Element.prototype.getBoundingClientRect) {
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 44,
      height: 44,
      top: 0,
      left: 0,
      bottom: 44,
      right: 44,
    }));
  }
}

// Helpers globaux pour les tests d'accessibilité
global.accessibilityHelpers = {
  // Simule la navigation clavier
  simulateKeyboardNavigation: async (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    for (const element of focusableElements) {
      element.focus();
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  },
  
  // Vérifie les attributs ARIA
  checkAriaAttributes: (element) => ({
    hasAriaLabel: element.hasAttribute('aria-label'),
    hasAriaLabelledBy: element.hasAttribute('aria-labelledby'),
    hasAriaDescribedBy: element.hasAttribute('aria-describedby'),
    ariaRole: element.getAttribute('role'),
    ariaExpanded: element.getAttribute('aria-expanded'),
    ariaDisabled: element.getAttribute('aria-disabled'),
    ariaPressed: element.getAttribute('aria-pressed'),
  }),
  
  // Vérifie les tailles tactiles
  checkTouchTargetSize: (element) => {
    const rect = element.getBoundingClientRect();
    const minSize = 44; // iOS/Android guidelines
    
    return {
      width: rect.width,
      height: rect.height,
      meetsMinimum: rect.width >= minSize && rect.height >= minSize,
    };
  },
};