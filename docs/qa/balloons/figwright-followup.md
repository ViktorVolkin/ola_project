# Balloons — fresh Figwright visual follow-up

**Current status: PARENT VISUAL FOLLOW-UP CHECKED / TECHNICAL GATES PASS / INDEPENDENT REVIEW PENDING.** Not public-release acceptance or universal pixel parity. This report supersedes the missing-mobile-wash/quota notes and earlier rendered evidence in [initial QA](README.md).

Later [hit-area review/fix](hit-area-review.md) supersedes the centred44px pointer region described below: the target now expands downward without covering titles. Native visual geometry is unchanged; new-build validation is24 unit/88 relevant E2E, not a re-run of every historical screenshot/full-suite gate.

## Source and scope

Actual Figwright read-only calls succeeded again in the parent session. OLA plugin0.6.0, session `id-mw3qd8c4-o9qauuep`. Read current D/T/M screenshots (`98:2166`, `98:2496`, `98:2959`), exact mobile wash `98:3040`, desktop wash `94:2154`, mobile favourites `98:3247`, tablet favourites `98:2605`, desktop grid `98:2259`, mobile extras `98:3294` and its caption, and mobile CTA photo `98:3416`. No canvas mutation.

The official Figma MCP Starter limit was real, but did not establish that Figwright was globally unavailable. Parent Figwright exposure was restored after the owner's gateway restart. It is no longer a design-access blocker.

## Corrections made from native data

- Mobile Hero now uses its actual horizontal ivory wash:90deg, alpha.94/.82/.38/.08/0 at0/32/52/70/100%. Its rounded4px frame is restored. Tablet retains its distinct72px vertical wash; desktop keeps the measured full-bleed gradient.
- Compact Favourites now have the actual white surface, natural equal-row captions, and desktop transparent surface. No white surface was invented from a screenshot: native fills confirmed #FFFFFF.
- Compact extras now have white card surfaces, native phone caption min-height50, 12px horizontal label/action insets and8px vertical caption padding. Tablet retains its own grouped caption; desktop retains direct topic actions. Longer translations may grow naturally; no truncation or fixed-height clipping was added.
- Compact CTA photo has native4px corners and an inside1px border. The outline is an overlaid pseudo-element so it does not alter measured source-image crop offsets. Full-bleed desktop has no compact outline/corners.
- Favourites previously exceeded the native tablet section by46px and desktop by8px because its shared44px action layout box was taller than the native21px line. Visual min-height now interpolates44→21 from phone to tablet; a transparent44px pseudo-element preserves the pointer hit region. Native desktop cards retain their15px bottom breathing room. No shared primitive API or other page changed.

## Validation and evidence

Final command, pinned Node24.22.2:

```sh
npm exec --yes --package=node@24.22.2 -- sh -c 'npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e -- tests/e2e/balloons.spec.ts tests/e2e/routing.spec.ts tests/e2e/navigation.spec.ts tests/e2e/fonts.spec.ts --timeout=60000 --reporter=line'
```

**PASS:** lint, project typecheck,24 unit, production build,68 relevant E2E. [Final gate log](figwright-followup-final-geometry.log). Prior `figwright-followup-final.log` contains a test-serialization failure: Chromium omitted default180deg in CSSOM. The assertion now accepts equivalent default serialization while still verifying gradient direction/stops. No UI workaround or removal of the color assertions was used. Intermediate passing runs are not added to the final count.

Production build: `aihDZzFZTvGcp35S7x0qe`.
Source/test/config fingerprint: `4a95ae250f4065640b5d56d659ab2b90f4d624650419edf0c2462d26715cccf1`,140 files. [Manifest](figwright-rendered/manifest.json) confirms source remained unchanged during capture.

- Same25 widths /75 distinct locale-width combinations, plus modal/language/routing/font tests.
- New assertions cover actual gradient directions/alpha, compact white vs desktop transparent card surfaces, CTA corners,44px pseudo hit-region height and native EN Favourites section heights776/1070/666 at360/768/1440.
- Nine new full-page captures, focused EN/RU Personalisation and mobile Hero captures in `figwright-rendered/`. Earlier `rendered/` is preserved as a historical build, not relabeled.
-135 photo-slot measurements; all images decoded; no document overflow or recorded page errors. EN's45 reference photo geometries still agree within1px. RU natural category-height differences are retained transparently in the manifest.
- [Section geometry and hit-region probes](figwright-rendered/section-geometry.json): phone section sequence matches native geometry to browser subpixel precision; Desktop Hero600/Categories222/Favourites665.984/Personalisation547.984/CTA480; tablet Favourites1069.953. Pointer hit-tests at the centre and20px above/below it hit the same action at all three references, including outside the21px visual box on tablet/desktop. This verifies hit coverage in Chromium, not full WCAG certification.
- Inspected current Figma and browser images: phone Hero, compact extra surfaces, tablet whole-page hierarchy, desktop composition and RU phone Personalisation. No whole-page pixel diff or cross-browser visual certification is claimed.

## Remaining gates

- Initial independent source review reported no security/logic defects, but its mobile-wash suggestion was stale. [Parent disposition](review-initial.json) accepts only limited evidence for unchanged server/content/shared paths, not a final-CSS PASS. A current-source CSS/test addendum with file hashes was dispatched. Parent must evaluate that result and rerun affected checks after any resulting fix.
- Shared Header/Footer were not redesigned in this follow-up. The rendered desktop footer is25px taller than the reference footer; page content section positions now match the native reference to subpixel precision. This shared-chrome difference remains for the site-wide visual/a11y review, not hidden as page pixel parity.
- Real recipient/prefill, RU/SR approval, imagery rights and owner visual/public-release acceptance remain open. Disabled preview behavior is unchanged.
- New404 references have now been found and inspected; [separate plan](../../design/not-found-implementation-plan.md). 404/radar UI is not implemented in this increment. Specific motion-continuity/pause and Footer-omission ambiguities were sent to the Lead Designer; no arbitrary routing or motion changes were made while waiting.

No new dependencies/client boundaries, staging, commit, push, deployment or Figma edits.
