# 🧠 GEMINI CODE REVIEW - PHASE 4 TRUSTBOOST

## 🎯 CONTEXT ET MISSION

**Gemini, tu es le VALIDATEUR PRINCIPAL pour Phase 4 TrustBoost.**

**Situation :** L'orchestrateur principal et 6 agents spécialisés viennent de terminer Phase 4 en parallèle. Ton rôle est de **VALIDER LE CODE ET LES TESTS** avant le go-live production.

## 📋 BRIEF TECHNIQUE

### **Projet TrustBoost**
- **Type :** SaaS de gestion d'avis clients avec widget embeddable
- **Stack :** Next.js 15, Supabase, Stripe, Tailwind CSS, Playwright
- **Phase :** Phase 4 = Déploiement production commercial
- **Objectif :** 1000+ clients payants en 3 mois

### **Architecture Multi-Agents Réalisée**
1. **🧪 Agent Testing & QA** - Tests E2E Playwright + Core Web Vitals
2. **🎨 Agent Design System** - Storybook + WCAG AA + Tokens design
3. **⚙️ Agent Infrastructure DevOps** - CI/CD GitHub Actions + Monitoring
4. **💼 Agent Business Commercial** - Landing pages + Onboarding Stripe
5. **⚖️ Agent Compliance Legal** - RGPD 100% + CGU/CGV + Audit trail
6. **⚡ Agent Performance** - Lighthouse >95 + Bundle <20KB + Cache

## 🔍 TON RÔLE - VALIDATION CODE & TESTS

### **🎯 Objectifs de ta review :**

1. **QUALITÉ CODE**
   - Architecture cohérente entre les 6 agents
   - Patterns Context7 correctement appliqués
   - Standards Next.js 15 + TypeScript respectés
   - Sécurité (XSS, CSRF, authentification)

2. **TESTS COVERAGE**
   - Tests E2E Playwright opérationnels
   - Coverage >95% comme promis
   - Tests sécurité maintenus depuis Phase 3
   - Tests performance Core Web Vitals

3. **PRODUCTION READINESS**
   - Configuration CI/CD fonctionnelle
   - Monitoring et alertes configurés
   - Compliance RGPD validée
   - Performance Lighthouse >95

4. **INTÉGRATION AGENTS**
   - Cohérence entre composants des 6 agents
   - Dépendances inter-agents bien gérées
   - Timeline 28 jours respectée

## 📊 MÉTRIQUES À VALIDER

### **Targets Phase 4 annoncés :**
- ✅ **99.9% uptime** : Architecture + monitoring
- ✅ **>95 Lighthouse score** : Tous métriques
- ✅ **<10min deployment time** : Pipeline CI/CD
- ✅ **>95% test coverage** : E2E + unit tests
- ✅ **<3s widget loading** : Performance 3G
- ✅ **100% RGPD compliant** : Legal + audit
- ✅ **0 security vulnerabilities** : Scans intégrés

## 🔧 TECHNOLOGIES À EXAMINER

### **Context7 Patterns utilisés (21 patterns) :**
- `/microsoft/playwright` - Tests E2E
- `/tailwindlabs/tailwindcss` - Design system
- `/vercel/next.js` - Deployment + performance
- `/stripe/stripe-js` - Paiements
- `/actions/checkout` - CI/CD
- `/GoogleChrome/lighthouse` - Performance
- **+15 autres patterns** dans le code

### **Stack technique complet :**
- **Frontend :** Next.js 15, React, Tailwind CSS, Storybook
- **Backend :** Supabase, Stripe webhooks
- **Testing :** Playwright, Jest, Coverage reports
- **DevOps :** GitHub Actions, Vercel, Sentry, Docker
- **Legal :** GDPR compliance, audit trails

## 🎯 INSTRUCTIONS SPÉCIFIQUES

### **🔍 Ce que tu dois checker :**

1. **TESTS E2E (Agent 1)**
   - Fichiers Playwright dans `/tests/e2e/`
   - Configuration cross-browser (Chrome, Firefox, Safari)
   - Tests widget sécurité post-Phase 3
   - Coverage reports >95%

2. **DESIGN SYSTEM (Agent 2)**
   - Components Storybook documentés
   - Tokens design cohérents
   - Score accessibilité >77%
   - Integration Tailwind CSS

3. **INFRASTRUCTURE (Agent 3)**
   - Pipeline GitHub Actions `.github/workflows/`
   - Configuration Docker/Vercel
   - Monitoring Sentry configuré
   - Scripts deployment

4. **BUSINESS PAGES (Agent 4)**
   - Landing pages conversion-optimisées
   - Integration Stripe checkout
   - Onboarding <5min flow
   - Analytics tracking

5. **COMPLIANCE (Agent 5)**
   - Implémentation RGPD complète
   - CGU/CGV juridiquement valides
   - Export/suppression données <24h
   - Audit trail 100% coverage

6. **PERFORMANCE (Agent 6)**
   - Configuration Lighthouse CI
   - Bundle optimization <20KB
   - Cache stratégie SWR/ISR
   - Core Web Vitals monitoring

### **🚨 Red flags à identifier :**
- Code dupliqué entre agents
- Patterns Context7 mal appliqués
- Tests incomplets ou fake
- Vulnérabilités sécurité
- Performance dégradée
- Non-compliance RGPD
- Architecture incohérente

### **🎯 Scoring attendu :**
Donne un **score /100** avec justifications détaillées :
- **90-100** : Production ready, go-live autorisé
- **80-89** : Corrections mineures nécessaires
- **70-79** : Problèmes majeurs à corriger
- **<70** : Architecture à revoir

## 📋 FORMAT DE TON RAPPORT

### **Structure attendue :**

```markdown
# 🧠 GEMINI CODE REVIEW PHASE 4 - RAPPORT FINAL

## 📊 SCORE GLOBAL : XX/100

## ✅ POINTS FORTS
- [Liste des excellences identifiées]

## ⚠️ POINTS FAIBLES  
- [Liste des problèmes trouvés]

## 🔍 ANALYSE PAR AGENT

### Agent 1 (Testing & QA) : XX/100
### Agent 2 (Design System) : XX/100  
### Agent 3 (Infrastructure) : XX/100
### Agent 4 (Business) : XX/100
### Agent 5 (Compliance) : XX/100
### Agent 6 (Performance) : XX/100

## 🎯 RECOMMANDATIONS PRIORITAIRES
1. [Action 1 - Criticité haute]
2. [Action 2 - Criticité moyenne]
3. [Action 3 - Amélioration]

## 🚀 DÉCISION GO/NO-GO PRODUCTION
- **DECISION :** GO / NO-GO
- **JUSTIFICATION :** [Explication]
- **CONDITIONS :** [Si applicable]
```

## 🚀 INSTRUCTIONS FINALES

**Gemini, examine TOUT le code produit par les 6 agents.**

**Sois EXIGEANT mais CONSTRUCTIF :**
- Vérifie que les promesses sont tenues
- Identifie les incohérences et problèmes
- Propose des solutions concrètes
- Valide la production readiness

**Cette review détermine si TrustBoost peut aller en production pour 1000+ clients.**

**Ready ? Analyse le code et donne ton verdict ! 🧠🚀**

---

*Gemini Code Review Phase 4 TrustBoost*  
*Mission : Validation production readiness*  
*Target : Go-live commercial autorisé*