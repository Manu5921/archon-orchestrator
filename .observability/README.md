# 🔍 Observability Infrastructure

**Version:** 1.0
**Date:** 2025-10-05

Infrastructure de traçabilité et monitoring pour workflows multi-agents Archon.

---

## 📂 Structure

```bash
.observability/
├── logs.ndjson                    # Logs structurés NDJSON (tous événements)
├── workflows/                     # État par workflow
│   └── {wf_run_id}.json          # Trace complète workflow
└── costs/
    └── daily-{date}.json         # Agrégation coûts journaliers
```

---

## 📊 Format Logs NDJSON

**Un événement par ligne, format JSON:**

```jsonl
{"ts":"2025-10-05T14:32:00Z","wf_run_id":"550e8400...","event":"workflow_start","user_prompt":"Implement auth","project":"LocalAI SEO"}
{"ts":"2025-10-05T14:32:05Z","wf_run_id":"550e8400...","event":"agent_delegate","from":"orchestrator","to":"design-specialist","span_id":"design-001"}
{"ts":"2025-10-05T14:35:12Z","wf_run_id":"550e8400...","event":"agent_complete","agent":"design-specialist","span_id":"design-001","status":"✅","tokens_in":1234,"tokens_out":4321,"model":"sonnet","duration_sec":187}
```

**Types d'événements:**
- `workflow_start` - Démarrage workflow
- `agent_delegate` - Délégation à sub-agent
- `agent_complete` - Agent terminé
- `quality_gate` - Exécution quality gate
- `handoff` - Transfert entre agents
- `budget_exceeded` - Dépassement budget
- `error` - Erreur bloquante

---

## 🔍 Requêtes Utiles

### Analyser un workflow spécifique

```bash
# État complet
cat .observability/workflows/{wf_run_id}.json | jq .

# Timeline événements
grep "{wf_run_id}" .observability/logs.ndjson | jq -s 'sort_by(.ts)'

# Coût total
jq '.cost_summary' .observability/workflows/{wf_run_id}.json
```

### Statistiques globales

```bash
# Coût journalier
grep "$(date +%Y-%m-%d)" .observability/logs.ndjson | \
  jq -s 'map(select(.event=="agent_complete")) | map(.cost_usd // 0) | add'

# Agent le plus utilisé
jq -s 'map(select(.event=="agent_complete")) | group_by(.agent) |
  map({agent: .[0].agent, count: length}) | sort_by(.count) | reverse' \
  .observability/logs.ndjson | head -20

# Temps moyen par agent
jq -s 'map(select(.event=="agent_complete")) | group_by(.agent) |
  map({agent: .[0].agent, avg_duration_sec: (map(.duration_sec) | add / length)})' \
  .observability/logs.ndjson
```

### Quality Gates

```bash
# Quality gates échoués aujourd'hui
grep "$(date +%Y-%m-%d)" .observability/logs.ndjson | \
  jq -s 'map(select(.event=="quality_gate" and .status=="❌"))'

# Taux de succès par gate
jq -s 'map(select(.event=="quality_gate")) | group_by(.gate) |
  map({
    gate: .[0].gate,
    total: length,
    passed: (map(select(.status=="✅")) | length),
    failed: (map(select(.status=="❌")) | length)
  })' .observability/logs.ndjson
```

---

## 💰 Gestion Coûts

### Coût par projet

```bash
jq -s 'map(select(.event=="agent_complete")) | group_by(.project) |
  map({
    project: .[0].project,
    workflows: (map(.wf_run_id) | unique | length),
    total_cost: (map(.cost_usd // 0) | add)
  })' .observability/logs.ndjson
```

### Coût par modèle

```bash
jq -s 'map(select(.event=="agent_complete")) | group_by(.model) |
  map({
    model: .[0].model,
    runs: length,
    total_cost: (map(.cost_usd // 0) | add),
    avg_cost: (map(.cost_usd // 0) | add / length)
  })' .observability/logs.ndjson
```

---

## 🎯 Maintenance

### Rotation Logs (hebdomadaire)

```bash
# Archiver logs >7 jours
find .observability/logs.ndjson -mtime +7 -exec gzip {} \;

# Cleanup workflows terminés >30 jours
find .observability/workflows/ -name "*.json" -mtime +30 -delete
```

### Backup

```bash
# Backup journalier
tar -czf backups/observability-$(date +%Y-%m-%d).tar.gz .observability/
```

---

## 📚 Références

- [SUB-AGENTS-MASTERY.md](../docs/SUB-AGENTS-MASTERY.md) - Guide complet
- Section "Observabilité & Traçage"
