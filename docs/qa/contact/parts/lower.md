# Contact lower block — implementation handoff

## Integration contract

- Export `ContactLower({c}: {c: ContactMessages})` from `src/components/widgets/ContactBlocks/ContactLower.tsx`; `ContactMessages` is `typeof` the EN JSON via a type-only import. Integrator must expose/import this export from the assembled ContactBlocks entry point. No route or shared files changed here.
- Server composition renders four process steps, `contactImages.editorial` and the localised caption, and passes all seven unmodified question/answer pairs to `ContactFaq`. Only `ContactFaq.tsx` is a client island. Its props are `items: {question: string; answer: string}[]`.
- Files: `ContactLower.tsx`, `ContactLower.module.css`, `ContactFaq.tsx`, `ContactFaq.module.css`, and this report.
- No new shared primitive or message fields required. The photo is decorative (`alt=""`); caption is real localised text on a separate ivory surface. The supplied image and copy remain subject to their existing approval status.

## Local checks

- `npx eslint --max-warnings=0 src/components/widgets/ContactBlocks/ContactLower.tsx src/components/widgets/ContactBlocks/ContactFaq.tsx`: exit 0, no output.
- Node assertions: all EN/RU/SR files contain seven nonempty FAQ pairs and four process pairs.
- React server static rendering of two FAQ instances: 14 buttons, two initially expanded, 12 hidden panels, 14 distinct panel IDs, first answer rendered. This checks server markup, not browser hydration or interaction.
- CT03 local SHA-256: `4712be0e6e30b38d44407b24d5c7dc092a7ebc148ea674068ce6dbab38631904` (local identity only; not a fresh design-source identity).
- Reference image calculations, intrinsic 1200×1328: D viewport 352×480, image 495×547.80 at (-71.5, 0); T viewport 280×400, image 421×465.91 at (-70.5, -6); M viewport 320×340, image 425×470.33 at (-52.5, -58). CSS uses centered proportional widths and overflow clipping; numbers are calculations, not browser measurements. Caption is outside the crop.

## Revision OLA-CONTACT-001-C-fix1 — CT03 crop

- Integration's existing `/en/contact` 320 screenshot (`integration/en-320.png`) exposed the baked filename band: the former 280×340 crop used an approximately 371.9×411.4 image at (-45.9, -58), leaving only about 13.4px below the crop. The earlier calculations above checked image bounds, not the baked band; they did not establish visual correctness at 320.
- Source inspection: CT03 is 1200×1328; the bottom photo transitions to the pale filename strip around source y=1184–1190. Calculations conservatively protect from y=1180. CSS now retains each original proportional width but applies a height-derived minimum width at each breakpoint; the image remains centered, proportional, and clipped, without changing crop height, asset, caption or markup. At browser width 320, expected crop 280×340, image 408×451.52 at (-64, -58); source y=1180 falls 3.2px below the crop. These are calculations, not fresh browser measurements.
- Local Python geometry sweep at every integer browser width 240–3000, using the existing container gutters/grid and all three CSS branches: width coverage held, source y=1180 remained below the crop (minimum 3.067px at 640); explicitly checked 639/640 and 1199/1200 neighbors. At 360, 768 and 1440, calculated image widths remain respectively 425, 421 and 495px with original positions/heights. Breakpoint changes in composition remain as before; this is not a claim of continuous geometry across breakpoints. Translation-driven text height and caption remain unconstrained by these image rules.
- No fresh browser run, build or server was launched for this revision; integrated visual, fractional viewport/DPR, locale growth and interaction checks remain open. The calculations are not a substitute for real-page acceptance. No TSX, FAQ or other shared files changed in this revision.

## Integrator verification still required

- Wire the export and run project-level typecheck/build and real browser checks after parallel assembly; none was run here. Validate 1440/768/360 and intermediate widths, exact crop and layout against approved capture, and long RU/SR content without overflow. Heights are content-driven, not fixed snapshots.
- Test keyboard Tab/Shift+Tab, Enter/Space, independent multi-open and collapse-all, visible focus, unique controls and hidden panels in accessibility tree, hydration, no-JS first answer, and multiple instances in the assembled page. No visual or final acceptance is claimed.
