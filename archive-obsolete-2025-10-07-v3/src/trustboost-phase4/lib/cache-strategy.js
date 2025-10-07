/**
 * AGENT 6: Performance & Optimization Engineer  
 * TrustBoost Phase 4 - Advanced Cache Strategy
 * 
 * Implementation basée sur patterns Context7 /vercel/next.js
 * - SWR (Stale While Revalidate)
 * - ISR (Incremental Static Regeneration) 
 * - CDN Edge Caching
 * - Service Worker caching
 */

import { LRUCache } from 'lru-cache';

/**
 * Advanced cache manager with multiple strategies
 */
export class CacheStrategy {
  constructor(options = {}) {
    this.options = {
      // SWR configuration
      swrMaxAge: 60, // 1 minute fresh
      swrStaleWhileRevalidate: 300, // 5 minutes stale
      
      // Memory cache limits
      maxMemoryCacheSize: 100,
      maxMemoryCacheAge: 600000, // 10 minutes
      
      // CDN configuration  
      cdnCacheControl: 's-maxage=3600, stale-while-revalidate=86400',
      
      // Performance targets
      cacheHitRatio: 0.9, // 90% hit ratio target
      responseTimeTarget: 100, // <100ms p95
      
      ...options
    };

    // Initialize LRU cache for memory caching
    this.memoryCache = new LRUCache({
      max: this.options.maxMemoryCacheSize,
      maxAge: this.options.maxMemoryCacheAge,
      updateAgeOnGet: true,
      updateAgeOnHas: true
    });

    // Cache metrics for monitoring
    this.metrics = {
      hits: 0,
      misses: 0,
      errors: 0,
      avgResponseTime: 0,
      revalidations: 0
    };

    this.setupServiceWorker();
  }

  /**
   * SWR implementation (Stale While Revalidate)
   * Pattern from Context7 /vercel/next.js
   */
  async swr(key, fetcher, options = {}) {
    const startTime = performance.now();
    const swrOptions = { ...this.options, ...options };
    
    try {
      // Check memory cache first
      const cached = this.memoryCache.get(key);
      const now = Date.now();
      
      if (cached) {
        const age = (now - cached.timestamp) / 1000;
        
        // If fresh, return immediately
        if (age < swrOptions.swrMaxAge) {
          this.updateMetrics('hit', performance.now() - startTime);
          return cached.data;
        }
        
        // If stale but within revalidate window, return stale and revalidate in background
        if (age < (swrOptions.swrMaxAge + swrOptions.swrStaleWhileRevalidate)) {
          this.updateMetrics('hit', performance.now() - startTime);
          
          // Background revalidation
          this.revalidateInBackground(key, fetcher, swrOptions);
          
          return cached.data;
        }
      }
      
      // Cache miss or expired - fetch fresh data
      this.updateMetrics('miss', performance.now() - startTime);
      return await this.fetchAndCache(key, fetcher, swrOptions);
      
    } catch (error) {
      this.updateMetrics('error', performance.now() - startTime);
      
      // Return stale data on error if available
      const cached = this.memoryCache.get(key);
      if (cached) {
        console.warn(`SWR error for ${key}, returning stale data:`, error);
        return cached.data;
      }
      
      throw error;
    }
  }

  /**
   * Background revalidation for SWR
   */
  async revalidateInBackground(key, fetcher, options) {
    try {
      this.metrics.revalidations++;
      const freshData = await fetcher();
      
      // Update cache with fresh data
      this.memoryCache.set(key, {
        data: freshData,
        timestamp: Date.now(),
        etag: this.generateETag(freshData)
      });
      
      // Notify listeners of update (optional)
      this.notifyUpdate(key, freshData);
      
    } catch (error) {
      console.warn(`Background revalidation failed for ${key}:`, error);
    }
  }

  /**
   * Fetch and cache with optimizations
   */
  async fetchAndCache(key, fetcher, options) {
    const freshData = await fetcher();
    
    // Cache the fresh data
    this.memoryCache.set(key, {
      data: freshData,
      timestamp: Date.now(),
      etag: this.generateETag(freshData)
    });
    
    return freshData;
  }

  /**
   * ISR implementation (Incremental Static Regeneration)
   * Based on Next.js patterns from Context7
   */
  async isr(key, generator, revalidateTime = 3600) {
    const cached = this.memoryCache.get(key);
    const now = Date.now();
    
    // If we have cached data and it's fresh
    if (cached && (now - cached.timestamp) < (revalidateTime * 1000)) {
      return {
        data: cached.data,
        revalidate: false,
        source: 'cache'
      };
    }
    
    // If we have cached data but it's stale, return it and regenerate in background
    if (cached) {
      // Start background regeneration
      this.regenerateInBackground(key, generator, revalidateTime);
      
      return {
        data: cached.data,
        revalidate: true,
        source: 'stale'
      };
    }
    
    // No cached data - generate on demand
    const freshData = await generator();
    
    this.memoryCache.set(key, {
      data: freshData,
      timestamp: now,
      etag: this.generateETag(freshData)
    });
    
    return {
      data: freshData,
      revalidate: false,
      source: 'fresh'
    };
  }

  /**
   * Background regeneration for ISR
   */
  async regenerateInBackground(key, generator, revalidateTime) {
    try {
      const freshData = await generator();
      
      this.memoryCache.set(key, {
        data: freshData,
        timestamp: Date.now(),
        etag: this.generateETag(freshData)
      });
      
      console.log(`ISR: Regenerated ${key} in background`);
      
    } catch (error) {
      console.error(`ISR regeneration failed for ${key}:`, error);
    }
  }

  /**
   * CDN Cache Headers generator (Vercel pattern)
   */
  getCacheHeaders(type = 'default') {
    const headers = {};
    
    switch (type) {
      case 'static':
        // Long term caching for static assets
        headers['Cache-Control'] = 'public, max-age=31536000, immutable';
        break;
        
      case 'api':
        // Short term caching with SWR for API responses
        headers['Cache-Control'] = `s-maxage=${this.options.swrMaxAge}, stale-while-revalidate=${this.options.swrStaleWhileRevalidate}`;
        break;
        
      case 'page':
        // Medium term caching for pages with ISR
        headers['Cache-Control'] = 's-maxage=3600, stale-while-revalidate=86400';
        break;
        
      case 'widget':
        // Optimized for TrustBoost widget
        headers['Cache-Control'] = 's-maxage=300, stale-while-revalidate=900';
        headers['Vary'] = 'Accept-Encoding';
        break;
        
      default:
        headers['Cache-Control'] = this.options.cdnCacheControl;
    }
    
    return headers;
  }

  /**
   * Service Worker setup for client-side caching
   */
  setupServiceWorker() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Register service worker for advanced caching
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('Service Worker registered for advanced caching');
      
      // Send cache strategy configuration to service worker
      if (registration.active) {
        registration.active.postMessage({
          type: 'CACHE_CONFIG',
          config: this.options
        });
      }
    }).catch(error => {
      console.warn('Service Worker registration failed:', error);
    });
  }

  /**
   * Cache warming for critical resources
   */
  async warmCache(resources = []) {
    const warmingPromises = resources.map(async (resource) => {
      try {
        if (resource.type === 'api') {
          await this.swr(resource.key, resource.fetcher, resource.options);
        } else if (resource.type === 'page') {
          await this.isr(resource.key, resource.generator, resource.revalidate);
        }
        
        console.log(`Cache warmed for: ${resource.key}`);
      } catch (error) {
        console.warn(`Cache warming failed for ${resource.key}:`, error);
      }
    });

    await Promise.allSettled(warmingPromises);
    console.log(`Cache warming completed for ${resources.length} resources`);
  }

  /**
   * Cache invalidation strategies
   */
  async invalidate(pattern = null) {
    if (pattern) {
      // Invalidate keys matching pattern
      const keysToDelete = [];
      
      for (const key of this.memoryCache.keys()) {
        if (typeof pattern === 'string' && key.includes(pattern)) {
          keysToDelete.push(key);
        } else if (pattern instanceof RegExp && pattern.test(key)) {
          keysToDelete.push(key);
        }
      }
      
      keysToDelete.forEach(key => {
        this.memoryCache.delete(key);
      });
      
      console.log(`Invalidated ${keysToDelete.length} cache entries matching pattern: ${pattern}`);
    } else {
      // Clear all cache
      this.memoryCache.clear();
      console.log('All cache cleared');
    }
  }

  /**
   * Performance-oriented cache key generation
   */
  generateCacheKey(base, params = {}) {
    const normalized = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
      
    return normalized ? `${base}::${normalized}` : base;
  }

  /**
   * ETag generation for cache validation
   */
  generateETag(data) {
    const hash = this.simpleHash(JSON.stringify(data));
    return `"${hash}"`;
  }

  /**
   * Simple hash function for ETags
   */
  simpleHash(str) {
    let hash = 0;
    if (str.length === 0) return hash.toString(36);
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Update performance metrics
   */
  updateMetrics(type, responseTime) {
    this.metrics[type === 'hit' ? 'hits' : type === 'miss' ? 'misses' : 'errors']++;
    
    // Update average response time
    const totalRequests = this.metrics.hits + this.metrics.misses + this.metrics.errors;
    this.metrics.avgResponseTime = 
      (this.metrics.avgResponseTime * (totalRequests - 1) + responseTime) / totalRequests;
  }

  /**
   * Get cache performance metrics
   */
  getMetrics() {
    const totalRequests = this.metrics.hits + this.metrics.misses + this.metrics.errors;
    
    return {
      ...this.metrics,
      hitRatio: totalRequests > 0 ? this.metrics.hits / totalRequests : 0,
      cacheSize: this.memoryCache.size,
      targetHitRatio: this.options.cacheHitRatio,
      isPerformant: (this.metrics.hits / totalRequests) >= this.options.cacheHitRatio &&
                    this.metrics.avgResponseTime <= this.options.responseTimeTarget
    };
  }

  /**
   * Notify update listeners (for reactive updates)
   */
  notifyUpdate(key, data) {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('cache-update', {
        detail: { key, data }
      }));
    }
  }

  /**
   * Cleanup and dispose resources
   */
  dispose() {
    this.memoryCache.clear();
  }
}

/**
 * TrustBoost Widget optimized cache wrapper
 */
export class WidgetCache extends CacheStrategy {
  constructor(options = {}) {
    super({
      swrMaxAge: 300, // 5 minutes fresh for widget data
      swrStaleWhileRevalidate: 900, // 15 minutes stale
      maxMemoryCacheSize: 50, // Smaller cache for widget
      responseTimeTarget: 50, // <50ms for widget interactions
      ...options
    });
  }

  /**
   * Widget-specific cache warming
   */
  async warmWidgetCache() {
    const criticalResources = [
      {
        key: 'trustscore-config',
        type: 'api',
        fetcher: () => fetch('/api/trustscore/config').then(r => r.json())
      },
      {
        key: 'widget-theme',
        type: 'api', 
        fetcher: () => fetch('/api/widget/theme').then(r => r.json())
      },
      {
        key: 'user-preferences',
        type: 'api',
        fetcher: () => fetch('/api/user/preferences').then(r => r.json())
      }
    ];

    await this.warmCache(criticalResources);
  }
}

export default CacheStrategy;