# Bouquets hero — implementation handoff

Status: ready for integration, not accepted. Scope: server widget and its module only; assembled browser/build and actual Sol Supervisor review remain integrator gates.

## Source and actions

- Read completed taskcards A, copy/style map, crop map and readiness packet, project primitives, installed Next server/CSS/image guides, and current worktree. Bound native Figwright session `id-mwg48w7s-pk38p8wa` to OLA.
- Fresh native screenshots read: hero 106:3906 (1440×600), 106:4332 (768×958), 106:4819 (360×765); saved those and photo instances 106:3907, 106:4375, 106:5094 in `native-ref/`. Reference visuals show desktop split/fade and compact stack with same floral scene. No browser screenshot comparison yet.
- Implemented supplied-image `next/image` cover, full bleed compact, desktop scene and gradient, normal-flow content with explicit script newline preserved. 600px changes compact photo shape; 1100px switches composition to desktop split. 420px fade and 120px overhang are native desktop geometry, not measured source crop offsets. Localized content may increase section height.
- Native imageTransform was not serialized. Cover is a provisional centered presentation, not a verified native crop; compare rendered source scene/actual reference at D/T/M and intermediate widths before making crop claims or changes.
- Breadcrumb prop is a combined string. Current code splits on first `/`, links the left part to locale-aware home and marks the right part current; absent delimiter falls back to plain current text. This assumes slash-delimited labels and cannot represent all localized structures safely. Integrator should confirm the format or request minimal structured `{home,current}` contract clarification; do not hardcode translations.
- CTA uses native `<a>` with supplied `inspirationHref`, shared primary styling and Icon; integrator supplies actual `#bouquet-inspiration` fragment. No route/content lookup or client boundary.

## Checks

- `npx eslint src/components/widgets/BouquetsHero/BouquetsHero.tsx --max-warnings=0`: PASS after correction of explicit Image alt lint warning.
- TypeScript program rooted at widget and `next-env.d.ts`, using parsed project tsconfig options with no emit/incremental: PASS.
- PostCSS parse and mapping of all `styles.*` JSX references to CSS selectors: PASS.
- Six screenshot files present. No full project build, browser, keyboard, responsive geometry, localized semantic or accessibility inspection was run while parallel integrations were unfinished. No visual or acceptance PASS claimed.
