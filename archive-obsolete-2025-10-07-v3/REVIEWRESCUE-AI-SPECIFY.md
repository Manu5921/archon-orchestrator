# ReviewRescue AI - Project Specification

**Version:** 1.0
**Date:** 2025-10-07
**Status:** ✅ Ready for /plan
**Constitution:** [REVIEWRESCUE-AI-CONSTITUTION.md](./REVIEWRESCUE-AI-CONSTITUTION.md)

---

## 📋 EXECUTIVE SUMMARY

**What:** SaaS platform that automates personalized review responses for restaurants using AI

**Why:** Restaurant owners lose 2-4h/week responding to Google reviews manually. 70% don't respond at all, damaging SEO and reputation.

**How:** Human-in-the-loop AI system that generates contextual responses → approval queue → publish with 1-click

**Target:** French restaurants (3-10 employees), 69€/month subscription

**MVP Timeline:** 3-4 weeks using hybrid workflow (Claude Sonnet 4.5 + GitHub Actions)

---

## 🎯 PROJECT VISION

### Problem Statement

**Pain Points (Restaurants):**
1. **Time sink:** 15-20 min per review response (search client history, write personalized text, check tone)
2. **Inconsistency:** Different staff = different tones, damaging brand identity
3. **Abandonment:** 70% of reviews go unanswered → Google algorithm penalty
4. **Reactive only:** No proactive content strategy from positive reviews

**Market Validation:**
- 180,000 restaurants in France
- Average 30 reviews/month per active restaurant
- Current solutions: Partoo (300€/month, no AI), Grade.us (US only), manual labor

### Solution Overview

**ReviewRescue AI** = AI-powered review response automation with **mandatory human approval**

**Core Value Proposition:**
1. Save 2-4h/week responding to reviews (ROI: ~400€/month saved labor)
2. Professional, consistent brand tone across all responses
3. Proactive social media content from 5-star reviews
4. Operational intelligence dashboard (problem categorization, trends)

**Differentiation:**
- **Human-in-the-Loop:** No auto-publish (trust + legal compliance)
- **Niche-First:** Restaurant-specific context (menu, hours, chef name)
- **Intelligence opérationnelle:** Analytics > just responses
- **API Independence:** Copy-paste mode fallback if Google API blocks

---

## 👥 USER PERSONAS

### Primary: Restaurant Owner (Solo Decision-Maker)

**Profile:**
- **Name:** Marie, 42 ans
- **Role:** Owner of "Bistrot des Halles" (Paris 10e)
- **Team:** 8 employees (3 waiters, 2 cooks, 1 dishwasher, 2 part-time)
- **Revenue:** 50k€/month, 8% margin
- **Tech skills:** Basic (uses Square POS, Google Business Profile mobile app)

**Pain Points:**
- Responds to reviews on Sunday mornings (2-3h/week)
- Forgets negative reviews → client complains publicly
- Writes generic "Merci!" for 5-star reviews (missed opportunity)
- No time to analyze trends (recurring "food cold" complaints)

**Goals:**
- Reduce review response time to 15 min/week
- Maintain authentic, personalized tone
- Never miss a negative review (reputation risk)
- Extract actionable insights from reviews

**Buying Triggers:**
- Free 14-day trial with no credit card
- See 5 AI-generated responses matching their tone
- Dashboard showing "3 recurring complaints this month"
- Price ≤ 69€/month (vs 400€ labor cost saved)

### Secondary: Multi-Location Manager

**Profile:**
- **Name:** Thomas, 35 ans
- **Role:** Operations Manager for "Les 3 Brasseries" (3 locations)
- **Team:** 40 employees across 3 sites
- **Tech skills:** Advanced (uses Lightspeed, analytics tools)

**Pain Points:**
- Inconsistent responses across locations (each manager has different tone)
- No centralized dashboard to compare location performance
- Spends 6h/week reviewing responses written by staff

**Goals (Post-MVP):**
- Single dashboard for 3 locations
- Brand consistency across all responses
- Benchmark performance (Location A: 4.2★, Location B: 4.6★)

**Note:** MVP focuses on Persona #1 (solo owner). Multi-location = Phase 2 (6 months post-launch).

---

## 🏗️ SYSTEM ARCHITECTURE

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        ReviewRescue AI                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐    │
│  │   Next.js   │ ───> │  Supabase   │ <─── │   Claude    │    │
│  │  Frontend   │      │  Database   │      │  API 3.5    │    │
│  └─────────────┘      └─────────────┘      └─────────────┘    │
│         │                     │                     │            │
│         │                     │                     │            │
│         v                     v                     v            │
│  ┌─────────────────────────────────────────────────────┐       │
│  │            Google Business Profile API              │       │
│  │         (Mode 1: API Write / Mode 2: Copy-Paste)    │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- **Framework:** Next.js 14 (App Router)
- **UI Library:** shadcn/ui (components), Tailwind CSS
- **Forms:** React Hook Form + Zod validation
- **State:** React Context (simple state management)
- **Design Tokens:** Auto-generated by design-specialist agent (T002)

**Backend:**
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth (email/password + magic link)
- **API Routes:** Next.js API routes (serverless)
- **Jobs:** Vercel Cron Jobs (review sync every 4 hours)

**AI:**
- **LLM:** Claude 3.5 Sonnet via Anthropic API
- **Context:** Restaurant profile (name, address, menu, hours, tone examples)
- **Prompt:** System prompt + few-shot examples (3-5 per tone)

**External APIs:**
- **Google Business Profile API:** Review sync + publish responses
- **Fallback:** Copy-paste mode if API unavailable (degraded UX but viable)

**Infrastructure:**
- **Hosting:** Vercel (Next.js optimized)
- **Monitoring:** Vercel Analytics + Supabase Dashboard
- **Payments:** Stripe Checkout (post-MVP, trial free 14 days)

### Data Model (Core Entities)

**1. Accounts (Supabase Auth Users)**
```sql
-- Managed by Supabase Auth
id: uuid (PK)
email: text
created_at: timestamp
```

**2. Restaurants**
```sql
id: uuid (PK)
account_id: uuid (FK -> accounts.id)
name: text
google_place_id: text (unique)
google_account_email: text
address: text
tone: text ('friendly' | 'formal' | 'casual')
context: jsonb {
  menu_highlights: text[],
  chef_name: text,
  hours: text,
  custom_notes: text
}
api_mode: text ('api_write' | 'copy_paste')
created_at: timestamp
```

**3. Reviews**
```sql
id: uuid (PK)
restaurant_id: uuid (FK -> restaurants.id)
google_review_id: text (unique)
author_name: text
rating: int (1-5)
comment: text
created_at: timestamp (Google timestamp)
synced_at: timestamp (our sync job)
```

**4. Responses**
```sql
id: uuid (PK)
review_id: uuid (FK -> reviews.id)
generated_text: text
edited_text: text (nullable, if user edited)
status: text ('pending' | 'approved' | 'published' | 'rejected')
published_at: timestamp (nullable)
created_at: timestamp
```

**5. Problems (Operational Intelligence)**
```sql
id: uuid (PK)
review_id: uuid (FK -> reviews.id)
category: text ('food_cold' | 'slow_service' | 'rude_staff' | 'pricing' | 'noise' | 'other')
severity: text ('minor' | 'moderate' | 'critical')
auto_detected: boolean
created_at: timestamp
```

### API Endpoints (Next.js API Routes)

**Auth:**
- `POST /api/auth/signup` - Create account (Supabase)
- `POST /api/auth/login` - Login (Supabase)
- `POST /api/auth/magic-link` - Passwordless login

**Restaurants:**
- `POST /api/restaurants` - Create restaurant profile
- `PATCH /api/restaurants/:id` - Update profile (tone, context)
- `GET /api/restaurants/:id` - Get restaurant details

**Reviews:**
- `GET /api/reviews?restaurant_id=xxx` - List reviews (paginated)
- `POST /api/reviews/sync` - Manual sync from Google (triggered by cron job)

**Responses:**
- `POST /api/responses/generate` - Generate AI response for review
- `PATCH /api/responses/:id` - Edit generated response
- `POST /api/responses/:id/approve` - Approve response (moves to publish queue)
- `POST /api/responses/:id/publish` - Publish to Google (API mode) or show copy-paste modal

**Analytics:**
- `GET /api/analytics/dashboard?restaurant_id=xxx` - Dashboard stats
- `GET /api/analytics/problems?restaurant_id=xxx` - Categorized problems

**Webhooks (Post-MVP):**
- `POST /api/webhooks/google` - Google Pub/Sub webhook for new reviews

---

## ✨ CORE FEATURES (MVP)

### F1: Restaurant Onboarding

**User Flow:**
1. User signs up (email + password or magic link)
2. Connects Google Business Profile:
   - **Mode 1 (Preferred):** OAuth flow → API write access
   - **Mode 2 (Fallback):** Manual entry of Google Place ID → copy-paste mode
3. Fills restaurant context form:
   - Name, address (auto-filled from Google)
   - Menu highlights (e.g., "Coq au vin signature, homemade desserts")
   - Chef name (optional)
   - Operating hours
   - Tone preference: Friendly / Formal / Casual
4. AI generates 3 sample responses based on tone → user validates

**Acceptance Criteria:**
- [ ] User can create account in <2 min
- [ ] Google OAuth flow works (happy path)
- [ ] Copy-paste mode available if OAuth fails
- [ ] Context form saves to database
- [ ] 3 sample responses generated matching selected tone

**Technical Notes:**
- Use Supabase Auth for signup/login
- Google Business Profile API OAuth: https://developers.google.com/my-business/content/oauth
- Store tone examples in prompt template (3-5 examples per tone)

---

### F2: Review Sync Engine

**User Flow:**
1. System runs cron job every 4 hours (Vercel Cron)
2. Fetches new reviews from Google Business Profile API
3. Saves reviews to database (only new ones, check `google_review_id`)
4. Sends notification if new negative review (≤3 stars)

**Acceptance Criteria:**
- [ ] Cron job triggers every 4 hours
- [ ] New reviews synced to database (no duplicates)
- [ ] Negative reviews flagged in UI (red badge)
- [ ] Email notification sent for ≤3 star reviews (optional, post-MVP)

**Technical Notes:**
- Use Vercel Cron: https://vercel.com/docs/cron-jobs
- Google API endpoint: `GET /v1/accounts/{accountId}/locations/{locationId}/reviews`
- Handle pagination (Google limits 50 reviews per request)
- Store last sync timestamp in `restaurants.last_synced_at`

---

### F3: AI Response Generation

**User Flow:**
1. User clicks "Generate Response" on a review
2. System sends review + restaurant context to Claude API
3. AI generates personalized response (50-150 words)
4. Response appears in approval queue with "Edit" and "Approve" buttons

**Prompt Template (Simplified):**
```
You are responding to a Google review for [Restaurant Name].

CONTEXT:
- Restaurant: [Name], [Address]
- Menu highlights: [menu_highlights]
- Chef: [chef_name]
- Tone: [friendly/formal/casual]

REVIEW:
Rating: [rating]/5
Author: [author_name]
Comment: [comment]

Generate a personalized response (50-150 words) that:
1. Thanks the customer by name
2. Addresses specific points mentioned in review
3. Maintains [tone] tone
4. Invites them back (if positive) or offers to resolve issue (if negative)

Response:
```

**Acceptance Criteria:**
- [ ] AI generates response in <5 seconds
- [ ] Response matches selected tone (friendly/formal/casual)
- [ ] Response references specific review details (not generic)
- [ ] Response length 50-150 words
- [ ] Error handling if Claude API fails (retry 3x, show error message)

**Technical Notes:**
- Use Anthropic API: `POST /v1/messages`
- Model: `claude-3-5-sonnet-20241022`
- Temperature: 0.7 (balance creativity + consistency)
- Max tokens: 300 (ensures 50-150 words)

---

### F4: Approval Queue (Human-in-the-Loop)

**User Flow:**
1. User sees list of pending responses (generated by AI)
2. Can edit response text directly in UI (textarea)
3. Clicks "Approve" → moves to publish queue
4. Clicks "Reject" → response deleted, can regenerate

**UI Components:**
- Review card (left): Author, rating, comment, date
- Response card (right): Generated text, Edit/Approve/Reject buttons
- Filters: All / Pending / Approved / Published / Negative only

**Acceptance Criteria:**
- [ ] Pending responses listed with review context
- [ ] User can edit response text (saves on blur)
- [ ] Approve button moves response to publish queue
- [ ] Reject button deletes response (confirmation modal)
- [ ] Filter by status works (Pending / Approved / etc.)

**Technical Notes:**
- Use `responses.status` field ('pending' | 'approved' | 'published' | 'rejected')
- Optimistic UI updates (instant feedback)
- Auto-save edited text after 1 second debounce

---

### F5: Publish Workflow (Dual Mode)

**Mode 1: API Write (Preferred)**
1. User clicks "Publish" on approved response
2. System calls Google Business Profile API to post response
3. Response status → 'published', `published_at` timestamp saved
4. Success toast: "Response published to Google!"

**Mode 2: Copy-Paste (Fallback)**
1. User clicks "Publish" on approved response
2. Modal shows response text with "Copy to Clipboard" button
3. User copies text, opens Google Business Profile app/web, pastes manually
4. User clicks "Mark as Published" in modal
5. Response status → 'published'

**Acceptance Criteria:**
- [ ] API Write mode publishes to Google successfully
- [ ] Copy-Paste mode shows modal with copy button
- [ ] Published responses marked with green checkmark
- [ ] Error handling if API fails (fallback to copy-paste mode)

**Technical Notes:**
- Google API: `PUT /v1/accounts/{accountId}/locations/{locationId}/reviews/{reviewId}/reply`
- Handle 403 errors (API access revoked) → force copy-paste mode
- Show mode indicator in UI (green badge "API" vs orange badge "Manual")

---

### F6: Analytics Dashboard (Intelligence Opérationnelle)

**Metrics Displayed:**
1. **Response Stats:**
   - Pending responses: 3
   - Published this week: 12
   - Avg response time: 24 hours

2. **Problem Categorization:**
   - Food Quality: 5 mentions (3 "cold food", 2 "bland taste")
   - Service Speed: 8 mentions
   - Staff Behavior: 1 mention
   - Pricing: 2 mentions

3. **Rating Trends:**
   - Line chart: Average rating over last 3 months
   - Bar chart: Rating distribution (1-5 stars)

4. **Top Keywords:**
   - Word cloud: Most mentioned words in reviews (exclude stopwords)

**Acceptance Criteria:**
- [ ] Dashboard shows real-time stats (refresh on load)
- [ ] Problem categorization auto-detects from negative reviews (AI)
- [ ] Charts render correctly (use Recharts or Chart.js)
- [ ] Top keywords extracted from reviews (simple frequency count)

**Technical Notes:**
- Problem detection: Send negative reviews (≤3 stars) to Claude API with classification prompt
- Categories: 'food_cold' | 'slow_service' | 'rude_staff' | 'pricing' | 'noise' | 'other'
- Store in `problems` table for historical tracking

---

### F7: Tone Customization

**User Flow:**
1. User goes to Settings → Tone
2. Sees 3 preset tones with examples:
   - **Friendly:** "Hey [Name]! 🙏 Thanks so much for the love! Our team is thrilled..."
   - **Formal:** "Dear [Name], Thank you for taking the time to share your experience..."
   - **Casual:** "Thanks [Name]! Glad you enjoyed the [dish]. See you soon!"
3. Can select one or upload custom examples (textarea, 3-5 examples)
4. Saves tone → all future responses use this style

**Acceptance Criteria:**
- [ ] User can select preset tone (friendly/formal/casual)
- [ ] User can provide custom examples (optional)
- [ ] Tone saved to `restaurants.tone` field
- [ ] Future responses match selected tone

**Technical Notes:**
- Store custom examples in `restaurants.context.tone_examples` (jsonb array)
- Include examples in Claude prompt as few-shot learning
- Default to "friendly" if no tone selected

---

## 🚫 OUT OF SCOPE (MVP)

**Explicitly excluded from MVP:**
1. **Multi-Platform Support:** Only Google Reviews. No Tripadvisor/Yelp/Facebook (Phase 2)
2. **Auto-Publish Mode:** No bypass of approval queue (trust + legal)
3. **Multi-Location Dashboard:** Single restaurant only (Phase 2)
4. **Social Media Auto-Posts:** Proactive content from 5-star reviews (Phase 2)
5. **Competitor Benchmarking:** Compare your restaurant to competitors (Phase 2)
6. **Email Notifications:** For new reviews (post-MVP, simple to add)
7. **Mobile App:** Web-first (responsive design, mobile-friendly)
8. **White-Label:** Single-tenant only (no agency reselling)
9. **Zapier/Make Integration:** API export (Phase 3)
10. **Sentiment Analysis:** Beyond 1-5 star rating (Phase 2)

**Rationale:** MVP focuses on **core value loop** (sync → generate → approve → publish) with **mandatory human approval** for French restaurants on Google Reviews only.

---

## 🎯 SUCCESS METRICS (MVP)

### Product Metrics

**Activation (Week 1):**
- [ ] User creates account
- [ ] User connects Google Business Profile (API or copy-paste)
- [ ] User approves and publishes first AI-generated response

**Engagement (Weekly Active Users):**
- [ ] User logs in ≥2x per week
- [ ] User approves ≥5 responses per week
- [ ] Avg session duration: 10-15 min (approve queue)

**Retention:**
- [ ] Week 4 retention: ≥60% (users still active after trial)
- [ ] Churn rate: <5% per month (post-trial conversion)

### Business Metrics

**Launch Target (6 months):**
- [ ] 50 paying customers (69€/month = 3,450€ MRR)
- [ ] NPS Score: ≥50 (promoters > detractors)
- [ ] Support tickets: <2 per customer per month

**Time Savings (Validated via User Survey):**
- [ ] Avg time saved: 2-4h per week
- [ ] ROI: 400€ labor saved vs 69€ subscription (5.8x)

### Technical Metrics

**Reliability:**
- [ ] Uptime: ≥99% (Vercel SLA)
- [ ] API success rate: ≥95% (Claude + Google APIs)
- [ ] Avg response generation time: <5 seconds

**Quality:**
- [ ] User edits AI response: <30% of cases (high AI quality)
- [ ] User rejects AI response: <10% of cases
- [ ] P0 Build gate: ✅ PASSED (CI/CD)

---

## 🛡️ RISK MITIGATION

### R1: Google API Access Revoked (EXISTENTIAL)

**Risk:** Google changes API terms or blocks our app

**Mitigation:**
- **Plan A (API Write):** Use official Google Business Profile API with OAuth
- **Plan B (Copy-Paste):** Degraded UX but viable (show modal with copy button)
- **Plan C (Scraping - Last Resort):** Unofficial API (legal gray zone, avoid if possible)

**Monitoring:**
- Track API success rate (alert if <90%)
- User feedback: "Is copy-paste mode acceptable?" (survey post-MVP)

---

### R2: Commoditization (AI Responses Become Standard)

**Risk:** Every tool offers AI responses → no differentiation

**Mitigation:**
- **Focus on Intelligence Opérationnelle:** Dashboard, problem categorization, trends
- **Niche-First:** Restaurant-specific context (menu, chef, hours) → better personalization
- **Human-in-the-Loop:** Trust + compliance (vs auto-publish competitors)

**Monitoring:**
- Track which features users engage with most (dashboard vs responses)
- Competitor analysis: Add features they don't have (e.g., proactive social posts)

---

### R3: Legal Compliance (RGPD + AI Transparency)

**Risk:** RGPD violations, lack of AI disclosure

**Mitigation:**
- **RGPD:** Terms of Service + Privacy Policy (standard Supabase compliance)
- **AI Transparency:** "Response generated by AI, reviewed by owner" (footer in response)
- **Data Retention:** Reviews stored for analytics, deleted on account closure

**Monitoring:**
- Legal review before public launch (1-2h consultation)
- User consent checkbox: "I understand AI generates responses"

---

### R4: Low User Adoption (Free Trial → Paid Conversion)

**Risk:** Users sign up but don't convert to paid (14-day trial)

**Mitigation:**
- **Onboarding Excellence:** 3 sample responses immediately (instant value)
- **Email Drip Campaign:** Day 3 (tips), Day 7 (dashboard tour), Day 12 (upgrade nudge)
- **Pricing Anchor:** Show "400€ labor saved vs 69€ cost" in UI

**Monitoring:**
- Trial → Paid conversion rate (target ≥40%)
- Exit survey for churned users: "Why didn't you subscribe?"

---

## 📅 MVP TIMELINE (Hybrid Workflow)

### Phase 1: Spec-Kit (Already Done ✅)

- [x] Constitution document (this file)
- [x] Specify document (REVIEWRESCUE-AI-SPECIFY.md)
- [ ] Plan document (next: /plan)
- [ ] Tasks breakdown (next: /tasks)

**Time:** 30 min (Constitution + Specify already completed)

---

### Phase 2: Bootstrap (1-2 min)

```bash
/bootstrap
```

**Meta-orchestrator generates:**
- backend-specialist.md (API + Supabase + Claude integration)
- frontend-specialist.md (Next.js + shadcn/ui + forms)
- design-specialist.md (design-tokens.json + wireframes)
- testing-specialist.md (Playwright E2E tests)

**Time:** 1-2 min (automated)

---

### Phase 3: Implementation (3-4 weeks)

**Week 1: Infrastructure + Auth (T001-T015)**
- Next.js 14 setup (App Router)
- Supabase project creation
- Auth (email/password + magic link)
- Database schema (5 tables)
- Basic UI shell (layout + navigation)

**Week 2: Core Review Flow (T016-T040)**
- Google Business Profile API integration (OAuth + sync)
- Claude API integration (response generation)
- Approval queue UI (list + edit + approve)
- Publish workflow (API Write + Copy-Paste fallback)

**Week 3: Analytics + Problem Detection (T041-T060)**
- Dashboard (response stats + rating trends)
- Problem categorization (AI classification)
- Tone customization (preset + custom examples)
- Settings page (restaurant profile + tone)

**Week 4: Testing + Deployment (T061-T078)**
- E2E tests (Playwright: onboarding → sync → approve → publish)
- Unit tests (API routes + utilities)
- Performance optimization (Lighthouse 90+)
- Deploy to Vercel (production)

**Time:** 3-4 weeks (3-4h per day, hybrid workflow with GitHub Actions)

---

## 🔧 TECHNICAL CONSTRAINTS

### Performance Requirements

- **Page Load Time:** <2 seconds (Vercel CDN)
- **AI Response Generation:** <5 seconds (Claude API latency)
- **Review Sync:** <30 seconds per restaurant (Google API)

### Scalability Requirements

- **MVP:** 1-100 restaurants (single-tenant, Supabase free tier handles 500MB)
- **Post-MVP:** 100-1,000 restaurants (upgrade Supabase to Pro: $25/month)
- **Phase 2:** 1,000+ restaurants (consider multi-tenancy + sharding)

### Security Requirements

- **Auth:** Supabase Row Level Security (RLS) enforced on all tables
- **API Keys:** Claude API key + Google OAuth credentials stored in Vercel env vars
- **HTTPS:** Enforced (Vercel default)
- **Rate Limiting:** 10 requests/min per user (prevent abuse)

---

## 📚 DOCUMENTATION REQUIREMENTS

**User-Facing:**
- [ ] Onboarding tutorial (interactive tooltips, 3 steps)
- [ ] FAQ page (10 common questions)
- [ ] Help Center (copy-paste mode instructions, tone guide)

**Developer:**
- [ ] README.md (project setup, env vars, local dev)
- [ ] API documentation (Swagger/OpenAPI, post-MVP)
- [ ] Deployment guide (Vercel + Supabase setup)

**Business:**
- [ ] Pricing page (Starter 69€/month, trial 14 days free)
- [ ] Terms of Service + Privacy Policy (RGPD compliant)

---

## 🎨 DESIGN REQUIREMENTS

### Design Tokens (T002 - Auto-Generated)

**Colors:**
- Primary: Blue (#3B82F6) - Trust, professionalism
- Success: Green (#10B981) - Published responses
- Warning: Orange (#F59E0B) - Pending approval
- Danger: Red (#EF4444) - Negative reviews
- Neutral: Gray (#64748B) - Text, borders

**Typography:**
- Headings: Satoshi (700 weight)
- Body: Inter (400 weight)
- Code: JetBrains Mono (for API keys)

**Spacing:**
- xs: 0.25rem, sm: 0.5rem, md: 1rem, lg: 1.5rem, xl: 2rem

### Wireframes (T002 - Generated by design-specialist)

1. **dashboard.svg** - Main layout (sidebar + stats + review list)
2. **approval-queue.svg** - Review card + response editor
3. **settings.svg** - Restaurant profile + tone settings

### Shadcn/ui Components Needed

```json
{
  "components": [
    "button", "card", "input", "textarea", "form", "label",
    "select", "table", "dialog", "badge", "toast", "tabs"
  ]
}
```

---

## ✅ ACCEPTANCE CRITERIA (MVP Complete)

**Product:**
- [ ] User can sign up, connect Google, and onboard in <5 min
- [ ] Reviews sync every 4 hours from Google Business Profile
- [ ] AI generates personalized responses matching selected tone
- [ ] User can edit, approve, and publish responses (API or copy-paste)
- [ ] Dashboard shows response stats + problem categorization
- [ ] Negative reviews (≤3 stars) flagged prominently

**Technical:**
- [ ] P0 Build gate: ✅ PASSED (CI/CD)
- [ ] P1 Lint gate: ✅ PASSED (ESLint + TypeScript strict)
- [ ] P2 Tests gate: ≥80% coverage (unit + E2E)
- [ ] Deploy to Vercel: Production URL live
- [ ] Uptime: ≥99% (Vercel SLA)

**Business:**
- [ ] 5 beta testers recruited (friends/network)
- [ ] 3/5 beta testers publish ≥10 responses in Week 1
- [ ] NPS survey sent to beta testers (target ≥50)
- [ ] Stripe payment integration (post-trial conversion)

---

## 🚀 NEXT STEPS

### Immediate Actions (Today)

1. **Run /plan command:**
   ```bash
   cd reviewrescue-ai
   /plan
   ```
   → Generates `specs/001-mvp/plan.md` with architecture decisions

2. **Run /tasks command:**
   ```bash
   /tasks
   ```
   → Generates `specs/001-mvp/tasks.md` (50-80 tasks, T001-T078)

3. **Validate Google Business Profile API access:**
   - Check API quotas: https://console.cloud.google.com/apis/api/mybusinessbusinessinformation.googleapis.com
   - Create OAuth credentials (2-3h setup)

### Week 1 Deliverables

1. **Bootstrap agents (1-2 min):**
   ```bash
   /bootstrap
   ```

2. **Start implementation (GitHub Actions):**
   - Create issue: "Implement T001-T010 (Infrastructure)"
   - Label: `run-claude`
   - Wait 3-4h → PR auto-created

3. **Review PR on mobile:**
   - Approve changes
   - Merge to main

---

## 📖 GLOSSARY

**Terms:**
- **Review Queue:** Pending AI-generated responses awaiting human approval
- **API Write Mode:** Direct publishing to Google via API (preferred)
- **Copy-Paste Mode:** Fallback UX where user manually posts response (degraded but viable)
- **Human-in-the-Loop:** Mandatory human approval before publishing (non-negotiable MVP)
- **Niche-First Strategy:** Focus on single market segment (restaurants) before expanding
- **Intelligence Opérationnelle:** Analytics + insights > just automated responses

**Acronyms:**
- **MVP:** Minimum Viable Product (14-day trial, core features only)
- **P0-P4:** Quality gates (P0 = Build must pass, P1 = Lint, P2 = Tests, P3 = Docs, P4 = Performance)
- **RGPD:** Règlement Général sur la Protection des Données (EU data privacy law)
- **NPS:** Net Promoter Score (customer satisfaction metric)
- **MRR:** Monthly Recurring Revenue (subscription business model)

---

**Status:** ✅ Specification Complete - Ready for /plan
**Next Command:** `/plan` (generates architecture decisions + plan.md)
**Estimated MVP Timeline:** 3-4 weeks (hybrid workflow)
**Constitution Reference:** [REVIEWRESCUE-AI-CONSTITUTION.md](./REVIEWRESCUE-AI-CONSTITUTION.md)

*Built with Claude Sonnet 4.5 (30h+ focus, 0% errors, +18% planning)*
