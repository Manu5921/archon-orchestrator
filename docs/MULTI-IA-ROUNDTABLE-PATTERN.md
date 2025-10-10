# 🎭 Multi-IA Roundtable Pattern - Documentation Complète

**Version:** 1.0
**Date:** 2025-10-12
**Statut:** Concept validé, test en cours (Annuaire Santé MVP)

---

## 🎯 Vision & Principe

### Concept Core

**Intelligence collective multi-modèle** pour décisions architecture complexes :
- **3 IA spécialisées** participent à une "réunion virtuelle"
- **Chaque IA a un rôle distinct** (pas redondance)
- **Claude orchestrateur** arbitre et tranche les décisions finales
- **Output : `constitution.md`** enrichi pour Spec-Kit

### Pourquoi Multi-IA ?

**Problème :** 1 seule IA (même Sonnet 4.5) peut :
- ❌ Avoir des biais (over-engineering OU trop simple)
- ❌ Manquer alternatives (stuck in local optimum)
- ❌ Halluciner sans fact-checking externe

**Solution :** Intelligence collective (3 IA → convergence meilleure décision)

---

## 🤖 Rôles des IA (Non-Figés)

### 🎩 Claude Sonnet 4.5 (Orchestrateur & Arbitre)

**Rôle principal :**
- ✅ **Contexte Archon Orchestrator** (connaît workflow V4, Spec-Kit, standards E1-E16)
- ✅ **Arbitrage final** (tranche entre propositions Gemini vs ChatGPT)
- ✅ **Rédaction `constitution.md`** (synthèse enrichie, pas copie brute)
- ✅ **Quality gates** (vérifie conformité RGPD/HDS, détecte hallucinations)

**Capacités uniques :**
- Context 200K tokens (peut lire TOUT l'historique Archon)
- Connaissance Spec-Kit (structure `.specify/`, workflow /constitution → /specify → /plan)
- Standards E1-E16 (architecture-first, types anti-hallucination, zero trust)

**Pourquoi Claude arbitre ?**
→ Seul IA avec **contexte complet projet** (Gemini + ChatGPT = zero-shot sur brief)

---

### 🌐 Gemini 2.0 Flash (Analyste Créatif)

**Rôle principal :**
- ✅ **Analyse réglementaire** (RGPD, HDS, RGAA, lois santé françaises)
- ✅ **Propositions alternatives** (challenge conventions, think outside box)
- ✅ **Vision marché/business** (différenciation, pricing, GTM)

**Capacités uniques :**
- Connaissances réglementaires à jour (RGPD, HDS, Code Santé Publique)
- Créativité (température 0.8, propose alternatives non-évidentes)
- Analyse risque juridique (clauses RGPD, conformité)

**Pourquoi Gemini créatif ?**
→ Éviter tunnel vision (Claude peut être trop pragmatique/conservateur)

---

### ⚙️ ChatGPT o1 / GPT-4 (Développeur Pragmatique)

**Rôle principal :**
- ✅ **Architecture technique** (stack, DB schema, API design)
- ✅ **MVP focus** (pas over-engineering, ROI évident)
- ✅ **Code examples** (schemas Prisma, queries SQL, config)

**Capacités uniques :**
- Expérience massive projets réels (training data varié)
- Pragmatisme (température 0.5, focus "what works")
- Code generation (schemas DB, config files, exemples API)

**Pourquoi ChatGPT pragmatique ?**
→ Équilibrer créativité Gemini (éviter propositions trop théoriques)

---

## 🔄 Workflow Multi-IA (3 Étapes)

### **Étape 1 : Préparation Briefs (Claude)**

**Input user :** Vision projet, contraintes, questions
**Claude génère :**
- `BRIEF-GEMINI-[projet].md` (focus RGPD/conformité/business)
- `BRIEF-CHATGPT-[projet].md` (focus architecture/stack/MVP)

**Durée :** 5-10 min (automatisé par Claude)

---

### **Étape 2 : Itérations Parallèles (User ↔ Gemini + ChatGPT)**

**User copie briefs dans :**
1. **Gemini 2.0 Flash** (Google AI Studio OU CLI)
2. **ChatGPT o1** (OpenAI web OU API)

**Output attendu :**
- **Gemini :** Checklist conformité RGPD/HDS + roadmap migration + risques juridiques
- **ChatGPT :** Stack recommandée + schema DB + architecture diagram + code examples

**Durée :** 10-20 min (user itère avec chaque IA)

**Format retour :**
```markdown
## Output Gemini
[Copier-coller réponse complète Gemini]

## Output ChatGPT
[Copier-coller réponse complète ChatGPT]
```

---

### **Étape 3 : Arbitrage & Constitution (Claude)**

**Claude reçoit :**
- Output Gemini (conformité/juridique)
- Output ChatGPT (architecture/stack)
- Contexte complet Archon Orchestrator (workflow V4, standards E1-E16)

**Claude arbitre :**
1. **Analyse contradictions** (ex: Gemini dit "HDS obligatoire" vs ChatGPT "Supabase MVP")
2. **Tranche décisions** (ex: "MVP Supabase EU → Migration HDS v2.0 si données patient ajoutées")
3. **Détecte hallucinations** (fact-check avec sources, CLAUDE.md, workflow V4)
4. **Applique standards Archon** (E1 architecture-first, E2 types anti-hallucination, etc.)

**Claude rédige :**
- `.specify/memory/constitution.md` (synthèse enrichie, pas copie brute)
- Structure Spec-Kit valide (sections obligatoires : Vision, Personas, Core Features, Tech Stack, Quality Gates)

**Durée :** 5-10 min (Claude synthétise et rédige)

---

## 📋 Structure Constitution.md (Output Final)

### Template Enrichi Multi-IA

```markdown
# 🏥 [Nom Projet] - Constitution

**Date:** [Date]
**Validé par:** Multi-IA Roundtable (Claude orchestrateur + Gemini analyste + ChatGPT pragmatique)

---

## 🎯 Vision & Objectifs

[Synthèse user + insights Gemini (marché) + focus MVP ChatGPT]

**Problème résolu:**
[Description claire du pain point]

**Solution proposée:**
[MVP simplifié, roadmap évolution]

---

## 👥 Personas

### Utilisateurs Primaires
[Infirmières, praticiens, etc. - détails comportementaux]

### Utilisateurs Secondaires
[Admin pôle santé, support, etc.]

---

## ⚡ Core Features (MVP v1.0)

### Must-Have (P0)
1. [Feature 1] - [Justification business + technique]
2. [Feature 2]
3. ...

### Should-Have (P1 - v2.0)
1. [Feature future] - [Trigger migration (ex: HDS si données patient)]
2. ...

### Nice-to-Have (P2 - v3.0+)
[Features optionnelles long-terme]

---

## 🏗️ Architecture Technique

### Stack Recommandée (ChatGPT + arbitrage Claude)

**Frontend:**
- Framework: [Next.js 15 PWA]
- UI: [Tailwind + shadcn/ui mobile]
- Carte: [Google Maps API]
- Offline: [Service Worker + IndexedDB]

**Backend:**
- Database: [Supabase EU (PostgreSQL + PostGIS)]
- Auth: [Supabase Auth email/password]
- API: [Supabase client direct OU NestJS custom]

**Hébergement:**
- Frontend: [Vercel]
- Backend: [Supabase EU]
- Roadmap v2.0: [Migration Scalingo HDS si données patient]

**Décisions Arbitrées (Claude):**
```
Gemini proposait: "HDS obligatoire dès MVP (données praticiens = santé)"
ChatGPT proposait: "Supabase MVP rapide, migration HDS v2.0"

Décision Claude:
✅ MVP Supabase EU (données praticiens publiques ≠ données patient)
✅ Migration HDS v2.0 SI ajout données patient (contexte consultation)
✅ Base légale RGPD: Intérêt légitime (annuaire professionnel)
```

---

## 🔒 Conformité & Sécurité (Gemini + validation Claude)

### RGPD MVP v1.0
- ✅ **Article 6 (base légale):** Intérêt légitime (annuaire praticiens publics RPPS)
- ✅ **Article 9 (données sensibles):** Non concerné (pas données patient MVP)
- ✅ **Minimisation:** Nom, spécialité, téléphone, adresse cabinet (strictement nécessaire)
- ✅ **Audit trail:** Logs recherches infirmières (qui, quand, quel praticien contacté)

### HDS Roadmap v2.0
**Triggers migration HDS:**
- Ajout chat texte infirmière ↔ praticien (données consultation)
- Partage contexte patient anonymisé (âge, symptômes)
- Stockage données santé (même anonymisées)

**Hébergeurs HDS recommandés:**
1. Scalingo (€200-500/mois, PaaS simple)
2. OVHcloud Healthcare (€300-800/mois, IaaS contrôle++)
3. OutScale (€500-1500/mois, cloud souverain)

### RGAA 4 (Accessibilité)
- ✅ **Obligation:** Oui (service public santé)
- ✅ **Niveau:** AA (WCAG 2.2)
- ✅ **MVP:** Progressive (focus mobile UX, tests Lighthouse)
- ✅ **v2.0:** Audit RGAA complet + certification

---

## 📊 Database Schema (ChatGPT + validation Claude)

### Table `practitioners` (MVP)

```sql
CREATE TABLE practitioners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identité
  name TEXT NOT NULL,
  rpps_id TEXT UNIQUE, -- Répertoire Partagé Professions Santé (optionnel MVP)
  specialty TEXT NOT NULL, -- "Médecin généraliste", "Cardiologue", etc.

  -- Contact
  phone TEXT NOT NULL,
  email TEXT,

  -- Localisation
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326), -- PostGIS pour recherche géolocalisée

  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Index
  CONSTRAINT valid_phone CHECK (phone ~ '^\+?[0-9]{10,15}$')
);

-- Index recherche rapide
CREATE INDEX idx_practitioners_specialty ON practitioners(specialty);
CREATE INDEX idx_practitioners_city ON practitioners(city);
CREATE INDEX idx_practitioners_location ON practitioners USING GIST(location);

-- Index full-text search nom
CREATE INDEX idx_practitioners_name_fts ON practitioners USING GIN(to_tsvector('french', name));
```

### Table `nurses` (Auth infirmières)

```sql
CREATE TABLE nurses (
  id UUID PRIMARY KEY REFERENCES auth.users(id),

  -- Identité
  full_name TEXT NOT NULL,
  rpps_id TEXT UNIQUE, -- Validation par pôle santé

  -- Affectation
  health_center TEXT, -- Centre santé rattachement
  department TEXT, -- Département

  -- Status
  validated BOOLEAN DEFAULT FALSE, -- Admin pôle santé valide
  validated_at TIMESTAMPTZ,
  validated_by UUID REFERENCES auth.users(id),

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

```sql
-- Infirmières validées peuvent lire praticiens
CREATE POLICY "Nurses read practitioners"
ON practitioners FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM nurses
    WHERE nurses.id = auth.uid()
    AND nurses.validated = TRUE
  )
);

-- Infirmières peuvent lire leur propre profil
CREATE POLICY "Nurses read own profile"
ON nurses FOR SELECT
TO authenticated
USING (auth.uid() = id);
```

**Décision Arbitrée (Claude):**
```
ChatGPT proposait: "Auth simple email/password, validation manuelle admin"
Gemini proposait: "PSC (Pro Santé Connect) obligatoire dès MVP"

Décision Claude:
✅ MVP: Auth Supabase email/password + validation admin pôle santé
✅ v2.0: Migration PSC si obligation réglementaire (actuellement pas obligatoire pour app interne)
✅ Justification: PSC setup lourd (2-3 jours), MVP urgent (4h30), pôle santé = client unique (pas public)
```

---

## 🚀 Roadmap & Évolution

### MVP v1.0 (4-5h dev)
- ✅ Annuaire praticiens searchable
- ✅ Carte Google Maps géolocalisée
- ✅ Contact téléphone (bouton appel natif)
- ✅ PWA offline-first
- ✅ Auth infirmières email/password
- ✅ Import CSV base praticiens

**Livrable:** PWA mobile-first, Supabase EU, conformité RGPD simplifiée

### v2.0 (Post-MVP - 10-15h dev)
- ✅ Chat texte infirmière ↔ praticien (Supabase Realtime)
- ✅ Appel vocal intégré (WebRTC OU Twilio)
- ✅ Statut disponibilité praticiens (AVAILABLE/BUSY/OFFLINE)
- ✅ Notifications push praticiens (OneSignal)
- ✅ Migration hébergement HDS (Scalingo)
- ✅ Auth PSC (si requis réglementaire)

**Trigger migration:** Ajout données patient (contexte consultation)

### v3.0 (Long-terme - 20-30h dev)
- ✅ Matching intelligent (ML praticien optimal selon historique)
- ✅ Téléconsultation vidéo (daily.co embed)
- ✅ Intégration DMP (Dossier Médical Partagé)
- ✅ API externe (intégration logiciels cabinet)

---

## 📏 Quality Gates (Standards Archon E1-E16)

### P0 : Build (OBLIGATOIRE)
- ✅ TypeScript strict mode (0 erreurs compilation)
- ✅ ESLint passing (healthcare security rules)
- ✅ Tests unitaires core features (>80% coverage)

### P1 : Lint & Types
- ✅ Prisma schema validé (migrations sans erreur)
- ✅ Zod validation inputs (protection injection SQL)
- ✅ API types générés (OpenAPI spec)

### P2 : Tests
- ✅ Tests E2E Playwright (recherche + carte + appel)
- ✅ Tests accessibilité (Lighthouse score >90)
- ✅ Tests sécurité (OWASP Top 10 scan)

### P3 : Docs
- ✅ README.md complet (setup, run, deploy)
- ✅ API documentation (Swagger/OpenAPI)
- ✅ Audit trail RGPD (logs traçables)

### P4 : Performance (Optionnel MVP)
- ⚠️ Lighthouse Performance >90 (mobile)
- ⚠️ Carte charge <2s (500-2000 praticiens)
- ⚠️ Recherche <500ms (avec PostGIS index)

**Minimum acceptable MVP:** P0 + P1 ✅ PASSED

---

## 💰 Budget & ROI

### Coûts Infrastructure MVP

| Service | Plan | Coût/Mois |
|---------|------|-----------|
| Supabase | Free (500 MB DB, 1 GB storage) | €0 |
| Vercel | Hobby (100 GB bandwidth) | €0 |
| Google Maps API | €200 crédits gratuits/mois | €0 (si <28k requêtes) |
| **Total MVP** | | **€0-20/mois** |

### Coûts Infrastructure v2.0 (HDS)

| Service | Plan | Coût/Mois |
|---------|------|-----------|
| Scalingo (HDS) | Professional | €200-500 |
| Supabase Pro | Production | €25 |
| Google Maps API | Usage | €20-50 |
| OneSignal | Growth (notifs push) | €0-50 |
| **Total v2.0** | | **€245-625/mois** |

### Business Model

**Client unique:** Pôle Santé Département (licence one-time)
**Prix estimé:** €5,000-10,000 (MVP) + €2,000-5,000/an (maintenance v2.0+)
**Users:** 50-200 infirmières (démarrage)
**ROI client:** Gain temps consultations (-30% temps recherche praticien = €10k-20k économies annuelles)

---

## ✅ Décisions Finales Multi-IA (Synthèse)

### Arbitrages Clés (Claude)

**1. Hébergement MVP**
```
Gemini: "HDS obligatoire (données santé praticiens)"
ChatGPT: "Supabase MVP, migration HDS v2.0"
→ Décision Claude: Supabase MVP (données praticiens publiques ≠ patient)
```

**2. Auth Infirmières**
```
Gemini: "PSC obligatoire dès MVP (conformité)"
ChatGPT: "Email/password simple MVP, PSC v2.0"
→ Décision Claude: Email/password MVP (PSC si requis v2.0, pas obligatoire app interne)
```

**3. Stack Frontend**
```
Gemini: "React Native (app native future-proof)"
ChatGPT: "Next.js 15 PWA (rapide, offline, SEO)"
→ Décision Claude: Next.js 15 PWA (MVP 4h vs React Native 20h setup)
```

**4. Carte & Géolocalisation**
```
Gemini: "Mapbox (meilleur offline, souveraineté)"
ChatGPT: "Google Maps (€200 gratuits, stable)"
→ Décision Claude: Google Maps MVP (coût €0, migration Mapbox v2.0 si besoin)
```

---

## 🎯 Next Steps (Workflow Spec-Kit)

**Constitution validée → Lancement Spec-Kit:**

```bash
# 1. Constitution déjà rédigée (ce fichier)
# ✅ .specify/memory/constitution.md

# 2. Specify (5 min)
/speckit.specify
# → Génère specs/001-mvp/spec.md (détails techniques)

# 3. Plan (10 min)
/speckit.plan
# → Génère specs/001-mvp/plan.md (phases implémentation)

# 4. Tasks (10 min)
/speckit.tasks
# → Génère specs/001-mvp/tasks.md (50-100 tasks granulaires)

# 5. Implementation (3-4h)
/implement
# → Sub-agents backend/frontend/testing (commits réguliers)

# 6. PR + Review (15 min)
gh pr view 1
gh pr review 1 --approve
gh pr merge 1 --squash
```

**Total timeline:** 4h30 (30 min planning + 3-4h implementation + 15 min review)

---

**Version:** 1.0
**Date:** 2025-10-12
**Validé par:** Claude Sonnet 4.5 (orchestrateur) + Gemini 2.0 Flash (analyste) + ChatGPT o1 (pragmatique)
**Projet:** Annuaire Santé Pro (infirmières → praticiens)
**Status:** Constitution prête pour `/speckit.specify`

*Intelligence collective multi-modèle pour décisions architecture complexes* 🎭🤖
