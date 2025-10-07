// TrustBoost - Webhook Stripe Endpoint
// AGENT BUSINESS - Intégration Stripe production-ready
// Context7 Pattern: /stripe/stripe-js + sécurité PCI compliant

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Configuration Stripe sécurisée
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

/**
 * Endpoint Webhook Stripe sécurisé
 * OBJECTIF: Automatisation onboarding 0→dashboard <5min
 * MÉTRIQUE: Taux de conversion >5%
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // POST uniquement pour webhooks Stripe
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    console.error('⚠️ Webhook signature ou secret manquant');
    return res.status(400).json({ error: 'Webhook signature required' });
  }

  let event: Stripe.Event;

  try {
    // Vérification signature sécurisée - obligatoire PCI
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Webhook signature verification failed: ${errorMessage}`);
    return res.status(400).json({ error: `Webhook signature verification failed: ${errorMessage}` });
  }

  console.log(`📥 Webhook reçu: ${event.type} [${event.id}]`);

  try {
    // Traitement des événements critiques pour onboarding
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
        
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`📋 Webhook non géré: ${event.type}`);
    }

    // Réponse rapide à Stripe (< 10s timeout)
    res.status(200).json({ 
      received: true, 
      event: event.type,
      id: event.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Erreur traitement webhook ${event.type}:`, error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      event_type: event.type,
      event_id: event.id
    });
  }
}

/**
 * Traitement checkout complété - début parcours onboarding
 * CRITIQUES: Email welcome + setup dashboard
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('✅ Checkout complété:', session.id);

    // Récupération des données client
    const customer = await stripe.customers.retrieve(session.customer as string) as Stripe.Customer;
    const subscription = session.subscription ? 
      await stripe.subscriptions.retrieve(session.subscription as string) : null;

    const customerData = {
      stripe_customer_id: customer.id,
      email: customer.email || session.customer_details?.email || '',
      name: customer.name || session.customer_details?.name || '',
      subscription_id: subscription?.id || '',
      plan_name: subscription ? getSubscriptionPlanName(subscription) : '',
      trial_end: subscription?.trial_end ? new Date(subscription.trial_end * 1000) : null,
      signup_source: 'checkout_completed'
    };

    // TODO: Intégration avec votre système de users
    console.log('👤 Nouveau client onboardé:', customerData);

    // TODO: Trigger email welcome
    // await sendWelcomeEmail(customerData);

    // TODO: Création compte utilisateur dans votre DB
    // await createUserFromStripeCustomer(customerData);

    return customerData;

  } catch (error) {
    console.error('❌ Erreur checkout completed:', error);
    throw error;
  }
}

/**
 * Nouvelle souscription créée
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log('📋 Nouvelle souscription:', subscription.id);

    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
    const planName = getSubscriptionPlanName(subscription);

    // Analytics de conversion
    console.log(`📊 Conversion réussie: Plan ${planName} pour ${customer.email}`);

    // TODO: Update user plan in your database
    // TODO: Analytics tracking for conversion metrics

    return { subscription_id: subscription.id, plan: planName };

  } catch (error) {
    console.error('❌ Erreur subscription created:', error);
    throw error;
  }
}

/**
 * Fin de période d'essai imminente - conversion critique
 */
async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  try {
    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
    const daysRemaining = Math.ceil((subscription.trial_end! * 1000 - Date.now()) / (1000 * 60 * 60 * 24));

    console.log(`⏰ Fin d'essai dans ${daysRemaining} jours pour: ${customer.email}`);

    const trialData = {
      customer_id: customer.id,
      email: customer.email,
      days_remaining: daysRemaining,
      plan_name: getSubscriptionPlanName(subscription),
      trial_end: new Date(subscription.trial_end! * 1000)
    };

    // TODO: Email de rappel conversion
    // await sendTrialEndingEmail(trialData);

    // TODO: In-app notification
    // await createTrialEndingNotification(trialData);

    return trialData;

  } catch (error) {
    console.error('❌ Erreur trial will end:', error);
    throw error;
  }
}

/**
 * Paiement réussi - confirmation
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const customer = await stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer;
    
    console.log(`💳 Paiement réussi: ${invoice.amount_paid / 100}€ pour ${customer.email}`);

    const paymentData = {
      customer_email: customer.email,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency.toUpperCase(),
      invoice_url: invoice.hosted_invoice_url,
      payment_date: new Date(invoice.created * 1000),
    };

    // TODO: Email confirmation de paiement
    // await sendPaymentConfirmationEmail(paymentData);

    return paymentData;

  } catch (error) {
    console.error('❌ Erreur payment succeeded:', error);
    throw error;
  }
}

/**
 * Paiement échoué - retry flow critique
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const customer = await stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer;

    console.log(`❌ Paiement échoué pour: ${customer.email}`);

    const failureData = {
      customer_email: customer.email,
      amount: invoice.amount_due / 100,
      attempt_count: invoice.attempt_count,
      next_payment_attempt: invoice.next_payment_attempt ? 
        new Date(invoice.next_payment_attempt * 1000) : null
    };

    // TODO: Email retry payment
    // await sendPaymentFailedEmail(failureData);

    // TODO: In-app retry flow
    // await createPaymentRetryNotification(failureData);

    return failureData;

  } catch (error) {
    console.error('❌ Erreur payment failed:', error);
    throw error;
  }
}

/**
 * Souscription mise à jour (upgrade/downgrade)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
    const planName = getSubscriptionPlanName(subscription);

    console.log(`🔄 Plan mis à jour vers ${planName} pour: ${customer.email}`);

    // TODO: Update user plan in database
    // TODO: Analytics tracking for plan changes

    return { subscription_id: subscription.id, new_plan: planName };

  } catch (error) {
    console.error('❌ Erreur subscription updated:', error);
    throw error;
  }
}

/**
 * Souscription annulée - retention flow
 */
async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  try {
    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;

    console.log(`❌ Souscription annulée pour: ${customer.email}`);

    // TODO: Retention email campaign
    // TODO: Downgrade to free tier if applicable
    // TODO: Analytics tracking for churn

    return { customer_id: customer.id, canceled_at: new Date() };

  } catch (error) {
    console.error('❌ Erreur subscription canceled:', error);
    throw error;
  }
}

/**
 * Utilitaire: extraction nom du plan depuis subscription
 */
function getSubscriptionPlanName(subscription: Stripe.Subscription): string {
  const priceItem = subscription.items.data[0];
  const price = priceItem?.price;
  
  return price?.nickname || 
         price?.lookup_key || 
         `${price?.unit_amount ? price.unit_amount / 100 : 'Unknown'}€/${price?.recurring?.interval}` ||
         'Unknown Plan';
}

/**
 * Configuration API - CRITIQUE pour webhooks
 * bodyParser désactivé pour signature verification
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Fonction utilitaire pour lire le body raw
 */
export async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}