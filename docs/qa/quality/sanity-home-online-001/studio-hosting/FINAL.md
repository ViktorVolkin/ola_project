# Studio hosting update — secure handoff before credential use

**BUILD PASS; HOSTING WRITE BLOCKED pending independent review of the required deployment-wrapper adaptation. No real credential consumed and no deployment attempted.** This is a new hosting phase after actual online local Supervisor PASS, not a reversal of that PASS or a global-suite prerequisite.

## Authorization and source

Current visible runtime: `gpt-6.1-sol / openai-codex`, delegated executor; completion/fallback/per-call metadata remains for parent reconciliation. Loaded/read current online actual Supervisor receipt `../supervisor-review-1.json` and prior hosting `../../sanity-studio-deploy-001/{FINAL.md,supervisor-review-1.json,safe-launcher.mjs,prepare.mjs,deploy.mjs,readback.mjs,finalize-readback.mjs}`. Owner authorizes only updating existing Studio hosting, not content writes, Vercel upload/Git or creation of another app. Global runner acceptance remains separate and does not block the independently accepted Studio source.

`build.mjs` compared all five Studio inputs against the online recorded manifest accepted by current Supervisor. All match, before and after build: `sanity.config.js`, `sanity.cli.js`, `package.json`, `package-lock.json`, `tsconfig.json`. Only these allowlisted source files were copied into `.local-tools/ola-qa/sanity-home-online-hosting`; installed Studio dependencies are a local symlink, not copied/uploaded. No localmock Studio or synthetic API patches used; root `studio/dist`, root `.next`,3100 and prior fixtures untouched.

## Actual completed build

Executed under pinned Node24.22.3, explicit token-free private HOME/XDG/npm cache, `SHELL=/bin/bash`, `CI=true`:

```
/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node node_modules/sanity/bin/sanity build --no-auto-updates --yes
```

Cwd `/workspace/.local-tools/ola-qa/sanity-home-online-hosting`; public build variable explicitly `SANITY_STUDIO_PREVIEW_ORIGIN=https://olaproject-chi.vercel.app`. Build exit0. No Viewer/Deploy/public-token variable provided in build env.

`build-binding.json` records source SHA256s and **356** regular output files, exact sizes/hashes, no output symlinks or forbidden env/secrets/docs/node_modules paths. Three public JS files contain the production origin; these are compiled literal witnesses, not a deployed/editor test:

- `static/FormValue-drVsNI6m-BzRMrG5U.js`: `8429f3bffe6ad887e731454b6331855d2278b49dc729cab3ec22ea8a62ce5e69`
- `static/authStore-B09IfFua--OTW4x1n.js`: `229d74e08eef1170b5de2a38dd205c45a79501a2c1bfc1abf31823b6af5fec79`
- `static/sanity-BoXWu92Z.js`: `a0bac1e537c9649f8ae564b518c917bdc7bd2c390d77253d754762c8f70b17c4`

This is a local output manifest, not a final postdeployment manifest: installed CLI may generate schema/tools/create-manifest files during hosting deployment. No token-specific scan is claimed without authorized opaque runtime use. No duplicate units/lint/mock/full browser tests run.

## Exact blocker: unchanged reviewed helper cannot safely serve this write

Old deployment implementation is reviewed, but not parameterized for this phase:

1. `safe-launcher.mjs:4,9,15-19` binds output writes to the old QA packet, cwd to root `studio`, identity to the old pre-Presentation CMS packet and dist to root `studio/dist`.
2. `deploy.mjs:14-17` reads old `build-approved.json`, requires old reviewed witnesses, scans root dist and invokes deployment from root Studio. Reusing it would select the wrong build or require overwriting preserved old evidence/root dist, both prohibited. Do not execute it as a probe.
3. `deploy.mjs:12,18-22` reads application identity **after** deployment, accepts a matching host but does not pin the known existing application ID before writing. The previously approved first deployment could create a hosting app; this phase explicitly forbids creation. We must not rely on a post-write host match as a precondition.
4. `deploy.mjs:23-25` still assumes same-origin200 and byte-identical index; old later readback/finalizer corrects those assumptions, but their paths/counts are old339/338 artifacts. They cannot be reused to certify this356-file output.

Using dynamic interception, rewriting old witnesses, replacing root dist or altering old receipts would bypass rather than reuse the reviewed boundary. A new source/output/target binding and orchestration implementation is security-relevant. Task explicitly requires actual Supervisor review before a materially adapted wrapper consumes the real secret or writes hosting. **No new credential loader or deployment wrapper has been implemented/executed/self-approved here.** The approved opaque loader algorithm can be reused byte-preserved in a future reviewed adapter; this is not a token-role/auth error and no alternate credential path is warranted.

## Bounded adaptation requirements for next approved implementation/review

- Use existing dedicated loader's exact approved-path O_NOFOLLOW/descriptor metadata/`SANITY_AUTH_TOKEN`-only parsing; never expose token, its length/hash/prefix, or environment. Reuse raw/URI/base64 redaction before every output/error persistence, including provider failures. Keep build token-free.
- Bind the current online Studio source witnesses and this exact isolated public output set; recheck immediately before write. Use task-owned QA paths, not historical QA or root dist. No copying/uploading enclosing private fixture, node_modules or secrets.
- Within the reviewed opaque credential runtime perform **GET before write** `/projects/zhn2ddaj/user-applications?appHost=ola-studio-zhn2ddaj&appType=studio`; require exactly existing app `xxpedejjvg9va6r4u8t4llzw`, project `zhn2ddaj`, type Studio, exact appHost. Stop on missing/mismatch/permission error; no create/fallback host path. Inspect installed CLI's existing-app target semantics and pin the supported existing app selector, rather than inventing a flag.
- One bounded installed CLI deploy, explicit isolated `dist`, `--no-build --no-auto-updates --schema-required`, exact existing target only, minimal token env and sanitized buffered output. New generated schema/manifests are hosting metadata only; no content mutations.
- Post-write SDK GET exact same application; read back deployment handle and public manifest/schema/bundles. Accept only known index301→root and root302→exact Dashboard app. Compare every public file and its hash (including CLI-generated manifests); prove production preview-origin JS bytes match served output. Token scan local/remote inside opaque runtime; never persist a response before redaction/scan. If readback fails, stop NOT_VERIFIED with no redeployment.
- Synthetic credential/redaction/failure-path tests and actual independent Supervisor review of adapter/source/output/target binding **before real credential execution**. No extra root702/full browser replay needed for this adapter gate.

## Public-only current readback — old deployment, not new proof

`public-existing-readback.json` records actual unauthenticated GETs:

- Studio root302 to `https://www.sanity.io/@obdulf8du/studio/xxpedejjvg9va6r4u8t4llzw`.
- Existing `static/create-manifest.json`200,1007bytes,SHA256 `3e69f1c2712ed72b3e434d8b819ca9818b94a011c883e2ca3b65bfc1a14cfa3b`, exactly the prior hosting-review manifest. It is saved separately as `public-existing-manifest.json`. This establishes the existing public manifest, not an updated deployment.
- Website `/api/draft-mode/enable`404. Website Git deployment is separate, owner-operated; no Vercel access diagnostics or setting writes repeated.

Owner may open the existing Studio URL or Dashboard now, but the newly built Presentation configuration **has not been hosted**. No fresh deployment handle or updated remote asset identity exists to report.

## Own accounting / remaining boundaries

Continuation hosting subphase of `OLA-SANITY-HOME-ONLINE-001`, delegated HIGH credential/cloud boundary, `review_required=true`; delivery BLOCKED at adapter-review prerequisite, independent token-free preparation complete. No parent takeover, source correction or role/auth failure. Existing reviewed helper rigidity is a phase-integration constraint, not a new product defect; do not rewrite prior accepted first deployment. Actual model/provider basis is current visible runtime; usage/cost/duration/fallback unknown until parent completion. Own artifacts only in `studio-hosting/**` plus the task-owned private build; shared ledger/routing and prior evidence untouched.

No secret file content/metadata/hash/load was accessed by this executor, no runtime/provider/Hermes/permission changes, no installs, helper agents, Supervisor call, cloud writes, Google login, CORS changes, seed/import/asset/content saves or publish. No task server started. Global test refactor remains unaccepted; earlier702 suite is not relabelled green. Production Vercel variables remain owner-reported; Viewer capability, owner website Git deployment, standard editor login, exact origin/CORS and authorized real draft-save flow remain unverified. Published Home0 is historical; private draft existence unknown. Content mutations require separate explicit named-target consent.
