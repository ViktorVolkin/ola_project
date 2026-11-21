# Bouquets — implementation plan / bounded intake

**Status: NOT IMPLEMENTED / PRESENTATIONAL INPUT READY.** The original Figwright export EACCES is resolved; see [continuation evidence](bouquets-intake-completion/continuation-evidence.md). The current [readiness packet](bouquets-intake-completion/implementation-ready.md), [crop map](bouquets-intake-completion/crop-map.json) and [copy/style map](bouquets-intake-completion/copy-style-map.md) supersede the historical pending statements below. All 57 placements and 12 source files are accounted for; source bounds using centered native-default FILL/FIT remain conditional on the unserialized transform, and visual/browser acceptance is not asserted. [Task cards](bouquets-intake-completion/proposed-taskcards.md) authorize only non-public disabled preview for held cards; P01 wiring remains OWNER HOLD. No route, UI, product slug, or held action was added.

**Fresh source verification (2026-11-14):** [INTAKE-002 evidence](../qa/bouquets/intake-002/README.md) re-exported 57 current IMAGE leaves and checked 12 original files; unexposed imageTransform remains a conditional-crop limitation. This document's historical NOT IMPLEMENTED status predates the later frontend preview reported in the root README; no current UI or visual acceptance is asserted by this intake. P01 remains OWNER HOLD and actual integrated review is separate.

## Sources and access

- Canonical OLA Figma file `l0Te0ZppAJZ3LSIIrcRZ5n`; [historical partial metadata](bouquets-intake.json), now superseded for native design by [responsive intake](bouquets-responsive-intake.json), [editorial copy](bouquets-editorial-copy.json) and [card index](bouquets-cards-intake.json).
- Current official MCP `get_metadata(106:3849)` succeeded: Desktop1440×3154, five content sections and shared Header/Footer. This is topology/box data, not verified text characters, colors, typography, gradients, image identity/crops or action semantics.
- The earlier official context/T/M batch hit Starter limits; browser fallback returned CloudFront403. A later fresh Figwright listing exposed OLA session `id-mw458rx6-0toep87a`, now agent-locally bound and successfully read. [Exact access receipt](design-access-continuation.md) separates these interfaces; the old empty listing is no longer the parent availability claim. No gateway/config/auth/canvas change or upgrade was attempted.
- Current D106:3849/T106:4294/M106:4757 roots and screenshots are read: Desktop4×2, Tablet/Mobile2×4 inspiration cards; Mobile seasonal2×2 versus Tablet/Desktop4-up; compact copy-before-photo versus Desktop split. Scoped details still take precedence over whole-page screenshot estimates.
- [Supplied local assets](bouquets-local-assets.json):12files have actual SHA256/size integrity matching the supplied manifest. Manifest dimensions are recorded as such. This is **not** native-Figma identity/crop verification or a final asset-slot map.

## Grounded composition

1. Editorial Hero: photo instance106:3907, ivory fade106:3909, copy106:3910, script accent106:3922.
2. Five style-selector anchor instances in106:3944, not an invented filtering system. [Existing Lead association confirmed](bouquets-action-contract.md#catalogue-style-selector--statement-target-confirmed): Statement→Wild Beauty, visible card anchor, not Detail/product identity; accessible focus and reduced motion required, all eight cards retained in order. Reassess if final photos change; P01 unchanged.
3. Inspiration106:4061/grid106:4063: eight metadata-named cards,4×2 at Desktop. Card action policy remains held.
4. Custom bouquet CTA106:4160, band106:4161, BQ11-named scene106:4173 and fade106:4175.
5. Seasonal ending106:4176/grid106:4182, four BQ12-named crop tiles.

These names indicate design roles, not proof of photo byte identity or approved content entities. No availability, prices, delivery claims or SKU/product slug inferred.

## Architecture once input is sufficient

- Thin `app/[locale]/bouquets/page.tsx` owns route/metadata/locale and explicitly composes the existing Footer, preserving the current normal-page shell.
- `components/pages/BouquetsPage` owns complete server page composition and page-specific content/messages. Meaningful Hero/selector/catalogue/custom/seasonal blocks belong in widgets and reuse existing Container/ActionLink/Icon/EnquiryLink and established image/crop patterns when appropriate.
- Keep static sections server-rendered. Introduce no client filter/global state/catalogue infrastructure unless an actual approved interaction requires it. Use natural anchor navigation for a confirmed anchor contract.
- Page content and translated UI follow existing EN/RU/SR ownership. RU/SR are drafts, not silently approved.
- Real missing recipient continues to produce the existing localized disabled enquiry state, not fake URLs or successful submissions.

## Editorial source intake — bounded verification

- [Child Desktop editorial evidence](bouquets-editorial-assets.json) contains Hero/custom frames and four seasonal crop-instance rectangles. [Parent check](../qa/bouquets/editorial-assets-parent-check.json) independently re-exported three original IMAGE fills and matched native hashes, frontend original bytes and supplied runtime files; dimensions/byte counts also checked.
- Accept the three source identities, not a universal crop verdict. Desktop rectangles remain attributed to the child's readback; only Spring's inner seasonal IMAGE was exposed/exported. The other three tile sources/alpha masks, ancestor/transform details and all T/M editorial crops remain unverified. Do not turn a shared montage label or missing serialized node into proof of matching crops.
- Production fingerprint is unchanged; no UI, actions, routing or Figma canvas edits were made. P01 remains OWNER HOLD.

## Required before UI implementation

1. Recover high-fidelity complete D/T/M context/screenshots, section-level type/spacing/overlay/control fields and full body/action copy. Do not implement metadata names as assumed final text.
2. Verify every actual IMAGE descendant and clipping recipe against supplied files; map all placements/reuses, including seasonal crops.
3. Preserve the [existing clarified contract](bouquets-action-contract.md): P01 eight-card actions remain explicit OWNER HOLD, not a choice delegated to implementation. Home Mood is separately defined by LEAD semantic design: Soft & Romantic→Soft Romance, Bright & Joyful→Sunset, Natural & Airy→Natural & Airy, localized catalogue anchors with all eight cards visible/no filters. These labels are not verified sellable compositions or Detail slugs. Create actual targets before wiring fragments; do not ask the owner again because this message arrived.
4. Preserve held parts when unresolved; implement only independently fully specified sections, not speculative product behaviour.
5. Record the actual accepted intake/map, then bound implementation ownership and integrate. No universal card with unrelated variants.

## QA acceptance

Actual EN/RU/SR production routes, real unknown-slug/locale behaviour, continuous geometry and mobile two-column usability; keyboard/anchor/focus and Header modal/language/scroll checks; exact image identity/crops; runtime/overflow/glyph checks; configured lint/types/unit/build and relevant E2E after final edits; captures/build/source identity and independent scoped review. The known framework404/no-JS issue must remain explicit, not be disguised by a new catalogue route or weaker tests.
