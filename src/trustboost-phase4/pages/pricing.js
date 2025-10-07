// TrustBoost Phase 4 - Page Pricing
// Agent 4: Business & Commercial Engineer  
// MÉTRIQUE OBLIGATOIRE: Conversion rate >5%

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import CTAButton from '../components/CTAButton';
import PricingCard from '../components/PricingCard';
import FAQSection from '../components/FAQSection';

// Configuration Stripe - Context7 Pattern
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

/**
 * Page Pricing optimisée pour conversion
 * Intégration Stripe + tracking analytics
 */
export default function PricingPage({ pricingPlans, faqData, comparisonFeatures }) {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Analytics tracking
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'TrustBoost - Tarifs',
        page_location: window.location.href,
        content_group1: 'Pricing Pages'
      });
    }

    // Track pricing page engagement
    trackConversion('pricing_page_view');
    
    // Track scroll to pricing plans
    const handleScroll = () => {
      const pricingSection = document.getElementById('pricing-plans');
      if (pricingSection) {
        const rect = pricingSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && !window.tracked_pricing_view) {
          window.tracked_pricing_view = true;
          trackConversion('pricing_plans_viewed');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fonction de tracking conversion
  const trackConversion = (action, value = null) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: 'Conversion',
        event_label: 'Pricing Page',
        value: value
      });
    }
  };

  // Gestion achat plan avec Stripe
  const handlePlanPurchase = async (plan) => {
    setIsLoading(true);
    setSelectedPlan(plan.id);
    
    trackConversion('plan_selected', plan.name);

    try {
      const stripe = await stripePromise;
      
      // Création session Stripe Checkout
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: billingCycle === 'monthly' ? plan.monthlyPriceId : plan.yearlyPriceId,
          planName: plan.name,
          billingCycle: billingCycle,
          successUrl: `${window.location.origin}/onboarding/success`,
          cancelUrl: window.location.href
        }),
      });

      const session = await response.json();

      if (session.error) {
        throw new Error(session.error);
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      trackConversion('checkout_started', plan.name);

    } catch (error) {
      console.error('Erreur checkout:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
      trackConversion('checkout_error', error.message);
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  // Toggle billing cycle avec tracking
  const handleBillingToggle = (cycle) => {
    setBillingCycle(cycle);
    trackConversion('billing_cycle_changed', cycle);
  };

  return (
    <>
      <Head>
        <title>Tarifs TrustBoost - Plans et Pricing pour toutes les entreprises</title>
        <meta name="description" content="Découvrez nos plans TrustBoost à partir de 29€/mois. Essai gratuit 7 jours, sans engagement. Starter, Pro, Enterprise - choisissez votre plan idéal." />
        <meta name="keywords" content="trustboost prix, tarifs analytics, pricing saas, plan entreprise, user analytics cost" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Tarifs TrustBoost - À partir de 29€/mois" />
        <meta property="og:description" content="Plans flexibles pour toutes les entreprises. Essai gratuit 7 jours inclus." />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_SITE_URL}/images/og-pricing.jpg`} />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL}/pricing`} />
        
        {/* Schema.org Pricing */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "TrustBoost",
              "offers": pricingPlans.map(plan => ({
                "@type": "Offer",
                "name": plan.name,
                "price": plan.monthlyPrice,
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "validFrom": new Date().toISOString()
              }))
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Hero Section Pricing */}
        <section className="py-20 px-4 text-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Des tarifs transparents pour{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                chaque étape
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Choisissez le plan parfait pour votre entreprise. 
              <strong> Essai gratuit 7 jours inclus</strong>, aucune carte bancaire requise.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex bg-white rounded-lg p-1 shadow-sm mb-12">
              <button
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => handleBillingToggle('monthly')}
              >
                Mensuel
              </button>
              <button
                className={`px-6 py-2 rounded-md font-medium transition-colors relative ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => handleBillingToggle('yearly')}
              >
                Annuel
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Plans Pricing */}
        <section id="pricing-plans" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  billingCycle={billingCycle}
                  isPopular={plan.popular}
                  isLoading={isLoading && selectedPlan === plan.id}
                  onSelect={() => handlePlanPurchase(plan)}
                  onFeatureClick={(feature) => trackConversion('feature_clicked', feature)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Comparatif détaillé des fonctionnalités
              </h2>
              <p className="text-xl text-gray-600">
                Tout ce que vous devez savoir sur nos plans
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium text-gray-900">Fonctionnalités</th>
                    {pricingPlans.map(plan => (
                      <th key={plan.id} className="px-6 py-4 text-center font-medium text-gray-900">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-medium text-gray-900">{feature.name}</td>
                      {pricingPlans.map(plan => (
                        <td key={plan.id} className="px-6 py-4 text-center">
                          {feature[plan.id] === true ? (
                            <span className="text-green-500 text-xl">✓</span>
                          ) : feature[plan.id] === false ? (
                            <span className="text-gray-300 text-xl">-</span>
                          ) : (
                            <span className="text-gray-700">{feature[plan.id]}</span>
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

        {/* Enterprise Section */}
        <section className="py-20 px-4 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Besoin d'une solution sur mesure ?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Notre équipe Enterprise vous accompagne pour créer une solution parfaitement adaptée à vos besoins spécifiques.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  🏢
                </div>
                <h3 className="font-semibold mb-2">Déploiement sur site</h3>
                <p className="text-gray-400">Infrastructure dédiée et sécurisée</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  🔧
                </div>
                <h3 className="font-semibold mb-2">API personnalisées</h3>
                <p className="text-gray-400">Intégrations sur mesure pour votre stack</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  👥
                </div>
                <h3 className="font-semibold mb-2">Support dédié</h3>
                <p className="text-gray-400">Équipe dédiée et SLA garantis</p>
              </div>
            </div>

            <CTAButton
              href="/contact/enterprise"
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold"
              onClick={() => trackConversion('enterprise_contact')}
            >
              Contacter l'équipe Enterprise
            </CTAButton>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection 
          faqData={faqData} 
          onQuestionClick={(question) => trackConversion('faq_question', question)}
        />

        {/* CTA Final */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Prêt à commencer votre essai gratuit ?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              7 jours pour tester TrustBoost sans engagement. 
              Setup en 5 minutes, résultats immédiats.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton
                href="/onboarding/step1"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold"
                onClick={() => trackConversion('cta_free_trial', 'pricing_page')}
              >
                Commencer l'essai gratuit
              </CTAButton>
              
              <CTAButton
                href="/demo"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold"
                onClick={() => trackConversion('cta_demo_request', 'pricing_page')}
              >
                Demander une démo
              </CTAButton>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

/**
 * Static Site Generation avec données pricing
 * Performance optimale pour SEO et conversion
 */
export async function getStaticProps() {
  // Configuration des plans - en production depuis Stripe API
  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Parfait pour commencer l\'analyse de confiance',
      monthlyPrice: 29,
      yearlyPrice: 23, // -20%
      monthlyPriceId: 'price_starter_monthly',
      yearlyPriceId: 'price_starter_yearly',
      popular: false,
      features: [
        'Jusqu\'à 1 000 utilisateurs trackés',
        'Dashboard analytics basique',
        'Prédictions IA de base',
        'Support email',
        '3 intégrations incluses',
        'Rétention de données 30 jours'
      ],
      limitations: [
        'Pas d\'API avancée',
        'Pas de white-label',
        'Support standard'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Pour les entreprises qui veulent aller plus loin',
      monthlyPrice: 99,
      yearlyPrice: 79, // -20%
      monthlyPriceId: 'price_pro_monthly',
      yearlyPriceId: 'price_pro_yearly',
      popular: true,
      features: [
        'Jusqu\'à 10 000 utilisateurs trackés',
        'Dashboard analytics avancé',
        'IA prédictive complète',
        'Support prioritaire',
        'Intégrations illimitées',
        'Rétention de données 1 an',
        'API complète',
        'Webhooks personnalisés',
        'Exports automatisés',
        'A/B testing intégré'
      ],
      limitations: [
        'Pas de déploiement sur site'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Solution complète pour les grandes organisations',
      monthlyPrice: 299,
      yearlyPrice: 239, // -20%
      monthlyPriceId: 'price_enterprise_monthly',
      yearlyPriceId: 'price_enterprise_yearly',
      popular: false,
      features: [
        'Utilisateurs illimités',
        'Dashboard white-label',
        'IA personnalisée',
        'Support dédié 24/7',
        'Toutes les intégrations',
        'Rétention de données illimitée',
        'API sur mesure',
        'Déploiement sur site',
        'SLA garanti 99.9%',
        'Formation équipe incluse',
        'CSM dédié',
        'Audit de sécurité'
      ],
      limitations: []
    }
  ];

  // Comparatif des fonctionnalités
  const comparisonFeatures = [
    {
      name: 'Utilisateurs trackés',
      starter: '1 000',
      professional: '10 000', 
      enterprise: 'Illimité'
    },
    {
      name: 'Prédictions IA',
      starter: 'Basique',
      professional: 'Avancée',
      enterprise: 'Personnalisée'
    },
    {
      name: 'Dashboard temps réel',
      starter: true,
      professional: true,
      enterprise: true
    },
    {
      name: 'API accès',
      starter: 'Limitée',
      professional: 'Complète',
      enterprise: 'Sur mesure'
    },
    {
      name: 'Intégrations',
      starter: '3',
      professional: 'Illimitées',
      enterprise: 'Sur mesure'
    },
    {
      name: 'Support',
      starter: 'Email',
      professional: 'Prioritaire',
      enterprise: '24/7 Dédié'
    },
    {
      name: 'Rétention données',
      starter: '30 jours',
      professional: '1 an',
      enterprise: 'Illimitée'
    },
    {
      name: 'White-label',
      starter: false,
      professional: false,
      enterprise: true
    },
    {
      name: 'SLA garanti',
      starter: false,
      professional: false,
      enterprise: '99.9%'
    }
  ];

  // FAQ pour réduire les friction à l'achat
  const faqData = [
    {
      question: 'Puis-je changer de plan à tout moment ?',
      answer: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et nous ajustons la facturation au prorata.'
    },
    {
      question: 'Que se passe-t-il après la période d\'essai ?',
      answer: 'Après 7 jours d\'essai gratuit, votre abonnement commence automatiquement. Vous pouvez annuler à tout moment pendant l\'essai sans frais.'
    },
    {
      question: 'Les données sont-elles sécurisées ?',
      answer: 'Absolument. Nous utilisons un chiffrement de niveau bancaire (AES-256) et sommes conformes RGPD. Vos données sont stockées en Europe.'
    },
    {
      question: 'Proposez-vous des remises pour les associations ?',
      answer: 'Oui, nous offrons 50% de réduction pour les associations à but non lucratif et les établissements d\'enseignement. Contactez-nous pour en savoir plus.'
    },
    {
      question: 'Comment fonctionne l\'intégration ?',
      answer: 'Setup en 5 minutes via notre SDK JavaScript ou API REST. Nous supportons tous les frameworks populaires et proposons une documentation complète.'
    },
    {
      question: 'Y a-t-il des frais de setup ?',
      answer: 'Aucun frais de setup ou d\'activation. Vous payez uniquement votre abonnement mensuel ou annuel.'
    }
  ];

  return {
    props: {
      pricingPlans,
      comparisonFeatures,
      faqData
    },
    revalidate: 3600 // Régénération toutes les heures pour prix dynamiques
  };
}