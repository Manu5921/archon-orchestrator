import { NextApiRequest, NextApiResponse } from 'next';
import { dataProcessor } from '../../../src/gdpr-compliance/data-processor.js';
import { auditTrailSystem } from '../../../src/gdpr-compliance/audit-trail-system.js';

/**
 * GDPR Data Export API - Article 20 (Right to Data Portability)
 * SLA: <24h response time guaranteed
 * 
 * Endpoint: POST /api/gdpr/export
 * 
 * Body:
 * {
 *   "userId": "string",
 *   "email": "string", 
 *   "format": "json|csv|xml",
 *   "categories": ["all"|"profile"|"usage"|"preferences"|"content"],
 *   "verificationCode"?: "string"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "requestId": "uuid",
 *   "estimatedCompletionTime": "2024-01-01T10:00:00Z",
 *   "downloadUrl": "https://...",
 *   "expiresAt": "2024-01-08T10:00:00Z"
 * }
 */

interface ExportRequest {
  userId: string;
  email: string;
  format?: 'json' | 'csv' | 'xml';
  categories?: string[];
  verificationCode?: string;
}

interface ExportResponse {
  success: boolean;
  requestId?: string;
  estimatedCompletionTime?: string;
  downloadUrl?: string;
  expiresAt?: string;
  error?: string;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExportResponse>
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
      format = 'json',
      categories = ['all'],
      verificationCode
    }: ExportRequest = req.body;

    // Validate required fields
    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'userId and email are required fields'
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

    // Validate format
    if (!['json', 'csv', 'xml'].includes(format)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Format must be one of: json, csv, xml'
      });
    }

    // Log the request in audit trail
    await auditTrailSystem.logEvent({
      eventType: 'data_export_requested',
      userId: userId,
      ipAddress: req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      details: {
        requestedFormat: format,
        requestedCategories: categories,
        requestEmail: email,
        hasVerificationCode: !!verificationCode
      },
      legalBasis: 'article_20_data_portability',
      timestamp: new Date()
    });

    // Check rate limiting - 1 export request per user per hour
    const recentRequests = await dataProcessor.checkRecentExportRequests(userId, 1); // 1 hour
    if (recentRequests > 0) {
      return res.status(429).json({
        success: false,
        error: 'Too Many Requests',
        message: 'Only one export request per hour is allowed. Please wait before making another request.'
      });
    }

    // Process the export request
    const exportResult = await dataProcessor.requestDataExport(userId, {
      format,
      categories,
      email,
      verificationCode,
      requestSource: 'api',
      clientIp: req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    });

    // Log successful request processing
    await auditTrailSystem.logEvent({
      eventType: 'data_export_processed',
      userId: userId,
      ipAddress: req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      details: {
        requestId: exportResult.requestId,
        estimatedCompletionTime: exportResult.estimatedCompletionTime,
        categories: categories,
        format: format
      },
      legalBasis: 'article_20_data_portability',
      timestamp: new Date()
    });

    // Return success response
    res.status(200).json({
      success: true,
      requestId: exportResult.requestId,
      estimatedCompletionTime: exportResult.estimatedCompletionTime,
      downloadUrl: exportResult.downloadUrl,
      expiresAt: exportResult.expiresAt
    });

  } catch (error) {
    console.error('GDPR Export API Error:', error);

    // Log the error in audit trail
    await auditTrailSystem.logEvent({
      eventType: 'data_export_error',
      userId: req.body?.userId || 'unknown',
      ipAddress: req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      details: {
        error: error.message,
        stack: error.stack?.substring(0, 500),
        requestBody: JSON.stringify(req.body).substring(0, 200)
      },
      legalBasis: 'article_20_data_portability',
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

    if (error.message.includes('Email mismatch')) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Email does not match the user account. Please use the email associated with this account.'
      });
    }

    if (error.message.includes('Verification required')) {
      return res.status(403).json({
        success: false,
        error: 'Verification Required',
        message: 'Additional verification is required. Please check your email for a verification code.'
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An internal error occurred. Our team has been notified and we guarantee a response within 24 hours.'
    });
  }
}

/**
 * API Route Config
 * Enable larger request bodies for potential file uploads
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  // Response timeout: 30 seconds
  maxDuration: 30,
};