# 🗂️ ARCHIVAGE V4.1 - RAISONS & JUSTIFICATIONS

**Date:** 2025-10-15
**Version:** V4.1 (Design Decoupling + Zen MCP validated)
**Fichiers archivés:** 7
**Raison générale:** Mise à jour vers workflow V4.1 avec Design Decoupling + Zen MCP

---

## 📋 FICHIERS ARCHIVÉS

### 1. docs/DESIGN-SYSTEM-SOLO-SIMPLIFIED.md

**Destination:** `archive-obsolete-2025-10-15-v4.1/docs-obsoletes/`

**Raison obsolescence:**
- ❌ Remplacé par **Design/Dev Decoupling Pattern** (GOLDEN-PATTERNS.md)
- ❌ Approche "simplified" obsolète vs approche "decoupling" (parallèle work streams)
- ❌ Pas de mention `/import-design` workflow (nouveau V4.1)
- ❌ Pas de philosophie "custom brand vs generic AI" (competitive advantage)

**Fichier remplacement:**
- `docs/GOLDEN-PATTERNS.md` - Section "🎨 DESIGN/DEV DECOUPLING PATTERN ⭐"
- `CLAUDE.md` - Section "🎨 DESIGN SYSTEM PHILOSOPHY ⭐"
- `docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md` - Section "🎨 Philosophy: Design/Dev Decoupling (Critical)"
- `.claude/commands/import-design.md` - Slash command merge design

**Impact:** ✅ Aucun - workflow actuel utilise nouveaux fichiers

---

### 2. docs/CODEX-INTEGRATION-WORKFLOW-V4.md

**Destination:** `archive-obsolete-2025-10-15-v4.1/docs-obsoletes/`

**Raison obsolescence:**
- ❌ Remplacé par **Zen MCP Workflow** (Multi-IA orchestration unifiée)
- ❌ Focus Codex seul (pas Gemini + Claude arbitration)
- ❌ Workflow manuel copy/paste (pas MCP bridge automatisé)
- ❌ Pas de mention `mcp__zen__clink` tool (validated Session 3)

**Fichier remplacement:**
- `docs/ZEN-MCP-WORKFLOW-ORCHESTRATION.md` - Zen MCP complet (Codex + Gemini + Claude)
- `docs/MULTI-IA-ROUNDTABLE-PATTERN.md` - Pattern Multi-IA
- `.claude/commands/zen-roundtable.md` - Slash command Multi-IA

**Impact:** ✅ Aucun - workflow actuel utilise Zen MCP

---

### 3. BRIEF-CHATGPT-ANNUAIRE-SANTE.md

**Destination:** `archive-obsolete-2025-10-15-v4.1/projets-obsoletes/`

**Raison obsolescence:**
- ❌ Brief projet spécifique (Annuaire Santé)
- ❌ Non générique (pas réutilisable workflow)
- ❌ Contenu ChatGPT (pas Claude Code)
- ❌ Pas de valeur documentation workflow V4.1

**Fichier remplacement:**
- Aucun (brief projet unique, non workflow)

**Impact:** ✅ Aucun - brief projet terminé/abandonné

---

### 4. OUTPUT-CODEX-ANNUAIRE-SANTE.md

**Destination:** `archive-obsolete-2025-10-15-v4.1/projets-obsoletes/`

**Raison obsolescence:**
- ❌ Output projet spécifique (Annuaire Santé)
- ❌ Non générique (pas réutilisable workflow)
- ❌ Historique Codex seul (avant Zen MCP)
- ❌ Pas de valeur documentation workflow V4.1

**Fichier remplacement:**
- Aucun (output projet unique, non workflow)

**Impact:** ✅ Aucun - output projet terminé/abandonné

---

### 5. PROMPT-REPRISE-2025-10-08.md

**Destination:** `archive-obsolete-2025-10-15-v4.1/prompts-historiques/`

**Raison obsolescence:**
- ❌ Prompt session historique (2025-10-08)
- ❌ Non réutilisable (contexte session passée)
- ❌ Résumé session disponible (RESUME-SESSION-2025-10-08.md)
- ❌ Encombrement racine projet

**Fichier remplacement:**
- `RESUME-SESSION-2025-10-08.md` (session resume conservé)

**Impact:** ✅ Aucun - prompt one-time, résumé conservé

---

### 6. PROMPT-SESSION-3-ZEN-MCP.md

**Destination:** `archive-obsolete-2025-10-15-v4.1/prompts-historiques/`

**Raison obsolescence:**
- ❌ Prompt session historique (Session 3 Zen MCP)
- ❌ Non réutilisable (contexte session passée)
- ❌ Résumé session disponible (RESUME-SESSION-2025-10-12.md)
- ❌ Encombrement racine projet

**Fichier remplacement:**
- `RESUME-SESSION-2025-10-12.md` (Session 3 resume conservé)

**Impact:** ✅ Aucun - prompt one-time, résumé conservé

---

### 7. .claude/commands/smart-review.md

**Destination:** `archive-obsolete-2025-10-15-v4.1/commands-obsoletes/`

**Raison obsolescence:**
- ❌ **0 mentions** dans documentation actuelle (grep verified)
- ❌ Pas référencé dans CLAUDE.md, WORKFLOW-V4, START-HERE.md
- ❌ Command non utilisé workflow V4.1
- ❌ Possiblement expérimental/test

**Fichier remplacement:**
- Aucun (command non intégré workflow)

**Impact:** ✅ Aucun - command non utilisé

**Grep verification:**
```bash
grep -r "smart-review" docs/ CLAUDE.md START-HERE.md
# 0 results
```

---

## 📊 STATISTIQUES ARCHIVAGE

### Avant Archivage

- **Total fichiers .md:** 92
- **Fichiers racine:** 15
- **Fichiers docs/:** 24
- **Fichiers .claude/commands/:** 4

### Après Archivage

- **Total fichiers .md:** 85 (-7.6%)
- **Fichiers racine:** 11 (-4)
- **Fichiers docs/:** 22 (-2)
- **Fichiers .claude/commands/:** 3 (-1)

### Réduction

- **Fichiers archivés:** 7
- **Réduction:** -7.6% fichiers .md
- **Dossiers archives totaux:** 6 (5 anciens + 1 nouveau)

---

## 🎯 CRITÈRES OBSOLESCENCE APPLIQUÉS

### Fichiers Archivés = 100% Obsolètes

Tous les fichiers archivés répondent à **au moins 2 critères** :

1. ✅ **Remplacé explicitement** (nouveau fichier couvre même sujet)
   - DESIGN-SYSTEM-SOLO-SIMPLIFIED.md → Design Decoupling Pattern
   - CODEX-INTEGRATION-WORKFLOW-V4.md → Zen MCP Workflow

2. ✅ **Projet-specific** (non générique)
   - BRIEF-CHATGPT-ANNUAIRE-SANTE.md
   - OUTPUT-CODEX-ANNUAIRE-SANTE.md

3. ✅ **Historique** (prompt session passée)
   - PROMPT-REPRISE-2025-10-08.md
   - PROMPT-SESSION-3-ZEN-MCP.md

4. ✅ **Non référencé** (0 mentions dans docs actuels)
   - smart-review.md (grep verified)

---

## 🔍 FICHIERS CONSERVÉS (Non Archivés)

### Raisons Conservation

| Fichier | Raison Conservation |
|---------|---------------------|
| **CLAUDE-CODE-CAPACITES-REFERENCE.md** | Référence capacités Claude Code (meta-agents patterns) |
| **.claude/agents/** | Structure ancienne MAIS possiblement utilisée |
| **.claude/agents-v4/** | Structure V4 MAIS non confirmée obsolète |
| **docs/ARCHITECTURE-COMPLIANCE-V2.md** | V2 MAIS possiblement pertinent compliance |
| **docs/AGENTS-ADAPTATION-SUMMARY.md** | Summary MAIS possiblement utile |
| **docs/SUB-AGENTS-INTEGRATION-CHECKLIST.md** | Checklist MAIS possiblement complémentaire |
| **RESUME-SESSION-2025-10-09.md** | Doublon potentiel MAIS non confirmé |

**Action recommandée:** Investigation approfondie future (Phase 2 archivage)

---

## 📚 WORKFLOW V4.1 ACTUEL (Référence)

### Sources Vérité (Conservées)

1. **START-HERE.md** - Point d'entrée unique
2. **CLAUDE.md** - Instructions + Design Philosophy
3. **WORKFLOW-FINAL-V4-MULTI-DEVICE.md** - Workflow complet V4.1
4. **INDEX-FILES-V4.md** - Navigation
5. **WHATS-NEW-V4.1.md** - Changelog V4.1

### Workflow V4.1 (Résumé)

**Phase 1: Planning (30 min)**
- /speckit.constitution → constitution.md
- /speckit.specify → spec.md
- /speckit.clarify → Q&A
- **/speckit.design** → design-tokens.json + wireframes (🆕 V4.1)
- /speckit.plan → plan.md
- /speckit.tasks → tasks.md
- **/speckit.agents** → prompt orchestration (🆕 V4.1)

**Phase 2: Setup GitHub (2 min)**
- Init repo + Actions + Jules Security

**Phase 3: Implementation (3-4h)**
- Local Mac 24/7 (développement principal)
- Prompt généré par /speckit.agents (orchestration optimale)
- Sub-agents orchestrés automatiquement
- MCP Context7 juste-in-time
- Jules scan async (parallèle)

**Phase 3bis: Multi-IA (Optionnel)**
- **Zen MCP** (mcp__zen__clink) - Codex + Gemini + Claude
- Architecture Decision Records (ADR)
- Code Review Multi-Perspective
- Deep Investigation (thinkdeep)

**Phase 4: Design Import (15 min) 🆕**
- **/import-design** custom-tokens.json
- Merge design custom (0 refactor)
- Competitive advantage vs Lovable/Bolt/v0

**Phase 5: Review + Merge (15 min)**
- Mac OU mobile (flexibilité)
- Jules report (94/100) + PR merge

---

## 🚀 PROCHAINES ÉTAPES RECOMMANDÉES

### Phase 2 Archivage (Optionnel - Future)

**Investigation approfondie (30-45 min) :**

1. **CLAUDE-CODE-CAPACITES-REFERENCE.md**
   - Lire document complet
   - Comparer avec /speckit.agents workflow
   - Décider: Archiver OU Conserver

2. **.claude/agents/ vs .claude/agents-v4/**
   - Identifier structure utilisée V4.1
   - Comparer avec SUB-AGENTS-MASTERY.md
   - Décider: Archiver ancienne structure

3. **docs/ARCHITECTURE-COMPLIANCE-V2.md**
   - Vérifier pertinence compliance V4.1
   - Comparer avec WORKFLOW-V4
   - Décider: Archiver OU Conserver

4. **Doublons session resumes**
   - Comparer RESUME-SESSION-2025-10-09.md vs FINAL.md
   - Vérifier contenu identique
   - Décider: Archiver doublon

**Impact attendu:** -10 à -15 fichiers additionnels (-11% à -16% total)

---

## ✅ VALIDATION ARCHIVAGE V4.1

### Checklist Complète

- [x] Fichiers obsolètes identifiés (7 fichiers)
- [x] Raisons obsolescence documentées (critères appliqués)
- [x] Fichiers remplacements identifiés (quand applicable)
- [x] Dossier archive créé (structure organisée)
- [x] Fichiers déplacés (mv commands)
- [x] Documentation archivage créée (ce fichier)
- [x] Impact vérifié (0 breaking changes)
- [ ] Commit archivage (git commit à faire)
- [ ] INDEX-FILES-V4.md mis à jour (optionnel)
- [ ] Vérification liens morts (optionnel)

---

## 📝 NOTES IMPORTANTES

### Restauration Possible

Tous les fichiers archivés sont **récupérables** :

```bash
# Restaurer fichier spécifique
cp archive-obsolete-2025-10-15-v4.1/docs-obsoletes/DESIGN-SYSTEM-SOLO-SIMPLIFIED.md docs/

# Restaurer dossier complet
cp -r archive-obsolete-2025-10-15-v4.1/docs-obsoletes/* docs/
```

### Archives Précédentes

| Archive | Date | Version | Fichiers |
|---------|------|---------|----------|
| archive-obsolete-2025-10-08-v4/ | 2025-10-08 | V3 → V4 | 8 fichiers |
| archive-obsolete-2025-10-07-v3/ | 2025-10-07 | V2 → V3 | 67 fichiers |
| archive-docs-obsolete-2025-10-06-v2/ | 2025-10-06 | V1 → V2 | 10 fichiers |
| archive-docs-obsolete-2025-10-06/ | 2025-10-06 | V0 → V1 | 68 fichiers |
| backup-obsolete-20250902/ | 2025-09-02 | Initial | 18 fichiers |

**Total archives:** 171 fichiers obsolètes historiques

---

**Version:** 1.0
**Date:** 2025-10-15
**Status:** ✅ **ARCHIVAGE COMPLETE - 7 FICHIERS OBSOLÈTES**
**Réduction:** -7.6% fichiers .md (92 → 85)

*Archivage V4.1 - Workflow Clean! 🧹*
