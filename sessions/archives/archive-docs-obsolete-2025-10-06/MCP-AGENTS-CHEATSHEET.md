# 🚀 MCP & Agents - Cheatsheet

**Guide rapide pour configurer MCP et Agents dans NOUVEAUX projets Claude Code**

---

## ⚠️ RÈGLES CRITIQUES

```
❌ .claude/mcp.json          → MAUVAIS EMPLACEMENT
✅ .mcp.json                 → BON (racine projet)

❌ Écrire JSON manuellement  → NE FONCTIONNE PAS
✅ CLI claude mcp add        → OBLIGATOIRE

❌ Agent sans YAML           → NON RECONNU
✅ Agent avec frontmatter    → RECONNU

❌ Pas de restart            → CHANGEMENTS IGNORÉS
✅ Restart Claude Code       → CHANGEMENTS APPLIQUÉS
```

---

## ⚡ COMMANDES RAPIDES

### Configuration MCP

```bash
# Aller dans projet
cd /path/to/project

# Ajouter MCP Archon (local)
claude mcp add --scope project --transport http \
  archon http://localhost:8051/mcp

# Ajouter MCP Context7 (externe)
claude mcp add --scope project --transport http \
  context7 https://mcp.context7.com/mcp \
  -e CONTEXT7_API_KEY=your_key_here

# Lister MCP + health check
claude mcp list

# Résultat attendu :
# archon: http://localhost:8051/mcp (HTTP) - ✗ Failed (ok si serveur pas lancé)
# context7: https://mcp.context7.com/mcp (HTTP) - ✓ Connected
```

### Édition Manuelle (API Key)

```bash
# Éditer .mcp.json pour ajouter env variables
nano .mcp.json

# Ajouter section env :
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp",
      "env": {
        "CONTEXT7_API_KEY": "ctx7sk-xxxxx"
      }
    }
  }
}
```

### Configuration Agents

```bash
# Créer dossier agents
mkdir -p .claude/agents

# Template agent
cat > .claude/agents/nom-agent.md << 'EOF'
---
name: nom-agent
description: Expert en [domaine]. Use for [tasks].
tools: Read, Write, Edit, Bash, Glob, Grep
---

# Agent Name

## Role
Vous êtes expert en...

## Responsibilities
- Tâche 1
- Tâche 2

## Task Assignment
Tasks T001-T010
EOF

# Vérifier format
head -10 .claude/agents/nom-agent.md
```

---

## 🔄 ACTIVATION

```bash
# 1. Vérifier config
claude mcp list
ls -la .claude/agents/

# 2. REDÉMARRER Claude Code
# Option A : Quit + Relaunch (Cmd+Q)
# Option B : Reload Window (Cmd+Shift+P → "Reload Window")

# 3. Tester dans Claude Code :
# "Liste outils MCP disponibles"
# "@nom-agent"
```

---

## 📂 STRUCTURE FINALE

```
projet/
├── .mcp.json                ← RACINE (pas .claude/)
├── .claude/
│   └── agents/
│       ├── agent1.md        ← Avec YAML frontmatter
│       └── agent2.md
└── [reste projet]
```

---

## 🔧 DÉPANNAGE EXPRESS

### "No MCP servers configured"
```bash
claude mcp list  # Vérifier
cd /path/to/project
claude mcp add --scope project --transport http nom url
```

### Agents non reconnus
```bash
# Vérifier YAML frontmatter
head -5 .claude/agents/agent.md
# Doit commencer par ---

# Redémarrer Claude Code
```

### MCP "Failed to connect"
```bash
# Pour locaux (Archon)
cd archon-orchestrator && make dev
lsof -i :8051

# Pour externes (Context7)
curl https://mcp.context7.com/mcp
cat .mcp.json | grep API_KEY
```

---

## 📚 EXEMPLES RÉELS

### Archon-Native (Projet Validé)

Voir : `/Users/manu/Documents/DEV/archon-native/`

**Fichiers :**
- `SETUP-MCP-AGENTS.md` - Guide complet
- `.claude/QUICK-SETUP.md` - Setup 2 min
- `README.md` - Documentation

**MCP configurés :**
- Archon : `http://localhost:8051/mcp`
- Context7 : `https://mcp.context7.com/mcp` ✓

**Agents créés :**
- orchestrator-specialist (T029-T035)
- github-specialist (T036-T046)
- quality-specialist (T047-T049)
- scripts-specialist (T050-T054)
- hooks-specialist (T055-T058)

---

## 🎯 CHECKLIST

Setup nouveau projet :

- [ ] `.mcp.json` à la racine
- [ ] `claude mcp add` exécuté
- [ ] `claude mcp list` OK
- [ ] Agents dans `.claude/agents/`
- [ ] YAML frontmatter vérifié
- [ ] Claude Code redémarré
- [ ] Tests : "Liste MCP" et "@agent"

---

**Dernière mise à jour :** Octobre 2025
**Testé sur :** archon-native projet
**Référence :** SETUP-MCP-AGENTS.md dans archon-native
