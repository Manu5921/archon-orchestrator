# 💻 Migration Vers Nouveau PC - Guide Complet

**Version**: 1.0
**Date**: 2025-10-10
**Scope**: Setup Claude Code + Spec-Kit V4 sur nouveau matériel (portable)
**Audience**: Solopreneur migrant de Mac 24/7 vers nouveau PC

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'Ensemble](#vue-densemble)
2. [Fichiers à Copier](#fichiers-à-copier)
3. [Options de Migration](#options-de-migration)
4. [Setup Nouveau PC (Step-by-Step)](#setup-nouveau-pc-step-by-step)
5. [Configuration Spécifique](#configuration-spécifique)
6. [Validation Post-Migration](#validation-post-migration)
7. [Troubleshooting](#troubleshooting)
8. [Checklist Complète](#checklist-complète)

---

## 🎯 VUE D'ENSEMBLE

### Objectif

Migrer l'environnement Claude Code + Spec-Kit V4 vers un nouveau PC portable en préservant :
- ✅ Workflow Spec-Kit V4 complet (/constitution → /specify → /plan → /tasks → /implement)
- ✅ Templates essentiels (.claude/commands/, .specify/memory/)
- ✅ Documentation workflow (START-HERE.md, WORKFLOW-FINAL-V4, PROCESS-TDD.md)
- ✅ Configuration MCP (Context7, ESLint)
- ✅ Accès GitHub (OAuth pour Jules Security)

### Ce Qui Change vs Mac 24/7

| Aspect | Mac 24/7 (Avant) | Nouveau PC Portable (Après) |
|--------|------------------|------------------------------|
| **Execution** | Local 24/7 (toujours disponible) | Local quand portable allumé |
| **GitHub Actions** | Optionnel (fallback rare) | Plus fréquent (si portable éteint) |
| **Monitoring** | Terminal Mac + mobile | Terminal portable + mobile |
| **Setup** | One-time (déjà fait) | Refaire sur nouveau PC |

**Note** : Workflow V4 reste identique (Mac 24/7 + mobile monitoring), juste changement de matériel.

---

## 📂 FICHIERS À COPIER

### Option 1 : Copier TOUT archon-orchestrator (Simple)

**Taille** : ~50-100 MB (avec .git/)
**Temps** : 5 min
**Méthode** : Git clone (RECOMMANDÉ)

```bash
# Sur nouveau PC
cd ~/Documents/DEV
git clone https://github.com/USER/archon-orchestrator.git
cd archon-orchestrator
git pull origin main  # Dernière version
```

**Avantages** :
- ✅ Historique git complet (git blame, git log)
- ✅ Updates futures faciles (git pull)
- ✅ Tout inclus (docs, templates, guides)

**Inconvénients** :
- ⚠️ Inclut docs obsolètes (archive-docs-obsolete-*/)
- ⚠️ Requiert accès GitHub

---

### Option 2 : Copier Templates Essentiels Uniquement (Léger)

**Taille** : ~1-2 MB (templates + docs clés)
**Temps** : 10 min
**Méthode** : Copie sélective

#### Fichiers CRITIQUES (Minimum Absolu)

```bash
# Sur Mac actuel
cd ~/Documents/DEV/archon-orchestrator

# Créer archive des essentiels
tar -czf ~/Downloads/claude-code-essentials.tar.gz \
  .claude/commands/*.md \
  .specify/memory/constitution-template.md \
  START-HERE.md \
  CLAUDE.md \
  docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md \
  docs/PROCESS-TDD.md \
  docs/ZERO-TRUST.md \
  docs/CONTEXT-MANAGEMENT-BEST-PRACTICES.md \
  README.md

# Transférer claude-code-essentials.tar.gz sur nouveau PC
# (USB, Google Drive, AirDrop, etc.)
```

#### Sur Nouveau PC

```bash
mkdir -p ~/Documents/DEV/archon-orchestrator
cd ~/Documents/DEV/archon-orchestrator
tar -xzf ~/Downloads/claude-code-essentials.tar.gz
```

**Avantages** :
- ✅ Léger (~1-2 MB vs 50 MB)
- ✅ Pas besoin GitHub access
- ✅ Juste ce qui est nécessaire

**Inconvénients** :
- ❌ Pas d'historique git
- ❌ Updates manuelles (re-copier si changements)

---

### Détail des Fichiers par Priorité

| Fichier/Dossier | Taille | Priorité | Raison |
|-----------------|--------|----------|--------|
| **`.claude/commands/`** | ~50 KB | 🔥 CRITIQUE | Commandes Spec-Kit (/speckit.constitution, /specify, /plan, /tasks, /implement, /analyze, /checklist, /design, /agents) |
| **`.specify/memory/`** | ~10 KB | 🔥 CRITIQUE | Template constitution.md (governance projet) |
| **`START-HERE.md`** | ~15 KB | ⭐ IMPORTANT | Point d'entrée workflow V4 (lire en premier) |
| **`CLAUDE.md`** | ~25 KB | ⭐ IMPORTANT | Instructions Claude Code (anti-hallucination, workflow validé) |
| **`docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md`** | ~45 KB | ⭐ IMPORTANT | Source de vérité workflow (Mac 24/7 + mobile monitoring) |
| **`docs/PROCESS-TDD.md`** | ~70 KB | ⭐ IMPORTANT | Guide TDD complet (RED-GREEN-REFACTOR, anti-patterns) |
| **`docs/ZERO-TRUST.md`** | ~30 KB | 🟡 UTILE | Quality gates P0-P4 (Build, Lint, Tests, Docs, Performance) |
| **`docs/CONTEXT-MANAGEMENT-BEST-PRACTICES.md`** | ~20 KB | 🟡 UTILE | Gestion contexte 200K tokens |
| **`README.md`** | ~10 KB | 🟡 UTILE | Overview projet |
| **`.git/`** | ~1-5 MB | 🔵 OPTIONNEL | Historique git (utile si git clone) |
| **`archive-docs-obsolete-*/`** | ~500 KB | ❌ SKIP | Docs obsolètes V2/V3 (ne pas copier) |
| **`docs/RETOUR-EXPERIENCE-*.md`** | ~200 KB | ❌ SKIP | Post-mortems historiques (optionnel) |
| **`docs/LESSONS-LEARNED-*.md`** | ~50 KB | 🟡 UTILE | Leçons apprises (TDD deviation, etc.) |

---

## 🚀 OPTIONS DE MIGRATION

### Comparaison

| Option | Taille | Temps | Complexité | Avantages | Recommandé Pour |
|--------|--------|-------|------------|-----------|-----------------|
| **A. Git clone complet** | ~50 MB | 3 min | ⭐ Simple | Updates futures (git pull), historique complet | ✅ Accès GitHub disponible |
| **B. Copie templates essentiels** | ~2 MB | 10 min | ⭐⭐ Moyen | Léger, juste nécessaire | Pas accès GitHub |
| **C. Script migration auto** | ~2 MB | 5 min | ⭐⭐⭐ Avancé | Automatique, reproductible | Power users |

**Recommandation** : **Option A (Git clone)** si accès GitHub, sinon **Option B (Copie sélective)**.

---

## 🛠️ SETUP NOUVEAU PC (STEP-BY-STEP)

### Prérequis

- [ ] Nouveau PC (macOS, Linux, ou Windows WSL)
- [ ] Connexion Internet
- [ ] Droits admin (pour installations)
- [ ] Compte GitHub (si Option A)

---

### Étape 1 : Environnement de Base

#### macOS

```bash
# 1. Installer Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Installer Node.js + pnpm
brew install node pnpm

# 3. Installer Git
brew install git
git config --global user.name "Ton Nom"
git config --global user.email "ton@email.com"

# 4. Installer GitHub CLI
brew install gh
gh auth login  # OAuth setup (suivre prompts)

# 5. Installer Claude Code CLI
curl -fsSL https://claude.ai/install.sh | sh

# 6. Vérifier installations
node --version    # v20+
pnpm --version    # v8+
git --version     # v2.40+
gh --version      # v2.40+
claude --version  # Latest
```

#### Linux (Ubuntu/Debian)

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Installer Node.js (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# 3. Installer pnpm
npm install -g pnpm

# 4. Installer Git
sudo apt install git -y
git config --global user.name "Ton Nom"
git config --global user.email "ton@email.com"

# 5. Installer GitHub CLI
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh -y
gh auth login

# 6. Installer Claude Code CLI
curl -fsSL https://claude.ai/install.sh | sh
```

#### Windows (WSL)

```bash
# 1. Installer WSL (PowerShell admin)
wsl --install

# 2. Redémarrer Windows
# 3. Ouvrir Ubuntu WSL
# 4. Suivre instructions Linux ci-dessus
```

---

### Étape 2 : Migration archon-orchestrator

#### Option A : Git Clone (RECOMMANDÉ)

```bash
# 1. Créer structure dossiers
mkdir -p ~/Documents/DEV/clients
cd ~/Documents/DEV

# 2. Clone archon-orchestrator
git clone https://github.com/USER/archon-orchestrator.git
cd archon-orchestrator

# 3. Vérifier dernière version
git pull origin main
git log --oneline -5  # Voir derniers commits

# 4. Lire documentation
claude START-HERE.md  # Ouvre dans Claude Code
```

#### Option B : Copie Templates Essentiels

```bash
# 1. Créer structure
mkdir -p ~/Documents/DEV/archon-orchestrator
cd ~/Documents/DEV/archon-orchestrator

# 2. Extraire archive (copiée depuis Mac actuel)
tar -xzf ~/Downloads/claude-code-essentials.tar.gz

# 3. Vérifier fichiers
ls -la .claude/commands/  # speckit.*.md
ls -la .specify/memory/   # constitution-template.md
ls -la docs/              # WORKFLOW-FINAL-V4, PROCESS-TDD, etc.

# 4. Lire documentation
claude START-HERE.md
```

---

### Étape 3 : Setup Template Projet

**But** : Créer template réutilisable pour nouveaux projets

```bash
# 1. Créer dossier templates
mkdir -p ~/Documents/DEV/clients/_templates
cd ~/Documents/DEV/clients/_templates

# 2. Copier templates essentiels
cp -r ~/Documents/DEV/archon-orchestrator/.claude .
cp -r ~/Documents/DEV/archon-orchestrator/.specify .

# 3. Créer script setup automatique
cat > setup-project.sh <<'EOF'
#!/bin/bash

# Usage: ./setup-project.sh nom-du-projet

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
  echo "❌ Usage: ./setup-project.sh nom-du-projet"
  exit 1
fi

echo "🚀 Creating project: $PROJECT_NAME"

# 1. Créer dossier projet
mkdir -p ~/Documents/DEV/clients/$PROJECT_NAME
cd ~/Documents/DEV/clients/$PROJECT_NAME

# 2. Copier templates Spec-Kit
cp -r ~/Documents/DEV/clients/_templates/.claude .
cp -r ~/Documents/DEV/clients/_templates/.specify .

# 3. Initialiser git
git init
git add .claude/ .specify/
git commit -m "chore: init project with Spec-Kit V4 templates

🎯 Project: $PROJECT_NAME
🛠️ Templates: Spec-Kit V4 (archon-orchestrator)
📋 Workflow: /constitution → /specify → /plan → /tasks → /implement

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# 4. Créer README initial
cat > README.md <<READMEEOF
# $PROJECT_NAME

**Created**: $(date +%Y-%m-%d)
**Workflow**: Spec-Kit V4 (Mac 24/7 + GitHub Actions + Jules Security)

## Quick Start

\`\`\`bash
# 1. Planning (30 min)
claude
/speckit.constitution  # → .specify/memory/constitution.md
/speckit.specify       # → specs/001-mvp/spec.md
/speckit.clarify       # → Q&A iteration
/speckit.plan          # → specs/001-mvp/plan.md
/speckit.tasks         # → specs/001-mvp/tasks.md

# 2. Implementation (3-4h)
/implement

# 3. Review + Merge (15 min)
gh pr view 1
gh pr merge 1 --squash
\`\`\`

## Documentation

- Workflow V4: ~/Documents/DEV/archon-orchestrator/docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md
- TDD Process: ~/Documents/DEV/archon-orchestrator/docs/PROCESS-TDD.md
- Start Here: ~/Documents/DEV/archon-orchestrator/START-HERE.md
READMEEOF

git add README.md
git commit -m "docs: add project README"

echo "✅ Project $PROJECT_NAME created successfully!"
echo ""
echo "📂 Location: ~/Documents/DEV/clients/$PROJECT_NAME"
echo "🚀 Next steps:"
echo "   cd ~/Documents/DEV/clients/$PROJECT_NAME"
echo "   claude"
echo "   /speckit.constitution"
EOF

chmod +x setup-project.sh

echo "✅ Template project setup complete!"
echo "🚀 Usage: ./setup-project.sh mon-nouveau-projet"
```

**Tester le template** :

```bash
cd ~/Documents/DEV/clients
./setup-project.sh test-migration
cd test-migration

# Vérifier structure
ls -la .claude/commands/  # speckit.*.md présents
ls -la .specify/memory/   # constitution-template.md présent

# Tester workflow
claude
/speckit.constitution  # Devrait fonctionner
```

---

### Étape 4 : Configuration MCP Servers

**MCP** (Model Context Protocol) = Extensions Claude Code (Context7, ESLint, etc.)

#### Localisation fichier config

```bash
# macOS
~/Library/Application Support/Claude/mcp.json

# Linux
~/.config/Claude/mcp.json

# Windows WSL
~/.config/Claude/mcp.json
```

#### Option A : Copier config existante (Si identique OS)

```bash
# Sur Mac actuel
tar -czf ~/Downloads/mcp-config.tar.gz \
  ~/Library/Application\ Support/Claude/mcp.json

# Transférer sur nouveau PC

# Sur nouveau PC (macOS)
mkdir -p ~/Library/Application\ Support/Claude
cd ~/Library/Application\ Support/Claude
tar -xzf ~/Downloads/mcp-config.tar.gz
```

#### Option B : Setup manuel (RECOMMANDÉ)

**1. Context7 MCP** (Documentation juste-in-time)

```bash
# Installer Context7
npx @context7/mcp-server init

# Vérifier installation
which npx  # Doit retourner un path
```

**2. ESLint MCP** (Linting inline - optionnel)

```bash
npm install -g @modelcontextprotocol/server-eslint
```

**3. Éditer mcp.json**

```bash
# Créer/éditer fichier
mkdir -p ~/Library/Application\ Support/Claude
nano ~/Library/Application\ Support/Claude/mcp.json
```

**Contenu minimal** :

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"],
      "env": {}
    }
  }
}
```

**Contenu complet** (avec ESLint) :

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"],
      "env": {}
    },
    "eslint": {
      "command": "mcp-server-eslint",
      "args": [],
      "env": {}
    }
  }
}
```

**4. Redémarrer Claude Code**

```bash
# Tuer processus Claude Code (si lancé)
pkill -f claude

# Relancer
claude

# Vérifier MCP chargés
# Dans Claude Code, taper: /
# Devrait montrer commandes + outils MCP (mcp__context7__*, mcp__eslint__*)
```

---

### Étape 5 : GitHub OAuth (Jules Security)

**Jules Security** = GitHub Action qui scanne sécurité (asynchrone, 0 temps supplémentaire)

#### Setup OAuth GitHub

```bash
# 1. Login GitHub CLI
gh auth login

# Prompts:
# ? What account do you want to log into? → GitHub.com
# ? What is your preferred protocol? → HTTPS
# ? Authenticate Git with your GitHub credentials? → Yes
# ? How would you like to authenticate? → Login with a web browser

# 2. Copier code one-time
# → Ouvrir navigateur → Coller code → Autoriser

# 3. Vérifier authentication
gh auth status
# ✓ Logged in to github.com as USER (oauth_token)
```

#### Créer Token OAuth pour Claude Code

```bash
# 1. Générer token OAuth
gh auth token

# Copier token (exemple: gho_xxxxxxxxxxxxxxxxxxxx)

# 2. Sauvegarder dans variable env (optionnel)
echo "export CLAUDE_OAUTH_TOKEN=gho_xxxxxxxxxxxxxxxxxxxx" >> ~/.zshrc
source ~/.zshrc

# 3. Tester access
gh repo list  # Devrait lister tes repos
```

#### Configurer Jules Security pour Nouveaux Projets

**Jules Security sera configuré automatiquement lors de `/implement`** (GitHub Actions workflow).

Pour configurer manuellement :

```bash
cd ~/Documents/DEV/clients/mon-projet

# 1. Copier workflow Jules
mkdir -p .github/workflows
cp ~/Documents/DEV/archon-orchestrator/.github/workflows/claude-max-implementation.yml \
   .github/workflows/

# 2. Créer secret GitHub
echo $CLAUDE_OAUTH_TOKEN | gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo USER/mon-projet

# 3. Créer label "run-claude"
gh label create run-claude --color "0E8A16" --repo USER/mon-projet

# 4. Commit workflow
git add .github/workflows/
git commit -m "feat: add GitHub Actions + Jules Security"
git push
```

---

## ✅ VALIDATION POST-MIGRATION

### Checklist Validation

```bash
# 1. Environnement de base
node --version    # ✅ v20+
pnpm --version    # ✅ v8+
git --version     # ✅ v2.40+
gh --version      # ✅ v2.40+
claude --version  # ✅ Latest

# 2. archon-orchestrator présent
ls ~/Documents/DEV/archon-orchestrator/START-HERE.md  # ✅ Exists
ls ~/Documents/DEV/archon-orchestrator/.claude/commands/  # ✅ speckit.*.md

# 3. MCP servers configurés
cat ~/Library/Application\ Support/Claude/mcp.json  # ✅ context7 présent

# 4. GitHub OAuth fonctionnel
gh auth status  # ✅ Logged in

# 5. Template projet fonctionnel
cd ~/Documents/DEV/clients
./setup-project.sh test-validation
cd test-validation
claude  # ✅ Lance sans erreur
# Dans Claude: /speckit.constitution  # ✅ Commande reconnue
```

---

### Test End-to-End (Workflow Complet)

```bash
# 1. Créer projet test
cd ~/Documents/DEV/clients
./setup-project.sh test-e2e-workflow
cd test-e2e-workflow

# 2. Lancer Claude Code
claude

# 3. Workflow Spec-Kit (Planning - 5 min)
/speckit.constitution
# → Devrait créer .specify/memory/constitution.md
# → Vérifier: cat .specify/memory/constitution.md

/speckit.specify
# → Devrait créer specs/001-mvp/spec.md
# → Vérifier: cat specs/001-mvp/spec.md

# 4. Vérifier MCP Context7
# Dans constitution.md, si mention Next.js:
# Claude devrait proposer: "Voulez-vous que je consulte docs Next.js via Context7?"

# 5. Test GitHub (si repo créé)
git remote add origin https://github.com/USER/test-e2e-workflow.git
git push -u origin main
gh repo view  # ✅ Devrait montrer repo

# 6. Cleanup
cd ~/Documents/DEV/clients
rm -rf test-e2e-workflow
```

**Résultat attendu** : ✅ Toutes les commandes fonctionnent, workflow identique à Mac actuel.

---

## 🔧 CONFIGURATION SPÉCIFIQUE

### Différences macOS vs Linux vs Windows

| Aspect | macOS | Linux | Windows WSL |
|--------|-------|-------|-------------|
| **Package manager** | Homebrew | apt/yum | apt (via WSL) |
| **Claude config** | `~/Library/Application Support/Claude/` | `~/.config/Claude/` | `~/.config/Claude/` |
| **Path separator** | `/` | `/` | `/` (dans WSL) |
| **Claude CLI install** | `curl ... \| sh` | `curl ... \| sh` | `curl ... \| sh` |

**Note** : Workflow identique sur tous OS (grâce à Node.js + Claude Code CLI cross-platform).

---

### Variables Environnement Recommandées

```bash
# Ajouter à ~/.zshrc (macOS) ou ~/.bashrc (Linux)

# Claude OAuth Token (pour Jules Security)
export CLAUDE_OAUTH_TOKEN=gho_xxxxxxxxxxxxxxxxxxxx

# GitHub CLI default repo
export GH_REPO=USER/archon-orchestrator

# Spec-Kit default path
export ARCHON_PATH=~/Documents/DEV/archon-orchestrator

# Alias utiles
alias archon='cd $ARCHON_PATH'
alias newproject='cd ~/Documents/DEV/clients && ./setup-project.sh'

# Reload config
source ~/.zshrc  # macOS
source ~/.bashrc # Linux
```

---

## 🐛 TROUBLESHOOTING

### Problème 1 : "Command not found: claude"

**Cause** : Claude CLI pas dans PATH

**Solution** :

```bash
# Vérifier installation
which claude

# Si vide, réinstaller
curl -fsSL https://claude.ai/install.sh | sh

# Ajouter au PATH (si nécessaire)
echo 'export PATH="$HOME/.claude/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

---

### Problème 2 : "MCP server not found: context7"

**Cause** : MCP config incorrecte ou npx pas installé

**Solution** :

```bash
# 1. Vérifier npx
which npx  # Doit retourner path

# 2. Tester Context7 manuellement
npx -y @context7/mcp-server

# 3. Vérifier mcp.json
cat ~/Library/Application\ Support/Claude/mcp.json
# Doit contenir "context7" avec command "npx"

# 4. Redémarrer Claude Code
pkill -f claude
claude
```

---

### Problème 3 : "gh: command not found"

**Cause** : GitHub CLI pas installé

**Solution** :

```bash
# macOS
brew install gh

# Linux (Ubuntu/Debian)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Vérifier
gh --version
```

---

### Problème 4 : "/speckit.constitution not found"

**Cause** : Templates .claude/commands/ pas copiés ou Claude Code pas dans bon dossier

**Solution** :

```bash
# 1. Vérifier présence templates
ls .claude/commands/speckit.constitution.md
# Si erreur "No such file" → Templates manquants

# 2. Copier templates
cp -r ~/Documents/DEV/archon-orchestrator/.claude .
cp -r ~/Documents/DEV/archon-orchestrator/.specify .

# 3. Vérifier Claude Code dans bon dossier
pwd  # Doit être dans projet (ex: ~/Documents/DEV/clients/mon-projet)

# 4. Redémarrer Claude Code
exit  # Quitter session
claude  # Relancer
```

---

### Problème 5 : "GitHub OAuth token expired"

**Cause** : Token OAuth expiré (après 90 jours ou révoqué)

**Solution** :

```bash
# 1. Re-login GitHub CLI
gh auth logout
gh auth login

# 2. Générer nouveau token
gh auth token

# 3. Update variable env
echo "export CLAUDE_OAUTH_TOKEN=$(gh auth token)" >> ~/.zshrc
source ~/.zshrc

# 4. Re-créer secrets GitHub (pour chaque projet)
cd ~/Documents/DEV/clients/mon-projet
echo $CLAUDE_OAUTH_TOKEN | gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo USER/mon-projet
```

---

## 📋 CHECKLIST COMPLÈTE

### Avant Migration (Sur Mac Actuel)

- [ ] **Commit tous changements** : `cd ~/Documents/DEV/archon-orchestrator && git status` (doit être clean)
- [ ] **Push vers GitHub** : `git push origin main`
- [ ] **Vérifier projets clients** : Commit + push tous projets en cours
- [ ] **Backup MCP config** : `tar -czf ~/Downloads/mcp-config.tar.gz ~/Library/Application\ Support/Claude/mcp.json`
- [ ] **Export GitHub token** : `gh auth token > ~/Downloads/gh-token.txt` (sécurisé !)
- [ ] **Note versions** : `node --version && pnpm --version && gh --version` (pour comparaison)

---

### Pendant Migration (Sur Nouveau PC)

#### Phase 1 : Environnement (15 min)

- [ ] **Installer Homebrew** (macOS) ou apt (Linux)
- [ ] **Installer Node.js** : `brew install node` (macOS) ou `nvm install 20` (Linux)
- [ ] **Installer pnpm** : `brew install pnpm` ou `npm install -g pnpm`
- [ ] **Installer Git** : `brew install git` ou `sudo apt install git`
- [ ] **Config Git** : `git config --global user.name "Ton Nom"` + email
- [ ] **Installer GitHub CLI** : `brew install gh` ou [instructions Linux](https://github.com/cli/cli#installation)
- [ ] **Installer Claude Code CLI** : `curl -fsSL https://claude.ai/install.sh | sh`
- [ ] **Vérifier versions** : `node --version && pnpm --version && gh --version && claude --version`

---

#### Phase 2 : archon-orchestrator (5 min)

**Option A : Git Clone**
- [ ] `mkdir -p ~/Documents/DEV && cd ~/Documents/DEV`
- [ ] `git clone https://github.com/USER/archon-orchestrator.git`
- [ ] `cd archon-orchestrator && git pull origin main`
- [ ] `ls -la .claude/commands/` (vérifier templates présents)

**Option B : Copie Templates**
- [ ] `mkdir -p ~/Documents/DEV/archon-orchestrator`
- [ ] Transférer `claude-code-essentials.tar.gz` (depuis Mac actuel)
- [ ] `tar -xzf ~/Downloads/claude-code-essentials.tar.gz`
- [ ] `ls -la .claude/commands/` (vérifier templates présents)

---

#### Phase 3 : Template Projet (10 min)

- [ ] `mkdir -p ~/Documents/DEV/clients/_templates`
- [ ] `cp -r ~/Documents/DEV/archon-orchestrator/.claude ~/Documents/DEV/clients/_templates/`
- [ ] `cp -r ~/Documents/DEV/archon-orchestrator/.specify ~/Documents/DEV/clients/_templates/`
- [ ] Créer script `setup-project.sh` (copier code depuis section "Étape 3")
- [ ] `chmod +x ~/Documents/DEV/clients/setup-project.sh`
- [ ] Tester : `cd ~/Documents/DEV/clients && ./setup-project.sh test-template`
- [ ] Vérifier : `ls test-template/.claude/commands/` (templates présents)
- [ ] Cleanup : `rm -rf test-template`

---

#### Phase 4 : MCP Servers (10 min)

- [ ] **Context7** : `npx @context7/mcp-server init` (optionnel si auto-détecté)
- [ ] **ESLint** (optionnel) : `npm install -g @modelcontextprotocol/server-eslint`
- [ ] Créer/éditer `mcp.json` :
  - macOS : `nano ~/Library/Application\ Support/Claude/mcp.json`
  - Linux : `nano ~/.config/Claude/mcp.json`
- [ ] Copier config minimal (voir section "Étape 4 - Option B")
- [ ] Sauvegarder : Ctrl+O, Enter, Ctrl+X
- [ ] Redémarrer Claude : `pkill -f claude && claude`
- [ ] Vérifier MCP : Dans Claude, taper `/` → Voir `mcp__context7__*` tools

---

#### Phase 5 : GitHub OAuth (5 min)

- [ ] **Login GitHub CLI** : `gh auth login`
- [ ] Choisir : GitHub.com → HTTPS → Yes (Git credentials) → Login with browser
- [ ] Autoriser dans navigateur
- [ ] Vérifier : `gh auth status` (doit montrer "Logged in as USER")
- [ ] Générer token : `gh auth token` (copier output)
- [ ] Sauvegarder env var : `echo "export CLAUDE_OAUTH_TOKEN=$(gh auth token)" >> ~/.zshrc`
- [ ] Reload : `source ~/.zshrc`
- [ ] Tester : `gh repo list` (doit lister tes repos)

---

### Après Migration (Validation)

#### Validation Environnement (5 min)

- [ ] `node --version` → v20+
- [ ] `pnpm --version` → v8+
- [ ] `git --version` → v2.40+
- [ ] `gh --version` → v2.40+
- [ ] `claude --version` → Latest
- [ ] `gh auth status` → "Logged in"
- [ ] `cat ~/Library/Application\ Support/Claude/mcp.json` → context7 présent

---

#### Validation Workflow (15 min)

- [ ] **Créer projet test** : `cd ~/Documents/DEV/clients && ./setup-project.sh test-e2e`
- [ ] **Vérifier structure** :
  - [ ] `ls test-e2e/.claude/commands/` → speckit.*.md présents
  - [ ] `ls test-e2e/.specify/memory/` → constitution-template.md présent
- [ ] **Lancer Claude** : `cd test-e2e && claude`
- [ ] **Test commandes Spec-Kit** :
  - [ ] `/speckit.constitution` → Crée `.specify/memory/constitution.md`
  - [ ] Vérifier : `cat .specify/memory/constitution.md` (contenu correct)
  - [ ] `/speckit.specify` → Crée `specs/001-mvp/spec.md`
  - [ ] Vérifier : `cat specs/001-mvp/spec.md` (contenu correct)
- [ ] **Test MCP Context7** (optionnel) :
  - [ ] Mentionner "Next.js" dans constitution.md
  - [ ] Claude devrait proposer : "Consulter docs Next.js via Context7 ?"
- [ ] **Test GitHub** (si repo créé) :
  - [ ] `git remote add origin https://github.com/USER/test-e2e.git`
  - [ ] `git push -u origin main`
  - [ ] `gh repo view` → Affiche repo
- [ ] **Cleanup** : `cd .. && rm -rf test-e2e`

---

#### Migration Projets Existants (Optionnel)

Si tu as des projets en cours sur Mac actuel à migrer :

- [ ] Sur Mac actuel : `cd ~/Documents/DEV/clients/mon-projet && git push`
- [ ] Sur nouveau PC : `cd ~/Documents/DEV/clients && git clone https://github.com/USER/mon-projet.git`
- [ ] `cd mon-projet`
- [ ] Vérifier templates : `ls .claude/commands/` (si manquants, copier depuis _templates)
- [ ] `pnpm install` (installer dépendances)
- [ ] `pnpm build` (vérifier compile)
- [ ] `claude` (tester workflow)

---

## 🎯 RÉSUMÉ ULTRA-RAPIDE

**Pour migrer en 20 minutes** :

```bash
# 1. Installer environnement (10 min)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node pnpm git gh
curl -fsSL https://claude.ai/install.sh | sh
gh auth login

# 2. Clone archon-orchestrator (2 min)
mkdir -p ~/Documents/DEV && cd ~/Documents/DEV
git clone https://github.com/USER/archon-orchestrator.git

# 3. Setup template projet (5 min)
mkdir -p ~/Documents/DEV/clients/_templates
cp -r archon-orchestrator/.claude archon-orchestrator/.specify ~/Documents/DEV/clients/_templates/
# Copier setup-project.sh (voir doc)

# 4. Config MCP (2 min)
npx @context7/mcp-server init
# Éditer ~/Library/Application Support/Claude/mcp.json (ajouter context7)

# 5. Test (1 min)
cd ~/Documents/DEV/clients
./setup-project.sh test
cd test && claude
/speckit.constitution  # ✅ Doit fonctionner
```

---

## 📚 RÉFÉRENCES

- **Workflow V4 complet** : `docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md`
- **TDD Process** : `docs/PROCESS-TDD.md`
- **Start Here** : `START-HERE.md`
- **Claude Instructions** : `CLAUDE.md`
- **Troubleshooting** : `docs/TROUBLESHOOTING.md`

---

## 🚀 PROCHAINES ÉTAPES

Après migration réussie :

1. **Lire documentation** :
   - [ ] `START-HERE.md` (point d'entrée)
   - [ ] `docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md` (workflow complet)
   - [ ] `docs/PROCESS-TDD.md` (guide TDD)

2. **Créer premier projet** :
   - [ ] `./setup-project.sh mon-premier-projet`
   - [ ] Workflow Spec-Kit complet (/constitution → /implement)
   - [ ] Valider Jules Security (GitHub Actions)

3. **Optimiser setup** :
   - [ ] Ajouter alias shell (voir section "Variables Environnement")
   - [ ] Personnaliser mcp.json (ajouter autres MCP si besoin)
   - [ ] Setup pre-commit hooks (voir TODO-PROCESS-IMPROVEMENTS.md TASK 14)

---

**Document Version** : 1.0
**Last Updated** : 2025-10-10
**Author** : Claude (Sonnet 4.5) - Archon Orchestrator Session
**Status** : ✅ READY FOR MIGRATION

*Migration facile, workflow identique. Mac 24/7 → Nouveau PC portable en 20 min.* 🚀
