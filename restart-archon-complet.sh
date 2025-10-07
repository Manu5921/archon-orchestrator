#!/bin/bash

echo "🚀 REDÉMARRAGE ARCHON COMPLET APRÈS CRASH MAC"
echo "=============================================="

# Vérifier Redis (critique pour tout l'écosystème)
echo "🔍 Vérification Redis..."
if ! redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redis non accessible"
    echo "   💡 Démarrer avec: brew services start redis"
    echo "   💡 Ou installer: brew install redis"
    exit 1
fi
echo "✅ Redis OK"

# Vérifier que les deux projets existent
echo "🔍 Vérification projets Archon..."
if [[ ! -d "/Users/manu/Documents/DEV/archon-orchestrator" ]]; then
    echo "❌ Projet archon-orchestrator non trouvé"
    exit 1
fi
if [[ ! -d "/Users/manu/Documents/DEV/archon" ]]; then
    echo "❌ Projet archon principal non trouvé" 
    exit 1
fi
echo "✅ Projets Archon OK"

# Démarrer Orchestra services
echo ""
echo "🔄 DÉMARRAGE ORCHESTRA SERVICES..."
echo "Localisation: /Users/manu/Documents/DEV/archon-orchestrator"

cd /Users/manu/Documents/DEV/archon-orchestrator

# Lancer Gemini Bridge en background
echo "   🤖 Lancement Gemini Bridge (port 7777)..."
node setup-gemini-bridge.js setup > /tmp/gemini-bridge.log 2>&1 &
GEMINI_PID=$!

# Attendre et vérifier Gemini Bridge
echo "   ⏳ Attente démarrage Gemini Bridge..."
sleep 5

if curl -s http://localhost:7777/health | grep -q "healthy"; then
    echo "   ✅ Gemini Bridge opérationnel"
else
    echo "   ⚠️ Gemini Bridge - vérification manuelle recommandée"
    echo "      Log: /tmp/gemini-bridge.log"
fi

# Démarrer Archon Principal (le plus long)
echo ""
echo "🔄 DÉMARRAGE ARCHON PRINCIPAL..."
echo "Localisation: /Users/manu/Documents/DEV/archon"
echo "⏳ Construction Docker en cours (2-3 minutes)..."

cd /Users/manu/Documents/DEV/archon

# Lancer make dev (hybride: Docker backend + frontend local)
echo "   🐳 Démarrage conteneurs Docker..."
echo "   🎨 Démarrage frontend local Vite..."

# Note: make dev est bloquant, il démarre tout l'environnement
make dev &
ARCHON_PID=$!

# Attendre que les services soient prêts
echo "   ⏳ Attente des services Archon..."
sleep 10

# Vérification finale
echo ""
echo "🔍 VÉRIFICATION FINALE..."

services_ok=0
total_services=4

# Test UI (port 3737)
if curl -s http://localhost:3737 > /dev/null 2>&1; then
    echo "✅ Archon UI (3737) : OK"
    ((services_ok++))
else
    echo "❌ Archon UI (3737) : KO"
fi

# Test API (port 8181)  
if curl -s http://localhost:8181/health | grep -q "healthy"; then
    echo "✅ Archon API (8181) : OK"
    ((services_ok++))
else
    echo "❌ Archon API (8181) : KO"
fi

# Test MCP (port 8051)
if curl -s http://localhost:8051/mcp > /dev/null 2>&1; then
    echo "✅ Archon MCP (8051) : OK"  
    ((services_ok++))
else
    echo "❌ Archon MCP (8051) : KO"
fi

# Test Gemini Bridge (port 7777)
if curl -s http://localhost:7777/health | grep -q "healthy"; then
    echo "✅ Gemini Bridge (7777) : OK"
    ((services_ok++))
else
    echo "❌ Gemini Bridge (7777) : KO"
fi

# Résultat final
echo ""
echo "📊 RÉSULTAT: $services_ok/$total_services services opérationnels"

if [[ $services_ok -eq $total_services ]]; then
    echo "🎉 ARCHON COMPLET OPÉRATIONNEL !"
    echo ""
    echo "🌐 Accès:"
    echo "   • Interface utilisateur: http://localhost:3737"
    echo "   • API Backend:          http://localhost:8181"
    echo "   • MCP Server:           http://localhost:8051/mcp"
    echo "   • Gemini Bridge:        http://localhost:7777"
    echo ""
    echo "🧪 Test MCP dans Claude Code:"
    echo "   /mcp archon health_check_all"
else
    echo "⚠️ Certains services ne répondent pas"
    echo ""
    echo "🔧 Diagnostic:"
    echo "   • Vérifier logs: docker-compose logs"
    echo "   • Vérifier ports: lsof -i :3737,:8181,:8051,:7777"
    echo "   • Redémarrer si nécessaire"
fi

echo ""
echo "📋 Processus actifs:"
echo "   • Gemini Bridge PID: $GEMINI_PID" 
echo "   • Archon Principal PID: $ARCHON_PID"
echo ""
echo "🛑 Arrêter les services: kill $GEMINI_PID $ARCHON_PID"