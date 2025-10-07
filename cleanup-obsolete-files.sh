#!/bin/bash

# Script de nettoyage des fichiers obsolètes Archon Orchestrator
# Date: 2025-01-02
# Crée un backup avant suppression

echo "🧹 Nettoyage des fichiers obsolètes Archon Orchestrator"
echo "================================================"

# Créer dossier backup si n'existe pas
BACKUP_DIR="./backup-obsolete-$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

echo "📁 Création du backup dans: $BACKUP_DIR"

# Fichiers MD obsolètes à supprimer
MD_FILES=(
    "CLAUDE.md"
    "CLAUDE2.md"
    "PROMPT_REPRISE_SESSION.md"
    "CHANGELOG-FACADE.md"
    "DEMAIN_SESSION_TESTING.md"
    "INTEGRATION_SUCCESS.md"
    "ARCHON_INTEGRATION.md"
    "CLAUDE_CODE_MCP_SETUP.md"
    "CLAUDE_CODE_ORCHESTRATOR_GUIDE.md"
)

# Fichiers de test obsolètes
TEST_FILES=(
    "test-connection.js"
    "test-corrections.js"
    "test-facade-quick.js"
    "test-mcp-protocol.js"
    "test-mcp-sse.js"
    "test-quick-workflow.js"
    "test-revolutionary-workflow.js"
)

echo ""
echo "📋 Fichiers à nettoyer:"
echo "- ${#MD_FILES[@]} fichiers .md obsolètes"
echo "- ${#TEST_FILES[@]} fichiers de test obsolètes"

# Backup et suppression des fichiers MD
echo ""
echo "🔄 Backup des fichiers .md..."
for file in "${MD_FILES[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$BACKUP_DIR/"
        echo "  ✓ Backup: $file"
    fi
done

# Backup et suppression des fichiers de test
echo ""
echo "🔄 Backup des fichiers de test..."
for file in "${TEST_FILES[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$BACKUP_DIR/"
        echo "  ✓ Backup: $file"
    fi
done

# Confirmation avant suppression
echo ""
echo "⚠️  Prêt à supprimer ${#MD_FILES[@]} fichiers .md et ${#TEST_FILES[@]} fichiers de test"
echo "📁 Backup complet créé dans: $BACKUP_DIR"
echo ""
read -p "Confirmer la suppression? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🗑️  Suppression des fichiers..."
    
    for file in "${MD_FILES[@]}"; do
        if [ -f "$file" ]; then
            rm "$file"
            echo "  ✗ Supprimé: $file"
        fi
    done
    
    for file in "${TEST_FILES[@]}"; do
        if [ -f "$file" ]; then
            rm "$file"
            echo "  ✗ Supprimé: $file"
        fi
    done
    
    echo ""
    echo "✅ Nettoyage terminé!"
    echo "💾 Backup disponible dans: $BACKUP_DIR"
    
    # Calculer l'espace libéré
    FREED_SPACE=$(du -sh "$BACKUP_DIR" | cut -f1)
    echo "🎯 Espace libéré: ~$FREED_SPACE"
else
    echo "❌ Nettoyage annulé"
    echo "📁 Backup conservé dans: $BACKUP_DIR"
fi

echo ""
echo "📚 Fichiers essentiels conservés:"
echo "  • CLAUDE-V3.md (guide technique actuel)"
echo "  • README.md (vue d'ensemble)"
echo "  • WORKFLOW-COMPLETE.md (workflow détaillé)"
echo "  • PROMPT-REPRISE-SESSION-ARCHON-V3.md (reprise session)"
echo "  • test-archon-v3-system.js (test principal)"