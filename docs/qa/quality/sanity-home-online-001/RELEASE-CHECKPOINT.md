# RELEASE-CHECKPOINT — OLA-SANITY-HOME-ONLINE-001 continuation

**PREPARED, awaiting Luna execution and actual Sol Supervisor acceptance. Not deployed, not manager-ready.**

## Scope / precedence

Owner's latest steering supersedes the earlier no-push/manual CLI transport proposal: **owner personally pushes; existing connected Git integration builds the website**. No CLI installation/login/link/upload/deployment procedure or payload has been prepared. Official CLI/ignore documentation was read before cancellation, but that path is now obsolete. Historical `FINAL.md`, `CHECKPOINT.md`, prerequisites and review receipts remain unchanged.

Owner reports adding three **Production** server variables (`SANITY_PREVIEW_ORIGIN`, `SANITY_STUDIO_URL`, private `SANITY_API_READ_TOKEN`). This is **user-reported, not independently verified**. Remote auth absence is already established; no access/vault/login rechecks performed. Prospective permission to use current mixed-history code does not rewrite historical governance verdicts. Review3 accepts only the Dashboard URL correction, not this release.

## Actually prepared and verified locally

Visible executor runtime: developer-injected `gpt-6.1-sol / openai-codex`, delegated executor in active lead profile. This satisfies the visible execution identity check; parent must reconcile actual completion, not infer all-call/parent purity. No routing/model/provider/config changes.

Observed branch `development`, HEAD `5377164b86e3a3aeaaadb985634b88232ebbfcf4`, pre-existing dirty tree retained. No Git mutation.

- `prepare-current.py` ran successfully, exported **296** explicitly selected source/public/config/package files to `.local-tools/ola-qa/sanity-home-online-001/source`, and compared **290** nongenerated website input files to the existing fresh fixture: **0 mismatches**. BUILD_ID `Rp-GZr8-oMAV7SgRiAKIA` verified. These are byte bindings, not a complete installed-dependency or deployed-site attestation.
- `current-source-binding.json` preserves original generated witnesses; the later own harness change extends unauthenticated draft isolation from EN to EN/RU/SR. **`final-harness-binding.json` takes precedence for final harness hashes**, without rewriting the initial receipt. `verify-binding.py` checks those final hashes and root/snapshot/release inputs.
- Reused the existing official Studio+Next harness `../sanity-home-visual-editing-001/takeover/browser-final.mjs`, including transaction-consistent mock mutations, official Presentation UI, exact field/photo paths, every-locale save→refresh after navigation, section saves, mobile image paths, preview authentication controls, served JS comparison and owned-process cleanup/rebind witnesses. No new editor framework.
- Adapted `current-build.mjs` builds **only the new private synthetic Next fixture and isolated Studio** with localhost preview config; it does not rebuild release/root or rerun units/lint/types. The existing fresh release fixture is the unmodified public reference. All Content Lake/auth/photo/mock labels remain synthetic, never cloud PASS. Localhost policy/API substitutions are private test-only changes and must never enter a release.
- `verify-binding.py` ran exit0; both generated `.mjs` files passed Node24 `--check` exit0. **No new builds/browser/servers/tests run by this executor.** No root `.next`/3100 touched; no task servers exist to clean up.

The preparation generator is one-shot and refuses overwriting its private packet. Do not rerun it or regenerate away the final all-locale isolation delta. Source changes require a new explicitly reviewed binding, not baseline rewriting.

## Exact next command for Luna — Docker only, after harness inspection

These paths are the tool-observed Docker `/workspace`, **not a claim about the owner's host terminal mapping**. Execute with a sufficiently long foreground timeout; preserve nonzero output and stop on failure. No install/bootstrap/repair. Do not run the old takeover harness directly: it writes historical evidence and selects stale fixtures.

```bash
cd /workspace
set -e
Q=docs/qa/quality/sanity-home-online-001
N=/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node
python3 "$Q/verify-binding.py" --ports > "$Q/current-run/preflight.log" 2>&1
env -i PATH=/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin HOME=/workspace/.local-tools/ola-qa/home XDG_CONFIG_HOME=/workspace/.local-tools/ola-qa/home/config XDG_CACHE_HOME=/workspace/.local-tools/ola-qa/cache SHELL=/bin/bash SWC_NATIVE_BINDING_CACHE=/ola-native-cache NODE_DISABLE_COMPILE_CACHE=1 PLAYWRIGHT_BROWSERS_PATH=/workspace/.local-tools/ola-qa/browsers "$N" "$Q/current-build.mjs" > "$Q/current-run/build-driver.log" 2>&1
python3 "$Q/verify-binding.py" --built --ports > "$Q/current-run/built-binding.log" 2>&1
env -i PATH=/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin HOME=/workspace/.local-tools/ola-qa/home XDG_CONFIG_HOME=/workspace/.local-tools/ola-qa/home/config XDG_CACHE_HOME=/workspace/.local-tools/ola-qa/cache SHELL=/bin/bash SWC_NATIVE_BINDING_CACHE=/ola-native-cache NODE_DISABLE_COMPILE_CACHE=1 PLAYWRIGHT_BROWSERS_PATH=/workspace/.local-tools/ola-qa/browsers "$N" "$Q/current-browser.mjs" > "$Q/current-run/browser-driver.log" 2>&1
python3 "$Q/verify-binding.py" --built --ports > "$Q/current-run/after-binding.log" 2>&1
```

Expected outputs, **not yet produced**: `current-run/{build-results.json,build-synthetic.log,studio-build.log,browser-results.json,serve-release.log,serve-synthetic.log}` and screenshots. Evaluate actual `failure`, `errors`, `studioConsole`, `overlayWorkflow` with exact EN/RU/SR field/photo paths and save-refresh entries, isolation entries for all three locales, served-assets checks, cleanup/rebind for 42241/42242/42244/3333. Do not infer acceptance from process exit alone. Stop on source mismatch, occupied port, native denial, build failure or browser failure; no fallback cache/port/auth/permission campaign. Original harness cleanup signals only spawned child handles and verifies exact ports; preserve failure logs rather than kill other listeners. Photo clicks establish field mapping, **not real cloud photo replacement/upload**. Whole installed dependency inventory and live Dashboard-base-path roundtrip remain outside this local mock proof.

## Supervisor inspection / gates

Actual `@supervisor` runtime-confirmed Sol is mandatory before acceptance/deployment; none invoked here. Inspect own `prepare-current.py`, `current-build.mjs`, `current-browser.mjs`, `verify-binding.py`, both bindings, this checkpoint and eventual `current-run` outputs; compare original harness/build seams and private `next-synthetic` source patches. Inspect source-bound production preview routes/policy/client/fetch, `HomeVisualEditing`, `next.config.ts`, `studio/sanity.config.js`, original review2/review3 and predeploy triage. No secret files need inspection or loading.

Existing evidence is retained, not rerun: root121 units/lint/types/webpack and isolated Studio checks passed; full Playwright **473 passed / 228 failed / 1 skipped of 702**, wrapper124. Triage:213 runner/contract mismatches,2 gallery measurements and13 unresolved acceptance failures. This packet does not dismiss failures, waive release/push gates or claim all-green. Owner's personal push decision despite red tests is not technical acceptance.

## Owner's standard Git/Vercel checks (no agent deployment)

1. In the existing Vercel project serving `olaproject-chi.vercel.app`, check the connected repository, **Production Branch**, root directory, framework/build settings, and whether automatic deployments are enabled. Local `development` does **not** establish the Production Branch. Owner personally chooses when/what to push; agents do not stage/commit/push/reset/stash.
2. After owner's push, inspect the **new Git deployment's exact commit SHA, branch, environment, build status, deployment URL and assigned domain**. UI Redeploy of an old commit is not delivery of this dirty tree. Record the eventual committed source identity against the reviewed manifest; new source differences need disposition. No deployment is initiated here.
3. Verify only variable **names/target/type metadata**, not secret values. The reported variables are Production-only; a branch Preview deployment may not have them. A Preview hostname also differs from the exact production preview origin. Do not add wildcards or weaken CSP/cookies/CORS to make it work; choose/review an exact intended environment/origin. Keep Viewer server-only, separate from Deploy credentials, with no `NEXT_PUBLIC_*` or Studio token embedding. Real Viewer role/capability proof is still absent; no secret helper was executed or created.
4. Website Git deployment does **not necessarily build/publish separate `/studio`**. Independently inspect the existing hosted Sanity Studio's deployed source/build identity and public `SANITY_STUDIO_PREVIEW_ORIGIN` configuration. No automatic Studio hosting write until actual Supervisor accepts the source-bound packet and an explicit hosting write is authorized. Do not confuse Studio hosting deployment with content publication.
5. After approved website/Studio activation, standard owner Google/Sanity editor login, exact origin/CORS and actual cloud draft-save→preview must be checked separately. Local mock proof is not that roundtrip.

## Content / minimal future consent

Known public query previously returned0 published Home; private draft existence remains **unknown**. No Viewer/deploy secret file has been read, searched, hashed, statted or sourced. No content/generated translations/photos altered; no cloud create/save/import/upload/publish performed.

Existing `studio/scripts/prepare-seed.mjs` / `studio/README.md` explain offline current-copy +14-photo draft preparation; README's pre-Presentation status text is historical, use current `takeover/OPERATOR.md` for integration intent. Before any import the owner must determine whether `drafts.homePage` already exists and approve copy/translations/photo mappings/rights. Minimal next cloud consent: authenticated authorized Editor, named existing Home draft or approved disposable target, narrowly bounded fields/photos to save and restore, and whether an absent draft may be created. Import/upload needs separate explicit permission and must not replace an existing draft; Deploy token is not Editor authority. Content publication requires its own approval and is **not required merely to prove private draft editing**. No secrets requested in chat.

## Own accounting / completion boundary

Bounded continuation of `OLA-SANITY-HOME-ONLINE-001`; delegated integration/predeploy packet; HIGH secure-preview/deploy boundary, `review_required=true`; delivery `awaiting_execution_and_review`, not accepted/release-ready. Actual model/provider evidence is visible runtime injection only; fallback/per-call identity/cost/token/duration and final parent route are unknown pending completion reconciliation. No helper agents/Supervisor/outbound messages, no parent takeover. One owner steering change cancelled transport documentation, preserved as prospective requirement change; no product defect correction. Own harness extension adds all-locale isolation and final binding; syntax/source checks are actual, browser results remain pending. Initial workdir resolves to `/workspace` although requested host path is absent inside Docker; no system repair. Shared ledger/task-routing and previous receipts untouched; this own record covers final recording work. Workflow lesson: adapt the final accepted transaction-consistent harness into an isolated new output path and bind current source before execution; never reuse stale fixture identity or overwrite historical captures.
