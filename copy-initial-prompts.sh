#!/bin/bash

# 🤝 SCRIPT D'ACTIVATION PROMPTS CLAUDE-GEMINI

echo "🤝 Génération prompts Claude-Gemini personnalisés"

PROJECT_NAME="$1"
PROJECT_DESC="$2" 
STACK="$3"
CONSTRAINTS="$4"

if [[ -z "$PROJECT_NAME" ]]; then
    echo ""
    echo "📋 USAGE:"
    echo "./copy-initial-prompts.sh 'ProjectName' 'Description' 'Stack' 'Constraints'"
    echo ""
    echo "📝 EXEMPLE:"
    echo "./copy-initial-prompts.sh 'TrustBoost' 'Plateforme avis clients TPE/PME' 'Next.js 15 + Supabase + Stripe' 'RGPD + Rate limiting'"
    echo ""
    exit 1
fi

# Vérifier que le template existe
if [[ ! -f "claude-gemini-initial-prompt.md" ]]; then
    echo "❌ Template claude-gemini-initial-prompt.md not found"
    exit 1
fi

# Générer prompts personnalisés
OUTPUT_FILE="${PROJECT_NAME// /-}-collaboration-prompts.md"

# Échapper les caractères spéciaux pour sed
PROJECT_NAME_ESC=$(echo "$PROJECT_NAME" | sed 's/[[\.*^$()+?{|]/\\&/g')
PROJECT_DESC_ESC=$(echo "$PROJECT_DESC" | sed 's/[[\.*^$()+?{|]/\\&/g')
STACK_ESC=$(echo "$STACK" | sed 's/[[\.*^$()+?{|]/\\&/g')
CONSTRAINTS_ESC=$(echo "$CONSTRAINTS" | sed 's/[[\.*^$()+?{|]/\\&/g')

sed -e "s/\[NOM_PROJET\]/$PROJECT_NAME_ESC/g" \
    -e "s/\[DESCRIPTION_PROJET\]/$PROJECT_DESC_ESC/g" \
    -e "s/\[STACK_TECHNIQUE\]/$STACK_ESC/g" \
    -e "s/\[CONTRAINTES_SPÉCIFIQUES\]/$CONSTRAINTS_ESC/g" \
    claude-gemini-initial-prompt.md > "$OUTPUT_FILE"

echo "✅ Prompts personnalisés créés : $OUTPUT_FILE"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Ouvrir le fichier : open '$OUTPUT_FILE'"
echo "2. Copy section 'PROMPT CLAUDE' vers Claude Code"
echo "3. Copy section 'PROMPT GEMINI' vers Gemini"
echo "4. Les deux IA sont maintenant configurées pour collaborer !"
echo ""
echo "🚀 WORKFLOW:"
echo "- Claude propose architecture → Gemini évalue → Cycle itératif → Validation → Orchestration"
echo ""
echo "🔧 COMMANDES PRÊTES:"
echo "/mcp archon project_exploration '$PROJECT_DESC'"
echo "/mcp context7 resolve-library-id Next.js"