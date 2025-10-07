/**
 * AGENT 6: Performance & Optimization Engineer
 * TrustBoost Phase 4 - Performance Monitoring Infrastructure
 * 
 * Core Web Vitals monitoring avec patterns Context7
 * - Next.js useReportWebVitals integration
 * - Real-time metrics collection
 * - Vercel Analytics compatibility
 * - Lighthouse CI automation
 */

import { performance } from 'perf_hooks';

/**
 * Performance metrics collector with Context7 patterns
 * Based on /vercel/next.js and /websites/vercel patterns
 */
export class PerformanceMonitor {
  constructor(options = {}) {
    this.options = {
      enableRealTimeTracking: true,
      metricsThreshold: {
        FCP: 2000, // First Contentful Paint < 2s
        LCP: 2500, // Largest Contentful Paint < 2.5s
        FID: 100,  // First Input Delay < 100ms
        CLS: 0.1,  // Cumulative Layout Shift < 0.1
        TTFB: 600  // Time to First Byte < 600ms
      },
      reportingEndpoint: options.endpoint || '/api/performance-metrics',
      ...options
    };
    
    this.metrics = new Map();
    this.observers = new Map();
    this.startTime = performance.now();
    this.setupPerformanceObservers();
  }

  /**
   * Setup Core Web Vitals observers using Context7 Next.js patterns
   */
  setupPerformanceObservers() {
    if (typeof window === 'undefined') return; // Server-side safety

    // Core Web Vitals observer inspired by Next.js useReportWebVitals
    const webVitalsCallback = (metric) => {
      this.handleWebVital(metric);
    };

    // LCP Observer
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      const metric = {
        name: 'LCP',
        value: lastEntry.renderTime || lastEntry.loadTime,
        delta: lastEntry.renderTime || lastEntry.loadTime,
        id: this.generateMetricId(),
        entries: [lastEntry]
      };
      
      webVitalsCallback(metric);
    });

    // FCP Observer
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        const metric = {
          name: 'FCP',
          value: fcpEntry.startTime,
          delta: fcpEntry.startTime,
          id: this.generateMetricId(),
          entries: [fcpEntry]
        };
        
        webVitalsCallback(metric);
      }
    });

    // CLS Observer
    let clsValue = 0;
    let clsEntries = [];
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      
      for (const entry of entries) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      }
      
      const metric = {
        name: 'CLS',
        value: clsValue,
        delta: clsValue,
        id: this.generateMetricId(),
        entries: clsEntries
      };
      
      webVitalsCallback(metric);
    });

    // FID Observer (First Input Delay)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const firstInput = entries[0];
      
      if (firstInput) {
        const metric = {
          name: 'FID',
          value: firstInput.processingStart - firstInput.startTime,
          delta: firstInput.processingStart - firstInput.startTime,
          id: this.generateMetricId(),
          entries: [firstInput]
        };
        
        webVitalsCallback(metric);
      }
    });

    // Register observers
    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.set('LCP', lcpObserver);
    } catch (e) {
      console.warn('LCP observer not supported:', e.message);
    }

    try {
      fcpObserver.observe({ type: 'paint', buffered: true });
      this.observers.set('FCP', fcpObserver);
    } catch (e) {
      console.warn('FCP observer not supported:', e.message);
    }

    try {
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.set('CLS', clsObserver);
    } catch (e) {
      console.warn('CLS observer not supported:', e.message);
    }

    try {
      fidObserver.observe({ type: 'first-input', buffered: true });
      this.observers.set('FID', fidObserver);
    } catch (e) {
      console.warn('FID observer not supported:', e.message);
    }

    // TTFB calculation
    this.measureTTFB();
  }

  /**
   * Handle Web Vital metrics according to Context7 patterns
   */
  handleWebVital(metric) {
    const { name, value, id } = metric;
    
    // Store metric
    this.metrics.set(name, {
      ...metric,
      timestamp: Date.now(),
      rating: this.getRating(name, value)
    });

    // Log for development (Next.js pattern)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Web Vital [${name}]:`, {
        value: Math.round(value),
        rating: this.getRating(name, value),
        threshold: this.options.metricsThreshold[name]
      });
    }

    // Real-time reporting (Vercel Analytics pattern)
    if (this.options.enableRealTimeTracking) {
      this.reportMetric(metric);
    }

    // Performance alerting
    this.checkPerformanceThresholds(metric);
  }

  /**
   * Get performance rating based on thresholds
   */
  getRating(metricName, value) {
    const threshold = this.options.metricsThreshold[metricName];
    
    if (!threshold) return 'unknown';
    
    // Ratings based on Core Web Vitals standards
    const ratings = {
      FCP: { good: 1800, needsImprovement: 3000 },
      LCP: { good: 2500, needsImprovement: 4000 },
      FID: { good: 100, needsImprovement: 300 },
      CLS: { good: 0.1, needsImprovement: 0.25 },
      TTFB: { good: 800, needsImprovement: 1800 }
    };

    const rating = ratings[metricName];
    if (!rating) return 'unknown';

    if (value <= rating.good) return 'good';
    if (value <= rating.needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Measure Time to First Byte
   */
  measureTTFB() {
    if (typeof window === 'undefined') return;

    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      
      const metric = {
        name: 'TTFB',
        value: ttfb,
        delta: ttfb,
        id: this.generateMetricId(),
        entries: [navigationEntry]
      };
      
      this.handleWebVital(metric);
    }
  }

  /**
   * Report metric to analytics endpoint (Vercel pattern)
   */
  async reportMetric(metric) {
    const payload = {
      name: metric.name,
      value: Math.round(metric.value),
      rating: this.getRating(metric.name, metric.value),
      id: metric.id,
      url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      connectionType: this.getConnectionType()
    };

    try {
      // Use navigator.sendBeacon if available (Vercel pattern)
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon(this.options.reportingEndpoint, JSON.stringify(payload));
      } else if (typeof fetch !== 'undefined') {
        await fetch(this.options.reportingEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        });
      }
    } catch (error) {
      console.warn('Failed to report metric:', error);
    }
  }

  /**
   * Check performance thresholds and trigger alerts
   */
  checkPerformanceThresholds(metric) {
    const rating = this.getRating(metric.name, metric.value);
    
    if (rating === 'poor') {
      console.warn(`Performance Alert: ${metric.name} is ${rating}`, {
        value: Math.round(metric.value),
        threshold: this.options.metricsThreshold[metric.name],
        improvement: 'Consider optimizing for better Core Web Vitals'
      });

      // Trigger custom performance alert handler
      if (this.options.onPerformanceAlert) {
        this.options.onPerformanceAlert(metric);
      }
    }
  }

  /**
   * Get connection type for context
   */
  getConnectionType() {
    if (typeof navigator !== 'undefined' && navigator.connection) {
      return navigator.connection.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  /**
   * Generate unique metric ID
   */
  generateMetricId() {
    return `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all collected metrics
   */
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const metrics = this.getMetrics();
    const summary = {
      timestamp: Date.now(),
      sessionDuration: performance.now() - this.startTime,
      coreWebVitals: {},
      overallRating: 'good'
    };

    let poorCount = 0;
    let needsImprovementCount = 0;

    Object.entries(metrics).forEach(([name, metric]) => {
      summary.coreWebVitals[name] = {
        value: Math.round(metric.value),
        rating: metric.rating,
        timestamp: metric.timestamp
      };

      if (metric.rating === 'poor') poorCount++;
      else if (metric.rating === 'needs-improvement') needsImprovementCount++;
    });

    // Calculate overall rating
    if (poorCount > 0) {
      summary.overallRating = 'poor';
    } else if (needsImprovementCount > 0) {
      summary.overallRating = 'needs-improvement';
    }

    return summary;
  }

  /**
   * Cleanup observers
   */
  disconnect() {
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (e) {
        console.warn('Error disconnecting observer:', e);
      }
    });
    this.observers.clear();
  }
}

/**
 * Next.js compatible Web Vitals hook (Context7 pattern)
 */
export function useReportWebVitals(callback) {
  if (typeof window === 'undefined') return;

  const monitor = new PerformanceMonitor({
    enableRealTimeTracking: false // Let callback handle reporting
  });

  // Override the default handler with custom callback
  monitor.handleWebVital = callback;

  return monitor;
}

/**
 * Bundle size analyzer for optimization targets
 */
export class BundleAnalyzer {
  constructor() {
    this.bundleMetrics = new Map();
  }

  /**
   * Analyze current bundle size and report
   */
  async analyzeBundleSize() {
    if (typeof window === 'undefined') return null;

    const performanceEntries = performance.getEntriesByType('resource');
    let totalSize = 0;
    const resourceMap = new Map();

    performanceEntries.forEach(entry => {
      if (entry.transferSize) {
        totalSize += entry.transferSize;
        
        const resourceType = this.getResourceType(entry.name);
        if (!resourceMap.has(resourceType)) {
          resourceMap.set(resourceType, { count: 0, size: 0 });
        }
        
        const current = resourceMap.get(resourceType);
        resourceMap.set(resourceType, {
          count: current.count + 1,
          size: current.size + entry.transferSize
        });
      }
    });

    const analysis = {
      totalSize: Math.round(totalSize / 1024), // KB
      resources: Object.fromEntries(resourceMap),
      timestamp: Date.now(),
      isOptimized: totalSize < (20 * 1024) // < 20KB target for widget
    };

    this.bundleMetrics.set('current', analysis);
    return analysis;
  }

  /**
   * Get resource type from URL
   */
  getResourceType(url) {
    if (url.includes('.js')) return 'javascript';
    if (url.includes('.css')) return 'css';
    if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return 'images';
    if (url.includes('.woff')) return 'fonts';
    return 'other';
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations() {
    const current = this.bundleMetrics.get('current');
    if (!current) return [];

    const recommendations = [];

    // Bundle size recommendations
    if (current.totalSize > 20) {
      recommendations.push({
        type: 'bundle-size',
        priority: 'high',
        message: `Bundle size ${current.totalSize}KB exceeds 20KB target`,
        action: 'Consider code splitting and tree shaking'
      });
    }

    // JavaScript optimization
    const jsSize = current.resources.javascript?.size || 0;
    if (jsSize > 15 * 1024) { // 15KB
      recommendations.push({
        type: 'javascript',
        priority: 'medium',
        message: `JavaScript bundle ${Math.round(jsSize/1024)}KB is large`,
        action: 'Implement dynamic imports and remove unused code'
      });
    }

    // Image optimization
    const imgSize = current.resources.images?.size || 0;
    if (imgSize > 5 * 1024) { // 5KB
      recommendations.push({
        type: 'images',
        priority: 'medium',
        message: `Images ${Math.round(imgSize/1024)}KB should be optimized`,
        action: 'Use WebP format and proper sizing'
      });
    }

    return recommendations;
  }
}

export default PerformanceMonitor;