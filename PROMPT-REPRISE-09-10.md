# 📋 PROMPT REPRISE SESSION - 09/10/2025

**Date création:** 2025-10-08 (soir)
**Session précédente:** Mise à jour complète documentation V4
**Prochaine session:** 2025-10-09 (matin)

---

## 🎯 CONTEXTE SESSION PRÉCÉDENTE

### ✅ Ce qui a été accompli (08/10)

1. **Documentation V4 complète et cohérente**
   - ✅ CLAUDE.md mis à jour (vision V4, workflow correct)
   - ✅ README.md réécriture complète V4
   - ✅ INDEX-FILES-V3.md archivé → INDEX-FILES-V4.md
   - ✅ Toutes références V3 obsolètes corrigées
   - ✅ 5 fichiers modifiés, 100% cohérence V4

2. **Commits créés**
   ```
   a3f34fc docs: mise à jour complète V4 - cohérence documentation
   a4c1af2 docs: résumé session 2025-10-08 (workflow V4 finalisé)
   418b3b1 docs: WORKFLOW V4 - Multi-Device avec Sécurité (FINAL)
   ```

3. **Vision V4 clarifiée**
   - Mac 24/7 (station principale développement)
   - GitHub systématique (workflow pro + commits réguliers)
   - Mobile = monitoring/convenience (PAS "mobile-first")
   - Jules Security asynchrone (0 temps supplémentaire)
   - Multi-projets: 3-4 simultanés (hybride local + cloud)
   - Capacité: 8-12 clients/semaine, €80-100K/mois revenue

---

## 🚀 OBJECTIF SESSION 09/10

### Sujet principal: **Intégration MCP dans Workflow V4**

**Contexte discussion soir 08/10:**
- Réflexion sur écosystème outils (Linear, Perplexity, Supabase, Playwright, Semgrep, Pieces, Vibe Check)
- Proposition templates MCP par type de projet
- Architecture 3 niveaux (CI/CD, MCP Core, MCP Optionnels)

**Objectif session:**
> Définir et documenter l'intégration MCP dans workflow V4, avec templates prêts à l'emploi

---

## 📚 FICHIERS À LIRE EN PRIORITÉ

### Documentation V4 (Source de vérité)

1. **[START-HERE.md](./START-HERE.md)** - Point d'entrée unique
2. **[docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md](./docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md)** ⭐ - Source de vérité V4
3. **[INDEX-FILES-V4.md](./INDEX-FILES-V4.md)** - Navigation rapide
4. **[CLAUDE.md](./CLAUDE.md)** - Instructions session (V4, mis à jour)
5. **[RESUME-SESSION-2025-10-08.md](./RESUME-SESSION-2025-10-08.md)** - Résumé session hier

### Contexte Discussion MCP

**Outils discutés (08/10 soir):**

| Outil | Type | Priorité | Intégration |
|-------|------|----------|-------------|
| **Linear** | Tickets/Roadmap | P1 | MCP Core |
| **Supabase Inspector** | DB Debugging | P1 | MCP Core |
| **Pieces** | Mémoire locale | P1 | MCP Optionnel (test vs Context7) |
| **Perplexity** | Recherche contexte | P2 | MCP Optionnel |
| **Vibe Check** | Métacognition | P3 | Expérimental (attendre) |
| **Playwright** | Tests E2E | P0 | CI/CD (pas MCP) |
| **Semgrep** | SAST sécurité | P0 | CI/CD (pas MCP) |

---

## 🎯 TÂCHES PROPOSÉES SESSION 09/10

### Phase 1: Exploration & Décision (1h)

**Questions à clarifier:**

1. **Linear MCP:**
   - Remplace-t-il tasks.md ou complète-t-il ?
   - Workflow: tasks.md → sync Linear OU Linear direct ?
   - Setup: API key, workspace, labels

2. **Pieces vs Context7:**
   - Quelle valeur ajoutée réelle ?
   - Coût (gratuit vs payant) ?
   - Effort migration patterns existants ?

3. **Templates MCP:**
   - Quels templates créer d'abord (saas-webapp, chrome-extension, cli-tool) ?
   - Variables d'environnement à configurer ?
   - Documentation setup par template ?

4. **Architecture MCP:**
   - Confirmer 3 niveaux (CI/CD, Core, Optionnels) ?
   - Quels MCP obligatoires vs optionnels ?
   - Gestion secrets (API keys, tokens) ?

---

### Phase 2: Implémentation (si décision prise - 2-3h)

**Option A: Linear MCP Integration**

```bash
# 1. Setup Linear
# → Créer workspace
# → Générer API key
# → Configurer labels/états

# 2. Template saas-webapp-linear.mcp.json
{
  "mcpServers": {
    "github": {...},
    "linear": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": {
        "LINEAR_API_KEY": "lin_api_xxx"
      }
    }
  }
}

# 3. Documentation intégration
# → Section WORKFLOW-FINAL-V4-MULTI-DEVICE.md
# → Script setup-mcp.sh avec Linear
# → Workflow: tasks.md → Linear sync

# 4. Test sur projet exemple
# → Créer projet test
# → Sync tasks.md → Linear
# → Vérifier roadmap générée
# → Tester tracking progression
```

**Résultat attendu:**
- Template MCP avec Linear fonctionnel
- Documentation intégration complète
- Workflow V4 étendu avec Linear

---

**Option B: Templates MCP par Type de Projet**

```bash
# 1. Créer templates
~/Documents/DEV/clients/_templates/mcp-profiles/
├── saas-webapp.mcp.json       # GitHub + Supabase + Linear
├── chrome-extension.mcp.json  # GitHub + Linear (minimal)
├── cli-tool.mcp.json          # GitHub only
└── full-stack.mcp.json        # Tous MCP (expérimental)

# 2. Script setup-mcp.sh interactif
# → Menu sélection type projet
# → Copie template correspondant
# → Configuration secrets interactifs
# → Validation MCP disponibles

# 3. Documentation
# → Guide setup MCP par projet
# → FAQ MCP (troubleshooting)
# → Commandes utiles (add, list, reset)

# 4. Test workflow complet
# → setup-project.sh + setup-mcp.sh
# → Vérifier /mcp accessible
# → Workflow planning → implementation
```

**Résultat attendu:**
- 3-4 templates MCP prêts à l'emploi
- Script setup automatisé
- Documentation complète

---

**Option C: Exploration Pieces (test)**

```bash
# 1. Installer Pieces Desktop
# → Download + install
# → Configurer capture automatique

# 2. Setup MCP Pieces
{
  "pieces": {
    "type": "http",
    "url": "http://localhost:1000/mcp",
    "headers": {
      "Authorization": "Bearer pieces-xxx"
    }
  }
}

# 3. Test capture patterns
# → Implémenter feature simple
# → Vérifier capture automatique
# → Rechercher patterns capturés

# 4. Comparer avec Context7
# → Quelle capture automatique ?
# → Qualité suggestions ?
# → Effort maintenance ?

# 5. Decision: Keep Context7 OU migrate Pieces
```

**Résultat attendu:**
- Évaluation Pieces vs Context7
- Recommandation (keep/migrate/hybride)
- Documentation si adoption

---

### Phase 3: Documentation (1h)

**Mise à jour documentation V4:**

1. **WORKFLOW-FINAL-V4-MULTI-DEVICE.md**
   - Ajouter section "Setup MCP par Projet"
   - Workflow avec Linear (si implémenté)
   - Templates MCP disponibles

2. **INDEX-FILES-V4.md**
   - Ajouter références templates MCP
   - Navigation setup MCP

3. **START-HERE.md**
   - Update quick start avec MCP
   - Mention templates disponibles

4. **Nouveau: MCP-INTEGRATION-GUIDE.md**
   - Guide complet MCP
   - Templates par type projet
   - Troubleshooting MCP
   - Commandes utiles

---

## 📊 MÉTRIQUES SUCCÈS SESSION

**Objectifs mesurables:**

1. **Décisions prises:**
   - [ ] Linear MCP: Oui/Non/Plus tard
   - [ ] Pieces vs Context7: Keep/Migrate/Hybride
   - [ ] Templates MCP: Quels types créer

2. **Implémentation:**
   - [ ] Au moins 1 template MCP fonctionnel
   - [ ] Script setup-mcp.sh (ou manuel documenté)
   - [ ] Test workflow complet sur projet exemple

3. **Documentation:**
   - [ ] Section MCP dans WORKFLOW-FINAL-V4-MULTI-DEVICE.md
   - [ ] Guide MCP (nouveau fichier OU section)
   - [ ] README.md mise à jour (mention MCP)

---

## 🔑 RAPPELS IMPORTANTS

### Vision V4 (Ne PAS oublier)

- ✅ Mac 24/7 (station principale)
- ✅ GitHub systématique (workflow pro)
- ✅ Mobile = monitoring/convenience (PAS "mobile-first")
- ✅ Jules Security asynchrone (0 temps)
- ✅ Multi-projets: 3-4 simultanés

### Workflow Spec-Kit Correct

```bash
/speckit.constitution  # D'ABORD (pas /specify)
/speckit.specify
/speckit.plan
/speckit.tasks
```

### Principe Tools Fatigue

> **"Add tools only if 10× value vs 1× complexity"**

**Exemples:**
- Linear: 10× value (roadmap + métriques) → ✅ Intégrer
- Vibe Check: 2× value vs 3× complexity → ⏸️ Attendre

---

## 📂 FICHIERS CRÉÉS HIER (Référence)

### Documentation V4 (08/10)

```
docs/WORKFLOW-FINAL-V4-MULTI-DEVICE.md       (550+ lignes - source vérité)
docs/CLAUDE-MAX-OAUTH-COMPLETE-GUIDE.md      (420+ lignes - OAuth setup)
docs/RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md  (460+ lignes - leçons)
INDEX-FILES-V4.md                             (280+ lignes - navigation)
RESUME-SESSION-2025-10-08.md                  (424 lignes - résumé)
START-HERE.md                                 (360 lignes - V4 updated)
CLAUDE.md                                     (508 lignes - V4 updated)
README.md                                     (408 lignes - V4 rewrite)
```

### Archivés V3 (08/10)

```
archive-obsolete-2025-10-08-v4/
├── ARCHIVAGE-RAISONS-V4.md
├── WORKFLOW-COMPLETE-V3.md
├── WORKFLOW-CLAUDE-FIRST-JULES-SECURITY.md
├── WORKFLOW-SOLOPRENEUR-VISION.md
├── MULTI-CLIENT-SETUP-GUIDE.md
└── INDEX-FILES-V3.md
```

---

## 🚀 PROCHAINES ÉTAPES (Post 09/10)

### Court Terme (1 semaine)

1. **Tester workflow V4 sur projet réel** (non-test)
   - Appliquer workflow complet
   - Mesurer temps réel vs estimations
   - Identifier blockers/améliorations

2. **Intégrer validation gate constitution ↔ plan**
   - Problème connu: /speckit.plan peut réinterpréter
   - Solution: Blocker si incohérence détectée
   - Voir: RETOUR-EXPERIENCE-REVIEWRESCUE-2025-10-08.md

3. **Template design tokens T002 (mandatory Web Apps)**
   - Auto-génération design-tokens.json
   - Wireframes SVG automatiques
   - Composants shadcn/ui détectés

### Moyen Terme (1 mois)

4. **Dashboard monitoring multi-projets**
   - Voir progression 3-4 projets simultanés
   - Métriques temps réel (si Linear intégré)

5. **Script batch setup multi-projets**
   - Créer 3-4 projets en parallèle
   - Setup automatisé complet

6. **Guide vidéo workflow** (Mac + mobile)
   - Démonstration complète workflow V4
   - Monitoring multi-device

---

## 📞 RESSOURCES RAPIDES

### Commandes Utiles MCP

```bash
# Lister MCP disponibles
claude mcp list

# Ajouter MCP depuis Claude Desktop
claude mcp add-from-claude-desktop --scope project

# Ajouter MCP manuel
claude mcp add --transport stdio <nom> --scope project <commande>

# Ajouter MCP depuis JSON
claude mcp add-json <nom> '<json>'

# Reset choix projet
claude mcp reset-project-choices
```

### Documentation Référence

- **Claude Code MCP:** https://docs.claude.com/en/docs/claude-code/mcp
- **Linear API:** https://developers.linear.app/docs/graphql/working-with-the-graphql-api
- **Pieces API:** https://docs.pieces.app/
- **Supabase MCP:** https://supabase.com/docs/guides/ai/integrations/claude

---

## ✅ CHECKLIST DÉBUT SESSION 09/10

**Avant de commencer:**

- [ ] Lire ce prompt complet
- [ ] Lire RESUME-SESSION-2025-10-08.md (contexte hier)
- [ ] Consulter WORKFLOW-FINAL-V4-MULTI-DEVICE.md (source vérité)
- [ ] Décider quelle phase (Exploration / Implémentation / Documentation)
- [ ] Confirmer objectif session avec user

**Pendant session:**

- [ ] Utiliser TodoWrite pour tracker progression
- [ ] Documenter décisions prises
- [ ] Tester sur projet exemple si implémentation
- [ ] Commit réguliers (pas tout à la fin)

**Fin session:**

- [ ] Créer RESUME-SESSION-2025-10-09.md
- [ ] Update PROMPT-REPRISE-10-10.md (si besoin)
- [ ] Commit final documentation

---

## 🎯 QUESTION PRINCIPALE SESSION 09/10

> **"Comment intégrer MCP dans workflow V4 pour maximiser valeur (10×) tout en minimisant complexité (1×) ?"**

**Sous-questions:**
1. Quels MCP apportent vraiment 10× value ?
2. Quels templates créer en priorité ?
3. Linear remplace tasks.md ou complète ?
4. Pieces vaut-il migration depuis Context7 ?

---

**Version:** 1.0
**Date:** 2025-10-08 (soir)
**Prochaine session:** 2025-10-09 (matin)
**Status:** ✅ Documentation V4 complète, prêt pour intégration MCP

*Objectif: Définir et documenter intégration MCP workflow V4* 🚀

---

## 💡 BONUS: Idées Exploration (Si Temps)

### 1. **Comparatif Linear vs GitHub Projects**

**Question:** Pourquoi Linear et pas GitHub Projects (gratuit) ?

**À explorer:**
- GitHub Projects: Gratuit, intégré, roadmap Kanban
- Linear: Payant, UI meilleure, métriques velocity/burndown
- Decision: Valeur Linear justifie-t-elle coût ?

### 2. **MCP Composition**

**Question:** Peut-on chaîner plusieurs MCP ?

**Exemple:**
```
Perplexity (recherche best practice)
→ Pieces (cherche si pattern déjà utilisé)
→ Linear (crée ticket si nouveau pattern à implémenter)
```

**À explorer:** MCP chaining possible ? Utile ?

### 3. **Template "Hybrid" (Context7 + Pieces)**

**Question:** Peut-on utiliser les deux en même temps ?

**Cas d'usage:**
- Context7: Patterns globaux (architecture, best practices)
- Pieces: Patterns projet (bugs spécifiques, solutions locales)

**À explorer:** Complémentarité vs redondance ?

---

**Bon courage pour la session demain ! 🚀**
