# Local Presentation activation — OLA homepage

**Website origin:** `https://olaproject-chi.vercel.app`; start `/en`, supported homes `/en`, `/ru`, `/sr`. This public URL establishes reachability, not the identity of this local revision or availability of its preview endpoints. No frontend or Studio deployment is authorized/performed by this task.

## Configuration after independent HIGH-risk Supervisor approval

Website/Vercel **server** variables:

- `SANITY_PREVIEW_ORIGIN=https://olaproject-chi.vercel.app` (exact origin, no slash/path).
- `SANITY_STUDIO_URL=https://www.sanity.io/@obdulf8du/studio/xxpedejjvg9va6r4u8t4llzw` (actual Dashboard Studio URL).
- `SANITY_API_READ_TOKEN`: a **separate Viewer/read-only** credential for Sanity project `zhn2ddaj`, dataset `production`, with draft read access. Use Vercel's secret server configuration; never send the value in chat, put it in `NEXT_PUBLIC_*`/Studio variables, or reuse the owner deployment token. No write/manage/deploy rights are needed by the website reader. URL-secret documents are read by the official validator; Studio creates them using the editor's own standard authenticated session.

Studio build public variable:

- `SANITY_STUDIO_PREVIEW_ORIGIN=https://olaproject-chi.vercel.app`.

`.env.example` documents names/nonsecret values; it is not a credential file and is not automatically copied to Studio. Operator configuration is intentional; a missing/invalid origin does not silently select another site. Missing reader/origin fails the website enable route closed. Missing Studio preview origin leaves adjacent forms available without a misleading preview.

Trusted Studio origins are exactly `https://www.sanity.io` and `https://ola-studio-zhn2ddaj.sanity.studio`. `http://localhost:3333` is allowed only in development; private production browser fixtures explicitly patch this policy for their local mock and are **not release artifacts**. No wildcard iframe/CSP relaxation exists in release.

## Editor flow

1. Owner signs in through standard Sanity Google/account login and opens **Home preview / Редактировать на странице**.
2. Choose the locale in the preview address/navigation. Click a visible heading, paragraph, button caption or photo; the adjacent editor targets that exact locale field/photo. Some official image inputs focus the same image's `.asset` child after opening; crop/hotspot and neighboring image identities remain distinct.
3. Save a draft. Official Presentation mutation notifications trigger an uncached server refresh **without publishing/reloading the iframe**. Public sessions remain published-only. Missing draft fields are explicitly listed as same-language published/local fallbacks.
4. Use **Section forms / Поля** for all fields, including alt text and accessibility-only labels not represented by visible text. The six section tabs and button/accessibility tab expose EN/RU/SR side by side. Home uses a singleton document `homePage`; no catalogue routes or assets were introduced.
5. **Exit preview** clears the official cookie partition and returns only to a supported locale home.

## External gates, not exercised here

Separate read credential provisioning; separately approved frontend/Studio deployments; real post-login origin/CORS/Google editor authorization; initial approved content seed and fourteen photographs/rights; RU/SR editorial approval; actual cloud draft-to-preview and publication-to-public validation. Do not publish an empty/incomplete Home document or call a local mock roundtrip a live Sanity test. The strict published adapter continues to reject incomplete documents and use canonical local fallback.
