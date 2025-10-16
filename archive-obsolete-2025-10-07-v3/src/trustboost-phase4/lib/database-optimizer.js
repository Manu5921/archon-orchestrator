/**
 * AGENT 6: Performance & Optimization Engineer
 * TrustBoost Phase 4 - Database Query Optimizer
 *
 * Optimisation des requêtes pour <50ms p99
 * - Query caching et preparation
 * - Connection pooling optimisé
 * - Index recommendations
 * - Query analysis et monitoring
 */

import { performance } from 'perf_hooks';

/**
 * Database Performance Optimizer
 */
export class DatabaseOptimizer {
  constructor(options = {}) {
    this.options = {
      // Performance targets
      p99Target: 50, // <50ms p99 requirement
      p95Target: 30, // <30ms p95 for better UX
      p50Target: 15, // <15ms median

      // Connection pooling
      maxConnections: 20,
      minConnections: 5,
      acquireTimeout: 30000,
      idleTimeout: 30000,

      // Query caching
      queryCacheSize: 1000,
      queryCacheTTL: 300000, // 5 minutes

      // Monitoring
      enableQueryAnalysis: true,
      slowQueryThreshold: 25, // Log queries >25ms

      ...options
    };

    // Query metrics storage
    this.queryMetrics = new Map();
    this.preparedStatements = new Map();
    this.connectionPool = null;

    // Query cache for repeated queries
    this.queryCache = new Map();

    this.initializeMonitoring();
  }

  /**
   * Initialize performance monitoring
   */
  initializeMonitoring() {
    // Reset metrics periodically
    setInterval(() => {
      this.resetMetrics();
    }, 300000); // Every 5 minutes
  }

  /**
   * Execute query with performance monitoring
   */
  async executeQuery(query, params = [], options = {}) {
    const queryId = this.getQueryId(query);
    const startTime = performance.now();

    try {
      // Check query cache first
      if (options.cache !== false) {
        const cachedResult = this.getFromCache(queryId, params);
        if (cachedResult) {
          this.recordMetric(queryId, performance.now() - startTime, 'cache-hit');
          return cachedResult;
        }
      }

      // Prepare statement if not exists
      if (!this.preparedStatements.has(queryId)) {
        await this.prepareStatement(queryId, query);
      }

      // Execute query
      const result = await this.executeWithPool(queryId, params, options);

      // Cache result if appropriate
      if (options.cache !== false && this.shouldCache(query)) {
        this.setInCache(queryId, params, result);
      }

      const duration = performance.now() - startTime;
      this.recordMetric(queryId, duration, 'success');

      // Log slow queries
      if (duration > this.options.slowQueryThreshold) {
        console.warn(`Slow query detected (${Math.round(duration)}ms):`, {
          query: this.sanitizeQuery(query),
          duration,
          params: this.sanitizeParams(params)
        });
      }

      return result;

    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordMetric(queryId, duration, 'error');

      console.error('Database query error:', {
        query: this.sanitizeQuery(query),
        error: error.message,
        duration
      });

      throw error;
    }
  }

  /**
   * Batch query execution with optimization
   */
  async executeBatch(queries, options = {}) {
    const startTime = performance.now();

    try {
      // Group similar queries for better performance
      const groupedQueries = this.groupQueries(queries);
      const results = [];

      for (const group of groupedQueries) {
        if (group.length === 1) {
          // Single query
          const result = await this.executeQuery(group[0].query, group[0].params, options);
          results.push(result);
        } else {
          // Batch similar queries
          const batchResults = await this.executeBatchGroup(group, options);
          results.push(...batchResults);
        }
      }

      const duration = performance.now() - startTime;
      this.recordMetric('batch', duration, 'success');

      return results;

    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordMetric('batch', duration, 'error');
      throw error;
    }
  }

  /**
   * Connection pool management
   */
  async initializePool(config = {}) {
    const poolConfig = {
      max: this.options.maxConnections,
      min: this.options.minConnections,
      acquire: this.options.acquireTimeout,
      idle: this.options.idleTimeout,
      evict: 1000,
      ...config
    };

    // Initialize based on database type
    if (config.type === 'postgres') {
      const { Pool } = await import('pg');
      this.connectionPool = new Pool(poolConfig);
    } else if (config.type === 'mysql') {
      const mysql = await import('mysql2/promise');
      this.connectionPool = mysql.createPool(poolConfig);
    } else if (config.type === 'sqlite') {
      // SQLite doesn't need pooling but we can simulate it
      this.connectionPool = {
        query: this.createSQLiteQuery(config.database)
      };
    }

    console.log('Database connection pool initialized:', poolConfig);
  }

  /**
   * Prepare statement for reuse
   */
  async prepareStatement(queryId, query) {
    try {
      if (this.connectionPool && this.connectionPool.prepare) {
        const prepared = await this.connectionPool.prepare(query);
        this.preparedStatements.set(queryId, prepared);
      } else {
        // Store query for databases that don't support prepare
        this.preparedStatements.set(queryId, query);
      }
    } catch (error) {
      console.warn(`Could not prepare statement ${queryId}:`, error.message);
      this.preparedStatements.set(queryId, query);
    }
  }

  /**
   * Execute query with connection pool
   */
  async executeWithPool(queryId, params, options) {
    if (!this.connectionPool) {
      throw new Error('Database connection pool not initialized');
    }

    const prepared = this.preparedStatements.get(queryId);

    if (typeof prepared === 'object' && prepared.execute) {
      // Prepared statement
      return await prepared.execute(params);
    } else {
      // Raw query
      return await this.connectionPool.query(prepared, params);
    }
  }

  /**
   * Query caching logic
   */
  getFromCache(queryId, params) {
    const cacheKey = this.getCacheKey(queryId, params);
    const cached = this.queryCache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp) < this.options.queryCacheTTL) {
      return cached.result;
    }

    return null;
  }

  setInCache(queryId, params, result) {
    const cacheKey = this.getCacheKey(queryId, params);

    // Limit cache size
    if (this.queryCache.size >= this.options.queryCacheSize) {
      const oldestKey = this.queryCache.keys().next().value;
      this.queryCache.delete(oldestKey);
    }

    this.queryCache.set(cacheKey, {
      result: this.deepClone(result),
      timestamp: Date.now()
    });
  }

  shouldCache(query) {
    const upperQuery = query.toUpperCase().trim();

    // Only cache SELECT queries
    if (!upperQuery.startsWith('SELECT')) {
      return false;
    }

    // Don't cache queries with NOW(), RAND(), etc.
    const nonCacheableKeywords = ['NOW()', 'RAND()', 'RANDOM()', 'CURRENT_TIMESTAMP'];
    return !nonCacheableKeywords.some(keyword => upperQuery.includes(keyword));
  }

  /**
   * Query analysis and optimization recommendations
   */
  analyzeQueryPerformance(queryId) {
    const metrics = this.queryMetrics.get(queryId);
    if (!metrics) return null;

    const analysis = {
      queryId,
      executionCount: metrics.count,
      averageTime: metrics.totalTime / metrics.count,
      p50: this.calculatePercentile(metrics.times, 0.5),
      p95: this.calculatePercentile(metrics.times, 0.95),
      p99: this.calculatePercentile(metrics.times, 0.99),
      maxTime: Math.max(...metrics.times),
      minTime: Math.min(...metrics.times),
      errorRate: metrics.errors / metrics.count,
      cacheHitRate: metrics.cacheHits / metrics.count,
      recommendations: []
    };

    // Generate optimization recommendations
    if (analysis.p99 > this.options.p99Target) {
      analysis.recommendations.push({
        type: 'performance',
        priority: 'high',
        message: `P99 latency ${Math.round(analysis.p99)}ms exceeds target ${this.options.p99Target}ms`,
        suggestions: [
          'Add appropriate database indexes',
          'Consider query restructuring',
          'Review data model for normalization',
          'Implement result pagination'
        ]
      });
    }

    if (analysis.cacheHitRate < 0.8) {
      analysis.recommendations.push({
        type: 'caching',
        priority: 'medium',
        message: `Low cache hit rate ${Math.round(analysis.cacheHitRate * 100)}%`,
        suggestions: [
          'Increase cache TTL if appropriate',
          'Review caching strategy',
          'Consider read replicas for read-heavy queries'
        ]
      });
    }

    if (analysis.errorRate > 0.01) {
      analysis.recommendations.push({
        type: 'reliability',
        priority: 'high',
        message: `High error rate ${Math.round(analysis.errorRate * 100)}%`,
        suggestions: [
          'Review query syntax and parameters',
          'Add proper error handling',
          'Check database constraints',
          'Monitor database health'
        ]
      });
    }

    return analysis;
  }

  /**
   * Generate index recommendations
   */
  generateIndexRecommendations(queries = []) {
    const recommendations = [];
    const columnUsage = new Map();

    queries.forEach(query => {
      const columns = this.extractColumnsFromQuery(query);
      columns.forEach(column => {
        const current = columnUsage.get(column) || { count: 0, types: new Set() };
        current.count++;
        current.types.add(this.getQueryType(query));
        columnUsage.set(column, current);
      });
    });

    // Generate recommendations based on usage patterns
    columnUsage.forEach((usage, column) => {
      if (usage.count > 5 && usage.types.has('WHERE')) {
        recommendations.push({
          type: 'index',
          table: this.extractTableFromColumn(column),
          column: column.split('.').pop(),
          reason: `Frequently used in WHERE clauses (${usage.count} times)`,
          priority: usage.count > 20 ? 'high' : 'medium',
          sql: `CREATE INDEX idx_${column.replace('.', '_')} ON ${this.extractTableFromColumn(column)} (${column.split('.').pop()});`
        });
      }
    });

    return recommendations;
  }

  /**
   * Record performance metrics
   */
  recordMetric(queryId, duration, status) {
    if (!this.queryMetrics.has(queryId)) {
      this.queryMetrics.set(queryId, {
        count: 0,
        totalTime: 0,
        times: [],
        errors: 0,
        cacheHits: 0,
        lastExecuted: Date.now()
      });
    }

    const metric = this.queryMetrics.get(queryId);
    metric.count++;
    metric.totalTime += duration;
    metric.times.push(duration);
    metric.lastExecuted = Date.now();

    if (status === 'error') {
      metric.errors++;
    } else if (status === 'cache-hit') {
      metric.cacheHits++;
    }

    // Keep only last 1000 execution times for memory efficiency
    if (metric.times.length > 1000) {
      metric.times = metric.times.slice(-500);
    }
  }

  /**
   * Get overall performance summary
   */
  getPerformanceSummary() {
    const allMetrics = Array.from(this.queryMetrics.values());

    if (allMetrics.length === 0) {
      return { status: 'no-data' };
    }

    const allTimes = allMetrics.flatMap(m => m.times);
    const totalQueries = allMetrics.reduce((sum, m) => sum + m.count, 0);
    const totalErrors = allMetrics.reduce((sum, m) => sum + m.errors, 0);
    const totalCacheHits = allMetrics.reduce((sum, m) => sum + m.cacheHits, 0);

    const summary = {
      totalQueries,
      averageTime: allTimes.reduce((sum, t) => sum + t, 0) / allTimes.length,
      p50: this.calculatePercentile(allTimes, 0.5),
      p95: this.calculatePercentile(allTimes, 0.95),
      p99: this.calculatePercentile(allTimes, 0.99),
      errorRate: totalErrors / totalQueries,
      cacheHitRate: totalCacheHits / totalQueries,
      slowQueries: allMetrics.filter(m =>
        this.calculatePercentile(m.times, 0.95) > this.options.slowQueryThreshold
      ).length,
      performance: {
        p99Met: this.calculatePercentile(allTimes, 0.99) <= this.options.p99Target,
        p95Met: this.calculatePercentile(allTimes, 0.95) <= this.options.p95Target,
        p50Met: this.calculatePercentile(allTimes, 0.5) <= this.options.p50Target
      }
    };

    return summary;
  }

  /**
   * Utility methods
   */
  getQueryId(query) {
    // Normalize query for consistent caching
    return query
      .replace(/\s+/g, ' ')
      .replace(/\$\d+/g, '?') // PostgreSQL parameters
      .trim()
      .toLowerCase();
  }

  getCacheKey(queryId, params) {
    return `${queryId}::${JSON.stringify(params)}`;
  }

  calculatePercentile(values, percentile) {
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * percentile) - 1;
    return sorted[Math.max(0, index)];
  }

  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  sanitizeQuery(query) {
    // Remove sensitive data from query for logging
    return query.replace(/(['"])[^'"]*\1/g, "'***'");
  }

  sanitizeParams(params) {
    // Sanitize parameters for logging
    return params.map(() => '***');
  }

  extractColumnsFromQuery(query) {
    // Simple column extraction - could be enhanced
    const matches = query.match(/(\w+\.\w+|\w+)\s*=|\w+\s+IN\s*\(/gi);
    return matches ? matches.map(m => m.replace(/\s*[=IN\(].*/gi, '').trim()) : [];
  }

  extractTableFromColumn(column) {
    return column.includes('.') ? column.split('.')[0] : 'unknown';
  }

  getQueryType(query) {
    const upperQuery = query.toUpperCase().trim();
    if (upperQuery.includes('WHERE')) return 'WHERE';
    if (upperQuery.includes('ORDER BY')) return 'ORDER';
    if (upperQuery.includes('GROUP BY')) return 'GROUP';
    return 'SELECT';
  }

  groupQueries(queries) {
    // Group similar queries for batch execution
    const groups = new Map();

    queries.forEach(q => {
      const template = this.getQueryTemplate(q.query);
      if (!groups.has(template)) {
        groups.set(template, []);
      }
      groups.get(template).push(q);
    });

    return Array.from(groups.values());
  }

  getQueryTemplate(query) {
    // Extract query template by removing parameter values
    return query
      .replace(/\$\d+/g, '?')
      .replace(/['"][^'"]*['"]/g, '?')
      .replace(/\b\d+\b/g, '?');
  }

  resetMetrics() {
    // Keep only recent metrics to prevent memory bloat
    const cutoffTime = Date.now() - 3600000; // 1 hour

    for (const [queryId, metric] of this.queryMetrics.entries()) {
      if (metric.lastExecuted < cutoffTime) {
        this.queryMetrics.delete(queryId);
      }
    }

    // Clear old cache entries
    const cacheEntries = Array.from(this.queryCache.entries());
    const staleCutoff = Date.now() - this.options.queryCacheTTL;

    cacheEntries.forEach(([key, value]) => {
      if (value.timestamp < staleCutoff) {
        this.queryCache.delete(key);
      }
    });
  }

  /**
   * Cleanup resources
   */
  async dispose() {
    // Close prepared statements
    for (const prepared of this.preparedStatements.values()) {
      if (prepared && typeof prepared.close === 'function') {
        try {
          await prepared.close();
        } catch (e) {
          console.warn('Error closing prepared statement:', e);
        }
      }
    }

    // Close connection pool
    if (this.connectionPool && typeof this.connectionPool.end === 'function') {
      try {
        await this.connectionPool.end();
      } catch (e) {
        console.warn('Error closing connection pool:', e);
      }
    }

    this.queryMetrics.clear();
    this.queryCache.clear();
    this.preparedStatements.clear();
  }
}

export default DatabaseOptimizer;
