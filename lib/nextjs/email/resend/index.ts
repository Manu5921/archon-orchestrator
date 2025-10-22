/**
 * Resend Email Module for Next.js 15
 * @module lib/nextjs/email/resend
 */

// Client exports
export { resend, sendEmail, sendBatchEmails, testEmailConnection } from './client';

// Template exports
export { EmailLayout } from './templates/layout';
export { WelcomeEmail } from './templates/welcome';
export { PasswordResetEmail } from './templates/reset-password';
export { InvoiceEmail } from './templates/invoice';

// Type exports
export type {
  SendEmailParams,
  SendEmailResult,
  EmailTag,
  EmailAttachment,
  EmailTemplateProps,
  WelcomeEmailProps,
  PasswordResetEmailProps,
  InvoiceEmailProps,
  NotificationEmailProps,
} from './types';
