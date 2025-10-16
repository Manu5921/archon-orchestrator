import { test as setup, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fichier de stockage de l'état d'authentification
const authFile = join(__dirname, '../../../.auth/user.json');

/**
 * Global Setup pour Phase 4 TrustBoost
 * - Configuration authentification
 * - Vérification environnement
 * - Setup des données de test
 * - Validation Core Web Vitals tools
 */
setup('authenticate and setup environment', async ({ page, browser }) => {
  console.log('🚀 Starting Phase 4 TrustBoost E2E Setup...');

  // 1. Vérification de l'environnement
  await page.goto('/health');
  await expect(page.locator('[data-testid="health-status"]')).toContainText('healthy', { timeout: 10000 });

  // 2. Authentification admin pour les tests
  await page.goto('/login');

  // Attendre le formulaire de login
  await page.waitForSelector('[data-testid="login-form"]', { timeout: 15000 });

  // Remplir les credentials de test
  await page.fill('[data-testid="email-input"]', process.env.TEST_ADMIN_EMAIL || 'admin@trustboost.test');
  await page.fill('[data-testid="password-input"]', process.env.TEST_ADMIN_PASSWORD || 'SecureTestPass123!');

  // Cliquer sur login avec attente de la navigation
  await Promise.all([
    page.waitForURL('**/dashboard', { timeout: 15000 }),
    page.click('[data-testid="login-button"]')
  ]);

  // Vérifier l'authentification réussie
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible({ timeout: 10000 });

  // 3. Sauvegarder l'état d'authentification
  await page.context().storageState({ path: authFile });

  // 4. Setup des données de test via API
  const apiContext = await browser.newContext();
  const apiPage = await apiContext.newPage();

  // Configuration du widget de test
  const testWidgetConfig = {
    name: 'E2E Test Widget',
    domain: 'localhost:3000',
    settings: {
      position: 'bottom-right',
      theme: 'light',
      showBadge: true,
      enableAnalytics: true
    },
    security: {
      contentSecurityPolicy: true,
      crossOriginEmbedderPolicy: true,
      featurePolicy: true
    }
  };

  // Créer le widget de test via API
  const widgetResponse = await apiPage.evaluate(async (config) => {
    const response = await fetch('/api/widgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return response.json();
  }, testWidgetConfig);

  // Stocker l'ID du widget pour les tests
  process.env.TEST_WIDGET_ID = widgetResponse.id;

  // 5. Validation des outils de performance
  const performanceApiResponse = await apiPage.evaluate(async () => {
    // Vérifier la disponibilité de l'API Performance Observer
    return {
      performanceObserver: 'PerformanceObserver' in window,
      navigationTiming: 'navigation' in performance,
      resourceTiming: 'getEntriesByType' in performance,
      userTiming: 'mark' in performance && 'measure' in performance,
      webVitals: 'PerformanceObserver' in window && 'supportedEntryTypes' in PerformanceObserver
    };
  });

  console.log('📊 Performance APIs Status:', performanceApiResponse);

  // 6. Setup du monitoring des Core Web Vitals
  await apiPage.addInitScript(() => {
    // Injection du monitoring Web Vitals pour tous les tests
    window.webVitalsData = {
      lcp: null,
      fid: null,
      cls: null,
      fcp: null,
      ttfb: null
    };

    // Observer LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.webVitalsData.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Observer FID (First Input Delay)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          window.webVitalsData.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Observer CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        window.webVitalsData.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  });

  await apiContext.close();

  console.log('✅ Phase 4 TrustBoost E2E Setup completed successfully');
  console.log(`🔐 Auth state saved to: ${authFile}`);
  console.log(`🎯 Test Widget ID: ${process.env.TEST_WIDGET_ID}`);
});
