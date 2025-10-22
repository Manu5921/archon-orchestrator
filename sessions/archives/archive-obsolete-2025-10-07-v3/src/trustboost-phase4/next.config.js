/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration SSG pour les pages commerciales TrustBoost
  output: 'export',

  // Optimisation des images pour les landing pages
  images: {
    unoptimized: true, // Requis pour static export
    domains: ['localhost']
  },

  // Configuration pour les performances
  experimental: {
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 25
  },

  // Optimisation du bundle pour les pages commerciales
  swcMinify: true,

  // Configuration des redirections pour l'onboarding
  async redirects() {
    return [
      {
        source: '/signup',
        destination: '/onboarding/step1',
        permanent: false
      }
    ];
  },

  // Headers de sécurité pour les pages commerciales
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },

  // Configuration du sitemap pour SEO
  trailingSlash: true,

  // Variables d'environnement publiques pour Stripe
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://trustboost.ai'
  }
};

module.exports = nextConfig;
