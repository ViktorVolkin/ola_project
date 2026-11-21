# Actions / command record

- Baseline `npm start -- -p 3217` from existing build `a7KJXw8kRy7HqayVAZyn8`; `node docs/qa/bouquets/parts/inspiration/correction-2/probe.mjs baseline` exit 1 (real text Range failures; baseline.log/json).
- CSS intrinsic flex reflow attempt 1: `npm run lint`, `npm run typecheck`, `npm run build` exit 0; after probe exit 0 but EN360 measured composition violated reference, so attempt rejected (`attempt-1.json`).
- Adjust trailing selector inset from 12px to 9px to fit the EN reference word without changing tile, image, text start, type or thumbnail; rerun configured lint/typecheck/build all exit 0. Before each build, stopped only this task's own Next server and children; `ps` returned no remaining listed children.
- `node docs/qa/bouquets/parts/inspiration/correction-2/probe.mjs final` exit 0; `node docs/qa/bouquets/parts/inspiration/correction-2/anchors.mjs` exit 0; `npm run lint` again after adding probe exit 0. See logs and report. Final build ID and source hashes are separate files.
