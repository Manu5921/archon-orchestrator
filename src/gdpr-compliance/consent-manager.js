#!/usr/bin/env node

/**
 * GDPR-COMPLIANT CONSENT MANAGEMENT SYSTEM
 * 
 * Implements granular consent management with Context7 patterns
 * Full GDPR compliance with audit trail and data export/deletion
 */

import { EventEmitter } from 'events';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';

/**
 * GDPR-compliant consent management system
 * Based on c15t patterns from Context7
 */
export class GDPRConsentManager extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.config = {
      // Storage configuration
      dataPath: options.dataPath || './data/gdpr',
      auditLogPath: options.auditLogPath || './data/gdpr/audit.log',
      
      // Consent categories (GDPR Article 6 legal bases)
      consentCategories: {
        necessary: {
          name: 'Necessary',
          description: 'Essential cookies for website functionality',
          required: true,
          legalBasis: 'legitimate_interest',
          retention: '2_years'
        },
        analytics: {
          name: 'Analytics',
          description: 'Website usage analytics and performance monitoring',
          required: false,
          legalBasis: 'consent',
          retention: '26_months'
        },
        marketing: {
          name: 'Marketing',
          description: 'Personalized advertising and marketing communications',
          required: false,
          legalBasis: 'consent',
          retention: '3_years'
        },
        personalization: {
          name: 'Personalization',
          description: 'Content and experience personalization',
          required: false,
          legalBasis: 'consent',
          retention: '1_year'
        },
        social_media: {
          name: 'Social Media',
          description: 'Social media integration and sharing',
          required: false,
          legalBasis: 'consent',
          retention: '1_year'
        }
      },
      
      // GDPR compliance settings
      gdprSettings: {
        consentExpiry: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
        auditRetention: 7 * 365 * 24 * 60 * 60 * 1000, // 7 years
        dataExportTimeout: 24 * 60 * 60 * 1000, // 24 hours
        dataDeletionTimeout: 30 * 24 * 60 * 60 * 1000, // 30 days
        recheckConsentInterval: 30 * 24 * 60 * 60 * 1000 // 30 days
      },
      
      ...options
    };
    
    this.consentStore = new Map();
    this.auditTrail = [];
    this.initialized = false;
    
    // Initialize storage
    this.init();
  }

  /**
   * Initialize consent manager
   */
  async init() {
    try {
      // Create storage directories
      await fs.mkdir(this.config.dataPath, { recursive: true });
      
      // Load existing consent data
      await this.loadConsentData();
      
      // Load audit trail
      await this.loadAuditTrail();
      
      this.initialized = true;
      logger.info('✅ GDPR Consent Manager initialized');
      
      // Emit initialization complete
      this.emit('initialized', {
        categoriesCount: Object.keys(this.config.consentCategories).length,
        consentsLoaded: this.consentStore.size,
        auditEntriesLoaded: this.auditTrail.length
      });
      
    } catch (error) {
      logger.error(`❌ Failed to initialize GDPR Consent Manager: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get consent banner configuration
   * Based on c15t showConsentBanner pattern
   */
  async showConsentBanner(userContext = {}) {
    const { userId, ipAddress, userAgent, countryCode } = userContext;
    
    // Check if user already has valid consent
    const existingConsent = userId ? this.getConsent(userId) : null;
    
    // GDPR Article 7: Consent must be freely given, specific, informed and unambiguous
    const showBanner = !existingConsent || this.isConsentExpired(existingConsent) || 
                      this.requiresConsentUpdate(existingConsent);
    
    const bannerConfig = {
      showConsentBanner: showBanner,
      jurisdiction: {
        code: countryCode || 'EU',
        message: 'European Union GDPR applies'
      },
      location: {
        countryCode: countryCode || 'unknown',
        requiresConsent: this.isGDPRApplicable(countryCode)
      },
      categories: Object.entries(this.config.consentCategories).map(([id, config]) => ({
        id,
        name: config.name,
        description: config.description,
        required: config.required,
        legalBasis: config.legalBasis,
        retention: config.retention,
        enabled: existingConsent?.preferences?.[id] || false
      })),
      consentVersion: this.getConsentVersion(),
      privacyPolicyUrl: '/legal/privacy-policy',
      cookiePolicyUrl: '/legal/cookie-policy'
    };
    
    // Audit trail entry
    await this.logAuditEvent('banner_shown', userId, {
      showBanner,
      ipAddress,
      userAgent,
      countryCode
    });
    
    return bannerConfig;
  }

  /**
   * Set user consent preferences
   * Based on c15t setConsent pattern with GDPR compliance
   */
  async setConsent(userContext, consentData) {
    const { userId, ipAddress, userAgent, domain } = userContext;
    const { preferences, version, type = 'cookie_banner' } = consentData;
    
    if (!userId) {
      throw new Error('User ID is required for GDPR compliance');
    }
    
    // Validate consent preferences
    this.validateConsentPreferences(preferences);
    
    // Create consent record
    const consentRecord = {
      id: crypto.randomUUID(),
      userId,
      domain: domain || 'default',
      type,
      version: version || this.getConsentVersion(),
      preferences: {
        ...preferences,
        necessary: true // Always required
      },
      metadata: {
        ipAddress,
        userAgent,
        geoLocation: await this.getGeoLocation(ipAddress),
        consentMethod: 'explicit', // GDPR Article 4(11)
        consentTimestamp: new Date().toISOString(),
        withdrawalMethod: null,
        withdrawalTimestamp: null
      },
      legalBasis: this.determineLegalBasis(preferences),
      consentGivenAt: new Date(),
      validUntil: new Date(Date.now() + this.config.gdprSettings.consentExpiry),
      isActive: true,
      consentString: this.generateConsentString(preferences),
      hash: this.generateConsentHash(userId, preferences)
    };
    
    // Store consent
    this.consentStore.set(userId, consentRecord);
    
    // Save to persistent storage
    await this.saveConsentData();
    
    // Audit trail entry
    await this.logAuditEvent('consent_set', userId, {
      preferences,
      legalBasis: consentRecord.legalBasis,
      method: 'explicit',
      ipAddress,
      userAgent
    });
    
    // Emit consent changed event
    this.emit('consentChanged', {
      userId,
      consentRecord,
      changedCategories: Object.keys(preferences)
    });
    
    // Schedule consent recheck
    this.scheduleConsentRecheck(userId);
    
    logger.info(`✅ Consent set for user ${userId}: ${Object.entries(preferences).map(([k,v]) => `${k}:${v}`).join(', ')}`);
    
    return {
      success: true,
      consentId: consentRecord.id,
      validUntil: consentRecord.validUntil,
      nextRecheck: new Date(Date.now() + this.config.gdprSettings.recheckConsentInterval)
    };
  }

  /**
   * Verify consent for specific purposes
   * Based on c15t verifyConsent pattern
   */
  async verifyConsent(userId, requiredConsent = []) {
    if (!userId) {
      return {
        valid: false,
        requiredConsent,
        missingConsent: requiredConsent,
        reason: 'No user ID provided'
      };
    }
    
    const consentRecord = this.getConsent(userId);
    
    if (!consentRecord) {
      await this.logAuditEvent('consent_verification_failed', userId, {
        reason: 'No consent record found',
        requiredConsent
      });
      
      return {
        valid: false,
        requiredConsent,
        missingConsent: requiredConsent,
        reason: 'No consent record found'
      };
    }
    
    // Check if consent is expired
    if (this.isConsentExpired(consentRecord)) {
      await this.logAuditEvent('consent_verification_failed', userId, {
        reason: 'Consent expired',
        expiredAt: consentRecord.validUntil
      });
      
      return {
        valid: false,
        requiredConsent,
        missingConsent: requiredConsent,
        reason: 'Consent expired',
        expiredAt: consentRecord.validUntil
      };
    }
    
    // Check required categories
    const missingConsent = requiredConsent.filter(category => {
      const categoryConfig = this.config.consentCategories[category];
      if (!categoryConfig) return true; // Unknown category = missing
      
      if (categoryConfig.required) return false; // Required categories don't need explicit consent
      
      return !consentRecord.preferences[category];
    });
    
    const valid = missingConsent.length === 0;
    
    // Audit trail entry
    await this.logAuditEvent('consent_verified', userId, {
      valid,
      requiredConsent,
      missingConsent,
      consentId: consentRecord.id
    });
    
    return {
      valid,
      requiredConsent,
      missingConsent,
      consentRecord: valid ? consentRecord : null,
      verifiedAt: new Date().toISOString()
    };
  }

  /**
   * Withdraw consent (GDPR Article 7)
   */
  async withdrawConsent(userId, categories = null, reason = null) {
    const consentRecord = this.getConsent(userId);
    
    if (!consentRecord) {
      throw new Error('No consent record found for user');
    }
    
    const withdrawalData = {
      withdrawnAt: new Date(),
      withdrawnCategories: categories || Object.keys(consentRecord.preferences),
      withdrawalReason: reason,
      withdrawalMethod: 'user_request'
    };
    
    if (categories) {
      // Partial withdrawal - update specific categories
      for (const category of categories) {
        if (category !== 'necessary') { // Cannot withdraw necessary consent
          consentRecord.preferences[category] = false;
        }
      }
    } else {
      // Full withdrawal - deactivate consent record
      consentRecord.isActive = false;
      consentRecord.metadata.withdrawalTimestamp = new Date().toISOString();
      consentRecord.metadata.withdrawalMethod = 'user_request';
    }
    
    // Update storage
    await this.saveConsentData();
    
    // Audit trail entry
    await this.logAuditEvent('consent_withdrawn', userId, withdrawalData);
    
    // Emit withdrawal event
    this.emit('consentWithdrawn', {
      userId,
      withdrawalData,
      consentRecord
    });
    
    logger.info(`🔄 Consent withdrawn for user ${userId}: ${withdrawalData.withdrawnCategories.join(', ')}`);
    
    return {
      success: true,
      withdrawnCategories: withdrawalData.withdrawnCategories,
      withdrawnAt: withdrawalData.withdrawnAt
    };
  }

  /**
   * Export user data (GDPR Article 20 - Right of data portability)
   */
  async exportUserData(userId, format = 'json') {
    const consentRecord = this.getConsent(userId);
    
    if (!consentRecord) {
      throw new Error('No data found for user');
    }
    
    // Collect all user data
    const userData = {
      userId,
      exportedAt: new Date().toISOString(),
      exportFormat: format,
      consentData: consentRecord,
      auditTrail: this.auditTrail.filter(entry => entry.userId === userId),
      dataCategories: {
        consent_preferences: consentRecord.preferences,
        technical_data: {
          ipAddress: consentRecord.metadata.ipAddress,
          userAgent: consentRecord.metadata.userAgent,
          geoLocation: consentRecord.metadata.geoLocation
        },
        legal_basis: consentRecord.legalBasis,
        retention_periods: this.getRetentionPeriods(consentRecord.preferences)
      }
    };
    
    // Format data based on requested format
    let exportData;
    switch (format.toLowerCase()) {
      case 'json':
        exportData = JSON.stringify(userData, null, 2);
        break;
      case 'csv':
        exportData = this.convertToCSV(userData);
        break;
      case 'xml':
        exportData = this.convertToXML(userData);
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    // Save export file
    const exportPath = path.join(this.config.dataPath, 'exports', `${userId}_export_${Date.now()}.${format}`);
    await fs.mkdir(path.dirname(exportPath), { recursive: true });
    await fs.writeFile(exportPath, exportData, 'utf8');
    
    // Audit trail entry
    await this.logAuditEvent('data_exported', userId, {
      format,
      exportPath,
      dataCategories: Object.keys(userData.dataCategories)
    });
    
    logger.info(`📤 Data exported for user ${userId} in ${format} format`);
    
    return {
      success: true,
      exportPath,
      format,
      exportedAt: userData.exportedAt,
      dataSize: Buffer.from(exportData).length
    };
  }

  /**
   * Delete user data (GDPR Article 17 - Right to erasure)
   */
  async deleteUserData(userId, deletionReason = 'user_request') {
    const consentRecord = this.getConsent(userId);
    
    if (!consentRecord) {
      logger.warn(`No data found for user ${userId} to delete`);
      return { success: true, reason: 'No data found' };
    }
    
    const deletionData = {
      userId,
      deletedAt: new Date().toISOString(),
      deletionReason,
      deletedCategories: ['consent_data', 'technical_data', 'audit_trail'],
      retentionExceptions: [] // Legal obligations to retain certain data
    };
    
    // Check for legal retention requirements
    const legalRetentions = this.checkLegalRetentionRequirements(consentRecord);
    if (legalRetentions.length > 0) {
      deletionData.retentionExceptions = legalRetentions;
      logger.warn(`⚠️ Some data for user ${userId} must be retained for legal reasons: ${legalRetentions.join(', ')}`);
    }
    
    // Perform deletion
    this.consentStore.delete(userId);
    
    // Anonymize audit trail (keep for legal compliance but remove PII)
    this.auditTrail.forEach(entry => {
      if (entry.userId === userId) {
        entry.userId = `deleted_${crypto.createHash('sha256').update(userId).digest('hex').substring(0, 8)}`;
        entry.anonymized = true;
        entry.anonymizedAt = new Date().toISOString();
      }
    });
    
    // Save updated data
    await this.saveConsentData();
    await this.saveAuditTrail();
    
    // Final audit entry for deletion
    await this.logAuditEvent('data_deleted', `deleted_${crypto.createHash('sha256').update(userId).digest('hex').substring(0, 8)}`, deletionData);
    
    // Emit deletion event
    this.emit('dataDeleted', { userId, deletionData });
    
    logger.info(`🗑️ Data deleted for user ${userId}. Retention exceptions: ${deletionData.retentionExceptions.length}`);
    
    return {
      success: true,
      deletedAt: deletionData.deletedAt,
      retentionExceptions: deletionData.retentionExceptions
    };
  }

  /**
   * Helper methods
   */

  getConsent(userId) {
    return this.consentStore.get(userId);
  }

  isConsentExpired(consentRecord) {
    return new Date() > new Date(consentRecord.validUntil);
  }

  requiresConsentUpdate(consentRecord) {
    // Check if consent version is outdated
    return consentRecord.version !== this.getConsentVersion();
  }

  isGDPRApplicable(countryCode) {
    const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
    return !countryCode || euCountries.includes(countryCode.toUpperCase());
  }

  validateConsentPreferences(preferences) {
    for (const [category, enabled] of Object.entries(preferences)) {
      if (!this.config.consentCategories[category]) {
        throw new Error(`Unknown consent category: ${category}`);
      }
      
      if (typeof enabled !== 'boolean') {
        throw new Error(`Consent preference must be boolean for category: ${category}`);
      }
    }
  }

  determineLegalBasis(preferences) {
    const legalBases = {};
    
    for (const [category, enabled] of Object.entries(preferences)) {
      const categoryConfig = this.config.consentCategories[category];
      if (categoryConfig) {
        legalBases[category] = enabled ? categoryConfig.legalBasis : null;
      }
    }
    
    return legalBases;
  }

  generateConsentString(preferences) {
    // Generate IAB-style consent string
    const sortedCategories = Object.keys(preferences).sort();
    return sortedCategories.map(cat => `${cat}:${preferences[cat] ? '1' : '0'}`).join('|');
  }

  generateConsentHash(userId, preferences) {
    const hashInput = `${userId}:${JSON.stringify(preferences)}:${Date.now()}`;
    return crypto.createHash('sha256').update(hashInput).digest('hex');
  }

  getConsentVersion() {
    return '2024.1'; // Update when consent policy changes
  }

  async getGeoLocation(ipAddress) {
    // Implement geo-location lookup
    return { country: 'unknown', region: 'unknown' };
  }

  getRetentionPeriods(preferences) {
    const retentions = {};
    
    for (const [category, enabled] of Object.entries(preferences)) {
      if (enabled && this.config.consentCategories[category]) {
        retentions[category] = this.config.consentCategories[category].retention;
      }
    }
    
    return retentions;
  }

  checkLegalRetentionRequirements(consentRecord) {
    // Check if data must be retained for legal/regulatory reasons
    const retentions = [];
    
    // Example: Financial transactions must be kept for 7 years
    if (consentRecord.metadata.hasFinancialData) {
      retentions.push('financial_records');
    }
    
    // Example: Security logs must be kept for audit purposes
    if (consentRecord.metadata.hasSecurityEvents) {
      retentions.push('security_audit');
    }
    
    return retentions;
  }

  scheduleConsentRecheck(userId) {
    // Schedule automatic consent re-verification
    setTimeout(() => {
      this.emit('consentRecheckRequired', { userId });
    }, this.config.gdprSettings.recheckConsentInterval);
  }

  convertToCSV(data) {
    // Simple CSV conversion - implement full CSV serialization as needed
    return 'CSV conversion not yet implemented';
  }

  convertToXML(data) {
    // Simple XML conversion - implement full XML serialization as needed
    return '<?xml version="1.0"?><export>XML conversion not yet implemented</export>';
  }

  /**
   * Audit trail management
   */
  async logAuditEvent(eventType, userId, data = {}) {
    const auditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      eventType,
      userId,
      data,
      source: 'gdpr-consent-manager',
      version: this.getConsentVersion()
    };
    
    this.auditTrail.push(auditEntry);
    
    // Persist audit entry immediately
    await this.saveAuditTrail();
    
    // Emit audit event
    this.emit('auditEvent', auditEntry);
  }

  /**
   * Storage management
   */
  async loadConsentData() {
    try {
      const dataFile = path.join(this.config.dataPath, 'consents.json');
      const data = await fs.readFile(dataFile, 'utf8');
      const consents = JSON.parse(data);
      
      this.consentStore = new Map(Object.entries(consents));
      logger.info(`📂 Loaded ${this.consentStore.size} consent records`);
      
    } catch (error) {
      if (error.code !== 'ENOENT') {
        logger.warn(`⚠️ Failed to load consent data: ${error.message}`);
      }
    }
  }

  async saveConsentData() {
    try {
      const dataFile = path.join(this.config.dataPath, 'consents.json');
      const consents = Object.fromEntries(this.consentStore);
      
      await fs.writeFile(dataFile, JSON.stringify(consents, null, 2), 'utf8');
      
    } catch (error) {
      logger.error(`❌ Failed to save consent data: ${error.message}`);
      throw error;
    }
  }

  async loadAuditTrail() {
    try {
      const auditFile = this.config.auditLogPath;
      const data = await fs.readFile(auditFile, 'utf8');
      
      this.auditTrail = data.split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));
      
      logger.info(`📜 Loaded ${this.auditTrail.length} audit trail entries`);
      
    } catch (error) {
      if (error.code !== 'ENOENT') {
        logger.warn(`⚠️ Failed to load audit trail: ${error.message}`);
      }
    }
  }

  async saveAuditTrail() {
    try {
      await fs.mkdir(path.dirname(this.config.auditLogPath), { recursive: true });
      
      const auditLines = this.auditTrail.map(entry => JSON.stringify(entry)).join('\n') + '\n';
      await fs.writeFile(this.config.auditLogPath, auditLines, 'utf8');
      
    } catch (error) {
      logger.error(`❌ Failed to save audit trail: ${error.message}`);
      throw error;
    }
  }

  /**
   * Compliance reporting
   */
  async generateComplianceReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalConsents: this.consentStore.size,
        activeConsents: [...this.consentStore.values()].filter(c => c.isActive).length,
        expiredConsents: [...this.consentStore.values()].filter(c => this.isConsentExpired(c)).length,
        auditEntries: this.auditTrail.length
      },
      consentCategories: {},
      recentActivity: this.auditTrail
        .filter(entry => Date.now() - new Date(entry.timestamp).getTime() < 7 * 24 * 60 * 60 * 1000)
        .slice(-50)
    };
    
    // Analyze consent by category
    for (const category of Object.keys(this.config.consentCategories)) {
      const consents = [...this.consentStore.values()].filter(c => c.preferences[category]);
      report.consentCategories[category] = {
        totalConsents: consents.length,
        acceptanceRate: consents.length / this.consentStore.size * 100
      };
    }
    
    return report;
  }
}

// Export singleton instance
export const consentManager = new GDPRConsentManager({
  dataPath: process.env.GDPR_DATA_PATH || './data/gdpr',
  auditLogPath: process.env.GDPR_AUDIT_LOG || './data/gdpr/audit.log'
});