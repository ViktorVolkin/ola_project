# OLA-404-RESOLUTION-001 — released-fix investigation

**Verdict: STILL BLOCKED. No evidenced released SSR/no-JS fix; no dependency candidate eligible for a 404-resolution execution experiment today.** Research only, not product acceptance or independent Supervisor review.

Checked 2026-11-14 23:29–23:32 UTC (15 November CET). Exact local path supplied by owner resolves to `/workspace` inside the execution backend. Branch `development`; existing staged/dirty/untracked state retained. No build, typecheck, dev server, test, install, Git mutation or product edit was performed.

## Confirmed local state and cause

- `package.json`, lock and installed Next agree on **16.4.3**; next-intl **4.14.9**, React/React DOM **19.3.0**. Historical reproduction is not misattributed to an already-upgraded checkout.
- `src/app/[locale]/[...rest]/page.tsx:1–5` calls `notFound()` synchronously in a Server Component. `[locale]/not-found.tsx` exports the async server `NotFoundPage`; it awaits translations and returns real `<main data-not-found>` with the recovery widget. `[locale]/layout.tsx:20–37` awaits params, validates locale, and normally supplies localized `<html>`, Header and children. There is no `src/app/layout.tsx` in the current route inventory.
- This supported-locale page call matches the installed documented API, not an un-awaited promise or swallowed exception. Invalid locales additionally throw from the locale root layout and i18n request config: **a distinct recovery edge case**, not proof of a local misuse causing the supported-locale failure. Do not assume a page-only fix resolves root-layout throws.
- Installed `app-render.js:2492–2529` classifies the HTTP access fallback, sets status404 and requests `getErrorRSCPayload`; `1284–1327` builds a hardcoded empty `__next_error__` document. The error Fizz path renders `ErrorApp` while inlining the original render Flight (`2542–2564`). This matches historical real raw-HTML/no-JS failures; it is source corroboration, not a newly executed reproduction.
- Installed docs `dist/docs/01-app/03-api-reference/{04-functions,03-file-conventions}/not-found.md` explicitly permit render-path `notFound()`, async not-found UI, and distinguish pre-stream404/post-stream200. Global-not-found is experimental and unmatched-route-only. Suspense/normal-return recipes would change the status contract, not establish a fix.

## Current upstream and released evidence

| Evidence | Confirmed finding |
|---|---|
| [Issue100596](https://github.com/vercel/next.js/issues/100596), [Issue99287](https://github.com/vercel/next.js/issues/99287) | Actual pages still Open; describe same blank shell, Flight-only recovery, dynamic locale root/catch-all and misleading substring assertions. |
| [PR100648](https://github.com/vercel/next.js/pull/100648), [PR98583](https://github.com/vercel/next.js/pull/98583), [PR98455](https://github.com/vercel/next.js/pull/98455) | REST API confirms **open, merged=false, merged_at=null** for all. Their proposed server-rendered recovery is not a released solution. A non-null test merge SHA is not a merged PR. |
| [Latest stable REST](https://api.github.com/repos/vercel/next.js/releases/latest), [v16.4.6](https://github.com/vercel/next.js/releases/tag/v16.4.6) | Latest stable is **16.4.6**, published 2026-11-09T20:27:17Z; not16.5 stable. Notes explicitly exclude pending canary changes. |
| [16.4.4](https://github.com/vercel/next.js/releases/tag/v16.4.4), [16.4.5](https://github.com/vercel/next.js/releases/tag/v16.4.5), [16.4.6](https://github.com/vercel/next.js/releases/tag/v16.4.6) | Patch notes cover unrelated changes/security, not this recovery fix. **16.4.5 contains security advisories**: route to separate authorized dependency/security maintenance, never call that a 404 fix. Exploitability in OLA was not assessed. |
| [Tagged16.4.6 renderer](https://github.com/vercel/next.js/blob/v16.4.6/packages/next/src/server/app-render/app-render.tsx#L2241), [tag comparison](https://github.com/vercel/next.js/compare/v16.4.3...v16.4.6) | Read real released-tag source, not master: the extracted `getErrorRSCPayload` block is **identical** between16.4.3 and16.4.6 and still builds the empty shell. Structured diff is empty in `recovery-comparison.json`. No demonstrated reason to repeat the failed guard/rewrite experiments on this patch. |
| [Release stream](https://github.com/vercel/next.js/releases) | Current top entry16.5.0-canary.50 is explicitly prerelease, not stable-fix evidence. Fork checks mentioned in PR comments are not official release validation. |
| [Merged92231](https://github.com/vercel/next.js/pull/92231), [backport93470](https://github.com/vercel/next.js/pull/93470) | Real merged fixes concern HTTP fallback prerender/Flight recovery. They cannot close this newer documented blank-document path by title alone; Issue99287 reports continued failure and current released recovery source retains it. |

PR98583's Nov7/Nov9 comments add a relevant unresolved acceptance dimension: a page-oriented patch initially regressed throwing layouts to500; author reports a later fix that still deliberately leaves root-layout throws on the error shell. These are **unmerged author/community reports**, not our verified results. PR100648 comments additionally warn that successful HTML recovery can coexist with broken hydrated return-home navigation or missing early layout scripts. No fork install/patch is recommended.

### Compatibility is not resolution

[16.4.6 package metadata](https://github.com/vercel/next.js/blob/v16.4.6/packages/next/package.json) permits Node `>=20.9.0` and React/React DOM `^19.0.0`; local next-intl4.14.9 declares Next `^16.0.0` and React `^19.0.0`. Thus Node24/React19.3/next-intl4.14.9 are **declared-range compatible** with16.4.6. No new runtime compatibility, deployed adapter behavior or SSR fix has been verified. No package changed.

## Preferred next action and owner choice

**Keep the strict404 + localized no-JS/raw-document contract and the release blocker.** Continue unrelated frontend work. No credible newly released 404 fix was found, so **do not schedule another speculative workaround or version benchmark**.

Minimal owner choice: retain that contract and wait for an actual released relevant fix (recommended), or explicitly authorize a separately scoped architecture/platform decision with an explicit changed contract. A five-hour production-ready promise cannot honestly include this externally blocked gate. This packet does not authorize a framework patch, global-not-found, route-group rewrite, soft200 or routing replacement.

**One future bounded validation, conditional only:** when an official stable tag demonstrably includes a relevant merged recovery fix, obtain owner/build-slot authority and test that exact pinned tag in an isolated checkout/output directory against the original16.4.3 baseline. No unrelated model/dependency changes or broad version search. First rerun the exact failing regression below, then the affected route/hydration matrix. Require actual Supervisor Sol review of any implementation; this read-only researcher supplies no PASS.

## Regression gate to preserve (commands NOT run here)

With pinned Node24 on PATH, an authorized production build, and exclusive port3100/build-slot ownership:

```sh
npm run test:e2e -- tests/e2e/not-found.spec.ts --grep 'without JavaScript'
npm run test:e2e -- tests/e2e/not-found.spec.ts tests/e2e/locales.spec.ts tests/e2e/routing.spec.ts
```

Playwright config starts `next start` on3100 and refuses server reuse, so these are not safe to launch alongside the active worker. First command exercises the existing failing `/en/missing/no-js` test in desktop/mobile projects: real404, no-JS visible localized heading/static artwork and working home link. The second alone is **not sufficient SSR proof**: `routing.spec.ts:28` still uses raw substring matching, which can match Flight (and the new multiline copy can fail it). Future authorized validation must additionally parse raw HTML with scripts removed / inspect actual no-JS DOM, requiring correct `<html lang>`, Header, main, localized heading and real recovery anchors; no `__next_error__` shell. Do not weaken assertions to accept Flight text. Historical86/92 and later independent font rechecks remain unchanged; font timeout resolution does not resolve SSR.

Affected matrix, after any authorized fix:

- Normal200: each `/en|ru|sr` home and `/about`, `/bouquets`, `/weddings-events`, `/balloons`, `/contact` beneath each locale. Check real document language (`sr-Latn` for sr), Header/main, and hydrated navigation.
- Known failing404: `/en/missing/no-js`, `/ru/does-not-exist`; localized catch-all `/en|ru|sr/missing/design-check` and nested `/en|ru|sr/bouquets/unknown-slug`.
- Unknown-locale/unprefixed404 with no redirect/English fallback: `/fr`, `/fr/bouquets/unknown`, `/en-US`, `/about`, `/missing.svg`; explicitly watch root-layout throw500 regression. A requirement for an unsupported locale's recovery language needs owner specification; do not invent one.
- **Matched product/page-thrown404 is currently a coverage gap**: current route inventory has no product `[slug]` page; `/bouquets/unknown-slug` matches the generic catch-all, not a product lookup. Future isolated regression must include a genuinely matched page calling `notFound()` and nested boundary case. No product route was invented or added here.
- Preserve `/`308→`/en`, `/ru/`308→`/ru`, existing asset200; check no-JS return links and JS return-home + language-switch interaction, no hydration/page errors, CSS/fonts. Initial HTML alone cannot prove client recovery correctness.

## Artifacts and limits

`upstream-evidence.json` stores timestamped public API/tag evidence; `recovery-comparison.json` stores the exact extracted released renderer block and comparison; `action-log.md` records meaningful reads/results/failures; `taskcard.md` and the own scoped model-quality note preserve registration/attempt history. Historical `../ssr-blocker.md`, source, tests, config, packages, node_modules, .next and central ledger were not edited. No behavioral fix, release, visual acceptance or Supervisor PASS is claimed.
