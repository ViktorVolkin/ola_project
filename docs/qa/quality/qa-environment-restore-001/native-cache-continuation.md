# Native cache continuation — BLOCKED before creation

This is a bounded continuation of OLA-AUTONOMOUS-QA-RESTORE-001, not a new delivery unit. It supplements REPORT.md and preserves every earlier failure and successful partial gate.

Owner authorised one new private cache on an existing executable, user-writable, sticky-safe filesystem, preferably /var/tmp, and explicitly required stopping if /var/tmp is inappropriate rather than probing other locations or changing security settings.

## Actual necessary discovery

Existing executor again reports cwd `/workspace`, UID/GID 1001, architecture `aarch64`. Read installed `@swc/core-linux-arm64-gnu/README.md`; it explicitly documents `SWC_NATIVE_BINDING_CACHE` as an absolute custom root with unchanged payload verification.

Exact terminal command (cwd `/workspace`):

```sh
pwd; id; uname -m; findmnt --target /var/tmp --output TARGET,FSTYPE,OPTIONS; namei -l /var/tmp; command -v npm; readlink -f /usr/bin/npm; readlink -f /usr/local/bin/npm
```

Actual output:

```text
/workspace
uid=1001 gid=1001 groups=1001
aarch64
TARGET   FSTYPE OPTIONS
/var/tmp tmpfs  rw,nosuid,nodev,noexec,relatime,size=262144k,inode64
f: /var/tmp
drwxr-xr-x root root /
drwxr-xr-x root root var
drwxrwxrwt root root tmp
/usr/local/bin/npm
/usr/bin/npm
/usr/local/lib/node_modules/npm/bin/npm-cli.js
```

The /var/tmp ancestor chain is root-owned, not group/world writable until its sticky-protected 1777 terminal directory, but the **filesystem is mounted noexec**. Thus it lacks the explicitly required executable property. No cache directory was created, no code executed from it, and no alternative location was probed. No remount, chmod/chown, identity switch, carrier/binding modification, loader bypass or security flag was attempted. This is an actual discovered mount-property blocker, **not a tool-approval denial**.

The system npm CLI resolves to `/usr/local/lib/node_modules/npm/bin/npm-cli.js`; current continuation did not invoke it under Node24 and does not yet claim reconciled npm 11.20.0. Earlier recorded successful isolated runtime remains Node24.22.3/npm11.19.1. No install was needed or attempted for this discovery.

## Outcome

Stopped as explicitly required when /var/tmp was found inappropriate. No bootstrap, native test, build, verify, lint/unit rerun or browser was launched in this continuation. In particular, no @swc/core transform success or new production BUILD_ID is claimed. Existing successful Next SWC/watcher/sharp, Chromium156.0.8078.4 DOM/JS, lint and 52-unit evidence remains prior partial success, not new evidence of completed gates.

Needed prerequisite: an explicitly authorised existing executable filesystem/path with the trusted ancestor and private-current-UID cache properties required by the unchanged SWC carrier. Current approved /var/tmp does not meet that condition; this continuation does not ask to change its mount flags or presume authority to search/select another path.

Writes in this continuation are limited to this evidence note, REPORT.md precedence link and own ledger record. No application, tooling script, dependency, cache or environment configuration was changed. No owned process or new cleanup target was created; existing retained resources and old cleanup denials remain unchanged. Risk medium; actual Supervisor review still required after technical gates pass.

Runtime model/provider exposed in injected context: gpt-6.1-sol/openai-codex. User supplied prior attempt `deleg_e8ec4752`, gpt-6.1-sol42, route openai-codex, API692.94s; retained as supplied history, not proof of a current model alias or current counter. Current delegation ID, token/cost/API duration and total wall counters unknown; no free/zero-cost claim.
