# About — implementation plan before UI

## Scope and sources

Next authorized frontend increment after Home: `/{locale}/about` in EN/RU/SR, preserving `development` and existing work. No catalogue-card behavior, forms/backend or contact destinations are introduced. Use current visible About roots Desktop67:3045, Tablet67:3399, Mobile68:3655. Parent inspected all three fresh screenshots, the section outlines and scoped tablet Hero/Story/Style and mobile Why; supporting detail is in `about-intake.json`. That JSON is explicitly partial, not permission to invent remaining appearance fields.

Eight native IMAGE identities and runtime dimensions are independently verified in `about-asset-map.json`. All are supplied mocks. Only visible principles strip73:1715 is rendered on desktop; hidden67:3308 and old temporary images/vector branches are not extra content.

## Composition and ownership

- Keep the route thin; `components/pages/AboutPage` owns six semantic sections: Hero, Story, Principles, Style, Why OLA, final enquiry CTA.
- Reuse server Header/Footer, ActionLink/EnquiryLink, typography and supplied SVGs. Add no universal section/card framework for hypothetical future pages.
- `content/about.ts` owns localized page text, image records, meaningful alt text and stable IDs. `i18n/messages/about/{en,ru,sr}.json` owns page action/accessibility labels. English is source mock copy, not final owner-approved business content; RU/SR remain explicit drafts.
- Page remains a Server Component. Our story navigates to the implemented `our-story` anchor. Catalogue CTA uses the existing locale-aware `/bouquets` route; missing WhatsApp uses the existing explicitly disabled state. No new page-local browser state is needed.
- Existing compact navigation can derive an About context label from its supplied link labels/current localized pathname at tablet widths if the native Header confirms it. Do not introduce request headers/middleware or make the page client-side merely to determine the active route.

## Responsive reference intent

Desktop: full-bleed760px Hero with604px copy region; Story photo604×432 with narrative480px and botanical220px; blush four-value strip; Style copy660px + three249px square photos with8px gaps; Why photo604×320 and two-column reasons; full-photo420px final CTA.

Tablet: Hero keeps photo behind copy,536px reference height; copy320px and H1 44/46. Native937px photo width is an art-direction reference, not mandatory page overflow. Story uses two340px columns/gap24, with botanical/signature inside narrative column; narrative H2 36/38, paragraphs16/25 with12px separation. Style stacks copy above three equal square photos with16px gaps; H2 36/38 with explicit source line break after Modern. Why photo precedes copy/reasons. Principles wrap2×2.

Mobile: copy-first Hero plus square320px photo; Story photo→narrative→botanical/signature; Principles2×2; Style two small square photos followed by full-width square third; Why square photo→copy→four reason rows; CTA wine/dark copy band→photo with editable handwritten phrase. H1 38/40, H2 32/34; native section dimensions are reference snapshots, never fixed total-page heights. Preserve expansion for RU/SR and continuous320px/intermediate behavior.

Handwritten lettering stays editable Great Vibes, with a legible Cyrillic fallback for draft RU as on Home. Use supplied botanical transparency (FIT), not geometric substitutes. Why reason icons map flower/pencil/leaf/heart; use matching supplied SVGs after inspecting them.

## Required sequence

1. Read the existing intake and exact asset map. Complete the remaining scoped native T/M and desktop Why/CTA details needed for implementation, including text styles, overlay colors/crops, icon placements and paragraph boundaries. Append verified facts/limitations to intake BEFORE writing the corresponding UI. Split large contexts into children instead of accepting a section-plan response as a full style read.
2. Create typed content/action messages and the server page composition with local CSS; no Header/Footer duplication. Keep pending facts explicit.
3. Parent integrates the route, typed message augmentation and selected-locale server loader. Preserve true404 behavior for unimplemented routes/unknown locale and avoid changing `/about` without locale into an English page.
4. Add behavior checks for story-anchor navigation, locale switching on `/about`, semantic section coverage, image alternatives, not-configured enquiry and responsive/localized overflow. TDD is selective; static visual composition does not require contrived unit tests.
5. Run lint/typecheck/unit/production build/e2e after all writers finish. Capture actual EN/RU/SR browser renders and compare native reference widths and intermediate sizes. Review crops/type/spacing and perform independent own-subagent code/visual reviews on ordinary Luna6.

## Acceptance/release boundaries

About is implemented only when the actual route renders and passes integrated browser/locale checks. Partial intake, a saved plan or a child completion summary does not establish delivery. Do not claim pixel-perfect fidelity, WCAG certification, production content approval or deployment from source inspection alone. Real WhatsApp/Instagram, approved localized copy, final imagery/rights and publication SEO/domain remain separate owner inputs. Routine work/reviews use spawned subagents, not existing teammate profiles.
