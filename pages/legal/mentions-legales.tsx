import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { legalDocumentsGenerator } from '../../src/gdpr-compliance/legal-documents.js';

interface MentionsLegalesProps {
  mentions: {
    title: string;
    lastUpdated: string;
    content: any;
    legal: {
      company: any;
      technical: any;
      hosting: any;
    };
  };
  metadata: {
    canonical: string;
    structured: any;
  };
}

export default function MentionsLegalesPage({ mentions, metadata }: MentionsLegalesProps) {
  return (
    <>
      <Head>
        <title>{mentions.title} - TrustBoost Phase 4</title>
        <meta name="description" content="Mentions légales de TrustBoost Phase 4 - Informations légales obligatoires conformes au droit français" />
        <meta name="robots" content="index,follow" />
        <meta name="author" content="TrustBoost Phase 4" />
        <meta name="keywords" content="mentions légales,informations légales,éditeur,hébergement,SIRET,TVA" />
        <link rel="canonical" href={metadata.canonical} />
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(metadata.structured) }} 
        />
      </Head>

      <div className="legal-document-container">
        <header className="legal-header">
          <h1 className="legal-title">{mentions.title}</h1>
          <div className="legal-meta">
            <p className="last-updated">Dernière mise à jour : {new Date(mentions.lastUpdated).toLocaleDateString('fr-FR')}</p>
            <p className="compliance-note">Conformes à la loi française et aux directives européennes</p>
          </div>
        </header>

        <div className="compliance-banner">
          <div className="compliance-icon">⚖️</div>
          <div className="compliance-content">
            <h2>Conformité légale</h2>
            <p>
              Ces mentions légales respectent les obligations de la loi française pour la confiance dans l'économie numérique 
              (LCEN n°2004-575) et le Code de la consommation.
            </p>
          </div>
        </div>

        <nav className="legal-toc">
          <h2>Table des matières</h2>
          <ol>
            <li><a href="#editeur">1. Identification de l'éditeur</a></li>
            <li><a href="#directeur-publication">2. Directeur de publication</a></li>
            <li><a href="#hebergement">3. Hébergement</a></li>
            <li><a href="#activite">4. Activité de l'entreprise</a></li>
            <li><a href="#propriete-intellectuelle">5. Propriété intellectuelle</a></li>
            <li><a href="#donnees-personnelles">6. Données personnelles</a></li>
            <li><a href="#responsabilite">7. Responsabilité</a></li>
            <li><a href="#droit-applicable">8. Droit applicable</a></li>
            <li><a href="#contact">9. Contact</a></li>
          </ol>
        </nav>

        <main className="legal-content">
          <section id="editeur" className="legal-section">
            <h2>1. Identification de l'éditeur</h2>
            
            <div className="company-card">
              <div className="company-header">
                <h3>{mentions.legal.company.name}</h3>
                <div className="company-badges">
                  <span className="badge sas">SAS</span>
                  <span className="badge active">En activité</span>
                </div>
              </div>
              
              <div className="company-details">
                <div className="detail-group">
                  <h4>📍 Adresse du siège social</h4>
                  <p>{mentions.legal.company.address}</p>
                  <p>{mentions.legal.company.postalCode} {mentions.legal.company.city}</p>
                  <p>{mentions.legal.company.country}</p>
                </div>

                <div className="detail-group">
                  <h4>🏢 Informations légales</h4>
                  <p><strong>Forme juridique :</strong> {mentions.legal.company.legalForm}</p>
                  <p><strong>Capital social :</strong> {mentions.legal.company.capital}€</p>
                  <p><strong>SIRET :</strong> {mentions.legal.company.siret}</p>
                  <p><strong>TVA Intracommunautaire :</strong> {mentions.legal.company.vatNumber}</p>
                  <p><strong>APE/NAF :</strong> {mentions.legal.company.apeCode} - {mentions.legal.company.apeLabel}</p>
                </div>

                <div className="detail-group">
                  <h4>📞 Coordonnées</h4>
                  <p><strong>Email :</strong> <a href={`mailto:${mentions.legal.company.email}`}>{mentions.legal.company.email}</a></p>
                  <p><strong>Téléphone :</strong> <a href={`tel:${mentions.legal.company.phone}`}>{mentions.legal.company.phone}</a></p>
                  <p><strong>Site web :</strong> <a href={mentions.legal.company.website} target="_blank" rel="noopener noreferrer">{mentions.legal.company.website}</a></p>
                </div>

                <div className="detail-group">
                  <h4>🏛️ Immatriculation</h4>
                  <p><strong>RCS :</strong> {mentions.legal.company.rcs}</p>
                  <p><strong>Greffe :</strong> {mentions.legal.company.courthouse}</p>
                  <p><strong>Date de création :</strong> {new Date(mentions.legal.company.creationDate).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          </section>

          <section id="directeur-publication" className="legal-section">
            <h2>2. Directeur de publication</h2>
            
            <div className="director-card">
              <h3>👤 Responsable éditorial</h3>
              <p>
                Conformément à l'article 93-3 de la loi n°82-652 du 29 juillet 1982, 
                le directeur de la publication de ce site est :
              </p>
              
              <div className="director-info">
                <p><strong>Nom :</strong> {mentions.legal.company.director.name}</p>
                <p><strong>Qualité :</strong> {mentions.legal.company.director.title}</p>
                <p><strong>Email :</strong> <a href={`mailto:${mentions.legal.company.director.email}`}>{mentions.legal.company.director.email}</a></p>
              </div>

              <div className="responsibility-note">
                <h4>📋 Responsabilités</h4>
                <p>
                  Le directeur de publication est responsable du contenu éditorial du site, 
                  de la ligne éditoriale et des informations publiées.
                </p>
              </div>
            </div>
          </section>

          <section id="hebergement" className="legal-section">
            <h2>3. Hébergement</h2>
            
            <div className="hosting-grid">
              <div className="hosting-card">
                <h3>☁️ Hébergement principal</h3>
                <p><strong>Prestataire :</strong> {mentions.legal.hosting.provider.name}</p>
                <p><strong>Adresse :</strong></p>
                <address>
                  {mentions.legal.hosting.provider.address}<br />
                  {mentions.legal.hosting.provider.city}, {mentions.legal.hosting.provider.country}
                </address>
                <p><strong>Site web :</strong> <a href={mentions.legal.hosting.provider.website} target="_blank" rel="noopener noreferrer">{mentions.legal.hosting.provider.website}</a></p>
                
                <div className="hosting-details">
                  <h4>🌍 Infrastructure</h4>
                  <ul>
                    <li><strong>Localisation :</strong> {mentions.legal.hosting.location}</li>
                    <li><strong>Disponibilité :</strong> {mentions.legal.hosting.availability}</li>
                    <li><strong>Certificats :</strong> {mentions.legal.hosting.certifications.join(', ')}</li>
                    <li><strong>Conformité :</strong> RGPD, ISO 27001, SOC 2</li>
                  </ul>
                </div>
              </div>

              <div className="hosting-card">
                <h3>🔧 Services techniques</h3>
                <div className="technical-services">
                  <h4>💾 Base de données</h4>
                  <p><strong>Fournisseur :</strong> {mentions.legal.technical.database.provider}</p>
                  <p><strong>Localisation :</strong> {mentions.legal.technical.database.location}</p>
                  
                  <h4>📊 Monitoring</h4>
                  <p><strong>Fournisseur :</strong> {mentions.legal.technical.monitoring.provider}</p>
                  <p><strong>Finalité :</strong> Surveillance des performances et détection d'incidents</p>
                  
                  <h4>🔐 Sécurité</h4>
                  <p><strong>CDN :</strong> {mentions.legal.technical.cdn.provider}</p>
                  <p><strong>Protection :</strong> DDoS, WAF, SSL/TLS</p>
                </div>
              </div>
            </div>

            <div className="hosting-obligations">
              <h3>📝 Obligations de l'hébergeur</h3>
              <p>
                Conformément à l'article 6-I-2 de la LCEN, l'hébergeur n'a pas d'obligation générale de surveillance 
                du contenu hébergé. Cependant, il doit :
              </p>
              <ul>
                <li>Conserver les données de connexion pendant 1 an (Décret n°2011-219)</li>
                <li>Mettre en place un dispositif de signalement des contenus illicites</li>
                <li>Retirer promptement tout contenu illicite porté à sa connaissance</li>
                <li>Coopérer avec les autorités judiciaires</li>
              </ul>
            </div>
          </section>

          <section id="activite" className="legal-section">
            <h2>4. Activité de l'entreprise</h2>
            
            <div className="activity-overview">
              <h3>🚀 Description de l'activité</h3>
              <p>
                TrustBoost Phase 4 développe et exploite une plateforme d'orchestration multi-agents 
                utilisant des technologies d'intelligence artificielle avancées.
              </p>
            </div>

            <div className="services-grid">
              <div className="service-card">
                <h4>🤖 Orchestration IA</h4>
                <ul>
                  <li>Coordination de multiples agents IA</li>
                  <li>Automatisation de workflows complexes</li>
                  <li>Intégration d'APIs d'intelligence artificielle</li>
                  <li>Optimisation des performances</li>
                </ul>
              </div>

              <div className="service-card">
                <h4>📊 Analytics et Reporting</h4>
                <ul>
                  <li>Analyse de performance en temps réel</li>
                  <li>Tableaux de bord personnalisés</li>
                  <li>Rapports détaillés d'utilisation</li>
                  <li>Métriques de qualité</li>
                </ul>
              </div>

              <div className="service-card">
                <h4>🔒 Conformité et Sécurité</h4>
                <ul>
                  <li>Conformité RGPD intégrée</li>
                  <li>Chiffrement bout-en-bout</li>
                  <li>Audit trail complet</li>
                  <li>Gestion des accès et identités</li>
                </ul>
              </div>

              <div className="service-card">
                <h4>🛠️ Services connexes</h4>
                <ul>
                  <li>Consulting en transformation IA</li>
                  <li>Formation aux outils d'orchestration</li>
                  <li>Support technique 24/7</li>
                  <li>Intégration sur mesure</li>
                </ul>
              </div>
            </div>

            <div className="regulatory-info">
              <h3>📋 Informations réglementaires</h3>
              <div className="regulatory-grid">
                <div className="regulatory-item">
                  <h4>🏢 Statut</h4>
                  <p>Société par Actions Simplifiée (SAS)</p>
                  <p>Activité commerciale et technologique</p>
                </div>
                
                <div className="regulatory-item">
                  <h4>💰 TVA</h4>
                  <p>Assujetti à la TVA française</p>
                  <p>Taux applicable : 20%</p>
                </div>
                
                <div className="regulatory-item">
                  <h4>🛡️ Assurances</h4>
                  <p>Responsabilité civile professionnelle</p>
                  <p>Cyber-assurance</p>
                </div>
                
                <div className="regulatory-item">
                  <h4>📜 Agréments</h4>
                  <p>Conforme aux standards ISO 27001</p>
                  <p>Certification SOC 2 Type II</p>
                </div>
              </div>
            </div>
          </section>

          <section id="propriete-intellectuelle" className="legal-section">
            <h2>5. Propriété intellectuelle</h2>
            
            <div className="ip-overview">
              <h3>©️ Droits d'auteur</h3>
              <p>
                L'ensemble du contenu de ce site (textes, images, logos, éléments graphiques, 
                logiciels, etc.) est protégé par le droit d'auteur et appartient à TrustBoost Phase 4 
                ou à ses partenaires licenciés.
              </p>
            </div>

            <div className="ip-sections">
              <div className="ip-section">
                <h4>🎨 Éléments protégés</h4>
                <ul>
                  <li><strong>Marques :</strong> "TrustBoost", logos et signes distinctifs</li>
                  <li><strong>Logiciels :</strong> Code source, algorithmes, architecture</li>
                  <li><strong>Contenus :</strong> Textes, images, vidéos, documentation</li>
                  <li><strong>Design :</strong> Interface, UX/UI, charte graphique</li>
                  <li><strong>Données :</strong> Bases de données, structures, métadonnées</li>
                </ul>
              </div>

              <div className="ip-section">
                <h4>✅ Utilisation autorisée</h4>
                <ul>
                  <li>Consultation personnelle et non commerciale</li>
                  <li>Reproduction pour usage privé (citation courte)</li>
                  <li>Lien hypertexte vers nos pages (avec accord préalable)</li>
                  <li>Utilisation dans le cadre des CGU acceptées</li>
                </ul>
              </div>

              <div className="ip-section">
                <h4>❌ Utilisations interdites</h4>
                <ul>
                  <li>Reproduction, représentation ou diffusion non autorisée</li>
                  <li>Modification, décompilation ou ingénierie inverse</li>
                  <li>Utilisation commerciale sans licence</li>
                  <li>Création d'œuvres dérivées</li>
                  <li>Usage de nos marques sans autorisation</li>
                </ul>
              </div>

              <div className="ip-section">
                <h4>⚖️ Sanctions</h4>
                <p>
                  Toute utilisation non autorisée constitue une contrefaçon passible 
                  de sanctions pénales (art. L.335-2 du Code de la propriété intellectuelle) :
                </p>
                <ul>
                  <li>Jusqu'à 3 ans d'emprisonnement</li>
                  <li>Jusqu'à 300 000€ d'amende</li>
                  <li>Dommages et intérêts</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="donnees-personnelles" className="legal-section">
            <h2>6. Données personnelles et cookies</h2>
            
            <div className="data-summary">
              <h3>🔒 Protection des données</h3>
              <p>
                Le traitement de vos données personnelles est régi par notre 
                <a href="/legal/privacy" className="legal-link"> Politique de Confidentialité</a> 
                conforme au RGPD.
              </p>
            </div>

            <div className="data-sections">
              <div className="data-section">
                <h4>📋 Responsable du traitement</h4>
                <p><strong>TrustBoost Phase 4</strong></p>
                <p>Email : <a href="mailto:dpo@trustboost.fr">dpo@trustboost.fr</a></p>
              </div>

              <div className="data-section">
                <h4>🍪 Cookies</h4>
                <p>
                  Ce site utilise des cookies. Pour plus d'informations, consultez notre 
                  <a href="/legal/cookies" className="legal-link"> Politique de Cookies</a>.
                </p>
              </div>

              <div className="data-section">
                <h4>⚖️ Vos droits RGPD</h4>
                <ul>
                  <li>Droit d'accès et de portabilité</li>
                  <li>Droit de rectification et d'effacement</li>
                  <li>Droit d'opposition et de limitation</li>
                  <li>Droit de retrait du consentement</li>
                </ul>
              </div>

              <div className="data-section">
                <h4>📞 Exercer vos droits</h4>
                <p>
                  Contactez notre DPO : 
                  <a href="mailto:dpo@trustboost.fr" className="legal-link"> dpo@trustboost.fr</a>
                </p>
                <p>
                  En cas de litige : 
                  <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className="legal-link"> CNIL</a>
                </p>
              </div>
            </div>
          </section>

          <section id="responsabilite" className="legal-section">
            <h2>7. Responsabilité</h2>
            
            <div className="liability-sections">
              <div className="liability-section">
                <h3>🏢 Responsabilité de l'éditeur</h3>
                <p>
                  TrustBoost Phase 4 met tout en œuvre pour fournir des informations précises et à jour. 
                  Cependant, nous ne pouvons garantir :
                </p>
                <ul>
                  <li>L'exactitude, la complétude ou l'actualité des informations</li>
                  <li>L'absence d'interruption ou d'erreur du service</li>
                  <li>La compatibilité avec tous les équipements et logiciels</li>
                  <li>L'absence de virus ou d'éléments malveillants</li>
                </ul>
              </div>

              <div className="liability-section">
                <h3>👤 Responsabilité de l'utilisateur</h3>
                <p>L'utilisateur du site s'engage à :</p>
                <ul>
                  <li>Respecter les lois et règlements en vigueur</li>
                  <li>Ne pas porter atteinte aux droits de tiers</li>
                  <li>Utiliser le site de manière loyale et conforme</li>
                  <li>Signaler tout dysfonctionnement ou contenu illicite</li>
                </ul>
              </div>

              <div className="liability-section">
                <h3>🔗 Sites tiers</h3>
                <p>
                  Notre site peut contenir des liens vers des sites tiers. 
                  Nous ne sommes pas responsables du contenu, des pratiques ou des politiques 
                  de confidentialité de ces sites externes.
                </p>
              </div>

              <div className="liability-section">
                <h3>⚡ Force majeure</h3>
                <p>
                  TrustBoost Phase 4 ne pourra être tenu responsable de tout retard ou défaillance 
                  d'exécution lorsque la cause du retard ou de la défaillance est liée à un cas 
                  de force majeure tel que défini par la jurisprudence française.
                </p>
              </div>
            </div>
          </section>

          <section id="droit-applicable" className="legal-section">
            <h2>8. Droit applicable et juridiction</h2>
            
            <div className="jurisdiction-info">
              <h3>🇫🇷 Droit applicable</h3>
              <p>
                Les présentes mentions légales sont régies par le droit français, notamment :
              </p>
              <ul>
                <li><strong>LCEN :</strong> Loi pour la Confiance dans l'Économie Numérique n°2004-575</li>
                <li><strong>Code civil :</strong> Dispositions générales sur les obligations</li>
                <li><strong>Code de la consommation :</strong> Protection des consommateurs</li>
                <li><strong>RGPD :</strong> Règlement (UE) 2016/679 sur la protection des données</li>
                <li><strong>Code de la propriété intellectuelle :</strong> Protection des créations</li>
              </ul>
            </div>

            <div className="dispute-resolution">
              <h3>⚖️ Résolution des litiges</h3>
              <div className="resolution-steps">
                <div className="resolution-step">
                  <h4>1️⃣ Résolution amiable</h4>
                  <p>
                    En cas de litige, nous privilégions une résolution amiable. 
                    Contactez-nous à : <a href="mailto:legal@trustboost.fr">legal@trustboost.fr</a>
                  </p>
                </div>

                <div className="resolution-step">
                  <h4>2️⃣ Médiation</h4>
                  <p>
                    Si nécessaire, recours possible à un médiateur agréé par la Commission 
                    d'évaluation et de contrôle de la médiation de la consommation.
                  </p>
                </div>

                <div className="resolution-step">
                  <h4>3️⃣ Juridiction compétente</h4>
                  <p>
                    À défaut d'accord amiable, les tribunaux français sont seuls compétents. 
                    Tribunal de Commerce de Paris pour les litiges commerciaux.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="legal-section">
            <h2>9. Contact et questions</h2>
            
            <div className="contact-grid">
              <div className="contact-card">
                <h3>📧 Contact général</h3>
                <p><strong>Email :</strong> <a href="mailto:contact@trustboost.fr">contact@trustboost.fr</a></p>
                <p><strong>Téléphone :</strong> <a href="tel:+33123456789">+33 1 23 45 67 89</a></p>
                <p><strong>Horaires :</strong> Lun-Ven 9h-18h (UTC+1)</p>
              </div>

              <div className="contact-card">
                <h3>⚖️ Questions légales</h3>
                <p><strong>Email :</strong> <a href="mailto:legal@trustboost.fr">legal@trustboost.fr</a></p>
                <p><strong>DPO :</strong> <a href="mailto:dpo@trustboost.fr">dpo@trustboost.fr</a></p>
                <p><strong>Réponse :</strong> Sous 48h maximum</p>
              </div>

              <div className="contact-card">
                <h3>🛠️ Support technique</h3>
                <p><strong>Email :</strong> <a href="mailto:support@trustboost.fr">support@trustboost.fr</a></p>
                <p><strong>Disponibilité :</strong> 24/7</p>
                <p><strong>SLA :</strong> Réponse sous 4h</p>
              </div>

              <div className="contact-card">
                <h3>🏢 Adresse postale</h3>
                <address>
                  TrustBoost Phase 4<br />
                  123 Rue de la Tech<br />
                  75001 Paris<br />
                  France
                </address>
              </div>
            </div>
          </section>
        </main>

        <footer className="legal-footer">
          <div className="footer-grid">
            <div className="footer-section">
              <h3>📄 Document officiel</h3>
              <p>Ces mentions légales constituent un document contractuel.</p>
              <p><strong>Version :</strong> 4.0</p>
              <p><strong>Dernière mise à jour :</strong> {new Date(mentions.lastUpdated).toLocaleDateString('fr-FR')}</p>
            </div>
            
            <div className="footer-section">
              <h3>🔗 Liens juridiques</h3>
              <ul>
                <li><a href="/legal/cgu">Conditions Générales d'Utilisation</a></li>
                <li><a href="/legal/privacy">Politique de Confidentialité</a></li>
                <li><a href="/legal/cookies">Politique de Cookies</a></li>
                <li><a href="/legal/dpa">Accord de Traitement de Données</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>📚 Références légales</h3>
              <ul>
                <li><a href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164/" target="_blank">LCEN n°2004-575</a></li>
                <li><a href="https://eur-lex.europa.eu/eli/reg/2016/679/fr" target="_blank">RGPD (UE) 2016/679</a></li>
                <li><a href="https://www.cnil.fr" target="_blank">CNIL</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>🏛️ Organisme de contrôle</h3>
              <p><strong>CNIL</strong></p>
              <p>3 Place de Fontenoy<br />75334 PARIS CEDEX 07</p>
              <p><a href="https://www.cnil.fr/fr/plaintes" target="_blank">Déposer une plainte</a></p>
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
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
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

        .compliance-banner {
          background: #f1f8ff;
          border: 2px solid #0366d6;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .compliance-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .compliance-content h2 {
          margin: 0 0 0.5rem 0;
          color: #0366d6;
        }

        .compliance-content p {
          margin: 0;
          color: #586069;
        }

        .legal-toc {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          border-left: 4px solid #6f42c1;
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
          color: #6f42c1;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .legal-toc a:hover {
          color: #5a2d8c;
          text-decoration: underline;
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
          border-bottom: 3px solid #6f42c1;
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

        .company-card {
          background: #f8f9fa;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 2rem;
          margin: 1rem 0;
        }

        .company-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e9ecef;
        }

        .company-header h3 {
          margin: 0;
          font-size: 1.8rem;
        }

        .company-badges {
          display: flex;
          gap: 0.5rem;
        }

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .badge.sas {
          background: #e3f2fd;
          color: #1976d2;
        }

        .badge.active {
          background: #e8f5e8;
          color: #388e3c;
        }

        .company-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .detail-group {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #6f42c1;
        }

        .detail-group h4 {
          margin-top: 0;
          color: #6f42c1;
        }

        .director-card, .hosting-card, .service-card, .data-section {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #17a2b8;
          margin: 1rem 0;
        }

        .director-info, .hosting-details, .technical-services {
          background: white;
          padding: 1rem;
          border-radius: 6px;
          margin-top: 1rem;
        }

        .hosting-grid, .services-grid, .regulatory-grid, .contact-grid, .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
          margin: 1rem 0;
        }

        .activity-overview, .ip-overview, .data-summary {
          background: #e8f4f8;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #17a2b8;
          margin-bottom: 2rem;
        }

        .ip-sections, .data-sections, .liability-sections {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .ip-section, .liability-section, .regulatory-item {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #fd7e14;
        }

        .jurisdiction-info {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #dc3545;
          margin-bottom: 2rem;
        }

        .resolution-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .resolution-step {
          background: #fff3cd;
          padding: 1rem;
          border-radius: 8px;
          border-left: 4px solid #ffc107;
        }

        .contact-card {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #28a745;
        }

        .legal-link {
          color: #6f42c1;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .legal-link:hover {
          color: #5a2d8c;
          text-decoration: underline;
        }

        .legal-footer {
          border-top: 2px solid #ecf0f1;
          margin-top: 3rem;
          padding-top: 2rem;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
        }

        .footer-section li {
          margin-bottom: 0.5rem;
        }

        .footer-section a {
          color: #6f42c1;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-section a:hover {
          color: #5a2d8c;
          text-decoration: underline;
        }

        address {
          font-style: normal;
          line-height: 1.4;
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

          .company-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .company-details {
            grid-template-columns: 1fr;
          }

          .compliance-banner {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Generate Legal Notice content using the legal documents generator
    const mentionsData = await legalDocumentsGenerator.generateLegalNotice({
      companyName: 'TrustBoost Phase 4',
      serviceName: 'TrustBoost Phase 4 - Multi-Agent Orchestration Platform',
      website: 'https://trustboost-phase4.vercel.app',
      contactEmail: 'contact@trustboost.fr',
      legalEmail: 'legal@trustboost.fr',
      jurisdiction: 'Droit français',
      lastUpdated: new Date().toISOString()
    });

    const metadata = {
      canonical: 'https://trustboost-phase4.vercel.app/legal/mentions-legales',
      structured: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Mentions Légales - TrustBoost Phase 4',
        description: 'Mentions légales conformes à la législation française pour TrustBoost Phase 4',
        publisher: {
          '@type': 'Organization',
          name: 'TrustBoost Phase 4',
          url: 'https://trustboost-phase4.vercel.app'
        },
        dateModified: new Date().toISOString()
      }
    };

    return {
      props: {
        mentions: mentionsData,
        metadata
      }
    };
  } catch (error) {
    console.error('Error generating Legal Notice:', error);
    
    // Fallback data
    return {
      props: {
        mentions: {
          title: 'Mentions Légales',
          lastUpdated: new Date().toISOString(),
          content: {},
          legal: {
            company: {
              name: 'TrustBoost Phase 4',
              legalForm: 'SAS (Société par Actions Simplifiée)',
              capital: '10000',
              address: '123 Rue de la Tech',
              postalCode: '75001',
              city: 'Paris',
              country: 'France',
              siret: '12345678901234',
              vatNumber: 'FR12345678901',
              apeCode: '6201Z',
              apeLabel: 'Programmation informatique',
              rcs: 'RCS Paris 123 456 789',
              courthouse: 'Greffe du Tribunal de Commerce de Paris',
              creationDate: '2024-01-01',
              email: 'contact@trustboost.fr',
              phone: '+33123456789',
              website: 'https://trustboost-phase4.vercel.app',
              director: {
                name: 'Directeur Technique',
                title: 'Directeur Général',
                email: 'direction@trustboost.fr'
              }
            },
            hosting: {
              provider: {
                name: 'Vercel Inc.',
                address: '340 S Lemon Ave',
                city: 'Walnut, CA 91789',
                country: 'United States',
                website: 'https://vercel.com'
              },
              location: 'Union Européenne',
              availability: '99.9%',
              certifications: ['SOC 2', 'GDPR Compliant', 'ISO 27001']
            },
            technical: {
              database: {
                provider: 'Services internes',
                location: 'Union Européenne'
              },
              monitoring: {
                provider: 'Sentry.io'
              },
              cdn: {
                provider: 'Vercel Edge Network'
              }
            }
          }
        },
        metadata: {
          canonical: 'https://trustboost-phase4.vercel.app/legal/mentions-legales',
          structured: {}
        }
      }
    };
  }
};