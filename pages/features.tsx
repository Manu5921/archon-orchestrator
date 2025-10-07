// TrustBoost - Page Features Production-Ready
// AGENT BUSINESS - Page features pour compléter funnel commercial
// Context7 Pattern: Next.js + SEO optimization + conversion tracking

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';

// Types pour les features
interface Feature {
  id: string;
  category: string;
  title: string;
  description: string;
  benefits: string[];
  useCases: string[];
  icon: string;
  planAvailability: {
    starter: boolean;
    professional: boolean;
    enterprise: boolean;
  };
  demoUrl?: string;
  screenshot?: string;
}

interface FeatureCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface FeaturesPageProps {
  features: Feature[];
  categories: FeatureCategory[];
}

/**
 * Page Features TrustBoost - Démonstration capacités
 * OBJECTIF: Éducation produit + conversion vers pricing
 * MÉTRIQUE: Time on page, feature interest, CTA clicks
 */
export default function FeaturesPage({ features, categories }: FeaturesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Analytics tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'TrustBoost Features',
        page_location: window.location.href,
        content_group1: 'Product Pages'
      });
    }

    trackEvent('features_page_loaded');
  }, []);

  // Fonction analytics
  const trackEvent = (action: string, value?: any) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: 'Features Engagement',
        event_label: value || selectedCategory,
        custom_parameter_1: selectedCategory,
        custom_parameter_2: searchQuery
      });
    }

    console.log('📊 Features event:', { action, value, selectedCategory, searchQuery });
  };

  // Filtrage des features
  const filteredFeatures = features.filter(feature => {
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.benefits.some(benefit => benefit.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Gestion changement catégorie
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    trackEvent('category_selected', categoryId);
  };

  // Gestion clic feature
  const handleFeatureClick = (feature: Feature) => {
    trackEvent('feature_clicked', feature.title);
  };

  // Gestion CTA pricing
  const handlePricingCTA = (source: string) => {
    trackEvent('pricing_cta_clicked', source);
  };

  return (
    <>
      <Head>
        <title>TrustBoost Features - Analytics IA et Conversion Optimization</title>
        <meta name=\"description\" content=\"Découvrez toutes les fonctionnalités TrustBoost : analytics IA, prédictions comportementales, conversion optimization, A/B testing, et plus encore.\" />
        <meta name=\"keywords\" content=\"trustboost features, analytics IA, conversion optimization, user behavior, predictive analytics, a/b testing, growth marketing\" />
        
        {/* Open Graph */}
        <meta property=\"og:title\" content=\"TrustBoost Features - Analytics IA et Conversion\" />
        <meta property=\"og:description\" content=\"Analytics avancés, IA prédictive, conversion optimization. Toutes les features pour booster votre croissance.\" />
        <meta property=\"og:image\" content={`${process.env.NEXT_PUBLIC_SITE_URL}/images/trustboost-features-og.jpg`} />
        <meta property=\"og:url\" content={`${process.env.NEXT_PUBLIC_SITE_URL}/features`} />
        
        {/* Schema.org */}
        <script
          type=\"application/ld+json\"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              \"@context\": \"https://schema.org\",
              \"@type\": \"WebPage\",
              \"name\": \"TrustBoost Features\",
              \"description\": \"Analytics IA et conversion optimization features\",
              \"mainEntity\": {
                \"@type\": \"SoftwareApplication\",
                \"name\": \"TrustBoost\",
                \"applicationCategory\": \"Analytics Software\",
                \"featureList\": features.map(f => f.title)
              }
            })
          }}
        />
      </Head>

      <div className=\"min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100\">
        
        {/* Hero Section */}
        <section className=\"pt-20 pb-16 px-4\">
          <div className=\"max-w-6xl mx-auto text-center\">
            <div className=\"inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6\">
              🚀 Plus de 50+ fonctionnalités avancées
            </div>
            
            <h1 className=\"text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight\">
              Toute la{' '}
              <span className=\"text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600\">
                puissance
              </span>
              <br />
              de TrustBoost
            </h1>
            
            <p className=\"text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed\">
              Analytics IA, prédictions comportementales, conversion optimization... 
              Découvrez tous les outils pour{' '}
              <strong className=\"text-slate-800\">transformer vos visiteurs en clients</strong>.
            </p>

            {/* Search Bar */}
            <div className=\"max-w-md mx-auto mb-8\">
              <div className=\"relative\">
                <input
                  type=\"text\"
                  placeholder=\"Rechercher une fonctionnalité...\"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className=\"w-full px-6 py-4 pl-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg\"
                />
                <svg className=\"absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                  <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z\" />
                </svg>
              </div>
            </div>

            {/* CTA Principal */}
            <Link href=\"/pricing\" className=\"inline-block\">
              <button 
                className=\"bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-all\"
                onClick={() => handlePricingCTA('hero')}
              >
                🚀 Essai gratuit 7 jours
              </button>
            </Link>
          </div>
        </section>

        {/* Categories Filter */}
        <section className=\"pb-8 px-4\">
          <div className=\"max-w-6xl mx-auto\">
            <div className=\"flex flex-wrap justify-center gap-4\">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
                }`}
              >
                🌟 Toutes ({features.length})
              </button>
              
              {categories.map(category => {
                const categoryFeatures = features.filter(f => f.category === category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
                    }`}
                  >
                    {category.icon} {category.name} ({categoryFeatures.length})
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className=\"pb-20 px-4\">
          <div className=\"max-w-7xl mx-auto\">
            {searchQuery && (
              <div className=\"mb-8 text-center\">
                <p className=\"text-slate-600\">
                  <span className=\"font-semibold\">{filteredFeatures.length}</span> fonctionnalités trouvées pour \"<span className=\"font-semibold\">{searchQuery}</span>\"
                </p>
              </div>
            )}

            <div className=\"grid md:grid-cols-2 lg:grid-cols-3 gap-8\">
              {filteredFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className=\"bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all hover:scale-105 cursor-pointer\"
                  onClick={() => handleFeatureClick(feature)}
                >
                  {feature.screenshot && (
                    <div className=\"aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center\">
                      <span className=\"text-6xl\">{feature.icon}</span>
                    </div>
                  )}

                  <div className=\"p-6\">
                    <div className=\"flex items-start justify-between mb-4\">
                      <div className=\"flex-1\">
                        <h3 className=\"text-xl font-bold text-slate-900 mb-2 flex items-center gap-2\">
                          <span className=\"text-2xl\">{feature.icon}</span>
                          {feature.title}
                        </h3>
                        <p className=\"text-slate-600 leading-relaxed\">{feature.description}</p>
                      </div>
                    </div>

                    {/* Plan Availability */}
                    <div className=\"mb-4\">
                      <p className=\"text-sm font-medium text-slate-700 mb-2\">Disponible dans :</p>
                      <div className=\"flex gap-2\">
                        {feature.planAvailability.starter && (
                          <span className=\"px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full\">
                            Starter
                          </span>
                        )}
                        {feature.planAvailability.professional && (
                          <span className=\"px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full\">
                            Pro
                          </span>
                        )}
                        {feature.planAvailability.enterprise && (
                          <span className=\"px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full\">
                            Enterprise
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className=\"mb-4\">
                      <p className=\"text-sm font-medium text-slate-700 mb-2\">✨ Bénéfices :</p>
                      <ul className=\"space-y-1\">
                        {feature.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className=\"text-sm text-slate-600 flex items-start gap-2\">
                            <span className=\"text-green-500 mt-0.5\">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                        {feature.benefits.length > 3 && (
                          <li className=\"text-sm text-slate-500 italic\">
                            +{feature.benefits.length - 3} autres bénéfices
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Use Cases */}
                    {feature.useCases.length > 0 && (
                      <div className=\"mb-4\">
                        <p className=\"text-sm font-medium text-slate-700 mb-2\">🎯 Cas d'usage :</p>
                        <div className=\"flex flex-wrap gap-1\">
                          {feature.useCases.slice(0, 2).map((useCase, index) => (
                            <span key={index} className=\"px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md\">
                              {useCase}
                            </span>
                          ))}
                          {feature.useCases.length > 2 && (
                            <span className=\"px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-md\">
                              +{feature.useCases.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Demo Link */}
                    {feature.demoUrl && (
                      <div className=\"pt-4 border-t border-slate-100\">
                        <a
                          href={feature.demoUrl}
                          className=\"text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1\"
                          onClick={(e) => {
                            e.stopPropagation();
                            trackEvent('demo_clicked', feature.title);
                          }}
                        >
                          🎬 Voir la démo
                          <svg className=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                            <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14\" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredFeatures.length === 0 && (
              <div className=\"text-center py-16\">
                <div className=\"text-6xl mb-4\">🔍</div>
                <h3 className=\"text-2xl font-bold text-slate-900 mb-2\">Aucune fonctionnalité trouvée</h3>
                <p className=\"text-slate-600 mb-6\">
                  Essayez d'autres mots-clés ou explorez toutes nos catégories
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className=\"bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors\"
                >
                  Voir toutes les fonctionnalités
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Integration Section */}
        <section className=\"py-20 px-4 bg-white\">
          <div className=\"max-w-6xl mx-auto text-center\">
            <h2 className=\"text-4xl font-bold text-slate-900 mb-6\">
              Intégration en 5 minutes ⚡
            </h2>
            <p className=\"text-xl text-slate-600 mb-12\">
              SDK JavaScript simple, API REST complète, webhooks temps réel
            </p>

            <div className=\"grid md:grid-cols-3 gap-8 mb-12\">
              <div className=\"text-center\">
                <div className=\"w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4\">
                  <span className=\"text-2xl\">⚡</span>
                </div>
                <h3 className=\"text-lg font-semibold mb-2\">Setup instantané</h3>
                <p className=\"text-slate-600\">Une ligne de code, et c'est parti</p>
              </div>
              
              <div className=\"text-center\">
                <div className=\"w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4\">
                  <span className=\"text-2xl\">🔗</span>
                </div>
                <h3 className=\"text-lg font-semibold mb-2\">Toutes plateformes</h3>
                <p className=\"text-slate-600\">React, Vue, Angular, Vanilla JS</p>
              </div>
              
              <div className=\"text-center\">
                <div className=\"w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4\">
                  <span className=\"text-2xl\">📊</span>
                </div>
                <h3 className=\"text-lg font-semibold mb-2\">Données temps réel</h3>
                <p className=\"text-slate-600\">Analytics instantanés dès J1</p>
              </div>
            </div>

            <Link href=\"/pricing\" className=\"inline-block\">
              <button 
                className=\"bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all\"
                onClick={() => handlePricingCTA('integration')}
              >
                🚀 Commencer l'intégration
              </button>
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className=\"py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white\">
          <div className=\"max-w-4xl mx-auto text-center\">
            <h2 className=\"text-4xl font-bold mb-6\">
              Prêt à découvrir TrustBoost ?
            </h2>
            <p className=\"text-xl mb-8 text-blue-100 leading-relaxed\">
              <strong className=\"text-white\">7 jours gratuits</strong> pour tester toutes ces fonctionnalités. 
              Setup en 5 minutes, résultats dès le premier jour.
            </p>
            
            <div className=\"flex flex-col sm:flex-row gap-4 justify-center items-center\">
              <Link href=\"/pricing\" className=\"inline-block\">
                <button 
                  className=\"bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all hover:scale-105\"
                  onClick={() => handlePricingCTA('final')}
                >
                  🚀 Essai gratuit 7 jours
                </button>
              </Link>
              
              <a
                href=\"/demo\"
                className=\"border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105\"
                onClick={() => trackEvent('demo_requested', 'final_cta')}
              >
                📹 Voir une démo live
              </a>
            </div>

            <div className=\"mt-8 flex flex-wrap justify-center items-center gap-6 text-blue-200 text-sm\">
              <span>✓ Sans engagement</span>
              <span>✓ Setup en 5min</span>
              <span>✓ Support français</span>
              <span>✓ Toutes fonctionnalités</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

/**
 * Static Site Generation - Données features
 */
export const getStaticProps: GetStaticProps = async () => {
  // Categories de fonctionnalités
  const categories: FeatureCategory[] = [
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Mesure et analyse des comportements utilisateurs',
      icon: '📊'
    },
    {
      id: 'ai-predictions',
      name: 'IA Prédictive',
      description: 'Intelligence artificielle et prédictions comportementales',
      icon: '🤖'
    },
    {
      id: 'conversion',
      name: 'Conversion',
      description: 'Optimisation des conversions et funnel analysis',
      icon: '🎯'
    },
    {
      id: 'integration',
      name: 'Intégrations',
      description: 'APIs, webhooks et connecteurs tiers',
      icon: '🔗'
    },
    {
      id: 'automation',
      name: 'Automation',
      description: 'Automatisation marketing et workflows',
      icon: '⚡'
    }
  ];

  // Fonctionnalités détaillées
  const features: Feature[] = [
    // Analytics
    {
      id: 'real-time-dashboard',
      category: 'analytics',
      title: 'Dashboard Temps Réel',
      description: 'Visualisez vos métriques utilisateurs en temps réel avec des graphiques interactifs et personnalisables.',
      benefits: [
        'Vision instantanée de votre trafic',
        'Alertes automatiques sur les anomalies', 
        'Graphiques personnalisables',
        'Export PDF/CSV automatisé',
        'Partage sécurisé avec votre équipe'
      ],
      useCases: ['E-commerce', 'SaaS', 'Media', 'Lead Gen'],
      icon: '📊',
      planAvailability: { starter: true, professional: true, enterprise: true },
      demoUrl: '/demo/dashboard'
    },
    {
      id: 'user-journey-mapping',
      category: 'analytics',
      title: 'Cartographie Parcours Utilisateur',
      description: 'Analysez le parcours complet de vos utilisateurs, de la première visite à la conversion.',
      benefits: [
        'Visualisation complète du customer journey',
        'Identification des points de friction',
        'Segmentation comportementale avancée',
        'Attribution multi-touch',
        'Analyse des abandons de panier'
      ],
      useCases: ['E-commerce', 'SaaS', 'Lead Generation'],
      icon: '🗺️',
      planAvailability: { starter: false, professional: true, enterprise: true }
    },
    {
      id: 'cohort-analysis',
      category: 'analytics',
      title: 'Analyse de Cohortes',
      description: 'Analysez la rétention et l\\'engagement de vos utilisateurs par cohortes dans le temps.',
      benefits: [
        'Mesure précise de la rétention',
        'Segmentation par date d\\'acquisition',
        'Comparaison performance entre cohortes',
        'Prédiction LTV (Lifetime Value)',
        'Optimisation stratégies retention'
      ],
      useCases: ['SaaS', 'Subscription', 'Mobile Apps'],
      icon: '👥',
      planAvailability: { starter: false, professional: true, enterprise: true }
    },

    // IA Prédictive
    {
      id: 'churn-prediction',
      category: 'ai-predictions',
      title: 'Prédiction de Churn',
      description: 'IA avancée pour prédire quels utilisateurs risquent de partir et pourquoi.',
      benefits: [
        'Prédiction churn avec 85%+ précision',
        'Scoring de risque par utilisateur',
        'Recommandations d\\'actions préventives',
        'Segmentation automatique des risques',
        'ROI prouvé sur la rétention'
      ],
      useCases: ['SaaS', 'Subscription', 'E-commerce'],
      icon: '🔮',
      planAvailability: { starter: false, professional: true, enterprise: true },
      demoUrl: '/demo/churn-prediction'
    },
    {
      id: 'conversion-scoring',
      category: 'ai-predictions',
      title: 'Score de Conversion IA',
      description: 'Algorithme propriétaire qui score en temps réel la probabilité de conversion de chaque visiteur.',
      benefits: [
        'Score temps réel 0-100 par visiteur',
        'Personnalisation dynamique du contenu',
        'Priorisation leads commerciaux',
        'Amélioration +40% taux conversion',
        'Intégration CRM/Marketing automation'
      ],
      useCases: ['E-commerce', 'Lead Gen', 'B2B Sales'],
      icon: '🎯',
      planAvailability: { starter: false, professional: true, enterprise: true }
    },
    {
      id: 'anomaly-detection',
      category: 'ai-predictions',
      title: 'Détection d\\'Anomalies',
      description: 'Détection automatique des comportements anormaux et alertes intelligentes.',
      benefits: [
        'Détection automatique d\\'anomalies',
        'Alertes intelligentes par email/Slack',
        'Analyse des causes racines',
        'Prévention des problèmes critiques',
        'Monitoring 24/7 automatisé'
      ],
      useCases: ['E-commerce', 'SaaS', 'Finance', 'Media'],
      icon: '🚨',
      planAvailability: { starter: true, professional: true, enterprise: true }
    },

    // Conversion
    {
      id: 'ab-testing',
      category: 'conversion',
      title: 'A/B Testing Intégré',
      description: 'Plateforme complète de tests A/B avec analyse statistique avancée.',
      benefits: [
        'Tests A/B/C multivariés',
        'Significance statistique automatique',
        'Tests sur segments spécifiques',
        'Intégration code sans développeur',
        'ROI measurement précis'
      ],
      useCases: ['E-commerce', 'SaaS', 'Lead Gen'],
      icon: '🧪',
      planAvailability: { starter: false, professional: true, enterprise: true }
    },
    {
      id: 'funnel-optimization',
      category: 'conversion',
      title: 'Optimisation de Funnel',
      description: 'Analysez et optimisez chaque étape de votre funnel de conversion.',
      benefits: [
        'Visualisation complète du funnel',
        'Identification des étapes faibles',
        'Suggestions d\\'optimisation IA',
        'Tests comparatifs de funnels',
        'Amélioration +25% conversions moyenne'
      ],
      useCases: ['E-commerce', 'SaaS', 'Lead Generation'],
      icon: '⚡',
      planAvailability: { starter: false, professional: true, enterprise: true }
    },
    {
      id: 'personalization',
      category: 'conversion',
      title: 'Personnalisation Dynamique',
      description: 'Personnalisez l\\'expérience utilisateur en temps réel basé sur le comportement et l\\'IA.',
      benefits: [
        'Contenu personnalisé temps réel',
        'Recommandations produits IA',
        'Pop-ups contextuels intelligents',
        'Pricing dynamique',
        '+60% engagement utilisateur'
      ],
      useCases: ['E-commerce', 'SaaS', 'Media'],
      icon: '🎨',
      planAvailability: { starter: false, professional: false, enterprise: true }
    },

    // Intégrations
    {
      id: 'api-rest',
      category: 'integration',
      title: 'API REST Complète',
      description: 'API REST puissante pour intégrer TrustBoost dans votre stack technique.',
      benefits: [
        'API REST complète et documentée',
        'Webhooks temps réel',
        'SDKs JavaScript/Python/PHP',
        'Rate limiting intelligent',
        'Authentification sécurisée'
      ],
      useCases: ['Développement custom', 'Intégrations'],
      icon: '🔌',
      planAvailability: { starter: true, professional: true, enterprise: true }
    },
    {
      id: 'crm-integrations',
      category: 'integration',
      title: 'Intégrations CRM',
      description: 'Connectez TrustBoost à votre CRM (Salesforce, HubSpot, Pipedrive...).',
      benefits: [
        'Sync automatique des leads qualifiés',
        'Enrichissement profils prospects',
        'Scoring leads dans votre CRM',
        'Attribution revenus/campagnes',
        'Workflows automatisés'
      ],
      useCases: ['B2B Sales', 'Lead Generation'],
      icon: '🤝',
      planAvailability: { starter: false, professional: true, enterprise: true }
    },
    {
      id: 'marketing-automation',
      category: 'integration',
      title: 'Marketing Automation',
      description: 'Intégrations natives avec Mailchimp, Klaviyo, Brevo et autres plateformes email.',
      benefits: [
        'Segmentation comportementale avancée',
        'Triggered emails basés sur actions',
        'Personnalisation contenu emails',
        'A/B test campagnes automatique',
        '+45% taux ouverture moyenne'
      ],
      useCases: ['E-commerce', 'SaaS', 'Lead Gen'],
      icon: '📧',
      planAvailability: { starter: true, professional: true, enterprise: true }
    },

    // Automation
    {
      id: 'smart-alerts',
      category: 'automation',
      title: 'Alertes Intelligentes',
      description: 'Système d\\'alertes avancé avec IA pour vous notifier des événements importants.',
      benefits: [
        'Alertes personnalisables par métrique',
        'IA pour réduire false positives',
        'Multi-canaux (email, Slack, SMS)',
        'Escalation automatique',
        'Recommandations d\\'actions'
      ],
      useCases: ['Monitoring', 'E-commerce', 'SaaS'],
      icon: '🔔',
      planAvailability: { starter: true, professional: true, enterprise: true }
    },
    {
      id: 'automated-reports',
      category: 'automation',
      title: 'Rapports Automatisés',
      description: 'Génération et envoi automatique de rapports personnalisés à votre équipe.',
      benefits: [
        'Rapports PDF automatiques',
        'Fréquence personnalisable',
        'White-label avec votre branding',
        'Distribution multi-destinataires',
        'KPI personnalisés par équipe'
      ],
      useCases: ['Management', 'Client reporting'],
      icon: '📋',
      planAvailability: { starter: false, professional: true, enterprise: true }
    },
    {
      id: 'workflow-automation',
      category: 'automation',
      title: 'Workflows Automatisés',
      description: 'Créez des workflows automatisés basés sur le comportement utilisateur.',
      benefits: [
        'Drag-and-drop workflow builder',
        'Triggers comportementaux avancés',
        'Actions multi-canaux',
        'Conditions logiques complexes',
        'ROI tracking par workflow'
      ],
      useCases: ['E-commerce', 'SaaS', 'Lead nurturing'],
      icon: '⚙️',
      planAvailability: { starter: false, professional: false, enterprise: true }
    },

    // Features bonus
    {
      id: 'gdpr-compliance',
      category: 'integration',
      title: 'Conformité RGPD',
      description: 'Respect total du RGPD avec consentement utilisateur et gestion des données.',
      benefits: [
        'Consentement utilisateur intégré',
        'Anonymisation automatique des données',
        'Export/suppression données sur demande',
        'Audit trail complet',
        'Hébergement données en France'
      ],
      useCases: ['Conformité légale', 'B2B EU'],
      icon: '🛡️',
      planAvailability: { starter: true, professional: true, enterprise: true }
    },
    {
      id: 'multi-domain',
      category: 'analytics',
      title: 'Multi-domaines',
      description: 'Tracking unifié across multiple domaines et sous-domaines.',
      benefits: [
        'Tracking cross-domain unifié',
        'Attribution multi-touch complète',
        'Gestion centralisée propriétés',
        'Rapports consolidés',
        'User journey cross-platform'
      ],
      useCases: ['Multi-brands', 'E-commerce complex'],
      icon: '🌐',
      planAvailability: { starter: false, professional: true, enterprise: true }
    },
    {
      id: 'white-label',
      category: 'integration', 
      title: 'White Label',
      description: 'Interface complètement personnalisable avec votre branding.',
      benefits: [
        'Branding complet custom',
        'URL personnalisée (votre domaine)',
        'Interface white-label',
        'Rapports brandés client',
        'Intégration seamless dans votre produit'
      ],
      useCases: ['Agencies', 'SaaS providers', 'Resellers'],
      icon: '🎨',
      planAvailability: { starter: false, professional: false, enterprise: true }
    }
  ];

  return {
    props: {
      features,
      categories
    },
    revalidate: 3600 // Régénération toutes les heures
  };
};