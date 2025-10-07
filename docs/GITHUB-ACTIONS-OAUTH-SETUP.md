# 🚀 GitHub Actions avec Claude Max OAuth - Setup Complet

**Version:** 1.0 (Validé 2025-10-07)
**Model:** Claude Sonnet 4.5
**Status:** ✅ PRODUCTION-READY (testé avec succès)

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Setup Initial (One-Time)](#setup-initial-one-time)
4. [Configuration Projet](#configuration-projet)
5. [Utilisation Mobile](#utilisation-mobile)
6. [Troubleshooting](#troubleshooting)
7. [Leçons Apprises](#leçons-apprises)

---

## 🎯 VUE D'ENSEMBLE

### Concept

Utiliser l'abonnement **Claude Max** (€100/mois) pour exécuter Claude Code dans GitHub Actions, permettant:
- ✅ Déclenchement depuis mobile Android (GitHub app)
- ✅ Exécution cloud (Mac peut s'éteindre)
- ✅ Parallélisation (3-4 clients simultanés)
- ✅ Review mobile (PRs créées automatiquement)

### Architecture

```
┌──────────────────────────────────────────────────────────┐
│ PHASE 1: Planning (Mac local - 30 min)                  │
│ • /speckit.constitution + /specify + /plan + /tasks      │
│ • git push origin main                                   │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ PHASE 2: Déclenchement (Mobile Android - 2 min)         │
│ • Créer issue: "Implement T001-T010"                     │
│ • Body: "Task range: T001-T010"                          │
│ • Label: run-claude                                      │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ PHASE 3: Exécution Cloud (GitHub Actions - 3-4h)        │
│ • Claude Code s'exécute sur VM Ubuntu                    │
│ • Utilise CLAUDE_CODE_OAUTH_TOKEN (session tokens)       │
│ • Auto-approve tools via prompt instruction              │
│ • Crée README.md, package.json, src/*, etc.              │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│ PHASE 4: Review (Mobile Android - 15 min)               │
│ • PR créée automatiquement (feature/T001-T010)           │
│ • Review code + approve + merge depuis mobile            │
└──────────────────────────────────────────────────────────┘
```

---

## ✅ PRÉREQUIS

### 1. Abonnement Claude Max

- ✅ Abonnement actif à €100/mois
- ✅ Connexion OAuth Google (pas API key)
- ✅ Claude Desktop installé localement

**Vérifier:**
```bash
# Ouvrir Claude Desktop
# Se connecter avec Google OAuth
# Vérifier que l'abonnement Max est actif
```

### 2. GitHub CLI

```bash
# Installer GitHub CLI
brew install gh

# Authentifier
gh auth login

# Vérifier
gh auth status
```

### 3. Spec-Kit

```bash
# Installer Spec-Kit
uvx --from git+https://github.com/github/spec-kit.git specify --version

# Devrait afficher: specify 0.0.18 ou plus récent
```

---

## 🔧 SETUP INITIAL (ONE-TIME)

### Étape 1: Générer OAuth Token

Dans **Claude Desktop**, exécuter:

```bash
/install-github-app
```

**Ce qui se passe:**
1. Claude Desktop génère un long-lived OAuth token
2. Token valide 7-30 jours (auto-refresh)
3. Token stocké dans keychain macOS

**Output attendu:**
```
✅ GitHub App installed successfully
🔑 Token: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
⚠️  Save this token in GitHub Secrets as CLAUDE_CODE_OAUTH_TOKEN
```

### Étape 2: Sauvegarder Token dans GitHub Secrets

**Pour un repo spécifique:**
```bash
# Remplacer YOUR_TOKEN par le token généré
echo "YOUR_TOKEN" | gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo YOUR_USERNAME/YOUR_REPO
```

**Vérifier:**
```bash
gh secret list --repo YOUR_USERNAME/YOUR_REPO
```

Devrait afficher:
```
CLAUDE_CODE_OAUTH_TOKEN  Updated YYYY-MM-DD
```

---

## 📦 CONFIGURATION PROJET

### Méthode Automatique: Script new-client.sh

**Setup templates (one-time):**
```bash
cd ~/Documents/DEV/clients
mkdir -p _templates

# Copier workflow depuis archon-orchestrator
cp ~/Documents/DEV/archon-orchestrator/.github/workflows/claude-max-implementation.yml \
   _templates/
```

**Créer nouveau projet:**
```bash
cd ~/Documents/DEV/clients
./new-client.sh my-new-project
```

Le script va:
1. ✅ Créer projet avec Spec-Kit
2. ✅ Copier workflow GitHub Actions
3. ✅ Initialiser git + créer repo GitHub
4. ✅ Demander configuration OAuth token

**Suivre les prompts:**
```
📝 Create GitHub repo 'my-new-project'? (y/n) y
✅ GitHub repo created

🔐 Configure API keys now? (y/n) y
Enter CLAUDE_CODE_OAUTH_TOKEN (starts with ghp_...):
[Paste your token]
✅ CLAUDE_CODE_OAUTH_TOKEN configured
```

### Méthode Manuelle

Si tu préfères setup manuel:

**1. Créer projet:**
```bash
cd ~/Documents/DEV/clients
uvx --from git+https://github.com/github/spec-kit.git specify init my-project
cd my-project
```

**2. Copier workflow:**
```bash
mkdir -p .github/workflows
cp ~/Documents/DEV/archon-orchestrator/.github/workflows/claude-max-implementation.yml \
   .github/workflows/
```

**3. Initialiser git:**
```bash
git init
git add .
git commit -m "docs: initial setup"
```

**4. Créer repo GitHub:**
```bash
gh repo create my-project --private --source=. --push
```

**5. Configurer secret:**
```bash
echo "YOUR_OAUTH_TOKEN" | gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo YOUR_USERNAME/my-project
```

---

## 📱 UTILISATION MOBILE

### Workflow Complet

**1. Planning (Mac - 30 min):**
```bash
cd ~/Documents/DEV/clients/my-project

/speckit.constitution
/speckit.specify
/speckit.plan
/speckit.tasks

git add .
git commit -m "docs: planning complete"
git push
```

**2. Déclenchement (Android - 2 min):**

Ouvrir GitHub app mobile:
1. Aller sur repo `my-project`
2. Issues → New Issue
3. Title: `Implement T001-T010`
4. Body: `Task range: T001-T010`
5. Labels: `run-claude`
6. Submit

**3. Monitoring (Android - optionnel):**

GitHub app → Actions → Voir le run en cours

**4. Review (Android - 15 min):**

Quand notification PR reçue:
1. Ouvrir PR depuis notification
2. Review Files changed
3. Approve + Merge squash

---

## 🔍 DÉTAILS WORKFLOW

### Fichier: `.github/workflows/claude-max-implementation.yml`

**Triggers:**
```yaml
on:
  issues:
    types: [labeled]  # Label "run-claude" ajouté
  issue_comment:
    types: [created]  # Comment "/run claude"
  workflow_dispatch:  # Trigger manuel
```

**Permissions:**
```yaml
permissions:
  contents: write       # Push code
  pull-requests: write  # Créer PR
  issues: write        # Commenter issues
```

**Étapes Clés:**

**1. Parse Task Range (ligne 58-100):**
```bash
# Extrait "T001-T010" du body de l'issue
RANGE=$(echo "$BODY" | grep -oE 'T[0-9]+-T[0-9]+' | head -1)
```

**2. Create Settings (ligne 119-145):**
```bash
mkdir -p .claude
cat > .claude/settings.json <<'EOF'
{
  "permissions": {
    "allow": [
      "Bash", "Read", "Edit", "Write", "WebFetch",
      "Grep", "Glob", "LS", "MultiEdit",
      "NotebookRead", "NotebookEdit",
      "TodoRead", "TodoWrite", "WebSearch"
    ]
  }
}
EOF
```

**3. Run Claude Code (ligne 148-171):**
```yaml
- name: Run Claude Code Implementation
  uses: anthropics/claude-code-action@v1
  with:
    claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
    github_token: ${{ secrets.GITHUB_TOKEN }}
    settings: .claude/settings.json
    claude_args: "--permission-mode bypassPermissions"
    prompt: |
      IMPORTANT: Auto-approve all tools (Bash, Read, Edit, Write, WebFetch,
      Grep, Glob, LS, MultiEdit, NotebookRead, NotebookEdit, TodoRead,
      TodoWrite, WebSearch) for automated execution.

      Implement tasks ${{ steps.parse.outputs.range }} from .specify/specs/001-mvp/tasks.md

      Instructions:
      1. Read the task definitions for range ${{ steps.parse.outputs.range }}
      2. Implement each task according to specifications
      3. Create README.md and package.json as specified
      4. Ensure all files are created with proper content
      5. Use Write tool for new files, Edit tool for modifications
      6. All tools are pre-approved - execute without asking for permission
```

**4. Create PR (ligne 176-233):**
```yaml
- uses: peter-evans/create-pull-request@v6
  with:
    branch: feature/${{ steps.parse.outputs.range }}
    title: "feat: Implement ${{ steps.parse.outputs.range }}"
```

---

## ⚠️ TROUBLESHOOTING

### Erreur: "Credit balance is too low"

**Symptôme:**
```json
{"text": "Credit balance is too low"}
```

**Cause:** Utilisation de `anthropic_api_key` au lieu de `claude_code_oauth_token`

**Fix:** Vérifier workflow ligne 151:
```yaml
claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
# PAS: anthropic_api_key
```

### Erreur: "Permission denied" sur Write/Edit

**Symptôme:**
```
Claude requested permissions to write to README.md, but you haven't granted it yet.
```

**Cause:** Instruction auto-approve manquante dans le prompt

**Fix:** Vérifier workflow ligne 156:
```yaml
prompt: |
  IMPORTANT: Auto-approve all tools (Bash, Read, Edit, Write, ...) for automated execution.
  ...
  6. All tools are pre-approved - execute without asking for permission
```

### Erreur: "Not Found" sur comment issue

**Symptôme:**
```
Error: HttpError: Not Found
url: 'https://api.github.com/repos/USERNAME//issues/31/comments'
```

**Cause:** Nom du repo vide dans context

**Fix:** Vérifier workflow ligne 255:
```javascript
const repo = context.repo.repo;  // PAS context.repo.name
```

### Workflow ne se déclenche pas

**Vérifications:**
1. Label `run-claude` existe dans repo:
   ```bash
   gh label create run-claude --description "Trigger Claude Max implementation workflow" --repo YOUR_USERNAME/YOUR_REPO
   ```

2. Workflow trigger correct (ligne 24-25):
   ```yaml
   issues:
     types: [labeled]  # PAS [opened, labeled] sinon double trigger
   ```

3. Secret configuré:
   ```bash
   gh secret list --repo YOUR_USERNAME/YOUR_REPO
   ```

### Token expiré

**Symptôme:**
```
Error: Authentication failed
```

**Cause:** OAuth token expiré (7-30 jours)

**Fix:** Régénérer token:
```bash
# Dans Claude Desktop
/install-github-app

# Mettre à jour secret
echo "NEW_TOKEN" | gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo YOUR_USERNAME/YOUR_REPO
```

---

## 📚 LEÇONS APPRISES

### 1. **Auto-Approve CRITIQUE**

L'instruction **explicite** dans le prompt est essentielle:
```yaml
IMPORTANT: Auto-approve all tools (...) for automated execution.
```

Sans cette ligne, Claude demande permission et le workflow bloque.

### 2. **Permissions Workflow vs Job-Level**

Les permissions doivent être au **workflow-level** (ligne 30-33), pas job-level:
```yaml
# ✅ CORRECT (workflow-level)
permissions:
  contents: write
  pull-requests: write

jobs:
  claude-implementation:
    runs-on: ubuntu-latest
```

### 3. **Settings.json + claude_args**

Les **deux** sont nécessaires:
- `.claude/settings.json` avec `permissions.allow` array
- `claude_args: "--permission-mode bypassPermissions"`

Un seul ne suffit pas.

### 4. **Trigger Unique**

Utiliser **uniquement** `labeled`, pas `[opened, labeled]`:
```yaml
issues:
  types: [labeled]  # Un seul trigger
```

Sinon deux runs se déclenchent simultanément et créent des conflits.

### 5. **Context Repo Name**

Dans `actions/github-script@v7`, utiliser:
```javascript
const repo = context.repo.repo;  // ✅ CORRECT
// PAS: context.repo.name (vide sur issue_comment trigger)
```

### 6. **Issue Number Extraction**

Pour supporter `issue_comment` trigger:
```javascript
const issueNumber = context?.payload?.issue?.number ??
                    context?.payload?.comment?.issue_url?.match(/\/(\d+)$/)?.[1] ??
                    null;
```

---

## 🎯 RÉSUMÉ QUICK START

**Setup (one-time):**
```bash
# 1. Générer OAuth token
/install-github-app  # Dans Claude Desktop

# 2. Setup templates
cd ~/Documents/DEV/clients
mkdir -p _templates
cp ~/Documents/DEV/archon-orchestrator/.github/workflows/claude-max-implementation.yml _templates/
```

**Nouveau projet:**
```bash
# 3. Créer projet
cd ~/Documents/DEV/clients
./new-client.sh my-project

# 4. Planning
cd my-project
/speckit.constitution
/speckit.specify
/speckit.plan
/speckit.tasks

git add . && git commit -m "docs: planning" && git push
```

**Déclenchement (mobile):**
```
GitHub app → Issues → New Issue
Title: Implement T001-T010
Body: Task range: T001-T010
Labels: run-claude
Submit
```

**Review (mobile - 3-4h plus tard):**
```
Notification PR → Review → Approve → Merge
```

---

**Version:** 1.0 (Validé 2025-10-07)
**Status:** ✅ Production-ready
**Test:** test-workflow-v2 (PR #32 successful)
**Cost:** €100/mois (Claude Max subscription)
**Capacity:** 3-4 clients simultanés, 8-10 clients/semaine

*Workflow mobile-first optimisé pour solopreneur productif* 🚀
