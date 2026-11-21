# New 404 — implementation and QA

**Status: UI IMPLEMENTED / FIRST INTEGRATION GATE FAILED / FRAMEWORK SSR BLOCKER OPEN.** Not a completed page, independent-review PASS or public release. See [reproduced no-JS blocker and upstream evidence](ssr-blocker.md).

## Authoritative input and scope

- [Reference/provenance](../../design/not-found-reference.json), [implementation plan](../../design/not-found-implementation-plan.md).
- Desktop/Mobile native geometry was recovered verbatim from earlier successful Figwright responses (session messages4402/4403); Tablet and missing compact typography came from the Lead Designer's existing brief/accepted-snapshot handoff. This is **not** a fresh live Figma inspection. No canvas/configuration changes.
- No photographs: four outlined rings, blush centre, numeral and signature are the approved primitive artwork. Native dimensions and optical numeral corrections are preserved by continuous piecewise ramps.
- Existing explicit no-Footer shell remains unchanged. Normal routes retain Footer. Unsupported locale/global framework fallback routing is not redesigned.

## Implementation

- Server page: `src/components/pages/NotFoundPage.tsx` resolves the page-owned `NotFound` messages and composes a semantic main.
- Server widget/artwork: `src/components/widgets/NotFoundRecovery/NotFoundRecoveryBlock.tsx`, `NotFoundArtwork.tsx`; existing Container/ActionLink/Icon are reused. One H1 and one body paragraph; natural locale-driven growth, no clipping/fixed content heights.
- Only `NotFoundRippleIntro.tsx` is a new client island: server-rendered children, preference listener, one timer and cleanup. Only ring scale/opacity are animated. CSS total3950ms including stagger, lifecycle retires at4000ms; no resize/scroll replay or motion library.
- Widget default/reduced-motion/unsupported lifecycle API is static; mid-intro reduction permanently stops this mounted visit. No visible pause UI or endless loop. **Actual no-JS delivery currently fails before the widget renders because Next16.4.3 serves an empty error shell.** Source-level fallback is not a successful no-JS page.
- Width640 changes action-stack behaviour/vertical alignment; width1280 enables the editorial split. Typography, ring geometry and spacing remain continuous across reference widths and composition boundaries.
- Recovery Home uses the explicit localized Home URL, not browser history. Catalogue uses the approved `/{locale}/bouquets` contract; that page is not implemented yet. Do not claim both destinations are completed pages.
- English follows design copy. Parent read/reviewed the isolated RU/SR NotFound dictionaries; all six keys and intended draft meaning are present, existing Navigation/Footer/Enquiry content is preserved. Actual RU/SR rendering/glyphs were exercised; editorial approval is still absent.

## Actual evidence so far

- [RED log](red.log): a real production HTTP404 existed, but the designed recovery main was absent; the new test failed on that missing behaviour before source implementation.
- [Source format/lint](source-lint.log): Node24.22.2, scoped transient Prettier3.9.10 and full project ESLint exit0. No dependency was added.
- [First integration](integration-first.log): configured lint/types,24unit and production build passed.92 selected E2E eventually finished:86passed/6failed. This is a **FAILED** gate, not a complete-page PASS. Failures: no-JS×2, raw localized-heading×2, mobile font-ready timeout×2. JS-enabled responsive/optical geometry, no Footer, one-shot timing/stable non-ring geometry/preference changes and keyboard/Header/language cases passed in that run.
- [Isolated font recheck](fonts-recheck.log): the two mobile RU font cases subsequently passed with one worker on the same build. This does not erase the failed original run, prove its exact timeout cause or repair no-JS.
- [Rendered manifest](rendered/manifest.json), [nine geometry records](rendered/geometry.json), [capture log](capture.log): EN/RU/SR at360/768/1440; no overflow/page errors in these captures; build/source unchanged during capture. Actual EN Desktop/Tablet/Mobile and RU Mobile screenshots were visually inspected. D/T English boxes match accepted reference within subpixel rounding. [Designer clarification](mobile-flow-clarification.md) resolves Mobile: Figma used three separate line nodes, but the required single natural paragraph legitimately produces2lines/content298 rather than323; the25px delta is permitted flow, not a defect. No runtime edit, fake spacer or fresh visual acceptance was needed.
- Actual no-JS screenshot/DOM absence is intentionally preserved as a failure in the manifest, not a visual PASS. Glyph probes include404 numeral/signature in all locales. No current live Figma, owner visual, universal WCAG or performance acceptance is claimed.

## Remaining gates

1. Resolve the framework no-JS/raw-HTML blocker through a verified fix or explicitly accepted routing/platform trade-off; do not silently return200 or patch Next internals.
2. Rerun production gates after an actual source correction; preserve failures rather than relabel older24/88/212 results. Mobile body wrapping is resolved without changing source.
3. Complete remaining visual/interaction/performance review beyond the actual captures/checks above; natural locale growth must remain supported.
4. Review all affected source/shared paths and obtain a usable scoped independent review; a failed reviewer does not count as PASS.
5. Record build/source identity, actual screenshots/metrics, browser/motion/keyboard/runtime results and remaining limits. Update registry/roadmap at the actual completed increment, not now.

Earlier [shell QA](../not-found-shell/README.md) and [Balloons correction QA](../balloons/hit-area-review.md) are separate historical source/build identities, not passing tests of this newly changed404.

## Bounded continuation

- RU/SR drafting task `deleg_8c8a0137` completed. Parent had already inspected the actual two edited dictionaries and exercised their rendered strings/glyphs; the child's word “approved” does not establish owner approval. They remain editorial drafts.
- [Native guard spike](native-guard-spike/README.md): baseline and `dynamicParams=false` minimal production builds both ran. The latter still loses localized document/recovery markup, so it was rejected rather than applied to production. Temporary fixtures removed;149 fingerprinted production files unchanged and ports3100/3120/3130 closed.
- Narrow independent lifecycle/server-boundary review `deleg_fa5d2bc7` returned PASS/no findings. Parent matched all three current hashes against the captured production snapshot and accepted only that assigned static scope: [review receipt](review-lifecycle.json). The reviewer's empty limitations array is not interpreted as broader coverage. CSS/visual/HTTP/no-JS, remaining full-page review and the failed integration gate remain separate and open; no new runtime change or rebuilt-test PASS is implied.
- Composition/CSS review `deleg_0dd61af6` task0 returned FAIL for alleged cross-module class mixing. Parent rejected that as a concrete defect after reading both modules and the primitive: `className` is its explicit extension API and widget-local `.actions .primary` intentionally removes the shared transparent border; it does not create an inverted import or duplicate variant. [Disposition/source evidence](review-composition.json) preserves the reviewer's actual FAIL instead of relabeling it as an independent PASS. No source change or unnecessary rename; framework/full-page gates stay open.
