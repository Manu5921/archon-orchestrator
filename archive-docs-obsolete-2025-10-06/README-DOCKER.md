# 🐳 Archon Orchestrator - Docker Deployment

Transformation révolutionnaire : de **30 minutes de setup manuel** à **30 secondes de déploiement automatisé** !

## 🚀 Quick Start Ultra-Rapide

```bash
# 1. Clone et configure (30 secondes)
git clone <your-repo>
cd archon-orchestrator

# 2. Configure ton GitHub PAT dans .env.docker
# GITHUB_PAT=github_pat_your_token_here

# 3. Lance tout l'écosystème (une commande !)
./docker-start.sh up

# 🎉 DONE! Archon Orchestrator + Jules + GitHub MCP running!
```

## 🏗️ Architecture Docker

```
┌─────────────────────────────────────────────────────────────────┐
│                    DOCKER COMPOSE ECOSYSTEM                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │   ARCHON    │ │ GITHUB MCP  │ │ JULES MCP   │ │   REDIS     ││
│  │    :3456    │ │   :8054     │ │   :8055     │ │   :6379     ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
│                               │                                 │
│  ┌─────────────┐ ┌─────────────────────────────────────────────┐│
│  │ PROMETHEUS  │ │              NETWORK                        ││
│  │   :9090     │ │          archon_network                     ││
│  └─────────────┘ │        172.20.0.0/16                       ││
│  ┌─────────────┐ └─────────────────────────────────────────────┘│
│  │  GRAFANA    │                                               │
│  │   :3000     │ Volume Persistence:                           │
│  └─────────────┘ • redis_data, jules_data, logs              │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Services et Ports

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Archon Main** | 3456 | http://localhost:3456 | Orchestrateur principal |
| **GitHub MCP** | 8054 | http://localhost:8054 | Serveur MCP GitHub |
| **Jules MCP** | 8055 | http://localhost:8055 | Serveur MCP Jules |
| **Redis** | 6379 | localhost:6379 | Cache et persistance |
| **Prometheus** | 9090 | http://localhost:9090 | Monitoring (optionnel) |
| **Grafana** | 3000 | http://localhost:3000 | Dashboards (optionnel) |

## 🛠️ Commandes Essentielles

### Gestion des Services

```bash
# Démarrer l'écosystème complet
./docker-start.sh up

# Avec monitoring (Prometheus + Grafana)
./docker-start.sh up monitoring

# Status des services
./docker-start.sh status

# Voir les logs
./docker-start.sh logs
./docker-start.sh logs archon-orchestrator  # Service spécifique

# Redémarrer
./docker-start.sh restart

# Arrêter
./docker-start.sh stop

# Nettoyage complet
./docker-start.sh clean
```

### Utilisation d'Archon

```bash
# Ouvrir shell dans Archon
./docker-start.sh shell

# Ou directement depuis l'extérieur
docker exec -it archon_main node jules-hybrid-deploy.js templates
docker exec -it archon_main node jules-hybrid-deploy.js create smart-api
docker exec -it archon_main node jules-hybrid-deploy.js status
```

## ⚙️ Configuration

### 1. Variables d'Environnement Critiques

Edite `.env.docker` :

```bash
# 🔑 REQUIS - Ton GitHub Personal Access Token
GITHUB_PAT=github_pat_11BELLXNY0...

# 🚀 OPTIONNEL - Cookies Google pour Jules (performance++)
GOOGLE_AUTH_COOKIES="session_id=abc; domain=.google.com; auth_token=xyz; domain=.google.com"

# 🔧 OPTIONNEL - API Keys pour appels directs
GEMINI_API_KEY=your-gemini-key
ANTHROPIC_API_KEY=your-anthropic-key
```

### 2. Obtenir les Cookies Google (Performance Optimale)

```bash
# 1. Va sur https://jules.google.com et connecte-toi
# 2. Ouvre Developer Tools (F12)
# 3. Application > Cookies > .google.com
# 4. Copie les cookies importants dans .env.docker
```

## 🔍 Health Checks et Monitoring

### Status des Services

```bash
# Quick check
./docker-start.sh status

# Health endpoints
curl http://localhost:3456/health  # Archon
curl http://localhost:8054/health  # GitHub MCP  
curl http://localhost:8055/health  # Jules MCP
```

### Logs en Temps Réel

```bash
# Tous les services
./docker-start.sh logs

# Service spécifique
./docker-start.sh logs archon-orchestrator
./docker-start.sh logs github-mcp
./docker-start.sh logs jules-mcp
./docker-start.sh logs redis
```

### Monitoring Avancé (Optionnel)

```bash
# Démarrer avec monitoring
./docker-start.sh up monitoring

# Accès
# • Prometheus: http://localhost:9090
# • Grafana: http://localhost:3000 (admin/archon123)
```

## 📊 Workflow Complet Docker

### Création d'une Tâche Intelligente

```bash
# 1. Démarrer l'écosystème
./docker-start.sh up

# 2. Créer tâche avec template IA
docker exec -it archon_main node jules-hybrid-deploy.js create smart-api

# Résultat instantané:
# ✅ Jules MCP: Communication directe (0ms)
# ✅ GitHub MCP: Issue de tracking créée
# ✅ Context: Code existant envoyé à Jules
# ✅ Ready: Communication bidirectionnelle active
```

### Monitoring et Communication

```bash
# Status continu
docker exec -it archon_main node jules-hybrid-deploy.js status

# Communication avec Jules
docker exec -it archon_main node jules-hybrid-deploy.js message jules-123 "Ajoute la validation JWT"

# Voir tous les templates disponibles
docker exec -it archon_main node jules-hybrid-deploy.js templates
```

## 🛡️ Sécurité et Bonnes Pratiques

### Isolation des Containers

- **Network isolé** : `archon_network` (172.20.0.0/16)
- **Users non-root** dans chaque container
- **Volumes persistants** pour les données critiques
- **Health checks** automatiques

### Gestion des Secrets

```bash
# ✅ BIEN - Secrets dans .env.docker (pas commité)
GITHUB_PAT=github_pat_secret

# ❌ MAL - Secrets hardcodés dans le code
const token = "github_pat_secret"
```

### Persistence des Données

- **Redis data** : Volume `redis_data`
- **Jules data** : Volume `jules_data` 
- **Logs** : Dossier `./logs` monté
- **Config** : `.env.docker` en lecture seule

## 🚨 Troubleshooting

### Docker Issues

```bash
# Docker pas démarré
sudo systemctl start docker  # Linux
# ou redémarre Docker Desktop

# Ports occupés
sudo netstat -tulpn | grep :3456
sudo lsof -i :3456

# Permissions
sudo chown -R $USER:$USER ./logs
```

### Service Issues

```bash
# Rebuild services
./docker-start.sh build

# Logs détaillés
./docker-start.sh logs archon-orchestrator

# Shell debug
./docker-start.sh shell archon-orchestrator
```

### GitHub MCP Issues

```bash
# Vérifier token
echo $GITHUB_PAT  # Dans .env.docker

# Test manuel
docker exec -it archon_github_mcp ./github-mcp-server --version
```

### Jules MCP Issues

```bash
# Mode fallback (sans cookies)
# Dans .env.docker: JULES_SESSION_MODE=fresh

# Debug mode  
# Dans .env.docker: JULES_DEBUG=true
```

## 📈 Performance et Optimisation

### Gains Docker vs Setup Manuel

- **⚡ Déploiement** : 30s vs 30 minutes
- **🔧 Configuration** : Centralisée vs dispersée
- **🔄 Reproductibilité** : 100% vs Variable
- **📦 Isolation** : Complète vs Conflits possibles
- **🛡️ Sécurité** : Renforcée vs Basique

### Resource Usage

```bash
# Monitoring des ressources
docker stats

# Archon Main: ~100MB RAM, 10% CPU (idle)
# GitHub MCP: ~50MB RAM, 5% CPU
# Jules MCP: ~200MB RAM, 15% CPU (avec Chromium)
# Redis: ~30MB RAM, 2% CPU
```

### Optimisations

```bash
# Production optimisée
NODE_ENV=production  # Déjà configuré

# Scaling horizontal (future)
docker-compose up --scale archon-orchestrator=3
```

## 🎉 Success Metrics

Une fois le système démarré, tu devrais voir :

```bash
✅ Services are healthy!

🌐 Services Available:
   • Archon Main:    http://localhost:3456
   • GitHub MCP:     http://localhost:8054  
   • Jules MCP:      http://localhost:8055
   • Redis:          localhost:6379

🚀 Quick Start:
   docker exec -it archon_main node jules-hybrid-deploy.js templates
   docker exec -it archon_main node jules-hybrid-deploy.js create smart-api
```

---

## 🌟 Révolution Accomplie

**Avant Docker** : 30 minutes de setup, configuration manuelle, dépendances système, conflits...

**Avec Docker** : 
```bash
./docker-start.sh up
# 🎉 30 secondes plus tard : Ecosystème multi-IA complet opérationnel !
```

**Impact Business** :
- ⚡ **Time-to-Value** : Instantané
- 🛡️ **Reliability** : Health checks automatiques  
- 🔧 **Maintenance** : Simplifiée à l'extrême
- 📈 **Scaling** : Ready pour horizontal scaling

---

*Docker Deployment : La révolution de la simplicité opérationnelle* 🐳✨