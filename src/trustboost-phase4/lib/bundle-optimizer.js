/**
 * AGENT 6: Performance & Optimization Engineer
 * TrustBoost Phase 4 - Bundle Size Optimizer
 * 
 * Optimisation bundle size pour target <20KB (gzipped) 
 * - Bundle analysis et tree shaking
 * - Code splitting automatique
 * - Import optimization
 * - Compression strategies
 */

import fs from 'fs/promises';
import path from 'path';
import zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const brotli = promisify(zlib.brotliCompress);

/**
 * Bundle Size Optimizer
 */
export class BundleOptimizer {
  constructor(options = {}) {
    this.options = {
      // Size targets
      maxBundleSize: 20 * 1024, // 20KB target (gzipped)
      maxUncompressed: 60 * 1024, // 60KB uncompressed
      
      // Analysis options
      analyzeImports: true,
      detectUnusedCode: true,
      trackDependencies: true,
      
      // Optimization strategies
      enableTreeShaking: true,
      enableCodeSplitting: true,
      enableCompression: true,
      
      // File patterns
      sourceFiles: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
      excludePatterns: ['node_modules/**', '**/*.test.*', '**/*.spec.*'],
      
      ...options
    };

    this.bundleAnalysis = new Map();
    this.dependencies = new Map();
    this.optimizations = [];
  }

  /**
   * Analyze current bundle size and structure
   */
  async analyzeBundleSize(bundlePath) {
    try {
      const bundleContent = await fs.readFile(bundlePath, 'utf8');
      const stats = await fs.stat(bundlePath);
      
      // Compression analysis
      const gzipped = await gzip(bundleContent);
      const brotlied = await brotli(bundleContent);
      
      const analysis = {
        file: bundlePath,
        sizes: {
          uncompressed: stats.size,
          gzipped: gzipped.length,
          brotli: brotlied.length
        },
        timestamp: Date.now(),
        isOptimized: gzipped.length <= this.options.maxBundleSize,
        compressionRatio: {
          gzip: stats.size / gzipped.length,
          brotli: stats.size / brotlied.length
        }
      };

      // Detailed analysis
      if (this.options.analyzeImports) {
        analysis.imports = await this.analyzeImports(bundleContent);
      }

      if (this.options.detectUnusedCode) {
        analysis.unusedCode = await this.detectUnusedCode(bundleContent);
      }

      if (this.options.trackDependencies) {
        analysis.dependencies = await this.analyzeDependencies(bundleContent);
      }

      this.bundleAnalysis.set(bundlePath, analysis);
      return analysis;

    } catch (error) {
      console.error(`Error analyzing bundle ${bundlePath}:`, error);
      throw error;
    }
  }

  /**
   * Analyze imports in the bundle
   */
  async analyzeImports(content) {
    const imports = {
      es6: [],
      commonjs: [],
      dynamic: [],
      external: [],
      unused: []
    };

    // ES6 imports
    const es6ImportRegex = /import\s+(?:(?:\*\s+as\s+\w+)|(?:\w+)|(?:\{[^}]+\}))\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = es6ImportRegex.exec(content)) !== null) {
      imports.es6.push({
        module: match[1],
        statement: match[0],
        isExternal: !match[1].startsWith('./')
      });
    }

    // CommonJS requires
    const commonjsRegex = /require\(['"]([^'"]+)['"]\)/g;
    while ((match = commonjsRegex.exec(content)) !== null) {
      imports.commonjs.push({
        module: match[1],
        statement: match[0],
        isExternal: !match[1].startsWith('./')
      });
    }

    // Dynamic imports
    const dynamicImportRegex = /import\(['"]([^'"]+)['"]\)/g;
    while ((match = dynamicImportRegex.exec(content)) !== null) {
      imports.dynamic.push({
        module: match[1],
        statement: match[0],
        isExternal: !match[1].startsWith('./')
      });
    }

    return imports;
  }

  /**
   * Detect potentially unused code
   */
  async detectUnusedCode(content) {
    const unused = {
      functions: [],
      variables: [],
      imports: [],
      exports: []
    };

    // Find function declarations
    const functionRegex = /(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:\([^)]*\)|[^=]+)\s*=>)/g;
    let match;
    const declaredFunctions = new Set();
    
    while ((match = functionRegex.exec(content)) !== null) {
      const funcName = match[1] || match[2];
      if (funcName) {
        declaredFunctions.add(funcName);
      }
    }

    // Find variable declarations
    const variableRegex = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    const declaredVariables = new Set();
    
    while ((match = variableRegex.exec(content)) !== null) {
      declaredVariables.add(match[1]);
    }

    // Check usage
    for (const funcName of declaredFunctions) {
      const usageRegex = new RegExp(`\\b${funcName}\\s*\\(`, 'g');
      const usageMatches = content.match(usageRegex) || [];
      
      if (usageMatches.length <= 1) { // Only declaration
        unused.functions.push(funcName);
      }
    }

    for (const varName of declaredVariables) {
      const usageRegex = new RegExp(`\\b${varName}\\b`, 'g');
      const usageMatches = content.match(usageRegex) || [];
      
      if (usageMatches.length <= 1) { // Only declaration
        unused.variables.push(varName);
      }
    }

    return unused;
  }

  /**
   * Analyze bundle dependencies
   */
  async analyzeDependencies(content) {
    const dependencies = {
      external: new Map(),
      sizes: new Map(),
      duplicates: []
    };

    // Extract external dependencies
    const importRegex = /(?:import\s+[^'"]from\s+['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\))/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const moduleName = match[1] || match[2];
      
      if (!moduleName.startsWith('./') && !moduleName.startsWith('../')) {
        const baseModule = moduleName.split('/')[0];
        const current = dependencies.external.get(baseModule) || 0;
        dependencies.external.set(baseModule, current + 1);
      }
    }

    // Estimate sizes (simplified)
    for (const [module, count] of dependencies.external) {
      const estimatedSize = this.estimateModuleSize(module);
      dependencies.sizes.set(module, {
        estimatedSize,
        usageCount: count,
        impactPerKB: estimatedSize / 1024
      });
    }

    return dependencies;
  }

  /**
   * Generate bundle optimization recommendations
   */
  generateOptimizationRecommendations(analysis) {
    const recommendations = [];

    // Size-based recommendations
    if (analysis.sizes.gzipped > this.options.maxBundleSize) {
      const excess = analysis.sizes.gzipped - this.options.maxBundleSize;
      recommendations.push({
        type: 'size',
        priority: 'critical',
        title: `Bundle exceeds target by ${Math.round(excess/1024)}KB`,
        description: `Current: ${Math.round(analysis.sizes.gzipped/1024)}KB, Target: ${Math.round(this.options.maxBundleSize/1024)}KB`,
        actions: [
          'Enable code splitting',
          'Remove unused dependencies',
          'Optimize imports',
          'Use dynamic imports for non-critical code'
        ]
      });
    }

    // Import optimization recommendations
    if (analysis.imports) {
      const externalImports = analysis.imports.es6.filter(imp => imp.isExternal);
      if (externalImports.length > 5) {
        recommendations.push({
          type: 'imports',
          priority: 'high',
          title: 'Too many external dependencies',
          description: `${externalImports.length} external imports detected`,
          actions: [
            'Audit and remove unnecessary dependencies',
            'Use tree-shaking compatible imports',
            'Consider lighter alternatives'
          ]
        });
      }
    }

    // Unused code recommendations
    if (analysis.unusedCode) {
      const totalUnused = analysis.unusedCode.functions.length + analysis.unusedCode.variables.length;
      if (totalUnused > 0) {
        recommendations.push({
          type: 'dead-code',
          priority: 'medium',
          title: 'Dead code elimination opportunity',
          description: `${totalUnused} potentially unused declarations found`,
          actions: [
            'Remove unused functions and variables',
            'Enable tree shaking in build process',
            'Use ESLint no-unused-vars rule'
          ]
        });
      }
    }

    // Compression recommendations
    if (analysis.compressionRatio.gzip < 3) {
      recommendations.push({
        type: 'compression',
        priority: 'medium',
        title: 'Poor compression ratio',
        description: `Gzip ratio: ${analysis.compressionRatio.gzip.toFixed(2)}x (target: >3x)`,
        actions: [
          'Minify code more aggressively',
          'Enable brotli compression',
          'Remove comments and whitespace',
          'Use shorter variable names'
        ]
      });
    }

    return recommendations;
  }

  /**
   * Apply automatic optimizations
   */
  async optimizeBundle(bundlePath, outputPath) {
    console.log(`Optimizing bundle: ${bundlePath}`);
    
    const analysis = await this.analyzeBundleSize(bundlePath);
    const recommendations = this.generateOptimizationRecommendations(analysis);
    
    let content = await fs.readFile(bundlePath, 'utf8');
    const optimizations = [];

    // Apply optimizations based on recommendations
    for (const rec of recommendations) {
      switch (rec.type) {
        case 'dead-code':
          content = await this.removeDeadCode(content);
          optimizations.push('Dead code removal');
          break;
          
        case 'imports':
          content = await this.optimizeImports(content);
          optimizations.push('Import optimization');
          break;
          
        case 'compression':
          content = await this.optimizeForCompression(content);
          optimizations.push('Compression optimization');
          break;
      }
    }

    // Write optimized bundle
    await fs.writeFile(outputPath, content, 'utf8');
    
    // Analyze optimized bundle
    const optimizedAnalysis = await this.analyzeBundleSize(outputPath);
    
    return {
      original: analysis,
      optimized: optimizedAnalysis,
      savings: {
        uncompressed: analysis.sizes.uncompressed - optimizedAnalysis.sizes.uncompressed,
        gzipped: analysis.sizes.gzipped - optimizedAnalysis.sizes.gzipped
      },
      optimizations
    };
  }

  /**
   * Remove dead code
   */
  async removeDeadCode(content) {
    const analysis = await this.detectUnusedCode(content);
    let optimizedContent = content;

    // Remove unused functions
    for (const funcName of analysis.functions) {
      const funcRegex = new RegExp(`(?:function\\s+${funcName}\\s*\\([^)]*\\)\\s*\\{[^{}]*\\}|const\\s+${funcName}\\s*=\\s*[^;]+;)`, 'g');
      optimizedContent = optimizedContent.replace(funcRegex, '');
    }

    // Remove unused variables (simple cases)
    for (const varName of analysis.variables) {
      const varRegex = new RegExp(`(?:const|let|var)\\s+${varName}\\s*=\\s*[^;]+;?`, 'g');
      optimizedContent = optimizedContent.replace(varRegex, '');
    }

    return optimizedContent.replace(/\n\s*\n/g, '\n'); // Clean up empty lines
  }

  /**
   * Optimize imports
   */
  async optimizeImports(content) {
    let optimized = content;

    // Convert namespace imports to specific imports where possible
    const namespaceRegex = /import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = namespaceRegex.exec(content)) !== null) {
      const namespace = match[1];
      const module = match[2];
      
      // Find usage of namespace
      const usageRegex = new RegExp(`${namespace}\\.(\\w+)`, 'g');
      const usages = new Set();
      let usageMatch;
      
      while ((usageMatch = usageRegex.exec(content)) !== null) {
        usages.add(usageMatch[1]);
      }
      
      if (usages.size > 0 && usages.size <= 5) {
        // Convert to specific imports
        const specificImport = `import { ${Array.from(usages).join(', ')} } from '${module}'`;
        optimized = optimized.replace(match[0], specificImport);
        
        // Replace usage
        for (const usage of usages) {
          const usagePattern = new RegExp(`${namespace}\\.${usage}`, 'g');
          optimized = optimized.replace(usagePattern, usage);
        }
      }
    }

    return optimized;
  }

  /**
   * Optimize for compression
   */
  async optimizeForCompression(content) {
    let optimized = content;

    // Remove extra whitespace
    optimized = optimized.replace(/\s+/g, ' ');
    
    // Remove comments
    optimized = optimized.replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '');
    optimized = optimized.replace(/\/\/.*$/gm, '');
    
    // Optimize common patterns
    optimized = optimized.replace(/;\s*}/g, '}');
    optimized = optimized.replace(/{\s*/g, '{');
    optimized = optimized.replace(/\s*}/g, '}');
    
    return optimized;
  }

  /**
   * Generate bundle size report
   */
  generateSizeReport(analyses) {
    const report = {
      timestamp: Date.now(),
      bundles: [],
      summary: {
        totalSize: 0,
        totalGzipped: 0,
        averageCompressionRatio: 0,
        bundlesOptimized: 0,
        bundlesOverLimit: 0
      },
      recommendations: []
    };

    for (const [path, analysis] of analyses) {
      report.bundles.push({
        path,
        sizes: analysis.sizes,
        isOptimized: analysis.isOptimized,
        compressionRatio: analysis.compressionRatio.gzip,
        recommendations: this.generateOptimizationRecommendations(analysis)
      });

      report.summary.totalSize += analysis.sizes.uncompressed;
      report.summary.totalGzipped += analysis.sizes.gzipped;
      
      if (analysis.isOptimized) {
        report.summary.bundlesOptimized++;
      } else {
        report.summary.bundlesOverLimit++;
      }
    }

    if (report.bundles.length > 0) {
      report.summary.averageCompressionRatio = 
        report.bundles.reduce((sum, b) => sum + b.compressionRatio, 0) / report.bundles.length;
    }

    // Global recommendations
    if (report.summary.bundlesOverLimit > 0) {
      report.recommendations.push({
        type: 'global',
        priority: 'critical',
        title: `${report.summary.bundlesOverLimit} bundles exceed size limit`,
        actions: [
          'Implement code splitting strategy',
          'Audit dependencies for lighter alternatives',
          'Enable aggressive minification',
          'Consider lazy loading non-critical features'
        ]
      });
    }

    return report;
  }

  /**
   * Monitor bundle size changes
   */
  monitorSizeChanges(previousAnalysis, currentAnalysis) {
    const changes = {
      timestamp: Date.now(),
      sizeChange: {
        uncompressed: currentAnalysis.sizes.uncompressed - previousAnalysis.sizes.uncompressed,
        gzipped: currentAnalysis.sizes.gzipped - previousAnalysis.sizes.gzipped
      },
      compressionChange: currentAnalysis.compressionRatio.gzip - previousAnalysis.compressionRatio.gzip,
      alerts: []
    };

    // Size increase alerts
    if (changes.sizeChange.gzipped > 1024) { // >1KB increase
      changes.alerts.push({
        type: 'size-increase',
        severity: 'warning',
        message: `Bundle size increased by ${Math.round(changes.sizeChange.gzipped/1024)}KB`,
        threshold: '1KB'
      });
    }

    // Critical size alerts
    if (currentAnalysis.sizes.gzipped > this.options.maxBundleSize) {
      changes.alerts.push({
        type: 'size-limit-exceeded',
        severity: 'critical',
        message: `Bundle exceeds ${Math.round(this.options.maxBundleSize/1024)}KB limit`,
        current: Math.round(currentAnalysis.sizes.gzipped/1024),
        limit: Math.round(this.options.maxBundleSize/1024)
      });
    }

    return changes;
  }

  /**
   * Estimate module size (simplified)
   */
  estimateModuleSize(moduleName) {
    // Rough estimates for common modules
    const sizeEstimates = {
      'react': 45000,
      'react-dom': 130000,
      'lodash': 70000,
      'moment': 230000,
      'axios': 15000,
      'uuid': 8000,
      'classnames': 2000
    };

    return sizeEstimates[moduleName] || 10000; // Default estimate
  }

  /**
   * Get bundle metrics summary
   */
  getBundleMetrics() {
    const analyses = Array.from(this.bundleAnalysis.values());
    
    if (analyses.length === 0) {
      return { status: 'no-data' };
    }

    const totalSize = analyses.reduce((sum, a) => sum + a.sizes.gzipped, 0);
    const avgCompressionRatio = analyses.reduce((sum, a) => sum + a.compressionRatio.gzip, 0) / analyses.length;
    const optimizedBundles = analyses.filter(a => a.isOptimized).length;

    return {
      totalBundles: analyses.length,
      totalSize: Math.round(totalSize / 1024), // KB
      averageSize: Math.round(totalSize / analyses.length / 1024), // KB
      averageCompressionRatio: Math.round(avgCompressionRatio * 100) / 100,
      optimizedPercentage: Math.round((optimizedBundles / analyses.length) * 100),
      targetCompliance: optimizedBundles === analyses.length
    };
  }
}

/**
 * TrustBoost Widget Bundle Optimizer
 */
export class WidgetBundleOptimizer extends BundleOptimizer {
  constructor(options = {}) {
    super({
      maxBundleSize: 15 * 1024, // Stricter 15KB limit for widget
      maxUncompressed: 45 * 1024, // 45KB uncompressed
      enableTreeShaking: true,
      enableCodeSplitting: false, // Widget should be single bundle
      ...options
    });
  }

  /**
   * Widget-specific optimization
   */
  async optimizeWidget(sourceFiles, outputFile) {
    console.log('Optimizing TrustBoost widget bundle...');

    // Analyze all source files
    const analyses = [];
    for (const file of sourceFiles) {
      try {
        const analysis = await this.analyzeBundleSize(file);
        analyses.push(analysis);
      } catch (error) {
        console.warn(`Could not analyze ${file}:`, error.message);
      }
    }

    // Generate widget-specific recommendations
    const recommendations = this.generateWidgetRecommendations(analyses);
    
    console.log('Widget optimization recommendations:', recommendations);

    return {
      analyses,
      recommendations,
      metrics: this.getBundleMetrics()
    };
  }

  /**
   * Generate widget-specific recommendations
   */
  generateWidgetRecommendations(analyses) {
    const recommendations = [];
    
    const totalSize = analyses.reduce((sum, a) => sum + a.sizes.gzipped, 0);
    
    if (totalSize > this.options.maxBundleSize) {
      recommendations.push({
        type: 'widget-size',
        priority: 'critical',
        title: 'Widget exceeds 15KB limit for optimal loading',
        current: Math.round(totalSize / 1024),
        target: Math.round(this.options.maxBundleSize / 1024),
        actions: [
          'Remove non-essential features',
          'Use CSS-in-JS with smaller footprint',
          'Optimize SVG icons and graphics',
          'Consider server-side rendering for initial state'
        ]
      });
    }

    return recommendations;
  }
}

export default BundleOptimizer;