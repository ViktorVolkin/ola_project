# Port-guard corrective checkpoint — OLA-SANITY-HOME-ONLINE-001

**Guard defect reproduced; minimal versioned correction PREPARED. Luna regression and actual Supervisor review pending. Original final post-run guard remains BLOCKED, not retroactively PASS.**

## Scope and actual identity

Delegated harness-owner correction, visible developer runtime `gpt-6.1-sol / openai-codex`; parent completion reconciliation pending. HIGH parent integration risk and actual Sol Supervisor gate retained; no reviewer/helper invoked. Read `RELEASE-CHECKPOINT.md`, `LUNA-RESULT.md`, exact failed log, old guard and actual browser cleanup implementation. No root source comparison/run, manifest rebasing, installs, secrets/environment/credential-file reads, cloud writes, deployment, Git mutation, process kills or system repair. Concurrent Terra changes are explicitly outside this correction.

## Cause investigation: proven versus historical unknown

Ranked hypotheses: (1) Python default no-reuse bind rejects residual TIME_WAIT while Node can rebind; (2) a real listening process remained; (3) a connection had not finished closing. The original Python guard creates AF_INET/SOCK_STREAM with default `SO_REUSEADDR=0` and only binds. Browser cleanup awaits child exit/server close, then actually starts and closes Node HTTP listeners on the same exact IPv4 addresses. These are different contracts.

Controlled diagnostic `diagnose.py` was executed, first as Python-only proof (`diagnostic.json`), then extended to prove the actual pinned Node behavior (`diagnostic-node.json`), without overwriting the first result. These were causal probes on own OS-selected ephemeral endpoints, not retries of the conflicted ports or project regressions.

On the second owned endpoint **44147**:

- While own server was listening, both raw and SO_REUSEADDR bind+listen probes failed errno98.
- After orderly server-active FIN/client EOF/FIN, `/proc/net/tcp` for that exact endpoint showed **06 TIME_WAIT**, and **no0A LISTEN**.
- Old raw Python bind failed errno98; same exact endpoint with SO_REUSEADDR and actual listen succeeded.
- Actual pinned Node24 `net.createServer().listen(port,'127.0.0.1')` on that endpoint also succeeded and closed normally.

This **proves a false-occupancy defect in the old guard and the Node/Python semantic mismatch**, not merely a conjecture. No SO_REUSEPORT, wildcard address, retry, delay or port substitution was used to make a requested endpoint pass.

**Historical attribution limit:** Luna's original failure recorded errno98 and no reachable listener, but did not retain contemporaneous TCP state/socket-option data. A single late, filtered read of `/proc/net/tcp{,6}` for42242/42244 found no rows (`late-filtered-socket-state.json`). It cannot reconstruct earlier state or conclusively exclude a transient third-party occupant at that historical instant. Therefore the original result is preserved as BLOCKED; do not assert that every historical cleanup failure was false.

## Minimal correction and preservation

- Original `../verify-binding.py` is untouched; exact before bytes copied to `verify-binding-before.py.txt`.
- `port_guard.py`: exact AF_INET/SOCK_STREAM + `SO_REUSEADDR=1`, bind **127.0.0.1**, then **listen**, close context. Actual occupied listening ports still reject; no collision bypass.
- `verify-binding-v2.py`: new version using that helper; remaining source/build checks retained. **Not run**, because root inputs may now legitimately differ from the frozen Luna source. Do not replace the old root manifests or run this as proof of unchanged current root.
- `guard.diff` captures original→versioned helper integration. `witnesses.json` hashes before/script/diff, the original failed log and original Luna report. No old receipts/logs overwritten.
- `regression.py` prepared for Luna: busy-listener negative with both listener reuse settings, clean-handoff positive, old-guard TIME_WAIT RED control and corrected TIME_WAIT positive. Uses only owned ephemeral endpoints and imports actual `port_guard.py`.

Actual executor verification: controlled diagnostic exit0, including Node same-endpoint proof; four Python AST parses PASS. **Targeted regression not executed by Sol**; no full Presentation/root unit/build duplication.

## Exact Luna command — only targeted mechanics and one port check

Docker-observed path, not owner's host mapping. Use a fresh evidence filename; do not overwrite an existing execution. No whole source guard.

```bash
cd /workspace
set -e
D=docs/qa/quality/sanity-home-online-001/guard-correction
(set -o noclobber; python3 "$D/regression.py" > "$D/luna-regression.log" 2>&1)
(set -o noclobber; python3 "$D/port_guard.py" --ports 42241 42242 42244 3333 > "$D/luna-exact-ports.log" 2>&1)
```

Require actual regression negatives to reject errno98 and positives to pass, and a successful single exact-port bind+listen result. Any actual unknown occupant/denial stops affected work; preserve the error, no retry/kill/port/cache/permission changes. A later exact-port PASS means availability **at that later check only**, not proof of the historical socket state. Supervisor inspects `guard.diff`, implementation, both causal diagnostic records and eventual Luna logs before acceptance. No claim of corrected production integration or release acceptance.

## Frozen-run distinction / own accounting

Read existing Luna results: synthetic Next BUILD_ID `Ttje3vjrDZBdrR_qghiex`, local Next/Studio builds PASS,29 checks,21 section-save-refresh entries,190 field-click records,11 served assets and browser owned cleanup/rebind PASS. Those remain historical evidence for that frozen input; no current-source identity is inferred after Terra's authorized package/config edits. Source verification passed before the original failing port stage; this correction does not redo it or certify later root inputs.

Global suite remains473 passed /228 failed /1 skipped; no failures dismissed or changed. Owner personally controls Git push; no deployment performed. Real editor/cloud/Viewer/Studio-hosting gates remain separate.

Own bounded outcome: **awaiting targeted Luna execution and required independent review**. Correction cause is executor-owned harness implementation defect, not product cleanup defect or Luna fault; historical original port-state attribution is unknown. No parent implementation takeover. Parent supplied Luna completion `gpt-6-luna`,12 API calls,572.97s child/573.16s batch; these are reported metadata, not independently measured here. This correction's actual cost/duration/per-call route/fallback remain unknown pending completion. Shared ledger and historical verdicts unchanged. Workflow lesson: a Node listener handoff guard must test the same exact bind+listen/reuse contract, and preserve simultaneous TCP-state evidence when diagnosing residual occupancy.
