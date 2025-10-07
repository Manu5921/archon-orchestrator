// TrustBoost Phase 4 - Landing Page d'Accueil
// Agent 4: Business & Commercial Engineer
// MÉTRIQUE OBLIGATOIRE: Conversion rate >5%

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import CTAButton from '../components/CTAButton';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';

/**
 * Page d'accueil optimisée pour la conversion
 * Pattern SSG Next.js pour performance maximale
 */
export default function HomePage({ featuresData, testimonialsData, statsData }) {
  const [isLoading, setIsLoading] = useState(false);

  // Analytics de conversion - tracking obligatoire
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'TrustBoost - Accueil',
        page_location: window.location.href,
        content_group1: 'Landing Pages'
      });
    }

    // Track scroll depth pour engagement
    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrolled > 25 && !window.tracked_25) {
        window.tracked_25 = true;
        trackConversion('scroll_25');
      }
      if (scrolled > 50 && !window.tracked_50) {
        window.tracked_50 = true;
        trackConversion('scroll_50');
      }
      if (scrolled > 75 && !window.tracked_75) {
        window.tracked_75 = true;
        trackConversion('scroll_75');
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
        event_label: 'Home Page',
        value: value
      });
    }
  };

  // Handler CTA principal
  const handleMainCTA = () => {
    trackConversion('cta_click', 'hero_section');
    setIsLoading(true);
  };

  return (
    <>
      <Head>
        <title>TrustBoost - Plateforme de Confiance AI pour Entreprises</title>
        <meta name="description" content="Boostez la confiance de vos utilisateurs avec notre plateforme AI. Analytics comportementaux, prédictions de fidélité et optimisation d'engagement. Essai gratuit 7 jours." />
        <meta name="keywords" content="trust platform, user analytics, AI engagement, customer retention, behavioural analysis" />
        
        {/* Open Graph pour réseaux sociaux */}
        <meta property="og:title" content="TrustBoost - Plateforme de Confiance AI" />
        <meta property="og:description" content="Transformez vos données utilisateur en insights de confiance avec notre IA. Augmentez votre rétention de 40%." />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_SITE_URL}/images/og-trustboost-home.jpg`} />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TrustBoost - Plateforme de Confiance AI" />
        <meta name="twitter:description" content="Analytics comportementaux + IA = +40% de rétention utilisateur" />
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_SITE_URL}/images/twitter-trustboost.jpg`} />
        
        {/* Schema.org Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "TrustBoost",
              "description": "Plateforme de confiance utilisateur avec IA",
              "url": process.env.NEXT_PUBLIC_SITE_URL,
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "29",
                "priceCurrency": "EUR",
                "priceValidUntil": "2025-12-31"
              }
            })
          }}
        />
        
        {/* Preconnect pour performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />

        {/* Hero Section - Optimisé pour conversion */}
        <section className="relative py-20 px-4 text-center">
          <div className="max-w-6xl mx-auto">
            {/* Badge de crédibilité */}
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              Utilisé par 2000+ entreprises en Europe
            </div>

            {/* Titre principal optimisé conversion */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Transformez vos données en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                confiance utilisateur
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Notre IA analyse les comportements et prédit la fidélité de vos utilisateurs. 
              <strong className="text-gray-900"> Augmentez votre rétention de 40%</strong> en 30 jours.
            </p>

            {/* Stats de crédibilité */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {statsData.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Principal */}
            <div className="space-y-4 mb-12">
              <CTAButton
                href="/onboarding/step1"
                onClick={handleMainCTA}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                loading={isLoading}
              >
                Commencer l'essai gratuit - 7 jours
              </CTAButton>
              
              <p className="text-sm text-gray-500">
                ✓ Aucune carte bancaire requise ✓ Setup en moins de 5 minutes ✓ Support dédié
              </p>
            </div>

            {/* Vidéo de démonstration */}
            <div className="relative max-w-4xl mx-auto">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-xl shadow-2xl overflow-hidden">
                <video
                  className="w-full h-full object-cover"
                  poster="/images/demo-thumbnail.jpg"
                  controls
                  onPlay={() => trackConversion('video_play', 'hero_demo')}
                >
                  <source src="/videos/trustboost-demo.mp4" type="video/mp4" />
                  Votre navigateur ne supporte pas la vidéo HTML5.
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Section Problème/Solution */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Problème */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Vous perdez des utilisateurs sans savoir pourquoi ?
                </h2>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3">✗</span>
                    Taux de churn élevé et imprévisible
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3">✗</span>
                    Données analytics dispersées et inutilisables
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3">✗</span>
                    Impossible de prédire qui va partir
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-3">✗</span>
                    Actions de rétention aléatoires et inefficaces
                  </li>
                </ul>
              </div>

              {/* Solution */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  TrustBoost transforme vos données en action
                </h2>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    IA prédictive de fidélité utilisateur
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    Tableau de bord unifié temps réel
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    Alertes automatiques avant le churn
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3">✓</span>
                    Recommandations d'action personnalisées
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Tout ce dont vous avez besoin pour fidéliser
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Une suite complète d'outils alimentés par l'IA pour comprendre et engager vos utilisateurs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuresData.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  benefits={feature.benefits}
                  onLearnMore={() => trackConversion('feature_interest', feature.title)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Ils nous font confiance
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez comment nos clients ont transformé leur rétention
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonialsData.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  {...testimonial}
                  onContactClick={() => trackConversion('testimonial_contact', testimonial.company)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Prêt à transformer votre rétention utilisateur ?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Rejoignez 2000+ entreprises qui ont augmenté leur rétention avec TrustBoost
            </p>
            
            <div className="space-y-6">
              <CTAButton
                href="/pricing"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                onClick={() => trackConversion('cta_click', 'final_section')}
              >
                Voir les tarifs - À partir de 29€/mois
              </CTAButton>
              
              <p className="text-blue-100">
                <Link href="/demo" className="underline hover:text-white">
                  Ou demander une démo personnalisée →
                </Link>
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

/**
 * Static Site Generation - Next.js Pattern
 * Données pré-buildées pour performance maximale
 */
export async function getStaticProps() {
  // En production, ces données viendraient d'un CMS ou API
  const featuresData = [
    {
      icon: '🔮',
      title: 'Prédiction IA',
      description: 'Notre algorithme prédit qui va partir avant qu\'il ne le fasse',
      benefits: ['92% de précision', 'Alertes temps réel', 'Actions recommandées']
    },
    {
      icon: '📊',
      title: 'Analytics Unifiés',
      description: 'Toutes vos données utilisateur dans un tableau de bord intuitif',
      benefits: ['Vue 360° utilisateur', 'Métriques personnalisées', 'Export facile']
    },
    {
      icon: '🎯',
      title: 'Campagnes Ciblées',
      description: 'Automatisez vos actions de rétention selon les profils utilisateur',
      benefits: ['Segmentation smart', 'A/B testing intégré', 'ROI optimisé']
    }
  ];

  const testimonialsData = [
    {
      name: 'Marie Dubois',
      role: 'Head of Growth',
      company: 'TechCorp',
      image: '/images/testimonials/marie.jpg',
      content: 'TrustBoost nous a aidés à réduire notre churn de 35% en 2 mois. Les prédictions IA sont bluffantes.',
      results: '+35% rétention'
    },
    {
      name: 'Pierre Martin',
      role: 'CEO',
      company: 'StartupXYZ',
      image: '/images/testimonials/pierre.jpg', 
      content: 'Setup en 5 minutes, résultats immédiats. Exactement ce qu\'on cherchait pour notre scale-up.',
      results: '5min de setup'
    },
    {
      name: 'Sophie Chen',
      role: 'Data Analyst',
      company: 'BigCorp',
      image: '/images/testimonials/sophie.jpg',
      content: 'Enfin une plateforme qui unifie toutes nos données utilisateur. Le dashboard est parfait.',
      results: '100% données unifiées'
    }
  ];

  const statsData = [
    { value: '2000+', label: 'Entreprises clientes' },
    { value: '40%', label: 'Rétention moyenne' },
    { value: '5min', label: 'Temps de setup' },
    { value: '92%', label: 'Précision IA' }
  ];

  return {
    props: {
      featuresData,
      testimonialsData,
      statsData
    },
    // Régénération statique toutes les 24h pour freshness
    revalidate: 86400
  };
}