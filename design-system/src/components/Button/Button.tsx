/**
 * TrustBoost Button Component
 * Composant bouton basé sur Radix UI avec les design tokens TrustBoost
 */

import React, { forwardRef } from 'react';
import * as RadixButton from '@radix-ui/react-button';
import { clsx } from 'clsx';
import { getSpacing, getBorderRadius } from '../../tokens';

// Types et interfaces
export interface ButtonProps {
  /** Contenu du bouton */
  children: React.ReactNode;
  /** Variante visuelle du bouton */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** Taille du bouton */
  size?: 'sm' | 'md' | 'lg';
  /** État de chargement */
  loading?: boolean;
  /** Icône à gauche du texte */
  leftIcon?: React.ReactNode;
  /** Icône à droite du texte */
  rightIcon?: React.ReactNode;
  /** Bouton en pleine largeur */
  fullWidth?: boolean;
  /** Fonction appelée au clic */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Désactiver le bouton */
  disabled?: boolean;
  /** Type de bouton HTML */
  type?: 'button' | 'submit' | 'reset';
  /** Classes CSS additionnelles */
  className?: string;
  /** Props HTML natives */
  [key: string]: any;
}

// Variants styles basés sur les design tokens TrustBoost
const buttonVariants = {
  primary: [
    // Base styles
    'bg-primary-500 text-white border-primary-500',
    // Hover states
    'hover:bg-primary-600 hover:border-primary-600',
    // Focus states (accessibilité WCAG AA)
    'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    // Active states
    'active:bg-primary-700 active:scale-95',
    // Shadow
    'shadow-md hover:shadow-lg',
  ],
  secondary: [
    'bg-neutral-100 text-neutral-900 border-neutral-300',
    'hover:bg-neutral-200 hover:border-neutral-400',
    'focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2',
    'active:bg-neutral-300 active:scale-95',
  ],
  outline: [
    'bg-transparent text-primary-600 border-primary-500',
    'hover:bg-primary-50 hover:text-primary-700',
    'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
    'active:bg-primary-100 active:scale-95',
  ],
  ghost: [
    'bg-transparent text-neutral-600 border-transparent',
    'hover:bg-neutral-100 hover:text-neutral-900',
    'focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2',
    'active:bg-neutral-200 active:scale-95',
  ],
  danger: [
    'bg-error-500 text-white border-error-500',
    'hover:bg-error-600 hover:border-error-600',
    'focus-visible:ring-2 focus-visible:ring-error-500 focus-visible:ring-offset-2',
    'active:bg-error-700 active:scale-95',
    'shadow-md hover:shadow-lg',
  ],
};

const buttonSizes = {
  sm: [
    'h-8 px-3 text-sm',
    'gap-1.5',
    'rounded-md',
  ],
  md: [
    'h-10 px-4 text-base',
    'gap-2',
    'rounded-lg',
  ],
  lg: [
    'h-12 px-6 text-lg',
    'gap-2.5',
    'rounded-lg',
  ],
};

// Composant Spinner pour l'état loading
const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const spinnerSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <svg
      className={clsx('animate-spin', spinnerSizes[size])}
      fill="none"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Chargement..."
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Composant Button principal
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled = false,
      type = 'button',
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    // Classes de base communes
    const baseClasses = [
      // Layout et positioning
      'inline-flex items-center justify-center',
      'relative',
      'font-semibold',
      'border',
      'cursor-pointer',
      // Transitions fluides - Pattern Context7
      'transition-all duration-200 ease-snappy',
      // Focus management pour accessibilité
      'focus-visible:outline-none',
      // États désactivés
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      // Pleine largeur conditionnelle
      fullWidth && 'w-full',
    ];

    // Combiner toutes les classes
    const buttonClasses = clsx(
      baseClasses,
      buttonVariants[variant],
      buttonSizes[size],
      className
    );

    // Gestion des événements
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    return (
      <RadixButton.Root
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        type={type}
        onClick={handleClick}
        // Attributs d'accessibilité
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {/* Icône gauche ou spinner de chargement */}
        {loading ? (
          <Spinner size={size} />
        ) : leftIcon ? (
          <span className="flex items-center" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}

        {/* Contenu principal */}
        {typeof children === 'string' ? (
          <span className={loading ? 'opacity-70' : undefined}>
            {children}
          </span>
        ) : (
          children
        )}

        {/* Icône droite (seulement si pas de loading) */}
        {!loading && rightIcon && (
          <span className="flex items-center" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </RadixButton.Root>
    );
  }
);

Button.displayName = 'TrustBoost.Button';

export default Button;