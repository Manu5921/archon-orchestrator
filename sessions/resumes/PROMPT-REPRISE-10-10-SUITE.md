# 📋 PROMPT REPRISE SESSION - 10/10/2025 (SUITE)

**Date:** 2025-10-10
**Session:** MCP Debugging + Configuration pnpm
**Context:** Projet santé2 - Workflow V4 test

---

## 🐛 PROBLÈME RÉSOLU : MCP "No servers configured"

### Symptômes
```bash
# Dans Claude Code (projet santé2)
/mcp
→ "No MCP servers configured"

# Mais fichier existe et est valide
cat .claude/mcp.json
→ {context7, eslint, supabase} ✅
```

---

## 🔍 ROOT CAUSE IDENTIFIÉE (DOUBLE PROBLÈME)

### Problème 1: Whitelist Restrictive ⚠️
**Fichier:** `~/.claude/settings.json`

```json
{
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["archon", "context7"]  // ❌ Bloquait eslint + supabase
}
```

**Impact:** Claude Code ignorait `eslint` et `supabase` car pas dans la whitelist !

---

### Problème 2: Alias pnpm Incompatible
**Configuration système:**
```bash
npm  → aliased to pnpm
npx  → aliased to pnpx
```

**Fichiers MCP utilisaient:**
```json
{
  "command": "npx",
  "args": ["-y", "@upstash/context7-mcp"]  // ❌ Syntaxe npm, incompatible pnpm
}
```

**Erreur résultante:**
```
ERROR Unknown option: 'y'
For help, run: pnpm help dlx
```

---

## ✅ SOLUTIONS APPLIQUÉES (5 fichiers modifiés)

### 1. ~/.claude/settings.json - CRITIQUE

**Fix A: Suppression Whitelist**
```diff
{
  "enableAllProjectMcpServers": true,
- "enabledMcpjsonServers": ["archon", "context7"],
+ // ✅ Whitelist supprimée - tous MCP projets autorisés
```

**Fix B: statusLine pnpm**
```diff
  "statusLine": {
    "type": "command",
-   "command": "npx -y ccstatusline@latest",
+   "command": "pnpm dlx ccstatusline@latest",
    "padding": 0
  }
```

---

### 2. ~/.config/claude-code/mcp.json

```diff
{
  "mcpServers": {
    "context7": {
-     "command": "npx",
-     "args": ["-y", "@upstash/context7-mcp", "--api-key", "..."]
+     "command": "pnpm",
+     "args": ["dlx", "@upstash/context7-mcp", "--api-key", "..."]
    }
  }
}
```

---

### 3. ~/Documents/DEV/santé2/.claude/mcp.json

```diff
{
  "mcpServers": {
    "context7": {
-     "command": "npx",
-     "args": ["-y", "@upstash/context7-mcp"],
+     "command": "pnpm",
+     "args": ["dlx", "@upstash/context7-mcp"],
      "env": { "CONTEXT7_API_KEY": "..." }
    },
    "eslint": {
-     "command": "npx",
-     "args": ["@eslint/mcp@latest"]
+     "command": "pnpm",
+     "args": ["dlx", "@eslint/mcp@latest"]
    },
    "supabase": {
      "type": "http",
      "url": "http://localhost:54321/mcp"
    }
  }
}
```

---

### 4. ~/Documents/DEV/archon-orchestrator/.claude/mcp.json

**Même changements:** `npx` → `pnpm dlx` (context7, eslint)

---

### 5. ~/.claude/mcp.json (HTTP transport)

**Aucun changement nécessaire** ✅
- Utilise HTTP transport (URLs directes)
- Pas affecté par alias pnpm

---

## 📊 Résumé Fichiers MCP

| Fichier | Rôle | Fix Appliqué |
|---------|------|--------------|
| `~/.claude/settings.json` | Config globale | ✅ Whitelist supprimée + statusLine pnpm |
| `~/.claude/mcp.json` | MCP globaux HTTP | ⚠️ Aucun (HTTP transport OK) |
| `~/.config/claude-code/mcp.json` | Config Claude Code | ✅ npx → pnpm dlx |
| `santé2/.claude/mcp.json` | MCP projet | ✅ npx → pnpm dlx |
| `archon/.claude/mcp.json` | MCP projet | ✅ npx → pnpm dlx |

---

## 📚 Documentation Créée

**Nouveau fichier:** `docs/TROUBLESHOOTING-MCP-PNPM.md` (370+ lignes)

**Contenu:**
- ✅ Symptômes détaillés
- ✅ Root cause (double problème)
- ✅ Solutions avec AVANT/APRÈS
- ✅ Tests de vérification
- ✅ Leçons apprises (environment matters!)
- ✅ Actions de suivi

---

## 🧪 VÉRIFICATION REQUISE (Après Redémarrage)

### Commandes de Test

```bash
# 1. Redémarrer Claude Code
# Cmd+Q puis relancer

# 2. Naviguer projet
cd ~/Documents/DEV/santé2

# 3. Lancer Claude Code
claude

# 4. Vérifier MCP
/mcp
```

### Status Attendu

| MCP | Status | Notes |
|-----|--------|-------|
| **context7** | 🟢 Connected | API key valide + whitelist supprimée |
| **eslint** | 🟢 Connected | Whitelist supprimée + pnpm syntax |
| **supabase** | 🟡 Failed OU 🟢 Connected | Si Docker Supabase running |

---

## 🎯 PROCHAINE ÉTAPE (Après Vérification MCP)

### Si MCP ✅ Connected

```bash
# Lancer Spec-Kit workflow
/speckit.specify  # → specs/001-mvp/spec.md (5 min)
/speckit.plan     # → specs/001-mvp/plan.md (10 min)
/speckit.tasks    # → specs/001-mvp/tasks.md (10 min, 50-100 tasks)

# Tester agents
"@ui-designer implement T002"
"@backend-developer implement T003-T010"
"@frontend-developer implement T011-T030"
```

### Si MCP ❌ Still Not Working

**Actions debug:**
1. Vérifier logs Claude Code
2. Tester commande manuelle: `pnpm dlx @upstash/context7-mcp --help`
3. Vérifier fichiers modifiés (cat commands)
4. Poster dans #claude-code-support (GitHub Discussions)

---

## 💡 LEÇONS APPRISES

### 1. Whitelist Settings > Project MCP
- `enabledMcpjsonServers` dans settings.json = whitelist globale
- Bloque MCP projet même si correctement configurés
- **Action:** Toujours vérifier settings.json en premier

### 2. Environment Configuration Matters
- Alias shell (npm→pnpm) affectent MCP loading
- Claude Code exécute commandes dans user shell
- **Action:** Adapter config MCP selon environment

### 3. Multiple Config Locations
- 5 fichiers MCP trouvés (global + projets)
- Cohérence requise entre tous fichiers
- **Action:** Documenter locations + maintenir cohérence

### 4. Diagnostic Méthodique = Efficace
- GATHER: Lire fichiers config + tester manuellement
- ACTION: Appliquer fixes un par un
- VERIFY: Tester après chaque fix
- **Temps:** 45 min (vs heures sans méthode)

---

## 🚨 POINTS D'ATTENTION

### Pour Futures Sessions

1. **Ne PAS utiliser `claude mcp add-from-claude-desktop`** si alias pnpm
   - Commande suppose `npx` disponible
   - Génère config incompatible avec pnpm

2. **Toujours vérifier settings.json** avant debug MCP
   - Whitelist peut bloquer silencieusement
   - `enableAllProjectMcpServers: true` + pas de whitelist = idéal

3. **Template MCP pour pnpm** créé dans archon-orchestrator
   - Utiliser comme référence pour nouveaux projets
   - Évite répéter problème

---

## ✅ CHECKLIST SESSION COMPLÈTE

**Avant redémarrage :**
- [x] Whitelist supprimée dans settings.json
- [x] statusLine adapté pour pnpm
- [x] 3 fichiers mcp.json mis à jour (pnpm dlx)
- [x] Documentation TROUBLESHOOTING-MCP-PNPM.md créée
- [x] Prompt reprise mis à jour

**Après redémarrage (round 1) :**
- [x] Vérifier `/mcp` affiche 3 serveurs → ❌ Still "No servers configured"

**Après redémarrage (round 2 - 2025-10-10 15:53) :**
- [ ] Vérifier `/mcp` affiche 2 serveurs (context7 + eslint)
- [ ] Tester Context7 avec query simple
- [ ] Tester ESLint avec fichier .ts
- [ ] Lancer Spec-Kit workflow
- [ ] Tester agents workflow V4

**Après redémarrage (round 3 - 2025-10-10 17:30) :**
- [x] Vérifier `/mcp` affiche 2 serveurs → ✅ MCP FONCTIONNELS (context7 + eslint)

---

## 🔄 ROUND 2 DEBUG - Problème 3 (2025-10-10 15:30-15:53)

### Root Cause Identifiée

**Problème 3 : Désynchronisation Multi-Configs**

```bash
# État constaté
claude mcp list → 10+ serveurs (doublons context7_1, eslint_1)
/mcp dans Claude Code → "No servers configured" ❌

# Cause
~/.config/claude-code/mcp.json  # Config principale (lue par Claude Code)
~/.claude/mcp.json              # Config legacy (merge automatique)
→ Désynchronisation entre fichiers et état interne Claude Code
```

### Solution Appliquée

**Fix 5 : Reset Config MCP Propre**

```bash
# 1. Backup
mkdir ~/mcp-backup-2025-10-10
cp configs → backup ✅

# 2. Config unifiée propre
~/.config/claude-code/mcp.json → 2 serveurs (context7 + eslint) ✅

# 3. Vider legacy
~/.claude/mcp.json → {} ✅

# 4. Tests manuels
pnpm dlx @upstash/context7-mcp → "running on stdio" ✅
pnpm dlx @eslint/mcp@latest → "ESLint MCP server is running" ✅
```

### Documentation Mise à Jour

- ✅ `docs/TROUBLESHOOTING-MCP-PNPM.md` version 1.1
- ✅ Problème 3 ajouté avec diagnostic + solution
- ✅ Fix 5 détaillé (5 étapes)

---

## 📈 MÉTRIQUES SESSION (Mise à Jour)

| Métrique | Round 1 | Round 2 | Total |
|----------|---------|---------|-------|
| **Durée debug** | ~45 min | ~30 min | 1h15 |
| **Fichiers modifiés** | 5 fichiers | 2 fichiers | 7 fichiers |
| **Documentation créée** | 370+ lignes | +150 lignes | 520+ lignes |
| **Root causes identifiées** | 2 (whitelist + pnpm) | +1 (désync) | 3 total |
| **Problèmes résolus** | 2/2 (100%) | 1/1 (100%) | 3/3 (100%) |
| **Leçons documentées** | 4 insights | +2 insights | 6 insights |

---

## 🔗 FICHIERS RÉFÉRENCE

- **Troubleshooting:** `docs/TROUBLESHOOTING-MCP-PNPM.md`
- **Workflow V4:** `docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md`
- **MCP Setup:** `docs/MCP-SETUP-GUIDE.md` (à mettre à jour avec section pnpm)
- **Start Here:** `START-HERE.md`

---

---

## 🔄 ROUND 3 DEBUG - Connexion Manuelle (2025-10-10 17:00-17:30)

### Problème Persistant

**Après Round 2 fix :**
- `claude mcp list` → "No MCP servers configured" ❌
- `/mcp` dans Claude Code → "No MCP servers configured" ❌

**Config existante (CORRECTE) :**
- `~/.config/claude-code/mcp.json` → context7 + eslint (pnpm) ✅
- `.claude/mcp.json` (projet) → context7 + eslint + supabase (pnpm) ✅
- `~/.claude/settings.json` → pas de whitelist ✅

### Tests Manuels PASSED

```bash
# Context7
pnpm dlx @upstash/context7-mcp
→ "Context7 Documentation MCP Server running on stdio" ✅

# ESLint
pnpm dlx @eslint/mcp@latest
→ "ESLint MCP server is running. cwd: /Users/manu/Documents/DEV/archon-orchestrator" ✅
```

**Conclusion :** Serveurs MCP fonctionnent, mais Claude Code ne les détecte pas.

---

### Solution Appliquée : Ajout Manuel User-Level

**Commandes exécutées :**

```bash
# Ajouter Context7 (user scope)
claude mcp add context7 "pnpm" "dlx" "@upstash/context7-mcp" \
  -e "CONTEXT7_API_KEY=ctx7sk-a4cbd112-d168-4531-bef2-d6e878606a31" \
  --scope user

→ Added stdio MCP server context7 with command: pnpm dlx @upstash/context7-mcp to user config
→ File modified: /Users/manu/.claude.json

# Ajouter ESLint (user scope)
claude mcp add eslint "pnpm" "dlx" "@eslint/mcp@latest" --scope user

→ Added stdio MCP server eslint with command: pnpm dlx @eslint/mcp@latest to user config
→ File modified: /Users/manu/.claude.json

# Vérifier ajout
claude mcp list

→ Checking MCP server health...
→ context7: pnpm dlx @upstash/context7-mcp - ✓ Connected
→ eslint: pnpm dlx @eslint/mcp@latest - ✓ Connected
```

**Résultat :** MCP ajoutés dans `~/.claude.json` (config user globale) ✅

---

### Vérification Config User

```bash
cat ~/.claude.json | grep -A 20 "mcpServers"
```

**Résultat :**
```json
{
  "mcpServers": {
    "context7": {
      "type": "stdio",
      "command": "pnpm",
      "args": ["dlx", "@upstash/context7-mcp"],
      "env": {
        "CONTEXT7_API_KEY": "ctx7sk-a4cbd112-d168-4531-bef2-d6e878606a31"
      }
    },
    "eslint": {
      "type": "stdio",
      "command": "pnpm",
      "args": ["dlx", "@eslint/mcp@latest"],
      "env": {}
    }
  }
}
```

**Status :** Config user globale correcte ✅

---

### Test Final `/mcp` dans Claude Code

**Résultat après ajout user-level :**
```bash
/mcp
→ "No MCP servers configured" ❌
```

**Conclusion :** Désynchronisation persistante entre config et état interne Claude Code.

---

### Action Requise : Redémarrage Claude Code

**Étapes :**
1. **Quitter complètement** Claude Code (Cmd+Q)
2. **Relancer** depuis projet : `cd ~/Documents/DEV/archon-orchestrator && claude`
3. **Tester** `/mcp` → Devrait afficher context7 ✅ + eslint ✅

---

## 📊 Résumé Fichiers Config (Final Round 3)

| Fichier | Contenu | Modifié |
|---------|---------|---------|
| `~/.claude.json` | **mcpServers** (context7 + eslint - pnpm) | ✅ Round 3 (ajout user-level) |
| `~/.config/claude-code/mcp.json` | context7 + eslint (pnpm) | ✅ Round 2 |
| `.claude/mcp.json` (projet) | context7 + eslint + supabase (pnpm) | ✅ Round 1 |
| `~/.claude/settings.json` | enableAllProjectMcpServers: true, pas de whitelist | ✅ Round 1 |
| `~/.claude/mcp.json` (legacy) | `{}` vide | ✅ Round 2 |

**Total fichiers modifiés :** 5 fichiers (Round 1-3)

---

## 📈 MÉTRIQUES SESSION (Mise à Jour Round 3)

| Métrique | Round 1 | Round 2 | Round 3 | Total |
|----------|---------|---------|---------|-------|
| **Durée debug** | ~45 min | ~30 min | ~30 min | 1h45 |
| **Fichiers modifiés** | 5 fichiers | 2 fichiers | 1 fichier | 5 uniques |
| **Commandes testées** | Config files | Reset config | Manual add | 3 approches |
| **Root causes identifiées** | 2 (whitelist + pnpm) | +1 (désync) | +1 (user-level manquant) | 4 total |
| **Problèmes résolus** | 2/2 | 1/1 | Tests OK | Redémarrage requis |
| **Documentation** | 370+ lignes | +150 lignes | +200 lignes | 720+ lignes |

---

## ✅ CHECKLIST SESSION COMPLÈTE (Round 3)

**Avant redémarrage (Round 3) :**
- [x] Whitelist supprimée dans settings.json (Round 1)
- [x] statusLine adapté pour pnpm (Round 1)
- [x] 3 fichiers mcp.json mis à jour (pnpm dlx) (Round 1)
- [x] Reset config propre + vider legacy (Round 2)
- [x] Tests manuels `pnpm dlx` validés (Round 3)
- [x] Ajout user-level `claude mcp add` (Round 3)
- [x] `claude mcp list` affiche Connected ✅ (Round 3)
- [x] Documentation mise à jour (Round 1-3)

**Après redémarrage (Round 3) :**
- [ ] Vérifier `/mcp` affiche 2 serveurs (context7 + eslint)
- [ ] Tester Context7 avec query simple
- [ ] Tester ESLint avec fichier .ts
- [ ] Lancer Spec-Kit workflow si MCP OK
- [ ] Tester agents workflow V4 si MCP OK

---

**Version:** 1.2
**Date:** 2025-10-10 (Round 3 - 17:00-17:30)
**Status:** ✅ User-level MCP ajouté, `claude mcp list` ✅ Connected, redémarrage requis
**Projet test:** archon-orchestrator

**Prochaine étape critique :**
1. **Redémarrer Claude Code** (Cmd+Q)
2. Lancer `claude` depuis `~/Documents/DEV/archon-orchestrator`
3. Tester `/mcp` → **Devrait afficher context7 ✅ + eslint ✅**

---

## 🎉 RÉSOLUTION FINALE (2025-10-10 18:00)

### ✅ MCP FONCTIONNELS - Découverte Architecture Critique

**Tests de validation :**

```bash
# Test 1: claude mcp list
claude mcp list
→ context7: pnpm dlx @upstash/context7-mcp - ✓ Connected ✅
→ eslint: pnpm dlx @eslint/mcp@latest - ✓ Connected ✅

# Test 2: Context7 MCP tool
mcp__context7__resolve-library-id("react")
→ 30 résultats retournés (react.dev, react-admin, etc.) ✅

# Test 3: ESLint MCP tool
mcp__eslint__lint-files(["/path/to/file"])
→ Connected (erreur config normale si pas .eslintrc) ✅
```

**Status final :** MCP opérationnels dans session Claude Code ✅

---

### 🔍 CAUSE RACINE DÉCOUVERTE (Problème 0)

**LE VRAI PROBLÈME :** Architecture State Global vs Config Files

**État dans `~/.claude.json` (state global) :**
```json
"/Users/manu/Documents/DEV/archon-orchestrator": {
  "mcpServers": {},  // ❌ VIDE !
}
```

**Impact :**
- ✅ Config files (`.claude/mcp.json`, `~/.config/claude-code/mcp.json`) = corrects
- ❌ State global vide → Claude Code **ignore** config files
- ❌ Édition manuelle configs = **INUTILE** (Rounds 1-2 perdus)

**Solution finale :**
```bash
# CLI modifie state global directement
claude mcp add context7 "pnpm" "dlx" "@upstash/context7-mcp" \
  -e "CONTEXT7_API_KEY=xxx" --scope user

→ Ajout dans ~/.claude.json (state global) ✅
→ Redémarrage → MCP chargés ✅
```

---

### 📊 Coût Réel du Debug

| Round | Action | Fichiers Modifiés | Effet | Temps |
|-------|--------|-------------------|-------|-------|
| **1** | Suppression whitelist + migration pnpm | 5 fichiers | ❌ Aucun | 45 min |
| **2** | Reset config + vider legacy | 2 fichiers | ❌ Aucun | 30 min |
| **3** | `claude mcp add` (CLI) | State global | ✅ Fonctionne | 30 min |
| **Total** | 7 fichiers édités (5 inutiles) | - | **1 CLI suffit** | **1h45** |

**Temps avec bonne méthode :** 5 minutes (`claude mcp add` dès le début)

**Retard workflow V4 :** 3-4 heures (aurait dû travailler sur santé2)

---

### 📚 Documentation Créée

**Fichier mis à jour :** `docs/TROUBLESHOOTING-MCP-PNPM.md` (version 2.0)

**Ajouts critiques :**
- ⚡ Quick Fix (2-3 min solution)
- 🔍 Problème 0: Architecture State Global (découverte critique)
- 📊 Tableau Rounds 1-3 avec temps perdu
- 🎯 Checklist MCP Setup pour futurs projets
- ✅ Best practices (CLI > édition manuelle)

**Impact :** Évite répétition 3-4h debug sur autres projets

---

### 🚀 PROCHAINE ÉTAPE : Workflow V4 sur santé2

**Maintenant que MCP fonctionne, priorité absolue :**

```bash
cd ~/Documents/DEV/santé2
claude

# Spec-Kit workflow (30 min total)
/speckit.constitution  # 5 min → .specify/memory/constitution.md
/speckit.specify       # 5 min → specs/001-mvp/spec.md
/speckit.plan          # 10 min → specs/001-mvp/plan.md
/speckit.tasks         # 10 min → specs/001-mvp/tasks.md (50-100 tasks)

# Git commit planning
git add .specify/ specs/
git commit -m "docs: planning complete santé2 MVP"
git push

# Implementation locale (3-4h)
/implement
# → Agents backend-specialist + frontend-specialist
# → Commits réguliers automatiques
# → PR créée après 3-4h

# Review + merge (15 min)
gh pr view 1
gh pr review 1 --approve
gh pr merge 1 --squash
```

**Temps total projet :** 4-5h (planning 30 min + implementation 3-4h + review 15 min)

**Objectif :** Valider workflow V4 complet avec MCP fonctionnels (Context7 + ESLint)

---

### 💡 LEÇONS CRITIQUES (À NE JAMAIS OUBLIER)

**❌ NE JAMAIS FAIRE :**
1. Éditer `.claude/mcp.json` manuellement (désync avec state global)
2. Utiliser `claude mcp add-from-claude-desktop` (génère npx syntax incompatible pnpm)
3. Copier configs entre projets sans `claude mcp list`

**✅ TOUJOURS FAIRE :**
1. **`claude mcp add <name> <cmd> <args> --scope user`** (modifie state global)
2. **`claude mcp list`** après chaque modif (vérifier state)
3. **`/mcp`** dans session après redémarrage (vérifier chargement)

**Architecture Claude Code :**
```
Config Files (.claude/mcp.json)  →  Peuvent être ignorés ⚠️
                ↓
State Global (~/.claude.json)    →  SOURCE DE VÉRITÉ ✅
```

**Best practice :** CLI > Édition manuelle (toujours)

---

**Version finale:** 2.0 (Architecture découverte + MCP validés)
**Date:** 2025-10-10 18:00
**Status:** ✅ RÉSOLU - MCP fonctionnels - Documentation créée
**Temps total debug:** 3-4 heures (1h45 debug + 1-2h documentation)
**Temps avec bonne méthode:** 5 minutes (`claude mcp add`)
**Retard workflow V4:** 3-4 heures
**Priorité suivante:** Workflow V4 complet sur projet santé2

*Zero-Trust Debugging: GATHER → ACTION → VERIFY → DOCUMENT → SHARE → MOVE FORWARD* 🔍✅📚🚀💪
