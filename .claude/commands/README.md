# Claude Code Custom Commands

This directory contains custom slash commands for the Archon Orchestrator project.

## Available Commands

### `/smart-review` - Smart Review Phase 1

Execute context-aware Gemini analysis for code quality, security, and production readiness.

**Usage:**
```bash
/smart-review feature-complete       # Feature completion review
/smart-review pre-commit            # Pre-commit quality check
/smart-review production-ready      # Production readiness
/smart-review feature-complete src/auth.js  # Review specific file
```

**Features:**
- ⚡ Context Preparation: 1ms intelligent code analysis  
- 🧠 Framework-Aware: Auto-detects Next.js, React, Supabase patterns
- 🎯 Quality Scoring: Contextual scores with justifications
- 💡 Creative Improvements: Architecture-aware suggestions
- 🧪 Test Generation: Intelligent unit & integration test recommendations
- 🔄 Multi-Mode: Bridge (6s) with CLI fallback (30-60s)

**Performance:**
- Context Analysis: ~1ms
- Review Generation: 6-50s depending on complexity
- Output: 3000-8000 chars detailed analysis
- Insights: 3-7 actionable improvements per review

## Command Implementation

Commands are implemented as Markdown files in `.claude/commands/` directory. Claude Code automatically discovers and makes them available in the slash command interface.

Each command file contains:
- Frontmatter with metadata (description, required tools)
- Command description and usage
- Bash script execution block

## Prerequisites

For Smart Review commands to work properly:
1. Gemini Bridge service running on port 7777
2. Smart Review Phase 1 system operational
3. Context preparation service functional

See main README.md for setup instructions.