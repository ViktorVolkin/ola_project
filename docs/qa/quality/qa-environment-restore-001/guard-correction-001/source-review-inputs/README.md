# Review2 source inputs — evidence-only supplement

No implementation, test, native/browser/build, or saved-artifact operation was run in this follow-up. The Python file in this directory only assembles inert source snapshots, provenance metadata and a standalone unified diff; it does not import or execute project code.

## Entry points

- `source-changes.diff`: meaningful unified before/after diff for six source paths, independent of Git tracking.
- `manifest.json`: original paths, modified/added status, inert snapshot handles, recovered/current byte sizes and SHA-256, method and limitations.
- `before/{local.mjs,verify.mjs,local-qa.md}.txt`: recovered pre-correction content.
- `after/{local.mjs,verify.mjs,reuse-guards.mjs,guard-regression.test.mjs,guard-evidence.mjs,local-qa.md}.txt`: actual current bytes copied without executing them. All five QA-source hashes match the already recorded final `preservation-summary.json` hashes; guide hash is newly recorded here.
- `local-inverse-patches.json`: all five exact local.mjs before/after replacement literals retained from the actual accepted correction tool calls.

## What existed before, and what was recovered

`verify.mjs` was fully read before correction: 111 lines, 9,456 bytes. The guide was fully read: 59 lines, 6,028 bytes. Their source bodies are recovered from that retained tool-read text and original author-owned UTF-8/LF write/patch context, not invented from the finding descriptions. A transcription initially included the later-added startTicks metadata field in the verify snapshot; the actual recorded patch proves that field was absent before correction, and the inert snapshot was corrected accordingly before assembling the diff. Its final byte size matches the actual original tool read.

For `local.mjs`, the immediate pre-correction read retained pages1–65 and134–156 and the original total15,427-byte size, not a separate complete raw file. All five actual correction edits are retained in the tool-call context. Reversing those exact edits against SHA-bound unchanged current source gives the complete15,427-byte pre-correction content. Unedited ranges are taken from current bytes under the recorded complete edit history/exclusive executor ownership, not guessed. This is deterministic source recovery, **not an independently captured full historical file**. The method/literals are preserved for review; no stronger independent-before attestation is claimed.

The guard module, regression tests and guard-evidence helper were new files authored during this correction. They have **no pre-correction file**, not a fabricated empty source. Their diff headers correctly use `/dev/null`.

No independently measured pre-correction SHA-256 was retained for these untracked sources. Before hashes in this supplement are computed **at recovery**, not falsely dated historical observations. If review requires an independently captured complete pre-correction local.mjs snapshot/hash, that stronger evidence is unavailable; the existing full review1 receipt, retained read fragments, complete actual patch literals, current sources and real RED controls are the available corroboration. No recreated approximation is labeled an independently observed original.

## Why before.json.gz was insufficient

The original guard-correction `before.json.gz` contains source/protected-file identity hashes and sizes, dependency metadata, and a SHA-bound full-baseline/raw-delta reference. It does **not** store source bodies, and none of these six requested QA/guide paths appears in its source map. `manifest.json` records the inspected schema and empty requested-path intersection. The original snapshot and preservation-summary were not rewritten to pretend otherwise.

## Exposed completion metrics

`completion-metrics.json` records the subsequently exposed correction delegation `deleg_6626e522`, banner model `gpt-6.1-sol`, API call count73, child duration2300.17s and batch duration2300.6s separately. Provider is supported only by the injected runtime (`openai-codex`), not independently by this banner. Tokens/prices/total monetary cost remain unknown. Child and batch durations overlap and are not summed. The counters describe the ended correction child; this evidence-only follow-up's calls/time are not silently included in73 and remain unknown.

Supervisor review1 remains FAIL. This supplement supplies review inputs only; it neither re-runs nor re-approves the correction and does not call a reviewer.
