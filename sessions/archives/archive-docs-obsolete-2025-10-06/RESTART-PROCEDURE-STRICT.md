# ⚠️ PROCÉDURE DE REDÉMARRAGE ARCHON - INSTRUCTIONS STRICTES

**DERNIÈRE MISE À JOUR :** Octobre 2025
**DURÉE TOTALE :** 2-3 minutes
**STATUT :** VALIDÉ ET TESTÉ

---

## 🚨 AVERTISSEMENT CRITIQUE - LIRE AVANT TOUTE ACTION

### ❌ ERREURS RÉCURRENTES À NE JAMAIS RÉPÉTER

**CES ERREURS ONT ÉTÉ COMMISES PLUSIEURS FOIS. NE PAS LES REFAIRE :**

1. **Exécuter `make dev` sans `cd` explicite**
   ```bash
   # ❌ FAUX - Cette commande ÉCHOUERA
   make dev

   # ✅ CORRECT - Toujours avec cd explicite
   cd /Users/manu/Documents/DEV/archon && make dev
   ```

   **RAISON :** Le tool Bash de Claude Code **NE CONSERVE PAS** le working directory entre les commandes.

2. **Lancer plusieurs fois la même commande qui a échoué**
   ```bash
   # ❌ Si ça échoue UNE fois, ça échouera TOUJOURS
   # Ne PAS répéter 3-4 fois la même erreur
   ```

   **ACTION CORRECTE :** Si erreur → Vérifier le chemin → Corriger → Réessayer UNE fois.

3. **Oublier que les chemins doivent être ABSOLUS**
   ```bash
   # ❌ FAUX
   cd archon && make dev

   # ✅ CORRECT
   cd /Users/manu/Documents/DEV/archon && make dev
   ```

4. **Ne pas vérifier le `cwd` avant d'exécuter une commande**
   ```bash
   # ✅ TOUJOURS faire :
   pwd  # Vérifier où on est
   cd /chemin/absolu && commande  # Exécuter avec chemin absolu
   ```

---

## 📋 RÈGLES ABSOLUES - NON NÉGOCIABLES

### 🔒 RÈGLE #1 : CHEMINS ABSOLUS OBLIGATOIRES

**TOUTES les commandes DOIVENT utiliser des chemins absolus complets.**

```bash
# ✅ CORRECT
cd /Users/manu/Documents/DEV/archon && make dev

# ❌ INTERDIT
cd archon && make dev
cd ../archon && make dev
make dev  # Sans cd
```

### 🔒 RÈGLE #2 : UNE COMMANDE = UN SEUL APPEL

**Si une commande échoue, ne PAS la répéter. Analyser l'erreur d'abord.**

```bash
# ❌ FAUX - Répéter 4 fois la même erreur
make dev  # Échec
make dev  # Échec encore
make dev  # Toujours échec
make dev  # Encore échec

# ✅ CORRECT - Une fois, puis analyser
make dev  # Échec
# → STOP
# → Lire l'erreur
# → Corriger le problème
# → Réessayer UNE fois avec correction
```

### 🔒 RÈGLE #3 : VÉRIFIER AVANT D'EXÉCUTER

**Avant CHAQUE commande importante, vérifier les prérequis.**

```bash
# ✅ TOUJOURS faire :
ls -la /Users/manu/Documents/DEV/archon/Makefile  # Vérifier que le fichier existe
pwd  # Vérifier le working directory actuel
cd /Users/manu/Documents/DEV/archon && make dev  # Puis exécuter
```

### 🔒 RÈGLE #4 : COPIER-COLLER EXACT DES COMMANDES

**Ne PAS réécrire les commandes. COPIER-COLLER exactement depuis ce guide.**

---

## ✅ PROCÉDURE DE REDÉMARRAGE - COMMANDES EXACTES

### ÉTAPE 0 : Vérifications Préliminaires (OBLIGATOIRES)

```bash
# 1. Vérifier Redis
redis-cli ping
# ATTENDU : PONG

# 2. Vérifier que les projets existent
ls -la /Users/manu/Documents/DEV/archon/Makefile
ls -la /Users/manu/Documents/DEV/archon-orchestrator/

# Si un des deux échoue → ARRÊTER, le projet n'existe pas
```

### ÉTAPE 1 : Démarrage Gemini Bridge (Optionnel)

```bash
# Commande EXACTE à copier-coller :
cd /Users/manu/Documents/DEV/archon-orchestrator && node setup-gemini-bridge.js setup > /tmp/gemini-bridge.log 2>&1 &

# Attendre 5 secondes
sleep 5

# Vérifier (peut échouer si clé API invalide, c'est normal)
curl -s http://localhost:7777/health
```

**NOTE :** Si Gemini Bridge échoue, ce n'est PAS bloquant. Continuer.

### ÉTAPE 2 : Démarrage Archon Principal (CRITIQUE)

**⚠️ ATTENTION : Cette commande prend 2-3 MINUTES la première fois**

**COMMANDE EXACTE À COPIER-COLLER :**

```bash
cd /Users/manu/Documents/DEV/archon && make dev
```

**NE PAS :**
- ❌ Exécuter `make dev` sans `cd`
- ❌ Exécuter depuis un autre dossier
- ❌ Utiliser un chemin relatif
- ❌ Interrompre avant la fin du build

**COMPORTEMENT ATTENDU :**

1. **Vérification environment** (5 secondes)
   ```
   Checking environment...
   ✓ Environment configured correctly
   Checking Docker...
   ✓ Environment OK
   ```

2. **Build Docker images** (2-3 minutes)
   ```
   Starting hybrid development...
   Backend: Docker | Frontend: Local with hot reload
   #1 [internal] load build definitions
   #2 [archon-frontend] load build definition
   #3 [archon-server] load build definition
   ...
   [Installation de 233 packages système]
   [Installation dépendances Python]
   ```

3. **Démarrage conteneurs** (30 secondes)
   ```
   ✓ Container archon-server-1 Started
   ✓ Container archon-mcp-1 Started
   ✓ Container archon-agents-1 Started
   ```

4. **Démarrage frontend Vite** (10 secondes)
   ```
   VITE v5.x.x ready in 1234 ms
   ➜ Local: http://localhost:3737/
   ```

**DURÉE TOTALE ATTENDUE : 2-3 minutes**

### ÉTAPE 3 : Vérification Services (OBLIGATOIRE)

**Attendre 3 minutes, puis exécuter :**

```bash
# Vérifier TOUS les endpoints
curl -s http://localhost:3737 | head -2
curl -s http://localhost:8181/health
curl -s http://localhost:8051/mcp | head -3

# Vérifier conteneurs Docker
docker ps --filter "name=archon" | grep -v supabase
```

**RÉSULTAT ATTENDU :**

```
# localhost:3737
<!DOCTYPE html>  [HTML de l'interface React]

# localhost:8181/health
{"status":"healthy","service":"archon-backend",...}

# localhost:8051/mcp
[Réponse MCP ou erreur "text/event-stream" acceptable]

# Docker ps
archon-server-1     Up 2 minutes
archon-mcp-1        Up 2 minutes
archon-agents-1     Up 2 minutes
```

---

## 🔧 DÉPANNAGE - ERREURS COMMUNES

### Erreur : "No rule to make target `dev`"

**CAUSE :** Commande `make dev` exécutée dans le mauvais dossier.

**SOLUTION :**
```bash
# Vérifier où vous êtes
pwd

# Si pas dans /Users/manu/Documents/DEV/archon :
cd /Users/manu/Documents/DEV/archon && make dev
```

### Erreur : "docker: command not found"

**CAUSE :** Docker Desktop n'est pas lancé.

**SOLUTION :**
```bash
# Lancer Docker Desktop manuellement
open -a Docker

# Attendre 30 secondes
sleep 30

# Réessayer
cd /Users/manu/Documents/DEV/archon && make dev
```

### Erreur : Build Docker échoue

**CAUSES POSSIBLES :**
1. Manque d'espace disque
2. Docker daemon non accessible
3. Erreur réseau pendant téléchargement packages

**SOLUTION :**
```bash
# 1. Vérifier espace disque
df -h

# 2. Vérifier Docker
docker ps

# 3. Clean et rebuild
cd /Users/manu/Documents/DEV/archon
make stop
docker system prune -f
make dev
```

### Erreur : Services déjà en cours

**CAUSE :** Archon déjà lancé dans une autre session.

**SOLUTION :**
```bash
# Arrêter tous les services
cd /Users/manu/Documents/DEV/archon && make stop

# Attendre 10 secondes
sleep 10

# Relancer
cd /Users/manu/Documents/DEV/archon && make dev
```

---

## 📊 CHECKLIST DE VALIDATION

Après redémarrage, vérifier :

- [ ] Redis répond : `redis-cli ping` → PONG
- [ ] Supabase actif : `docker ps | grep supabase` → 11 conteneurs
- [ ] Archon backend actif : `curl http://localhost:8181/health` → healthy
- [ ] Archon UI accessible : `curl http://localhost:3737` → HTML
- [ ] Archon MCP actif : `curl http://localhost:8051/mcp` → Réponse
- [ ] Conteneurs Docker : `docker ps --filter "name=archon-"` → 3 conteneurs minimum

**Si TOUS les points sont cochés → ✅ Redémarrage réussi**

---

## 🎯 TEMPLATE DE COMMANDES - COPIER-COLLER DIRECT

**Pour redémarrage complet (à exécuter dans l'ordre) :**

```bash
# 1. Vérifications
redis-cli ping
ls -la /Users/manu/Documents/DEV/archon/Makefile

# 2. Gemini Bridge (optionnel)
cd /Users/manu/Documents/DEV/archon-orchestrator && node setup-gemini-bridge.js setup > /tmp/gemini-bridge.log 2>&1 &

# 3. Archon Principal (attendre 3 minutes)
cd /Users/manu/Documents/DEV/archon && make dev

# 4. Vérification (après 3 minutes)
curl -s http://localhost:3737 | head -2
curl -s http://localhost:8181/health
curl -s http://localhost:8051/mcp | head -3
docker ps --filter "name=archon" | grep -v supabase
```

**Pour arrêt propre :**

```bash
cd /Users/manu/Documents/DEV/archon && make stop
```

---

## ⏱️ DURÉES RÉELLES CONSTATÉES

| Étape | Durée Attendue | Notes |
|-------|----------------|-------|
| Vérifications | 5-10 secondes | Redis + existence projets |
| Gemini Bridge | 10-15 secondes | Peut échouer (non bloquant) |
| Docker Build | 2-3 minutes | **Première fois ou après changement** |
| Docker Up | 20-30 secondes | **Si images déjà buildées** |
| Frontend Vite | 10-15 secondes | Démarrage après backend |
| **TOTAL** | **2-4 minutes** | **Temps réel mesuré** |

### Optimisation Future (À Faire)

Pour réduire à <30 secondes :

```makefile
# Dans Makefile, remplacer :
dev: check
    @$(COMPOSE) --profile backend up -d --build  # ← --build force rebuild

# Par :
dev: check
    @$(COMPOSE) --profile backend up -d  # ← Pas de rebuild si image existe
```

**Résultat attendu :** Redémarrage 20-30s au lieu de 2-3 min.

---

## 🚨 ERREURS HISTORIQUES À NE JAMAIS RÉPÉTER

**Session du 4 Octobre 2025 - Erreurs commises :**

1. ✅ **Erreur 1 corrigée :** Exécuté `make dev` 4 fois sans `cd` explicite
   - **Temps perdu :** 5 minutes
   - **Leçon :** Toujours utiliser chemins absolus avec `cd`

2. ✅ **Erreur 2 corrigée :** Répété la même commande plusieurs fois au lieu d'analyser l'erreur
   - **Temps perdu :** 3 minutes
   - **Leçon :** Si erreur, analyser avant de réessayer

3. ✅ **Erreur 3 corrigée :** Utilisé chemins relatifs au lieu d'absolus
   - **Temps perdu :** 2 minutes
   - **Leçon :** `cwd` non persistant, toujours chemins absolus

**TOTAL TEMPS PERDU : 10 minutes sur une procédure de 3 minutes**

**POUR LES FUTURES SESSIONS CLAUDE :**

- 📖 **Lire ce document EN ENTIER avant d'agir**
- 📋 **Copier-coller les commandes exactes**
- ⏸️ **Ne PAS improviser de commandes**
- ✅ **Vérifier chaque étape avant de continuer**
- 🚫 **Ne JAMAIS répéter une commande qui a échoué sans analyser**

---

## 📚 RÉFÉRENCES

- **Guide Complet :** `RESTART-GUIDE-COMPLET.md`
- **Makefile :** `/Users/manu/Documents/DEV/archon/Makefile`
- **Docker Compose :** `/Users/manu/Documents/DEV/archon/docker-compose.yml`
- **Logs Gemini :** `/tmp/gemini-bridge.log`

---

**CRÉÉ LE :** 4 Octobre 2025
**VALIDÉ PAR :** Session pratique avec erreurs documentées
**STATUT :** PROCÉDURE STRICTE - SUIVRE À LA LETTRE
