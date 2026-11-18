#!/usr/bin/env bash
set -euo pipefail
cd /workspace
export PATH=/home/pn/.npm/_npx/78122db76a76712a/node_modules/node/bin:$PATH
stamp=$(date -u +%Y%m%dT%H%M%SZ)-$$
evidence="/workspace/docs/qa/bouquet-detail/test-migration-001/resume-current/$stamp"
mkdir -p "$evidence"
run=$(mktemp -d /home/pn/.cache/ola-bd-migration-run.XXXXXXXX)
export BD_MIGRATION_RUN="$run"
pid=''
cleanup() {
  status=$?
  trap - EXIT INT TERM
  if [[ -n "$pid" ]]; then kill -TERM "$pid" 2>/dev/null || :; wait "$pid" 2>/dev/null || :; fi
  du -s -B1 "$run" > "$evidence/allocated-before-cleanup.txt" 2>&1 || :
  rm -rf -- "$run"
  if [[ -e "$run" ]]; then status=1; fi
  python3 - "$evidence" <<'PY'
import socket, sys
with open(sys.argv[1]+'/ports-after.txt','w') as f:
 for port in (3310,3311):
  s=socket.socket()
  try: s.bind(('127.0.0.1',port)); print(port,'free',file=f)
  except OSError as e: print(port,'occupied',e,file=f); raise
  finally: s.close()
PY
  exit "$status"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
printf '%s\n' "$run" > "$evidence/run-path.txt"
for slot in 0 1; do
  python3 tests/fixtures/bouquet-detail-next/prepare.py "$run/fixture-$slot" > "$evidence/prepare-$slot.log"
  cp tests/fixtures/bouquet-detail-next/migration-page.tsx.txt "$run/fixture-$slot/src/app/[locale]/fixture/detail/page.tsx"
  cp "$run/fixture-$slot/snapshot.json" "$evidence/snapshot-$slot.json"
  if [[ $slot == 1 ]]; then cmp "$evidence/snapshot-0.json" "$evidence/snapshot-1.json"; fi
  (cd "$run/fixture-$slot" && node /workspace/node_modules/next/dist/bin/next build --webpack) > "$evidence/build-$slot.log" 2>&1
  cp "$run/fixture-$slot/.next/BUILD_ID" "$evidence/build-id-$slot.txt"
done
python3 - <<'PY'
import socket
for port in (3310, 3311):
 s=socket.socket()
 try: s.bind(('127.0.0.1',port))
 finally: s.close()
PY
(cd "$run/fixture-0" && exec node /workspace/node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3310) > "$evidence/smoke-server.log" 2>&1 &
pid=$!
for i in {1..60}; do curl -fsS -o /dev/null http://127.0.0.1:3310/en/fixture/detail && break; kill -0 "$pid"; sleep 1; done
FIXTURE_BASE_URL=http://127.0.0.1:3310 FIXTURE_EVIDENCE="$evidence" node tests/fixtures/bouquet-detail-next/smoke.cjs > "$evidence/smoke.log" 2>&1
kill -TERM "$pid"; wait "$pid" || :; pid=''
files=(tests/e2e/bouquet-detail-preferences.spec.ts tests/e2e/bouquet-detail-supporting.spec.ts)
config=tests/fixtures/bouquet-detail-next/migration.config.ts
for stage in en360 focused all; do
 export BD_MIGRATION_EVIDENCE="$evidence/$stage"; mkdir -p "$BD_MIGRATION_EVIDENCE"
 args=(); case "$stage" in en360) args=(--project=desktop --workers=1 --grep 'en 360');; focused) args=(--project=desktop --workers=1);; all) args=(--workers=2);; esac
 node node_modules/@playwright/test/cli.js test --config "$config" "${files[@]}" "${args[@]}" --max-failures=2 > "$evidence/$stage.log" 2>&1
done
