import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Configuration des répertoires de tests
  testDir: 'tests/e2e',
  
  // Exécution parallèle complète pour performance optimale
  fullyParallel: true,
  
  // Échec sur CI si test.only oublié
  forbidOnly: !!process.env.CI,
  
  // Retry stratégique: 2 sur CI, 0 en local
  retries: process.env.CI ? 2 : 0,
  
  // Workers optimisés pour CI/local
  workers: process.env.CI ? 1 : undefined,
  
  // Timeout global des tests (Phase 4 TrustBoost requirement)
  timeout: 30000,
  
  // Expect timeout pour assertions
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      threshold: 0.2,
      maxDiffPixels: 100
    }
  },
  
  // Reporter HTML + JUnit pour CI/CD
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['junit', { outputFile: 'test-results/junit-report.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],
  
  // Dossier de sortie pour artifacts
  outputDir: 'test-results/',
  
  // Configuration globale des tests
  use: {
    // Base URL pour l'application TrustBoost
    baseURL: 'http://localhost:3000',
    
    // Trace sur premier retry pour debugging
    trace: 'on-first-retry',
    
    // Screenshots sur échec pour analyse
    screenshot: 'only-on-failure',
    
    // Vidéo sur retry pour investigation
    video: 'retain-on-failure',
    
    // Ignorer erreurs HTTPS en dev
    ignoreHTTPSErrors: true,
    
    // Timeout pour actions individuelles
    actionTimeout: 10000,
    
    // Headers par défaut
    extraHTTPHeaders: {
      'Accept': 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
  },
  
  // Configuration cross-browser + mobile (Context7 patterns)
  projects: [
    // Setup global pour authentification
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
      use: { ...devices['Desktop Chrome'] }
    },
    
    // Desktop Browsers - Core Web Vitals testing
    {
      name: 'chromium-desktop',
      dependencies: ['setup'],
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
      grep: /@desktop|@performance|@security/
    },
    
    {
      name: 'firefox-desktop',
      dependencies: ['setup'],
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
      grep: /@desktop|@cross-browser/
    },
    
    {
      name: 'webkit-desktop',
      dependencies: ['setup'],
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
      grep: /@desktop|@cross-browser/
    },
    
    // Branded browsers pour compatibilité maximale
    {
      name: 'chrome-branded',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 1920, height: 1080 }
      },
      grep: /@performance|@real-browser/
    },
    
    {
      name: 'edge-branded',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
        viewport: { width: 1920, height: 1080 }
      },
      grep: /@cross-browser|@real-browser/
    },
    
    // Mobile Testing - Responsive validation
    {
      name: 'mobile-chrome',
      dependencies: ['setup'],
      use: { 
        ...devices['Pixel 5'],
        isMobile: true
      },
      grep: /@mobile|@responsive/
    },
    
    {
      name: 'mobile-safari',
      dependencies: ['setup'],
      use: { 
        ...devices['iPhone 12'],
        isMobile: true
      },
      grep: /@mobile|@responsive/
    },
    
    {
      name: 'tablet-ipad',
      dependencies: ['setup'],
      use: { 
        ...devices['iPad Pro'],
        isMobile: false
      },
      grep: /@tablet|@responsive/
    },
    
    // Performance testing spécialisé
    {
      name: 'performance-monitoring',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-extensions-except=/path/to/lighthouse',
            '--load-extension=/path/to/lighthouse'
          ]
        }
      },
      grep: /@performance|@vitals/
    }
  ],
  
  // Configuration serveur web pour tests E2E
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe'
  }
});