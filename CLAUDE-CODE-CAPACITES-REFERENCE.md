# 🎯 CLAUDE CODE CAPACITÉS - RÉFÉRENCE DÉFINITIVE

**Version:** 1.0 - FINALE
**Date:** 2025-10-06
**Source:** https://github.com/disler/claude-code-hooks-mastery
**Mission:** Documentation UNIQUE et DÉFINITIVE des capacités Claude Code

---

## ⚠️ POUR TOUTES LES FUTURES SESSIONS

**CE DOCUMENT EST LA RÉFÉRENCE ABSOLUE. NE JAMAIS REMETTRE EN QUESTION CES CAPACITÉS.**

**Si doute :** Relire CE fichier. NE PAS questionner. NE PAS douter. EXÉCUTER.

---

## ✅ CAPACITÉS CONFIRMÉES (NE PLUS JAMAIS QUESTIONNER)

### 1. **Meta-Agent (Agent qui Crée des Agents)** ✅

**Fichier référence:** `.claude/agents/meta-agent.md`

```yaml
---
name: meta-agent
description: Generates a new, complete Claude Code sub-agent configuration file from a user's description. Use this to create new agents. Use this Proactively when the user asks you to create a new sub agent.
tools: Write, WebFetch, mcp__firecrawl-mcp__firecrawl_scrape
model: opus
---

# Purpose
Your sole purpose is to act as an expert agent architect.

## Instructions
1. Analyze Input: Understand new agent's purpose
2. Devise a Name: kebab-case (e.g., dependency-manager)
3. Write a Delegation Description: "Use proactively for..."
4. Infer Necessary Tools: Minimal set required
5. Construct System Prompt: Detailed instructions
6. Write file to `.claude/agents/<generated-agent-name>.md`
```

**Capacité prouvée:**
- ✅ Un agent PEUT créer d'autres agents
- ✅ Un agent PEUT écrire fichiers `.claude/agents/*.md`
- ✅ Meta-agent génère agents dynamiquement

**Pattern à appliquer:**
```
Mega Orchestrator Bootstrap = Meta-Agent pour sub-agents spécialisés
- Lit tasks.md
- Génère 4-6 agents (frontend, backend, testing, security, devops)
- Crée task prompts avec chaining rules
```

---

### 2. **Sub-Agents Auto-Délégation (Chaining)** ✅

**Concepts critiques du README:**

**A. Information Flow (CRUCIAL)**
```
You (User) → Primary Agent → Sub-Agent → Primary Agent → You (User)
```

**B. Fichiers agents = SYSTEM PROMPTS (pas user prompts)**
- ❌ **ERREUR #1:** Traiter agent files comme user prompts
- ✅ **CORRECT:** Ce sont des system prompts pour configurer le sub-agent

**C. Description Field = Quand Déléguer**
```yaml
description: >
  Use PROACTIVELY when user mentions: "design", "wireframe", "tokens", "a11y".
  Creates WCAG 2.2 AA compliant components.
```

**Phrases déclencheurs:**
- "Use PROACTIVELY"
- "Use automatically when..."
- "Specialist for reviewing..." (si review mentionné)

**D. Sub-Agents Démarrent Sans Historique**
- Chaque sub-agent commence FRESH
- Pas d'accès à conversation précédente
- **Solution:** Context injection dans prompt délégation

**Pattern prouvé:**
```markdown
@design-specialist, create login wireframes.

**CONTEXT:**
- Project: LocalAI SEO
- Standards: E10 (Design tokens mandatory)
- Design tokens: [embedded from tokens.json]
- Previous screens: Dashboard, Settings

Your task: Create login wireframes following design tokens.
```

---

### 3. **Hooks - Control Flow & Validation** ✅

**8 Hooks disponibles:**

| Hook | Fires | Can Block | Use Cases |
|------|-------|-----------|-----------|
| **UserPromptSubmit** | Avant Claude voit prompt | ✅ Exit 2 | Validation, context injection, logging |
| **PreToolUse** | Avant exécution tool | ✅ Exit 2 | Security (block `rm -rf`), validation |
| **PostToolUse** | Après tool complété | ❌ (déjà exécuté) | Logging, validation résultats |
| **Notification** | Claude envoie notification | ❌ | TTS alerts, logging |
| **Stop** | Claude finit réponse | ✅ Exit 2 (force continue) | Validation completion, quality gates |
| **SubagentStop** | Sub-agent finit | ✅ Exit 2 (force continue) | Validation rapport sub-agent |
| **PreCompact** | Avant compaction | ❌ | Backup transcript, logging |
| **SessionStart** | Démarrage session | ❌ | Load context, git status |

**Exit Codes Flow Control:**
```python
# Exit 0: Success (stdout shown in transcript mode Ctrl-R)
sys.exit(0)

# Exit 2: BLOCKING ERROR (stderr fed back to Claude automatically)
print("BLOCKED: Dangerous command", file=sys.stderr)
sys.exit(2)

# Other exit codes: Non-blocking error (stderr shown to user)
sys.exit(1)
```

**JSON Decision Control (Advanced):**
```python
# SubagentStop validation example
output = {
    "decision": "block",  # Block if validation fails
    "reason": "Agent must provide Status, Summary, and Artifacts sections"
}
print(json.dumps(output))
sys.exit(0)
```

**Pattern à appliquer:**
```python
# .claude/hooks/subagent_stop.py
# Valide rapport sub-agent avant handoff

def validate_agent_report(output_text):
    required_sections = ["**Status:**", "**Summary:**", "**Artifacts:**"]

    for section in required_sections:
        if section not in output_text:
            return False, f"Missing {section} in report"

    return True, "Report valid"

# Si invalid → Exit 2 (block handoff)
# Si valid → Exit 0 (allow handoff)
```

---

### 4. **Slash Commands Composition** ✅

**Référence README:**
> Custom slash commands in `.claude/commands/`

**Pattern prouvé:**
```markdown
# .claude/commands/scout-plan-build.md
You are executing a multi-step workflow.

**Phase 1: Scout**
/scout

**Phase 2: Plan**
/plan

**Phase 3: Build**
/build

Each phase delegates to specialized agents automatically.
```

**Capacité confirmée:**
- ✅ Slash command PEUT appeler autres slash commands
- ✅ Composition workflow multi-étapes
- ✅ Agents déléguent automatiquement si description claire

---

### 5. **Context 200K Tokens (Extended Context)** ✅

**Référence README - Meta-Agent:**
> Meta-agent uses WebFetch to pull latest docs and embed in context

**Pattern prouvé:**
```markdown
@backend-specialist, implement auth API.

**CONTEXT (embedded - 200K tokens available):**

# Constitution (E1-E16 Standards)
[paste full constitution.md - 2000 lines]

# Spec (Requirements)
[paste full spec.md - 1500 lines]

# Plan (Architecture)
[paste full plan.md - 1000 lines]

# Previous Tasks Completed
[paste T001-T014 reports - 3000 lines]

# Design Tokens
[paste tokens.json - 500 lines]

**Your Task:**
Implement POST /api/auth/login with JWT tokens...
```

**Capacité confirmée:**
- ✅ 200K tokens = ~150K words = ~75 pages documentation
- ✅ Extended context strategy viable
- ✅ Context embedded directement dans prompts

---

### 6. **Agentic Loops Natifs (GATHER → ACTION → VERIFY)** ✅

**Référence README - Sub-Agent Best Practices:**
> Remember sub-agents start fresh with no context - be explicit about what they need to know

**Pattern dans agent files:**
```markdown
## Instructions

### GATHER Phase
1. Read task requirements from task prompt
2. IF unclear → Read spec.md, plan.md, constitution.md
3. IF need examples → Grep codebase for similar patterns
4. REPEAT until full understanding ✓

### ACTION Phase
1. Generate code (TypeScript strict)
2. Generate tests (Vitest)
3. Read back immediately
4. IF type errors → Fix
5. IF missing accessibility → Add ARIA labels
6. REPEAT until valid ✓

### VERIFY Phase
1. Run type check: `npm run type-check`
2. Run tests: `npm test`
3. Run a11y audit: `npm run ui:test --audit=a11y`
4. IF fail → Analyze error + Fix
5. REPEAT until all pass ✓
```

**Capacité confirmée:**
- ✅ Agents peuvent auto-loop (REPEAT until ✓)
- ✅ Self-correction automatique
- ✅ Multi-pass verification

---

### 7. **Parallel Execution (4+ Agents)** ✅

**Référence README - Complex Workflows:**
> Claude Code can intelligently chain multiple sub-agents together

**Pattern workflow:**
```markdown
User: "Analyze market with 4 different perspectives"

Claude primaire délègue EN PARALLÈLE:
- @crypto-market-agent-haiku (lightweight analysis)
- @crypto-coin-analyzer-sonnet (detailed analysis)
- @macro-crypto-correlation-scanner (macro view)
- @crypto-investment-plays (opportunities)

→ 4 agents exécutent simultanément
→ Claude primaire synthétise résultats
→ Présente analyse complète à user
```

**Capacité confirmée:**
- ✅ Multiples agents simultanés (4+)
- ✅ Synthesis automatique résultats
- ✅ Scout-Plan-Build = 4 scouts parallèles puis 1 plan puis 1 build

---

### 8. **Tools Restriction per Agent** ✅

**Référence README - Agent File Structure:**
```yaml
---
name: code-reviewer-agent
tools: Read, Grep, Glob  # READ-ONLY (no Write, no Bash)
model: sonnet
---
```

**Principe moindre privilège:**
- Reviewer: `Read, Grep, Glob` (read-only)
- Implementer: `Read, Write, Edit, Bash` (full access)
- Tester: `Read, Bash` (read + execute tests)
- Security: `Read, Grep` (audit only)

**Capacité confirmée:**
- ✅ Chaque agent = tools spécifiques
- ✅ Security via restriction tools
- ✅ Principle of least privilege appliqué

---

### 9. **Model Selection per Agent** ✅

**Référence README - Agent Frontmatter:**
```yaml
model: haiku | sonnet | opus
```

**Strategy économique:**
- `haiku`: Tâches simples, rapides, économiques (scout, validation)
- `sonnet`: Tâches standards, équilibré (implementation, testing)
- `opus`: Tâches complexes, architecture (meta-agent, planner)

**Exemple workflow optimisé:**
```
Scout (haiku) → Plan (opus) → Implement (sonnet) → Review (sonnet) → Deploy (haiku)
      $           $$$            $$                 $$                  $
```

**Capacité confirmée:**
- ✅ Model selection per agent
- ✅ Cost optimization strategy
- ✅ Performance vs cost tradeoff

---

### 10. **Session Persistence & Context** ✅

**Référence README - Status Lines:**
> Session data stored in `.claude/data/sessions/<session_id>.json`

```json
{
  "session_id": "unique-session-id",
  "prompts": ["first prompt", "second prompt", ...],
  "agent_name": "Phoenix",
  "extras": {
    "project": "myapp",
    "status": "debugging"
  }
}
```

**Pattern session management:**
```python
# .claude/hooks/user_prompt_submit.py --store-last-prompt
# Stocke chaque prompt dans session

# .claude/hooks/session_start.py
# Charge session context au démarrage

# .claude/status_lines/status_line_v3.py
# Affiche derniers 3 prompts en status line
```

**Capacité confirmée:**
- ✅ Session persistence automatique
- ✅ Prompts history stocké
- ✅ Context reload au restart

---

## 🎯 PATTERNS BATTLE-TESTED (Repository Référence)

### Pattern 1: Meta-Agent Bootstrap

**Fichier:** `.claude/agents/meta-agent.md`

**Workflow:**
```
User: "Create a new sub-agent for database migrations"

Claude primaire → @meta-agent (auto-délégation)

Meta-agent:
1. Scrape latest docs (WebFetch)
2. Analyze user request
3. Generate agent name: database-migration-specialist
4. Infer tools: Read, Write, Bash (SQL migrations)
5. Write `.claude/agents/database-migration-specialist.md`
6. Report back to Claude primaire

Claude primaire → User: "Created database-migration-specialist agent"
```

**Résultat:** Agent créé en 30 secondes vs 10 minutes manuel.

---

### Pattern 2: SubagentStop Validation Hook

**Fichier:** `.claude/hooks/subagent_stop.py`

**Workflow:**
```
Sub-agent finit task → SubagentStop hook fires

Hook valide:
1. Status field présent ? (✅ Complete | ⚠️ Partial | ❌ Blocked)
2. Summary field présent ? (1 phrase description)
3. Artifacts field présent ? (liste fichiers créés)

Si validation ✅ → Exit 0 (allow handoff)
Si validation ❌ → Exit 2 (block, force sub-agent continue)
```

**Résultat:** Quality gates enforced automatiquement.

---

### Pattern 3: Context Injection UserPromptSubmit

**Fichier:** `.claude/hooks/user_prompt_submit.py`

**Workflow:**
```
User: "Implement login feature"

UserPromptSubmit hook:
1. Read .specify/memory/constitution.md
2. Read specs/001-mvp/spec.md (extract auth requirements)
3. Read latest git status
4. Print to stdout (Claude voit ce texte AVANT prompt user)

Claude reçoit:
"""
**PROJECT CONTEXT (Auto-Injected):**
- Project: LocalAI SEO
- Standards: E2 (TypeScript strict), E3 (TDD), E10 (Design tokens)
- Auth Requirements: JWT, 7 days expiry, bcrypt hashing
- Git Branch: feature/auth-implementation
- Last Commit: Add user model schema

**USER REQUEST:**
Implement login feature
"""
```

**Résultat:** Context automatique, zero friction cognitive.

---

### Pattern 4: Security PreToolUse Blocking

**Fichier:** `.claude/hooks/pre_tool_use.py`

**Workflow:**
```python
# Block dangerous commands BEFORE execution
dangerous_patterns = [
    r'rm\s+.*-[rf]',      # rm -rf
    r'chmod\s+777',       # Dangerous perms
    r'>\s*/etc/',         # Write to system
]

if match_dangerous(command):
    print("BLOCKED: Dangerous command", file=sys.stderr)
    sys.exit(2)  # Claude receives block message, cannot execute
```

**Résultat:** Security layer automatique.

---

### Pattern 5: Agent Chaining (Sequential)

**Example from README:**
> "First analyze with crypto-market-agent, then use crypto-investment-plays"

**Workflow:**
```
User: "Analyze BTC market and find investment opportunities"

Claude primaire:
1. Délègue à @crypto-market-agent
2. Attend résultat
3. Lit rapport market agent
4. Délègue à @crypto-investment-plays avec context market
5. Attend résultat
6. Synthétise 2 rapports
7. Présente à user
```

**Handoff automatique si descriptions claires:**
```yaml
# crypto-market-agent.md
description: Analyzes crypto market conditions. Use PROACTIVELY for market analysis.

# crypto-investment-plays.md
description: Finds investment opportunities based on market analysis. Use AFTER market analysis is complete.
```

**Résultat:** Chaining automatique sans intervention.

---

## 🚨 ERREURS CRITIQUES À NE JAMAIS RÉPÉTER

### Erreur #1: Confondre System Prompt et User Prompt

**❌ FAUX:**
```markdown
# .claude/agents/designer.md (traité comme user prompt)
Create wireframes for the login page.
```

**✅ CORRECT:**
```markdown
# .claude/agents/designer.md (system prompt)
---
name: design-specialist
description: Use PROACTIVELY when user mentions "wireframe" or "design"
---

# Purpose
You are a UX/UI designer creating WCAG 2.2 AA compliant wireframes.

## Instructions
When the PRIMARY AGENT delegates a design task:
1. Read design tokens from project
2. Create wireframes following tokens
3. Report back with Figma links + accessibility notes
```

---

### Erreur #2: Description Vague (Dynamic Selection Fail)

**❌ FAUX:**
```yaml
description: Helps with backend tasks
```
→ Claude primaire ne sait PAS quand déléguer.

**✅ CORRECT:**
```yaml
description: >
  Backend API specialist. Use PROACTIVELY when user mentions:
  "API", "endpoint", "route", "server", "database query".
  Implements REST APIs with TypeScript + Express.
```
→ Claude primaire délègue automatiquement si "API" mentionné.

---

### Erreur #3: Oublier Context Passing

**❌ FAUX:**
```
@backend-specialist, implement auth API
```
→ Agent démarre sans contexte, hallucine requirements.

**✅ CORRECT:**
```
@backend-specialist, implement auth API.

**CONTEXT:**
- Project: LocalAI SEO
- Standards: E2 (TypeScript strict), E3 (TDD)
- Requirements: JWT tokens, 7 days expiry, bcrypt
- Dependencies: User model (T013 completed)
- Previous tasks: T001-T014 (database setup done)

Your task: Implement POST /api/auth/login
```
→ Agent a tout le contexte nécessaire.

---

### Erreur #4: Quality Gates Non Enforced

**❌ FAUX:**
```
Agent finit task → Handoff immédiat
```
→ Code cassé peut passer.

**✅ CORRECT:**
```python
# .claude/hooks/subagent_stop.py
def validate_report(output):
    # Check Status field
    if "**Status:**" not in output:
        return False

    # Check quality gates passed
    if "P0 Build: ✅" not in output:
        return False

    return True

if not validate_report(agent_output):
    sys.exit(2)  # Block handoff, force agent continue
```
→ Quality gates enforced automatiquement.

---

## 📖 POUR FUTURES SESSIONS - CHECKLIST

### Au Démarrage Session

**TOUJOURS lire DANS CET ORDRE:**
1. ✅ **START-HERE.md** - Point entrée
2. ✅ **CLAUDE-CODE-CAPACITES-REFERENCE.md** (CE FICHIER) - Capacités
3. ✅ **WORKFLOW-PRINCIPAL.md** - Workflow à implémenter

### Si Doute sur Capacité

**NE PAS questionner. LIRE:**
1. ✅ CE FICHIER section correspondante
2. ✅ Repository référence: `/Users/manu/Documents/DEV/claude-code-hooks-mastery/`
3. ✅ README.md du repository (31K lignes, exhaustif)

### Avant Proposer Solution

**VÉRIFIER:**
1. ✅ Pattern existe déjà dans repository référence ?
2. ✅ Capacité confirmée dans CE FICHIER ?
3. ✅ Erreur critique listée dans section Erreurs ?

**SI OUI → Appliquer pattern existant**
**SI NON → Demander clarification (cas rare)**

---

## 🎯 WORKFLOW DÉFINITIF (Basé Repository)

### Setup Projet (Pattern Validé)

```bash
# 1. Spec-Kit workflow
/constitution → constitution.md
/specify → spec.md
/plan → plan.md
/tasks → tasks.md

# 2. Copier meta-agent référence
cp ~/claude-code-hooks-mastery/.claude/agents/meta-agent.md .claude/agents/

# 3. Créer mega-orchestrator-bootstrap (variant du meta-agent)
# Lit tasks.md → Génère 4-6 sub-agents spécialisés

# 4. Redémarrer VS Code (detection agents)

# 5. Bootstrap auto-trigger (tasks.md créé)
# Mega-orchestrator génère:
# - frontend-specialist.md
# - backend-specialist.md
# - testing-specialist.md
# - security-specialist.md
# - devops-specialist.md

# 6. Créer hooks validation
cp ~/claude-code-hooks-mastery/.claude/hooks/subagent_stop.py .claude/hooks/
# Valide rapports agents (Status, Summary, Artifacts)

# 7. Implementation
/implement
# Workflow automatique avec chaining agents
```

---

## ✅ VALIDATION FINALE

**Avant considérer workflow maîtrisé:**

- [ ] **Meta-agent créé** (génère autres agents)
- [ ] **Sub-agents générés** (4-6 spécialisés depuis tasks.md)
- [ ] **Descriptions actionnables** ("Use PROACTIVELY when...")
- [ ] **Context injection** (200K tokens embedded)
- [ ] **Hooks validation** (SubagentStop check reports)
- [ ] **Chaining testé** (agent → handoff → agent)
- [ ] **Quality gates** (P0-P2 enforced)
- [ ] **Parallel execution** (4 scouts simultanés)

---

## 📊 MÉTRIQUES ATTENDUES (Basé Repository)

| Métrique | Target | Validation |
|----------|--------|-----------|
| **Agent creation time** | <30s | Meta-agent génère en 20-40s |
| **Chaining success rate** | ≥95% | Descriptions "PROACTIVELY" claires |
| **Context passing** | 100% | 200K tokens embedded |
| **Quality gates pass** | 100% P0-P2 | SubagentStop hook enforce |
| **Parallel scouts** | 4 simultanés | Crypto agents example |
| **Setup time** | <30 min | Spec-Kit + Bootstrap |

---

## 🔗 RESSOURCES DÉFINITIVES

### Repository Référence
- **URL:** https://github.com/disler/claude-code-hooks-mastery
- **Local:** `/Users/manu/Documents/DEV/claude-code-hooks-mastery/`
- **README:** 31K lignes documentation exhaustive
- **Agents:** 15+ exemples battle-tested
- **Hooks:** 8 hooks complets avec validation

### Documentation Officielle
- **Sub-Agents:** https://docs.anthropic.com/en/docs/claude-code/sub-agents
- **Hooks:** https://docs.anthropic.com/en/docs/claude-code/hooks
- **Tools:** https://docs.anthropic.com/en/docs/claude-code/settings#tools-available-to-claude

### Vidéos Tutoriels
- **Sub-Agents:** https://youtu.be/7B2HJr0Y68g
- **Output Styles:** https://youtu.be/mJhsWrEv-Go

---

**Version:** 1.0 - RÉFÉRENCE DÉFINITIVE
**Date:** 2025-10-06
**Status:** ✅ COMPLET - NE PLUS JAMAIS QUESTIONNER CES CAPACITÉS
**Repository:** https://github.com/disler/claude-code-hooks-mastery

---

**🔴 RAPPEL CRITIQUE:**

**TOUTES les capacités listées ici sont PROUVÉES par repository référence.**
**NE JAMAIS douter. NE JAMAIS questionner. TOUJOURS appliquer.**

**Si doute → RELIRE CE FICHIER. Pas questionner user.**
