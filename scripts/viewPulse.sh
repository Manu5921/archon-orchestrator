#!/bin/bash
# viewPulse.sh - Observability Pulse Timeline Viewer
# Parses observability-pulse.jsonl and displays agent execution timeline

PULSE_FILE="observability-pulse.jsonl"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Icons
ICON_START="🚀"
ICON_END="✅"
ICON_ERROR="❌"
ICON_CHECKPOINT_PASS="✅"
ICON_CHECKPOINT_FAIL="❌"
ICON_CHECKPOINT_SKIP="⏭️"

# Check if pulse file exists
if [ ! -f "$PULSE_FILE" ]; then
  echo -e "${RED}Error: $PULSE_FILE not found${NC}"
  echo "Run an agent first to generate pulse data."
  exit 1
fi

# Check if file is empty
if [ ! -s "$PULSE_FILE" ]; then
  echo -e "${YELLOW}Warning: $PULSE_FILE is empty${NC}"
  echo "No events recorded yet."
  exit 0
fi

echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  OBSERVABILITY PULSE - AGENT EXECUTION TIMELINE${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Summary Statistics
total_events=$(wc -l < "$PULSE_FILE" | xargs)
agents=$(jq -r 'select(.type == "agent_start" or .type == "agent_end") | .agent' "$PULSE_FILE" 2>/dev/null | sort -u)
agents_count=$(echo "$agents" | grep -v '^$' | wc -l | xargs)
errors_count=$(jq -c 'select(.type == "agent_error")' "$PULSE_FILE" 2>/dev/null | wc -l | xargs)
checkpoints_pass=$(jq -c 'select(.type == "checkpoint" and .status == "pass")' "$PULSE_FILE" 2>/dev/null | wc -l | xargs)
checkpoints_fail=$(jq -c 'select(.type == "checkpoint" and .status == "fail")' "$PULSE_FILE" 2>/dev/null | wc -l | xargs)
checkpoints_skip=$(jq -c 'select(.type == "checkpoint" and .status == "skip")' "$PULSE_FILE" 2>/dev/null | wc -l | xargs)

# Calculate duration
first_timestamp=$(head -n 1 "$PULSE_FILE" | jq -r '.timestamp' 2>/dev/null)
last_timestamp=$(tail -n 1 "$PULSE_FILE" | jq -r '.timestamp' 2>/dev/null)

if [ -n "$first_timestamp" ] && [ -n "$last_timestamp" ]; then
  first_epoch=$(date -j -f "%Y-%m-%dT%H:%M:%S" "${first_timestamp:0:19}" "+%s" 2>/dev/null)
  last_epoch=$(date -j -f "%Y-%m-%dT%H:%M:%S" "${last_timestamp:0:19}" "+%s" 2>/dev/null)

  if [ -n "$first_epoch" ] && [ -n "$last_epoch" ]; then
    duration_s=$((last_epoch - first_epoch))
    duration_min=$((duration_s / 60))
    duration_sec=$((duration_s % 60))
  else
    duration_s="N/A"
    duration_min="N/A"
    duration_sec="N/A"
  fi
else
  duration_s="N/A"
  duration_min="N/A"
  duration_sec="N/A"
fi

# Print Summary
echo -e "${BLUE}📊 SUMMARY${NC}"
echo -e "   Total Events:     ${total_events}"
echo -e "   Agents Executed:  ${agents_count}"
echo -e "   Errors:           ${errors_count}"
echo -e "   Checkpoints:      ${GREEN}${checkpoints_pass} pass${NC} | ${RED}${checkpoints_fail} fail${NC} | ${YELLOW}${checkpoints_skip} skip${NC}"
if [ "$duration_s" != "N/A" ]; then
  echo -e "   Duration:         ${duration_min}m ${duration_sec}s (${duration_s}s total)"
else
  echo -e "   Duration:         ${duration_s}"
fi
echo ""

# Timeline
echo -e "${BLUE}📅 TIMELINE${NC}"
echo ""

# Parse and display events line by line
while IFS= read -r line; do
  # Extract fields using jq
  event_type=$(echo "$line" | jq -r '.type' 2>/dev/null)
  timestamp=$(echo "$line" | jq -r '.timestamp' 2>/dev/null)
  time_only="${timestamp:11:8}"  # Extract HH:MM:SS

  case "$event_type" in
    "agent_start")
      agent=$(echo "$line" | jq -r '.agent' 2>/dev/null)
      context=$(echo "$line" | jq -r '.context' 2>/dev/null)
      echo -e "${GREEN}${ICON_START} ${time_only}${NC} │ Agent started: ${CYAN}${agent}${NC}"
      if [ "$context" != "null" ] && [ "$context" != "{}" ]; then
        echo "              │   Context: ${context}"
      fi
      ;;

    "agent_end")
      agent=$(echo "$line" | jq -r '.agent' 2>/dev/null)
      result=$(echo "$line" | jq -r '.result' 2>/dev/null)
      duration=$(echo "$line" | jq -r '.result.duration_s' 2>/dev/null)
      files=$(echo "$line" | jq -r '.result.files' 2>/dev/null)

      echo -e "${GREEN}${ICON_END} ${time_only}${NC} │ Agent completed: ${CYAN}${agent}${NC}"
      if [ "$duration" != "null" ]; then
        echo -e "              │   Duration: ${duration}s"
      fi
      if [ "$files" != "null" ] && [ "$files" != "0" ]; then
        echo -e "              │   Files modified: ${files}"
      fi
      ;;

    "agent_error")
      agent=$(echo "$line" | jq -r '.agent' 2>/dev/null)
      error_msg=$(echo "$line" | jq -r '.error.message' 2>/dev/null)

      echo -e "${RED}${ICON_ERROR} ${time_only}${NC} │ Agent error: ${CYAN}${agent}${NC}"
      echo -e "              │   ${RED}Error: ${error_msg}${NC}"
      ;;

    "checkpoint")
      gate=$(echo "$line" | jq -r '.gate' 2>/dev/null)
      status=$(echo "$line" | jq -r '.status' 2>/dev/null)
      details=$(echo "$line" | jq -r '.details' 2>/dev/null)

      case "$status" in
        "pass")
          icon="${ICON_CHECKPOINT_PASS}"
          color="${GREEN}"
          ;;
        "fail")
          icon="${ICON_CHECKPOINT_FAIL}"
          color="${RED}"
          ;;
        "skip")
          icon="${ICON_CHECKPOINT_SKIP}"
          color="${YELLOW}"
          ;;
        *)
          icon="❓"
          color="${NC}"
          ;;
      esac

      status_upper=$(echo "$status" | tr '[:lower:]' '[:upper:]')
      echo -e "${color}${icon} ${time_only}${NC} │ Checkpoint ${gate}: ${color}${status_upper}${NC}"
      if [ "$details" != "null" ] && [ "$details" != "{}" ]; then
        exit_code=$(echo "$line" | jq -r '.details.exit_code' 2>/dev/null)
        if [ "$exit_code" != "null" ]; then
          echo -e "              │   Exit code: ${exit_code}"
        fi
      fi
      ;;

    *)
      # Custom events
      echo -e "${YELLOW}📝 ${time_only}${NC} │ ${event_type}"
      ;;
  esac

  echo ""
done < "$PULSE_FILE"

echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"

# Error highlighting at end if any
if [ "$errors_count" -gt 0 ]; then
  echo ""
  echo -e "${RED}⚠️  WARNING: ${errors_count} error(s) detected${NC}"
  echo -e "${YELLOW}Review timeline above for details${NC}"
  exit 1
fi

exit 0
