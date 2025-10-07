// TrustBoost - Page Pricing Production-Ready
// AGENT BUSINESS - Page commerciale optimisée conversion
// Context7 Pattern: /stripe/stripe-js + React hooks + Next.js

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { GetStaticProps } from 'next';

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
  limitations: string[];
  targetAudience: string;
}

interface PricingPageProps {
  plans: PricingPlan[];
  comparisonFeatures: any[];
  faqData: any[];
}

// Configuration Stripe - Context7 Pattern sécurisé
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/**
 * Page Pricing TrustBoost - Optimisée Conversion
 * OBJECTIF: Taux conversion >5% avec essai 7 jours
 * MÉTRIQUES: Time on page, plan clicks, checkout starts
 */
export default function PricingPage({ plans, comparisonFeatures, faqData }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');

  // Analytics tracking
  useEffect(() => {
    // Page view tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'TrustBoost Pricing',
        page_location: window.location.href,
        content_group1: 'Commercial Pages'
      });
    }

    // Scroll tracking pour engagement
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent > 25 && !window.scrolled_25) {
        window.scrolled_25 = true;
        trackConversion('pricing_scroll_25');
      }
      if (scrollPercent > 50 && !window.scrolled_50) {
        window.scrolled_50 = true;
        trackConversion('pricing_scroll_50');
      }
      if (scrollPercent > 75 && !window.scrolled_75) {
        window.scrolled_75 = true;
        trackConversion('pricing_scroll_75');
      }
    };

    window.addEventListener('scroll', handleScroll);
    trackConversion('pricing_page_loaded');

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fonction analytics conversion
  const trackConversion = (action: string, value?: any) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: 'Pricing Conversion',
        event_label: value || billingCycle,
        custom_parameter_1: billingCycle,
        custom_parameter_2: selectedPlan
      });
    }

    // Log pour dev
    console.log('📊 Conversion tracked:', { action, value, billingCycle, selectedPlan });
  };

  // Gestion sélection plan avec Stripe Checkout
  const handlePlanSelection = async (plan: PricingPlan) => {
    if (!customerEmail.trim()) {
      alert('Veuillez saisir votre email pour continuer');
      return;
    }

    setIsLoading(true);
    setSelectedPlan(plan.id);
    
    trackConversion('plan_selected', plan.name);

    try {
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Appel API pour créer session checkout
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: billingCycle === 'monthly' ? plan.monthlyPriceId : plan.yearlyPriceId,
          planName: plan.name,
          billingCycle: billingCycle,
          customerEmail: customerEmail.trim(),
          customerData: {
            source: 'pricing_page',
            selected_billing: billingCycle,
            plan_position: plans.findIndex(p => p.id === plan.id)
          },
          successUrl: `${window.location.origin}/onboarding/success?plan=${plan.id}`,
          cancelUrl: window.location.href,
          trialDays: 7,
          allowPromotionCodes: true
        }),
      });

      const sessionData = await response.json();

      if (!sessionData.success) {
        throw new Error(sessionData.error || 'Failed to create checkout session');
      }

      trackConversion('checkout_session_created', plan.name);

      // Redirect vers Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionData.session.id,
      });

      if (error) {
        throw error;
      }

    } catch (error) {
      console.error('❌ Erreur sélection plan:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      alert(`Erreur: ${errorMessage}. Veuillez réessayer.`);
      
      trackConversion('plan_selection_error', errorMessage);
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  // Toggle billing cycle avec analytics
  const handleBillingToggle = (cycle: 'monthly' | 'yearly') => {
    setBillingCycle(cycle);
    trackConversion('billing_cycle_changed', cycle);
  };

  return (
    <>
      <Head>
        <title>Pricing TrustBoost - Plans Analytics à partir de 29€/mois</title>
        <meta name=\"description\" content=\"Plans TrustBoost flexibles pour toutes entreprises. Essai gratuit 7 jours. Analytics utilisateurs, conversion optimization, growth insights.\" />
        <meta name=\"keywords\" content=\"trustboost prix, analytics saas pricing, user analytics cost, conversion optimization price, growth marketing tools\" />
        
        {/* Open Graph */}
        <meta property=\"og:title\" content=\"TrustBoost Pricing - Analytics Users dès 29€\" />
        <meta property=\"og:description\" content=\"Plans flexibles + essai 7 jours gratuit. Analytics, conversion, growth pour toutes entreprises.\" />
        <meta property=\"og:image\" content={`${process.env.NEXT_PUBLIC_SITE_URL}/images/trustboost-pricing-og.jpg`} />
        <meta property=\"og:url\" content={`${process.env.NEXT_PUBLIC_SITE_URL}/pricing`} />
        
        {/* Twitter Card */}
        <meta name=\"twitter:card\" content=\"summary_large_image\" />
        <meta name=\"twitter:title\" content=\"TrustBoost Pricing - Analytics dès 29€/mois\" />
        <meta name=\"twitter:description\" content=\"Plans flexibles + essai 7 jours. Conversion optimization pour toutes entreprises.\" />
        
        {/* Schema.org Pricing */}
        <script
          type=\"application/ld+json\"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              \"@context\": \"https://schema.org\",
              \"@type\": \"Product\",
              \"name\": \"TrustBoost Analytics Platform\",
              \"description\": \"Plateforme analytics et conversion optimization\",
              \"brand\": { \"@type\": \"Brand\", \"name\": \"TrustBoost\" },
              \"offers\": plans.map(plan => ({
                \"@type\": \"Offer\",
                \"name\": `Plan ${plan.name}`,
                \"price\": plan.monthlyPrice,
                \"priceCurrency\": \"EUR\",
                \"availability\": \"https://schema.org/InStock\",
                \"validFrom\": new Date().toISOString(),
                \"priceValidUntil\": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
              }))
            })
          }}
        />
      </Head>

      <div className=\"min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100\">
        
        {/* Hero Section */}
        <section className=\"pt-20 pb-16 px-4\">
          <div className=\"max-w-6xl mx-auto text-center\">
            <div className=\"inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6\">
              🚀 Essai gratuit 7 jours - Sans engagement
            </div>
            
            <h1 className=\"text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight\">
              Des tarifs{' '}
              <span className=\"text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600\">
                transparents
              </span>
              <br />
              pour chaque étape
            </h1>
            
            <p className=\"text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed\">
              Choisissez le plan parfait pour votre croissance. 
              <strong className=\"text-slate-800\"> Setup en 5 minutes</strong>, 
              résultats immédiats, et support français inclus.
            </p>

            {/* Email Capture */}
            <div className=\"max-w-md mx-auto mb-8\">
              <div className=\"flex gap-2\">
                <input
                  type=\"email\"
                  placeholder=\"votre@email.com\"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className=\"flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
                />
                <button
                  className=\"px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium\"
                  onClick={() => trackConversion('email_entered', customerEmail)}
                >
                  Continuer
                </button>
              </div>
              <p className=\"text-sm text-slate-500 mt-2\">
                Required for free trial • No spam, promise 🤝
              </p>
            </div>

            {/* Billing Toggle */}
            <div className=\"inline-flex bg-white rounded-xl p-1 shadow-lg border border-slate-200 mb-12\">
              <button
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                onClick={() => handleBillingToggle('monthly')}
              >
                Mensuel
              </button>
              <button
                className={`px-8 py-3 rounded-lg font-semibold transition-all relative ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                onClick={() => handleBillingToggle('yearly')}
              >
                Annuel
                <span className=\"absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold\">
                  -20%
                </span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className=\"flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500\">
              <div className=\"flex items-center gap-2\">
                <span className=\"w-2 h-2 bg-green-400 rounded-full\"></span>
                RGPD Compliant
              </div>
              <div className=\"flex items-center gap-2\">
                <span className=\"w-2 h-2 bg-green-400 rounded-full\"></span>
                Hébergement France
              </div>
              <div className=\"flex items-center gap-2\">
                <span className=\"w-2 h-2 bg-green-400 rounded-full\"></span>
                Support 🇫🇷
              </div>
              <div className=\"flex items-center gap-2\">
                <span className=\"w-2 h-2 bg-green-400 rounded-full\"></span>
                SSL Bank-level
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className=\"pb-20 px-4\">
          <div className=\"max-w-7xl mx-auto\">
            <div className=\"grid lg:grid-cols-3 gap-8\">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all hover:scale-105 ${
                    plan.popular 
                      ? 'border-blue-500 ring-4 ring-blue-100' 
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {plan.popular && (
                    <div className=\"absolute -top-4 left-1/2 transform -translate-x-1/2\">
                      <span className=\"bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold\">
                        🔥 Plus populaire
                      </span>
                    </div>
                  )}

                  <div className=\"p-8\">
                    <div className=\"text-center mb-8\">
                      <h3 className=\"text-2xl font-bold text-slate-900 mb-2\">{plan.name}</h3>
                      <p className=\"text-slate-600 mb-6\">{plan.description}</p>
                      
                      <div className=\"mb-6\">
                        <div className=\"flex items-baseline justify-center gap-2\">
                          <span className=\"text-4xl font-bold text-slate-900\">
                            {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}€
                          </span>
                          <span className=\"text-slate-500 font-medium\">
                            /{billingCycle === 'monthly' ? 'mois' : 'an'}
                          </span>
                        </div>
                        
                        {billingCycle === 'yearly' && (
                          <div className=\"mt-2\">
                            <span className=\"text-sm text-slate-500 line-through\">
                              {plan.monthlyPrice * 12}€/an
                            </span>
                            <span className=\"ml-2 text-green-600 font-semibold text-sm\">
                              Économisez {(plan.monthlyPrice * 12) - plan.yearlyPrice}€
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handlePlanSelection(plan)}
                        disabled={isLoading || !customerEmail.trim()}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                          plan.popular
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isLoading && selectedPlan === plan.id ? (
                          <span className=\"flex items-center justify-center gap-2\">
                            <svg className=\"animate-spin h-5 w-5\" viewBox=\"0 0 24 24\">
                              <circle cx=\"12\" cy=\"12\" r=\"10\" stroke=\"currentColor\" strokeWidth=\"4\" fill=\"none\" className=\"opacity-25\"/>
                              <path fill=\"currentColor\" d=\"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z\" className=\"opacity-75\"/>
                            </svg>
                            Création...
                          </span>
                        ) : (
                          `Essai gratuit 7 jours • ${plan.name}`
                        )}
                      </button>
                      
                      <p className=\"text-xs text-slate-500 mt-3\">
                        Puis {billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}€/{billingCycle === 'monthly' ? 'mois' : 'an'} • Annulable à tout moment
                      </p>
                    </div>

                    {/* Features */}
                    <div className=\"space-y-4\">
                      <h4 className=\"font-semibold text-slate-900 text-center\">✨ Inclus dans {plan.name}</h4>
                      <ul className=\"space-y-3\">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className=\"flex items-start gap-3\">
                            <span className=\"text-green-500 text-lg mt-0.5\">✓</span>
                            <span className=\"text-slate-700\">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {plan.limitations.length > 0 && (
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

                      <div className=\"pt-4 border-t border-slate-100\">
                        <p className=\"text-sm text-slate-500 text-center\">
                          <span className=\"font-medium\">{plan.targetAudience}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className=\"py-20 px-4 bg-white\">
          <div className=\"max-w-6xl mx-auto\">
            <div className=\"text-center mb-16\">
              <h2 className=\"text-4xl font-bold text-slate-900 mb-4\">
                Comparatif détaillé des fonctionnalités
              </h2>
              <p className=\"text-xl text-slate-600\">
                Tout ce que vous devez savoir sur nos plans
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
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={index} className=\"hover:bg-slate-50 transition-colors\">
                      <td className=\"px-6 py-4 font-medium text-slate-900\">{feature.name}</td>
                      {plans.map(plan => (
                        <td key={plan.id} className=\"px-6 py-4 text-center\">
                          {feature[plan.id] === true ? (
                            <span className=\"inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm font-bold\">✓</span>
                          ) : feature[plan.id] === false ? (
                            <span className=\"text-slate-300 text-lg\">−</span>
                          ) : (
                            <span className=\"text-slate-700 font-medium\">{feature[plan.id]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className=\"py-20 px-4 bg-slate-50\">
          <div className=\"max-w-4xl mx-auto\">
            <div className=\"text-center mb-16\">
              <h2 className=\"text-4xl font-bold text-slate-900 mb-4\">
                Questions fréquentes
              </h2>
              <p className=\"text-xl text-slate-600\">
                Tout ce que vous devez savoir avant de commencer
              </p>
            </div>

            <div className=\"space-y-6\">
              {faqData.map((faq, index) => (
                <details key={index} className=\"bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden\">
                  <summary className=\"px-6 py-4 font-semibold text-slate-900 cursor-pointer hover:bg-slate-50 transition-colors\">
                    {faq.question}
                  </summary>
                  <div className=\"px-6 pb-4 text-slate-700 leading-relaxed\">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className=\"py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white\">
          <div className=\"max-w-4xl mx-auto text-center\">
            <h2 className=\"text-4xl font-bold mb-6\">
              Prêt à booster vos conversions ?
            </h2>
            <p className=\"text-xl mb-8 text-blue-100 leading-relaxed\">
              7 jours pour tester TrustBoost gratuitement. 
              <strong className=\"text-white\"> Setup en 5 minutes</strong>, 
              résultats visibles dès le premier jour.
            </p>
            
            <div className=\"flex flex-col sm:flex-row gap-4 justify-center items-center\">
              <button
                onClick={() => document.querySelector('input[type=\"email\"]')?.focus()}
                className=\"bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all hover:scale-105\"
              >
                🚀 Commencer l'essai gratuit
              </button>
              
              <a
                href=\"/demo\"
                className=\"border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105\"
                onClick={() => trackConversion('demo_requested', 'final_cta')}
              >
                📹 Voir une démo
              </a>
            </div>

            <div className=\"mt-8 flex flex-wrap justify-center items-center gap-6 text-blue-200 text-sm\">
              <span>✓ Sans engagement</span>
              <span>✓ Annulation en 1 clic</span>
              <span>✓ Support français</span>
              <span>✓ Conformité RGPD</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/**
 * Static Site Generation - Données pricing optimisées SEO
 */
export const getStaticProps: GetStaticProps = async () => {
  // Configuration des plans TrustBoost (sync avec Stripe Dashboard)
  const plans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Parfait pour découvrir TrustBoost',
      monthlyPrice: 29,
      yearlyPrice: 278, // -20% discount
      monthlyPriceId: process.env.STRIPE_PRICE_STARTER_MONTHLY || 'price_starter_monthly',
      yearlyPriceId: process.env.STRIPE_PRICE_STARTER_YEARLY || 'price_starter_yearly',
      popular: false,
      targetAudience: 'Startups et PME débutantes',
      features: [
        'Jusqu\'à 1 000 utilisateurs trackés',
        'Dashboard analytics temps réel',
        'Prédictions IA de base',
        'Support email (48h)',
        '3 intégrations incluses',
        'Rétention de données 30 jours',
        'Rapports PDF automatiques',
        'Alertes personnalisées'
      ],
      limitations: [
        'API limitée (100 req/h)',
        'Pas de white-label',
        'Support standard uniquement'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Pour les entreprises qui veulent accélérer',
      monthlyPrice: 99,
      yearlyPrice: 950, // -20% discount
      monthlyPriceId: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
      yearlyPriceId: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
      popular: true,
      targetAudience: 'Scale-ups et entreprises en croissance',
      features: [
        'Jusqu\'à 10 000 utilisateurs trackés',
        'Dashboard analytics avancé',
        'IA prédictive complète + modèles custom',
        'Support prioritaire (24h)',
        'Intégrations illimitées',
        'Rétention de données 1 an',
        'API complète (1000 req/h)',
        'Webhooks personnalisés',
        'Exports automatisés (CSV, JSON)',
        'A/B testing intégré',
        'Segments utilisateurs avancés',
        'Attribution multi-touch'
      ],
      limitations: [
        'Pas de déploiement sur site'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Solution complète pour grandes organisations',
      monthlyPrice: 299,
      yearlyPrice: 2870, // -20% discount
      monthlyPriceId: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || 'price_enterprise_monthly',
      yearlyPriceId: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || 'price_enterprise_yearly',
      popular: false,
      targetAudience: 'Grandes entreprises et corporates',
      features: [
        'Utilisateurs illimités',
        'Dashboard white-label personnalisable',
        'IA sur mesure + modèles propriétaires',
        'Support dédié 24/7 + CSM',
        'Toutes intégrations + développement custom',
        'Rétention de données illimitée',
        'API sur mesure + SLA garantis',
        'Déploiement sur site (on-premise)',
        'SLA garanti 99.9%',
        'Formation équipe incluse',
        'Audit de sécurité annuel',
        'Conformité enterprise (SOC2, ISO27001)',
        'Data residency (choix géographique)',
        'Développement features custom'
      ],
      limitations: []
    }
  ];

  // Comparatif fonctionnalités détaillé
  const comparisonFeatures = [
    { name: 'Utilisateurs trackés', starter: '1 000', professional: '10 000', enterprise: 'Illimité' },
    { name: 'Prédictions IA', starter: 'Basique', professional: 'Avancée + Custom', enterprise: 'Sur mesure' },
    { name: 'Dashboard temps réel', starter: true, professional: true, enterprise: true },
    { name: 'API Requests/heure', starter: '100', professional: '1 000', enterprise: 'Illimitées' },
    { name: 'Intégrations', starter: '3', professional: 'Illimitées', enterprise: 'Custom développées' },
    { name: 'Support', starter: 'Email (48h)', professional: 'Prioritaire (24h)', enterprise: '24/7 + CSM dédié' },
    { name: 'Rétention données', starter: '30 jours', professional: '1 an', enterprise: 'Illimitée' },
    { name: 'White-label', starter: false, professional: false, enterprise: true },
    { name: 'SLA garanti', starter: false, professional: false, enterprise: '99.9%' },
    { name: 'Déploiement sur site', starter: false, professional: false, enterprise: true },
    { name: 'Formation équipe', starter: false, professional: false, enterprise: true },
    { name: 'Audit sécurité', starter: false, professional: false, enterprise: 'Annuel' }
  ];

  // FAQ optimisée conversion
  const faqData = [
    {
      question: 'Comment fonctionne l\'essai gratuit de 7 jours ?',
      answer: 'L\'essai gratuit vous donne accès à toutes les fonctionnalités de votre plan choisi pendant 7 jours. Aucune carte bancaire n\'est requise pour commencer. Vous pouvez annuler à tout moment pendant l\'essai sans frais.'
    },
    {
      question: 'Puis-je changer de plan à tout moment ?',
      answer: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et nous ajustons la facturation au prorata pour être équitable.'
    },
    {
      question: 'Que se passe-t-il si je dépasse les limites de mon plan ?',
      answer: 'Nous vous alertons avant d\'atteindre les limites. Pour les utilisateurs trackés, nous proposons automatiquement un upgrade. Aucune coupure brutale - nous discutons toujours d\'une solution adaptée.'
    },
    {
      question: 'Mes données sont-elles sécurisées et conformes RGPD ?',
      answer: 'Absolument. Nous utilisons un chiffrement AES-256 de niveau bancaire, hébergement en France, et sommes 100% conformes RGPD. Vos données restent votre propriété exclusive.'
    },
    {
      question: 'Proposez-vous des remises pour les associations ou startups ?',
      answer: 'Oui ! 50% de réduction pour les associations à but non lucratif et établissements d\'enseignement. Remises spéciales pour startups early-stage. Contactez-nous pour en savoir plus.'
    },
    {
      question: 'Comment fonctionne l\'intégration technique ?',
      answer: 'Setup en 5 minutes via notre SDK JavaScript ou API REST. Nous supportons tous les frameworks (React, Vue, Angular, etc.) avec une documentation complète et des exemples prêts à l\'emploi.'
    },
    {
      question: 'Y a-t-il des frais cachés ou de setup ?',
      answer: 'Aucun frais caché, de setup, ou d\'activation. Le prix affiché est le prix final. Vous payez uniquement votre abonnement mensuel ou annuel, point final.'
    },
    {
      question: 'Que se passe-t-il à l\'annulation ?',
      answer: 'Annulation en 1 clic dans votre dashboard. Vous gardez l\'accès jusqu\'à la fin de votre période payée. Export de toutes vos données inclus. Aucune pénalité.'
    }
  ];

  return {
    props: {
      plans,
      comparisonFeatures, 
      faqData
    },
    revalidate: 3600 // Régénération toutes les heures
  };
};