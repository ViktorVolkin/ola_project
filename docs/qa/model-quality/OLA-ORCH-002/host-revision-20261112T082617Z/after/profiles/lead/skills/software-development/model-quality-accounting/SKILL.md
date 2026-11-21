---
name: model-quality-accounting
description: "Use when executing or reviewing model tasks. Log outcomes."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [models, quality, delegation, accounting]
    related_skills: [model-provider-benchmark, ola-frontend-foundation]
---

# Model quality and delegation accounting

## When to Use

Use for nontrivial task execution/review and questions about model success, rework, parent takeover or delegation frequency.

## Scope and storage

Keep durable project-local evidence of real task outcomes AND direct-versus-delegated implementation. At the beginning of nontrivial implementation, research, review or workflow work, load this skill. Use `docs/qa/model-quality/ledger.json` and its README in the active project; create them if absent after discovery. Do not store task logs in global memory. Do not change model routing, configuration, hooks, credentials or other profiles to collect statistics. This is procedural accounting, NOT automatic runtime telemetry.

For OLA, Lead is orchestration-only: read/plan/route/control evidence, never create/patch/integrate/repair project files (code, config, docs, tests or ledger), bypass via scripts, or perform artifact-producing checks or code review. One executor owns a bounded task's diagnosis, minimal fix, necessary checks, evidence and task accounting; split only independent scope, materially different specialty/risk, or a true blocker. Direct/hybrid fields preserve history/violations, not permission. Do not create accounting/formatting/relay agents. Final review is only actual @supervisor gpt-6.1-sol with runtime evidence when risk/explicit gate requires it; preserve verdicts. If unavailable/unverified, BLOCKED.

## Define a unit before doing substantial work

Record one bounded work unit with a stable unique ID, objective, category, scope, acceptance criteria, registration time and evidence links. Keep similarly sized scopes comparable; do not count individual tool calls, greetings, delivery notifications or trivial acknowledgements as tasks. Relate parent/child work using parent IDs. A user-request container and its child implementation units must not both enter the same denominator. Default delivery metrics include leaf implementation units; report documentation/workflow/research separately. Record execution mode for ACTUAL implementation contributors: direct, delegated, hybrid or unknown. Independent review, routine integration checks and orchestration alone do not convert delegated implementation into hybrid. Substantial parent implementation/correction does; explain it. Record why work was direct rather than delegated. Do not enforce an arbitrary delegation quota.

## Record attempts and verification

For every parent or child attempt, persist actor/profile, role, actual returned model/provider/route when exposed, model evidence, delegation ID if any, outcome, limitations and evidence. Unknown means null/unknown, not inferred from defaults. Routers are routes, not proof of a downstream model. Preserve failed, truncated, blocked and superseded attempts, not just final successes. Use reported timings/usage only; distinguish child duration, batch wall time and API latency. No invented cost/token/time counters.

Keep delivery state (in_progress, awaiting_review, accepted, rejected, blocked, cancelled) separate from model output status and independent review. Acceptance requires actual validation evidence and independent Supervisor PASS when risk or an explicit gate requires it; low isolated review-not-required work records confirmed executor checks as its acceptance basis, not a fictional PASS. A child's self-reported success or a build alone is not acceptance. For reviews, keep the reviewer's original verdict, parent dispositions and Supervisor disposition separate; never rewrite FAIL as PASS. A rejected warning is not a confirmed code defect.

For every actual correction record who changed it, which attempt caused it, whether it was parent takeover, cause, confirmation/evidence and round. Causes: implementation_defect, instruction_miss, false_positive_review, requirement_change, environment_or_provider, integration, unknown. Count within-attempt correction rounds too, not just fresh delegations. Routine verification is not rework. False-positive review triage is reviewer-quality evidence, not implementer code rework. Never assign model-quality blame for provider quota/auth/tool failures.

## Risk and review fields (backward-compatible)

Keep schema_version and old records unchanged. New units may add risk_level, risk_reason, review_required, review_reason and acceptance_basis. Low isolated units without an explicit gate can use confirmed executor checks. Medium/high/critical or explicitly gated units require actual `@supervisor` on runtime-confirmed `gpt-6.1-sol`. OLA-ORCH-002 is explicitly gated; OLA-WF-001 stays BLOCKED until its own review resolves it. Never downgrade risk or rewrite historical acceptance/verdicts to apply new policy retroactively.

Luna `gpt-6-luna` handles routine/local/docs; Terra `gpt-6.1-terra` primary React/integration/moderate; Sol `gpt-6.1-sol` hard architecture/critical/security/auth/payments/data integrity. Guidance is not actual-model evidence or permission to change routing. No automatic reviewer/fixer chain or Git mutation. Lead never performs code review, writes or artifact-producing checks.

FAIL returns exact findings to the original executor; BLOCKED stops affected work until cause resolution, without blind retry/repair/bypass. Keep ordinary material checks, not mandatory health/reconnect/model-config campaigns. Persistent rule edits do not replace already injected live instructions.

## Report reproducible statistics

Compute counts/rates using tools from the persisted ledger; never mental arithmetic. Always state period, categories, unit definition, denominator, exclusions, unknowns, incomplete records and sample size. Deduplicate stable IDs, resolve parent/child overlap, and separate synthetic benchmarks from production tasks and model versions/routes. Do not pool different complexity/roles into a universal ranking.

Report at minimum:
- per model AND role: evaluated accepted/rejected units, first-submission acceptance, accepted after confirmed corrective work, confirmed defect/instruction-miss rework, parent implementation takeovers; blocked/unknown/pending separately;
- reviewer findings: confirmed, rejected, unresolved, with verification coverage; no false-positive percentage while dispositions are unresolved unless denominator explicitly restricted;
- implementation ownership: direct-only, delegated-only, hybrid and unknown units; direct-only share and parent-involved share separately. Distinguish these task counts from effort/time share, which is unknown without reliable timing;
- technical completion, Supervisor acceptance, visual/owner approval and release remain distinct.

First-submission acceptance denominator: evaluated units with a known first-submission disposition; numerator: accepted without confirmed corrective implementation. Rework denominator: evaluated units with known correction history; numerator: units with confirmed implementation_defect/instruction_miss correction. Report requirement/environment corrections separately. If a field/history is unknown, exclude it from that metric and show the excluded count. Count parent takeover only when implementation changed hands, not normal review.

Maintain a generated or manually tool-calculated summary with source IDs/evidence. Do not claim historical percentages from anecdotes. Historical recovery is a separate bounded audit: mark recovered records and coverage, preserve unknowns; current tracking must not pretend to cover old sessions. Close/update records after results and review; pending asynchronous work stays pending.

## Workflow lessons

- Do not run recurring tool/connection health preflights or contact an engineer for setup. Check practical task materials/dependencies as normal work proceeds; if required access is unavailable, stop BLOCKED and report it without repairs or blind retries.
- Bundle small frontend diagnosis, reproducible RED, fix, checks and packet preparation into one bounded executor task when appropriate; separate diagnostics only when they reduce uncertainty. Visually hidden text is not evidence of a missing accessible name: require actual accessibility-name checks before adding ARIA.
- The executor writes its own single logical final result with an authorized file tool. No separate bookkeeping/formatting/relay agent and no Supervisor takeover of another executor's implementation accounting. Supervisor may write only its own review receipt/fields after explicit target permission; tool availability is not permission. Preserve incomplete invocations; checkpoints serve long, expensive or interrupted work. An ended child receives bounded continuation, not a promised technical resume.
- Include the executor's own final recording work in its attempt coverage, with actual runtime evidence or unknown counters. Historical bookkeeping attempts remain history, not a recommendation to repeat them. Do not claim exhaustive coverage from incomplete records; distinguish measured wall intervals, child durations and API latency without summing overlaps.
- A completion banner's model ID and a contradictory wrapper error are distinct evidence. Preserve the ambiguity; no silent provider/downstream attribution or model-quality blame. Missing Supervisor project access is an environment BLOCKED outcome, not a code FAIL.
