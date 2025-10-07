// TrustBoost - API Subscription Status
// AGENT BUSINESS - Vérification statut abonnements clients
// Context7 Pattern: /stripe/stripe-js + subscription management

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Configuration Stripe sécurisée
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

/**
 * Interface pour les données de subscription
 */
interface SubscriptionStatusRequest {
  customerId?: string;
  subscriptionId?: string;
  customerEmail?: string;
}

/**
 * API Route: Vérification Statut Subscription
 * OBJECTIF: Dashboard client + gestion état abonnement
 * USAGE: Authentification, features access, billing status
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET et POST supportés
  if (!['GET', 'POST'].includes(req.method!)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowed_methods: ['GET', 'POST']
    });
  }

  try {
    // Extraction des paramètres (query pour GET, body pour POST)
    const {
      customerId,
      subscriptionId, 
      customerEmail
    }: SubscriptionStatusRequest = req.method === 'GET' ? req.query : req.body;

    // Validation - au moins un identifiant requis
    if (!customerId && !subscriptionId && !customerEmail) {
      return res.status(400).json({
        error: 'Missing required identifier',
        required_fields: ['customerId', 'subscriptionId', 'customerEmail'],
        description: 'Provide at least one identifier to lookup subscription'
      });
    }

    let customer: Stripe.Customer | null = null;
    let subscriptions: Stripe.Subscription[] = [];

    // Récupération customer par email si nécessaire
    if (customerEmail && !customerId) {
      const customerSearch = await stripe.customers.list({
        email: customerEmail,
        limit: 1
      });

      if (customerSearch.data.length === 0) {
        return res.status(404).json({
          error: 'Customer not found',
          email: customerEmail
        });
      }

      customer = customerSearch.data[0];
    }

    // Récupération customer par ID
    if (customerId) {
      try {
        customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        
        if (customer.deleted) {
          return res.status(404).json({
            error: 'Customer has been deleted',
            customer_id: customerId
          });
        }
      } catch (error) {
        return res.status(404).json({
          error: 'Customer not found',
          customer_id: customerId
        });
      }
    }

    // Récupération subscription directement par ID
    if (subscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ['customer', 'items.data.price', 'latest_invoice']
        });
        subscriptions = [subscription];
        
        // Récupération customer si pas déjà fait
        if (!customer) {
          customer = subscription.customer as Stripe.Customer;
        }
      } catch (error) {
        return res.status(404).json({
          error: 'Subscription not found',
          subscription_id: subscriptionId
        });
      }
    }
    // Sinon, récupération des subscriptions du customer
    else if (customer) {
      const subscriptionsList = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'all',
        expand: ['data.items.data.price', 'data.latest_invoice'],
        limit: 10
      });
      subscriptions = subscriptionsList.data;
    }

    // Log pour analytics
    console.log('📊 Statut subscription vérifié:', {
      customerId: customer?.id,
      customerEmail: customer?.email,
      subscriptionCount: subscriptions.length,
      method: req.method,
      timestamp: new Date().toISOString()
    });

    // Construction de la réponse détaillée
    const responseData = {
      success: true,
      customer: customer ? {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        created: new Date(customer.created * 1000),
        default_payment_method: customer.invoice_settings.default_payment_method
      } : null,
      
      subscriptions: subscriptions.map(sub => {
        const priceItem = sub.items.data[0];
        const price = priceItem?.price;
        const latestInvoice = sub.latest_invoice as Stripe.Invoice;

        return {
          id: sub.id,
          status: sub.status,
          
          // Informations plan
          plan: {
            id: price?.id,
            nickname: price?.nickname || 'Unknown Plan',
            amount: price?.unit_amount ? price.unit_amount / 100 : 0,
            currency: price?.currency?.toUpperCase() || 'EUR',
            interval: price?.recurring?.interval || 'month',
            interval_count: price?.recurring?.interval_count || 1
          },

          // Dates importantes
          dates: {
            created: new Date(sub.created * 1000),
            current_period_start: new Date(sub.current_period_start * 1000),
            current_period_end: new Date(sub.current_period_end * 1000),
            trial_start: sub.trial_start ? new Date(sub.trial_start * 1000) : null,
            trial_end: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
            canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
            cancel_at: sub.cancel_at ? new Date(sub.cancel_at * 1000) : null
          },

          // Informations essai
          trial: {
            is_trial: sub.status === 'trialing',
            trial_end: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
            days_remaining: sub.trial_end ? 
              Math.max(0, Math.ceil((sub.trial_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24))) : 0
          },

          // Informations facturation
          billing: {
            collection_method: sub.collection_method,
            latest_invoice_status: latestInvoice?.status,
            latest_invoice_amount: latestInvoice?.amount_due ? latestInvoice.amount_due / 100 : 0,
            next_invoice_date: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null
          },

          // Métadonnées
          metadata: sub.metadata,
          
          // États calculés pour le frontend
          computed: {
            is_active: ['active', 'trialing'].includes(sub.status),
            needs_payment: sub.status === 'past_due' || sub.status === 'unpaid',
            will_cancel: !!sub.cancel_at && !sub.canceled_at,
            is_canceled: !!sub.canceled_at,
            access_level: getAccessLevel(sub.status),
            days_until_renewal: Math.ceil((sub.current_period_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24))
          }
        };
      }),

      // Résumé global
      summary: {
        total_subscriptions: subscriptions.length,
        active_subscriptions: subscriptions.filter(s => ['active', 'trialing'].includes(s.status)).length,
        has_active_plan: subscriptions.some(s => ['active', 'trialing'].includes(s.status)),
        primary_subscription: subscriptions.find(s => ['active', 'trialing'].includes(s.status))?.id || null,
        account_status: getAccountStatus(subscriptions)
      }
    };

    res.status(200).json(responseData);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isStripeError = error instanceof Stripe.errors.StripeError;

    console.error('❌ Erreur vérification subscription:', {
      error: errorMessage,
      type: isStripeError ? 'stripe_error' : 'server_error',
      code: isStripeError ? error.code : undefined,
      request_params: req.method === 'GET' ? req.query : req.body,
      timestamp: new Date().toISOString()
    });

    if (process.env.NODE_ENV === 'development') {
      console.error('Stack trace:', error);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve subscription status',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}

/**
 * Détermine le niveau d'accès basé sur le statut subscription
 */
function getAccessLevel(status: string): 'full' | 'limited' | 'trial' | 'none' {
  switch (status) {
    case 'active':
      return 'full';
    case 'trialing':
      return 'trial';
    case 'past_due':
    case 'unpaid':
      return 'limited';
    default:
      return 'none';
  }
}

/**
 * Détermine le statut global du compte
 */
function getAccountStatus(subscriptions: Stripe.Subscription[]): 'active' | 'trial' | 'past_due' | 'inactive' {
  if (subscriptions.length === 0) return 'inactive';
  
  const hasActive = subscriptions.some(s => s.status === 'active');
  const hasTrialing = subscriptions.some(s => s.status === 'trialing');
  const hasPastDue = subscriptions.some(s => s.status === 'past_due' || s.status === 'unpaid');
  
  if (hasActive) return 'active';
  if (hasTrialing) return 'trial';
  if (hasPastDue) return 'past_due';
  return 'inactive';
}

/**
 * Configuration API Route
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};