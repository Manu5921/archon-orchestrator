// TrustBoost Phase 4 - Onboarding Step 1
// Agent 4: Business & Commercial Engineer
// OBJECTIF: 0 to dashboard en <5min, completion >80%

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Components
import Header from '../../components/Header';
import CTAButton from '../../components/CTAButton';

/**
 * Étape 1: Configuration compte utilisateur
 * Collecte minimale d'informations pour réduire friction
 * MÉTRIQUE: Completion rate >80%
 */
export default function OnboardingStep1() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    companySize: '',
    useCase: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Options pour les selecteurs
  const roleOptions = [
    'CEO/Founder',
    'Product Manager',
    'Marketing Manager',
    'Data Analyst',
    'Developer',
    'Growth Manager',
    'Autre'
  ];

  const companySizeOptions = [
    '1-10 employés',
    '11-50 employés', 
    '51-200 employés',
    '201-1000 employés',
    '1000+ employés'
  ];

  const useCaseOptions = [
    'Réduire le churn utilisateur',
    'Améliorer l\'engagement',
    'Optimiser l\'onboarding',
    'Analytics comportementaux',
    'Prédictions IA',
    'Autre'
  ];

  // Analytics tracking
  useEffect(() => {
    // Track onboarding start
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'onboarding_started', {
        event_category: 'Onboarding',
        event_label: 'Step 1',
        step: 1
      });
    }

    // Pré-remplir l'email si fourni en paramètre
    const { email } = router.query;
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
  }, [router.query]);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est obligatoire';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est obligatoire';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email invalide';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Le nom de l\'entreprise est obligatoire';
    }

    if (!formData.role) {
      newErrors.role = 'Veuillez sélectionner votre rôle';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion de soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Sauvegarde des données utilisateur
      const response = await fetch('/api/onboarding/save-user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step: 1,
          userData: formData,
          timestamp: new Date().toISOString(),
          source: 'onboarding_flow'
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erreur sauvegarde');
      }

      // Analytics tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'onboarding_step1_completed', {
          event_category: 'Onboarding',
          event_label: 'Step 1 Completed',
          company_size: formData.companySize,
          use_case: formData.useCase
        });
      }

      // Transition vers étape 2
      router.push('/onboarding/step2');

    } catch (error) {
      console.error('Erreur onboarding step 1:', error);
      
      // Analytics error tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'onboarding_step1_error', {
          event_category: 'Error',
          event_label: error.message
        });
      }

      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler pour changements de champs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error pour ce champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <>
      <Head>
        <title>Configuration compte - TrustBoost Onboarding</title>
        <meta name="description" content="Étape 1: Configurez votre compte TrustBoost en 2 minutes. Informations de base pour personnaliser votre expérience." />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Progress Bar */}
        <div className="pt-16 bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Configuration de votre compte
              </h2>
              <span className="text-sm text-gray-500">
                Étape 1 sur 3
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: '33%' }}
              />
            </div>
          </div>
        </div>

        {/* Formulaire principal */}
        <main className="py-12">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* En-tête */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Bienvenue sur TrustBoost ! 👋
                </h1>
                <p className="text-lg text-gray-600">
                  Quelques informations pour personnaliser votre expérience.
                  <br />
                  <strong>Temps estimé: 2 minutes</strong>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom et prénom */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Votre prénom"
                      autoComplete="given-name"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Votre nom"
                      autoComplete="family-name"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email professionnel *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="votre.email@entreprise.com"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Entreprise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.company ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nom de votre entreprise"
                    autoComplete="organization"
                  />
                  {errors.company && (
                    <p className="text-red-500 text-sm mt-1">{errors.company}</p>
                  )}
                </div>

                {/* Rôle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Votre rôle *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.role ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionnez votre rôle</option>
                    {roleOptions.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                  )}
                </div>

                {/* Taille entreprise et cas d'usage (optionnels pour réduire friction) */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taille de l'entreprise
                    </label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => handleInputChange('companySize', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionnez la taille</option>
                      {companySizeOptions.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Principal cas d'usage
                    </label>
                    <select
                      value={formData.useCase}
                      onChange={(e) => handleInputChange('useCase', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionnez un cas d'usage</option>
                      {useCaseOptions.map(useCase => (
                        <option key={useCase} value={useCase}>{useCase}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6">
                  <CTAButton
                    type="submit"
                    fullWidth
                    loading={isLoading}
                    className="mb-4"
                    trackingLabel="Onboarding Step 1 Continue"
                  >
                    Continuer vers l'étape 2 →
                  </CTAButton>

                  <p className="text-center text-sm text-gray-500">
                    <span className="text-green-600">✓</span> Aucune carte bancaire requise
                    <span className="mx-2">•</span>
                    <span className="text-green-600">✓</span> Essai gratuit 7 jours
                  </p>
                </div>
              </form>
            </div>

            {/* Aide et support */}
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Une question ? 
                <a 
                  href="/support" 
                  className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
                >
                  Notre équipe peut vous aider
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}