# 🚀 PROMPT REPRISE SESSION - 01 OCTOBRE 2025

## 🎯 CONTEXTE SESSION 30 SEPTEMBRE 2025

**Session Focus :** Analyse workflow Archon Orchestrator + Architecture Auto-Orchestration Sub-Agents + Comparaison Code Hooks Mastery

---

## 📊 DÉCOUVERTES MAJEURES DE LA SESSION

### **1. Analyse Comparative : Archon vs Code Hooks Mastery**

**Fichier analysé :** `/Users/manu/Downloads/Code Hooks Mastery.txt` (7885 lignes)

**Technologies Clés Découvertes :**

#### **A. Meta-Agent Pattern (Code Hooks Mastery)**
```yaml
---
name: meta-agent
description: Generates new agents from descriptions. Use proactively.
tools: Write, WebFetch, MultiEdit
model: opus
---

# Concept révolutionnaire
User dit : "Create security vulnerability scanner agent"
→ Meta-agent génère automatiquement .claude/agents/security-scanner.md
```

**Impact pour Archon :**
- ✅ Peut générer agents depuis tasks.md automatiquement
- ✅ Élimine création manuelle d'agents
- ✅ Adaptable au workflow Spec-Kit

#### **B. Hooks Lifecycle (8 hooks disponibles)**

**Hooks Critiques Identifiés :**

1. **user_prompt_submit.py** - Détection `/tasks` → Auto-trigger `/archon-init`
2. **post_tool_use.py** - Mise à jour SHARED_CONTEXT.json après Edit/Write
3. **stop.py** - AI-generated completion messages (LLM priority: OpenAI → Anthropic → Ollama)
4. **session_start.py** - Load git status + context files

**Workflow Hooks Proposé :**
```python
# .claude/hooks/user_prompt_submit.py
if "/tasks" in prompt and not Path(".archon").exists():
    trigger_archon_init()

if "/orchestrate" in prompt:
    start_hybrid_workflow()
```

#### **C. Slash Commands Pattern**

**Exemple `/cook.md` :**
```markdown
Run these 7 sub-agent tasks simultaneously in parallel:

1. crypto-coin-analyzer: Analyze DOGE
2. crypto-market-agent: Get market data
3. meta-agent: Create 'security-scanner' agent
4. meta-agent: Create 'performance-optimizer' agent
```

**Adaptation pour Archon :**
```markdown
# .claude/commands/orchestrate.md
Run these 4 sub-agent tasks in dependency order:

1. devops-specialist: Execute T001-T004 (infrastructure) [PARALLEL]
2. backend-specialist: Execute T005-T008 (data layer) [SEQUENTIAL]
3. nlp-specialist + backend-specialist: T009-T017 [PARALLEL]
4. Review cycle: Gemini validation
```

---

### **2. Feature Archon Existante : Shared Context Files**

**Découverte Importante :** Archon avait déjà implémenté un système de contexte partagé !

**Fichiers Trouvés :**

#### **A. Jules Async Workflow** (`/src/integrations/jules-async-workflow.js`)

```javascript
// LIGNE 204-272 : createContextFiles()
async createContextFiles(branch, context) {
    // Crée TASK_CONTEXT.md
    const taskContextContent = `# Task Context

## Code Context
${code_context}

## Files to Modify
${files_to_modify.join('\n')}

## Additional Context
${additional_context}
`;

    // Crée TODO.md pour tracking
    const todoContent = `# TODO for Jules
- [ ] Review task requirements
- [ ] Implement solution
- [ ] Create Pull Request
`;
}
```

**Structure Workspace Jules :**
```
archon-jules-workspace/
├── TASK_CONTEXT.md    # 🎯 Contexte partagé
├── TODO.md            # 🎯 Suivi partagé
└── .github/
```

#### **B. Adaptation pour Sub-Agents Claude Code**

**Pattern Proposé :**
```
.archon/
├── shared-state/
│   ├── CONTEXT.json         # État partagé temps réel
│   └── TODO.md              # Progression visible
├── agents/                  # Auto-générés depuis tasks.md
│   ├── backend-specialist.md
│   ├── nlp-specialist.md
│   ├── testing-specialist.md
│   └── devops-specialist.md
└── workflow/
    └── execution-plan.yaml  # Orchestration automatique
```

**Fichier CONTEXT.json Structure :**
```json
{
  "project_id": "eventtrad",
  "active_tasks": {
    "T001": {
      "agent": "devops-specialist",
      "status": "in_progress",
      "files_modified": ["docker-compose.yml"],
      "blockers": [],
      "notes": "Health checks configured"
    }
  },
  "global_decisions": [
    "Use PostgreSQL 16 (not 15)",
    "Qdrant port 6333"
  ],
  "shared_learnings": {
    "performance": "Batching embeddings reduces latency 3x"
  }
}
```

---

### **3. Workflow Spec-Kit + Archon Integration**

**Vision Complète Validée :**

```
1. Developer
   ↓
   uvx specify init myproject
   ↓
   curl archon-bootstrap.sh | bash

2. Claude Code Session
   ↓
   /specify → /clarify → /plan → /tasks
   ↓
   🎯 Hook détecte tasks.md créé
   ↓
   AUTO: /archon-init
     ├─ Parse tasks.md
     ├─ Generate 4 agents
     ├─ Create workflow.yaml
     └─ Initialize shared-state/

3. Auto-Orchestration
   ↓
   /orchestrate
     ├─ Phase 1: Setup (devops, parallel)
     ├─ Phase 2: Data Layer (backend)
     ├─ Phase 3: Core Logic (backend + nlp, parallel)
     ├─ Review Cycle 1 (Gemini)
     └─ ... (44 tasks)
```

---

## 🏗️ ARCHITECTURE PROPOSÉE (Non Implémentée)

### **Option 1 : Template Git (Recommandée)**

**Structure Template :**
```bash
~/.config/archon-spec-template/
├── template.json              # Config Spec-Kit
├── .archon/
│   ├── workflow-template.yaml
│   ├── shared-state/
│   │   ├── CONTEXT.json
│   │   └── TODO.md
│   └── scripts/
│       ├── auto-generate-agents.js
│       └── parse-tasks.js
├── .claude/
│   ├── hooks/
│   │   ├── post_tool_use.py
│   │   └── user_prompt_submit.py
│   ├── agents/
│   │   └── meta-agent.md
│   └── commands/
│       ├── archon-init.md
│       └── orchestrate.md
└── archon-bootstrap.sh
```

**Bootstrap Script :**
```bash
#!/bin/bash
# archon-bootstrap.sh - Auto-setup après Spec-Kit

PROJECT_DIR=$1
ARCHON_TEMPLATE="$HOME/.config/archon-spec-template"

# 1. Copier structure .archon
cp -r "$ARCHON_TEMPLATE/.archon" "$PROJECT_DIR/"
cp -r "$ARCHON_TEMPLATE/.claude" "$PROJECT_DIR/"

# 2. Initialiser shared context
cat > .archon/shared-state/CONTEXT.json << 'EOF'
{
  "project_id": "$(basename $PROJECT_DIR)",
  "initialized_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "spec_kit_phase": "completed",
  "active_tasks": {},
  "global_decisions": [],
  "shared_learnings": {},
  "agent_status": {}
}
EOF

# 3. Rendre hooks exécutables
chmod +x .claude/hooks/*.py

# 4. Créer .archonrc (config locale)
cat > .archonrc << 'EOF'
ARCHON_AUTO_ORCHESTRATE=true
ARCHON_META_AGENT=enabled
ARCHON_HOOKS_ENABLED=true
ARCHON_WORKFLOW_MODE=hybrid
EOF
```

### **Option 2 : Slash Command `/archon-init`**

**Commande Auto-Détection :**
```markdown
# .claude/commands/archon-init.md
---
description: Auto-setup Archon workflow after Spec-Kit tasks generation
allowed-tools: Read, Write, Bash, Task
---

# Execution Flow

1. Detection Phase
   - Check if specs/001-*/tasks.md exists
   - Exit if .archon/ already initialized

2. Structure Creation
   - mkdir -p .archon/{agents,shared-state,scripts,workflow}
   - mkdir -p .claude/{hooks,commands}

3. Parse tasks.md & Generate Agents
   - Execute: node .archon/scripts/auto-generate-agents.js
   - Group tasks by domain (backend, nlp, testing, devops)
   - Generate .claude/agents/[type]-specialist.md

4. Workflow Generation
   - Extract dependencies from tasks.md
   - Generate .archon/workflow/execution-plan.yaml

5. Install Hooks
   - Create .claude/hooks/user_prompt_submit.py
   - Auto-trigger /archon-init after /tasks

6. Auto-Execute (if ARCHON_AUTO_ORCHESTRATE=true)
   - /orchestrate --auto-start
```

### **Script auto-generate-agents.js**

**Fonctionnalités :**
```javascript
async function main() {
  // 1. Find tasks.md
  const tasksFile = await findTasksFile();

  // 2. Parse tasks
  const tasks = await parseTasks(tasksFile);

  // 3. Group by agent type
  const groups = groupTasksByAgent(tasks);
  // → backend: tasks avec services/api/*, core/storage/*
  // → nlp: tasks avec core/nlp/*
  // → testing: tasks avec tests/*
  // → devops: tasks avec infra/*, docker*

  // 4. Generate agent files
  for (const [agentType, agentTasks] of Object.entries(groups)) {
    await generateAgentFile(agentType, agentTasks);
  }

  // 5. Generate workflow
  await generateWorkflow(groups, tasks);
}

function determineAgent(file) {
  if (/^infra|Dockerfile|docker-compose/.test(file)) return 'devops';
  if (/^services\/api|core\/storage/.test(file)) return 'backend';
  if (/^core\/nlp/.test(file)) return 'nlp';
  if (/^tests/.test(file)) return 'testing';
  return 'backend'; // default
}
```

---

## 📋 COMPARAISON ARCHITECTURES

| Feature | Code Hooks Mastery | Archon Orchestrator | Recommandation |
|---------|-------------------|---------------------|----------------|
| **Meta-Agent** | ✅ meta-agent.md | ⚠️ Manual agents | **Implémenter** |
| **Hooks Lifecycle** | ✅ 8 hooks | ❌ None | **Implémenter** |
| **Shared Context** | ❌ None | ✅ Jules pattern | **Adapter** |
| **Parallel Execution** | ⚠️ Manual (cook.md) | ✅ Workflow engine | **Keep Archon** |
| **Dynamic Selection** | ✅ Description-based | ✅ Pattern-based | **Combiner** |
| **Review Cycles** | ❌ None | ✅ Gemini ↔ Claude | **Keep Archon** |

**Recommandation Finale :** **Architecture Hybride**

```
Code Hooks Features:
├─ Meta-Agent generation → Archon
├─ Hooks lifecycle → Archon
└─ Slash commands pattern → Archon

Archon Features (Keep):
├─ Shared context files (Jules pattern)
├─ Workflow orchestration engine
├─ Review cycles Gemini ↔ Claude
└─ Performance tracking
```

---

## 📦 PROJET EVENTTRAD (Contexte)

**Status Actuel :**
- ✅ Spec-Kit workflow complété (`/specify` → `/clarify` → `/plan` → `/tasks`)
- ✅ tasks.md généré (44 tâches pour Event-Driven Crypto Aggregator)
- ⏸️ **Prêt pour /archon-init** (non implémenté)

**Architecture Prévue :**
- FastAPI + PostgreSQL + Qdrant + Ollama + TimesFM
- 4 agents nécessaires : devops, backend, nlp, testing
- 44 tâches organisées en 7 phases

**Fichiers Clés :**
- `/Users/manu/Documents/DEV/eventtrad/specs/001-the-user-input/tasks.md`
- `/Users/manu/Documents/DEV/eventtrad/specs/001-the-user-input/plan.md`
- `/Users/manu/Documents/DEV/eventtrad/specs/001-the-user-input/spec.md`

---

## 🎯 ACTIONS RECOMMANDÉES DEMAIN

### **Priorité 1 : Créer Template Archon + Spec-Kit**

```bash
# 1. Créer structure template
mkdir -p ~/.config/archon-spec-template/{.archon,.claude}

# 2. Copier depuis Archon Orchestrator
cp -r ~/Documents/DEV/archon-orchestrator/.archon ~/.config/archon-spec-template/
cp -r ~/Documents/DEV/archon-orchestrator/.claude ~/.config/archon-spec-template/

# 3. Créer archon-bootstrap.sh (voir script ci-dessus)

# 4. Créer .archon/scripts/auto-generate-agents.js (voir code ci-dessus)

# 5. Créer .claude/commands/archon-init.md (voir template ci-dessus)

# 6. Créer .claude/hooks/user_prompt_submit.py (auto-trigger)
```

### **Priorité 2 : Tester sur EventTrad**

```bash
# 1. Appliquer template sur EventTrad
cd ~/Documents/DEV/eventtrad
cp -r ~/.config/archon-spec-template/.archon .
cp -r ~/.config/archon-spec-template/.claude .

# 2. Initialiser shared context
cat > .archon/shared-state/CONTEXT.json << 'EOF'
{
  "project_id": "eventtrad",
  "initialized_at": "2025-10-01T08:00:00Z",
  "active_tasks": {},
  "global_decisions": [],
  "shared_learnings": {}
}
EOF

# 3. Lancer auto-génération agents
node .archon/scripts/auto-generate-agents.js

# 4. Vérifier agents générés
ls -la .claude/agents/
# Attendu: backend-specialist.md, nlp-specialist.md, testing-specialist.md, devops-specialist.md

# 5. Lancer orchestration
/orchestrate
```

### **Priorité 3 : Créer Template GitHub Public**

```bash
# Option si on veut partager
gh repo create archon-spec-template --public --template
cd archon-spec-template

# Copier structure complète
# Commit et push
# Usage: curl archon-template.sh | bash
```

---

## 📚 FICHIERS MODIFIÉS CETTE SESSION

1. **README.md** - Ajout section "Spec-Kit + Archon Auto-Orchestration"
2. **CLAUDE.md** - Ajout workflow auto-orchestration complet
3. **PROMPT_REPRISE_0110.md** - Ce fichier (contexte reprise)

---

## 🔑 CONCEPTS CLÉS À RETENIR

### **1. Meta-Agent Pattern**
- Agent qui génère d'autres agents
- Input: Description tâche
- Output: Fichier .md agent complet

### **2. Shared Context Files**
- CONTEXT.json : État partagé entre agents
- TODO.md : Progression visible
- Pattern validé dans jules-async-workflow.js

### **3. Hooks Auto-Trigger**
- user_prompt_submit.py : Détecte /tasks → Lance /archon-init
- post_tool_use.py : Update context après Edit/Write

### **4. Dynamic Agent Selection**
- Pattern-based : Matching file paths
- Keyword-based : Matching task descriptions
- Confidence scoring : 0.6-0.95

### **5. Chaining Automatique**
- Parse dependencies depuis tasks.md
- Build phases parallèles/séquentielles
- Generate execution-plan.yaml

---

## 🚀 WORKFLOW IDÉAL (Vision)

```bash
# Développeur
uvx specify init crypto-aggregator
cd crypto-aggregator
curl https://archon-template.sh | bash

# Claude Code (automatique)
/specify
  → User définit feature
/clarify
  → Résout ambiguïtés (9 questions répondues)
/plan
  → Génère plan technique (44 tâches)
/tasks
  → Génère tasks.md
  🎯 Hook détecte tasks.md
  → AUTO: /archon-init
    ├─ Parse tasks.md
    ├─ Generate backend-specialist.md (18 tasks)
    ├─ Generate nlp-specialist.md (8 tasks)
    ├─ Generate testing-specialist.md (12 tasks)
    ├─ Generate devops-specialist.md (6 tasks)
    ├─ Create execution-plan.yaml
    └─ Initialize CONTEXT.json + TODO.md

  🚀 AUTO: /orchestrate (si ARCHON_AUTO_ORCHESTRATE=true)
    ├─ Phase 1: devops-specialist → T001-T004 [PARALLEL]
    ├─ Phase 2: backend-specialist → T005-T008 [SEQUENTIAL]
    ├─ Phase 3: backend + nlp → T009-T017 [PARALLEL]
    ├─ Review Cycle: Gemini validation
    ├─ Phase 4: backend → T018-T023 [SEQUENTIAL]
    └─ ... (continue jusqu'à T044)

# Monitoring temps réel
cat .archon/shared-state/TODO.md
# Phase 1: Infrastructure (4/4) ✅
# Phase 2: Data Layer (3/4) ⏳
# Phase 3: Core Logic (0/9) ⏸️

cat .archon/shared-state/CONTEXT.json
# {
#   "active_tasks": {
#     "T007": {
#       "agent": "backend-specialist",
#       "status": "in_progress",
#       "blockers": ["Need T005 ORM models finalized"]
#     }
#   },
#   "global_decisions": [
#     "PostgreSQL 16 (backend decision, affects all)",
#     "bge-small-en-v1.5 384-dim (nlp decision, affects storage)"
#   ]
# }
```

---

## 📞 QUESTIONS OUVERTES POUR DEMAIN

1. **Template GitHub ou Local ?**
   - GitHub template repo (partageable) vs ~/.config (local)
   - Recommandation : Les deux (GitHub pour share, ~/.config pour dev)

2. **Auto-Execute ou Manuel ?**
   - ARCHON_AUTO_ORCHESTRATE=true (automatique) vs confirmation
   - Recommandation : Configurable, default=false (sécurité)

3. **Niveau Granularité Agents ?**
   - 4 agents (backend, nlp, testing, devops) vs plus fin
   - Recommandation : Commencer 4, adapter selon projet

4. **Integration MCP Archon ?**
   - Utiliser `/mcp archon` commands ou standalone ?
   - Recommandation : Hybride (MCP pour projets Archon, standalone pour autres)

---

## 🏆 SUCCÈS DE LA SESSION

✅ **Analysé** Code Hooks Mastery (7885 lignes)
✅ **Découvert** Meta-Agent pattern révolutionnaire
✅ **Identifié** Feature existante shared context (Jules)
✅ **Proposé** Architecture complète Spec-Kit + Archon
✅ **Validé** Workflow auto-orchestration
✅ **Mis à jour** README.md + CLAUDE.md
✅ **Créé** Prompt reprise détaillé

---

## 🎯 OBJECTIF DEMAIN

**Implémenter Template Archon + Spec-Kit Integration**

**Timeline estimée :** 2-3 heures
- 1h : Créer structure template + scripts
- 30min : Tester sur EventTrad
- 30min : Debug + ajustements
- 30min : Documentation

**Deliverable :** Template fonctionnel permettant :
```bash
uvx specify init myproject && cd myproject && curl template.sh | bash
# → Projet prêt avec Spec-Kit + Archon orchestration
```

---

**Prêt pour continuer demain !** 🚀
