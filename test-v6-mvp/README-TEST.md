# Test V6 MVP - Guide d'Exécution

**Date:** 2025-10-16
**Objectif:** Valider `/speckit.final` avec projet synthétique

---

## ✅ Prérequis Vérifiés

Tous les fichiers requis sont présents:

```bash
✅ ORCHESTRATION.md (5.5KB - 3 agents: backend, frontend, testing)
✅ .specify/memory/constitution.md (727B)
✅ specs/001-mvp/spec.md (980B)
✅ specs/001-mvp/tasks.md (582B - 10 tasks T001-T010)
✅ specs/001-mvp/plan.md (1.6KB)
✅ design/design-tokens.json (1.1KB)
✅ project-memory.md (2.4KB)
✅ observability-pulse.jsonl (0B - vide, prêt)
✅ CLAUDE.md (22KB - copie du workflow)
```

---

## 🚀 Comment Lancer le Test

### Étape 1: Se Placer dans le Projet Test

```bash
cd /Users/manu/Documents/DEV/archon-orchestrator
```

**IMPORTANT:** Ne pas `cd` dans `test-v6-mvp/` - la commande `/speckit.final` doit être lancée depuis le contexte Claude Code qui a accès aux scripts.

### Étape 2: Lancer la Commande

Dans Claude Code, lance:

```
/speckit.final
```

**Puis indique le contexte:**
```
Project path: test-v6-mvp/
```

---

## 🔍 Ce Que la Commande VA Faire

**Step 1: Prerequisites Check**
- ✅ Vérifier les 8 fichiers requis
- ✅ Afficher "✅ Prerequisites verified"

**Step 2: Initialize Pulse Logger**
- ✅ Charger scripts/pulseLogger.cjs
- ✅ Clear observability-pulse.jsonl (vide)
- ✅ Logger orchestration_start

**Step 3: Parse ORCHESTRATION.md**
- ✅ Extraire 3 agents (backend-specialist, frontend-specialist, testing-specialist)
- ✅ Extraire tasks ranges (T001-T004, T005-T008, T009-T010)
- ✅ Extraire périmètres (allowed/forbidden directories)

**Step 4: Load Context Files**
- ✅ Lire 8 fichiers (constitution, spec, tasks, plan, design, memory, CLAUDE, ORCHESTRATION)
- ✅ Extraire metadata (project name, task count, tech stack)

**Step 5: Execute Agents Sequentially**

⚠️ **MOCK MODE** (ne lance PAS les vrais Task tools pour ce test)

Au lieu de lancer les vrais agents, la commande va **simuler** l'exécution:

```javascript
// Pour chaque agent:
pulse.logStart(agent.name, { tasks, duration_estimate });

// SIMULER l'exécution (pas de vrai Task tool)
console.log(`🤖 [MOCK] Executing ${agent.name}...`);
await sleep(2000); // Simuler 2s de travail

// Logger la fin
pulse.logEnd(agent.name, { duration_s: 2, tasks_completed: agent.tasks });

// MOCK checkpoints
pulse.logCheckpoint('build', 'pass', { agent: agent.name });
pulse.logCheckpoint('lint', 'pass', { agent: agent.name });
pulse.logCheckpoint('test', 'pass', { agent: agent.name });
```

**Step 6: Final Validation**
- ✅ Afficher "Final validation complete" (mock)

**Step 7: Generate Summary**
- ✅ Afficher le summary (total events, agents count, errors, checkpoints, duration)

**Step 8: User Notification**
- ✅ Afficher le message de complétion avec métriques

---

## 📊 Résultats Attendus

### 1. Console Output

```
✅ Prerequisites verified (8 files)
✅ Pulse logger initialized

🔍 Parsing ORCHESTRATION.md...
   Found 3 agents:
   - backend-specialist (T001-T004)
   - frontend-specialist (T005-T008)
   - testing-specialist (T009-T010)

📚 Loading context files...
   Project: Test V6 MVP
   Tasks: 10
   Tech Stack: React 18, Node.js, Supabase

🤖 Executing agents sequentially...

🚀 [1/3] backend-specialist
   Tasks: T001-T004 (4 tasks)
   Duration estimate: 20 min
   [MOCK] Executing... 2s
   ✅ Completed
   Checkpoints: build ✅ | lint ✅ | test ✅

🚀 [2/3] frontend-specialist
   Tasks: T005-T008 (4 tasks)
   Duration estimate: 20 min
   [MOCK] Executing... 2s
   ✅ Completed
   Checkpoints: build ✅ | lint ✅ | test ✅

🚀 [3/3] testing-specialist
   Tasks: T009-T010 (2 tasks)
   Duration estimate: 10 min
   [MOCK] Executing... 2s
   ✅ Completed
   Checkpoints: build ✅ | lint ✅ | test ✅

═══════════════════════════════════════════════════
  ORCHESTRATION COMPLETE - V6 MVP
═══════════════════════════════════════════════════

📊 SUMMARY:
   Total Events:     16
   Agents Executed:  3
   Errors:           0
   Checkpoints:      9 pass | 0 fail | 0 skip
   Duration:         0m 6s (6s total)

📅 VIEW TIMELINE:
   ./scripts/viewPulse.sh

✅ NO ERRORS - Implementation successful!

🎯 NEXT STEPS:
   1. Review implementation: git diff
   2. Manual testing: pnpm dev
   3. Create PR: gh pr create

═══════════════════════════════════════════════════

✅ /speckit.final COMPLETE

**Workflow:** V6 MVP (Sequential Execution)
**Agents:** 3 executed
**Duration:** 0m 6s
**Status:** SUCCESS ✅

**Time Saved vs V5.2.1:** -5 to -10 minutes ✅
```

### 2. Fichier observability-pulse.jsonl

```jsonl
{"type":"orchestration_start","workflow":"V6-MVP","execution":"sequential","timestamp":"2025-10-16T..."}
{"type":"agent_start","agent":"backend-specialist","timestamp":"2025-10-16T...","context":{"tasks":"T001-T004"}}
{"type":"checkpoint","gate":"build","status":"pass","timestamp":"2025-10-16T...","details":{"agent":"backend-specialist"}}
{"type":"checkpoint","gate":"lint","status":"pass","timestamp":"2025-10-16T...","details":{"agent":"backend-specialist"}}
{"type":"checkpoint","gate":"test","status":"pass","timestamp":"2025-10-16T...","details":{"agent":"backend-specialist"}}
{"type":"agent_end","agent":"backend-specialist","timestamp":"2025-10-16T...","result":{"duration_s":2}}
{"type":"agent_start","agent":"frontend-specialist","timestamp":"2025-10-16T...","context":{"tasks":"T005-T008"}}
{"type":"checkpoint","gate":"build","status":"pass","timestamp":"2025-10-16T...","details":{"agent":"frontend-specialist"}}
{"type":"checkpoint","gate":"lint","status":"pass","timestamp":"2025-10-16T...","details":{"agent":"frontend-specialist"}}
{"type":"checkpoint","gate":"test","status":"pass","timestamp":"2025-10-16T...","details":{"agent":"frontend-specialist"}}
{"type":"agent_end","agent":"frontend-specialist","timestamp":"2025-10-16T...","result":{"duration_s":2}}
{"type":"agent_start","agent":"testing-specialist","timestamp":"2025-10-16T...","context":{"tasks":"T009-T010"}}
{"type":"checkpoint","gate":"build","status":"pass","timestamp":"2025-10-16T...","details":{"agent":"testing-specialist"}}
{"type":"checkpoint","gate":"lint","status":"pass","timestamp":"2025-10-16T...","details":{"agent":"testing-specialist"}}
{"type":"checkpoint","gate":"test","status":"pass","timestamp":"2025-10-16T...","details":{"agent":"testing-specialist"}}
{"type":"agent_end","agent":"testing-specialist","timestamp":"2025-10-16T...","result":{"duration_s":2}}
{"type":"orchestration_end","workflow":"V6-MVP","execution":"sequential","agents_count":3,"timestamp":"2025-10-16T..."}
```

### 3. Timeline Viewer

```bash
cd test-v6-mvp
../scripts/viewPulse.sh
```

**Output attendu:**
- Timeline formatée avec couleurs
- 3 agents affichés avec leurs timestamps
- 9 checkpoints (3 par agent)
- Duration: 6s
- Status: SUCCESS (0 errors)

---

## ✅ Critères de Validation

**Must Pass:**
- [ ] Prerequisites check passes (8 files)
- [ ] ORCHESTRATION.md parsed correctly (3 agents extracted)
- [ ] Context files loaded (no errors)
- [ ] 3 agents executed sequentially (backend → frontend → testing)
- [ ] 9 checkpoints logged (build + lint + test per agent)
- [ ] observability-pulse.jsonl populated (16 events)
- [ ] viewPulse.sh displays timeline correctly
- [ ] Summary displays correct metrics

**Optional (Nice-to-Have):**
- [ ] Agent prompts contain all 8 sections
- [ ] Filesystem périmètres extracted correctly
- [ ] MCP tools strategy extracted

---

## 🐛 Debugging

Si erreur:

1. **Prerequisites fail:**
   ```bash
   # Vérifier fichiers présents
   ls -lh test-v6-mvp/ORCHESTRATION.md
   # Re-créer si manquant
   ```

2. **Parsing fail:**
   ```bash
   # Lire ORCHESTRATION.md
   cat test-v6-mvp/ORCHESTRATION.md | grep "backend-specialist"
   ```

3. **Pulse logger fail:**
   ```bash
   # Tester pulseLogger manually
   node -e "const p = require('./scripts/pulseLogger.cjs'); p.logStart('test', {});"
   cat observability-pulse.jsonl
   ```

4. **Timeline fail:**
   ```bash
   # Vérifier jq installé
   which jq
   # Installer si manquant: brew install jq
   ```

---

## 🎯 Prochaines Étapes Après Test

**Si test PASS:**
1. Documenter résultats dans CHANGELOG-V6-MVP.md
2. Passer à Jour 3 (documentation workflow V6)
3. Mettre à jour CLAUDE.md (mention /speckit.final)

**Si test FAIL:**
1. Analyser erreur dans observability-pulse.jsonl
2. Fixer bug dans .claude/commands/speckit.final.md
3. Re-tester

---

**Version:** V6 MVP Test Synthétique
**Durée estimée:** 5-10 min
**Prêt:** ✅ Tous les fichiers en place
