# Guard correction 001 — QAR-R1 / QAR-R2

Original unit: OLA-AUTONOMOUS-QA-RESTORE-001. Risk **medium**, explicit independent review required. **Executor status: corrected deterministic gates passed; awaiting actual Supervisor review2.** This is not acceptance/PASS. Actual Supervisor/gpt-6.1-sol/openai-codex review1 remains **FAIL** in immutable `../supervisor-review-1.json`; its findings were confirmed, not dismissed or relabeled.

## Root causes and corrections

### QAR-R1 — high, expected build/fixture identity

The old reuse entry validated ROOT against metadata but never rehashed the actual private source/config or compared actual build artifacts with an existing expected handoff. Later reads adopted current fixture hashes/BUILD_ID and could publish a replacement trusted baseline. Current static-body equality only proved equality with that same mutable current fixture; HTML was not bound to the expected build ID.

`reuse-guards.mjs` is now the actual shared guard module imported by `verify.mjs` and the regressions. Before reuse/native/server checks it requires an existing expected handoff, exact expected fixture handle, real directory/no symlink substitution, owner UID, actual private source/config identities bound to recorded inputs, expected BUILD_ID and complete immutable retained file/path identity. Newly created handoffs also record device/inode directory identity; reuse checks it when present. Legacy sealed handoffs remain anchored to complete already recorded bytes, without inventing a historical inode witness or rewriting that handoff.

ROOT/config/libraries must match the existing recorded root manifest. Only exact root Vitest cache prefixes are exceptions, retained as full per-path deltas. Private serving-runtime exceptions are only `.next/cache/images/**`, also full raw before/after identities plus explicit producer. Arbitrary cache paths are not silently discarded.

Served HTML must carry a Next `b`/`buildId` marker for the **expected** build ID, not merely mention the ID as text. Served static bodies are checked against expected recorded size/SHA as well as current-file equality. The expected handoff bytes and immutable fixture/root are checked again before success.

Normal controller invocations use a new `run-*` output packet inherited by child processes. The expected sealed packet cannot be selected as output, directly, through a nested path, or an existing symlink alias. Reuse records its result in that new packet and publishes only a receipt referencing the old expected handoff SHA; it does not replace the trusted reusable handoff or clear an existing fixture cache. Legacy `record`/`compact` self-adoption maintenance is refused after the verified baseline is sealed. Cold verify may produce a new handoff only for its own newly built fixture after all gates, not by reusing arbitrary current bytes.

### QAR-R2 — medium, cleanup/publication barrier

The old code recorded `portReleased:false` but never asserted it. `verified` could still trigger success publication. Failure records were also absent on some shutdown exceptions.

The controller now calls the actual tested `shutdownOwned` helper: it checks owned PID/cwd/start ticks before any signal, subscribes to exit before SIGTERM, requires a confirmed normal child exit and successful exact-port rebind, and always retains a structured complete/failed cleanup record. A signal failure, timeout, identity mismatch, unexpected exit or occupied port rejects. Identity is captured in memory at spawn, not re-adopted from a mutable audit file; missing identity fails closed with a record. A replacement listener/process is not signaled. Log closure occurs in finally.

`publishAfterCleanup` is the shared success-publication barrier actually used by the controller. Missing/false shutdown or release state throws and records failure, and never calls the publication callback. A failed shutdown exits before all success files, while a failed later guard also prevents publication. Previous trusted handoff bytes remain intact.

## Actual RED → GREEN evidence

No grep-only assertion or duplicate validation implementation was used. The original entry/publication seams were first extracted without fixing their behavior and wired into the controller. Tests import the same module functions.

- `red.log`: Node24 test exit **1**, 16 tests, **13 failed / 3 passed**. Private source/config/build/asset corruption and bad HTML passed through the original seams; cleanup false/missing/occupied states also incorrectly reached publication.
- `green-initial.log`: same16 cases passed after identity/publication correction.
- `red-shutdown.log`: exit **1**, 21 tests, **5 failed / 16 passed**, exposing missing persistent failure/complete records and the shutdown helper's unchecked occupied-port result.
- `green-shutdown.log`: all21 passed after correcting that helper.
- Final `green.log`: exit **0**, **26/26 passed**, no skipped/cancelled tests. Includes unchanged-ROOT/private-source corruption, config corruption, changed expected BUILD_ID, changed/missing/unexpected immutable assets, missing fixture, replaced directory inode, symlink fixture substitution, bad/mere-text HTML ID, clean positive fixture, ROOT mismatch, exact cache exception deltas, non-exempt cache rejection, real saved HTML marker read-only, protected output aliases, failed/missing shutdown, occupied/free actual loopback port, signal failure, timeout, replaced process and positive owned shutdown/publication.

Negative cases assert publication callback count **zero** AND byte-identical old synthetic handoff. Positive clean/free cases assert publication callback count **one**. Data-only synthetic fixtures are created under a private `/tmp/ola-qa-guard-test-*` directory and removed by test cleanup; no execution from noexec /tmp occurs. Stub child processes never send real OS signals. Actual test-only loopback listeners close normally in finally; no real Next/browser/server was launched or deliberately leaked.

## Executed checks

Commands used the existing absolute Node24 handle, with `NODE_DISABLE_COMPILE_CACHE=1`:

```sh
/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node --test scripts/qa/guard-regression.test.mjs
/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node node_modules/eslint/bin/eslint.js --max-warnings=0 --ignore-pattern '.local-tools/**'
/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node node_modules/typescript/bin/tsc --noEmit --allowJs --checkJs --skipLibCheck --target es2022 --module nodenext --moduleResolution nodenext scripts/qa/reuse-guards.mjs
/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node --check scripts/qa/verify.mjs
/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node --check scripts/qa/local.mjs
```

All final commands returned **0**. Strict lint used the existing configuration and zero-warning threshold, with only the already approved tool-directory exclusion. Tooling typecheck is real **checkJs/noEmit for the guard module**, not a newly executed whole-app generated-types gate. Initial tooling check exposed a callback JSDoc arity inference error (exit2, retained in `tooling-types-first-failure.log`); the callback contract was typed, not ignored, and final typecheck passed.

No dependency regeneration/install, native cache materialization/provisioning, mount/permission/profile/backend/provider change, root typegen, Next build, browser or live reuse against current ROOT occurred. Prior52-unit/build/browser successes stay historical; they are not silently recounted as this revision's tests. `git diff --check` passed on owned changes.

## Source/artifact preservation and full manifests

- `initial-before.json.gz` preserves the early correction checkpoint.
- `before.json.gz` / `after.json.gz` preserve final-check checkpoints: **280 application/public/config/package paths**, **861 protected paths** (review receipt, old handoff/input manifest and **858 retained build files**), and selected dependency metadata identities.
- The complete **25,847-path** source/config/dependency manifests, including **24,049 node_modules paths**, are represented without duplication by an immutable SHA-bound `fullBaseline` snapshot plus complete per-path `fullDelta` records in each checkpoint. This reconstructs every original path/size/hash/link; no cache directory is dropped. It is measurement evidence for the current guard-only phase, not adoption of a new build baseline.
- `full-phase-diff.json` and `preservation-diff.json`: **[]**, zero changed paths across final checks. `preservation-summary.json` records counts and final tooling file hashes. No false blanket equality is asserted for older phases, whose240-install/57-cache and later one-cache deltas remain in their original packets.
- Saved pre-header BUILD_ID **`tQHQbZ2RcOzJh-liXSWgW`**, all858 retained bytes, expected handoff and Supervisor FAIL receipt remain unchanged. The historical19-CSS baseline and current post-header source are kept distinct. Other owner's accepted `0RKE00M-JxGMYb9sr8we6` artifact was not adopted, altered, built or served by this correction.
- Current ROOT would not match the old pre-header expectation. That rejection was tested synthetically, not by attempting to launch the old artifact as current source.

Only own QA controller/guard/test/evidence scripts, this revision's evidence, `docs/development/local-qa.md` and own ledger unit were changed. No app/CSS/JSX, package/lock/node_modules, project configs, Git state, root `.next`, old fixture or cleanup-denied target was written. Final process observation shows no retained test/Next/browser process.

## Accounting and remaining gate

One original executor owns this correction, evidence and accounting; no child/reviewer/third fixer called. Risk remains medium with explicit review required. QAR-R1/R2 are confirmed implementation defects corrected by their original author, not reviewer false positives or parent takeover. Review1 FAIL is preserved; review2 is pending.

Injected current runtime exposes gpt-6.1-sol/openai-codex. Current delegation ID/API time/tokens/prices/total cost remain unknown. User-supplied prior `c89d320383` API1543.18s child duration is retained as supplied history, not current duration or an overlap-free total; prior attempt histories remain intact. Included tool billing is not a total-free claim. Final recording work is part of this same attempt.

Remaining limits: no new live site/native capability assertion, no full-site build/browser campaign, no default-Turbopack fix, no motion/performance/deployment acceptance. Actual independent Supervisor review2 must judge the corrected semantics before tooling acceptance.

## Evidence-only source-input completion follow-up

The later tracking observation found these sources untracked, so Git diff is not their preimage evidence. Review2 now has [source-review-inputs/README.md](source-review-inputs/README.md), [manifest.json](source-review-inputs/manifest.json), inert before/after source bodies and [source-changes.diff](source-review-inputs/source-changes.diff) for all six modified/added source paths. Original before.json.gz contains identities, not these source bodies. Verify/guide preimages come from complete retained tool reads; local.mjs is deterministic reversal of the five actual recorded edits against SHA-bound unchanged current ranges. A separate full historical local.mjs snapshot and independent pre-correction digests were not retained; that stronger attestation is explicitly unavailable, not fabricated. New guard/test/evidence sources are additions from absence, not invented empty files.

Subsequently exposed ended-correction metrics: delegation_id `deleg_6626e522`, banner model `gpt-6.1-sol`, API calls73, child duration2300.17s, batch duration2300.6s. These separate overlapping measures are not summed. Provider openai-codex is supported only by injected runtime; tokens/prices/total monetary cost remain unknown. [completion-metrics.json](source-review-inputs/completion-metrics.json) and the same own ledger attempt record the exposure. This evidence-only continuation's additional counters are not silently included in73. It ran only source/diff evidence assembly and own accounting, no tests or current implementation/saved-build/handoff/FAIL changes. Supervisor review1 remains FAIL and review2 pending.
