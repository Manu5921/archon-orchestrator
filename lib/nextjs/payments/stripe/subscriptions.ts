import Stripe from 'stripe';
import { stripe } from './checkout';

/**
 * Get subscription by ID
 */
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method', 'customer'],
  });
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Cancel subscription immediately
 */
export async function cancelSubscriptionImmediately(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Resume subscription (undo cancel_at_period_end)
 */
export async function resumeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

/**
 * Update subscription (change plan)
 */
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
): Promise<Stripe.Subscription> {
  const subscription = await getSubscription(subscriptionId);
  const subscriptionItemId = subscription.items.data[0]?.id;

  if (!subscriptionItemId) {
    throw new Error('Subscription item not found');
  }

  return stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscriptionItemId,
        price: newPriceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });
}

/**
 * Get upcoming invoice (preview)
 */
export async function getUpcomingInvoice(
  customerId: string,
  subscriptionId?: string
): Promise<Stripe.Invoice> {
  return stripe.invoices.retrieveUpcoming({
    customer: customerId,
    subscription: subscriptionId,
  });
}

/**
 * List customer's invoices
 */
export async function listInvoices(
  customerId: string,
  limit: number = 10
): Promise<Stripe.Invoice[]> {
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit,
  });

  return invoices.data;
}

/**
 * Check if subscription is active
 */
export function isSubscriptionActive(status: string): boolean {
  return status === 'active' || status === 'trialing';
}

/**
 * Check if subscription is past due
 */
export function isSubscriptionPastDue(status: string): boolean {
  return status === 'past_due' || status === 'unpaid';
}

/**
 * Check if subscription is canceled
 */
export function isSubscriptionCanceled(status: string): boolean {
  return status === 'canceled' || status === 'incomplete_expired';
}
