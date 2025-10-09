# 🔌 MCP Setup Guide - Context7 + Supabase

**Version:** 1.0
**Date:** 2025-10-09
**Workflow:** V4 Multi-Device

---

## 🎯 Vue d'Ensemble

Ce guide explique comment configurer automatiquement **Context7** et **Supabase MCP servers** dans vos nouveaux projets.

### MCP Servers Inclus

| MCP | Description | Priorité | Use Case |
|-----|-------------|----------|----------|
| **Context7** | Knowledge base & patterns memory | P1 | Capture automatique patterns, best practices |
| **Supabase** | Database inspector & debugging | P1 | Query DB, debug schemas, migrations |

---

## ⚡ Quick Start (5 minutes)

### 1. Nouveau Projet avec MCP

```bash
# Créer projet avec template
cd ~/Documents/DEV/archon-orchestrator/templates
./copy-init-template.sh ~/Documents/DEV/mon-nouveau-projet smart-review

# Aller dans le projet
cd ~/Documents/DEV/mon-nouveau-projet

# Setup MCP automatique
./setup-mcp.sh
```

**Le script vous guidera interactivement pour :**
- ✅ Vérifier Claude CLI disponible
- ✅ Configurer Context7 (API key)
- ✅ Configurer Supabase (URL + keys)
- ✅ Créer `.env.mcp` avec template
- ✅ Lister MCP configurés

### 2. Vérifier MCP Actifs

```bash
# Lister MCP servers configurés
claude mcp list

# Devrait afficher :
# context7 (project scope)
# supabase (project scope)
```

### 3. Utiliser dans Claude Code

```bash
# Démarrer session Claude Code
claude

# MCP servers seront disponibles automatiquement
# Utiliser /mcp pour interagir avec eux
```

---

## 🔧 Configuration Détaillée

### Context7 Setup

**1. Obtenir API Key**

```bash
# Option A: Gratuit (limité)
# → Aller sur https://context7.ai/signup
# → Copier API key

# Option B: Export variable
export CONTEXT7_API_KEY="your_api_key_here"
```

**2. Configuration automatique**

Le script `setup-mcp.sh` exécute :

```bash
claude mcp add \
    --transport stdio \
    --scope project \
    context7 \
    npx -y @context7/mcp-server
```

**3. Utilisation**

```javascript
// Context7 capture automatiquement :
// - Patterns de code utilisés
// - Best practices appliquées
// - Solutions à des problèmes
// - Architecture decisions

// Rechercher un pattern :
// "Find authentication pattern used in previous projects"
```

---

### Supabase Setup

**1. Obtenir Credentials**

```bash
# Aller dans votre projet Supabase
# → Settings → API
# → Copier :
#   - Project URL
#   - anon/public key
#   - service_role key (optionnel, pour admin queries)
```

**2. Configuration automatique**

Le script `setup-mcp.sh` exécute :

```bash
claude mcp add \
    --transport stdio \
    --scope project \
    supabase \
    npx -y @supabase/mcp-server
```

**3. Variables requises**

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # Optionnel
```

**4. Utilisation**

```sql
-- Inspecter schéma database
-- "Show me the users table schema"

-- Exécuter queries
-- "Query all users created in the last 7 days"

-- Debug migrations
-- "Check if the latest migration ran successfully"
```

---

## 📋 Fichier .env.mcp

Le script génère automatiquement `.env.mcp` :

```bash
# MCP Configuration Environment Variables
# Copy these to your .env file or export them

# Context7 (Knowledge Base & Patterns Memory)
CONTEXT7_API_KEY=your_context7_api_key_here

# Supabase (Database Inspector & Debugging)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Pour activer :**

```bash
# Éditer avec vos vraies valeurs
vim .env.mcp

# Sourcer le fichier
source .env.mcp

# OU ajouter à .env principal
cat .env.mcp >> .env
```

---

## 🚀 Workflow Complet

### Phase 1: Setup Initial (5 min)

```bash
# 1. Créer projet
./copy-init-template.sh ~/mon-projet smart-review

# 2. Aller dans projet
cd ~/mon-projet

# 3. Setup MCP
./setup-mcp.sh
# → Enter Context7 API key
# → Enter Supabase credentials
# → Créer .env.mcp

# 4. Source environment
source .env.mcp
```

### Phase 2: Développement (ongoing)

```bash
# Démarrer Claude Code
claude

# MCP disponibles automatiquement
# Context7 : patterns et knowledge
# Supabase : database queries et debugging
```

### Phase 3: Nouveaux Projets (2 min)

```bash
# Copier setup-mcp.sh existant
cp ~/projet-precedent/setup-mcp.sh ~/nouveau-projet/

# Ou re-run template
./copy-init-template.sh ~/nouveau-projet smart-review

# Setup rapide (credentials déjà en env)
cd ~/nouveau-projet
./setup-mcp.sh
```

---

## 🔍 Commandes Utiles

### Gestion MCP

```bash
# Lister tous les MCP
claude mcp list

# Ajouter MCP manuellement
claude mcp add --transport stdio --scope project <name> <command>

# Supprimer MCP
claude mcp remove <name>

# Reset choix projet
claude mcp reset-project-choices

# Ajouter depuis Claude Desktop config
claude mcp add-from-claude-desktop --scope project
```

### Debug MCP

```bash
# Vérifier si MCP server fonctionne
npx -y @context7/mcp-server --help
npx -y @supabase/mcp-server --help

# Logs Claude Code (si problème)
cat ~/.config/claude/logs/claude-code.log | tail -50
```

---

## ❌ Troubleshooting

### Problème : "Claude CLI not found"

**Solution :**

```bash
# Installer Claude CLI
npm install -g @anthropic-ai/claude-cli

# Vérifier installation
claude --version
```

---

### Problème : "Context7 MCP not responding"

**Causes possibles :**
- ❌ API key invalide ou expirée
- ❌ `CONTEXT7_API_KEY` pas exportée

**Solution :**

```bash
# Vérifier variable
echo $CONTEXT7_API_KEY

# Re-exporter
export CONTEXT7_API_KEY="your_valid_key"

# Re-configurer MCP
claude mcp remove context7
./setup-mcp.sh
```

---

### Problème : "Supabase connection failed"

**Causes possibles :**
- ❌ URL ou keys incorrectes
- ❌ Projet Supabase suspendu
- ❌ Firewall bloque connexion

**Solution :**

```bash
# Vérifier credentials
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# Tester connexion directe
curl -X GET "$SUPABASE_URL/rest/v1/" \
  -H "apikey: $SUPABASE_ANON_KEY"

# Si échoue : vérifier Supabase Dashboard
# → Project → Settings → API → Verify keys
```

---

### Problème : "MCP not showing in Claude Code"

**Solution :**

```bash
# 1. Vérifier scope (doit être "project")
claude mcp list

# 2. Redémarrer Claude Code session
# → Quit session (Ctrl+D)
# → Restart : claude

# 3. Reset project choices
claude mcp reset-project-choices
```

---

## 📊 Métriques & ROI

### Temps Gagné

| Tâche | Sans MCP | Avec MCP | Gain |
|-------|----------|----------|------|
| **Recherche pattern** | 10-15 min | 30 sec | -95% |
| **Debug DB query** | 5-10 min | 1-2 min | -80% |
| **Setup nouveau projet** | 10-15 min | 2 min | -87% |

### Use Cases Context7

- ✅ "Find authentication pattern used in ReviewRescue"
- ✅ "Show me how we handled file uploads before"
- ✅ "What's our standard error handling pattern?"
- ✅ "How did we structure the API routes in previous projects?"

### Use Cases Supabase

- ✅ "Show users table schema"
- ✅ "Query users created last 7 days"
- ✅ "Check if migration 003 ran successfully"
- ✅ "Explain the relationship between users and subscriptions tables"

---

## 🔐 Sécurité

### Best Practices

1. **Ne JAMAIS commit `.env.mcp`**
   ```bash
   # Ajouter à .gitignore
   echo ".env.mcp" >> .gitignore
   ```

2. **Utiliser service_role key seulement si nécessaire**
   - `anon_key` suffit pour la plupart des use cases
   - `service_role_key` = accès admin complet (danger)

3. **Rotate keys régulièrement**
   - Context7 : tous les 3-6 mois
   - Supabase : si compromis détecté

4. **Scope project, pas global**
   ```bash
   # ✅ Bon : scope project (isolé par projet)
   claude mcp add --scope project ...

   # ❌ Éviter : scope global (affecte tous projets)
   claude mcp add --scope global ...
   ```

---

## 🚀 Évolution Future

### Roadmap MCP (Court Terme)

**À considérer plus tard (pas prioritaire maintenant) :**

1. **Linear MCP** (P2)
   - Tracking tasks & roadmap
   - Sync tasks.md → Linear issues
   - Métriques velocity

2. **GitHub MCP** (P2)
   - Déjà géré par GitHub Actions
   - Utile si queries complexes nécessaires

3. **Perplexity MCP** (P3)
   - Recherche contexte best practices
   - Complémentaire à Context7

**Décision :** Focus Context7 + Supabase pour l'instant (10× value, 1× complexity)

---

## 📚 Références

### Documentation Officielle

- **Claude MCP:** https://docs.claude.com/en/docs/claude-code/mcp
- **Context7:** https://context7.ai/docs
- **Supabase MCP:** https://supabase.com/docs/guides/ai/integrations/claude

### Templates

- **mcp-template.json** : `/templates/mcp-template.json`
- **setup-mcp.sh** : `/templates/setup-mcp.sh`
- **copy-init-template.sh** : `/templates/copy-init-template.sh`

### Workflow V4

- **WORKFLOW-FINAL-V4-MULTI-DEVICE.md** : Source de vérité workflow
- **START-HERE.md** : Point d'entrée unique
- **INDEX-FILES-V4.md** : Navigation complète

---

## ✅ Checklist Setup Nouveau Projet

```bash
# Phase 1 : Création projet (2 min)
[ ] Créer projet avec template : ./copy-init-template.sh
[ ] Aller dans dossier projet : cd ~/mon-projet

# Phase 2 : Setup MCP (3 min)
[ ] Exécuter setup : ./setup-mcp.sh
[ ] Enter Context7 API key (ou skip si déjà en env)
[ ] Enter Supabase credentials (ou skip si déjà en env)
[ ] Éditer .env.mcp avec vraies valeurs
[ ] Source environment : source .env.mcp

# Phase 3 : Vérification (1 min)
[ ] Lister MCP : claude mcp list
[ ] Vérifier context7 présent
[ ] Vérifier supabase présent
[ ] Démarrer session : claude

# Phase 4 : Test (optionnel - 2 min)
[ ] Test Context7 : "Find pattern authentication"
[ ] Test Supabase : "Show users table schema"
```

---

**Version:** 1.0
**Date:** 2025-10-09
**Status:** ✅ Production Ready

*MCP Setup automatique en 5 minutes - Context7 + Supabase* 🔌🚀
