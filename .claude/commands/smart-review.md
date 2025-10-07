---
description: Execute Smart Review Phase 1 with context-aware Gemini analysis for code quality, security, and production readiness
argument-hint: [phase] [file]
allowed-tools: Bash(*), Read(*), Grep(*)
model: claude-sonnet-4-20250514
---

# Smart Review Phase 1 - Context-Aware Analysis

Execute Smart Review workflow with intelligent context preparation and Gemini analysis.

## Instructions

1. **Phase spécifiée** : ${1:-feature-complete} (feature-complete, pre-commit, production-ready)
2. **Fichier cible** : $2 (optionnel, auto-détecte si non fourni)
3. **Exécution automatique** du système Smart Review Phase 1

## Contexte actuel
- Répertoire de travail : !`pwd`
- Fichiers récents modifiés : !`find src -name "*.js" -type f -mtime -1 2>/dev/null | head -5`

## Tâche

Exécuter le Smart Review Phase 1 avec les paramètres suivants :

**Phase :** ${1:-feature-complete}  
**Fichier :** $2

!if [[ -x "/Users/manu/.local/bin/smart-review-global" ]]; then /Users/manu/.local/bin/smart-review-global ${1:-feature-complete} $2; else cd /Users/manu/Documents/DEV/archon-orchestrator && GEMINI_API_URL=http://127.0.0.1:7777 node test-slash-command.js ${1:-feature-complete} $2; fi

Arguments fournis : $ARGUMENTS