#!/usr/bin/env bash
# Shared paths for the Annedora verification scripts. Source this; do not execute it.
# shellcheck shell=bash

if [[ -z "${VERIFY_ANNEDORA_LIB_LOADED:-}" ]]; then
  VERIFY_ANNEDORA_LIB_LOADED=1

  # scripts/ -> skill -> skills -> .cursor -> repo
  VERIFY_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  VERIFY_SKILL_DIR="$(cd "$VERIFY_SCRIPT_DIR/.." && pwd)"
  VERIFY_SKILL_REPO="$(cd "$VERIFY_SCRIPT_DIR/../../../.." && pwd)"

  verify_die() {
    echo "verify-annedora: $*" >&2
    exit 1
  }

  verify_require_state() {
    if [[ -z "${VERIFY_STATE_FILE:-}" ]]; then
      verify_die "VERIFY_STATE_FILE is not set. Run launch.sh and export the path it prints."
    fi
    if [[ ! -f "$VERIFY_STATE_FILE" ]]; then
      verify_die "state file not found: $VERIFY_STATE_FILE"
    fi
  }

  verify_state_get() {
    local key="$1"
    VERIFY_STATE_FILE="$VERIFY_STATE_FILE" VERIFY_STATE_KEY="$key" python3 - <<'PY'
import json, os
with open(os.environ["VERIFY_STATE_FILE"], encoding="utf-8") as handle:
    data = json.load(handle)
key = os.environ["VERIFY_STATE_KEY"]
value = data.get(key, "")
if value is None:
    value = ""
print(value)
PY
  }

  verify_app_env() {
    local state_dir="$1"
    set -a
    # shellcheck disable=SC1091
    source "$state_dir/app.env"
    set +a
  }
fi
