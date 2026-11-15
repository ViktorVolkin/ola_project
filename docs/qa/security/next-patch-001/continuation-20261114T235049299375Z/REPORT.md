# OLA-SEC-NEXT-PATCH-001 — isolated candidate completed, release BLOCKED

Continuation from the preserved failed attempt, observed 2026-11-14 23:50 UTC through 2026-11-15 00:05 UTC. This is real progress: usable 16.4.3 baseline and 16.4.5 candidate, not a production PASS. Scope was explicitly expanded to one owned container cache directory; no infrastructure repair or global environment change.

## Resource correction and cleanup

Only `/tmp/ola-next-patch-001-20261114T234548627385Z/node_modules` was removed. Before removal: exact real parent and target matched literal paths, both owned by UID1000; target was not a symlink; all 25,243 entries owned by UID1000; 29 symlinks resolved within target; Python symlink-safe rmtree was available. After removal the target was absent. Original 286-file export/configs and frozen source/input manifest remain. No other /tmp entries, cache or browser profiles were deleted.

At cleanup boundary `/tmp` available bytes **0 → 478,298,112**; available inodes **1,930,200 → 1,955,444**. Its mount independently has `noexec`, in addition to the proven 512MiB ENOSPC condition. Historical npm ci exit0 plus 4,690 ENOSPC warnings and lint exit126 remain preserved; permission denial is not classified as a code defect or proven file-mode defect.

Permitted `/home/pn/.cache` initially had **6,397,112,320 available bytes / 2,442,459 free inodes**; ordinary UID1000 write/execute access and executable rw overlay were checked. Existing Node24 binary executed without changing mode/ownership/config. Source was copied ONLY from the frozen old export to:

`/home/pn/.cache/ola-next-patch-001-20261114T235049299375Z`

All **286** hashes matched the saved exported manifest before baseline. No active workspace recopy. Final observations: cache filesystem available **5,374,488,576 bytes / 2,416,392 inodes**; /tmp **459,100,160 bytes / 1,953,183 inodes** (later shared-browser/task activity means these are separate observations, not cleanup attribution).

## Dependency result

Command-local existing Node **24.22.2**, npm **11.20.0**. Both clean npm ci runs exited0 with **425 installed package-version checks, zero mismatches/missing required modules**, no ENOSPC/EACCES/EROFS log markers, working executable Next/ESLint, and successful native production builds. Candidate `npm ls --depth=0` exit0. Both installs warned of deprecated ESLint9 and three unapproved install scripts (@parcel/watcher, @swc/core, unrs-resolver); these warnings were not hidden or fixed by policy changes. Real gates worked without changing approvals.

Only next and eslint-config-next manifest pins changed **16.4.3 → 16.4.5**. Lock diff: root declaration plus 12 Next-owned package entries (Next, env, ESLint config/plugin, eight platform SWCs); no unrelated resolution churn, no React/next-intl/audit-fix changes. Exact preimages, candidate snapshots and unified diffs are in this directory.

SHA256 package.json / package-lock.json:
- Baseline: `146dd389029525ea0e2334d2785f9edf22fc2e351dfdef1b245667e1c5f4e902` / `5d3ac6e46fbc15df5e2b948be3cf2b73bb7a44ba6b979c5e3af20aea797b3dac`.
- Candidate: `9adc94f36d69c71a7f7dd7c0d0b5f6cc059948ee24accf71d53d4745d446902f` / `608c9fa64349432249f87afba9059ca7b7b2e92ab56f52dea156da7efb1d1f04`.

Existing official vendor evidence (`../../next-001/evidence.json`, actual path recorded in evidence.json) was reused, not refetched: seven advisory 16.x ranges end16.4.4, each has exact fixed16.4.5. This does NOT resolve older literal `16.3.?` or certify every vulnerability fixed.

## Same-source comparison

| Gate | Baseline16.4.3 | Candidate16.4.5 |
|---|---|---|
| Configured lint | FAIL: 0 errors, 4 warnings, max0 | Same |
| Configured next typegen + tsc | PASS exit0 | PASS exit0 |
| Configured unit | 32 PASS / 1 FAIL, 7 files | Same |
| Production build | PASS exit0 | PASS exit0 |
| Bounded desktop Playwright | 98 PASS / 18 FAIL / 0 skipped | Same |
| Raw normal EN/RU/SR | 3×HTTP200 with h1 | Same |
| Normal page no-JS | HTTP200, h1, 11 main links | Same |
| Trusted local JPEG optimizer | HTTP200 image/jpeg, 34,145 bytes | Same |
| Raw/no-JS missing page | HTTP404 but absent h1/recovery DOM: FAIL | Same FAIL |

Playwright ran unchanged assertions from home, locales, navigation/modal, routing, not-found, preferences, supporting and gallery specs, desktop project only, two workers, no retries. Responsive component specs contain their own viewport sweeps. **116 same case IDs compared; 0 newly failing or newly passing IDs.** 17 failed-case error messages identical; Russian raw404 message differs in generated chunk filenames but same expected text/failed assertion/location. `e2e-comparison.json` retains literal comparison, not a fabricated identical-output claim. Component fixture checks are not full current-site integration acceptance.

Retained defects: four no-img-element lint warnings (preferences/supporting); unit architecture missing styles.radioImage; 14 RU/SR preference cases expect English date placeholder, one preference continuity geometry failure; three 404-related cases (motion, no-JS, Russian raw HTML). No test weakened or production source repaired. Full e2e suite/mobile project/host deployment/browser matrix not run. No hostile SVG/exploit/private upload.

Candidate BuildID `7_Zu8oSzn7TggHBe9Fjsh`. Baseline BuildID was not saved before candidate replaced isolated .next; unknown, not reconstructed. Raw probe's `notFoundMarkup` is substring presence in the whole response including Flight, NOT evidence of rendered DOM; the no-JS DOM result is authoritative for the retained failure.

## Preservation, scope and release gate

After all checks only **package.json and package-lock.json** differ among the 286 frozen input files; all other 284 source/test/config/fixture hashes still match. Isolated harness changes only port/output location, not product assertions. Fixed test output paths were inspected before launch; relative screenshots/fixtures/results resolve under owned export, never old workspace QA targets. Helper files are retained in export and were outside configured gates when run. A write-tool standalone TS check emitted interop errors on the harness using its own invocation; configured project typecheck passed and real Playwright consumed the config successfully. This distinction is preserved, not treated as product failure.

Root package+lock before/after equal the baseline hashes above. No root install/lint/types/unit/build/dev/typegen, no root source/test/config/node_modules/.next writes, Git mutation, process kills, permission/mount/security changes or global PATH/HOME/default Node/cache-config changes. npm cache override was command-local inside owned prefix. Other workers' root changes were not inspected as this task's integration baseline.

The frozen working-tree snapshot is not a Git release or latest root/UI integration. **Release BLOCKED** by retained failures, unresolved vendor literal `16.3.?`, deployment applicability uncertainty and pending actual independent Supervisor Sol. Future apply requires explicit exclusive Lead slot after writers finish, fresh current-root gates and actual runtime-confirmed @supervisor gpt-6.1-sol; no self-review PASS. Cost/tokens/API latency/overall child duration unknown; individual gate timestamps/durations and browser run stats are actual saved metadata. No central ledger changes.
