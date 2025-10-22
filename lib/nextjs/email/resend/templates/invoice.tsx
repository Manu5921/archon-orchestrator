import {
  Button,
  Heading,
  Hr,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './layout';
import type { InvoiceEmailProps } from '../types';

/**
 * Invoice email template
 *
 * @example
 * import { InvoiceEmail } from '@/lib/email/templates/invoice';
 * import { sendEmail } from '@/lib/email/client';
 *
 * await sendEmail({
 *   to: user.email,
 *   subject: 'Your Invoice',
 *   react: <InvoiceEmail
 *     name={user.name}
 *     invoiceNumber="INV-001"
 *     amount="$19.99"
 *     date="October 22, 2025"
 *     invoiceLink={invoiceLink}
 *   />
 * });
 */
export function InvoiceEmail({
  name = 'there',
  invoiceNumber,
  amount,
  date,
  invoiceLink,
  billingPeriod,
  appName = process.env.NEXT_PUBLIC_APP_NAME || 'Our App',
}: InvoiceEmailProps) {
  return (
    <EmailLayout preview={`Invoice ${invoiceNumber} - ${amount}`}>
      <Section style={box}>
        <Heading style={h1}>Invoice {invoiceNumber}</Heading>

        <Text style={text}>Hi {name},</Text>

        <Text style={text}>
          Thank you for your payment. Your invoice is now available.
        </Text>

        <Section style={invoiceDetails}>
          <Text style={detailLabel}>Invoice Number:</Text>
          <Text style={detailValue}>{invoiceNumber}</Text>

          <Text style={detailLabel}>Amount:</Text>
          <Text style={detailValue}>{amount}</Text>

          <Text style={detailLabel}>Date:</Text>
          <Text style={detailValue}>{date}</Text>

          {billingPeriod && (
            <>
              <Text style={detailLabel}>Billing Period:</Text>
              <Text style={detailValue}>{billingPeriod}</Text>
            </>
          )}
        </Section>

        <Button style={button} href={invoiceLink}>
          View Invoice
        </Button>

        <Hr style={hr} />

        <Text style={text}>
          If you have any questions about this invoice, please don't hesitate to contact
          us.
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

const invoiceDetails = {
  backgroundColor: '#f6f9fc',
  borderRadius: '5px',
  padding: '20px',
  margin: '24px 0',
};

const detailLabel = {
  color: '#8898aa',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '8px 0 4px 0',
};

const detailValue = {
  color: '#333',
  fontSize: '16px',
  margin: '0 0 12px 0',
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

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};
