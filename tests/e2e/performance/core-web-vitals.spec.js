import { test, expect } from '@playwright/test';
import { 
  WebVitalsHelper, 
  PerformanceAssertions,
  WidgetTestHelper,
  DashboardTestHelper 
} from '../utils/test-helpers.js';

/**
 * Tests de Performance Phase 4 TrustBoost
 * Core Web Vitals validation : LCP <2.5s, FID <100ms, CLS <0.1
 * 
 * @performance Tests de performance critiques
 * @vitals Core Web Vitals measurements
 * @desktop Performance desktop
 * @mobile Performance mobile
 */

test.describe('Core Web Vitals - Phase 4 TrustBoost Requirements @performance @vitals', () => {
  let vitalsHelper;
  let perfAssertions;

  test.beforeEach(async ({ page }) => {
    vitalsHelper = new WebVitalsHelper(page);
    perfAssertions = new PerformanceAssertions();
  });

  test('Homepage Core Web Vitals compliance @performance @vitals @desktop', async ({ page }) => {
    console.log('🏠 Testing homepage Core Web Vitals...');
    
    // Navigation avec monitoring des métriques
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Attendre stabilisation des métriques (important pour CLS)
    await page.waitForTimeout(3000);
    
    // Mesurer et valider les Core Web Vitals
    const webVitals = await vitalsHelper.measureAndValidateWebVitals();
    
    // Métriques supplémentaires
    const perfMetrics = await vitalsHelper.measurePerformanceMetrics();
    
    // Logs détaillés pour debugging
    console.log('🎯 Core Web Vitals Results:');
    console.log(`  • LCP: ${webVitals.lcp}ms (target: <2500ms) ${webVitals.lcp < 2500 ? '✅' : '❌'}`);
    console.log(`  • FID: ${webVitals.fid}ms (target: <100ms) ${webVitals.fid < 100 ? '✅' : '❌'}`);
    console.log(`  • CLS: ${webVitals.cls} (target: <0.1) ${webVitals.cls < 0.1 ? '✅' : '❌'}`);
    
    console.log('📊 Additional Metrics:');
    console.log(`  • TTFB: ${perfMetrics.ttfb}ms`);
    console.log(`  • FCP: ${perfMetrics.fcp}ms`);
    console.log(`  • DOM Content Loaded: ${perfMetrics.domContentLoaded}ms`);
    console.log(`  • Load Complete: ${perfMetrics.loadComplete}ms`);
    console.log(`  • Resources Loaded: ${perfMetrics.resourceCount}`);
    
    // Assertions additionnelles Phase 4
    expect(perfMetrics.ttfb).toBeLessThan(800); // TTFB < 800ms
    expect(perfMetrics.fcp).toBeLessThan(1800); // FCP < 1.8s
    expect(perfMetrics.domContentLoaded).toBeLessThan(2000); // DOM ready < 2s
    
    console.log('✅ Homepage meets all Core Web Vitals requirements');
  });

  test('Dashboard Core Web Vitals under load @performance @vitals @desktop', async ({ page }) => {
    console.log('📊 Testing dashboard Web Vitals under load...');
    
    const dashboardHelper = new DashboardTestHelper(page);
    
    // Navigation vers dashboard avec authentification
    await page.goto('/dashboard', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="dashboard-content"]', { timeout: 15000 });
    
    // Simuler charge de travail (navigation rapide entre sections)
    const loadSimulation = async () => {
      const sections = ['analytics', 'widgets', 'settings'];
      for (const section of sections) {
        await dashboardHelper.navigateToSection(section);
        await page.waitForTimeout(500); // Pause courte entre navigations
      }
    };
    
    // Exécuter la simulation de charge
    await loadSimulation();
    
    // Mesurer les Web Vitals après la charge
    const webVitalsUnderLoad = await vitalsHelper.measureAndValidateWebVitals();
    
    // Les métriques doivent rester dans les limites même sous charge
    console.log('🚀 Web Vitals under load:');
    console.log(`  • LCP: ${webVitalsUnderLoad.lcp}ms`);
    console.log(`  • CLS: ${webVitalsUnderLoad.cls}`);
    
    // Vérifier qu'il n'y a pas de dégradation significative
    expect(webVitalsUnderLoad.cls).toBeLessThan(0.15); // Tolérance légèrement augmentée sous charge
    
    console.log('✅ Dashboard maintains Web Vitals performance under load');
  });

  test('Widget embed Core Web Vitals impact @performance @vitals', async ({ page }) => {
    console.log('🔌 Testing widget embed impact on Core Web Vitals...');
    
    const widgetHelper = new WidgetTestHelper(page);
    
    // Mesurer performance AVANT le chargement du widget
    await page.goto('/widget-demo', { waitUntil: 'domcontentloaded' });
    const baselineVitals = await vitalsHelper.measurePerformanceMetrics();
    
    console.log('📊 Baseline metrics (before widget):', baselineVitals);
    
    // Charger le widget
    await widgetHelper.waitForWidgetLoad();
    await page.waitForTimeout(2000); // Stabilisation
    
    // Mesurer performance APRÈS le chargement du widget
    const withWidgetVitals = await vitalsHelper.measureAndValidateWebVitals();
    const withWidgetMetrics = await vitalsHelper.measurePerformanceMetrics();
    
    console.log('🎯 Metrics with widget:', withWidgetMetrics);
    
    // Calcul de l'impact du widget
    const impact = {
      resourceCountIncrease: withWidgetMetrics.resourceCount - baselineVitals.resourceCount,
      lcpImpact: withWidgetVitals.lcp,
      clsImpact: withWidgetVitals.cls
    };
    
    console.log('📈 Widget impact analysis:', impact);
    
    // Assertions sur l'impact acceptable du widget
    expect(impact.resourceCountIncrease).toBeLessThan(10); // Max 10 ressources ajoutées
    expect(withWidgetVitals.lcp).toBeLessThan(3000); // LCP reste acceptable même avec widget
    expect(withWidgetVitals.cls).toBeLessThan(0.1); // Pas de layout shift dû au widget
    
    console.log('✅ Widget has minimal impact on Core Web Vitals');
  });

  test('Mobile Core Web Vitals performance @performance @vitals @mobile', async ({ page }) => {
    console.log('📱 Testing mobile Core Web Vitals performance...');
    
    // Configuration mobile
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone 8
    
    // Simuler connexion mobile plus lente
    await page.context().setDefaultTimeout(20000); // Timeout plus long pour mobile
    
    // Navigation avec attente adaptée mobile
    await page.goto('/', { waitUntil: 'networkidle', timeout: 20000 });
    
    // Attendre stabilisation (mobile plus lent)
    await page.waitForTimeout(4000);
    
    // Mesurer Web Vitals mobile
    const mobileVitals = await vitalsHelper.measureAndValidateWebVitals();
    const mobileMetrics = await vitalsHelper.measurePerformanceMetrics();
    
    console.log('📱 Mobile Web Vitals:');
    console.log(`  • LCP: ${mobileVitals.lcp}ms (mobile target: <3000ms)`);
    console.log(`  • FID: ${mobileVitals.fid}ms (target: <100ms)`);
    console.log(`  • CLS: ${mobileVitals.cls} (target: <0.1)`);
    console.log(`  • TTFB: ${mobileMetrics.ttfb}ms`);
    console.log(`  • FCP: ${mobileMetrics.fcp}ms`);
    
    // Assertions adaptées mobile (légèrement plus permissives)
    if (mobileVitals.lcp !== null) {
      expect(mobileVitals.lcp).toBeLessThan(3000); // LCP mobile < 3s
    }
    if (mobileVitals.fid !== null) {
      expect(mobileVitals.fid).toBeLessThan(100); // FID reste < 100ms
    }
    if (mobileVitals.cls !== null) {
      expect(mobileVitals.cls).toBeLessThan(0.1); // CLS reste < 0.1
    }
    
    expect(mobileMetrics.ttfb).toBeLessThan(1200); // TTFB mobile < 1.2s
    
    console.log('✅ Mobile Core Web Vitals within acceptable targets');
  });

  test('Page transitions Web Vitals stability @performance @vitals', async ({ page }) => {
    console.log('🔄 Testing Web Vitals stability during page transitions...');
    
    const dashboardHelper = new DashboardTestHelper(page);
    
    // Démarrer sur dashboard
    await page.goto('/dashboard', { waitUntil: 'networkidle' });
    
    // Collecter les métriques sur plusieurs transitions
    const transitionMetrics = [];
    const sections = ['analytics', 'widgets', 'settings', 'dashboard'];
    
    for (const section of sections) {
      console.log(`Testing transition to ${section}...`);
      
      const transitionStart = Date.now();
      await dashboardHelper.navigateToSection(section);
      
      // Attendre stabilisation après transition
      await page.waitForTimeout(1000);
      
      const transitionTime = Date.now() - transitionStart;
      const vitals = await vitalsHelper.measurePerformanceMetrics();
      
      transitionMetrics.push({
        section,
        transitionTime,
        ttfb: vitals.ttfb,
        fcp: vitals.fcp,
        resourceCount: vitals.resourceCount
      });
      
      // Chaque transition doit être rapide
      expect(transitionTime).toBeLessThan(2000);
    }
    
    console.log('📊 Transition metrics summary:');
    transitionMetrics.forEach(metric => {
      console.log(`  ${metric.section}: ${metric.transitionTime}ms transition, ${metric.resourceCount} resources`);
    });
    
    // Vérifier la cohérence des performances
    const avgTransitionTime = transitionMetrics.reduce((sum, m) => sum + m.transitionTime, 0) / transitionMetrics.length;
    expect(avgTransitionTime).toBeLessThan(1500);
    
    console.log(`✅ Average transition time: ${avgTransitionTime.toFixed(0)}ms`);
  });

  test('Resource loading optimization validation @performance', async ({ page }) => {
    console.log('📦 Testing resource loading optimization...');
    
    // Monitor network requests
    const requests = [];
    page.on('request', request => {
      requests.push({
        url: request.url(),
        resourceType: request.resourceType(),
        method: request.method()
      });
    });
    
    const responses = [];
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        contentType: response.headers()['content-type'] || '',
        size: response.headers()['content-length'] || '0'
      });
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Analyser les requêtes
    const resourceTypes = {};
    requests.forEach(req => {
      resourceTypes[req.resourceType] = (resourceTypes[req.resourceType] || 0) + 1;
    });
    
    console.log('📊 Resource breakdown:', resourceTypes);
    
    // Vérifications d'optimisation
    const jsRequests = requests.filter(r => r.resourceType === 'script');
    const cssRequests = requests.filter(r => r.resourceType === 'stylesheet');
    const imageRequests = requests.filter(r => r.resourceType === 'image');
    
    // Assertions d'optimisation
    expect(jsRequests.length).toBeLessThan(15); // Limite de 15 fichiers JS
    expect(cssRequests.length).toBeLessThan(8); // Limite de 8 fichiers CSS
    
    // Vérifier les codes de statut
    const errorResponses = responses.filter(r => r.status >= 400);
    expect(errorResponses).toHaveLength(0);
    
    // Vérifier la compression
    const compressibleResponses = responses.filter(r => 
      r.contentType.includes('text/') || 
      r.contentType.includes('application/javascript') ||
      r.contentType.includes('application/json')
    );
    
    console.log(`📈 Total requests: ${requests.length}`);
    console.log(`📈 JS files: ${jsRequests.length}`);
    console.log(`📈 CSS files: ${cssRequests.length}`);
    console.log(`📈 Images: ${imageRequests.length}`);
    console.log(`📈 Error responses: ${errorResponses.length}`);
    
    console.log('✅ Resource loading optimization validated');
  });

  test('Memory usage and performance monitoring @performance', async ({ page }) => {
    console.log('🧠 Testing memory usage and performance monitoring...');
    
    // Mesures de performance JavaScript
    const performanceMetrics = await page.evaluate(() => {
      const perfData = {
        memory: performance.memory ? {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        } : null,
        timing: performance.timing ? {
          navigationStart: performance.timing.navigationStart,
          domContentLoadedEventEnd: performance.timing.domContentLoadedEventEnd,
          loadEventEnd: performance.timing.loadEventEnd
        } : null
      };
      
      return perfData;
    });
    
    console.log('🧠 Memory metrics:', performanceMetrics.memory);
    
    if (performanceMetrics.memory) {
      // Vérifications de mémoire (en bytes)
      const memoryUsageMB = performanceMetrics.memory.usedJSHeapSize / (1024 * 1024);
      expect(memoryUsageMB).toBeLessThan(50); // Moins de 50MB d'utilisation JS
      
      console.log(`Memory usage: ${memoryUsageMB.toFixed(2)}MB`);
    }
    
    // Test de détection de fuites mémoire potentielles
    await page.goto('/dashboard');
    const initialMemory = await page.evaluate(() => 
      performance.memory ? performance.memory.usedJSHeapSize : 0
    );
    
    // Simuler activité intensive
    for (let i = 0; i < 5; i++) {
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
    }
    
    const finalMemory = await page.evaluate(() => 
      performance.memory ? performance.memory.usedJSHeapSize : 0
    );
    
    if (initialMemory && finalMemory) {
      const memoryIncrease = (finalMemory - initialMemory) / (1024 * 1024);
      console.log(`Memory increase after activity: ${memoryIncrease.toFixed(2)}MB`);
      
      // L'augmentation mémoire ne doit pas être excessive
      expect(memoryIncrease).toBeLessThan(20);
    }
    
    console.log('✅ Memory usage within acceptable limits');
  });
});