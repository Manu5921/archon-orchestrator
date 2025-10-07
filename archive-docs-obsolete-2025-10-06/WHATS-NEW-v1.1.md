# 🎉 What's New - Version 1.1.0

**Date:** 2025-10-05
**Focus:** Observabilité, Coûts, Quality Gates & Test Harness

---

## 🚀 Nouveautés Majeures

### 1. 🔍 Observabilité Complète

**Infrastructure de traçage bout-en-bout pour workflows multi-agents**

✅ **Logs NDJSON structurés** (`.observability/logs.ndjson`)
- Tous les événements: workflow_start, agent_delegate, agent_complete, quality_gate, handoff
- Format machine-readable pour analytics
- Queryable avec jq

✅ **Trace Context propagation**
- `wf_run_id` unique par workflow
- `span_id` par agent
- Timestamps ISO 8601

✅ **État workflow persistant** (`.observability/workflows/{wf_run_id}.json`)
- État agents
- Quality gates status
- Cost summary

**Fichiers:**
- `.observability/` - Infrastructure complète
- `.observability/README.md` - Guide queries
- `docs/SUB-AGENTS-MASTERY.md` - Section Observabilité

---

### 2. 💰 Gestion Coûts & Budgets

**Protection contre explosion coûts dans workflows complexes**

✅ **Cost Policy frontmatter**
```yaml
cost_policy:
  max_wf_tokens: 3_000_000      # Budget workflow
  max_agent_tokens: 400_000     # Budget agent
  block_if_exceeds: true
  notify_over: 0.8
```

✅ **Calcul coûts automatique**
- Script `scripts/utils/calculate-cost.sh`
- Tarifs Haiku/Sonnet/Opus
- Tracking tokens in/out par agent

✅ **Budget enforcement**
- Hard stop si dépassement
- Alert à 80%
- Model downgrade auto (Opus→Sonnet si >70%)

✅ **Rapports coûts**
- Agrégation journalière
- Par agent, par modèle, par projet
- Timeline coûts

**Fichiers:**
- `scripts/utils/calculate-cost.sh` - Helper calcul
- Section "Gestion Coûts" dans SUB-AGENTS-MASTERY.md

---

### 3. ✅ Quality Gates Exécutables

**Gates machine-enforced, plus seulement documentation**

✅ **Configuration JSON** (`.quality-gates/gates.json`)
```json
{
  "design-specialist": {
    "P0": [
      {
        "name": "tokens schema valid",
        "cmd": "pnpm tokens:validate",
        "expect_exit": 0,
        "timeout": 10,
        "blocking": true
      }
    ]
  }
}
```

✅ **Runner automatisé** (`scripts/run-quality-gates.sh`)
- Execute gates avec timeout
- Exit codes: 0 (pass), 1 (non-blocking fail), 2 (blocking fail)
- Logging NDJSON

✅ **Integration agents**
- Pre-handoff validation
- Blocage automatique si gate critique échoue
- Warnings pour gates non-blocking

**Fichiers:**
- `.quality-gates/gates.json` - Config gates
- `scripts/run-quality-gates.sh` - Runner
- Section "Quality Gates Exécutables" dans SUB-AGENTS-MASTERY.md

---

### 4. 🧪 Test Harness (Structure)

**Validation automatisée agents + workflows**

✅ **Format tests agents** (JSON fixtures + oracles)
```json
{
  "name": "tokens-generation-from-template",
  "agent": "design-specialist",
  "prompt": "Generate design tokens...",
  "expect": {
    "status": "✅",
    "artifacts": [".design/tokens.json"],
    "quality_gates": ["tokens schema valid"]
  }
}
```

✅ **Format tests workflows**
- Pattern séquentiel/parallel/iteratif
- Quality gates globaux
- Budgets temps + coûts

✅ **Runner test-agent.sh**
- Setup workspace
- Validation artifacts
- Schema checks
- Quality gates execution

**Fichiers:**
- Section "Test Harness" dans SUB-AGENTS-MASTERY.md
- Templates tests fournis

---

## 📊 Métriques d'Impact

### Observabilité
- **Avant:** Aucune visibilité workflows, débogage impossible
- **Après:** Trace complète, timeline, coûts, analytics queries

### Coûts
- **Avant:** Risque explosion coûts (boucles Opus)
- **Après:** Hard limits, alerts, auto-downgrade, rapports

### Quality
- **Avant:** Gates documentés mais non enforcés
- **Après:** Blocage automatique, logs, taux succès mesurables

### Tests
- **Avant:** Tests manuels, reproductibilité faible
- **Après:** Fixtures, oracles, CI/CD ready

---

## 🎯 Quick Start

### 1. Utiliser Observabilité

```bash
# Workflow commence
wf_run_id=$(uuidgen)
echo "{\"ts\":\"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",\"wf_run_id\":\"${wf_run_id}\",\"event\":\"workflow_start\",\"user_prompt\":\"My task\"}" \
  >> .observability/logs.ndjson

# Après workflow
cat .observability/workflows/${wf_run_id}.json | jq .
```

### 2. Vérifier Coûts

```bash
# Coût aujourd'hui
grep "$(date +%Y-%m-%d)" .observability/logs.ndjson | \
  jq -s 'map(select(.event=="agent_complete")) | map(.cost_usd // 0) | add'

# Calculer coût agent
./scripts/utils/calculate-cost.sh sonnet 1234 4321
```

### 3. Exécuter Quality Gates

```bash
# Run gates P0 pour design-specialist
./scripts/run-quality-gates.sh design-specialist P0

# Avec workflow ID (pour logging)
./scripts/run-quality-gates.sh design-specialist P0 ${wf_run_id}
```

---

## 📚 Documentation

### Mise à Jour

**SUB-AGENTS-MASTERY.md v1.1:**
- ✅ 4 nouvelles sections (Observabilité, Coûts, Quality Gates, Test Harness)
- ✅ ~1000 lignes de contenu pratique
- ✅ Scripts prêts à l'emploi
- ✅ Exemples complets

### Nouveaux Fichiers

```bash
docs/
└── SUB-AGENTS-MASTERY.md         # v1.1 (updated)

.observability/
├── README.md                     # Guide queries
├── logs.ndjson                   # Logs événements
├── workflows/                    # États workflows
└── costs/                        # Rapports coûts

.quality-gates/
└── gates.json                    # Config gates agents

scripts/
├── run-quality-gates.sh          # Runner gates
└── utils/
    └── calculate-cost.sh         # Helper coûts
```

---

## 🔄 Migration v1.0 → v1.1

### Agents Existants

**Ajouter au frontmatter:**
```yaml
---
version: 1.1.0
cost_policy:
  max_wf_tokens: 3_000_000
  max_agent_tokens: 400_000
  block_if_exceeds: true
---
```

**Ajouter Observability Protocol:**
```yaml
## Observability Protocol

When delegating:
- Generate wf_run_id
- Log to .observability/logs.ndjson
- Update workflow state
```

**Ajouter Pre-Handoff Gates:**
```yaml
## Handoff Rules

**Pre-Handoff Quality Gates:**
./scripts/run-quality-gates.sh {agent-name} P0 ${wf_run_id}
```

### Projets Existants

```bash
# 1. Copier infrastructure
cp -r .observability/ {your-project}/
cp -r .quality-gates/ {your-project}/
cp scripts/run-quality-gates.sh {your-project}/scripts/
cp scripts/utils/calculate-cost.sh {your-project}/scripts/utils/

# 2. Configurer gates
# Éditer .quality-gates/gates.json selon vos agents

# 3. Tester
./scripts/run-quality-gates.sh design-specialist P0
```

---

## 🎉 Résumé

**Version 1.1 transforme Archon en plateforme industrielle:**

✅ **Observabilité** → Débogage facile, analytics, métriques
✅ **Coûts** → Protection budget, rapports, optimisation auto
✅ **Quality** → Gates enforcés, taux succès mesurables
✅ **Tests** → Reproductibilité, CI/CD, validation auto

**Impact:** Workflows multi-agents deviennent **observables, prévisibles, et contrôlables**.

---

**Prochaines Étapes:**
1. Tester observabilité sur 1 workflow réel
2. Calibrer budgets coûts par pattern
3. Implémenter 2-3 tests golden par agent critique
4. Monitorer métriques pendant 1 semaine

**Feedback:** Ouvrir issue sur GitHub ou contacter maintainer.

---

**Version:** 1.1.0
**Date:** 2025-10-05
**Maintainers:** Claude Assistant + Manu
