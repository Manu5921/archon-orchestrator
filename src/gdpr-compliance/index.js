#!/usr/bin/env node

/**
 * GDPR COMPLIANCE SYSTEM - MAIN INTEGRATION MODULE
 * 
 * Phase 4 TrustBoost - Complete GDPR compliance system
 * Integrates all compliance components for full regulatory compliance
 * 
 * Components:
 * - Granular consent management system
 * - Automated data export/deletion (<24h SLA)
 * - Comprehensive audit trail (WHO, WHAT, WHEN)
 * - Legally validated documents (CGU/CGV, Privacy Policy)
 * - GDPR certification and validation system
 */

import { EventEmitter } from 'events';
import { logger } from '../utils/logger.js';

// Import GDPR compliance components
import { consentManager } from './consent-manager.js';
import { dataProcessor } from './data-processor.js';
import { auditTrailSystem } from './audit-trail-system.js';
import { legalDocumentsGenerator } from './legal-documents.js';
import { gdprValidator } from './gdpr-validator.js';

/**
 * Main GDPR Compliance System Integration
 */
export class GDPRComplianceSystem extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.config = {
      // System configuration
      environment: process.env.NODE_ENV || 'production',
      systemName: 'TrustBoost GDPR Compliance System',
      version: '2024.1',
      
      // Component configuration
      components: {
        consentManager: { enabled: true, required: true },
        dataProcessor: { enabled: true, required: true },
        auditTrailSystem: { enabled: true, required: true },
        legalDocuments: { enabled: true, required: true },
        gdprValidator: { enabled: true, required: false }
      },
      
      // Integration settings
      integration: {
        autoInitialize: true,
        healthCheckInterval: 30000, // 30 seconds
        complianceCheckInterval: 24 * 60 * 60 * 1000, // 24 hours
        reportingInterval: 7 * 24 * 60 * 60 * 1000 // Weekly
      },
      
      ...options
    };
    
    this.components = {};
    this.systemHealth = {
      status: 'initializing',
      components: {},
      lastCheck: null,
      uptime: Date.now()
    };
    
    this.complianceStatus = {
      score: null,
      certification: null,
      lastAudit: null,
      nextAuditDue: null
    };
    
    this.initialized = false;
    
    // Auto-initialize if enabled
    if (this.config.integration.autoInitialize) {
      this.init();
    }
  }

  /**
   * Initialize the complete GDPR compliance system
   */
  async init() {
    try {
      logger.info('🚀 Initializing GDPR Compliance System...');
      logger.info('═══════════════════════════════════════════════');
      
      const startTime = Date.now();
      
      // Initialize core components
      await this.initializeComponents();
      
      // Set up component event listeners
      this.setupEventListeners();
      
      // Generate legal documents
      await this.generateLegalDocuments();
      
      // Start monitoring processes
      this.startHealthMonitoring();
      this.startComplianceMonitoring();
      this.startReporting();
      
      // Perform initial compliance check
      await this.performInitialComplianceCheck();
      
      this.initialized = true;
      const initTime = Date.now() - startTime;
      
      logger.info('✅ GDPR Compliance System initialized successfully');
      logger.info(`⏱️ Initialization time: ${initTime}ms`);
      logger.info('═══════════════════════════════════════════════');
      
      // Emit system ready event
      this.emit('systemReady', {
        initTime,
        components: Object.keys(this.components).length,
        complianceScore: this.complianceStatus.score
      });
      
      return {
        success: true,
        initTime,
        components: this.getComponentStatus(),
        complianceStatus: this.complianceStatus
      };
      
    } catch (error) {
      logger.error(`❌ Failed to initialize GDPR Compliance System: ${error.message}`);
      this.systemHealth.status = 'failed';
      this.emit('systemError', error);
      throw error;
    }
  }

  /**
   * Initialize all GDPR compliance components
   */
  async initializeComponents() {
    logger.info('🔧 Initializing GDPR compliance components...');
    
    // Initialize consent manager
    if (this.config.components.consentManager.enabled) {
      try {
        if (!consentManager.initialized) {
          await consentManager.init();
        }
        this.components.consentManager = consentManager;
        logger.info('✅ Consent Manager initialized');
      } catch (error) {
        logger.error(`❌ Consent Manager failed: ${error.message}`);
        if (this.config.components.consentManager.required) {
          throw error;
        }
      }
    }
    
    // Initialize data processor
    if (this.config.components.dataProcessor.enabled) {
      try {
        if (!dataProcessor.initialized) {
          await dataProcessor.init();
        }
        this.components.dataProcessor = dataProcessor;
        logger.info('✅ Data Processor initialized');
      } catch (error) {
        logger.error(`❌ Data Processor failed: ${error.message}`);
        if (this.config.components.dataProcessor.required) {
          throw error;
        }
      }
    }
    
    // Initialize audit trail system
    if (this.config.components.auditTrailSystem.enabled) {
      try {
        if (!auditTrailSystem.initialized) {
          await auditTrailSystem.init();
        }
        this.components.auditTrailSystem = auditTrailSystem;
        logger.info('✅ Audit Trail System initialized');
      } catch (error) {
        logger.error(`❌ Audit Trail System failed: ${error.message}`);
        if (this.config.components.auditTrailSystem.required) {
          throw error;
        }
      }
    }
    
    // Initialize GDPR validator
    if (this.config.components.gdprValidator.enabled) {
      try {
        if (!gdprValidator.initialized) {
          await gdprValidator.init();
        }
        this.components.gdprValidator = gdprValidator;
        logger.info('✅ GDPR Validator initialized');
      } catch (error) {
        logger.error(`❌ GDPR Validator failed: ${error.message}`);
        if (this.config.components.gdprValidator.required) {
          throw error;
        }
      }
    }
  }

  /**
   * Set up event listeners for component coordination
   */
  setupEventListeners() {
    logger.info('🔗 Setting up component event listeners...');
    
    // Consent Manager events
    if (this.components.consentManager) {
      this.components.consentManager.on('consentChanged', async (event) => {
        await this.handleConsentChanged(event);
      });
      
      this.components.consentManager.on('consentWithdrawn', async (event) => {
        await this.handleConsentWithdrawn(event);
      });
    }
    
    // Data Processor events
    if (this.components.dataProcessor) {
      this.components.dataProcessor.on('exportCompleted', async (event) => {
        await this.handleExportCompleted(event);
      });
      
      this.components.dataProcessor.on('deletionCompleted', async (event) => {
        await this.handleDeletionCompleted(event);
      });
      
      this.components.dataProcessor.on('slaBreached', async (event) => {
        await this.handleSLABreach(event);
      });
    }
    
    // Audit Trail System events
    if (this.components.auditTrailSystem) {
      this.components.auditTrailSystem.on('criticalEvent', async (event) => {
        await this.handleCriticalAuditEvent(event);
      });
      
      this.components.auditTrailSystem.on('dataBreachDetected', async (event) => {
        await this.handleDataBreach(event);
      });
    }
    
    logger.info('✅ Event listeners configured');
  }

  /**
   * Generate legal documents
   */
  async generateLegalDocuments() {
    if (this.config.components.legalDocuments.enabled) {
      try {
        logger.info('📄 Generating legal documents...');
        
        const result = await legalDocumentsGenerator.generateAllDocuments();
        this.components.legalDocuments = legalDocumentsGenerator;
        
        logger.info(`✅ Legal documents generated: ${result.documents.join(', ')}`);
        
        // Log document generation in audit trail
        if (this.components.auditTrailSystem) {
          await this.components.auditTrailSystem.logSystemEvent('legal_documents_generated', {
            documents: result.documents,
            outputPath: result.outputPath
          });
        }
        
      } catch (error) {
        logger.error(`❌ Legal documents generation failed: ${error.message}`);
        if (this.config.components.legalDocuments.required) {
          throw error;
        }
      }
    }
  }

  /**
   * Perform initial compliance check
   */
  async performInitialComplianceCheck() {
    if (this.components.gdprValidator) {
      try {
        logger.info('🔍 Performing initial GDPR compliance audit...');
        
        const audit = await this.components.gdprValidator.performComplianceAudit({
          type: 'initial_system_audit',
          triggeredBy: 'system_initialization'
        });
        
        this.complianceStatus = {
          score: audit.overallCompliance.score,
          status: audit.overallCompliance.status,
          certification: audit.overallCompliance.certification,
          lastAudit: audit.startTime,
          nextAuditDue: audit.nextAuditDate,
          auditId: audit.id
        };
        
        logger.info(`✅ Initial compliance check completed: ${audit.overallCompliance.score}% (${audit.overallCompliance.status})`);
        
        // Log compliance check
        if (this.components.auditTrailSystem) {
          await this.components.auditTrailSystem.logSystemEvent('compliance_check_completed', {
            auditId: audit.id,
            score: audit.overallCompliance.score,
            status: audit.overallCompliance.status,
            certification: audit.overallCompliance.certification?.certificationLevel
          });
        }
        
        // Emit compliance event
        this.emit('complianceChecked', {
          score: audit.overallCompliance.score,
          status: audit.overallCompliance.status,
          audit
        });
        
      } catch (error) {
        logger.error(`❌ Initial compliance check failed: ${error.message}`);
      }
    }
  }

  /**
   * Event handlers for component coordination
   */

  async handleConsentChanged(event) {
    const { userId, consentRecord, changedCategories } = event;
    
    // Log consent change in audit trail
    if (this.components.auditTrailSystem) {
      await this.components.auditTrailSystem.logAuditEvent(
        'consent_updated',
        userId,
        {
          consentId: consentRecord.id,
          changedCategories,
          preferences: consentRecord.preferences,
          legalBasis: consentRecord.legalBasis,
          processingActivity: 'consent_management'
        }
      );
    }
    
    // Check if consent changes affect data processing
    await this.checkConsentImpactOnProcessing(userId, changedCategories);
    
    this.emit('userConsentChanged', { userId, changedCategories });
  }

  async handleConsentWithdrawn(event) {
    const { userId, withdrawalData } = event;
    
    // Log consent withdrawal
    if (this.components.auditTrailSystem) {
      await this.components.auditTrailSystem.logAuditEvent(
        'consent_withdrawn',
        userId,
        {
          withdrawnCategories: withdrawalData.withdrawnCategories,
          withdrawalReason: withdrawalData.withdrawalReason,
          withdrawnAt: withdrawalData.withdrawnAt,
          processingActivity: 'consent_management'
        }
      );
    }
    
    // Automatically trigger data deletion if required
    await this.handleConsentWithdrawalDataImpact(userId, withdrawalData);
    
    this.emit('userConsentWithdrawn', { userId, withdrawalData });
  }

  async handleExportCompleted(event) {
    const { request } = event;
    
    logger.info(`📤 Data export completed for user ${request.userId} (Request: ${request.id})`);
    
    // Log export completion
    if (this.components.auditTrailSystem) {
      await this.components.auditTrailSystem.logAuditEvent(
        'data_export_completed',
        request.userId,
        {
          requestId: request.id,
          exportFiles: request.exportFiles.length,
          totalSize: request.totalDataSize,
          format: request.format,
          completedAt: request.actualCompletionTime,
          slaStatus: request.slaStatus,
          processingActivity: 'data_portability'
        }
      );
    }
    
    this.emit('userDataExported', { userId: request.userId, request });
  }

  async handleDeletionCompleted(event) {
    const { request } = event;
    
    logger.info(`🗑️ Data deletion completed for user ${request.userId} (Request: ${request.id})`);
    
    // Log deletion completion
    if (this.components.auditTrailSystem) {
      await this.components.auditTrailSystem.logAuditEvent(
        'data_deletion_completed',
        request.userId,
        {
          requestId: request.id,
          deletedSources: request.deletedDataSources,
          retainedSources: request.retainedDataSources,
          completedAt: request.actualCompletionTime,
          slaStatus: request.slaStatus,
          processingActivity: 'data_erasure'
        }
      );
    }
    
    this.emit('userDataDeleted', { userId: request.userId, request });
  }

  async handleSLABreach(event) {
    const { request } = event;
    
    logger.error(`🚨 SLA BREACH: Request ${request.id} (${request.type}) - User ${request.userId}`);
    
    // Log SLA breach as critical event
    if (this.components.auditTrailSystem) {
      await this.components.auditTrailSystem.logAuditEvent(
        'sla_breach',
        request.userId,
        {
          requestId: request.id,
          requestType: request.type,
          slaDeadline: request.slaDeadline,
          actualTime: new Date().toISOString(),
          severity: 'critical',
          processingActivity: 'sla_monitoring'
        }
      );
    }
    
    this.emit('slaBreached', { request, severity: 'critical' });
  }

  async handleCriticalAuditEvent(event) {
    logger.error(`🚨 CRITICAL AUDIT EVENT: ${event.eventType} - ${event.id}`);
    
    // Escalate critical events
    this.emit('criticalEvent', {
      eventType: event.eventType,
      eventId: event.id,
      subjectId: event.subjectId,
      timestamp: event.timestamp,
      severity: 'critical'
    });
  }

  async handleDataBreach(event) {
    logger.error(`🚨 DATA BREACH DETECTED: ${event.eventData.breachId}`);
    
    // Immediate breach response
    await this.initiateBreachResponse(event);
    
    this.emit('dataBreachDetected', {
      breachId: event.eventData.breachId,
      breachType: event.eventData.breachType,
      affectedSubjects: event.eventData.affectedSubjects,
      timestamp: event.timestamp
    });
  }

  /**
   * Supporting methods
   */

  async checkConsentImpactOnProcessing(userId, changedCategories) {
    // Check if withdrawn consent affects ongoing processing
    if (this.components.consentManager && this.components.dataProcessor) {
      const consent = this.components.consentManager.getConsent(userId);
      
      for (const category of changedCategories) {
        if (!consent.preferences[category]) {
          // Consent withdrawn for this category - check for data retention requirements
          logger.info(`🔄 Checking data processing impact for user ${userId}, category: ${category}`);
          
          // Could trigger automatic data cleanup or processing restriction
          // Implementation depends on specific business rules
        }
      }
    }
  }

  async handleConsentWithdrawalDataImpact(userId, withdrawalData) {
    // Automatically handle data processing changes when consent is withdrawn
    const { withdrawnCategories } = withdrawalData;
    
    // Check if any withdrawn categories require data deletion
    const deletionRequiredCategories = withdrawnCategories.filter(category => 
      ['marketing', 'analytics'].includes(category) // Example categories that require deletion
    );
    
    if (deletionRequiredCategories.length > 0 && this.components.dataProcessor) {
      logger.info(`🗑️ Initiating automatic data deletion for user ${userId} due to consent withdrawal`);
      
      // Request automatic data deletion
      await this.components.dataProcessor.requestDataDeletion(userId, {
        deletionScope: 'specific',
        specificDataSources: deletionRequiredCategories,
        reason: 'consent_withdrawal_automatic',
        urgency: 'high'
      });
    }
  }

  async initiateBreachResponse(breachEvent) {
    // Immediate breach response procedures
    const breachId = breachEvent.eventData.breachId;
    
    logger.error(`🚨 Initiating breach response for: ${breachId}`);
    
    // 1. Containment measures
    // 2. Impact assessment
    // 3. Notification preparation (72h deadline)
    // 4. Communication planning
    
    // This would trigger actual breach response procedures
  }

  /**
   * Monitoring and reporting
   */

  startHealthMonitoring() {
    setInterval(async () => {
      try {
        await this.performHealthCheck();
      } catch (error) {
        logger.error(`❌ Health check failed: ${error.message}`);
      }
    }, this.config.integration.healthCheckInterval);
  }

  startComplianceMonitoring() {
    setInterval(async () => {
      try {
        await this.performComplianceCheck();
      } catch (error) {
        logger.error(`❌ Compliance check failed: ${error.message}`);
      }
    }, this.config.integration.complianceCheckInterval);
  }

  startReporting() {
    setInterval(async () => {
      try {
        await this.generateSystemReport();
      } catch (error) {
        logger.error(`❌ System reporting failed: ${error.message}`);
      }
    }, this.config.integration.reportingInterval);
  }

  async performHealthCheck() {
    const healthCheck = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      components: {}
    };
    
    // Check each component
    for (const [name, component] of Object.entries(this.components)) {
      healthCheck.components[name] = {
        status: component && component.initialized ? 'healthy' : 'unhealthy',
        lastActivity: new Date().toISOString(),
        memoryUsage: process.memoryUsage()
      };
    }
    
    // Overall system status
    const unhealthyComponents = Object.values(healthCheck.components)
      .filter(comp => comp.status === 'unhealthy').length;
    
    if (unhealthyComponents > 0) {
      healthCheck.status = 'degraded';
    }
    
    this.systemHealth = healthCheck;
    
    // Emit health status
    this.emit('healthCheck', healthCheck);
  }

  async performComplianceCheck() {
    if (this.components.gdprValidator) {
      const audit = await this.components.gdprValidator.performComplianceAudit({
        type: 'scheduled_compliance_check',
        triggeredBy: 'automated_monitoring'
      });
      
      this.complianceStatus = {
        score: audit.overallCompliance.score,
        status: audit.overallCompliance.status,
        certification: audit.overallCompliance.certification,
        lastAudit: audit.startTime,
        nextAuditDue: audit.nextAuditDate,
        auditId: audit.id
      };
      
      this.emit('complianceChecked', {
        score: audit.overallCompliance.score,
        status: audit.overallCompliance.status,
        audit
      });
    }
  }

  async generateSystemReport() {
    const report = {
      timestamp: new Date().toISOString(),
      systemInfo: {
        name: this.config.systemName,
        version: this.config.version,
        uptime: Date.now() - this.systemHealth.uptime,
        environment: this.config.environment
      },
      healthStatus: this.systemHealth,
      complianceStatus: this.complianceStatus,
      componentStatus: this.getComponentStatus()
    };
    
    logger.info(`📊 System report generated - Compliance: ${this.complianceStatus.score || 'N/A'}%, Health: ${this.systemHealth.status}`);
    
    this.emit('systemReport', report);
    
    return report;
  }

  /**
   * Public API methods
   */

  getSystemStatus() {
    return {
      initialized: this.initialized,
      health: this.systemHealth,
      compliance: this.complianceStatus,
      components: this.getComponentStatus()
    };
  }

  getComponentStatus() {
    const status = {};
    
    for (const [name, component] of Object.entries(this.components)) {
      status[name] = {
        initialized: component && component.initialized,
        active: Boolean(component),
        lastActivity: new Date().toISOString()
      };
    }
    
    return status;
  }

  async requestDataExport(userId, options = {}) {
    if (!this.components.dataProcessor) {
      throw new Error('Data processor not available');
    }
    
    return await this.components.dataProcessor.requestDataExport(userId, options);
  }

  async requestDataDeletion(userId, options = {}) {
    if (!this.components.dataProcessor) {
      throw new Error('Data processor not available');
    }
    
    return await this.components.dataProcessor.requestDataDeletion(userId, options);
  }

  async setUserConsent(userId, consentData, userContext = {}) {
    if (!this.components.consentManager) {
      throw new Error('Consent manager not available');
    }
    
    return await this.components.consentManager.setConsent(userContext, {
      ...consentData,
      userId
    });
  }

  async getUserConsent(userId) {
    if (!this.components.consentManager) {
      throw new Error('Consent manager not available');
    }
    
    return this.components.consentManager.getConsent(userId);
  }

  async generateComplianceReport() {
    if (!this.components.gdprValidator) {
      throw new Error('GDPR validator not available');
    }
    
    return await this.components.gdprValidator.generateComplianceReport();
  }
}

// Export singleton instance
export const gdprComplianceSystem = new GDPRComplianceSystem();

// Export all components
export {
  consentManager,
  dataProcessor,
  auditTrailSystem,
  legalDocumentsGenerator,
  gdprValidator
};

// Main initialization function
export async function initializeGDPRCompliance(options = {}) {
  const system = new GDPRComplianceSystem(options);
  await system.init();
  return system;
}

// Quick start function for simple integration
export async function quickStartGDPR() {
  logger.info('🚀 GDPR Quick Start - Initializing TrustBoost Phase 4...');
  
  const system = await initializeGDPRCompliance({
    environment: process.env.NODE_ENV || 'production',
    integration: {
      autoInitialize: true,
      healthCheckInterval: 30000,
      complianceCheckInterval: 24 * 60 * 60 * 1000
    }
  });
  
  logger.info('✅ TrustBoost Phase 4 - GDPR Compliance System ready!');
  logger.info('🎯 Features: Consent Management, Data Processing, Audit Trail, Legal Docs, Validation');
  logger.info(`📊 Compliance Score: ${system.complianceStatus.score || 'Calculating...'}%`);
  
  return system;
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  quickStartGDPR()
    .then(system => {
      logger.info('🎉 GDPR Compliance System started successfully!');
      
      // Keep process alive for monitoring
      process.on('SIGINT', async () => {
        logger.info('👋 Shutting down GDPR Compliance System...');
        process.exit(0);
      });
    })
    .catch(error => {
      logger.error(`💥 Failed to start GDPR Compliance System: ${error.message}`);
      process.exit(1);
    });
}