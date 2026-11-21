# OLA-QUALITY-LINT-SCOPE-001 — coverage control

**Result:** narrow generated-directory ignore change controls pass; no handwritten rule relaxation or broad exclusions. `eslint.config.mjs` keeps strict `--max-warnings=0` and adds only `**/.next/**` beside the existing root `.next/**`.

## Controlled before/after

`verify-lint-scope.mjs` imports the exported flat configuration once and passes it to public ESLint `ESLint` instances with `overrideConfigFile: true` (no config-file re-load). BEFORE derives in memory from that same export by removing only the single `**/.next/**` ignore entry; AFTER uses the export unchanged. This is a controlled same-source/config comparison, **not** a recovered historical lint invocation; do not infer exact historical equality where working-tree inputs differ. Machine output grouped by file and rule: [`machine-results.json`](machine-results.json).

- Controlled BEFORE: 176 errors, 4,443 warnings (4,619 diagnostics; 119 files).
- Configured AFTER: 10 errors, 1 warning (11 diagnostics; 4 files).
- Full real `npm run lint -- --format json` executed with strict package script: exit 1; 10 errors / 1 warning; saved as [`npm-lint.json`](npm-lint.json) and [`npm-lint.exit`](npm-lint.exit). No errors were hidden to force a clean pass.

The remaining handwritten errors are 10: `docs/qa/bouquet-detail/composition-001/technical-final/page-probe.cjs` lines 1–3, `@typescript-eslint/no-require-imports` (3); `docs/qa/bouquet-detail/preview-visual-001/continuation/capture.cjs` lines 1–3, same rule (3); `docs/qa/bouquet-detail/preview-visual-001/fix-continuation/capture.cjs` lines 1–2, same rule (2); `docs/qa/bouquet-detail/preview-visual-001/actions-flow-final/revision-1/finite-measure.spec.ts` lines 69 and 137 `@typescript-eslint/no-explicit-any` (2). Its line 19 `@typescript-eslint/no-unused-vars` is the single warning. No QA script fixes were made.

## Coverage controls

Public `isPathIgnored` confirms the actual deeply nested generated `tests/fixtures/action-button/.next/standalone/tests/fixtures/action-button/.next/package.json` is ignored. These all remain lintable: real app page `src/app/[locale]/page.tsx`, moved Weddings leaf `src/components/widgets/WeddingsBlocks/WeddingsHeroBlock/WeddingsHeroBlock.tsx`, `tests/unit/enquiry-url.test.ts`, handwritten `tests/fixtures/action-button/i18n/request.ts`, this `.mjs` helper, an existing docs `.spec.ts`, and existing docs `.cjs`. `lintText` with in-memory invalid TypeScript (`const = ;`) reports actual parser error `Variable declaration expected`, not ignored-file warning. All assertions are recorded in machine JSON.

`--max-warnings=0` and all handwritten lint rules remain in effect. Evidence covers configuration scope, not full-site readiness. No app/source/test changes, server/build/browser actions, or lint-failure repairs were performed. Current runtime/cost/token counters are unknown/not exposed. Medium risk; independent review required.
