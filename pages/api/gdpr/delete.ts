import { NextApiRequest, NextApiResponse } from 'next';
import { dataProcessor } from '../../../src/gdpr-compliance/data-processor.js';
import { auditTrailSystem } from '../../../src/gdpr-compliance/audit-trail-system.js';

/**
 * GDPR Data Deletion API - Article 17 (Right to Erasure)
 * SLA: <24h response time guaranteed
 * 
 * Endpoint: POST /api/gdpr/delete
 * 
 * Body:
 * {
 *   "userId": "string",
 *   "email": "string",
 *   "deletionScope": "complete|partial",
 *   "categories": ["profile"|"usage"|"preferences"|"content"|"all"],
 *   "reason": "withdrawal_consent|no_longer_necessary|unlawful_processing|objection|other",
 *   "verificationCode": "string",
 *   "confirmationText": "DELETE"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "requestId": "uuid",
 *   "estimatedCompletionTime": "2024-01-01T10:00:00Z",
 *   "retentionExceptions": ["audit_trail", "legal_obligations"],
 *   "confirmationEmail": true
 * }
 */

interface DeletionRequest {
  userId: string;
  email: string;
  deletionScope: 'complete' | 'partial';
  categories?: string[];
  reason: 'withdrawal_consent' | 'no_longer_necessary' | 'unlawful_processing' | 'objection' | 'other';
  verificationCode: string;
  confirmationText: string;
  reasonDetails?: string;
}

interface DeletionResponse {
  success: boolean;
  requestId?: string;
  estimatedCompletionTime?: string;
  retentionExceptions?: string[];
  confirmationEmail?: boolean;
  error?: string;
  message?: string;
}

const VALID_DELETION_REASONS = [
  'withdrawal_consent',
  'no_longer_necessary', 
  'unlawful_processing',
  'objection',
  'other'
];

const VALID_CATEGORIES = [
  'profile',
  'usage', 
  'preferences',
  'content',
  'all'
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeletionResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
      message: 'Only POST requests are allowed'
    });
  }

  try {
    // Parse and validate request body
    const {
      userId,
      email,
      deletionScope,
      categories = ['all'],
      reason,
      verificationCode,
      confirmationText,
      reasonDetails
    }: DeletionRequest = req.body;

    // Validate required fields
    if (!userId || !email || !deletionScope || !reason || !verificationCode || !confirmationText) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'All required fields must be provided: userId, email, deletionScope, reason, verificationCode, confirmationText'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid email format'
      });
    }

    // Validate deletion scope
    if (!['complete', 'partial'].includes(deletionScope)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'deletionScope must be either "complete" or "partial"'
      });
    }

    // Validate reason
    if (!VALID_DELETION_REASONS.includes(reason)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: `reason must be one of: ${VALID_DELETION_REASONS.join(', ')}`
      });
    }

    // Validate categories if partial deletion
    if (deletionScope === 'partial') {
      if (!categories || categories.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'categories is required for partial deletion'
        });
      }

      const invalidCategories = categories.filter(cat => !VALID_CATEGORIES.includes(cat));
      if (invalidCategories.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: `Invalid categories: ${invalidCategories.join(', ')}. Valid categories: ${VALID_CATEGORIES.join(', ')}`
        });
      }
    }

    // Validate confirmation text (must be exactly "DELETE")
    if (confirmationText !== 'DELETE') {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'confirmationText must be exactly "DELETE" to confirm deletion request'
      });
    }

    // Log the deletion request in audit trail
    await auditTrailSystem.logEvent({
      eventType: 'data_deletion_requested',
      userId: userId,
      ipAddress: req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      details: {
        deletionScope,
        categories: categories,
        reason,
        reasonDetails: reasonDetails?.substring(0, 500), // Limit details length
        requestEmail: email,
        confirmationProvided: confirmationText === 'DELETE'
      },
      legalBasis: 'article_17_right_to_erasure',
      timestamp: new Date()
    });

    // Check rate limiting - 1 deletion request per user per day
    const recentRequests = await dataProcessor.checkRecentDeletionRequests(userId, 24); // 24 hours
    if (recentRequests > 0) {
      return res.status(429).json({
        success: false,
        error: 'Too Many Requests',
        message: 'Only one deletion request per day is allowed. Please contact our DPO if you need immediate assistance.'
      });
    }

    // Verify user and email match
    const userVerification = await dataProcessor.verifyUserEmail(userId, email);
    if (!userVerification.isValid) {
      await auditTrailSystem.logEvent({
        eventType: 'data_deletion_verification_failed',
        userId: userId,
        ipAddress: req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        details: {
          reason: 'email_mismatch',
          providedEmail: email
        },
        legalBasis: 'article_17_right_to_erasure',
        timestamp: new Date()
      });

      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Email does not match the user account. Please use the email associated with this account.'
      });
    }

    // Verify the verification code
    const codeVerification = await dataProcessor.verifyDeletionCode(userId, verificationCode);
    if (!codeVerification.isValid) {
      await auditTrailSystem.logEvent({
        eventType: 'data_deletion_verification_failed',
        userId: userId,
        ipAddress: req.socket.remoteAddress || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
        details: {
          reason: 'invalid_verification_code'
        },
        legalBasis: 'article_17_right_to_erasure',
        timestamp: new Date()
      });

      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Invalid verification code. Please check your email for the correct code or request a new one.'
      });
    }

    // Process the deletion request
    const deletionResult = await dataProcessor.requestDataDeletion(userId, {
      deletionScope,
      categories,
      reason,
      reasonDetails,
      email,
      verificationCode,
      requestSource: 'api',
      clientIp: req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      confirmationText
    });

    // Log successful deletion request processing
    await auditTrailSystem.logEvent({
      eventType: 'data_deletion_processed',
      userId: userId,
      ipAddress: req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      details: {
        requestId: deletionResult.requestId,
        deletionScope,
        categories: categories,
        reason,
        estimatedCompletionTime: deletionResult.estimatedCompletionTime,
        retentionExceptions: deletionResult.retentionExceptions
      },
      legalBasis: 'article_17_right_to_erasure',
      timestamp: new Date()
    });

    // Send confirmation email
    await dataProcessor.sendDeletionConfirmationEmail(userId, email, {
      requestId: deletionResult.requestId,
      deletionScope,
      categories,
      estimatedCompletionTime: deletionResult.estimatedCompletionTime
    });

    // Return success response
    res.status(200).json({
      success: true,
      requestId: deletionResult.requestId,
      estimatedCompletionTime: deletionResult.estimatedCompletionTime,
      retentionExceptions: deletionResult.retentionExceptions,
      confirmationEmail: true
    });

  } catch (error) {
    console.error('GDPR Deletion API Error:', error);

    // Log the error in audit trail
    await auditTrailSystem.logEvent({
      eventType: 'data_deletion_error',
      userId: req.body?.userId || 'unknown',
      ipAddress: req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      details: {
        error: error.message,
        stack: error.stack?.substring(0, 500),
        requestBody: JSON.stringify(req.body).substring(0, 200)
      },
      legalBasis: 'article_17_right_to_erasure',
      timestamp: new Date()
    });

    // Determine error type and response
    if (error.message.includes('User not found')) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User not found. Please verify the userId.'
      });
    }

    if (error.message.includes('Cannot delete')) {
      return res.status(422).json({
        success: false,
        error: 'Unprocessable Entity',
        message: 'Some data cannot be deleted due to legal obligations. Please contact our DPO for clarification.'
      });
    }

    if (error.message.includes('Active legal hold')) {
      return res.status(423).json({
        success: false,
        error: 'Locked',
        message: 'Account is under legal hold. Deletion cannot proceed at this time. Please contact our legal team.'
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An internal error occurred during deletion processing. Our team has been notified and we guarantee a response within 24 hours.'
    });
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
  // Response timeout: 45 seconds (deletion can take longer)
  maxDuration: 45,
};