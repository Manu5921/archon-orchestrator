module.exports = {
  ci: {
    collect: {
      // URL patterns to test
      url: [
        'http://localhost:3000',
        'http://localhost:3000/lighthouse-test.html',
      ],
      
      // Start server automatically before testing
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Server running on port',
      startServerReadyTimeout: 120000, // 2 minutes
      
      // Number of runs per URL for more reliable results
      numberOfRuns: 3,
      
      // Chrome launch settings
      settings: {
        chromeFlags: [
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--headless=new'
        ],
      },
    },
    
    assert: {
      // Performance thresholds
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['warn', { minScore: 0.90 }], // Good accessibility standard
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        'categories:pwa': 'off', // PWA not required for this project
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }], // 2 seconds
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }], // 4 seconds
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        
        // Accessibility specific metrics
        'color-contrast': 'warn',
        'image-alt': 'error',
        'label': 'error',
        'valid-lang': 'error',
        'meta-viewport': 'error',
        
        // Security
        'is-on-https': 'off', // OK for development
        'uses-http2': 'off', // Not required for development
      },
    },
    
    upload: {
      // Results storage - using temporary store for now
      target: 'temporary-public-storage',
      
      // Could be configured for permanent storage:
      // target: 'filesystem',
      // outputDir: './lighthouse-reports',
    },
    
    // Server configuration if needed
    server: {
      port: 9009,
      host: 'localhost',
    },
  },
};