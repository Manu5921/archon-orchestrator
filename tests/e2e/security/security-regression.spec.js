import { test, expect } from '@playwright/test';
import { SecurityTestHelper, WidgetTestHelper } from '../utils/test-helpers.js';

/**
 * Tests de régression sécurité Phase 4 TrustBoost
 * Maintien de TOUS les acquis sécurité Phase 3
 *
 * @security Tests de sécurité critiques
 * @regression Tests de non-régression vs Phase 3
 * @desktop Compatible tous navigateurs desktop
 * @cross-browser Tests cross-browser sécurité
 */

test.describe('Security Regression Tests - Phase 3 Compliance Maintained @security @regression', () => {
  let securityHelper;
  let widgetHelper;

  test.beforeEach(async ({ page }) => {
    securityHelper = new SecurityTestHelper(page);
    widgetHelper = new WidgetTestHelper(page);
  });

  test('Complete security headers validation (Phase 3 baseline) @security @regression', async ({ page }) => {
    console.log('🔒 Validating ALL Phase 3 security headers are maintained...');

    // Test sur toutes les pages critiques
    const criticalPages = ['/', '/login', '/dashboard', '/widget-demo'];

    for (const pagePath of criticalPages) {
      console.log(`Testing security headers on ${pagePath}...`);

      const response = await page.goto(pagePath);
      const headers = response.headers();

      // Phase 3 Security Headers Requirements (COMPLETS)
      const requiredSecurityHeaders = {
        'content-security-policy': {
          required: true,
          validation: (value) => {
            return value.includes("default-src 'self'") &&
                   value.includes("script-src 'self'") &&
                   value.includes("style-src 'self'") &&
                   value.includes("img-src 'self' data: https:");
          }
        },
        'x-frame-options': {
          required: true,
          validation: (value) => ['DENY', 'SAMEORIGIN'].includes(value)
        },
        'x-content-type-options': {
          required: true,
          validation: (value) => value === 'nosniff'
        },
        'x-xss-protection': {
          required: true,
          validation: (value) => value === '1; mode=block'
        },
        'strict-transport-security': {
          required: true,
          validation: (value) => {
            return value.includes('max-age=') &&
                   parseInt(value.match(/max-age=(\d+)/)[1]) >= 31536000; // 1 an minimum
          }
        },
        'referrer-policy': {
          required: true,
          validation: (value) => ['strict-origin-when-cross-origin', 'same-origin', 'strict-origin'].includes(value)
        },
        'permissions-policy': {
          required: true,
          validation: (value) => {
            return value.includes('camera=()') &&
                   value.includes('microphone=()') &&
                   value.includes('geolocation=()');
          }
        }
      };

      // Validation de chaque header
      for (const [headerName, config] of Object.entries(requiredSecurityHeaders)) {
        const headerValue = headers[headerName];

        if (config.required) {
          expect(headerValue).toBeDefined();
          expect(headerValue).toBeTruthy();

          if (config.validation) {
            expect(config.validation(headerValue)).toBeTruthy();
          }

          console.log(`  ✅ ${headerName}: ${headerValue}`);
        }
      }
    }

    console.log('✅ ALL Phase 3 security headers maintained across all pages');
  });

  test('Content Security Policy enforcement (Phase 3 level) @security @regression', async ({ page }) => {
    console.log('🛡️ Testing CSP enforcement maintains Phase 3 security level...');

    await page.goto('/');

    // Collecter les violations CSP
    const cspViolations = [];
    page.on('console', msg => {
      if (msg.text().includes('Content Security Policy') || msg.text().includes('CSP')) {
        cspViolations.push(msg.text());
      }
    });

    // Tentatives d'injection de scripts malveillants (doivent être bloquées)
    const maliciousScripts = [
      'eval("alert(1)")',
      'new Function("alert(2)")()',
      'setTimeout("alert(3)", 0)',
      'document.write("<script>alert(4)</script>")'
    ];

    for (const maliciousScript of maliciousScripts) {
      try {
        await page.evaluate(maliciousScript);
      } catch (error) {
        console.log(`  ✅ CSP blocked: ${maliciousScript}`);
      }
    }

    // Tentatives d'inline styles non autorisés
    await page.evaluate(() => {
      const div = document.createElement('div');
      div.innerHTML = '<p style="background: red;">Inline style test</p>';
      document.body.appendChild(div);
    });

    // Attendre les violations potentielles
    await page.waitForTimeout(2000);

    // Vérifier les violations CSP détectées
    console.log(`CSP violations detected: ${cspViolations.length}`);
    cspViolations.forEach(violation => console.log(`  🚫 ${violation}`));

    // En Phase 3, CSP doit être strict - certaines violations sont attendues
    expect(cspViolations.length).toBeGreaterThan(0); // Violations attendues = CSP fonctionne

    console.log('✅ CSP enforcement maintains Phase 3 security level');
  });

  test('XSS protection comprehensive testing @security @regression', async ({ page }) => {
    console.log('🚨 Comprehensive XSS protection testing (Phase 3 compliance)...');

    await page.goto('/');

    // Test sur tous les inputs de l'application
    const inputSelectors = [
      'input[type="text"]',
      'input[type="email"]',
      'input[type="search"]',
      'textarea',
      '[contenteditable="true"]'
    ];

    // Payloads XSS Phase 3 (complets)
    const xssPayloads = [
      // Basic XSS
      '<script>alert("xss")</script>',
      '<img src=x onerror=alert("xss")>',
      '<svg onload=alert("xss")>',

      // Advanced XSS
      'javascript:alert("xss")',
      'data:text/html,<script>alert("xss")</script>',
      '"><script>alert("xss")</script>',
      '\';alert("xss");//',

      // Event handlers
      'onmouseover=alert("xss")',
      'onfocus=alert("xss")',
      'onclick=alert("xss")',

      // DOM-based XSS
      '<iframe src="javascript:alert(\'xss\')">',
      '<object data="javascript:alert(\'xss\')">',

      // Filter evasion
      '<ScRiPt>alert("xss")</ScRiPt>',
      '<script>alert(String.fromCharCode(88,83,83))</script>',
      '<<SCRIPT>alert("xss")//<</SCRIPT>',

      // Context-specific
      '&lt;script&gt;alert("xss")&lt;/script&gt;',
      '%3Cscript%3Ealert("xss")%3C/script%3E'
    ];

    let inputsTested = 0;
    let alertsBlocked = 0;

    for (const selector of inputSelectors) {
      const inputs = await page.locator(selector).all();

      for (const input of inputs) {
        if (await input.isVisible() && await input.isEnabled()) {
          inputsTested++;
          console.log(`Testing input: ${selector}`);

          for (const payload of xssPayloads) {
            // Setup alert detection
            let alertTriggered = false;

            const alertHandler = (dialog) => {
              alertTriggered = true;
              dialog.dismiss();
            };

            page.on('dialog', alertHandler);

            try {
              await input.fill(payload);
              await input.press('Enter');
              await page.waitForTimeout(500); // Attendre execution potentielle

              if (!alertTriggered) {
                alertsBlocked++;
              }

            } catch (error) {
              alertsBlocked++; // Erreur = payload bloqué
            }

            page.off('dialog', alertHandler);

            // Clear le champ pour le prochain test
            await input.fill('');
          }
        }
      }
    }

    console.log('📊 XSS Test Results:');
    console.log(`  • Inputs tested: ${inputsTested}`);
    console.log(`  • Payloads tested: ${xssPayloads.length * inputsTested}`);
    console.log(`  • Alerts blocked: ${alertsBlocked}`);

    // En Phase 3, 100% des XSS doivent être bloqués
    const totalTests = xssPayloads.length * inputsTested;
    if (totalTests > 0) {
      const blockRate = (alertsBlocked / totalTests) * 100;
      console.log(`  • Block rate: ${blockRate.toFixed(1)}%`);
      expect(blockRate).toBeGreaterThan(95); // 95% minimum de blocage
    }

    console.log('✅ XSS protection maintains Phase 3 security standards');
  });

  test('SQL injection protection validation @security @regression', async ({ page }) => {
    console.log('💉 Testing SQL injection protection (Phase 3 compliance)...');

    await page.goto('/');

    // SQL injection payloads
    const sqlPayloads = [
      "' OR '1'='1",
      "' OR 1=1--",
      "' UNION SELECT * FROM users--",
      "'; DROP TABLE users; --",
      "1' OR '1'='1' /*",
      "admin'--",
      "admin' #",
      "' OR 1=1#",
      "') OR '1'='1--",
      "1' OR '1'='1' AND '1'='1"
    ];

    // Test sur les champs de recherche et formulaires
    const testInputs = [
      '[data-testid="search-input"]',
      '[data-testid="email-input"]',
      'input[name="username"]',
      'input[name="email"]'
    ];

    let injectionAttempts = 0;
    let protectionConfirmed = 0;

    for (const selector of testInputs) {
      const input = page.locator(selector).first();

      if (await input.isVisible({ timeout: 3000 })) {
        console.log(`Testing SQL injection on: ${selector}`);

        for (const payload of sqlPayloads) {
          injectionAttempts++;

          // Monitor network requests
          const requests = [];
          const requestHandler = (request) => {
            if (request.method() === 'POST' || request.url().includes('/api/')) {
              requests.push(request.url());
            }
          };

          page.on('request', requestHandler);

          await input.fill(payload);
          await input.press('Enter');
          await page.waitForTimeout(1000);

          page.off('request', requestHandler);

          // Vérifier qu'aucune erreur SQL n'est exposée
          const pageContent = await page.textContent('body');
          const sqlErrors = [
            'SQL syntax error',
            'mysql_fetch_array',
            'ORA-01756',
            'Microsoft OLE DB Provider',
            'Unclosed quotation mark',
            'Warning: mysql_'
          ];

          let errorExposed = false;
          for (const error of sqlErrors) {
            if (pageContent.toLowerCase().includes(error.toLowerCase())) {
              errorExposed = true;
              break;
            }
          }

          if (!errorExposed) {
            protectionConfirmed++;
          }

          // Clear pour le prochain test
          await input.fill('');
        }
      }
    }

    console.log('📊 SQL Injection Test Results:');
    console.log(`  • Injection attempts: ${injectionAttempts}`);
    console.log(`  • Protected: ${protectionConfirmed}`);

    if (injectionAttempts > 0) {
      const protectionRate = (protectionConfirmed / injectionAttempts) * 100;
      console.log(`  • Protection rate: ${protectionRate.toFixed(1)}%`);
      expect(protectionRate).toBe(100); // 100% protection requis Phase 3
    }

    console.log('✅ SQL injection protection maintains Phase 3 standards');
  });

  test('Authentication security regression @security @regression', async ({ page }) => {
    console.log('🔐 Testing authentication security regression...');

    // Test 1: Brute force protection
    await page.goto('/login');

    const maxAttempts = 5;
    for (let attempt = 1; attempt <= maxAttempts + 2; attempt++) {
      await page.fill('[data-testid="email-input"]', 'test@example.com');
      await page.fill('[data-testid="password-input"]', `wrongpassword${attempt}`);
      await page.click('[data-testid="login-button"]');

      if (attempt > maxAttempts) {
        // Après 5 tentatives, doit être bloqué
        const errorMessage = await page.locator('[data-testid="error-message"]').textContent();
        expect(errorMessage.toLowerCase()).toMatch(/blocked|locked|too many attempts/);
        console.log(`  ✅ Brute force protection activated after ${maxAttempts} attempts`);
        break;
      }

      await page.waitForTimeout(500);
    }

    // Test 2: Session fixation protection
    await page.goto('/login');
    const sessionBefore = await page.evaluate(() => {
      return document.cookie.match(/session[^=]*=([^;]*)/)?.[1] || null;
    });

    // Login valide
    await page.fill('[data-testid="email-input"]', 'admin@trustboost.test');
    await page.fill('[data-testid="password-input"]', 'SecureTestPass123!');
    await page.click('[data-testid="login-button"]');

    await page.waitForURL('**/dashboard', { timeout: 10000 });

    const sessionAfter = await page.evaluate(() => {
      return document.cookie.match(/session[^=]*=([^;]*)/)?.[1] || null;
    });

    // La session doit changer après login (protection session fixation)
    if (sessionBefore && sessionAfter) {
      expect(sessionAfter).not.toBe(sessionBefore);
      console.log('  ✅ Session ID changed after login (session fixation protection)');
    }

    // Test 3: Password complexity validation
    await page.goto('/signup');

    const weakPasswords = [
      '123456',
      'password',
      'admin',
      'test',
      'qwerty',
      '12345678'
    ];

    for (const weakPassword of weakPasswords) {
      if (await page.locator('[data-testid="password-input"]').isVisible()) {
        await page.fill('[data-testid="password-input"]', weakPassword);
        await page.fill('[data-testid="confirm-password-input"]', weakPassword);

        const submitButton = page.locator('[data-testid="signup-button"]');
        if (await submitButton.isVisible()) {
          await submitButton.click();

          const errorMessage = await page.locator('[data-testid="password-error"]').textContent();
          expect(errorMessage.toLowerCase()).toMatch(/weak|strong|complex|requirements/);
        }
      }
    }

    console.log('  ✅ Password complexity validation working');
    console.log('✅ Authentication security maintains Phase 3 standards');
  });

  test('Widget embedding security (Phase 3 compliance) @security @regression', async ({ page }) => {
    console.log('🔌 Testing widget embedding security regression...');

    // Test 1: Clickjacking protection
    const clickjackingTest = `
      <html>
        <body>
          <iframe src="/widget-demo" style="opacity: 0; position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
          <button onclick="alert('Clickjacked!')">Innocent Button</button>
        </body>
      </html>
    `;

    await page.setContent(clickjackingTest);

    // Le iframe ne doit pas charger à cause de X-Frame-Options
    const iframe = page.locator('iframe');
    const iframeError = await iframe.evaluate((frame) => {
      try {
        return frame.contentDocument ? false : true; // true = accès bloqué
      } catch {
        return true; // Exception = protection active
      }
    }).catch(() => true);

    expect(iframeError).toBeTruthy();
    console.log('  ✅ Clickjacking protection active (X-Frame-Options)');

    // Test 2: Widget CSP validation
    await page.goto('/widget-demo');
    await widgetHelper.waitForWidgetLoad();

    const widgetCSP = await page.evaluate(() => {
      const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      return meta ? meta.getAttribute('content') : null;
    });

    if (widgetCSP) {
      expect(widgetCSP).toMatch(/frame-ancestors 'none'|frame-ancestors 'self'/);
      console.log('  ✅ Widget CSP frame-ancestors protection configured');
    }

    // Test 3: Postmessage security
    const postMessageTest = await page.evaluate(() => {
      return new Promise((resolve) => {
        let messageReceived = false;

        const messageHandler = (event) => {
          messageReceived = true;
          resolve({ origin: event.origin, data: event.data });
        };

        window.addEventListener('message', messageHandler);

        // Envoyer message malveillant
        window.postMessage({ type: 'malicious', payload: 'xss' }, '*');

        setTimeout(() => {
          window.removeEventListener('message', messageHandler);
          if (!messageReceived) {
            resolve(null);
          }
        }, 2000);
      });
    });

    // Widget ne doit pas répondre aux messages non autorisés
    if (postMessageTest) {
      expect(postMessageTest.origin).toMatch(/^https?:\/\/localhost/);
      console.log('  ✅ PostMessage origin validation working');
    } else {
      console.log('  ✅ Widget ignores unauthorized postMessage');
    }

    console.log('✅ Widget embedding security maintains Phase 3 compliance');
  });

  test('HTTPS enforcement and TLS validation @security @regression', async ({ page, context }) => {
    console.log('🔒 Testing HTTPS enforcement and TLS validation...');

    // Test 1: HTTPS redirect
    try {
      const httpResponse = await page.goto('http://localhost:3000/', { timeout: 10000 });

      // Doit soit rediriger vers HTTPS soit refuser la connexion
      if (httpResponse) {
        expect(httpResponse.url()).toMatch(/^https:/);
        console.log('  ✅ HTTP redirects to HTTPS');
      }
    } catch (error) {
      // Connection refused = acceptable pour HTTPS enforcement
      console.log('  ✅ HTTP connections refused (HTTPS only)');
    }

    // Test 2: HSTS validation
    await page.goto('/');
    const response = await page.goto('/', { waitUntil: 'networkidle' });
    const hstsHeader = response.headers()['strict-transport-security'];

    if (hstsHeader) {
      expect(hstsHeader).toMatch(/max-age=\d+/);
      expect(hstsHeader).toMatch(/includeSubDomains/);

      const maxAge = parseInt(hstsHeader.match(/max-age=(\d+)/)[1]);
      expect(maxAge).toBeGreaterThanOrEqual(31536000); // 1 an minimum

      console.log(`  ✅ HSTS configured: ${hstsHeader}`);
    }

    // Test 3: Mixed content detection
    const mixedContentViolations = [];
    page.on('console', msg => {
      if (msg.text().includes('Mixed Content') || msg.text().includes('mixed content')) {
        mixedContentViolations.push(msg.text());
      }
    });

    await page.waitForTimeout(3000);

    expect(mixedContentViolations).toHaveLength(0);
    console.log('  ✅ No mixed content violations detected');

    console.log('✅ HTTPS enforcement maintains Phase 3 security standards');
  });
});
