# Model quality and implementation ownership ledger

## Scope

Prospective procedural tracking starts with registration timestamp `2026-11-11T18:36:48Z`. Historical benchmark files remain at `../model-benchmark/`; historical project delivery coverage is **unknown**, not zero defects/rework. No runtime hooks or automatic exhaustive capture are installed. Use the lead-profile skill `model-quality-accounting` for each nontrivial task and update records after validation/review.

Canonical file: `ledger.json`. Preserve unrelated source/Git state and never log credentials or entire private prompts. References should point to safe evidence, not credential/session dumps. Do not switch models/providers to collect data.

## Unit and counting rules

- One stable ID per bounded deliverable; register scope/criteria before substantial work. A tool call, greeting, notification or routine acknowledgement is not a task.
- `count_as_delivery_unit` prevents counting an umbrella request AND its children in the same delivery denominator. Set it false for containers and standalone review/QA/coordination units. Report those activities separately.
- Categories: implementation, documentation_workflow, research, review, validation, coordination. Report coding outcomes separately from workflow/research/benchmark outcomes.
- `execution_mode`: direct, delegated, hybrid, unknown, based on actual implementation contributors. A parent only orchestrating/reviewing/testing a child's implementation does not make it hybrid. Substantial parent implementation/correction does. A direct implementation plus independent review remains direct.
- Record `direct_reason` for direct work and `parent_implementation_takeover` when taking over actual implementation. Task share is not time/effort share.
- IDs must be unique; attempts and corrections link to unit/attempt IDs. Revision/correction rounds inside a single invocation still count; do not equate attempts with API calls.

## Record contract

Each unit includes `id`, `parent_id`, `category`, `count_as_delivery_unit`, `objective`, `scope`, `acceptance_criteria`, `registered_at_utc`, `execution_mode`, `direct_reason`, `implementation_contributors`, `delivery_state`, `first_submission_disposition`, `correction_history_complete`, `parent_implementation_takeover`, `supervisor`, `evidence`, `limitations`.

States: in_progress, awaiting_review, accepted, rejected, blocked, cancelled. `accepted` requires applicable explicit independent Supervisor PASS plus validation evidence; technical/visual/owner/release acceptance remain distinct. First submission: pending, accepted, rejected, unknown. Do not treat failed provider calls as rejected solutions.

Each attempt includes `id`, `unit_id`, `actor`, `role`, `actual_model`, `provider`, `route`, `model_evidence`, `delegation_id`, `status`, `evidence`, `limitations`. Use null for unexposed metadata. Preserve failed/superseded attempts. Completion notifications can prove returned model/output, not independently prove correctness. Roles: implementer, researcher, reviewer, validator, coordinator. Duration/usage fields are optional and require evidence and timing scope.

Each correction includes `id`, `unit_id`, `attempt_id`, `round`, `by`, `cause`, `confirmed`, `implementation_changed`, `evidence`. Causes: implementation_defect, instruction_miss, false_positive_review, requirement_change, environment_or_provider, integration, unknown. Keep corrected defects, rejected warnings and environment failures separate.

For review tasks persist original verdict and each finding's confirmed/rejected/unresolved disposition with evidence; parent triage is not the independent Supervisor PASS. Missing records/history stay unknown, not successful/no-rework.

## Metrics (calculate using tools, never estimate)

Filter by period/category and `count_as_delivery_unit`, deduplicate IDs and show all denominators/exclusions. Group by actual model/route AND role; do not infer a router's downstream model.

- **Direct-only share:** direct units / delivery units with known mode. Report delegated-only, hybrid and unknown counts alongside it.
- **Parent-involved share:** (direct + hybrid) / delivery units with known mode. Not an effort/time estimate.
- **First-submission acceptance:** units accepted on first submission without confirmed corrective implementation / evaluated units with known first-submission disposition. Pending, blocked and unknown are separate.
- **Confirmed model rework:** units with confirmed implementation_defect/instruction_miss corrections / evaluated units with known correction history. Requirement, environment, integration and reviewer-warning changes reported separately.
- **Parent takeover:** count eligible units with actual implementation takeover; report denominator and cause.
- **Reviewer precision:** confirmed/rejected/unresolved findings, distinct from implementer success; disclose unresolved coverage before any percentage.

Do not combine benchmark test-case counts with delivered-task success. Preserve original historical reports. Reconstructing old coverage is a separate audit, not fabricated backfill.

## Initial status

The initial workflow-setup unit is accepted after independent Supervisor PASS ([receipt](review-setup.json)) and validation. It remains parent/direct implementation with separate review by gateway-confirmed `gpt-6-luna`; review does not change implementation ownership. The within-attempt authoring correction is retained, so acceptance is not misreported as correction-free work. This is a documentation/workflow sample, not coding success-rate evidence. No historical direct/delegated percentage is currently known.
