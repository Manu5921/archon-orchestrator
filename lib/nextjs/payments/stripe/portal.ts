import { stripe } from './checkout';
import type { CreatePortalSessionParams } from './types';

/**
 * Create customer portal session
 *
 * @example
 * // In Server Action
 * import { createPortalSession } from '@/lib/payments/portal';
 *
 * const session = await createPortalSession({
 *   customerId: user.stripeCustomerId,
 *   returnUrl: '/dashboard'
 * });
 *
 * redirect(session.url);
 */
export async function createPortalSession(
  params: CreatePortalSessionParams
): Promise<{ url: string }> {
  const { customerId, returnUrl = '/dashboard' } = params;

  if (!customerId) {
    throw new Error('Customer ID is required');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}${returnUrl}`,
  });

  return { url: session.url };
}

/**
 * Get or create billing portal configuration
 */
export async function getOrCreatePortalConfiguration() {
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    return configurations.data[0];
  }

  // Create default configuration
  return stripe.billingPortal.configurations.create({
    business_profile: {
      headline: 'Manage your subscription',
    },
    features: {
      subscription_update: {
        enabled: true,
        default_allowed_updates: ['price', 'quantity', 'promotion_code'],
        proration_behavior: 'create_prorations',
      },
      subscription_cancel: {
        enabled: true,
        mode: 'at_period_end',
        cancellation_reason: {
          enabled: true,
          options: [
            'too_expensive',
            'missing_features',
            'switched_service',
            'unused',
            'other',
          ],
        },
      },
      payment_method_update: {
        enabled: true,
      },
      invoice_history: {
        enabled: true,
      },
    },
  });
}
