# 🚀 PROMPT REPRISE - 2025-10-15 (Mardi)

**Date:** 2025-10-15
**Session:** Validation Production Zen MCP + Nouveau Projet
**Précédente:** Session 3 (2025-10-12) - Zen MCP validated
**Durée estimée:** 2-3h (1h validation + 1-2h projet)

---

## ✅ CONTEXTE - ZEN MCP PRODUCTION READY

### Session 3 Complétée (2025-10-12) - SUCCÈS TOTAL

**Validation Zen MCP:**
- ✅ **Codex clink:** Fonctionne (5s, code review OK)
- ✅ **Gemini clink:** Fonctionne (41s, security review OK)  
- ✅ **Multi-IA workflow:** Validé (Claude → Codex → Gemini → Claude)
- ✅ **Context preservation:** 100% (Gemini analyse output Codex)
- ✅ **Time savings:** 87.5% (10-15 min → 2 min)
- ✅ **ROI:** Break-even 1.5 semaines, €6,900-16,900/an value

**Documentation:**
- `docs/ZEN-MCP-WORKFLOW-ORCHESTRATION.md` (guide 600+ lignes)
- `RESUME-SESSION-2025-10-12.md` (Session 3 results)
- `WORKFLOW-FINAL-V4-MULTI-DEVICE.md` (Phase 3bis Zen MCP)
- `CLAUDE.md` (section Zen MCP)
- `ROADMAP-ZEN-MCP-2025.md` (12 mois roadmap)

**Status:** ✅ **PRODUCTION READY** - Ready pour usage client

---

## 🎯 OBJECTIFS SESSION

### 1. Test Production Zen MCP (1h) ⭐ PRIORITÉ

**Objectif:** Valider itération automatique 3 CLI sur cas d'usage réel

**Scénario Test: Architecture Decision**
```
Prompt: "Design architecture for [nouveau projet client]"

Workflow Zen MCP:
1. Claude → Codex: "Generate 3 architecture options"
2. Claude → Gemini: "Review options for security/scalability/cost"
3. Claude: Arbitration finale + ADR draft
```

**Critères Succès:**
- ✅ 3 CLI répondent sans erreur (Codex + Gemini + Claude)
- ✅ Context préservé (Gemini analyse correctement output Codex)
- ✅ Temps total <5 min (vs 10-15 min manuel)
- ✅ Output production-ready (ADR utilisable pour projet)

**Résultat attendu:**
- Si ✅ → Zen MCP validé en production → Continue nouveau projet
- Si ❌ → Debug (OAuth? Timeout? Server?) → Retry

---

### 2. Nouveau Projet Spec-Kit (1-2h)

**Workflow V4.2 avec Zen MCP intégré:**

```bash
cd ~/Documents/DEV/clients
./setup-project.sh [nom-projet]
cd [nom-projet]

# Phase 1: Planning Spec-Kit (30 min)
/speckit.constitution     # 5 min
/speckit.specify          # 5 min
/speckit.clarify          # 5 min (si ambiguïtés)

# 🆕 Zen MCP - Architecture Validation (10 min)
"Use Zen MCP to validate architecture:
1. Codex: Tech stack options (3 alternatives)
2. Gemini: Security/scalability review
3. Update constitution.md with validated decision"

/speckit.design           # 5 min
/speckit.plan             # 5 min
/speckit.tasks            # 5 min (50-80 tasks)
/speckit.agents           # 2 min

# Commit
git add .
git commit -m "docs: planning complete with Zen MCP validated architecture"
git push
```

---

## 📋 PRÉ-REQUIS AVANT SESSION

### ✅ Checklist Zen MCP Ready

```bash
# 1. Zen MCP connecté
claude mcp list
# → zen: ✓ Connected (doit être vert)

# 2. Tools exposés (8 tools)
# Vérifier présence de:
# - mcp__zen__clink ⭐ (CLI-to-CLI bridge)
# - mcp__zen__chat
# - mcp__zen__thinkdeep
# - mcp__zen__consensus
# - mcp__zen__challenge
# - mcp__zen__apilookup
# - mcp__zen__listmodels
# - mcp__zen__version

# 3. OAuth sessions actives (24h lifetime)
codex whoami
# → Doit afficher username (pas d'erreur)

gemini whoami
# → Doit afficher username (pas d'erreur)

# Si expiré → Re-login:
codex auth login   # OAuth flow in browser
gemini auth login  # OAuth flow in browser

# 4. Ollama running (requis Zen MCP startup)
curl -s http://localhost:11434/api/tags | grep qwen
# → Doit retourner qwen model info
```

**Status:**
- ✅ Tout OK → Ready pour session
- ❌ Issue → Fix avant continuer (voir Troubleshooting)

---

## 🔧 TROUBLESHOOTING RAPIDE

### Issue 1: OAuth Expired

**Symptôme:**
```
"CLI execution failed: OAuth token expired"
```

**Fix:**
```bash
codex auth login
gemini auth login
# Follow OAuth flow dans browser
# Re-test après login
```

---

### Issue 2: Zen MCP Not Connected

**Symptôme:**
```bash
claude mcp list
# zen: ✗ Connection failed
```

**Fix:**
```bash
# 1. Vérifier Ollama running
ollama serve &

# 2. Restart Claude Code session
exit
claude

# 3. Verify
claude mcp list  # zen: ✓ Connected
```

---

### Issue 3: Tools Non Exposés

**Symptôme:**
```
mcp__zen__* functions non disponibles
```

**Fix:**
```bash
# Vérifier nom serveur (doit être "zen", PAS "zen-server")
grep 'Server(' ~/Documents/DEV/zen-mcp-server/server.py
# Doit être: Server("zen")

# Si incorrect:
cd ~/Documents/DEV/zen-mcp-server
# Edit server.py line 164: Server("zen")
# Restart Claude Code session
```

---

## 🎯 WORKFLOW DÉTAILLÉ

### STEP 1: Warm-up Test (5 min)

**Test simple pour valider setup:**

```javascript
mcp__zen__clink({
  prompt: "What are the top 3 security best practices for JWT authentication in 2025?",
  cli_name: "gemini"
})
```

**Attendu:** 
- Réponse en 20-40s
- Pas d'erreur OAuth/timeout
- Contenu pertinent (JWT best practices)

✅ **Si OK:** Continue Step 2
❌ **Si fail:** Debug (OAuth? Zen MCP down?)

---

### STEP 2: Architecture Decision Multi-IA (30 min) ⭐ VALIDATION PRODUCTION

**Scénario:** Architecture pour [votre nouveau projet client]

**Exemple: SaaS Invoicing System**

```javascript
// 1. Codex: Generate architecture options
mcp__zen__clink({
  prompt: `Generate 3 architecture options for a SaaS invoicing system:

Requirements:
- Multi-tenant (1000+ clients)
- PDF generation (invoices/quotes)
- Payment integration (Stripe)
- Email notifications (SendGrid)
- Reporting dashboard (analytics)
- API for integrations

For each option provide:
1. Architecture style (monolith/microservices/serverless)
2. Tech stack (backend/frontend/infra)
3. Pros/Cons
4. Complexity score (1-10)
5. Monthly cost estimate (1000 clients)`,
  cli_name: "codex",
  role: "planner"
})

// 2. Gemini: Security + Scalability review
mcp__zen__clink({
  prompt: `Review these 3 architecture options for:

1. Security implications:
   - Data isolation (multi-tenant)
   - PII protection (RGPD compliance)
   - Payment security (PCI-DSS)
   - API security (auth, rate limiting)

2. Scalability bottlenecks:
   - 1,000 clients → 10,000 clients path
   - PDF generation at scale
   - Database design (tenant isolation)
   - Cost scaling curve

3. Must-fix items:
   - Critical risks (P0)
   - High priority improvements (P1)
   - Nice-to-have optimizations (P2)

[ARCHITECTURE OPTIONS FROM CODEX]

Provide structured recommendations with priority levels.`,
  cli_name: "gemini",
  role: "codereviewer"
})

// 3. Claude: Final arbitration
// → Synthèse Codex (options) + Gemini (security/scalability)
// → Recommendation finale avec rationale
// → Draft ADR (Architecture Decision Record)
```

**Métriques à tracker:**

| Métrique | Target | Résultat |
|----------|--------|----------|
| Codex response time | <10s | ___ s |
| Gemini response time | <60s | ___ s |
| Total workflow time | <5 min | ___ min |
| Context preserved | 100% | ✅/❌ |
| Output quality | Production | ✅/❌ |
| Errors | 0 | ___ |

---

### STEP 3: Nouveau Projet Spec-Kit (30-60 min)

**Utiliser architecture validée Step 2**

```bash
# 1. Setup projet
cd ~/Documents/DEV/clients
./setup-project.sh [nom-projet]
cd [nom-projet]

# 2. Constitution (copier résultat Zen MCP)
/speckit.constitution
# → Utiliser tech stack + architecture de Step 2

# 3. Specification
/speckit.specify
# → Définir user stories basées sur requirements

# 4. Clarification (si ambiguïtés)
/speckit.clarify

# 5. Design tokens + wireframes
/speckit.design

# 6. Plan détaillé
/speckit.plan

# 7. Tasks breakdown
/speckit.tasks

# 8. Agents orchestration
/speckit.agents

# 9. Commit & push
git add .
git commit -m "docs: planning complete with Zen MCP validated architecture

Architecture validated through Multi-IA roundtable:
- Codex: 3 options analyzed
- Gemini: Security + scalability reviewed
- Claude: Final decision with rationale

Tech stack: [chosen stack]
Complexity: [score]
Timeline: [estimation]

🚀 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
git push
```

---

### STEP 4: Documentation Session (15 min)

**Créer:** `RESUME-SESSION-2025-10-15.md`

```markdown
# Session 2025-10-15 - Zen MCP Production Validation

## Tests Effectués

### Test 1: Warm-up (Gemini simple query)
- Question: JWT security best practices
- Time: [X]s
- Success: ✅/❌
- Notes: [observations]

### Test 2: Architecture Decision Multi-IA
- Scénario: [nom projet]
- Codex time: [X]s, Success: ✅/❌
- Gemini time: [X]s, Success: ✅/❌
- Context preserved: ✅/❌
- Output quality: [score/10]
- Notes: [observations]

### Test 3: Nouveau Projet Spec-Kit
- Projet: [nom]
- Planning time: [X] min
- Zen MCP intégré: ✅ (Step constitution)
- Tasks generated: [count]
- Issues: [liste ou "none"]

## Validation Production

**Zen MCP Status:** ✅ Production Ready / ⚠️ Partial / ❌ Needs Work

**Rationale:**
[Expliquer pourquoi validation OK ou KO]

## Learnings

### Patterns Gagnants
1. [Pattern 1]: [description] - Time saved: [X] min
2. [Pattern 2]: [description] - Time saved: [X] min

### Issues Rencontrées
1. [Issue 1]: [workaround] - Priority: [P0/P1/P2/P3]
2. [Issue 2]: [workaround] - Priority: [P0/P1/P2/P3]

## Métriques

| Métrique | Target | Result | Status |
|----------|--------|--------|--------|
| Workflows tested | 2+ | [X] | ✅/❌ |
| Success rate | 100% | [X]% | ✅/❌ |
| Time saved | >50% | [X]% | ✅/❌ |
| OAuth issues | 0 | [X] | ✅/❌ |

## Next Actions

- [ ] [Action 1]
- [ ] [Action 2]
- [ ] Update Q4 2025 metrics (workflows count)
- [ ] Plan next test (date + scenario)
```

---

## 🎯 SUCCESS CRITERIA

### Must-Have (Minimum Viable Success)

- ✅ Warm-up test réussi (1/1 CLI works)
- ✅ Architecture decision réussi (3/3 CLI works)
- ✅ Context preservation 100% (Gemini analyse Codex output)
- ✅ Time <5 min total (vs 10-15 min manuel)
- ✅ Output ADR production-ready

### Nice-to-Have (Bonus)

- 🎁 Nouveau projet Spec-Kit complet (<45 min)
- 🎁 Zero OAuth/timeout issues
- 🎁 2+ patterns identifiés pour GOLDEN-PATTERNS.md
- 🎁 Additional use case testé (code review OU investigation)

---

## 📚 QUICK REFERENCE

### Zen MCP Commands

**Architecture Decision:**
```javascript
// Step 1: Codex options
mcp__zen__clink({
  prompt: "Generate 3 architecture options for [feature]",
  cli_name: "codex",
  role: "planner"
})

// Step 2: Gemini review
mcp__zen__clink({
  prompt: "Review for security/scalability: [options]",
  cli_name: "gemini",
  role: "codereviewer"
})

// Step 3: Claude arbitrate (automatic)
```

**Code Review:**
```javascript
mcp__zen__clink({
  prompt: "Review [file] for quality",
  cli_name: "codex",
  role: "codereviewer",
  files: ["path/to/file"]
})

mcp__zen__clink({
  prompt: "Review [file] for security",
  cli_name: "gemini",
  role: "codereviewer",
  files: ["path/to/file"]
})
```

**Investigation:**
```javascript
mcp__zen__thinkdeep({
  prompt: "Investigate [problem]",
  hypothesis: "[hypothesis]",
  model: "gemini-2.5-pro",
  thinking_mode: "max"
})
```

---

## 📊 ROADMAP REMINDER

**Q4 2025 Objectives (Oct-Dec):**
- ✅ Zen MCP validated production (TODAY)
- Week 1-2: 3 client projects with Zen MCP
- Week 3-4: Patterns identification
- Month 3: `/zen-roundtable` slash command

**Target Metrics Q4:**
- Workflows/week: 10-15
- Success rate: >95%
- Time saved/week: 80-195 min

---

## 🔄 APRÈS SESSION

**Immediate:**
- [ ] Commit `RESUME-SESSION-2025-10-15.md`
- [ ] Update roadmap metrics (Q4 2025)
- [ ] Update INDEX-FILES-V4.md (si nouveaux docs)

**This Week:**
- [ ] Test 2-3 projets clients additionnels avec Zen MCP
- [ ] Documenter 2-3 patterns GOLDEN-PATTERNS.md
- [ ] Fix issues (si découverts aujourd'hui)

**Next Week:**
- [ ] Commencer `/zen-roundtable` implementation
- [ ] Mesurer ROI cumulé (time saved)
- [ ] Plan Q1 2026 features

---

**Version:** 1.0
**Date:** 2025-10-15
**Status:** 🟢 Ready
**Priority:** ⭐ VALIDATION PRODUCTION

*Zen MCP Production Validation Day - Let's validate this works! 🚀*
