// TrustBoost Phase 4 - Health Check API
import type { NextApiRequest, NextApiResponse } from 'next'
import * as Sentry from '@sentry/nextjs'

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  environment: string
  services: {
    [key: string]: {
      status: 'up' | 'down' | 'degraded'
      responseTime?: number
      lastCheck: string
    }
  }
  system: {
    memory: NodeJS.MemoryUsage
    cpu: NodeJS.CpuUsage
    loadAverage: number[]
  }
}

interface ServiceCheck {
  name: string
  check: () => Promise<{ status: 'up' | 'down' | 'degraded', responseTime?: number }>
}

// Service health checks
const serviceChecks: ServiceCheck[] = [
  {
    name: 'database',
    check: async () => {
      const startTime = Date.now()
      try {
        // Simulate database check - replace with actual database ping
        // const result = await db.raw('SELECT 1')
        await new Promise(resolve => setTimeout(resolve, 10)) // Simulate DB ping
        return {
          status: 'up' as const,
          responseTime: Date.now() - startTime
        }
      } catch (error) {
        Sentry.captureException(error)
        return { status: 'down' as const }
      }
    }
  },
  {
    name: 'redis',
    check: async () => {
      const startTime = Date.now()
      try {
        // Simulate Redis check - replace with actual Redis ping
        // const result = await redis.ping()
        await new Promise(resolve => setTimeout(resolve, 5)) // Simulate Redis ping
        return {
          status: 'up' as const,
          responseTime: Date.now() - startTime
        }
      } catch (error) {
        Sentry.captureException(error)
        return { status: 'down' as const }
      }
    }
  },
  {
    name: 'external_api',
    check: async () => {
      const startTime = Date.now()
      try {
        // Example external service check
        const response = await fetch('https://httpbin.org/status/200', {
          method: 'GET',
          timeout: 5000,
          signal: AbortSignal.timeout(5000)
        })
        
        if (response.ok) {
          return {
            status: 'up' as const,
            responseTime: Date.now() - startTime
          }
        } else {
          return { status: 'degraded' as const }
        }
      } catch (error) {
        Sentry.captureException(error)
        return { status: 'down' as const }
      }
    }
  }
]

async function performHealthChecks(): Promise<HealthCheckResponse['services']> {
  const services: HealthCheckResponse['services'] = {}
  
  const checks = serviceChecks.map(async (service) => {
    const result = await service.check()
    services[service.name] = {
      ...result,
      lastCheck: new Date().toISOString()
    }
  })
  
  await Promise.allSettled(checks)
  return services
}

function determineOverallStatus(services: HealthCheckResponse['services']): 'healthy' | 'degraded' | 'unhealthy' {
  const statuses = Object.values(services).map(s => s.status)
  
  if (statuses.every(status => status === 'up')) {
    return 'healthy'
  } else if (statuses.some(status => status === 'down')) {
    return 'unhealthy'
  } else {
    return 'degraded'
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheckResponse | { error: string }>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const startTime = Date.now()
  
  try {
    // Perform all health checks
    const services = await performHealthChecks()
    const overallStatus = determineOverallStatus(services)
    
    // Get system metrics
    const memoryUsage = process.memoryUsage()
    const cpuUsage = process.cpuUsage()
    const loadAverage = process.platform !== 'win32' ? require('os').loadavg() : [0, 0, 0]
    
    const healthCheck: HealthCheckResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_VERSION || 'development',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services,
      system: {
        memory: memoryUsage,
        cpu: cpuUsage,
        loadAverage
      }
    }
    
    // Set appropriate HTTP status code
    let statusCode = 200
    if (overallStatus === 'degraded') {
      statusCode = 200 // Still operational
    } else if (overallStatus === 'unhealthy') {
      statusCode = 503 // Service unavailable
    }
    
    // Add performance headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('X-Response-Time', `${Date.now() - startTime}ms`)
    res.setHeader('X-Health-Status', overallStatus)
    
    // Log health check performance
    const responseTime = Date.now() - startTime
    if (responseTime > 1000) {
      Sentry.addBreadcrumb({
        message: 'Slow health check response',
        level: 'warning',
        data: {
          responseTime,
          status: overallStatus
        }
      })
    }
    
    return res.status(statusCode).json(healthCheck)
    
  } catch (error) {
    console.error('Health check failed:', error)
    Sentry.captureException(error)
    
    return res.status(500).json({
      error: 'Health check failed'
    })
  }
}

// Export config for API route
export const config = {
  api: {
    responseLimit: '1mb',
  },
}