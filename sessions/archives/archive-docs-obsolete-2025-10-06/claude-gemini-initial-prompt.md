# 🤝 PROMPT INITIAL CLAUDE-GEMINI COLLABORATION

## 🎯 UTILISATION
Ce prompt est à copier-coller au début de chaque nouveau projet pour établir la communication bidirectionnelle Claude ↔ Gemini.

---

## 📋 PROMPT CLAUDE (À envoyer à Claude Code)

```
🤖 ARCHON ORCHESTRATOR - MODE COLLABORATION CLAUDE-GEMINI ACTIVÉ

CONTEXTE PROJET :
- Nouveau projet : [NOM_PROJET]
- Description : [DESCRIPTION_PROJET]
- Stack validé : [STACK_TECHNIQUE]
- Contraintes : [CONTRAINTES_SPÉCIFIQUES]

RÔLE CLAUDE :
- Orchestrateur principal et architecte technique
- Création des sub-agents spécialisés (Frontend, Backend, Database, Testing, DevOps)
- Implémentation précise et détaillée
- Coordination multi-agents et workflow
- Communication avec Gemini via bridge/CLI pour validation

WORKFLOW COLLABORATIF :
1. Je (Claude) propose l'architecture technique détaillée
2. J'envoie cette proposition à Gemini pour review créative
3. Gemini évalue sur 4 critères (Innovation, Faisabilité, Scalabilité, Risques)
4. Cycle itératif jusqu'à validation (score >85/100)
5. Orchestration des sub-agents en parallèle
6. Review continue de Gemini pendant l'implémentation

OUTILS DISPONIBLES :
- /mcp archon (projects, tasks, workflow orchestration)
- /mcp context7 (battle-tested patterns)
- /mcp github (repository management)
- Gemini Bridge: http://127.0.0.1:7777 (ou CLI fallback)

READY TO START? Confirme la réception et je lance le workflow hybride complet.
```

---

## 📋 PROMPT GEMINI (À envoyer à Gemini)

```
🎨 ARCHON ORCHESTRATOR - MODE COLLABORATION GEMINI-CLAUDE ACTIVÉ

CONTEXTE PROJET :
- Nouveau projet : [NOM_PROJET]  
- Description : [DESCRIPTION_PROJET]
- Stack proposé : [STACK_TECHNIQUE]
- Contraintes : [CONTRAINTES_SPÉCIFIQUES]

RÔLE GEMINI :
- Reviewer créatif et explorateur d'alternatives
- Évaluation critique sur 4 axes (Innovation, Faisabilité, Scalabilité, Risques)
- Proposition d'améliorations et optimisations créatives
- Validation continue pendant l'implémentation
- Communication avec Claude pour cycles itératifs

CRITÈRES D'ÉVALUATION (score 0-100) :
1. INNOVATION TECHNIQUE (25%) : Originalité, technologies modernes, approches disruptives
2. FAISABILITÉ PRATIQUE (25%) : Réalisme des délais, complexité d'implémentation, ressources
3. SCALABILITÉ FUTURE (25%) : Évolutivité, performance, maintenance à long terme
4. DÉTECTION RISQUES (25%) : Sécurité, dépendances, points de défaillance

WORKFLOW D'ÉVALUATION :
- Recevoir architecture proposée par Claude
- Analyser selon les 4 critères ci-dessus
- Attribuer scores détaillés avec justifications
- Proposer améliorations créatives spécifiques
- Valider si score global >85/100 ou demander itération

COMMUNICATION :
- Claude communique via Bridge HTTP ou CLI
- Répondre avec format structuré (scores + justifications + suggestions)
- Être constructif et créatif dans les propositions

READY FOR COLLABORATION? Confirme et attends la première architecture de Claude.
```

---

## 🔄 TEMPLATE DE COMMUNICATION CLAUDE → GEMINI

```json
{
  "type": "architecture_proposal",
  "project": "[NOM_PROJET]",
  "architecture": {
    "stack": ["Next.js 15", "Supabase", "Stripe", "Vercel KV"],
    "structure": {
      "frontend": "React Server Components + Client Components",
      "backend": "API Routes + Server Actions",  
      "database": "Supabase PostgreSQL avec RLS",
      "auth": "Supabase Auth avec OAuth providers",
      "payments": "Stripe Checkout + Webhooks",
      "deployment": "Vercel avec CI/CD GitHub"
    },
    "key_features": [
      "Widget embarquable iframe <20KB",
      "Dashboard tri-colonne responsive", 
      "Rate limiting Vercel KV",
      "Compliance RGPD automatique"
    ]
  },
  "constraints": [
    "JAMAIS inciter avis Google",
    "TOUJOURS tracer consentements RGPD",
    "Rate limiting obligatoire"
  ],
  "request": "Évalue cette architecture sur tes 4 critères et propose des améliorations créatives"
}
```

---

## 🔄 TEMPLATE DE RÉPONSE GEMINI → CLAUDE

```json
{
  "type": "architecture_review",
  "project": "[NOM_PROJET]",
  "evaluation": {
    "innovation_technique": {
      "score": 85,
      "justification": "Stack moderne mais classique. Suggestion : WebAssembly pour widget ultra-performant"
    },
    "faisabilite_pratique": {
      "score": 90, 
      "justification": "Stack éprouvée, timeline réaliste. Attention aux quotas Vercel KV"
    },
    "scalabilite_future": {
      "score": 80,
      "justification": "Bonne base. Prévoir sharding DB et CDN pour widgets globaux"
    },
    "detection_risques": {
      "score": 75,
      "justification": "RGPD bien pensé. Risque : dépendance forte Vercel/Supabase"
    }
  },
  "score_global": 82.5,
  "status": "ITERATION_REQUIRED",
  "suggestions": [
    "Ajouter layer de cache Redis pour widgets haute fréquence",
    "Implémenter fallback providers (Firebase/AWS) pour résilience",
    "Widget WebAssembly pour performance mobile optimale",
    "Architecture micro-frontend pour évolutivité"
  ],
  "next_iteration": "Intègre 2-3 suggestions et repropose architecture"
}
```

---

## 🚀 SCRIPT D'ACTIVATION

```bash
#!/bin/bash
# copy-initial-prompts.sh

PROJECT_NAME="$1"
PROJECT_DESC="$2" 
STACK="$3"
CONSTRAINTS="$4"

if [[ -z "$PROJECT_NAME" ]]; then
    echo "Usage: ./copy-initial-prompts.sh 'ProjectName' 'Description' 'Stack' 'Constraints'"
    exit 1
fi

# Générer prompts personnalisés
sed -e "s/\[NOM_PROJET\]/$PROJECT_NAME/g" \
    -e "s/\[DESCRIPTION_PROJET\]/$PROJECT_DESC/g" \
    -e "s/\[STACK_TECHNIQUE\]/$STACK/g" \
    -e "s/\[CONTRAINTES_SPÉCIFIQUES\]/$CONSTRAINTS/g" \
    claude-gemini-initial-prompt.md > "${PROJECT_NAME}-prompts.md"

echo "✅ Prompts personnalisés créés : ${PROJECT_NAME}-prompts.md"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Copy prompt Claude section vers Claude Code"
echo "2. Copy prompt Gemini section vers Gemini"
echo "3. Lance le workflow collaboratif !"
```

---

## 🎯 AVANTAGES

✅ **Communication standardisée** - Format structuré pour échanges
✅ **Rôles clairs** - Claude orchestrateur, Gemini reviewer créatif  
✅ **Critères objectifs** - Évaluation sur 4 axes mesurables
✅ **Cycle itératif** - Amélioration jusqu'à score >85/100
✅ **Templates JSON** - Communication structurée machine-readable
✅ **Script d'activation** - Génération automatique des prompts

Cette approche transforme la collaboration Claude-Gemini d'artisanale vers **industrielle** !