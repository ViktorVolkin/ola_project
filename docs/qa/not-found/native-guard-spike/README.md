# Native dynamic-parameter guard spike

## Question

Can a catch-all that never represents real content use the documented `dynamicParams=false` plus empty `generateStaticParams` to retain **both** localized server-rendered recovery markup and genuine HTTP404, without proxy/global fallback/framework patches?

## Method

Two isolated minimal Next16.4.3 fixtures used the existing installed dependencies and pinned Node24.22.2. Both had dynamic `[locale]` roots, normal EN/RU/SR fixture pages, a locale-aware not-found component and a catch-all throwing notFound. The only intended variant difference was `dynamicParams=true` versus `false`; both returned an empty catch-all static-params list.

The fixture source is deliberately technical test content, not fabricated project/business content. It was never added to production `src`, and no production package/config/routing file changed.

## Actual result

- Both production builds succeeded.
- Normal EN/RU fixture pages retained HTTP200, language, Header and main in both variants.
- Baseline unknown supported-locale URLs returned HTTP404 with the empty `__next_error__` document, no language/Header/main/expected heading.
- Guarded unknown supported-locale URLs still returned HTTP404 but **lost the intended localized document and recovery shell**: no expected language/Header/main/localized missing heading. Removing the error-shell marker is not sufficient success.
- Unsupported-locale paths stayed404, which does not repair supported-locale rendering.

[Exact structured results](results.json), build/server logs and [fixture sources](fixture-sources.json) are retained. Raw-HTML checks strip scripts first so Flight strings cannot falsely satisfy content assertions.

## Verdict: INVALIDATED for the current contract

Do not apply this guard to the real catch-all as an SSR fix. It does not preserve locale/recovery composition in the tested native path. A negative spike is evidence, not a failed change to roll forward or conceal.

Temporary fixture directories were removed after archiving the evidence. All149 files in the production capture fingerprint remained unchanged; ports3100/3120/3130 were verified closed. No new dependency, experimental flag, patch, proxy/rewrite or product route was introduced.
