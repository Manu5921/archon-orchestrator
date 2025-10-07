# 🤖 CLAUDE CODE MCP CONFIGURATION GUIDE

## 📋 PROBLÈME IDENTIFIÉ

Lors du test du workflow hybride révolutionnaire-Archon, une nouvelle session Claude Code ne peut pas accéder aux outils MCP `orchestra:*` car la connexion MCP n'est pas configurée automatiquement.

**Erreur rencontrée** :
```
❌ Échec - Outil non disponible
Le serveur MCP orchestra qui fournit l'outil start_hybrid_workflow n'est pas configuré ou accessible.
```

## 🔧 SOLUTION : CONFIGURATION MCP POUR NOUVELLES SESSIONS

### **Étape 1 : Prompt de Configuration Initial**

Pour toute **nouvelle session Claude Code**, utiliser ce prompt de démarrage :

```markdown
Je travaille sur le projet archon-orchestrator situé dans /Users/manu/Documents/DEV/archon-orchestrator.

CONFIGURATION MCP REQUISE :
- Un serveur MCP Orchestra tourne sur ws://localhost:3456
- Il fournit des outils workflow hybride révolutionnaire-Archon
- Je dois configurer la connexion MCP pour accéder aux outils orchestra:*

Comment puis-je configurer Claude Code pour se connecter à ce serveur MCP et utiliser les outils orchestra ? Le serveur est déjà en fonctionnement.
```

### **Étape 2 : Vérification de la Connexion**

Après configuration, tester avec :
```markdown
Vérifie si les outils MCP orchestra sont disponibles, notamment :
- orchestra:start_hybrid_workflow
- orchestra:project_exploration  
- orchestra:technical_validation
- orchestra:task_orchestration
- orchestra:code_review_cycle
```

### **Étape 3 : Test du Workflow Hybride**

Une fois la connexion MCP établie :
```markdown
Utilise l'outil MCP orchestra:start_hybrid_workflow avec ces paramètres :
- project_description: "TaskFlow AI - Smart Productivity Hub: Modern task management application with intelligent AI-powered insights, predictive scheduling, and collaborative workflow automation."
- constraints: ["Web-based application", "Modern tech stack", "AI integration", "Real-time collaboration", "Privacy-first data handling", "Responsive design"]

Objectif : Tester le workflow hybride et créer des tâches dans Archon (projet ID visible dans l'interface).
```

## 🎯 PROMPT OPTIMAL POUR FUTURES SESSIONS

### **Version Complète (Copier-Coller)**

```markdown
🚀 SETUP ARCHON-ORCHESTRATOR + MCP

Je travaille dans /Users/manu/Documents/DEV/archon-orchestrator sur un workflow hybride révolutionnaire-Archon.

CONTEXTE :
- Serveur MCP Orchestra actif sur ws://localhost:3456
- Outils disponibles : orchestra:start_hybrid_workflow, orchestra:project_exploration, etc.
- Interface Archon sur http://localhost:3737
- Projet test : TaskFlow AI (ID: créé via interface Archon)

ACTIONS REQUISES :
1. Configure la connexion MCP vers ws://localhost:3456
2. Vérifie la disponibilité des outils orchestra:*
3. Lance orchestra:start_hybrid_workflow avec :
   - project_description: "TaskFlow AI - Smart Productivity Hub: Modern task management with AI insights, predictive scheduling, and collaborative workflow automation"
   - constraints: ["Web-based application", "Modern tech stack", "AI integration", "Real-time collaboration"]

OBJECTIF : Tester si le workflow crée automatiquement des tâches dans l'interface Archon.
```

### **Version Courte (Setup rapide)**

```markdown
Projet : /Users/manu/Documents/DEV/archon-orchestrator
MCP : ws://localhost:3456 (serveur orchestra actif)
Test : orchestra:start_hybrid_workflow pour "TaskFlow AI"
Config MCP requis avant utilisation.
```

## 📊 DIAGNOSTIC POST-CONFIGURATION

### **Tests de Validation**

1. **Connexion MCP** : `Les outils orchestra:* sont-ils listés ?`
2. **Workflow Hybride** : `orchestra:start_hybrid_workflow fonctionne-t-il ?`
3. **Interface Archon** : `Des tâches apparaissent-elles sur http://localhost:3737 ?`
4. **Persistance** : `Les données restent-elles entre les sessions ?`

### **Indicateurs de Succès**

- ✅ Outils MCP `orchestra:*` disponibles
- ✅ Workflow hybride s'exécute sans erreur  
- ✅ Tâches créées automatiquement dans Archon
- ✅ Intégration RAG + persistance fonctionnelle

## 🔄 WORKFLOW TYPE APRÈS CONFIGURATION

```
1. Session Claude Code démarre
2. Prompt de configuration MCP (voir ci-dessus)
3. Claude Code configure la connexion ws://localhost:3456
4. Vérification des outils orchestra:*
5. Test du workflow hybride
6. Validation dans interface Archon
7. Collaboration multi-session opérationnelle
```

## ⚠️ POINTS CRITIQUES

### **Prérequis Techniques**
- Serveur MCP Orchestra doit tourner (`node start-for-archon.js`)
- Interface Archon accessible (`docker-compose up`)
- Port 3456 libre pour MCP
- Port 3737 libre pour Archon UI

### **Fallback en cas d'Échec**
Si la configuration MCP échoue :
1. Test direct : `node test-hybrid-workflow.js`
2. Vérification serveur : `lsof -i :3456`
3. Restart orchestrator si nécessaire

---

## 📝 HISTORIQUE DES PROBLÈMES

**2025-08-29** : Session test révèle que nouvelles sessions Claude Code nécessitent configuration MCP explicite pour accès aux outils orchestra. Solution documentée.

---

*Ce guide doit être suivi pour toute nouvelle session Claude Code travaillant avec archon-orchestrator.*