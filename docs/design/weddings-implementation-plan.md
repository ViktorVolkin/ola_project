# Weddings & Events — pre-UI implementation plan

## Scope and sources

Next bounded frontend increment after verified Home/About preview, on `development`, following the owner's autonomous continuation instruction. No staging, commits, deployment or Figma edits. Route: `/{locale}/weddings-events` for EN/RU/SR. Catalogue action/product-slug hold is untouched.

Current OLA roots: desktop105:2977, tablet105:3329, mobile106:3476. Own intake worker inspected all18 content-section states and persisted `weddings-intake.json`; parent independently read root structures, category internals, CTA image geometry and compact header structure, and viewed current D/T/M Figma screenshots. `weddings-asset-map.json` supersedes the intake's initial asset-export failure:11 desktop placements use10 byte-verified supplied images. Hero/approach/final-CTA source fills were additionally verified at tablet/mobile. Other compact raw fills are not independently claimed byte-verified.

## Page ownership and order

- Thin `src/app/[locale]/weddings-events/page.tsx` composes a server-rendered WeddingsPage, no broad client boundary.
- Page composition and only its main-wrapper CSS under `src/components/pages/WeddingsPage/`; all six substantial section components and their section-owned CSS under `src/components/widgets/WeddingsBlocks/`. Typed content/images live in `src/content/weddings.ts`; page UI namespace in `src/i18n/messages/weddings/{en,ru,sr}.json`, integrated through request loader/type augmentation. Widgets must not import from pages.
- Compose exactly six visible sections: editorial Hero → four service categories → approach → four-step process → four inspiration images → wine/bride closing CTA. Shared Header/Footer remain in the locale layout.
- Existing ActionLink/EnquiryLink/Icon primitives are preferred. Keep page-specific category styling local; do not introduce a universal card system. No new dependencies are required.
- English visible copy comes from native sections. RU/SR translations and newly needed accessible UI labels are drafts pending approval; do not add promises, prices, availability or recipient details.

## Responsive and visual rules

- Desktop Hero is a real full-bleed supplied image plus the native ivory fade, with editorial copy overlaid. Tablet/mobile place copy before a full-width photo strip; Great Vibes lettering stays editable and changes native color/size by state.
- Categories are four across, then2×2, then one column. Preserve photo/copy proportions and44px circular affordances. Grow cards where longer localized content needs it; do not hide overflow to imitate fixed Figma frames.
- Approach is desktop copy/photo, compact copy then photo. Our process is a semantic ordered list:4/2/1 columns, native connector treatment only at desktop.
- Inspiration is4/2/1 columns with the verified four photos and visible captions, not inferred products or invented detail links.
- Final CTA is wine copy plus bride image; tablet remains split, mobile stacks. Native desktop source rectangle780×883 is top-aligned in a clipped780×640 viewport; centered object-fit would materially change the crop. Tablet/mobile use their own FILL proportions.
- Reference section heights are snapshots, not whole-page fixed heights. Check at1440/768/360 plus320/390/1024 and breakpoint-adjacent widths with actual EN/RU/SR.
- Tablet header's visible context is native `Weddings` at I105:3330;67:3369 (13/18, underline). Mobile has no visible page-context label: its Navigation ancestor is hidden. Do not copy the intake's mistaken mobile-label interpretation or alter Home/About chrome.

## Navigation/enquiry boundary

- Breadcrumb Home can use the existing locale-aware root; current breadcrumb item is text, not a guessed destination.
- Our process is a local anchor to the existing process section; stable technical ID is an implementation detail, not a new product route.
- Lead Designer confirmed the scoped contract after a fresh root read: Hero Plan your event, section Discuss your event and final CTA are user-initiated general event WhatsApp enquiries; category arrows preserve the exact selected category topic (Weddings / Private Events / Corporate Events / Event Rentals). None use new routes or anchors. Inspiration cards remain informational; if later made interactive they must retain the precise visible scene topic. No automatic sending/booking/payment. General event actions do not inherit an arbitrary category/scene.
- Designer confirmed these three roots remain the current implementation reference despite mock/review naming; no replacement set was identified in the scoped review. This is not owner production approval. The cited designer-side `docs/operations/weddings-builder-brief.md` was not present in the frontend mount, so this update relies on the explicit designer message and current Figma reads, not a claimed local read of that brief.
- Final WhatsApp CTA remains the existing explicit nullable-contact preview state, with localized explanation. No silent no-op, fake `#` contact URL, automatic sending, backend or booking claims.

## Validation and acceptance

1. Add namespace parity/Serbian Latin checks to existing unit coverage; add focused regression assertions for page order, semantic headings, process anchor and actual approved control destinations.
2. Integrate server route and tablet-context label with a regression that preserves Home/About behavior.
3. Parent run lint/typecheck/unit/build/production browser suite. Inspect real rendered D/T/M sections and localized variants; check overflow, heading wrapping, crop selection, CTA contrast and focus.
4. Save screenshots with build/source identity, retain failing initial evidence separately if relevant, and obtain own-subagent spec/visual review followed by code-quality review. Parent verifies important findings and final integrated artifact.
5. Apply the owner's mandatory completion gate: parent review of all page code and affected shared dependencies, browser checks across locales/reference/intermediate widths/breakpoint neighbors, full compact-header and nested locale interactions, runtime/assets/link checks, then rerun after fixes. Inspect suspicious or obsolete patterns against installed docs; fix local technical defects, escalate product/design/major architecture changes. A child completion label is not acceptance.
6. Update current README/QA status only to what execution proves. Preview completion is not owner/Lead Designer release approval, translation approval, rights clearance, a WCAG audit or a public deployment.
