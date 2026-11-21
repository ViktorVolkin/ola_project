# OLA-SANITY-HOME-VISUAL-EDITING-001 — corrective takeover

**State: awaiting_review — LOCAL ONLY.** HIGH risk; actual independent `@supervisor` on runtime-confirmed `gpt-6.1-sol` is required. This is executor verification, **not Supervisor PASS, manager readiness or release approval**. No deploy/import/upload/publish/CORS/account operations occurred. Public owner origin is `https://olaproject-chi.vercel.app`, initial `/en`, locale homes `/en`, `/ru`, `/sr`; no claim that the public URL serves this revision.

## Identity, source and preserved history

Current injected runtime: delegated implementer `gpt-6.1-sol` / `openai-codex`, not Supervisor. No helper agents, fallback/model/profile/config changes. Current delegation/call/token/cost/duration counters are unexposed. Parent-reported previous `sa-0-c23d8e94`:250calls,6122.8s, max_iterations, unapproved `kilocode/kilo-auto/free` fallback and incomplete execution are retained in the same ledger unit; no downstream-model or free-cost inference. Initial blocked attempt and all previous QA files/receipts remain intact.

Requested `/home/ubuntu/Projects/ola_project` resolves through these Docker tools to `/workspace`, branch `development`, extensively dirty before takeover. No Git mutation/reset/stash/stage occurred. `before-manifest.json` binds55 inert before snapshots; `changes.json`, `after/`, `source.diff` bind this takeover's changes. `audit.mjs` verifies other ledger units unchanged. Existing accepted CMS review2 and Studio deployment review1 were read, not altered.

Takeover product/config/test edits:

- `HomeCommon/HomeVisualEditing.tsx`: component-owned SDK lifecycle instead of module-global mutable router; official `enableVisualEditing` history/refresh kept; all message senders, including parent/opener, must pass exact Studio-origin policy. Home-only effect and cleanup; no client reader credential, unconditional public polling or whole-page client conversion.
- `HomeHeroBlock.tsx` + new `HomeCommon/HomeEditing.module.css`: **draft-only** pointer pass-through on the transparent desktop content container, allowing the real handwritten caption to open its field. Public classes/geometry unchanged.
- `.env.example`: nonsecret exact owner origin and separate server-only `SANITY_API_READ_TOKEN` configuration, plus Studio build origin.
- `tests/unit/sanity-preview-fetch.test.ts`: uncached draft fetch, same-locale partial fallback, fail-closed reader and safe error regressions.
- Own QA packet, same stable ledger unit and pending task-family evidence note. No dependency/config-ignore/CSS redesign/other-page edits in this takeover.

The previous partial implementation's secure helper/routes, Home annotations and Studio section groups were inspected and exercised, not blindly accepted. Final `src/content/sanity/home.ts` differs from the pre-feature canonical adapter **only** by exporting `imagePaths`; audit verifies exact normalized byte equality. Strict published validation,14image roles, crop/hotspot canonicalization, published perspective and60second fetch revalidation remain intact. Manifest/lock/installed `next-sanity13.1.5` and `@sanity/preview-url-secret4.1.5` agree; previous peer addition `styled-components6.6.0` is retained. No dependency installation/removal in takeover; existing Swiper/SWC assets untouched.

## Reproduced defects and correction evidence

1. **RU refresh RED reproduced** with the original mock and actual Studio iframe; EN worked, RU stored draft changed but iframe stayed stale (`browser-red-2.log`). Restarting SDK on locale navigation alone did not fix it (`browser-hypothesis-1.log`); hypothesis change reverted.
2. **Actual fixture root cause:** one Studio transaction containing four patch actions was emitted as incompatible per-patch revisions/events, breaking the official edit-state revision chain after the first edit. Transaction-consistent immutable SSE results restore official mutation notifications. No forced iframe reload, publication, weakened locale refresh assertion or EN-only waiver. SR test also incorrectly compared HTML language to `sr` instead of actual `sr-Latn`.
3. **Actual product hit-test defect:** full-width transparent Container sat above the negative-z-index Hero photo/caption. Saved `elementsFromPoint` shows Container above the handwritten P; click selected `hero.photo`. `browser-handwritten-red.json`/`handwritten-red.png` preserve RED. Draft-only pointer pass-through then opens `hero.handwritten.en/ru/sr` correctly.
4. Full mapping exposed harness scroll timing: hover before iframe scroll settled left stale pointer coordinates. Settled real-pointer movement retains exact path assertions and passes all sections. Image points avoid overlapping handwritten captions. Official image inputs may focus **only the same expected image's `.asset` child**, explicitly checked, not any suffix/neighbor.
5. Visible alternate `meet.handwritten` is tested rather than skipping a hidden first DOM match. Mock asset documents/images, transaction NDJSON and Studio agent SSE response types were corrected; final run explicitly asserts zero Studio console/page/mock errors. All failed logs remain; latest result is not the historical failure file.
6. Own verifier initially mapped encoded `%5Blocale%5D` URL text directly to a filesystem name; decoded path mapping fixed served-asset verification. Failed run retained by timestamped wrapper. Initial browser import-time path failure resolved by command-level existing browser path (no install). Own first lint failed unused import, corrected; final lint is0. Optional bare Studio CLI `build --help` returned `uv_os_get_passwd ENOENT` because it was outside the explicit command environment; abandoned, not used as a result or retried/repaired. Required Studio build had already passed through the explicit-environment harness.

## Fresh local gates

All commands use existing Node **v24.22.3**, explicit approved local HOME/cache/PATH and no inherited credentials. Reproducible helpers are in this folder. Root `.next` and port3100 were not used for serving/building; root types use nonemitting/nonincremental tsc, and configured `next typegen && tsc --noEmit` runs in the exact-source isolated release/synthetic roots to avoid touching root `.next`.

| Gate | Actual result / evidence |
|---|---|
| Configured root lint | `checks.mjs`: `npm run lint`, exit0; `root-lint.log`, `checks.json` |
| Root project types | `tsc --noEmit --incremental false`, exit0; empty raw `root-types.log` plus exit record |
| Full configured root unit suite | **113/113**,14files, exit0; `root-unit.log` |
| Fresh isolated release webpack build + configured typegen/tsc | exit0; `build-release.log`, `configured-types-release.log`, `build-results.json` |
| Fresh isolated synthetic webpack build + configured typegen/tsc | exit0; `build-synthetic.log`, `configured-types-synthetic.log` |
| Studio configured lint/type/build equivalents | all exit0; `studio-lint.log`, `studio-types.log`, `studio-build.log`; build public origin is explicitly local test origin, not a deployed release |
| Actual official Studio/Presentation browser | final `run-browser.mjs` exit0; `browser-final-clean.log`, `browser-results.json`, exact executed script snapshot |
| Public baseline differential |3contexts, exact selected DOM/geometry/photo/label data **and exact PNG hashes**; `public-comparison.json`/`.log` and6fullpage screenshots |
| Source/build/served binding | `audit-results.json`:290source files per build, exact BuildIDs and11served browser JS hashes; sizes below200MiB |

Release BuildID: `Jq0Pfx3JwiFT2mrkGaX4o`. Synthetic BuildID: `7rGkODMTTRg05y04eG1Cy`. Post-browser task fixtures:50,712,660 /47,795,219bytes at audit; Studio and credential folders excluded, node_modules only existing symlink, build-only webpack cache removed. No root `.next` build, no secret/env-file copy or fixture credential file. Synthetic fixture modifications are explicitly limited to local API host and local-origin/CSP allowances in `build-execute.mjs`; **not release source**.

### Actual iframe/editor coverage

Official installed Studio, real Presentation controls, real iframe overlay interaction, actual adjacent input saves and official SDK mutation/refresh channels are exercised. **Only external Sanity API/auth/assets are synthetic local mocks**, clearly labelled. No cloud content/authentication roundtrip is claimed.

-27top-level checks,128unique editor paths:114localized text paths and all14photo roles.
- All six sections, Hero and Meet handwritten variants, translated visible buttons; photos13desktop roles plus distinct mobile wedding role, EN/RU/SR.
-24real form-save→visible-draft-refresh cycles: Hero in3locales plus seven additional section/button fields per locale. Includes Services, Mood, Custom, Extras, Meet, Events and shop button. Navigation occurs **before** RU/SR edits; no publish or iframe reload used to hide stale state.
- Official mobile device toggle yields375px iframe. Wedding mobile actual `currentSrc` is distinct reference000…005 with editor crop `rect=120,40,1020,680`; exact `services.weddingsMobile` field opens in all3locales. `studio-mobile-wedding.png` shows adjacent image form.
- Official helper against actual GROQ evaluation of synthetic secret documents rejects absent/malformed/expired/unknown wrong-project secret, untrusted Studio origin, duplicate/arbitrary-project/query and absolute/protocol-relative/double-encoded redirect attacks; no cookie on rejection. Fixed project/dataset reader config and expiry query verified by unit tests too.
- Actual helper cross-site iframe response sets HttpOnly/Secure/SameSite=None/Partitioned cookies and redirects only `/sr`; separate unauthenticated public contexts remain published-only; Exit clears draft UI/annotations. Missing config503; error payload and served client script synthetic-reader-token checks pass. Untrusted-parent-origin capture is actually tested.
- Public fallback differential against actual prior accepted CMS-R1 release `K6M5DMMgF_2Lx5PLVnEJ3`: EN360/RU1024/SR1440 selected DOM and fullpage PNG byte hashes identical. This preserves measured geometry, photo identity/composition, captions/labels and public absence of overlays; not universal performance/accessibility/design certification or a fresh animation campaign.
- Every owned Next/API/Studio server exits and ports42241/42242/42244/3333 successfully rebind. Differential servers42245/42246 likewise rebind. No arbitrary process kills, root server interference or pending owned handle remains.

## Remaining gates / operator handoff

See `OPERATOR.md` and `.env.example` for exact configuration. Actual separate read-only Viewer credential, authorized Vercel/Studio deployments, real Google-login editor/CORS checks, approved initial seed/photos/rights, RU/SR editorial approval and actual cloud draft/publish→site validation remain **external BLOCKED**. Owner deployment token was not read or used. Public URL reachability does not attest a preview-capable deployed version.

Local implementation is ready only for the required actual independent HIGH-risk Supervisor review. No reviewer was invoked, no self-PASS written, no cloud redeploy authorized. Existing other-site404/Figma/P01 holds are unchanged.
