# Workflow Improvements V6.2 - GitHub Automation

**Date:** 2025-11-13
**Context:** Discussion about GitHub Phase 2 pertinence and automation opportunities
**Status:** Ideas captured, not yet implemented

---

## Problem Statement

GitHub Phase 2 is valuable (pro workflow, scalability, async security, multi-device) BUT can be optimized:
- Current: 2 separate steps (planning → GitHub setup → implementation)
- Manual `/speckit.github` exists but not integrated in main workflow
- Solo dev doesn't need PR review overhead (but still uses same workflow as teams)

---

## Proposed Improvements

### 1. **Integrate `/speckit.github` into `/speckit.final`** 🔥 P0

**Current workflow:**
```bash
/speckit.tasks
/speckit.agents
/speckit.github       # ← Manual step (30 sec)
/speckit.final
```

**Proposed workflow:**
```bash
/speckit.tasks
/speckit.agents
/speckit.final --auto-github  # ← Integrated, optional flag
```

**Implementation:**
- Modify `.claude/commands/speckit.final.md`
- Add optional `--auto-github` flag
- Run `/speckit.github` workflow before implementation if flag present
- Environment variable alternative: `ARCHON_AUTO_GITHUB=true`

**ROI:** -30 sec + smoother workflow (1 command vs 2)

---

### 2. **Mode "Solo Dev" vs "Team Workflow"** 🔥 P0

**Problem:** Solo founder doesn't need PR review (overhead)

**Solution:** Project configuration

**File: `.archon.config.json`**
```json
{
  "workflow": {
    "github_mode": "solo",  // "solo" | "team"
    "auto_merge": true,     // Auto-merge PR if solo
    "require_review": false // Skip PR review if solo
  }
}
```

**Behavior:**
- **Solo mode:** `/speckit.github` creates branch + commit + push + auto-merge (0 PR overhead)
- **Team mode:** `/speckit.github` creates PR + waits review (classic workflow)

**ROI:** -1-2 min (skip PR review if solo) + context-adapted

---

### 3. **CI/CD Integration - Jules Security** ⭐ P1

**Current:** Jules Security = manual, optional, experimental

**Proposed:** Automatic CI on PR

**File: `.github/workflows/archon-ci.yml`**
```yaml
name: Archon Quality Gates

on:
  pull_request:
    branches: [main]

jobs:
  quality-gates:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # P0 Build
      - name: Build Check
        run: npm run build

      # P1 Lint
      - name: ESLint
        run: npm run lint

      # P4 Observability
      - name: Validate Observability
        run: node scripts/viewPulse.sh

      # Jules Security (async)
      - name: Security Scan
        run: |
          curl -X POST $JULES_WEBHOOK_URL \
            -d "pr_number=${{ github.event.pull_request.number }}"
```

**ROI:** 0 time overhead (async) + automatic security + green checkmarks on PR

---

### 4. **Mobile Notifications** ⭐ P1

**Problem:** No notification when implementation complete

**Solution:** Webhook + mobile push

**File: `.github/workflows/notify-mobile.yml`**
```yaml
name: Mobile Notification

on:
  workflow_run:
    workflows: ["Archon Quality Gates"]
    types: [completed]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send push notification
        uses: actions/github-script@v6
        with:
          script: |
            // Use GitHub API to send notification
            // "✅ ai-scraping-pro: Implementation complete (2h45, 99 tasks)"
```

**ROI:** 0 overhead + simplified mobile monitoring

---

## Optimized Workflow V6.2 (Proposed)

**Phase 0: Gemini Analysis (5-10 min)**
```bash
/zen-roundtable "Brief: AI-Scraping Pro"
```

**Phase 1: Spec-Kit Planning (30-35 min)**
```bash
/speckit.constitution
/speckit.specify
/speckit.init
/speckit.design
/speckit.plan
/speckit.tasks
/speckit.agents
```

**Phase 2-3: GitHub + Implementation (2h45-3h) ← MERGED**
```bash
/speckit.final --auto-github --mode=solo
# Auto:
#   1. Create branch feature/ai-scraping-pro-mvp
#   2. Commit planning artifacts
#   3. Push to GitHub
#   4. Create PR (auto-merge if solo mode)
#   5. Launch implementation (backend→frontend→testing)
#   6. Checkpoints P0-P4 every 10 tasks
#   7. Mobile notification when complete
```

**Phase 4: Design Import (15 min)**
```bash
/import-design custom-tokens.json
```

**Phase 5: Review (optional if solo) + Merge (1 min)**
```bash
# Solo mode: Auto-merged
# Team mode: Manual review + merge
```

---

## Summary of Improvements

| Improvement | Time ROI | Complexity ROI | Priority |
|------------|----------|----------------|----------|
| 1. `/speckit.final --auto-github` | -30 sec | 1 command vs 2 | 🔥 P0 |
| 2. Solo vs Team mode | -1-2 min | Context-adapted | 🔥 P0 |
| 3. CI/CD Jules Security | 0 (async) | Auto security | ⭐ P1 |
| 4. Mobile notifications | 0 | Simplified monitoring | ⭐ P1 |

---

## Next Steps

1. **Short term (now):** Use `/speckit.github` (already exists) instead of manual
2. **Medium term (V6.2):** Merge `/speckit.github` into `/speckit.final --auto-github`
3. **Long term (V7.0):** Solo/team mode + automatic CI/CD

---

## References

- **Source discussion:** Session 2025-11-13 (GitHub workflow analysis)
- **Existing command:** `.claude/commands/speckit.github.md` (463 lines)
- **Current workflow:** `CLAUDE.md` Section "Workflow V6 MVP Phases"
- **Context bundles:** `.agents/context-bundles/` (for disaster recovery)

---

**Status:** 💡 Ideas captured, awaiting implementation prioritization
