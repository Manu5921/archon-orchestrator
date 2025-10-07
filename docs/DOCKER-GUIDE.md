# 🐳 DOCKER GUIDE - Archon Orchestrator

Deployment Docker ultra-rapide (30 secondes).

---

## ⚡ DÉPLOIEMENT ULTRA-RAPIDE

### Option 1: Ecosystem Complet

```bash
./docker-start.sh up
```

**Démarre:**
- Redis
- GitHub MCP
- Jules MCP
- Archon
- Services sur ports standards

**Temps:** 30 secondes

---

### Option 2: Test Rapide

```bash
./docker-start.sh up monitoring  # + Prometheus/Grafana
./docker-start.sh status         # Vérifier health
./docker-start.sh logs           # Voir logs en temps réel
```

---

### Option 3: Commandes Spécifiques

```bash
./docker-start.sh shell          # Shell dans Archon container
./docker-start.sh clean          # Nettoyage complet
./docker-start.sh build          # Rebuild images
```

---

## 📊 MONITORING

### Health Endpoints

Tous services exposent `/health`:

```bash
curl http://localhost:3737/health  # Archon UI
curl http://localhost:8181/health  # Archon API
curl http://localhost:8051/health  # Archon MCP
curl http://localhost:7777/health  # Gemini Bridge
```

---

### Logs Centralisés

```bash
./docker-start.sh logs              # Tous services
./docker-start.sh logs archon-api   # Service spécifique
./docker-start.sh logs --follow     # Mode watch
```

---

### Métriques (Optionnel)

```bash
# Activer monitoring
./docker-start.sh up monitoring

# Accès
open http://localhost:9090  # Prometheus
open http://localhost:3000  # Grafana
```

---

## 🔧 CONFIGURATION

### Variables d'Environnement

```bash
# docker-compose.yml
services:
  archon-api:
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
```

**Setup:**
```bash
cp .env.example .env
# Éditer .env avec vos clés
```

---

### Ports Mappings

| Service | Container | Host |
|---------|-----------|------|
| Archon UI | 3000 | 3737 |
| Archon API | 8000 | 8181 |
| Archon MCP | 8000 | 8051 |
| Gemini Bridge | 7777 | 7777 |
| Redis | 6379 | 6379 |

---

## 🚨 TROUBLESHOOTING

### Containers Ne Démarrent Pas

```bash
# Vérifier logs
./docker-start.sh logs

# Restart complet
./docker-start.sh clean
./docker-start.sh build
./docker-start.sh up
```

---

### Port Déjà Utilisé

```bash
# Trouver processus sur port
lsof -i :3737

# Tuer processus
kill -9 [PID]

# Ou changer port dans docker-compose.yml
```

---

**Version:** 1.0
**Date:** 2025-10-04
