#!/bin/bash

# 🛡️ ACTIVATE VALIDATION MODE
# Active le mode "Confiance Zéro" avec validation automatique

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}🛡️  ACTIVATION MODE VALIDATION CONFIANCE ZÉRO${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# 1. Backup de la configuration actuelle
if [ -f ".claude-hooks.json" ]; then
    echo -e "${YELLOW}📦 Sauvegarde de la configuration actuelle...${NC}"
    cp .claude-hooks.json .claude-hooks.backup.$(date +%Y%m%d_%H%M%S).json
    echo -e "${GREEN}✅ Configuration sauvegardée${NC}\n"
fi

# 2. Activer les hooks de validation
echo -e "${YELLOW}🔧 Activation des hooks de validation...${NC}"
cp .claude-hooks-validation.json .claude-hooks.json
echo -e "${GREEN}✅ Hooks de validation activés${NC}\n"

# 3. Rendre les scripts exécutables
echo -e "${YELLOW}🔨 Configuration des permissions...${NC}"
chmod +x validate.sh
chmod +x zero-trust-validator.js
chmod +x gemini-prevalidator.js
echo -e "${GREEN}✅ Scripts configurés${NC}\n"

# 4. Vérifier les dépendances
echo -e "${YELLOW}📋 Vérification des dépendances...${NC}"
MISSING_DEPS=""

# Vérifier chalk et ora pour les scripts
if ! npm list chalk >/dev/null 2>&1; then
    MISSING_DEPS="$MISSING_DEPS chalk"
fi
if ! npm list ora >/dev/null 2>&1; then
    MISSING_DEPS="$MISSING_DEPS ora"
fi

if [ -n "$MISSING_DEPS" ]; then
    echo -e "${YELLOW}Installation des dépendances manquantes: $MISSING_DEPS${NC}"
    npm install --save-dev $MISSING_DEPS
    echo -e "${GREEN}✅ Dépendances installées${NC}\n"
else
    echo -e "${GREEN}✅ Toutes les dépendances sont présentes${NC}\n"
fi

# 5. Test rapide de validation
echo -e "${YELLOW}🧪 Test rapide du système de validation...${NC}"
if ./validate.sh --quick >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Système de validation opérationnel${NC}\n"
else
    echo -e "${YELLOW}⚠️  Le build a des problèmes mais la validation fonctionne${NC}\n"
fi

# 6. Créer un alias pour validation rapide
echo -e "${YELLOW}🚀 Création des alias de commande...${NC}"
cat > .validation-aliases.sh << 'EOF'
# Aliases pour validation rapide
alias vq='./validate.sh --quick'
alias vs='./validate.sh --strict'
alias vv='./validate.sh --verbose'
alias gv='node gemini-prevalidator.js'
alias ztv='node zero-trust-validator.js'
alias vall='./validate.sh --strict && node gemini-prevalidator.js'

echo "Aliases de validation chargés:"
echo "  vq  - Validation rapide"
echo "  vs  - Validation stricte"
echo "  vv  - Validation verbose"
echo "  gv  - Gemini pre-validation"
echo "  ztv - Zero Trust Validator"
echo "  vall - Validation complète"
EOF

echo -e "${GREEN}✅ Aliases créés (source .validation-aliases.sh pour les utiliser)${NC}\n"

# 7. Afficher le mode d'emploi
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}📖 MODE D'EMPLOI${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""
echo -e "${GREEN}Le mode Validation Confiance Zéro est maintenant ACTIF !${NC}"
echo ""
echo "🔹 Validation automatique:"
echo "  • Build vérifié après chaque sauvegarde de fichier"
echo "  • Validation stricte avant chaque commit"
echo "  • Pré-validation Gemini sur mots-clés"
echo ""
echo "🔹 Commandes disponibles:"
echo "  ./validate.sh --quick     # Validation rapide"
echo "  ./validate.sh --strict    # Validation stricte (score > 8/10)"
echo "  node gemini-prevalidator.js  # Détection proactive d'erreurs"
echo ""
echo "🔹 Pour désactiver temporairement:"
echo "  mv .claude-hooks.json .claude-hooks.disabled"
echo ""
echo "🔹 Pour restaurer l'ancienne config:"
echo "  cp .claude-hooks.backup.*.json .claude-hooks.json"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
echo "• Ne JAMAIS accepter 'ça devrait fonctionner' sans preuve"
echo "• Toujours exiger les logs complets en cas d'erreur"
echo "• Refuser tout script de contournement (build-workaround.sh)"
echo ""
echo -e "${GREEN}=================================================${NC}"
echo -e "${GREEN}✅ MODE VALIDATION ACTIVÉ AVEC SUCCÈS${NC}"
echo -e "${GREEN}=================================================${NC}"

# 8. Optionnel: Charger les aliases dans le shell actuel
echo ""
read -p "Voulez-vous charger les aliases maintenant? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    source .validation-aliases.sh
    echo -e "${GREEN}✅ Aliases chargés dans le shell actuel${NC}"
fi