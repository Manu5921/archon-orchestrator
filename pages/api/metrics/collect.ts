// TrustBoost Phase 4 - Metrics Collection API
import type { NextApiRequest, NextApiResponse } from 'next'
import * as Sentry from '@sentry/nextjs'

interface MetricsResponse {
  status: 'success' | 'error'
  timestamp: string
  metrics: {
    system: {
      memory: NodeJS.MemoryUsage
      cpu: NodeJS.CpuUsage
      uptime: number
      loadAverage: number[]
      platform: string
      nodeVersion: string
    }
    application: {
      version: string
      environment: string
      region: string
      buildId: string
    }
    performance: {
      eventLoopDelay: number
      gcMetrics?: any
    }
  }
  alerts?: Array<{
    level: 'warning' | 'critical'
    message: string
    value: number
    threshold: number
  }>
}

// Performance monitoring
const performanceObserver = (() => {
  let eventLoopDelay = 0
  
  // Measure event loop delay
  if (typeof process !== 'undefined') {
    const { performance } = require('perf_hooks')
    const start = performance.now()
    setImmediate(() => {
      eventLoopDelay = performance.now() - start
    })
  }
  
  return {
    getEventLoopDelay: () => eventLoopDelay
  }
})()

// System thresholds for alerts
const THRESHOLDS = {
  MEMORY_HEAP_USED_MB: 500, // MB
  MEMORY_HEAP_PERCENTAGE: 80, // %
  CPU_USER_MS: 1000, // ms
  EVENT_LOOP_DELAY_MS: 100, // ms
  UPTIME_MIN: 1, // minutes
} as const

function checkAlerts(metrics: MetricsResponse['metrics']): MetricsResponse['alerts'] {
  const alerts: MetricsResponse['alerts'] = []
  
  // Memory alerts
  const heapUsedMB = metrics.system.memory.heapUsed / 1024 / 1024
  if (heapUsedMB > THRESHOLDS.MEMORY_HEAP_USED_MB) {
    alerts.push({
      level: 'warning',
      message: 'High heap memory usage',
      value: heapUsedMB,
      threshold: THRESHOLDS.MEMORY_HEAP_USED_MB
    })
  }
  
  const heapPercentage = (metrics.system.memory.heapUsed / metrics.system.memory.heapTotal) * 100
  if (heapPercentage > THRESHOLDS.MEMORY_HEAP_PERCENTAGE) {
    alerts.push({
      level: 'critical',
      message: 'Memory heap usage critically high',
      value: heapPercentage,
      threshold: THRESHOLDS.MEMORY_HEAP_PERCENTAGE
    })
  }
  
  // CPU alerts
  const cpuUserMs = metrics.system.cpu.user / 1000 // Convert microseconds to milliseconds
  if (cpuUserMs > THRESHOLDS.CPU_USER_MS) {
    alerts.push({
      level: 'warning',
      message: 'High CPU usage detected',
      value: cpuUserMs,
      threshold: THRESHOLDS.CPU_USER_MS
    })
  }
  
  // Event loop delay
  if (metrics.performance.eventLoopDelay > THRESHOLDS.EVENT_LOOP_DELAY_MS) {
    alerts.push({
      level: 'warning',
      message: 'Event loop delay detected',
      value: metrics.performance.eventLoopDelay,
      threshold: THRESHOLDS.EVENT_LOOP_DELAY_MS
    })
  }
  
  return alerts.length > 0 ? alerts : undefined
}

async function collectGCMetrics() {
  try {
    // Only available in Node.js with --expose-gc flag
    if (global.gc) {
      const before = process.memoryUsage()
      global.gc()
      const after = process.memoryUsage()
      
      return {
        freedMemory: before.heapUsed - after.heapUsed,
        beforeGC: before,
        afterGC: after
      }
    }
  } catch (error) {
    // GC not available
    console.debug('GC metrics not available:', error)
  }
  return undefined
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MetricsResponse | { error: string }>
) {
  // Only allow GET requests (called by cron)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  // Verify this is being called by Vercel cron or authorized source
  const authHeader = req.headers.authorization
  const cronSecret = process.env.CRON_SECRET
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  try {
    const timestamp = new Date().toISOString()
    
    // Collect system metrics
    const memoryUsage = process.memoryUsage()
    const cpuUsage = process.cpuUsage()
    const uptime = process.uptime()
    const loadAverage = process.platform !== 'win32' ? require('os').loadavg() : [0, 0, 0]
    
    // Collect application metrics
    const version = process.env.NEXT_PUBLIC_VERSION || 'development'
    const environment = process.env.NODE_ENV || 'development'
    const region = process.env.VERCEL_REGION || 'local'
    const buildId = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || 'local'
    
    // Collect performance metrics
    const eventLoopDelay = performanceObserver.getEventLoopDelay()
    const gcMetrics = await collectGCMetrics()
    
    const metrics: MetricsResponse['metrics'] = {
      system: {
        memory: memoryUsage,
        cpu: cpuUsage,
        uptime,
        loadAverage,
        platform: process.platform,
        nodeVersion: process.version
      },
      application: {
        version,
        environment,
        region,
        buildId
      },
      performance: {
        eventLoopDelay,
        gcMetrics
      }
    }
    
    // Check for alerts
    const alerts = checkAlerts(metrics)
    
    const response: MetricsResponse = {
      status: 'success',
      timestamp,
      metrics,
      alerts
    }
    
    // Log metrics to Sentry for monitoring
    Sentry.addBreadcrumb({
      category: 'metrics',
      message: 'System metrics collected',
      level: 'info',
      data: {
        heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        uptimeMinutes: Math.round(uptime / 60),
        alertsCount: alerts?.length || 0
      }
    })
    
    // Send alerts to Sentry if any
    if (alerts && alerts.length > 0) {
      alerts.forEach(alert => {
        if (alert.level === 'critical') {
          Sentry.captureMessage(`Critical alert: ${alert.message}`, 'error')
        } else {
          Sentry.captureMessage(`Warning alert: ${alert.message}`, 'warning')
        }
      })
    }
    
    // Set cache headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('X-Metrics-Timestamp', timestamp)
    
    return res.status(200).json(response)
    
  } catch (error) {
    console.error('Metrics collection failed:', error)
    Sentry.captureException(error)
    
    return res.status(500).json({
      error: 'Failed to collect metrics'
    })
  }
}

// Export config for API route
export const config = {
  api: {
    responseLimit: '2mb',
    // Don't run on Edge runtime for better system access
  },
  maxDuration: 30, // 30 seconds timeout
}