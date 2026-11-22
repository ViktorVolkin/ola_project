# OLA-CMS-ABOUT-001 — local implementation; BLOCKED remaining Studio browser access

**Not complete, not review-ready, not accepted.** Current continuation verified unchanged checkpoint source, completed the one authorized Studio build, and added real About ISR60/empty/outage browser evidence. Official Studio field clicks, mutation-refresh, Home↔About Presentation navigation and empty-singleton UI selection still lack proof because a new browser access boundary stopped that workflow. HIGH actual independent Supervisor gate and separate live Vercel/Studio `not_verified` gate remain.

## Current continuation after owner/Engineer account repair

Owner reported that Engineer's initial account repair targeted profile container e74, not the actual frontend workspace. A separately authorized repair changed **only** passwd/group entries in workspace container `00138c5789f0`, backup `/var/backups/ola-account-20261122T063750Z/`, locked nologin `ola-worker`1001:1001. Executor made no OS/auth/config/permission repair and did not seek another namespace or inaccessible receipt. Minimal native confirmation returned hostname `00138c5789f0`, uid/gid1001 `ola-worker`, pinned Node24 `os.userInfo()` exit0 with the expected private home and nologin shell. Wrong-container history and original ENOENT remain environment history, not a model/product defect.

**Exactly one justified isolated official Studio build** then passed, exit0, 6517ms build phase: `resume-studio-build.log`, command/source/artifact identity in `resume-build.json`. Every checkpoint product/test/schema hash and copied Studio config/manifest/lock was verified unchanged before that build. Original `studio-build.log` remains the failed historical attempt. Prior 191 units/types/three Next builds/nine equal browser pairs are retained evidence for identical source, not rerun or relabelled fresh.

### New actual access boundary — affected Studio workflow stopped

`resume/results.json`, `resume-command-2.log`, `resume/studio-initial.{txt,png}` record the real compiled official Studio shell loading, but its iframe never loaded (frame became `chrome-error://chromewebdata/`). Chromium reported:

```
Access to fetch at 'http://127.0.0.1:36397/…' … from origin
'https://ola-studio-zhn2ddaj.sanity.studio' has been blocked by CORS policy:
Permission was denied for this request to access the `loopback` address space.
```

The synthetic hosted-origin Studio's SSE redirects to the local mock API encountered the browser's address-space access policy. A secondary pageerror was `SecurityError: Failed to read the 'localStorage' property from 'Window': Access is denied for this document.` The harness auth init script runs in frames too; no conclusion that a real owner credential/authentication failed is justified. Studio visible diagnostics were “Unable to connect” / “Could not fetch list items”. **Zero pointer field clicks and zero saved About mutation-refresh cases completed.** Existing SDK automatic reconnects within this one attempt are recorded; no new Studio attempt, permission grant, security flag, CORS/OS/auth workaround, SDK/product patch, proxy-topology investigation or build retry followed the denial.

The synthetic data/auth API boundary was intercepted; this was not a live Studio/Content Lake test. The compiled Studio assets actually served are hashed in `resume/results.json.servedStudioAssets` and checked against `resume-build.json`. Build success does not prove its iframe/editor workflow.

### Independent remaining browser cases completed

The denial does not affect top-level localhost page checks. Those ran separately against unchanged source-bound production build **`vqiZd4dXZiWkH60UgmTfh`**, same existing synthetic API/TLS seams and unchanged `next.revalidate=60`; **no Next rebuild, policy change or new fixture source substitution**.

- `resume-public/results.json` / `resume-public-command.log`: **real ISR60** observed original synthetic published title with `STALE`, then refreshed synthetic title with `HIT`, **68192ms** after upstream change; BUILD_ID readback unchanged. The production fetch revalidation interval was not shortened.
- Same run: empty synthetic published/draft documents produced matching actual local About headings for **EN/RU/SR public and draft**; public had no annotations/status; draft kept exact About singleton annotation and localized status. Public API503 after real cache expiry produced HTTP200 same-language local fallback for all three locales and actual recorded 503 API requests. Screenshots `resume-public/{empty,outage}-public-{en,ru,sr}.png`.
- That run retained **exit1** because a later diagnostic assertion expected one global `[role=alert]`; there were two globally. This is not hidden or called a full PASS. Targeted `resume.mjs outage` / `resume-outage-command.log`, **exit0**, asserted the intended `[data-about-preview] [role=alert]`: exactly one localized product diagnostic in every locale, matching local heading, no page errors. `resume-outage/results.json` retains both global count2 and product count1 plus exact translated status text. No product fix was needed; this corrected only the test target. Screenshots `resume-outage/outage-draft-{en,ru,sr}.png`.

These disjoint completed records are **13 new acceptance cases**: ISR1, empty public3, empty draft3, outage public3, outage draft3. The two runs are not combined as a fictional whole-harness exit0; Studio still has zero completed cases. Fixture-only synthetic documents/secret/auth/image fulfillment remain explicitly simulated, not cloud writes or actual uploaded image proof.

### Continuation cleanup, changes and remaining criteria

The Studio attempt's task-owned Next child **684 exited0**, port41461 rebound; API36397 and TLS34367 rebound. Independent ISR/empty/public-outage run child **988 exited0**, port35191 rebound; targeted draft-outage child **1215 exited0**, port34507 rebound, shared API/TLS ports rebound after each run. Exact cleanup records are in the respective results JSON. No foreign process was signalled. Initial data-module import harness error (`ERR_UNSUPPORTED_RESOLVE_REQUEST`, absolute path imports inside a data URL) is retained in `resume-command.log`; it occurred before server/browser startup and was corrected to explicit file URLs, not a dependency install or access workaround.

Only QA scripts/artifacts and own documentation/accounting changed in this continuation; **no product source/schema/tests/CSS/assets/manifests/locks changed**. Final validation confirmed **234 checkpoint file hashes**, unchanged Next BUILD_ID, **356 Studio build artifacts** and **196 unique actually served Studio assets** matching that build; current root lint and `git diff --check` exited0. Source/build/Studio-served-asset checks and counts are in `resume-validation.json`. Original source binding and all historical failures remain. Runtime injection remains Sol/openai-codex; full timing/tokens/API counters/cost/fallback unknown, aside from measured command phase/ISR intervals.

**Still missing:** actual exact About text/photo pointer clicks over six sections/all locales/seven photo slots; saved-draft transaction/SSE refresh; guarded Home↔About navigation and Home pointer-click parity in official Presentation; explicit empty About singleton UI selection/no-null-crash; independent actual HIGH-risk Sol Supervisor review. No Supervisor requested. Not awaiting_review, not accepted or cloud-ready.

## Historical prior checkpoint: exact blocker and boundaries

`studio-build.log` / `browser-results.json.commands`, exit **1**:

```
SystemError: A system error occurred: uv_os_get_passwd returned ENOENT (no such file or directory)
Code: ERR_SYSTEM_ERROR
```

Read-only diagnosis: installed `studio/node_modules/@sanity/runtime-cli/dist/utils/get-token.js:13` invokes `userInfo().username` before locating local auth configuration. No required credential was requested or guessed; no OS/auth/CLI repair, fake CLI auth token, alternative authentication, config modification, or Studio build retry followed. Studio source typecheck independently exited 0 (`studio-tsc.log`), but that cannot establish actual Studio rendering or editor routing. Empty About document selection and saved-draft mutation refresh remain unverified in the official UI. `CHECKPOINT.md` is the unchanged Terra historical scope blocker; explicit shared authorization and transfer are recorded in `TASK.md`, current blocker in `SOL-CHECKPOINT.md`.

The earlier Home LOCAL PASS receipt does not accept these new shared changes. Vercel/live Studio workflow remains **not_verified**. No deployment, Git writes, dataset/cloud writes, seed/import/upload/save/publish, real credentials, auth shortcut, production custom server/proxy configuration, dependency/lockfile or other-page migration.

## Implementation

- `src/content/sanity/preview-policy.ts`: only `/en`, `/ru`, `/sr`, `/en/about`, `/ru/about`, `/sr/about`. Exact raw predicate rejects trailing slash, extra segments, unsupported locale, encoded/whitespace/malformed/query/hash/open-redirect values. `homePath` is a compatibility alias used by the unchanged disable route. New `previewNavigationPath` validates origin and exact original spelling before accepting SDK navigation, rejecting URL normalization/credentials/query/hash bypasses.
- `src/components/widgets/HomeBlocks/HomeCommon/HomeVisualEditing.tsx`: initialize only on those six paths; validate explicit push/replace/pop destinations. Pop uses validated replace instead of unbounded browser back. Existing origin message guard, refresh and responsive overlay behavior retained. SDK tests mock effects/router/SDK; these are not actual browser history integration proof.
- `src/content/sanity/about.ts`: published identity only; independent same-locale text/alt/label fields; fixed object slots for existing ordered principles/reasons/paragraphs/style photos. Local icons/botanical untouched. Reuses Home's unchanged strict image canonicalization/crop/hotspot implementation for seven shared photo placements. Invalid neighboring fields do not reject valid content; partial images retain widget local assets. Published-only fetch keeps `next.revalidate=60`.
- `src/content/resolver/about.ts`: server-only default/sanity selection with Draft Mode precedence; published then uncached official draft client; same-language draft → published → local fallback, safe missing singleton/outage, categorized diagnostics without reflecting exception/token text.
- `src/content/resolver/source.ts` and minimal `resolver/home.ts` extraction: one existing exact CONTENT_SOURCE selector reused by Home/About; Home retains its previous exported API/behavior.
- About page and six widgets: resolved content/labels/photos/editing metadata via props; exact About singleton paths on existing text/photo elements, draft-only label wrappers. Existing CSS, supplied copy/translations/assets, DOM in public fallback, section composition, image sizing and destinations/actions preserved. Only dynamic CMS crop focus uses image objectPosition as in the existing Home pattern.
- `AboutPreviewStatus.tsx`: reuse existing status styling with About-local EN/RU/SR visible status/error/fallback text, About locale links and the existing safe exit route; no Home-page link semantics.
- `studio/sanity.config.js`: additive About singleton, six actual section groups plus labels, independently localized EN/RU/SR text/alts and seven shared photos, explicit singleton structure selection and three locations. Existing Home schema/auth/preview initial route preserved; optional `mainDocuments` remains absent. No actual Sanity document was created.

## Tests and actual results

All Node commands use `/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node`. Already installed locked isolated dependencies reused from `.local-tools/ola-qa/unified-content-source-001/locked-install/node_modules`; root Rolldown was not repaired or rerun in an install/health campaign. No install or package edits.

| Evidence | Actual execution / result |
|---|---|
| `security-red.log` | First exact allowlist test, before policy change: **3 failed / 20 passed**, all three failures were the required About paths. Genuine policy RED. Other new suites were added as regression coverage after implementation; no test-first claim for them. |
| `commands.json`, `unit.log` | Full isolated `vitest run`: **191/191 tests, 19/19 files, exit 0**, including new About parsing/source, SDK lifecycle/history, exact allowlist and official enable/disable About redirect cases plus existing Home/security regressions. |
| `commands.json`, `typecheck.log`, `tsc.log` | Configured Next `typegen` then project `tsc --noEmit --incremental false`, both **exit 0** on current synchronized isolated source/tests; no evidence-file temporary exclusions. |
| `final-lint.log` | Root configured `eslint --max-warnings=0`, **exit 0**, after QA scripts/evidence changes. Earlier `lint.log` also exit0. |
| `before-build.log`, `default-build.log`, `sanity-build.log` | Three fresh isolated `next build --webpack` executions, **exit 0**, exact commands/times in `browser-results.json.commands`. Next source typecheck included. |
| `studio-tsc.log` | Isolated copied Studio configured TypeScript project, **exit 0**. |
| `studio-build.log` | Actual `sanity build`, **exit 1** with exact environment blocker above. **Zero official Studio clicks**, no actual saved-draft mutation-refresh claim. |

The full unit suite covers default zero fetch, published-only identities and ISR60 options, same-locale partial texts/alts/labels, no cross-locale fallback, canonical shared photos/crop/focus, malformed photos, API failure, missing singleton, both source modes with draft priority, no public preview data, invalid identities, exact Home/About allowlist, unsupported/encoded/malformed paths, origin/secret/query/redirect constraints, SDK route lifecycle and guarded push/replace/pop. Existing official preview-secret, expiry GROQ, trusted Studio and cookie tests remain included, not replaced by bearer mocks.

### Source-bound production browser checks

Run: `PLAYWRIGHT_BROWSERS_PATH=/workspace/.local-tools/ola-qa/browsers <node> docs/qa/quality/cms-about-001/verify.mjs`. Current overall harness **exit 1 solely at required Studio build**, not a whole-harness PASS. Results retain preceding successful assertions, exact commands, raw request metadata and process/port cleanup.

| Build | Identity | Scope |
|---|---|---|
| Current-source prechange baseline | `mS4Ymrb_5ZPdM3sNtpLa5` | Exact About/shared source snapshot before this executor's edits; accepted Home work already present. |
| Current default | `9rrbGDhjOMMY6SJuSh0tX` | CONTENT_SOURCE=default. |
| Current sanity | `vqiZd4dXZiWkH60UgmTfh` | CONTENT_SOURCE=sanity, controlled synthetic published document. |

`browser-results.json` records **48 completed case records**, not 48 independent tests: baseline9, current-default9, current-sanity9, draft-default3, draft-sanity3, public network summaries3, explicit rejected About destination cases10, Home annotation regressions2. Wrong-secret401 and safe About exit are also asserted for both sources but not counted as separate records. No duplicate-run totals are summed.

- Public About EN/RU/SR × **360/768/1440** in both modes: HTTP200, exact local/default or synthetic published title, invalid CMS body field retains actual same-language local body, no preview status/annotation, no overflow or page/console errors. Browser CMS image requests were fulfilled with supplied local photo bytes, not live CDN content.
- Public default recorded **zero** synthetic CMS requests across all nine captures after readiness (both baseline/current). Unit tests independently assert no CMS/preview invocation. Build-time calls are not separately instrumented as a zero-fetch claim.
- **Nine baseline/current pairs**: selected DOM text/headings/links/images/rectangles/object positions equal; full-page PNG SHA-256 equal for every locale/reference width. Full-page screenshots `before-*` / `default-*`; `browser-results.json.comparisons`. This is public fallback/no-design-change evidence, not owner design approval or full accessibility certification.
- Real official Next preview-secret/helper activation directly on `/en/about` under the synthetic consistent-origin production fixture; invalid secret401 and rejected destinations400 in each mode. All three locales in both source modes showed draft title, localized status and >35 About annotations. `story.photo` reached CMS image props and computed crop focus **75% 40%**. Public session and exit showed no annotations/status.
- Home draft navigation after shared change in both modes retained `homePage` hero annotation and overall annotation presence; full existing Home unit suite also passed. No full new Home browser/visual certification.
- Screenshot visual spot inspection: public RU1440 and EN360 contained expected six sections and supplied imagery, no observed missing/clipped section; automated exact comparisons are stronger than these limited spot views.

### Fixture substitutions, limits and provenance

`source-binding.json` contains before/current source hashes, exact changed-file list, eight unchanged About/decorative assets, build IDs, exact endpoint substitutions and an independent readback comparison of every fixture src file: **only documented substitutions differ**. Inert snapshots under `snapshots/*.before.txt` / `*.after.txt`; exact executor diff in `source.diff`. `before-manifest.json` is the initial broad snapshot inventory (also includes copied Studio dependencies); `source-binding.json` is the focused authoritative source binding.

The local fixtures modify **only network seams**: fixed published Sanity endpoint → controlled loopback API, official preview client's apiHost → loopback (same project/dataset and policy). Synthetic secret documents are evaluated by installed GROQ with the actual official query/TTL predicate; no real credentials/data. Seven-photo map and localized content fixture use actual supplied About source/messages; only clearly marked synthetic title values/invalid neighboring fields and validated synthetic image reference exercise overrides. Browser remote CMS photo fulfillment uses existing About story bytes as a **synthetic rendering substitution**, not proof of a real uploaded asset or crop pixel result. Crop URL/focus semantics have unit/DOM checks.

Production fixtures use a **QA-only** Next custom server behind an ephemeral local TLS proxy with consistent declared origin; browser ignores only its self-signed certificate. Product enable route/origin/secret/trustedStudio/CSP/token policies unchanged. This does not prove Vercel behavior, fix the historical stock-next-start+separate-proxy400 topology, or authorize a production custom server. That old limitation was not re-investigated.

### Retained failures and cleanup

- `unit-1.log`: initial fixture lacked scripts; old architecture assertion counted draft status as a seventh About block; crop assertion assumed percent-encoded commas. Corrected fixture integration and assertion semantics, not parser weakening.
- `attempt-2-*`: missing docs fixtures caused two unrelated unit errors; own QA unused imports failed lint; configured tsc exposed the existing Home unsupported-locale test type error. Copied required unchanged fixture docs, removed unused imports, and added `@ts-expect-error` to preserve the exact invalid-locale runtime assertion. Current checks pass.
- `verify-1.log` / `browser-attempt-1.json`: baseline copy source/destination collision, no build/browser cases; mock/TLS ports rebound.
- `verify-2.log` / `browser-attempt-2.json`: tool timeout during unbounded browser image decode after first case. Actual ps/parent/environment confirmed task-owned Chromium root10674, Next child10789; only Chromium root was signalled. Harness finally stopped Next child (exit0) and rebound Next43345/TLS35789/API41889. Browser decode/fonts waits now bounded; original interruption retained.
- `verify-3.log` / `browser-attempt-3.json` / current `browser-results.json`: builds/browser cases succeeded up to Studio environment failure. Every task-owned Next child **11265/11368/11473 exited0**, ports **38683/46301/33845** rebound; TLS34367 and API36397 rebound. No foreign process/PID kill. No task-owned server left serving.

## Current file scope and remaining acceptance

Exact 23 changed/new source/schema/test paths relative to this executor baseline are in `source-binding.json.changed` and `source.diff` (not a Git-HEAD diff, since pre-existing Home edits were preserved). Packet files, own content-source documentation and own ledger/task-routing entry also updated. Shared enable/disable routes, layout, Next config/CSP, preview client, Home parser/preview fetch/content, existing About copy/messages/assets, CSS, manifests and locks were verified unchanged. No other-page source changed.

Still missing: official Studio build/render, exact text/photo clicks for all sections/locales, actual saved-draft mutation-refresh and cross-page SDK navigation in official Presentation, empty-singleton explicit UI selection/no-null-crash, actual independent HIGH-risk Supervisor review. Browser API-outage/empty-document and real About ISR refresh were not executed (unit behavior/options covered); full responsive breakpoint/intermediate matrix and broader Home interactions were not certified. Source/build success and public DOM equality do not close these gates. No await-review/acceptance/cloud-ready claim.

Runtime evidence: current injected **gpt-6.1-sol / openai-codex** executor, prior Terra inspection retained. Downstream route/fallback, API call count, tokens, cost and complete duration **unknown**; no inferred price/quality result. Own final recording work belongs to this same attempt. Lead did not implement/review; no parent takeover or independent Supervisor action claimed.
