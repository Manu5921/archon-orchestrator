# 🚀 SETUP GUIDE - Archon Orchestrator

Guide complet pour setup nouveau projet avec Archon.

---

## 📋 TABLE DES MATIÈRES

1. [Setup Options](#setup-options)
2. [Bootstrap depuis Archon UI](#bootstrap-archon-ui)
3. [Standards E1-E16](#standards-e1-e16)
4. [Workflow Validation](#workflow-validation)
5. [Activer Patterns](#activer-patterns)
6. [Workflow Développement](#workflow-développement)

---

## 🎯 SETUP OPTIONS

### Option A : Avec Spec-Kit (Recommandé)

**Pour nouveaux projets avec planning complet**

```bash
# 1. Init Spec-Kit + Archon structure
uvx --from git+https://github.com/github/spec-kit.git specify init myproject
cd myproject
curl -sSL https://archon-template.sh | bash

# 2. Workflow complet
/specify   # Définir feature
/clarify   # Résoudre ambiguïtés
/plan      # Créer plan technique
/tasks     # Générer tasks.md
/archon-init  # Auto-orchestration démarre !
```

**Résultat:**
- ✅ Constitution.md avec standards E1-E16
- ✅ tasks.md avec tâches organisées
- ✅ 4+ sub-agents générés automatiquement
- ✅ Workflow orchestration initialisé

---

### Option B : Archon Standalone

**Pour projets existants**

```bash
# Dans votre projet existant
cp /Users/manu/Documents/DEV/archon-orchestrator/CLAUDE.md ./

# Vérifier MCP disponibles
/mcp archon health_check_all
```

---

## 🎯 BOOTSTRAP ARCHON UI

### Workflow UI-First (Recommandé)

**Étapes:**

#### 1. Créer Projet via UI

```bash
# Ouvrir Archon UI
open http://localhost:3737

# Actions dans UI:
# - Click "New Project"
# - Nom: [NOM-PROJET]
# - Description: [DESCRIPTION-COURTE]
# - Click "Create"
# - Noter project_id (ex: proj_abc123)
```

---

#### 2. Preview Architecture (OBLIGATOIRE)

```bash
/mcp archon preview_project_architecture project_id="proj_abc123"
```

**Claude génère preview complète:**
- Structure fichiers/dossiers E1-E16
- Standards applicables
- Roadmap phases

**⚠️ ATTENDRE validation utilisateur + Gemini review**

---

#### 3. Génération Après Validation

```bash
# Seulement après validation
/mcp archon bootstrap_project project_id="proj_abc123" --confirmed
```

**Génère automatiquement:**
- ✅ PRD.md (objectifs/contraintes/critères)
- ✅ PROJECT_STRUCTURE.md (organisation)
- ✅ docs/ADR/ (première décision architecture)
- ✅ WORKFLOW_FOR_AI.md (instructions IA)
- ✅ src/types/ (Types-First structure)
- ✅ tests/ (integration/, unit/, e2e/)
- ✅ Quality Gates P0-P4 configurés

---

### Alternative : Création Directe

```bash
/mcp archon create_architecture_project title="[NOM-PROJET]"
                                       description="[DESCRIPTION]"
                                       template="e1_architecture_first"
```

---

## 🛡️ STANDARDS E1-E16

### Structure Archon Standard (OBLIGATOIRE)

**Racine projet UNIQUEMENT:**

```
projet/
├── PRD.md                    # E1 - Planning
├── PROJECT_STRUCTURE.md      # E1 - Organisation
├── WORKFLOW_FOR_AI.md        # E1 - Guide IA
├── docs/ADR/                 # E1 - Décisions
├── src/types/                # E2 - Types-first
├── tests/                    # E3 - Tests-first
│   ├── integration/
│   ├── unit/
│   └── e2e/
├── package.json              # Dépendances
└── [fichiers code métier]
```

### ⚠️ INTERDICTIONS STRICTES

**Claude ne doit JAMAIS:**
- Inventer structure monorepo personnalisée
- Créer dossiers non-standard (apps/, packages/)
- Ignorer golden patterns E1-E16
- Générer sans validation Gemini préalable
- Skiper types-first ou tests-first

---

### Validation Pre-Generation

```bash
# Avant TOUTE génération
/mcp archon validate_e1_e16_compliance project_structure="preview"
                                      standards="strict"

# Si échec → ARRÊT immédiat
# Si succès → Génération autorisée
```

---

## 🔄 WORKFLOW VALIDATION OBLIGATOIRE

### Étapes que Claude DOIT Suivre

#### ÉTAPE 1: Analyse Contexte

**Claude examine:**
- Demande utilisateur exacte
- Projet Archon existant ?
- Standards E1-E16 applicables

---

#### ÉTAPE 2: Preview Architecture

```bash
/mcp archon preview_project_architecture project_id="[ID]"
                                        template="e1_architecture_first"
                                        standards="E1,E2,E3,E8"
```

**Claude présente structure EXACTE qui sera générée**

**OBLIGATION:** Montrer TOUS fichiers et dossiers

---

#### ÉTAPE 3: Validation Gemini

```bash
/mcp archon gemini_validate_architecture project_id="[ID]"
                                        checklist="e1_e16_compliance,structure,types,tests"
```

**Claude ATTEND réponse Gemini avant continuer**

---

#### ÉTAPE 4: Confirmation Utilisateur

**Claude demande EXPLICITEMENT:**
> "La structure proposée respecte-t-elle vos attentes ?
> Puis-je procéder à la génération ?"

---

#### ÉTAPE 5: Génération Si Validé

```bash
# Seulement après validation utilisateur + Gemini
/mcp archon bootstrap_project project_id="[ID]" --confirmed
```

---

### 🚨 Interdictions Absolues

- ❌ Générer code sans preview validée
- ❌ Inventer structures non-Archon
- ❌ Ignorer réponses Gemini
- ❌ Procéder sans confirmation utilisateur

---

## ⚡ ACTIVER PATTERNS

### Golden Patterns E1-E16

```bash
# Appliquer patterns
/mcp archon apply_golden_pattern pattern="e2_types_anti_hallucination"
/mcp archon apply_golden_pattern pattern="e3_tests_integration_first"
/mcp archon setup_quality_gates gates="P0,P1,P2,P3,P4"
```

---

### Recherche Patterns Pertinents

```bash
# Query RAG pour votre stack
/mcp archon perform_rag_query query="[stack] architecture patterns best practices" match_count=5

# Exemples:
/mcp archon perform_rag_query query="Next.js SaaS authentication patterns" match_count=5
/mcp archon perform_rag_query query="React TypeScript testing strategies" match_count=5
```

---

## 🔄 WORKFLOW DÉVELOPPEMENT

### Pour Chaque Nouvelle Feature

#### 1. Créer Tâche

```bash
/mcp archon create_task project_id="latest"
                       title="[Nom feature]"
                       description="[Description + critères acceptation]"
                       assignee="AI IDE Agent"
                       feature="[nom-feature]"
```

---

#### 2. Recherche Patterns

```bash
/mcp archon search_code_examples query="[feature] implementation patterns" match_count=3
```

---

#### 3. Smart Review Avant Dev

```bash
/mcp archon smart_review_workflow task="Architecture validation [feature]"
                                 requirements="E1-E16 compliance + types-first"
```

---

#### 4. Développement

**Développer feature en respectant:**
- E2: Types-First (définir interfaces avant code)
- E3: Tests-First (contract tests avant implémentation)
- E8: Quality Gates (P0-P4 validation continue)

---

#### 5. Validation Finale

```bash
# Validation feature complète
/feature-complete [nom-feature]

# Synchronisation Archon
/mcp archon MAJ  # Raccourci: update tasks + vérif cohérence
```

---

## 📊 COMMANDES ESSENTIELLES

### Project Management

```bash
/mcp archon get_project project_id="latest"              # Status projet
/mcp archon list_tasks filter_by="status" filter_value="todo"
/mcp archon get_project_features project_id="latest"
```

---

### Recherche & Context

```bash
/mcp archon perform_rag_query query="[question]" match_count=5
/mcp archon search_code_examples query="[pattern]" match_count=3
/mcp archon get_available_sources
```

---

### Validation & Quality

```bash
/mcp archon audit_best_practices standards="E1,E2,E3,E8"
/mcp archon validate_code_quality project_id="latest"
/mcp archon quality_gates_check gates="P0,P1,P2,P3,P4"
```

---

## 💡 TEMPLATES DISPONIBLES

| Template | Description | Standards |
|----------|-------------|-----------|
| **e1_architecture_first** | SaaS complet | E1-E16 |
| **e2_types_anti_hallucination** | TypeScript strict | E2 |
| **e3_tests_integration_first** | Tests API réels | E3 |
| **e8_quality_gates_p0_p4** | Pipeline qualité | E8 |

---

## 🔍 TROUBLESHOOTING

### MCP Ne Répond Pas
→ Voir [../TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Build Échoue
→ Voir [ZERO-TRUST.md](./ZERO-TRUST.md)

### Services Arrêtés
→ Voir [../RESTART-GUIDE-COMPLET.md](../RESTART-GUIDE-COMPLET.md)

---

**Version:** 1.0
**Date:** 2025-10-04
**Source:** Migré depuis CLAUDE.md (section Setup)
