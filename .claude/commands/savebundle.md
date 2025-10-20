---
description: Save current agent session context to recoverable bundle
argument-hint: [optional-bundle-name]
allowed-tools: Write(*), Read(*), Bash(*), Grep(*)
model: claude-sonnet-4-5-20250929
---

# 💾 Save Context Bundle

Save current agent session state to `.agents/context-bundles/` for recovery after context overflow.

**Purpose:** Create "save point" for long-running sessions (2h+) to enable fast recovery if context explodes.

---

## Instructions

**Context:** $ARGUMENTS (optional - defaults to auto-generated name)

### What Context Bundles Save

**State Captured:**
1. **Files Read** - All files accessed during session (with line ranges)
2. **Commands Executed** - Bash, git, npm/pnpm commands run
3. **Edits Made** - Files modified (with context of changes)
4. **Decisions Documented** - Key architectural/implementation choices
5. **Current Understanding** - Agent's mental model of project state
6. **Tools Used** - MCP tools called (Context7, ESLint, Zen, etc.)
7. **Checkpoints Passed** - Quality gates executed (build, lint, tests)

**What's NOT Saved:**
- Full file contents (only paths + line ranges)
- Binary files or large outputs
- Conversation history verbatim (only key decisions)

---

### Step 1: Determine Bundle Name

```bash
# Default: YYYY-MM-DD_HH-MM_agent-type.md
BUNDLE_NAME="${ARGUMENTS:-$(date +%Y-%m-%d_%H-%M)_session.md}"
BUNDLE_PATH=".agents/context-bundles/$BUNDLE_NAME"

# Create directory if needed
mkdir -p .agents/context-bundles
```

**If argument provided:** Use it directly (e.g., `backend-specialist-auth-implementation`)

---

### Step 2: Gather Session Metadata (Robustified with Auto-Init + Fallbacks)

```bash
# Auto-initialize session.log if missing
if [ ! -f ".agents/session.log" ]; then
  mkdir -p .agents
  echo "$(date +%H:%M:%S) session started (auto-init by /savebundle)" > .agents/session.log
fi

# Git info (with fallback if git unavailable)
if command -v git &>/dev/null && [ -d .git ]; then
  GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "detached")
  GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
  FILES_CHANGED=$(git diff --name-only HEAD 2>/dev/null | wc -l | tr -d ' ')
else
  # Fallback: Use directory name + timestamp
  GIT_BRANCH="no-git"
  GIT_COMMIT="pwd-$(basename "$(pwd)")-$(date +%Y%m%d)"
  FILES_CHANGED="unknown (no git)"
fi

# Session timing (read from session.log, fallback to current time)
SESSION_START=$(grep "session started" .agents/session.log 2>/dev/null | tail -1 | cut -d' ' -f1 || date +%H:%M:%S)
SESSION_NOW=$(date +%H:%M:%S)

# Calculate duration in minutes
START_EPOCH=$(date -j -f "%H:%M:%S" "$SESSION_START" +%s 2>/dev/null || date +%s)
NOW_EPOCH=$(date +%s)
DURATION_MIN=$(( (NOW_EPOCH - START_EPOCH) / 60 ))
```

---

### Step 3: Extract Recent Tool Calls

**Read observability-pulse.jsonl** (if exists) to extract tool calls:

```bash
# Last 50 events (covers typical 2h session)
tail -50 observability-pulse.jsonl 2>/dev/null > /tmp/recent-events.jsonl
```

**Parse events:**
- `type: "read"` → Files read
- `type: "edit"` → Files modified
- `type: "bash"` → Commands executed
- `type: "checkpoint"` → Quality gates

---

### Step 4: Generate Bundle Content

**Write** bundle file with this structure:

```markdown
# Context Bundle: [SESSION_NAME]

**Created:** [TIMESTAMP]
**Agent:** [AGENT_TYPE or "main-session"]
**Branch:** [GIT_BRANCH]
**Commit:** [GIT_COMMIT]
**Duration:** [SESSION_START] → [SESSION_NOW]

---

## 📂 FILES READ (Chronological)

[Extract from observability-pulse.jsonl OR manual list]

- `path/to/file.ts:1-250` - [TIMESTAMP] - [WHY: "Understanding auth flow"]
- `config/supabase.ts:1-100` - [TIMESTAMP] - [WHY: "Reading config"]
- `docs/WORKFLOW-V6-MVP.md:100-250` - [TIMESTAMP] - [WHY: "Learning workflow"]

**Total Files Read:** [COUNT]

---

## ✏️ EDITS MADE (Chronological)

[Extract from git diff + observability-pulse.jsonl]

### [TIMESTAMP] - `src/lib/auth.ts` (New File)
**Change:** Created authentication module
**Context:** Implementing Supabase Auth with RLS
**Lines:** 0 → 150
**Key Functions:** `signIn()`, `signOut()`, `getSession()`

### [TIMESTAMP] - `database/schema.sql:45-60`
**Change:** Added RLS policies
**Context:** Securing user data access
**Lines Changed:** +15
**SQL:** `CREATE POLICY user_data_access ...`

**Total Edits:** [COUNT] files

---

## 🔧 COMMANDS EXECUTED (Chronological)

[Extract from observability-pulse.jsonl OR bash history]

- `[TIMESTAMP]` - `pnpm add @supabase/supabase-js` - Installing auth library
- `[TIMESTAMP]` - `pnpm run build` - ✅ PASS - Checkpoint P0
- `[TIMESTAMP]` - `pnpm run lint` - ✅ PASS (4 warnings) - Checkpoint P1
- `[TIMESTAMP]` - `pnpm run test:unit` - ✅ PASS (12/12) - Checkpoint P2

**Total Commands:** [COUNT]

---

## 🧠 CURRENT UNDERSTANDING

**Project State:**
- **Phase:** [Planning / Implementation / Review]
- **Feature:** [Current feature being worked on]
- **Progress:** [X/Y tasks completed]

**Technical Context:**
[Agent's mental model - what has been understood]

Example:
- Auth flow uses Supabase Auth with JWT tokens
- Database has RLS policies enabled per-user
- Middleware validates tokens on protected routes
- Tests cover sign-in, sign-out, session refresh

**Next Steps:**
[What agent was planning to do next before bundle saved]

1. Finish auth middleware tests
2. Add password reset flow
3. Document auth setup in README
4. Run full build + test suite

---

## 🎯 KEY DECISIONS

[Significant architectural/implementation choices made during session]

### Decision 1: Supabase Auth Strategy
**Choice:** Use Supabase Auth (not NextAuth)
**Reason:** Built-in RLS, -90% boilerplate
**Trade-offs:** Vendor lock-in accepted for speed
**Files Affected:** `src/lib/auth.ts`, `database/schema.sql`

### Decision 2: JWT Token Storage
**Choice:** httpOnly cookies (not localStorage)
**Reason:** XSS protection
**Trade-offs:** Requires server-side session management
**Files Affected:** `src/middleware/auth.ts`

---

## 🔗 MCP TOOLS USED

[Context7, ESLint, Zen, etc.]

- `[TIMESTAMP]` - `mcp__context7__get-library-docs` - Supabase Auth RLS documentation
- `[TIMESTAMP]` - `mcp__eslint__lint-files` - Linted 15 files (4 warnings)
- `[TIMESTAMP]` - `mcp__zen__chat` - Discussed auth flow with Gemini

---

## ✅ CHECKPOINTS PASSED

[Quality gates executed]

- ✅ P0 Build - `pnpm run build` - PASS
- ✅ P1 Lint - ESLint 15 files - 4 warnings (acceptable)
- ✅ P2 Tests - 12/12 unit tests PASS
- ⏳ P3 Docs - README updated (pending final review)

---

## 🚨 BLOCKERS / ISSUES

[Any errors, blockers, or unresolved issues]

- None currently

---

## 📊 SESSION METRICS

- **Files Read:** [COUNT]
- **Files Modified:** [COUNT]
- **Commands Executed:** [COUNT]
- **Checkpoints Passed:** [COUNT] / 4 (P0-P3)
- **MCP Calls:** [COUNT]
- **Duration:** [HH:MM]

---

## 🔄 RECOVERY INSTRUCTIONS

**To restore this session context:**

```bash
/loadbundle .agents/context-bundles/[THIS_BUNDLE_NAME]
```

**What will be recovered:**
- 60-70% of technical understanding
- Files read/modified (paths, not full contents)
- Commands executed (reproducible steps)
- Decisions made (WHY documented)
- Current mental model of project

**What to re-read manually:**
- `project-memory.md` (project-level WHY - always read at startup)
- Key files from "FILES READ" section (refresh understanding)
- Latest git commits (verify current state)

---

**Bundle Version:** 1.0
**Created by:** Context Bundles System (Archon Orchestrator V6.1.3)
**Pattern Source:** Dev Dan - Context Engineering ADV2
```

---

### Step 5: Populate Bundle with Real Data (Robustified with Fallbacks)

**Preferred Method: Use contextBundler.cjs (if available)**

```bash
if [ -f "scripts/contextBundler.cjs" ]; then
  # Use contextBundler.cjs for structured bundle generation
  node scripts/contextBundler.cjs generate "$BUNDLE_NAME" 2>&1
  BUNDLER_EXIT=$?

  if [ $BUNDLER_EXIT -eq 0 ]; then
    echo "✅ Bundle generated via contextBundler.cjs"
  else
    echo "⚠️  contextBundler.cjs failed, using fallback bash generation"
  fi
else
  echo "ℹ️  contextBundler.cjs not found, using fallback bash generation"
fi
```

**Fallback Method: Manual Extraction via Bash/Git/jq**

If contextBundler.cjs unavailable OR fails, extract data from multiple sources:

1. **observability-pulse.jsonl** (if exists)
   ```bash
   if [ -f "observability-pulse.jsonl" ]; then
     # Parse JSONL for tool calls (jq fallback if not available)
     if command -v jq &>/dev/null; then
       FILES_READ=$(jq -r 'select(.type == "read") | .file' observability-pulse.jsonl 2>/dev/null | head -20)
       COMMANDS_RUN=$(jq -r 'select(.type == "bash") | .command' observability-pulse.jsonl 2>/dev/null | head -20)
     else
       # jq not available, use grep (less structured but works)
       FILES_READ=$(grep '"type":"read"' observability-pulse.jsonl 2>/dev/null | head -20)
       COMMANDS_RUN=$(grep '"type":"bash"' observability-pulse.jsonl 2>/dev/null | head -20)
     fi
   else
     FILES_READ="(observability-pulse.jsonl not found - manual documentation required)"
     COMMANDS_RUN="(observability-pulse.jsonl not found - manual documentation required)"
   fi
   ```

2. **Git history this session** (if git available)
   ```bash
   if command -v git &>/dev/null && [ -d .git ]; then
     GIT_CHANGES=$(git log --since="$DURATION_MIN minutes ago" --name-only --pretty=format:"%h %s" 2>/dev/null)
     FILES_MODIFIED=$(git diff --name-only HEAD 2>/dev/null)
   else
     GIT_CHANGES="(git not available - changes not tracked)"
     FILES_MODIFIED="(git not available)"
   fi
   ```

3. **Manual context** (agent fills based on memory)
   ```bash
   # Agent documents from current understanding
   CURRENT_UNDERSTANDING="[Agent fills: What is currently being worked on]"
   KEY_DECISIONS="[Agent fills: Significant choices made this session]"
   NEXT_STEPS="[Agent fills: Planned work after bundle save]"
   ```

**If ALL data sources unavailable (no contextBundler, no observability, no git):**
- Bundle will contain minimal metadata (timestamps, session duration)
- Agent MUST manually document:
  - Files read (from memory)
  - Changes made (from memory)
  - Current understanding (mental model)
  - Next steps (continuation plan)

**This ensures SOME bundle is saved** (better than 0 recovery)

---

### Step 6: Write Bundle File

```bash
cat > "$BUNDLE_PATH" <<'EOF'
[Generated content from Step 4 with real data from Step 5]
EOF
```

---

### Step 7: Verification

```bash
# Verify bundle created
ls -lh "$BUNDLE_PATH"

# Show bundle stats
wc -l "$BUNDLE_PATH"
echo "Bundle saved: $BUNDLE_PATH"

# Optional: Add to git (recommended)
git add "$BUNDLE_PATH"
echo "✅ Context bundle saved and staged for commit"
```

---

### Step 8: Summary Output

**Display to user:**

```markdown
✅ Context Bundle Saved Successfully!

**Bundle:** .agents/context-bundles/[NAME]
**Size:** [SIZE] KB
**Session Duration:** [START] → [NOW] ([DURATION])

**Captured:**
- 📂 Files Read: [COUNT]
- ✏️ Edits Made: [COUNT] files
- 🔧 Commands: [COUNT]
- 🧠 Key Decisions: [COUNT]
- ✅ Checkpoints: [COUNT] passed

**Recovery:**
If context overflows, run:
```bash
/loadbundle .agents/context-bundles/[NAME]
```

**Estimated Recovery:** 60-70% of session context

**Next:**
- Continue working normally
- Bundle auto-saved for disaster recovery
- Recommended: Commit bundle to git
```

---

## Error Handling (Robustified - Auto-Fallback)

**All errors trigger automatic fallbacks (NO user input required).**

**If observability-pulse.jsonl missing:**
```bash
# Auto-fallback: Use git history + bash commands
if [ ! -f "observability-pulse.jsonl" ]; then
  echo "⚠️  WARNING: observability-pulse.jsonl not found"
  echo "   Using fallback: git history + manual agent documentation"
  echo ""

  # Fallback sources:
  # 1. Git log (files modified)
  # 2. Bash history (commands run)
  # 3. Agent memory (mental model documentation)

  # Continue automatically with fallback data
fi
```

**If .agents/ directory fails to create:**
```bash
# Auto-fallback: Create bundle in /tmp/ instead
if ! mkdir -p .agents/context-bundles 2>/dev/null; then
  echo "⚠️  WARNING: Cannot create .agents/context-bundles/ (permissions)"
  echo "   Using fallback: /tmp/context-bundles/"

  BUNDLE_PATH="/tmp/context-bundles/$BUNDLE_NAME"
  mkdir -p /tmp/context-bundles

  echo "   Bundle will save to: $BUNDLE_PATH"
  echo "   MANUAL ACTION REQUIRED: Move bundle to project later"
  echo "     mv /tmp/context-bundles/$BUNDLE_NAME .agents/context-bundles/"
fi
```

**If git not available:**
```bash
# Auto-fallback: Use directory name + timestamp
if ! command -v git &>/dev/null || [ ! -d .git ]; then
  echo "ℹ️  Git not detected"
  echo "   Using fallback: directory name + timestamp for metadata"

  # Fallback metadata (from Step 2)
  GIT_BRANCH="no-git"
  GIT_COMMIT="pwd-$(basename "$(pwd)")-$(date +%Y%m%d)"
  FILES_CHANGED="unknown (no git)"

  # Continue with bundle generation
fi
```

**If contextBundler.cjs fails:**
```bash
# Auto-fallback: Manual bash generation (Step 5 fallback)
if [ $BUNDLER_EXIT -ne 0 ]; then
  echo "⚠️  contextBundler.cjs failed (exit code: $BUNDLER_EXIT)"
  echo "   Using fallback: manual bash generation"

  # Fallback: Extract data via bash/git/jq (Step 5 fallback method)
  # Agent manually documents:
  # - Files read (from memory)
  # - Commands run (bash history)
  # - Current understanding (mental model)

  # Bundle still generated (minimal data better than 0 recovery)
fi
```

**If jq not available:**
```bash
# Auto-fallback: Use grep instead (less structured but works)
if ! command -v jq &>/dev/null; then
  echo "ℹ️  jq not available, using grep for JSONL parsing"

  # Fallback: grep patterns instead of jq queries
  FILES_READ=$(grep '"type":"read"' observability-pulse.jsonl 2>/dev/null)
  # (less clean but functional)
fi
```

**Philosophy:**
- **Never fail completely** - ALWAYS generate SOME bundle (even minimal)
- **Auto-fallback cascade** - Try preferred → fallback 1 → fallback 2 → manual
- **Clear warnings** - User knows what data sources were used
- **NO blocking prompts** - Agent continues automatically

---

## Usage Examples

**Example 1: Auto-named bundle**
```bash
/savebundle
# Creates: .agents/context-bundles/2025-10-18_15-30_session.md
```

**Example 2: Named bundle (backend specialist)**
```bash
/savebundle backend-specialist-auth-implementation
# Creates: .agents/context-bundles/backend-specialist-auth-implementation.md
```

**Example 3: Emergency save before context overflow**
```bash
# You notice context getting full (180K/200K tokens)
/savebundle emergency-save-auth-90-percent-done
# Bundle saved, safe to continue or restart
```

---

## When to Use

✅ **Use /savebundle when:**
- Session approaching 2h (long-running work)
- Context approaching 150K+ tokens (getting full)
- Before risky operation (major refactor, database migration)
- End of work day (save progress before closing)
- Agent switch (backend → frontend specialist)

❌ **Don't use /savebundle when:**
- Session < 30 min (minimal context accumulated)
- Trivial changes (typo fixes, small edits)
- Already have recent bundle (< 1h ago)

**Best Practice:**
- Save bundle every 1-2h during long sessions
- Save before major context-heavy operations (read 20+ files)
- Commit bundles to git (team can recover too)

---

## Integration with Workflow

**Phase 3: Implementation**
```bash
# Start backend-specialist sub-agent
Task({ subagent: "backend-specialist", tasks: "T001-T035" })

# After 1.5h of work
/savebundle backend-specialist-checkpoint-t020

# Continue work...
# If context overflows at T030, can recover from T020 bundle
```

---

## Notes

**Why This Command Exists:**
- Prevents catastrophic context loss (2h work → crash → 0% recovered)
- Enables fast recovery (-70% remount time: 15 min vs 2h45)
- Complements project-memory.md (bundles = WHAT, memory = WHY)

**ROI:**
- Time: -70% recovery time if crash
- Risk: Insurance policy for long sessions
- Cost: 2-3 min to save bundle (vs 2h lost if crash)

**Pattern Source:**
- Dev Dan - Context Engineering ADV2 (Context Bundles)
- Video: "Context Engineering for AI Agents"
- Health Score: 9.6/10 (quick win, high ROI)

---

**Version:** 1.0
**Created:** 2025-10-18
**Purpose:** Implement Context Bundles pattern for disaster recovery
