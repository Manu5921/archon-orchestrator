/** @type {import('next').NextConfig} */

// Import required modules
const { withSentryConfig } = require('@sentry/nextjs')
const path = require('path')

// Build configuration
const nextConfig = {
  // Output configuration for standalone deployment
  output: 'standalone',
  
  // Enable experimental features
  experimental: {
    // Enable server components logging
    logging: {
      level: process.env.NODE_ENV === 'production' ? 'error' : 'info',
      fullUrl: true,
    },
    // Optimize server-side rendering
    optimizePackageImports: ['@trustboost/ui', 'lucide-react', 'date-fns'],
    // Enable partial pre-rendering
    ppr: false, // Disable until stable
  },

  // Build ID for consistent deployments
  generateBuildId: async () => {
    return process.env.GITHUB_SHA || process.env.VERCEL_GIT_COMMIT_SHA || 'local-build'
  },

  // Power by header removal
  poweredByHeader: false,

  // Compression
  compress: true,

  // Images configuration
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      'trustboost-phase4.vercel.app',
      'trustboost-phase4-staging.vercel.app',
      'images.unsplash.com',
      'cdn.trustboost.com'
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'cdn.trustboost.com',
      }
    ]
  },

  // Headers for security and performance
  async headers() {
    const securityHeaders = [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on'
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload'
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
      }
    ]

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/api/(.*)',
        headers: [
          ...securityHeaders,
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate'
          }
        ]
      }
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      }
    ]
  },

  // Rewrites for API routes
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/health',
          destination: '/api/health'
        }
      ]
    }
  },

  // Webpack configuration
  webpack: (config, { dev, isServer, buildId }) => {
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        minimize: true,
      }
    }

    // Bundle analyzer in development
    if (dev && process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          openAnalyzer: true,
        })
      )
    }

    // Ignore certain files in production builds
    if (!dev) {
      config.module.rules.push({
        test: /\.(test|spec)\.(js|jsx|ts|tsx)$/,
        loader: 'ignore-loader'
      })
    }

    return config
  },

  // Environment variables validation
  env: {
    CUSTOM_BUILD_ID: process.env.GITHUB_SHA || process.env.VERCEL_GIT_COMMIT_SHA || 'development',
    BUILD_TIME: new Date().toISOString(),
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src', 'app', 'pages', 'components', 'lib', 'utils']
  },

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // Server runtime configuration
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: process.env.SECRET_KEY,
  },

  // Public runtime configuration
  publicRuntimeConfig: {
    // Will be available on both server and client
    version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
    buildId: process.env.GITHUB_SHA || 'local',
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

// Sentry configuration
const sentryOptions = {
  org: process.env.SENTRY_ORG || 'trustboost-phase4',
  project: process.env.SENTRY_PROJECT || 'trustboost-frontend',
  
  // Upload source maps in production
  silent: process.env.NODE_ENV !== 'production',
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  hideSourceMaps: true,
  disableLogger: process.env.NODE_ENV === 'production',
  
  // Tunnel through Next.js rewrite for better reliability
  tunnelRoute: '/monitoring',
  
  // Additional Sentry options
  authToken: process.env.SENTRY_AUTH_TOKEN,
}

// Export with Sentry wrapper if in production
module.exports = process.env.NODE_ENV === 'production' && process.env.SENTRY_AUTH_TOKEN 
  ? withSentryConfig(nextConfig, sentryOptions)
  : nextConfig