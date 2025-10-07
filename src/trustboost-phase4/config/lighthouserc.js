/**
 * AGENT 6: Performance & Optimization Engineer
 * TrustBoost Phase 4 - Lighthouse CI Configuration
 * 
 * Configuration basée sur patterns Context7 /googlechrome/lighthouse-ci
 * - Core Web Vitals >95 score target
 * - Performance budget enforcement
 * - Automated CI/CD integration
 * - Real-time monitoring
 */

module.exports = {
  ci: {
    // Collection configuration for performance analysis
    collect: {
      numberOfRuns: 5, // Multiple runs for consistent results
      settings: {
        // Core Web Vitals focus
        onlyCategories: ['performance'],
        
        // Desktop and mobile testing
        preset: 'desktop',
        
        // Performance optimizations
        skipAudits: [
          'redirects-http', // Skip if not applicable
        ],
        
        // Lighthouse flags for better accuracy
        chromeFlags: '--no-sandbox --headless --disable-gpu --disable-dev-shm-usage',
        
        // Extended timeout for complex apps
        maxWaitForLoad: 45000,
        maxWaitForFcp: 30000,
        
        // Network throttling for realistic conditions
        throttlingMethod: 'simulate',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 10240,
          uploadThroughputKbps: 10240
        },
        
        // Budget path for performance limits
        budgetPath: './src/trustboost-phase4/config/budget.json'
      }
    },
    
    // Assertions for >95 Lighthouse scores
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Core Web Vitals targets (Context7 patterns)
        'first-contentful-paint': ['error', { 
          maxNumericValue: 2000, 
          aggregationMethod: 'optimistic' 
        }],
        'largest-contentful-paint': ['error', { 
          maxNumericValue: 2500, 
          aggregationMethod: 'optimistic' 
        }],
        'first-meaningful-paint': ['error', { 
          maxNumericValue: 2000, 
          aggregationMethod: 'optimistic' 
        }],
        'speed-index': ['error', { 
          maxNumericValue: 3000, 
          aggregationMethod: 'optimistic' 
        }],
        'interactive': ['error', { 
          maxNumericValue: 5000, 
          aggregationMethod: 'optimistic' 
        }],
        'max-potential-fid': ['error', { 
          maxNumericValue: 100, 
          aggregationMethod: 'optimistic' 
        }],
        'cumulative-layout-shift': ['error', { 
          maxNumericValue: 0.1, 
          aggregationMethod: 'optimistic' 
        }],
        'total-blocking-time': ['error', { 
          maxNumericValue: 200, 
          aggregationMethod: 'optimistic' 
        }],
        
        // Performance categories - Target >95 score
        'categories:performance': ['error', { minScore: 0.95 }],
        
        // Resource optimization assertions
        'performance-budget': 'error',
        'resource-summary:document:size': ['error', { maxNumericValue: 14000 }],
        'resource-summary:font:count': ['warn', { maxNumericValue: 2 }],
        'resource-summary:image:size': ['error', { maxNumericValue: 51200 }], // 50KB
        'resource-summary:script:size': ['error', { maxNumericValue: 20480 }], // 20KB widget target
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 10240 }], // 10KB
        'resource-summary:third-party:count': ['warn', { maxNumericValue: 3 }],
        
        // Best practices for performance
        'uses-rel-preconnect': 'warn',
        'uses-rel-preload': 'warn', 
        'efficient-animated-content': 'error',
        'offscreen-images': 'error',
        'render-blocking-resources': 'error',
        'unminified-css': 'error',
        'unminified-javascript': 'error',
        'unused-css-rules': 'warn',
        'unused-javascript': 'error',
        'uses-optimized-images': 'error',
        'uses-responsive-images': 'error',
        'uses-text-compression': 'error',
        'uses-webp-images': 'error',
        
        // Modern web standards
        'modern-image-formats': 'error',
        'uses-http2': 'warn',
        
        // JavaScript optimizations
        'legacy-javascript': 'warn',
        'duplicated-javascript': 'error',
        
        // Font optimization
        'font-display': 'error',
        'preload-fonts': 'warn',
        
        // Critical rendering path
        'critical-request-chains': 'warn',
        'prioritize-lcp-image': 'error'
      }
    },
    
    // Upload configuration for CI/CD integration
    upload: {
      target: 'temporary-public-storage',
      
      // GitHub integration for PR status checks
      githubAppToken: process.env.LHCI_GITHUB_APP_TOKEN,
      githubStatusContextSuffix: '-trustboost-phase4',
      
      // URL replacement patterns for consistent reporting
      urlReplacementPatterns: [
        's/localhost:[0-9]+/localhost:PORT/g',
        's/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/SESSION_ID/g'
      ]
    },
    
    // Server configuration for advanced monitoring
    server: {
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: './lighthouse-ci-data.db'
      }
    }
  }
};

/**
 * Mobile configuration for comprehensive testing
 */
const mobileConfig = {
  ...module.exports,
  ci: {
    ...module.exports.ci,
    collect: {
      ...module.exports.ci.collect,
      settings: {
        ...module.exports.ci.collect.settings,
        preset: 'perf', // Mobile performance preset
        emulatedFormFactor: 'mobile',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 0,
          downloadThroughputKbps: 1638.4,
          uploadThroughputKbps: 750
        }
      }
    }
  }
};

// Export configurations based on environment
if (process.env.LIGHTHOUSE_MOBILE === 'true') {
  module.exports = mobileConfig;
}

/**
 * Performance budget configuration
 * Separate file: budget.json
 */
const performanceBudget = [
  {
    path: '/*',
    timings: [
      {
        metric: 'first-contentful-paint',
        budget: 2000
      },
      {
        metric: 'largest-contentful-paint', 
        budget: 2500
      },
      {
        metric: 'speed-index',
        budget: 3000
      },
      {
        metric: 'interactive',
        budget: 5000
      },
      {
        metric: 'first-meaningful-paint',
        budget: 2000
      },
      {
        metric: 'max-potential-fid',
        budget: 100
      }
    ],
    resourceSizes: [
      {
        resourceType: 'document',
        budget: 14
      },
      {
        resourceType: 'font',
        budget: 30
      },
      {
        resourceType: 'image',
        budget: 50
      },
      {
        resourceType: 'script',
        budget: 20  // 20KB widget target
      },
      {
        resourceType: 'stylesheet',
        budget: 10
      },
      {
        resourceType: 'total',
        budget: 100
      }
    ],
    resourceCounts: [
      {
        resourceType: 'third-party',
        budget: 3
      },
      {
        resourceType: 'font',
        budget: 2
      }
    ]
  }
];

module.exports.performanceBudget = performanceBudget;