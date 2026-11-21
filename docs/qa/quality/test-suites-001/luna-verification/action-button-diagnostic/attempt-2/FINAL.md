# Action-button server diagnostic — attempt 2

Prior attempt-1 logs and report are preserved. That attempt sent HTTP before observing `Ready`; its immediate connection-refused result is not evidence of persistent unavailability. This attempt waited on the owned child’s complete stdout Ready line (or exit / 30s deadline) before one HTTP request.

## Identity and command

- Existing diagnostic-only private fixture/build retained: `/workspace/.local-tools/ola-qa/test-suite-runs/run-6kkimo/source/tests/fixtures/action-button`, BUILD_ID `i7WAUMf_giUqKVKRUcvbQ`.
- Before startup, five relevant fixture/test/config files were checked against that run’s immutable `inputs.json`; all hashes matched (see `diagnostic.json`). This is old build evidence for diagnosis, not a fresh current-source suite result.
- Own command: `/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node /workspace/.local-tools/ola-qa/test-suite-runs/run-6kkimo/source/node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 45190`, cwd the private action-button app. Minimal approved private environment; no secrets.
- Port 45190 was free at the guard check. Server emitted `✓ Ready in 490ms`; process had not exited.

## One post-ready request and cleanup

One GET to `/en` (same route used by fixture test and Playwright readiness) was issued **after** Ready; received **HTTP 404 Not Found**, no redirect, `text/html`. Up to 4096 bytes were read for markers only: title `ActionButton fixture`, Next HTML marker present, not-found marker present, expected button marker absent. No body content was persisted. Dynamic route manifest contains `/[locale]`; fixture source generates `en`, `ru`, `sr` and validates those locales. Thus readiness URL is syntactically consistent with the fixture, but the served response is not the expected fixture page.

Server stderr records the standalone `next start` warning; stdout contains Ready and config-load completion, no further error. The 404 is now observed, unlike attempt 1. The warning is a plausible server/setup mismatch, but this diagnostic does not prove it caused the 404; no retry with another server command was authorized or performed. The actual Playwright test still did not execute.

Stopped only owned PID 3432 with SIGTERM (exit 143); confirmed port 45190 released. Complete logs: `server.stdout.log`, `server.stderr.log`; command/response/source identities: `diagnostic.json`. No rebuild, source edits, retries, or unrelated process actions.
