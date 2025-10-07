// TrustBoost Phase 4 - Email Service with SendGrid
// Agent 4: Business & Commercial Engineer
// OBLIGATORY Context7 Pattern: /sendgrid/sendgrid-nodejs

const sgMail = require('@sendgrid/mail');
const sgClient = require('@sendgrid/client');

/**
 * Configuration centralisée pour les emails TrustBoost
 */
const EMAIL_CONFIG = {
  // Templates SendGrid pour l'onboarding
  TEMPLATES: {
    WELCOME: process.env.SENDGRID_TEMPLATE_WELCOME || 'd-welcome-trustboost',
    ONBOARDING_STEP1: process.env.SENDGRID_TEMPLATE_ONBOARDING_1 || 'd-onboarding-step-1',
    ONBOARDING_STEP2: process.env.SENDGRID_TEMPLATE_ONBOARDING_2 || 'd-onboarding-step-2',
    ONBOARDING_COMPLETE: process.env.SENDGRID_TEMPLATE_COMPLETE || 'd-onboarding-complete',
    PAYMENT_SUCCESS: process.env.SENDGRID_TEMPLATE_PAYMENT || 'd-payment-success',
    TRIAL_REMINDER: process.env.SENDGRID_TEMPLATE_TRIAL || 'd-trial-reminder',
    SUPPORT_TICKET: process.env.SENDGRID_TEMPLATE_SUPPORT || 'd-support-ticket'
  },
  
  // Configuration de base
  FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL || 'onboarding@trustboost.ai',
  FROM_NAME: process.env.SENDGRID_FROM_NAME || 'TrustBoost Team',
  REPLY_TO: process.env.SENDGRID_REPLY_TO || 'support@trustboost.ai',
  
  // Catégories pour analytics
  CATEGORIES: {
    ONBOARDING: 'onboarding',
    PAYMENT: 'payment', 
    SUPPORT: 'support',
    MARKETING: 'marketing'
  }
};

/**
 * Initialisation du service email
 */
class EmailService {
  constructor() {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY est requis pour le service email');
    }
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sgClient.setApiKey(process.env.SENDGRID_API_KEY);
    
    // Configuration EU data residency si spécifiée
    if (process.env.SENDGRID_DATA_RESIDENCY === 'eu') {
      sgClient.setDataResidency('eu');
      sgMail.setClient(sgClient);
    }
  }

  /**
   * Email de bienvenue lors de l'inscription
   * Utilise Context7 pattern pour onboarding automatisé
   */
  async sendWelcomeEmail(userEmail, userData = {}) {
    const msg = {
      to: userEmail,
      from: {
        email: EMAIL_CONFIG.FROM_EMAIL,
        name: EMAIL_CONFIG.FROM_NAME
      },
      replyTo: EMAIL_CONFIG.REPLY_TO,
      templateId: EMAIL_CONFIG.TEMPLATES.WELCOME,
      dynamicTemplateData: {
        user_name: userData.name || 'Nouvel utilisateur',
        company_name: userData.company || '',
        onboarding_url: `${process.env.NEXT_PUBLIC_SITE_URL}/onboarding/step1`,
        dashboard_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
        support_url: `${process.env.NEXT_PUBLIC_SITE_URL}/support`,
        ...userData
      },
      categories: [EMAIL_CONFIG.CATEGORIES.ONBOARDING],
      customArgs: {
        flow: 'welcome',
        user_id: userData.id || 'unknown'
      }
    };

    return await this.sendEmail(msg);
  }

  /**
   * Série d'emails d'onboarding pour 0 to dashboard en <5min
   * MÉTRIQUE OBLIGATOIRE: completion >80%
   */
  async sendOnboardingSequence(userEmail, userData = {}, step = 1) {
    const templates = {
      1: EMAIL_CONFIG.TEMPLATES.ONBOARDING_STEP1,
      2: EMAIL_CONFIG.TEMPLATES.ONBOARDING_STEP2
    };

    const stepData = {
      1: {
        title: 'Étape 1: Configuration de votre compte',
        next_step_url: `${process.env.NEXT_PUBLIC_SITE_URL}/onboarding/step2`,
        estimated_time: '2 minutes'
      },
      2: {
        title: 'Étape 2: Première intégration',
        next_step_url: `${process.env.NEXT_PUBLIC_SITE_URL}/onboarding/integration`,
        estimated_time: '3 minutes'
      }
    };

    const msg = {
      to: userEmail,
      from: {
        email: EMAIL_CONFIG.FROM_EMAIL,
        name: EMAIL_CONFIG.FROM_NAME
      },
      templateId: templates[step],
      dynamicTemplateData: {
        user_name: userData.name || 'Utilisateur',
        step_number: step,
        total_steps: 2,
        ...stepData[step],
        ...userData
      },
      categories: [EMAIL_CONFIG.CATEGORIES.ONBOARDING],
      customArgs: {
        flow: `onboarding_step_${step}`,
        user_id: userData.id || 'unknown'
      }
    };

    return await this.sendEmail(msg);
  }

  /**
   * Email de confirmation de paiement Stripe
   * Integration avec les webhooks Stripe
   */
  async sendPaymentConfirmation(userEmail, paymentData = {}) {
    const msg = {
      to: userEmail,
      from: {
        email: EMAIL_CONFIG.FROM_EMAIL,
        name: EMAIL_CONFIG.FROM_NAME
      },
      templateId: EMAIL_CONFIG.TEMPLATES.PAYMENT_SUCCESS,
      dynamicTemplateData: {
        user_name: paymentData.customer_name || 'Client',
        plan_name: paymentData.plan_name || '',
        amount: paymentData.amount || '',
        currency: paymentData.currency || 'EUR',
        invoice_url: paymentData.invoice_url || '',
        billing_date: paymentData.billing_date || new Date().toISOString(),
        dashboard_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
        ...paymentData
      },
      categories: [EMAIL_CONFIG.CATEGORIES.PAYMENT],
      customArgs: {
        flow: 'payment_success',
        payment_id: paymentData.payment_intent_id || 'unknown'
      }
    };

    return await this.sendEmail(msg);
  }

  /**
   * Support client intégré
   * MÉTRIQUE OBLIGATOIRE: response <2h
   */
  async sendSupportTicketNotification(ticketData = {}) {
    const msg = {
      to: EMAIL_CONFIG.REPLY_TO, // Internal support team
      from: {
        email: EMAIL_CONFIG.FROM_EMAIL,
        name: 'TrustBoost Support System'
      },
      templateId: EMAIL_CONFIG.TEMPLATES.SUPPORT_TICKET,
      dynamicTemplateData: {
        ticket_id: ticketData.id || '',
        user_email: ticketData.user_email || '',
        user_name: ticketData.user_name || '',
        subject: ticketData.subject || '',
        message: ticketData.message || '',
        priority: ticketData.priority || 'normal',
        created_at: ticketData.created_at || new Date().toISOString(),
        ticket_url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/tickets/${ticketData.id}`
      },
      categories: [EMAIL_CONFIG.CATEGORIES.SUPPORT],
      customArgs: {
        flow: 'support_ticket',
        ticket_id: ticketData.id || 'unknown'
      }
    };

    return await this.sendEmail(msg);
  }

  /**
   * Emails multiples pour démonstrations et onboarding
   * Pattern Context7 pour personnalisation
   */
  async sendBulkOnboardingEmails(recipients = []) {
    const emails = recipients.map(recipient => ({
      to: recipient.email,
      from: {
        email: EMAIL_CONFIG.FROM_EMAIL,
        name: EMAIL_CONFIG.FROM_NAME
      },
      templateId: EMAIL_CONFIG.TEMPLATES.WELCOME,
      dynamicTemplateData: {
        user_name: recipient.name || 'Utilisateur',
        company_name: recipient.company || '',
        onboarding_url: `${process.env.NEXT_PUBLIC_SITE_URL}/onboarding/step1?ref=${recipient.id}`,
        personalized_message: recipient.message || ''
      },
      categories: [EMAIL_CONFIG.CATEGORIES.ONBOARDING, EMAIL_CONFIG.CATEGORIES.MARKETING],
      customArgs: {
        flow: 'bulk_onboarding',
        recipient_id: recipient.id || 'unknown'
      }
    }));

    return await sgMail.send(emails);
  }

  /**
   * Rappel de trial - conversion optimization
   * MÉTRIQUE OBLIGATOIRE: Conversion rate >5%
   */
  async sendTrialReminder(userEmail, trialData = {}) {
    const msg = {
      to: userEmail,
      from: {
        email: EMAIL_CONFIG.FROM_EMAIL,
        name: EMAIL_CONFIG.FROM_NAME
      },
      templateId: EMAIL_CONFIG.TEMPLATES.TRIAL_REMINDER,
      dynamicTemplateData: {
        user_name: trialData.user_name || 'Utilisateur',
        days_remaining: trialData.days_remaining || 0,
        upgrade_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?upgrade=true`,
        features_used: trialData.features_used || [],
        usage_stats: trialData.usage_stats || {},
        ...trialData
      },
      categories: [EMAIL_CONFIG.CATEGORIES.MARKETING],
      customArgs: {
        flow: 'trial_reminder',
        user_id: trialData.user_id || 'unknown'
      }
    };

    return await this.sendEmail(msg);
  }

  /**
   * Méthode générique d'envoi avec gestion d'erreurs
   * Pattern Context7 pour robustesse
   */
  async sendEmail(msg) {
    try {
      const response = await sgMail.send(msg);
      
      // Log pour analytics business
      console.log('✅ Email envoyé avec succès:', {
        to: Array.isArray(msg.to) ? msg.to.length : 1,
        template: msg.templateId || 'custom',
        categories: msg.categories || [],
        timestamp: new Date().toISOString()
      });
      
      return {
        success: true,
        messageId: response[0].headers['x-message-id'],
        statusCode: response[0].statusCode
      };
      
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      
      if (error.response) {
        console.error('Response body:', error.response.body);
      }
      
      return {
        success: false,
        error: error.message,
        statusCode: error.code
      };
    }
  }

  /**
   * Analytics et tracking pour métriques business
   * Intégration avec conversion tracking
   */
  async getEmailStats(startDate, endDate, category = null) {
    try {
      const queryParams = {
        start_date: startDate,
        end_date: endDate,
        aggregated_by: 'day'
      };

      if (category) {
        queryParams.categories = category;
      }

      const request = {
        method: 'GET',
        url: '/v3/stats',
        qs: queryParams
      };

      const [response, body] = await sgClient.request(request);
      
      return {
        success: true,
        data: body,
        statusCode: response.statusCode
      };
      
    } catch (error) {
      console.error('❌ Erreur récupération stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Instance singleton pour l'application
const emailService = new EmailService();

// Export des fonctions principales
module.exports = {
  emailService,
  EMAIL_CONFIG,
  
  // Fonctions directes pour faciliter l'import
  sendWelcomeEmail: (email, data) => emailService.sendWelcomeEmail(email, data),
  sendOnboardingSequence: (email, data, step) => emailService.sendOnboardingSequence(email, data, step),
  sendPaymentConfirmation: (email, data) => emailService.sendPaymentConfirmation(email, data),
  sendSupportTicket: (data) => emailService.sendSupportTicketNotification(data),
  sendTrialReminder: (email, data) => emailService.sendTrialReminder(email, data),
  getEmailStats: (start, end, category) => emailService.getEmailStats(start, end, category)
};