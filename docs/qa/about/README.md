# About — frontend preview verified

The first integrated About route renders in EN/RU/SR. Parent executed `npm run check`: lint, typecheck, six unit checks, production build and 68 Playwright checks passed. Those checks did **not** establish visual acceptance.

Parent captured actual production screenshots in `initial-en-1440.png`, `initial-en-768.png`, `initial-en-360.png`, `initial-ru-360.png`, `initial-sr-360.png`. `initial-manifest.json` records the actual build, routes, widths, section geometry and out-of-bounds text measurements. These are retained initial evidence, not final screenshots.

## Corrected implementation

After reviewing the actual initial renders, the parent corrected the desktop Story grid/typography, native full-bleed Hero fade, responsive heading breaks, paragraph separation, centered desktop Style copy and mobile CTA. The native mobile CTA copy frame68:3736 is **ink `#241E1B`**, not wine; its pale text is now readable on the correct dark surface. Page-level overflow masking is removed.

The first correction worker's verification was incomplete. Parent rebuilt production before retesting; geometry assertions then passed, exposing an invalid test selector that expected an unscoped CSS Module class. The CTA assertion now targets the semantic heading's actual parent, without weakening the color/geometry requirements.

Current integrated `npm run check`: lint/typecheck, six unit checks (including common/Home/About dictionary parity and Serbian Latin), production build and **74 Playwright checks passed**. Nine current EN/RU/SR screenshots at1440/768/360 are recorded in `capture-manifest.json`: build `USK6Pryq2l0fVz_nA-D_u`, source SHA-256 `acf42ea0b1fffd09d9bf7f3d27ffb42fd75f385cbc83d01f951ce5431e44340f`. All returned200, no page errors or measured out-of-bounds text were found, and main overflow is visible. These captures were generated only after the final source edits; initial captures remain separately named.

Desktop Hero/Story/Principles/Style/CTA and tablet Hero/Story/Principles/Style/Why/CTA match reference section heights; mobile Hero/Story/Principles/Why/CTA match. Desktop Why has a small browser-flow difference, and mobile Style's body wraps differently. Total page heights are not forced to equal Figma snapshots. Fresh scoped native reads and actual rendered images—not the passing tests alone—ground these observations.

Independent own-subagent spec/visual review (`deleg_591fb13d`, ordinary Luna6) returned **PASS** against recorded native references, the plan/asset map and current screenshots, with no clear high-impact layout defect. That reviewer could not resolve/export the supplied live Figma node IDs in its session, so this is explicitly **not** an independent live pixel-parity certification. Parent fresh scoped reads and reviewer screenshot inspection are separate evidence sources.

Subsequent independent code-quality/integration review (`deleg_f71eb1c7`, ordinary Luna6) returned **PASS**, with empty security-concern and logic-error lists. Its nonblocking suggestion was to supplement the current exact CTA color regression assertions with a calculated contrast-ratio assertion. No source changes resulted from either review. Parent verified all nine manifest/file pairs and confirmed the temporary capture server had stopped. About is complete for the current frontend-preview scope; neither these checks nor reviewer output constitutes owner/Lead Designer production approval, a WCAG certification or a deployment.

## Retained initial visual findings

Compared with fresh native About Desktop67:3045, Tablet67:3399 and Mobile68:3655:

- Desktop Story incorrectly inset its photograph by80px and stacked its botanical/signature below the narrative, instead of native flush-left photo + separate narrative/botanical columns. Measured Story height636.65625px versus the560px reference.
- Desktop Hero did not use the native full-bleed photo placement/crop.
- Mobile final CTA rendered its pale copy against a pale background, making it effectively unreadable. Passing DOM-presence checks did not catch contrast.
- The360px typography override reduced headings below the approved32/34 reference without justification; responsive line breaks also drifted.
- The root page used `overflow:hidden`, masking layout problems and potentially clipping focus. Clipping belongs to intentional photo viewports, not the entire page.
- Minified TSX/CSS made review and maintenance unnecessarily difficult.

These findings describe the retained initial evidence, not the current captures. They were addressed through bounded correction work plus parent review, fresh native reads, integrated verification and the independent reviews recorded above.

Shared Header's native About tablet context label was separately implemented from Figma instance `I67:3554;67:3369` (Manrope50013/18, underline), without viewport JavaScript or a client page boundary. Its initial missing-label regression was observed failing, then passed after integration. Home and mobile chrome remain unchanged.

All eight About image identities/dimensions were verified against native IMAGE fills before UI; see `../../design/about-asset-map.json`. EN mock copy and RU/SR drafts do not imply final owner content approval. Contacts remain explicitly unconfigured, and no public deployment is authorized.
