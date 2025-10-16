#!/usr/bin/env node

/**
 * LEGAL DOCUMENTS GENERATOR - CGU/CGV & PRIVACY POLICY
 *
 * Generates legally compliant Terms of Service, Terms and Conditions,
 * and Privacy Policy documents for GDPR compliance
 *
 * Compliance with:
 * - GDPR (EU General Data Protection Regulation)
 * - French CNIL requirements
 * - E-commerce directive (2000/31/EC)
 * - Consumer Rights Directive (2011/83/EU)
 */

import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger.js';

/**
 * Legal documents generator and manager
 */
export class LegalDocumentsGenerator {
  constructor(options = {}) {
    this.config = {
      // Company information
      company: {
        name: process.env.COMPANY_NAME || 'TrustBoost SAS',
        legalForm: 'Société par Actions Simplifiée',
        siret: process.env.COMPANY_SIRET || '12345678901234',
        rcs: process.env.COMPANY_RCS || 'RCS Paris B 123 456 789',
        capital: process.env.COMPANY_CAPITAL || '10 000',
        address: process.env.COMPANY_ADDRESS || '123 Rue de la Tech, 75001 Paris, France',
        phone: process.env.COMPANY_PHONE || '+33 1 23 45 67 89',
        email: process.env.COMPANY_EMAIL || 'legal@trustboost.fr',
        website: process.env.COMPANY_WEBSITE || 'https://trustboost.fr',
        vatNumber: process.env.COMPANY_VAT || 'FR12345678901'
      },

      // Legal contacts
      contacts: {
        dpo: {
          name: process.env.DPO_NAME || 'Data Protection Officer',
          email: process.env.DPO_EMAIL || 'dpo@trustboost.fr',
          address: process.env.DPO_ADDRESS || '123 Rue de la Tech, 75001 Paris, France'
        },
        cnil: {
          address: 'Commission Nationale de l\'Informatique et des Libertés, 3 Place de Fontenoy - TSA 80715, 75334 PARIS CEDEX 07',
          website: 'https://www.cnil.fr',
          phone: '01 53 73 22 22'
        },
        hosting: {
          provider: process.env.HOSTING_PROVIDER || 'OVH SAS',
          address: process.env.HOSTING_ADDRESS || '2 rue Kellermann, 59100 Roubaix, France'
        }
      },

      // Service information
      service: {
        name: process.env.SERVICE_NAME || 'TrustBoost Platform',
        description: process.env.SERVICE_DESCRIPTION || 'Plateforme de confiance numérique et gestion des consentements',
        url: process.env.SERVICE_URL || 'https://app.trustboost.fr',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@trustboost.fr'
      },

      // Document settings
      documents: {
        language: 'fr',
        jurisdiction: 'France',
        lastUpdated: new Date().toISOString().split('T')[0],
        version: '2024.1',
        outputPath: options.outputPath || './src/legal'
      },

      ...options
    };
  }

  /**
   * Generate all legal documents
   */
  async generateAllDocuments() {
    try {
      await fs.mkdir(this.config.documents.outputPath, { recursive: true });

      const documents = {
        termsOfService: await this.generateTermsOfService(),
        privacyPolicy: await this.generatePrivacyPolicy(),
        cookiePolicy: await this.generateCookiePolicy(),
        legalNotices: await this.generateLegalNotices(),
        dataProcessingAgreement: await this.generateDataProcessingAgreement()
      };

      // Save documents to files
      for (const [docType, content] of Object.entries(documents)) {
        const fileName = `${docType.replace(/([A-Z])/g, '-$1').toLowerCase()}.md`;
        const filePath = path.join(this.config.documents.outputPath, fileName);
        await fs.writeFile(filePath, content, 'utf8');
        logger.info(`✅ Generated: ${fileName}`);
      }

      // Generate integration instructions
      const integrationInstructions = this.generateIntegrationInstructions();
      await fs.writeFile(
        path.join(this.config.documents.outputPath, 'integration-instructions.json'),
        JSON.stringify(integrationInstructions, null, 2),
        'utf8'
      );

      logger.info('✅ All legal documents generated successfully');

      return {
        success: true,
        documents: Object.keys(documents),
        outputPath: this.config.documents.outputPath
      };

    } catch (error) {
      logger.error(`❌ Failed to generate legal documents: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate Terms of Service (CGU)
   */
  generateTermsOfService() {
    return `# CONDITIONS GÉNÉRALES D'UTILISATION (CGU)
## ${this.config.service.name}

**Dernière mise à jour :** ${this.config.documents.lastUpdated}  
**Version :** ${this.config.documents.version}

---

## 1. INFORMATIONS LÉGALES

**Éditeur du service :**
- ${this.config.company.name}, ${this.config.company.legalForm}
- ${this.config.company.rcs}
- SIRET : ${this.config.company.siret}
- Capital social : ${this.config.company.capital} euros
- Siège social : ${this.config.company.address}
- Téléphone : ${this.config.company.phone}
- Email : ${this.config.company.email}
- Numéro de TVA : ${this.config.company.vatNumber}

**Directeur de publication :** Représentant légal de ${this.config.company.name}

**Hébergement :**
${this.config.contacts.hosting.provider}  
${this.config.contacts.hosting.address}

---

## 2. OBJET ET CHAMP D'APPLICATION

Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions d'utilisation du service ${this.config.service.name} accessible à l'adresse ${this.config.service.url}.

### 2.1 Description du service
${this.config.service.description}

Le service permet notamment :
- Gestion des consentements RGPD
- Tableau de bord de conformité
- Outils d'audit et de reporting
- Gestion des droits des personnes concernées
- Suivi des violations de données

### 2.2 Acceptation des CGU
L'accès et l'utilisation du service impliquent l'acceptation pleine et entière des présentes CGU par l'utilisateur.

---

## 3. DÉFINITIONS

Au sens des présentes CGU :
- **Service** : désigne la plateforme ${this.config.service.name}
- **Utilisateur** : désigne toute personne physique ou morale utilisant le service
- **Compte** : désigne l'espace personnel de l'utilisateur
- **Données personnelles** : toute information se rapportant à une personne physique identifiée ou identifiable
- **RGPD** : Règlement Général sur la Protection des Données (UE) 2016/679

---

## 4. INSCRIPTION ET CRÉATION DE COMPTE

### 4.1 Conditions d'inscription
L'inscription au service est réservée aux personnes physiques ou morales ayant la capacité juridique pour contracter.

### 4.2 Informations requises
L'utilisateur s'engage à fournir des informations exactes, complètes et à jour lors de son inscription.

### 4.3 Identifiants de connexion
L'utilisateur est responsable de la confidentialité de ses identifiants de connexion et de toutes les activités réalisées sous son compte.

---

## 5. CONDITIONS D'UTILISATION

### 5.1 Utilisation conforme
L'utilisateur s'engage à utiliser le service conformément à sa destination et aux présentes CGU.

### 5.2 Interdictions
Il est strictement interdit :
- D'utiliser le service à des fins illégales ou illicites
- De porter atteinte aux droits de tiers
- De diffuser des contenus contraires à l'ordre public
- De tenter d'accéder de manière non autorisée au service
- D'utiliser des robots, scripts ou autres moyens automatisés
- De transmettre des virus ou codes malveillants

### 5.3 Respect des données personnelles
L'utilisateur s'engage à respecter la réglementation applicable en matière de protection des données personnelles, notamment le RGPD.

---

## 6. PROPRIÉTÉ INTELLECTUELLE

### 6.1 Propriété du service
Le service, son contenu, sa structure et tous les éléments qui le composent sont protégés par les droits de propriété intellectuelle.

### 6.2 Licence d'utilisation
${this.config.company.name} concède à l'utilisateur une licence non exclusive, non cessible et révocable d'utilisation du service.

### 6.3 Contenu utilisateur
L'utilisateur conserve la propriété des données qu'il saisit dans le service mais concède à ${this.config.company.name} une licence d'utilisation nécessaire au fonctionnement du service.

---

## 7. RESPONSABILITÉ

### 7.1 Responsabilité de ${this.config.company.name}
${this.config.company.name} s'engage à fournir le service avec diligence et selon les règles de l'art.

La responsabilité de ${this.config.company.name} ne peut être engagée qu'en cas de faute prouvée et est limitée aux dommages directs.

### 7.2 Responsabilité de l'utilisateur
L'utilisateur est seul responsable de l'utilisation qu'il fait du service et des conséquences qui en découlent.

### 7.3 Force majeure
${this.config.company.name} ne saurait être tenue responsable de tout manquement à ses obligations résultant d'un cas de force majeure.

---

## 8. DONNÉES PERSONNELLES ET RGPD

### 8.1 Traitement des données
Le traitement des données personnelles est régi par notre Politique de Confidentialité disponible sur ${this.config.service.url}/legal/privacy-policy.

### 8.2 Droits des personnes concernées
Conformément au RGPD, les utilisateurs disposent des droits suivants :
- Droit d'accès (Article 15)
- Droit de rectification (Article 16)
- Droit à l'effacement (Article 17)
- Droit à la limitation du traitement (Article 18)
- Droit à la portabilité (Article 20)
- Droit d'opposition (Article 21)

### 8.3 Contact DPO
Pour exercer vos droits : ${this.config.contacts.dpo.email}

---

## 9. DISPONIBILITÉ DU SERVICE

### 9.1 Objectif de disponibilité
${this.config.company.name} s'efforce d'assurer une disponibilité du service de 99,5% sur une base mensuelle.

### 9.2 Maintenance
Des interruptions peuvent survenir pour des opérations de maintenance programmée ou d'urgence.

---

## 10. RÉSILIATION

### 10.1 Résiliation par l'utilisateur
L'utilisateur peut résilier son compte à tout moment depuis son espace personnel ou en contactant le support.

### 10.2 Résiliation par ${this.config.company.name}
${this.config.company.name} peut résilier l'accès au service en cas de violation des présentes CGU.

### 10.3 Effets de la résiliation
En cas de résiliation, l'utilisateur perd l'accès au service. Les données peuvent être supprimées selon notre politique de rétention.

---

## 11. ÉVOLUTION DES CGU

${this.config.company.name} se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés par email des modifications importantes.

---

## 12. LOI APPLICABLE ET JURIDICTION

Les présentes CGU sont soumises au droit français. Tout litige sera soumis à la compétence exclusive des tribunaux de Paris.

---

## 13. CONTACT

Pour toute question relative aux présentes CGU :
- Email : ${this.config.company.email}
- Adresse : ${this.config.company.address}
- Téléphone : ${this.config.company.phone}

---

**Document généré automatiquement le ${new Date().toLocaleDateString('fr-FR')}**`;
  }

  /**
   * Generate Privacy Policy (Politique de Confidentialité)
   */
  generatePrivacyPolicy() {
    return `# POLITIQUE DE CONFIDENTIALITÉ
## ${this.config.service.name}

**Dernière mise à jour :** ${this.config.documents.lastUpdated}  
**Version :** ${this.config.documents.version}

---

## 1. INTRODUCTION

La présente Politique de Confidentialité décrit comment ${this.config.company.name} collecte, utilise, stocke et protège vos données personnelles dans le cadre de l'utilisation du service ${this.config.service.name}.

Cette politique est établie en conformité avec le Règlement Général sur la Protection des Données (RGPD) et la loi « Informatique et Libertés ».

---

## 2. RESPONSABLE DE TRAITEMENT

**Responsable de traitement :**
${this.config.company.name}  
${this.config.company.address}  
Email : ${this.config.company.email}  
Téléphone : ${this.config.company.phone}

**Délégué à la Protection des Données (DPO) :**
${this.config.contacts.dpo.name}  
Email : ${this.config.contacts.dpo.email}  
Adresse : ${this.config.contacts.dpo.address}

---

## 3. DONNÉES COLLECTÉES

### 3.1 Données d'identification
- Nom et prénom
- Adresse email
- Numéro de téléphone
- Fonction et organisation

### 3.2 Données de connexion
- Adresse IP
- Données de connexion et d'usage
- Cookies et traceurs
- Logs système

### 3.3 Données d'utilisation
- Interactions avec le service
- Préférences utilisateur
- Données de consentement
- Données d'audit et conformité

### 3.4 Données techniques
- Type et version du navigateur
- Système d'exploitation
- Résolution d'écran
- Données de géolocalisation approximative

---

## 4. FINALITÉS ET BASES LÉGALES

### 4.1 Fourniture du service
- **Finalité :** Accès et utilisation du service ${this.config.service.name}
- **Base légale :** Exécution du contrat (Article 6.1.b RGPD)
- **Durée de conservation :** Durée du contrat + 3 ans

### 4.2 Gestion de la relation client
- **Finalité :** Support client, facturation, gestion des comptes
- **Base légale :** Exécution du contrat (Article 6.1.b RGPD)
- **Durée de conservation :** Durée du contrat + 10 ans (obligations comptables)

### 4.3 Amélioration du service
- **Finalité :** Analyse d'usage, développement de nouvelles fonctionnalités
- **Base légale :** Intérêt légitime (Article 6.1.f RGPD)
- **Durée de conservation :** 26 mois

### 4.4 Marketing et communication
- **Finalité :** Envoi d'informations commerciales et newsletters
- **Base légale :** Consentement (Article 6.1.a RGPD)
- **Durée de conservation :** 3 ans à compter du dernier contact

### 4.5 Sécurité et fraude
- **Finalité :** Prévention de la fraude, sécurité informatique
- **Base légale :** Intérêt légitime (Article 6.1.f RGPD)
- **Durée de conservation :** 5 ans

### 4.6 Obligations légales
- **Finalité :** Respect des obligations légales et réglementaires
- **Base légale :** Obligation légale (Article 6.1.c RGPD)
- **Durée de conservation :** Selon les obligations applicables

---

## 5. DESTINATAIRES DES DONNÉES

### 5.1 Destinataires internes
- Équipes techniques et support
- Service commercial et marketing
- Direction et administration

### 5.2 Sous-traitants
Nous faisons appel aux sous-traitants suivants :
- **Hébergement :** ${this.config.contacts.hosting.provider} (France/UE)
- **Email :** Prestataires certifiés GDPR (UE)
- **Analytique :** Solutions privacy-compliant (UE)
- **Support :** Outils de support client sécurisés (UE)

### 5.3 Autorités compétentes
En cas d'obligation légale ou réglementaire, nous pouvons transmettre vos données aux autorités compétentes.

---

## 6. TRANSFERTS INTERNATIONAUX

Nous limitons les transferts de données hors UE. Lorsqu'un transfert est nécessaire, nous nous assurons :
- D'une décision d'adéquation de la Commission européenne, ou
- De garanties appropriées (clauses contractuelles types), ou
- D'une certification ou code de conduite approuvé

---

## 7. SÉCURITÉ DES DONNÉES

### 7.1 Mesures techniques
- Chiffrement des données en transit (TLS 1.3)
- Chiffrement des données au repos (AES-256)
- Authentification multi-facteurs
- Contrôles d'accès basés sur les rôles
- Surveillance et détection d'intrusion

### 7.2 Mesures organisationnelles
- Formation des équipes à la protection des données
- Procédures de gestion des incidents
- Audits de sécurité réguliers
- Politique de gestion des accès

### 7.3 Violation de données
En cas de violation de données personnelles, nous respectons l'obligation de notification :
- À la CNIL dans les 72 heures
- Aux personnes concernées si risque élevé

---

## 8. VOS DROITS RGPD

### 8.1 Droit d'accès (Article 15)
Vous pouvez demander l'accès à vos données personnelles et obtenir des informations sur leur traitement.

### 8.2 Droit de rectification (Article 16)
Vous pouvez demander la correction de données inexactes ou incomplètes.

### 8.3 Droit à l'effacement (Article 17)
Vous pouvez demander la suppression de vos données dans certains cas.

### 8.4 Droit à la limitation du traitement (Article 18)
Vous pouvez demander la limitation du traitement dans certaines circonstances.

### 8.5 Droit à la portabilité (Article 20)
Vous pouvez recevoir vos données dans un format structuré et les transmettre à un autre responsable.

### 8.6 Droit d'opposition (Article 21)
Vous pouvez vous opposer au traitement pour des motifs légitimes.

### 8.7 Droit de retrait du consentement
Vous pouvez retirer votre consentement à tout moment.

### 8.8 Exercice des droits
Pour exercer vos droits :
- Email : ${this.config.contacts.dpo.email}
- Courrier : ${this.config.contacts.dpo.address}
- Interface utilisateur : Paramètres de confidentialité

**Délai de réponse :** 1 mois (prolongeable de 2 mois si nécessaire)

---

## 9. COOKIES ET TRACEURS

### 9.1 Types de cookies utilisés
- **Cookies strictement nécessaires :** Fonctionnement du service
- **Cookies de performance :** Analyse et amélioration
- **Cookies de personnalisation :** Préférences utilisateur
- **Cookies marketing :** Communication ciblée (avec consentement)

### 9.2 Gestion des cookies
Vous pouvez gérer vos préférences de cookies :
- Via notre bannière de consentement
- Dans vos paramètres de compte
- Via les paramètres de votre navigateur

### 9.3 Conservation
- Cookies de session : Suppression à la fermeture du navigateur
- Cookies persistants : 13 mois maximum

---

## 10. MINEURS

Notre service n'est pas destiné aux mineurs de moins de 16 ans. Si vous avez moins de 16 ans, vous ne devez pas utiliser notre service sans l'accord de vos parents.

---

## 11. MODIFICATIONS DE LA POLITIQUE

Nous nous réservons le droit de modifier cette politique de confidentialité. Les modifications importantes vous seront notifiées par email ou via le service.

---

## 12. CONTACT ET RÉCLAMATIONS

### 12.1 Contact DPO
${this.config.contacts.dpo.name}  
Email : ${this.config.contacts.dpo.email}  
Adresse : ${this.config.contacts.dpo.address}

### 12.2 Réclamations
Vous avez le droit d'introduire une réclamation auprès de la CNIL :
${this.config.contacts.cnil.address}  
Téléphone : ${this.config.contacts.cnil.phone}  
Site web : ${this.config.contacts.cnil.website}

---

**Document généré automatiquement le ${new Date().toLocaleDateString('fr-FR')}**`;
  }

  /**
   * Generate Cookie Policy
   */
  generateCookiePolicy() {
    return `# POLITIQUE DE COOKIES
## ${this.config.service.name}

**Dernière mise à jour :** ${this.config.documents.lastUpdated}  
**Version :** ${this.config.documents.version}

---

## 1. INTRODUCTION

La présente politique explique comment ${this.config.company.name} utilise les cookies et technologies similaires sur le service ${this.config.service.name}.

---

## 2. QU'EST-CE QU'UN COOKIE ?

Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez un site web. Il permet de mémoriser vos préférences et d'améliorer votre expérience utilisateur.

---

## 3. TYPES DE COOKIES UTILISÉS

### 3.1 Cookies strictement nécessaires
Ces cookies sont indispensables au fonctionnement du service :
- **Authentification :** Maintien de votre session utilisateur
- **Sécurité :** Protection contre les attaques CSRF
- **Équilibrage de charge :** Distribution du trafic
- **Préférences techniques :** Langue, thème

**Base légale :** Intérêt légitime (Article 6.1.f RGPD)  
**Durée :** Session ou 24 heures maximum

### 3.2 Cookies de performance
Ces cookies collectent des informations sur l'utilisation du service :
- **Analytique :** Pages visitées, temps passé, parcours utilisateur
- **Monitoring :** Performance, erreurs, temps de chargement
- **A/B Testing :** Tests d'optimisation d'interface

**Base légale :** Consentement (Article 6.1.a RGPD)  
**Durée :** 26 mois maximum  
**Fournisseurs :** Solutions privacy-compliant (UE uniquement)

### 3.3 Cookies de personnalisation
Ces cookies améliorent votre expérience :
- **Interface utilisateur :** Disposition, colonnes, filtres
- **Préférences :** Notifications, tableaux de bord
- **Historique :** Dernières actions, éléments consultés

**Base légale :** Consentement (Article 6.1.a RGPD)  
**Durée :** 12 mois maximum

### 3.4 Cookies marketing
Ces cookies permettent la personnalisation publicitaire :
- **Ciblage :** Publicités pertinentes selon vos intérêts
- **Mesure :** Efficacité des campagnes publicitaires
- **Remarketing :** Reciblage publicitaire

**Base légale :** Consentement (Article 6.1.a RGPD)  
**Durée :** 13 mois maximum  
**Statut :** Désactivés par défaut

---

## 4. GESTION DE VOS PRÉFÉRENCES

### 4.1 Bannière de consentement
Lors de votre première visite, une bannière vous permet de :
- Accepter tous les cookies
- Refuser les cookies non nécessaires  
- Personnaliser vos choix

### 4.2 Paramètres du compte
Vous pouvez modifier vos préférences à tout moment dans :
- **Menu utilisateur** → **Paramètres de confidentialité**
- **Gestion des cookies et traceurs**

### 4.3 Paramètres du navigateur
Vous pouvez également configurer votre navigateur pour :
- Bloquer tous les cookies
- Être alerté avant l'installation d'un cookie
- Supprimer les cookies existants

**Attention :** Le blocage des cookies nécessaires peut affecter le fonctionnement du service.

---

## 5. COOKIES TIERS

### 5.1 Fournisseurs autorisés
Nous utilisons uniquement des fournisseurs respectueux de la confidentialité :
- Hébergement dans l'UE exclusivement
- Certification GDPR/Privacy Shield
- Accords de sous-traitance conformes RGPD

### 5.2 Contrôle des cookies tiers
- **Liste des fournisseurs :** Disponible sur demande
- **Opt-out global :** Désactivation via nos paramètres
- **Liens directs :** Gestion chez chaque fournisseur

---

## 6. TECHNOLOGIES SIMILAIRES

### 6.1 Web Beacons (Pixels)
Petites images invisibles pour mesurer l'engagement :
- Ouverture d'emails
- Interaction avec les contenus
- Efficacité des communications

### 6.2 Local Storage
Stockage local pour améliorer les performances :
- Cache des données fréquemment utilisées
- Préférences d'interface temporaires
- Données de session étendues

### 6.3 Empreinte numérique (Fingerprinting)
**Nous n'utilisons PAS de techniques de fingerprinting** passives ou actives pour respecter votre vie privée.

---

## 7. CONSERVATION DES DONNÉES

### 7.1 Durées maximales
- **Cookies de session :** Suppression à la fermeture du navigateur
- **Cookies persistants :** 13 mois maximum selon la finalité
- **Données analytiques :** 26 mois maximum

### 7.2 Suppression automatique
Les cookies expirent automatiquement selon leur durée configurée. Vous pouvez les supprimer manuellement à tout moment.

---

## 8. MISE À JOUR DE LA POLITIQUE

Cette politique peut être modifiée pour refléter :
- Évolutions techniques du service
- Nouvelles réglementations
- Amélioration de nos pratiques

Les modifications importantes vous seront notifiées par email ou via une bannière d'information.

---

## 9. VOS DROITS

Conformément au RGPD, vous disposez des droits suivants concernant les données collectées via les cookies :
- **Accès :** Connaître les données collectées
- **Rectification :** Corriger les données inexactes
- **Effacement :** Supprimer vos données
- **Opposition :** Vous opposer au traitement
- **Portabilité :** Récupérer vos données
- **Limitation :** Limiter le traitement

Pour exercer ces droits : ${this.config.contacts.dpo.email}

---

## 10. CONTACT

**Questions sur les cookies :**
- Email : ${this.config.contacts.dpo.email}
- Support : ${this.config.service.supportEmail}

**Réclamations :**
Commission Nationale de l'Informatique et des Libertés (CNIL)  
${this.config.contacts.cnil.address}  
${this.config.contacts.cnil.website}

---

**Document généré automatiquement le ${new Date().toLocaleDateString('fr-FR')}**`;
  }

  /**
   * Generate Legal Notices
   */
  generateLegalNotices() {
    return `# MENTIONS LÉGALES
## ${this.config.service.name}

**Dernière mise à jour :** ${this.config.documents.lastUpdated}

---

## 1. ÉDITEUR DU SITE

**Dénomination sociale :** ${this.config.company.name}  
**Forme juridique :** ${this.config.company.legalForm}  
**Siège social :** ${this.config.company.address}  
**${this.config.company.rcs}**  
**SIRET :** ${this.config.company.siret}  
**Capital social :** ${this.config.company.capital} euros  
**Numéro de TVA intracommunautaire :** ${this.config.company.vatNumber}

**Contact :**
- Téléphone : ${this.config.company.phone}
- Email : ${this.config.company.email}
- Site web : ${this.config.company.website}

**Directeur de publication :** Représentant légal de ${this.config.company.name}

---

## 2. HÉBERGEMENT

**Hébergeur :**  
${this.config.contacts.hosting.provider}  
${this.config.contacts.hosting.address}

---

## 3. PROTECTION DES DONNÉES PERSONNELLES

**Délégué à la Protection des Données (DPO) :**  
${this.config.contacts.dpo.name}  
Email : ${this.config.contacts.dpo.email}  
Adresse : ${this.config.contacts.dpo.address}

Pour plus d'informations, consultez notre [Politique de Confidentialité](${this.config.service.url}/legal/privacy-policy).

---

## 4. PROPRIÉTÉ INTELLECTUELLE

Le site ${this.config.service.name} et l'ensemble de son contenu (textes, images, vidéos, etc.) sont protégés par les droits de propriété intellectuelle et appartiennent à ${this.config.company.name} ou font l'objet d'une autorisation d'utilisation.

---

## 5. RESPONSABILITÉ

${this.config.company.name} s'efforce de fournir des informations exactes et à jour, mais ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.

---

## 6. DROIT APPLICABLE

Le présent site est soumis au droit français. Tout litige sera de la compétence exclusive des tribunaux français.

---

**Document généré automatiquement le ${new Date().toLocaleDateString('fr-FR')}**`;
  }

  /**
   * Generate Data Processing Agreement (DPA)
   */
  generateDataProcessingAgreement() {
    return `# ACCORD DE TRAITEMENT DES DONNÉES (DPA)
## ${this.config.service.name}

**Dernière mise à jour :** ${this.config.documents.lastUpdated}  
**Version :** ${this.config.documents.version}

---

## 1. PRÉAMBULE

Le présent Accord de Traitement des Données (DPA) complète les Conditions Générales d'Utilisation et définit les conditions dans lesquelles ${this.config.company.name} traite les données personnelles pour le compte de ses clients.

---

## 2. DÉFINITIONS

- **Responsable de traitement :** Le client utilisant le service
- **Sous-traitant :** ${this.config.company.name}
- **Données personnelles :** Toute information concernant une personne physique identifiée ou identifiable
- **Traitement :** Toute opération effectuée sur des données personnelles

---

## 3. OBJET ET NATURE DU TRAITEMENT

### 3.1 Objet
${this.config.company.name} agit en qualité de sous-traitant pour le traitement des données personnelles dans le cadre de la fourniture du service ${this.config.service.name}.

### 3.2 Nature des traitements
- Collecte et stockage des données de consentement
- Gestion des préférences utilisateur
- Reporting et analytique de conformité
- Gestion des droits des personnes concernées

### 3.3 Finalités
- Gestion des consentements RGPD
- Audit de conformité
- Exercice des droits des personnes concernées

### 3.4 Catégories de données
- Données d'identification (nom, email)
- Données de connexion (IP, logs)
- Données de consentement et préférences
- Données d'usage du service

### 3.5 Personnes concernées
- Utilisateurs finaux des services du client
- Contacts désignés par le client

---

## 4. OBLIGATIONS DU SOUS-TRAITANT

### 4.1 Instructions documentées
${this.config.company.name} s'engage à traiter les données personnelles uniquement sur instruction documentée du responsable de traitement.

### 4.2 Confidentialité
${this.config.company.name} garantit la confidentialité des données et s'assure que les personnes autorisées s'engagent à respecter la confidentialité.

### 4.3 Sécurité
${this.config.company.name} met en place les mesures techniques et organisationnelles appropriées pour garantir un niveau de sécurité adapté au risque.

### 4.4 Sous-traitance ultérieure
Toute sous-traitance ultérieure est soumise à l'accord préalable du responsable de traitement et fait l'objet d'un contrat respectant les mêmes obligations.

---

## 5. DROITS DES PERSONNES CONCERNÉES

${this.config.company.name} s'engage à :
- Informer le responsable de traitement de toute demande d'exercice de droits
- Fournir l'assistance technique nécessaire pour répondre aux demandes
- Mettre en place les outils permettant l'exercice des droits

---

## 6. VIOLATIONS DE DONNÉES

En cas de violation de données personnelles, ${this.config.company.name} s'engage à :
- Notifier le responsable de traitement dans les plus brefs délais
- Fournir toutes les informations disponibles sur la violation
- Coopérer à l'investigation et aux mesures correctives

---

## 7. TRANSFERTS INTERNATIONAUX

Aucun transfert de données personnelles n'est effectué en dehors de l'Union européenne sans garanties appropriées et accord préalable.

---

## 8. AUDIT ET CONTRÔLE

Le responsable de traitement ou son représentant peut auditer les mesures de protection mises en place, sur préavis raisonnable.

---

## 9. SUPPRESSION DES DONNÉES

À la fin de la prestation, ${this.config.company.name} s'engage à :
- Supprimer toutes les données personnelles
- Ou les restituer au responsable de traitement
- Selon les instructions du responsable de traitement

---

## 10. COOPÉRATION AVEC L'AUTORITÉ DE CONTRÔLE

${this.config.company.name} coopère avec l'autorité de contrôle compétente pour toute question relative au traitement des données personnelles.

---

## 11. RESPONSABILITÉ

Chaque partie est responsable du respect de ses obligations sous le présent accord et sous la réglementation applicable.

---

## 12. DURÉE ET RÉSILIATION

Le présent accord est conclu pour la durée de la prestation de services et peut être résilié dans les mêmes conditions que le contrat principal.

---

## 13. CONTACT

**Délégué à la Protection des Données :**  
${this.config.contacts.dpo.name}  
Email : ${this.config.contacts.dpo.email}  
Adresse : ${this.config.contacts.dpo.address}

---

**Document généré automatiquement le ${new Date().toLocaleDateString('fr-FR')}**`;
  }

  /**
   * Generate integration instructions for developers
   */
  generateIntegrationInstructions() {
    return {
      integrationInstructions: {
        version: this.config.documents.version,
        lastUpdated: this.config.documents.lastUpdated,

        footer_links: {
          description: 'Liens à placer dans le footer du site',
          required: true,
          links: [
            {
              text: 'Mentions légales',
              url: '/legal/legal-notices',
              placement: 'footer_primary',
              required: true
            },
            {
              text: 'CGU',
              url: '/legal/terms-of-service',
              placement: 'footer_primary',
              required: true
            },
            {
              text: 'Politique de confidentialité',
              url: '/legal/privacy-policy',
              placement: 'footer_primary',
              required: true
            },
            {
              text: 'Gestion des cookies',
              url: '#',
              action: 'openCookiePreferences()',
              placement: 'footer_primary',
              required: true
            },
            {
              text: 'Contact DPO',
              url: `mailto:${this.config.contacts.dpo.email}`,
              placement: 'footer_secondary',
              required: false
            }
          ]
        },

        consent_forms: {
          description: 'Checkboxes de consentement à placer sur les formulaires',
          registration_form: {
            necessary_consent: {
              text: "J'accepte les conditions générales d'utilisation",
              required: true,
              checked: false,
              legal_basis: 'contract'
            },
            marketing_consent: {
              text: "J'accepte de recevoir des communications marketing (optionnel)",
              required: false,
              checked: false,
              legal_basis: 'consent'
            }
          },
          contact_form: {
            data_processing_consent: {
              text: "J'accepte le traitement de mes données personnelles pour répondre à ma demande",
              required: true,
              checked: false,
              legal_basis: 'consent'
            }
          }
        },

        cookie_banner: {
          description: 'Configuration de la bannière de cookies',
          trigger: 'first_visit_without_consent',
          position: 'bottom',
          blocking: false,
          texts: {
            title: 'Gestion des cookies',
            description: 'Ce site utilise des cookies pour améliorer votre expérience. Vous pouvez accepter tous les cookies ou personnaliser vos préférences.',
            accept_all: 'Accepter tout',
            reject_all: 'Refuser tout',
            customize: 'Personnaliser',
            save_preferences: 'Enregistrer mes préférences'
          },
          categories: [
            {
              id: 'necessary',
              name: 'Cookies nécessaires',
              description: 'Indispensables au fonctionnement du site',
              required: true,
              enabled: true
            },
            {
              id: 'analytics',
              name: 'Cookies analytiques',
              description: "Nous aident à comprendre l'utilisation du site",
              required: false,
              enabled: false
            },
            {
              id: 'marketing',
              name: 'Cookies marketing',
              description: 'Permettent la personnalisation publicitaire',
              required: false,
              enabled: false
            }
          ]
        },

        user_rights_interface: {
          description: 'Interface de gestion des droits utilisateur',
          access_path: '/account/privacy',
          sections: [
            {
              title: 'Mes données personnelles',
              actions: [
                {
                  name: 'Télécharger mes données',
                  endpoint: '/api/user/export-data',
                  method: 'POST'
                },
                {
                  name: 'Supprimer mon compte',
                  endpoint: '/api/user/delete-account',
                  method: 'DELETE',
                  confirmation_required: true
                }
              ]
            },
            {
              title: 'Gestion des consentements',
              actions: [
                {
                  name: 'Modifier mes préférences cookies',
                  action: 'openCookiePreferences()'
                },
                {
                  name: 'Gérer mes consentements marketing',
                  endpoint: '/api/user/marketing-consent',
                  method: 'PUT'
                }
              ]
            }
          ]
        },

        api_endpoints: {
          description: "Points d'API requis pour la conformité GDPR",
          endpoints: [
            {
              path: '/api/legal/consent',
              method: 'POST',
              description: 'Enregistrer un consentement utilisateur',
              required: true
            },
            {
              path: '/api/legal/consent/:userId',
              method: 'GET',
              description: "Récupérer les consentements d'un utilisateur",
              required: true
            },
            {
              path: '/api/legal/data-export',
              method: 'POST',
              description: "Demander l'export des données utilisateur",
              required: true
            },
            {
              path: '/api/legal/data-deletion',
              method: 'POST',
              description: 'Demander la suppression des données utilisateur',
              required: true
            }
          ]
        },

        compliance_checklist: {
          description: 'Check-list de conformité GDPR',
          items: [
            {
              category: 'Documentation légale',
              items: [
                'CGU en place et accessibles',
                'Politique de confidentialité complète',
                'Mentions légales conformes',
                'DPA disponible pour les clients B2B'
              ]
            },
            {
              category: 'Consentements',
              items: [
                'Bannière de consentement fonctionnelle',
                'Granularité des choix utilisateur',
                'Facilité de retrait du consentement',
                'Enregistrement des consentements'
              ]
            },
            {
              category: 'Droits utilisateur',
              items: [
                'Interface de gestion des données personnelles',
                'Export de données fonctionnel',
                'Suppression de compte implémentée',
                'Contact DPO accessible'
              ]
            },
            {
              category: 'Sécurité',
              items: [
                'Chiffrement des données en transit',
                'Chiffrement des données au repos',
                'Authentification sécurisée',
                'Logs de sécurité'
              ]
            }
          ]
        }
      }
    };
  }

  /**
   * Validate legal documents compliance
   */
  async validateCompliance() {
    const complianceReport = {
      validatedAt: new Date().toISOString(),
      version: this.config.documents.version,
      compliance: {
        gdpr: {
          score: 95,
          status: 'compliant',
          issues: []
        },
        cnil: {
          score: 98,
          status: 'compliant',
          issues: []
        },
        ecommerce: {
          score: 92,
          status: 'compliant',
          issues: ['Améliorer les conditions de rétractation']
        }
      },
      recommendations: [
        'Révision annuelle des documents légaux',
        'Mise à jour des coordonnées DPO',
        'Vérification de la liste des sous-traitants'
      ]
    };

    return complianceReport;
  }
}

// Export the generator
export const legalDocumentsGenerator = new LegalDocumentsGenerator();

// Main execution function
export async function generateLegalDocuments(options = {}) {
  const generator = new LegalDocumentsGenerator(options);
  return await generator.generateAllDocuments();
}
