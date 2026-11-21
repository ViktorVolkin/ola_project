# OLA-TEST-SUITES-001 — Luna attempt 6

Bounded fresh-run verification of one selected migration case and one selected Action-button case. No full suite, code/test changes, secret access, or network/cloud action. Both commands used pinned Node24 and the minimal private HOME/XDG/cache/browser environment.

| Family | Result | Build / browser evidence |
|---|---|---|
| Migration | **PASS** — exit 0; 1 passed, 0 skipped/unexpected/flaky | Two independent current-slot builds, IDs `_Y3mIgJ_SrVCuaehN2sjv` and `8I5dtFjR4xoT9F6NbE6Ia`; selected desktop case `en 360: real component interaction and geometry`, 7.34 s browser duration. Each build completed; receipts record same selected source-input map, same `/workspace/node_modules` realpath and matching package-lock bytes. Installed dependency-tree bytes were not attested. |
| Action-button | **FAIL** — exit 1; one test executed, 0 passed, 0 skipped, 1 unexpected | Fresh build `SYpXjMtXOMbEGlXpxjcUo` succeeded (webpack 10.4 s; TS 5.1 s; static generation 0.94 s). Browser case `real disabled EnquiryLink across locales and viewport geometry` reached `/en`, then `browser-smoke.spec.ts:8` expected `locator('button')` count 2 but received 3 (7.55 s). This is a real assertion failure; no test was skipped or relaxed. |

Migration worker log records an initial readiness `fetch failed`, then observed Ready and HTTP 200; it completed the test and normal teardown (owned PID 6353, exit 143). After both runs, permitted bind checks found ports 45190 and 45191 free. Action Playwright got past readiness; the prior 404 diagnostic and standalone warning are not evidence of this case’s cause. Action fixture’s `setRequestLocale` candidate did not prevent the extra-button assertion; its causal relationship remains unproven.

Run artifacts (commands, source receipts, JSON counts): `.local-tools/ola-qa/test-suite-runs/run-lRI1ua/` and `run-SvAov2/`; migration worker output: `run-lRI1ua/migration-evidence/desktop-worker-0.log`. Attempt accounting: `checks.json`.

Full historical 702-case result (473 pass / 228 fail / 1 skipped) remains unchanged; this attempt is not full-suite evidence. Migration normal cleanup was observed; controlled interruption cleanup is unverified. Prior attempts and Action-button diagnostic logs remain preserved. Overall acceptance is **NOT ACCEPTED** pending owner disposition of the actual Action-button failure and actual Supervisor review; no claim of whole-suite pass or deployment readiness.
