// TrustBoost - Composant PricingTable
// AGENT BUSINESS - Composant réutilisable pour affichage pricing
// Context7 Pattern: React + TypeScript + Stripe integration

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Types
interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyPriceId: string;
  yearlyPriceId: string;
  popular: boolean;
  features: string[];
  limitations?: string[];
  targetAudience?: string;
  cta?: string;
}

interface PricingTableProps {
  plans: PricingPlan[];
  billingCycle?: 'monthly' | 'yearly';
  onBillingCycleChange?: (cycle: 'monthly' | 'yearly') => void;
  onPlanSelect?: (plan: PricingPlan) => void;
  customerEmail?: string;
  isLoading?: boolean;
  selectedPlan?: string | null;
  showComparison?: boolean;
  className?: string;
}

// Configuration Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/**
 * Composant PricingTable - Affichage plans tarifaires
 * OBJECTIF: Conversion optimisée + UX moderne
 * USAGE: Page pricing, pop-ups, landing pages
 */
export default function PricingTable({
  plans,
  billingCycle = 'monthly',
  onBillingCycleChange,
  onPlanSelect,
  customerEmail = '',
  isLoading = false,
  selectedPlan = null,
  showComparison = true,
  className = ''
}: PricingTableProps) {
  const [localBillingCycle, setLocalBillingCycle] = useState<'monthly' | 'yearly'>(billingCycle);
  const [localLoading, setLocalLoading] = useState(false);
  const [localSelectedPlan, setLocalSelectedPlan] = useState<string | null>(selectedPlan);

  // Gestion changement cycle de facturation
  const handleBillingCycleChange = (cycle: 'monthly' | 'yearly') => {
    setLocalBillingCycle(cycle);
    if (onBillingCycleChange) {
      onBillingCycleChange(cycle);
    }

    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'billing_cycle_changed', {
        event_category: 'Pricing Interaction',
        event_label: cycle,
        custom_parameter_1: 'pricing_table'
      });
    }
  };

  // Gestion sélection plan avec Stripe
  const handlePlanSelection = async (plan: PricingPlan) => {
    // Callback parent si fourni
    if (onPlanSelect) {
      onPlanSelect(plan);
      return;
    }

    // Sinon, gestion Stripe par défaut
    if (!customerEmail.trim()) {
      alert('Email requis pour continuer');
      return;
    }

    setLocalLoading(true);
    setLocalSelectedPlan(plan.id);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe not loaded');
      }

      // Appel API création session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: localBillingCycle === 'monthly' ? plan.monthlyPriceId : plan.yearlyPriceId,
          planName: plan.name,
          billingCycle: localBillingCycle,
          customerEmail: customerEmail.trim(),
          customerData: {
            source: 'pricing_table_component',
            plan_position: plans.findIndex(p => p.id === plan.id)
          },
          trialDays: 7
        }),
      });

      const sessionData = await response.json();
      
      if (!sessionData.success) {
        throw new Error(sessionData.error);
      }

      // Redirect Stripe Checkout
      await stripe.redirectToCheckout({
        sessionId: sessionData.session.id,
      });

    } catch (error) {
      console.error('❌ Erreur sélection plan:', error);
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLocalLoading(false);
      setLocalSelectedPlan(null);
    }
  };

  // Calcul économies annuel
  const calculateYearlyDiscount = (plan: PricingPlan) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = monthlyTotal - plan.yearlyPrice;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { savings, percentage };
  };

  const currentLoading = isLoading || localLoading;
  const currentSelectedPlan = selectedPlan || localSelectedPlan;
  const currentBillingCycle = billingCycle !== 'monthly' && billingCycle !== 'yearly' ? localBillingCycle : billingCycle;

  return (
    <div className={`pricing-table ${className}`}>
      
      {/* Billing Cycle Toggle */}
      <div className=\"flex justify-center mb-12\">
        <div className=\"inline-flex bg-white rounded-xl p-1 shadow-lg border border-slate-200\">
          <button
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              currentBillingCycle === 'monthly'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            onClick={() => handleBillingCycleChange('monthly')}
          >
            Mensuel
          </button>
          <button
            className={`px-8 py-3 rounded-lg font-semibold transition-all relative ${
              currentBillingCycle === 'yearly'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            onClick={() => handleBillingCycleChange('yearly')}
          >
            Annuel
            <span className=\"absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold\">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className=\"grid lg:grid-cols-3 gap-8\">
        {plans.map((plan, index) => {
          const discount = calculateYearlyDiscount(plan);
          const currentPrice = currentBillingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          const isSelected = currentSelectedPlan === plan.id;
          const isPlanLoading = currentLoading && isSelected;

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all hover:scale-105 ${
                plan.popular 
                  ? 'border-blue-500 ring-4 ring-blue-100' 
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className=\"absolute -top-4 left-1/2 transform -translate-x-1/2\">
                  <span className=\"bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold\">
                    🔥 Plus populaire
                  </span>
                </div>
              )}

              <div className=\"p-8\">
                {/* Header */}
                <div className=\"text-center mb-8\">
                  <h3 className=\"text-2xl font-bold text-slate-900 mb-2\">{plan.name}</h3>
                  <p className=\"text-slate-600 mb-6\">{plan.description}</p>
                  
                  {/* Price */}
                  <div className=\"mb-6\">
                    <div className=\"flex items-baseline justify-center gap-2\">
                      <span className=\"text-4xl font-bold text-slate-900\">
                        {currentPrice}€
                      </span>
                      <span className=\"text-slate-500 font-medium\">
                        /{currentBillingCycle === 'monthly' ? 'mois' : 'an'}
                      </span>
                    </div>
                    
                    {/* Yearly Savings */}
                    {currentBillingCycle === 'yearly' && (
                      <div className=\"mt-2\">
                        <span className=\"text-sm text-slate-500 line-through\">
                          {plan.monthlyPrice * 12}€/an
                        </span>
                        <span className=\"ml-2 text-green-600 font-semibold text-sm\">
                          Économisez {discount.savings}€ ({discount.percentage}%)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePlanSelection(plan)}
                    disabled={currentLoading}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isPlanLoading ? (
                      <span className=\"flex items-center justify-center gap-2\">
                        <svg className=\"animate-spin h-5 w-5\" viewBox=\"0 0 24 24\">
                          <circle cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" strokeWidth=\"4\" fill=\"none\" className=\"opacity-25\"/>
                          <path fill=\"currentColor\" d=\"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z\" className=\"opacity-75\"/>
                        </svg>
                        Création...
                      </span>
                    ) : (
                      plan.cta || `Essai gratuit 7 jours • ${plan.name}`
                    )}
                  </button>
                  
                  <p className=\"text-xs text-slate-500 mt-3\">
                    Puis {currentPrice}€/{currentBillingCycle === 'monthly' ? 'mois' : 'an'} • Annulable à tout moment
                  </p>
                </div>

                {/* Features List */}
                <div className=\"space-y-4\">
                  <h4 className=\"font-semibold text-slate-900 text-center\">✨ Inclus dans {plan.name}</h4>
                  <ul className=\"space-y-3\">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className=\"flex items-start gap-3\">
                        <span className=\"text-green-500 text-lg mt-0.5 flex-shrink-0\">✓</span>
                        <span className=\"text-slate-700 text-sm leading-relaxed\">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Limitations */}
                  {plan.limitations && plan.limitations.length > 0 && (
                    <div className=\"pt-4 border-t border-slate-100\">
                      <h5 className=\"text-sm font-medium text-slate-500 mb-2\">Limitations:</h5>
                      <ul className=\"space-y-1\">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className=\"flex items-start gap-2 text-sm text-slate-500\">
                            <span className=\"text-slate-300 mt-0.5\">•</span>
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Target Audience */}
                  {plan.targetAudience && (
                    <div className=\"pt-4 border-t border-slate-100\">
                      <p className=\"text-sm text-slate-500 text-center\">
                        <span className=\"font-medium\">{plan.targetAudience}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Table (optionnel) */}
      {showComparison && (
        <div className=\"mt-20\">
          <div className=\"text-center mb-8\">
            <h3 className=\"text-2xl font-bold text-slate-900 mb-2\">
              Comparaison détaillée
            </h3>
            <p className=\"text-slate-600\">
              Toutes les différences entre nos plans
            </p>
          </div>

          <div className=\"overflow-x-auto bg-white rounded-2xl shadow-xl border border-slate-200\">
            <table className=\"w-full\">
              <thead className=\"bg-slate-50\">
                <tr>
                  <th className=\"px-6 py-4 text-left font-bold text-slate-900\">Fonctionnalités</th>
                  {plans.map(plan => (
                    <th key={plan.id} className=\"px-6 py-4 text-center font-bold text-slate-900\">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className=\"divide-y divide-slate-100\">
                {/* Ici vous pouvez ajouter votre logique de comparaison */}
                <tr>
                  <td className=\"px-6 py-4 font-medium text-slate-900\">Prix {currentBillingCycle}</td>
                  {plans.map(plan => (
                    <td key={plan.id} className=\"px-6 py-4 text-center font-bold text-slate-900\">
                      {currentBillingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}€
                      <span className=\"text-slate-500 font-normal\">
                        /{currentBillingCycle === 'monthly' ? 'mois' : 'an'}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className=\"px-6 py-4 font-medium text-slate-900\">Essai gratuit</td>
                  {plans.map(plan => (
                    <td key={plan.id} className=\"px-6 py-4 text-center\">
                      <span className=\"inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm font-bold\">✓</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}