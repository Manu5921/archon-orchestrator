#!/bin/bash

# =================================================================
# 🚀 ARCHON ORCHESTRATOR - One-Command Docker Deployment
# =================================================================

set -e

echo "🎭 Archon Orchestrator - Docker Deployment Starting..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo ""
    echo -e "${PURPLE}==================================================================="
    echo -e "🎭 $1"
    echo -e "===================================================================${NC}"
}

print_step() {
    echo -e "${CYAN}➤ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is running
print_step "Checking Docker status..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker Desktop."
    exit 1
fi
print_success "Docker is running"

# Check if .env.docker exists, if not copy from .env
if [ ! -f .env.docker ]; then
    print_warning ".env.docker not found"
    if [ -f .env ]; then
        print_step "Copying .env to .env.docker"
        cp .env .env.docker
        print_success "Environment file prepared"
    else
        print_error "No environment file found. Please create .env.docker"
        exit 1
    fi
fi

# Validate GitHub PAT
if ! grep -q "^GITHUB_PAT=github_pat_" .env.docker; then
    print_warning "GitHub PAT not configured in .env.docker"
    echo -e "${YELLOW}Please edit .env.docker and set your GITHUB_PAT${NC}"
    echo -e "${YELLOW}Get token from: https://github.com/settings/personal-access-tokens/new${NC}"
fi

# Create logs directory
print_step "Creating logs directory..."
mkdir -p logs
print_success "Logs directory ready"

# Parse command line arguments
MODE=${1:-"up"}
PROFILE=${2:-""}

case $MODE in
    "up" | "start")
        print_header "STARTING ARCHON ORCHESTRATOR ECOSYSTEM"
        
        if [ "$PROFILE" = "monitoring" ]; then
            print_step "Starting with monitoring (Prometheus + Grafana)..."
            docker-compose --env-file .env.docker --profile monitoring up -d
        else
            print_step "Starting core services..."
            docker-compose --env-file .env.docker up -d
        fi
        
        print_step "Waiting for services to be healthy..."
        sleep 10
        
        # Check service health
        print_step "Checking service status..."
        
        if docker-compose --env-file .env.docker ps | grep -q "Up.*healthy"; then
            print_success "Services are healthy!"
            
            print_header "🎉 ARCHON ORCHESTRATOR IS READY!"
            echo ""
            echo -e "${GREEN}🌐 Services Available:${NC}"
            echo -e "${CYAN}   • Archon Main:    http://localhost:3456${NC}"
            echo -e "${CYAN}   • GitHub MCP:     http://localhost:8054${NC}"
            echo -e "${CYAN}   • Jules MCP:      http://localhost:8055${NC}"
            echo -e "${CYAN}   • Redis:          localhost:6379${NC}"
            
            if [ "$PROFILE" = "monitoring" ]; then
                echo -e "${YELLOW}📊 Monitoring:${NC}"
                echo -e "${CYAN}   • Prometheus:     http://localhost:9090${NC}"
                echo -e "${CYAN}   • Grafana:        http://localhost:3000 (admin/archon123)${NC}"
            fi
            
            echo ""
            echo -e "${GREEN}🚀 Quick Start:${NC}"
            echo -e "${CYAN}   docker exec -it archon_main node jules-hybrid-deploy.js templates${NC}"
            echo -e "${CYAN}   docker exec -it archon_main node jules-hybrid-deploy.js create smart-api${NC}"
            echo ""
            echo -e "${PURPLE}📋 Manage:${NC}"
            echo -e "${CYAN}   ./docker-start.sh status    # Check service status${NC}"
            echo -e "${CYAN}   ./docker-start.sh logs      # View logs${NC}"
            echo -e "${CYAN}   ./docker-start.sh stop      # Stop services${NC}"
            echo ""
        else
            print_warning "Some services may not be fully ready yet. Check logs with:"
            echo -e "${CYAN}   ./docker-start.sh logs${NC}"
        fi
        ;;
        
    "stop" | "down")
        print_header "STOPPING ARCHON ORCHESTRATOR"
        docker-compose --env-file .env.docker down
        print_success "Services stopped"
        ;;
        
    "restart")
        print_header "RESTARTING ARCHON ORCHESTRATOR"
        docker-compose --env-file .env.docker down
        sleep 2
        docker-compose --env-file .env.docker up -d
        print_success "Services restarted"
        ;;
        
    "status")
        print_header "ARCHON ORCHESTRATOR STATUS"
        docker-compose --env-file .env.docker ps
        echo ""
        print_step "Service Health:"
        docker-compose --env-file .env.docker exec archon-orchestrator curl -s http://localhost:3456/health | grep -o '"status":"[^"]*"' || echo "Archon: Not Ready"
        docker-compose --env-file .env.docker exec github-mcp curl -s http://localhost:3000/health | grep -o '"status":"[^"]*"' || echo "GitHub MCP: Not Ready"
        docker-compose --env-file .env.docker exec jules-mcp curl -s http://localhost:3001/health | grep -o '"status":"[^"]*"' || echo "Jules MCP: Not Ready"
        ;;
        
    "logs")
        SERVICE=${2:-""}
        if [ -n "$SERVICE" ]; then
            print_header "LOGS FOR $SERVICE"
            docker-compose --env-file .env.docker logs -f $SERVICE
        else
            print_header "ALL SERVICES LOGS"
            docker-compose --env-file .env.docker logs -f
        fi
        ;;
        
    "build")
        print_header "BUILDING ARCHON ORCHESTRATOR IMAGES"
        docker-compose --env-file .env.docker build
        print_success "Images built successfully"
        ;;
        
    "clean")
        print_header "CLEANING ARCHON ORCHESTRATOR"
        docker-compose --env-file .env.docker down -v --rmi all
        docker system prune -f
        print_success "Cleanup completed"
        ;;
        
    "shell")
        SERVICE=${2:-"archon-orchestrator"}
        print_header "OPENING SHELL IN $SERVICE"
        docker-compose --env-file .env.docker exec $SERVICE sh
        ;;
        
    *)
        print_header "ARCHON ORCHESTRATOR - DOCKER MANAGEMENT"
        echo ""
        echo -e "${GREEN}Usage: ./docker-start.sh <command> [options]${NC}"
        echo ""
        echo -e "${CYAN}Commands:${NC}"
        echo -e "  ${YELLOW}up|start${NC}       Start all services"
        echo -e "  ${YELLOW}up monitoring${NC}  Start with Prometheus + Grafana"
        echo -e "  ${YELLOW}stop|down${NC}      Stop all services"
        echo -e "  ${YELLOW}restart${NC}        Restart all services"
        echo -e "  ${YELLOW}status${NC}         Show service status"
        echo -e "  ${YELLOW}logs [service]${NC} Show logs (all or specific service)"
        echo -e "  ${YELLOW}build${NC}          Build Docker images"
        echo -e "  ${YELLOW}clean${NC}          Stop and remove everything"
        echo -e "  ${YELLOW}shell [service]${NC} Open shell in service (default: archon-orchestrator)"
        echo ""
        echo -e "${CYAN}Examples:${NC}"
        echo -e "  ./docker-start.sh up"
        echo -e "  ./docker-start.sh logs archon-orchestrator"
        echo -e "  ./docker-start.sh shell jules-mcp"
        echo ""
        ;;
esac