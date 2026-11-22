# OLA-CMS-WEDDINGS-001 — partial implementation checkpoint, NOT acceptance

## Implemented and verified

- Added `src/content/sanity/weddings.ts`: typed fixed-slot EN/RU/SR parser, localized copy/alts/labels, same-locale field fallback, shared validated image presentation (10 placements; CTA deliberately reuses weddings placement), published-only fetch/ISR60.
- Added server-only `src/content/resolver/weddings.ts`: exact existing selector, no default network fetch, Draft Mode priority, published→draft→local fallback and generic diagnostics. These are **not connected to the page**.
- `tests/unit/weddings-cms.test.ts`: isolated locked-fixture Vitest **8/8**, covering default zero fetch three locales, partial fields/order/identity/cross-locale, valid/invalid images and published fallback, draft priority for two source settings, fetch perspective/options, published outage. `unit.log`: 439ms test runner duration. This is mock/pure coverage, not browser or real cache evidence.
- Isolated locked-fixture configured TypeScript `tsc --noEmit --incremental false`: initial exit 2 (`types.log`: missing fixture `scripts/model-quality-summary.mjs`), after copying unchanged scripts exit 0 (`types-retry.log`). Root `eslint --max-warnings=0` exit 0 (`root-lint.log`); `git diff --check` exit 0. First root-config Vitest invocation failed because root Rolldown misses `logs-BphcrOCD.mjs`; isolated fixture avoids changing root dependencies. Single-file tool auto typechecks used no project tsconfig and reported dependency/alias errors; configured project check above is authoritative.
- Source hashes SHA-256: adapter `806f574d642c5fca0d08e212c4caf7fbc816a9856f50a31601dc68e38015f43f`; resolver `cd97a8ab87d2d75b8576db82c7222b529163c0cfff802032b81da7022428e14b`; test `dacb8e15aea1bbd30cf5d518e4ad4c8b004e4ffd316f36bc011ee8c71cd5572a`. Original 32 Wedding source/data files byte-snapshotted with identity map `before.json`; none changed.

## Task matrix / still needed

| Area | State |
|---|---|
| Typed adapter, resolver | Implemented, focused mocked checks only; needs broader boundary tests |
| Page/widget wiring, localized labels, photo props and annotations | **Not implemented**; page remains local-only, no Weddings CMS fetch or preview |
| Render/build / parity | **Not run**, no claim of UI preservation beyond unchanged original page/widgets |
| Studio singleton, fields, locations | **Not implemented**, shared scope frozen |
| Preview authorization/navigation | **Not enabled** for Weddings; shared scope frozen |
| Official Studio clicks, mutation refresh, owner visual QA | **NOT VERIFIED**; no loopback retry or bypass |
| Actual independent Sol Supervisor review | Required after implementation/integration; not requested |

When wiring widgets, keep enquiry subjects/destinations code-owned: current category and hero subjects derive from local titles, so edited titles must not silently change enquiry URLs. Ensure CTA and category weddings reuse the same photo override while preserving separate alt text and existing image crop/sizes/classes. No secrets/environment/tokens into client props. Derive annotation paths for exact fixed fields; avoid embedding editable UI into code-owned navigation/action semantics.

## Precise shared integration plan — only after Lead release

1. `studio/sanity.config.js`: add `weddingsPage` singleton + explicit structure selection and three Presentation locations `/en/weddings-events`, `/ru/weddings-events`, `/sr/weddings-events`. Fields should match current adapter: localized `hero` title/lead/body/handwritten/imageAlt + photo; fixed `categories.{weddings,private,corporate,rentals}` title/description/imageAlt + photo; localized `approach` eyebrow/title/body/imageAlt + photo; localized `process` eyebrow/title and `step1..step4` title/description; localized `inspiration` eyebrow/title and `{ceremony,dinner,engagement,gathering}` caption/imageAlt + photo; localized `cta` eyebrow/title/body/handwritten/imageAlt; six `labels` keys from `weddingsLabelKeys`. No new URLs/prices/business claims or speculative content.
2. `src/content/sanity/preview-policy.ts`: expand exact allowlist only for the three Weddings route paths; preserve same-origin, exact-string, query/hash/encoding and trusted-origin/secret guards. `src/components/widgets/HomeBlocks/HomeCommon/HomeVisualEditing.tsx`: inspect existing shared SDK init/history guards against expanded policy, change only if necessary with Home/About parity/security tests. No layout/route/security weakening.
3. Add focused policy/schema/SDK tests and production fixture rendering with default/published/synthetic draft. Actual official Studio field-pointer and saved-draft workflows remain separate NOT VERIFIED, as does owner visual/click-flow. Previously observed hosted-origin browser loopback denial remains; do not retry/bypass.

No Next/Studio server launched; no ports/processes owned by this checkpoint. No cloud, deploy, installs, credentials, OS repair, shared files, About, Home, local copy or messages touched. Runtime injected gpt-6.1-terra/openai-codex; tokens/API cost/fallback and overall duration unknown. This is a partial executor checkpoint, not all-pages completion or a review-ready delivery.
