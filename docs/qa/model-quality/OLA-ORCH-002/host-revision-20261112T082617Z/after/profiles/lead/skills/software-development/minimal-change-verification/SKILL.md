---
name: minimal-change-verification
description: Use when verifying changes, migrations or rankings.
version: 0.2.0
author: Viktor, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
---

# Minimal change verification

## When to use
- Verify code changes and PostgreSQL/Alembic migrations.
- Verify source collection/backfills and read-only housing-ranking diagnostics.
- Design and compare explicitly authorized offline ranking alternatives without replacing production.

## Procedure and authorization gates

1. Read the relevant commands, implementation, tests, receipts and working-tree state. Preserve unrelated edits/deletions; missing old files are not permission to restore them.
2. Separate permission to inspect, implement, test, perform live calls, write data/schema, stage, commit and push. A later status request is not permission to advance the task. A commit request does not override an existing no-production-change instruction.
3. Prefer the established command and a short targeted check over elaborate one-off tooling. Use existing captured data before services or a live database; do not treat classes, prompts, columns or files as proof of an end-to-end feature.
4. Keep database inspection genuinely READ ONLY and avoid exposing credentials. Obtain explicit authorization before DDL/DML, migration application, existing-row backfills or destructive operations. Tests must isolate database initialization before imports that could select the runtime database.
5. For approved additive migrations, execute the existing `alembic upgrade head`, read back revision/columns/types/nullability/defaults, and use `alembic check` when available. Editing an applied migration is not executing it; inspect live revision/data and obtain rollback/reapplication approval. Follow the migration reference in **requesting-code-review** for that workflow.
6. Executors run and report proportionate integrated checks after writers finish; the orchestration-only Lead does not implement, edit instruction/status/ledger documents, run artifact-producing checks, or perform code review. Use one executor for the full task cycle and its evidence/accounting; split only independent scope, materially different specialty/risk, or a true blocker. Preserve unrelated edits/deletions; missing old files are not permission to restore them.
7. Report actual results, changed behavior, external-state boundaries and remaining limitations briefly. Keep provisional changes scoped; do not update instruction/status documents, redesign neighboring code or make commits merely because they would be convenient.

## OLA risk, ownership and accounting

Record risk_level/risk_reason, review_required/review_reason and acceptance_basis. Low isolated work without an explicit gate may use confirmed executor checks. Medium/high/critical or explicitly review-required work needs actual `@supervisor` on runtime-confirmed `gpt-6.1-sol`, not a named child. OLA-ORCH-002 explicitly requires it; do not retroactively waive OLA-WF-001's BLOCKED/explicit gate.

Luna `gpt-6-luna` is routine/local/docs; Terra `gpt-6.1-terra` primary React/integration/moderate; Sol `gpt-6.1-sol` hard architecture/critical/security/auth/payments/data integrity. Only runtime evidence establishes actual profile/provider/model; unknown stays unknown.

One executor owns the task's diagnosis, real repro/root cause as applicable, minimal fix, checks, packet and own logical final accounting record. No separate diagnosis/logging/formatting/relay agents, mandatory review-stage chains or automatic third fixer. Split only independent scope, materially different specialty/risk or a genuine blocker. Checkpoints serve long, expensive or interrupted operations, not minute fragments.

Normal material/dependency reads remain necessary; no recurring tool-health/reconnect/model-config campaigns. Real BLOCKED stops affected execution until cause resolution, with no blind retry, setup repair or bypass. FAIL returns exact findings to the original executor. An ended child needs an honest bounded continuation from its checkpoint, not a promised technical resume. Docker tools use `/workspace`; inaccessible host paths are not proof of host absence.

The executor writes its own outcome only with authorized file tools; no bookkeeping agent. Supervisor writes only its own review receipt/fields after explicit target permission, never fixes or another worker's implementation accounting. Preserve history, failed/partial attempts, false-positive diagnoses, corrections and timing/usage unknowns. Historical direct/hybrid Lead records do not authorize Lead writes. Docs-only work may explicitly skip website builds/tests, never a required independent gate. Editing rules does not activate them in already injected instructions.

## Source collection and backfill gates

- Freeze the authorized source/external-ID cohort and preserve unrelated records. Use known source evidence; UNKNOWN must not overwrite known values or become a negative fact. Missing search results do not prove unavailability.
- Reuse the current parser/mapper or its verified Git implementation. Preserve raw identifiers and distinguish source payload/enum contracts; never guess an unobserved numeric or string enum.
- Reconcile unique cohort IDs, exclusive totals and actual changed rows before reporting completion. Unmatched and partial-scan records remain investigation candidates, not unavailable listings.
- Keep approval for search, detail requests, model calls and database writes separate. Changing a crawler does not authorize restarting a stopped scan.

Follow `references/data-pipeline-verification.md` for source evidence, enum/persistence tests, batch checkpoints and readback recipes.

## Long-running work and reporting

- Honor completion-only reporting: no unsolicited milestones, recovery reassurance or tracking-error notifications. A direct progress request warrants one fresh read-only check and concise verified counts; it does not reinstate periodic monitoring or restart work.
- On explicit stop or user takeover, stop actual task-owned jobs/reviewers and verify the boundary. Do not resume from delayed completion messages. On a status-only interruption, report without continuing edits or new external work.
- An explicit hands-off wait forbids monitoring interventions but does not itself stop an authorized worker. A backup request authorizes a snapshot only; preserve the producer and report the saved snapshot's count.
- Keep durable saved progress, current observations and exact database state distinct. Atomic checkpoint files and process-tracker status are not transaction or worker-completion proofs.
- Preserve the code version used by an in-flight process. Files edited after import do not update that process; any restart/replay needs the appropriate authorization.

The checkpoint/backup and log-delivery recipe is in `references/data-pipeline-verification.md`.

## Read-only housing-ranking changes

- Inspect existing eligibility/config, ORM coverage, runner and tests before scoring changes; wait for the agreed plan before production implementation. Extend the existing production scorer rather than adding a parallel production engine. An explicitly requested offline alternative belongs in an isolated experiment. Defer external location enrichment until separately approved.
- Apply exclusive hard-filter categories before market/location scoring so totals partition the full input. Enforce price €80–200k inclusive, area≥60m² and rooms≥2 centrally; crawler parameters are not a validity guarantee. Mandatory UNKNOWN is eligibility-unverified/review, not PASS or BAD. Missing coordinates, market delta or comparables do not invalidate otherwise eligible housing.
- Treat €100–150k as the working budget, with more expensive offers requiring substantive extra value. Optimize personal living, not ROI. Avoid total/price and duplicate €/m²/market bonuses. Keep floor0 distinct from floor1; do not silently reintroduce a first-floor penalty.
- Preserve market methodology and cache policy unless separately approved. Read cached analyses unchanged and calculate missing ones transiently. Keep eligibility ranges separate from age-weight bands, validate contradictory/open bounds, and never infer midpoint age.
- Verify no writes with an isolated ORM cohort, captured SQL and guarded commit/flush. Reject pending-mutation sessions, use `session.no_autoflush` and enforce PostgreSQL READ ONLY in the entry point.
- Preserve full score ordering before any display selection. Compare TOP before/after suppression in the same run, not by recomputing market/scoring. Retain every listing and export representative/alternative IDs, reasons and actual detector pair verdict/evidence for each reversible display decision.
- Investigate repeats with exact/unit evidence and contradictions before suppression. Boilerplate, price/area/location, cosine and unknown-role galleries do not prove one unit. Keep missing/stale embeddings unverified; no candidate or strong verdict does not establish uniqueness or diversification.

## Ranking audits before redesign

1. Measure only: preserve production scoring, detector, integration, schema and crawler. Freeze the saved cohort/inputs, check source hashes before/after, and store diagnostic outputs separately.
2. Separate archived observations, same-cohort reconstructions and current-live measurements. Matching totals alone does not establish unchanged IDs or historical scores.
3. Reconcile exclusion transitions by IDs; calculate component/adjustment distributions, pairwise-valid correlations and mathematical requested-listing comparisons. Adjustments already compose component totals, not a fourth additive score.
4. Measure existing project/republication hypotheses without applying grouping or suppression. Keep whole-cohort membership distinct from TOP-induced graphs and never call hypothesis/singleton counts unique physical-object counts.

## Offline ranking redesign and comparison

1. Distinguish design/comparison authorization from replacing production. Freeze baseline scores and cohort; isolate a pure model and verify production/input hashes. Keep project/dedup membership and embedding availability outside score; diversification/presentation is a later layer.
2. Optimize attractiveness for personal living relative to expenditure, not newest buildings or maximum discount. Separate hard eligibility, housing utility, absolute affordability, relative market value and location quality.
3. Declare subjective weights, diminishing-return curves, budget tradeoffs and UNKNOWN treatment before outputs. Do not automatically transfer old weights or correlated modern/lift synergy, tune named examples, infer condition from age or disguise neutral utility priors as source facts.
4. Deliver full baseline/alternative TOP lists, requested pair breakdowns, biggest risers/fallers, component distributions, valid correlations, disjoint price-zone counts, real premium/cheap counterexamples and sensitivity. Explain softened known accessibility penalties; a rise in rank is not an improvement in the home.
5. Judge code correctness separately from model suitability. Weighted variance, uncertain condition/floor, implausible advertised area and excessive price-zone concentration can invalidate a tested preference model. Do not hide dubious rows, silently retune curves or claim weight stability validates data quality or curve shape.

Follow `references/ranking-diagnostics.md` for statistical conventions, pure experiment commands, bounded-simplex sensitivity and artifact verification.

## Duplicate evidence and retrieval verification

- Keep Listing, Physical Property and Development distinct. Give cosine zero physical-identity points; use it for retrieval only. Cap correlated evidence families, gate identity on unit contradictions and preserve source/normalized claims, uncertainty and provenance.
- Preserve description semantics: ASSERTED_PRESENT, ASSERTED_ABSENT, POSSIBLE_OR_HYPOTHETICAL, PROJECT_LEVEL and UNKNOWN. Only genuinely asserted unit-specific facts can match/contradict physical properties; negated numeric quantities must not invent zero counts.
- Use an extensible attribute registry with common scope/unknown/hypothetical/negation gates for all readers. Test prefix/suffix qualifiers, coordinated amenities, explicit absence, original captured cases and downstream verdicts. Partial terrace counts/area enumerations remain UNKNOWN; namespace unit identifiers before identity scoring.
- Shared project photos/templates can depict real interiors without belonging to the offered unit. SHA/dHash are one correlated family. Preserve photo-role uncertainty and scope reuse-risk to directly compatible local/project context; test unrelated-town independence and permutations, not just lack of mutable globals.
- Use pairwise-consistent cliques for physical hypotheses, not transitive closure. Overlapping, contradictory, incomplete or search-bounded groups remain review. Keep price, agency and wording changes compatible with republication, not identity vetoes.
- Compare downloaded image bytes/fingerprints rather than only URLs and count distinct one-to-one matches. Keep captured automatic outputs separate from manual interpretations; disclose download failures/gallery limits without claiming sale or technical-building safety.
- Require sparse corpus comparison of supplied candidate edges with compact results; retain exhaustive mode only for small fixtures. Do not retain full payloads for all pairs. Detail provenance belongs to actually analyzed candidate pairs.
- Validate async AI adapters against the current primary API contract, with caller-owned sessions and actual synthetic loopback HTTP tests. Separate HTTP correctness, installed models, live reachability and semantic quality. Follow `references/ai-client-contracts.md` for adapter payload/validation and batch-performance procedure.

### Acceptance gate

1. Keep validation-only work separate until GREEN implementation is authorized. Explain conceptual test errors and obtain required approval; never weaken safety expectations or tune thresholds solely for green tests.
2. Give workers exclusive file ownership. The assigned executor runs proportionate integrated checks, named captured benchmarks and real reproduced regressions on the same source version after relevant writes finish. Lead only controls evidence, never artifact-producing checks or code review. Resume external validation only after required gates pass.
3. Preserve RED/provisional/captured artifacts. Distinguish retrieval coverage, hypothesis strength, confirmed identity and independently labeled truth. Partial coverage is not a full-corpus result.
4. Verify deterministic TOP-K against a fixed scalar-reduction oracle across chunk shapes, short blocks, reversed IDs, identical vectors and one-ULP near ties at real dimensions. Do not hide BLAS shape dependence with score tolerance, rounding or coalescing; qualify numerical guarantees by the tested environment.
5. Recompute neighbors from validated existing vectors after ranking/reduction-only fixes; do not re-embed unchanged inputs. Use the same reduction for retrieval and reference-rank diagnostics. Preserve frozen selections and input/model cache namespaces.
6. Close only with real tests/reviews, source/selection hashes, validated counts and verified artifacts. Zero physical positives demonstrates conservative abstention, not calibrated precision or positive sensitivity. Strong-only integration with zero real strong groups is a display no-op, not proof of no duplicates.

## Presentation-only cleanup

- Capture originals before formatting, especially for untracked source files. Compare emitted JavaScript ASTs rather than raw JSX text so rendered whitespace remains part of the check; compare CSS rule/declaration order and values while ignoring comments and formatting only.
- Reuse immutable pre-change browser screenshots and verify their source provenance before pixel comparison. Decode pixels with an existing image dependency instead of comparing PNG encoding bytes; report exact viewport/locale coverage rather than claiming universal visual identity. When differences are confined to photo rasters, inspect currentSrc candidate width, natural size and DPR before attributing them to layout. A browser-only fixed-candidate probe can isolate responsive-image/cache selection, but report it separately from natural captures and never relabel their pixel result or change production image quality merely to force parity.
- When a prior whole-source fingerprint exists but per-file history does not, substitute captured originals into the current fingerprint calculation to verify that files outside the cleanup scope stayed unchanged. Remove temporary formatting generators/proposals; retain only proportionate verification evidence.

## Pitfalls and completion

- Prefer standard verification proportional to the risk; avoid whole-table hashing and large temporary harnesses without a concrete need.
- Do not add component timings already included in measured end-to-end runtimes or present sample extrapolations as full measured performance.
- Treat invented API kwargs/claim fields as specification gaps, not violations of an existing contract; distinguish synthetic fixtures from real captured payloads/model outputs.
- Report actual commands/results, changed behavior, external-state boundaries and remaining limitations. If blocked, say so plainly; do not manufacture output or imply permission to commit.
