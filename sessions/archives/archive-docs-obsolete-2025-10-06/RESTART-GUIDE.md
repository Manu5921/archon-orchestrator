# 🚀 ARCHON RESTART GUIDE - Guide de Redémarrage

## 🎯 Services à Relancer Après Redémarrage Mac

Après un redémarrage Mac, seulement **UN SERVICE** doit être relancé manuellement :

### ✅ Services Automatiques (Claude Code)
Ces services se lancent automatiquement avec Claude Code :
- **Context7 MCP** ✅ Auto
- **Sentry MCP** ✅ Auto  
- **Playwright MCP** ✅ Auto
- **Redis** ✅ Auto (Homebrew)

### 🔄 Service Manuel Required
**Gemini Bridge** - Doit être relancé manuellement :

```bash
cd /Users/manu/Documents/DEV/archon-orchestrator
node setup-gemini-bridge.js setup
```

### 🔍 Vérification Status Services

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

## 🚨 PROBLÈMES IDENTIFIÉS & SOLUTIONS

### Problème 1: Logger Export Error
**Erreur:** `The requested module '../utils/logger.js' does not provide an export named 'logger'`

**Solution:** Le fichier `src/utils/logger.js` a été corrigé pour exporter à la fois :
- `export class Logger` (pour new Logger())
- `export const logger` (pour import direct)

### Problème 2: MCP Server Script Incomplet
**Erreur:** `pnpm run mcp:server` se termine sans erreur mais ne démarre rien

**Solution:** Création du script `src/mcp/start-server.js` qui :
- Instancie `OrchestratorCore` correctement
- Démarre le serveur MCP sur port 8051
- Gère les signaux d'arrêt proprement

### Problème 3: Docker GitHub MCP Défaillant
**Erreur:** `no Go files in /build` lors du build Docker

**Solution:** Le Docker n'est PAS nécessaire pour l'écosystème Archon.
Seuls les MCP servers Claude Code + Gemini Bridge suffisent.

## 📋 WORKFLOW DE DÉMARRAGE RECOMMANDÉ

### 1. Vérification Initiale (30 secondes)
```bash
cd /Users/manu/Documents/DEV/archon-orchestrator

# Vérifier que le directory est correct
pwd
# Doit afficher: /Users/manu/Documents/DEV/archon-orchestrator

# Vérifier Redis
redis-cli ping
# Doit répondre: PONG
```

### 2. Lancement Gemini Bridge (10 secondes)
```bash
# Lancer en background
node setup-gemini-bridge.js setup &

# Attendre 3 secondes puis tester
sleep 3
curl -s http://localhost:7777/health | jq .status
# Doit répondre: "healthy"
```

### 3. Test MCP Services Claude Code (20 secondes)
Dans Claude Code, exécuter ces commandes pour vérifier :

```
# Context7
/mcp context7 resolve-library-id React

# Sentry  
/mcp sentry whoami

# Playwright
/mcp playwright browser_navigate --url https://httpbin.org/get
```

### 4. Vérification Configuration
```bash
cat .archon-orchestration
# Doit montrer ORCHESTRATION_ENABLED=true
```

## 🧹 NETTOYAGE EFFECTUÉ

### Fichiers Corrigés
- ✅ `src/utils/logger.js` - Ajout export logger
- ✅ `package.json` - Script mcp:server pointe vers start-server.js
- ✅ `src/mcp/start-server.js` - Nouveau point d'entrée MCP

### Fichiers Problématiques Identifiés
- ❌ `docker/` - Docker GitHub MCP non fonctionnel (gardé pour référence)
- ❌ `src/mcp/claude-code-orchestration-tools.js` - Import logger corrigé
- ❌ Multiple config files - Beaucoup de variations, garde seulement les actifs

## 🎯 COMMANDE ONE-LINER RESTART

```bash
cd /Users/manu/Documents/DEV/archon-orchestrator && redis-cli ping && node setup-gemini-bridge.js setup &
```

Cette commande unique :
1. Va dans le directory Archon
2. Vérifie Redis (fail si KO)  
3. Lance Gemini Bridge en background

## 📊 STATUS SERVICES ATTENDU

Après exécution complète :

| Service | Port | Status | Command Test |
|---------|------|--------|--------------|
| Redis | 6379 | ✅ RUNNING | `redis-cli ping` |
| Gemini Bridge | 7777 | ✅ RUNNING | `curl http://localhost:7777/health` |
| Context7 MCP | Auto | ✅ RUNNING | `/mcp context7` dans Claude |
| Sentry MCP | Auto | ✅ RUNNING | `/mcp sentry` dans Claude |  
| Playwright MCP | Auto | ✅ RUNNING | `/mcp playwright` dans Claude |

---

*Ce guide garantit un redémarrage Archon en moins de 60 secondes après redémarrage Mac.*