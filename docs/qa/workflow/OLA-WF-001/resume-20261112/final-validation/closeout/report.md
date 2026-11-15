# OLA-WF-001 closeout revision — ready_for_actual_supervisor

Executor result, not acceptance. Medium risk: shared keyboard component and explicit independent gate. Fresh review by actual `@supervisor` running runtime-confirmed `gpt-6.1-sol` with repository/evidence access remains required; previous [Supervisor BLOCKED receipt](../../../../../model-quality/OLA-WF-001-supervisor-review.json) remains unchanged. No reviewer was invoked in this revision.

## Cleanup and historical context

The earlier [lint failure](../lint.log) was caused by this workflow's own obsolete, unexecuted QA script, not a frontend defect or external environment failure. Expanded authorization permitted archiving its exact bytes as [boundary-check.cjs.txt](../../boundary-check.cjs.txt), removing the executable `.cjs`, and updating the [historical report link](../../report.md). Before deletion `cmp` succeeded and both files had SHA-256 `4273a7b246aca9a3ecefe34f5f168f2d73e7b2509c1d3f335ee6f6198aea5061`. The archive was never executed; the earlier denied Python subprocess command, no server launch, BLOCKED statements and prior lint failure remain recorded. No lint configuration, suppression, approval, dependencies or product files were changed.

Historical real RED: [desktop baseline](../../../baseline-e2e.log) 6 enquiry-name passes and 2 focus-exit failures; [mobile baseline](../../../mobile-baseline-e2e.log) 2 focus-exit failures. Initial Luna enquiry accessible-name diagnosis was a false positive; baseline passed those names and Enquiry source was unchanged. [Original implementation packet](../../../implementation-continuation-report.md) contains original source snapshots/manifests and four screenshots. No matched-baseline visual parity is established.

## Fresh checks, same scoped inputs

All commands ran from `/workspace`; exits recorded in [exits.log](exits.log):

- `npm run lint`: exit 0, [log](lint.log).
- `npm run typecheck`: exit 0, [log](typecheck.log).
- `npm run test`: exit 0, 6 files / 24 tests passed, [log](test.log).
- `npm run build`: exit 0, [log](build.log). Fresh BUILD_ID `c1TKbif0rIC6wkFwVQTDc`; BUILD_ID file SHA-256 `bd88782628dabd7224536e1d53e5d1a820dff9426803c47ada3c38357d59a905`, [capture](build-id.log). This is a fresh build, not the prior ID.
- `npm run test:e2e -- tests/e2e/workflow-disclosure.spec.ts tests/e2e/navigation.spec.ts tests/e2e/locales.spec.ts`: exit 0, 64 executions passed, [log](e2e.log), against that build using the configured Playwright webServer with `reuseExistingServer: false`. Test cases cover forward/reverse keyboard boundaries, internal focus/no theft, Escape restoration, nested modal behavior, and actual RU→EN / SR→RU nested route/query/hash. The two Playwright projects repeat the explicitly overridden desktop 1440×900 and mobile 375×812 cases; 64 are executions, not 64 distinct viewport configurations. Do not add earlier overlapping runs.

[Before](inputs-before.log) and [after](inputs-after.log) hashes match for every `src` and `tests` file and the named package/lock/config files and archive ([comparison](verification.log)); no source/test changes in this attempt. This is a scoped input tie, not a claim of a complete reproducible build or hash coverage of all public/dependency/environment inputs. Source SHA-256 `af673610e4be7348b52f9a135ea360671764d0586873230aee54c0b323aae2da`; focused test SHA-256 `617d0a1e6f8b752bfd5578fd0f3ae6f6a53ad47ff1e7d44f4ed0763ee426e7e4`. Whole original-to-current [source diff](../LanguageSwitcher.diff) and [test diff](../workflow-disclosure.diff). After the test, port 3100 refused connections (curl exit 7); [process check](process-check.log) found no node/next-server/chromium/chrome process. The broad process output in verification.log includes its own checking shell, not a leftover server.

## Scope, attempts and limits

Current attempt changed/created only: deleted `resume-20261112/boundary-check.cjs`; added its `.cjs.txt` data archive; edited `resume-20261112/report.md` link/provenance; added `final-validation/closeout/{report.md,lint.log,typecheck.log,test.log,build.log,build-id.log,e2e.log,exits.log,inputs-before.log,inputs-after.log,verification.log,process-check.log}`; appended executor accounting to `docs/qa/model-quality/OLA-WF-001.md`. Standard build/test generated transient ignored outputs. No Git stage/commit.

Previous continuation `deleg_693adbe8` gateway: actual `gpt-6.1-terra`, 14 calls, 421.8s child / 422.78s batch; 64 E2E and typecheck passed but lint failed. Previous `deleg_c6c5c8c0`: 13 calls, 253.88s child / 254.21s batch; earlier [report](../report.md) preserves other usage and failure details. This bounded continuation runtime identifies `gpt-6.1-terra` / `openai-codex`; delegation ID, exact invocation duration, calls, tokens and cost are not exposed, hence unknown. Observed timestamps in evidence are not invocation timing. No savings claim.

Known 404 SSR/no-JS issue is held out of scope; passing locale tests do not resolve it. No full unrelated site audit, new screenshots, visual parity, universal accessibility, deployment, release or acceptance claim. Technical gates are ready for independent review, not a Supervisor PASS.
