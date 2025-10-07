# 🏛️ Triple-Agent Orchestra - Installation Guide

## 📋 Prerequisites

### Required Software
- **Python 3.8+** with pip
- **Archon** (existing installation)
- **Git** for cloning the repository

### Optional CLI Tools (Recommended)
- **Gemini CLI** - For Google's Gemini model access
- **Claude Code** - For Anthropic's Claude integration

## 🚀 Quick Installation

### 1. Clone the Repository
```bash
# Clone to temporary location
git clone https://github.com/username/archon-orchestrator
cd archon-orchestrator
```

### 2. Auto-Install to Archon
```bash
# Automatic installation (finds Archon automatically)
python setup.py

# OR specify Archon path manually
python setup.py --archon-path /path/to/your/archon
```

### 3. Restart Archon
```bash
# Navigate to your Archon installation and restart
cd /path/to/archon
docker-compose restart  # or your preferred restart method
```

## 🔧 Manual Installation

If automatic installation doesn't work:

### 1. Copy Plugin Files
```bash
# Create plugin directory in Archon
mkdir -p /path/to/archon/plugins/triple-agent-orchestra

# Copy plugin files
cp -r plugin/* /path/to/archon/plugins/triple-agent-orchestra/
cp -r connectors/* /path/to/archon/plugins/triple-agent-orchestra/
cp config/orchestra_config.yaml /path/to/archon/plugins/triple-agent-orchestra/config.yaml
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Register MCP Tools

Add to your Archon MCP server configuration:

```python
# In your MCP server file (usually mcp_server/mcp_server.py)
try:
    from plugins.triple_agent_orchestra.mcp_tools import MCP_TOOLS
    
    # Register orchestra tools
    for tool_name, tool_func in MCP_TOOLS.items():
        register_tool(tool_name, tool_func)
    
    print("✅ Triple-Agent Orchestra tools loaded")
except ImportError as e:
    print(f"⚠️ Could not load Triple-Agent Orchestra: {e}")
```

## 🛠️ CLI Tools Setup

### Gemini CLI Installation
```bash
# Install Google AI CLI (example - check latest docs)
pip install google-generativeai[cli]

# Set up authentication
export GEMINI_API_KEY="your-api-key-here"

# Verify installation
gemini --version
```

### Claude Code Installation  
```bash
# Install Claude Code CLI (check Anthropic docs for latest)
# This might be through npm, pip, or direct download

# Set up authentication
export ANTHROPIC_API_KEY="your-api-key-here"

# Verify installation
claude --version
```

## ⚙️ Configuration

### 1. API Keys (Optional but Recommended)

Add to your environment or `.env` file:
```bash
# For Gemini CLI
export GEMINI_API_KEY="your-gemini-api-key"

# For Claude Code  
export ANTHROPIC_API_KEY="your-claude-api-key"
```

### 2. Plugin Configuration

Edit `/path/to/archon/plugins/triple-agent-orchestra/config.yaml`:

```yaml
agents:
  gemini:
    enabled: true  # Set to false if Gemini CLI not available
    cli_path: "gemini"  # Update if different path
    
  claude:
    enabled: true  # Set to false if Claude CLI not available  
    cli_path: "claude"  # Update if different path
```

## ✅ Verification

### 1. Check Plugin Loading
```bash
# In Archon, check if tools are available
curl http://localhost:8000/mcp/tools | grep orchestra
```

Should return:
```json
[
  "orchestra:route_task",
  "orchestra:agent_handoff",
  "orchestra:sync_context", 
  "orchestra:performance_stats",
  "orchestra:pattern_learning"
]
```

### 2. Test Basic Routing
```bash
# Test the routing tool
curl -X POST http://localhost:8000/mcp/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "orchestra:route_task",
    "parameters": {
      "task_description": "Fix a syntax error",
      "task_type": "syntax_error",
      "complexity": "low"
    }
  }'
```

Should return a routing decision with selected agent.

### 3. Check Agent Health
```bash
curl -X POST http://localhost:8000/mcp/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "orchestra:performance_stats",
    "parameters": {}
  }'
```

## 🐛 Troubleshooting

### Common Issues

#### "Plugin not found"
- Verify plugin directory exists: `/path/to/archon/plugins/triple-agent-orchestra/`
- Check file permissions
- Restart Archon completely

#### "MCP tools not registered"
- Verify MCP server configuration includes tool registration
- Check Python import path
- Look for error messages in Archon logs

#### "CLI tool not found"
- Install Gemini/Claude CLIs
- Verify they're in PATH: `which gemini`, `which claude`
- Update `cli_path` in configuration if needed

#### "Import errors"
- Install dependencies: `pip install -r requirements.txt`
- Verify Python version compatibility
- Check for missing system libraries

### Debug Mode

Enable debug mode in configuration:
```yaml
debug:
  enabled: true
  verbose_routing: true
  save_all_prompts: true
  mock_agent_responses: true  # For testing without CLIs
```

### Logs

Check Archon logs for orchestra-related messages:
```bash
# In Archon directory
tail -f logs/archon.log | grep orchestra
```

## 📞 Support

### Getting Help
1. Check [GitHub Issues](https://github.com/username/archon-orchestrator/issues)
2. Review Archon documentation for MCP integration
3. Verify CLI tool installations independently

### Reporting Issues
Include:
- Archon version
- Plugin configuration
- CLI tools installed and versions
- Error messages and logs
- Steps to reproduce

## 🔄 Uninstallation

```bash
# Automatic uninstall
python setup.py --uninstall

# Manual uninstall
rm -rf /path/to/archon/plugins/triple-agent-orchestra
# Remove tool registrations from MCP server config
```

---

**Next Steps**: After successful installation, see [USAGE.md](USAGE.md) for how to use the Triple-Agent Orchestra system!