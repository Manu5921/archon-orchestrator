# 📚 INDEX DOCUMENTATION ARCHON ORCHESTRATOR

**Navigation rapide de toute la documentation**

---

## 🚨 COMMENCER ICI

### Pour Sessions Claude Code

**1️⃣ OBLIGATOIRE - Lire en premier :**
- **[START-HERE.md](./START-HERE.md)** - Point d'entrée unique
- **[RESTART-PROCEDURE-STRICT.md](./RESTART-PROCEDURE-STRICT.md)** - Procédure stricte (MANDATORY)

---

## 📋 GUIDES PAR TÂCHE

### Redémarrer Archon

**Quick Start :**
1. Lire [RESTART-PROCEDURE-STRICT.md](./RESTART-PROCEDURE-STRICT.md)
2. Copier-coller les commandes exactes
3. Attendre 2-3 minutes

**Guide Détaillé :**
- [RESTART-GUIDE-COMPLET.md](./RESTART-GUIDE-COMPLET.md)

### Configurer MCP & Agents

**Dans ce projet :**
- [MCP-AGENTS-CHEATSHEET.md](./MCP-AGENTS-CHEATSHEET.md)

**Guide complet (archon-native) :**
- `/Users/manu/Documents/DEV/archon-native/SETUP-MCP-AGENTS.md`

### Workflow Développement

- [CLAUDE.md](./CLAUDE.md) - Guide session Claude Code complet

---

## 📁 FICHIERS DOCUMENTATION

### Critiques (Lire en premier)

| Fichier | Usage | Priorité |
|---------|-------|----------|
| [START-HERE.md](./START-HERE.md) | Point d'entrée | 🔴 P0 |
| [RESTART-PROCEDURE-STRICT.md](./RESTART-PROCEDURE-STRICT.md) | Procédure redémarrage | 🔴 P0 |
| [RESTART-GUIDE-COMPLET.md](./RESTART-GUIDE-COMPLET.md) | Guide détaillé | 🟡 P1 |

### Références

| Fichier | Usage | Priorité |
|---------|-------|----------|
| [MCP-AGENTS-CHEATSHEET.md](./MCP-AGENTS-CHEATSHEET.md) | MCP aide-mémoire | 🟢 P2 |
| [CLAUDE.md](./CLAUDE.md) | Workflow complet | 🟢 P2 |
| [README.md](./README.md) | Documentation projet | 🟢 P3 |

---

## 🎯 PAR SCÉNARIO

### Scénario 1 : "Mac a crashé, je dois redémarrer Archon"

**Fichiers à lire :**
1. [RESTART-PROCEDURE-STRICT.md](./RESTART-PROCEDURE-STRICT.md) 🔴
2. Copier-coller commandes
3. Attendre 2-3 min

**Temps total :** 5 minutes (2 min lecture + 3 min restart)

### Scénario 2 : "Je configure un nouveau projet Claude Code"

**Fichiers à lire :**
1. [MCP-AGENTS-CHEATSHEET.md](./MCP-AGENTS-CHEATSHEET.md)
2. `/Users/manu/Documents/DEV/archon-native/SETUP-MCP-AGENTS.md` (guide complet)

**Temps total :** 15-20 minutes

### Scénario 3 : "Je commence une session de dev sur Archon"

**Fichiers à lire :**
1. [CLAUDE.md](./CLAUDE.md) - Workflow complet
2. [RESTART-GUIDE-COMPLET.md](./RESTART-GUIDE-COMPLET.md) - Architecture

**Temps total :** 30 minutes

---

## 🚨 ERREURS FRÉQUENTES

**Documentées dans :**
- [RESTART-PROCEDURE-STRICT.md](./RESTART-PROCEDURE-STRICT.md) section "Erreurs Récurrentes"

**Top 3 Erreurs :**
1. ❌ `make dev` sans `cd` explicite
2. ❌ Répéter commande qui échoue sans analyser
3. ❌ Chemins relatifs au lieu d'absolus

---

## 📊 STATISTIQUES DOCUMENTATION

| Catégorie | Fichiers | Pages |
|-----------|----------|-------|
| Guides Restart | 3 | ~15 pages |
| Guides MCP | 2 | ~8 pages |
| Workflow | 2 | ~10 pages |
| **TOTAL** | **7 fichiers** | **~33 pages** |

---

## 🔗 LIENS VERS AUTRES PROJETS

### Archon Principal
```
/Users/manu/Documents/DEV/archon/
├── Makefile                 ← make dev
├── docker-compose.yml
└── README.md
```

### Archon Native (Nouveau)
```
/Users/manu/Documents/DEV/archon-native/
├── SETUP-MCP-AGENTS.md      ← Guide MCP complet
├── DOCUMENTATION-INDEX.md
├── README.md
└── .mcp.json
```

---

## ✅ CHECKLIST SESSION CLAUDE

Avant de travailler sur Archon :

- [ ] Lu [START-HERE.md](./START-HERE.md)
- [ ] Lu [RESTART-PROCEDURE-STRICT.md](./RESTART-PROCEDURE-STRICT.md)
- [ ] Compris les 4 règles absolues
- [ ] Redis actif : `redis-cli ping`
- [ ] Archon lancé : `cd /Users/manu/Documents/DEV/archon && make dev`
- [ ] Services vérifiés : `curl http://localhost:8181/health`

**Si TOUT coché → Prêt pour développement** ✅

---

**Dernière mise à jour :** Octobre 2025
**Statut :** Index complet et validé
