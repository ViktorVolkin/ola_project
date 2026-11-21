# CLICK-NULL predeploy addendum — functional proof complete, lint rerun/review pending

**Actual Luna proof supports the fix. Fresh production-origin Studio built successfully. NO deployment/credential use. Only remaining requested mechanical check is root lint after import cleanup; then actual Sol Supervisor reviews current source + release/candidate binding.**

## Actual results retained, not rerun by Sol

Read `luna-verification/FINAL.md`: before actual-SDK seam37cases,13pass/24fail with the precise null `_id` failure; fixed37/37GREEN. Official Studio/iframe real pointer RED showed “The presentation tool crashed” after null main-document query; fixed missing/unsaved/draft-only each6/6title/photo EN/RU/SR paths, no page/body errors. Studio types passed. Synthetic local API/auth only, not owner cloud/editor validation. Source config SHA256 remains **edd777479f6375875780d51600a893172b4fcfb4d3abe2dd2218ecefec3429ad**; sole product change remains optional `mainDocuments` removal. Schema/locations/grants/auth/annotations/dependencies unchanged.

Luna root lint failed only on unused browser harness createHash import. Removed **exactly that import**. `lint-cleanup/import-only.diff` is the complete cleanup; no catch/assertion/rule/ignore changes. `lint-cleanup/browser-null.mjs.before.txt` captures **executed** harness SHA256 **1593a8900f9b7c84121ad80ac41889cb73b7d5aa0ad6006ade67a888938ac1b2**. Current lint-clean harness SHA256 **451c16cab4d87da410b51c4ccc016c75e1106ee1a2315cc94c8954f826dab35e** was syntax-checked, **not the hash used by the retained browser runs**. Old source-binding.json and Luna evidence unchanged; `source-binding-current.json` records both identities. Historical prepare-browser.py is not a rerun command; it generated the pre-cleanup harness and would reintroduce the import.

## Actual fresh release artifact

Executed `release/build.mjs` under pinned Node24/private explicit token-free HOME/XDG/npm cache/SHELL=/bin/bash, public **SANITY_STUDIO_PREVIEW_ORIGIN=https://olaproject-chi.vercel.app**, installed `sanity build --no-auto-updates --yes`, exit0. New isolated production fixture **/workspace/.local-tools/ola-qa/sanity-home-click-null-production**; no root dist, localhost test fixture or prior356-file production baseline overwritten.

`release/release-inputs.json` binds5current Studio files: config new hash above; other4match previous accepted source. Build rechecks inputs before/after, records356regular nonsymlink public-output files, no env/docs/secrets/node_modules payloads. Three compiled JS production-origin witnesses. Changed entry:

- `static/sanity-Dk9rTyBH.js`,25904bytes, SHA256 **8a08c8bac36b94141e86286057d10471161033025ec773819242649c4fa8183a**.
- Other two production-origin witnesses remain exact8429f3bf... and229d74e0...; complete names/sizes/hashes in build-binding.
- **Release output/source manifest SHA256:2b13a1c54bde96269c857aa73787ea6ce58d65fc2ed7f11011c22c7e35e86524** (`release/build-binding.json`). Build log `release/build.log`.

No standalone Sanity deployment BuildID/new activeDeployment is invented: those hosting metadata identities are not created/returned by this local build. Manifest SHA256 and entry asset identify the actual prepared release.

## New source-bound guarded hosting context — prepared, not executed

`release/deploy-candidate/{core.mjs,runtime.mjs,candidate-binding.json}` copies the actual reviewed HOST-R1-corrected hosting helper. Changes are **four literal task/output/workspace paths only**: new WORK; own release evidence directory; production dist; production source-copy path. Same356count, fixed supported deployment.appId for existingappxxpedejjvg9va6r4u8t4llzw/zhn2ddaj/production/ola-studio-zhn2ddaj; same opaque loader, minimal env, safe serialization, exact pre/post GET, one child CLI, no-create/no-relink/no-retry semantics and strict canonical full asset readback. No new transport/security logic or framework. No old approval/execution copied.

`release/deploy-candidate/provenance/` contains byte-preserved reviewed core/runtime, exact `paths-only.diff` and reuse note. New binding contains current release manifest/5input manifest, helper files and unchanged selected installed CLI witnesses + original review2provenance. **New deployment candidate binding SHA256:3abce726a273b849b289a79accef8c362a6d09fec2212df897a3c6e1e42e136b**.

**Actual new Supervisor approval at this new candidate location is required.** Old7c0221...approval remains consumed/old-source and cannot authorize this update. No new approval fabricated; neither new nor old runtime executed. Supervisor must consider current click fix, Luna proof, new release/source/output binding and path-only helper delta. Existing28offline serializer/target controls are retained reuse evidence, not newly rerun; no repeat is requested solely for path substitution. If reviewer finds a material security change beyond this exact delta, return it for bounded checks before credential use.

Known old manifest-delivery mismatch remains historical unresolved evidence; strict readback is not weakened or exempted. A later accepted hosting attempt must stop NOT_VERIFIED on readback failure, including the existing wrapper's known lack of partial failing-resource capture; no automatic redeploy/cache workaround. This preparation itself performs no hosting/readback request.

## Luna next — ONLY root lint

From `/workspace`, preserve a new log without overwriting earlier failed lint evidence:

```bash
(set -o noclobber; env -i PATH=/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin HOME=/workspace/.local-tools/ola-qa/home XDG_CONFIG_HOME=/workspace/.local-tools/ola-qa/home/config XDG_CACHE_HOME=/workspace/.local-tools/ola-qa/cache npm_config_cache=/workspace/.local-tools/ola-qa/cache/npm SHELL=/bin/bash NODE_DISABLE_COMPILE_CACHE=1 /workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node /usr/local/lib/node_modules/npm/bin/npm-cli.js run lint > docs/qa/quality/sanity-home-click-null-001/luna-verification/root-lint-after-import-cleanup.log 2>&1)
```

No37-case/browser rerun by Sol or requested merely for an unused import. Actual lint success remains unknown until Luna result. Supervisor gate follows green check; future exact hosting execution is separate and not permitted by this addendum alone.

## Own accounting / limits

Same coherent original executor task OLA-SANITY-HOME-CLICK-NULL-001, childONLINE, HIGH, actual Sol Supervisor review_required. Visible gpt-6.1-sol/openai-codex unchanged; current fallback/usage/cost/duration unknown pending parent completion. Lead-reported Luna delegationc573c3d6 gpt-6-luna20API309.24schild/309.55sbatch preserved as historical verification metadata. No parent takeover. One confirmed QA unused-import defect corrected; actual production fix unchanged. Product root-cause diagnosis and before/after evidence not rewritten as earlier acceptance. This addendum includes own final accounting.

Actual executor checks here: import-only edit, static Node checks,5input equality checks, one fresh isolated token-free production build exit0, new bound path-only deployment-context preparation. No mechanical lint/unit/browser rerun, credentials/env read/stat/hash/load, API/cache/metadata/activation query, deploy/content/role/CORS/setting mutation, Gitindex/stage/commit/push, old helper/binding/receipt/reservation changes, package/test-suite/source UI/OS/Hermes/model/provider/install changes, other agents or Supervisor call. Owner website Git/Vercel404 remains distinct and unanswered; owner authenticated Studio editing/content permission still unverified. No hosted fix, allgreen/global acceptance or100%manager-ready claim.
