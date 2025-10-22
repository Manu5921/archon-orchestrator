import { ReactElement } from 'react';

/**
 * Email send params
 */
export interface SendEmailParams {
  to: string | string[];
  subject: string;
  react?: ReactElement;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  tags?: EmailTag[];
  attachments?: EmailAttachment[];
}

/**
 * Email tag (for tracking)
 */
export interface EmailTag {
  name: string;
  value: string;
}

/**
 * Email attachment
 */
export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

/**
 * Email send result
 */
export interface SendEmailResult {
  id: string;
  success: boolean;
  error?: string;
}

/**
 * Email template props (base)
 */
export interface EmailTemplateProps {
  /**
   * User's name or identifier
   */
  name?: string;

  /**
   * App name (defaults to env var)
   */
  appName?: string;

  /**
   * App URL (defaults to env var)
   */
  appUrl?: string;
}

/**
 * Welcome email props
 */
export interface WelcomeEmailProps extends EmailTemplateProps {
  /**
   * User's email address
   */
  email: string;

  /**
   * Email verification link (optional)
   */
  verificationLink?: string;
}

/**
 * Password reset email props
 */
export interface PasswordResetEmailProps extends EmailTemplateProps {
  /**
   * Password reset link
   */
  resetLink: string;

  /**
   * Link expiration time (e.g., "24 hours")
   */
  expiresIn?: string;
}

/**
 * Invoice email props
 */
export interface InvoiceEmailProps extends EmailTemplateProps {
  /**
   * Invoice number
   */
  invoiceNumber: string;

  /**
   * Invoice amount (formatted, e.g., "$19.99")
   */
  amount: string;

  /**
   * Invoice date
   */
  date: string;

  /**
   * Invoice PDF link
   */
  invoiceLink: string;

  /**
   * Billing period (e.g., "October 2025")
   */
  billingPeriod?: string;
}

/**
 * Notification email props
 */
export interface NotificationEmailProps extends EmailTemplateProps {
  /**
   * Notification title
   */
  title: string;

  /**
   * Notification message
   */
  message: string;

  /**
   * Call-to-action button text (optional)
   */
  ctaText?: string;

  /**
   * Call-to-action button link (optional)
   */
  ctaLink?: string;
}
