# OLA — design intake and Home implementation plan

## Scope and sequencing

This plan is recorded **before UI implementation**. Work stays on `development`. Figma is read-only. Current task: understand the entire available approved design, map assets/routes/patterns, then implement **Home and the shared interface it needs**, not the other six pages.

Sources: connected Figma file **OLA**, pages `Design` (`0:1`), `Design System / Components` (`55:431`). `Sandbox / Figma Tests` is not assumed to be production authority. Existing local reference PNGs are secondary and were not substituted for current Figma.

Intake completed: parent read Home's three roots, scoped full-detail sections, foundations/components, responsive rules, navigation states and R06; Design Analyst read all 18 other D/T/M root structures, six desktop screenshots, selected full sections and handoff boards. Parent checked the six non-home desktop structures and screenshots against that report. This is full-page structural/interaction intake, **not a claim that every non-home styling field has been extracted**. Fetch scoped full-detail context again before implementing those future pages.

## Route ↔ Figma ↔ assets inventory

All routes below have `/en`, `/ru`, `/sr` equivalents with shared segments/slugs. Asset folders are under `public/assets/images` and served as `/assets/images/...`.

| Page / target route | Desktop / tablet / mobile roots | Sections and asset ownership |
| --- | --- | --- |
| Home `/{locale}` | `1:22` / `55:439` / `57:3038` | Hero → 3 services → mood inspirations → custom + extras → Meet OLA → Events; shared header/footer. Eleven exact image matches are in `home-asset-map.json`; several intentionally come from `about/` and `bouquet-detail/`, not just `home/`. |
| About `/{locale}/about` | `67:3045` / `67:3399` / `68:3655` | Hero → story/botanical → principles → style photos → Why OLA → final CTA. `about/01`, `02`, `08`–`12`, supplied botanical PNG. |
| Balloons `/{locale}/balloons` | `98:2166` / `98:2496` / `98:2959` | Hero → 4 categories → 4 favourites → personalisation + 4 extras → final CTA. Hero explicitly reuses Home01; other scene aliases need exact fill matching before this page's implementation. Do not assume balloons01 is the hero. |
| Weddings `/{locale}/weddings-events` | `105:2977` / `105:3329` / `106:3476` | Hero → 4 service categories → approach → process → inspiration → wine/bride CTA. weddings-events05 hero,01–04 categories,12 approach,11/07/08/09 inspiration,01 reused bride. |
| Bouquets `/{locale}/bouquets` | `106:3849` / `106:4294` / `106:4757` | Hero → style selector anchors → 8 inspirations → custom CTA → seasonal tiles. bouquets01/02/03–10/11; seasonal tiles crop bouquets12, not four new photos. |
| Bouquet Detail `/{locale}/bouquets/{slug}` | `107:5266` / `108:5654` / `113:6259` | Gallery + enquiry preferences → related inspirations → custom CTA. bouquet-detail01–14, plus bouquets11 for custom band. Product slug/content contract still pending. |
| Contact `/{locale}/contact` | `119:4999` / `119:5396` / `119:5796` | Hero → Montenegro/location/date → 3 topics → process/photo/FAQ. contact01/02/03 confirmed by role;04–06 need exact fill check. Do not use07/08 merely because supplied. CT02/03 crops must exclude baked filename strips. |

Non-home asset assignments above are role-based intake with varying confidence, **not byte-verified mappings**. Home is byte-verified: original Figma imageHash equals SHA-1 of the local supplied image in all 11 cases. No Figma screenshot becomes a runtime image.

### Cross-page responsive findings

- Shared desktop navigation becomes compact navigation on tablet/mobile; Montenegro remains a location, not a locale selector.
- Most photographic desktop copy overlays become copy-before-photo stacks at compact widths; do not blindly apply one responsive transform to every section.
- Bouquets catalogue and related cards remain two columns on mobile. Balloons favourites also remain 2×2 mobile. Weddings categories/process/inspiration become single-column mobile.
- Home tablet services use a wrapped arrangement; mobile services stack. Mood becomes a true horizontal rail only when overflowing. Extras use a width-driven grid, not item-count-specific centering.
- Figma reference states do not define automatic reflow or exact browser breakpoints. Use CSS layout and verify intermediate widths.

## Shared patterns and ownership

### Implement now because Home needs them

- `shared/`: native SVG outline icons, one button-style primitive with primary/secondary/light variants, generic container and text-link treatment. Generic primitives remain translation-agnostic. Native anchor for navigation; button for actions.
- `widgets/Header`: server wrapper owns navigation labels/content; narrow client island owns compact disclosure and its state. Wordmark is editable Cormorant text plus Manrope caption, as in Figma, not a guessed logo image.
- `widgets/LanguageSwitcher`: EN/SR/RU native language names; select equivalent localized route, outside click/Escape closes, keyboard focus behavior. Reuse for header/footer. No need for a global full-message client provider.
- `widgets/Footer`: shared studio identity, destination links and language control.
- Meaningful Home blocks: service cards, mood rail, custom callout/extras, editorial photo sections. Keep Home-only composition/sections under `components/pages/HomePage` unless actual reuse warrants a widget. Do not create a universal card with a large matrix of unrelated variants.

### Recognize now, implement only when requested

Catalogue cards/selectors, event process rows, contact topics/FAQ, gallery, fullness radios, extra checkboxes and optional enquiry fields. Their design contracts inform reusable primitives, but they are not part of the current Home scope.

## Design facts already grounded

- Desktop Home width1440; side gutters80; header96. Tablet768 uses32 gutters and header96; mobile360 uses20 gutters and header80.
- Palette: ivory `#FAF7F2`, wine `#641323`, hover `#4D0E1A`, ink `#241E1B`, secondary `#655C56`, blush `#F1E4DE`, border `#D9CCC4`, on-wine `#FFF9F3`, dusty rose `#C99290`.
- Display: Cormorant Garamond Medium80/78 desktop, mobile initial38/40. H2 desktop52/54, mobile32/34. Body Manrope16/25, supporting14/21; eyebrow11/16 with2px tracking. Preserve wordmark/caption-specific styles rather than applying body minimums to the logo.
- Buttons:48px height,24px horizontal padding,12px icon gap,24px radius. Standalone interactive targets at least44px.
- Approved photo fades are real design overlays, not substitutes for missing imagery. Desktop Hero/Meet/Events gradients and editable Great Vibes lettering are separately specified by their actual Figma nodes.
- R06 `126:6106`: hover only for hover-capable pointers; independent `:focus-visible` outline; no focus-induced dimension/layout changes. Export safety margins are not runtime control padding.

## Open design/product decisions — asked of Lead Designer

### Clarification received before UI implementation

Lead Designer confirmed that **the numeric responsive board is stale, not Home**. Preserve the accepted full-page Home geometry: mobile Mood cards240px with square photos; Extras152×116 photo treatment with centered third item; native Home service-card proportions. General accessibility/continuous responsive requirements remain valid. Do not redesign Home to match the older272px/4:5/square-Extras numeric board. This overrides the conflicting numerical guidance quoted elsewhere in this intake.

Home Mood links go to the catalogue's corresponding compositions, not invented product-detail slugs. The catalogue card action policy itself remains a separate future decision. Use stable section anchors as technical identifiers when those catalogue sections are implemented; do not create unapproved product entities.

Items below retain the original questions for traceability; #2 is resolved by this clarification, and #3's Mood destination intent is resolved as catalogue navigation.

1. Confirm current approved frame set: the file contains historical/back-up material and some main roots still have mock/review names.
2. Resolve Home mobile geometry vs later board `57:3029`:
   - root Mood instances are240px square, board requests272px cards/gap16/image4:5;
   - root Extras use152×116 photos with final item centered, board requests min144/max176/gap12/square images, arrow+label row and start-aligned incomplete rows;
   - root mobile services are320×240, board requests16:10 image ratio.
   Do not silently choose a conflicting variant.
3. Determine destinations of Home Mood "View bouquet", "Let OLA choose/create" and extras actions. A mood title/photo does not establish a product slug or a filtering system.
4. Find approved Home/header/footer RU/SR translations. English is present in Figma; no final localized copy has been verified yet. Do not silently present invented translations as approved copy.
5. WhatsApp recipient/templates and any real external contact URLs are not provided. Do not invent them, use `href="#"`, or relabel opening WhatsApp as a completed enquiry. A missing recipient is a bounded interaction gap, not grounds to add backend infrastructure.

## Implementation sequence

1. **Finish intake and resolve design precedence.** Verify analyst findings, persist route/asset map (this document + Home JSON), record designer clarifications. This stage precedes UI writes.
2. **Content and tokens.** Create typed Home content/images from exact Figma copy and the verified asset map; add only necessary namespaced UI messages. Apply actual palette/type/focus tokens to the existing font foundation. Keep pending business values explicit.
3. **Shared chrome.** Add wordmark, header/footer, language disclosure and compact navigation. Server-render links/labels; isolate only interaction state. Keep current locale routing/real404 intact.
4. **Home static composition.** Replace FoundationPage at locale roots with HomePage. Implement Hero, services, mood, custom/extras, Meet and Events in approved order. Use existing supplied assets and deliberate responsive crops. No non-home route placeholders.
5. **Interactive behavior.** Add tested locale/menu disclosure and rail behavior. Preserve CSS scroll/touch/keyboard functionality, focus visibility and reduced motion; controls/peek only if content truly overflows. Wire enquiry destinations only to confirmed contracts.
6. **Responsive/language/visual QA.** Compare browser sections against current Figma at1440/768/360, additionally320 and intermediate widths (e.g.1024/390). Check line breaks, crops, overflow, card wrapping, target sizes and all locales with real content. Explicitly distinguish approved vs provisional translations.
7. **Integration gates and review.** Update foundation e2e assertions to Home semantic headings without weakening locale/404 assertions; add behavior tests where risk justifies TDD. Run lint/typecheck/unit/build/production browser tests; request independent code review and, where useful, Lead Designer visual review. Parent verifies all changes.

## Acceptance and release boundaries

- Home follows current approved composition and clarified responsive rules; no personal redesign.
- Existing architecture, locales, real404, asset integrity and server-default behavior are preserved.
- Navigation/menu/locale controls work with keyboard, focus and pointer; no text-glyph replacement icons, dead pretend actions or silent locale fallback.
- Existing future page links may point to their documented routes, which remain404 until those pages are implemented. Do not claim the whole site or a working catalogue is complete.
- Missing final phone/domain/business content and production image approval are explicitly reported. Keep foundation noindex until the actual launch decision; no real deployment or enquiry sending is authorized by this task.
