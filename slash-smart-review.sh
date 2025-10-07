#!/bin/bash
# Slash Command Wrapper pour /smart-review dans Claude Code
# Usage: /smart-review phase="feature-complete" files="src/**" scope="critical-path"

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Change to project directory
cd "$SCRIPT_DIR"

# Ensure Gemini Bridge environment
export GEMINI_API_URL="${GEMINI_API_URL:-http://127.0.0.1:7777}"
export GEMINI_CLI_PATH="${GEMINI_CLI_PATH:-gemini}"

# Display smart review header
echo "🧠 SMART REVIEW PHASE 1 - Claude ↔ Gemini"
echo "════════════════════════════════════════════"
echo "📍 Working directory: $(pwd)"
echo "🌉 Gemini Bridge URL: $GEMINI_API_URL"
echo "⚙️  Arguments: $*"
echo ""

# Parse arguments for phase detection
PHASE="general"
for arg in "$@"; do
    if [[ $arg == phase=* ]]; then
        PHASE="${arg#phase=}"
        PHASE="${PHASE//\"/}" # Remove quotes
        break
    fi
done

# Display phase info
case $PHASE in
    "feature-complete")
        echo "🎯 Phase: Feature Completion Review"
        echo "📋 Focus: Completeness, test coverage, production readiness"
        ;;
    "pre-commit")
        echo "🎯 Phase: Pre-Commit Code Review"
        echo "📋 Focus: Code quality, security, performance"
        ;;
    "production-ready")
        echo "🎯 Phase: Production Readiness Assessment"
        echo "📋 Focus: Security, scalability, monitoring"
        ;;
    "refactor-done")
        echo "🎯 Phase: Refactoring Quality Review"
        echo "📋 Focus: Maintainability, patterns, technical debt"
        ;;
    "security-audit")
        echo "🎯 Phase: Security Code Audit"
        echo "📋 Focus: Vulnerabilities, auth, data validation"
        ;;
    *)
        echo "🎯 Phase: General Code Review"
        echo "📋 Focus: Code quality, best practices"
        ;;
esac

echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check if Gemini CLI available
if ! command -v gemini &> /dev/null; then
    echo "❌ Gemini CLI not found. Install with: brew install gemini"
    exit 1
fi

# Check Smart Review services
if [ ! -f "src/services/review-service.js" ]; then
    echo "❌ Smart Review services not found. Ensure you're in archon-orchestrator directory."
    exit 1
fi

# Test Gemini Bridge connectivity
echo "🌉 Testing Gemini Bridge connectivity..."
BRIDGE_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null -m 5 "$GEMINI_API_URL/health" 2>/dev/null || echo "000")

if [ "$BRIDGE_RESPONSE" = "200" ]; then
    echo "✅ Bridge Mode available (fast reviews ~6s)"
else
    echo "⚠️  Bridge Mode unavailable, using CLI fallback (~30-60s)"
fi

echo ""

# Execute Smart Review Command
echo "🚀 Executing Smart Review..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Run the Node.js smart review command
node smart-review-command.js "$@"
SMART_REVIEW_EXIT_CODE=$?

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $SMART_REVIEW_EXIT_CODE -eq 0 ]; then
    echo "🎉 Smart Review completed successfully!"
    echo ""
    echo "💡 Next steps:"
    echo "   - Review the feedback provided by Gemini"
    echo "   - Apply suggested improvements"  
    echo "   - Run tests to validate changes"
    echo "   - Consider re-running /smart-review if major changes made"
else
    echo "❌ Smart Review encountered issues (exit code: $SMART_REVIEW_EXIT_CODE)"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   - Check that files exist and are readable"
    echo "   - Ensure Gemini CLI is working: gemini -p 'test'"
    echo "   - Try with explicit files: /smart-review files='src/specific-file.js'"
    echo "   - Check logs above for specific error messages"
fi

echo ""
echo "📖 For more options: node smart-review-command.js --help"
echo "🧪 For testing: node test-smart-review-phase1.js"
echo ""

exit $SMART_REVIEW_EXIT_CODE