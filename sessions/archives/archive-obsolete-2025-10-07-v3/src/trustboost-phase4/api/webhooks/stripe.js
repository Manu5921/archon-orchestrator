// TrustBoost Phase 4 - Webhook Stripe
// Agent 4: Business & Commercial Engineer
// Context7 Pattern: /stripe/stripe-js + /sendgrid/sendgrid-nodejs

import { stripeService } from '../../../lib/stripe-service';
import { emailService } from '../../../lib/email-service';

/**
 * Webhook Stripe pour automatisation onboarding
 * OBJECTIF: 0 to dashboard en <5min
 */
export default async function handler(req, res) {
  // Méthode POST uniquement
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const signature = req.headers['stripe-signature'];

  if (!signature) {
    console.error('❌ Signature Stripe manquante');
    return res.status(400).json({ error: 'Signature manquante' });
  }

  try {
    // Traitement du webhook via notre service
    const result = await stripeService.handleWebhook(req.body, signature);

    if (!result.success) {
      console.error('❌ Erreur traitement webhook:', result.error);
      return res.status(400).json({ error: result.error });
    }

    console.log('✅ Webhook traité avec succès:', result.processed);

    // Réponse rapide à Stripe (important pour éviter les timeouts)
    res.status(200).json({
      received: true,
      processed: result.processed,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur webhook Stripe:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * Configuration API Route pour webhooks Stripe
 * IMPORTANT: bodyParser désactivé pour signature verification
 */
export const config = {
  api: {
    bodyParser: false
  }
};
