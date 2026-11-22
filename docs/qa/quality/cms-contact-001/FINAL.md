# OLA-CMS-CONTACT-001 — FINAL evidence record

## Unit
OLA-CMS-CONTACT-001 · category: implementation · risk_level: high · review_required: true · delivery_state: awaiting_review

## What was implemented (Contact-owned writes only)
- `src/content/sanity/contact.ts` (NEW) — CMS adapter: flat `contactContentPath` identity mapping, `contactImagePaths` photo slots, text validation, image guard with canonical crop/hotspot reuse and arbitrary-URL rejection.
- `src/content/resolver/contact.ts` (NEW) — `resolveContactContent(locale)`: draft→published→local fallback (same locale), `ContactPreview`/`ResolvedContact` types, ISR 60s published fetch, `contentSource()` env gating, `draftMode()` preview gate.
- `src/components/widgets/ContactBlocks/contactEditing.tsx` (NEW) — `contactEditing(locale, enabled)` via `createDataAttribute` + `ContactEditable`; disabled off-preview or without `SANITY_API_READ_TOKEN`/`SANITY_PREVIEW_ORIGIN`.
- `src/components/widgets/ContactBlocks/ContactPreviewStatus.tsx` (NEW) — localized preview banner en/ru/sr.
- `src/components/pages/ContactPage/ContactPage.tsx` (REWRITE) — async page wiring resolver + PreviewStatus + all widgets.
- `ContactHero.tsx`, `ContactGeography.tsx`, `ContactTopics.tsx`, `ContactLower.tsx`, `ContactFaq.tsx` (REWRITE) — typed props, editable text/photo/image slots, `data-sanity` annotations to exact `contactPage` paths; Enquiry/destination/phone/mail/map/business actions stay code-owned.
- `tests/unit/sanity-contact.test.ts` (NEW) — parser, source/fallback, API outage, missing doc, image guard, draft priority, default zero-fetch, annotation mapping coverage.

## What is verified
- `tsc --noEmit`: clean on all `src/` owned files and `tests/unit/sanity-contact.test.ts` (0 errors in owned code; remaining tsc output is pre-existing node_modules noise and QA fixture/baseline copies under `docs/qa/`).
- `eslint --max-warnings=0`: clean on all 11 owned files (0 errors, 0 warnings).

## What is BLOCKED (environment, not code)
- `vitest run` — cannot start: incomplete rolldown install in this environment (`node_modules/rolldown/dist/shared/logs-BphcrOCD.mjs` missing). No install/tool health campaign permitted; cannot repair.
- `next build` — blocked by same rolldown limitation.
- Before/after/sanity builds + EN/RU/SR × 360/768/1440 DOM+PNG comparisons — blocked (no build, no browser render path).
- ISR timing, owner Studio/live manual verification, Sol Supervisor review — pending.

## Business values NOT editable (and why)
Contact destination, phone, mail, map, hours, addresses, handles remain code-owned: no existing type cleanly permits validated editing without inventing behavior; not claimed CMS-ready.

## Checkpoint
Checkpoint reached before shared Studio/preview registration while Balloons review runs. Lead can steer release when Balloons review done. No deployment.

## Evidence files
- `docs/qa/quality/cms-contact-001/TASK.md`
- `docs/qa/quality/cms-contact-001/SCHEMA-PLAN.md` (additive Studio plan, not released)
- `docs/qa/quality/cms-contact-001/QAfixtures/before-src/` (pre-change `src/` baseline)
- `docs/qa/model-quality/ledger.json` unit `OLA-CMS-CONTACT-001`
- `docs/qa/model-quality/task-routing.md` Contact row
