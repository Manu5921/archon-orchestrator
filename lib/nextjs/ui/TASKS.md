# Phase 2 UI - Implementation Tasks

**Version:** V7.0 Phase 2
**Date:** 2025-10-22
**Methodology:** TDD Light + [P] Parallelization
**Total Tasks:** 30
**Estimated Duration:** 7h (with parallelization gains)

---

## Phase 1: Setup (1h)

**Goal:** Create base structure + design system foundation

- [ ] T001 Create lib/nextjs/ui directory structure (15 min)
- [ ] T002 [P] Create design-tokens.json - Extended with 8 color scales (30 min)
- [ ] T003 [P] Create tailwind.preset.js - Map tokens to Tailwind config (20 min)
- [ ] T004 Create globals.css - CSS variables from starter (30 min)

**Checkpoint:** Design system files exist, JSON valid, CSS compiles

---

## Phase 2: Foundational - shadcn/ui Base (1h30) ⚠️ MUST COMPLETE BEFORE PHASE 3

**Goal:** Fork existing components + add new via shadcn CLI

### Fork Existing (30 min)

- [ ] T005 [P] Fork button.tsx from starter (verify CSS variables)
- [ ] T006 [P] Fork input.tsx from starter
- [ ] T007 [P] Fork card.tsx from starter
- [ ] T008 [P] Fork label.tsx from starter
- [ ] T009 [P] Fork avatar.tsx from starter
- [ ] T010 [P] Fork dropdown-menu.tsx from starter
- [ ] T011 [P] Fork radio-group.tsx from starter
- [ ] T012 Fork utils.ts (cn helper)

**Checkpoint:** 7 components + utils forked, imports work

### Add New Components (1h)

- [ ] T013 Setup temporary project for shadcn CLI
- [ ] T014 [P] Add form.tsx via shadcn CLI
- [ ] T015 [P] Add dialog.tsx (rename to modal.tsx)
- [ ] T016 [P] Add select.tsx via shadcn CLI
- [ ] T017 [P] Add table.tsx via shadcn CLI
- [ ] T018 [P] Add textarea.tsx via shadcn CLI

**Checkpoint:** 5 new components added, total 12 shadcn/ui components ready

---

## Phase 3: Auth Forms (1h30)

**Goal:** Create auth forms integrating lib/auth/supabase

### Implementation (1h15)

- [ ] T019 [P] [US1] SignInForm.tsx - Email/password form (30 min)
- [ ] T020 [P] [US1] SignUpForm.tsx - Registration form with validation (35 min)
- [ ] T021 [US1] ResetPasswordForm.tsx - Password reset flow (25 min)

**Checkpoint:** 3 auth forms created, integrate lib/auth/supabase/server actions

### Tests (15 min) ⚠️ AFTER IMPLEMENTATION

- [ ] T022 [P] Test: SignInForm renders and submits (5 min)
- [ ] T023 [P] Test: SignUpForm validates email format (5 min)
- [ ] T024 Test: ResetPasswordForm calls resetPassword() (5 min)

**Checkpoint:** `pnpm test auth` → All pass ✅

---

## Phase 4: Payment Components (1h)

**Goal:** Create payment components integrating lib/payments/stripe

### Implementation (45 min)

- [ ] T025 [P] [US2] PricingTable.tsx - Fork starter, FIX hardcoded colors (25 min)
- [ ] T026 [P] [US2] CheckoutButton.tsx - Stripe checkout integration (10 min)
- [ ] T027 [US2] SubscriptionStatus.tsx - Display subscription state (10 min)

**Checkpoint:** 3 payment components created, no hardcoded colors

### Tests (15 min) ⚠️ AFTER IMPLEMENTATION

- [ ] T028 [P] Test: PricingTable uses CSS variables only (5 min)
- [ ] T029 [P] Test: CheckoutButton calls createCheckoutSession() (5 min)
- [ ] T030 Test: SubscriptionStatus displays correct states (5 min)

**Checkpoint:** `pnpm test payments` → All pass ✅

---

## Phase 5: Marketing Components (45 min)

**Goal:** Generic marketing templates customizable via design-tokens.json

### Implementation (30 min)

- [ ] T031 [P] [US3] Hero.tsx - Landing hero section (10 min)
- [ ] T032 [P] [US3] Features.tsx - Features grid with icons (10 min)
- [ ] T033 [US3] CTA.tsx - Call-to-action section (10 min)

**Checkpoint:** 3 marketing components created, customizable props

### Tests (15 min) ⚠️ AFTER IMPLEMENTATION

- [ ] T034 [P] Test: Hero renders with custom props (5 min)
- [ ] T035 [P] Test: Features renders grid correctly (5 min)
- [ ] T036 Test: CTA renders button with href (5 min)

**Checkpoint:** `pnpm test marketing` → All pass ✅

---

## Phase 6: Quality Assurance (1h)

**Goal:** Validate library completeness + integration

### Audit (30 min)

- [ ] T037 Audit: Search hardcoded colors in all components (10 min)
- [ ] T038 Audit: Verify all components use CSS variables (10 min)
- [ ] T039 Audit: Check design-tokens.json → globals.css mapping (10 min)

**Checkpoint:** 0 hardcoded colors found, 100% CSS variables

### Integration Tests (30 min)

- [ ] T040 Create test project (Next.js 15 + Tailwind) (10 min)
- [ ] T041 Manual copy lib/nextjs/ui to test project (5 min)
- [ ] T042 Configure tailwind.config.js with preset (5 min)
- [ ] T043 Test: All 12 shadcn/ui components render (5 min)
- [ ] T044 Test: Design token change propagates to UI (5 min)

**Checkpoint:** Test project builds ✅, all components render ✅

---

## Phase 7: Documentation (45 min)

**Goal:** Complete setup guide + troubleshooting

- [ ] T045 Write README.md - Setup instructions (20 min)
- [ ] T046 Document components catalog (15 min)
- [ ] T047 Add integration examples (10 min)

**Checkpoint:** README.md complete, ready for `/use-modules` command

---

## 🎯 FINAL VALIDATION

**Phase 2 Complete when:**

✅ **30 tasks completed** (`- [x]` in tasks.md)
✅ **26 files created** (2,660 lines)
✅ **12 shadcn/ui components** (0 hardcoded colors)
✅ **3 auth forms** integrate lib/auth/supabase ✅
✅ **3 payment components** integrate lib/payments/stripe ✅
✅ **3 marketing components** customizable ✅
✅ **Tests pass** (`pnpm test` → All green)
✅ **Test project builds** (integration validated)
✅ **README.md complete** (documentation ready)

---

## 📊 ESTIMATED TIMELINE

| Phase | Tasks | Duration | Parallelization |
|-------|-------|----------|-----------------|
| **Setup** | T001-T004 | 1h | T002+T003 parallel |
| **shadcn/ui** | T005-T018 | 1h30 | T005-T011 parallel, T014-T018 parallel |
| **Auth Forms** | T019-T024 | 1h30 | T019+T020 parallel, T022+T023 parallel |
| **Payments** | T025-T030 | 1h | T025+T026 parallel, T028+T029 parallel |
| **Marketing** | T031-T036 | 45 min | T031+T032 parallel, T034+T035 parallel |
| **QA** | T037-T044 | 1h | Sequential (validation) |
| **Docs** | T045-T047 | 45 min | Sequential (writing) |
| **TOTAL** | **30** | **7h** | **-12% vs 8h original** |

**Parallelization gains:** ~1h saved via `[P]` markers

---

## 🧪 TESTING STRATEGY (TDD Light)

### Approach

**Components FIRST, Tests AFTER** (within same phase)

**Rationale:**
- Library components = simple, well-defined patterns (low risk)
- shadcn/ui components = battle-tested upstream (fork = minimal changes)
- Tests validate integration (lib/auth, lib/payments) + CSS variables
- Tests enable regression detection when library forked to projects

### Test Categories

**1. Unit Tests (Components)**
```typescript
// T022: SignInForm renders
test('SignInForm renders email and password fields', () => {
  render(<SignInForm />);
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
});
```

**2. Integration Tests (lib/ modules)**
```typescript
// T024: ResetPasswordForm calls lib/auth/supabase
test('ResetPasswordForm calls resetPassword()', async () => {
  const mockResetPassword = jest.fn();
  jest.mock('@/lib/auth/supabase/server', () => ({
    resetPassword: mockResetPassword
  }));

  render(<ResetPasswordForm />);
  fireEvent.submit(...);

  expect(mockResetPassword).toHaveBeenCalled();
});
```

**3. Visual Tests (CSS Variables)**
```typescript
// T028: PricingTable uses CSS variables
test('PricingTable uses CSS variables, not hardcoded colors', () => {
  const { container } = render(<PricingTable />);
  const html = container.innerHTML;

  // Should NOT contain hardcoded colors
  expect(html).not.toMatch(/text-gray-\d+/);
  expect(html).not.toMatch(/bg-blue-\d+/);

  // Should contain CSS variable classes
  expect(html).toMatch(/text-foreground/);
  expect(html).toMatch(/bg-primary/);
});
```

**4. Integration Tests (Full Stack)**
```typescript
// T044: Design token change propagates
test('Design token change updates UI', async () => {
  // Change primary color in design-tokens.json
  const tokens = require('./design-tokens.json');
  tokens.colors.primary['500'] = '#8B5CF6'; // Blue → Purple

  // Rebuild Tailwind
  await exec('pnpm build:css');

  // Render component
  render(<Button variant="default">Test</Button>);

  // Verify computed style uses new color
  const button = screen.getByRole('button');
  const styles = getComputedStyle(button);
  expect(styles.backgroundColor).toBe('rgb(139, 92, 246)'); // Purple
});
```

### Test Execution Order

**Within each phase:**
1. Implement components (T019-T021)
2. Run tests (T022-T024)
3. Fix failures if any
4. Checkpoint: All tests pass ✅

**Checkpoints:**
```bash
# After Phase 3 (Auth Forms)
pnpm test auth
# → T022, T023, T024 all pass ✅

# After Phase 4 (Payments)
pnpm test payments
# → T028, T029, T030 all pass ✅

# After Phase 5 (Marketing)
pnpm test marketing
# → T034, T035, T036 all pass ✅

# Final validation
pnpm test
# → All 12 tests pass ✅
```

---

## 🔄 PARALLEL EXECUTION STRATEGY

### Rules Applied

**[P] Marker = Different files + No dependencies**

**Examples:**

✅ **Can parallelize:**
```markdown
- [ ] T002 [P] design-tokens.json
- [ ] T003 [P] tailwind.preset.js
→ Different files, no dependencies
```

✅ **Can parallelize:**
```markdown
- [ ] T005 [P] Fork button.tsx
- [ ] T006 [P] Fork input.tsx
- [ ] T007 [P] Fork card.tsx
→ Independent components
```

✅ **Can parallelize:**
```markdown
- [ ] T019 [P] SignInForm.tsx
- [ ] T020 [P] SignUpForm.tsx
→ Different files, both use lib/auth/supabase (already exists)
```

❌ **Cannot parallelize:**
```markdown
- [ ] T013 Setup temporary project
- [ ] T014 [P] Add form.tsx
→ T014 depends on T013 completing first
```

❌ **Cannot parallelize:**
```markdown
- [ ] T037 Audit: Search hardcoded colors
- [ ] T038 Audit: Verify CSS variables
→ T038 depends on T037 results
```

### Execution in Claude Code

**Agent executes `[P]` tasks in ONE message:**

```typescript
// T005-T011 parallel execution (7 tasks)
// Agent sends 1 message with 7 Write calls:

Write(lib/nextjs/ui/components/ui/button.tsx, <content>)
Write(lib/nextjs/ui/components/ui/input.tsx, <content>)
Write(lib/nextjs/ui/components/ui/card.tsx, <content>)
Write(lib/nextjs/ui/components/ui/label.tsx, <content>)
Write(lib/nextjs/ui/components/ui/avatar.tsx, <content>)
Write(lib/nextjs/ui/components/ui/dropdown-menu.tsx, <content>)
Write(lib/nextjs/ui/components/ui/radio-group.tsx, <content>)

// Claude Code executes all 7 in parallel
// Result: 7 tasks completed in ~2 min (vs 14 min sequential)
```

**Time savings:**
- 7 tasks × 2 min/task = 14 min sequential
- 1 parallel batch = 2 min
- **Saved: 12 min** (-86% on this batch)

**Total parallelization opportunities in Phase 2:**
- Phase 1: 2 tasks (T002+T003) → -2 min
- Phase 2.1: 7 tasks (T005-T011) → -12 min
- Phase 2.2: 5 tasks (T014-T018) → -8 min
- Phase 3.1: 2 tasks (T019+T020) → -5 min
- Phase 3.2: 2 tasks (T022+T023) → -1 min
- Phase 4.1: 2 tasks (T025+T026) → -3 min
- Phase 4.2: 2 tasks (T028+T029) → -1 min
- Phase 5.1: 2 tasks (T031+T032) → -2 min
- Phase 5.2: 2 tasks (T034+T035) → -1 min

**Total saved:** ~35 min → **8h becomes 7h** (-12%)

---

## 📚 DEPENDENCIES

**Test framework:**
```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "vitest": "^1.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

**Component dependencies (shadcn/ui):**
```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-avatar": "^1.0.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

---

**Version:** V7.0 Phase 2
**Status:** 📋 READY FOR EXECUTION
**Methodology:** TDD Light + [P] Parallelization
**Estimated:** 7h (30 tasks, -12% via parallelization)

*Phase 2 UI: TDD Light = Quality + Speed* 🧪⚡
