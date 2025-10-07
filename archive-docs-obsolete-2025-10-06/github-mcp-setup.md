# 🚀 GitHub MCP Server Setup for Archon Orchestrator

## 📋 Configuration Steps

### 1. Create GitHub Personal Access Token (PAT)

1. Go to: https://github.com/settings/personal-access-tokens/new
2. Select scopes needed:
   - `repo` - Full control of private repositories
   - `workflow` - Update GitHub Action workflows
   - `write:packages` - Upload packages to GitHub Package Registry
   - `read:org` - Read org and team membership
   - `gist` - Create gists
   - `notifications` - Access notifications
   - `user` - Update user profile
   - `project` - Full control of projects

3. Generate token and save it securely

### 2. Environment Configuration

Create `.env` file in archon-orchestrator directory:

```bash
# GitHub MCP Configuration
GITHUB_PAT=your_github_pat_here
GITHUB_MCP_ENABLED=true
GITHUB_MCP_MODE=docker  # or 'binary' for direct execution
```

### 3. Docker Setup (Recommended)

```bash
# Pull the official GitHub MCP server image
docker pull ghcr.io/github/github-mcp-server:latest

# Test the server
docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PAT \
  ghcr.io/github/github-mcp-server
```

### 4. Binary Setup (Alternative)

The repository includes a pre-built binary `github-mcp-server` that can be executed directly:

```bash
# Make it executable
chmod +x /Users/manu/Documents/DEV/github-mcp-server/github-mcp-server

# Run directly with PAT
GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PAT \
  /Users/manu/Documents/DEV/github-mcp-server/github-mcp-server
```

## 🔧 Integration with Archon Orchestrator

### MCP Server Configuration

Add to your Archon MCP configuration:

```json
{
  "servers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}"
      }
    }
  }
}
```

### Available GitHub MCP Tools

The GitHub MCP server provides these capabilities:

1. **Repository Management**
   - Browse and query code
   - Search files
   - Analyze commits
   - Understand project structure

2. **Issue & PR Automation**
   - Create, update, manage issues
   - Handle pull requests
   - Code reviews
   - Project boards

3. **CI/CD & Workflows**
   - Monitor GitHub Actions
   - Analyze build failures
   - Manage releases
   - Pipeline insights

4. **Code Analysis**
   - Security findings
   - Dependabot alerts
   - Code patterns
   - Codebase insights

5. **Team Collaboration**
   - Access discussions
   - Manage notifications
   - Analyze team activity

## 🎯 Use Cases for Archon Orchestrator

### 1. Automated Project Setup
```javascript
// Create GitHub repo with full CI/CD
await mcp_call("github:create_repository", {
  name: "new-project",
  description: "Created by Archon Orchestrator",
  private: false,
  auto_init: true,
  gitignore_template: "Node",
  license_template: "mit"
});

// Setup GitHub Actions
await mcp_call("github:create_workflow", {
  repository: "new-project",
  workflow: ".github/workflows/ci.yml",
  content: ciWorkflowContent
});
```

### 2. Issue Management Integration
```javascript
// Create issue from Archon task
await mcp_call("github:create_issue", {
  repository: "archon-orchestrator",
  title: "Task: Implement feature X",
  body: "Generated from Archon workflow",
  labels: ["enhancement", "archon-generated"],
  assignees: ["username"]
});
```

### 3. Code Review Automation
```javascript
// Analyze PR and provide AI review
const pr = await mcp_call("github:get_pull_request", {
  repository: "archon-orchestrator",
  number: 123
});

const review = await analyzeWithGemini(pr.diff);

await mcp_call("github:create_review", {
  repository: "archon-orchestrator",
  pr_number: 123,
  body: review.comments,
  event: "COMMENT"
});
```

### 4. Release Management
```javascript
// Create release from Archon deployment
await mcp_call("github:create_release", {
  repository: "archon-orchestrator",
  tag_name: "v1.2.0",
  name: "Release v1.2.0",
  body: "Automated release by Archon",
  draft: false,
  prerelease: false
});
```

## 📊 Testing Commands

```bash
# Test Docker setup
docker run -it --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PAT \
  ghcr.io/github/github-mcp-server \
  --help

# Test binary directly
GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PAT \
  ./github-mcp-server --help

# Test with curl (when server is running)
curl -X POST http://localhost:3456/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "list_repositories", "params": {}}'
```

## 🔐 Security Best Practices

1. **Never commit PAT to repository**
   - Add `.env` to `.gitignore`
   - Use environment variables

2. **Use minimal scopes**
   - Only grant necessary permissions
   - Create project-specific tokens

3. **Rotate tokens regularly**
   - Update tokens every 90 days
   - Monitor token usage

4. **Secure storage**
   ```bash
   # Restrict file permissions
   chmod 600 .env
   ```

## 🚨 Troubleshooting

### Docker Issues
```bash
# If pull fails due to expired token
docker logout ghcr.io
docker login ghcr.io

# Check Docker is running
docker ps

# View logs
docker logs [container_id]
```

### Binary Issues
```bash
# Check permissions
ls -la github-mcp-server

# Run with debug
GITHUB_PERSONAL_ACCESS_TOKEN=$GITHUB_PAT \
DEBUG=true ./github-mcp-server
```

### Connection Issues
- Verify PAT is valid
- Check network connectivity
- Ensure Docker/binary has network access
- Review firewall settings

## 📚 Resources

- [GitHub MCP Server Repo](https://github.com/github/github-mcp-server)
- [MCP Protocol Docs](https://modelcontextprotocol.io/)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Personal Access Tokens Guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)