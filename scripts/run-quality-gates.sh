#!/bin/bash
# Quality Gates Runner for Multi-Agent Workflows
# Usage: ./scripts/run-quality-gates.sh <agent-name> <priority> [wf_run_id]

set -euo pipefail

agent=$1
priority=${2:-P0}
wf_run_id=${3:-}

gates_file=".quality-gates/gates.json"

if [ ! -f "$gates_file" ]; then
  echo "⚠️  No quality gates defined (.quality-gates/gates.json not found)"
  exit 0
fi

gates=$(jq -r ".\"$agent\".\"$priority\" // []" "$gates_file")

if [ "$gates" == "[]" ]; then
  echo "✅ No $priority gates defined for $agent"
  exit 0
fi

failed=0
total=$(echo "$gates" | jq 'length')
timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "🔍 Running $total $priority quality gates for $agent..."

echo "$gates" | jq -c '.[]' | while read gate; do
  name=$(echo "$gate" | jq -r '.name')
  cmd=$(echo "$gate" | jq -r '.cmd')
  expect=$(echo "$gate" | jq -r '.expect_exit')
  timeout_sec=$(echo "$gate" | jq -r '.timeout')
  blocking=$(echo "$gate" | jq -r '.blocking')
  error_msg=$(echo "$gate" | jq -r '.error_msg')

  echo "  ▶ $name"

  start_time=$(date +%s)

  # Run command with timeout
  set +e
  timeout $timeout_sec bash -c "$cmd" >/dev/null 2>&1
  exit_code=$?
  set -e

  end_time=$(date +%s)
  duration=$((end_time - start_time))

  # Log gate execution
  if [ -n "$wf_run_id" ]; then
    echo "{\"ts\":\"${timestamp}\",\"wf_run_id\":\"${wf_run_id}\",\"event\":\"quality_gate\",\"agent\":\"${agent}\",\"gate\":\"${name}\",\"priority\":\"${priority}\",\"status\":\"$([ $exit_code -eq $expect ] && echo '✅' || echo '❌')\",\"duration_sec\":${duration}}" \
      >> .observability/logs.ndjson
  fi

  if [ $exit_code -eq $expect ]; then
    echo "    ✅ PASS (${duration}s)"
  else
    echo "    ❌ FAIL (exit $exit_code, expected $expect, ${duration}s)"
    echo "       Error: $error_msg"

    if [ "$blocking" == "true" ]; then
      echo ""
      echo "🚨 BLOCKING GATE FAILED: $name"
      echo "   Agent: $agent"
      echo "   Priority: $priority"
      echo "   Command: $cmd"
      echo "   Error: $error_msg"
      exit 2  # Exit code 2 = blocking failure
    fi

    failed=$((failed + 1))
  fi
done

if [ $failed -gt 0 ]; then
  echo ""
  echo "⚠️  $failed non-blocking gates failed"
  exit 1  # Exit code 1 = non-blocking failures
fi

echo ""
echo "✅ All $priority gates passed for $agent"
exit 0
