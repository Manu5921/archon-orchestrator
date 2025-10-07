#!/usr/bin/env node

/**
 * ADVANCED SECURITY PATTERNS DETECTION
 * Patterns de sécurité avancés pour Jules Security Guardian
 */

export class AdvancedSecurityPatterns {
  constructor() {
    this.patterns = {
      // 🔐 Authentication & Authorization
      auth: {
        // JWT Security Issues
        jwtWeakSecret: [
          /jwt\.sign\([^,]*,\s*['"](\w{1,10}|secret|password)['"]/gi,
          /jwt\.verify\([^,]*,\s*['"](\w{1,10}|secret)['"]/gi
        ],
        
        // Session Management
        sessionInsecure: [
          /session\.cookie\s*=\s*{[^}]*secure:\s*false/gi,
          /express\.session\([^}]*secure:\s*false/gi,
          /maxAge:\s*(1000\s*\*\s*60\s*\*\s*60\s*\*\s*24\s*\*\s*[789]\d)/gi // >7 days
        ],
        
        // Password Security
        passwordWeak: [
          /password.*length.*[1-5]/gi,
          /bcrypt\.hash\([^,]*,\s*[1-7]\)/gi, // Weak salt rounds
          /crypto\.pbkdf2\([^,]*,\s*[1-9]\d{0,2}[^0-9])/gi // < 10000 iterations
        ],
        
        // OAuth Misconfigurations
        oauthUnsafe: [
          /client_secret.*['"]\w+['"].*github/gi, // Hardcoded OAuth secrets
          /redirect_uri.*http:/gi, // Non-HTTPS redirects
          /state.*undefined|null/gi // Missing CSRF state
        ]
      },

      // 🛡️ Input Validation & Injection
      injection: {
        // Advanced SQL Injection
        sqlAdvanced: [
          /\$\{[^}]*(?:user|input|req\.|params|query|body)[^}]*\}.*(?:SELECT|INSERT|UPDATE|DELETE)/gi,
          /query\s*\+=?\s*['"]\s*\+\s*[^'"]*user/gi,
          /WHERE.*=.*\$\{|WHERE.*=.*`\${/gi,
          /UNION.*SELECT.*\$\{/gi
        ],
        
        // NoSQL Injection
        nosqlInjection: [
          /\$where.*\$\{/gi,
          /find\(.*req\..*\)/gi,
          /\{\s*\$ne:\s*null\s*\}/gi, // NoSQL injection pattern
          /eval.*req\.|eval.*user/gi
        ],
        
        // Command Injection
        commandInjection: [
          /exec.*req\.|spawn.*req\.|system.*req\./gi,
          /eval\(.*user|eval\(.*input/gi,
          /new\s+Function\(.*req\./gi,
          /child_process.*shell.*true/gi
        ],
        
        // LDAP Injection
        ldapInjection: [
          /search\(.*\$\{.*user/gi,
          /filter.*=.*req\./gi
        ]
      },

      // 🌐 Web Security Headers & CORS
      webSecurity: {
        // CORS Vulnerabilities
        corsAdvanced: [
          /origin:\s*function.*return\s+true/gi, // Allow all origins function
          /credentials:\s*true.*origin.*\*/gi,
          /origin.*req\.get.*origin/gi, // Reflected origin
          /Access-Control-Allow-Credentials.*true.*Origin.*\*/gi
        ],
        
        // Content Security Policy
        cspWeak: [
          /script-src.*unsafe-inline/gi,
          /script-src.*unsafe-eval/gi,
          /object-src.*\*/gi,
          /frame-ancestors.*\*/gi
        ],
        
        // HTTP Security Headers Missing
        headersInsecure: [
          /response\.setHeader.*X-Frame-Options.*ALLOW/gi,
          /helmet\(\).*frameguard.*false/gi,
          /Strict-Transport-Security.*max-age=\d{1,6}[^0-9]/gi // < 1 year
        ]
      },

      // 📁 File System Security
      filesystem: {
        // Path Traversal
        pathTraversal: [
          /\.\.\/|\.\.\\/gi,
          /path\.join\(.*user|path\.join\(.*req\./gi,
          /readFile\(.*\$\{.*user/gi,
          /createReadStream\(.*req\./gi
        ],
        
        // File Upload Vulnerabilities
        fileUploadUnsafe: [
          /upload.*destination.*user/gi,
          /filename.*originalname/gi, // Direct use of user filename
          /\.exe|\.scr|\.bat|\.cmd/gi, // Dangerous extensions allowed
          /multer.*fileFilter.*return\s*true/gi // Accept all files
        ],
        
        // Temporary File Issues
        tempFileInsecure: [
          /tmp.*\$\{.*user/gi,
          /createTemp.*user/gi,
          /\/tmp\/.*req\./gi
        ]
      },

      // 🔒 Cryptography & Encryption
      crypto: {
        // Weak Encryption
        weakEncryption: [
          /crypto\.createCipher\(['"]des/gi,
          /AES-128|RC4|3DES/gi,
          /crypto\.createHash\(['"]md5/gi,
          /crypto\.createHash\(['"]sha1/gi
        ],
        
        // Key Management Issues
        keyManagement: [
          /generateKey.*length.*1\d{2}[^0-9]/gi, // Keys < 2048 bits
          /randomBytes\([1-7]\)/gi, // Weak random data
          /Math\.random.*crypto|Math\.random.*key/gi,
          /private.*key.*['"]\w+['"]/gi // Hardcoded private keys
        ],
        
        // Certificate Issues
        certificateIssues: [
          /rejectUnauthorized.*false/gi,
          /checkServerIdentity.*null/gi,
          /strictSSL.*false/gi
        ]
      },

      // 🌍 API Security
      apiSecurity: {
        // Rate Limiting Missing
        rateLimitMissing: [
          /app\.post.*\/api\/.*(?!.*rateLimit|.*limiter)/gi,
          /router\.post.*(?!.*rate)/gi
        ],
        
        // API Key Exposure
        apiKeyExposed: [
          /api[_-]?key.*['"]\w{20,}['"]/gi,
          /bearer.*['"]\w{30,}['"]/gi,
          /authorization.*['"]\w{30,}['"]/gi
        ],
        
        // JSONP Vulnerabilities
        jsonpUnsafe: [
          /jsonp.*callback.*req\./gi,
          /callback.*user.*function/gi
        ]
      },

      // 🔍 Information Disclosure
      infoDisclosure: {
        // Debug Information
        debugInfo: [
          /console\.log.*password|console\.log.*token/gi,
          /console\.error.*user.*password/gi,
          /res\.json.*error.*stack/gi, // Stack traces in responses
          /app\.use.*errorHandler.*stack/gi
        ],
        
        // Sensitive Data Exposure
        sensitiveData: [
          /email.*password.*json/gi,
          /user.*password.*response/gi,
          /session.*secret.*log/gi,
          /database.*url.*console/gi
        ],
        
        // Version Information
        versionLeaks: [
          /X-Powered-By/gi,
          /Server.*Express/gi,
          /app\.disable.*x-powered-by.*false/gi
        ]
      },

      // 🏗️ Architecture Security
      architecture: {
        // Microservices Security
        microservicesUnsafe: [
          /internal.*service.*http:/gi, // Unencrypted internal comms
          /service.*discovery.*no.*auth/gi,
          /api.*gateway.*bypass/gi
        ],
        
        // Container Security
        containerUnsafe: [
          /USER.*root/gi, // Running as root
          /RUN.*curl.*bash/gi, // Downloading and executing scripts
          /EXPOSE.*80[^0-9]/gi // HTTP instead of HTTPS
        ],
        
        // Infrastructure as Code
        iacUnsafe: [
          /SecurityGroup.*0\.0\.0\.0\/0.*22/gi, // SSH open to world
          /ingress.*80.*0\.0\.0\.0/gi,
          /public.*true.*database/gi // Public database
        ]
      },

      // 🔒 Business Logic Security
      businessLogic: {
        // Authorization Bypass
        authzBypass: [
          /if.*admin.*true/gi, // Hardcoded admin checks
          /role.*user.*admin.*user/gi, // Role confusion
          /bypass.*auth.*dev/gi
        ],
        
        // Race Conditions
        raceConditions: [
          /async.*balance.*update/gi,
          /concurrent.*payment/gi,
          /transaction.*missing/gi
        ],
        
        // Price/Quantity Manipulation
        priceManipulation: [
          /price.*req\.body/gi, // Client-controlled price
          /quantity.*user.*input.*direct/gi,
          /discount.*100|discount.*user/gi
        ]
      }
    };

    // Severity mapping for advanced patterns
    this.severityMapping = {
      // Critical
      'jwtWeakSecret': 'CRITICAL',
      'sqlAdvanced': 'CRITICAL',
      'commandInjection': 'CRITICAL',
      'weakEncryption': 'CRITICAL',
      'authzBypass': 'CRITICAL',
      
      // High  
      'passwordWeak': 'HIGH',
      'corsAdvanced': 'HIGH',
      'pathTraversal': 'HIGH',
      'apiKeyExposed': 'HIGH',
      'priceManipulation': 'HIGH',
      
      // Medium
      'sessionInsecure': 'MEDIUM',
      'cspWeak': 'MEDIUM',
      'rateLimitMissing': 'MEDIUM',
      'debugInfo': 'MEDIUM',
      'containerUnsafe': 'MEDIUM',
      
      // Low
      'versionLeaks': 'LOW',
      'headersInsecure': 'LOW',
      'sensitiveData': 'LOW'
    };
  }

  /**
   * Scan content for advanced security patterns
   */
  scanAdvancedPatterns(content, filename) {
    const issues = [];
    
    for (const [category, subcategories] of Object.entries(this.patterns)) {
      for (const [patternName, patterns] of Object.entries(subcategories)) {
        for (const pattern of patterns) {
          const matches = [...content.matchAll(pattern)];
          
          for (const match of matches) {
            issues.push({
              type: 'advanced_pattern',
              category,
              pattern: patternName,
              severity: this.severityMapping[patternName] || 'MEDIUM',
              file: filename,
              line: this.getLineNumber(content, match.index),
              issue: match[0],
              description: this.getPatternDescription(patternName),
              recommendation: this.getPatternRecommendation(patternName),
              cwe: this.getCWEMapping(patternName),
              owasp: this.getOWASPMapping(patternName)
            });
          }
        }
      }
    }
    
    return issues;
  }

  /**
   * Get description for security pattern
   */
  getPatternDescription(patternName) {
    const descriptions = {
      'jwtWeakSecret': 'JWT signed with weak or hardcoded secret',
      'sqlAdvanced': 'Advanced SQL injection vulnerability detected',
      'commandInjection': 'Command injection vulnerability',
      'corsAdvanced': 'Advanced CORS misconfiguration',
      'pathTraversal': 'Path traversal vulnerability',
      'weakEncryption': 'Weak cryptographic algorithm in use',
      'passwordWeak': 'Weak password policy or hashing',
      'apiKeyExposed': 'API key or token exposed in code',
      'debugInfo': 'Debug information disclosure',
      'authzBypass': 'Authorization bypass vulnerability',
      'priceManipulation': 'Business logic flaw - price manipulation possible',
      'containerUnsafe': 'Unsafe container configuration',
      'rateLimitMissing': 'Rate limiting not implemented',
      'cspWeak': 'Weak Content Security Policy',
      'versionLeaks': 'Version information disclosure'
    };
    
    return descriptions[patternName] || 'Security issue detected';
  }

  /**
   * Get recommendation for security pattern
   */
  getPatternRecommendation(patternName) {
    const recommendations = {
      'jwtWeakSecret': 'Use a strong, randomly generated secret (minimum 256 bits)',
      'sqlAdvanced': 'Use parameterized queries or prepared statements',
      'commandInjection': 'Avoid dynamic command execution, validate and sanitize input',
      'corsAdvanced': 'Configure CORS with specific origins and avoid wildcard with credentials',
      'pathTraversal': 'Validate file paths and use path.resolve() to prevent traversal',
      'weakEncryption': 'Use strong encryption algorithms (AES-256, RSA-4096, SHA-256+)',
      'passwordWeak': 'Implement strong password policy and use bcrypt with salt rounds ≥ 12',
      'apiKeyExposed': 'Move API keys to environment variables or secure key management',
      'debugInfo': 'Remove debug output containing sensitive information',
      'authzBypass': 'Implement proper role-based access control (RBAC)',
      'priceManipulation': 'Validate prices server-side, never trust client input',
      'containerUnsafe': 'Run containers as non-root user, use secure base images',
      'rateLimitMissing': 'Implement rate limiting to prevent abuse',
      'cspWeak': 'Strengthen Content Security Policy, avoid unsafe-inline/eval',
      'versionLeaks': 'Hide server version information in HTTP headers'
    };
    
    return recommendations[patternName] || 'Review and fix security issue';
  }

  /**
   * Get CWE mapping for pattern
   */
  getCWEMapping(patternName) {
    const cweMap = {
      'jwtWeakSecret': 'CWE-798', // Use of Hard-coded Credentials
      'sqlAdvanced': 'CWE-89',    // SQL Injection
      'commandInjection': 'CWE-78', // Command Injection
      'corsAdvanced': 'CWE-346',  // Origin Validation Error
      'pathTraversal': 'CWE-22',  // Path Traversal
      'weakEncryption': 'CWE-327', // Weak Encryption
      'passwordWeak': 'CWE-521',  // Weak Password Requirements
      'apiKeyExposed': 'CWE-798', // Hard-coded Credentials
      'debugInfo': 'CWE-200',     // Information Disclosure
      'authzBypass': 'CWE-862',   // Missing Authorization
      'priceManipulation': 'CWE-840', // Business Logic Errors
      'rateLimitMissing': 'CWE-770'   // Missing Resource Allocation
    };
    
    return cweMap[patternName] || 'CWE-710'; // Generic coding standard violation
  }

  /**
   * Get OWASP Top 10 mapping
   */
  getOWASPMapping(patternName) {
    const owaspMap = {
      'jwtWeakSecret': 'A07:2021 – Identification and Authentication Failures',
      'sqlAdvanced': 'A03:2021 – Injection',
      'commandInjection': 'A03:2021 – Injection',
      'corsAdvanced': 'A05:2021 – Security Misconfiguration',
      'pathTraversal': 'A01:2021 – Broken Access Control',
      'weakEncryption': 'A02:2021 – Cryptographic Failures',
      'passwordWeak': 'A07:2021 – Identification and Authentication Failures',
      'apiKeyExposed': 'A02:2021 – Cryptographic Failures',
      'debugInfo': 'A09:2021 – Security Logging and Monitoring Failures',
      'authzBypass': 'A01:2021 – Broken Access Control',
      'priceManipulation': 'A04:2021 – Insecure Design',
      'rateLimitMissing': 'A05:2021 – Security Misconfiguration'
    };
    
    return owaspMap[patternName] || 'A06:2021 – Vulnerable and Outdated Components';
  }

  /**
   * Get line number from match index
   */
  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }

  /**
   * Context-aware pattern matching
   */
  contextAwareMatching(content, filename) {
    const issues = this.scanAdvancedPatterns(content, filename);
    
    // Filter false positives based on context
    return issues.filter(issue => {
      // Skip issues in test files for some patterns
      if (filename.includes('test') || filename.includes('spec')) {
        const testSafePatterns = ['debugInfo', 'versionLeaks'];
        if (testSafePatterns.includes(issue.pattern)) {
          return false;
        }
      }
      
      // Skip issues in development configurations
      if (filename.includes('dev') || filename.includes('development')) {
        const devSafePatterns = ['corsAdvanced', 'debugInfo'];
        if (devSafePatterns.includes(issue.pattern)) {
          return false;
        }
      }
      
      return true;
    });
  }
}

export default AdvancedSecurityPatterns;