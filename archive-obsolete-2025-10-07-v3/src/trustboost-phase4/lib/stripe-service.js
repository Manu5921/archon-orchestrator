// TrustBoost Phase 4 - Stripe Payment Service
// Agent 4: Business & Commercial Engineer
// OBLIGATORY Context7 Pattern: /stripe/stripe-js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Configuration des plans TrustBoost
 * MÉTRIQUE OBLIGATOIRE: Conversion rate >5%
 */
const PRICING_PLANS = {
  STARTER: {
    id: 'price_starter_trustboost',
    name: 'Starter',
    price: 29,
    currency: 'eur',
    interval: 'month',
    features: [
      'Jusqu\'à 1000 utilisateurs',
      'Tableau de bord basique',
      'Support email',
      'Intégrations API limitées'
    ]
  },
  PROFESSIONAL: {
    id: 'price_pro_trustboost',
    name: 'Professional',
    price: 99,
    currency: 'eur',
    interval: 'month',
    features: [
      'Jusqu\'à 10000 utilisateurs',
      'Analytics avancés',
      'Support prioritaire',
      'Toutes les intégrations API',
      'Webhooks personnalisés'
    ]
  },
  ENTERPRISE: {
    id: 'price_enterprise_trustboost',
    name: 'Enterprise',
    price: 299,
    currency: 'eur',
    interval: 'month',
    features: [
      'Utilisateurs illimités',
      'Déploiement sur site',
      'Support dédié 24/7',
      'SLA garanti',
      'Formation équipe'
    ]
  }
};

/**
 * Service Stripe pour TrustBoost
 * Pattern Context7 pour intégration robuste
 */
class StripeService {
  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY est requis pour le service de paiement');
    }
    
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      console.warn('⚠️ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY manquant pour le frontend');
    }
  }

  /**
   * Création d'une session Stripe Checkout pour l'onboarding
   * OBJECTIF: 0 to dashboard en <5min
   */
  async createCheckoutSession({
    priceId,
    customerEmail,
    customerData = {},
    successUrl,
    cancelUrl,
    trialDays = 7
  }) {
    try {
      // Configuration de base pour la session
      const sessionConfig = {
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        success_url: successUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/onboarding/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
        
        // Période d'essai pour améliorer conversion
        subscription_data: {
          trial_period_days: trialDays,
          metadata: {
            source: 'trustboost_onboarding',
            plan: this.getPlanByPriceId(priceId)?.name || 'unknown'
          }
        },
        
        // Configuration client
        customer_email: customerEmail,
        
        // Métadonnées pour tracking conversion
        metadata: {
          source: 'onboarding_flow',
          customer_email: customerEmail,
          plan_selected: this.getPlanByPriceId(priceId)?.name || 'unknown',
          signup_timestamp: new Date().toISOString()
        },

        // Collecte d'informations supplémentaires
        billing_address_collection: 'required',
        
        // Configuration des taxes automatiques
        automatic_tax: {
          enabled: true,
        },
        
        // Personnalisation de l'interface
        custom_text: {
          submit: {
            message: 'Commencez votre essai gratuit de 7 jours'
          }
        }
      };

      // Ajout des données client si disponibles
      if (customerData.name || customerData.company) {
        sessionConfig.customer_creation = 'always';
        sessionConfig.custom_fields = [];
        
        if (customerData.company) {
          sessionConfig.custom_fields.push({
            key: 'company',
            label: {
              type: 'custom',
              custom: 'Nom de l\'entreprise'
            },
            type: 'text',
            optional: false
          });
        }
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);

      return {
        success: true,
        sessionId: session.id,
        url: session.url,
        customer: session.customer
      };

    } catch (error) {
      console.error('❌ Erreur création session Checkout:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Gestion des webhooks Stripe pour automatisation
   * Intégration avec EmailService pour notifications
   */
  async handleWebhook(body, signature) {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      console.log('📥 Webhook Stripe reçu:', event.type);

      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object);
          break;
          
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
          
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;
          
        case 'customer.subscription.trial_will_end':
          await this.handleTrialWillEnd(event.data.object);
          break;
          
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;

        default:
          console.log(`📋 Webhook non géré: ${event.type}`);
      }

      return { success: true, processed: event.type };

    } catch (error) {
      console.error('❌ Erreur webhook Stripe:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Traitement checkout complété - début onboarding
   */
  async handleCheckoutCompleted(session) {
    try {
      const customer = await stripe.customers.retrieve(session.customer);
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      
      // Données pour email service
      const userData = {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        company: customer.metadata.company || '',
        plan: subscription.items.data[0].price.nickname || 'Unknown Plan',
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
      };

      console.log('✅ Checkout complété pour:', userData.email);

      // Trigger email welcome via integration
      if (global.emailService) {
        await global.emailService.sendWelcomeEmail(userData.email, userData);
      }

      return userData;

    } catch (error) {
      console.error('❌ Erreur traitement checkout:', error);
    }
  }

  /**
   * Traitement paiement réussi
   */
  async handlePaymentSucceeded(invoice) {
    try {
      const customer = await stripe.customers.retrieve(invoice.customer);
      
      const paymentData = {
        customer_name: customer.name,
        customer_email: customer.email,
        amount: (invoice.amount_paid / 100).toFixed(2),
        currency: invoice.currency.toUpperCase(),
        invoice_url: invoice.hosted_invoice_url,
        billing_date: new Date(invoice.created * 1000).toLocaleDateString('fr-FR'),
        payment_intent_id: invoice.payment_intent
      };

      console.log('💳 Paiement réussi pour:', customer.email);

      // Trigger email confirmation
      if (global.emailService) {
        await global.emailService.sendPaymentConfirmation(customer.email, paymentData);
      }

      return paymentData;

    } catch (error) {
      console.error('❌ Erreur traitement paiement:', error);
    }
  }

  /**
   * Gestion fin de période d'essai
   * MÉTRIQUE: Conversion trial -> paid >5%
   */
  async handleTrialWillEnd(subscription) {
    try {
      const customer = await stripe.customers.retrieve(subscription.customer);
      
      const trialData = {
        user_id: customer.id,
        user_name: customer.name,
        user_email: customer.email,
        days_remaining: Math.ceil((subscription.trial_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24)),
        plan_name: subscription.items.data[0].price.nickname || 'Plan',
        // TODO: Ajouter usage stats depuis analytics
        features_used: [],
        usage_stats: {}
      };

      console.log('⏰ Fin d\'essai proche pour:', customer.email);

      // Trigger email rappel
      if (global.emailService) {
        await global.emailService.sendTrialReminder(customer.email, trialData);
      }

      return trialData;

    } catch (error) {
      console.error('❌ Erreur traitement fin essai:', error);
    }
  }

  /**
   * Création d'un portail client pour gestion abonnement
   */
  async createCustomerPortal(customerId, returnUrl) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing`,
      });

      return {
        success: true,
        url: session.url
      };

    } catch (error) {
      console.error('❌ Erreur création portail client:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Récupération des informations d'abonnement
   */
  async getCustomerSubscription(customerId) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        limit: 1
      });

      if (subscriptions.data.length === 0) {
        return { success: false, error: 'Aucun abonnement trouvé' };
      }

      const subscription = subscriptions.data[0];
      const plan = this.getPlanByPriceId(subscription.items.data[0].price.id);

      return {
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000),
          current_period_end: new Date(subscription.current_period_end * 1000),
          trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
          plan: plan,
          amount: subscription.items.data[0].price.unit_amount / 100,
          currency: subscription.items.data[0].price.currency
        }
      };

    } catch (error) {
      console.error('❌ Erreur récupération abonnement:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Métriques business et analytics conversion
   */
  async getConversionMetrics(startDate, endDate) {
    try {
      // Récupération des sessions checkout
      const checkoutSessions = await stripe.checkout.sessions.list({
        created: {
          gte: Math.floor(startDate.getTime() / 1000),
          lte: Math.floor(endDate.getTime() / 1000)
        },
        limit: 100
      });

      // Récupération des abonnements
      const subscriptions = await stripe.subscriptions.list({
        created: {
          gte: Math.floor(startDate.getTime() / 1000),
          lte: Math.floor(endDate.getTime() / 1000)
        },
        limit: 100
      });

      const metrics = {
        total_sessions: checkoutSessions.data.length,
        completed_sessions: checkoutSessions.data.filter(s => s.payment_status === 'paid').length,
        total_subscriptions: subscriptions.data.length,
        active_subscriptions: subscriptions.data.filter(s => s.status === 'active').length,
        trial_subscriptions: subscriptions.data.filter(s => s.status === 'trialing').length,
        conversion_rate: 0
      };

      // Calcul du taux de conversion
      if (metrics.total_sessions > 0) {
        metrics.conversion_rate = (metrics.completed_sessions / metrics.total_sessions * 100).toFixed(2);
      }

      return {
        success: true,
        metrics,
        period: { start: startDate, end: endDate }
      };

    } catch (error) {
      console.error('❌ Erreur métriques conversion:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Utilitaires
   */
  getPlanByPriceId(priceId) {
    return Object.values(PRICING_PLANS).find(plan => plan.id === priceId);
  }

  getAllPlans() {
    return PRICING_PLANS;
  }
}

// Instance singleton
const stripeService = new StripeService();

module.exports = {
  stripeService,
  PRICING_PLANS,
  
  // Fonctions directes
  createCheckoutSession: (data) => stripeService.createCheckoutSession(data),
  handleWebhook: (body, signature) => stripeService.handleWebhook(body, signature),
  createCustomerPortal: (customerId, returnUrl) => stripeService.createCustomerPortal(customerId, returnUrl),
  getCustomerSubscription: (customerId) => stripeService.getCustomerSubscription(customerId),
  getConversionMetrics: (start, end) => stripeService.getConversionMetrics(start, end)
};