# OLA-TEST-SUITES-001 — integration complete, staged→root

Executor: visible injected runtime `gpt-6.1-terra / openai-codex`; delegated implementation, medium-risk shared test orchestration, review_required=true. Completion metadata, token cost and duration unknown. No helper, Supervisor, Git write or source integration.

Sanity freeze released by Lead after Luna sa-0-ec3b57e6 completed (21 saves / 190 clicks / 29 checks). Post-port guard BLOCKED 42242/42244 — NOT touched. Sanity source packet NOT mutated.

## Integration performed (root, filetools only)

Baseline read before every edit; unrelated dirty changes preserved. No Git writes. No source/UI/asset changes.

| Root file | Action |
|---|---|
| `package.json` | Scripts added: test:unit, test:smoke, test:feature, test:full, test:inventory, check:quick; test:e2e now `node scripts/qa/suites.mjs product`; check now `lint && typecheck && build && test:full` |
| `playwright.config.ts` | Replaced: no hardcoded 3100 baseURL/webServer; requires OLA_SUITE_APP + OLA_SUITE_PORT; excludes detail-page/preferences/supporting fixture specs |
| `scripts/qa/suite-inventory.mjs` | New: static coverage inventory, 29 specs, zero unknown/missing |
| `scripts/qa/suites.mjs` | New: Node orchestrator, private source export, per-family builds, port guard (excludes 3100/42242/42244), inventory guard, source-binding validation, per-suite status, nonzero on any fail/blocked |
| `tests/suites.config.mjs` | New: Playwright per-family config with viewport assignments (desktop 1280x800, mobile 375x812), detail-page chromium workers=1, migration 60s timeout |
| `docs/development/local-qa.md` | Added OLA-TEST-SUITES-001 section documenting all entrypoints |

## Coverage inventory (verified by `node scripts/qa/suite-inventory.mjs /workspace`)

29 specs, 0 unknown, 0 missing:
- product: 24 (desktop+mobile each)
- gallery: 1 (desktop+mobile)
- detail-page: 1 (chromium only)
- migration: 2 (desktop+mobile)
- action-button: 1 (chromium only)

Counts are configured specs/tests, not passes. Old full result (473 passed / 228 failed / 1 skipped, wrapper 124) remains historical — not relabeled PASS. Unresolved gallery geometry (104/105px) and 13 acceptance failures untouched.

## Exact Luna commands

Run with isolated Node24 and command-local paths:

```bash
cd /workspace
N=/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node
env -i PATH=/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin HOME=/workspace/.local-tools/ola-qa/home XDG_CONFIG_HOME=/workspace/.local-tools/ola-qa/home/config XDG_CACHE_HOME=/workspace/.local-tools/ola-qa/cache SHELL=/bin/bash SWC_NATIVE_BINDING_CACHE=/ola-native-cache "$N" --check scripts/qa/suite-inventory.mjs && "$N" --check scripts/qa/suites.mjs && "$N" --check tests/suites.config.mjs
"$N" scripts/qa/suite-inventory.mjs /workspace
"$N" scripts/qa/suites.mjs product --file tests/e2e/navigation.spec.ts --project mobile --grep '^en: translated modal' --dry-run
"$N" scripts/qa/suites.mjs smoke
"$N" scripts/qa/suites.mjs product --file tests/e2e/bouquet-detail-page.spec.ts --project chromium --grep ''
"$N" scripts/qa/suites.mjs migration
"$N" scripts/qa/suites.mjs full
```

Set `OLA_SUITE_PORT` only to an available private loopback port (default 45190), never 3100/42242/42244. `--list`/`--dry-run` verify selection without executing tests. `full` rejects filters. `--file`/`--grep`/`--project` forward only within the named family.

## Remaining

- Luna runs representative mechanical tests after integration; root lint/types after integration
- Request actual `@supervisor` gpt-6.1-sol review when integration completes; no acceptance yet
- Historical QA docs/logs unchanged; old QA evidence excluded from coverage inventory by contract

## Correction after Luna smoke failure — not accepted

The earlier claim “integration complete” and product-family example for `bouquet-detail-page.spec.ts` were wrong. Preserve them above as history. Correct selection: `node scripts/qa/suites.mjs detail-page --file tests/e2e/bouquet-detail-page.spec.ts --project chromium --list` (selection only; remove `--list` for execution). Do not use the earlier cross-family example or empty grep as a single-case filter.

Luna gpt-6-luna continuation: 7 calls, child 78.14s, batch 78.24s (user-provided); unit 121/121 in 4.55s and lint passed. Smoke exited 1 before build/browser with `ERR_FS_CP_EEXIST` on `run-t5xndu/source/src`. This is a runner implementation failure, not an environment block. Run directory and Luna evidence remain untouched. Root typecheck was not run because root `.next` existed; this is not a type failure. Full fixture execution and aggregation controls remain unverified.

Cause: `mkdtempSync` creates a fresh run; an unconditional first export loop copied `src`, then an identical loop inside `try` attempted to copy it again with `errorOnExist:true, force:false`. It was not a stale run or a parent-directory collision. Removed only the first loop; the remaining loop stays inside error handling, retaining filtering, no-clobber and source hash comparison. Focused synthetic regression `export-regression.test.mjs` exercises the actual export seam and negative existing-destination protection; it has not been executed by Terra. Luna must execute it and then the real smoke once, using the documented private environment. No acceptance or review request until checks pass. Medium risk and actual Supervisor review gate unchanged.

Commands from project root under the same Node24/private environment Luna used:

```sh
.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node --test docs/qa/quality/test-suites-001/export-regression.test.mjs
.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node scripts/qa/suites.mjs smoke
```

Terra correction is same executor, implementation_defect rework, not parent takeover. Visible runtime gpt-6.1-terra/openai-codex; completion usage/time unknown. Earlier smoke failed; no claim of corrected smoke passing.
