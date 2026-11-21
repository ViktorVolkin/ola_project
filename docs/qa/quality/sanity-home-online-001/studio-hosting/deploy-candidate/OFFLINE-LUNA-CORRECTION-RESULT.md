# HOST-R1 offline correction — Luna mechanical result

Executed under isolated Node24 (`env -i`, private HOME/XDG/npm cache, `/bin/bash`, compile cache disabled), with independent command exits recorded. **Both commands exit 0.**

- `node --test docs/qa/quality/sanity-home-online-001/studio-hosting/deploy-candidate/offline.test.mjs`: **28 passed, 0 failed, 0 skipped**, Node duration **151.4 ms**. Includes existing-app and no-write controls; HOST-R1 synthetic opaque quote/backslash/newline/control/mixed values on the actual core error-persistence path (0 writes), result/readback/final-error JSON roundtrips, raw/URI/base64/JSON-escaped value checks, and cycle/getter/toJSON serialization-failure handling. No assertion or individual case failed.
- Pinned Node24 npm CLI `run lint`: **exit 0**, ESLint `--max-warnings=0`, no diagnostics.

Logs and exact exit statuses: `luna-host-r1-offline.log`, `luna-host-r1-root-lint.log`, `luna-host-r1-exits.txt`. The current candidate binding is the correction binding `7c0221e474853996f8cb10e14b4e38d8e87019641fc29848afbc244d177dc856`; old binding’s FAIL receipt and old offline log remain preserved. This was offline synthetic verification only: no runtime import/execution, credentials, real SDK/network, approval receipt, deployment or cloud write. It does not constitute Supervisor review or deployment approval. A genuine new Supervisor PASS must bind the current candidate hash before any runtime use.
