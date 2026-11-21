# OLA-AUTONOMOUS-QA-RESTORE-001

**LATEST: technical capability restored; awaiting required independent Supervisor review.** Real current production build, matching types, lint, 52 units, 12 localized browser smoke cases and 5 focused existing E2Es passed. Reusable BUILD_ID `tQHQbZ2RcOzJh-liXSWgW`, **pre-header-refinement**, explicit webpack mode. See [current-production/REPORT.md](current-production/REPORT.md) and [reusable-build.json](current-production/reusable-build.json). Earlier failures below remain historical evidence, not the latest readiness state. No full motion/performance/release acceptance.

Historical bounded cache continuation: `/var/tmp` was noexec and work stopped before cache creation. The engineer subsequently provisioned the separately owner-approved `/ola-native-cache`; see latest report. [native-cache-continuation.md](native-cache-continuation.md) preserves that prior stop.

## Historical partial restoration (superseded)

**Historical state: BLOCKED, partial environment restoration.** Risk MEDIUM; review_required=true. No Supervisor requested or self-acceptance. Runtime/native/browser capability is real, but current application production build and end-to-end smoke remain blocked. No UI changes, animation completion, release readiness or performance PASS.

## Actual successful gates

- Same provided Docker executor: `/workspace`, UID/GID 1001, Linux `aarch64`. System Node remains `v26.13.1`, npm initially `11.20.0`.
- Owner explicitly approved executable tooling under `/workspace/.local-tools/`. Official Node **v24.22.3**, bundled npm **11.19.1**, run successfully at `/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node`. npm satisfies declared `11.x` but differs from unchanged packageManager `npm@11.20.0`.
- Official archive `https://nodejs.org/dist/v24.22.3/node-v24.22.3-linux-arm64.tar.xz`, actual SHA-256 `6e51a2ada00f0011cc266f65d98922b403d7ad88f809ca2aa615a5fe1ce6e86c`, matches previously fetched official manifest. The old `/tmp` archive was no longer present when reuse was attempted, so it was downloaded again into the authorised executable directory and checksum rechecked before extraction. No independent release-signature validation is claimed.
- Reproduced native failure **before** regeneration: `Cannot find module '@next/swc-linux-arm64-gnu'`, exit 1 (`native-before.log`). Existing lock already includes ARM64 optional SWC/watcher/sharp entries; no lock repair needed.
- Authorised `npm ci --include=optional --no-audit --no-fund` using Node 24: **430 packages added, exit 0** (`npm-ci.log`). Native ARM64 Next SWC transform, watcher module operation and sharp PNG encoding pass. `native.json` records actual loaded `.node` files for Next SWC, `@parcel/watcher-linux-arm64-glibc/watcher.node` and sharp ARM64. This does **not** establish that the distinct `@swc/core` binding used by next-intl works.
- Official matching Playwright **1.64.1**, Chromium/headless shell revision **1248**, browser **156.0.8078.4**, installed in `.local-tools/ola-qa/browsers`. Real browser DOM mutation, JS evaluation, focus and keyboard activation pass (`browser-probe.json`, `browser-probe.log`). Scoped writable HOME/config/cache avoids the previous HOME=/ profile problem; no Crashpad error in successful probes. Playwright default headless container mode, no custom web-security/certificate/Crashpad flags. No OS packages installed.
- Strict configured ESLint `--max-warnings=0 --ignore-pattern .local-tools/**`: **PASS**. Only third-party local tools/private export are excluded; no QA lint exemption. Final changed scripts were linted again successfully.
- Vitest baseline: **10 files / 52 tests PASS**, actual duration 3.62s (`unit.log`).
- Exact working commands were exercised: `node scripts/qa/local.mjs bootstrap`, `node scripts/qa/local.mjs native`, `node scripts/qa/local.mjs probe`. Bootstrap's unchanged-lock reuse path passed without repeating npm ci. Package scripts were not needed or added.

## Current blocking gate — build access/security failure

A selective current-source export was created at `/workspace/.local-tools/ola-qa/fixture-wWJLpi`; 68,906,371 source/config/test bytes (<200 MiB), shared node_modules symlink. No environment files, Git data, docs or root `.next` were copied. Only this private export was built.

Actual command (`build.log`), cwd `/workspace/.local-tools/ola-qa/fixture-wWJLpi`, command-scoped Node/HOME/cache:

```sh
/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node /workspace/node_modules/next/dist/bin/next build
```

**Exit 1**, Next 16.4.5 failed loading `next.config.ts` through next-intl -> `@swc/core`:

```text
Error: Failed to load native binding
Error: Cannot find module './swc.linux-arm64-gnu.node'
Error: SWC native addon: user cache failed: validate cache root /workspace/.local-tools/ola-qa/cache: cache root has a parent writable by another user without trusted sticky protection; fallback cache failed: native addon user cache /tmp is mounted noexec; set SWC_NATIVE_BINDING_CACHE to a safe absolute directory owned by your user whose ancestors do not grant other users replacement rights. Reinstall the native package if its payload is damaged; check SWC_NATIVE_BINDING_CACHE and directory permissions for materialization failures.
code: ERR_SWC_NATIVE_CACHE
```

This is a new necessary native-cache access/security denial. The build was **not retried**, repaired through another path, or bypassed. No chmod/chown/remount/sudo, loader trick, SWC safety disable, dependency internal edit, identity/config switch or source workaround. Required next prerequisite: an owner/engineer-provisioned trusted executable native-cache path satisfying this package's ancestor checks. Naming `.local-tools` as an authorised install destination did not resolve the separate cache ancestor trust check.

Consequently **full nonincremental no-emit TypeScript NOT RUN**, because the private production build did not generate the matching types; no root typegen substitute. No BUILD_ID/emitted production artifacts/served HTML/static identity exist for this failed build. No private server was started, no port was acquired, no SSR/hydration/network site smoke or focused E2E ran. The EN/RU/SR Home+preview desktop/mobile smoke implementation remains unexercised. No app bug is confirmed by this environment failure. `verify` is an actually exercised failing entry point, not claimed successful.

## Provenance, all mutations and retained resources

- `before-install.json.gz`, `after-install.json.gz`, `before-verify.json.gz`, `after-verify.json.gz`, `final-inputs.json.gz`: full per-path SHA-256/size or symlink manifests for src/public/tests, explicit configs/type inputs/package/lock and dependencies. These are hashes, not sensitive file contents.
- `install-diff.json`: **240 changed paths**, retained in full. Includes native x64->ARM64 replacement, npm lock metadata, removal of old caches, and **6 old Next fallback incident paths removed by the authorised npm ci**. Prior fallback side effects are preserved in history, not falsely described as never having happened. Some node_modules/caches are tracked in this checkout, so Git now visibly reports these authorised dependency mutations. No Git staging/reset/commit was performed.
- `verify-raw-diff.json`: **57 changed paths**, all exactly classified in `verify-diff-classification.json` as Vitest-generated `node_modules/.vite/vitest/**` or `node_modules/.vitest-cache/**`; no unclassified changes. Raw dependency equality is **false**, not hidden by omitting cache directories. `restoration-summary.json` records this.
- Application source, public assets, tests, package.json, package-lock.json and source configs/type inputs in those manifests are unchanged; actual package/config `git diff` is empty. No root Next config/behavior or root `.next` write.
- New `.gitignore` contains only `.local-tools/`; it did not previously exist. Actual `git check-ignore` confirms runtime exclusion. New `scripts/qa/local.mjs`, `verify.mjs`, `smoke.mjs`; documentation `docs/development/local-qa.md`; this packet and only this ledger unit.
- Legacy one-off probe had no active script/import reference in searched project code (only evidence JSON mentions it). Under explicit task permission it was byte-preservingly renamed `docs/qa/quality/web-performance-001/probe-browser.cjs` -> `probe-browser.cjs.txt`. Both SHA-256 values: `a79608263ba4a37598c45be1c9316ef9bc3d395f1653bf6540cfabf419985177`. Original historical logs/evidence JSON were not rewritten; this paragraph is the archive mapping.
- New fixture retained with its failure evidence, measured file bytes **104,880,647**. Tooling directory `du -sb` **1,193,644,503 bytes**; separate from QA packet. No cleanup attempted; no listeners or child tasks remain from verify (process exited before server spawn; each browser probe closed normally).
- QA packet `du -sb` **6,187,579 bytes** before this final report and preserved initial report copy; comfortably below 15 MiB at that measurement. No screenshots/videos/huge captures collected. Old `/tmp/ola-web-performance-001-fixture` cleanup denial was not touched.

## Preserved history, corrections and limits

The optional initial metadata batch denial was explicitly abandoned, not rerun/repackaged; its branch/owner/HOME-writability/inventory observations remain unknown from that operation. Lead later independently supplied verified `/tmp` mount `noexec` and executable file mode 755; that explains the prior exit-126 runtime failure, superseding its then-unknown cause. Mount flags remain unchanged. Initial report retained verbatim in `initial-tmp-blocked-report.md.txt`. Old root BUILD_ID `-Jf4kElbdK5gdC5BRxjJa` has unknown source identity and was not used.

Within-attempt implementation correction: initial bootstrap guessed the non-exported `playwright/cli` package subpath and failed after successful npm ci; inspecting actual package bin/exports established `cli.js`, which was corrected. Matching browser installation then succeeded; no second same-method failed repair. An initially inaccurate Vitest cache classification prefix was corrected against the preserved actual raw paths; raw diff was never discarded. These are executor implementation corrections, not app defects or parent takeover.

User-supplied prior Sol attempt durations retained as supplied: prep block 35.53s, payload recovery 10.03s, Node/tmp failure 105.56s. Prior Terra delegations `deleg_24f04e5a21` API319.53s and `deleg_6c099c0a4` API30.11s remain supplied history. Injected current runtime identifies gpt-6.1-sol/openai-codex, platform subagent. Current delegation ID, API/token/cost and total wall counters unknown; no zero/free or summed-overlap claim. One executor owns diagnosis, changes, tests, evidence and own accounting. No child/reviewer called. Actual Supervisor review remains required after blocked technical gates are resolved.
