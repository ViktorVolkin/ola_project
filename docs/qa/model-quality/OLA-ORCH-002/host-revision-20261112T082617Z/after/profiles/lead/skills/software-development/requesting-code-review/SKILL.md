---
name: requesting-code-review
description: "Use when preparing risk-based verification and review."
version: 2.1.0
author: Hermes Agent (adapted from obra/superpowers + MorAlekss)
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [code-review, security, verification, quality, evidence]
    related_skills: [subagent-driven-development, test-driven-development, github]
---

# Pre-Commit Code Verification

Risk-proportionate verification guidance. Run required automated checks and preserve evidence. For low truly local isolated changes, executor checks may suffice; supervisor review is not_required. Medium shared behavior/integration/substantial UI, high/critical, or explicitly review-required work needs only the actual @supervisor gpt-6.1-sol with runtime evidence. Do not silently downgrade risk. A reviewer never implements its own fixes.

## When to Use

Use when an executor prepares verification for a bounded change or an authorized actual reviewer examines it. Documentation/config changes still need scoped checks and any explicit review gate. Do not equate file count with risk or skip required review in a one-shot invocation.

## Ownership and risk

OLA Lead analyzes, plans, routes, coordinates and controls evidence only: no project writes, integration, fixes, artifact-producing checks or code review. One executor owns diagnosis/repro/root cause, minimal change, checks, packet and its own final accounting. Split only independent scope, materially different specialty/risk or a genuine blocker. No separate bookkeeping/formatting/relay agents, mandatory stage-review chains or automatic third fixer. Checkpoints serve long, expensive or interrupted work.

Record risk_level/reason, review_required/reason and acceptance_basis. Luna `gpt-6-luna` is routine/local/docs, Terra `gpt-6.1-terra` primary React/integration/moderate, Sol `gpt-6.1-sol` hard architecture/critical/security/auth/payments/data integrity. Actual runtime evidence determines identity; never guess a router's model or change routing/config to collect it.

Low isolated work without an explicit gate may close on confirmed executor checks. Medium/high/critical or explicit independent-review requirements go only to actual `@supervisor` on runtime-confirmed `gpt-6.1-sol`, not a named child or cheaper substitute. OLA-ORCH-002 explicitly requires it; OLA-WF-001's explicit/BLOCKED gate remains unchanged.

## 1. Capture scope and diff

Read current files and inspect staged AND unstaged changes without changing Git state. For untracked or host-side rules preserve originals and targeted before/after diffs. An empty tracked diff does not mean nothing changed. Do not require staging to inspect, default to an unrelated prior commit or disturb user edits/deletions. Split large evidence by file without discarding task context.

## 2. Targeted static checks

The executor checks changed lines for exposed secrets, unsafe command construction/evaluation, deserialization, SQL interpolation, traversal and unhandled I/O as applicable. Use actual diff evidence, not a whole-project health campaign. These are executor checks, not a Lead code-review stage or independent approval. Distinguish intentional negative examples from executable vulnerabilities.

## 3. Proportionate verification

Run established relevant checks after the final edit. For docs/rules validate readback/diffs, structured data, IDs/references/evidence paths and whitespace; mark website build/tests not applicable with a reason. For code run required lint/types/tests/build and affected integrated/browser checks. Capture existing baseline evidence where available; do not alter repository state to create a baseline. Preserve known failures, partial coverage and unknowns; a missing required tool is BLOCKED, not a silent skip or automatic install.

Ordinary reads of needed materials/dependencies remain necessary; no recurring tool-health/reconnect/model-config preflights. On actual BLOCKED stop affected work until cause resolution within its authority, without blind retry, setup repair, route/config/permission changes or borrowed connections. Docker workers use `/workspace`; inaccessible host paths are not proof of host absence.

## 4. Useful executor packet

Supply task card/criteria, risk and review rationale, exact before/after/diffs, source identity, actual checks and outputs, preserved attempts/corrections and limitations. Include relevant design/i18n/browser context; do not give a reviewer only a decontextualized diff. Actual model/provider/profile need runtime evidence or null.

## 5. Actual independent gate

When required, Lead sends one review to real `@supervisor` on runtime-confirmed Sol; it never performs that review itself. Explicitly gated one-shot and docs-only work remains gated. If reviewer identity/access/evidence is unavailable, keep BLOCKED/awaiting_review. A completion, self-check, writable tool or delivery exit code is not PASS.

Supervisor may persist only its own review receipt/fields after explicit authorization naming the targets. It never patches product/source/tests, implements fixes or completes the executor's accounting. Without write permission it returns a message.

## 6. Correction and handoff

Preserve the actual verdict. FAIL returns exact location/impact/repro findings to the original executor for correction and affected rechecks. If that child ended, use a bounded checkpoint-based continuation, not a promised technical resume or automatic third fixer. BLOCKED stops acceptance until cause resolution, not until a different reviewer produces a preferred verdict.

The executor writes one logical final record, retaining failed/partial attempts, false positives, corrections and timing/usage unknowns. Review-only work is not implementation ownership. No bookkeeping agent or automatic Git mutations; repository-state changes need separate authorization. Low isolated review-not-required work uses documented executor checks without a fictional Supervisor PASS. Required review plus actual checks permits gated acceptance, not self-certification.

## Reference: Common Patterns to Flag

### Python
```python
# Bad: SQL injection
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
# Good: parameterized
cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))

# Bad: shell injection
os.system(f"ls {user_input}")
# Good: safe subprocess
subprocess.run(["ls", user_input], check=True)
```

### JavaScript
```javascript
// Bad: XSS
element.innerHTML = userInput;
// Good: safe
element.textContent = userInput;
```

## Integration with Other Skills

Use subagent-driven-development for one bounded executor cycle, not compulsory two-stage review. Apply TDD selectively to behavior/regressions. Use actual risk and explicit gates to choose checks/review. Persistent edits do not automatically replace already injected live role instructions.

## Pitfalls

- Empty tracked diff: account for untracked files and host-side originals before concluding nothing changed.
- Missing essential files/tools: exact BLOCKED boundary, not automatic setup repair or blind retry.
- False-positive findings: preserve and verify their disposition; they are not confirmed implementation defects.
- Partial/timeout checks: not PASS; preserve coverage and use cause-resolved bounded continuation when authorized.
- No automatic stage-review/fixer chain, repository mutation or waived explicit review gate.
