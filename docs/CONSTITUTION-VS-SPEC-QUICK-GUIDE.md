# 📐 Constitution vs Spec - Guide Rapide

**Version:** 1.0
**Date:** 2025-10-11
**Audience:** Développeurs utilisant Multi-IA Roundtable Pattern

---

## 🎯 Règle Simple (30 secondes)

**Constitution.md** = Document que tu peux montrer à un **client non-technique**
**Spec.md** = Document pour **développeurs/sub-agents**

**Test rapide :**
- Phrase compréhensible par client → Constitution
- Code SQL/TypeScript → Spec

---

## 📊 Comparaison Rapide

| Critère | Constitution.md | Spec.md |
|---------|-----------------|---------|
| **Rôle** | Gouvernance & Vision | Implémentation Technique |
| **Audience** | Product Owner, Client, Stakeholders | Développeurs, Sub-agents Claude |
| **Ton** | Stratégique, business | Technique, précis |
| **Taille** | 15-25 pages | 30-50 pages |
| **Génération** | Multi-IA Roundtable (Gemini + ChatGPT + Claude arbitrage) | `/speckit.specify` (Claude avec contexte constitution) |
| **Durée vie** | Stable (change peu après validation) | Évolutif (s'enrichit pendant implémentation) |

---

## ✅ Constitution.md DOIT Contenir

### Vision & Business (TOUJOURS)
- ✅ Problème résolu (pain point client)
- ✅ Solution proposée (MVP simplifié)
- ✅ ROI mesurable (économies, gains temps)

### Personas (TOUJOURS)
- ✅ Utilisateurs primaires (comportements détaillés)
- ✅ Pain points actuels
- ✅ Besoins spécifiques

### Core Features (TOUJOURS)
- ✅ Must-Have (P0) avec **justifications BUSINESS**
- ✅ Should-Have (P1) avec roadmap
- ✅ Nice-to-Have (P2) long-terme

### Architecture (HIGH-LEVEL)
- ✅ Stack **1 ligne par composant** : "Next.js PWA + Supabase EU + Google Maps"
- ✅ Décisions arbitrées (Gemini vs ChatGPT avec justifications)
- ✅ Database **liste tables** : "practitioners, nurses, audit_logs"
- ❌ PAS de SQL : `CREATE TABLE` → Spec.md

### Conformité (HIGH-LEVEL)
- ✅ RGPD **articles concernés** : "Article 6 intérêt légitime, Article 30 registre"
- ✅ HDS **triggers migration** : "v2.0 SI ajout données patient"
- ❌ PAS de RLS SQL : `CREATE POLICY` → Spec.md

### Roadmap (TOUJOURS)
- ✅ MVP v1.0 (features P0, timeline 4h30)
- ✅ v2.0 avec **triggers clairs** : "SI chat ajouté ALORS HDS obligatoire"
- ✅ v3.0 long-terme

### Budget & ROI (TOUJOURS)
- ✅ Coûts infrastructure (MVP vs v2.0)
- ✅ Business model (pricing, revenue potentiel)

---

## ❌ Constitution.md NE DOIT PAS Contenir

### Code SQL/TypeScript
- ❌ `CREATE TABLE practitioners (...);`
- ❌ `CREATE INDEX idx_location ...;`
- ❌ `CREATE POLICY "Nurses read" ...;`
- → **Déléguer à spec.md**

### API Endpoints Détaillés
- ❌ `POST /api/search { query: string, specialty: string[] }`
- ❌ TypeScript interfaces détaillées
- → **Déléguer à spec.md**

### Standards Techniques
- ❌ "Package manager: pnpm EXCLUSIVEMENT"
- ❌ "Node: 20.x+ LTS obligatoire"
- → **Déléguer à spec.md**

### Sub-agents Architecture
- ❌ "healthcare-expert → Conformité HIPAA + HL7 FHIR..."
- ❌ Liste détaillée des 6-8 sub-agents
- → **Déléguer à spec.md**

---

## ✅ Spec.md DOIT Contenir

### Standards Techniques (TOUJOURS)
- ✅ Package manager exact : "pnpm EXCLUSIVEMENT"
- ✅ Node version : "20.x+ LTS"
- ✅ TypeScript config : "Strict mode + Zod validation"

### Database Schema (SQL COMPLET)
- ✅ `CREATE TABLE` avec tous les champs
- ✅ `CREATE INDEX` (GIST, GIN, B-tree)
- ✅ Constraints (CHECK, UNIQUE, FOREIGN KEY)
- ✅ RLS policies Supabase (SQL complet)

### API Endpoints (DÉTAILS)
- ✅ REST/GraphQL routes complètes
- ✅ Request params TypeScript
- ✅ Response types
- ✅ Validations Zod

### Sub-agents Architecture
- ✅ Liste complète des agents (healthcare-expert, security-architect, etc.)
- ✅ Délégation automatique par phase
- ✅ Tools assignés (Read, Write, Edit, Bash)

### Tests Stratégie
- ✅ Frameworks (Playwright E2E, Vitest unit)
- ✅ Coverage minimum (>80%)
- ✅ CI/CD integration

---

## 🔧 Exemples Concrets

### Feature : "Recherche Praticiens"

#### ✅ Constitution.md (Business)

```markdown
## F001 : Recherche Praticiens Géolocalisée

**Problème :**
Infirmières perdent 10-15 min recherche manuelle (annuaire papier périmé)

**Solution MVP :**
Recherche nom + spécialité + carte géolocalisée (rayon 5-10-20 km)

**Justification business :**
- Temps recherche -70% (15 min → 3-5 min)
- Pertinence géographique +50% (praticiens proximité)

**Stack :**
Database PostGIS pour géolocalisation (<500ms query sur 10K praticiens)

→ Détails SQL : voir specs/001-mvp/spec.md
```

#### ✅ Spec.md (Technique)

```markdown
## FR-001 : Search Practitioners API

**Endpoint :** `POST /api/search/practitioners`

**Request Body :**
```typescript
interface SearchRequest {
  query?: string;        // Fuzzy match nom
  specialty?: string[];  // Codes spécialités
  location?: { lat: number; lng: number };
  radius?: number;       // km
  limit?: number;
  offset?: number;
}
```

**Database Query :**
```sql
SELECT p.*,
  ST_Distance(p.location, ST_Point($lat, $lng)::geography) AS distance
FROM practitioner p
WHERE
  p.specialty_codes && $specialty_codes
  AND ST_DWithin(p.location, ST_Point($lat, $lng)::geography, $radius * 1000)
ORDER BY distance ASC
LIMIT $limit OFFSET $offset;
```

**Performance :**
- Index GIST sur location (query <500ms pour 10K praticiens)
- Cache Redis 5 min (praticiens changent peu)
```

---

## 🚀 Workflow Pratique

### Étape 1 : Multi-IA Roundtable → Constitution Allégée

```bash
# User donne vision projet à Claude
# Claude génère BRIEF-GEMINI.md + BRIEF-CHATGPT.md
# User itère avec Gemini + ChatGPT (10-20 min)
# Claude arbitre et rédige constitution.md ALLÉGÉE (15-25 pages)
```

**Constitution.md contient :**
- Vision business, Personas, Stack HIGH-LEVEL
- **PAS de SQL/code détaillé**

---

### Étape 2 : Spec-Kit → Spec.md Détaillée

```bash
# Lancer Spec-Kit
/speckit.specify

# Claude génère specs/001-mvp/spec.md (30-50 pages)
# → Database schema SQL COMPLET
# → API endpoints détaillés
# → Sub-agents architecture
```

**Spec.md contient :**
- TOUS les détails techniques (SQL, TypeScript, validations)

---

### Étape 3 : Implementation

```bash
/speckit.plan
/speckit.tasks
/implement

# Sub-agents lisent spec.md (détails techniques)
# Constitution.md = gouvernance (pas lue par sub-agents)
```

---

## 📋 Checklist Validation

### ✅ Constitution.md Valide (15-25 pages)

- [ ] Client non-technique peut comprendre TOUTES les sections
- [ ] Aucun `CREATE TABLE`, `CREATE INDEX`, `CREATE POLICY`
- [ ] Aucun TypeScript interface détaillé
- [ ] Stack HIGH-LEVEL (1 ligne : "Next.js + Supabase")
- [ ] Décisions arbitrées présentes (Gemini vs ChatGPT)
- [ ] Roadmap avec triggers clairs (v2.0 SI condition)
- [ ] Budget & ROI documenté

### ✅ Spec.md Valide (30-50 pages)

- [ ] Database schema SQL COMPLET
- [ ] API endpoints avec types TypeScript
- [ ] Standards techniques précis (pnpm, Node 20)
- [ ] Sub-agents architecture détaillée
- [ ] Tests stratégie (frameworks, coverage)

### ❌ Doublon Détecté

**Symptôme :** Même contenu dans constitution.md ET spec.md

**Solution :**
```bash
# Alléger constitution.md
# Supprimer SQL → Remplacer par "Tables : X, Y, Z (voir spec.md)"
# Supprimer API détails → Remplacer par "REST API (voir spec.md)"
```

---

## 💡 Cas d'Usage

### Nouveau Projet (Multi-IA Roundtable)

**Utiliser constitution ALLÉGÉE dès départ** :
1. Multi-IA génère constitution.md (15-25 pages, HIGH-LEVEL)
2. `/speckit.specify` génère spec.md (30-50 pages, détails techniques)
3. Pas de doublon

---

### Projet Existant (Constitution Trop Détaillée)

**Si constitution.md > 30 pages avec SQL :**
1. Exécuter `/speckit.specify` (extrait détails techniques)
2. Alléger constitution.md (supprimer SQL, garder HIGH-LEVEL)
3. Résultat : 15-25 pages constitution + 30-50 pages spec

---

## 🔗 Références

- **Pattern complet** : [MULTI-IA-ROUNDTABLE-PATTERN.md](./MULTI-IA-ROUNDTABLE-PATTERN.md)
- **Workflow V4** : [WORKFLOW-FINAL-V4-MULTI-DEVICE.md](./WORKFLOW-FINAL-V4-MULTI-DEVICE.md)
- **Spec-Kit** : https://github.com/github/spec-kit

---

**Version:** 1.0
**Date:** 2025-10-11
**Status:** ✅ Guide de référence rapide

*Constitution (gouvernance) vs Spec (technique) - Séparation claire* 📐
