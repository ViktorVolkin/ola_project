# EN 360 mobile gap budget — incomplete, not visual acceptance

Source-frozen private build `kMwe9Sie3vsci31eSnOUx`; pristine browser `browser-blocks.json`, `pristine-360.png`, and individual crops. Native `recovered/native-mobile-nodes.json`, page frame `113:6259` canvas (80,80); native coordinates below are *frame-local* (= canvas y − 80), compared to browser document y. Native excerpt captures viewed read-only: `114:6471`, `114:6490`, `114:6491`, `114:6500`, `114:6501`; browser crops have matching names. Native footer `116:4775` is present. No whole-page pixel equivalence asserted.

| Block | Native y / h | Browser y / h | Difference and qualification |
|---|---:|---:|---|
| Intro frame | 80 / 306 | section starts 80; breadcrumb 112, h1 156, body ends 384 | Native breadcrumb y100, h1 y134, body ends y362; browser content starts later; native intro ends y386, gallery begins immediately. Browser section uses different frame composition. |
| Gallery image + thumbnails | 386 / 376 (400 frame including 24 bottom padding) | 408 / 376 | Same internal 300+16+60 geometry, but starts +22. Browser gallery bottom 784 +24 grid gap -> controls 808; native frame ends 786. |
| Enquiry parent | 786 / 1596 | controls 808 / 1457.875 | Different composition: native parent includes 24 top/bottom padding; browser controls excludes both. |
| Fullness | 810 / 218 | 808 / 187.156 | Starts −2; native heading/helper 64, row 138; browser fieldset 187.156 incl row 115.156. Native selected card 96×138, image 90×88, caption row 90×44; browser selected card 115.156 high, caption 24. |
| Extras | 1052 / 336 | 1019.156 / 275.719 | Native wrapped row 304 (two 144px rows, 16 gap), browser row 251.719. Native cards 152×144, image 148×96 and caption 44; browser cards 117.859 high. Native unchecked square markers visible; browser crop `browser-extras-360.png` has no visible markers. This is a real visual defect, not merely paragraph wrapping; interactions were not changed. |
| Date | 1412 / 76 | 1318.875 / 75 | −93.125 at top; heights differ 1. |
| Message | 1512 / 124 | 1417.875 / 138 | −94.125 at top; browser textarea makes block 14 taller. |
| Actions | 1660 / 152 | 1579.875 / 140 | −80.125 at top; native button 320×48, back row 44 and reassurance 36 with 12px gaps; browser button width 258, different vertical layout. Native `114:6500` vs `browser-actions-360.png`. |
| Information | 1836 / 278 | 1743.875 / 278 | −92.125 at top; block height matches. |
| Botanical band | 2138 / 220 | 2045.875 / 220 | −92.125. 320×220 and 24px gap after information agree. No artificial offset added. |

Native gap sequence inside enquiry: 24 padding, 218, 24, 336, 24, 76, 24, 124, 24, 152, 24, 278, 24, 220, 24 bottom. Browser sub-block geometry above derives directly from the initial DOM; mismatched wrapper boundaries are not treated as identical elements. Intro typography matches measured sizes but breadcrumb height/top and intro/gallery flow differ. The earlier −122.46875 measurement predates the typography change and is not the current gap.

Disposition: Native controls exhibit specific card height/image/caption and visible-checkbox differences, plus action geometry; not attributable to paragraph-flow ambiguity alone. These were discovered after the bounded Intro/Footer changes and are NOT fixed or declared accepted. The card's permission for narrow preference CSS is not sufficient to claim state/visual preservation without new interaction and native state evidence; Lead should explicitly route the remaining specific control visual fixes before Supervisor review. No other missing section/control assertion is made without inspection. Saved D/T/M full browser captures are available; native inspection above is partial, not a fresh whole-page comparison.
