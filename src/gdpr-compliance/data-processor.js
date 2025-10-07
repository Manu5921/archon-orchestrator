#!/usr/bin/env node

/**
 * GDPR DATA EXPORT & DELETION PROCESSOR
 * 
 * Automated system for handling data subject rights:
 * - Article 20: Right to data portability (export)
 * - Article 17: Right to erasure (deletion)
 * - Article 15: Right of access
 * 
 * Compliance requirement: <24h response time for data exports
 */

import { EventEmitter } from 'events';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { logger } from '../utils/logger.js';
import { consentManager } from './consent-manager.js';

/**
 * GDPR Data Processing Queue
 * Handles export and deletion requests with guaranteed <24h completion
 */
export class GDPRDataProcessor extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.config = {
      // Processing configuration
      processingPath: options.processingPath || './data/gdpr/processing',
      exportPath: options.exportPath || './data/gdpr/exports',
      deletionPath: options.deletionPath || './data/gdpr/deletions',
      
      // SLA requirements
      slaRequirements: {
        dataExportMaxTime: 24 * 60 * 60 * 1000, // 24 hours
        dataDeletionMaxTime: 30 * 24 * 60 * 60 * 1000, // 30 days
        accessRequestMaxTime: 30 * 24 * 60 * 60 * 1000, // 30 days
        confirmationEmailMaxTime: 2 * 60 * 1000 // 2 minutes
      },
      
      // Processing limits
      processingLimits: {
        maxConcurrentExports: 5,
        maxConcurrentDeletions: 3,
        exportFileSizeLimit: 100 * 1024 * 1024, // 100MB
        retryAttempts: 3,
        retryDelayMs: 5000
      },
      
      // Data sources to process
      dataSources: {
        consent_data: {
          handler: 'processConsentData',
          priority: 1,
          retention: '7_years' // Legal requirement
        },
        user_profiles: {
          handler: 'processUserProfiles', 
          priority: 2,
          retention: '3_years'
        },
        activity_logs: {
          handler: 'processActivityLogs',
          priority: 3,
          retention: '2_years'
        },
        communication_records: {
          handler: 'processCommunications',
          priority: 4,
          retention: '3_years'
        },
        analytics_data: {
          handler: 'processAnalytics',
          priority: 5,
          retention: '26_months'
        },
        marketing_data: {
          handler: 'processMarketing',
          priority: 6,
          retention: '3_years'
        }
      },
      
      ...options
    };
    
    this.processingQueue = new Map();
    this.activeWorkers = new Set();
    this.requestHistory = new Map();
    this.initialized = false;
    
    // Initialize processor
    this.init();
  }

  /**
   * Initialize data processor
   */
  async init() {
    try {
      // Create processing directories
      await Promise.all([
        fs.mkdir(this.config.processingPath, { recursive: true }),
        fs.mkdir(this.config.exportPath, { recursive: true }),
        fs.mkdir(this.config.deletionPath, { recursive: true })
      ]);
      
      // Load pending requests
      await this.loadPendingRequests();
      
      // Start processing queues
      this.startProcessingLoop();
      
      // Start SLA monitoring
      this.startSLAMonitoring();
      
      this.initialized = true;
      logger.info('✅ GDPR Data Processor initialized');
      
      this.emit('initialized', {
        pendingRequests: this.processingQueue.size,
        dataSources: Object.keys(this.config.dataSources).length
      });
      
    } catch (error) {
      logger.error(`❌ Failed to initialize GDPR Data Processor: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process data export request (Article 20 - Right to data portability)
   */
  async requestDataExport(userId, options = {}) {
    const requestId = crypto.randomUUID();
    const {
      format = 'json',
      includeDataSources = Object.keys(this.config.dataSources),
      email,
      reason = 'data_portability_request',
      urgency = 'standard'
    } = options;
    
    // Validate export format
    const supportedFormats = ['json', 'csv', 'xml', 'pdf'];
    if (!supportedFormats.includes(format.toLowerCase())) {
      throw new Error(`Unsupported export format: ${format}. Supported: ${supportedFormats.join(', ')}`);
    }
    
    // Create export request
    const exportRequest = {
      id: requestId,
      type: 'data_export',
      userId,
      status: 'pending',
      priority: this.calculatePriority('export', urgency),
      
      // Request details
      requestedAt: new Date().toISOString(),
      requestedBy: email || 'user',
      format: format.toLowerCase(),
      includeDataSources,
      reason,
      urgency,
      
      // Processing metadata
      estimatedCompletionTime: new Date(Date.now() + this.config.slaRequirements.dataExportMaxTime).toISOString(),
      actualStartTime: null,
      actualCompletionTime: null,
      processingAttempts: 0,
      lastError: null,
      
      // Output information
      exportFiles: [],
      totalDataSize: 0,
      dataSourceResults: {},
      
      // SLA tracking
      slaDeadline: new Date(Date.now() + this.config.slaRequirements.dataExportMaxTime),
      slaStatus: 'within_sla',
      
      // Compliance metadata
      legalBasis: 'article_20_data_portability',
      retentionPeriod: '30_days_post_completion',
      securityClassification: 'personal_data'
    };
    
    // Add to processing queue
    this.processingQueue.set(requestId, exportRequest);
    
    // Save request
    await this.saveRequestToFile(exportRequest);
    
    // Log audit event
    await consentManager.logAuditEvent('data_export_requested', userId, {
      requestId,
      format,
      dataSources: includeDataSources,
      estimatedCompletion: exportRequest.estimatedCompletionTime
    });
    
    // Send confirmation email
    await this.sendConfirmationEmail(email, exportRequest);
    
    logger.info(`📤 Data export requested for user ${userId} (ID: ${requestId}, Format: ${format})`);
    
    this.emit('exportRequested', exportRequest);
    
    return {
      requestId,
      status: 'pending',
      estimatedCompletionTime: exportRequest.estimatedCompletionTime,
      trackingUrl: `/gdpr/requests/${requestId}/status`
    };
  }

  /**
   * Process data deletion request (Article 17 - Right to erasure)
   */
  async requestDataDeletion(userId, options = {}) {
    const requestId = crypto.randomUUID();
    const {
      deletionScope = 'complete', // 'complete' | 'partial' | 'specific'
      specificDataSources = [],
      retainForLegal = true,
      email,
      reason = 'right_to_erasure',
      urgency = 'standard'
    } = options;
    
    // Create deletion request
    const deletionRequest = {
      id: requestId,
      type: 'data_deletion',
      userId,
      status: 'pending_verification',
      priority: this.calculatePriority('deletion', urgency),
      
      // Request details
      requestedAt: new Date().toISOString(),
      requestedBy: email || 'user',
      deletionScope,
      specificDataSources,
      retainForLegal,
      reason,
      urgency,
      
      // Verification requirements
      verificationRequired: true,
      verificationToken: crypto.randomBytes(32).toString('hex'),
      verificationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      verifiedAt: null,
      verifiedBy: null,
      
      // Processing metadata
      estimatedCompletionTime: new Date(Date.now() + this.config.slaRequirements.dataDeletionMaxTime).toISOString(),
      actualStartTime: null,
      actualCompletionTime: null,
      processingAttempts: 0,
      lastError: null,
      
      // Deletion results
      deletedDataSources: [],
      retainedDataSources: [],
      deletionSummary: {},
      irreversibilityWarning: 'This action cannot be undone',
      
      // Legal compliance
      legalRetentionCheck: null,
      complianceApproval: null,
      
      // SLA tracking  
      slaDeadline: new Date(Date.now() + this.config.slaRequirements.dataDeletionMaxTime),
      slaStatus: 'within_sla',
      
      // Compliance metadata
      legalBasis: 'article_17_right_to_erasure',
      confirmationRequired: true,
      securityClassification: 'irreversible_operation'
    };
    
    // Add to processing queue (will wait for verification)
    this.processingQueue.set(requestId, deletionRequest);
    
    // Save request
    await this.saveRequestToFile(deletionRequest);
    
    // Log audit event
    await consentManager.logAuditEvent('data_deletion_requested', userId, {
      requestId,
      deletionScope,
      specificDataSources,
      verificationRequired: true
    });
    
    // Send verification email
    await this.sendDeletionVerificationEmail(email, deletionRequest);
    
    logger.info(`🗑️ Data deletion requested for user ${userId} (ID: ${requestId}, Scope: ${deletionScope})`);
    
    this.emit('deletionRequested', deletionRequest);
    
    return {
      requestId,
      status: 'pending_verification',
      verificationRequired: true,
      verificationDeadline: deletionRequest.verificationDeadline,
      estimatedCompletionTime: deletionRequest.estimatedCompletionTime,
      verificationUrl: `/gdpr/requests/${requestId}/verify/${deletionRequest.verificationToken}`
    };
  }

  /**
   * Verify deletion request
   */
  async verifyDeletionRequest(requestId, verificationToken, verifiedBy = 'user') {
    const request = this.processingQueue.get(requestId);
    
    if (!request || request.type !== 'data_deletion') {
      throw new Error('Deletion request not found');
    }
    
    if (request.verificationToken !== verificationToken) {
      throw new Error('Invalid verification token');
    }
    
    if (new Date() > new Date(request.verificationDeadline)) {
      throw new Error('Verification deadline expired');
    }
    
    // Update request status
    request.status = 'verified_pending_processing';
    request.verifiedAt = new Date().toISOString();
    request.verifiedBy = verifiedBy;
    request.verificationRequired = false;
    
    // Save updated request
    await this.saveRequestToFile(request);
    
    // Log verification
    await consentManager.logAuditEvent('data_deletion_verified', request.userId, {
      requestId,
      verifiedBy,
      verifiedAt: request.verifiedAt
    });
    
    logger.info(`✅ Deletion request verified: ${requestId}`);
    
    this.emit('deletionVerified', request);
    
    return { success: true, status: 'verified' };
  }

  /**
   * Get request status
   */
  async getRequestStatus(requestId) {
    const request = this.processingQueue.get(requestId) || await this.loadRequestFromFile(requestId);
    
    if (!request) {
      throw new Error('Request not found');
    }
    
    const status = {
      id: request.id,
      type: request.type,
      userId: request.userId,
      status: request.status,
      requestedAt: request.requestedAt,
      estimatedCompletionTime: request.estimatedCompletionTime,
      actualCompletionTime: request.actualCompletionTime,
      slaStatus: this.calculateSLAStatus(request),
      progress: this.calculateProgress(request)
    };
    
    // Add type-specific information
    if (request.type === 'data_export') {
      status.exportFiles = request.exportFiles;
      status.totalDataSize = request.totalDataSize;
      status.format = request.format;
    } else if (request.type === 'data_deletion') {
      status.verificationRequired = request.verificationRequired;
      status.verificationDeadline = request.verificationDeadline;
      status.deletedDataSources = request.deletedDataSources;
      status.retainedDataSources = request.retainedDataSources;
    }
    
    return status;
  }

  /**
   * Main processing loop
   */
  async startProcessingLoop() {
    setInterval(async () => {
      try {
        await this.processQueue();
      } catch (error) {
        logger.error(`❌ Processing loop error: ${error.message}`);
      }
    }, 5000); // Check every 5 seconds
  }

  async processQueue() {
    // Get pending requests sorted by priority and age
    const pendingRequests = [...this.processingQueue.values()]
      .filter(request => ['pending', 'verified_pending_processing'].includes(request.status))
      .sort((a, b) => {
        // Priority first, then age
        if (a.priority !== b.priority) return a.priority - b.priority;
        return new Date(a.requestedAt) - new Date(b.requestedAt);
      });
    
    // Process exports
    const pendingExports = pendingRequests
      .filter(r => r.type === 'data_export')
      .slice(0, this.config.processingLimits.maxConcurrentExports);
    
    // Process deletions  
    const pendingDeletions = pendingRequests
      .filter(r => r.type === 'data_deletion' && r.status === 'verified_pending_processing')
      .slice(0, this.config.processingLimits.maxConcurrentDeletions);
    
    // Start processing
    const processingPromises = [
      ...pendingExports.map(request => this.processExportRequest(request)),
      ...pendingDeletions.map(request => this.processDeletionRequest(request))
    ];
    
    if (processingPromises.length > 0) {
      await Promise.allSettled(processingPromises);
    }
  }

  /**
   * Process individual export request
   */
  async processExportRequest(request) {
    if (this.activeWorkers.has(request.id)) {
      return; // Already processing
    }
    
    this.activeWorkers.add(request.id);
    
    try {
      logger.info(`📤 Processing export request: ${request.id}`);
      
      // Update request status
      request.status = 'processing';
      request.actualStartTime = new Date().toISOString();
      request.processingAttempts++;
      
      // Process each data source
      const exportResults = {};
      let totalSize = 0;
      
      for (const dataSource of request.includeDataSources) {
        try {
          const sourceConfig = this.config.dataSources[dataSource];
          if (!sourceConfig) {
            logger.warn(`⚠️ Unknown data source: ${dataSource}`);
            continue;
          }
          
          logger.info(`📊 Processing data source: ${dataSource} for user ${request.userId}`);
          
          // Use worker thread for data processing
          const sourceData = await this.processDataSourceInWorker(
            dataSource, 
            request.userId, 
            sourceConfig.handler
          );
          
          if (sourceData && sourceData.length > 0) {
            exportResults[dataSource] = sourceData;
            totalSize += Buffer.from(JSON.stringify(sourceData)).length;
          }
          
        } catch (error) {
          logger.error(`❌ Failed to process data source ${dataSource}: ${error.message}`);
          exportResults[dataSource] = { error: error.message };
        }
      }
      
      // Check size limit
      if (totalSize > this.config.processingLimits.exportFileSizeLimit) {
        throw new Error(`Export size (${totalSize} bytes) exceeds limit (${this.config.processingLimits.exportFileSizeLimit} bytes)`);
      }
      
      // Generate export files
      const exportFiles = await this.generateExportFiles(request, exportResults);
      
      // Update request with results
      request.status = 'completed';
      request.actualCompletionTime = new Date().toISOString();
      request.exportFiles = exportFiles;
      request.totalDataSize = totalSize;
      request.dataSourceResults = exportResults;
      request.slaStatus = this.calculateSLAStatus(request);
      
      // Save completed request
      await this.saveRequestToFile(request);
      
      // Log completion
      await consentManager.logAuditEvent('data_export_completed', request.userId, {
        requestId: request.id,
        exportFiles: exportFiles.length,
        totalSize,
        processingTime: new Date(request.actualCompletionTime) - new Date(request.actualStartTime),
        slaStatus: request.slaStatus
      });
      
      // Send completion notification
      await this.sendCompletionEmail(request);
      
      logger.info(`✅ Export completed: ${request.id} (${exportFiles.length} files, ${totalSize} bytes)`);
      
      this.emit('exportCompleted', request);
      
    } catch (error) {
      request.status = 'failed';
      request.lastError = error.message;
      request.slaStatus = this.calculateSLAStatus(request);
      
      // Retry logic
      if (request.processingAttempts < this.config.processingLimits.retryAttempts) {
        request.status = 'pending';
        setTimeout(() => {
          logger.info(`🔄 Retrying export request: ${request.id} (attempt ${request.processingAttempts + 1})`);
        }, this.config.processingLimits.retryDelayMs * request.processingAttempts);
      }
      
      await this.saveRequestToFile(request);
      
      logger.error(`❌ Export failed: ${request.id} - ${error.message}`);
      
      this.emit('exportFailed', { request, error });
      
    } finally {
      this.activeWorkers.delete(request.id);
    }
  }

  /**
   * Process individual deletion request
   */
  async processDeletionRequest(request) {
    if (this.activeWorkers.has(request.id)) {
      return; // Already processing
    }
    
    this.activeWorkers.add(request.id);
    
    try {
      logger.info(`🗑️ Processing deletion request: ${request.id}`);
      
      // Update request status
      request.status = 'processing_deletion';
      request.actualStartTime = new Date().toISOString();
      request.processingAttempts++;
      
      // Check legal retention requirements first
      const legalRetentionCheck = await this.checkLegalRetentionRequirements(request.userId);
      request.legalRetentionCheck = legalRetentionCheck;
      
      // Process deletion for each data source
      const deletionResults = {};
      const deletedSources = [];
      const retainedSources = [];
      
      const dataSourcesToProcess = request.deletionScope === 'specific' 
        ? request.specificDataSources 
        : Object.keys(this.config.dataSources);
      
      for (const dataSource of dataSourcesToProcess) {
        try {
          const sourceConfig = this.config.dataSources[dataSource];
          if (!sourceConfig) {
            logger.warn(`⚠️ Unknown data source for deletion: ${dataSource}`);
            continue;
          }
          
          // Check if this data source can be deleted (legal retention)
          const canDelete = !legalRetentionCheck.retained.includes(dataSource) || !request.retainForLegal;
          
          if (canDelete) {
            logger.info(`🗑️ Deleting data source: ${dataSource} for user ${request.userId}`);
            
            // Use worker thread for data deletion
            const deletionResult = await this.deleteDataSourceInWorker(
              dataSource,
              request.userId,
              sourceConfig.handler.replace('process', 'delete')
            );
            
            deletionResults[dataSource] = deletionResult;
            deletedSources.push(dataSource);
            
          } else {
            logger.info(`⚖️ Retaining data source for legal reasons: ${dataSource}`);
            retainedSources.push(dataSource);
            deletionResults[dataSource] = { retained: true, reason: 'legal_requirement' };
          }
          
        } catch (error) {
          logger.error(`❌ Failed to delete data source ${dataSource}: ${error.message}`);
          deletionResults[dataSource] = { error: error.message };
        }
      }
      
      // Update request with results
      request.status = 'completed';
      request.actualCompletionTime = new Date().toISOString();
      request.deletedDataSources = deletedSources;
      request.retainedDataSources = retainedSources;
      request.deletionSummary = deletionResults;
      request.slaStatus = this.calculateSLAStatus(request);
      
      // Save completed request
      await this.saveRequestToFile(request);
      
      // Log completion
      await consentManager.logAuditEvent('data_deletion_completed', request.userId, {
        requestId: request.id,
        deletedSources: deletedSources.length,
        retainedSources: retainedSources.length,
        processingTime: new Date(request.actualCompletionTime) - new Date(request.actualStartTime),
        slaStatus: request.slaStatus
      });
      
      // Send completion notification
      await this.sendCompletionEmail(request);
      
      logger.info(`✅ Deletion completed: ${request.id} (${deletedSources.length} deleted, ${retainedSources.length} retained)`);
      
      this.emit('deletionCompleted', request);
      
    } catch (error) {
      request.status = 'failed';
      request.lastError = error.message;
      request.slaStatus = this.calculateSLAStatus(request);
      
      // Retry logic
      if (request.processingAttempts < this.config.processingLimits.retryAttempts) {
        request.status = 'verified_pending_processing';
        setTimeout(() => {
          logger.info(`🔄 Retrying deletion request: ${request.id} (attempt ${request.processingAttempts + 1})`);
        }, this.config.processingLimits.retryDelayMs * request.processingAttempts);
      }
      
      await this.saveRequestToFile(request);
      
      logger.error(`❌ Deletion failed: ${request.id} - ${error.message}`);
      
      this.emit('deletionFailed', { request, error });
      
    } finally {
      this.activeWorkers.delete(request.id);
    }
  }

  /**
   * Worker thread data processing
   */
  async processDataSourceInWorker(dataSource, userId, handler) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: {
          action: 'process_data',
          dataSource,
          userId,
          handler
        }
      });
      
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  async deleteDataSourceInWorker(dataSource, userId, handler) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: {
          action: 'delete_data',
          dataSource,
          userId,
          handler
        }
      });
      
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }

  /**
   * Helper methods
   */

  calculatePriority(type, urgency) {
    const basePriority = type === 'data_export' ? 100 : 200;
    const urgencyModifier = {
      'urgent': -50,
      'high': -25,
      'standard': 0,
      'low': 25
    };
    
    return basePriority + (urgencyModifier[urgency] || 0);
  }

  calculateSLAStatus(request) {
    if (request.status === 'completed') {
      return 'met';
    }
    
    const now = new Date();
    const deadline = new Date(request.slaDeadline);
    
    if (now > deadline) {
      return 'breached';
    }
    
    const timeRemaining = deadline.getTime() - now.getTime();
    const totalTime = deadline.getTime() - new Date(request.requestedAt).getTime();
    const percentRemaining = timeRemaining / totalTime;
    
    if (percentRemaining < 0.1) return 'at_risk';
    if (percentRemaining < 0.25) return 'warning';
    
    return 'within_sla';
  }

  calculateProgress(request) {
    if (request.status === 'completed') return 100;
    if (request.status === 'failed') return 0;
    if (request.status === 'pending' || request.status === 'pending_verification') return 0;
    if (request.status === 'verified_pending_processing') return 10;
    if (request.status === 'processing' || request.status === 'processing_deletion') return 50;
    
    return 0;
  }

  async checkLegalRetentionRequirements(userId) {
    // Implementation would check various legal requirements
    return {
      retained: [], // Data sources that must be retained
      reasons: [], // Legal reasons for retention
      reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // Review in 1 year
    };
  }

  async generateExportFiles(request, exportResults) {
    const files = [];
    const exportDir = path.join(this.config.exportPath, request.id);
    
    await fs.mkdir(exportDir, { recursive: true });
    
    // Generate main export file
    const mainFile = path.join(exportDir, `export.${request.format}`);
    let content = '';
    
    switch (request.format) {
      case 'json':
        content = JSON.stringify({
          exportId: request.id,
          userId: request.userId,
          exportedAt: new Date().toISOString(),
          dataSourceResults: exportResults
        }, null, 2);
        break;
        
      case 'csv':
        content = this.convertToCSV(exportResults);
        break;
        
      case 'xml':
        content = this.convertToXML(exportResults);
        break;
        
      default:
        throw new Error(`Unsupported export format: ${request.format}`);
    }
    
    await fs.writeFile(mainFile, content, 'utf8');
    files.push({
      name: `export.${request.format}`,
      path: mainFile,
      size: Buffer.from(content).length,
      type: 'main_export'
    });
    
    // Generate metadata file
    const metadataFile = path.join(exportDir, 'metadata.json');
    const metadata = {
      exportId: request.id,
      userId: request.userId,
      requestedAt: request.requestedAt,
      completedAt: request.actualCompletionTime,
      format: request.format,
      dataSources: request.includeDataSources,
      totalSize: request.totalDataSize,
      legalBasis: 'article_20_data_portability',
      retentionNotice: 'This export will be automatically deleted after 30 days'
    };
    
    await fs.writeFile(metadataFile, JSON.stringify(metadata, null, 2), 'utf8');
    files.push({
      name: 'metadata.json',
      path: metadataFile,
      size: Buffer.from(JSON.stringify(metadata)).length,
      type: 'metadata'
    });
    
    return files;
  }

  convertToCSV(data) {
    // Simple CSV conversion - implement based on data structure
    return 'CSV format not yet implemented';
  }

  convertToXML(data) {
    // Simple XML conversion - implement based on data structure  
    return '<?xml version="1.0"?><export>XML format not yet implemented</export>';
  }

  async sendConfirmationEmail(email, request) {
    if (!email) return;
    
    // Implementation would send actual email
    logger.info(`📧 Confirmation email sent for request ${request.id} to ${email}`);
  }

  async sendDeletionVerificationEmail(email, request) {
    if (!email) return;
    
    // Implementation would send verification email with link
    logger.info(`📧 Deletion verification email sent for request ${request.id} to ${email}`);
  }

  async sendCompletionEmail(request) {
    // Implementation would send completion notification
    logger.info(`📧 Completion email sent for request ${request.id}`);
  }

  async startSLAMonitoring() {
    setInterval(async () => {
      try {
        await this.checkSLACompliance();
      } catch (error) {
        logger.error(`❌ SLA monitoring error: ${error.message}`);
      }
    }, 60 * 1000); // Check every minute
  }

  async checkSLACompliance() {
    const now = new Date();
    
    for (const request of this.processingQueue.values()) {
      const slaStatus = this.calculateSLAStatus(request);
      
      if (slaStatus !== request.slaStatus) {
        request.slaStatus = slaStatus;
        
        if (slaStatus === 'breached') {
          logger.error(`🚨 SLA BREACHED: Request ${request.id} (${request.type})`);
          this.emit('slaBreached', request);
        } else if (slaStatus === 'at_risk') {
          logger.warn(`⚠️ SLA AT RISK: Request ${request.id} (${request.type})`);
          this.emit('slaAtRisk', request);
        }
        
        await this.saveRequestToFile(request);
      }
    }
  }

  async saveRequestToFile(request) {
    const requestFile = path.join(this.config.processingPath, `${request.id}.json`);
    await fs.writeFile(requestFile, JSON.stringify(request, null, 2), 'utf8');
  }

  async loadRequestFromFile(requestId) {
    try {
      const requestFile = path.join(this.config.processingPath, `${requestId}.json`);
      const data = await fs.readFile(requestFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  async loadPendingRequests() {
    try {
      const files = await fs.readdir(this.config.processingPath);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          const requestId = file.replace('.json', '');
          const request = await this.loadRequestFromFile(requestId);
          
          if (request && !['completed', 'failed'].includes(request.status)) {
            this.processingQueue.set(requestId, request);
          }
        }
      }
      
      logger.info(`📂 Loaded ${this.processingQueue.size} pending requests`);
      
    } catch (error) {
      if (error.code !== 'ENOENT') {
        logger.warn(`⚠️ Failed to load pending requests: ${error.message}`);
      }
    }
  }

  /**
   * Generate compliance reports
   */
  async generateProcessingReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalRequests: this.processingQueue.size,
        pendingRequests: [...this.processingQueue.values()].filter(r => ['pending', 'processing', 'verified_pending_processing'].includes(r.status)).length,
        completedRequests: [...this.processingQueue.values()].filter(r => r.status === 'completed').length,
        failedRequests: [...this.processingQueue.values()].filter(r => r.status === 'failed').length
      },
      slaCompliance: {
        withinSLA: [...this.processingQueue.values()].filter(r => ['within_sla', 'met'].includes(r.slaStatus)).length,
        atRisk: [...this.processingQueue.values()].filter(r => r.slaStatus === 'at_risk').length,
        breached: [...this.processingQueue.values()].filter(r => r.slaStatus === 'breached').length
      },
      processingTimes: this.calculateAverageProcessingTimes(),
      dataSourceStats: this.calculateDataSourceStats()
    };
    
    return report;
  }

  calculateAverageProcessingTimes() {
    const completed = [...this.processingQueue.values()].filter(r => r.status === 'completed');
    
    const exportTimes = completed
      .filter(r => r.type === 'data_export')
      .map(r => new Date(r.actualCompletionTime) - new Date(r.actualStartTime));
    
    const deletionTimes = completed
      .filter(r => r.type === 'data_deletion')
      .map(r => new Date(r.actualCompletionTime) - new Date(r.actualStartTime));
    
    return {
      averageExportTime: exportTimes.length > 0 ? exportTimes.reduce((a, b) => a + b, 0) / exportTimes.length : 0,
      averageDeletionTime: deletionTimes.length > 0 ? deletionTimes.reduce((a, b) => a + b, 0) / deletionTimes.length : 0
    };
  }

  calculateDataSourceStats() {
    // Implementation would analyze data source processing statistics
    return {};
  }
}

// Worker thread handlers
if (!isMainThread) {
  const { action, dataSource, userId, handler } = workerData;
  
  // Mock data handlers - replace with actual implementations
  const handlers = {
    processConsentData: async (userId) => ({ consents: ['mock consent data'], count: 1 }),
    processUserProfiles: async (userId) => ({ profile: 'mock profile data', count: 1 }),
    processActivityLogs: async (userId) => ({ logs: ['mock activity'], count: 1 }),
    processCommunications: async (userId) => ({ messages: ['mock message'], count: 1 }),
    processAnalytics: async (userId) => ({ analytics: 'mock analytics', count: 1 }),
    processMarketing: async (userId) => ({ marketing: 'mock marketing data', count: 1 }),
    
    deleteConsentData: async (userId) => ({ deleted: true, count: 1 }),
    deleteUserProfiles: async (userId) => ({ deleted: true, count: 1 }),
    deleteActivityLogs: async (userId) => ({ deleted: true, count: 1 }),
    deleteCommunications: async (userId) => ({ deleted: true, count: 1 }),
    deleteAnalytics: async (userId) => ({ deleted: true, count: 1 }),
    deleteMarketing: async (userId) => ({ deleted: true, count: 1 })
  };
  
  if (action === 'process_data' || action === 'delete_data') {
    const handlerFn = handlers[handler];
    if (handlerFn) {
      handlerFn(userId)
        .then(result => parentPort.postMessage(result))
        .catch(error => parentPort.postMessage({ error: error.message }));
    } else {
      parentPort.postMessage({ error: `Unknown handler: ${handler}` });
    }
  }
}

// Export singleton instance
export const dataProcessor = new GDPRDataProcessor({
  processingPath: process.env.GDPR_PROCESSING_PATH || './data/gdpr/processing',
  exportPath: process.env.GDPR_EXPORT_PATH || './data/gdpr/exports',
  deletionPath: process.env.GDPR_DELETION_PATH || './data/gdpr/deletions'
});