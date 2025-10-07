# 🚀 QUICK START - NOUVEAU PROJET AVEC ARCHON

## ⚡ Setup en 3 Minutes

### **📋 ÉTAPE 1 : Copier le Guide**
```bash
# Dans votre nouveau projet
cp /Users/manu/Documents/DEV/archon-orchestrator/CLAUDE.md ./
```

### **🎯 ÉTAPE 2 : Initialiser avec Archon**
```bash
# Commande principale (remplacer [NOM] et [DESCRIPTION])
/mcp archon create_architecture_project title="[NOM-DE-VOTRE-PROJET]" 
                                       description="[DESCRIPTION-EN-UNE-PHRASE]"
                                       template="e1_architecture_first"
```

**Exemples concrets :**
```bash
# SaaS complet
/mcp archon create_architecture_project title="Task Manager Pro" 
                                       description="SaaS de gestion de tâches collaboratives"
                                       template="e1_architecture_first"

# API Backend  
/mcp archon create_architecture_project title="E-commerce API" 
                                       description="API REST pour boutique en ligne"
                                       template="e1_architecture_first"

# App Frontend
/mcp archon create_architecture_project title="Dashboard Analytics" 
                                       description="Interface de visualisation de données"
                                       template="e1_architecture_first"
```

### **⚡ ÉTAPE 3 : Activer Patterns**
```bash
# Types-First (anti-hallucination IA)
/mcp archon apply_golden_pattern pattern="e2_types_anti_hallucination"

# Tests Integration-First 
/mcp archon apply_golden_pattern pattern="e3_tests_integration_first"

# Quality Gates automatisés
/mcp archon setup_quality_gates gates="P0,P1,P2,P3,P4"
```

## 🎯 Ce Que Ça Génère

- ✅ **PRD.md** → Objectifs, contraintes, critères d'acceptation
- ✅ **PROJECT_STRUCTURE.md** → Organisation code et conventions  
- ✅ **docs/ADR/** → Architecture Decision Records
- ✅ **WORKFLOW_FOR_AI.md** → Instructions pour les IA
- ✅ **src/types/** → Types TypeScript stricts
- ✅ **tests/** → Tests intégration + unitaires + E2E
- ✅ **Quality Gates** → P0-P4 configurés

## 🔄 Workflow Feature

```bash
# 1. Nouvelle feature
/mcp archon create_task project_id="latest" 
                       title="Authentification utilisateur"
                       feature="auth"

# 2. Recherche patterns
/mcp archon search_code_examples query="authentication Next.js patterns"

# 3. Développement
[Coder la feature...]

# 4. Validation finale
/feature-complete auth
```

## 📚 Plus d'Infos

Voir **CLAUDE.md** dans votre projet pour la documentation complète.