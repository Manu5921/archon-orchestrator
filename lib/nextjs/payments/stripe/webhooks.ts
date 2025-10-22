import Stripe from 'stripe';
import { stripe } from './checkout';
import type { WebhookHandlerResult } from './types';
import { withIdempotency, isEventProcessed } from './idempotency';

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  return stripe.webhooks.constructEvent(body, signature, webhookSecret);
}

/**
 * Handle webhook events
 *
 * @example
 * // app/api/stripe/webhook/route.ts
 * import { handleWebhook } from '@/lib/payments/webhooks';
 *
 * export async function POST(request: Request) {
 *   const body = await request.text();
 *   const signature = request.headers.get('stripe-signature')!;
 *
 *   try {
 *     const result = await handleWebhook(body, signature);
 *     return Response.json(result);
 *   } catch (error) {
 *     return Response.json({ error: error.message }, { status: 400 });
 *   }
 * }
 */
export async function handleWebhook(
  body: string,
  signature: string
): Promise<WebhookHandlerResult> {
  try {
    const event = verifyWebhookSignature(body, signature);

    // 🔒 IDEMPOTENCY: Check if event was already processed
    if (await isEventProcessed(event.id)) {
      console.log(`Event ${event.id} already processed, returning cached result`);
      return { received: true, duplicate: true };
    }

    // Process event with idempotency wrapper
    await withIdempotency(event.id, async () => {
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session
          );
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await handleSubscriptionChange(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        case 'invoice.paid':
          await handleInvoicePaid(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { success: true };
    });

    return { received: true };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      received: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  const userId = session.client_reference_id || session.metadata?.userId;

  if (!userId) {
    console.error('User ID not found in checkout session');
    return;
  }

  console.log('Checkout completed:', {
    userId,
    customerId,
    subscriptionId,
  });

  // TODO: Update database
  // await updateUserSubscription(userId, {
  //   stripeCustomerId: customerId,
  //   stripeSubscriptionId: subscriptionId,
  //   subscriptionStatus: 'trialing',
  // });
}

/**
 * Handle subscription created/updated events
 */
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('User ID not found in subscription metadata');
    return;
  }

  const plan = subscription.items.data[0]?.plan;
  const productId = typeof plan?.product === 'string' ? plan.product : plan?.product?.id;

  console.log('Subscription changed:', {
    userId,
    subscriptionId,
    status,
    productId,
  });

  if (status === 'active' || status === 'trialing') {
    // TODO: Update database
    // await updateUserSubscription(userId, {
    //   stripeCustomerId: customerId,
    //   stripeSubscriptionId: subscriptionId,
    //   stripeProductId: productId,
    //   planName: plan?.product?.name,
    //   subscriptionStatus: status,
    //   currentPeriodStart: new Date(subscription.current_period_start * 1000),
    //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    //   cancelAtPeriodEnd: subscription.cancel_at_period_end,
    // });
  }
}

/**
 * Handle subscription deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('User ID not found in subscription metadata');
    return;
  }

  console.log('Subscription deleted:', { userId, subscriptionId: subscription.id });

  // TODO: Update database
  // await updateUserSubscription(userId, {
  //   stripeSubscriptionId: null,
  //   stripeProductId: null,
  //   planName: null,
  //   subscriptionStatus: 'canceled',
  // });
}

/**
 * Handle invoice.paid event
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  const userId = invoice.subscription_details?.metadata?.userId;

  if (!userId) {
    console.error('User ID not found in invoice');
    return;
  }

  console.log('Invoice paid:', {
    userId,
    subscriptionId,
    amountPaid: invoice.amount_paid,
  });

  // TODO: Send payment confirmation email
  // await sendPaymentConfirmationEmail(userId, invoice);
}

/**
 * Handle invoice.payment_failed event
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  const userId = invoice.subscription_details?.metadata?.userId;

  if (!userId) {
    console.error('User ID not found in invoice');
    return;
  }

  console.log('Invoice payment failed:', {
    userId,
    subscriptionId,
    amountDue: invoice.amount_due,
  });

  // TODO: Send payment failed email
  // await sendPaymentFailedEmail(userId, invoice);

  // TODO: Update subscription status
  // await updateUserSubscription(userId, {
  //   subscriptionStatus: 'past_due',
  // });
}
