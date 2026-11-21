# OLA-TEST-SUITES-001 — selector diagnosis continuation

Status: NOT ACCEPTED. Medium risk; actual @supervisor gpt-6.1-sol review required after Luna's required checks, not requested here. Visible executor runtime gpt-6.1-terra/openai-codex; completion usage/time unknown. Luna attempt 2 visible gpt-6-luna, provider unknown; reported batch 235.15s, call count unknown. No parent takeover.

Preserve prior history: first smoke failed duplicate export (implementation defect), then corrected export regression passed 1/1; Luna attempt 2 smoke passed 3/3, browser 9570.515 ms, build ID GjhTpBqo5cII3tDCqOXuU. Detail private build aPL3qPMd1Yp13SyYntxyT compiled/type phase passed, but fixture command failed exit 1 with no tests executed. Historical full 473/228/1 and earlier incorrect product/detail-page command remain historical, not relabeled.

## Diagnosis

Actual retained `run-faTEsd/detail-page-playwright.json` argv has positional `bouquet-detail-page.spec.ts`, project `chromium`, grep `^server-rendered without JavaScript$`; config root/testDir is its private source `tests/e2e`, testMatch is the filename, and webServer cwd is its private detail-page-app. Exact test exists at `tests/e2e/bouquet-detail-page.spec.ts:16`.

Static Playwright --list using retained private source/config and the same argv: anchored grep => exit 1, zero tests; changing only grep to `server-rendered without JavaScript$` => exit 0, exactly one test in one file, chromium. Playwright matches grep against a composite string containing project/file/title, not the bare title. Thus leading `^` anchored to bare title is invalid. This was a selector error, not an established runner forwarding defect: `suites.mjs:124-128` forwards file, project and grep as individual argv entries identically for all families. The original filtered invocation correctly failed nonzero. No Source/config change or assertion weakening; no build or browser test run during diagnosis. Original no-tests FAIL remains actual failure, not a passed fixture.

Luna, from project root with previously documented private Node24 HOME/XDG/native/browser environment:

```sh
.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node scripts/qa/suites.mjs detail-page --file tests/e2e/bouquet-detail-page.spec.ts --project chromium --grep 'server-rendered without JavaScript$'
```

Confirm Playwright expected=1, passed=1, 0 skipped/unexpected; do not infer pass from selection. The runner makes a fresh build; no existing build reuse is asserted. Static `--list` via runner itself only reports parsed options, not Playwright case discovery. Negative anchored selector was tested by Playwright --list and properly failed with 0. Full-family aggregation and injected sub-suite failure propagation remain unverified; no safe dedicated control mechanism is implemented, so do not claim that a control has passed. Root typecheck was not run because `.next` existed, not a type failure. Other families and full regression remain unverified.

## Continuation — orchestration controls pending Luna

Luna's subsequent corrected selector actually passed one chromium case, zero skipped/unexpected, browser 3.998s, fresh BUILD_ID `xF27a3PGpMspa6QvRkran`. Selector diagnosis was confirmed: the alleged runner defect was a false positive; preserve the real previous zero-case failure. Parent Luna runtime gpt-6-luna, 11 API calls, child 150.73s, batch 150.86s includes two tasks; do not assign separate timings or double count the other task's 16 tests. Prior unit 121, lint, smoke 3 and export control 1 are historical evidence; no unchanged-current-source claim after the control refactor.

Extracted actual CLI selection, Playwright argument construction and group aggregation into `scripts/qa/suite-controls.mjs`, called by the real runner. Test-only injected callbacks cannot be selected by runtime flags or environment. Inventory failure previously referenced `parent` before initialization; now it prints all affected groups BLOCKED and returns nonzero. Input filter forwarding now preserves an explicitly empty grep instead of dropping it; full rejects even empty filters. `scripts/qa/suite-controls.test.mjs` exercises actual functions and actual inventory CLI against synthetic temporary data: full plan and output, failure/blocked continuation, argument preservation, cross-family/full-filter rejection, unknown/missing detection and package scopes. It is a separately invoked Node QA guard, NOT included in Vitest or `test:full`; existing `scripts/qa/guard-regression.test.mjs` is also separate, not covered by full. Neither command implies full product execution.

Snapshots: `suites-before-controls.mjs.txt`, `suites-controls.diff`; new helper and tests are root scripts. Syntax checks of runner/helper/test passed; executor ran no tests or browsers. Luna must run the following under the documented private runtime, followed by proportional unit/lint and private type checks without altering existing root `.next`:

```sh
.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node --test scripts/qa/suite-controls.test.mjs
.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node --test scripts/qa/guard-regression.test.mjs
```

Test doubles establish control-flow behavior only if Luna runs them successfully; full five-family product/fixture execution remains unverified and historic failures remain unresolved. Review scope after Luna checks: real helper integration and runner wiring, coverage/guard failure and forwarding, preservation of all families and separate guard policy; actual @supervisor gpt-6.1-sol required, medium risk, no acceptance yet. Visible Terra/openai-codex runtime; completion usage unknown.

## Migration provenance correction and disposition

### Lead decision and candidate implementation

Lead authorised the existing current-source worker identity contract; the previous historical-binary blocker was an incorrect assumption, retained below. `scripts/qa/suites.mjs` now prepares two fresh current-slot exports, verifies their selected source/config bytes against the initially recorded root export, injects the original migration fixture template/data, builds each and records BUILD_IDs and node_modules realpaths; preflights both consecutive private ports. `migration-worker.ts` uses `process.execPath`, managed slot/evidence paths, private port parameters, owned-child termination and a bind check; readiness logs HTTP status. `migration-run.sh` delegates to the managed runner. Migration Playwright config no longer starts a competing webServer. Dependency identity is currently only shared realpath and lockfile bytes, NOT a full installed-dependency byte hash; no claim otherwise. Slot identity, no-clobber and interruption/cleanup behavior have not been exercised. `prepare.py` remains legacy and is not called by the new runner. Mechanical tests remain Luna-owned.

Action diagnostic Luna: old private server ready 490ms then `/en` returned HTTP 404, fixture title present but button marker absent; standalone warning did not prevent listening. Fixture request config rejects missing requestLocale, layout called translations without supplying it; added `setRequestLocale(locale)` after validation in fixture layout. This is a source-grounded candidate, not a proven cause/fix until fresh build and browser case. No product UI/assertions changed. Prior connection-refused early probe was not evidence of permanent failure.

Before snapshots `suites-before-portable-migration.mjs.txt`, `migration-worker-before-portable.ts.txt`, `suites-config-before-portable.mjs.txt`, `action-layout-before.tsx.txt`; runner diff `portable-migration-runner.diff`. JS syntax and shell syntax checked; filetool's standalone TS checker emitted zod TS1259 diagnostics and is not the project typecheck. No test executed by Terra. Test command examples under the documented isolated Node24/private environment:

```sh
node scripts/qa/suites.mjs migration --file tests/e2e/bouquet-detail-preferences.spec.ts --project desktop --grep 'en 360: real component interaction and geometry$'
node scripts/qa/suites.mjs action-button --file tests/fixtures/action-button/browser-smoke.spec.ts --project chromium --grep 'real disabled EnquiryLink across locales and viewport geometry$'
```

Luna must verify positive case count, both slot manifests and BUILD_IDs, HTTP status/fixture marker and cleanup (only owned children; both ports free); negative occupied-port, setup failure, test failure and interruption lifecycle controls remain needed. Full, migration, Action fix and source/dependency identity are not accepted or claimed PASS. Medium risk; actual Supervisor review remains mandatory after checks.

## Migration provenance correction and disposition

See `MIGRATION-DISPOSITION.md`: historical before/after were normalized test case-ID lists, while `snapshot-0.json`/`snapshot-1.json` compared two identical-at-run worker exports, not old/new product source. Historic complete exports were reported absent and no complete before-product artifact was identified in the searched project QA packet. Current regression versus historic replay requires the owner decision described there; full continues to report migration BLOCKED. No Action startup work was duplicated. The earlier “baseline witness” wording must not be read as proof that historical migration compared two product builds.

## Correction 2 — fixture lifecycle incomplete, fail closed

Luna attempt 5 actual gpt-6-luna, provider unknown, 8 API calls, child 231.23s, batch 231.39s: gallery one desktop case PASS 3.227s; action-button fresh build `i7WAUMf_giUqKVKRUcvbQ` compiled/typechecked but webServer timed out at 120s, no case; migration NOT RUN on safety grounds. Historical failures and prior passes remain separate. No test or browser executed by Terra in this continuation.

Action: retained Playwright JSON identifies readiness URL `/en`, private fixture cwd and timeout; saved commands/summary do not include HTTP status or full server stdout. Installed Next `dist/server/next.js:255-267` logs standalone warning then continues `createServer`; warning alone cannot establish a failed listener or exact timeout cause. Fixture `i18n/request.ts` requires requestLocale, and no fixture middleware was discovered; possible locale readiness issue remains a hypothesis, not proven. No speculative server/config change. Owner/Luna needs an owned private diagnostic with captured server stdout and actual readiness HTTP status before choosing standalone vs normal mode; do not touch the existing failed run or unknown listeners.

Migration: existing worker uses hardcoded foreign Node and ports 3310/3311. `prepare.py` records hashes of input tree and creates separate fixture route; `migration-run.sh` compares two independently exported snapshot manifests and then replaces both routes with migration page. No authoritative historical before/after witness or approved baseline handle is named by the new orchestrator. It was incorrectly attempting a separate single app without supplying worker slots or port lifecycle. Removed that misleading unready setup and fail closed with explicit BLOCKED for migration before any build/worker; other families remain attempted by full. This is a safety guard, NOT completion of migration plumbing. Owner must supply/identify intended source-bound baseline witness and authorize its use; then implement portable owned-worker and before/after verification rather than fabricate evidence.

Files: `scripts/qa/suites.mjs`; inert before snapshot `suites-before-fixture-lifecycle.mjs.txt` SHA256 e98a5f1ddf6662cc3789e0c1cce6911ff72719df6515127d3e5b66dd3a8d413a; after SHA256 88040a957d55fb51b6e8b1ec5322c3fc1fbf98d8ecdad16bef1e5cfc0a0ae195; `suites-fixture-lifecycle.diff`. Syntax check passed; no test pass claimed. This change is same-executor implementation-defect correction, not parent takeover; Terra visible gpt-6.1-terra/openai-codex, continuation usage unknown. Medium risk and actual Supervisor gate unchanged; not ready for review/acceptance.

Existing one-case commands, NOT cleared to rerun until the corresponding cause is resolved (migration currently intentionally BLOCKED):

```sh
node scripts/qa/suites.mjs action-button --file tests/fixtures/action-button/browser-smoke.spec.ts --project chromium --grep 'real disabled EnquiryLink across locales and viewport geometry$'
node scripts/qa/suites.mjs migration --file tests/e2e/bouquet-detail-preferences.spec.ts --project desktop --grep 'en 360: real component interaction and geometry$'
```

## Correction 4 — attempt 7: label DOM and geometry contract

Luna gpt-6-luna, 11 calls, child 114.16s/batch 114.3s: Action build `6gn8KOKv70Yjqdq60r4vw`, selected case FAIL, count 2 passed, adopted `span` missing; stopped en/360, no later locales or geometry ran; owned port free. `run-HFHgQI/.../trace.zip`, `1-trace.trace` frame snapshot explicitly shows legacy `<span>Ask the studio</span>` and adopted direct text `Ask the studio`, each disabled button with matching arrow SVG. `EnquiryLink.tsx:17-22` intentionally passes children directly, `ActionButton.tsx:9-10` forwards props, shared CSS `ActionLink.module.css` has no span rule. Supervisor `docs/qa/model-quality/luna-react-button-001/supervisor-review-2.json` PASS is limited to primitive/extraction; its accounting explicitly says no dedicated visual geometry proof. Therefore tag-specific span is not an established approved contract; do not classify absence alone as product failure. Replaced tag lookup with exact visible button text plus nonzero DOM Range bounds on the actual label text, retaining name, glyph and disabled checks.

The original geometry compared absolute page x/y of separate columns, impossible to establish equality for side-by-side elements (`globals.css` `.siblings` flex, gap 24px); now compare x/y relative to the corresponding fixture parent, retaining strict exact width, height and computed style equality at both widths. No tolerance changed; this correction tests per-column alignment, not equality of page coordinates. Actual geometry equality remains unverified and a mismatch must not be hidden.

| Contract | Source assessment / remaining status |
| --- | --- |
| scoped count and native type/disabled | Count passed en in attempt 7; native disabled branch retained; other locales unverified. |
| exact accessible name, visible label and SVG | Name/glyph source matches; adopted text confirmed trace; all locales and new range check unverified. |
| no href, description target/text | Source branch and fixture layout provide these; assertions retained, unreached in attempt 7. |
| viewport geometry and styles | Exact comparison remains at 360 and 1440 using corresponding-column offsets; unreached, actual differences remain possible. |
| keyboard/focus | Existing case has no keyboard assertion; disabled native semantics asserted, separate historical keyboard proof is scoped to its own source/run, not this attempt. |

Before `browser-smoke-before-attempt7-fix.ts.txt`; focused diff `action-attempt7-fix.diff`. Automatic single-file TS checker reports pre-existing Zod TS1259 outside project config, not project typecheck. No Terra test execution. Action FAIL preserved; corrected case awaits Luna using same command above, with 1 passed/0 skipped expected. Full actual run remains unverified; other representative passes and migration dependency-hash limits unchanged; actual supervisor review remains required.

## Correction 3 — Action-button extra button (test selector scoping)

Luna attempt 6: migration PASS 1/1, builds `_Y3mIgJ_SrVCuaehN2sjv` and `8I5dtFjR4xoT9F6NbE6Ia`; action-button FAIL exit 1 at `browser-smoke.spec.ts:8`: `page.locator('button')` expected 2, received 3, fresh build `SYpXjMtXOMbEGlXpxjcUo`, run `run-SvAov2`.

Actual root cause: `/en` renders **3 real `<button>` elements**. The fixture page itself renders exactly the intended 2 — legacy button in `data-compare="legacy"` and adopted `EnquiryLink` in `data-compare="adopted"` (`page.tsx:7`). Since `site.whatsappUrl` is `null` (site.ts:4), `EnquiryLink` with no URL renders `<ActionButton disabled>` → a button. The **shared fixture layout** additionally renders its own `<EnquiryLink variant="primary" subject="fixture">` inside `<main>` after `{children}` (`layout.tsx:14`), producing a 3rd button outside the fixture component under test. The spec used the unscoped `page.locator('button')`, so it caught the layout's extra button too. Not a product regression, not a count-threshold relaxation, not production source/UI change.

Fix: scope the locator to the existing fixture containers already present in the DOM (`data-compare="legacy"` / `data-compare="adopted"`), keeping exact count 2, labels, disabled state, svg/span, `aria-describedby`, missing `href`, and geometry assertions unchanged:

```
-    const buttons = page.locator('button');
+    const buttons = page.locator('[data-compare="legacy"] button, [data-compare="adopted"] button');
```

Before snapshot: `docs/qa/quality/test-suites-001/browser-smoke-before.tsx.txt`; patch is the single line above. `setRequestLocale(locale)` in `layout.tsx` (attempt-5 hypothesis) remains as a source-grounded candidate only — its causal relationship to this assertion failure is unproven and it is left in place. Migration/source/dependency identity and Action failure remain not accepted or claimed PASS; this selector correction still needs Luna's positive case-count verification. Replay command unchanged family/grep:

```sh
node scripts/qa/suites.mjs action-button --file tests/fixtures/action-button/browser-smoke.spec.ts --project chromium --grep 'real disabled EnquiryLink across locales and viewport geometry$'
```


