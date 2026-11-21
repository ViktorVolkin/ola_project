# Luna verification — OLA-SANITY-HOME-CLICK-NULL-001

Run completed 2026-11-21 (UTC). This is local verification only; no deploy.

## Bound inputs

- `studio/sanity.config.js` SHA-256 `edd777479f6375875780d51600a893172b4fcfb4d3abe2dd2218ecefec3429ad` (unchanged from prepared source binding).
- Installed Sanity SDK chunk SHA-256 `9d772ac6d1fdba91baa0bb01f6bffeffdccbecac8f218cdc3b67465cba102bee`.
- SDK: installed Sanity 6.24.0; Node v24.22.3.

## Results

- Actual SDK regression seam RED, before-config: exit 1 as expected, 37 tests, 13 pass / 24 fail. Failures were precisely `TypeError: Cannot read properties of null (reading '_id')` across missing, missing-published, unsaved, and published-perspective draft-only title/photo intents in EN/RU/SR. Causal null control failed as expected; populated draft and published controls passed. Raw output: `luna-seam-red.log`.
- Actual SDK seam GREEN, fixed root config: exit 0, 37/37 pass including the null-crash control; raw output `luna-seam-green.log`.
- Before-config official Studio + real iframe pointer RED: exit 1 after genuine selection at `/presentation/homePage/homePage/hero.title.en`; official Studio showed “The presentation tool crashed”. The recorded main-document query returned null. This was the expected actual SDK crash, not setup failure. Screenshot and full request/result evidence under `browser-before-missing/`; raw output `luna-browser-red.log`.
- Built one isolated fixed Studio fixture (exit 0), at `/workspace/.local-tools/ola-qa/sanity-home-click-null-001/studio`, test-only. Exact inputs/build identity in `studio-build-binding.json`; build output `studio-build.log`.
- Fixed official Studio/iframe pointer runs: `missing`, `unsaved`, and `draft-only` each exit 0; each records 6/6 title/photo intents through EN/RU/SR with expected title/photo editor paths, no body or page errors. Raw logs `luna-browser-{missing,unsaved,draft-only}.log`; JSON and screenshots in corresponding `browser-fixed-*` dirs. These are official local Studio UI/pointer runs using synthetic API/auth and preview data, not owner credentials/content/cloud or hosted verification. No fill/save/publish performed. Mock mutation traffic is harness-owned mock metadata/bookkeeping; no external API.
- Studio `tsc --noEmit`: exit 0; `luna-studio-types.log`.
- Root configured `npm run lint`: exit 1, 0 errors / 1 warning: `browser-null.mjs:2:9` unused `createHash` import. This is in the prepared QA harness, not product source. No files edited to mask it; lint remains an open check.

## Scope and remaining gates

Only task-owned evidence/artifact outputs were added; no product files changed by this verification. Existing sole source diff remains `studio/sanity.config.js`. No credentials, private queries, cloud content writes, deployment, or model/config changes. Source fix is locally supported by seam + official local browser evidence, but not deployed. Requires original Sol actual Supervisor review, then separately authorized source-bound hosting action and owner live-flow verification. Root lint warning must be addressed by its owner before asserting lint-green.
