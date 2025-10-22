/**
 * AGENT 6: Performance & Optimization Engineer
 * TrustBoost Phase 4 - Performance Configuration
 *
 * Configuration centralisée pour tous les composants performance
 * Basée sur les patterns Context7 et requirements TrustBoost Phase 4
 */

export const PERFORMANCE_CONFIG = {
  // MISSION REQUIREMENTS - Core targets
  targets: {
    lighthouse: {
      performance: 95,    // >95 Lighthouse score requirement
      accessibility: 95,
      bestPractices: 95,
      seo: 95,
      pwa: 90
    },

    coreWebVitals: {
      FCP: 2000,         // First Contentful Paint <2s
      LCP: 2500,         // Largest Contentful Paint <2.5s
      FID: 100,          // First Input Delay <100ms
      CLS: 0.1,          // Cumulative Layout Shift <0.1
      TTFB: 600,         // Time to First Byte <600ms
      INP: 200           // Interaction to Next Paint <200ms
    },

    bundleSize: {
      widget: 20 * 1024,     // <20KB widget gzipped requirement
      total: 100 * 1024,     // <100KB total bundle
      chunks: 50 * 1024      // <50KB per chunk
    },

    database: {
      p50: 15,           // <15ms median
      p95: 30,           // <30ms p95
      p99: 50,           // <50ms p99 requirement
      errorRate: 0.01,   // <1% error rate
      connectionPool: 20  // Max connections
    },

    cache: {
      hitRatio: 0.9,     // >90% hit ratio requirement
      responseTime: 50,   // <50ms cache response
      memoryLimit: 100,   // 100 entries max
      ttl: 300000        // 5 minutes TTL
    },

    api: {
      responseTime: 100,  // <100ms p95 requirement
      throughput: 1000,   // 1000 RPS target
      availability: 0.999 // 99.9% uptime
    },

    widget: {
      loadTime: 3000,    // <3s load time on 3G requirement
      interactionDelay: 50, // <50ms interaction delay
      memoryUsage: 10 * 1024 * 1024, // 10MB max memory
      renderTime: 16     // <16ms per frame (60fps)
    }
  },

  // MONITORING CONFIGURATION
  monitoring: {
    realTime: {
      enabled: true,
      interval: 1000,           // 1 second updates
      websocketPort: 3001,
      maxClients: 10,
      retentionPeriod: 3600000  // 1 hour
    },

    webVitals: {
      enabled: true,
      reportingEndpoint: '/api/performance-metrics',
      batchSize: 10,
      flushInterval: 5000,      // 5 seconds
      enableAttribution: true    // For debugging
    },

    lighthouse: {
      enabled: true,
      schedule: '0 */6 * * *',  // Every 6 hours
      numberOfRuns: 5,
      preset: 'perf',           // Performance focus
      throttling: 'simulate',
      device: 'mobile'
    },

    alerts: {
      enabled: true,
      thresholds: {
        performanceRegression: 0.05,  // 5% degradation
        errorRateSpike: 0.02,         // 2% error rate
        latencySpike: 2.0,            // 2x normal latency
        cacheHitRatioDrop: 0.1        // 10% drop in hit ratio
      },
      cooldownPeriod: 300000,     // 5 minutes between alerts
      maxAlertsPerHour: 10
    }
  },

  // CACHE STRATEGY CONFIGURATION
  cache: {
    strategy: 'swr',  // SWR requirement

    swr: {
      maxAge: 60,              // 1 minute fresh
      staleWhileRevalidate: 300, // 5 minutes stale
      maxAttempts: 3,
      retryDelay: 1000
    },

    isr: {
      revalidateTime: 3600,    // 1 hour revalidation
      fallback: 'blocking',
      maxConcurrentBuilds: 3
    },

    cdn: {
      enabled: true,
      provider: 'vercel',
      cacheControl: 's-maxage=3600, stale-while-revalidate=86400',
      purgeEndpoint: '/api/cache/purge',
      geoDistribution: true
    },

    memory: {
      max: 100,                // 100 entries
      maxAge: 600000,          // 10 minutes
      updateAgeOnGet: true,
      updateAgeOnHas: true
    },

    redis: {
      enabled: false,          // Disabled for simplicity
      host: 'localhost',
      port: 6379,
      keyPrefix: 'trustboost:',
      maxRetries: 3
    }
  },

  // DATABASE OPTIMIZATION CONFIGURATION
  database: {
    optimization: {
      enabled: true,
      connectionPooling: true,
      preparedStatements: true,
      queryAnalysis: true,
      indexRecommendations: true
    },

    pool: {
      min: 5,                  // Minimum connections
      max: 20,                 // Maximum connections
      acquire: 30000,          // 30s acquisition timeout
      idle: 30000,             // 30s idle timeout
      evict: 1000             // Eviction check interval
    },

    queryCache: {
      enabled: true,
      size: 1000,              // 1000 queries
      ttl: 300000,             // 5 minutes
      excludePatterns: [
        'INSERT', 'UPDATE', 'DELETE',
        'NOW()', 'RAND()', 'CURRENT_TIMESTAMP'
      ]
    },

    monitoring: {
      slowQueryThreshold: 25,   // Log queries >25ms
      enableExplainPlan: true,
      trackQueryFrequency: true,
      generateIndexSuggestions: true
    }
  },

  // BUNDLE OPTIMIZATION CONFIGURATION
  bundleOptimization: {
    enabled: true,

    analysis: {
      analyzeImports: true,
      detectUnusedCode: true,
      trackDependencies: true,
      generateRecommendations: true
    },

    optimization: {
      enableTreeShaking: true,
      enableCodeSplitting: true,
      enableCompression: true,
      minification: 'aggressive',
      sourceMaps: false        // Disabled in production
    },

    widget: {
      maxSize: 15 * 1024,      // Stricter 15KB for widget
      compressionTarget: 3.5,   // 3.5x compression ratio
      criticalCSS: true,
      inlineSmallAssets: true
    },

    thresholds: {
      warningSize: 18 * 1024,  // Warning at 18KB
      errorSize: 20 * 1024,    // Error at 20KB
      compressionRatio: 3.0    // Minimum 3x compression
    }
  },

  // REPORTING CONFIGURATION
  reporting: {
    weekly: {
      enabled: true,
      schedule: '0 9 * * 1',   // Monday 9 AM
      outputDir: './reports/performance',
      format: 'html',          // html, json, markdown
      includeCharts: true,
      retention: 12            // Keep 12 weeks
    },

    daily: {
      enabled: false,
      schedule: '0 9 * * *',   // Daily 9 AM
      format: 'json',
      lightweight: true
    },

    realTime: {
      dashboard: {
        enabled: true,
        port: 3001,
        theme: 'dark',
        autoRefresh: 5000,     // 5 seconds
        maxDataPoints: 100
      },

      notifications: {
        enabled: true,
        channels: ['console', 'webhook'],
        webhook: {
          url: null,           // Configure externally
          timeout: 5000
        }
      }
    }
  },

  // INTEGRATION CONFIGURATION
  integration: {
    vercelAnalytics: {
      enabled: false,          // Configure externally
      debug: false,
      beforeSend: null         // Custom filter function
    },

    lighthouse: {
      ci: true,
      githubIntegration: true,
      statusContext: 'trustboost-performance',
      temporaryStorage: true
    },

    nextjs: {
      webVitalsAttribution: ['CLS', 'LCP'],
      experimentalFlags: {
        optimizeRouterScrolling: true,
        webVitalsAttribution: true
      }
    },

    cicd: {
      failOnRegression: true,
      performanceThreshold: 90,
      bundleSizeThreshold: 20 * 1024,
      generateArtifacts: true
    }
  },

  // DEVELOPMENT CONFIGURATION
  development: {
    enableDebugLogging: true,
    enablePerformanceMarks: true,
    enableMemoryProfiling: false,
    enableCPUProfiling: false,

    mockData: {
      enabled: false,
      webVitals: true,
      databaseQueries: true,
      cacheOperations: true
    },

    testing: {
      enableE2EPerformance: true,
      enableLighthouseTests: true,
      enableBundleTests: true,
      testTimeout: 30000       // 30 seconds
    }
  },

  // ENVIRONMENT-SPECIFIC OVERRIDES
  environments: {
    development: {
      targets: {
        lighthouse: { performance: 70 },  // Relaxed for dev
        coreWebVitals: {
          FCP: 3000,
          LCP: 4000,
          FID: 300,
          CLS: 0.25
        }
      },
      monitoring: {
        realTime: { interval: 5000 },    // 5 second updates
        alerts: { enabled: false }        // Disabled in dev
      }
    },

    staging: {
      targets: {
        lighthouse: { performance: 85 },  // Intermediate targets
        coreWebVitals: {
          FCP: 2500,
          LCP: 3000,
          FID: 200,
          CLS: 0.15
        }
      },
      monitoring: {
        alerts: { enabled: true }
      }
    },

    production: {
      // Use default strict targets
      monitoring: {
        alerts: { enabled: true },
        realTime: { enabled: true }
      },
      reporting: {
        weekly: { enabled: true },
        realTime: { enabled: true }
      }
    }
  }
};

/**
 * Get configuration for specific environment
 */
export function getEnvironmentConfig(env = 'production') {
  const baseConfig = { ...PERFORMANCE_CONFIG };
  const envOverrides = PERFORMANCE_CONFIG.environments[env] || {};

  return deepMerge(baseConfig, envOverrides);
}

/**
 * Deep merge configuration objects
 */
function deepMerge(target, source) {
  const result = { ...target };

  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

/**
 * Validate configuration against requirements
 */
export function validateConfig(config) {
  const errors = [];

  // Validate core targets
  if (config.targets.lighthouse.performance < 95) {
    errors.push('Lighthouse performance target must be >= 95');
  }

  if (config.targets.bundleSize.widget > 20 * 1024) {
    errors.push('Widget bundle size target must be <= 20KB');
  }

  if (config.targets.database.p99 > 50) {
    errors.push('Database P99 target must be <= 50ms');
  }

  if (config.targets.cache.hitRatio < 0.9) {
    errors.push('Cache hit ratio target must be >= 90%');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export default PERFORMANCE_CONFIG;
