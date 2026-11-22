#!/usr/bin/env bash
set -euo pipefail
cd /workspace
export PATH=/home/pn/.npm/_npx/78122db76a76712a/node_modules/node/bin:$PATH
port=${FIXTURE_PORT:-3218}
python3 - "$port" <<'PY'
import socket, sys
s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind(('127.0.0.1', int(sys.argv[1])))
s.close()
PY
fixture=$(python3 tests/fixtures/bouquet-detail-next/prepare.py)
printf 'fixture=%s\n' "$fixture"
(cd "$fixture" && node /workspace/node_modules/next/dist/bin/next build --webpack)
(cd "$fixture" && exec node /workspace/node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port "$port") &
pid=$!
cleanup() {
  local result=$?
  trap - EXIT
  if kill -0 "$pid" 2>/dev/null; then
    kill -TERM "$pid" || result=1
  fi
  wait "$pid" 2>/dev/null || :
  if ! python3 - "$port" <<'PY'
import socket, sys
s = socket.socket()
try:
    s.bind(('127.0.0.1', int(sys.argv[1])))
    print('cleanup: port free')
except OSError as exc:
    print('cleanup: port still occupied:', exc, file=sys.stderr)
    sys.exit(1)
finally:
    s.close()
PY
  then result=1; fi
  exit "$result"
}
trap cleanup EXIT
ready=0
for i in {1..60}; do
  if curl -fsS -o /dev/null "http://127.0.0.1:$port/en/fixture/detail"; then ready=1; break; fi
  kill -0 "$pid" 2>/dev/null || { echo 'fixture server exited' >&2; exit 1; }
  sleep 1
done
if [ "$ready" -ne 1 ]; then echo 'fixture server readiness timed out' >&2; exit 1; fi
export FIXTURE_BASE_URL="http://127.0.0.1:$port" FIXTURE_EVIDENCE="$fixture/evidence"
node tests/fixtures/bouquet-detail-next/smoke.cjs
node tests/fixtures/bouquet-detail-next/browser.cjs
