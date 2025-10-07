# 🤖 Sub-Agents Mastery - Guide Complet

**Version:** 1.1.0
**Date:** 2025-10-05
**Objectif:** Maîtriser la création, l'optimisation et le chaining des sub-agents Claude Code pour workflows multi-agents performants.

**Nouveautés v1.1:**
- ✅ Observabilité complète (traces, logs NDJSON, métriques)
- ✅ Gestion coûts & budgets tokens
- ✅ Quality Gates exécutables
- ✅ Test Harness agents & workflows

---

## 📚 TABLE DES MATIÈRES

1. [Comprendre les Sub-Agents](#comprendre-les-sub-agents)
2. [Anatomie d'un Agent Performant](#anatomie-dun-agent-performant)
3. [Agent Chaining Patterns](#agent-chaining-patterns)
4. [Optimisations Avancées](#optimisations-avancées)
5. **[🆕 Observabilité & Traçage](#observabilité--traçage)**
6. **[🆕 Gestion Coûts & Budgets](#gestion-coûts--budgets)**
7. **[🆕 Quality Gates Exécutables](#quality-gates-exécutables)**
8. **[🆕 Test Harness](#test-harness)**
9. [Erreurs Courantes](#erreurs-courantes)
10. [Checklist Qualité Agent](#checklist-qualité-agent)

---

## 🎯 COMPRENDRE LES SUB-AGENTS

### Le Concept Fondamental

**Sub-Agent ≠ Prompt Utilisateur**

```
❌ FAUX                          ✅ VRAI
Agent file = Prompt user         Agent file = SYSTEM PROMPT
Claude exécute directement       Claude primaire DÉCIDE de déléguer
Triggers auto-déclenchent        Triggers = Documentation pour Claude primaire
```

### Flux d'Information Réel

```
User → Claude Primaire → [DÉCISION] → Sub-Agent → Claude Primaire → User
        ↑                    ↓                       ↓
        |              Analyse prompt          Exécute tâche
        |              Lit description         Suit instructions
        ←--------------- Synthétise résultat ←←
```

**Points Clés:**
1. **Sub-agent démarre SANS historique conversation**
2. **Sub-agent reçoit NOUVEAU prompt du Claude primaire** (pas ton prompt original)
3. **Sub-agent répond AU Claude primaire**, pas à toi
4. **Description = Guide pour Claude primaire** sur QUAND/COMMENT déléguer

---

## 🏗️ ANATOMIE D'UN AGENT PERFORMANT

### Structure Frontmatter YAML

```yaml
---
name: agent-specialist                    # kebab-case, descriptif
description: >                            # CRITIQUE pour délégation
  Expert in [domain]. Use PROACTIVELY when user mentions:
  "[trigger-word-1]", "[trigger-word-2]", or when [condition].
  Specialist for [specific-task-type].
tools: Read, Write, Edit, Bash, Grep, Glob  # Minimal nécessaire
color: Cyan                               # Visual identifier (red/blue/green/yellow/purple/orange/pink/cyan)
model: sonnet                             # haiku | sonnet | opus (défaut: sonnet)
---
```

#### Champ `description` - LES RÈGLES D'OR

**❌ Description Faible:**
```yaml
description: Helps with design tasks
```
**Problème:** Trop vague, Claude primaire ne sait pas QUAND déléguer

**✅ Description Forte:**
```yaml
description: >
  UX/UI expert for design specs, wireframes, accessibility validation.
  Use PROACTIVELY for: "design", "wireframe", "a11y", "UI", "UX", "tokens".
  Specialist for creating WCAG 2.2 AA compliant components and design systems.
```
**Pourquoi ça marche:**
- **Domaine clair** (UX/UI)
- **Triggers explicites** (design, wireframe, etc.)
- **Condition proactive** (Use PROACTIVELY)
- **Spécialité précise** (WCAG 2.2 AA)

#### Champ `tools` - Principe du Minimum Viable

**Ne donner QUE les outils nécessaires:**

| Agent Type | Tools Requis | Rationale |
|-----------|-------------|-----------|
| **Reviewer** | Read, Grep, Glob | Analyse code, pas modification |
| **Implementer** | Read, Write, Edit, Bash | Création + modification |
| **Tester** | Read, Bash, Grep | Exécution tests, analyse outputs |
| **Designer** | Read, Write, Edit, WebFetch | Docs + fetch design resources |
| **Deployer** | Read, Bash, Write | Scripts + config + exécution |

**Pourquoi limiter les tools?**
- **Sécurité:** Principe du moindre privilège
- **Clarté:** Rôle agent bien défini
- **Performance:** Moins d'options = décisions plus rapides

#### Champ `model` - Quand Utiliser Quoi

```yaml
# Haiku (rapide, tâches simples)
model: haiku
# Use cases: Linting, formatting, simple file reads, status checks

# Sonnet (défaut, équilibré)
model: sonnet
# Use cases: 90% des agents, bon compromis qualité/vitesse

# Opus (puissant, tâches complexes)
model: opus
# Use cases: Architecture decisions, meta-agent, complex debugging
```

---

### Structure Body - Instructions Système

```markdown
# Purpose

You are a [RÔLE PRÉCIS avec domaine d'expertise].

[1-2 phrases contexte sur POURQUOI cet agent existe]

## Instructions

When invoked by the primary Claude agent, you must follow these steps:

1. **[Phase 1 - Analyse]:** [Action concrète avec outputs attendus]
   - Sub-step a: [Détail]
   - Sub-step b: [Détail]

2. **[Phase 2 - Exécution]:** [Action concrète]
   - Sub-step a: [Détail]

3. **[Phase 3 - Validation]:** [Action concrète]
   - Checklist de validation

**Best Practices:**
- [Practice 1 spécifique au domaine]
- [Practice 2]
- [Practice 3]

**Constraints:**
- [Constraint 1 - ex: No destructive ops without validation]
- [Constraint 2]

## Handoff Rules

When task complete or blocked, handoff to:

### → @[agent-name]
**When:** [Condition précise]
**Deliverables:** [Ce que tu dois fournir avant handoff]
**Context to Pass:** [Info critique pour next agent]

## Report / Response Format

Provide your findings to the primary Claude agent in this format:

```markdown
## [Agent-Name] Report

**Status:** ✅ Complete | ⚠️ Partial | ❌ Blocked

**Summary:** [1-2 phrases résultat clé]

**Details:**
- [Finding 1]
- [Finding 2]

**Next Steps:** [Recommandations pour Claude primaire]

**Artifacts Created:**
- `path/to/file1.ext`
- `path/to/file2.ext`
```
```

---

## 🔗 AGENT CHAINING PATTERNS

### Pattern 1: Sequential Pipeline (Waterfall)

**Use Case:** Chaque étape dépend de la précédente

```
User Request
    ↓
design-specialist → orchestrator-specialist → testing-specialist → deployment-specialist
    ↓                    ↓                          ↓                    ↓
  Tokens            Implémentation              Tests              Deploy
  Wireframes        Integration                 Validation         Monitoring
```

**Configuration Example:**

```yaml
# design-specialist.md
---
name: design-specialist
description: >
  UX/UI expert. Use PROACTIVELY for design, wireframes, tokens.
  ALWAYS invoke at START of new features before implementation.
---

## Handoff Rules

### → @orchestrator-specialist
**When:** Design specs complete (tokens + wireframes validated)
**Deliverables:**
- `.design/tokens.json` (schema-validated)
- `.design/wireframes/*.md` (all screens)
**Context to Pass:**
- Components identified
- Accessibility requirements (WCAG 2.2 AA)
```

```yaml
# orchestrator-specialist.md
---
name: orchestrator-specialist
description: >
  Multi-agent coordinator. Use when task requires MULTIPLE specialists
  or SEQUENTIAL workflow across domains.
---

## Instructions

1. **Receive Design Handoff:**
   - Validate tokens schema
   - Read all wireframes
   - Identify implementation tasks

2. **Coordinate Implementation:**
   - Generate tasks from design specs
   - Assign to appropriate agents
   - Monitor progress

3. **Handoff to Testing:**
   - When implementation complete
   - Pass design specs for validation
```

**Prompt Exemple pour Déclencher:**

```markdown
**ORCHESTRATION DIRECTIVE - Sequential Pipeline**

Task: Implement authentication feature with design-first approach

Workflow:
1. @design-specialist: Create auth UI wireframes + tokens
   → Deliverables: tokens.json, wireframes/auth-*.md
2. @orchestrator-specialist: Coordinate implementation
   → Deliverables: Implementation complete, build passing
3. @testing-specialist: Validate design compliance + security
   → Deliverables: Tests passing, WCAG 2.2 AA validated
4. @deployment-specialist: Deploy to staging
   → Deliverables: Staging URL, monitoring active

Quality Gates:
- P0: Design tokens valid, build succeeds, tests passing
- P1: WCAG 2.2 AA compliant, visual diff ≤1%
```

---

### Pattern 2: Parallel Execution (Fan-Out/Fan-In)

**Use Case:** Tâches indépendantes exécutables simultanément

```
User Request
    ↓
orchestrator-specialist
    ├─→ design-specialist (parallel) ──→┐
    ├─→ testing-specialist (parallel) ─→│
    └─→ docs-specialist (parallel) ────→│
                                         ↓
                            orchestrator-specialist (consolidation)
                                         ↓
                              deployment-specialist
```

**Configuration Example:**

```yaml
# orchestrator-specialist.md (Fan-Out)

## Instructions - Parallel Execution

1. **Analyze Request:**
   - Identify independent sub-tasks
   - Determine agents required

2. **Launch Agents in Parallel:**
   ```
   EXECUTE IN PARALLEL:
   - @design-specialist: Create wireframes
   - @testing-specialist: Write failing tests
   - @docs-specialist: Generate API docs
   ```

3. **Consolidate Results:**
   - Wait for all agents completion
   - Resolve conflicts if any
   - Validate integration
```

**Prompt Exemple:**

```markdown
**ORCHESTRATION DIRECTIVE - Parallel Execution**

Task: Feature X implementation

Execute in PARALLEL:

1. @design-specialist
   - Create component wireframes
   - Validate accessibility
   - Time: ~5 min

2. @testing-specialist
   - Write integration tests (failing)
   - Setup test fixtures
   - Time: ~5 min

3. @docs-specialist
   - Generate API documentation
   - Create usage examples
   - Time: ~5 min

After parallel completion:
@orchestrator-specialist consolidates results and proceeds to implementation.

Quality Gate: All 3 agents report ✅ before proceeding.
```

---

### Pattern 3: Conditional Branching (Decision Tree)

**Use Case:** Workflow varie selon conditions

```
User Request
    ↓
orchestrator-specialist
    ↓
[Analyze codebase]
    ↓
    ├─ If bug detected → @debugging-specialist → @testing-specialist
    ├─ If design issue → @design-specialist → @implementation
    └─ If perf issue → @performance-specialist → @optimization
```

**Configuration Example:**

```yaml
# orchestrator-specialist.md (Branching)

## Instructions - Conditional Workflow

1. **Analyze Request Type:**
   - Check codebase state
   - Identify primary issue

2. **Branch Based on Condition:**

   **IF Bug Detected:**
   - @debugging-specialist: Root cause analysis
   - @testing-specialist: Reproduce with test
   - @implementation: Fix + validate

   **IF Design Issue:**
   - @design-specialist: Review design specs
   - @implementation: Update components
   - @testing-specialist: Visual regression

   **IF Performance Issue:**
   - @performance-specialist: Profiling analysis
   - @optimization: Implement fixes
   - @testing-specialist: Benchmark validation
```

**Prompt Exemple:**

```markdown
**ORCHESTRATION DIRECTIVE - Conditional Branching**

Task: Investigate and fix issue with dashboard loading

Step 1: @orchestrator-specialist analyzes issue type
  - Run diagnostics
  - Classify: bug | design | performance | other

Step 2: Branch based on classification

  IF performance issue (load time >2s):
    → @performance-specialist: Profile components
    → Implement optimization
    → @testing-specialist: Validate improvement

  IF design issue (UX complaint):
    → @design-specialist: Review against wireframes
    → Update components
    → @testing-specialist: Visual regression

  IF bug (broken functionality):
    → @debugging-specialist: Root cause
    → @testing-specialist: Reproduce test
    → Implement fix

Quality Gate: Issue resolved + tests passing
```

---

### Pattern 4: Iterative Refinement (Loop)

**Use Case:** Raffinement progressif jusqu'à critère atteint

```
User Request
    ↓
    ┌─→ @implementation ──→ @testing-specialist ──┐
    │                             ↓                │
    │                        [Tests Pass?]         │
    │                             ├─ NO ───────────┘ (iterate)
    │                             └─ YES
    ↓                                  ↓
@orchestrator-specialist         ✅ Complete
```

**Configuration Example:**

```yaml
# testing-specialist.md (Iterative)

## Instructions - Test-Driven Refinement

1. **Run Test Suite:**
   - Execute all tests
   - Collect failures

2. **Report Results:**
   ```
   Status: ✅ All Pass | ⚠️ N Failures

   IF Failures:
     - List failing tests
     - Recommend fixes
     - Handoff to @implementation for iteration

   IF All Pass:
     - Report success
     - Handoff to @deployment-specialist
   ```

## Handoff Rules

### → @implementation (IF tests fail)
**When:** Failures detected
**Context:**
- Failing test names
- Error messages
- Suggested fixes

### → @deployment-specialist (IF all pass)
**When:** All quality gates passed
**Deliverables:** Test reports, coverage data
```

**Prompt Exemple:**

```markdown
**ORCHESTRATION DIRECTIVE - Iterative TDD**

Task: Implement feature X with TDD

Loop until tests pass:

Iteration N:
1. @testing-specialist: Run test suite
   - IF failures → List failing tests
   - IF pass → Proceed to deployment

2. @implementation: Fix failing tests
   - Address test failures
   - Run local validation

3. Repeat until @testing-specialist reports ✅

Max Iterations: 5
Quality Gate: 100% test pass + coverage ≥90%
```

---

### Pattern 5: Meta-Pattern (Agent Creator)

**Use Case:** Générer nouveaux agents dynamiquement

```
User: "Create agent for X"
    ↓
@meta-agent
    ├─ Fetch latest Claude Code docs
    ├─ Analyze requirements
    ├─ Generate agent file (.claude/agents/new-agent.md)
    └─ Report to user
    ↓
Claude Primaire peut maintenant utiliser new-agent
```

**Configuration Example (déjà dans hooks-mastery):**

```yaml
---
name: meta-agent
description: >
  Generates new Claude Code sub-agent files from descriptions.
  Use PROACTIVELY when user asks to create new sub-agent.
tools: Write, WebFetch, MultiEdit
model: opus  # Needs reasoning for architecture
---

# Purpose
Expert agent architect. Creates complete sub-agent files.

## Instructions

1. **Fetch Latest Docs:**
   - WebFetch: https://docs.anthropic.com/en/docs/claude-code/sub-agents
   - WebFetch: https://docs.anthropic.com/en/docs/claude-code/settings#tools

2. **Analyze User Request:**
   - Extract agent purpose
   - Identify required tools
   - Determine appropriate model (haiku/sonnet/opus)

3. **Generate Agent File:**
   - Create `.claude/agents/<name>.md`
   - Frontmatter with description, tools, model
   - Body with Purpose, Instructions, Report format

4. **Report:**
   - Agent file path
   - Usage examples
   - Trigger words
```

**Prompt Exemple:**

```markdown
**META-AGENT REQUEST**

Create new agent: "security-auditor"

Purpose:
- Scan codebase for security vulnerabilities
- Check dependencies for CVEs
- Validate environment configs

Triggers: "security", "audit", "CVE", "vulnerability"

Tools needed:
- Read (scan files)
- Bash (run security scanners)
- Grep (search patterns)
- WebFetch (check CVE databases)

Model: sonnet (balanced for analysis)

Expected output:
- Security audit report
- List of vulnerabilities (P0/P1/P2)
- Remediation recommendations
```

---

## 🚀 OPTIMISATIONS AVANCÉES

### 1. Context Compression

**Problème:** Sub-agents démarrent sans historique

**Solution:** Passer contexte condensé via prompt Claude primaire

```yaml
# orchestrator-specialist.md

## Instructions - Context Passing

When delegating to sub-agent, include:

**CONTEXT FOR SUB-AGENT:**
- Project: [Name + tech stack]
- Current Phase: [Design | Implementation | Testing | Deploy]
- Previous Decisions: [Key ADRs, 2-3 bullets max]
- Files Modified: [List critical files]
- Quality Standards: [E1-E16 applicable]

Example delegation:
```
@design-specialist, create auth wireframes.

CONTEXT:
- Project: LocalAI SEO (Next.js 14 + Supabase)
- Phase: Design (post /specify)
- Standards: E10 (design tokens), WCAG 2.2 AA
- Tokens exist: .design/tokens.json (validated)

Task: Generate login + signup wireframes with accessibility.
```
```

### 2. Quality Gates as Handoff Conditions

**Bloquer handoff si critères non atteints:**

```yaml
# design-specialist.md

## Handoff Rules

### → @orchestrator-specialist
**Pre-Handoff Validation:**
```bash
# MUST pass before handoff:
pnpm tokens:validate  # Exit 0 required
pnpm ui:test --audit=a11y  # 0 violations required
```

**When:** ALL quality gates passed
**Deliverables:** [...]
**Block Handoff IF:**
- Tokens schema invalid
- Accessibility violations > 0
- Missing wireframes
```

### 3. Shared State via Files

**Sub-agents ne partagent pas mémoire → utiliser fichiers:**

```yaml
# orchestrator-specialist.md

## State Management

Create coordination file: `.orchestrator/state.json`

```json
{
  "current_phase": "design",
  "agents_completed": ["design-specialist"],
  "agents_pending": ["testing-specialist", "deployment-specialist"],
  "artifacts": {
    "design": [".design/tokens.json", ".design/wireframes/"],
    "implementation": [],
    "tests": []
  },
  "quality_gates": {
    "P0": { "design_tokens_valid": true },
    "P1": { "wcag_aa_compliant": false }
  }
}
```

Sub-agents read/update this file for coordination.
```

### 4. Error Escalation Protocol

**Définir quand escalader au Claude primaire:**

```yaml
# testing-specialist.md

## Error Handling

**Auto-Retry (Max 3 attempts):**
- Test flakiness (intermittent failures)
- Network timeouts
- Race conditions

**Escalate to Primary Claude:**
- Tests fail after 3 attempts
- Breaking changes detected
- Coverage drops >10%
- Security vulnerabilities found (P0)

**Escalation Report Format:**
```markdown
🚨 ESCALATION REQUIRED

Agent: @testing-specialist
Reason: [P0 security vulnerability | Tests failing | Coverage drop]
Attempts: 3/3
Error: [Detailed error message]

Recommended Actions:
1. [Action 1]
2. [Action 2]

Context:
- Files affected: [...]
- Tests failing: [...]
```
```

### 5. Performance Budgets

**Définir limites temps d'exécution:**

```yaml
# All agents should respect:

## Performance Targets

- **Analysis Phase:** <1 min
- **Execution Phase:** <5 min
- **Validation Phase:** <2 min
- **Total Agent Runtime:** <10 min

**If Exceeded:**
- Report progress
- Request continuation approval
- OR split task into smaller sub-tasks
```

---

## 🔍 OBSERVABILITÉ & TRAÇAGE

**Objectif:** Savoir "qui a fait quoi, quand, avec quoi, et à quel coût" dans workflows multi-agents.

### Architecture Observabilité

```bash
.observability/
├── logs.ndjson                    # Logs structurés (toutes les runs)
├── workflows/                     # État par workflow
│   ├── {wf_run_id}.json          # Trace complète run
│   └── {wf_run_id}.timeline.json # Timeline agents
└── costs/
    ├── daily-{date}.json         # Agrégation journalière
    └── by-agent.json             # Coûts cumulés par agent
```

### Trace Context Format

**Chaque workflow génère un contexte de traçage unique:**

```json
{
  "wf_run_id": "550e8400-e29b-41d4-a716-446655440000",
  "parent_span_id": "orchestrator-001",
  "agent_span_id": "design-specialist-001",
  "timestamp": "2025-10-05T14:32:00Z",
  "user_prompt": "Implement authentication feature",
  "project": "LocalAI SEO"
}
```

### Logs Structurés NDJSON

**Format de log par événement:**

```jsonl
{"ts":"2025-10-05T14:32:00Z","wf_run_id":"550e8400...","event":"workflow_start","user_prompt":"Implement auth","project":"LocalAI SEO"}
{"ts":"2025-10-05T14:32:05Z","wf_run_id":"550e8400...","event":"agent_delegate","from":"orchestrator","to":"design-specialist","span_id":"design-001"}
{"ts":"2025-10-05T14:35:12Z","wf_run_id":"550e8400...","event":"agent_complete","agent":"design-specialist","span_id":"design-001","status":"✅","tokens_in":1234,"tokens_out":4321,"model":"sonnet","duration_sec":187}
{"ts":"2025-10-05T14:35:15Z","wf_run_id":"550e8400...","event":"quality_gate","agent":"design-specialist","gate":"tokens_valid","priority":"P0","status":"✅","duration_sec":2}
{"ts":"2025-10-05T14:35:20Z","wf_run_id":"550e8400...","event":"handoff","from":"design-specialist","to":"orchestrator","deliverables":["tokens.json","wireframes/"]}
```

### Implémentation Orchestrator

**Modification `orchestrator-specialist.md`:**

```yaml
---
name: orchestrator-specialist
version: 1.1.0
description: >
  Multi-agent coordinator with observability and cost tracking.
  Use when task requires MULTIPLE specialists or SEQUENTIAL workflow.
cost_policy:
  max_wf_tokens: 3_000_000      # Budget total workflow
  max_agent_tokens: 400_000     # Budget par agent
  block_if_exceeds: true
  notify_over: 0.8              # Alert à 80%
---

## Observability Protocol

### 1. Workflow Initialization

When starting new workflow:

```bash
# Generate unique workflow ID
wf_run_id=$(uuidgen)
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Create workflow state file
mkdir -p .observability/workflows
cat > .observability/workflows/${wf_run_id}.json <<EOF
{
  "wf_run_id": "${wf_run_id}",
  "start_time": "${timestamp}",
  "user_prompt": "${USER_PROMPT}",
  "project": "${PROJECT_NAME}",
  "agents": {},
  "quality_gates": {},
  "cost_summary": {
    "total_tokens_in": 0,
    "total_tokens_out": 0,
    "total_cost_usd": 0
  }
}
EOF

# Log workflow start
echo "{\"ts\":\"${timestamp}\",\"wf_run_id\":\"${wf_run_id}\",\"event\":\"workflow_start\",\"user_prompt\":\"${USER_PROMPT}\"}" \
  >> .observability/logs.ndjson
```

### 2. Agent Delegation with Trace Context

When delegating to sub-agent:

```markdown
**TRACE CONTEXT:**
- wf_run_id: ${wf_run_id}
- parent_span_id: orchestrator-001
- agent_span_id: design-specialist-001
- timestamp: ${timestamp}

@design-specialist, create authentication wireframes.

**Context:** [...]
**Deliverables:** [...]
```

**Log delegation:**

```bash
echo "{\"ts\":\"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",\"wf_run_id\":\"${wf_run_id}\",\"event\":\"agent_delegate\",\"from\":\"orchestrator\",\"to\":\"design-specialist\",\"span_id\":\"design-001\"}" \
  >> .observability/logs.ndjson
```

### 3. Agent Completion Logging

When agent completes:

```bash
# Extract metrics from agent response
tokens_in=1234    # From agent report
tokens_out=4321   # From agent report
model="sonnet"
duration_sec=187

# Calculate cost
cost_usd=$(calculate_cost ${model} ${tokens_in} ${tokens_out})

# Update workflow state
jq --arg agent "design-specialist" \
   --argjson tokens_in ${tokens_in} \
   --argjson tokens_out ${tokens_out} \
   --argjson cost ${cost_usd} \
   '.agents[$agent] = {
     "tokens_in": $tokens_in,
     "tokens_out": $tokens_out,
     "cost_usd": $cost,
     "model": "sonnet",
     "duration_sec": 187,
     "status": "✅"
   } |
   .cost_summary.total_tokens_in += $tokens_in |
   .cost_summary.total_tokens_out += $tokens_out |
   .cost_summary.total_cost_usd += $cost' \
   .observability/workflows/${wf_run_id}.json > /tmp/state.json && \
   mv /tmp/state.json .observability/workflows/${wf_run_id}.json

# Log completion
echo "{\"ts\":\"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",\"wf_run_id\":\"${wf_run_id}\",\"event\":\"agent_complete\",\"agent\":\"design-specialist\",\"span_id\":\"design-001\",\"status\":\"✅\",\"tokens_in\":${tokens_in},\"tokens_out\":${tokens_out},\"model\":\"${model}\",\"duration_sec\":${duration_sec}}" \
  >> .observability/logs.ndjson
```
```

### Requêtes Observabilité

**Analyser un workflow spécifique:**

```bash
# Voir état complet workflow
cat .observability/workflows/{wf_run_id}.json | jq .

# Timeline workflow (tous événements)
grep "{wf_run_id}" .observability/logs.ndjson | jq -s 'sort_by(.ts)'

# Coût total workflow
jq '.cost_summary' .observability/workflows/{wf_run_id}.json
```

**Statistiques globales:**

```bash
# Coût total journalier
grep "$(date +%Y-%m-%d)" .observability/logs.ndjson | \
  jq -s 'map(select(.event=="agent_complete")) | map(.cost_usd // 0) | add'

# Agent le plus utilisé
jq -s 'map(select(.event=="agent_complete")) | group_by(.agent) |
  map({agent: .[0].agent, count: length}) | sort_by(.count) | reverse' \
  .observability/logs.ndjson

# Temps d'exécution moyen par agent
jq -s 'map(select(.event=="agent_complete")) | group_by(.agent) |
  map({agent: .[0].agent, avg_duration: (map(.duration_sec) | add / length)})' \
  .observability/logs.ndjson
```

### Visualisation Timeline (Mermaid)

**Script `scripts/generate-timeline.sh`:**

```bash
#!/bin/bash
# Usage: ./scripts/generate-timeline.sh {wf_run_id}

wf_run_id=$1

echo "gantt"
echo "    title Workflow Timeline: ${wf_run_id}"
echo "    dateFormat YYYY-MM-DD HH:mm:ss"
echo "    section Agents"

grep "${wf_run_id}" .observability/logs.ndjson | \
  jq -r 'select(.event=="agent_complete") |
  "\(.agent) :\(.ts | sub("T"; " ") | sub("Z"; "")), \(.duration_sec)s"'
```

---

## 💰 GESTION COÛTS & BUDGETS

**Objectif:** Prévenir explosion coûts dans workflows complexes (boucles, parallélisme, Opus).

### Cost Policy Configuration

**Frontmatter agent (orchestrator-specialist.md):**

```yaml
---
cost_policy:
  max_wf_tokens: 3_000_000       # Budget total workflow (≈$90 Opus)
  max_agent_tokens: 400_000      # Budget par agent (≈$12 Opus)
  block_if_exceeds: true         # Hard stop si dépassement
  notify_over: 0.8               # Alert à 80% budget
  model_downgrade:
    enabled: true
    threshold: 0.7               # Downgrade si >70% budget
    from: opus
    to: sonnet
---
```

### Modèles de Coût

**Tarifs Anthropic (approximatifs, 2025):**

| Model | Input ($/M tokens) | Output ($/M tokens) | Use Case |
|-------|-------------------|---------------------|----------|
| **Haiku** | $0.25 | $1.25 | Rapide, simple (lint, format) |
| **Sonnet** | $3.00 | $15.00 | Équilibré (90% agents) |
| **Opus** | $15.00 | $75.00 | Complexe (architecture, meta-agent) |

### Fonction Calcul Coût

**Helper bash:**

```bash
# scripts/utils/calculate-cost.sh

calculate_cost() {
  local model=$1
  local tokens_in=$2
  local tokens_out=$3

  case $model in
    haiku)
      cost_in=$(echo "scale=6; $tokens_in * 0.25 / 1000000" | bc)
      cost_out=$(echo "scale=6; $tokens_out * 1.25 / 1000000" | bc)
      ;;
    sonnet)
      cost_in=$(echo "scale=6; $tokens_in * 3.00 / 1000000" | bc)
      cost_out=$(echo "scale=6; $tokens_out * 15.00 / 1000000" | bc)
      ;;
    opus)
      cost_in=$(echo "scale=6; $tokens_in * 15.00 / 1000000" | bc)
      cost_out=$(echo "scale=6; $tokens_out * 75.00 / 1000000" | bc)
      ;;
  esac

  echo "scale=6; $cost_in + $cost_out" | bc
}

# Usage: calculate_cost sonnet 1234 4321
# Output: 0.069120
```

### Budget Tracking (Orchestrator)

**Vérification budget avant délégation:**

```bash
## Instructions - Cost Control

Before delegating to sub-agent:

1. **Check Current Budget:**
   ```bash
   # Get cumulative cost
   cumulative_cost=$(jq '.cost_summary.total_cost_usd' \
     .observability/workflows/${wf_run_id}.json)

   max_budget=$(jq -r '.cost_policy.max_wf_tokens * 3.00 / 1000000' \
     <<< '{"cost_policy":{"max_wf_tokens":3000000}}')  # Sonnet estimate

   # Calculate budget usage %
   budget_pct=$(echo "scale=2; $cumulative_cost / $max_budget * 100" | bc)

   echo "💰 Budget: ${cumulative_cost}/${max_budget} USD (${budget_pct}%)"
   ```

2. **Budget Enforcement:**
   ```bash
   # Hard stop if exceeded
   if [ $(echo "$cumulative_cost > $max_budget" | bc) -eq 1 ]; then
     echo "🚨 BUDGET EXCEEDED: ${cumulative_cost} > ${max_budget} USD"
     echo "{\"ts\":\"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",\"wf_run_id\":\"${wf_run_id}\",\"event\":\"budget_exceeded\",\"cost\":${cumulative_cost},\"max\":${max_budget}}" \
       >> .observability/logs.ndjson
     exit 2  # Block workflow
   fi

   # Alert if >80%
   if [ $(echo "$budget_pct > 80" | bc) -eq 1 ]; then
     echo "⚠️  BUDGET WARNING: ${budget_pct}% used"
   fi
   ```

3. **Model Downgrade (Auto-Optimization):**
   ```bash
   # If >70% budget + agent uses Opus → downgrade to Sonnet
   if [ $(echo "$budget_pct > 70" | bc) -eq 1 ] && [ "$agent_model" == "opus" ]; then
     echo "📉 Downgrading $agent from Opus → Sonnet (budget optimization)"
     agent_model="sonnet"
   fi
   ```
```

### Estimation Coût Pattern

**Avant de lancer workflow, estimer:**

```bash
# scripts/estimate-workflow-cost.sh {pattern}

estimate_workflow_cost() {
  local pattern=$1

  case $pattern in
    sequential-design-implementation-testing)
      # design-specialist (sonnet, 50K in + 100K out)
      # orchestrator (sonnet, 30K in + 50K out)
      # testing-specialist (sonnet, 20K in + 40K out)
      total_tokens_in=100000
      total_tokens_out=190000
      model="sonnet"
      ;;

    parallel-fan-out-3-agents)
      # 3 agents (sonnet, 40K in + 80K out each)
      total_tokens_in=120000
      total_tokens_out=240000
      model="sonnet"
      ;;

    iterative-tdd-loop-5-iterations)
      # testing-specialist + implementation (5 iterations)
      # Per iteration: 20K in + 40K out
      total_tokens_in=100000
      total_tokens_out=200000
      model="sonnet"
      ;;
  esac

  cost=$(calculate_cost $model $total_tokens_in $total_tokens_out)
  echo "💰 Estimated cost for '$pattern': \$${cost} USD"
  echo "   Tokens: ${total_tokens_in} in + ${total_tokens_out} out"
  echo "   Model: $model"
}
```

### Daily Cost Aggregation

**Script `scripts/aggregate-daily-costs.sh`:**

```bash
#!/bin/bash
# Run daily via cron

date=$(date +%Y-%m-%d)

# Aggregate all costs for today
jq -s --arg date "$date" '
  map(select(.event=="agent_complete" and (.ts | startswith($date)))) |
  {
    date: $date,
    total_workflows: (map(.wf_run_id) | unique | length),
    total_agents_run: length,
    total_cost_usd: (map(.cost_usd // 0) | add),
    by_agent: (group_by(.agent) | map({
      agent: .[0].agent,
      runs: length,
      cost_usd: (map(.cost_usd // 0) | add)
    })),
    by_model: (group_by(.model) | map({
      model: .[0].model,
      runs: length,
      cost_usd: (map(.cost_usd // 0) | add)
    }))
  }
' .observability/logs.ndjson > .observability/costs/daily-${date}.json

echo "✅ Daily cost report generated: .observability/costs/daily-${date}.json"
```

---

## ✅ QUALITY GATES EXÉCUTABLES

**Objectif:** Transformer gates documentation en commandes machine-enforced.

### Configuration Gates

**Fichier `.quality-gates/gates.json`:**

```json
{
  "design-specialist": {
    "P0": [
      {
        "name": "tokens schema valid",
        "cmd": "pnpm tokens:validate",
        "expect_exit": 0,
        "timeout": 10,
        "blocking": true,
        "error_msg": "Design tokens failed schema validation. Fix tokens.json structure."
      },
      {
        "name": "a11y audit clean",
        "cmd": "pnpm ui:test --audit=a11y",
        "expect_exit": 0,
        "timeout": 60,
        "blocking": true,
        "error_msg": "Accessibility violations detected. Fix WCAG 2.2 AA compliance issues."
      }
    ],
    "P1": [
      {
        "name": "visual diff <= 1%",
        "cmd": "pnpm ui:test --visual --threshold=1",
        "expect_exit": 0,
        "timeout": 120,
        "blocking": false,
        "error_msg": "Visual regression >1% detected. Review component changes."
      }
    ]
  },
  "testing-specialist": {
    "P0": [
      {
        "name": "tests passing",
        "cmd": "pnpm test",
        "expect_exit": 0,
        "timeout": 300,
        "blocking": true,
        "error_msg": "Test suite failing. Fix failing tests before handoff."
      }
    ],
    "P1": [
      {
        "name": "coverage >= 90%",
        "cmd": "pnpm test:coverage --min=90",
        "expect_exit": 0,
        "timeout": 300,
        "blocking": false,
        "error_msg": "Coverage below 90%. Add missing tests."
      }
    ]
  },
  "deployment-specialist": {
    "P0": [
      {
        "name": "build succeeds",
        "cmd": "pnpm build",
        "expect_exit": 0,
        "timeout": 180,
        "blocking": true,
        "error_msg": "Build failed. Fix compilation errors."
      },
      {
        "name": "env vars valid",
        "cmd": "./scripts/validate-env.sh",
        "expect_exit": 0,
        "timeout": 5,
        "blocking": true,
        "error_msg": "Environment configuration invalid. Check .env variables."
      }
    ]
  }
}
```

### Runner Script

**Fichier `scripts/run-quality-gates.sh`:**

```bash
#!/bin/bash
# Usage: ./scripts/run-quality-gates.sh <agent-name> <priority> [wf_run_id]

set -euo pipefail

agent=$1
priority=${2:-P0}
wf_run_id=${3:-}

gates_file=".quality-gates/gates.json"

if [ ! -f "$gates_file" ]; then
  echo "⚠️  No quality gates defined (.quality-gates/gates.json not found)"
  exit 0
fi

gates=$(jq -r ".\"$agent\".\"$priority\" // []" "$gates_file")

if [ "$gates" == "[]" ]; then
  echo "✅ No $priority gates defined for $agent"
  exit 0
fi

failed=0
total=$(echo "$gates" | jq 'length')
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "🔍 Running $total $priority quality gates for $agent..."

echo "$gates" | jq -c '.[]' | while read gate; do
  name=$(echo "$gate" | jq -r '.name')
  cmd=$(echo "$gate" | jq -r '.cmd')
  expect=$(echo "$gate" | jq -r '.expect_exit')
  timeout_sec=$(echo "$gate" | jq -r '.timeout')
  blocking=$(echo "$gate" | jq -r '.blocking')
  error_msg=$(echo "$gate" | jq -r '.error_msg')

  echo "  ▶ $name"

  start_time=$(date +%s)

  # Run command with timeout
  set +e
  timeout $timeout_sec bash -c "$cmd" >/dev/null 2>&1
  exit_code=$?
  set -e

  end_time=$(date +%s)
  duration=$((end_time - start_time))

  # Log gate execution
  if [ -n "$wf_run_id" ]; then
    echo "{\"ts\":\"${timestamp}\",\"wf_run_id\":\"${wf_run_id}\",\"event\":\"quality_gate\",\"agent\":\"${agent}\",\"gate\":\"${name}\",\"priority\":\"${priority}\",\"status\":\"$([ $exit_code -eq $expect ] && echo '✅' || echo '❌')\",\"duration_sec\":${duration}}" \
      >> .observability/logs.ndjson
  fi

  if [ $exit_code -eq $expect ]; then
    echo "    ✅ PASS (${duration}s)"
  else
    echo "    ❌ FAIL (exit $exit_code, expected $expect, ${duration}s)"
    echo "       Error: $error_msg"

    if [ "$blocking" == "true" ]; then
      echo ""
      echo "🚨 BLOCKING GATE FAILED: $name"
      echo "   Agent: $agent"
      echo "   Priority: $priority"
      echo "   Command: $cmd"
      echo "   Error: $error_msg"
      exit 2  # Exit code 2 = blocking failure
    fi

    failed=$((failed + 1))
  fi
done

if [ $failed -gt 0 ]; then
  echo ""
  echo "⚠️  $failed non-blocking gates failed"
  exit 1  # Exit code 1 = non-blocking failures
fi

echo ""
echo "✅ All $priority gates passed for $agent"
exit 0
```

### Integration Agent

**Modification handoff rules (tous agents):**

```yaml
## Handoff Rules

### → @orchestrator-specialist

**Pre-Handoff Quality Gates:**

Execute quality gates validation:
```bash
./scripts/run-quality-gates.sh design-specialist P0 ${wf_run_id}
```

**Exit Code Behavior:**
- **0:** All gates passed → Handoff APPROVED
- **1:** Non-blocking failures → Handoff APPROVED with warnings
- **2:** Blocking gate failed → Handoff DENIED

**When:** All P0 gates passed (exit 0 or 1)
**Block Handoff IF:** Blocking gate failed (exit 2)

**Deliverables:** [...]
```

### Utilisation dans Workflow

**Exemple orchestrator delegation:**

```bash
## Instructions - Quality Gate Enforcement

After agent completion, before handoff:

1. **Run Quality Gates:**
   ```bash
   ./scripts/run-quality-gates.sh design-specialist P0 ${wf_run_id}
   gate_exit=$?

   if [ $gate_exit -eq 2 ]; then
     echo "🚨 Quality gate BLOCKING failure detected"
     echo "   Cannot proceed to handoff"
     echo "   Agent must fix issues and re-run"
     exit 2
   elif [ $gate_exit -eq 1 ]; then
     echo "⚠️  Quality gate warnings (non-blocking)"
     echo "   Proceeding with handoff but flagging for review"
   else
     echo "✅ All quality gates passed"
   fi
   ```

2. **Proceed to Handoff:**
   - If gates passed (exit 0/1)
   - With artifacts from agent
   - With trace context
```

---

## 🧪 TEST HARNESS

**Objectif:** Validation automatisée agents isolés + workflows complets.

### Structure Tests

```bash
.agents/tests/
├── design-specialist/
│   ├── 001-tokens-generation.json
│   ├── 002-wireframes-creation.json
│   ├── 003-a11y-validation.json
│   └── fixtures/
│       ├── minimal-spec.md
│       ├── tokens-template.json
│       └── constitution.md
├── testing-specialist/
│   ├── 001-reports-failures.json
│   ├── 002-coverage-check.json
│   └── fixtures/
│       ├── tests_failed.json
│       └── package.json
├── orchestrator-specialist/
│   ├── 001-sequential-workflow.json
│   ├── 002-parallel-fanout.json
│   └── fixtures/
│       └── tasks.md
└── workflows/
    ├── sequential-design-to-deploy.json
    ├── parallel-fan-out.json
    └── iterative-tdd-loop.json
```

### Format Test Agent

**Fichier `.agents/tests/design-specialist/001-tokens-generation.json`:**

```json
{
  "name": "tokens-generation-from-template",
  "description": "Verify design-specialist generates valid design tokens from template",
  "agent": "design-specialist",
  "setup": {
    "state_files": {
      ".design/schemas/tokens-template.json": "./fixtures/tokens-template.json",
      ".design/schemas/tokens.schema.json": "../../../.design/schemas/tokens.schema.json",
      "constitution.md": "./fixtures/constitution.md"
    },
    "working_dir": "/tmp/agent-test-design-001"
  },
  "prompt": "Generate design tokens for a SaaS dashboard project using the template.",
  "expect": {
    "status": "✅",
    "artifacts": [
      {
        "path": ".design/tokens.json",
        "exists": true,
        "json_schema_valid": {
          "schema": ".design/schemas/tokens.schema.json"
        }
      }
    ],
    "output_contains": [
      "Design tokens created",
      "Schema validation: PASS",
      "tokens.json"
    ],
    "output_not_contains": [
      "Error",
      "Failed",
      "❌"
    ],
    "quality_gates": {
      "P0": ["tokens schema valid"]
    }
  },
  "timeout": 120,
  "cleanup": true
}
```

### Format Test Workflow

**Fichier `.agents/tests/workflows/sequential-design-to-deploy.json`:**

```json
{
  "name": "sequential-design-implementation-testing-deployment",
  "description": "Full workflow from design → implementation → testing → deployment",
  "pattern": "sequential",
  "agents": [
    {
      "agent": "design-specialist",
      "prompt": "Create design system for authentication feature (login + signup screens)",
      "expect": {
        "status": "✅",
        "artifacts": [
          ".design/tokens.json",
          ".design/wireframes/login.md",
          ".design/wireframes/signup.md"
        ],
        "output_contains": ["Wireframes created", "Tokens validated"],
        "quality_gates_pass": ["tokens schema valid", "a11y audit clean"]
      },
      "timeout": 180
    },
    {
      "agent": "orchestrator-specialist",
      "prompt": "Coordinate implementation of auth feature based on design specs",
      "expect": {
        "status": "✅",
        "artifacts": [
          "src/components/auth/LoginForm.tsx",
          "src/components/auth/SignupForm.tsx",
          "tests/auth/"
        ],
        "output_contains": ["Implementation complete", "Tests generated"],
        "handoff_to": "testing-specialist"
      },
      "timeout": 300
    },
    {
      "agent": "testing-specialist",
      "prompt": "Validate auth implementation (security + UI tests)",
      "expect": {
        "status": "✅",
        "output_contains": ["All tests passing", "Coverage: 100%", "Security: ✅"],
        "quality_gates_pass": ["tests passing"],
        "handoff_to": "deployment-specialist"
      },
      "timeout": 240
    },
    {
      "agent": "deployment-specialist",
      "prompt": "Deploy auth feature to staging",
      "expect": {
        "status": "✅",
        "output_contains": ["Deployment successful", "Staging URL:"],
        "quality_gates_pass": ["build succeeds"]
      },
      "timeout": 180
    }
  ],
  "overall_quality_gates": {
    "P0": ["All agents ✅", "Total time <15 min", "Cost <$5"],
    "P1": ["Design tokens valid", "Tests passing", "Deployed"]
  },
  "max_duration_sec": 900,
  "max_cost_usd": 5.0
}
```

### Runner Test Agent

**Fichier `scripts/test-agent.sh`:**

```bash
#!/bin/bash
# Usage: ./scripts/test-agent.sh <test-file.json>

set -euo pipefail

test_file=$1
test_dir=$(dirname "$test_file")

# Parse test config
name=$(jq -r '.name' "$test_file")
agent=$(jq -r '.agent' "$test_file")
prompt=$(jq -r '.prompt' "$test_file")
working_dir=$(jq -r '.setup.working_dir' "$test_file")
timeout_sec=$(jq -r '.timeout' "$test_file")
cleanup=$(jq -r '.cleanup // true' "$test_file")

echo "🧪 Running agent test: $name"
echo "   Agent: $agent"
echo "   Working dir: $working_dir"

# Setup workspace
mkdir -p "$working_dir"

# Copy state files
jq -r '.setup.state_files | to_entries[] | "\(.key)=\(.value)"' "$test_file" | while IFS='=' read dest src; do
  dest_full="$working_dir/$dest"
  mkdir -p "$(dirname "$dest_full")"

  # Resolve relative path from test_dir
  if [[ "$src" == ./* ]]; then
    cp "$test_dir/$src" "$dest_full"
  else
    cp "$src" "$dest_full"
  fi

  echo "   Copied: $src → $dest"
done

# TODO: Execute agent (requires Claude Code CLI or API integration)
# For MVP, simulate or require manual execution
echo ""
echo "⚠️  Agent execution requires Claude Code integration"
echo "   Prompt to execute:"
echo "   ---"
echo "   $prompt"
echo "   ---"
echo ""
echo "   Workspace: $working_dir"
echo "   Expected artifacts:"
jq -r '.expect.artifacts[].path' "$test_file" | while read artifact; do
  echo "   - $artifact"
done

# Validate expectations (if agent was executed)
validate_test() {
  local working_dir=$1
  local test_file=$2

  cd "$working_dir"

  # Check artifacts exist
  jq -r '.expect.artifacts[] | select(.exists==true) | .path' "$test_file" | while read artifact; do
    if [ ! -f "$artifact" ] && [ ! -d "$artifact" ]; then
      echo "❌ Artifact missing: $artifact"
      return 1
    fi
  done

  # Validate JSON schemas
  jq -c '.expect.artifacts[] | select(.json_schema_valid) |
    {path: .path, schema: .json_schema_valid.schema}' "$test_file" | while read item; do
    path=$(echo "$item" | jq -r '.path')
    schema=$(echo "$item" | jq -r '.schema')

    if ! ajv validate -s "$schema" -d "$path" 2>/dev/null; then
      echo "❌ Schema validation failed: $path"
      return 1
    fi
  done

  # Run quality gates
  jq -r '.expect.quality_gates.P0[]? // empty' "$test_file" | while read gate; do
    # Map gate name to command (simplified)
    case "$gate" in
      "tokens schema valid")
        if ! pnpm tokens:validate >/dev/null 2>&1; then
          echo "❌ Quality gate failed: $gate"
          return 1
        fi
        ;;
    esac
  done

  echo "✅ All validations passed"
  return 0
}

# Cleanup
if [ "$cleanup" == "true" ]; then
  echo ""
  echo "🧹 Cleanup: rm -rf $working_dir"
  # rm -rf "$working_dir"  # Uncomment when ready
fi

echo ""
echo "✅ Test setup complete: $name"
```

### Intégration CI/CD

**GitHub Actions `.github/workflows/test-agents.yml`:**

```yaml
name: Test Agents

on:
  pull_request:
    paths:
      - '.claude/agents/**'
      - '.agents/tests/**'
      - 'scripts/test-agent.sh'

jobs:
  test-agents:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: pnpm install

      - name: Run agent tests
        run: |
          for test in .agents/tests/*/*.json; do
            echo "Testing: $test"
            ./scripts/test-agent.sh "$test" || exit 1
          done

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: agent-test-results
          path: .agents/tests/**/results/
```

---

## ❌ ERREURS COURANTES

### Erreur 1: Description Trop Générique

```yaml
# ❌ MAUVAIS
description: Helps with code tasks

# ✅ BON
description: >
  Code reviewer specialist. Use PROACTIVELY after file modifications
  to check: security, performance, best practices. Triggers: "review",
  "audit", "check code".
```

### Erreur 2: Trop d'Outils

```yaml
# ❌ MAUVAIS (agent reviewer avec Write/Edit)
tools: Read, Write, Edit, Bash, Grep, Glob

# ✅ BON (reviewer read-only)
tools: Read, Grep, Glob
```

### Erreur 3: Instructions Vagues

```yaml
# ❌ MAUVAIS
## Instructions
1. Analyze the code
2. Fix issues
3. Report results

# ✅ BON
## Instructions

1. **Code Analysis (30 sec):**
   - Grep for security patterns: SQL injection, XSS, CSRF
   - Read all modified files (.git diff)
   - Check against OWASP Top 10

2. **Issue Classification (1 min):**
   - P0 (Critical): Security vulnerabilities, data loss
   - P1 (High): Performance regressions >20%
   - P2 (Medium): Code quality, best practices

3. **Report Generation:**
   - List issues by priority
   - Provide fix recommendations
   - Link to relevant docs
```

### Erreur 4: Pas de Handoff Rules

```yaml
# ❌ MAUVAIS (agent en silo, pas de coordination)
[No handoff rules defined]

# ✅ BON
## Handoff Rules

### → @orchestrator-specialist
**When:** Analysis complete, issues classified
**Deliverables:** Security audit report
**Block Handoff IF:** P0 issues detected (must fix first)

### → @implementation
**When:** P0/P1 fixes required
**Context:** Issue list + recommended fixes
```

### Erreur 5: Oublier le Report Format

```yaml
# ❌ MAUVAIS (sub-agent ne sait pas comment répondre)
[No report format specified]

# ✅ BON
## Report / Response Format

Respond to primary Claude agent with:

```markdown
## [Agent-Name] Completion Report

**Status:** ✅ | ⚠️ | ❌

**Summary:** [1 sentence key result]

**Metrics:**
- Tests Run: X
- Pass Rate: Y%
- Coverage: Z%

**Issues Found:** [If any]
- [Issue 1]

**Recommendations:** [Next steps]

**Artifacts:**
- `path/to/report.md`
```
```

---

## ✅ CHECKLIST QUALITÉ AGENT

### Phase 1: Conception

- [ ] **Nom descriptif** (kebab-case, domaine clair)
- [ ] **Description actionnable** (triggers + "Use PROACTIVELY")
- [ ] **Outils minimaux** (juste ce qui est nécessaire)
- [ ] **Modèle approprié** (haiku/sonnet/opus selon complexité)

### Phase 2: Instructions

- [ ] **Purpose clair** (1-2 phrases rôle)
- [ ] **Instructions numérotées** (phases avec sub-steps)
- [ ] **Best practices** (3-5 règles domaine)
- [ ] **Constraints** (limitations explicites)
- [ ] **Performance budgets** (temps d'exécution max)

### Phase 3: Coordination

- [ ] **Handoff rules définis** (→ quels agents, quand, quoi)
- [ ] **Quality gates** (conditions pour handoff)
- [ ] **Error escalation** (quand remonter au primaire)
- [ ] **Context passing** (info critique pour next agent)

### Phase 4: Output

- [ ] **Report format** (structure claire markdown)
- [ ] **Status indicators** (✅⚠️❌)
- [ ] **Metrics** (quantitatifs si applicable)
- [ ] **Artifacts paths** (fichiers créés/modifiés)

### Phase 5: Testing

- [ ] **Tester agent seul** (prompt direct)
- [ ] **Tester dans workflow** (chaining avec autres agents)
- [ ] **Vérifier handoffs** (transitions correctes)
- [ ] **Mesurer performance** (temps d'exécution)

---

## 📚 EXEMPLES DE RÉFÉRENCES

### Agent Simple (Haiku)

**formatter-specialist.md**
```yaml
---
name: formatter-specialist
description: Code formatter. Use when code style inconsistent. Triggers: "format", "prettier", "style".
tools: Read, Edit, Bash
model: haiku
---

# Purpose
Auto-format code to project standards.

## Instructions

1. **Detect Formatter:**
   - Check package.json for prettier/eslint
   - Read config files

2. **Run Formatter:**
   ```bash
   pnpm run format
   # OR
   pnpm prettier --write .
   ```

3. **Report Changes:**
   - List files modified
   - Show before/after diff (if requested)

## Report

```markdown
## Formatter Report

**Status:** ✅ Complete

**Files Formatted:** X files
- `src/components/Button.tsx`
- `src/utils/format.ts`

**Formatter Used:** Prettier v3.0.0
**Config:** `.prettierrc.json`
```
```

### Agent Complexe (Opus)

**architecture-specialist.md**
```yaml
---
name: architecture-specialist
description: >
  Software architect. Use PROACTIVELY for: architecture decisions,
  system design, ADR creation. Triggers: "architecture", "design system",
  "ADR", "refactor". Specialist in scalable patterns.
tools: Read, Write, Grep, Glob, Bash, WebFetch
model: opus
---

# Purpose
Expert software architect for high-level design and ADR documentation.

## Instructions

1. **Context Analysis (2 min):**
   - Read existing ADRs (docs/adr/*.md)
   - Analyze codebase structure
   - Identify architectural patterns

2. **Design Evaluation (5 min):**
   - Assess proposed solution
   - Identify trade-offs
   - Research alternatives (WebFetch docs)
   - Consider: scalability, maintainability, performance

3. **ADR Creation (3 min):**
   - Write Architecture Decision Record
   - Format: Context, Decision, Consequences
   - Reference: [ADR template]

4. **Validation:**
   - Check alignment with project standards
   - Verify no conflicts with existing ADRs

## Handoff Rules

### → @orchestrator-specialist
**When:** ADR approved, ready for implementation planning
**Deliverables:** `docs/adr/NNNN-title.md`
**Context:** Architecture decision, implementation notes

## Report

```markdown
## Architecture Review

**Decision:** [Title]

**Status:** ✅ Approved | ⚠️ Needs Review | ❌ Rejected

**Trade-offs:**
- Pros: [...]
- Cons: [...]

**ADR:** `docs/adr/0042-use-event-sourcing.md`

**Implementation Notes:**
- [Key point 1]
- [Key point 2]

**Next Steps:**
- Handoff to @orchestrator-specialist for planning
```
```

---

## 🎯 PATTERNS PAR TYPE DE PROJET

### SaaS Application

**Agents Recommandés:**
1. **design-specialist** (UI/UX)
2. **orchestrator-specialist** (coordination)
3. **testing-specialist** (TDD + E2E)
4. **security-specialist** (auth, data)
5. **deployment-specialist** (CI/CD)

**Chaining Typique:**
```
design → orchestrator → [implementation] → testing → security → deployment
```

### Library / Package

**Agents Recommandés:**
1. **api-designer** (interface publique)
2. **testing-specialist** (unit tests, 100% coverage)
3. **docs-specialist** (API docs, examples)
4. **versioning-specialist** (semver, changelog)

**Chaining Typique:**
```
api-designer → testing → docs → versioning
```

### Data Pipeline

**Agents Recommandés:**
1. **data-architect** (schema design)
2. **etl-specialist** (transformation logic)
3. **testing-specialist** (data validation)
4. **performance-specialist** (optimization)
5. **monitoring-specialist** (observability)

**Chaining Typique:**
```
data-architect → etl → testing → performance → monitoring
```

---

## 🔧 MAINTENANCE & ÉVOLUTION

### Quand Créer Nouveau Agent

**✅ Créer si:**
- Domaine expertise distinct (design ≠ testing)
- Outil requirements différents
- Peut fonctionner indépendamment
- Réutilisable entre projets

**❌ NE PAS créer si:**
- Juste une variante d'agent existant
- Tâche one-off (pas réutilisable)
- Peut être géré par Claude primaire

### Quand Diviser Agent Existant

**Signal: Agent fait >1 chose non-liée**

Exemple:
```yaml
# ❌ TROP LARGE
name: fullstack-specialist
description: Handles frontend, backend, database, deployment
```

**Solution: Diviser**
```yaml
# ✅ FOCUSED
name: frontend-specialist
description: React/Vue components, state management

name: backend-specialist
description: API routes, business logic

name: database-specialist
description: Schema, migrations, queries

name: deployment-specialist
description: CI/CD, infrastructure
```

### Versioning Agents

**Structure recommandée:**
```
.claude/agents/
├── design-specialist.md          # Current version
├── design-specialist-v1.md       # Archived
└── design-specialist-legacy.md   # Old approach
```

**Changelog dans agent file:**
```markdown
---
name: design-specialist
version: 2.0
changelog:
  - 2.0 (2025-10): Added Figma MCP integration
  - 1.5 (2025-09): WCAG 2.2 AA compliance
  - 1.0 (2025-08): Initial version
---
```

---

## 📊 MÉTRIQUES DE SUCCÈS

### Agent Performance

**Mesurer:**
- **Temps d'exécution:** Target <10 min per agent
- **Success rate:** % tasks completed without escalation
- **Handoff efficiency:** % clean handoffs (no rework)
- **Quality gates pass rate:** % first-time pass

### Workflow Performance

**Mesurer:**
- **Total workflow time:** Baseline vs optimized
- **Agent utilization:** Quels agents utilisés, fréquence
- **Bottlenecks:** Où le workflow ralentit
- **Rework rate:** % tasks nécessitant ré-exécution

---

**Version:** 1.0
**Date:** 2025-10-05
**Maintainer:** Claude Assistant + Manu
**Usage:** Guide complet maîtrise sub-agents et chaining Claude Code
