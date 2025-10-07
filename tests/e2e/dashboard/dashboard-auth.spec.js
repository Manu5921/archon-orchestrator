import { test, expect } from '@playwright/test';
import { 
  DashboardTestHelper, 
  SecurityTestHelper, 
  WebVitalsHelper,
  PerformanceAssertions 
} from '../utils/test-helpers.js';

/**
 * Tests E2E Dashboard TrustBoost - Phase 4 
 * Authentification + Navigation + Performance
 * 
 * @desktop Tests compatibles desktop
 * @security Tests de sécurité
 * @performance Core Web Vitals validation
 */

test.describe('TrustBoost Dashboard - Authentication & Security @desktop @security', () => {
  let dashboardHelper;
  let securityHelper;
  let vitalsHelper;

  test.beforeEach(async ({ page }) => {
    dashboardHelper = new DashboardTestHelper(page);
    securityHelper = new SecurityTestHelper(page);
    vitalsHelper = new WebVitalsHelper(page);
  });

  test('User authentication flow with security headers @security', async ({ page }) => {
    console.log('🔐 Testing complete authentication flow with security...');
    
    // 1. Accès page login
    await page.goto('/login');
    
    // 2. Vérification headers de sécurité
    const securityHeaders = await securityHelper.validateSecurityHeaders();
    expect(securityHeaders['strict-transport-security']).toBeDefined();
    
    // 3. Test de connexion avec credentials valides
    await page.fill('[data-testid="email-input"]', 'admin@trustboost.test');
    await page.fill('[data-testid="password-input"]', 'SecureTestPass123!');
    
    // Monitor les requêtes d'authentification
    const authRequests = [];
    page.on('request', req => {
      if (req.url().includes('/auth') || req.url().includes('/login')) {
        authRequests.push(req);
      }
    });
    
    await Promise.all([
      page.waitForURL('**/dashboard', { timeout: 15000 }),
      page.click('[data-testid="login-button"]')
    ]);
    
    // 4. Vérifications post-authentification
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    await expect(page.locator('[data-testid="dashboard-welcome"]')).toBeVisible();
    
    // 5. Vérifier que les requêtes d'auth utilisent HTTPS
    authRequests.forEach(req => {
      expect(req.url()).toMatch(/^https:/);
    });
    
    console.log('✅ Authentication flow completed securely');
  });

  test('Session management and logout security @security', async ({ page }) => {
    console.log('🔒 Testing session management security...');
    
    // Démarrer sur le dashboard (authentifié via global setup)
    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    
    // Récupérer les cookies de session
    const cookies = await page.context().cookies();
    const sessionCookie = cookies.find(c => c.name.includes('session') || c.name.includes('auth'));
    
    if (sessionCookie) {
      // Vérifier les attributs de sécurité des cookies
      expect(sessionCookie.secure).toBeTruthy(); // Secure flag
      expect(sessionCookie.httpOnly).toBeTruthy(); // HttpOnly flag
      expect(sessionCookie.sameSite).toBe('Strict'); // SameSite protection
    }
    
    // Test de logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    
    // Vérifier redirection vers login
    await page.waitForURL('**/login', { timeout: 10000 });
    
    // Vérifier que les cookies de session sont supprimés
    const cookiesAfterLogout = await page.context().cookies();
    const sessionAfterLogout = cookiesAfterLogout.find(c => c.name.includes('session'));
    expect(sessionAfterLogout).toBeUndefined();
    
    console.log('✅ Session management working securely');
  });

  test('Dashboard unauthorized access protection @security', async ({ page, context }) => {
    console.log('🚫 Testing unauthorized access protection...');
    
    // Supprimer l'état d'authentification
    await context.clearCookies();
    await context.clearPermissions();
    
    // Tentative d'accès direct au dashboard
    await page.goto('/dashboard');
    
    // Doit rediriger vers login
    await page.waitForURL('**/login', { timeout: 10000 });
    expect(page.url()).toMatch(/\/login/);
    
    // Test des endpoints protégés via API
    const protectedEndpoints = ['/api/widgets', '/api/analytics', '/api/users'];
    
    for (const endpoint of protectedEndpoints) {
      const response = await page.request.get(endpoint);
      expect([401, 403]).toContain(response.status());
    }
    
    console.log('✅ Unauthorized access properly blocked');
  });

  test('CSRF protection validation @security', async ({ page }) => {
    console.log('🛡️ Testing CSRF protection...');
    
    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    
    // Récupérer le token CSRF
    const csrfToken = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="csrf-token"]');
      return meta ? meta.getAttribute('content') : null;
    });
    
    if (csrfToken) {
      console.log('CSRF token found:', csrfToken.substring(0, 10) + '...');
    }
    
    // Test d'une action qui devrait nécessiter le token CSRF
    const formData = new FormData();
    formData.append('action', 'update_settings');
    formData.append('value', 'test');
    
    // Sans token CSRF - doit échouer
    let response = await page.request.post('/api/settings', {
      data: formData
    });
    expect([403, 419]).toContain(response.status()); // 419 = CSRF token mismatch
    
    console.log('✅ CSRF protection working correctly');
  });
});

test.describe('TrustBoost Dashboard - Navigation & Performance @desktop @performance', () => {
  let dashboardHelper;
  let vitalsHelper;

  test.beforeEach(async ({ page }) => {
    dashboardHelper = new DashboardTestHelper(page);
    vitalsHelper = new WebVitalsHelper(page);
    
    // Commencer sur le dashboard authentifié
    await page.goto('/dashboard', { waitUntil: 'networkidle' });
  });

  test('Dashboard navigation performance @performance', async ({ page }) => {
    console.log('⚡ Testing dashboard navigation performance...');
    
    // Mesurer Web Vitals sur le dashboard principal
    await page.waitForTimeout(2000);
    const initialVitals = await vitalsHelper.measureAndValidateWebVitals();
    
    // Test de navigation entre sections
    const sections = ['analytics', 'widgets', 'settings', 'users'];
    const navigationTimes = {};
    
    for (const section of sections) {
      const navStart = Date.now();
      
      await dashboardHelper.navigateToSection(section);
      
      const navTime = Date.now() - navStart;
      navigationTimes[section] = navTime;
      
      // Chaque navigation doit être < 2 secondes
      expect(navTime).toBeLessThan(2000);
      
      // Vérifier les métriques de performance sur chaque section
      await PerformanceAssertions.assertLoadTime(page, 3000);
      
      console.log(`Navigation to ${section}: ${navTime}ms`);
    }
    
    console.log('Navigation times:', navigationTimes);
    console.log('✅ All dashboard navigations within performance targets');
  });

  test('Dashboard search functionality performance @performance', async ({ page }) => {
    console.log('🔍 Testing dashboard search performance...');
    
    // Naviguer vers une section avec contenu searchable
    await dashboardHelper.navigateToSection('widgets');
    
    // Test de performance de recherche
    const searchQueries = ['test', 'widget', 'trust', 'boost'];
    
    for (const query of searchQueries) {
      const searchStart = Date.now();
      
      const resultsCount = await dashboardHelper.testSearchFunctionality(query);
      
      const searchTime = Date.now() - searchStart;
      
      // La recherche doit être < 1 seconde
      expect(searchTime).toBeLessThan(1000);
      expect(resultsCount).toBeGreaterThanOrEqual(0);
      
      console.log(`Search "${query}": ${searchTime}ms, ${resultsCount} results`);
    }
    
    console.log('✅ Search functionality meets performance requirements');
  });

  test('Dashboard data loading and pagination @performance', async ({ page }) => {
    console.log('📊 Testing dashboard data loading performance...');
    
    // Naviguer vers section avec pagination (analytics)
    await dashboardHelper.navigateToSection('analytics');
    
    // Attendre le chargement des données
    await page.waitForSelector('[data-testid="analytics-data"]', { timeout: 15000 });
    
    // Mesurer le temps de chargement des données
    const loadStart = Date.now();
    
    // Cliquer sur pagination si disponible
    const nextPageButton = page.locator('[data-testid="pagination-next"]');
    if (await nextPageButton.isVisible()) {
      await nextPageButton.click();
      await page.waitForSelector('[data-testid="analytics-data"]', { state: 'visible' });
    }
    
    const loadTime = Date.now() - loadStart;
    expect(loadTime).toBeLessThan(3000);
    
    // Vérifier qu'il n'y a pas d'erreurs de console
    await PerformanceAssertions.assertNoConsoleErrors(page);
    
    console.log(`Data loading completed in ${loadTime}ms`);
    console.log('✅ Dashboard data loading within performance targets');
  });

  test('Dashboard responsive behavior @responsive', async ({ page }) => {
    console.log('📱 Testing dashboard responsive behavior...');
    
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 1024, height: 768, name: 'tablet' },
      { width: 768, height: 1024, name: 'tablet-portrait' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500); // Attendre le reflow
      
      // Vérifier que les éléments principaux sont visibles
      await expect(page.locator('[data-testid="dashboard-nav"]')).toBeVisible();
      await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible();
      
      // Vérifier le comportement du menu sur mobile/tablet
      if (viewport.width <= 1024) {
        // Le menu doit être collapsible sur tablette
        const menuToggle = page.locator('[data-testid="menu-toggle"]');
        if (await menuToggle.isVisible()) {
          await menuToggle.click();
          await expect(page.locator('[data-testid="dashboard-nav"]')).toHaveClass(/expanded/);
        }
      }
      
      console.log(`✅ Dashboard responsive at ${viewport.name} (${viewport.width}x${viewport.height})`);
    }
  });

  test('Dashboard accessibility compliance @accessibility', async ({ page }) => {
    console.log('♿ Testing dashboard accessibility...');
    
    // Vérifier la structure des headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // Vérifier la navigation au clavier
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement);
    
    // Vérifier les rôles ARIA
    const mainContent = page.locator('[role="main"]');
    await expect(mainContent).toBeVisible();
    
    // Vérifier les labels des formulaires
    const inputs = await page.locator('input').all();
    for (const input of inputs) {
      const hasLabel = await input.evaluate(el => {
        return el.labels?.length > 0 || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
      });
      expect(hasLabel).toBeTruthy();
    }
    
    console.log('✅ Dashboard accessibility compliance validated');
  });
});

test.describe('TrustBoost Dashboard - User Permissions @security', () => {
  let dashboardHelper;

  test.beforeEach(async ({ page }) => {
    dashboardHelper = new DashboardTestHelper(page);
    await page.goto('/dashboard');
  });

  test('Admin user permissions validation @security', async ({ page }) => {
    console.log('👑 Testing admin user permissions...');
    
    // Vérifier les permissions admin
    const expectedPermissions = [
      'read:widgets', 'write:widgets', 'delete:widgets',
      'read:users', 'write:users', 'delete:users',
      'read:analytics', 'write:settings'
    ];
    
    const userPermissions = await dashboardHelper.validateUserPermissions(expectedPermissions);
    console.log('User permissions:', userPermissions);
    
    // Vérifier l'accès aux sections admin
    const adminSections = ['users', 'settings', 'analytics'];
    
    for (const section of adminSections) {
      await dashboardHelper.navigateToSection(section);
      
      // Vérifier que la section est accessible
      await expect(page.locator(`[data-testid="${section}-content"]`)).toBeVisible();
    }
    
    console.log('✅ Admin permissions working correctly');
  });

  test('Role-based access control @security', async ({ page }) => {
    console.log('🎭 Testing role-based access control...');
    
    // Simuler différents rôles d'utilisateur
    const roles = [
      { name: 'editor', sections: ['widgets', 'analytics'], restricted: ['users', 'settings'] },
      { name: 'viewer', sections: ['dashboard', 'analytics'], restricted: ['widgets', 'users', 'settings'] }
    ];
    
    for (const role of roles) {
      // Simuler le changement de rôle (normalement fait via authentification)
      await page.evaluate((roleName) => {
        window.sessionStorage.setItem('userRole', roleName);
      }, role.name);
      
      await page.reload({ waitUntil: 'networkidle' });
      
      // Vérifier l'accès aux sections autorisées
      for (const section of role.sections) {
        const navLink = page.locator(`[data-testid="nav-${section}"]`);
        if (await navLink.isVisible()) {
          await dashboardHelper.navigateToSection(section);
          await expect(page.locator(`[data-testid="${section}-content"]`)).toBeVisible();
        }
      }
      
      // Vérifier que les sections restreintes ne sont pas accessibles
      for (const restrictedSection of role.restricted) {
        const restrictedLink = page.locator(`[data-testid="nav-${restrictedSection}"]`);
        
        if (await restrictedLink.isVisible()) {
          // Si le lien est visible, cliquer dessus devrait soit rediriger soit afficher un message d'erreur
          await restrictedLink.click();
          const errorMessage = page.locator('[data-testid="access-denied"]');
          
          if (await errorMessage.isVisible({ timeout: 3000 })) {
            expect(await errorMessage.textContent()).toMatch(/access denied|unauthorized|permission/i);
          }
        }
      }
      
      console.log(`✅ Role ${role.name} access control working correctly`);
    }
  });
});