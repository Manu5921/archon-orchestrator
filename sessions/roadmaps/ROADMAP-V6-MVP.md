# Roadmap V6 MVP - Archon Orchestrator

**Version:** V6 MVP "Final Automation"
**Date:** 2025-10-16
**Durée estimée:** 3-4 jours
**Status:** 📋 Planifié

---

## 🎯 Objectif MVP

**Supprimer F4 (délégation manuelle) en automatisant complètement l'implémentation.**

**Avant (V5.2.1):**
```bash
/speckit.agents  # Génère ORCHESTRATION.md + implementation-prompt.md
# → User copie-colle implementation-prompt.md dans /implement manuellement
/implement       # Exécute avec prompt collé
```

**Après (V6 MVP):**
```bash
/speckit.agents  # Génère ORCHESTRATION.md + observability-pulse.jsonl (vide)
/speckit.final   # 🆕 Lit ORCHESTRATION.md, lance agents séquentiellement
```

**Gain:** -5 à -10 minutes par projet + 0 risque d'erreur copier-coller

---

## 📐 Architecture V6 MVP

### Nouveaux Fichiers

```
.claude/commands/
├── speckit.final.md           # 🆕 Commande finale automatisée
└── speckit.agents.md          # ✏️  Modifié: génère pulse.jsonl vide

scripts/
├── pulseLogger.cjs            # 🆕 Logger structuré JSONL
└── viewPulse.sh               # 🆕 Viewer logs (helper debug)

[project-root]/
└── observability-pulse.jsonl  # 🆕 Logs temps réel agents
```

### Flow V6 MVP

```
┌─────────────────────────────────────────────────────────────┐
│ /speckit.agents                                             │
│ ├─ Génère ORCHESTRATION.md (stratégie + périmètres)        │
│ └─ Génère observability-pulse.jsonl (vide)                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ /speckit.final 🆕                                           │
│ ├─ Parse ORCHESTRATION.md                                  │
│ ├─ Extrait: agents list + périmètres + strategy            │
│ ├─ Charge: CLAUDE.md + constitution.md + spec.md + tasks.md│
│ └─ Lance agents SÉQUENTIELLEMENT via Task tool:            │
│    ├─ backend-specialist                                   │
│    │  └─ Log: pulse.start("backend")                       │
│    │  └─ Checkpoint: pnpm build (si files in src/)         │
│    │  └─ Log: pulse.end("backend", {duration, files})      │
│    ├─ frontend-specialist                                  │
│    │  └─ Log: pulse.start("frontend")                      │
│    │  └─ Checkpoint: pnpm lint (si files in src/)          │
│    │  └─ Log: pulse.end("frontend", {duration, files})     │
│    └─ testing-specialist                                   │
│       └─ Log: pulse.start("testing")                       │
│       └─ Checkpoint: pnpm test (après impl)                │
│       └─ Log: pulse.end("testing", {duration, tests})      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ observability-pulse.jsonl (populated)                       │
│ {"type":"start","agent":"backend","timestamp":"..."}       │
│ {"type":"checkpoint","gate":"build","status":"pass"}       │
│ {"type":"end","agent":"backend","duration_s":450}          │
│ ...                                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Plan de Développement (3-4 jours)

### **Jour 1: Fondations Logger + Parser**

**Objectif:** Infrastructure logging + parsing ORCHESTRATION.md

**Tâches:**
1. ✅ Créer `scripts/pulseLogger.cjs`
   - Fonction `logStart(agentId, context)`
   - Fonction `logEnd(agentId, result)`
   - Fonction `logError(agentId, error)`
   - Fonction `logCheckpoint(gate, status)`
   - Format: JSONL (1 ligne = 1 event)

2. ✅ Créer `scripts/viewPulse.sh`
   - Parse pulse.jsonl
   - Affiche timeline agents
   - Highlight erreurs en rouge

3. ✅ Tests logger
   ```bash
   node -e "require('./scripts/pulseLogger.cjs').logStart('test', {})"
   cat observability-pulse.jsonl  # Doit contenir 1 ligne JSON
   ```

**Livrable J1:**
- ✅ pulseLogger.cjs fonctionnel
- ✅ Tests manuels OK
- ✅ Format JSONL validé

---

### **Jour 2: Commande /speckit.final (séquentiel)**

**Objectif:** Créer nouvelle commande qui automatise délégation

**Tâches:**
1. ✅ Créer `.claude/commands/speckit.final.md`
   - Lire ORCHESTRATION.md (extraire agents)
   - Lire CLAUDE.md, constitution.md, spec.md, tasks.md
   - Construire context pour chaque agent

2. ✅ Implémenter séquence séquentielle
   ```javascript
   for (const agent of agents) {
     await pulseLogger.logStart(agent.id);
     await launchAgent(agent);  // Via Task tool
     await pulseLogger.logEnd(agent.id);
   }
   ```

3. ✅ Intégrer checkpoints basiques
   - Après backend: `pnpm build`
   - Après frontend: `pnpm lint`
   - Après testing: `pnpm test`

**Livrable J2:**
- ✅ Commande `/speckit.final` créée
- ✅ Agents lancés séquentiellement
- ✅ Logs dans pulse.jsonl

---

### **Jour 3: Tests + Validation + Documentation**

**Objectif:** Valider workflow complet sur projet test

**Tâches:**
1. ✅ Test end-to-end sur FlowGenius3 (ou nouveau projet test)
   ```bash
   /zen-roundtable "Brief: Simple todo app"
   /speckit.constitution
   /speckit.specify
   /speckit.design
   /speckit.plan
   /speckit.tasks
   /speckit.agents
   /speckit.final  # 🆕 Test automatisation complète
   ```

2. ✅ Validation critères succès
   - ✅ 3 agents terminent sans erreur
   - ✅ Checkpoints passent (build, lint, test)
   - ✅ pulse.jsonl contient timeline complète
   - ✅ Code généré compile et tests passent

3. ✅ Documentation
   - Créer `WORKFLOW-V6-MVP.md` (workflow complet)
   - Mise à jour `CLAUDE.md` (mention /speckit.final)
   - Créer guide migration V5.2.1 → V6 MVP

**Livrable J3:**
- ✅ Workflow V6 MVP validé sur projet test
- ✅ Documentation complète
- ✅ Prêt pour production

---

### **Jour 4 (optionnel): Polish + Rollback Strategy**

**Objectif:** Robustesse + stratégie rollback

**Tâches:**
1. ✅ Gestion erreurs
   - Si agent échoue → log error + arrêt propre
   - Si checkpoint fail → log + continuer OU arrêter (configurable)

2. ✅ Rollback strategy
   - Documenter: Si V6 échoue → revenir à V5.2.1
   - Garder `/implement` disponible (deprecated mais fonctionnel)

3. ✅ Métriques baseline
   - Mesurer durée V5.2.1 vs V6 MVP
   - Documenter dans CHANGELOG-V6-MVP.md

**Livrable J4:**
- ✅ Stratégie rollback documentée
- ✅ Métriques de comparaison
- ✅ V6 MVP production-ready

---

## 📋 Checklist Validation MVP

### Fonctionnel
- [ ] `/speckit.final` lit ORCHESTRATION.md correctement
- [ ] 3 agents lancés séquentiellement (backend → frontend → testing)
- [ ] Checkpoints exécutés (build, lint, test)
- [ ] Logs dans observability-pulse.jsonl complets
- [ ] viewPulse.sh affiche timeline lisible

### Qualité
- [ ] pnpm build → PASS après backend
- [ ] pnpm lint → PASS après frontend
- [ ] pnpm test → PASS après testing
- [ ] Aucune régression vs V5.2.1

### Documentation
- [ ] WORKFLOW-V6-MVP.md créé
- [ ] CLAUDE.md mis à jour
- [ ] Guide migration V5.2.1 → V6 disponible
- [ ] Rollback strategy documentée

### Validation Terrain
- [ ] Test sur nouveau projet (pas FlowGenius3)
- [ ] Durée totale mesurée
- [ ] Comparaison vs V5.2.1 documentée

---

## 🎯 Critères de Succès

**Must-Have (P0):**
- ✅ `/speckit.final` fonctionne end-to-end sans intervention manuelle
- ✅ 3 agents terminent sans erreur sur projet test
- ✅ Checkpoints P0 (build) passent
- ✅ Rollback vers V5.2.1 possible

**Should-Have (P1):**
- ✅ Logs pulse.jsonl exploitables pour debug
- ✅ Documentation complète workflow V6
- ✅ Durée comparable ou meilleure que V5.2.1

**Nice-to-Have (P2):**
- ⏳ viewPulse.sh avec couleurs + stats
- ⏳ Métriques détaillées (files/min, tests/agent, etc.)
- ⏳ Alertes si agent > 30 min

---

## 📊 Comparaison V5.2.1 vs V6 MVP

| Aspect | V5.2.1 | V6 MVP | Gain |
|--------|--------|--------|------|
| **Commandes** | `/agents` + copier-coller + `/implement` | `/agents` + `/speckit.final` | -1 étape manuelle |
| **Temps overhead** | ~5-10 min (manuel) | ~0 min (auto) | **-100%** |
| **Risque erreur** | Moyen (copier-coller) | Nul (auto) | **Éliminé** |
| **Observabilité** | Aucune (logs inline) | pulse.jsonl structuré | **+100%** |
| **Rollback** | N/A | Vers V5.2.1 si besoin | **Safe** |
| **Complexité** | Simple | Moyenne | +20% complexité |
| **Durée implémentation** | 3.5h (séquentiel) | 3.5h (séquentiel MVP) | **Identique** |

---

## 🔄 Migration V5.2.1 → V6 MVP

### Pour Projets Existants (V5.2.1)

**Option A: Rester en V5.2.1 (recommandé si proche fin)**
```bash
# Continue workflow actuel
/speckit.agents
# Copie implementation-prompt.md manuellement
/implement
```

**Option B: Migrer vers V6 MVP**
```bash
# Re-générer avec V6
/speckit.agents  # Génère ORCHESTRATION.md + pulse.jsonl
/speckit.final   # Nouvelle commande auto
```

**Risque:** Faible (agents identiques, juste automatisation)

### Pour Nouveaux Projets

**Toujours utiliser V6 MVP:**
```bash
/zen-roundtable "Brief: ..."
/speckit.constitution
/speckit.specify
/speckit.design
/speckit.plan
/speckit.tasks
/speckit.agents
/speckit.final  # 🆕 Automatisation complète
```

---

## 🚦 Décision GO/NO-GO Post-MVP

**Après J+3 (MVP validé), évaluer:**

### GO pour V6.1 (Parallélisation) si:
- ✅ MVP fonctionne sur ≥2 projets différents
- ✅ Aucun bug critique détecté
- ✅ Durée séquentielle acceptable MAIS gain 2× souhaitable
- ✅ Périmètres agents bien séparés (pas de conflits)

**Timing:** +2-3 jours pour parallélisation

### NO-GO (rester en V6 MVP séquentiel) si:
- ❌ Bugs récurrents dans délégation auto
- ❌ Durée séquentielle déjà satisfaisante (<2h)
- ❌ Risque conflicts fichiers entre agents
- ❌ Complexité pas justifiée par gain

---

## 📝 Notes Importantes

### Différences avec Proposition Gemini

**Gemini:** 2 phases (Auto-délégation + Observabilité) en 4-6 jours, parallèle dès début

**Nous (V6 MVP):** 1 phase MVP séquentiel en 3-4 jours, puis décision itération

**Pourquoi c'est mieux:**
- ✅ Livrable plus rapide (J+3 vs J+6)
- ✅ Séquentiel plus simple à déboguer
- ✅ Permet validation approche avant optimisation
- ✅ Rollback facile si problème

### Nomenclature `/speckit.final`

**Pourquoi "final" vs "implement-v6":**
- ✅ Plus clair pour l'utilisateur
- ✅ Évite confusion avec `/implement` existant
- ✅ Communique l'idée: "étape finale automatisée"
- ✅ Court et mémorable

**Commandes workflow complet V6:**
```bash
/zen-roundtable     # Phase 0: Multi-IA
/speckit.constitution  # Phase 1: Planning
/speckit.specify
/speckit.clarify    # (optionnel)
/speckit.design     # ⭐ NEVER skip
/speckit.plan
/speckit.tasks
/speckit.agents     # Phase 1.5: Orchestration
/speckit.final      # Phase 2: Implémentation 🆕
/import-design      # Phase 4: Design Merge (optionnel)
/speckit.github     # Phase 5: GitHub PR
```

---

## 🎯 Prochaines Étapes

### Immédiat (Maintenant)
1. ⏳ **Décision:** Finir lint cleanup (66 erreurs) OU commencer V6 MVP
2. Si V6 MVP → Commencer Jour 1 (pulseLogger.cjs)

### Court Terme (J+1 à J+3)
1. Développer V6 MVP selon plan ci-dessus
2. Tests sur projet pilote
3. Validation critères succès

### Moyen Terme (J+4+)
1. Décision GO/NO-GO pour V6.1 (parallélisation)
2. Si GO → Développer V6.1 (+2-3 jours)
3. Si NO-GO → Production avec V6 MVP séquentiel

---

**Version:** V6 MVP "Final Automation"
**Status:** 📋 Ready to Start
**Prêt pour:** Développement immédiat
**Dépendances:** Aucune (V5.2.1 déjà stable)

🚀 **Go for MVP!**
