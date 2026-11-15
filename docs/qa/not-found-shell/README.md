# 404 shell preparation — explicit Footer ownership

**Status: IMPLEMENTED / PARENT VALIDATION PASS / INDEPENDENT STATIC REVIEW ACCEPTED.** This increment prepares the approved no-Footer error shell; it does **not** implement the new404 artwork, copy or radar intro. Existing localized NotFoundPage remains minimal.

## Change and ownership

The Lead Designer explicitly confirmed that404 has the existing Header and recovery main, with no site Footer at any width. Instead of hiding chrome through CSS, client pathname state or route restructuring:

- `src/app/[locale]/layout.tsx` keeps locale validation, fonts, provider, skip link, Header and localized enquiry explanation, but no longer unconditionally renders Footer.
- Four normal thin route files explicitly render their page followed by the existing Footer: locale root, About, Weddings, Balloons. Their emitted body order remains `header + main + footer`.
- Locale catch-all/not-found and unsupported-locale handling are unchanged. No new URL, route group, experimental global-not-found flag, dependency or client boundary.
- **Future normal routes must explicitly include Footer.** Error views must not add it. The existing Footer still owns its translations and behavior; no duplicate component was created.

## Actual RED → GREEN

1. Added `tests/e2e/error-shell.spec.ts` before implementation.
2. Production RED: all6 localized unknown-route tests failed specifically because contentinfo count was1 instead of0. HTTP404 and Header checks already passed. [red.log](red.log).
3. Applied only the five app-file changes above.
4. GREEN: lint, project typecheck,24 unit, production build and14 targeted shell tests passed. [green.log](green.log).

The tests cover all EN/RU/SR normal routes with exactly one Header/main/Footer in the prior DOM order; three kinds of nested unknown route per locale return real HTTP404 via both request and browser navigation, retain the localized Header/main and omit Footer. Unsupported locale keeps framework real404.

## Integrated regression gate

Full current E2E set passed in two disjoint project batches: **desktop106 + mobile106 =212 unique project/test cases**, without skipping tests or changing assertions. [desktop log](desktop-e2e.log), [mobile log](mobile-e2e.log), [machine summary](validation-summary.json).

The first combined212-test command was terminated with exit137 before a final summary. Cgroup OOM counters at inspection were0; its kill cause is not established. No complete PASS is claimed for [that incomplete log](full-e2e.log). Splitting by project completed the same full set within individual execution budgets. Targeted14 and earlier68 runs are not added to212.

Production build `3eTlI5tEfP5X4ou9qsqi2`; source/test/config fingerprint `ac1868ee8c33d2275a234c158b4ad3be0c671cb165cc3c5743cbb891c960d962`,141 files. Comparison with the preceding Balloons source manifest finds **only** layout, four route files and the new test changed. Source stayed unchanged through capture/verification. No source/content/CSS/shared-widget modifications occurred in this increment.

Commands, pinned Node24.22.2:

```sh
npm exec --yes --package=node@24.22.2 -- sh -c 'npm run lint && npm run typecheck && npm test && npm run build'
npm exec --yes --package=node@24.22.2 -- npm run test:e2e -- --project=desktop --timeout=60000 --reporter=line
npm exec --yes --package=node@24.22.2 -- npm run test:e2e -- --project=mobile --timeout=60000 --reporter=line
```

## Browser/visual preservation evidence

Nine new Balloons full-page captures EN/RU/SR ×360/768/1440 with [source/build manifest](rendered/manifest.json) exercise the existing page across the shell change. All decoded; no recorded page errors or document overflow. Actual shared navigation/language/modal, all page responsive and typography tests are included in212.

Decoded-RGBA comparison against the immutable pre-shell Balloons build: **7/9 natural captures are pixel-identical**, all nine dimensions match. EN/RU desktop differ only in the first three category image raster regions, not layout/text/chrome. Investigation found current browser resource selection `w=128`; a browser-only controlled `w=256` probe for those three images makes both remaining pages **exactly pixel-identical** to their baseline. [Raw comparison](pixel-comparison.json), [controlled probe](resource-probe.json), before/after crop PNGs and probe PNGs are preserved.

This isolates responsive-image candidate/cache selection as the raster difference; **no production image source, sizes, crop or quality setting was changed**. Do not relabel the natural capture result as9/9 identical, or call the controlled probe actual default browser selection. No new visual baseline was silently accepted to conceal a layout difference.

## Remaining scope and limits

- Independent read-only shell review returned no findings. Parent matched all10 reported file hashes against actual current sources before accepting the scoped result: [review evidence](review.json). Reviewer did not run browser/build/Figma; production test evidence above belongs to the parent. The subsequent isolated Balloons hit-area correction does not modify any of these10 reviewed shell files.
- New404 design/radar code remains unimplemented; [motion/chrome plan](../../design/not-found-implementation-plan.md) is authoritative preparation. Full target404 design, no-JS/reduced-motion lifecycle and animation QA still required.
- No public-release, all-browser, full WCAG, visual pixel-parity across the site or deployment claim. Existing contact/draft translations/rights/owner acceptance gates remain.
- No staging, commits, push, config/auth changes, restart/reconnect or Figma mutation.
