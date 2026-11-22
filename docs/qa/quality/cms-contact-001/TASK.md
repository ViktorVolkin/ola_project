# OLA-CMS-CONTACT-001 — Contact CMS integration (task spec)

## Unit
OLA-CMS-CONTACT-001 · category: implementation · count_as_delivery_unit: true · risk_level: high · review_required: true

## Objective
Make the Contact page CMS-editable via Sanity with Draft Mode preview, typed content resolver, edit annotations, preview-status banner, mirroring the accepted cms-about-001 / cms-weddings-001 pattern. Owner authorizes all existing pages as editable; source/pattern + automated evidence accepted now, owner will do manual Studio/live checks.

## Scope (Contact-owned writes only)
- NEW `src/content/sanity/contact.ts` — CMS adapter: `contactContentPath` (flat field mapping = identity), `contactImagePaths` (hero/geography/editorial/question/custom/events → photo slots), text validation, image guard (canonical crop/hotspot reuse, arbitrary-URL rejection).
- NEW `src/content/resolver/contact.ts` — `resolveContactContent(locale)` with draft→published→local fallback, `ContactPreview`/`ResolvedContact` types, ISR 60s published fetch, `contentSource()` env gating, `draftMode()` from next/headers.
- NEW `src/components/widgets/ContactBlocks/contactEditing.tsx` — `contactEditing(locale, enabled)` using `createDataAttribute` (next-sanity) + `ContactEditable` component; disabled when not preview or when `SANITY_API_READ_TOKEN`/`SANITY_PREVIEW_ORIGIN` missing.
- NEW `src/components/widgets/ContactBlocks/ContactPreviewStatus.tsx` — localized preview banner (en/ru/sr) with name/title/exit/fallback/configuration/unavailable labels.
- REWRITE `src/components/pages/ContactPage/ContactPage.tsx` — async page, `getLocale`, `resolveContactContent`, editing helper, wires PreviewStatus + all widgets.
- REWRITE `src/components/widgets/ContactBlocks/ContactHero.tsx`, `ContactGeography.tsx`, `ContactTopics.tsx`, `ContactLower.tsx`, `ContactFaq.tsx` — typed props, editable text/photo slots + `data-sanity` annotations mapping to exact `contactPage` paths; Enquiry/destination/phone/mail/map/business actions remain code-owned.
- NEW `tests/unit/sanity-contact.test.ts` — parser/source/fallback/API-outage/missing-doc/image-guard/draft-priority/default-zero-fetch/contact-actions-unchanged/render-annotation-mapping coverage.
- QA docs: `docs/qa/quality/cms-contact-001/TASK.md` (this file), `FINAL.md`, `SCHEMA-PLAN.md`; baseline `QAfixtures/before-src/` already captured.

## Out of scope (not written, not claimed)
- Studio contactPage schema/groups/singleton/structure, `/contact` allowlist — documented in SCHEMA-PLAN.md only, additive, not released.
- Business values (contact destination, phone, mail, map, hours, addresses, handles) remain code-owned unless existing types cleanly permit validated editing; no invented addresses/hours/mapURLs/phones/handles/business claims/translations/assets.
- No per-widget CMS fetch/env/client token; direct widget imports image source move into resolved typed props.
- No Git/deploy/cloud-content-seed/auth/secret reads, no OS/Hermes/model/permission changes, no deployment.
- Existing locales, meaning, image cropping, CSS, animations, HTML semantics unchanged.

## Locales / viewports
- Locales: en, ru, sr. Preview/viewport sizes: 360/768/1440.

## Acceptance basis (automated evidence now; owner manual gates later)
- `tsc --noEmit` clean on `src/` and `tests/unit/sanity-contact.test.ts`.
- `eslint --max-warnings=0` clean on all owned files.
- `vitest run tests/unit/sanity-contact.test.ts` — BLOCKED in this environment (incomplete rolldown install; no install/tool health campaign permitted).
- `next build` — BLOCKED in this environment (same rolldown limitation).
- Before/after/sanity builds + EN/RU/SR × 360/768/1440 DOM+PNG comparisons — BLOCKED (no build; no browser render path).
- Sol Supervisor review required; owner Studio/live manual verification distinct and pending.

## Constraints
- Fallback order: draft (preview) → published Sanity → local i18n messages; same-locale.
- `contentSource()` reads `CONTENT_SOURCE` → "default" | "sanity" | "preview"; default = zero CMS fetch.
- Published fixed `contactPage` identity, ISR 60s, perspective=published, network error → local fallback.
- No `any`/unsafe casts; annotation paths exact `contactPage` paths (not Home); server-only labels.
- Shared photos: strict canonical crop/hotspot reuse across locales.
- No credential values preserved (`SANITY_API_READ_TOKEN` / `SANITY_PREVIEW_ORIGIN` redacted).
- Sanity projectId: `zhn2ddaj`, dataset: `production`.

## Evidence
- Baseline: `docs/qa/quality/cms-contact-001/QAfixtures/before-src/` (pre-change `src/` copy).
- Typecheck/lint: run locally (see FINAL.md when unblocked).
- Ledger: `docs/qa/model-quality/ledger.json` unit `OLA-CMS-CONTACT-001`.
- Task routing: `docs/qa/model-quality/task-routing.md` Contact row.

## Checkpoint
Checkpoint only before shared Studio/preview registration while Balloons review runs. Lead can steer release when Balloons review done.
