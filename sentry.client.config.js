// TrustBoost Phase 4 - Sentry Client Configuration
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Environment configuration
    environment: process.env.NODE_ENV || 'development',

    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Profiling
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Release information
    release: process.env.NEXT_PUBLIC_VERSION || process.env.VERCEL_GIT_COMMIT_SHA || 'development',

    // Client-specific configuration
    beforeSend(event) {
      // Filter out development errors
      if (process.env.NODE_ENV === 'development' && event.exception) {
        const error = event.exception.values?.[0];
        if (error?.value?.includes('HMR') || error?.value?.includes('hot reload')) {
          return null;
        }
      }

      // Enhanced error context
      if (event.user) {
        event.user = {
          ...event.user,
          ip_address: '{{auto}}'
        };
      }

      return event;
    },

    // Browser-specific integrations
    integrations: [
      new Sentry.BrowserTracing({
        // Performance monitoring routes
        routingInstrumentation: Sentry.nextRouterInstrumentation,
        tracingOrigins: [
          'localhost',
          'trustboost-phase4.vercel.app',
          'trustboost-phase4-staging.vercel.app',
          /^\//  // Match relative URLs
        ]
      }),
      new Sentry.Replay({
        // Capture replays for errors and performance issues
        maskAllText: process.env.NODE_ENV === 'production',
        blockAllMedia: process.env.NODE_ENV === 'production'
      })
    ],

    // Transport options
    transport: Sentry.makeFetchTransport,

    // Client reports
    sendClientReports: true,

    // Debug mode
    debug: process.env.NODE_ENV === 'development',

    // Initial scope
    initialScope: {
      tags: {
        component: 'client',
        version: process.env.NEXT_PUBLIC_VERSION || 'unknown'
      },
      contexts: {
        app: {
          name: 'TrustBoost Phase 4',
          version: process.env.NEXT_PUBLIC_VERSION || 'development'
        }
      }
    },

    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'atomicFindClose',
      // Random plugins/extensions
      'window.OneSignal',
      'NonExistentPlugin',
      // Facebook borked
      'fb_xd_fragment',
      // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to reduce this. (thanks @acdha)
      'bmi_SafeAddOnload',
      'EBCallBackMessageReceived',
      // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
      'Script error.',
      'Non-Error promise rejection captured',
      // Chrome extensions
      /extension\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      // Firefox extensions
      /^resource:\/\//i
    ],

    // Deny URLs
    denyUrls: [
      // Chrome extensions
      /extension\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      // Firefox extensions
      /^resource:\/\//i,
      // Error from ad networks
      /googleads\.g\.doubleclick\.net/i,
      /googlesyndication\.com/i,
      /adsystem\.google\.com/i,
      /googletagservices\.com/i,
      /googletagmanager\.com/i,
      /facebook\.com/i,
      /connect\.facebook\.net/i
    ],

    // Allow URLs
    allowUrls: [
      /https?:\/\/.*\.trustboost\.com/,
      /https?:\/\/.*\.vercel\.app/,
      /https?:\/\/localhost/
    ]
  });

  // Set user context if available
  if (typeof window !== 'undefined') {
    Sentry.setContext('device', {
      userAgent: navigator.userAgent,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      platform: navigator.platform
    });

    // Performance observer for Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            Sentry.addBreadcrumb({
              category: 'navigation',
              message: `Navigation to ${entry.name}`,
              level: 'info',
              data: {
                duration: entry.duration,
                type: entry.type
              }
            });
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
      } catch (e) {
        // PerformanceObserver not fully supported
        console.debug('PerformanceObserver not fully supported:', e);
      }
    }
  }

  console.log('✅ Sentry client initialized for TrustBoost Phase 4');
} else {
  console.warn('⚠️  Sentry DSN not found. Error reporting is disabled.');
}
