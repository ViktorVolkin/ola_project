# OLA-MOTION-SCROLL-001 — implementation checkpoint

Status: **incomplete / awaiting remaining QA and required actual Sol Supervisor review**. Medium risk: document scrolling, motion preference, modal focus. Independent of Detail comparison. No new Detail visual approval or release approval.

## Scope and implementation

Server locale layout still renders Header and page children; pass-through client provider creates Lenis only when motion is allowed and mobile dialog is closed; destroys on preference changes, dialog suspension and unmount. Lenis uses native document scrolling, autoRaf, unsynchronized touch, stops inertia on navigation. Motion gives desktop link label hover/tap, menu-trigger tap and a small entrance displacement to the dialog without delaying Radix removal. Reduced-motion snapshot is true on server and live matchMedia on client; displacement disabled under preference. No new route or business behavior.

Node 24.22.2, npm 11.20.0; framer-motion 14.14.0, lenis 1.3.27, motion-dom 14.14.0, motion-utils 14.7.0. Installed official Lenis README and https://motion.dev/docs/react-accessibility consulted. npm install reported 7 moderate vulnerabilities and install-script review warnings; no audit fix attempted. node_modules 536M before and 553M after install (du reported sizes).

Source base HEAD c7182211e3c5ade81c1988c6ec40d601714b2e86 development, with existing unrelated dirty/deleted files preserved. Production BUILD_ID n0U0ZBUWkaQtSsEIhtSjX. Exact source input hashes not collected: an ancillary compound command containing a Python `-c` port check was blocked by command approval; that compound was not retried or bypassed. No Git writes.

## Actual checks

- npm run lint: PASS, including after test edits.
- npm run typecheck: PASS, including after test edits. File-tool isolated TypeScript auto-check produced TS1259 on external zod declarations because it did not use project configuration; configured project gate passed.
- npm test: 7 files / 33 tests passed.
- npm run build: PASS, 20 static pages generated; build precedes only edits to the test file, not application code.
- Playwright combined motion-scroll, navigation, locales, workflow-disclosure: 69 passed / 1 failed of 70. Mobile new test sent Home before End's native scroll finished; observed scrollY 4497. The test was strengthened to wait for actual bottom before Home; rerun motion-scroll: 6/6 passed (desktop and mobile). This is consistent with a race but root cause not independently proven. Combined suite was not rerun after test edit; earlier 64 existing regression cases passed.
- Existing navigation tests cover EN/RU/SR nested Escape, focus trap/restore, modal lock, close/backdrop/link and resize; workflow covers locale/query/hash. New test checks wheel response, live preference destruction/recreation and initial reduced mode, keyboard End/Home/PageDown, direct hash element visibility and modal suspension/restoration. This does not prove smooth interpolation, absence of duplicate RAF, actual hash alignment/focus, back/forward restoration, panel native wheel, touch hardware, or skip-link behavior while Lenis active.

## Remaining gates

Required real-browser static before/after capture comparison, wheel interpolation and preference/RAF cleanup evidence, active-motion keyboard/focus/skip/hash/history, panel wheel/touch checks, and full final rerun remain. Port-free verification was part of the blocked compound and remains unverified; Playwright webServer process was managed by its normal runner. Actual @supervisor on runtime-confirmed Sol has not reviewed; owner/design/release approval remains separate. Known 404 SSR/no-JS issue remains blocked and was not modified. No Figma access attempted. No exhaustive accessibility conformance claim.

Retrospective: the runner's End-to-Home sequence must wait for native scrolling to settle; record the first failure and avoid treating a partial browser pass as final acceptance. The normal rerun cleared the earlier Playwright test-results directory, so the failure trace was not retained; failure details above are from the real runner output.
