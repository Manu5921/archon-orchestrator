# 🔑 CLAUDE MAX OAUTH - Guide Complet

**Version:** 1.0
**Date:** 2025-10-08
**Objectif:** Setup OAuth token pour GitHub Actions + Claude Max
**Durée:** 5 min (one-time) + 30 sec (par projet)

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble](#vue-densemble)
2. [Prérequis](#prérequis)
3. [Setup One-Time (5 min)](#setup-one-time)
4. [Configuration par projet (30 sec)](#configuration-par-projet)
5. [Vérification](#vérification)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#faq)

---

## 🎯 VUE D'ENSEMBLE

### Qu'est-ce que /install-github-app ?

**Commande Claude Desktop** qui configure l'authentification OAuth entre :
- ✅ Votre compte GitHub (repos)
- ✅ Votre abonnement Claude Max (€100/mois)
- ✅ GitHub Actions (exécution cloud)

### Pourquoi OAuth vs API Key ?

| Critère | OAuth Token | API Key Anthropic |
|---------|-------------|-------------------|
| **Coût** | €100/mois (fixe, illimité) | Variable (~€0.003/requête) |
| **Limite** | Aucune (session tokens) | Rate limits API |
| **Setup** | One-time (5 min) | Par projet |
| **Mobile** | ✅ Compatible | ⚠️ Compliqué |
| **Expiration** | 90 jours (renouvelable) | Permanent |

**Recommandation :** OAuth pour multi-client (8-10 projets/semaine)

---

## ✅ PRÉREQUIS

### 1. Abonnement Claude Max

**Vérifier :**
- Compte Claude Desktop actif
- Abonnement **Claude Max** (€100/mois) - **PAS Claude Pro**
- Connexion OAuth Google (pas email/password)

**Où vérifier :**
```
Claude Desktop → Settings → Subscription
Doit afficher : "Claude Max - €100/month"
```

### 2. GitHub CLI installé

```bash
# Installer GitHub CLI
brew install gh

# Authentifier
gh auth login
# Sélectionner : GitHub.com → HTTPS → Login with browser

# Vérifier
gh auth status
# Doit afficher : Logged in to github.com as YOUR_USERNAME
```

### 3. Compte GitHub

- ✅ Compte GitHub actif (ex: Manu5921)
- ✅ Repos accessibles (public ou private)
- ✅ Permissions : Settings → Actions → Allow all actions

---

## 🚀 SETUP ONE-TIME (5 min)

### Étape 1: Installer Claude Code App sur GitHub

**Dans Claude Desktop (session active) :**

```
/install-github-app
```

**Ce qui se passe ensuite :**

1. **Browser s'ouvre automatiquement** (nouvelle fenêtre)

2. **Page GitHub OAuth :**
   ```
   https://github.com/login/oauth/authorize?client_id=...

   "Claude Code" would like permission to:
   - Read access to code, issues, pull requests
   - Write access to code, issues, pull requests
   - Read and write access to workflows

   [ Authorize Claude Code ]
   ```
   → **Cliquer "Authorize Claude Code"**

3. **Page Anthropic Auth :**
   ```
   https://auth.anthropic.com/oauth/authorize...

   Sign in to link your Claude Max account with GitHub

   [ Continue with Google ]  ← Si vous utilisez Google OAuth
   [ Continue with Email ]   ← Si vous utilisez email/password
   ```
   → **Se connecter avec votre compte Claude Max**

4. **Retour vers Claude Desktop :**
   ```
   ✅ GitHub App installed successfully!

   Your OAuth Token:
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

   This token allows Claude Code to access your GitHub repos.
   Copy it to configure your projects.

   Token expires: 2026-01-08 (90 days)
   ```

5. **COPIER LE TOKEN AFFICHÉ** (sera réutilisable)

---

### Étape 2: Vérifier Installation

**Via GitHub Settings :**

```
https://github.com/settings/installations
```

**Vous devriez voir :**
```
Installed GitHub Apps

Claude Code
- Installed 13 hours ago
- Repository access: All repositories
- Permissions: Read/Write code, issues, PRs, workflows

[ Configure ]
```

**Via CLI :**

```bash
gh auth status
# Doit afficher :
# ✓ Logged in to github.com as Manu5921
# ✓ Token: ghp_****
```

---

## 🔧 CONFIGURATION PAR PROJET (30 sec)

**Pour chaque nouveau repo GitHub :**

### Étape 1: Configurer Secret GitHub

```bash
cd /path/to/your-project

# Remplacer TOKEN par celui copié à l'étape 1
echo "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" | gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo Manu5921/ReviewRescue

# Vérifier création
gh secret list --repo Manu5921/ReviewRescue
```

**Résultat attendu :**
```
CLAUDE_CODE_OAUTH_TOKEN  Updated 2025-10-08T10:28:34Z
```

---

### Étape 2: Copier Workflow GitHub Actions

```bash
cd /path/to/your-project

# Créer dossier workflows
mkdir -p .github/workflows

# Copier workflow validé
cp ~/Documents/DEV/archon-orchestrator/.github/workflows/claude-max-implementation.yml \
   .github/workflows/

# Vérifier
ls -la .github/workflows/claude-max-implementation.yml
```

---

### Étape 3: Créer Label run-claude

```bash
gh label create run-claude \
  --description "Trigger Claude Max implementation workflow" \
  --color "0E8A16" \
  --repo Manu5921/ReviewRescue

# Vérifier
gh label list --repo Manu5921/ReviewRescue | grep run-claude
```

**Résultat attendu :**
```
run-claude  Trigger Claude Max implementation  #0E8A16
```

---

### Étape 4: Commit + Push (sur main !)

```bash
# S'assurer d'être sur main
git checkout main

# Commit workflow
git add .github/workflows/
git commit -m "feat: add GitHub Actions OAuth workflow for Claude Max"
git push origin main
```

**⚠️ IMPORTANT :** Workflow **DOIT être sur branche main** pour fonctionner !

---

## ✅ VÉRIFICATION

### Test 1: Workflow présent sur GitHub

**Via browser :**
```
https://github.com/Manu5921/ReviewRescue/actions
```

**Doit afficher :**
```
All workflows

Claude Max Implementation
- Triggered by: Label "run-claude" on issue OR comment "/run claude"
- Status: Active
```

**Via CLI :**
```bash
gh workflow list --repo Manu5921/ReviewRescue
```

**Résultat attendu :**
```
Claude Max Implementation  active  12345678
```

---

### Test 2: Secret configuré

```bash
gh secret list --repo Manu5921/ReviewRescue
```

**Doit afficher :**
```
CLAUDE_CODE_OAUTH_TOKEN  Updated 2025-10-08T10:28:34Z
```

**Note :** GitHub ne montre **jamais** la valeur du secret (sécurité)

---

### Test 3: Label existe

```bash
gh label list --repo Manu5921/ReviewRescue | grep run-claude
```

**Doit afficher :**
```
run-claude  Trigger Claude Max implementation  #0E8A16
```

---

### Test 4: Déclenchement Workflow (Test complet)

**Créer issue test :**

```bash
gh issue create \
  --repo Manu5921/ReviewRescue \
  --title "Test Claude Max - T001-T010" \
  --body "Task range: T001-T010" \
  --label "run-claude"
```

**Vérifier démarrage :**

```bash
# Lister runs en cours
gh run list --repo Manu5921/ReviewRescue

# Suivre exécution en temps réel
gh run watch --repo Manu5921/ReviewRescue
```

**Résultat attendu :**
```
✓ Claude Max Implementation #1234  ✓ main  Test Claude Max - T001-T010
  Triggered via labeled  1m ago  ✓ completed
```

---

## 🔧 TROUBLESHOOTING

### Problème 1: Token non reconnu

**Symptôme :**
```
Error: Authentication failed
HTTP 401: Bad credentials
```

**Causes possibles :**
1. Token copié incorrectement (espace en début/fin)
2. Token expiré (>90 jours)
3. Permissions GitHub App révoquées

**Solution :**

```bash
# Re-générer token
/install-github-app
# → Copier nouveau token

# Re-configurer secret
echo "NOUVEAU_TOKEN" | gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo Manu5921/ReviewRescue
```

---

### Problème 2: Workflow ne démarre pas

**Symptôme :**
- Issue créée avec label `run-claude`
- Onglet Actions reste vide

**Vérifications :**

```bash
# 1. Workflow sur branche main ?
git branch -r | grep origin/main
git log origin/main --oneline | grep "workflow"

# 2. Secret configuré ?
gh secret list --repo Manu5921/ReviewRescue

# 3. Label exact ?
gh label list --repo Manu5921/ReviewRescue | grep run-claude
```

**Solution si workflow sur feature branch :**

```bash
# Merger vers main
git checkout main
git merge feature-branch
git push origin main
```

---

### Problème 3: Permissions insuffisantes

**Symptôme :**
```
Error: Resource not accessible by personal access token
HTTP 403: Forbidden
```

**Cause :** Workflow n'a pas les bonnes permissions

**Solution :**

Vérifier `.github/workflows/claude-max-implementation.yml` ligne 30-33 :

```yaml
permissions:
  contents: write        # ← Obligatoire
  pull-requests: write   # ← Obligatoire
  issues: write          # ← Obligatoire
```

**Si manquant, ajouter ces lignes AVANT `jobs:`**

---

### Problème 4: Browser ne s'ouvre pas

**Symptôme :**
```
/install-github-app
→ Rien ne se passe
```

**Cause :** Claude Desktop ne peut pas ouvrir browser (permissions macOS)

**Solution :**

```bash
# Option 1: Autoriser Claude Desktop dans macOS
# Préférences Système → Sécurité → Autoriser Claude

# Option 2: Copier URL manuellement
# Claude Desktop affichera une URL dans le chat
# Copier l'URL et ouvrir dans browser manuellement
```

---

### Problème 5: Token déjà utilisé

**Symptôme :**
```
Error: Secret already exists
```

**Cause :** Secret déjà configuré sur le repo

**Solution :**

```bash
# Supprimer ancien secret
gh secret delete CLAUDE_CODE_OAUTH_TOKEN --repo Manu5921/ReviewRescue

# Re-créer avec nouveau token
echo "NOUVEAU_TOKEN" | gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo Manu5921/ReviewRescue
```

---

## ❓ FAQ

### Q1: Le token fonctionne-t-il pour tous mes repos ?

**R:** Oui ! Le token OAuth est lié à votre compte GitHub, pas à un repo spécifique.

**Usage :**
```bash
# Même token pour 10 projets
for repo in project1 project2 project3; do
  echo "TOKEN" | gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo Manu5921/$repo
done
```

---

### Q2: Combien de projets puis-je exécuter en parallèle ?

**R:** GitHub Actions free tier : **20 jobs simultanés**

**Réaliste pour Claude Max :**
- ✅ **3-4 projets simultanés** (workflow 3-4h chacun)
- ✅ **8-10 projets/semaine** (séquentiels)

**Limite pratique :** Abonnement Claude Max (sessions tokens partagées)

---

### Q3: Le token expire-t-il ?

**R:** Oui, après **90 jours** (sécurité GitHub)

**Renouvellement :**
```
/install-github-app
→ Générer nouveau token
→ Re-configurer secrets sur tous les repos
```

**Astuce :** Calendrier rappel 80 jours après setup

---

### Q4: Différence entre OAuth token et Personal Access Token (PAT) ?

| Critère | OAuth Token | PAT (Classic) |
|---------|-------------|---------------|
| **Généré via** | `/install-github-app` | GitHub Settings |
| **Scope** | App spécifique (Claude Code) | Compte entier |
| **Expiration** | 90 jours | Configurable (ou jamais) |
| **Révocation** | Uninstall app | Delete token |
| **Usage** | Session tokens Claude Max | API usage billing |

**Recommandation :** OAuth pour Claude Max, PAT pour autres usages

---

### Q5: Que se passe-t-il si je révoque l'app GitHub ?

**Action :**
```
https://github.com/settings/installations
→ Claude Code → Uninstall
```

**Impact :**
- ❌ Tous les workflows échouent (token invalide)
- ❌ Secrets GitHub restent (mais inutilisables)

**Pour restaurer :**
```
/install-github-app
→ Re-générer token
→ Re-configurer secrets sur tous repos
```

---

### Q6: Puis-je partager le token avec d'autres développeurs ?

**R:** ⚠️ **NON recommandé** (sécurité)

**Raison :**
- Token lié à **VOTRE** compte GitHub (Manu5921)
- Token lié à **VOTRE** abonnement Claude Max
- Révocation = tous les repos impactés

**Alternative (pour équipes) :**
- Créer compte GitHub "bot" (ex: ReviewRescueBot)
- Générer token pour ce compte
- Partager secret via secret manager d'équipe

---

### Q7: Coût si je dépasse 3-4 projets simultanés ?

**R:** Aucun coût supplémentaire (GitHub Actions free tier)

**Limites GitHub Actions (free tier) :**
- ✅ 2,000 minutes/mois (33h) - **Suffisant**
- ✅ 20 jobs simultanés - **Suffisant**
- ✅ Stockage 500MB - **Suffisant**

**Calcul :**
```
8 projets/semaine × 3.5h/projet = 28h/semaine = 112h/mois
112h < 2,000 min (33h) ❌ FAUX

Correction : 2,000 MINUTES = 33 heures
112h > 33h → Dépasse free tier

Solution : GitHub Actions payant ($0.008/min au-delà)
112h - 33h = 79h × 60 min = 4,740 min × $0.008 = $37.92/mois
```

**Total coût 8 projets/semaine :**
- Claude Max: €100/mois
- GitHub Actions: ~$38/mois
- **Total : €135/mois** (~€17/projet)

**Optimisation :** Réduire à 4-5 projets/semaine = free tier suffisant

---

### Q8: Mobile workflow fonctionne sans Mac allumé ?

**R:** ✅ **OUI** - C'est l'avantage principal !

**Workflow mobile-first :**
1. **Planning sur Mac** (30 min) → Push vers GitHub
2. **Mac peut s'éteindre** ✅
3. **Déclenchement mobile** (Android - 2 min) → Créer issue
4. **Exécution cloud** (GitHub Actions - 3-4h) → VM Ubuntu
5. **Review mobile** (Android - 15 min) → Approve PR

**Cas d'usage :**
- ✅ Plage (déclencher implémentation depuis mobile)
- ✅ Transport (review PR dans métro)
- ✅ Café (merge PR depuis terrasse)

---

### Q9: Quelle est la différence avec API key dans les variables d'environnement ?

**OAuth Token (CLAUDE_CODE_OAUTH_TOKEN) :**
```yaml
# .github/workflows/claude-max-implementation.yml
- uses: anthropics/claude-code-action@v1
  with:
    claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```
- ✅ Session tokens (illimité)
- ✅ Lié à abonnement Claude Max
- ✅ Pas de coût usage

**API Key (ANTHROPIC_API_KEY) :**
```yaml
# .github/workflows/claude-implementation-api-key.yml
- uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```
- ⚠️ Usage billing (~€0.003/requête)
- ⚠️ Rate limits API
- ⚠️ Coût variable selon usage

---

### Q10: Comment migrer d'API key vers OAuth token ?

**Si vous utilisez déjà API key :**

```bash
cd /path/to/your-project

# 1. Générer OAuth token
/install-github-app
# → Copier token

# 2. Configurer secret OAuth
echo "TOKEN_OAUTH" | gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo Manu5921/REPO

# 3. (Optionnel) Supprimer ancien secret API key
gh secret delete ANTHROPIC_API_KEY --repo Manu5921/REPO

# 4. Mettre à jour workflow
# Remplacer dans .github/workflows/*.yml :
#   anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
# Par :
#   claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}

# 5. Commit + push
git add .github/workflows/
git commit -m "feat: migrate from API key to OAuth token"
git push
```

**Avantages migration :**
- ✅ Économies : Variable → Fixe (€100/mois all-inclusive)
- ✅ Simplicité : Un secret au lieu de deux
- ✅ Illimité : Pas de rate limits

---

## 📚 RESSOURCES

### Documentation Officielle

- **Claude Code GitHub App:** https://github.com/apps/claude-code
- **Claude Desktop:** https://claude.ai/download
- **GitHub CLI:** https://cli.github.com/
- **GitHub Actions:** https://docs.github.com/actions

### Documentation Projet

- **START-HERE.md** - Overview workflow complet
- **GITHUB-ACTIONS-OAUTH-SETUP.md** - Setup workflow mobile-first
- **WORKFLOW-COMPLETE-V3.md** - Source de vérité (85KB - RIEN NE MANQUE)
- **RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md** - Apprentissages session test

### Workflows Prêts à l'Emploi

```bash
# Workflow OAuth (recommandé)
~/archon-orchestrator/.github/workflows/claude-max-implementation.yml

# Workflow API key (fallback)
~/archon-orchestrator/.github/workflows/claude-max-implementation-api-key.yml
```

---

## ✅ CHECKLIST FINALE

### Setup One-Time
- [ ] Abonnement Claude Max actif (€100/mois)
- [ ] GitHub CLI installé et authentifié (`gh auth status`)
- [ ] `/install-github-app` exécuté avec succès
- [ ] Token OAuth copié et sauvegardé (safe password manager)
- [ ] GitHub App "Claude Code" visible dans https://github.com/settings/installations

### Par Projet
- [ ] Secret `CLAUDE_CODE_OAUTH_TOKEN` configuré (`gh secret list`)
- [ ] Workflow copié dans `.github/workflows/`
- [ ] Label `run-claude` créé (`gh label list`)
- [ ] Workflow commité sur branche `main` (pas feature)
- [ ] Test trigger réussi (issue avec label → Actions démarre)

### Validation
- [ ] `gh workflow list` affiche "Claude Max Implementation active"
- [ ] `gh secret list` affiche "CLAUDE_CODE_OAUTH_TOKEN"
- [ ] `gh label list | grep run-claude` affiche le label
- [ ] Test déclenchement : issue → Actions run démarre dans 1-2 min

---

**Si toutes les cases cochées → Setup OAuth complet ! 🎉**

**Prochaine étape :** Tester workflow complet (planning → implement → PR → merge)

---

**Version:** 1.0
**Date:** 2025-10-08
**Auteur:** Documentation archon-orchestrator
**Status:** Guide complet validé (session ReviewRescue)
