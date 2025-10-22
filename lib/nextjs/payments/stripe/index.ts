/**
 * Stripe Payments Module for Next.js 15
 * @module lib/nextjs/payments/stripe
 */

// Stripe client
export { stripe } from './checkout';

// Checkout exports
export {
  createCheckoutSession,
  getCheckoutSession,
  handleCheckoutSuccess,
} from './checkout';

// Webhook exports
export {
  verifyWebhookSignature,
  handleWebhook,
} from './webhooks';

// Portal exports
export {
  createPortalSession,
  getOrCreatePortalConfiguration,
} from './portal';

// Subscription exports
export {
  getSubscription,
  cancelSubscription,
  cancelSubscriptionImmediately,
  resumeSubscription,
  updateSubscription,
  getUpcomingInvoice,
  listInvoices,
  isSubscriptionActive,
  isSubscriptionPastDue,
  isSubscriptionCanceled,
} from './subscriptions';

// Product exports
export {
  getPrices,
  getPrice,
  getProducts,
  getProduct,
  getProductsWithPrices,
  formatPrice,
  formatInterval,
} from './products';

// Type exports
export type {
  Stripe,
  SubscriptionStatus,
  UserSubscription,
  CreateCheckoutSessionParams,
  CreatePortalSessionParams,
  PriceData,
  ProductData,
  WebhookEventType,
  WebhookHandlerResult,
} from './types';
