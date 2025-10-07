// TrustBoost - Composant SubscriptionStatus
// AGENT BUSINESS - Affichage statut abonnement client
// Context7 Pattern: React hooks + Stripe subscription management

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Types
interface Subscription {
  id: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete';
  plan: {
    id: string;
    nickname: string;
    amount: number;
    currency: string;
    interval: 'month' | 'year';
  };
  dates: {
    current_period_start: Date;
    current_period_end: Date;
    trial_end?: Date;
    canceled_at?: Date;
    cancel_at?: Date;
  };
  trial: {
    is_trial: boolean;
    trial_end?: Date;
    days_remaining: number;
  };
  computed: {
    is_active: boolean;
    needs_payment: boolean;
    will_cancel: boolean;
    is_canceled: boolean;
    access_level: 'full' | 'limited' | 'trial' | 'none';
    days_until_renewal: number;
  };
}

interface Customer {
  id: string;
  email: string;
  name?: string;
}

interface SubscriptionStatusProps {
  customerId?: string;
  customerEmail?: string;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
  onStatusChange?: (subscription: Subscription | null) => void;
}

// Configuration Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/**
 * Composant SubscriptionStatus - Affichage statut abonnement
 * OBJECTIF: Dashboard client + self-service + rétention
 * USAGE: Dashboard, billing pages, account settings
 */
export default function SubscriptionStatus({
  customerId,
  customerEmail,
  showActions = true,
  compact = false,
  className = '',
  onStatusChange
}: SubscriptionStatusProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Chargement des données subscription
  useEffect(() => {
    if (customerId || customerEmail) {
      loadSubscriptionStatus();
    }
  }, [customerId, customerEmail]);

  // Callback when subscription changes
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(subscription);
    }
  }, [subscription, onStatusChange]);

  const loadSubscriptionStatus = async () => {
    if (!customerId && !customerEmail) {
      setError('Customer ID or email required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/stripe/subscription-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          customerEmail
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load subscription');
      }

      setCustomer(data.customer);
      
      // Prendre la première subscription active ou trialing
      const activeSubscription = data.subscriptions.find((sub: any) => 
        ['active', 'trialing'].includes(sub.status)
      ) || data.subscriptions[0];

      if (activeSubscription) {
        // Convertir les dates string en Date objects
        const processedSubscription: Subscription = {
          ...activeSubscription,
          dates: {
            ...activeSubscription.dates,
            current_period_start: new Date(activeSubscription.dates.current_period_start),
            current_period_end: new Date(activeSubscription.dates.current_period_end),
            trial_end: activeSubscription.dates.trial_end ? 
              new Date(activeSubscription.dates.trial_end) : undefined,
            canceled_at: activeSubscription.dates.canceled_at ? 
              new Date(activeSubscription.dates.canceled_at) : undefined,
            cancel_at: activeSubscription.dates.cancel_at ? 
              new Date(activeSubscription.dates.cancel_at) : undefined,
          },
          trial: {
            ...activeSubscription.trial,
            trial_end: activeSubscription.trial.trial_end ? 
              new Date(activeSubscription.trial.trial_end) : undefined,
          }
        };
        
        setSubscription(processedSubscription);
      } else {
        setSubscription(null);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Erreur chargement subscription:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Ouverture customer portal Stripe
  const openCustomerPortal = async () => {
    if (!customer?.id) return;

    setActionLoading('portal');

    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          returnUrl: window.location.href
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      // Redirect vers le portail Stripe
      window.location.href = data.portal.url;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(`Erreur ouverture portail: ${errorMessage}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Helpers pour l'affichage
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'trialing': return 'text-blue-600 bg-blue-100';
      case 'past_due': return 'text-orange-600 bg-orange-100';
      case 'canceled': return 'text-red-600 bg-red-100';
      case 'unpaid': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'trialing': return 'Période d\\'essai';
      case 'past_due': return 'Paiement en retard';
      case 'canceled': return 'Annulé';
      case 'unpaid': return 'Impayé';
      case 'incomplete': return 'Incomplet';
      default: return status;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className={`${compact ? 'p-4' : 'p-6'} bg-white rounded-lg border border-slate-200 ${className}`}>
        <div className=\"animate-pulse\">
          <div className=\"h-4 bg-slate-200 rounded w-1/3 mb-4\"></div>
          <div className=\"h-6 bg-slate-200 rounded w-1/2 mb-2\"></div>
          <div className=\"h-4 bg-slate-200 rounded w-2/3\"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${compact ? 'p-4' : 'p-6'} bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className=\"text-red-700\">
          <span className=\"font-medium\">Erreur:</span> {error}
        </div>
        <button
          onClick={loadSubscriptionStatus}
          className=\"mt-2 text-red-600 hover:text-red-700 text-sm underline\"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className={`${compact ? 'p-4' : 'p-6'} bg-slate-50 border border-slate-200 rounded-lg ${className}`}>
        <div className=\"text-center text-slate-600\">
          <p className=\"mb-2\">Aucun abonnement actif</p>
          <p className=\"text-sm\">Choisissez un plan pour commencer</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'p-4' : 'p-6'} bg-white rounded-lg border border-slate-200 shadow-sm ${className}`}>
      
      {/* Header */}
      <div className=\"flex items-center justify-between mb-4\">
        <div>
          <h3 className=\"text-lg font-semibold text-slate-900\">
            Plan {subscription.plan.nickname}
          </h3>
          {customer && (
            <p className=\"text-sm text-slate-500\">{customer.email}</p>
          )}
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
          {getStatusText(subscription.status)}
        </div>
      </div>

      {/* Price & Billing */}
      <div className=\"mb-4\">
        <div className=\"flex items-baseline gap-1 mb-1\">
          <span className=\"text-2xl font-bold text-slate-900\">
            {subscription.plan.amount}€
          </span>
          <span className=\"text-slate-500\">
            /{subscription.plan.interval === 'month' ? 'mois' : 'an'}
          </span>
        </div>
        
        {/* Trial info */}
        {subscription.trial.is_trial && (
          <div className=\"text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block\">
            Essai gratuit • {subscription.trial.days_remaining} jours restants
          </div>
        )}
      </div>

      {/* Dates importantes */}
      {!compact && (
        <div className=\"space-y-2 mb-4 text-sm text-slate-600\">
          {subscription.trial.is_trial ? (
            <div>
              <span className=\"font-medium\">Fin d\\'essai:</span>{' '}
              {subscription.trial.trial_end && formatDate(subscription.trial.trial_end)}
            </div>
          ) : (
            <div>
              <span className=\"font-medium\">Prochaine facturation:</span>{' '}
              {formatDate(subscription.dates.current_period_end)}
            </div>
          )}

          {subscription.computed.will_cancel && subscription.dates.cancel_at && (
            <div className=\"text-orange-600\">
              <span className=\"font-medium\">Annulation prévue:</span>{' '}
              {formatDate(subscription.dates.cancel_at)}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className=\"flex gap-2\">
          <button
            onClick={openCustomerPortal}
            disabled={actionLoading === 'portal'}
            className=\"flex-1 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50\"
          >
            {actionLoading === 'portal' ? (
              <span className=\"flex items-center justify-center gap-2\">
                <svg className=\"animate-spin h-4 w-4\" viewBox=\"0 0 24 24\">
                  <circle cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" strokeWidth=\"4\" fill=\"none\" className=\"opacity-25\"/>
                  <path fill=\"currentColor\" d=\"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z\" className=\"opacity-75\"/>
                </svg>
                Ouverture...
              </span>
            ) : (
              'Gérer l\\'abonnement'
            )}
          </button>

          <button
            onClick={loadSubscriptionStatus}
            className=\"px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors\"
            title=\"Actualiser\"
          >
            🔄
          </button>
        </div>
      )}

      {/* Messages d'alerte */}
      {subscription.computed.needs_payment && (
        <div className=\"mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md\">
          <div className=\"flex items-center gap-2 text-orange-700\">
            <span>⚠️</span>
            <span className=\"font-medium\">Action requise</span>
          </div>
          <p className=\"text-sm text-orange-600 mt-1\">
            Un problème de paiement empêche le renouvellement de votre abonnement.
          </p>
        </div>
      )}

      {subscription.trial.is_trial && subscription.trial.days_remaining <= 3 && (
        <div className=\"mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md\">
          <div className=\"flex items-center gap-2 text-blue-700\">
            <span>⏰</span>
            <span className=\"font-medium\">Fin d\\'essai proche</span>
          </div>
          <p className=\"text-sm text-blue-600 mt-1\">
            Votre essai se termine dans {subscription.trial.days_remaining} jours. 
            Votre abonnement démarrera automatiquement.
          </p>
        </div>
      )}
    </div>
  );
}