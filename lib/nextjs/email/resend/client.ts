import { Resend } from 'resend';
import type { SendEmailParams, SendEmailResult } from './types';

/**
 * Resend client instance
 */
export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Default sender email (from env)
 */
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || 'noreply@example.com';

/**
 * Send email using Resend
 *
 * @example
 * import { sendEmail } from '@/lib/email/client';
 * import { WelcomeEmail } from '@/lib/email/templates/welcome';
 *
 * await sendEmail({
 *   to: user.email,
 *   subject: 'Welcome!',
 *   react: <WelcomeEmail name={user.name} email={user.email} />
 * });
 */
export async function sendEmail(
  params: SendEmailParams
): Promise<SendEmailResult> {
  const {
    to,
    subject,
    react,
    html,
    text,
    from = DEFAULT_FROM,
    replyTo,
    cc,
    bcc,
    tags,
    attachments,
  } = params;

  try {
    // Validate required fields
    if (!react && !html && !text) {
      throw new Error('Either react, html, or text content is required');
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      react,
      html,
      text,
      replyTo,
      cc,
      bcc,
      tags,
      attachments,
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        id: '',
        success: false,
        error: error.message,
      };
    }

    return {
      id: data?.id || '',
      success: true,
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      id: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send batch emails
 */
export async function sendBatchEmails(
  emails: SendEmailParams[]
): Promise<SendEmailResult[]> {
  const results = await Promise.allSettled(emails.map((email) => sendEmail(email)));

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }

    return {
      id: '',
      success: false,
      error: result.reason?.message || 'Unknown error',
    };
  });
}

/**
 * Test email connection
 */
export async function testEmailConnection(): Promise<boolean> {
  try {
    const result = await sendEmail({
      to: DEFAULT_FROM,
      subject: 'Test Email Connection',
      text: 'This is a test email to verify Resend configuration.',
    });

    return result.success;
  } catch (error) {
    console.error('Email connection test failed:', error);
    return false;
  }
}
