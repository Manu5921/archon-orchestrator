# 🚀 New Project Setup - V6 MVP Workflow

**Quick reference for launching a new project with Spec-Kit + Archon workflow**

---

## Step 1: Initialize Spec-Kit Project

```bash
# Create new project directory with Spec-Kit structure
uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>

cd <PROJECT_NAME>
```

This creates:
```
<PROJECT_NAME>/
├── .specify/
├── specs/001-mvp/
├── design/
└── [other Spec-Kit files]
```

---

## Step 2: Copy Generic CLAUDE.md Template

```bash
# Copy from archon-orchestrator
cp ~/Documents/DEV/archon-orchestrator/claudedebut.md ./CLAUDE.md
```

This file:
- Lists all Spec-Kit commands in correct order
- Acts as project workflow guide
- Gets enriched by `/speckit.init` later with project-specific context
- Contains quality gates + timeline estimates

---

## Step 3: Copy Scripts & Infrastructure

```bash
# Copy observability infrastructure (optional but recommended)
cp -r ~/Documents/DEV/archon-orchestrator/scripts ./

# This gives you:
# - pulseLogger.cjs (observability logging)
# - viewPulse.sh (timeline viewer)
```

---

## Step 4: Initialize Git

```bash
git init
git add .
git commit -m "chore: initialize project with Spec-Kit + Archon infrastructure"
git remote add origin https://github.com/YOUR_ORG/<PROJECT_NAME>.git
git push -u origin main
```

---

## Step 5: Follow CLAUDE.md Commands Exactly

Now read `CLAUDE.md` (the file you just copied) and follow **Phase 0**:

```bash
# Phase 0: Project Analysis (5-10 min)
/zen-roundtable "Brief: [Your project description]"
```

This runs Gemini analysis → prompt-specialist → generates:
- `prompt-constitution.md`
- `prompt-specify.md`
- `project-memory.md`

Then follow **Phase 1** commands in order:
```bash
/speckit.constitution   # HIGH-LEVEL governance
/speckit.specify        # TECHNICAL specification
/speckit.init           # Initialize + enrich CLAUDE.md with context
/speckit.design         # Design tokens + wireframes (MANDATORY)
/speckit.plan           # Implementation plan
/speckit.tasks          # 50-100 tasks list
/speckit.agents         # Sub-agents orchestration
```

---

## What You Get After Setup

### CLAUDE.md Enhancement by `/speckit.init`
- ✅ Project Identity (name, vision, dates)
- ✅ Tech Stack (from spec.md)
- ✅ Key Dates (from roadmap)
- ✅ Team/Contact Info

### Project Files After Phase 1
```
<PROJECT_NAME>/
├── CLAUDE.md (enriched with context)
├── .specify/memory/
│   ├── constitution.md (business governance)
│   └── project-memory.md (Dynamic Memory V5)
├── specs/001-mvp/
│   ├── spec.md (technical details)
│   ├── plan.md (architecture + file structure)
│   ├── tasks.md (50-100 tasks CHECKBOXES)
│   └── design/
│       └── design-tokens.json
├── design/
│   ├── wireframes/ (SVG mockups)
│   └── components-list.md
├── ORCHESTRATION.md (sub-agents allocation)
├── scripts/
│   ├── pulseLogger.cjs
│   └── viewPulse.sh
└── observability-pulse.jsonl (empty, will populate during Phase 3)
```

---

## Phase 2: GitHub Setup

```bash
# Create feature branch
git checkout -b feat/mvp

# Commit all Spec-Kit outputs
git add .
git commit -m "feat: initialize MVP spec and design system"

# Push to remote
git push -u origin feat/mvp

# Create PR
gh pr create --title "feat: MVP specification" \
  --body "Phase 1 complete: constitution.md + spec.md + design system + tasks"
```

---

## Phase 3: Implementation

```bash
# Full automation: agents orchestrated, checkpoints every 10 tasks
/speckit.final

# Verify observability
./scripts/viewPulse.sh

# Quality gates
pnpm build && pnpm lint && pnpm test
```

---

## Design/Dev Decoupling (CRITICAL)

**Day 1 (Phase 1):**
- `/speckit.design` generates placeholder tokens (blue colors)
- All components use CSS variables: `bg-primary-500` (not hardcoded colors)

**Day 4 (Phase 5):**
- Designer creates custom brand tokens
- Run `/import-design custom-tokens.json`
- All colors update automatically (0 code changes)
- **Time saved:** 15 min merge vs 1-2 days refactoring

---

## Quick Reference: Command Order

```
Phase 0: /zen-roundtable
         ↓
Phase 1: /speckit.constitution → /specify → /init → /design → /plan → /tasks → /agents
         ↓
Phase 2: git checkout -b feat/mvp → git add . → git commit → git push → gh pr create
         ↓
Phase 3: /speckit.final → ./scripts/viewPulse.sh → pnpm build/lint/test
         ↓
Phase 4: /import-design custom-tokens.json (OPTIONAL)
         ↓
Phase 5: gh pr merge --squash
```

---

## Troubleshooting

**"Command not found: /zen-roundtable"**
→ Ensure Zen MCP connected: `claude mcp list` (should show ✓ zen)

**"Spec-Kit not installed"**
→ Install: `uvx --from git+https://github.com/github/spec-kit.git specify --version`

**"Permission denied: scripts/viewPulse.sh"**
→ Fix: `chmod +x scripts/*.sh`

**"Design tokens missing"**
→ Never skip `/speckit.design` - it's mandatory for Design/Dev decoupling

**"Confused about next step"**
→ Always check `CLAUDE.md` in your project - it guides you through workflow

---

## Timeline

| Phase | Duration | Output |
|-------|----------|--------|
| Setup (Steps 1-4) | 5 min | Git repo initialized |
| Phase 0 | 5-10 min | Prompts + project-memory.md |
| Phase 1 | 30-35 min | Constitution + Spec + Plan + Tasks + Agents |
| Phase 2 | 2 min | PR created |
| Phase 3 | 3-4 hours | Implementation complete |
| Phase 4 | 5 min | Verify build + lint + tests |
| Phase 5 | 15 min | Brand design imported (OPTIONAL) |
| Phase 6 | 15 min | PR merged, MVP live |
| **TOTAL** | ~4-5 hours | Production-ready MVP |

---

## Key Files to Know

| File | Purpose | When |
|------|---------|------|
| `CLAUDE.md` | Workflow guide + project context | Always (read first!) |
| `constitution.md` | Business decisions + governance | After /speckit.constitution |
| `spec.md` | Technical architecture + SQL | After /speckit.specify |
| `project-memory.md` | WHY behind decisions (living doc) | After /speckit.init, enriched during Phase 3 |
| `plan.md` | Implementation plan + file structure | After /speckit.plan |
| `tasks.md` | 50-100 tasks (CHECKBOXES) | After /speckit.tasks |
| `ORCHESTRATION.md` | Sub-agents allocation | After /speckit.agents |
| `design-tokens.json` | CSS variables (colors, fonts, spacing) | After /speckit.design |

---

## Next: Read Your Project's CLAUDE.md

After setup, your next action:

```bash
cat CLAUDE.md   # Read the workflow guide
# Then follow Phase 0 command exactly as listed
```

🚀 **Ready to launch a new project?** Start with Step 1 above!
