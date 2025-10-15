# 🔌 Script: add-mcp-to-cli.sh

**Version:** 1.0
**Date:** 2025-10-14
**Auteur:** Archon Orchestrator Team

---

## 🎯 Objectif

Helper script pour ajouter un MCP server dans `~/.claude.json` (Claude Code CLI Global).

**Problème résolu:**
- MCP configuré dans Claude Desktop mais absent de Claude Code CLI
- Configuration manuelle répétitive et error-prone
- Oubli du backup avant édition
- Risque de corruption JSON

---

## 🚀 Usage

```bash
cd /Users/manu/Documents/DEV/archon-orchestrator/scripts
./add-mcp-to-cli.sh <mcp-name> <command> [args...]
```

### Exemples

**Ajouter basic-memory:**
```bash
./add-mcp-to-cli.sh basicmemory "/Users/manu/.pyenv/shims/uvx" "basic-memory" "mcp" "--project" "main"
```

**Ajouter un MCP custom:**
```bash
./add-mcp-to-cli.sh myserver "/usr/local/bin/myserver" "start" "--port" "8080"
```

---

## 📋 Ce que fait le script

1. **Validation:**
   - Vérifie que la commande existe (warning si chemin incorrect)
   - Affiche astuce `which <command>` pour trouver chemin absolu

2. **Backup automatique:**
   - Crée backup dans `~/.claude-backups/`
   - Format: `claude.json.YYYYMMDD_HHMMSS`
   - Permet restauration facile si corruption JSON

3. **Détection sections:**
   - Trouve toutes les sections `mcpServers` dans `~/.claude.json`
   - Affiche numéros de lignes pour édition manuelle

4. **Génération config:**
   - Construit JSON formaté du MCP
   - Affiche preview avant édition

5. **Assistance édition:**
   - Propose d'ouvrir `nano` directement
   - Donne instructions étape par étape
   - Valide JSON après édition

6. **Validation post-édition:**
   - Test syntaxe JSON avec `python3 -m json.tool`
   - Instructions de restauration si erreur

---

## ⚠️ Limitations

**Édition manuelle recommandée:**
- Script NE modifie PAS `~/.claude.json` automatiquement
- Raison: Structure JSON complexe (multi-sections, par répertoire)
- Risque corruption si édition automatique mal faite

**Le script fournit:**
- ✅ Backup automatique
- ✅ Config JSON pré-formatée (copier/coller)
- ✅ Instructions claires
- ✅ Validation JSON
- ❌ NE fait PAS l'édition automatique (trop risqué)

---

## 🛟 Restaurer Backup

Si erreur JSON après édition:

```bash
# Lister backups disponibles
ls -lt ~/.claude-backups/

# Restaurer backup (remplacer TIMESTAMP)
cp ~/.claude-backups/claude.json.YYYYMMDD_HHMMSS ~/.claude.json

# Valider JSON
python3 -m json.tool ~/.claude.json > /dev/null && echo '✅ JSON valide' || echo '❌ JSON invalide'
```

---

## 📚 Contexte

**Découverte 2025-10-14:** Architecture MCP à 3 niveaux

```
NIVEAU 1: Claude Desktop App
└─ ~/Library/Application Support/Claude/claude_desktop_config.json

NIVEAU 2: Claude Code CLI Global ⚠️ CRITIQUE
└─ ~/.claude.json (organisé par répertoire)

NIVEAU 3: Projet Local (optionnel)
└─ /path/to/project/.claude/mcp.json
```

**Problème résolu:**
- MCP configuré dans Niveau 1 (Desktop) mais ABSENT de Niveau 2 (CLI)
- `claude mcp add-from-claude-desktop` crée seulement Niveau 3 (pas Niveau 2)
- Solution: Éditer `~/.claude.json` manuellement avec assistance de ce script

**Cas d'usage réel:**
- basic-memory troubleshooting (2025-10-14)
- Serena MCP setup (référence historique ChatGPT)

---

## 🔗 Références

- **MCP Setup Guide:** `../docs/MCP-SETUP-GUIDE.md` (Section Troubleshooting v2.1)
- **Architecture 3 Niveaux:** Voir guide section "MCP server configuré dans Claude Desktop mais absent du projet"
- **Workflow V4:** `../docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md`

---

## ✅ Checklist Post-Ajout

Après avoir ajouté MCP avec le script:

```bash
# 1. Valider JSON
python3 -m json.tool ~/.claude.json > /dev/null
# → Doit afficher rien (succès) ou erreur ligne X

# 2. Exit Claude Code
# Ctrl+D dans session Claude Code active

# 3. Relancer Claude Code
claude

# 4. Vérifier MCP disponible
ListMcpResourcesTool()
# → Doit inclure le nouveau MCP

# 5. Vérifier processus actif
ps aux | grep <mcp-name>
# → Doit montrer processus en cours

# 6. Test MCP
ListMcpResourcesTool(server="<mcp-name>")
# → Doit retourner resources (pas "Server not found")
```

---

## 🎓 Pourquoi Pas d'Édition Automatique ?

**Raisons:**

1. **Structure complexe par répertoire:**
   ```json
   {
     "/Users/manu": { "mcpServers": { ... } },
     "/Users/manu/dev/serena": { "mcpServers": { ... } },
     "/Users/manu/Documents/DEV": { "mcpServers": { ... } }
   }
   ```
   Détection contexte difficile (quel répertoire modifier ?)

2. **Risque corruption JSON:**
   - Ajout virgule manquante/en trop
   - Mauvais indentation
   - Nesting incorrect

3. **Backup critique:**
   - `~/.claude.json` = 1.3 MB (historique conversations)
   - Perte données si corruption sans backup

4. **Édition manuelle = sûr:**
   - Utilisateur voit ce qu'il fait
   - Peut vérifier syntaxe visuellement
   - Validation JSON immédiate

**Trade-off accepté:**
- 2 min édition manuelle assistée (safe)
- vs risque corruption fichier critique (unsafe)

---

**Version:** 1.0
**Status:** ✅ Production Ready (Assistance uniquement, pas édition auto)

*Helper script pour MCP CLI Global - Backup + Instructions + Validation* 🔌🛠️✅
