import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { legalDocumentsGenerator } from '../../src/gdpr-compliance/legal-documents.js';

interface CGUProps {
  cgu: {
    title: string;
    lastUpdated: string;
    content: any;
    legal: {
      jurisdiction: string;
      company: any;
    };
  };
  metadata: {
    canonical: string;
    structured: any;
  };
}

export default function CGUPage({ cgu, metadata }: CGUProps) {
  return (
    <>
      <Head>
        <title>{cgu.title} - TrustBoost Phase 4</title>
        <meta name="description" content="Conditions Générales d'Utilisation de TrustBoost Phase 4 - Conformes RGPD et droit français" />
        <meta name="robots" content="index,follow" />
        <meta name="author" content="TrustBoost Phase 4" />
        <meta name="keywords" content="CGU,conditions générales,utilisation,RGPD,conformité,droit français" />
        <link rel="canonical" href={metadata.canonical} />
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(metadata.structured) }} 
        />
      </Head>

      <div className="legal-document-container">
        <header className="legal-header">
          <h1 className="legal-title">{cgu.title}</h1>
          <div className="legal-meta">
            <p className="last-updated">Dernière mise à jour : {new Date(cgu.lastUpdated).toLocaleDateString('fr-FR')}</p>
            <p className="jurisdiction">Droit applicable : {cgu.legal.jurisdiction}</p>
          </div>
        </header>

        <nav className="legal-toc">
          <h2>Table des matières</h2>
          <ol>
            <li><a href="#acceptation">1. Acceptation des conditions</a></li>
            <li><a href="#definitions">2. Définitions</a></li>
            <li><a href="#objet">3. Objet du service</a></li>
            <li><a href="#acces">4. Accès et utilisation</a></li>
            <li><a href="#obligations">5. Obligations des utilisateurs</a></li>
            <li><a href="#propriete">6. Propriété intellectuelle</a></li>
            <li><a href="#donnees">7. Protection des données</a></li>
            <li><a href="#responsabilite">8. Responsabilité</a></li>
            <li><a href="#modification">9. Modification des conditions</a></li>
            <li><a href="#resiliation">10. Résiliation</a></li>
            <li><a href="#droit-applicable">11. Droit applicable et juridiction</a></li>
          </ol>
        </nav>

        <main className="legal-content">
          <section id="acceptation" className="legal-section">
            <h2>1. Acceptation des conditions</h2>
            <p>
              En accédant au service TrustBoost Phase 4 (ci-après "le Service"), vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation (CGU). 
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Service.
            </p>
            <p>
              Votre utilisation continue du Service constitue votre accord avec toute modification de ces CGU.
            </p>
          </section>

          <section id="definitions" className="legal-section">
            <h2>2. Définitions</h2>
            <dl className="legal-definitions">
              <dt>Service</dt>
              <dd>L'ensemble des fonctionnalités et services offerts par TrustBoost Phase 4, accessible via l'URL principale et ses sous-domaines.</dd>
              
              <dt>Utilisateur</dt>
              <dd>Toute personne physique ou morale accédant et utilisant le Service.</dd>
              
              <dt>Données Personnelles</dt>
              <dd>Toute information permettant d'identifier directement ou indirectement une personne physique, au sens du RGPD.</dd>
              
              <dt>Contenu Utilisateur</dt>
              <dd>Toute donnée, information, texte, software, musique, son, photographie, graphique, vidéo, message ou autre matériel téléchargé, transmis ou stocké via le Service.</dd>
            </dl>
          </section>

          <section id="objet" className="legal-section">
            <h2>3. Objet du service</h2>
            <p>
              TrustBoost Phase 4 propose une plateforme d'orchestration multi-agents avec des fonctionnalités d'IA avancées, comprenant :
            </p>
            <ul>
              <li>Orchestration intelligente de tâches multi-agents</li>
              <li>Intégration d'API d'intelligence artificielle</li>
              <li>Gestion de workflows automatisés</li>
              <li>Analyse et reporting de performance</li>
              <li>Conformité RGPD et sécurité des données</li>
            </ul>
          </section>

          <section id="acces" className="legal-section">
            <h2>4. Accès et utilisation</h2>
            <h3>4.1 Conditions d'accès</h3>
            <p>
              L'accès au Service est ouvert à toute personne physique ou morale ayant la capacité juridique pour contracter. 
              Les mineurs doivent obtenir l'autorisation parentale avant utilisation.
            </p>
            
            <h3>4.2 Inscription</h3>
            <p>
              L'utilisation complète du Service peut nécessiter la création d'un compte utilisateur. 
              Vous vous engagez à fournir des informations exactes, complètes et à jour.
            </p>
            
            <h3>4.3 Sécurité du compte</h3>
            <p>
              Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toute activité survenant sur votre compte.
            </p>
          </section>

          <section id="obligations" className="legal-section">
            <h2>5. Obligations des utilisateurs</h2>
            <p>En utilisant le Service, vous vous engagez à :</p>
            <ul>
              <li>Respecter les présentes CGU et la réglementation applicable</li>
              <li>Ne pas porter atteinte aux droits de tiers</li>
              <li>Ne pas perturber le fonctionnement du Service</li>
              <li>Ne pas utiliser le Service à des fins illégales ou non autorisées</li>
              <li>Protéger la confidentialité des données traitées</li>
              <li>Signaler tout dysfonctionnement ou sécurité</li>
            </ul>
          </section>

          <section id="propriete" className="legal-section">
            <h2>6. Propriété intellectuelle</h2>
            <h3>6.1 Propriété du Service</h3>
            <p>
              Tous les éléments du Service (logiciels, textes, images, sons, vidéos, marques, logos) sont protégés par le droit de la propriété intellectuelle. 
              Ils sont la propriété exclusive de TrustBoost Phase 4 ou de ses partenaires.
            </p>
            
            <h3>6.2 Licence d'utilisation</h3>
            <p>
              TrustBoost Phase 4 vous accorde une licence limitée, non exclusive, non transférable et révocable d'utilisation du Service, 
              dans le cadre de son usage normal et conformément aux présentes CGU.
            </p>
            
            <h3>6.3 Contenu Utilisateur</h3>
            <p>
              Vous conservez la propriété de votre Contenu Utilisateur. En le téléchargeant sur le Service, 
              vous accordez à TrustBoost Phase 4 une licence nécessaire au fonctionnement du Service.
            </p>
          </section>

          <section id="donnees" className="legal-section">
            <h2>7. Protection des données personnelles</h2>
            <p>
              Le traitement de vos données personnelles est régi par notre 
              <a href="/legal/privacy" className="legal-link"> Politique de Confidentialité</a>, 
              conforme au Règlement Général sur la Protection des Données (RGPD).
            </p>
            
            <h3>7.1 Vos droits</h3>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité</li>
              <li>Droit d'opposition</li>
            </ul>
            
            <h3>7.2 Contact DPO</h3>
            <p>
              Pour exercer vos droits ou pour toute question relative à la protection des données : 
              <a href="mailto:dpo@trustboost.fr" className="legal-link">dpo@trustboost.fr</a>
            </p>
          </section>

          <section id="responsabilite" className="legal-section">
            <h2>8. Responsabilité</h2>
            <h3>8.1 Responsabilité de TrustBoost Phase 4</h3>
            <p>
              TrustBoost Phase 4 s'efforce d'assurer un service de qualité mais ne peut garantir :
            </p>
            <ul>
              <li>L'absence d'interruption du Service</li>
              <li>L'absence d'erreurs ou de dysfonctionnements</li>
              <li>La compatibilité avec tous les environnements techniques</li>
            </ul>
            
            <h3>8.2 Limitation de responsabilité</h3>
            <p>
              En aucun cas TrustBoost Phase 4 ne pourra être tenu responsable de dommages indirects, 
              y compris la perte de profits, de données, ou d'opportunités commerciales.
            </p>
            
            <h3>8.3 Force majeure</h3>
            <p>
              TrustBoost Phase 4 ne pourra être tenu pour responsable de tout retard ou défaillance 
              d'exécution lorsque la cause du retard ou de la défaillance est liée à un cas de force majeure.
            </p>
          </section>

          <section id="modification" className="legal-section">
            <h2>9. Modification des conditions</h2>
            <p>
              TrustBoost Phase 4 se réserve le droit de modifier les présentes CGU à tout moment. 
              Les modifications prennent effet dès leur publication sur le Service.
            </p>
            <p>
              Les utilisateurs seront informés des modifications substantielles par notification 
              sur le Service ou par e-mail pour les utilisateurs enregistrés.
            </p>
            <p>
              La poursuite de l'utilisation du Service après modification vaut acceptation des nouvelles conditions.
            </p>
          </section>

          <section id="resiliation" className="legal-section">
            <h2>10. Résiliation</h2>
            <h3>10.1 Résiliation par l'utilisateur</h3>
            <p>
              Vous pouvez cesser d'utiliser le Service à tout moment. 
              Pour les comptes enregistrés, vous pouvez demander la suppression de votre compte.
            </p>
            
            <h3>10.2 Résiliation par TrustBoost Phase 4</h3>
            <p>
              TrustBoost Phase 4 peut suspendre ou résilier votre accès au Service en cas de violation des présentes CGU, 
              avec un préavis raisonnable sauf en cas de violation grave.
            </p>
            
            <h3>10.3 Effets de la résiliation</h3>
            <p>
              En cas de résiliation, votre droit d'accès au Service cesse immédiatement. 
              Les clauses qui doivent survivre à la résiliation restent en vigueur.
            </p>
          </section>

          <section id="droit-applicable" className="legal-section">
            <h2>11. Droit applicable et juridiction</h2>
            <p>
              Les présentes CGU sont régies par le droit français. 
              Tout litige relatif à leur interprétation ou exécution sera soumis aux tribunaux français compétents.
            </p>
            
            <h3>11.1 Résolution amiable</h3>
            <p>
              En cas de litige, les parties s'efforceront de trouver une solution amiable avant tout recours judiciaire.
            </p>
            
            <h3>11.2 Médiation</h3>
            <p>
              Conformément aux dispositions du Code de la consommation, l'utilisateur consommateur peut recourir 
              gratuitement au service de médiation proposé par TrustBoost Phase 4.
            </p>
          </section>
        </main>

        <footer className="legal-footer">
          <div className="contact-info">
            <h3>Informations de contact</h3>
            <div className="company-info">
              <p><strong>{cgu.legal.company.name}</strong></p>
              <p>{cgu.legal.company.address}</p>
              <p>{cgu.legal.company.postalCode} {cgu.legal.company.city}, {cgu.legal.company.country}</p>
              <p>SIRET : {cgu.legal.company.siret}</p>
              <p>Email : <a href={`mailto:${cgu.legal.company.email}`}>{cgu.legal.company.email}</a></p>
            </div>
          </div>
          
          <div className="legal-links">
            <h3>Liens juridiques</h3>
            <ul>
              <li><a href="/legal/privacy">Politique de Confidentialité</a></li>
              <li><a href="/legal/mentions-legales">Mentions Légales</a></li>
              <li><a href="/legal/dpa">Accord de Traitement de Données</a></li>
              <li><a href="/legal/cookies">Politique de Cookies</a></li>
            </ul>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .legal-document-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: #2c3e50;
        }

        .legal-header {
          border-bottom: 3px solid #3498db;
          padding-bottom: 1.5rem;
          margin-bottom: 2rem;
        }

        .legal-title {
          font-size: 2.5rem;
          color: #2c3e50;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .legal-meta {
          display: flex;
          gap: 2rem;
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .legal-toc {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
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
        }

        .legal-toc li {
          margin-bottom: 0.5rem;
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
          max-width: 800px;
        }

        .legal-section {
          margin-bottom: 3rem;
          scroll-margin-top: 2rem;
        }

        .legal-section h2 {
          color: #2c3e50;
          font-size: 1.8rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #ecf0f1;
        }

        .legal-section h3 {
          color: #34495e;
          font-size: 1.3rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .legal-section p {
          margin-bottom: 1rem;
          text-align: justify;
        }

        .legal-section ul, .legal-section ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }

        .legal-section li {
          margin-bottom: 0.5rem;
        }

        .legal-definitions dt {
          font-weight: 600;
          color: #2c3e50;
          margin-top: 1rem;
        }

        .legal-definitions dd {
          margin-left: 1rem;
          margin-bottom: 1rem;
          padding-left: 1rem;
          border-left: 2px solid #ecf0f1;
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

        .legal-footer {
          border-top: 2px solid #ecf0f1;
          margin-top: 3rem;
          padding-top: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .legal-footer h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .company-info p {
          margin: 0.25rem 0;
        }

        .legal-links ul {
          list-style: none;
          padding: 0;
        }

        .legal-links li {
          margin-bottom: 0.5rem;
        }

        .legal-links a {
          color: #3498db;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .legal-links a:hover {
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

          .legal-footer {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Generate CGU content using the legal documents generator
    const cguData = await legalDocumentsGenerator.generateTermsOfService({
      companyName: 'TrustBoost Phase 4',
      serviceName: 'TrustBoost Phase 4 - Multi-Agent Orchestration Platform',
      website: 'https://trustboost-phase4.vercel.app',
      contactEmail: 'legal@trustboost.fr',
      jurisdiction: 'Droit français',
      lastUpdated: new Date().toISOString()
    });

    const metadata = {
      canonical: 'https://trustboost-phase4.vercel.app/legal/cgu',
      structured: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Conditions Générales d\'Utilisation - TrustBoost Phase 4',
        description: 'Conditions Générales d\'Utilisation conformes RGPD pour TrustBoost Phase 4',
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
        cgu: cguData,
        metadata
      }
    };
  } catch (error) {
    console.error('Error generating CGU:', error);
    
    // Fallback data
    return {
      props: {
        cgu: {
          title: 'Conditions Générales d\'Utilisation',
          lastUpdated: new Date().toISOString(),
          content: {},
          legal: {
            jurisdiction: 'Droit français',
            company: {
              name: 'TrustBoost Phase 4',
              address: '123 Rue de la Tech',
              postalCode: '75001',
              city: 'Paris',
              country: 'France',
              siret: '12345678901234',
              email: 'contact@trustboost.fr'
            }
          }
        },
        metadata: {
          canonical: 'https://trustboost-phase4.vercel.app/legal/cgu',
          structured: {}
        }
      }
    };
  }
};