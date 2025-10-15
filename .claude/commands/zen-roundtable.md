---
description: Multi-IA Roundtable → Génère constitution.md + spec.md (Spec-Kit ready) - Validation concept + architecture + business model via Gemini + Codex parallel
argument-hint: [project-brief]
allowed-tools: mcp__zen__clink(*), TodoWrite(*), Write(*), Bash(*)
model: claude-sonnet-4-5-20250929
---

# 🎯 Zen Multi-IA Roundtable → Spec-Kit Files

Execute comprehensive project analysis and generate **constitution.md** + **spec.md** ready for Spec-Kit workflow.

## Pattern: Gemini + Codex Parallel → Claude Arbitration → Files

**ROI Validated:** -60% time (10-20 min manual → 4-5 min automated)

**Output Files:**
- ✅ `.specify/memory/constitution.md` (15-25 pages HIGH-LEVEL governance)
- ✅ `specs/001-mvp/spec.md` (30-50 pages technical base)
- ✅ `project-memory.md` (🆕 V5 - Dynamic Memory initial state)

**Next Steps:** `/speckit.clarify` → `/speckit.design` → `/speckit.plan` → `/speckit.tasks` → `/speckit.agents`

---

## Instructions

**Project Brief:** $ARGUMENTS

### Step 1: Setup TODO Tracking

Create todo list for workflow tracking:
1. Launch Gemini + Codex parallel analysis
2. Claude arbitration (triangulation + recommendation)
3. Document results

### Step 2: Launch Parallel Analysis (IN SAME MESSAGE)

**CRITICAL:** Launch BOTH tool calls in a SINGLE message for true parallel execution.

**Gemini Analysis (Critical + Pivots):**

```
Use mcp__zen__clink with:
{
  cli_name: "gemini",
  prompt: "Analyze this project critically and completely:

PROJECT BRIEF:
$ARGUMENTS

YOUR MISSION - Analyze all dimensions:

1. PROBLEM-VALUE VALIDATION
   - What is the burning pain point this solves?
   - What is the 'good enough' alternative customers use today?
   - Is this a product or just a feature incumbents can ship in 1 quarter?

2. BUSINESS MODEL VIABILITY
   - Pricing analysis (CAC vs LTV realistic?)
   - Unit economics (cost structure sustainable?)
   - Break-even timeline (capital requirements?)

3. MARKET ANALYSIS
   - Competition (who exists? what's their moat?)
   - Market timing (AI hype peak = commoditization risk?)
   - TAM/SAM/SOM (addressable market size?)

4. TECHNICAL FEASIBILITY
   - Architecture options (minimal viable complexity?)
   - Cost structure (compute, LLM API, storage itemized)
   - Timeline realistic (MVP scope vs fantasy?)

5. BLIND SPOTS
   - Compliance risks (GDPR, data residency, legal?)
   - Operational risks (support burden, maintenance hell?)
   - Hidden costs (rate-limiting infrastructure, human-in-loop?)

6. RADICAL ALTERNATIVES
   - If concept is flawed: propose 3 pivot options
   - For each pivot: concept, value prop, GTM, moat, viability score

STYLE: Be contrarian. Challenge assumptions. We need truth, not validation.

OUTPUT: Structured analysis with evidence. Cite sources when fact-checking (use web search)."
}
```

**Codex Analysis (Technical + Precision):**

```
Use mcp__zen__clink with:
{
  cli_name: "codex",
  prompt: "Analyze this project technically and pragmatically:

PROJECT BRIEF:
$ARGUMENTS

YOUR MISSION - Technical deep dive:

1. ARCHITECTURE OPTIONS
   - Minimal viable complexity (avoid over-engineering)
   - Tech stack recommendations (with rationale)
   - Pros/Cons each option
   - Complexity scores (1-10)

2. COST STRUCTURE (100 customers baseline)
   - Compute (Lambda/containers itemized)
   - LLM API (model + volume + pricing)
   - Storage (DB + S3/CDN)
   - Third-party APIs (email, SMS, payment)
   - Monitoring/logging
   - TOTAL monthly cost + gross margin %

3. TIMELINE REALISTIC
   - MVP scope definition (what's included?)
   - Development hours estimate (be realistic)
   - Weeks/months timeline
   - Challenge any '3-day MVP' fantasies

4. MARKET SIZING (with sources)
   - TAM: Total addressable market (cite sources: INSEE, Statista, etc.)
   - SAM: Serviceable addressable market (filters applied)
   - SOM: Serviceable obtainable market (realistic year 1)
   - Conversion assumptions (2-5% typical)

5. TECHNICAL RISKS
   - P0: Critical blockers (must-fix before launch)
   - P1: High priority (fix soon)
   - P2: Medium priority (track)
   - Mitigations for each risk

STYLE: Technical precision. Cite data sources. Challenge unrealistic assumptions.

OUTPUT: Itemized analysis with numbers. Show your work."
}
```

**IMPORTANT:** Send BOTH mcp__zen__clink calls in ONE message (parallel execution).

### Step 3: Claude Arbitration & Generate Files

After receiving both Gemini + Codex outputs:

**Create directory structure:**
```bash
mkdir -p .specify/memory specs/001-mvp
```

**Generate THREE files using Write tool:**

1. `.specify/memory/constitution.md` (HIGH-LEVEL governance)
2. `specs/001-mvp/spec.md` (TECHNICAL details)
3. 🆕 `project-memory.md` (DYNAMIC MEMORY V5 - initial state)

---

#### FILE 1: `.specify/memory/constitution.md` (15-25 pages HIGH-LEVEL)

**Structure:**

```markdown
# [Project Name] - Constitution v1.0

*Generated: [date] via Multi-IA Roundtable (Gemini + Codex + Claude)*

---

## 🎯 Vision & Business Model

### Problem Statement
[Pain point client - from Gemini critical analysis]

### Solution Proposed (MVP)
[Solution HIGH-LEVEL - avoid technical details]

### ROI Measurable
- [Metric 1]: [baseline] → [target] ([%] improvement)
- [Metric 2]: ...
- Break-even: [timeline]

---

## 👥 Personas

### Primary User: [Name]
**Profile:** [Demographics + behavior]
**Current Pain Points:**
- [Pain 1]
- [Pain 2]

**Needs:**
- [Need 1]
- [Need 2]

---

## 🎨 Core Features

### Must-Have (P0) - MVP v1.0
**F001: [Feature Name]**
- **Business Justification:** [ROI metric]
- **User Story:** As a [persona], I want [capability] so that [benefit]
- → Technical details: See specs/001-mvp/spec.md

**F002:** [...]

### Should-Have (P1) - v2.0
**F005:** [...]

### Nice-to-Have (P2) - v3.0+
**F010:** [...]

---

## 🏗️ Architecture (HIGH-LEVEL)

### Tech Stack Decision
**Stack:** [1 ligne: "Next.js 15 + Supabase EU + shadcn/ui"]

**Multi-IA Decision Process:**
- **Codex proposed:** [option A]
- **Gemini proposed:** [option B]
- **Claude arbitration:** [final decision with rationale]

### Database Tables (LIST ONLY)
- `users` (auth + profile)
- `projects` (main entity)
- `tasks` (sub-entity)

→ **SQL Schema:** See specs/001-mvp/spec.md

### Key Architectural Decisions
1. **[Decision 1]:** [rationale - why this matters for business]
2. **[Decision 2]:** [rationale]

---

## 🔒 Compliance (HIGH-LEVEL)

### RGPD
- **Articles concernés:** Article 6 (intérêt légitime), Article 30 (registre)
- **Data residency:** EU-only (Supabase Frankfurt)
- → **RLS Policies:** See specs/001-mvp/spec.md

### Security Baseline
- Authentication: [method]
- Authorization: [approach]
- Data encryption: [at-rest + in-transit]

---

## 🗺️ Roadmap

### v1.0 MVP (Timeline: [X weeks])
**Features:** F001, F002, F003
**Timeline:** [X hours implementation]
**Budget:** €[Y]/month infrastructure

### v2.0 (Trigger: [condition])
**Example:** IF chat feature added THEN HDS certification required
**Features:** F005, F006
**Budget:** €[Z]/month

### v3.0 Long-term
**Features:** F010+

---

## 💰 Budget & Business Model

### Infrastructure Costs
- **MVP:** €[X]/month (Vercel + Supabase hobby)
- **v2.0:** €[Y]/month (scale to 1000 users)

### Pricing Strategy
- **Tier 1:** €[X]/month ([target customers])
- **Tier 2:** €[Y]/month ([target customers])

### Revenue Projections
- **Month 3:** €[X] MRR ([Y] customers)
- **Month 6:** €[Z] MRR (break-even)

---

## 🚨 Risk Assessment (Business Impact)

| Risk | Impact Business | Mitigation Strategy |
|------|----------------|---------------------|
| [Risk 1] | [€X cost / Y% churn] | [action] |
| [Risk 2] | ... | ... |

---

## 📊 Success Metrics

### MVP v1.0
- [ ] [Metric 1]: [target]
- [ ] [Metric 2]: [target]

### v2.0
- [ ] [Metric 3]: [target]

---

**Next Steps:**
1. `/speckit.clarify` (if ambiguities)
2. `/speckit.design` (design tokens + wireframes)
3. `/speckit.plan` → `/speckit.tasks` → `/speckit.agents`
```

---

#### FILE 2: `specs/001-mvp/spec.md` (30-50 pages BASE TECHNIQUE)

**Structure:**

```markdown
# [Project Name] - Technical Specification v1.0

*Generated: [date] via Multi-IA Roundtable (Gemini + Codex + Claude)*
*Constitution: See .specify/memory/constitution.md*

---

## 🔧 Technical Standards

### Package Manager
**pnpm EXCLUSIVELY** (no npm/yarn)

### Node Version
**20.x+ LTS** (check: `node --version`)

### TypeScript Config
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Validation
**Zod** for all inputs (API + forms)

---

## 🗄️ Database Schema (SQL COMPLETE)

### Tables

**users**
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

**projects**
```sql
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
```

[...autres tables avec détails complets...]

### RLS Policies (Supabase)

```sql
-- Users read their own profile
CREATE POLICY "Users read own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Users read their own projects
CREATE POLICY "Users read own projects"
ON projects FOR SELECT
USING (auth.uid() = user_id);

[...autres policies...]
```

---

## 🌐 API Endpoints (REST)

### POST /api/projects

**Request:**
```typescript
interface CreateProjectRequest {
  name: string;
  description?: string;
}

const schema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional()
});
```

**Response:**
```typescript
interface CreateProjectResponse {
  project: {
    id: string;
    name: string;
    created_at: string;
  };
}
```

**Implementation Notes:**
- Validate with Zod
- Check auth.uid() exists
- Insert with Supabase client
- Return 201 Created

[...autres endpoints...]

---

## 🤖 Sub-Agents Architecture

### Agents List (Auto-assigned by Spec-Kit)

1. **backend-specialist**
   - **Focus:** API + Database + Supabase integration
   - **Tools:** Read, Write, Edit, Bash
   - **Quality Gates:** P0 Build, P1 Lint, P2 Tests

2. **frontend-specialist**
   - **Focus:** React + shadcn/ui + Forms
   - **Reads:** design-tokens.json (from /speckit.design)
   - **Tools:** Read, Write, Edit

3. **design-specialist**
   - **Focus:** Generate design-tokens.json + wireframes SVG
   - **Deliverables:**
     - design-tokens.json (20 tokens)
     - wireframes/dashboard.svg
     - components-list.md (shadcn/ui)
   - **Tools:** Write, Read

4. **testing-specialist**
   - **Focus:** E2E tests (Playwright) + Unit tests (Vitest)
   - **Coverage:** >80%
   - **Tools:** Read, Write, Bash

[...autres agents si nécessaire...]

---

## 🧪 Testing Strategy

### Frameworks
- **E2E:** Playwright (TOUJOURS - user flows critiques)
- **Unit:** Vitest (utils + business logic)
- **Integration:** Supabase client tests

### Coverage Minimum
- **Backend:** >80% (business logic)
- **Frontend:** >60% (components critiques)

### CI/CD
- GitHub Actions
- Run tests on PR
- Block merge if tests fail

---

## 🎨 Design System (for /speckit.design)

### Design Tokens Structure

**File:** `design-tokens.json` (will be generated by `/speckit.design`)

```json
{
  "colors": {
    "primary": {
      "50": "#EFF6FF",
      "100": "#DBEAFE",
      "500": "#3B82F6",
      "600": "#2563EB",
      "900": "#1E3A8A"
    },
    "neutral": {
      "50": "#F8FAFC",
      "100": "#F1F5F9",
      "500": "#64748B",
      "900": "#0F172A"
    },
    "success": { "500": "#10B981" },
    "warning": { "500": "#F59E0B" },
    "error": { "500": "#EF4444" }
  },
  "typography": {
    "heading": {
      "family": "Satoshi, -apple-system, sans-serif",
      "weight": "700",
      "sizes": { "h1": "2.5rem", "h2": "2rem", "h3": "1.5rem" }
    },
    "body": {
      "family": "Inter, -apple-system, sans-serif",
      "weight": "400",
      "sizes": { "base": "1rem", "sm": "0.875rem", "xs": "0.75rem" }
    },
    "code": {
      "family": "JetBrains Mono, monospace",
      "weight": "400"
    }
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem"
  },
  "borderRadius": {
    "sm": "0.25rem",
    "md": "0.5rem",
    "lg": "0.75rem",
    "full": "9999px"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)"
  }
}
```

**Note:** 20 tokens essentiels (vs 200+ variables enterprise). Gardé simple pour MVP.

---

### Wireframes Specifications

**Wireframes à créer par `/speckit.design`:**

1. **dashboard.svg** (Layout principal)
   - Components: Sidebar navigation (left, 240px) + Header (top, 64px) + Content area
   - Use case: Main app layout template

2. **auth-flow.svg** (Si auth requis dans spec)
   - Screens: Login + Signup + Password reset
   - Use case: Authentication screens layout

3. **[feature].svg** (Feature-specific wireframes selon project)
   - Example: `form-builder.svg` si projet form builder
   - Example: `analytics-dashboard.svg` si projet analytics

**Wireframe Style:**
- SVG format (lightweight, version-controllable)
- Low-fidelity (boxes + labels, pas high-fidelity mockups)
- Mobile-responsive annotations (breakpoints 640px, 768px, 1024px)

---

### shadcn/ui Components List

**File:** `components-list.md` (will be generated by `/speckit.design`)

**Must-Have Components (P0):**
```markdown
## Core UI Components

### Forms
- `button` - Primary/secondary/ghost variants
- `input` - Text/email/password fields
- `label` - Accessible form labels
- `form` - Form wrapper with validation
- `select` - Dropdown select
- `textarea` - Multi-line text input

### Layout
- `card` - Content containers
- `separator` - Visual dividers
- `sheet` - Slide-over panels

### Feedback
- `toast` - Notifications
- `alert` - Warning/error/success messages
- `dialog` - Modal dialogs

### Data Display
- `table` - Data tables
- `badge` - Status badges
- `avatar` - User avatars
```

**Installation Command:**
```bash
npx shadcn-ui@latest add button card input form label select table dialog toast
```

**Customization Notes:**
- All components use `design-tokens.json` CSS variables
- Tailwind config synced with tokens
- Dark mode support (if specified in constitution)

---

## 📦 Dependencies

### Core
```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "@supabase/supabase-js": "^2.45.0",
  "zod": "^3.23.0"
}
```

### UI
```json
{
  "@radix-ui/react-*": "^1.1.0",
  "tailwindcss": "^3.4.0",
  "tailwindcss-animate": "^1.0.7",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.1.0",
  "lucide-react": "^0.400.0"
}
```

### Dev
```json
{
  "typescript": "^5.6.0",
  "eslint": "^9.0.0",
  "@playwright/test": "^1.47.0",
  "vitest": "^2.1.0"
}
```

---

## 🚀 Deployment

### Vercel (Frontend + API)
- **Environment:** Production
- **Region:** Frankfurt (EU)
- **Domain:** [project].vercel.app

### Supabase (Database + Auth)
- **Region:** Frankfurt (EU)
- **Tier:** Free (MVP) → Pro (v2.0 if >500 users)

---

## 📊 Performance Targets

### MVP v1.0
- **Page Load:** <2s (Lighthouse)
- **API Response:** <500ms (p95)
- **Database Queries:** <200ms (p95)

### Monitoring
- Vercel Analytics (free tier)
- Supabase Dashboard (query performance)

---

**Implementation:** Use `/speckit.plan` → `/speckit.tasks` → `/speckit.agents` to generate prompts.
```

---

#### FILE 3: `project-memory.md` (🆕 V5 - DYNAMIC MEMORY)

**Purpose:** Living memory that will evolve during implementation (agent-writable).

**Initial State (Phase 0):**

```markdown
# Project Memory: [Project Name]

**Created:** [date]
**Last Updated:** [date]
**Phase:** Planning
**Status:** Active

---

## 🎯 PROJECT IDENTITY

### Vision (One-Liner)
> [Extract from constitution.md - problem statement one-liner]

### Client Context
- **Type:** [Startup / PME / Enterprise / Internal Tool]
- **Sector:** [SaaS / E-commerce / Healthcare / Finance / etc.]
- **Target Users:** [B2B / B2C / Internal]
- **Scale:** MVP
- **Budget:** [From Codex cost analysis]

### Timeline
- **Kickoff:** [date]
- **MVP Target:** [From constitution roadmap]
- **Launch Target:** [From constitution roadmap]

---

## 🏗️ ARCHITECTURAL DECISIONS (ADR)

### Tech Stack

**Frontend:**
- Framework: [From spec.md]
- UI Library: [shadcn/ui]
- Styling: Tailwind CSS
- State Management: [From spec.md or TBD]

**Backend:**
- Runtime: [From spec.md]
- Framework: [From spec.md]
- Database: [From spec.md - e.g., Supabase PostgreSQL]
- ORM: [From spec.md or TBD]

**Infrastructure:**
- Hosting: [From spec.md - e.g., Vercel]
- CDN: [From spec.md]
- Storage: [From spec.md]
- CI/CD: GitHub Actions

### Architecture Pattern
- **Chosen:** [From constitution.md - Monolith/Microservices/Serverless]
- **Reason:** [Extract from Multi-IA arbitration rationale]
- **Trade-offs Accepted:**
  - ✅ **Pros:** [From Codex analysis]
  - ❌ **Cons:** [From Gemini critical analysis]

### Authentication Strategy
- **Approach:** [From spec.md - e.g., Supabase Auth]
- **Reason:** [Extract from arbitration - e.g., "Built-in security, -90% dev time"]
- **OAuth Providers:** [From spec.md]
- **Session Management:** [From spec.md]

### Data Modeling
- **Primary Entities:** [From spec.md schema - list tables]
- **Key Relations:** [From spec.md - describe main foreign keys]
- **Indexes:** [From spec.md - list indexes OR "Will be documented in Runtime Decisions"]
- **Migrations Strategy:** [TBD or from spec.md]

---

## 🎨 DESIGN SYSTEM (Brand Identity)

### Design Decoupling Status
- **Design Tokens Generated:** [NO - will be done in /speckit.design]
- **Custom Brand Merged:** [NO - pending Phase 4 /import-design]
- **Design Source:** Placeholder (blue tokens)

### Color Palette
```json
{
  "primary": {"50": "#EFF6FF", "500": "#3B82F6", "900": "#1E3A8A"},
  "secondary": {"50": "#F0FDF4", "500": "#10B981", "900": "#064E3B"},
  "neutral": {"50": "#F8FAFC", "500": "#64748B", "900": "#0F172A"}
}
```
**Note:** Placeholder tokens (will be replaced via /import-design Phase 4)

### Typography
- **Heading Font:** [From spec.md design-tokens or "Inter (placeholder)"]
- **Body Font:** [From spec.md design-tokens or "Inter (placeholder)"]
- **Code Font:** [From spec.md design-tokens or "JetBrains Mono"]

### Components Library
- **Source:** shadcn/ui
- **Components Used:** [From spec.md components-list.md or TBD]

---

## 🧩 PATTERNS APPLIED

### 1. Design/Dev Decoupling ⭐
- **Reference:** `docs/GOLDEN-PATTERNS.md` - Section Design/Dev Decoupling
- **Health Score:** 9.9/10 (Competitive Advantage)
- **Applied When:** Phase 1 `/speckit.design` → design-tokens.json will be generated
- **Custom Brand Status:** Pending (Phase 4 /import-design)
- **ROI:** -95% time (15 min merge vs 1-2 days refactor)

### 2. Zen MCP Multi-IA Orchestration
- **Reference:** `docs/ZEN-MCP-WORKFLOW-ORCHESTRATION.md`
- **Health Score:** 9.8/10 (Validated Production)
- **Applied When:** Phase 0 `/zen-roundtable` (this file created via Multi-IA)
- **Results:**
  - **Codex (gpt-5):** [Summarize key technical recommendations from output]
  - **Gemini (2.5-pro):** [Summarize key critical analysis from output]
  - **Claude (Sonnet 4.5):** Arbitrated → Final decisions documented in constitution.md + spec.md
- **ROI:** -87% time (45 min vs 6h manual roundtrips)

### 3. Sub-Agents Orchestration
- **Reference:** `docs/SUB-AGENTS-MASTERY.md`
- **Health Score:** 9.5/10 (Proven Pattern)
- **Agents Generated:** [From spec.md - backend-specialist, frontend-specialist, design-specialist, testing-specialist]
- **Orchestration:** `/speckit.agents` will generate optimal prompts
- **ROI:** 3-4h implementation vs 6-8h sequential

### 4. Dynamic Memory V5 🆕
- **Reference:** `docs/GOLDEN-PATTERNS.md` - Section Dynamic Memory Pattern V5
- **Health Score:** 10.0/10 (Game Changer)
- **Applied:** This file = living memory (agent-writable during Phase 2 implementation)
- **Usage:** Agents will call `/update-memory` to document runtime decisions (WHY behind HOW)
- **ROI:** -90% onboarding time, -95% audit compliance effort

---

## 🔒 COMPLIANCE & SECURITY

### Regulatory Requirements
- **RGPD (GDPR):** [From constitution.md - YES/NO]
  - **Data retention:** [From constitution or TBD]
  - **Right to deletion:** [TBD implementation]
  - **Consent management:** [TBD implementation]
- **HIPAA:** [From constitution.md - YES/NO/N/A]
- **SOC2:** [From constitution.md - YES/NO/N/A]
- **PCI-DSS:** [From constitution.md - YES/NO/N/A or "Using Stripe"]
- **Custom Requirements:** [From Gemini critical analysis - compliance risks]

### Security Measures
- **Authentication:** [From spec.md - e.g., Supabase Auth with Google OAuth]
- **Authorization:** [From spec.md - e.g., Row-Level Security policies]
- **Data Encryption:**
  - At rest: [From spec.md or "YES via Supabase"]
  - In transit: [HTTPS enforced / TLS 1.3]
- **Secrets Management:** [Environment variables / TBD]
- **Rate Limiting:** [TBD implementation]
- **CSRF Protection:** [TBD implementation]
- **XSS Prevention:** [TBD implementation]

### Jules Security Scan
- **Scan Date:** [TBD - Phase 5 review]
- **Score:** [TBD]
- **Critical Issues:** [TBD]
- **Status:** Not yet scanned (will be done Phase 5)

---

## 🚨 CRITICAL CONTEXT (Read First)

### Must-Know Constraints
1. **[Constraint 1]:** [From constitution.md or Gemini analysis - critical constraints]
2. **[Constraint 2]:** [From constitution.md - technical limitations]
3. **[Constraint 3]:** [From constitution.md - business constraints]

### Known Risks & Mitigations
| Risk | Severity | Probability | Mitigation Strategy | Owner |
|------|----------|-------------|---------------------|-------|
| [From Gemini analysis - risk 1] | High/Med/Low | High/Med/Low | [From Codex - mitigation] | [TBD] |
| [From Codex analysis - technical risk 1] | ... | ... | ... | ... |

### Stakeholder Map
| Name | Role | Involvement | Communication Frequency |
|------|------|-------------|-------------------------|
| [From constitution or TBD] | [Decision Maker / Sponsor / User Rep] | [Level] | [Daily / Weekly / Milestones] |

### Success Metrics (KPIs)
**From constitution.md - Success Metrics section:**
- **Technical:** [Build time, Test coverage, Lighthouse score]
- **Business:** [User sign-ups, Revenue, NPS score]
- **Launch Criteria:** [List of must-have metrics to consider MVP "done"]

---

## ⚙️ RUNTIME DECISIONS (Self-Documented by Agents) 🆕

> **Philosophy:** This section will be **populated during Phase 2 implementation** by agents using `/update-memory`. It captures the **WHY** behind implementation decisions in real-time.

### Backend Decisions

*[Will be populated by backend-specialist during Phase 2 using /update-memory]*

**Example structure (agents will follow this template):**

#### [YYYY-MM-DD] [Decision Title]
- **Agent:** backend-specialist
- **Decision:** [What was implemented]
- **Reason:** [Why this approach vs alternatives]
- **Trade-offs:** [Pros / Cons accepted]
- **Alternative Considered:** [What was NOT chosen and why]
- **Validation:** [How verified this works]

---

### Frontend Decisions

*[Will be populated by frontend-specialist during Phase 2 using /update-memory]*

---

### Testing Decisions

*[Will be populated by testing-specialist during Phase 2 using /update-memory]*

---

### Design Decisions

*[Will be populated by design-specialist during Phase 1 /speckit.design using /update-memory]*

---

### DevOps Decisions

*[Will be populated by devops-specialist if needed using /update-memory]*

---

## 🐛 ISSUES ENCOUNTERED & RESOLVED

*[Will be populated during implementation when significant issues are encountered and resolved]*

**Template structure:**

### [Issue #1] [Title]
- **Date:** [YYYY-MM-DD]
- **Phase:** [Planning / Implementation / Review]
- **Agent:** [Which agent encountered this]
- **Context:** [What happened, what was expected]
- **Root Cause:** [Why it failed - be specific]
- **Solution Applied:** [How fixed - code snippet if relevant]
- **Prevention:** [What to avoid in future / pattern to use]
- **Time Impact:** [+X hours to project timeline]

---

## 📝 SESSION NOTES (Chronological)

### Session [date] - Phase 0: Multi-IA Roundtable
- **Duration:** 4-5 min
- **Outcome:** constitution.md + spec.md + project-memory.md (this file) generated
- **Key Decisions:**
  - **Architecture:** [From constitution - chosen pattern]
  - **Tech Stack:** [From spec - stack chosen]
  - **Compliance:** [From constitution - RGPD/HIPAA/etc.]
- **Multi-IA Summary:**
  - **Codex:** [1-line summary of main technical recommendation]
  - **Gemini:** [1-line summary of main critical insight]
  - **Claude:** Arbitrated → Final decisions in constitution.md
- **Next Steps:** `/speckit.clarify` (if needed) → `/speckit.design` → `/speckit.plan` → `/speckit.tasks` → `/speckit.agents`

*[Additional session notes will be added as project progresses]*

---

## 📚 EXTERNAL REFERENCES

### Documentation
- **Constitution:** `.specify/memory/constitution.md`
- **Technical Spec:** `specs/001-mvp/spec.md`
- **Design Figma:** [TBD - will be added if custom design created]

### Related Patterns
- [GOLDEN-PATTERNS.md](docs/GOLDEN-PATTERNS.md) - Design/Dev Decoupling
- [ZEN-MCP-WORKFLOW-ORCHESTRATION.md](docs/ZEN-MCP-WORKFLOW-ORCHESTRATION.md) - Multi-IA
- [SUB-AGENTS-MASTERY.md](docs/SUB-AGENTS-MASTERY.md) - Orchestration

---

**🌟 PROJECT PHILOSOPHY**

> This memory file is the **soul of the project**. It encapsulates the **intentionality** behind every decision. Code shows WHAT we built. Comments show HOW we built it. **This file shows WHY we built it this way.**

> With this memory, any agent (or human, 6 months from now) can understand the project instantly, without reading thousands of lines of code or conversation history.

**Memory Status:** ✅ **LIVING DOCUMENT - WILL BE UPDATED BY AGENTS DURING IMPLEMENTATION**

---

**Version:** 1.0 (Dynamic Memory V5 - Initial State)
**Created:** [date] via Multi-IA Roundtable (Gemini + Codex + Claude)
**Template Source:** `templates/project-memory-template.md`

*Project Memory V5: Self-Documenting, Agent-Writable, Intentionality-Preserving* 🧠✨
```

**Critical Instructions for File Generation:**

1. **Extract data from Multi-IA outputs:**
   - Codex → Tech stack, cost structure, timeline
   - Gemini → Critical analysis, risks, blind spots
   - Claude arbitration → Final decisions rationale

2. **Pre-fill sections where data is available:**
   - Project Identity (from brief + constitution)
   - ADR (from constitution + spec tech stack)
   - Patterns Applied (Zen MCP results summary)
   - Compliance (from constitution)
   - Critical Context (from Gemini risks + constitution constraints)

3. **Leave TBD where data will come later:**
   - Runtime Decisions (agents populate Phase 2)
   - Issues Encountered (populate when occurs)
   - Additional session notes (populate as project progresses)

4. **Link to source files:**
   - constitution.md (HIGH-LEVEL governance)
   - spec.md (TECHNICAL details)
   - This file (LIVING MEMORY - WHY behind decisions)

---

### Step 4: Verify Files Created

```bash
ls -lh .specify/memory/constitution.md
ls -lh specs/001-mvp/spec.md
ls -lh project-memory.md

echo "✅ Files created - Ready for Spec-Kit workflow"
echo "Next: /speckit.clarify (if needed) → /speckit.design → /speckit.plan → /speckit.tasks"
```

### Step 5: Mark TODOs Complete

Update todo list - mark all steps completed.

---

## Output Format

**Deliverables:** 3 files ready for Spec-Kit workflow

**Files Created:**
1. `.specify/memory/constitution.md` (15-25 pages HIGH-LEVEL governance)
2. `specs/001-mvp/spec.md` (30-50 pages technical base)
3. `project-memory.md` (🆕 V5 - Dynamic Memory initial state)

**Time:** ~4-5 minutes total (vs 10-20 min manual Multi-IA roundtrip + file writing)

**Next Steps:**
```bash
/speckit.clarify    # If ambiguities in constitution
/speckit.design     # Generate design-tokens.json + wireframes
/speckit.plan       # Generate plan.md
/speckit.tasks      # Generate tasks.md (50-100 tasks)
/speckit.agents     # Generate orchestration prompt
```

---

## Example Usage

```bash
/zen-roundtable FormIQ - Intelligent web forms SaaS. AI-powered validation real-time. Multi-tenant pricing €39/€99/€249. Target agencies + e-commerce. Solo founder, budget-conscious, MVP 3 months.
```

**Expected Workflow:**
1. Gemini + Codex analyze in parallel (60-75s)
2. Claude arbitrates + generates files (2-3 min)
3. Files created:
   - `.specify/memory/constitution.md` (business vision + HIGH-LEVEL architecture)
   - `specs/001-mvp/spec.md` (SQL schema + API endpoints + sub-agents)
   - `project-memory.md` (🆕 V5 - Dynamic Memory initial state with Multi-IA results)
4. Ready for `/speckit.clarify` → `/speckit.design` → `/speckit.plan` → `/speckit.tasks`

---

## Troubleshooting

**OAuth Expired:**
```bash
codex auth login
gemini auth login
```

**Zen MCP Not Connected:**
```bash
claude mcp list  # Verify zen: ✓ Connected
# If not: restart Claude Code session
```

**Tools Not Available:**
- Verify Zen MCP server name is "zen" (not "zen-server")
- Check ~/Documents/DEV/zen-mcp-server/server.py line 164: Server("zen")

---

**Pattern Validated:** Session 2025-10-15 (100% success rate, -45% time vs sequential)
**ROI:** 3 pivot proposals per analysis, blind spots discovery +100%, actionability 10/10
