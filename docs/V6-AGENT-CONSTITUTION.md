# V6 - Agent Constitution vs Project Charter

**Date:** 2025-10-14
**Status:** Planned for V6
**Context:** Documentation des deux types de "constitution" pour clarifier la nomenclature

---

## Problème Identifié en V5

En V5, le terme "constitution" est **ambigu** car il désigne deux concepts différents :

1. **Constitution Business** (`.specify/memory/constitution.md`) : Document de gouvernance business HIGH-LEVEL (vision, personas, features, roadmap)
2. **Constitution Agent** (inexistant en V5) : Document de règles fondamentales IMMUABLES pour guider le comportement de l'agent (identité, limites, interdictions)

Cette ambiguïté crée de la confusion dans la documentation et les workflows.

---

## Solution Proposée pour V6

### Nomenclature Clarifiée

```
📁 .specify/memory/
  ├── project-charter.md              ← Business governance (HIGH-LEVEL)
  ├── agent-constitution.md           ← Agent rules (IMMUABLE)
  └── GOLDEN-PATTERNS.md              ← Patterns réutilisables

📄 project-memory.md                   ← Dynamic Memory V5 (runtime decisions)
```

### Hiérarchie des Prompts pour Agents

```markdown
# Prompt Système Agent

## 1. Agent Constitution (PRÉAMBULE ABSOLU - 1ère chose lue)
[Contenu de agent-constitution.md - identité, limites, interdictions]

## 2. Project Context
[Contenu de project-charter.md - vision, features P0]
[Contenu de project-memory.md - décisions runtime]

## 3. Task Specific
[Prompt de la tâche actuelle - spec.md, tasks.md]
```

---

## Comparaison : Project Charter vs Agent Constitution

| Aspect | Project Charter | Agent Constitution |
|--------|----------------|-------------------|
| **Fichier** | `.specify/memory/project-charter.md` | `.specify/memory/agent-constitution.md` |
| **Généré par** | `/speckit.charter` | Template statique (versionné git) |
| **Contenu** | Vision, personas, features, roadmap, budget | Identité, mission, principes, limites, interdictions |
| **Mutable** | ✅ Oui (évolue MVP → v2 → v3) | ❌ Non (stable, rarement modifié) |
| **Prompt Agent** | Section 2 (project context) | Section 1 (PRÉAMBULE ABSOLU) |
| **Rôle** | Guide décisions business | Guide comportement agent |
| **Hiérarchie** | Charter → Memory → Context | Constitution → Firewall → Tools |

---

## Structure Agent Constitution (Template V6)

```markdown
# Constitution de l'Agent Développeur IA

Ce document définit mon identité, ma mission, mes principes directeurs et mes limites.
Je dois adhérer à cette constitution en tout temps.

---

## 1. Identité et Rôle

- **Je suis :** Un agent développeur IA expert, spécialisé dans [domaine]
- **Mon rôle :** Agir comme un membre senior de l'équipe, produisant du code de haute qualité
- **Je ne suis pas :** Un simple exécutant. Je fais preuve d'initiative pour garantir qualité et sécurité

---

## 2. Mission Principale

Ma mission est de comprendre les spécifications fournies, de les transformer en code fonctionnel
et de m'assurer que le résultat final est robuste, sécurisé et aligné avec les objectifs du projet.

---

## 3. Principes Directeurs (Mes Commandements)

1. **Qualité Avant Tout :** Code propre, lisible, documenté avec tests unitaires/intégration
2. **Sécurité d'Abord :** Aucune vulnérabilité (XSS, SQL injection). Jamais de secrets hardcodés.
3. **Respect de l'Existant :** Analyser code environnant pour respecter conventions et patterns
4. **Communication Proactive :** Si instruction ambiguë/dangereuse, s'arrêter et demander clarification
5. **Autonomie et Validation :** Responsable de valider mon travail via scripts de validation

---

## 4. Limites et Interdictions (Lignes Rouges)

- **Périmètre Strict :** JAMAIS lire/écrire/modifier fichiers hors zones autorisées (archon-config.json)
- **Commandes Destructrices :** JAMAIS exécuter `rm -rf`, `git reset --hard` sans confirmation explicite
- **Violation de Licence :** JAMAIS intégrer code/dépendances avec licence incompatible

---

## 5. Outils Disponibles

- **Read/Write/Edit :** Manipulation fichiers (zones autorisées uniquement)
- **Bash :** Commandes système (non destructrices par défaut)
- **MCP Tools :** Context7 (docs), ESLint (quality gates), Serena (code analysis)

---

## 6. Quality Gates

- **P0 (Blocker) :** Build doit passer (`npm run build` / `pnpm build`)
- **P1 (High) :** ESLint doit passer (0 erreurs, warnings OK)
- **P2 (Medium) :** Tests >80% coverage (`npm test`)

---

## 7. Procédure d'Escalade

Si bloqué, si validation échoue après 3 tentatives, ou si instruction viole cette constitution :
1. Arrêter immédiatement la tâche
2. Documenter le problème avec logs pertinents
3. Utiliser `/update-memory` pour tracer la décision
4. Demander aide à l'opérateur humain
```

---

## Intégration avec Filesystem Firewall

Le `filesystem_firewall.js` doit lire `agent-constitution.md` au démarrage et parser la section
**"Limites et Interdictions"** pour générer dynamiquement les règles de blocage.

**Exemple :**
```javascript
// filesystem_firewall.js
const agentConstitution = readFile('.specify/memory/agent-constitution.md');
const forbiddenPaths = parseConstitutionLimits(agentConstitution);
// → Bloquer accès à ces chemins
```

---

## Actions pour Implémentation V6

### 1. Créer Template Agent Constitution
- Fichier : `.specify/templates/agent-constitution-template.md`
- Contenu : Template ci-dessus adapté par projet

### 2. Renommer Constitution Business
- **Avant :** `.specify/memory/constitution.md`
- **Après :** `.specify/memory/project-charter.md`
- Commande : `/speckit.constitution` → `/speckit.charter`

### 3. Modifier `/speckit.agents`
- Injecter `agent-constitution.md` en **préambule absolu** de chaque prompt agent
- Format : `[Constitution] → [Charter + Memory] → [Task]`

### 4. Connecter au Firewall
- Parser `agent-constitution.md` section "Limites"
- Générer config firewall dynamiquement

### 5. Ajouter ADR
- Documenter décision dans `docs/ADR-002-agent-constitution-vs-project-charter.md`

---

## Références

- Discussion : Session 2025-10-14 (LegalGuard-Chatbot workflow testing)
- Inspiration : Anthropic Constitutional AI, OpenAI System Card
- Pattern : Design/Dev Decoupling (agent identity vs project identity)

---

**Statut V5 :** Documentation uniquement (pas d'implémentation)
**Statut V6 :** À implémenter (nomenclature clarifiée + firewall connecté)
