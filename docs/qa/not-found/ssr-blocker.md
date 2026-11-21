# 404 no-JS blocker — reproduced framework behaviour

**OPEN / NOT FIXED.** Do not mark the new404 complete, SSR/no-JS supported or production-ready.

## Local evidence

Build `ujCcl_N0C0kHKjYOklnb3`, Next16.4.3, pinned Node24.22.2.

- `/en`: HTTP200, real Header and main in response HTML.
- `/en/missing/no-js` and `/ru/does-not-exist`: HTTP404, `<html id="__next_error__">`, no actual Header/main and no document `lang`; intended localized tree exists only in Flight scripts. With JS it renders, without JS it remains blank.
- Reproduced by raw HTTP probes and the new real no-JS browser test, not inferred from a build/configuration. [Capture manifest](rendered/manifest.json) records no-JS status404/mainCount0/artworkCount0/langnull and the actual blank screenshot.
- [First integration log](integration-first.log): lint/types/build and24unit pass;92 selected E2E finished later with86passed/6failed. The terminal call initially timed out; its surviving runner subsequently completed, so that earlier exit124 is not relabeled PASS. Failures: two no-JS cases, two raw localized-heading checks, two mobile glyph/`document.fonts.ready` timeouts. JS-enabled motion/preference, responsive control geometry and keyboard/header cases passed in that run; the whole gate FAILED.
- Old HTTP substring checks could match copy inside the Flight script and therefore did not prove server-rendered recovery content. New multiline copy exposed the same raw-HTML problem. Keep a no-JS/actual-markup assertion, not a weaker substring workaround.

## Matching upstream evidence

Read the actual issue pages, not only search descriptions:

- https://github.com/vercel/next.js/issues/100596 — open; documents Flight notFound error rethrow during Fizz and client-only error-boundary limitations, yielding the empty recovery shell. Reports include dynamic `[lang]` root layouts.
- https://github.com/vercel/next.js/issues/99287 — open; an identical `[locale]/[...rest]` catch-all setup is described. A Nov3 comment explicitly analyses16.4.3. Also documents possible60s CSS-commit hangs; local font timeouts are recorded separately, not proved to have that exact cause.
- Installed `node_modules/next/dist/server/app-render/app-render.js` includes the hardcoded `__next_error__` recovery shell; installed not-found docs distinguish pre-stream404 and post-stream200.

These sources support the framework diagnosis, but are not permission to apply an unmerged framework patch or claim a tested dependency fix.

## Boundaries retained

No `node_modules` patch, version replacement, experimental flag, proxy/rewrite, new public route or routing-strategy change was made. Returning the screen normally from the catch-all would silently produce HTTP200; adding loading/Suspense can also create a soft404. Neither satisfies the current contract. `global-not-found` only addresses unmatched URLs, not every matched product/page that throws notFound; adopting it is not a proven complete fix here.

Resolution requires a verified released framework fix or an explicitly accepted routing/platform trade-off, followed by the exact failing no-JS/raw-HTML tests and affected route regressions. Continue unrelated frontend work without disguising this bounded blocker.

## Follow-up evidence

The [controlled native guard spike](native-guard-spike/README.md) tested `dynamicParams=false` with empty catch-all static params without touching production. It preserved404 but did not preserve the localized document/recovery shell, so it is not an accepted fix. Both real fixture builds/results are archived and temporary apps removed.

The [controlled rewrite alternative](proxy-rewrite-spike/README.md) also ran two real fixture builds: static target and `force-dynamic` target. Both produced localized HTML but final HTTP200 despite requested rewrite404, so both were rejected. Production proxy/routing/dependencies stayed untouched. Stop speculative workaround loops; this is not a verified solution.

Nine JS-enabled static captures exist for EN/RU/SR360/768/1440. Desktop/Tablet English boxes match within rounding; Mobile top/art match. The [designer resolved the Mobile body question](mobile-flow-clarification.md): Figma's three separate TEXT nodes are not three required browser rows; the actual natural2line paragraph and25px shorter content are explicitly permitted. That issue is closed without a source edit, not mixed with this unresolved framework blocker.
