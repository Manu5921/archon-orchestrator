/**
 * TrustBoost Button - Tests d'Accessibilité
 * Tests spécifiques WCAG AA pour le composant Button
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from '../../test-setup-a11y';
import { accessibilityTestHelper } from '../../test-setup-a11y';
import { Button } from './Button';
import { StarIcon } from '@radix-ui/react-icons';

describe('Button - Accessibilité WCAG AA', () => {
  
  describe('Tests axe-core automatiques', () => {
    it('ne devrait avoir aucune violation d\'accessibilité - variant primary', async () => {
      const { container } = render(<Button>Primary Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('ne devrait avoir aucune violation d\'accessibilité - tous les variants', async () => {
      const { container } = render(
        <div>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('ne devrait avoir aucune violation - états spéciaux', async () => {
      const { container } = render(
        <div>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button leftIcon={<StarIcon />}>With Icon</Button>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Navigation clavier', () => {
    it('devrait être focusable avec Tab', async () => {
      const user = userEvent.setup();
      render(<Button>Test Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Test Button' });
      
      // Le bouton ne devrait pas être focusé initialement
      expect(button).not.toHaveFocus();
      
      // Tab pour naviguer vers le bouton
      await user.tab();
      expect(button).toHaveFocus();
    });

    it('devrait être activable avec Entrée et Espace', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Test Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Test Button' });
      button.focus();
      
      // Test avec Entrée
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      // Test avec Espace
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    it('ne devrait pas être activable quand désactivé', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
      
      const button = screen.getByRole('button', { name: 'Disabled Button' });
      button.focus();
      
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('devrait naviguer correctement dans une séquence de boutons', async () => {
      const { container } = render(
        <div>
          <Button>First</Button>
          <Button>Second</Button>
          <Button>Third</Button>
        </div>
      );
      
      await accessibilityTestHelper.simulateKeyboardNavigation(container);
      
      // Vérifie que tous les boutons sont focusables
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('tabindex', '0');
      });
    });
  });

  describe('États ARIA', () => {
    it('devrait avoir les attributs ARIA corrects - état normal', () => {
      render(<Button>Normal Button</Button>);
      const button = screen.getByRole('button', { name: 'Normal Button' });
      
      const ariaAttributes = accessibilityTestHelper.checkAriaAttributes(button);
      
      expect(button).toHaveAttribute('type', 'button');
      expect(button).not.toHaveAttribute('aria-disabled');
      expect(button).not.toHaveAttribute('aria-busy');
    });

    it('devrait avoir les attributs ARIA corrects - état désactivé', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button', { name: 'Disabled Button' });
      
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toBeDisabled();
    });

    it('devrait avoir les attributs ARIA corrects - état loading', () => {
      render(<Button loading>Loading Button</Button>);
      const button = screen.getByRole('button', { name: 'Loading Button' });
      
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('devrait avoir un label accessible avec aria-label', () => {
      render(
        <Button aria-label="Fermer la modal" leftIcon={<StarIcon />}>
          ×
        </Button>
      );
      
      const button = screen.getByRole('button', { name: 'Fermer la modal' });
      expect(button).toBeInTheDocument();
    });

    it('devrait associer correctement aria-describedby', () => {
      render(
        <div>
          <Button aria-describedby="button-help">Action</Button>
          <div id="button-help">Cette action est irréversible</div>
        </div>
      );
      
      const button = screen.getByRole('button', { name: 'Action' });
      expect(button).toHaveAttribute('aria-describedby', 'button-help');
      
      const description = screen.getByText('Cette action est irréversible');
      expect(description).toHaveAttribute('id', 'button-help');
    });
  });

  describe('Tailles tactiles (Touch Targets)', () => {
    it('devrait respecter la taille minimum de 44px - small', () => {
      render(<Button size="sm">Small Button</Button>);
      const button = screen.getByRole('button', { name: 'Small Button' });
      
      const touchTarget = accessibilityTestHelper.checkTouchTargetSize(button);
      expect(touchTarget.meetsMinimum).toBe(true);
    });

    it('devrait respecter la taille minimum de 44px - tous les sizes', () => {
      render(
        <div>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      );
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        const touchTarget = accessibilityTestHelper.checkTouchTargetSize(button);
        expect(touchTarget.meetsMinimum).toBe(true);
      });
    });

    it('devrait maintenir la taille minimum avec des icônes', () => {
      render(
        <Button size="sm" leftIcon={<StarIcon />}>
          With Icon
        </Button>
      );
      
      const button = screen.getByRole('button', { name: 'With Icon' });
      const touchTarget = accessibilityTestHelper.checkTouchTargetSize(button);
      expect(touchTarget.meetsMinimum).toBe(true);
    });
  });

  describe('Contrastes de couleurs', () => {
    it('devrait avoir un contraste suffisant - variant primary', () => {
      render(<Button variant="primary">Primary Button</Button>);
      const button = screen.getByRole('button', { name: 'Primary Button' });
      
      const contrast = accessibilityTestHelper.checkColorContrast(button);
      expect(contrast.hasGoodContrast).toBe(true);
    });

    it('devrait maintenir le contraste sur tous les variants', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;
      
      variants.forEach(variant => {
        const { unmount } = render(<Button variant={variant}>{variant} Button</Button>);
        const button = screen.getByRole('button', { name: `${variant} Button` });
        
        const contrast = accessibilityTestHelper.checkColorContrast(button);
        expect(contrast.hasGoodContrast).toBe(true);
        
        unmount();
      });
    });
  });

  describe('Support des technologies assistives', () => {
    it('devrait annoncer correctement l\'état de chargement', () => {
      render(<Button loading>Saving...</Button>);
      const button = screen.getByRole('button', { name: 'Saving...' });
      
      // Le spinner devrait avoir un label accessible
      const spinner = button.querySelector('svg');
      expect(spinner).toHaveAttribute('role', 'img');
      expect(spinner).toHaveAttribute('aria-label', 'Chargement...');
    });

    it('devrait masquer les icônes décoratives aux lecteurs d\'écran', () => {
      render(
        <Button leftIcon={<StarIcon />} rightIcon={<StarIcon />}>
          Button with icons
        </Button>
      );
      
      const button = screen.getByRole('button', { name: 'Button with icons' });
      const icons = button.querySelectorAll('span[aria-hidden="true"]');
      
      expect(icons).toHaveLength(2); // leftIcon et rightIcon
    });

    it('devrait être correctement identifié par les lecteurs d\'écran', () => {
      render(<Button role="button">Custom Button</Button>);
      const button = screen.getByRole('button', { name: 'Custom Button' });
      
      expect(button.tagName.toLowerCase()).toBe('button');
      expect(button).toHaveAttribute('role', 'button');
    });
  });

  describe('Gestion du focus', () => {
    it('devrait avoir un indicateur de focus visible', () => {
      render(<Button>Focus Test</Button>);
      const button = screen.getByRole('button', { name: 'Focus Test' });
      
      // Le focus ring est géré par CSS, vérifier que les classes sont présentes
      expect(button).toHaveClass('focus-visible:outline-none');
      expect(button).toHaveClass('focus-visible:ring-2');
    });

    it('ne devrait pas perdre le focus lors du loading', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Button>Click me</Button>);
      
      const button = screen.getByRole('button', { name: 'Click me' });
      button.focus();
      expect(button).toHaveFocus();
      
      // Rerender avec loading
      rerender(<Button loading>Loading...</Button>);
      
      const loadingButton = screen.getByRole('button', { name: 'Loading...' });
      // Le focus devrait être maintenu même si le bouton est désactivé
      expect(loadingButton).toHaveFocus();
    });
  });
});