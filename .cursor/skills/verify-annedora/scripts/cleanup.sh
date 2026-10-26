#!/usr/bin/env bash
# Stop the processes this run started and delete its scratch state.
# Evidence under evidence_dir is left in place.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib.sh
source "$SCRIPT_DIR/lib.sh"
verify_require_state

STATE_DIR="$(verify_state_get state_dir)"
EVIDENCE_DIR="$(verify_state_get evidence_dir)"
APP_ROOT="$(verify_state_get app_root)"
LOCK_FILE="$(verify_state_get lock_file)"
BACKEND_PID="$(verify_state_get backend_pid)"
FRONTEND_PID="$(verify_state_get frontend_pid)"

stop_pid() {
  local pid="$1"
  local label="$2"
  if [[ -z "$pid" || "$pid" == "None" ]]; then
    return 0
  fi
  if ! kill -0 "$pid" 2>/dev/null; then
    return 0
  fi
  # Kill the session we started with setsid. Never match by process name.
  kill -TERM -"$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null || true
  for _ in $(seq 1 20); do
    if ! kill -0 "$pid" 2>/dev/null; then
      echo "stopped $label pid $pid"
      return 0
    fi
    sleep 0.2
  done
  kill -KILL -"$pid" 2>/dev/null || kill -KILL "$pid" 2>/dev/null || true
  echo "killed $label pid $pid"
}

stop_pid "$FRONTEND_PID" frontend
stop_pid "$BACKEND_PID" backend

SCAFFOLD_LIST="$STATE_DIR/scaffold-files.txt"
if [[ -f "$SCAFFOLD_LIST" && -n "$APP_ROOT" ]]; then
  while IFS= read -r path; do
    [[ -z "$path" ]] && continue
    case "$path" in
      "$APP_ROOT"/backend/base/migrations/*) ;;
      *)
        echo "refusing to delete unexpected scaffold path: $path" >&2
        continue
        ;;
    esac
    if [[ -f "$path" ]] && grep -q "verify-annedora scaffold" "$path"; then
      rm -f "$path"
      echo "removed scaffold $path"
    elif [[ -f "$path" && "$path" == *__init__.py ]]; then
      rm -f "$path"
      echo "removed scaffold $path"
    fi
  done <"$SCAFFOLD_LIST"
  mig_dir="$APP_ROOT/backend/base/migrations"
  if [[ -d "$mig_dir" ]]; then
    find "$mig_dir" -type d -name __pycache__ -empty -delete 2>/dev/null || true
    find "$mig_dir" -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
    if [[ -d "$mig_dir" ]] && [[ -z "$(find "$mig_dir" -type f -print -quit)" ]]; then
      rm -rf "$mig_dir"
      echo "removed empty migrations directory"
    fi
  fi
fi

if [[ -n "$LOCK_FILE" && -f "$LOCK_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$LOCK_FILE"
  if [[ "${state_file:-}" == "$VERIFY_STATE_FILE" ]]; then
    rm -f "$LOCK_FILE"
    echo "removed lock $LOCK_FILE"
  fi
fi

if [[ -n "$STATE_DIR" && -d "$STATE_DIR" ]]; then
  rm -rf "$STATE_DIR"
  echo "removed state $STATE_DIR"
fi

if [[ -n "$EVIDENCE_DIR" && -d "$EVIDENCE_DIR" ]]; then
  echo "evidence_kept=$EVIDENCE_DIR"
  echo "evidence_exists=yes"
else
  echo "evidence_kept=${EVIDENCE_DIR:-}"
  echo "evidence_exists=no"
fi
