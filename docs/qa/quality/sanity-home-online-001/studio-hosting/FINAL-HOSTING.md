# FINAL-HOSTING — one approved invocation, readback NOT_VERIFIED

**One actual existing-Studio update was attempted. Installed CLI exit0 reports deployed/update and1/1schema deployed; the guarded runtime exits1 because full public asset readback failed. Overall hosting verification: NOT_VERIFIED. No retry or redeployment.**

## Authorization / actual execution

Read actual `deploy-candidate/supervisor-approved.json` and `supervisor-review/review-2.json`: PASS for exactly one original-executor invocation of candidate binding **7c0221e474853996f8cb10e14b4e38d8e87019641fc29848afbc244d177dc856**. Current visible executor runtime is `gpt-6.1-sol / openai-codex`; parent completion/per-call/fallback/cost/duration reconciliation remains pending. Prior HOST-R1 FAIL and all no-deploy checkpoints remain historical and unchanged.

Executed **once**, foreground timeout600s, observed Docker cwd `/workspace`, through only the approved script:

```bash
env -i PATH=/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin HOME=/workspace/.local-tools/ola-qa/home XDG_CONFIG_HOME=/workspace/.local-tools/ola-qa/home/config XDG_CACHE_HOME=/workspace/.local-tools/ola-qa/cache npm_config_cache=/workspace/.local-tools/ola-qa/cache/npm SHELL=/bin/bash NODE_DISABLE_COMPILE_CACHE=1 /workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node /workspace/docs/qa/quality/sanity-home-online-001/studio-hosting/deploy-candidate/runtime.mjs
```

Runtime terminal exit **1**, output only the generic approved failure notice. No source/helper/test/build/binding/approval bytes edited, no rebuild of unchanged356-file dist, no manual CLI/SDK fallback. The opaque approved loader used Deploy credential only internally; this executor never inspected/read/statted/hashed/loaded that credential outside the approved runtime. No Viewer use.

## Known remote effects and exact target

Sanitized `deploy-candidate/execution/deploy-result.json` contains child exit **0**, signal null and actual CLI output:

- `deployed:true`, `action:"update"`, URL `https://ola-studio-zhn2ddaj.sanity.studio/`.
- Existing app **xxpedejjvg9va6r4u8t4llzw**, project **zhn2ddaj**, type Studio, internal host **ola-studio-zhn2ddaj**.
- Explicit supported payload: appId same exact ID, projectIdzhn2ddaj, Studio6.24.0, `isAutoUpdating:false`.
- CLI reports generation of Studio manifest, **Deployed1/1schemas**, and successful hosting update. These are authorized hosting metadata/deployment operations, not content document publication.
- Exact prewrite `app-before.json` and postwrite `app-after.json` both independently record the same ID/project/host/type/internal-url identity.

This establishes an actual successful CLI hosting operation and postwrite target identity, **not complete remote asset verification**.

## Exact failure / no false revision claim

`deploy-candidate/execution/final-error.json` is a valid nonnull sanitized object:

```json
{"blocked":true,"writeAttempted":true,"message":"Public asset readback failed","noRetry":true}
```

`execution/hosting-readback.json` **does not exist**. The approved runtime reached its public-asset loop and rejected a non-index asset status/hash check. It does not persist the offending filename/status or partial accumulated rows on this branch, so the exact failing asset, number already matched, and whether this reflects transient propagation, status, or byte mismatch are **unknown**. No unsupported diagnosis or new readback/deployment campaign performed. The public root redirect check precedes this loop and did not throw; this does not substitute for full asset/manifest/origin matching.

The CLI-returned application contains `activeDeployment.id=zvhgqn8vulktuss3tv9x9hi5` with `deployedAt=2026-11-19T21:17:20.004Z`, i.e. the **old application/deployment record** returned by the inspected CLI flow. It is not evidence of the new deployment's ID or time. No newly verified deployment ID/time, new public manifest SHA256 or complete deployed asset inventory is available. Do not reuse the old manifest hash as new-deployment proof.

Bound local production source/build remains the reviewed5-input/356-file build. Intended public preview origin is **https://olaproject-chi.vercel.app**, with existing local JS SHA256 witnesses:

- `static/FormValue-drVsNI6m-BzRMrG5U.js`:8429f3bffe6ad887e731454b6331855d2278b49dc729cab3ec22ea8a62ce5e69
- `static/authStore-B09IfFua--OTW4x1n.js`:229d74e08eef1170b5de2a38dd205c45a79501a2c1bfc1abf31823b6af5fec79
- `static/sanity-BoXWu92Z.js`:a0bac1e537c9649f8ae564b518c917bdc7bd2c390d77253d754762c8f70b17c4

Those are **local built bytes**, not verified hosted production-origin witnesses. Reviewed `build-binding.json` and source identity remain unchanged; no actual-token value/hash/length/format is reported.

## Owner links / remaining operational scope

Existing Studio: https://ola-studio-zhn2ddaj.sanity.studio/
Dashboard: https://www.sanity.io/@obdulf8du/studio/xxpedejjvg9va6r4u8t4llzw

The owner may open/refresh the existing app, but new Presentation visibility is **not verified** and must not be promised from CLI success alone. Website Git/Vercel delivery remains owner-operated; the website preview API may still404 until its matching source is pushed/deployed. No fresh website probe was performed here. Production variables remain owner-reported, Viewer capability/editor login/exact-origin CORS/real draft-save isolation remain unverified. Private draft existence unknown; previous publishedHome0 is historical. No content import/photo upload/save/publish or CORS/roles/Vercel mutations authorized or performed.

## Accounting / next gate

Bounded delegated HIGH hosting attempt, actual approved code unchanged, `review_required=true`; delivery **blocked/NOT_VERIFIED after actual write**, not accepted/global PASS. One runtime invocation and one CLI child, not a claim of one HTTP operation. No retries, alternative targets/accounts/credentials, source repair, helper agents/Supervisor calls, shared ledger changes, Git/install/OS/Hermes/model/provider repair, root.next/3100/server activity. Only approved runtime created own execution records and this own final accounting was added. Subsequent scoped Lead/Supervisor disposition is required; any new readback instrumentation/execution needs its own bounded authorization and must not rerun deployment. Global suite/refactor acceptance remains separate; no manager-ready/allgreen claim.
