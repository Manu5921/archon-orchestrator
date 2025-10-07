#!/bin/bash

# TrustBoost Phase 4 - Disaster Recovery Script
# This script provides automated disaster recovery capabilities

set -euo pipefail

# ==========================================
# CONFIGURATION
# ==========================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Default configuration
BACKUP_BUCKET="${BACKUP_BUCKET:-trustboost-backups}"
AWS_REGION="${AWS_REGION:-us-east-1}"
RESTORE_TYPE="${RESTORE_TYPE:-full}"
BACKUP_ID="${BACKUP_ID:-latest}"
DRY_RUN="${DRY_RUN:-false}"
FORCE_RESTORE="${FORCE_RESTORE:-false}"

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

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is required but not installed"
        exit 1
    fi
    
    # Check required environment variables
    if [[ -z "${AWS_ACCESS_KEY_ID:-}" ]] || [[ -z "${AWS_SECRET_ACCESS_KEY:-}" ]]; then
        log_error "AWS credentials not configured"
        exit 1
    fi
    
    # Check if backup bucket exists
    if ! aws s3 ls "s3://$BACKUP_BUCKET" &> /dev/null; then
        log_error "Backup bucket s3://$BACKUP_BUCKET not accessible"
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

get_latest_backup() {
    log_info "Finding latest backup..."
    
    local latest_backup
    latest_backup=$(aws s3api list-objects-v2 \
        --bucket "$BACKUP_BUCKET" \
        --prefix "registry/" \
        --query 'Contents | sort_by(@, &LastModified) | [-1].Key' \
        --output text)
    
    if [[ "$latest_backup" == "None" ]] || [[ -z "$latest_backup" ]]; then
        log_error "No backups found in registry"
        exit 1
    fi
    
    # Extract backup ID from registry filename
    local backup_id
    backup_id=$(basename "$latest_backup" .json)
    
    log_success "Found latest backup: $backup_id"
    echo "$backup_id"
}

verify_backup_exists() {
    local backup_id="$1"
    local restore_type="$2"
    
    log_info "Verifying backup exists: $backup_id"
    
    # Check registry entry
    if ! aws s3 ls "s3://$BACKUP_BUCKET/registry/${backup_id}.json" &> /dev/null; then
        log_error "Backup registry entry not found: $backup_id"
        return 1
    fi
    
    # Download and parse registry
    local registry_file="/tmp/registry-${backup_id}.json"
    aws s3 cp "s3://$BACKUP_BUCKET/registry/${backup_id}.json" "$registry_file"
    
    # Verify components based on restore type
    case "$restore_type" in
        "full")
            if ! jq -e '.components.database == true' "$registry_file" &> /dev/null; then
                log_error "Database backup not available in $backup_id"
                return 1
            fi
            if ! jq -e '.components.code == true' "$registry_file" &> /dev/null; then
                log_error "Code backup not available in $backup_id"
                return 1
            fi
            if ! jq -e '.components.environment == true' "$registry_file" &> /dev/null; then
                log_error "Environment backup not available in $backup_id"
                return 1
            fi
            ;;
        "database_only")
            if ! jq -e '.components.database == true' "$registry_file" &> /dev/null; then
                log_error "Database backup not available in $backup_id"
                return 1
            fi
            ;;
        "code_only")
            if ! jq -e '.components.code == true' "$registry_file" &> /dev/null; then
                log_error "Code backup not available in $backup_id"
                return 1
            fi
            ;;
    esac
    
    log_success "Backup verification passed"
    return 0
}

create_restore_point() {
    log_info "Creating restore point before disaster recovery..."
    
    local timestamp=$(date +"%Y%m%d-%H%M%S")
    local restore_point_id="restore-point-pre-dr-${timestamp}"
    
    # Create a quick backup of current state
    if [[ "$DRY_RUN" == "false" ]]; then
        # This would trigger a backup workflow or create local backups
        log_info "Creating restore point: $restore_point_id"
        
        # Export current environment state
        mkdir -p "/tmp/restore-point"
        
        # Backup current .env files
        if [[ -f "${PROJECT_ROOT}/.env.local" ]]; then
            cp "${PROJECT_ROOT}/.env.local" "/tmp/restore-point/.env.local.backup"
        fi
        
        # Backup current configuration
        if [[ -f "${PROJECT_ROOT}/next.config.js" ]]; then
            cp "${PROJECT_ROOT}/next.config.js" "/tmp/restore-point/next.config.js.backup"
        fi
        
        # Upload restore point
        aws s3 cp "/tmp/restore-point" "s3://$BACKUP_BUCKET/restore-points/${restore_point_id}/" --recursive
        
        log_success "Restore point created: $restore_point_id"
        echo "$restore_point_id"
    else
        log_info "[DRY RUN] Would create restore point: $restore_point_id"
        echo "$restore_point_id"
    fi
}

restore_database() {
    local backup_id="$1"
    
    log_info "Restoring database from backup: $backup_id"
    
    local db_backup_file="db-${backup_id}.sql.gz"
    local local_backup_file="/tmp/${db_backup_file}"
    
    # Download database backup
    log_info "Downloading database backup..."
    if [[ "$DRY_RUN" == "false" ]]; then
        aws s3 cp "s3://$BACKUP_BUCKET/database/${db_backup_file}" "$local_backup_file"
        
        # Verify integrity
        if ! gunzip -t "$local_backup_file"; then
            log_error "Database backup file is corrupted"
            exit 1
        fi
        
        # Restore database
        log_warning "Restoring database - this will overwrite existing data!"
        if [[ "$FORCE_RESTORE" == "true" ]]; then
            # Extract and restore
            gunzip -c "$local_backup_file" | psql "$DATABASE_URL"
            log_success "Database restored successfully"
        else
            log_warning "Use FORCE_RESTORE=true to proceed with database restore"
        fi
        
        # Cleanup
        rm -f "$local_backup_file"
    else
        log_info "[DRY RUN] Would restore database from: $db_backup_file"
    fi
}

restore_code() {
    local backup_id="$1"
    
    log_info "Restoring code from backup: $backup_id"
    
    local code_backup_file="code-${backup_id}.tar.gz"
    local local_backup_file="/tmp/${code_backup_file}"
    
    # Download code backup
    log_info "Downloading code backup..."
    if [[ "$DRY_RUN" == "false" ]]; then
        aws s3 cp "s3://$BACKUP_BUCKET/code/${code_backup_file}" "$local_backup_file"
        
        # Verify integrity
        if ! tar -tzf "$local_backup_file" > /dev/null; then
            log_error "Code backup file is corrupted"
            exit 1
        fi
        
        # Restore code
        log_warning "Restoring code - this will overwrite existing files!"
        if [[ "$FORCE_RESTORE" == "true" ]]; then
            # Create temporary restore directory
            local restore_dir="/tmp/code-restore-$$"
            mkdir -p "$restore_dir"
            
            # Extract backup
            tar -xzf "$local_backup_file" -C "$restore_dir"
            
            # Copy files (excluding sensitive ones)
            rsync -av \
                --exclude='.env*' \
                --exclude='node_modules' \
                --exclude='.git' \
                "$restore_dir/" "$PROJECT_ROOT/"
            
            log_success "Code restored successfully"
            
            # Cleanup
            rm -rf "$restore_dir"
        else
            log_warning "Use FORCE_RESTORE=true to proceed with code restore"
        fi
        
        rm -f "$local_backup_file"
    else
        log_info "[DRY RUN] Would restore code from: $code_backup_file"
    fi
}

restore_environment() {
    local backup_id="$1"
    
    log_info "Restoring environment configuration from backup: $backup_id"
    
    local env_backup_file="env-${backup_id}.json"
    local local_backup_file="/tmp/${env_backup_file}"
    
    # Download environment backup
    if [[ "$DRY_RUN" == "false" ]]; then
        aws s3 cp "s3://$BACKUP_BUCKET/environment/${env_backup_file}" "$local_backup_file"
        
        # Parse environment backup
        local env_list
        env_list=$(jq -r '.environment_variables' "$local_backup_file" | base64 -d)
        
        log_warning "Environment configuration restored from backup"
        log_info "Environment variables list saved to: /tmp/restored-env-vars.txt"
        echo "$env_list" > "/tmp/restored-env-vars.txt"
        
        rm -f "$local_backup_file"
    else
        log_info "[DRY RUN] Would restore environment from: $env_backup_file"
    fi
}

run_post_restore_checks() {
    log_info "Running post-restore verification checks..."
    
    if [[ "$DRY_RUN" == "false" ]]; then
        # Check if application files exist
        if [[ ! -f "${PROJECT_ROOT}/package.json" ]]; then
            log_error "package.json not found after restore"
            exit 1
        fi
        
        # Check if next.config.js exists
        if [[ ! -f "${PROJECT_ROOT}/next.config.js" ]]; then
            log_warning "next.config.js not found - may need manual configuration"
        fi
        
        # Check if we can install dependencies
        cd "$PROJECT_ROOT"
        if command -v npm &> /dev/null; then
            log_info "Installing dependencies..."
            npm ci --silent
            log_success "Dependencies installed successfully"
        fi
        
        log_success "Post-restore checks completed"
    else
        log_info "[DRY RUN] Would run post-restore verification"
    fi
}

show_usage() {
    cat << EOF
TrustBoost Phase 4 - Disaster Recovery Script

Usage: $0 [OPTIONS]

Options:
    -t, --type TYPE         Restore type: full, database_only, code_only (default: full)
    -b, --backup-id ID      Backup ID to restore (default: latest)
    -d, --dry-run           Preview actions without executing (default: false)
    -f, --force             Force restore without confirmation (default: false)
    -h, --help              Show this help message

Environment Variables:
    BACKUP_BUCKET           S3 bucket for backups (default: trustboost-backups)
    AWS_REGION              AWS region (default: us-east-1)
    DATABASE_URL            Database connection string (required for database restore)

Examples:
    # Dry run of full restore from latest backup
    $0 --dry-run
    
    # Restore specific backup
    $0 --backup-id backup-20241201-120000-123 --type full --force
    
    # Restore only database
    $0 --type database_only --force

EOF
}

main() {
    log_info "TrustBoost Phase 4 - Disaster Recovery Script Starting..."
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -t|--type)
                RESTORE_TYPE="$2"
                shift 2
                ;;
            -b|--backup-id)
                BACKUP_ID="$2"
                shift 2
                ;;
            -d|--dry-run)
                DRY_RUN="true"
                shift
                ;;
            -f|--force)
                FORCE_RESTORE="true"
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
    
    # Validate restore type
    if [[ ! "$RESTORE_TYPE" =~ ^(full|database_only|code_only)$ ]]; then
        log_error "Invalid restore type: $RESTORE_TYPE"
        show_usage
        exit 1
    fi
    
    log_info "Configuration:"
    log_info "  Restore Type: $RESTORE_TYPE"
    log_info "  Backup ID: $BACKUP_ID"
    log_info "  Dry Run: $DRY_RUN"
    log_info "  Force Restore: $FORCE_RESTORE"
    log_info "  Backup Bucket: s3://$BACKUP_BUCKET"
    echo
    
    # Check prerequisites
    check_prerequisites
    
    # Get backup ID if latest
    if [[ "$BACKUP_ID" == "latest" ]]; then
        BACKUP_ID=$(get_latest_backup)
    fi
    
    # Verify backup exists
    if ! verify_backup_exists "$BACKUP_ID" "$RESTORE_TYPE"; then
        log_error "Backup verification failed"
        exit 1
    fi
    
    # Create restore point
    if [[ "$RESTORE_TYPE" == "full" ]] || [[ "$RESTORE_TYPE" == "code_only" ]]; then
        local restore_point_id
        restore_point_id=$(create_restore_point)
        log_info "Restore point created: $restore_point_id"
    fi
    
    # Confirm before proceeding (unless dry run or forced)
    if [[ "$DRY_RUN" == "false" ]] && [[ "$FORCE_RESTORE" == "false" ]]; then
        echo
        log_warning "⚠️  WARNING: This will restore from backup and may overwrite current data!"
        log_warning "   Backup ID: $BACKUP_ID"
        log_warning "   Restore Type: $RESTORE_TYPE"
        echo
        read -p "Are you sure you want to continue? (yes/no): " -r
        if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            log_info "Disaster recovery cancelled by user"
            exit 0
        fi
    fi
    
    # Perform restore based on type
    case "$RESTORE_TYPE" in
        "full")
            restore_database "$BACKUP_ID"
            restore_code "$BACKUP_ID"
            restore_environment "$BACKUP_ID"
            ;;
        "database_only")
            restore_database "$BACKUP_ID"
            ;;
        "code_only")
            restore_code "$BACKUP_ID"
            ;;
    esac
    
    # Post-restore checks
    run_post_restore_checks
    
    log_success "🎉 Disaster recovery completed successfully!"
    log_info "Backup ID: $BACKUP_ID"
    log_info "Restore Type: $RESTORE_TYPE"
    
    if [[ "$DRY_RUN" == "false" ]]; then
        log_warning "⚠️  Remember to:"
        log_warning "   1. Verify application functionality"
        log_warning "   2. Update environment variables if needed"
        log_warning "   3. Restart application services"
        log_warning "   4. Run smoke tests"
    fi
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi