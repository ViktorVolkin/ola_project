# OLA-WF-001 — implementation continuation

Status: implementation and scoped checks complete; independent Supervisor review and acceptance pending. Actor: delegated terra implementation continuation (gpt-6.1-terra/openai-codex, as supplied in session runtime). Ledger is owned separately and was not edited.

## Change and scope

`src/components/widgets/LanguageSwitcher/LanguageSwitcher.tsx` closes the disclosure on a bubbling blur only when `relatedTarget` is outside the root. It does not focus the trigger on blur. Internal focus transitions remain open; existing Escape, pointer and link handling remain intact. Complete source diff: `LanguageSwitcher.diff`; complete test diff: `workflow-disclosure.diff`. The new mobile test exercises the nested dialog at 375×812. The original focus-leave test forces 1440×900 under both Playwright projects; its two baseline failures are not independent mobile viewport coverage. The new test also runs under both projects but explicitly forces mobile in both.

Baseline source identity matched the saved snapshot before editing: `e5ea2780984d15eb50f7b1b0a6ed5d10e280bd56ef0a6a8a7bd0c38bb44aa73c`. After: `af673610e4be7348b52f9a135ea360671764d0586873230aee54c0b323aae2da`. `source-before.sha256`, `source-after.sha256` and `source-hashes.diff` establish that only LanguageSwitcher changed among files under src between these captures. EnquiryLink remained `7f041cd4de3bdbd1b695f1b3d0a960432e1c59e179a343e3a8197977fa92a755`. Test before `2713b2198cd7526c1a1f793d0eeb8c31e099552dae5887cac46685bf066de1fd`; after `f2474a8a2f1cc81662d181ebfd9868e1aab4608b3d1224bea61f8109ac0774fc`.

## Evidence and results

- Original `baseline-e2e.log`: exit 1, 6 passed / 2 failed. All six enquiry accessible-name tests passed across EN/RU/SR and both projects. This rejects the prior enquiry hypothesis; no EnquiryLink fix was made. Both focus-exit failures retained `aria-expanded=true`.
- `mobile-baseline-e2e.log`: `npm run test:e2e -- tests/e2e/workflow-disclosure.spec.ts -g 'nested mobile'`, exit 1, 0 passed / 2 failed: the new actual mobile-dialog test independently reproduced the same focus-exit symptom under both projects.
- `npm run lint`: exit 0 (`lint-after.log`). `npm run typecheck`: exit 0 (`typecheck-after.log`). `npm run test`: exit 0, 6 test files / 24 tests passed (`test-after.log`). `npm run build`: exit 0 (`build-after.log`), production Next 16.4.3.
- `npm run test:e2e -- tests/e2e/workflow-disclosure.spec.ts tests/e2e/navigation.spec.ts tests/e2e/locales.spec.ts`: exit 0, 58/58 passed (`e2e-after.log`). Covers scoped focus regression, enquiry names, nested modal, Escape, outside click, locale route/query/hash and existing language/header checks. These counts include cases executed with explicit viewport overrides and do not imply 58 distinct viewport configurations.
- `desktop-closed-after.png`, `desktop-open-after.png` (1440×900), `mobile-closed-after.png`, `mobile-open-after.png` (375×812), `/en`, production after build. No matched before screenshots were captured; these support inspection of current presentation only, not a pixel-parity or design acceptance claim.
- Screenshot server wrapper termination left its Next child alive; the task-owned child was separately stopped. `server-cleanup.log` records the initial occupied port and successful subsequent bind to 127.0.0.1:3100; no matching Next server processes remained on the final check.

## Limits

No full-site audit, independent review, visual acceptance, deployment or release claim. Existing 404 SSR/no-JS framework blocker remains out of scope; locale 404 HTTP tests passing do not resolve it. Auto single-file patch checker invoked outside project tsconfig produced irrelevant TypeScript diagnostics; configured project lint and typecheck both passed. Screenshots have not been formally compared against baseline or Figma.
