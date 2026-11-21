# Google Fonts migration QA

## Implementation and root cause

`src/styles/fonts.ts` now uses `next/font/google`, keeping the three existing CSS variables and preload/display policy. Manrope is variable200–800 normal; Cormorant Garamond variable300–700 normal/italic; Great Vibes400 normal. All request latin/latin-ext/cyrillic. No runtime dependency or architecture change was added. The four manually supplied TTF files, three companion OFL copies and pinned SOURCES.md were removed.

The Russian script defect was **explicit CSS substitution**, not missing glyphs or broken next/font integration: both Home/About had locale-specific handwritten rules selecting Cormorant italic. Home's comment incorrectly claimed Great Vibes lacked Cyrillic. Before deletion, `fc-query` of the old TTF showed Cyrillic coverage400–45f. Real Chrome glyph inspection confirmed CormorantGaramond-LightItalic before the fix, and GreatVibes-Regular afterwards. Both overrides and the false comment were removed; no English substitution or fallback font was used to hide the issue.

## Executed verification

- Installed Next documentation and generated font API declarations were checked for subsets, variable weights and styles.
- Parent `npm run check` passed lint/typecheck,6 unit tests, production build and86 Playwright tests after removing vendored assets. This includes12 new Chromium actual-glyph regression cases across both pages and all locales on desktop/mobile. They inspect CDP platform fonts, not merely computed font-family or `document.fonts.check`, and reject fallback glyph rendering. Variable-font internal family names are Cormorant Garamond Light / Manrope ExtraLight; these are not the CSS-selected weights.
- Before and after production browser manifests cover18 cases each: EN/RU/SR × Home/About ×1440/768/360. Every page returned200, with no page errors, document overflow or browser Google Fonts requests. Google downloads are a build-time dependency, as explicitly requested.
- Every measured visible script paragraph in all18 after cases rendered using Great Vibes only. Parent visually inspected Russian Home mobile, About mobile Story and tablet Hero, English desktop Home Hero, and Serbian mobile changed-heading sections.
- Measured h1/h2 heights stayed unchanged except two Serbian headings at360px: Home `Cveće prema raspoloženju.` and About `Pažljivi detalji čine razliku.` now occupy two lines rather than one. They remain readable without collision/clipping; no font-size reduction or forced width was introduced to disguise the change.

`before/` and `after/` contain route/width-labelled hero screenshots, Russian Story captures and actual-font/heading measurements in `manifest.json`. After also contains the two Serbian wrapping sections. These evidence files supersede earlier Home/About font rendering captures for this change; older evidence remains historical rather than silently regenerated.

A focused independent read-only code/visual review (`deleg_1cd99429`, ordinary Luna6) returned PASS with no important defects. It verified configuration, removal of vendored files/RU overrides, actual-glyph regression coverage and selected EN/RU/SR screenshots; no files were changed by the reviewer. No public release or broad design acceptance is claimed; unrelated page implementation stays paused.
