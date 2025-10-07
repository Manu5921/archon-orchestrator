# 🤖 Agentic Patterns - Claude 3.7 Native Capabilities

**Version:** 1.0
**Date:** 2025-10-05
**Objectif:** Exploiter les capacités agentic natives de Claude 3.7 Sonnet pour workflows multi-agents performants.

---

## 📚 TABLE DES MATIÈRES

1. [Comprendre Agentic Capabilities](#comprendre-agentic-capabilities)
2. [Agentic Loop Pattern](#agentic-loop-pattern)
3. [Tool Orchestration Pattern](#tool-orchestration-pattern)
4. [Extended Context Strategy](#extended-context-strategy)
5. [Self-Correction Pattern](#self-correction-pattern)
6. [Parallel Execution Pattern](#parallel-execution-pattern)

---

## 🎯 COMPRENDRE AGENTIC CAPABILITIES

### Ce Que Claude 3.7 Fait Nativement

**Agentic = Agir de manière autonome avec boucles de feedback**

```
Traditional AI:
  User prompt → Single response → Done

Agentic AI (Claude 3.7):
  User prompt → Gather context → Take action → Verify work → Adjust if needed → Repeat
```

### Capacités Natives

| Capability | Description | Exemple Concret |
|-----------|-------------|-----------------|
| **Tool Orchestration** | Chaîne tools automatiquement | Read → Analyze → Edit → Verify (Read) |
| **Context Management** | 200K tokens + auto-compression | Garde toute conv en mémoire, synthétise si besoin |
| **Verification Loop** | Vérifie outputs automatiquement | Write fichier → Read back → Valide contenu |
| **Iterative Refinement** | Améliore jusqu'à critères atteints | Code → Test → Fix → Re-test → Repeat |
| **Parallel Processing** | Multiples tools simultanés | Read 5 files en même temps |

---

## 🔄 AGENTIC LOOP PATTERN

### Principe Fondamental

**3 phases auto-exécutées:**

```
1. GATHER → Collecter info jusqu'à compréhension complète
2. ACTION → Exécuter tâche avec vérification intégrée
3. VERIFY → Valider résultat, itérer si besoin
```

### Implémentation dans Agents

**❌ Instructions traditionnelles:**

```yaml
## Instructions
1. Read specification
2. Generate code
3. Write file
```

**✅ Instructions agentic (exploite loop natif):**

```yaml
## Instructions - Agentic Loop

### Phase 1: GATHER (Auto-loop jusqu'à compréhension ✓)

**Objective:** Full context understanding

**Process:**
1. Read primary specification file
2. **IF unclear** → Read related documentation
3. **IF missing context** → Grep codebase for patterns
4. **IF dependencies unknown** → Read package.json + imports
5. **REPEAT** until can answer:
   - What is the exact goal?
   - What are the constraints?
   - What exists already?
   - What needs to be created?

**Exit Criteria:** ✓ All questions above answerable

---

### Phase 2: ACTION (Multi-pass avec vérification)

**Objective:** Execute task correctly

**Process:**
1. Generate artifacts (code, docs, config)
2. **IMMEDIATELY** verify:
   - Read back generated files
   - Check syntax (if code)
   - Validate against requirements
3. **IF issues detected** → Self-correct immediately
4. **REPEAT** until quality criteria met

**Exit Criteria:** ✓ Artifacts valid + requirements met

---

### Phase 3: VERIFY (Comprehensive validation)

**Objective:** Ensure task complete and correct

**Process:**
1. Run quality gates (if available)
   ```bash
   ./scripts/run-quality-gates.sh {agent-name} P0
   ```
2. **IF gates fail:**
   - Analyze failure root cause
   - Fix issues
   - Re-run gates
   - **REPEAT** until all pass
3. Generate completion report with:
   - Status (✅/⚠️/❌)
   - Artifacts created
   - Metrics (time, complexity)

**Exit Criteria:** ✓ All quality gates passed OR documented blockers

---

## Best Practices

**DO:**
- ✅ Make exit criteria explicit and measurable
- ✅ Use "IF... THEN... REPEAT" structure
- ✅ Verify immediately after each action
- ✅ Document what was learned in GATHER phase

**DON'T:**
- ❌ Skip verification steps "to go faster"
- ❌ Assume understanding without reading related files
- ❌ Generate artifacts without validating them
- ❌ Exit loop before criteria met
```

---

### Exemple Concret: design-specialist

**Tâche:** Créer design tokens pour nouveau projet

```yaml
---
name: design-specialist
description: UX/UI expert with agentic workflow for design systems
model: sonnet
---

## Instructions - Agentic Loop

### Phase 1: GATHER

**Objective:** Understand project design requirements

1. **Read primary sources:**
   - constitution.md (design principles)
   - .specify/specs/*/spec.md (project requirements)
   - .design/schemas/tokens.schema.json (schema constraints)

2. **Explore existing:**
   - Check for existing `.design/tokens.json`
   - Read similar projects in `.design/patterns/`
   - Grep for color/typography references in specs

3. **Self-check questions:**
   - ✓ What is the brand identity? (from constitution)
   - ✓ What components need design? (from spec)
   - ✓ What accessibility level? (WCAG 2.2 AA assumed)
   - ✓ What breakpoints needed? (mobile-first default)

**IF any question unanswerable** → Read more files, grep patterns

**Exit:** All questions ✓

---

### Phase 2: ACTION

**Objective:** Generate valid design tokens

1. **Generate tokens.json:**
   - Use `.design/schemas/tokens-template.json` as base
   - Customize colors for brand (from constitution)
   - Define typography scale (from spec requirements)
   - Set spacing values (4px base unit)

2. **IMMEDIATE verification:**
   ```bash
   # Read back generated file
   cat .design/tokens.json

   # Validate schema
   pnpm tokens:validate
   ```

3. **IF validation fails:**
   - Read error messages carefully
   - Fix schema violations
   - Re-validate
   - **REPEAT** until validation passes

**Exit:** tokens.json exists + schema valid ✓

---

### Phase 3: VERIFY

**Objective:** Ensure tokens production-ready

1. **Run quality gates:**
   ```bash
   ./scripts/run-quality-gates.sh design-specialist P0
   ```

2. **IF gates fail:**
   - P0: tokens schema valid
     - **ACTION:** Fix schema issues (Phase 2 loop)
   - P1: visual diff ≤1%
     - **ACTION:** Adjust values, re-check

3. **Generate report:**
   ```markdown
   ## Design-Specialist Report

   **Status:** ✅ Complete

   **Summary:** Design tokens created and validated for {project-name}

   **Artifacts:**
   - `.design/tokens.json` (150 lines, schema valid ✓)

   **Metrics:**
   - Colors defined: 12 (primary, accent, semantic)
   - Typography scales: 6 (xs, sm, base, lg, xl, 2xl)
   - Spacing values: 8 (following 4px base)

   **Quality Gates:**
   - P0: Schema validation ✅
   - P1: Ready for Tailwind generation ✅

   **Next Steps:**
   - Run `pnpm tokens:apply` to generate Tailwind config
   - Handoff to orchestrator for implementation planning
   ```

**Exit:** Report complete + gates passed ✓
```

---

## 🛠️ TOOL ORCHESTRATION PATTERN

### Principe: Chaîner Tools Intelligemment

**Claude 3.7 peut orchestrer tools en séquence OU parallèle:**

```
Séquentiel:
  Read(spec.md) → Analyze → Edit(code.ts) → Read(code.ts) → Validate

Parallèle:
  Read(file1) + Read(file2) + Read(file3) → Analyze all → Generate output
```

### Patterns d'Orchestration

#### 1. Read-Analyze-Act-Verify

**Use Case:** Modification fichiers existants

```yaml
## Tool Orchestration: Read-Analyze-Act-Verify

**Sequence:**
1. **Read** existing file
2. **Analyze** current state vs desired state
3. **Edit** with precise changes
4. **Read** back to verify changes applied
5. **IF issues** → Repeat Edit + Read

**Example:**
# 1. Read
Read src/components/Button.tsx

# 2. Analyze
Current: missing disabled state
Needed: add disabled variant

# 3. Edit
Edit src/components/Button.tsx:
  - Add disabled prop to interface
  - Add disabled styling
  - Add disabled state handling

# 4. Verify
Read src/components/Button.tsx
Check: disabled prop present? ✓
Check: disabled styles present? ✓

# 5. Validate
Bash: pnpm typecheck
Expected: 0 errors ✓
```

#### 2. Parallel-Gather-Synthesize

**Use Case:** Analyser multiple sources

```yaml
## Tool Orchestration: Parallel-Gather-Synthesize

**Sequence:**
1. **Parallel Read** all relevant files (single message, multiple tools)
2. **Synthesize** information from all sources
3. **Generate** unified output

**Example:**
# 1. Parallel Read (dans UNE SEULE réponse)
Read constitution.md
Read .specify/specs/001/spec.md
Read tasks.md
Read .design/tokens.json
Read package.json

# 2. Synthesize
Project: LocalAI SEO
Phase: Implementation
Tech: Next.js 14 + Supabase
Design: Tokens valid, 12 colors defined
Tasks: 78 total, 12 in progress

# 3. Generate
Create implementation plan based on synthesized context
```

#### 3. Iterative-Test-Fix

**Use Case:** TDD workflow

```yaml
## Tool Orchestration: Iterative-Test-Fix

**Sequence:**
1. **Write** test (failing)
2. **Bash** run test → Capture failure
3. **Edit** code to pass test
4. **Bash** re-run test
5. **IF still failing** → REPEAT Edit + Bash
6. **WHEN passing** → Move to next test

**Example:**
# Iteration 1
Write tests/auth/login.test.ts  # Failing test

Bash: pnpm test tests/auth/login.test.ts
Output: FAIL - login() is not defined

Edit src/auth/login.ts  # Implement login()

Bash: pnpm test tests/auth/login.test.ts
Output: FAIL - login() doesn't validate email

# Iteration 2
Edit src/auth/login.ts  # Add email validation

Bash: pnpm test tests/auth/login.test.ts
Output: PASS ✓

# Exit loop, next test
```

---

### Optimisations Performance

#### Batch Read Operations

**❌ Séquentiel (lent):**
```
Message 1: Read file1.ts
Message 2: Read file2.ts
Message 3: Read file3.ts
Total: 3 round-trips
```

**✅ Parallèle (rapide):**
```
Message 1:
  Read file1.ts
  Read file2.ts
  Read file3.ts
Total: 1 round-trip
```

**Dans agents:**
```yaml
## Performance: Batch Reads

When gathering context, read all files in SINGLE message:

```bash
# Instead of sequential reads:
# Read constitution.md  (message 1)
# Read spec.md          (message 2)
# Read tasks.md         (message 3)

# Do parallel batch:
Read constitution.md + spec.md + tasks.md  # Single message

# Analyze all together
# Generate response based on complete context
```
```

#### Verify After Write

**Toujours vérifier immédiatement:**

```yaml
## Pattern: Write-Verify

**DO:**
Write new-file.ts
Read new-file.ts  # Immediate verification
Check content matches intent ✓

**DON'T:**
Write new-file.ts
# Assume it worked (no verification)
# User discovers issue later
```

---

## 📦 EXTENDED CONTEXT STRATEGY

### Capacité: 200K Tokens Context

**Claude 3.7 = 200,000 tokens context window**

**Ce que ça représente:**
- ~150,000 words
- ~500 pages documentation
- ~50 fichiers code moyens
- Toute une conversation longue

### Exploiter Context comme Mémoire Partagée

**Alternative à fichiers `.claude/context/*.json`:**

**Pattern: Context Embedding in Delegation**

```yaml
## Orchestrator → Sub-Agent Delegation

**Instead of:**
@design-specialist, create wireframes.
Read context: .claude/context/design-specialist-context.json

**Try (Extended Context):**
@design-specialist, create wireframes.

**PROJECT CONTEXT (embedded):**
Name: LocalAI SEO
Phase: Design
Tech Stack: Next.js 14, Supabase, Tailwind
Git Branch: feature/auth-ui

**PREVIOUS DECISIONS:**
- ADR-001: Use Supabase for auth (security + simplicity)
- ADR-002: Tailwind for styling (design tokens integration)
- ADR-003: WCAG 2.2 AA compliance mandatory

**CURRENT STATE:**
Modified files:
- src/app/auth/page.tsx (created, empty)
- .design/tokens.json (exists, validated ✓)

Quality Standards: E5 (TDD), E10 (Design Tokens), E16 (Zero Trust)

**AVAILABLE ARTIFACTS:**
- Design tokens: .design/tokens.json (12 colors, 6 typography scales)
- Tasks: tasks.md (78 total, 12 auth-related)
- Constitution: constitution.md (design principles defined)

**CONSTRAINTS:**
- Must use tokens.json colors (no hardcoded values)
- Accessibility: WCAG 2.2 AA minimum
- Responsive: mobile-first (360px, 768px, 1024px+ breakpoints)

**YOUR TASK:**
Create wireframes for authentication screens:
1. Login (email + password + "Forgot password" link)
2. Signup (email + password + confirm + terms checkbox)
3. Password Reset (email input + instructions)

Include ASCII wireframes for all 3 breakpoints.
```

**Avantages:**
- ✅ Sub-agent reçoit TOUT le contexte needed
- ✅ Pas de fichier externe à gérer
- ✅ 200K tokens = largement suffisant
- ✅ Auto-compression si trop (Claude gère)

**Inconvénient:**
- ⚠️ Context pas réutilisable (recréé chaque fois)

**SOLUTION HYBRIDE:** Fichier `.claude/context/*.json` + Embed summary dans prompt

```yaml
@design-specialist, create wireframes.

**Quick Context:** Read `.claude/context/design-specialist-context.json`

**Key Points (summary):**
- Project: LocalAI SEO (Next.js 14 + Supabase)
- Phase: Design (post /specify)
- Constraints: WCAG 2.2 AA, design tokens only, mobile-first
- Available: tokens.json validated, constitution.md, tasks.md

**Full details in context file above.**
```

---

### Auto-Compression

**Claude 3.7 compresse automatiquement si contexte approche limite:**

```
0-150K tokens: Full context retained
150K-180K: Start summarizing old messages
180K-200K: Aggressive compression, keep essentials only
```

**Pattern: Trust Auto-Compression**

```yaml
## Instructions - Long Conversations

**Don't worry about context limits:**
- I automatically summarize when needed
- Essential info is preserved
- You can keep providing full context

**Best practice:**
- Provide complete context upfront
- Reference key decisions explicitly
- Repeat critical constraints in each phase

**Example:**
Phase 1 (0-50K tokens): Full context
Phase 2 (50-100K): I remember Phase 1 + new context
Phase 3 (100-150K): I remember key decisions + new context
Phase 4 (150K+): Auto-compression kicks in, essentials kept
```

---

## 🔧 SELF-CORRECTION PATTERN

### Principe: Détecter et Corriger Automatiquement

**Claude 3.7 peut se corriger sans intervention humaine**

```
Action → Detect issue → Analyze root cause → Fix → Verify fix → Continue
```

### Implémentation

```yaml
## Instructions - Self-Correction Protocol

**After ANY action, self-check:**

1. **Syntax Check (if code):**
   ```bash
   # After Write/Edit code:
   Immediately run typecheck/lint

   IF errors detected:
     - Read error messages carefully
     - Identify exact issue location
     - Fix in same response
     - Re-check
     - REPEAT until clean
   ```

2. **Logic Check:**
   - Does output match requirements?
   - Are all edge cases handled?
   - Is naming consistent?

   IF issues found:
     - Document what's wrong
     - Fix immediately
     - Verify fix addresses root cause

3. **Quality Check:**
   ```bash
   # Run available quality gates
   ./scripts/run-quality-gates.sh {agent-name} P0

   IF gates fail:
     - Analyze failure reason
     - Fix issue
     - Re-run gates
     - REPEAT until pass
   ```

**Exit criteria:** All checks pass ✓
```

### Exemple: testing-specialist

```yaml
---
name: testing-specialist
description: TDD specialist with self-correction loop
---

## Instructions - Self-Correcting TDD

### Test Generation with Verification

1. **Write test:**
   ```typescript
   // tests/utils/format.test.ts
   describe('formatCurrency', () => {
     it('formats USD correctly', () => {
       expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56')
     })
   })
   ```

2. **IMMEDIATE verification:**
   ```bash
   # Run test (should fail - TDD)
   pnpm test tests/utils/format.test.ts
   ```

3. **Self-check:**
   - ✓ Test fails as expected (no implementation yet)
   - ✓ Error message clear: "formatCurrency is not defined"
   - ✓ Test syntax valid (no TypeError)

4. **IF test has syntax errors:**
   ```bash
   Output: SyntaxError: Unexpected token

   # Self-correction:
   - Read error line number
   - Fix syntax issue
   - Re-run test
   - REPEAT until test runs (even if fails logically)
   ```

5. **Implement to pass:**
   ```typescript
   export function formatCurrency(amount: number, currency: string) {
     return new Intl.NumberFormat('en-US', {
       style: 'currency',
       currency
     }).format(amount)
   }
   ```

6. **Verify implementation:**
   ```bash
   pnpm test tests/utils/format.test.ts

   Expected: PASS ✓

   IF FAIL:
     - Analyze failure reason
     - Fix implementation
     - Re-run
     - REPEAT until PASS
   ```

**Exit:** Test passing ✓
```

---

## ⚡ PARALLEL EXECUTION PATTERN

### Capacité: Multiple Tool Calls Simultanés

**Claude 3.7 peut appeler plusieurs tools en une seule réponse:**

```
Single Response:
  Tool1 + Tool2 + Tool3 (parallel)
  ↓
  Results available simultaneously
  ↓
  Analyze all together
```

### Use Cases

#### 1. Multi-File Analysis

```yaml
## Pattern: Parallel File Reading

**Scenario:** Analyze feature spread across multiple files

**Sequential (slow):**
Message 1: Read src/components/Button.tsx
Message 2: Read src/components/Button.test.tsx
Message 3: Read src/styles/button.css
Total: 3 round-trips

**Parallel (fast):**
Message 1:
  Read src/components/Button.tsx
  Read src/components/Button.test.tsx
  Read src/styles/button.css
Total: 1 round-trip

**Analysis:** All files in memory, cross-reference instantly
```

#### 2. Independent Validations

```yaml
## Pattern: Parallel Quality Gates

**Scenario:** Run multiple independent checks

**Implementation:**
Single message with multiple Bash calls:
  Bash: pnpm typecheck
  Bash: pnpm lint
  Bash: pnpm test:unit
  Bash: pnpm build

**Results:** All available simultaneously

**Analysis:**
IF any fail → Prioritize by severity
  - typecheck fail → Fix types first (blocks others)
  - lint fail → Fix after types (doesn't block)
  - test fail → Fix logic
  - build fail → Usually consequence of above

**Self-correction:** Fix in priority order
```

#### 3. Artifact Creation

```yaml
## Pattern: Parallel File Generation

**Scenario:** Create multiple related files

**Implementation:**
Single message:
  Write src/components/Button.tsx
  Write src/components/Button.test.tsx
  Write src/components/Button.stories.tsx
  Write src/styles/button.module.css

**Verification (also parallel):**
  Read src/components/Button.tsx
  Read src/components/Button.test.tsx
  Read src/components/Button.stories.tsx
  Read src/styles/button.module.css

**Check:** All files created ✓, content correct ✓
```

---

### Performance Guidelines

```yaml
## When to Parallelize

**DO parallel:**
- ✅ Reading multiple independent files
- ✅ Running independent validations
- ✅ Creating multiple unrelated artifacts
- ✅ Checking multiple conditions

**DON'T parallel:**
- ❌ Sequential dependencies (Edit needs Read first)
- ❌ Order matters (test after implementation)
- ❌ Shared state mutations (race conditions)

**Example DON'T:**
# BAD - parallel edit of same file
Edit file.ts (change A)
Edit file.ts (change B)  # Conflict!

# GOOD - sequential
Edit file.ts (change A + change B in same edit)
```

---

## 📊 MÉTRIQUES DE SUCCÈS

### Mesurer Efficacité Agentic Patterns

```yaml
## KPIs Recommandés

**Loop Efficiency:**
- Avg iterations per phase (target: <3)
- Time to exit criteria (target: <5 min per phase)
- Self-correction rate (% issues fixed without human)

**Tool Orchestration:**
- Tools per message (higher = better parallelization)
- Verification rate (% actions with immediate verify)
- Re-work rate (% actions needing correction)

**Context Usage:**
- Context tokens avg per workflow (track growth)
- Context compression events (should be rare)
- Context reuse (% info from previous phases used)

**Quality:**
- First-time success rate (% tasks complete without iteration)
- Quality gates pass rate (% gates passed on first run)
- Artifact accuracy (% artifacts valid without rework)
```

---

## 🎯 INTÉGRATION AGENTS EXISTANTS

### Upgrade Path

**Phase 1: Add Agentic Loop Structure**

```yaml
# Before
## Instructions
1. Read files
2. Generate output
3. Done

# After
## Instructions - Agentic Loop

### GATHER
[Explicit loop with exit criteria]

### ACTION
[With immediate verification]

### VERIFY
[Multi-pass validation]
```

**Phase 2: Add Tool Orchestration**

```yaml
## Performance Optimization

**Parallel Reads:** Read all context files in single message
**Verify After Write:** Always read back artifacts
**Batch Validations:** Run all gates simultaneously
```

**Phase 3: Exploit Extended Context**

```yaml
## Context Strategy

**Delegation:** Embed full context in prompt (200K available)
**Retention:** Trust auto-compression for long workflows
**Reference:** Repeat critical constraints each phase
```

---

## ✅ CHECKLIST AGENT AGENTIC-READY

**Agent utilise agentic patterns si:**

- [ ] Instructions ont structure GATHER → ACTION → VERIFY
- [ ] Exit criteria explicites pour chaque phase
- [ ] Vérification immédiate après chaque action
- [ ] Self-correction loops définis (IF fail → Fix → Retry)
- [ ] Tool orchestration (parallel reads, verify after write)
- [ ] Context embedding dans delegations
- [ ] Métriques trackées (iterations, time, corrections)

---

**Version:** 1.0
**Date:** 2025-10-05
**Maintainer:** Claude Assistant + Manu
**Usage:** Guide patterns agentic natifs Claude 3.7 pour agents Archon
