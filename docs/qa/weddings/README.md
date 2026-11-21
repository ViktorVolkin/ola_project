# Weddings & Events — QA and review

Status: **TECHNICAL FRONTEND PREVIEW VERIFIED**. Parent reviewed the affected implementation and rendered page; scoped independent spec/code reviews are recorded below. Production release and owner visual/content approval are not claimed.

Post-verification JSX/CSS readability cleanup is documented in [the cleanup report](../weddings-cleanup/README.md). The original screenshots below remain unchanged as the comparison baseline; the cleanup report records fresh checks and pixel comparisons.

## Scope

- Route `/{locale}/weddings-events`, EN/RU/SR, six server-rendered section widgets; thin route/page composition.
- Shared Header: current-page desktop state plus Weddings tablet context; compact modal remains Radix with nested language control.
- Shared EnquiryLink: confirmed event/category subject, arrow variant and honest disabled state when contact is missing. Only the supplied subject is appended to a configured URL; no automatic sending or invented message template.
- Sources: current OLA Figma desktop105:2977, tablet105:3329, mobile106:3476; `docs/design/weddings-implementation-plan.md`, `weddings-intake.json`, and `weddings-asset-map.json`.
- Lead Designer confirmed these roots remain the scoped implementation reference and clarified CTA handoff. Their cited operations brief is not present in this frontend mount; no local read of it is claimed.

## Review and corrections already performed

- Parent rechecked 11 saved image placements against SHA-1 of the 10 supplied image files: no mismatch. Historical compact verification limitations remain documented in the asset map.
- Read-only subagent findings were not accepted blindly: stale image-verification claims and inaccurate source citations were corrected by direct inspection.
- The process-widget subagent failed with provider rate limiting after partial writes. Parent reviewed and corrected a nonexistent default Container import, literal `badge01` output, redundant native-role annotations, duplicated section padding, incorrect font sizes/colors, inappropriate CSS import and unanchored connectors. The result was not accepted as a completed child task.
- Parent inspected all localized copy. The content child produced grammatical/semantic errors despite reporting faithful translations, including an English `arranged` fragment in Russian, Serbian dinner translated as lunch, incorrect arches/rentals wording and inconsistent tone. These were corrected; RU/SR remain explicit drafts requiring approval.
- Shared widget defaults use low specificity so section-owned sizing is not dependent on CSS import order.
- Enquiry URL behavior was exercised RED then GREEN: four dedicated unit tests passed, including missing contact, exact subject preservation and retaining an existing approved text parameter.

## Executed initial checks (before final copy/spacing corrections)

- Project lint and typecheck passed.
- 14 unit tests passed.
- Production build passed; initial visual evidence build ID `egpalFQd4Ou0gPyEvlJeJ`.
- 24 Weddings browser tests passed, covering three locales and both Playwright projects: section order, assets, process anchor, disabled subject-preserving enquiries, responsive layouts, modal focus/scroll/Escape/Close/backdrop/link/resize and locale route/query/hash preservation.
- Initial visual collector completed nine locale/reference-viewport cases without document overflow or broken image decoding. Parent inspected EN full-page D/T/M plus legible phone Hero, tablet CTA and desktop process captures. Initial raw manifest also retains navigation-aborted Next RSC prefetch requests; these are not failed required images or demonstrated page-runtime errors.
- The first screenshot collector hung awaiting lazy-image decoding; parent stopped only that collector and its descendants, made image loading/decode waits bounded, and reran successfully. Initial failing conditions are not reported as a pass.

## Integrated checks and remaining gates

- Captured `npm run check` exited 0: lint, typecheck, 18 unit tests, build and 168 E2E tests passed (`final-check.log`). Subsequent scoped logs preserve 46 passing shared-navigation/Weddings checks (`pre-fluid-cta-check.log`), 24 passing Weddings checks (`pre-nonbreaking-labels-check.log`) and 10 passing Serbian navigation/Weddings checks (`final-label-check.log`). These overlapping runs are not added into a fictitious unique total. The previously mentioned `final-polish-check.log` does not exist and is not evidence.
- Final-reference collector on build `q4VHWAXysPPJBwNM5XIpK` completed nine locale/reference cases with `issues=[]`, `overflow=[]`, decoded images and source SHA-256 `55a6085ad421f50bf2a51eeaa57fc40454e6e2dac97b2be330c1815ba3cd25c3`. An additional readable-content sweep covered 72 locale/width combinations with zero findings (`final/text-overflow.json`). Parent inspected Russian desktop, Russian phone hero/CTA and Serbian tablet CTA at readable resolution, in addition to the EN comparisons. Cancelled Next RSC prefetches are recorded separately, not silently treated as required-asset successes or application defects.
- Final confirmation after adding automated internal-text-overflow assertions and real-glyph checks for Weddings **exited 0**: lint, typecheck, **19 unit tests, production build, 174 E2E tests**. Output: `final-confirmation.log`. Before/after fingerprints match: 118 source/test/manifest/config files, SHA-256 `caa2f389a06961714396a24ef3602e6ea9862eda400ce674127b605415a32f9a` (`confirmation-source-before.json`, `confirmation-source-after.json`).
- Final screenshots were refreshed against that confirmed build **`VM8qicYSS5qN0q9Ms7Zyc`**: 9 EN/RU/SR × 360/768/1440 cases, `issues=[]`, `overflow=[]`; the additional 72-case text sweep also has no findings. Current evidence is `final/manifest.json`, `final/text-overflow.json` and adjacent images. The earlier q4 build above is provenance, not the current evidence build. Parent inspected the refreshed EN desktop and SR mobile overview; the same-source readable RU phone/desktop and SR tablet checks are described above. Font checks exercise actual rendered Cormorant/Manrope/Great Vibes glyphs via Chromium CDP, not computed-family names alone.
- Structured Figma comparison identified mobile category gaps 16px, inspiration stack gaps 20px, process inter-step gaps 20px and centered badges/connectors; parent corrected these using continuous CSS, not new size-only breakpoints. Mobile approach body now interpolates 25px line height to compact/desktop 24px. No fixed whole-page height is used to conceal natural font/text wrapping differences.
- Independent spec attempt `deleg_1d06f50c` did not inspect code due to a reported workspace-path/access problem: NOT PASS and not a demonstrated app defect. Preserved in `review-first-attempt.json`; parent separately verified the actual `/workspace` page exists. Scoped retry `deleg_0c273c94` reports PASS on supplied composition/section/enquiry source excerpts (`review-spec.json`), with no CSS/translation/visual approval. Fresh code-quality review `deleg_3b363b14` reports PASS, no security/logic blockers (`review-quality.json`), on supplied shared-header/enquiry/composition excerpts. Both verdicts were Markdown-fenced, not strict raw JSON. A suggestion to repeat the menu label in aria-describedby was rejected: Dialog.Title already supplies its translated name, and aria-describedby requires a meaningful descriptive element ID. These scoped reviews supplement, not replace, the parent's full affected-code and browser review; no independent whole-page visual audit is claimed.
- README is updated to the implemented route, content/namespace/widget ownership and the verified preview/release boundary. No commit or deployment was performed.

## Remaining Weddings layout/behavior transitions

| Widget | Width | Discrete change | Reason |
|---|---|---|---|
| Hero | 1200px | Copy-before-photo becomes overlaid editorial copy with ivory fade/caption contrast | Native desktop art direction, not a size interpolation |
| Categories | 640 / 1280px | One / paired two / four columns | Preserve the intended grouping without a three-plus-one orphan |
| Process | 640 / 1280px | One / paired two / four steps; connectors only with four tracks | Preserve the numbered sequence and native connector arrangement |
| Inspiration | 640 / 1280px | One / paired two / four figures | Preserve native grouping rather than an orphan final card |
| Final CTA | 640px | Wine-then-bride stack becomes adjacent panels | Genuine composition change; tablet-to-desktop panel proportion is fluid, with no extra 1200px CTA size breakpoint |

Approach wraps intrinsically; safe dimensions, gaps and typography remain continuous. Shared Header retains its existing 600px enquiry placement, 768px context visibility and 1200px modal/desktop behavior. Weddings browser coverage includes their boundary neighbors and intermediate widths 320–1600px, actual modal interaction, all three locales and image/contrast/text-overflow checks. These thresholds are engineering choices realizing the reference composition, not a claim that each numeric boundary is uniquely dictated by Figma.

## Release boundaries

The real WhatsApp recipient and final approved prefill are not supplied. Existing disabled/private-preview behavior remains; no fictitious URL, success state, backend or booking flow. RU/SR translation approval and production imagery rights remain release gates. Browser/technical acceptance is not owner production design acceptance or a full WCAG audit. No staging, commits, push, deployment or Figma edits.
