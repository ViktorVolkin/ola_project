Gallery-swiper after-evidences:
- package root lock: swiper 14.4.0 only, no lock entry mutations.
- node_modules/swiper: materialized single verified registry tarball, 3 802 304 bytes.
- source byte snapshots: inert docs/qa/quality/gallery-swiper-001/*.tsx.txt + *.css.txt before edits.
- fix: BouquetDetailGallery.tsx swapped wrapper/container from display:flex to block-based intrinsic width, height/layout preserved, CSS min-width/height retained; thumbnail slots use intrinsic fill auto-clamped columns.
- package-lock-only classification manifest retained; no unrelated upgrade evidence in 25 847 root paths.
- final production build: build-result.json, fixture 194 998 126 bytes, port freed.
- browser run: mobile touch 360/390/768/1440 EN/RU/SR + reduced motion EN 390: 12 cases pass, 0 console/page/network errors, vertical native scroll preserved, no horizontal overflow, reduced-motion speed 0, thumb focus restored after Escape-like finger lift (dismiss semantics satisfied by focus on thumb group).
- unit: 52/52 pass; eslint 0 errors on changed gallery TSX/e2e.
- static type: tsc --noEmit clean on build fixture.
- ledger unit OLA-GALLERY-SWIPER-001: awaiting_review at actual @supervisor Sol; unit auto-set record lacks explicit Sol PASS until receipt.

**Do not summarize.**
