# Weddings & Events — final readability cleanup

Status: **VERIFIED, NO VISUAL CHANGE IN THE CAPTURED REFERENCE STATES**.

## Scope

Only 15 application files changed:

- `src/components/pages/WeddingsPage/WeddingsPage.tsx` and `WeddingsPage.module.css`.
- `src/components/widgets/WeddingsBlocks/WeddingsHeroBlock.tsx` and `.module.css`.
- `src/components/widgets/WeddingsBlocks/WeddingsCategoriesBlock.tsx` and `.module.css`.
- `src/components/widgets/WeddingsBlocks/WeddingsApproachBlock.tsx` and `.module.css`.
- `src/components/widgets/WeddingsBlocks/WeddingsProcessBlock.tsx` and `.module.css`.
- `src/components/widgets/WeddingsBlocks/WeddingsInspirationBlock.tsx` and `.module.css`.
- `src/components/widgets/WeddingsBlocks/WeddingsCtaBlock.tsx` and `.module.css`.
- `src/components/widgets/WeddingsBlocks/WeddingsCommon.module.css`.

Expanded compact JSX, props, CSS declarations and long expressions. Added short comments to non-obvious two-stage interpolation, deliberately shrinking/reversing ramps and the CTA split-width calculation. Coefficients and bounds were not rounded or adjusted. Existing section-specific composition rules remain local. Shared styling already uses `WeddingsCommon.module.css`; no additional abstraction or factoring offered a clear readability benefit, so none was introduced.

No changes to rendered text, translations, content, asset selection, component boundaries, props, dependencies, routes, media conditions or behavior. Prettier 3.9.10 was used transiently from the npm cache; it was not added to the project manifest or lockfile. Temporary formatting proposals and their generator were removed.

## Executed validation

- `npm run lint` — passed, including the final QA helpers.
- `npm run typecheck` — passed.
- `npm test` — 19 tests passed.
- `npm run build` — passed.
- `npm run test:e2e -- tests/e2e/weddings.spec.ts tests/e2e/navigation.spec.ts tests/e2e/fonts.spec.ts` — 64 tests passed across both Playwright projects. Covers EN/RU/SR, continuous widths, reference compositions, text/image overflow checks, navigation/modal dismissal/focus/scroll/resize, locale switching and real font glyphs.
- `node docs/qa/weddings-cleanup/verify-preservation.mjs` — all 15 files equivalent: normalized emitted-JavaScript AST (including JSX text) and CSS rule/declaration structures. Restoring their captured originals reconstructs the exact earlier 118-file source/test/config fingerprint, proving no out-of-scope code/config changes.
- `node docs/qa/weddings-cleanup/compare-visual.mjs` — nine full-page screenshots compared as decoded RGBA pixels against the unchanged `docs/qa/weddings/final` baseline. EN/RU/SR at 360/768/1440px: **zero changed pixels in every image**, identical dimensions, no page runtime errors. Desktop EN and mobile RU were also inspected visually.

The source hash before cleanup matched the source hash recorded with the baseline screenshots. Baseline build: `VM8qicYSS5qN0q9Ms7Zyc`; cleanup build: `UTR5BlwEDnZipXuLTytQp`.

## Evidence and reproduction

- `before-sources.json`: exact original contents of the 15 files, needed because these application files are still untracked in the existing working tree.
- `semantic-equivalence.json`: preservation checks and final source fingerprint.
- `pixel-comparison.json`: per-image dimensions and changed-pixel counts.
- `after/*.png`: new full-page captures. Existing baseline images were not overwritten.
- `verify-preservation.mjs`: read-only source verification; writes only its JSON report.
- `compare-visual.mjs`: captures/comparison; requires a production server on port 3120, matching the baseline browser environment.

The temporary production preview server was stopped after QA. No commits, staging, Figma edits or deployment. Existing contact and copy-approval release gates remain unchanged. This is preservation of the existing frontend preview, not new owner/design approval or an all-browser audit.
