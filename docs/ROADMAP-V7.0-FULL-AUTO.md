# 🚀 ROADMAP V7.0 - Full Autonomous Pipeline

**Status:** 📋 Vision / Roadmap
**Target:** V7.0 (Future - Q1 2026?)
**Philosophy:** "ONE command → Complete MVP (4-6h autonomous, 20 min human)"

---

## 🎯 Vision

### Current Reality (V6.2.1)
```bash
# Manual workflow (8 commands)
/zen-roundtable "Brief..."     # 5 min
/speckit.init                  # 1 min
/speckit.design                # 5 min
/speckit.plan                  # 2 min
/speckit.tasks                 # 3 min
/speckit.agents                # 1 min
/speckit.final                 # 2-3h
# → Manual PR creation         # 5 min

Total: 2-3h autonomous + 25 min manual = 8 interactions
```

### Target V7.0 (Full Auto)
```bash
# ONE command pipeline
archon-full-auto "Brief: SaaS CRM B2B, Next.js 15, Supabase, €39/mois..."

# Pipeline (100% autonomous 4-6h):
PHASE 0: Gemini Analysis (5 min)
PHASE 1: Claude Planning (30 min)
PHASE 2: Gemini Design (15 min - 3 variants auto-scored)
PHASE 3: Claude Implementation (2-3h)
PHASE 4: Codex Code Review (30 min)
PHASE 5: Jules Security Scan (15 min)
PHASE 6: Claude Fixes (1h)
PHASE 7: Deploy + PR (5 min)

# Human intervention:
- Initial: Brief (5 min)
- Final: PR review + merge (15 min)

Total: 4-6h autonomous + 20 min human = 1 interaction
```

**ROI Target:**
- Time: -85% (8 interactions → 1)
- Human effort: -60% (50 min → 20 min)
- Quality: +30% (multi-IA validation)

---

## 🧩 Architecture Multi-IA

```
                    ORCHESTRATOR (Claude Sonnet 4.5)
                            |
        +-------------------+-------------------+
        |                   |                   |
   ANALYSIS            DESIGN              VALIDATION
    (Gemini)          (Gemini)          (Codex + Jules)
        |                   |                   |
   Problem/Value      3 Variants         Code Review
   Tech Stack         Previews           Security Scan
   Risks              Selection          Compliance
        |                   |                   |
        +-------------------+-------------------+
                            |
                    IMPLEMENTATION
                   (Claude Sub-Agents)
                            |
                   Backend → Frontend → Testing
                            |
                    FINAL PRODUCT (PR)
```

### IA Roles

**Claude Sonnet 4.5 (Orchestrator):**
- Pipeline coordination
- Planning (spec-kit phases)
- Implementation (sub-agents)
- Fixes application
- PR creation

**Gemini 2.5 Pro (Analysis + Design):**
- Phase 0: Comprehensive business + technical analysis
- Phase 2: Design system generation (3 variants)
- Auto-scoring: WCAG + aesthetics + brand fit

**Codex (Code Review):**
- Architecture patterns validation
- Best practices enforcement
- Performance hotspots detection
- Refactoring suggestions

**Jules Security (Validation):**
- OWASP Top 10 compliance
- Dependency vulnerabilities
- RGPD/HIPAA compliance
- Rate limiting verification

---

## 📋 Implementation Phases

### Phase 1: Core Pipeline (V7.0.0 - 2-3 days dev)

**Create:**
- `.claude/commands/archon.full-auto.md` (main command)
- `.claude/agents/full-auto-orchestrator.md` (orchestrator sub-agent)

**Features:**
- Sequential phase execution (Phases 0-7)
- Checkpoint every 30 min (progress save)
- Context bundle auto-save (>150K tokens)
- Error handling (stop on failure, ask human)

**Test:** Simple landing page (Astro) - 1h autonomous

**Deliverable:** Working pipeline (Phases 0-3 only, skip validation for now)

---

### Phase 2: Multi-IA Integration (V7.0.1 - 1 week)

**Integrate:**
- **Codex CLI** via Zen MCP (Phase 4: Code Review)
  - Configure `~/Documents/DEV/zen-mcp-server/conf/cli_clients/codex.json`
  - OAuth setup (if needed)
  - Test code review output

- **Jules Security** (Phase 5: Security Scan)
  - Research Jules API/CLI availability
  - IF API exists: REST integration
  - IF CLI exists: Bash integration
  - ELSE: Skip Phase 5 (document as "future when available")

**Test:** Medium project (Next.js SaaS) - 3h autonomous

**Deliverable:** Complete pipeline (Phases 0-7) with validation

---

### Phase 3: Design Auto-Scoring (V7.0.2 - 1 week)

**Implement:**
- Design variant scoring algorithm:
  - WCAG compliance (40% weight) - automated check
  - Aesthetics score (30% weight) - Gemini evaluation
  - Brand fit (30% weight) - constitution.md alignment

**Scoring Logic:**
```typescript
interface DesignScore {
  wcag: number;        // 0-100 (contrast ratios, font sizes)
  aesthetics: number;  // 0-100 (Gemini evaluation)
  brand: number;       // 0-100 (constitution alignment)
  total: number;       // Weighted average
}

function scoreDesign(variant: DesignVariant): DesignScore {
  const wcag = checkWCAG(variant); // Automated
  const aesthetics = askGemini("Rate aesthetics 0-100: " + variant);
  const brand = compareToBrief(variant, constitution);

  return {
    wcag,
    aesthetics,
    brand,
    total: (wcag * 0.4) + (aesthetics * 0.3) + (brand * 0.3)
  };
}

// Auto-select highest scoring variant
const winner = variants.sort((a, b) => b.score.total - a.score.total)[0];
```

**Test:** Generate 3 design variants, verify auto-selection

**Deliverable:** Design phase fully autonomous (no human selection needed)

---

### Phase 4: Advanced Error Recovery (V7.1.0 - 1 week)

**Implement:**
- Checkpoint restoration (resume from last successful phase)
- Retry logic (max 3 attempts per phase)
- Fallback strategies:
  - Phase 2 (Design) fail → Use placeholder tokens
  - Phase 4 (Codex) fail → Skip code review
  - Phase 5 (Jules) fail → Skip security scan
  - Phase 6 (Fixes) fail → Document issues, proceed to PR

**Error Recovery Logic:**
```typescript
async function executePhase(phase: Phase): Promise<Result> {
  let attempts = 0;
  while (attempts < 3) {
    try {
      const result = await phase.execute();
      saveCheckpoint(phase.id, result);
      return result;
    } catch (error) {
      attempts++;
      if (attempts === 3) {
        // Apply fallback strategy
        const fallback = phase.fallback();
        if (fallback) {
          logWarning(`Phase ${phase.id} failed, using fallback`);
          return fallback;
        } else {
          throw error; // No fallback available, stop pipeline
        }
      }
      await sleep(5000); // Wait 5s before retry
    }
  }
}
```

**Test:** Simulate failures at each phase, verify recovery

**Deliverable:** Robust pipeline (95% success rate even with partial failures)

---

### Phase 5: Monitoring & Observability (V7.1.1 - 2 weeks)

**Implement:**
- Real-time dashboard (web UI):
  - Current phase progress
  - Time elapsed / estimated remaining
  - Token usage tracking
  - Last checkpoint status

**Tech Stack:**
- Frontend: Astro + React islands
- Backend: Express.js + Server-Sent Events (SSE)
- Data: observability-pulse.jsonl (real-time stream)

**Features:**
- Live progress bar per phase
- Logs streaming (last 50 lines)
- Pause/Resume controls
- Manual checkpoint trigger

**UI Mockup:**
```
+------------------------------------------+
| Archon Full Auto Pipeline - Live Monitor |
+------------------------------------------+
| Project: ai-crm-saas                     |
| Started: 14:23:15                        |
| Elapsed: 2h 15m / Est: 4h                |
+------------------------------------------+
| ✅ PHASE 0: Gemini Analysis (5 min)      |
| ✅ PHASE 1: Claude Planning (30 min)     |
| ✅ PHASE 2: Gemini Design (15 min)       |
| 🔄 PHASE 3: Claude Implementation        |
|    └─ Backend: 35/35 tasks ✅            |
|    └─ Frontend: 28/40 tasks (70%) 🔄     |
|    └─ Testing: 0/24 tasks ⏳             |
| ⏳ PHASE 4: Codex Code Review            |
| ⏳ PHASE 5: Jules Security Scan          |
| ⏳ PHASE 6: Claude Fixes                 |
| ⏳ PHASE 7: Deploy + PR                  |
+------------------------------------------+
| Tokens: 125K / 200K (62%)                |
| Last checkpoint: 14:35:22 (8 min ago)   |
| [Pause] [Manual Checkpoint] [Logs]      |
+------------------------------------------+
```

**Test:** Run pipeline with dashboard open, verify real-time updates

**Deliverable:** Web dashboard for monitoring long-running pipelines

---

### Phase 6: Notifications (V7.1.2 - 3 days)

**Implement:**
- Slack notifications:
  - Pipeline started
  - Each phase completed
  - Pipeline completed (with PR URL)
  - Pipeline failed (with error details)

- Email notifications (optional):
  - Same as Slack but via email

**Integration:**
```bash
# Slack webhook
curl -X POST https://hooks.slack.com/services/YOUR_WEBHOOK \
  -d '{"text": "🚀 Pipeline completed! PR ready: <PR_URL>"}'

# Email (Resend API)
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -d '{
    "from": "archon@yourdomain.com",
    "to": "you@yourdomain.com",
    "subject": "Pipeline completed",
    "html": "PR ready: <a href=\"PR_URL\">Review now</a>"
  }'
```

**Test:** Verify notifications sent at each phase

**Deliverable:** Slack + Email integration (configurable)

---

### Phase 7: Multi-Project Parallel (V7.2.0 - 2 weeks)

**Vision:** Run 3-4 pipelines simultaneously (different projects)

**Architecture:**
```
Mac LOCAL (24/7)
├── Pipeline 1: ai-crm-saas (Phase 3 - 2h remaining)
├── Pipeline 2: landing-ecom (Phase 1 - 25 min remaining)
├── Pipeline 3: blog-astro (Phase 6 - 45 min remaining)
└── Pipeline 4: dashboard-analytics (Phase 0 - 3 min remaining)
```

**Implementation:**
- Process isolation (separate Claude Code sessions)
- Token quota management (50K per pipeline max)
- Priority queue (urgent projects first)
- Resource limits (max 4 concurrent)

**Benefits:**
- Time efficiency: 4 MVPs in 6h (vs 24h sequential)
- ROI: Build 8-12 MVPs/day (vs 2-3 currently)

**Test:** Run 3 pipelines simultaneously, verify no conflicts

**Deliverable:** Multi-project orchestration

---

## 🔌 Technical Requirements

### 1. Zen MCP Extensions

**Current (V6.2.1):**
- ✅ Gemini CLI (OAuth) - `mcp__zen__clink({ cli_name: "gemini" })`

**Needed (V7.0):**
- 🔲 Codex CLI integration
  - Create `~/zen-mcp-server/conf/cli_clients/codex.json`
  - Configure OpenAI API key OR OAuth
  - Test code review responses

**Config Example:**
```json
{
  "name": "codex",
  "command": "openai",
  "args": ["api", "chat.completions.create"],
  "model": "gpt-4-turbo",
  "system_prompt": "You are an expert code reviewer. Focus on architecture, best practices, and performance."
}
```

---

### 2. Jules Security Integration

**Status:** 🔍 Research needed

**Options:**
- **Option 1:** Jules API (if available)
  - REST endpoint for code scanning
  - OAuth or API key authentication
  - JSON output (vulnerabilities + compliance)

- **Option 2:** Jules CLI (if available)
  - Install Jules CLI tool
  - Bash integration: `jules scan ./ --output security-report.md`

- **Option 3:** Alternative (if Jules unavailable)
  - Use Snyk API for dependency scan
  - Use OWASP ZAP for security scan
  - Custom OWASP Top 10 checker

**Research Task:** Contact Google for Jules availability / API access

---

### 3. Context Management

**Challenge:** 4-6h pipeline = 500K-1M tokens (exceeds 200K limit)

**Solution:** Auto context bundles
```typescript
// Check token usage every 10 tasks
if (tokenUsage > 150000) {
  // Save context bundle
  await saveBundleAuto({
    phase: currentPhase,
    progress: completedTasks,
    files: modifiedFiles,
    decisions: runtimeDecisions
  });

  // Continue with fresh context
  await resumeWithBundle(bundlePath);
}
```

**Test:** Simulate 500K token session, verify bundle restore works

---

### 4. Rate Limits

**Gemini API:**
- Limit: 15 RPM (requests per minute)
- Pipeline usage: ~5 requests (Analysis + Design)
- Status: ✅ OK (well below limit)

**Codex API:**
- Limit: TBD (need to check OpenAI docs)
- Pipeline usage: ~3 requests (Code review)
- Status: 🔍 Research needed

**Jules API:**
- Limit: TBD (need to check Google docs)
- Pipeline usage: ~2 requests (Security scan)
- Status: 🔍 Research needed

---

## 📊 Success Metrics (V7.0)

**Time Efficiency:**
- Target: 4-6h autonomous (vs 24-32h manual)
- ROI: -85% development time

**Human Effort:**
- Target: 20 min human (vs 8-12h manual)
- ROI: -90% human intervention

**Quality:**
- Target: Build ✅ Lint ✅ Tests ✅ Security ✅
- Multi-IA validation: +30% bug detection

**Throughput:**
- Target: 8-12 MVPs/week (vs 2-3 currently)
- ROI: 4× productivity increase

**Cost:**
- Target: $15-30 tokens per MVP
- Acceptable if client €5K+

---

## ⚠️ Risks & Mitigations

### Risk 1: Context Overflow (HIGH)
**Problem:** 4-6h pipeline exceeds 200K token limit
**Mitigation:** Auto context bundles every 150K tokens
**Fallback:** Checkpoints every 30 min (manual resume)

### Risk 2: API Rate Limits (MEDIUM)
**Problem:** Codex/Jules rate limits block pipeline
**Mitigation:** Exponential backoff + retry logic
**Fallback:** Skip validation phases (Phases 4-5)

### Risk 3: Cost Explosion (MEDIUM)
**Problem:** 500K-1M tokens = $15-30 per MVP
**Mitigation:** Budget alerts (stop if >$50)
**Fallback:** Use Haiku 4.5 for some phases (-70% cost)

### Risk 4: Error Recovery Failure (MEDIUM)
**Problem:** Phase fails, no checkpoint available
**Mitigation:** Checkpoint every 30 min automatically
**Fallback:** Manual intervention (human debug)

### Risk 5: Jules Unavailability (LOW)
**Problem:** Jules API/CLI not available yet
**Mitigation:** Use Snyk + OWASP ZAP as alternative
**Fallback:** Skip Phase 5 (document as future)

---

## 🗓️ Timeline Estimate

**V7.0.0 (Core Pipeline):** 2-3 days dev + 2 days testing = **1 week**
**V7.0.1 (Multi-IA Integration):** 1 week dev + 3 days testing = **1.5 weeks**
**V7.0.2 (Design Auto-Scoring):** 1 week dev + 2 days testing = **1.5 weeks**
**V7.1.0 (Error Recovery):** 1 week dev + 3 days testing = **1.5 weeks**
**V7.1.1 (Monitoring Dashboard):** 2 weeks dev + 3 days testing = **2.5 weeks**
**V7.1.2 (Notifications):** 3 days dev + 1 day testing = **4 days**
**V7.2.0 (Multi-Project):** 2 weeks dev + 1 week testing = **3 weeks**

**Total Estimate:** ~12 weeks (3 months) from start to V7.2.0 complete

**Minimum Viable (V7.0.0):** 1 week (usable but basic)

---

## 🎯 Next Steps (When Ready)

**Prerequisites (Do Now):**
1. ✅ Document vision (this file) - DONE
2. ✅ Update CLAUDE.md with V7.0 reference
3. 🔲 Research Jules Security availability
4. 🔲 Test Codex CLI integration (Zen MCP)
5. 🔲 Validate 30h autonomous capability (long session test)

**Implementation (V7.0.0 - When Decided):**
1. Create `/archon.full-auto` command
2. Create `full-auto-orchestrator` sub-agent
3. Test on simple project (landing page)
4. Iterate based on results

**Current Status:** 📋 Vision documented, ready for future implementation

---

**Version:** 7.0.0 (Roadmap)
**Status:** 📋 Vision / Planning Phase
**Target Date:** Q1 2026 (when needed)
**Author:** Beehive Innovations / Archon Team
**Last Updated:** 2025-11-21

*Full Autonomous Pipeline: The future of AI-powered development* 🚀🤖
