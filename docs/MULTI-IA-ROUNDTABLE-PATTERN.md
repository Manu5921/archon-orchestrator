# 🎭 Multi-IA Roundtable Pattern - Documentation Complète

**Version:** 1.1
**Date:** 2025-10-11
**Statut:** Concept validé, refactoré (constitution allégée vs spec détaillée)
**Changelog v1.1:** Clarification séparation concerns constitution.md (gouvernance) vs spec.md (technique)

---

## 🎯 Vision & Principe

### Concept Core

**Intelligence collective multi-modèle** pour décisions architecture complexes :
- **3 IA spécialisées** participent à une "réunion virtuelle"
- **Chaque IA a un rôle distinct** (pas redondance)
- **Claude orchestrateur** arbitre et tranche les décisions finales
- **Output : `constitution.md` ALLÉGÉE** (gouvernance) + `spec.md` (détails techniques via `/speckit.specify`)

### Pourquoi Multi-IA ?

**Problème :** 1 seule IA (même Sonnet 4.5) peut :
- ❌ Avoir des biais (over-engineering OU trop simple)
- ❌ Manquer alternatives (stuck in local optimum)
- ❌ Halluciner sans fact-checking externe

**Solution :** Intelligence collective (3 IA → convergence meilleure décision)

---

## ⚡ TL;DR (Quick Summary)

### 🎯 Outputs Pattern Multi-IA

**Constitution.md** (15-25 pages) - **ALLÉGÉE** :
- Vision business, Personas, Core Features (justifications business)
- Stack HIGH-LEVEL (Next.js + Supabase, pas SQL détaillé)
- Décisions arbitrées (Gemini vs ChatGPT avec justifications)
- Roadmap (MVP → v2.0 → v3.0 avec triggers clairs)
- Budget & ROI

**Spec.md** (30-50 pages) - Généré par `/speckit.specify` :
- Database schema SQL COMPLET (CREATE TABLE, indexes, RLS)
- API endpoints détaillés (params, responses, validations)
- Standards techniques (pnpm, TypeScript strict, Zod)
- Sub-agents architecture (healthcare-expert, security-architect...)

### 📐 Règle Séparation

**Si client non-technique peut comprendre → Constitution**
**Si code SQL/TypeScript/technique → Spec**

**Exemple :**
- ✅ Constitution : "Stack Next.js + Supabase (décision : MVP rapide)"
- ❌ Constitution : `CREATE TABLE practitioners (id UUID...);` → Spec.md

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
- `.specify/memory/constitution.md` **ALLÉGÉE** (gouvernance, décisions stratégiques)
- Structure Spec-Kit valide (Vision, Personas, Core Features, Stack HIGH-LEVEL, Roadmap, Budget)
- **Détails techniques délégués à `/speckit.specify`** (database schema, API endpoints, sub-agents)

**Durée :** 5-10 min (Claude synthétise et rédige)

---

## 📐 Constitution vs Spec - Séparation Concerns

### ⚠️ Problème : Constitution Surdimensionnée

**Symptôme :** Constitution.md contient database schema SQL complet, API endpoints, RLS policies
**Conséquence :** Doublon avec `spec.md` (généré par `/speckit.specify`)

### ✅ Solution : Séparation Claire

| Aspect | Constitution.md | Spec.md |
|--------|-----------------|---------|
| **Rôle** | Gouvernance & Vision | Implémentation Technique |
| **Audience** | Product Owner, Client, Stakeholders | Développeurs, Sub-agents |
| **Ton** | Stratégique, business-oriented | Technique, précis |
| **Contenu** | Vision, Personas, Features (JUSTIF BUSINESS), Stack HIGH-LEVEL, Roadmap, Budget, Décisions arbitrées | Standards techniques, Database schema SQL, API endpoints, Sub-agents architecture, Tests stratégie |
| **Taille** | 15-25 pages | 30-50 pages |
| **Durée vie** | Stable (change peu) | Évolutif (s'enrichit pendant implémentation) |

### 🎯 Règle Simple

**Test rapide :** Si tu peux expliquer à un client non-technique → Constitution. Sinon → Spec.

**Exemples :**
- ✅ Constitution : "Stack Next.js + Supabase (décision : MVP rapide, migration HDS v2.0 si données patient)"
- ❌ Constitution : `CREATE TABLE practitioners (id UUID, rpps TEXT, ...);` → Spec.md
- ✅ Constitution : "Database PostGIS pour géolocalisation (<500ms query sur 10K praticiens)"
- ❌ Constitution : `CREATE INDEX idx_location ON practitioners USING GIST(location);` → Spec.md

---

## 📋 Structure Constitution.md (Output Final - ALLÉGÉE)

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

## 🏗️ Architecture Technique (HIGH-LEVEL)

### Stack Recommandée (ChatGPT + arbitrage Claude)

**Frontend:** Next.js 15 PWA + Tailwind + shadcn/ui + Google Maps API
**Backend:** Supabase EU (PostgreSQL + PostGIS + Auth + RLS)
**Hébergement:** Vercel + Supabase EU
**Roadmap v2.0:** Migration Scalingo HDS (SI ajout données patient)

**Décisions Arbitrées (Claude):**
```
Gemini proposait: "HDS obligatoire dès MVP (données praticiens = santé)"
ChatGPT proposait: "Supabase MVP rapide, migration HDS v2.0"

Décision Claude:
✅ MVP Supabase EU (données praticiens publiques ≠ données patient)
✅ Migration HDS v2.0 SI ajout données patient (contexte consultation)
✅ Base légale RGPD: Intérêt légitime (annuaire professionnel)
```

### Database (HIGH-LEVEL)

**Tables principales :**
- `practitioners` (praticiens + spécialités + localisation PostGIS)
- `nurses` (auth infirmières + validation admin)
- `audit_logs` (traçabilité RGPD)

**Contraintes critiques :**
- PostGIS index géolocalisation (query <500ms sur 10K praticiens)
- RLS policies Supabase (infirmières validées UNIQUEMENT)
- Audit trail immuable (conformité RGPD Article 30)

→ **Détails techniques SQL : voir `/speckit.specify` → `specs/001-mvp/spec.md`**

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

**→ Database Schema SQL complet : voir `/speckit.specify` → `specs/001-mvp/spec.md`**

**Décisions Arbitrées Auth (Claude):**
```
ChatGPT proposait: "Auth simple email/password, validation manuelle admin"
Gemini proposait: "PSC (Pro Santé Connect) obligatoire dès MVP"

Décision Claude:
✅ MVP: Auth Supabase email/password + validation admin pôle santé
✅ v2.0: Migration PSC si obligation réglementaire (pas obligatoire app interne actuellement)
✅ Justification: PSC setup lourd (2-3 jours), MVP urgent (4h30), client unique (pas public)
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

## 🎯 Next Steps (Workflow Spec-Kit Complet)

**Constitution validée → Lancement Spec-Kit:**

```bash
# 1. Constitution ALLÉGÉE déjà rédigée
# ✅ .specify/memory/constitution.md (gouvernance, décisions stratégiques)

# 2. Specify (5-10 min) - GÉNÈRE DÉTAILS TECHNIQUES
/speckit.specify
# → specs/001-mvp/spec.md (database schema SQL, API endpoints, sub-agents)
# ⚠️ C'est ICI que ChatGPT outputs techniques sont détaillés

# 3. Plan (10 min)
/speckit.plan
# → specs/001-mvp/plan.md (phases implémentation)

# 4. Tasks (10 min)
/speckit.tasks
# → specs/001-mvp/tasks.md (50-100 tasks granulaires)

# 5. Implementation (3-4h)
/implement
# → Sub-agents backend/frontend/testing (commits réguliers)

# 6. PR + Review (15 min)
gh pr view 1
gh pr review 1 --approve
gh pr merge 1 --squash
```

**Total timeline:** 4h30 (30 min planning + 3-4h implementation + 15 min review)

### 📐 Séparation Constitution → Spec

**Constitution.md (15-25 pages)** :
- ✅ Vision, Personas, Core Features (justifications business)
- ✅ Stack HIGH-LEVEL (Next.js + Supabase + Google Maps)
- ✅ Décisions arbitrées (Gemini vs ChatGPT)
- ✅ Roadmap (MVP → v2.0 → v3.0 avec triggers)
- ✅ Conformité HIGH-LEVEL (RGPD Article 6, HDS triggers)
- ✅ Budget & ROI

**Spec.md (30-50 pages)** - Généré par `/speckit.specify` :
- ✅ Database schema SQL COMPLET (CREATE TABLE, indexes, RLS policies)
- ✅ API endpoints détaillés (REST params, responses, validations)
- ✅ Standards techniques (pnpm, TypeScript strict, Zod)
- ✅ Sub-agents architecture (healthcare-expert, security-architect, etc.)
- ✅ Tests stratégie (E2E Playwright, unit Vitest, frameworks)

---

**Version:** 1.1
**Date:** 2025-10-11
**Validé par:** Claude Sonnet 4.5 (orchestrateur) + Gemini 2.0 Flash (analyste) + ChatGPT o1 (pragmatique)
**Changelog v1.1:** Constitution allégée (15-25 pages), détails techniques délégués à `/speckit.specify` (spec.md 30-50 pages)
**Status:** Pattern validé, séparation concerns constitution (gouvernance) vs spec (technique) clarifiée

*Intelligence collective multi-modèle pour décisions architecture complexes* 🎭🤖

---

## 📝 Migration Constitution Existante → Allégée

### Si Constitution.md Actuelle Contient SQL/Code

**Symptômes :**
- Constitution.md > 30 pages
- Contient `CREATE TABLE`, `CREATE INDEX`, `CREATE POLICY`
- Contient détails API endpoints (params TypeScript, responses)
- Contient RLS policies Supabase détaillées

**Action :**

```bash
# 1. Extraire détails techniques vers spec.md
cd projet
/speckit.specify

# Claude va générer specs/001-mvp/spec.md avec TOUS les détails techniques

# 2. Alléger constitution.md
# Supprimer sections :
# - Database Schema SQL complet → Remplacer par "Tables : practitioners, nurses, audit_logs"
# - API Endpoints détaillés → Remplacer par "REST API search/practitioners (voir spec.md)"
# - RLS Policies SQL → Remplacer par "RLS Supabase (infirmières validées uniquement)"

# 3. Garder dans constitution.md :
# - Vision, Personas, Core Features
# - Stack HIGH-LEVEL (Next.js + Supabase, 1 ligne)
# - Décisions arbitrées (Gemini vs ChatGPT)
# - Roadmap (MVP → v2.0 triggers)
# - Budget & ROI
```

**Résultat :**
- Constitution.md : 30+ pages → 15-25 pages (gouvernance claire)
- Spec.md : 0 pages → 30-50 pages (détails techniques)
- Pas de doublon

---

## 🎯 Checklist Validation Constitution Allégée

### ✅ Constitution.md CORRECT (15-25 pages)

- [ ] Vision business (problème résolu, solution, ROI)
- [ ] Personas détaillés (comportements, pain points)
- [ ] Core Features MVP (P0/P1/P2 avec justifications BUSINESS)
- [ ] Stack HIGH-LEVEL (1-2 lignes par composant : "Next.js PWA + Supabase EU")
- [ ] Décisions arbitrées (Gemini vs ChatGPT avec justifications explicites)
- [ ] Roadmap évolution (MVP → v2.0 → v3.0 avec triggers clairs)
- [ ] Conformité HIGH-LEVEL (RGPD Article 6, HDS triggers, pas RLS SQL)
- [ ] Budget & ROI (coûts infrastructure, business model)
- [ ] **AUCUN code SQL/TypeScript** (délégué à spec.md)

### ❌ Constitution.md INCORRECT (Doublon avec Spec)

- [ ] Contient `CREATE TABLE` OU `CREATE INDEX` → Spec.md
- [ ] Contient RLS policies SQL → Spec.md
- [ ] Contient API endpoints TypeScript détaillés → Spec.md
- [ ] Contient standards techniques (pnpm, Node 20) → Spec.md
- [ ] Contient sub-agents architecture détaillée → Spec.md
- [ ] > 30 pages → Probablement trop technique

### ✅ Spec.md CORRECT (30-50 pages) - Généré par `/speckit.specify`

- [ ] Database schema SQL COMPLET (CREATE TABLE, indexes, constraints)
- [ ] RLS policies Supabase détaillées (SQL complet)
- [ ] API endpoints détaillés (REST/GraphQL params, responses, validations)
- [ ] Standards techniques (pnpm EXCLUSIVEMENT, Node 20, TypeScript strict)
- [ ] Sub-agents architecture (healthcare-expert, security-architect, database-expert...)
- [ ] Tests stratégie (E2E Playwright, unit Vitest, frameworks, coverage)

---
