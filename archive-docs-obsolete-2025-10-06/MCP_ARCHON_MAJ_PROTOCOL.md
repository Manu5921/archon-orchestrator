# 🔄 PROTOCOL MCP ARCHON MAJ - SYNCHRONISATION CRITIQUE

## 🎯 Commande Raccourci `/mcp archon MAJ`

**Signification :** "Fais une mise à jour complète des tasks et vérifie la cohérence du projet à la racine avec Archon"

Cette commande déclenche un **protocole de synchronisation bidirectionnelle** pour maintenir la cohérence entre :
- 📁 **Fichiers locaux** (PRD, ADR, README, code...)  
- 🌐 **Archon UI** (tasks, documents, versions, projet)

---

## 📋 CHECKLIST OBLIGATOIRE pour Claude

Quand l'utilisateur tape `/mcp archon MAJ`, Claude **DOIT automatiquement** :

### **1. 🔍 Analyse des Changements**
```bash
# Identifier les modifications depuis dernière sync
- Quels fichiers ont été modifiés/créés/supprimés ?
- Quelles features/tasks sont concernées ?
- Y a-t-il des décisions architecturales importantes ?
```

### **2. 📝 Mise à Jour Tasks**
```bash
# Pour chaque task impactée :
/mcp archon update_task task_id="[id]" 
                       status="[nouveau-statut]"
                       notes="Files modifiés: [liste-fichiers]"
                       progress="[%]"

# Exemples statuts :
# "todo" → "in_progress" → "review" → "done"
```

### **3. 📚 Synchronisation Documentation**
```bash
# Si README modifié :
/mcp archon update_document project_id="latest"
                           doc_id="readme" 
                           content="[nouveau-contenu-readme]"

# Si nouveaux ADR créés :
/mcp archon create_document project_id="latest"
                           title="ADR-00X: [titre]"
                           document_type="adr"
                           content="[contenu-adr]"
```

### **4. 🏷️ Gestion des Versions**
```bash
# Pour changements importants (nouvelles features, refactoring majeur) :
/mcp archon create_version project_id="latest"
                          field_name="docs" 
                          content="[snapshot-docs-actuels]"
                          change_summary="Feature auth terminée + ADR mis à jour"

# Exemples de change_summary :
# "Feature authentification implémentée"
# "Refactoring architecture types"  
# "Tests intégration ajoutés"
# "Documentation API mise à jour"
```

### **5. 🎯 Mise à Jour Features**
```bash
# Si une feature est terminée :
/mcp archon update_project project_id="latest"
                          # Mettre à jour le statut global

# Ajouter/modifier features :
# (Utiliser la structure features du projet si disponible)
```

### **6. ✅ Vérification Cohérence**
```bash
# Contrôles automatiques :
- Tasks liées aux fichiers modifiés sont-elles à jour ?
- README reflète-t-il l'état actuel du projet ?
- ADRs documentent-ils les décisions prises ?
- Versions créées pour traçabilité ?

# Si incohérences détectées → Les corriger automatiquement
```

---

## 🚨 DÉCLENCHEURS AUTOMATIQUES

Claude devrait proposer `/mcp archon MAJ` automatiquement quand :

### **Déclencheurs Majeurs :**
- ✅ Feature marquée comme terminée (`/feature-complete`)
- 📝 Fichiers ADR modifiés/créés  
- 📋 README.md mis à jour
- 🏗️ Architecture du projet modifiée
- 🧪 Nouveaux tests ajoutés
- 📦 package.json modifié (dépendances)

### **Déclencheurs Mineurs (optionnels) :**
- 🐛 Bug fix important
- 🎨 Refactoring significatif
- 📚 Documentation technique ajoutée

---

## 💡 EXEMPLES CONCRETS

### **Scenario 1 : Feature Auth Terminée**
```bash
# Utilisateur : /feature-complete auth
# → Tests passent, build OK

# Claude propose automatiquement :
"Feature auth validée ! Dois-je synchroniser avec Archon ?"
"/mcp archon MAJ"

# Claude exécute :
/mcp archon update_task task_id="auth_task" status="review"
/mcp archon create_version change_summary="Feature auth terminée - JWT + middleware"
/mcp archon update_document doc_id="readme" content="[nouveau README avec auth setup]"
```

### **Scenario 2 : Nouveau ADR Créé**
```bash
# Utilisateur crée : docs/ADR/ADR-003-database-choice.md

# Claude détecte et propose :
"/mcp archon MAJ"

# Claude exécute :
/mcp archon create_document title="ADR-003: Choix Base de Données" 
                           document_type="adr"
                           content="[contenu-adr-003]"
/mcp archon create_version change_summary="ADR-003 ajouté - décision PostgreSQL"
```

### **Scenario 3 : Refactoring Types**
```bash
# Utilisateur refactorise src/types/ 

# Claude détecte modifications importantes et propose :
"/mcp archon MAJ"

# Claude exécute :
/mcp archon update_task task_id="types_task" 
                       notes="Refactoring types terminé - API/DB/Components séparés"
/mcp archon create_version field_name="features" 
                          change_summary="Types refactorisés - structure E2 appliquée"
```

---

## 🎯 RÉSULTAT ATTENDU

Après `/mcp archon MAJ`, l'utilisateur doit avoir :

✅ **Cohérence totale** Fichiers ↔ Archon UI  
✅ **Tasks à jour** avec status réels  
✅ **Versions tracées** pour changements importants  
✅ **Documentation synchronisée** (README, ADR)  
✅ **Historique préservé** pour audit/rollback  

**L'utilisateur peut se concentrer sur le code, Claude maintient la cohérence Archon automatiquement.**