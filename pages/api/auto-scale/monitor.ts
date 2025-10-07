// TrustBoost Phase 4 - Auto-scaling Monitor API
import type { NextApiRequest, NextApiResponse } from 'next'
import * as Sentry from '@sentry/nextjs'

interface ScalingMetrics {
  timestamp: string
  currentLoad: {
    cpu: number
    memory: number
    activeConnections: number
    responseTime: number
    errorRate: number
  }
  thresholds: {
    cpu: { scale_up: number, scale_down: number }
    memory: { scale_up: number, scale_down: number }
    connections: { scale_up: number, scale_down: number }
    responseTime: { scale_up: number, scale_down: number }
    errorRate: { scale_up: number, scale_down: number }
  }
  recommendation: {
    action: 'scale_up' | 'scale_down' | 'maintain'
    reason: string
    confidence: number
    urgency: 'low' | 'medium' | 'high' | 'critical'
  }
  history: {
    lastScaleEvent: string | null
    cooldownUntil: string | null
    recentDecisions: Array<{
      timestamp: string
      action: string
      trigger: string
    }>
  }
}

interface AutoScaleConfig {
  enabled: boolean
  mode: 'reactive' | 'predictive' | 'hybrid'
  cooldownPeriod: number // minutes
  minInstances: number
  maxInstances: number
  thresholds: {
    cpu: { up: number, down: number }
    memory: { up: number, down: number }
    connections: { up: number, down: number }
    responseTime: { up: number, down: number } // ms
    errorRate: { up: number, down: number } // percentage
  }
  weights: {
    cpu: number
    memory: number
    connections: number
    responseTime: number
    errorRate: number
  }
}

// Default auto-scaling configuration
const DEFAULT_CONFIG: AutoScaleConfig = {
  enabled: process.env.NODE_ENV === 'production',
  mode: 'hybrid',
  cooldownPeriod: 5, // 5 minutes
  minInstances: 1,
  maxInstances: 10,
  thresholds: {
    cpu: { up: 70, down: 30 },
    memory: { up: 80, down: 40 },
    connections: { up: 100, down: 20 },
    responseTime: { up: 1000, down: 200 },
    errorRate: { up: 5, down: 1 }
  },
  weights: {
    cpu: 0.25,
    memory: 0.25,
    connections: 0.2,
    responseTime: 0.2,
    errorRate: 0.1
  }
}

// In-memory store for scaling decisions (in production, use Redis/database)
let scalingHistory: Array<{
  timestamp: string
  action: string
  trigger: string
}> = []

let lastScaleEvent: string | null = null
let cooldownUntil: string | null = null

function getCurrentMetrics(): Promise<ScalingMetrics['currentLoad']> {
  return new Promise((resolve) => {
    // Simulate getting current system metrics
    // In production, this would integrate with your monitoring system
    const mockMetrics = {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      activeConnections: Math.floor(Math.random() * 200),
      responseTime: Math.random() * 2000,
      errorRate: Math.random() * 10
    }
    
    resolve(mockMetrics)
  })
}

function calculateScalingScore(metrics: ScalingMetrics['currentLoad'], config: AutoScaleConfig): number {
  const { thresholds, weights } = config
  
  // Calculate individual scores (positive = scale up, negative = scale down)
  const cpuScore = metrics.cpu > thresholds.cpu.up ? 1 : metrics.cpu < thresholds.cpu.down ? -1 : 0
  const memoryScore = metrics.memory > thresholds.memory.up ? 1 : metrics.memory < thresholds.memory.down ? -1 : 0
  const connectionsScore = metrics.activeConnections > thresholds.connections.up ? 1 : metrics.activeConnections < thresholds.connections.down ? -1 : 0
  const responseTimeScore = metrics.responseTime > thresholds.responseTime.up ? 1 : metrics.responseTime < thresholds.responseTime.down ? -1 : 0
  const errorRateScore = metrics.errorRate > thresholds.errorRate.up ? 1 : metrics.errorRate < thresholds.errorRate.down ? -1 : 0
  
  // Weighted composite score
  const compositeScore = 
    cpuScore * weights.cpu +
    memoryScore * weights.memory +
    connectionsScore * weights.connections +
    responseTimeScore * weights.responseTime +
    errorRateScore * weights.errorRate
  
  return compositeScore
}

function determineScalingAction(
  metrics: ScalingMetrics['currentLoad'], 
  config: AutoScaleConfig
): ScalingMetrics['recommendation'] {
  const score = calculateScalingScore(metrics, config)
  const now = new Date()
  
  // Check cooldown period
  if (cooldownUntil && now < new Date(cooldownUntil)) {
    return {
      action: 'maintain',
      reason: `Cooldown period active until ${cooldownUntil}`,
      confidence: 1.0,
      urgency: 'low'
    }
  }
  
  // Determine urgency based on severity
  let urgency: ScalingMetrics['recommendation']['urgency'] = 'low'
  if (metrics.cpu > 90 || metrics.memory > 90 || metrics.errorRate > 10) {
    urgency = 'critical'
  } else if (metrics.cpu > 80 || metrics.memory > 80 || metrics.responseTime > 1500) {
    urgency = 'high'
  } else if (score > 0.5 || score < -0.5) {
    urgency = 'medium'
  }
  
  // Make scaling decision
  if (score > 0.3) {
    // Scale up conditions
    const reasons = []
    if (metrics.cpu > config.thresholds.cpu.up) reasons.push(`CPU: ${metrics.cpu.toFixed(1)}%`)
    if (metrics.memory > config.thresholds.memory.up) reasons.push(`Memory: ${metrics.memory.toFixed(1)}%`)
    if (metrics.activeConnections > config.thresholds.connections.up) reasons.push(`Connections: ${metrics.activeConnections}`)
    if (metrics.responseTime > config.thresholds.responseTime.up) reasons.push(`Response Time: ${metrics.responseTime.toFixed(0)}ms`)
    if (metrics.errorRate > config.thresholds.errorRate.up) reasons.push(`Error Rate: ${metrics.errorRate.toFixed(1)}%`)
    
    return {
      action: 'scale_up',
      reason: `High load detected: ${reasons.join(', ')}`,
      confidence: Math.min(score, 1.0),
      urgency
    }
  } else if (score < -0.3) {
    // Scale down conditions
    const reasons = []
    if (metrics.cpu < config.thresholds.cpu.down) reasons.push(`CPU: ${metrics.cpu.toFixed(1)}%`)
    if (metrics.memory < config.thresholds.memory.down) reasons.push(`Memory: ${metrics.memory.toFixed(1)}%`)
    if (metrics.activeConnections < config.thresholds.connections.down) reasons.push(`Connections: ${metrics.activeConnections}`)
    if (metrics.responseTime < config.thresholds.responseTime.down) reasons.push(`Response Time: ${metrics.responseTime.toFixed(0)}ms`)
    if (metrics.errorRate < config.thresholds.errorRate.down) reasons.push(`Error Rate: ${metrics.errorRate.toFixed(1)}%`)
    
    return {
      action: 'scale_down',
      reason: `Low load detected: ${reasons.join(', ')}`,
      confidence: Math.min(Math.abs(score), 1.0),
      urgency: 'low'
    }
  } else {
    return {
      action: 'maintain',
      reason: 'Load within acceptable thresholds',
      confidence: 1.0 - Math.abs(score),
      urgency: 'low'
    }
  }
}

function recordScalingDecision(action: string, reason: string) {
  const timestamp = new Date().toISOString()
  
  // Add to history
  scalingHistory.unshift({
    timestamp,
    action,
    trigger: reason
  })
  
  // Keep only last 50 decisions
  if (scalingHistory.length > 50) {
    scalingHistory = scalingHistory.slice(0, 50)
  }
  
  // Update last scale event and cooldown
  if (action !== 'maintain') {
    lastScaleEvent = timestamp
    cooldownUntil = new Date(Date.now() + DEFAULT_CONFIG.cooldownPeriod * 60 * 1000).toISOString()
  }
}

async function executeScalingAction(action: string, reason: string): Promise<boolean> {
  if (action === 'maintain') {
    return true
  }
  
  try {
    // In a real implementation, this would call Vercel API or other infrastructure APIs
    console.log(`Executing scaling action: ${action} - ${reason}`)
    
    // Simulate API call to scaling service
    const mockApiCall = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Simulate occasional failures
        resolve(Math.random() > 0.1) // 90% success rate
      }, 1000)
    })
    
    const success = await mockApiCall
    
    if (success) {
      // Send scaling event to Sentry for monitoring
      Sentry.addBreadcrumb({
        category: 'autoscaling',
        message: `Scaling action executed: ${action}`,
        level: action === 'scale_up' ? 'warning' : 'info',
        data: {
          action,
          reason,
          timestamp: new Date().toISOString()
        }
      })
      
      console.log(`✅ Scaling action successful: ${action}`)
    } else {
      console.error(`❌ Scaling action failed: ${action}`)
      Sentry.captureMessage(`Auto-scaling action failed: ${action}`, 'error')
    }
    
    return success
  } catch (error) {
    console.error('Error executing scaling action:', error)
    Sentry.captureException(error)
    return false
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ScalingMetrics | { error: string }>
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  try {
    // Get current system metrics
    const currentLoad = await getCurrentMetrics()
    
    // Determine scaling recommendation
    const recommendation = determineScalingAction(currentLoad, DEFAULT_CONFIG)
    
    // Execute scaling action if this is a POST request and action is recommended
    if (req.method === 'POST' && recommendation.action !== 'maintain') {
      const executed = await executeScalingAction(recommendation.action, recommendation.reason)
      
      if (executed) {
        recordScalingDecision(recommendation.action, recommendation.reason)
      }
    }
    
    const response: ScalingMetrics = {
      timestamp: new Date().toISOString(),
      currentLoad,
      thresholds: {
        cpu: { scale_up: DEFAULT_CONFIG.thresholds.cpu.up, scale_down: DEFAULT_CONFIG.thresholds.cpu.down },
        memory: { scale_up: DEFAULT_CONFIG.thresholds.memory.up, scale_down: DEFAULT_CONFIG.thresholds.memory.down },
        connections: { scale_up: DEFAULT_CONFIG.thresholds.connections.up, scale_down: DEFAULT_CONFIG.thresholds.connections.down },
        responseTime: { scale_up: DEFAULT_CONFIG.thresholds.responseTime.up, scale_down: DEFAULT_CONFIG.thresholds.responseTime.down },
        errorRate: { scale_up: DEFAULT_CONFIG.thresholds.errorRate.up, scale_down: DEFAULT_CONFIG.thresholds.errorRate.down }
      },
      recommendation,
      history: {
        lastScaleEvent,
        cooldownUntil,
        recentDecisions: scalingHistory.slice(0, 10)
      }
    }
    
    // Set appropriate cache headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('X-Scaling-Status', recommendation.action)
    res.setHeader('X-Scaling-Urgency', recommendation.urgency)
    
    return res.status(200).json(response)
    
  } catch (error) {
    console.error('Auto-scaling monitor error:', error)
    Sentry.captureException(error)
    
    return res.status(500).json({
      error: 'Auto-scaling monitoring failed'
    })
  }
}

// Export config for API route
export const config = {
  api: {
    responseLimit: '2mb',
  },
  maxDuration: 30, // 30 seconds timeout
}