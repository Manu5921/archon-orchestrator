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

**Generate TWO files using Write tool:**

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

### Step 4: Verify Files Created

```bash
ls -lh .specify/memory/constitution.md
ls -lh specs/001-mvp/spec.md

echo "✅ Files created - Ready for Spec-Kit workflow"
echo "Next: /speckit.clarify (if needed) → /speckit.design → /speckit.plan → /speckit.tasks"
```

### Step 5: Mark TODOs Complete

Update todo list - mark all steps completed.

---

## Output Format

**Deliverables:** 2 files ready for Spec-Kit workflow

**Files Created:**
1. `.specify/memory/constitution.md` (15-25 pages HIGH-LEVEL governance)
2. `specs/001-mvp/spec.md` (30-50 pages technical base)

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
