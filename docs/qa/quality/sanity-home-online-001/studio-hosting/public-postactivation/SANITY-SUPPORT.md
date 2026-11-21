# Sanity hosting support — inconsistent public manifest after existing-app update

Please investigate delivery/activation consistency for existing Studio app **xxpedejjvg9va6r4u8t4llzw**, project **zhn2ddaj**, host **ola-studio-zhn2ddaj**. No new app, redeployment, configuration change or credential exchange is requested by this handoff.

Authenticated single metadata GET at **2026-11-21T06:16:55.618Z** returned active deployment **exsuqhiqygwjey34lngqr0p2**, deployedAt **2026-11-20T23:36:04.801Z**, isActiveDeploymenttrue, version6.24.0, manifest.buildId **1795217764630**, workspace default/zhn2ddaj/production, schemaDescriptorId **uEiB2NRDidLupUcT-fw6H5FXiq3KrD2M_coF-EuoI5yp9rA**.

One public pair at **2026-11-21T06:19:59Z**, no auth/cookies/query/cache-buster and no redirect follow:

- Root https://ola-studio-zhn2ddaj.sanity.studio/ returns302 to exact Dashboard app. Last-Modified Fri,20Nov2026 23:36:04GMT; request ID **2ca8360d-3e66-4de0-b82b-d337226f6936**.
- https://ola-studio-zhn2ddaj.sanity.studio/static/create-manifest.json returns200/application-json,1007bytes, **old** SHA256 **3e69f1c2712ed72b3e434d8b819ca9818b94a011c883e2ca3b65bfc1a14cfa3b**. Date Fri,20Nov2026 23:02:54GMT; Age **26225**; Cache-Control **public, max-age=86400, stale-while-revalidate=432000**; Last-Modified Thu,19Nov2026 21:17:21GMT; ETag **W/"ysGlCpRSkGqj"**; Via **1.1 google**; request ID **37daf60b-bf72-43b5-9389-f9193a332e9f**.

Expected uploaded post-CLI manifest SHA256 **97d64ff536835aa18807a15fa03c9c67f9f96cf922eb4a2944a39c4dc414badb**,1007bytes, createdAt2026-11-20T23:36:04.506Z, references **0a0aa0cd.create-schema.json** / **e691e35c.create-tools.json**. Served manifest remains createdAt2026-11-19T21:17:19.735Z, references **62168408.create-schema.json** / **a1fd46b5.create-tools.json**. Earlier bounded public checks found all3new production-origin JS bundles and new schema available with exact local hashes; full asset consistency is not established.

Please confirm which manifest the active Dashboard app selects, whether the origin has the uploaded expected manifest, and why the unversioned public resource still delivers the old representation under these cache headers. Advise a provider-supported resolution without creating/relinking an app or another blind redeployment. Current headers support cached old delivery but do not independently prove the origin's current bytes or the cache layer responsible. No automatic polling, purge or further requests have been performed.

Supporting evidence: `public-postactivation/pair.json`, `public-postactivation/public-manifest.json`, `activation-observer/observation.json`, previous `readonly-diagnostic/` and sanitized one-attempt execution records. No token is needed in this support packet.
