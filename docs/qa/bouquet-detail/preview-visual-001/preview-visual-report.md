# OLA-BD-PREVIEW-VISUAL-001 — bounded preview comparison, corrected continuation

## Status and scope

This continuation supersedes the earlier report's `noindex, follow`, blanket typography/position checkmarks, `Footer: none in either`, eyebrow tolerance and “nothing else / pixel-exact” statements. It is **not** full mock-design completion or visual acceptance. Medium risk; actual independent Supervisor review for this preview continuation remains required. The previous COMPOSITION-R1 review 2 is an actual PASS for its narrower technical scope, not a preview visual PASS: `../composition-001/technical-final/supervisor-review-2.json`. The mock route uses EN/RU/SR local data; no backend, product mapping, price, recipient or checkout changes. Route metadata and captured SSR: `noindex, nofollow`.

## Fresh native and actual browser evidence

Figma session `id-mwjwqdxw-mtg4liy7`, read-only. `recovered/native-mobile-nodes.json` and `recovered/native-intro-parent.json` contain actual node metadata. Browser results are from production build `Sm_TdEddiLZrnrLctBjyK`, EN, 900px viewport height, DPR 1, in `continuation/browser-rects.json` and viewport/crop PNGs. Coordinates below are **page coordinates relative to the top-left of each Figma page frame / browser document**, not canvas coordinates; native parent-local values are separately identified. Native screenshots were not saved in this continuation: no full visual pixel comparison is asserted.

| Botanical | Native page coordinates and size | Actual browser document coordinates and size |
|---|---|---|
| Desktop 1440 | image (80,866), 200×300 | (80,866), 200×300 |
| Tablet 768 | image (32,2216), 146.67×220 | (32,2216), 146.65625×220 |
| Mobile 360 | parent `114:6473` page y=786; band `114:6502` parent-local (20,1352), so page (20,2138), 320×220; instance `114:6537` band-local (0,0), 146.67×220 | band (20,2015.53125), 320×220; image (20,2015.53125), 146.65625×220 |

Mobile native band fill is `#faf7f2`, not the earlier report's `#fbf2f1`; actual band matches that fill and image uses contain/FIT. Band now follows the information block in normal flow with 24px separation, not fixed page height or viewport JS. **Absolute mobile vertical position remains 122.46875px above native**; dimensions/gutter/background are matched, not the page-y. Upstream content/geometry differ: evaluating their native visual alignment is a separate bounded scope; do not mask the drift with fixed offsets. Desktop/tablet image coordinates match these measurements, not a whole-page pixel claim.

The native D `107:5324` and T `109:5733` eyebrow metadata both say Manrope Medium 500, 12px font, 16px line height, **1.2000000476837158 PIXELS** spacing (not 1.2 percent). The CSS now uses 12px/16px/1.2px and browser computed styles confirm it at D/T; mobile eyebrow is hidden and native mobile has none. No other labels shrunk.

| EN intro | Native font-size/line-height: h1; support; body | Browser h1; support; body |
|---|---|---|
| D 1440 | 56/60; 16/25; 16/25 | 56/59.92; 16/25; 16/25 |
| T 768 | 56/58; 16/25; 16/25 | 38.4/41.088; 16/25; 16/25 |
| M 360 | 38/40; 22/28; 16/25 | 38/40.66; 16/25; 16/25 |

Native T values were freshly read from `109:5734–5736`; native M from `114:6477–6479`. Browser h1 values are saved; support/body CSS values are from Hero source, not independent browser text measurements. Tablet h1 and mobile support differences remain outside this two-fix scope. Header D native height 96, browser previously observed 96; T/M browser header vs native is **unverified**, not a match claim.

Footer correction: native has D `107:5626`, T `112:6216`, M `116:4775` footer instances. Current preview route and locale layout do **not** render Footer: fresh browser DOM reports `footerCount: 0` at all three sizes and the actual SSR has no footer; other site routes do include it. Thus footer is a real preview/native gap, not “none in either”; no footer removal or redesign was performed. Adding it requires separately scoped handling and fresh review.

## Build, tests and provenance

- One source-frozen private Next 16.4.5 webpack build, Node 24.22.2: `continuation/build.log`, exit 0, ID read back from private `.next/BUILD_ID`: `Sm_TdEddiLZrnrLctBjyK`. The generated fixture route was copied from `tests/fixtures/bouquet-detail-page/page.tsx.txt` (matching SHA-256 `8b81fba23afd5d86ec4ca8922196451f0a1d0d41c0132ca9616e63f3b0de5eb1`). `public` and `node_modules` were symlinked read-only inputs, not duplicated.
- Current unique Playwright cases: 57/57, no skipped/unexpected/flaky, comprising 12 preview and 45 integration including native Tab focus regression. `continuation/playwright.log` and `continuation/results.json`; new mobile dimensions/fill and D/T eyebrow computed-style assertions are within the 12 preview cases. SSR is saved as `continuation/ssr.html` with `noindex, nofollow`. Full-project non-emitting `tsc --noEmit --incremental false` and scoped ESLint both exited 0 after the final test edit; empty logs `continuation/tsc.log`, `continuation/lint.log`.
- `continuation/root-before.sha256` (254 entries) and `private-before.sha256` (251 entries) read back unchanged after checks, in corresponding `*-after-check.log`. These cover the selected source/public/config/test inputs, not dependencies/browser bytes or a claim of continuous filesystem monitoring. The private route fixture is additional and individually bound above.
- Figma native asset `04c255ea113af3f67cadd55ddb4e0811ba6fcc99` is byte-identical to existing `story_botanical_transparent.png`, SHA-256 `cebf6a5c4df49790e461013017032e74a710184004d94d025f79cf957e6ae695`, 1,186,124 bytes. Preview uses the existing story asset. The separately exported duplicate remains untouched; provenance is retained, no new export or production asset deletion.

## Recovery, cleanup and history

Actual prior run artifacts recovered before this build: `recovered/private-build*.log`, `playwright-final.log`, earlier preview/regression logs, `measure*.json`, screenshots, server and compiler logs. They are historical evidence only, not proof for the new CSS. Previous build ID `NRBO_d3ht464aopH6lw_4` was read from the old owned private copy and prior `playwright-final.log` records 57 passed. The identified previous copy `/tmp/ola-private-preview-1794874269` measured 302,222,377 bytes by `du -sb` (295 MiB allocated) and was removed after recovery; absence verified. This inherited copy exceeded the desired 200 MiB bound; no claim that its earlier peak complied.

This continuation created one private copy `/tmp/ola-preview-continuation-001` (measured 144,737,994 bytes after build/tests; no continuous-peak measurement) and removed it after evidence capture; absence verified. Port 3223 was free before allocation. Managed server wrapper stop initially left its owned Next child PID 30005 listening; child was stopped explicitly, after which `/proc/net/tcp` showed no 3223 listener and curl failed to connect. `continuation/server.log` is saved. Earlier report's port 3223/3224 rationale cannot be reconstructed and remains unknown. Root `.next`, port 3100, unrelated processes, configuration, dependencies and Git were not intentionally modified.

Changes: Hero TSX/CSS, preview test assertions, this report and own `recovered/` / `continuation/` evidence. Prior supplied execution metadata: original child 3901.89s and 199 API calls; batch time, tokens and cost unknown. No Supervisor call or new acceptance claimed in this continuation.
