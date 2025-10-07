// TrustBoost Phase 4 - Sentry Server Configuration
import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Environment configuration
    environment: process.env.NODE_ENV || 'development',
    
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
    
    // Profiling
    profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 0.1,
    
    // Release information
    release: process.env.NEXT_PUBLIC_VERSION || process.env.VERCEL_GIT_COMMIT_SHA || 'development',
    
    // Server name
    serverName: process.env.VERCEL_REGION || 'local',
    
    // Enhanced error filtering for server
    beforeSend(event, hint) {
      // Enhanced server-side error context
      if (event.request) {
        // Remove sensitive headers
        if (event.request.headers) {
          delete event.request.headers.authorization
          delete event.request.headers.cookie
          delete event.request.headers['x-api-key']
        }
        
        // Add custom request context
        event.contexts = {
          ...event.contexts,
          request_details: {
            method: event.request.method,
            url: event.request.url,
            user_agent: event.request.headers?.['user-agent'],
            cf_ray: event.request.headers?.['cf-ray'], // Cloudflare Ray ID
          }
        }
      }
      
      // Filter out certain server errors
      if (hint.originalException instanceof Error) {
        const error = hint.originalException
        
        // Skip network timeout errors
        if (error.message.includes('ETIMEDOUT') || error.message.includes('ECONNRESET')) {
          return null
        }
        
        // Skip rate limiting errors (they're expected)
        if (error.message.includes('Rate limit') || error.message.includes('429')) {
          return null
        }
        
        // Skip known Next.js build warnings
        if (error.message.includes('webpack') || error.message.includes('compilation')) {
          return null
        }
      }
      
      return event
    },
    
    // Server-specific integrations
    integrations: [
      // HTTP instrumentation
      new Sentry.Integrations.Http({ tracing: true }),
      
      // Node.js context
      new Sentry.Integrations.OnUncaughtException({
        exitEvenIfOtherHandlersAreRegistered: false,
      }),
      new Sentry.Integrations.OnUnhandledRejection({
        mode: 'warn',
      }),
    ],
    
    // Debug mode
    debug: process.env.NODE_ENV === 'development',
    
    // Initial scope
    initialScope: {
      tags: {
        component: 'server',
        runtime: 'nodejs',
        version: process.env.NEXT_PUBLIC_VERSION || 'unknown',
        region: process.env.VERCEL_REGION || 'local',
      },
      contexts: {
        app: {
          name: 'TrustBoost Phase 4 Server',
          version: process.env.NEXT_PUBLIC_VERSION || 'development',
        },
        runtime: {
          name: 'node',
          version: process.version,
        },
        os: {
          name: process.platform,
          version: process.version,
        }
      }
    },
    
    // Max breadcrumbs
    maxBreadcrumbs: 50,
    
    // Attach stack trace
    attachStacktrace: true,
    
    // Send default PII
    sendDefaultPii: false,
    
    // Max value length
    maxValueLength: 250,
    
    // Ignore specific errors
    ignoreErrors: [
      // Next.js internal errors
      'NEXT_NOT_FOUND',
      'NEXT_REDIRECT',
      // Database connection errors (handled by retry logic)
      'Connection terminated unexpectedly',
      'Connection lost',
      // Validation errors (expected business logic)
      /ValidationError/,
      /ValidatorError/,
    ],
  })
  
  // Add global error handlers
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error)
    Sentry.captureException(error)
  })
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    Sentry.captureException(reason)
  })
  
  // Set server context
  Sentry.setContext('server', {
    pid: process.pid,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    versions: process.versions,
    arch: process.arch,
    platform: process.platform,
  })
  
  // Custom performance monitoring for API routes
  Sentry.addGlobalEventProcessor((event) => {
    // Add server timing to all events
    if (event.type === 'transaction' && event.transaction) {
      event.contexts = {
        ...event.contexts,
        performance: {
          memory: process.memoryUsage(),
          uptime: process.uptime(),
          cpu_usage: process.cpuUsage(),
        }
      }
    }
    
    return event
  })
  
  console.log('✅ Sentry server initialized for TrustBoost Phase 4')
} else {
  console.warn('⚠️  Sentry DSN not found. Server error reporting is disabled.')
}