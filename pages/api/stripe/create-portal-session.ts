// TrustBoost - API Customer Portal Stripe
// AGENT BUSINESS - Gestion self-service abonnements clients
// Context7 Pattern: /stripe/stripe-js + customer portal

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Configuration Stripe sécurisée
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

/**
 * Interface pour les données de portal
 */
interface PortalSessionRequest {
  customerId: string;
  returnUrl?: string;
  flowData?: {
    type: 'payment_method_update' | 'subscription_cancel' | 'subscription_update';
    after_completion?: {
      type: 'redirect';
      redirect: {
        return_url: string;
      };
    };
  };
}

/**
 * API Route: Customer Portal Stripe
 * OBJECTIF: Self-service client pour réduire support
 * FONCTIONS: Billing, invoices, change plan, cancel
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Méthode POST uniquement
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowed_methods: ['POST']
    });
  }

  try {
    const {
      customerId,
      returnUrl,
      flowData
    }: PortalSessionRequest = req.body;

    // Validation des données obligatoires
    if (!customerId) {
      return res.status(400).json({
        error: 'Missing required field: customerId',
        required_fields: ['customerId']
      });
    }

    // Validation que le customer existe dans Stripe
    let customer: Stripe.Customer;
    try {
      customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      
      if (customer.deleted) {
        throw new Error('Customer has been deleted');
      }
    } catch (error) {
      console.error('❌ Customer invalide:', customerId);
      return res.status(404).json({
        error: 'Customer not found',
        customer_id: customerId
      });
    }

    // Construction URL de retour avec fallback
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${req.headers.host}`;
    const finalReturnUrl = returnUrl || `${baseUrl}/dashboard/billing`;

    // Log pour analytics
    console.log('🏛️ Customer portal demandé:', {
      customerId,
      customerEmail: customer.email,
      returnUrl: finalReturnUrl,
      flowType: flowData?.type || 'default',
      timestamp: new Date().toISOString()
    });

    // Configuration du portail client
    const portalParams: Stripe.BillingPortal.SessionCreateParams = {
      customer: customerId,
      return_url: finalReturnUrl,
      
      // Configuration avancée si flux spécifique demandé
      ...(flowData && { flow_data: flowData })
    };

    // Création de la session portal
    const portalSession = await stripe.billingPortal.sessions.create(portalParams);

    // Analytics de self-service
    console.log('✅ Customer portal créé:', {
      session_id: portalSession.id,
      customer_id: customerId,
      customer_email: customer.email,
      portal_url: portalSession.url,
      flow_type: flowData?.type || 'default'
    });

    // TODO: Analytics tracking
    // await trackCustomerEvent('portal_session_created', {
    //   customer_id: customerId,
    //   flow_type: flowData?.type,
    //   source: 'api'
    // });

    // Réponse optimisée
    res.status(200).json({
      success: true,
      portal: {
        id: portalSession.id,
        url: portalSession.url,
        return_url: portalSession.return_url
      },
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name
      },
      message: 'Customer portal session créée avec succès'
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isStripeError = error instanceof Stripe.errors.StripeError;

    console.error('❌ Erreur création customer portal:', {
      error: errorMessage,
      type: isStripeError ? 'stripe_error' : 'server_error',
      code: isStripeError ? error.code : undefined,
      customer_id: req.body.customerId,
      timestamp: new Date().toISOString()
    });

    // Log détaillé en dev
    if (process.env.NODE_ENV === 'development') {
      console.error('Stack trace:', error);
    }

    // TODO: Error analytics
    // await trackCustomerEvent('portal_session_error', {
    //   customer_id: req.body.customerId,
    //   error: errorMessage
    // });

    // Réponse d'erreur sécurisée
    res.status(500).json({
      success: false,
      error: 'Failed to create customer portal session',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      retry_possible: true
    });
  }
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