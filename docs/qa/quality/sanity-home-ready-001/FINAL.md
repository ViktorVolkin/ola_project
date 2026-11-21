# OLA-SANITY-HOME-READY-001 — corrective local delivery

**Local technical scope: AWAITING_REVIEW. Not accepted, not manager-ready, not deployed.** Actual independent Sol Supervisor gate is unchanged and has not been requested/executed by this implementer. Owner authentication/CORS/import/publish/deployment remain blocked on owner action. This final technical record includes its own recording work and supersedes the *remaining-local-work* lists in CHECKPOINT/CONTINUATION/CONTINUATION-2/CONTINUATION-3, never their historical failures or limits.

## Ownership and correction

Explicit corrective ownership transfer from ended Terra execution to delegated Sol, not a reviewer/fixer chain. Runtime injected **gpt-6.1-sol / openai-codex**, role implementer. Lead did not implement; execution remains delegated. Risk **medium plus explicit actual Sol Supervisor gate**. Confirmed implementation/integration architecture correction, not first-pass success, not parent implementation takeover. No child agents, Supervisor verdict, remote write, credential, routing change or Git mutation.

Previous attempts/counters remain in the checkpoints and original ledger unit. Parent supplied the additional raw history token `deleg_07509e9947API621.89s`; identifier/call-count boundary is not independently confirmed here. Earlier short IDs retain their recorded 32/33/33 API calls and child durations 984.42/425.3/616.19 seconds. Batch durations overlap and are not summed. Own delegation ID, final calls/duration/tokens/cost are unknown until runtime return; no free-cost claim.

The requested `/home/ubuntu/Projects/ola_project` maps to `/workspace` in file tools; terminal reported the requested host path absent and actual cwd `/workspace`. Subsequent terminal work uses that discovered mounted project. Branch `development`, dirty pre-existing tree preserved. No edits to Swiper/Header/other pages/static assets/messages/routes/business data or global/profile configuration. The earlier authorized gallery lint-binding correction and exact generated-only ignores are preserved.

## Root cause and contract

Retained actual pre-correction measurements: hero at 1024 has frame AR **3.078** versus SDK-prepared **1.334**; mobile frame 1.0 versus SDK 1.333; events at 1024 3.298 versus SDK 1.6. Fixed per-role SDK width/height crops were followed by fluid CSS cover and, for balloons, legacy CSS scale/clipping. Existing image identity or one visible focus point did not disprove this double crop.

`takeover/red.log` reproduces the defect deterministically: current pre-fix URL contains guessed `h`, regression fails (1 failed / 4 passed). Three ranked causes were separated by inspection: SDK ratio mismatch (confirmed), legacy position/scale overriding CMS focal composition (confirmed), and mood-rail offscreen measurement (test-coverage defect, not proof of a crop defect).

Minimal replacement:

- Standard `@sanity/image-url@1.2.0` receives the complete image and **width only**. Its pixel-rounded `rect` is exactly the explicit editor crop; no guessed output aspect or server viewport assumption.
- Typed per-image `{src, position}` retains crop-relative hotspot-center placement, normalized using that actual SDK rectangle. Browser `object-fit: cover` alone handles the frame-dependent crop. `object-position` percentages anchor the focus point at the same relative position in each frame; this is not a claim of pixel-identical SDK fixed-frame centering.
- A tiny server-safe HomeCommon prop helper supplies only runtime CSS variables. CSS Module rules apply only to CMS-marked images, overriding legacy position/zoom, including independent mobile-wedding focus. No clientification, resize engine, layout/frame change, replacement asset or dependency addition.
- The explicit crop wins when it excludes the hotspot center. An oversized hotspot region cannot fit every cover frame; the center is retained, not a promise that an arbitrarily large whole region fits. Approved text/gradients still overlay photography. Synthetic small ROIs are tested as regions, not merely one sampled point.
- Invalid/degenerate pixel crops and unsupported formats reject the complete CMS document safely into canonical local fallback. Host/project/dataset restrictions, published-only fetch, timeout and local fallback remain intact.

## Verified local gates

All command environments use existing Node **24.22.3**, command-local HOME/XDG/npm cache, `SHELL=/bin/bash`; Next uses the existing native cache, browser uses existing `PLAYWRIGHT_BROWSERS_PATH`. No install or environment repair.

| Gate | Actual result / evidence under `takeover/` |
|---|---|
| Root configured lint | exit 0, `final-lint.log` (after all new QA scripts) |
| Root project TypeScript | `tsc --noEmit --incremental false` exit 0, `types.log` |
| Configured typecheck without touching root `.next` | `npm run typecheck` in source-identical release fixture exit 0, `configured-typecheck.log` |
| Full units | 11 files, **59/59** passing; `unit.log`; finite bounds, unsupported/degenerate media, crop-relative normalization, 20 focus positions × 7 frame shapes |
| Studio types / lint / build | all exit 0, `studio-{types,lint,build}.log`; existing harmless Next pages-directory warning retained |
| Fresh final Next webpack | release and synthetic exit 0, 23 static pages each; `build-*.log` |
| Real unmocked fallback | EN/RU/SR × 360/768/1024/1440: **12** HTTP 200, no overflow/broken decoded images/browser console/page/request/HTTP errors |
| Canonical fallback preservation | same **12** contexts against previous bound build: image/frame geometry, sources, object-position, transform, headings/actions and **full screenshots pixel-identical** |
| Controlled synthetic published CMS | same **12** contexts, six sections, 13 rendered images per page, **14 unique roles** including alternate mobile wedding; localized titles/alts/disabled labels, same destinations and unavailable-action states |
| Focus/ROI browser proof | **156** actual rendered ROI pixel checks, all pass; smallest detected marker 10 pixels; **9** mobile mood-card checks scroll each card into view; no missing/offscreen scan conflation |
| Production cache | synthetic local published API, genuine Next fetch/ISR with unchanged 60s policy: old HIT → STALE → new HIT; changed title observed at **61426 ms** in this run, **not a guaranteed publication deadline** |
| Seed/import preparation | existing local verifier validates draft identity, 14 existing file URIs and EN/RU/SR fields; no actual upload/import |
| Real API | `public-count.json`: published-perspective `count(*[_type == "homePage"])` is **0**, not a claim of an entirely empty dataset |
| Cleanup | task-owned servers terminated; actual rebind succeeds for 42182–42186, including synthetic API 42184; root server 3100/root `.next` not used |

### Build/source/served binding

- Release fixture `.local-tools/ola-qa/sanity-home-sol-release`, BUILD_ID **`ksZ-MiGUHA9pcGaH3nvTQ`**.
- Synthetic fixture `.local-tools/ola-qa/sanity-home-sol-synthetic`, BUILD_ID **`-xPPatgceHmX9HokII8TR`**. This is explicitly **not release-exact**: its sole production-source difference is the API endpoint in its private adapter, redirected to task-owned localhost. Generated fake images are fulfilled only inside the browser test. No source hostname policy, external DNS, asset upload or production endpoint is altered.
- `source-bindings.json` and `verification-summary.json`: **280** source/public/config/package files match root to release and remain unchanged after build; source witness `1b70cb431e4d299b01f0ab5df28cb451eb9477ef7e6b745b9bbeb6ebc09e8455`. Selected installed package/lock hashes are witnessed, not a full dependency-tree hash.
- `baseline-binding.json`: **279** previous-fixture files match the retained takeover-before bytes/current unchanged files; new prop helper is absent as expected. Previous artifact was not arbitrarily adopted.
- `verification-summary.json` records served JS/CSS/font bytes against exact release build files, BuildIDs, current fixture sizes and cache/raw counts. Sizes after browser/ISR and configured typecheck: release **186259386 bytes**, synthetic **185327651 bytes**, each below 200 MiB, symlinked existing dependencies excluded, no Studio artifacts copied. Actual size can grow with future optimizer/ISR requests.

## Evidence, failures and boundaries

- Original unit `before/` and new inert `takeover/before/*.txt` preserve prior source. `takeover/before/manifest.json`, `takeover-only.diff`, `scoped-integrated.diff`, `studio-current.patch` and `studio-source-manifest.json` distinguish own correction, integrated tracked changes and current untracked Studio source. Earlier unrelated dirty hunks are not claimed as authored here.
- `browser-results.json` has complete raw 36-case data (12 baseline + 12 real release + 12 synthetic), focal rectangles, position/fit/transform, actions, network/console errors and cleanup. Full screenshots and scrolled image ROI screenshots are retained.
- Failed browser attempt 1 used the default absent browser directory; corrected to the existing approved browser cache, no download. Attempt 2's yellow threshold wrongly assumed blue <150: the approved hero gradient lifts that channel. Full screenshot showed the ROI inside frame; final detector checks the geometrically predicted ROI and yellow channel difference under the unchanged overlay. Both failed logs/partial JSON remain; final run is not relabelled first pass.
- Identity helper attempt 1 lacked the same native-cache environment and had an already-exited cleanup-await defect; attempt 2 exposed percent-encoded `[locale]` URL versus filesystem-path mapping. Logs retained; final helper uses the known runtime environment, guarded cleanup and URL decoding. No source/native-binding repair was made.
- Older simulated fixture remains synthetic and untouched, not substituted for the new release build. Single-file tool TypeScript diagnostics are not configured-project results. Build tracing-root/telemetry notices are retained, not suppressed with config changes.

## Owner / Supervisor handoff

1. Actual independent **@supervisor gpt-6.1-sol** reviews this local packet; this implementer does not issue a verdict or call itself Supervisor.
2. Owner chooses the real Studio origin, authorizes that exact CORS origin with credentials, logs in through standard Sanity account flow and confirms project/dataset permissions. Prior Studio CORS boundary remains applicable; unchanged login screen was not rerun just for counts. Do not send secrets in chat.
3. After explicit authorization and checking no conflicting draft exists, use the locally prepared draft/import procedure in `studio/README.md`; import performs real asset uploads/draft writes and is **not executed** here. Review all 14 fields, photo rights and RU/SR draft translations.
4. Owner approves real deployment and publication. Verify actual edit → publish → public site for all locales, images/alt text and mobile/desktop frames, accounting for SWR and failed-regeneration fallback. No exact 60-second live-publication promise, deployed Studio URL, protected preview or live publish proof is claimed.

**Only local technical delivery is awaiting review. Manager readiness/release remain BLOCKED until those independent and owner gates pass.**
