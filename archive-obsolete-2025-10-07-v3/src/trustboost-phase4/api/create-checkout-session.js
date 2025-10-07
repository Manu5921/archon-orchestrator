// TrustBoost Phase 4 - API Stripe Checkout Session
// Agent 4: Business & Commercial Engineer
// Context7 Pattern: /stripe/stripe-js + /sendgrid/sendgrid-nodejs

import { stripeService } from '../../lib/stripe-service';
import { emailService } from '../../lib/email-service';

/**
 * API Route: Création session Stripe Checkout
 * MÉTRIQUE OBLIGATOIRE: Conversion rate >5%
 */
export default async function handler(req, res) {
  // Méthode POST uniquement
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const {
      priceId,
      planName,
      billingCycle,
      customerEmail,
      customerData = {},
      successUrl,
      cancelUrl
    } = req.body;

    // Validation des données requises
    if (!priceId || !customerEmail) {
      return res.status(400).json({
        error: 'priceId et customerEmail sont obligatoires'
      });
    }

    // Log pour analytics business
    console.log('🛒 Création session checkout:', {
      priceId,
      planName,
      billingCycle,
      customerEmail,
      timestamp: new Date().toISOString()
    });

    // Création de la session Stripe via notre service
    const sessionResult = await stripeService.createCheckoutSession({
      priceId,
      customerEmail,
      customerData: {
        ...customerData,
        planName,
        billingCycle,
        source: 'pricing_page'
      },
      successUrl,
      cancelUrl,
      trialDays: 7 // Période d'essai obligatoire pour conversion
    });

    if (!sessionResult.success) {
      console.error('❌ Erreur création session:', sessionResult.error);
      return res.status(500).json({
        error: 'Erreur lors de la création de la session de paiement'
      });
    }

    // Analytics de conversion - tracking session créée
    console.log('✅ Session checkout créée:', {
      sessionId: sessionResult.sessionId,
      planName,
      customerEmail,
      trialIncluded: true
    });

    // Optionnel: Email de confirmation de début d'essai
    // (sera envoyé via webhook checkout.session.completed)

    // Réponse avec les informations de session
    res.status(200).json({
      success: true,
      sessionId: sessionResult.sessionId,
      url: sessionResult.url,
      message: 'Session de paiement créée avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur API create-checkout-session:', error);
    
    // Log pour debugging
    console.error('Stack trace:', error.stack);
    
    res.status(500).json({
      error: 'Erreur serveur lors de la création de la session',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
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