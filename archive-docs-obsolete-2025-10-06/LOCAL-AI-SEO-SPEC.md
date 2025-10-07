# LocalAI SEO - Specification

**Version:** 1.0
**Date:** 2025-01-05
**Status:** MVP Phase 1 (2 weeks)
**Owner:** @manu
**Claude Code Session:** archon-orchestrator

---

## 📋 Executive Summary

**Problème :** 93% des PME optimisent pour Google, mais seulement 2% apparaissent dans les recommandations ChatGPT, Claude et Perplexity. Les clients utilisent de plus en plus les IA pour trouver des services locaux. Les entreprises invisibles dans ces plateformes perdent des opportunités critiques.

**Solution :** LocalAI SEO - Plateforme SaaS qui permet aux PME de monitorer, optimiser et améliorer leur visibilité dans les réponses des IA (ChatGPT, Claude, Perplexity).

**Timing :** SearchGPT public Q1 2025, Gemini Business actif, Perplexity 40% intent local = fenêtre d'opportunité 6-12 mois avant concurrence.

**MVP Scope :** Validation produit en 2 semaines avec audit gratuit + monitoring 3 plateformes + optimisation basique.

---

## 🎯 Objectives

### Business Objectives

1. **Validation Product-Market Fit** : 50 audits gratuits → 5 clients payants (10% conversion)
2. **Revenue Month 1** : 5 clients x 299€ = 1,495€ MRR
3. **Breakeven** : Month 3 avec 20 clients payants
4. **Scale Path** : 120 clients M12 = 35,880€ MRR

### Technical Objectives

1. **Time-to-Market** : MVP fonctionnel en 2 semaines
2. **Scalability** : Architecture supportant 500+ clients sans refonte
3. **Reliability** : 99% uptime monitoring, alertes en <5 min
4. **Cost-Efficiency** : API costs <50% revenue (marge brute ≥50%)

### User Objectives

1. **Transparence** : Comprendre leur visibilité IA actuelle (score 0-100)
2. **Amélioration mesurable** : +20% AI Visibility Score en 30 jours
3. **Autonomie** : Dashboard self-service, pas de dépendance support

---

## 👥 Target Users

### Primary Persona : "Laurent, Propriétaire Restaurant Haut de Gamme"

**Profil :**
- Âge : 42 ans
- Restaurant italien à Lyon, 25 places
- Budget marketing : 800€/mois
- Tech-savvy : utilise Instagram, Google Business

**Pain Points :**
- "Mes clients me disent qu'ils ont demandé à ChatGPT et mon resto n'est pas apparu"
- "Je paye 300€/mois SEO Google mais ça marche de moins en moins"
- "Je ne sais pas comment apparaître dans les IA"

**Jobs to be Done :**
- Savoir si son restaurant est recommandé par les IA
- Comprendre pourquoi concurrents apparaissent et pas lui
- Améliorer présence sans compétences techniques

**Success Criteria :**
- Apparaît dans top 3 recommandations ChatGPT pour "meilleur italien Lyon"
- Reçoit 3-5 clients/mois qui disent "ChatGPT m'a recommandé"

### Secondary Personas

**"Sophie, Avocate Indépendante"**
- Pain : Clients trouvent concurrents via Perplexity
- Budget : 500€/mois marketing
- Goal : Être recommandée pour "avocat divorce Lyon"

**"Marc, Agent Immobilier"**
- Pain : Agences concurrentes apparaissent dans Claude
- Budget : 1,000€/mois marketing
- Goal : Top 3 pour "agent immo Lyon 6ème"

---

## 🏗️ Architecture Overview

### System Architecture (MVP)

```
┌─────────────────────────────────────────────────────────────┐
│                      USERS (PME)                            │
│                  Browser (Chrome/Safari)                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTPS
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (Next.js 14 + Vercel)                 │
│  ┌──────────────┬──────────────┬──────────────┐            │
│  │ Landing Page │ Dashboard    │ Audit Tool   │            │
│  │ (Public)     │ (Auth)       │ (Public)     │            │
│  └──────────────┴──────────────┴──────────────┘            │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ API Calls
                 ▼
┌─────────────────────────────────────────────────────────────┐
│          BACKEND (Next.js API Routes + Vercel)              │
│  ┌─────────────────────────────────────────────────┐       │
│  │ /api/audit          - Free audit generation     │       │
│  │ /api/monitor        - AI platforms monitoring   │       │
│  │ /api/optimize       - Content optimization      │       │
│  │ /api/publish        - Auto-publish to GBP       │       │
│  └─────────────────────────────────────────────────┘       │
└────────┬─────────────┬──────────────┬──────────────────────┘
         │             │              │
         │             │              │
    ┌────▼─────┐  ┌───▼──────┐  ┌───▼──────────┐
    │ Supabase │  │ Vercel   │  │ External     │
    │ Database │  │ KV Cache │  │ AI APIs      │
    │ + Auth   │  │ (Redis)  │  │              │
    └──────────┘  └──────────┘  └───┬──────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
               ┌────▼─────┐   ┌─────▼────┐   ┌──────▼────┐
               │ OpenAI   │   │ Anthropic│   │ Perplexity│
               │ GPT-4    │   │ Claude   │   │ API       │
               │ API      │   │ 3.5      │   │           │
               └──────────┘   └──────────┘   └───────────┘
```

### Tech Stack

```javascript
const techStack = {
  // Frontend
  framework: 'Next.js 14 (App Router)',
  styling: 'Tailwind CSS + shadcn/ui',
  charts: 'Recharts',
  forms: 'React Hook Form + Zod',

  // Backend
  api: 'Next.js API Routes (serverless)',
  auth: 'Supabase Auth',
  database: 'Supabase (Postgres)',
  cache: 'Vercel KV (Redis)',
  queue: 'Vercel Cron Jobs',

  // AI Integrations
  ai_apis: [
    'OpenAI API (GPT-4 Turbo)',
    'Anthropic API (Claude 3.5 Sonnet)',
    'Perplexity API'
  ],

  // External Services
  payments: 'Stripe',
  email: 'Resend',
  analytics: 'PostHog',
  monitoring: 'Sentry',

  // Deployment
  hosting: 'Vercel',
  domain: 'TBD',
  cdn: 'Vercel Edge Network'
};
```

---

## 🎨 Core Features (MVP)

### Feature 1: Free AI Visibility Audit

**User Story :**
En tant que propriétaire PME, je veux savoir si mon entreprise apparaît dans les recommandations des IA pour que je comprenne si je perds des opportunités.

**Functional Requirements :**

1. **Audit Form (Public, No Auth)**
   - Input : Nom entreprise, catégorie, ville
   - Submit → génère rapport PDF en 30 secondes

2. **AI Querying Engine**
   - Génère 5 queries pertinentes (ex: "meilleur restaurant italien Lyon")
   - Query ChatGPT, Claude, Perplexity (parallel)
   - Parse responses → détecte mentions business

3. **Audit Report (PDF)**
   - AI Visibility Score : 0-100
   - Breakdown par plateforme :
     - ChatGPT : Mentionné ? Position ? Sentiment ?
     - Claude : idem
     - Perplexity : idem
   - Top 3 concurrents mentionnés
   - Recommandations (3 quick wins)

4. **Lead Capture**
   - Email required pour télécharger PDF
   - CTA : "Améliorer mon score" → signup

**Acceptance Criteria :**
- ✅ Audit complété en <60 secondes
- ✅ Détection mentions avec 90% précision
- ✅ PDF généré automatiquement
- ✅ Email envoyé avec lien download
- ✅ Taux conversion audit → signup ≥5%

**Technical Notes :**
```javascript
// Audit Flow
async function runAudit(businessData) {
  // 1. Generate queries
  const queries = await generateQueries(businessData);
  // ["meilleur restaurant italien lyon", "où manger italien lyon", ...]

  // 2. Query all platforms (parallel)
  const results = await Promise.all([
    queryOpenAI(queries),
    queryClaude(queries),
    queryPerplexity(queries)
  ]);

  // 3. Analyze mentions
  const analysis = await analyzeMentions(results, businessData);

  // 4. Calculate score
  const score = calculateVisibilityScore(analysis);

  // 5. Generate PDF
  const pdf = await generatePDF({ score, analysis, recommendations });

  // 6. Send email
  await sendEmail(businessData.email, pdf);

  return { score, pdf_url };
}
```

---

### Feature 2: AI Visibility Dashboard

**User Story :**
En tant que client payant, je veux voir en temps réel ma visibilité dans les IA pour que je puisse mesurer mes progrès.

**Functional Requirements :**

1. **Overview Metrics (Top Cards)**
   - AI Visibility Score : 0-100 (évolution 7/30 jours)
   - Total Mentions : Nombre de fois mentionné cette semaine
   - Average Position : Position moyenne (1er, 2ème, 3ème, etc.)
   - Sentiment Score : -100 à +100

2. **Platform Breakdown (Table)**
   - ChatGPT : Score, mentions, position, trend
   - Claude : idem
   - Perplexity : idem
   - Filtres : 7 jours / 30 jours / 90 jours

3. **Queries Monitored (List)**
   - Liste des 10-20 queries trackées
   - Status : Mentionné (✅) ou Absent (❌)
   - Competitors apparaissant à la place

4. **Recent Activity (Feed)**
   - Dernières 10 détections
   - "Votre business mentionné dans ChatGPT pour 'meilleur italien lyon'"
   - "Concurrent XYZ recommandé dans Claude pour 'restaurant italien'"

5. **Alerts Configuration**
   - Email si baisse score >10%
   - Email si concurrent nouveau mentionné
   - Slack webhook (optional)

**Acceptance Criteria :**
- ✅ Dashboard chargé en <2 secondes
- ✅ Données rafraîchies toutes les 6h
- ✅ Graphiques interactifs (hover, zoom)
- ✅ Mobile responsive
- ✅ Export PDF rapport mensuel

**Technical Notes :**
```javascript
// Dashboard Data Structure
const dashboardData = {
  overview: {
    aiVisibilityScore: 67,
    totalMentions: 15,
    avgPosition: 2.3,
    sentimentScore: 85,
    trends: {
      score: '+12%',
      mentions: '+5',
      position: '-0.4'
    }
  },

  platforms: [
    {
      name: 'ChatGPT',
      score: 72,
      mentions: 8,
      avgPosition: 2.1,
      sentiment: 90,
      trend: '+15%'
    },
    {
      name: 'Claude',
      score: 65,
      mentions: 5,
      avgPosition: 2.8,
      sentiment: 82,
      trend: '+8%'
    },
    {
      name: 'Perplexity',
      score: 64,
      mentions: 2,
      avgPosition: 1.5,
      sentiment: 88,
      trend: '+20%'
    }
  ],

  queries: [
    {
      query: 'meilleur restaurant italien lyon',
      mentioned: true,
      position: 2,
      competitors: ['La Scala', 'Il Ristorante']
    },
    {
      query: 'où manger italien lyon',
      mentioned: false,
      competitors: ['La Scala', 'Pizzeria Roma', 'Il Ristorante']
    }
  ],

  recentActivity: [
    {
      timestamp: '2025-01-05T10:30:00Z',
      platform: 'ChatGPT',
      query: 'meilleur italien lyon',
      status: 'mentioned',
      position: 2
    }
  ]
};
```

---

### Feature 3: AI Profile Optimizer

**User Story :**
En tant que client, je veux que mon profil business soit optimisé pour les IA pour qu'elles me recommandent plus souvent.

**Functional Requirements :**

1. **Business Profile Form**
   - Inputs :
     - Nom, catégorie, ville
     - Description courte (50 mots)
     - Services principaux (5 max)
     - Horaires, prix moyen, téléphone, site web
     - 3 différenciateurs clés

2. **AI-Optimized Content Generator**
   - Génère 3 descriptions :
     - **Conversational** : Ton naturel, comme recommandation ami
     - **Technical** : Faits précis, chiffres, spécifications
     - **Emotional** : Story, valeurs, expérience client
   - Longueur optimale : 150-200 mots
   - Inclut keywords naturels (pas stuffing)

3. **Perfect Answers Library**
   - Pour chaque query monitorée, génère "réponse parfaite"
   - Template :
     ```
     [Réponse directe à la question]
     [2 faits chiffrés vérifiables]
     [Ce qui rend unique]
     [CTA subtil]
     ```
   - Exemple :
     > "Pour un excellent restaurant italien à Lyon, je recommande [Business].
     > Ils proposent des pâtes fraîches faites maison tous les jours et une
     > carte de vins italiens avec plus de 50 références. Leur terrasse en
     > été est particulièrement agréable. Ouvert du mardi au samedi,
     > réservation recommandée au [phone]."

4. **Schema.org Markup Generator**
   - Génère code LocalBusiness schema
   - Copy-paste pour site web client
   - Fields : name, address, phone, hours, priceRange, reviews, etc.

**Acceptance Criteria :**
- ✅ 3 descriptions générées en <10 secondes
- ✅ Perfect answers pour 10 queries en <30 secondes
- ✅ Schema markup valide (Google Rich Results Test)
- ✅ Preview avant publication
- ✅ Edit manuel possible

**Technical Notes :**
```javascript
// AI Content Generation
async function generateOptimizedContent(business) {
  const prompt = `
    Génère 3 descriptions optimisées pour citations par IA.

    Business: ${business.name}
    Catégorie: ${business.category}
    Ville: ${business.city}
    Services: ${business.services.join(', ')}
    Différenciateurs: ${business.differentiators.join(', ')}

    Crée :
    1. Description conversationnelle (150-200 mots, ton ami)
    2. Description technique (150-200 mots, faits précis)
    3. Description émotionnelle (150-200 mots, story + valeurs)

    Format JSON.
  `;

  const response = await callClaudeAPI(prompt);

  return {
    conversational: response.conversational,
    technical: response.technical,
    emotional: response.emotional
  };
}

// Perfect Answer Generator
async function generatePerfectAnswer(business, query) {
  const prompt = `
    Génère la réponse PARFAITE que les IA vont citer pour cette question.

    Question: "${query}"
    Business: ${business.name}
    Infos: ${JSON.stringify(business)}

    Structure:
    1. Réponse directe (1 phrase)
    2. 2 faits chiffrés vérifiables
    3. Différenciateur unique (1 phrase)
    4. CTA subtil (phone/site)

    Longueur: 150-200 mots
    Ton: Conversationnel professionnel
    Format: Paragraphe citable tel quel
  `;

  return await callClaudeAPI(prompt);
}
```

---

### Feature 4: Auto-Publish to Google Business

**User Story :**
En tant que client, je veux que mes contenus optimisés soient automatiquement publiés sur mon profil Google Business pour que les IA les crawlent.

**Functional Requirements :**

1. **Google Business Profile Connection**
   - OAuth Google My Business API
   - Permissions : read + write posts
   - Sélection location (si multi-locations)

2. **Auto-Publish Workflow**
   - Trigger : Nouveau perfect answer généré
   - Format : Post Google Business (max 1,500 caractères)
   - Fréquence : 1 post/semaine (éviter spam)
   - Preview avant publication

3. **Content Calendar**
   - Liste posts planifiés
   - Edit / Delete avant publication
   - Historique posts publiés

4. **Performance Tracking**
   - Views, clicks par post (Google API)
   - Corrélation avec AI Visibility Score

**Acceptance Criteria :**
- ✅ Connexion Google en <3 clics
- ✅ Publication automatique réussie 95% du temps
- ✅ Respect rate limits Google (max 7 posts/semaine)
- ✅ Notification email post publié

**Technical Notes :**
```javascript
// Google Business Profile API Integration
async function publishToGoogleBusiness(content, businessId) {
  // 1. Get access token
  const accessToken = await getGoogleAccessToken(businessId);

  // 2. Format content for GBP
  const post = {
    languageCode: 'fr',
    summary: content.substring(0, 1500),
    callToAction: {
      actionType: 'CALL',
      url: business.phone
    },
    topicType: 'STANDARD'
  };

  // 3. Publish via API
  const response = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/localPosts`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post)
    }
  );

  return response.json();
}
```

---

### Feature 5: Monitoring Engine (Background)

**User Story :**
En tant que système, je veux monitorer automatiquement toutes les queries clients pour détecter changements de visibilité.

**Functional Requirements :**

1. **Query Generation**
   - Par client, génère 10-20 queries pertinentes
   - Types :
     - Direct : "meilleur [category] [city]"
     - Intent : "où trouver [service] [city]"
     - Comparative : "[category] [city] vs [city2]"
     - Question : "quel [category] recommandez-vous [city]"

2. **Scheduled Monitoring (Vercel Cron)**
   - Fréquence par tier :
     - Starter (149€) : 1x/jour, 5 queries
     - Pro (299€) : 3x/jour, 15 queries
     - Enterprise (599€) : 6x/jour, 30 queries
   - Smart scheduling : Queries P0 plus fréquentes

3. **AI Platform Querying**
   - ChatGPT : OpenAI API + web_search tool
   - Claude : Anthropic API (sans web search MVP, V2)
   - Perplexity : Perplexity API
   - Retry logic : 3 tentatives si erreur

4. **Response Analysis**
   - Parse réponse IA
   - Détecte mention business (NER basique)
   - Extrait position (1er, 2ème, 3ème, pas mentionné)
   - Sentiment analysis (positif/neutre/négatif)
   - Identifie concurrents mentionnés

5. **Data Storage**
   - Table `monitoring_results` :
     ```sql
     {
       id, business_id, platform, query,
       mentioned, position, sentiment,
       competitors, response_raw, timestamp
     }
     ```
   - Rétention : 90 jours (purge automatique)

6. **Alerting**
   - Conditions :
     - Score baisse >10% en 7 jours
     - Position baisse de 2+ places
     - Nouveau concurrent top 3
     - Business pas mentionné alors qu'avant oui
   - Channels : Email (always), Slack (optional)

**Acceptance Criteria :**
- ✅ Monitoring tourne 24/7 sans intervention
- ✅ Détection mentions 90% précision
- ✅ Latency moyenne <30s par query
- ✅ Alertes envoyées <5min après détection
- ✅ Coût API <50% revenue client

**Technical Notes :**
```javascript
// Vercel Cron Job (app/api/cron/monitor/route.ts)
export async function GET() {
  // 1. Get all active businesses
  const businesses = await getActiveBusinesses();

  for (const business of businesses) {
    // 2. Get queries to monitor
    const queries = await getQueriesForBusiness(business.id);

    // 3. Monitor each query across platforms
    for (const query of queries) {
      await monitorQuery(business, query);
    }
  }

  return new Response('OK', { status: 200 });
}

async function monitorQuery(business, query) {
  // Parallel query all platforms
  const [chatgptResult, claudeResult, perplexityResult] = await Promise.all([
    queryPlatform('chatgpt', query),
    queryPlatform('claude', query),
    queryPlatform('perplexity', query)
  ]);

  // Analyze each result
  const analyses = await Promise.all([
    analyzeResponse(chatgptResult, business),
    analyzeResponse(claudeResult, business),
    analyzeResponse(perplexityResult, business)
  ]);

  // Store results
  await storeMonitoringResults(analyses);

  // Check for alerts
  await checkAlerts(business, analyses);
}

async function queryPlatform(platform, query) {
  switch (platform) {
    case 'chatgpt':
      return await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [{ role: 'user', content: query }],
        tools: [{ type: 'web_search' }]
      });

    case 'claude':
      return await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: query }]
      });

    case 'perplexity':
      return await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${PERPLEXITY_API_KEY}` },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [{ role: 'user', content: query }]
        })
      });
  }
}
```

---

## 💳 Pricing & Tiers

### Tier 1: Starter (149€/mois)

**Target :** Petits commerces, freelances

**Features :**
- ✅ AI Visibility Score
- ✅ Monitoring 3 plateformes (ChatGPT, Claude, Perplexity)
- ✅ 5 queries monitorées
- ✅ Dashboard analytics basique
- ✅ Alertes email
- ✅ 1 profil business
- ✅ Perfect Answers Generator (5 answers)
- ✅ Auto-publish Google Business (1 post/semaine)

**Limits :**
- Monitoring 1x/jour
- Historique 30 jours
- Support email (48h)

---

### Tier 2: Professional (299€/mois) ⭐ Recommandé

**Target :** PME multi-services, agences

**Features :**
- ✅ Tout Starter +
- ✅ 15 queries monitorées
- ✅ Monitoring 3x/jour
- ✅ Competitor tracking (top 5)
- ✅ Historique 90 jours
- ✅ Perfect Answers Generator (unlimited)
- ✅ Auto-publish Google Business (3 posts/semaine)
- ✅ Slack webhooks
- ✅ Export PDF rapports mensuels
- ✅ Support prioritaire (24h)

---

### Tier 3: Enterprise (599€/mois)

**Target :** Chaînes, franchises, multi-locations

**Features :**
- ✅ Tout Professional +
- ✅ 30 queries monitorées
- ✅ Monitoring 6x/jour
- ✅ Multi-locations (jusqu'à 5)
- ✅ API access
- ✅ Custom queries
- ✅ Dedicated account manager
- ✅ White-label reports
- ✅ Support 24/7

---

## 📊 Success Metrics

### Product Metrics

```javascript
const successMetrics = {
  // Acquisition
  audit_requests: {
    target_week1: 50,
    target_month1: 200,
    conversion_to_signup: '≥5%'
  },

  // Activation
  signup_to_paid: {
    target: '≥10%',
    timeframe: '7 days'
  },

  // Revenue
  mrr: {
    month1: '1,495€ (5 clients)',
    month3: '5,970€ (20 clients)',
    month6: '14,925€ (50 clients)',
    month12: '35,880€ (120 clients)'
  },

  // Retention
  churn_rate: {
    target: '<10%/mois',
    acceptable: '15%/mois' // Mois 1-3
  },

  // Product Quality
  monitoring_accuracy: '≥90%',
  alert_latency: '<5min',
  dashboard_load_time: '<2s',
  uptime: '≥99%'
};
```

### User Success Metrics

```javascript
const userMetrics = {
  // Value Delivered
  avg_visibility_improvement: {
    target: '+20% in 30 days',
    measurement: 'AI Visibility Score delta'
  },

  // Engagement
  dashboard_logins: '≥2x/week',
  alerts_actioned: '≥50%',

  // Satisfaction
  nps_score: '≥40',
  feature_requests: 'Track & prioritize'
};
```

---

## 🚀 Implementation Plan (2 Weeks)

### Week 1: Foundation

**Day 1-2: Infrastructure Setup**

```bash
# Init Next.js project
npx create-next-app@latest localai-seo --typescript --tailwind --app

# Setup Supabase
npx supabase init
npx supabase start

# Install dependencies
npm install @anthropic-ai/sdk openai @supabase/supabase-js stripe resend recharts zod react-hook-form
```

**Tasks :**
- ✅ Next.js 14 + TypeScript + Tailwind
- ✅ Supabase project (database + auth)
- ✅ Vercel project + KV Redis
- ✅ shadcn/ui components installation

**Day 3-4: Free Audit Tool**

```bash
claude code --task "créer landing page avec formulaire audit gratuit + API route qui query ChatGPT, Claude, Perplexity et génère rapport PDF"
```

**Tasks :**
- ✅ Landing page (hero + features + pricing + FAQ)
- ✅ Audit form (business name, category, city, email)
- ✅ `/api/audit` endpoint :
  - Generate 5 queries
  - Query 3 AI platforms (parallel)
  - Analyze responses
  - Generate PDF report
  - Send email with download link
- ✅ Email templates (Resend)

**Day 5-7: Authentication + Database Schema**

```bash
claude code --task "implémenter Supabase Auth avec Google OAuth + créer database schema pour businesses, queries, monitoring_results"
```

**Tasks :**
- ✅ Supabase Auth setup
- ✅ Database schema :
  ```sql
  -- businesses table
  create table businesses (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users,
    name text not null,
    category text not null,
    city text not null,
    description text,
    website text,
    phone text,
    tier text default 'starter',
    created_at timestamptz default now()
  );

  -- queries table
  create table queries (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid references businesses,
    query_text text not null,
    priority integer default 1,
    created_at timestamptz default now()
  );

  -- monitoring_results table
  create table monitoring_results (
    id uuid primary key default uuid_generate_v4(),
    business_id uuid references businesses,
    query_id uuid references queries,
    platform text not null,
    mentioned boolean,
    position integer,
    sentiment text,
    competitors jsonb,
    response_raw text,
    created_at timestamptz default now()
  );
  ```
- ✅ Row Level Security policies
- ✅ Login/signup pages

---

### Week 2: Core Features

**Day 8-9: Dashboard + Monitoring Engine**

```bash
claude code --task "créer dashboard AI Visibility avec métriques temps réel + background monitoring engine avec Vercel Cron"
```

**Tasks :**
- ✅ Dashboard layout (sidebar + top metrics cards)
- ✅ AI Visibility Score calculation
- ✅ Platform breakdown table + charts (Recharts)
- ✅ Recent activity feed
- ✅ `/api/cron/monitor` endpoint (Vercel Cron)
- ✅ Query generation logic
- ✅ AI platform integrations (OpenAI, Anthropic, Perplexity APIs)

**Day 10-11: AI Profile Optimizer + Perfect Answers**

```bash
claude code --task "créer AI Profile Optimizer qui génère 3 descriptions optimisées + Perfect Answers Generator pour queries monitorées"
```

**Tasks :**
- ✅ Business profile form (onboarding)
- ✅ AI content generation (Claude API)
- ✅ Preview + edit interface
- ✅ Schema.org markup generator
- ✅ Perfect Answers library (table view)

**Day 12-13: Google Business Integration + Payments**

```bash
claude code --task "implémenter Google My Business OAuth + auto-publish posts + Stripe checkout pour 3 tiers pricing"
```

**Tasks :**
- ✅ Google OAuth flow (My Business API)
- ✅ Auto-publish to Google Business Profile
- ✅ Content calendar UI
- ✅ Stripe setup (products, checkout, webhooks)
- ✅ Subscription management page

**Day 14: Polish + Launch Prep**

**Tasks :**
- ✅ Error handling + loading states
- ✅ Mobile responsive (all pages)
- ✅ Email templates design
- ✅ Analytics setup (PostHog)
- ✅ Sentry error tracking
- ✅ Domain + SSL setup
- ✅ Production deploy (Vercel)
- ✅ Beta launch avec 5 early adopters

---

## 🧪 Testing & Validation

### Testing Strategy

**Unit Tests (Optional MVP, V2) :**
- Core business logic (score calculation, mention detection)
- Using Vitest

**Integration Tests (Critical) :**
```bash
# Test AI integrations
test('ChatGPT query returns valid response', async () => {
  const result = await queryPlatform('chatgpt', 'meilleur restaurant lyon');
  expect(result).toHaveProperty('answer');
  expect(result.answer.length).toBeGreaterThan(50);
});

# Test monitoring flow
test('Monitoring detects business mention', async () => {
  const business = { name: 'La Scala', city: 'Lyon' };
  const query = 'meilleur restaurant italien lyon';
  const result = await monitorQuery(business, query);
  expect(result.mentioned).toBe(true);
});
```

**Manual Testing Checklist :**
- [ ] Audit gratuit fonctionne end-to-end
- [ ] Signup → onboarding → dashboard flow
- [ ] Monitoring détecte mentions (test avec vraies queries)
- [ ] Alertes email envoyées correctement
- [ ] Google Business publication réussie
- [ ] Stripe checkout → subscription activée
- [ ] Mobile responsive (iPhone + Android)

---

### Beta Launch Validation

**Cohort 1 : 5 Early Adopters**

**Critères sélection :**
- PME locales Lyon/Paris
- Catégories : 2 restos, 1 avocat, 1 agent immo, 1 coiffeur
- Tech-savvy (utilisent déjà Google Business)

**Offre :**
- 50% off 3 premiers mois (149€ → 75€)
- Onboarding call 30min
- Feedback hebdo (call 15min)

**Success Criteria Beta :**
- ✅ 4/5 utilisent produit ≥2x/semaine
- ✅ 3/5 voient +10% AI Visibility Score en 30 jours
- ✅ 0 churn pendant beta (3 mois)
- ✅ NPS ≥40

**Validation Go/No-Go :**
- Si ✅ 3/4 criteria → Launch public + scale marketing
- Si ❌ → Pivot features ou abandon

---

## 🎯 Post-MVP Roadmap (V2)

### Phase 2: Advanced Features (Month 2-3)

**1. Gemini Integration**
- Add 4th platform monitoring
- Cost: +25% API costs

**2. Citation Pattern ML**
- Train model sur 10,000+ réponses IA
- Prédire ce que les IA vont citer
- Optimisation automatique

**3. Competitor Hijacking**
- Auto-génère contenus "alternative à [concurrent]"
- Publication stratégique

**4. Multi-language Support**
- Anglais + Espagnol
- Monitoring international

**5. API Access (Enterprise)**
- REST API pour agences SEO
- White-label dashboard

### Phase 3: Scale & Partnerships (Month 4-6)

**1. Agency Program**
- White-label solution
- 20% commission
- 50+ agencies = 500+ clients

**2. Reddit/LinkedIn Auto-Posting**
- Discussions authentiques générées par IA
- Seed knowledge dans sources crawlées

**3. Reputation Management**
- Réponses automatiques avis Google
- Génération avis positifs (éthique)

---

## 🚨 Risks & Mitigations

### Technical Risks

**Risk 1 : API Costs Explosion**
- **Impact** : Marge brute <30%
- **Probability** : Medium
- **Mitigation** :
  - Smart caching (Redis 24h)
  - Query batching
  - Rate limiting stricte par tier
  - Monitoring costs dashboard

**Risk 2 : AI Platform API Changes**
- **Impact** : Monitoring cassé
- **Probability** : High
- **Mitigation** :
  - Abstraction layer (adapter pattern)
  - Fallback strategies
  - Version pinning
  - Alerting sur API errors

**Risk 3 : Mention Detection Précision <80%**
- **Impact** : Données inexploitables
- **Probability** : Medium
- **Mitigation** :
  - Fine-tuning prompts detection
  - Human-in-the-loop validation (beta)
  - Amélioration ML continue

### Business Risks

**Risk 4 : Conversion Audit → Payant <5%**
- **Impact** : Croissance stoppée
- **Probability** : Medium
- **Mitigation** :
  - A/B testing CTAs
  - Retargeting email sequences
  - Upsell features audit (concurrents, recommandations détaillées)

**Risk 5 : Churn >20%/mois**
- **Impact** : MRR stagne
- **Probability** : Low-Medium
- **Mitigation** :
  - Onboarding guidé
  - Success emails automatiques ("Votre score a augmenté de +15%!")
  - Customer success calls mois 1

**Risk 6 : Concurrence rapide**
- **Impact** : Perte first-mover advantage
- **Probability** : High (6-12 mois)
- **Mitigation** :
  - Speed-to-market (MVP 2 semaines)
  - Features différenciantes (ML patterns, competitor hijacking)
  - Lock-in clients (annual plans -20%)

---

## 📚 References

### Technical Documentation
- [OpenAI API - Web Search](https://platform.openai.com/docs/guides/web-search)
- [Anthropic Claude API](https://docs.anthropic.com/claude/reference/getting-started)
- [Perplexity API](https://docs.perplexity.ai/)
- [Google My Business API](https://developers.google.com/my-business/content/overview)
- [Next.js 14 App Router](https://nextjs.org/docs/app)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

### Market Research
- SearchGPT Launch Timeline (Q1 2025)
- Perplexity 40% Local Intent Queries
- Google Search Traffic -12% (2024)
- ChatGPT Search +340% Usage (2024)

---

## ✅ Definition of Done

**MVP est considéré DONE quand :**

- [ ] Audit gratuit fonctionne end-to-end (form → PDF → email)
- [ ] Dashboard affiche métriques temps réel (score, mentions, position)
- [ ] Monitoring engine tourne 24/7 (Vercel Cron)
- [ ] AI Profile Optimizer génère 3 descriptions + perfect answers
- [ ] Google Business auto-publish fonctionne
- [ ] Stripe checkout fonctionnel (3 tiers)
- [ ] 5 beta users actifs avec données réelles
- [ ] Validation criteria : 4/5 utilisent ≥2x/semaine
- [ ] Production deploy stable (0 critical bugs)
- [ ] Documentation utilisateur complète

---

**Version:** 1.0 MVP
**Next Review:** Après beta (semaine 4)
**Owner:** @manu
**Status:** ✅ Ready for Implementation

*LocalAI SEO - Être la réponse recommandée quand quelqu'un demande à une IA de trouver un service local.*
