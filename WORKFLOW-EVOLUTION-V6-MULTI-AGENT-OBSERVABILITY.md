# Workflow Evolution V6 - Multi-Agent Observability & Control

**Date:** 2025-10-15
**Status:** 🔄 Planning Phase (Based on Multi-Agent Systems Analysis)
**Inspiration:** IndyDevDan's "Three Super Agent" architecture
**Target:** Archon Orchestrator V4.1 → V6 (Parallel Observable Agents)

---

## 🎯 VISION V6

**From:** Sequential Orchestration (4-6h black box)
**To:** Parallel Observable Orchestration (real-time supervision, auto-validation)

**Core Philosophy:**
> "If you can't see what your agents are doing at scale, you can't scale your compute. When you scale compute, you scale impact."

---

## 📊 CURRENT STATE V4.1 (Baseline)

### Strengths ✅
1. **Orchestration Layer Exists** - `/speckit.agents` generates specialized prompts
2. **Agent Specialization** - backend-specialist, frontend-specialist, testing-specialist
3. **Multi-IA Planning** - `/zen-roundtable` uses Codex + Gemini + Claude
4. **Quality Gates** - P0-P4 enforced at PR stage
5. **Design Decoupling** - CSS variables abstraction (-95% merge time)

### Weaknesses ❌
1. **No Observability** - Implementation phase (3-4h) = black box
2. **No Real-Time Validation** - Tests run at end, not during implementation
3. **Implicit Agent Boundaries** - Risk of conflicts (agent A overwrites agent B's work)
4. **Sequential Execution** - Agents work one after another (slow)
5. **No Agent Self-Correction** - Errors discovered at PR, not during implementation

**ROI Lost:**
- Debugging time: +30-60 min (could be detected earlier)
- Context switching: +20 min (waiting for full completion to see results)
- Rework cost: +15% implementation time (late error detection)

---

## 🚀 TARGET STATE V6 (Transformation)

### New Capabilities ✅

1. **Live Pulse Observability**
   - Real-time agent activity log (JSONL structured)
   - Agent actions visible: tool calls, file writes, validations
   - Fast model summaries (cheap, quick overview)
   - Zero overhead (append-only file)

2. **Closed-Loop Validation**
   - Agents validate their own work during implementation
   - ACTION → VALIDATE cycles (not monolithic sprint)
   - Self-correction capability (retry until validation passes)
   - Quality gates enforced inline (not just at PR)

3. **Strict Agent Boundaries**
   - Explicit filesystem périmètre (allowed/forbidden directories)
   - Prevents conflicts (backend can't touch frontend files)
   - Non-negotiable rules in system prompts
   - Violation = mission failure (not silent overwrite)

4. **Parallel Execution** (Future V7)
   - Multiple agents working simultaneously
   - Observability enables safe parallelism
   - 3-4h implementation → 1-2h (2-3× faster)

**ROI Gained:**
- Early error detection: -70% debugging time
- Real-time supervision: -50% context switching
- Conflict prevention: -90% rework from agent collisions
- Parallelism readiness: Foundation for 2-3× speed gain

---

## 📋 IMPLEMENTATION PLAN V6

### Phase 1: Observability Infrastructure (1-2h)

**Objective:** Create "Live Pulse" logging system

**Deliverables:**
1. ✅ `src/utils/pulseLogger.cjs` - Structured event logger
2. ✅ `observability-pulse.jsonl` - Real-time agent activity log
3. ✅ Orchestrator integration - Wrap tool calls with logging
4. ✅ `.gitignore` update - Exclude logs from Git

**Technical Details:** See Opportunity 1 implementation prompt below

---

### Phase 2: Closed-Loop Validation (2-3h)

**Objective:** Enable agents to self-validate during implementation

**Deliverables:**
1. ✅ `scripts/validate-frontend-build.sh` - Frontend build check
2. ✅ `scripts/validate-backend-api.sh` - Backend API smoke test
3. ✅ `scripts/validate-tests-pass.sh` - Test suite runner
4. ✅ Modified `/speckit.agents` - Generate ACTION → VALIDATE plans

**Workflow Change:**

**BEFORE (V4.1):**
```
Phase 2: Implementation (3-4h)
→ backend-specialist completes all backend tasks
→ frontend-specialist completes all frontend tasks
→ testing-specialist completes all tests
→ PR created
→ Quality Gates P0-P4 checked (discover errors late)
```

**AFTER (V6):**
```
Phase 2: Implementation (3-4h initially, 1-2h with parallelism V7)
→ backend-specialist:
  → ACTION: Create API routes
  → VALIDATE: Run validate-backend-api.sh (pass/fail)
  → [if fail] SELF-CORRECT: Fix errors, retry VALIDATE
  → [if pass] Continue to next ACTION

→ frontend-specialist:
  → ACTION: Create UI components
  → VALIDATE: Run validate-frontend-build.sh (pass/fail)
  → [if fail] SELF-CORRECT: Fix errors, retry VALIDATE
  → [if pass] Continue to next ACTION

→ testing-specialist:
  → ACTION: Write E2E tests
  → VALIDATE: Run validate-tests-pass.sh (pass/fail)
  → [if fail] SELF-CORRECT: Fix tests, retry VALIDATE
  → [if pass] Continue to next ACTION

→ PR created (Quality Gates P0-P4 already mostly passed)
```

**Technical Details:** See Opportunity 2 implementation prompt below

---

### Phase 3: Agent Boundary Management (1h)

**Objective:** Prevent agent conflicts via explicit filesystem rules

**Deliverables:**
1. ✅ Modified `/speckit.agents` - Add PÉRIMÈTRE STRICT section to each agent prompt

**Agent Boundaries (Example):**

| Agent | Allowed Directories | Forbidden Directories |
|-------|---------------------|----------------------|
| **backend-specialist** | `src/server/`, `prisma/`, `scripts/` | `pages/`, `components/`, `public/`, `styles/` |
| **frontend-specialist** | `pages/`, `components/`, `public/`, `styles/`, `design-system/` | `src/server/`, `prisma/`, `scripts/` |
| **testing-specialist** | `tests/`, `e2e/`, `__tests__/`, `scripts/` | `pages/`, `components/`, `src/server/` (read-only OK) |
| **design-specialist** | `design-system/`, `public/assets/`, `styles/` | `src/server/`, `prisma/`, `scripts/`, `tests/` |

**Enforcement Mechanism:**
- System prompt includes explicit "PÉRIMÈTRE STRICT" section
- Violation = agent must refuse and report error
- Observability logs violations for debugging

**Technical Details:** See Opportunity 3 implementation prompt below

---

## 🛠️ IMPLEMENTATION PROMPTS

### Opportunity 1: Live Pulse Observability

**Prompt for Claude Code:**

```markdown
# Mission: Implement "Live Pulse" Observability for Multi-Agent System

## Context
Our Archon Orchestrator V4.1 currently lacks real-time visibility into agent actions during the 3-4h implementation phase. This creates a "black box" that makes debugging difficult and prevents parallelism.

## Objective
Create a structured logging system that captures every significant agent action in real-time, without adding overhead or complexity.

## Implementation Plan

### Step 1: Create Logger Utility

Create file: `src/utils/pulseLogger.cjs`

```javascript
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(process.cwd(), 'observability-pulse.jsonl');

/**
 * Logs a structured event to the observability pulse file.
 * @param {object} eventData - The data to log.
 * @param {string} eventData.agentName - The name of the agent triggering the event.
 * @param {'TOOL_CALL' | 'TOOL_RESULT' | 'AGENT_THOUGHT' | 'VALIDATION'} eventData.eventType - The type of event.
 * @param {object} eventData.details - Specific details about the event.
 * @param {'START' | 'SUCCESS' | 'ERROR' | 'SKIP'} eventData.status - The status of the event.
 */
function logPulse(eventData) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...eventData,
  };

  try {
    fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n');
  } catch (error) {
    console.error('Failed to write to pulse log:', error);
  }
}

/**
 * Clears the pulse log file (call at start of new orchestration session).
 */
function clearPulseLog() {
  try {
    if (fs.existsSync(logFilePath)) {
      fs.unlinkSync(logFilePath);
    }
  } catch (error) {
    console.error('Failed to clear pulse log:', error);
  }
}

module.exports = { logPulse, clearPulseLog };
```

### Step 2: Integrate Logger into Orchestrator

**Locate:** Main orchestrator file (likely `src/orchestrator/main.js` or similar)

**Import logger:**
```javascript
const { logPulse, clearPulseLog } = require('../utils/pulseLogger.cjs');
```

**At orchestration start:**
```javascript
// Clear previous session log
clearPulseLog();

logPulse({
  agentName: 'orchestrator',
  eventType: 'AGENT_THOUGHT',
  details: {
    message: 'Orchestration session started',
    totalAgents: agents.length,
    agentNames: agents.map(a => a.name),
  },
  status: 'START',
});
```

**Wrap each tool call:**

BEFORE:
```javascript
const toolResult = await executeTool(agent, toolCall);
```

AFTER:
```javascript
logPulse({
  agentName: agent.name,
  eventType: 'TOOL_CALL',
  details: {
    toolName: toolCall.name,
    toolArgs: JSON.stringify(toolCall.args).substring(0, 200) + '...', // Truncate for readability
  },
  status: 'START',
});

try {
  const toolResult = await executeTool(agent, toolCall);

  logPulse({
    agentName: agent.name,
    eventType: 'TOOL_RESULT',
    details: {
      toolName: toolCall.name,
      resultSummary: typeof toolResult === 'string'
        ? toolResult.substring(0, 200) + '...'
        : JSON.stringify(toolResult).substring(0, 200) + '...',
    },
    status: 'SUCCESS',
  });

  return toolResult;
} catch (error) {
  logPulse({
    agentName: agent.name,
    eventType: 'TOOL_RESULT',
    details: {
      toolName: toolCall.name,
      error: error.message,
      stack: error.stack?.substring(0, 300),
    },
    status: 'ERROR',
  });
  throw error; // Re-throw to preserve error handling logic
}
```

### Step 3: Update .gitignore

Add to `.gitignore`:
```
# Observability Logs
*-pulse.jsonl
```

### Step 4: Create Log Viewer Utility (Bonus)

Create file: `scripts/view-pulse.sh`

```bash
#!/bin/bash
# Live viewer for observability pulse log

if [ ! -f observability-pulse.jsonl ]; then
  echo "❌ No pulse log found. Run orchestration first."
  exit 1
fi

echo "📊 Live Pulse Viewer (Ctrl+C to exit)"
echo "─────────────────────────────────────"

tail -f observability-pulse.jsonl | while read line; do
  # Parse JSON and format output
  AGENT=$(echo $line | jq -r '.agentName')
  EVENT=$(echo $line | jq -r '.eventType')
  STATUS=$(echo $line | jq -r '.status')
  TIME=$(echo $line | jq -r '.timestamp' | cut -d'T' -f2 | cut -d'.' -f1)

  # Color codes
  GREEN='\033[0;32m'
  RED='\033[0;31m'
  YELLOW='\033[1;33m'
  NC='\033[0m' # No Color

  case $STATUS in
    SUCCESS) COLOR=$GREEN ;;
    ERROR) COLOR=$RED ;;
    *) COLOR=$YELLOW ;;
  esac

  echo -e "${COLOR}[$TIME]${NC} $AGENT → $EVENT ($STATUS)"
done
```

Make executable: `chmod +x scripts/view-pulse.sh`

### Step 5: Test Implementation

Run orchestration and verify `observability-pulse.jsonl` is created with structured logs.

In another terminal: `./scripts/view-pulse.sh` to see live updates.

## Success Criteria

- [ ] `observability-pulse.jsonl` created automatically at orchestration start
- [ ] Every tool call logged with START status
- [ ] Every tool result logged with SUCCESS or ERROR status
- [ ] Log viewer script works and shows real-time updates
- [ ] No performance degradation (append-only file, minimal overhead)
- [ ] Logs excluded from Git
```

---

### Opportunity 2: Closed-Loop Validation

**Prompt for Claude Code:**

```markdown
# Mission: Implement Closed-Loop Validation for Self-Correcting Agents

## Context
Currently, our agents work in a "sprint" model: complete all tasks, then check quality gates at PR stage. Errors discovered late = expensive rework.

## Objective
Transform workflow into ACTION → VALIDATE cycles where agents self-validate and self-correct during implementation.

## Implementation Plan

### Step 1: Create Validation Scripts

Create directory: `scripts/validation/`

#### File 1: `scripts/validation/validate-frontend-build.sh`

```bash
#!/bin/bash
set -e

echo "🔍 Validating Frontend Build..."

# Change to project root
cd "$(dirname "$0")/../.."

# Run build
echo "→ Running: pnpm build"
pnpm build

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ Frontend build successful"
  exit 0
else
  echo "❌ Frontend build failed (exit code: $EXIT_CODE)"
  echo "→ Check build errors above and fix TypeScript/lint issues"
  exit 1
fi
```

#### File 2: `scripts/validation/validate-backend-api.sh`

```bash
#!/bin/bash
set -e

echo "🔍 Validating Backend API..."

cd "$(dirname "$0")/../.."

# Start backend in background (if not already running)
if ! lsof -i:3333 > /dev/null; then
  echo "→ Starting backend server..."
  pnpm dev:server &
  SERVER_PID=$!
  sleep 5 # Wait for server startup
else
  echo "→ Backend already running on port 3333"
  SERVER_PID=""
fi

# Smoke test critical endpoints
echo "→ Testing /api/health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3333/api/health)

if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
  echo "✅ Backend API responding correctly"
  EXIT_CODE=0
else
  echo "❌ Backend API health check failed"
  echo "Response: $HEALTH_RESPONSE"
  EXIT_CODE=1
fi

# Cleanup
if [ ! -z "$SERVER_PID" ]; then
  kill $SERVER_PID 2>/dev/null || true
fi

exit $EXIT_CODE
```

#### File 3: `scripts/validation/validate-tests-pass.sh`

```bash
#!/bin/bash
set -e

echo "🔍 Validating Test Suite..."

cd "$(dirname "$0")/../.."

# Run tests
echo "→ Running: pnpm test"
pnpm test

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ All tests passed"
  exit 0
else
  echo "❌ Tests failed (exit code: $EXIT_CODE)"
  echo "→ Check test failures above and fix implementation"
  exit 1
fi
```

Make all executable:
```bash
chmod +x scripts/validation/*.sh
```

### Step 2: Modify Agent Prompt Generator

**Locate:** `.claude/commands/speckit.agents.md` (or similar)

**Modify:** Agent plan generation logic to include ACTION → VALIDATE structure

**BEFORE (old structure):**
```markdown
### Plan d'Exécution pour le Frontend Specialist

**Tâches:**
1. Créer composants de base (Button, Card, Input)
2. Mettre en place page principale (pages/index.tsx)
3. Implémenter formulaire de connexion
4. Intégrer avec API backend
```

**AFTER (new structure with validation):**
```markdown
### Plan d'Exécution pour le Frontend Specialist

**Objectif:** Construire interface utilisateur principale

**🔄 WORKFLOW: ACTION → VALIDATE → SELF-CORRECT (if needed)**

---

#### Étape 1: ACTION
**Agent:** frontend-specialist
**Tâches:**
- Créer composants de base (Button, Card, Input)
- Mettre en place structure page principale (pages/index.tsx)
- Configurer Tailwind CSS et design tokens

**Fichiers attendus:**
- `components/ui/Button.tsx`
- `components/ui/Card.tsx`
- `components/ui/Input.tsx`
- `pages/index.tsx`

---

#### Étape 2: VALIDATE
**Agent:** frontend-specialist
**Action:** Exécute `scripts/validation/validate-frontend-build.sh`

**Condition de succès:** Script se termine avec exit code 0

**En cas d'échec (exit code ≠ 0):**
1. Analyser logs d'erreur du build
2. Identifier fichiers problématiques
3. Corriger erreurs TypeScript/lint
4. RELANCER cette étape VALIDATE jusqu'à succès
5. ⚠️ **INTERDIT de passer à Étape 3 tant que validation échoue**

**Logging:** Utiliser `logPulse()` pour tracer tentatives de validation
```javascript
logPulse({
  agentName: 'frontend-specialist',
  eventType: 'VALIDATION',
  details: {
    script: 'validate-frontend-build.sh',
    attempt: 1, // Incrémenter à chaque retry
  },
  status: 'SUCCESS' | 'ERROR',
});
```

---

#### Étape 3: ACTION
**Agent:** frontend-specialist
**Tâches:**
- Implémenter formulaire de connexion (LoginForm.tsx)
- Créer hook personnalisé useAuth
- Intégrer avec API backend (/api/auth/login)

**Fichiers attendus:**
- `components/auth/LoginForm.tsx`
- `hooks/useAuth.ts`

---

#### Étape 4: VALIDATE
**Agent:** frontend-specialist
**Action:** Exécute `scripts/validation/validate-frontend-build.sh` (again)

**Condition de succès:** Build passe + aucune régression des composants précédents

**En cas d'échec:** Même protocole que Étape 2 (SELF-CORRECT loop)

---

**CRITICAL INSTRUCTION:**
Chaque cycle ACTION doit être immédiatement suivi de son VALIDATE correspondant.
Si VALIDATE échoue, l'agent DOIT entrer en mode SELF-CORRECT:
1. Lire logs d'erreur
2. Identifier root cause
3. Corriger fichiers problématiques
4. Relancer VALIDATE
5. Répéter jusqu'à succès (max 3 tentatives, ensuite escalader à orchestrateur)
```

**Implementation in `/speckit.agents`:**

Modify the prompt generation logic to output this ACTION → VALIDATE structure for each major task grouping (typically 2-4 files per ACTION cycle).

### Step 3: Update Orchestrator to Support Validation

**Locate:** Orchestrator main loop

**Add:** Support for validation tool calls and retry logic

```javascript
// In orchestrator loop, after tool execution
if (toolCall.name === 'run_shell_command' && toolCall.args.command.includes('validate-')) {
  const exitCode = toolResult.exitCode;

  logPulse({
    agentName: currentAgent.name,
    eventType: 'VALIDATION',
    details: {
      script: toolCall.args.command,
      exitCode: exitCode,
    },
    status: exitCode === 0 ? 'SUCCESS' : 'ERROR',
  });

  if (exitCode !== 0) {
    // Validation failed - agent should self-correct
    console.log(`⚠️  Validation failed for ${currentAgent.name}. Agent should retry.`);
  }
}
```

### Step 4: Test Implementation

1. Run orchestration on test project
2. Verify validation scripts execute at checkpoints
3. Intentionally introduce error (e.g., TypeScript error in component)
4. Verify agent detects failure and self-corrects
5. Check `observability-pulse.jsonl` logs validation events

## Success Criteria

- [ ] Validation scripts created and executable
- [ ] Agent prompts include ACTION → VALIDATE structure
- [ ] Agents execute validation scripts at checkpoints
- [ ] Validation failures logged to observability pulse
- [ ] Agents self-correct after validation failures (observable in logs)
- [ ] Overall implementation time unchanged (validation cost offset by reduced rework)
```

---

### Opportunity 3: Agent Boundary Management

**Prompt for Claude Code:**

```markdown
# Mission: Implement Strict Agent Boundaries to Prevent Conflicts

## Context
Currently, agent boundaries are implicit ("backend agent works on backend"). This is insufficient for AI - explicit filesystem rules are needed to prevent conflicts (Agent A overwriting Agent B's work).

## Objective
Add explicit PÉRIMÈTRE STRICT section to each agent's system prompt, defining allowed/forbidden directories with zero ambiguity.

## Implementation Plan

### Step 1: Define Agent Boundaries

Create reference document: `docs/AGENT-BOUNDARIES-V6.md`

```markdown
# Agent Filesystem Boundaries - Archon Orchestrator V6

## Philosophy
Implicit boundaries cause conflicts. Explicit boundaries enable safe parallelism.

## Agent Périmètres

### Backend Specialist
**Role:** API routes, database, business logic

**ALLOWED (Read + Write):**
- `src/server/`
- `prisma/`
- `scripts/` (backend-specific scripts only)

**ALLOWED (Read-Only):**
- `specs/` (reference)
- `.env.example` (reference)

**FORBIDDEN (Zero Access):**
- `pages/`
- `components/`
- `public/`
- `styles/`
- `design-system/`
- `tests/e2e/` (testing-specialist manages)

**Validation:** If instructed to modify forbidden file, agent MUST refuse and report error.

---

### Frontend Specialist
**Role:** UI components, pages, client-side logic

**ALLOWED (Read + Write):**
- `pages/`
- `components/`
- `public/` (assets)
- `styles/`
- `design-system/`
- `hooks/` (client-side hooks only)
- `utils/client/` (client utilities only)

**ALLOWED (Read-Only):**
- `specs/` (reference)
- `src/server/types/` (API types for TypeScript)

**FORBIDDEN (Zero Access):**
- `src/server/`
- `prisma/`
- `scripts/` (except frontend build scripts)
- `tests/` (testing-specialist manages)

**Validation:** If instructed to modify forbidden file, agent MUST refuse and report error.

---

### Testing Specialist
**Role:** Test suites, E2E tests, test infrastructure

**ALLOWED (Read + Write):**
- `tests/`
- `e2e/`
- `__tests__/`
- `scripts/validation/`
- `playwright.config.ts`
- `vitest.config.ts`

**ALLOWED (Read-Only):**
- `src/server/` (to test API)
- `pages/` (to test UI)
- `components/` (to test components)

**FORBIDDEN (Write):**
- `src/server/` (can read for testing, cannot modify implementation)
- `pages/` (can read for testing, cannot modify implementation)
- `components/` (can read for testing, cannot modify implementation)
- `prisma/` (cannot modify schema)

**Special Rule:** Can create mock data in `tests/fixtures/` but cannot modify production code.

---

### Design Specialist
**Role:** Design system, tokens, visual assets

**ALLOWED (Read + Write):**
- `design-system/`
- `public/assets/`
- `styles/` (design tokens, global styles)
- `design-tokens.json`

**ALLOWED (Read-Only):**
- `components/` (to verify design token usage)
- `specs/` (to reference design requirements)

**FORBIDDEN (Zero Access):**
- `src/server/`
- `prisma/`
- `scripts/`
- `tests/`
- `pages/` (cannot modify page logic)
- `components/` (cannot modify component logic, only verify token usage)

**Special Rule:** Can only modify `components/` if fixing design token references (e.g., changing hardcoded `bg-blue-600` to `bg-primary-600`). Cannot modify component logic or behavior.
```

### Step 2: Modify Agent Prompt Generator

**Locate:** `.claude/commands/speckit.agents.md`

**Add:** PÉRIMÈTRE STRICT section to each agent's generated prompt

**Example for Frontend Specialist:**

BEFORE:
```markdown
### Prompt for frontend-specialist

**Mission:** Construire interface utilisateur réactive et moderne en utilisant React et Tailwind CSS.

**Tech Stack:**
- Framework: Next.js 14
- UI: React + Tailwind CSS + shadcn/ui
- State: TanStack Query
- Forms: React Hook Form + Zod

**Design Tokens:**
Utiliser UNIQUEMENT les CSS variables définies dans design-tokens.json. Ne JAMAIS hardcoder de couleurs.

...
```

AFTER:
```markdown
### Prompt for frontend-specialist

**Mission:** Construire interface utilisateur réactive et moderne en utilisant React et Tailwind CSS.

---

## ⚠️ PÉRIMÈTRE STRICT (Règle Non Négociable)

**ZONES AUTORISÉES (Read + Write):**
Tu as le droit de lire, écrire et modifier des fichiers **UNIQUEMENT** dans les répertoires suivants:
- `pages/`
- `components/`
- `public/` (assets uniquement)
- `styles/`
- `design-system/`
- `hooks/` (client-side hooks uniquement)
- `utils/client/` (client utilities uniquement)

**ZONES LECTURE SEULE:**
Tu peux LIRE ces fichiers pour référence, mais INTERDICTION FORMELLE de les modifier:
- `specs/` (documentation de référence)
- `src/server/types/` (types API pour TypeScript)

**ZONES INTERDITES (Zero Access):**
Toute tentative de lecture ou modification d'un fichier dans ces répertoires est une **VIOLATION CRITIQUE** de tes instructions:
- `src/server/` ❌
- `prisma/` ❌
- `scripts/` ❌ (sauf scripts frontend build)
- `tests/` ❌ (géré par testing-specialist)

**ENFORCEMENT:**
Si tu reçois une instruction (explicite ou implicite) qui te demande de modifier un fichier en dehors de ton périmètre autorisé:
1. ⛔ **REFUSE** d'exécuter cette instruction
2. 📢 **REPORTE** immédiatement à l'orchestrateur via logPulse:
   ```javascript
   logPulse({
     agentName: 'frontend-specialist',
     eventType: 'AGENT_THOUGHT',
     details: {
       error: 'BOUNDARY_VIOLATION_DETECTED',
       requestedFile: '[file path]',
       reason: 'File outside authorized périmètre',
     },
     status: 'ERROR',
   });
   ```
3. ❌ **FAIL** ta mission plutôt que de violer cette règle

**Justification:** Cette règle empêche les conflits entre agents. Le backend-specialist gère `src/server/`, pas toi. Respecter les frontières = permettre le parallélisme sûr.

---

**Tech Stack:**
- Framework: Next.js 14
- UI: React + Tailwind CSS + shadcn/ui
- State: TanStack Query
- Forms: React Hook Form + Zod

**Design Tokens:**
Utiliser UNIQUEMENT les CSS variables définies dans design-tokens.json. Ne JAMAIS hardcoder de couleurs.

...
```

**Repeat this structure for:**
- `backend-specialist` (boundaries: `src/server/`, `prisma/`, `scripts/`)
- `testing-specialist` (boundaries: `tests/`, `e2e/`, read-only on implementations)
- `design-specialist` (boundaries: `design-system/`, `public/assets/`, `styles/`)

### Step 3: Add Boundary Validation to Orchestrator (Optional Enhancement)

**Locate:** Orchestrator tool execution wrapper

**Add:** Pre-execution boundary check

```javascript
// Before executing file write/edit tool
if (toolCall.name === 'write_file' || toolCall.name === 'edit_file') {
  const filePath = toolCall.args.file_path;
  const agentName = currentAgent.name;

  // Define boundaries (could be loaded from config file)
  const boundaries = {
    'frontend-specialist': {
      allowed: ['pages/', 'components/', 'public/', 'styles/', 'design-system/', 'hooks/', 'utils/client/'],
      forbidden: ['src/server/', 'prisma/', 'scripts/', 'tests/'],
    },
    'backend-specialist': {
      allowed: ['src/server/', 'prisma/', 'scripts/'],
      forbidden: ['pages/', 'components/', 'public/', 'styles/', 'design-system/'],
    },
    // ... other agents
  };

  const agentBoundaries = boundaries[agentName];

  if (agentBoundaries) {
    const isForbidden = agentBoundaries.forbidden.some(dir => filePath.includes(dir));

    if (isForbidden) {
      logPulse({
        agentName: agentName,
        eventType: 'VALIDATION',
        details: {
          error: 'BOUNDARY_VIOLATION_BLOCKED',
          file: filePath,
          message: `Agent ${agentName} attempted to modify forbidden file`,
        },
        status: 'ERROR',
      });

      throw new Error(`BOUNDARY VIOLATION: Agent ${agentName} cannot modify ${filePath}`);
    }
  }
}
```

### Step 4: Test Boundary Enforcement

1. Run orchestration with boundary-aware prompts
2. Verify agents respect their périmètres
3. Test violation detection:
   - Manually instruct frontend-specialist to modify `src/server/api.ts`
   - Verify agent refuses or orchestrator blocks
   - Check observability log for BOUNDARY_VIOLATION event

## Success Criteria

- [ ] AGENT-BOUNDARIES-V6.md document created
- [ ] All agent prompts include PÉRIMÈTRE STRICT section
- [ ] Agents refuse to modify files outside boundaries
- [ ] Orchestrator logs boundary violations (if enforcement added)
- [ ] Zero agent conflicts in test runs (no file overwrites)
```

---

## 📊 EXPECTED OUTCOMES V6

### Immediate Benefits (After Phase 1-3)

| Metric | V4.1 Baseline | V6 Target | Improvement |
|--------|---------------|-----------|-------------|
| **Debugging Time** | 30-60 min (late error discovery) | 10-20 min (early detection via observability) | **-70%** |
| **Context Switching** | 20 min (waiting for black box completion) | 5 min (real-time supervision) | **-75%** |
| **Rework from Conflicts** | 15% implementation time (agent collisions) | 1-2% (strict boundaries) | **-90%** |
| **Implementation Phase** | 3-4h (sequential) | 3-4h (same, but observable) | 0% (foundation for parallelism) |

**Total Time Saved per Project:** 45-70 min/project (~15-20% of implementation phase)

---

### Future Benefits (Phase 4: Parallelism V7)

Once observability + validation + boundaries are stable:

| Metric | V6 (Sequential Observable) | V7 (Parallel Observable) | Improvement |
|--------|----------------------------|--------------------------|-------------|
| **Implementation Phase** | 3-4h | 1.5-2h | **-50%** |
| **Total MVP Time** | 4-5h | 2.5-3.5h | **-40%** |
| **Projects/Week** | 8-12 theoretical (4-5 realistic solo) | 12-16 theoretical (6-8 realistic solo) | **+50%** |

**Prerequisite for V7:** V6 must be battle-tested on 3-5 real projects first (validate observability prevents parallelism chaos)

---

## 🎯 NEXT STEPS

### Option A: Immediate Implementation (Today)
1. Create implementation branch: `git checkout -b feature/v6-observability`
2. Execute Opportunity 1 prompt (Live Pulse) - 1-2h
3. Execute Opportunity 2 prompt (Closed-Loop Validation) - 2-3h
4. Execute Opportunity 3 prompt (Agent Boundaries) - 1h
5. Test on simple project (todo app) - 1h
6. Merge to main if successful

**Total Time:** 5-7h (one work day)

---

### Option B: Deferred to Next Project (Test V5 First)
1. Complete next new project using Dynamic Memory V5
2. Validate V5 infrastructure (project-memory.md auto-generation)
3. Collect feedback on what observability would help most
4. Implement V6 based on real pain points discovered

**Advantage:** V6 optimizations informed by V5 real-world experience

---

## 📚 RELATED DOCUMENTATION

- **Inspiration:** IndyDevDan "Three Super Agent" video (multi-agent orchestration + observability)
- **Current Workflow:** `WORKFLOW-FINAL-V4-MULTI-DEVICE.md`
- **Dynamic Memory:** `INTEGRATION-DYNAMIC-MEMORY-V5-SUMMARY.md`
- **Patterns:** `docs/GOLDEN-PATTERNS.md`
- **Session:** `NEXT-SESSION-AGENDA.md`

---

**Document Created:** 2025-10-15
**Status:** Ready for Implementation (Awaiting User Decision: Option A or B)
**Expected Impact:** -15-20% implementation time (V6), -40% total MVP time (V7 with parallelism)

*"If you can't see what your agents are doing at scale, you can't scale your compute."* 🚀👁️
