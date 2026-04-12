#!/usr/bin/env bash
set -euo pipefail
BASE_REF="${AI_VALIDATOR_BASE_REF:-${1:-HEAD~1}}"
node tools/validators/enforce-runtime-guardrails.js \
  --repo . \
  --config ai.config.json \
  --base "$BASE_REF"
