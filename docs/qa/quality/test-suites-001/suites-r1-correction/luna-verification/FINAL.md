# SUITES-R1 — Luna bounded validation

**Scoped result: PASS.** Pinned Node24 command selected one desktop case, `en: six normal pages retain meaningful raw SSR, no-JS and hydration`; Playwright reports 1 passed, 0 skipped/unexpected/flaky (case 16.411 s; invocation 18.553 s). Fresh private webpack build ID `Ap4zT811UU0BwXYzuKRWH` (compile 38.6 s; TS 13.2 s; static pages 3.1 s).

Actual private origin: `http://127.0.0.1:45190`, webServer readiness URL `/en`, `reuseExistingServer:false`. The six raw-request, no-JS page and hydrated-page destinations are recorded in `request-targets.json`: `/en`, `/en/about`, `/en/bouquets`, `/en/weddings-events`, `/en/balloons`, `/en/contact`, all on the private origin. The running case asserts each response is 200, checks SSR/no-JS content and image responses; all assertions passed. Build HTML first-image paths are also recorded. Passing Playwright JSON has no per-request trace attachment (trace policy is retain-on-failure); destination evidence is from the executed spec, captured config/report and owned build artifact, not a wire-level trace. No request went to port 3100.

Independent root checks: strict `npm run lint` exit 0; `tsc --noEmit --incremental false` exit 0/no diagnostics. No typegen or root build. After normal Playwright teardown, port 45190 had no TCP entries and accepted an ordinary bind. Source binding hashes matched all seven packet values; see `source-binding.json`.

Evidence and command accounting: `checks.json`, `accounting.json`, `logs/`, `request-targets.json`; full owned run `/workspace/.local-tools/ola-qa/test-suite-runs/run-Gd3j9Z/`.

This is one bounded product case, **not** full-suite acceptance. The prior Supervisor FAIL, 473/228/1 historical result, and outstanding cases remain unchanged; actual independent Supervisor review is still required.
