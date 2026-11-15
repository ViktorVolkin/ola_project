# Balloons — independent review disposition and hit-area correction

**Status: CONFIRMED POINTER-REGION ISSUE FIXED / PARENT CORRECTION GATES PASS / NARROW STATIC RECHECK ACCEPTED.** This is not whole-site/current404 or owner visual/release acceptance.

## Independent review assessment

Review `deleg_3518e7e2` reported `passed:true` while also returning three `confirmed_findings`; its requested SHA256 values were not present in the delivered JSON (only a claim that they appeared elsewhere). The parent does not accept that inconsistent verdict as final snapshot approval.

1. **Expanded Favourite action overlaps the preceding title:** reproduced in a real production browser by a new test before changing code. At768px the old centred44px pseudo-region began above each title's bottom edge. Although titles are not competing interactive targets, the region should not intercept their content. This concern is accepted and fixed.
2. **Ask-about-sets target might be too small:** not confirmed. Shared `ActionLink.module.css:19` already gives the text variant min-height44px; `.ask` does not override it. A redundant pseudo-element is unnecessary. No UI change made.
3. **display:contents might lose grouping:** not confirmed as a defect. `BalloonsPersonalisationBlock.tsx:39-64` retains semantic ul/li, the wrapper is an unlabelled div with no role, and DOM label/action order matches the visual order. Existing locale wrapping/keyboard checks pass. This is not a full screen-reader audit or a claim that display:contents is universally harmless.

The earlier source review's security/logic PASS remains limited evidence for unchanged server/content/shared paths, not blanket final visual approval.

## Minimal fix

Only `BalloonsFavouritesBlock.module.css` changed in product code: the transparent44px `::after` now starts at `top:0`, with no negative centring transform, and expands **down** into row whitespace instead of upward over the title. The21px native visual line, caption spacing, reference section heights, photo crops, colors and page structure are unchanged.

New `tests/e2e/balloons-hit-area.spec.ts` checks all four cards for title-region overlap at360/768/1440 in EN/RU/SR. It additionally verifies actual point hit-testing at2px and42px from the action top, not just the CSS height declaration.

## RED/GREEN and current build

- [RED](hit-area-red.log): the new English desktop regression failed specifically on the old tablet overlap. No import/setup failure or changed assertion was used to manufacture RED.
- [GREEN](hit-area-green.log): lint, project typecheck,24 unit tests, production build and **88 relevant E2E cases** passed: hit-region, Balloons, error-shell, navigation, routing and actual-font suites in both desktop/mobile projects.
- [Source identity](hit-area-source.json): build `tkPmIMVr086bzra7oJKy3`,142 source/test/config files, fingerprint `c00bc038375970786bef21027ddcc2b59ef5221bcccb98c227d40c0c8fb24697`.
- Comparison with the preceding shell build finds only this CSS file and the new test changed. No shell, other page, content, shared primitive, dependency or client boundary changed.
- The earlier full212-case shell gate remains historical evidence on its own build. **A new full-site run after this isolated fix is not claimed**, and88 is not added to212. Previous screenshots preserve visual layout evidence; they are not relabeled as new-build captures.

A deliberately narrow final static correction review (`deleg_426d6c97`) failed to return a usable answer after output truncation/continuations: [historical attempt receipt](review-final-attempt.json). No PASS was inferred from that failure and no model/configuration workaround was made.

Later bounded review `deleg_0dd61af6`, second task (index1), returned PASS/no findings for the current Favourites CSS and real hit-area regression test. Parent matched both current hashes against the dispatched/captured snapshot and the correction's source record before accepting only that static correction scope: [final correction receipt](review-correction-final.json). Reviewer did not execute browser/Figma; the actual RED/GREEN evidence remains the parent's earlier build. Current404/full-site and owner/visual/release gates are not closed by this result.

No commit/staging/push/deployment, configuration/auth changes or Figma edits.
