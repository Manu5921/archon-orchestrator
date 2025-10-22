# Implementation Plan - Test V6 MVP

**Date:** 2025-10-16
**Strategy:** Sequential execution (backend → frontend → testing)

## Phase 1: Backend (T001-T004)

**Agent:** backend-specialist
**Duration:** 20 min (synthétique)

**Deliverables:**
- Supabase client configured
- Auth endpoints (login, signup)
- /api/users endpoint
- Zod validation schemas

## Phase 2: Frontend (T005-T008)

**Agent:** frontend-specialist
**Duration:** 20 min (synthétique)

**Deliverables:**
- Login component (shadcn/ui)
- Dashboard component
- Tailwind config with tokens
- UserList component

## Phase 3: Testing (T009-T010)

**Agent:** testing-specialist
**Duration:** 10 min (synthétique)

**Deliverables:**
- Playwright test: Login flow
- Vitest test: API validation

## File Structure

```
test-v6-mvp/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── users/
│   │   │       └── route.ts
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── components/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   └── UserList.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── validation.ts
│   └── services/
│       └── auth.ts
└── tests/
    ├── e2e/
    │   └── login.spec.ts
    └── unit/
        └── validation.test.ts
```

## Quality Gates

**After backend:**
- Build check
- ESLint check

**After frontend:**
- Build check
- ESLint check

**After testing:**
- Test suite execution
