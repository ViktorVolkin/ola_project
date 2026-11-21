# OLA-SANITY-STUDIO-DEPLOY-001 — deployed, awaiting independent review

**Deployment executed and read back. Acceptance: AWAITING_REVIEW. Manager readiness: NOT COMPLETE.** Actual Sol Supervisor review is required for this new deployment unit; this implementer has not requested it or issued a verdict.

## Prior local CMS closeout

Read the full actual `../sanity-home-ready-001/supervisor-review-2.json`: **PASS**, actual supervisor / gpt-6.1-sol / openai-codex, CMS-R1 resolved, no findings, whole integrated **LOCAL technical CMS only**. Updated only the original CMS unit's post-review fields to accepted local scope, preserving prior implementation/correction history, review1 FAIL, unknown usage and manager/release limits. Earlier interrupted/429/blocked review attempts are not rewritten into this PASS; the issued actual receipt is the acceptance basis. No full manager-CMS completion or website release is implied.

## Exact deployed target and readback

- Returned and GET-verified Studio entry: **https://ola-studio-zhn2ddaj.sanity.studio/**
- Project **`zhn2ddaj`**, workspace dataset **`production`**.
- Application ID **`xxpedejjvg9va6r4u8t4llzw`**, type `studio`, urlType `internal`, appHost `ola-studio-zhn2ddaj`.
- Exact scoped official SDK GET `/projects/zhn2ddaj/user-applications?appHost=ola-studio-zhn2ddaj&appType=studio` confirms ID, host and project (`app-readback.json`).
- Hosting returns **HTTP302** to **https://www.sanity.io/@obdulf8du/studio/xxpedejjvg9va6r4u8t4llzw**. Browser follows to the standard Sanity account login, final **HTTP200**, with “Log in to your account” visible. This is an actual hosted authentication boundary, not an HTTP200 claim for the original Studio root or an authenticated editor test.
- **338 public output files** return HTTP200 and match local deployed bytes/SHA256 exactly. The sole remaining local file, `index.html`, correctly returns **HTTP301 → `/`**, then the hosting/Dashboard302 flow. Its hosted body is not represented as the uploaded HTML bytes.
- All **339 local public-output files** and the downloaded HTTP bodies were scanned in the dedicated runtime against the exact token, with no match. In particular all served JS/CSS/schema/manifest assets match the token-free local files. `static/create-manifest.json` is one of the exact remote matches and declares Studio6.24.0, `zhn2ddaj`, `production`, workspace `default`, title `OLA Home`.

No content document, draft, image-asset import, dataset mutation or website deployment was performed. No explicit CORS mutation was requested; backend automatic hosting effects are not established. The CLI did create this authorized hosting app/hostname, upload its standard built output and deploy **1/1 schema** plus Studio manifests—the explicitly authorized deployment metadata operations, not content import/publication. No hostname conflict occurred and no alternate host/project was chosen.

## Source, toolchain and pinned policy

Before deployment, checked **292 reviewed witnesses**: complete280-path source/public/config/package inventory, five selected dependency witnesses and seven Studio source/config/lock/README/seed witnesses. Checked again after deployment; all equal. No source/config/schema/CSS/dependency changes were needed. These selected witnesses are not a complete installed dependency-tree attestation.

Existing Node **24.22.3**, npm CLI `/usr/local/lib/node_modules/npm/bin/npm-cli.js`, documented command-local HOME/XDG/cache and `SHELL=/bin/bash`; no install, upgrade, OS/identity/permission/native/profile/global configuration change. Installed Sanity Studio **6.24.0** resolves installed official **@sanity/cli8.32.0**; installed package versions match the existing Studio lock. This is not a newly downloaded CLI.

Read current official deployment/CLI/environment-variable docs and the installed deploy/build/target-resolution/API/auto-update source. The installed default is auto-updates false; additionally passed supported `--no-auto-updates` for build and deploy, retaining its deprecation warning. No new auto-update policy was enabled; deploy payload confirms `isAutoUpdating:false`, version6.24.0. No appId/config auto-edit was performed.

Actual sanitized child commands, cwd `studio/`:

1. Installed `sanity deploy --help` / `build --help`: exit0.
2. Studio `tsc --noEmit --incremental false`, scoped configured ESLint: exit0.
3. `sanity build --no-auto-updates --yes`: exit0 **without the credential in build env**.
4. **One and only one** cloud deployment: `sanity deploy dist --url ola-studio-zhn2ddaj --no-build --no-auto-updates --schema-required --yes --json`: exit0.
5. Configured root lint after new helpers: exit0. No root `.next`, server3100, other frontend build or local server used. Task-owned Playwright browser was closed normally.

Do **not** rerun `deploy.mjs` as an audit command: it performs a real deployment. `readback.mjs` and `finalize-readback.mjs` do not invoke deployment.

## Credential boundary

Only metadata was inspected by ordinary tools/launcher checks: approved exact file is regular/non-symlink, mode600, UID/GID1001. A dedicated Node runtime loader opens that exact file read-only with `O_NOFOLLOW`, rechecks descriptor metadata and parses it only in memory; accepts **only** the `SANITY_AUTH_TOKEN` variable name. The token's contents/hash/length/prefix were never returned to tools, conversation or evidence.

The deployment child receives a minimal explicit env with the token only as `SANITY_AUTH_TOKEN`, never an argument, `SANITY_STUDIO_` or `NEXT_PUBLIC_` variable. Child stdout/stderr are held in memory and redacted against the runtime token (and encoded forms) **before** persistence/output. Dedicated readback runtime used the value only for authorized exact-value public-artifact checks. No source export or path traversal/hash of `.local-tools/secrets`; no raw tee/debug/env dump. The credential was not entered into the browser, CLI login or source. No new credentials or privilege escalation.

## Retained verification corrections

The CLI deployment succeeded first execution. Two **own verifier assumptions**, not cloud deployment failures, were corrected without redeployment:

- Initial helper required same-origin HTTP200; actual successful hosting intentionally redirects to Dashboard/login. `operation-error.json` is retained.
- Readback required byte-identical `index.html`; actual canonical301 is expected. `readback-error.json` and the original339-row asset observations are retained. After two failures, reassessed the HTTP contract; did not retry the same method or repeat the338 successful downloads. Finalizer reconciles the single canonical redirect, rehashes local expected artifacts, and captures the browser login.

`deploy.log` and all child logs are sanitized. `deployment-outcome.json`, `deployed-assets.json`, `app-readback.json`, `browser-boundary.json`, `hosted-login.png`, `verification-summary.json`, before snapshots and `own-ledger.diff` provide the packet. Only the two explicitly owned ledger units changed; other executor accounting remains byte-equivalent when parsed.

## Remaining owner and review gates

No Google/email/SSO sign-in was attempted. Browser vault listing was empty; no credentials requested or filled. Authenticated HomePage editor and post-login CORS/data permissions remain untested. No CORS warning was reached before account login and no CORS setting was changed; backend automatic CORS effects of hosting are **not established**. If an actual origin warning appears after owner login, report its exact origin first. The deployed Studio origin is `https://ola-studio-zhn2ddaj.sanity.studio`; an owner-approved Studio CORS entry would require credentials enabled, but no entry is assumed or added here.

Owner still needs account access, authorized import/upload conflict checks, fourteen photo fields/rights and RU/SR editorial approval, then actual publication and edit→publish→public-site validation. Deployment alone does not complete that flow or guarantee a60second cache deadline.

Executor runtime actual **gpt-6.1-sol/openai-codex**, delegated implementation; medium risk, explicit actual independent Sol review required. Own final usage counters/prices are unknown until runtime return. No first-pass acceptance or independent PASS for this deployment is invented.
