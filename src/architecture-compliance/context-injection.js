/**
 * Architecture-Compliance V2 - Context Injection System
 * Ensures all agents receive architecture context BEFORE task execution
 *
 * CRITICAL: This system prevents architecture violations by mandatory context injection
 */

import { promises as fs } from 'fs';
import path from 'path';
import { Logger } from '../utils/logger.js';

export class ArchitectureContextInjection {
  constructor(options = {}) {
    this.logger = new Logger('ArchContextInjection');
    this.architectureDocPaths = [
      'ARCHITECTURE.md',
      'docs/ARCHITECTURE.md',
      'docs/architecture.md',
      'CLAUDE.md',
      'CLAUDE2.md'
    ];
    this.options = {
      strictMode: true, // Fail if no architecture document found
      cacheDuration: 300000, // 5 minutes cache
      ...options
    };

    this.architectureCache = new Map();
    this.injectionLog = [];
  }

  /**
   * Find and load architecture document for current project
   * @param {string} projectPath - Path to project root
   * @returns {Promise<Object>} Architecture context object
   */
  async loadArchitectureContext(projectPath = process.cwd()) {
    const cacheKey = `arch-${projectPath}`;

    // Check cache first
    if (this.architectureCache.has(cacheKey)) {
      const cached = this.architectureCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.options.cacheDuration) {
        this.logger.debug(`Using cached architecture context for ${projectPath}`);
        return cached.context;
      }
    }

    // Search for architecture document
    let architectureDoc = null;
    let documentPath = null;

    for (const archPath of this.architectureDocPaths) {
      const fullPath = path.join(projectPath, archPath);
      try {
        await fs.access(fullPath);
        architectureDoc = await fs.readFile(fullPath, 'utf-8');
        documentPath = fullPath;
        this.logger.info(`Found architecture document: ${archPath}`);
        break;
      } catch {
        // Continue searching
      }
    }

    if (!architectureDoc) {
      const message = `No architecture document found in ${projectPath}. Searched: ${this.architectureDocPaths.join(', ')}`;

      if (this.options.strictMode) {
        throw new Error(`ARCHITECTURE COMPLIANCE VIOLATION: ${message}`);
      } else {
        this.logger.warn(message);
        return this.createEmptyArchitectureContext(projectPath);
      }
    }

    // Parse architecture document
    const architectureContext = await this.parseArchitectureDocument(architectureDoc, documentPath);

    // Cache the result
    this.architectureCache.set(cacheKey, {
      context: architectureContext,
      timestamp: Date.now()
    });

    return architectureContext;
  }

  /**
   * Parse architecture document and extract key information
   * @param {string} documentContent - Raw architecture document content
   * @param {string} documentPath - Path to the document
   * @returns {Promise<Object>} Parsed architecture context
   */
  async parseArchitectureDocument(documentContent, documentPath) {
    const context = {
      documentPath,
      lastModified: new Date().toISOString(),
      techStack: this.extractTechStack(documentContent),
      constraints: this.extractConstraints(documentContent),
      structure: this.extractProjectStructure(documentContent),
      decisions: this.extractDecisions(documentContent),
      compliance: {
        strictMode: true,
        qualityGates: this.extractQualityGates(documentContent),
        violations: []
      },
      raw: documentContent
    };

    this.logger.info(`Parsed architecture context: ${context.techStack.backend || 'unknown'} + ${context.techStack.frontend || 'unknown'}`);
    return context;
  }

  /**
   * Extract technology stack from architecture document
   * @param {string} content - Document content
   * @returns {Object} Technology stack object
   */
  extractTechStack(content) {
    const techStack = {
      backend: null,
      frontend: null,
      database: null,
      deployment: null,
      testing: null
    };

    // Extract backend technology
    const backendMatch = content.match(/\*\*Primary Language:\*\*\s*(.+)/i) ||
                        content.match(/Backend.*?:\s*(.+)/i);
    if (backendMatch) techStack.backend = backendMatch[1].trim();

    // Extract frontend framework
    const frontendMatch = content.match(/\*\*Framework:\*\*\s*(.+)/i) ||
                         content.match(/Frontend.*?:\s*(.+)/i);
    if (frontendMatch) techStack.frontend = frontendMatch[1].trim();

    // Extract database
    const databaseMatch = content.match(/\*\*Database Primary:\*\*\s*(.+)/i) ||
                         content.match(/Database.*?:\s*(.+)/i);
    if (databaseMatch) techStack.database = databaseMatch[1].trim();

    return techStack;
  }

  /**
   * Extract architecture constraints
   * @param {string} content - Document content
   * @returns {Array} List of architecture constraints
   */
  extractConstraints(content) {
    const constraints = [];

    // Look for constraint sections
    const constraintRegex = /⚠️.*?IMMUTABLE.*?NO.*?VIOLATIONS?.*?\n(.*?)(?=\n\n|\n#|$)/gis;
    let match;

    while ((match = constraintRegex.exec(content)) !== null) {
      const constraintText = match[1].trim();
      if (constraintText) {
        constraints.push({
          type: 'immutable',
          description: constraintText,
          severity: 'critical'
        });
      }
    }

    // Look for explicit constraint lists
    const listConstraintRegex = /\d+\.\s*\*\*(.+?):\*\*\s*(.+)/g;
    while ((match = listConstraintRegex.exec(content)) !== null) {
      constraints.push({
        type: 'technical',
        category: match[1].trim(),
        description: match[2].trim(),
        severity: 'high'
      });
    }

    return constraints;
  }

  /**
   * Extract project structure requirements
   * @param {string} content - Document content
   * @returns {Object} Project structure object
   */
  extractProjectStructure(content) {
    const structure = {
      directories: [],
      namingConventions: {},
      mandatoryFiles: []
    };

    // Extract directory structure from code blocks
    const structureMatch = content.match(/```[\s\S]*?(src\/.*?)```/i);
    if (structureMatch) {
      const structureText = structureMatch[1];
      const dirMatches = structureText.match(/├──.*?📁\s*(.+?)\//g) || [];
      structure.directories = dirMatches.map(match =>
        match.replace(/.*📁\s*/, '').replace('/', '')
      );
    }

    return structure;
  }

  /**
   * Extract architecture decisions and rationales
   * @param {string} content - Document content
   * @returns {Array} List of architecture decisions
   */
  extractDecisions(content) {
    const decisions = [];

    // Look for decision rationale tables
    const decisionTableRegex = /\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/g;
    let match;

    while ((match = decisionTableRegex.exec(content)) !== null) {
      if (!match[1].includes('Decision') && !match[1].includes('---')) {
        decisions.push({
          decision: match[1].trim(),
          alternative: match[2].trim(),
          chosen: match[3].trim(),
          rationale: match[4].trim()
        });
      }
    }

    return decisions;
  }

  /**
   * Extract quality gates from architecture document
   * @param {string} content - Document content
   * @returns {Array} List of quality gates
   */
  extractQualityGates(content) {
    const gates = [];

    // Look for quality gate definitions
    const gateRegex = /\*\*Gate\s*(\d+):\*\*\s*(.+)/gi;
    let match;

    while ((match = gateRegex.exec(content)) !== null) {
      gates.push({
        id: `gate${match[1]}`,
        description: match[2].trim(),
        required: true
      });
    }

    // Add default gates if none found
    if (gates.length === 0) {
      gates.push(
        { id: 'gate0', description: 'Architecture context injection confirmation', required: true },
        { id: 'gate1', description: 'Technical approach pre-validation', required: true },
        { id: 'gate2', description: 'Implementation compliance checkpoints', required: true },
        { id: 'gate3', description: 'Deliverable conformance validation', required: true }
      );
    }

    return gates;
  }

  /**
   * Create empty architecture context for projects without architecture docs
   * @param {string} projectPath - Project path
   * @returns {Object} Empty architecture context
   */
  createEmptyArchitectureContext(_projectPath) {
    return {
      documentPath: null,
      lastModified: new Date().toISOString(),
      warning: 'No architecture document found - using minimal compliance mode',
      techStack: { backend: null, frontend: null, database: null },
      constraints: [],
      structure: { directories: [], namingConventions: {}, mandatoryFiles: [] },
      decisions: [],
      compliance: {
        strictMode: false,
        qualityGates: [],
        violations: ['Missing architecture document']
      },
      raw: null
    };
  }

  /**
   * Inject architecture context into agent prompt
   * @param {string} agentType - Type of agent (backend, frontend, testing, etc.)
   * @param {string} originalPrompt - Original agent prompt
   * @param {string} taskDescription - Task description
   * @param {string} projectPath - Project path (optional)
   * @returns {Promise<Object>} Enhanced prompt with architecture context
   */
  async injectArchitectureContext(agentType, originalPrompt, taskDescription, projectPath = process.cwd()) {
    try {
      // Load architecture context
      const architectureContext = await this.loadArchitectureContext(projectPath);

      // Create context injection log entry
      const injectionId = `inject-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const logEntry = {
        id: injectionId,
        timestamp: new Date().toISOString(),
        agentType,
        taskDescription,
        architectureFound: !!architectureContext.documentPath,
        techStack: architectureContext.techStack,
        constraintsCount: architectureContext.constraints.length
      };

      this.injectionLog.push(logEntry);
      this.logger.info(`Architecture context injected for ${agentType} agent: ${injectionId}`);

      // Build enhanced prompt with architecture context
      const enhancedPrompt = this.buildEnhancedPrompt(
        originalPrompt,
        architectureContext,
        agentType,
        taskDescription
      );

      return {
        injectionId,
        enhancedPrompt,
        architectureContext,
        complianceChecks: this.generateComplianceChecks(architectureContext, agentType),
        qualityGates: architectureContext.compliance.qualityGates
      };

    } catch (error) {
      this.logger.error(`Architecture context injection failed: ${error.message}`);
      throw new Error(`ARCHITECTURE COMPLIANCE FAILURE: ${error.message}`);
    }
  }

  /**
   * Build enhanced prompt with architecture context
   * @param {string} originalPrompt - Original prompt
   * @param {Object} architectureContext - Architecture context
   * @param {string} agentType - Agent type
   * @param {string} taskDescription - Task description
   * @returns {string} Enhanced prompt
   */
  buildEnhancedPrompt(originalPrompt, architectureContext, _agentType, _taskDescription) {
    const contextSection = `
## 🏗️ ARCHITECTURE COMPLIANCE CONTEXT - MANDATORY

**CRITICAL**: This task MUST comply with the project architecture document.

### Architecture Document Status
- **Document Found**: ${architectureContext.documentPath ? '✅ YES' : '❌ NO'}
- **Last Modified**: ${architectureContext.lastModified}
- **Compliance Mode**: ${architectureContext.compliance.strictMode ? 'STRICT' : 'PERMISSIVE'}

### Technology Stack - IMMUTABLE DECISIONS
${architectureContext.techStack.backend ? `- **Backend**: ${architectureContext.techStack.backend}` : ''}
${architectureContext.techStack.frontend ? `- **Frontend**: ${architectureContext.techStack.frontend}` : ''}
${architectureContext.techStack.database ? `- **Database**: ${architectureContext.techStack.database}` : ''}

### Architecture Constraints - NO VIOLATIONS ALLOWED
${architectureContext.constraints.map(constraint =>
    `- **${constraint.category || 'Constraint'}**: ${constraint.description}`
  ).join('\n')}

### Quality Gates for This Task
${architectureContext.compliance.qualityGates.map(gate =>
    `- **${gate.id}**: ${gate.description}`
  ).join('\n')}

## ⚠️ MANDATORY COMPLIANCE REQUIREMENTS

Before starting your task, you MUST:
1. **CONFIRM** understanding of architecture constraints above
2. **VALIDATE** your approach against the technology stack
3. **ENSURE** your deliverable aligns with project structure requirements
4. **DOCUMENT** any architecture compliance questions or concerns

**ARCHITECTURE VIOLATION = TASK FAILURE**

---

## Original Task Prompt

${originalPrompt}

---

## 🛡️ Architecture Compliance Validation

After completing your task, verify:
- [ ] Solution uses specified technology stack only
- [ ] Implementation follows architecture constraints  
- [ ] Code structure aligns with project organization
- [ ] No architecture decisions changed without explicit approval
- [ ] Quality gates requirements addressed

**End of Architecture Context Injection**
`;

    return contextSection;
  }

  /**
   * Generate compliance checks for specific agent type
   * @param {Object} architectureContext - Architecture context
   * @param {string} agentType - Agent type
   * @returns {Array} List of compliance checks
   */
  generateComplianceChecks(architectureContext, agentType) {
    const checks = [];

    // Common checks for all agents
    checks.push({
      id: 'tech-stack-compliance',
      description: 'Verify solution uses specified technology stack',
      severity: 'critical',
      automated: false
    });

    // Agent-specific checks
    switch (agentType.toLowerCase()) {
    case 'backend':
      if (architectureContext.techStack.backend) {
        checks.push({
          id: 'backend-tech-compliance',
          description: `Must use ${architectureContext.techStack.backend}`,
          severity: 'critical',
          automated: true,
          validation: `technology === "${architectureContext.techStack.backend}"`
        });
      }
      break;

    case 'frontend':
      if (architectureContext.techStack.frontend) {
        checks.push({
          id: 'frontend-tech-compliance',
          description: `Must use ${architectureContext.techStack.frontend}`,
          severity: 'critical',
          automated: true,
          validation: `framework === "${architectureContext.techStack.frontend}"`
        });
      }
      break;

    case 'database':
      if (architectureContext.techStack.database) {
        checks.push({
          id: 'database-tech-compliance',
          description: `Must use ${architectureContext.techStack.database}`,
          severity: 'critical',
          automated: true,
          validation: `database === "${architectureContext.techStack.database}"`
        });
      }
      break;
    }

    return checks;
  }

  /**
   * Get injection log for analysis
   * @returns {Array} Injection log entries
   */
  getInjectionLog() {
    return [...this.injectionLog];
  }

  /**
   * Clear injection log
   */
  clearInjectionLog() {
    this.injectionLog = [];
  }

  /**
   * Get architecture compliance statistics
   * @returns {Object} Compliance statistics
   */
  getComplianceStats() {
    const totalInjections = this.injectionLog.length;
    const successfulInjections = this.injectionLog.filter(entry => entry.architectureFound).length;

    return {
      totalInjections,
      successfulInjections,
      complianceRate: totalInjections > 0 ? (successfulInjections / totalInjections * 100).toFixed(2) : 0,
      agentTypes: [...new Set(this.injectionLog.map(entry => entry.agentType))],
      lastInjection: this.injectionLog[this.injectionLog.length - 1]
    };
  }
}

// Export default instance
export const architectureContextInjection = new ArchitectureContextInjection({
  strictMode: true,
  cacheDuration: 300000 // 5 minutes
});

export default architectureContextInjection;
