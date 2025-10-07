// TrustBoost - API Checkout Session Stripe
// AGENT BUSINESS - Endpoint production pour création sessions Stripe
// Context7 Pattern: /stripe/stripe-js + validation sécurisée

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Configuration Stripe sécurisée
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Configuration des plans TrustBoost (synchronisé avec Stripe Dashboard)
const PRICING_PLANS = {
  STARTER: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || 'price_starter_monthly',
    yearly: process.env.STRIPE_PRICE_STARTER_YEARLY || 'price_starter_yearly',
    name: 'Starter',
    features: ['1K utilisateurs', 'Dashboard basique', 'Support email']
  },
  PROFESSIONAL: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly', 
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
    name: 'Professional',
    features: ['10K utilisateurs', 'Analytics avancés', 'API complète', 'Support prioritaire']
  },
  ENTERPRISE: {
    monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || 'price_enterprise_monthly',
    yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || 'price_enterprise_yearly', 
    name: 'Enterprise',
    features: ['Illimité', 'White-label', 'Déploiement sur site', 'Support 24/7']
  }
};

/**
 * Interface pour les données de session
 */
interface CheckoutSessionRequest {
  priceId: string;
  planName?: string;
  billingCycle?: 'monthly' | 'yearly';
  customerEmail?: string;
  customerName?: string;
  customerData?: Record<string, any>;
  successUrl?: string;
  cancelUrl?: string;
  trialDays?: number;
  allowPromotionCodes?: boolean;
}

/**
 * API Route: Création Session Stripe Checkout
 * OBJECTIF: Conversion optimisée avec essai 7 jours
 * MÉTRIQUE CRITIQUE: Taux conversion >5%
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
      priceId,
      planName = 'Unknown',
      billingCycle = 'monthly',
      customerEmail,
      customerName,
      customerData = {},
      successUrl,
      cancelUrl,
      trialDays = 7,
      allowPromotionCodes = true
    }: CheckoutSessionRequest = req.body;

    // Validation des données obligatoires
    if (!priceId) {
      return res.status(400).json({
        error: 'Missing required field: priceId',
        required_fields: ['priceId']
      });
    }

    // Validation priceId contre nos plans configurés
    const isValidPriceId = Object.values(PRICING_PLANS).some(plan => 
      plan.monthly === priceId || plan.yearly === priceId
    );

    if (!isValidPriceId) {
      console.error(`❌ Prix ID invalide: ${priceId}`);
      return res.status(400).json({
        error: 'Invalid priceId',
        valid_price_ids: Object.values(PRICING_PLANS).flatMap(p => [p.monthly, p.yearly])
      });
    }

    // Construction des URLs avec fallbacks sécurisés
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${req.headers.host}`;
    const finalSuccessUrl = successUrl || `${baseUrl}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl || `${baseUrl}/pricing`;

    // Log pour analytics business
    console.log('🛒 Session checkout demandée:', {
      priceId,
      planName,
      billingCycle,
      customerEmail: customerEmail || 'anonymous',
      trialDays,
      timestamp: new Date().toISOString()
    });

    // Configuration session Stripe optimisée conversion
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      // Modes de paiement supportés (cartes + wallets)
      payment_method_types: ['card'],
      mode: 'subscription',
      
      // Ligne d'article
      line_items: [{
        price: priceId,
        quantity: 1,
      }],

      // URLs de redirection
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,

      // Configuration subscription avec essai gratuit
      subscription_data: {
        trial_period_days: trialDays,
        metadata: {
          source: 'trustboost_checkout',
          plan_name: planName,
          billing_cycle: billingCycle,
          signup_timestamp: new Date().toISOString(),
          customer_segment: 'direct_signup'
        }
      },

      // Informations client
      customer_creation: 'always',
      ...(customerEmail && { customer_email: customerEmail }),

      // Métadonnées pour tracking et analytics
      metadata: {
        source: 'api_checkout',
        plan_name: planName,
        billing_cycle: billingCycle,
        customer_email: customerEmail || '',
        customer_name: customerName || '',
        trial_enabled: 'true',
        created_via: 'trustboost_api'
      },

      // Configuration optimisée UX
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: false // Réduit friction
      },

      // Taxes automatiques (conformité EU)
      automatic_tax: {
        enabled: true,
      },

      // Codes promo pour améliorer conversion
      allow_promotion_codes: allowPromotionCodes,

      // Personnalisation interface (branding TrustBoost)
      custom_text: {
        submit: {
          message: `Commencer l'essai gratuit ${trialDays} jours - ${planName}`
        }
      },

      // Collecte d'informations additionnelles
      custom_fields: [
        {
          key: 'company_name',
          label: {
            type: 'custom',
            custom: 'Nom de l\'entreprise (optionnel)'
          },
          type: 'text',
          optional: true
        },
        {
          key: 'use_case',
          label: {
            type: 'custom', 
            custom: 'Principal cas d\'usage'
          },
          type: 'dropdown',
          dropdown: {
            options: [
              { label: 'Analytics utilisateurs', value: 'user_analytics' },
              { label: 'Conversion optimization', value: 'conversion_opt' },
              { label: 'Product intelligence', value: 'product_intel' },
              { label: 'Growth marketing', value: 'growth_marketing' },
              { label: 'Autre', value: 'other' }
            ]
          },
          optional: true
        }
      ],

      // Expires dans 30min pour éviter sessions abandonnées
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
    };

    // Création de la session Stripe
    const session = await stripe.checkout.sessions.create(sessionParams);

    // Analytics de conversion - tracking session créée
    console.log('✅ Session Stripe créée avec succès:', {
      session_id: session.id,
      customer_email: session.customer_email || customerEmail,
      plan_name: planName,
      trial_days: trialDays,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency
    });

    // TODO: Analytics tracking
    // await trackConversionEvent('checkout_session_created', {
    //   session_id: session.id,
    //   plan_name: planName,
    //   billing_cycle: billingCycle,
    //   customer_email: customerEmail
    // });

    // Réponse optimisée frontend
    res.status(200).json({
      success: true,
      session: {
        id: session.id,
        url: session.url,
        customer: session.customer,
        amount_total: session.amount_total,
        currency: session.currency
      },
      checkout_details: {
        plan_name: planName,
        billing_cycle: billingCycle,
        trial_days: trialDays,
        expires_at: session.expires_at
      },
      message: 'Session de paiement créée avec succès'
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isStripeError = error instanceof Stripe.errors.StripeError;

    console.error('❌ Erreur création session checkout:', {
      error: errorMessage,
      type: isStripeError ? 'stripe_error' : 'server_error',
      code: isStripeError ? error.code : undefined,
      timestamp: new Date().toISOString()
    });

    // Log pour debugging en dev
    if (process.env.NODE_ENV === 'development') {
      console.error('Stack trace:', error);
    }

    // TODO: Error analytics tracking
    // await trackConversionEvent('checkout_session_error', {
    //   error: errorMessage,
    //   request_data: req.body
    // });

    // Réponse d'erreur sécurisée
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      retry_possible: true
    });
  }
}

/**
 * Configuration API Route
 * Limite de taille pour sécurité
 */
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};