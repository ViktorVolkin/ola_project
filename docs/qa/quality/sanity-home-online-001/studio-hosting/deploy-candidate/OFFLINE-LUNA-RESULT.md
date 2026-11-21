# Offline Luna result — Studio hosting candidate

Command executed exactly as prepared under isolated Node24/private HOME/XDG environment with `env -i`; output was protected by shell `noclobber` and saved to `luna-offline.log`. Exit **0**.

- **16 passed, 0 failed, 0 skipped**, duration **122.8 ms** (Node test runner).
- Synthetic controls passed for existing-app single write; missing/multiple/wrong app ID/project/host/type/url-type rejected before write; 401 and network ambiguity fail closed; validation rejection yields zero writes; disappearance during write causes one failed attempt without retry/create; raw/URI/base64 synthetic-token redaction before persistence; exact artifact set/bytes including stale/tampered/extra/forbidden paths.
- Installed Studio resolver seam test passed: pinned absent app returns `invalid` / `app-not-found`, not `would-create`.

This was offline synthetic orchestration/resolver evidence only. It did not run `runtime.mjs`, inspect/load credentials, make real SDK/network requests, create approval receipt, or perform deployment/cloud writes. It does not establish live Sanity write semantics or credential/deployment readiness. Candidate bindings/helpers/tests were not modified. Syntax-only predecessor evidence and pending actual Supervisor review remain as previously recorded.

Artifacts: `luna-offline.log` (actual test output); candidate `offline.test.mjs` and `FINAL.md` were read-only.
