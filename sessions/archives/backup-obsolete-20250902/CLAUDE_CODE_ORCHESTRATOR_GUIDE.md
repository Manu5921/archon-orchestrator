# 🎯 CLAUDE CODE ORCHESTRATOR - GUIDE COMPLET

## 🚀 CONCEPT ORIGINAL RESTAURÉ

**Claude Code** est maintenant le véritable **orchestrator principal** du workflow révolutionnaire, exactement comme prévu dans le DEVBOOK original.

## 🎼 WORKFLOW CLAUDE CODE → GEMINI CLI → CLAUDE CODE

### **Phase 1 : Initialisation (Claude Code orchestre)**
```bash
# Claude Code initialise un nouveau projet
orchestra:init_project {
  "project_description": "Application de suivi de tests automatisés...",
  "archon_project_id": "optional-existing-archon-id"
}
```

### **Phase 2 : Exploration Creative (Claude Code → Gemini CLI)**
```bash
# Claude Code demande exploration à Gemini CLI
orchestra:request_gemini_exploration {
  "project_id": "project_xxx",
  "exploration_prompt": "Explore 3-4 creative approaches for automated test tracking...",
  "constraints": ["Web-based", "Real-time dashboard", "CI/CD integration"]
}
```

### **Phase 3 : Validation (Claude Code valide)**
```bash
# Claude Code valide la réponse de Gemini
orchestra:validate_exploration {
  "project_id": "project_xxx",
  "gemini_response": {...},
  "validation_criteria": ["Technical feasibility", "Scalability", "User experience"]
}
```

### **Phase 4 : Sub-Agents (Claude Code crée et assigne)**
```bash
# Claude Code crée des sub-agents spécialisés
orchestra:create_sub_agents {
  "project_id": "project_xxx",
  "required_specializations": ["frontend", "backend", "testing", "devops"],
  "task_breakdown": {...}
}

# Claude Code assigne des tâches spécifiques
orchestra:assign_task_to_sub_agent {
  "project_id": "project_xxx",
  "sub_agent_type": "frontend",
  "task_description": "Create React dashboard with real-time test metrics",
  "expected_output": "React components + tests"
}
```

### **Phase 5 : Review Cycle (Claude Code ↔ Gemini CLI)**
```bash
# Claude Code demande review à Gemini
orchestra:request_gemini_review {
  "project_id": "project_xxx",
  "code_or_output": "const Dashboard = () => { ... }",
  "review_criteria": ["Code quality", "Performance", "Best practices"]
}

# Claude Code applique les corrections
orchestra:apply_review_corrections {
  "project_id": "project_xxx",
  "original_code": "...",
  "gemini_feedback": {...},
  "corrections_to_apply": ["Add error boundaries", "Optimize re-renders"]
}
```

### **Phase 6 : Archivage (Claude Code archive)**
```bash
# Claude Code archive les learnings
orchestra:archive_to_archon {
  "project_id": "project_xxx",
  "patterns_learned": [...],
  "success_metrics": {...},
  "archon_project_id": "archon-project-id"
}
```

## 🎯 DIFFÉRENCES CLÉS AVEC L'ANCIEN SYSTÈME

### ❌ **ANCIEN (Incorrect)**
- Orchestra service fait tout automatiquement
- Claude Code est juste un client MCP passif
- Pas de contrôle réel de Claude Code
- Workflow autonome sans orchestration

### ✅ **NOUVEAU (Concept Original)**
- **Claude Code orchestre chaque étape**
- **Claude Code décide quand appeler Gemini CLI**
- **Claude Code valide toutes les réponses**
- **Claude Code contrôle les sub-agents**
- **Claude Code décide quand archiver**

## 🛠️ OUTILS DISPONIBLES POUR CLAUDE CODE

### **Outils d'Orchestration Principale**
1. `orchestra:init_project` - Initialiser projet
2. `orchestra:request_gemini_exploration` - Demander exploration à Gemini  
3. `orchestra:validate_exploration` - Valider réponse Gemini
4. `orchestra:create_sub_agents` - Créer agents spécialisés
5. `orchestra:assign_task_to_sub_agent` - Assigner tâches
6. `orchestra:request_gemini_review` - Demander review à Gemini
7. `orchestra:apply_review_corrections` - Appliquer corrections
8. `orchestra:archive_to_archon` - Archiver dans Archon

### **Outils Utilitaires**
- `orchestra:get_project_state` - État du projet
- `orchestra:list_available_sub_agents` - Liste agents disponibles

## 🎪 EXEMPLE CONCRET : TESTTRACKER3

```bash
# 1. Claude Code initialise
orchestra:init_project {
  "project_description": "TestTracker3 - Application de suivi de tests automatisés avec dashboard analytics en temps réel",
  "archon_project_id": "a18d5d43-b2b3-434b-9cfa-b4f34dbcb597"
}

# 2. Claude Code demande exploration à Gemini CLI
orchestra:request_gemini_exploration {
  "project_id": "project_xxx",
  "exploration_prompt": "Explore creative approaches for automated test tracking with real-time analytics. Consider modern web technologies, CI/CD integration, and developer experience.",
  "constraints": ["React/Node.js", "Real-time dashboard", "CI/CD integration", "Intuitive interface"]
}

# 3. Claude Code valide et continue...
```

## 🚨 RÈGLES D'OR

1. **Claude Code EST l'orchestrator** - Il contrôle tout le workflow
2. **Gemini CLI est consultatif** - Il répond aux demandes de Claude Code
3. **Sub-agents sont des outils** - Créés et gérés par Claude Code
4. **Archon est la mémoire** - Claude Code décide quoi y stocker
5. **Chaque étape nécessite validation** de Claude Code

## 🔄 MIGRATION DE L'ANCIEN SYSTÈME

L'ancien système `orchestra:start_hybrid_workflow` reste disponible pour compatibilité, mais le nouveau workflow étape par étape est recommandé pour un contrôle total de Claude Code.

---

*Ce guide restaure le concept original où Claude Code est le véritable chef d'orchestre du workflow révolutionnaire.*