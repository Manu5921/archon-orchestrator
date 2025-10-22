import {
  Button,
  Heading,
  Hr,
  Link,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './layout';
import type { PasswordResetEmailProps } from '../types';

/**
 * Password reset email template
 *
 * @example
 * import { PasswordResetEmail } from '@/lib/email/templates/reset-password';
 * import { sendEmail } from '@/lib/email/client';
 *
 * await sendEmail({
 *   to: user.email,
 *   subject: 'Reset Your Password',
 *   react: <PasswordResetEmail name={user.name} resetLink={resetLink} />
 * });
 */
export function PasswordResetEmail({
  name = 'there',
  resetLink,
  expiresIn = '24 hours',
  appName = process.env.NEXT_PUBLIC_APP_NAME || 'Our App',
}: PasswordResetEmailProps) {
  return (
    <EmailLayout preview="Reset your password">
      <Section style={box}>
        <Heading style={h1}>Reset Your Password</Heading>

        <Text style={text}>Hi {name},</Text>

        <Text style={text}>
          We received a request to reset your password. Click the button below to create a
          new password:
        </Text>

        <Button style={button} href={resetLink}>
          Reset Password
        </Button>

        <Text style={smallText}>
          Or copy and paste this link into your browser:{' '}
          <Link href={resetLink} style={link}>
            {resetLink}
          </Link>
        </Text>

        <Text style={warningText}>
          ⚠️ This link will expire in {expiresIn}. If you didn't request a password reset,
          you can safely ignore this email.
        </Text>

        <Hr style={hr} />

        <Text style={text}>
          For security reasons, we recommend:
        </Text>

        <Text style={text}>
          • Using a strong, unique password
          <br />
          • Not reusing passwords from other sites
          <br />• Enabling two-factor authentication
        </Text>

        <Text style={text}>
          Best,
          <br />
          The {appName} Team
        </Text>
      </Section>
    </EmailLayout>
  );
}

// Styles
const box = {
  padding: '0 48px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const smallText = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 0',
};

const warningText = {
  color: '#e25950',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 0',
  padding: '12px',
  backgroundColor: '#fff5f5',
  borderRadius: '5px',
};

const button = {
  backgroundColor: '#5469d4',
  borderRadius: '5px',
  color: '#fff',
  display: 'block',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  textDecoration: 'none',
  padding: '12px 20px',
  margin: '24px auto',
  width: 'fit-content',
};

const link = {
  color: '#5469d4',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};
