# Responsive second pass — approved implementation approach

Scope: Home/About/Header/Footer only, on development; preserve existing staged/unstaged/untracked work, content, assets, routes and narrow client boundaries. No commits, staging, deployment or Figma modifications.

User rule: retain media queries only for a discrete composition or behavior change. Move typography, spacing, image/content dimensions and comparable continuously varying parameters out of width media queries where safe. Figma360/768/1440 are reference states, not mandatory switch widths.

## Ownership and sequence

1. Home worker owns HomeBlocks TSX/CSS/imageSizes. Replace stepped typography and spacing with continuous, capped formulas passing reference values. Consider intrinsic wrapping for ordinary two-block layouts; retain explicit rail→grid, Weddings special span and stack→overlay art direction where needed. Keep images/crops and section ownership intact.
2. About worker owns AboutBlocks TSX/CSS. Remove typography jumps at1120/1160/1200, reconsider560/640/700 and1000/1120/1160. Prefer intrinsic sizing/wrapping where it preserves approved composition. Retain queries for explicit stack→overlay, special image span or meaningful signature/botanical rearrangement. Do not force independent widgets to a universal breakpoint.
3. Chrome worker owns Header/Footer CSS/TSX and navigation tests only if required. Make dimensions fluid, evaluate intrinsic Footer wrap, retain modal→desktop navigation behavior and genuine control relocation/art direction. Keep Radix accessibility and nested language handling.
4. Parent reviews actual edits and integrates; do not infer success from a child report. Parent owns responsive/continuity coverage, source/selector checks, production build and browser/render validation. Compare reference captures from docs/qa/fluid-layout/after (previous validated build) with the second pass; preserve that baseline.
5. Test EN/RU/SR at320/360/375/390/430/600/768/900/1024/1200/1366/1440/1920 and immediate neighbors of every remaining layout/behavior breakpoint. Assert computed typography continuity across transitions, document overflow, text/control bounds, reference geometry, image composition and modal behavior.
6. Run independent spec and code-quality review and final parent checks. Report only remaining layout/behavior breakpoints with widget, discrete change and why fluid-only is unsuitable; numeric clamp limits are not breakpoints.

## Acceptance boundaries

A passing current layout does not establish the necessity of a query. Prefer removing size-only overrides rather than renaming them as art direction. Do not claim intrinsic reflow is equivalent without rendered verification; special span/overlay/scroll behavior can legitimately remain discrete. Continuous typography can use piecewise max/min/clamp formulas through approved control values without width media queries. Inherited dimensions that must reset for an absolute overlay are part of a structural mode, not arbitrary pixel patches.

Fresh live Figma parity/owner acceptance is separate from this frontend refactor; use recorded approved intake and reference screenshots honestly. Missing contact configuration and draft RU/SR content remain unchanged.
