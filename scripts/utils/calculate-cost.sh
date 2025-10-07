#!/bin/bash
# Calculate cost for Anthropic API calls
# Usage: ./calculate-cost.sh <model> <tokens_in> <tokens_out>

calculate_cost() {
  local model=$1
  local tokens_in=$2
  local tokens_out=$3

  case $model in
    haiku)
      cost_in=$(echo "scale=6; $tokens_in * 0.25 / 1000000" | bc)
      cost_out=$(echo "scale=6; $tokens_out * 1.25 / 1000000" | bc)
      ;;
    sonnet)
      cost_in=$(echo "scale=6; $tokens_in * 3.00 / 1000000" | bc)
      cost_out=$(echo "scale=6; $tokens_out * 15.00 / 1000000" | bc)
      ;;
    opus)
      cost_in=$(echo "scale=6; $tokens_in * 15.00 / 1000000" | bc)
      cost_out=$(echo "scale=6; $tokens_out * 75.00 / 1000000" | bc)
      ;;
    *)
      echo "Unknown model: $model" >&2
      echo "0"
      return 1
      ;;
  esac

  echo "scale=6; $cost_in + $cost_out" | bc
}

# If script is run directly (not sourced)
if [ "${BASH_SOURCE[0]}" == "${0}" ]; then
  if [ $# -ne 3 ]; then
    echo "Usage: $0 <model> <tokens_in> <tokens_out>"
    echo "Models: haiku, sonnet, opus"
    exit 1
  fi

  calculate_cost "$1" "$2" "$3"
fi
