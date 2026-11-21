# New 404 — Figwright intake and implementation plan

Status: **NEW UI IMPLEMENTED / FIRST INTEGRATION GATE FAILED / SSR BLOCKER OPEN**. The minimal page has been replaced by the recovery widget/artwork and bounded ring-lifecycle island. Lint/types/build24unit pass, but no-JS delivery fails in Next16.4.3 before the widget renders; [current QA](../qa/not-found/README.md) and [framework diagnosis](../qa/not-found/ssr-blocker.md). Nine real captures exist. [Mobile natural flow is now clarified](../qa/not-found/mobile-flow-clarification.md): two English lines are permitted, not a defect. No runtime change was needed. Do not declare this increment complete.

## Verified current references

Fresh read-only Figwright access is restored in the parent session. OLA plugin 0.6.0; file list returned session `id-mw3qd8c4-o9qauuep`, page Design `0:1`. No Figma mutation or dependency on official MCP quota is involved.

- Desktop: `160:5978`, 1440×900; Main `160:6083`.
- Tablet: `160:5979`, 768×1024; Main `160:6084`.
- Mobile: `160:5980`, 360×800; Main `160:6085`.
- Artwork components: Desktop `160:5953`, Tablet `160:5954`, Mobile `160:5955`; set `160:5977`.
- Context reads: full D/M depth3; tablet depth2; desktop Intro `160:6113`, Support/actions `160:6116`. Three actual screenshots inspected. Missing compact typography/Tablet artwork were subsequently supplied as text by the Lead Designer from the existing brief and accepted native snapshot; [reference/provenance](not-found-reference.json). Desktop/Mobile original context was recovered verbatim through session history, not a new live read. Tablet action gap uses16px inside the explicitly allowed12–16px range; its exact native value is not claimed.

## Confirmed design structure

- Shared Header, no active page link in the reference. Frames do not show a Footer.
- Desktop Main: horizontal editorial split, inline padding80, block padding24, gap80, min-height804 below96px Header. Left copy560px; artwork640×600. Reference content is vertically centered, not positioned with browser-fixed coordinates.
- Tablet Main: centered vertical stack, padding32, gap24, min-height928 below96px Header. Artwork360×360 followed by centered copy704px.
- Phone Main: vertical artwork-first stack, padding16px 20px 20px, gap16, min-height720 below80px Header. Artwork260×248, centered copy320px. Recovery controls stack full width on phone.
- Desktop heading: Cormorant Garamond Medium56/60, -2%, exact EN `This page is\nout of bloom.`; eyebrow Manrope Medium11/16, tracking2px, `ERROR 404`.
- Exact EN support: `We couldn’t find the page you’re looking for. Let’s find you something lovely instead.` Desktop Manrope16/25, max-width480.
- Primary `Back to home`; secondary `Explore bouquets`; existing rounded primary/secondary ActionLink and ArrowRight semantics should be reused. Home/catalogue routes exist as navigation contracts; catalogue is not implemented yet, so do not claim its destination is completed.
- Artwork has four concentric outlined ellipses, a translucent blush centre, Cormorant Regular `404`, and Great Vibes `back to beautiful`. It is primitive shape/text artwork, not a supplied photographic asset.
- Desktop ring diameters520/420/320/220, common centre(320,280) in640×600 artwork. Border ring #D9CCC4 opacity.58; wine rings #641323 opacity.10/.18/.26. Centre136px, blush #F1E4DE alpha.62. 404200/200; script30/36.
- Phone ring diameters192/152/112/72, common centre(130,104) in260×248 artwork. Centre48px; 404112/112; script24/28. Tablet accepted geometry:360×360, ring diameters300/240/180/120 at origin(180,158), centre80px, numeral144/144 at y68, script26/32 at y314. Phone optical numeral y34; Desktop y155 and script y552 are confirmed in the recovered native context.

## Architecture and open decisions

### Accepted semantic/motion clarification

Source: direct OLA Lead Designer message after the first intake. The designer reports recording this in `docs/operations/not-found-404-design-brief.md`; that path is not present in this frontend Docker workspace, so this plan does not claim independent brief readback.

- One short outward ripple intro, **not an infinite radar**. Total approximately3.5–4seconds INCLUDING stagger/delays, strictly finished before5seconds. End in the accepted static artwork. No replay on scroll, resize or ordinary rerender.
- Animate only ring scale/opacity within the existing artwork area. Numeral404, blush centre, Great Vibes, heading/body/actions are stable and available immediately. No sweep beam, loading semantics or layout shifts.
- No visible pause/stop control: this is a short self-stopping decorative intro. Reduced motion starts static immediately; a preference change during intro must stop and leave the static state. No-JS/unsupported-motion fallback is static. Any later infinite loop requires a separate decision and appropriate pause UX. This clarification is not WCAG certification.
- Footer is **intentionally absent at all three widths**, not below the frame. Keep existing Header + error main/recovery links. Do not hide shared chrome through global CSS or introduce a client pathname workaround.

### Bounded shell implementation decision

The explicit shell preparation is implemented and parent-validated: Header/provider remain in the locale layout; the existing Footer is rendered alongside the page from each normal thin route (`/[locale]`, `/about`, `/weddings-events`, `/balloons`) and omitted from locale not-found. Every URL and normal-page DOM order is preserved, with no route groups or routing-strategy change. Trade-off: four explicit Footer call sites instead of one; future normal routes must include Footer. Production RED/GREEN and full212-case E2E coverage confirm normal-page chrome and real localized HTTP404 without Footer; [bounded shell QA](../qa/not-found-shell/README.md). Independent static shell review is accepted after matching all10 reported file hashes; new404 artwork/copy/motion is not implemented by this preparatory step.

### Latest bounded read failure

The subsequent parallel scoped reads for Tablet artwork `160:5954`, Tablet content `160:6111`, Mobile intro `160:6115` and Mobile support `160:6118` did not yield usable data: three returned `plugin request timeout (method=get_design_context)`; another was stopped by the server's temporary circuit-breaker. One diagnostic `list_files` was also blocked by that temporary pause. No restart/reconnect/configuration change or repeated retry loop was performed. These are plugin-request timeouts, **not** the old missing-schema condition or official MCP Starter quota. Previously captured D/T/M screenshots and the exact successful reads above remain available; the remaining properties are not treated as recovered.

After the pause, a subsequent diagnostic `list_files` succeeded with `files:[]`: the transport/tool is reachable, but no open plugin file is currently exposed to this parent. This is not the former missing-schema failure, and does not justify another gateway restart.

1. Keep localized not-found and catch-all real HTTP404 semantics. Installed Next16.4.3 not-found convention documentation was read: pre-stream404 versus post-stream200 must be verified in production. No global-not-found flag or routing strategy change is needed for this increment.
2. Apply the explicit Footer composition above only within the404 increment; test all normal routes as well as error routes. No global CSS hide.
3. Motion search found no canvas notes; the subsequent direct clarification above now owns the timing/continuity decision. Do not keep asking the owner to reconfirm the already authorized animation.
4. Keep page/artwork markup server-rendered. A narrowly scoped motion lifecycle island may opt into CSS ring animation after checking preference, finish permanently before5sec and stop on a mid-intro reduced-motion change. It must not restart on rerender/resize, add a whole-page client root or animate readable text. No-JS starts static.
5. Do not add pause UI or infinite animation: the clarified one-shot contract does not call for them. Compact type/artwork input is now supplied by the designer; compare the rendered implementation against that accepted snapshot without claiming a fresh live Figma read or owner acceptance.
6. Page-specific EN/RU/SR labels/content stay at their semantic owner; RU/SR drafts require approval before publication. Preserve existing not-found localization/status tests when adopting new copy; update assertions to the new approved heading rather than retaining obsolete visible text just to keep tests green.

## Work order / acceptance

- Finish remaining exact scoped D/T/M reads, source/content contract and chrome/motion decisions.
- Build thin server page + meaningful NotFound widget/artwork boundary, fluid geometry and justified stacked/split composition transition. No fixed-height page clipping.
- Verify actual unknown nested routes and unsupported locales against production, including the framework fallback scope.
- EN/RU/SR at reference/intermediate/boundary widths; keyboard recovery links, shared Header modal/language/scroll lock, reduced motion, pause if present, no overflow or animation layout shifts.
- Add focused unit/E2E contracts; lint/types/build; production browser captures with source/build identity. Compare static/reduced-motion render to current Figma, test actual radar behavior separately.
- Save `docs/qa/not-found/README.md`, update page registry/roadmap with actual results and remaining release limits. Do not mark this new404 implemented before those artifacts/behavior exist.
