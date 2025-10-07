import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { legalDocumentsGenerator } from '../../src/gdpr-compliance/legal-documents.js';

interface PrivacyProps {
  privacy: {
    title: string;
    lastUpdated: string;
    content: any;
    legal: {
      jurisdiction: string;
      company: any;
      dpo: any;
    };
  };
  metadata: {
    canonical: string;
    structured: any;
  };
}

export default function PrivacyPage({ privacy, metadata }: PrivacyProps) {
  return (
    <>
      <Head>
        <title>{privacy.title} - TrustBoost Phase 4</title>
        <meta name="description" content="Politique de Confidentialité RGPD complète de TrustBoost Phase 4 - Protection des données personnelles" />
        <meta name="robots" content="index,follow" />
        <meta name="author" content="TrustBoost Phase 4" />
        <meta name="keywords" content="politique confidentialité,RGPD,données personnelles,privacy,protection,consentement" />
        <link rel="canonical" href={metadata.canonical} />
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(metadata.structured) }} 
        />
      </Head>

      <div className="legal-document-container">
        <header className="legal-header">
          <h1 className="legal-title">{privacy.title}</h1>
          <div className="legal-meta">
            <p className="last-updated">Dernière mise à jour : {new Date(privacy.lastUpdated).toLocaleDateString('fr-FR')}</p>
            <p className="rgpd-compliance">✅ Conforme RGPD (EU) 2016/679</p>
          </div>
        </header>

        <div className="gdpr-summary">
          <h2>🔒 Résumé de notre engagement RGPD</h2>
          <div className="gdpr-points">
            <div className="gdpr-point">
              <span className="gdpr-icon">🎯</span>
              <strong>Transparence totale</strong> : Nous détaillons tous les traitements de données
            </div>
            <div className="gdpr-point">
              <span className="gdpr-icon">⚖️</span>
              <strong>Vos droits respectés</strong> : Accès, rectification, suppression en <24h
            </div>
            <div className="gdpr-point">
              <span className="gdpr-icon">🔐</span>
              <strong>Sécurité maximale</strong> : Chiffrement AES-256 et protocoles sécurisés
            </div>
            <div className="gdpr-point">
              <span className="gdpr-icon">✋</span>
              <strong>Consentement granulaire</strong> : Choisissez précisément vos préférences
            </div>
          </div>
        </div>

        <nav className="legal-toc">
          <h2>Table des matières</h2>
          <ol>
            <li><a href="#responsable">1. Responsable du traitement</a></li>
            <li><a href="#donnees-collectees">2. Données collectées</a></li>
            <li><a href="#finalites">3. Finalités du traitement</a></li>
            <li><a href="#base-legale">4. Base légale</a></li>
            <li><a href="#consentement">5. Gestion du consentement</a></li>
            <li><a href="#duree-conservation">6. Durée de conservation</a></li>
            <li><a href="#destinataires">7. Destinataires des données</a></li>
            <li><a href="#transferts">8. Transferts hors UE</a></li>
            <li><a href="#droits">9. Vos droits RGPD</a></li>
            <li><a href="#securite">10. Sécurité des données</a></li>
            <li><a href="#cookies">11. Cookies et traceurs</a></li>
            <li><a href="#mineurs">12. Données des mineurs</a></li>
            <li><a href="#modifications">13. Modifications</a></li>
            <li><a href="#contact">14. Contact</a></li>
          </ol>
        </nav>

        <main className="legal-content">
          <section id="responsable" className="legal-section">
            <h2>1. Responsable du traitement</h2>
            <div className="company-card">
              <h3>TrustBoost Phase 4</h3>
              <p><strong>Adresse :</strong> {privacy.legal.company.address}</p>
              <p><strong>Email :</strong> <a href={`mailto:${privacy.legal.company.email}`}>{privacy.legal.company.email}</a></p>
              <p><strong>SIRET :</strong> {privacy.legal.company.siret}</p>
            </div>
            
            <div className="dpo-card">
              <h3>🛡️ Délégué à la Protection des Données (DPO)</h3>
              <p><strong>Contact :</strong> <a href={`mailto:${privacy.legal.dpo.email}`}>{privacy.legal.dpo.email}</a></p>
              <p><strong>Mission :</strong> Veiller au respect du RGPD et répondre à vos questions sur la protection des données.</p>
            </div>
          </section>

          <section id="donnees-collectees" className="legal-section">
            <h2>2. Données personnelles collectées</h2>
            
            <h3>2.1 Données collectées automatiquement</h3>
            <div className="data-category">
              <h4>📊 Données techniques</h4>
              <ul>
                <li><strong>Adresse IP</strong> : Pour la sécurité et l'analyse géographique</li>
                <li><strong>User-Agent</strong> : Pour l'optimisation de l'expérience utilisateur</li>
                <li><strong>Données de navigation</strong> : Pages visitées, temps passé, interactions</li>
                <li><strong>Données de performance</strong> : Métriques de chargement, erreurs</li>
              </ul>
            </div>

            <div className="data-category">
              <h4>🍪 Cookies et traceurs</h4>
              <ul>
                <li><strong>Cookies nécessaires</strong> : Fonctionnement du service (base légale : intérêt légitime)</li>
                <li><strong>Cookies analytiques</strong> : Amélioration du service (base légale : consentement)</li>
                <li><strong>Cookies marketing</strong> : Personnalisation publicitaire (base légale : consentement)</li>
              </ul>
            </div>

            <h3>2.2 Données fournies volontairement</h3>
            <div className="data-category">
              <h4>👤 Données d'identification</h4>
              <ul>
                <li><strong>Nom et prénom</strong> : Pour la personnalisation du service</li>
                <li><strong>Adresse email</strong> : Pour la communication et l'authentification</li>
                <li><strong>Données de contact</strong> : Si fournie via formulaires</li>
              </ul>
            </div>

            <div className="data-category">
              <h4>🎯 Données d'utilisation</h4>
              <ul>
                <li><strong>Préférences utilisateur</strong> : Paramètres de consentement, thème, langue</li>
                <li><strong>Contenu généré</strong> : Tâches créées, configurations sauvegardées</li>
                <li><strong>Interactions avec l'IA</strong> : Prompts, résultats, feedback</li>
              </ul>
            </div>
          </section>

          <section id="finalites" className="legal-section">
            <h2>3. Finalités du traitement</h2>
            
            <div className="purpose-grid">
              <div className="purpose-card">
                <h3>🚀 Fourniture du service</h3>
                <ul>
                  <li>Orchestration des agents IA</li>
                  <li>Traitement des requêtes utilisateur</li>
                  <li>Sauvegarde des configurations</li>
                  <li>Support technique</li>
                </ul>
                <p className="legal-basis"><strong>Base légale :</strong> Exécution du contrat (Art. 6.1.b RGPD)</p>
              </div>

              <div className="purpose-card">
                <h3>📈 Amélioration du service</h3>
                <ul>
                  <li>Analyse de performance</li>
                  <li>Optimisation des algorithmes</li>
                  <li>Développement de nouvelles fonctionnalités</li>
                  <li>Tests A/B</li>
                </ul>
                <p className="legal-basis"><strong>Base légale :</strong> Intérêt légitime (Art. 6.1.f RGPD)</p>
              </div>

              <div className="purpose-card">
                <h3>🔒 Sécurité et conformité</h3>
                <ul>
                  <li>Détection de fraude</li>
                  <li>Prévention des abus</li>
                  <li>Respect des obligations légales</li>
                  <li>Audit trail RGPD</li>
                </ul>
                <p className="legal-basis"><strong>Base légale :</strong> Obligation légale (Art. 6.1.c RGPD)</p>
              </div>

              <div className="purpose-card">
                <h3>📧 Communication</h3>
                <ul>
                  <li>Newsletters (opt-in)</li>
                  <li>Notifications de service</li>
                  <li>Réponses aux demandes</li>
                  <li>Information sur les mises à jour</li>
                </ul>
                <p className="legal-basis"><strong>Base légale :</strong> Consentement (Art. 6.1.a RGPD)</p>
              </div>
            </div>
          </section>

          <section id="base-legale" className="legal-section">
            <h2>4. Base légale du traitement</h2>
            <p>Conformément à l'article 6 du RGPD, nos traitements reposent sur les bases légales suivantes :</p>
            
            <div className="legal-bases">
              <div className="legal-base">
                <h3>📋 Article 6.1.a - Consentement</h3>
                <p>
                  Pour les cookies non nécessaires, newsletters, et fonctionnalités optionnelles. 
                  Vous pouvez retirer votre consentement à tout moment.
                </p>
              </div>

              <div className="legal-base">
                <h3>📄 Article 6.1.b - Exécution du contrat</h3>
                <p>
                  Pour fournir le service TrustBoost Phase 4 et ses fonctionnalités principales 
                  selon nos CGU.
                </p>
              </div>

              <div className="legal-base">
                <h3>⚖️ Article 6.1.c - Obligation légale</h3>
                <p>
                  Pour respecter nos obligations légales (conservation des logs, 
                  lutte anti-fraude, audit trail).
                </p>
              </div>

              <div className="legal-base">
                <h3>⚖️ Article 6.1.f - Intérêt légitime</h3>
                <p>
                  Pour améliorer notre service, assurer la sécurité, et optimiser les performances. 
                  Nous évaluons toujours la proportionnalité avec vos droits.
                </p>
              </div>
            </div>
          </section>

          <section id="consentement" className="legal-section">
            <h2>5. Gestion du consentement</h2>
            
            <div className="consent-manager">
              <h3>🎛️ Consentement granulaire</h3>
              <p>
                Notre système de consentement vous permet de choisir précisément quelles données 
                peuvent être traitées pour chaque finalité :
              </p>

              <div className="consent-categories">
                <div className="consent-category necessary">
                  <h4>✅ Cookies Nécessaires</h4>
                  <p>Toujours actifs - Requis pour le fonctionnement du service</p>
                  <ul>
                    <li>Authentification et sessions</li>
                    <li>Préférences de sécurité</li>
                    <li>Équilibrage de charge</li>
                  </ul>
                </div>

                <div className="consent-category analytics">
                  <h4>📊 Cookies Analytiques</h4>
                  <p>Votre choix - Nous aident à améliorer le service</p>
                  <ul>
                    <li>Métriques d'utilisation</li>
                    <li>Performance des fonctionnalités</li>
                    <li>Détection d'erreurs</li>
                  </ul>
                </div>

                <div className="consent-category marketing">
                  <h4>🎯 Cookies Marketing</h4>
                  <p>Votre choix - Pour personnaliser votre expérience</p>
                  <ul>
                    <li>Recommandations personnalisées</li>
                    <li>Contenu adapté</li>
                    <li>Publicités pertinentes</li>
                  </ul>
                </div>
              </div>

              <div className="consent-controls">
                <h4>🛠️ Gestion de vos préférences</h4>
                <p>
                  Vous pouvez modifier vos préférences à tout moment :
                </p>
                <ul>
                  <li>Via notre centre de préférences accessible depuis toute page</li>
                  <li>En contactant notre DPO : <a href="mailto:dpo@trustboost.fr">dpo@trustboost.fr</a></li>
                  <li>Directement dans les paramètres de votre navigateur</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="duree-conservation" className="legal-section">
            <h2>6. Durée de conservation</h2>
            
            <div className="retention-periods">
              <div className="retention-category">
                <h3>🕒 Données d'utilisation active</h3>
                <ul>
                  <li><strong>Sessions utilisateur :</strong> 30 jours après la dernière activité</li>
                  <li><strong>Préférences de consentement :</strong> 13 mois (renouvellement requis)</li>
                  <li><strong>Configurations sauvegardées :</strong> Tant que le compte est actif</li>
                </ul>
              </div>

              <div className="retention-category">
                <h3>📊 Données analytiques</h3>
                <ul>
                  <li><strong>Logs d'accès anonymisés :</strong> 25 mois maximum</li>
                  <li><strong>Métriques de performance :</strong> 24 mois</li>
                  <li><strong>Rapports d'erreur :</strong> 12 mois</li>
                </ul>
              </div>

              <div className="retention-category">
                <h3>⚖️ Données légales</h3>
                <ul>
                  <li><strong>Audit trail RGPD :</strong> 7 ans (obligation légale)</li>
                  <li><strong>Preuves de consentement :</strong> 3 ans après retrait</li>
                  <li><strong>Correspondances DPO :</strong> 5 ans</li>
                </ul>
              </div>

              <div className="retention-category">
                <h3>🗑️ Suppression automatique</h3>
                <ul>
                  <li><strong>Comptes inactifs :</strong> Suppression après 36 mois d'inactivité</li>
                  <li><strong>Demandes de suppression :</strong> Traitement sous 30 jours</li>
                  <li><strong>Données temporaires :</strong> Suppression immédiate après traitement</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="destinataires" className="legal-section">
            <h2>7. Destinataires des données</h2>
            
            <h3>7.1 Accès interne</h3>
            <div className="recipients-internal">
              <p>
                Seules les personnes habilitées accèdent à vos données, dans le cadre strict 
                de leurs missions et selon le principe du moindre privilège :
              </p>
              <ul>
                <li><strong>Équipe technique :</strong> Maintenance et support</li>
                <li><strong>Équipe produit :</strong> Amélioration du service</li>
                <li><strong>DPO et équipe juridique :</strong> Conformité RGPD</li>
                <li><strong>Sécurité :</strong> Détection d'incidents</li>
              </ul>
            </div>

            <h3>7.2 Sous-traitants</h3>
            <div className="subprocessors">
              <p>Nous travaillons avec des sous-traitants sélectionnés et contractualisés :</p>
              
              <div className="subprocessor-grid">
                <div className="subprocessor-card">
                  <h4>☁️ Hébergement</h4>
                  <p><strong>Vercel Inc.</strong></p>
                  <p>Localisation : Union Européenne</p>
                  <p>Finalité : Hébergement sécurisé</p>
                  <p>Garanties : Certification SOC 2, GDPR DPA</p>
                </div>

                <div className="subprocessor-card">
                  <h4>📊 Analytics</h4>
                  <p><strong>Services internes uniquement</strong></p>
                  <p>Localisation : Union Européenne</p>
                  <p>Finalité : Métriques anonymisées</p>
                  <p>Garanties : Données pseudonymisées</p>
                </div>

                <div className="subprocessor-card">
                  <h4>🔍 Monitoring</h4>
                  <p><strong>Sentry.io</strong></p>
                  <p>Localisation : Union Européenne</p>
                  <p>Finalité : Détection d'erreurs</p>
                  <p>Garanties : GDPR DPA, Privacy Shield</p>
                </div>
              </div>
            </div>

            <h3>7.3 Aucun partage commercial</h3>
            <div className="no-sharing">
              <p>
                ❌ <strong>Nous ne vendons, n'échangeons, ni ne louons vos données personnelles à des tiers.</strong>
              </p>
              <p>
                ❌ <strong>Aucun partage avec des courtiers de données ou des réseaux publicitaires tiers.</strong>
              </p>
              <p>
                ✅ <strong>Partage uniquement nécessaire au service ou requis par la loi.</strong>
              </p>
            </div>
          </section>

          <section id="transferts" className="legal-section">
            <h2>8. Transferts hors Union Européenne</h2>
            
            <div className="data-localization">
              <h3>🇪🇺 Principe : Données hébergées en UE</h3>
              <p>
                Par défaut, toutes vos données sont traitées et stockées au sein de l'Union Européenne 
                pour bénéficier du niveau de protection du RGPD.
              </p>
            </div>

            <div className="international-transfers">
              <h3>🌍 Transferts exceptionnels</h3>
              <p>Dans de rares cas, des transferts peuvent avoir lieu :</p>
              
              <div className="transfer-safeguards">
                <h4>🛡️ Garanties appliquées</h4>
                <ul>
                  <li><strong>Décisions d'adéquation :</strong> Pays reconnus par la Commission Européenne</li>
                  <li><strong>Clauses Contractuelles Types (CCT) :</strong> Garanties contractuelles renforcées</li>
                  <li><strong>Certifications :</strong> Privacy Shield (USA), CBPR (Asie-Pacifique)</li>
                  <li><strong>Mesures techniques :</strong> Chiffrement bout-en-bout, pseudonymisation</li>
                </ul>
              </div>

              <div className="transfer-controls">
                <h4>🎛️ Vos options</h4>
                <ul>
                  <li>Opposition aux transferts (avec impact possible sur le service)</li>
                  <li>Information préalable en cas de nouveau transfert</li>
                  <li>Accès aux garanties appliquées sur demande</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="droits" className="legal-section">
            <h2>9. Vos droits RGPD</h2>
            
            <div className="rights-overview">
              <p>
                Le RGPD vous confère des droits renforcés sur vos données personnelles. 
                <strong>Nous nous engageons à répondre sous 30 jours maximum</strong> (souvent sous 24-48h).
              </p>
            </div>

            <div className="rights-grid">
              <div className="right-card">
                <h3>👁️ Droit d'accès (Art. 15)</h3>
                <p>Obtenez une copie de toutes vos données et informations sur leur traitement.</p>
                <div className="right-details">
                  <strong>Comment l'exercer :</strong>
                  <ul>
                    <li>Via votre espace utilisateur (export automatique)</li>
                    <li>Par email à : <a href="mailto:dpo@trustboost.fr">dpo@trustboost.fr</a></li>
                  </ul>
                  <strong>Délai :</strong> 30 jours maximum
                </div>
              </div>

              <div className="right-card">
                <h3>✏️ Droit de rectification (Art. 16)</h3>
                <p>Corrigez vos données inexactes ou incomplètes.</p>
                <div className="right-details">
                  <strong>Comment l'exercer :</strong>
                  <ul>
                    <li>Directement dans vos paramètres</li>
                    <li>Par email avec justificatifs si nécessaire</li>
                  </ul>
                  <strong>Délai :</strong> Immédiat pour les paramètres, 30 jours sinon
                </div>
              </div>

              <div className="right-card">
                <h3>🗑️ Droit à l'effacement (Art. 17)</h3>
                <p>Demandez la suppression de vos données ("droit à l'oubli").</p>
                <div className="right-details">
                  <strong>Comment l'exercer :</strong>
                  <ul>
                    <li>Bouton "Supprimer mon compte" dans les paramètres</li>
                    <li>Demande par email au DPO</li>
                  </ul>
                  <strong>Délai :</strong> 24h pour l'effacement, 30 jours pour confirmation
                </div>
              </div>

              <div className="right-card">
                <h3>⏸️ Droit à la limitation (Art. 18)</h3>
                <p>Suspendez temporairement le traitement de vos données.</p>
                <div className="right-details">
                  <strong>Cas d'application :</strong>
                  <ul>
                    <li>Contestation de l'exactitude</li>
                    <li>Traitement illicite</li>
                    <li>Opposition au traitement</li>
                  </ul>
                  <strong>Effet :</strong> Données conservées mais non traitées
                </div>
              </div>

              <div className="right-card">
                <h3>📦 Droit à la portabilité (Art. 20)</h3>
                <p>Récupérez vos données dans un format structuré et interopérable.</p>
                <div className="right-details">
                  <strong>Formats disponibles :</strong>
                  <ul>
                    <li>JSON (format standard)</li>
                    <li>CSV pour données tabulaires</li>
                    <li>XML sur demande</li>
                  </ul>
                  <strong>Délai :</strong> Export immédiat depuis votre compte
                </div>
              </div>

              <div className="right-card">
                <h3>✋ Droit d'opposition (Art. 21)</h3>
                <p>Opposez-vous au traitement pour des raisons tenant à votre situation.</p>
                <div className="right-details">
                  <strong>Opposition absolue :</strong>
                  <ul>
                    <li>Prospection commerciale</li>
                    <li>Profilage marketing</li>
                  </ul>
                  <strong>Opposition conditionnelle :</strong> Intérêt légitime (nous évaluons)
                </div>
              </div>

              <div className="right-card">
                <h3>🤖 Décisions automatisées (Art. 22)</h3>
                <p>Contestez les décisions prises uniquement par des algorithmes.</p>
                <div className="right-details">
                  <strong>Notre approche :</strong>
                  <ul>
                    <li>Transparence sur les algorithmes utilisés</li>
                    <li>Possibilité d'intervention humaine</li>
                    <li>Explication des décisions sur demande</li>
                  </ul>
                </div>
              </div>

              <div className="right-card">
                <h3>📝 Droit de retrait du consentement</h3>
                <p>Retirez votre consentement à tout moment, aussi facilement que vous l'avez donné.</p>
                <div className="right-details">
                  <strong>Comment procéder :</strong>
                  <ul>
                    <li>Centre de préférences (clic unique)</li>
                    <li>Lien de désabonnement dans chaque email</li>
                    <li>Contact DPO</li>
                  </ul>
                  <strong>Effet :</strong> Immédiat pour l'avenir
                </div>
              </div>
            </div>

            <div className="rights-exercise">
              <h3>⚡ Exercice rapide de vos droits</h3>
              <div className="quick-actions">
                <div className="quick-action">
                  <strong>🏃‍♂️ Actions immédiates :</strong>
                  <ul>
                    <li>Modification des préférences de consentement</li>
                    <li>Export de vos données</li>
                    <li>Suppression de compte</li>
                  </ul>
                </div>
                <div className="quick-action">
                  <strong>📧 Contact DPO :</strong>
                  <ul>
                    <li>Email : <a href="mailto:dpo@trustboost.fr">dpo@trustboost.fr</a></li>
                    <li>Objet : "[RGPD] Votre demande"</li>
                    <li>Réponse sous 48h en moyenne</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="securite" className="legal-section">
            <h2>10. Sécurité des données</h2>
            
            <div className="security-overview">
              <h3>🔒 Approche "Security by Design"</h3>
              <p>
                La sécurité est intégrée dès la conception de nos systèmes, 
                conformément à l'article 32 du RGPD.
              </p>
            </div>

            <div className="security-measures">
              <div className="security-category">
                <h3>🔐 Mesures techniques</h3>
                <div class="security-grid">
                  <div class="security-item">
                    <h4>Chiffrement</h4>
                    <ul>
                      <li>TLS 1.3 pour les données en transit</li>
                      <li>AES-256 pour les données au repos</li>
                      <li>Chiffrement des sauvegardes</li>
                    </ul>
                  </div>
                  <div class="security-item">
                    <h4>Contrôles d'accès</h4>
                    <ul>
                      <li>Authentification multi-facteurs</li>
                      <li>Principe du moindre privilège</li>
                      <li>Rotation automatique des clés</li>
                    </ul>
                  </div>
                  <div class="security-item">
                    <h4>Monitoring</h4>
                    <ul>
                      <li>Détection d'intrusion 24/7</li>
                      <li>Logs d'audit complets</li>
                      <li>Alertes en temps réel</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="security-category">
                <h3>👥 Mesures organisationnelles</h3>
                <div class="security-grid">
                  <div class="security-item">
                    <h4>Formation</h4>
                    <ul>
                      <li>Sensibilisation RGPD obligatoire</li>
                      <li>Tests de phishing réguliers</li>
                      <li>Veille sécurité continue</li>
                    </ul>
                  </div>
                  <div class="security-item">
                    <h4>Processus</h4>
                    <ul>
                      <li>Gestion des incidents définie</li>
                      <li>Tests de récupération réguliers</li>
                      <li>Audits de sécurité tiers</li>
                    </ul>
                  </div>
                  <div class="security-item">
                    <h4>Gouvernance</h4>
                    <ul>
                      <li>Comité de sécurité</li>
                      <li>RSSI dédié</li>
                      <li>Revues de conformité</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="incident-response">
              <h3>🚨 Gestion des incidents</h3>
              <p>
                En cas de violation de données personnelles, nous nous engageons à :
              </p>
              <div className="incident-timeline">
                <div className="incident-step">
                  <strong>⏱️ Détection : < 1 heure</strong>
                  <p>Systèmes de monitoring automatisés</p>
                </div>
                <div className="incident-step">
                  <strong>📊 Évaluation : < 4 heures</strong>
                  <p>Impact et gravité de la violation</p>
                </div>
                <div className="incident-step">
                  <strong>🏛️ Notification CNIL : < 72 heures</strong>
                  <p>Si risque pour les droits et libertés</p>
                </div>
                <div className="incident-step">
                  <strong>👥 Information utilisateurs : < 72 heures</strong>
                  <p>Si risque élevé pour les personnes</p>
                </div>
              </div>
            </div>
          </section>

          <section id="cookies" className="legal-section">
            <h2>11. Cookies et traceurs</h2>
            
            <p>
              Pour plus de détails, consultez notre 
              <a href="/legal/cookies" className="legal-link">Politique de Cookies complète</a>.
            </p>

            <div className="cookies-summary">
              <div className="cookie-type">
                <h3>🍪 Cookies strictement nécessaires</h3>
                <p>Ces cookies sont indispensables au fonctionnement du site.</p>
                <ul>
                  <li><strong>session_id :</strong> Authentification (30 jours)</li>
                  <li><strong>csrf_token :</strong> Sécurité anti-CSRF (session)</li>
                  <li><strong>consent_preferences :</strong> Vos choix de consentement (13 mois)</li>
                </ul>
                <p className="no-consent">❌ <strong>Consentement non requis</strong> (intérêt légitime)</p>
              </div>

              <div className="cookie-type">
                <h3>📊 Cookies analytiques</h3>
                <p>Ces cookies nous aident à comprendre comment vous utilisez notre site.</p>
                <ul>
                  <li><strong>_analytics :</strong> Métriques anonymisées (25 mois)</li>
                  <li><strong>_performance :</strong> Temps de chargement (24 mois)</li>
                </ul>
                <p className="consent-required">✅ <strong>Consentement requis</strong></p>
              </div>

              <div className="cookie-type">
                <h3>🎯 Cookies marketing</h3>
                <p>Ces cookies permettent de personnaliser votre expérience.</p>
                <ul>
                  <li><strong>user_preferences :</strong> Recommandations (12 mois)</li>
                  <li><strong>ab_test_group :</strong> Tests A/B (30 jours)</li>
                </ul>
                <p className="consent-required">✅ <strong>Consentement requis</strong></p>
              </div>
            </div>

            <div className="cookie-controls">
              <h3>🛠️ Gestion des cookies</h3>
              <p>Vous pouvez contrôler les cookies à plusieurs niveaux :</p>
              <ul>
                <li><strong>Notre centre de préférences :</strong> Choix granulaires par catégorie</li>
                <li><strong>Paramètres du navigateur :</strong> Blocage global ou par site</li>
                <li><strong>Extensions dédiées :</strong> Gestionnaires de cookies tiers</li>
              </ul>
            </div>
          </section>

          <section id="mineurs" className="legal-section">
            <h2>12. Protection des données des mineurs</h2>
            
            <div className="minors-protection">
              <h3>👶 Politique stricte</h3>
              <p>
                TrustBoost Phase 4 ne s'adresse pas aux mineurs de moins de 16 ans. 
                Nous ne collectons pas sciemment de données personnelles d'enfants.
              </p>

              <div className="minors-measures">
                <h4>🛡️ Mesures de protection</h4>
                <ul>
                  <li><strong>Vérification d'âge :</strong> Demande lors de l'inscription</li>
                  <li><strong>Consentement parental :</strong> Requis pour les 13-16 ans</li>
                  <li><strong>Suppression immédiate :</strong> Si découverte de données d'enfants</li>
                  <li><strong>Sensibilisation :</strong> Information sur les risques</li>
                </ul>
              </div>

              <div className="parents-rights">
                <h4>👨‍👩‍👧‍👦 Droits des parents</h4>
                <p>Si vous êtes parent et découvrez que votre enfant nous a fourni des données :</p>
                <ul>
                  <li>Contactez immédiatement notre DPO</li>
                  <li>Nous supprimerons les données sous 24h</li>
                  <li>Aucune utilisation ne sera faite de ces données</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="modifications" className="legal-section">
            <h2>13. Modifications de cette politique</h2>
            
            <div className="policy-updates">
              <h3>📝 Notre engagement de transparence</h3>
              <p>
                Nous pouvons mettre à jour cette politique de confidentialité pour refléter :
              </p>
              <ul>
                <li>L'évolution de nos services</li>
                <li>Les changements réglementaires</li>
                <li>L'amélioration de nos pratiques</li>
                <li>Les retours utilisateurs</li>
              </ul>

              <div className="notification-methods">
                <h4>📢 Comment vous êtes informés</h4>
                <div className="notification-grid">
                  <div className="notification-method">
                    <h5>🔔 Modifications importantes</h5>
                    <ul>
                      <li>Email de notification</li>
                      <li>Banner sur le site</li>
                      <li>30 jours avant application</li>
                    </ul>
                  </div>
                  <div className="notification-method">
                    <h5>⚖️ Modifications légales</h5>
                    <ul>
                      <li>Notification immédiate</li>
                      <li>Détail des changements</li>
                      <li>Options de retrait</li>
                    </ul>
                  </div>
                  <div className="notification-method">
                    <h5>🔧 Modifications techniques</h5>
                    <ul>
                      <li>Mise à jour de la date</li>
                      <li>Historique des versions</li>
                      <li>Pas de notification pour clarifications</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="legal-section">
            <h2>14. Contact et réclamations</h2>
            
            <div className="contact-channels">
              <div className="contact-card primary">
                <h3>🛡️ Délégué à la Protection des Données (DPO)</h3>
                <p><strong>Email :</strong> <a href="mailto:dpo@trustboost.fr">dpo@trustboost.fr</a></p>
                <p><strong>Réponse :</strong> Sous 48h en moyenne</p>
                <p><strong>Langues :</strong> Français, Anglais</p>
                <p><strong>Mission :</strong> Questions RGPD, exercice des droits, réclamations</p>
              </div>

              <div className="contact-card">
                <h3>📧 Support général</h3>
                <p><strong>Email :</strong> <a href="mailto:support@trustboost.fr">support@trustboost.fr</a></p>
                <p><strong>Réponse :</strong> Sous 24h</p>
                <p><strong>Horaires :</strong> 9h-18h (UTC+1)</p>
              </div>
            </div>

            <div className="complaint-process">
              <h3>⚖️ Procédure de réclamation</h3>
              <p>Si vous n'êtes pas satisfait de nos réponses concernant vos données personnelles :</p>
              
              <div className="complaint-steps">
                <div className="complaint-step">
                  <h4>1️⃣ Réclamation interne</h4>
                  <p>Contactez notre DPO avec vos griefs détaillés</p>
                </div>
                <div className="complaint-step">
                  <h4>2️⃣ Médiation (optionnel)</h4>
                  <p>Recours à un médiateur agréé si souhaité</p>
                </div>
                <div className="complaint-step">
                  <h4>3️⃣ Autorité de contrôle</h4>
                  <p>
                    Saisine de la CNIL :
                    <br />
                    <strong>Web :</strong> <a href="https://www.cnil.fr/fr/plaintes">www.cnil.fr/fr/plaintes</a>
                    <br />
                    <strong>Adresse :</strong> 3 Place de Fontenoy, 75334 PARIS CEDEX 07
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="legal-footer">
          <div className="footer-grid">
            <div className="footer-section">
              <h3>📋 Document officiel</h3>
              <p>Cette politique est un document contractuel au sens du RGPD.</p>
              <p><strong>Version :</strong> 4.0</p>
              <p><strong>Dernière révision :</strong> {new Date(privacy.lastUpdated).toLocaleDateString('fr-FR')}</p>
            </div>
            
            <div className="footer-section">
              <h3>🔗 Liens utiles</h3>
              <ul>
                <li><a href="/legal/cgu">Conditions Générales d'Utilisation</a></li>
                <li><a href="/legal/mentions-legales">Mentions Légales</a></li>
                <li><a href="/legal/cookies">Politique de Cookies</a></li>
                <li><a href="/legal/dpa">Accord de Traitement de Données</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>🏛️ Références légales</h3>
              <ul>
                <li><a href="https://eur-lex.europa.eu/eli/reg/2016/679/fr" target="_blank">RGPD (UE) 2016/679</a></li>
                <li><a href="https://www.cnil.fr" target="_blank">CNIL</a></li>
                <li><a href="https://edpb.europa.eu/fr" target="_blank">Comité Européen de Protection des Données</a></li>
              </ul>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .legal-document-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: #2c3e50;
        }

        .legal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .legal-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .legal-meta {
          display: flex;
          gap: 2rem;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .gdpr-summary {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 12px;
          border-left: 5px solid #28a745;
          margin-bottom: 2rem;
        }

        .gdpr-summary h2 {
          color: #28a745;
          margin-top: 0;
        }

        .gdpr-points {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .gdpr-point {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }

        .gdpr-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .legal-toc {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          border-left: 4px solid #3498db;
        }

        .legal-toc h2 {
          margin-top: 0;
          color: #2c3e50;
        }

        .legal-toc ol {
          margin: 0;
          padding-left: 1.5rem;
          columns: 2;
          column-gap: 2rem;
        }

        .legal-toc li {
          margin-bottom: 0.5rem;
          break-inside: avoid;
        }

        .legal-toc a {
          color: #3498db;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .legal-toc a:hover {
          color: #2980b9;
          text-decoration: underline;
        }

        .legal-content {
          max-width: 900px;
        }

        .legal-section {
          margin-bottom: 3rem;
          scroll-margin-top: 2rem;
        }

        .legal-section h2 {
          color: #2c3e50;
          font-size: 2rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 3px solid #3498db;
        }

        .legal-section h3 {
          color: #34495e;
          font-size: 1.4rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .legal-section h4 {
          color: #2c3e50;
          font-size: 1.2rem;
          margin-top: 1.5rem;
          margin-bottom: 0.8rem;
        }

        .company-card, .dpo-card {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #3498db;
          margin: 1rem 0;
        }

        .dpo-card {
          border-left-color: #28a745;
        }

        .data-category, .purpose-card, .legal-base, .consent-category, .retention-category {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #3498db;
          margin: 1rem 0;
        }

        .purpose-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .purpose-card {
          margin: 0;
        }

        .legal-basis {
          background: #e3f2fd;
          padding: 0.5rem;
          border-radius: 4px;
          margin-top: 1rem;
          font-size: 0.9rem;
        }

        .legal-bases {
          display: grid;
          gap: 1rem;
        }

        .consent-categories {
          display: grid;
          gap: 1rem;
          margin: 1rem 0;
        }

        .consent-category.necessary {
          border-left-color: #28a745;
        }

        .consent-category.analytics {
          border-left-color: #ffc107;
        }

        .consent-category.marketing {
          border-left-color: #dc3545;
        }

        .retention-periods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .subprocessor-grid, .security-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }

        .subprocessor-card, .security-item {
          background: white;
          padding: 1rem;
          border-radius: 6px;
          border: 1px solid #dee2e6;
        }

        .rights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }

        .right-card {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #28a745;
        }

        .right-details {
          background: white;
          padding: 1rem;
          border-radius: 4px;
          margin-top: 1rem;
          font-size: 0.9rem;
        }

        .incident-timeline {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }

        .incident-step {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          border-left: 4px solid #dc3545;
        }

        .cookie-type {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          margin: 1rem 0;
          border-left: 4px solid #3498db;
        }

        .no-consent {
          color: #dc3545;
          font-weight: 600;
        }

        .consent-required {
          color: #28a745;
          font-weight: 600;
        }

        .legal-link {
          color: #3498db;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .legal-link:hover {
          color: #2980b9;
          text-decoration: underline;
        }

        .contact-channels {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }

        .contact-card {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #3498db;
        }

        .contact-card.primary {
          border-left-color: #28a745;
          background: #f1f8e9;
        }

        .complaint-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }

        .complaint-step {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #ffc107;
        }

        .legal-footer {
          border-top: 2px solid #ecf0f1;
          margin-top: 3rem;
          padding-top: 2rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
        }

        .footer-section li {
          margin-bottom: 0.5rem;
        }

        .footer-section a {
          color: #3498db;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-section a:hover {
          color: #2980b9;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .legal-document-container {
            padding: 1rem;
          }

          .legal-title {
            font-size: 2rem;
          }

          .legal-meta {
            flex-direction: column;
            gap: 0.5rem;
          }

          .legal-toc ol {
            columns: 1;
          }

          .gdpr-points {
            grid-template-columns: 1fr;
          }

          .rights-grid {
            grid-template-columns: 1fr;
          }

          .incident-timeline {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Generate Privacy Policy content using the legal documents generator
    const privacyData = await legalDocumentsGenerator.generatePrivacyPolicy({
      companyName: 'TrustBoost Phase 4',
      serviceName: 'TrustBoost Phase 4 - Multi-Agent Orchestration Platform',
      website: 'https://trustboost-phase4.vercel.app',
      contactEmail: 'contact@trustboost.fr',
      dpoEmail: 'dpo@trustboost.fr',
      jurisdiction: 'Droit français - RGPD (UE) 2016/679',
      lastUpdated: new Date().toISOString()
    });

    const metadata = {
      canonical: 'https://trustboost-phase4.vercel.app/legal/privacy',
      structured: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Politique de Confidentialité - TrustBoost Phase 4',
        description: 'Politique de Confidentialité conforme RGPD pour TrustBoost Phase 4',
        publisher: {
          '@type': 'Organization',
          name: 'TrustBoost Phase 4',
          url: 'https://trustboost-phase4.vercel.app'
        },
        dateModified: new Date().toISOString(),
        about: {
          '@type': 'Thing',
          name: 'GDPR Compliance'
        }
      }
    };

    return {
      props: {
        privacy: privacyData,
        metadata
      }
    };
  } catch (error) {
    console.error('Error generating Privacy Policy:', error);
    
    // Fallback data
    return {
      props: {
        privacy: {
          title: 'Politique de Confidentialité',
          lastUpdated: new Date().toISOString(),
          content: {},
          legal: {
            jurisdiction: 'Droit français - RGPD (UE) 2016/679',
            company: {
              name: 'TrustBoost Phase 4',
              address: '123 Rue de la Tech, 75001 Paris, France',
              siret: '12345678901234',
              email: 'contact@trustboost.fr'
            },
            dpo: {
              email: 'dpo@trustboost.fr'
            }
          }
        },
        metadata: {
          canonical: 'https://trustboost-phase4.vercel.app/legal/privacy',
          structured: {}
        }
      }
    };
  }
};