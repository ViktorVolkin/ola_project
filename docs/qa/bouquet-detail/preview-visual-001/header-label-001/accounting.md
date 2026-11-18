# OLA-BD-PREVIEW-HEADER-LABEL-001 — executor record

- Objective: make the shared Header CTA read “Enquire” only at `/[locale]/preview/bouquet`, retaining the normal localized `Navigation.order` label elsewhere and keeping the existing EnquiryLink/action unchanged.
- Risk: medium, because this touches shared Header presentation. This bounded implementation does not claim integration acceptance; the bouquet page owner’s real Next SSR/browser integration gate remains open.
- Selection: Luna pilot, based on `docs/qa/model-quality/task-routing.md` small native React primitive evidence (accepted after Luna self-correction; not assumed to establish full integration success).
- Actor: direct implementation in this assigned task. Runtime model/provider: gpt-6-luna / OpenAI Codex (session metadata); usage/tokens/cost/timing counters unavailable.
- Changed files: `src/components/widgets/Header/Header.tsx`, new `src/components/widgets/Header/HeaderCtaLabel.tsx`, new `tests/unit/preview-header-label.test.ts`.
- Behavior: route-aware client text child supplied to both existing desktop and mobile EnquiryLink placements. Only exact next-intl internal pathname `/preview/bouquet` matches; existing locale-provided default text used for all other paths. No destination, recipient, disabled state, generic action or navigation API changed.
- Verification: scoped ESLint passed; `./node_modules/.bin/vitest run tests/unit/preview-header-label.test.ts` passed (1 file, 7 tests), exercising React SSR presentation for preview and non-preview pathname inputs with EN/RU/SR normal labels.
- Output hashes:
  - Header.tsx `984aaaaaa1557fe08556fc3c5e5843be7135f5d6a252599db27a5178d1046ae3`
  - HeaderCtaLabel.tsx `288601359b885770a60b529459d0e5929ccc202d5621752bfcc1d33e40812702`
  - preview-header-label.test.ts `8ea87d7b92ae4a30cfe2b8e733ec8cd6eec689767490b51114f8d71db5821b98`
- Limitations: no full-project typecheck/build, per concurrent source edits and assigned integration ownership. Real Next SSR/browser integration and final shared-header acceptance remain with page owner; no Supervisor verdict claimed here.
- Outcome: scoped executor checks passed; awaiting page-owner integration gate. No known corrective round.
