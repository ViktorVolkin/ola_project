# Lifecycle regression — OLA-MOTION-SCROLL-001

Production build `.next/BUILD_ID`: `n0U0ZBUWkaQtSsEIhtSjX` (reused, no production source modifications). Node 24.22.2, ordinary configured Next production webServer, Chromium through Playwright; both projects explicitly use the 390×700 mobile viewport to exercise the dialog. Test: `tests/e2e/motion-scroll-lifecycle.spec.ts`.

- `npx playwright test tests/e2e/motion-scroll-lifecycle.spec.ts --project=desktop --workers=1`: exit 0, **1 passed**, 12.5 s; `focused.log`.
- `npx playwright test tests/e2e/motion-scroll-lifecycle.spec.ts --workers=1`: exit 0, **2 passed**, 23.6 s; `projects.log` contains each raw snapshot.

Each project established an idle active baseline, then exercised five reduce/normal and three dialog open/close cycles. Each off transition exercises the provider effect's `lenis.destroy()` cleanup also returned for unmount, but is not an unmount or StrictMode test. Native wheel fallback and resumed scrolling passed; dialog closure restored body pointer events and scrolling.

In both projects, sampled pending RAFs were 1 active and 0 off throughout, with one identified Lenis autoRaf callback active and none off. Its total executions did not increase during any 250 ms off-to-off-later interval. The test does not schedule its own RAF. Window/root listener accounting matches add/remove by target, event type, callback identity and capture. Active baseline and each restored sample had resize=3 and wheel/touchstart/touchmove/touchend/scroll/scrollend/click/pointerdown=1 each; off samples had resize=1 and all other listed counts=0. Listener and RAF samples were bounded and did not grow across these cycles.

Limits: RAF engine attribution uses the observed production callback's `autoRaf` source text; all pending RAFs are separately bounded. Listener coverage is limited to specified event types on window and documentElement; it is not a heap-leak proof. Reduced-state execution observation is bounded to 250 ms. No independent unmount, StrictMode, browser matrix, long-duration or actual Supervisor review claimed. Historical keyboard failure remains unresolved; earlier evidence is preserved. No production lifecycle bug reproduced.

Logical accounting: delegated Terra medium-risk continuation; runtime identifies gpt-6.1-terra / openai-codex, no parent takeover or other agents. Usage and elapsed model time unavailable; no cost inferred. Actual Sol Supervisor review remains required and no overall acceptance is claimed.
