# OLA-TEST-SUITES-001 — Luna attempt 2

**Outcome: partial verification; not accepted.** No source, tests, package/config, or harness edits. Runtime visible as Luna `gpt-6-luna`; provider unverified. Commands used isolated Node24 and command-local HOME/XDG/native/browser paths, with no `.env` access.

| Stage | Result |
|---|---|
| Actual export regression | PASS: 1/1, 0 failed/skipped; 93.2ms. The test exercises the runner’s actual export seam and verifies one copy, filters, and no-clobber behavior. |
| Actual `smoke` | PASS. Fresh private production build `GjhTpBqo5cII3tDCqOXuU`; Playwright 3/3 locales passed (en/ru/sr), 0 skipped/unexpected/flaky; 9.57s browser duration. |
| Dedicated fixture selection | Build passed (`aPL3qPMd1Yp13SyYntxyT`), but the requested single browser test did **not** run: Playwright “No tests found,” stats expected=0. Treat as FAIL in runner/test selection path, not as a passing fixture. |
| Unit / lint | Previous evidence on unchanged source: 121/121 (14 files, 4.55s), lint exit 0. Not rerun after runner-only correction. |
| Root typecheck | Not run: root `.next` existed; no root typegen. Both isolated builds completed Next’s TypeScript phase successfully. |
| Full suite / aggregation / other families | Unverified. No blind matrix run. |

Smoke command reached a clean private build and browser run after the previous duplicate-copy failure was fixed. The build log showed compile 38.5s, TypeScript 12.2s and static generation 3.0s; these are build phases, not total wall-clock build time. Playwright reported 9.57s. Next emitted a warning that it ignored `/workspace/package-lock.json` because it would include the private HOME; build and tests still passed.

The detail-page case exists in `tests/e2e/bouquet-detail-page.spec.ts` as `server-rendered without JavaScript`. Command selected the valid `detail-page` family, exact file, `chromium`, and exact grep. Runner passed the file basename to Playwright, but Playwright found zero cases. Do not retry through another family or weaken tests; this selection discrepancy needs investigation by the implementation owner.

Evidence: `checks.json`; private summaries/Playwright JSON at `.local-tools/ola-qa/test-suite-runs/run-BxiP6P/summary.json`, `product-playwright.json`, and `.local-tools/ola-qa/test-suite-runs/run-faTEsd/summary.json`, `detail-page-playwright.json`. Previous failed run `run-t5xndu` and attempt-1 evidence remain untouched. Historical 473/228/1 full result remains historical. Known motion/gallery assertions unchanged. No overall readiness or all-tests-pass claim.
