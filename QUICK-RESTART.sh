#!/bin/bash
# ARCHON QUICK RESTART SCRIPT
# Usage: ./QUICK-RESTART.sh
#
# ⚠️ AVANT D'EXÉCUTER : Lire RESTART-PROCEDURE-STRICT.md

set -e

echo "🚀 ARCHON QUICK RESTART"
echo "======================="
echo ""

# Vérifications
echo "🔍 Vérifications préliminaires..."
if ! redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redis non accessible"
    echo "   Lancer: brew services start redis"
    exit 1
fi
echo "✅ Redis OK"

if [ ! -f "/Users/manu/Documents/DEV/archon/Makefile" ]; then
    echo "❌ Projet archon introuvable"
    exit 1
fi
echo "✅ Projet archon OK"

echo ""
echo "🔄 Démarrage Archon..."
echo "⏳ Durée attendue : 2-3 minutes"
echo ""

# Archon Principal
cd /Users/manu/Documents/DEV/archon && make dev

echo ""
echo "✅ Archon démarré"
echo ""
echo "📋 Vérifier les services :"
echo "   UI  : http://localhost:3737"
echo "   API : http://localhost:8181/health"
echo "   MCP : http://localhost:8051/mcp"
