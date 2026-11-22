# Preview origin diagnosis — local topology versus Vercel

## Finding

The prior `next start` + separate TLS-proxy test produced HTTP 400 **before secret verification** with no mock Content Lake requests (`prod-preview-proxy-400.json`). This establishes a failure for that synthetic topology, not a failure on Vercel and not a demonstrated resolver regression. The custom-server synthetic success (`prod-preview-results.json`) is separate evidence of the unchanged route, real synthetic secret flow, cookie and Home draft precedence, not proof of stock `next start` or Vercel.

The pre-Home source snapshot and current files are byte-identical, independently SHA-256 checked:

| File | Before = current SHA-256 |
|---|---|
| `src/app/api/draft-mode/enable/route.ts` | `fed60c29133190caa736aab9194f2af01fb37b84e4b6f50006ab46bd1a3887f4` |
| `src/content/sanity/preview-policy.ts` | `1ce19e22a04e81c43dbe38f9500010aff6c200e72f4085fba60eae3e7b99536f` |
| `src/content/sanity/preview-client.ts` | `0c5426d4dd66c551faba1183ba4bd20c763187022a19389c53bfe0a1254f95a5` |
| `next.config.ts` | `0551b7438ba01c17073b8d06cc18b0f2d273728366eee17000b051060ab345c4` |

The enable route validates `new URL(request.url).origin` against `SANITY_PREVIEW_ORIGIN` and the allowlisted parameter set before `validatePreviewUrl`. New `resolveHomeContent` is called by Home rendering after draft mode; it is not imported into the enable route or its policy, and cannot alter this earlier comparison. These facts establish that the relevant code boundary predates the resolver; they do not independently prove that the identical 400 was observed in a pre-change execution.

## Why this loopback topology differs

The failed test started ordinary `next start --hostname 127.0.0.1 --port <internal>` and put a separately bound HTTPS proxy at `https://localhost:<external>`. That proxy passed `Host`, `x-forwarded-host` and `x-forwarded-proto` to the internal listener. In installed Next 16.4.5 `node_modules/next/dist/server/lib/router-utils/resolve-routes.js:115-119`, with existing `experimental.trustHostHeader` unset, protocol may come from `x-forwarded-proto`, but `initURL` host and port are taken from Next start's **own** `opts.hostname` and `opts.port`, not `x-forwarded-host`. The configured expected origin was the external localhost port, so the route's exact-origin check and the generated internal URL are inconsistent in this setup. The response and zero API requests fit this code path; the failed run did not record `request.url` itself, so the precise comparison is a source-based explanation rather than a direct URL trace.

The successful fixture `preview-custom-server.mjs` supplies `hostname:'localhost'` and the external proxy port to Next's documented custom-server API, while listening on a different internal port. Its SDK and published API hosts alone are redirected to the synthetic loopback mock; the route, authorization, secret checks and policy remain unchanged. This explains why the tests do not establish the same deployment topology. It is a test harness, **not a suggested production server**.

No revised stock test was run: Next's documented `next start --hostname`/`--port` configure its listening address and port, while the documented HTTPS flag is for `next dev`, not `next start`; the separate TLS proxy necessarily has a different listener in this test. Enabling the experimental `trustHostHeader` path or fabricating forwarded request metadata solely to pass would change the trust boundary and is not justified. No product config or security modification is proposed.

## Platform evidence and gate

- [Vercel request headers](https://vercel.com/docs/headers/request-headers): `host` is the domain accessed by the client; `x-forwarded-host` equals `host`; `x-forwarded-proto` is typically HTTPS in production. These are documented header values, **not direct evidence of what this particular deployed Next route sees as `request.url`**.
- [Next deploying to platforms](https://nextjs.org/docs/app/guides/deploying-to-platforms): a deployment adapter tailors framework output to platform infrastructure. Vercel is not established to be equivalent to a self-hosted `next start` plus the synthetic proxy.
- [Next self-hosting guide](https://nextjs.org/docs/app/guides/self-hosting): a self-hosted reverse proxy is a separate setup; ISR and CDN considerations differ across deployments.
- [Next CLI](https://nextjs.org/docs/app/api-reference/cli/next): stock `next start` hostname/port are its server options; documented generated HTTPS is a development-server feature.
- [Next custom-server guide](https://nextjs.org/docs/app/guides/custom-server): describes `hostname` and `port` as the address the server is behind, while generally recommending the integrated router.

**Local technical handoff:** source-synchronized 133/133 units, focused 65/65, existing isolated build/typecheck/lint, source-bound synthetic browser modes and draft activation, 60-second revalidation, offline fallback and limited before/after comparisons are available for actual independent Supervisor review. The stock local proxy 400 and successful custom-server result remain separately visible. These checks do not establish a production Vercel deployment, live reader setup, actual Studio mutation refresh, or release approval. No new build, server, process, proxy setting, deployment, cloud/auth request, or real credentials were used in this diagnosis. No target-site request was made.

**Separate deployment gate:** actual request-origin/secret/Studio flow on the authorized deployed Vercel revision remains unverified. It requires a separately authorized, authenticated/owner-controlled Vercel/Sanity verification of that exact revision and configured preview origin, without disclosure of secrets. Do not label Vercel broken or silently treat local results as a deployed success. Actual `@supervisor` on runtime-confirmed `gpt-6.1-sol` PASS remains required for Home; no self-acceptance.
