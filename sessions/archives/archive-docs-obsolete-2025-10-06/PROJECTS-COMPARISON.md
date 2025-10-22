# 📊 Archon-Orchestrator vs Archon-Native - Comparison

**Date:** 2025-10-05
**Purpose:** Document différences entre les 2 projets Archon

---

## 🎯 RÉSUMÉ EXÉCUTIF

| Aspect | archon-orchestrator | archon-native |
|--------|---------------------|---------------|
| **Focus** | Multi-IA orchestration (Claude+Gemini+Archon) | Single-agent Spec-Kit bootstrapper |
| **Architecture** | Hybrid workflow engine + MCP servers | TypeScript project avec agents Claude Code |
| **Maturité** | Production (v1.2) | Bootstrap prototype |
| **Complexité** | Haute (25+ modules, 7 phases workflow) | Moyenne (config + agents) |
| **Documentation** | 15+ guides (AGENTIC-PATTERNS, SUB-AGENTS-MASTERY) | 5 guides (SPEC-KIT-MASTER-THREAD focus) |

---

## 📁 STRUCTURE COMPARATIVE

### archon-orchestrator (Plateforme Complète)

```
archon-orchestrator/
├── docs/                              # 15+ guides documentation
│   ├── AGENTIC-PATTERNS.md            # 🆕 v1.2 - Patterns natifs Claude 3.7
│   ├── SUB-AGENTS-MASTERY.md          # Guide complet sub-agents (2800 lines)
│   ├── SETUP-GUIDE.md                 # Setup projet + bootstrap
│   ├── WORKFLOW-GUIDE.md              # Smart Review + workflows
│   ├── GOLDEN-PATTERNS.md             # Patterns battle-tested
│   ├── TROUBLESHOOTING.md             # Diagnostic + solutions
│   ├── DOCKER-GUIDE.md                # Deployment Docker
│   └── ZERO-TRUST.md                  # Philosophie validation
├── .claude/
│   ├── context/                       # 🆕 v1.2 - Context injection
│   │   ├── templates/context-template.json
│   │   └── README.md
│   ├── hooks/
│   │   └── subagent_stop.py          # 🆕 v1.2 - Validation hook
│   └── agents/                        # Sub-agents markdown
├── .observability/                    # v1.1 - Logs + traces
│   ├── logs.ndjson
│   ├── workflows/
│   └── costs/
├── .quality-gates/                    # v1.1 - Gates validation
│   └── gates.json
├── scripts/
│   ├── prepare-agent-context.sh       # 🆕 v1.2 - Générateur contexte
│   ├── run-quality-gates.sh           # v1.1 - Runner quality gates
│   └── utils/calculate-cost.sh        # v1.1 - Calcul coûts
├── src/                               # 25+ modules JavaScript
│   ├── architecture-compliance/       # Architecture V2
│   ├── workflow/                      # Orchestration 7 phases
│   ├── agents/                        # Claude + Gemini + Archon agents
│   ├── mcp/                           # MCP tools + server
│   └── orchestrator/                  # Routing engine
├── security-system/                   # Jules Security Guardian
├── templates/                         # Architecture templates
├── knowledge-base/                    # Patterns + learning
├── connectors/                        # GitHub + Context7 MCP
├── WHATS-NEW-v1.2.md                  # 🆕 Release notes
├── WHATS-NEW-v1.1.md                  # Release notes v1.1
└── RESTART-GUIDE-COMPLET.md           # Guide restart services
```

**Caractéristiques principales:**
- **Multi-services:** Gemini Bridge (7777), Orchestra MCP (3456), Archon MCP (8051)
- **Workflow 7 phases:** Setup → Exploration → Validation → Orchestration → Execution → Review → Archival
- **Jules Security:** Background security scanning automatisé
- **Smart Review Phase 1:** Context-aware Gemini reviews
- **Architecture Compliance:** E1-E16 enforcement

---

### archon-native (Bootstrap Spec-Kit)

```
archon-native/
├── docs/
│   ├── API.md
│   └── README.md
├── .claude/
│   ├── agents/                        # Agents spécialisés générés
│   ├── hooks/                         # Python hooks
│   ├── README.md
│   ├── QUICK-SETUP.md
│   └── failure-counter.json
├── .design/                           # Design tokens
│   └── README.md
├── .specify/                          # Spec-Kit metadata
├── specs/
│   └── constitution.md                # Standards E1-E16
├── src/                               # TypeScript source
├── tests/                             # Test suites
├── scripts/                           # Automation scripts
├── logs/                              # Metrics reports
├── SPEC-KIT-MASTER-THREAD.md          # 🎯 Idées maîtresses
├── START-HERE.md                      # Point d'entrée session
├── SETUP-MCP-AGENTS.md                # Setup MCP + agents
├── BOOTSTRAP-IMPLEMENTATION-COMPLETE.md
├── DESIGN-SYSTEM-SETUP-COMPLETE.md
├── COMPLETION-SUMMARY.md
├── VALIDATION-REPORT.md
└── README.md
```

**Caractéristiques principales:**
- **Spec-Kit First:** Auto-bootstrap depuis constitution.md
- **Single Agent Focus:** spec-kit-bootstrapper qui génère autres agents
- **TypeScript Strict:** Type-safe anti-hallucination
- **GitHub Integration:** Issues tracking, PR automation
- **Chaining & Multitask:** Agent handoff + parallel execution
- **MCP Integration:** Context7 + Archon toolsets

---

## 🎯 DIFFÉRENCES CLÉS

### 1. **Objectif Principal**

**archon-orchestrator:**
- Plateforme **multi-IA orchestration** production-ready
- Collaboration Claude ↔ Gemini avec workflows complexes
- Archon MCP comme persistence layer

**archon-native:**
- **Bootstrap automatique** projets Spec-Kit
- Agent unique (spec-kit-bootstrapper) qui génère config complète
- Focus sur standards E1-E16 enforcement

---

### 2. **Innovations v1.2 (orchestrator uniquement)**

**archon-orchestrator v1.2:**
- ✅ **Agentic Patterns natifs** documentés (GATHER→ACTION→VERIFY)
- ✅ **Context Injection System** avec script auto-génération
- ✅ **SubagentStop Validation Hook** (exit codes 0/1/2)
- ✅ **Extended Context Strategy** (200K tokens embedding)
- ✅ **Observability v1.1:** NDJSON logs, workflow traces, cost tracking
- ✅ **Quality Gates v1.1:** JSON config exécutable

**archon-native:**
- Auto-bootstrap agents + hooks depuis constitution.md
- Agent chaining via Handoff rules
- Parallel task execution via [P] flags
- Dynamic agent selection via triggers

---

### 3. **Documentation**

**archon-orchestrator (15+ guides):**
- Extensive patterns documentation (AGENTIC-PATTERNS, SUB-AGENTS-MASTERY)
- Multiple workflow guides (Smart Review, MCP, Zero Trust)
- Troubleshooting complet + Docker deployment
- Release notes détaillées (WHATS-NEW-v1.1, v1.2)

**archon-native (5 guides focus):**
- SPEC-KIT-MASTER-THREAD.md = **idées maîtresses** (chaining, multitask, dynamic)
- START-HERE.md = workflow session rapide
- SETUP-MCP-AGENTS.md = configuration détaillée
- Bootstrap guides (COMPLETION-SUMMARY, VALIDATION-REPORT)

---

### 4. **Architecture Technique**

**archon-orchestrator:**
```javascript
// Multi-services architecture
Gemini Bridge (HTTP 7777) → Complex reviews 30-60s
Orchestra MCP (WebSocket 3456) → Workflow orchestration
Archon MCP (SSE 8051) → Project persistence
Jules Security (Background) → Automated scanning

// 7-phase workflow
Setup → Exploration → Validation → Orchestration
→ Execution → Review Loops → Archival
```

**archon-native:**
```typescript
// Single-process TypeScript
Claude Code + MCP Servers → Direct integration
Context7 → Context management
Archon MCP → Health checks + validation

// Bootstrap workflow
Detect constitution.md → Generate agents → Create hooks
→ Write CLAUDE.md → Self-destruct bootstrapper
```

---

### 5. **Cas d'Usage**

**archon-orchestrator - QUAND UTILISER:**
- ✅ Workflow multi-agents complexe avec review cycles
- ✅ Besoin collaboration Claude ↔ Gemini
- ✅ Smart Review context-aware nécessaire
- ✅ Projets avec multiples services orchestrés
- ✅ Production deployment avec observability complète

**archon-native - QUAND UTILISER:**
- ✅ **Nouveau projet Spec-Kit** à bootstrapper rapidement
- ✅ Besoin génération automatique agents depuis constitution.md
- ✅ Focus sur standards E1-E16 strictement
- ✅ Projet TypeScript single-agent avec chaining
- ✅ Prototypage rapide (<10 minutes setup)

---

### 6. **Commandes Clés**

**archon-orchestrator:**
```bash
# Restart complet services
cd /Users/manu/Documents/DEV/archon-orchestrator
./restart-archon-complet.sh

# Smart Review workflow
/mcp archon smart_review_workflow code="./src/auth.js"

# Context injection sub-agent
./scripts/prepare-agent-context.sh design-specialist "Create wireframes"

# Validation SubagentStop hook
echo '{"agent_name":"test","output":"**Status:** ✅"}' | \
  uv run .claude/hooks/subagent_stop.py

# Quality gates
./scripts/run-quality-gates.sh design-specialist P0
```

**archon-native:**
```bash
# Auto-bootstrap (détection automatique)
# Prerequisites: specs/constitution.md + tasks.md
@spec-kit-bootstrapper setup this project

# Vérifier MCP
/mcp context7 connection_test
/mcp archon health_check_all

# Détecter tâches parallèles
Grep "\\[P\\]" tasks.md

# Validation build
pnpm run build
pnpm run test
```

---

## 📊 MÉTRIQUES COMPARATIVES

| Métrique | archon-orchestrator | archon-native |
|----------|---------------------|---------------|
| **Lignes code** | ~15,000+ (JS + Python) | ~5,000+ (TypeScript) |
| **Fichiers documentation** | 15+ guides | 5 guides focus |
| **Services externes** | 3 (Gemini Bridge, Orchestra, Archon) | 2 (Context7, Archon) |
| **Temps setup** | 3-4 min (restart services) | <5 min (bootstrap auto) |
| **Complexité** | Haute (multi-services) | Moyenne (config + agents) |
| **Observability** | Complète (logs, traces, costs) | Basique (logs) |
| **Quality Gates** | JSON exécutable P0-P4 | Build + test only |
| **Sub-agents validation** | SubagentStop hook (v1.2) | Aucune validation automatique |
| **Context injection** | Script auto-génération (v1.2) | Manuel via prompts |

---

## 🔄 WORKFLOW COMPARATIF

### Scénario: Nouvelle Feature Authentication

**archon-orchestrator (Multi-Agent Orchestration):**
```
1. Claude primaire analyse requirements
2. /mcp archon smart_review_workflow → Gemini review context-aware
3. ./scripts/prepare-agent-context.sh design-specialist "Auth screens"
4. @design-specialist creates wireframes (avec context injection)
5. SubagentStop hook valide report format + artifacts
6. @backend-specialist implémente JWT auth
7. Gemini review cycle (score ≥85 requis)
8. Quality gates P0-P4 exécutés
9. Archon persistence + learning
```

**archon-native (Spec-Kit Bootstrap + Chaining):**
```
1. @orchestrator-specialist analyse tasks.md
2. Détecte [P] flags pour auth-related tasks
3. Parallel execution: @github-specialist + @testing-specialist + @quality-specialist
4. @github-specialist crée issues tracking
5. @testing-specialist écrit contract tests (DOIVENT échouer)
6. Implémentation code minimal pour passer tests
7. @quality-specialist valide score ≥85
8. Build + test + lint validation
```

**Différence clé:**
- **orchestrator:** Multi-IA collaboration avec reviews Gemini + context injection
- **native:** Single Claude avec chaining agents + parallel execution

---

## 🆕 INNOVATIONS UNIQUES

### archon-orchestrator UNIQUEMENT:

1. **Agentic Patterns Documentation (v1.2)**
   - GATHER → ACTION → VERIFY loops
   - Self-correction native
   - Tool orchestration optimisée
   - 200K tokens extended context

2. **Context Injection System (v1.2)**
   - Script auto-génération `.claude/context/{agent}-context.json`
   - 3 patterns: file reference, embedded summary, full embed
   - Détection auto: ADRs, modified files, quality standards

3. **SubagentStop Validation Hook (v1.2)**
   - Validation report format (Status, Summary, Artifacts)
   - Extraction artifacts automatique
   - Exit codes: 0 (success), 1 (warning), 2 (block handoff)

4. **Observability Complete (v1.1)**
   - NDJSON logs structurés (`.observability/logs.ndjson`)
   - Workflow traces complètes (`.observability/workflows/`)
   - Cost tracking per-agent (`.observability/costs/`)

5. **Quality Gates Executable (v1.1)**
   - JSON config (`.quality-gates/gates.json`)
   - Priority P0-P4 avec blocking/non-blocking
   - Runner script avec timeouts + exit codes

6. **Smart Review Phase 1**
   - Context preparation Claude (1-2ms)
   - Intelligent review Gemini (36-54s)
   - Framework-aware analysis

7. **Jules Security Guardian**
   - Background security scanning
   - 60+ vulnerability patterns
   - Automated scheduler (cron-based)

### archon-native UNIQUEMENT:

1. **Auto-Bootstrap Spec-Kit**
   - Détection `specs/constitution.md` + `tasks.md`
   - Génération automatique 5+ agents spécialisés
   - Agent `spec-kit-bootstrapper` s'auto-détruit après setup

2. **Parallel Task Execution**
   - [P] flags detection dans tasks.md
   - Task tool cascade (multiple agents même message)

3. **Agent Chaining via Handoff**
   - Explicit handoff rules dans agent markdown
   - Triggers automatiques (keywords → agents)

4. **TypeScript Strict Mode**
   - Type-safe architecture anti-hallucination
   - Compile-time validation

---

## 🎯 RECOMMANDATIONS D'USAGE

### Utiliser **archon-orchestrator** si:
- ✅ Besoin workflow multi-IA complexe (Claude + Gemini collaboration)
- ✅ Smart Review context-aware nécessaire
- ✅ Production deployment avec observability complète
- ✅ Sub-agents orchestration avec context injection
- ✅ Quality gates enforcement strict (P0-P4)
- ✅ Projets avec multiples services orchestrés

### Utiliser **archon-native** si:
- ✅ **Nouveau projet Spec-Kit** à démarrer rapidement
- ✅ Besoin auto-génération agents depuis constitution.md
- ✅ Focus sur standards E1-E16 enforcement
- ✅ Prototypage rapide (<10 minutes)
- ✅ Projet TypeScript single-agent avec chaining
- ✅ Parallel task execution via [P] flags

---

## 🔗 INTEROPÉRABILITÉ

**Peuvent-ils travailler ensemble?**

✅ **OUI - Complémentaires:**

1. **archon-native** pour bootstrap initial:
   - Génère agents + hooks + CLAUDE.md depuis constitution.md

2. **archon-orchestrator** pour production:
   - Importe agents générés par archon-native
   - Ajoute context injection (v1.2)
   - Ajoute SubagentStop validation hook (v1.2)
   - Active observability (v1.1)
   - Configure quality gates (v1.1)
   - Intègre Smart Review workflow

**Workflow recommandé:**
```bash
# Phase 1: Bootstrap avec archon-native
cd nouveau-projet
@spec-kit-bootstrapper setup this project
# → Génère .claude/agents/*.md + hooks + CLAUDE.md

# Phase 2: Production avec archon-orchestrator
cp -r archon-orchestrator/.claude/context ./     # Context injection
cp archon-orchestrator/.claude/hooks/subagent_stop.py ./.claude/hooks/
cp -r archon-orchestrator/.observability ./      # Observability
cp -r archon-orchestrator/.quality-gates ./      # Quality gates
cp archon-orchestrator/scripts/prepare-agent-context.sh ./scripts/

# Phase 3: Configuration
# Configurer .claude/settings.json avec SubagentStop hook
# Personnaliser quality gates pour agents générés
```

---

## 📈 ÉVOLUTION FUTURE

### archon-orchestrator roadmap:
- v1.3: Hook `PreAgentDelegate` (context injection auto)
- v1.3: Artifact schema validation (SubagentStop enhanced)
- v2.0: Meta-agent générant agents avec agentic patterns
- v2.0: Telemetry dashboard (Grafana/Prometheus)

### archon-native roadmap:
- Amélioration triggers automatiques
- Support plus de patterns Spec-Kit
- Integration testing avancé
- Performance benchmarking P95

---

**Version:** 1.0
**Date:** 2025-10-05
**Maintainer:** Claude Assistant + Manu

**Conclusion:** Deux projets **complémentaires** - archon-native pour bootstrap rapide, archon-orchestrator pour production industrielle avec multi-IA orchestration.
