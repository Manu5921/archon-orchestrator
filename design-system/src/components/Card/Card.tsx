/**
 * TrustBoost Card Component
 * Composant carte polyvalent basé sur les design tokens TrustBoost
 */

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

// Types et interfaces
export interface CardProps {
  /** Contenu de la carte */
  children: React.ReactNode;
  /** Variante visuelle de la carte */
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  /** Taille de la carte */
  size?: 'sm' | 'md' | 'lg';
  /** Carte interactive (hover effects) */
  interactive?: boolean;
  /** Padding personnalisé */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Classes CSS additionnelles */
  className?: string;
  /** Fonction appelée au clic (si interactive) */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Props HTML natives */
  [key: string]: any;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

// Variants styles basés sur les design tokens TrustBoost
const cardVariants = {
  default: [
    'bg-white',
    'border border-neutral-200',
    'shadow-sm',
  ],
  elevated: [
    'bg-white',
    'border border-neutral-200',
    'shadow-lg',
  ],
  outlined: [
    'bg-white',
    'border-2 border-neutral-300',
    'shadow-none',
  ],
  ghost: [
    'bg-neutral-50',
    'border border-transparent',
    'shadow-none',
  ],
};

const cardSizes = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
};

const cardPadding = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const interactiveStyles = [
  'cursor-pointer',
  'transition-all duration-200 ease-snappy',
  'hover:shadow-md',
  'hover:border-primary-300',
  'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
  'active:scale-[0.98]',
];

// Composant Card principal
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      interactive = false,
      padding = 'md',
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    // Classes de base
    const baseClasses = [
      'relative',
      'overflow-hidden',
    ];

    // Combiner toutes les classes
    const cardClasses = clsx(
      baseClasses,
      cardVariants[variant],
      cardSizes[size],
      cardPadding[padding],
      interactive && interactiveStyles,
      className
    );

    // Gestion des événements
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive) return;
      onClick?.(event);
    };

    // Gestion du clavier pour l'accessibilité
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!interactive) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick?.(event as any);
      }
    };

    return (
      <div
        ref={ref}
        className={cardClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        // Attributs d'accessibilité pour les cartes interactives
        {...(interactive && {
          role: 'button',
          tabIndex: 0,
          'aria-pressed': false,
        })}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'TrustBoost.Card';

// Composants de structure pour la carte
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'flex flex-col space-y-1.5',
        'pb-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'TrustBoost.CardHeader';

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(className)}
      {...props}
    >
      {children}
    </div>
  )
);

CardContent.displayName = 'TrustBoost.CardContent';

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'flex items-center',
        'pt-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'TrustBoost.CardFooter';

// Composant titre pour le header
export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className, as: Component = 'h3', ...props }, ref) => (
    <Component
      ref={ref}
      className={clsx(
        'text-lg font-semibold text-neutral-900',
        'leading-none tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
);

CardTitle.displayName = 'TrustBoost.CardTitle';

// Composant description pour le header
export interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className, ...props }, ref) => (
    <p
      ref={ref}
      className={clsx(
        'text-sm text-neutral-600',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'TrustBoost.CardDescription';

export default Card;