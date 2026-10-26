#!/usr/bin/env bash
# Start a disposable Annedora stack and seed it. Prints VERIFY_STATE_FILE=...
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib.sh
source "$SCRIPT_DIR/lib.sh"

APP_ROOT="${VERIFY_APP_ROOT:-$VERIFY_SKILL_REPO}"
RUN_ID="${VERIFY_RUN_ID:-$(date -u +%Y%m%dT%H%M%SZ)-$$}"
STATE_DIR="$(realpath -m "${VERIFY_STATE_DIR:-/tmp/verify-annedora-$RUN_ID}")"
EVIDENCE_DIR="${VERIFY_EVIDENCE_DIR:-$VERIFY_SKILL_REPO/artifacts/verify-annedora/$RUN_ID}"
LOCK_FILE="$APP_ROOT/.verify-annedora.lock"

ADMIN_EMAIL="verify-admin@example.test"
ADMIN_PASSWORD="DevOnly-Verify-1842"
ADMIN_NAME="Verify Admin"
SECRET_KEY="verify-annedora-dev-secret"
SIGNING_KEY="verify-annedora-dev-signing-key"

if [[ ! -f "$APP_ROOT/backend/manage.py" || ! -f "$APP_ROOT/frontend/package.json" ]]; then
  verify_die "VERIFY_APP_ROOT does not look like the Annedora repo: $APP_ROOT"
fi

if ! verify_state_dir_disposable "$STATE_DIR"; then
  verify_die "refusing VERIFY_STATE_DIR $STATE_DIR. Use a new directory named verify-annedora-* directly under /tmp or /var/tmp."
fi
if [[ -e "$STATE_DIR" ]]; then
  if [[ ! -d "$STATE_DIR" ]]; then
    verify_die "VERIFY_STATE_DIR exists and is not a directory: $STATE_DIR"
  fi
  if [[ -n "$(find "$STATE_DIR" -mindepth 1 -print -quit)" ]]; then
    verify_die "refusing non-empty VERIFY_STATE_DIR: $STATE_DIR"
  fi
fi

mkdir -p "$STATE_DIR" "$EVIDENCE_DIR"
VERIFY_STATE_FILE="$STATE_DIR/state.json"
export VERIFY_STATE_FILE
cat >"$STATE_DIR/.verify-annedora-state" <<EOF
created_by=verify-annedora
run_id=$RUN_ID
state_file=$VERIFY_STATE_FILE
EOF
# Written first so a failed launch can still find this run and stop it.
printf '%s\n' '{"backend_pid": null, "frontend_pid": null, "scaffold_files": [], "evidence_dir": "'"$EVIDENCE_DIR"'", "state_dir": "'"$STATE_DIR"'", "app_root": "'"$APP_ROOT"'", "lock_file": "'"$LOCK_FILE"'"}' >"$VERIFY_STATE_FILE"

cleanup_on_fail() {
  local status=$?
  if [[ "$status" -ne 0 ]]; then
    echo "launch failed; cleaning up this attempt" >&2
    VERIFY_STATE_FILE="$VERIFY_STATE_FILE" "$SCRIPT_DIR/cleanup.sh" || true
  fi
}
trap cleanup_on_fail EXIT

if [[ -f "$LOCK_FILE" ]]; then
  if ! lock_output="$(verify_parse_lock "$LOCK_FILE")"; then
    verify_die "lock file $LOCK_FILE is not a verification lock. Refusing to source it."
  fi
  lock_state_file="${lock_output%%$'\n'*}"
  lock_pid="${lock_output#*$'\n'}"
  if [[ -n "$lock_pid" ]] && kill -0 "$lock_pid" 2>/dev/null; then
    verify_die "another verification run holds $LOCK_FILE (pid $lock_pid). Refusing to drive the same checkout twice."
  fi
  echo "removing stale verification lock" >&2
  if [[ -n "$lock_state_file" && -f "$lock_state_file" ]]; then
    VERIFY_STATE_FILE="$lock_state_file" "$SCRIPT_DIR/cleanup.sh" || true
  fi
  rm -f "$LOCK_FILE"
fi

cat >"$LOCK_FILE" <<EOF
state_file=$VERIFY_STATE_FILE
pid=$$
EOF

pick_ports() {
  python3 - <<'PY'
import socket
ports = []
sockets = []
for _ in range(2):
    sock = socket.socket()
    sock.bind(("127.0.0.1", 0))
    ports.append(sock.getsockname()[1])
    sockets.append(sock)
for sock in sockets:
    sock.close()
print(ports[0], ports[1])
PY
}

read -r BACKEND_PORT FRONTEND_PORT < <(pick_ports)
DB_PATH="$STATE_DIR/db.sqlite3"
BACKEND_URL="http://127.0.0.1:$BACKEND_PORT"
FRONTEND_URL="http://127.0.0.1:$FRONTEND_PORT"
APP_SHA="$(git -C "$APP_ROOT" rev-parse HEAD)"

# Never keep an inherited DATABASE_URL. SQLite is the default. VERIFY_DATABASE_URL
# is an explicit throwaway Postgres URL, checked before it is written.
if [[ -n "${VERIFY_DATABASE_URL:-}" ]]; then
  if [[ "$VERIFY_DATABASE_URL" == *"'"* ]]; then
    verify_die "VERIFY_DATABASE_URL contains a single quote"
  fi
  DATABASE_URL="$(VERIFY_DATABASE_URL="$VERIFY_DATABASE_URL" python3 - <<'PY'
import os, sys
from urllib.parse import urlparse
url = os.environ["VERIFY_DATABASE_URL"]
parsed = urlparse(url)
if parsed.scheme not in ("postgres", "postgresql"):
    sys.exit("VERIFY_DATABASE_URL must start with postgres:// or postgresql://")
host = (parsed.hostname or "").lower()
if host not in ("localhost", "127.0.0.1", "::1"):
    sys.exit("VERIFY_DATABASE_URL host must be localhost, 127.0.0.1, or ::1")
name = parsed.path.lstrip("/")
if "verify" not in name.lower():
    sys.exit("VERIFY_DATABASE_URL database name must contain 'verify'")
print(url)
PY
)" || verify_die "refusing VERIFY_DATABASE_URL"
  EXPECT_DB_ENGINE="django.db.backends.postgresql"
  EXPECT_DB_NAME="${DATABASE_URL##*/}"
  EXPECT_DB_NAME="${EXPECT_DB_NAME%%\?*}"
  KEEP_PSYCOPG=1
else
  unset VERIFY_DATABASE_URL || true
  DATABASE_URL="sqlite:///$DB_PATH"
  EXPECT_DB_ENGINE="django.db.backends.sqlite3"
  EXPECT_DB_NAME="$DB_PATH"
  KEEP_PSYCOPG=0
fi

cat >"$STATE_DIR/app.env" <<EOF
SECRET_KEY='$SECRET_KEY'
SIGNING_KEY='$SIGNING_KEY'
TIME_ZONE='UTC'
DATABASE_URL='$DATABASE_URL'
VERIFY_EXPECT_DB_ENGINE='$EXPECT_DB_ENGINE'
VERIFY_EXPECT_DB_NAME='$EXPECT_DB_NAME'
EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend'
EMAIL_HOST=''
EMAIL_HOST_USER=''
EMAIL_HOST_PASSWORD=''
STRIPE_SECRET=''
STRIPE_PUBLIC=''
CLOUDINARY_CLOUD_NAME=''
CLOUDINARY_API_KEY=''
CLOUDINARY_API_SECRET=''
VERIFY_ADMIN_EMAIL='$ADMIN_EMAIL'
VERIFY_ADMIN_PASSWORD='$ADMIN_PASSWORD'
VERIFY_ADMIN_NAME='$ADMIN_NAME'
PYTHONDONTWRITEBYTECODE='1'
PYTHONUNBUFFERED='1'
EOF

python3 - <<PY
import json
state = {
    "run_id": "$RUN_ID",
    "app_root": "$APP_ROOT",
    "skill_repo": "$VERIFY_SKILL_REPO",
    "state_dir": "$STATE_DIR",
    "evidence_dir": "$EVIDENCE_DIR",
    "database_path": "$DB_PATH",
    "backend_port": $BACKEND_PORT,
    "frontend_port": $FRONTEND_PORT,
    "backend_url": "$BACKEND_URL",
    "frontend_url": "$FRONTEND_URL",
    "backend_pid": None,
    "frontend_pid": None,
    "app_sha": "$APP_SHA",
    "admin_email": "$ADMIN_EMAIL",
    "admin_password": "$ADMIN_PASSWORD",
    "admin_name": "$ADMIN_NAME",
    "scaffold_files": [],
    "lock_file": "$LOCK_FILE",
}
with open("$VERIFY_STATE_FILE", "w", encoding="utf-8") as handle:
    json.dump(state, handle, indent=2)
    handle.write("\n")
PY

write_state_fields() {
  VERIFY_STATE_FILE="$VERIFY_STATE_FILE" python3 - "$@" <<'PY'
import json, os, sys
path = os.environ["VERIFY_STATE_FILE"]
with open(path, encoding="utf-8") as handle:
    state = json.load(handle)
args = sys.argv[1:]
index = 0
while index < len(args):
    key = args[index]
    value = args[index + 1]
    if value == "null":
        state[key] = None
    elif value.isdigit():
        state[key] = int(value)
    else:
        state[key] = value
    index += 2
with open(path, "w", encoding="utf-8") as handle:
    json.dump(state, handle, indent=2)
    handle.write("\n")
PY
}

echo "creating virtualenv and installing backend requirements"
python3 -m venv "$STATE_DIR/venv"
# SQLite verification does not import psycopg2. The dev pin has no Python 3.12 wheel.
# A throwaway VERIFY_DATABASE_URL keeps the driver.
if [[ "$KEEP_PSYCOPG" -eq 1 ]]; then
  cp "$APP_ROOT/backend/requirements.txt" "$STATE_DIR/requirements.verify.txt"
else
  grep -v -E '^[[:space:]]*psycopg2-binary([=<>]|$)' "$APP_ROOT/backend/requirements.txt" \
    >"$STATE_DIR/requirements.verify.txt"
fi
"$STATE_DIR/venv/bin/python" -m pip install --disable-pip-version-check -r "$STATE_DIR/requirements.verify.txt"

verify_app_env "$STATE_DIR"

echo "checking effective Django settings"
(
  cd "$APP_ROOT/backend"
  VERIFY_BACKEND_DIR="$APP_ROOT/backend" \
    VERIFY_SAFE_SETTINGS_REPORT="$EVIDENCE_DIR/safe-settings.txt" \
    "$STATE_DIR/venv/bin/python" "$SCRIPT_DIR/assert_safe_settings.py"
)

SCAFFOLD_LIST="$STATE_DIR/scaffold-files.txt"
: >"$SCAFFOLD_LIST"
MIG_DIR="$APP_ROOT/backend/base/migrations"
before_list="$STATE_DIR/migrations-before.txt"
if [[ -d "$MIG_DIR" ]]; then
  find "$MIG_DIR" -type f | sort >"$before_list"
else
  : >"$before_list"
fi
if ! compgen -G "$MIG_DIR/0*.py" >/dev/null; then
  echo "creating base migrations (verification scaffold)"
  (
    cd "$APP_ROOT/backend"
    "$STATE_DIR/venv/bin/python" manage.py makemigrations base --name verify_scaffold
  )
  find "$MIG_DIR" -type f | sort >"$STATE_DIR/migrations-after.txt"
  comm -13 "$before_list" "$STATE_DIR/migrations-after.txt" >"$SCAFFOLD_LIST"
  while IFS= read -r created; do
    [[ -z "$created" ]] && continue
    if [[ "$created" == *.py ]]; then
      printf '\n# verify-annedora scaffold — cleanup.sh may delete this file\n' >>"$created"
    fi
  done <"$SCAFFOLD_LIST"
fi

echo "applying migrations"
(
  cd "$APP_ROOT/backend"
  "$STATE_DIR/venv/bin/python" manage.py migrate --noinput
)

echo "seeding admin and shop data"
VERIFY_MANIFEST="$STATE_DIR/seed-manifest.json"
export VERIFY_MANIFEST
(
  cd "$APP_ROOT/backend"
  PYTHONPATH="$APP_ROOT/backend${PYTHONPATH:+:$PYTHONPATH}" \
    "$STATE_DIR/venv/bin/python" "$SCRIPT_DIR/seed_verify_data.py"
)

echo "starting Django on $BACKEND_URL"
(
  cd "$APP_ROOT/backend"
  # --noreload keeps the recorded pid as the process that owns the port.
  exec setsid "$STATE_DIR/venv/bin/python" manage.py runserver --noreload "127.0.0.1:$BACKEND_PORT"
) >"$STATE_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
write_state_fields backend_pid "$BACKEND_PID"

login_ready() {
  local body
  body="$(curl -fsS -m 5 -X POST "$BACKEND_URL/api/auth/login" \
    -H 'Content-Type: application/json' \
    -d "{\"username\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" 2>/dev/null || true)"
  [[ "$body" == *'"access"'* ]]
}

echo "waiting until the admin can sign in"
ready=0
for _ in $(seq 1 60); do
  if login_ready; then
    ready=1
    break
  fi
  if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "backend exited early; log follows" >&2
    cat "$STATE_DIR/backend.log" >&2 || true
    verify_die "backend exited before login succeeded"
  fi
  sleep 1
done
if [[ "$ready" -ne 1 ]]; then
  echo "backend log:" >&2
  cat "$STATE_DIR/backend.log" >&2 || true
  verify_die "backend did not accept the seeded admin login"
fi

if [[ ! -x "$APP_ROOT/frontend/node_modules/.bin/vite" ]]; then
  echo "installing frontend dependencies"
  (cd "$APP_ROOT/frontend" && npm ci --no-audit --no-fund)
fi

if [[ ! -d "$VERIFY_SCRIPT_DIR/node_modules/playwright" ]]; then
  echo "installing the verification Playwright harness"
  (cd "$VERIFY_SCRIPT_DIR" && npm install --no-audit --no-fund)
fi
if (
  cd "$VERIFY_SCRIPT_DIR"
  node --input-type=module <<'JS'
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
if (!existsSync(chromium.executablePath())) process.exit(1);
JS
); then
  echo "Playwright Chromium already installed"
else
  echo "installing Playwright Chromium"
  (cd "$VERIFY_SCRIPT_DIR" && npx playwright install chromium)
fi

echo "starting Vite on $FRONTEND_URL"
(
  cd "$APP_ROOT/frontend"
  export VITE_BACKEND_API="$BACKEND_URL/api"
  exec setsid ./node_modules/.bin/vite --host 127.0.0.1 --port "$FRONTEND_PORT" --strictPort
) >"$STATE_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
write_state_fields frontend_pid "$FRONTEND_PID"

echo "waiting until the shop HTML is served"
ready=0
for _ in $(seq 1 60); do
  if curl -fsS -m 5 "$FRONTEND_URL/" 2>/dev/null | grep -q "Annedora - Honey House"; then
    ready=1
    break
  fi
  if ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
    echo "frontend exited early; log follows" >&2
    cat "$STATE_DIR/frontend.log" >&2 || true
    verify_die "frontend exited before it served HTML"
  fi
  sleep 1
done
if [[ "$ready" -ne 1 ]]; then
  echo "frontend log:" >&2
  cat "$STATE_DIR/frontend.log" >&2 || true
  verify_die "frontend did not serve the Annedora shell"
fi

# The launch shell is about to exit. Hold the lock with the backend pid.
cat >"$LOCK_FILE" <<EOF
state_file=$VERIFY_STATE_FILE
pid=$BACKEND_PID
EOF

cp "$STATE_DIR/seed-manifest.json" "$EVIDENCE_DIR/seed-manifest.json"

echo "VERIFY_STATE_FILE=$VERIFY_STATE_FILE"
echo "frontend_url=$FRONTEND_URL"
echo "backend_url=$BACKEND_URL"
echo "evidence_dir=$EVIDENCE_DIR"
echo "app_sha=$APP_SHA"
echo "ready: admin login works and the shop HTML is being served"

trap - EXIT
