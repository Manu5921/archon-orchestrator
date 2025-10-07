// TrustBoost - Composant CheckoutButton
// AGENT BUSINESS - Bouton Stripe Checkout réutilisable
// Context7 Pattern: /stripe/stripe-js + React hooks + error handling

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Types
interface CheckoutButtonProps {
  priceId: string;
  planName: string;
  billingCycle?: 'monthly' | 'yearly';
  customerEmail?: string;
  customerData?: Record<string, any>;
  successUrl?: string;
  cancelUrl?: string;
  trialDays?: number;
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loadingText?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onClick?: () => void;
}

// Configuration Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/**
 * Composant CheckoutButton - Bouton Stripe Checkout
 * OBJECTIF: UX optimisée + gestion erreurs + analytics
 * USAGE: CTA pricing, pop-ups, call-to-actions
 */
export default function CheckoutButton({
  priceId,
  planName,
  billingCycle = 'monthly',
  customerEmail = '',
  customerData = {},
  successUrl,
  cancelUrl,
  trialDays = 7,
  className = '',
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loadingText = 'Création...',
  onSuccess,
  onError,
  onClick
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Styles variants
  const getVariantStyles = () => {
    const baseStyles = 'font-bold transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200 shadow-md hover:shadow-lg`;
      case 'secondary':
        return `${baseStyles} bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-200 shadow-md hover:shadow-lg`;
      case 'outline':
        return `${baseStyles} border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-200`;
      case 'gradient':
        return `${baseStyles} bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-200 shadow-lg hover:shadow-xl`;
      default:
        return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200`;
    }
  };

  // Styles tailles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm rounded-lg';
      case 'md':
        return 'px-6 py-3 text-base rounded-xl';
      case 'lg':
        return 'px-8 py-4 text-lg rounded-xl';
      case 'xl':
        return 'px-10 py-5 text-xl rounded-2xl';
      default:
        return 'px-6 py-3 text-base rounded-xl';
    }
  };

  // Gestion du clic checkout
  const handleCheckout = async () => {
    // Callback onClick si fourni
    if (onClick) {
      onClick();
    }

    // Validation email
    if (!customerEmail.trim()) {
      const error = new Error('Email client requis pour commencer l\\'essai');
      if (onError) {
        onError(error);
      } else {
        alert(error.message);
      }
      return;
    }

    // Validation priceId
    if (!priceId) {
      const error = new Error('Price ID manquant');
      if (onError) {
        onError(error);
      } else {
        console.error('❌ CheckoutButton: priceId manquant');
      }
      return;
    }

    setIsLoading(true);

    try {
      // Analytics tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'checkout_button_clicked', {
          event_category: 'Stripe Checkout',
          event_label: planName,
          custom_parameter_1: billingCycle,
          custom_parameter_2: priceId
        });
      }

      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe n\\'a pas pu se charger. Veuillez réessayer.');
      }

      // Construction URLs avec fallbacks
      const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_SITE_URL || '';
      
      const finalSuccessUrl = successUrl || `${baseUrl}/onboarding/success?plan=${planName}`;
      const finalCancelUrl = cancelUrl || (typeof window !== 'undefined' ? window.location.href : `${baseUrl}/pricing`);

      // Appel API création session Stripe
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planName,
          billingCycle,
          customerEmail: customerEmail.trim(),
          customerData: {
            ...customerData,
            source: 'checkout_button_component',
            button_variant: variant,
            button_size: size
          },
          successUrl: finalSuccessUrl,
          cancelUrl: finalCancelUrl,
          trialDays,
          allowPromotionCodes: true
        }),
      });

      const sessionData = await response.json();

      if (!sessionData.success) {
        throw new Error(sessionData.error || 'Erreur lors de la création de la session');
      }

      // Analytics - session créée
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'checkout_session_created', {
          event_category: 'Stripe Checkout',
          event_label: planName,
          value: sessionData.checkout_details?.trial_days || 0
        });
      }

      console.log('✅ Session Stripe créée:', {
        sessionId: sessionData.session.id,
        planName,
        trialDays: sessionData.checkout_details?.trial_days
      });

      // Redirect vers Stripe Checkout
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: sessionData.session.id,
      });

      if (stripeError) {
        throw stripeError;
      }

      // Callback succès (ne sera pas appelé car redirect)
      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      console.error('❌ Erreur CheckoutButton:', {
        error: errorMessage,
        priceId,
        planName,
        customerEmail: customerEmail || 'missing'
      });

      // Analytics - erreur
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'checkout_error', {
          event_category: 'Stripe Checkout',
          event_label: errorMessage,
          custom_parameter_1: planName
        });
      }

      // Callback erreur
      if (onError) {
        onError(error instanceof Error ? error : new Error(errorMessage));
      } else {
        alert(`Erreur: ${errorMessage}. Veuillez réessayer.`);
      }

    } finally {
      setIsLoading(false);
    }
  };

  const buttonStyles = `${getVariantStyles()} ${getSizeStyles()} ${className}`;
  const isDisabled = disabled || isLoading || !priceId;

  return (
    <button
      onClick={handleCheckout}
      disabled={isDisabled}
      className={buttonStyles}
      type=\"button\"
      aria-label={`Commencer l'essai gratuit ${trialDays} jours - ${planName}`}
    >
      {isLoading ? (
        <span className=\"flex items-center justify-center gap-2\">
          <svg 
            className=\"animate-spin h-5 w-5\" 
            viewBox=\"0 0 24 24\"
            fill=\"none\"
          >
            <circle 
              cx=\"12\" 
              cy=\"12\" 
              r=\"10\" 
              stroke=\"currentColor\" 
              strokeWidth=\"4\" 
              className=\"opacity-25\"
            />
            <path 
              fill=\"currentColor\" 
              d=\"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z\" 
              className=\"opacity-75\"
            />
          </svg>
          {loadingText}
        </span>
      ) : (
        children || `🚀 Essai gratuit ${trialDays} jours`
      )}
    </button>
  );
}

/**
 * Hook personnalisé pour gestion état checkout
 * Utile pour intégrations avancées
 */
export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startCheckout = async (params: {
    priceId: string;
    planName: string;
    customerEmail: string;
    billingCycle?: 'monthly' | 'yearly';
    customerData?: Record<string, any>;
    successUrl?: string;
    cancelUrl?: string;
    trialDays?: number;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe not loaded');
      }

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const sessionData = await response.json();

      if (!sessionData.success) {
        throw new Error(sessionData.error);
      }

      await stripe.redirectToCheckout({
        sessionId: sessionData.session.id,
      });

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    startCheckout,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}