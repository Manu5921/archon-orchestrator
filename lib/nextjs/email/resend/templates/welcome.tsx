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
import type { WelcomeEmailProps } from '../types';

/**
 * Welcome email template
 *
 * @example
 * import { WelcomeEmail } from '@/lib/email/templates/welcome';
 * import { sendEmail } from '@/lib/email/client';
 *
 * await sendEmail({
 *   to: user.email,
 *   subject: 'Welcome to Our App!',
 *   react: <WelcomeEmail name={user.name} email={user.email} />
 * });
 */
export function WelcomeEmail({
  name = 'there',
  email,
  verificationLink,
  appName = process.env.NEXT_PUBLIC_APP_NAME || 'Our App',
  appUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
}: WelcomeEmailProps) {
  return (
    <EmailLayout preview={`Welcome to ${appName}!`}>
      <Section style={box}>
        <Heading style={h1}>Welcome to {appName}!</Heading>

        <Text style={text}>Hi {name},</Text>

        <Text style={text}>
          Thanks for signing up! We're excited to have you on board.
        </Text>

        {verificationLink && (
          <>
            <Text style={text}>
              To get started, please verify your email address by clicking the button below:
            </Text>

            <Button style={button} href={verificationLink}>
              Verify Email
            </Button>

            <Text style={smallText}>
              Or copy and paste this link into your browser:{' '}
              <Link href={verificationLink} style={link}>
                {verificationLink}
              </Link>
            </Text>
          </>
        )}

        {!verificationLink && (
          <>
            <Text style={text}>
              You're all set! Click the button below to get started:
            </Text>

            <Button style={button} href={`${appUrl}/dashboard`}>
              Go to Dashboard
            </Button>
          </>
        )}

        <Hr style={hr} />

        <Text style={text}>
          If you have any questions, feel free to reply to this email.
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
