# OLA-SANITY-HOME-READY-001 — incomplete implementation checkpoint

This supersedes the scope, not the historical outcome, of `../sanity-hero-pilot-001/blocked.md`. No acceptance or manager-ready claim. Runtime gpt-6.1-terra / openai-codex; risk medium; actual independent gpt-6.1-sol Supervisor review not requested. Earlier preparation attempts deleg_c780b4f8 (111.27s) and deleg_89366e85 (7.46s) incomplete; not provider failures. Current duration/cost unknown.

## Implemented but not complete

- Studio schema contains structured localized fixed sections, 14 image fields, required validation and a singleton structure. Standard Sanity authentication only. TypeScript implicit-any defects corrected. `studio/dist` is a built artifact, not proven deploy-ready/editor-ready.
- `src/content/sanity/home.ts` requests only `_id == homePage` with published perspective, 3s timeout and 60s revalidate, validates all three locales and all fields, constructs allowlisted CDN URLs from image refs, logs and falls back as a whole on failure. All six blocks accept image overrides, retaining existing local assets and routes as fallback; the existing home copy and messages remain intact. React text escaping is retained, with angle-bracket text rejected.
- **Known missing feature:** crop/hotspot currently rejected (local fallback) rather than honoured. Actual publication update delay is not verified; 60s fetch revalidation alone does not establish page caching behavior. No initial import/seed script, editor published-site link, Studio browser check or real publication test. Labels need manager-friendly titles and translations of the UI itself need review. Tests use synthetic documents; no claim about actual live content.
- No credentials, remote writes, deployment, asset uploads, user tokens, protected preview or webhook. RU/SR remain translation drafts. Do not hand over to a manager.

## Checks performed

- Command-local Node 24.22.3/npm 11.20.0 HOME/XDG/cache, SHELL=/bin/bash for Studio: Studio typecheck exit 0 and Studio build exit 0; Studio lint initially timed out while traversing built `dist` (124), then after scoping lint to both actual Studio JS files exit 0 (Next pages-directory warning).
- Root `tsc --noEmit --incremental false`, focused ESLint and targeted synthetic fixture 3/3 all exit 0 after the final image guard. Full unit suite 11 files / 55 tests exit 0 before that guard; repeat full suite on final tree.
- Root configured lint timed out while linting Studio dist, then after adding only `studio/dist/**` generated-output ignore it failed exit 1 scanning existing `.local-tools` Chromium and `docs/qa/quality/gallery-swiper-001/pack-stage/verified-package` vendor evidence (650 errors/2487 warnings). No broad ignore of active code was added. Full raw output is in terminal tool output cache, not a project artifact.
- Single-file automatic checker invoked by file tools is not the configured project TypeScript check; its module-resolution failures do not establish a root typecheck failure.

## Remaining before review

Implement correct bounded image crop/hotspot rendering and test browser composition; deterministic seed/import plan; exact validated production build in a private <=200 MiB fixture with source/build/served identities, real Studio login-boundary browser, live-empty-dataset fallback and distinct simulated-populated browser coverage EN/RU/SR at 360/768/1440 and intermediate widths, console/hydration/images/links/geometry; rerun configured lint in correctly isolated source export, types, unit suite and Studio checks after final changes; dependency hashes/counts and provenance, owned-port cleanup; security/static tests and deterministic published refresh behavior. No real edit-publish-site test is possible without owner authentication/deployment; Lead must guide owner securely and configure allowed CORS origins, then validate actual publication. Actual Supervisor review remains mandatory, separate from owner approval. Known 404 SSR framework gate stays separate and must not be weakened.

Before snapshots and hashes are in `before/`; root package/lock, node_modules lock and @swc/wasm package hashes after these edits match the captured before hashes. No Git writes. This checkpoint does not assert full dependency-byte preservation.
