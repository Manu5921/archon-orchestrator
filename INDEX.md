# 📚 Archon Orchestrator - Navigation Guide

**Version:** V6.1.3 (Observability Complete)
**Date:** 2025-10-17
**Status:** ✅ Production Ready

---

## 🚀 Start Here

**New to Archon Orchestrator?** Start with these files:

- **[START-HERE.md](./START-HERE.md)** - Entry point & quick overview
- **[CLAUDE.md](./CLAUDE.md)** - Core instructions for Claude Code
- **[README.md](./README.md)** - Project overview & setup

---

## 📚 Documentation

### Core Workflow

- **[docs/WORKFLOW-V6-MVP.md](./docs/WORKFLOW-V6-MVP.md)** - Complete V6 MVP workflow guide (5 phases)
- **[docs/WORKFLOW-V5.2.1-EXACT.md](./docs/WORKFLOW-V5.2.1-EXACT.md)** - V5.2.1 reference
- **[docs/WORKFLOW-EVOLUTION-V6-MULTI-AGENT-OBSERVABILITY.md](./docs/WORKFLOW-EVOLUTION-V6-MULTI-AGENT-OBSERVABILITY.md)** - Evolution notes
- **[docs/WORKFLOW-V6-ENHANCEMENTS-CHATGPT.md](./docs/WORKFLOW-V6-ENHANCEMENTS-CHATGPT.md)** - ChatGPT suggestions

### Patterns & Best Practices

- **[docs/GOLDEN-PATTERNS.md](./docs/GOLDEN-PATTERNS.md)** - Battle-tested patterns
  - Design/Dev Decoupling
  - Dynamic Memory V5
  - Quality Gates P0-P4
  - TDD Workflow

- **[docs/AGENTIC-PATTERNS.md](./docs/AGENTIC-PATTERNS.md)** - Multi-agent patterns
  - GATHER → ACTION → VERIFY
  - Sub-agents orchestration
  - Error escalation (3-strike rule)

- **[docs/SUB-AGENTS-MASTERY.md](./docs/SUB-AGENTS-MASTERY.md)** - Sub-agent guide
  - Backend-specialist
  - Frontend-specialist
  - Testing-specialist
  - Design-specialist

### Integration & Tools

- **[docs/ZEN-MCP-WORKFLOW-ORCHESTRATION.md](./docs/ZEN-MCP-WORKFLOW-ORCHESTRATION.md)** - Multi-IA orchestration
  - Codex + Gemini + Claude coordination
  - Zen MCP setup & usage
  - ADR workflow

- **[docs/CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md](./docs/CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md)** - OAuth setup
- **[docs/JULES-SECURITY-GUARDIAN-SETUP.md](./docs/JULES-SECURITY-GUARDIAN-SETUP.md)** - Security scanning

### Troubleshooting & Reference

- **[docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Common issues & solutions
- **[docs/ZERO-TRUST.md](./docs/ZERO-TRUST.md)** - Quality gates & validation
- **[docs/CONTEXT-MANAGEMENT-BEST-PRACTICES.md](./docs/CONTEXT-MANAGEMENT-BEST-PRACTICES.md)** - Context optimization
- **[docs/RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md](./docs/RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md)** - Real project learnings

### Analysis & Research

- **[docs/SKILLS-ANTHROPIC-ANALYSIS-2025-10-17.md](./docs/SKILLS-ANTHROPIC-ANALYSIS-2025-10-17.md)** - Skills vs Slash Commands analysis
- **[docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md](./docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md)** - V4 workflow (archived)

---

## 📝 Changelogs

### Current Version (V6.1.3)

- **[changelogs/V6.1.3/CHANGELOG-V6.1.3-OBSERVABILITY.md](./changelogs/V6.1.3/CHANGELOG-V6.1.3-OBSERVABILITY.md)** - Observability gate + CLI

### Recent Versions

- **[changelogs/V6.1.2/CHANGELOG-V6.1.2-TASKS-FORMAT-FIX.md](./changelogs/V6.1.2/CHANGELOG-V6.1.2-TASKS-FORMAT-FIX.md)** - Tasks format fix (T001, [P], [US1])
- **[changelogs/V6.1.1/CHANGELOG-V6.1.1-SPEC-KIT-ALIGNMENT.md](./changelogs/V6.1.1/CHANGELOG-V6.1.1-SPEC-KIT-ALIGNMENT.md)** - Spec-Kit alignment (parallel + TDD)

### V6 MVP Baseline

- **[changelogs/V6-MVP/](./changelogs/V6-MVP/)** - V6 MVP complete
  - CHANGELOG-V6-MVP.md (main changelog)
  - V6-MVP-JOUR-2-VALIDATION.md (Day 2 validation)
  - FICHIERS-A-RELIRE-V6-MVP.md (files review checklist)
  - promptdereprise-2025-10-16-V6-MVP-SUCCESS.md (success report)

### V5 Archive

- **[changelogs/V5.1/](./changelogs/V5.1/)** - V5.1 (Gemini-optimized, Haiku 4.5)
- **[changelogs/V5.2/](./changelogs/V5.2/)** - V5.2 Foundations
- **[changelogs/V5.2.1/](./changelogs/V5.2.1/)** - V5.2.1 Quick Wins
- **[changelogs/legacy/](./changelogs/legacy/)** - Legacy changelogs

---

## 🛠 Scripts & Tools

### Observability

- **[scripts/pulseLogger.cjs](./scripts/pulseLogger.cjs)** - Timeline logger (JSONL)
  - `node scripts/pulseLogger.cjs start <agent> <context>`
  - `node scripts/pulseLogger.cjs checkpoint <gate> <status> <details>`
  - `node scripts/pulseLogger.cjs end <agent> <result>`
  - `node scripts/pulseLogger.cjs summary`

- **[scripts/viewPulse.sh](./scripts/viewPulse.sh)** - Timeline viewer (color-coded)

### Validation

- **`.specify/scripts/bash/check-prerequisites.sh`** - Prerequisites checker (8 files)

---

## 🔧 Configuration

### Claude Code

- **[.claude/commands/](/.claude/commands/)** - Slash commands
  - `speckit.constitution.md`
  - `speckit.specify.md`
  - `speckit.design.md`
  - `speckit.plan.md`
  - `speckit.tasks.md`
  - `speckit.agents.md`
  - `speckit.final.md` (orchestrator)
  - `zen-roundtable.md` (Multi-IA)
  - `import-design.md`
  - `update-memory.md`

- **[.claude/skills/](/.claude/skills/)** - Skills (future)

### Templates

- **`templates/project-memory-template.md`** - Dynamic Memory V5 template
- **`.specify/templates/`** - Spec-Kit templates

---

## 📁 Project Structure

```
archon-orchestrator/
├── INDEX.md                    # This file (navigation)
├── START-HERE.md               # Entry point
├── CLAUDE.md                   # Core instructions
├── README.md                   # Project overview
│
├── .claude/                    # Claude Code config
│   ├── commands/               # Slash commands (15+)
│   └── skills/                 # Skills (future)
│
├── docs/                       # Documentation (15+ guides)
│   ├── WORKFLOW-V6-MVP.md      # Main workflow
│   ├── GOLDEN-PATTERNS.md      # Best practices
│   ├── AGENTIC-PATTERNS.md     # Multi-agent patterns
│   └── [...]
│
├── changelogs/                 # Version history
│   ├── V6.1.3/                 # Current
│   ├── V6.1.2/
│   ├── V6.1.1/
│   ├── V6-MVP/
│   ├── V5.1/
│   ├── V5.2/
│   ├── V5.2.1/
│   └── legacy/
│
├── sessions/                   # Work sessions
│   └── 2025-10-17-skills-analysis/
│
├── scripts/                    # Utilities
│   ├── pulseLogger.cjs         # Observability
│   └── viewPulse.sh            # Timeline viewer
│
└── templates/                  # Templates
    └── project-memory-template.md
```

---

## 🎯 Quick Reference

### Complete MVP in 4-5h

**Phase 0: Multi-IA (30-45 min)**
```bash
/zen-roundtable "Brief: [your project]"
```

**Phase 1: Planning (30-35 min)**
```bash
/speckit.constitution
/speckit.specify
/speckit.design  # ⭐ NEVER skip
/speckit.plan
/speckit.tasks
/speckit.agents
```

**Phase 2: GitHub (2 min)**
- Create branch
- Commit bootstrap files
- Push + create PR

**Phase 3: Implementation (2h45-3h)**
```bash
/speckit.final
```

**Phase 4: Design Import (15 min)**
```bash
/import-design custom-tokens.json
```

**Phase 5: Review (15 min)**
- Review PR
- Approve + merge

---

## 📊 Metrics

**Validated Results (test1710 - AdProof.ai MVP):**

| Metric | Value |
|--------|-------|
| **Duration** | 2h45 (vs 6-7h estimate = -60%) |
| **Tasks** | 99 completed |
| **Files** | 150+ created |
| **Lines** | 12,000+ |
| **Build** | ✅ PASS |
| **Lint** | ✅ PASS (4 warnings) |
| **Design Tokens** | 100% (0 hardcoded) |
| **Observability** | 19 events logged |

**Token Savings (GLM-4.6):**
- Planning: 50K tokens (Sonnet 4.5)
- Implementation: 100K tokens (GLM-4.6)
- **Total savings:** -77% implementation, -70% total

---

## 🆘 Need Help?

1. **Getting Started:** Read [START-HERE.md](./START-HERE.md)
2. **Workflow Questions:** Check [docs/WORKFLOW-V6-MVP.md](./docs/WORKFLOW-V6-MVP.md)
3. **Troubleshooting:** See [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
4. **Patterns:** Review [docs/GOLDEN-PATTERNS.md](./docs/GOLDEN-PATTERNS.md)
5. **Recent Changes:** Check [changelogs/V6.1.3/](./changelogs/V6.1.3/)

---

**Last Updated:** 2025-10-17
**Version:** V6.1.3 Observability Complete
**Status:** ✅ Production Ready

**Happy coding! 🚀**
