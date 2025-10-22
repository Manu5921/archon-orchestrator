# 🪟 Windows 11 Setup Guide - Archon Orchestrator

**Version:** 1.0
**Date:** 2025-10-22
**Target:** Windows 11 Pro/Home (64-bit)
**Time:** ~30-45 min (one-time setup)

---

## 🎯 Overview

Ce guide permet de cloner l'environnement **Archon Orchestrator** depuis ton Mac vers Windows 11.

**Après setup, tu auras:**
- ✅ Claude Code CLI fonctionnel
- ✅ Archon Orchestrator (repo GitHub cloné)
- ✅ MCP Servers configurés (Zen, Context7, ESLint)
- ✅ Synchronisation Mac ↔ Windows via Git

---

## 📋 Prerequisites

### Requis (à installer AVANT):

1. **Node.js 18+** (LTS recommandé)
   - Download: https://nodejs.org/en/download/
   - Installer avec option "Add to PATH"
   - Vérifier: `node --version` dans PowerShell

2. **Git 2.x+**
   - Download: https://git-scm.com/download/win
   - Installer avec options par défaut
   - Vérifier: `git --version`

3. **Python 3.10+** (pour Zen MCP)
   - Download: https://www.python.org/downloads/
   - **IMPORTANT:** Cocher "Add Python to PATH" pendant l'installation
   - Vérifier: `python --version`

4. **Compte Claude** (même que Mac)
   - URL: https://claude.ai
   - Utiliser le MÊME email que sur Mac

5. **GitHub Account** (même que Mac)
   - URL: https://github.com
   - Repository: https://github.com/Manu5921/archon-orchestrator

---

## 🔧 STEP 1: Install Claude Code (10 min)

### 1.1 Install via npm

```powershell
# Ouvrir PowerShell (PAS en admin, utilisateur normal suffit)

# Installer Claude Code globalement
npm install -g @anthropic-ai/claude-code

# Vérifier installation
claude --version
# Output attendu: @anthropic-ai/claude-code v1.x.x
```

### 1.2 Authenticate

```powershell
# Se connecter avec compte Claude
claude auth login

# Suivre les instructions:
# 1. URL s'ouvre dans navigateur
# 2. Login avec MÊME email que Mac
# 3. Autoriser Claude Code
# 4. Retourner dans terminal
# 5. Message de confirmation
```

**Troubleshooting:**
- Si `claude: command not found` → Redémarrer PowerShell
- Si erreur network → Vérifier firewall/proxy
- Si erreur auth → Vérifier compte Claude actif

---

## 📦 STEP 2: Clone Archon Orchestrator (5 min)

### 2.1 Choose location

**Option A: Documents (équivalent Mac):**
```powershell
cd $HOME\Documents
mkdir DEV -ErrorAction SilentlyContinue
cd DEV
```

**Option B: Custom location:**
```powershell
# Exemple: D:\Projects
cd D:\
mkdir Projects -ErrorAction SilentlyContinue
cd Projects
```

### 2.2 Clone repository

```powershell
# Cloner depuis GitHub
git clone https://github.com/Manu5921/archon-orchestrator.git

# Entrer dans le projet
cd archon-orchestrator

# Vérifier branche (doit être 'main')
git branch
# Output: * main

# Lister fichiers (vérifier)
dir
# Doit afficher: CLAUDE.md, lib/, docs/, .agents/, etc.
```

### 2.3 Setup environment variables

```powershell
# Créer .env.local (NON tracké par git)
notepad .env.local

# Coller dedans (remplacer par TON token GitHub):
GITHUB_TOKEN=github_pat_VOTRE_TOKEN_ICI

# Sauvegarder (Ctrl+S) et fermer
```

**Comment obtenir un token GitHub:**
1. Va sur: https://github.com/settings/personal-access-tokens/new
2. Token name: `archon-orchestrator-windows`
3. Expiration: 90 jours
4. Repository access: `Only select repositories` → `Manu5921/archon-orchestrator`
5. Permissions:
   - Contents: Read and write ✅
   - Pull requests: Read and write ✅
   - Workflows: Read and write ✅
6. Generate token → **COPIER IMMÉDIATEMENT** (tu ne le reverras plus)
7. Coller dans `.env.local`

**Vérifier .gitignore:**
```powershell
# Vérifier que .env.local est ignoré
cat .gitignore | Select-String ".env.local"
# Doit afficher: .env.local

# Vérifier que git ignore bien le fichier
git status .env.local
# Doit afficher: "No such file" OU rien (= pas tracké)
```

---

## 🔌 STEP 3: Configure MCP Servers (20 min)

### 3.1 Zen MCP Server (Gemini bridge)

**3.1.1 Clone Zen MCP**

```powershell
# Retourner dans DEV
cd $HOME\Documents\DEV  # OU ton chemin custom

# Cloner Zen MCP
git clone https://github.com/BeehiveInnovations/zen-mcp-server.git
cd zen-mcp-server
```

**3.1.2 Setup Python virtual environment**

```powershell
# Créer environnement virtuel
python -m venv .zen_venv

# Activer l'environnement
.zen_venv\Scripts\activate
# Prompt change: (.zen_venv) PS C:\...

# Installer dépendances
pip install -r requirements.txt

# Désactiver l'environnement (pour l'instant)
deactivate
```

**3.1.3 Register with Claude Code**

```powershell
# Retourner dans archon-orchestrator
cd ..\archon-orchestrator

# Enregistrer Zen MCP
# REMPLACER "ton-username" par TON nom d'utilisateur Windows
claude mcp add zen "C:\Users\ton-username\Documents\DEV\zen-mcp-server\.zen_venv\Scripts\python.exe" "C:\Users\ton-username\Documents\DEV\zen-mcp-server\server.py"

# Vérifier
claude mcp list
# Doit afficher "zen" dans la liste
```

**🔍 Trouver ton username Windows:**
```powershell
echo $env:USERNAME
# Output: ton-username (utilise cette valeur)
```

**3.1.4 Setup Gemini CLI**

```powershell
# Installer Gemini CLI (dans .zen_venv)
cd ..\zen-mcp-server
.zen_venv\Scripts\activate

pip install google-generativeai

# Login OAuth Gemini
gemini auth login
# Suivre instructions navigateur (utiliser MÊME compte Google que Mac)

deactivate
```

### 3.2 Context7 MCP (Built-in)

```powershell
# Context7 est automatiquement inclus dans Claude Code
# Vérifier présence:
claude mcp list

# Doit afficher dans la liste:
# - context7 (resolve-library-id, get-library-docs)
```

### 3.3 ESLint MCP (Built-in)

```powershell
# ESLint aussi built-in
# Vérifier présence:
claude mcp list

# Doit afficher:
# - eslint (lint-files)
```

---

## ✅ STEP 4: Verify Installation (5 min)

### 4.1 Test Claude Code

```powershell
# Retourner dans archon-orchestrator
cd $HOME\Documents\DEV\archon-orchestrator

# Lancer Claude Code
claude
```

**Dans Claude Code, tester:**

```
Test 1: Lecture du projet
------------------------
/validationBP

✅ Attendu:
- Version V7.0 affichée
- Derniers commits listés
- Features critiques extraites

❌ Si erreur: Vérifier que tu es dans le bon dossier (archon-orchestrator)


Test 2: Zen MCP (Gemini)
-------------------------
Utilise mcp__zen__chat avec:
- prompt: "Hello from Windows, is Gemini working?"
- working_directory: "C:\Users\ton-username\Documents\DEV\archon-orchestrator"
- model: "gemini-2.5-pro"

✅ Attendu: Réponse de Gemini confirmant connexion

❌ Si erreur:
- Vérifier gemini auth login (OAuth 24h)
- Vérifier zen-mcp-server paths corrects


Test 3: Context7
----------------
Utilise mcp__context7__resolve-library-id avec:
- libraryName: "next.js"

✅ Attendu: Library ID retourné (/vercel/next.js ou similaire)

❌ Si erreur: Context7 devrait être built-in, redémarrer Claude Code
```

### 4.2 Test Git workflow

```powershell
# Vérifier git config
git config --global user.name
git config --global user.email

# Si vides, configurer:
git config --global user.name "Emmanuel Clarisse"
git config --global user.email "manu@ton-email.com"

# Test pull (doit être up-to-date)
git pull origin main
# Output: Already up to date.

# Test status
git status
# Output: On branch main, nothing to commit, working tree clean
```

---

## 🔄 Synchronization Workflow (Mac ↔ Windows)

### Daily workflow

**Sur Mac (terminer travail):**
```bash
cd ~/Documents/DEV/archon-orchestrator

# Committer changements
git add .
git commit -m "feat: description"
git push origin main
```

**Sur Windows (récupérer changements):**
```powershell
cd $HOME\Documents\DEV\archon-orchestrator

# Pull derniers changements
git pull origin main

# Travailler...

# Committer et pusher
git add .
git commit -m "fix: description"
git push origin main
```

**Sur Mac (récupérer changements Windows):**
```bash
cd ~/Documents/DEV/archon-orchestrator
git pull origin main
```

### Best practices

✅ **DO:**
- Committer AVANT de changer de machine
- Toujours `git pull` avant de commencer à travailler
- Utiliser branches pour features importantes
- `.env.local` sur CHAQUE machine (même token OK)

❌ **DON'T:**
- Modifier SAME file sur 2 machines simultanément (= merge conflicts)
- Committer `.env.local` ou secrets
- Oublier de pull (= travail basé sur version obsolète)

### Conflict resolution (si arrive)

```powershell
# Si git pull montre "CONFLICT"
git status  # Voir fichiers en conflit

# Ouvrir fichier en conflit dans éditeur
notepad fichier-en-conflit.md

# Chercher les marqueurs:
# <<<<<<< HEAD
# Ton changement Windows
# =======
# Changement Mac
# >>>>>>> origin/main

# Garder la bonne version (ou merger manuellement)
# Sauvegarder

# Marquer comme résolu
git add fichier-en-conflit.md
git commit -m "fix: resolve merge conflict"
git push origin main
```

---

## 🐛 Troubleshooting

### Issue: `claude: command not found`

**Cause:** npm global path pas dans PATH

**Solution:**
```powershell
# Trouver chemin npm global
npm config get prefix
# Output: C:\Users\ton-username\AppData\Roaming\npm

# Ajouter au PATH:
# 1. Ouvrir "Modifier les variables d'environnement système"
# 2. Variables d'environnement → Path (utilisateur) → Modifier
# 3. Ajouter: C:\Users\ton-username\AppData\Roaming\npm
# 4. OK → Redémarrer PowerShell
```

### Issue: `python: command not found`

**Cause:** Python pas dans PATH

**Solution:**
- Réinstaller Python depuis https://www.python.org/downloads/
- **COCHER "Add Python to PATH"** pendant installation
- OU ajouter manuellement au PATH (comme ci-dessus)

### Issue: Zen MCP ne fonctionne pas

**Debug steps:**
```powershell
# 1. Vérifier paths absolus corrects
claude mcp list
# Zen doit pointer vers C:\Users\...\python.exe (chemin complet)

# 2. Tester Python venv manuellement
cd $HOME\Documents\DEV\zen-mcp-server
.zen_venv\Scripts\activate
python server.py
# Doit démarrer sans erreur

# 3. Vérifier Gemini auth
gemini auth login
# Re-authenticate si expiré (24h validity)

# 4. Re-register si besoin
claude mcp remove zen
claude mcp add zen "C:\Users\ton-username\Documents\DEV\zen-mcp-server\.zen_venv\Scripts\python.exe" "C:\Users\ton-username\Documents\DEV\zen-mcp-server\server.py"
```

### Issue: Git authentication failed

**Cause:** GitHub token manquant ou expiré

**Solution:**
```powershell
# Vérifier token existe
cat .env.local
# Doit afficher: GITHUB_TOKEN=github_pat_...

# Si manquant ou expiré, créer nouveau token:
# https://github.com/settings/personal-access-tokens/new
# (voir STEP 2.3)

# Tester token
git ls-remote https://github.com/Manu5921/archon-orchestrator.git
# Doit lister les refs (pas d'erreur auth)
```

### Issue: Line endings warnings

**Symptom:**
```
warning: LF will be replaced by CRLF in file.txt
```

**Solution (configurer Git pour Windows):**
```powershell
# Auto-conversion LF ↔ CRLF
git config --global core.autocrlf true

# Ignorer warnings (safe)
git config --global core.safecrlf false
```

---

## 📚 References

### Windows-specific paths

**Équivalences Mac → Windows:**
| Mac | Windows | Description |
|-----|---------|-------------|
| `~/Documents/DEV/` | `C:\Users\USERNAME\Documents\DEV\` | Projets dev |
| `/usr/local/bin/` | `C:\Users\USERNAME\AppData\Roaming\npm\` | Binaires npm |
| `~/.config/` | `C:\Users\USERNAME\AppData\Local\` | Config apps |
| `/tmp/` | `C:\Users\USERNAME\AppData\Local\Temp\` | Fichiers temp |

**PowerShell variables utiles:**
```powershell
$HOME           # C:\Users\ton-username
$env:USERNAME   # ton-username
$env:USERPROFILE # C:\Users\ton-username
$PWD            # Current directory
```

### Command differences

| Task | Mac (bash) | Windows (PowerShell) |
|------|------------|----------------------|
| List files | `ls -la` | `dir` ou `ls` |
| Print file | `cat file.txt` | `cat file.txt` ou `type file.txt` |
| Find text | `grep "text" file` | `Select-String "text" file` |
| Create file | `touch file.txt` | `New-Item file.txt` |
| Remove file | `rm file.txt` | `Remove-Item file.txt` |
| Copy file | `cp a b` | `Copy-Item a b` |
| Path separator | `/` (slash) | `\` (backslash) |

### MCP Paths format

**IMPORTANT:** MCP add commands nécessitent chemins ABSOLUS Windows.

❌ **INCORRECT:**
```powershell
claude mcp add zen "~/zen-mcp-server/python.exe" "~/zen-mcp-server/server.py"
# ~ n'existe pas sous Windows
```

✅ **CORRECT:**
```powershell
claude mcp add zen "C:\Users\manu\Documents\DEV\zen-mcp-server\.zen_venv\Scripts\python.exe" "C:\Users\manu\Documents\DEV\zen-mcp-server\server.py"
# Chemins absolus complets
```

**Tip:** Utiliser `$HOME` dans PowerShell:
```powershell
claude mcp add zen "$HOME\Documents\DEV\zen-mcp-server\.zen_venv\Scripts\python.exe" "$HOME\Documents\DEV\zen-mcp-server\server.py"
# $HOME = C:\Users\ton-username
```

---

## ✅ Checklist de vérification finale

Avant de commencer à travailler, vérifie:

### Prerequisites
- [ ] Node.js installé (`node --version` → v18+)
- [ ] Git installé (`git --version` → 2.x+)
- [ ] Python installé (`python --version` → 3.10+)
- [ ] Compte Claude actif (même email que Mac)
- [ ] Compte GitHub actif

### Claude Code
- [ ] Claude Code installé (`claude --version`)
- [ ] Claude authenticated (`claude auth login` fait)
- [ ] Peut lancer `claude` dans terminal

### Project
- [ ] Archon cloned (`cd archon-orchestrator` fonctionne)
- [ ] `.env.local` créé avec GitHub token
- [ ] `git status` fonctionne (pas d'erreur auth)
- [ ] `/validationBP` affiche version correcte

### MCP Servers
- [ ] Zen MCP registered (`claude mcp list` affiche "zen")
- [ ] Gemini authenticated (`gemini auth login` fait)
- [ ] `mcp__zen__chat` test réussit
- [ ] Context7 available (`claude mcp list` affiche "context7")
- [ ] ESLint available (`claude mcp list` affiche "eslint")

### Git Sync
- [ ] `git config` user.name et user.email configurés
- [ ] `git pull origin main` fonctionne
- [ ] Test commit + push réussi

---

## 🎯 Next Steps

Une fois setup complet:

1. **Test workflow complet:**
   ```powershell
   cd $HOME\Documents\DEV\archon-orchestrator
   claude
   # Dans Claude: "/validationBP"
   # Vérifier que tout fonctionne
   ```

2. **Sync avec Mac:**
   - Sur Mac: Committer derniers changements
   - Sur Windows: `git pull origin main`
   - Vérifier que tu as la dernière version

3. **Premier projet test:**
   - Utiliser Library V7.0 modules (lib/nextjs/...)
   - Tester workflow complet
   - Valider que MCP tools fonctionnent

4. **Documenter spécificités Windows:**
   - Noter différences trouvées
   - Améliorer ce guide si besoin
   - Partager learnings

---

## 📞 Support

**Si problème:**
1. Vérifier Troubleshooting section ci-dessus
2. Lire logs: `claude --debug` (mode verbose)
3. Vérifier MCP logs: `claude mcp logs zen`
4. Demander à Claude Code directement (moi !)

**Ressources:**
- Claude Code Docs: https://docs.claude.com/claude-code
- Zen MCP GitHub: https://github.com/BeehiveInnovations/zen-mcp-server
- Context7 MCP: Built-in (pas de config externe)
- Archon Orchestrator: https://github.com/Manu5921/archon-orchestrator

---

**Version:** 1.0
**Created:** 2025-10-22
**OS:** Windows 11 (64-bit)
**Validated:** Setup procedure tested

**Next:** Test on real Windows 11 machine, refine guide based on feedback
