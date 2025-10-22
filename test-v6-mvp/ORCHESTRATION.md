# Orchestration Strategy - Test V6 MVP

**Generated:** 2025-10-16
**Workflow Version:** V6 MVP (Sequential)
**Sub-Agents:** 3 (backend, frontend, testing)
**Total Tasks:** 10

---

## Sub-Agents Configuration

### backend-specialist

**Responsibilities:** API + Database + Authentication

**Tasks:** T001-T004 (40% of total)

**Duration:** 20 min (synthétique)

**Filesystem Périmètres:**
- **Allowed:** src/lib/, src/services/, src/app/api/, supabase/
- **Forbidden:** src/components/, src/app/(dashboard)/, design/, public/
- **Violation Handling:** STOP + request coordination

**MCP Tools Allowed:**
- Write, Edit, Read, Bash
- mcp__context7__resolve-library-id
- mcp__context7__get-library-docs
- mcp__eslint__lint-files

**Critical Rules:**
- ✅ Use TypeScript strict mode (no `any` without justification)
- ✅ Validate ALL inputs with Zod
- ✅ Use env variables for secrets (never hardcode)
- ❌ NO SQL injection risks (parameterized queries)
- ❌ NO hardcoded secrets

**Key Deliverables:**
1. Supabase client (src/lib/supabase.ts)
2. Auth endpoints (src/app/api/auth/)
3. /api/users endpoint (src/app/api/users/route.ts)
4. Zod validation schemas (src/lib/validation.ts)

---

### frontend-specialist

**Responsibilities:** UI Components + Pages + Client Logic

**Tasks:** T005-T008 (40% of total)

**Duration:** 20 min (synthétique)

**Filesystem Périmètres:**
- **Allowed:** src/components/, src/app/(dashboard)/, src/app/login/, src/hooks/, public/, styles/, design/
- **Forbidden:** src/lib/supabase.ts, src/services/, src/app/api/, supabase/
- **Violation Handling:** STOP + request coordination

**MCP Tools Allowed:**
- Write, Edit, Read
- mcp__context7__resolve-library-id
- mcp__context7__get-library-docs
- mcp__eslint__lint-files

**Critical Rules:**
- ✅ **ALWAYS use design-tokens.json** (read this file first!)
- ✅ CSS variables ONLY (e.g., `bg-primary-500`, NOT `bg-blue-600`)
- ✅ Accessible components (aria-labels, keyboard navigation)
- ❌ **NO hardcoded colors** (breaks Design/Dev Decoupling)
- ❌ NO inline styles (use Tailwind classes)

**Design System:**
```typescript
// ✅ CORRECT (uses tokens)
<button className="bg-primary-500 text-neutral-50 font-heading rounded-md">
  Submit
</button>

// ❌ WRONG (hardcoded color)
<button className="bg-blue-600 text-white font-sans rounded-md">
  Submit
</button>
```

**Key Deliverables:**
1. Login component (src/components/Login.tsx)
2. Dashboard component (src/components/Dashboard.tsx)
3. UserList component (src/components/UserList.tsx)
4. Tailwind config with design tokens

---

### testing-specialist

**Responsibilities:** E2E Tests + Unit Tests

**Tasks:** T009-T010 (20% of total)

**Duration:** 10 min (synthétique)

**Filesystem Périmètres:**
- **Allowed:** tests/, __tests__/, cypress/, playwright/, scripts/
- **READ-ONLY:** src/ (for analysis only)
- **Forbidden:** WRITE to src/ (except __tests__/ subdirectories)
- **Violation Handling:** Tests go in tests/, never modify source

**MCP Tools Allowed:**
- Write, Edit, Read, Bash
- mcp__context7__resolve-library-id
- mcp__context7__get-library-docs

**Critical Rules:**
- ✅ Test user flows, not implementation details
- ✅ Use realistic test data (not "test123")
- ✅ Clean up after tests (database, files)
- ❌ NO flaky tests (add waits if needed)
- ❌ NO skipped tests without justification

**Key Deliverables:**
1. Playwright E2E test - Login flow (tests/e2e/login.spec.ts)
2. Vitest unit test - API validation (tests/unit/validation.test.ts)

---

## MCP Tools Strategy

**Context7 (docs on-demand):**
- Use for: Latest API docs, breaking changes
- When: Agent needs specific library documentation
- How: Just-in-time (lazy load), not upfront

**ESLint (quality gates):**
- Use for: Inline code quality validation
- When: After each code generation batch
- How: Automatic checkpoints every 10 tasks (or after each agent)

---

## Quality Gates

**Every 10 tasks (or after each agent):**

1. **Gate P0: Build Check (BLOCKER)**
   ```bash
   pnpm build
   # Exit 1 if fails → STOP implementation
   ```

2. **Gate P1: ESLint (BLOCKER)**
   ```bash
   mcp__eslint__lint-files [modified-files]
   # If errors → Fix immediately before continuing
   ```

3. **Gate P2: Tests (VERIFICATION)**
   ```bash
   pnpm test
   # If fails → WARN + document (non-blocking for MVP)
   ```

**Final Gate (Before completion):**
```bash
pnpm build && pnpm lint && pnpm test
# All must pass
```

---

## Execution Strategy

**Sequential Execution (V6 MVP):**

```
Phase 1: backend-specialist (T001-T004)
↓ Wait for completion + checkpoints
Phase 2: frontend-specialist (T005-T008)
↓ Wait for completion + checkpoints
Phase 3: testing-specialist (T009-T010)
↓ Wait for completion + checkpoints
Final: Validation + Summary
```

**Duration:** ~50 min total (20 + 20 + 10)

---

## Error Handling

**3-Strike Rule:**
- Strike 1: Analyze error + attempt fix + retry
- Strike 2: Document in project-memory.md + alternative approach + retry
- Strike 3: ESCALATE TO HUMAN (create GitHub Issue + STOP)

**Rollback Strategy:**
If critical error breaks build:
```bash
git revert [commit-hash]
/update-memory "Rolled back [feature] due to [error]"
# Retry with different approach
```

---

## Completion Criteria

**Definition of Done:**
- ✅ All 10 tasks completed (T001-T010)
- ✅ Build passes (pnpm build → exit 0)
- ✅ ESLint clean (no errors)
- ✅ Tests pass (pnpm test)
- ✅ Design tokens used (no hardcoded colors)
- ✅ Observability complete (observability-pulse.jsonl populated)

---

**Generated by:** /speckit.agents V6 MVP
**Ready for:** /speckit.final (automated execution)
