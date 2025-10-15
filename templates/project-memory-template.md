# Project Memory: [PROJECT-NAME]

**Created:** [YYYY-MM-DD]
**Last Updated:** [YYYY-MM-DD HH:MM]
**Phase:** [Planning / Implementation / Review / Deployed]
**Status:** [Active / On-Hold / Completed]

---

## 🎯 PROJECT IDENTITY

### Vision (One-Liner)
> [What is this project in one sentence?]

### Client Context
- **Type:** [Startup / PME / Enterprise / Internal Tool]
- **Sector:** [SaaS / E-commerce / Healthcare / Finance / Education / etc.]
- **Target Users:** [B2B / B2C / B2B2C / Internal]
- **Scale:** [MVP / Growth / Enterprise]
- **Budget:** [€ amount / Bootstrapped / VC-funded]

### Timeline
- **Kickoff:** [YYYY-MM-DD]
- **MVP Target:** [YYYY-MM-DD]
- **Launch Target:** [YYYY-MM-DD]
- **Critical Milestones:** [list dates/events]

---

## 🏗️ ARCHITECTURAL DECISIONS (ADR)

### Tech Stack

**Frontend:**
- Framework: [Next.js / React / Vue / Svelte / etc.]
- UI Library: [shadcn/ui / Material-UI / Chakra / Custom]
- Styling: [Tailwind CSS / CSS Modules / Styled Components]
- State Management: [React Context / Zustand / Redux / TanStack Query]

**Backend:**
- Runtime: [Node.js / Python / Go / Rust]
- Framework: [Next.js API Routes / Express / FastAPI / Actix]
- Database: [Supabase PostgreSQL / MongoDB / SQLite / PlanetScale]
- ORM: [Prisma / Drizzle / TypeORM / SQLAlchemy]

**Infrastructure:**
- Hosting: [Vercel / Railway / Fly.io / AWS / Self-hosted]
- CDN: [Vercel Edge / Cloudflare / CloudFront]
- Storage: [Supabase Storage / S3 / R2]
- CI/CD: [GitHub Actions / GitLab CI / Circle CI]

### Architecture Pattern
- **Chosen:** [Monolith / Microservices / Serverless / Hybrid]
- **Reason:** [Why this choice vs alternatives]
- **Trade-offs Accepted:**
  - ✅ **Pros:** [advantages]
  - ❌ **Cons:** [disadvantages accepted]

### Authentication Strategy
- **Approach:** [Supabase Auth / NextAuth / Clerk / Auth0 / Custom JWT]
- **Reason:** [simplicity / compliance / budget / features]
- **OAuth Providers:** [Google / GitHub / Microsoft / etc.]
- **Session Management:** [JWT / Database Sessions / Cookies]

### Data Modeling
- **Primary Entities:** [User, Product, Order, etc.]
- **Key Relations:** [User → Orders (1:N), Product → Categories (N:M)]
- **Indexes:** [Documented in Runtime Decisions below]
- **Migrations Strategy:** [Prisma Migrate / Drizzle Kit / Manual SQL]

---

## 🎨 DESIGN SYSTEM (Brand Identity)

### Design Decoupling Status
- **Design Tokens Generated:** [YES / NO]
- **Custom Brand Merged:** [YES / NO / PENDING]
- **Design Source:** [Figma / v0 / Manual / Placeholder]

### Color Palette
```json
{
  "primary": {
    "50": "#...",
    "500": "#...",
    "900": "#..."
  },
  "secondary": { ... },
  "neutral": { ... },
  "success": { ... },
  "warning": { ... },
  "error": { ... }
}
```

### Typography
- **Heading Font:** [Satoshi / Inter / Custom]
- **Body Font:** [Inter / System / Custom]
- **Code Font:** [JetBrains Mono / Fira Code]

### Spacing System
- **Scale:** [4px / 8px base]
- **Key Values:** [xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px]

### Components Library
- **Source:** [shadcn/ui / Material-UI / Custom]
- **Components Used:** [button, card, form, input, select, table, dialog, etc.]

---

## 🧩 PATTERNS APPLIED

### 1. Design/Dev Decoupling ⭐
- **Reference:** `docs/GOLDEN-PATTERNS.md` - Section Design/Dev Decoupling
- **Health Score:** 9.9/10 (Competitive Advantage)
- **Applied When:** Phase 1 `/speckit.design` → design-tokens.json generated
- **Custom Brand Status:** [Merged Phase 4 / Pending / Placeholder]
- **ROI:** -95% time (15 min merge vs 1-2 days refactor)

### 2. Zen MCP Multi-IA Orchestration
- **Reference:** `docs/ZEN-MCP-WORKFLOW-ORCHESTRATION.md`
- **Health Score:** 9.8/10 (Validated Production)
- **Applied When:** Phase 0 `/zen-roundtable` → constitution.md + spec.md
- **Results:**
  - Codex (gpt-5): 3 architecture options generated
  - Gemini (2.5-pro): Security review + scalability analysis
  - Claude (Sonnet 4.5): Arbitration + final decision
- **ROI:** -87% time (45 min vs 6h manual roundtrips)

### 3. Sub-Agents Orchestration
- **Reference:** `docs/SUB-AGENTS-MASTERY.md`
- **Health Score:** 9.5/10 (Proven Pattern)
- **Agents Generated:** [backend-specialist, frontend-specialist, design-specialist, testing-specialist]
- **Orchestration:** `/speckit.agents` → prompt generated automatically
- **ROI:** Optimal task parallelization (3-4h implementation vs 6-8h sequential)

### 4. [Other Patterns Used]
- **Reference:** [Link to doc]
- **Applied:** [How / When]
- **ROI:** [Measured benefit]

---

## 🔒 COMPLIANCE & SECURITY

### Regulatory Requirements
- **RGPD (GDPR):** [YES / NO / N/A]
  - Data retention: [duration]
  - Right to deletion: [implemented]
  - Consent management: [approach]
- **HIPAA:** [YES / NO / N/A]
  - BAA signed: [YES / NO]
  - PHI handling: [approach]
- **SOC2:** [Type I / Type II / N/A]
- **PCI-DSS:** [Level 1-4 / N/A / Using Stripe]
- **Custom Requirements:** [List specific regulations]

### Security Measures
- **Authentication:** [MFA enabled / OAuth only / Custom]
- **Authorization:** [RBAC / ABAC / Row-Level Security]
- **Data Encryption:**
  - At rest: [YES via database / NO]
  - In transit: [HTTPS enforced / TLS 1.3]
- **Secrets Management:** [Environment variables / Vault / AWS Secrets]
- **Rate Limiting:** [YES / NO / Strategy]
- **CSRF Protection:** [YES / NO]
- **XSS Prevention:** [Content Security Policy / Sanitization]

### Jules Security Scan
- **Scan Date:** [YYYY-MM-DD]
- **Score:** [X/100]
- **Critical Issues:** [Number]
- **Status:** [Resolved / In Progress / Accepted Risk]

---

## 🚨 CRITICAL CONTEXT (Read First)

### Must-Know Constraints
1. **[Constraint 1]:** [Description + Why critical]
2. **[Constraint 2]:** [Description + Why critical]
3. **[Constraint 3]:** [Description + Why critical]

### Known Risks & Mitigations
| Risk | Severity | Probability | Mitigation Strategy | Owner |
|------|----------|-------------|---------------------|-------|
| [Risk 1] | High/Med/Low | High/Med/Low | [Strategy] | [Person] |
| [Risk 2] | ... | ... | ... | ... |

### Stakeholder Map
| Name | Role | Involvement | Communication Frequency |
|------|------|-------------|-------------------------|
| [Name] | [Decision Maker / Sponsor / User Rep] | [Level] | [Daily / Weekly / Milestones] |

### Success Metrics (KPIs)
- **Technical:** [Build time <X min, Test coverage >Y%, Lighthouse score >90]
- **Business:** [User sign-ups, Revenue, NPS score]
- **Launch Criteria:** [List of must-have metrics to consider MVP "done"]

---

## ⚙️ RUNTIME DECISIONS (Self-Documented by Agents) 🆕

> **Philosophy:** This section is **agent-writable**. During implementation, agents document their key decisions here. This creates a self-updating memory that captures the **WHY** behind the **HOW**.

### Backend Decisions

#### [YYYY-MM-DD] Database Index Optimization
- **Agent:** backend-specialist
- **Decision:** Added GIN index on `metadata` JSONB column (table: `products`)
- **Reason:** User search queries were slow (N+1 query pattern detected). GIN index optimizes JSONB `@>` operator.
- **Trade-offs:**
  - ✅ **Pro:** -80% query time (500ms → 100ms avg)
  - ❌ **Con:** +10% disk space (~200MB for 100K products)
- **Alternative Considered:** B-tree index (rejected: not efficient for JSONB queries)
- **Validation:** Tested with 100K products dataset, confirmed via `EXPLAIN ANALYZE`

#### [YYYY-MM-DD] [Decision Title]
- **Agent:** [backend-specialist / frontend-specialist / etc.]
- **Decision:** [What was implemented]
- **Reason:** [Why this approach vs alternatives]
- **Trade-offs:** [Pros / Cons accepted]
- **Alternative Considered:** [What was NOT chosen and why]
- **Validation:** [How verified this works]

---

### Frontend Decisions

#### [YYYY-MM-DD] State Management Strategy
- **Agent:** frontend-specialist
- **Decision:** Used TanStack Query (React Query) for server state, React Context for UI state
- **Reason:** Separation of concerns (server state ≠ UI state). TanStack Query handles caching, refetching, optimistic updates automatically.
- **Trade-offs:**
  - ✅ **Pro:** -60% boilerplate vs Redux, automatic cache invalidation
  - ❌ **Con:** Learning curve for team (but docs excellent)
- **Alternative Considered:** Zustand (rejected: doesn't handle server state as elegantly)
- **Validation:** Forms with optimistic updates working, cache invalidation on mutations verified

#### [YYYY-MM-DD] [Decision Title]
- **Agent:** [frontend-specialist]
- **Decision:** [What was implemented]
- **Reason:** [Why this approach]
- **Trade-offs:** [Pros / Cons]
- **Alternative Considered:** [What was NOT chosen]
- **Validation:** [How verified]

---

### Testing Decisions

#### [YYYY-MM-DD] E2E Test Strategy
- **Agent:** testing-specialist
- **Decision:** Playwright for E2E, Vitest for unit/integration, coverage threshold 80%
- **Reason:** Playwright = cross-browser, headless, fast. Vitest = Vite-native, faster than Jest.
- **Trade-offs:**
  - ✅ **Pro:** Fast test execution (parallel), visual regression testing via screenshots
  - ❌ **Con:** Initial setup time ~30 min (acceptable)
- **Alternative Considered:** Cypress (rejected: slower, flaky in CI)
- **Validation:** 95% coverage achieved on core flows (auth, checkout, admin)

#### [YYYY-MM-DD] [Decision Title]
- **Agent:** [testing-specialist]
- **Decision:** [What was implemented]
- **Reason:** [Why]
- **Trade-offs:** [Pros / Cons]
- **Alternative Considered:** [Rejected option]
- **Validation:** [Coverage / Results]

---

### Design Decisions

#### [YYYY-MM-DD] Component Variant System
- **Agent:** design-specialist
- **Decision:** shadcn/ui `Button` with 4 variants (default, destructive, outline, ghost)
- **Reason:** Consistency across UI, accessibility baked-in (aria-labels, keyboard nav)
- **Trade-offs:**
  - ✅ **Pro:** Zero maintenance (shadcn updates), customizable via design tokens
  - ❌ **Con:** Less "unique" than fully custom (acceptable for MVP)
- **Alternative Considered:** Fully custom components (rejected: 3-4 days dev time vs 30 min shadcn)
- **Validation:** All buttons use variant system, 100% WCAG AA compliant

#### [YYYY-MM-DD] [Decision Title]
- **Agent:** [design-specialist]
- **Decision:** [What was implemented]
- **Reason:** [Why]
- **Trade-offs:** [Pros / Cons]
- **Alternative Considered:** [Rejected]
- **Validation:** [How verified]

---

### DevOps Decisions

#### [YYYY-MM-DD] Deployment Strategy
- **Agent:** devops-specialist (if used)
- **Decision:** Vercel for frontend + backend API routes, Supabase managed for database
- **Reason:** Zero-config deployment, edge functions for API, automatic SSL
- **Trade-offs:**
  - ✅ **Pro:** -90% DevOps time vs self-hosted, auto-scaling, 99.99% uptime SLA
  - ❌ **Con:** Vendor lock-in (mitigated: Next.js portable, database = standard PostgreSQL)
- **Alternative Considered:** Railway (rejected: less mature edge network), AWS (rejected: too complex for MVP)
- **Validation:** Deployed test app, load tested 1000 req/s, latency <100ms

#### [YYYY-MM-DD] [Decision Title]
- **Agent:** [devops-specialist]
- **Decision:** [What]
- **Reason:** [Why]
- **Trade-offs:** [Pros / Cons]
- **Alternative Considered:** [Rejected]
- **Validation:** [Verified]

---

## 🐛 ISSUES ENCOUNTERED & RESOLVED

### [Issue #1] [Title]
- **Date:** [YYYY-MM-DD]
- **Phase:** [Planning / Implementation / Review]
- **Agent:** [Which agent encountered this]
- **Context:** [What happened, what was expected]
- **Root Cause:** [Why it failed - be specific]
- **Solution Applied:** [How fixed - code snippet if relevant]
- **Prevention:** [What to avoid in future / pattern to use]
- **Time Impact:** [+X hours to project timeline]

**Example:**
```typescript
// ❌ BEFORE (broken)
const user = await db.user.findUnique({ where: { email } });
if (!user) throw new Error("Not found"); // ⚠️ Error: Prisma returns null, not throws

// ✅ AFTER (fixed)
const user = await db.user.findUnique({ where: { email } });
if (!user) return { error: "User not found" }; // Explicit null check
```

### [Issue #2] [Title]
- **Date:** [YYYY-MM-DD]
- **Phase:** [...]
- **Agent:** [...]
- **Context:** [...]
- **Root Cause:** [...]
- **Solution Applied:** [...]
- **Prevention:** [...]
- **Time Impact:** [...]

---

## 📝 SESSION NOTES (Chronological)

### Session [YYYY-MM-DD] - Phase 0: Multi-IA Roundtable
- **Duration:** 45 min
- **Outcome:** constitution.md + spec.md generated
- **Key Decisions:**
  - Architecture: [Monolith chosen over microservices - simplicity for MVP]
  - Tech Stack: [Next.js + Supabase - fast iteration]
  - Auth: [Supabase Auth - built-in, secure]
- **Next Steps:** Spec-Kit Planning (Phase 1)

### Session [YYYY-MM-DD] - Phase 1: Spec-Kit Planning
- **Duration:** 30 min
- **Outcome:** plan.md + tasks.md (78 tasks) + design-tokens.json generated
- **Key Decisions:**
  - Design system: [Placeholder blue tokens, custom brand pending]
  - Components: [shadcn/ui button, card, form, input, select, table, dialog]
- **Next Steps:** Implementation Phase 2 (local Mac)

### Session [YYYY-MM-DD] - Phase 2: Implementation (Day 1)
- **Duration:** 3h
- **Agent Focus:** backend-specialist (auth + database setup)
- **Completed Tasks:** [T001-T025]
- **Blockers:** [None / Issue #1 resolved]
- **Notes:** [Any important observation]

### Session [YYYY-MM-DD] - Phase 2: Implementation (Day 2)
- **Duration:** 4h
- **Agent Focus:** frontend-specialist (UI components + forms)
- **Completed Tasks:** [T026-T055]
- **Blockers:** [Issue #2 encountered, resolved]
- **Notes:** [...]

### Session [YYYY-MM-DD] - Phase 4: Design Import
- **Duration:** 15 min
- **Outcome:** Custom brand merged (violet #8B5CF6 → primary-500)
- **Impact:** UI transformed, 0 breaking changes (CSS variables worked perfectly)
- **Client Reaction:** "Wow, it looks professional now!" (deal closer)

### Session [YYYY-MM-DD] - Phase 5: Review + Merge
- **Duration:** 15 min
- **Outcome:** PR merged, MVP deployed
- **Jules Security Score:** [94/100]
- **Launch Status:** [Deployed to production / Staging only / Pending client review]

---

## 🎯 PROJECT STATUS SUMMARY

### Current Phase
[Planning / Implementation / Review / Deployed / Maintenance]

### Completion
- **Tasks Completed:** [X / Y tasks] ([Z%])
- **MVP Definition:** [Core features list]
- **MVP Status:** [X / Y features done]

### Velocity
- **Average:** [X tasks/day]
- **Estimated Completion:** [YYYY-MM-DD] ([+/- X days from target])

### Health Indicators
- ✅ **Build:** Passing
- ✅ **Tests:** 95% coverage (target: 80%)
- ✅ **Lint:** 0 errors, 3 warnings (acceptable)
- ⚠️ **Performance:** Lighthouse 85 (target: 90 - optimize images)
- ✅ **Security:** Jules 94/100 (no critical issues)

---

## 🔮 FUTURE CONSIDERATIONS (Post-MVP)

### Technical Debt
- [ ] [Item 1]: [Description + Priority + Estimated effort]
- [ ] [Item 2]: [...]

### Feature Roadmap (Post-Launch)
- [ ] **Phase 2:** [Feature set - Estimated X weeks]
- [ ] **Phase 3:** [Feature set - Estimated Y weeks]

### Scaling Considerations
- **Database:** [When to migrate from Supabase free tier? At X users]
- **Hosting:** [When to optimize? At Y req/s]
- **Monitoring:** [Add Sentry / DataDog when deployed]

---

## 📚 EXTERNAL REFERENCES

### Documentation
- **Project README:** [Link]
- **API Docs:** [Link]
- **Design Figma:** [Link]
- **Spec Files:** [.specify/memory/constitution.md, specs/001-mvp/spec.md]

### Related Patterns
- [GOLDEN-PATTERNS.md](../docs/GOLDEN-PATTERNS.md) - Design/Dev Decoupling
- [ZEN-MCP-WORKFLOW-ORCHESTRATION.md](../docs/ZEN-MCP-WORKFLOW-ORCHESTRATION.md) - Multi-IA
- [SUB-AGENTS-MASTERY.md](../docs/SUB-AGENTS-MASTERY.md) - Orchestration

### Tools Used
- **MCP Servers:** Context7 (docs), Zen (Multi-IA), Figma (design), ESLint (quality)
- **GitHub Actions:** [Workflow YAML link]
- **Jules Security:** [Report link]

---

**🌟 PROJECT PHILOSOPHY**

> This memory file is the **soul of the project**. It encapsulates the **intentionality** behind every decision. Code shows WHAT we built. Comments show HOW we built it. **This file shows WHY we built it this way.**

> With this memory, any agent (or human, 6 months from now) can understand the project instantly, without reading thousands of lines of code or conversation history.

**Memory Status:** ✅ **LIVING DOCUMENT - UPDATED BY AGENTS DURING IMPLEMENTATION**

---

**Version:** 1.0 (Dynamic Memory - V5)
**Last Updated:** [YYYY-MM-DD HH:MM]
**Template Source:** `templates/project-memory-template.md`

*Project Memory V5: Self-Documenting, Agent-Writable, Intentionality-Preserving* 🧠✨
