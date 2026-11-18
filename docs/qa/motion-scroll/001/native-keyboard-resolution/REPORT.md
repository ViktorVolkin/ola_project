# Native reduced-motion keyboard qualification

## Scope and conclusion

Separate from accepted MS-R1 (active Lenis inertia): this scenario emulates reduced motion before load, with no Lenis class. A measured native Chromium input-ordering precondition explains the reproduced symptom: reaching the bottom does not establish that the End scroll has finished; Home sent before document `scrollend` can be ignored, with trusted, unprevented input. The saved original failure trace did not record this event, so its precise timing is not independently provable retroactively and a framework causation claim is not warranted.

## Controls and change

`probe.mjs`, mobile 375×812, reduced motion, 20 fresh documents each: plain HTML 5309px high and actual production `/en#main-content` both have max Y 4497. No waits between endpoint and Home except polling the endpoint; Home remained at 4497 in 18/20 control and 16/20 app. All 40 Home keydowns trusted and unprevented; app root never has Lenis; fonts initially loaded in these observations. `probe-results.json` retains per-frame Y/max, event target, focus, trust, prevention, timestamps, initial images/readiness and root. A 300ms observation follows the 5s endpoint assertion; successful measurements may include ongoing Home scroll during that observation. The plain control is a browser/input precondition check, not a product replica.

`probe-scrollend.mjs`: same 20+20 documents, explicitly wait for document scrollend at End endpoint, then Home zero plus scrollend at zero, then PageDown >100: 20/20 control and 20/20 app. `probe-scrollend-results.json` contains observations. This demonstrates a browser animation-ordering issue on the current Chromium and app build, not a Next version bisection or a guarantee across browsers.

Only `tests/e2e/motion-scroll.spec.ts` changed: retain End, Home and PageDown assertions and use actual scrollend at the corresponding endpoint before issuing the next native key. No fixed-delay replacement, forced scroll, interception, skip or production change. Test SHA256 `913bcf746a1641eae3fee658b67c51751befb40eb8eccc4336931affacfe09ef`.

## All runs and gate status

- Historical independent security combined run remains **127 pass / 1 fail** and focused unchanged rerun 1 pass; old trace and report preserved in `docs/qa/security/next-patch-001/current-integration-20261116T112904Z/`.
- Before changes, one additional focused mobile unchanged run: 1 pass. Diagnostic browser control results as above.
- First post-change repeat attempt did not start: own diagnostic Next server still held port 3100 after wrapper kill. Identified and stopped only that process; no test result. Subsequent first test formulation **40/40** (20 desktop + 20 mobile); strengthened event tracking to match endpoint instead of any scrollend; final formulation **20/20** (10 each). JSON records `focused.json`, `focused-final.json`.
- One final combined six-suite run, default desktop and mobile, two workers, **128 passed, 0 failed/skipped/flaky**, 64 unique cases. `verification.json` programmatically compares all 128 project/file/title IDs with historical security run: exact match. `combined.json` and `combined-results/` retain outputs.
- Root `npm run lint`, `npm run typecheck`, `npm test`: all exit 0; 33 unit tests / 7 files. The file-edit tool's standalone implicit single-file TypeScript check produced existing dependency interop diagnostics; configured project typecheck passes.
- Current Node 24.22.2; installed Next and eslint-config-next 16.4.5, Lenis 1.3.27, framer-motion 14.14.0, React 19.3.0, next-intl 4.14.9. Reused actual production build `_FZae9gZg5s1S4mBVp5yA`. All 298 recorded security candidate input paths compared by SHA256: only the test above differs; package and lock hashes unchanged. No production/dependency change or rebuild in this continuation. This comparison checks recorded paths, not a fresh exhaustive inventory of newly introduced paths.
- Required actual independent Supervisor Sol review remains pending; this is not an acceptance verdict or full security clearance. Known separate SSR/no-JS 404 baseline failures (4 candidate cases) still hold release; 38 normal/font cases green in prior security packet, not rerun here. Original accepted active-Lenis fix and review unchanged.
