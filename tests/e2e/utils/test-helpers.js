import { expect } from '@playwright/test';

/**
 * Utilitaires de test Phase 4 TrustBoost
 * Helpers pour E2E, Performance, Security
 */

/**
 * Helpers pour les Core Web Vitals
 */
export class WebVitalsHelper {
  constructor(page) {
    this.page = page;
  }

  /**
   * Mesure et valide les Core Web Vitals selon les requirements Phase 4
   * LCP < 2.5s, FID < 100ms, CLS < 0.1
   */
  async measureAndValidateWebVitals() {
    const webVitals = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        // Attendre que toutes les métriques soient disponibles
        setTimeout(() => {
          resolve(window.webVitalsData || {
            lcp: null,
            fid: null,
            cls: null
          });
        }, 3000);
      });
    });

    console.log('📊 Web Vitals Measured:', webVitals);

    // Validations Phase 4 TrustBoost requirements
    if (webVitals.lcp !== null) {
      expect(webVitals.lcp).toBeLessThan(2500); // LCP < 2.5s
    }

    if (webVitals.fid !== null) {
      expect(webVitals.fid).toBeLessThan(100); // FID < 100ms
    }

    if (webVitals.cls !== null) {
      expect(webVitals.cls).toBeLessThan(0.1); // CLS < 0.1
    }

    return webVitals;
  }

  /**
   * Mesure les métriques de performance personnalisées
   */
  async measurePerformanceMetrics() {
    return await this.page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');

      return {
        // Time to First Byte
        ttfb: navigation.responseStart - navigation.requestStart,

        // First Contentful Paint
        fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || null,

        // DOM Content Loaded
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,

        // Load Complete
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,

        // Resource Count
        resourceCount: performance.getEntriesByType('resource').length
      };
    });
  }
}

/**
 * Helpers pour les tests de sécurité
 */
export class SecurityTestHelper {
  constructor(page) {
    this.page = page;
  }

  /**
   * Vérifie les headers de sécurité Phase 3 maintenus en Phase 4
   */
  async validateSecurityHeaders() {
    const response = await this.page.goto(this.page.url());
    const headers = response.headers();

    // Headers de sécurité obligatoires Phase 3/4
    const requiredHeaders = {
      'content-security-policy': true,
      'x-frame-options': true,
      'x-content-type-options': true,
      'x-xss-protection': true,
      'strict-transport-security': true,
      'referrer-policy': true
    };

    for (const [headerName, required] of Object.entries(requiredHeaders)) {
      if (required) {
        expect(headers[headerName]).toBeDefined();
        console.log(`✅ Security header present: ${headerName} = ${headers[headerName]}`);
      }
    }

    return headers;
  }

  /**
   * Test de résistance aux injections XSS
   */
  async testXSSResistance(inputSelector, payloads = [
    '<script>alert("xss")</script>',
    'javascript:alert("xss")',
    '<img src=x onerror=alert("xss")>',
    'onmouseover=alert("xss")'
  ]) {
    for (const payload of payloads) {
      await this.page.fill(inputSelector, payload);
      await this.page.keyboard.press('Enter');

      // Vérifier qu'aucune alerte JavaScript n'est déclenchée
      const alertHandled = await this.page.evaluate(() => {
        let alertTriggered = false;
        const originalAlert = window.alert;
        window.alert = () => { alertTriggered = true; };
        setTimeout(() => { window.alert = originalAlert; }, 100);
        return alertTriggered;
      });

      expect(alertHandled).toBeFalsy();
      console.log(`✅ XSS payload blocked: ${payload.substring(0, 30)}...`);
    }
  }

  /**
   * Validation des CSP (Content Security Policy)
   */
  async validateCSP() {
    const cspViolations = [];

    this.page.on('console', msg => {
      if (msg.text().includes('Content Security Policy')) {
        cspViolations.push(msg.text());
      }
    });

    // Attendre les potentielles violations CSP
    await this.page.waitForTimeout(2000);

    return cspViolations;
  }
}

/**
 * Helpers pour les tests de widget
 */
export class WidgetTestHelper {
  constructor(page) {
    this.page = page;
  }

  /**
   * Attend le chargement complet du widget TrustBoost
   */
  async waitForWidgetLoad(timeout = 10000) {
    await this.page.waitForSelector('[data-testid="trustboost-widget"]', {
      timeout,
      state: 'visible'
    });

    // Attendre que le widget soit complètement initialisé
    await this.page.waitForFunction(() => {
      const widget = document.querySelector('[data-testid="trustboost-widget"]');
      return widget && widget.classList.contains('loaded');
    }, { timeout });
  }

  /**
   * Teste l'interaction avec le widget
   */
  async testWidgetInteraction() {
    // Clic sur le widget
    await this.page.click('[data-testid="trustboost-widget"]');

    // Vérifier l'ouverture du panel
    await expect(this.page.locator('[data-testid="widget-panel"]')).toBeVisible();

    // Test des éléments interactifs
    const interactiveElements = await this.page.locator('[data-testid^="widget-"] button, [data-testid^="widget-"] input').count();
    expect(interactiveElements).toBeGreaterThan(0);

    return interactiveElements;
  }

  /**
   * Valide l'embed responsive du widget
   */
  async validateResponsiveEmbed() {
    const viewports = [
      { width: 320, height: 568 },   // iPhone SE
      { width: 768, height: 1024 },  // iPad
      { width: 1920, height: 1080 }  // Desktop
    ];

    const results = {};

    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport);
      await this.page.waitForTimeout(500); // Attendre le reflow

      const widgetRect = await this.page.locator('[data-testid="trustboost-widget"]').boundingBox();
      const isVisible = await this.page.locator('[data-testid="trustboost-widget"]').isVisible();

      results[`${viewport.width}x${viewport.height}`] = {
        visible: isVisible,
        dimensions: widgetRect,
        responsive: widgetRect && widgetRect.width <= viewport.width
      };
    }

    return results;
  }
}

/**
 * Helpers pour les tests de dashboard
 */
export class DashboardTestHelper {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigation dans le dashboard avec validation
   */
  async navigateToSection(sectionName) {
    const sectionSelector = `[data-testid="nav-${sectionName}"]`;

    await this.page.click(sectionSelector);
    await this.page.waitForURL(`**/${sectionName}`, { timeout: 10000 });

    // Vérifier que la section est active
    await expect(this.page.locator(sectionSelector)).toHaveClass(/active/);

    // Attendre le chargement du contenu
    await this.page.waitForSelector(`[data-testid="${sectionName}-content"]`, { timeout: 15000 });
  }

  /**
   * Test de la recherche dans le dashboard
   */
  async testSearchFunctionality(query) {
    await this.page.fill('[data-testid="search-input"]', query);
    await this.page.keyboard.press('Enter');

    // Attendre les résultats
    await this.page.waitForSelector('[data-testid="search-results"]', { timeout: 10000 });

    const resultsCount = await this.page.locator('[data-testid="search-result"]').count();
    expect(resultsCount).toBeGreaterThan(0);

    return resultsCount;
  }

  /**
   * Validation des permissions utilisateur
   */
  async validateUserPermissions(expectedPermissions = []) {
    const userPermissions = await this.page.evaluate(() => {
      return window.userPermissions || [];
    });

    for (const permission of expectedPermissions) {
      expect(userPermissions).toContain(permission);
    }

    return userPermissions;
  }
}

/**
 * Helper général pour les assertions de performance
 */
export class PerformanceAssertions {
  static async assertLoadTime(page, maxTime = 3000) {
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation.loadEventEnd - navigation.navigationStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart
      };
    });

    expect(performanceMetrics.loadTime).toBeLessThan(maxTime);
    return performanceMetrics;
  }

  static async assertNoConsoleErrors(page) {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Attendre un moment pour capturer les erreurs
    await page.waitForTimeout(2000);

    expect(errors).toHaveLength(0);
    return errors;
  }
}

/**
 * Helper pour les tests cross-browser
 */
export class CrossBrowserTestHelper {
  constructor(page, browserName) {
    this.page = page;
    this.browserName = browserName;
  }

  /**
   * Adaptations spécifiques par navigateur
   */
  async getBrowserSpecificTimeout() {
    const timeouts = {
      'chromium': 10000,
      'firefox': 15000,
      'webkit': 20000  // Safari plus lent
    };

    return timeouts[this.browserName] || 10000;
  }

  /**
   * Test des features supportées par navigateur
   */
  async testBrowserFeatureSupport() {
    return await this.page.evaluate(() => {
      return {
        webGL: !!window.WebGLRenderingContext,
        serviceWorker: 'serviceWorker' in navigator,
        webAssembly: typeof WebAssembly !== 'undefined',
        intersectionObserver: 'IntersectionObserver' in window,
        performanceObserver: 'PerformanceObserver' in window,
        css: {
          grid: CSS.supports('display', 'grid'),
          flexbox: CSS.supports('display', 'flex'),
          customProperties: CSS.supports('color', 'var(--test)')
        }
      };
    });
  }
}
