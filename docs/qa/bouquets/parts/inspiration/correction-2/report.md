# Correction B2 — selector intrinsic reflow

## Diagnosis and scope
B1's caption correction was confirmed, not a failed selector fix. The executor discovered a separate pre-existing selector defect before Supervisor: two zero-minimum grid tracks and `span {min-width:0}` left only 50px of text at 320px despite actual RU words requiring 111/108px. Even EN320 `Statement` overran its tile; baseline text Range checks caught that too. The original production build was `a7KJXw8kRy7HqayVAZyn8`. The regression probe exited 1, five of 15 cases failed: EN320, RU320/360/375, SR320. Full measured ranges are in `baseline.json` and `baseline.log` (SR360's range remained inside its tile despite overflowing its span).

Selector-only CSS replaces grid with wrapped flex items, preferred half-width and min-content floors, full-width All until the existing 1200px composition, then preferred fifths. Singleton rows grow. Thumbnails, font, copy, order, anchors and card grid are unchanged; no JS measurement or new breakpoint. The right interior padding is 9px rather than 12px to accommodate the real 72px EN `Statement` word in the 152px reference tile, while retaining image/text left positions and tile geometry. First intrinsic attempt with symmetric 12px padding passed text-bound checks but incorrectly stacked EN360's last two controls; `attempt-1.json` preserves this composition failure. One refinement, not a second successful first attempt, restored the required reference composition. No word breaking or clipping.

## Observed selector row item counts
Each sequence starts with All; five labels total. Fallback reflects actual word floors, not a designer requirement for localized pixel matching.

|locale|320|360|375|768|1440|
|---|---|---|---|---|---|
|EN|1/1/2/1|1/2/2|1/2/2|1/2/2|5|
|RU|1/1/1/1/1|1/1/1/1/1|1/2/1/1|1/2/2|5|
|SR|1/1/1/1/1|1/1/2/1|1/2/2|1/2/2|5|

EN reference tile maximum rect delta from baseline: 0px at 360 and 768, 0.015625px at 1440. Captures `baseline-en-{360,768,1440}.png` and `final-en-{360,768,1440}.png`; native reference files are in `../native-ref/`. RU320 and SR360 final selector regions visually inspected at native scale: complete words readable, images and labels contained; EN360 inspected too. This is not a universal pixel-match claim or translation approval.

## Checks and provenance
Final build `mBL5k2YRLwPEm-_7Kl0ur`, source SHA-256 `source-sha256.txt`; configured lint, typecheck and build each exit 0 (`final-*.log`, `exits.log`). `node .../probe.mjs final` exit 0: 15 actual production page locale/width cases, five selector targets, focus, text Range tile/viewport containment, thumbnail containment, sibling non-overlap, 48px target minimum, eight disabled described card buttons without links, compact two-column cards and >=150px captions plus synthetic natural growth. `node .../anchors.mjs` exit 0: 75 actual keyboard Enter activations; not a full accessibility audit. Capture and full measured geometry: `final.json`, `final-*.png`. Lint rerun after adding proof script passed. Baseline RED was run against the stated build before source change, final GREEN after rebuild. Only task-owned prior server and children were stopped before rebuilds; stale assets were not used. No query added, so no new media-query neighbor boundary to test; intrinsic transitions are content-driven.

Limits: no full-site/integrator or independent Supervisor gate; actual Sol Supervisor on final assembled page remains required. Full crop parity, P01 action destination, rights, locale semantic approval and release remain pending. No acceptance or release claim. Widget ready_for_integrator subject to those gates.

Quality lesson: check rendered text Range / longest whole-word intrinsic floor against the actual tile, not merely span scroll width or card caption geometry; a passing caption fix does not establish selector containment.
