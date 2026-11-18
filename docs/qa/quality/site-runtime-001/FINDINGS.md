# OLA-QUALITY-SITE-RUNTIME-001 — FINDINGS.md

Whole-site current-build runtime audit, Node 24.22.2, Next.js 16.4.5 production build (`next build --webpack`) run from a private fixture copy of the frozen dirty source tree; source tree, configs, tests and lockfiles were NOT modified. Root `.next` and port 3100 never touched. Server on port 31981 stopped after capture; port verified free.

## Confirmed findings (reproduced twice each)

### F-01 — Mobile navigation menu cannot be opened (all locales)
**Severity:** High — keyboard/screen-reader navigation blocked on mobile
**Scope:** Header mobile menu button, all 3 locales (en/ru/sr), viewport ~360–375px, every route sharing the locale layout shell
**Expected:** clicking/tapping `header button[aria-haspopup="dialog"]` ("Open navigation") opens the navigation dialog; focus enters the menu
**Actual:** the menu button renders with `disabled=""`; a click produces no dialog (`getByRole("dialog")` never appears; tests time out at 2 min). Confirmed via direct browser repro and via `tests/e2e/accessibility-site.spec.ts` "menu mobile"/"menu language mobile" (en, ru, sr — 6 cases), all failing identically on the current build.
**Evidence:** docs/qa/quality/site-runtime-001/repro-menu.txt, e2e.txt failure block 1)

### F-02 — Unknown-path SSR/no-JS 404 serves Next.js fallback, not localized recovery UI (historical defect still real)
**Severity:** High — SSR/no-JS 404 recovery
**Scope:** all locales, any unknown path under a supported locale (e.g. `/en/nope-xyz`, `/ru/does-not-exist`); no-JS page load
**Expected:** HTTP 404 with the app's localized `NotFoundRecoveryBlock` UI (localized h1, recovery links, Header, skip link), per `src/app/[locale]/not-found.tsx` and `src/components/pages/NotFoundPage.tsx`
**Actual:** direct server response is Next.js 16's built-in fallback (`<html id="__next_error__">`, English "404: This page could not be found."); `ru.NotFound.title` ("Эта страница не цветёт.") absent from the response body. With JavaScript disabled, `[data-404-artwork]` recovery artwork is not present. Client-side navigation to a 404 DOES render the app recovery UI (error-shell suite passes) — defect is SSR/no-JS only.
**Evidence:** docs/qa/quality/site-runtime-001/ssr/unk-path.html + unk-path.headers, e2e.txt failure blocks `not-found.spec.ts:255` and `routing.spec.ts:22`, repro-404.txt

### F-03 — Mobile balloons personalisation enquiry buttons lack the action verb in their accessible name
**Severity:** Medium — accessible name vs visible intent on disabled (unavailable) enquiry buttons
**Scope:** `/[locale]/balloons`, personalisation extras buttons, mobile project (375px), all 3 locales
**Expected:** accessible name "`{enquire} — {title}`" (e.g. "Enquire — Chocolates")
**Actual:** accessible name is just the title ("Chocolates"/"Шоколад"/"Čokolade"); button is `disabled` with `aria-describedby="enquiry-unavailable"` (unavailable state announced correctly). Desktop project passes (name = title, matching the desktop branch).
**Evidence:** e2e.txt failure blocks `workflow-disclosure.spec.ts:11` (en/ru/sr), repro-workflow.txt

### F-04 — not-found motion intro: 0 Web Animations API animations on rings (triage, not confirmed violation)
**Severity:** undetermined — observation
**Scope:** `/[locale]/missing/motion` 404 page, `[data-404-ring]` artwork
**Actual:** `data-motion="intro"` is set, but `node.getAnimations()` returns `[]` for all 4 rings, so the spec's "intro ends before 5 seconds" assertion cannot be verified through the Web Animations API (likely CSS-driven animation). Reproduced deterministically (`not-found.spec.ts:180`, all projects). Not counted as a confirmed violation; motion ownership is under separate Supervisor review (motion-scroll scope).
**Evidence:** e2e.txt failure block `not-found.spec.ts:180`, repro-404.txt

## Gates executed on current frozen source

| Gate | Result |
|---|---|
| `next build --webpack` (Node 24.22.2) | PASS — 23 routes generated (21 SSG + /_not-found + dynamic catch-all); typecheck inside build passed |
| `eslint --max-warnings=0` | PASS (exit 0) |
| `tsc --noEmit` | PASS (exit 0) |
| `vitest run` — 52 unit tests | PASS (52/52; two fixture-only setup failures pre-audit were caused by docs assets not copied into the scratch fixture — those assets exist in workspace `docs/` and were copied fixture-locally only) |
| Playwright E2E — 19 applicable suites | 169 passed, 12 failed (F-01 ×6, F-02 ×2, F-03 ×3, F-04 ×1), 1 skipped (`contact.spec.ts` desktop-only precondition) |
| Responsive matrix | 21 routes × 3 locales × 360/768/1024/1440: all 200, zero console errors, zero failed requests, zero HTTP errors, zero axe violations, zero horizontal overflow |
| axe WCAG21/22 A/AA scans | 0 violations on 42 mobile+desktop page scans |
| SSR/no-JS/metadata | `/` → 308 `/en`; valid routes 200 with server-rendered lang/h1/main content; `robots: noindex, nofollow` emitted on all pages; no `sitemap.xml`/`robots.txt` endpoint (meta-tag only); preview pages noindex/nofollow, absent from navigation |

## Excluded from this run (9 suites, intentional, not failures)
5 `bouquet-detail-*` (preview app — separate local-mock preview scope, different fixture/deployment), 3 `motion-scroll-*` (scoped motion receipt under separate Supervisor review), `security-next-patch.spec.ts` (separate security integration gate). No fixture-only tests were run against the wrong app.

## Blocked (recorded separately, does not block this audit)
Visual reference gate: current approved Figma frames not verified (@ola-lead-designer steering); historic mappings are references only. No Figma access retried; no design-fidelity claims made.

## Evidence
`docs/qa/quality/site-runtime-001/` — coverage.json (machine-readable coverage of every route × locale × dimension), build.txt, lint.txt, types.txt, unit-complete.txt, e2e.txt, repro-menu.txt, repro-404.txt, repro-routing.txt, repro-workflow.txt, browser.json, browser-inter.json, screenshots/ (84 full-page captures), ssr/ (raw +JS and no-JS captures with headers), environment.txt (Node binary path/hash), root-before.json (pre-audit source manifest), fixture-size-before.txt. All records inert .txt/.json — no .tsx duplicates.
