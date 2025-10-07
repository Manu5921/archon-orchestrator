# Tasks MVP - Test Project

## Phase 1: Infrastructure (T001-T005)

### T001: Project Setup
- Init Next.js 14 App Router
- Configure TypeScript strict
- Setup ESLint + Prettier
- **Estimation:** 30 min

### T002: Design Tokens
- Generate design-tokens.json (20 tokens)
- Create wireframes (dashboard, menu)
- List shadcn/ui components needed
- **Estimation:** 15 min

### T003: Database Schema
- Setup Supabase project
- Define users table
- Define posts table (example)
- **Estimation:** 20 min

### T004: Environment Config
- Create .env.example
- Configure SUPABASE_URL, SUPABASE_KEY
- Document required secrets
- **Estimation:** 10 min

### T005: Basic Layout
- Create app/layout.tsx
- Add navigation component
- Setup dark mode toggle
- **Estimation:** 30 min

---

## Phase 2: Authentication (T006-T010)

### T006: Supabase Auth Setup
- Configure auth providers (email)
- Setup auth callbacks
- Create auth utilities
- **Estimation:** 30 min

### T007: Login Page
- Create app/login/page.tsx
- Login form with validation
- Error handling
- **Estimation:** 30 min

### T008: Signup Page
- Create app/signup/page.tsx
- Signup form with validation
- Email confirmation flow
- **Estimation:** 30 min

### T009: Protected Routes
- Create middleware.ts
- Implement auth checks
- Redirect logic
- **Estimation:** 20 min

### T010: User Profile
- Create app/profile/page.tsx
- Display user info
- Update profile form
- **Estimation:** 30 min

---

## Phase 3: API Routes (T011-T015)

### T011: GET /api/posts
- Fetch posts from Supabase
- Pagination support
- Error handling
- **Estimation:** 20 min

### T012: POST /api/posts
- Create new post
- Validation
- Auth required
- **Estimation:** 20 min

### T013: GET /api/posts/:id
- Fetch single post
- 404 handling
- **Estimation:** 15 min

### T014: PUT /api/posts/:id
- Update post
- Owner check
- Validation
- **Estimation:** 20 min

### T015: DELETE /api/posts/:id
- Delete post
- Owner check
- Cascade deletes
- **Estimation:** 15 min

---

## Notes
- **Total tasks:** 15
- **Estimated total:** 5h 30min
- **Quality gates:** P0 (Build) + P1 (Lint) + P2 (Tests) minimum
