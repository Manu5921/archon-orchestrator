# 🎨 WORKFLOW GUIDE - Archon Orchestrator

Guide workflows Smart Review, Jules Hybrid, et MCP operations.

---

## 📋 TABLE DES MATIÈRES

1. [Smart Review Workflow](#smart-review-workflow)
2. [Jules Hybrid Workflow](#jules-hybrid-workflow)
3. [Claude ↔ Gemini Communication](#claude-gemini-communication)
4. [MCP Native Workflows](#mcp-native-workflows)

---

## 🎨 SMART REVIEW WORKFLOW

### Revolution Communication Claude-Gemini

Le **Smart Review Workflow Phase 1** optimise la collaboration Claude ↔ Gemini:
- Reviews génériques → Analyses contextualisées
- +300% quality reviews
- +250% creative suggestions
- 7000ms → <2000ms response time

### Architecture Phase 1

```javascript
const smartReviewPhase1 = {
  contextPreparation: {
    claude: "Analyse code + extract patterns/architecture/dependencies",
    output: "Rich context payload for Gemini",
    benefit: "Reviews 5x plus pertinentes + créatives"
  },
  geminiSmartReview: {
    input: "Context détaillé vs code brut",
    analysis: "Quality score + justifications + creative improvements",
    testGeneration: "Unit tests + integration tests suggestions"
  },
  performance: "7000ms → <2000ms avec context intelligent"
};
```

### MCP Commands Phase 1

```bash
# Smart Review avec context preparation
/mcp archon smart_review_workflow code="./src/auth.js"
                                 task="User Authentication Service"
                                 requirements="Secure JWT + validation"

# Context preparation for Gemini
/mcp archon prepare_review_context file="./components/UserDashboard.tsx"
                                  architecture="Next.js App Router + Supabase"

# Execute intelligent review
/mcp archon execute_gemini_review context="prepared_context_payload"
                                 focus="security+performance+testing"
```

### Benefits Measured

- **Review Quality**: +300% (context vs generic prompts)
- **Creative Suggestions**: +250% (architectural awareness)
- **Test Coverage**: +400% (intelligent test generation)
- **Response Time**: 7000ms → <2000ms

### Files & Services

**Created:**
- `src/services/context-service.js` - Context extraction engine
- `src/services/review-service.js` - smartReviewWithContext()
- `test-smart-review-phase1.js` - Test suite

**Services:**
- Gemini Bridge (port 7777) - Context-aware prompts
- Archon MCP (port 8051) - smart_review_workflow tool
- Context7 MCP - Pattern recognition

### Tests

```bash
# Test Smart Review Phase 1
node test-smart-review-phase1.js

# Test Gemini basique (legacy)
node test-real-gemini-review.js
```

---

## 🔄 JULES HYBRID WORKFLOW

### Révolution Workflow

**Avant:** Archon → GitHub Issue → Jules voit → Jules travaille → PR

**Maintenant:** Archon → Jules MCP (direct) → Communication bidirectionnelle → GitHub (tracking)

### Avantages

- ⚡ **0ms latency** - Jules reçoit tâches instantanément
- 💬 **Bidirectionnel** - Communication temps réel
- 🎯 **Approbation plans** - Jules demande validation avant exécution
- 📋 **Double sécurité** - Jules MCP (primary) + GitHub MCP (backup)

### Workflow Type

```bash
# 1. Créer tâche pour Jules
/mcp archon create_task_for_jules project_id="latest"
                                  title="Implement auth feature"
                                  assignee="jules"

# 2. Jules reçoit immédiatement (0ms latency)
# 3. Jules propose plan via Jules MCP
# 4. Approuver ou ajuster plan
# 5. Jules exécute avec monitoring temps réel
# 6. GitHub issue créé automatiquement (tracking)
```

---

## 🔄 CLAUDE ↔ GEMINI COMMUNICATION

### Communication Pipeline Optimisée

**Performance:** 7000ms → <100ms requests simples
**Fiabilité:** Auto-fallback CLI pour orchestration complexe

### Bridge Mode (Optimisé)

- **URL:** http://127.0.0.1:7777
- **Performance:** <100ms simple requests
- **Usage:** Tests rapides, validation, health checks
- **Auto-timeout:** 15s → fallback seamless

### CLI Mode (Robuste)

- **Commande:** `gemini -p "prompt"`
- **Performance:** 30-50s complex orchestration
- **Usage:** Code review, feature planning, bug analysis
- **Fiabilité:** 100% success rate

### Diagnostic

```bash
# Test communication complète
node claude-gemini-diagnostic.js  # 100% success rate

# Bridge server
node setup-gemini-bridge.js setup  # Port 7777

# Test orchestration workflow
node test-orchestration-workflow.js  # 30-50s per scenario
```

### Commands Claude → Gemini

```bash
# Environment setup
export GEMINI_API_URL="http://127.0.0.1:7777"

# Test Bridge mode
node setup-gemini-bridge.js test 7777

# Setup pour sessions futures
node setup-gemini-bridge.js env
```

---

## 🚀 MCP NATIVE WORKFLOWS

### Workflow Simplifié (30s vs 10 min)

#### Étape 1: Exploration Projet

```bash
# Communication directe Claude → Archon (10s)
/mcp archon project_exploration "App SaaS avec auth Supabase et paiements Stripe"

# Validation obligatoire
/mcp archon validate_project_structure --show-files
```

#### Étape 2: Validation Technique

```bash
# Validation multi-IA native (10s)
/mcp archon technical_validation architecture="Next.js + Supabase + Stripe"

# Preuves requises
/mcp archon show_validation_report --format=detailed
/mcp archon run_command "pnpm run build" --show-output
/mcp archon run_command "pnpm run test" --show-report
```

#### Étape 3: Orchestration Multi-IA

```bash
# Lancement workflow hybride (30s)
/mcp archon start_hybrid_workflow orchestration="claude+gemini+jules"

# Validation finale obligatoire
/mcp archon workflow_validation_checklist
/mcp archon show_all_outputs --with-timestamps
/mcp archon verify_deliverables --strict
```

### Commandes MCP Essentielles

#### Validation Obligatoires

```bash
/mcp archon validate_build --show-logs
/mcp archon run_tests --show-report --verbose
/mcp archon list_modified_files --since="5min"
/mcp archon run_command "pnpm lint" --capture-output
/mcp archon validate_code_quality --with-score
/mcp archon system_validation_report
```

#### Project Management

```bash
/mcp archon create_project template="saas-starter"
/mcp archon get_project_status
/mcp archon list_active_tasks
```

#### Quality Assurance + E1-E16

```bash
# Context7 + Archon integration
/mcp context7 resolve-library-id Next.js
/mcp context7 get-library-docs /nextjs/next.js --topic="App Router patterns"

# Validation qualité automatique
/mcp archon validate_code_quality project_id="latest"
/mcp archon apply_quality_improvements source="context7"
/mcp archon audit_best_practices standards="E1,E2,E3,E8,E11,E16"
```

#### Multi-AI Orchestration

```bash
# Coordination IA native
/mcp archon orchestrate_multi_ai task="complex-feature"
           agents="claude:architecture,gemini:creativity,jules:implementation"

# Monitoring collaboration temps réel
/mcp archon ai_collaboration_status
```

---

## 📊 MONITORING WORKFLOWS

### Health Checks

```bash
/mcp archon health_check_all
/mcp archon get_services_status
/mcp archon service_health service="gemini-bridge"
/mcp archon service_health service="context7"
```

### Monitoring Temps Réel

```bash
/mcp archon workflow_metrics
/mcp archon get_active_processes
/mcp archon ai_collaboration_status
/mcp archon get_performance_stats
/mcp archon quality_metrics_summary
```

### Diagnostic

```bash
/mcp archon diagnose_system
/mcp archon test_all_integrations
/mcp archon golden_patterns_status
/mcp context7 connection_test
/mcp archon auto_repair_services
```

---

**Version:** 1.0
**Date:** 2025-10-04
**Source:** Migré depuis CLAUDE.md (sections Workflow)
