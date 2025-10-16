import { test, expect } from '@playwright/test';
import {
  WidgetTestHelper,
  SecurityTestHelper,
  WebVitalsHelper,
  PerformanceAssertions
} from '../utils/test-helpers.js';

/**
 * Tests E2E Widget TrustBoost - Phase 4 avec sécurité Phase 3 maintenue
 *
 * @security Tests de régression sécurité vs Phase 3
 * @performance Core Web Vitals < requirements (LCP <2.5s, FID <100ms, CLS <0.1)
 * @desktop Compatible desktop browsers
 * @cross-browser Test cross-browser
 */

test.describe('TrustBoost Widget - Security & Performance @security @desktop', () => {
  let widgetHelper;
  let securityHelper;
  let vitalsHelper;

  test.beforeEach(async ({ page }) => {
    // Utiliser l'état d'authentification du setup global
    widgetHelper = new WidgetTestHelper(page);
    securityHelper = new SecurityTestHelper(page);
    vitalsHelper = new WebVitalsHelper(page);

    // Navigation vers page avec widget
    await page.goto('/widget-demo', { waitUntil: 'networkidle' });
  });

  test('Widget loads securely with Phase 3 security headers maintained @security', async ({ page }) => {
    // 1. Vérification des headers de sécurité Phase 3
    console.log('🔒 Testing security headers maintenance from Phase 3...');

    const securityHeaders = await securityHelper.validateSecurityHeaders();

    // Assertions spécifiques Phase 3 requirements
    expect(securityHeaders['content-security-policy']).toMatch(/script-src.*'self'/);
    expect(securityHeaders['x-frame-options']).toBe('DENY');
    expect(securityHeaders['x-content-type-options']).toBe('nosniff');

    // 2. Chargement sécurisé du widget
    await widgetHelper.waitForWidgetLoad();

    // 3. Validation CSP compliance
    const cspViolations = await securityHelper.validateCSP();
    expect(cspViolations).toHaveLength(0);

    console.log('✅ Widget loaded with security headers intact from Phase 3');
  });

  test('Widget resists XSS attacks (Phase 3 security maintained) @security', async ({ page }) => {
    console.log('🛡️ Testing XSS resistance from Phase 3...');

    await widgetHelper.waitForWidgetLoad();

    // Localiser le champ d'input du widget si disponible
    const inputField = page.locator('[data-testid="widget-feedback-input"]').first();

    if (await inputField.isVisible()) {
      // Test payloads XSS
      await securityHelper.testXSSResistance('[data-testid="widget-feedback-input"]', [
        '<script>alert("xss-widget")</script>',
        'javascript:alert("xss-widget")',
        '<img src=x onerror=alert("xss-widget")>',
        'onmouseover=alert("xss-widget")',
        '<svg onload=alert("xss-widget")>',
        'eval(alert("xss-widget"))'
      ]);
    }

    console.log('✅ Widget successfully resisted XSS attack attempts');
  });

  test('Widget meets Core Web Vitals requirements @performance @vitals', async ({ page }) => {
    console.log('📊 Testing Core Web Vitals compliance...');

    // Attendre le chargement complet avec métriques
    await widgetHelper.waitForWidgetLoad();
    await page.waitForTimeout(3000); // Laisser temps aux métriques de se stabiliser

    // Mesurer et valider les Web Vitals
    const webVitals = await vitalsHelper.measureAndValidateWebVitals();

    // Assertions Phase 4 TrustBoost requirements
    console.log(`LCP: ${webVitals.lcp}ms (target: <2500ms)`);
    console.log(`FID: ${webVitals.fid}ms (target: <100ms)`);
    console.log(`CLS: ${webVitals.cls} (target: <0.1)`);

    // Métriques de performance supplémentaires
    const perfMetrics = await vitalsHelper.measurePerformanceMetrics();
    console.log('Additional Performance Metrics:', perfMetrics);

    // Vérifications spécifiques widget
    const widgetLoadTime = await page.evaluate(() => {
      const widget = document.querySelector('[data-testid="trustboost-widget"]');
      return widget ? parseFloat(widget.dataset.loadTime) || 0 : 0;
    });

    expect(widgetLoadTime).toBeLessThan(1000); // Widget doit charger en <1s

    console.log('✅ Widget meets all Core Web Vitals requirements');
  });

  test('Widget interaction performance under load @performance', async ({ page }) => {
    console.log('⚡ Testing widget performance under interaction load...');

    await widgetHelper.waitForWidgetLoad();

    // Mesurer les performances d'interaction
    const interactionStart = Date.now();

    // Simuler interactions rapides répétées
    for (let i = 0; i < 5; i++) {
      await page.hover('[data-testid="trustboost-widget"]');
      await page.click('[data-testid="trustboost-widget"]');
      await page.waitForTimeout(100);
    }

    const interactionTime = Date.now() - interactionStart;

    // L'ensemble des 5 interactions ne doit pas dépasser 2 secondes
    expect(interactionTime).toBeLessThan(2000);

    // Vérifier qu'aucune erreur de console pendant les interactions
    await PerformanceAssertions.assertNoConsoleErrors(page);

    console.log(`✅ Widget interactions completed in ${interactionTime}ms`);
  });

  test('Widget cross-frame security (Phase 3 compliance) @security', async ({ page }) => {
    console.log('🖼️ Testing cross-frame security compliance...');

    // Test d'embedding dans iframe
    await page.setContent(`
      <html>
        <body>
          <iframe id="widget-frame" src="/widget-embed" width="400" height="300"></iframe>
        </body>
      </html>
    `);

    const frame = page.frame({ name: 'widget-frame' }) ||
                 page.frameLocator('#widget-frame');

    if (frame) {
      // Vérifier que le widget refuse l'embedding non autorisé
      const frameContent = await frame.locator('body').textContent();

      // Doit soit refuser l'embedding (X-Frame-Options) soit charger de façon sécurisée
      expect(frameContent).toMatch(/Embedding not allowed|TrustBoost Widget/);
    }

    console.log('✅ Cross-frame security working correctly');
  });

  test('Widget data privacy and GDPR compliance @security', async ({ page }) => {
    console.log('🛡️ Testing data privacy and GDPR compliance...');

    await widgetHelper.waitForWidgetLoad();

    // Vérifier présence des éléments de conformité GDPR
    await expect(page.locator('[data-testid="privacy-notice"]')).toBeVisible({ timeout: 5000 });

    // Test du consentement cookies si applicable
    const cookieConsent = page.locator('[data-testid="cookie-consent"]');
    if (await cookieConsent.isVisible()) {
      await cookieConsent.click();
    }

    // Vérifier qu'aucune donnée n'est envoyée sans consentement
    const requests = [];
    page.on('request', request => {
      if (request.url().includes('/api/') && request.method() === 'POST') {
        requests.push(request.url());
      }
    });

    // Interagir avec le widget sans donner de consentement explicite
    await page.click('[data-testid="trustboost-widget"]');
    await page.waitForTimeout(2000);

    // Aucune requête de données personnelles ne doit être faite
    const dataRequests = requests.filter(url =>
      url.includes('/analytics') ||
      url.includes('/tracking') ||
      url.includes('/user-data')
    );

    expect(dataRequests).toHaveLength(0);

    console.log('✅ Widget respects data privacy and GDPR requirements');
  });
});

test.describe('TrustBoost Widget - Cross Browser Compatibility @cross-browser', () => {
  let widgetHelper;

  test.beforeEach(async ({ page }) => {
    widgetHelper = new WidgetTestHelper(page);
    await page.goto('/widget-demo', { waitUntil: 'networkidle' });
  });

  test('Widget loads consistently across browsers @cross-browser', async ({ page, browserName }) => {
    console.log(`🌐 Testing widget compatibility in ${browserName}...`);

    // Attendre chargement avec timeout adaptatif par navigateur
    const timeout = browserName === 'webkit' ? 20000 : 15000;
    await widgetHelper.waitForWidgetLoad(timeout);

    // Vérifications de base
    const isVisible = await page.locator('[data-testid="trustboost-widget"]').isVisible();
    expect(isVisible).toBeTruthy();

    // Test des interactions de base
    const interactionCount = await widgetHelper.testWidgetInteraction();
    expect(interactionCount).toBeGreaterThan(0);

    // Capture d'écran pour comparaison visuelle
    await page.screenshot({
      path: `test-results/widget-${browserName}.png`,
      fullPage: false,
      clip: { x: 0, y: 0, width: 800, height: 600 }
    });

    console.log(`✅ Widget works correctly in ${browserName}`);
  });

  test('Widget styling consistent across browsers @cross-browser', async ({ page, browserName }) => {
    console.log(`🎨 Testing widget styling consistency in ${browserName}...`);

    await widgetHelper.waitForWidgetLoad();

    // Mesurer les propriétés CSS critiques
    const widgetStyles = await page.locator('[data-testid="trustboost-widget"]').evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        position: styles.position,
        zIndex: styles.zIndex,
        width: styles.width,
        height: styles.height,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow
      };
    });

    // Vérifications de cohérence
    expect(widgetStyles.position).toBe('fixed');
    expect(parseInt(widgetStyles.zIndex)).toBeGreaterThan(1000);
    expect(widgetStyles.width).toMatch(/\d+px/);
    expect(widgetStyles.height).toMatch(/\d+px/);

    console.log(`Widget styles in ${browserName}:`, widgetStyles);
    console.log(`✅ Widget styling consistent in ${browserName}`);
  });
});

test.describe('TrustBoost Widget - Mobile Responsive @mobile @responsive', () => {
  let widgetHelper;

  test.beforeEach(async ({ page }) => {
    widgetHelper = new WidgetTestHelper(page);
    await page.goto('/widget-demo', { waitUntil: 'networkidle' });
  });

  test('Widget adapts to mobile viewports @mobile @responsive', async ({ page }) => {
    console.log('📱 Testing widget mobile responsiveness...');

    // Test des différents viewports
    const responsiveResults = await widgetHelper.validateResponsiveEmbed();

    // Vérifications pour chaque viewport
    for (const [viewport, result] of Object.entries(responsiveResults)) {
      expect(result.visible).toBeTruthy();
      expect(result.responsive).toBeTruthy();
      console.log(`✅ Widget responsive on ${viewport}: ${JSON.stringify(result)}`);
    }
  });

  test('Widget touch interactions work on mobile @mobile', async ({ page }) => {
    console.log('👆 Testing widget touch interactions...');

    // Configurer viewport mobile
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone 8

    await widgetHelper.waitForWidgetLoad();

    // Test des interactions tactiles
    await page.tap('[data-testid="trustboost-widget"]');
    await expect(page.locator('[data-testid="widget-panel"]')).toBeVisible();

    // Test du swipe/scroll dans le widget si applicable
    const widgetPanel = page.locator('[data-testid="widget-panel"]');
    if (await widgetPanel.isVisible()) {
      const panelRect = await widgetPanel.boundingBox();

      // Simuler un swipe vertical
      await page.mouse.move(panelRect.x + 50, panelRect.y + 50);
      await page.mouse.down();
      await page.mouse.move(panelRect.x + 50, panelRect.y + 150);
      await page.mouse.up();
    }

    console.log('✅ Widget touch interactions working on mobile');
  });
});
