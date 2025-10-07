#!/bin/bash
# Prepare Context for Sub-Agent Delegation
# Usage: ./scripts/prepare-agent-context.sh <agent-name> <task-description>

set -euo pipefail

agent_name=$1
task_description=${2:-""}

context_dir=".claude/context"
context_file="${context_dir}/${agent_name}-context.json"

# Ensure context directory exists
mkdir -p "$context_dir"

# Helper: Get current git branch
get_git_branch() {
  git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown"
}

# Helper: Get recent ADRs
get_recent_adrs() {
  if [ -d "docs/adr" ]; then
    find docs/adr -name "*.md" -type f | \
      sort -r | \
      head -5 | \
      xargs -I {} basename {} .md | \
      jq -R . | \
      jq -s .
  else
    echo "[]"
  fi
}

# Helper: Get modified files
get_modified_files() {
  if git rev-parse --git-dir > /dev/null 2>&1; then
    git diff --name-only | jq -R . | jq -s .
  else
    echo "[]"
  fi
}

# Helper: Get current phase from workflow state
get_current_phase() {
  if [ -f ".observability/workflows/current.json" ]; then
    jq -r '.current_phase // "unknown"' .observability/workflows/current.json
  else
    echo "unknown"
  fi
}

# Helper: Get quality standards from constitution
get_quality_standards() {
  if [ -f "constitution.md" ]; then
    # Extract E1-E16 standards mentioned
    grep -oE "E[0-9]+" constitution.md | sort -u | jq -R . | jq -s .
  else
    echo '["E5","E10","E16"]'  # Default standards
  fi
}

# Helper: Get project dependencies
get_dependencies() {
  if [ -f "package.json" ]; then
    jq -c '{
      dependencies: .dependencies // {},
      devDependencies: .devDependencies // {}
    }' package.json
  else
    echo '{}'
  fi
}

# Helper: Get available artifacts
get_artifacts() {
  cat <<EOF
{
  "design_tokens": $([ -f ".design/tokens.json" ] && echo '".design/tokens.json"' || echo 'null'),
  "tasks": $([ -f "tasks.md" ] && echo '"tasks.md"' || echo 'null'),
  "constitution": $([ -f "constitution.md" ] && echo '"constitution.md"' || echo 'null'),
  "spec": $([ -f ".specify/specs/*/spec.md" ] && echo '".specify/specs/*/spec.md"' || echo 'null'),
  "agents": $([ -d ".claude/agents" ] && find .claude/agents -name "*.md" | jq -R . | jq -s . || echo '[]')
}
EOF
}

# Generate context file
cat > "$context_file" <<EOF
{
  "metadata": {
    "generated_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "agent_name": "${agent_name}",
    "task": "${task_description}"
  },
  "project": {
    "name": "$(basename "$(pwd)")",
    "git_branch": "$(get_git_branch)",
    "phase": "$(get_current_phase)"
  },
  "context": {
    "previous_decisions": $(get_recent_adrs),
    "modified_files": $(get_modified_files),
    "quality_standards": $(get_quality_standards)
  },
  "artifacts": $(get_artifacts),
  "dependencies": $(get_dependencies),
  "instructions": {
    "read_first": [
      "constitution.md",
      "tasks.md",
      ".design/tokens.json"
    ],
    "constraints": [
      "Follow quality standards defined in context.quality_standards",
      "Respect project dependencies versions",
      "Maintain consistency with artifacts.design_tokens"
    ]
  }
}
EOF

# Pretty print with jq if available
if command -v jq &> /dev/null; then
  jq . "$context_file" > "${context_file}.tmp" && mv "${context_file}.tmp" "$context_file"
fi

echo "✅ Context prepared for agent: ${agent_name}"
echo "📄 File: ${context_file}"
echo ""
echo "📋 Context includes:"
jq -r '"  - Project: " + .project.name' "$context_file"
jq -r '"  - Phase: " + .project.phase' "$context_file"
jq -r '"  - ADRs: " + (.context.previous_decisions | length | tostring)' "$context_file"
jq -r '"  - Modified files: " + (.context.modified_files | length | tostring)' "$context_file"
jq -r '"  - Quality standards: " + (.context.quality_standards | join(", "))' "$context_file"
echo ""
echo "💡 Usage in prompt:"
echo "   @${agent_name}, read context file first: ${context_file}"
