import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import type { CreateCheckoutSessionParams } from './types';

/**
 * Stripe client instance
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

/**
 * Create Stripe checkout session
 *
 * @example
 * // In Server Action
 * import { createCheckoutSession } from '@/lib/payments/checkout';
 *
 * const session = await createCheckoutSession({
 *   userId: user.id,
 *   priceId: 'price_...',
 *   successUrl: '/dashboard',
 *   cancelUrl: '/pricing'
 * });
 *
 * redirect(session.url);
 */
export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<Stripe.Checkout.Session> {
  const {
    userId,
    priceId,
    successUrl = '/dashboard',
    cancelUrl = '/pricing',
    trialPeriodDays = 14,
    allowPromotionCodes = true,
  } = params;

  // Check if user has existing customer ID (fetch from database)
  // For now, we'll create a new customer or use existing one
  let customerId: string | undefined;

  // TODO: Fetch from database
  // const subscription = await getUserSubscription(userId);
  // customerId = subscription?.stripeCustomerId || undefined;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}${cancelUrl}`,
    customer: customerId,
    client_reference_id: userId,
    allow_promotion_codes: allowPromotionCodes,
    subscription_data: {
      trial_period_days: trialPeriodDays,
      metadata: {
        userId,
      },
    },
    metadata: {
      userId,
    },
  });

  return session;
}

/**
 * Retrieve checkout session
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['customer', 'subscription'],
  });
}

/**
 * Handle successful checkout
 * Called from success_url callback
 */
export async function handleCheckoutSuccess(sessionId: string) {
  const session = await getCheckoutSession(sessionId);

  if (session.payment_status === 'paid') {
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;
    const userId = session.client_reference_id || session.metadata?.userId;

    if (!userId) {
      throw new Error('User ID not found in checkout session');
    }

    // TODO: Update database with subscription info
    // await updateUserSubscription(userId, {
    //   stripeCustomerId: customerId,
    //   stripeSubscriptionId: subscriptionId,
    //   subscriptionStatus: 'active',
    // });

    return {
      success: true,
      customerId,
      subscriptionId,
      userId,
    };
  }

  return {
    success: false,
    error: 'Payment not completed',
  };
}
