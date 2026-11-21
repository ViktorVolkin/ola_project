# OLA-TEST-SUITES-001 — Luna attempt 7

Executed the requested filtered Action-button command once under pinned Node24 and the approved isolated environment. The fresh private build **passed** (BUILD_ID `6gn8KOKv70Yjqdq60r4vw`; webpack 9.4 s, TypeScript 4.9 s, static pages 1.129 s). Playwright discovered and executed exactly **1** Chromium test; exit **1**, **0 passed / 1 failed / 0 skipped** (duration 8.005 s).

The selector correction worked for the first assertion: the scoped legacy/adopted locator found exactly 2 buttons on `/en`. The test then failed at `browser-smoke.spec.ts:15`: the adopted button's `span` locator matched no element, so `toBeVisible()` timed out after 5 s. It stopped in the `en`/360px pass before later locales and wide-viewport geometry checks. No source or assertion changes and no retry. This is a real new fixture assertion failure; do not infer the remaining locale/geometry checks passed.

Playwright completed its server lifecycle; post-run bind check found owned port 45190 free. Root lint was not repeated because only the test selector changed. Full suite not run; overall acceptance still requires remaining gates and actual Supervisor review.

Evidence: `checks.json`, `logs/action-button-result.txt`, and private run `/workspace/.local-tools/ola-qa/test-suite-runs/run-HFHgQI/` (`summary.json`, `action-button-playwright.json`, trace at the path recorded in checks). Prior attempts/history preserved.
