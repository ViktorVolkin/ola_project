---
name: subagent-driven-development
description: "Use when delegating bounded end-to-end implementation."
version: 1.1.0
author: Hermes Agent (adapted from obra/superpowers)
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [delegation, subagent, implementation, workflow, parallel]
    related_skills: [requesting-code-review, test-driven-development]
---

# Subagent-Driven Development

## Overview

Assign one executor to a coherent bounded task's full cycle: diagnosis, real reproduction/root cause where applicable, minimal implementation, proportionate checks, useful evidence and its own final accounting. Split only independent scope, materially different specialty/risk or a genuine blocker. Fresh context is not a reason for mandatory stage agents, short time fragments or automatic reviewer/fixer chains.

## When to Use

Use when requirements or a plan can be assigned with clear file ownership and executable acceptance criteria. Give the executor the full task and necessary context instead of sending another agent to relay or reformat it.

## Roles, tiers and paths

OLA Lead only analyzes, plans, chooses a tier, coordinates and controls evidence. Never writes/integrates/repairs project files, performs code review or runs artifact-producing checks. Workers use `/workspace` inside Docker; host project paths are not interchangeable with that mount. Report required inaccessible materials as BLOCKED rather than escaping the boundary or repairing the environment.

- Luna `gpt-6-luna`: routine/local/documentation work.
- Terra `gpt-6.1-terra`: primary React/Next implementation, integration and moderate debugging.
- Sol `gpt-6.1-sol`: hard architecture, critical/security/auth/payments/data integrity.

Use existing configured routing without changing it. Record actual profile/provider/model only from runtime evidence; unknown stays unknown. A route label or router is not proof of the executing model.

## Prepare and dispatch

1. Read the requirements, plan and practical task materials; preserve user edits and explicit gates.
2. Record task_id, exact writable scope, worker-visible paths, non-goals, acceptance criteria, check plan and evidence/accounting targets.
3. Set tier/routing reason, risk_level/risk_reason, review_required/review_reason and acceptance_basis. Classify actual impact, not a filename keyword; never downgrade risk to avoid review.
4. Dispatch one executor for the coherent full cycle. Do not create separate diagnosis, logging, formatting, bookkeeping or relay agents. Checkpoints serve long, expensive or interrupted operations, not arbitrary 2–5-minute fragments.

## Execute and verify

The executor diagnoses a real reported defect before fixing it; documentation-only work does not need a fabricated behavioral repro. Use TDD selectively for behavior/regressions, not compulsorily for static styling or documents. Run necessary integrated checks after final edits, preserve source/check identity and record skipped checks with reasons. Website builds/tests may be explicitly not applicable for docs-only work; required review is never waived by that distinction.

No recurring tool-health/reconnect/model-config preflight campaigns. Normal material/dependency reads remain necessary. On actual BLOCKED, stop affected work until cause resolution within the proper authority; no blind retries, setup repair, connection borrowing or policy bypass.

## Independent review and disposition

- Low isolated work without an explicit review gate may close on confirmed executor checks; record Supervisor not_required, not a fictional PASS.
- Medium/high/critical risk OR explicit independent-review requirements go only to actual `@supervisor` on runtime-confirmed `gpt-6.1-sol`. A child titled Supervisor is not that profile. Supply the full task context, before/after/diffs, check evidence, attempts and limitations.
- This cross-cutting OLA-ORCH-002 package explicitly requires actual Sol Supervisor review. OLA-WF-001's explicit/BLOCKED gate is not waived retroactively.
- Preserve the real verdict: a completion or delivery exit code is not acceptance. FAIL goes with exact findings to the original executor. BLOCKED stops acceptance until its cause is resolved.
- If the child ended, give a bounded continuation its checkpoint and accumulated evidence; do not promise technical resume or automatically add a third fixer. Make any necessary ownership/tier change explicit.
- Supervisor never implements fixes or finishes another executor's implementation accounting. It may write only its own review receipt/fields after explicit permission for those targets; tool availability is not permission.

## Closeout and example

The executor returns changed paths, actual checks, source/evidence identity, remaining limitations and one logical final record. Preserve failed/partial attempts, false-positive diagnoses and confirmed corrections. No automatic Git mutations; commits or other repository-state changes need separate explicit authorization and an assigned executor.

Example: one local documentation task gives one Luna executor the exact document, existing link targets and readback/diff checks. If risk is genuinely low and no explicit review gate exists, its confirmed checks are the acceptance basis. An auth correction instead needs a coherent sensitive-scope task, Sol routing and actual required independent review; it is not mechanically split into model/hash/endpoint/reviewer agents.

## Integration and pitfalls

Use requesting-code-review for risk-based review inputs, not a mandatory spec/quality/integration reviewer sequence. Use systematic-debugging for real bugs. Preserve substantive security, product and approval constraints. Editing these rules does not replace already injected instructions in a live session; owner-controlled activation remains distinct.

## Further reading (load when relevant)

When the orchestration involves significant context usage, long review loops, or complex validation checkpoints, load these references for the specific discipline:

- **`references/context-budget-discipline.md`** — Four-tier context degradation model (PEAK / GOOD / DEGRADING / POOR), read-depth rules that scale with context window size, and early warning signs of silent degradation. Load when a run will clearly consume significant context (multi-phase plans, many subagents, large artifacts).
- **`references/gates-taxonomy.md`** — The four canonical gate types (Pre-flight, Revision, Escalation, Abort) with behavior, recovery, and examples. Load when designing or reviewing any workflow that has validation checkpoints — use the vocabulary explicitly so each gate has defined entry, failure behavior, and resumption rules.

Both references adapted from gsd-build/get-shit-done (MIT © 2025 Lex Christopherson).
