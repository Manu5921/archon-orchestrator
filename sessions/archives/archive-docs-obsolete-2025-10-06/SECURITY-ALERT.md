# ⚠️ ALERTE SÉCURITÉ - ACTION REQUISE

## 🚨 Token GitHub Exposé

Un GitHub Personal Access Token a été accidentellement partagé. 

### Actions Immédiates Requises :

1. **RÉVOQUE LE TOKEN IMMÉDIATEMENT**
   - Va sur : https://github.com/settings/personal-access-tokens
   - Trouve et révoque le token compromis
   - Il commence par : `github_pat_11BELLXNY...`

2. **Crée un Nouveau Token**
   - Génère un nouveau Fine-grained PAT
   - Ne le partage avec PERSONNE (même pas avec Claude ou d'autres IA)

3. **Configure le Nouveau Token**
   ```bash
   # Édite le fichier .env manuellement
   nano .env
   # OU
   vim .env
   
   # Remplace la ligne GITHUB_PAT par :
   GITHUB_PAT=ton_nouveau_token_ici
   ```

4. **Vérifie la Sécurité**
   ```bash
   # Assure-toi que .env est dans .gitignore
   grep -q "^\.env$" .gitignore || echo ".env" >> .gitignore
   
   # Protège le fichier
   chmod 600 .env
   ```

## 🔐 Bonnes Pratiques de Sécurité

### JAMAIS :
- ❌ Ne partage pas de tokens dans des messages
- ❌ Ne committe pas de tokens dans Git
- ❌ Ne montre pas de tokens dans des screenshots

### TOUJOURS :
- ✅ Utilise des variables d'environnement
- ✅ Garde les tokens dans des fichiers .env locaux
- ✅ Révoque immédiatement les tokens exposés
- ✅ Utilise des tokens avec permissions minimales
- ✅ Rotation régulière (tous les 90 jours)

## 📝 Comment Configurer Correctement

1. **Crée le token sur GitHub** (sans le copier dans le chat)
2. **Ouvre directement le fichier .env** dans ton éditeur
3. **Colle le token** directement dans le fichier
4. **Sauvegarde** le fichier

```bash
# Test que le token fonctionne (sans l'afficher)
node -e "console.log(process.env.GITHUB_PAT ? '✅ Token configured' : '❌ Token missing')" 
```

## 🆘 Si tu Penses que le Token a été Compromis

1. Révoque-le immédiatement sur GitHub
2. Vérifie l'activité récente : https://github.com/settings/security-log
3. Active 2FA si pas déjà fait
4. Vérifie qu'aucun code/repo n'a été modifié

---

**Important** : La sécurité de tes credentials est critique. Ne les partage jamais, même avec des assistants IA de confiance.