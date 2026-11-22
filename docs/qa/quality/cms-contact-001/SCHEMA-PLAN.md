# OLA-CMS-CONTACT-001 — Studio schema plan (additive, NOT released)

## Status
Planning only. `count_as_delivery_unit: true`, `delivery_state: awaiting_review`, `review_status: source_pattern_automated_evidence_pending_supervisor_review`. Nothing here is integrated into Studio, and no `/contact` allowlist is active. Shared guards currently do NOT allow Contact direct Studio integration; this plan is documented here only until a later release.

## Sanity project / dataset
projectId: `zhn2ddaj`, dataset: `production`. Studio URL from `src/content/sanity/preview-policy.ts`.

## Singleton schema: `contactPage`
Additive Sanity document type `contactPage` (singleton), flat fields mirroring `ContactContent` (`src/content/sanity/contact.ts`), same-locale localized string fields:
- heroTitle, heroBody, heroAction, heroScript
- geoEyebrow, geoTitle, geoBody
- processEyebrow, processTitle, step1Title/Body … step4Title/Body
- caption, faqEyebrow, faqTitle, q1/a1 … q7/a7
- Image fields (non-localized, shared canonical crop/hotspot): hero.photo, geography.photo, editorial.photo, question.photo, custom.photo, events.photo

Photo slots reuse strict canonical crop/hotspot; no per-field independent cropping.

## Studio structure
- Singleton `contactPage` registered in Studio structure (3 locations: linked from Contact page group; grouped under a Contact section; globally searchable).
- Exact allowlist routes: `/{en,ru,sr}/contact` only. No other routes. No wildcard, no product-future pages.
- Edit groups map to `contactEditing()` paths: `path=<field>.<locale>;id=contactPage;type=contactPage` plus `path=<field>.photo;id=contactPage;type=contactPage` for image slots.

## Preview / Draft Mode
- Draft Mode gate: `draftMode()` from `next/headers` → `isEnabled` gates preview.
- Draft precedence per field: draft → published → local (same locale).
- Published fetch: `perspective=published`, ISR revalidate 60s, `contactPage` identity.
- `contactEditing` disabled when not preview or when `SANITY_API_READ_TOKEN` / `SANITY_PREVIEW_ORIGIN` missing.

## Not in this plan
- No credential values in the schema (`SANITY_API_READ_TOKEN` / `SANITY_PREVIEW_ORIGIN` env-only, redacted).
- No business-data fields made CMS-editable unless existing types cleanly permit validated editing (contact destination, phone, mail, map, hours, addresses, handles stay code-owned).
- No deployment, no Git, no cloud content seed.
