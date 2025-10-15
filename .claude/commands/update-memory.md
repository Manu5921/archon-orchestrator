# Update Project Memory

**Purpose:** Agent self-documentation. During implementation, agents append their key runtime decisions to `project-memory.md`, creating a living memory that captures the **WHY** behind the **HOW**.

**Philosophy (V5):**
> Traditional documentation becomes obsolete immediately. **Dynamic Memory** evolves with the code. Agents document their implementation decisions in real-time, creating a self-updating source of truth that preserves intentionality.

---

## 🧠 WHEN TO USE

### Trigger Conditions

✅ **Use `/update-memory` when:**

1. **Architecture Decision Made**
   - Chose database index strategy (GIN vs B-tree vs Hash)
   - Selected state management approach (Context vs Zustand vs Redux)
   - Decided deployment strategy (Vercel vs Railway vs AWS)

2. **Performance Optimization Implemented**
   - Added caching layer (Redis, in-memory, edge)
   - Optimized database query (index, denormalization, materialized view)
   - Implemented code splitting (dynamic imports, lazy loading)

3. **Security Measure Added**
   - Configured rate limiting (per-user, per-IP, global)
   - Implemented authentication flow (OAuth, JWT, session)
   - Added data encryption (at-rest, in-transit)

4. **Trade-off Accepted**
   - Chose simplicity over performance (acceptable for MVP)
   - Accepted technical debt (documented, estimated repay cost)
   - Prioritized speed over optimization (justified by timeline)

5. **Alternative Rejected**
   - Considered option A, chose option B (why B > A)
   - Evaluated library X, used library Y (concrete reasons)

❌ **DON'T use `/update-memory` for:**
- Trivial changes (fixed typo, renamed variable)
- Implementation details covered in code comments
- Decisions already documented in ADR section
- Work-in-progress (wait until decision finalized)

---

## 📝 COMMAND USAGE

### Syntax

```bash
/update-memory

# Claude will prompt for:
# 1. Section: [Backend / Frontend / Testing / Design / DevOps]
# 2. Decision Title: [Short descriptive title]
# 3. Decision Details: [What, Why, Trade-offs, Alternatives, Validation]
```

### Interactive Prompts

**Prompt 1: Which section?**
```
Select section for this decision:
1. Backend Decisions
2. Frontend Decisions
3. Testing Decisions
4. Design Decisions
5. DevOps Decisions
6. Other (specify)
```

**Prompt 2: Decision Template**
```markdown
Fill in the template below:

## Decision Title
[Descriptive title - e.g., "Database Index Optimization" or "State Management Strategy"]

### Agent
[backend-specialist / frontend-specialist / testing-specialist / design-specialist / devops-specialist]

### Decision
[WHAT was implemented - be specific, include code/config snippets if relevant]

### Reason
[WHY this approach vs alternatives - what problem does it solve?]

### Trade-offs
- ✅ **Pros:** [advantages - quantify if possible: -80% query time, +30% cache hits]
- ❌ **Cons:** [disadvantages accepted - +10% disk space, learning curve]

### Alternative Considered
[WHAT was NOT chosen - e.g., "Considered Redis caching, rejected because..."]
[WHY rejected - be specific: cost, complexity, overkill for MVP, etc.]

### Validation
[HOW verified this works - test results, benchmarks, logs, screenshots]
[Quantitative data if available: "Tested with 100K products, 500ms → 100ms"]
```

---

## 🎯 TEMPLATE EXAMPLES (Good vs Bad)

### ✅ GOOD EXAMPLE (Detailed, Actionable)

```markdown
#### 2025-10-15 Database Index Optimization

**Agent:** backend-specialist

**Decision:** Added GIN index on `metadata` JSONB column (table: `products`)

```sql
CREATE INDEX idx_products_metadata_gin ON products USING GIN (metadata jsonb_path_ops);
```

**Reason:** User search queries were slow (N+1 query pattern detected during load testing). Product search filters use JSONB `@>` operator extensively. GIN index optimizes JSONB containment queries.

**Trade-offs:**
- ✅ **Pros:**
  - -80% query time (500ms → 100ms average for search with 3 filters)
  - Scales linearly (tested up to 1M products)
  - Zero application code changes (drop-in optimization)
- ❌ **Cons:**
  - +10% disk space (~200MB for 100K products, acceptable)
  - Slightly slower writes (~5ms per INSERT, negligible)
  - Index maintenance overhead (VACUUM needed weekly)

**Alternative Considered:**
- B-tree index (rejected: not efficient for JSONB `@>` operator, 2× slower than GIN)
- Denormalization (rejected: breaks normal form, adds code complexity)
- ElasticSearch (rejected: overkill for MVP, +€50/month cost)

**Validation:**
- Tested with 100K products dataset (production-like data)
- Ran `EXPLAIN ANALYZE` before/after: index scan confirmed
- Load tested 1000 req/s: p95 latency 120ms (target: <200ms) ✅
- Monitored for 48h: no performance degradation, query cache hit rate 85%
```

**Why this is good:**
- ✅ Specific (GIN index, exact column, table name)
- ✅ Quantified (numbers: 500ms→100ms, +10% disk, 100K products)
- ✅ Justified (why GIN vs B-tree/ES/denormalization)
- ✅ Validated (EXPLAIN ANALYZE, load test, 48h monitoring)
- ✅ Code snippet (SQL DDL included)

---

### ❌ BAD EXAMPLE (Vague, Not Actionable)

```markdown
#### 2025-10-15 Made Database Faster

**Agent:** backend-specialist

**Decision:** Optimized database

**Reason:** It was slow

**Trade-offs:**
- ✅ **Pros:** Faster now
- ❌ **Cons:** None

**Alternative Considered:** Nothing else

**Validation:** Tested, works fine
```

**Why this is bad:**
- ❌ Vague ("optimized database" = what exactly?)
- ❌ Not quantified ("slow" → how slow? "faster" → how much faster?)
- ❌ No alternatives (implies no research done)
- ❌ No validation details (what test? what metric?)
- ❌ No code (can't reproduce if needed)

---

## 🔄 WORKFLOW INTEGRATION (Phase 2: Implementation)

### Automatic Trigger Points

**During `/implement` (Phase 2), agents should call `/update-memory` at:**

1. **End of major task** (T001-T025 completed by backend-specialist)
   - Agent completes auth system → documents OAuth strategy decision
   - Agent completes database schema → documents data modeling choices

2. **After performance optimization**
   - Slow query identified → index added → `/update-memory` documents why GIN not B-tree

3. **When accepting technical debt**
   - "Skip unit tests for T047 due to timeline" → `/update-memory` documents debt + repay estimate

4. **When rejecting common pattern**
   - "Used Fetch API instead of Axios" → `/update-memory` documents why (native, smaller bundle)

### Example Workflow

```bash
# Phase 2: Implementation (backend-specialist working)

# Step 1: Agent implements auth
[Implements Supabase Auth with Google OAuth]

# Step 2: Agent documents decision
/update-memory

# Prompt: Select section
> 1. Backend Decisions

# Prompt: Fill template
> ## Authentication Strategy
> Agent: backend-specialist
> Decision: Supabase Auth with Google OAuth
> Reason: Built-in security (row-level), zero maintenance, free tier generous
> Trade-offs:
>   Pros: -90% dev time vs custom JWT, MFA included, audit logs
>   Cons: Vendor lock-in (mitigated: standard PostgreSQL, export possible)
> Alternative: NextAuth (rejected: more boilerplate), Custom JWT (rejected: security risk)
> Validation: Tested OAuth flow, MFA working, session expiry correct (24h)

# Step 3: Memory updated automatically
[project-memory.md updated with new Runtime Decision entry]

# Step 4: Agent continues to next task
[Implements database schema...]
```

---

## 📊 BENEFITS (Why This Matters)

### 1. Self-Documenting System

**Problem (Traditional):**
```
Week 1: Code written, decision in dev's head
Week 4: Code committed, decision forgotten
Month 6: "Why did we use GIN index?" → Nobody remembers → Risky to change
```

**Solution (Dynamic Memory):**
```
Week 1: Code written, decision documented in memory
Month 6: Read memory → "GIN because JSONB @> operator" → Confident to optimize
```

### 2. Onboarding Acceleration

**New agent (or human) joining project:**
- **Without memory:** Read 10K lines code, guess intent, ask senior dev
- **With memory:** Read memory file (2-3 min), understand WHY immediately, start contributing

**Time saved:** 2-3 days → 2-3 hours (90% reduction)

### 3. Future Refactoring Safety

**Scenario:** 6 months later, need to optimize database

**Without memory:**
```
Developer: "Should I replace GIN with B-tree?"
→ Tests both → B-tree slower → 4 hours wasted
→ Doesn't know GIN was already benchmarked vs B-tree
```

**With memory:**
```
Developer: Reads memory → "GIN tested vs B-tree (2× faster)"
→ Skips redundant test → Focuses on new optimization (partitioning)
→ 4 hours saved
```

### 4. Compliance & Audit Trail

**Regulatory requirement (HIPAA, SOC2):**
> "Document all security-related decisions with justification."

**Without memory:**
- Scramble through Git history, Slack messages, email
- Reconstruct decision rationale from memory (if person still available)
- Time: 1-2 days per audit

**With memory:**
- Read "Runtime Decisions > Backend > Authentication Strategy"
- Decision + justification + validation already documented
- Time: 5 minutes per audit

**ROI:** Audit compliance effort -95%

---

## 🛠️ IMPLEMENTATION DETAILS

### File Location

```bash
# Project memory file (one per project)
project-root/
  ├── project-memory.md        # Main memory file
  ├── .specify/
  │   └── memory/
  │       └── constitution.md  # High-level governance (created Phase 0)
  └── specs/
      └── 001-mvp/
          └── spec.md           # Technical spec (created Phase 0)
```

**Hierarchy:**
1. **constitution.md** (Phase 0) - Governance, vision, constraints (HIGH-LEVEL)
2. **spec.md** (Phase 0) - Technical requirements, features (DETAILED)
3. **project-memory.md** (Phase 1+) - Runtime decisions, learnings, issues (LIVING)

### Update Mechanism

**Append-only (no edits to existing entries):**

```markdown
## ⚙️ RUNTIME DECISIONS

### Backend Decisions

#### 2025-10-15 Authentication Strategy
[Entry 1...]

#### 2025-10-16 Database Index Optimization
[Entry 2...]

#### 2025-10-17 Caching Layer Implementation
[Entry 3...]
```

**Why append-only:**
- ✅ Preserves history (see evolution of decisions)
- ✅ No conflicts (multiple agents can append concurrently)
- ✅ Audit trail intact (who decided what when)

**If decision changes:**
- Don't edit old entry
- Add NEW entry: "2025-10-20 Revised Authentication Strategy"
- Reference old entry: "Replaces decision from 2025-10-15 (reason: X)"

### Automation (Future V6)

**Current (V5): Manual trigger**
```bash
# Agent (or human) calls explicitly
/update-memory
```

**Future (V6): Automatic detection**
```bash
# System detects decision pattern in agent output
Agent: "I added a GIN index because..."
System: [Detects decision] → Auto-populates /update-memory template
Agent: Reviews → Confirms → Memory updated
```

**V6 Benefits:**
- Zero friction (agent doesn't need to remember to document)
- Higher compliance (100% decisions captured vs 60-70% manual)

---

## 📚 RELATED DOCUMENTATION

- **Template:** `templates/project-memory-template.md`
- **Pattern:** `docs/GOLDEN-PATTERNS.md` - Section "Dynamic Memory Pattern V5"
- **Workflow:** `docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md` - Phase 2 (Implementation)
- **Philosophy:** `docs/CONTEXT-MANAGEMENT-BEST-PRACTICES.md`

---

## ✅ CHECKLIST (Before Submitting Decision)

Before calling `/update-memory`, verify:

- [ ] Decision is **significant** (not trivial change)
- [ ] Decision is **finalized** (not work-in-progress)
- [ ] **WHY** is documented (not just WHAT)
- [ ] **Trade-offs** are explicit (pros AND cons)
- [ ] **Alternatives** were considered (not just default choice)
- [ ] **Validation** is concrete (numbers, tests, evidence)
- [ ] Code/config **snippet** included (if relevant)
- [ ] **Quantified** when possible (percentages, times, sizes)

**If all checked:**
✅ Proceed with `/update-memory`

**If any missing:**
❌ Gather missing info first, THEN document

---

**Command Version:** 1.0 (Dynamic Memory V5)
**Created:** 2025-10-15
**Philosophy:** *"Code shows WHAT. Comments show HOW. Memory shows WHY."*

*Agent Self-Documentation: The Soul of the Project* 🧠✨
