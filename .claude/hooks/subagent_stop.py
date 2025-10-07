#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "python-dotenv",
# ]
# ///

"""
SubagentStop Hook - Validates sub-agent output before return to primary agent
Triggered when sub-agent completes task

Input (stdin): JSON with agent info and output
Output: Validation results, metrics logging
Exit codes:
  0 - Success (output valid)
  1 - Warning (output has issues but acceptable)
  2 - Block (output invalid, prevent handoff)
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path
from datetime import datetime

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


def log_event(event_type, agent_name, data):
    """Log event to observability logs"""
    log_dir = Path(".observability")
    log_dir.mkdir(parents=True, exist_ok=True)
    log_file = log_dir / "logs.ndjson"

    event = {
        "ts": datetime.utcnow().isoformat() + "Z",
        "event": event_type,
        "agent": agent_name,
        **data
    }

    with open(log_file, "a") as f:
        f.write(json.dumps(event) + "\n")


def validate_report_format(output):
    """Validate sub-agent report has required sections"""
    required_sections = {
        "Status": r"\*\*Status:\*\*\s*(✅|⚠️|❌)",
        "Summary": r"\*\*Summary:\*\*",
        "Artifacts": r"\*\*Artifacts:\*\*",
    }

    issues = []
    warnings = []

    for section, pattern in required_sections.items():
        if not re.search(pattern, output, re.IGNORECASE | re.MULTILINE):
            issues.append(f"Missing required section: {section}")

    # Check for status indicator
    if not re.search(r"(✅|⚠️|❌)", output):
        warnings.append("No status indicator found (✅/⚠️/❌)")

    return issues, warnings


def extract_artifacts(output):
    """Extract list of artifacts created from output"""
    artifacts = []

    # Look for artifact patterns:
    # - `path/to/file.ext`
    # - path/to/file.ext
    # - **Artifacts:** followed by list

    artifact_patterns = [
        r"`([^`]+\.[a-z]{2,4})`",  # `file.ext`
        r"- `([^`]+)`",              # - `file.ext`
        r"Created:\s*`?([^\s`]+)`?", # Created: file.ext
    ]

    for pattern in artifact_patterns:
        matches = re.findall(pattern, output)
        artifacts.extend(matches)

    return list(set(artifacts))  # Deduplicate


def extract_metrics(output, agent_name):
    """Extract performance metrics from output"""
    metrics = {
        "agent": agent_name,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

    # Extract tokens if mentioned
    tokens_pattern = r"(\d+)\s*tokens"
    tokens_match = re.search(tokens_pattern, output, re.IGNORECASE)
    if tokens_match:
        metrics["tokens_reported"] = int(tokens_match.group(1))

    # Extract duration if mentioned
    duration_pattern = r"(\d+)\s*(sec|min|seconds|minutes)"
    duration_match = re.search(duration_pattern, output, re.IGNORECASE)
    if duration_match:
        value = int(duration_match.group(1))
        unit = duration_match.group(2)
        metrics["duration_sec"] = value * 60 if "min" in unit else value

    # Count artifacts
    artifacts = extract_artifacts(output)
    metrics["artifacts_count"] = len(artifacts)

    return metrics


def validate_quality_gates(agent_name, output):
    """Check if agent mentions quality gate results"""
    gate_results = {
        "mentioned": False,
        "passed": [],
        "failed": []
    }

    # Look for quality gate mentions
    gate_patterns = [
        r"(P0|P1|P2|P3|P4).*?(passed|failed|✅|❌)",
        r"Quality gate.*?(passed|failed|✅|❌)",
    ]

    for pattern in gate_patterns:
        matches = re.finditer(pattern, output, re.IGNORECASE)
        for match in matches:
            gate_results["mentioned"] = True
            status = match.group(2) if len(match.groups()) > 1 else match.group(1)

            if any(s in status.lower() for s in ["pass", "✅"]):
                gate_results["passed"].append(match.group(0))
            elif any(s in status.lower() for s in ["fail", "❌"]):
                gate_results["failed"].append(match.group(0))

    return gate_results


def main():
    parser = argparse.ArgumentParser(
        description="Validate sub-agent output before handoff"
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Strict mode - block on warnings"
    )
    parser.add_argument(
        "--log-metrics",
        action="store_true",
        default=True,
        help="Log performance metrics"
    )
    args = parser.parse_args()

    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())

        agent_name = input_data.get("agent_name", "unknown")
        output = input_data.get("output", "")

        # Validate report format
        issues, warnings = validate_report_format(output)

        # Extract artifacts
        artifacts = extract_artifacts(output)

        # Extract metrics
        metrics = extract_metrics(output, agent_name)

        # Validate quality gates
        gate_results = validate_quality_gates(agent_name, output)

        # Log subagent completion
        log_event("subagent_stop", agent_name, {
            "validation": {
                "issues": len(issues),
                "warnings": len(warnings),
                "artifacts_count": len(artifacts)
            },
            "metrics": metrics,
            "quality_gates": gate_results
        })

        # Determine exit code
        exit_code = 0  # Default: success

        if issues:
            # Blocking issues found
            print(f"❌ Sub-agent {agent_name} output validation FAILED:", file=sys.stderr)
            for issue in issues:
                print(f"   - {issue}", file=sys.stderr)
            exit_code = 2

        elif warnings:
            # Warnings but acceptable
            print(f"⚠️  Sub-agent {agent_name} output has warnings:", file=sys.stderr)
            for warning in warnings:
                print(f"   - {warning}", file=sys.stderr)

            if args.strict:
                exit_code = 2  # Block in strict mode
            else:
                exit_code = 1  # Warning only

        else:
            # All good
            print(f"✅ Sub-agent {agent_name} output validated successfully")
            if artifacts:
                print(f"   Artifacts created: {len(artifacts)}")
                for artifact in artifacts[:5]:  # Show first 5
                    print(f"   - {artifact}")

            if gate_results["mentioned"]:
                print(f"   Quality gates: {len(gate_results['passed'])} passed, {len(gate_results['failed'])} failed")

        sys.exit(exit_code)

    except json.JSONDecodeError:
        # Gracefully handle invalid JSON
        print("⚠️  Invalid JSON input to SubagentStop hook", file=sys.stderr)
        sys.exit(0)

    except Exception as e:
        # Don't block on hook errors
        print(f"⚠️  SubagentStop hook error: {e}", file=sys.stderr)
        sys.exit(0)


if __name__ == "__main__":
    main()
