# Rewrite/status404 — controlled alternative, rejected

## Question and prerequisite

Does documented `NextResponse.rewrite(destination, {status:404})` produce both a real404 and localized server-rendered recovery HTML on the current installed Next16.4.3?

Read installed `proxy.md` and `NextResponse` declarations first. `rewrite` accepts `MiddlewareResponseInit`, which extends standard ResponseInit. This establishes an API surface, not its actual final route response behaviour.

## Minimal test

Disposable fixture copied the already tested locale root/Home/not-found/catch-all setup. Added an isolated `error-view` page and a narrowly matched proxy for `/en|ru|sr/missing...`. No real OLA source/config/dependency was changed.

Two actual production builds/runs:

1. [Static-target results](results.json), [build log](build.log), [source](static-fixture-sources.json): the recovery route was statically generated.
2. [Dynamic-target results](dynamic-target/results.json), [build log](dynamic-target/build.log), [source](dynamic-target/fixture-sources.json): only the recovery target gained documented `dynamic="force-dynamic"` to test whether cached200 was the cause.

In **both** variants, targeted paths retained original response URL, localized html language, Header/main and missing heading — but the final HTTP status was **200**, despite the requested rewrite404. This is a soft404 and fails the contract. The second variant falsifies the simple hypothesis that disabling target prerendering alone preserves404.

Normal EN/RU pages stayed200. Unsupported locale/uncovered throwing routes still reproduced the original404/error-shell behaviour. Direct access to the fixture's internal recovery path returned200, another reason this is not a drop-in routing solution.

## Verdict: INVALIDATED on tested Next16.4.3 paths

Do not deploy either recipe or describe the upstream comment's rewrite workaround as locally verified. No invented internal headers, dependency patch or further speculative workaround was added. After native guard and both rewrite variants failed, stop expanding this into an unbounded routing-repair project; retain the framework blocker and require a verified fix/explicit architectural decision.

This was HTTP/server-markup mechanism testing only, not real Header hydration, language-switching, caching/deployment or visual acceptance. Fixture apps were archived and removed. All149 production fingerprint files stayed identical; ports3100/3120/3130/3140 closed.
