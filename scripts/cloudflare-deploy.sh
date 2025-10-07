#!/bin/bash

# TrustBoost Phase 4 - Cloudflare CDN Deployment Script
# This script configures Cloudflare CDN for optimal performance

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONFIG_FILE="${PROJECT_ROOT}/cloudflare.json"

# Default configuration
ZONE_NAME="${ZONE_NAME:-trustboost-phase4.com}"
DRY_RUN="${DRY_RUN:-false}"
VERBOSE="${VERBOSE:-false}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==========================================
# UTILITY FUNCTIONS
# ==========================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_verbose() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "${BLUE}[VERBOSE]${NC} $1"
    fi
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if jq is installed
    if ! command -v jq &> /dev/null; then
        log_error "jq is required but not installed"
        exit 1
    fi
    
    # Check if curl is installed
    if ! command -v curl &> /dev/null; then
        log_error "curl is required but not installed"
        exit 1
    fi
    
    # Check Cloudflare credentials
    if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
        log_error "CLOUDFLARE_API_TOKEN environment variable is required"
        exit 1
    fi
    
    # Check if configuration file exists
    if [[ ! -f "$CONFIG_FILE" ]]; then
        log_error "Configuration file not found: $CONFIG_FILE"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

get_zone_id() {
    local zone_name="$1"
    
    log_info "Getting Zone ID for: $zone_name"
    
    local response
    response=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$zone_name" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json")
    
    if [[ $(echo "$response" | jq -r '.success') != "true" ]]; then
        log_error "Failed to get zone information"
        echo "$response" | jq -r '.errors[]' >&2
        exit 1
    fi
    
    local zone_id
    zone_id=$(echo "$response" | jq -r '.result[0].id // empty')
    
    if [[ -z "$zone_id" ]]; then
        log_error "Zone not found: $zone_name"
        exit 1
    fi
    
    log_success "Found Zone ID: $zone_id"
    echo "$zone_id"
}

configure_zone_settings() {
    local zone_id="$1"
    
    log_info "Configuring zone settings..."
    
    local zone_settings
    zone_settings=$(jq -c '.zone_settings' "$CONFIG_FILE")
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would configure zone settings:"
        echo "$zone_settings" | jq '.'
        return 0
    fi
    
    # Configure each setting
    echo "$zone_settings" | jq -r 'to_entries[] | @base64' | while IFS= read -r setting; do
        local key value
        key=$(echo "$setting" | base64 -d | jq -r '.key')
        value=$(echo "$setting" | base64 -d | jq -c '.value')
        
        log_verbose "Setting $key to $value"
        
        local response
        response=$(curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/$zone_id/settings/$key" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data "{\"value\": $value}")
        
        if [[ $(echo "$response" | jq -r '.success') != "true" ]]; then
            log_warning "Failed to set $key: $(echo "$response" | jq -r '.errors[0].message // "Unknown error"')"
        else
            log_verbose "✓ $key configured"
        fi
    done
    
    log_success "Zone settings configured"
}

create_page_rules() {
    local zone_id="$1"
    
    log_info "Creating page rules..."
    
    local page_rules
    page_rules=$(jq -c '.page_rules[]' "$CONFIG_FILE")
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would create page rules:"
        echo "$page_rules" | jq '.'
        return 0
    fi
    
    # Delete existing page rules first
    local existing_rules
    existing_rules=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$zone_id/pagerules" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json")
    
    echo "$existing_rules" | jq -r '.result[].id' | while read -r rule_id; do
        if [[ -n "$rule_id" ]]; then
            log_verbose "Deleting existing page rule: $rule_id"
            curl -s -X DELETE "https://api.cloudflare.com/client/v4/zones/$zone_id/pagerules/$rule_id" \
                -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" > /dev/null
        fi
    done
    
    # Create new page rules
    echo "$page_rules" | while IFS= read -r rule; do
        if [[ -n "$rule" ]]; then
            log_verbose "Creating page rule: $(echo "$rule" | jq -r '.targets[0].constraint.value')"
            
            local response
            response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$zone_id/pagerules" \
                -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
                -H "Content-Type: application/json" \
                --data "$rule")
            
            if [[ $(echo "$response" | jq -r '.success') != "true" ]]; then
                log_warning "Failed to create page rule: $(echo "$response" | jq -r '.errors[0].message // "Unknown error"')"
            else
                log_verbose "✓ Page rule created"
            fi
        fi
    done
    
    log_success "Page rules configured"
}

configure_dns_records() {
    local zone_id="$1"
    
    log_info "Configuring DNS records..."
    
    local dns_records
    dns_records=$(jq -c '.dns_records[]' "$CONFIG_FILE")
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would configure DNS records:"
        echo "$dns_records" | jq '.'
        return 0
    fi
    
    # Get existing DNS records
    local existing_records
    existing_records=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json")
    
    echo "$dns_records" | while IFS= read -r record; do
        if [[ -n "$record" ]]; then
            local name type
            name=$(echo "$record" | jq -r '.name')
            type=$(echo "$record" | jq -r '.type')
            
            # Check if record exists
            local existing_id
            existing_id=$(echo "$existing_records" | jq -r ".result[] | select(.name == \"$name\" and .type == \"$type\") | .id")
            
            if [[ -n "$existing_id" ]]; then
                log_verbose "Updating DNS record: $name ($type)"
                curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records/$existing_id" \
                    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
                    -H "Content-Type: application/json" \
                    --data "$record" > /dev/null
            else
                log_verbose "Creating DNS record: $name ($type)"
                curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$zone_id/dns_records" \
                    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
                    -H "Content-Type: application/json" \
                    --data "$record" > /dev/null
            fi
            
            log_verbose "✓ DNS record configured: $name"
        fi
    done
    
    log_success "DNS records configured"
}

configure_firewall_rules() {
    local zone_id="$1"
    
    log_info "Configuring firewall rules..."
    
    local firewall_rules
    firewall_rules=$(jq -c '.firewall_rules[]' "$CONFIG_FILE")
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would configure firewall rules:"
        echo "$firewall_rules" | jq '.'
        return 0
    fi
    
    # Clear existing firewall rules
    local existing_rules
    existing_rules=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$zone_id/firewall/rules" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json")
    
    echo "$existing_rules" | jq -r '.result[].id' | while read -r rule_id; do
        if [[ -n "$rule_id" ]]; then
            curl -s -X DELETE "https://api.cloudflare.com/client/v4/zones/$zone_id/firewall/rules/$rule_id" \
                -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" > /dev/null
        fi
    done
    
    # Create new firewall rules
    echo "$firewall_rules" | while IFS= read -r rule; do
        if [[ -n "$rule" ]]; then
            local description
            description=$(echo "$rule" | jq -r '.description')
            
            log_verbose "Creating firewall rule: $description"
            
            local response
            response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$zone_id/firewall/rules" \
                -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
                -H "Content-Type: application/json" \
                --data "[$rule]")
            
            if [[ $(echo "$response" | jq -r '.success') != "true" ]]; then
                log_warning "Failed to create firewall rule: $(echo "$response" | jq -r '.errors[0].message // "Unknown error"')"
            else
                log_verbose "✓ Firewall rule created: $description"
            fi
        fi
    done
    
    log_success "Firewall rules configured"
}

deploy_workers() {
    local zone_id="$1"
    
    log_info "Deploying Cloudflare Workers..."
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY RUN] Would deploy workers:"
        jq '.workers | keys[]' "$CONFIG_FILE"
        return 0
    fi
    
    # Deploy each worker
    jq -r '.workers | to_entries[] | @base64' "$CONFIG_FILE" | while IFS= read -r worker; do
        local name script routes
        name=$(echo "$worker" | base64 -d | jq -r '.key')
        script=$(echo "$worker" | base64 -d | jq -r '.value.script')
        routes=$(echo "$worker" | base64 -d | jq -c '.value.routes')
        
        log_verbose "Deploying worker: $name"
        
        # Create or update worker script
        local script_response
        script_response=$(curl -s -X PUT "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/workers/scripts/$name" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/javascript" \
            --data "$script")
        
        if [[ $(echo "$script_response" | jq -r '.success') == "true" ]]; then
            log_verbose "✓ Worker script deployed: $name"
            
            # Configure routes
            echo "$routes" | jq -r '.[]' | while read -r route; do
                curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$zone_id/workers/routes" \
                    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
                    -H "Content-Type: application/json" \
                    --data "{\"pattern\": \"$route\", \"script\": \"$name\"}" > /dev/null
                log_verbose "✓ Route configured: $route -> $name"
            done
        else
            log_warning "Failed to deploy worker $name: $(echo "$script_response" | jq -r '.errors[0].message // "Unknown error"')"
        fi
    done
    
    log_success "Workers deployed"
}

verify_configuration() {
    local zone_id="$1"
    
    log_info "Verifying configuration..."
    
    # Test DNS resolution
    if command -v dig &> /dev/null; then
        local dns_result
        dns_result=$(dig +short "$ZONE_NAME")
        if [[ -n "$dns_result" ]]; then
            log_success "DNS resolution working: $ZONE_NAME -> $dns_result"
        else
            log_warning "DNS resolution failed for $ZONE_NAME"
        fi
    fi
    
    # Test HTTPS
    local https_test
    https_test=$(curl -s -o /dev/null -w "%{http_code}" "https://$ZONE_NAME" || echo "000")
    if [[ "$https_test" == "200" ]]; then
        log_success "HTTPS working: https://$ZONE_NAME"
    else
        log_warning "HTTPS test failed: HTTP $https_test"
    fi
    
    # Test CDN headers
    local cdn_headers
    cdn_headers=$(curl -s -I "https://$ZONE_NAME" | grep -i "cf-" || echo "")
    if [[ -n "$cdn_headers" ]]; then
        log_success "CDN headers present - Cloudflare is active"
    else
        log_warning "CDN headers not found - configuration may not be active"
    fi
    
    log_success "Configuration verification completed"
}

show_usage() {
    cat << EOF
TrustBoost Phase 4 - Cloudflare CDN Deployment Script

Usage: $0 [OPTIONS]

Options:
    -z, --zone-name NAME    Zone name to configure (default: trustboost-phase4.com)
    -d, --dry-run          Preview actions without executing
    -v, --verbose          Enable verbose output
    -h, --help             Show this help message

Environment Variables:
    CLOUDFLARE_API_TOKEN   Cloudflare API token (required)
    CLOUDFLARE_ACCOUNT_ID  Cloudflare account ID (required for workers)
    ZONE_NAME             Zone name (default: trustboost-phase4.com)

Examples:
    # Dry run to preview changes
    $0 --dry-run --verbose
    
    # Deploy to production zone
    $0 --zone-name trustboost-phase4.com
    
    # Deploy with verbose output
    $0 --verbose

EOF
}

main() {
    log_info "TrustBoost Phase 4 - Cloudflare CDN Deployment Starting..."
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -z|--zone-name)
                ZONE_NAME="$2"
                shift 2
                ;;
            -d|--dry-run)
                DRY_RUN="true"
                shift
                ;;
            -v|--verbose)
                VERBOSE="true"
                shift
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    log_info "Configuration:"
    log_info "  Zone Name: $ZONE_NAME"
    log_info "  Dry Run: $DRY_RUN"
    log_info "  Verbose: $VERBOSE"
    echo
    
    # Check prerequisites
    check_prerequisites
    
    # Get zone ID
    local zone_id
    zone_id=$(get_zone_id "$ZONE_NAME")
    
    # Configure Cloudflare
    configure_zone_settings "$zone_id"
    create_page_rules "$zone_id"
    configure_dns_records "$zone_id"
    configure_firewall_rules "$zone_id"
    
    # Deploy workers if account ID is provided
    if [[ -n "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
        deploy_workers "$zone_id"
    else
        log_warning "CLOUDFLARE_ACCOUNT_ID not set - skipping worker deployment"
    fi
    
    # Verify configuration
    if [[ "$DRY_RUN" == "false" ]]; then
        sleep 10  # Wait for changes to propagate
        verify_configuration "$zone_id"
    fi
    
    log_success "🎉 Cloudflare CDN deployment completed!"
    
    if [[ "$DRY_RUN" == "false" ]]; then
        log_info "✅ CDN is now active for: https://$ZONE_NAME"
        log_info "⚠️  Changes may take up to 24 hours to fully propagate"
        log_info "🔍 Monitor performance at: https://dash.cloudflare.com"
    else
        log_info "Run without --dry-run to apply changes"
    fi
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi