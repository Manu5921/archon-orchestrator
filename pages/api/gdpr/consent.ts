import { NextApiRequest, NextApiResponse } from 'next';
import { consentManager } from '../../../src/gdpr-compliance/consent-manager.js';
import { auditTrailSystem } from '../../../src/gdpr-compliance/audit-trail-system.js';

/**
 * GDPR Consent Management API
 * 
 * Endpoints:
 * - GET /api/gdpr/consent?userId=xxx - Get current consent preferences
 * - POST /api/gdpr/consent - Update consent preferences
 * - DELETE /api/gdpr/consent - Withdraw all consents
 * 
 * Handles granular consent management for GDPR compliance
 */

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  social: boolean;
}

interface ConsentUpdateRequest {
  userId: string;
  preferences: ConsentPreferences;
  ipAddress?: string;
  userAgent?: string;
  source?: string;
}

interface ConsentResponse {
  success: boolean;
  userId?: string;
  preferences?: ConsentPreferences;
  consentDate?: string;
  expiryDate?: string;
  consentId?: string;
  error?: string;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConsentResponse>
) {
  const { method, query, body } = req;

  try {
    switch (method) {
      case 'GET':
        return await handleGetConsent(req, res);
      case 'POST':
        return await handleUpdateConsent(req, res);
      case 'DELETE':
        return await handleWithdrawConsent(req, res);
      default:
        return res.status(405).json({
          success: false,
          error: 'Method Not Allowed',
          message: `Method ${method} not allowed. Supported methods: GET, POST, DELETE`
        });
    }
  } catch (error) {
    console.error('GDPR Consent API Error:', error);

    // Log the error
    await auditTrailSystem.logEvent({
      eventType: 'consent_api_error',
      userId: query.userId as string || body?.userId || 'unknown',
      ipAddress: req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      details: {
        method,
        error: error.message,
        stack: error.stack?.substring(0, 500)
      },
      legalBasis: 'article_7_consent',
      timestamp: new Date()
    });

    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An error occurred while processing your consent preferences'
    });
  }
}

/**
 * GET /api/gdpr/consent?userId=xxx
 * Retrieve current consent preferences for a user
 */
async function handleGetConsent(
  req: NextApiRequest,
  res: NextApiResponse<ConsentResponse>
) {
  const { userId } = req.query;

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'userId query parameter is required'
    });
  }

  try {
    const consentData = await consentManager.getConsent(userId);

    if (!consentData) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'No consent preferences found for this user'
      });
    }

    // Log consent retrieval
    await auditTrailSystem.logEvent({
      eventType: 'consent_retrieved',
      userId,
      ipAddress: req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      details: {
        consentId: consentData.consentId,
        hasActiveConsent: !consentData.isExpired
      },
      legalBasis: 'article_7_consent',
      timestamp: new Date()
    });

    return res.status(200).json({
      success: true,
      userId,
      preferences: consentData.preferences,
      consentDate: consentData.consentDate,
      expiryDate: consentData.expiryDate,
      consentId: consentData.consentId
    });

  } catch (error) {
    if (error.message.includes('User not found')) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User not found'
      });
    }
    throw error;
  }
}

/**
 * POST /api/gdpr/consent
 * Update consent preferences for a user
 */
async function handleUpdateConsent(
  req: NextApiRequest,
  res: NextApiResponse<ConsentResponse>
) {
  const { userId, preferences, source = 'api' }: ConsentUpdateRequest = req.body;

  // Validate required fields
  if (!userId || !preferences) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'userId and preferences are required'
    });
  }

  // Validate preferences structure
  const requiredPrefs = ['necessary', 'analytics', 'marketing', 'personalization', 'social'];
  for (const pref of requiredPrefs) {
    if (typeof preferences[pref] !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: `preferences.${pref} must be a boolean value`
      });
    }
  }

  // Necessary cookies are always true (cannot be disabled)
  if (!preferences.necessary) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Necessary cookies cannot be disabled as they are required for service functionality'
    });
  }

  try {
    // Update consent
    const consentResult = await consentManager.setConsent(
      { 
        userId,
        ipAddress: req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        source
      },
      { 
        preferences,
        consentMethod: 'api_update',
        timestamp: new Date()
      }
    );

    // Log consent update
    await auditTrailSystem.logEvent({
      eventType: 'consent_updated',
      userId,
      ipAddress: req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      details: {
        previousPreferences: consentResult.previousPreferences,
        newPreferences: preferences,
        consentId: consentResult.consentId,
        source,
        changes: consentResult.changes
      },
      legalBasis: 'article_7_consent',
      timestamp: new Date()
    });

    return res.status(200).json({
      success: true,
      userId,
      preferences: consentResult.preferences,
      consentDate: consentResult.consentDate,
      expiryDate: consentResult.expiryDate,
      consentId: consentResult.consentId
    });

  } catch (error) {
    if (error.message.includes('User not found')) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User not found'
      });
    }
    throw error;
  }
}

/**
 * DELETE /api/gdpr/consent
 * Withdraw all consent for a user (except necessary cookies)
 */
async function handleWithdrawConsent(
  req: NextApiRequest,
  res: NextApiResponse<ConsentResponse>
) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'userId is required'
    });
  }

  try {
    // Withdraw all non-necessary consents
    const withdrawalResult = await consentManager.withdrawConsent(userId, {
      ipAddress: req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      withdrawalMethod: 'api_withdrawal',
      timestamp: new Date()
    });

    // Log consent withdrawal
    await auditTrailSystem.logEvent({
      eventType: 'consent_withdrawn',
      userId,
      ipAddress: req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      details: {
        previousPreferences: withdrawalResult.previousPreferences,
        finalPreferences: withdrawalResult.finalPreferences,
        withdrawnCategories: withdrawalResult.withdrawnCategories,
        consentId: withdrawalResult.consentId
      },
      legalBasis: 'article_7_consent',
      timestamp: new Date()
    });

    return res.status(200).json({
      success: true,
      userId,
      preferences: withdrawalResult.finalPreferences,
      consentDate: withdrawalResult.withdrawalDate,
      expiryDate: withdrawalResult.expiryDate,
      consentId: withdrawalResult.consentId,
      message: 'All optional consents have been withdrawn. Only necessary cookies remain active.'
    });

  } catch (error) {
    if (error.message.includes('User not found')) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User not found'
      });
    }
    throw error;
  }
}

/**
 * API Route Config
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  maxDuration: 15,
};