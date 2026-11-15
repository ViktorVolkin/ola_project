# OLA-CONTACT-001 — review correction packet

## Revision 3 — R6 correction; awaiting actual Supervisor review 4

Actual [review 3 FAIL](supervisor-review-3.json) confirms R1–R5 resolved and R6 a new, CSS-introduced Serbian word-fragmentation defect. All three FAIL receipts and earlier evidence remain unchanged. At desktop widths only, Serbian panel uses the existing 32/36px heading scale and 16px inline spacing, retaining the photo grid track and natural panel height. Exact copy, original heading semantics (panel `h3`, section `h2`), font family, photo crop rules, EN/RU styles and photo `width: 100%` are unchanged. [Precise CSS diff](revision-3/source.diff).

[Real RED](revision-3/word-red.log) on baseline build `_OTxSCNFHXIfvhIabAAr2` shows `Razgovar / ajmo` at 1100 and `Razgovarajm / o` at 1440. [GREEN](revision-3/geography-retry.log) uses actual per-character Range line grouping after fonts load: both projects retain `Razgovarajmo` and `o detaljima.` on separate lines at 360, 768, 1099, 1100, 1101, 1199, 1200 and 1440. It also passes all six existing locale/project photo/content nonoverlap checks over 1099/1100/1101/1199/1200/1440: 8 tests passed total, exit 0. The initial final-build test invocation [failed](revision-3/geography.log) because my own temporary server child still held the port; after identifying and stopping that child, the configured production server ran the recorded successful retry. No product workaround.

Native section screenshots were actually inspected: SR [before 1100](revision-2/geo-sr-1100.png), [after 1100](revision-3/geo-sr-1100.png), [before 1440](revision-2/geo-sr-1440.png), [after 1440](revision-3/geo-sr-1440.png), plus SR 360/768/1099/1101/1199/1200 and EN/RU 360/768/1100/1440 in revision-3. SR title is intact and panel body and unavailable action visible; no photo overlap or baked band observed at these inspected states. EN 1100 remains four short heading lines and RU 1100 action has a standalone preposition: unchanged baseline presentation, outside this bounded SR fix; not silently called visually ideal. [Real crop bounds](revision-3/crops.json) cover 16 locale/width captures; CT02 minimum signed row-1100 margin 1.987914644 CSS px (same formula and rounding tolerance as revision 2). At SR 1100 the naturally shorter panel restores the photo to its 560:460 track aspect ratio; image recipe and assigned track unchanged, not identical old panel-driven height.

Fresh final-source configured [lint](revision-3/lint.log), [typecheck](revision-3/typecheck.log), [unit](revision-3/test.log) (24 tests/6 files) and [build](revision-3/build.log) all exit 0. Build `NN2_y8HZAZg1Zh1YBCSlO`; [source-before](revision-3/source-before.sha256) and [source-after](revision-3/source-after.sha256) identical (manifest SHA-256 `f3e1536bee172e5cb17697cd924220766976d93e35c94c1109dcd2cfa6f6dc2c`; excludes dependencies/environment). [Focused Contact](revision-3/contact-focused.log): FAQ/keyboard/ARIA/disabled actions and CT02 decoded tablet coverage, 8 passed both projects. The old full 66-width sweep and 103-pass browser run remain revision-2 historical evidence, not results of this build; not repeated because the only product change is locale-scoped Geography presentation and new affected boundary checks were run. The old broad sweep writes revision-2 files and was deliberately not invoked. Routing and unrelated navigation/fonts suite were not rerun; known legacy RU 404 failures remain open, no all-site-green claim. Owner visual/design, EN business, RU/SR editorial, image rights, CT01 crop, nullable recipient and release approvals remain separate; actual Sol Supervisor review 4 is required before acceptance. Runtime gpt-6.1-terra/openai-codex; usage/timing unknown.

## Historical revision 2 — R5 correction; review 3 completed FAIL (superseded above)

Actual [review 2 FAIL](supervisor-review-2.json) resolves R1–R4 but confirms high-severity product defect R5; both FAIL receipts and revision 1 remain unchanged. The real-browser [RED](revision-2/baseline-red.log) reproduced photo/panel and content intersection in EN/RU/SR, including 1100/1101. Grid stretch plus aspect-ratio transferred panel-driven height into photo width beyond its assigned track. Geography CSS now sets photo `width: 100%`, keeping it in the track while panel height grows naturally and preserving intrinsic image rendering/crop rules. Screenshots exposed a separate long Serbian heading extending beyond the panel; [heading RED](revision-2/heading-red.log) confirmed 1100/1101/1199/1200. `overflow-wrap: anywhere` keeps the actual text within the panel without shrinking or changing copy. It does split the Serbian word awkwardly (including an orphan letter at 1440); visual/editorial acceptability remains for Supervisor/owner.

The final [browser log](revision-2/playwright.log) ran Contact, Geography, navigation, locales and fonts through the configured production webServer: 103 passed, 1 skipped (duplicate mobile sweep), exit 0. New regression uses localized heading/body/disabled-action locators, measures their boxes, tests sibling and content intersection and heading text Range against panel, at 1099/1100/1101/1199/1200/1440 in each locale, both projects. It does not infer disabled-label visibility from pointer hit testing. [Measured separation table](revision-2/overlap-tables.md) and [geometry](revision-2/overlap-geometry.json) derive from logged browser rectangles; no simulated height. [66-image sweep geometry](revision-2/geometry.json), [screenshots](revision-2/screenshots.sha256) and [crop tables](revision-2/crop-tables.md) include earlier boundaries and locales. Signed crop margin uses `image.y + cutoff * image.height / sourceHeight - (viewport.y + viewport.height)`; minima CT02 +1.9879px and CT03 +2.9848px. Whole Geography sections at 1100 in each locale were inspected at native size, as were EN 1099, RU 1200 and SR 1440 on identical product source from the preceding build; final build 1100 sections were re-inspected. Not an exhaustive visual audit.

Fresh configured [lint](revision-2/lint.log), [typecheck](revision-2/typecheck.log), [unit](revision-2/test.log) and [build](revision-2/build.log) each exit 0; unit 24 passed in 6 files. Build ID `_OTxSCNFHXIfvhIabAAr2`; scoped before/after manifests are byte-identical, SHA-256 `ad476bad935118b885f8933886a3dab01ea68563eef71f89c60e82eb95d07401`. Geography CSS SHA-256 `10ac657f8608c6d9d77fa2b2d1e8af9ce6f4db14e96f1f8249ad3d3ee5065ec4`; regression `50878a2407d125eff3461df682eea827b389cf4b9206b0127e1c2d0a1876cd6f`; geometry `3ab2fd3b25566dcfc595af31ac7fba21d99a3c8da2cee5c63cbb1f106c371849`. Existing sweep now saves to revision 2 so historical screenshots are not overwritten. Manifest excludes dependencies/environment. Existing legacy RU 404 failures remain unresolved and routing is explicitly excluded; not all-site green. Owner visual approval, draft locale approval, image rights, recipient and actual Sol review remain open. Runtime usage/cost/duration unknown until gateway completion.

**Historical revision 1 state: awaiting Supervisor review 2 (now superseded by the revision 2 state above).** Original [Supervisor FAIL receipt](supervisor-review.json) is unchanged. Its R1–R4 are confirmed verification/reporting defects, not established product defects. The erroneous [original report](revision-1/report-before-review-correction.md) and historical [integration evidence](integration/) remain preserved. No Contact product, CSS, images or routing tests were changed in revision 1.

## Finding dispositions

**R1 — responsive coverage corrected and expanded.** The old geometry has only 27 unique records, not its claimed breakpoint neighbors. Fresh [geometry](revision-1/geometry.json) has 66 unique combinations: EN/RU/SR × 320, 360, 375, 559, 560, 561, 599, 600, 601, 639, 640, 641, 768, 900, 1024, 1099, 1100, 1101, 1199, 1200, 1201, 1440 CSS px. The [analysis script](revision-1/analyze.py) deduplicates and asserts the complete Cartesian product; each record passed document overflow and crop-count assertions. Actual owned CSS boundaries: Topics 560 and 1100; Hero/Geography 600 and 1100; Lower 640 and 1200. Screenshots were captured for every combination; their [SHA-256 manifest](revision-1/screenshots.sha256) identifies them. A [RU transition contact sheet](revision-1/ru-transitions-contact-sheet.jpg) was visually inspected at overview scale: no obvious page-scale overlap or missing layout; fine text, individual pixels and universal visual parity are not established by that overview. The images themselves permit closer review. This is bounded browser evidence, not proof for every possible width.

**R2 — crop calculations corrected.** The generated tables below use the actual new EN geometry. The viewport rectangle is in document CSS pixels; image x/y are relative to viewport, width/height are rendered CSS pixels. `localX = image.x - viewport.x`, `localY = image.y - viewport.y`; `sourceBottom = (viewport.y + viewport.height - image.y) * sourceHeight / image.height`; `marginCSS = image.y + cutoff * image.height / sourceHeight - (viewport.y + viewport.height)`. Positive margin means the conservative cutoff is below the visible viewport. CT02 cutoff 1100 (observed JPEG transition ~1100–1107), CT03 cutoff 1180 (transition ~1184–1190). The original tables were wrong; do not change photos to match them. EN CT02 tablet 768 has ~0.22 CSS px inset at each side; the test tolerates 0.25 px, not literal full coverage. Generated from [geometry](revision-1/geometry.json) using [analysis script](revision-1/analyze.py), output [crop-tables.md](revision-1/crop-tables.md); values rounded only for display. These calculations do not establish image rights or Figma parity.

**R3 — interaction and assets.** In each locale and both browser projects the test clicks the first FAQ, naturally Tabs to the second and Shift+Tabs back, then Tabs forward, uses Enter and Space, checks independent multi-open and collapse, and checks an aria snapshot excludes a closed answer and includes it open. Seven controls, initial state, control IDs, answer text and 44px target height are checked. Native `hidden`, not redundant `aria-hidden`, hides collapsed panels; that is source inspection, while tree exclusion is an executed snapshot assertion. Page errors are asserted in the localized FAQ tests. In the desktop viewport sweep all document images are eagerly decoded without swallowing exceptions and checked complete/naturalWidth > 0; image requests observed failing or returning HTTP ≥400 fail the test. This does not assert every network resource or prove all accessibility requirements. Contact widget source has no motion animation/transition rules; reduced-motion-specific Contact assertion is not applicable based on source inspection, not an executed shared-chrome reduced-motion test. Header dialog Tab loop and Escape are separately exercised.

**R4 — deterministic and browser provenance.** Fresh run on one scoped source identity: [before](revision-1/source-before.sha256) and [after](revision-1/source-after.sha256) manifests are byte-identical (cover `src`, `public`, `tests`, package/lock and named project configs); SHA-256 of the before manifest `dd22bf3e274e30914a80e0d9fa048459c835d2ac8c63864dd4cecfd835dce895`. Build ID [`awwvuPEJ9cRRUfGCqxvrJ`](revision-1/BUILD_ID); geometry SHA-256 `88c207d20f832937e40a0fff6ee8a80b268f4c19a301be1d39efae1d5e1bfd61`, screenshot manifest SHA-256 `305b5e4c3ce21bdf0285f408f04459878e30c0bdb336d9324cdb63adc9d099e2`. No cross-build equivalence is assumed. Outputs include actual command, stdout/stderr and exit status:

| Gate | Evidence | Outcome |
|---|---|---|
| `npm run lint` | [log](revision-1/lint.log) | exit 0 |
| `npm run typecheck` | [log](revision-1/typecheck.log) | exit 0 |
| `npm run test` | [log](revision-1/test.log) | exit 0; 24 tests, 6 files |
| `npm run build` | [log](revision-1/build.log) | exit 0 |
| `npx playwright test tests/e2e/contact.spec.ts tests/e2e/navigation.spec.ts tests/e2e/locales.spec.ts tests/e2e/fonts.spec.ts` | [log](revision-1/playwright.log) | exit 0; 97 passed, 1 skipped (mobile duplicate of desktop-only width sweep); standard configured Next production webServer |

The earlier [final-qa.log](integration/final-qa.log) actually included routing: 99 passed, 2 failed, 1 skipped, with passed suite counts Contact 13, fonts 36, locales 26, navigation 22, routing 2. The two known Russian raw-response 404 failures are legacy/out of Contact scope and remain unchanged, not silently passed; the fresh command excludes routing. Runs are separate, not summed. The first revision attempt and its distinct source/build/log/capture identities are retained in [attempt-1](revision-1/attempt-1/); it preceded the additional observed-image-request check and is not the final run. Configured webServer was used and exited; a later connection to 127.0.0.1:3100 failed (curl exit 7), so no task server was listening then.

## Provenance and limits

[Persisted designer handoff](../../design/contact-handoff.md) contains the exact supplied English R04 FAQ and CT02 clarification. No fresh Figma access or original raster comparison was made. CT01 inner crop was not supplied; asset rights and owner visual approval remain open. EN business approval is open and RU/SR are drafts; unknown enquiry recipient remains disabled. No universal accessibility, pixel parity, full-site or release approval claimed. API call/token/cost and current integration duration are unknown; previous ungrounded approximate 93/18 counters were removed. Actual Supervisor review 1 used profile supervisor / openai-codex / gpt-6.1-sol, delivery `4c26b245da27434bf89f5fe51bd1150c998f0b406fc8a0b8467b65c51ae1fa65`; review 2 remains pending. Risk medium: page/locale/interaction integration, independent review required. Acceptance basis is the actual independent review following these checks, not this packet alone.

## Generated EN crop tables

66 unique records = ['en', 'ru', 'sr'] × [320, 360, 375, 559, 560, 561, 599, 600, 601, 639, 640, 641, 768, 900, 1024, 1099, 1100, 1101, 1199, 1200, 1201, 1440]; no document horizontal overflow.

### 02_contact (source height 1236, conservative cutoff row 1100)

| Width | viewport document x,y,w,h (CSS px) | image local x,y,w,h (CSS px) | source bottom (source px) | signed margin (CSS px) |
|---:|---|---|---:|---:|
| 320 | 20.00, 1464.00, 280.00, 240.00 | -37.12, -3.44, 356.58, 275.80 | 1090.98 | +2.01 |
| 360 | 20.00, 1414.00, 320.00, 240.00 | -33.77, -24.73, 387.50, 299.72 | 1091.73 | +2.01 |
| 375 | 20.00, 1417.81, 335.00, 245.88 | -32.52, -26.86, 399.12, 308.70 | 1091.99 | +2.00 |
| 559 | 20.00, 1393.72, 519.00, 318.03 | -17.63, -50.48, 542.55, 418.78 | 1087.64 | +4.19 |
| 560 | 20.00, 1393.98, 520.00, 318.42 | -17.55, -50.58, 543.33, 419.39 | 1087.49 | +4.24 |
| 561 | 20.00, 1394.23, 521.00, 318.81 | -17.47, -50.69, 544.09, 419.98 | 1087.43 | +4.27 |
| 599 | 20.00, 1404.77, 559.00, 333.72 | -14.31, -54.59, 573.56, 442.72 | 1084.11 | +5.69 |
| 600 | 20.00, 1409.11, 560.00, 334.11 | -14.12, -54.70, 574.33, 443.31 | 1084.05 | +5.72 |
| 601 | 20.06, 1409.45, 560.88, 334.50 | -14.02, -54.80, 575.11, 443.92 | 1083.91 | +5.78 |
| 639 | 22.78, 1422.77, 593.44, 349.41 | -10.89, -58.72, 604.56, 466.66 | 1080.97 | +7.18 |
| 640 | 22.84, 1423.12, 594.31, 349.80 | -10.80, -58.81, 605.34, 467.25 | 1080.88 | +7.23 |
| 641 | 22.92, 1423.45, 595.16, 350.19 | -10.67, -58.92, 606.00, 467.84 | 1080.83 | +7.26 |
| 768 | 32.00, 1467.00, 704.00, 400.00 | 0.22, -71.98, 703.56, 543.83 | 1072.72 | +12.01 |
| 900 | 41.42, 1469.34, 817.16, 400.00 | -0.14, -72.00, 817.44, 631.25 | 924.19 | +89.79 |
| 1024 | 50.28, 1446.56, 923.44, 400.00 | -0.16, -72.00, 923.75, 713.34 | 817.83 | +162.85 |
| 1099 | 55.64, 1447.91, 987.72, 400.00 | 0.02, -72.00, 987.69, 763.00 | 764.60 | +207.05 |
| 1100 | 406.56, 762.91, 558.78, 459.00 | -55.87, 0.00, 670.52, 517.98 | 1095.25 | +1.99 |
| 1101 | 406.92, 762.91, 558.81, 459.03 | -55.88, 0.00, 670.58, 518.03 | 1095.23 | +2.00 |
| 1199 | 441.92, 765.53, 511.22, 419.94 | -51.24, 0.00, 613.70, 474.09 | 1094.81 | +1.99 |
| 1200 | 442.28, 765.58, 511.30, 420.00 | -51.27, 0.00, 613.81, 474.17 | 1094.79 | +2.00 |
| 1201 | 442.64, 765.58, 511.33, 420.03 | -51.27, 0.00, 613.84, 474.20 | 1094.80 | +1.99 |
| 1440 | 528.00, 776.00, 560.00, 460.00 | -55.99, 0.00, 671.98, 519.11 | 1095.26 | +1.99 |

### 03_contact (source height 1328, conservative cutoff row 1180)

| Width | viewport document x,y,w,h (CSS px) | image local x,y,w,h (CSS px) | source bottom (source px) | signed margin (CSS px) |
|---:|---|---|---:|---:|
| 320 | 20.00, 3419.00, 280.00, 340.00 | -64.00, -58.00, 408.00, 451.34 | 1171.05 | +3.04 |
| 360 | 20.00, 3334.00, 320.00, 340.00 | -52.50, -58.00, 425.00, 470.16 | 1124.19 | +19.76 |
| 375 | 20.00, 3344.88, 335.00, 340.00 | -54.96, -58.00, 444.92, 492.19 | 1073.87 | +39.34 |
| 559 | 20.00, 3323.66, 519.00, 340.00 | -85.15, -58.00, 689.30, 762.69 | 693.00 | +279.69 |
| 560 | 20.00, 3324.38, 520.00, 340.00 | -85.31, -58.00, 690.62, 764.16 | 691.67 | +280.99 |
| 561 | 20.00, 3325.11, 521.00, 340.00 | -85.48, -58.00, 691.95, 765.62 | 690.34 | +282.30 |
| 599 | 20.00, 3332.58, 559.00, 340.00 | -91.71, -58.00, 742.42, 821.47 | 643.41 | +331.92 |
| 600 | 20.00, 3353.38, 560.00, 340.00 | -91.88, -58.00, 743.75, 822.94 | 642.27 | +333.22 |
| 601 | 20.06, 3354.20, 560.88, 340.00 | -92.02, -58.00, 744.91, 824.22 | 641.27 | +334.36 |
| 639 | 22.78, 3385.45, 593.44, 340.00 | -97.36, -58.00, 788.16, 872.08 | 606.07 | +376.89 |
| 640 | 22.84, 3386.30, 234.83, 400.00 | -90.59, -6.00, 416.00, 460.28 | 1171.39 | +2.98 |
| 641 | 22.92, 3387.11, 235.17, 400.00 | -90.42, -6.00, 416.00, 460.28 | 1171.39 | +2.98 |
| 768 | 32.00, 3490.59, 280.00, 400.00 | -70.49, -6.00, 420.98, 465.80 | 1157.52 | +7.89 |
| 900 | 41.42, 3500.38, 326.59, 400.00 | -82.23, -6.00, 491.05, 543.33 | 992.34 | +76.78 |
| 1024 | 50.28, 3489.52, 370.34, 426.69 | -93.24, -6.00, 556.83, 616.11 | 932.64 | +114.76 |
| 1099 | 55.64, 3498.09, 396.81, 457.95 | -99.91, -6.00, 596.62, 660.14 | 933.33 | +122.62 |
| 1100 | 55.70, 2312.19, 397.17, 458.36 | -100.01, -6.00, 597.17, 660.75 | 933.29 | +122.75 |
| 1101 | 55.78, 2312.30, 397.53, 458.78 | -100.09, -6.00, 597.70, 661.34 | 933.30 | +122.86 |
| 1199 | 62.78, 2259.98, 432.11, 480.00 | -108.80, -6.00, 649.70, 718.88 | 897.80 | +152.76 |
| 1200 | 440.47, 1875.52, 292.45, 400.00 | -59.41, 0.00, 411.25, 455.03 | 1167.39 | +4.32 |
| 1201 | 440.84, 1875.59, 292.70, 400.33 | -59.46, 0.00, 411.61, 455.44 | 1167.31 | +4.35 |
| 1440 | 528.00, 1901.97, 352.00, 479.98 | -71.50, 0.00, 495.00, 547.70 | 1163.80 | +6.68 |
