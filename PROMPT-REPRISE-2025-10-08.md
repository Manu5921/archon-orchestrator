# 🚀 PROMPT REPRISE - 2025-10-08

**Date:** 2025-10-08
**Contexte:** Test workflow GitHub Actions OAuth sur projet réel ReviewRescue
**Session précédente:** Validation workflow test-workflow-v2 (PR #32 success)

---

## 🎯 OBJECTIF SESSION

Tester le workflow GitHub Actions + Claude Max OAuth sur le projet réel **ReviewRescue** (`/Users/manu/Documents/DEV/ReviewRescue`).

---

## ✅ CE QUI A ÉTÉ VALIDÉ HIER (2025-10-07)

### Workflow Production-Ready

**Fichier:** `.github/workflows/claude-max-implementation.yml`

**Testé avec succès sur:** `test-workflow-v2` (PR #32)
- ✅ OAuth token fonctionne (`CLAUDE_CODE_OAUTH_TOKEN`)
- ✅ Auto-approve tools via instruction explicite dans prompt
- ✅ Settings.json avec `permissions.allow` array
- ✅ `claude_args: "--permission-mode bypassPermissions"`
- ✅ Permissions workflow-level (pas job-level)
- ✅ Création PR automatique réussie
- ✅ Fichiers créés: README.md, package.json, package-lock.json

**Erreur mineure résiduelle:** Comment on issue (404) - mais PR créée avec succès, donc non-bloquant.

### Documentation Créée

1. **`docs/GITHUB-ACTIONS-OAUTH-SETUP.md`** - Guide complet setup OAuth (15 sections)
2. **`START-HERE.md`** - Mis à jour avec Option 2 mobile-first
3. **`new-client.sh`** - Fixé avec `--ai-assistant claude` flag

### Commit Final

```
7cbf8d7 - feat: add GitHub Actions OAuth workflow + complete documentation
```

**132 fichiers modifiés:**
- 5 workflows GitHub Actions ajoutés
- 121 fichiers obsolètes archivés → `archive-obsolete-2025-10-07-v3/`
- 5 docs ajoutés (GITHUB-ACTIONS-OAUTH-SETUP.md, etc.)

---

## 🎯 PLAN SESSION AUJOURD'HUI

### Phase 1: Vérification État ReviewRescue (5 min)

```bash
cd /Users/manu/Documents/DEV/ReviewRescue

# Vérifier état actuel
git status
git log --oneline -5

# Vérifier si planning Spec-Kit existe
ls -la .specify/specs/001-mvp/
```

**Questions à vérifier:**
1. Planning Spec-Kit déjà fait? (constitution.md, spec.md, plan.md, tasks.md)
2. Repo GitHub existe? Si oui, quel nom?
3. Branche actuelle? (main/master?)
4. Changements non commités?

### Phase 2: Setup Workflow GitHub Actions (10 min)

**Si planning Spec-Kit existe déjà:**
```bash
cd /Users/manu/Documents/DEV/ReviewRescue

# Copier workflow validé
mkdir -p .github/workflows
cp ~/Documents/DEV/archon-orchestrator/.github/workflows/claude-max-implementation.yml \
   .github/workflows/

# Vérifier repo GitHub
gh repo view

# Configurer OAuth token (si pas déjà fait)
gh secret list
# Si CLAUDE_CODE_OAUTH_TOKEN manque:
echo "YOUR_TOKEN" | gh secret set CLAUDE_CODE_OAUTH_TOKEN

# Créer label run-claude
gh label create run-claude --description "Trigger Claude Max implementation workflow" --color "0E8A16"

# Commit workflow
git add .github/workflows/claude-max-implementation.yml
git commit -m "feat: add GitHub Actions OAuth workflow for Claude Max"
git push
```

**Si planning Spec-Kit N'EXISTE PAS:**
```bash
cd /Users/manu/Documents/DEV/ReviewRescue

# Exécuter planning complet (30 min)
/speckit.constitution  # → .specify/memory/constitution.md
/speckit.specify       # → .specify/specs/001-mvp/spec.md
/speckit.plan          # → .specify/specs/001-mvp/plan.md
/speckit.tasks         # → .specify/specs/001-mvp/tasks.md

# Commit planning
git add .specify/
git commit -m "docs: planning Spec-Kit complete"
git push

# Puis suivre les étapes ci-dessus pour setup workflow
```

### Phase 3: Déclenchement Test (Mobile Android - 2 min)

**Sur mobile GitHub app:**
1. Aller sur repo `ReviewRescue`
2. Issues → New Issue
3. **Title:** `Test Claude Max - Implement T001-T005`
4. **Body:**
   ```
   Task range: T001-T005
   ```
5. **Labels:** `run-claude`
6. Submit

**OU via CLI si mobile indisponible:**
```bash
gh issue create \
  --title "Test Claude Max - Implement T001-T005" \
  --body "Task range: T001-T005" \
  --label "run-claude"
```

### Phase 4: Monitoring (3-4h)

**Suivre exécution:**
```bash
# Voir runs en cours
gh run list --workflow "Claude Max Implementation"

# Voir logs du dernier run
gh run view --log

# Ouvrir dans browser
gh run view --web
```

**Attendre:**
- ⏱️ 3-4h exécution (selon nombre de tasks)
- 📱 Notification PR créée

### Phase 5: Review PR (Mobile Android - 15 min)

**Sur mobile GitHub app:**
1. Notification PR → Ouvrir
2. Files changed → Review code
3. **Vérifier:**
   - README.md créé/modifié?
   - package.json créé/modifié?
   - src/* créé selon tasks?
   - Tests créés?
4. Approve → Merge squash

**OU via CLI:**
```bash
# Lister PRs
gh pr list

# Review PR (remplacer NUMBER)
gh pr view NUMBER
gh pr diff NUMBER
gh pr review NUMBER --approve
gh pr merge NUMBER --squash
```

---

## 📋 CHECKLIST VALIDATION

### Avant déclenchement:
- [ ] Planning Spec-Kit existe (constitution.md, spec.md, plan.md, tasks.md)
- [ ] Workflow copié dans `.github/workflows/`
- [ ] Secret `CLAUDE_CODE_OAUTH_TOKEN` configuré
- [ ] Label `run-claude` créé
- [ ] Workflow commité et pushé
- [ ] Repo GitHub accessible

### Pendant exécution:
- [ ] Workflow démarre (GitHub Actions tab)
- [ ] Step "Parse Task Range" réussit
- [ ] Step "Run Claude Code Implementation" démarre
- [ ] Pas d'erreur "Permission denied"
- [ ] Pas d'erreur "Credit balance too low"

### Après exécution:
- [ ] PR créée automatiquement
- [ ] PR contient fichiers attendus (README.md, package.json, src/*, etc.)
- [ ] PR title: `feat: Implement T001-T005`
- [ ] Commit message contient Co-Authored-By: Claude
- [ ] Code compile (P0 Build passed)
- [ ] Tests passent (P2 Tests passed)

---

## ⚠️ PROBLÈMES POTENTIELS & SOLUTIONS

### Erreur: "No task range found in issue body"

**Cause:** Format body incorrect

**Fix:** Body doit contenir exactement:
```
Task range: T001-T005
```

### Erreur: "Permission denied" sur Write/Edit

**Cause:** Auto-approve instruction manquante

**Fix:** Vérifier workflow ligne 156:
```yaml
prompt: |
  IMPORTANT: Auto-approve all tools (...) for automated execution.
```

### Erreur: "Credit balance too low"

**Cause:** Mauvais secret configuré (ANTHROPIC_API_KEY au lieu de CLAUDE_CODE_OAUTH_TOKEN)

**Fix:**
```bash
gh secret list  # Vérifier nom exact
gh secret delete ANTHROPIC_API_KEY  # Si existe
echo "YOUR_OAUTH_TOKEN" | gh secret set CLAUDE_CODE_OAUTH_TOKEN
```

### Erreur: Workflow ne démarre pas

**Causes possibles:**
1. Label `run-claude` n'existe pas
2. Trigger incorrect dans workflow (ligne 24-25)
3. Secret manquant

**Fix:**
```bash
# Vérifier labels
gh label list

# Créer label si manquant
gh label create run-claude --description "Trigger Claude Max implementation" --color "0E8A16"

# Vérifier workflow trigger
cat .github/workflows/claude-max-implementation.yml | grep -A 5 "on:"
```

### Token OAuth expiré

**Symptôme:** `Error: Authentication failed`

**Fix:** Régénérer token dans Claude Desktop:
```bash
# Dans Claude Desktop
/install-github-app

# Copier nouveau token
echo "NEW_TOKEN" | gh secret set CLAUDE_CODE_OAUTH_TOKEN
```

---

## 📊 MÉTRIQUES ATTENDUES

**Projet ReviewRescue:**
- **Tasks estimées:** ~50-80 tasks (MVP complet)
- **Batch recommandé:** T001-T010 (10 tasks) pour premier test
- **Durée exécution:** ~1-2h pour 10 tasks
- **Fichiers créés:** 15-25 fichiers (README, package.json, src/*, tests/*, etc.)

**Si succès:**
- ✅ Workflow validé sur projet réel
- ✅ Prêt à déployer sur 3-4 clients simultanés
- ✅ Capacité 8-10 clients/semaine confirmée

---

## 🔗 RÉFÉRENCES DOCUMENTATION

**Guides complets:**
- `docs/GITHUB-ACTIONS-OAUTH-SETUP.md` - Setup OAuth complet
- `START-HERE.md` - Option 2 mobile-first workflow
- `docs/WORKFLOW-COMPLETE-V3.md` - Workflow V3 complet

**Workflows:**
- `.github/workflows/claude-max-implementation.yml` - Workflow principal (OAuth)
- `.github/workflows/claude-max-implementation-api-key.yml` - Workflow API key (si besoin)

**Scripts:**
- `~/Documents/DEV/clients/new-client.sh` - Automated setup nouveaux projets

---

## 💡 COMMANDES RAPIDES

```bash
# Vérifier état ReviewRescue
cd /Users/manu/Documents/DEV/ReviewRescue && git status

# Copier workflow
cp ~/Documents/DEV/archon-orchestrator/.github/workflows/claude-max-implementation.yml \
   /Users/manu/Documents/DEV/ReviewRescue/.github/workflows/

# Configurer secret (remplacer YOUR_TOKEN)
echo "YOUR_TOKEN" | gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo YOUR_USERNAME/ReviewRescue

# Créer label
gh label create run-claude --description "Trigger Claude Max" --color "0E8A16" --repo YOUR_USERNAME/ReviewRescue

# Créer issue test
gh issue create \
  --repo YOUR_USERNAME/ReviewRescue \
  --title "Test Claude Max - T001-T010" \
  --body "Task range: T001-T010" \
  --label "run-claude"

# Suivre exécution
gh run watch --repo YOUR_USERNAME/ReviewRescue

# Lister PRs
gh pr list --repo YOUR_USERNAME/ReviewRescue
```

---

## 🎯 OBJECTIF FINAL

**Valider workflow mobile-first sur projet réel ReviewRescue:**
- ✅ Planning Mac (30 min - si pas déjà fait)
- ✅ Déclenchement mobile (2 min)
- ✅ Exécution cloud (3-4h - Mac peut s'éteindre)
- ✅ Review mobile (15 min)
- ✅ Merge PR

**Si succès → Workflow production-ready pour 8-10 clients/semaine!** 🚀

---

**Version:** 1.0
**Date:** 2025-10-08
**Projet test:** ReviewRescue
**Workflow:** GitHub Actions + Claude Max OAuth
**Coût:** €100/mois (Claude Max uniquement)

*Prêt à scaler 3-4 clients simultanés!* 🎯
