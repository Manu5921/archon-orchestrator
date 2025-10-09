# Sub-Agents Quality-First Templates

**Version:** 1.0
**Date:** 2025-10-09
**Workflow:** V4 Local Mac + MCP Quality

---

## 🎯 Vue d'Ensemble

Templates sub-agents avec **quality checks inline** (ESLint + Semgrep).

### Différence vs Templates Standard

**Standard:**
- Sub-agents génèrent code
- Checks en fin de PR (trop tard)
- Corrections après coup (friction)

**Quality-First:**
- Sub-agents génèrent code **+ quality checks inline**
- ESLint après chaque fichier (immédiat)
- Semgrep batch (avant commit)
- **Code propre dès commit #1**

---

## 📦 Templates Disponibles

| Template | Stack | MCP Quality | Use Case |
|----------|-------|-------------|----------|
| **backend-specialist-quality** | TS/Node, Express, Prisma | ESLint + Semgrep | APIs, Auth, DB |
| **frontend-specialist-quality** | React/Next.js, Tailwind | ESLint + Semgrep | UI, Components, Forms |

---

## ⚡ Quick Start

### 1. Prérequis (ONE-TIME)

**Config Claude Desktop → Settings → MCP:**

```json
{
  "eslint": {
    "command": "npx",
    "args": ["-y", "@eslint/mcp-server"]
  },
  "semgrep": {
    "command": "npx",
    "args": ["-y", "@semgrep/mcp"],
    "env": {
      "SEMGREP_RULES": "p/owasp-top-10"
    }
  }
}
```

### 2. Nouveau Projet

```bash
# Init projet
cd nouveau-projet
claude mcp add-from-claude-desktop --scope project

# Vérifier MCP actifs
claude mcp list
# Devrait afficher: eslint, semgrep (+ context7, supabase)

# Lancer Claude Code
claude
```

### 3. Utiliser Templates

**Dans Claude Code session:**

```
Vous: "Use backend-specialist-quality template pour implémenter API"

Claude:
1. ✅ Lit template backend-specialist-quality.md
2. ✅ Génère code avec quality rules
3. ✅ Appelle ESLint après chaque fichier
4. ✅ Appelle Semgrep en fin de batch
5. ✅ Commit seulement si checks passed
```

---

## 🎯 Quality Rules (Tous Templates)

### ESLint (Code Quality)

**Quand:** Après chaque fichier écrit

**Scope:** Fichier modifié uniquement (diff ±30 lines)

**Fix:** TOUTES erreurs avant proceeding

**Budget:** ~1.5K tokens/call

### Semgrep (Security)

**Quand:** End of task batch (5-10 fichiers)

**Scope:** Fichiers modifiés uniquement

**Fix:** Blocker/High FIRST, Medium/Low documented

**Budget:** ~2.5K tokens/call

### Commit Rules

```
Commit SEULEMENT si:
✅ ESLint: 0 errors
✅ Semgrep: 0 blocker/high
✅ Build: successful
✅ Tests: passed (si existent)
```

---

## 📊 Impact Mesuré

### Avant (Sans MCP Quality)

```
Implementation:
→ Code généré (3-4h)
→ Commit
→ PR créée
→ CI/CD détecte 20-30 erreurs ESLint
→ CI/CD détecte 5-10 vulnérabilités Semgrep
→ Corrections manuelles (1-2h)
→ Re-commit + re-push
Total: 5-6h
```

### Après (Avec MCP Quality)

```
Implementation:
→ Code généré (3-4h)
→ ESLint inline (fix immédiat)
→ Semgrep batch (fix avant commit)
→ Commit (déjà clean)
→ PR créée
→ CI/CD: 0-2 erreurs mineures
→ Corrections: 10-15 min
Total: 4h15

Gain: -1h45 (30% plus rapide)
```

---

## 🔧 Workflow Example (Backend)

```bash
# Task: Implement user authentication

# 1. Backend specialist génère auth.ts
# → ESLint check automatique
# → Fix: unused variable 'userId'

# 2. Génère users.ts
# → ESLint check automatique
# → Fix: missing await

# 3. Génère auth.test.ts
# → ESLint check automatique
# → Fix: async test missing await

# 4. End of batch → Semgrep scan
# → Scope: auth.ts, users.ts, auth.test.ts
# → Fix: SQL injection in raw query
# → Fix: hardcoded JWT secret

# 5. Commit (all checks passed)
git add src/auth/
git commit -m "feat: user authentication

- Login/logout with JWT
- User CRUD operations
- Tests E2E

✅ ESLint: 0 errors
✅ Semgrep: 0 high/blocker
✅ Tests: 12/12 passed"

# 6. Push (backup GitHub)
git push

# 7. PR auto-created
# → Jules Security scan (async)
# → Score 94/100 (clean!)
```

**Résultat:** Code propre dès commit #1, pas corrections post-PR

---

## 📚 Documentation Templates

### Backend Specialist Quality

**Fichier:** `backend-specialist-quality.md`

**Contient:**
- Tools available (Code + MCP)
- Quality rules (ESLint + Semgrep)
- Budget awareness
- Workflow example complet
- Common fixes (SQL injection, secrets, eval)
- Quality checklist
- Error escalation

**Use case:**
- APIs REST/GraphQL
- Auth (JWT, OAuth, sessions)
- Database (Prisma, Supabase)
- Tests E2E

---

### Frontend Specialist Quality

**Fichier:** `frontend-specialist-quality.md`

**Contient:**
- Tools available (Code + MCP)
- Quality rules (ESLint React + Semgrep XSS)
- Budget awareness
- Workflow example complet
- Common fixes (hooks deps, a11y, XSS)
- Quality checklist
- Error escalation

**Use case:**
- React/Next.js apps
- Components UI (shadcn/ui)
- Forms (validation, errors)
- Dashboards

---

## 🚨 Important Notes

### 1. Claude Max Budget

**Budget tokens OK mais rester efficient:**
- ESLint: scope fichier modifié seulement
- Semgrep: scope batch seulement (pas full repo)
- Context7: queries ciblées (pas bulk)

**Monitoring (optionnel):**
```bash
# Log tokens usage
echo "ESLint call: $TOKENS_USED tokens" >> mcp-usage.log
```

### 2. Error Escalation (3-Strike Rule)

**Si ESLint/Semgrep échoue 3× consecutively:**
1. **Stop** - Ne pas continuer aveuglément
2. **Document** - Noter erreur + tentatives
3. **Ask user** - Demander guidance

**NEVER:**
- Skip checks
- Disable ESLint rules
- Commit broken code

### 3. Fallback Sans MCP

**Si MCP indisponibles (rare):**
```bash
# Fallback ESLint local
npx eslint src/ --fix

# Fallback Semgrep local
npx semgrep --config=p/owasp-top-10 src/

# Note dans commit
git commit -m "feat: feature X (MCP unavailable, used local lint)"
```

---

## 🎓 Best Practices

### 1. Batch ESLint Smartly

```
❌ INEFFICIENT:
→ Écrit 1 ligne
→ ESLint call (overkill)
→ Écrit 1 ligne
→ ESLint call

✅ EFFICIENT:
→ Écrit fonction complète (20-50 lines)
→ ESLint call
→ Fix errors
→ Continue
```

### 2. Semgrep Scope Targeted

```
❌ INEFFICIENT:
→ Semgrep scan full repo (10K+ files)
→ Budget tokens explosé

✅ EFFICIENT:
→ Semgrep scan modified paths only
→ Scope: src/auth/ src/users/ (20-30 files)
→ Budget OK
```

### 3. Context7 + Quality

```
✅ SYNERGY:
1. Context7: "Find authentication pattern"
→ Returns validated OAuth pattern

2. Use pattern as base

3. ESLint + Semgrep: Verify implementation
→ Catch deviations from best practices

Result: Pattern réutilisé + quality validated
```

---

## 📊 Metrics Success

### Quality Gates

**P0 (OBLIGATOIRE):**
- ESLint: 0 errors
- Semgrep: 0 blocker/high
- Build: successful

**P1 (RECOMMANDÉ):**
- Tests: passed
- TypeScript: no any
- Documentation: JSDoc on public APIs

**P2 (OPTIONNEL):**
- Coverage: ≥80%
- Lighthouse: ≥90 (frontend)

### Target Metrics

| Métrique | Target | Current (Avg) |
|----------|--------|---------------|
| **ESLint errors finales** | 0-2 | 20-30 (sans MCP) |
| **Semgrep blocker/high** | 0 | 5-10 (sans MCP) |
| **Temps corrections post-PR** | ≤15 min | 1-2h (sans MCP) |
| **Commits clean ratio** | ≥95% | 60% (sans MCP) |

---

## 🔮 Évolution Future

### Templates Additionnels (Si Besoin)

**À considérer:**
- `testing-specialist-quality` (Playwright + ESLint tests)
- `devops-specialist-quality` (Dockerfile + Hadolint MCP)
- `data-specialist-quality` (Python + Ruff + Bandit)

**Décision:** Valider ROI backend + frontend d'abord

### MCP Additionnels (Évaluation)

**P3-P4 (pas prioritaire maintenant):**
- Playwright MCP (E2E tests)
- SonarQube MCP (métriques avancées)
- Mutation testing (robustesse tests)

**Principe:** 10× value vs 1× complexity

---

## ✅ Checklist Adoption

**Avant d'utiliser templates:**
- [ ] ESLint + Semgrep configurés Claude Desktop
- [ ] `claude mcp add-from-claude-desktop` exécuté
- [ ] `claude mcp list` affiche eslint + semgrep
- [ ] Templates lus (backend/frontend)
- [ ] Workflow example compris

**Pendant utilisation:**
- [ ] ESLint appelé après chaque fichier
- [ ] Semgrep appelé end of batch
- [ ] Errors fixées avant commit
- [ ] Commits include quality status (✅ ESLint, ✅ Semgrep)

**Après projet:**
- [ ] Metrics collectées (errors évitées, temps gagné)
- [ ] Feedback documenté (friction rencontrée ?)
- [ ] ROI validé (continue using ?)

---

**Version:** 1.0 (Quality-First)
**Date:** 2025-10-09
**Workflow:** V4 Local Mac + MCP Quality

*Sub-agents templates avec quality inline - Code propre dès commit #1* ✅🔒🚀
