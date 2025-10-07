# 📋 ARCHON NATIVE - SPÉCIFICATIONS COMPLÈTES

**Version :** 2.0 (Octobre 2025)
**Projet :** Architecture Autonome Multi-Agents IA
**Status :** Spécifications Validées - Ready for Implementation

---

## 🎯 VISION ET CONTEXTE

### **Problème Résolu**

**Avant (Archon v3) :**
- Architecture complexe : 85+ fichiers custom
- Orchestration manuelle des agents
- Hallucinations IA (génération sans validation)
- Workflow opaque pour collaborateurs humains
- Maintenance coûteuse (MCP custom, sync complexe)

**Après (Archon Native) :**
- Architecture minimaliste : 2-3 scripts custom max
- Orchestration native (Task tool Claude Code 4.5)
- Zero Trust (validation systématique avec preuves)
- Traçabilité totale via GitHub
- 100% basé sur outils standards (Spec-Kit + GitHub MCP + Code Hooks)

### **Vision Révolutionnaire**

```
Spec-Kit (Planning) → Claude Code 4.5 (Execution) → GitHub (Tracking) → Gemini (Quality) → Production
```

**Innovation clé :** Exploitation maximale des capacités **natives** de Claude Code 4.5 au lieu de recoder des orchestrateurs custom.

---

## 🧩 TECHNOLOGIES VALIDÉES

### **1. Spec-Kit (GitHub Official)**

**Rôle :** Workflow de spécification structuré

**Commandes Clés :**
```bash
/constitution  # Principes projet (critères mesurables)
/specify       # Requirements détaillés
/clarify       # 5 questions ciblées (v0.0.17)
/plan          # Architecture technique
/tasks         # Liste tâches actionables
```

**Output Structure :**
```
.specify/
├── memory/constitution.md      # Garde-fous projet
└── specs/001-[feature]/
    ├── spec.md                 # Requirements
    ├── plan.md                 # Architecture
    ├── tasks.md                # 44 tâches (exemple)
    ├── data-model.md          # Schémas données
    └── contracts/
        └── api-spec.json       # Contrats API
```

**Documentation :** https://github.com/github/spec-kit

---

### **2. Code Hooks Mastery (Disler)**

**Rôle :** Contrôle déterministe de Claude Code via hooks

**8 Hooks Lifecycle Validés :**
1. `UserPromptSubmit` - Interception prompts (exit 2 = BLOCK)
2. `PreToolUse` - Validation avant exécution tool (sécurité)
3. `PostToolUse` - Actions après tool (logging, sync)
4. `Notification` - Alerts TTS (optionnel)
5. `Stop` - Completion messages AI-generated
6. `SubagentStop` - Fin sub-agent (TTS "Complete")
7. `PreCompact` - Backup avant compaction
8. `SessionStart` - Load context au démarrage

**Meta-Agent Pattern (CRITIQUE) :**
```yaml
---
name: meta-agent
description: Generates new agents from descriptions. Use proactively.
tools: Write, WebFetch, MultiEdit
model: opus
---

# Capacité :
"Create security scanner agent"
→ Génère automatiquement .claude/agents/security-scanner.md
```

**Sub-Agent Chaining Natif (Prouvé) :**
```bash
"First analyze with agent-A, then use agent-B with results"
→ Claude délègue automatiquement (cascade Task tool)
```

**Source :** `/Users/manu/Downloads/Code Hooks Mastery.txt` (7885 lignes)

---

### **3. Claude Code 4.5 (Anthropic)**

**Capacités Natives Confirmées :**

✅ **Long-Context Memory**
- Context window étendu (Sonnet 4.5)
- Garde architecture 30h+ sans "effilochage"
- File history : `~/.claude/file-history/`
- History persistence : `history.jsonl`

✅ **Hooks System**
- Config : `~/.claude/settings.json`
- Type supporté : `command` (shell scripts)
- Exit codes : 0 (success), 2 (block), other (warning)

✅ **MCP Multi-Servers**
- `enabledMcpjsonServers: ["archon", "context7", "github"]`
- Project-level : `enableAllProjectMcpServers: true`
- Transport : HTTP, Docker, WebSocket

✅ **Task Tool (Sub-Agents)**
- Types disponibles : `general-purpose`, `statusline-setup`, etc.
- Cascade : Agent peut lancer Task → Task → Task
- Délégation automatique basée sur `description`

⚠️ **Capacités NON Natives (À Implémenter) :**
- Checkpoints auto Git (faire via PreToolUse hook)
- Auto-rewind sur erreur (faire via PostToolUse hook)
- Task dependencies parsing (script minimal)

**Version :** Claude Code 2.0.5

---

### **4. GitHub MCP Server (GitHub Official)**

**Rôle :** Automation GitHub complète via MCP

**Toolsets Disponibles (Noms Officiels CORRECTS) :**
```javascript
const githubToolsets = [
  "repos",              // ✅ (pas "repositories")
  "orgs",               // ✅ (pas "organizations")
  "issues",             // ✅ Create, update, close, comment
  "pull_requests",      // ✅ Create, merge, list files
  "actions",            // ✅ Workflow runs, jobs, logs
  "code_security",      // ✅ Code scanning, secret alerts
  "dependabot",         // ✅ Dependency alerts
  "discussions",        // ✅ Create, list discussions
  "gists",              // ✅ Create, list gists
  "projects",           // ✅ Project boards
  "notifications",      // ✅ Activity notifications
  "users",              // ✅ User info
  "security_advisories",// ✅ Security reports
  "secret_protection"   // ✅ Secret scanning
];
```

**Configuration Recommandée :**
```json
{
  "mcpServers": {
    "github": {
      "name": "github",
      "transport": "docker",
      "image": "ghcr.io/github/github-mcp-server:latest",
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}",
        "GITHUB_TOOLSETS": "repos,issues,pull_requests,actions,code_security"
      }
    }
  }
}
```

**Sécurité :**
- ✅ PAT en variable environnement (jamais hard-coded)
- ✅ Scopes minimaux : `repo` (+ `read:org` si nécessaire)
- ✅ Rotation périodique (30-90 jours)
- 🎯 Production : Utiliser GitHub App (pas PAT)

**Rate Limits :**
- Authenticated : 5000 req/hour
- Actions : 1000 req/hour
- Search : 30 req/minute
- **Solution :** Rate limiter applicatif + batch operations

**Documentation :** https://github.com/github/github-mcp-server

---

### **5. Gemini Integration (Quality Gates)**

**Rôle :** Validation créative et détection anomalies

**Capacités Validées :**
- Bridge Mode : HTTP 7777 (<100ms simple requests)
- CLI Fallback : Complex orchestration (30-50s)
- Smart Review Phase 1 : Context preparation (1-2ms) + Review (6-51s)
- Quality Scoring : 0-100 avec justifications

**Utilisation :**
```bash
# Quality Gate automatique entre phases
Phase Complete → /mcp archon gemini_validate_architecture
                 Score > 85 → Continue
                 Score < 85 → Liste fixes → Agent corrige

# Security Scan
/mcp archon gemini_security_check
Vulns: 0 → Continue
Vulns > 0 → Agent fixe → Re-scan
```

**Integration Existante :** `src/agents/gemini-bridge.js` (port 7777)

---

## 🏗️ ARCHITECTURE CIBLE : ARCHON-NATIVE

### **Structure Projet Complète**

```bash
archon-native/
├── .specify/                          # Spec-Kit (source vérité planning)
│   ├── memory/
│   │   └── constitution.md            # Principes mesurables
│   └── specs/001-[feature]/
│       ├── spec.md                    # Requirements
│       ├── plan.md                    # Architecture
│       ├── tasks.md                   # Tâches actionables
│       ├── data-model.md             # Schémas
│       └── contracts/
│           └── api-spec.json          # Contrats API
│
├── .claude/                           # Claude Code config
│   ├── settings.json                  # Hooks + MCP servers
│   ├── mcp.json                       # MCP config (archon+context7+github)
│   │
│   ├── agents/                        # Auto-générés par meta-agent
│   │   ├── meta-agent.md             # ✅ Copié Code Hooks Mastery
│   │   ├── backend-specialist.md      # Généré auto depuis tasks.md
│   │   ├── nlp-specialist.md         # Généré auto
│   │   ├── testing-specialist.md     # Généré auto
│   │   ├── devops-specialist.md      # Généré auto
│   │   ├── github-sync-agent.md      # Sync tasks ↔ issues
│   │   └── ci-monitor-agent.md       # Monitor builds
│   │
│   ├── hooks/                         # ✅ Copiés Code Hooks Mastery
│   │   ├── user_prompt_submit.py     # Détecte /tasks → trigger meta-agent
│   │   ├── post_tool_use.py          # GitHub sync + logging
│   │   ├── pre_tool_use.py           # Security (block rm -rf)
│   │   ├── session_start.py          # Load specs au démarrage
│   │   ├── stop.py                   # AI completion messages
│   │   └── notification.py           # TTS alerts (optionnel)
│   │
│   ├── commands/                      # Slash commands custom
│   │   ├── orchestrate.md            # Lance workflow complet
│   │   └── github-setup.md           # Create repo + issues
│   │
│   └── output-styles/                 # ✅ Copiés Code Hooks Mastery
│       ├── table-based.md
│       └── ultra-concise.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Tests + Build
│       └── agent-monitor.yml          # Webhook → Claude notification
│
├── scripts/                           # Minimal custom (2-3 fichiers MAX)
│   ├── checkpoint-on-change.sh       # Git commit pre-tool
│   ├── parse-task-dependencies.js    # Extract deps from tasks.md
│   └── github-rate-limiter.js        # Rate limiting applicatif
│
└── logs/                              # Auto-généré par hooks
    ├── user_prompt_submit.json
    ├── post_tool_use.json
    └── chat.json                      # Transcript complet
```

---

## 🚀 WORKFLOW COMPLET END-TO-END

### **Phase 1 : Spécification (Spec-Kit - 30 min)**

```bash
# 1. Init projet
uvx --from git+https://github.com/github/spec-kit.git specify init crypto-aggregator
cd crypto-aggregator

# 2. Workflow Spec-Kit
/constitution
→ Définit principes mesurables :
  - Performance P95 < 200ms
  - Test coverage ≥ 90%
  - Security-first (parameterized queries)

/specify
→ User décrit feature complète

/clarify
→ Agent pose 5 questions ciblées
→ Résout ambiguïtés

/plan
→ Génère architecture technique
→ Stack : FastAPI + PostgreSQL + Qdrant + Ollama

/tasks
→ Génère 44 tâches actionables
→ Format : [ID] Title + Acceptance criteria + Dependencies
```

**Output :** `.specify/` complet (constitution + specs + tasks.md)

---

### **Phase 2 : Setup Archon-Native (5 min)**

```bash
# 1. Copier structure Code Hooks Mastery
cp -r ~/Downloads/disler-claude-code-hooks-mastery/.claude ./

# 2. Configurer MCP
cat > .claude/mcp.json << 'EOF'
{
  "mcpServers": {
    "archon": {
      "transport": "http",
      "url": "http://localhost:8051/mcp"
    },
    "context7": {
      "transport": "http",
      "url": "https://mcp.context7.com/mcp",
      "env": {"CONTEXT7_API_KEY": "${CONTEXT7_KEY}"}
    },
    "github": {
      "transport": "docker",
      "image": "ghcr.io/github/github-mcp-server:latest",
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}",
        "GITHUB_TOOLSETS": "repos,issues,pull_requests,actions,code_security"
      }
    }
  }
}
EOF

# 3. Personnaliser hooks pour Archon
# (Voir section Hooks Personnalisés ci-dessous)
```

---

### **Phase 3 : Auto-Génération Agents (Meta-Agent - 2 min)**

```bash
# User dit :
"Génère 4 agents spécialisés depuis tasks.md"

# Claude détecte → Délègue automatiquement à meta-agent

# Meta-agent :
1. Lit .specify/specs/001-*/tasks.md
2. Identifie domaines (backend: T005-T023, nlp: T010-T014, etc.)
3. Scrape docs : https://docs.anthropic.com/en/docs/claude-code/sub-agents
4. Génère 4 fichiers .claude/agents/*.md

# Exemple généré : backend-specialist.md
---
name: backend-specialist
description: FastAPI + PostgreSQL expert. Use proactively for backend tasks.
tools: Read, Write, Edit, Bash, Grep, Glob
model: sonnet
---

# Purpose
Execute backend tasks T005-T023 from tasks.md.

## Instructions
1. Read .specify/specs/001-*/tasks.md for assigned tasks
2. Read .specify/memory/constitution.md for constraints
3. Read .specify/specs/*/contracts/api-spec.json for API contracts
4. Execute tasks with tests (coverage ≥90%)
5. Checkpoint before major changes (git commit)
6. Return status when validated

**Best Practices :**
- API contracts compliance
- Parameterized queries (security)
- Performance P95 <200ms
```

---

### **Phase 4 : Orchestration Autonome (30h)**

**User dit simplement :**
```
"Implémente tasks.md en autonome. Respecte constitution.md.
 Quality gates Gemini entre phases. Mode 30h sans intervention."
```

**Claude fait (100% natif) :**

#### **4.1 Session Start Hook (Auto)**
```python
# .claude/hooks/session_start.py s'exécute automatiquement

1. Charge .specify/memory/constitution.md → Long-context mémoire
2. Charge .specify/specs/001-*/plan.md → Architecture
3. Charge .specify/specs/001-*/tasks.md → 44 tâches
4. Charge .specify/specs/*/contracts/ → API specs
5. Git status → État projet
6. Génère résumé dans logs/session_start.json
```

#### **4.2 GitHub Setup (GitHub MCP)**
```bash
# Claude crée automatiquement :

/mcp github create_repository \
  name="crypto-aggregator" \
  description="From Spec-Kit" \
  private=true

/mcp github push_files \
  files=".specify/*" \
  message="Initial specs"

# Convertit tasks.md → GitHub Issues (44 issues)
for task in tasks.md:
  /mcp github create_issue \
    title="[T001] Setup Docker" \
    body="Deps: None\nAcceptance: docker-compose up works" \
    labels="infrastructure,priority-high"

# Crée Project Board
/mcp github create_project \
  name="Implementation" \
  columns="Todo,In Progress,Review,Done"
```

#### **4.3 Sub-Agents Cascade (Task Tool Natif)**
```markdown
Claude (orchestrator) :
  "Je délègue aux 4 agents selon dépendances"

# Phase 1 : Infrastructure
Task(devops-specialist):
  prompt: "Execute T001-T004. Constitution: {constitution}"
  → Lit tasks.md, implémente Docker + Postgres
  → Tests : docker-compose config ✅
  → PostToolUse hook : push GitHub + close issue #1
  → Return: "Infrastructure ready ✅"

# Phase 2 : Data Layer (attend Phase 1)
Task(backend-specialist):
  prompt: "Execute T005-T008. Depends: T004. Contracts: {api-spec.json}"
  → Attend confirmation T004 via GitHub issue status
  → Implémente ORM + migrations
  → Tests : npm test data-layer ✅
  → GitHub : Create PR "feat: data layer"
  → Return: "Data layer validated ✅"

# Phase 3 : Core Logic (parallel)
Parallel:
  Task(backend-specialist): T009-T017 (API)
  Task(nlp-specialist): T010-T014 (embeddings)

→ Sync via shared .claude/instructions.md (mis à jour par hooks)
→ Chaque agent crée sa branche + PR
→ Return: "Core logic ready ✅"

# Phases 4-7 : Continue...
```

#### **4.4 Hooks Auto-Actions**
```python
# post_tool_use.py s'exécute après chaque Edit/Write

def post_tool_use(tool_name, file_path, result):
    if tool_name in ["Edit", "Write"]:
        # 1. Log modification
        log_to_json(tool_name, file_path, timestamp)

        # 2. Git checkpoint
        git_commit(f"feat: {file_path} by {agent_name}")

        # 3. Tests auto si fichier critique
        if matches_pattern("src/**/*.ts", file_path):
            test_result = run_tests(file_path)
            if test_result.failed:
                # Auto-revert (max 3 tentatives)
                if attempts < 3:
                    git_revert("HEAD~1")
                    suggest_fix_from_gemini(test_result.errors)
                else:
                    escalate_human(file_path, test_result)

        # 4. Push GitHub
        git_push()

        # 5. Update GitHub Issue
        task_id = extract_task_from_file(file_path)  # Ex: "T005"
        issue = get_issue_for_task(task_id)

        github_mcp.add_issue_comment({
            "issue": issue,
            "body": f"✅ Modified {file_path} by {agent_name}"
        })

        # 6. Monitor CI
        workflows = github_mcp.list_workflow_runs({"status": "in_progress"})
        if workflows.any_failed:
            logs = github_mcp.download_workflow_logs(workflows[0].id)
            gemini_analysis = analyze_build_failure(logs)
            auto_fix_or_escalate(gemini_analysis)
```

#### **4.5 Gemini Quality Gates (Entre Phases)**
```bash
# Automatique entre chaque phase majeure

Phase 1 Complete → Gemini Review:
  /mcp archon gemini_validate_architecture
  Criteria: scalability, architecture
  Score: 88/100 ✅ → Continue Phase 2

Phase 2 Complete → Gemini Security:
  /mcp archon gemini_security_check
  Vulns: 0 ✅ → Continue Phase 3

Phase 3 Complete → Gemini Performance:
  /mcp archon gemini_performance_analysis
  P95: 185ms < 200ms ✅ → Continue Phase 4
```

#### **4.6 CI/CD Intelligence Loop**
```bash
# Monitoring automatique GitHub Actions

[Push] Agent push code → GitHub Actions trigger

[Build Running] Claude détecte (GitHub MCP webhook)
  /mcp github list_workflow_runs status="in_progress"

[Build Fail] Claude auto-resolve:
  1. Download logs : /mcp github download_workflow_logs
  2. Gemini analyse : "Syntax error line 42"
  3. Agent corrige automatiquement
  4. Re-push → Build success ✅

[Build Success] Claude merge PR:
  /mcp github merge_pull_request pr=5 method="squash"
  /mcp github update_issue issue=5 state="closed"
```

---

### **Phase 5 : Progression Tracking (Temps Réel)**

```bash
# Logs automatiques (Code Hooks Mastery)

# Voir activité temps réel
tail -f logs/post_tool_use.json | jq '.tool_name, .file_path'
# Output:
# "Edit" "src/api/users.ts"
# "Bash" "npm test users.test.ts"
# "Write" "logs/test-results.json"

# Transcript conversation complète
cat logs/chat.json | jq '.messages[-5:] | .[].content'

# Status GitHub synchronisé
curl -H "Authorization: Bearer $GITHUB_PAT" \
  https://api.github.com/repos/user/crypto-aggregator/issues \
  | jq '.[] | {number, title, state}'

# Project Board progression
open https://github.com/user/crypto-aggregator/projects/1
# → Voir visuellement : 30/44 tasks Done
```

---

## 🛡️ GARDE-FOUS ET SÉCURITÉ

### **1. Zero Trust (Preuves Obligatoires)**

**Principe :** Jamais accepter "c'est fait" sans preuve

```bash
# ❌ INACCEPTABLE
Claude : "Le build est réussi ✅"

# ✅ ACCEPTABLE
Claude : "Le build est réussi, voici la preuve :"
→ Log complet : "BUILD SUCCESSFUL in 23s"
→ Test report : "145/145 tests passed"
→ Lint : "0 errors, 0 warnings"
```

**Implémentation via Hooks :**
```python
# stop.py hook - Validation finale
def stop_hook():
    if "done" in last_message or "complete" in last_message:
        # Exiger preuves
        proofs_required = [
            run_command("npm run build"),
            run_command("npm test"),
            run_command("npm run lint")
        ]

        if any(proof.failed for proof in proofs_required):
            print("❌ PREUVES MANQUANTES - Task NOT done")
            sys.exit(2)  # Block claim
```

---

### **2. E1-E16 Compliance (Architecture Standards)**

**Garde-fous Structurels :**

```markdown
# ✅ STRUCTURE ARCHON E1-E16 OBLIGATOIRE
projet-racine/
├── PRD.md                    # E1 - Planning
├── PROJECT_STRUCTURE.md      # E1 - Organisation
├── WORKFLOW_FOR_AI.md        # E1 - Guide IA
├── docs/ADR/                 # E1 - Décisions architecture
├── src/types/                # E2 - Types-first (anti-hallucination)
├── tests/                    # E3 - Tests-first
├── package.json
└── [code métier]

# ❌ INTERDICTIONS STRICTES
- Jamais inventer structure monorepo custom (apps/, packages/)
- Jamais ignorer types-first
- Jamais skiper tests-first
- Jamais générer sans validation Gemini préalable
```

**Validation Pre-Generation :**
```bash
# Avant toute génération de code
/mcp archon validate_e1_e16_compliance \
  structure="preview" \
  standards="strict"

# Si échec → ARRÊT + correction
# Si succès → Génération autorisée
```

---

### **3. Error Escalation (3 Tentatives → Rollback)**

**Stratégie Anti-Boucle Infinie :**

```javascript
class ErrorEscalation {
  async handleTaskFailure(task, error, attempts) {
    // Level 1 : Auto-retry (max 3)
    if (attempts < 3) {
      const geminiSuggestion = await gemini.suggestFix(error);
      await applyFix(geminiSuggestion);
      return { action: 'retry' };
    }

    // Level 2 : Rollback automatique
    if (attempts === 3) {
      await git_revert_to_last_checkpoint();
      await github_mcp.reopen_issue(task.issue_number);
      await github_mcp.add_label(task.issue_number, "needs-human-review");

      return {
        action: 'rollback',
        report: {
          task: task.id,
          error: error.message,
          attempts: 3,
          geminiAnalysis: await gemini.analyzeFailure(error),
          suggestedSpecChange: await detectSpecGap(task, error)
        }
      };
    }

    // Level 3 : Escalation humaine
    return {
      action: 'escalate_human',
      notification: `@manu Task ${task.id} échec après 3 tentatives + rollback`
    };
  }
}
```

**Hook Integration :**
```python
# post_tool_use.py
def post_tool_use(tool_name, result):
    if tool_name == "Bash" and result.exit_code != 0:
        attempts = get_task_attempts(current_task)

        if attempts >= 3:
            # Rollback auto
            run_command("git revert HEAD~1")
            escalate_to_human(current_task, result.stderr)
            sys.exit(2)  # Block further execution
```

---

### **4. Lock Fichiers (Éviter Conflits Merge)**

**Problème :** Plusieurs agents modifient même fichier → conflicts

**Solution :**
```javascript
// Lock distribué via GitHub Issues

class FileLock {
  async acquireLock(filePath, agent) {
    // Créer issue lock
    const lock = await github_mcp.create_issue({
      title: `[LOCK] ${filePath}`,
      body: `Locked by ${agent}`,
      labels: ["lock", `agent:${agent}`]
    });

    return lock.number;
  }

  async editWithLock(filePath, agent, editFn) {
    // 1. Acquire lock
    const lockIssue = await this.acquireLock(filePath, agent);

    try {
      // 2. Edit fichier
      await editFn(filePath);

      // 3. Create PR immediate
      await createPR(filePath);

      // 4. Attendre merge (max 5 min)
      await waitForMerge(timeout: 300000);

    } finally {
      // 5. Release lock
      await github_mcp.update_issue({
        issue: lockIssue,
        state: "closed"
      });
    }
  }
}

// Utilisation agent
await fileLock.editWithLock("src/api/users.ts", "backend-specialist", async (file) => {
  await edit(file, changes);
});
```

---

### **5. Rate Limiting GitHub API**

**Problème :** 44 tâches = 600+ API calls → rate limit

**Solution :**
```javascript
class GitHubRateLimiter {
  constructor() {
    this.maxCallsPerHour = 4000;  // 80% quota
    this.callWindow = [];          // timestamps
  }

  async call(operation) {
    await this.waitIfNeeded();

    // Execute
    const result = await operation();

    // Track
    this.callWindow.push(Date.now());

    return result;
  }

  async waitIfNeeded() {
    const hourAgo = Date.now() - 3600000;
    this.callWindow = this.callWindow.filter(t => t > hourAgo);

    if (this.callWindow.length >= this.maxCallsPerHour) {
      const oldestCall = this.callWindow[0];
      const waitMs = 3600000 - (Date.now() - oldestCall);

      console.log(`⏸️ Rate limit approaching, waiting ${waitMs}ms`);
      await sleep(waitMs);
    }
  }
}

// Batch operations
async function createIssuesFromTasks(tasks) {
  const limiter = new GitHubRateLimiter();
  const chunks = chunk(tasks, 10);  // 10 par batch

  for (const batch of chunks) {
    await limiter.call(async () => {
      await Promise.all(batch.map(task =>
        github_mcp.create_issue(task)
      ));
    });

    await sleep(1000);  // 1s entre batches
  }
}
```

---

### **6. Rollback Strategy Automatique**

**Scénario :** Build fail après merge → Auto-rollback

```bash
# Monitoring continu CI/CD

[Push] Agent push code → Actions trigger

[Build Fail] Claude détecte:
  1. Download logs
  2. Agent essaie fix (max 3 tentatives)

[Fix échoue 3x] Rollback automatique:
  1. git revert <commit-sha>
  2. git push --force
  3. Reopen GitHub issue originale
  4. Add label "rollback-applied"
  5. Comment issue : "Auto-rollback after 3 failed fix attempts"
  6. Notification : "@manu intervention requise"

[Humain intervient] :
  - Review logs Gemini analysis
  - Corrige spec ou code manuellement
  - Remove label "rollback-applied"
  - Agent reprend
```

**Hook Implementation :**
```python
# post_tool_use.py
def monitor_ci_after_push():
    workflow = github_mcp.list_workflow_runs({"status": "completed"})

    if workflow[0].conclusion == "failure":
        attempts = get_fix_attempts()

        if attempts >= 3:
            # Rollback
            commit = git_log("-1", "--format=%H")
            git_revert(commit)
            git_push("--force")

            github_mcp.reopen_issue(current_task.issue)
            github_mcp.add_label(current_task.issue, "rollback-applied")

            notify_human(f"Rollback applied for {current_task.id}")
```

---

## 📊 FEEDBACKS ET AJUSTEMENTS

### **Analyse ChatGPT (Validée)**

#### **✅ Points Confirmés**
1. **Nomenclature toolsets** : Utiliser `repos` (pas `repositories`), `orgs` (pas `organizations`)
2. **Sécurité PAT** : Variable env, scopes minimaux, rotation 30-90j
3. **Rate limits** : Batch operations + exponential backoff
4. **Transition progressive** : Local → One-Way → GitHub-First

#### **🆕 Ajouts Claude (vs ChatGPT)**
1. **Lock fichiers** : Via GitHub Issues (éviter conflits merge)
2. **Rollback strategy** : 3 tentatives → auto-revert + escalade
3. **Rate limiter applicatif** : Proactif (80% quota) vs réactif (backoff)
4. **GitHub App** : Production (vs PAT dev/proto)
5. **Monitoring API costs** : Dashboard calls/hour

#### **⚠️ Divergences**
- **ChatGPT recommande :** Hybride (tasks.md + GitHub) comme tremplin
- **Claude recommande :** Transition progressive (3 phases) = moins complexe

```bash
# Progression Claude (Recommandée)
Semaine 1: Local-First
  - tasks.md = source vérité
  - GitHub = CI/CD only

Semaine 2: One-Way Sync
  - tasks.md → GitHub Issues (read-only viz)
  - Agents créent PRs (pas write issues)

Semaine 3: GitHub-First
  - GitHub Issues = source vérité
  - Full autonomie agents
  - Lock + Rollback activés

# vs Hybride ChatGPT (Plus complexe)
- Double maintenance (tasks.md + GitHub)
- Sync bidirectionnel (risque désync)
- Overhead scripts
```

---

## 🎯 DÉCISIONS TECHNIQUES FINALES

### **1. Architecture Choisie : GitHub-First Progressif**

**Justification :**
- ✅ Traçabilité maximale (GitHub = audit trail)
- ✅ Collaboration transparente (humains voient progression)
- ✅ CI/CD natif (GitHub Actions)
- ✅ Jules integration (GitHub App)
- ⚠️ Transition progressive (3 phases) pour sécurité

### **2. Toolsets GitHub MCP (Liste Finale Validée)**

```bash
GITHUB_TOOLSETS="repos,issues,pull_requests,actions,code_security,dependabot"
```

**Exclus (pas nécessaires v1) :**
- `discussions` (optionnel)
- `gists` (hors scope)
- `projects` (boards manuels suffisent)
- `notifications` (webhook suffisant)
- `security_advisories` (si besoin plus tard)

### **3. Configuration MCP Finale**

```json
{
  "mcpServers": {
    "archon": {
      "name": "archon",
      "transport": "http",
      "url": "http://localhost:8051/mcp"
    },
    "context7": {
      "name": "context7",
      "transport": "http",
      "url": "https://mcp.context7.com/mcp",
      "env": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      }
    },
    "github": {
      "name": "github",
      "transport": "docker",
      "image": "ghcr.io/github/github-mcp-server:latest",
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}",
        "GITHUB_TOOLSETS": "repos,issues,pull_requests,actions,code_security,dependabot"
      }
    }
  }
}
```

### **4. Scripts Custom Minimaux (3 fichiers MAX)**

```bash
scripts/
├── checkpoint-on-change.sh       # Git commit pre-tool (via hook)
├── parse-task-dependencies.js    # Extract "Depends: T004" from tasks.md
└── github-rate-limiter.js        # Rate limiting applicatif
```

**Total LOC custom :** ~300 lignes (vs 10,000+ Archon v3)

### **5. Hooks Personnalisés Archon**

```python
# .claude/hooks/user_prompt_submit.py
# Détecte /tasks → trigger meta-agent

if "/tasks" in prompt and Path(".specify/specs").exists():
    print("🎯 Détection tasks.md → Génération agents auto")
    print("Suggéré : Déléguer à meta-agent")

# .claude/hooks/post_tool_use.py
# GitHub sync + tests auto + rollback

def post_tool_use(tool_name, file_path, result):
    # 1. Log
    log_modification(tool_name, file_path)

    # 2. Checkpoint
    if is_major_change(file_path):
        git_commit(f"checkpoint: {file_path}")

    # 3. Tests auto
    if matches_critical_pattern(file_path):
        test_result = run_tests(file_path)

        if test_result.failed:
            if attempts < 3:
                git_revert("HEAD~1")
                gemini_suggest_fix(test_result.errors)
            else:
                rollback_and_escalate()

    # 4. Push GitHub
    git_push()
    update_github_issue(file_path)

    # 5. Monitor CI
    monitor_workflow_status()
```

---

## 🗓️ ROADMAP IMPLÉMENTATION

### **Phase 1 : Setup Structure (2h)**

**Objectif :** Structure archon-native complète

```bash
# 1. Créer projet
mkdir archon-native && cd archon-native

# 2. Copier Code Hooks Mastery
cp -r ~/Downloads/disler-claude-code-hooks-mastery/.claude ./

# 3. Setup MCP config
cat > .claude/mcp.json << 'EOF'
{...config ci-dessus...}
EOF

# 4. Personnaliser hooks
# (Voir section Hooks Personnalisés)

# 5. Créer scripts minimaux
mkdir scripts
# (3 fichiers : checkpoint, dependencies, rate-limiter)
```

**Deliverable :** Projet archon-native prêt

---

### **Phase 2 : Validation Prototype (2h)**

**Objectif :** Tester workflow sur cas simple

```bash
# 1. Projet test simple
uvx specify init todo-app
/specify → /clarify → /plan → /tasks

# 2. Génération agents
"Génère 2 agents depuis tasks.md"
→ Meta-agent crée backend-specialist.md + frontend-specialist.md

# 3. Orchestration mini
"Implémente tasks.md (10 tâches)"
→ Agents travaillent
→ Mesurer : autonomie %, interventions, erreurs

# 4. Validation
- Build réussit ? ✅
- Tests passent ? ✅
- GitHub sync fonctionne ? ✅
- Rollback testé ? ✅
```

**Deliverable :** Proof of concept validé

---

### **Phase 3 : Test EventTrad (4h)**

**Objectif :** Validation sur projet réel (44 tâches)

```bash
# 1. Appliquer sur EventTrad existant
cd ~/Documents/DEV/eventtrad
cp -r ../archon-native/.claude ./

# 2. Utiliser tasks.md existant (44 tâches)
# .specify/specs/001-the-user-input/tasks.md

# 3. Lancer orchestration complète
"Implémente tasks.md avec quality gates Gemini"

# 4. Monitoring
watch cat logs/post_tool_use.json | jq '.tool_name, .file_path'
open https://github.com/user/eventtrad/issues

# 5. Métriques
- Temps total : X heures
- Autonomie : Y% (tâches sans intervention)
- Erreurs : Z count
- Rate limit hits : N
- Rollbacks : M count
```

**Deliverable :** Métriques réelles production

---

### **Phase 4 : Documentation (2h)**

**Objectif :** Guide utilisateur complet

```bash
# Créer documentation
docs/
├── QUICKSTART.md          # Setup 5 min
├── WORKFLOW.md            # Guide utilisation
├── TROUBLESHOOTING.md     # Debug commun
└── API.md                 # Hooks + MCP référence
```

**Deliverable :** Docs prêtes pour partage

---

### **Phase 5 : Production Deployment (Variables)**

**Objectif :** Migration vers GitHub App + observabilité

```bash
# 1. GitHub App (vs PAT)
- Créer GitHub App
- Permissions granulaires
- Token refresh auto

# 2. Observabilité
- Dashboard Grafana (API calls/hour)
- Alerts (rate limit 90%)
- Metrics (autonomie, rollbacks, escalations)

# 3. CI/CD production
- GitHub Actions auto-deploy
- Monitoring hooks
- Backup stratégie
```

**Deliverable :** Production-ready

---

## 📚 RÉFÉRENCES

### **Documentation Externe**

- **Spec-Kit :** https://github.com/github/spec-kit
- **GitHub MCP Server :** https://github.com/github/github-mcp-server
- **Code Hooks Mastery :** `/Users/manu/Downloads/Code Hooks Mastery.txt`
- **Claude Code Hooks :** https://docs.anthropic.com/en/docs/claude-code/hooks
- **Claude Code Sub-Agents :** https://docs.anthropic.com/en/docs/claude-code/sub-agents
- **Claude Code MCP :** https://docs.anthropic.com/en/docs/claude-code/mcp

### **Fichiers Projet Importants**

**Archon Orchestrator (projet actuel) :**
- `/Users/manu/Documents/DEV/archon-orchestrator/CLAUDE.md` - Guide E1-E16
- `/Users/manu/Documents/DEV/archon-orchestrator/README.md` - Architecture v3
- `/Users/manu/Documents/DEV/archon-orchestrator/PROMPT_REPRISE_0110.md` - Session précédente
- `/Users/manu/Documents/DEV/archon-orchestrator/src/agents/gemini-bridge.js` - Gemini integration

**EventTrad (projet test) :**
- `/Users/manu/Documents/DEV/eventtrad/specs/001-the-user-input/tasks.md` - 44 tâches

### **Sessions Précédentes**

1. **30 Sept 2025 :** Analyse Code Hooks Mastery + Meta-Agent discovery
2. **01 Oct 2025 :** Architecture Spec-Kit + Claude 4.5 native
3. **04 Oct 2025 :** GitHub MCP integration + feedbacks ChatGPT

---

## 🎯 MÉTRIQUES DE SUCCÈS

### **Critères Validation (KPIs)**

| Métrique | Objectif | Mesure |
|----------|----------|--------|
| **Autonomie** | ≥80% | % tâches sans intervention humaine |
| **Build Success Rate** | ≥95% | % builds passent du 1er coup |
| **Rollback Rate** | <5% | % tâches nécessitant rollback |
| **API Rate Limit** | 0 hits | Jamais atteindre 429 GitHub |
| **Error Escalation** | <10% | % tâches escaladées humain |
| **Code Quality (Gemini)** | ≥85/100 | Score moyen reviews Gemini |
| **Test Coverage** | ≥90% | Couverture tests critiques |
| **Performance** | P95 <200ms | Latence API |

### **Comparaison vs Archon v3**

| Aspect | Archon v3 | Archon Native | Gain |
|--------|-----------|---------------|------|
| **Fichiers custom** | 85+ | 3 | -96% |
| **Setup time** | 30 min | 5 min | -83% |
| **Autonomie** | 60% | 80% (objectif) | +33% |
| **Traçabilité** | Logs locaux | GitHub Issues/PRs | +100% |
| **Collaboration** | Opaque | Transparent (GitHub UI) | +∞ |
| **Maintenance** | Élevée | Minimale | -90% |

---

## ✅ CHECKLIST FINALE PRÉ-IMPLÉMENTATION

### **Setup (5 min)**
- [ ] Copier structure Code Hooks Mastery `.claude/`
- [ ] Configurer MCP servers (archon + context7 + github)
- [ ] Créer hooks personnalisés (user_prompt_submit, post_tool_use)
- [ ] Installer scripts minimaux (3 fichiers)
- [ ] Tester meta-agent fonctionnel

### **Sécurité (10 min)**
- [ ] PAT GitHub en variable env (jamais hard-coded)
- [ ] Scopes minimaux : `repo` + `read:org`
- [ ] Rate limiter configuré (80% quota)
- [ ] Lock fichiers via GitHub Issues
- [ ] Rollback strategy (3 tentatives → revert)

### **Validation (15 min)**
- [ ] Test prototype (todo-app simple)
- [ ] Agents générés par meta-agent ✅
- [ ] Cascade Task tool fonctionne ✅
- [ ] GitHub sync opérationnel ✅
- [ ] Gemini quality gates actifs ✅
- [ ] Rollback testé manuellement ✅

### **Production (30 min)**
- [ ] Test EventTrad (44 tâches réelles)
- [ ] Métriques collectées (autonomie, rollbacks, etc.)
- [ ] Documentation créée (QUICKSTART, WORKFLOW)
- [ ] Monitoring dashboard (Grafana optionnel)
- [ ] GitHub App migration (vs PAT)

---

## 🚀 PROCHAINES ÉTAPES

### **Immédiat (Aujourd'hui)**
1. ✅ SPECS.md créé (ce fichier)
2. ⏳ Validation structure avec user
3. ⏳ Décision : commencer implémentation ?

### **Court Terme (Cette Semaine)**
- Setup archon-native complet
- Validation prototype todo-app
- Test EventTrad 44 tâches
- Documentation complète

### **Moyen Terme (Ce Mois)**
- Migration vers GitHub App (production)
- Observabilité dashboard
- Partage communauté (template GitHub public)

### **Long Terme (Trimestre)**
- Multi-projet support
- Agent marketplace
- Custom routing rules
- Enterprise features

---

**📄 Document Version :** 2.0
**📅 Dernière Mise à Jour :** 04 Octobre 2025
**✍️ Auteurs :** Manu + Claude (Sonnet 4.5)
**📍 Localisation :** `/Users/manu/Documents/DEV/archon-orchestrator/SPECS.md`

---

*Ce document est la source de vérité unique pour le projet Archon Native. Toute modification doit être documentée ici.*
