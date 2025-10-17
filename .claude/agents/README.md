# 🤖 Claude Code Sub-Agents

Custom sub-agents for Archon Orchestrator workflow. These agents are automatically discovered by Claude Code when you start a new session.

## Available Sub-Agents

### 1. **backend-specialist**
- **Purpose:** API + Database + Supabase integration for implementation phase
- **Tools:** Read, Write, Edit, Bash
- **Used in:** Phase 3 implementation (sub-agent orchestration)
- **When to invoke:** During implementation tasks allocated to backend-specialist

### 2. **frontend-specialist**
- **Purpose:** React + shadcn/ui + Forms implementation
- **Tools:** Read, Write, Edit
- **Used in:** Phase 3 implementation (sub-agent orchestration)
- **When to invoke:** During implementation tasks allocated to frontend-specialist
- **Special:** Uses design-tokens.json for CSS variables

### 3. **mega-orchestrator-bootstrap**
- **Purpose:** Bootstrap orchestration for complex multi-agent workflows
- **Tools:** All available tools
- **Used in:** Advanced orchestration scenarios
- **When to invoke:** Manual agent chaining or complex multi-step workflows

### 4. **prompt-specialist** ⭐ NEW
- **Purpose:** Generates focused prompts for Spec-Kit workflow
- **Tools:** Read, Write, Edit
- **Used in:** Phase 0 (post-Gemini analysis)
- **When to invoke:** Via `/zen-roundtable` command automatically
- **Outputs:**
  - `prompt-constitution.md` (instructions for /speckit.constitution)
  - `prompt-specify.md` (instructions for /speckit.specify)
- **Philosophy:** Small prompts (<2KB), actionable, flexible (not over-templated)

---

## 🔍 How Claude Code Discovers These Agents

**Location:** `.claude/agents/` directory
**Format:** Markdown files with YAML frontmatter
**Scope:** Project-level (highest priority) - visible in all sessions within this project

## File Format

Each agent file follows this structure:

```markdown
---
name: agent-name
description: What this agent does and when to use it
tools: tool1, tool2, tool3  # Optional: specific tools this agent needs
---

System prompt for the agent goes here.
This defines the agent's role, expertise, and behavior.
```

**Frontmatter Fields:**

| Field | Required | Value |
|-------|----------|-------|
| `name` | ✅ Yes | Unique identifier (lowercase, hyphens) |
| `description` | ✅ Yes | When/why to invoke this agent (1-2 sentences) |
| `tools` | ❌ No | Comma-separated tools (omit to inherit all) |
| `model` | ❌ No | Model alias or `'inherit'` |

---

## 🚀 How to Use These Agents

### Automatic Invocation (Recommended)
Agents are called automatically by workflow commands:

```bash
/zen-roundtable "Brief: ..."     # Calls prompt-specialist automatically
/speckit.final                    # Orchestrates backend/frontend/testing agents
```

### Manual Invocation
If needed, start a new session and reference:

```
Start a new session and ask: "I need help with [task]. Please invoke the backend-specialist agent."
```

### In New Projects
These agents are **project-level** - copy the entire `.claude/agents/` directory to new projects:

```bash
cp -r archon-orchestrator/.claude/agents new-project/.claude/
```

---

## ✨ Session Persistence

**How new sessions discover these agents:**

1. ✅ **Project-level agents (`.claude/agents/`)**
   - Automatically discovered when you open a new Claude Code session in this project
   - Highest priority (overrides user-level agents)
   - Persistent across all sessions in this project

2. ✅ **User-level agents (optional)**
   - `~/.claude/agents/`
   - Lower priority than project-level
   - Used if agent not found in project-level

**Result:** Every new session in this project will see all 4 agents without any configuration needed! 🎉

---

## 📋 Agent Dependencies

**Workflow Chain:**
```
Phase 0: /zen-roundtable
         └─→ Calls prompt-specialist
             └─→ Generates prompt-constitution.md + prompt-specify.md

Phase 1: /speckit.constitution (uses prompt-constitution.md)
Phase 1: /speckit.specify (uses prompt-specify.md)

Phase 3: /speckit.final
         └─→ Calls backend-specialist (tasks T001-T035)
         └─→ Calls frontend-specialist (tasks T036-T070)
         └─→ Calls testing-specialist (tasks T071-T100)
         └─→ Calls mega-orchestrator-bootstrap (if needed for complex coordination)
```

---

## 🔧 Adding New Agents

To add a new agent to this project:

1. **Create new file** in `.claude/agents/your-agent.md`
2. **Add YAML frontmatter** with name, description, tools
3. **Write system prompt** in Markdown
4. **Commit & push** to repository
5. **Next session** will automatically discover the new agent

**Example:**
```markdown
---
name: my-specialist
description: Does X for Y purpose
tools: Read, Write, Bash
---

You are a specialist in...
```

---

## 📚 Documentation

- **Claude Code Docs:** https://docs.claude.com/en/docs/claude-code/sub-agents.md
- **Archon Workflow:** See `CLAUDE.md` in project root
- **Spec-Kit:** https://github.com/github/spec-kit

---

## ✅ Verification

**To verify agents are discoverable:**

1. **New Session Test:**
   ```bash
   # Start a new Claude Code session in this project
   # Ask: "What agents are available?"
   # Should list: backend-specialist, frontend-specialist, mega-orchestrator-bootstrap, prompt-specialist
   ```

2. **File Structure Check:**
   ```bash
   ls -la .claude/agents/
   # Should show: .md files with YAML frontmatter
   ```

3. **Format Validation:**
   ```bash
   head -5 .claude/agents/prompt-specialist.md
   # Should show: --- name: prompt-specialist description: ... ---
   ```

---

**Last Updated:** 2025-10-17
**Agents Count:** 4 (3 existing + 1 new prompt-specialist)
**Project Persistence:** ✅ All agents auto-discovered in new sessions
