# 🏗️ Architecture MCP à 3 Niveaux

**Version:** 1.0
**Date:** 2025-10-14
**Découverte:** Troubleshooting basic-memory + Serena
**Impact:** Critique - Explique pourquoi MCP "disparaissent" entre Desktop et CLI

---

## 🎯 Diagramme Simplifié

```
┌─────────────────────────────────────────────────────────────┐
│ NIVEAU 1: Claude Desktop App (Interface Graphique)         │
│                                                             │
│ Fichier: ~/Library/Application Support/Claude/             │
│          claude_desktop_config.json                         │
│                                                             │
│ Utilisé par: Claude Desktop application (Cmd+Space "Claude")│
│                                                             │
│ Configuration:                                              │
│   - Settings → MCP → Add Server                            │
│   - Interface graphique user-friendly                      │
│   - JSON global pour l'app Desktop                         │
│                                                             │
│ Exemple:                                                    │
│   {                                                         │
│     "mcpServers": {                                         │
│       "basicmemory": {                                      │
│         "command": "/Users/manu/.pyenv/shims/uvx",         │
│         "args": ["basic-memory", "mcp", "--project", "main"]│
│       }                                                     │
│     }                                                       │
│   }                                                         │
└─────────────────────────────────────────────────────────────┘
                         ↓
                    SÉPARÉ DE
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ NIVEAU 2: Claude Code CLI Global ⚠️ CRITIQUE               │
│                                                             │
│ Fichier: ~/.claude.json                                    │
│                                                             │
│ Utilisé par: Claude Code CLI (commande 'claude' terminal)  │
│                                                             │
│ Configuration:                                              │
│   - Édition manuelle OBLIGATOIRE                           │
│   - Organisé PAR RÉPERTOIRE (pas global flat)             │
│   - Format JSON complexe (nested par path)                 │
│                                                             │
│ Structure:                                                  │
│   {                                                         │
│     "/Users/manu": {                                        │
│       "mcpServers": {                                       │
│         "basicmemory": { ... }                              │
│       }                                                     │
│     },                                                      │
│     "/Users/manu/dev/serena": {                             │
│       "mcpServers": {                                       │
│         "serena": { ... },                                  │
│         "basicmemory": { ... }  ← Répéter ici aussi !      │
│       }                                                     │
│     }                                                       │
│   }                                                         │
│                                                             │
│ ⚠️ PIÈGE: Si MCP absent ici → CLI ne le voit pas          │
└─────────────────────────────────────────────────────────────┘
                         ↓
                 peut hériter de
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ NIVEAU 3: Projet Local (Optionnel)                         │
│                                                             │
│ Fichier: /path/to/project/.claude/mcp.json                 │
│                                                             │
│ Utilisé par: Claude Code CLI (surcharge niveau 2)          │
│                                                             │
│ Configuration:                                              │
│   - Créé via: claude mcp add-from-claude-desktop           │
│   - Scope projet seulement                                 │
│   - Surcharge config globale si défini                     │
│                                                             │
│ Exemple:                                                    │
│   {                                                         │
│     "mcpServers": {                                         │
│       "basicmemory": {                                      │
│         "command": "/Users/manu/.pyenv/shims/uvx",         │
│         "args": ["basic-memory", "mcp", "--project", "main"]│
│       }                                                     │
│     }                                                       │
│   }                                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚨 Problème Typique

### Symptôme

```bash
# Dans Claude Desktop app:
Settings → MCP → "basicmemory" ✅ Connected

# Dans Claude Code CLI:
claude
> ListMcpResourcesTool()
# → basicmemory ABSENT de la liste ❌

# Redémarrage Claude Desktop (3×):
# → Toujours ABSENT ❌
```

### Cause Racine

**Desktop config ≠ CLI config** → **Fichiers DIFFÉRENTS !**

```
claude_desktop_config.json  ← Niveau 1 (Desktop app) ✅ basicmemory présent
                ≠
~/.claude.json              ← Niveau 2 (CLI) ❌ basicmemory ABSENT
```

### Solution

**Éditer `~/.claude.json` manuellement:**

```bash
# 1. Trouver sections mcpServers
grep -n '"mcpServers"' ~/.claude.json

# 2. Éditer fichier (backup automatique recommandé)
nano ~/.claude.json

# 3. Ajouter MCP dans CHAQUE section voulue
{
  "/Users/manu": {
    "mcpServers": {
      "existing": { ... },
      "basicmemory": {  ← Ajouter ici
        "type": "stdio",
        "command": "/Users/manu/.pyenv/shims/uvx",
        "args": ["basic-memory", "mcp", "--project", "main"],
        "env": {}
      }
    }
  }
}

# 4. Sauvegarder, exit CLI (Ctrl+D), relancer
claude
```

---

## 📊 Tableau Comparatif

| Critère | Niveau 1 (Desktop) | Niveau 2 (CLI Global) | Niveau 3 (Projet) |
|---------|--------------------|-----------------------|-------------------|
| **Fichier** | `claude_desktop_config.json` | `~/.claude.json` | `.claude/mcp.json` |
| **Localisation** | `~/Library/Application Support/Claude/` | `~/` | `/path/to/project/.claude/` |
| **Utilisé par** | Claude Desktop app | Claude Code CLI | Claude Code CLI (surcharge) |
| **Config UI** | Settings → MCP | ❌ Édition manuelle | CLI command |
| **Scope** | Global Desktop | Global CLI (par répertoire) | Projet local |
| **Format** | JSON flat | JSON nested (par path) | JSON flat |
| **Commande création** | Interface graphique | Édition manuelle | `claude mcp add-from-claude-desktop` |
| **Sync auto** | ❌ Non | ❌ Non | ⚠️ Partiel (import Desktop) |
| **Priorité** | Niveau 1 | Niveau 2 | Niveau 3 (surcharge) |

---

## 🔍 Cas d'Usage Réels

### Cas 1: basic-memory (2025-10-14)

**Situation:**
- ✅ Configuré dans Desktop (`claude_desktop_config.json`)
- ❌ Absent de CLI (`~/.claude.json`)
- ❌ 3 redémarrages Desktop sans effet

**Solution:**
- Édition manuelle `~/.claude.json`
- Ajout dans 2 sections: `/Users/manu` + `/Users/manu/dev/serena`
- Exit CLI + Relance → ✅ Fonctionne

### Cas 2: Serena (Référence historique ChatGPT)

**Situation:**
- ✅ Processus Serena actif (`ps aux | grep serena`)
- ❌ `/mcp serena` failed dans Claude Code CLI

**Solution:**
- Ajout `--directory /Users/manu/dev/serena` dans `~/.claude.json`
- Correction paramètre `--project` (de `/Users/manu` vers `serena`)
- Restart → ✅ Fonctionne

**Leçon:**
- Desktop config ≠ CLI config (discovery initiale)
- Confirmé par troubleshooting basic-memory

---

## 🎓 Règles d'Or

### 1. Desktop ≠ CLI (Toujours)

```
claude_desktop_config.json ≠ ~/.claude.json
```

**Ne JAMAIS assumer** qu'un MCP configuré dans Desktop est automatiquement disponible dans CLI.

### 2. CLI Organisé Par Répertoire

```json
{
  "/Users/manu": { "mcpServers": { ... } },
  "/Users/manu/dev/project": { "mcpServers": { ... } }
}
```

**Ajouter MCP dans CHAQUE section** où il doit être disponible.

### 3. Chemins Absolus Obligatoires

```json
✅ "command": "/Users/manu/.pyenv/shims/uvx"
❌ "command": "uvx"
```

Trouver chemin absolu: `which uvx`

### 4. Validation Post-Édition

```bash
# Test syntaxe JSON
python3 -m json.tool ~/.claude.json > /dev/null

# Vérifier processus MCP actif
ps aux | grep <mcp-name>

# Test dans CLI
ListMcpResourcesTool(server="<mcp-name>")
```

### 5. Backup Avant Édition

```bash
# Backup manuel
cp ~/.claude.json ~/.claude.json.backup-$(date +%Y%m%d_%H%M%S)

# Ou utiliser script helper
./scripts/add-mcp-to-cli.sh  # Backup automatique
```

---

## 🛠️ Outils & Scripts

### Script Helper: `add-mcp-to-cli.sh`

```bash
cd /Users/manu/Documents/DEV/archon-orchestrator/scripts
./add-mcp-to-cli.sh basicmemory "/Users/manu/.pyenv/shims/uvx" "basic-memory" "mcp" "--project" "main"
```

**Fonctionnalités:**
- ✅ Backup automatique `~/.claude-backups/`
- ✅ Validation commande (`which`)
- ✅ Génération config JSON formatée
- ✅ Assistance édition manuelle
- ✅ Validation JSON post-édition
- ✅ Instructions restauration si erreur

**Documentation:** `scripts/README-add-mcp-to-cli.md`

---

## 📚 Références

- **MCP Setup Guide:** `MCP-SETUP-GUIDE.md` (v2.1 - Section Troubleshooting)
- **Script Helper:** `../scripts/add-mcp-to-cli.sh`
- **Workflow V4:** `WORKFLOW-FINAL-V4-MULTI-DEVICE.md`
- **Troubleshooting:** `TROUBLESHOOTING.md`

---

## ✅ Checklist Diagnostic

Si MCP configuré Desktop mais absent CLI:

```bash
# 1. Vérifier Desktop config
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | grep -A 5 <mcp-name>

# 2. Vérifier CLI global config
cat ~/.claude.json | grep -A 8 <mcp-name>

# 3. Vérifier projet local config (optionnel)
cat .claude/mcp.json | grep -A 5 <mcp-name>

# 4. Si absent de niveau 2:
# → Éditer ~/.claude.json manuellement
# → Ajouter dans section(s) voulue(s)
# → Backup avant édition !

# 5. Validation post-fix
python3 -m json.tool ~/.claude.json > /dev/null
claude  # Relancer CLI
ListMcpResourcesTool()  # Vérifier présence
ps aux | grep <mcp-name>  # Vérifier processus actif
```

---

**Version:** 1.0
**Date:** 2025-10-14
**Status:** ✅ Documenté & Validé

**Découverte Critique:** 3 niveaux config (pas 2 !) - Desktop / CLI Global / Projet Local

*Architecture MCP complète - Troubleshooting Guide* 🏗️🔌✅
