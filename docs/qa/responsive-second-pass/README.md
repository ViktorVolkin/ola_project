# Responsive second pass — Home/About/Header/Footer

## Result and scope

Continuous typography and safe spacing/content/image dimensions now live outside width queries. Width queries describe discrete composition, behavior or approved art direction rather than three fixed-size layouts. Pages remain server composition layers; content, translations, routes, assets and modal accessibility were not replaced.

Natural reflow now handles:
- Home Custom/Extras outer blocks, Custom copy/photo and Extras cards;
- Home Mood introduction beside/above its three-card block;
- About Story's lower photo/narrative transition and its nested narrative/signature/botanical placement;
- About Why reason columns, capped at two with a content minimum;
- Footer groups, with no width media queries.

The old Story700px and Why1160px thresholds are gone. Why's editorial side-by-side state is aligned with the1120px editorial-track transition after its heading/padding became fluid. Typography and spacing are not switched there. Home Custom/Extras has no width queries; Home Mood no longer has a1200px outer-layout query. About CTA no longer has a1200px compact-overlay sizing state. Main and handwritten font sizes/line heights are continuous through both current and retired boundaries.

## Remaining discrete conditions

| Widget | Boundary | Switch and reason |
| --- | --- | --- |
| Home Hero |600px| Caption/crop art direction relocates the phrase into the right-hand photo space. Actions wrap intrinsically; photo dimensions and caption typography are fluid. |
| Home Hero |1200px| In-flow copy/photo becomes full-bleed backdrop/overlay; relative/absolute image positioning and horizontal fade are different composition modes. |
| Home Services |600px| Single column becomes two, with Weddings explicitly spanning the row; auto-fit alone does not encode that special span. |
| Home Services |1200px| Three peer cards replace the tablet span arrangement. Card image treatment follows its distinct grid slot. |
| Home Mood |600px| Native horizontal scroll rail becomes three fully visible columns. Its outer editorial arrangement wraps intrinsically. |
| Home Meet |600px| Handwritten phrase transfers from editorial copy onto the photograph. |
| Home Meet / Events |1200px| Separate copy/photo blocks become photographic backdrops with overlaid editorial copy. |
| About Hero / CTA |640px| Separate phone copy/photo panels become overlays; copy stays in normal flow on the narrow layout for readability. |
| About Hero |1200px| Art-direction/contrast exception: caption changes from wine to light text over the dark desktop image region. This is not a sizing or column breakpoint. |
| About Principles |560px| Icon-over-label with centered alignment becomes a horizontal icon/label group. Group dimensions remain fluid. |
| About Principles |1000px| Explicit paired2×2 becomes four equal groups, preserving the balanced value composition instead of an orphan3+1. |
| About Story |1120px| Equal compact photo/copy tracks become unequal desktop editorial tracks. Lower stacking and nested illustration reflow are intrinsic. |
| About Style |640px| The third photograph spans both columns in the phone2+1 composition; three peers are used above it. |
| About Style |1120px| Copy-above-photos/left alignment becomes centered editorial copy beside the photo rail. |
| About Why |1120px| Photo-above-copy becomes side-by-side editorial tracks with corresponding alignment. The reason grid itself reflows intrinsically. |
| About Why |640px| Mobile decorative-heart visibility, handwritten line-flow and icon-fill art direction; no typography-size or reason-column switch remains here. |
| Header |600px| Enquiry control moves between the header and modal to preserve control space. Header height/gaps and dialog offset are fluid. |
| Header |768px| Compact About context label becomes visible, as in the tablet reference; this is visibility/art direction, not a size state. |
| Header |1200px| Full navigation replaces the modal trigger. An open modal closes and releases scroll lock when desktop navigation becomes active. |

Exact numeric thresholds are engineering choices within the approved reference compositions, not numeric breakpoints specified by Figma and not claims of a unique optimum. Hover/reduced-motion capability queries and numeric clamp limits are not included above.

## Explicit intrinsic-layout experiment

An independent spec reviewer questioned the Principles paired grid. Parent exercised a real Chromium candidate by temporarily overriding only the grid template with auto-fit and a240px readable minimum (capped by half the available width on phones). No source was changed by that experiment:

| Viewport | Current row item counts | Intrinsic candidate |
| --- | --- | --- |
|768|2,2|2,2|
|900|2,2|3,1|
|1000|4|3,1|
|1120|4|4|
|1440|4|4|

The explicit paired state was retained to avoid that orphaned final value. At1000px current tracks measured approximately213.94px each; this is not evidence that every auto-fit alternative must fail, but it is a concrete reason not to replace this composition with the tested ordinary auto-fit rule.

## Executed verification

- Complete `npm run check` passed: project ESLint, typecheck,10 unit tests, production build and144 Playwright tests.
- After the final Home Custom copy/photo flex-basis correction, lint/typecheck/build and all14 Home E2E cases were rerun successfully. No font/modal/locale logic changed in that correction.
- Typography regression was first reproduced against the prior build: About H1 jumped6px at640px. New tests pass for EN/RU/SR, Home/About, current and retired thresholds. Both font-size and line-height changes across a2px viewport interval are bounded; approved360/768/1440 H1/H2 sizes are separately asserted.
- Bounds tests retain37 reference/intermediate/boundary-neighbor widths and dynamically include new conditions. All current thresholds have immediate neighbors covered. Modal offset is tested at360/430/599/600/601/768/900/1199, along with existing focus, scroll lock, Escape nesting and dismissal coverage.
- Final screenshot/DOM sweep:198 cases,33 widths, all HTTP200, no page errors or document overflow. Build ID, source SHA-256, actual query inventory, widths and measurements are recorded in `after/manifest.json`; source baseline remains untouched in `../fluid-layout/after/`.
- Parent inspected final native crops/full-page renders: EN desktop Home, About desktop/tablet, RU desktop Story and phone CTA, plus intermediate source geometry. Browser subpixel rounding is accepted within0.5px for nominal152×116 Extras photo dimensions; their size/composition expectations were not removed.
- Test servers were stopped after verification. No commits, staging or public deployment were performed.

## Review / acceptance boundaries

Final independent review (`deleg_a9e1e1ff`, ordinary Luna6) returned `spec_passed: true` and `quality_passed: true`, with no blocking findings. The Principles paired-state condition was accepted after the concrete intrinsic-grid trial; its1000px cutoff is an engineering choice, not a unique design optimum. The only cosmetic suggestion concerned leading blank lines. The initial concern and experiment remain recorded above rather than silently treating the first failed review as PASS.

This is frontend verification against the recorded approved intake and reference captures, not fresh live-Figma pixel-parity or owner production acceptance. RU/SR remain drafts and real enquiry contact configuration remains missing, unchanged by this pass. Some text measures and intrinsic intermediate arrangements naturally differ from the previous stepped implementation; no pixel-perfect claim is made.
