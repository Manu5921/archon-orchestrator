# Roadmap V6 - Multi-Agent Best-of-Breed

**Version:** V6.0 (Target)
**Date:** 2025-10-16
**Status:** PLANNING
**Estimated Development:** 8-13 days full-time
**Source:** WORKFLOW-EVOLUTION-V6-MULTI-AGENT-OBSERVABILITY.md + FRICTION-REPORT-V5.2-TO-V6.md

---

## 🎯 Vision V6

**Objectif:** Workflow 100% autonome avec observabilité temps-réel et validation closed-loop.

**Slogan:** "Multi-Agent Best-of-Breed with Live Pulse & Self-Healing"

**3 Piliers V6:**
1. **Live Pulse Observability:** Real-time agent activity logging (observability-pulse.jsonl populated)
2. **Closed-Loop Validation:** ACTION → VALIDATE → FIX cycles (auto-correction)
3. **Strict Agent Boundaries:** Filesystem périmètres enforced (violations blocked)

**Gap Principal vs V5.2.1:**
- **F4 (P0 BLOCKER):** Auto-delegation `/implement` (plus de copy-paste manuel)

---

## 📊 V5.2.1 → V6 Gap Analysis

| Feature | V5.2.1 | V6 | Gap |
|---------|--------|----|----|
| Files generation | ✅ 3 files | ✅ Same + pulse logs | Pulse logging |
| Version detection | ✅ Hardcoded V5.2.1 | ✅ Auto from CHANGELOG | Auto-detect |
| Périmètres | ✅ Hardcoded | ✅ Dynamic from plan.md | Dynamic parsing |
| **Delegation** | ❌ **Manual copy-paste** | ✅ **Auto Task tool** | **F4 BLOCKER** |
| Observability | ❌ Empty file | ✅ Live logs | Pulse logging |
| Validation | ⚠️ Manual gates | ✅ Auto ACTION→VALIDATE | Closed-loop |
| Error handling | ⚠️ 3-strike manual | ✅ Self-healing | Auto-correction |
| Overhead | <5 min | **<2 min** | -60% |

---

## 🚀 V6 Development Phases

### Phase 1: Foundation Improvements (1-2 days)

**Objectif:** Finir auto-détection version + périmètres dynamiques

**Tasks:**
- [ ] Auto-detect version from CHANGELOG-V*.md (vs hardcoded)
- [ ] Parse plan.md file structure → map directories to agents
- [ ] Generate périmètres dynamically in ORCHESTRATION.md

**Files modifiés:**
- `.claude/commands/speckit.agents.md` (améliorer Step 5)

**Validation:**
```bash
/speckit.agents
grep "V6.0" ORCHESTRATION.md  # Version auto-détectée
grep "src/custom-dir/" ORCHESTRATION.md  # Périmètres custom du projet
```

**Effort:** 1-2 jours
**Risk:** LOW

---

### Phase 2: Auto-Delegation (3-5 days) ⭐ CRITICAL

**Objectif:** Créer nouvelle commande `/speckit.implement-v6` avec auto-delegation

**Tasks:**

#### 2.1: Créer nouvelle commande (ne PAS modifier /implement base)
- [ ] Créer `.claude/commands/speckit.implement-v6.md`
- [ ] Parser ORCHESTRATION.md (sub-agents, tasks, périmètres)
- [ ] Générer 3 prompts Task tool automatiquement
- [ ] Exécuter 3 Task tool calls en PARALLÈLE (single message)
- [ ] Monitorer completion via AgentOutput
- [ ] Synthèse finale (manifest, patch, memory)

#### 2.2: Workflow auto-delegation

**Pseudo-code:**
```markdown
## /speckit.implement-v6 Workflow

Step 1: Load ORCHESTRATION.md
- Parse sub-agents (backend, frontend, testing)
- Parse task ranges (T001-T069, T070-T092, T139-T157)
- Parse périmètres (allowed/forbidden dirs)

Step 2: Verify Prerequisites
- Check files exist (constitution, spec, tasks, plan, design)
- Abort si manquant

Step 3: Generate Task Tool Prompts (AUTO)
For each agent:
  prompt = `
Implémente {task_range} ({agent}):
- Périmètre: {allowed_dirs}
- Interdit: {forbidden_dirs}
- Context: ORCHESTRATION.md, constitution.md, spec.md, tasks.md, plan.md
- MCP Tools: Context7, ESLint, Memory
- Checkpoints: Every 10 tasks
`

Step 4: Execute Task Tool Calls in PARALLEL (AUTO)
Execute 3 Task tool calls:
- Task(subagent_type='backend-specialist', prompt=backend_prompt)
- Task(subagent_type='frontend-specialist', prompt=frontend_prompt)
- Task(subagent_type='testing-specialist', prompt=testing_prompt)

Step 5: Monitor Completion
Wait for 3 agents to complete
Check observability-pulse.jsonl for status

Step 6: Validate & Synthesize
- npm run build (P0)
- npm run lint (P1)
- npm run test (P2)
- Generate manifest + patch
- Update project-memory.md

Step 7: Report
Output completion status + next steps
```

**Validation:**
```bash
/speckit.implement-v6
# → Auto-délègue aux 3 agents
# → Monitore progression
# → Synthèse finale
# → 0 intervention user ✅
```

**Effort:** 3-5 jours
**Risk:** MEDIUM (Task tool coordination complexe)

---

### Phase 3: Live Pulse Observability (2-3 days)

**Objectif:** Agents écrivent logs real-time dans observability-pulse.jsonl

**Tasks:**

#### 3.1: Pulse Logger Utility
- [ ] Créer `scripts/pulseLogger.cjs`
- [ ] Function: `logAction(agent, action, status, details)`
- [ ] Format JSONL: `{"timestamp":"ISO","agent":"name","action":"type","status":"state","details":{}}`

#### 3.2: Intégrer dans Sub-Agents
- [ ] Modifier prompts agents pour logger actions:
  - task_start, task_complete
  - checkpoint_pass, checkpoint_fail
  - error, auto_fix
  - memory_update

#### 3.3: Parsing & Dashboard (Optionnel)
- [ ] Script `parsePulse.sh` (query logs)
- [ ] Optional: Web dashboard (live monitoring)

**Example logs:**
```jsonl
{"timestamp":"2025-10-16T10:30:00Z","agent":"backend-specialist","action":"task_start","status":"in_progress","details":{"task_id":"T018"}}
{"timestamp":"2025-10-16T10:32:15Z","agent":"backend-specialist","action":"task_complete","status":"success","details":{"task_id":"T018","duration":"135s"}}
{"timestamp":"2025-10-16T10:35:00Z","agent":"backend-specialist","action":"checkpoint_pass","status":"success","details":{"checkpoint":"T020","gates":["build","lint"]}}
{"timestamp":"2025-10-16T10:40:12Z","agent":"frontend-specialist","action":"error","status":"failed","details":{"task_id":"T075","error":"Module not found"}}
{"timestamp":"2025-10-16T10:41:00Z","agent":"frontend-specialist","action":"auto_fix","status":"resolved","details":{"task_id":"T075","solution":"Correct import path"}}
```

**Validation:**
```bash
/speckit.implement-v6
# Pendant exécution:
tail -f observability-pulse.jsonl  # Live logs ✅

# Après exécution:
bash scripts/parsePulse.sh --agent backend-specialist
bash scripts/parsePulse.sh --action error
```

**Effort:** 2-3 jours
**Risk:** LOW

---

### Phase 4: Closed-Loop Validation (2-3 days)

**Objectif:** ACTION → VALIDATE → FIX cycles pour auto-correction

**Tasks:**

#### 4.1: Validation Scripts
- [ ] `scripts/validate-backend-api.sh` (test API endpoints)
- [ ] `scripts/validate-frontend-build.sh` (test build + design tokens)
- [ ] `scripts/validate-tests.sh` (test suite + coverage)
- [ ] `scripts/validate-rls-policies.sh` (test tenant isolation)
- [ ] `scripts/validate-perimetre.sh` (enforce filesystem boundaries)

#### 4.2: Intégrer dans Checkpoints
Modifier checkpoints (every 10 tasks):
```bash
# After task completion
bash scripts/validate-backend-api.sh
if [ $? -ne 0 ]; then
  # FAIL → Agent analyzes error
  # Agent applies fix
  # Agent re-validates
  # If 3 retries fail → ESCALATE
fi
```

#### 4.3: Self-Healing Logic
```markdown
Agent completes task
  ↓
Run validation script
  ↓
If PASS → Continue
  ↓
If FAIL:
  1. Log error to observability-pulse.jsonl
  2. Analyze error (parse validation output)
  3. Apply fix (code change, config update, etc.)
  4. Re-validate
  5. If PASS → Continue
  6. If FAIL (retry 3×) → ESCALATE to human
```

**Example:**
```bash
# T050: Create transactions API endpoint
# Validation:
bash scripts/validate-backend-api.sh transactions
# → ❌ FAIL: RLS policy missing

# Agent auto-fix:
# 1. Creates RLS policy migration
# 2. Re-validates
# → ✅ PASS

# Logged:
{"action":"validation_fail","details":{"error":"RLS missing"}}
{"action":"auto_fix","details":{"solution":"Create RLS policy"}}
{"action":"validation_pass","details":{"retry_attempt":2}}
```

**Validation:**
```bash
# Inject intentional error
# Agent should auto-fix + re-validate ✅
```

**Effort:** 2-3 jours
**Risk:** MEDIUM (error parsing + fix generation complexe)

---

## 📊 V6 ROI Estimation

### Development Effort

| Phase | Effort | Risk | Priority |
|-------|--------|------|----------|
| Phase 1: Foundation | 1-2 days | LOW | P2 |
| Phase 2: Auto-Delegation | 3-5 days | MEDIUM | **P0 CRITICAL** |
| Phase 3: Live Pulse | 2-3 days | LOW | P1 |
| Phase 4: Closed-Loop | 2-3 days | MEDIUM | P1 |
| **TOTAL** | **8-13 days** | MEDIUM | - |

### Performance Impact

| Metric | V5.2.1 | V6 | Improvement |
|--------|--------|----|-----------  |
| Overhead | <5 min | **<2 min** | -60% |
| User intervention | Copy-paste prompt | **0** (full auto) | -100% |
| Error detection | Manual | **Auto** (validation scripts) | Real-time |
| Error correction | Manual | **Auto** (self-healing) | -80% time |
| Observability | None | **Live logs** | Full transparency |
| Agent conflicts | Risk exists | **0** (périmètres enforced) | -100% |

### User Experience

| Feature | V5.2.1 | V6 |
|---------|--------|---|
| Launch implementation | `/implement` + paste | `/speckit.implement-v6` (1 command) |
| Monitor progress | Poll agents | `tail -f observability-pulse.jsonl` |
| Debug errors | Manual investigation | Query logs (`parsePulse.sh`) |
| Fix errors | Manual intervention | Auto-correction (self-healing) |
| Validate quality | Manual gates | Auto ACTION→VALIDATE |

---

## 🎯 V6 Success Criteria

**Code Quality:**
- [ ] `/speckit.implement-v6` auto-délègue 3 agents (0 manual)
- [ ] observability-pulse.jsonl populated real-time
- [ ] Validation scripts detect 100% critical errors
- [ ] Self-healing fixes ≥80% common errors
- [ ] Filesystem périmètres enforced (0 violations)

**Performance:**
- [ ] Overhead <2 min (vs <5 min V5.2.1)
- [ ] Error detection real-time (vs manual)
- [ ] Auto-correction 80%+ (vs 0% V5.2.1)

**User Experience:**
- [ ] 1 command launch (`/speckit.implement-v6`)
- [ ] Live monitoring (`tail -f observability-pulse.jsonl`)
- [ ] Easy debugging (query logs)
- [ ] Minimal intervention (self-healing)

---

## 🔄 Migration Path V5.2.1 → V6

### Option A: Créer nouvelle commande (RECOMMANDÉ - SAFE)

**Avantage:** 0 breaking changes, backward compatible

```bash
# V5.2.1 workflow (still works)
/speckit.agents → implementation-prompt.md
/implement [paste]

# V6 workflow (new command)
/speckit.agents → ORCHESTRATION.md + implementation-prompt.md + observability-pulse.jsonl
/speckit.implement-v6  # Auto-delegation ✅
```

**Files:**
- Créer: `.claude/commands/speckit.implement-v6.md`
- Conserver: `.claude/commands/speckit.implement.md` (base Spec-Kit inchangé)

---

### Option B: Modifier commande existante (RISK)

**Avantage:** 1 seule commande `/implement`

**Inconvénient:** Breaking changes possibles

```bash
# Modifier `.claude/commands/speckit.implement.md`
# Détecter si ORCHESTRATION.md existe:
#   - Si OUI → V6 auto-delegation
#   - Si NON → V5 behavior (accept pasted prompt)
```

**Risk:** MEDIUM (compatibilité Spec-Kit base)

---

## 📝 Recommandation Stratégie V6

### Phase 2 (Auto-Delegation) = PRIORITÉ P0

**Pourquoi:**
- **80% du ROI V6** (overhead -60%, user intervention -100%)
- Débloque observability + validation (Phases 3-4 dépendent de Phase 2)
- F4 BLOCKER actuel le plus impactant

**Approche recommandée:**
1. Créer `/speckit.implement-v6` (nouvelle commande, SAFE)
2. Tester sur 2-3 projets (validation robustesse)
3. Si succès → Déprécier ancien workflow
4. Si issues → Rollback facile (V5.2.1 still works)

### Phases 3-4 (Observability + Validation) = NICE TO HAVE

**Pourquoi:**
- Améliorations incrémentales (pas bloquantes)
- Peuvent être développées en parallèle Phase 2
- ROI moyen vs effort

**Approche:**
- Phase 3 (Pulse logging) = LOW risk, développement en parallèle OK
- Phase 4 (Closed-loop) = MEDIUM risk, après Phase 2 stabilisée

---

## 🚀 Next Steps

### Immédiat (User - Avant V6)

1. **Tester V5.2.1 sur projet réel:**
   ```bash
   cd /Users/manu/Documents/DEV/flowgenius3
   /speckit.agents
   cat implementation-prompt.md
   /implement [paste]
   ```

2. **Valider ROI V5.2.1:**
   - Overhead <5 min? ✅
   - Fichiers créés? ✅
   - Périmètres OK? ✅

3. **Consulter Gemini:**
   - Partager WORKFLOW-V5.2.1-EXACT.md
   - Partager ROADMAP-V6.md (ce fichier)
   - Demander feedback stratégie V6

### Court terme (1-2 semaines - Phase 1)

1. **Améliorer auto-détection:**
   - Version from CHANGELOG
   - Périmètres from plan.md

2. **Tester robustesse V5.2.1:**
   - 2-3 projets différents
   - Documenter frictions restantes

### Moyen terme (1-2 mois - Phase 2)

1. **Développer auto-delegation:**
   - Créer `/speckit.implement-v6`
   - Parser ORCHESTRATION.md
   - Exécuter Task tool calls parallèles
   - Tester sur projets pilotes

2. **Valider ROI:**
   - Overhead <2 min?
   - 0 intervention user?
   - Robustesse acceptable?

### Long terme (2-3 mois - Phases 3-4)

1. **Ajouter observability:**
   - pulseLogger.cjs
   - Logs real-time
   - Optional dashboard

2. **Ajouter validation:**
   - Scripts validation
   - Closed-loop ACTION→VALIDATE
   - Self-healing

---

## 📊 Comparison V5.2.1 vs V6

| Feature | V5.2.1 (Now) | V6 (Target) |
|---------|--------------|-------------|
| **Launch** | /implement + paste | /speckit.implement-v6 |
| **User effort** | Copy-paste prompt | 0 (full auto) |
| **Overhead** | <5 min | **<2 min** |
| **Observability** | None | Live logs |
| **Error detection** | Manual | Auto real-time |
| **Error correction** | Manual | Self-healing 80%+ |
| **Agent conflicts** | Risk | 0 (enforced) |
| **Development** | 40 min (DONE) | 8-13 days |
| **Risk** | MINIMAL | MEDIUM |
| **Breaking changes** | 0 | 0 (if new command) |

**V5.2.1 = 80% V6 ROI avec 10% effort** ✅

**V6 = 100% autonomie mais 100× effort** ⚠️

---

## ✅ Conclusion

**V5.2.1 Status:** ✅ PRODUCTION READY (quick wins, 0 risk)

**V6 Roadmap:** 8-13 days développement, priorité Phase 2 (auto-delegation)

**Recommandation:**
1. **Court terme:** Utiliser V5.2.1 (ROI excellent, 0 risk)
2. **Moyen terme:** Développer Phase 2 V6 (auto-delegation = 80% ROI)
3. **Long terme:** Ajouter Phases 3-4 si besoin (observability + validation)

**Next:** Consulter Gemini pour validation stratégie 🎯

---

**Generated:** 2025-10-16
**Status:** PLANNING
**Effort:** 8-13 days (Phase 2 = 3-5 days = 80% ROI)

🚀 **V6 = Full autonomy with live pulse & self-healing** 🚀
