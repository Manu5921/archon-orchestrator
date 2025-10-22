import Stripe from 'stripe';

/**
 * Re-export Stripe types for convenience
 */
export type { Stripe };

/**
 * Subscription status
 */
export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired';

/**
 * User subscription data (stored in database)
 */
export interface UserSubscription {
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripeProductId: string | null;
  planName: string | null;
  subscriptionStatus: SubscriptionStatus | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

/**
 * Checkout session creation params
 */
export interface CreateCheckoutSessionParams {
  userId: string;
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
  trialPeriodDays?: number;
  allowPromotionCodes?: boolean;
}

/**
 * Customer portal session params
 */
export interface CreatePortalSessionParams {
  customerId: string;
  returnUrl?: string;
}

/**
 * Price data (formatted from Stripe)
 */
export interface PriceData {
  id: string;
  productId: string;
  unitAmount: number | null;
  currency: string;
  interval: 'month' | 'year' | null;
  intervalCount: number;
  trialPeriodDays: number | null;
}

/**
 * Product data (formatted from Stripe)
 */
export interface ProductData {
  id: string;
  name: string;
  description: string | null;
  defaultPriceId: string | null;
  metadata: Record<string, string>;
}

/**
 * Webhook event types
 */
export type WebhookEventType =
  | 'checkout.session.completed'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'invoice.paid'
  | 'invoice.payment_failed';

/**
 * Webhook handler result
 */
export interface WebhookHandlerResult {
  received: boolean;
  error?: string;
}
