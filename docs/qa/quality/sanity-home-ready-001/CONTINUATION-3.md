# Continuation 3 — simulated populated CMS and seed preparation

**Not technically ready; do not request Supervisor acceptance.** Earlier history remains in CHECKPOINT.md, CONTINUATION.md and CONTINUATION-2.md. Attempt `deleg_754a0e1e`: 33 API calls; 616.19 s child and 616.4 s batch overlap, not additive; cost unknown. Runtime injected gpt-6.1-terra/openai-codex.

## Real public data and fallback

A public published-perspective GET `count(*[_type == "homePage"])` returned `0`; this is not evidence that the entire dataset is empty. The previously built fallback matrix is distinct: logs show fallback, but do not identify the individual response reason. Unchanged source/config across 279 files and both package/lock/config files against retained Next fixture is recorded in `source-fixture-identity.json`, BUILD_ID `HBRNjlNqWneLDTF57mG9k`, aggregate source witness `4025414b034bc441064be32ebd85b72ce931b091d1a5c1b3c5280f4b6a45259f`; selected dependency hashes are included. It is not a full node_modules hash. `scoped-current.diff` contains tracked scoped changes, including previously dirty CSS changes; it is not proof all hunks were authored by this task. Untracked Studio and adapter files are not in that Git diff.

## Explicitly simulated fixture

A second isolated build `J6TFtdv_ggphi-Y6Bigbe` (180 MiB `du -sh`) substitutes **only the fetch function inside the private fixture**, never production; `prepare-simulation.mjs` makes a synthetic complete document with 14 fake asset references and locale-marked fields. Browser-only interception serves a colored local synthetic image transformed from the SDK `rect` parameter; no fake assets were uploaded and no DNS, production hostname policy or API endpoint was changed. `browser-simulated.mjs` results: EN/RU/SR × 360/768/1024/1440, 12 HTTP 200, 12 localized headings and 13 visible image elements each, correct marked alt strings, no document overflow or browser errors; `simulated-results.json` and screenshots retain raw geometry. Browser requested 6–7 distinct optimizer URLs per page because images are reused, not 13 distinct requests. First run exited 1 on an incorrect assumption of >=10 requests; original observations are in `simulated-first-results.json`. Corrected assertion requires 13 image elements, their correct locale alts, synthetic URLs and decoded images; second run exit 0.

Synthetic yellow hotspot is visible in the EN mobile hero and scrolled bright card screenshot. A separate automated full-page pixel scan `measure-hotspot.mjs` exited 1: at 360 the bright/natural mood-rail items were clipped/offscreen in all locales, so its missing-yellow result cannot distinguish an error from the expected horizontal rail clipping. `simulated-hotspot-pixels.json` retains the failed output; scroll-specific screenshots were subsequently captured, but no complete pixel-validation rerun was made. Do not call whole-matrix crop/hotspot PASS.

**Unresolved geometry risk:** `simulated-ratio-measurements.json` measures mobile hero box 1.0 vs SDK output 1.333; 1024 hero 3.078 vs 1.334 and events 3.298 vs 1.6. The fixed server aspect first crops then CSS cover crops again, and CSS position varies by breakpoint; the single synthetic center-height hotspot remaining visible does not prove arbitrary valid hotspot survives. Role ratios need responsive-safe handling and pixel tests at actual target positions before acceptance.

## Cache behavior

Retained production prerender manifest gives `/en` `initialRevalidateSeconds: 60`; `served-headers.txt` shows `x-nextjs-cache: STALE`, `s-maxage=60, stale-while-revalidate=31535940`. This demonstrates configured stale-while-revalidate behavior of this build, not an upper bound of 60 seconds or a live publication-to-site guarantee. Stale may be served while regeneration occurs, and external cache/failures can extend delay. Real publish/update remains untested.

## Seed and manager gate

`studio/scripts/prepare-seed.mjs` now writes local draft NDJSON containing 14 local `_sanityAsset` image file URIs, plus a manifest. Local dry-run and `verify-seed.mjs` validated identity, 14 existing paths and EN/RU/SR exemplar fields; no remote upload/write occurred. `studio/README.md` documents CLI command whose syntax was checked via installed Sanity `datasets import --help`; an initial guessed CLI module path failed MODULE_NOT_FOUND, then installed package's actual bin succeeded. Import itself, draft creation, uploads, CORS, login, deployment and publication remain untested and owner-led. Imported RU/SR remains draft editorial text. No credentials collected.

Final configured root lint exit 0; full unit suite 11 files/56 tests exit 0 including added hotspot-only URL difference assertion. Simulated server SIGTERM exit/rebind verified inside its harness. No actual owner publication or Sol Supervisor review; never call this accepted or manager-ready.
