/**
 * Système de nommage intelligent pour documents Knowledge Base
 */

export class IntelligentDocumentNaming {
  constructor() {
    this.namingPatterns = {
      failure_analysis: {
        prefix: "FAILURE-ANALYSIS",
        template: "{prefix} - {project} - {component} - {date}",
        examples: [
          "FAILURE-ANALYSIS - NutriCoach - Frontend-Agents - 2025-09-01",
          "FAILURE-ANALYSIS - ECommerce - Payment-System - 2025-08-15"
        ]
      },
      solution_system: {
        prefix: "SOLUTION",
        template: "{prefix} - {system-name} - {version} - {scope}",
        examples: [
          "SOLUTION - Architecture-Compliance - V2 - Quality-Gates-System",
          "SOLUTION - Error-Handling - V1 - Frontend-Components"
        ]
      },
      integration_workflow: {
        prefix: "WORKFLOW",
        template: "{prefix} - {integration-type} - {components} - {status}",
        examples: [
          "WORKFLOW - CI-CD-Integration - GitHub-Jules-Archon - Production-Ready",
          "WORKFLOW - Multi-Agent - Claude-Gemini-Orchestra - Validated"
        ]
      },
      best_practices: {
        prefix: "BEST-PRACTICES",
        template: "{prefix} - {domain} - {technology} - {level}",
        examples: [
          "BEST-PRACTICES - Frontend - React-TypeScript - Enterprise",
          "BEST-PRACTICES - Security - API-Design - Advanced"
        ]
      },
      post_mortem: {
        prefix: "POST-MORTEM",
        template: "{prefix} - {incident} - {impact} - {date}",
        examples: [
          "POST-MORTEM - Type-Safety-Breakdown - High-Impact - 2025-09-01",
          "POST-MORTEM - Database-Migration-Failure - Critical - 2025-08-20"
        ]
      },
      knowledge_update: {
        prefix: "KNOWLEDGE-UPDATE",
        template: "{prefix} - {topic} - {update-type} - {version}",
        examples: [
          "KNOWLEDGE-UPDATE - Architecture-Patterns - New-Patterns - V2.1",
          "KNOWLEDGE-UPDATE - Security-Guidelines - Policy-Change - V3.0"
        ]
      }
    };
  }

  /**
   * Génère nom intelligent basé sur contenu et métadonnées
   */
  generateIntelligentName(content, metadata) {
    const docType = metadata.type || this.detectDocumentType(content);
    const pattern = this.namingPatterns[docType] || this.namingPatterns.knowledge_update;
    
    const variables = this.extractVariables(content, metadata, docType);
    return this.applyTemplate(pattern.template, variables);
  }

  /**
   * Détecte type de document basé sur contenu
   */
  detectDocumentType(content) {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('failure') || lowerContent.includes('échec')) {
      return 'failure_analysis';
    }
    if (lowerContent.includes('solution') || lowerContent.includes('system')) {
      return 'solution_system';
    }
    if (lowerContent.includes('workflow') || lowerContent.includes('integration')) {
      return 'integration_workflow';
    }
    if (lowerContent.includes('post-mortem') || lowerContent.includes('incident')) {
      return 'post_mortem';
    }
    if (lowerContent.includes('best practices') || lowerContent.includes('guidelines')) {
      return 'best_practices';
    }
    
    return 'knowledge_update';
  }

  /**
   * Extrait variables du contenu pour template
   */
  extractVariables(content, metadata, docType) {
    const pattern = this.namingPatterns[docType] || this.namingPatterns.knowledge_update;
    const variables = {
      prefix: pattern.prefix,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now()
    };

    // Variables spécifiques par type
    switch (docType) {
      case 'failure_analysis':
        variables.project = metadata.project || this.extractProject(content) || 'Unknown-Project';
        variables.component = this.extractComponent(content) || 'System';
        variables.severity = metadata.severity || this.extractSeverity(content) || 'Medium';
        break;
        
      case 'solution_system':
        variables['system-name'] = this.extractSystemName(content) || 'System';
        variables.version = this.extractVersion(content) || 'V1';
        variables.scope = this.extractScope(content) || 'General';
        break;
        
      case 'integration_workflow':
        variables['integration-type'] = this.extractIntegrationType(content) || 'Integration';
        variables.components = this.extractComponents(content) || 'Multi-Component';
        variables.status = metadata.status || this.extractStatus(content) || 'In-Progress';
        break;
    }

    return variables;
  }

  /**
   * Applique template avec variables
   */
  applyTemplate(template, variables) {
    let result = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });
    
    // Nettoyer et formater
    return result
      .replace(/[^a-zA-Z0-9\-\s]/g, '') // Supprimer caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer espaces par tirets
      .replace(/-+/g, '-') // Consolider tirets multiples
      .toUpperCase();
  }

  // Méthodes d'extraction (exemples)
  extractProject(content) {
    const projectMatch = content.match(/project[:\s]+([a-zA-Z0-9\s]+)/i);
    return projectMatch ? projectMatch[1].trim().replace(/\s+/g, '-') : null;
  }

  extractComponent(content) {
    if (content.toLowerCase().includes('frontend')) return 'Frontend';
    if (content.toLowerCase().includes('backend')) return 'Backend';
    if (content.toLowerCase().includes('database')) return 'Database';
    if (content.toLowerCase().includes('api')) return 'API';
    return 'System';
  }

  extractSeverity(content) {
    if (content.toLowerCase().includes('critical')) return 'Critical';
    if (content.toLowerCase().includes('high')) return 'High';
    if (content.toLowerCase().includes('medium')) return 'Medium';
    return 'Low';
  }

  extractSystemName(content) {
    const systemMatch = content.match(/([A-Z][a-zA-Z\-]+)\s+(System|V\d+|Client)/);
    return systemMatch ? systemMatch[1] : 'System';
  }

  extractVersion(content) {
    const versionMatch = content.match(/V(\d+(\.\d+)?)|version\s+(\d+(\.\d+)?)/i);
    return versionMatch ? `V${versionMatch[1] || versionMatch[3]}` : 'V1';
  }

  extractScope(content) {
    if (content.toLowerCase().includes('quality')) return 'Quality-System';
    if (content.toLowerCase().includes('security')) return 'Security-System';
    if (content.toLowerCase().includes('performance')) return 'Performance-System';
    return 'General-System';
  }

  extractIntegrationType(content) {
    if (content.toLowerCase().includes('ci/cd')) return 'CI-CD';
    if (content.toLowerCase().includes('github')) return 'GitHub-Integration';
    if (content.toLowerCase().includes('webhook')) return 'Webhook-Integration';
    return 'System-Integration';
  }

  extractComponents(content) {
    const components = [];
    if (content.toLowerCase().includes('github')) components.push('GitHub');
    if (content.toLowerCase().includes('jules')) components.push('Jules');
    if (content.toLowerCase().includes('archon')) components.push('Archon');
    if (content.toLowerCase().includes('claude')) components.push('Claude');
    if (content.toLowerCase().includes('gemini')) components.push('Gemini');
    
    return components.length > 0 ? components.join('-') : 'Multi-Component';
  }

  extractStatus(content) {
    if (content.toLowerCase().includes('production')) return 'Production-Ready';
    if (content.toLowerCase().includes('tested')) return 'Tested';
    if (content.toLowerCase().includes('validated')) return 'Validated';
    if (content.toLowerCase().includes('operational')) return 'Operational';
    return 'Development';
  }
}

// Exemples d'amélioration de nos documents actuels
export const improvedDocumentNames = {
  current: [
    "archon-memory-failures.md",
    "architecture-compliance-v2.md", 
    "github-jules-integration.md"
  ],
  improved: [
    "FAILURE-ANALYSIS - NutriCoach - Frontend-Agents - Critical - 2025-09-01.md",
    "SOLUTION - Architecture-Compliance - V2 - Quality-Gates-System - Production.md",
    "WORKFLOW - CI-CD-Integration - GitHub-Jules-Archon - Production-Ready.md"
  ]
};

export default IntelligentDocumentNaming;