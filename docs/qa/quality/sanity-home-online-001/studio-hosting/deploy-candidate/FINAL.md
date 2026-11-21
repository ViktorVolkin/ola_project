# Deployment candidate — implementation checkpoint, not hosting execution

**PREPARED. Three Node syntax checks PASS; synthetic regressions NOT RUN (Luna next); actual Supervisor review required before any credential runtime or cloud write.**

This is a new attempt appended logically to `../FINAL.md`, whose original no-deployment facts remain unchanged. Prior successful356-file production build and5reviewed Studio inputs were preserved; no rebuild performed. Runtime identity: visible `gpt-6.1-sol / openai-codex`; parent supplies previous hosting-preparation completion8calls/183.0schild/183.2sbatch, not counters for this attempt. Current completion/provider/fallback/cost/duration reconciliation remains parent-owned. HIGH parent scope, delegated executor, `review_required=true`, delivery awaiting offline checks and independent review. No helper/Supervisor/outbound calls, source/config/package/ledger edits, secret access, cloud writes, deployments, installs or Git actions.

## Implemented files and mechanism

- `core.mjs`: exact target, fixed CLI argv/config, injectable validation/preflight/write-once/persistence seams, raw+URI+base64 redaction before persistence, output exact-set/byte verification. No generic cloud creation/update API implemented.
- `runtime.mjs`: executable candidate, but **missing new `supervisor-approved.json` blocks before any secret metadata/load**. That receipt must state PASS, actual supervisor/gpt-6.1-sol/openai-codex and `candidateBindingSha256` matching this candidate. No approval file fabricated.
- `offline.test.mjs`: synthetic-only fixtures, no runtime/loader import, no live SDK/network/secret files. Covers correct-app write-once, missing/multiple/mismatched app/id/host/project/type/urlType zero-write,401/network ambiguity, validation failure, disappearance failed write/no retry, redaction before persistence and output tamper/stale/extra/forbidden paths. Also exercises **actual installed Studio target resolver source** with only its API/import seams replaced: pinned missing app is invalid, not would-create. The fake write tests verify orchestration, not live Sanity race behavior.
- `candidate-binding.json`: hashes candidate code/test, unchanged build-binding and accepted source/review manifest, plus selected installed CLI implementation witnesses. This is selected dependency binding, not a complete installed dependency attestation. Current SHA256: `ef461aecaa4cec90c29c1c6dcc365c1ce52d1b3000fda99cee6a2ad7d929f51f`.
- `provenance/`: byte-preserved old helper and installed CLI snapshots, path/hash mapping, runtime-vs-old diff, loader reuse proof. **`loadCredential` and `metadata` function bodies are byte-identical to the reviewed versions**, checked statically without invoking either. New environment retains the reviewed explicit minimal keys; child adds only production public preview origin and opaque `SANITY_AUTH_TOKEN`. No token argv/public prefix. New child output waits for close and is buffered/redacted before persistence; no raw tee/env dump.

## Observed supported existing-app-only path

Installed `@sanity/cli` implementation, no invented `--app-id` flag or custom update endpoint:

1. `dist/util/appId.js:3-5,55-59` reads `deployment.appId`.
2. `dist/actions/deploy/resolveDeployTarget.js:16-38` gives pinned appId precedence, GETs that app and returns **invalid/app-not-found**, never host/would-create, when absent.
3. `findUserApplication.js:59-141` returns existing app for found; creates only for would-create. Invalid reaches fail-fast reporter; `util/checks.js:4-14` calls `output.error(...,{exit:1})`; `@sanity/cli-core/dist/SanityCommand.js:49` binds that to command error. This stops before the caller's null→new-host path.
4. `deployStudio.js:278-335` resolves target; `:367-389` ships tar of **only the explicit dist directory** using existing application.id.
5. `services/userApplications.js:140-176` POSTs the deployment to `/projects/${projectId}/user-applications/${applicationId}/deployments`, not the app-creation collection. A deletion after successful target lookup therefore fails deployment to the old ID; this code has no fallback create/relink. Earlier deletion makes CLI's repeated pinned-ID resolution fail first. No host flag/autoselection is supplied.
6. `commands/deploy.js` documents sourceDir and supported `--no-build`, `--no-auto-updates`, `--schema-required`, `--yes`, `--json`; exact candidate argv uses those, not `--url`, `--create` or `--external`.

Runtime first SDK GET is the observed project-scoped single-app route `/projects/zhn2ddaj/user-applications/xxpedejjvg9va6r4u8t4llzw` (`services/userApplications.js:12`). Requires exact ID/project/host/type/internal URL.401/missing/network ambiguity fail closed. Dataset production is bound by accepted Studio inputs and build manifest, not inferred from an application response. New standalone deploy workspace receives unchanged accepted Studio source, **only deployment-specific CLI config with pinned appId**, dependency symlink and the356explicit build assets; original reviewed root and built config remain untouched. No extra build. The appId is an operational transport selector for this non-workbench deployment, not a product/schema/content change.

Before credential use runtime checks exact approval/binding, source/build inputs and artifact set; again before preflight/write. It rechecks original immutable356files and staged sources before write. Missing/tampered inputs stop. CLI may generate only its observed `static/create-manifest.json` and hash-named `.create-schema.json`/`.create-tools.json` hosting metadata; runtime rejects other additions, verifies existing356unchanged, token-scans post-CLI outputs, and records final uploaded asset inventory through readback. This is not permission to upload surrounding workspace/docs/node_modules/secrets. No content document/asset/import/publish/CORS API is implemented.

After exactly one child deploy: exact app GET again; root302→exact Dashboard app and index301→root accepted; every other file must return200 with matching bytes/SHA256. Public manifest must identify Studio6.24.0, single default workspace,zhn2ddaj/production and existing schema/tools references. All3production-origin bundle witnesses must match served bytes. Deployment stdout/result is redacted before persistence; `execution/hosting-readback.json` is published only after complete exact public readback. Any failure stops without redeploy.404website preview route remains separate owner website Git prerequisite.

## Actual checks versus next execution

**Done:** installed source inspection, exact loader/metadata body comparison, provenance/hash/diff creation, `node --check` on core/runtime/offline.test — each exit0. No candidate import/execution, synthetic test, real SDK request, credential file stat/read/hash/load or cloud write performed. No private workspace/execution folder created by runtime.

**Luna next — exact offline command, preserve new log:**

```bash
cd /workspace
set -e
D=docs/qa/quality/sanity-home-online-001/studio-hosting/deploy-candidate
(set -o noclobber; env -i PATH=/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin HOME=/workspace/.local-tools/ola-qa/home XDG_CONFIG_HOME=/workspace/.local-tools/ola-qa/home/config XDG_CACHE_HOME=/workspace/.local-tools/ola-qa/cache SHELL=/bin/bash /workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node --test "$D/offline.test.mjs" > "$D/luna-offline.log" 2>&1)
```

Do **not** run `runtime.mjs` for tests, probes or to manufacture a blocked log. It is an actual credential/deployment entry point once approved. No health/readiness/port campaign, whole source guard or duplicate global suite.

## Actual Supervisor targets / later hosting continuation

Review `core.mjs`, `runtime.mjs`, offline code/results, exact pinned config delta, selected installed CLI sources/snapshots, original credential helper comparison, candidate-binding and preserved `../build-binding.json` (356files/5inputs/production-origin3bundles). Verify no-create fail-fast and deletion-after-preflight semantics, minimal env/redaction/errors, isolated allowlist source/output checks and canonical redirect/full asset readback. Supervisor may issue a **new** own approval receipt at `supervisor-approved.json` with the exact binding field after tests PASS; no automatic self-approval or historical receipt rewriting.

Only after that actual approval can same executor continue the already-owner-authorized hosting write via pinned Node `runtime.mjs`; no new owner consent is needed for this exact hosting scope. If API/permission/identity/CLI errors occur, stop without retries or alternate targets. Current old create-manifest hash remains `3e69f1c2712ed72b3e434d8b819ca9818b94a011c883e2ca3b65bfc1a14cfa3b`; no new deployed revision/handle is claimed.

Global test-refactor remains separately unaccepted; no allgreen/push/manager-ready claim. Owner personally handles Git/Vercel deployment. Real Viewer capability, owner editor login/CORS and named-draft mutation consent remain separate; no Viewer helper, seed/photo/content publication or website transport added. Workflow lesson: pin supported `deployment.appId` in an isolated transport config, not `--url`, because hostname selection can create an app; test missing-ID resolver and preserve read-before-write plus no-fallback write-to-existing-ID semantics.
