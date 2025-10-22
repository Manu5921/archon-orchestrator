/**
 * AGENT 6: Performance & Optimization Engineer
 * TrustBoost Phase 4 - Real-Time Performance Monitoring Dashboard
 *
 * Dashboard temps réel pour monitoring performance
 * - Core Web Vitals en live
 * - Database performance metrics
 * - Cache hit ratios
 * - Bundle size monitoring
 * - Alerts automatiques
 */

import EventEmitter from 'events';
import { performance } from 'perf_hooks';

/**
 * Real-time performance monitoring dashboard
 */
export class RealTimeMonitor extends EventEmitter {
  constructor(options = {}) {
    super();

    this.options = {
      // Update intervals
      metricsInterval: 1000, // 1 second
      dashboardInterval: 5000, // 5 seconds
      reportInterval: 60000, // 1 minute

      // Performance thresholds
      coreWebVitals: {
        FCP: { good: 1800, poor: 3000 },
        LCP: { good: 2500, poor: 4000 },
        FID: { good: 100, poor: 300 },
        CLS: { good: 0.1, poor: 0.25 },
        TTFB: { good: 800, poor: 1800 }
      },

      // Alert thresholds
      alertThresholds: {
        errorRate: 0.05, // 5% error rate
        responseTime: 100, // 100ms average
        cacheHitRatio: 0.8, // 80% cache hit ratio
        memoryUsage: 0.8 // 80% memory usage
      },

      // Dashboard configuration
      maxDataPoints: 100,
      enableWebSocket: true,
      dashboardPort: 3001,

      ...options
    };

    // Data storage for dashboard
    this.metrics = {
      webVitals: new Map(),
      database: new Map(),
      cache: new Map(),
      system: new Map(),
      errors: []
    };

    // Real-time data streams
    this.dataStreams = new Map();
    this.alerts = [];
    this.clients = new Set();

    // Start monitoring
    this.startMonitoring();
    this.setupWebSocketServer();
  }

  /**
   * Start all monitoring processes
   */
  startMonitoring() {
    // Metrics collection interval
    this.metricsTimer = setInterval(() => {
      this.collectSystemMetrics();
    }, this.options.metricsInterval);

    // Dashboard update interval
    this.dashboardTimer = setInterval(() => {
      this.updateDashboard();
    }, this.options.dashboardInterval);

    // Performance report interval
    this.reportTimer = setInterval(() => {
      this.generatePerformanceReport();
    }, this.options.reportInterval);

    console.log('Real-time monitoring started');
  }

  /**
   * Collect system performance metrics
   */
  collectSystemMetrics() {
    const timestamp = Date.now();

    // Memory usage
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const memUsage = process.memoryUsage();
      this.recordMetric('system', 'memory', {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        external: memUsage.external,
        timestamp
      });
    }

    // CPU usage approximation
    const cpuUsage = this.getCPUUsage();
    this.recordMetric('system', 'cpu', {
      usage: cpuUsage,
      timestamp
    });

    // Event loop lag
    const eventLoopLag = this.measureEventLoopLag();
    this.recordMetric('system', 'eventLoop', {
      lag: eventLoopLag,
      timestamp
    });
  }

  /**
   * Record Web Vitals metric
   */
  recordWebVital(metric) {
    const { name, value, rating } = metric;
    const timestamp = Date.now();

    this.recordMetric('webVitals', name, {
      value,
      rating,
      timestamp,
      isGood: rating === 'good'
    });

    // Check for alerts
    this.checkWebVitalsAlert(metric);

    // Emit real-time update
    this.emit('webvital', { name, value, rating, timestamp });

    // Send to connected clients
    this.broadcastToClients('webvital', { name, value, rating, timestamp });
  }

  /**
   * Record database performance metric
   */
  recordDatabaseMetric(queryId, duration, status) {
    const timestamp = Date.now();

    this.recordMetric('database', 'query', {
      queryId,
      duration,
      status,
      timestamp
    });

    // Check for alerts
    if (duration > this.options.alertThresholds.responseTime) {
      this.createAlert('database', 'slow-query', {
        queryId,
        duration,
        threshold: this.options.alertThresholds.responseTime
      });
    }

    // Emit real-time update
    this.emit('database', { queryId, duration, status, timestamp });
    this.broadcastToClients('database', { duration, status, timestamp });
  }

  /**
   * Record cache performance metric
   */
  recordCacheMetric(operation, result, duration) {
    const timestamp = Date.now();

    this.recordMetric('cache', operation, {
      result, // 'hit' or 'miss'
      duration,
      timestamp
    });

    // Calculate hit ratio
    const recentCache = this.getRecentMetrics('cache', operation, 100);
    const hits = recentCache.filter(m => m.result === 'hit').length;
    const hitRatio = recentCache.length > 0 ? hits / recentCache.length : 0;

    // Check for alerts
    if (hitRatio < this.options.alertThresholds.cacheHitRatio) {
      this.createAlert('cache', 'low-hit-ratio', {
        currentRatio: hitRatio,
        threshold: this.options.alertThresholds.cacheHitRatio
      });
    }

    // Emit real-time update
    this.emit('cache', { operation, result, duration, hitRatio, timestamp });
    this.broadcastToClients('cache', { operation, result, hitRatio, timestamp });
  }

  /**
   * Record generic metric
   */
  recordMetric(category, type, data) {
    if (!this.metrics[category]) {
      this.metrics[category] = new Map();
    }

    if (!this.metrics[category].has(type)) {
      this.metrics[category].set(type, []);
    }

    const metrics = this.metrics[category].get(type);
    metrics.push(data);

    // Keep only recent metrics for memory efficiency
    if (metrics.length > this.options.maxDataPoints) {
      metrics.splice(0, metrics.length - this.options.maxDataPoints);
    }
  }

  /**
   * Get recent metrics for analysis
   */
  getRecentMetrics(category, type, count = 50) {
    if (!this.metrics[category] || !this.metrics[category].has(type)) {
      return [];
    }

    const metrics = this.metrics[category].get(type);
    return metrics.slice(-count);
  }

  /**
   * Update dashboard with current data
   */
  updateDashboard() {
    const dashboardData = {
      timestamp: Date.now(),
      webVitals: this.getWebVitalsSummary(),
      database: this.getDatabaseSummary(),
      cache: this.getCacheSummary(),
      system: this.getSystemSummary(),
      alerts: this.getActiveAlerts(),
      performance: this.getOverallPerformance()
    };

    // Emit dashboard update
    this.emit('dashboard', dashboardData);
    this.broadcastToClients('dashboard', dashboardData);
  }

  /**
   * Get Web Vitals summary
   */
  getWebVitalsSummary() {
    const summary = {};

    ['FCP', 'LCP', 'FID', 'CLS', 'TTFB'].forEach(metric => {
      const recent = this.getRecentMetrics('webVitals', metric, 10);
      if (recent.length > 0) {
        const latest = recent[recent.length - 1];
        const average = recent.reduce((sum, m) => sum + m.value, 0) / recent.length;

        summary[metric] = {
          current: latest.value,
          average: Math.round(average),
          rating: latest.rating,
          trend: this.calculateTrend(recent.map(m => m.value)),
          isGood: latest.isGood
        };
      }
    });

    return summary;
  }

  /**
   * Get database performance summary
   */
  getDatabaseSummary() {
    const queries = this.getRecentMetrics('database', 'query', 100);

    if (queries.length === 0) {
      return { status: 'no-data' };
    }

    const durations = queries.map(q => q.duration);
    const errors = queries.filter(q => q.status === 'error').length;

    return {
      totalQueries: queries.length,
      averageTime: Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length),
      p95: Math.round(this.calculatePercentile(durations, 0.95)),
      p99: Math.round(this.calculatePercentile(durations, 0.99)),
      errorRate: Math.round((errors / queries.length) * 100) / 100,
      slowQueries: durations.filter(d => d > 50).length,
      trend: this.calculateTrend(durations.slice(-20))
    };
  }

  /**
   * Get cache performance summary
   */
  getCacheSummary() {
    const operations = this.getRecentMetrics('cache', 'operation', 100);

    if (operations.length === 0) {
      return { status: 'no-data' };
    }

    const hits = operations.filter(op => op.result === 'hit').length;
    const hitRatio = hits / operations.length;

    return {
      totalOperations: operations.length,
      hitRatio: Math.round(hitRatio * 100) / 100,
      avgDuration: Math.round(
        operations.reduce((sum, op) => sum + op.duration, 0) / operations.length
      ),
      trend: this.calculateTrend(
        operations.slice(-20).map(op => op.result === 'hit' ? 1 : 0)
      )
    };
  }

  /**
   * Get system performance summary
   */
  getSystemSummary() {
    const memory = this.getRecentMetrics('system', 'memory', 10);
    const cpu = this.getRecentMetrics('system', 'cpu', 10);
    const eventLoop = this.getRecentMetrics('system', 'eventLoop', 10);

    const summary = {};

    if (memory.length > 0) {
      const latest = memory[memory.length - 1];
      summary.memory = {
        used: Math.round(latest.used / 1024 / 1024), // MB
        total: Math.round(latest.total / 1024 / 1024), // MB
        usage: Math.round((latest.used / latest.total) * 100) / 100
      };
    }

    if (cpu.length > 0) {
      const latest = cpu[cpu.length - 1];
      summary.cpu = {
        usage: Math.round(latest.usage * 100) / 100
      };
    }

    if (eventLoop.length > 0) {
      const latest = eventLoop[eventLoop.length - 1];
      summary.eventLoop = {
        lag: Math.round(latest.lag)
      };
    }

    return summary;
  }

  /**
   * Create performance alert
   */
  createAlert(category, type, data) {
    const alert = {
      id: this.generateAlertId(),
      category,
      type,
      data,
      timestamp: Date.now(),
      severity: this.getAlertSeverity(category, type, data),
      acknowledged: false
    };

    this.alerts.push(alert);

    // Keep only recent alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-50);
    }

    console.warn(`Performance Alert [${alert.severity.toUpperCase()}]:`, alert);

    // Emit alert
    this.emit('alert', alert);
    this.broadcastToClients('alert', alert);

    return alert;
  }

  /**
   * Check Web Vitals for alerts
   */
  checkWebVitalsAlert(metric) {
    const threshold = this.options.coreWebVitals[metric.name];

    if (threshold && metric.value > threshold.poor) {
      this.createAlert('webvitals', 'poor-performance', {
        metric: metric.name,
        value: metric.value,
        threshold: threshold.poor
      });
    }
  }

  /**
   * Get alert severity
   */
  getAlertSeverity(category, type, data) {
    // Define severity levels based on category and type
    const severityMap = {
      webvitals: {
        'poor-performance': 'high'
      },
      database: {
        'slow-query': 'medium'
      },
      cache: {
        'low-hit-ratio': 'medium'
      },
      system: {
        'high-memory': 'high',
        'high-cpu': 'medium'
      }
    };

    return severityMap[category]?.[type] || 'low';
  }

  /**
   * Get active alerts
   */
  getActiveAlerts() {
    const recentTime = Date.now() - (5 * 60 * 1000); // Last 5 minutes
    return this.alerts
      .filter(alert => alert.timestamp > recentTime && !alert.acknowledged)
      .sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });
  }

  /**
   * Get overall performance score
   */
  getOverallPerformance() {
    const webVitals = this.getWebVitalsSummary();
    const database = this.getDatabaseSummary();
    const cache = this.getCacheSummary();

    let score = 100;
    const issues = [];

    // Web Vitals scoring
    Object.entries(webVitals).forEach(([metric, data]) => {
      if (!data.isGood) {
        score -= 15;
        issues.push(`${metric} performance`);
      }
    });

    // Database scoring
    if (database.p99 > 50) {
      score -= 20;
      issues.push('Database latency');
    }

    // Cache scoring
    if (cache.hitRatio < 0.8) {
      score -= 10;
      issues.push('Cache efficiency');
    }

    return {
      score: Math.max(0, score),
      rating: this.getPerformanceRating(score),
      issues,
      timestamp: Date.now()
    };
  }

  /**
   * Get performance rating
   */
  getPerformanceRating(score) {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'fair';
    return 'poor';
  }

  /**
   * Generate performance report
   */
  generatePerformanceReport() {
    const report = {
      timestamp: Date.now(),
      period: '1-minute',
      webVitals: this.getWebVitalsSummary(),
      database: this.getDatabaseSummary(),
      cache: this.getCacheSummary(),
      system: this.getSystemSummary(),
      alerts: this.getActiveAlerts(),
      overall: this.getOverallPerformance(),
      recommendations: this.generateRecommendations()
    };

    // Emit report
    this.emit('report', report);

    // Log performance summary
    console.log('Performance Report:', {
      score: report.overall.score,
      rating: report.overall.rating,
      activeAlerts: report.alerts.length,
      webVitalsIssues: report.overall.issues.filter(i => i.includes('FCP') || i.includes('LCP')).length
    });

    return report;
  }

  /**
   * Generate performance recommendations
   */
  generateRecommendations() {
    const recommendations = [];
    const webVitals = this.getWebVitalsSummary();
    const database = this.getDatabaseSummary();
    const cache = this.getCacheSummary();

    // Web Vitals recommendations
    Object.entries(webVitals).forEach(([metric, data]) => {
      if (!data.isGood) {
        recommendations.push({
          category: 'webvitals',
          metric,
          priority: 'high',
          message: `${metric} is ${data.rating} (${data.current}ms)`,
          action: this.getWebVitalsRecommendation(metric)
        });
      }
    });

    // Database recommendations
    if (database.p99 > 50) {
      recommendations.push({
        category: 'database',
        priority: 'high',
        message: `P99 latency ${database.p99}ms exceeds 50ms target`,
        action: 'Optimize slow queries and add database indexes'
      });
    }

    // Cache recommendations
    if (cache.hitRatio < 0.8) {
      recommendations.push({
        category: 'cache',
        priority: 'medium',
        message: `Cache hit ratio ${cache.hitRatio * 100}% is below 80%`,
        action: 'Review caching strategy and increase TTL where appropriate'
      });
    }

    return recommendations;
  }

  /**
   * Get Web Vitals specific recommendation
   */
  getWebVitalsRecommendation(metric) {
    const recommendations = {
      FCP: 'Optimize critical rendering path, reduce server response time',
      LCP: 'Optimize images, remove render-blocking resources',
      FID: 'Reduce JavaScript execution time, optimize event handlers',
      CLS: 'Set explicit dimensions for images, avoid dynamic content insertion',
      TTFB: 'Optimize server processing, use CDN, enable caching'
    };

    return recommendations[metric] || 'Review Core Web Vitals optimization guide';
  }

  /**
   * Setup WebSocket server for real-time dashboard
   */
  setupWebSocketServer() {
    if (!this.options.enableWebSocket) return;

    try {
      const WebSocket = require('ws');
      const wss = new WebSocket.Server({ port: this.options.dashboardPort });

      wss.on('connection', (ws) => {
        this.clients.add(ws);
        console.log('Dashboard client connected');

        // Send initial data
        ws.send(JSON.stringify({
          type: 'initial',
          data: this.getCurrentDashboardData()
        }));

        ws.on('close', () => {
          this.clients.delete(ws);
          console.log('Dashboard client disconnected');
        });

        ws.on('message', (message) => {
          try {
            const data = JSON.parse(message);
            this.handleClientMessage(ws, data);
          } catch (e) {
            console.warn('Invalid client message:', e);
          }
        });
      });

      console.log(`WebSocket dashboard server listening on port ${this.options.dashboardPort}`);
    } catch (error) {
      console.warn('Failed to setup WebSocket server:', error);
    }
  }

  /**
   * Broadcast data to connected clients
   */
  broadcastToClients(type, data) {
    if (this.clients.size === 0) return;

    const message = JSON.stringify({ type, data, timestamp: Date.now() });

    this.clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        try {
          client.send(message);
        } catch (error) {
          console.warn('Failed to send to client:', error);
          this.clients.delete(client);
        }
      }
    });
  }

  /**
   * Handle client messages
   */
  handleClientMessage(ws, message) {
    switch (message.type) {
    case 'acknowledge-alert':
      this.acknowledgeAlert(message.alertId);
      break;
    case 'get-detailed-metrics':
      ws.send(JSON.stringify({
        type: 'detailed-metrics',
        data: this.getDetailedMetrics(message.category)
      }));
      break;
    }
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.broadcastToClients('alert-acknowledged', { alertId });
    }
  }

  /**
   * Get current dashboard data
   */
  getCurrentDashboardData() {
    return {
      webVitals: this.getWebVitalsSummary(),
      database: this.getDatabaseSummary(),
      cache: this.getCacheSummary(),
      system: this.getSystemSummary(),
      alerts: this.getActiveAlerts(),
      performance: this.getOverallPerformance()
    };
  }

  /**
   * Utility methods
   */
  calculatePercentile(values, percentile) {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * percentile) - 1;
    return sorted[Math.max(0, index)];
  }

  calculateTrend(values) {
    if (values.length < 2) return 'stable';
    const recent = values.slice(-5);
    const older = values.slice(-10, -5);

    const recentAvg = recent.reduce((sum, v) => sum + v, 0) / recent.length;
    const olderAvg = older.reduce((sum, v) => sum + v, 0) / older.length;

    if (recentAvg > olderAvg * 1.1) return 'increasing';
    if (recentAvg < olderAvg * 0.9) return 'decreasing';
    return 'stable';
  }

  getCPUUsage() {
    // Simplified CPU usage estimation
    const start = process.hrtime();
    const startUsage = process.cpuUsage();

    // Small computation to measure
    let i = 0;
    while (i < 100000) i++;

    const delta = process.hrtime(start);
    const deltaUsage = process.cpuUsage(startUsage);

    const totalTime = delta[0] * 1000000 + delta[1] / 1000; // microseconds
    const cpuTime = (deltaUsage.user + deltaUsage.system); // microseconds

    return Math.min(cpuTime / totalTime, 1);
  }

  measureEventLoopLag() {
    const start = process.hrtime.bigint();
    return new Promise((resolve) => {
      setImmediate(() => {
        const lag = Number(process.hrtime.bigint() - start) / 1000000; // ms
        resolve(lag);
      });
    });
  }

  generateAlertId() {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup and stop monitoring
   */
  dispose() {
    // Clear timers
    if (this.metricsTimer) clearInterval(this.metricsTimer);
    if (this.dashboardTimer) clearInterval(this.dashboardTimer);
    if (this.reportTimer) clearInterval(this.reportTimer);

    // Close WebSocket connections
    this.clients.forEach(client => {
      try {
        client.close();
      } catch (e) {
        console.warn('Error closing client connection:', e);
      }
    });

    // Clear data
    this.metrics = {};
    this.alerts = [];
    this.clients.clear();

    console.log('Real-time monitoring stopped');
  }
}

export default RealTimeMonitor;
