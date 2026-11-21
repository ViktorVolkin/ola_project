# OLA-SEC-NEXT-PATCH-001 — current-root integration

**Installed minimal patch; awaiting_review, NOT accepted. Release BLOCKED.** Current attempt observed 2026-11-16 11:29–11:42 UTC; exact final observations in verification.json. Executor: delegated original security specialist, injected gpt-6.1-sol / openai-codex. High risk; actual independent Supervisor Sol still required. No Supervisor invoked by executor, no prior receipt changed. Deterministic integrated evidence is not all green; do not launch expensive final acceptance review while that remains unresolved.

## Outcome and scope

- Current Docker root `/workspace`, development c718221. Requested host path is not mounted in this backend; explicit delegated Docker root used, not a guessed repository.
- Ordinary command-scoped Node24.22.2/npm workflow: `npm install --save-exact next@16.4.5`, then `npm install --save-dev --save-exact eslint-config-next@16.4.5`; both exit0. No global config/runtime/cache override or script-approval change. Existing unapproved @parcel/watcher, @swc/core and unrs-resolver script warnings retained.
- Manifest, lock and installed **next16.4.5 / eslint-config-next16.4.5** agree. Only two manifest pins changed. Lock contains exactly root declaration plus12 Next-owned entries: Next, @next/env, ESLint config/plugin and eight SWC platform entries. No unrelated lock entry changed; no new major.
- Framer Motion **14.14.0**, Lenis **1.3.27** retain original caret manifest entries; React/React DOM19.3.0 and next-intl4.14.9 unchanged. Current preimages, afterimages and exact unified diffs saved here; no old candidate lock copied.
- `npm ls --depth=0` and `npm ls --all` exit0.429 installed lock-version checks pass;105 absent entries are optional platform packages. Registry SHA512 integrity equals lock integrity for both direct upgraded packages; ordinary npm verified fetched artifacts. This is not an independent provenance/signature audit. Declared Node, React, next-intl, ESLint and TypeScript compatibility checks all true.
- No app/config/framework/routing repair. Only existing input changes are package.json and package-lock.json. Added `tests/e2e/security-next-patch.spec.ts` plus this evidence folder and own accounting append. All previous deletions, debug archives, Motion code, NotFoundArtwork and unrelated dirty files preserved. No Git mutations or isolated app/node_modules copy.

## Fresh official security evidence

Full read-only primary responses and retrieval timestamps saved as GHSA-*.json, release.json, next.json and eslint-config-next.json. Official v16.4.5 published2026-11-03T18:38:39Z, stable/non-draft; release explicitly names the seven fixes. Current official repository list:79 entries, newest publication2026-11-03T18:39:54Z; this is a bounded later-advisory sanity check, not a full historical audit.

All seven remain unwithdrawn **medium/Moderate**, with exact patched16.x version **16.4.5**. Installed preimage16.4.3 was in every listed range; candidate16.4.5 is outside those precise affected ranges. No new RCE/exploitation claim.

| GHSA | Current exact16.x affected range | Current app prerequisite disposition |
|---|---|---|
| mfr8-8qww-v76h | `>= 16.3.0, <= 16.4.4` | No use-cache/unstable_cache path; prerequisite absent |
| vc7v-qv4w-wrv8 | `>= 16.2.0, <= 16.4.4` | Cache Components false; nested-use-cache absent |
| vvgp-ww4w-46vf | `>= 16.4.0, <= 16.4.4` | Cache Components false; specified deeper topology absent; NOT the existing SSR404 defect |
| rhh4-g77r-r9qj | `>= 16.0.0, <= 16.4.4` | Binary use-cache argument path absent |
| pc58-hwjq-p385 | `>= 16.0.0, <= 16.4.4` | No route handlers/upstream fetch forwarding; deployed proxy unverified |
| 7qx7-33qx-rqx2 | `>= 16.0.0, <= 16.4.4` | Optimizer enabled/default; self-hosting and attacker-controlled input exposure UNKNOWN; precise package fix applied preventively |
| f3mh-rxg3-f5g2 | `>= 16.0.0, <= 16.4.4` | No Edge route/NextResponse sensitive-cookie setter |

Current app inventory/search/defaults in applicability-current.json and compatibility-defaults.json: nine route/layout/not-found files; no Pages Router, handler, proxy, remote allow-list or cache API pattern;27 next/image imports. No deployed environment/adapter inspected. Default SVG rejection is NOT asserted to mitigate the prior bypass. No hostile SVG, exploit, third-party probe or source upload.

**GHSA-mcj8-r9mp-w47p / CVE-2026-94484 still literally reports patched `16.3.?`, affected `>= 16.0.0`.** Preserved exactly, not normalized or inferred fixed. Vendor says root-level catch-all + SSG/ISR; current locale-nested catch-all equivalence UNKNOWN. Production security clearance remains open; historical dev-MCP placeholder and other historical limitations are not closed by this maintenance.

## Seven npm warnings: separate bounded triage

`audit.before.json` and `audit.after.json` vulnerability maps exactly equal. Seven Moderate package-node findings are **pre-existing, all indirect dev tooling**, not seven new Motion issues and not the seven vendor Next advisories. Nodes: typescript-eslint; @typescript-eslint/eslint-plugin, parser, type-utils, typescript-estree, utils; nested minimatch. Path is eslint-config-next/typescript-eslint to minimatch. Direct dependencies are not newly implicated. Lock metadata preserves these packages unchanged.

Underlying GHSA-g3hv-75wg-m249 describes globparts amplification, affected `>=7.0.0 <11.0.1`, first patched11.0.1, requires attacker-controlled patterns with optimizationLevel>=2. Current eslint config consumes local checked-in files; observed typescript-estree call supplies `{dot:true}`, not optimizationLevel2. No public application request-to-glob path observed. Bounded current app production exploitability not established; malicious-repository/other tooling paths are not globally ruled out. No audit fix or unrelated major upgrade authorized/applied.

`npm audit --omit=dev` exit0 with zero production findings is feed-limited, **NOT security-clear**: even preimage audit did not enumerate the seven official Next issues. Primary vendor evidence takes precedence over absence in npm audit.

## Current verification (real configured runners)

Build **`_FZae9gZg5s1S4mBVp5yA`**, Next16.4.5,20 generated static pages. Configured lint/typecheck/unit/build all exit0;33 unit cases/7 files. Final lint/typecheck after added404 diagnostics also exit0. Tool single-file implicit TypeScript check emitted dependency interop errors; configured project typecheck and actual Playwright import pass; no production interop workaround.

| Gate | Actual result |
|---|---|
| Combined three Motion + navigation/locales/workflow specs, default desktop+mobile,2 workers | **127 PASS /1 FAIL /0 skipped**,128 project-qualified IDs,64 unique without project; case set exactly matches accepted Motion128, no omissions/extras |
| Focused unchanged failed keyboard case, same candidate build/mobile | **1 PASS** on one rerun; original failure retained, NOT a rewritten128-PASS combined run |
| Normal maintenance + existing font specs excluding missing-page font case, default projects,2 workers | **38 PASS**,19 unique:30 font cases +8 maintenance cases |
| Existing no-JS404 baseline16.4.3, desktop | **1 FAIL**: status404 but artwork/recovery DOM absent |
| Existing no-JS404 + stronger raw/no-JS diagnostics, candidate16.4.5, both projects | **4 FAIL**: same existing case2 + diagnostic2; intentionally not xfailed/skipped/weakened |

Normal probes cover all18 locale/page routes (home/about/bouquets/weddings-events/balloons/contact), duplicated per configured project: raw parsed DOM with scripts/templates/styles removed, no-JS real main/h1/links and meaningful text, HTTP200, en/ru/sr-Latn html lang; hydrated image decoding, trusted image responses, no console/page hydration errors. Existing font tests verify real glyph family/custom self-hosted font for five normal routes ×3 locales ×2 projects. Separate trusted local JPEG and normal optimizer return200 image/jpeg; self-hosted woff2 asset200; root308→/en and slash308 normalization preserved. No general visual/physical-device/cross-browser certification.

### Failure disposition; do not hide current reds

- Relative to the prior accepted128-pass run, **one current run-level nonpassing ID**: mobile `reduced motion from first load and native keyboard/hash navigation`, original motion-scroll.spec.ts130. After End, Home stayed4497 rather than<10. Test starts with reduced motion and explicitly verifies no Lenis class. Unchanged test passed focused rerun on same build. Prior Motion receipt independently preserves an earlier similar native reduced-motion Home/PageDown failure with Lenis absent and unknown cause. This establishes an intermittent symptom/history, **not proof that this exact current failure is unchanged or unrelated to Next**. No confirmed dependency root cause; no product/test fix or blanket zero-new-regression claim. Remaining accepted inertia interruption/Tab/modal/touch/history/lifecycle cases passed in current combined run. No repeated full combined run used to manufacture green.
- SSR404 blocker reproduced before and after update. Strong candidate diagnostics on EN/RU/SR missing paths plus /xx and /xx/missing: real404 but empty lang, no raw main/header/h1/links and no no-JS recovery heading/links in both projects. Framework error-shell delivery defect remains. Version upgrade does not fix it; no return200, proxy/internal patch or relaxed assertion. Full-site release remains BLOCKED.

## Input and resource identities

Fresh enumerated inventory297 inputs before,298 after: all src/tests/public/.github regular input files plus root JSON/TS/JS configs/manifests; excludes generated caches, node_modules, .next, secrets and next-env generated declarations. All297 preimage hashes equal corresponding entries in accepted Motion299 inventory. Its additional `.nvmrc` and generated next-env.d.ts hashes match current supplemental reads, not retroactively labeled fresh preimage reads. Actual after pathset re-enumerated: exactly new maintenance spec; only two existing input hashes changed. No secret/env contents read.

- Before inventory SHA256 `1caee33dc732ae610172cefe805eab07ca184521fe54bdd31aed798f580290d3`.
- After inventory SHA256 `1ba6aa284338f82ebef334f747e0137912569b16bfe2f0145e8c291b19641bef`.
- Precise package/lock preimages, afterimages, full hashes, dependency tree and case comparison are local artifacts; verification.json binds BuildID and installed versions. New test was added to exercise production output; its later404-only extension does not change production bundle. Final configured types/lint passed after that extension.
- Root node_modules553M→552M; shared npm cache668M→868M (observations, not exclusive attribution); new packet18M at measured boundary, including retained failure traces. No multiple app copies. Old isolated cache/failed attempts untouched. Port3100 bind check succeeds after runner cleanup; no unrelated process killed.

## Handoff and retrospective

Status **awaiting_review, not accepted**, with unresolved run-level regression qualification and known release blockers. Parent must disposition deterministic reds before expensive actual Supervisor acceptance review. Executor did not self-review or claim Motion receipt extends to new framework. Current patch remains consistent installed/manifest/lock, not rolled back speculatively.

Available-evidence retrospective: current preimages avoided losing accepted Motion/Lenis; normal resolution limited churn to expected Next-owned packages; npm advisory counts and vendor framework advisories are distinct sources. One full current combined run exposed an intermittent native-keyboard symptom which a focused rerun alone cannot erase. No automatic new global rule/skill/model configuration. Cost/tokens/API latency and full invocation duration unknown; gate and Playwright timings only are actual artifact data. Historical ENOSPC/noexec/partial/frozen attempts remain preserved in parent folders and own accounting.
