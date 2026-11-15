# OLA-BQ-INTAKE-002 continuation — partial verified export

This supplements, does not erase, the original failed attempt in `partial-evidence.md`. Engineer report delivered as `94b39e731bf20ab827d2422d823556582d20f7b65dd06a8119a5fece79fc76c8`: Figwright server resolves outDir on host, not Docker; `/workspace` absent there. This attribution is to the engineer, not an independent host inspection. Bound OLA `id-mwg48w7s-pk38p8wa`; corrected export outDir `/home/viktor/Projects/ola_project/docs/design/bouquets-intake-completion/native-fills` succeeded. Docker `/workspace/docs/design/bouquets-intake-completion/native-fills` readback SHA1 matched each native imageHash and matching public bytes; JPEG dimensions checked using `file`. No permissions, connections or Figma canvas changed. Export failure cause is resolved, not all intake work.

## Image identities verified in this continuation

24 card IMAGE leaves (8 D, 8 T, 8 M) returned the same eight respective hashes in each ordered state. Their leaf IDs and native geometry are in `native-{desktop-inspiration,tablet-grid,mobile-grid}.json`. Order and public path/hash:

| Visible title | public/assets/images/bouquets/ | SHA1 |
|---|---|---|
|Soft Romance|03_soft_romantic.jpg|5fa6e3885b55a510a258674f247ce2e311d448ec|
|Natural & Airy|04_natural_airy.jpg|07d71f24a4028cccf664d3d54fa3c88924b2bb76|
|Peachy Mood|05_bright_joyful.jpg|8acc1d6f1383908c5691ca9037f16969516989de|
|Wild Beauty|06_statement.jpg|21963ab68f727443a7374521d76c2b711d7764bf|
|Sunset|07_sunset.jpg|c9f1ebabc27c6e3965ab969aec101f3ec956d697|
|Lavender Haze|08_lavender_haze.jpg|f54a9f2e9941ce3d03e874d83139b963e5c3896f|
|Garden Style|09_garden_style.jpg|dc980255cfb1cfe9b3ceecc2f4bd403751f860c0|
|Natural Beauty|10_natural_beauty.jpg|0f4a055e7fdc3b9acb6db2c4eff4e6546961b4bf|

Five selector leaves in each of D/T/M also exported: All→02_bouquets_all.jpg SHA1 `7364248d1c42c7c6844b0d8f15c2cd71137cc6e5`; Soft→03; Bright→05; Natural→04; Statement→06. These visual associations are not product/action mappings. Tablet leaves `I106:4523;106:4378;106:4736`, `I106:4527;106:4381;106:4738`, `I106:4531;106:4384;106:4742`, `I106:4535;106:4387;106:4740`, `I106:4539;106:4390;106:4744`. Mobile leaves `I106:5096;106:4825;106:4985`, `I106:5101;106:4829;106:4987`, `I106:5105;106:4833;106:4991`, `I106:5109;106:4837;106:4989`, `I106:5113;106:4841;106:4993`. Desktop IDs in partial evidence. Thumbnail T 64×72; M 48×56. T All 704×96, other selectors 340×96; M All 320×84, other selectors 152×84. Geometry snapshots only; compact style/crop ancestors still need full contextual check.

Eight T/M seasonal leaves share original `12_bouquets_seasonal.jpg`, SHA1 `928ad69cf35cccd414d812d059f7350fdc366649`, SHA256 `d2343a92083ed9544ad06f0ba2822f2a95fa2da29e82112242ecb752e788937a`, 1800×1335. Their full individual IDs: `I106:4655;106:4435;106:4704`, `I106:4662;106:4441;106:4704`, `I106:4669;106:4447;106:4704`, `I106:4676;106:4453;106:4704`, `I106:5233;106:4943;106:4999`, `I106:5240;106:4950;106:4999`, `I106:5247;106:4957;106:4999`, `I106:5254;106:4964;106:4999`. Crop geometry in `partial-evidence.md`; desktop Spring was historically verified by the parent and the remaining three desktop leaves `I106:4271;106:4250;106:3905`, `I106:4278;106:4252;106:3905`, `I106:4285;106:4254;106:3905` were subsequently exported and returned the same SHA1, dimensions and FIT mode. The same exported file had already been read back and matched to the public file.

Tablet/mobile Hero leaves `I106:4375;106:4708`, `I106:5094;106:4995` match historically checked 01 hero `85c6c670447218ff528785771992af4259630b28` (2400×1958); custom `I106:4683;106:4706`, `I106:5226;106:4997` match historically checked 11 custom `401fa4aa10b6d932bd32cffbad8ce71412e3709d` (2000×1534). Both FILL: T photo rectangles 768×500 and 704×380 respectively; M 360×360 and 320×300; inner rectangles match instance bounds (0,0), no instance clipping. Full ancestor/paint crop and desktop responsive text check remains.

## Remaining and gates

This is not an implementation-ready complete map. Finish clip/source-bound arithmetic and complete card/compact selector/editorial styles and exact responsive copy. No arbitrary crop, asset substitution or product identity inference. Existing P01 eight actions OWNER HOLD separately; presentation-only disabled non-public preview is newly authorized under the exact restrictions and provenance in `proposed-taskcards.md`; no slugs or filtering. Existing Home Mood and Statement anchor contract unchanged. Hero/custom/seasonal may become independently ready once their material checks are complete. UI build/browser/tests and actual Supervisor Sol review are future integrated-work gates, not performed in this intake.
