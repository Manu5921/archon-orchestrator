# 🤖 Jules Async Workflow Guide

Guide complet pour utiliser l'intégration asynchrone entre Archon, Claude et Jules (GitHub Copilot).

## 🎯 Objectif

Permettre à Jules de travailler de manière asynchrone sur des tâches créées par Archon, avec review par Claude et intégration automatique.

## 🏗️ Architecture du Workflow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   ARCHON    │ -> │   GITHUB    │ -> │    JULES    │
│ Orchestrator│    │   Issues    │    │  (Copilot)  │
└─────────────┘    └─────────────┘    └─────────────┘
       ^                                      │
       │           ┌─────────────┐            │
       └-----------│   CLAUDE    │ <----------┘
                   │   Review    │
                   └─────────────┘
```

## 🚀 Installation et Configuration

### 1. Configuration initiale

```bash
# 1. Assure-toi que le GITHUB_PAT est configuré
echo $GITHUB_PAT  # Doit afficher ton token

# 2. Initialise le workspace Jules
node jules-quick-deploy.js init
```

### 2. Vérification du workspace

```bash
# Vérifie le statut du workspace
node jules-quick-deploy.js status
```

## 📝 Création de Tâches pour Jules

### Templates Prédéfinis

```bash
# Voir tous les templates disponibles
node jules-quick-deploy.js templates

# Créer une tâche API
node jules-quick-deploy.js create api-endpoint

# Créer un composant React
node jules-quick-deploy.js create react-component

# Créer une migration de DB
node jules-quick-deploy.js create database-migration
```

### Templates Disponibles

1. **api-endpoint** - Créer un endpoint REST API (45 min)
2. **react-component** - Composant React TypeScript (30 min)
3. **database-migration** - Migration et schéma DB (60 min)
4. **bug-fix** - Correction de bug (90 min)
5. **feature-enhancement** - Amélioration de fonctionnalité (120 min)
6. **refactor-code** - Refactorisation de code (75 min)

### Création en Lot

```bash
# Créer plusieurs tâches d'un coup
node jules-quick-deploy.js batch
```

## 🔄 Workflow Détaillé

### Étape 1: Création de Tâche (Archon/Claude)

```bash
# Crée une tâche pour Jules
node jules-quick-deploy.js create api-endpoint
```

**Résultat:**
- ✅ Repository workspace créé/vérifié
- ✅ Branche de travail créée (`jules-task-XXXX`)
- ✅ Issue GitHub créée avec contexte détaillé
- ✅ Jules auto-assigné via GitHub Copilot
- ✅ Templates et contexte ajoutés

### Étape 2: Travail Asynchrone (Jules)

Jules travaille automatiquement sur la tâche:

1. **Analyse** de l'issue et du contexte
2. **Création** d'une branche de travail
3. **Implémentation** du code
4. **Tests** et validation
5. **Création** d'une Pull Request
6. **Documentation** des changements

### Étape 3: Review et Intégration (Claude)

```bash
# Vérifier les tâches terminées
node jules-quick-deploy.js status

# Nettoyer les tâches terminées
node jules-quick-deploy.js cleanup
```

## 🏷️ Structure du Repository Workspace

```
archon-jules-workspace/
├── README.md                     # Documentation du workspace
├── TASK_CONTEXT.md              # Contexte de la tâche actuelle
├── TODO.md                      # Suivi des tâches
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   └── jules-task.md        # Template pour les tâches Jules
│   └── workflows/
│       └── jules-automation.yml # Automation GitHub Actions
├── jules-task-1234/            # Branches de travail
└── completed-tasks/            # Archive des tâches terminées
```

## 📋 Exemples d'Utilisation

### Création d'API Endpoint

```bash
# Crée une tâche API endpoint
node jules-quick-deploy.js create api-endpoint

# Jules va créer:
# - Route avec validation d'entrée
# - Gestion d'erreurs appropriée
# - Documentation/commentaires
# - Tests basiques
```

### Création de Composant React

```bash
# Crée une tâche composant React
node jules-quick-deploy.js create react-component

# Jules va créer:
# - Composant fonctionnel TypeScript
# - Interface props appropriée
# - Design responsive
# - Documentation JSDoc
# - Story ou exemple d'usage
```

### Workflow Complet Exemple

```bash
# 1. Initialiser (une seule fois)
node jules-quick-deploy.js init

# 2. Créer des tâches
node jules-quick-deploy.js create api-endpoint
node jules-quick-deploy.js create react-component
node jules-quick-deploy.js create bug-fix

# 3. Surveiller le progrès
node jules-quick-deploy.js status

# 4. Nettoyer quand terminé
node jules-quick-deploy.js cleanup
```

## 🔧 Intégration avec Archon Orchestrator

### Depuis un script Archon

```javascript
import JulesAsyncWorkflow from './src/integrations/jules-async-workflow.js';

// Initialiser Jules workflow
const jules = new JulesAsyncWorkflow();
await jules.initialize();

// Créer une tâche depuis Archon
const task = {
    title: 'Implement user authentication',
    description: 'Create secure login system with JWT',
    requirements: [
        'JWT token generation and validation',
        'Password hashing with bcrypt',
        'Login/logout endpoints',
        'Middleware for protected routes'
    ],
    code_context: `
// Current user model
const User = {
    id: String,
    email: String,
    password: String, // Needs hashing
    createdAt: Date
};
    `,
    files_to_modify: [
        'src/auth/auth.controller.js',
        'src/auth/auth.service.js',
        'src/middleware/auth.middleware.js'
    ],
    priority: 'high',
    estimated_time: '90 minutes'
};

const result = await jules.createTaskForJules(task);
console.log('Task created:', result);
```

## 🔍 Monitoring et Debugging

### Vérifier le Status des Tâches

```bash
# Status détaillé
node jules-quick-deploy.js status

# Sortie exemple:
# 📊 Pending tasks: 3
# Active tasks:
#   • #123: Create API Endpoint
#     Created: 03/09/2025
#     Assignees: github-copilot
```

### Logs et Debugging

```bash
# Mode debug avec logs détaillés
DEBUG=true node jules-quick-deploy.js create api-endpoint

# Vérifier les GitHub Actions
# Va sur: https://github.com/[username]/archon-jules-workspace/actions
```

## 🎯 Best Practices

### Pour les Tâches

1. **Descriptions claires** - Sois précis sur ce qui doit être fait
2. **Contexte technique** - Fournis le code existant et la structure
3. **Requirements spécifiques** - Liste les critères d'acceptation
4. **Estimation réaliste** - Jules fonctionne mieux avec des tâches < 2h

### Pour l'Organisation

1. **Batch similaire** - Groupe les tâches liées ensemble
2. **Review régulière** - Vérifie le status régulièrement
3. **Cleanup fréquent** - Ferme les tâches terminées
4. **Documentation** - Maintiens le contexte à jour

## 🚨 Troubleshooting

### Problèmes Communs

#### "Repository not found"
```bash
# Solution: Vérifier la configuration
echo $GITHUB_PAT  # Token configuré ?
echo $GITHUB_OWNER  # Username GitHub configuré ?
```

#### "Copilot not assigned"
```bash
# Solution: Vérifier les permissions
# 1. Copilot doit être activé sur ton compte
# 2. Repository doit permettre les assignments auto
```

#### "Tasks not creating"
```bash
# Solution: Vérifier le workspace
node jules-quick-deploy.js init  # Ré-initialiser
```

## 📚 Ressources

- [GitHub MCP Server](https://github.com/github/github-mcp-server)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Archon Orchestrator](./README.md)

---

## 🎉 Utilisation Rapide

```bash
# Setup complet en 3 commandes
node jules-quick-deploy.js init
node jules-quick-deploy.js create api-endpoint
node jules-quick-deploy.js status
```

**Résultat**: Jules commence à travailler asynchroniquement sur ta tâche !

---

*Créé pour optimiser la collaboration entre Archon, Claude et Jules* ✨