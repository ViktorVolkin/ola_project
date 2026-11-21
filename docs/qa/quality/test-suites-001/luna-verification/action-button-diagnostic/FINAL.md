# Action-button owned-server diagnostic — incomplete / no case execution

Prior runner failure: task-owned old private build `/workspace/.local-tools/ola-qa/test-suite-runs/run-6kkimo/source/tests/fixtures/action-button/.next`, BUILD_ID `i7WAUMf_giUqKVKRUcvbQ`; runner timed out waiting 120s. The private app `inputs.json` source-binding receipt is preserved in that run. Action-button config uses readiness URL `/en`, `reuseExistingServer:false`, 120s timeout and starts Node24 `next start --hostname 127.0.0.1 --port 45190` in that fixture app cwd.

Read-only route manifests confirmed `/[locale]` is present, so `/en` matches the built route: `app-path-routes-manifest.json` maps `/[locale]/page` to `/[locale]`; `routes-manifest.json` has a locale dynamic route. This did not prove readiness.

One bounded own-child start was made with the same Node24 executable, built app cwd, command, port and minimal private environment. It logged `Next.js 16.4.5`, `✓ Ready in 194ms`, then the standalone warning. One `/en` request immediately after spawn returned `URLError: [Errno 111] Connection refused`; **no HTTP status, redirect, body, or title was obtained**. The probe implementation stopped after that first error rather than waiting through the planned deadline; consequently this run does **not** distinguish a startup race from a persistent listener failure, and does not establish that the standalone warning caused the earlier timeout. No claim of root cause.

The owned child (PID 2612) was stopped with SIGTERM; exit 143. Rebind check confirmed port 45190 free. No foreign processes signaled, no alternate port/retry, no test executed, no build or source modification. Diagnostic files: `diagnostic.json` and complete captured owned server output `server.log`.

Next safe step requires a corrected finite-wait diagnostic in a separately authorized run if still requested; do not classify this as action-button test PASS or as proven Next standalone defect. Previous run and artifacts remain unchanged.
