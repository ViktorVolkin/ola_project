# Activation metadata observer — pre-execution security checkpoint

**PREPARED, not executed. No real credential metadata/load, SDK request or network operation. Luna offline tests and a dedicated actual Supervisor approval are required before the one already-owner-authorized GET.**

## Scope / identity / prior disposition

Owner explicitly answered “Да, разрешаю” to one diagnostic authenticated read of the existing application's hosting metadata. This does not authorize redeploy, new principals/role probes, Content Lake Viewer reuse or content/CORS/config writes. Current visible executor identity: `gpt-6.1-sol / openai-codex`; actual return/fallback/per-call/cost/duration reconciliation remains parent-owned. Prior public diagnosis parent completion9API/206.79schild/207.08sbatch is historical reported metadata, not this attempt's counters.

Read actual `../supervisor-readback-review-1.json`: hosting remains BLOCKED/NOT_VERIFIED after consumed one hosting attempt, old public manifest/new available assets mismatch unresolved. Recommendation is exactly GET `/projects/zhn2ddaj/user-applications/xxpedejjvg9va6r4u8t4llzw`, API2024-08-01, maxRetries0, finite timeout, selected fresh activation identity only. Existing hosting approval is **not** observer approval. Old observations, FAIL/PASS receipts, code/bindings and the356-file build are untouched; no rebuild/public refetch.

## Actual implementation

- `credential.mjs`: metadata and loadCredential function bodies copied **byte-identically** from the reviewed hosting runtime, verified by source comparison only. Exact original Deploy-file path/O_NOFOLLOW/descriptor checks/SANITY_AUTH_TOKEN-only parse preserved. Import defines functions; actual credential access occurs only after new approval/binding/reservation in entry. No Viewer access.
- `observer.mjs`: one SDK `.request` plus a single-use, exact-version/path/HTTPS-host GET-only fetch boundary. Fixed global endpoint **https://api.sanity.io/v2024-08-01/projects/zhn2ddaj/user-applications/xxpedejjvg9va6r4u8t4llzw**. Method/body/query/host/version changes and cookies reject before wire call. Underlying fetch is forced `redirect:'manual'`, `credentials:'omit'`, with a15s AbortSignal; no redirect/auth-follow or cross-host token forwarding. State permits at most one wire invocation. Both client config and request set maxRetries0/timeout15000; request additionally sets observed `maxRedirects:0`. No alternate/list/public/role query or write API exists.
- `entry.mjs`: no import of executable deployment runtime. Dedicated `supervisor-approved.json` must bind **this observer** and exact operation/path/version before any credential check/load. Source/dependency hashes are checked. An exclusive persistent empty `one-shot-reservation` file prevents later invocations from issuing another query. Failure consumes the invocation reservation; no automatic retry. Only then opaque loader and one observation run. No child process, CLI or shell operation.
- Shared HOST-R1-corrected `safeSerialize` is imported unchanged from the safe nonexecuting `../deploy-candidate/core.mjs` (bound dependency). Observations/errors pass through it before persistence. Raw SDK errors/responses, Authorization/cookies, environment, user/deployedBy/private blobs are never persisted or printed. Failure output is generic, with status/request count/selected headers only; no response body/error echo fallback.

Fresh `observation.json` (not yet present) may contain only observedAt/status/HTTP status/request count, selected `x-sanity-request-id`/`x-request-id`/Cache-Control/Age, exact validated app identity plus application.updatedAt/autoUpdatingVersion and selected activeDeployment fields: id/deployedAt/updatedAt/isActiveDeployment/isAutoUpdating/version; manifest.buildId and workspace name/title/basePath/projectId/dataset/schemaDescriptorId. Missing activation objects/fields are **null**, not inferred from old CLI output. Returned ID/version/time strings are preserved exactly, subject only to necessary credential redaction. No arbitrary URLs are manufactured; no secret/user/private response fields survive the projection. Wrong application identity, non200, redirect, network or parse failure returns NOT_VERIFIED with no followups.

## API/SDK source evidence

`provenance/endpoint-source.txt` captures installed `@sanity/cli/dist/services/userApplications.js:4-40`: APIversion2024-08-01 and project-scoped app-by-ID GET. `provenance/sdk-request-options-source.txt` captures installed `@sanity/client/dist/index.node.js:751-795`: timeout translation, function-form fetch, maxRedirects0→manual and maxRetries override. The observer uses the existing reviewed createClient pattern (fixed project/dataset, global API host, useProjectHostnamefalse, useCdnfalse), adding only source-supported timeout/fetch controls. No invented activation/list endpoint or custom generic API transport. Installed SDK/service/package source hashes are bound; selected witnesses are not a full dependency-tree attestation.

## Synthetic tests and real execution gate

`offline.test.mjs` is prepared, **not run by Sol**. It imports the actual installed SDK with an in-memory fake fetch and synthetic token only, never entry/credential modules. Covers exact one request, strict method/target/version/query/body/cookie rejection, zero retries/manual redirects/finite settings, second-call rejection,302/401/403/404/429/500/network/JSON failures with no followups, mismatched app identity, missing activation fields, field allowlist, parsed quote/backslash/control raw/URI/base64/JSON-escaped redaction, and static approval-before-loader/reservation linkage.

**Luna exact next command, fresh log/no overwrite:**

```bash
cd /workspace
D=docs/qa/quality/sanity-home-online-001/studio-hosting/activation-observer
(set -o noclobber; env -i PATH=/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin HOME=/workspace/.local-tools/ola-qa/home XDG_CONFIG_HOME=/workspace/.local-tools/ola-qa/home/config XDG_CACHE_HOME=/workspace/.local-tools/ola-qa/cache SHELL=/bin/bash NODE_DISABLE_COMPILE_CACHE=1 /workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node --test "$D/offline.test.mjs" > "$D/luna-offline.log" 2>&1)
```

Do not run `entry.mjs` as a test or probe. Actual Supervisor reviews new code, synthetic results, strict wire boundary/field projection, loader reuse, safe serializer dependency and `observer-binding.json`. A new own observer approval must contain actual PASS/supervisor/gpt-6.1-sol/openai-codex, `operation:'single-activation-metadata-GET'`, `path` exactly the stated SDK path, `apiVersion:'2024-08-01'`, and `observerBindingSha256` matching:

**2f7a31bd7e063d1d78a5d788acc83d079fe2678dac31abc525b5166d0d772f6f**

No approval file fabricated. Old candidate/supervisor-approved.json cannot satisfy this gate. After a genuine dedicated approval, same executor can invoke entry once under the identical explicit private Node24 environment; no repeated owner consent is needed for this already-approved query scope. No real command has been executed here.

## Verification / accounting

Actual execution limited to4Node24 `--check` commands, all exit0, source/provenance/hash generation and exact function-body comparison. `provenance/reuse-proof.json` records these boundaries; `observer-binding.json` binds4new files, approved serializer core, SDK/service/package witnesses and readback disposition. No tests/imports/SDK/client creation/network/credentials performed during preparation. New artifacts only in this observer folder. No parent takeover or correction to other units; HIGH new credential/control-plane observer boundary, `review_required=true`, delivery awaiting Luna+Supervisor, not accepted. No ledger/source/package/dependency/Studio build/port/browser/Git/CLI/Hermes/OS/model/provider changes, helper agents or Supervisor message.

Future old/absent/ambiguous activation pointer warrants owner/operator/Sanity support disposition, not another principal or internal retry campaign. A new pointer may justify a separately authorized paired public manifest/root observation later; this phase does **not** automatically perform it. Hosting consistency/complete readback, website owner Git deploy, real Viewer/editor/CORS/draft workflow and content-mutation consent remain separate. No whole-project/manager-ready claim.
