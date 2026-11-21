# Page composition / CSS Modules refactor QA

## Scope

User-requested architecture: app owns routing; pages own composition; widgets own complete sections/functional blocks; shared owns primitives. No redesign, route/content changes or new page implementation.

HomePage now composes HomeHeroBlock, HomeServicesBlock, HomeMoodBlock, HomeCustomExtrasBlock, HomeMeetBlock and HomeEventsBlock. AboutPage similarly composes AboutHeroBlock, AboutStoryBlock, AboutPrinciplesBlock, AboutStyleBlock, AboutWhyBlock and AboutCtaBlock. The twelve server-compatible widgets live under `components/widgets/{HomeBlocks,AboutBlocks}` and receive typed content plus ready UI labels. No translator-function props, client boundary or widgets→pages imports were introduced.

Section markup was extracted from the actual existing TSX using the installed TypeScript parser, not recreated from screenshots. The same family-owned CSS Module supplies common typography and section styles without importing anything from pages; page CSS contains only its wrapper policy. All authored CSS is now `*.module.css`. Application.module.css provides locally rooted tokens/reset/accessibility rules; Tailwind packages, loader and globals.css are removed. Low-priority reset layers preserve component overrides.

## Validation

Parent ran `npm run check`: lint/typecheck,9 unit checks, production build and86 Playwright checks passed. New architecture checks enforce downward imports, six named widget children rather than page section markup, and CSS Modules-only source styles. Font glyph/locale, navigation and responsive regressions remain green.

`before/manifest.json` records18 production states from the existing pre-refactor build; `after/manifest.json` records18 matching states after refactor (Home/About × EN/RU/SR ×1440/768/360). Every response200; no page errors or document overflow. Full-page screenshots and `comparison.json` accompany the manifests.

All nine Home screenshots are pixel-identical. All measured element text/order, geometry, font properties, colors, borders and display match across the18 cases **except one pre-existing user source change**: About CTA heart is64px in the current source/CSS versus20px in the older compiled baseline, producing nine image-geometry differences. The refactor preserves the user's64px source rather than reverting it to match an older build. About screenshot differences are confined to that heart plus subtle photo raster variance in one Serbian desktop Why image; cropped before/after visual inspection showed the same crop, overlay and lettering. This is not a claim of zero differing pixels for every About capture.

After the full check, widget prop signatures were made readable named types (format/type-only, no JSX/style/runtime changes). Parent reran lint/typecheck and all9 unit checks successfully. Independent read-only architecture/code review (`deleg_ef970a6a`, ordinary Luna6) returned PASS with no important defects, confirming layer direction, composition, typed labels, server boundaries and scoped CSS. Its assessment of the Serbian photo variance relies on parent crop inspection, not a separate pixel-parity certification. All work runs as UID1000 with Node24.22.2 selected for project commands; no recursive chown, commits, staging, deployment or unrelated page work.
