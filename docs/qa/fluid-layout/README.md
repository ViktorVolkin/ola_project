# Home/About — fluid layout and CSS ownership refactor

## Scope

- HomePage and AboutPage remain server composition layers: six typed section widgets each, no section implementation in the pages.
- Each section owns its CSS Module, markup and responsive image configuration. Small common modules contain typography/base presentation only. About uses explicit local `composes` aliases; Home shared editorial/handwritten defaults have zero specificity so section overrides do not depend on CSS import order.
- `shared/Container` owns centered layout: `default` caps the content track at 1280px; `wide` caps the outer chrome at 1440px. Shared horizontal gutters are continuous (20–80px). Hero/Events/CTA backgrounds stay full-bleed, with constrained editorial copy inside Container. Deliberately asymmetric About Story/Style image compositions remain asymmetric.
- MobileNavigation uses Radix Dialog, not an in-flow disclosure. The dialog portal handles focus containment/restore, background isolation and scroll lock. Explicit Close, Escape, backdrop, navigation-link and desktop-resize dismissal are covered. First Escape closes the focused language disclosure; the next closes the modal.

## Executed verification

Final runtime build: `5MbiPaf7-5NchLLtm0plW`.

Source SHA-256 (sorted `src` files plus package.json, package-lock.json and next.config.ts; each relative path, NUL, bytes, NUL): `48264e6e83417773fef6ad5c85d91d75959adc6114ef453610a0905272465daa`.

- `npm run check`: lint, project typecheck, **10 unit tests**, production build and **108 Playwright tests** passed.
- Responsive E2E sweeps Home/About in EN/RU/SR at **37 widths**, including 320/360/375/390/430/600/768/900/1024/1200/1366/1440/1920 and ±1px around every composition threshold. Tests assert document bounds, text bounds/clipping and runtime errors. The intentional mobile Mood rail is independently keyboard-tested.
- Navigation tests cover translated dialog names and trigger relationships in EN/RU/SR, visible/hidden tablet About context, cycling Tab/Shift+Tab, focus return, all dismissal paths, real wheel-scroll lock/restoration, unchanged background-header geometry, nested language Escape from both trigger and focused language link, and desktop resize.
- Separate screenshot/DOM capture sweep: **114 route/locale/viewport cases**, all HTTP 200, no page errors or document overflow. Results and screenshots are in `after/manifest.json` and `after/*.png`; captures decode images and await fonts before recording. The initial baseline remains in `before/`.
- Reference comparison at 360/768/1440: 18 route/locale cases, 423 uniquely matched heading/paragraph boxes. No >2px x/y/height deltas were found. Six width-only differences are the About Story signature's available flex box on compact layouts; its explicit line breaks and text position remain unchanged. This is a DOM-geometry comparison, not a pixel-parity claim.
- Parent visually inspected rendered full pages and native section crops, including Home desktop hero, About desktop, Russian mobile and 1024px About, and Serbian tablet Home. Known extraction regressions were corrected: missing HeroCopy rules, broken cross-module typography/crop selectors, incorrect shared-default specificity and nested Escape ordering.

## Remaining width breakpoints and reasons

These are widget-local composition decisions, not global mandatory tablet/desktop sizes. Max-width counterparts (559/639/699/999/1119/1159/1199) describe the same boundaries.

| Boundary | Owner | Composition reason |
| --- | --- | --- |
| 560px | About Principles | Two-column items change from vertical icon/label groups to horizontal groups once labels have enough width. |
| 600px | Home Hero | Stacked actions can form a wrapping row; the square photo becomes a landscape composition with its caption relocated. |
| 600px | Home Services | Single cards become two columns, with Weddings spanning the row; narrower cards would squeeze captions and the arrow target. |
| 600px | Home Mood | Native horizontal mobile rail becomes three visible flexible columns. |
| 600px | Home Custom/Extras | Custom copy and photo share a row instead of stacking; Extras remain wrapping content. |
| 600px | Home Meet | The handwritten caption moves from editorial copy onto the photo. |
| 600px | Header | Compact phone header omits the enquiry action/context and uses the shorter header/dialog offset. |
| 640px | About Hero/CTA | Separate copy/photo panels can become overlays without competing for the same narrow space. |
| 640px | About Style | Two images plus a full-row third image become three peer columns. |
| 640px | About Why | Single-column reasons become two columns and the photo changes from square to landscape. |
| 640px | Footer | Stacked groups become a three-column footer. |
| 700px | About Story | Photo and readable narrative can share two columns; the signature/botanical group remains below the narrative. |
| 768px | Header About context | The compact header can expose the current-page label while retaining its enquiry/language/burger controls. Verified in all three locales. |
| 1000px | About Principles | Four horizontal icon/label groups fit one row instead of a two-by-two grid. |
| 1120px | About Story | Narrative and signature/botanical illustration can occupy separate tracks alongside the photograph. |
| 1120px | About Style | Editorial copy and a three-photo rail can share a row while keeping useful copy/photo widths. |
| 1160px | About Why | Photograph and the copy/two-column reason grid fit side by side without squeezing the reason text. |
| 1200px | Home Hero/Meet/Events | Editorial copy can overlay the full-width photograph while preserving usable text measures and image subject space. |
| 1200px | Home Services | Three peer service cards fit on one row. |
| 1200px | Home Mood | The introduction becomes a dedicated left track beside the three-card grid. |
| 1200px | Home Custom/Extras | The complete Custom panel and Extras block can share a row. |
| 1200px | About Hero/CTA | Compact overlays become wider desktop editorial compositions; copy alignment and handwritten-caption placement change. |
| 1200px | Header | Complete desktop navigation replaces the modal trigger; an open dialog closes and releases its scroll lock. |

Home Events has **no 600px breakpoint**: its compact photo height and editorial gap interpolate with `clamp()`. There are no width-specific 360px or 1200–1439px pixel patches. Typography variants follow their associated composition; hover and reduced-motion queries are capability/preferences, not viewport breakpoints.

## Review and acceptance boundaries

An initial independent read-only review found no confirmed blocking source defect but returned an inconsistent negative verdict with an empty blocker list. The final independent code/spec review (`deleg_782ce326`, ordinary Luna6) returned `passed: true`, with no blocking findings or suggestions, after inspecting the current page compositions, widgets/styles, Container usage, CSS Module overrides, modal/disclosure Escape handling and responsive breakpoints. The code-review gate is closed; this verdict does not claim fresh browser or owner visual acceptance.

This refactor uses the recorded approved Figma intake and pre-refactor browser references. The final capture sweep is not a fresh live-Figma pixel-parity review or owner/Lead Designer production acceptance. RU/SR remain editorial drafts, WhatsApp recipient remains unconfigured, unfinished routes remain real 404s, and no public deployment, staging or commits were performed.

Task-owned production servers were stopped after verification; ports 3000/3100/3120 were checked free.
