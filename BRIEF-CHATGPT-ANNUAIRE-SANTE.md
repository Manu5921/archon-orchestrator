# 🤖 BRIEF CHATGPT - Annuaire Santé Infirmières (Architecture Technique)

## 🎯 Contexte Projet

**Nom projet :** Annuaire Santé Pro (infirmières → praticiens)
**Client :** Pôle Santé Département (France)
**Use Case :** Infirmières en consultation cherchent praticiens (médecins, spécialistes, pharmaciens) pour prendre RDV patients

## 📋 Scope MVP v1.0 (Simplifié)

### Fonctionnalités Core
1. **Annuaire praticiens** : Liste searchable (nom, spécialité, adresse, téléphone)
2. **Recherche multi-critères** : Nom, spécialité, localisation (ville/code postal)
3. **Carte interactive** : Google Maps avec pins praticiens proximité
4. **Géolocalisation** : Détecter position infirmière → praticiens proximité (rayon 5-10-20 km)
5. **Contact rapide** : Bouton "Appeler" (téléphone natif mobile)
6. **Import données** : CSV/JSON fourni par pôle santé (base praticiens)

### Contraintes Techniques
- **Platform** : PWA mobile-first (iPhone/Android excellent)
- **Offline-first** : App fonctionne sans réseau (cache praticiens locaux)
- **Performance** : Carte charge <2s, recherche <500ms
- **Hébergement** : Supabase EU (PostgreSQL + Auth + Storage)
- **Auth** : Email/password simple (infirmières uniquement)

### Contraintes Non-Fonctionnelles
- **Users** : 50-200 infirmières département (démarrage)
- **Praticiens** : 500-2000 praticiens base données
- **Trafic** : Low (consultations ponctuelles, pas temps réel)
- **Budget** : €20-50/mois hébergement MVP

## 🏗️ QUESTIONS CHATGPT (Architecture & Stack)

### Question 1 : Stack Frontend (PWA Mobile-First)

**Contexte :** App mobile-first, offline-first, carte Google Maps, géolocalisation

**Questions :**
1. **Framework recommandé** :
   - Next.js 15 App Router + PWA (service worker) ?
   - React Native Web (si évolution app native future) ?
   - OU autre (Remix, SvelteKit) ?

2. **UI Components** :
   - Tailwind + shadcn/ui (desktop OK, mobile ?) ?
   - OU Tailwind + Radix UI + mobile-first custom ?
   - OU framework mobile natif (Ionic, Capacitor) ?

3. **Carte & Géolocalisation** :
   - Google Maps JavaScript API (€200 gratuits/mois) ?
   - OU Mapbox (plus cher mais meilleur offline) ?
   - Librairie React : react-google-maps OU @vis.gl/react-google-maps ?

4. **Offline-First (Service Worker)** :
   - next-pwa (simple) OU Workbox (contrôle++) ?
   - Stratégie cache : Cache-First (praticiens) + Network-First (auth) ?
   - IndexedDB pour stocker base praticiens locale ?

5. **Performance Mobile** :
   - Liste virtualisée (react-window) si >500 praticiens ?
   - Lazy load carte (charger seulement si onglet carte actif) ?
   - Image optimization (next/image) pour photos praticiens (v2.0) ?

### Question 2 : Stack Backend (Supabase + API)

**Contexte :** Supabase EU (PostgreSQL + Auth + Storage), import CSV praticiens, recherche géolocalisée

**Questions :**
1. **Architecture Backend** :
   - Supabase direct (Frontend → Supabase client) SANS API custom ?
   - OU Backend API custom (NestJS/Express) + Supabase DB ?
   - Avantages/inconvénients chaque approche MVP rapide ?

2. **Base de Données (PostgreSQL + PostGIS)** :
   - Schema praticiens :
     ```sql
     CREATE TABLE practitioners (
       id UUID PRIMARY KEY,
       name TEXT NOT NULL,
       specialty TEXT NOT NULL,
       phone TEXT NOT NULL,
       address TEXT,
       city TEXT,
       postal_code TEXT,
       location GEOGRAPHY(POINT, 4326), -- PostGIS pour géoloc
       created_at TIMESTAMP DEFAULT NOW()
     );
     ```
   - Index optimaux pour recherche rapide (name, specialty, location) ?
   - PostGIS nécessaire OU calcul distance client-side suffit MVP ?

3. **Import Données CSV** :
   - Script Node.js (Prisma/Supabase SDK) OU Supabase UI import ?
   - Validation données (téléphone format, coordonnées GPS) ?
   - Géocodage adresses → coordonnées GPS (Google Geocoding API) ?

4. **Recherche Géolocalisée** :
   - Supabase RPC function PostGIS (ST_DWithin) ?
   - OU calcul distance Haversine client-side (si base petite <2000 praticiens) ?
   - Exemple query :
     ```sql
     SELECT * FROM practitioners
     WHERE ST_DWithin(
       location,
       ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography,
       5000 -- 5 km radius
     )
     ORDER BY location <-> ST_SetSRID(ST_MakePoint(lon, lat), 4326)::geography;
     ```

### Question 3 : Auth & Sécurité (MVP Simplifié)

**Contexte :** Infirmières auth email/password, pas PSC pour MVP, Supabase Auth

**Questions :**
1. **Supabase Auth Setup** :
   - Email/password + email verification suffisant MVP ?
   - Magic link (passwordless) alternative meilleure UX mobile ?
   - Row Level Security (RLS) Supabase : limiter accès infirmières validées ?

2. **Sécurité API** :
   - Supabase RLS policies :
     ```sql
     -- Infirmières authentifiées peuvent lire praticiens
     CREATE POLICY "Nurses read practitioners"
     ON practitioners FOR SELECT
     TO authenticated
     USING (true);
     ```
   - Rate limiting (Supabase built-in OU custom Cloudflare) ?

3. **Validation Infirmières** :
   - Onboarding : admin pôle santé valide email infirmières ?
   - OU auto-signup libre (risque accès non-autorisés) ?

### Question 4 : Déploiement & Monitoring (MVP)

**Contexte :** PWA déployée, 50-200 infirmières users, budget €20-50/mois

**Questions :**
1. **Hosting Frontend** :
   - Vercel (gratuit hobby, France/EU Edge) ?
   - OU Cloudflare Pages (gratuit, meilleur cache) ?
   - OU Netlify ?

2. **Supabase Config** :
   - Plan Free (50k users, 500 MB DB, 1 GB storage) suffisant MVP ?
   - OU Plan Pro €25/mois (meilleur perf + support) ?

3. **Monitoring MVP** :
   - Vercel Analytics (gratuit) ?
   - OU Sentry (erreurs front) + Supabase logs (back) ?
   - Metrics core : temps chargement carte, erreurs recherche, taux offline success

4. **CI/CD** :
   - GitHub Actions (Vercel auto-deploy) ?
   - Tests E2E Playwright (recherche + carte + appel téléphone) ?

### Question 5 : Roadmap v2.0 (Features Futures)

**Contexte :** MVP → v2.0 ajout chat texte, appel vocal, matching temps réel, migration HDS

**Questions :**
1. **Chat Texte (v2.0)** :
   - Supabase Realtime (WebSocket built-in) ?
   - OU Socket.IO custom backend ?
   - Store messages : Supabase table + encryption ?

2. **Appel Vocal (v2.0)** :
   - WebRTC (peer-to-peer infirmière ↔ praticien) ?
   - OU Twilio Voice API (simple mais coût €0.01-0.05/min) ?
   - Librairie React : simple-peer OU daily.co embed ?

3. **Matching Temps Réel (v2.0)** :
   - Praticiens ont statut disponibilité (AVAILABLE/BUSY/OFFLINE) ?
   - Notifications push praticiens : OneSignal OU Firebase Cloud Messaging ?
   - Algo matching : géoloc + spécialité + dispo (Supabase function OU backend custom) ?

4. **Migration HDS (v2.0)** :
   - Scalingo (PaaS HDS certifié, €200-500/mois) compatible stack actuelle ?
   - Migration Supabase → PostgreSQL HDS : complexité ?
   - Alternatives : OVHcloud Healthcare, OutScale ?

## 📊 Livrable Attendu ChatGPT

**Format réponse :**
1. ✅ Stack recommandée (Frontend + Backend + Hosting) avec justification
2. ✅ Schema DB PostgreSQL complet (avec indexes optimaux)
3. ✅ Exemple code clé (recherche géolocalisée, service worker PWA)
4. ✅ Architecture diagram (Frontend ↔ Supabase ↔ Google Maps API)
5. ✅ Checklist technique MVP (tasks dev estimées)
6. ✅ Roadmap v2.0 (ajout features temps réel + migration HDS)

**Ton :** Pragmatique, code-first. Focus "What works" pour MVP rapide (4-5h dev) puis évolution v2.0 structurée.

---

**Date :** 2025-10-12
**Version :** 1.0
**Statut :** Brief prêt pour itération ChatGPT
