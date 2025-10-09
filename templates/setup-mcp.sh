#!/bin/bash

# Archon Orchestrator - MCP Setup Script
# Automates MCP server configuration for new projects
# Version: 1.0 (Context7 + Supabase)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

log_step() {
    echo -e "${CYAN}🔧 $1${NC}"
}

# Check if claude CLI is available
check_claude_cli() {
    if ! command -v claude &> /dev/null; then
        log_error "Claude CLI not found. Please install it first: npm install -g @anthropic-ai/claude-cli"
    fi
    log_success "Claude CLI available"
}

# Check if we're in a project directory
check_project_dir() {
    if [ ! -d ".git" ]; then
        log_warning "Not in a git repository. This is recommended but not required."
    fi
    log_info "Current directory: $(pwd)"
}

# Setup Context7 MCP
setup_context7() {
    log_step "Setting up Context7 MCP..."

    # Check for API key
    if [ -z "$CONTEXT7_API_KEY" ]; then
        log_warning "CONTEXT7_API_KEY not set in environment"
        read -p "Enter Context7 API Key (or press Enter to skip): " context7_key

        if [ -z "$context7_key" ]; then
            log_warning "Skipping Context7 setup"
            return 1
        fi
        export CONTEXT7_API_KEY="$context7_key"
    fi

    # Add Context7 MCP using Claude CLI
    claude mcp add \
        --transport stdio \
        --scope project \
        context7 \
        npx -y @context7/mcp-server

    log_success "Context7 MCP configured"
    return 0
}

# Setup Supabase MCP
setup_supabase() {
    log_step "Setting up Supabase MCP..."

    # Check for required environment variables
    local missing_vars=()

    if [ -z "$SUPABASE_URL" ]; then
        missing_vars+=("SUPABASE_URL")
    fi

    if [ -z "$SUPABASE_ANON_KEY" ]; then
        missing_vars+=("SUPABASE_ANON_KEY")
    fi

    if [ ${#missing_vars[@]} -gt 0 ]; then
        log_warning "Missing Supabase environment variables: ${missing_vars[*]}"
        log_info "You can set them in your .env file or export them"

        read -p "Do you want to enter them now? (y/N): " setup_now

        if [[ ! "$setup_now" =~ ^[Yy]$ ]]; then
            log_warning "Skipping Supabase setup"
            return 1
        fi

        # Interactive input
        read -p "Supabase Project URL: " supabase_url
        read -p "Supabase Anon Key: " supabase_anon_key
        read -p "Supabase Service Role Key (optional): " supabase_service_key

        export SUPABASE_URL="$supabase_url"
        export SUPABASE_ANON_KEY="$supabase_anon_key"
        export SUPABASE_SERVICE_ROLE_KEY="$supabase_service_key"
    fi

    # Add Supabase MCP using Claude CLI
    claude mcp add \
        --transport stdio \
        --scope project \
        supabase \
        npx -y @supabase/mcp-server

    log_success "Supabase MCP configured"
    return 0
}

# Create .env.mcp file with template
create_env_template() {
    log_step "Creating .env.mcp template..."

    if [ -f ".env.mcp" ]; then
        log_warning ".env.mcp already exists, skipping"
        return
    fi

    cat > .env.mcp << 'EOF'
# MCP Configuration Environment Variables
# Copy these to your .env file or export them

# Context7 (Knowledge Base & Patterns Memory)
CONTEXT7_API_KEY=your_context7_api_key_here

# Supabase (Database Inspector & Debugging)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
EOF

    log_success "Created .env.mcp template"
    log_info "Edit .env.mcp and source it: source .env.mcp"
}

# List configured MCP servers
list_mcp_servers() {
    log_step "Listing configured MCP servers..."
    echo ""
    claude mcp list || log_warning "No MCP servers configured yet"
    echo ""
}

# Display usage instructions
show_instructions() {
    echo ""
    echo -e "${GREEN}✅ MCP Setup Complete!${NC}"
    echo ""
    echo -e "${CYAN}📋 Next Steps:${NC}"
    echo "  1. Edit .env.mcp with your API keys"
    echo "  2. Source the file: ${YELLOW}source .env.mcp${NC}"
    echo "  3. Restart Claude Code session to load MCP servers"
    echo ""
    echo -e "${CYAN}🔍 Useful Commands:${NC}"
    echo "  - List MCP servers: ${YELLOW}claude mcp list${NC}"
    echo "  - Remove MCP: ${YELLOW}claude mcp remove <name>${NC}"
    echo "  - Reset choices: ${YELLOW}claude mcp reset-project-choices${NC}"
    echo ""
    echo -e "${CYAN}📚 MCP Servers Configured:${NC}"
    if [ -n "$CONTEXT7_CONFIGURED" ]; then
        echo "  ✅ Context7 - Knowledge base and patterns"
    fi
    if [ -n "$SUPABASE_CONFIGURED" ]; then
        echo "  ✅ Supabase - Database inspector"
    fi
    echo ""
}

# Main setup function
main() {
    echo ""
    echo -e "${CYAN}🚀 Archon Orchestrator - MCP Setup${NC}"
    echo -e "${CYAN}====================================${NC}"
    echo ""

    # Checks
    check_claude_cli
    check_project_dir
    echo ""

    # Create environment template
    create_env_template
    echo ""

    # Setup MCP servers
    CONTEXT7_CONFIGURED=""
    SUPABASE_CONFIGURED=""

    if setup_context7; then
        CONTEXT7_CONFIGURED="true"
    fi
    echo ""

    if setup_supabase; then
        SUPABASE_CONFIGURED="true"
    fi
    echo ""

    # List configured servers
    list_mcp_servers

    # Show final instructions
    show_instructions

    log_success "MCP setup completed successfully!"
}

# Run main function
main "$@"
