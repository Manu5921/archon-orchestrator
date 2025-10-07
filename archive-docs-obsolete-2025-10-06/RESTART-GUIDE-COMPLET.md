# 🚀 ARCHON RESTART GUIDE COMPLET - Guide de Redémarrage Après Crash Mac

## ⚠️ AVERTISSEMENT CRITIQUE - LIRE EN PREMIER

**🔴 POUR LES FUTURES SESSIONS CLAUDE :**

**AVANT de redémarrer Archon, lire OBLIGATOIREMENT :**
👉 **[RESTART-PROCEDURE-STRICT.md](./RESTART-PROCEDURE-STRICT.md)** 👈

Ce document contient :
- ❌ Erreurs récurrentes à NE JAMAIS répéter
- ✅ Règles absolues (chemins absolus, pas de répétition d'erreurs)
- 📋 Commandes exactes à copier-coller
- 🚨 Leçons des erreurs historiques

**Ne PAS improviser. Suivre la procédure stricte à la lettre.**

---

## 🎯 ARCHITECTURE ARCHON - DEUX PROJETS INTERDÉPENDANTS

**IMPORTANT:** L'écosystème Archon comprend **DEUX projets distincts** qui doivent TOUS DEUX être redémarrés après un crash/redémarrage Mac :

### 📁 Projet 1: archon-orchestrator
**Localisation:** `/Users/manu/Documents/DEV/archon-orchestrator`
**Rôle:** Orchestration multi-IA et communication entre agents
**Services:** Gemini Bridge, Orchestra MCP, Jules communication

### 📁 Projet 2: archon (Principal)
**Localisation:** `/Users/manu/Documents/DEV/archon`
**Rôle:** Interface utilisateur, API backend, MCP server, base de données
**Services:** UI (3737), API (8181), MCP (8051), agents IA

## 🔄 PROCÉDURE DE REDÉMARRAGE COMPLÈTE

### Étape 1: Services Automatiques (Claude Code)
Ces services se lancent automatiquement avec Claude Code :
- **Context7 MCP** ✅ Auto
- **Sentry MCP** ✅ Auto  
- **Playwright MCP** ✅ Auto
- **Redis** ✅ Auto (Homebrew)

### Étape 2: Orchestrator Services
```bash
cd /Users/manu/Documents/DEV/archon-orchestrator
node setup-gemini-bridge.js setup &
./start-orchestra.sh &
```

### Étape 3: Archon Main Services
```bash
cd /Users/manu/Documents/DEV/archon
make dev
```

**DURÉE TOTALE:** ~2-3 minutes (construction Docker + démarrage services)

### 🔍 Vérification Status Services Complets

#### Services Orchestra (archon-orchestrator)
```bash
# 1. Vérifier Redis
redis-cli ping
# Doit répondre: PONG

# 2. Vérifier Gemini Bridge  
curl -s http://localhost:7777/health
# Doit répondre: {"status":"healthy",...}

# 3. Tester Context7 MCP (dans Claude Code)
/mcp context7 resolve-library-id Next.js

# 4. Tester Sentry MCP (dans Claude Code)  
/mcp sentry whoami

# 5. Tester Playwright MCP (dans Claude Code)
/mcp playwright browser_navigate --url https://httpbin.org/get
```

#### Services Archon Principal
```bash
# 6. Vérifier Archon UI
curl -s http://localhost:3737 | head -5
# Doit répondre: HTML de l'interface React

# 7. Vérifier Archon API
curl -s http://localhost:8181/health
# Doit répondre: {"status":"healthy","service":"archon-backend",...}

# 8. Vérifier Archon MCP
curl -s http://localhost:8051/mcp
# Doit répondre: Erreur acceptable "text/event-stream" (serveur actif)

# 9. Tester Archon MCP (dans Claude Code)
/mcp archon health_check_all
```

## 📋 WORKFLOW DE DÉMARRAGE COMPLET APRÈS CRASH

### 1. Vérification Initiale (30 secondes)
```bash
# Vérifier Redis (critique pour tout l'écosystème)
redis-cli ping
# Doit répondre: PONG

# Vérifier que les deux projets existent
ls -la /Users/manu/Documents/DEV/ | grep archon
# Doit montrer: archon/ et archon-orchestrator/
```

### 2. Démarrage Orchestra Services (30 secondes)
```bash
cd /Users/manu/Documents/DEV/archon-orchestrator

# Lancer Gemini Bridge
node setup-gemini-bridge.js setup &

# Lancer Orchestra (optionnel mais recommandé)
./start-orchestra.sh &

# Vérifier
sleep 5
curl -s http://localhost:7777/health | grep healthy
```

### 3. Démarrage Archon Principal (2-3 minutes)
```bash
cd /Users/manu/Documents/DEV/archon

# Commande hybride: Docker backend + frontend local
make dev

# Cette commande va:
# - Construire les images Docker (archon-server, archon-mcp, archon-agents)
# - Démarrer les conteneurs backend
# - Lancer le frontend Vite en local
```

### 4. Vérification Complète (1 minute)
```bash
# Vérifier tous les ports critiques
lsof -i :3737 && lsof -i :8181 && lsof -i :8051 && lsof -i :7777

# Tester les endpoints
curl -s http://localhost:3737 | head -2  # UI React
curl -s http://localhost:8181/health     # API Backend
curl -s http://localhost:8051/mcp        # MCP Server
curl -s http://localhost:7777/health     # Gemini Bridge
```

### 5. Test MCP Integration (30 secondes)
Dans Claude Code :
```
# Context7 (auto avec Claude Code)
/mcp context7 resolve-library-id React

# Sentry (auto avec Claude Code)
/mcp sentry whoami

# Archon (après démarrage make dev)
/mcp archon health_check_all
```

## 🎯 COMMANDES DE RESTART RAPIDE

### Option 1: Restart Minimal (Orchestra seulement)
```bash
cd /Users/manu/Documents/DEV/archon-orchestrator && redis-cli ping && node setup-gemini-bridge.js setup &
```

### Option 2: Restart Complet (Recommandé)
```bash
# Terminal 1: Orchestra
cd /Users/manu/Documents/DEV/archon-orchestrator && node setup-gemini-bridge.js setup &

# Terminal 2: Archon Principal  
cd /Users/manu/Documents/DEV/archon && make dev
```

### Option 3: Script de Restart Automatisé
```bash
# Créer script de restart
cat > ~/restart-archon-complet.sh << 'EOF'
#!/bin/bash
echo "🚀 Redémarrage Archon complet..."

# Vérifier Redis
if ! redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redis non accessible - démarrer avec: brew services start redis"
    exit 1
fi

echo "✅ Redis OK"

# Démarrer Orchestra
echo "🔄 Démarrage Orchestra services..."
cd /Users/manu/Documents/DEV/archon-orchestrator
node setup-gemini-bridge.js setup &
ORCH_PID=$!

# Attendre et vérifier
sleep 3
if curl -s http://localhost:7777/health | grep -q healthy; then
    echo "✅ Orchestra services OK"
else
    echo "⚠️ Orchestra services - vérifier manuellement"
fi

# Démarrer Archon Principal
echo "🔄 Démarrage Archon principal..."
echo "⏳ Construction Docker en cours (2-3 minutes)..."
cd /Users/manu/Documents/DEV/archon
make dev
EOF

chmod +x ~/restart-archon-complet.sh
```

Usage: `~/restart-archon-complet.sh`

## 📊 STATUS SERVICES COMPLET ATTENDU

Après exécution complète des DEUX projets :

### Services Orchestra (archon-orchestrator)
| Service | Port | Status | Command Test |
|---------|------|--------|--------------|
| Redis | 6379 | ✅ RUNNING | `redis-cli ping` |
| Gemini Bridge | 7777 | ✅ RUNNING | `curl http://localhost:7777/health` |
| Context7 MCP | Auto | ✅ RUNNING | `/mcp context7` dans Claude |
| Sentry MCP | Auto | ✅ RUNNING | `/mcp sentry` dans Claude |  
| Playwright MCP | Auto | ✅ RUNNING | `/mcp playwright` dans Claude |

### Services Archon Principal (archon)
| Service | Port | Status | Command Test |
|---------|------|--------|--------------|
| Archon UI | 3737 | ✅ RUNNING | `curl http://localhost:3737` |
| Archon API | 8181 | ✅ RUNNING | `curl http://localhost:8181/health` |
| Archon MCP | 8051 | ✅ RUNNING | `curl http://localhost:8051/mcp` |
| Archon Agents | Docker | ✅ RUNNING | Conteneur `archon-agents` |

### Intégration MCP
| MCP Tool | Status | Command Test |
|----------|--------|--------------|
| archon:perform_rag_query | ✅ READY | `/mcp archon perform_rag_query` |
| archon:search_code_examples | ✅ READY | `/mcp archon search_code_examples` |
| archon:manage_project | ✅ READY | `/mcp archon manage_project` |
| archon:get_available_sources | ✅ READY | `/mcp archon get_available_sources` |

## 🚨 DURÉE DE RESTART RÉELLE

**Temps constaté après crash Mac:**
- ⚡ **Services Orchestra:** 30-60 secondes
- 🐳 **Services Archon:** 2-3 minutes (build Docker)
- ✅ **Total système opérationnel:** 3-4 minutes

**Optimisations possibles:**
- Images Docker cached = startup plus rapide
- Redis et MCP services Claude = démarrage instantané
- Seul le build initial Docker prend du temps

## 🚨 PROBLÈMES IDENTIFIÉS & SOLUTIONS

### Problème 1: Logger Export Error
**Erreur:** `The requested module '../utils/logger.js' does not provide an export named 'logger'`

**Solution:** Le fichier `src/utils/logger.js` a été corrigé pour exporter à la fois :
- `export class Logger` (pour new Logger())
- `export const logger` (pour import direct)

### Problème 2: Services Archon Manquants Après Restart
**Erreur:** localhost:3737 non accessible, API 8181 fermé

**Solution:** Le projet principal `/Users/manu/Documents/DEV/archon` contient les services critiques.
Utiliser `make dev` pour démarrer l'écosystème complet avec Docker.

### Problème 3: Temps de Redémarrage Long
**Problème:** 3-4 minutes pour restart complet vs 60 secondes annoncé

**Solution:** Durée réelle incluant build Docker. Optimisations :
- Garder images Docker cached
- Utiliser `make dev` au lieu des commandes individuelles
- Redis et MCP Claude démarrent instantanément

---

*Ce guide garantit un redémarrage Archon COMPLET en 3-4 minutes après crash Mac, avec vérifications de chaque service.*