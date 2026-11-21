# Migration fixture disposition — OLA-TEST-SUITES-001

Status: migration remains explicitly BLOCKED in the full runner, not skipped or passed. No migration test, fixture build, server or Action startup diagnostic was run in this continuation. The prior assertion in FINAL that the historical comparison was an unspecified before/after fixture baseline was imprecise: the evidence below distinguishes three different comparisons.

## What was actually compared

1. **Test migration coverage:** `docs/qa/bouquet-detail/test-migration-001/REPORT.md:6-11` states `before-case-list.txt` and `after-case-list.txt` were normalized for line/column, then case ID sets compared (52 unique IDs/project, 104 project-qualified). These are before/after *test migration case lists*, not two versions of product source. Tests assert actual widget interactions, geometry, localized content, keyboard/focus, fonts and screenshots; see that report and `tests/e2e/bouquet-detail-{preferences,supporting}.spec.ts`.
2. **Parallel worker identity:** `tests/fixtures/bouquet-detail-next/migration-run.sh:33-39` invokes `python3 tests/fixtures/bouquet-detail-next/prepare.py "$run/fixture-$slot"` twice. `prepare.py:13-34` copies one then-current source tree and records per-file SHA-256, checking copy versus source; the launcher compares the two resulting `snapshot-0.json`/`snapshot-1.json` byte-for-byte. These are two equal source snapshots for parallel worker consistency, not a historical before/after product comparison. The launcher replaces each test-only route with `migration-page.tsx.txt` before each build. `resume-current/REPORT.md:8-20,36-39` records this and historical 104/104, not current proof.
3. **Historical input drift:** `test-migration-001/REPORT.md:20-23` records actual earlier snapshot Preferences source different from then-current source; it expressly does not claim the old tests prove current root. Later `resume-current/final-gaps-20261116/REPORT.md:13-22` states the old test/harness and installed dependency identities were not completely bound, so the 104 result remains historical.

## Available and missing artifacts

Existing, read-only handles inside the project: `docs/qa/bouquet-detail/test-migration-001/before-case-list.txt`, `after-case-list.txt`; and `docs/qa/bouquet-detail/test-migration-001/resume-current/20261115T232303Z-869/snapshot-0.json`, `snapshot-1.json`, `run-path.txt`, build IDs and logs. The `resume-current/REPORT.md` identifies the matched source manifest and matching template. These manifests are hashes, not the contents of the source tree or an executable fixture.

The recorded full export handle is `/home/pn/.cache/ola-bd-migration-run.oanKcHsy`; it is outside the authorised workspace. Do not access it. Historical `resume-current/final-gaps-20261116/identity.json` and `REPORT.md:13-14` report the path and both fixture-0/fixture-1 absent at that time. No complete historical source/dependencies artifact is identified within the searched project QA packet; the manifests cannot reconstruct it. The reports do not establish all historical harness/dependency bytes. The known case-list evidence is available but is not a before/after executable source baseline.

## Engineering disposition / decision needed

**Superseded by Lead decision:** current-regression option is authorised; historical before/after are test-case lists, two current exports are worker identity only. No historic binary replay is required. The earlier missing-baseline blocker was an overbroad interpretation, preserved below for provenance. See `FINAL.md` for the implementation and verification status.

## Original engineering disposition / decision needed

There is no evidence that the tests intrinsically require a historic product binary as their *current regression* input: their established server lifecycle used two source-identical current-at-run exports, while the historical migration comparison was case-ID preservation. However, the present explicit instruction requires genuine before/after baseline/source identity and disallows inventing equal inputs as before/after proof. These are not equivalent. An owner must choose:

- **Preserve historic before/after replay:** identify and authorise a complete accepted original source/harness/dependency baseline and the corresponding comparison contract; manifests alone are insufficient. The existing snapshot handles above are useful witnesses, not the missing bytes.
- **Run as maintained current regression:** explicitly confirm that the retained before/after case lists are historical migration proof and that two independently verified current-source exports are worker identity witnesses, not a fabricated old/new comparison. Then the original executor can implement portable Node24, task-owned outputs, explicit exclusive private worker ports and owned-child cleanup with source identity, preserving all existing assertions and family coverage. This is not an instruction to omit migration from full.
- **Archive historical proof separately:** only if the owner explicitly changes full-suite scope, with an explicit archived/on-demand command and truthful nonzero BLOCKED until that decision is implemented; do not silently drop these cases.

Action-button diagnosis belongs to the currently assigned Luna and has not been duplicated. Original review gate remains medium, actual runtime-confirmed @supervisor gpt-6.1-sol after checks; old 702-attempt red status unchanged. Terra visible gpt-6.1-terra/openai-codex; this continuation call/time usage unknown; prior reported continuation 12 calls, child 112.61s and batch 112.9s are separate historical accounting.
