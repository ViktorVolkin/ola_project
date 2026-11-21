# Current production restoration result

**Technical capability restored; awaiting required independent Supervisor review.** Medium risk, review_required=true. Source phase **pre-header-refinement**: includes the frozen interaction CSS changes already present at export, but NOT the subsequently queued header underline/lift refinement. This is neither full interaction/animation acceptance nor production release/performance PASS.

## Real gates

- Isolated Linux ARM64 Node **24.22.3** at `.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node`.
- Existing npm **11.20.0** CLI `/usr/local/lib/node_modules/npm/bin/npm-cli.js` runs under that Node24; exact packageManager contract now matched, without installing or replacing global npm. Historical dependency regeneration used bundled npm11.19.1; no additional npm ci was needed in this continuation.
- Engineer-provisioned **`/ola-native-cache`**, UID1001/mode0700, unchanged root ancestor; QA validates the existing directory and uses command-scoped `SWC_NATIVE_BINDING_CACHE`. Real **@swc/core1.16.20 TypeScript->JS transform PASS**, output recorded in `swc-core-transform.json`, alongside real Next SWC/watcher/sharp operations and native paths. No library/carrier modification, decompression bypass, security disable or permission/mount change by this executor.
- Playwright **1.64.1**, Chromium **156.0.8078.4**, revision1248: DOM/JS/focus/keyboard PASS with scoped writable HOME and official matching browser cache; no Crashpad workaround or crash.
- Configured strict ESLint **PASS**, zero warnings, only owner-approved `.local-tools/**` explicitly excluded; QA scripts remain linted.
- Vitest **10 files / 52 tests PASS**, final recorded run3.11s.
- Actual **Next16.4.5 production build --webpack PASS** on current exported source; 23 static pages generated, compiler and Next TypeScript gates passed. `build.log` retains the exact command/mode and warning.
- Independent **`tsc --noEmit --incremental false` PASS** using that fixture's matching generated Next types, not root old build/typegen.
- Built app **12/12** cases PASS: EN/RU/SR × Home/preview bouquet × desktop1440/mobile390. Separate no-JS browser contexts assert real SSR heading/document language; enabled native header controls establish hydration/focus/click, mobile menu Enter/Escape behavior. Runtime console/page/network errors empty, initial visible images decoded, real self-hosted font responses loaded.
- Existing configured focused E2E selection **5/5 PASS** (7.7s): locales document/metadata/fonts plus preview locale headings and SSR/noindex. Uses the existing tests with a narrow QA config override pointing to the exact owned private server, not root3100 or all28 specs. These are additional selected tests, not an exhaustive suite or full motion audit.

## Reusable immutable build

**BUILD_ID `tQHQbZ2RcOzJh-liXSWgW`**

- Fixture `/workspace/.local-tools/ola-qa/fixture-e6wedH`; ownerUID1001.
- Initial export68,918,553 bytes included pre-existing nested test-fixture build output by mistake. After removing only that accidentally copied private test output, the selective source input is **35,048,170 bytes**; retained serving fixture content **47,450,753 bytes**, below200MiB excluding the shared dependency symlink. Directory apparent size47,450,776 bytes including the symlink entry. Original export hashes remain in build-artifacts.json/sourceInputs; root tests/fixtures and all old task fixtures were untouched. Full nonincremental TypeScript passed again after this test-output-only cleanup; the application's built `.next` artifacts were not changed.
- **`reusable-build.json`** records exact runtime/env/start command, source+dependency hashes, full retained files (including nested emitted node_modules), manifest handles, bundler/phase and port policy. `retained-emitted-artifacts.json` records full current emitted serving artifacts.
- `served-en.html.txt`, `served-identity.json`: actual HTTP HTML hash and byte-for-byte equality of emitted JS/CSS/font static URLs with fixture files before server shutdown. URL decoding is handled for `[locale]` chunk paths.
- Final owned Next processPID11512, cwd/start ticks verified before SIGTERM; normal Next exit143; port **46475** successfully rebound afterward (`server-cleanup.json`). No task server/browser remains. Earlier owned server37559 also stopped after the first proof-helper failure; no root3100 process touched.
- Only this new fixture's disposable `.next/cache` was removed before serving, after initial artifact hashes were retained; image optimizer caches were later regenerated during actual smoke and retained. No old fixture or denied cleanup was touched. Failed fixtures from this work are retained, not silently cleaned.

Start only on a newly checked unoccupied loopback port using the handoff's command. Do not rebuild while serving. Reuse is valid only against matching source/config/lock/library manifests; Vitest cache differences are separately classified. A header refinement or any other source change requires a new build identity, not relabeling this build.

## Provenance and unchanged source

The new baseline legitimately differs from original pre-animation source in **19 CSS paths**, programmatically measured and preserved in `new-baseline-vs-original-source-diff.json`. Those changes were NOT made or rolled back by this executor. All current source/config/package/lock files remain unchanged across this executor's final build+smoke phases. No application CSS, Header or other source was modified here.

Complete raw per-path input/dependency snapshots remain in before/after-verify and before/after-reuse `.json.gz` files. `combined-raw-diff.json` retains the exact sole final phase mutation:

`node_modules/.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/results.json`

Producer: Vitest result cache. Its before/after SHA-256 and sizes are retained; raw dependency equality is false, no broad cache omission. No dependency install/version/lock change occurred in this continuation. Historical installation240-path and57-cache diffs remain in the parent packet.

For the <=15MiB proof ceiling, exact byte-identical compressed snapshots were replaced with relative symlinks only after SHA-256 plus full byte equality verification. All logical paths still resolve to complete original bytes; `snapshot-deduplication.json` maps history. New writes use atomic replacement to avoid modifying shared referents. No evidence content/log was discarded. Final packet size is measured at closeout.

## Failures and repairs retained

1. Earlier /tmp and /var/tmp noexec/cache trust failures remain in parent reports. Engineer separately resolved the prerequisite with owner permission; it persists container stop/start but not replacement. Bootstrap does not provision root directories: missing/invalid `/ola-native-cache` produces a clear prerequisite error, with no automatic fallback/path sweep/sudo.
2. Preferred default Turbopack production build failed resolving external shared node_modules because HOME is inside the workspace and inferred root was restricted to the private fixture. See `../current-turbopack-failed/build.log`. The supported, installed CLI `--webpack` production mode was selected without source/config changes. Default Turbopack remains an infrastructure limitation, not a green default-build claim; no Turbopack performance comparison.
3. First webpack compilation succeeded but private typecheck exposed an omitted existing `scripts/model-quality-summary.mjs` imported by unit tests. The selective exporter/manifester now includes that exact required input; no test/app rewrite. Failure retained in `../current-webpack-export-failed/`.
4. First successful production build/typecheck reached a static-identity helper assertion on encoded chunk filenames. Fixed URL decoding only; failure log/normal server shutdown retained. The **same successful fixture/build** was reused without rebuilding for all later smoke.
5. Focused QA config initially triggered strict lint's anonymous-default-export warning; assigned its object to a named variable, reran strict checks and focused tests successfully. Failure retained. Initial smoke artifact helper skipped nested emitted node_modules in its count; the full retained artifact walk corrected that.
6. Final full inventory exposed accidentally copied pre-existing `tests/fixtures/action-button/.next` output. Only that newly owned private copy was removed, after original input hashes were preserved; future exports explicitly filter generated `.next`/node_modules/.git and environment files. Root fixture/source files were not removed. The final serving fixture/typecheck remain valid; `copied-test-artifact-cleanup.json` records this correction and exact path.

All corrections belong to the assigned executor, not parent takeover, app fixes or reviewer findings. No child/reviewer was called. Supplied prior-attempt history remains distinct from unknown current counters: `deleg_68e8a6ec5` API64.08s and earlier supplied692.94s attempt strings are preserved as provided; no invented total/free-cost claim.

## Commands and limits

Actually successful: `node scripts/qa/local.mjs bootstrap`, `native`, `probe`, and **`reuse`**. `verify` is the cold private export/build entry point; its production build+types passed, then its initial orchestration proof helper failed and was corrected. The successful final no-rebuild `reuse` executed current strict lint/unit/types, all12 real app cases and5 existing focused E2Es against that build. No claim that a fresh final cold build was repeated solely to recollect a green wrapper exit.

Files changed are confined to own QA scripts/config, documentation/evidence/ledger. Earlier targeted `.gitignore` and byte-preserved legacy probe archive remain as documented. Full28-spec E2E, detailed motion/visual/reduced-motion audit, queued header refinement, deployment and web performance measurements remain separate. Supervisor review is mandatory and not yet requested/PASS.
