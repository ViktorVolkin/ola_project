# HOST-R1 correction — awaiting Luna and actual Supervisor re-review

**Correction implemented; NOT independently accepted. Original review1 FAIL and old16-pass log remain unchanged. No PASS approval, runtime execution, credential metadata/read/load or cloud write.** Visible executor runtime remains `gpt-6.1-sol / openai-codex`; parent completion/cost/fallback/per-call reconciliation pending.

## Exact finding and minimal correction

Read full `supervisor-review/review-1.json`: HOST-R1 reproduces quote-bearing accepted opaque input surviving `JSON.stringify`-then-redact. It demonstrates a synthetic error-persistence defect, not real Sanity token leakage/authentication or a token-format claim. That exact reviewer repro supplies RED evidence; Sol did not rerun mechanics.

- `core.mjs` adds shared `safeSerialize`: redacts string values **before JSON escaping**, handles typed Error name/message through the same string traversal, and sanitizes JSON-escaped property-key representations. Existing raw/URI/base64 variants remain; JSON-escaped literal echoes are also removed. No loader contract narrowing or token-format inference.
- All core save calls, runtime `hosting-readback.json` and runtime `final-error.json` now use that one serializer. `safeErrorMessage` protects error-message conversion. Cycles, throwing getters/toJSON or encoding/serialization failure return fixed valid JSON **null**, never an interpolated/raw error fallback. This is a withheld serialization record, not a claimed successful evidence object.
- Exact known root lint findings corrected: test local `module` renamed `resolver`; unused runtime `NODE`/`exactApp` imports removed. No ESLint disable/config/ignore or rule changes.
- `offline.test.mjs` retains the prior controls and adds synthetic quote/backslash/newline/control/mixed opaque strings; actual core error path with0writes; result write-once; parsed recursive string/key checks for raw/URI/base64/JSON-escaped representations; runtime-style readback/final-error object roundtrips; typed errors; cycle/getter/toJSON/throwing conversion safety; static runtime callsite linkage without importing runtime. No real credential, SDK, network or loader use.

Pinned existing-app deployment config/CLI/API/no-create mechanism, opaque loader/metadata function bodies, source/output allowlist and approval semantics are unchanged.356-file production build and old create-manifest untouched; no rebuild, source UI/dependency/package/runner/guard changes.

## Preservation, diff, new binding

`provenance/host-r1-before/` preserves exact old core/runtime/test, candidate binding, old16-pass log and original FAIL receipt bytes, with hashes in its manifest. Old binding `ef461aecaa4cec90c29c1c6dcc365c1ce52d1b3000fda99cee6a2ad7d929f51f` stays historical **FAIL**, not retroauthorized.

- Change diff: `provenance/host-r1-correction.diff`.
- Current `candidate-binding.json` links previous binding/snapshot/verdict and replaces only the3changed source hashes.
- Versioned corrected copy: `provenance/candidate-binding-host-r1-v2.json`.
- Current binding SHA256: **`7c0221e474853996f8cb10e14b4e38d8e87019641fc29848afbc244d177dc856`**.
- Static result: `provenance/host-r1-static-result.json`. Three Node24 `--check` commands exit0; preserved old log/review hashes verified unchanged. No expanded offline or root lint execution by Sol.

Runtime still requires a genuine new Supervisor PASS binding this exact current hash. No approval file created or modified; old review cannot authorize new code.

## Luna exact next commands — expanded offline AND root lint

Docker `/workspace` only. Run both commands and retain their separate exit statuses, even if the first fails; do not overwrite existing logs. These are the only required mechanics for this bounded correction; no runtime/loader/Studio build/full suite.

```bash
cd /workspace
set -o noclobber
D=docs/qa/quality/sanity-home-online-001/studio-hosting/deploy-candidate
N=/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node
isolated() {
  env -i PATH=/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin HOME=/workspace/.local-tools/ola-qa/home XDG_CONFIG_HOME=/workspace/.local-tools/ola-qa/home/config XDG_CACHE_HOME=/workspace/.local-tools/ola-qa/cache npm_config_cache=/workspace/.local-tools/ola-qa/cache/npm SHELL=/bin/bash NODE_DISABLE_COMPILE_CACHE=1 "$@"
}
isolated "$N" --test "$D/offline.test.mjs" > "$D/luna-host-r1-offline.log" 2>&1
offline_exit=$?
isolated "$N" /usr/local/lib/node_modules/npm/bin/npm-cli.js run lint > "$D/luna-host-r1-root-lint.log" 2>&1
lint_exit=$?
printf 'offline_exit=%s\nlint_exit=%s\n' "$offline_exit" "$lint_exit" > "$D/luna-host-r1-exits.txt"
test "$offline_exit" -eq 0 && test "$lint_exit" -eq 0
```

Known earlier root lint FAIL is retained in `../../../test-suites-001/luna-verification/attempt-4/checks.json` (repository path `docs/qa/quality/test-suites-001/luna-verification/attempt-4/checks.json`). Its unrelated control/type/unit successes are not rerun or pooled here. Current lint may also observe other legitimate concurrent work; report actual failures, do not weaken rules or alter another scope.

## Accounting / release boundary

Bounded original-executor correction attempt, HIGH credential-persistence boundary, `review_required=true`; awaiting Luna mechanics and binding-specific actual Supervisor re-review. Cause `implementation_defect`, executor-owned correction round1 for HOST-R1, no parent takeover. Original16PASS coverage gap and reviewer FAIL preserved; known candidate lint defects fixed in code but not claimed mechanically verified. Exact correction includes this own record; usage/duration unknown pending parent return. No source/dependency/Studio rebuild, secret file inspection/stat/hash/load, runtime import/execution, API/auth/CORS/content/cloud/deploy/Git/Hermes/OS changes, helper agents or Supervisor call. No global allgreen/push/manager-ready claim. One future hosting execution remains prohibited until genuine new PASS; owner authorization itself does not need repeating.
