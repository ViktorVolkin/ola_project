# OLA-SANITY-HOME-ONLINE-001 — BEFORE EXTERNAL WRITE

**BLOCKED: authorized Vercel deployment access is not available in the observed environment. No external writes permitted or attempted.** This is a prerequisite checkpoint, not a request to approve deployment now.

## Actual bounded discovery

- Actual injected executor runtime: `gpt-6.1-sol / openai-codex`, active `lead`, delegated executor; completion metadata remains for parent reconciliation. No route/config/model changes or observed fallback.
- Browser `https://vercel.com/dashboard` resolves to `https://vercel.com/login?next=%2Fdashboard`, title `Login – Vercel`; approved `browser_vault(action=list)` returned `success=true, items=[]`. No saved login, password entry, account guessing or alternate connection used. The observed managed browser does not establish whether the owner is signed in elsewhere.
- No `.vercel/project.json`, installed local Vercel executable or PATH `vercel` was found. No account IDs, CLI auth files, browser profiles, environment contents or secrets were searched/read. No CLI was installed.
- Fresh public GETs: `/en`, `/ru`, `/sr` HTTP200; `/api/draft-mode/enable` without parameters HTTP404. This is evidence the public target does not expose the expected preview handler at that path, not an authentication/security verdict or deployed-source attestation.
- Hosted Studio GET follows to the Sanity Dashboard authentication/session boundary, HTTP200; this is NOT an authenticated editor verification.
- Public Sanity query with `perspective=published` returns count **0** for `_type == "homePage" && _id == "homePage"`. No private document fields/drafts were read. This does not prove there is no private draft; earlier owner-reported empty form is not new authenticated evidence.
- Viewer file/token NOT loaded or validated. The approved deploy launcher was inspected as source, not executed: its hardcoded old identity witnesses and deploy-token variable are not suitable for blindly reusing it as a current Viewer loader. No new secret-reading helper was created.

Machine-readable current evidence: `prerequisites.json`; reproducible public-only reader: `prereq_readonly.py`. Initial reader execution failed because a host path used inside Python was not present in Docker. Corrected it to the tool-observed cwd `/workspace`; rerun exited0. Requested workdir/file-tool paths remain `/home/ubuntu/Projects/ola_project`. This was not an access/auth retry or environment repair.

## Current-source technical evidence and limits

Read full historical independent review2 FAIL/security scope and review3 bounded VE-R1 PASS. Owner's current-code authorization is a new forward decision supplied in the task; historical mixed routes/receipts remain unchanged, not retroapproved. No new source defect reproduced or source change justified.

Read Luna's fresh `../sanity-predeploy-verify-001/FINAL.md` and `checks.json`: 121 units/root lint/types/webpack build and isolated Studio checks passed; full Playwright **702 total, 473 passed, 228 failed, 1 skipped**, wrapper124 with completed summary, not all-green. Independent triage remains another executor's responsibility; this task neither reruns nor changes the suite.

Read actual fixture BUILD_ID **`Rp-GZr8-oMAV7SgRiAKIA`** and compared nine explicitly enumerated source/config/package witnesses to current root: all equal, including corrected policy SHA256 `1ce19e22a04e81c43dbe38f9500010aff6c200e72f4085fba60eae3e7b99536f`. This selected comparison is NOT full fixture/dependency/served-asset attestation or new browser acceptance. Old Presentation builds `Jq0Pfx3JwiFT2mrkGaX4o` and `7rGkODMTTRg05y04eG1Cy` stay stale for the URL correction. No current-source official Studio + Next field/photo/save-after-locale flow was run; intentionally stop bounded work at the confirmed deployment-access blocker rather than build an expensive mock substitute.

## Necessary owner action, no secret in chat

1. Open `https://vercel.com/dashboard`, sign in personally using the ordinary Vercel UI, select the existing project actually serving `https://olaproject-chi.vercel.app`, and make its project/access context available to the authorized execution path. Alternatively the owner can operate the UI personally. Do not create a new project/connection or provide a password/token in chat. Project/team IDs and connected Git branch remain UNKNOWN.
2. Before deployment: obtain actual independent `@supervisor` runtime-confirmed `gpt-6.1-sol / openai-codex` review of the current source/configuration/write packet; existing review3 is only the VE-R1 correction, not this release approval. Relevant full-suite failures must be dispositioned by that gate; the executor cannot waive them. No helper-agent or reviewer invocation was attempted here.
3. Only after that approval, in the existing Vercel project's Environment Variables, set intended **Production** server variables explicitly:
   - `SANITY_PREVIEW_ORIGIN=https://olaproject-chi.vercel.app`
   - `SANITY_STUDIO_URL=https://www.sanity.io/@obdulf8du/studio/xxpedejjvg9va6r4u8t4llzw`
   - `SANITY_API_READ_TOKEN`: approved separate Viewer value via secure owner-controlled UI/runtime only; never `NEXT_PUBLIC_*` or `SANITY_STUDIO_*`, never the deployment token. Record variable names/target/type metadata, never values. Credential permission validation remains unperformed; a new opaque helper needs synthetic checks and independent review before real-token use.
4. Vercel variable changes apply only to a **new deployment**. Do not click Redeploy on an old Git revision and call it this dirty tree. Establish the source transport/immutable release identity first. Owner's Git push remains personal and gated by full-green tests; this executor will not push. A separately approved current-source non-Git deployment path is not available yet. Do not apply the production exact-origin config blindly to an unrelated preview hostname.
5. For the later approved Studio build, supply public `SANITY_STUDIO_PREVIEW_ORIGIN=https://olaproject-chi.vercel.app`; build without tokens. Re-review adapted existing safe deploy workflow for current source/target, then deploy only after gate approval. No wildcard CSP/CORS or cookie-policy changes. Normal Google/Sanity login and actual exact-origin CORS/editor permissions remain untested; do not preemptively add origins.
6. Read back exact deployment IDs/URLs, production alias, asset/BuildID source identity and secret-free variable metadata. Check official preview auth/exit/draft isolation, EN/RU/SR field+photo targeting and save after locale change. Actual draft saves require **explicit bounded permission for an existing owner-controlled Home draft or disposable test draft**, not currently granted. Do not seed/import/publish to manufacture success.

## Editorial gate

No published singleton currently exists according to public query. Offline seed preparation is documented in `studio/scripts/prepare-seed.mjs` / `studio/README.md`; no new seed generated or cloud import executed. Initial content, fourteen photo mappings/rights and RU/SR approval remain owner decisions. `studio/README.md` contains historical pre-Presentation/not-deployed wording; use current `takeover/OPERATOR.md` and actual readbacks for current status, do not treat old README wording as a new technical finding. No automatic content creation, upload, save, publish or overwrite is authorized by this checkpoint.

## Reviewer handoff

Technical release packet **NOT READY FOR DEPLOYMENT APPROVAL**: Vercel access, current-source Presentation browser proof, Viewer permission proof, global-suite disposition and controlled cloud mutation permission are missing. A Supervisor may review this prerequisite checkpoint as BLOCKED, but must not infer deployment acceptance. Continue only after the actual missing prerequisite/permission is supplied; no reconnect/model/install/OS/permission repair campaign.

References: official Vercel docs read `https://vercel.com/docs/environment-variables/managing-environment-variables` and `https://vercel.com/docs/deployments`; current local policy/config `.env.example`, `src/content/sanity/preview-policy.ts`, `studio/sanity.config.js`; historical security/review receipts unchanged.
