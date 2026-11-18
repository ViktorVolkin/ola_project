# OLA-QUALITY-QA-ARTIFACTS-001 — result

**Disposition:** the four reported QA lint offenders were historical one-run artifacts, not active test/runtime inputs. Archived their exact bytes at the paths in [`manifest.md`](manifest.md), verified `cmp` and matching SHA-256 before removing executable-extension copies. No probe executed. No lint rules/configuration/exclusions or package scripts changed.

## Classification evidence

- Root Playwright `playwright.config.ts` uses `testDir: ./tests/e2e`; Vitest includes only `tests/unit/**/*.test.ts`.
- Parent actions-flow Playwright config excludes the orphan `revision-1/finite-measure.spec.ts`, naming only six neighboring specs; its `revision-1` directory held only the snapshot spec.
- The composition report identifies its `page-probe.cjs` as an observational probe previously run against a private build. Other capture files are tied to recorded historical Playwright results whose test directories are configured elsewhere.
- Searches of package/test/script/config references found no active imports or selection of these four files. Recorded reports/review receipts reference them only as history and were not edited.

## Verification (actual)

- Archive `cmp`: pass for all four; post-removal SHA-256 matches pre-removal hashes in manifest.
- `npm run lint` (`eslint --max-warnings=0`): exit 0; 0 errors, 0 warnings.
- `./node_modules/.bin/tsc --noEmit --incremental false`: exit 0 (no Next typegen/build).
- `npm test -- --run`: exit 0; 10 files and 52 tests passed.
- ESLint public API: seven representative handwritten app/QA/test files confirmed not ignored; in-memory `const = ;` negative control produced severity 2, fatal parser error `Variable declaration expected`.
- SHA-256 comparison of all files under `src/` and `tests/` (excluding generated `.next` and dependencies): identical before/after; 250 files.
- Earlier lint-scope receipt recorded the strict baseline as 10 errors / 1 warning, all in these four files. Current run is 0/0 after classification; no handwritten rules were weakened.

No browser/server/build, Root `.next` generation/typegen, or blocked Weddings acceptance action was run. Runtime/token/cost counters unavailable. Medium risk; required independent supervisor review remains pending for this cleanup.
