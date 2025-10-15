# Instructions for Claude Code Agent

**Project:** LegalGuard - Legal AI Chatbot for SMEs
**Version:** V5 Workflow
**Read this file BEFORE executing any Spec-Kit command**

---

## 1. Workflow Order (Execute Sequentially)

```bash
# Phase 1: Planning (30 min)
/speckit.constitution  # Or already done via /zen-roundtable
/speckit.specify       # Or already done via /zen-roundtable
/speckit.design        # ⚠️ MANDATORY - Never skip
/speckit.plan
/speckit.tasks

# Phase 2: GitHub Setup (2 min)
# See section "GitHub Setup Process" below

# Phase 3: Implementation (3-4h)
/speckit.agents
/implement
```

---

## 2. GitHub Setup Process

**When user says:** "génère la partie GitHub" OR "setup GitHub" OR "create PR"

**Execute these steps EXACTLY:**

### Step 1: Copy Workflow Template

```bash
# Copy template to .github/workflows/
cp .github/workflows/ci-template.yml .github/workflows/ci.yml

# Replace placeholders in ci.yml:
# [PROJECT_NAME] → LegalGuard
# [PACKAGE_MANAGER] → pnpm
# [NODE_VERSION] → 20
# [BUILD_COMMAND] → pnpm build
# [LINT_COMMAND] → pnpm lint
# [TEST_COMMAND] → pnpm test
```

### Step 2: Create Feature Branch

```bash
# If not already on feature branch
git checkout -b 001-legalguard-mvp-legal
```

### Step 3: Commit All Files

```bash
# Stage all generated files
git add design/ specs/ .github/

# Commit with EXACT format below (no variations)
git commit -m "feat(specs): generate LegalGuard MVP artifacts

- Design system (tokens, wireframes, components)
- Implementation plan (architecture, tasks, contracts)
- GitHub Actions CI workflow

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Step 4: Push to Remote

```bash
git push -u origin 001-legalguard-mvp-legal
```

### Step 5: Create Pull Request

```bash
# If gh CLI available
gh pr create \
  --title "feat: LegalGuard MVP - Implementation Artifacts" \
  --body-file specs/001-legalguard-mvp-legal/spec.md \
  --label "ai-generated"

# If gh not available, output instructions:
echo "Create PR manually at: https://github.com/USER/legalguard-chatbot/compare/001-legalguard-mvp-legal"
```

**CRITICAL RULES:**
- ❌ DO NOT ask "one commit or multiple?"
- ❌ DO NOT ask "push to remote?"
- ❌ DO NOT invent different commit format
- ✅ DO execute steps above exactly as written

---

## 3. tasks.md Format Rule (ZERO TOLERANCE)

**ONLY allowed format:**

```markdown
- [ ] T001 Create project structure per implementation plan
- [ ] T002 [P] Initialize Next.js 14 with TypeScript
- [ ] T003 [P] [US1] Create User model in src/models/user.ts
```

**FORBIDDEN formats (causes workflow failure):**

```markdown
### T001: Create project structure  ❌ NEVER
### T002 [P]: Initialize Next.js    ❌ NEVER
```

**Mandatory verification BEFORE finalizing tasks.md:**

```bash
# Check for forbidden headers
grep "^### T[0-9]" tasks.md

# If ANY results → STOP and regenerate following .specify/templates/tasks-template.md EXACTLY
```

**Why this matters:**
- Checkboxes = Trackable on GitHub (clickable progress)
- Headers = Not trackable, breaks `/implement` parsing
- This is the #1 cause of project restarts (2 projects affected so far)

---

## 4. Design/Dev Decoupling (Competitive Advantage)

**Rule:** Use CSS variables ONLY for colors/fonts/spacing. NEVER hardcode.

**✅ CORRECT:**
```tsx
<button className="bg-primary-500 text-neutral-50 font-heading">
  Submit
</button>
```

**❌ FORBIDDEN:**
```tsx
<button className="bg-blue-600 text-white font-sans">
  Submit
</button>
```

**Why:**
- Allows 15-min design import (Phase 4) vs 1-2 days refactor
- Designer works in parallel during implementation
- Competitive advantage vs generic AI tools (Lovable/Bolt/v0)

---

## 5. Quality Gates (CI Enforcement)

**P0 (BLOCKER):** Build must pass → Fails CI if errors
**P1 (HIGH):** Lint must pass → Fails CI if errors
**P2 (MEDIUM):** Tests should pass → Warns if errors

**Minimum for merge:** P0 ✅ + P1 ✅

---

## 6. project-memory.md Auto-Documentation (MANDATORY for Sub-Agents)

**CRITICAL RULE:** At the end of EVERY significant task, sub-agents MUST call `/update-memory` automatically.

### When to Document (Triggers) ⭐ V5.1 EXHAUSTIVE LIST

**✅ MANDATORY Documentation (Checkpoint Verification):**

1. **Library Choice:**
   - Chose library A over B (e.g., Puppeteer vs Playwright, Zod vs Yup, shadcn vs MUI)
   - Document: Why A, alternatives rejected with concrete reasons, trade-offs

2. **Architecture Decision:**
   - State management approach (Context vs Zustand vs Redux)
   - Caching strategy (Redis vs in-memory vs edge CDN)
   - Rate limiting design (Redis-based sliding window vs token bucket)
   - API design (REST vs GraphQL vs tRPC)
   - Database pattern (normalized vs denormalized)

3. **Configuration Values (WHY these numbers?):**
   - Polling intervals (3s → 5s → 10s - WHY progression?)
   - Cache TTL (24h - WHY not 1h or 48h?)
   - Retry attempts (3× - WHY not 5× or 1×?)
   - Timeout values (120s Lambda - WHY not 60s or 180s?)
   - Batch sizes (100 items - WHY not 50 or 200?)
   - Rate limits (5 req/s - WHY not 10 or 1?)

4. **Trade-off Accepted:**
   - Simplicity over performance (document performance cost)
   - Cost over latency (document latency impact)
   - Speed over optimization (document technical debt)
   - Polling over webhooks (document real-time trade-off)

5. **Security Measure:**
   - RLS policy design (document per-table rationale)
   - Webhook signature verification (document why mandatory)
   - Environment secret handling (document storage strategy)
   - Rate limiting rules (document abuse prevention)
   - Input validation (document sanitization approach)

6. **Performance Optimization:**
   - Database index added (document query improvement)
   - Caching layer introduced (document cache invalidation strategy)
   - Code splitting implemented (document bundle reduction)
   - Lazy loading (document UX trade-off)

7. **Dependency Added:**
   - New npm package (document why this vs alternatives)
   - External API integration (document fallback strategy)
   - Third-party service (document vendor lock-in risk)

**❌ DO NOT Document:**
- Trivial changes (typo fixes, variable renames, formatting)
- Work-in-progress (wait until decision finalized)
- Already documented in constitution.md or spec.md

**⭐ V5.1 CHECKPOINT VERIFICATION (Every 10 Tasks):**

```bash
# MANDATORY verification at T010, T020, T030, T040...
memory_today=$(grep "^#### $(date +%Y-%m-%d)" .specify/memory/project-memory.md | wc -l)
tasks_completed=$(grep "^\- \[x\]" tasks.md | wc -l)

if [ $memory_today -eq 0 ] && [ $tasks_completed -ge 10 ]; then
  echo "⚠️  WARNING: ${tasks_completed} tasks completed, 0 decisions documented today"
  echo ""
  echo "Review last 10 tasks for undocumented decisions:"
  echo "1. Library choices (e.g., Puppeteer vs Playwright)"
  echo "2. Configuration values (e.g., polling interval 3s - why?)"
  echo "3. Architecture patterns (e.g., state management choice)"
  echo "4. Trade-offs accepted (e.g., simplicity vs performance)"
  echo "5. Security measures (e.g., RLS policy design)"
  echo ""
  echo "If NO significant decisions → OK to continue"
  echo "If decisions made → STOP and document BEFORE continuing"
  exit 1
fi

echo "✅ Memory checkpoint PASS: ${memory_today} decisions documented"
```

### Documentation Template (Required Structure)

**Every memory entry MUST include:**

```markdown
#### YYYY-MM-DD [Decision Title]

**Agent:** [backend-specialist/frontend-specialist/etc.]

**Decision:** [What was decided - 1 sentence]

**Reason:** [Why this decision - business/technical justification]

**Trade-offs:**
- ✅ Pros: [Benefit 1], [Benefit 2]
- ❌ Cons: [Cost 1], [Cost 2]

**Alternatives Considered:**
- [Option A]: [Why rejected]
- [Option B]: [Why rejected]

**Validation:** [Evidence - metrics, tests, benchmarks]
```

### Example (Good Documentation)

```markdown
#### 2025-10-14 Database Index Optimization

**Agent:** backend-specialist

**Decision:** Added GIN index on `conversations.messages` JSONB column

**Reason:** User search queries slow (avg 800ms). GIN index optimizes JSONB `@>` operator for semantic search.

**Trade-offs:**
- ✅ Pros: -85% query time (800ms→120ms), zero code changes, scales linearly
- ❌ Cons: +12% disk space (~300MB for 100K conversations), 15% slower writes

**Alternatives Considered:**
- B-tree index: Not efficient for JSONB operators (rejected, 3× slower than GIN)
- ElasticSearch: Overkill for MVP, +€80/month hosting cost (rejected)
- Full-text search (ts_vector): Limited to text, can't search structured data (rejected)

**Validation:** Load tested 100K conversations, p95 latency 135ms ✅, index size 2.8GB
```

### Automation (Phase 3: Implementation)

**Sub-agents workflow:**

```bash
# 1. Agent implements feature (e.g., authentication)
# 2. Agent completes implementation
# 3. Agent AUTOMATICALLY calls /update-memory
# 4. Agent fills template via interactive prompts
# 5. Memory appended to .specify/memory/project-memory.md
# 6. Agent continues to next task
```

**Verification:**

```bash
# At end of Phase 3, check memory updated
grep "^#### 2025-10-14" .specify/memory/project-memory.md | wc -l

# Should show 5-15 entries (depending on implementation complexity)
```

### Benefits (Why This Matters)

- **Onboarding:** New dev reads WHY decisions made (2h vs 2 days)
- **Refactoring:** Avoid re-testing rejected alternatives (saves 4h per refactor)
- **Audit:** RGPD/HIPAA compliance requires decision documentation (saves 1-2 days per audit)
- **Intentionality:** Preserves context that code comments can't capture

---

## 7. Tech Stack (From constitution.md)

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Backend:** Supabase (Auth + Database), PostgreSQL
- **AI:** OpenAI GPT-4o-mini, RAG with Pinecone
- **Styling:** Tailwind CSS + design-tokens.json
- **Testing:** Playwright (E2E), Vitest (unit)
- **Hosting:** Vercel (EU region)
- **Package Manager:** pnpm

---

## 8. Key Constraints

- **RGPD Compliance:** EU-only hosting (Supabase Frankfurt, Pinecone EU-West)
- **Legal Disclaimers:** Mandatory on all AI responses + generated documents
- **Attorney Validation:** Document templates require legal review before production
- **Data Encryption:** TLS 1.3 (in-transit) + AES-256 (at-rest)

---

**Last Updated:** 2025-10-14
**Workflow Version:** V5
**Next Phase:** After GitHub setup → Run /speckit.agents → Run /implement
