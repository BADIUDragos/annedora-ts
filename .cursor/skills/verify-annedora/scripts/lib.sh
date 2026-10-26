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

  # Only a directory launch created under /tmp or /var/tmp may be deleted.
  verify_state_dir_disposable() {
    local dir="$1"
    local real base parent
    [[ -n "$dir" ]] || return 1
    real="$(realpath -m "$dir")"
    case "$real" in
      /|/tmp|/var|/var/tmp|/home|/root|/opt|/usr|/workspace)
        return 1
        ;;
    esac
    if [[ -n "${HOME:-}" && "$real" == "$HOME" ]]; then
      return 1
    fi
    if [[ -n "${APP_ROOT:-}" && "$real" == "$APP_ROOT" ]]; then
      return 1
    fi
    if [[ -n "${VERIFY_SKILL_REPO:-}" && "$real" == "$VERIFY_SKILL_REPO" ]]; then
      return 1
    fi
    base="$(basename "$real")"
    parent="$(dirname "$real")"
    [[ "$base" == verify-annedora-* ]] || return 1
    [[ "$parent" == "/tmp" || "$parent" == "/var/tmp" ]] || return 1
    return 0
  }

  verify_state_dir_owned() {
    local dir="$1"
    verify_state_dir_disposable "$dir" || return 1
    [[ -f "$dir/.verify-annedora-state" ]] || return 1
    grep -q '^created_by=verify-annedora$' "$dir/.verify-annedora-state"
  }

  # Print state_file then pid. Never executes the file.
  verify_parse_lock() {
    local file="$1"
    local line value parsed_state="" parsed_pid=""
    [[ -f "$file" ]] || return 1
    while IFS= read -r line || [[ -n "$line" ]]; do
      case "$line" in
        ''|\#*)
          ;;
        state_file=*)
          value="${line#state_file=}"
          if [[ "$value" != /* ]]; then
            echo "verify-annedora: lock state_file must be an absolute path" >&2
            return 1
          fi
          parsed_state="$value"
          ;;
        pid=*)
          value="${line#pid=}"
          if [[ ! "$value" =~ ^[0-9]+$ ]]; then
            echo "verify-annedora: lock pid must be a number" >&2
            return 1
          fi
          parsed_pid="$value"
          ;;
        *)
          echo "verify-annedora: lock file has an unexpected entry" >&2
          return 1
          ;;
      esac
    done <"$file"
    printf '%s\n%s\n' "$parsed_state" "$parsed_pid"
  }
fi
