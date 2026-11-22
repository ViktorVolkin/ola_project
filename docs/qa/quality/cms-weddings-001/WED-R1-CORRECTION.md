# WED-R1 — original executor correction

Actual independent Supervisor review1 is **FAIL**, retained unchanged in `supervisor-review-1.json` (SHA-256 `426e1c0a74bd5078c8b9d9705b23bf9c70158150e9eb2148f4f540482f32e6cf`). WED-R1 is a confirmed medium test-discovery integration defect, not a false positive or product defect. Review1 otherwise positively assessed the source pattern. No re-review verdict has been issued.

## Correction

Converted all four previously executed JSX cases and their original mocks, data and assertions into `tests/unit/weddings-render.test.ts` using React `createElement`; removed obsolete `.tsx`. The original remains byte-preserved in `wed-r1-before.tsx.txt`; new test in `wed-r1-after.ts.txt`; exact change in `wed-r1-conversion.diff.txt`. New test SHA-256 `a91f78e3955a46d1432af047c8f83ad62d49f343e1c9f70e29ac0ab7c5a07d43`. Root Vitest config unchanged SHA-256 `244e1365ebd1d25afeb6fc9cdafd48fd4b6dafec9e857095b94fbe38f67dd5a8`, with its original sole `tests/unit/**/*.test.ts` include. This fixes ordinary discovery without changing glob, product, shared code, or test coverage. Prior 219/219 on the expanded fixture remains real historical evidence only, not proof of root-config discovery.

## Checks — exact root config, isolated existing locked dependencies

The isolated `wed-r1-fixture` copied the actual root `vitest.config.mts` byte-for-byte, plus current source/tests/public/scripts/config; no fixture config expansion. `wed-r1-binding.json` (SHA-256 `2dd9326899bc9de3f802bee521ebeb1c4e9fb61d447b27f8a42dadf5b357977c`) binds root-before, fixture and root-after hashes, confirms exact config/test/package/tsconfig copies, no changes to any prior `after.json` witness except deliberate replacement of the old render test, and absence of obsolete `.tsx`. Old `after.json` remains the historical pre-correction manifest; use new binding for current identity. Fixture removed after checks.

- Node24 `node node_modules/vitest/vitest.mjs run tests/unit/weddings-render.test.ts`: **4/4, exit0**, `wed-r1-focused.log`.
- Node24 `node node_modules/vitest/vitest.mjs run`: **226 passed, 1 failed, 227 total; exit1**, `wed-r1-full.log`. The sole failure is existing architecture assertion seeing six `Balloons` page components where five expected, in concurrently active Balloons worker's scope. This is not a Weddings test failure; no Balloons files or shared architecture test were changed. **The full current combined suite is not green.** Lead should coordinate that independent active work; no diagnosis or correction in this bounded task.
- Separately `vitest run --exclude tests/unit/architecture.test.ts`: **223/223 exit0**, `wed-r1-rest.log`. Explicit exclusion is only a diagnostic subset, not a replacement PASS for full configured suite. Do not add overlapping totals.
- Fixture `next typegen` and `tsc --noEmit --incremental false`: exit0 (`wed-r1-typegen.log`, `wed-r1-tsc.log`). Root `eslint --max-warnings=0 tests/unit/weddings-render.test.ts`: exit0 (`wed-r1-lint.log`). Tool's standalone file auto-check did not apply project tsconfig and reported dependency/alias errors; the configured fixture tsc is the relevant check.

No build, browser or Studio replay for this test-only change; prior product-bound evidence remains subject to exact current source identity in binding and original review's limitations. No server or ports launched; no other worker's files, ledger, routing, configs, Studio, policy or product source touched. Runtime injection gpt-6.1-terra/openai-codex; actual duration/tokens/cost/fallback unknown. Original executor owns this implementation/integration correction; no ledger write while Balloons worker is active.

**Next:** actual Supervisor re-review WED-R1 with focused discovery proof and the full-suite Balloons failure explicitly visible; source package remains FAIL until a new independent verdict. Owner official Studio clicks/mutation refresh, visual/click flow and live Vercel remain NOT VERIFIED.
