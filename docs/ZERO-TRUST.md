# 🛡️ ZERO TRUST - Archon Orchestrator

Philosophie Confiance Zéro avec validation continue.

---

## 🚨 RÈGLE FONDAMENTALE

**Ne JAMAIS faire confiance sans preuve.**

**Le problème:** LLM peuvent "confabuler" résultats, prétendre qu'un build réussit alors qu'il échoue.

**La solution:** Approche **Confiance Zéro** où chaque affirmation DOIT être prouvée par sortie de commande vérifiable.

---

## 📋 PRINCIPES DE BASE

### 1. Jamais Accepter "C'est Fait" Sans Preuve

**❌ Mauvais:**
> "Le build est réussi"

**✅ Bon:**
> "Le build est réussi, voici la sortie : [BUILD SUCCESSFUL in 23s]"

---

### 2. Definition of Done

Une tâche est "Terminée" si:
- ✅ Code écrit
- ✅ Code compile (`pnpm run build` avec sortie)
- ✅ Tests passent (`pnpm run test` avec rapport)
- ✅ Linting clean (`pnpm run lint` sans erreurs)
- ✅ Gemini a validé qualité (score > 7/10)

---

### 3. Vérification Systématique

**Quand vérifier:**
- Après chaque modification majeure
- Avant chaque commit
- À chaque étape du workflow
- Validation croisée Gemini pour code critique

---

### 4. Tests Préventifs OBLIGATOIRES

**TOUJOURS:**
- Exécuter `pnpm run build` avant "terminé"
- Exécuter `pnpm run test` après chaque feature
- Montrer messages d'erreur complets si échec
- Faire vérification itérative sur projets complexes

---

## 🔍 COMMANDES VÉRIFICATION OBLIGATOIRES

### ÉTAPE 1: Build Complet

```bash
pnpm run build 2>&1 | tee build.log
if [ $? -ne 0 ]; then
  echo "❌ BUILD FAILED - Montrer le log complet"
  cat build.log
  exit 1
fi
```

---

### ÉTAPE 2: Tests

```bash
pnpm run test:unit 2>&1 | tee test-unit.log
pnpm run test 2>&1 | tee test-e2e.log
```

---

### ÉTAPE 3: Linting & Type Check

```bash
pnpm run lint --fix 2>&1 | tee lint.log
pnpm tsc --noEmit 2>&1 | tee typecheck.log
```

---

### ÉTAPE 4: Validation Gemini

```bash
/mcp archon smart_review_workflow code="./src/" task="Validation complète"
```

---

### ÉTAPE 5: Preuves Fichiers Existent

```bash
find . -name "*.js" -o -name "*.ts" -mmin -10 | head -20
```

---

### ÉTAPE 6: Serveur Démarre

```bash
pnpm run dev &
SERVER_PID=$!
sleep 5
curl -f http://localhost:3000/health || (kill $SERVER_PID && exit 1)
kill $SERVER_PID
```

---

## 🔄 WORKFLOW VÉRIFICATION ITÉRATIVE

### Stratégie Anti-Erreurs Build

**Principe:** Vérification continue à chaque étape critique, pas seulement à la fin.

---

### Points de Contrôle Obligatoires

```javascript
const verificationCheckpoints = {
  "après_nouvelle_feature": {
    commands: ["pnpm run build", "pnpm run test:unit"],
    geminiValidation: true,
    continueOnError: false
  },
  "après_modification_majeure": {
    commands: ["pnpm run build", "pnpm run lint"],
    geminiValidation: false,
    continueOnError: false
  },
  "avant_commit": {
    commands: ["pnpm run build", "pnpm run test", "pnpm run lint"],
    geminiValidation: true,
    continueOnError: false
  },
  "après_refactoring": {
    commands: ["pnpm run build", "pnpm run test:unit", "pnpm run test:e2e"],
    geminiValidation: true,
    continueOnError: false
  }
};
```

---

### Validation Croisée Gemini

```bash
# Gemini pré-validation AVANT build
/mcp archon gemini_prevalidate code="./src/"
                               checklist="imports,types,syntax,dependencies"

# Si problèmes détectés, corriger AVANT continuer
/mcp archon apply_gemini_fixes suggestions="gemini_output.json"

# Puis build normal
pnpm run build
```

---

## 🚨 SIGNAUX D'ALARME (RED FLAGS)

### Ne JAMAIS Accepter

1. **"Ça devrait fonctionner"**
   - Exiger preuve avec `pnpm run build`

2. **"Le build est probablement réussi"**
   - Montrer sortie COMPLÈTE incluant "BUILD SUCCESSFUL"

3. **Solutions contournement suspectes:**
   - Scripts `build-workaround.sh` → REFUSER
   - Désactivation linting/type-checking → INTERDIRE
   - Commentaire tests qui échouent → CORRIGER le test
   - Scripts alternatifs `build:gemini` → SUSPECT

4. **Affirmations sans logs:**
   - "J'ai créé les fichiers" → `ls -la` + `cat` pour prouver
   - "Les tests passent" → Montrer rapport COMPLET avec nombres
   - "Ça compile" → Montrer TOUTE la sortie

5. **Évitement problèmes:**
   - "On peut ignorer cette erreur" → NON, corriger
   - "Ce warning n'est pas important" → Vérifier avec Gemini
   - "On verra plus tard" → NON, corriger maintenant

6. **RED FLAGS supplémentaires:**
   - Absence message d'erreur spécifique quand échec
   - Modifications sans re-build immédiat
   - Plus de 3 fichiers modifiés sans test
   - Utilisation `any` TypeScript sans justification
   - Import dépendances non installées

7. **Propositions Workflow Sans Vérification:**
   - "On devrait implémenter X" → SANS avoir vérifié si X existe déjà
   - "Opportunité : ajouter Y" → SANS avoir grep les CHANGELOGs
   - "Phase N devrait être Z" → SANS avoir lu la doc Phase N actuelle

   **✅ Commandes obligatoires AVANT proposition :**
   ```bash
   # 1. Vérifier git log récent
   git log --oneline --since="2 days ago"

   # 2. Lire project-memory.md (SESSION NOTES) si existe
   grep -A 5 "Session.*Phase" project-memory.md 2>/dev/null | tail -20

   # 3. Lire derniers CHANGELOGs
   ls -lt changelogs/V*/CHANGELOG-*.md 2>/dev/null | head -3
   # Puis Read chaque CHANGELOG trouvé
   ```

   **✅ Règle :**
   - AVANT "On devrait implémenter X"
   - FAIRE "git log + grep changelogs + Read latest CHANGELOG"
   - SI trouvé → NE PAS proposer (déjà implémenté)
   - SI pas trouvé → Proposer avec preuves

---

**Version:** 1.0
**Date:** 2025-10-04
