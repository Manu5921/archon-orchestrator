---
description: Create GitHub feature branch, commit bootstrap artifacts, push, and create PR with comprehensive body (Phase 2 after planning complete)
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Goal

Automate GitHub workflow setup after planning phase complete (constitution.md + spec.md + plan.md + tasks.md + design/ ready). Creates feature branch, commits all artifacts with detailed message, pushes to remote, and creates Pull Request with comprehensive body documenting architecture, implementation plan, quality gates, and next steps.

## Prerequisites

**MUST be run after:**
- `/speckit.constitution` → constitution.md exists
- `/speckit.specify` → spec.md exists
- `/speckit.plan` → plan.md exists
- `/speckit.tasks` → tasks.md exists
- `/speckit.design` → design/ folder exists
- **OPTIONAL:** `/speckit.analyze` → analysis-report.md (recommended for production quality)

**Repository requirements:**
- Git repository initialized (`git init` already run)
- GitHub CLI (`gh`) installed and authenticated
- No uncommitted changes blocking branch creation

## Execution Steps

### 1. Verify Prerequisites

Run `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks` to verify all required artifacts exist.

**Required files:**
- `.specify/memory/constitution.md`
- `specs/{feature-id}/spec.md`
- `specs/{feature-id}/plan.md`
- `specs/{feature-id}/tasks.md`
- `design/design-tokens.json` (or equivalent design artifacts)

**Abort if missing** with clear message: "Missing {file}. Run /speckit.{command} first."

---

### 2. Extract Project Metadata

Parse key information from artifacts to generate commit message and PR body:

**From constitution.md:**
- Project name (first heading)
- Core principles (section headings under "Core Principles")
- Tech stack (section "Architecture & Technology Stack")
- Quality standards (section "Quality Standards")

**From spec.md:**
- User stories count and priorities (P1/P2/P3)
- MVP scope (P1 stories)
- Success criteria (section "Success Criteria")
- Key features summary (first paragraph of each user story)

**From plan.md:**
- Architecture patterns (ADR sections)
- File structure summary (section "File Structure")
- Key technical decisions (ADR titles)

**From tasks.md:**
- Total task count (count `- [ ]` checkboxes)
- Phase breakdown (section headings "Phase N:")
- Checkpoint tasks (tasks with numbers divisible by 10, or Phase end markers)
- Time estimates (section "Implementation Strategy" or "Time Estimate")

**From design/ folder:**
- Design tokens file existence
- Wireframes count (`ls design/wireframes/*.svg | wc -l`)
- Components list existence

**From analysis-report.md (if exists):**
- Critical issues count (before/after)
- Constitution compliance status
- Coverage percentage

---

### 3. Generate Feature Branch Name

**Format:** `feature/{project-slug}-{scope}`

**Logic:**
1. Extract project name from constitution.md first heading
2. Slugify: lowercase, replace spaces with hyphens, remove special chars
3. Determine scope:
   - If tasks.md mentions "MVP" or "Phase 1-2 only": scope = "mvp"
   - If tasks.md includes all user stories: scope = "full"
   - Default: scope from first user story slug (e.g., "bank-import")

**Examples:**
- "FlowGenius MVP" → `feature/flowgenius-mvp`
- "TaskManager Full Release" → `feature/taskmanager-full`
- "Blog Platform" → `feature/blog-platform`

---

### 4. Generate Commit Message

**Format:** Conventional Commits style

**Template:**
```
feat({scope}): {project-name} {description}

Constitution & Spec:
- Constitution {version} ({principle-1} + {principle-2} + ...)
- Spec.md with {N} user stories (P1 MVP: {mvp-stories})
  {analysis-clarifications-if-exists}
- Plan.md with {N} ADR decisions ({key-decisions})

Tasks & Quality:
- Tasks.md with {N} tasks ({original-count} original{analysis-fixes-if-exists})
{analysis-summary-if-exists}

Design System:
- {design-tokens-file} ({theme-name}, {N} token categories)
- Wireframes {format} ({wireframe-list})
- Components list ({N} components)

Data Model:
- {N} tables ({table-names})
- {key-patterns} ({pattern-details})

MVP Scope:
- {mvp-user-stories-summary}

Total Estimate: {mvp-estimate} (MVP) | {full-estimate} (Full)

Quality Gates:
- P0 {gate-description}
- P1 {gate-description}
- P2 {gate-description}

Checkpoints V5.2 (Automated):
- {checkpoint-1}: {description}
- {checkpoint-2}: {description}

🤖 Generated with Claude Code ({model-used})

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Extraction rules:**
- {version}: Extract from constitution.md metadata or "Version: X.Y.Z" pattern
- {principle-N}: Extract from constitution.md Core Principles section headings
- {mvp-stories}: Extract P1 priority user stories from spec.md
- {key-decisions}: Extract ADR titles from plan.md (max 3-4 most important)
- {N} tasks: Count total tasks in tasks.md
- {analysis-fixes-if-exists}: If analysis-report.md exists, mention critical fixes applied
- {theme-name}: Extract from design-tokens.json or design folder name
- {table-names}: Extract from plan.md data model section
- {key-patterns}: Extract architecture patterns (Event Sourcing, CQRS, DDD, etc.)
- {checkpoint-N}: Extract checkpoint task IDs from tasks.md (T010, T020, etc.)
- {model-used}: If analysis-report.md mentions models, list them (e.g., "Haiku 4.5 tasks + Sonnet 4.5 analysis")

**Keep concise:** Max 40 lines. Summarize, don't dump everything.

---

### 5. Generate PR Body

**Format:** Markdown with structured sections

**Template:**
```markdown
## Summary

{project-name} {scope} - {one-line-description}

**Core Features ({mvp-label}):**
- {emoji} **{feature-1}:** {description}
- {emoji} **{feature-2}:** {description}

**Additional Features (Post-MVP):**
- {emoji} **{feature-3}:** {description}

---

## Architecture

**Patterns:**
- **{pattern-1}:** {description}
  {sub-details-if-important}
- **{pattern-2}:** {description}

**Tech Stack:**
- Frontend: {frontend-stack}
- Backend: {backend-stack}
- Database: {database-stack}
- {additional-services}

---

## Quality Assurance (V5.2 Workflow)

{if-analysis-exists}
**Analysis Results:**
- **Before `/speckit.analyze`:** {N} CRITICAL issues
- **After remediation:** 0 CRITICAL issues ({N} tasks added)
- **Constitution Compliance:** ✅ ALL GATES PASS

**Critical Fixes Applied:**
{list-critical-fixes-with-task-ids}
{endif}

---

## Implementation Plan

**Tasks:** {N} total ({mvp-count} MVP)

**Phases:**
1. ✅ **{phase-1-name}** ({task-count} tasks, {time-estimate})
2. ⏳ **{phase-2-name}** ({task-count} tasks, {time-estimate})
...

**Critical Path (MVP):** {task-range} (~{time-estimate})

**Checkpoints V5.2 (Automated BLOCKING):**
- **{checkpoint-1}:** {description} → Validate (Build P0 + Lint P1 + Manifest + Patch)
- **{checkpoint-2}:** {description} → Validate

---

## Test Plan

**Coverage Target:** {percentage}% ({source})

**Test Categories:**
{list-test-categories-from-plan}

**Success Criteria (Measurable):**
{list-success-criteria-from-spec}

---

## {domain-specific-section}

{if-french-compliance-required}
## French Compliance (Non-negotiable)
{list-compliance-requirements}
{endif}

{if-security-critical}
## Security Architecture
{list-security-measures}
{endif}

---

## Performance Targets

**Targets:**
{list-performance-targets-from-constitution}

**Validation:** {validation-approach}

---

## Quality Gates

**P0 (BLOCKER):**
{list-p0-gates}

**P1 (HIGH):**
{list-p1-gates}

**P2 (MEDIUM):**
{list-p2-gates}

---

## Design System (Competitive Advantage)

{if-design-decoupling-mentioned}
**Design/Dev Decoupling:**
- Phase 1 (Now): Placeholder tokens ({theme-name})
- Phase 2-3 (Parallel): Designer works on custom brand
- Phase 4 (Merge): `/import-design custom-tokens.json` (15 min vs 1-2 days refactor)

**ROI:** {roi-statement}
{endif}

---

## Next Steps

1. ✅ Merge this PR to trigger `/speckit.implement`
2. ⏳ {next-phase}: {description}
3. ⏳ Checkpoint {task-id}: Validate {phase}
...

---

**Workflow:** {models-used} + V5.2 Checkpoints = Production-quality MVP

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Extraction rules:**
- {project-name}: From constitution.md
- {one-line-description}: From spec.md first paragraph or README if exists
- {emoji}: Map feature to emoji (🏦 bank, 🤖 AI, 📊 analytics, 🇫🇷 compliance, etc.)
- {mvp-label}: "MVP - US1-US2" or similar from tasks.md
- {pattern-N}: Extract from plan.md ADR sections
- {frontend-stack}: Extract from constitution.md or plan.md tech stack
- {domain-specific-section}: Detect domain (fintech → French Compliance, healthcare → HIPAA, etc.)
- {if-analysis-exists}: Conditional sections based on analysis-report.md presence

**Keep comprehensive but scannable:** Use collapsible sections (`<details>`) if body exceeds 500 lines.

---

### 6. Execute Git Workflow

**Commands sequence:**

```bash
# 1. Verify clean working tree
git status --porcelain
# If output not empty: abort with "Uncommitted changes detected. Commit or stash first."

# 2. Create feature branch
git checkout -b {branch-name}

# 3. Stage all artifacts
git add .

# 4. Commit with generated message
git commit -m "{commit-message-multiline}"

# 5. Push to remote with upstream tracking
git push -u origin {branch-name}

# 6. Create Pull Request with generated body
gh pr create --title "{pr-title}" --body "{pr-body-multiline}"
```

**Error handling:**
- If `git checkout -b` fails (branch exists): Offer to use existing or abort
- If `git push` fails (auth): Provide error message with `gh auth status` command
- If `gh pr create` fails: Provide error message and manual PR creation URL

---

### 7. Verify Success

**Output to user:**

```
✅ GitHub setup complete!

Branch: feature/{branch-name}
Commit: {short-sha} {commit-title}
PR: https://github.com/{user}/{repo}/pull/{number}

Next steps:
1. Review PR body for accuracy
2. Run /speckit.agents to generate orchestration strategy
3. Run /speckit.implement to start implementation with automated checkpoints

Workflow: Plan → Tasks → Analyze → GitHub → Agents → Implement
```

**Provide verification commands:**
```bash
# Verify branch
git branch --show-current

# View commit
git log -1 --oneline

# View PR
gh pr view
```

---

## Configuration Options

**User can override defaults via arguments:**

```bash
# Custom branch name
/speckit.github branch=feature/custom-name

# Custom PR title
/speckit.github title="Custom PR Title"

# Skip analysis integration (not recommended)
/speckit.github no-analysis

# Draft PR (for review before merge)
/speckit.github draft

# Custom base branch (default: main)
/speckit.github base=develop
```

---

## Operating Principles

### Context Efficiency

- **Parse artifacts progressively**: Don't load entire files into context
- **Extract key metadata only**: Use grep/awk/sed for targeted extraction
- **Reuse templates**: Don't regenerate commit/PR body from scratch each time

### Error Prevention

- **Validate prerequisites**: Abort early if files missing
- **Check git state**: Ensure clean working tree before branching
- **Handle auth failures**: Provide actionable error messages

### Customization

- **Detect project domain**: Auto-adjust PR body sections (fintech, healthcare, e-commerce)
- **Respect existing conventions**: If repo has PR template, integrate with it
- **Preserve user edits**: If analysis-report.md edited manually, respect those edits

---

## Notes

**This command is WRITE-ONLY** (creates branch, commits, pushes, creates PR). If user wants to review before executing, suggest:

```bash
# Dry-run mode (future enhancement)
/speckit.github --dry-run
# → Shows commit message and PR body WITHOUT executing git commands
```

**Integration with other commands:**

```bash
# Typical workflow
/speckit.plan           # Generate plan.md
/speckit.tasks          # Generate tasks.md (Haiku 4.5)
/speckit.analyze        # Validate (Sonnet 4.5) ⭐ RECOMMENDED
/speckit.github         # ← THIS COMMAND (automate GitHub setup)
/speckit.agents         # Generate orchestration
/speckit.implement      # Start implementation
```

---

## Context

$ARGUMENTS
