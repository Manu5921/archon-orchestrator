#!/bin/bash

# 🧠 Script de Copie Template Smart Review Workflow Phase 1
# Usage: ./copy-init-template.sh /path/to/nouveau-projet [template_type]

if [ $# -eq 0 ]; then
    echo "❌ Usage: $0 /path/to/nouveau-projet [template_type]"
    echo "📋 Examples:"
    echo "   $0 ~/Documents/DEV/mon-projet smart-review  # Smart Review Phase 1 (recommended)"
    echo "   $0 ~/Documents/DEV/mon-projet legacy        # Legacy Archon V3"
    echo "   $0 ~/Documents/DEV/mon-projet               # Default: Smart Review"
    exit 1
fi

PROJECT_PATH="$1"
TEMPLATE_TYPE="${2:-smart-review}"  # Default: smart-review
TEMPLATE_DIR="$(dirname "$0")"

# Créer le répertoire projet si nécessaire
if [ ! -d "$PROJECT_PATH" ]; then
    echo "📁 Creating project directory: $PROJECT_PATH"
    mkdir -p "$PROJECT_PATH"
    mkdir -p "$PROJECT_PATH/src/services"
fi

# Copier selon le type de template
case $TEMPLATE_TYPE in
    "smart-review")
        echo "🧠 Copying Smart Review Workflow Phase 1 template..."
        cp "$TEMPLATE_DIR/SMART-REVIEW-INIT.md" "$PROJECT_PATH/"
        cp "$TEMPLATE_DIR/ARCHITECTURE-TEMPLATE.md" "$PROJECT_PATH/"
        
        # Copier les services Smart Review
        ARCHON_ORCHESTRATOR="/Users/manu/Documents/DEV/archon-orchestrator"
        if [ -f "$ARCHON_ORCHESTRATOR/src/services/context-service.js" ]; then
            cp "$ARCHON_ORCHESTRATOR/src/services/context-service.js" "$PROJECT_PATH/src/services/"
            cp "$ARCHON_ORCHESTRATOR/src/services/review-service.js" "$PROJECT_PATH/src/services/"
            cp "$ARCHON_ORCHESTRATOR/test-smart-review-phase1.js" "$PROJECT_PATH/"
            echo "✅ Smart Review services copiés"
        fi
        
        echo ""
        echo "🎉 Smart Review Workflow Phase 1 Template copié avec succès !"
        echo "🎯 Next steps:"
        echo "   cd $PROJECT_PATH"
        echo "   open SMART-REVIEW-INIT.md  # Suivre le guide Smart Review"
        echo "   node test-smart-review-phase1.js  # Test Phase 1"
        echo ""
        echo "🧠 Smart Review avec context intelligent prêt en ~5 minutes !"
        ;;
        
    "legacy")
        echo "📋 Copying Legacy Archon V3 template..."
        cp "$TEMPLATE_DIR/PROJECT-INIT.md" "$PROJECT_PATH/"
        cp "$TEMPLATE_DIR/ARCHITECTURE-TEMPLATE.md" "$PROJECT_PATH/"
        
        echo ""
        echo "✅ Legacy Template copié avec succès !"
        echo "🎯 Next steps:"
        echo "   cd $PROJECT_PATH"
        echo "   open PROJECT-INIT.md  # Suivre le guide Archon V3"
        echo ""
        echo "🚀 Projet legacy prêt avec Archon V3 en ~5 minutes !"
        ;;
        
    *)
        echo "❌ Template type unknown: $TEMPLATE_TYPE"
        echo "📋 Available templates: smart-review, legacy"
        exit 1
        ;;
esac