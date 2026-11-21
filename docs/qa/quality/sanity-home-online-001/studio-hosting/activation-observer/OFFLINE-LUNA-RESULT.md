# Offline Luna result — activation observer

Executed the exact prepared command under isolated Node24/private HOME and XDG settings, with output protected by `noclobber`. Exit **0**: **31 passed, 0 failed, 0 skipped**, runner duration **487.6 ms**. Actual output: `luna-offline.log`.

The tests used synthetic token/data and an in-memory fetch. The SDK client was constructed with the injected fetch; no real request was made. Controls passed for exact one-request target, finite timeout/zero retry, no redirects, wrong method/host/path/version/query/cookie/body rejected before wire use, one-shot budget, HTTP 302/401/403/404/429/500 and transport/JSON failures without followup, identity mismatch, missing activation fields, output field allowlist, parsed redaction of quote/backslash/control values, and static proof that entry requires approval before credential load and does not import deployment runtime.

No `entry.mjs` execution, real credential metadata/load, actual SDK/network, approval receipt, or cloud action occurred. This is offline synthetic evidence only; it does not authorize the future GET or establish live service behavior. Candidate code and binding `2f7a31bd7e063d1d78a5d788acc83d079fe2678dac31abc525b5166d0d772f6f` were not changed. A dedicated actual Supervisor PASS binding that exact observer remains required before real execution.
