# Home QA evidence — current implementation

## Scope and sources

Home and its shared Header/Footer/navigation only. Work remains on `development`; no commits, staging or deployment were performed. Other page routes remain real 404s until implemented.

Fresh read-only Figwright inspection was available again for this QA pass: Home Desktop `1:22`, Tablet `55:439`, Mobile `57:3038`, plus scoped native Mood, Custom/Extras, Meet and mobile Weddings service. These are the accepted mock/layout baseline, not production approval. Historical reference PNGs and superseded numeric board rules were not used to override the targets.

The mobile Weddings panorama exception is now recorded in `../../design/home-asset-map.json` with its exact instance/source node. The native source is Home08, clipped in `I57:3053;93:2259;86:2331`.

## Actual execution

`npm run check` passed on the captured source:
- ESLint with zero warnings;
- route type generation and TypeScript;
- 6 unit tests;
- production build, prerendered EN/RU/SR;
- 50 production Playwright checks.

After adding explicit header/footer language-disclosure outside-click coverage, the full `npm run check` was repeated successfully: lint, typecheck, 6 unit tests, production build and **54 Playwright checks**. This subsequent change added tests only; the rendered source in the saved captures is unchanged.

Playwright now uses two workers. Eight simultaneous Chromium tests caused CPU-contention timeouts during viewport sweeps; reducing concurrency passed the complete suite without weakening assertions or extending timeouts.

The container needed the existing trusted `SWC_NATIVE_BINDING_CACHE=/opt/ola-swc-native-cache` environment setting. This is an execution-environment constraint, not a site runtime dependency or a new project configuration flag.

## Rendered evidence

`capture-manifest.json` records exact build ID, source SHA-256, capture time, route/locale/viewport, section measurements and runtime errors. The captured production build is `nGuc3tXyO00QcdzFSFUu_`. Twelve PNGs include all three locales at 1440/768/360, desktop locale disclosure, mobile navigation and the last Mood link with keyboard focus. No page errors were captured. Source files were not changed during capture.

Photos were decoded before capture, and scrolling/repaint completed before saving screenshots. The temporary production QA server used port3120 and was terminated by the capture script; it did not take over the user's port3000.

Desktop main-section heights match the native references within browser rounding. Mobile Hero/Services/Custom/Meet/Events match their native reference heights; Mood differs by approximately1px. The 44px Mood link hit areas extend into existing noninteractive whitespace without moving the 21px visible caption; end-link focus was visually inspected and is not clipped. Tablet retains small content-flow differences; no total page height is forced to match a Figma snapshot.

## Review boundaries

- Independent spec review: PASS, with stale README and missing responsive-source traceability findings subsequently addressed.
- Independent code-quality review: PASS from verified `gpt-6-luna` (delegation `deleg_86c2df81`), based on read-only source/test inspection, not an additional test execution. No important defects found. Its minor suggestion for explicit language-disclosure outside-click coverage is now implemented and tested in both header and footer. The earlier quota-interrupted review remains incomplete and is not counted as a PASS.
- Independent screenshot-based visual review: PASS from `gpt-6-luna` (`deleg_7b0e3567`), with no important visual defects found at1440/768/360. That child could not retrieve Figma nodes, so its verdict is not an independent node-by-node Figma measurement comparison; the lead's fresh scoped comparison is separately described above. No production/owner approval is implied.
- The existing Lead Designer could not access the frontend container's evidence paths. Under the user's current workflow, routine visual reviews belong to spawned subagents, not existing teammate profiles. There is no claimed Lead Designer acceptance and no need to change environment mounts or request routine review from that profile.
- This is not a WCAG certification, screen-reader audit, complete SEO acceptance, remote CI run or Vercel deployment.

## Remaining product/release inputs

Approved RU/SR content and accessibility labels, real WhatsApp/Instagram destinations, final image/rights approval and domain/SEO data remain owner inputs. Enquiry controls intentionally stay unavailable with a translated explanation. Mood routes currently lead to the catalogue root; the accepted associations are Soft & Romantic → Soft Romance, Bright & Joyful → Sunset, Natural & Airy → Natural & Airy. Stable targets should be wired when those catalogue sections exist; do not invent product slugs or resolve the held catalogue-card action policy.
