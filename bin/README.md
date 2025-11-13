# Archon CLI

Command-line tool for bootstrapping new Archon-powered projects.

## Installation

```bash
cd ~/Documents/DEV/archon-orchestrator
./install.sh
```

This installs the `archon` command globally to `~/.local/bin/archon`.

## Usage

### Create New Project

```bash
archon init <project-name>
```

**Example:**
```bash
archon init ai-scraping-pro
```

Creates a new project at `~/Documents/DEV/ai-scraping-pro` with:

- ✅ Git repository initialized
- ✅ CLAUDE.md (Archon workflow instructions - 27KB)
- ✅ .claude/commands/ (15 Spec-Kit slash commands)
- ✅ .claude/agents/ (5 sub-agents templates)
- ✅ scripts/ (Quality gates: P0-P5)
- ✅ templates/ (project-memory-template.md)
- ✅ .gitignore configured
- ✅ Initial commit created

**Time:** 30 seconds (vs 5 min manual setup)

### Help

```bash
archon --help
```

### Version

```bash
archon --version
```

## Next Steps After Init

1. **Navigate to project:**
   ```bash
   cd ~/Documents/DEV/<project-name>
   ```

2. **Open in Claude Code:**
   ```bash
   code .
   ```

3. **Run /zen-roundtable:**
   ```bash
   /zen-roundtable Brief: <your-project-description>
   ```

4. **Follow Spec-Kit Workflow:**
   - `/speckit.design` → design-tokens.json + wireframes
   - `/speckit.plan` → plan.md (architecture)
   - `/speckit.tasks` → tasks.md (50-100 tasks)
   - `/speckit.agents` → ORCHESTRATION.md
   - `/speckit.final` → Auto-implementation (2-3h)

## Project Name Rules

- Lowercase only
- Alphanumeric characters (a-z, 0-9)
- Hyphens allowed (-)
- No spaces, underscores, or special characters

**Valid:**
- `ai-scraping-pro` ✅
- `my-saas-app` ✅
- `project123` ✅

**Invalid:**
- `My_Project` ❌ (uppercase, underscore)
- `my project` ❌ (space)
- `my.project` ❌ (dot)

## Troubleshooting

### Command not found

If `archon: command not found`:

1. **Check installation:**
   ```bash
   ls -l ~/.local/bin/archon
   ```

2. **Add to PATH** (if not already):
   ```bash
   echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

3. **Verify:**
   ```bash
   archon --version
   ```

### Project already exists

If you get "Project already exists":

1. **Choose different name**
2. **OR delete existing:**
   ```bash
   rm -rf ~/Documents/DEV/<project-name>
   ```

### CLAUDE.md not found

If setup fails with "CLAUDE.md not found":

1. **Verify archon-orchestrator exists:**
   ```bash
   ls ~/Documents/DEV/archon-orchestrator/CLAUDE.md
   ```

2. **Update ARCHON_ROOT** in `bin/archon` if location different

## Technical Details

- **Language:** Node.js (ES modules)
- **Dependencies:** None (uses Node.js built-ins only)
- **Platform:** macOS (tested), Linux (should work), Windows (untested)
- **Node Version:** 18+ required

## Development

### Modify CLI

Edit `bin/archon` and test:

```bash
./bin/archon init test-project
```

### Debugging

Add debug output:

```bash
# In bin/archon, add console.log statements
console.log('DEBUG:', variableName);
```

## Version History

- **v6.1.5** (2025-11-13) - Initial release
  - Project bootstrapping
  - Git init
  - CLAUDE.md + slash commands + agents + scripts
  - .gitignore creation
  - Initial commit

## License

Part of Archon Orchestrator project.

---

**Questions?** See `~/Documents/DEV/archon-orchestrator/CLAUDE.md`
