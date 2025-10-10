# 🔧 Troubleshooting: MCP avec pnpm

**Date:** 2025-10-10 (mis à jour 18:00)
**Contexte:** Workflow V4 - Projet santé2
**Problème résolu:** MCP servers "No MCP servers configured" malgré fichier `.claude/mcp.json` valide
**Temps debug total:** 3-4 heures (aurait dû être 5 minutes avec la bonne méthode)

---

## ⚡ QUICK FIX (Si vous êtes pressé)

**Si `/mcp` affiche "No MCP servers configured" :**

```bash
# 1. Vérifier état actuel
claude mcp list
# Si vide → continuer

# 2. Ajouter MCP directement (CLI - SEULE MÉTHODE FIABLE)
claude mcp add context7 "pnpm" "dlx" "@upstash/context7-mcp" \
  -e "CONTEXT7_API_KEY=votre-clé" --scope user

claude mcp add eslint "pnpm" "dlx" "@eslint/mcp@latest" --scope user

# 3. Vérifier ajout
claude mcp list
# Devrait afficher: context7 ✓ Connected, eslint ✓ Connected

# 4. Redémarrer Claude Code (Cmd+Q puis relancer)

# 5. Tester
/mcp
# Devrait afficher vos MCP ✅
```

**⚠️ NE PAS éditer manuellement** `.claude/mcp.json` ou `~/.config/claude-code/mcp.json`
**Utiliser TOUJOURS** `claude mcp add` pour garantir sync avec state global.

**Temps estimé:** 2-3 minutes (vs 3-4 heures de debugging)

---

## 🐛 Symptômes

```bash
# Dans Claude Code
/mcp
→ "No MCP servers configured"

# Mais fichier existe
cat .claude/mcp.json
→ {context7, eslint, supabase} configurés ✅

# Après redémarrage multiple
→ Toujours "No MCP servers configured"
```

---

## 🔍 Root Cause (QUADRUPLE PROBLÈME)

### ⚠️ DÉCOUVERTE CRITIQUE (2025-10-10 18:00) - Problème 0

**LE VRAI PROBLÈME : Architecture State Global vs Config Files**

**Temps perdu :** 3-4 heures de debugging (Rounds 1-3) avant de découvrir la vraie cause.

#### Architecture MCP de Claude Code

Claude Code utilise **2 systèmes distincts** pour gérer les MCP :

1. **Config files** (fichiers déclaratifs)
   - `.claude/mcp.json` (projet)
   - `~/.config/claude-code/mcp.json` (global)
   - `~/.claude/mcp.json` (legacy)

2. **State global** (runtime)
   - `~/.claude.json` → Section par projet
   - **SOURCE DE VÉRITÉ ABSOLUE** au runtime

#### Le Piège Mortel

**État constaté dans `~/.claude.json` :**

```json
"/Users/manu/Documents/DEV/archon-orchestrator": {
  "mcpServers": {},  // ❌ VIDE !
  "enabledMcpjsonServers": [],
  "disabledMcpjsonServers": []
}
```

**Conséquence :**
- ✅ `.claude/mcp.json` (projet) = correct (context7 + eslint + supabase avec pnpm)
- ✅ `~/.config/claude-code/mcp.json` = correct (context7 + eslint avec pnpm)
- ❌ **State global `~/.claude.json` = VIDE** pour projet archon
- ❌ **Claude Code ignore configs files** si state global vide (bug? comportement intentionnel?)

**Résultat :** `/mcp` affiche "No MCP servers configured" même avec configs parfaites ❌

#### Solution Finale (Round 3)

**Seule commande qui a fonctionné :**

```bash
# Ajouter MCP directement dans state global (CLI)
claude mcp add context7 "pnpm" "dlx" "@upstash/context7-mcp" \
  -e "CONTEXT7_API_KEY=xxx" --scope user

claude mcp add eslint "pnpm" "dlx" "@eslint/mcp@latest" --scope user

# Vérifier ajout dans state
claude mcp list
→ context7: ✓ Connected
→ eslint: ✓ Connected
```

**Ce qui s'est passé :**
1. ✅ MCP ajoutés dans `~/.claude.json` (state global)
2. ✅ Redémarrage Claude Code → State rechargé
3. ✅ MCP maintenant disponibles dans toutes les sessions

**Modifications fichiers locaux = INUTILES** (Rounds 1-2 perdus)

#### Leçon Apprise (CRITIQUE)

**❌ NE PAS FAIRE :**
```bash
# Édition manuelle configs (peut créer désync)
vim .claude/mcp.json
vim ~/.config/claude-code/mcp.json
# → Redémarrage → ❌ Toujours "No servers configured"
```

**✅ TOUJOURS FAIRE :**
```bash
# Utiliser CLI pour modifier state global
claude mcp add <name> <command> <args...> --scope user
# OU
claude mcp add <name> <command> <args...> --scope project

# Vérifier state
claude mcp list

# Redémarrer Claude Code
# Cmd+Q puis relancer
```

#### Fichiers Modifiés vs Fichier Effectif

| Round | Fichiers Modifiés | Effet | Temps Perdu |
|-------|-------------------|-------|-------------|
| **Round 1** | `.claude/mcp.json` (3 projets) + settings.json | ❌ Aucun | 45 min |
| **Round 2** | Reset `~/.config/claude-code/mcp.json` + vider legacy | ❌ Aucun | 30 min |
| **Round 3** | `claude mcp add` → `~/.claude.json` (state) | ✅ Fonctionne | 30 min |
| **TOTAL** | 5 fichiers édités manuellement (inutiles) | **1 commande CLI suffit** | **1h45** |

#### Architecture Réelle Claude Code

```
┌─────────────────────────────────────────┐
│  Config Files (Déclaratifs)             │
│  - .claude/mcp.json (projet)            │
│  - ~/.config/claude-code/mcp.json       │
│  - ~/.claude/mcp.json (legacy)          │
│                                         │
│  ⚠️ PEUVENT ÊTRE IGNORÉS                │
│     si state global vide/corrompu       │
└─────────────────────────────────────────┘
              ↓ (merge)
┌─────────────────────────────────────────┐
│  State Global (Runtime)                 │
│  ~/.claude.json                         │
│                                         │
│  {                                      │
│    "/path/to/project": {                │
│      "mcpServers": { ... }  ← SOURCE    │
│    }                          DE VÉRITÉ │
│  }                                      │
│                                         │
│  ✅ PRIORITÉ ABSOLUE                    │
└─────────────────────────────────────────┘
```

**Best Practice :**
- ✅ Utiliser `claude mcp add/remove` (modifie state directement)
- ✅ Vérifier avec `claude mcp list` (lit state global)
- ❌ **NE PAS** éditer manuellement configs (risque désync)
- ❌ **NE PAS** utiliser `claude mcp add-from-claude-desktop` si pnpm (génère npx syntax)

---

### Problème 1: Configuration Système (pnpm alias)
User a **aliasé `npm` et `npx`** pour forcer `pnpm` :

```bash
$ which npm
npm: aliased to echo "⚠️  NPM BANNI! Utilise pnpm à la place:" && echo "pnpm $*" && pnpm

$ which npx
npx: aliased to echo "⚠️  NPX BANNI! Utilise pnpx à la place:" && pnpx
```

### Problème 2: Whitelist dans settings.json ⚠️
**CRITIQUE:** `~/.claude/settings.json` contenait une whitelist qui **bloquait eslint et supabase** :

```json
{
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["archon", "context7"]  // ❌ Manque eslint, supabase
}
```

**Impact:** Même avec fichier `mcp.json` correct, Claude Code ignorait eslint et supabase car pas dans la whitelist !

### Fichier MCP Original
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      ...
    }
  }
}
```

### Problème
- Claude Code essaie d'exécuter `npx -y @upstash/context7-mcp`
- Le shell intercepte `npx` → redirige vers `pnpx`
- `pnpx` ne supporte PAS le flag `-y` (syntaxe différente)
- Erreur : `Unknown option: 'y'`
- MCP fail to start → Claude Code affiche "No MCP servers configured"

### Problème 3: Désynchronisation Multi-Configs (2025-10-10)

**Symptôme nouveau :** `/mcp` affiche "No servers configured" même après fix Problème 1+2.

**Cause :** Plusieurs fichiers MCP se superposent, créant confusion :

```bash
# Claude Code lit PRIORITAIREMENT
~/.config/claude-code/mcp.json  # Config principale (1 serveur)

# MAIS aussi merge avec
~/.claude/mcp.json              # Config legacy (2 serveurs HTTP)

# ET les configs projet (.claude/mcp.json dans chaque projet)
```

**Impact :**
- `claude mcp list` affiche 10+ serveurs (doublons `context7`, `context7_1`, `eslint`, `eslint_1`)
- `/mcp` dans Claude Code affiche "No servers configured" (désynchronisation)
- Tests manuels `pnpm dlx` fonctionnent ✅ (serveurs OK, config KO)

**Diagnostic :**
```bash
# Tester commande directe
$ pnpm dlx @upstash/context7-mcp
→ "Context7 Documentation MCP Server running on stdio" ✅

$ pnpm dlx @eslint/mcp@latest
→ "ESLint MCP server is running" ✅

# MAIS dans Claude Code
/mcp → "No MCP servers configured" ❌
```

---

## ✅ Solution (4 Fixes Requis)

### Fix 1: Supprimer Whitelist (CRITIQUE)

**Fichier:** `~/.claude/settings.json`

**AVANT (bloque eslint + supabase) :**
```json
{
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["archon", "context7"]  // ❌ Whitelist restrictive
}
```

**APRÈS (autorise tous MCP projets) :**
```json
{
  "enableAllProjectMcpServers": true
  // ✅ Whitelist supprimée - tous MCP projets autorisés
}
```

### Fix 2: Adapter `.claude/mcp.json` pour pnpm

**AVANT (npx - ne marche PAS avec pnpm alias) :**
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "ctx7sk-xxx"
      }
    },
    "eslint": {
      "command": "npx",
      "args": ["@eslint/mcp@latest"]
    }
  }
}
```

**APRÈS (pnpm dlx - compatible pnpm) :**
```json
{
  "mcpServers": {
    "context7": {
      "command": "pnpm",
      "args": ["dlx", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "ctx7sk-xxx"
      }
    },
    "eslint": {
      "command": "pnpm",
      "args": ["dlx", "@eslint/mcp@latest"]
    },
    "supabase": {
      "type": "http",
      "url": "http://localhost:54321/mcp"
    }
  }
}
```

### Fix 3: Bonus - statusLine aussi

**Fichier:** `~/.claude/settings.json`

```json
{
  "statusLine": {
    "type": "command",
    "command": "pnpm dlx ccstatusline@latest",  // ✅ Changé de npx
    "padding": 0
  }
}
```

### Fix 4: Vérifier Syntaxe pnpm

```bash
# ❌ FAUX (npx syntax)
npx -y @upstash/context7-mcp

# ❌ FAUX (pnpx ne supporte pas -y)
pnpx -y @upstash/context7-mcp

# ✅ CORRECT (pnpm dlx)
pnpm dlx @upstash/context7-mcp

# ✅ Test
pnpm dlx @upstash/context7-mcp --help
→ Devrait afficher usage correct
```

### Fix 5: Reset Config MCP (Problème 3 - 2025-10-10)

**Si `/mcp` affiche toujours "No servers configured" après Fix 1-4 :**

#### Étape 1 : Backup configs existantes
```bash
mkdir -p ~/mcp-backup-2025-10-10
cp ~/.claude/mcp.json ~/mcp-backup-2025-10-10/claude-mcp.json.bak
cp ~/.config/claude-code/mcp.json ~/mcp-backup-2025-10-10/claude-code-mcp.json.bak
```

#### Étape 2 : Créer config propre unifiée

**Fichier :** `~/.config/claude-code/mcp.json` (config principale)

```json
{
  "mcpServers": {
    "context7": {
      "command": "pnpm",
      "args": ["dlx", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "ctx7sk-xxx"
      }
    },
    "eslint": {
      "command": "pnpm",
      "args": ["dlx", "@eslint/mcp@latest"]
    }
  }
}
```

#### Étape 3 : Vider config legacy (éviter conflits)

**Fichier :** `~/.claude/mcp.json`

```json
{
  "mcpServers": {}
}
```

#### Étape 4 : Tester manuellement avant redémarrage
```bash
# Context7
pnpm dlx @upstash/context7-mcp
→ "Context7 Documentation MCP Server running on stdio" ✅

# ESLint
pnpm dlx @eslint/mcp@latest
→ "ESLint MCP server is running" ✅
```

#### Étape 5 : Redémarrer Claude Code
```bash
# Cmd+Q puis relancer
cd ~/Documents/DEV/archon-orchestrator
claude

# Vérifier MCP
/mcp
→ Devrait afficher: context7 ✅, eslint ✅
```

---

## 🧪 Tests de Vérification

### 1. Vérifier Config Correcte

```bash
cd ~/Documents/DEV/santé2

# Vérifier fichier
cat .claude/mcp.json | grep -A2 "context7"
→ Devrait afficher "command": "pnpm", "args": ["dlx", ...]

# Vérifier fichier
cat .claude/mcp.json | grep -A2 "eslint"
→ Devrait afficher "command": "pnpm", "args": ["dlx", ...]
```

### 2. Tester MCP Binaries Manuellement

```bash
# Context7
pnpm dlx @upstash/context7-mcp --help
→ Devrait afficher options (transport, port, api-key)

# ESLint
pnpm dlx @eslint/mcp@latest --help
→ Devrait afficher usage ESLint MCP
```

### 3. Redémarrer Claude Code

```bash
# Quitter Claude Code (Cmd+Q)
# Naviguer projet
cd ~/Documents/DEV/santé2

# Relancer
claude

# Vérifier MCP
/mcp
→ Devrait afficher: context7 ✅, eslint ✅, supabase (⚠️ si Docker off)
```

---

## 📊 Status Attendu Après Fix

| MCP | Status | Notes |
|-----|--------|-------|
| **context7** | 🟢 Connected | API key valide |
| **eslint** | 🟢 Connected | Package latest |
| **supabase** | 🟡 Failed OU 🟢 Connected | Si Docker Supabase running |

---

## 🎯 Leçons Apprises

### 1. Environment Matters
- User configuration système (aliases, etc.) affecte MCP loading
- TOUJOURS vérifier syntaxe package manager utilisé
- `npx` ≠ `pnpx` ≠ `pnpm dlx` (syntaxes différentes !)

### 2. Debugging Méthodique
1. ✅ Vérifier fichier config existe
2. ✅ Vérifier fichier config JSON valide
3. ✅ Tester commande MCP manuellement dans terminal
4. ✅ Vérifier aliases/environment shell
5. ✅ Adapter config selon environment

### 3. Documentation Gaps
- MCP-SETUP-GUIDE.md mentionne `claude mcp add-from-claude-desktop`
- MAIS assume `npx` disponible (pas toujours vrai)
- **Action:** Documenter support pnpm dans guide

---

## 🔄 Actions de Suivi

### 1. Mettre à Jour MCP-SETUP-GUIDE.md

Ajouter section :

```markdown
### Utilisation avec pnpm

Si vous utilisez `pnpm` au lieu de `npm`, adaptez la configuration :

**npm/npx (défaut) :**
```json
{
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp"]
}
```

**pnpm (alternative) :**
```json
{
  "command": "pnpm",
  "args": ["dlx", "@upstash/context7-mcp"]
}
```

**Vérification :**
```bash
# Test manuel
pnpm dlx @upstash/context7-mcp --help
```
```

### 2. Ajouter Check dans setup-project.sh

```bash
# Détecter package manager
if command -v pnpm &> /dev/null; then
  PKG_MANAGER="pnpm"
  PKG_RUN="pnpm dlx"
elif command -v npm &> /dev/null; then
  PKG_MANAGER="npm"
  PKG_RUN="npx -y"
else
  echo "❌ No package manager found (npm/pnpm)"
  exit 1
fi

# Générer .claude/mcp.json avec syntaxe correcte
cat > .claude/mcp.json <<EOF
{
  "mcpServers": {
    "context7": {
      "command": "${PKG_MANAGER}",
      "args": ["${PKG_RUN##* }", "@upstash/context7-mcp"],
      ...
    }
  }
}
EOF
```

### 3. Créer Template MCP pour pnpm

Créer `.claude/mcp-template-pnpm.json` dans archon-orchestrator :

```json
{
  "mcpServers": {
    "context7": {
      "command": "pnpm",
      "args": ["dlx", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "{{CONTEXT7_API_KEY}}"
      }
    },
    "eslint": {
      "command": "pnpm",
      "args": ["dlx", "@eslint/mcp@latest"]
    },
    "supabase": {
      "type": "http",
      "url": "http://localhost:54321/mcp"
    }
  }
}
```

---

## 📊 Fichiers MCP Trouvés (5 locations)

| Fichier | Rôle | Fix Appliqué |
|---------|------|--------------|
| `~/.claude/settings.json` | Config globale | ✅ Whitelist supprimée + statusLine pnpm |
| `~/.claude/mcp.json` | MCP globaux HTTP | ⚠️ Aucun (HTTP transport OK) |
| `~/.config/claude-code/mcp.json` | Config Claude Code | ✅ npx → pnpm dlx |
| `~/DEV/santé2/.claude/mcp.json` | MCP projet | ✅ npx → pnpm dlx |
| `~/DEV/archon/.claude/mcp.json` | MCP projet | ✅ npx → pnpm dlx |

**Note:** `~/.claude/mcp.json` utilise **HTTP transport** (URLs directes), pas affecté par alias pnpm.

---

## 📝 Résumé Exécutif

**Problème :** MCP non chargés malgré config correcte
**Causes (4) :**
0. **🚨 CAUSE RACINE** : State global (`~/.claude.json`) vide → Claude Code ignore config files
1. **Whitelist** dans settings.json bloquait eslint + supabase
2. **pnpm alias** incompatible avec syntaxe npx dans mcp.json
3. **Désynchronisation multi-configs** - Plusieurs fichiers MCP superposés

**Solutions appliquées:**
1. ❌ Round 1 (45 min perdu) : Suppression whitelist + migration npx→pnpm (fichiers locaux) → **AUCUN EFFET**
2. ❌ Round 2 (30 min perdu) : Reset config + vider legacy (fichiers locaux) → **AUCUN EFFET**
3. ✅ Round 3 (30 min) : **`claude mcp add --scope user`** (CLI modifie state global) → **FONCTIONNE**

**Résultat final:** MCP chargés correctement après `claude mcp add` + redémarrage
**Temps debug:** 1h45 total (aurait dû être 5 min avec CLI dès le début)
**Impact:** Retard 3-4h sur workflow V4, documentation critique créée pour éviter répétition
**Leçon:** **TOUJOURS utiliser `claude mcp add/remove` (CLI), JAMAIS éditer manuellement configs**

---

## 🎯 Pour l'Avenir : Checklist MCP Setup

**Nouveau projet avec MCP :**

```bash
# 1. Créer projet
cd ~/Documents/DEV/clients
./setup-project.sh nouveau-client
cd nouveau-client

# 2. Ajouter MCP (CLI - PAS fichiers manuels)
claude mcp add context7 "pnpm" "dlx" "@upstash/context7-mcp" \
  -e "CONTEXT7_API_KEY=xxx" --scope project

claude mcp add eslint "pnpm" "dlx" "@eslint/mcp@latest" --scope project

# 3. Vérifier immédiatement
claude mcp list
# Devrait afficher Connected ✅

# 4. Tester dans session
claude
/mcp
# Devrait afficher vos MCP
```

**Temps setup MCP :** 2 minutes (vs 3-4 heures debugging si édition manuelle)

**⚠️ NE JAMAIS :**
- Éditer `.claude/mcp.json` manuellement
- Utiliser `claude mcp add-from-claude-desktop` (génère npx syntax)
- Copier configs entre projets sans vérifier state avec `claude mcp list`

**✅ TOUJOURS :**
- Utiliser `claude mcp add/remove` (CLI)
- Vérifier avec `claude mcp list` après chaque modif
- Tester dans session avec `/mcp` après redémarrage

---

**Version:** 2.0 (Architecture State Global découverte)
**Date:** 2025-10-10 18:00
**Status:** ✅ Résolu et documenté - Découverte architecture critique
**Temps debug total:** 3-4 heures (Rounds 1-3)
**Temps avec bonne méthode:** 5 minutes (`claude mcp add`)
**Projet test:** santé2 / archon-orchestrator
**Impact:** Documentation critique pour éviter répétition sur autres projets

*Zero-Trust Debugging: GATHER → ACTION → VERIFY → DOCUMENT → SHARE* 🔍✅📚🚀
