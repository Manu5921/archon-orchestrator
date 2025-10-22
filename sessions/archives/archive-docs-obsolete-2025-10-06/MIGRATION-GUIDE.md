# 📚 Guide de Migration - Projets Existants vers Archon V3

## 🎯 Vue d'ensemble

Ce guide explique comment intégrer vos projets Claude Code existants dans le système Archon V3 pour bénéficier de :
- ✅ Validation automatique de qualité
- 🔒 Analyse de sécurité continue
- 🚀 Optimisation des tokens (10-40% d'économies)
- 📊 Métriques de performance
- 🤖 Enrichissement automatique via agents spécialisés

## 🚀 Quick Start - Migration en 5 minutes

### 1️⃣ **Préparer l'environnement Archon**

```bash
# Terminal 1 : Démarrer les services Archon
cd ~/Documents/DEV/archon
docker-compose up -d

# Terminal 2 : Démarrer l'orchestrateur
cd ~/Documents/DEV/archon-orchestrator
node start-for-archon.js
```

### 2️⃣ **Lancer l'onboarding automatique**

```bash
cd ~/Documents/DEV/archon-orchestrator
node src/integration/onboard-existing-project.js /chemin/vers/votre/projet
```

Le script va automatiquement :
1. Analyser votre projet (structure, tech stack, qualité)
2. Générer un fichier `ARCHITECTURE.md` adapté
3. Détecter et corriger les violations d'architecture
4. Enrichir avec les composants manquants (tests, CI/CD, auth)
5. Configurer GitHub Actions pour la validation continue

### 3️⃣ **Valider l'intégration**

```bash
# Dans votre projet migré
git add .
git commit -m "feat: Integration Archon V3"
git push origin main

# GitHub Actions va automatiquement :
# - Valider l'architecture
# - Analyser la sécurité avec Jules
# - Enrichir la knowledge base
```

## 📋 Migration Manuelle (Step-by-Step)

### Étape 1 : Créer ARCHITECTURE.md

**OBLIGATOIRE** - Archon V3 nécessite ce fichier pour fonctionner.

```markdown
# Architecture Constraints

## Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + Zod validation
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Testing**: Jest + Playwright
- **Deployment**: Vercel/Railway

## Forbidden Patterns
- ❌ No Python/Flask/Django
- ❌ No MongoDB/Mongoose
- ❌ No Vue.js/Angular
- ❌ No unvalidated inputs
- ❌ No hardcoded secrets

## Required Patterns
- ✅ TypeScript strict mode
- ✅ Zod validation for all API endpoints
- ✅ Error boundaries for React components
- ✅ Proper CORS configuration
- ✅ Environment variables via .env
```

### Étape 2 : Adapter le Tech Stack

#### Si votre projet utilise Vue.js → Migrer vers React

```bash
# Retirer Vue
npm uninstall vue @vue/cli-service

# Installer React
npm install react react-dom @types/react @types/react-dom
npm install -D @vitejs/plugin-react
```

#### Si votre projet utilise MongoDB → Migrer vers Supabase

```bash
# Retirer MongoDB
npm uninstall mongodb mongoose

# Installer Supabase
npm install @supabase/supabase-js
```

**Créer** `src/lib/supabase.js` :
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Étape 3 : Ajouter les composants manquants

#### Tests (si absents)

```bash
# Installer les dépendances de test
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D playwright @playwright/test

# Créer structure de tests
mkdir -p tests/unit tests/e2e
```

#### GitHub Actions CI/CD

Créer `.github/workflows/archon-v3.yml` :
```yaml
name: Archon V3 Validation

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Architecture Compliance
        run: |
          # Vérifier ARCHITECTURE.md existe
          test -f ARCHITECTURE.md || exit 1
          
      - name: Security Analysis
        run: |
          # Jules integration
          curl -X POST ${{ secrets.JULES_API_URL }} \
            -H "Authorization: ${{ secrets.JULES_API_KEY }}" \
            -d @ARCHITECTURE.md
            
      - name: Run Tests
        run: |
          npm ci
          npm test
          npm run test:e2e
```

### Étape 4 : Enrichir avec Archon V3

```javascript
// test-enrichment.js
import ArchonV3CompleteSystem from './src/integration/archon-v3-system.js';

const archon = new ArchonV3CompleteSystem();

// Ajouter authentification
await archon.executeAgent('security', {
  task: 'Implement Supabase Auth with email/password',
  projectPath: './mon-projet'
});

// Ajouter tests
await archon.executeAgent('testing', {
  task: 'Create E2E tests for main user flows',
  projectPath: './mon-projet'
});

// Ajouter error handling
await archon.executeAgent('backend', {
  task: 'Add global error handling middleware',
  projectPath: './mon-projet'
});
```

## 🔄 Cas d'Usage Spécifiques

### Projet Frontend Only (React/Next.js)

```bash
node src/integration/onboard-existing-project.js /mon-app-react

# Le script va :
# - Détecter l'absence de backend
# - Proposer d'ajouter une API Express
# - Configurer Supabase pour l'auth/data
# - Ajouter des tests Playwright
```

### Projet Backend Only (API REST)

```bash
node src/integration/onboard-existing-project.js /mon-api

# Le script va :
# - Détecter l'absence de frontend
# - Proposer d'ajouter une UI React admin
# - Valider la sécurité des endpoints
# - Ajouter Zod validation si manquante
```

### Projet Full-Stack Incomplet

```bash
node src/integration/onboard-existing-project.js /mon-app

# Le script va :
# - Analyser la complétude (auth, tests, CI/CD)
# - Enrichir automatiquement les parties manquantes
# - Optimiser les performances
# - Configurer le monitoring
```

## ⚠️ Points d'Attention

### Violations Communes et Solutions

| Violation | Solution | Commande |
|-----------|----------|----------|
| Vue.js détecté | Migrer vers React | `npx @react-codemod/transform` |
| MongoDB utilisé | Migrer vers Supabase | Utiliser script de migration |
| Python backend | Réécrire en Node.js | Utiliser Archon agent backend |
| Pas de tests | Ajouter Jest + Playwright | `npm run test:generate` |
| Pas de TypeScript | Migrer vers TS | `npx typescript --init` |

### Gestion des Secrets

```bash
# Ne JAMAIS commiter .env
echo ".env" >> .gitignore

# Créer .env.example
cp .env .env.example
# Puis remplacer les valeurs par des placeholders

# Pour GitHub Actions
gh secret set SUPABASE_URL --body "https://xxx.supabase.co"
gh secret set SUPABASE_ANON_KEY --body "eyJxxx..."
```

## 📊 Métriques de Succès

Après migration, vous devriez voir :

- **Complétude** : 80% → 100%
- **Qualité** : +30 points minimum
- **Sécurité** : 100/100
- **Performance** : -20% temps de build
- **Tokens** : -30% utilisation moyenne

## 🛠️ Troubleshooting

### "ARCHITECTURE.md not found"
→ Le fichier est obligatoire. Créez-le avec le template ci-dessus.

### "Vue.js violation detected"
→ Archon V3 impose React. Utilisez le script de migration ou refactorisez manuellement.

### "MongoDB not supported"
→ Migrez vers Supabase ou PostgreSQL. Script de migration disponible.

### "Tests failing after migration"
→ Normal si les tests utilisaient l'ancienne architecture. Régénérez avec :
```bash
node test-archon-v3-system.js --regenerate-tests
```

## 📚 Ressources

- [Script d'onboarding](./src/integration/onboard-existing-project.js)
- [Documentation Archon V3](./DEVBOOK.md)
- [Workflow complet](./WORKFLOW-COMPLETE.md)
- [Architecture compliance](./architecture-compliance-v2.md)

## 💡 Best Practices Post-Migration

1. **Toujours** valider localement avant de push
2. **Surveiller** les métriques dans le dashboard Archon
3. **Enrichir** progressivement avec les agents spécialisés
4. **Maintenir** ARCHITECTURE.md à jour
5. **Utiliser** la knowledge base pour les patterns récurrents

---

*Pour toute question : consulter [DEVBOOK.md](./DEVBOOK.md) ou lancer `node test-archon-v3-system.js --help`*