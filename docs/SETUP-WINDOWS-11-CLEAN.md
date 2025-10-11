# 🪟 Setup Windows 11 Clean - Installation Vierge

**Version**: 1.0
**Date**: 2025-10-11
**Objectif**: Installation VIERGE Claude Code sur Windows 11 sans pollution config
**Scope**: Test environnement propre, sans fichiers parasites (whitelist, pnpm, agents obsolètes)

---

## 🎯 PHILOSOPHIE INSTALLATION VIERGE

### Pourquoi "Clean Install" ?

**Problèmes rencontrés sur Mac (à éviter sur Windows) :**
- ✅ Whitelist MCP (`allowed`/`blocked` tools) → Bloque outils nécessaires
- ✅ Config pnpm complexe → Erreurs "module not found"
- ✅ Agents obsolètes (V1-V3) → Conflits avec agents V4
- ✅ `.claude/mcp.json` édité manuellement → State incohérent avec global

**Objectif Windows 11 :**
- ✅ Installation minimaliste (JUSTE ce qui est nécessaire)
- ✅ Pas de fichiers config custom (utiliser CLI uniquement)
- ✅ Pas de scripts automatiques (comprendre chaque étape)
- ✅ Documentation accessible (fichiers `.md` essentiels seulement)

---

## 📂 FICHIERS ESSENTIELS À COPIER

### Minimum Absolu (≈150 KB - 5 fichiers)

**Ces fichiers SEULEMENT :**

```
archon-orchestrator/
├── START-HERE.md                          # Point d'entrée (15 KB)
├── CLAUDE.md                              # Instructions Claude Code (25 KB)
├── README.md                              # Overview (10 KB)
├── docs/
│   ├── WORKFLOW-FINAL-V4-MULTI-DEVICE.md  # Workflow complet (45 KB)
│   └── PROCESS-TDD.md                     # Guide TDD (50 KB)
```

**Pourquoi ces 5 fichiers UNIQUEMENT ?**

| Fichier | Raison | Contenu Critique |
|---------|--------|------------------|
| **START-HERE.md** | Point d'entrée rapide | Quick start, liens docs |
| **CLAUDE.md** | Instructions anti-hallucination | Workflow validé, anti-patterns |
| **README.md** | Overview projet | Vision, stack tech |
| **WORKFLOW-FINAL-V4** | Source de vérité workflow | Mac 24/7 + GitHub + Jules |
| **PROCESS-TDD.md** | Guide TDD complet | RED-GREEN-REFACTOR, leçons |

**❌ NE PAS COPIER :**
- `.claude/` (sera recréé proprement)
- `.specify/` (sera recréé par Spec-Kit)
- `archive-*/` (docs obsolètes)
- `.git/` (historique git non nécessaire)
- Scripts custom (test installation manuelle)

---

## 🚀 INSTALLATION WINDOWS 11 (Step-by-Step Manuel)

### Phase 1 : WSL2 Setup (10 min)

#### Étape 1.1 : Installer WSL2

```powershell
# Ouvrir PowerShell en ADMINISTRATEUR
# Clic droit sur Windows Terminal → "Exécuter en tant qu'administrateur"

# Installer WSL2 + Ubuntu
wsl --install

# Output attendu :
# "Installation en cours... Ubuntu sera installé"
# "Redémarrage requis pour terminer l'installation"

# Redémarrer Windows
Restart-Computer
```

**Après redémarrage :**

```powershell
# Ubuntu démarre automatiquement
# Prompt : "Enter new UNIX username:"
# → Taper : manu (ou ton choix)

# Prompt : "New password:"
# → Taper ton mot de passe (invisible pendant saisie - NORMAL)

# Prompt : "Retype new password:"
# → Retaper même mot de passe

# Output attendu :
# "Installation successful!"
# Prompt devient : manu@DESKTOP-XXXXX:~$
```

#### Étape 1.2 : Vérifier WSL2

```bash
# Tu es maintenant dans Ubuntu WSL2

# Vérifier version WSL
wsl.exe --version
# WSL version: 2.x.x

# Vérifier distribution Ubuntu
cat /etc/os-release
# NAME="Ubuntu"
# VERSION="22.04.x LTS"

# Vérifier localisation
pwd
# /home/manu
```

---

### Phase 2 : Environnement de Base (15 min)

#### Étape 2.1 : Update System

```bash
# Update package lists
sudo apt update

# Output :
# "Fetched X packages..."

# Upgrade installed packages
sudo apt upgrade -y

# (Peut prendre 3-5 min)
# Output :
# "Upgrading packages... Done."
```

#### Étape 2.2 : Installer Node.js via nvm (Recommandé WSL)

```bash
# Télécharger + installer nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Output :
# "Downloading nvm..."
# "=> Close and reopen terminal to start using nvm"

# Reload shell config (PAS besoin fermer terminal)
source ~/.bashrc

# Vérifier nvm installé
command -v nvm
# nvm

# Installer Node.js 20 (LTS)
nvm install 20

# Output :
# "Downloading and installing Node.js 20..."
# "Now using node v20.x.x"

# Activer Node.js 20
nvm use 20

# Vérifier versions
node --version
# v20.x.x

npm --version
# 10.x.x
```

**Pourquoi nvm et pas apt ?**
- ✅ Version Node.js récente (apt = souvent 14.x obsolète)
- ✅ Possibilité changer version facilement (`nvm use 18` / `nvm use 20`)
- ✅ Pas besoin sudo pour npm install -g

#### Étape 2.3 : Installer pnpm

```bash
# Installer pnpm globalement
npm install -g pnpm

# Output :
# "added 1 package"

# Vérifier version
pnpm --version
# 8.x.x
```

#### Étape 2.4 : Installer Git

```bash
# Installer git
sudo apt install git -y

# Vérifier installation
git --version
# git version 2.40+

# Configurer Git (IMPORTANT)
git config --global user.name "Manu"
git config --global user.email "ton@email.com"

# Vérifier config
git config --list
# user.name=Manu
# user.email=ton@email.com

# Configurer line endings (CRITIQUE pour Windows/WSL)
git config --global core.autocrlf input
# → Convertit CRLF (Windows) → LF (Linux) automatiquement
```

#### Étape 2.5 : Installer GitHub CLI

```bash
# Ajouter repository GitHub CLI
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | \
  sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | \
  sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null

# Update package lists
sudo apt update

# Installer gh
sudo apt install gh -y

# Vérifier installation
gh --version
# gh version 2.40+

# Authentifier GitHub (OAuth)
gh auth login

# Prompts interactifs :
# ? What account do you want to log into?
# → GitHub.com (ENTER)

# ? What is your preferred protocol?
# → HTTPS (ENTER)

# ? Authenticate Git with your GitHub credentials?
# → Yes (ENTER)

# ? How would you like to authenticate?
# → Login with a web browser (ENTER)

# Output :
# "! First copy your one-time code: XXXX-XXXX"
# "Press Enter to open github.com in your browser..."

# → Copier code XXXX-XXXX
# → Appuyer ENTER
# → Browser s'ouvre (Windows) → Coller code → Authorize
# → Revenir terminal

# Vérifier authentication
gh auth status
# ✓ Logged in to github.com as Manu5921 (oauth_token)
```

#### Étape 2.6 : Installer Claude Code CLI

```bash
# Télécharger + installer Claude Code
curl -fsSL https://claude.ai/install.sh | sh

# Output :
# "Installing Claude Code CLI..."
# "Installation complete!"

# Reload shell
source ~/.bashrc

# Vérifier installation
claude --version
# Claude Code CLI v1.x.x

# Tester lancement (va demander login première fois)
claude --help
# Usage: claude [options] [file]...
```

---

### Phase 3 : Récupérer Documentation Essentielle (5 min)

#### Option A : Clone Repo Complet (Si accès GitHub)

```bash
# Créer structure dossiers
mkdir -p ~/Documents/DEV
cd ~/Documents/DEV

# Clone archon-orchestrator
git clone https://github.com/Manu5921/archon-orchestrator.git

# Entrer dans dossier
cd archon-orchestrator

# Vérifier dernière version
git pull origin main

# Output :
# Already up to date. (si dernière version)
```

#### Option B : Copie Fichiers Essentiels Uniquement (Recommandé pour test clean)

**Sur Mac actuel :**

```bash
# Créer archive des 5 fichiers essentiels
cd ~/Documents/DEV/archon-orchestrator

tar -czf ~/Downloads/archon-docs-essentiels.tar.gz \
  START-HERE.md \
  CLAUDE.md \
  README.md \
  docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md \
  docs/PROCESS-TDD.md

# Transférer archon-docs-essentiels.tar.gz vers Windows
# (Google Drive, USB, email, etc.)
```

**Sur Windows 11 WSL2 :**

```bash
# Accéder au système de fichiers Windows depuis WSL
cd /mnt/c/Users/Manu/Downloads

# OU si fichier dans Downloads WSL
cd ~/Downloads

# Créer dossier archon-orchestrator
mkdir -p ~/Documents/DEV/archon-orchestrator
cd ~/Documents/DEV/archon-orchestrator

# Extraire archive
tar -xzf /mnt/c/Users/Manu/Downloads/archon-docs-essentiels.tar.gz

# Vérifier fichiers présents
ls -lh
# START-HERE.md
# CLAUDE.md
# README.md
# docs/

ls -lh docs/
# WORKFLOW-FINAL-V4-MULTI-DEVICE.md
# PROCESS-TDD.md
```

**Résultat** : Tu as maintenant **UNIQUEMENT** les docs essentielles, SANS configs `.claude/`, agents obsolètes, scripts custom.

---

### Phase 4 : Configuration MCP Clean (10 min)

**⚠️ LEÇON APPRISE : Ne JAMAIS éditer manuellement les fichiers config MCP**

#### Pourquoi ?

**Problèmes rencontrés sur Mac :**
1. **État global vs config files** : Claude Code utilise `~/.claude.json` (global state), PAS `.claude/mcp.json` (local)
2. **Whitelist outils** : `allowed`/`blocked` tools mal configurés bloquent Bash/Read/Write
3. **pnpm config complexe** : Chemins relatifs cassent après `pnpm install`

**Solution Windows 11 :**
✅ Utiliser **UNIQUEMENT** `claude mcp add` CLI
✅ Ne PAS créer `.claude/mcp.json` manuellement
✅ Ne PAS copier config MCP depuis Mac

#### Étape 4.1 : Installer Context7 MCP (Optionnel mais recommandé)

```bash
# Installer Context7 via CLI Claude Code
claude mcp add context7 \
  "pnpm" \
  "dlx" \
  "@upstash/context7-mcp" \
  --scope user

# Output :
# "Adding MCP server 'context7'..."
# "✓ MCP server added successfully"

# Si Context7 nécessite API key (optionnel) :
claude mcp add context7 \
  "pnpm" \
  "dlx" \
  "@upstash/context7-mcp" \
  -e "CONTEXT7_API_KEY=ta-clé-ici" \
  --scope user
```

**Pourquoi `pnpm dlx` ?**
- ✅ Télécharge + exécute package temporairement (comme `npx -y`)
- ✅ Pas d'installation globale polluante
- ✅ Version toujours à jour

#### Étape 4.2 : Installer ESLint MCP (Optionnel)

```bash
# Installer ESLint MCP via CLI
claude mcp add eslint \
  "pnpm" \
  "dlx" \
  "@eslint/mcp@latest" \
  --scope user

# Output :
# "Adding MCP server 'eslint'..."
# "✓ MCP server added successfully"
```

#### Étape 4.3 : Vérifier MCP Installés

```bash
# Lister tous les MCP configurés
claude mcp list

# Output attendu :
# context7: ✓ Connected
# eslint: ✓ Connected

# Si erreur "No MCP servers configured"
# → Normal si tu n'as pas installé Context7/ESLint (optionnels)
```

#### Étape 4.4 : Redémarrer Claude Code

```bash
# Quitter session Claude actuelle (si lancée)
exit

# Relancer Claude Code
claude

# Vérifier MCP chargés
# Dans Claude, taper : /mcp

# Devrait montrer :
# Available MCP tools:
# - mcp__context7__resolve-library-id
# - mcp__context7__get-library-docs
# - mcp__eslint__lint-files
```

---

### Phase 5 : Test Installation Vierge (10 min)

#### Étape 5.1 : Créer Projet Test

```bash
# Créer dossier projet test
mkdir -p ~/Documents/DEV/test-windows-clean
cd ~/Documents/DEV/test-windows-clean

# Initialiser git
git init

# Créer README minimal
cat > README.md <<EOF
# Test Windows 11 Clean Install

Test installation vierge Claude Code sur Windows 11 WSL2.

**Date**: $(date +%Y-%m-%d)
**Environment**: WSL2 Ubuntu 22.04
EOF

# Commit initial
git add README.md
git commit -m "chore: init test project"
```

#### Étape 5.2 : Lancer Claude Code

```bash
# Lancer Claude dans projet
claude

# Output :
# "Welcome to Claude Code!"
# "Project: ~/Documents/DEV/test-windows-clean"
```

#### Étape 5.3 : Tester Commandes de Base

**Dans session Claude Code :**

```
# Test 1 : Créer fichier
Peux-tu créer un fichier test.txt avec "Hello Windows 11" ?

# Claude devrait utiliser Write tool
# → Vérifier : cat test.txt
# Hello Windows 11

# Test 2 : Lire fichier
Lis README.md

# Claude devrait utiliser Read tool
# → Afficher contenu README.md

# Test 3 : Bash command
Exécute : echo "WSL2 works" > wsl-test.txt

# Claude devrait utiliser Bash tool
# → Vérifier : cat wsl-test.txt
# WSL2 works

# Test 4 : MCP Context7 (si installé)
Peux-tu chercher la doc Next.js pour "Image optimization" ?

# Claude devrait proposer :
# "Je vais utiliser Context7 MCP pour chercher dans docs Next.js..."
# → Afficher résultat docs
```

#### Étape 5.4 : Vérifier Permissions Tools

```
# Dans Claude Code, demander :
Liste tous les tools disponibles

# Output attendu (SANS whitelist restrictive) :
# Available tools:
# - Bash
# - Read
# - Write
# - Edit
# - Grep
# - Glob
# - WebSearch
# - WebFetch
# - Task (agents)
# - mcp__context7__* (si installé)
# - mcp__eslint__* (si installé)
```

**Si tools manquants (Bash, Read, Write bloqués) :**
→ Problème whitelist → Voir Troubleshooting

---

## ⚠️ PIÈGES À ÉVITER (Leçons Mac)

### Piège 1 : Éditer `.claude/mcp.json` Manuellement

**❌ NE PAS FAIRE :**
```bash
# Créer .claude/mcp.json à la main
mkdir -p .claude
nano .claude/mcp.json
# → État incohérent avec global state
```

**✅ TOUJOURS FAIRE :**
```bash
# Utiliser CLI
claude mcp add context7 "pnpm" "dlx" "@upstash/context7-mcp" --scope user
```

---

### Piège 2 : Copier Config MCP depuis Mac

**❌ NE PAS FAIRE :**
```bash
# Copier mcp.json depuis Mac
cp /mnt/c/Users/Manu/Downloads/mcp-backup.tar.gz .
tar -xzf mcp-backup.tar.gz
# → Chemins Mac incompatibles, pnpm config cassée
```

**✅ FAIRE :**
Réinstaller proprement via CLI (voir Phase 4)

---

### Piège 3 : Whitelist Tools Restrictive

**Symptôme :**
```
Claude: "Je n'ai pas accès à l'outil Bash"
OU
Claude: "Tool 'Write' is blocked by permissions"
```

**Cause :**
Config `.claude/settings.json` avec whitelist restrictive :
```json
{
  "permissions": {
    "allowed": ["Read"],  // ← TROP RESTRICTIF
    "blocked": ["Bash"]   // ← Bash bloqué
  }
}
```

**Solution :**
```bash
# Supprimer settings.json restrictif
rm .claude/settings.json

# OU éditer pour permettre tous outils
cat > .claude/settings.json <<EOF
{
  "permissions": {
    "allow": ["Bash", "Read", "Edit", "Write", "Grep", "Glob", "WebFetch", "WebSearch", "Task"]
  }
}
EOF
```

---

### Piège 4 : Agents Obsolètes (V1-V3)

**Symptôme :**
```
Dossier .claude/agents/ existe avec agents anciens :
- general-purpose-agent-v1.md
- scout-specialist.md (obsolète)
```

**Cause :**
Agents copiés depuis vieille installation

**Solution :**
```bash
# Supprimer agents obsolètes
rm -rf .claude/agents/

# Les agents V4 seront créés automatiquement par Spec-Kit si nécessaire
```

---

### Piège 5 : Accès Windows FS depuis WSL (Lent)

**❌ LENT (50% perf I/O) :**
```bash
cd /mnt/c/Users/Manu/Documents/DEV/mon-projet
```

**✅ RAPIDE (natif WSL) :**
```bash
cd ~/Documents/DEV/mon-projet
```

**Pourquoi ?**
- `/mnt/c/` = Accès cross-filesystem (Windows NTFS → WSL EXT4)
- `~/` = Natif WSL EXT4 (pas de translation)

---

### Piège 6 : Line Endings CRLF (Windows) vs LF (Linux)

**Symptôme :**
```bash
git diff
# warning: LF will be replaced by CRLF
```

**Solution (déjà fait en Phase 2.4) :**
```bash
git config --global core.autocrlf input
```

---

## 🔍 TROUBLESHOOTING

### Problème 1 : "claude: command not found"

**Cause :** Claude CLI pas dans PATH

**Solution :**
```bash
# Vérifier installation
which claude
# (vide)

# Réinstaller
curl -fsSL https://claude.ai/install.sh | sh

# Reload shell
source ~/.bashrc

# Vérifier
claude --version
```

---

### Problème 2 : "MCP server not found: context7"

**Cause :** MCP pas installé ou pnpm pas disponible

**Solution :**
```bash
# Vérifier pnpm
which pnpm
# /home/manu/.nvm/versions/node/v20.x.x/bin/pnpm

# Si vide, installer pnpm
npm install -g pnpm

# Réinstaller Context7
claude mcp add context7 "pnpm" "dlx" "@upstash/context7-mcp" --scope user

# Vérifier
claude mcp list
```

---

### Problème 3 : "Tool 'Bash' is blocked by permissions"

**Cause :** Whitelist restrictive dans `.claude/settings.json`

**Solution :**
```bash
# Supprimer settings.json
rm .claude/settings.json

# OU autoriser tous outils
cat > .claude/settings.json <<EOF
{
  "permissions": {
    "allow": ["Bash", "Read", "Edit", "Write", "Grep", "Glob", "WebFetch", "WebSearch", "Task"]
  }
}
EOF

# Redémarrer Claude
exit
claude
```

---

### Problème 4 : "No MCP servers configured" après `claude mcp list`

**Cause :** Aucun MCP installé (NORMAL si pas installé Context7/ESLint)

**Solution :**

**Si tu VEUX MCP :**
```bash
# Installer Context7
claude mcp add context7 "pnpm" "dlx" "@upstash/context7-mcp" --scope user
```

**Si tu NE VEUX PAS MCP :**
→ Ignorer, MCP sont optionnels pour workflow de base

---

### Problème 5 : Git clone échoue "Permission denied"

**Cause :** GitHub auth pas configuré

**Solution :**
```bash
# Re-login GitHub
gh auth login

# Vérifier
gh auth status

# Si "Logged in" → OK
# Sinon → Refaire OAuth workflow
```

---

## ✅ CHECKLIST VALIDATION INSTALLATION VIERGE

### Environnement de Base

- [ ] WSL2 installé : `wsl --version` → 2.x.x
- [ ] Ubuntu 22.04 : `cat /etc/os-release` → Ubuntu 22.04 LTS
- [ ] Node.js 20+ : `node --version` → v20.x.x
- [ ] pnpm installé : `pnpm --version` → 8.x.x
- [ ] Git configuré : `git config --list` → user.name, user.email présents
- [ ] GitHub CLI auth : `gh auth status` → Logged in
- [ ] Claude Code CLI : `claude --version` → v1.x.x

### Documentation Essentielle

- [ ] Fichiers copiés :
  - [ ] `~/Documents/DEV/archon-orchestrator/START-HERE.md`
  - [ ] `~/Documents/DEV/archon-orchestrator/CLAUDE.md`
  - [ ] `~/Documents/DEV/archon-orchestrator/README.md`
  - [ ] `~/Documents/DEV/archon-orchestrator/docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md`
  - [ ] `~/Documents/DEV/archon-orchestrator/docs/PROCESS-TDD.md`

### MCP Configuration (Optionnel)

- [ ] Context7 installé : `claude mcp list` → context7: ✓ Connected
- [ ] ESLint installé (optionnel) : `claude mcp list` → eslint: ✓ Connected
- [ ] **AUCUN fichier `.claude/mcp.json` édité manuellement** ✅

### Test End-to-End

- [ ] Projet test créé : `~/Documents/DEV/test-windows-clean`
- [ ] Claude lancé : `cd test-windows-clean && claude` → Démarre sans erreur
- [ ] Tool Bash fonctionne : Claude peut exécuter `echo "test"`
- [ ] Tool Write fonctionne : Claude peut créer fichier
- [ ] Tool Read fonctionne : Claude peut lire fichier
- [ ] MCP Context7 fonctionne (si installé) : Claude peut chercher docs

### Validation "Clean" (Pas de pollution)

- [ ] **AUCUN** dossier `.claude/agents/` présent (agents V4 créés à la demande)
- [ ] **AUCUN** fichier `.claude/mcp.json` édité manuellement
- [ ] **AUCUN** whitelist restrictive dans `.claude/settings.json`
- [ ] **AUCUN** script custom copié (installation manuelle uniquement)
- [ ] **AUCUN** fichier `archive-*/` présent (docs obsolètes)

---

## 📚 DOCUMENTATION RÉFÉRENCE (Windows 11)

### Fichiers Essentiels Copiés

| Fichier | Localisation | Quand Lire |
|---------|--------------|------------|
| **START-HERE.md** | `~/Documents/DEV/archon-orchestrator/` | Premier lancement Claude |
| **CLAUDE.md** | `~/Documents/DEV/archon-orchestrator/` | Avant chaque session (anti-hallucination) |
| **WORKFLOW-FINAL-V4** | `~/Documents/DEV/archon-orchestrator/docs/` | Setup nouveau projet |
| **PROCESS-TDD.md** | `~/Documents/DEV/archon-orchestrator/docs/` | Avant écrire tests |
| **README.md** | `~/Documents/DEV/archon-orchestrator/` | Overview stack tech |

### Commandes Utiles Windows 11 + WSL2

```bash
# Ouvrir Windows Terminal → Automatiquement dans WSL2
# (Aucune config nécessaire après wsl --install)

# Voir version WSL
wsl.exe --version

# Lister distributions WSL installées
wsl --list --verbose

# Redémarrer WSL (si problème)
wsl --shutdown
# Puis rouvrir Windows Terminal

# Accéder fichiers Windows depuis WSL
cd /mnt/c/Users/Manu/Downloads

# Accéder fichiers WSL depuis Windows Explorer
# → Taper dans barre adresse : \\wsl$\Ubuntu\home\manu\Documents\DEV

# Ouvrir VS Code dans WSL
code ~/Documents/DEV/test-windows-clean
# (Nécessite extension "WSL" installée dans VS Code)
```

---

## 🎯 PROCHAINES ÉTAPES

**Après installation vierge validée :**

1. **Lire docs essentielles** :
   - [ ] `START-HERE.md` (quick start)
   - [ ] `WORKFLOW-FINAL-V4-MULTI-DEVICE.md` (workflow complet)
   - [ ] `PROCESS-TDD.md` (guide TDD)

2. **Créer premier projet** :
   ```bash
   mkdir -p ~/Documents/DEV/mon-premier-projet
   cd ~/Documents/DEV/mon-premier-projet
   git init
   claude
   # Suivre workflow standard (constitution → specify → plan → tasks → implement)
   ```

3. **Tester Spec-Kit (si templates copiés)** :
   - Si tu veux tester Spec-Kit V4, copier `.claude/commands/*.md` depuis Mac
   - Sinon, workflow manuel (demander à Claude directement)

4. **Setup GitHub Actions + Jules** (optionnel) :
   - Voir `WORKFLOW-FINAL-V4-MULTI-DEVICE.md` section "Phase 2: Setup GitHub"
   - Nécessite OAuth token : `gh auth token`

---

## 📊 COMPARAISON INSTALLATION

| Aspect | Mac (Avant) | Windows 11 Clean (Après) |
|--------|-------------|--------------------------|
| **OS Base** | macOS (natif Unix) | WSL2 Ubuntu (Unix-like) |
| **Package Manager** | Homebrew | apt + nvm |
| **Node.js** | brew install node | nvm install 20 |
| **Claude Config** | ~/Library/Application Support/Claude/ | ~/.config/Claude/ |
| **MCP Setup** | CLI (éviter manual) | CLI UNIQUEMENT |
| **Agents** | Aucun (créés à la demande) | Aucun (créés à la demande) |
| **Whitelist Tools** | Aucune restriction | Aucune restriction |
| **Pollution Config** | Fichiers obsolètes présents | CLEAN (aucun fichier parasite) |

---

**Version** : 1.0
**Date** : 2025-10-11
**Status** : ✅ READY FOR CLEAN INSTALL
**Test** : Installation vierge Windows 11 sans pollution config

*Objectif : Environnement propre, sans pièges MCP/whitelist/pnpm* 🪟✨
