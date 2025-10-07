# Index Fichiers Valides - Workflow V3

**Date:** 2025-10-07
**Version:** 3.0 (Claude Max + Jules Security + Bootstrap + Design + Context7)
**Statut:** ✅ Nettoyage complet (121 fichiers obsolètes archivés)

---

## 🎯 FICHIERS ESSENTIELS (À LIRE EN PRIORITÉ)

### Points d'Entrée

| Fichier | Description | Taille | Priorité |
|---------|-------------|--------|----------|
| **START-HERE.md** | Point d'entrée unique projet | ~8KB | 🔴 **P0** |
| **README.md** | Overview projet Archon Orchestrator | ~12KB | 🔴 **P0** |
| **CLAUDE.md** | Instructions session Claude Code | ~15KB | 🔴 **P0** |
| **docs/WORKFLOW-COMPLETE-V3.md** | **SOURCE DE VÉRITÉ** workflow complet | 85KB | 🔴 **P0** |

---

## 📚 DOCUMENTATION WORKFLOW V3

### Workflow Principal

| Fichier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **docs/WORKFLOW-COMPLETE-V3.md** | Workflow complet (RIEN NE MANQUE) | 5 piliers + 2 options + mobile + Context7 | ✅ **SOURCE VÉRITÉ** |
| **docs/WORKFLOW-CLAUDE-FIRST-JULES-SECURITY.md** | Focus multi-client | Timeline + ROI + troubleshooting | ✅ Valide |
| **docs/WORKFLOW-SOLOPRENEUR-VISION.md** | Vision workflow solo | 3 phases + différence solo vs équipe | ✅ Valide |

### Setup & Configuration

| Fichier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **docs/JULES-SECURITY-GUARDIAN-SETUP.md** | Setup Jules CLI + API key | Installation + configuration + tests | ✅ Valide |
| **docs/MULTI-CLIENT-SETUP-GUIDE.md** | Setup multi-client (8-10/semaine) | Directory structure + templates + Context7 | ✅ Valide |
| **docs/DESIGN-SYSTEM-SOLO-SIMPLIFIED.md** | Design tokens workflow | T002 process + 20 tokens + wireframes | ✅ Valide |

### Patterns & Best Practices

| Fichier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **docs/SUB-AGENTS-MASTERY.md** | Sub-agents orchestration | Bootstrap + chaining + dynamic selection | ✅ Valide |
| **docs/AGENTIC-PATTERNS.md** | Patterns agentic coding | GATHER → ACTION → VERIFY | ✅ Valide |
| **docs/ZERO-TRUST.md** | Quality gates P0-P4 | Build + Lint + Tests + Docs + Perf | ✅ Valide |
| **docs/GOLDEN-PATTERNS.md** | Patterns battle-tested | Code patterns réutilisables | ✅ Valide |
| **docs/TROUBLESHOOTING.md** | Debug + solutions | 7+ problèmes courants | ✅ Valide |

### Références Techniques

| Fichier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **CLAUDE-CODE-CAPACITES-REFERENCE.md** | Capacités Sonnet 4.5 | SWE-bench SOTA + 0% error rate + features | ✅ Valide |
| **docs/ARCHITECTURE-COMPLIANCE-V2.md** | Architecture compliance | Validation architecture + ADRs | ✅ Valide |
| **docs/DOCKER-GUIDE.md** | Docker deployment (si besoin) | Containers + compose | ✅ Valide |

---

## ⚙️ GITHUB ACTIONS WORKFLOWS

### Workflows Production

| Fichier | Description | Jobs | Statut |
|---------|-------------|------|--------|
| **.github/workflows/claude-max-implementation.yml** | **PRINCIPAL** workflow | 2 jobs: claude-implementation + jules-security (parallèle) | ✅ **PRODUCTION** |
| **.github/workflows/jules-security-guardian.yml** | Jules standalone (backup) | 1 job: security-scan only | ✅ Backup |

### Templates & Checklists

| Fichier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **.github/security-checklist.md** | Checklist OWASP + RGPD + CVE | 10 sections OWASP + 5 sections RGPD | ✅ Valide |
| **.github/pull_request_template.md** | Template PR | Format standardisé PRs | ✅ Valide |
| **.github/ISSUE_TEMPLATE/implement-batch.yml** | Template issue batch | Format "Task range: T001-T010" | ✅ Valide |

---

## 🤖 CLAUDE AGENTS & COMMANDS

### Agents Bootstrapped

| Fichier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **.claude/agents/mega-orchestrator-bootstrap.md** | Bootstrap meta-agent | Génère 3-4 agents depuis tasks.md | ✅ Valide |

**Note:** Les agents (backend-specialist, frontend-specialist, design-specialist, testing-specialist) sont **générés dynamiquement** par `/bootstrap`.

### Slash Commands

| Fichier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **.claude/commands/smart-review.md** | Smart Review command | Review code + Gemini validation (si besoin) | ✅ Valide |
| **.claude/commands/README.md** | Documentation commands | Usage slash commands | ✅ Valide |

### Context Templates

| Fichier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **.claude/context/README.md** | Documentation context | Injection context | ✅ Valide |
| **.claude/context/templates/context-template.json** | Template context JSON | Format standard | ✅ Valide |

---

## 📦 CONFIGURATION PROJET

### Configuration Essentielle

| Fichier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **package.json** | Dependencies npm | Next.js + tests + scripts | ✅ Valide |
| **.claude-hooks.json** | Hooks Claude Code actifs | Hooks validation + Context7 | ✅ Valide |
| **vercel.json** | Config Vercel deploy | Routes + headers | ✅ Valide |

### Configuration Tests

| Fichier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **jest.config.js** | Config Jest | Unit tests config | ✅ Valide |
| **playwright.config.js** | Config Playwright | E2E tests config | ✅ Valide |
| **next.config.js** | Config Next.js | App config (si projet Next.js) | ✅ Valide |

---

## 📖 KNOWLEDGE BASE (PATTERNS CONTEXT7)

### Patterns Génériques Valides

| Fichier | Description | Réutilisabilité | Statut |
|---------|-------------|-----------------|--------|
| **knowledge-base/architecture-best-practices.md** | Best practices architecture | 100% | ✅ Valide |
| **knowledge-base/auto-learned/bp_orchestration-multi-task*.json** | Orchestration patterns | 90% | ✅ Valide |
| **knowledge-base/auto-learned/bp_rag-auto-learning*.json** | RAG patterns | 80% | ✅ Valide |
| **knowledge-base/auto-learned/wf_archon_orchestrator_6_piliers*.json** | Workflow référence | Historique | ✅ Référence |
| **knowledge-base/auto-learned/wf_nouveau_projet_setup*.json** | Setup patterns | 85% | ✅ Valide |

**Note:** Patterns Gemini/Jules locaux archivés (obsolètes avec GitHub Actions workflow).

---

## 🗂️ TEMPLATES RÉUTILISABLES

### Templates Projet

| Fichier | Description | Usage | Statut |
|---------|-------------|-------|--------|
| **templates/ARCHITECTURE-TEMPLATE.md** | Template ADR | Architecture Decision Records | ✅ Valide |
| **templates/PROJECT-INIT.md** | Template init projet | Quick start nouveau projet | ✅ Valide |

---

## 🛠️ SCRIPTS UTILITAIRES (GARDER)

### Scripts Quality Gates

| Fichier | Description | Usage | Statut |
|---------|-------------|-------|--------|
| **scripts/quality-gate.js** | Quality gates validation | P0-P4 checks | ✅ Valide |
| **scripts/validate-setup.js** | Validation setup projet | Vérifier configuration | ✅ Valide |

---

## 🧪 INFRASTRUCTURE TESTING (GARDER POUR DEV)

**Note:** Fichiers tests **NON ARCHIVÉS** car utiles pour développement infrastructure.

### Tests E2E

| Dossier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **tests/e2e/** | Tests Playwright E2E | Dashboard, security, performance, widget | ✅ Infra |
| **tests/architecture-compliance/** | Tests compliance | Violation tests | ✅ Infra |

### Tests Unitaires

| Dossier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **__tests__/** | Tests Jest | Agents, utils, a11y | ✅ Infra |
| **src/test/** | Tests MCP | Orchestrator, MCP server | ✅ Infra |

### Scripts Tests Root

| Fichier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **test-*.js** (15+ fichiers) | Tests intégration | GitHub, MCP, workflows, security | ✅ Infra |

---

## 🏗️ CODE SOURCE INFRASTRUCTURE (GARDER POUR DEV)

**Note:** Code source **NON ARCHIVÉ** car utile pour développement serveurs/MCP si besoin futur.

### Agents Valides

| Dossier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **src/agents/claude-connector.js** | Claude connector | Connector Claude API | ✅ Infra |
| **src/agents/claude-mcp-connector.js** | Claude MCP connector | MCP protocol | ✅ Infra |
| **src/agents/mock-connector.js** | Mock connector tests | Testing | ✅ Infra |
| **src/agents/registry.js** | Agent registry | Registry pattern | ✅ Infra |
| **src/agents/sub-agents/specialized-agents.js** | Sub-agents code | Specialized agents | ✅ Infra |

### Services

| Dossier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **src/services/** | Services backend | Context, review services | ✅ Infra |
| **src/orchestrator/** | Orchestrator core | Router, metrics, context manager | ✅ Infra |
| **src/mcp/** | MCP server | Server, tools | ✅ Infra |

### Intégrations Valides

| Dossier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **src/integrations/github-mcp-client.js** | GitHub MCP client | GitHub API | ✅ Infra |

### Compliance & Security

| Dossier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **src/architecture-compliance/** | Architecture compliance | Context injection, quality gates, validation pipeline | ✅ Infra |
| **src/gdpr-compliance/** | RGPD compliance | Consent, audit, data processor, legal docs | ✅ Infra |

### Design System

| Dossier | Description | Contenu | Statut |
|---------|-------------|---------|--------|
| **design-system/** | Design system components | Storybook + tokens + components | ✅ Infra |

---

## 📂 STRUCTURE PROJET SIMPLIFIÉE

```
archon-orchestrator/
├── 📄 START-HERE.md                          ← Point d'entrée unique
├── 📄 README.md                              ← Overview projet
├── 📄 CLAUDE.md                              ← Instructions Claude Code
├── 📄 CLAUDE-CODE-CAPACITES-REFERENCE.md     ← Capacités Sonnet 4.5
│
├── 📁 docs/                                   ← Documentation workflow V3
│   ├── 📄 WORKFLOW-COMPLETE-V3.md            ← ✅ SOURCE DE VÉRITÉ (85KB)
│   ├── 📄 WORKFLOW-CLAUDE-FIRST-JULES-SECURITY.md
│   ├── 📄 WORKFLOW-SOLOPRENEUR-VISION.md
│   ├── 📄 JULES-SECURITY-GUARDIAN-SETUP.md
│   ├── 📄 MULTI-CLIENT-SETUP-GUIDE.md
│   ├── 📄 DESIGN-SYSTEM-SOLO-SIMPLIFIED.md
│   ├── 📄 SUB-AGENTS-MASTERY.md
│   ├── 📄 AGENTIC-PATTERNS.md
│   ├── 📄 ZERO-TRUST.md
│   ├── 📄 GOLDEN-PATTERNS.md
│   ├── 📄 TROUBLESHOOTING.md
│   ├── 📄 ARCHITECTURE-COMPLIANCE-V2.md
│   └── 📄 DOCKER-GUIDE.md
│
├── 📁 .github/workflows/                      ← GitHub Actions
│   ├── 📄 claude-max-implementation.yml      ← ✅ PRINCIPAL workflow
│   └── 📄 jules-security-guardian.yml        ← Backup standalone
│
├── 📁 .github/                                ← Templates GitHub
│   ├── 📄 security-checklist.md              ← Checklist OWASP + RGPD
│   ├── 📄 pull_request_template.md
│   └── 📁 ISSUE_TEMPLATE/
│       └── 📄 implement-batch.yml
│
├── 📁 .claude/                                ← Claude Code config
│   ├── 📁 agents/
│   │   └── 📄 mega-orchestrator-bootstrap.md ← Bootstrap meta-agent
│   ├── 📁 commands/
│   │   ├── 📄 smart-review.md
│   │   └── 📄 README.md
│   └── 📁 context/
│       ├── 📄 README.md
│       └── 📁 templates/
│           └── 📄 context-template.json
│
├── 📁 knowledge-base/                         ← Context7 patterns
│   ├── 📄 architecture-best-practices.md
│   └── 📁 auto-learned/
│       ├── 📄 bp_orchestration-multi-task*.json
│       ├── 📄 bp_rag-auto-learning*.json
│       ├── 📄 wf_archon_orchestrator_6_piliers*.json
│       └── 📄 wf_nouveau_projet_setup*.json
│
├── 📁 templates/                              ← Templates projet
│   ├── 📄 ARCHITECTURE-TEMPLATE.md
│   └── 📄 PROJECT-INIT.md
│
├── 📁 scripts/                                ← Scripts utilitaires
│   ├── 📄 quality-gate.js
│   └── 📄 validate-setup.js
│
├── 📁 src/                                    ← Code source infra
│   ├── 📁 agents/                            ← Connectors (Claude, mock, registry)
│   ├── 📁 services/                          ← Services backend
│   ├── 📁 orchestrator/                      ← Orchestrator core
│   ├── 📁 mcp/                               ← MCP server
│   ├── 📁 integrations/                      ← GitHub MCP
│   ├── 📁 architecture-compliance/           ← Compliance tools
│   ├── 📁 gdpr-compliance/                   ← RGPD tools
│   └── 📁 utils/                             ← Utilities
│
├── 📁 tests/                                  ← Tests E2E + compliance
│   ├── 📁 e2e/                               ← Playwright tests
│   └── 📁 architecture-compliance/           ← Violation tests
│
├── 📁 __tests__/                              ← Tests unitaires Jest
│   ├── 📁 agents/
│   ├── 📁 utils/
│   └── 📁 a11y/
│
├── 📁 design-system/                          ← Design system (si besoin)
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   └── 📁 tokens/
│   └── 📁 .storybook/
│
├── 📁 archive-obsolete-2025-10-07-v3/        ← ✅ Fichiers archivés (121 fichiers)
│   └── 📄 ARCHIVAGE-RAISONS-V3.md            ← Documentation archivage
│
├── 📄 package.json                            ← Dependencies npm
├── 📄 .claude-hooks.json                      ← Hooks Claude actifs
├── 📄 vercel.json                             ← Config Vercel
├── 📄 jest.config.js                          ← Config Jest
├── 📄 playwright.config.js                    ← Config Playwright
└── 📄 next.config.js                          ← Config Next.js
```

---

## 🗑️ FICHIERS ARCHIVÉS (121 total)

**Voir détails:** `archive-obsolete-2025-10-07-v3/ARCHIVAGE-RAISONS-V3.md`

**Catégories archivées:**
- Documentation obsolète (8 fichiers .md)
- Workflows GitHub Actions obsolètes (5 fichiers .yml)
- Scripts JS obsolètes (18+ fichiers .js)
- Code source obsolète (40+ fichiers src/)
- Configuration obsolète (15+ fichiers .json/.yml)
- Hooks obsolètes (7 fichiers .json)
- Templates obsolètes (1 fichier .md)
- Knowledge base obsolète (7 fichiers .json)

**Raisons archivage:**
- Workflows abandonnés (Gemini Bridge, Archon servers)
- Architecture équipe (vs workflow solo actuel)
- Contradictions avec WORKFLOW-COMPLETE-V3.md
- Remplacés par GitHub Actions workflows

---

## ✅ QUICK START WORKFLOW V3

### Option A: Full Local (Mac Mini 24/7)

```bash
# 1. Lire documentation
cat START-HERE.md
cat docs/WORKFLOW-COMPLETE-V3.md

# 2. Setup one-time
npm install -g @google/jules-cli
jules auth login

# 3. Nouveau client
cd ~/clients/
uvx --from git+https://github.com/github/spec-kit.git specify init reviewrescue
cd reviewrescue/

# 4. Planning (30 min)
/speckit.constitution
/speckit.specify
/speckit.plan
/speckit.tasks

# 5. Bootstrap (2 min)
/bootstrap

# 6. Implementation (3-4h)
/implement

# 7. Git + Jules (55 min async)
git init && git add . && git commit -m "feat: MVP complete"
gh repo create reviewrescue --private --source=. --push
# GitHub Actions démarre Jules automatiquement

# 8. Review mobile (15 min)
# GitHub app Android → Review PRs → Approve + Merge
```

---

### Option B: GitHub Actions (Cloud VM)

```bash
# 1. Récupérer credentials Claude Max
# Keychain Access → "claude" → Copier JSON (accessToken, refreshToken, expiresAt)

# 2. Configurer GitHub Secrets
gh secret set CLAUDE_ACCESS_TOKEN --body "..."
gh secret set CLAUDE_REFRESH_TOKEN --body "..."
gh secret set CLAUDE_EXPIRES_AT --body "..."
gh secret set JULES_API_KEY --body "..."

# 3. Planning local (30 min)
cd ~/clients/reviewrescue/
/speckit.constitution
/speckit.specify
/speckit.plan
/speckit.tasks

# 4. Copier workflow
cp ~/Documents/DEV/archon-orchestrator/.github/workflows/claude-max-implementation.yml .github/workflows/
cp ~/Documents/DEV/archon-orchestrator/.github/security-checklist.md .github/

# 5. Push planning
git init && git add . && git commit -m "docs: planning complete"
gh repo create reviewrescue --private --source=. --push

# 6. Déclenchement mobile (2 min)
# GitHub app → New issue
# Title: "Implement T001-T010"
# Body: "Task range: T001-T010"
# Label: run-claude
# Submit → Workflow démarre (3-4h async)

# 7. Review mobile (15 min)
# Notification PR → Review → Approve + Merge
```

---

## 📊 STATISTIQUES PROJET

| Métric | Valeur |
|--------|--------|
| **Fichiers documentation V3** | 13 fichiers .md |
| **Workflows GitHub Actions valides** | 2 fichiers .yml |
| **Agents Claude** | 1 meta-agent (génère 3-4 dynamiquement) |
| **Patterns Context7 valides** | 5 patterns génériques |
| **Fichiers archivés** | 121 fichiers obsolètes |
| **Taille documentation V3** | ~150KB (WORKFLOW-COMPLETE-V3 85KB) |
| **Coverage workflow V3** | 100% (RIEN NE MANQUE) |

---

## 🔗 NAVIGATION RAPIDE

| Je veux... | Fichier |
|------------|---------|
| **Démarrer workflow V3** | START-HERE.md |
| **Comprendre workflow complet** | docs/WORKFLOW-COMPLETE-V3.md |
| **Setup Claude Max + GitHub Actions** | docs/WORKFLOW-COMPLETE-V3.md (section Setup Option B) |
| **Setup Jules Security** | docs/JULES-SECURITY-GUARDIAN-SETUP.md |
| **Setup multi-client** | docs/MULTI-CLIENT-SETUP-GUIDE.md |
| **Bootstrap sub-agents** | docs/SUB-AGENTS-MASTERY.md |
| **Design tokens** | docs/DESIGN-SYSTEM-SOLO-SIMPLIFIED.md |
| **Patterns agentic** | docs/AGENTIC-PATTERNS.md |
| **Quality gates** | docs/ZERO-TRUST.md |
| **Troubleshooting** | docs/TROUBLESHOOTING.md |
| **Fichiers archivés** | archive-obsolete-2025-10-07-v3/ARCHIVAGE-RAISONS-V3.md |

---

**Version:** 3.0
**Date:** 2025-10-07
**Statut:** ✅ Nettoyage complet
**Fichiers archivés:** 121
**Fichiers valides:** ~80 (docs + config + infra)
**Source de vérité:** docs/WORKFLOW-COMPLETE-V3.md (85KB)
