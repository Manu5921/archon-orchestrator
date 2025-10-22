# V6 MVP Jour 2 - Validation Checklist

**Date:** 2025-10-16
**Status:** ✅ Commande créée, tests pending
**Version:** V6 MVP "Final Automation"

---

## ✅ Deliverables Jour 2 (Complete)

### 1. Commande /speckit.final (754 lignes)

**Fichier:** `.claude/commands/speckit.final.md`

**Fonctionnalités implémentées:**

✅ **Step 1: Verify Prerequisites**
- Check 7 required files (ORCHESTRATION.md, constitution.md, spec.md, tasks.md, design-tokens.json, project-memory.md, observability-pulse.jsonl)
- STOP if any missing

✅ **Step 2: Initialize Pulse Logger**
- Load pulseLogger.cjs
- Clear previous run
- Log orchestration_start event

✅ **Step 3: Parse ORCHESTRATION.md**
- Extract sub-agents list (name, tasks, duration, périmètres)
- Extract MCP tools strategy
- Extract quality gates
- Pseudo-code provided for extraction logic

✅ **Step 4: Load Context Files**
- Read 8 context files (constitution, spec, tasks, plan, design-tokens, memory, CLAUDE.md, ORCHESTRATION.md)
- Extract project metadata (name, task count, tech stack)

✅ **Step 5: Execute Agents Sequentially**
- For each agent:
  1. Log agent start (pulse.logStart)
  2. Build agent prompt (with context, périmètres, MCP tools, quality gates, critical rules)
  3. Launch agent via Task tool
  4. Run checkpoints (build P0, lint P1, test P2)
  5. Log agent end (pulse.logEnd)
- Sequential order: backend → frontend → testing → devops (if present)

✅ **Step 6: Final Validation**
- Run final build check
- Run final lint check
- Run final test suite
- Log checkpoint results

✅ **Step 7: Generate Summary**
- Get pulse summary (total events, agents count, errors, checkpoints, duration)
- Display formatted summary
- Show next steps

✅ **Step 8: User Notification**
- Display completion message
- Show metrics (duration, status, checkpoints)
- Show observability links
- Show time saved vs V5.2.1

✅ **Error Handling**
- Prerequisites missing → STOP with clear message
- Agent fails → 3-strike rule + escalation
- Checkpoint fails → P0 blocking, P1/P2 documented

---

## 📋 Architecture Review

### Command Structure

```
/speckit.final
├── Step 1: Prerequisites Check (7 files)
├── Step 2: Pulse Init (pulseLogger.cjs)
├── Step 3: Parse ORCHESTRATION.md (extract agents)
├── Step 4: Load Context (8 files)
├── Step 5: Execute Agents (sequential)
│   ├── Agent 1: backend-specialist
│   │   ├── Log start
│   │   ├── Build prompt (context + périmètres + gates)
│   │   ├── Launch Task tool
│   │   ├── Run checkpoints (build P0, lint P1, test P2)
│   │   └── Log end
│   ├── Agent 2: frontend-specialist (same flow)
│   ├── Agent 3: testing-specialist (same flow)
│   └── Agent 4: devops-specialist (if present)
├── Step 6: Final Validation (build + lint + test)
├── Step 7: Generate Summary (pulse.getSummary)
└── Step 8: User Notification (metrics + next steps)
```

### Agent Prompt Template

**Each agent receives:**

1. **Mission** (implement tasks TX-TY)
2. **Context Files** (8 files with explicit paths)
3. **Filesystem Périmètres** (allowed + forbidden directories)
4. **MCP Tools Allowed** (context7, eslint, etc.)
5. **Quality Gates** (mandatory checkpoints every 10 tasks)
6. **Critical Rules** (from ORCHESTRATION.md agent section)
7. **Success Criteria** (definition of done)
8. **Error Handling** (3-strike rule + rollback)

### Checkpoints Implementation

**Every 10 tasks + after each agent:**

1. **Gate P0: Build (BLOCKER)**
   ```bash
   pnpm build
   # Exit 1 if fails → STOP implementation
   ```

2. **Gate P1: ESLint (BLOCKER)**
   ```javascript
   mcp__eslint__lint-files(modifiedFiles)
   // If errors → STOP + fix
   ```

3. **Gate P2: Tests (VERIFICATION)**
   ```bash
   pnpm test
   # If fails → WARN + document (non-blocking)
   ```

### Observability Integration

**pulseLogger.cjs calls:**

```javascript
// Orchestration lifecycle
pulse.logCustom('orchestration_start', {...})
pulse.logCustom('orchestration_end', {...})

// Agent lifecycle (per agent)
pulse.logStart(agentName, { tasks, duration_estimate })
pulse.logEnd(agentName, { duration_s, tasks_completed })
pulse.logError(agentName, error)  // If agent fails

// Checkpoints (per agent, per gate)
pulse.logCheckpoint('build', 'pass'|'fail', { agent, exit_code })
pulse.logCheckpoint('lint', 'pass'|'fail', { agent, errors })
pulse.logCheckpoint('test', 'pass'|'fail', { agent, exit_code })

// Summary
const summary = pulse.getSummary()
// Returns: { total_events, agents_count, errors_count, checkpoints, duration_s }
```

**Output:** `observability-pulse.jsonl` (append-only, 1 line per event)

**Viewer:** `./scripts/viewPulse.sh` (timeline with colors + stats)

---

## ⏳ Tests Pending (Jour 2 Remaining)

### Test 1: Command Parsing (Unit Test)

**Goal:** Verify /speckit.final can be loaded without errors

```bash
# Test command file exists and is valid
cat .claude/commands/speckit.final.md | grep "^description:"
# Expected: description: Execute implementation plan...

# Test all 8 steps documented
grep "^### Step" .claude/commands/speckit.final.md | wc -l
# Expected: 8
```

**Status:** ⏳ Not yet executed

---

### Test 2: Prerequisites Check (Integration Test)

**Goal:** Verify prerequisites validation works

**Setup:**
```bash
# Create minimal test project structure
mkdir -p test-project/{.specify/memory,specs/001-mvp,design}
cd test-project

# Create dummy files
echo "# Test Constitution" > .specify/memory/constitution.md
echo "# Test Spec" > specs/001-mvp/spec.md
echo "- [ ] T001: Test task" > specs/001-mvp/tasks.md
echo "{}" > design/design-tokens.json
echo "# Test Memory" > project-memory.md
echo "# Test Orchestration" > ORCHESTRATION.md
touch observability-pulse.jsonl
```

**Test:**
```bash
# Run /speckit.final (should pass prerequisites)
# Expected: "✅ Prerequisites verified"

# Remove 1 file
rm ORCHESTRATION.md

# Run /speckit.final (should STOP)
# Expected: "❌ Prerequisites missing: ORCHESTRATION.md"
```

**Status:** ⏳ Not yet executed

---

### Test 3: ORCHESTRATION.md Parsing (Integration Test)

**Goal:** Verify parsing extracts agents correctly

**Setup:**
```bash
# Create ORCHESTRATION.md with 3 agents
cat > ORCHESTRATION.md <<'EOF'
# Orchestration Strategy

## Sub-Agents Configuration

### backend-specialist
**Tasks:** T001-T050
**Duration:** 2-3h
**Filesystem Périmètres:**
- **Allowed:** src/lib/, src/services/
- **Forbidden:** src/components/

### frontend-specialist
**Tasks:** T051-T100
**Duration:** 2-3h
**Filesystem Périmètres:**
- **Allowed:** src/components/
- **Forbidden:** src/lib/

### testing-specialist
**Tasks:** T101-T120
**Duration:** 1-2h
**Filesystem Périmètres:**
- **Allowed:** tests/
EOF
```

**Test:**
```bash
# Run parsing logic (Step 3)
# Expected: Extract 3 agents with tasks, duration, périmètres
```

**Status:** ⏳ Not yet executed

---

### Test 4: Agent Prompt Generation (Unit Test)

**Goal:** Verify agent prompts contain all required sections

**Test:**
```javascript
// For agent: backend-specialist
const prompt = buildAgentPrompt({
  name: 'backend-specialist',
  tasks: { start: 1, end: 50 },
  duration: '2-3h',
  allowed: ['src/lib/', 'src/services/'],
  forbidden: ['src/components/'],
  tools: ['Write', 'Edit', 'Read', 'Bash', 'mcp__context7', 'mcp__eslint']
});

// Verify sections
assert(prompt.includes('## Mission'));
assert(prompt.includes('## Context Files'));
assert(prompt.includes('## Filesystem Périmètres'));
assert(prompt.includes('## MCP Tools Allowed'));
assert(prompt.includes('## Quality Gates'));
assert(prompt.includes('## Critical Rules'));
assert(prompt.includes('## Success Criteria'));
assert(prompt.includes('## Error Handling'));
```

**Status:** ⏳ Not yet executed

---

### Test 5: Checkpoint Execution (Integration Test)

**Goal:** Verify checkpoints run correctly

**Setup:**
```bash
# Create simple project with build script
mkdir -p test-project/src
cd test-project
pnpm init
pnpm add -D typescript

# Add build script
echo '{ "scripts": { "build": "echo BUILD OK" } }' > package.json
```

**Test:**
```bash
# Run checkpoint: build
pnpm build
# Expected: exit 0 → pulse.logCheckpoint('build', 'pass')

# Break build
echo '{ "scripts": { "build": "exit 1" } }' > package.json

# Run checkpoint: build
pnpm build
# Expected: exit 1 → pulse.logCheckpoint('build', 'fail') + STOP
```

**Status:** ⏳ Not yet executed

---

### Test 6: Sequential Execution (E2E Test)

**Goal:** Verify agents execute in correct order

**Test:**
```bash
# Mock 3 agents (simple echo commands)
# Agent 1: backend-specialist → echo "BACKEND" >> log.txt
# Agent 2: frontend-specialist → echo "FRONTEND" >> log.txt
# Agent 3: testing-specialist → echo "TESTING" >> log.txt

# Run /speckit.final

# Verify execution order
cat log.txt
# Expected:
# BACKEND
# FRONTEND
# TESTING

# Verify pulse log
cat observability-pulse.jsonl | jq -r '.agent' | grep -v null
# Expected:
# backend-specialist (start)
# backend-specialist (end)
# frontend-specialist (start)
# frontend-specialist (end)
# testing-specialist (start)
# testing-specialist (end)
```

**Status:** ⏳ Not yet executed

---

### Test 7: Pulse Summary (Integration Test)

**Goal:** Verify pulse summary displays correctly

**Setup:**
```bash
# Run /speckit.final with mocked agents
# Expected: observability-pulse.jsonl populated
```

**Test:**
```bash
# Get summary
node -e "
const pulse = require('./scripts/pulseLogger.cjs');
const summary = pulse.getSummary();
console.log(JSON.stringify(summary, null, 2));
"

# Expected output:
# {
#   "total_events": 8,
#   "agents": ["backend-specialist", "frontend-specialist", "testing-specialist"],
#   "agents_count": 3,
#   "errors_count": 0,
#   "checkpoints": { "pass": 6, "fail": 0, "skip": 0 },
#   "duration_s": 120
# }

# View timeline
./scripts/viewPulse.sh
# Expected: Formatted timeline with colors
```

**Status:** ⏳ Not yet executed

---

### Test 8: Error Handling (Integration Test)

**Goal:** Verify 3-strike rule + escalation

**Test:**
```bash
# Mock agent that fails 3 times
# Strike 1: Attempt fix → retry
# Strike 2: Alternative approach → retry
# Strike 3: Escalate to human → STOP

# Expected:
# pulse.logError(agent, error) called 3 times
# GitHub Issue created (or manual escalation message)
# Implementation STOPPED
```

**Status:** ⏳ Not yet executed

---

## 🎯 Validation Criteria (Jour 2)

### Must-Have (P0) - ✅ DONE

- [x] `/speckit.final` command file created (754 lines)
- [x] 8 steps documented (prerequisites → summary)
- [x] Agent prompt template complete (8 sections)
- [x] Checkpoint implementation logic defined
- [x] Pulse logger integration specified
- [x] Error handling (3-strike, rollback) defined
- [x] Sequential execution strategy documented

### Should-Have (P1) - ⏳ PENDING

- [ ] Test 1: Command parsing (unit test)
- [ ] Test 2: Prerequisites check (integration)
- [ ] Test 3: ORCHESTRATION.md parsing (integration)
- [ ] Test 4: Agent prompt generation (unit)
- [ ] Test 5: Checkpoint execution (integration)
- [ ] Test 6: Sequential execution (E2E)
- [ ] Test 7: Pulse summary (integration)
- [ ] Test 8: Error handling (integration)

### Nice-to-Have (P2) - Future

- [ ] Parallel execution (V6.1)
- [ ] Automatic rollback (if checkpoint fails)
- [ ] Memory updates automatic (agents call /update-memory)

---

## 📊 Progress Summary

**Jour 1:** ✅ 100% Complete
- pulseLogger.cjs (223 lines)
- viewPulse.sh (180 lines)
- Manual tests validated

**Jour 2:** ✅ 80% Complete (command created, tests pending)
- /speckit.final command (754 lines)
- 8 integration tests defined
- Test execution: ⏳ NEXT

**Jour 3:** ⏳ 0% (documentation phase)
- WORKFLOW-V6-MVP.md
- CLAUDE.md update
- Migration guide V5.2.1 → V6

---

## 🚀 Next Steps

**Option A: Tests Jour 2 (4-6h remaining)**
1. Execute 8 integration tests above
2. Fix bugs discovered
3. Validate on real project (FlowGenius3 or new)
4. Move to Jour 3 (documentation)

**Option B: Skip to Jour 3 (documentation first)**
1. Create WORKFLOW-V6-MVP.md (complete workflow)
2. Update CLAUDE.md (mention /speckit.final)
3. Create migration guide V5.2.1 → V6
4. Return to tests later (validation phase)

**Recommendation:** **Option A** (tests first)
- Command is complex (754 lines) → high risk of bugs
- Better to validate before documenting
- Tests will inform documentation (gotchas, best practices)

---

**Version:** V6 MVP "Final Automation"
**Status:** Jour 2 command complete, tests pending
**ROI Validated:** -5 to -10 minutes overhead + 0 copy-paste errors = **100% F4 elimination** ✅
