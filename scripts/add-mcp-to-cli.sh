#!/bin/bash
# 🔌 Script: Ajouter MCP Server dans Claude Code CLI Global
# Version: 1.0
# Date: 2025-10-14
# Auteur: Archon Orchestrator Team
#
# Usage: ./add-mcp-to-cli.sh <mcp-name> <command> [args...]
# Exemple: ./add-mcp-to-cli.sh basicmemory "/Users/manu/.pyenv/shims/uvx" "basic-memory" "mcp" "--project" "main"

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Config paths
CLAUDE_JSON="$HOME/.claude.json"
BACKUP_DIR="$HOME/.claude-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Validation arguments
if [ $# -lt 2 ]; then
  echo -e "${RED}❌ Usage: $0 <mcp-name> <command> [args...]${NC}"
  echo ""
  echo "Exemples:"
  echo "  $0 basicmemory \"/Users/manu/.pyenv/shims/uvx\" \"basic-memory\" \"mcp\" \"--project\" \"main\""
  echo "  $0 myserver \"/usr/local/bin/myserver\" \"start\""
  exit 1
fi

MCP_NAME="$1"
shift
COMMAND="$1"
shift
ARGS=("$@")

# Vérifier que la commande existe
if [ ! -f "$COMMAND" ] && ! command -v "$COMMAND" &> /dev/null; then
  echo -e "${YELLOW}⚠️  Warning: Commande '$COMMAND' non trouvée. Vérifiez le chemin absolu.${NC}"
  echo -e "${BLUE}💡 Astuce: Utilisez 'which <command>' pour trouver le chemin absolu${NC}"
  read -p "Continuer quand même ? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Backup ~/.claude.json
echo -e "${BLUE}📂 Backup de ~/.claude.json...${NC}"
mkdir -p "$BACKUP_DIR"
cp "$CLAUDE_JSON" "$BACKUP_DIR/claude.json.$TIMESTAMP"
echo -e "${GREEN}✅ Backup: $BACKUP_DIR/claude.json.$TIMESTAMP${NC}"

# Trouver toutes les sections mcpServers dans ~/.claude.json
echo -e "${BLUE}🔍 Recherche des sections mcpServers actives...${NC}"
SECTIONS=$(grep -n '"mcpServers"' "$CLAUDE_JSON" | cut -d: -f1)

if [ -z "$SECTIONS" ]; then
  echo -e "${RED}❌ Aucune section mcpServers trouvée dans ~/.claude.json${NC}"
  echo -e "${YELLOW}💡 Le fichier semble vide ou mal formaté.${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Sections trouvées aux lignes: $SECTIONS${NC}"

# Construire la config JSON du MCP
ARGS_JSON=$(printf ',"%s"' "${ARGS[@]}")
ARGS_JSON="[${ARGS_JSON:1}]"  # Retirer la virgule initiale

MCP_JSON=$(cat <<EOF
      "$MCP_NAME": {
        "type": "stdio",
        "command": "$COMMAND",
        "args": $ARGS_JSON,
        "env": {}
      }
EOF
)

echo ""
echo -e "${BLUE}📝 Configuration MCP à ajouter:${NC}"
echo "$MCP_JSON"
echo ""

# Demander confirmation
read -p "Ajouter '$MCP_NAME' dans TOUTES les sections mcpServers ? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}❌ Opération annulée${NC}"
  exit 0
fi

# Instructions manuelles (édition automatique complexe)
echo ""
echo -e "${YELLOW}⚠️  Édition manuelle recommandée pour éviter corruption JSON${NC}"
echo ""
echo -e "${BLUE}📋 Instructions:${NC}"
echo "1. Ouvrir l'éditeur:"
echo "   nano $CLAUDE_JSON"
echo ""
echo "2. Chercher les sections avec 'mcpServers' (lignes: $SECTIONS)"
echo ""
echo "3. Pour CHAQUE section, ajouter cette config AVANT l'accolade fermante '}':"
echo ""
echo -e "${GREEN}${MCP_JSON}${NC},"
echo ""
echo "4. Sauvegarder (Ctrl+O puis Enter) et quitter (Ctrl+X)"
echo ""
echo "5. Valider JSON:"
echo "   python3 -m json.tool $CLAUDE_JSON > /dev/null && echo '✅ JSON valide' || echo '❌ JSON invalide'"
echo ""
echo "6. Redémarrer Claude Code:"
echo "   - Exit session actuelle (Ctrl+D)"
echo "   - Relancer: claude"
echo ""
echo -e "${BLUE}💡 Astuce: Si JSON invalide, restaurer backup:${NC}"
echo "   cp $BACKUP_DIR/claude.json.$TIMESTAMP $CLAUDE_JSON"
echo ""

# Option: Ouvrir éditeur directement
read -p "Ouvrir nano maintenant ? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  nano "$CLAUDE_JSON"

  # Valider JSON après édition
  echo ""
  echo -e "${BLUE}🔍 Validation JSON...${NC}"
  if python3 -m json.tool "$CLAUDE_JSON" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ JSON valide !${NC}"
    echo ""
    echo -e "${BLUE}📋 Prochaines étapes:${NC}"
    echo "1. Exit Claude Code (Ctrl+D)"
    echo "2. Relancer: claude"
    echo "3. Vérifier: ListMcpResourcesTool(server=\"$MCP_NAME\")"
  else
    echo -e "${RED}❌ JSON invalide ! Erreur de syntaxe détectée.${NC}"
    echo ""
    echo -e "${YELLOW}🛟 Restaurer backup:${NC}"
    echo "   cp $BACKUP_DIR/claude.json.$TIMESTAMP $CLAUDE_JSON"
  fi
fi

echo ""
echo -e "${GREEN}✅ Script terminé${NC}"
