# CMS-R1 correction — local scope awaiting review 2

**OLA-SANITY-HOME-READY-001: AWAITING_REVIEW (local technical revision only).** Supervisor review 1 remains **FAIL**, byte-unchanged. No PASS, acceptance, manager readiness, cloud deployment/import/upload/CORS/login/publication or secret access is claimed. This is the bounded return to the same authorized Sol implementer, not a new CMS phase or another fixer/reviewer.

## Finding and minimal correction

Read the full actual Supervisor receipt `../supervisor-review-1.json` and installed SDK1.2.0 `parseSource.js`. CMS-R1 is a medium validation/normalization contract defect: the guard validated nested `asset._ref`, while SDK precedence accepted top-level `_ref`, `_id` or `asset.url`. A valid nested PNG could therefore deliver another SVG or oversized identity, with normalization still using the nested dimensions. This is **not demonstrated arbitrary-host SSRF, XSS or actual malformed live CMS content**.

Only production-source change: `src/content/sanity/home.ts`.

- Reject presence of the three ambiguous alternate identity selectors: image-level `_ref`, image-level `_id`, nested `asset.url`, even when values coincide or are malformed. These are SDK identity selectors, not normal image-field metadata.
- Construct a fresh canonical SDK image from the exact validated nested asset reference and explicitly copied validated numeric crop/hotspot fields. Do not pass the whole untrusted object or use the former broad SDK-source cast.
- Both URL generation and focal normalization consume that same canonical source. Existing crop, focus, frame/layout, CMS CSS, locale/fallback/cache behavior and supported-format/dimension policy are unchanged.
- Ordinary `_type`, `_key`, localized auxiliary text, reference metadata and crop/hotspot `_type` fields remain acceptable; irrelevant fields are not forwarded to the SDK. Materialized nested identity extras cannot override the canonical copied reference.

Other writes: `tests/unit/sanity-home.test.ts`, this revision's evidence directory and **only the original unit** in `docs/qa/model-quality/ledger.json`. No other production source, CSS, Studio schema/config/docs, dependency or routing edits. Studio's seven existing source/config/package/lock/README/seed witnesses remain hash-equal, so no Studio rebuild was necessary.

## RED / GREEN and normal-path compatibility

- **Actual pre-fix RED:** 12 ambiguous-selector cases failed at the **complete `parseHome` rejection assertion**, not a URL-regex assertion. Nested unsupported-format/oversized guards and clean positive controls already passed. `red.log` retains the returned accepted documents and original failure details.
- Final **22/22 CMS tests** and **74/74 full units (11 files)** pass. Fourteen negative variants cover asset URL overrides, alternate/same/null top-level selectors, SVG and `900000x900000` metadata. Each final negative checks whole-document rejection in EN/RU/SR, both image entry points and `fetchHome` returning the canonical fallback sentinel. Positive ordinary-metadata/crop/focus/localization and prior offline-fallback tests remain.
- Final configured root lint and project `tsc --noEmit --incremental false`: exit 0. `check-results.json` records actual executable/arguments/cwd/exit codes; `checks.log` and `*-final.log` retain output, including expected rejection/offline warnings. No root typegen or root `.next` build was run.
- `compatibility.mjs` executes the **actual before and after adapters**, actual canonical home module and installed SDK via in-memory TypeScript transpilation, without network or a substitute validator. The retained 14-role synthetic document plus 60 valid JPG/PNG/WebP crop/focus variants across three locales produce **183 full-document comparisons**, including URLs at two widths. All serialized outputs are **byte-identical**: 976171 bytes, SHA256 `623af9e732e827b7abc40883f0d29a9442f5fffe0cc9f32c0e5c44d43e2466c9` for both `valid-before.json` and `valid-after.json`.

## Fresh build and proportionate browser verification

Two fresh isolated `next build --webpack` runs on final adapter source, exit 0, 23 static pages each:

| Variant | Fixture | BUILD_ID | Bytes after browser |
|---|---|---|---:|
| Release exact | `.local-tools/ola-qa/sanity-home-cms-r1-release` | `K6M5DMMgF_2Lx5PLVnEJ3` | 184998788 |
| Explicit synthetic | `.local-tools/ola-qa/sanity-home-cms-r1-synthetic` | `F9vPfLz2reFJrDqWwKD-2` | 185408761 |

Both are below 200 MiB, with existing dependency symlinks excluded and no Studio artifacts copied. The synthetic fixture follows the previous controlled protocol: its **only production-source difference** is the private adapter's API URL pointing at task-owned `127.0.0.1:42194`; generated image responses are browser-only fixtures. No Sanity upload/write or real-host interception.

**Six fresh representative browser contexts:** release fallback and valid synthetic CMS each at EN360, RU1024, SR1440. All HTTP200, thirteen decoded images, no document overflow or console/page/request/HTTP errors. All six match the corresponding **saved prior** geometry/actions/labels and full screenshot pixels. Synthetic checks cover **39 newly captured ROI checks**, fourteen roles including both wedding sources, and scrolled mobile mood cards. **36 freshly served static asset identities** (JS/CSS/font across both builds) match exact local build bytes and BuildIDs.

Task-owned Next servers and synthetic API were stopped; actual port rebind succeeded for **42192, 42193 and 42194**. Root `.next` and server 3100 were not used. Existing historical fixtures were read only, never rebuilt or rebaselined.

The prior 36-context browser/156-ROI/ISR campaign remains **saved prior evidence, not a fresh rerun**. Its continued normal-input relevance is supported by exact before/after adapter outputs, only-adapter production-source delta, unchanged CSS/consumers/Studio and the six new render comparisons. No new 60-second cache/deployment deadline claim. No need to repeat the whole cache/Studio/editor campaign for this selector-only correction.

## Identity and evidence packet

- `before/` contains inert adapter/test/ledger bytes and initial receipt/source SHA256. `home.ts.after.txt`, `sanity-home.test.ts.after.txt`, `source-tests.diff` and `own-unit-ledger.diff` preserve the exact correction. Parsed-ledger verification confirms every other unit is unchanged.
- Before adapter SHA256: `f68f1d11a19953c0137daa1904b0bc4e2e5261d05d2df13448219dd0d466ebd8` (matches review1); after: `e9b4e8ec86ead16519589844ee000cc2bbcb6688bac770618d1956dfe23a09ee`.
- Review1 remains FAIL and SHA256 `7363fdd0b465a406dc4e8a8b55aef4f272b542002e5403eca3dc8b16eaf28c59` unchanged.
- `source-bindings.json` / `verification-summary.json`: complete enumerated 280-path source/public/config/package inventory matches release before/after build; only adapter differs from the previous production inventory. Source witness `ea014f1e0640dfc1db87639daa94582d2c6311ca5fe68589b48c0088b5a4ee0f`. Five selected dependency/package/lock witnesses remain equal; this is not full dependency-tree attestation.
- `build-results.json`, `build-*.log`, `browser-results.json`, full screenshots and 39 individual ROI captures retain raw results. Existing harmless build tracing-root/telemetry notices are retained, not suppressed by configuration changes.
- Two initial patch submissions were rejected by the file tool for ambiguous matching, atomically without changes; the subsequent targeted edits succeeded. They were patch-application failures, not another product correction or hidden failing gate. No failed final test/build/browser run in this revision.

## Accounting and remaining gates

Runtime actual **gpt-6.1-sol / openai-codex**, delegated implementer, not Supervisor. Confirmed `implementation_defect` correction caused by prior Sol implementation `deleg_ac997fe5`; no parent implementation and no first-pass success. Parent supplied prior actual usage: **58 API calls, 1420.24 s child / 1420.58 s batch** (overlapping, not summed), price unknown. This revision's own final counters/cost remain unknown until runtime return; final recording is part of this attempt.

Original unit stays `awaiting_review`, with immutable review1 FAIL history and revision CMS-R1 awaiting **actual independent Supervisor review 2**. This implementer does not call Supervisor or issue a review verdict. Owner's proposed deploy-only secret file was neither checked, read nor loaded. Manager readiness remains separately **BLOCKED** on independent review plus owner-authorized CORS/login/import/photo and translation approval/deployment/publication and real edit→publish→site validation.
