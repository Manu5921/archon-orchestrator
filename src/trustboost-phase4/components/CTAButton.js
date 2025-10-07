// TrustBoost Phase 4 - CTA Button Component
// Agent 4: Business & Commercial Engineer
// Optimisé pour conversion avec tracking

import Link from 'next/link';
import { useState } from 'react';

/**
 * CTA Button optimisé pour conversion
 * Loading states, tracking analytics, variants
 */
export default function CTAButton({
  href,
  onClick,
  children,
  className = '',
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  trackingLabel,
  ...props
}) {
  const [isClicked, setIsClicked] = useState(false);

  // Variants de style
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg',
    secondary: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50',
    ghost: 'text-blue-600 hover:bg-blue-50',
    success: 'bg-green-600 text-white hover:bg-green-700',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  // Tailles
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  // Classes CSS finales
  const buttonClasses = `
    inline-flex items-center justify-center
    font-semibold rounded-lg
    transition-all duration-200
    transform hover:-translate-y-0.5
    focus:outline-none focus:ring-4 focus:ring-blue-300
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  // Gestionnaire de clic avec analytics
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }

    setIsClicked(true);

    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cta_button_click', {
        event_category: 'Conversion',
        event_label: trackingLabel || href || 'CTA Button',
        button_text: typeof children === 'string' ? children : 'CTA',
        button_variant: variant,
        page_location: window.location.href
      });
    }

    // Callback personnalisé
    if (onClick) {
      onClick(e);
    }

    // Reset clicked state après animation
    setTimeout(() => setIsClicked(false), 300);
  };

  // Loading spinner
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Si c'est un lien
  if (href && !disabled && !loading) {
    return (
      <Link
        href={href}
        className={buttonClasses}
        onClick={handleClick}
        {...props}
      >
        {loading && <LoadingSpinner />}
        <span className={isClicked ? 'scale-95' : ''}>{children}</span>
      </Link>
    );
  }

  // Si c'est un bouton
  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner />}
      <span className={isClicked ? 'scale-95' : ''}>{children}</span>
    </button>
  );
}

/**
 * Variantes pré-configurées pour cas d'usage fréquents
 */
export const PrimaryCTA = (props) => (
  <CTAButton variant="primary" {...props} />
);

export const SecondaryCTA = (props) => (
  <CTAButton variant="secondary" {...props} />
);

export const FreeTrial = (props) => (
  <CTAButton 
    variant="primary" 
    trackingLabel="Free Trial CTA"
    {...props}
  >
    {props.children || "Essai gratuit 7 jours"}
  </CTAButton>
);

export const GetStarted = (props) => (
  <CTAButton 
    variant="primary" 
    trackingLabel="Get Started CTA"
    {...props}
  >
    {props.children || "Commencer maintenant"}
  </CTAButton>
);

export const LearnMore = (props) => (
  <CTAButton 
    variant="outline" 
    trackingLabel="Learn More CTA"
    {...props}
  >
    {props.children || "En savoir plus"}
  </CTAButton>
);

export const ContactSales = (props) => (
  <CTAButton 
    variant="secondary" 
    trackingLabel="Contact Sales CTA"
    {...props}
  >
    {props.children || "Contacter l'équipe commerciale"}
  </CTAButton>
);

export const BookDemo = (props) => (
  <CTAButton 
    variant="outline" 
    trackingLabel="Book Demo CTA"
    {...props}
  >
    {props.children || "Réserver une démo"}
  </CTAButton>
);