// Context Service - Smart Review Workflow Phase 1
// Extrait contexte intelligent pour optimiser reviews Gemini
import { logger } from "../utils/logger.js";
import fs from 'fs/promises';
import path from 'path';

/**
 * PHASE 1 CONTEXT PREPARATION SERVICE
 * 
 * Transforme code brut en contexte riche pour reviews Gemini intelligentes.
 * Performance: 7000ms → <2000ms avec context préparé
 */

export class ContextPreparationService {
  
  /**
   * Prépare contexte intelligent pour review Gemini
   * @param {string} filePath - Path vers fichier à reviewer
   * @param {Object} task - Task metadata {title, requirements, architecture}
   * @returns {Object} Rich context payload pour Gemini
   */
  async prepareReviewContext(filePath, task) {
    logger.info(`🧠 Preparing intelligent context for: ${filePath}`);
    
    const startTime = Date.now();
    
    try {
      // 1. Extract code content
      const codeContent = await this.extractCodeContent(filePath);
      
      // 2. Analyze patterns & architecture
      const patterns = await this.analyzeCodePatterns(codeContent, filePath);
      
      // 3. Extract dependencies & imports
      const dependencies = await this.extractDependencies(codeContent, filePath);
      
      // 4. Identify architectural context
      const architecturalContext = await this.identifyArchitecturalContext(filePath, task);
      
      // 5. Generate smart context payload
      const contextPayload = this.buildContextPayload({
        codeContent,
        patterns,
        dependencies,
        architecturalContext,
        task,
        filePath
      });
      
      const duration = Date.now() - startTime;
      logger.info(`✅ Context preparation completed in ${duration}ms`);
      
      return {
        ok: true,
        context: contextPayload,
        duration_ms: duration,
        insights: patterns.insights,
        complexity_score: patterns.complexity
      };
      
    } catch (error) {
      logger.error(`❌ Context preparation failed: ${error.message}`);
      return {
        ok: false,
        error: error.message,
        duration_ms: Date.now() - startTime
      };
    }
  }
  
  /**
   * Extract code content with metadata
   */
  async extractCodeContent(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const extension = path.extname(filePath);
      const lines = content.split('\n').length;
      const size = Buffer.byteLength(content, 'utf8');
      
      return {
        content: content,
        extension,
        lines,
        size,
        language: this.detectLanguage(extension)
      };
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error.message}`);
    }
  }
  
  /**
   * Analyze code patterns, complexity, and architectural insights
   */
  async analyzeCodePatterns(codeContent, filePath) {
    const content = codeContent.content;
    const extension = codeContent.extension;
    
    // Pattern detection by language
    const patterns = {
      functions: this.extractFunctions(content, extension),
      imports: this.extractImports(content, extension),
      exports: this.extractExports(content, extension),
      classes: this.extractClasses(content, extension),
      async_patterns: this.detectAsyncPatterns(content),
      error_handling: this.detectErrorHandling(content),
      security_patterns: this.detectSecurityPatterns(content)
    };
    
    // Complexity analysis
    const complexity = this.calculateComplexity(content, patterns);
    
    // Generate insights
    const insights = this.generateInsights(patterns, complexity, extension);
    
    // Debug log
    logger.info(`🔍 Pattern analysis results:`, {
      functions_count: patterns.functions?.length || 0,
      classes_count: patterns.classes?.length || 0,
      async_count: patterns.async_patterns?.count || 0
    });
    
    return { patterns, complexity, insights };
  }
  
  /**
   * Extract dependencies and imports analysis
   */
  async extractDependencies(codeContent, filePath) {
    const content = codeContent.content;
    const extension = codeContent.extension;
    
    let dependencies = {
      external: [],
      internal: [],
      frameworks: [],
      libraries: []
    };
    
    // JavaScript/TypeScript dependencies
    if (['.js', '.ts', '.jsx', '.tsx'].includes(extension)) {
      const importMatches = content.match(/import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/g) || [];
      const requireMatches = content.match(/require\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g) || [];
      
      [...importMatches, ...requireMatches].forEach(match => {
        const moduleName = match.match(/['"`]([^'"`]+)['"`]/)[1];
        
        if (moduleName.startsWith('./') || moduleName.startsWith('../')) {
          dependencies.internal.push(moduleName);
        } else {
          dependencies.external.push(moduleName);
          
          // Framework/Library detection
          if (moduleName.includes('react')) dependencies.frameworks.push('React');
          if (moduleName.includes('next')) dependencies.frameworks.push('Next.js');
          if (moduleName.includes('supabase')) dependencies.libraries.push('Supabase');
          if (moduleName.includes('stripe')) dependencies.libraries.push('Stripe');
        }
      });
    }
    
    return dependencies;
  }
  
  /**
   * Identify architectural context from file path and task
   */
  async identifyArchitecturalContext(filePath, task) {
    const pathSegments = filePath.split('/');
    
    const context = {
      layer: this.identifyArchitecturalLayer(pathSegments),
      framework: this.detectFramework(pathSegments, task),
      patterns: this.detectArchitecturalPatterns(pathSegments),
      responsibility: this.inferResponsibility(pathSegments, task)
    };
    
    return context;
  }
  
  /**
   * Build rich context payload for Gemini
   */
  buildContextPayload(data) {
    const { codeContent, patterns, dependencies, architecturalContext, task, filePath } = data;
    
    return {
      // Core context
      task_info: {
        title: task.title || task.name || 'Code Review',
        requirements: task.requirements || 'General code review',
        architecture: task.architecture || 'Unknown'
      },
      
      // File metadata
      file_info: {
        path: filePath,
        language: codeContent.language,
        size: codeContent.size,
        lines: codeContent.lines,
        complexity: patterns.complexity
      },
      
      // Architectural context
      architecture: {
        layer: architecturalContext.layer,
        framework: architecturalContext.framework,
        patterns: architecturalContext.patterns,
        responsibility: architecturalContext.responsibility
      },
      
      // Code patterns
      code_patterns: {
        functions: patterns.patterns?.functions?.length || 0,
        classes: patterns.patterns?.classes?.length || 0,
        async_usage: patterns.patterns?.async_patterns?.count || 0,
        error_handling: patterns.patterns?.error_handling?.score || 0,
        security_measures: patterns.patterns?.security_patterns?.score || 0
      },
      
      // Dependencies context
      dependencies: {
        external_count: dependencies.external.length,
        frameworks: dependencies.frameworks,
        libraries: dependencies.libraries,
        key_dependencies: dependencies.external.slice(0, 5)
      },
      
      // Smart insights
      insights: patterns.insights,
      
      // Code content (truncated for context)
      code_preview: codeContent.content.length > 2000 ? 
        codeContent.content.slice(0, 2000) + '\n... (truncated)' : 
        codeContent.content
    };
  }
  
  // Helper methods
  detectLanguage(extension) {
    const languageMap = {
      '.js': 'javascript',
      '.ts': 'typescript', 
      '.jsx': 'javascript-react',
      '.tsx': 'typescript-react',
      '.py': 'python',
      '.go': 'go',
      '.rs': 'rust'
    };
    return languageMap[extension] || 'unknown';
  }
  
  extractFunctions(content, extension) {
    const functions = [];
    
    if (['.js', '.ts', '.jsx', '.tsx'].includes(extension)) {
      // Function declarations
      const funcMatches = content.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s+)?(?:\([^)]*\)\s*)?=>|(\w+)\s*:\s*(?:async\s+)?(?:\([^)]*\)\s*)?=>)/g) || [];
      functions.push(...funcMatches);
    }
    
    return functions;
  }
  
  extractImports(content, extension) {
    if (['.js', '.ts', '.jsx', '.tsx'].includes(extension)) {
      return content.match(/import\s+.*?\s+from\s+['"`][^'"`]+['"`]/g) || [];
    }
    return [];
  }
  
  extractExports(content, extension) {
    if (['.js', '.ts', '.jsx', '.tsx'].includes(extension)) {
      return content.match(/export\s+(?:default\s+)?(?:function|const|class)\s+\w+/g) || [];
    }
    return [];
  }
  
  extractClasses(content, extension) {
    if (['.js', '.ts', '.jsx', '.tsx'].includes(extension)) {
      return content.match(/class\s+\w+(?:\s+extends\s+\w+)?/g) || [];
    }
    return [];
  }
  
  detectAsyncPatterns(content) {
    const asyncCount = (content.match(/async\s+/g) || []).length;
    const awaitCount = (content.match(/await\s+/g) || []).length;
    const promiseCount = (content.match(/\.then\(|\.catch\(|new\s+Promise/g) || []).length;
    
    return {
      count: asyncCount + awaitCount + promiseCount,
      async_functions: asyncCount,
      await_usage: awaitCount,
      promise_usage: promiseCount
    };
  }
  
  detectErrorHandling(content) {
    const tryCount = (content.match(/try\s*\{/g) || []).length;
    const catchCount = (content.match(/catch\s*\(/g) || []).length;
    const throwCount = (content.match(/throw\s+/g) || []).length;
    
    const score = Math.min((tryCount + catchCount) / 2, 10);
    
    return { score, try_blocks: tryCount, catch_blocks: catchCount, throws: throwCount };
  }
  
  detectSecurityPatterns(content) {
    const securityPatterns = [
      /bcrypt|argon2|scrypt/,  // Password hashing
      /jwt|jsonwebtoken/,      // Authentication
      /helmet|cors/,           // Security middleware
      /rate.?limit/,           // Rate limiting
      /sanitize|escape/,       // Input sanitization
      /crypto\.random|uuid/    // Secure random
    ];
    
    const score = securityPatterns.filter(pattern => pattern.test(content)).length;
    return { score, max_score: securityPatterns.length };
  }
  
  calculateComplexity(content, patterns) {
    const lines = content.split('\n').length;
    const functions = patterns.functions.length;
    const conditions = (content.match(/if\s*\(|else\s+if|switch\s*\(|\?\s*:/g) || []).length;
    const loops = (content.match(/for\s*\(|while\s*\(|forEach|map|filter/g) || []).length;
    
    // Complexity score (1-10)
    return Math.min(Math.ceil((conditions + loops + functions/2) / lines * 100), 10);
  }
  
  generateInsights(patterns, complexity, extension) {
    const insights = [];
    
    if (complexity > 7) {
      insights.push("High complexity detected - consider refactoring");
    }
    
    if (patterns.async_patterns.count > 5) {
      insights.push("Heavy async usage - review error handling and performance");
    }
    
    if (patterns.error_handling.score < 3) {
      insights.push("Limited error handling - add try/catch blocks");
    }
    
    if (patterns.security_patterns.score === 0) {
      insights.push("No security patterns detected - review security measures");
    }
    
    if (patterns.functions.length > 10) {
      insights.push("Many functions - consider module splitting");
    }
    
    return insights;
  }
  
  identifyArchitecturalLayer(pathSegments) {
    const layerMap = {
      'components': 'presentation',
      'pages': 'presentation',
      'services': 'business',
      'api': 'api',
      'utils': 'utility',
      'hooks': 'logic',
      'store': 'state',
      'models': 'data'
    };
    
    for (const segment of pathSegments) {
      if (layerMap[segment]) return layerMap[segment];
    }
    return 'unknown';
  }
  
  detectFramework(pathSegments, task) {
    const frameworks = [];
    
    const pathStr = pathSegments.join('/');
    if (pathStr.includes('next') || task.architecture?.includes('Next')) frameworks.push('Next.js');
    if (pathStr.includes('react') || task.architecture?.includes('React')) frameworks.push('React');
    if (pathStr.includes('supabase') || task.architecture?.includes('Supabase')) frameworks.push('Supabase');
    
    return frameworks;
  }
  
  detectArchitecturalPatterns(pathSegments) {
    const patterns = [];
    
    if (pathSegments.includes('middleware')) patterns.push('middleware');
    if (pathSegments.includes('api')) patterns.push('api-routes');
    if (pathSegments.includes('components')) patterns.push('component-architecture');
    if (pathSegments.includes('hooks')) patterns.push('custom-hooks');
    
    return patterns;
  }
  
  inferResponsibility(pathSegments, task) {
    const fileName = pathSegments[pathSegments.length - 1];
    const responsibility = [];
    
    if (fileName.includes('auth')) responsibility.push('authentication');
    if (fileName.includes('user')) responsibility.push('user-management');
    if (fileName.includes('api')) responsibility.push('api-integration');
    if (fileName.includes('component')) responsibility.push('ui-component');
    if (fileName.includes('service')) responsibility.push('business-logic');
    
    return responsibility.length > 0 ? responsibility : ['general'];
  }
}

export const contextService = new ContextPreparationService();