#!/usr/bin/env bash
# Read-only health check for the instance launch.sh started.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib.sh
source "$SCRIPT_DIR/lib.sh"
verify_require_state

STATE_DIR="$(verify_state_get state_dir)"
APP_ROOT="$(verify_state_get app_root)"
BACKEND_PID="$(verify_state_get backend_pid)"
FRONTEND_PID="$(verify_state_get frontend_pid)"
BACKEND_PORT="$(verify_state_get backend_port)"
FRONTEND_PORT="$(verify_state_get frontend_port)"
BACKEND_URL="$(verify_state_get backend_url)"
FRONTEND_URL="$(verify_state_get frontend_url)"
APP_SHA="$(verify_state_get app_sha)"
DB_PATH="$(verify_state_get database_path)"
EVIDENCE_DIR="$(verify_state_get evidence_dir)"

fail() {
  echo "doctor: fail $*" >&2
  exit 1
}

pid_alive() {
  local pid="$1"
  [[ -n "$pid" && "$pid" != "None" ]] && kill -0 "$pid" 2>/dev/null
}

cmdline() {
  tr '\0' ' ' </proc/"$1"/cmdline 2>/dev/null || true
}

port_owner() {
  local port="$1"
  if command -v ss >/dev/null 2>&1; then
    local owner
    owner="$(ss -H -ltnp "sport = :$port" 2>/dev/null | sed -n 's/.*pid=\([0-9]*\).*/\1/p' | head -n 1)"
    if [[ -n "$owner" ]]; then
      echo "$owner"
      return
    fi
  fi
  python3 - "$port" <<'PY'
import os, sys
port = int(sys.argv[1])
inodes = set()
for path in ("/proc/net/tcp", "/proc/net/tcp6"):
    try:
        handle = open(path, encoding="utf-8")
    except OSError:
        continue
    with handle:
        next(handle, None)
        for line in handle:
            parts = line.split()
            if len(parts) < 10 or ":" not in parts[1]:
                continue
            port_hex = parts[1].rsplit(":", 1)[-1]
            if not port_hex:
                continue
            try:
                listening = int(port_hex, 16) == port
            except ValueError:
                continue
            if listening:
                inodes.add(parts[9])
if not inodes:
    raise SystemExit
for pid in os.listdir("/proc"):
    if not pid.isdigit():
        continue
    fd_dir = f"/proc/{pid}/fd"
    try:
        fds = os.listdir(fd_dir)
    except OSError:
        continue
    for fd in fds:
        try:
            target = os.readlink(f"{fd_dir}/{fd}")
        except OSError:
            continue
        if target.startswith("socket:[") and target[8:-1] in inodes:
            print(pid)
            raise SystemExit
PY
}

pid_alive "$BACKEND_PID" || fail "backend pid $BACKEND_PID is not running"
pid_alive "$FRONTEND_PID" || fail "frontend pid $FRONTEND_PID is not running"

backend_cmd="$(cmdline "$BACKEND_PID")"
frontend_cmd="$(cmdline "$FRONTEND_PID")"
[[ "$backend_cmd" == *"runserver"* && "$backend_cmd" == *"$BACKEND_PORT"* ]] || fail "backend pid $BACKEND_PID is not our runserver ($backend_cmd)"
[[ "$frontend_cmd" == *"vite"* && "$frontend_cmd" == *"$FRONTEND_PORT"* ]] || fail "frontend pid $FRONTEND_PID is not our vite ($frontend_cmd)"

owns_port() {
  local expected="$1"
  local owner="$2"
  local current="$owner"
  local guard=0
  local parent
  [[ -n "$owner" ]] || return 1
  while [[ "$guard" -lt 8 ]]; do
    if [[ "$current" == "$expected" ]]; then
      return 0
    fi
    parent="$(awk '/^PPid:/ {print $2}' "/proc/$current/status" 2>/dev/null || echo 0)"
    if [[ -z "$parent" || "$parent" == "0" || "$parent" == "$current" ]]; then
      return 1
    fi
    current="$parent"
    guard=$((guard + 1))
  done
  return 1
}

backend_owner="$(port_owner "$BACKEND_PORT")"
frontend_owner="$(port_owner "$FRONTEND_PORT")"
owns_port "$BACKEND_PID" "$backend_owner" || fail "backend port $BACKEND_PORT is owned by pid ${backend_owner:-none}, not $BACKEND_PID"
owns_port "$FRONTEND_PID" "$frontend_owner" || fail "frontend port $FRONTEND_PORT is owned by pid ${frontend_owner:-none}, not $FRONTEND_PID"

head_sha="$(git -C "$APP_ROOT" rev-parse HEAD)"
[[ "$head_sha" == "$APP_SHA" ]] || fail "app HEAD $head_sha does not match the launched sha $APP_SHA"
[[ -f "$DB_PATH" ]] || fail "sqlite database missing at $DB_PATH"

html="$(curl -fsS -m 5 "$FRONTEND_URL/")" || fail "frontend did not respond at $FRONTEND_URL"
[[ "$html" == *"Annedora - Honey House"* ]] || fail "frontend HTML is not the Annedora shell"

verify_app_env "$STATE_DIR"
user_count="$(
  cd "$APP_ROOT/backend"
  "$STATE_DIR/venv/bin/python" - <<'PY'
import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()
from django.contrib.auth.models import User
email = os.environ["VERIFY_ADMIN_EMAIL"]
password = os.environ["VERIFY_ADMIN_PASSWORD"]
name = os.environ["VERIFY_ADMIN_NAME"]
user = User.objects.get(username=email)
if user.email != email or user.first_name != name or not user.is_staff:
    raise SystemExit("seeded admin row does not match the verification account")
if not user.check_password(password):
    raise SystemExit("seeded admin password does not match")
print(User.objects.count())
PY
)" || fail "admin credential check failed"
[[ "$user_count" == "27" ]] || fail "expected 27 users, found $user_count"

login_code="$(curl -sS -m 5 -o /dev/null -w '%{http_code}' -X GET "$BACKEND_URL/api/auth/login" || true)"
[[ "$login_code" == "405" || "$login_code" == "401" || "$login_code" == "400" ]] || fail "backend login route returned $login_code"

echo "doctor: ok"
echo "frontend_url=$FRONTEND_URL"
echo "backend_url=$BACKEND_URL"
echo "frontend_pid=$FRONTEND_PID"
echo "backend_pid=$BACKEND_PID"
echo "app_sha=$APP_SHA"
echo "users=$user_count"
echo "database_path=$DB_PATH"
echo "evidence_dir=$EVIDENCE_DIR"
echo "auth=ok"
