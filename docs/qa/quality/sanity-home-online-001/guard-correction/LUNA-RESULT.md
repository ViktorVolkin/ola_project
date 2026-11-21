# Luna targeted port-guard regression

**Scoped result: PASS.** Executed only the prepared regression and one exact-port check; no root source/build guard, build, browser, suite, cloud, deployment, or Git operation.

Runtime as exposed to this executor: `gpt-6-luna` (regular profile; no configuration change). Commands, foreground, `/workspace`:

```bash
(set -o noclobber; python3 "docs/qa/quality/sanity-home-online-001/guard-correction/regression.py" > "docs/qa/quality/sanity-home-online-001/guard-correction/luna-regression.log" 2>&1)
(set -o noclobber; python3 "docs/qa/quality/sanity-home-online-001/guard-correction/port_guard.py" --ports 42241 42242 42244 3333 > "docs/qa/quality/sanity-home-online-001/guard-correction/luna-exact-ports.log" 2>&1)
```

- Regression exit 0; six cases passed: occupied-listener rejection (errno 98) and clean-handoff acceptance for listener reuseaddr false and true; old no-reuse guard TIME_WAIT RED control (errno 98); corrected TIME_WAIT handoff acceptance. This includes the required negative occupied-listener checks; no bypass. Regression uses context-managed owned ephemeral sockets, which closed on completion.
- Exact-port command exit 0; a single corrected exact IPv4 loopback bind+listen check passed for 42241, 42242, 42244 and 3333. This establishes availability only at this check, not the state during the earlier run.
- No retries, kills, installs, environment/permission changes, or source edits. Historical original post-run guard remains BLOCKED; this is not retroactive proof of its socket state. No Supervisor review performed; parent-required review and all cloud/deployment gates remain.
