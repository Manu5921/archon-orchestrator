# 🤖 BRIEF GEMINI - Annuaire Santé Infirmières

## 🎯 Contexte Projet

**Nom projet :** Annuaire Santé Pro (infirmières → praticiens)
**Client :** Pôle Santé Département (France)
**Use Case :** Infirmières en consultation cherchent praticiens (médecins, spécialistes, pharmaciens) pour prendre RDV patients

## 📋 Scope MVP v1.0 (Simplifié)

### Fonctionnalités
- **Annuaire professionnel** : Liste praticiens santé (nom, spécialité, adresse, téléphone)
- **Recherche** : Par nom, spécialité, localisation
- **Carte** : Google Maps avec pins praticiens proximité
- **Contact** : Bouton "Appeler" (téléphone natif mobile)
- **Aucune donnée patient** : Juste annuaire praticiens public

### Contraintes Techniques MVP
- **Hébergement** : Supabase EU (pas HDS pour MVP, migration v2.0)
- **Auth** : Email/password simple (infirmières uniquement, PAS PSC pour MVP)
- **Platform** : PWA mobile-first (excellent accès mobile)
- **Données** : Import CSV/JSON fourni par pôle santé (base praticiens)

### Business Model
- **Paiement unique** : Pôle santé achète licence
- **Distribution** : App distribuée aux infirmières département
- **Gratuit** : Pour infirmières utilisatrices finales

## 🔒 QUESTIONS GEMINI (RGPD + Conformité Santé)

### Question 1 : RGPD Simplifié MVP
**Contexte :** MVP = annuaire simple (nom praticien + téléphone + adresse cabinet), AUCUNE donnée patient, hébergement Supabase EU (pas HDS)

**Questions :**
1. **RGPD Article 6 (base légale)** :
   - Annuaire praticiens santé = données publiques (ordre des médecins, RPPS) ?
   - Besoin consentement praticiens si données déjà publiques ?
   - Base légale applicable : Consentement OU Intérêt légitime OU Obligation légale ?

2. **RGPD Article 9 (données sensibles santé)** :
   - MVP sans données patient = PAS concerné Article 9 ?
   - Juste données praticiens (nom, spécialité, contact) = données ordinaires ?

3. **RGPD minimisation données** :
   - Quelles données praticien strictement nécessaires MVP ?
   - Faut-il tracer appels infirmières → praticiens (audit trail) ?

4. **DPO (Data Protection Officer)** :
   - Obligatoire pour MVP annuaire simple ?
   - Pôle santé (client) = responsable traitement, nous = sous-traitant ?

### Question 2 : Roadmap HDS (Migration v2.0)
**Contexte :** MVP Supabase EU → v2.0 ajout chat/vocal + données contexte patient anonymisées → Migration hébergement HDS obligatoire

**Questions :**
1. **Critères déclenchement HDS** :
   - Quand HDS devient obligatoire ? (dès qu'on stocke données santé patient ?)
   - Chat infirmière-praticien avec contexte anonymisé (âge, symptômes) = données santé ?

2. **Hébergeurs HDS recommandés** :
   - Scalingo vs OVHcloud Healthcare vs OutScale (coût/simplicité) ?
   - Migration Supabase → HDS : complexité estimée ?

3. **Certification HDS acteur** :
   - Pôle santé doit être certifié HDS OU juste hébergeur ?
   - Nous (dev/éditeur) : besoin certification spécifique ?

### Question 3 : Auth Infirmières (MVP vs v2.0)
**Contexte :** MVP = email/password simple, v2.0 = PSC (Pro Santé Connect) pour conformité

**Questions :**
1. **MVP sans PSC** :
   - Email/password acceptable pour MVP interne pôle santé ?
   - Risques juridiques si pas PSC dès MVP ?

2. **Migration PSC v2.0** :
   - Complexité intégration PSC (OAuth OIDC) ?
   - Coût certification/tests PSC ?

### Question 4 : Conformité RGAA (Accessibilité)
**Contexte :** App PWA mobile-first, infirmières utilisatrices finales

**Questions :**
1. **RGAA 4 obligatoire** :
   - Service public santé = obligation RGAA 4 (WCAG 2.2 AA) ?
   - Deadline légale conformité ?

2. **Priorités accessibilité MVP** :
   - Niveau AA obligatoire dès MVP OU progressive ?
   - Tests accessibilité automatisés (Lighthouse) suffisants ?

## 📊 Livrable Attendu Gemini

**Format réponse :**
1. ✅ Réponses questions numérotées (citations articles RGPD/lois santé si possible)
2. ✅ Checklist conformité MVP (obligatoire vs recommandé)
3. ✅ Roadmap conformité v1.0 → v2.0 (triggers migration HDS)
4. ✅ Risques juridiques MVP simplifié (si non-conformité)

**Ton :** Pragmatique, pas juridique lourd. Focus "What to do" pour MVP rapide + évolution v2.0 sécurisée.

---

**Date :** 2025-10-12
**Version :** 1.0
**Statut :** Brief prêt pour itération Gemini
